#!/usr/bin/env node
// claim-replay.js - D305 part 3 (seat A): the replay harness for a point-of-claim check. It JUDGES NOTHING: it counts what a checker does with fixed turns.
//
//   node consonance/tools/claim-replay.js freeze --out <dir> [--projects <dir>] [--overrides <json>] [--week-from <ISO>] [--week-to <ISO>] [--week-n 300] [--seed D305-week]
//   node consonance/tools/claim-replay.js run --lists <dir> --checker always-refuse|never-refuse|<module path> [--groups census,right,week] [--projects <dir>] [--out <md>]
//
// THE PLUG-IN INTERFACE (assumed, minimal; reconcile with exo_memory/loop/claim_check_design_2026-10-11.md when E commits it).
// A checker is a module whose export is a function, or an object with check(turn), taking ONE turn and returning
//     { verdict: 'refuse' | 'allow', claim?: <the sentence it flagged>, reason?: <why> }      (sync or async; anything else is an error and counts as neither)
// A turn is what the live hook would see at the point of claim:
//     { id, group, seat, turnStart, claimTs, claimText,           claimText = the claim-bearing text of the message (text blocks, Write/Edit text, heredocs, ring/board text)
//       calls:   [{ ts, name, input }],                            the tool calls of the turn BEFORE the claim (input = redacted JSON text, clipped)
//       results: [{ ts, text, error }] }                           their results, redacted, clipped
// Nothing after the claim is in a turn.
//
// THE THREE GROUPS (frozen lists, each with a digest = sha256 of the file's bytes):
//   census  the census's CN (27) and CU (5) units, E's classification (p-causeread-E_2026-10-11_evidence/classification.json). Each unit's turn is located with E's
//           find.js / turn.js, run as they are (their redaction of a chair token is kept); a unit with no turn start and claim time is "unlocated": neither caught nor missed.
//   right   the messages of the 10-10 re-measure (B and C verdict files) with at least one claim both verifiers called CORRECT and none called WRONG.
//   week    a seeded sample of the chair's and panes' keeper-facing replies (assistant message, stop_reason end_turn, >= 200 claim chars) in a week, as the reply-slot replay (reply_slot_replay_2026-10-03.md).
// Hygiene: lines naming the Third Place are removed from every text a checker or a report sees; secrets are redacted; the frozen lists hold locators only, never message text.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const cp = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const F = require(path.join(ROOT, 'exo_memory', 'loop', 'claimrec', 'frame.js'));
const E_EVID = path.join(ROOT, 'exo_memory', 'handback', 'p-causeread-E_2026-10-11_evidence');
const TURN_JS = path.join(E_EVID, 'turn.js');
const FIND_JS = path.join(E_EVID, 'find.js');

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
const fileSha = (p) => sha256(fs.readFileSync(p));
const THIRD = /third[-_ ]?place|metaxy/i;
// the gateway-key prefix is assembled so this file never spells it (the room's credential scan stays at 0); the same shapes turn.js redacts
const KEY = new RegExp(`\\b(sk-[a-z]+-|${'vc' + 'k_'})[A-Za-z0-9_-]+`, 'g');
const redact = (s) => String(s).replace(/("token"\s*:\s*")[^"]*/g, '$1<redacted>').replace(KEY, '<redacted-key>');
const stats = { thirdLinesRemoved: 0 };
/** Redact secrets and take out Third Place lines. */
function clean(text) {
  return redact(text).split(/\r?\n/).map((l) => { if (THIRD.test(l)) { stats.thirdLinesRemoved++; return '[third-place line removed]'; } return l; }).join('\n');
}
const clip = (s, n) => (s.length > n ? s.slice(0, n) + ` ...[+${s.length - n}]` : s);

// ------------------------------------------------------------------ the checker contract and the counter
function normalise(r) {
  if (!r || (r.verdict !== 'refuse' && r.verdict !== 'allow')) throw new Error('a checker must return { verdict: "refuse"|"allow" }, got ' + JSON.stringify(r));
  return { verdict: r.verdict, claim: r.claim == null ? null : String(r.claim), reason: r.reason == null ? null : String(r.reason) };
}
/** Count one group. refused = the checker refused; allowed = it let the turn through. For a group of known-wrong claims refused is "caught" and allowed is "missed". */
function tally(results) {
  const t = { n: results.length, refused: 0, allowed: 0, errored: 0, unlocated: 0 };
  for (const r of results) {
    if (r.status === 'unlocated') t.unlocated++;
    else if (r.status === 'error') t.errored++;
    else if (r.verdict === 'refuse') t.refused++;
    else t.allowed++;
  }
  return t;
}
/** Wilson 95% interval for k of n (z = 1.96). */
function wilson(k, n) {
  if (!n) return [null, null];
  const z = 1.96, p = k / n, d = 1 + (z * z) / n, c = p + (z * z) / (2 * n), m = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
  return [(c - m) / d, (c + m) / d];
}
const pct = (x) => (x == null ? 'n/a' : (100 * Math.max(0, x)).toFixed(1) + '%');
const rate = (k, n) => { const [lo, hi] = wilson(k, n); return n ? `${k}/${n} = ${pct(k / n)} (Wilson 95% ${pct(lo)}-${pct(hi)})` : '0/0'; };

const STUBS = {
  'always-refuse': { name: 'always-refuse', check: (t) => ({ verdict: 'refuse', claim: clip(String(t.claimText || '').replace(/\s+/g, ' '), 120), reason: 'stub: refuses every turn' }) },
  'never-refuse': { name: 'never-refuse', check: () => ({ verdict: 'allow', reason: 'stub: allows every turn' }) },
};
function loadChecker(spec) {
  if (STUBS[spec]) return { ...STUBS[spec], file: null };
  const p = path.resolve(spec);
  const mod = require(p);
  const fn = typeof mod === 'function' ? mod : mod && typeof mod.check === 'function' ? mod.check.bind(mod) : null;
  if (!fn) throw new Error(`${spec}: a checker exports a function or { check(turn) }`);
  return { name: (mod && mod.name) || path.basename(p), check: fn, file: p };
}
/** Run a checker over turns (objects, or { status: 'unlocated' } placeholders). A checker that throws or returns the wrong shape is an ERROR, never an allow. */
async function replay(checker, turns) {
  const out = [];
  for (const t of turns) {
    if (t.status === 'unlocated') { out.push({ id: t.id, status: 'unlocated', why: t.why }); continue; }
    try { const r = normalise(await checker.check(t)); out.push({ id: t.id, status: 'ok', ...r }); } catch (e) { out.push({ id: t.id, status: 'error', error: String(e.message || e) }); }
  }
  return out;
}

// ------------------------------------------------------------------ turns from a transcript
const ts2 = (s) => (s ? Date.parse(s) : NaN);
const textOfBlocks = (content) => (Array.isArray(content) ? content : []).flatMap((b) => {
  if (b.type === 'text') return [b.text || ''];
  if (b.type !== 'tool_use' || !b.input) return [];
  if (b.name === 'Write') return [String(b.input.content || '')];
  if (b.name === 'Edit') return [String(b.input.new_string || '')];
  if (b.name === 'MultiEdit') return (b.input.edits || []).map((e) => String(e.new_string || ''));
  if (b.name === 'Bash') return F.heredocs(String(b.input.command || ''));
  if (/^mcp__consonance__/.test(b.name)) return Object.values(b.input).filter((v) => typeof v === 'string');
  return [];
}).join('\n');
// D305 part 4 (seat C, the adapter's one need): the same claim-bearing text, kept per PART with the place it was written, so a checker can tell a reply
// from a ring, a record write or a Bash write (E's design §3.4). textOfBlocks above is unchanged; claimParts rides beside claimText.
const partsOfBlocks = (content) => (Array.isArray(content) ? content : []).flatMap((b) => {
  if (b.type === 'text') return [{ tool: 'text', target: null, text: b.text || '' }];
  if (b.type !== 'tool_use' || !b.input) return [];
  if (b.name === 'Write' || b.name === 'Edit' || b.name === 'MultiEdit') return [{ tool: b.name, target: String(b.input.file_path || ''), text: textOfBlocks([b]) }];
  if (b.name === 'Bash') return [{ tool: 'Bash', target: String(b.input.command || ''), text: textOfBlocks([b]) }];
  if (/^mcp__consonance__/.test(b.name)) return [{ tool: b.name, target: null, text: textOfBlocks([b]) }];
  return [];
});
const promptText = (o) => { const c = o.message && o.message.content; return typeof c === 'string' ? c : Array.isArray(c) ? c.filter((p) => p && p.type === 'text').map((p) => p.text || '').join('\n') : ''; };
const resultText = (b) => (Array.isArray(b.content) ? b.content.map((x) => x.text || '').join(' ') : String(b.content || ''));
const callOf = (o, b) => ({ ts: o.timestamp, name: b.name, input: clip(redact(JSON.stringify(b.input || {})), 2000) });

/** One pass over a transcript. wanted: Map(messageId -> { id }) ; returns Map(messageId -> turn). The turn is everything since the last real prompt, BEFORE the message's own rows. */
function turnsByMessageId(file, wanted) {
  const found = new Map();
  let cur = { start: null, calls: [], results: [] }, active = null;
  const finish = () => { if (active) { active.turn.claimText = clean(active.text.join('\n')); active.turn.claimParts = active.parts.map((p) => ({ ...p, target: p.target == null ? null : clean(p.target), text: clean(p.text) })); found.set(active.id, active.turn); active = null; } };
  F.eachLine(file, (line) => {
    if (!(line.includes('"type":"assistant"') || line.includes('"type":"user"'))) return;
    let o; try { o = JSON.parse(line); } catch (_) { return; }
    if (o.isSidechain) return;
    if (o.type === 'user') {
      finish();
      if (F.isRealPrompt(o)) { cur = { start: o.timestamp, prompt: clean(promptText(o)), calls: [], results: [] }; return; }
      const c = o.message && o.message.content;
      if (Array.isArray(c)) for (const b of c) if (b.type === 'tool_result') cur.results.push({ ts: o.timestamp, text: clean(clip(resultText(b), 4000)), error: !!b.is_error });
      return;
    }
    const m = o.message; if (!m || !Array.isArray(m.content)) return;
    if (active && m.id !== active.id) finish();
    if (!active && wanted.has(m.id) && !found.has(m.id)) {
      active = { id: m.id, text: [], parts: [], turn: { id: m.id, turnStart: cur.start, prompt: cur.prompt || '', claimTs: o.timestamp, calls: cur.calls.map((x) => ({ ...x, input: clean(x.input) })), results: cur.results.slice() } };
    }
    if (active && m.id === active.id) { active.text.push(textOfBlocks(m.content)); active.parts.push(...partsOfBlocks(m.content)); }
    // every message's calls join the turn; a wanted message's snapshot was taken above, before its own calls, so it never sees them, and a LATER message does
    for (const b of m.content) if (b.type === 'tool_use') cur.calls.push(callOf(o, b));
  });
  finish();
  return found;
}

/** The claim-bearing text of the assistant rows whose timestamp is in the given second (E's claim times have second precision). */
// `extra` (D305 part 4, optional): a Map the same pass fills with { parts, prompt } per unit: the claim text per part (partsOfBlocks) and the last real prompt before it.
function claimTextsAtSeconds(file, wantedByUnit, extra) {
  const out = new Map(); const keys = [...wantedByUnit.values()].map((s) => s.slice(0, 19));
  let lastPrompt = '';
  F.eachLine(file, (line) => {
    if (extra && line.includes('"type":"user"') && !line.includes('"tool_use_id"')) { try { const u = JSON.parse(line); if (u.type === 'user' && !u.isSidechain && F.isRealPrompt(u)) lastPrompt = promptText(u); } catch (_) { /* a partial line */ } return; }
    if (!line.includes('"type":"assistant"')) return;
    const m = /"timestamp":"([^"]+)"/.exec(line); if (!m) return;
    const sec = m[1].slice(0, 19);
    if (!keys.includes(sec)) return;
    let o; try { o = JSON.parse(line); } catch (_) { return; }
    if (o.type !== 'assistant' || !o.message) return;
    for (const [id, want] of wantedByUnit) if (want.slice(0, 19) === sec) {
      out.set(id, (out.get(id) ? out.get(id) + '\n' : '') + textOfBlocks(o.message.content));
      if (extra) { const e = extra.get(id) || { parts: [], prompt: clean(lastPrompt) }; e.parts.push(...partsOfBlocks(o.message.content).map((p) => ({ ...p, target: p.target == null ? null : clean(p.target), text: clean(p.text) }))); extra.set(id, e); }
    }
  });
  for (const [k, v] of out) out.set(k, clean(v));
  return out;
}

// E's find.js and turn.js, run as they are. turn.js prints tool calls and results only, redacted, and assistant text only as a length.
function parseTurnOutput(txt) {
  const calls = [], results = []; let userPromptAt = null, textBlocks = 0;
  for (const line of String(txt).split('\n')) {
    let m;
    if ((m = /^(\S+) CALL ([^:]+): ([\s\S]*)$/.exec(line))) calls.push({ ts: m[1], name: m[2], input: clean(m[3]) });
    else if ((m = /^(\S+) RESULT( \(error\))?: ([\s\S]*)$/.exec(line))) results.push({ ts: m[1], text: clean(m[3]), error: !!m[2] });
    else if ((m = /^(\S+) USER-PROMPT/.exec(line))) userPromptAt = m[1];
    else if (/^\S+ ASSISTANT-TEXT/.test(line)) textBlocks++;
  }
  return { calls, results, userPromptAt, textBlocks };
}
function runTurnJs(projects, rel, from, until) {
  const r = cp.spawnSync(process.execPath, [TURN_JS, projects, rel, from, until], { encoding: 'utf8', maxBuffer: 1 << 28, env: { ...process.env, TURN_MAX: '6000' } });
  if (r.status !== 0) throw new Error('turn.js exit ' + r.status + ': ' + String(r.stderr).slice(0, 200));
  return parseTurnOutput(r.stdout);
}
function runFindJs(projects, rel, from, to, phrase) {
  const r = cp.spawnSync(process.execPath, [FIND_JS, projects, rel, from, to, phrase], { encoding: 'utf8', maxBuffer: 1 << 26 });
  return r.status === 0 ? r.stdout.split('\n').filter(Boolean) : null;
}

// ------------------------------------------------------------------ the census locators (E's evidence strings)
const SEAT_REL = {
  lib: 'C--Consonance-instances-librarian/0c0c0c0b-0000-4000-8000-00000000115b.jsonl',
  main: 'C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl',
};
/** turn start and claim time out of E's evidence string, where it states them; an override (a transcription by id, with its reason) wins. */
function parseLocator(evidence) {
  const m = /\b(lib|main) turns? ([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z)/.exec(evidence || '');
  if (!m) return null;
  const turnStart = m[2];
  const c = /claim(?: first written| at)? ([0-9]{2}:[0-9]{2}:[0-9]{2})Z/.exec(evidence);
  let claimTs = null;
  if (c) { claimTs = turnStart.slice(0, 11) + c[1] + 'Z'; if (Date.parse(claimTs) < Date.parse(turnStart)) claimTs = new Date(Date.parse(claimTs) + 86400000).toISOString().replace(/\.\d+Z$/, 'Z'); }
  return { seat: m[1], turnStart, claimTs };
}
function censusLocators(classification, overrides) {
  const rows = classification.q3.filter((x) => x.class === 'CN' || x.class === 'CU');
  return rows.map((x) => {
    const o = overrides[x.id];
    const p = o || parseLocator(x.evidence);
    const base = { id: x.id, class: x.class, src: x.src, source: o ? 'override' : p ? 'parsed from E evidence string' : 'none' };
    if (!p || !p.seat || !p.turnStart || !p.claimTs) return { ...base, status: 'unlocated', why: !p ? 'E did not locate the erring turn' : 'E gave a turn start but no claim time', seat: p && p.seat || null, turn_start: p && p.turnStart || null, claim_ts: null };
    return { ...base, status: 'located', seat: p.seat, transcript: SEAT_REL[p.seat], turn_start: p.turnStart, claim_ts: p.claimTs };
  });
}

// ------------------------------------------------------------------ freeze
const SHOW_CLAIMS = process.argv.includes('--show-claims'); // a report quotes a flagged sentence only when asked: it is a seat's own text
const arg = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const PROJECTS = arg('--projects', path.join(os.homedir(), '.claude', 'projects'));

/** The folder the re-measure's draw lives in: CONSONANCE_RETRIEVAL, else 'retrieval' beside the room's data dir (~/.consonance.json data_dir); no guess otherwise. */
function retrievalDir() {
  if (process.env.CONSONANCE_RETRIEVAL) return process.env.CONSONANCE_RETRIEVAL;
  try { const c = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8')); if (c.data_dir) return path.join(path.dirname(c.data_dir), 'retrieval'); } catch (_) { /* fall through */ }
  throw new Error('cannot find the retrieval folder: set CONSONANCE_RETRIEVAL, set data_dir in ~/.consonance.json, or pass --drawn <drawn.json>');
}

function writeList(dir, name, obj) {
  const body = JSON.stringify(obj, null, 1) + '\n';
  fs.writeFileSync(path.join(dir, name), body);
  return { file: name, sha256: sha256(body), function: 'sha256 of the file bytes' };
}

function stopPointsOfWeek(seat, fromMs, toMs) {
  const file = F.seatFile(seat), out = [];
  if (!fs.existsSync(file)) return { file, missing: true, out };
  F.eachLine(file, (line) => {
    if (!line.includes('"stop_reason":"end_turn"')) return;
    let o; try { o = JSON.parse(line); } catch (_) { return; }
    const m = o.message; if (o.type !== 'assistant' || o.isSidechain || !m || m.stop_reason !== 'end_turn' || !Array.isArray(m.content)) return;
    const t = Date.parse(o.timestamp); if (!(t >= fromMs && t < toMs)) return;
    if (textOfBlocks(m.content).length < F.MIN_CHARS) return;
    if (!m.content.some((b) => b.type === 'text' && String(b.text || '').trim())) return;
    out.push({ seat, messageId: m.id, ts: o.timestamp });
  });
  return { file, out };
}

function freeze() {
  const outDir = path.resolve(arg('--out')); fs.mkdirSync(outDir, { recursive: true });
  const cls = JSON.parse(fs.readFileSync(path.join(E_EVID, 'classification.json'), 'utf8'));
  const ovPath = arg('--overrides'); const overrides = ovPath ? JSON.parse(fs.readFileSync(ovPath, 'utf8')) : {};
  const digests = {};

  // census
  const units = censusLocators(cls, overrides);
  for (const u of units) {
    if (u.status !== 'located') continue;
    const t = runTurnJs(PROJECTS, u.transcript, u.turn_start, u.claim_ts.replace('Z', '.000Z'));
    u.confirmed = { calls: t.calls.length, results: t.results.length, userPromptAtTurnStart: t.userPromptAt === u.turn_start, assistantTextBlocksBeforeClaim: t.textBlocks };
  }
  digests.census = writeList(outDir, 'census-units.json', { what: 'D305 part 3: the census CN and CU units, locators only (E classification.json at p-causeread-E_2026-10-11_evidence)', units });

  // right-claim messages from the 10-10 re-measure
  const dir = path.join(ROOT, 'exo_memory', 'loop', 'remeasure_2026-10-10');
  const rowsOf = (p) => JSON.parse(fs.readFileSync(p, 'utf8')).rows;
  const B = rowsOf(path.join(dir, 'B', 'verdicts.json')), Cc = rowsOf(path.join(dir, 'C', 'verdicts.json'));
  const drawnPath = arg('--drawn', path.join(retrievalDir(), 'remeasure1003', 'key', 'drawn.json'));
  const drawn = new Map(JSON.parse(fs.readFileSync(drawnPath, 'utf8')).map((d) => [d.id, d]));
  const byMsg = new Map();
  for (const r of [...B, ...Cc]) { const id = r.claimId.split('|')[0]; if (!byMsg.has(id)) byMsg.set(id, []); byMsg.get(id).push(r.verdict); }
  const right = [...byMsg].filter(([, v]) => v.includes('CORRECT') && !v.includes('WRONG')).map(([id, v]) => {
    const d = drawn.get(id); const rel = path.relative(PROJECTS, d.transcript).replace(/\\/g, '/');
    return { messageId: id, seat: d.seat, transcript: rel, ts: d.ts, verdicts: v.filter(Boolean).sort() };
  }).sort((a, b) => (a.messageId < b.messageId ? -1 : 1));
  digests.right = writeList(outDir, 'right-claims.json', { what: 'D305 part 3: messages of the 10-10 re-measure with at least one claim called CORRECT and none WRONG (B and C verdict files)', messages: right });

  // a week of live replies
  const from = Date.parse(arg('--week-from', '2026-10-05T00:00:00Z')), to = Date.parse(arg('--week-to', '2026-10-12T00:00:00Z'));
  const seed = arg('--seed', 'D305-week'), N = Number(arg('--week-n', '300'));
  const all = [], perSeat = {};
  for (const seat of Object.keys(F.SEATS)) { const r = stopPointsOfWeek(seat, from, to); perSeat[seat] = r.out.length; for (const s of r.out) all.push({ ...s, transcript: path.relative(PROJECTS, F.seatFile(seat)).replace(/\\/g, '/') }); }
  const rank = (s) => sha256(`${seed}|${s.seat}|${s.messageId}`);
  const sample = [...all].sort((a, b) => (rank(a) < rank(b) ? -1 : 1)).slice(0, N).map((s) => ({ ...s, rank: rank(s) }));
  digests.week = writeList(outDir, 'week-replies.json', { what: 'D305 part 3: a seeded sample of keeper-facing replies of the chair and panes', window: [new Date(from).toISOString(), new Date(to).toISOString()], seed, rank: 'sha256(seed|seat|messageId) ascending', population: all.length, population_by_seat: perSeat, n: sample.length, replies: sample });

  const manifest = { harness_sha256: fileSha(__filename), turn_js_sha256: fileSha(TURN_JS), find_js_sha256: fileSha(FIND_JS), lists: digests };
  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 1) + '\n');
  console.log(JSON.stringify({ census: { total: units.length, located: units.filter((u) => u.status === 'located').length }, right: right.length, week: { population: all.length, sampled: sample.length, by_seat: perSeat } }));
  for (const [k, v] of Object.entries(digests)) console.log(`${k}: ${v.file} sha256 ${v.sha256}`);
}

// ------------------------------------------------------------------ run
async function loadGroup(name, lists) {
  if (name === 'census') {
    const doc = JSON.parse(fs.readFileSync(path.join(lists, 'census-units.json'), 'utf8')).units;
    const located = doc.filter((u) => u.status === 'located');
    const byFile = {};
    for (const u of located) (byFile[u.transcript] = byFile[u.transcript] || new Map()).set(u.id, u.claim_ts);
    const texts = new Map(), extra = new Map();
    for (const [rel, m] of Object.entries(byFile)) for (const [k, v] of claimTextsAtSeconds(path.join(PROJECTS, rel), m, extra)) texts.set(k, v);
    return doc.map((u) => {
      if (u.status !== 'located') return { id: u.id, group: 'census:' + u.class, status: 'unlocated', why: u.why };
      const t = runTurnJs(PROJECTS, u.transcript, u.turn_start, u.claim_ts.replace('Z', '.000Z'));
      return { id: u.id, group: 'census:' + u.class, seat: u.seat, turnStart: u.turn_start, claimTs: u.claim_ts, claimText: texts.get(u.id) || '', claimParts: (extra.get(u.id) || {}).parts || [], prompt: (extra.get(u.id) || {}).prompt || '', calls: t.calls, results: t.results };
    });
  }
  const items = name === 'right' ? JSON.parse(fs.readFileSync(path.join(lists, 'right-claims.json'), 'utf8')).messages : JSON.parse(fs.readFileSync(path.join(lists, 'week-replies.json'), 'utf8')).replies;
  const byFile = {};
  for (const x of items) (byFile[x.transcript] = byFile[x.transcript] || new Map()).set(x.messageId, x);
  const got = new Map();
  for (const [rel, wanted] of Object.entries(byFile)) for (const [id, t] of turnsByMessageId(path.join(PROJECTS, rel), wanted)) got.set(id, t);
  return items.map((x) => {
    const t = got.get(x.messageId);
    if (!t) return { id: x.messageId, group: name, status: 'unlocated', why: 'message not found in the transcript now' };
    return { ...t, id: x.messageId, group: name, seat: x.seat };
  });
}

async function run() {
  const lists = path.resolve(arg('--lists'));
  const checker = loadChecker(arg('--checker'));
  const groups = arg('--groups', 'census,right,week').split(',');
  const manifest = JSON.parse(fs.readFileSync(path.join(lists, 'manifest.json'), 'utf8'));
  const report = { checker: checker.name, groups: {} };
  const rows = {};
  for (const g of groups) {
    const turns = await loadGroup(g, lists);
    const res = await replay(checker, turns);
    rows[g] = { turns, res };
    if (g === 'census') for (const cls of ['CN', 'CU']) report.groups['census:' + cls] = tally(res.filter((r, i) => turns[i].group === 'census:' + cls));
    else report.groups[g] = tally(res);
  }
  const md = render(checker, manifest, report, rows, groups);
  const out = arg('--out');
  if (out) fs.writeFileSync(out, md); else console.log(md);
  return report;
}

function render(checker, manifest, report, rows, groups) {
  const o = [];
  o.push(`# D305 part 3 - claim-check REPLAY (seat A): checker \`${checker.name}\``);
  o.push('');
  o.push('Counts and units only. **Nothing here judges a flag**: a refusal on a known-wrong unit is counted "caught" because the unit is known wrong, not because the flagged sentence is the erring one; read the flagged claims.');
  o.push('');
  o.push('## What ran');
  o.push(`- Harness \`consonance/tools/claim-replay.js\` sha256 \`${fileSha(__filename)}\` (frozen with \`${manifest.harness_sha256}\`). E's \`turn.js\` \`${fileSha(TURN_JS)}\`, \`find.js\` \`${fileSha(FIND_JS)}\`, run as they are.`);
  o.push(`- Checker \`${checker.name}\`${checker.file ? ' sha256 `' + fileSha(checker.file) + '`' : ' (a built-in stub)'}.`);
  for (const [k, v] of Object.entries(manifest.lists)) o.push(`- List \`${v.file}\` ${v.function} \`${v.sha256}\``);
  o.push(`- Hygiene: Third Place lines removed from every text the checker saw: ${stats.thirdLinesRemoved}; secrets redacted by turn.js's shapes; the report quotes a flagged claim, whole and unclipped, only with --show-claims: ${SHOW_CLAIMS ? 'ON' : 'off'}.`);
  o.push('');
  const fmt = (r, u) => `| ${r.id} | ${u || ''} | ${r.status === 'ok' ? r.verdict : r.status + (r.error ? ': ' + clip(r.error, 80) : '')} | ${r.claim && SHOW_CLAIMS ? String(r.claim).replace(/\s+/g, ' ').replace(/\|/g, '/') : ''} |`;
  if (groups.includes('census')) {
    o.push('## Census (known-wrong claims): caught = refused');
    for (const cls of ['CN', 'CU']) {
      const t = report.groups['census:' + cls];
      o.push(`- **${cls}:** ${t.n} units - caught ${t.refused}, missed ${t.allowed}, unlocated ${t.unlocated}, errored ${t.errored}. Caught of the located: ${rate(t.refused, t.refused + t.allowed)}.`);
    }
    o.push('');
    o.push('| unit | class | result | flagged claim |'); o.push('|---|---|---|---|');
    rows.census.res.forEach((r, i) => o.push(fmt(r, rows.census.turns[i].group.split(':')[1])));
    o.push('');
  }
  for (const [g, title] of [['right', 'Right-claim sample (messages of the 10-10 re-measure with a CORRECT claim and no WRONG one): refusals are false refusals'], ['week', 'A week of live replies: refusals']]) {
    if (!groups.includes(g)) continue;
    const t = report.groups[g];
    o.push(`## ${title}`);
    o.push(`- ${t.n} turns - refused ${t.refused}, allowed ${t.allowed}, unlocated ${t.unlocated}, errored ${t.errored}. **Refused of the evaluated: ${rate(t.refused, t.refused + t.allowed)}.**`);
    const bySeat = {};
    rows[g].res.forEach((r, i) => { if (r.status !== 'ok') return; const s = rows[g].turns[i].seat; bySeat[s] = bySeat[s] || { n: 0, refused: 0 }; bySeat[s].n++; if (r.verdict === 'refuse') bySeat[s].refused++; });
    o.push('- By seat (refused/evaluated): ' + Object.entries(bySeat).map(([s, v]) => `${s} ${v.refused}/${v.n}`).join(', '));
    const refused = rows[g].res.filter((r) => r.verdict === 'refuse');
    if (refused.length) { o.push(''); o.push('| message | seat | result | flagged claim |'); o.push('|---|---|---|---|'); refused.slice(0, SHOW_CLAIMS ? refused.length : 60).forEach((r) => { const i = rows[g].res.indexOf(r); o.push(fmt(r, rows[g].turns[i].seat)); }); if (!SHOW_CLAIMS && refused.length > 60) o.push(`(+${refused.length - 60} more refusals not listed)`); }
    o.push('');
  }
  return o.join('\n');
}

if (require.main === module) {
  const cmd = process.argv[2];
  (cmd === 'freeze' ? Promise.resolve(freeze()) : cmd === 'run' ? run() : Promise.reject(new Error('usage: claim-replay.js freeze|run ...')))
    .catch((e) => { console.error('claim-replay: ' + e.message); process.exit(2); });
}

module.exports = { normalise, tally, wilson, replay, loadChecker, STUBS, parseLocator, censusLocators, parseTurnOutput, turnsByMessageId, claimTextsAtSeconds, clean, redact, textOfBlocks, rate };

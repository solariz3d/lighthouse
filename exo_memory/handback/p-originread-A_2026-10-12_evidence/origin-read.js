#!/usr/bin/env node
// origin-read.js (seat A, D307 part 3): reading aids for the blind origin read. It PRINTS what a unit's transcript holds; it classifies nothing.
//   node origin-read.js dossier <id>                      the correction, the turn before the erring turn, the erring turn up to the claim (and the claim message)
//   node origin-read.js search <id> "<phrase>" ["<phrase>"...]   every event BEFORE the claim whose text holds a phrase (case-insensitive), earliest first
//   node origin-read.js turnwide <id>                      for a unit with no claim time: the whole erring turn, to the next real prompt
// Units: the census's 27 CN (units.json 3e910cb0 for the correction; claim-harness census-units.json for the locator) and E's 15 held-out CN (heldout-lists, f195b94f;
// the correction text from A's pool batches). Third Place lines are removed and chair tokens redacted by claim-replay.js's clean().
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const R = require(path.join(ROOT, 'consonance', 'tools', 'claim-replay.js'));
const F = require(path.join(ROOT, 'exo_memory', 'loop', 'claimrec', 'frame.js'));
const H = path.join(ROOT, 'exo_memory', 'handback');
const PROJ = process.env.PROJECTS || path.join(os.homedir(), '.claude', 'projects');
const SEAT_REL = { lib: 'C--Consonance-instances-librarian/0c0c0c0b-0000-4000-8000-00000000115b.jsonl', main: 'C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl' };

function loadUnits() {
  const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
  const pU = path.join(H, 'p-wcensus-A_2026-10-11_evidence', 'out', 'units.json'), pH = path.join(H, 'p-poolread-E_2026-10-12_evidence', 'heldout-lists', 'census-units.json');
  if (!sha(pU).startsWith('3e910cb0') || !sha(pH).startsWith('f195b94f')) throw new Error('a digest does not match');
  const census = JSON.parse(fs.readFileSync(pU, 'utf8')).units;
  const loc = JSON.parse(fs.readFileSync(path.join(H, 'p-claimharness-A_2026-10-11_evidence', 'lists', 'census-units.json'), 'utf8')).units.filter((u) => u.class === 'CN');
  const out = [];
  for (const l of loc) {
    const c = census.find((u) => u.id === l.id);
    out.push({ id: l.id, set: 'census', seat: l.seat, transcript: l.transcript || SEAT_REL[l.seat], turnStart: l.turn_start, claimTs: l.claim_ts, correction: c ? c.correction_text : null, correctionAt: c ? c.correction_at : null });
  }
  const held = JSON.parse(fs.readFileSync(pH, 'utf8')).units.filter((u) => u.class === 'CN');
  const batches = fs.readdirSync(path.join(H, 'p-wcensus-A_2026-10-11_evidence', 'out', 'topup')).filter((f) => /^batch-\d+\.json$/.test(f)).flatMap((f) => JSON.parse(fs.readFileSync(path.join(H, 'p-wcensus-A_2026-10-11_evidence', 'out', 'topup', f), 'utf8')).units);
  for (const l of held) {
    const c = batches.find((u) => u.id === l.id);
    out.push({ id: l.id, set: 'heldout', seat: l.seat, transcript: l.transcript, turnStart: l.turn_start, claimTs: l.claim_ts, also: l.also, correction: c ? c.correction_text : null, correctionAt: c ? c.correction_at : null });
  }
  return out;
}

const cut = (s, n) => { s = String(s); return s.length > n ? s.slice(0, n) + ` ...[+${s.length - n}]` : s; };
const textOf = (c) => (typeof c === 'string' ? c : Array.isArray(c) ? c.map((b) => (b.type === 'text' ? b.text : b.type === 'tool_result' ? '' : '')).join('\n') : '');
const resultText = (b) => (Array.isArray(b.content) ? b.content.map((x) => x.text || '').join(' ') : String(b.content || ''));

/** Events of a transcript up to (and including rows of) endMs: { n: line, ts, kind, text }. */
function events(file, endMs) {
  const ev = [];
  F.eachLine(file, (line, n) => {
    if (!line.startsWith('{')) return;
    const m = /"timestamp":"([^"]+)"/.exec(line);
    const t = m ? Date.parse(m[1]) : NaN;
    if (t > endMs) return;
    let o; try { o = JSON.parse(line); } catch (_) { return; }
    const ts = o.timestamp || null;
    if (o.type === 'summary' || o.isCompactSummary) { ev.push({ n, ts, kind: 'COMPACT', text: typeof o.summary === 'string' ? o.summary : textOf(o.message && o.message.content) }); return; }
    if (o.type === 'attachment') { const a = o.attachment || {}; ev.push({ n, ts, kind: 'ATTACH ' + (a.hookName || a.type || ''), text: String(a.stdout || a.content || a.text || JSON.stringify(a)).slice(0, 20000) }); return; }
    if (o.isSidechain) return;
    if (o.type === 'user' && o.message) {
      const c = o.message.content;
      if (Array.isArray(c) && c.some((b) => b.type === 'tool_result')) { for (const b of c) if (b.type === 'tool_result') ev.push({ n, ts, kind: 'RESULT' + (b.is_error ? ' (error)' : ''), text: resultText(b) }); const tx = textOf(c); if (tx.trim()) ev.push({ n, ts, kind: 'USER-TEXT', text: tx }); return; }
      ev.push({ n, ts, kind: F.isRealPrompt(o) ? 'PROMPT' : 'USER-META', text: textOf(c) });
      return;
    }
    if (o.type === 'assistant' && o.message && Array.isArray(o.message.content)) {
      for (const b of o.message.content) {
        if (b.type === 'text') ev.push({ n, ts, kind: 'A-TEXT', text: b.text || '' });
        else if (b.type === 'thinking') ev.push({ n, ts, kind: 'THINK', text: b.thinking || '' });
        else if (b.type === 'tool_use') ev.push({ n, ts, kind: 'CALL ' + b.name, text: JSON.stringify(b.input || {}) });
      }
    }
  });
  return ev;
}

// display only: system-reminder bookkeeping and empty thinking blocks are left out of the dossier (search still sees everything but the token counter)
const NOISE = /^ATTACH (total_tokens_reminder|batching_reminder_sent|bash_output_audience_note|deferred_tools_delta|agent_listing_delta|skill_listing|environment|Stop)/;
const noise = (e) => NOISE.test(e.kind) || (e.kind === 'THINK' && !e.text.trim());
function show(e, lim) { if (e.kind.startsWith('ATTACH')) lim = Math.min(lim, 400); return `  [${e.n}] ${e.ts ? e.ts.slice(11, 19) : '--'} ${e.kind}: ${cut(R.clean(e.text).replace(/\s+/g, ' '), lim)}`; }

function main() {
  const [cmd, id, ...phrases] = process.argv.slice(2);
  const u = loadUnits().find((x) => x.id === id);
  if (!u) throw new Error('unknown unit ' + id);
  const file = path.join(PROJ, u.transcript);
  const turnMs = Date.parse(u.turnStart);
  const claimMs = u.claimTs ? Date.parse(u.claimTs.replace('Z', '.000Z')) : null;
  console.log(`# ${u.id} (${u.set}) seat ${u.seat}  turn ${u.turnStart}  claim ${u.claimTs || '(none: locate it in the turn)'}  file ${u.transcript} ${(fs.statSync(file).size / 1e6).toFixed(0)} MB`);
  if (cmd === 'corr') { console.log(R.clean(u.correction || '(none)').slice(0, 9000)); return; }
  if (cmd === 'brief') {
    // the correction (first 1800 chars), the prompt of the erring turn, the last 16 events before the claim, and the last text of the turn before
    console.log('## CORRECTION (' + u.correctionAt + '):\n' + cut(R.clean(u.correction || '(none)'), 1800));
    const ev = events(file, claimMs ? claimMs + 1500 : turnMs + 3 * 3600e3);
    let si = ev.findIndex((e) => e.kind === 'PROMPT' && Date.parse(e.ts) >= turnMs - 1000);
    // E's turn start is not always a real prompt (a task notification, a queued command): fall back to the last event of any kind at or before it
    if (si < 0) { for (let k = 0; k < ev.length; k++) if (Date.parse(ev[k].ts) <= turnMs + 1000) si = k; if (si < 0) si = 0; console.log('(no real prompt at the turn start; using the last event at or before it)'); }
    console.log('session reaches back to ' + (ev[0] && ev[0].ts) + '; events ' + ev.length + '; erring turn starts at event ' + (ev[si] && ev[si].n));
    const before = ev.slice(0, si).filter((e) => !noise(e) && (e.kind === 'A-TEXT' || e.kind === 'PROMPT')).slice(-2);
    console.log('## TURN BEFORE (last prompt and last reply):'); for (const e of before) console.log(show(e, 500));
    const turn = ev.slice(si).filter((e) => !noise(e));
    console.log('## ERRING TURN: ' + turn.length + ' events; the prompt, then the last 16:');
    console.log(show(turn[0], 1500));
    for (const e of turn.slice(1).slice(-16)) console.log(show(e, e.kind === 'A-TEXT' ? 2600 : e.kind.startsWith('RESULT') ? 1000 : 600));
    return;
  }
  if (cmd === 'dossier' || cmd === 'turnwide') {
    console.log('## CORRECTION (' + u.correctionAt + '):\n' + cut(R.clean(u.correction || '(none)'), 2200) + (u.also ? '\n(also: ' + JSON.stringify(u.also) + ')' : ''));
    const horizon = cmd === 'turnwide' || !claimMs ? turnMs + 3 * 3600e3 : claimMs + 1500;
    const ev = events(file, horizon);
    const prompts = ev.filter((e) => e.kind === 'PROMPT');
    const startIdx = ev.findIndex((e) => e.kind === 'PROMPT' && Date.parse(e.ts) >= turnMs - 1000);
    const prevPrompt = prompts.filter((p) => Date.parse(p.ts) < turnMs - 1000).pop();
    console.log(`session file reaches back to ${ev[0] && ev[0].ts}; ${prompts.length} real prompts before the horizon; events ${ev.length}`);
    const nextPromptN = (() => { const i = ev.findIndex((e, k) => k > startIdx && e.kind === 'PROMPT'); return i < 0 ? Infinity : ev[i].n; })();
    if (prevPrompt) {
      console.log('## THE TURN BEFORE (from its prompt to the erring turn):');
      for (const e of ev.filter((x) => !noise(x) && x.n >= prevPrompt.n && x.n < (ev[startIdx] ? ev[startIdx].n : Infinity))) console.log(show(e, e.kind === 'PROMPT' || e.kind === 'A-TEXT' ? 800 : e.kind.startsWith('RESULT') ? 300 : 250));
    }
    console.log('## THE ERRING TURN (' + (claimMs ? 'to the claim second' : 'whole turn') + '):');
    for (const e of ev.filter((x) => !noise(x) && ev[startIdx] && x.n >= ev[startIdx].n && x.n < nextPromptN)) console.log(show(e, e.kind === 'PROMPT' ? 2500 : e.kind === 'A-TEXT' ? 2200 : e.kind.startsWith('RESULT') ? 800 : 500));
  } else if (cmd === 'search') {
    // EXTEND_MIN (env) pushes the horizon past the located claim second, for a unit whose claim E placed in the wrong turn
    const horizon = (claimMs ? claimMs + 1500 : turnMs + 3 * 3600e3) + Number(process.env.EXTEND_MIN || 0) * 60000;
    const ev = events(file, horizon);
    const ps = phrases.map((p) => p.toLowerCase());
    let total = 0;
    for (const p of ps) {
      const hits = ev.filter((e) => !/^ATTACH (total_tokens_reminder|batching_reminder_sent)/.test(e.kind) && R.clean(e.text).replace(/\s+/g, ' ').toLowerCase().includes(p));
      total += hits.length;
      console.log(`## phrase "${p}": ${hits.length} event(s) before the claim second; earliest 5, then the last 2`);
      const pick = [...hits.slice(0, 5), ...hits.slice(-2).filter((h) => !hits.slice(0, 5).includes(h))];
      for (const h of pick) { const t = R.clean(h.text).replace(/\s+/g, ' '); const i = t.toLowerCase().indexOf(p); console.log(`  [${h.n}] ${h.ts ? h.ts.slice(0, 19) : '--'} ${h.kind}: ...${t.slice(Math.max(0, i - 160), i + p.length + 200)}...`); }
    }
    console.log(`(events scanned ${ev.length}; session reaches back to ${ev[0] && ev[0].ts})`);
  } else if (cmd === 'range') {
    // events from line phrases[0] to phrases[1], noise left out, each cut to 1500 chars
    const [lo, hi] = phrases.map(Number);
    const ev = events(file, (claimMs ? claimMs : turnMs) + 6 * 3600e3).filter((e) => e.n >= lo && e.n <= hi && !noise(e));
    for (const e of ev) console.log(show(e, 1500));
  } else if (cmd === 'show') {
    // full text of the events at the given line numbers (phrases[] holds the numbers); cap 7000 chars each
    const want = new Set(phrases.map(Number));
    const ev = events(file, claimMs ? claimMs + 1500 : turnMs + 3 * 3600e3).filter((e) => want.has(e.n));
    for (const e of ev) console.log(`[${e.n}] ${e.ts} ${e.kind}:
${cut(R.clean(e.text), 7000)}
`);
  } else throw new Error('usage: dossier|turnwide|search|show <id> ...');
}
try { main(); } catch (e) { console.error('origin-read: ' + e.message); process.exit(2); }

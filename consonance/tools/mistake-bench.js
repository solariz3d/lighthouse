#!/usr/bin/env node
'use strict';
// mistake-bench.js (seat A, D311 part 2): the replay bench. For one located wrong claim (a census CN unit), rebuild the context its seat had at the
// erring turn from the seat's transcript, regenerate the next message with `claude -p` on the seat's model, record the reply with its unit, arm
// label and run number, and write a shuffled set plus a key so a judge can read the replies blind. It judges nothing and gates nothing.
//
//   node consonance/tools/mistake-bench.js pick [--seed S] [--n 3]                      which dev units a seed picks
//   node consonance/tools/mistake-bench.js context <id> [--out dir]                     build one unit's context; print its sizes; write the prompt (no model call)
//   node consonance/tools/mistake-bench.js run --units W006,W010 [--arm-file f --arm-label F1] [--run 1] --out dir     regenerate (heavy-run lock)
//   node consonance/tools/mistake-bench.js blind --runs dir/runs.jsonl --seed S --out dir   write blind.json (for the judge) and key.json (kept by the runner)
//
// THE CONTEXT IS AN APPROXIMATION (see the hand-back p-mistakebench-A_2026-10-12.md): what a transcript holds is not what the model was given.
// Only the 27 census (dev) units are loadable here; the held-out 15 are deliberately not wired in.
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const cp = require('child_process');
const ROOT = path.resolve(__dirname, '..', '..');
const R = require('./claim-replay.js');
const F = require(path.join(ROOT, 'exo_memory', 'loop', 'claimrec', 'frame.js'));
const H = path.join(ROOT, 'exo_memory', 'handback');
const PROJ = process.env.PROJECTS || path.join(os.homedir(), '.claude', 'projects');
const SEAT_REL = { lib: 'C--Consonance-instances-librarian/0c0c0c0b-0000-4000-8000-00000000115b.jsonl', main: 'C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl' };

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
const INSTRUCTION = 'Continue the session: produce the next thing this seat would do, exactly as it would. That may be a message, a request for tools, or both. Tools are available, but this is a replay: nothing will be executed, and no result will come back.';
const LIMITS = { historyChars: 60000, turnChars: 60000, summaryChars: 30000, promptChars: 12000, resultChars: 2500, callChars: 1000, textChars: 12000, attachChars: 1500,
  hist: { prompt: 1500, text: 1500, call: 200, result: 600, attach: 400 } };

// ------------------------------------------------------------------ reading the transcript (after origin-read.js's events(), with the model kept)
const textOf = (c) => (typeof c === 'string' ? c : Array.isArray(c) ? c.map((b) => (b.type === 'text' ? b.text : '')).join('\n') : '');
const resultText = (b) => (Array.isArray(b.content) ? b.content.map((x) => x.text || '').join(' ') : String(b.content || ''));
const NOISE = /^ATTACH (total_tokens_reminder|batching_reminder_sent|bash_output_audience_note|deferred_tools_delta|agent_listing_delta|skill_listing|environment|Stop)/;

/** Events of a transcript up to endMs: { n, ts, kind, text, model }. */
function readEvents(file, endMs) {
  const ev = [];
  F.eachLine(file, (line, n) => {
    if (!line.startsWith('{')) return;
    const m = /"timestamp":"([^"]+)"/.exec(line);
    const t = m ? Date.parse(m[1]) : NaN;
    if (t > endMs) return;
    let o; try { o = JSON.parse(line); } catch (_) { return; }
    const ts = o.timestamp || null;
    if (o.type === 'summary' || o.isCompactSummary) { ev.push({ n, ts, kind: 'COMPACT', text: typeof o.summary === 'string' ? o.summary : textOf(o.message && o.message.content) }); return; }
    if (o.type === 'attachment') { const a = o.attachment || {}; ev.push({ n, ts, kind: 'ATTACH ' + (a.hookName || a.type || ''), text: String(a.stdout || (Array.isArray(a.content) ? a.content.join('\n') : a.content) || a.text || '').slice(0, 20000) }); return; }
    if (o.isSidechain) return;
    if (o.type === 'user' && o.message) {
      const c = o.message.content;
      if (Array.isArray(c) && c.some((b) => b.type === 'tool_result')) { for (const b of c) if (b.type === 'tool_result') ev.push({ n, ts, kind: 'RESULT', text: resultText(b) }); const tx = textOf(c); if (tx.trim()) ev.push({ n, ts, kind: 'USER-TEXT', text: tx }); return; }
      ev.push({ n, ts, kind: F.isRealPrompt(o) ? 'PROMPT' : 'USER-META', text: textOf(c) });
      return;
    }
    if (o.type === 'assistant' && o.message && Array.isArray(o.message.content)) {
      const model = o.message.model && o.message.model !== '<synthetic>' ? o.message.model : null;
      for (const b of o.message.content) {
        if (b.type === 'text') ev.push({ n, ts, kind: 'A-TEXT', text: b.text || '', model });
        else if (b.type === 'tool_use') ev.push({ n, ts, kind: 'CALL ' + b.name, text: JSON.stringify(b.input || {}), model });
        // thinking blocks are left out: a model is not shown its earlier thinking
      }
    }
  });
  return ev;
}

const cutTo = (s, n) => { s = String(s); return s.length > n ? s.slice(0, n) + ` …[+${s.length - n} chars cut]` : s; };
const hms = (ts) => (ts ? ts.slice(0, 19) + 'Z' : '--');
function fmt(e, lim) {
  const body = (n) => cutTo(R.clean(e.text), n);
  if (e.kind === 'PROMPT' || e.kind === 'USER-TEXT') return `[PROMPT ${hms(e.ts)}] ${body(lim.prompt)}`;
  if (e.kind === 'A-TEXT') return `[ASSISTANT ${hms(e.ts)}] ${body(lim.text)}`;
  if (e.kind.startsWith('CALL ')) return `[TOOL CALL ${e.kind.slice(5)} ${hms(e.ts)}] ${body(lim.call)}`;
  if (e.kind === 'RESULT') return `[TOOL RESULT ${hms(e.ts)}] ${body(lim.result)}`;
  if (e.kind === 'USER-META') return `[SYSTEM NOTE ${hms(e.ts)}] ${body(lim.attach)}`;
  return `[${e.kind} ${hms(e.ts)}] ${body(lim.attach)}`;
}

/** Build a unit's context from events read up to just past the claim. unit: { id, seat, turnStartMs, claimMs }. */
function buildContext(ev, unit, opts = {}) {
  const L = { ...LIMITS, ...opts, hist: { ...LIMITS.hist, ...(opts.hist || {}) } };
  const live = ev.filter((e) => !NOISE.test(e.kind) && !(e.kind !== 'COMPACT' && !String(e.text).trim() && e.kind === 'A-TEXT'));
  // the claim message: the first assistant text inside the claim's second (the located claim is a second, not a millisecond)
  const isAsst = (e) => e.kind === 'A-TEXT' || e.kind.startsWith('CALL ');   // the claim may sit in a tool call (a file written by Bash), not only in a text block
  let stop = live.findIndex((e) => isAsst(e) && Date.parse(e.ts) >= unit.claimMs && Date.parse(e.ts) < unit.claimMs + 1000);
  if (stop < 0) stop = live.findIndex((e) => isAsst(e) && Date.parse(e.ts) >= unit.claimMs && Date.parse(e.ts) < unit.claimMs + 5000);
  if (stop < 0) throw new Error(`${unit.id}: no assistant message or call at the claim second`);
  const before = live.slice(0, stop);
  const model = [...live.slice(0, stop + 1)].reverse().find((e) => e.model);
  // the last compaction before the turn: its summary is what the seat carried across it
  let ci = -1;
  for (let k = 0; k < before.length; k++) if (before[k].kind === 'COMPACT' && Date.parse(before[k].ts) < unit.turnStartMs) ci = k;
  const summary = ci >= 0 ? cutTo(R.clean(before[ci].text), L.summaryChars) : null;
  const after = ci >= 0 ? before.slice(ci + 1) : before;
  // the turn starts at the first real prompt at or after the located turn start; if E's start is not a prompt, at the last event at or before it
  let ti = after.findIndex((e) => e.kind === 'PROMPT' && Date.parse(e.ts) >= unit.turnStartMs - 1000);
  let startNote = null;
  if (ti < 0) { for (let k = 0; k < after.length; k++) if (Date.parse(after[k].ts) <= unit.turnStartMs + 1000) ti = k; if (ti < 0) ti = 0; startNote = 'the located turn start is not a real prompt; the turn is taken from the last event at or before it'; }
  const histEv = after.slice(0, ti).filter((e) => e.kind !== 'COMPACT'), turnEv = after.slice(ti).filter((e) => e.kind !== 'COMPACT');
  const stats = { events: ev.length, compactionAt: ci >= 0 ? before[ci].ts : null, historyEvents: histEv.length, turnEvents: turnEv.length, historyDropped: 0, turnDropped: 0, startNote };

  // history: newest events kept first, until the budget is spent
  const hl = histEv.map((e) => fmt(e, L.hist));
  let used = 0, keepFrom = hl.length;
  while (keepFrom > 0 && used + hl[keepFrom - 1].length <= L.historyChars) { used += hl[keepFrom - 1].length; keepFrom--; }
  stats.historyDropped = keepFrom;
  const history = (keepFrom > 0 ? [`[earlier history cut: ${keepFrom} older events before this point were left out]`] : []).concat(hl.slice(keepFrom));

  // the turn: its prompt first, then the newest events that fit
  const turnLim = { prompt: L.promptChars, text: L.textChars, call: L.callChars, result: L.resultChars, attach: L.attachChars };
  const tl = turnEv.map((e) => fmt(e, turnLim));
  let turn = tl;
  const total = tl.reduce((a, s) => a + s.length, 0);
  if (total > L.turnChars) {
    const head = tl[0];
    let u2 = head.length, from = tl.length;
    while (from > 1 && u2 + tl[from - 1].length <= L.turnChars) { u2 += tl[from - 1].length; from--; }
    stats.turnDropped = from - 1;
    turn = [head, `[${from - 1} events of this turn cut here]`].concat(tl.slice(from));
  }
  return { id: unit.id, seat: unit.seat, model: model ? model.model : null, summary, history, turn, stop: { n: live[stop].n, ts: live[stop].ts, kind: live[stop].kind, text: live[stop].text }, stats };
}

const SYSTEM_BASE = (seat) => `You are a seat (${seat}) in a multi-seat working committee. What follows is the record of your session up to this moment, rendered as text: prompts addressed to you, your earlier messages, the tool calls you made and what they returned. This is a replay: continue it.`;

/** The text for the model: { system, prompt, sha, chars }. armText null = the baseline. */
function renderPrompt(ctx, armText, armLabel) {
  const parts = [];
  if (ctx.summary) parts.push('<session-summary>', ctx.summary, '</session-summary>');
  parts.push('<session-record>', ...ctx.history, '--- the turn you are in begins here ---', ...ctx.turn, '</session-record>');
  if (armText) parts.push(`[added context: ${armLabel}]`, armText, '[end of added context]');
  parts.push(INSTRUCTION);
  const system = SYSTEM_BASE(ctx.seat), prompt = parts.join('\n');
  return { system, prompt, sha: sha256(system + '\n' + prompt), chars: system.length + prompt.length };
}

// ------------------------------------------------------------------ units and the seeded pick
function loadUnits() {
  const fsha = (p) => sha256(fs.readFileSync(p));
  const pU = path.join(H, 'p-wcensus-A_2026-10-11_evidence', 'out', 'units.json');
  if (!fsha(pU).startsWith('3e910cb0')) throw new Error('census units.json digest does not match 3e910cb0');
  const census = JSON.parse(fs.readFileSync(pU, 'utf8')).units;
  const loc = JSON.parse(fs.readFileSync(path.join(H, 'p-claimharness-A_2026-10-11_evidence', 'lists', 'census-units.json'), 'utf8')).units.filter((u) => u.class === 'CN');
  return loc.map((l) => {
    const c = census.find((u) => u.id === l.id) || {};
    return { id: l.id, set: 'dev', seat: l.seat, transcript: l.transcript || SEAT_REL[l.seat], turnStartMs: l.turn_start ? Date.parse(l.turn_start) : null,
      claimMs: l.claim_ts ? Date.parse(l.claim_ts) : null, correction: c.correction_text || null, correctionAt: c.correction_at || null };
  });
}

/** Units with a located claim, ranked by sha256(seed|id); the first n. */
function pickUnits(units, seed, n) {
  return units.filter((u) => u.claimMs)
    .map((u) => ({ u, k: sha256(`${seed}|${u.id}`) })).sort((a, b) => (a.k < b.k ? -1 : a.k > b.k ? 1 : 0)).slice(0, n).map((x) => x.u);
}

function contextOfUnit(u, opts) {
  const file = path.join(PROJ, u.transcript);
  const ev = readEvents(file, u.claimMs + 1500);
  return buildContext(ev, u, opts);
}

// ------------------------------------------------------------------ the model call
function defaultRunner(args, input, o = {}) {
  return new Promise((resolve) => {
    const env = {};
    for (const [k, v] of Object.entries(process.env)) if (!/^CONSONANCE_/i.test(k) || /^CONSONANCE_HEAVY_RUN_TOKEN$/.test(k)) env[k] = v;
    const cwd = o.cwd || fs.mkdtempSync(path.join(os.tmpdir(), 'mistake-bench-run-'));
    const child = cp.spawn(o.bin || 'claude', args, { cwd, env, windowsHide: true });
    let out = '', err = '', done = false;
    const finish = (r) => { if (done) return; done = true; clearTimeout(timer); try { fs.rmSync(cwd, { recursive: true, force: true }); } catch (_) { /* best effort: the folder is empty */ } resolve(r); };
    const timer = setTimeout(() => { child.kill(); finish({ code: -1, stdout: out, stderr: err + ' [timed out]' }); }, o.timeoutMs || 15 * 60000);
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { err += d; });
    child.on('error', (e) => finish({ code: -1, stdout: out, stderr: String(e.message) }));
    child.on('close', (code) => finish({ code, stdout: out, stderr: err }));
    child.stdin.on('error', () => { /* a closed pipe is reported by the exit code */ });
    child.stdin.end(input);
  });
}

const STUB_PATH = path.join(__dirname, 'mistake-bench-toolstub.js');
const TOOL_PREFIX = 'mcp__consonance__';
/** The tool definitions the model is given and the proof that none runs: an MCP stub (mistake-bench-toolstub.js) named "consonance", every call answered
 *  with a fixed text, no fs and no child_process in its source; built-in tools are off (--tools ""); one turn only (--max-turns 1). */
const toolArgs = () => ['--tools', '', '--strict-mcp-config', '--mcp-config', JSON.stringify({ mcpServers: { consonance: { command: process.execPath, args: [STUB_PATH] } } }),
  '--allowedTools', TOOL_PREFIX + '*', '--max-turns', '1'];
const cleanDeep = (v) => (typeof v === 'string' ? R.clean(v) : Array.isArray(v) ? v.map(cleanDeep) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, cleanDeep(x)])) : v);

/** One regeneration: { status:'ok'|'error', reply|null, toolRequests, durationMs, costUsd, tokens, usage, error }. The reply is the first assistant turn:
 *  its text, then each tool request it made as "[TOOL REQUEST name] {input}"; anything after the first tool result is not part of it. */
async function regenerate({ system, prompt, model }, { runner = defaultRunner, timeoutMs } = {}) {
  const args = ['-p', '--model', model, '--output-format', 'stream-json', '--verbose', '--no-session-persistence', ...toolArgs(), '--system-prompt', system,
    '--disable-slash-commands', '--setting-sources', ''];
  const t0 = Date.now();
  let r;
  try { r = await runner(args, prompt, { timeoutMs }); } catch (e) { return { status: 'error', reply: null, error: String(e.message), wallMs: Date.now() - t0 }; }
  const wallMs = Date.now() - t0;
  const events = [];
  for (const l of String(r.stdout).split(/\r?\n/)) { if (!l.trim()) continue; try { events.push(JSON.parse(l)); } catch (_) { return { status: 'error', reply: null, error: 'output is not JSON: ' + R.clean(String(r.stdout)).slice(0, 300), wallMs }; } }
  const res = events.find((e) => e.type === 'result');
  // the CLI exits 1 when it stops at --max-turns 1; that is the end of the first turn here, any other non-zero exit is a failure
  if (r.code !== 0 && !(res && res.subtype === 'error_max_turns')) return { status: 'error', reply: null, error: `exit ${r.code}: ${R.clean(String(r.stderr || r.stdout)).slice(0, 600)}`, wallMs };
  const texts = [], toolRequests = [];
  for (const e of events) {
    if (e.type === 'user') break;   // the first tool result ends the first turn
    if (e.type !== 'assistant' || !e.message || !Array.isArray(e.message.content)) continue;
    for (const b of e.message.content) {
      if (b.type === 'text' && b.text && b.text.trim()) texts.push(R.clean(b.text));
      else if (b.type === 'tool_use') toolRequests.push({ name: String(b.name).startsWith(TOOL_PREFIX) ? String(b.name).slice(TOOL_PREFIX.length) : b.name, input: cleanDeep(b.input || {}) });
    }
  }
  if (!texts.length && !toolRequests.length) return { status: 'error', reply: null, error: 'no reply: ' + R.clean(String((res && (res.result || res.subtype)) || 'no result event')).slice(0, 300), wallMs };
  if (res && res.is_error && !texts.length && !toolRequests.length) return { status: 'error', reply: null, error: 'claude reported an error: ' + R.clean(String(res.result || res.subtype)).slice(0, 300), wallMs };
  const reply = texts.concat(toolRequests.map((t) => `[TOOL REQUEST ${t.name}] ${JSON.stringify(t.input)}`)).join('\n');
  const u = (res && res.usage) || {};
  const input = (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0);
  return { status: 'ok', reply, toolRequests, durationMs: res && res.duration_ms, wallMs, costUsd: res && res.total_cost_usd, tokens: { input, output: u.output_tokens || 0 }, usage: u };
}

/** Run async jobs (functions), at most n at once; every job runs once; a throw is returned as { error }, never lost. Results keep job order. */
async function pool(jobs, n) {
  const out = new Array(jobs.length); let next = 0;
  const worker = async () => { while (next < jobs.length) { const i = next++; try { out[i] = { value: await jobs[i]() }; } catch (e) { out[i] = { error: String(e && e.message || e) }; } } };
  await Promise.all(Array.from({ length: Math.max(1, Math.min(n, jobs.length)) }, worker));
  return out;
}

/** A run's row for runs.jsonl: the regeneration result without the CLI's cost field (the keeper's rule: calls and time only). */
function runRow(head, g) { const { costUsd, ...rest } = g; return { ...head, ...rest }; }

// ------------------------------------------------------------------ the shuffled set and its key
/** runs: [{unit, arm, run, status, reply, correction}] -> { blind:[{blindId, unit, wrongClaim, reply}], key:{blindId:{unit,arm,run}}, errored:[{unit,arm,run}] } */
function makeBlind(runs, seed) {
  const ok = runs.filter((r) => r.status === 'ok');
  const errored = runs.filter((r) => r.status !== 'ok').map((r) => ({ unit: r.unit, arm: r.arm, run: r.run }));
  const ranked = ok.map((r, i) => ({ r, k: sha256(`${seed}|${r.unit}|${r.arm}|${r.run}|${i}`) })).sort((a, b) => (a.k < b.k ? -1 : a.k > b.k ? 1 : 0));
  const blind = [], key = {};
  ranked.forEach((x, i) => {
    const blindId = 'R' + String(i + 1).padStart(3, '0');
    blind.push({ blindId, unit: x.r.unit, wrongClaim: x.r.correction, reply: x.r.reply });
    key[blindId] = { unit: x.r.unit, arm: x.r.arm, run: x.r.run };
  });
  return { blind, key, errored };
}

module.exports = { readEvents, buildContext, renderPrompt, loadUnits, pickUnits, contextOfUnit, regenerate, makeBlind, defaultRunner, pool, runRow, INSTRUCTION, LIMITS, sha256 };

// ------------------------------------------------------------------ the command line
function arg(argv, name, dflt) { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : dflt; }
async function main() {
  const argv = process.argv.slice(2), cmd = argv[0];
  const units = loadUnits();
  if (cmd === 'pick') {
    const seed = arg(argv, '--seed', 'd311-dry-2026-10-12'), n = Number(arg(argv, '--n', 3));
    console.log(JSON.stringify(pickUnits(units, seed, n).map((u) => ({ id: u.id, seat: u.seat, claim: new Date(u.claimMs).toISOString() })), null, 1));
  } else if (cmd === 'context') {
    const u = units.find((x) => x.id === argv[1]); if (!u) throw new Error('unknown dev unit ' + argv[1]);
    const ctx = contextOfUnit(u), p = renderPrompt(ctx, null, 'baseline');
    console.log(JSON.stringify({ id: u.id, model: ctx.model, stats: ctx.stats, promptChars: p.chars, promptSha256: p.sha, stopAt: ctx.stop.ts, summaryChars: ctx.summary ? ctx.summary.length : 0 }, null, 1));
    const out = arg(argv, '--out');
    if (out) { fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, `${u.id}.prompt.txt`), p.system + '\n\n' + p.prompt); }
  } else if (cmd === 'run') {
    require('./heavy-run.js').hold({ cmd: 'mistake-bench run' });
    const out = arg(argv, '--out'); if (!out) throw new Error('--out dir is required');
    fs.mkdirSync(out, { recursive: true });
    const armFile = arg(argv, '--arm-file'), armLabel = armFile ? arg(argv, '--arm-label', path.basename(armFile)) : 'baseline';
    const armText = armFile ? fs.readFileSync(armFile, 'utf8') : null;
    const reps = Number(arg(argv, '--reps', 0)), runNo = Number(arg(argv, '--run', 1)), par = Number(arg(argv, '--parallel', 1));
    const runs = reps > 0 ? Array.from({ length: reps }, (_, i) => i + 1) : [runNo];
    const ids = String(arg(argv, '--units', '')).split(',').filter(Boolean);
    const jobs = [];
    for (const run of runs) for (const id of ids) jobs.push(async () => {
      const u = units.find((x) => x.id === id); if (!u) throw new Error('unknown dev unit ' + id);
      const ctx = contextOfUnit(u), p = renderPrompt(ctx, armText, armLabel);
      const g = await regenerate({ system: p.system, prompt: p.prompt, model: ctx.model });
      const row = runRow({ unit: id, arm: armLabel, run, model: ctx.model, seat: u.seat, promptSha256: p.sha, promptChars: p.chars, contextStats: ctx.stats, startedAt: new Date().toISOString(), correction: R.clean(u.correction || '').slice(0, 3000) }, g);
      fs.appendFileSync(path.join(out, 'runs.jsonl'), JSON.stringify(row) + String.fromCharCode(10));
      console.log(id + ' ' + armLabel + ' run ' + run + ': ' + g.status + (g.status === 'ok' ? ' in ' + g.tokens.input + ' out ' + g.tokens.output + ' tok, ' + (g.durationMs / 1000).toFixed(1) + ' s api' : ' ' + g.error));
    });
    const res = await pool(jobs, par);
    const lost = res.filter((r) => r.error);
    if (lost.length) { console.log(lost.length + ' job(s) threw before a row was written: ' + lost.map((r) => r.error).join(' | ')); process.exitCode = 1; }
  } else if (cmd === 'probe') {
    // the live proof that no tool runs: ask the model to write a file with Write and another with Bash, into a folder this process owns, then look
    require('./heavy-run.js').hold({ cmd: 'mistake-bench probe' });
    const model = arg(argv, '--model', 'claude-opus-5-5');
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mistake-bench-probe-'));
    try {
      const p = path.join(dir, 'probe-write.txt'), q = path.join(dir, 'probe-bash.txt');
      const g = await regenerate({ system: 'You are testing a replay harness.', prompt: 'Do both now, with tools, in one turn: (1) use the Write tool to create ' + p + ' containing the single line hello; (2) use the Bash tool to run: echo hi > ' + q, model });
      const files = fs.readdirSync(dir);
      console.log(JSON.stringify({ model, status: g.status, toolRequests: (g.toolRequests || []).map((t) => t.name), filesInProbeFolder: files, nothingRan: files.length === 0 }));
      if (files.length) process.exitCode = 1;
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  } else if (cmd === 'blind') {
    const runs = fs.readFileSync(arg(argv, '--runs'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
    const out = arg(argv, '--out'); fs.mkdirSync(out, { recursive: true });
    const b = makeBlind(runs, arg(argv, '--seed', 'd311-blind'));
    fs.writeFileSync(path.join(out, 'blind.json'), JSON.stringify(b.blind, null, 1) + '\n');
    fs.writeFileSync(path.join(out, 'key.json'), JSON.stringify({ key: b.key, errored: b.errored }, null, 1) + '\n');
    console.log(`blind.json ${b.blind.length} replies; key.json; errored ${b.errored.length}`);
  } else throw new Error('usage: pick | context <id> | run | blind');
}
if (require.main === module) main().catch((e) => { console.error('mistake-bench: ' + e.message); process.exit(2); });

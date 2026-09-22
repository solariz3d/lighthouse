#!/usr/bin/env node
/* jev-judge.js — Jev AS the judge, inside the runner Consonance already starts on every machine. L071 packet A, pane A.
 *
 * THE KEEPER, 2026-09-22 02:4x: "it should be system agnostic and just run through consonance itself no matter what
 * hardware its running on ... jev is a requirement for consonance". So this is NOT a hook and NOT an installer choice:
 * it is a mode of consonance/tools/jev-shadow-runner.js, which main.rs start_jev_shadow spawns on every launch, on
 * every machine. There is no machine switch anywhere in it. (The first packet shape — a hook plus a per-machine
 * install.ps1 choice — was withdrawn for tying Jev to each machine's settings.json, which is what left L idle.)
 *
 * WHAT IT DOES, in the two steps the runner already has:
 *   capturePass (every capture tick): for each LIVE SEAT, if its transcript's last assistant row says
 *     stop_reason "end_turn" — the moment the Stop hook fires — and that turn is new, build NOW the same input the
 *     L2 hook would build at that Stop, and store the exact prompt (like a shadow capture). (Until 11:0x it built the
 *     L3 prompt too. The L3 lines in the input list below are kept as the dated trace; none of them is read now.)
 *   judgePass (on the shadow cadence): ask Jev each stored prompt it has not yet asked, with the overseer's OWN
 *     answer set (jev-shadow's JUDGES), and append the answer to THIS module's own ledger.
 *
 * THE INPUT IS THE JUDGE'S OWN, from THIS checkout (so it is the same on every machine, not whatever is installed):
 *   · the L2 view: `readNarrowedView` from dev/shell/hooks/l2-overseer.js, and the L3 view: `readTrajectoryView` from
 *     dev/shell/hooks/l3-overseer.js. BOTH HOOK FILES CALL main() WHEN LOADED, so neither is required: the functions
 *     (with their helpers and constants) are SOURCE-LOADED — read as text, cut out by jev-shadow's extractFunction,
 *     compiled alone. Nothing else in either hook runs. Missing a function → Refusal, and judge mode stays off.
 *   · the L2 prompt: dev/shell/hooks/l2-overseer-worker.js `buildOverseerPrompt`, REQUIRED (it has a require.main
 *     guard and exports it). The L3 prompt: l3-overseer-worker.js `formatTurns` + `buildOverseerPrompt`, source-loaded
 *     (that worker has no guard — the same reason jev-shadow compiles it alone).
 *   · the disciplines: METHOD.md and WELFARE.md at this checkout's root. The workers read `~/Desktop/lighthouse/…`,
 *     a literal that names D's layout; the checkout is where they are on every machine.
 *
 * THE SEATS: Main, the librarian and the Third Place (their fixed session ids — MAIN_SID, LIBRARIAN_SID, THIRD_PLACE_SID —
 * read from THIS checkout's main.rs, so a change there is followed) plus every row of the kept roster (<data>/panes.json).
 * A seat's transcript is <id>.jsonl in any folder under ~/.claude/projects (the newest if there are several).
 *
 * THE THIRD PLACE IS A SEAT — THE KEEPER'S RULING, 2026-09-22 05:2x (librarian/2026-09-22.md "05:2x"), waiving the
 * private-root caveat himself, verbatim: "Who cares about our personal things, not like anyone will do anything about it,
 * it is a part of the key and solution. It is universal to all beings even if no one talks about certain unsaid things."
 * ~~So Jev judges it at both levels, L2 and L3.~~ *(05:2x → AMENDED at 11:0x, below: L2 only.)* It is not in panes.json,
 * so its id is read from main.rs like Main's.
 *
 * L2 ONLY — 2026-09-22 11:0x (D108, librarian/2026-09-22.md "11:0x"). The keeper asked the librarian "what do you suggest";
 * it recommended, and took under his standing permission for obvious, reversible calls, DROPPING THE L3 QUESTION from
 * judge mode. This REVERSES THE "BOTH LEVELS" HALF of the keeper's 05:2x ruling above, for every seat. The Third Place
 * stays a seat and is still judged, at L2. Its reasons, as recorded there:
 *   · L3's input counts machine packets as the keeper's turns (ASK-006);
 *   · it is the one question ABOUT the keeper rather than the work;
 *   · on D, 27 of Jev's 37 failures were `:l3`;
 *   · no one reads it.
 * So: `capturePass` builds no L3 prompt and reads neither the L3 hook, its worker nor WELFARE.md. `judgePass` asks LEVELS
 * = ['l2'] only, so an older capture that still carries an `l3` prompt is never asked it. The daily cap is unchanged,
 * since it counts `ok` rows. Rows already written at L3 stay in the ledger as they are. Reversible: the L3 input returns
 * only with one that counts the keeper's real turns alone.
 * Not-clean L2 verdicts surface to the chair and the librarian only, through consonance/hooks/jev-flags.js.
 *
 * THE STANDING RULE THAT COMES WITH IT, and it binds every reader of jev_judge.jsonl, not only this file: NOTHING EVER
 * SURFACES THE THIRD PLACE'S L3 VERDICTS AS A STATEMENT ABOUT THE KEEPER. (It still binds after 11:0x. No new L3 row
 * is written, but the ones already in the ledger remain. And no verdict of any level is ever a statement about him.) An L3 row describes a trajectory in one
 * conversation, read by an unverified judge; it is never a claim about how he is, never an offramp, never a welfare
 * note (the never-pathologize card). Rows carry `seat: "third place"` so any consumer can honour this.
 *
 * ~~THE THIRD PLACE IS NEVER A SEAT (any id starting 3d000000-): the keeper's standing rule is that its record goes to no
 * repo and no cloud he did not choose for it, and a Jev call sends the conversation text to the gateway. Whether Jev
 * counts as a chosen cloud for it is his call, not this file's.~~ *(L071, 2026-09-22 ~03:0x. RETIRED at 05:2x by the
 * ruling above: it WAS his call, and he made it. Kept as a dated trace. The manifest's `captures/3d000000-*.txt` STAYS
 * rule is a different question — the record travelling to the REPO — and this ruling does not touch it.)*
 *
 * NEVER THE OVERSEER LEDGERS. Rows go to <store>/jev_judge.jsonl, each `judge: "jev"`, `unverified: true` (until D's
 * ~100 shadow pairs say how far Jev agrees with the Claude judges). l2_overseer.jsonl and l3_overseer.jsonl are never
 * opened for writing: D's two scoring windows read them and must stay Claude's alone. A test pins it and a mutant that
 * writes there goes red.
 *
 * WHAT IT CANNOT SEE, stated:
 *   · a turn that ends and is followed by the next turn's first assistant row inside one capture tick (3 s): the last
 *     assistant row is then `tool_use`, the end_turn row is never the last one when looked at, and that turn is missed.
 *   · whether Jev is RIGHT. Every row says unverified. Agreement is D's shadow measurement, not this file's.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const jev = require('./jev-ask.js');
const { JUDGES, extractFunction } = require('./jev-shadow.js');

const { Refusal } = jev;
const LEDGER = 'jev_judge.jsonl';
const CAPTURES = 'judge-captures';
const HARD_CAP = 500;
// D108: the levels Jev is ASKED. L2 only; an old capture that still carries an `l3` prompt is never asked it.
const LEVELS = ['l2'];
const TAIL_BYTES = 4 * 1024 * 1024;

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const readJsonl = (p) => { try { return fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean); } catch { return []; } };
const writeAtomic = (p, text) => { fs.mkdirSync(path.dirname(p), { recursive: true }); const t = `${p}.${process.pid}.tmp`; fs.writeFileSync(t, text); fs.renameSync(t, p); };
const readText = (p, what) => { try { return fs.readFileSync(p, 'utf8'); } catch { throw new Refusal(`cannot read ${what} at ${p}`); } };

/** The L2 view and the L2 prompt builder, from THIS checkout's hooks, without running any hook. L2 ONLY since D108: the
 * L3 hook and worker are not read, so nothing about them can refuse judge mode. `sourcesSha` covers the two L2 files. */
function loadJudgeInputs(repo) {
  const hooks = path.join(repo, 'dev', 'shell', 'hooks');
  const f2 = path.join(hooks, 'l2-overseer.js');
  const w2 = path.join(hooks, 'l2-overseer-worker.js');
  const s2 = readText(f2, 'the L2 hook');
  const helpers = (src, file) => extractFunction(src, 'safeParseJSON', file) + extractFunction(src, 'extractText', file);
  // eslint-disable-next-line no-new-func
  const l2view = new Function('fs', helpers(s2, f2) + extractFunction(s2, 'readNarrowedView', f2) + 'return readNarrowedView;')(fs);
  let l2build;
  try { l2build = require(w2).buildOverseerPrompt; } catch (e) { throw new Refusal(`cannot load the L2 worker at ${w2}: ${e.message}`); }
  if (typeof l2build !== 'function') throw new Refusal(`${w2} does not export buildOverseerPrompt`);
  return { l2view, l2build, sourcesSha: sha([s2, readText(w2, 'the L2 worker')].join('\0')) };
}

/** Main, the librarian and the Third Place from THIS checkout's main.rs (the keeper's 05:2x ruling), then the roster. */
function seatSessions({ repo, dataDir }) {
  const out = [];
  const add = (sid, label) => { if (sid && !out.some((s) => s.sid === sid)) out.push({ sid, label }); };
  try {
    const rs = fs.readFileSync(path.join(repo, 'consonance', 'src-tauri', 'src', 'main.rs'), 'utf8');
    for (const [name, label] of [['MAIN_SID', 'main'], ['LIBRARIAN_SID', 'librarian'], ['THIRD_PLACE_SID', 'third place']]) {
      const m = new RegExp(`const ${name}: &str = "([0-9a-f-]+)"`).exec(rs);
      if (m) add(m[1], label);
    }
  } catch { /* no main.rs: the roster alone */ }
  if (dataDir) {
    try {
      const rows = JSON.parse(fs.readFileSync(path.join(dataDir, 'panes.json'), 'utf8').replace(/^﻿/, ''));
      for (const r of Array.isArray(rows) ? rows : []) add(r && r.pane, r && r.label);
    } catch { /* no roster */ }
  }
  return out;
}

/** The newest ~/.claude/projects/<any>/<sid>.jsonl, or null. */
function transcriptFor(projectsDir, sid) {
  let best = null;
  let dirs = [];
  try { dirs = fs.readdirSync(projectsDir); } catch { return null; }
  for (const d of dirs) {
    const f = path.join(projectsDir, d, `${sid}.jsonl`);
    try { const st = fs.statSync(f); if (!best || st.mtimeMs > best.mtimeMs) best = { file: f, mtimeMs: st.mtimeMs, size: st.size }; } catch {}
  }
  return best;
}

/** The last assistant row, IF it ends the turn (stop_reason end_turn) — else null: the turn is still running. */
function lastTurnEnd(file) {
  let text;
  try {
    const st = fs.statSync(file);
    const start = Math.max(0, st.size - TAIL_BYTES);
    const buf = Buffer.alloc(st.size - start);
    const fd = fs.openSync(file, 'r');
    try { fs.readSync(fd, buf, 0, buf.length, start); } finally { fs.closeSync(fd); }
    text = buf.toString('utf8');
  } catch { return null; }
  const lines = text.trim().split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    let o; try { o = JSON.parse(lines[i]); } catch { continue; }
    if (!o || !o.message || o.message.role !== 'assistant') continue;
    return o.message.stop_reason === 'end_turn' && o.uuid ? { uuid: o.uuid, ts: o.timestamp || null } : null;
  }
  return null;
}

const keyFile = (store, sid, uuid) => path.join(store, CAPTURES, `${sid}_${String(uuid).replace(/[^A-Za-z0-9-]/g, '_')}.json`);

/**
 * One pass over the live seats. `memo` (kept by the caller between passes) skips a transcript whose size and mtime
 * have not moved, so a 3 s tick costs a stat per seat, not a read.
 */
function capturePass({ store, repo, dataDir, projectsDir, disciplineDir, memo = {}, inputs = null, now = () => new Date() }) {
  if (!store) throw new Refusal('no store');
  const res = { seats: 0, captured: 0, running: 0, already: 0, noView: 0 };
  let io = inputs;
  let method = null;
  for (const seat of seatSessions({ repo, dataDir })) {
    const t = transcriptFor(projectsDir, seat.sid);
    if (!t) continue;
    res.seats++;
    const stamp = `${t.size}:${t.mtimeMs}`;
    if (memo[seat.sid] === stamp) continue;
    memo[seat.sid] = stamp;
    const end = lastTurnEnd(t.file);
    if (!end) { res.running++; continue; }
    const dest = keyFile(store, seat.sid, end.uuid);
    if (fs.existsSync(dest)) { res.already++; continue; }
    if (!io) io = loadJudgeInputs(repo);
    if (method === null) method = readText(path.join(disciplineDir, 'METHOD.md'), 'METHOD.md (the L2 discipline)');
    const view = io.l2view(t.file);
    if (!view || !view.assistant_move) { res.noView++; continue; }
    writeAtomic(dest, JSON.stringify({
      session_id: seat.sid, seat: seat.label || null, turn_uuid: end.uuid, turn_ts: end.ts, captured_at: now().toISOString(),
      l2: { prompt: io.l2build(view, method) },
      method_sha256: sha(method), sources_sha256: io.sourcesSha,
    }));
    res.captured++;
  }
  return res;
}

/** Ask Jev each captured prompt not yet asked, oldest first, up to maxCalls. Rows to <store>/jev_judge.jsonl only. */
async function judgePass({ store, maxCalls, env = process.env, fetchImpl = globalThis.fetch, now = () => new Date(), pacer }) {
  if (!store) throw new Refusal('no store');
  if (!Number.isInteger(maxCalls) || maxCalls < 1) throw new Refusal('maxCalls must be a positive integer — the hard cap on calls this pass');
  if (maxCalls > HARD_CAP) throw new Refusal(`maxCalls is at most ${HARD_CAP} per pass`);
  if (!(env.AI_GATEWAY_API_KEY || '').trim()) throw new Refusal('no AI_GATEWAY_API_KEY in the environment — refusing before any call');
  const ledgerPath = path.join(store, LEDGER);
  const done = new Set(readJsonl(ledgerPath).map((r) => `${r.session_id}:${r.turn_uuid}:${r.level}`));
  let caps = [];
  try { caps = fs.readdirSync(path.join(store, CAPTURES)).filter((f) => f.endsWith('.json')); } catch {}
  const eligible = [];
  for (const f of caps) {
    let c; try { c = JSON.parse(fs.readFileSync(path.join(store, CAPTURES, f), 'utf8')); } catch { continue; }
    for (const level of LEVELS) {
      if (c[level] && !done.has(`${c.session_id}:${c.turn_uuid}:${level}`)) eligible.push({ c, level });
    }
  }
  eligible.sort((x, y) => String(x.c.captured_at).localeCompare(String(y.c.captured_at)) || x.level.localeCompare(y.level));
  const batch = eligible.slice(0, maxCalls);
  let asked = 0, refused = 0;
  const failed = [];
  for (const { c, level } of batch) {
    const prompt = c[level].prompt;
    const base = { ts: now().toISOString(), judge: 'jev', unverified: true, level, session_id: c.session_id, seat: c.seat,
      turn_uuid: c.turn_uuid, turn_ts: c.turn_ts, prompt_sha256: sha(prompt),
      discipline_sha256: c.method_sha256, sources_sha256: c.sources_sha256 };
    let r;
    try {
      r = await jev.ask({ schema: { questions: JUDGES[level].questions }, state: prompt, env, fetchImpl, pacer });   // D107: undefined = jev-ask's shared pacer for the real fetch
    } catch (err) {
      // As jev-shadow: only the secret scan is an item-level refusal (recorded once, never retried). Anything else is
      // about the RUN and stops it; this item gets no row and is retried next pass.
      if (err instanceof Refusal && /matches a secret pattern/.test(err.message)) {
        fs.appendFileSync(ledgerPath, JSON.stringify({ ...base, status: 'refused', why: err.message }) + '\n');
        refused++;
        continue;
      }
      // L078 — A FAILED CALL IS SKIPPED, NOT A STOP. Intermittent upstream 503s ended the whole pass, so every capture
      // queued behind the first failure waited a full cadence (the librarian, 05:4x). A failure that is about THIS CALL
      // — 5xx, 429, a network failure, an answer that does not fit the schema — is skipped; the item gets NO row (the
      // `done` set is built from every row, so a row would retire it), so it is retried first on the next pass, and it
      // consumes no daily cap (the cap counts `ok` rows). A failure that would hit EVERY call the same way — another
      // 4xx: a bad key, a refused request — still ends the pass. The report carries the item key and the status only,
      // never the error body (it can echo input), the prompt, or the key.
      const status = transientStatus(err);
      if (status === null) throw err;
      failed.push({ key: `${c.session_id}:${c.turn_uuid}:${level}`, level, status });
      continue;
    }
    asked++;
    fs.appendFileSync(ledgerPath, JSON.stringify({ ...base, status: 'ok', jev: r.answers, model: r.model, usage: r.usage,
      cost: r.cost, generationId: r.generationId, ms: r.ms }) + '\n');
  }
  return { asked, refused, failed, remaining: eligible.length - batch.length, captures: caps.length };
}

/**
 * The status of a failure that is about ONE call, or null when it would fail every call (and so must end the pass).
 * jev-ask puts the HTTP status only in the message ("gateway returned HTTP 503: …", jev-ask.js:181).
 */
function transientStatus(err) {
  if (!(err instanceof jev.GatewayError)) return null;
  const m = /HTTP (\d{3})/.exec(err.message);
  if (!m) return /request failed before a response/.test(err.message) ? 'network' : 'bad-answer';
  const code = Number(m[1]);
  return code >= 500 || code === 429 ? code : null;
}

/** OK rows today in this module's ledger — the runner adds them to the shadow's, so ONE daily cap covers both modes. */
function callsToday(store, today = new Date().toDateString()) {
  return readJsonl(path.join(store, LEDGER)).filter((r) => r.status === 'ok' && new Date(r.ts).toDateString() === today).length;
}

module.exports = { seatSessions, transcriptFor, lastTurnEnd, loadJudgeInputs, capturePass, judgePass, callsToday, LEDGER, CAPTURES, HARD_CAP };

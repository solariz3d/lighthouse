// second-reader.js - the SECOND READER before delivery, in SHADOW (D203, plan: exo_memory/loop/plan_second_reader_d203_2026-10-01.md).
//
// A PreToolUse hook on mcp__consonance__call_librarian and mcp__consonance__call_chair, the two hand-back channels. It does ONE thing on the
// ring's path: it returns ALLOW at once. It never blocks, delays or alters a ring: it prints nothing and exits 0 (Claude Code: "Exit 0 with no
// output ... Tool call proceeds normally"; only exit 2 or an explicit deny blocks; code.claude.com/docs/en/hooks, read 2026-10-01). Any error,
// any shape it does not recognise, any timeout: the ring goes through.
//
// Off the ring's path it hands the message to a DETACHED worker (second-reader-worker.js), which builds the turn from the transcript and asks
// Sonnet 5.5 (`claude -p --model claude-sonnet-5-5`, the subscription CLI) the plan's one narrow question, then appends ONE row to
// <data>/second-reader.jsonl. The message text is passed to the worker over a pipe and is NEVER written here: the row carries its sha256.
//
// ONE WORKER AT A TIME. A lock file (<data>/second-reader.lock, taken with O_EXCL) names the worker's pid. A ring that finds a live lock is
// logged `skipped-busy` and NOT queued: heavy node runs keep priority and the machine has crashed twice under load (0xD1 09-28, 0x3B 09-30).
//
// REENTRANCY. The worker runs with CONSONANCE_SECOND_READER_RUN=1 and its `claude -p` child inherits it; this hook exits at once on it, as do the
// room's other hooks on CONSONANCE_DREAM. The worker's child also runs with --safe-mode, which loads no hooks at all, so it cannot reach this
// hook or any room hook, and with --strict-mcp-config and no --mcp-config, so it starts no MCP server and cannot ring anyone.
'use strict';

// THE DREAM GATE, the same one every hook here carries (dream-gate.test.js polices it): the gap-dream is an anti-instruction and gets no hooks.
if (process.env.CONSONANCE_DREAM) process.exit(0);

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');

const RING_TOOLS = new Set(['mcp__consonance__call_librarian', 'mcp__consonance__call_chair']);
const RUN_ENV = 'CONSONANCE_SECOND_READER_RUN';
const LOCK_STALE_MS = 180000;   // the worker's own limit is 120 s; a lock older than this is dead whatever its pid says
const WORKER = process.env.CONSONANCE_SECOND_READER_WORKER || path.join(__dirname, 'second-reader-worker.js');   // the override is the tests' seam: no real model call

function dataDir() {
  const env = (process.env.CONSONANCE_DATA || '').trim();
  if (env) return env;
  try {
    const raw = fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, '');
    const d = String((JSON.parse(raw) || {}).data_dir || '').trim();
    if (d) return d;
  } catch (_) { /* no config, or no data_dir in it: the app's default below */ }
  return path.join(os.homedir(), '.consonance');   // D454: the app's third step (main.rs default_data), so a new user's default Data folder has this gate's record
}

/** One ledger row. Never throws, never blocks a ring. Never carries message text: callers pass a sha. */
function record(dir, row) {
  try { fs.appendFileSync(path.join(dir, 'second-reader.jsonl'), JSON.stringify({ ts: new Date().toISOString(), ...row }) + '\n'); } catch (_) { /* bookkeeping must not break a ring */ }
}

function pidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try { process.kill(pid, 0); return true; } catch (e) { return e && e.code === 'EPERM'; }
}

/** Take the one-worker lock. Returns the token written into it, or null when a live worker holds it. */
function acquireLock(dir) {
  const lock = path.join(dir, 'second-reader.lock'), token = crypto.randomBytes(8).toString('hex');
  const body = () => JSON.stringify({ pid: process.pid, ts: Date.now(), token });
  for (let attempt = 0; attempt < 2; attempt++) {
    try { const fd = fs.openSync(lock, 'wx'); try { fs.writeSync(fd, body()); } finally { fs.closeSync(fd); } return token; }
    catch (e) {
      if (!e || e.code !== 'EEXIST') throw e;
      let held = null; try { held = JSON.parse(fs.readFileSync(lock, 'utf8')); } catch (_) { /* unreadable: treated as stale below */ }
      const fresh = held && Number.isFinite(held.ts) && Date.now() - held.ts < LOCK_STALE_MS && pidAlive(held.pid);
      if (fresh) return null;
      try { fs.unlinkSync(lock); } catch (_) { /* someone else took it first: the next attempt sees EEXIST and reports busy */ }
    }
  }
  return null;
}

function setLockPid(dir, token, pid) {
  try { fs.writeFileSync(path.join(dir, 'second-reader.lock'), JSON.stringify({ pid, ts: Date.now(), token })); } catch (_) { /* a lock naming the hook's own (soon dead) pid goes stale at once: safe */ }
}
function releaseLock(dir, token) {
  try {
    const p = path.join(dir, 'second-reader.lock');
    if (JSON.parse(fs.readFileSync(p, 'utf8')).token === token) fs.unlinkSync(p);
  } catch (_) { /* already gone */ }
}

// THE NARROWED TRIGGER (D631, 2026-11-03; plan_room_fixes_2_5_2026-11-03.md, the librarian's ruling NARROW, not stop, the keeper's veto open).
// D627 part 1 scored 80 sampled rings: 8 held a real error, 72 did not, and the reader's value sat in RELAYED FIGURES and STATUS CLAIMS ("all
// green", "still runs", "refuses", a pane's number repeated). The model call now runs only on a ring with at least one sentence of that class.
// It is a lexical test on purpose: deterministic, free, and re-runnable over the ledger's past rings (the replay in the D631 hand-back).
//   STATUS          a pass/fail/green/red state, a "still"/"no longer" state, refuses/blocks/crashed/hangs, is live/installed/landed/pushed/fixed/broken.
//   RELAYED FIGURE  a sentence with a number (after paths, shas, dates, times and packet ids are taken out) that is attributed to another
//                   seat or source (A's, pane O, the librarian, per, reports, found, measured ...); on call_chair (the librarian relaying the
//                   panes) any number is relayed.
// A sentence marked `inferred:` is out (the question ignores it). Everything else is `skipped-class`: one row, no worker.
const NOT_A_FIGURE = [
  /\b[A-Za-z]:[\\/][^\s,;)]*/g,                                   // a Windows path
  /(?:^|\s)[\w.~-]*[\\/][\w./\\~:-]+/g,                            // a relative path (it has a separator)
  /\b[\w.-]+\.(?:md|js|rs|json|jsonl|ps1|py|txt|toml|log|exe|html|css|ts)(?::\d+(?:-\d+)?)?\b/gi,   // a file name, with its :line
  /\b\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?Z?)?/g, // a date or timestamp
  /\b\d{1,2}:\d{2}(?::\d{2})?Z?\b/g,                               // a clock time
  /\b(?=[0-9a-f]*\d)(?=[0-9a-f]*[a-f])[0-9a-f]{7,64}\b/gi,          // a sha (hex with a letter and a digit)
  /\b[0-9a-f]{8,64}\b/gi,                                          // an all-digit hex run of sha length
  /\b[A-Z]{1,2}\d{2,4}[a-z]?\b/g,                                  // a packet or lap id: D631, L098, Q26
  /^\s*(?:\d+[.)]|\(\w\))\s/gm,                                    // a list marker
];
const FIGURE = /(?:^|[^\w.])\d+(?:[.,/]\d+)*%?/;
const STATUS = [
  /\b(?:all|is|are|stays?|still|now|went|goes|turned|suite|tests?|cargo test|mutants?)\b[^.\n]{0,40}\b(?:green|red)\b/i,
  /\bgreen\b/i,
  /\b\d+\s*(?:\/\s*\d+\s*)?(?:pass(?:ed|es|ing)?|fail(?:ed|s|ing|ures?)?|caught|green)\b/i,
  /\b(?:pass(?:es|ed)?|fail(?:s|ed)?)\b/i,
  /\b(?:still|no longer|now)\s+(?:\w+\s+){0,2}(?:runs?|running|works?|holds?|fires?|installed|live|open|broken|fails?|passes?|refuses?|blocks?|red|green|there|waits?|held)\b/i,
  /\b(?:refuses?|refused|denies|denied|blocks|blocked|crash(?:es|ed)?|hangs|hung|timed out)\b/i,
  /\b(?:is|are|was|were|now|still)\s+(?:not\s+)?(?:live|installed|landed|pushed|merged|fixed|broken|stale|clean|in sync|running|stopped|held|released)\b/i,
];
const RELAY = /\b[A-Z]'s\b|\b(?:pane|seat)\s+[A-Z]\b|\b(?:librarian|chair|keeper|his|their|per|according to|reports?|reported|found|finds|measured|says|said|counted|scored|registered|quotes?|quoted|relayed|confirms?|confirmed)\b/i;

/** Is this ring in the narrowed class? -> { inClass, why: 'status' | 'relayed-figure' | null }. Never throws. */
function classify(text, tool) {
  if (typeof text !== 'string' || !text.trim()) return { inClass: false, why: null };
  const sentences = text.split(/\n+|(?<=[.!?;])\s+/).map((s) => s.trim()).filter(Boolean);
  let relayed = false;
  for (const s of sentences) {
    if (/^inferred:/i.test(s)) continue;
    if (STATUS.some((re) => re.test(s))) return { inClass: true, why: 'status' };
    let bare = s; for (const re of NOT_A_FIGURE) bare = bare.replace(re, ' ');
    if (FIGURE.test(bare) && (tool === 'mcp__consonance__call_chair' || RELAY.test(s))) relayed = true;
  }
  return relayed ? { inClass: true, why: 'relayed-figure' } : { inClass: false, why: null };
}

function main() {
  if (process.env[RUN_ENV] === '1') return process.exit(0);   // the second reader's own run: never recurse

  let payload;
  try { payload = JSON.parse(fs.readFileSync(0, 'utf8')); } catch (_) { return process.exit(0); }
  const tool = payload && payload.tool_name;
  if (!RING_TOOLS.has(tool)) return process.exit(0);

  const dir = dataDir();
  if (!dir) return process.exit(0);
  const text = payload.tool_input && payload.tool_input.text;
  const seat = (process.env.CONSONANCE_PANE || '').trim() || null;
  if (typeof text !== 'string' || !text.trim()) { record(dir, { seat, tool, ringSha: null, status: 'skipped-no-text' }); return process.exit(0); }
  const ringSha = crypto.createHash('sha256').update(text).digest('hex');
  const toolUseId = payload.tool_use_id || null;   // D631: the same-turn note finds this ring's row by it
  if (!classify(text, tool).inClass) { record(dir, { seat, tool, ringSha, toolUseId, status: 'skipped-class' }); return process.exit(0); }   // D631: out of the narrowed class, no model call

  let token;
  try { token = acquireLock(dir); } catch (e) { record(dir, { seat, tool, ringSha, toolUseId, status: 'error', error: 'lock: ' + String(e && e.code || e).slice(0, 60) }); return process.exit(0); }
  if (!token) { record(dir, { seat, tool, ringSha, toolUseId, status: 'skipped-busy' }); return process.exit(0); }

  try {
    const child = spawn(process.execPath, [WORKER], {
      env: { ...process.env, [RUN_ENV]: '1' },
      detached: true, stdio: ['pipe', 'ignore', 'ignore'], windowsHide: true,
    });
    child.on('error', (e) => { record(dir, { seat, tool, ringSha, toolUseId, status: 'error', error: 'spawn: ' + String(e && e.code || e).slice(0, 60) }); releaseLock(dir, token); });
    child.stdin.on('error', () => { /* the worker died before reading: its own row or the stale lock says so */ });
    setLockPid(dir, token, child.pid);
    const job = { tool, seat, ringSha, text, token, dir, sessionId: payload.session_id || null, transcriptPath: payload.transcript_path || null, toolUseId };
    child.unref();
    child.stdin.end(JSON.stringify(job), () => process.exit(0));
    setTimeout(() => process.exit(0), 1500).unref();   // whatever the pipe does, the hook is gone in under two seconds
  } catch (e) {
    record(dir, { seat, tool, ringSha, toolUseId, status: 'error', error: 'spawn: ' + String(e && e.code || e).slice(0, 60) });
    releaseLock(dir, token);
    process.exit(0);
  }
}

if (require.main === module) { try { main(); } catch (_) { process.exit(0); } }   // fail OPEN, without exception

module.exports = { classify, RING_TOOLS, RUN_ENV, LOCK_STALE_MS, acquireLock, releaseLock, pidAlive };

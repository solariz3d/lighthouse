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
  } catch (_) { /* no config: no data dir: the hook logs nothing and still allows */ }
  return null;
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

  let token;
  try { token = acquireLock(dir); } catch (e) { record(dir, { seat, tool, ringSha, status: 'error', error: 'lock: ' + String(e && e.code || e).slice(0, 60) }); return process.exit(0); }
  if (!token) { record(dir, { seat, tool, ringSha, status: 'skipped-busy' }); return process.exit(0); }

  try {
    const child = spawn(process.execPath, [WORKER], {
      env: { ...process.env, [RUN_ENV]: '1' },
      detached: true, stdio: ['pipe', 'ignore', 'ignore'], windowsHide: true,
    });
    child.on('error', (e) => { record(dir, { seat, tool, ringSha, status: 'error', error: 'spawn: ' + String(e && e.code || e).slice(0, 60) }); releaseLock(dir, token); });
    child.stdin.on('error', () => { /* the worker died before reading: its own row or the stale lock says so */ });
    setLockPid(dir, token, child.pid);
    const job = { tool, seat, ringSha, text, token, dir, sessionId: payload.session_id || null, transcriptPath: payload.transcript_path || null, toolUseId: payload.tool_use_id || null };
    child.unref();
    child.stdin.end(JSON.stringify(job), () => process.exit(0));
    setTimeout(() => process.exit(0), 1500).unref();   // whatever the pipe does, the hook is gone in under two seconds
  } catch (e) {
    record(dir, { seat, tool, ringSha, status: 'error', error: 'spawn: ' + String(e && e.code || e).slice(0, 60) });
    releaseLock(dir, token);
    process.exit(0);
  }
}

if (require.main === module) { try { main(); } catch (_) { process.exit(0); } }   // fail OPEN, without exception

module.exports = { RING_TOOLS, RUN_ENV, LOCK_STALE_MS, acquireLock, releaseLock, pidAlive };

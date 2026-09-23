#!/usr/bin/env node
'use strict';
// heavy-run.js — ONE HEAVY RUNNER PER TREE (L098, stall fix 3 of exo_memory/loop/stall_trace_2026-09-23.md).
//
// WHY. On 2026-09-23 several seats ran the full js-suite and the mutant harnesses at once in one checkout. The chair read
// 122/1 off a snapshot of another seat's half-written files, and a pane hit portable-paths red the same way. A reading
// taken while another run is rewriting the tree is a reading of nobody's state. One heavy run at a time makes it mean
// something.
//
// THE LOCK is <data>/heavy-run.lock — the data dir every tool already resolves (state-manifest.js dataDir: CONSONANCE_DATA,
// then ~/.consonance.json data_dir) — holding {pid, seat, cmd, started, token}. It is created EXCLUSIVELY ('wx'), so two
// runners can never both hold it. `seat` is the first 8 of CONSONANCE_PANE (the pane's session id), or 'terminal'.
//
// A SECOND RUNNER WAITS and says whom it waits on — `heavy-run: waiting on <seat> pid <pid> (<cmd>, since <t>)` — once at
// once, then once a minute, polling every 2 s.
//
// THE MAX WAIT IS 30 MINUTES, and after it the runner FAILS LOUDLY with the holder's details (exit 3). It never runs
// anyway: running anyway is the defect this file exists to end. Why 30: a full js-suite on L takes a few minutes and a
// single `--only` mutant a few more, so a waiter behind ordinary work gets through; a whole-harness run (state-sync's
// 54 mutants, each a full suite) takes far longer than 30 minutes, and a seat parked silently behind it for hours is the
// stall this lap is fixing in another costume. At 30 minutes the waiting seat is told who holds the tree and decides
// (wait again, ask that seat), rather than spending its night in a poll. CONSONANCE_HEAVY_WAIT_MS overrides it.
//
// A STALE LOCK (its pid is not alive) is TAKEN OVER, and the takeover is LOGGED on stderr with the holder and its age,
// and recorded in the new lock as `took_over`. There is no separate log file: a new file in the data dir is UNPLACED at
// close until the manifest names it, and the lock itself already needs that row (see the hand-back). Liveness is the
// codebase's own idiom (ledger-union.js :293, head-watch.js, close.mutants.js): process.kill(pid, 0), EPERM = alive.
// A pid the OS has since REUSED reads alive — the waiter then waits and, at the max wait, fails loudly naming it, which
// is the safe direction. The takeover moves the stale file aside with an atomic rename; if a race moved a LIVE lock
// instead, it is put back with linkSync, which cannot overwrite, and the waiter keeps waiting.
//
// NESTED RUNS ARE THE SAME RUN. The holder exports its token as CONSONANCE_HEAVY_RUN_TOKEN, which every child inherits;
// a runner whose environment carries the token of the current lock does not wait (it would wait on its own parent
// forever) and does not release. js-suite runs mutant-harness.test.js, which spawns mutant-harness.js --audit.
//
// RELEASED on normal exit and on an uncaught error (both fire process 'exit'), and on SIGINT/SIGTERM/SIGBREAK/SIGHUP. A
// release removes the lock only if it still carries this run's token.
//
//   const h = require('./heavy-run.js').hold({ cmd: 'js-suite' });   // waits, or exits 3 loudly; releases on exit

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { dataDir: manifestDataDir } = require('./state-manifest.js');

const LOCK_NAME = 'heavy-run.lock';
const TOKEN_ENV = 'CONSONANCE_HEAVY_RUN_TOKEN';
const MAX_WAIT_MS = 30 * 60 * 1000;
const POLL_MS = 2000;
const SAY_EVERY_MS = 60 * 1000;
const UNREADABLE_GRACE_MS = 10 * 1000;   // a lock being written this instant reads empty; only an OLD unreadable one is stale

function pidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; }
}
function seatName(env) { const p = String(env.CONSONANCE_PANE || '').trim(); return p ? p.slice(0, 8) : 'terminal'; }
function sleepSync(ms) { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); }
function readLock(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return e.code === 'ENOENT' ? null : { unreadable: e.message }; }
}
const describe = (h) => `${h.seat || '?'} pid ${h.pid} (${h.cmd || '?'}, since ${h.started || '?'})`;
const mins = (ms) => `${Math.round(ms / 60000)}m`;

function acquire({
  cmd, dataDir, env = process.env,
  maxWaitMs = Number(process.env.CONSONANCE_HEAVY_WAIT_MS) || MAX_WAIT_MS, pollMs = POLL_MS,
  alive = pidAlive, log = (s) => process.stderr.write(s + '\n'), now = () => Date.now(), sleep = sleepSync,
} = {}) {
  const dir = dataDir === undefined ? manifestDataDir() : dataDir;
  if (!dir) throw Object.assign(new Error('heavy-run: no data dir (CONSONANCE_DATA unset and ~/.consonance.json has no data_dir) — refusing to run without the lock'), { code: 'HEAVY_RUN_NO_DATA' });
  const file = path.join(dir, LOCK_NAME);

  const current = readLock(file);
  if (current && env[TOKEN_ENV] && current.token === env[TOKEN_ENV]) {
    return { file, reentrant: true, holder: current, release() {} };
  }

  const token = crypto.randomUUID();
  const t0 = now();
  let said = -Infinity;
  let tookOver = null;
  for (;;) {
    const rec = { pid: process.pid, seat: seatName(env), cmd, started: new Date(now()).toISOString(), token };
    if (tookOver) rec.took_over = tookOver;
    try {
      const fd = fs.openSync(file, 'wx');
      try { fs.writeSync(fd, JSON.stringify(rec)); } finally { fs.closeSync(fd); }
      env[TOKEN_ENV] = token;
      let released = false;
      return {
        file, reentrant: false, holder: rec,
        release() {
          if (released) return;
          released = true;
          const cur = readLock(file);
          if (cur && cur.token === token) { try { fs.unlinkSync(file); } catch (_) { /* already gone */ } }
          if (env[TOKEN_ENV] === token) delete env[TOKEN_ENV];
        },
      };
    } catch (e) { if (e.code !== 'EEXIST') throw e; }

    const h = readLock(file);
    if (h === null) continue;                                     // released between the open and the read
    let stale = false;
    if (h.unreadable) {
      let age = 0;
      try { age = now() - fs.statSync(file).mtimeMs; } catch (_) { continue; }
      stale = age > UNREADABLE_GRACE_MS;
    } else stale = !alive(h.pid);
    if (stale) {
      const aside = `${file}.stale-${process.pid}-${now()}`;
      try { fs.renameSync(file, aside); } catch (e) { if (e.code === 'ENOENT') continue; throw e; }
      const moved = readLock(aside);
      if (moved && !moved.unreadable && moved.token !== h.token && alive(moved.pid)) {
        // A race: between our read and our rename another runner took the lock. Put ITS lock back; linkSync fails
        // rather than overwrite, so a lock created meanwhile is never clobbered either.
        try { fs.linkSync(aside, file); } catch (_) { /* a newer lock is already there */ }
        try { fs.unlinkSync(aside); } catch (_) {}
        continue;
      }
      try { fs.unlinkSync(aside); } catch (_) {}
      const age = h.started ? now() - Date.parse(h.started) : null;
      tookOver = { holder: { pid: h.pid ?? null, seat: h.seat ?? null, cmd: h.cmd ?? null, started: h.started ?? null }, age_ms: Number.isFinite(age) ? age : null };
      log(`heavy-run: took over a stale lock — ${h.unreadable ? `an unreadable lock (${h.unreadable})` : describe(h)} is not running; it was ${Number.isFinite(age) ? mins(age) : 'an unknown age'} old`);
      continue;
    }
    const waited = now() - t0;
    if (waited >= maxWaitMs) {
      throw Object.assign(new Error(`heavy-run: gave up after ${mins(waited)} — ${describe(h)} still holds ${file}. Not running anyway: two heavy runs in one tree make both readings meaningless. Wait for it, or ask that seat.`), { code: 'HEAVY_RUN_TIMEOUT', holder: h });
    }
    if (now() - said >= SAY_EVERY_MS) { log(`heavy-run: waiting on ${describe(h)}`); said = now(); }
    sleep(pollMs);
  }
}

/** Take the lock for this process (waiting as acquire does) and release it on exit, error and signal. On a timeout or a
 *  refusal the process EXITS here, loudly — the runner never starts. */
function hold(opts = {}) {
  let h;
  try { h = acquire(opts); } catch (e) {
    process.stderr.write(e.message + '\n');
    process.exit(e.code === 'HEAVY_RUN_TIMEOUT' ? 3 : 2);
  }
  if (h.reentrant) return h;
  process.on('exit', () => h.release());
  // On a signal, EXIT, and the 'exit' handler above releases. (A release call here was redundant — process.exit fires
  // 'exit' — and its mutant could not be told apart: L098 H7.) Only when this is the sole listener: a harness with its
  // own signal cleanup exits itself, and its exit releases the same way.
  for (const sig of ['SIGINT', 'SIGTERM', 'SIGBREAK', 'SIGHUP']) {
    process.on(sig, () => { if (process.listenerCount(sig) === 1) process.exit(130); });
  }
  return h;
}

module.exports = { acquire, hold, pidAlive, LOCK_NAME, TOKEN_ENV, MAX_WAIT_MS };

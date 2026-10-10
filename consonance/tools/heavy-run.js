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
// D286 (the keeper, 2026-10-10 09:38: "multiple heavy runs at once"): TWO SLOTS, ONE PER TREE. The lock exists because seats read each other's half-written files IN ONE CHECKOUT, so it
// only has to serialise within a tree; one machine-wide file made a t180 landing wait on a lighthouse run in another worktree. There are now N slots (default 2; CONSONANCE_HEAVY_SLOTS, 1..8,
// else the default: a typo must not switch the lock off): <data>/heavy-run.lock, heavy-run.2.lock, ... Each lock records its TREE (`git rev-parse --show-toplevel` of the cwd, lower-cased on
// Windows; a cwd outside git, or where git cannot run, is the ONE shared bucket "(not in a git tree)", so such runs serialise with each other and run beside a run in a real tree). A runner
// whose tree already holds a slot WAITS, whichever slot is free; a lock with no tree recorded (written before D286) blocks every tree. With ONE slot every live lock blocks: today's behaviour.
// The slot scan looks at every slot file (to 8) even when this runner may claim fewer. Two runners of one tree can claim different free slots in the same instant, so after writing its claim a runner
// looks once more and backs off (removes its own claim, tries again after a jitter) if a blocking lock is there: the one that proceeds is the one that saw nobody. The takeover rules below are
// applied PER SLOT, unchanged. A runner waiting with every slot held names every holder; one held up by its own tree names that holder.
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
// D283 (the chair, 2026-10-10: "C's run took over my LIVE lock"): checked, and the takeover was RIGHT. The chair's own TaskStop on its land_turnby run is in its
// transcript at 01:58:50.042Z; the takeover's age_ms was 2,300,472 on a lock started 01:20:31.118Z, i.e. 01:58:51.590Z, 1.5 s later, from a waiter that polls every 2 s. A
// stopped background task takes its whole tree with it (holder, cmd.exe, child: all three read dead by kill(0), tasklist and CIM) and leaves the lock file behind, so
// "a stale lock, taken over at once" is what TaskStop produces. Cross-session kill(0) works: the chair's live holder, read from another seat's session, was alive by all
// three methods, and its CIM creation time matched the lock's started to 27 ms. BUT a lock this young deserves a second witness before it is taken, so it now is:
//   - a lock YOUNGER than YOUNG_MS (30 min: the longest known full run is 1,570 s) is taken only when pidGone(pid) (tasklist on Windows) ALSO says the holder is gone;
//     if the two disagree, or the second cannot tell, it waits and says so once. A lock with no readable `started` counts as young (unknown is the safe side). An older
//     lock is as before: kill(0) alone.
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
const { spawnSync } = require('child_process');
const { dataDir: manifestDataDir } = require('./state-manifest.js');

const LOCK_NAME = 'heavy-run.lock';   // slot 1; slot k is heavy-run.k.lock (D286)
const DEFAULT_SLOTS = 2;
const MAX_SLOTS = 8;
const NON_GIT_TREE = '(not in a git tree)';
const TOKEN_ENV = 'CONSONANCE_HEAVY_RUN_TOKEN';
const MAX_WAIT_MS = 30 * 60 * 1000;
const POLL_MS = 2000;
const SAY_EVERY_MS = 60 * 1000;
const YOUNG_MS = 30 * 60 * 1000;         // D283: a lock younger than this is taken only when a SECOND method also says its holder is gone (the full suite took 1,570 s)
const UNREADABLE_GRACE_MS = 10 * 1000;   // a lock being written this instant reads empty; only an OLD unreadable one is stale

function pidAlive(pid, kill = process.kill.bind(process)) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try { kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; }
}
/** The SECOND witness (D283): true = the pid is gone, false = a process with that pid is listed, null = cannot tell. On Windows it asks `tasklist /FI "PID eq n"`, which
 *  is the OS's own process list and does not depend on what kill(0) is allowed to open; elsewhere kill(0) is the whole truth, so there is nothing to add (true). */
function pidGone(pid, run = spawnSync, platform = process.platform) {
  if (platform !== 'win32') return true;
  let r; try { r = run('tasklist', ['/FI', `PID eq ${pid}`, '/FO', 'CSV', '/NH'], { encoding: 'utf8', timeout: 8000, windowsHide: true }); } catch (_) { return null; }
  if (!r || r.error || r.status !== 0 || typeof r.stdout !== 'string') return null;
  const listed = r.stdout.split(/\r?\n/).some((line) => { const c = line.match(/"[^"]*"/g); return !!c && c.length >= 2 && Number(c[1].slice(1, -1)) === pid; });
  return !listed;
}
const ageOf = (h, t) => { const s = Date.parse(h && h.started); return Number.isFinite(s) ? t - s : null; };
function seatName(env) { const p = String(env.CONSONANCE_PANE || '').trim(); return p ? p.slice(0, 8) : 'terminal'; }
function sleepSync(ms) { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); }
function readLock(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return e.code === 'ENOENT' ? null : { unreadable: e.message }; }
}
const describe = (h) => `${h.seat || '?'} pid ${h.pid} (${h.cmd || '?'}, since ${h.started || '?'})`;
const mins = (ms) => `${Math.round(ms / 60000)}m`;

const slotFile = (dir, k) => path.join(dir, k === 1 ? LOCK_NAME : `heavy-run.${k}.lock`);
/** The slot count: the `slots` option, else CONSONANCE_HEAVY_SLOTS, else DEFAULT_SLOTS. Anything that is not a whole number from 1 to MAX_SLOTS is the default (a typo must not switch the lock off). */
function slotCount(raw) {
  if (raw === undefined || raw === null || raw === '') return DEFAULT_SLOTS;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 && n <= MAX_SLOTS ? n : DEFAULT_SLOTS;
}
/** D286: the tree a run belongs to — `git rev-parse --show-toplevel` of the cwd, lower-cased on Windows (git prints C:/ and the OS may say c:\). A cwd that is not in a git tree (or where git cannot
 *  run) is NON_GIT_TREE: ONE shared bucket, so non-git runs serialise with each other (unknown is the safe side) and still run beside a run in a real tree. */
function resolveTree(cwd = process.cwd(), run = spawnSync, platform = process.platform) {
  let r; try { r = run('git', ['rev-parse', '--show-toplevel'], { cwd, encoding: 'utf8', timeout: 8000, windowsHide: true }); } catch (_) { return NON_GIT_TREE; }
  const top = r && !r.error && r.status === 0 && typeof r.stdout === 'string' ? r.stdout.trim() : '';
  if (!top) return NON_GIT_TREE;
  const p = path.resolve(top);
  return platform === 'win32' ? p.toLowerCase() : p;
}

function acquire({
  cmd, dataDir, env = process.env, slots, tree, onClaim, beforeClaim,
  maxWaitMs = Number(process.env.CONSONANCE_HEAVY_WAIT_MS) || MAX_WAIT_MS, pollMs = POLL_MS,
  alive = pidAlive, confirmGone = pidGone, log = (s) => process.stderr.write(s + '\n'), now = () => Date.now(), sleep = sleepSync,
} = {}) {
  const dir = dataDir === undefined ? manifestDataDir() : dataDir;
  if (!dir) throw Object.assign(new Error('heavy-run: no data dir (CONSONANCE_DATA unset and ~/.consonance.json has no data_dir) — refusing to run without the lock'), { code: 'HEAVY_RUN_NO_DATA' });
  const n = slotCount(slots !== undefined ? slots : process.env.CONSONANCE_HEAVY_SLOTS);

  // A nested run carries the token of the lock it runs under, in whichever slot that lock is.
  if (env[TOKEN_ENV]) {
    for (let k = 1; k <= MAX_SLOTS; k++) {
      const file = slotFile(dir, k), current = readLock(file);
      if (current && current.token === env[TOKEN_ENV]) return { file, slot: k, reentrant: true, holder: current, release() {} };
    }
  }

  const myTree = tree !== undefined ? tree : resolveTree();
  const token = crypto.randomUUID();
  const t0 = now();
  let said = -Infinity;
  let tookOver = null;
  const disagreed = new Set();   // tokens whose liveness disagreement has been said once
  // Does a lock held by `h` forbid me to run? Always with ONE slot (today's machine-wide lock); else when it is in my tree, or records none (a lock from before D286: unknown is the safe side).
  const blocks = (h) => n === 1 || !h.tree || h.tree === myTree;

  // D283's judgement of one lock file, unchanged: true = the lock was STALE and has been taken out of the way (the slot is free now), false = it is live.
  function takeIfStale(file, k, h) {
    let stale = false;
    if (h.unreadable) {
      let age = 0;
      try { age = now() - fs.statSync(file).mtimeMs; } catch (_) { return true; }
      stale = age > UNREADABLE_GRACE_MS;
    } else {
      stale = !alive(h.pid);
      if (stale) {   // D283: a young lock needs a second witness (see the header)
        const age = ageOf(h, now());
        if (age === null || age < YOUNG_MS) {
          const second = confirmGone(h.pid);
          if (second !== true) {
            stale = false;
            if (!disagreed.has(h.token)) {
              disagreed.add(h.token);
              log(`heavy-run: ${describe(h)} reads not-running to process.kill(pid, 0) but ${second === false ? 'RUNNING to tasklist' : 'tasklist could not confirm it'}; the lock is ${age === null ? 'of unknown age' : mins(age) + ' old'}, younger than ${mins(YOUNG_MS)}, so it is NOT taken over: waiting`);
            }
          }
        }
      }
    }
    if (!stale) return false;
    const aside = `${file}.stale-${process.pid}-${now()}`;
    try { fs.renameSync(file, aside); } catch (e) { if (e.code === 'ENOENT') return true; throw e; }
    const moved = readLock(aside);
    if (moved && !moved.unreadable && moved.token !== h.token && alive(moved.pid)) {
      // A race: between our read and our rename another runner took the lock. Put ITS lock back; linkSync fails
      // rather than overwrite, so a lock created meanwhile is never clobbered either.
      try { fs.linkSync(aside, file); } catch (_) { /* a newer lock is already there */ }
      try { fs.unlinkSync(aside); } catch (_) {}
      return false;
    }
    try { fs.unlinkSync(aside); } catch (_) {}
    const age = h.started ? now() - Date.parse(h.started) : null;
    tookOver = { holder: { pid: h.pid ?? null, seat: h.seat ?? null, cmd: h.cmd ?? null, started: h.started ?? null }, age_ms: Number.isFinite(age) ? age : null };
    log(`heavy-run: took over a stale lock — ${h.unreadable ? `an unreadable lock (${h.unreadable})` : describe(h)} is not running; it was ${Number.isFinite(age) ? mins(age) : 'an unknown age'} old (slot ${k})`);
    return true;
  }

  for (;;) {
    // Look at every slot — the ones above n too: a runner told to use fewer slots still honours a holder in another.
    const live = [], free = [];
    for (let k = 1; k <= MAX_SLOTS; k++) {
      const file = slotFile(dir, k), h = readLock(file);
      if (h === null) { if (k <= n) free.push(k); continue; }
      if (takeIfStale(file, k, h)) { if (k <= n) free.push(k); continue; }
      live.push({ k, file, h });
    }
    const blockers = live.filter((x) => blocks(x.h));
    if (blockers.length === 0 && free.length) {
      const k = free[0], file = slotFile(dir, k);
      const rec = { pid: process.pid, seat: seatName(env), cmd, tree: myTree, started: new Date(now()).toISOString(), token };
      if (tookOver) rec.took_over = tookOver;
      if (beforeClaim) beforeClaim({ slot: k, file });   // a seam for the tests: the instant between looking and claiming
      let fd;
      try { fd = fs.openSync(file, 'wx'); } catch (e) { if (e.code === 'EEXIST') continue; throw e; }
      try { fs.writeSync(fd, JSON.stringify(rec)); } finally { fs.closeSync(fd); }
      if (onClaim) onClaim({ slot: k, file });
      // Two runners of one tree can each claim a DIFFERENT free slot in the same instant. Look again: whoever finds another lock that blocks it backs off, so the one that
      // proceeds is the one that saw nobody, and any later claimer sees it (that claimer's look comes after its own write, which comes after the earlier one's look).
      let clash = false;
      for (let j = 1; j <= MAX_SLOTS && !clash; j++) {
        if (j === k) continue;
        const o = readLock(slotFile(dir, j));
        if (o && o.token !== token && blocks(o)) clash = true;
      }
      if (!clash) {
        env[TOKEN_ENV] = token;
        let released = false;
        return {
          file, slot: k, reentrant: false, holder: rec,
          release() {
            if (released) return;
            released = true;
            const cur = readLock(file);
            if (cur && cur.token === token) { try { fs.unlinkSync(file); } catch (_) { /* already gone */ } }
            if (env[TOKEN_ENV] === token) delete env[TOKEN_ENV];
          },
        };
      }
      const cur = readLock(file);
      if (cur && cur.token === token) { try { fs.unlinkSync(file); } catch (_) {} }
      sleep(Math.floor(Math.random() * pollMs));
      continue;
    }

    // Wait. Name what holds us: the locks that block us if there are any (the same tree), else every holder (all slots taken).
    const heldBy = blockers.length ? blockers : live;
    const named = heldBy.map((x) => x.h);
    const waited = now() - t0;
    if (waited >= maxWaitMs) {
      const many = named.length > 1;
      throw Object.assign(new Error(`heavy-run: gave up after ${mins(waited)} — ${many ? `${named.map(describe).join(' and ')} still hold the slots` : `${describe(named[0])} still holds ${heldBy[0].file}`}. Not running anyway: two heavy runs in one tree make both readings meaningless. Wait for ${many ? 'them' : 'it'}, or ask ${many ? 'those seats' : 'that seat'}.`), { code: 'HEAVY_RUN_TIMEOUT', holder: named[0], holders: named });
    }
    if (now() - said >= SAY_EVERY_MS) {
      log(`heavy-run: waiting on ${named.map(describe).join(' and ')}${blockers.length ? (n === 1 ? ' — one heavy run at a time' : ' — it holds this tree') : ` — all ${n} slots are held`}`);
      said = now();
    }
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

module.exports = { acquire, hold, pidAlive, pidGone, slotCount, slotFile, resolveTree, LOCK_NAME, TOKEN_ENV, MAX_WAIT_MS, YOUNG_MS, DEFAULT_SLOTS, MAX_SLOTS, NON_GIT_TREE };

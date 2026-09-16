#!/usr/bin/env node
'use strict';
// stick-apply.js — the applier. P-STICK-BUILD (L059) §2 as RE-RULED at 60e1ccf, pane A, 2026-09-14.
//
//   node dev/stick-apply.js --stick <FOLDER> --relaunch <absolute consonance.exe> [--retire-far <sid>]... [--repair <sid>]... [--take-stick <sid>]...
//
// Started by the app after the keeper confirms in the setup window. It has no window and it never tells
// the keeper anything — the relaunched app re-rehearses and shows the real state. Its whole job, in order:
//
//   1  write <data_dir>/stick-apply.started.json  { pid, image: "node", script: "stick-apply.js", at, stick }
//      BEFORE anything else — the app does not exit until it sees this file with this pid alive
//   2  wait until no consonance.exe is running
//   3  run   node dev/tail-carry.js --stick <FOLDER> --import --json --apply <the forwarded flags>
//   4  write <data_dir>/stick-apply.result.json   { code, outcome, why, rows, at }
//   5  remove stick-apply.started.json
//   6  relaunch consonance.exe — on EVERY code, 0 through 3
//
// **THE APPLIER DECIDES NOTHING (A-1).** `--retire-far` and `--repair` are the keeper's decisions from the
// setup window, forwarded to tail-carry.js verbatim and in order. Nothing else is added: no rehearsal, no
// retire rule, no second opinion. A hidden process that re-decided would act on something the window never
// showed. (Before the re-rule the command could not carry a decision at all, and the commonest arrival — a
// pane with a launch-born copy — looped: confirm, REFUSED, relaunch, the same window. Measured at the stop.)
//
// **What a HARD KILL of this process does, stated rather than hoped about.** On this machine a kill from
// outside runs no handler (measured tonight, L059 §1). A killed applier leaves `stick-apply.started.json`
// naming a dead pid, no result file, and no relaunch. That is recovered by construction, not by this file:
// the app names a started.json whose pid is dead as a STALE HANDSHAKE (§2), and the keeper's next launch
// re-rehearses the real state — a half-written seat reads INTERRUPTED, a lost ledger update cannot happen
// because tail-carry holds the ledger lock (A-3). Everything this file CAN catch — an exception, a
// tail-carry that prints no object — still writes a result and still relaunches.
//
// Exit code: the carry's code (0-3), or 2 when this applier refuses to start (bad arguments, no data dir,
// another live applier). A refusal to start writes NO started.json, so the app's 10-second wait sees nothing
// and shows "the transfer could not start" — which is true.

const fs = require('fs');
const path = require('path');
const { spawn, spawnSync, execFileSync } = require('child_process');

const carry = require('./tail-carry.js');
const sync = require('../consonance/tools/state-sync.js');

const STARTED = 'stick-apply.started.json';
const RESULT = 'stick-apply.result.json';
const SELF_IMAGE = 'node';
const SCRIPT = 'stick-apply.js';

/** How long to wait for the app to exit before giving up: the app kills its panes on the way out. */
const APP_EXIT_WAIT_MS = 10 * 60 * 1000;
const POLL_MS = 1000;

/**
 * P-STICK-APPLIER-ZOMBIE (D066): how long EVERY running consonance.exe may be continuously windowless before the wait
 * stops early and refuses, naming the pids.
 *
 * What bit, 2026-09-16 08:40-08:52: a windowless consonance.exe left by an earlier launch held the wait above for its
 * full 600 s, twice, because the old probe (tasklist) could not tell it from the live app.
 *
 * REFUSE, NEVER "STALE". Treating a windowless process as gone would not even import: tail-carry's own gate
 * (tail-carry.js:1137) runs tasklist again and refuses APP_RUNNING. The only way to import past it would be for this
 * file to tell tail-carry the app is closed while a consonance.exe exists — which is exactly the thing the wait exists
 * to prevent, decided by a process the keeper cannot see. So a windowless process shortens the WAIT; it never
 * licenses the IMPORT, and this file kills nothing.
 *
 * WHY 30 s. The legitimate windowless consonance.exe is the one that started this applier: `app.exit(0)`
 * (main.rs, stick_start_applier) destroys the window and then tears down, and the seats' kill is bounded at 5 s
 * (P-LEAVE). 30 s is six times that bound. A slow-to-PAINT app is the other case the packet names, and it is not
 * refused at all once it paints: the grace is continuous and a window resets it. The asymmetry that makes a short
 * grace safe: too short costs a refused transfer the keeper retries; it can never cost an import under a live app.
 *
 * WHAT WOULD PROVE IT TOO SHORT: a result whose `app.windowless` names `app.parentPid` — the applier's own parent,
 * refused while still exiting normally. The result records both so that is checkable from one file.
 */
const WINDOWLESS_GRACE_MS = 30 * 1000;

/**
 * The default probe's output, read so that anything which does not account for itself is "cannot tell" (null) and
 * never "gone" ([]). Gone is the reading that lets an import run, so it needs positive evidence: an `OK <n>` line
 * and exactly n rows of `<pid> <window handle>`.
 */
function parseProbe(stdout) {
  const lines = String(stdout || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  // String#match, not RegExp#exec: stick-waiter.test.js's SWEEP is a text scan that reads any call spelled exec,
  // regex or not, as a child_process call. (This comment must not spell that call with its paren, for the same reason.)
  const head = lines.length ? lines[0].match(/^OK (\d+)$/) : null;
  if (!head) return null;
  const rows = lines.slice(1);
  if (rows.length !== Number(head[1])) return null;
  const out = [];
  for (const row of rows) {
    const m = row.match(/^(\d+) (-?\d+)$/);
    if (!m) return null;
    out.push({ pid: Number(m[1]), alive: true, hasWindow: m[2] !== '0' });
  }
  return out;
}

/**
 * Every running consonance.exe as { pid, alive, hasWindow }; [] when none; null when that cannot be told.
 * `MainWindowHandle` is 0 for a process with no visible top-level window. Measured on D, 2026-09-16: the live app
 * read `15380 1507894`, four windowless node.exe read handle 0, an absent name read `OK 0`, each in about 160 ms.
 * `Get-Process` with no name and -ErrorAction Stop, filtered afterwards: a named Get-Process reports "not found" as an
 * error, and silencing that error would also silence a real failure into an empty list — into "gone".
 */
function probeConsonance(run) {
  const script = "$p = @(Get-Process -ErrorAction Stop | Where-Object { $_.ProcessName -eq 'consonance' }); " +
    "'OK ' + $p.Count; foreach ($x in $p) { '{0} {1}' -f $x.Id, [int64]$x.MainWindowHandle }";
  // `run` is the boundary the tests stand in for; the applier passes nothing and gets the real execFileSync.
  const runner = typeof run === 'function' ? run : execFileSync;
  try {
    // windowsHide (P-NO-CONSOLE): this process has no console; a console child would get a Windows Terminal window.
    return parseProbe(runner('powershell', ['-NoProfile', '-NonInteractive', '-Command', script],
      { encoding: 'utf8', windowsHide: true, timeout: 15000 }));
  } catch (_) {
    return null;
  }
}

function sleepSync(ms) { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); }

function writeJsonAtomic(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const tmp = `${p}.writing-${process.pid}`;
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2) + '\n');
  fs.renameSync(tmp, p);
}

function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, '')); } catch (_) { return null; }
}

/** Parse the applier's own argv. Returns { o } or { error }. Flags are kept in the order given. */
function parseArgs(argv) {
  const o = { stick: null, relaunch: null, forward: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const val = () => {
      const v = argv[++i];
      if (v === undefined || v.startsWith('--')) throw new Error(`${a} needs a value`);
      return v;
    };
    try {
      if (a === '--stick') o.stick = val();
      else if (a === '--relaunch') o.relaunch = val();
      // --take-stick (P-DIVERGED §2.6): the keeper's TAKE THE STICK'S on a DIVERGED seat — forwarded like the others.
      else if (a === '--retire-far' || a === '--repair' || a === '--take-stick') o.forward.push(a, val());
      else return { error: `unknown argument: ${a}` };
    } catch (e) { return { error: e.message }; }
  }
  if (!o.stick) return { error: '--stick <FOLDER> is required' };
  if (!o.relaunch) return { error: '--relaunch <absolute consonance.exe> is required' };
  if (!path.isAbsolute(o.relaunch)) return { error: `--relaunch must be an absolute path: ${o.relaunch}` };
  return { o };
}

/** The real carry: tail-carry.js as a child, its one stdout object parsed. */
function defaultCarry(stick, forward, tailCarryPath) {
  // windowsHide (P-NO-CONSOLE): node is a console program. Started by a parent with no console of its own, it would
  // be given a NEW one, and Windows 11 hands a new console to Windows Terminal — a real window. windowsHide makes
  // libuv pass CREATE_NO_WINDOW (no stdio here is inherited), so the child's console is created without a window.
  const r = spawnSync(process.execPath, [tailCarryPath, '--stick', stick, '--import', '--json', '--apply', ...forward],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, windowsHide: true });
  return { status: r.status, stdout: r.stdout || '', stderr: r.stderr || '', error: r.error || null };
}

function defaultRelaunch(exe) {
  // THE ONE SPAWN WITHOUT windowsHide, deliberately. consonance.exe is a GUI-subsystem program
  // (main.rs:1, windows_subsystem = "windows"): it never allocates a console, so there is nothing to hide — and
  // windowsHide also sets SW_HIDE in its startup info, which a GUI program may honour on its first window. Hiding
  // the relaunched app is the one outcome worse than a flash: the keeper would see nothing at all.
  const child = spawn(exe, [], { cwd: path.dirname(exe), detached: true, stdio: 'ignore' });
  child.on('error', () => {});
  child.unref();
}

/**
 * The applier. Every side effect is injectable so the tests can drive it; the CLI passes none of them.
 * Returns { code, startedWritten, result }.
 */
function runApplier(argv, inject) {
  const k = Object.assign({
    dataDir: undefined,
    appProbe: () => probeConsonance(),
    windowlessGraceMs: WINDOWLESS_GRACE_MS,
    ppid: process.ppid,
    sleep: sleepSync,
    now: () => Date.now(),
    pid: process.pid,
    imageOf: carry.pidImage,
    tailCarryPath: path.join(__dirname, 'tail-carry.js'),
    carry: null,
    relaunch: defaultRelaunch,
    log: (s) => process.stderr.write(`[stick-apply] ${s}\n`),
    appExitWaitMs: APP_EXIT_WAIT_MS,
    pollMs: POLL_MS,
  }, inject || {});
  if (k.dataDir === undefined) k.dataDir = sync.dataDir();
  const runCarry = k.carry || ((stick, fwd) => defaultCarry(stick, fwd, k.tailCarryPath));
  const iso = () => new Date(k.now()).toISOString();

  const parsed = parseArgs(argv);
  if (parsed.error) { k.log(`REFUSED to start — ${parsed.error}. No handshake was written.`); return { code: 2, startedWritten: false }; }
  const o = parsed.o;
  if (!k.dataDir) { k.log('REFUSED to start — no data dir (CONSONANCE_DATA or ~/.consonance.json data_dir). No handshake was written.'); return { code: 2, startedWritten: false }; }

  const startedPath = path.join(k.dataDir, STARTED);
  const resultPath = path.join(k.dataDir, RESULT);

  // ── one applier at a time (E-1, the applier's own half of it) ──
  let staleHandshake = null;
  const prior = readJson(startedPath);
  if (prior && prior.pid !== k.pid) {
    if (carry.holderLive(prior, k.imageOf) && prior.script === SCRIPT) {
      k.log(`REFUSED to start — a live applier (pid ${prior.pid}, since ${prior.at}) already holds ${STARTED}. Its handshake is left exactly as it is.`);
      return { code: 2, startedWritten: false };
    }
    staleHandshake = prior;
    k.log(`taking over a STALE handshake left by pid ${prior.pid} (${prior.at}), which is not running it`);
  }

  // ── 1 · the handshake, before anything else ──
  writeJsonAtomic(startedPath, { pid: k.pid, image: SELF_IMAGE, script: SCRIPT, at: iso(), stick: o.stick });

  let result;
  try {
    // ── 2 · wait for the app to be gone — or, if every consonance.exe has had no window for the grace, stop waiting ──
    const deadline = k.now() + k.appExitWaitMs;
    const windowlessSince = new Map();   // pid -> when this CONTINUOUS windowless stretch began
    let seen = k.appProbe();
    let ghosts = null;
    for (;;) {
      if (Array.isArray(seen) && seen.length === 0) break;
      const t = k.now();
      if (Array.isArray(seen)) {
        const nowWindowless = new Set(seen.filter((p) => !p.hasWindow).map((p) => p.pid));
        for (const pid of [...windowlessSince.keys()]) if (!nowWindowless.has(pid)) windowlessSince.delete(pid);
        for (const pid of nowWindowless) if (!windowlessSince.has(pid)) windowlessSince.set(pid, t);
        // Only when there is NO window anywhere: a windowed consonance.exe is the app the keeper can see. The grace is
        // then read over the windowless pids alone, so this guard is the one that holds — not a NaN comparison.
        if (nowWindowless.size === seen.length && [...nowWindowless].every((pid) => t - windowlessSince.get(pid) >= k.windowlessGraceMs)) {
          ghosts = seen;
          break;
        }
      }
      if (t >= deadline) break;
      k.sleep(k.pollMs);
      seen = k.appProbe();
    }
    if (!(Array.isArray(seen) && seen.length === 0)) {
      const pids = Array.isArray(seen) ? seen.map((p) => p.pid).sort((a, b) => a - b) : [];
      const named = pids.length ? ` (pid ${pids.join(', ')})` : '';
      const waited = `${Math.round(k.appExitWaitMs / 1000)} s`;
      const why = ghosts
        ? `Consonance${named} had no window for ${Math.round(k.windowlessGraceMs / 1000)} s — it is not the app you can see, so the transfer stopped waiting rather than wait ${waited} on it. Nothing was imported. End that process (Task Manager, or: taskkill /PID ${pids.join(' /PID ')} /F), then start the transfer again.`
        : seen === null
          ? `could not tell whether Consonance had closed after ${waited}; nothing was imported`
          : `Consonance${named} was still running after ${waited}; nothing was imported`;
      result = { code: 2, outcome: 'APP_RUNNING', why, rows: [],
        app: { pids, windowless: ghosts ? pids : [], parentPid: k.ppid } };
    } else {
      // ── 3 · the carry, with the keeper's decisions and nothing else ──
      const r = runCarry(o.stick, o.forward);
      const line = String(r.stdout).split('\n')[0];
      let obj = null;
      try { obj = JSON.parse(line); } catch (_) { obj = null; }
      if (!obj || typeof obj.code !== 'number' || !Array.isArray(obj.rows)) {
        result = { code: 3, outcome: 'CRASHED', rows: [],
          why: `tail-carry printed no result object (exit ${r.status}${r.error ? `, ${r.error.message}` : ''}); seats MAY be written — the relaunched app re-rehearses` };
      } else {
        result = { code: obj.code, outcome: obj.outcome, why: obj.why || null, rows: obj.rows, staleLock: obj.staleLock || null };
      }
    }
  } catch (e) {
    result = { code: 3, outcome: 'CRASHED', rows: [], why: `the applier broke part-way: ${e && e.message ? e.message : e}; seats MAY be written` };
  }

  // ── 4 · the result, 5 · the handshake removed, 6 · relaunch on every code ──
  result.at = iso();
  result.forwarded = o.forward;
  result.staleHandshake = staleHandshake;
  try { writeJsonAtomic(resultPath, result); } catch (e) { k.log(`could not write ${RESULT}: ${e.message}`); }
  try { const cur = readJson(startedPath); if (cur && cur.pid === k.pid) fs.unlinkSync(startedPath); } catch (_) {}
  try { k.relaunch(o.relaunch); }
  catch (e) {
    // Nobody is watching this process. The result file is the only place this can go, and the keeper's
    // next launch reads it.
    result.relaunchError = e.message;
    try { writeJsonAtomic(resultPath, result); } catch (_) {}
  }
  return { code: result.code, startedWritten: true, result };
}

if (require.main === module) process.exit(runApplier(process.argv.slice(2)).code);

module.exports = { runApplier, parseArgs, parseProbe, probeConsonance, STARTED, RESULT, APP_EXIT_WAIT_MS, WINDOWLESS_GRACE_MS };

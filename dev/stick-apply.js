#!/usr/bin/env node
'use strict';
// stick-apply.js — the applier. P-STICK-BUILD (L059) §2 as RE-RULED at 60e1ccf, pane A, 2026-09-14.
//
//   node dev/stick-apply.js --stick <FOLDER> --relaunch <absolute consonance.exe> [--retire-far <sid>]... [--repair <sid>]...
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
const { spawn, spawnSync } = require('child_process');

const carry = require('./tail-carry.js');
const place = require('./place-conversations.js');
const sync = require('../consonance/tools/state-sync.js');

const STARTED = 'stick-apply.started.json';
const RESULT = 'stick-apply.result.json';
const SELF_IMAGE = 'node';
const SCRIPT = 'stick-apply.js';

/** How long to wait for the app to exit before giving up: the app kills its panes on the way out. */
const APP_EXIT_WAIT_MS = 10 * 60 * 1000;
const POLL_MS = 1000;

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
      else if (a === '--retire-far' || a === '--repair') o.forward.push(a, val());
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
  const r = spawnSync(process.execPath, [tailCarryPath, '--stick', stick, '--import', '--json', '--apply', ...forward],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return { status: r.status, stdout: r.stdout || '', stderr: r.stderr || '', error: r.error || null };
}

function defaultRelaunch(exe) {
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
    appRunning: () => place.consonanceRunning(),
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
    // ── 2 · wait for the app to be gone ──
    const deadline = k.now() + k.appExitWaitMs;
    let running = k.appRunning();
    while (running !== false && k.now() < deadline) { k.sleep(k.pollMs); running = k.appRunning(); }
    if (running !== false) {
      result = { code: 2, outcome: 'APP_RUNNING', why: running === null
        ? `could not tell whether Consonance had closed after ${Math.round(k.appExitWaitMs / 1000)} s; nothing was imported`
        : `Consonance was still running after ${Math.round(k.appExitWaitMs / 1000)} s; nothing was imported`, rows: [] };
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

module.exports = { runApplier, parseArgs, STARTED, RESULT, APP_EXIT_WAIT_MS };

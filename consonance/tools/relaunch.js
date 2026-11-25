'use strict';
// relaunch.js — L233 (pane B): ⟳ RESTART'S HELPER. Waits until one process is gone, then opens Consonance again.
//
//   node consonance/tools/relaunch.js --pid <the app's pid> --exe <absolute consonance.exe> [--log <file>] [--wait-ms <ms>]
//
// The app (main.rs `restart_app`) starts this detached, then closes through its own Leave, which ends and saves every seat as the
// X does. This file waits for THAT pid to exit (the single-instance mutex, `claim_single_instance`, is released only when it does,
// so an earlier start would be refused as a second copy), then opens the exe at the path it was given. After a landing the path
// holds the new build: the running exe was moved aside (`release\consonance.exe.running-before-*`) and the new one written there,
// and Windows still names the running process by that path (probed 2026-11-25: `current_exe` and Get-Process both print the
// original path after the rename). Every seat comes back as at any launch.
//
// THE PATTERN IS dev/stick-apply.js's relaunch (detached, no windowsHide for a GUI exe, CONSONANCE_DATA dropped for the app), with
// two differences: it waits on the app's own pid, not on "no consonance.exe" (so the wait is about the process that asked), and it
// also drops CONSONANCE_LAUNCH_ID (main.rs LAUNCH_ID_ENV: an id inherited by an app that never pulled would print the old launch's
// pull on its shelf; the app removes it from its own environment at start, and this is the belt).
//
// Exit codes: 0 opened; 1 refused (bad arguments, nothing waited or opened); 2 gave up (the app still ran at the bound, nothing
// opened). Each outcome is one row in --log (the app passes <data>/relaunch.jsonl), since this process has no window to say it in.
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const WAIT_MS = 30 * 60 * 1000;   // a Leave with a stick waits on his click before it exits; this is generous for that
const POLL_MS = 500;

function parseArgs(argv) {
  const o = { pid: null, exe: null, log: null, waitMs: WAIT_MS, testArgs: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i], val = () => argv[++i];
    if (a === '--pid') o.pid = Number(val());
    else if (a === '--exe') o.exe = val();
    else if (a === '--log') o.log = val();
    else if (a === '--wait-ms') o.waitMs = Number(val());
    else if (a === '--args-for-test') o.testArgs = JSON.parse(val());   // relaunch.test.js only: lets its real-file row open node
    else return { error: `unknown argument ${a}` };
  }
  if (!Number.isInteger(o.pid) || o.pid <= 0) return { error: '--pid <the app\'s pid> is required' };
  if (!o.exe || !path.isAbsolute(o.exe)) return { error: `--exe must be an absolute path: ${o.exe}` };
  if (!Number.isFinite(o.waitMs) || o.waitMs < 0) return { error: `--wait-ms must be a number of ms: ${o.waitMs}` };
  return { o };
}

/** Is `pid` still a process? Signal 0 tests without signalling; EPERM means it exists and is not ours. */
function alive(pid) {
  try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; }
}

function sleepSync(ms) { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); }

/** The app's environment: this one's, without the two names that are instructions to someone else. */
function appEnv(env) {
  const { CONSONANCE_DATA: _carryOnly, CONSONANCE_LAUNCH_ID: _thatLaunchOnly, ...rest } = env;
  return rest;
}

function defaultLaunch(exe, env, args) {
  // No windowsHide: consonance.exe is a GUI program, and SW_HIDE on its first window would hide the app (stick-apply.js, same line).
  const child = spawn(exe, args || [], { cwd: path.dirname(exe), detached: true, stdio: 'ignore', env });
  child.on('error', () => {});
  child.unref();
}

function runRelaunch(argv, inject) {
  const k = Object.assign({ alive, sleep: sleepSync, now: () => Date.now(), launch: null, log: null, env: process.env }, inject);
  const parsed = parseArgs(argv);
  const log = (row) => {
    const full = Object.assign({ at: new Date().toISOString() }, row);
    if (k.log) return k.log(full);
    if (parsed.o && parsed.o.log) try { fs.appendFileSync(parsed.o.log, JSON.stringify(full) + '\n'); } catch (_) { /* nowhere else to say it */ }
  };
  if (parsed.error) {
    log({ outcome: 'refused', why: parsed.error });
    return { code: 1, why: parsed.error };
  }
  const o = parsed.o;
  const t0 = k.now();
  while (k.alive(o.pid)) {
    if (k.now() - t0 >= o.waitMs) {
      const why = `the app (pid ${o.pid}) was still running after ${o.waitMs} ms, so nothing was opened (a second copy would be refused)`;
      log({ outcome: 'gave-up', pid: o.pid, exe: o.exe, why });
      return { code: 2, why };
    }
    k.sleep(POLL_MS);
  }
  const env = appEnv(k.env);
  if (k.launch) k.launch(o.exe, env);
  else defaultLaunch(o.exe, env, o.testArgs);
  log({ outcome: 'opened', pid: o.pid, exe: o.exe, waitedMs: k.now() - t0 });
  return { code: 0 };
}

if (require.main === module) process.exit(runRelaunch(process.argv.slice(2)).code);

module.exports = { runRelaunch, parseArgs, appEnv, alive, WAIT_MS, POLL_MS };

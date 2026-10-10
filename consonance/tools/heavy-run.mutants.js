#!/usr/bin/env node
'use strict';
// heavy-run.mutants.js - run with: node consonance/tools/heavy-run.mutants.js [--only <n>]     (D283; holds the heavy-run lock itself)
//
// A GREEN SUITE IS A CLAIM ABOUT THE TESTS, NOT ABOUT THE CODE. heavy-run.js is the one lock every heavy run in every seat takes, so a wrong line in it is either two runs in one tree
// (a live lock taken: the readings of both are nobody's) or a seat parked behind a dead holder. This breaks it one load-bearing line at a time and requires heavy-run.test.js to go RED
// for each. There was no such file before D283 (the chair asked for it after a takeover that proved to be right, with the lock's second-witness rule added).
//
// THE TRACKED SOURCES ARE NEVER WRITTEN. A temp tree mirrors what the suite reads (heavy-run.js, state-manifest.js, the suite, and the files its WIRING row sweeps); the copy is mutated,
// the copy's suite runs, the tree is removed. Every anchor must occur EXACTLY ONCE or the row is NOT APPLIED (counted as such, never as a catch). No model is ever called.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HERE = __dirname;
const SRC = 'heavy-run.js', SUITE = 'heavy-run.test.js';

const MUTANTS = [
  // ---- the lock itself ----
  ['lock: created with "w", not exclusively ("wx"): two runners can both hold it', SRC, "fs.openSync(file, 'wx')", "fs.openSync(file, 'w')"],
  ['nested: any token is a pass, not only the current holder\'s', SRC, 'if (current && env[TOKEN_ENV] && current.token === env[TOKEN_ENV]) {', 'if (current && env[TOKEN_ENV]) {'],
  ['release: removes a lock that is not its own', SRC, 'if (cur && cur.token === token) {', 'if (cur) {'],
  ['release: not on exit or error', SRC, "  process.on('exit', () => h.release());\n", ''],
  ['the max wait RUNS ANYWAY instead of failing loudly', SRC, 'throw Object.assign(new Error(`heavy-run: gave up after', 'if (true) return { file, reentrant: false, holder: h, release() {} }; throw Object.assign(new Error(`heavy-run: gave up after'],
  ['the exit code of a timeout is not 3', SRC, "process.exit(e.code === 'HEAVY_RUN_TIMEOUT' ? 3 : 2);", 'process.exit(2);'],
  // ---- kill(0) ----
  ['pidAlive: EPERM reads as dead', SRC, "return e.code === 'EPERM';", 'return false;'],
  ['pidAlive: any throw reads as alive', SRC, "return e.code === 'EPERM';", 'return true;'],
  ['pidAlive: a bad pid is asked about', SRC, 'if (!Number.isInteger(pid) || pid <= 0) return false;\n  try { kill(pid, 0);', 'try { kill(pid, 0);'],
  // ---- the takeover ----
  ['takeover: a dead holder is never taken (stale is always false)', SRC, '      stale = !alive(h.pid);\n', '      stale = false;\n'],
  ['takeover: every holder is taken (stale is always true)', SRC, '      stale = !alive(h.pid);\n', '      stale = true;\n'],
  ['takeover: the takeover is not logged', SRC, "log(`heavy-run: took over a stale lock", "void (`heavy-run: took over a stale lock"],
  ['takeover: whom it replaced is not recorded', SRC, 'if (tookOver) rec.took_over = tookOver;', ''],
  ['takeover: the set-aside file is left behind', SRC, "      try { fs.unlinkSync(aside); } catch (_) {}\n      const age = h.started", '      const age = h.started'],
  ['race: a live lock caught by the rename is not put back', SRC, "try { fs.linkSync(aside, file); } catch (_) { /* a newer lock is already there */ }", ''],
  ['race: the put-back does not check that the moved lock is alive', SRC, 'if (moved && !moved.unreadable && moved.token !== h.token && alive(moved.pid)) {', 'if (moved && !moved.unreadable && moved.token !== h.token) {'],
  // ---- D283: a young lock needs a second witness ----
  ['young: the second witness is never asked', SRC, 'if (age === null || age < YOUNG_MS) {', 'if (false) {'],
  ['young: the boundary is inclusive (a lock exactly 30 minutes old is young)', SRC, 'if (age === null || age < YOUNG_MS) {', 'if (age === null || age <= YOUNG_MS) {'],
  ['young: YOUNG_MS is zero', SRC, 'const YOUNG_MS = 30 * 60 * 1000;', 'const YOUNG_MS = 0;'],
  ['young: YOUNG_MS is one minute', SRC, 'const YOUNG_MS = 30 * 60 * 1000;', 'const YOUNG_MS = 60 * 1000;'],
  ['young: a lock of unknown age counts as old', SRC, 'if (age === null || age < YOUNG_MS) {', 'if (age !== null && age < YOUNG_MS) {'],
  ['young: "cannot tell" (null) counts as gone', SRC, 'if (second !== true) {', 'if (second === false) {'],
  ['young: the second reading is asked and its answer ignored', SRC, 'if (second !== true) {', 'if (second !== true && false) {'],
  ['young: the disagreement is said at every poll, not once', SRC, 'if (!disagreed.has(h.token)) {', 'if (true) {'],
  ['young: the log does not give the second method\'s reading', SRC, "'RUNNING to tasklist'", "'to tasklist'"],
  ['young: the log says nothing about "cannot confirm"', SRC, "'tasklist could not confirm it'", "'tasklist'"],
  // ---- D283: the second method ----
  ['tasklist: asked about another pid', SRC, '`PID eq ${pid}`', '`PID eq ${pid + 1}`'],
  ['tasklist: the pid is read from the name column', SRC, 'Number(c[1].slice(1, -1)) === pid', 'Number(c[0].slice(1, -1)) === pid'],
  ['tasklist: a failed call (status != 0) is read as an answer', SRC, "r.error || r.status !== 0 || typeof r.stdout !== 'string'", "r.error || typeof r.stdout !== 'string'"],
  ['tasklist: a spawn error is read as an answer', SRC, "if (!r || r.error || r.status !== 0", 'if (!r || r.status !== 0'],
  ['tasklist: "listed" means gone', SRC, 'return !listed;', 'return listed;'],
  ['tasklist: a throw while asking is read as gone', SRC, '} catch (_) { return null; }\n  if (!r || r.error', '} catch (_) { return true; }\n  if (!r || r.error'],
  ['tasklist: asked on every platform', SRC, "if (platform !== 'win32') return true;", ''],
  ['tasklist: not hidden', SRC, "timeout: 8000, windowsHide: true }", 'timeout: 8000 }'],
  ['tasklist: no timeout', SRC, "timeout: 8000, windowsHide: true }", 'windowsHide: true }'],
  // ---- unreadable locks ----
  ['unreadable: a lock being written this instant is taken at once', SRC, 'stale = age > UNREADABLE_GRACE_MS;', 'stale = true;'],
  ['unreadable: an old unreadable lock is never taken', SRC, 'stale = age > UNREADABLE_GRACE_MS;', 'stale = false;'],
];

function tree() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hr-mut-'));
  fs.mkdirSync(path.join(dir, 'tools'), { recursive: true });
  const files = new Set([SRC, SUITE, 'state-manifest.js', 'js-suite.js', 'mutant-harness.js', ...fs.readdirSync(HERE).filter((f) => f.endsWith('.mutants.js'))]);
  for (const f of files) fs.copyFileSync(path.join(HERE, f), path.join(dir, 'tools', f));
  return dir;
}
function run(dir) {
  const env = { ...process.env }; for (const k of Object.keys(env)) if (/^CONSONANCE_/.test(k)) delete env[k];
  const r = spawnSync(process.execPath, ['--test', '--test-concurrency=1', path.join(dir, 'tools', SUITE)], { encoding: 'utf8', env, timeout: 90 * 1000 });   // the unmutated suite takes seconds: a mutant that makes it hang (a waiter that never takes a dead lock) is stopped here
  const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''), n = (k) => Number((o.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) || [])[1]);
  return { pass: n('pass'), fail: n('fail'), hung: r.status === null || !Number.isFinite(n('pass')) };
}

function main() {
  require('./heavy-run.js').hold({ cmd: 'heavy-run.mutants' });   // ONE HEAVY RUNNER PER TREE
  const onlyAt = process.argv.indexOf('--only'), only = onlyAt > 0 ? Number(process.argv[onlyAt + 1]) : null;
  const read = (f) => fs.readFileSync(path.join(HERE, f), 'utf8').replace(/\r\n/g, '\n');
  const control = (() => { const d = tree(); try { return run(d); } finally { fs.rmSync(d, { recursive: true, force: true }); } })();
  console.log(`control (unmutated copy)                                        pass ${control.pass} fail ${control.fail}`);
  if (!(control.fail === 0 && control.pass > 0)) { console.log('CONTROL NOT GREEN - no mutant result means anything'); process.exitCode = 1; return; }
  let applied = 0, caught = 0, notApplied = 0;
  MUTANTS.forEach(([name, file, anchor, repl], i) => {
    if (only != null && only !== i + 1) return;
    const src = read(file), hits = src.split(anchor).length - 1, label = `${String(i + 1).padStart(2)} ${name}`.padEnd(100);
    if (hits !== 1) { notApplied++; console.log(`${label} NOT APPLIED (anchor found ${hits} times)`); return; }
    applied++;
    const d = tree();
    try {
      fs.writeFileSync(path.join(d, 'tools', file), src.replace(anchor, () => repl));
      const r = run(d), ok = r.fail > 0 || r.hung; if (ok) caught++;   // a suite that hangs or crashes on the mutant has caught it: a waiter stuck behind a dead holder is the failure itself
      console.log(`${label} pass ${r.pass} fail ${r.fail}  ${ok ? (r.hung ? 'CAUGHT (the suite hung or crashed)' : 'CAUGHT') : 'SURVIVED'}`);
    } finally { fs.rmSync(d, { recursive: true, force: true }); }
  });
  console.log(`\n${applied} applied · ${caught} caught · ${applied - caught} survived · ${notApplied} NOT APPLIED`);
  if (applied - caught > 0 || notApplied > 0) process.exitCode = 1;
}

main();

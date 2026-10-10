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
  ['nested: any token is a pass, not only the current holder\'s', SRC, 'if (current && current.token === env[TOKEN_ENV]) return', 'if (current) return'],
  ['release: removes a lock that is not its own', SRC, 'if (cur && cur.token === token) { try { fs.unlinkSync(file); } catch (_) { /* already gone */ }', 'if (cur) { try { fs.unlinkSync(file); } catch (_) { /* already gone */ }'],
  ['release: not on exit or error', SRC, "  process.on('exit', () => h.release());\n", ''],
  ['the max wait RUNS ANYWAY instead of failing loudly', SRC, 'throw Object.assign(new Error(`heavy-run: gave up after', 'if (true) return { file: heldBy[0].file, slot: 0, reentrant: false, holder: named[0], release() {} }; throw Object.assign(new Error(`heavy-run: gave up after'],
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
  ['takeover: the set-aside file is left behind', SRC, "    try { fs.unlinkSync(aside); } catch (_) {}\n    const age = h.started", '    const age = h.started'],
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
  ['tasklist: not hidden', SRC, "'/NH'], { encoding: 'utf8', timeout: 8000, windowsHide: true }", "'/NH'], { encoding: 'utf8', timeout: 8000 }"],
  ['tasklist: no timeout', SRC, "'/NH'], { encoding: 'utf8', timeout: 8000, windowsHide: true }", "'/NH'], { encoding: 'utf8', windowsHide: true }"],
  // ---- D286: slots, one per tree ----
  ['slots: the default is one (today\'s machine-wide lock)', SRC, 'const DEFAULT_SLOTS = 2;', 'const DEFAULT_SLOTS = 1;'],
  ['slots: slot 2 is the same file as slot 1', SRC, 'k === 1 ? LOCK_NAME : `heavy-run.${k}.lock`', 'LOCK_NAME'],
  ['slots: a count of zero is accepted', SRC, 'Number.isInteger(n) && n >= 1 &&', 'Number.isInteger(n) && n >= 0 &&'],
  ['slots: any whole count is accepted (no ceiling)', SRC, 'n >= 1 && n <= MAX_SLOTS ?', 'n >= 1 ?'],
  ['slots: a fractional count is accepted', SRC, 'return Number.isInteger(n) && n >=', 'return n >='],
  ['slots: a slot beyond the count can be claimed', SRC, 'if (h === null) { if (k <= n) free.push(k); continue; }', 'if (h === null) { free.push(k); continue; }'],
  ['slots: only the slots up to the count are looked at (a holder in a higher one is invisible)', SRC, "const file = slotFile(dir, k), h = readLock(file);\n      if (h === null)", "if (k > n) continue;\n      const file = slotFile(dir, k), h = readLock(file);\n      if (h === null)"],
  ['tree: every lock blocks (no parallel runs)', SRC, 'const blocks = (h) => n === 1 || !h.tree || h.tree === myTree;', 'const blocks = (h) => true;'],
  ['tree: no lock blocks but a full house (two runs in one tree)', SRC, 'const blocks = (h) => n === 1 || !h.tree || h.tree === myTree;', 'const blocks = (h) => n === 1;'],
  ['tree: a lock with no tree recorded does not block', SRC, 'const blocks = (h) => n === 1 || !h.tree ||', 'const blocks = (h) => n === 1 ||'],
  ['tree: with one slot a different tree runs beside the holder', SRC, 'const blocks = (h) => n === 1 || !h.tree ||', 'const blocks = (h) => !h.tree ||'],
  ['tree: the lock does not record its tree', SRC, 'cmd, tree: myTree, started', 'cmd, started'],
  ['tree: the cwd is not asked, every runner is the same tree', SRC, 'const myTree = tree !== undefined ? tree : resolveTree();', 'const myTree = tree !== undefined ? tree : NON_GIT_TREE;'],
  ['tree: the Windows case is kept (two spellings of one folder are two trees)', SRC, "platform === 'win32' ? p.toLowerCase() : p", 'p'],
  ['tree: a failed git call is read as a tree', SRC, "r && !r.error && r.status === 0 && typeof r.stdout", "r && !r.error && typeof r.stdout"],
  ['tree: git failing to run is not the shared bucket', SRC, "} catch (_) { return NON_GIT_TREE; }", "} catch (_) { return process.cwd(); }"],
  ['tree: a subfolder is its own tree (cwd, not the top level)', SRC, "const top = r && !r.error && r.status === 0 && typeof r.stdout === 'string' ? r.stdout.trim() : '';", "const top = r && !r.error && r.status === 0 && typeof r.stdout === 'string' ? cwd : '';"],
  ['wait: names only the first holder', SRC, 'const named = heldBy.map((x) => x.h);', 'const named = heldBy.map((x) => x.h).slice(0, 1);'],
  ['wait: names every holder even when one tree is the reason', SRC, 'const heldBy = blockers.length ? blockers : live;', 'const heldBy = live;'],
  ['wait: the waiting line does not say why', SRC, "' — it holds this tree'", "''"],
  ['claim: the second look for a rival is off (two of one tree run)', SRC, 'if (o && o.token !== token && blocks(o)) clash = true;', ''],
  ['claim: the backing-off runner leaves its own claim behind', SRC, "if (cur && cur.token === token) { try { fs.unlinkSync(file); } catch (_) {} }\n      sleep(Math.floor", "sleep(Math.floor"],
  ['claim: the second look takes ANY lock as a rival, even another tree\'s', SRC, 'if (o && o.token !== token && blocks(o)) clash = true;', 'if (o && o.token !== token) clash = true;'],
  ['nested: only slot 1 is searched for the run\'s own token', SRC, "for (let k = 1; k <= MAX_SLOTS; k++) {\n      const file = slotFile(dir, k), current", "for (let k = 1; k <= 1; k++) {\n      const file = slotFile(dir, k), current"],
  ['takeover: only a dead holder in slot 1 is taken', SRC, 'if (takeIfStale(file, k, h)) {', 'if (k === 1 && takeIfStale(file, k, h)) {'],
  ['takeover: the log does not name the slot', SRC, ' (slot ${k})`);', '`);'],
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
  env.CONSONANCE_HEAVY_WAIT_MS = '30000';   // D286: a mutant that parks the suite's real child runners must not leave them waiting the default 30 minutes after the 90 s stop
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

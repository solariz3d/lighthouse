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
  ['the exit code of a timeout is not 3', SRC, "process.exit(e.code === 'HEAVY_RUN_TIMEOUT' ? 3 : e.code === 'HEAVY_RUN_DISK' ? 4 : 2);", "process.exit(e.code === 'HEAVY_RUN_DISK' ? 4 : 2);"],   // D287: re-anchored on the line the disk guard extended
  // ---- kill(0) ----
  ['pidAlive: EPERM reads as dead', SRC, "return e.code === 'EPERM';", 'return false;'],
  ['pidAlive: any throw reads as alive', SRC, "return e.code === 'EPERM';", 'return true;'],
  ['pidAlive: a bad pid is asked about', SRC, 'if (!Number.isInteger(pid) || pid <= 0) return false;\n  try { kill(pid, 0);', 'try { kill(pid, 0);'],
  // ---- the takeover ----
  ['takeover: a dead holder is never taken (stale is always false)', SRC, '      stale = !alive(h.pid);\n', '      stale = false;\n'],
  ['takeover: every holder is taken (stale is always true)', SRC, '      stale = !alive(h.pid);\n', '      stale = true;\n'],
  ['takeover: the takeover is not logged', SRC, "log(`heavy-run: took over a stale lock — ${h.unreadable", "void (`heavy-run: took over a stale lock — ${h.unreadable"],   // D663: re-anchored; the old anchor was in both log lines (NOT APPLIED on main too)
  ['takeover: whom it replaced is not recorded', SRC, 'if (tookOver) rec.took_over = tookOver;', ''],
  ['takeover: the set-aside file is left behind', SRC, "    try { fs.unlinkSync(aside); } catch (_) {}\n    const age = h.started", '    const age = h.started'],
  ['race: a live lock caught by the rename is not put back', SRC, "try { fs.linkSync(aside, file); } catch (_) { /* a newer lock is already there */ }", ''],
  ['race: the moved lock is judged by kill(0) alone (a young one is thrown away without the second witness)', SRC, ': moved.token !== h.token)) {', ': moved.token !== h.token && alive(moved.pid))) {'],   // D289: the check this row used to remove was the defect (re-anchored on F1's condition)
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
  // D663: the next three re-anchored on the tasklist call alone; their old anchors matched three functions (pidGone, processIdentity, coreMasks), NOT APPLIED on main too
  ['tasklist: a failed call (status != 0) is read as an answer', SRC, "if (!r || r.error || r.status !== 0 || typeof r.stdout !== 'string') return null;\n  const listed", "if (!r || r.error || typeof r.stdout !== 'string') return null;\n  const listed"],
  ['tasklist: a spawn error is read as an answer', SRC, "if (!r || r.error || r.status !== 0 || typeof r.stdout !== 'string') return null;\n  const listed", "if (!r || r.status !== 0 || typeof r.stdout !== 'string') return null;\n  const listed"],
  ['tasklist: "listed" means gone', SRC, 'return !listed;', 'return listed;'],
  ['tasklist: a throw while asking is read as gone', SRC, "timeout: 8000, windowsHide: true }); } catch (_) { return null; }", "timeout: 8000, windowsHide: true }); } catch (_) { return true; }"],
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
  ['takeover: the log does not name the slot', SRC, ' (slot ${k})`;', '`;'],   // D663: re-anchored; the line ends `; so the old anchor was found 0 times (NOT APPLIED on main too)
  // ---- D287 part 2: the disk guard ----
  ['disk: the refusal floor is zero (a run starts on a full disk)', SRC, 'const DISK_REFUSE_BYTES = 20e9;', 'const DISK_REFUSE_BYTES = 0;'],
  ['disk: the warning is never given', SRC, 'if (low.bytes < DISK_WARN_BYTES) log(', 'if (false) log('],
  ['disk: the ROOMIEST drive decides, not the lowest', SRC, 'if (low === null || b < low.bytes) low = { root, bytes: b };', 'if (low === null || b > low.bytes) low = { root, bytes: b };'],
  ['disk: the guard is never called', SRC, '  checkDisk({ paths: writes || writePaths(env), free: diskFree, total: diskTotal, log });', ''],
  ['disk: an unreadable drive is skipped in silence', SRC, "log(`heavy-run: could not read the free space of ${root} (${e.code || e.message}); not checked`); continue;", 'continue;'],
  ['disk: a refusal exits 2, not 4', SRC, "e.code === 'HEAVY_RUN_DISK' ? 4 : 2", '2'],
  ['disk: CARGO_TARGET_DIR is not counted', SRC, '  if (env.CARGO_TARGET_DIR) out.push(env.CARGO_TARGET_DIR);\n', ''],
  // ---- unreadable locks ----
  ['unreadable: a lock being written this instant is taken at once', SRC, 'stale = age > UNREADABLE_GRACE_MS;', 'stale = true;'],
  ['unreadable: an old unreadable lock is never taken', SRC, 'stale = age > UNREADABLE_GRACE_MS;', 'stale = false;'],
  // ---- D289 F1: an unreadable moved lock (appended, so the numbers above stay what earlier hand-backs cite) ----
  ['race F1: an unreadable moved lock is thrown away (a claim caught before its write: two runners in one slot)', SRC, 'if (moved && (moved.unreadable ? movedAge() <= UNREADABLE_GRACE_MS : moved.token !== h.token)) {', 'if (moved && !moved.unreadable && moved.token !== h.token) {'],
  ['race F1: an unreadable moved lock is put back only when the first read was readable (the narrower condition)', SRC, 'moved.unreadable ? movedAge() <= UNREADABLE_GRACE_MS :', 'moved.unreadable ? !h.unreadable :'],
  ['race F1: an OLD unreadable moved lock is put back too (the takeover of a junk lock never ends)', SRC, 'moved.unreadable ? movedAge() <= UNREADABLE_GRACE_MS :', 'moved.unreadable ? true :'],
  // ---- D663: the exclusive hold (appended, so the numbers above stay what earlier hand-backs cite) ----
  ['hold: ordinary runners ignore the hold (the check dropped)', SRC, '      if (fh && !fh.ignored) { holdWait(fh.h); continue; }\n', ''],
  ['hold: a non-holder passes (any token lets a runner through)', SRC, 'if (h.token && (h.token === token || h.token === env[TOKEN_ENV])) return null;', 'if (h.token) return null;'],
  ['hold: the holder\'s own token is not a pass (only the hold\'s writer passes)', SRC, '(h.token === token || h.token === env[TOKEN_ENV])', '(h.token === token)'],
  ['hold: an exclusive runner takes over a LIVE hold (treats it as past the maximum)', SRC, '      if (f && f.ignored) {   // past the maximum', '      if (f) {   // past the maximum'],
  ['hold: a stale hold is never taken over', SRC, "if (takeIfStale(holdFile, 'hold', h)) {", 'if (false) {'],
  ['hold: the hold\'s takeover is recorded in the slot lock, not the hold', SRC, "if (takeIfStale(holdFile, 'hold', h)) { holdTookOver = tookOver; tookOver = before; continue; }", "if (takeIfStale(holdFile, 'hold', h)) { continue; }"],
  ['hold: the max-age warning is skipped (ignored in silence)', SRC, 'log(`heavy-run: IGNORING the exclusive hold by', 'void (`heavy-run: IGNORING the exclusive hold by'],
  ['hold: a hold past the maximum still binds (never ignored)', SRC, 'if (hAge !== null && hAge > holdMaxMs) {', 'if (false) {'],
  ['hold: HOLD_MAX_MS is one minute', SRC, 'const HOLD_MAX_MS = 90 * 60 * 1000;', 'const HOLD_MAX_MS = 60 * 1000;'],
  ['hold: an exclusive runner does not wait for other trees', SRC, 'const blocksMe = (h) => exclusive || blocks(h);', 'const blocksMe = (h) => blocks(h);'],
  ['hold: a non-exclusive runner writes the hold', SRC, '  if (exclusive) {\n    for (;;) {\n      const f = foreignHold();', '  if (true) {\n    for (;;) {\n      const f = foreignHold();'],
  ['hold: release removes any hold, not only its own', SRC, 'if (curHold && curHold.token === token) {', 'if (curHold) {'],
  ['hold: a claim racing the hold is not withdrawn (the post-claim look is off)', SRC, '        if (late && !late.ignored) clash = true;\n', ''],
  ['hold: the waiting line is never said', SRC, 'if (!saidHold) { saidHold = true; log(`heavy-run: waiting on an exclusive hold by', 'if (!saidHold) { saidHold = true; void (`heavy-run: waiting on an exclusive hold by'],
  ['hold: the waiting line is said at every poll, not once', SRC, 'if (!saidHold) {', 'if (true) {'],
  ['hold: a holder that gives up leaves its hold behind', SRC, '  } catch (e) { dropMyHold(); throw e; }', '  } catch (e) { throw e; }'],
  ['hold: the hold wait never gives up (no max wait)', SRC, 'if (waited >= maxWaitMs) { dropMyHold(); throw', 'if (false) { dropMyHold(); throw'],
  ['CLI: --exclusive is not passed to hold()', SRC, "hold({ cmd, exclusive: flags.includes('--exclusive') });", 'hold({ cmd });'],
  ['CLI: the exit code is not the program\'s', SRC, 'return r.status === null ? 1 : r.status;', 'return 0;'],
  // L202, the idle-holder guard
  ['idle guard: an idle holder is never named', SRC, 'if (now() - base.t >= idleWindowMs && s.cpu - base.cpu < idleCpuS) {', 'if (false) {'],
  ['idle guard: an idle holder is named on every check, not once', SRC, '          idleNamed.add(key);\n', '\n'],
  ['idle guard: a fault in the sampler escapes into the wait', SRC, "    } catch (_) { /* the guard only reports: a fault in it leaves the wait exactly as it was */ }", '    } finally {}'],
  ['idle guard: only the direct child is sampled, not the whole tree', SRC, 'for (let i = 0; i < tree.length; i++) for (const k of kids.get(tree[i]) || []) if (k !== tree[i] && !tree.includes(k) && childOf(tree[i], k)) tree.push(k);', 'void kids;'],   // re-anchored for the stale-parent check (P, 11-13)
  ['idle guard: the board line does not echo the MCP session', SRC, "const extra = sid ? { 'mcp-session-id': sid } : {};", 'const extra = {};'],
  ['idle guard: a shrinking tree is measured across the fall (a busy holder whose child exited is named idle)', SRC, 'const kept = prev.length && s.cpu < prev[prev.length - 1].cpu ? [] : prev;', 'const kept = prev;'],
  ['idle guard: a stale parent id is taken at its word (a stranger created before the holder is counted in its tree)', SRC, 'return a === null || b === null || b >= a; };', 'return true; };'],
  // D675, --status (P, 11-14): read only, the same holder rules as --run, non-zero while a hold stands
  ['status: the hold file is not read (a hold with no lock reads all clear)', SRC, 'const hf = path.join(dir, HOLD_NAME), hh = readLock(hf);', 'const hf = path.join(dir, HOLD_NAME), hh = null;'],
  ['status: exits 0 while a hold stands (the gate never closes)', SRC, "code: why.length ? 1 : 0 };", 'code: 0 };'],   // re-anchored for the timing-session gate (P, 11-14)
  ['status: a live slot naming a timing session does not gate', SRC, '    if (x.timing) out.timingSlots.push(k);\n', ''],
  ['status: "(not a timing session)" counts as one', SRC, ".replace(/\\bnot an? timing\\b/gi, '')", ''],
  ['status: a dead old holder reads held', SRC, "if (age !== null && age >= YOUNG_MS) return { state: 'free', stale: 'dead' };", "if (age !== null && age >= YOUNG_MS) return { state: 'held' };"],
  ['status: a young dead holder is freed without the second witness', SRC, "return confirmGone(h.pid) === true ? { state: 'free', stale: 'dead' }", "return true ? { state: 'free', stale: 'dead' }"],
  ['status: a reused pid reads held', SRC, "    if (hasIdentity(h) && !sameHolder(h, identify(h.pid))) return { state: 'free', stale: 'pid_reused' };\n", ''],
  ['status: the caller\'s own hold fails its gate', SRC, 'else if (hh.token && hh.token === env[TOKEN_ENV]) out.hold', 'else if (false) out.hold'],
  ['status: a hold past the maximum still stands', SRC, 'if (age !== null && age > holdMaxMs) out.hold', 'if (false) out.hold'],
  ['status: a slot\'s holder is not named', SRC, "lines.push(`  slot ${x.k}: held by ${who(x.holder)}", "lines.push(`  slot ${x.k}: held by ${'?'}"],
];

function tree() {
  const dir = require('./scratch.js').mkdtemp('hr-mut-');
  fs.mkdirSync(path.join(dir, 'tools'), { recursive: true });
  // scratch.js: the suite's tmp() makes its folders through it (D287 part 1), and the disk guard reads its root (part 2)
  const files = new Set([SRC, SUITE, 'state-manifest.js', 'scratch.js', 'js-suite.js', 'mutant-harness.js', ...fs.readdirSync(HERE).filter((f) => f.endsWith('.mutants.js'))]);
  for (const f of files) fs.copyFileSync(path.join(HERE, f), path.join(dir, 'tools', f));
  return dir;
}
// D677 (pane P, 2026-11-15): THE STOP IS MEASURED AGAINST THE CONTROL, NOT THE CLOCK. It was a fixed 90 s, and a stopped suite counted as
// CAUGHT; under load the unmutated control itself was stopped (92 s, "pass NaN fail NaN", exo_memory/handback/p-land-ip-O_2026-11-15.md),
// so a stop could no longer tell a mutant from load. Now: the control runs to completion (up to CONTROL_CAP_MS) and is timed; each mutant
// is stopped at that time x STOP_MARGIN, never under STOP_FLOOR_MS; and a STOPPED mutant is caught only when an unmutated copy, run again
// at once under the same stop, finishes green inside it. Otherwise it is NOT READ (load), neither caught nor survived, and the run exits 1.
const STOP_FLOOR_MS = 90 * 1000, STOP_MARGIN = 3, CONTROL_CAP_MS = 30 * 60 * 1000;
const secs = (ms) => `${Math.round(ms / 1000)} s`;
function stopFor(controlMs) {
  if (!Number.isFinite(controlMs) || controlMs <= 0) throw new Error(`no control time to measure the stop against (${controlMs})`);
  return Math.max(STOP_FLOOR_MS, Math.ceil(controlMs * STOP_MARGIN));
}
function run(dir, stopMs) {
  const env = { ...process.env }; for (const k of Object.keys(env)) if (/^CONSONANCE_/.test(k)) delete env[k];
  delete env.NODE_TEST_CONTEXT;   // inherited from a test runner, it turns the nested `node --test` into a silent child (no tally): a non-run, not a crash
  env.CONSONANCE_HEAVY_WAIT_MS = '30000';   // D286: a mutant that parks the suite's real child runners must not leave them waiting the default 30 minutes after a stop
  const t0 = Date.now();
  const r = spawnSync(process.execPath, ['--test', '--test-concurrency=1', path.join(dir, 'tools', SUITE)], { encoding: 'utf8', env, timeout: stopMs, windowsHide: true });
  const ms = Date.now() - t0;
  const stopped = !!(r.error && r.error.code === 'ETIMEDOUT');
  if (r.error && !stopped) throw new Error(`the suite could not be run: ${r.error.message}`);   // a run that never started is no reading of anything
  const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''), n = (k) => Number((o.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) || [])[1]);
  const pass = n('pass'), fail = n('fail');
  // D677 (the chair, 00:24Z): a red with no name cannot be told from load or from a real fault, so a run names what failed: the spec
  // reporter's "✖ <name> (<time>)" (printed inline and again under "✖ failing tests:", so once each here), or TAP's "not ok N - <name>".
  const failed = [...new Set([...o.matchAll(/^\s*✖ (.+) \(\d+(?:\.\d+)?m?s\)\s*$/gm), ...o.matchAll(/^\s*not ok \d+ - (.+?)\s*$/gm)].map((m) => m[1]))];
  return { pass, fail, failed, ms, stopped, crashed: !stopped && !(Number.isFinite(pass) && Number.isFinite(fail)) };
}
/** The failing tests' names for a printed line: at most three, then how many more. */
const named = (r) => (r.failed && r.failed.length ? `  failing: ${r.failed.slice(0, 3).join(' | ')}${r.failed.length > 3 ? ` (and ${r.failed.length - 3} more)` : ''}` : '');
/** A control is green only when it finished, with passes and no failure. */
function controlGreen(r) { return !r.stopped && !r.crashed && r.fail === 0 && r.pass > 0; }
/** One mutant's reading. `again()` runs an unmutated copy under the same stop; it is asked only when the mutant was stopped. */
function verdict(r, again, stopMs) {
  if (Number.isFinite(r.fail) && r.fail > 0) return { status: 'CAUGHT', why: '' };
  if (r.crashed) return { status: 'CAUGHT', why: 'the suite crashed: it exited with no tally' };   // a waiter stuck behind a dead holder, or a throw at load
  if (!r.stopped) return { status: 'SURVIVED', why: '' };
  const c = again();
  if (controlGreen(c)) return { status: 'CAUGHT', why: `stopped at ${secs(stopMs)}; the control, run again, finished in ${secs(c.ms)}` };
  return { status: 'NOT READ', why: `stopped at ${secs(stopMs)}, and the control, run again, ${c.stopped ? 'was stopped too' : `was not green${named(c)}`}: load, not a reading` };
}

function main() {
  require('./heavy-run.js').hold({ cmd: 'heavy-run.mutants' });   // ONE HEAVY RUNNER PER TREE
  // --only N, or a range or list (--only 30-34, --only 1,5,9): a long set run in units, so its slot is yielded between them (L202).
  const onlyAt = process.argv.indexOf('--only'), onlyArg = onlyAt > 0 ? String(process.argv[onlyAt + 1] || '') : '';
  const only = onlyArg ? new Set(onlyArg.split(',').flatMap((p) => { const [a, b] = p.split('-').map(Number); return b ? Array.from({ length: b - a + 1 }, (_, k) => a + k) : [a]; })) : null;
  const read = (f) => fs.readFileSync(path.join(HERE, f), 'utf8').replace(/\r\n/g, '\n');
  const runCopy = (stopMs) => { const d = tree(); try { return run(d, stopMs); } finally { fs.rmSync(d, { recursive: true, force: true }); } };
  const control = runCopy(CONTROL_CAP_MS);
  console.log(`control (unmutated copy)                                        pass ${control.pass} fail ${control.fail}  in ${secs(control.ms)}${named(control)}`);
  if (!controlGreen(control)) { console.log(`CONTROL NOT GREEN${control.stopped ? ` (stopped at its ${secs(CONTROL_CAP_MS)} cap)` : ''} - no mutant result means anything`); process.exitCode = 1; return; }
  const stopMs = stopFor(control.ms);
  console.log(`each mutant is stopped at ${secs(stopMs)}: the control's ${secs(control.ms)} x ${STOP_MARGIN}, never under ${secs(STOP_FLOOR_MS)}`);
  let applied = 0, caught = 0, notRead = 0, notApplied = 0;
  MUTANTS.forEach(([name, file, anchor, repl], i) => {
    if (only != null && !only.has(i + 1)) return;
    const src = read(file), hits = src.split(anchor).length - 1, label = `${String(i + 1).padStart(2)} ${name}`.padEnd(100);
    if (hits !== 1) { notApplied++; console.log(`${label} NOT APPLIED (anchor found ${hits} times)`); return; }
    applied++;
    const d = tree();
    try {
      fs.writeFileSync(path.join(d, 'tools', file), src.replace(anchor, () => repl));
      const r = run(d, stopMs), v = verdict(r, () => runCopy(stopMs), stopMs);
      if (v.status === 'CAUGHT') caught++; else if (v.status === 'NOT READ') notRead++;
      console.log(`${label} pass ${r.pass} fail ${r.fail}  ${v.status}${v.why ? ` (${v.why})` : ''}${named(r)}`);
    } finally { fs.rmSync(d, { recursive: true, force: true }); }
  });
  console.log(`\n${applied} applied · ${caught} caught · ${applied - caught - notRead} survived · ${notRead} NOT READ · ${notApplied} NOT APPLIED`);
  if (applied - caught > 0 || notApplied > 0) process.exitCode = 1;   // a NOT READ row is not a catch, so it fails the run too
}

module.exports = { run, tree, MUTANTS, stopFor, controlGreen, verdict, named, STOP_FLOOR_MS, STOP_MARGIN, CONTROL_CAP_MS };
if (require.main === module) main();

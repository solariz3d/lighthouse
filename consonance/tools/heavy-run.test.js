#!/usr/bin/env node
'use strict';
// heavy-run.test.js — L098: ONE HEAVY RUNNER PER TREE. Every test uses a TEMP data dir (CONSONANCE_DATA or an explicit
// dataDir); the live <data>/heavy-run.lock is never read or written here. The token variable the live js-suite exports
// to its children is REMOVED from every environment below, or these tests would be re-entrant into the live run.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const H = require('./heavy-run.js');
const HELPER = path.join(__dirname, 'heavy-run.js');

const dirs = [];
function tmp() { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'heavy-run-')); dirs.push(d); return d; }
process.on('exit', () => { for (const d of dirs) { try { fs.rmSync(d, { recursive: true, force: true }); } catch (_) {} } });

const cleanEnv = (extra = {}) => { const e = { ...process.env }; delete e[H.TOKEN_ENV]; delete e.CONSONANCE_PANE; return { ...e, ...extra }; };
const lockOf = (d) => path.join(d, H.LOCK_NAME);
const readLock = (d) => JSON.parse(fs.readFileSync(lockOf(d), 'utf8'));
// A child that takes the lock through hold(), exactly as a runner does, then does `then` (JS source).
const child = (data, cmd, then, seat) => spawn(process.execPath, ['-e',
  `const H=require(${JSON.stringify(HELPER)});H.hold({cmd:${JSON.stringify(cmd)},pollMs:50});${then}`],
{ env: cleanEnv({ CONSONANCE_DATA: data, ...(seat ? { CONSONANCE_PANE: seat } : {}) }), stdio: ['ignore', 'pipe', 'pipe'] });
const done = (cp) => new Promise((res) => { let out = '', err = ''; cp.stdout.on('data', (b) => { out += b; }); cp.stderr.on('data', (b) => { err += b; }); cp.on('close', (code) => res({ code, out, err })); });
const until = async (pred, ms = 10000) => { const t0 = Date.now(); while (!pred()) { if (Date.now() - t0 > ms) throw new Error('timed out waiting'); await new Promise((r) => setTimeout(r, 25)); } };

test('TWO RUNS STARTED TOGETHER: the second WAITS, names the first\'s seat, pid and command, and runs only after it', async () => {
  const d = tmp();
  const first = child(d, 'js-suite (first)', 'setTimeout(()=>{},1200)', 'aaaa1111-first');
  const firstDone = done(first);
  await until(() => fs.existsSync(lockOf(d)));
  const holder = readLock(d);
  assert.strictEqual(holder.pid, first.pid);
  const second = child(d, 'state-sync.mutants', 'console.log("RAN at "+Date.now())');
  const r2 = await done(second);
  const r1 = await firstDone;
  assert.strictEqual(r1.code, 0, r1.err);
  assert.strictEqual(r2.code, 0, r2.err);
  assert.match(r2.err, new RegExp(`heavy-run: waiting on aaaa1111 pid ${first.pid} \\(js-suite \\(first\\), since `), r2.err);
  assert.ok(!fs.existsSync(lockOf(d)), 'both released');
});

test('A STALE LOCK (its pid is dead) is taken over, and the takeover is logged with the holder and its age', () => {
  const d = tmp();
  const started = new Date(Date.now() - 90 * 60 * 1000).toISOString();
  fs.writeFileSync(lockOf(d), JSON.stringify({ pid: 424242, seat: 'bbbb2222', cmd: 'close.mutants', started, token: 'old' }));
  const logs = [];
  const h = H.acquire({ cmd: 'js-suite', dataDir: d, env: {}, alive: (pid) => pid !== 424242, log: (s) => logs.push(s) });
  assert.strictEqual(h.reentrant, false);
  assert.match(logs.join('\n'), /took over a stale lock — bbbb2222 pid 424242 \(close\.mutants, since .*\) is not running; it was 90m old/);
  const now = readLock(d);
  assert.strictEqual(now.pid, process.pid);
  assert.strictEqual(now.took_over.holder.pid, 424242, 'the new lock records whom it replaced');
  assert.ok(now.took_over.age_ms >= 90 * 60 * 1000 - 5000);
  h.release();
  assert.ok(!fs.existsSync(lockOf(d)));
  assert.deepStrictEqual(fs.readdirSync(d), [], 'the stale lock set aside is not left behind');
});

test('a LIVE holder is never taken over: after the max wait the second FAILS LOUDLY with the holder\'s details and does not run', () => {
  const d = tmp();
  const live = { pid: 777, seat: 'cccc3333', cmd: 'union-at-launch.mutants', started: '2026-09-23T09:00:00.000Z', token: 'live' };
  fs.writeFileSync(lockOf(d), JSON.stringify(live));
  let t = 0;
  const logs = [];
  assert.throws(
    () => H.acquire({ cmd: 'js-suite', dataDir: d, env: {}, alive: () => true, maxWaitMs: 1000, pollMs: 100, now: () => t, sleep: (ms) => { t += ms; }, log: (s) => logs.push(s) }),
    (e) => e.code === 'HEAVY_RUN_TIMEOUT' && /cccc3333 pid 777 \(union-at-launch\.mutants, since 2026-09-23T09:00:00\.000Z\)/.test(e.message) && /not running anyway/i.test(e.message),
  );
  assert.deepStrictEqual(readLock(d), live, 'the live lock is untouched');
  assert.match(logs[0], /^heavy-run: waiting on cccc3333 pid 777/);
});

test('RELEASE ON A THROWN ERROR: a runner that throws leaves no lock behind', async () => {
  const d = tmp();
  const r = await done(child(d, 'boom', 'throw new Error("boom")'));
  assert.notStrictEqual(r.code, 0);
  assert.match(r.err, /boom/);
  assert.ok(!fs.existsSync(lockOf(d)), 'the exit handler released it');
});

test('RELEASE ON SIGINT: the handler hold() installs releases and exits 130 (the handler, run by emitting the signal in-process)', async () => {
  // Windows does not deliver SIGINT to a child from outside, so the handler is exercised by process.emit — this tests
  // what the handler DOES, not the OS delivering it.
  const d = tmp();
  const r = await done(child(d, 'sig', 'console.log("held="+require("fs").existsSync(process.env.CONSONANCE_DATA+"/heavy-run.lock"));process.emit("SIGINT");setTimeout(()=>{},5000)'));
  assert.match(r.out, /held=true/);
  assert.strictEqual(r.code, 130);
  assert.ok(!fs.existsSync(lockOf(d)));
});

test('RELEASE ON NORMAL EXIT, and release removes only its OWN lock', () => {
  const d = tmp();
  const h = H.acquire({ cmd: 'x', dataDir: d, env: {} });
  fs.writeFileSync(lockOf(d), JSON.stringify({ pid: 1, token: 'someone-else' }));  // replaced behind its back
  h.release();
  assert.strictEqual(readLock(d).token, 'someone-else', 'a lock that is not ours is left alone');
  const r = spawnSync(process.execPath, ['-e', `require(${JSON.stringify(HELPER)}).hold({cmd:'ok'})`], { env: cleanEnv({ CONSONANCE_DATA: tmp() }) });
  assert.strictEqual(r.status, 0, String(r.stderr));
});

test('a NESTED run under the holder (its token in the environment) is the same run: it does not wait and does not release', () => {
  const d = tmp();
  const env = {};
  const outer = H.acquire({ cmd: 'js-suite', dataDir: d, env });
  assert.ok(env[H.TOKEN_ENV], 'the holder exports its token to children');
  const inner = H.acquire({ cmd: 'mutant-harness --audit', dataDir: d, env: { ...env }, maxWaitMs: 0 });
  assert.strictEqual(inner.reentrant, true);
  inner.release();
  assert.ok(fs.existsSync(lockOf(d)), 'the nested run must not free the outer run\'s lock');
  outer.release();
  assert.ok(!fs.existsSync(lockOf(d)));
});

test('a token that is NOT the current holder\'s (a child of some earlier run) is no pass: it waits like anyone else', () => {
  const d = tmp();
  fs.writeFileSync(lockOf(d), JSON.stringify({ pid: 777, seat: 'dddd4444', cmd: 'js-suite', started: '2026-09-23T09:00:00.000Z', token: 'current' }));
  let t = 0;
  assert.throws(
    () => H.acquire({ cmd: 'x', dataDir: d, env: { [H.TOKEN_ENV]: 'an-earlier-run' }, alive: () => true, maxWaitMs: 500, pollMs: 100, now: () => t, sleep: (ms) => { t += ms; }, log: () => {} }),
    (e) => e.code === 'HEAVY_RUN_TIMEOUT',
  );
});

test('no data dir is a REFUSAL, never a run without the lock', () => {
  assert.throws(() => H.acquire({ cmd: 'x', dataDir: null, env: {} }), /no data dir/);
});

test('the lock holds {pid, seat, cmd, started} (and the token)', () => {
  const d = tmp();
  const h = H.acquire({ cmd: 'trip-check.mutants', dataDir: d, env: { CONSONANCE_PANE: '0845a868-38f2' } });
  const l = readLock(d);
  assert.deepStrictEqual(Object.keys(l).sort(), ['cmd', 'pid', 'seat', 'started', 'token']);
  assert.strictEqual(l.seat, '0845a868');
  assert.strictEqual(l.cmd, 'trip-check.mutants');
  h.release();
});

test('pidAlive: this process is alive; a pid that does not exist is not', () => {
  assert.strictEqual(H.pidAlive(process.pid), true);
  let dead = 900000;
  while (true) { try { process.kill(dead, 0); dead++; } catch (e) { if (e.code === 'ESRCH') break; dead++; } }
  assert.strictEqual(H.pidAlive(dead), false);
  assert.strictEqual(H.pidAlive(0), false);
  assert.strictEqual(H.pidAlive('x'), false);
});

// ---- D283 (the chair, 2026-10-10): a young lock needs a SECOND witness before it is taken ----
// The incident: the chair's run held the lock, the chair TaskStop-ped it at 01:58:50.042Z, and a waiter took the lock at 01:58:51.590Z (age_ms 2,300,472). That takeover was RIGHT: a stopped
// task takes its whole tree and leaves the lock file. The chair read it as a live lock taken by mistake, and asked that no lock younger than the longest known run (1,570 s) ever be taken on
// ONE liveness read that a second method disagrees with. These rows pin that, with the readings injected where a real process cannot be made to disagree with itself.
const mark = () => Date.now();
const lockAt = (d, minutesAgo, extra = {}) => fs.writeFileSync(lockOf(d), JSON.stringify({ pid: 424242, seat: 'eeee5555', cmd: 'chair land-turnby (probe)', started: new Date(mark() - minutesAgo * 60000).toISOString(), token: 'T1', ...extra }));
function attempt(d, opts = {}) {   // acquire with a fake clock that the sleeps advance; returns { h } or { err }, and every log line
  let t = 0; const base = mark(), logs = [], calls = { alive: 0, gone: 0 };
  const alive = opts.alive || (() => true), gone = opts.gone || (() => true);
  try {
    const h = H.acquire({ cmd: 'x', dataDir: d, env: {}, maxWaitMs: opts.maxWaitMs ?? 1000, pollMs: 100, now: () => base + t, sleep: (ms) => { t += ms; }, log: (s) => logs.push(s), alive: (p) => { calls.alive++; return alive(p); }, confirmGone: (p) => { calls.gone++; return gone(p); } });
    return { h, logs, calls };
  } catch (e) { return { err: e, logs, calls }; }
}

test('D283 (RED FIRST) the claimed false takeover: kill(0) reads a 5-minute-old holder dead, tasklist reads it RUNNING: the lock is NOT taken, the disagreement is said once with both readings, and at the max wait it fails loudly', () => {
  const d = tmp(); lockAt(d, 5);
  const r = attempt(d, { alive: () => false, gone: () => false });
  assert.ok(r.err, 'it did not take the lock'); assert.strictEqual(r.err.code, 'HEAVY_RUN_TIMEOUT');
  assert.strictEqual(readLock(d).token, 'T1', 'the lock is untouched');
  const says = r.logs.filter((l) => /NOT taken over/.test(l));
  assert.strictEqual(says.length, 1, 'said once, not at every poll: ' + r.logs.join(' | '));
  assert.match(says[0], /eeee5555 pid 424242 \(chair land-turnby \(probe\), since .*\) reads not-running to process\.kill\(pid, 0\) but RUNNING to tasklist; the lock is 5m old, younger than 30m/);
  assert.ok(r.calls.gone >= 2, 'it asked the second method again at every poll (a holder that dies later is still taken)');
});

test('D283 a young lock whose holder BOTH methods say is gone IS taken over, and logged (a TaskStop leaves exactly this)', () => {
  const d = tmp(); lockAt(d, 38);   // 38 minutes: the incident's age
  // a younger one too: 5 minutes
  for (const minutes of [5, 0.05]) {
    lockAt(d, minutes);
    const r = attempt(d, { alive: () => false, gone: () => true });
    assert.ok(r.h, `${minutes} min old, both agree gone: taken (${r.err && r.err.message})`);
    assert.match(r.logs.join('\n'), /took over a stale lock — eeee5555 pid 424242 \(chair land-turnby \(probe\), since .*\) is not running/);
    assert.strictEqual(readLock(d).took_over.holder.pid, 424242); assert.strictEqual(r.calls.gone, 1, 'one extra read');
    r.h.release(); assert.deepStrictEqual(fs.readdirSync(d), []);
  }
});

test('D283 a young lock the second method CANNOT judge (null) is not taken: unknown is the safe side; it waits and fails loudly', () => {
  const d = tmp(); lockAt(d, 10);
  const r = attempt(d, { alive: () => false, gone: () => null });
  assert.ok(r.err && r.err.code === 'HEAVY_RUN_TIMEOUT'); assert.strictEqual(readLock(d).token, 'T1');
  assert.match(r.logs.join('\n'), /reads not-running to process\.kill\(pid, 0\) but tasklist could not confirm it/);
});

test('D283 an OLD lock (30 minutes or more) is taken on kill(0) alone: the second method is never asked; to the millisecond', () => {
  const d = tmp();
  for (const [ms, old] of [[H.YOUNG_MS, true], [H.YOUNG_MS + 1, true], [H.YOUNG_MS - 1, false], [H.YOUNG_MS - 60000, false]]) {
    fs.writeFileSync(lockOf(d), JSON.stringify({ pid: 424242, seat: 'eeee5555', cmd: 'old', started: new Date(Date.now() - ms).toISOString(), token: 'T1' }));
    // the clock is fixed so the age is exact
    const base = Date.parse(JSON.parse(fs.readFileSync(lockOf(d), 'utf8')).started) + ms; let asked = 0; const logs = [];
    let h, err; try { h = H.acquire({ cmd: 'x', dataDir: d, env: {}, maxWaitMs: 0, pollMs: 10, now: () => base, sleep: () => {}, log: (s) => logs.push(s), alive: () => false, confirmGone: () => { asked++; return false; } }); } catch (e) { err = e; }
    if (old) { assert.ok(h, `${ms} ms old is old enough (${err && err.message})`); assert.strictEqual(asked, 0, 'the second method is not asked of an old lock'); h.release(); }
    else { assert.ok(err, `${ms} ms old is still young`); assert.strictEqual(asked, 1); fs.rmSync(lockOf(d), { force: true }); }
  }
});

test('D283 a lock whose age cannot be read (no started, or junk) counts as YOUNG: the second witness is asked', () => {
  for (const started of [undefined, 'not a date', null, '']) {
    const d = tmp(); fs.writeFileSync(lockOf(d), JSON.stringify({ pid: 424242, seat: 'eeee5555', cmd: 'x', token: 'T1', ...(started !== undefined ? { started } : {}) }));
    const r = attempt(d, { alive: () => false, gone: () => false });
    assert.ok(r.err, JSON.stringify(started)); assert.strictEqual(r.calls.gone > 0, true); assert.match(r.logs.join('\n'), /of unknown age/);
  }
});

test('D283 PID REUSE fails safe: a lock whose pid is now some OTHER live process reads alive on every method, so the waiter waits and gives up loudly (real methods)', () => {
  const d = tmp(); lockAt(d, 8, { pid: process.pid, token: 'reused' });   // this test process stands in for "whatever now owns that pid"
  let t = 0; const base = mark();
  assert.throws(() => H.acquire({ cmd: 'x', dataDir: d, env: {}, maxWaitMs: 1500, pollMs: 100, now: () => base + t, sleep: (ms) => { t += ms; }, log: () => {} }), (e) => e.code === 'HEAVY_RUN_TIMEOUT');
  assert.strictEqual(readLock(d).token, 'reused');
});

test('D283 REAL: a live holder in another process is never taken: the real kill(0) and the real tasklist both say running, the waiter gives up, the lock is untouched and the holder still runs', async () => {
  const d = tmp(); const holder = child(d, 'js-suite (a long real run)', 'setTimeout(()=>{},20000)', 'ffff6666-holder');
  try {
    await until(() => fs.existsSync(lockOf(d)));
    assert.strictEqual(readLock(d).pid, holder.pid, 'the lock names the holder\'s own pid, which lives as long as its work');
    assert.strictEqual(H.pidAlive(holder.pid), true); assert.strictEqual(H.pidGone(holder.pid), process.platform === 'win32' ? false : true, 'tasklist lists it (off Windows kill(0) is the whole truth)');
    const t0 = Date.now();
    assert.throws(() => H.acquire({ cmd: 'x', dataDir: d, env: {}, maxWaitMs: 1200, pollMs: 100, log: () => {} }), (e) => e.code === 'HEAVY_RUN_TIMEOUT' && /ffff6666/.test(e.message));
    assert.ok(Date.now() - t0 >= 1100);
    assert.strictEqual(readLock(d).token, JSON.parse(fs.readFileSync(lockOf(d), 'utf8')).token); assert.strictEqual(H.pidAlive(holder.pid), true);
  } finally { holder.kill('SIGKILL'); await done(holder); }
});

test('D283 REAL: a holder killed HARD (as a stopped task is) leaves its lock, and the next runner takes it over at once, logged, naming the dead pid (real kill(0) and real tasklist)', async () => {
  const d = tmp(); const holder = child(d, 'chair land-turnby (killed)', 'setTimeout(()=>{},60000)', 'aaaa7777-killed');
  await until(() => fs.existsSync(lockOf(d)));
  const pid = holder.pid; holder.kill('SIGKILL'); await done(holder);
  assert.ok(fs.existsSync(lockOf(d)), 'a hard kill runs no exit handler: the lock file is left behind');
  await until(() => H.pidAlive(pid) === false, 5000);
  const logs = [];
  const h = H.acquire({ cmd: 'next', dataDir: d, env: {}, maxWaitMs: 5000, pollMs: 50, log: (s) => logs.push(s) });
  assert.match(logs.join('\n'), new RegExp(`took over a stale lock — aaaa7777 pid ${pid} \\(chair land-turnby \\(killed\\)`));
  assert.strictEqual(readLock(d).took_over.holder.pid, pid);
  h.release();
});

test('D283 pidGone: tasklist is asked for exactly that pid; a listed row means running; no row (exit 0) means gone; a failure, an error or garbage means "cannot tell"; off Windows kill(0) is the whole truth', () => {
  const calls = []; const mk = (r) => (cmd, args, o) => { calls.push({ cmd, args, o }); return r; };
  const row = (pid) => `"node.exe","${pid}","Console","1","45,052 K"\r\n`;
  assert.strictEqual(H.pidGone(3124, mk({ status: 0, stdout: row(3124) }), 'win32'), false);
  assert.deepStrictEqual(calls[0].args, ['/FI', 'PID eq 3124', '/FO', 'CSV', '/NH']); assert.strictEqual(calls[0].cmd, 'tasklist'); assert.strictEqual(calls[0].o.windowsHide, true); assert.ok(calls[0].o.timeout > 0);
  assert.strictEqual(H.pidGone(3124, mk({ status: 0, stdout: 'INFO: No tasks are running which match the specified criteria.\r\n' }), 'win32'), true);
  assert.strictEqual(H.pidGone(3124, mk({ status: 0, stdout: '' }), 'win32'), true, 'a localized "no tasks" message is not matched by words');
  assert.strictEqual(H.pidGone(3124, mk({ status: 0, stdout: row(3125) }), 'win32'), true, 'a row for ANOTHER pid is not this pid');
  assert.strictEqual(H.pidGone(3124, mk({ status: 0, stdout: row(31240) + row(3124) }), 'win32'), false, 'the pid is matched whole, in the pid column');
  assert.strictEqual(H.pidGone(3124, mk({ status: 0, stdout: '"3124","x","y","1","1 K"\r\n' }), 'win32'), true, 'a 3124 in the NAME column is not the pid column');
  for (const bad of [{ status: 1, stdout: row(3124) }, { status: null, stdout: '', error: new Error('ENOENT') }, { status: 0, stdout: null }, null, undefined]) assert.strictEqual(H.pidGone(3124, mk(bad), 'win32'), null, JSON.stringify(bad));
  assert.strictEqual(H.pidGone(3124, () => { throw new Error('spawn blew up'); }, 'win32'), null, 'a throw is "cannot tell"');
  const n = calls.length; assert.strictEqual(H.pidGone(3124, mk({ status: 0, stdout: '' }), 'linux'), true); assert.strictEqual(calls.length, n, 'off Windows it does not even ask');
  assert.strictEqual(H.pidGone(process.pid), process.platform === 'win32' ? false : true); assert.strictEqual(H.pidGone(0x7ffffff0), true, 'a pid that cannot exist is gone');
});

test('D283 pidAlive: EPERM is alive (not allowed to touch it is not dead); ESRCH, any other error and a bad pid are not', () => {
  const thrower = (code) => () => { const e = new Error(code); e.code = code; throw e; };
  assert.strictEqual(H.pidAlive(10, () => {}), true); assert.strictEqual(H.pidAlive(10, thrower('EPERM')), true);
  assert.strictEqual(H.pidAlive(10, thrower('ESRCH')), false); assert.strictEqual(H.pidAlive(10, thrower('EINVAL')), false);
  for (const bad of [0, -1, 1.5, '10', NaN, null, undefined]) assert.strictEqual(H.pidAlive(bad, () => {}), false, String(bad));
});

test('D283 a race: a LIVE lock created between the read and the takeover is put back, not clobbered, and the waiter keeps waiting', () => {
  const d = tmp(); lockAt(d, 3, { pid: 111, token: 'T1' });
  const mine = { pid: 222, seat: 'gggg8888', cmd: 'the racer', started: new Date(mark()).toISOString(), token: 'T2' };
  let t = 0; const base = mark(); let swapped = false;
  const alive = (p) => { if (p === 111 && !swapped) { swapped = true; fs.writeFileSync(lockOf(d), JSON.stringify(mine)); return false; } return p === 222; };   // the holder reads dead; meanwhile another runner took the lock
  assert.throws(() => H.acquire({ cmd: 'x', dataDir: d, env: {}, maxWaitMs: 500, pollMs: 100, now: () => base + t, sleep: (ms) => { t += ms; }, log: () => {}, alive, confirmGone: () => true }), (e) => e.code === 'HEAVY_RUN_TIMEOUT' && /gggg8888 pid 222/.test(e.message));
  assert.deepStrictEqual(readLock(d), mine, 'the racer\'s lock was put back exactly');
  assert.deepStrictEqual(fs.readdirSync(d), ['heavy-run.lock'], 'and nothing is left set aside');
});

test('D283 hold() exits 3 when the max wait runs out behind a live holder (loudly, naming it) and 2 when there is no data dir; it never runs the work', async () => {
  const d = tmp(); const holder = child(d, 'a long real run', 'setTimeout(()=>{},20000)', 'hhhh9999-holder');
  try {
    await until(() => fs.existsSync(lockOf(d)));
    const waiter = spawn(process.execPath, ['-e', `const H=require(${JSON.stringify(HELPER)});H.hold({cmd:'waiter',pollMs:50});console.log('RAN')`], { env: cleanEnv({ CONSONANCE_DATA: d, CONSONANCE_HEAVY_WAIT_MS: '700' }), stdio: ['ignore', 'pipe', 'pipe'] });
    const r = await done(waiter);
    assert.strictEqual(r.code, 3, r.err); assert.doesNotMatch(r.out, /RAN/, 'the work never started'); assert.match(r.err, /gave up after .* hhhh9999 pid \d+ \(a long real run/);
  } finally { holder.kill('SIGKILL'); await done(holder); }
  const noDir = spawn(process.execPath, ['-e', `require(${JSON.stringify(HELPER)}).hold({cmd:'x',dataDir:null});console.log('RAN')`], { env: cleanEnv({}), stdio: ['ignore', 'pipe', 'pipe'] });
  const r2 = await done(noDir); assert.strictEqual(r2.code, 2, r2.err); assert.doesNotMatch(r2.out, /RAN/); assert.match(r2.err, /no data dir/);
});

test('D283 an UNREADABLE lock: one written this instant (younger than the grace) is waited for; an old one is taken over and logged as unreadable', () => {
  const fresh = tmp(); fs.writeFileSync(lockOf(fresh), '{ half written');
  let t = 0; const base = Date.now();
  assert.throws(() => H.acquire({ cmd: 'x', dataDir: fresh, env: {}, maxWaitMs: 500, pollMs: 100, now: () => base + t, sleep: (ms) => { t += ms; }, log: () => {} }), (e) => e.code === 'HEAVY_RUN_TIMEOUT', 'a fresh unreadable lock is not taken');
  assert.strictEqual(fs.readFileSync(lockOf(fresh), 'utf8'), '{ half written');
  const old = tmp(); fs.writeFileSync(lockOf(old), 'junk'); const past = new Date(Date.now() - 60000); fs.utimesSync(lockOf(old), past, past);
  const logs = [];
  const h = H.acquire({ cmd: 'x', dataDir: old, env: {}, maxWaitMs: 500, pollMs: 100, log: (s) => logs.push(s) });
  assert.match(logs.join('\n'), /took over a stale lock — an unreadable lock \(.*\) is not running/); assert.strictEqual(h.holder.took_over.holder.pid, null);
  h.release();
});

test('WIRING (a source sweep): js-suite and every *.mutants.js and mutant-harness.js take the lock through this helper', () => {
  const wired = ['js-suite.js', 'mutant-harness.js', ...fs.readdirSync(__dirname).filter((f) => f.endsWith('.mutants.js'))];
  assert.ok(wired.length >= 8, `found ${wired.length}`);
  for (const f of wired) {
    const src = fs.readFileSync(path.join(__dirname, f), 'utf8');
    assert.match(src, /require\('\.\/heavy-run\.js'\)\.hold\(\{ cmd: /, `${f} does not take the heavy-run lock`);
  }
  assert.match(fs.readFileSync(path.join(__dirname, 'js-suite.js'), 'utf8'), /if \(!process\.env\.JS_SUITE_ROOT\) require\('\.\/heavy-run\.js'\)\.hold/,
    'js-suite takes it only for the real tree — a fixture run is not a heavy run');
  assert.match(fs.readFileSync(path.join(__dirname, 'mutant-harness.js'), 'utf8'), /if \(!argv\.includes\('--audit'\)\) require\('\.\/heavy-run\.js'\)\.hold/,
    '--audit runs the gates only and does not take it');
});

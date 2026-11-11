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

process.env.CONSONANCE_CONFIG = path.join(require('node:os').tmpdir(), 'no-such-consonance-config.json');   // L155: the rows never read this machine's real profile
const H = require('./heavy-run.js');
const HELPER = path.join(__dirname, 'heavy-run.js');

const dirs = [];
function tmp() { const d = require('./scratch.js').mkdtemp('heavy-run-'); dirs.push(d); return d; }
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
// The log lines minus the disk guard's low-space WARNING (D287): acquire() reads the real drive, so on a machine under 50 GB free that warning is
// logs[0] and a row matching the waiting line read it instead (D640 ruling, fix lap 2: rows 3, 32, 34 red at 39.5 GB). The warning has its own rows below.
const notDisk = (logs) => logs.filter((s) => !/^heavy-run: WARNING: .* GB free, under \d+ GB/.test(s));

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
  assert.match(notDisk(logs)[0], /^heavy-run: waiting on cccc3333 pid 777/);
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

test('the lock holds {pid, seat, cmd, started} (and the token, since D286 the tree, and since L124 the holder\'s identity {image, holder_start})', () => {
  const d = tmp();
  const h = H.acquire({ cmd: 'trip-check.mutants', dataDir: d, env: { CONSONANCE_PANE: '0845a868-38f2' } });
  const l = readLock(d);
  assert.deepStrictEqual(Object.keys(l).sort(), ['cmd', 'holder_start', 'image', 'pid', 'seat', 'started', 'token', 'tree']);   // D286: the tree; L124: the identity
  assert.strictEqual(l.image, path.parse(process.execPath).name, 'the image is this executable\'s base name');
  assert.ok(Math.abs(Date.parse(l.holder_start) - (Date.now() - process.uptime() * 1000)) < 2000, 'holder_start is this process\'s start');
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

// D289 (mutant #30): r.error is not covered by r.status. Measured with node 24 on machine D: a child that exits 0 while a process it started still holds its stdout comes back from spawnSync
// as { error: ETIMEDOUT, status: 0, stdout: <what arrived so far> }. That output can stop before the pid's row, and reading it would call a running holder gone.
test('D289 pidGone: a call that timed out after tasklist exited 0 (error set, status 0, partial output) is "cannot tell", not gone', () => {
  const timedOut = Object.assign(new Error('spawnSync tasklist ETIMEDOUT'), { code: 'ETIMEDOUT' });
  const row = (pid) => `"node.exe","${pid}","Console","1","50,000 K"\r\n`;
  for (const stdout of ['', row(3125), '"node.exe","31']) assert.strictEqual(H.pidGone(3124, () => ({ error: timedOut, status: 0, signal: null, stdout }), 'win32'), null, JSON.stringify(stdout));
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

// D289 (mutant #16): the put-back judged the moved lock by kill(0) alone, so a YOUNG racer's lock that kill(0) misreads was thrown away without D283's second witness. Any other runner's lock caught
// by the rename is now put back and judged at the next poll by the rules every lock gets.
test('D289 a race: a YOUNG lock caught by the rename is not thrown away on kill(0) alone; it is put back, tasklist is asked, and while tasklist says RUNNING the waiter waits', () => {
  const d = tmp(); lockAt(d, 40, { pid: 111, token: 'T1' });   // an OLD dead holder: kill(0) alone may take it
  const racer = { pid: 222, seat: 'gggg8888', cmd: 'the racer', started: new Date(mark()).toISOString(), token: 'T2' };
  let swapped = false; const asked = [];
  const r = attempt(d, { alive: (p) => { if (p === 111 && !swapped) { swapped = true; fs.writeFileSync(lockOf(d), JSON.stringify(racer)); } return false; }, gone: (p) => { asked.push(p); return p !== 222; } });
  assert.ok(r.err, 'it did not take the racer\'s lock'); assert.strictEqual(r.err.code, 'HEAVY_RUN_TIMEOUT'); assert.match(r.err.message, /gggg8888 pid 222/);
  assert.deepStrictEqual(readLock(d), racer, 'the racer\'s lock was put back exactly');
  assert.ok(asked.includes(222), 'tasklist was asked about the racer: ' + JSON.stringify(asked));
  assert.deepStrictEqual(fs.readdirSync(d), ['heavy-run.lock'], 'and nothing is left set aside');
});

// D289 F1: a runner claims with openSync(file, 'wx') and writes after, so a rename in between moves an EMPTY file, which reads unreadable. Throwing it away let the waiter claim the slot
// while the racer, whose clash check skips its own slot, ran too. An unreadable moved lock now gets the rule every unreadable lock gets: put back while younger than the grace, taken when
// old. The racer is a real open handle here, so its write after the put-back lands in the slot as it would on a live machine.
function racerClaim(file) { fs.unlinkSync(file); return fs.openSync(file, 'wx'); }   // another runner took the stale lock over and has opened its claim, not yet written
function racerWrites(fd, rec) { try { fs.writeSync(fd, JSON.stringify(rec)); } finally { fs.closeSync(fd); } }
const racerRec = () => ({ pid: 333, seat: 'kkkk1111', cmd: 'the racer', started: new Date(mark()).toISOString(), token: 'T3' });
test('D289 F1 a race: another runner\'s claim caught between its wx open and its write (an empty lock) is put back, not thrown away, and the waiter waits; the racer\'s write lands in the slot', () => {
  const d = tmp(); lockAt(d, 40, { pid: 111, token: 'T1' });   // an OLD dead holder: kill(0) alone may take it
  let fd = null;
  const r = attempt(d, { alive: (p) => { if (p === 111 && fd === null) fd = racerClaim(lockOf(d)); return false; } });
  if (r.h) r.h.release();
  const rec = racerRec(); racerWrites(fd, rec);
  assert.ok(r.err, 'the waiter did not claim the racer\'s slot'); assert.strictEqual(r.err.code, 'HEAVY_RUN_TIMEOUT');
  assert.deepStrictEqual(readLock(d), rec, 'the racer\'s claim is in the slot');
  assert.deepStrictEqual(fs.readdirSync(d), ['heavy-run.lock'], 'and nothing is left set aside');
});
// With F1 a fresh unreadable lock moved aside is put back, so the first read's grace rule (mutant #69) could look redundant. It is not: moving a claim aside and back opens a gap in
// which a third runner can claim the slot, the put-back then fails, and the claim being written is lost. A lock younger than the grace is never moved at all.
test('D289 F1 a claim being written this instant (unreadable, younger than the grace) is waited for without ever being moved aside', () => {
  const d = tmp(); fs.writeFileSync(lockOf(d), '');
  let moves = 0, t = 0; const base = Date.now();
  assert.throws(() => H.acquire({ cmd: 'x', dataDir: d, env: {}, maxWaitMs: 500, pollMs: 100, now: () => base + t, sleep: (ms) => { t += ms; }, log: () => {}, beforeTake: () => { moves++; } }), (e) => e.code === 'HEAVY_RUN_TIMEOUT');
  assert.strictEqual(moves, 0, 'the claim was never moved');
  assert.strictEqual(fs.readFileSync(lockOf(d), 'utf8'), '');
});
test('D289 F1 the same race when the lock first read was itself an OLD unreadable lock: the racer\'s fresh empty claim is still put back (only an old unreadable file is taken)', () => {
  const d = tmp(); fs.writeFileSync(lockOf(d), 'junk'); const past = new Date(Date.now() - 60000); fs.utimesSync(lockOf(d), past, past);
  let fd = null, t = 0; const base = Date.now();
  let h = null, err = null;
  try { h = H.acquire({ cmd: 'x', dataDir: d, env: {}, maxWaitMs: 500, pollMs: 100, now: () => base + t, sleep: (ms) => { t += ms; }, log: () => {}, beforeTake: ({ file }) => { if (fd === null) fd = racerClaim(file); } }); } catch (e) { err = e; }
  if (h) h.release();
  const rec = racerRec(); racerWrites(fd, rec);
  assert.ok(err, 'the waiter did not claim the racer\'s slot'); assert.strictEqual(err.code, 'HEAVY_RUN_TIMEOUT');
  assert.deepStrictEqual(readLock(d), rec, 'the racer\'s claim is in the slot');
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

// ---- D286 (the keeper, 09:38: "multiple heavy runs at once"): TWO SLOTS, ONE PER TREE ----
// The lock existed so seats do not read each other's half-written files IN ONE CHECKOUT. A t180 landing has no business waiting on a lighthouse cargo run in another worktree. So the lock has
// slots (default 2: heavy-run.lock and heavy-run.2.lock), each lock records its TREE, and a runner whose tree already holds a slot waits whatever slot is free. Trees are injected here
// (`tree:`) where a real checkout is not the point; the rows that run real processes use real temp git repos.
const slot2 = (d) => path.join(d, 'heavy-run.2.lock');
const readFile = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const liveAcq = (d, tr, extra = {}) => H.acquire({ cmd: `run-${tr}`, dataDir: d, env: {}, tree: tr, slots: 2, alive: () => true, log: () => {}, ...extra });
function waitFail(d, tr, extra = {}) {   // a runner that must NOT get a slot: fake clock; returns the timeout error (fails the row if it got in)
  let t = 0; const logs = [];
  let h;
  try { h = liveAcq(d, tr, { maxWaitMs: 500, pollMs: 100, now: () => t, sleep: (ms) => { t += ms; }, log: (s) => logs.push(s), ...extra }); }
  catch (e) { if (e.code !== 'HEAVY_RUN_TIMEOUT') throw e; e.logs = logs; return e; }
  h.release(); assert.fail(`${tr} got slot ${h.slot} but should have waited`);
}

test('D286 (RED FIRST) two runners on DIFFERENT trees both run: slots 1 and 2, each lock names its tree', () => {
  const d = tmp();
  const a = liveAcq(d, '/t/a'), b = liveAcq(d, '/t/b');
  assert.strictEqual(a.slot, 1); assert.strictEqual(b.slot, 2);
  assert.strictEqual(readLock(d).tree, '/t/a'); assert.strictEqual(readFile(slot2(d)).tree, '/t/b');
  assert.notStrictEqual(readLock(d).token, readFile(slot2(d)).token);
  a.release(); assert.ok(!fs.existsSync(lockOf(d)) && fs.existsSync(slot2(d)), 'release frees only its own slot');
  b.release(); assert.deepStrictEqual(fs.readdirSync(d), []);
});

test('D286 two runners on the SAME tree: the second waits, though slot 2 is free, and names the first', () => {
  const d = tmp(); const a = liveAcq(d, '/t/a');
  const e = waitFail(d, '/t/a');
  assert.match(e.message, /gave up after .* pid \d+ \(run-\/t\/a, since /); assert.strictEqual(e.holders.length, 1);
  assert.ok(!fs.existsSync(slot2(d)), 'it did not take the free slot');
  assert.match(notDisk(e.logs)[0], /^heavy-run: waiting on .*run-\/t\/a.* — it holds this tree/);
  a.release();
});

test('D286 the same tree waits WHICHEVER slot holds it (the holder is in slot 2, slot 1 is free)', () => {
  const d = tmp(); const x = liveAcq(d, '/t/x'); const a = liveAcq(d, '/t/a'); x.release();   // slot 1 free, slot 2 holds /t/a
  assert.strictEqual(a.slot, 2); assert.ok(!fs.existsSync(lockOf(d)));
  waitFail(d, '/t/a'); assert.ok(!fs.existsSync(lockOf(d)), 'it did not take the free slot 1');
  const c = liveAcq(d, '/t/c'); assert.strictEqual(c.slot, 1, 'a different tree takes the free slot'); c.release(); a.release();
});

test('D286 a THIRD runner with both slots held waits and names BOTH holders', () => {
  const d = tmp(); const a = liveAcq(d, '/t/a'), b = liveAcq(d, '/t/b');
  const e = waitFail(d, '/t/c');
  assert.strictEqual(e.holders.length, 2);
  assert.match(e.message, /run-\/t\/a.* and .*run-\/t\/b.* still hold the slots/);
  assert.match(notDisk(e.logs)[0], /run-\/t\/a.* and .*run-\/t\/b.* — all 2 slots are held/);
  assert.ok(fs.existsSync(lockOf(d)) && fs.existsSync(slot2(d)), 'both holders untouched');
  const e2 = waitFail(d, '/t/a');   // the same tree as one of them: it is waiting on THAT one, and says so (not on both)
  assert.strictEqual(e2.holders.length, 1); assert.match(e2.message, /run-\/t\/a/); assert.doesNotMatch(e2.message, /run-\/t\/b/);
  a.release(); b.release();
});

test('D286 SLOTS=1 is today\'s lock: a different tree WAITS, the second slot file is never made, and a live holder in slot 2 (someone with more slots) also blocks', () => {
  const d = tmp(); const a = liveAcq(d, '/t/a', { slots: 1 });
  waitFail(d, '/t/b', { slots: 1 }); assert.ok(!fs.existsSync(slot2(d)));
  a.release();
  const two = liveAcq(d, '/t/two', { slots: 2 }); const one = liveAcq(d, '/t/b', { slots: 2 }); two.release();   // slot 2 holds /t/b, slot 1 is free
  const e = waitFail(d, '/t/other', { slots: 1 }); assert.match(e.message, /run-\/t\/b/); assert.ok(!fs.existsSync(lockOf(d)), 'slot 1 stayed free: one slot never runs beside any live holder');
  one.release();
});

test('D286 a DEAD holder in slot 2 is taken over and logged, and the new lock in slot 2 records whom it replaced', () => {
  const d = tmp(); const a = liveAcq(d, '/t/a');
  fs.writeFileSync(slot2(d), JSON.stringify({ pid: 424242, seat: 'bbbb2222', cmd: 'close.mutants', tree: '/t/b', started: new Date(Date.now() - 90 * 60000).toISOString(), token: 'old' }));
  const logs = [];
  const b = liveAcq(d, '/t/b', { alive: (p) => p !== 424242, log: (s) => logs.push(s) });
  assert.strictEqual(b.slot, 2);
  assert.match(logs.join('\n'), /took over a stale lock — bbbb2222 pid 424242 \(close\.mutants, since .*\) is not running; it was 90m old \(slot 2\)/);
  const l = readFile(slot2(d)); assert.strictEqual(l.took_over.holder.pid, 424242); assert.strictEqual(l.pid, process.pid);
  assert.strictEqual(readLock(d).tree, '/t/a', 'slot 1 untouched');
  assert.deepStrictEqual(fs.readdirSync(d).sort(), ['heavy-run.2.lock', 'heavy-run.lock'], 'the lock set aside is not left behind');
  a.release(); b.release();
});

test('D286 D283\'s second witness applies PER SLOT: a young slot-2 lock whose holder kill(0) calls dead but tasklist calls RUNNING is not taken', () => {
  const d = tmp(); const a = liveAcq(d, '/t/a');
  fs.writeFileSync(slot2(d), JSON.stringify({ pid: 424242, seat: 'eeee5555', cmd: 'chair', tree: '/t/b', started: new Date(Date.now() - 5 * 60000).toISOString(), token: 'T2' }));
  const e = waitFail(d, '/t/c', { alive: (p) => p !== 424242, confirmGone: () => false });
  assert.match(e.logs.join('\n'), /NOT taken over/); assert.strictEqual(readFile(slot2(d)).token, 'T2', 'untouched');
  a.release();
});

test('D286 a NESTED run re-enters its own slot, slot 2 as well as slot 1, and releases nothing', () => {
  const d = tmp(); const x = liveAcq(d, '/t/x'); const env = {};
  const outer = liveAcq(d, '/t/b', { env });
  assert.strictEqual(outer.slot, 2); assert.ok(env[H.TOKEN_ENV]);
  const inner = H.acquire({ cmd: 'child', dataDir: d, env: { ...env }, tree: '/t/b', maxWaitMs: 0, alive: () => true });
  assert.strictEqual(inner.reentrant, true); assert.strictEqual(inner.slot, 2); inner.release();
  assert.ok(fs.existsSync(slot2(d)), 'the nested run did not free the outer lock');
  outer.release(); x.release();
});

test('D286 a lock from before D286 (no tree recorded) blocks every tree: unknown is the safe side', () => {
  const d = tmp(); fs.writeFileSync(lockOf(d), JSON.stringify({ pid: 777, seat: 'cccc3333', cmd: 'old runner', started: '2026-10-10T09:00:00.000Z', token: 'legacy' }));
  const e = waitFail(d, '/t/anything'); assert.match(e.message, /cccc3333 pid 777/); assert.ok(!fs.existsSync(slot2(d)));
});

test('D286 a RACE between two runners of one tree that claim different free slots in the same instant: the later one sees the earlier and backs off, so only one runs', () => {
  const d = tmp();
  const rival = { pid: 999, seat: 'rrrr0000', cmd: 'the rival', tree: '/t/a', started: new Date().toISOString(), token: 'RIVAL' };
  let fired = 0;
  // the instant after this runner writes slot 1, the rival (same tree) writes slot 2: exactly the interleaving a look-before-claiming cannot see
  const e = waitFail(d, '/t/a', { onClaim: () => { if (!fired++) fs.writeFileSync(slot2(d), JSON.stringify(rival)); } });
  assert.ok(!fs.existsSync(lockOf(d)), 'it removed its own claim when it saw the rival');
  assert.strictEqual(readFile(slot2(d)).token, 'RIVAL', 'and left the rival\'s alone');
  assert.match(e.message, /rrrr0000 pid 999/);
});

test('D286 slot count: the option and CONSONANCE_HEAVY_SLOTS; a typo is the default 2 (it must not switch the lock off); file names heavy-run.lock, heavy-run.2.lock, heavy-run.3.lock', () => {
  assert.strictEqual(H.slotCount(undefined), 2); assert.strictEqual(H.slotCount(''), 2);
  assert.strictEqual(H.slotCount('1'), 1); assert.strictEqual(H.slotCount(3), 3); assert.strictEqual(H.slotCount('4'), 4);
  for (const bad of ['0', '-1', '1.5', 'two', 'NaN', '99', null]) assert.strictEqual(H.slotCount(bad), 2, String(bad));
  assert.strictEqual(path.basename(H.slotFile('/d', 1)), 'heavy-run.lock'); assert.strictEqual(path.basename(H.slotFile('/d', 2)), 'heavy-run.2.lock'); assert.strictEqual(path.basename(H.slotFile('/d', 3)), 'heavy-run.3.lock');
  const d = tmp(); const hs = [1, 2, 3].map((i) => liveAcq(d, `/t/${i}`, { slots: 3 }));
  assert.deepStrictEqual(hs.map((h) => h.slot), [1, 2, 3]); assert.ok(fs.existsSync(path.join(d, 'heavy-run.3.lock')));
  const e = waitFail(d, '/t/4', { slots: 3 }); assert.strictEqual(e.holders.length, 3);
  hs.forEach((h) => h.release());
});

test('D286 resolveTree: a git checkout is its top level (one tree from any subfolder), another checkout is another tree, and a cwd outside git is the one shared non-git bucket', () => {
  const mk = () => { const g = tmp(); assert.strictEqual(spawnSync('git', ['init', '-q'], { cwd: g }).status, 0); fs.mkdirSync(path.join(g, 'sub')); return g; };
  const g1 = mk(), g2 = mk(), plain = tmp(), plain2 = tmp();
  const t1 = H.resolveTree(g1);
  assert.strictEqual(H.resolveTree(path.join(g1, 'sub')), t1, 'a subfolder is the same tree');
  assert.notStrictEqual(H.resolveTree(g2), t1);
  assert.strictEqual(H.resolveTree(plain), H.NON_GIT_TREE); assert.strictEqual(H.resolveTree(plain2), H.NON_GIT_TREE);
  assert.strictEqual(H.resolveTree(plain, () => { throw new Error('no git'); }), H.NON_GIT_TREE, 'git missing: the shared bucket');
  const says = (out, platform) => H.resolveTree(plain, () => ({ status: 0, stdout: out + '\n' }), platform);
  assert.strictEqual(says('/Repo/Tree', 'win32'), says('/REPO/tree', 'win32'), 'on Windows the case does not make two trees');
  assert.strictEqual(says('/Repo/Tree', 'win32'), path.resolve('/Repo/Tree').toLowerCase());
  assert.strictEqual(H.resolveTree(plain, () => ({ status: 128, stdout: 'fatal: not a git repository\n' })), H.NON_GIT_TREE, 'a failed git call is not a tree');
  assert.strictEqual(H.resolveTree(plain, () => ({ status: 0, stdout: '/work/tree\n' }), 'linux'), path.resolve('/work/tree'), 'off Windows the case is kept');
});

test('D286 REAL processes: two runners in two different git checkouts hold the lock AT THE SAME TIME; two in one checkout do not', async () => {
  const mk = () => { const g = tmp(); spawnSync('git', ['init', '-q'], { cwd: g }); return g; };
  const g1 = mk(), g2 = mk(), d = tmp();
  const run = (cwd, cmd, ms) => spawn(process.execPath, ['-e', `const H=require(${JSON.stringify(HELPER)});H.hold({cmd:${JSON.stringify(cmd)},pollMs:50});console.log('HELD '+Date.now());setTimeout(()=>{},${ms})`], { cwd, env: cleanEnv({ CONSONANCE_DATA: d, CONSONANCE_HEAVY_SLOTS: '' }), stdio: ['ignore', 'pipe', 'pipe'] });
  const a = run(g1, 'in-g1', 2500), b = run(g2, 'in-g2', 2500);
  const da = done(a), db = done(b);
  await until(() => fs.existsSync(lockOf(d)) && fs.existsSync(slot2(d)), 15000);
  assert.deepStrictEqual([readLock(d).cmd, readFile(slot2(d)).cmd].sort(), ['in-g1', 'in-g2'], 'both are running at once');
  const ra = await da, rb = await db; assert.strictEqual(ra.code, 0, ra.err); assert.strictEqual(rb.code, 0, rb.err);
  assert.deepStrictEqual(fs.readdirSync(d), [], 'both released');
  // the same checkout: serial
  const c = run(g1, 'first-g1', 1500); const dc = done(c);
  await until(() => fs.existsSync(lockOf(d)) || fs.existsSync(slot2(d)), 15000);
  const second = run(g1, 'second-g1', 100); const dsec = done(second);
  const rs = await dsec, rc = await dc;
  const held = (r) => Number((r.out.match(/HELD (\d+)/) || [])[1]);
  assert.match(rs.err, /waiting on .*first-g1/, rs.err);
  assert.ok(held(rs) >= held(rc) + 1000, `the second ran only after the first let go (${held(rs) - held(rc)} ms later)`);
});

test('D286 the claim is EXCLUSIVE: a rival that takes the slot between this runner\'s look and its claim is never overwritten; the runner waits for it', () => {
  const d = tmp();
  const rival = { pid: 999, seat: 'rrrr0000', cmd: 'the rival', tree: '/t/a', started: new Date().toISOString(), token: 'RIVAL' };
  let fired = 0;
  const e = waitFail(d, '/t/a', { beforeClaim: ({ file }) => { if (!fired++) fs.writeFileSync(file, JSON.stringify(rival)); } });
  assert.strictEqual(readLock(d).token, 'RIVAL', 'the rival\'s lock is intact');
  assert.match(e.message, /rrrr0000 pid 999/);
});

// ---- D287 part 2: THE DISK GUARD. Free space is faked through `diskFree`; the janitor's total through `diskTotal`. No lock is left behind. ----
const GB = 1e9;
const guarded = (d, free, extra = {}) => { const logs = []; const r = (() => { try { return H.acquire({ cmd: 'guard', dataDir: d, env: cleanEnv(), tree: '/t/g', writes: ['C:\\x', 'G:\\y'], diskFree: free, diskTotal: () => 'the janitor would free 42.0 GB', log: (s) => logs.push(s), ...extra }); } catch (e) { return e; } })(); return { r, logs }; };

test('D287 disk guard: under 20 GB free on a drive the run writes to, it REFUSES before taking a slot, naming the drive, the figure and the janitor\'s total', () => {
  const d = tmp();
  const { r } = guarded(d, (p) => (p.startsWith('G') ? 12.3 * GB : 500 * GB));
  assert.strictEqual(r.code, 'HEAVY_RUN_DISK');
  assert.match(r.message, /G:\\ has 12\.3 GB free, under the 20 GB floor/);
  assert.match(r.message, /the janitor would free 42\.0 GB/);
  assert.strictEqual(fs.existsSync(lockOf(d)), false, 'no slot is taken by a refused run');
});

test('D454 part 2: the disk refusal points to GATES.md, the page that explains what refuses a seat', () => {
  const { r } = guarded(tmp(), () => 5 * GB);
  assert.match(r.message, /How it works: consonance\/GATES\.md, "The heavy-run lock"\./);
});

test('D287 disk guard: at a normal free space it runs (takes the slot) and says nothing', () => {
  const d = tmp();
  const { r, logs } = guarded(d, () => 500 * GB);
  assert.ok(r && r.file && !r.code, 'it took a slot');
  assert.deepEqual(logs, []);
  r.release();
});

test('D287 disk guard: between 20 and 50 GB it WARNS once and still runs; the LOWEST drive decides', () => {
  const d = tmp();
  const { r, logs } = guarded(d, (p) => (p.startsWith('C') ? 30 * GB : 900 * GB));
  assert.ok(r && r.file && !r.code);
  assert.strictEqual(logs.length, 1); assert.match(logs[0], /WARNING: C:\\ has 30\.0 GB free, under 50 GB/);
  r.release();
  const e = guarded(tmp(), (p) => (p.startsWith('C') ? 900 * GB : 19.99 * GB)).r;
  assert.strictEqual(e.code, 'HEAVY_RUN_DISK', 'a low G: refuses even when C: is roomy');
});

test('D287 disk guard: a drive that cannot be read is said and skipped, never a refusal or a silent pass', () => {
  const d = tmp();
  const { r, logs } = guarded(d, (p) => { if (p.startsWith('G')) throw Object.assign(new Error('nope'), { code: 'ENOENT' }); return 500 * GB; });
  assert.ok(r && r.file && !r.code);
  assert.match(logs.join('\n'), /could not read the free space of G:\\ \(ENOENT\); not checked/);
  r.release();
});

test('D287 disk guard: what the run writes to is the cwd, the scratch root and CARGO_TARGET_DIR', () => {
  const w = H.writePaths({ CONSONANCE_SCRATCH: 'Q:\\scr', CARGO_TARGET_DIR: 'R:\\tgt' }, 'P:\\work');
  assert.deepEqual(w.map((p) => p.slice(0, 2).toUpperCase()), ['P:', 'Q:', 'R:']);
  assert.deepEqual(H.writePaths({ CONSONANCE_SCRATCH: 'Q:\\scr' }, 'P:\\work').length, 2, 'no CARGO_TARGET_DIR, no third path');
});

test('D287 disk guard through hold(): a refused run EXITS 4, loudly, and never starts', () => {
  const d = tmp();
  const r = spawnSync(process.execPath, ['-e', `const H=require(${JSON.stringify(HELPER)});H.hold({cmd:'g',diskFree:()=>5e9,diskTotal:()=>'janitor 1.0 GB'});console.log('STARTED')`], { env: cleanEnv({ CONSONANCE_DATA: d }), encoding: 'utf8' });
  assert.strictEqual(r.status, 4, r.stderr);
  assert.doesNotMatch(r.stdout, /STARTED/);
  assert.match(r.stderr, /refusing to start: .* has 5\.0 GB free/);
});

// D454 part 3 (pane E): the data dir by the app's rule (main.rs data_dir: data_dir from ~/.consonance.json when set, else %USERPROFILE%\.consonance).
// A new user who keeps the default Data folder saves data_dir "" (ui/app.js), and the app gives panes no CONSONANCE_DATA, so without the third step
// a heavy run refused with "no data dir", README's `node consonance/tools/js-suite.js` among them. The app creates that folder; so does the lock.
test('APP RULE (D454): with CONSONANCE_DATA unset and data_dir empty or absent, hold() takes its lock in USERPROFILE/.consonance and runs the work', async () => {
  for (const cfg of [{ data_dir: '' }, null]) {
    const h = tmp(); if (cfg) fs.writeFileSync(path.join(h, '.consonance.json'), JSON.stringify(cfg));
    const env = cleanEnv({ USERPROFILE: h, HOME: h }); delete env.CONSONANCE_DATA;
    const def = path.join(h, '.consonance');
    const c = spawn(process.execPath, ['-e', `const fs=require('fs');require(${JSON.stringify(HELPER)}).hold({cmd:'app rule'});const l=fs.existsSync(${JSON.stringify(def)})?fs.readdirSync(${JSON.stringify(def)}).filter((n)=>/^heavy-run(\\.\\d+)?\\.lock$/.test(n)):[];console.log(l.length?'LOCKED':'NOLOCK');console.log('RAN')`], { env, stdio: ['ignore', 'pipe', 'pipe'] });
    const r = await done(c);
    assert.strictEqual(r.code, 0, JSON.stringify(cfg) + ': ' + r.err); assert.match(r.out, /RAN/); assert.match(r.out, /LOCKED/, 'the lock is under the default data dir: ' + r.out + r.err);
  }
});

// Ported from L's 88278a1 at the L/D convergence (2026-11-04). Origin's acquire takes slots and a tree; these locks carry no tree, so they block every
// tree, as a pre-D286 lock does. A DEAD young lock here also meets D283's second witness, so that test injects confirmGone.
// ── L124: PID REUSE. A pid the OS has handed to another program reads alive; the lock's recorded identity tells them
// apart. `identify` is injected (a fake of processIdentity) so no test depends on what else runs on the machine, except
// the two marked REAL, which ask the OS about this very process.
const T0 = Date.parse('2026-09-27T06:42:17.000Z');
const idLock = (extra = {}) => ({ pid: 27836, seat: 'terminal', cmd: 'js-suite', started: new Date(T0 + 400).toISOString(), token: 'held', image: 'node', holder_start: new Date(T0).toISOString(), ...extra });
const fakeClock = () => { let t = 0; return { now: () => t, sleep: (ms) => { t += ms; } }; };

test('PID REUSED by another program (alive, different image): the lock is STALE — taken over, logged as reused, recorded in took_over', () => {
  const d = tmp();
  fs.writeFileSync(lockOf(d), JSON.stringify(idLock()));
  const logs = [];
  const h = H.acquire({ cmd: 'js-suite', dataDir: d, env: {}, alive: () => true, identify: () => ({ image: 'mscopilot', start: T0 + 5000 }), maxWaitMs: 1000, pollMs: 100, ...fakeClock(), log: (s) => logs.push(s) });
  assert.strictEqual(h.reentrant, false);
  assert.match(logs.join('\n'), /took over a stale lock — terminal pid 27836 \(js-suite, since .*\): pid 27836 is now mscopilot, started .*— the pid was reused/);
  const now = readLock(d);
  assert.strictEqual(now.pid, process.pid);
  assert.strictEqual(now.took_over.holder.pid, 27836);
  assert.strictEqual(now.took_over.reason, 'pid_reused');
  assert.deepStrictEqual(now.took_over.now_running, { image: 'mscopilot', start: new Date(T0 + 5000).toISOString() });
  h.release();
});

test('PID REUSED by the SAME image (a later node took the pid): a start time more than the tolerance off is STALE', () => {
  assert.ok(Number.isFinite(H.START_TOLERANCE_MS) && H.START_TOLERANCE_MS > 0, 'START_TOLERANCE_MS is exported');
  const d = tmp();
  fs.writeFileSync(lockOf(d), JSON.stringify(idLock()));
  const h = H.acquire({ cmd: 'js-suite', dataDir: d, env: {}, alive: () => true, identify: () => ({ image: 'node', start: T0 + H.START_TOLERANCE_MS + 1000 }), maxWaitMs: 1000, pollMs: 100, ...fakeClock(), log: () => {} });
  assert.strictEqual(readLock(d).took_over.reason, 'pid_reused');
  h.release();
});

test('the SAME process (alive, same image, start within the tolerance, case-insensitive image) is HELD: it waits and times out, lock untouched', () => {
  const d = tmp();
  const lock = idLock();
  fs.writeFileSync(lockOf(d), JSON.stringify(lock));
  const c = fakeClock();
  assert.throws(
    () => H.acquire({ cmd: 'x', dataDir: d, env: {}, alive: () => true, identify: () => ({ image: 'NODE', start: T0 + 800 }), maxWaitMs: 1000, pollMs: 100, ...c, log: () => {} }),
    (e) => e.code === 'HEAVY_RUN_TIMEOUT',
  );
  assert.deepStrictEqual(readLock(d), lock);
});

test('a DEAD pid with an identity lock is STALE as before, without asking the OS who has it', () => {
  const d = tmp();
  fs.writeFileSync(lockOf(d), JSON.stringify(idLock()));
  let asked = 0;
  const h = H.acquire({ cmd: 'x', dataDir: d, env: {}, alive: () => false, confirmGone: () => true, identify: () => { asked++; return null; }, maxWaitMs: 1000, pollMs: 100, ...fakeClock(), log: () => {} });
  assert.strictEqual(asked, 0);
  assert.strictEqual(readLock(d).took_over.reason, 'dead');
  h.release();
});

test('an OLD-FORMAT lock (no identity recorded) behaves exactly as before: a live pid is HELD and the OS is never asked', () => {
  const d = tmp();
  const old = { pid: 27836, seat: 'terminal', cmd: 'js-suite', started: '2026-09-27T06:42:17.386Z', token: 'old-format' };
  fs.writeFileSync(lockOf(d), JSON.stringify(old));
  let asked = 0;
  const c = fakeClock();
  assert.throws(
    () => H.acquire({ cmd: 'x', dataDir: d, env: {}, alive: () => true, identify: () => { asked++; return { image: 'mscopilot', start: T0 }; }, maxWaitMs: 1000, pollMs: 100, ...c, log: () => {} }),
    (e) => e.code === 'HEAVY_RUN_TIMEOUT',
  );
  assert.strictEqual(asked, 0, 'an old lock carries nothing to compare, so nothing is asked');
  assert.deepStrictEqual(readLock(d), old);
});

test('an UNKNOWN identity (the OS query failed) is HELD — failing to look is never a reason to take a live lock', () => {
  const d = tmp();
  fs.writeFileSync(lockOf(d), JSON.stringify(idLock()));
  const c = fakeClock();
  assert.throws(
    () => H.acquire({ cmd: 'x', dataDir: d, env: {}, alive: () => true, identify: () => null, maxWaitMs: 1000, pollMs: 100, ...c, log: () => {} }),
    (e) => e.code === 'HEAVY_RUN_TIMEOUT',
  );
});

test('the OS is asked about a waited-on holder at most once per identity-recheck interval, not on every poll', () => {
  assert.ok(Number.isFinite(H.IDENTITY_RECHECK_MS) && H.IDENTITY_RECHECK_MS > 0, 'IDENTITY_RECHECK_MS is exported');
  const d = tmp();
  fs.writeFileSync(lockOf(d), JSON.stringify(idLock()));
  let asked = 0;
  const c = fakeClock();
  assert.throws(
    () => H.acquire({ cmd: 'x', dataDir: d, env: {}, alive: () => true, identify: () => { asked++; return { image: 'node', start: T0 }; }, maxWaitMs: 3 * H.IDENTITY_RECHECK_MS, pollMs: 2000, ...c, log: () => {} }),
    (e) => e.code === 'HEAVY_RUN_TIMEOUT',
  );
  assert.ok(asked >= 3 && asked <= 4, `asked ${asked} times over three recheck intervals`);
});

test('REAL (this machine): processIdentity of THIS process matches the identity this process records — same image, start within the tolerance', { skip: process.platform !== 'win32' && 'the OS query is the Windows one' }, () => {
  const id = H.processIdentity(process.pid);
  assert.ok(id, 'the OS answered');
  assert.strictEqual(id.image.toLowerCase(), path.parse(process.execPath).name.toLowerCase());
  assert.ok(Number.isFinite(id.start), 'a start time came back');
  assert.ok(Math.abs(id.start - (Date.now() - process.uptime() * 1000)) < H.START_TOLERANCE_MS, `OS start vs recorded start: ${id.start - (Date.now() - process.uptime() * 1000)} ms`);
  assert.strictEqual(H.sameHolder({ image: path.parse(process.execPath).name, holder_start: new Date(Date.now() - process.uptime() * 1000).toISOString() }, id), true);
});

test('REAL (this machine): processIdentity of a pid that does not exist is null (unknown), never a guess', { skip: process.platform !== 'win32' && 'the OS query is the Windows one' }, () => {
  let dead = 900000;
  while (true) { try { process.kill(dead, 0); dead++; } catch (e) { if (e.code === 'ESRCH') break; dead++; } }
  assert.strictEqual(H.processIdentity(dead), null);
  assert.strictEqual(H.processIdentity('1; whoami'), null, 'a non-integer pid never reaches the shell');
  // The pid comes from a lock FILE, and processIdentity interpolates it into a PowerShell command: a crafted lock must not
  // run anything. This payload WOULD print a parseable identity if it reached the shell, so only the guard can make it null.
  assert.strictEqual(H.processIdentity("999999999; Write-Output 'injected|2026-01-01T00:00:00Z' #"), null, 'an injected command never runs');
  assert.strictEqual(H.processIdentity(0), null, 'pid 0 (the idle process) is not a holder');
});

// ---- L155: CONSONANCE_HEAVY_CPUS caps the holder and everything it starts to N logical CPUs ----
const WIN = process.platform === 'win32';
test('CPU CAP mask: N lowest logical CPUs; unset, empty, junk, 0, negative, fractional, or >= the machine = NO cap (null), never a half-applied one', () => {
  assert.strictEqual(H.cpuMask(12, 32), 0xFFFn);
  assert.strictEqual(H.cpuMask('12', 32), 0xFFFn);
  assert.strictEqual(H.cpuMask(1, 32), 1n);
  assert.strictEqual(H.cpuMask(31, 32), (1n << 31n) - 1n);
  for (const bad of [undefined, null, '', 'abc', '0', 0, -3, 2.5, '12x', '1e1', '0xC', 32, 64, 99]) assert.strictEqual(H.cpuMask(bad, 32), null, String(bad));
  assert.strictEqual(H.cpuMask(8, 80), null, 'more than 64 logical CPUs: one processor group only, so no cap');
});
test('CPU CAP applyCap: unset env asks the OS NOTHING and says nothing (today\'s behaviour exactly)', () => {
  let asked = 0;
  // D663 amendment (pane E): the env given here names the suite's own empty config. With `env: {}` the profile was read from THIS machine's ~/.consonance.json, so on a
  // machine whose profile sets `heavy.cpus` (D does) the row read the cap and went red on main too, and the mutant harness's control could never be green there.
  const noProfile = { CONSONANCE_CONFIG: process.env.CONSONANCE_CONFIG };
  H.applyCap({ env: { ...noProfile, CONSONANCE_HEAVY_CPUS: '  ' }, pid: 1234, platform: 'win32', cpus: 32, run: () => { asked++; return {}; }, log: () => { asked++; } });
  const r = H.applyCap({ env: { ...noProfile }, pid: 1234, platform: 'win32', cpus: 32, run: () => { asked++; return {}; }, log: () => { asked++; } });
  assert.strictEqual(asked, 0);
  assert.strictEqual(r.applied, false);
});
test('CPU CAP applyCap: on Windows it sets THIS pid\'s affinity to the mask, through a PowerShell that carries the integer pid and mask only', () => {
  const calls = [];
  const r = H.applyCap({ env: { CONSONANCE_HEAVY_CPUS: '12' }, heavy: { shape: 'lowest' }, pid: 4321, platform: 'win32', cpus: 32, log: () => {},
    run: (exe, args) => { calls.push([exe, args.join(' ')]); return { status: 0, stdout: '4095\n' }; } });
  assert.strictEqual(r.applied, true); assert.strictEqual(r.cpus, 12); assert.strictEqual(r.mask, '4095');
  assert.strictEqual(calls.length, 1);
  assert.match(calls[0][1], /Get-Process -Id 4321/);
  assert.match(calls[0][1], /ProcessorAffinity/);
  assert.match(calls[0][1], /\b4095\b/);
});
test('CPU CAP applyCap: the read-back must equal the mask, else it says NOT applied (a cap that did not take is reported, never assumed)', () => {
  const logs = [];
  const r = H.applyCap({ env: { CONSONANCE_HEAVY_CPUS: '12' }, pid: 1, platform: 'win32', cpus: 32, log: (s) => logs.push(s), run: () => ({ status: 0, stdout: '4294967295\n' }) });
  assert.strictEqual(r.applied, false);
  assert.match(logs.join('\n'), /NOT applied/);
  const r2 = H.applyCap({ env: { CONSONANCE_HEAVY_CPUS: '12' }, pid: 1, platform: 'win32', cpus: 32, log: (s) => logs.push(s), run: () => ({ status: 1, stdout: '' }) });
  assert.strictEqual(r2.applied, false);
});
test('CPU CAP applyCap: a value that is set but unusable is SAID and ignored (the run proceeds uncapped)', () => {
  const logs = [];
  const r = H.applyCap({ env: { CONSONANCE_HEAVY_CPUS: 'twelve' }, pid: 1, platform: 'win32', cpus: 32, log: (s) => logs.push(s), run: () => { throw new Error('must not ask'); } });
  assert.strictEqual(r.applied, false);
  assert.match(logs.join('\n'), /CONSONANCE_HEAVY_CPUS/);
});
test('CPU CAP applyCap: off Windows it is a said no-op', () => {
  const logs = [];
  const r = H.applyCap({ env: { CONSONANCE_HEAVY_CPUS: '4' }, pid: 1, platform: 'linux', cpus: 32, log: (s) => logs.push(s), run: () => { throw new Error('must not ask'); } });
  assert.strictEqual(r.applied, false);
  assert.match(logs.join('\n'), /Windows/);
});
test('REAL (this machine): hold() with CONSONANCE_HEAVY_CPUS=2 pins the holder AND a child AND a child of that child to the same 2 CPUs; unset leaves them all on every CPU', { skip: !WIN && 'affinity is the Windows one', timeout: 120000 }, async () => {
  const aff = (pid) => `(Get-Process -Id ${pid}).ProcessorAffinity.ToInt64()`;
  // the holder prints its own affinity, then spawns a child (node) that spawns a grandchild (node); each prints its own affinity
  const grand = `console.log('grand='+require('child_process').execFileSync('powershell',['-NoProfile','-Command','${aff('$PID_')}'.replace('$PID_',process.pid)],{encoding:'utf8'}).trim())`;
  const mid = `console.log('mid='+require('child_process').execFileSync('powershell',['-NoProfile','-Command','${aff('$PID_')}'.replace('$PID_',process.pid)],{encoding:'utf8'}).trim());` +
    `process.stdout.write(require('child_process').execFileSync(process.execPath,['-e',${JSON.stringify(grand)}],{encoding:'utf8'}))`;
  const top = `const H=require(${JSON.stringify(HELPER)});H.hold({cmd:'cap-proof'});` +
    `console.log('holder='+require('child_process').execFileSync('powershell',['-NoProfile','-Command','${aff('$PID_')}'.replace('$PID_',process.pid)],{encoding:'utf8'}).trim());` +
    `process.stdout.write(require('child_process').execFileSync(process.execPath,['-e',${JSON.stringify(mid)}],{encoding:'utf8'}))`;
  const run = (extra) => { const d = tmp(); const r = spawnSync(process.execPath, ['-e', top], { env: cleanEnv({ CONSONANCE_DATA: d, ...extra }), encoding: 'utf8', timeout: 100000 });
    const m = {}; for (const l of r.stdout.split(/\r?\n/)) { const x = l.match(/^(holder|mid|grand)=(\d+)$/); if (x) m[x[1]] = x[2]; } return { m, err: r.stderr, code: r.status }; };
  const capped = run({ CONSONANCE_HEAVY_CPUS: '2', CONSONANCE_HEAVY_SHAPE: 'lowest' });   // the lowest-N shape: mask 0b11 (the spread shape has its own rows)
  assert.deepStrictEqual(capped.m, { holder: '3', mid: '3', grand: '3' }, capped.err);
  const free = run({ CONSONANCE_HEAVY_CPUS: '' });
  // D663 amendment (pane E): "unset" adds no cap OF ITS OWN, so the family keeps THIS process's affinity. That is every CPU on an uncapped machine, as before.
  // Under a capped parent (the mutant harness holds the lock, and D's profile sets heavy.cpus 8), the children inherit the parent's cap, and the old "every CPU"
  // expectation read 21845 against 65535: the control of heavy-run.mutants.js could never be green on D.
  const all = spawnSync('powershell', ['-NoProfile', '-Command', aff(process.pid)], { encoding: 'utf8', windowsHide: true }).stdout.trim();
  assert.deepStrictEqual(free.m, { holder: all, mid: all, grand: all }, free.err);
});

// ---- L155 amendment: a PER-MACHINE profile, heavy: { cpus, concurrency, slots, timing }, in THIS machine's ~/.consonance.json ----
const cfgFile = (obj) => { const f = path.join(tmp(), 'consonance.json'); fs.writeFileSync(f, typeof obj === 'string' ? obj : JSON.stringify(obj)); return f; };
test('PROFILE: absent file, absent key, or junk JSON = an empty profile (today\'s behaviour exactly), never a throw', () => {
  assert.deepStrictEqual(H.profile({ file: path.join(tmp(), 'nope.json'), env: {} }).values, {});
  assert.deepStrictEqual(H.profile({ file: cfgFile({ data_dir: 'x' }), env: {} }).values, {});
  assert.deepStrictEqual(H.profile({ file: cfgFile('{not json'), env: {} }).values, {});
  assert.deepStrictEqual(H.profile({ file: cfgFile({ heavy: 'fast' }), env: {} }).values, {});
});
test('PROFILE: reads cpus, concurrency, slots, timing from the machine\'s own file', () => {
  const p = H.profile({ file: cfgFile({ heavy: { cpus: 12, concurrency: 2, slots: 1, timing: false } }), env: {} });
  assert.deepStrictEqual(p.values, { cpus: 12, concurrency: 2, slots: 1, timing: false });
  assert.strictEqual(p.source.cpus, 'file');
});
test('PROFILE: an invalid field is dropped and named in `ignored`; the valid ones stand', () => {
  const p = H.profile({ file: cfgFile({ heavy: { cpus: 'twelve', concurrency: 0, slots: 9, timing: 'no', extra: 1 } }), env: {} });
  assert.deepStrictEqual(p.values, {});
  assert.deepStrictEqual(p.ignored.sort(), ['concurrency', 'cpus', 'slots', 'timing']);
  const q = H.profile({ file: cfgFile({ heavy: { cpus: 8, concurrency: 2.5 } }), env: {} });
  assert.deepStrictEqual(q.values, { cpus: 8 });
});
test('PROFILE: the env var overrides the file, per field, for one run', () => {
  const f = cfgFile({ heavy: { cpus: 12, concurrency: 2, slots: 1, timing: false } });
  const p = H.profile({ file: f, env: { CONSONANCE_HEAVY_CPUS: '8', CONSONANCE_HEAVY_CONCURRENCY: '4', CONSONANCE_HEAVY_SLOTS: '2', CONSONANCE_HEAVY_TIMING: '1' } });
  assert.deepStrictEqual(p.values, { cpus: 8, concurrency: 4, slots: 2, timing: true });
  assert.strictEqual(p.source.cpus, 'env');
  const q = H.profile({ file: f, env: { CONSONANCE_HEAVY_CPUS: '8' } });
  assert.deepStrictEqual(q.values, { cpus: 8, concurrency: 2, slots: 1, timing: false });
  assert.strictEqual(q.source.concurrency, 'file');
});
test('PROFILE: applyCap takes cpus from the profile when the env var is unset; the env var wins when both are set', () => {
  const calls = [];
  const run = (exe, args) => { calls.push(args.join(' ')); return { status: 0, stdout: '4095\n' }; };
  const r = H.applyCap({ env: {}, heavy: { cpus: 12 }, pid: 7, platform: 'win32', cpus: 32, run, log: () => {} });
  assert.strictEqual(r.applied, true); assert.strictEqual(r.mask, '4095');
  const none = H.applyCap({ env: {}, heavy: {}, pid: 7, platform: 'win32', cpus: 32, run: () => { throw new Error('must not ask'); }, log: () => {} });
  assert.strictEqual(none.applied, false);
});
test('PROFILE: the slot count comes from the profile when neither the option nor CONSONANCE_HEAVY_SLOTS is given', () => {
  const d = tmp();
  const a = H.acquire({ cmd: 'x', dataDir: d, env: {}, heavy: { slots: 1 }, tree: 't', log: () => {}, diskFree: () => 1e12 });
  assert.strictEqual(a.slot, 1);
  // with ONE slot every live lock blocks, even one in another tree (today's one-slot behaviour)
  fs.unlinkSync(lockOf(d));
  fs.writeFileSync(lockOf(d), JSON.stringify({ pid: process.pid, seat: 'o', cmd: 'o', tree: 'other', started: new Date().toISOString(), token: 'o', image: path.parse(process.execPath).name, holder_start: new Date(Date.now() - process.uptime() * 1000).toISOString() }));
  assert.throws(() => H.acquire({ cmd: 'x', dataDir: d, env: {}, heavy: { slots: 1 }, tree: 't', log: () => {}, diskFree: () => 1e12, maxWaitMs: 50, pollMs: 10 }), (e) => e.code === 'HEAVY_RUN_TIMEOUT');
});
test('PROFILE CLI: `node heavy-run.js --profile` prints the machine\'s profile as JSON, and `--profile <key>` just the value (the way t180\'s runners read it)', () => {
  const f = cfgFile({ heavy: { cpus: 12, concurrency: 2, timing: false } });
  const env = cleanEnv({ CONSONANCE_CONFIG: f });
  for (const k of ['CONSONANCE_HEAVY_CPUS', 'CONSONANCE_HEAVY_CONCURRENCY', 'CONSONANCE_HEAVY_SLOTS', 'CONSONANCE_HEAVY_TIMING']) delete env[k];
  const all = spawnSync(process.execPath, [HELPER, '--profile'], { env, encoding: 'utf8' });
  assert.deepStrictEqual(JSON.parse(all.stdout), { cpus: 12, concurrency: 2, timing: false });
  const one = spawnSync(process.execPath, [HELPER, '--profile', 'concurrency'], { env, encoding: 'utf8' });
  assert.strictEqual(one.stdout.trim(), '2');
  const timing = spawnSync(process.execPath, [HELPER, '--profile', 'timing'], { env, encoding: 'utf8' });
  assert.strictEqual(timing.stdout.trim(), 'false');
  const missing = spawnSync(process.execPath, [HELPER, '--profile', 'slots'], { env, encoding: 'utf8' });
  assert.strictEqual(missing.stdout.trim(), '', 'an unset key prints nothing');
  assert.strictEqual(missing.status, 0);
});

// ---- L155 follow-up: a SPREAD mask (one thread per physical core first), siblings read from the OS, never assumed adjacent ----
const adj = (n) => Array.from({ length: n }, (_, i) => 3n << BigInt(2 * i));                       // siblings 2i, 2i+1 (how L happens to number them)
const far = (n) => Array.from({ length: n }, (_, i) => (1n << BigInt(i)) | (1n << BigInt(i + n)));  // siblings i, i+n (another machine may number them so)
const bits = (m) => { const o = []; for (let i = 0n; m >> i; i++) if ((m >> i) & 1n) o.push(Number(i)); return o; };
test('SPREAD mask: N distinct cores, one thread each, whichever way the siblings are numbered', () => {
  const a = H.spreadMask(12, adj(16));
  assert.deepStrictEqual(bits(a), [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]);
  const f = H.spreadMask(12, far(16));
  assert.deepStrictEqual(bits(f), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  for (const [cores, m] of [[adj(16), a], [far(16), f]]) assert.strictEqual(cores.filter((c) => (c & m) !== 0n).length, 12, 'twelve DIFFERENT cores');
});
test('SPREAD mask: past one thread per core it adds the siblings, core by core; N at or over the machine, or a bad N, is no cap', () => {
  assert.deepStrictEqual(bits(H.spreadMask(18, adj(16))), [0, 1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]);
  assert.strictEqual(H.spreadMask(32, adj(16)), null);
  assert.strictEqual(H.spreadMask(0, adj(16)), null);
  assert.strictEqual(H.spreadMask('x', adj(16)), null);
});
test('SPREAD mask: cores that do not tile the machine (a bad read) give null, never a partial mask', () => {
  assert.strictEqual(H.spreadMask(4, [3n, 3n]), null, 'overlapping cores');
  assert.strictEqual(H.spreadMask(2, [7n, 14n]), null, 'overlapping cores that together cover the CPUs');
  assert.strictEqual(H.spreadMask(4, []), null);
  assert.strictEqual(H.spreadMask(4, null), null);
});
test('SPREAD coreMasks parses the OS topology lines (group:mask;), and answers null for anything it cannot read', () => {
  const ok = H.coreMasks({ platform: 'win32', cpus: 4, run: () => ({ status: 0, stdout: '0:5;\n0:10;\n' }) });
  assert.deepStrictEqual(ok, [5n, 10n]);
  assert.strictEqual(H.coreMasks({ platform: 'win32', cpus: 4, run: () => ({ status: 1, stdout: '' }) }), null);
  assert.strictEqual(H.coreMasks({ platform: 'win32', cpus: 4, run: () => ({ status: 0, stdout: '1:5;\n' }) }), null, 'a second processor group is not handled');
  assert.strictEqual(H.coreMasks({ platform: 'win32', cpus: 8, run: () => ({ status: 0, stdout: '0:5;\n0:10;\n' }) }), null, 'cores that miss CPUs');
  assert.strictEqual(H.coreMasks({ platform: 'linux', cpus: 4, run: () => ({ status: 0, stdout: '0:5;\n0:10;\n' }) }), null, 'off Windows it never answers, even if something would');
  assert.strictEqual(H.coreMasks({ platform: 'win32', cpus: 4, run: () => ({ status: 0, stdout: '0:7;\n0:14;\n' }) }), null, 'overlapping cores that together cover the machine');
});
test('SPREAD applyCap: the spread mask is the default when the cores are known; shape "lowest" keeps the lowest-N mask; unknown cores fall back to lowest and say so', () => {
  const mk = (extra, out) => { const calls = []; const logs = []; const r = H.applyCap({ env: { CONSONANCE_HEAVY_CPUS: '2' }, pid: 9, platform: 'win32', cpus: 8, log: (s) => logs.push(s), run: (exe, args) => { calls.push(args.join(' ')); return { status: 0, stdout: out + '\n' }; }, ...extra }); return { r, calls, logs }; };
  const s = mk({ cores: adj(4) }, '5');            // bits 0 and 2
  assert.strictEqual(s.r.mask, '5'); assert.strictEqual(s.r.shape, 'spread'); assert.strictEqual(s.calls.length, 1);
  const l = mk({ cores: adj(4), heavy: { shape: 'lowest' } }, '3');
  assert.strictEqual(l.r.mask, '3'); assert.strictEqual(l.r.shape, 'lowest');
  const u = mk({ cores: null }, '3');
  assert.strictEqual(u.r.mask, '3'); assert.strictEqual(u.r.shape, 'lowest');
  assert.match(u.logs.join('\n'), /could not be read/);
  assert.doesNotMatch(s.logs.join('\n'), /could not be read/, 'a clean read says nothing of the kind');
  const e = H.applyCap({ env: { CONSONANCE_HEAVY_CPUS: '2', CONSONANCE_HEAVY_SHAPE: 'lowest' }, heavy: { shape: 'spread' }, cores: adj(4), pid: 9, platform: 'win32', cpus: 8, log: () => {}, run: () => ({ status: 0, stdout: '3\n' }) });
  assert.strictEqual(e.shape, 'lowest', 'the env var wins over the profile');
});
test('SHAPE profile: heavy.shape and CONSONANCE_HEAVY_SHAPE take "spread" or "lowest" only; the env var wins', () => {
  const f = cfgFile({ heavy: { shape: 'lowest' } });
  assert.deepStrictEqual(H.profile({ file: f, env: {} }).values, { shape: 'lowest' });
  assert.deepStrictEqual(H.profile({ file: f, env: { CONSONANCE_HEAVY_SHAPE: 'spread' } }).values, { shape: 'spread' });
  const bad = H.profile({ file: cfgFile({ heavy: { shape: 'wide' } }), env: {} });
  assert.deepStrictEqual(bad.values, {}); assert.deepStrictEqual(bad.ignored, ['shape']);
});
test('REAL (this machine): the OS topology tiles the machine: every core has a mask, the masks are disjoint, and together they are every logical CPU', { skip: !WIN && 'the topology query is the Windows one', timeout: 60000 }, () => {
  const cores = H.coreMasks();
  assert.ok(cores && cores.length > 0, 'the OS answered');
  let all = 0n; for (const c of cores) { assert.strictEqual(all & c, 0n, 'disjoint'); all |= c; }
  assert.strictEqual(all, (1n << BigInt(os.cpus().length)) - 1n);
  assert.ok(cores.every((c) => bits(c).length === bits(cores[0]).length), 'every core has the same thread count here');
});
test('REAL (this machine): hold() with CONSONANCE_HEAVY_CPUS=4 pins the holder and a child to FOUR DIFFERENT CORES (spread), and shape lowest to the lowest four CPUs', { skip: !WIN && 'affinity is the Windows one', timeout: 120000 }, () => {
  const cores = H.coreMasks(); if (!cores || cores.length < 5) return;
  const top = `const H=require(${JSON.stringify(HELPER)});H.hold({cmd:'spread-proof'});` +
    `const q=(pid)=>require('child_process').execFileSync('powershell',['-NoProfile','-Command','(Get-Process -Id '+pid+').ProcessorAffinity.ToInt64()'],{encoding:'utf8'}).trim();` +
    `console.log('holder='+q(process.pid));` +
    `console.log('child='+require('child_process').execFileSync(process.execPath,['-e',"console.log(require('child_process').execFileSync('powershell',['-NoProfile','-Command','(Get-Process -Id '+process.pid+').ProcessorAffinity.ToInt64()'],{encoding:'utf8'}).trim())"],{encoding:'utf8'}).trim());`;
  const run = (extra) => { const d = tmp(); const r = spawnSync(process.execPath, ['-e', top], { env: cleanEnv({ CONSONANCE_DATA: d, CONSONANCE_HEAVY_CPUS: '4', ...extra }), encoding: 'utf8', timeout: 100000 }); const m = {}; for (const l of r.stdout.split(/\r?\n/)) { const x = l.match(/^(holder|child)=(\d+)$/); if (x) m[x[1]] = BigInt(x[2]); } return { m, err: r.stderr }; };
  const sp = run({});
  assert.strictEqual(sp.m.holder, sp.m.child, sp.err);
  assert.strictEqual(bits(sp.m.holder).length, 4);
  assert.strictEqual(cores.filter((c) => (c & sp.m.holder) !== 0n).length, 4, 'four different cores');
  const lo = run({ CONSONANCE_HEAVY_SHAPE: 'lowest' });
  assert.deepStrictEqual(lo.m, { holder: 15n, child: 15n }, lo.err);
});

// ---- D663: THE EXCLUSIVE HOLD (the chair, 2026-11-11 21:23Z: a hold relayed to a busy pane cannot bind; C's slot-2 work ran in P's quiet window) ----
const holdOf = (d) => path.join(d, 'heavy-run.hold');   // the literal name, so these rows read red on a heavy-run.js without the hold (not a TypeError)
const readHold = (d) => JSON.parse(fs.readFileSync(holdOf(d), 'utf8'));
const liveHold = (over = {}) => ({ pid: 5151, seat: 'pppp7777', cmd: 'landing quiet window', tree: '/t/p', started: new Date(Date.now() - 5 * 60000).toISOString(), token: 'HOLDTOKEN', exclusive: true, ...over });

test('D663 HOLD: an exclusive hold makes an ORDINARY runner of ANOTHER tree wait, saying once whose hold it is, and fail loudly at the max wait without running', () => {
  const d = tmp();
  const held = liveHold();
  fs.writeFileSync(holdOf(d), JSON.stringify(held));
  const logs = [], c = fakeClock();
  assert.throws(
    () => H.acquire({ cmd: 'gen_tests', dataDir: d, env: {}, tree: '/t/other', slots: 2, alive: () => true, maxWaitMs: 1000, pollMs: 100, ...c, log: (s) => logs.push(s) }),
    (e) => e.code === 'HEAVY_RUN_TIMEOUT' && /exclusive hold/.test(e.message) && /pppp7777 pid 5151 \(landing quiet window, since /.test(e.message),
  );
  const said = notDisk(logs).filter((s) => /^heavy-run: waiting on an exclusive hold by pppp7777 pid 5151 \(landing quiet window, since /.test(s));
  assert.strictEqual(said.length, 1, `said once: ${JSON.stringify(logs)}`);
  assert.ok(!fs.existsSync(lockOf(d)) && !fs.existsSync(path.join(d, 'heavy-run.2.lock')), 'no slot was taken');
  assert.deepStrictEqual(readHold(d), held, 'the hold is untouched');
});

test('D663 HOLD: TWO REAL PROCESSES: while an exclusive holder runs, an ordinary runner waits on it and runs only after its release', async () => {
  const d = tmp();
  const first = spawn(process.execPath, ['-e', `const H=require(${JSON.stringify(HELPER)});H.hold({cmd:'timing session',exclusive:true,pollMs:50});console.log('HELD '+Date.now());setTimeout(()=>{console.log('END '+Date.now())},1200)`],
    { env: cleanEnv({ CONSONANCE_DATA: d, CONSONANCE_PANE: 'tttt1111-timing' }), stdio: ['ignore', 'pipe', 'pipe'] });
  const firstDone = done(first);
  await until(() => fs.existsSync(holdOf(d)) && fs.existsSync(lockOf(d)));
  assert.strictEqual(readHold(d).pid, first.pid);
  const second = child(d, 'dz-world 12s', 'console.log("RAN "+Date.now())', 'ssss2222-other');
  const r2 = await done(second);
  const r1 = await firstDone;
  assert.strictEqual(r1.code, 0, r1.err); assert.strictEqual(r2.code, 0, r2.err);
  assert.match(r2.err, new RegExp(`heavy-run: waiting on (an exclusive hold by )?tttt1111 pid ${first.pid}`), r2.err);
  const end = Number(r1.out.match(/END (\d+)/)[1]), ran = Number(r2.out.match(/RAN (\d+)/)[1]);
  assert.ok(ran >= end, `the ordinary run started after the holder ended (${ran} >= ${end})`);
  assert.ok(!fs.existsSync(holdOf(d)), 'the hold is released with the run');
});

test('D663 HOLD: the holder\'s CHILDREN pass (they carry its token), and only they do', () => {
  const d = tmp();
  const env = {};
  const h = H.acquire({ cmd: 'timing session', dataDir: d, env, tree: '/t/p', slots: 2, exclusive: true, alive: () => true, log: () => {} });
  assert.ok(fs.existsSync(holdOf(d)), 'the exclusive run wrote the hold');
  assert.strictEqual(readHold(d).token, env[H.TOKEN_ENV], 'one token for the hold and the slot');
  const kid = H.acquire({ cmd: 'its bench child', dataDir: d, env: { [H.TOKEN_ENV]: env[H.TOKEN_ENV] }, tree: '/t/q', slots: 2, alive: () => true, log: () => {} });
  assert.strictEqual(kid.reentrant, true, 'a child of the holder passes');
  const c = fakeClock();
  assert.throws(() => H.acquire({ cmd: 'stranger', dataDir: d, env: { [H.TOKEN_ENV]: 'SOMEONE-ELSE' }, tree: '/t/q', slots: 2, alive: () => true, maxWaitMs: 500, pollMs: 100, ...c, log: () => {} }),
    (e) => e.code === 'HEAVY_RUN_TIMEOUT', 'a runner carrying another token waits like anyone');
  h.release();
  assert.ok(!fs.existsSync(holdOf(d)) && !fs.existsSync(lockOf(d)), 'released, both files');
});

test('D663 HOLD: a runner carrying the HOLD\'s token passes the hold even when the holder has no slot yet (the hold binds strangers, never its own run)', () => {
  const d = tmp();
  fs.writeFileSync(holdOf(d), JSON.stringify(liveHold()));
  const h = H.acquire({ cmd: 'holder\'s own step', dataDir: d, env: { [H.TOKEN_ENV]: 'HOLDTOKEN' }, tree: '/t/p', slots: 2, alive: () => true, maxWaitMs: 500, pollMs: 100, ...fakeClock(), log: () => {} });
  assert.strictEqual(h.slot, 1, 'it ran');
  h.release();
});

test('D663 HOLD: an EXCLUSIVE runner waits until every slot is free of OTHER trees too, where an ordinary runner would have run beside them', () => {
  const d = tmp();
  fs.writeFileSync(path.join(d, 'heavy-run.2.lock'), JSON.stringify({ pid: 6262, seat: 'bbbb4444', cmd: 'school gen_tests', tree: '/t/b', started: new Date().toISOString(), token: 'B' }));
  const c = fakeClock(), logs = [];
  assert.throws(() => H.acquire({ cmd: 'landing', dataDir: d, env: {}, tree: '/t/p', slots: 2, exclusive: true, alive: () => true, maxWaitMs: 1000, pollMs: 100, ...c, log: (s) => logs.push(s) }),
    (e) => e.code === 'HEAVY_RUN_TIMEOUT' && /bbbb4444 pid 6262/.test(e.message));
  assert.ok(!fs.existsSync(holdOf(d)), 'a holder that gives up removes its hold');
  const ord = H.acquire({ cmd: 'ordinary', dataDir: d, env: {}, tree: '/t/p', slots: 2, alive: () => true, log: () => {} });
  assert.strictEqual(ord.slot, 1, 'an ordinary run of another tree runs beside it (the slot rules, unchanged)');
  ord.release();
});

test('D663 HOLD: a STALE hold (its holder dead, old) is taken over and logged; an exclusive runner then writes its own', () => {
  const d = tmp();
  fs.writeFileSync(holdOf(d), JSON.stringify(liveHold({ pid: 424242, started: new Date(Date.now() - 60 * 60000).toISOString(), token: 'DEAD' })));
  const logs = [];
  const h = H.acquire({ cmd: 'new session', dataDir: d, env: {}, tree: '/t/p', slots: 2, exclusive: true, alive: (pid) => pid !== 424242, log: (s) => logs.push(s) });
  assert.match(logs.join('\n'), /took over a stale lock — pppp7777 pid 424242 \(landing quiet window, since .*\) is not running; it was 60m old \(slot hold\)/);
  const now = readHold(d);
  assert.strictEqual(now.pid, process.pid);
  assert.strictEqual(now.took_over.holder.pid, 424242, 'the new hold records whom it replaced');
  assert.ok(!readLock(d).took_over, 'the slot lock does not claim the hold\'s takeover');
  h.release();
  assert.deepStrictEqual(fs.readdirSync(d), [], 'nothing left behind');
});

test('D663 HOLD: a stale hold is taken over by an ORDINARY runner too (it then runs); a YOUNG one needs the second witness, as a lock does', () => {
  const d = tmp();
  fs.writeFileSync(holdOf(d), JSON.stringify(liveHold({ pid: 424242, started: new Date(Date.now() - 60 * 60000).toISOString(), token: 'DEAD' })));
  const h = H.acquire({ cmd: 'ordinary', dataDir: d, env: {}, tree: '/t/o', slots: 2, alive: (pid) => pid !== 424242, log: () => {} });
  assert.ok(!fs.existsSync(holdOf(d)), 'the dead hold is gone'); h.release();
  const d2 = tmp();
  fs.writeFileSync(holdOf(d2), JSON.stringify(liveHold({ pid: 424242, started: new Date(Date.now() - 5 * 60000).toISOString(), token: 'YOUNG' })));
  const c = fakeClock(), logs = [];
  assert.throws(() => H.acquire({ cmd: 'ordinary', dataDir: d2, env: {}, tree: '/t/o', slots: 2, alive: () => false, confirmGone: () => false, maxWaitMs: 500, pollMs: 100, ...c, log: (s) => logs.push(s) }),
    (e) => e.code === 'HEAVY_RUN_TIMEOUT');
  assert.ok(fs.existsSync(holdOf(d2)), 'a young hold whose holder tasklist still lists is NOT taken');
  assert.match(logs.join('\n'), /RUNNING to tasklist/);
});

test('D663 HOLD: release removes the hold ONLY with its own token', () => {
  const d = tmp();
  const env = {};
  const h = H.acquire({ cmd: 'timing session', dataDir: d, env, tree: '/t/p', slots: 2, exclusive: true, alive: () => true, log: () => {} });
  const other = liveHold({ token: 'NOT-MINE' });
  fs.writeFileSync(holdOf(d), JSON.stringify(other));   // someone else's hold now stands there (as after a takeover)
  h.release();
  assert.deepStrictEqual(readHold(d), other, 'another run\'s hold is left alone');
  assert.ok(!fs.existsSync(lockOf(d)), 'its own slot lock is released');
});

test('D663 HOLD: a NON-exclusive runner never writes a hold', () => {
  const d = tmp();
  const h = H.acquire({ cmd: 'ordinary', dataDir: d, env: {}, tree: '/t/o', slots: 2, alive: () => true, log: () => {} });
  assert.ok(!fs.existsSync(holdOf(d)));
  h.release();
});

test('D663 HOLD: a hold past the 90-minute maximum is IGNORED with a loud line (once): an ordinary runner runs; an exclusive one replaces it', () => {
  assert.strictEqual(H.HOLD_MAX_MS, 90 * 60 * 1000);
  const d = tmp();
  const old = liveHold({ started: new Date(Date.now() - 95 * 60000).toISOString(), token: 'FORGOTTEN' });
  fs.writeFileSync(holdOf(d), JSON.stringify(old));
  const logs = [];
  const h = H.acquire({ cmd: 'ordinary', dataDir: d, env: {}, tree: '/t/o', slots: 2, alive: () => true, log: (s) => logs.push(s) });
  const loud = notDisk(logs).filter((s) => /^heavy-run: IGNORING the exclusive hold by pppp7777 pid 5151 .* 95m old, past the 90m maximum/.test(s));
  assert.strictEqual(loud.length, 1, JSON.stringify(logs));
  assert.deepStrictEqual(readHold(d), old, 'an ordinary runner leaves it in place');
  h.release();
  const logs2 = [];
  const x = H.acquire({ cmd: 'new session', dataDir: d, env: {}, tree: '/t/p', slots: 2, exclusive: true, alive: () => true, log: (s) => logs2.push(s) });
  assert.match(logs2.join('\n'), /IGNORING the exclusive hold/);
  assert.strictEqual(readHold(d).pid, process.pid, 'the exclusive runner wrote its own hold');
  x.release();
  const d2 = tmp();
  fs.writeFileSync(holdOf(d2), JSON.stringify(liveHold({ started: new Date(Date.now() - 89 * 60000).toISOString() })));
  const c = fakeClock();
  assert.throws(() => H.acquire({ cmd: 'ordinary', dataDir: d2, env: {}, tree: '/t/o', slots: 2, alive: () => true, maxWaitMs: 500, pollMs: 100, ...c, log: () => {} }),
    (e) => e.code === 'HEAVY_RUN_TIMEOUT', 'an 89-minute hold still binds');
});

test('D663 HOLD: a claim RACING the hold backs off: a hold written between an ordinary runner\'s look and its claim makes it wait', () => {
  const d = tmp();
  const c = fakeClock();
  let wrote = false;
  assert.throws(() => H.acquire({ cmd: 'ordinary', dataDir: d, env: {}, tree: '/t/o', slots: 2, alive: () => true, maxWaitMs: 1000, pollMs: 100, ...c, log: () => {},
    beforeClaim: () => { if (!wrote) { wrote = true; fs.writeFileSync(holdOf(d), JSON.stringify(liveHold())); } } }),
  (e) => e.code === 'HEAVY_RUN_TIMEOUT' && /exclusive hold/.test(e.message));
  assert.ok(!fs.existsSync(lockOf(d)), 'its claim was withdrawn');
});

test('D663 HOLD: two exclusive runners: the second waits on the first\'s hold', () => {
  const d = tmp();
  fs.writeFileSync(holdOf(d), JSON.stringify(liveHold()));
  const c = fakeClock();
  assert.throws(() => H.acquire({ cmd: 'second session', dataDir: d, env: {}, tree: '/t/x', slots: 2, exclusive: true, alive: () => true, maxWaitMs: 500, pollMs: 100, ...c, log: () => {} }),
    (e) => e.code === 'HEAVY_RUN_TIMEOUT' && /pppp7777/.test(e.message));
  assert.strictEqual(readHold(d).token, 'HOLDTOKEN', 'the first hold stands');
});

test('D663 CLI: `heavy-run.js --run --exclusive --cmd <what> -- <program>` runs the program under the hold and exits with its code', () => {
  const d = tmp();
  const prog = `const fs=require('fs');const h=JSON.parse(fs.readFileSync(${JSON.stringify(path.join(d, 'heavy-run.hold'))},'utf8'));console.log('HOLD '+h.cmd+' '+(h.token===process.env.CONSONANCE_HEAVY_RUN_TOKEN));process.exit(7)`;
  const r = spawnSync(process.execPath, [HELPER, '--run', '--exclusive', '--cmd', 'cli session', '--', process.execPath, '-e', prog],
    { env: cleanEnv({ CONSONANCE_DATA: d }), encoding: 'utf8', timeout: 30000 });
  assert.strictEqual(r.status, 7, r.stderr);
  assert.match(r.stdout, /HOLD cli session true/, 'the program ran inside the hold, carrying its token');
  assert.ok(!fs.existsSync(holdOf(d)) && !fs.existsSync(lockOf(d)), 'released at exit');
  const bad = spawnSync(process.execPath, [HELPER, '--run', '--cmd', 'x'], { env: cleanEnv({ CONSONANCE_DATA: d }), encoding: 'utf8', timeout: 30000 });
  assert.strictEqual(bad.status, 2); assert.match(bad.stderr, /usage/);
});

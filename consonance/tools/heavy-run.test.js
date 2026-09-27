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

test('the lock holds {pid, seat, cmd, started} (and the token), and since L124 the holder\'s identity {image, holder_start}', () => {
  const d = tmp();
  const h = H.acquire({ cmd: 'trip-check.mutants', dataDir: d, env: { CONSONANCE_PANE: '0845a868-38f2' } });
  const l = readLock(d);
  assert.deepStrictEqual(Object.keys(l).sort(), ['cmd', 'holder_start', 'image', 'pid', 'seat', 'started', 'token']);
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
  const h = H.acquire({ cmd: 'x', dataDir: d, env: {}, alive: () => false, identify: () => { asked++; return null; }, maxWaitMs: 1000, pollMs: 100, ...fakeClock(), log: () => {} });
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

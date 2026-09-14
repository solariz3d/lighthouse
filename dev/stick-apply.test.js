// stick-apply.test.js — run with: node dev/stick-apply.test.js
//
// WHAT THIS GUARDS. The applier runs with no window after the app has exited, so every failure it can have
// is a failure nobody sees. The two that matter: THE APP EXITS AND NOTHING RELAUNCHES IT (the keeper is left
// with no surface at all), and THE APPLIER DECIDES SOMETHING THE WINDOW NEVER SHOWED. So the load-bearing
// tests are "relaunches on every exit code, 0 through 3" and "forwards exactly the keeper's flags, nothing more".
//
// The carry is a real child process — `defaultCarry` spawns a stand-in script that prints one JSON line and
// exits with a chosen code — so the spawn, the stdout parse and the exit handling are the real ones. Only the
// app-running probe, the sleep, the relaunch and the data dir are injected; nothing touches C:\Consonance.

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const A = require(path.join(__dirname, 'stick-apply.js'));

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e && e.message}`); fail++; }
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'stick-apply-'));
let seq = 0;
const EXE = path.join(tmp, 'consonance.exe');       // never executed: relaunch is injected
// Temp-dir paths, never drive-letter literals: portable-paths fails on ANY unbaselined path site, and a
// fixture string is still a site. The applier forwards the stick string without reading it.
const STICK = path.join(tmp, 'stick-folder');

/** A stand-in for tail-carry.js: records its argv next to itself, prints `line`, exits `code`. */
function standIn(line, code) {
  const dir = path.join(tmp, `carry${++seq}`);
  fs.mkdirSync(dir, { recursive: true });
  const script = path.join(dir, 'fake-tail-carry.js');
  const argvFile = path.join(dir, 'argv.json');
  const dataCheck = path.join(dir, 'started-seen.json');
  fs.writeFileSync(script, [
    `const fs = require('fs');`,
    `fs.writeFileSync(${JSON.stringify(argvFile)}, JSON.stringify(process.argv.slice(2)));`,
    `const s = process.env.STICK_APPLY_TEST_STARTED;`,
    `fs.writeFileSync(${JSON.stringify(dataCheck)}, JSON.stringify(s && fs.existsSync(s) ? JSON.parse(fs.readFileSync(s, 'utf8')) : null));`,
    `process.stdout.write(${JSON.stringify(line)} + '\\n');`,
    `process.exit(${code});`,
  ].join('\n'));
  return { script, argv: () => JSON.parse(fs.readFileSync(argvFile, 'utf8')), startedSeen: () => JSON.parse(fs.readFileSync(dataCheck, 'utf8')) };
}
const obj = (code, outcome, rows) => JSON.stringify({ tool: 'tail-carry', contract: 1, code, outcome, why: null, rows: rows || [], staleLock: null });

/** A fixture world: a data dir, an app that is running for `runningPolls` probes, a recorded relaunch. */
function world(opts) {
  opts = opts || {};
  const dataDir = path.join(tmp, `data${++seq}`);
  fs.mkdirSync(dataDir, { recursive: true });
  const probes = [...(opts.probes || [false])];
  const w = { dataDir, relaunched: [], slept: 0, logs: [], probed: 0 };
  w.inject = Object.assign({
    dataDir,
    appRunning: () => { w.probed++; return probes.length > 1 ? probes.shift() : probes[0]; },
    sleep: () => { w.slept++; },
    relaunch: (exe) => w.relaunched.push(exe),
    log: (s) => w.logs.push(s),
    pid: 900001,
    imageOf: () => null,
    pollMs: 1,
  }, opts.inject || {});
  w.started = path.join(dataDir, A.STARTED);
  w.result = path.join(dataDir, A.RESULT);
  return w;
}
function go(w, argvExtra, carryStandIn) {
  process.env.STICK_APPLY_TEST_STARTED = w.started;
  const r = A.runApplier(['--stick', STICK, '--relaunch', EXE, ...(argvExtra || [])],
    Object.assign({}, w.inject, carryStandIn ? { tailCarryPath: carryStandIn.script } : {}));
  delete process.env.STICK_APPLY_TEST_STARTED;
  return r;
}
const resultOf = (w) => JSON.parse(fs.readFileSync(w.result, 'utf8'));

console.log('stick-apply.test.js');

// ── relaunch on EVERY exit code ──

for (const [code, outcome] of [[0, 'CARRIED'], [1, 'STOPPED'], [2, 'LEDGER_LOCKED'], [3, 'CRASHED']]) {
  test(`relaunches after a carry that exits ${code} (${outcome})`, () => {
    const w = world();
    const c = standIn(obj(code, outcome), code);
    const r = go(w, [], c);
    assert.strictEqual(r.code, code);
    assert.deepStrictEqual(w.relaunched, [EXE], 'the app must come back whatever the carry did');
    assert.strictEqual(resultOf(w).code, code);
    assert.strictEqual(resultOf(w).outcome, outcome);
  });
}

test('relaunches after a carry that printed NO object — recorded as code 3, seats may be written', () => {
  const w = world();
  const c = standIn('Error: something exploded before any JSON', 1);
  const r = go(w, [], c);
  assert.strictEqual(r.code, 3);
  assert.deepStrictEqual(w.relaunched, [EXE]);
  assert.strictEqual(resultOf(w).outcome, 'CRASHED');
  assert.match(resultOf(w).why, /MAY be written/);
});

test('relaunches after the applier itself throws part-way — code 3, the handshake still removed', () => {
  const w = world({ inject: { carry: () => { throw new Error('disk vanished'); } } });
  const r = go(w, []);
  assert.strictEqual(r.code, 3);
  assert.deepStrictEqual(w.relaunched, [EXE]);
  assert.match(resultOf(w).why, /disk vanished/);
  assert.strictEqual(fs.existsSync(w.started), false);
});

test('a relaunch that fails is written into the result, where the next launch will read it', () => {
  const w = world({ inject: { relaunch: () => { throw new Error('ENOENT consonance.exe'); } } });
  go(w, [], standIn(obj(0, 'CARRIED'), 0));
  assert.match(resultOf(w).relaunchError, /ENOENT/);
});

// ── the handshake ──

test('stick-apply.started.json exists, with this pid, while the carry runs — written before anything else', () => {
  const w = world();
  const c = standIn(obj(0, 'CARRIED'), 0);
  go(w, [], c);
  const seen = c.startedSeen();
  assert.ok(seen, 'the carry must run with the handshake already on disk');
  assert.deepStrictEqual([seen.pid, seen.image, seen.script, seen.stick], [900001, 'node', 'stick-apply.js', STICK]);
  assert.match(seen.at, /^\d{4}-\d{2}-\d{2}T/);
});

test('the handshake is removed when the applier is done, and the result carries code, rows and at', () => {
  const w = world();
  const rows = [{ sid: 's1', verdict: 'APPEND' }];
  go(w, [], standIn(obj(0, 'CARRIED', rows), 0));
  assert.strictEqual(fs.existsSync(w.started), false);
  const res = resultOf(w);
  assert.deepStrictEqual(res.rows, rows);
  assert.match(res.at, /^\d{4}-\d{2}-\d{2}T/);
});

test('the applier waits for the app to exit before it carries anything', () => {
  const w = world({ probes: [true, true, true, false] });
  let probedWhenCarried = null;
  w.inject.carry = () => { probedWhenCarried = w.probed; return { status: 0, stdout: obj(0, 'CARRIED') + '\n' }; };
  go(w, []);
  assert.strictEqual(probedWhenCarried, 4, 'carried only after the fourth probe said the app was gone');
  assert.strictEqual(w.slept, 3);
});

test('"cannot tell whether the app is running" is waited out like "running", never taken as closed', () => {
  const w = world({ probes: [null, null, false] });
  let carried = false;
  w.inject.carry = () => { carried = true; return { status: 0, stdout: obj(0, 'CARRIED') + '\n' }; };
  go(w, []);
  assert.strictEqual(carried, true);
  assert.strictEqual(w.slept, 2);
});

test('an app that never exits: nothing is imported, the result says APP_RUNNING, and the app is still relaunched', () => {
  let t = 0;
  const w = world({ probes: [true], inject: { now: () => (t += 1000), appExitWaitMs: 5000 } });
  let carried = false;
  w.inject.carry = () => { carried = true; return { status: 0, stdout: '' }; };
  const r = go(w, []);
  assert.strictEqual(carried, false);
  assert.deepStrictEqual([r.code, resultOf(w).outcome], [2, 'APP_RUNNING']);
  assert.deepStrictEqual(w.relaunched, [EXE]);
});

// ── the applier decides nothing (A-1) ──

test('forwards the keeper\'s --retire-far and --repair VERBATIM, in order, and adds nothing else', () => {
  const w = world();
  const c = standIn(obj(0, 'CARRIED'), 0);
  go(w, ['--retire-far', 'aaaa-1', '--repair', 'bbbb-2', '--retire-far', 'cccc-3'], c);
  assert.deepStrictEqual(c.argv(), ['--stick', STICK, '--import', '--json', '--apply',
    '--retire-far', 'aaaa-1', '--repair', 'bbbb-2', '--retire-far', 'cccc-3']);
  assert.deepStrictEqual(resultOf(w).forwarded, ['--retire-far', 'aaaa-1', '--repair', 'bbbb-2', '--retire-far', 'cccc-3']);
});

test('P-DIVERGED 2.6: forwards the keeper\'s --take-stick VERBATIM and in order among the others', () => {
  const w = world();
  const c = standIn(obj(0, 'CARRIED'), 0);
  go(w, ['--take-stick', 'aaaa-1', '--retire-far', 'bbbb-2', '--take-stick', 'cccc-3'], c);
  assert.deepStrictEqual(c.argv(), ['--stick', STICK, '--import', '--json', '--apply',
    '--take-stick', 'aaaa-1', '--retire-far', 'bbbb-2', '--take-stick', 'cccc-3']);
  assert.deepStrictEqual(resultOf(w).forwarded, ['--take-stick', 'aaaa-1', '--retire-far', 'bbbb-2', '--take-stick', 'cccc-3']);
});

test('P-DIVERGED LANDING: --take-stick is an argument the applier knows — it starts, writes its handshake, and carries', () => {
  const w = world();
  const c = standIn(obj(0, 'CARRIED'), 0);
  const r = go(w, ['--take-stick', 'aaaa-1'], c);
  assert.strictEqual(r.startedWritten, true, 'an unknown flag would exit 2 with no handshake — the Carry that never starts');
});

test('with no decisions, the carry is called with no retire or repair flags at all', () => {
  const w = world();
  const c = standIn(obj(1, 'STOPPED'), 1);
  go(w, [], c);
  assert.deepStrictEqual(c.argv(), ['--stick', STICK, '--import', '--json', '--apply']);
});

test('the carry runs exactly ONCE and always with --apply — there is no rehearsal and no second opinion here', () => {
  const w = world();
  const calls = [];
  w.inject.carry = (stick, fwd) => { calls.push(fwd); return { status: 0, stdout: obj(0, 'CARRIED') + '\n' }; };
  go(w, ['--retire-far', 'x']);
  assert.deepStrictEqual(calls, [['--retire-far', 'x']]);
});

// ── refusing to start writes no handshake ──

for (const [label, argv] of [
  ['no --stick', ['--relaunch', EXE]],
  ['no --relaunch', ['--stick', STICK]],
  ['a relative --relaunch', ['--stick', STICK, '--relaunch', 'consonance.exe']],
  ['an unknown argument', ['--stick', STICK, '--relaunch', EXE, '--decide-for-me']],
  ['--retire-far with no sid', ['--stick', STICK, '--relaunch', EXE, '--retire-far']],
  ['--take-stick with no sid', ['--stick', STICK, '--relaunch', EXE, '--take-stick']],
]) {
  test(`refuses to start on ${label}: exit 2, no handshake, no carry, no relaunch`, () => {
    const w = world();
    let carried = false;
    w.inject.carry = () => { carried = true; return { status: 0, stdout: '' }; };
    const r = A.runApplier(argv, w.inject);
    assert.deepStrictEqual([r.code, r.startedWritten], [2, false]);
    assert.strictEqual(fs.existsSync(w.started), false, 'the app must see NO handshake, and so say the transfer could not start');
    assert.deepStrictEqual([carried, w.relaunched], [false, []]);
  });
}

test('refuses to start with no data dir', () => {
  const w = world({ inject: { dataDir: null } });
  const r = go(w, [], standIn(obj(0, 'CARRIED'), 0));
  assert.deepStrictEqual([r.code, r.startedWritten, w.relaunched], [2, false, []]);
});

// ── one applier at a time (E-1) ──

test('a LIVE applier\'s handshake refuses a second applier, and is left exactly as it was', () => {
  const w = world({ inject: { imageOf: () => 'node' } });
  const theirs = { pid: 777, image: 'node', script: 'stick-apply.js', at: '2026-09-14T09:00:00.000Z', stick: STICK };
  fs.writeFileSync(w.started, JSON.stringify(theirs));
  const before = fs.readFileSync(w.started, 'utf8');
  let carried = false;
  w.inject.carry = () => { carried = true; return { status: 0, stdout: '' }; };
  const r = go(w, []);
  assert.deepStrictEqual([r.code, carried, w.relaunched], [2, false, []]);
  assert.strictEqual(fs.readFileSync(w.started, 'utf8'), before);
});

test('a STALE handshake (dead pid) is taken over, and the result names whose it was', () => {
  const w = world({ inject: { imageOf: () => null } });
  const theirs = { pid: 777, image: 'node', script: 'stick-apply.js', at: '2026-09-14T09:00:00.000Z', stick: STICK };
  fs.writeFileSync(w.started, JSON.stringify(theirs));
  const r = go(w, [], standIn(obj(0, 'CARRIED'), 0));
  assert.strictEqual(r.code, 0);
  assert.deepStrictEqual(resultOf(w).staleHandshake, theirs);
});

test('a handshake whose pid now runs a DIFFERENT image is stale, not live', () => {
  const w = world({ inject: { imageOf: () => 'explorer' } });
  fs.writeFileSync(w.started, JSON.stringify({ pid: 777, image: 'node', script: 'stick-apply.js', at: 'x', stick: 'x' }));
  assert.strictEqual(go(w, [], standIn(obj(0, 'CARRIED'), 0)).code, 0);
});

console.log(`\n  ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

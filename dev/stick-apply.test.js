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

// STICK_APPLY_UNDER_TEST: the mutant harness points this at a COPY beside the source, so the tracked file is never
// edited (the copy pattern, dev/tail-carry.mutants.js).
const A = require(process.env.STICK_APPLY_UNDER_TEST || path.join(__dirname, 'stick-apply.js'));

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

/** The probe's three answers, as P-STICK-APPLIER-ZOMBIE shapes them: a list of {pid, alive, hasWindow}, [] for gone,
 *  null for "cannot tell". The older boolean fixtures map onto them: true is ONE WINDOWED app — the live app the
 *  keeper can see, which is what every one of those tests meant by "running". */
const WINDOWED = (pid) => ({ pid: pid || 4242, alive: true, hasWindow: true });
const WINDOWLESS = (pid) => ({ pid: pid || 5151, alive: true, hasWindow: false });
const asProbe = (p) => (p === false ? [] : p === true ? [WINDOWED()] : p);

/** A fixture world: a data dir, an app that is running for `runningPolls` probes, a recorded relaunch. */
function world(opts) {
  opts = opts || {};
  const dataDir = path.join(tmp, `data${++seq}`);
  fs.mkdirSync(dataDir, { recursive: true });
  const probes = [...(opts.probes || [false])];
  const w = { dataDir, relaunched: [], slept: 0, logs: [], probed: 0 };
  w.inject = Object.assign({
    dataDir,
    appProbe: () => { w.probed++; return asProbe(probes.length > 1 ? probes.shift() : probes[0]); },
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

// ── P-STICK-APPLIER-ZOMBIE (D066): a windowless consonance.exe is not the app the keeper can see ──
//
// What bit, 2026-09-16 08:40-08:52: a windowless consonance.exe left by an earlier launch held this wait for its
// full 600 s, twice. The probe could not tell it from the live app. These fixtures run on a CLOCK: every sleep is
// one second of it, and the probe answers from the clock, so "past the grace" and "the full wait" are real
// durations rather than counts of calls.

/** A clocked world. `probeAt(t)` is what the probe sees at t ms. The grace is 30 s unless `omitGrace`. */
function clocked(probeAt, opts) {
  opts = opts || {};
  const clock = { t: 0 };
  const inject = {
    now: () => clock.t,
    appProbe: () => { w.probed++; return probeAt(clock.t); },
    appExitWaitMs: 600000,
    ppid: 31337,
  };
  if (!opts.omitGrace) inject.windowlessGraceMs = 30000;
  const w = world({ inject: Object.assign(inject, opts.inject || {}) });
  w.inject.sleep = () => { w.slept++; clock.t += 1000; };
  w.clock = clock;
  w.carriedAt = null;
  w.inject.carry = () => { w.carriedAt = clock.t; return { status: 0, stdout: obj(0, 'CARRIED') + '\n' }; };
  return w;
}

test('ZOMBIE · GONE at the first probe: the carry runs at once, with no wait at all', () => {
  const w = clocked(() => []);
  go(w, []);
  assert.deepStrictEqual([w.carriedAt, w.slept], [0, 0]);
});

test('ZOMBIE · WINDOWED and never exits: the FULL wait, APP_RUNNING, and the result names its pid', () => {
  const w = clocked(() => [WINDOWED(4242)]);
  const r = go(w, []);
  const res = resultOf(w);
  assert.strictEqual(w.carriedAt, null, 'nothing is imported under the app the keeper can see');
  assert.deepStrictEqual([r.code, res.outcome], [2, 'APP_RUNNING']);
  assert.ok(w.clock.t >= 600000, `a windowed app is waited for the full 600 s, not refused early (gave up at ${w.clock.t} ms)`);
  assert.deepStrictEqual(res.app.pids, [4242]);
  assert.match(res.why, /\b4242\b/, 'the pid is named in the sentence, not only in a field');
  assert.deepStrictEqual(w.relaunched, [EXE]);
});

test('ZOMBIE · WINDOWLESS past the grace: refused EARLY — nothing imported, the pid named, the app still relaunched', () => {
  const w = clocked(() => [WINDOWLESS(5151)]);
  const r = go(w, []);
  const res = resultOf(w);
  assert.strictEqual(w.carriedAt, null, 'a windowless process is refused, never imported underneath');
  assert.deepStrictEqual([r.code, res.outcome], [2, 'APP_RUNNING']);
  assert.ok(w.clock.t >= 30000 && w.clock.t < 60000, `refused once the 30 s grace had run, not at 600 s (gave up at ${w.clock.t} ms)`);
  assert.deepStrictEqual(res.app.windowless, [5151]);
  assert.match(res.why, /\b5151\b/);
  assert.deepStrictEqual(w.relaunched, [EXE]);
});

test('ZOMBIE · windowless but GONE inside the grace: an app still tearing down is waited out, then carried', () => {
  const w = clocked((t) => (t < 20000 ? [WINDOWLESS(5151)] : []));
  go(w, []);
  assert.ok(w.carriedAt !== null && w.carriedAt >= 20000, `carried after the process left (carried at ${w.carriedAt})`);
});

test('ZOMBIE · SLOW TO PAINT: windowless for most of the grace, then a window — never refused early', () => {
  const w = clocked((t) => (t < 25000 ? [WINDOWLESS(5151)] : t < 200000 ? [WINDOWED(5151)] : []));
  go(w, []);
  assert.ok(w.carriedAt !== null && w.carriedAt >= 200000, `waited while it had a window, carried once it left (carried at ${w.carriedAt})`);
});

test('ZOMBIE · the grace is CONTINUOUS, not cumulative: a window in between starts it again', () => {
  // 25 s windowless, 5 s windowed, 28 s windowless, gone. Cumulative would be 53 s and refuse; continuous is 28 s.
  const w = clocked((t) => (t < 25000 ? [WINDOWLESS(5151)] : t < 30000 ? [WINDOWED(5151)] : t < 58000 ? [WINDOWLESS(5151)] : []));
  go(w, []);
  assert.ok(w.carriedAt !== null, `no single windowless stretch reached 30 s, so nothing may be refused (outcome ${resultOf(w).outcome})`);
});

test('ZOMBIE · MIXED: a windowed app beside a windowless one is still the app you can see — the full wait, both pids named', () => {
  const w = clocked(() => [WINDOWED(4242), WINDOWLESS(5151)]);
  go(w, []);
  const res = resultOf(w);
  assert.strictEqual(w.carriedAt, null);
  assert.ok(w.clock.t >= 600000, `not refused early while a window exists (gave up at ${w.clock.t} ms)`);
  assert.deepStrictEqual(res.app.pids, [4242, 5151]);
});

test('ZOMBIE · "cannot tell" is never "windowless": null past the grace is waited out like running, never refused early', () => {
  const w = clocked(() => null);
  go(w, []);
  const res = resultOf(w);
  assert.strictEqual(w.carriedAt, null);
  assert.ok(w.clock.t >= 600000, `an unanswerable probe gets the full wait (gave up at ${w.clock.t} ms)`);
  assert.match(res.why, /could not tell/);
});

test('ZOMBIE · the result records the applier\'s PARENT pid — a refusal naming its own parent is the grace proven too short', () => {
  const w = clocked(() => [WINDOWLESS(5151)]);
  go(w, []);
  assert.strictEqual(resultOf(w).app.parentPid, 31337);
});

test('ZOMBIE · the DEFAULT grace is neither seconds nor the whole wait: 10 s windowless is waited out; forever is refused inside 2 min', () => {
  const brief = clocked((t) => (t < 10000 ? [WINDOWLESS(5151)] : []), { omitGrace: true });
  go(brief, []);
  assert.ok(brief.carriedAt !== null, 'a 10 s windowless stretch must not be refused by the default grace');
  const ghost = clocked(() => [WINDOWLESS(5151)], { omitGrace: true });
  go(ghost, []);
  assert.strictEqual(ghost.carriedAt, null);
  assert.ok(ghost.clock.t < 120000, `the default grace must end the wait long before 600 s (gave up at ${ghost.clock.t} ms)`);
});

// ── the default probe's parser: output that does not account for itself is "cannot tell", never "gone" ──

test('ZOMBIE · parseProbe reads one windowed process', () => {
  assert.deepStrictEqual(A.parseProbe('OK 1\r\n15380 1507894\r\n'), [{ pid: 15380, alive: true, hasWindow: true }]);
});

test('ZOMBIE · parseProbe reads a window handle of 0 as WINDOWLESS', () => {
  assert.deepStrictEqual(A.parseProbe('OK 1\n22560 0\n'), [{ pid: 22560, alive: true, hasWindow: false }]);
});

test('ZOMBIE · parseProbe reads "OK 0" as GONE — the only output that means gone', () => {
  assert.deepStrictEqual(A.parseProbe('OK 0\n'), []);
});

for (const [label, out] of [
  ['empty output', ''],
  ['no OK line', '15380 1507894\n'],
  ['a count the rows do not match', 'OK 2\n15380 1507894\n'],
  ['a row that is not two integers', 'OK 1\nconsonance 1507894\n'],
  ['an OK line that is not a count', 'OK many\n'],
]) {
  test(`ZOMBIE · parseProbe reads ${label} as CANNOT TELL (null), never as gone`, () => {
    assert.strictEqual(A.parseProbe(out), null);
  });
}

// ── the default probe at its boundary: the runner stands in for powershell, nothing real is started ──

test('ZOMBIE · probeConsonance: a runner that THROWS (no powershell, a timeout) is CANNOT TELL, never gone', () => {
  assert.strictEqual(A.probeConsonance(() => { throw new Error('spawnSync powershell ENOENT'); }), null);
});

test('ZOMBIE · probeConsonance hides its console and bounds its wait', () => {
  let seen = null;
  A.probeConsonance((file, args, opts) => { seen = { file, opts }; return 'OK 0\n'; });
  assert.strictEqual(seen.file, 'powershell');
  assert.deepStrictEqual([seen.opts.windowsHide, typeof seen.opts.timeout], [true, 'number']);
});

test('ZOMBIE · probeConsonance passes a clean answer through the parser', () => {
  assert.deepStrictEqual(A.probeConsonance(() => 'OK 1\n15380 0\n'), [{ pid: 15380, alive: true, hasWindow: false }]);
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

// ── L068: the relaunched app must not inherit CONSONANCE_DATA (C, L066 §2.1 link b) ──
// The app hands CONSONANCE_DATA to THIS process for its own children (main.rs stick_start_applier). Passed on to
// the relaunched app, every claude -p the app spawns carries it, and eight shell hooks read that variable as
// THEIR home — so the shell's digests/ and pulse/ were written into the data dir and refused every close.
// The spawn is the boundary, so it is the seam: the real defaultRelaunch, with spawn captured, never executed.

function captureRelaunch(env) {
  const calls = [];
  const fakeSpawn = (exe, args, opts) => { calls.push({ exe, args, opts }); return { on() {}, unref() {} }; };
  A.defaultRelaunch(EXE, fakeSpawn, env);
  return calls;
}

test('the relaunch does NOT pass CONSONANCE_DATA on to the app', () => {
  const calls = captureRelaunch({ CONSONANCE_DATA: path.join(tmp, 'data'), PATH: 'p' });
  assert.strictEqual(calls.length, 1, 'exactly one relaunch');
  assert.ok(calls[0].opts.env, 'an explicit env must be given, or the child inherits this process\'s whole env');
  assert.ok(!('CONSONANCE_DATA' in calls[0].opts.env), 'the applier\'s children need the data dir; the app does not');
});

test('the relaunch keeps the REST of the environment — only the one variable is dropped', () => {
  const calls = captureRelaunch({ CONSONANCE_DATA: 'x', PATH: 'the-path', USERPROFILE: 'the-home' });
  assert.deepStrictEqual(calls[0].opts.env, { PATH: 'the-path', USERPROFILE: 'the-home' });
});

test('the relaunch is otherwise unchanged: detached, no stdio, started beside the exe', () => {
  const calls = captureRelaunch({ CONSONANCE_DATA: 'x' });
  assert.deepStrictEqual([calls[0].exe, calls[0].args, calls[0].opts.detached, calls[0].opts.stdio, calls[0].opts.cwd],
    [EXE, [], true, 'ignore', path.dirname(EXE)]);
});

test('the applier\'s OWN environment is not modified by the relaunch', () => {
  const env = { CONSONANCE_DATA: 'x', PATH: 'p' };
  captureRelaunch(env);
  assert.strictEqual(env.CONSONANCE_DATA, 'x', 'dropping it for the app must not drop it for a carry still to run');
});

console.log(`\n  ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

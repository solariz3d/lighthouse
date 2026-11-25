// relaunch.test.js — run with: node relaunch.test.js
//
// L233 (pane B): ⟳ Restart's helper. The app starts it, then closes through its own Leave; the helper waits until THAT process is
// gone (the single-instance mutex is released only then, so an earlier start would be refused as a second copy) and opens the exe
// at the same path, which after a landing's rename is the new build. Rows drive runRelaunch with its boundaries injected, and one
// row runs the real file against a real child process.
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

let pass = 0, fail = 0;
const pending = [];
function test(name, fn) {
  try {
    const r = fn();
    if (r && typeof r.then === 'function') { pending.push(r.then(() => { console.log(`  ok   ${name}`); pass++; }, (e) => { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; })); return; }
    console.log(`  ok   ${name}`); pass++;
  } catch (e) { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; }
}

const R = require(path.join(__dirname, 'relaunch.js'));
const EXE = path.resolve('/build/release/consonance.exe');

function kit(aliveFor) {
  let t = 0, polls = 0;
  const started = [], rows = [];
  return {
    started, rows, polls: () => polls,
    k: {
      alive: () => { polls++; return polls <= aliveFor; },
      sleep: (ms) => { t += ms; },
      now: () => t,
      launch: (exe, env) => { started.push({ exe, env }); return 4243; },
      log: (row) => rows.push(row),
      env: { PATH: 'p', CONSONANCE_DATA: 'C:/data', CONSONANCE_LAUNCH_ID: 'launch-123', KEEP: 'k' },
    },
  };
}

console.log('the helper');
test('waits until the app is gone, then opens the exe at the path it was given', () => {
  const x = kit(3);
  const r = R.runRelaunch(['--pid', '4242', '--exe', EXE], x.k);
  assert.strictEqual(r.code, 0, JSON.stringify(r));
  assert.deepStrictEqual(x.started.map((s) => s.exe), [EXE]);
  assert.strictEqual(x.polls(), 4, 'three polls alive, one gone');
});
test('nothing is opened while the app still runs', () => {
  const x = kit(Infinity);
  const r = R.runRelaunch(['--pid', '4242', '--exe', EXE, '--wait-ms', '3000'], x.k);
  assert.deepStrictEqual([r.code, x.started.length], [2, 0]);
});
test('a gave-up wait says so in the ledger', () => {
  const x = kit(Infinity);
  R.runRelaunch(['--pid', '4242', '--exe', EXE, '--wait-ms', '3000'], x.k);
  assert.ok(x.rows.some((w) => w.outcome === 'gave-up' && /still running/.test(w.why)), JSON.stringify(x.rows));
});
test('the opened app does not inherit the launch id (main.rs LAUNCH_ID_ENV) or CONSONANCE_DATA', () => {
  const x = kit(0);
  R.runRelaunch(['--pid', '4242', '--exe', EXE], x.k);
  const env = x.started[0].env;
  assert.deepStrictEqual([env.CONSONANCE_LAUNCH_ID, env.CONSONANCE_DATA, env.KEEP, env.PATH], [undefined, undefined, 'k', 'p']);
});
test('a relative exe is refused, and nothing waits or opens', () => {
  const x = kit(0);
  const r = R.runRelaunch(['--pid', '4242', '--exe', 'consonance.exe'], x.k);
  assert.deepStrictEqual([r.code, x.started.length, x.polls()], [1, 0, 0]);
});
test('a missing or bad pid is refused', () => {
  for (const argv of [['--exe', EXE], ['--pid', 'x', '--exe', EXE], ['--pid', '0', '--exe', EXE]]) {
    const x = kit(0);
    assert.strictEqual(R.runRelaunch(argv, x.k).code, 1, argv.join(' '));
    assert.strictEqual(x.started.length, 0);
  }
});
test('the opened row names the exe', () => {
  const x = kit(1);
  R.runRelaunch(['--pid', '4242', '--exe', EXE], x.k);
  assert.ok(x.rows.some((w) => w.outcome === 'opened' && w.exe === EXE), JSON.stringify(x.rows));
});

test('THE REAL FILE: waits on a real process, opens only after it exits', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'relaunch-'));
  const marker = path.join(dir, 'opened.txt');
  const exe = process.execPath;   // the "app" opened is node itself, told to write a marker
  // a stand-in for the app: lives 1.5 s
  const app = spawn(process.execPath, ['-e', 'setTimeout(()=>{},1500)'], { stdio: 'ignore' });
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [path.join(__dirname, 'relaunch.js'), '--pid', String(app.pid), '--exe', exe,
    '--args-for-test', JSON.stringify(['-e', `require('fs').writeFileSync(${JSON.stringify(marker)}, String(Date.now()))`]),
    '--log', path.join(dir, 'relaunch.jsonl')], { encoding: 'utf8', timeout: 30000 });
  assert.strictEqual(r.status, 0, r.stderr || r.stdout);
  for (let i = 0; i < 50 && !fs.existsSync(marker); i++) spawnSync(process.execPath, ['-e', 'setTimeout(()=>{},100)']);
  const at = Number(fs.readFileSync(marker, 'utf8'));
  assert.ok(at - t0 >= 1400, `opened ${at - t0} ms after the app started; it lives 1500 ms`);
  const rows = fs.readFileSync(path.join(dir, 'relaunch.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  assert.strictEqual(rows[rows.length - 1].outcome, 'opened');
  fs.rmSync(dir, { recursive: true, force: true });
});

// C's read of bd113955 (p-l233-read-C_2026-11-25.md): an exe that cannot be opened was logged "opened" with exit 0, so Consonance
// closed and stayed closed. Now: a "not-opened" row, the exe and the reason, and exit 3.
test('a launch that starts nothing is NOT logged opened: not-opened, code 3', () => {
  const x = kit(0);
  x.k.launch = () => undefined;
  const r = R.runRelaunch(['--pid', '4242', '--exe', EXE], x.k);
  assert.strictEqual(r.code, 3, JSON.stringify(r));
  assert.ok(x.rows.some((w) => w.outcome === 'not-opened' && w.exe === EXE && w.why) && !x.rows.some((w) => w.outcome === 'opened'), JSON.stringify(x.rows));
});

test('THE REAL FILE: a dead pid and a missing exe: non-zero exit and a not-opened row saying nothing is at the path', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'relaunch-missing-'));
  const dead = spawnSync(process.execPath, ['-e', '0']).pid;   // has exited by the time spawnSync returns
  const exe = path.join(dir, 'consonance.exe');                 // nothing here: a landing's rename window
  const log = path.join(dir, 'relaunch.jsonl');
  const r = spawnSync(process.execPath, [path.join(__dirname, 'relaunch.js'), '--pid', String(dead), '--exe', exe, '--log', log], { encoding: 'utf8', timeout: 30000 });
  assert.notStrictEqual(r.status, 0, 'exit 0 for an exe that is not there');
  const rows = fs.readFileSync(log, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  const last = rows[rows.length - 1];
  assert.deepStrictEqual([last.outcome, last.exe, /nothing at the path/.test(last.why)], ['not-opened', exe, true], JSON.stringify(last));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('THE REAL FILE: an exe that is there but is not a program: not-opened with the spawn reason, not a crash', () => {
  // seen on L, 2026-11-25: spawn THROWS for such a file (spawn UNKNOWN), so without a catch the helper died with no row at all
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'relaunch-bad-'));
  const exe = path.join(dir, 'consonance.exe');
  fs.writeFileSync(exe, 'not a program');
  const dead = spawnSync(process.execPath, ['-e', '0']).pid;
  const log = path.join(dir, 'relaunch.jsonl');
  const r = spawnSync(process.execPath, [path.join(__dirname, 'relaunch.js'), '--pid', String(dead), '--exe', exe, '--log', log], { encoding: 'utf8', timeout: 30000 });
  assert.strictEqual(r.status, 3, `exit ${r.status}: ${(r.stderr || '').split('\n')[0]}`);
  const last = fs.readFileSync(log, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).pop();
  assert.deepStrictEqual([last.outcome, last.exe, /could not be started/.test(last.why)], ['not-opened', exe, true], JSON.stringify(last));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('the spawn itself: a path that vanished after the existence check gives no pid and a reason, never a pid', () => {
  const gone = path.join(os.tmpdir(), 'relaunch-gone-' + process.pid, 'consonance.exe');
  const r = R.defaultLaunch(gone, {}, []);
  assert.deepStrictEqual([r.pid, typeof r.error], [undefined, 'string'], JSON.stringify(r));
});

Promise.all(pending).then(() => {
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
});

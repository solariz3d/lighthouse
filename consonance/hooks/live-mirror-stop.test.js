'use strict';

// live-mirror-stop.test.js — bars for the Stop hook of the per-seat live mirror. L052, pane E.
//
// Run: node consonance/hooks/live-mirror-stop.test.js
//
// WHAT IS MOCKED AND WHERE. The hook shells out to `state-sync.js` and to `git`. The tests below
// mock at the PROCESS BOUNDARY — a real temporary script that really exits 1 with A's real abort
// wording — rather than stubbing the hook's internals. That is the only mock that can catch the
// bug being tested, because the bug IS the reading of another process's output.
//
// NOT COVERED, and it is the important half: nothing here drives a real lease against a real
// remote. That was done by a separate end-to-end run against the live GitHub repo, whose output is
// quoted in the hand-back. These are the pure bars; that was the proof.

const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const HOOK = require('./live-mirror-stop.js');

test('requiring the hook neither runs a turn nor exits the process', () => {
  // A bare `process.exit(0)` at module scope would kill this test runner. It did, once, while this
  // file was being written, along with a `readFileSync(0)` that hung a shell for two minutes.
  assert.strictEqual(typeof HOOK.seatOf, 'function');
  assert.strictEqual(typeof HOOK.pushState, 'function');
});

test('the seat comes from the pane directory, and an unusable one is refused rather than guessed', () => {
  assert.strictEqual(HOOK.seatOf('/x/sibling-E'), 'E');
  assert.strictEqual(HOOK.seatOf('/x/E'), 'E');
  assert.strictEqual(HOOK.seatOf('/x/MAIN'), 'MAIN');
  // A directory that is not a seat must yield null, not a string that would reach `git push` argv.
  assert.strictEqual(HOOK.seatOf('/x/weird-name'), null);
  assert.strictEqual(HOOK.seatOf('/x/-x'), null, 'an option-shaped directory must not reach git argv');
  assert.strictEqual(HOOK.seatOf('/x/9lives'), null, 'a seat must start with a letter');
  assert.strictEqual(HOOK.seatOf('/x/a.b'), null, 'a dotted directory is not a seat');
  // NOTE: '/x/' yields 'x' — basename strips the trailing slash and 'x' IS a valid single-letter
  // seat. That is correct, and the first version of this test asserted null for it and was wrong.
});

test('quiescence is DELEGATED — the gate lives in state-sync.js and is not re-derived here', () => {
  // Two copies of one rule drift apart. A measured the settle window; re-implementing it in the
  // hook would be a second copy that silently disagrees with the first.
  assert.strictEqual(HOOK.quiescent(), 'DELEGATED');
});

// ── the classifier: A's expected abort vs a genuinely broken sync ──────────────────────────────
//
// They share exit code 1. Collapsing them either cries wolf on every capture that happened to be
// mid-rewrite, or buries a broken sync under a reassuring "deferred".

function withFakeSync(body, fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mirror-hook-'));
  const tools = path.join(dir, 'tools');
  const hooks = path.join(dir, 'hooks');
  fs.mkdirSync(tools); fs.mkdirSync(hooks);
  fs.writeFileSync(path.join(tools, 'state-sync.js'), body);
  fs.copyFileSync(path.join(__dirname, 'live-mirror-stop.js'), path.join(hooks, 'live-mirror-stop.js'));
  fs.mkdirSync(path.join(dir, 'tools_link'), { recursive: true });
  fs.copyFileSync(path.join(__dirname, '..', 'tools', 'live-host.js'), path.join(tools, 'live-host.js'));
  try { return fn(path.join(hooks, 'live-mirror-stop.js')); } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

const callPushState = (hookPath) => {
  const out = execFileSync(process.execPath, ['-e',
    `const h=require(${JSON.stringify(hookPath)});console.log(JSON.stringify(h.pushState('E')));`],
    { encoding: 'utf8' });
  return JSON.parse(out.trim().split('\n').pop());
};

test("A's unsettled abort is DEFERRED, not an error — the next turn carries it", () => {
  const r = withFakeSync(
    "console.error('4 path(s) would not come back STABLE after 5 attempts\\n  captures/x.txt\\n  Retry between turns.');process.exit(1);",
    callPushState);
  assert.strictEqual(r.pushed, false);
  assert.strictEqual(r.deferred, true, 'an expected, self-correcting abort must not read as an error');
  assert.ok(!r.error, 'a deferral must not also be reported as an error');
});

test('a genuinely broken sync is an ERROR and is never softened into a deferral', () => {
  const r = withFakeSync("console.error('TypeError: cannot read x of undefined');process.exit(1);", callPushState);
  assert.strictEqual(r.pushed, false);
  assert.ok(r.error, 'a broken sync must surface as an error');
  assert.ok(!r.deferred, 'a real failure must never be filed as "deferred, will retry"');
});

test('a clean push is reported as pushed, with a duration', () => {
  const r = withFakeSync("process.exit(0);", callPushState);
  assert.strictEqual(r.pushed, true);
  assert.ok(Number.isFinite(r.ms));
});

test('a missing state-sync.js is an error and NEVER a silent success', () => {
  // The done-vs-never-started failure, on this surface: an instrument that reports success when its
  // dependency is absent. This seat has shipped that bug and caught it repeatedly.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mirror-hook-'));
  try {
    const hooks = path.join(dir, 'hooks'); const tools = path.join(dir, 'tools');
    fs.mkdirSync(hooks); fs.mkdirSync(tools);
    fs.copyFileSync(path.join(__dirname, 'live-mirror-stop.js'), path.join(hooks, 'live-mirror-stop.js'));
    fs.copyFileSync(path.join(__dirname, '..', 'tools', 'live-host.js'), path.join(tools, 'live-host.js'));
    const r = callPushState(path.join(hooks, 'live-mirror-stop.js'));
    assert.strictEqual(r.pushed, false);
    assert.ok(r.error, 'an absent dependency must be an error, not a skip that reads as fine');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('the state push is OFF by default, and the reason is recorded where it is read', () => {
  assert.strictEqual(HOOK.CONFIG.state.enabled, false,
    'unattended per-turn publishing to a remote must not start by itself');
  assert.strictEqual(HOOK.CONFIG.lease.enabled, true,
    'the lease half is what prevents two drivers and must run');
  assert.match(HOOK.CONFIG.state.gatedOn, /keeper/i);
});

// ── L062 R-C1 (pane E): NO MACHINE PATH AS A DEFAULT ─────────────────────────────────────────────
//
// portable-paths flagged :49, :50 and :54 FATAL-DEFAULT: with nothing declared, the hook reached for
// C:\Consonance\state and C:\Consonance\data — right on one box, silently somebody else's disk on the
// next. The shape is the peer hooks' own (transcript-watch.js dataDir): env, then ~/.consonance.json,
// then nothing — and "nothing" must be SAID, never papered over with a guess.
//
// The child gets an EMPTY home (so no ~/.consonance.json) and no CONSONANCE_* variables. And it gets
// a PATH with no git on it: before this repair the hook would have found the real C:\Consonance\state
// and beaten a real lease on the real remote from inside a test. With no git, the worst a regression
// can do here is fail.
function bareEnv(home, extra = {}) {
  const env = {};
  for (const [k, v] of Object.entries(process.env)) if (!/^CONSONANCE_/i.test(k)) env[k] = v;
  env.USERPROFILE = home; env.HOME = home; env.PATH = home; env.Path = home;
  return { ...env, ...extra };
}
function resolved(env) {
  const hook = path.join(__dirname, 'live-mirror-stop.js');
  const out = execFileSync(process.execPath, ['-e',
    `const h=require(${JSON.stringify(hook)});console.log(JSON.stringify({s:h.STATE_REPO,l:h.LEDGER,o:h.OBS_DIR}));`],
    { encoding: 'utf8', env });
  return JSON.parse(out.trim().split('\n').pop());
}

test('R-C1: nothing declared -> no state repo, ledger or obs dir is invented', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'mirror-home-'));
  try {
    const r = resolved(bareEnv(home));
    assert.deepStrictEqual(r, { s: null, l: null, o: null },
      'with no env and no ~/.consonance.json the hook must resolve NOTHING; a literal drive-letter default is ' +
      'another machine\'s disk the moment this file leaves the one it was written on');
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('R-C1: ~/.consonance.json state_dir and data_dir are honoured when env is absent', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'mirror-home-'));
  try {
    const st = path.join(home, 'st'), dd = path.join(home, 'dd');
    fs.writeFileSync(path.join(home, '.consonance.json'), JSON.stringify({ state_dir: st, data_dir: dd }));
    const r = resolved(bareEnv(home));
    assert.deepStrictEqual(r, { s: st, l: path.join(dd, 'live-mirror.jsonl'), o: path.join(dd, 'live-mirror') });
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('R-C1: an undeclared state repo is a LOUD skip naming the fix, not a lease attempt', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'mirror-home-'));
  try {
    const ledger = path.join(home, 'ledger.jsonl');
    // The seat is given BOTH ways — stdin and the process cwd — because on Windows readStdin() never
    // reads a piped fd 0 (fstat reports it as none of FIFO/file/socket/char), and the hook falls back to
    // process.cwd(). Without the cwd this test passed or failed by where it was launched from.
    const seatDir = path.join(home, 'sibling-E'); fs.mkdirSync(seatDir);
    execFileSync(process.execPath, [path.join(__dirname, 'live-mirror-stop.js')], {
      cwd: seatDir, encoding: 'utf8', input: JSON.stringify({ cwd: seatDir }),
      env: bareEnv(home, { CONSONANCE_MIRROR_LEDGER: ledger }),
    });
    const rows = fs.readFileSync(ledger, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
    assert.strictEqual(rows.length, 1);
    assert.strictEqual(rows[0].kind, 'skip', 'no state repo declared must skip, never reach for git');
    assert.match(rows[0].reason, /no state repo declared/, 'the reason must say nothing was declared');
    assert.match(rows[0].reason, /state_dir/, 'the reason must name the setting that fixes it');
    assert.doesNotMatch(rows[0].reason, /[A-Za-z]:[\\/]/, 'the reason must not name a guessed drive path');
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

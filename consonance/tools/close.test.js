// close.test.js — run with: node close.test.js
//
// WHAT THIS FILE IS ACTUALLY GUARDING. The command it tests is the last thing that runs before the
// lid shuts, and the failure it exists to prevent is not a crash — it is THE WORD "CLOSED" PRINTED
// OVER A STATE THAT NEVER LEFT. So the tests that matter here are the refusals: a failed push must
// not read as a close; an unverified remote must stop the publish with nothing sent; a capture
// mid-rewrite must defer rather than travel torn. If those go green for the wrong reason this file
// is decoration and the command is the 04:33 sentence with a cron behind it.
//
// EVERY TEST RUNS AGAINST A FIXTURE — its own data dir, its own manifest, its own bare "remote"
// and clone. Nothing here reads C:\Consonance\data or C:\Consonance\state, and this file must pass
// identically on a machine that has neither.
//
// THE ONE STUB, NAMED RATHER THAN BURIED. `privacy` is injected in the module-level tests, because
// a fixture has no GitHub repo and no `gh` login and the real check correctly refuses a local-path
// remote. It is a parameter of runClose with a real default, not a flag and not an environment
// variable: there is no way to turn the gate off from a command line. The last test in this file
// runs the CLI with no injection at all and requires it to refuse, which is the wiring the stub
// cannot vouch for.

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawn } = require('child_process');

const TOOL = path.join(__dirname, 'close.js');
const C = require(TOOL);
const M = require(path.join(__dirname, 'state-sync.js'));

process.env.CONSONANCE_MACHINE = process.env.CONSONANCE_MACHINE || 'TESTL';

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e && e.message}`); fail++; }
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'close-'));
let seq = 0;

const MIN_MANIFEST = {
  version: 99,
  rules: [
    { glob: 'board.jsonl', class: 'TRAVELS', why: 'the record' },
    { glob: 'captures/*.txt', class: 'TRAVELS', why: 'the warm-resume carriers' },
    { glob: 'captures', class: 'TRAVELS', why: 'holds them' },
    { glob: 'state-sync.status.json', class: 'STAYS', why: 'per-machine as-of view' },
    { glob: 'state-sync.push.json', class: 'STAYS', why: 'the receipt of this machine\'s last push' },
  ],
  forbidden: [{ glob: 'install_id*', why: 'both machines would share an identity' }],
};

/** A whole world: data dir, manifest, a bare "remote", and a clone of it. */
function world(files) {
  const dir = path.join(tmp, 'case' + (++seq));
  const data = path.join(dir, 'data');
  fs.mkdirSync(data, { recursive: true });
  for (const [rel, body] of Object.entries(files || {})) {
    const p = path.join(data, rel.split('/').join(path.sep));
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, body);
  }
  const manPath = path.join(dir, 'manifest.json');
  fs.writeFileSync(manPath, JSON.stringify(MIN_MANIFEST, null, 2));
  const bare = path.join(dir, 'remote.git');
  execFileSync('git', ['init', '--bare', '-q', '-b', 'main', bare]);
  const state = path.join(dir, 'state');
  execFileSync('git', ['clone', '-q', bare, state], { stdio: ['ignore', 'pipe', 'pipe'] });
  for (const [k, v] of [['user.email', 't@t'], ['user.name', 't']]) execFileSync('git', ['-C', state, 'config', k, v]);
  return { dir, data, state, bare, manPath };
}

const PRIVATE = () => ({ state: 'private', why: 'gh: visibility=PRIVATE', repo: 'test/fixture' });
const UNKNOWN = () => ({ state: 'unknown', why: 'gh repo view failed: gh: command not found', repo: 'test/fixture' });
const PUBLIC = () => ({ state: 'PUBLIC', why: 'gh: visibility=PUBLIC', repo: 'test/fixture' });

/** Run the close against a fixture, capturing every line it printed. */
function close(w, opts) {
  const lines = [];
  const r = C.runClose({
    data: w.data,
    state: w.state,
    privacy: (opts && opts.privacy) || PRIVATE,
    checkOnly: !!(opts && opts.checkOnly),
    retryWaitMs: opts && opts.retryWaitMs,
    env: { CONSONANCE_DATA: w.data, CONSONANCE_STATE: w.state, STATE_MANIFEST: w.manPath, CONSONANCE_MACHINE: 'TESTL' },
    out: (s) => lines.push(s),
    err: (s) => lines.push(s),
  });
  return { ...r, text: lines.join('\n') };
}

/** `git log --oneline`, or '' when the repo has no commits — which exits 1, not 0. */
function log(repo) {
  try { return execFileSync('git', ['-C', repo, 'log', '--oneline'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
  catch (_) { return ''; }
}
const head = (repo) => { try { return execFileSync('git', ['-C', repo, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); } catch (_) { return null; } };
const remoteMain = (bare) => { try { return execFileSync('git', ['-C', bare, 'rev-parse', 'refs/heads/main'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); } catch (_) { return null; } };

/** Prepare and commit the state set locally without publishing it — the pre-state of a stalled close. */
function committedNotPushed(w) {
  execFileSync(process.execPath, [path.join(__dirname, 'state-sync.js'), '--push', '--no-remote'], {
    env: { ...process.env, CONSONANCE_DATA: w.data, CONSONANCE_STATE: w.state, STATE_MANIFEST: w.manPath, CONSONANCE_MACHINE: 'TESTL' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

// ═══ THE REFUSALS — written first and run first, because they are the deliverable ═════════════

test('A PUSH THAT FAILS IS NOT A CLOSE: it says NOT CLOSED and quotes git', () => {
  // The push address is disarmed exactly the way the chair disarmed the real one at 04:43
  // (`git remote set-url --push origin no_push`), so the remote stays READABLE and only the push
  // fails. That separates this case from "the remote could not be read", which has its own line.
  const w = world({ 'board.jsonl': 'row\n' });
  execFileSync('git', ['-C', w.state, 'remote', 'set-url', '--push', 'origin', 'no_push']);
  const r = close(w);
  assert.strictEqual(r.closed, false, r.text);
  assert.strictEqual(r.code, 1);
  assert.ok(/NOT CLOSED — the push failed/.test(r.text), r.text);
  assert.ok(/no_push/.test(r.text), 'git\'s own words must reach the keeper: ' + r.text);
  assert.ok(!/^CLOSED/m.test(r.text), 'nothing may print the word CLOSED here');
  assert.strictEqual(remoteMain(w.bare), null, 'the remote must still have nothing');
});

test('an UNVERIFIED remote stops the close before anything is published', () => {
  const w = world({ 'board.jsonl': 'row\n' });
  const r = close(w, { privacy: UNKNOWN });
  assert.strictEqual(r.closed, false, r.text);
  assert.ok(/not confirmed private/.test(r.text), r.text);
  assert.ok(/gh: command not found/.test(r.text), 'the reading itself must be quoted');
  assert.strictEqual(remoteMain(w.bare), null, 'nothing may reach the remote');
  assert.ok(log(w.state) !== '', 'the set is still committed locally and safe');
});

test('a PUBLIC remote is refused as hard as an unknown one', () => {
  const w = world({ 'board.jsonl': 'row\n' });
  const r = close(w, { privacy: PUBLIC });
  assert.strictEqual(r.closed, false, r.text);
  assert.ok(/reads PUBLIC/.test(r.text), r.text);
  assert.strictEqual(remoteMain(w.bare), null);
});

test('a remote that cannot be READ is not treated as a remote that is up to date', () => {
  const w = world({ 'board.jsonl': 'row\n' });
  execFileSync('git', ['-C', w.state, 'remote', 'set-url', 'origin', path.join(w.dir, 'no-such-remote.git')]);
  const r = close(w);
  assert.strictEqual(r.closed, false, r.text);
  assert.ok(/the remote could not be read/.test(r.text), r.text);
});

test('A TORN TAIL DEFERS AND IS NEVER PUBLISHED: a path that will not settle refuses the close by name', () => {
  // A future mtime can never be SETTLE_MS old, so the quiescence gate can never certify it: the
  // deterministic stand-in for a pane that is writing without pause.
  const w = world({ 'board.jsonl': 'row\n', 'captures/A.txt': 'tail' });
  const soon = new Date(Date.now() + 3600 * 1000);
  fs.utimesSync(path.join(w.data, 'captures', 'A.txt'), soon, soon);
  const r = close(w, { retryWaitMs: 10 });
  assert.strictEqual(r.closed, false, r.text);
  assert.ok(/DEFERRED/.test(r.text), 'it must SAY deferred: ' + r.text);
  assert.ok(/captures\/A\.txt/.test(r.text), 'and name the path');
  assert.ok(/would not settle/.test(r.text), r.text);
  assert.strictEqual(log(w.state), '', 'a deferred set leaves no commit');
  assert.strictEqual(remoteMain(w.bare), null, 'and nothing at the remote');
});

test('THE DEFERRED RETRY IS REAL: a path that settles during the wait closes on the second pass', () => {
  // Deterministic rather than timed-and-hoped-for: the mtime is 2.5 s in the FUTURE, so the first
  // pass refuses it outright (FUTURE_MTIME) and the second, after a 3.5 s wait, finds a file whose
  // mtime is ~1 s in the past and settles. A loaded machine makes the margin BIGGER, not smaller —
  // the wait is a floor. (An assertion whose answer depends on how busy the machine is is not an
  // assertion; that lesson cost this seat a flaky test earlier tonight.)
  const w = world({ 'board.jsonl': 'row\n', 'captures/A.txt': 'tail' });
  const soon = new Date(Date.now() + 2500);
  fs.utimesSync(path.join(w.data, 'captures', 'A.txt'), soon, soon);
  const r = close(w, { retryWaitMs: 3500 });
  assert.ok(/DEFERRED/.test(r.text), 'the first pass must have deferred: ' + r.text);
  assert.ok(/retrying once/.test(r.text), 'and said it was retrying: ' + r.text);
  assert.strictEqual(r.closed, true, r.text);
  assert.ok(/after one deferred retry/.test(r.text), r.text);
  assert.strictEqual(remoteMain(w.bare), head(w.state), 'the retry must actually have published');
});

// ═══ THE CLOSE ITSELF ═════════════════════════════════════════════════════════════════════════

test('a remote that is AHEAD refuses the close and points at the pull — Sunday\'s case', () => {
  // The laptop closing on Sunday after the desktop has been working all week: the remote has
  // commits this machine has never seen, git rejects the push as non-fast-forward, and the close
  // must refuse rather than report a round trip that did not happen.
  const w = world({ 'board.jsonl': 'row\n' });
  const other = path.join(w.dir, 'desktop');
  execFileSync('git', ['clone', '-q', w.bare, other], { stdio: ['ignore', 'pipe', 'pipe'] });
  for (const [k, v] of [['user.email', 'd@d'], ['user.name', 'd']]) execFileSync('git', ['-C', other, 'config', k, v]);
  fs.writeFileSync(path.join(other, 'from-the-desktop.txt'), 'a week of work\n');
  execFileSync('git', ['-C', other, 'add', '--', 'from-the-desktop.txt']);
  execFileSync('git', ['-C', other, 'commit', '-q', '-m', 'desktop', '--', 'from-the-desktop.txt']);
  execFileSync('git', ['-C', other, 'push', '-q', 'origin', 'main:main']);
  const theirs = remoteMain(w.bare);

  const r = close(w);
  assert.strictEqual(r.closed, false, r.text);
  assert.ok(/the push failed/.test(r.text), r.text);
  assert.ok(/--pull/.test(r.text), 'it must point at the pull: ' + r.text);
  assert.strictEqual(remoteMain(w.bare), theirs, 'the other machine\'s work must be untouched');
});

test('A PUSH THAT SUCCEEDS WHILE THE REMOTE DOES NOT MOVE IS NOT A CLOSE', () => {
  // Not a contrivance: a remote whose PUSH url and FETCH url point at different repositories is
  // one `git remote set-url --push` away, and it is the exact command that was run on the real
  // state tree at 04:43 tonight. git exits 0, the bytes land somewhere, and the place the room
  // reads from never changed. Only asking the remote afterwards catches it.
  const w = world({ 'board.jsonl': 'row\n' });
  const elsewhere = path.join(w.dir, 'elsewhere.git');
  execFileSync('git', ['init', '--bare', '-q', '-b', 'main', elsewhere]);
  execFileSync('git', ['-C', w.state, 'remote', 'set-url', '--push', 'origin', elsewhere]);
  const r = close(w);
  assert.strictEqual(r.closed, false, r.text);
  assert.ok(/the remote did not move/.test(r.text), r.text);
  assert.ok(/Believe the remote/.test(r.text));
  assert.strictEqual(remoteMain(w.bare), null, 'the remote the room reads from still has nothing');
  assert.ok(remoteMain(elsewhere), 'and the bytes went somewhere else entirely');
});

test('a close publishes the set and PROVES it by asking the remote', () => {
  const w = world({ 'board.jsonl': 'row\n', 'captures/A.txt': 'tail' });
  const r = close(w);
  assert.strictEqual(r.closed, true, r.text);
  assert.strictEqual(r.code, 0);
  assert.ok(/remote confirms/.test(r.text), r.text);
  assert.ok(/asked the remote, not the push/.test(r.text));
  assert.strictEqual(remoteMain(w.bare), head(w.state), 'the remote must hold this machine\'s HEAD');
  assert.ok(fs.existsSync(path.join(w.state, 'data', 'board.jsonl')), 'the state set travelled');
});

test('the in-sync line names this machine and its commit', () => {
  const w = world({ 'board.jsonl': 'row\n' });
  const r = close(w);
  assert.ok(/in sync: TESTL [0-9a-f]{7}/.test(r.text), r.text);
});

test('A QUIET CLOSE IS A CLOSE: nothing changed and the remote already holds it', () => {
  const w = world({ 'board.jsonl': 'row\n' });
  close(w);
  const r = close(w);
  assert.strictEqual(r.closed, true, r.text);
  assert.ok(/nothing to publish/.test(r.text), r.text);
  assert.ok(/nothing changed/.test(r.text), 'and it must say state-sync found nothing to commit');
});

test('BUT A QUIET PUSH IS NOT: nothing-changed over a remote that is BEHIND still publishes', () => {
  // This is the case state-sync's own --push exits 0 on: `same` short-circuits before the remote is
  // ever consulted, so a commit that failed to publish yesterday stays unpublished forever and the
  // tool reports success. A close that read that exit code would swallow it.
  const w = world({ 'board.jsonl': 'row\n' });
  committedNotPushed(w);
  assert.strictEqual(remoteMain(w.bare), null, 'precondition: the remote has nothing');
  const r = close(w);
  assert.ok(/nothing changed/.test(r.text), 'state-sync must have found nothing new to commit: ' + r.text);
  assert.strictEqual(r.closed, true, r.text);
  assert.strictEqual(remoteMain(w.bare), head(w.state), 'and the close published it anyway');
});

test('and when THAT push cannot land, the quiet close is refused rather than reported', () => {
  const w = world({ 'board.jsonl': 'row\n' });
  committedNotPushed(w);
  execFileSync('git', ['-C', w.state, 'remote', 'set-url', '--push', 'origin', 'no_push']);
  const r = close(w);
  assert.strictEqual(r.closed, false, r.text);
  assert.ok(/the push failed/.test(r.text), r.text);
  assert.strictEqual(remoteMain(w.bare), null);
});

test('--check runs every gate and publishes nothing', () => {
  const w = world({ 'board.jsonl': 'row\n' });
  const r = close(w, { checkOnly: true });
  assert.strictEqual(r.closed, true, r.text);
  assert.ok(/CHECK ONLY/.test(r.text), r.text);
  assert.ok(/NOTHING WAS PUBLISHED/.test(r.text));
  assert.ok(/privacy verified here/.test(r.text), 'the gate still ran');
  assert.strictEqual(log(w.state), '', '--check must not commit');
  assert.strictEqual(remoteMain(w.bare), null, 'and must not publish');
});

test('--check over a remote that is BEHIND says what it would publish and publishes nothing', () => {
  // The case the first --check test cannot reach: a tree that HAS a commit the remote does not.
  // Without this, the whole publish branch is unguarded in check mode — found by the mutant pass,
  // which is the entire reason that file exists.
  const w = world({ 'board.jsonl': 'row\n' });
  committedNotPushed(w);
  const r = close(w, { checkOnly: true });
  assert.strictEqual(r.closed, true, r.text);
  assert.ok(/would publish: main [0-9a-f]{7} -> origin/.test(r.text), r.text);
  assert.ok(/CHECK ONLY/.test(r.text));
  assert.strictEqual(remoteMain(w.bare), null, 'a rehearsal must not publish');
});

test('--check refuses on an unverified remote too, so a rehearsal cannot pass a gate the close would fail', () => {
  const w = world({ 'board.jsonl': 'row\n' });
  const r = close(w, { checkOnly: true, privacy: UNKNOWN });
  assert.strictEqual(r.closed, false, r.text);
  assert.ok(/not confirmed private/.test(r.text), r.text);
});

// ═══ THE RECEIPT — a reading is not a state ═══════════════════════════════════════════════════

test('a receipt from another pid is treated as ABSENT, not as an answer', () => {
  const w = world({});
  fs.writeFileSync(path.join(w.data, M.RECEIPT_NAME),
    JSON.stringify({ run_id: '999-1', pid: 999, at: new Date().toISOString(), outcome: 'PUSHED' }));
  const r = C.readReceipt(w.data, 12345, Date.now() - 1000);
  assert.strictEqual(r.rec, null);
  assert.ok(/pid 999/.test(r.why), r.why);
});

test('a receipt stamped BEFORE this run began is treated as absent — the 04:33 defect, one level down', () => {
  const w = world({});
  fs.writeFileSync(path.join(w.data, M.RECEIPT_NAME),
    JSON.stringify({ run_id: '12345-1', pid: 12345, at: new Date(Date.now() - 3600 * 1000).toISOString(), outcome: 'PUSHED' }));
  const r = C.readReceipt(w.data, 12345, Date.now() - 1000);
  assert.strictEqual(r.rec, null);
  assert.ok(/before this run began/.test(r.why), r.why);
});

test('a receipt from this run is accepted', () => {
  const w = world({});
  fs.writeFileSync(path.join(w.data, M.RECEIPT_NAME),
    JSON.stringify({ run_id: '12345-1', pid: 12345, at: new Date().toISOString(), outcome: 'LOCAL_ONLY' }));
  const r = C.readReceipt(w.data, 12345, Date.now() - 1000);
  assert.ok(r.rec, r.why);
  assert.strictEqual(r.rec.outcome, 'LOCAL_ONLY');
});

test('no receipt at all is a refusal, and the tool\'s own words are shown rather than parsed', () => {
  const w = world({});
  const r = C.readReceipt(w.data, 12345, Date.now() - 1000);
  assert.strictEqual(r.rec, null);
  assert.ok(/no state-sync\.push\.json/.test(r.why), r.why);
});

test('an outcome that is not a prepared set refuses the close', () => {
  // REFUSED_UNPLACED: a real state-sync refusal that is NOT the retryable one.
  const w = world({ 'board.jsonl': 'row\n', 'a-path-nobody-ruled.json': '{}' });
  const r = close(w);
  assert.strictEqual(r.closed, false, r.text);
  assert.ok(/REFUSED_UNPLACED/.test(r.text), r.text);
  assert.ok(/a-path-nobody-ruled\.json/.test(r.text), 'and names the path');
  assert.strictEqual(remoteMain(w.bare), null);
});

// ═══ THE WIRING — no injection at all ═════════════════════════════════════════════════════════

test('THE CLI USES THE REAL PRIVACY CHECK: run with no injection, it refuses a non-github remote', () => {
  const w = world({ 'board.jsonl': 'row\n' });
  let out = '', code = 0;
  try {
    out = execFileSync(process.execPath, [TOOL], {
      encoding: 'utf8',
      env: { ...process.env, CONSONANCE_DATA: w.data, CONSONANCE_STATE: w.state, STATE_MANIFEST: w.manPath, CONSONANCE_MACHINE: 'TESTL' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (e) { code = e.status; out = String(e.stdout || '') + String(e.stderr || ''); }
  assert.strictEqual(code, 1, out);
  assert.ok(/NOT CLOSED/.test(out), out);
  assert.ok(/not confirmed private/.test(out), out);
  assert.ok(/not a github remote/.test(out), 'the real check\'s own reading, not a stub\'s: ' + out);
  assert.strictEqual(remoteMain(w.bare), null);
});

test('the default privacy check in the source is state-sync\'s, not a local copy', () => {
  const src = fs.readFileSync(TOOL, 'utf8');
  assert.ok(/o\.privacy \|\| sync\.remotePrivacy/.test(src), 'the default must BE the real check');
  assert.ok(!/CONSONANCE_(GH|PRIVACY)|--no-privacy|--force/.test(src),
    'there must be no flag and no environment variable that turns the gate off');
});

test('close.js does not touch the record repository', () => {
  const src = fs.readFileSync(TOOL, 'utf8');
  const code = src.split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
  assert.ok(!/lighthouse/.test(code), 'no path into the record repo in executable code');
  assert.ok(!/\bREPO\b/.test(code), 'and no record-repo root resolved at all');
});

console.log('');
console.log(`close.test.js: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

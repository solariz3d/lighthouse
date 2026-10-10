// scratch.test.js - run with: node --test scratch.test.js
//
// D287 part 1: every harness deletes what it makes. Each row COUNTS the folders of one creator's prefix in a private scratch root before
// and after a run (delta 0), and again after a run that fails or throws. The root is CONSONANCE_SCRATCH, so these rows never look at the
// real %TEMP% or G: and cannot be fooled by another seat's folders.

const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const scratch = require('./scratch.js');
const TOOLS = __dirname;
const drv = (letter) => letter + ':' + path.sep; // a drive root, built so this file carries no drive-letter constant

// The rows' own root is made with raw mkdtempSync (not scratch.js) and removed in a finally: the thing under test cannot clean up its own test.
function withRoot(fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'scratch-test-'));
  try { return fn(root); } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
const count = (root, prefix) => fs.readdirSync(root).filter((n) => n.startsWith(prefix)).length;
// A private OS temp dir (TEMP/TMP) beside the scratch root: a creator that ignores the root and uses os.tmpdir() leaks INTO it, where it is counted.
// Without this a row could pass because the leak went somewhere it never looked.
function withTemps(fn) {
  return withRoot((root) => {
    const osTemp = path.join(root, 'os-temp'), sr = path.join(root, 'sr');
    fs.mkdirSync(osTemp);
    const env = { CONSONANCE_SCRATCH: sr, TEMP: osTemp, TMP: osTemp, TMPDIR: osTemp };
    const left = (prefix) => [osTemp, sr].reduce((n, d) => n + (fs.existsSync(d) ? count(d, prefix) : 0), 0);
    return fn({ root, osTemp, sr, env, left });
  });
}
const node = (args, env, cwd) => spawnSync(process.execPath, args, {
  cwd: cwd || TOOLS, env: { ...process.env, ...env }, encoding: 'utf8', timeout: 180000,
});

test('the root: CONSONANCE_SCRATCH wins, then G: when it exists, else the OS temp dir', () => {
  assert.strictEqual(scratch.scratchRoot({ CONSONANCE_SCRATCH: path.resolve('x-root') }, 'win32', () => true), path.resolve('x-root'));
  assert.strictEqual(scratch.scratchRoot({}, 'win32', (p) => p === drv('G')), path.join(drv('G'), 'consonance-scratch'));
  assert.strictEqual(scratch.scratchRoot({}, 'win32', () => false), os.tmpdir());
  assert.strictEqual(scratch.scratchRoot({}, 'linux', () => true), os.tmpdir(), 'a drive letter means nothing off Windows');
  assert.strictEqual(scratch.scratchRoot({ CONSONANCE_SCRATCH: '   ' }, 'win32', () => false), os.tmpdir(), 'a blank override is no override');
  assert.strictEqual(scratch.scratchRoot({ CONSONANCE_SCRATCH_DRIVE: 'Q' }, 'win32', (p) => p === drv('Q')), path.join(drv('Q'), 'consonance-scratch'));
  assert.strictEqual(scratch.scratchRoot({ CONSONANCE_SCRATCH_DRIVE: '..\\x' }, 'win32', () => true), os.tmpdir(), 'a malformed drive is ignored, not joined');
  assert.strictEqual(scratch.scratchRoot({}, 'win32', () => { throw new Error('boom'); }), os.tmpdir(), 'a probe that throws falls back');
});

test('withDir removes its folder on return AND on a throw', () => withRoot((root) => {
  scratch.withDir('wd-', (d) => { assert.ok(fs.existsSync(d)); }, root);
  assert.strictEqual(count(root, 'wd-'), 0, 'left behind after a normal return');
  assert.throws(() => scratch.withDir('wd-', () => { throw new Error('the body failed'); }, root), /the body failed/);
  assert.strictEqual(count(root, 'wd-'), 0, 'left behind after a throw');
}));

test('mkdtemp falls back to the OS temp dir when the root cannot be made, but an explicit root is not silently swapped', () => withRoot((root) => {
  const blocker = path.join(root, 'file-not-dir');
  fs.writeFileSync(blocker, 'x');
  assert.throws(() => scratch.mkdtemp('fb-', path.join(blocker, 'sub')), 'an explicit root that cannot be made must throw');
  const prev = process.env.CONSONANCE_SCRATCH;
  process.env.CONSONANCE_SCRATCH = path.join(blocker, 'sub');
  let d;
  try { d = scratch.mkdtemp('fb-'); assert.ok(d.startsWith(os.tmpdir()), 'the default root falls back to the OS temp dir: ' + d); }
  finally { if (prev === undefined) delete process.env.CONSONANCE_SCRATCH; else process.env.CONSONANCE_SCRATCH = prev; scratch.rm(d); }
}));

// A child process that makes a folder through scratch.mkdtemp and then ends in the stated way.
function ends(root, how) {
  const body = `const s = require(${JSON.stringify(path.join(TOOLS, 'scratch.js'))}); s.mkdtemp('ends-');`
    + { normal: '', throws: " throw new Error('uncaught');", exit: ' process.exit(3);' }[how];
  return node(['-e', body], { CONSONANCE_SCRATCH: root });
}
for (const how of ['normal', 'throws', 'exit']) {
  test('mkdtemp: the folder is gone when the process ends (' + how + ')', () => withRoot((root) => {
    ends(root, how);
    assert.strictEqual(count(root, 'ends-'), 0, 'a folder survived a process that ended by ' + how);
  }));
}

// ---- gen-consumer: the 21 GB creator
test('gen-consumer: a REFUSED real run (output already holds a history) leaves no staging folder', () => withTemps(({ root, env, left }) => {
  const out = path.join(root, 'out');
  fs.mkdirSync(path.join(out, '.git'), { recursive: true });
  assert.strictEqual(left('gen-consumer-'), 0);
  const r = node(['gen-consumer.js', '--out', out, '--allow-dirty'], env);
  assert.strictEqual(r.status, 1, 'expected the refusal this row depends on, got ' + r.status + ': ' + r.stdout.slice(-300) + r.stderr.slice(-300));
  assert.match(r.stdout, /already holds a git history/);
  assert.strictEqual(left('gen-consumer-'), 0, 'staging left behind after a refusal');
}));

test('gen-consumer --keep-staging keeps the folder on a refusal, and says where', () => withTemps(({ root, sr, env, left }) => {
  const out = path.join(root, 'out');
  fs.mkdirSync(path.join(out, '.git'), { recursive: true });
  const r = node(['gen-consumer.js', '--out', out, '--allow-dirty', '--keep-staging'], env);
  assert.strictEqual(r.status, 1);
  assert.strictEqual(left('gen-consumer-'), 1, 'the flag asked for the folder to be kept');
  assert.ok(r.stdout.includes(path.join(sr, fs.readdirSync(sr).find((n) => n.startsWith('gen-consumer-')))), 'the kept path was not printed');
}));

test('gen-consumer build(): a THROW after staging was made removes the staging folder', () => withTemps(({ env, left }) => {
  const keys = Object.keys(env), prev = keys.map((k) => process.env[k]);
  Object.assign(process.env, env);
  try {
    const { build } = require('./gen-consumer.js');
    const opts = { allowDirty: true, get dry() { throw new Error('thrown after staging'); } };
    assert.throws(() => build('', opts), /thrown after staging/);
    assert.strictEqual(left('gen-consumer-'), 0, 'staging left behind by a throw');
  } finally { keys.forEach((k, i) => { if (prev[i] === undefined) delete process.env[k]; else process.env[k] = prev[i]; }); }
}));

// ---- js-suite: gives each test file its own TEMP and removes it, so ONE move reaches every creator under it
function fixtureTree(root, files) {
  const dir = path.join(root, 'fixture');
  for (const [rel, body] of Object.entries(files)) {
    const p = path.join(dir, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, body);
  }
  return dir;
}
const MAKES = "const fs=require('fs'),os=require('os'),path=require('path');"
  + "const d=fs.mkdtempSync(path.join(os.tmpdir(),'leaky-'));fs.writeFileSync(path.join(d,'f'),'x');";
const PASS_LINE = "console.log('ok: 1 passed, 0 failed');";

test('js-suite: a passing test file that leaks its own os.tmpdir() folder leaves nothing behind', () => withTemps(({ root, env, left }) => {
  const dir = fixtureTree(root, { 'a.test.js': MAKES + PASS_LINE });
  const r = node(['js-suite.js'], { ...env, JS_SUITE_ROOT: dir });
  assert.strictEqual(r.status, 0, r.stdout + r.stderr);
  assert.strictEqual(left('leaky-'), 0, 'the test file own folder survived js-suite');
  assert.strictEqual(left('js-suite'), 0, 'js-suite own per-file scratch survived');
}));

test('js-suite: a FAILING test file (exit 1) and a THROWING one leave nothing behind either', () => withTemps(({ root, env, left }) => {
  const dir = fixtureTree(root, {
    'a.test.js': MAKES + "console.log('x: 0 passed, 1 failed');process.exit(1);",
    'b.test.js': MAKES + "throw new Error('the test threw');",
  });
  const r = node(['js-suite.js'], { ...env, JS_SUITE_ROOT: dir });
  assert.notStrictEqual(r.status, 0, 'the suite should be red for this fixture');
  assert.strictEqual(left('leaky-'), 0, 'a red file folder survived js-suite');
  assert.strictEqual(left('js-suite'), 0, 'js-suite own per-file scratch survived a red file');
}));

test('js-suite: the child sees TEMP inside the scratch root (the redirect is real, not a no-op)', () => withTemps(({ root, sr, env }) => {
  const dir = fixtureTree(root, { 'a.test.js': "const os=require('os');const p=require('path');"
    + "if(!os.tmpdir().startsWith(" + JSON.stringify(sr) + ")){console.log('x: 0 passed, 1 failed');process.exit(1);}" + PASS_LINE });
  const r = node(['js-suite.js'], { ...env, JS_SUITE_ROOT: dir });
  assert.strictEqual(r.status, 0, 'the child did not see a redirected TEMP: ' + r.stdout + r.stderr);
}));

test('js-suite: a test file KILLED by the timeout leaves nothing behind (its exit hook never runs, so the runner must)', () => withTemps(({ root, env, left }) => {
  const dir = fixtureTree(root, { 'a.test.js': "const s=require(" + JSON.stringify(path.join(TOOLS, 'scratch.js')) + ");s.mkdtemp('hung-');"
    + "require('fs').mkdtempSync(require('path').join(require('os').tmpdir(),'hung-os-'));setInterval(()=>{},1000);" });
  const r = node(['js-suite.js'], { ...env, JS_SUITE_ROOT: dir, JS_SUITE_TIMEOUT_MS: '2500' });
  assert.notStrictEqual(r.status, 0, 'a file killed by the timeout must turn the suite red');
  assert.strictEqual(left('hung-'), 0, 'a killed file folders survived js-suite');
  assert.strictEqual(left('hung-os-'), 0);
}));

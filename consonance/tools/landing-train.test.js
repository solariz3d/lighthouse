#!/usr/bin/env node
'use strict';
// landing-train.test.js (B, L194): the plan's four rows (exo_memory/loop/plan_l194_landing_train_2026-11-13.md, "Tests") plus the scan's refusal,
// each on a throwaway world: a bare "origin", a main checkout cloned from it, and the train's own worktree of that checkout. The check is a small
// node script standing in for the build: red when the merged tree holds a file named RED, and it writes build/bin/app.bin (ignored by git) the way
// a build writes its binaries. Every row uses its own temporary data dir; the live READY list, push-gate ledger and heavy-run lock are never touched.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

process.env.CONSONANCE_CONFIG = path.join(os.tmpdir(), 'no-such-consonance-config.json');
const T = require('./landing-train.js');
const SCRIPT = path.join(__dirname, 'landing-train.js');

const dirs = [];
process.on('exit', () => { for (const d of dirs) { try { fs.rmSync(d, { recursive: true, force: true }); } catch (_) {} } });
const git = (dir, ...args) => {
  const r = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8', windowsHide: true, env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' } });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${r.stderr}`);
  return r.stdout.trim();
};

/** A fresh world: origin (bare), repo (main checkout), wt (the train's worktree), data, and the stand-in check and guard. */
function world() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'landing-train-'));
  dirs.push(root);
  const origin = path.join(root, 'origin.git'), repo = path.join(root, 'repo'), wt = path.join(root, 'wt'), data = path.join(root, 'data');
  spawnSync('git', ['init', '-q', '--bare', '-b', 'main', origin]);
  spawnSync('git', ['clone', '-q', origin, repo]);
  git(repo, 'checkout', '-q', '-b', 'main');
  fs.writeFileSync(path.join(repo, 'f.txt'), 'one\ntwo\nthree\n');
  fs.writeFileSync(path.join(repo, '.gitignore'), 'build/\n');
  git(repo, 'add', '-A'); git(repo, 'commit', '-q', '-m', 'base'); git(repo, 'push', '-q', 'origin', 'main');
  git(repo, 'worktree', 'add', '-q', '--detach', wt, 'main');
  const checkJs = path.join(root, 'check.js');
  fs.writeFileSync(checkJs, `const fs=require('fs'),p=require('path');
if (process.env.LT_SLOW) { fs.writeFileSync(process.env.LT_SLOW, 'started'); const t=Date.now(); while (Date.now()-t < 60000) {} }
fs.mkdirSync('build/bin',{recursive:true}); fs.writeFileSync('build/bin/app.bin', require('child_process').execSync('git rev-parse HEAD').toString());
if (fs.existsSync('RED')) { console.log('FAIL the_red_row'); process.exit(1); }
console.log('all green');`);
  const guardJs = path.join(root, 'guard.js');
  fs.writeFileSync(guardJs, `const f=${JSON.stringify(path.join(root, 'game.pid'))}; let pid=0; try{pid=+require('fs').readFileSync(f,'utf8')}catch(_){}
let alive=false; if(pid){try{process.kill(pid,0);alive=true}catch(e){alive=e.code==='EPERM'}} process.exit(alive?0:1);`);
  const cfg = {
    repo, worktree: wt, base: 'main', remote: 'origin',
    check: [process.execPath, checkJs],
    guard: [process.execPath, guardJs], guard_poll_ms: 200,
    promote: { files: ['build/bin'], stamp: 'build/launch.stamp', stamp_text: 'built for the launcher by the landing train' },
  };
  return { root, origin, repo, wt, data, cfg };
}
/** A branch off main in the main checkout with one file written; returns its READY row. */
function branch(w, name, file, text) {
  git(w.repo, 'checkout', '-q', '-b', name, 'main');
  fs.writeFileSync(path.join(w.repo, file), text);
  git(w.repo, 'add', '-A'); git(w.repo, 'commit', '-q', '-m', name);
  const s = git(w.repo, 'rev-parse', 'HEAD');
  git(w.repo, 'checkout', '-q', 'main');
  return { branch: name, sha: s, pane: 'B', lap: 'test' };
}
const quiet = { hold: null, say: () => {} };
const originMain = (w) => git(w.origin, 'rev-parse', 'main');

test('a red branch in a batch of three: the other two land and the red one is named', () => {
  const w = world();
  const rows = [branch(w, 'b1', 'a.txt', 'a\n'), branch(w, 'b2', 'RED', 'red\n'), branch(w, 'b3', 'c.txt', 'c\n')];
  T.writeReady(w.data, rows);
  const r = T.runTrain(w.cfg, { ...quiet, data: w.data });
  assert.equal(r.stopped, null);
  assert.deepEqual(r.landed.map((x) => x.branch).sort(), ['b1', 'b3']);
  assert.deepEqual(r.named.map((n) => [n.row.branch, n.reason]), [['b2', 'red alone on main']]);
  assert.ok(r.named[0].failing.some((l) => l.includes('FAIL the_red_row')), 'the failing row is named');
  const tip = originMain(w);
  assert.equal(git(w.repo, 'rev-parse', 'main'), tip, 'main and origin agree');
  for (const s of [rows[0].sha, rows[2].sha]) assert.equal(spawnSync('git', ['-C', w.repo, 'merge-base', '--is-ancestor', s, tip]).status, 0);
  assert.notEqual(spawnSync('git', ['-C', w.repo, 'merge-base', '--is-ancestor', rows[1].sha, tip]).status, 0, 'the red branch did not land');
  assert.deepEqual(T.readReady(w.data), [], 'the READY list is empty');
});

test('a conflict: the branch is dropped with its file named, and nothing half-merged is left', () => {
  const w = world();
  // c3 comes AFTER the conflict in the same batch: it merges only if c2's half-merge was aborted (the harness's mutant 4
  // survived a version of this row that ended on the conflict, because the train's end-of-run clean hid it).
  const rows = [branch(w, 'c1', 'f.txt', 'one\nTWO\nthree\n'), branch(w, 'c2', 'f.txt', 'one\nzwei\nthree\n'), branch(w, 'c3', 'g.txt', 'g\n')];
  T.writeReady(w.data, rows);
  const r = T.runTrain(w.cfg, { ...quiet, data: w.data });
  assert.deepEqual(r.landed.map((x) => x.branch), ['c1', 'c3']);
  assert.deepEqual(r.named.map((n) => [n.row.branch, n.reason, n.files]), [['c2', 'conflict', ['f.txt']]]);
  assert.equal(fs.existsSync(path.join(w.wt, '.git')) && fs.readFileSync(path.join(w.wt, '.git'), 'utf8').length > 0, true);
  const gitDir = git(w.wt, 'rev-parse', '--git-dir');
  assert.equal(fs.existsSync(path.join(path.resolve(w.wt, gitDir), 'MERGE_HEAD')), false, 'no merge in progress in the train worktree');
  assert.equal(git(w.wt, 'status', '--porcelain', '--untracked-files=no'), '', 'the worktree is clean');
  assert.equal(git(w.repo, 'status', '--porcelain', '--untracked-files=no'), '', 'the main checkout is clean');
  assert.deepEqual(T.readReady(w.data), []);
});

test('a stand-in game is running: the batch lands, promotion waits, and completes when the game exits', async () => {
  const w = world();
  T.writeReady(w.data, [branch(w, 'g1', 'g.txt', 'g\n')]);
  const game = spawn(process.execPath, ['-e', 'setTimeout(()=>{}, 1500)'], { stdio: 'ignore' });
  fs.writeFileSync(path.join(w.root, 'game.pid'), String(game.pid));
  const r = T.runTrain(w.cfg, { ...quiet, data: w.data });
  assert.deepEqual(r.landed.map((x) => x.branch), ['g1']);
  assert.equal(r.pushed, true);
  assert.deepEqual(r.promoted, { done: false, waiting: true }, 'promotion waits while the game runs');
  assert.equal(fs.existsSync(path.join(w.repo, 'build', 'bin', 'app.bin')), false, 'nothing copied over the running game');
  await new Promise((res) => game.on('exit', res));
  const p = T.promote(w.cfg, w.data, { wait: true });
  assert.equal(p.done, true);
  assert.deepEqual(p.mismatched, []);
  assert.equal(fs.readFileSync(path.join(w.repo, 'build', 'bin', 'app.bin'), 'utf8'), fs.readFileSync(path.join(w.wt, 'build', 'bin', 'app.bin'), 'utf8'), 'byte-identical');
  assert.ok(fs.readFileSync(path.join(w.repo, 'build', 'launch.stamp'), 'utf8').startsWith('built for the launcher by the landing train'));
});

test('a promotion that waited copies the build that was CHECKED, even after the worktree has moved on to the next batch', async () => {
  const w = world();
  T.writeReady(w.data, [branch(w, 'p1', 'p.txt', 'p\n')]);
  const game = spawn(process.execPath, ['-e', 'setTimeout(()=>{}, 1500)'], { stdio: 'ignore' });
  fs.writeFileSync(path.join(w.root, 'game.pid'), String(game.pid));
  const r = T.runTrain(w.cfg, { ...quiet, data: w.data });
  assert.equal(r.pushed, true);
  assert.equal(r.promoted.waiting, true);
  // The plan: "the train waits at that last step alone, and the next batch can already be building" - in the same worktree.
  fs.writeFileSync(path.join(w.wt, 'build', 'bin', 'app.bin'), 'the next batch, not yet checked\n');
  await new Promise((res) => game.on('exit', res));
  const p = T.promote(w.cfg, w.data, { wait: true });
  assert.equal(p.done, true);
  assert.equal(fs.readFileSync(path.join(w.repo, 'build', 'bin', 'app.bin'), 'utf8').trim(), r.sha, 'the landed build, not the next batch\'s');
});

test('a staged build is not promoted once main has moved past it (a stale exe under a fresh stamp would read "up to date")', async () => {
  const w = world();
  T.writeReady(w.data, [branch(w, 's1', 's.txt', 's\n')]);
  const game = spawn(process.execPath, ['-e', 'setTimeout(()=>{}, 1500)'], { stdio: 'ignore' });
  fs.writeFileSync(path.join(w.root, 'game.pid'), String(game.pid));
  const r = T.runTrain(w.cfg, { ...quiet, data: w.data });
  assert.equal(r.promoted.waiting, true);
  // A landing by hand moves main while the promotion waits.
  fs.writeFileSync(path.join(w.repo, 'h.txt'), 'by hand\n');
  git(w.repo, 'add', 'h.txt'); git(w.repo, 'commit', '-q', '-m', 'landed by hand');
  await new Promise((res) => game.on('exit', res));
  const p = T.promote(w.cfg, w.data, { wait: true });
  assert.equal(p.done, false);
  assert.match(p.error, /main has moved/);
  assert.equal(fs.existsSync(path.join(w.repo, 'build', 'launch.stamp')), false, 'no stamp written');
  assert.equal(fs.existsSync(path.join(w.repo, 'build', 'bin', 'app.bin')), false, 'nothing copied');
});

test('a killed train: main, origin and the READY list are untouched, and the next run starts clean and lands', async () => {
  const w = world();
  const rows = [branch(w, 'k1', 'k.txt', 'k\n')];
  T.writeReady(w.data, rows);
  const cfgFile = path.join(w.root, 'cfg.json');
  fs.writeFileSync(cfgFile, JSON.stringify(w.cfg));
  const started = path.join(w.root, 'started');
  const before = { main: git(w.repo, 'rev-parse', 'main'), origin: originMain(w), ready: fs.readFileSync(path.join(w.data, T.READY_NAME), 'utf8') };
  const child = spawn(process.execPath, [SCRIPT, 'run', '--config', cfgFile], { env: { ...process.env, CONSONANCE_DATA: w.data, LT_SLOW: started, CONSONANCE_PANE: '' }, stdio: 'ignore' });
  const t0 = Date.now();
  while (!fs.existsSync(started)) { if (Date.now() - t0 > 30000) throw new Error('the slow check never started'); await new Promise((r) => setTimeout(r, 100)); }
  spawnSync('taskkill', ['/T', '/F', '/PID', String(child.pid)]);   // a hard kill, as the reaper and TaskStop do: no exit handler runs
  await new Promise((res) => child.on('exit', res));
  assert.equal(git(w.repo, 'rev-parse', 'main'), before.main, 'main untouched');
  assert.equal(originMain(w), before.origin, 'origin untouched');
  assert.equal(fs.readFileSync(path.join(w.data, T.READY_NAME), 'utf8'), before.ready, 'the READY list untouched');
  assert.equal(fs.existsSync(path.join(w.data, T.MARK_NAME)), false, 'no landing was begun');
  const r = T.runTrain(w.cfg, { ...quiet, data: w.data });
  assert.equal(r.stopped, null);
  assert.deepEqual(r.landed.map((x) => x.branch), ['k1']);
  assert.equal(git(w.wt, 'status', '--porcelain', '--untracked-files=no'), '');
});

test('the scan refuses a planted key shape: nothing is pushed, main does not move, and the refusal is in the push-gate ledger', () => {
  const w = world();
  const fake = ['AKIA', 'Q'.repeat(16)].join('');   // a key SHAPE (aws access key) built at run time, so this source carries none
  T.writeReady(w.data, [branch(w, 'leak', 'cfg.txt', `key = ${fake}\n`)]);
  const before = { main: git(w.repo, 'rev-parse', 'main'), origin: originMain(w) };
  const r = T.runTrain(w.cfg, { ...quiet, data: w.data });
  assert.equal(r.pushed, false);
  assert.match(r.stopped, /the scan refused the push \(deny/);
  assert.equal(git(w.repo, 'rev-parse', 'main'), before.main, 'main did not move');
  assert.equal(originMain(w), before.origin, 'nothing was pushed');
  const rows = fs.readFileSync(path.join(w.data, 'push-gate.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  assert.equal(rows.at(-1).decision, 'deny');
  assert.equal(rows.at(-1).seat, 'landing-train');
  assert.ok(!JSON.stringify(rows).includes(fake), 'the ledger never carries the key');
});

test('the remote refuses the push: it is reported as not landed, the READY list keeps the branch, and reconcile can finish it later', () => {
  const w = world();
  const row = branch(w, 'r1', 'r.txt', 'r\n');
  T.writeReady(w.data, [row]);
  const hook = path.join(w.origin, 'hooks', 'pre-receive');
  fs.writeFileSync(hook, '#!/bin/sh\necho "refused by the test" >&2\nexit 1\n');
  try { fs.chmodSync(hook, 0o755); } catch (_) { /* Windows: Git runs it through sh */ }
  const before = originMain(w);
  const r = T.runTrain(w.cfg, { ...quiet, data: w.data });
  assert.equal(r.pushed, false);
  assert.match(r.stopped, /pushed\? no/);
  assert.equal(originMain(w), before, 'origin did not move');
  assert.deepEqual(T.readReady(w.data).map((x) => x.branch), ['r1'], 'the branch is still READY');
  assert.equal(fs.existsSync(path.join(w.data, T.MARK_NAME)), true, 'the marker stays for reconcile');
  fs.rmSync(hook);
  const rc = T.reconcile(w.cfg, w.data);
  assert.equal(rc.done, 'pushed');
  assert.equal(originMain(w), git(w.repo, 'rev-parse', 'main'));
  assert.deepEqual(T.readReady(w.data), []);
  assert.equal(fs.existsSync(path.join(w.data, T.MARK_NAME)), false);
});

test('the scan fails closed: an error, or the hook\'s own fail-open answer, is not an allow', () => {
  const thrower = { decide: () => { throw new Error('boom'); } };
  assert.equal(T.scanForPush('.', 'origin', 'abc', { gate: thrower }).ok, false);
  assert.equal(T.scanForPush('.', 'origin', 'abc', { gate: { decide: () => ({ decision: 'allow-error' }) } }).ok, false);
  assert.equal(T.scanForPush('.', 'origin', 'abc', { gate: { decide: () => ({ decision: 'not-a-push' }) } }).ok, false);
  assert.equal(T.scanForPush('.', 'origin', 'abc', { gate: { decide: () => ({ decision: 'allow', scanned: [] }) } }).ok, true);
});

test('READY: a branch marked again moves to the back with its new sha; failingRows names the lines that matter', () => {
  const a = { branch: 'a', sha: '1' }, b = { branch: 'b', sha: '2' };
  assert.deepEqual(T.addReady([a, b], { branch: 'a', sha: '3' }).map((r) => r.branch + r.sha), ['b2', 'a3']);
  assert.deepEqual(T.failingRows('ok\nFAIL  some_row\n  x.cpp(1): CHECK failed: y\n 3/11 Test #3: z ....***Failed  1 sec\nfine'), ['FAIL  some_row', 'x.cpp(1): CHECK failed: y', '3/11 Test #3: z ....***Failed  1 sec']);
});

test('the board line names what landed (branch, sha, pane, lap), the pushed sha, and every branch sent back with why; nothing landed and nothing named is no line', () => {
  const line = T.boardLine({
    landed: [{ branch: 'l1', sha: 'aaaaaaa1', pane: 'B', lap: 'L188' }, { branch: 'l2', sha: 'bbbbbbb2', pane: 'C', lap: 'L191' }],
    named: [{ row: { branch: 'l3', sha: 'ccccccc3', pane: 'E' }, reason: 'red', failing: ['FAIL  x_row'] }, { row: { branch: 'l4', sha: 'ddddddd4', pane: 'A' }, reason: 'conflict', files: ['f.txt'] }],
    sha: 'eeeeeee5', pushed: true,
  }, 'main');
  for (const want of ['l1 aaaaaaa (B L188)', 'l2 bbbbbbb (C L191)', 'main eeeeeee', 'pushed', 'l3 ccccccc (E): red: FAIL  x_row', 'l4 ddddddd (A): conflict: f.txt']) assert.ok(line.includes(want), `missing "${want}" in: ${line}`);
  assert.equal(T.boardLine({ landed: [], named: [], sha: null, pushed: null }, 'main'), null);
});

test('the CLI as a pane types it: `ready --config FILE <branch> --pane P --lap L` marks the branch, and `list` shows it', () => {
  const w = world();
  const row = branch(w, 'cli1', 'cli.txt', 'c\n');
  const cfgFile = path.join(w.root, 'cfg.json');
  fs.writeFileSync(cfgFile, JSON.stringify(w.cfg));
  const env = { ...process.env, CONSONANCE_DATA: w.data };
  const r = spawnSync(process.execPath, [SCRIPT, 'ready', '--config', cfgFile, 'cli1', '--pane', 'B', '--lap', 'L194'], { encoding: 'utf8', env });
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(T.readReady(w.data).map((x) => [x.branch, x.sha, x.pane, x.lap]), [['cli1', row.sha, 'B', 'L194']]);
  const l = spawnSync(process.execPath, [SCRIPT, 'list', '--config', cfgFile], { encoding: 'utf8', env });
  assert.match(l.stdout, new RegExp(`^cli1 ${row.sha.slice(0, 7)} B L194 `, 'm'));
});

test('failingRows names dreamzone-3\'s own red lines: CHECK_NEAR and CHECK_EQ (tests/dz_test_main.cpp) and a self-test\'s FAILED total', () => {
  const out = [
    'ok    a_row',
    '    body_tests.cpp(88): CHECK_NEAR failed: a = 1, b = 2, tolerance 0.1',
    '    body_tests.cpp(90): CHECK_EQ failed: n = 1, m = 3',
    '1 tests, 1 failed',
    '  ok    the frame',
    'selftest: FAILED (1 of 52 checks passed)',
  ].join('\n');
  assert.deepEqual(T.failingRows(out), [
    'body_tests.cpp(88): CHECK_NEAR failed: a = 1, b = 2, tolerance 0.1',
    'body_tests.cpp(90): CHECK_EQ failed: n = 1, m = 3',
    'selftest: FAILED (1 of 52 checks passed)',
  ]);
});

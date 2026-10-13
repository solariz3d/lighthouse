'use strict';
// worktree-sweep.test.js — node --test consonance/tools/worktree-sweep.test.js. D319 part 1: the one-time removal of landed worktrees. On a real
// throwaway repository (never the room's): a dry run changes nothing; --apply removes a clean worktree whose HEAD is in main and one whose patch
// is in main under another id, keeps their branches, and keeps the main checkout, a dirty worktree (its files listed), an unlanded one (its
// commits listed with subjects), one a heavy-run lock names, one a running process names, and one holding a JUNCTION — whose target keeps its
// file (the 2026-09-28 loss). Process lists are injected (the boundary); git and the file system are real.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const W = require('./worktree-sweep.js');
const scratch = require('./scratch.js');

const git = (cwd, ...args) => { const r = spawnSync('git', args, { cwd, encoding: 'utf8' }); if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${r.stderr}`); return r.stdout.trim(); };
const put = (p, text = 'x') => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); return p; };
const commit = (cwd, file, msg) => { put(path.join(cwd, file), msg); git(cwd, 'add', file); git(cwd, '-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', msg); return git(cwd, 'rev-parse', 'HEAD'); };

/** A repo with main and seven worktrees, one per case. The junction's target lives OUTSIDE the worktree, beside it, with a file in it. */
function fixture() {
  const root = scratch.mkdtemp('wtsweep-test-');
  const repo = path.join(root, 'repo'), wts = path.join(root, 'wts'), data = path.join(root, 'data'), shared = path.join(root, 'shared-reads');
  fs.mkdirSync(repo); fs.mkdirSync(wts); fs.mkdirSync(data); put(path.join(shared, 'keep.txt'), 'the shared reads');
  git(repo, 'init', '-q', '-b', 'main');
  put(path.join(repo, '.gitignore'), 'reads/\n'); git(repo, 'add', '.gitignore');
  commit(repo, 'a.txt', 'base');
  const wt = (name, ...extra) => { const p = path.join(wts, name); git(repo, 'worktree', 'add', '-q', '-b', name, p, ...extra); return p; };
  const landed = wt('landed');                              // HEAD in main
  const picked = wt('picked');                              // its patch is in main under another id
  const pickedSha = commit(picked, 'p.txt', 'picked change');
  git(repo, '-c', 'user.name=t', '-c', 'user.email=t@t', 'cherry-pick', pickedSha);
  const dirty = wt('dirty'); put(path.join(dirty, 'wip.txt'), 'not committed');
  const unlanded = wt('unlanded'); commit(unlanded, 'u.txt', 'work that is not in main');
  const locked = wt('locked');
  const busy = wt('busy');
  const gitlocked = wt('gitlocked'); git(repo, 'worktree', 'lock', gitlocked);   // landed and clean, but `git worktree lock` is on it
  const linked = wt('linked');                              // clean: the junction sits under the ignored reads/
  fs.mkdirSync(path.join(linked, 'reads'));
  fs.symlinkSync(shared, path.join(linked, 'reads', 'shared'), 'junction');
  fs.writeFileSync(path.join(data, 'heavy-run.lock'), JSON.stringify({ pid: 1, tree: locked.toLowerCase() }));
  const procs = [{ pid: 424242, text: `c:\\program files\\nodejs\\node.exe node server.js --root ${busy.toLowerCase()}` }];
  return { root, repo, data, shared, landed, picked, dirty, unlanded, locked, busy, gitlocked, linked, procs };
}
function cleanup(f) {
  try { fs.unlinkSync(path.join(f.linked, 'reads', 'shared')); } catch (_) {}   // the junction alone, never through it
  scratch.rm(f.root);
}
const run = (f, apply) => W.sweep({ repo: f.repo, data: f.data, apply, listProcesses: () => f.procs });
const cls = (o, p) => (o.rows.find((r) => path.resolve(r.path).toLowerCase() === path.resolve(p).toLowerCase()) || {}).class;

test('a dry run classifies every worktree and changes nothing', () => {
  const f = fixture();
  try {
    const o = run(f, false);
    assert.deepEqual([cls(o, f.repo), cls(o, f.landed), cls(o, f.picked), cls(o, f.dirty), cls(o, f.unlanded), cls(o, f.locked), cls(o, f.busy), cls(o, f.gitlocked), cls(o, f.linked)],
      ['MAIN', 'REMOVE', 'REMOVE', 'DIRTY', 'UNLANDED', 'LOCK', 'PROCESS', 'GIT-LOCKED', 'LINK']);
    assert.deepEqual([o.removed.length, fs.existsSync(f.landed), fs.existsSync(f.picked)], [0, true, true]);
    assert.match(W.report(o), /dry run/);
  } finally { cleanup(f); }
});

test('--apply removes the landed and the cherry-landed worktrees and keeps their branches', () => {
  const f = fixture();
  try {
    const o = run(f, true);
    assert.deepEqual(o.removed.map((r) => path.basename(r.path)).sort(), ['landed', 'picked']);
    assert.deepEqual([fs.existsSync(f.landed), fs.existsSync(f.picked)], [false, false]);
    assert.match(git(f.repo, 'branch', '--list', 'landed', 'picked'), /landed[\s\S]*picked/);
    assert.ok(o.prune && o.prune.ok);
  } finally { cleanup(f); }
});

test('--apply keeps the main checkout, the dirty, the unlanded, the locked and the busy worktrees', () => {
  const f = fixture();
  try {
    run(f, true);
    assert.deepEqual([f.repo, f.dirty, f.unlanded, f.locked, f.busy, f.gitlocked].map((p) => fs.existsSync(p)), [true, true, true, true, true, true]);
    assert.ok(fs.existsSync(path.join(f.dirty, 'wip.txt')));
  } finally { cleanup(f); }
});

test('a worktree holding a junction is kept, the link is named, and the junction target keeps its file', () => {
  const f = fixture();
  try {
    const o = run(f, true);
    const row = o.rows.find((r) => r.path.toLowerCase() === f.linked.toLowerCase());
    assert.equal(row.class, 'LINK');
    assert.ok(row.links.some((l) => l.toLowerCase().endsWith(path.join('reads', 'shared').toLowerCase())), JSON.stringify(row.links));
    assert.deepEqual([fs.existsSync(f.linked), fs.readFileSync(path.join(f.shared, 'keep.txt'), 'utf8')], [true, 'the shared reads']);
  } finally { cleanup(f); }
});

test('the dirty worktree lists its files and the unlanded one its commits with subjects', () => {
  const f = fixture();
  try {
    const o = run(f, false);
    const row = (p) => o.rows.find((r) => r.path.toLowerCase() === p.toLowerCase());
    assert.ok(row(f.dirty).dirty.some((l) => l.includes('wip.txt')), JSON.stringify(row(f.dirty).dirty));
    assert.deepEqual(row(f.unlanded).unlanded.map((c) => c.subject), ['work that is not in main']);
    const rep = W.report(o);
    assert.match(rep, /dirty: .*wip\.txt/);
    assert.match(rep, /unlanded: [0-9a-f]+ work that is not in main/);
  } finally { cleanup(f); }
});

test('the act never forces: removing a dirty worktree directly is refused by git and its files stay', () => {
  const f = fixture();
  try {
    const rm = W.removeOne(f.repo, f.dirty);
    assert.deepEqual([rm.ok, fs.existsSync(path.join(f.dirty, 'wip.txt'))], [false, true]);
    assert.ok(rm.err, "git's refusal is carried");
  } finally { cleanup(f); }
});

test('a heavy-run lock that records no tree stops --apply from removing anything', () => {
  const f = fixture();
  try {
    fs.writeFileSync(path.join(f.data, 'heavy-run.2.lock'), JSON.stringify({ pid: 1 }));
    const o = run(f, true);
    assert.deepEqual([o.removed.length, !!o.refusedAll, fs.existsSync(f.landed)], [0, true, true]);
  } finally { cleanup(f); }
});

test('a worktree that changed between the classification and the act is not removed (classified again first)', () => {
  const f = fixture();
  try {
    let calls = 0;
    const o = W.sweep({ repo: f.repo, data: f.data, apply: true, listProcesses: () => (++calls === 1 ? f.procs : [...f.procs, { pid: 7, text: f.landed.toLowerCase() }]) });
    assert.ok(fs.existsSync(f.landed));
    assert.ok(o.refused.some((r) => r.path.toLowerCase() === f.landed.toLowerCase() && /PROCESS/.test(r.why)), JSON.stringify(o.refused));
  } finally { cleanup(f); }
});

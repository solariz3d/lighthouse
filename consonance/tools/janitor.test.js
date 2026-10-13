'use strict';
// janitor.test.js — node --test consonance/tools/janitor.test.js. D287 part 2: each class removes (or moves) its OLD entries and keeps its young
// ones; a cited task output is kept; a locked or unmerged worktree's target is kept, and a main checkout's; a link inside keeps a folder; a dry run
// changes nothing. Every row runs on a sandbox of fake roots (never the real %TEMP%, worktrees or archive); the worktree rows use a real git repo.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const J = require('./janitor.js');
const scratch = require('./scratch.js');

const DAY = 864e5, NOW = Date.parse('2026-10-10T12:00:00Z');
const TAG = J.CARGO_TAG + '\n# This file is a cache directory tag created by cargo.\n';
/** Set p and everything under it to `days` old (children first, so a folder's own mtime is not refreshed after). */
function age(p, days) {
  const t = new Date(NOW - days * DAY);
  const st = fs.lstatSync(p);
  if (st.isDirectory()) for (const n of fs.readdirSync(p)) age(path.join(p, n), days);
  fs.utimesSync(p, t, t);
}
const put = (p, text = 'x'.repeat(100)) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); return p; };
const target = (dir) => { put(path.join(dir, 'CACHEDIR.TAG'), TAG); put(path.join(dir, 'debug', 'deps', 'a.rlib'), 'y'.repeat(1000)); return dir; };
const git = (cwd, ...args) => { const r = spawnSync('git', args, { cwd, encoding: 'utf8' }); if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${r.stderr}`); return r.stdout.trim(); };

/** A sandbox: the roots the janitor takes, all fake. */
function sandbox() {
  const root = scratch.mkdtemp('janitor-test-');
  const s = { root, tmp: path.join(root, 'tmp'), claude: path.join(root, 'tmp', 'claude'), wts: path.join(root, 'worktrees'), exo: path.join(root, 'exo'), arch: path.join(root, 'archive'), data: path.join(root, 'data') };
  for (const d of [s.tmp, s.claude, s.wts, s.exo, s.data]) fs.mkdirSync(d, { recursive: true });
  s.opts = (extra = {}) => ({ tempDirs: [s.tmp], claudeTemp: s.claude, worktreesDir: s.wts, exo: s.exo, dataDir: s.data, archiveRoot: s.arch, mainCheckouts: [], prefixes: { js: ['jt-'], rust: ['rshead_'] }, now: NOW, repo: root, worktreeRepos: [], paneDirs: [], paneText: () => '', ...extra });
  return s;
}
/** A repo with main and one worktree whose HEAD is `merged` into main or not; returns the worktree path. */
function repoWithWorktree(s, name, merged) {
  const repo = path.join(s.root, 'repo-' + name);
  fs.mkdirSync(repo, { recursive: true });
  git(repo, 'init', '-q', '-b', 'main'); git(repo, 'config', 'user.email', 't@t'); git(repo, 'config', 'user.name', 't');
  put(path.join(repo, 'a.txt')); git(repo, 'add', 'a.txt'); git(repo, 'commit', '-q', '-m', 'a');
  const wt = path.join(s.wts, name);
  git(repo, 'worktree', 'add', '-q', '-b', 'b-' + name, wt);
  if (!merged) { put(path.join(wt, 'b.txt')); git(wt, 'add', 'b.txt'); git(wt, 'commit', '-q', '-m', 'b'); }
  return { repo, wt };
}
/** Make every git timestamp of a worktree old, so only the target's own age can make it young. */
function ageGit(wt, days) { const gd = git(wt, 'rev-parse', '--absolute-git-dir'); for (const f of ['HEAD', 'index', path.join('logs', 'HEAD')]) { try { age(path.join(gd, f), days); } catch (_) {} } }
const paths = (xs) => xs.map((x) => x.path).sort();

test('(a) an old room temp folder is deleted, a young one kept, a stranger\'s and a not-quite-shaped name left alone', () => {
  const s = sandbox();
  try {
    const old = path.join(s.tmp, 'jt-AbC123'), young = path.join(s.tmp, 'jt-XyZ789'), rs = path.join(s.tmp, 'rshead_1234_99');
    const stranger = path.join(s.tmp, 'other-AbC123'), misshaped = path.join(s.tmp, 'jt-toolongname');
    for (const d of [old, young, rs, stranger, misshaped]) put(path.join(d, 'f.txt'));
    age(old, 3); age(rs, 3); age(stranger, 30); age(misshaped, 30); age(young, 1);
    const p = J.plan(s.opts());
    assert.deepEqual(paths(p.classes.a), [old, rs].sort());
    assert.deepEqual(p.kept.a.young, [young]);
    const r = J.apply(p, s.opts());
    assert.equal(r.done.a.n, 2);
    for (const d of [old, rs]) assert.equal(fs.existsSync(d), false, d);
    for (const d of [young, stranger, misshaped]) assert.equal(fs.existsSync(d), true, d);
  } finally { scratch.rm(s.root); }
});

test('(a) a folder whose top is old but which holds a fresh file is kept (age is the NEWEST thing inside)', () => {
  const s = sandbox();
  try {
    const d = path.join(s.tmp, 'jt-QQQ111');
    put(path.join(d, 'deep', 'old.txt')); age(d, 5);
    put(path.join(d, 'deep', 'new.txt')); age(path.join(d, 'deep', 'new.txt'), 0.1);
    fs.utimesSync(d, new Date(NOW - 5 * DAY), new Date(NOW - 5 * DAY));
    const p = J.plan(s.opts());
    assert.deepEqual(p.classes.a, []); assert.deepEqual(p.kept.a.young, [d]);
  } finally { scratch.rm(s.root); }
});

test('(a) a folder with a link inside is kept and named, and the link\'s target survives', () => {
  const s = sandbox();
  try {
    const outside = put(path.join(s.root, 'precious', 'keep.txt'));
    const d = path.join(s.tmp, 'jt-LNK222');
    put(path.join(d, 'f.txt'));
    fs.symlinkSync(path.dirname(outside), path.join(d, 'link'), 'junction');
    age(d, 5);
    const p = J.plan(s.opts());
    assert.deepEqual(p.classes.a, []); assert.deepEqual(p.kept.a['a link inside'], [d]);
    J.apply(p, s.opts());
    assert.equal(fs.existsSync(outside), true);
  } finally { scratch.rm(s.root); }
});

test('(b) an old task output is MOVED to the archive, a young one and a cited one stay where they are', () => {
  const s = sandbox();
  try {
    const tasks = path.join(s.claude, 'C--Consonance-instances-a', 'sess1', 'tasks');
    const old = put(path.join(tasks, 'bold00001.output'), 'old log'), young = put(path.join(tasks, 'byoung001.output'));
    const citedF = put(path.join(tasks, 'bcited001.output'));
    age(old, 9); age(citedF, 9); age(young, 2);
    put(path.join(s.exo, 'handback', 'p-x.md'), 'the run is at C:\\Temp\\claude\\C--proj\\sess1\\tasks\\bcited001.output, read it');
    const p = J.plan(s.opts());
    assert.deepEqual(paths(p.classes.b), [old]);
    assert.deepEqual(p.kept.b['cited in exo_memory'], [citedF]);
    assert.deepEqual(p.kept.b.young, [young]);
    const dest = p.classes.b[0].to;
    assert.ok(dest.startsWith(path.join(s.arch, '2026-10-10')), dest);
    J.apply(p, s.opts());
    assert.equal(fs.existsSync(old), false);
    assert.equal(fs.readFileSync(dest, 'utf8'), 'old log', 'moved whole');
    assert.equal(fs.existsSync(citedF) && fs.existsSync(young), true);
  } finally { scratch.rm(s.root); }
});

test('(b) with no archive drive nothing is moved or deleted', () => {
  const s = sandbox();
  try {
    const f = put(path.join(s.claude, 'C--Consonance-instances-b', 's', 'tasks', 'bnoarch01.output')); age(f, 9);
    const p = J.plan(s.opts({ archiveRoot: 'Q:\\nowhere-at-all\\consonance-archive' }));
    if (fs.existsSync('Q:\\')) return;   // a machine that has a Q: drive cannot run this row
    assert.deepEqual(p.classes.b, []); assert.deepEqual(p.kept.b['no archive drive'], [f]);
  } finally { scratch.rm(s.root); }
});

test('(c) an idle cargo target in a scratchpad is deleted; a young one, and a target-named folder without cargo\'s tag, are kept', () => {
  const s = sandbox();
  try {
    const pad = path.join(s.claude, 'C--Consonance-instances-a', 'sess1', 'scratchpad');
    const idle = target(path.join(pad, 'usb', 'target')), fresh = target(path.join(pad, 'd1', 'target-2'));
    const notCargo = put(path.join(pad, 'target-notes', 'notes.md'));
    age(idle, 3); age(fresh, 0.5); age(path.dirname(notCargo), 30);
    const p = J.plan(s.opts());
    assert.deepEqual(paths(p.classes.c), [idle]);
    assert.deepEqual(p.kept.c.young, [fresh]);
    J.apply(p, s.opts());
    assert.equal(fs.existsSync(idle), false);
    assert.equal(fs.existsSync(fresh) && fs.existsSync(notCargo), true);
    assert.equal(fs.existsSync(path.join(pad, 'usb')), true, 'only the target goes, never the scratchpad around it');
  } finally { scratch.rm(s.root); }
});

test('(d) a merged, idle worktree\'s target is deleted; an unmerged one\'s, a young one\'s and a locked one\'s are kept', () => {
  const s = sandbox();
  try {
    const merged = repoWithWorktree(s, 'merged', true), unmerged = repoWithWorktree(s, 'unmerged', false);
    const young = repoWithWorktree(s, 'young', true), locked = repoWithWorktree(s, 'locked', true);
    const t = {};
    for (const [k, w] of Object.entries({ merged, unmerged, young, locked })) { t[k] = target(path.join(w.wt, 'consonance', 'src-tauri', 'target')); ageGit(w.wt, 3); age(t[k], k === 'young' ? 0.2 : 3); }
    fs.writeFileSync(path.join(s.data, 'heavy-run.2.lock'), JSON.stringify({ pid: process.pid, tree: locked.wt.toLowerCase(), token: 't' }));
    const p = J.plan(s.opts());
    assert.deepEqual(paths(p.classes.d), [t.merged]);
    assert.deepEqual(p.kept.d['HEAD is not in main'], [t.unmerged]);
    assert.deepEqual(p.kept.d.young, [t.young]);
    assert.deepEqual(p.kept.d['a heavy-run lock is held in it'], [t.locked]);
    J.apply(p, s.opts());
    assert.equal(fs.existsSync(t.merged), false);
    for (const k of ['unmerged', 'young', 'locked']) assert.equal(fs.existsSync(t[k]), true, k);
    assert.equal(fs.existsSync(path.join(merged.wt, 'a.txt')), true, 'the worktree itself is untouched');
  } finally { scratch.rm(s.root); }
});

test('(d) a lock that records no tree keeps every worktree target; a main checkout\'s target is never a candidate', () => {
  const s = sandbox();
  try {
    const w = repoWithWorktree(s, 'any', true), t = target(path.join(w.wt, 'target')); ageGit(w.wt, 3); age(t, 3);
    fs.writeFileSync(path.join(s.data, 'heavy-run.lock'), JSON.stringify({ pid: 1, token: 'old-style' }));
    assert.deepEqual(J.plan(s.opts()).kept.d['a heavy-run lock records no tree'], [t]);
    fs.writeFileSync(path.join(s.data, 'heavy-run.lock'), '{ half-written');   // an unreadable lock: whose tree it holds is unknown, so it keeps everything too
    assert.deepEqual(J.plan(s.opts()).kept.d['a heavy-run lock records no tree'], [t]);
    fs.unlinkSync(path.join(s.data, 'heavy-run.lock'));
    assert.deepEqual(J.plan(s.opts({ mainCheckouts: [w.wt] })).kept.d['a main checkout'], [t]);
    assert.deepEqual(paths(J.plan(s.opts()).classes.d), [t], 'control: with neither, it is a candidate');
  } finally { scratch.rm(s.root); }
});

test('a dry run changes nothing: every candidate of every class is still there, byte for byte', () => {
  const s = sandbox();
  try {
    const a = path.join(s.tmp, 'jt-DRY001'); put(path.join(a, 'f.txt')); age(a, 9);
    const b = put(path.join(s.claude, 'C--Consonance-instances-b', 's', 'tasks', 'bdry00001.output')); age(b, 9);
    const c = target(path.join(s.claude, 'C--Consonance-instances-b', 's', 'scratchpad', 'target')); age(c, 9);
    const before = JSON.stringify(J.survey(s.root));
    const out = spawnSync(process.execPath, ['-e', `const J=require(${JSON.stringify(path.join(__dirname, 'janitor.js'))});const p=J.plan(${JSON.stringify(s.opts())});J.report(p,()=>{});process.stdout.write(String(p.classes.a.length+p.classes.b.length+p.classes.c.length))`], { encoding: 'utf8' });
    assert.equal(out.stdout.trim(), '3', out.stderr);
    assert.equal(JSON.stringify(J.survey(s.root)), before);
    assert.equal(fs.existsSync(path.join(s.data, 'janitor.jsonl')), false, 'a dry run writes no ledger line');
  } finally { scratch.rm(s.root); }
});

test('the last line of defence: a drive root, D:, the keeper\'s folders and anything outside its class root are refused at the act', () => {
  assert.throws(() => J.assertSafe('C:\\', 'C:\\'), /drive root/);
  assert.throws(() => J.assertSafe('D:\\consonance-scratch\\x', 'D:\\consonance-scratch'), /USB stick/);
  assert.throws(() => J.assertSafe('C:\\Users\\someone\\Downloads\\jt-AbC123', 'C:\\Users\\someone'), /keeper's own/);
  assert.throws(() => J.assertSafe('C:\\Users\\someone\\Documents\\x', 'C:\\Users\\someone'), /keeper's own/);
  assert.throws(() => J.assertSafe('C:\\elsewhere\\jt-AbC123', 'C:\\temp'), /not under its class root/);
  assert.doesNotThrow(() => J.assertSafe('C:\\temp\\jt-AbC123', 'C:\\temp'));
});

test('the prefixes are read from this repository\'s own source: mkdtemp literals and the Rust format! heads', () => {
  const p = J.sourcePrefixes();
  assert.ok(p.js.includes('gen-consumer-'), 'gen-consumer.js makes gen-consumer-XXXXXX');
  assert.ok(p.rust.includes('seal-gate-'), 'mcp.rs makes seal-gate-{name}-…');
  assert.ok(p.rust.includes('consonance-offsets-'), 'main.rs makes consonance-offsets-{}');
  assert.ok(p.js.every((x) => x.length >= 2) && p.rust.every((x) => /[-_]$/.test(x)), 'no empty or boundary-less prefix');
  assert.equal(J.roomTempName('claude', { js: ['cl'], rust: ['cla'] }), false, 'the Claude Code temp root is never a class (a) folder');
});

test('(d) a worktree used in git within 24 h keeps its target even when the target itself is old', () => {
  const s = sandbox();
  try {
    const w = repoWithWorktree(s, 'busy', true), t = target(path.join(w.wt, 'target'));
    age(t, 3);   // the target is old; the worktree's git index and HEAD were written just now (NOW is not the clock git used: set them to NOW - 1 h)
    const gd = git(w.wt, 'rev-parse', '--absolute-git-dir'), recent = new Date(NOW - 3600e3);
    for (const f of ['HEAD', 'index']) fs.utimesSync(path.join(gd, f), recent, recent);
    const p = J.plan(s.opts());
    assert.deepEqual(p.classes.d, []); assert.deepEqual(p.kept.d.young, [t]);
  } finally { scratch.rm(s.root); }
});

test('the act re-checks: a folder that turned young between the plan and --apply is skipped, not deleted', () => {
  const s = sandbox();
  try {
    const d = path.join(s.tmp, 'jt-RACE01'); put(path.join(d, 'f.txt')); age(d, 5);
    const p = J.plan(s.opts());
    assert.deepEqual(paths(p.classes.a), [d]);
    put(path.join(d, 'written-since.txt'));   // mtime is the real now, which is after NOW: young to the act
    const r = J.apply(p, s.opts({ now: Date.now() }));
    assert.equal(r.done.a.n, 0); assert.deepEqual(r.skipped.map((x) => x.why), ['changed since the plan']);
    assert.equal(fs.existsSync(d), true);
  } finally { scratch.rm(s.root); }
});

test('the act refuses a forged entry outside its class root: recorded as an error, and the folder is still there', () => {
  const s = sandbox();
  try {
    const outside = path.join(s.root, 'precious-AbC123'); put(path.join(outside, 'f.txt')); age(outside, 30);
    const forged = { classes: { a: [{ path: outside, root: s.tmp, bytes: 1, newest: 0, act: 'delete' }], b: [], c: [], d: [] } };
    const r = J.apply(forged, s.opts());
    assert.equal(r.done.a.n, 0);
    assert.match(r.errors[0].error, /not under its class root/);
    assert.equal(fs.existsSync(outside), true);
  } finally { scratch.rm(s.root); }
});

test('D287-e2 config: a root is the env override, else the ~/.consonance.json key, else nothing (a blank value is nothing)', () => {
  const was = process.env.JANITOR_TEST_ROOT;
  try {
    process.env.JANITOR_TEST_ROOT = '/from/env';
    assert.equal(J.setting('JANITOR_TEST_ROOT', 'k', { k: '/from/config' }), '/from/env');
    delete process.env.JANITOR_TEST_ROOT;
    assert.equal(J.setting('JANITOR_TEST_ROOT', 'k', { k: '/from/config' }), '/from/config');
    assert.equal(J.setting('JANITOR_TEST_ROOT', 'k', { k: '  ' }), null);
    assert.equal(J.setting('JANITOR_TEST_ROOT', 'k', {}), null);
  } finally { if (was === undefined) delete process.env.JANITOR_TEST_ROOT; else process.env.JANITOR_TEST_ROOT = was; }
});

test('D287-e2 config: with no archive configured (b) moves nothing; with no worktrees folder (d) is not run; each is SAID, naming its key', () => {
  const s = sandbox();
  try {
    const log = put(path.join(s.claude, 'C--Consonance-instances-a', 's1', 'tasks', 'bnocfg001.output')); age(log, 30);
    const w = repoWithWorktree(s, 'cfg', true), t = target(path.join(w.wt, 'target')); ageGit(w.wt, 3); age(t, 3);
    const p = J.plan(s.opts({ archiveRoot: null, worktreesDir: null }));
    assert.deepEqual([p.classes.b, p.classes.d], [[], []]);
    assert.deepEqual(p.kept.b['no archive configured'], [log]);
    assert.ok(p.notes.some((n) => /archive_dir/.test(n)) && p.notes.some((n) => /worktrees_dir/.test(n)), JSON.stringify(p.notes));
    const lines = []; J.report(p, (l) => lines.push(l));
    assert.ok(lines.some((l) => /^  NOTE: \(b\) moves nothing/.test(l)) && lines.some((l) => /^  NOTE: \(d\) is not run/.test(l)), 'the report does not say it');
    assert.deepEqual(paths(J.plan(s.opts()).classes.d), [t], 'control: configured, the same target is a candidate');
  } finally { scratch.rm(s.root); }
});

test('(b)(c) only the room\'s Claude projects: another project\'s old log and idle target are not a class at all', () => {
  const s = sandbox();
  try {
    const log = put(path.join(s.claude, 'C--Users-nname-Desktop-other', 's1', 'tasks', 'bother001.output')); age(log, 30);
    const t = target(path.join(s.claude, 'C--Users-nname-Desktop-other', 's1', 'scratchpad', 'target')); age(t, 30);
    const p = J.plan(s.opts());
    assert.deepEqual([p.classes.b, p.classes.c], [[], []]);
    assert.deepEqual([p.kept.b, p.kept.c], [{}, {}], 'not even counted as kept: it is not looked at');
  } finally { scratch.rm(s.root); }
});

// ---- (e) D319: a landed worktree is REMOVED (plain `git worktree remove`), and a worktree outside worktrees_dir is reported ----
/** Every file of a worktree and its git timestamps `days` old, so only what a row changes afterwards is young. */
function ageWt(wt, days) { age(wt, days); ageGit(wt, days); }
const ledger = (s) => { try { return fs.readFileSync(path.join(s.data, 'janitor.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)); } catch (_) { return []; } };

test('(e) a clean worktree whose every patch is in main, idle over 24 h, is removed with git, logged, and its branch kept', () => {
  const s = sandbox();
  try {
    const anc = repoWithWorktree(s, 'ancestor', true);
    const cp = repoWithWorktree(s, 'picked', false);   // its one commit lands on main under a NEW id, the way the chair lands: not an ancestor, but git cherry says every patch is in
    put(path.join(cp.repo, 'other.txt')); git(cp.repo, 'add', 'other.txt'); git(cp.repo, 'commit', '-q', '-m', 'main moved on');   // else the pick, same second and parent, is the SAME commit
    git(cp.repo, 'cherry-pick', git(cp.wt, 'rev-parse', 'HEAD'));
    assert.notEqual(spawnSync('git', ['-C', cp.wt, 'merge-base', '--is-ancestor', 'HEAD', 'main']).status, 0, 'the row needs a HEAD that is NOT an ancestor of main');
    for (const w of [anc, cp]) ageWt(w.wt, 3);
    const p = J.plan(s.opts());
    assert.deepEqual(paths(p.classes.e), [anc.wt, cp.wt].sort());
    const r = J.apply(p, s.opts());
    assert.equal(r.done.e.n, 2, JSON.stringify(r.errors));
    for (const w of [anc, cp]) {
      assert.equal(fs.existsSync(w.wt), false, w.wt);
      assert.ok(!J.listWorktrees(w.repo).some((x) => path.resolve(x.path).toLowerCase() === path.resolve(w.wt).toLowerCase()), 'git no longer lists it');
      assert.ok(git(w.repo, 'branch', '--list', 'b-' + path.basename(w.wt)), 'the branch is kept, so `git worktree add` undoes it');
    }
    const lines = ledger(s).filter((l) => l.removed_worktree);
    assert.deepEqual(lines.map((l) => l.removed_worktree).sort(), [anc.wt, cp.wt].sort());
    assert.ok(lines.every((l) => /^[0-9a-f]{40}$/.test(l.head)), 'each removal logs the HEAD it can be restored from');
  } finally { scratch.rm(s.root); }
});

test('(e) kept, each with its reason and still on disk: dirty, untracked, unlanded, locked, link-holding, young, and a live pane\'s', () => {
  const s = sandbox();
  try {
    const w = {};
    for (const k of ['dirty', 'untracked', 'unlanded', 'locked', 'linked', 'young', 'pane']) w[k] = repoWithWorktree(s, k, k === 'unlanded' ? false : true);
    fs.writeFileSync(path.join(w.dirty.wt, 'a.txt'), 'changed');
    put(path.join(w.untracked.wt, 'new.txt'));
    const outside = put(path.join(s.root, 'shared-reads', 'keep.txt'));
    fs.symlinkSync(path.dirname(outside), path.join(w.linked.wt, 'reads'), 'junction');
    for (const k of Object.keys(w)) ageWt(w[k].wt, 3);
    put(path.join(w.young.wt, 'fresh.txt'), 'x'); git(w.young.wt, 'add', 'fresh.txt'); git(w.young.wt, 'commit', '-q', '-m', 'fresh');
    git(w.young.repo, 'merge', '-q', '--ff-only', 'b-young');   // landed, clean, but worked in an hour ago
    for (const f of [path.join(w.young.wt, 'fresh.txt'), w.young.wt]) fs.utimesSync(f, new Date(NOW - 3600e3), new Date(NOW - 3600e3));   // the folder too: the real clock is after NOW, and a future mtime would make it young whatever the rule
    ageGit(w.young.wt, 0.04);
    fs.writeFileSync(path.join(s.data, 'heavy-run.3.lock'), JSON.stringify({ pid: process.pid, tree: w.locked.wt.toLowerCase(), token: 't' }));
    const paneText = JSON.stringify({ cwd: 'elsewhere', message: `cd ${w.pane.wt} && git status` });   // a transcript line: JSON doubles the backslashes
    const p = J.plan(s.opts({ paneText: () => paneText }));
    assert.deepEqual(p.classes.e, []);
    const why = Object.fromEntries(Object.entries(p.kept.e).flatMap(([r, xs]) => xs.map((x) => [x, r])));
    assert.match(why[w.dirty.wt], /not clean/);
    assert.match(why[w.untracked.wt], /not clean/);
    assert.match(why[w.unlanded.wt], /not in main/);
    assert.match(why[w.locked.wt], /heavy-run lock/);
    assert.match(why[w.linked.wt], /link/);
    assert.match(why[w.young.wt], /young/);
    assert.match(why[w.pane.wt], /live pane/);
    J.apply(p, s.opts());
    for (const k of Object.keys(w)) assert.equal(fs.existsSync(w[k].wt), true, k);
    assert.equal(fs.existsSync(outside), true, 'the junction\'s target survives');
  } finally { scratch.rm(s.root); }
});

test('(e) a live pane\'s own working directory is never a candidate', () => {
  const s = sandbox();
  try {
    const w = repoWithWorktree(s, 'seat', true); ageWt(w.wt, 3);
    const p = J.plan(s.opts({ paneDirs: [w.wt] }));
    assert.deepEqual(p.classes.e, []); assert.deepEqual(p.kept.e['a live pane is working in it'], [w.wt]);
    assert.deepEqual(paths(J.plan(s.opts()).classes.e), [w.wt], 'control: with no pane there, it is a candidate');
  } finally { scratch.rm(s.root); }
});

test('(e) the act re-checks: a worktree that turned dirty after the plan is kept, never forced', () => {
  const s = sandbox();
  try {
    const w = repoWithWorktree(s, 'race', true); ageWt(w.wt, 3);
    const p = J.plan(s.opts());
    assert.deepEqual(paths(p.classes.e), [w.wt]);
    fs.writeFileSync(path.join(w.wt, 'a.txt'), 'edited since the plan');
    const r = J.apply(p, s.opts());
    assert.equal(r.done.e.n, 0);
    assert.equal(fs.readFileSync(path.join(w.wt, 'a.txt'), 'utf8'), 'edited since the plan');
    // clean but no longer landed: git itself would remove this one, so it is the re-check that keeps it
    const v = repoWithWorktree(s, 'race2', true); ageWt(v.wt, 3);
    const p2 = J.plan(s.opts());
    assert.ok(paths(p2.classes.e).includes(v.wt));
    put(path.join(v.wt, 'late.txt')); git(v.wt, 'add', 'late.txt'); git(v.wt, 'commit', '-q', '-m', 'late work');
    const r2 = J.apply({ classes: { a: [], b: [], c: [], d: [], e: p2.classes.e.filter((x) => x.path === v.wt) } }, s.opts());
    assert.equal(r2.done.e.n, 0); assert.deepEqual(r2.skipped.map((x) => x.why), ['changed since the plan']);
    assert.equal(fs.existsSync(path.join(v.wt, 'late.txt')), true);
  } finally { scratch.rm(s.root); }
});

test('(e) a worktree outside worktrees_dir is reported as a stray and never removed', () => {
  const s = sandbox();
  try {
    const w = repoWithWorktree(s, 'home', true);
    const stray = path.join(s.root, 'g-drive', 'c-stray-wt');
    git(w.repo, 'worktree', 'add', '-q', '-b', 'stray', stray); ageWt(stray, 3);
    const p = J.plan(s.opts({ worktreeRepos: [w.repo] }));
    assert.deepEqual(p.strays.map((x) => x.path), [stray]);
    assert.ok(!paths(p.classes.e).includes(stray));
    const lines = []; J.report(p, (l) => lines.push(l));
    assert.ok(lines.some((l) => l.includes(stray)), 'the report names the stray');
    J.apply(p, s.opts({ worktreeRepos: [w.repo] }));
    assert.equal(fs.existsSync(stray), true);
  } finally { scratch.rm(s.root); }
});

test('(e) a main checkout under the folder, and any worktree while a lock records no tree, are kept', () => {
  const s = sandbox();
  try {
    const w = repoWithWorktree(s, 'mainish', true); ageWt(w.wt, 3);
    assert.deepEqual(J.plan(s.opts({ mainCheckouts: [w.wt] })).kept.e['a main checkout'], [w.wt]);
    fs.writeFileSync(path.join(s.data, 'heavy-run.lock'), JSON.stringify({ pid: 1, token: 'old-style' }));
    assert.deepEqual(J.plan(s.opts()).kept.e['a heavy-run lock records no tree'], [w.wt]);
    fs.unlinkSync(path.join(s.data, 'heavy-run.lock'));
    assert.deepEqual(paths(J.plan(s.opts()).classes.e), [w.wt], 'control: with neither, it is a candidate');
  } finally { scratch.rm(s.root); }
});

test('(e) git\'s own refusal is the last line: facts that say clean cannot remove a worktree with an untracked file (no --force)', () => {
  const s = sandbox();
  try {
    const w = repoWithWorktree(s, 'liar', true); ageWt(w.wt, 3);
    const p = J.plan(s.opts());
    assert.deepEqual(paths(p.classes.e), [w.wt]);
    put(path.join(w.wt, 'work-in-progress.txt')); age(path.join(w.wt, 'work-in-progress.txt'), 3); ageWt(w.wt, 3);
    const liar = (wt) => ({ ...J.removalFacts(wt), clean: true });   // a facts reader that is wrong about cleanliness
    const r = J.apply(p, s.opts({ removalFacts: liar }));
    assert.equal(r.done.e.n, 0);
    assert.match(r.errors[0].error, /git worktree remove refused/);
    assert.equal(fs.existsSync(path.join(w.wt, 'work-in-progress.txt')), true);
  } finally { scratch.rm(s.root); }
});

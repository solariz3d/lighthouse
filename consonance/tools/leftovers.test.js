'use strict';
// leftovers.test.js — node --test consonance/tools/leftovers.test.js. D450 part 3: the counts of what runs leave on the machine. On real
// throwaway repositories (never the room's or the keeper's): registered worktrees are counted per repo, t180-* entries in Downloads that no
// repo has registered are named, fake roots are named, and only our own long-running processes are listed. The tab-proxy count is never a
// bare 0: a 0 is printed as UNCALIBRATED unless a control proxy was seen to raise the count. The window reader, the control and the process
// list are injected (the boundary); git and the file system are real.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const L = require('./leftovers.js');
const scratch = require('./scratch.js');

const git = (cwd, ...args) => { const r = spawnSync('git', args, { cwd, encoding: 'utf8' }); if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${r.stderr}`); return r.stdout.trim(); };
const put = (p, text = 'x') => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); return p; };
const repoAt = (dir) => { fs.mkdirSync(dir, { recursive: true }); git(dir, 'init', '-q', '-b', 'main'); put(path.join(dir, 'a.txt')); git(dir, 'add', 'a.txt'); git(dir, '-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', 'base'); return dir; };

/** Downloads with its repo and two of its worktrees, a second repo whose one worktree also lives in Downloads, and three leftovers. */
function fixture() {
  const root = scratch.mkdtemp('leftovers-test-');
  const downloads = path.join(root, 'Downloads'), drive = path.join(root, 'drive');
  const main = repoAt(path.join(downloads, 't180-track-builder'));
  const other = repoAt(path.join(root, 'Desktop', 't180-track-builder'));
  git(main, 'worktree', 'add', '-q', '-b', 'a', path.join(downloads, 't180-wt-a'));
  git(main, 'worktree', 'add', '-q', '-b', 'b', path.join(downloads, 't180-wt-b'));
  git(other, 'worktree', 'add', '-q', '-b', 'd', path.join(downloads, 't180-wt-d'));
  fs.mkdirSync(path.join(downloads, 't180-old'));                                    // a folder no repo registers
  put(path.join(downloads, 't180-notes.txt'));                                       // a loose file
  put(path.join(downloads, 't180-gone', '.git'), 'gitdir: ' + path.join(main, '.git', 'worktrees', 'removed-long-ago'));   // a dangling .git file
  fs.mkdirSync(path.join(downloads, 'unrelated'));
  fs.mkdirSync(path.join(drive, 'fake-ac1'), { recursive: true }); fs.mkdirSync(path.join(drive, 'fakeish'));
  const now = Date.parse('2026-10-24T22:00:00Z'), ago = (min) => now - min * 60000;
  const procs = [
    { pid: 11, ppid: 1, name: 'tail.exe', started: ago(60 * 24 * 10), cmd: 'tail -n +1 -F /c/users/x/appdata/local/temp/claude/c--consonance-instances-sibling-07b8a48f/s/tasks/b1.output' },
    { pid: 12, ppid: 1, name: 'node.exe', started: ago(5), cmd: 'node c:\\users\\x\\desktop\\lighthouse\\consonance\\tools\\js-suite.js' },
    { pid: 13, ppid: 1, name: 'claude.exe', started: ago(60 * 24 * 3), cmd: 'c:\\users\\x\\.local\\bin\\claude.exe --resume 1 --mcp-config c:\\consonance\\data\\mcp.json' },
    { pid: 14, ppid: 1, name: 'node.exe', started: ago(60 * 24 * 3), cmd: 'node c:\\users\\x\\desktop\\lighthouse\\dev\\stick-waiter.js --data c:\\consonance\\data' },
    { pid: 15, ppid: 1, name: 'chrome.exe', started: ago(60 * 5), cmd: '"c:\\program files\\google\\chrome\\application\\chrome.exe"' },
    { pid: 16, ppid: 1, name: 'chrome.exe', started: ago(60 * 5), cmd: 'chrome.exe --headless=new --mute-audio --user-data-dir=c:\\users\\x\\appdata\\local\\temp\\t180snd-1' },
    { pid: 17, ppid: 1, name: 'conhost.exe', started: ago(60 * 24 * 3), cmd: '\\\\?\\c:\\windows\\system32\\conhost.exe --headless --width 120 --height 34' },
  ];
  return { root, downloads, drive, main, other, now, procs };
}
const run = (f, windows, control) => L.survey({
  downloads: f.downloads,
  repos: [{ label: 'Downloads', dir: f.main }, { label: 'Desktop', dir: f.other }],
  roots: [f.drive], now: f.now, minAgeMin: 120,
  readWindows: () => windows, makeControl: () => control, listProcesses: () => f.procs,
});

test('the counts: worktrees per repo, unregistered t180-* entries, fake roots, our long-running processes, and a proxy count it has read', () => {
  const f = fixture();
  try {
    const o = run(f, { proxies: 2, titles: { 'zz-headless-test': 2 }, trays: 1 }, null);
    assert.deepEqual(o.worktrees.map((w) => [w.label, w.linked]), [['Downloads', 2], ['Desktop', 1]]);
    assert.deepEqual(o.strays.map((s) => s.name), ['t180-gone', 't180-notes.txt', 't180-old']);
    assert.deepEqual(o.fakeRoots.map((p) => path.basename(p)), ['fake-ac1']);
    assert.deepEqual(o.processes.map((p) => p.pid), [11, 16]);                 // the 10-day tail and the 5-hour headless Chrome; not the seat, the stick-waiter, his Chrome, a seat's pseudo-console or the 5-minute suite
    assert.equal(o.processes[0].seat, 'sibling-07b8a48f');
    assert.deepEqual([o.proxies.state, o.proxies.count], ['CALIBRATED', 2]);
    assert.match(L.report(o), /tab proxies\s+2 /);
  } finally { scratch.rm(f.root); }
});

test('a proxy read of 0 is printed as UNCALIBRATED, never as 0, when no control proxy raised the count', () => {
  const f = fixture();
  try {
    const o = run(f, { proxies: 0, titles: {}, trays: 1 }, { before: 0, during: 0, after: 0 });
    assert.deepEqual([o.proxies.state, o.proxies.count], ['UNCALIBRATED', null]);
    const text = L.report(o);
    assert.match(text, /tab proxies\s+UNCALIBRATED/);
    assert.doesNotMatch(text, /tab proxies\s+0\b/);
  } finally { scratch.rm(f.root); }
});

test('a proxy read of 0 from an enumerator that cannot see the taskbar says it is blind', () => {
  const f = fixture();
  try {
    const o = run(f, { proxies: 0, titles: {}, trays: 0 }, { before: 0, during: 0, after: 0 });
    assert.equal(o.proxies.state, 'UNCALIBRATED');
    assert.match(L.report(o), /tab proxies\s+UNCALIBRATED \(read 0, and the window enumerator saw no taskbar window\)/);
  } finally { scratch.rm(f.root); }
});

test('a proxy read of 0 counts once a control proxy was seen to raise the count and leave again', () => {
  const f = fixture();
  try {
    const o = run(f, { proxies: 0, titles: {}, trays: 1 }, { before: 0, during: 1, after: 0 });
    assert.deepEqual([o.proxies.state, o.proxies.count], ['CALIBRATED', 0]);
    assert.match(L.report(o), /tab proxies\s+0 \(calibrated: a control proxy raised the count 0 → 1 → 0\)/);
  } finally { scratch.rm(f.root); }
});

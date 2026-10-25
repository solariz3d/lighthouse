'use strict';
// leftovers.test.js — node --test consonance/tools/leftovers.test.js. D450 part 3: the counts of what runs leave on the machine. On real
// throwaway repositories (never the room's or the keeper's): registered worktrees are counted per repo, app-* entries in Downloads that no
// repo has registered are named, fake roots are named, and only our own long-running processes are listed. The tab-proxy count is never a
// bare 0: a 0 is printed as UNCALIBRATED unless a control proxy was seen to raise the count. The window reader, the control and the process
// list are injected (the boundary); git and the file system are real.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
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
  const main = repoAt(path.join(downloads, 'app-main'));
  const other = repoAt(path.join(root, 'Desktop', 'app-main'));
  git(main, 'worktree', 'add', '-q', '-b', 'a', path.join(downloads, 'app-wt-a'));
  git(main, 'worktree', 'add', '-q', '-b', 'b', path.join(downloads, 'app-wt-b'));
  git(other, 'worktree', 'add', '-q', '-b', 'd', path.join(downloads, 'app-wt-d'));
  fs.mkdirSync(path.join(downloads, 'app-old'));                                    // a folder no repo registers
  put(path.join(downloads, 'app-notes.txt'));                                       // a loose file
  put(path.join(downloads, 'app-gone', '.git'), 'gitdir: ' + path.join(main, '.git', 'worktrees', 'removed-long-ago'));   // a dangling .git file
  fs.mkdirSync(path.join(downloads, 'unrelated'));
  fs.mkdirSync(path.join(drive, 'fake-ac1'), { recursive: true }); fs.mkdirSync(path.join(drive, 'fakeish'));
  const now = Date.parse('2026-10-24T22:00:00Z'), ago = (min) => now - min * 60000;
  // AMENDED D454 part 2 (pane C): pids 12 and 14 ran from the original room's lighthouse folder, which is no longer ours unless given;
  // they now run from a given repo, so the age rule (12) and the infrastructure rule (14) are still what keeps them off the list.
  const procs = [
    { pid: 11, ppid: 1, name: 'tail.exe', started: ago(60 * 24 * 10), cmd: 'tail -n +1 -F /c/users/x/appdata/local/temp/claude/c--consonance-instances-sibling-07b8a48f/s/tasks/b1.output' },
    { pid: 12, ppid: 1, name: 'node.exe', started: ago(5), cmd: `node ${path.join(main, 'consonance', 'tools', 'js-suite.js')}` },
    // D454 part 2: the command lines carry no drive letter (portable-paths); they are strings the rules read, never paths opened
    { pid: 13, ppid: 1, name: 'claude.exe', started: ago(60 * 24 * 3), cmd: '/users/x/.local/bin/claude.exe --resume 1 --mcp-config /data/mcp.json' },
    { pid: 14, ppid: 1, name: 'node.exe', started: ago(60 * 24 * 3), cmd: `node ${path.join(main, 'dev', 'stick-waiter.js')}` },
    { pid: 15, ppid: 1, name: 'chrome.exe', started: ago(60 * 5), cmd: '"/program files/google/chrome/application/chrome.exe"' },
    { pid: 16, ppid: 1, name: 'chrome.exe', started: ago(60 * 5), cmd: 'chrome.exe --headless=new --mute-audio --user-data-dir=/users/x/appdata/local/temp/appsnd-1' },
    { pid: 17, ppid: 1, name: 'conhost.exe', started: ago(60 * 24 * 3), cmd: '/windows/system32/conhost.exe --headless --width 120 --height 34' },
  ];
  return { root, downloads, drive, main, other, now, procs };
}
// AMENDED D454 part 2 (pane C): the strays folder and its prefix are now given (`strays`), not read from <home>/Downloads; the rule
// changed so the tool fits a machine that has neither the keeper's repos nor a Downloads folder. The counts asserted below are unchanged.
const run = (f, windows, control) => L.survey({
  strays: { dir: f.downloads, prefix: 'app-' },
  repos: [{ label: 'Downloads', dir: f.main }, { label: 'Desktop', dir: f.other }],
  roots: [f.drive], now: f.now, minAgeMin: 120,
  readWindows: () => windows, makeControl: () => control, listProcesses: () => f.procs,
});

test('the counts: worktrees per repo, unregistered app-* entries, fake roots, our long-running processes, and a proxy count it has read', () => {
  const f = fixture();
  try {
    const o = run(f, { proxies: 2, titles: { 'zz-headless-test': 2 }, trays: 1 }, null);
    assert.deepEqual(o.worktrees.map((w) => [w.label, w.linked]), [['Downloads', 2], ['Desktop', 1]]);
    assert.deepEqual(o.strays.map((s) => s.name), ['app-gone', 'app-notes.txt', 'app-old']);
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

// D454 part 2 (pane C): the consumer ships this tool to machines that have none of the original room's paths.
const noConfigHome = () => scratch.mkdtemp('leftovers-home-');   // a home with no ~/.consonance.json
const cfgHome = (cfg) => { const h = noConfigHome(); fs.writeFileSync(path.join(h, '.consonance.json'), '﻿' + JSON.stringify(cfg)); return h; };

test('with no repos and no strays folder given, it counts its own repository and says the stray scan was not run, naming nothing of the original machine', () => {
  const home = noConfigHome();
  const o = L.survey({ home, roots: [], now: Date.parse('2026-10-24T22:00:00Z'), readWindows: () => ({ proxies: 0, titles: {}, trays: 1 }),
    makeControl: () => ({ before: 0, during: 0, after: 0 }), listProcesses: () => [] });
  const own = path.resolve(__dirname, '..', '..');
  assert.deepEqual(o.worktrees.map((w) => path.resolve(w.dir)), [own]);
  assert.notEqual(o.worktrees[0].linked, null, 'its own repository could not be read: ' + o.worktrees[0].error);
  assert.equal(o.strays, null);
  const text = L.report(o);
  assert.match(text, /strays\s+not scanned \(give --strays <folder> --prefix <name>-\)/);
  assert.doesNotMatch(text, /t180|Downloads/i);
  scratch.rm(home);
});

// D454 part 2, the cold read's 1C.5: the repo roots and the strays come from config when no flag gives them
test('the leftovers key of ~/.consonance.json supplies the repos, the names-only repos and the strays, and what is passed in wins over it', () => {
  const f = fixture();
  const home = cfgHome({ leftovers: { repos: [f.main], repo_names: [f.other], strays: { dir: f.downloads, prefix: 'app-' } } });
  try {
    const base = { home, roots: [], now: f.now, readWindows: () => ({ proxies: 1, titles: {}, trays: 1 }), makeControl: () => null, listProcesses: () => [] };
    const o = L.survey(base);
    assert.deepEqual(o.worktrees.map((w) => [path.resolve(w.dir), w.linked]), [[path.resolve(f.main), 2], [path.resolve(f.other), 1]]);
    assert.deepEqual(o.strays.map((s) => s.name), ['app-gone', 'app-notes.txt', 'app-old']);
    assert.deepEqual(L.configFrom(home).repos.map((r) => !!r.namesOnly), [false, true], 'repo_names did not come through as names-only');
    // each passed value alone, so the config is read for the other
    const r = L.survey({ ...base, repos: [{ label: 'x', dir: f.other }] });
    assert.deepEqual(r.worktrees.map((w) => path.resolve(w.dir)), [path.resolve(f.other)], 'a passed repo list did not replace the config');
    // the configured strays scan still runs; main and its two worktrees are strays now, because no given repo registers them
    assert.deepEqual(r.strays.map((x) => x.name), ['app-gone', 'app-main', 'app-notes.txt', 'app-old', 'app-wt-a', 'app-wt-b'], 'the configured strays were lost when only repos were passed');
    const s = L.survey({ ...base, strays: null });
    assert.equal(s.strays, null, 'strays: null passed in did not switch the configured scan off');
    assert.equal(s.worktrees.length, 2, 'the configured repos were lost when only strays were passed');
  } finally { scratch.rm(f.root); scratch.rm(home); }
});

test('a leftovers key of the wrong shape is refused by name, and an unreadable config falls back to the neutral default', () => {
  for (const bad of [{ leftovers: 'yes' }, { leftovers: { repos: 'one' } }, { leftovers: { strays: { dir: 'x' } } }]) {
    const home = cfgHome(bad);
    try { assert.throws(() => L.configFrom(home), /~\/\.consonance\.json "leftovers"/, JSON.stringify(bad)); } finally { scratch.rm(home); }
  }
  const home = noConfigHome();
  try {
    fs.writeFileSync(path.join(home, '.consonance.json'), '{ not json');
    assert.deepEqual(L.configFrom(home), {});
  } finally { scratch.rm(home); }
});

test('a process counts as ours when it runs in a given repo, one of its registered worktrees, the strays folder or the scratch root, and not in a folder it was not given', () => {
  const f = fixture();
  // the fixture itself lives under the scratch root, which is ours by rule; move the root for this survey so the other rules are what decide
  const was = process.env.CONSONANCE_SCRATCH, elsewhere = path.join(os.tmpdir(), 'leftovers-test-not-the-scratch-root');   // never created: only a name
  process.env.CONSONANCE_SCRATCH = elsewhere;
  try {
    const old = Date.parse('2026-10-24T10:00:00Z');
    const p = (pid, cmd) => ({ pid, ppid: 1, name: 'node.exe', started: old, cmd });
    f.procs = [p(21, `node ${path.join(f.downloads, 'app-wt-a', 'serve.js')}`), p(22, `node ${path.join(f.other, 'x.js')}`),
      p(23, `node ${path.join(f.downloads, 'app-old', 'y.js')}`), p(24, 'node /users/x/projects/elsewhere/z.js'),
      p(25, 'node /users/x/desktop/lighthouse/consonance/tools/js-suite.js'), p(26, `node ${path.join(elsewhere, 'run-1', 'w.js')}`),
      p(27, `node ${path.join(f.downloads, 'unrelated', 'v.js')}`)];
    assert.deepEqual(run(f, { proxies: 1, titles: {}, trays: 1 }, null).processes.map((x) => x.pid).sort(), [21, 22, 23, 26]);
  } finally { if (was === undefined) delete process.env.CONSONANCE_SCRATCH; else process.env.CONSONANCE_SCRATCH = was; scratch.rm(f.root); }
});

test('a names-only repo is counted from the names in its worktrees folder, and none of its worktree entries is opened', () => {
  const f = fixture();
  try {
    const opened = [], real = fs.readFileSync;
    fs.readFileSync = function (p, ...rest) { opened.push(String(p)); return real.call(fs, p, ...rest); };
    let o;
    try {
      o = L.survey({ repos: [{ label: 'Downloads', dir: f.main }, { label: 'Desktop', dir: f.other, namesOnly: true }], roots: [], now: f.now,
        readWindows: () => ({ proxies: 1, titles: {}, trays: 1 }), makeControl: () => null, listProcesses: () => [] });
    } finally { fs.readFileSync = real; }
    assert.deepEqual(o.worktrees.map((w) => [w.label, w.linked]), [['Downloads', 2], ['Desktop', 1]]);
    const inside = path.join(f.other, '.git', 'worktrees').toLowerCase();
    assert.deepEqual(opened.filter((p) => p.toLowerCase().startsWith(inside)), [], 'a file inside the names-only repo\'s worktrees folder was opened');
    assert.ok(opened.some((p) => p.toLowerCase().startsWith(path.join(f.main, '.git', 'worktrees').toLowerCase())), 'the control: the other repo\'s entries are read');
  } finally { scratch.rm(f.root); }
});

test('a repo given as one of its own linked worktrees (.git is a file there) counts the main repository\'s registered worktrees', () => {
  const f = fixture();
  try {
    const o = L.survey({ repos: [{ label: 'wt', dir: path.join(f.downloads, 'app-wt-a') }], strays: { dir: f.downloads, prefix: 'app-' }, roots: [], now: f.now,
      readWindows: () => ({ proxies: 1, titles: {}, trays: 1 }), makeControl: () => null, listProcesses: () => [] });
    assert.deepEqual(o.worktrees.map((w) => [w.label, w.linked]), [['wt', 2]]);
    assert.deepEqual(o.strays.map((s) => s.name), ['app-gone', 'app-main', 'app-notes.txt', 'app-old', 'app-wt-d']);   // main and d belong to repos not given
  } finally { scratch.rm(f.root); }
});

test('a PowerShell JSON line with a raw control character inside a string still parses, and the character is kept', () => {
  // D454 part 2: on 2026-10-25 a live process's command line carried one, Windows PowerShell 5.1's ConvertTo-Json left it raw, and the run died
  const raw = '{"rows":[{"pid":5,"cmd":"node a.js \u0007 \u001b[0m x"}],"n":1}';
  assert.throws(() => JSON.parse(raw));
  assert.deepEqual(L.parsePsLine(raw), { rows: [{ pid: 5, cmd: 'node a.js \u0007 \u001b[0m x' }], n: 1 });
  assert.throws(() => L.parsePsLine('not json'), /JSON/);
});

test('the CLI refuses a flag it does not know and --strays without --prefix, and says why', () => {
  const tool = path.join(__dirname, 'leftovers.js');
  for (const [args, why] of [[['--downloads', 'x'], /unknown flag --downloads/], [['--strays', 'x'], /--strays needs --prefix/]]) {
    const r = spawnSync(process.execPath, [tool, ...args], { encoding: 'utf8' });
    assert.equal(r.status, 1, args.join(' '));
    assert.match(r.stderr, why);
  }
});

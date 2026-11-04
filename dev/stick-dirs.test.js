// stick-dirs.test.js — D273 lap 5 (cold read 2, A5): ARRIVING.ps1 names the data folder by the same rule as the hooks and the app
// (consonance/hooks/dirs.test.js; main.rs set_dirs / default_data): ~/.consonance.json's data_dir when set (trimmed), else %USERPROFILE%\.consonance.
// It used to print a hard-coded C:\Consonance\data, which on a stranger's machine names a folder the app never writes. The rule lives once in the
// script, between "# D273 data: begin" and "# D273 data: end", and this runs THAT text in a real PowerShell against a temp home. Rows:
//   1  the block is there, it is the only data-folder text in the script, and the script no longer names C:\Consonance anywhere in its code
//   2  no config: %USERPROFILE%\.consonance; a config naming data_dir (BOM, padding): that folder, trimmed; blank, non-string or not JSON: the default
// Run: node --test dev/stick-dirs.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ARRIVING = path.join(__dirname, 'ARRIVING.ps1');
const text = () => fs.readFileSync(ARRIVING, 'utf8').replace(/\r\n/g, '\n');
const blockOf = (t) => { const a = t.indexOf('# D273 data: begin'), b = t.indexOf('# D273 data: end'); return a < 0 || b < 0 ? null : t.slice(a, b + '# D273 data: end'.length); };
const PS = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');

/** The block, run in PowerShell with USERPROFILE = home; prints $data. */
function resolve(home) {
  const f = path.join(home, '..', path.basename(home) + '-probe.ps1');
  fs.writeFileSync(f, blockOf(text()) + '\nWrite-Output $data\n');
  let r;
  try { r = spawnSync(PS, ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', f], { encoding: 'utf8', timeout: 30000, env: { ...process.env, USERPROFILE: home } }); }
  finally { fs.rmSync(f, { force: true }); } // D287: the probe script is a SIBLING of the home folder, so removing the folder never removed it
  assert.strictEqual(r.status, 0, r.stderr);
  return r.stdout.replace(/\r?\n$/, '');
}
const home = (cfg) => { const d = require('../consonance/tools/scratch.js').mkdtemp('stick-home-'); if (cfg !== undefined) fs.writeFileSync(path.join(d, '.consonance.json'), cfg); return d; };

test('row 1: the D273 data block is in ARRIVING.ps1, and its code names no C:\\Consonance path', () => {
  const t = text();
  assert.ok(blockOf(t), 'the block is there');
  assert.ok(!/C:\\Consonance/i.test(t.split('\n').filter((l) => !/^\s*#/.test(l)).join('\n')), 'no C:\\Consonance outside comments');
  assert.match(t, /persist\.log/, 'the RESUMED line still names persist.log');
  assert.match(t, /Join-Path \$data 'persist\.log'/, 'and names it under the resolved folder');
});

test('row 2: no config gives %USERPROFILE%\\.consonance; a named data_dir is used, trimmed; blank, non-string or not JSON falls back', () => {
  const none = home();
  assert.strictEqual(resolve(none), path.join(none, '.consonance'));
  const named = home('\uFEFF' + JSON.stringify({ data_dir: '  D:\\X\\data  ', room_path: 'C:\\r\\exo_memory\\BOOT.md' }));
  assert.strictEqual(resolve(named), 'D:\\X\\data');
  for (const cfg of [JSON.stringify({ data_dir: '   ' }), JSON.stringify({ data_dir: 7 }), '{ not json']) {
    const d = home(cfg);
    assert.strictEqual(resolve(d), path.join(d, '.consonance'), cfg);
    fs.rmSync(d, { recursive: true, force: true });
  }
  for (const d of [none, named]) fs.rmSync(d, { recursive: true, force: true });
});

// Row 3 (D454, E's part 3): GUIDE says nothing is written by `-DryRun`, but the script pulled before its dry-run exit. The whole
// script runs here against a temp home whose room_path names a clone one commit behind its upstream, with a stub tail-carry.js;
// after the dry run the clone's HEAD, its origin/main (a pull fetches first), its reflog and its status are what they were before.
test('row 3: a dry run does not pull or otherwise touch the repo', () => {
  const root = require('../consonance/tools/scratch.js').mkdtemp('stick-dry-');
  const git = (cwd, ...a) => { const r = spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, encoding: 'utf8' }); assert.strictEqual(r.status, 0, r.stderr); return r.stdout.trim(); };
  try {
    const up = path.join(root, 'up'), repo = path.join(root, 'repo'), stick = path.join(root, 'stick'), h = path.join(root, 'home');
    for (const d of [up, stick, h]) fs.mkdirSync(d);
    git(up, 'init', '-q', '-b', 'main');
    fs.mkdirSync(path.join(up, 'dev'));
    fs.writeFileSync(path.join(up, 'dev', 'tail-carry.js'), '// stub: the rehearsal prints no verdicts\n');
    git(up, 'add', '.'); git(up, 'commit', '-q', '-m', 'one');
    git(root, 'clone', '-q', up, repo);
    fs.writeFileSync(path.join(up, 'later.txt'), 'two\n');
    git(up, 'add', '.'); git(up, 'commit', '-q', '-m', 'two');
    fs.copyFileSync(ARRIVING, path.join(stick, 'ARRIVING.ps1'));
    fs.writeFileSync(path.join(h, '.consonance.json'), JSON.stringify({ room_path: path.join(repo, 'exo_memory', 'BOOT.md') }));
    const before = { head: git(repo, 'rev-parse', 'HEAD'), origin: git(repo, 'rev-parse', 'origin/main'), reflog: git(repo, 'reflog'), status: git(repo, 'status', '--porcelain') };
    const r = spawnSync(PS, ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(stick, 'ARRIVING.ps1'), '-DryRun'],
      { encoding: 'utf8', timeout: 60000, env: { ...process.env, USERPROFILE: h } });
    assert.strictEqual(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, /dry run only - nothing written/, 'it reached the dry-run exit');
    assert.deepStrictEqual({ head: git(repo, 'rev-parse', 'HEAD'), origin: git(repo, 'rev-parse', 'origin/main'), reflog: git(repo, 'reflog'), status: git(repo, 'status', '--porcelain') }, before);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

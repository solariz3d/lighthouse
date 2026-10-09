// dream-dirs.test.js — D273 lap 6 (cold read 3, A1): dream_cycle.ps1 finds the instances folder by THE APP'S OWN RULE (main.rs set_dirs /
// default_instances; the hooks' consonance/hooks/dirs.test.js): ~/.consonance.json's instances_dir when set (trimmed), else
// %USERPROFILE%\claude-instances. It used to be a hard-coded C:\Consonance\instances, which on a stranger's machine named nothing, so the cycle
// exited "dreamless" on a machine full of instances. The rule lives once in the script, between "# D273 instances: begin" and
// "# D273 instances: end", and this runs THAT text in a real PowerShell against a temp home. Rows:
//   1  the block is there, and the script's code no longer names C:\Consonance anywhere
//   2  no config: %USERPROFILE%\claude-instances; a named instances_dir (BOM, padding): that folder, trimmed; blank, non-string or not JSON: the default
// Run: node --test dev/dream/dream-dirs.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const SCRIPT = path.join(__dirname, 'dream_cycle.ps1');
const text = () => fs.readFileSync(SCRIPT, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
const blockOf = (t) => { const a = t.indexOf('# D273 instances: begin'), b = t.indexOf('# D273 instances: end'); return a < 0 || b < 0 ? null : t.slice(a, b + '# D273 instances: end'.length); };
const PS = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');

/** The block, run in PowerShell with USERPROFILE = home; prints $root. */
function resolve(home) {
  const f = path.join(path.dirname(home), path.basename(home) + '-probe.ps1');
  fs.writeFileSync(f, blockOf(text()) + '\nWrite-Output $root\n');
  const r = spawnSync(PS, ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', f], { encoding: 'utf8', timeout: 30000, env: { ...process.env, USERPROFILE: home } });
  assert.strictEqual(r.status, 0, r.stderr);
  return r.stdout.replace(/\r?\n$/, '');
}
const home = (cfg) => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'dream-home-')); if (cfg !== undefined) fs.writeFileSync(path.join(d, '.consonance.json'), cfg); return d; };

test('row 1: the D273 instances block is in dream_cycle.ps1, and its code names no C:\\Consonance path', () => {
  const t = text();
  assert.ok(blockOf(t), 'the block is there');
  assert.ok(!/C:\\Consonance/i.test(t.split('\n').filter((l) => !/^\s*#/.test(l)).join('\n')), 'no C:\\Consonance outside comments');
});

test('row 2: no config gives %USERPROFILE%\\claude-instances; a named instances_dir is used, trimmed; blank, non-string or not JSON falls back', () => {
  const none = home();
  assert.strictEqual(resolve(none), path.join(none, 'claude-instances'));
  const named = home('\uFEFF' + JSON.stringify({ instances_dir: '  D:\\X\\inst  ', dream_model: 'm' }));
  assert.strictEqual(resolve(named), 'D:\\X\\inst');
  for (const cfg of [JSON.stringify({ instances_dir: '   ' }), JSON.stringify({ instances_dir: 7 }), '{ not json']) {
    const d = home(cfg);
    assert.strictEqual(resolve(d), path.join(d, 'claude-instances'), cfg);
    fs.rmSync(d, { recursive: true, force: true });
  }
  for (const d of [none, named]) fs.rmSync(d, { recursive: true, force: true });
});

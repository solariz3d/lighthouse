#!/usr/bin/env node
'use strict';
// install-holds.mutants.js - run with: node consonance/tools/install-holds.mutants.js [--only <n>]     (Lap I, I7; holds the heavy-run lock itself)
//
// A GREEN SUITE IS A CLAIM ABOUT THE TESTS, NOT ABOUT THE CODE. A dated hold in dev/shell/install.ps1 is a ruling the installer enforces; a wrong
// line installs and registers a hook against the ruling on the one machine it names, which is what happened before I7 existed. The spec's three
// rows (00_lap_i_spec.md:441-442: the hold tested after ABSENT, HoldOn ignored, the registration skip removed) and four more, each required to
// turn dev/shell/install-holds.test.js RED.
// THE TRACKED SOURCES ARE NEVER WRITTEN. A temp tree mirrors what the suite reads (dev/shell with its lib and hooks, consonance/hooks, and the two
// tools it requires); install.ps1 in the copy is mutated, the copy's suite runs (it builds its own throwaway repos and homes from the copy), the
// tree is removed. Every anchor must occur EXACTLY ONCE or the row is NOT APPLIED (counted as such, never as a catch).
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const SRC = 'dev/shell/install.ps1', SUITE = 'dev/shell/install-holds.test.js';

const MUTANTS = [
  ['the hold tested AFTER the ABSENT branch (a never-installed held file is copied)', SRC, '  if ($hold) {\n    Write-Host (Format-Hold $f.To $hold)', '  if ($hold -and (Test-Path $dst)) {\n    Write-Host (Format-Hold $f.To $hold)'],
  ['HoldOn ignored (a hold on D holds on L too)', SRC, "  if ($row.HoldOn -and -not (@($row.HoldOn) -contains $hereTag)) { return $null }\n", ''],
  ['the registration skip removed (a held hook is registered)', SRC, "  # Lap I, I7: a dated hold here keeps the registration out too, live or expired, and the run says so\n  if ($heldLeaf", "  # Lap I, I7: a dated hold here keeps the registration out too, live or expired, and the run says so\n  if ($false -and $heldLeaf"],
  ['-Check reports a held entry as DECLARED, NOT REGISTERED', SRC, 'if ($heldLeaf.ContainsKey($lf)) { $heldReg +=', 'if ($false) { $heldReg +='],
  ['HoldUntil ignored (an endless hold)', SRC, 'if ($row.HoldUntil) { $expired =', 'if ($false) { $expired ='],
  ['the clock seam ignored (today is always the real day)', SRC, 'if ($env:CONSONANCE_INSTALL_NOW) { $today =', 'if ($false) { $today ='],
  ['a dated hold is counted as a two-way conflict again (the summary tells the reader to drop it)', SRC, "else { $heldDated += (\"{0}{1}\" -f (Split-Path -Leaf $f.To), $(if ($hold.Until) { \" until $($hold.Until)\" } else { '' })) }", 'else { $held++ }'],
  ['an expired hold lets the run write', SRC, '  if ($hold) {\n    Write-Host (Format-Hold $f.To $hold)', '  if ($hold -and -not $hold.Expired) {\n    Write-Host (Format-Hold $f.To $hold)'],
];

function copyDir(from, to, filter = () => true) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) if (e.isFile() && filter(e.name)) fs.copyFileSync(path.join(from, e.name), path.join(to, e.name));
}
function tree() {
  const dir = require('./scratch.js').mkdtemp('ih-mut-');
  copyDir(path.join(ROOT, 'dev', 'shell'), path.join(dir, 'dev', 'shell'), (n) => /\.(ps1|py|js)$/.test(n));
  for (const rel of ['dev/shell/lib', 'dev/shell/hooks', 'consonance/hooks']) copyDir(path.join(ROOT, ...rel.split('/')), path.join(dir, ...rel.split('/')));
  copyDir(path.join(ROOT, 'consonance', 'tools'), path.join(dir, 'consonance', 'tools'), (n) => n === 'scratch.js' || n === 'landed-live.js');
  return dir;
}
function run(dir) {
  const env = { ...process.env }; for (const k of Object.keys(env)) if (/^CONSONANCE_/.test(k)) delete env[k];
  const r = spawnSync(process.execPath, ['--test', '--test-concurrency=1', path.join(dir, ...SUITE.split('/'))], { encoding: 'utf8', env, timeout: 30 * 60 * 1000, windowsHide: true });
  const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''), n = (k) => Number((o.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) || [])[1]);
  return { pass: n('pass'), fail: n('fail') };
}

function main() {
  require('./heavy-run.js').hold({ cmd: 'install-holds.mutants' });   // ONE HEAVY RUNNER PER TREE
  const onlyAt = process.argv.indexOf('--only'), only = onlyAt > 0 ? Number(process.argv[onlyAt + 1]) : null;
  const read = (f) => fs.readFileSync(path.join(ROOT, ...f.split('/')), 'utf8').replace(/\r\n/g, '\n');
  const control = (() => { const d = tree(); try { return run(d); } finally { fs.rmSync(d, { recursive: true, force: true }); } })();
  console.log(`control (unmutated copy)                              pass ${control.pass} fail ${control.fail}`);
  if (!(control.fail === 0 && control.pass > 0)) { console.log('CONTROL NOT GREEN - no mutant result means anything'); process.exitCode = 1; return; }
  let applied = 0, caught = 0, notApplied = 0;
  MUTANTS.forEach(([name, file, anchor, repl], i) => {
    if (only != null && only !== i + 1) return;
    const src = read(file), hits = src.split(anchor).length - 1, label = `${String(i + 1).padStart(2)} ${name}`.padEnd(96);
    if (hits !== 1) { notApplied++; console.log(`${label} NOT APPLIED (anchor found ${hits} times)`); return; }
    applied++;
    const d = tree();
    try {
      fs.writeFileSync(path.join(d, ...file.split('/')), src.replace(anchor, () => repl));
      const r = run(d), ok = r.fail > 0; if (ok) caught++;
      console.log(`${label} pass ${r.pass} fail ${r.fail}  ${ok ? 'CAUGHT' : 'SURVIVED'}`);
    } finally { fs.rmSync(d, { recursive: true, force: true }); }
  });
  console.log(`\n${applied} applied · ${caught} caught · ${applied - caught} survived · ${notApplied} NOT APPLIED`);
  if (applied - caught > 0 || notApplied > 0) process.exitCode = 1;
}

main();

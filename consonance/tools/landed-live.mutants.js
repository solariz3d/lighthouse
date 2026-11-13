#!/usr/bin/env node
'use strict';
// landed-live.mutants.js - run with: node consonance/tools/landed-live.mutants.js [--only <n>]     (Lap I, I1; holds the heavy-run lock itself)
//
// A GREEN SUITE IS A CLAIM ABOUT THE TESTS, NOT ABOUT THE CODE. landed-live.js decides whether a seat is told a landed change is live; a wrong line
// prints LIVE over a stale copy (the false green the second readers found) or OWED over a file nobody runs. The spec's six rows
// (00_lap_i_spec.md:153-154) and the second reader's per-line parse (:856), each required to turn landed-live.test.js RED.
// THE TRACKED SOURCES ARE NEVER WRITTEN. A temp tree mirrors what the suite reads (the tool, its test, scratch.js); the copy is mutated, the copy's
// suite runs, the tree is removed. The suite reads real history from this repository (git show) and runs from the copy, so LANDED_REPO is unused.
// Every anchor must occur EXACTLY ONCE or the row is NOT APPLIED (counted as such, never as a catch).
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const HERE = __dirname, ROOT = path.join(HERE, '..', '..');
const SRC = 'landed-live.js', SUITE = 'landed-live.test.js';

const MUTANTS = [
  ['ABSENT read as LIVE (a registered, missing file is not owed)', SRC, "      } else if (!me.present) row.state = 'OWED';", "      } else if (!me.present) row.state = 'LIVE';"],
  ['the LEAF, not the exact installed path, decides what runs here', SRC, 'const runsAt = (to) => cmds.some((c) => normPath(c.path) === installedAt(to));', 'const runsAt = (to) => cmds.some((c) => leaf(c.path) === leaf(to));'],
  ['By ignored (a Lib never runs here)', SRC, "const runHere = f.Lib ? by.some((b) => { const h = man.files.find((x) => leaf(x.To) === b.toLowerCase()); return h && runsAt(h.To); }) : runsAt(f.To);", 'const runHere = f.Lib ? false : runsAt(f.To);'],
  ['require neighbours skipped (the L0020 trap)', SRC, "        if (stale.length) { row.state = 'OWED';", "        if (false) { row.state = 'OWED';"],
  ['HoldUntil ignored (an endless hold)', SRC, "      if (until && t > until) { row.state = 'HOLD EXPIRED';", "      if (false) { row.state = 'HOLD EXPIRED';"],
  ['HoldOn ignored (a hold on D holds on L too)', SRC, " && (!f.HoldOn || [].concat(f.HoldOn).length === 0 || [].concat(f.HoldOn).includes(machine))", ''],
  ['CRLF normalisation dropped', SRC, "buf.toString('binary').replace(/\\r\\n/g, '\\n')", "buf.toString('binary')"],
  ['the tables parsed line by line (a key on a row\'s second line is lost)', SRC, "  const body = lines.filter((l) => !/^\\s*#/.test(l)).join('\\n'), out = [];", "  const body = lines.filter((l) => !/^\\s*#/.test(l)).map((l) => (/^\\s*@\\{/.test(l) && !/\\}\\s*$/.test(l) ? l + ' }' : /^\\s*@\\{/.test(l) ? l : '')).join('\\n'), out = [];"],
  ['a range exits 0 whatever it finds', SRC, '  return range && rows.some((r) => FAILING.has(r.state)) ? 1 : 0;', '  return 0;'],
  ['a missing settings.json is guessed as empty, not UNKNOWN', SRC, "  let s; try { s = JSON.parse(fs.readFileSync(f, 'utf8').replace(/^\\uFEFF/, '')); } catch (_) { return null; }", "  let s; try { s = JSON.parse(fs.readFileSync(f, 'utf8').replace(/^\\uFEFF/, '')); } catch (_) { return []; }"],
  ['installed bytes no repo object matches read as OWED, not LOCAL EDIT', SRC, "      else if (!me.same && !me.known) row.state = 'LOCAL EDIT';", ''],
  ['an Excluded hook that runs here reads as EXCLUDED', SRC, "row.state = runsAt(reg.Rel) ? 'EXCLUDED BUT LIVE' : 'EXCLUDED';", "row.state = 'EXCLUDED';"],
];

function tree() {
  const dir = require('./scratch.js').mkdtemp('ll-mut-');
  fs.mkdirSync(path.join(dir, 'consonance', 'tools'), { recursive: true });
  for (const f of [SRC, SUITE, 'scratch.js']) fs.copyFileSync(path.join(HERE, f), path.join(dir, 'consonance', 'tools', f));
  return dir;
}
function run(dir) {
  const env = { ...process.env }; for (const k of Object.keys(env)) if (/^(CONSONANCE_|LANDED_)/.test(k)) delete env[k];
  env.LANDED_HISTORY_REPO = ROOT;   // the fixtures' real history, the real install.ps1 and the installed tree are read from here, never written
  const r = spawnSync(process.execPath, ['--test', '--test-concurrency=1', path.join(dir, 'consonance', 'tools', SUITE)], { encoding: 'utf8', env, timeout: 15 * 60 * 1000, windowsHide: true });
  const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''), n = (k) => Number((o.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) || [])[1]);
  return { pass: n('pass'), fail: n('fail') };
}

function main() {
  require('./heavy-run.js').hold({ cmd: 'landed-live.mutants' });   // ONE HEAVY RUNNER PER TREE
  const onlyAt = process.argv.indexOf('--only'), only = onlyAt > 0 ? Number(process.argv[onlyAt + 1]) : null;
  const read = (f) => fs.readFileSync(path.join(HERE, f), 'utf8').replace(/\r\n/g, '\n');
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
      fs.writeFileSync(path.join(d, 'consonance', 'tools', file), src.replace(anchor, () => repl));
      const r = run(d), ok = r.fail > 0; if (ok) caught++;
      console.log(`${label} pass ${r.pass} fail ${r.fail}  ${ok ? 'CAUGHT' : 'SURVIVED'}`);
    } finally { fs.rmSync(d, { recursive: true, force: true }); }
  });
  console.log(`\n${applied} applied · ${caught} caught · ${applied - caught} survived · ${notApplied} NOT APPLIED`);
  if (applied - caught > 0 || notApplied > 0) process.exitCode = 1;
}

main();

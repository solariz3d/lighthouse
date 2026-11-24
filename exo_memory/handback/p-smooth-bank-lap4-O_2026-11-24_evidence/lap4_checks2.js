// LAP 4, second run under heavy-run --exclusive, after drawn 2, drawn 7 and flow 8 were brought to the knots (the first run: lap4_checks_out.txt): the new mutants,
// LAP 3's panel mutants with P1 and P9 pointed at the panel's current lines, the two harnesses, the drag-cost row alone three times, then the full suite.
// extend.js is unchanged since the first run, so its must-not-move (36 of 36) stands.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const T = 'G:/consonance-scratch/o-smooth-t180', W = path.resolve(__dirname, '..'), H = __dirname, env = { ...process.env, TMP: W + '/tmp', TEMP: W + '/tmp' };
const run = (name, args, cwd = H) => { const t0 = Date.now(); const r = spawnSync(process.execPath, args, { cwd, encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 29, env }); const out = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''); fs.writeFileSync(path.join(H, name), out); console.log(`== ${name} exit ${r.status} in ${Math.round((Date.now() - t0) / 1000)} s`); return out; };
const pick = (out, re) => out.split('\n').filter((l) => re.test(l)).join('\n');
const MUTS = /^(unmutated|caught|SURVIVED|ERROR|NOT APPLIED|\d+ of)/;
console.log(pick(run('mut_lap4_out.txt', [H + '/mut_lap4.js']), MUTS));
console.log(pick(run('mut_panel_out.txt', [W + '/mut_panel.js']), MUTS));
console.log(pick(run('harness_lap4.txt', ['--test', 'test/core_bank_flow_mutation.test.js', 'test/core_ramp_mutation.test.js'], T), /^ℹ (tests|pass|fail)|^✖ /));
for (const i of [1, 2, 3]) console.log(pick(run(`d642_${i}.txt`, ['--test', 'app/test/core-extra-bank-drag-cost.test.js'], T), /^ℹ rolling|^ℹ (pass|fail)|^✖ D642/));
console.log(pick(run('suite_lap4b.txt', ['--test', '--test-concurrency=4', 'test/*.test.js', 'app/test/*.test.js'], T), /^ℹ (tests|pass|fail|skipped|todo)|^✖ /));

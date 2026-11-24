// LAP 4, under heavy-run --exclusive: the new mutants (mut_lap4.js), the LAP 3 addendum's and LAP 3's again over the changed rows (mut_room.js, mut_panel.js), the two
// harnesses that mutate extend.js (flow, ramp), what must not move (mnm.js on the tip against 513cd93's mnm2_base.json, exportMs left out), then the full suite.
// Each step's output is kept beside this file.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const T = 'G:/consonance-scratch/o-smooth-t180', W = path.resolve(__dirname, '..'), H = __dirname, env = { ...process.env, TMP: W + '/tmp', TEMP: W + '/tmp' };
const run = (name, args, cwd = H) => { const t0 = Date.now(); const r = spawnSync(process.execPath, args, { cwd, encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 29, env }); const out = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''); fs.writeFileSync(path.join(H, name), out); console.log(`== ${name} exit ${r.status} in ${Math.round((Date.now() - t0) / 1000)} s`); return out; };
const pick = (out, re) => out.split('\n').filter((l) => re.test(l)).join('\n');
const MUTS = /^(unmutated|caught|SURVIVED|ERROR|NOT APPLIED|\d+ of)/;
console.log(pick(run('mut_lap4_out.txt', [H + '/mut_lap4.js']), MUTS));
console.log(pick(run('mut_room_out.txt', [W + '/mut_room.js']), MUTS));
console.log(pick(run('mut_panel_out.txt', [W + '/mut_panel.js']), MUTS));
console.log(pick(run('harness_lap4.txt', ['--test', 'test/core_bank_flow_mutation.test.js', 'test/core_ramp_mutation.test.js'], T), /^ℹ (tests|pass|fail)|^✖ /));
run('mnm5_run.txt', ['--max-old-space-size=4096', W + '/mnm.js', T, W + '/tracks', H + '/mnm5_branch.json']);
const strip = (o) => JSON.parse(JSON.stringify(o, (k, v) => (k === 'exportMs' ? undefined : v)));
const a = strip(require(W + '/mnm2_base.json')), b = strip(require(H + '/mnm5_branch.json')), ka = Object.keys(a), diff = ka.filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
console.log(`must not move: ${ka.length - diff.length} of ${ka.length} the same as 513cd93${diff.length ? '; DIFFER: ' + diff.join(' ') : ''}${Object.keys(b).length !== ka.length ? ` (branch has ${Object.keys(b).length})` : ''}`);
console.log(pick(run('suite_lap4.txt', ['--test', '--test-concurrency=4', 'test/*.test.js', 'app/test/*.test.js'], T), /^ℹ (tests|pass|fail|skipped|todo)|^✖ /));

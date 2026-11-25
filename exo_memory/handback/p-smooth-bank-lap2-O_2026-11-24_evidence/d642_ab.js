// D642 alone, alternating the lap-1 tip (513cd93, exported whole) and this lap's tip (57e4b1c), three times each; prints each run's ratio line.
// Run under heavy-run --exclusive: it is a timing row.
'use strict';
const { spawnSync } = require('child_process');
const trees = [['513cd93', 'G:/consonance-scratch/o-smooth-work/tmp/base513full'], ['57e4b1c', 'G:/consonance-scratch/o-smooth-t180']];
for (let k = 0; k < 3; k++) for (const [name, tree] of trees) {
  const r = spawnSync(process.execPath, ['--test', '--test-name-pattern=D642', 'app/test/core-extra-bank-drag-cost.test.js'], { cwd: tree, encoding: 'utf8', windowsHide: true });
  const out = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '');
  const m = out.match(/p95 is ([\d.]+) ms a move, the early drag's ([\d.]+) ms: ([\d.]+) ×/);
  const pass = /ℹ fail 0/.test(out);
  console.log(name, k, pass ? 'pass' : 'FAIL', m ? `${m[1]} / ${m[2]} = ${m[3]}x` : '(ratio printed only on a fail)');
}

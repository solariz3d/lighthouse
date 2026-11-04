'use strict';
// D431 (O): the windowed close's metric W = ΣRᵀR + ε·I, swept over ε (env D431_EPS read by the tree's close.js for this sweep only). Per ε, on TEST 10 and row 2: the worst
// joint overshoot by the bar (°/100 m), the closure gap, and how far the finish's straight leaves a straight line, sideways and in height. One process per ε.
//   node sweep.js <tree>
const TREE = process.argv[2], { spawnSync } = require('child_process'), path = require('path');
for (const eps of ['1e-6', '1e-4', '1e-2', '1', '100', '1e4']) {
  const env = { ...process.env, D431_EPS: eps };
  const a = spawnSync(process.execPath, [path.join(__dirname, 'beforeafter.js'), TREE, path.join(__dirname, `sweep-eps-${eps}.json`)], { env, encoding: 'utf8' });
  const b = spawnSync(process.execPath, [path.join(__dirname, 'straight.js'), TREE], { env, encoding: 'utf8' });
  if (a.status || b.status) { console.log(eps, 'FAILED', (a.stderr || b.stderr).slice(-300)); continue; }
  const J = require(path.join(__dirname, `sweep-eps-${eps}.json`)), S = b.stdout.trim().split('\n').map(JSON.parse);
  for (const [k, v] of Object.entries(J)) {
    const s = S.find((x) => k.startsWith(x.lap));
    console.log(JSON.stringify({ eps, lap: k.slice(0, 7), worstOver: Math.max(...v.joints.map((j) => j.over)), gapMm: v.gapMm, minHoldG: v.minHoldG, straightSidewaysM: s.maxSidewaysM, straightOffHeightM: s.maxOffHeightLineM, plan: v.plan.slice(0, 40) }));
  }
}

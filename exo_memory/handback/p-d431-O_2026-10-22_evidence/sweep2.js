'use strict';
// D431 (O): the windowed close's metric, swept: D431_METRIC = rough (ΣRᵀR + ε·I, the second differences) or gram (∫(Σδ·N)² ds + ε·I, the change in the rate curve along
// the road), and ε (D431_EPS), both read by the tree's close.js for this sweep only. Per setting, on TEST 10 and row 2: the worst joint overshoot by the bar (°/100 m),
// the closure gap, the lowest road load, how far the finish's straight leaves a straight line sideways and in height, and the route Finish chose.
//   [EPS_LIST=a,b,…] node sweep2.js <tree> <metric>
const TREE = process.argv[2], METRIC = process.argv[3] || 'rough', { spawnSync } = require('child_process'), path = require('path');
for (const eps of (process.env.EPS_LIST || '1e-6,1e-4,1e-2,1,100,1e4').split(',')) {
  const env = { ...process.env, D431_EPS: eps, D431_METRIC: METRIC }, tag = `${METRIC}-${eps}`;
  const a = spawnSync(process.execPath, [path.join(__dirname, 'beforeafter.js'), TREE, path.join(__dirname, `sweep-${tag}.json`)], { env, encoding: 'utf8' });
  const b = spawnSync(process.execPath, [path.join(__dirname, 'straight.js'), TREE], { env, encoding: 'utf8' });
  if (a.status || b.status) { console.log(tag, 'FAILED', (a.stderr || b.stderr).slice(-300)); continue; }
  const J = require(path.join(__dirname, `sweep-${tag}.json`)), S = b.stdout.trim().split('\n').map(JSON.parse);
  for (const [k, v] of Object.entries(J)) {
    const s = S.find((x) => k.startsWith(x.lap));
    console.log(JSON.stringify({ metric: METRIC, eps, lap: k.slice(0, 7), worstOver: Math.max(...v.joints.map((j) => j.over)), gapMm: v.gapMm, minHoldG: v.minHoldG, straightSidewaysM: s.maxSidewaysM, straightOffHeightM: s.maxOffHeightLineM, plan: v.plan.slice(0, 40) }));
  }
}

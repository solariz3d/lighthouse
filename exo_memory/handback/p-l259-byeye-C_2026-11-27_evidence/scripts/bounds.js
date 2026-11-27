'use strict';
// where this read's curvature (±24 m) crosses the study's class bounds near each chosen section's ends: R 180 m (tight), 500 m, 1500 m
const fs = require('fs'), M = require('./measure.js');
const ref = M.readRef(JSON.parse(fs.readFileSync('t2.read.json', 'utf8')));
const near = (m0, span) => { const out = []; for (let k = 1; k < ref.n; k++) { if (Math.abs(ref.arc[k] - m0) > span) continue;
  for (const R of [180, 500, 1500]) { const c = 1 / R, a = ref.kap[k - 1] - c, b = ref.kap[k] - c; if (a * b < 0) out.push(`${ref.arc[k].toFixed(0)} m crosses R ${R} ${b > 0 ? 'tighter' : 'wider'}`); } } return out; };
for (const [from, to] of [[26185, 26345], [14741, 15163], [22034, 22553]]) {
  console.log(`study section ${from}-${to}:`); console.log('  near start:', near(from, 80).join('; ')); console.log('  near end:  ', near(to, 80).join('; '));
}
console.log('lap: this grid', ref.arc[ref.n - 1].toFixed(0), 'm; the study 36330 m; ratio', (36330 / ref.arc[ref.n - 1]).toFixed(5));

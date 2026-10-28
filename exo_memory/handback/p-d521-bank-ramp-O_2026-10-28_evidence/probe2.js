// probe2.js (D521 Part 1, O): the bank channel's own peak rate (dφ/ds from document.js valuesAt, every 0.1 m) against the gravity-frame roll's, and
// the inner edge's sharpest grade step, for the ticked 20 m ramp and for UNticked pieces of 20 to 200 m (a short piece ramps over all of itself).
'use strict';
const path = require('path');
const T = process.env.T180_TREE;
const D = require(path.join(T, 'src/core/document.js'));
const { extend } = require(path.join(T, 'src/core/extend.js'));
const { toPath } = require(path.join(T, 'src/core/adapter.js'));
const DEG = Math.PI / 180;
const chanPeak = (P) => { let best = 0; for (let s = 0.1; s <= P.length; s += 0.1) { const r = Math.abs(D.valuesAt(P, s).phi - D.valuesAt(P, s - 0.1).phi) / DEG / 0.1; if (r > best) best = r; } return best; };
function edgeStep(d) {
  const { path: Pt } = toPath(d, { step: 0.5 }), pc = d.pieces[1], y = [];
  for (const m of Pt.samples) { if (m.s < 90 || m.s > 100 + pc.length) continue; const v = m.s < 100 ? D.valuesAt(d.pieces[0], m.s) : D.valuesAt(pc, Math.min(pc.length, m.s - 100)); y.push([m.s, m.pos[1] + (v.w / 2) * m.L[1]]); }
  let worst = 0; for (let i = 2; i < y.length; i++) { const g1 = Math.atan2(y[i - 1][1] - y[i - 2][1], y[i - 1][0] - y[i - 2][0]), g2 = Math.atan2(y[i][1] - y[i - 1][1], y[i][0] - y[i - 1][0]); worst = Math.max(worst, Math.abs(g2 - g1) / DEG / (y[i][0] - y[i - 1][0])); }
  return worst;   // degrees of grade change per metre along the inner edge
}
console.log('bank | piece | ramp | channel peak dφ/ds °/m | 1.875·Δφ/ramp | inner edge grade change, worst °/m');
for (const bank of [30, 45]) for (const [len, tick] of [[200, true], [200, false], [100, false], [60, false], [40, false], [20, false]]) {
  let d = extend(D.createDoc('p2'), { length: 100 });
  const ramp = tick ? Math.min(20, len) : len;
  d = extend(d, { length: len, targets: { phi: -bank * DEG, kh: (90 * DEG) / len }, ...(tick ? { transition: { phi: ramp } } : {}) });
  console.log(`${bank}° | ${len} m | ${tick ? 'tick 20 m' : 'whole'} | ${chanPeak(d.pieces[1]).toFixed(3)} | ${(1.875 * bank / ramp).toFixed(3)} | ${edgeStep(d).toFixed(2)}`);
}

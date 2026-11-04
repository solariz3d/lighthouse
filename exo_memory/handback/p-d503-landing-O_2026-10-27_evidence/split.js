// split.js (D503, pane O): the plan's chain on E's lap with 'over' split in two: validate -> an edit that moves only the far half of the crossing (where the
// true largest clipping partner lies) -> revalidate -> a second edit -> revalidate, each compared with a full validate.
'use strict';
const root = process.argv[2], util = require('util');
const { validate, revalidate } = require(root + '/src/validate/index.js'), G = require(root + '/src/geom/index.js'), F = require(root + '/test/geom_fixtures.js');
const lap = (cut, kp2, gap = 0.3) => {
  const Ru = 13 + gap / 2, R = 25, T = 1.5 * Math.PI * R, Lh = T - 40, k = 1 / R;
  return [{ id: 'side', kind: 'road', length: 120, profile: F.FLAT }, { id: 'uturn', kind: 'road', length: Math.PI * Ru, k0: -1 / Ru, k1: -1 / Ru, profile: F.FLAT },
    { id: 'lead', kind: 'road', length: 110, profile: F.FLAT }, { id: 'up', kind: 'road', length: 20, k0: k, k1: k, profile: F.FLAT },
    { id: 'hold', kind: 'road', length: Lh, k0: k, k1: k, profile: F.FLAT }, { id: 'down', kind: 'road', length: 20, k0: k, k1: k, profile: F.FLAT },
    { id: 'over1', kind: 'road', length: cut, profile: F.FLAT }, { id: 'over2', kind: 'road', length: 80 - cut, kp0: kp2, kp1: kp2, profile: F.FLAT }];
};
const opts = { csp: true, fullSpeed: true }, at = (p, j) => p.samples[p.samples.findIndex((x) => x.seg === j)].s;
let tried = 0, diff = 0, fired = 0;
for (const cut of [20, 30, 36, 40, 44, 50, 60]) for (const k1 of [0.002, 0.005, 0.01, 0.02]) for (const k2 of [0, 0.001, 0.005, 0.03]) {
  if (k1 === k2) continue; tried++;
  const A = lap(cut, 0), pA = G.buildPath(A, { step: 2 }); globalThis.__v6 = [];
  const vA = validate(pA, A, opts); fired += (globalThis.__v6 || []).length;
  const B = lap(cut, k1), pB = G.buildPath(B, { step: 2 }), r1 = revalidate(vA, pB, B, at(pB, 7), opts), f1 = validate(pB, B, opts);
  const C = lap(cut, k2), pC = G.buildPath(C, { step: 2 }), r2 = revalidate(r1, pC, C, at(pC, 7), opts), f2 = validate(pC, C, opts);
  const d1 = !util.isDeepStrictEqual(r1, f1), d2 = !util.isDeepStrictEqual(r2, f2);
  if (d1 || d2) { diff++; console.log(`cut ${cut} kp ${k1} then ${k2}: first ${d1 ? 'DIFFERS' : 'equal'}, second ${d2 ? 'DIFFERS' : 'equal'}`); }
}
console.log(`${root.split(/[\/]/).pop()}: tried ${tried}, differing ${diff}${fired ? `, V6 branch fired ${fired} times in the first validates` : ''}`);

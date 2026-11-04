// probe.js (D503, pane O): under V6, find a validate -> revalidate -> revalidate chain whose result differs from a full validate.
'use strict';
const root = process.argv[2], util = require('util');
const { validate, revalidate } = require(root + '/src/validate/index.js'), G = require(root + '/src/geom/index.js'), F = require(root + '/test/geom_fixtures.js');
const lap = (h, gap = 0.3) => {
  const Ru = 13 + gap / 2, R = 25, T = 1.5 * Math.PI * R, Lh = T - 40, a = h / (200 + 20 * Lh + 200), k = 1 / R;
  return [{ id: 'side', kind: 'road', length: 120, profile: F.FLAT }, { id: 'uturn', kind: 'road', length: Math.PI * Ru, k0: -1 / Ru, k1: -1 / Ru, profile: F.FLAT },
    { id: 'lead', kind: 'road', length: 110, profile: F.FLAT }, { id: 'up', kind: 'road', length: 20, k0: k, k1: k, kp0: a, kp1: a, profile: F.FLAT },
    { id: 'hold', kind: 'road', length: Lh, k0: k, k1: k, profile: F.FLAT }, { id: 'down', kind: 'road', length: 20, k0: k, k1: k, kp0: -a, kp1: -a, profile: F.FLAT },
    { id: 'over', kind: 'road', length: 80, profile: F.FLAT }];
};
const opts = { csp: true, fullSpeed: true };
const H = [0, 0.4, 0.8, 1.5, 3], GAPS = [0.3, 0.6];
const build = (h, g) => { const s = lap(h, g), p = G.buildPath(s, { step: 2 }); return { s, p, from: p.samples[p.samples.findIndex((x) => x.seg === 3)].s }; };
let found = 0, tried = 0;
for (const g of GAPS) for (const h0 of H) for (const h1 of H) for (const h2 of H) {
  if (h0 === h1 || h1 === h2) continue; tried++;
  const A = build(h0, g), B = build(h1, g), C = build(h2, g);
  const vA = validate(A.p, A.s, opts), r1 = revalidate(vA, B.p, B.s, B.from, opts), r2 = revalidate(r1, C.p, C.s, C.from, opts);
  const f1 = validate(B.p, B.s, opts), f2 = validate(C.p, C.s, opts);
  const d1 = !util.isDeepStrictEqual(r1, f1), d2 = !util.isDeepStrictEqual(r2, f2);
  if (d1 || d2) { found++; console.log(`gap ${g} h ${h0} -> ${h1} -> ${h2}: first revalidate ${d1 ? 'DIFFERS' : 'equal'}, second ${d2 ? 'DIFFERS' : 'equal'}`); }
}
console.log(`${root.split(/[\/]/).pop()}: tried ${tried}, differing ${found}`);

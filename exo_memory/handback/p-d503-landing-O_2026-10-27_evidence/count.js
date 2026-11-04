'use strict';
const root = process.argv[2];
const { validate } = require(root + '/src/validate/index.js'), G = require(root + '/src/geom/index.js'), F = require(root + '/test/geom_fixtures.js');
const lap = (h, gap = 0.3) => {
  const Ru = 13 + gap / 2, R = 25, T = 1.5 * Math.PI * R, Lh = T - 40, a = h / (200 + 20 * Lh + 200), k = 1 / R;
  return [{ id: 'side', kind: 'road', length: 120, profile: F.FLAT }, { id: 'uturn', kind: 'road', length: Math.PI * Ru, k0: -1 / Ru, k1: -1 / Ru, profile: F.FLAT },
    { id: 'lead', kind: 'road', length: 110, profile: F.FLAT }, { id: 'up', kind: 'road', length: 20, k0: k, k1: k, kp0: a, kp1: a, profile: F.FLAT },
    { id: 'hold', kind: 'road', length: Lh, k0: k, k1: k, profile: F.FLAT }, { id: 'down', kind: 'road', length: 20, k0: k, k1: k, kp0: -a, kp1: -a, profile: F.FLAT },
    { id: 'over', kind: 'road', length: 80, profile: F.FLAT }];
};
for (const h of [0, 0.4, 0.8, 3]) { globalThis.__v6 = []; const s = lap(h), p = G.buildPath(s, { step: 2 }); validate(p, s, { csp: true, fullSpeed: true });
  const ev = globalThis.__v6; console.log(`h ${h}: V6 branch fires ${ev.length} times`, ev.slice(0, 4).map((e) => `i${e.i} lowP ${e.lowP} clipP ${e.clipP} seg ${s[p.samples[e.i].seg].id}`).join(' | ')); }

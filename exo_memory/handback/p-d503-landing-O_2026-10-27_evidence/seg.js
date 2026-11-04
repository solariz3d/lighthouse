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
const s = lap(0), p = G.buildPath(s, { step: 2 }), v = validate(p, s, { csp: true, fullSpeed: true }), id = (i) => s[p.samples[i].seg].id;
console.log('keys of result:', Object.keys(v).join(','));
const segStart = {}; p.samples.forEach((x, i) => { if (!(s[x.seg].id in segStart)) segStart[s[x.seg].id] = i; }); console.log('first station of each seg:', JSON.stringify(segStart), 'n', p.samples.length);
const clips = [...v._raw.stacked.values()].filter((e) => e.clip);
const by = {}; for (const e of clips) { const key = `${id(e.i)} p:${id(e.p)} clipP:${id(e.clipP)}`; by[key] = (by[key] || 0) + 1; } console.log(by);

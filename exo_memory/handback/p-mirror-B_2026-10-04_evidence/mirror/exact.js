// exact.js (pane B, D237b): on FRESH path objects (so the memo cannot be stale), the tree's gap against MY brute force on my own asymmetric cases, including far centres
// (the old 12-ring fallback's cases); and the re-timed plan for my D237 cases (egg / L / hill, 3,000 points, mirror on, default centre); and the ghost counts.
//   node exact.js <tree>
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]) + '/', G = require(T + 'app/preview/guides.js');
const boundsOf = (pts) => { const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity]; for (const p of pts) for (let k = 0; k < 3; k++) { min[k] = Math.min(min[k], p[k]); max[k] = Math.max(max[k], p[k]); } return { min, max }; };
const brute = (pts, closed, c, kind) => { const segs = []; for (let i = 0; i + 1 < pts.length; i++) segs.push([pts[i], pts[i + 1]]); if (closed && pts.length > 2) segs.push([pts[pts.length - 1], pts[0]]);
  const d2 = (p, a, b) => { const d = [0, 1, 2].map((k) => b[k] - a[k]), w = [0, 1, 2].map((k) => p[k] - a[k]), dd = d[0] ** 2 + d[1] ** 2 + d[2] ** 2, t = dd > 0 ? Math.max(0, Math.min(1, (w[0] * d[0] + w[1] * d[1] + w[2] * d[2]) / dd)) : 0; return (w[0] - d[0] * t) ** 2 + (w[1] - d[1] * t) ** 2 + (w[2] - d[2] * t) ** 2; };
  const stride = Math.max(1, Math.ceil(pts.length / 4000)); let max = 0, sum = 0, n = 0; for (let i = 0; i < pts.length; i += stride) { const m = G.mirrorPoint(pts[i], c, kind); let b = Infinity; for (const [a, bb] of segs) b = Math.min(b, d2(m, a, bb)); const g = Math.sqrt(b); max = Math.max(max, g); sum += g; n++; } return { max, mean: sum / n, n }; };
const egg = Array.from({ length: 3000 }, (_, i) => { const t = (2 * Math.PI * i) / 3000, a = 300, b = t < Math.PI / 2 || t > 3 * Math.PI / 2 ? 140 : 80; return [a * Math.cos(t), 0, b * Math.sin(t)]; });
const L = []; for (let s = 0; s <= 900; s += 0.5) L.push([s, 0, 0]); for (let a = 0; a <= Math.PI / 2; a += 0.5 / 60) L.push([900 + 60 * Math.sin(a), 0, 60 - 60 * Math.cos(a)]); for (let s = 0.5; s <= 500; s += 0.5) L.push([960, 0, 60 + s]);
const hill = egg.map(([x, , z]) => [x, x > 0 ? 60 * Math.sin(Math.PI * x / 600) : 0, z]);
const bump = Array.from({ length: 4000 }, (_, i) => { const t = (2 * Math.PI * i) / 4000, dr = t > 0.3 && t < 0.5 ? 5 * Math.sin(Math.PI * (t - 0.3) / 0.2) ** 2 : 0; return [(200 + dr) * Math.cos(t), 0, (100 + dr) * Math.sin(t)]; });
const zig = []; let x = 0, z = 0, y = 0; for (let i = 0; i < 2500; i++) { x += 0.5 * Math.cos(i / 37) + 0.2; z += 0.5 * Math.sin(i / 23); y += 0.05 * Math.sin(i / 50); zig.push([x, y, z]); }   // a wandering open line with height
const cases = [['egg', egg, true], ['L', L, false], ['hill', hill, true], ['bump 5 m', bump, true], ['wander (3D)', zig, false]];
const res = { exact: [], worstAbsDiff: 0, timing: {}, ghost: {} };
for (const [name, pts, closed] of cases) {
  const b = boundsOf(pts), mid = { x: (b.min[0] + b.max[0]) / 2, z: (b.min[2] + b.max[2]) / 2 };
  for (const centre of [mid, { x: mid.x + 13.7, z: mid.z - 41.2 }, { x: mid.x + 2000, z: mid.z + 2000 }, { x: mid.x - 9000, z: mid.z + 50 }]) for (const kind of ['x', 'z', 'both']) {
    const p = { closed, samples: pts.map((pos) => ({ pos })) }, plan = G.guidePlan({ bounds: b, path: p, mode: 'off', mirror: kind, centre }), br = brute(pts, closed, centre, kind);
    const d = Math.max(Math.abs(plan.gap.max - br.max), Math.abs(plan.gap.mean - br.mean)); res.worstAbsDiff = Math.max(res.worstAbsDiff, d);
    if (d > 1e-9 || plan.gap.n !== br.n) res.exact.push({ name, kind, centre, plan: plan.gap, brute: br });
  }
}
res.exactCases = cases.length * 4 * 3; res.exactMismatches = res.exact.length;
for (const [name, pts, closed] of [['egg', egg, true], ['L', L, false], ['hill', hill, true]]) { const b = boundsOf(pts), r = {};
  for (const m of ['x', 'z', 'both']) { let ms = []; for (let k = 0; k < 4; k++) { const p = { closed, samples: pts.map((pos) => ({ pos })) }, t0 = process.hrtime.bigint(); G.guidePlan({ bounds: b, path: p, mode: 'auto', mirror: m }); ms.push(Number(process.hrtime.bigint() - t0) / 1e6); } ms = ms.slice(1).sort((a, c) => a - c); r[m] = +ms[1].toFixed(1); }
  res.timing[`${name} (fresh path each time: cold, ms)`] = r; }
const coil = (lengthM, rMax, step = 2) => { const pts = []; let th = 0, s = 0; while (s < lengthM) { const r = 10 + (rMax - 10) * (s / lengthM); pts.push([r * Math.cos(th), 30 * Math.sin(s / 400), r * Math.sin(th)]); th += step / r; s += step; } return pts; };
for (const [name, pts] of [['14 km coil in 300 m box', coil(14000, 150)], ['40 km coil', coil(40000, 150)], ['1.2 km open', coil(1200, 150)]]) { const p = G.guidePlan({ bounds: boundsOf(pts), path: { closed: false, samples: pts.map((pos) => ({ pos })) }, mode: '3d', mirror: 'both' }); res.ghost[name] = { points: pts.length, ghostLines: p.over.reduce((a, l) => a + l.positions.length / 6, 0), allLines: p.lines }; }
console.log(JSON.stringify(res, null, 1));

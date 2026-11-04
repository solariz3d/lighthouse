// cams.js (D622, O): the cameras for the p38/p41 crossing, from one kn5 (used unchanged for old and new). The wheel-height eye stands on p41's APRON:
// a vertical ray at (x, z) onto 1ROAD_APRON_p41 gives the surface; the eye is 0.4 m along the apron's normal. node cams.js <kn5> <out views.json>
'use strict';
require('C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-36313935/c88002b1-74d8-4036-8cc0-f64aefbeabff/scratchpad/winhide.js');
const fs = require('fs'), { readKn5Full } = require('C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-36313935/c88002b1-74d8-4036-8cc0-f64aefbeabff/scratchpad/d593/kn5full.js');
const [, , KN5, OUT] = process.argv;
const kn = readKn5Full(KN5);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul = (a, k) => a.map((x) => x * k);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a) => { const l = Math.hypot(...a); return a.map((x) => x / l); };
const apron = kn.meshes.filter((m) => /^1ROAD_APRON_p41_/.test(m.name));
function onApron(x, z, yNear) {   // the hit nearest yNear, with the face's normal turned up
  let best = null;
  for (const m of apron) { const P = m.pos, I = m.idx;
    for (let i = 0; i < I.length; i += 3) {
      const v = [0, 1, 2].map((c) => [P[I[i + c] * 3], P[I[i + c] * 3 + 1], P[I[i + c] * 3 + 2]]);
      const d0 = [v[0][0], v[0][2]], e1 = [v[1][0] - v[0][0], v[1][2] - v[0][2]], e2 = [v[2][0] - v[0][0], v[2][2] - v[0][2]], det = e1[0] * e2[1] - e1[1] * e2[0];
      if (Math.abs(det) < 1e-9) continue;
      const px = x - d0[0], pz = z - d0[1], a = (px * e2[1] - pz * e2[0]) / det, b = (e1[0] * pz - e1[1] * px) / det;
      if (a < 0 || b < 0 || a + b > 1) continue;
      const y = v[0][1] + a * (v[1][1] - v[0][1]) + b * (v[2][1] - v[0][1]);
      let n = unit(cross(sub(v[1], v[0]), sub(v[2], v[0]))); if (n[1] < 0) n = mul(n, -1);
      if (!best || Math.abs(y - yNear) < Math.abs(best.p[1] - yNear)) best = { p: [x, y, z], n };
    } }
  if (!best) throw new Error(`no apron under ${x}, ${z}`);
  return best;
}
const C = [38.5, 26.9, -474.1];   // the middle of the cut (D616 int616: x 35.2-41.8, y 26.8-27.1, z -475.2..-473.1)
const views = [];
for (const [name, x, z, at, fov] of [['1-wheel', 24, -474.6, [40, 27.4, -474.2], 60], ['1-wheel-close', 31, -474.5, [39.5, 27.2, -474.2], 55]]) {
  const s = onApron(x, z, 26), eye = add(s.p, mul(s.n, 0.4));
  console.log(name, 'apron at', s.p.map((q) => q.toFixed(2)).join(','), 'normal', s.n.map((q) => q.toFixed(2)).join(','));
  views.push({ name, eye, at, fov });
}
views.push({ name: '2-side', eye: [62, 36, -446], at: C, fov: 45 });
views.push({ name: '2-side-zoom', eye: [62, 36, -446], at: [38.5, 27.3, -474.3], fov: 14 });
views.push({ name: '2-side-far', eye: [38.5, 38, -432], at: C, fov: 40 });
views.push({ name: '3-wide', eye: [C[0] + 50, C[1] + 900, C[2] + 700], at: [C[0] - 30, C[1] - 80, C[2] + 250], fov: 60, far: 6000, mark: C, markR: 30 });
views.push({ name: '3-wide-near', eye: [C[0] + 120, C[1] + 260, C[2] + 220], at: C, fov: 50, far: 4000, mark: C, markR: 45 });
for (const xc of [36, 38, 40]) views.push({ name: '4-cut-x' + xc, eye: [20, 27.1, -474.3], at: [60, 27.1, -474.3], fov: 24, near: xc - 20, double: true });
fs.writeFileSync(OUT, JSON.stringify(views, null, 1));
console.log('views', views.length);

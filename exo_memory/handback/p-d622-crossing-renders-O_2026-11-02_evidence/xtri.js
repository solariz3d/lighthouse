// xtri.js (D622, O): read-only. The p38 hull triangles (UNDERSKIN/APRONSIDE) within R of the crossing that INTERSECT a triangle of p41's apron
// (an edge of either crosses the other, as D616 int616.js counts). Writes {mesh: [triangle index, ...]} for render622's XRAYTRI. node xtri.js <kn5> <out.json>
'use strict';
const fs = require('fs'), { readKn5Full } = require('C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-36313935/c88002b1-74d8-4036-8cc0-f64aefbeabff/scratchpad/d593/kn5full.js');
const [, , KN5, OUT] = process.argv, kn = readKn5Full(KN5), O = [38.5, 27, -474], R = 25;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const tris = (re) => { const out = []; for (const m of kn.meshes) { if (!re.test(m.name)) continue; const P = m.pos, I = m.idx;
  for (let i = 0; i < I.length; i += 3) { const v = [0, 1, 2].map((c) => [P[I[i + c] * 3], P[I[i + c] * 3 + 1], P[I[i + c] * 3 + 2]]);
    if (v.some((p) => Math.hypot(...sub(p, O)) < R)) out.push({ m: m.name, t: i / 3, v }); } } return out; };
function segTri(p, q, v) {   // Möller–Trumbore on the segment p→q
  const d = sub(q, p), e1 = sub(v[1], v[0]), e2 = sub(v[2], v[0]), h = cross(d, e2), a = dot(e1, h); if (Math.abs(a) < 1e-12) return false;
  const f = 1 / a, s = sub(p, v[0]), u = f * dot(s, h); if (u < 0 || u > 1) return false;
  const qq = cross(s, e1), w = f * dot(d, qq); if (w < 0 || u + w > 1) return false; const t = f * dot(e2, qq); return t >= 0 && t <= 1;
}
const edges = (v) => [[v[0], v[1]], [v[1], v[2]], [v[2], v[0]]];
const hull = tris(/^(UNDERSKIN|APRONSIDE)_p38_/), apron = tris(/^1ROAD_APRON_p41_/), out = {}; let pairs = 0;
for (const h of hull) for (const a of apron) {
  if (edges(h.v).some(([p, q]) => segTri(p, q, a.v)) || edges(a.v).some(([p, q]) => segTri(p, q, h.v))) { pairs++; (out[h.m] = out[h.m] || []); if (!out[h.m].includes(h.t)) out[h.m].push(h.t); }
}
fs.writeFileSync(OUT, JSON.stringify(out));
console.log(KN5.split(/[\\/]/).pop(), 'pairs', pairs, 'hull triangles', Object.values(out).reduce((s, l) => s + l.length, 0), JSON.stringify(Object.fromEntries(Object.entries(out).map(([k, l]) => [k, l.length]))));

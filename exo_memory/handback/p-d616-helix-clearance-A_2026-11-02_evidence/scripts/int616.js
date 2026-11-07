// int616.js <kn5> <ox,oy,oz> <R> [drawnRe] [physRe]: read-only. Within R of O, every pair (drawn triangle of a mesh matching drawnRe, physics triangle matching physRe)
// that intersects (an edge of one crosses the other). Reports pairs, the intersection points' extent, and the drawn meshes' vertices on the BACK side of a
// physics triangle they project into (how far the drawn mesh comes up through the surface from under, as seen from the drivable side, is the other side).
const { readKn5 } = require('C:/Users/nname/Downloads/t180-wt-a614/tools/kn5.cjs');
const [file, os, Rs, dre, pre] = process.argv.slice(2), O = os.split(',').map(Number), R = +Rs;
const DR = new RegExp(dre || '^(UNDERSKIN|APRONSIDE)_p38_'), PR = new RegExp(pre || '^1ROAD_(APRON_)?p(39|4[01])_');
const k = readKn5(file), tri = (re) => { const out = []; for (const m of k.meshes) { if (!re.test(m.name)) continue; const P = m.pos, I = m.idx;
  for (let i = 0; i < I.length; i += 3) { const v = [0, 1, 2].map((c) => [P[I[i + c] * 3], P[I[i + c] * 3 + 1], P[I[i + c] * 3 + 2]]); if (v.some((p) => Math.hypot(p[0] - O[0], p[1] - O[1], p[2] - O[2]) < R)) out.push({ m: m.name, v }); } } return out; };
const D = tri(DR), Ph = tri(PR);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
function segTri(p, q, t) { const d = sub(q, p), e1 = sub(t[1], t[0]), e2 = sub(t[2], t[0]), h = cross(d, e2), a = dot(e1, h); if (Math.abs(a) < 1e-12) return null; const f = 1 / a, s = sub(p, t[0]), u = f * dot(s, h); if (u < 0 || u > 1) return null; const qq = cross(s, e1), v = f * dot(d, qq); if (v < 0 || u + v > 1) return null; const tt = f * dot(e2, qq); if (tt < 0 || tt > 1) return null; return [p[0] + d[0] * tt, p[1] + d[1] * tt, p[2] + d[2] * tt]; }
const box = (t) => [0, 1, 2].map((a) => [Math.min(t[0][a], t[1][a], t[2][a]), Math.max(t[0][a], t[1][a], t[2][a])]);
const Pb = Ph.map((p) => box(p.v)); let pairs = 0; const pts = [], byMesh = {};
for (const d of D) { const db = box(d.v);
  for (let j = 0; j < Ph.length; j++) { const pb = Pb[j]; if (db[0][1] < pb[0][0] || db[0][0] > pb[0][1] || db[1][1] < pb[1][0] || db[1][0] > pb[1][1] || db[2][1] < pb[2][0] || db[2][0] > pb[2][1]) continue;
    const p = Ph[j], X = [];
    for (const [a, b] of [[0, 1], [1, 2], [2, 0]]) { let x = segTri(d.v[a], d.v[b], p.v); if (x) X.push(x); x = segTri(p.v[a], p.v[b], d.v); if (x) X.push(x); }
    if (X.length) { pairs++; pts.push(...X); const kk = d.m.replace(/_chunk_\d+/, '') + ' x ' + p.m.replace(/_chunk_\d+/, ''); byMesh[kk] = (byMesh[kk] || 0) + 1; } } }
// how far drawn vertices go through: vertices behind a physics triangle (h < 0 along its front normal), projecting inside it, within 1.5 m behind
let deepest = null, nBehind = 0;
for (const d of D) for (const v of d.v) for (const p of Ph) { const e1 = sub(p.v[1], p.v[0]), e2 = sub(p.v[2], p.v[0]); let n = cross(e1, e2); const L = Math.hypot(...n); n = n.map((x) => x / L);
  const w = sub(v, p.v[0]), h = dot(w, n); if (h >= 0 || h < -1.5) continue; const q = sub(w, n.map((x) => x * h)), d00 = dot(e1, e1), d01 = dot(e1, e2), d11 = dot(e2, e2), d20 = dot(q, e1), d21 = dot(q, e2), den = d00 * d11 - d01 * d01, bv = (d11 * d20 - d01 * d21) / den, bw = (d00 * d21 - d01 * d20) / den;
  if (bv < 0 || bw < 0 || bv + bw > 1) continue; nBehind++; if (!deepest || h < deepest.h) deepest = { h: +h.toFixed(4), v: v.map((x) => +x.toFixed(3)), drawn: d.m, phys: p.m }; }
const ext = pts.length ? [0, 1, 2].map((a) => [Math.min(...pts.map((p) => p[a])).toFixed(2), Math.max(...pts.map((p) => p[a])).toFixed(2)]) : null;
console.log(file.split(/[\/]/).pop(), 'drawn tris', D.length, 'physics tris', Ph.length, 'intersecting pairs', pairs, JSON.stringify(byMesh), 'extent x/y/z', JSON.stringify(ext));
console.log('drawn vertices behind a physics triangle (within 1.5 m):', nBehind, 'deepest', JSON.stringify(deepest));

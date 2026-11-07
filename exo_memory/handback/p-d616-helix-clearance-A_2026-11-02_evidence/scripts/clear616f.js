// clear616.js <kn5> <out.json> [pieceRe]: read-only. From every triangle of the DRIVABLE road (1ROAD_ meshes, not the catch or the apron) in a region where
// another pass of road lies above, cast a ray along the road's own up normal and record each mesh it meets within RAY_M, nearest first per mesh.
// Excluded: the mesh the ray starts on, and any hit closer than 0.05 m.
const { readKn5 } = require('C:/Users/nname/Downloads/t180-wt-a614/tools/kn5.cjs');
const fs = require('fs');
const RAY_M = 25, CELL = 4;
const [file, out, pieceArg] = process.argv.slice(2);
const k = readKn5(file);
const isDrive = (n) => /^1ROAD_/.test(n) && !/^1ROAD_CATCH/.test(n) && !/APRON/.test(n);
const pieceOf = (n) => { const m = n.match(/_(p\d+)_/) || n.match(/(p\d+)/); return m ? m[1] : '?'; };
// all triangles, flat
let T = 0; for (const m of k.meshes) T += m.idx.length / 3;
const tv = new Float32Array(T * 9), tm = new Int32Array(T); let t = 0;
k.meshes.forEach((m, mi) => { const p = m.pos, I = m.idx; for (let i = 0; i < I.length; i += 3, t++) { for (let c = 0; c < 3; c++) { const v = I[i + c] * 3; tv[t * 9 + c * 3] = p[v]; tv[t * 9 + c * 3 + 1] = p[v + 1]; tv[t * 9 + c * 3 + 2] = p[v + 2]; } tm[t] = mi; } });
// xz grid over every triangle's bbox
const key = (i, j) => i * 100003 + j, grid = new Map();
for (let a = 0; a < T; a++) { const o = a * 9; const x0 = Math.min(tv[o], tv[o + 3], tv[o + 6]), x1 = Math.max(tv[o], tv[o + 3], tv[o + 6]), z0 = Math.min(tv[o + 2], tv[o + 5], tv[o + 8]), z1 = Math.max(tv[o + 2], tv[o + 5], tv[o + 8]);
  for (let i = Math.floor(x0 / CELL); i <= Math.floor(x1 / CELL); i++) for (let j = Math.floor(z0 / CELL); j <= Math.floor(z1 / CELL); j++) { const kk = key(i, j); let L = grid.get(kk); if (!L) grid.set(kk, L = []); L.push(a); } }
// stacked cells: a cell holding drivable road of two different heights > 3 m apart
const stacked = new Set();
for (const [kk, L] of grid) { let lo = 1e9, hi = -1e9; for (const a of L) if (isDrive(k.meshes[tm[a]].name)) { const y = (tv[a * 9 + 1] + tv[a * 9 + 4] + tv[a * 9 + 7]) / 3; lo = Math.min(lo, y); hi = Math.max(hi, y); } if (hi - lo > 3) stacked.add(kk); }
function hit(o, d, a) { // Moller-Trumbore, both faces
  const b = a * 9, e1x = tv[b + 3] - tv[b], e1y = tv[b + 4] - tv[b + 1], e1z = tv[b + 5] - tv[b + 2], e2x = tv[b + 6] - tv[b], e2y = tv[b + 7] - tv[b + 1], e2z = tv[b + 8] - tv[b + 2];
  const px = d[1] * e2z - d[2] * e2y, py = d[2] * e2x - d[0] * e2z, pz = d[0] * e2y - d[1] * e2x, det = e1x * px + e1y * py + e1z * pz; if (Math.abs(det) < 1e-12) return -1;
  const inv = 1 / det, sx = o[0] - tv[b], sy = o[1] - tv[b + 1], sz = o[2] - tv[b + 2], u = (sx * px + sy * py + sz * pz) * inv; if (u < 0 || u > 1) return -1;
  const qx = sy * e1z - sz * e1y, qy = sz * e1x - sx * e1z, qz = sx * e1y - sy * e1x, v = (d[0] * qx + d[1] * qy + d[2] * qz) * inv; if (v < 0 || u + v > 1) return -1;
  return (e2x * qx + e2y * qy + e2z * qz) * inv; }
const rows = []; const pieceRe = pieceArg ? new RegExp(pieceArg) : null;
for (let a = 0; a < T; a++) { const mi = tm[a], nm = k.meshes[mi].name; if (!isDrive(nm) || (pieceRe && !pieceRe.test(nm))) continue;
  const b = a * 9, c = [(tv[b] + tv[b + 3] + tv[b + 6]) / 3, (tv[b + 1] + tv[b + 4] + tv[b + 7]) / 3, (tv[b + 2] + tv[b + 5] + tv[b + 8]) / 3];
  if (!stacked.has(key(Math.floor(c[0] / CELL), Math.floor(c[2] / CELL)))) continue;
  let nx = (tv[b + 4] - tv[b + 1]) * (tv[b + 8] - tv[b + 2]) - (tv[b + 5] - tv[b + 2]) * (tv[b + 7] - tv[b + 1]), ny = (tv[b + 5] - tv[b + 2]) * (tv[b + 6] - tv[b]) - (tv[b + 3] - tv[b]) * (tv[b + 8] - tv[b + 2]), nz = (tv[b + 3] - tv[b]) * (tv[b + 7] - tv[b + 1]) - (tv[b + 4] - tv[b + 1]) * (tv[b + 6] - tv[b]);
  const L = Math.hypot(nx, ny, nz); if (L < 1e-12) continue; nx /= L; ny /= L; nz /= L; // the road's front face: the side a car is on
  const d = [nx, ny, nz], cells = new Set();
  for (let s = 0; s <= RAY_M; s += 1) cells.add(key(Math.floor((c[0] + nx * s) / CELL), Math.floor((c[2] + nz * s) / CELL)));
  const best = new Map();
  for (const kk of cells) for (const q of grid.get(kk) || []) { if (tm[q] === mi) continue; const h = hit(c, d, q); if (h > 0.05 && h < RAY_M) { const mq = tm[q]; if (!best.has(mq) || best.get(mq) > h) best.set(mq, h); } }
  if (!best.size) continue;
  rows.push({ a, mesh: nm, c: c.map((v) => +v.toFixed(3)), n: d.map((v) => +v.toFixed(4)), hits: [...best].sort((x, y) => x[1] - y[1]).map(([mq, h]) => [k.meshes[mq].name, +h.toFixed(4)]) });
}
fs.writeFileSync(out, JSON.stringify({ file, tris: T, stackedCells: stacked.size, rows }));
console.log(file, 'tris', T, 'stacked cells', stacked.size, 'rays with a hit', rows.length);

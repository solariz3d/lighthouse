// poke616.js <kn5> <out.json>: read-only. For every vertex of a DRAWN mesh (UNDERSKIN*, APRONSIDE*), the signed height h above each physics surface
// (1ROAD_p*, 1ROAD_APRON_p*, 1ROAD_CATCH_p*) whose triangle it projects into (barycentric, 1 mm tolerance) along that triangle's front normal,
// kept when -0.05 < h < 1.2: a drawn point above a surface a car rides (h > 0) or just under it (z-fight range).
const { readKn5 } = require('C:/Users/nname/Downloads/t180-wt-a614/tools/kn5.cjs'); const fs = require('fs');
const CELL = 4, k = readKn5(process.argv[2]);
const isPhys = (n) => /^1ROAD_(APRON_|CATCH_)?p\d/.test(n), isDrawn = (n) => /^(UNDERSKIN|APRONSIDE)_p\d/.test(n);
const tris = []; k.meshes.forEach((m, mi) => { if (!isPhys(m.name)) return; const P = m.pos, I = m.idx; for (let i = 0; i < I.length; i += 3) tris.push(mi, I[i], I[i + 1], I[i + 2]); });
const NT = tris.length / 4, grid = new Map(), key = (i, j) => i * 100003 + j;
const V = (t, c) => { const m = k.meshes[tris[t * 4]], v = tris[t * 4 + 1 + c] * 3; return [m.pos[v], m.pos[v + 1], m.pos[v + 2]]; };
for (let t = 0; t < NT; t++) { const a = V(t, 0), b = V(t, 1), c = V(t, 2); for (let i = Math.floor(Math.min(a[0], b[0], c[0]) / CELL); i <= Math.floor(Math.max(a[0], b[0], c[0]) / CELL); i++) for (let j = Math.floor(Math.min(a[2], b[2], c[2]) / CELL); j <= Math.floor(Math.max(a[2], b[2], c[2]) / CELL); j++) { const kk = key(i, j); let L = grid.get(kk); if (!L) grid.set(kk, L = []); L.push(t); } }
const sub = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]], dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2], cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
const rows = [];
for (const m of k.meshes) { if (!isDrawn(m.name)) continue; const P = m.pos;
  for (let v = 0; v < P.length; v += 3) { const p = [P[v], P[v + 1], P[v + 2]];
    // the surface's footprint: the cells within 2 m of the point (a steep surface's projection can be off in xz)
    const seen = new Set(); let best = null;
    for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) for (const t of grid.get(key(Math.floor(p[0] / CELL) + di, Math.floor(p[2] / CELL) + dj)) || []) { if (seen.has(t)) continue; seen.add(t);
      const a = V(t, 0), b = V(t, 1), c = V(t, 2), e1 = sub(b, a), e2 = sub(c, a); let n = cross(e1, e2); const L = Math.hypot(...n); if (L < 1e-9) continue; n = n.map((x) => x / L);
      const w = sub(p, a), h = dot(w, n); if (h <= -0.05 || h >= 1.2) continue;
      const q = sub(w, n.map((x) => x * h)), d00 = dot(e1, e1), d01 = dot(e1, e2), d11 = dot(e2, e2), d20 = dot(q, e1), d21 = dot(q, e2), den = d00 * d11 - d01 * d01;
      const bv = (d11 * d20 - d01 * d21) / den, bw = (d00 * d21 - d01 * d20) / den, tol = 0.001 / Math.sqrt(Math.max(d00, d11));
      if (bv < -tol || bw < -tol || bv + bw > 1 + tol) continue;
      if (!best || h > best.h) best = { h, surf: k.meshes[tris[t * 4]].name };
    }
    if (best) rows.push({ mesh: m.name, p: p.map((x) => +x.toFixed(3)), h: +best.h.toFixed(4), surf: best.surf });
  } }
fs.writeFileSync(process.argv[3], JSON.stringify(rows));
const by = {}; const pc = (n) => (n.match(/_(p\d+)_/) || [, '?'])[1];
for (const r of rows) { const kk = `${r.mesh.replace(/_p\d+_chunk_\d+/, '')} ${pc(r.mesh)} over ${r.surf.replace(/_p\d+_chunk_\d+/, '')} ${pc(r.surf)} ${r.h > 0 ? 'ABOVE' : 'under<5cm'}`; const b = (by[kk] = by[kk] || { n: 0, max: -1, min: 9 }); b.n++; b.max = Math.max(b.max, r.h); b.min = Math.min(b.min, r.h); }
console.log(process.argv[2].split(/[\/]/).pop(), 'drawn vertices near or above a physics surface:', rows.length);
for (const [kk, b] of Object.entries(by).sort((x, y) => y[1].n - x[1].n)) console.log(b.n, 'h', b.min.toFixed(3), '..', b.max.toFixed(3), kk);

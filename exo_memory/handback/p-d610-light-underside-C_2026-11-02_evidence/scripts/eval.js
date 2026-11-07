// eval.js <tree> <doc> [out.json]: the export with the light hull and without (lightHull: false): triangles by group, physics nodes byte-equal, and how far every
// vertex of the full skin lies from the light one (the red line kept?)
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), T = process.argv[2], R_ = (p) => require(path.join(T, p));
const D = R_('src/core/document.js'), A = R_('src/core/adapter.js'), FW = R_('src/export/fromwords.js'), { startLayout } = R_('app/core/coreshell.js');
const doc = D.parse(fs.readFileSync(process.argv[3], 'utf8')), segs = A.toSegments(doc), lift = (q) => A.offsetPath(doc, segs, q);
const start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch };
const textures = process.env.TEX ? R_('app/core/textures.js').createCoreTextures({ segments: () => segs, closed: () => !!doc.closed, edge: true }).current() : undefined;
console.log('textures', !!textures);
const build = (light) => { const t = Date.now(); const ex = FW.buildFromSegments(segs, { name: 'x', via: 'test', liftPath: lift, start }, { markers: startLayout(segs, lift, start, { open: !doc.closed }), test: true, lightHull: light, textures }); console.log('export', light ? 'light' : 'full', ((Date.now() - t) / 1e3).toFixed(1), 's'); return ex; };
const full = build(false), light = build(true);
const group = (n) => (/^1(?:ROAD|GRIP\d{3})_APRON/.test(n) ? 'apron' : /^1ROAD_PIT/.test(n) ? 'pit' : /^1(?:ROAD|GRIP\d{3})_/.test(n) ? 'road' : /^UNDERSKIN_/.test(n) ? 'underside' : n.replace(/_.*/, ''));
const count = (ex) => { const g = {}; let t = 0; for (const m of ex.acScene.root.children) { if (m.type !== 'mesh') continue; const x = group(m.name), n = m.indices.length / 3; g[x] = (g[x] || 0) + n; t += n; } g.total = t; return g; };
const cf = count(full), cl = count(light);
console.log('tris full ', JSON.stringify(cf)); console.log('tris light', JSON.stringify(cl));
// every node that is not the underside: name, positions, normals, uvs, indices, material, byte for byte (the kn5 is written from these)
const sig = (ex) => ex.acScene.root.children.filter((m) => m.type === 'mesh' && !/^UNDERSKIN_/.test(m.name)).map((m) => m.name + ':' + crypto.createHash('sha256').update(Buffer.from(m.positions.buffer, m.positions.byteOffset, m.positions.byteLength)).update(Buffer.from(m.indices.buffer, m.indices.byteOffset, m.indices.byteLength)).update(Buffer.from(m.normals.buffer, m.normals.byteOffset, m.normals.byteLength)).update(Buffer.from((m.uvs || new Float32Array()).buffer)).update(String(m.material)).digest('hex').slice(0, 16));
const sf = sig(full), sl = sig(light), same = sf.length === sl.length && sf.every((x, i) => x === sl[i]);
console.log('non-underside meshes', sf.length, 'byte-equal (positions, normals, uvs, indices, material):', same);
if (!same) { const a = new Set(sf), b = new Set(sl); console.log(' only in full', sf.filter((x) => !b.has(x)).slice(0, 5), 'only in light', sl.filter((x) => !a.has(x)).slice(0, 5)); }
// deviation: each full underside vertex to the nearest light underside triangle
const tris = [], tuv = []; for (const m of light.acScene.root.children) { if (m.type !== 'mesh' || !/^UNDERSKIN_/.test(m.name)) continue; const P = m.positions, I = m.indices, U = m.uvs; for (let i = 0; i < I.length; i += 3) { tris.push([I[i], I[i + 1], I[i + 2]].map((k) => [P[3 * k], P[3 * k + 1], P[3 * k + 2]])); tuv.push([I[i], I[i + 1], I[i + 2]].map((k) => [U[2 * k], U[2 * k + 1]])); } }
const C = 4, grid = new Map(); tris.forEach((t, id) => { const lo = [0, 1, 2].map((k) => Math.floor(Math.min(t[0][k], t[1][k], t[2][k]) / C)), hi = [0, 1, 2].map((k) => Math.floor(Math.max(t[0][k], t[1][k], t[2][k]) / C)); for (let x = lo[0]; x <= hi[0]; x++) for (let y = lo[1]; y <= hi[1]; y++) for (let z = lo[2]; z <= hi[2]; z++) { const k = `${x},${y},${z}`; let L = grid.get(k); if (!L) grid.set(k, (L = [])); L.push(id); } });
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
function ptTri(p, a, b, c) {   // Ericson's closest point on a triangle
  const ab = sub(b, a), ac = sub(c, a), ap = sub(p, a), d1 = dot(ab, ap), d2 = dot(ac, ap); if (d1 <= 0 && d2 <= 0) return Math.hypot(...ap);
  const bp = sub(p, b), d3 = dot(ab, bp), d4 = dot(ac, bp); if (d3 >= 0 && d4 <= d3) return Math.hypot(...bp);
  const vc = d1 * d4 - d3 * d2; if (vc <= 0 && d1 >= 0 && d3 <= 0) { const v = d1 / (d1 - d3); return Math.hypot(...sub(p, [a[0] + ab[0] * v, a[1] + ab[1] * v, a[2] + ab[2] * v])); }
  const cp = sub(p, c), d5 = dot(ab, cp), d6 = dot(ac, cp); if (d6 >= 0 && d5 <= d6) return Math.hypot(...cp);
  const vb = d5 * d2 - d1 * d6; if (vb <= 0 && d2 >= 0 && d6 <= 0) { const w = d2 / (d2 - d6); return Math.hypot(...sub(p, [a[0] + ac[0] * w, a[1] + ac[1] * w, a[2] + ac[2] * w])); }
  const va = d3 * d6 - d5 * d4; if (va <= 0 && d4 - d3 >= 0 && d5 - d6 >= 0) { const w = (d4 - d3) / ((d4 - d3) + (d5 - d6)); return Math.hypot(...sub(p, [b[0] + (c[0] - b[0]) * w, b[1] + (c[1] - b[1]) * w, b[2] + (c[2] - b[2]) * w])); }
  const den = 1 / (va + vb + vc), v = vb * den, w = vc * den; return Math.hypot(...sub(p, [a[0] + ab[0] * v + ac[0] * w, a[1] + ab[1] * v + ac[1] * w, a[2] + ab[2] * v + ac[2] * w]));
}
const TD = { n: 0, miss: 0, max: 0, at: null }; const WL = []; let worst = 0, at = null, n = 0; const hist = [0, 0, 0, 0, 0];
for (const m of full.acScene.root.children) {
  if (m.type !== 'mesh' || !/^UNDERSKIN_/.test(m.name)) continue;
  const P = m.positions;
  for (let v = 0; v < P.length / 3; v++) {
    const p = [P[3 * v], P[3 * v + 1], P[3 * v + 2]], c = p.map((x) => Math.floor(x / C)); let d = Infinity;
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) for (const id of grid.get(`${c[0] + x},${c[1] + y},${c[2] + z}`) || []) { const t = tris[id]; d = Math.min(d, ptTri(p, t[0], t[1], t[2])); }
    { let best = null; const u = full.acScene.root.children; void u; const uu = m.uvs[2 * v], vv = m.uvs[2 * v + 1];
      for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) for (const id of grid.get([c[0] + x, c[1] + y, c[2] + z].join(",")) || []) { const [a, b, cc] = tuv[id], x1 = b[0] - a[0], y1 = b[1] - a[1], x2 = cc[0] - a[0], y2 = cc[1] - a[1], det = x1 * y2 - x2 * y1; if (!(Math.abs(det) > 1e-18)) continue; const px = uu - a[0], py = vv - a[1], l1 = (px * y2 - x2 * py) / det, l2 = (x1 * py - px * y1) / det, l0 = 1 - l1 - l2, out = Math.max(0, -l0, -l1, -l2); if (out > 1e-4) continue; const T = tris[id], q = [0, 1, 2].map((k) => T[0][k] * l0 + T[1][k] * l1 + T[2][k] * l2), dd = Math.hypot(...sub(p, q)); if (best === null || dd < best) best = dd; }
      if (best === null) TD.miss++; else { TD.n++; if (best > TD.max) { TD.max = best; TD.at = p; } } }
    n++; if (d > worst) { worst = d; at = p; } if (d > 0.04) WL.push([d, p]);
    hist[d < 0.001 ? 0 : d < 0.01 ? 1 : d < 0.03 ? 2 : d < 0.05 ? 3 : 4]++;
  }
}
console.log('full underside vertices', n, 'farthest from the light one', (worst * 100).toFixed(2), 'cm at', at && at.map((x) => x.toFixed(1)).join(','), 'hist <1mm,<1cm,<3cm,<5cm,>=5cm', JSON.stringify(hist));
console.log('texel drift: vertices found by uv', TD.n, 'not found', TD.miss, 'max', (TD.max * 100).toFixed(2), 'cm at', TD.at && TD.at.map((x) => x.toFixed(1)).join(','));
console.log("worst list", JSON.stringify(WL.sort((a, b) => b[0] - a[0]).slice(0, 6).map(([d, p]) => [+(d * 100).toFixed(2), p.map((x) => +x.toFixed(1))])));
if (process.argv[4]) fs.writeFileSync(process.argv[4], JSON.stringify({ cf, cl, same, worst, hist, TD }, null, 1));

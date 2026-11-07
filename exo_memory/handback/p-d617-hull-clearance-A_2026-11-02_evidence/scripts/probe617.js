// probe617.js <t180 tree> <doc.t180track> [out.json]: build the export in node (as test/finalscene_heap.test.js does), then, in the flattened world scene,
// count every pair (a DRAWN mesh of piece A: UNDERSKIN*, APRONSIDE*, anything with no leading digit that is not a marker or paint) x (a PHYSICS road or apron
// of another piece B, B not A and not A's neighbour) whose triangles intersect, plus the drawn vertices on the back of such a surface (within 1.5 m, projecting
// inside it). Reports per piece pair, and the drawn hits' positions. Read-only.
'use strict';
const fs = require('fs'), path = require('path');
const [R, DOC, OUT] = process.argv.slice(2), rq = (p) => require(path.join(R, p));
const D = rq('src/core/document.js'), A = rq('src/core/adapter.js'), FW = rq('src/export/fromwords.js'), { startLayout } = rq('app/core/coreshell.js'), AR = rq('src/export/acready.js');
const doc = D.parse(fs.readFileSync(DOC, 'utf8'));
const segs = A.toSegments(doc), lift = (q) => A.offsetPath(doc, segs, q), start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch };
const t0 = Date.now(), test = !doc.closed;
const b = FW.buildFromSegments(segs, { name: doc.name, via: 'probe617', liftPath: lift, start, pitLane: doc.pitLane }, { markers: startLayout(segs, lift, start, test ? { open: true } : undefined), test });
console.log('built in', ((Date.now() - t0) / 1000).toFixed(0), 's; scene check refuse', b.sceneCheck.refuse.length, 'warn', b.sceneCheck.warn.length);
const flat = AR.flattenForAc(b.scene), meshes = []; (function walk(n) { if (n.type === 'mesh') meshes.push(n); for (const c of n.children || []) walk(c); })(flat.root);
const pieceIds = segs.map((g, i) => g.id || doc.pieces[i] && doc.pieces[i].id);
const pieceOf = (n) => { const m = n.match(/_p(\d+)_/) || n.match(/_p(\d+)$/); return m ? +m[1] : null; };
const isPhys = (n) => /^1(ROAD|GRIP)/.test(n) && !/CATCH/.test(n), isDrawn = (n) => /^(UNDERSKIN|APRONSIDE|HULL)/.test(n) || (/^[A-Z]/.test(n) && !/^(AC_|PAINT|1)/.test(n) && /SKIN|APRON|HULL|JOIN/.test(n));
const names = {}; for (const m of meshes) { const c = m.name.replace(/\d+/g, '#'); names[c] = (names[c] || 0) + 1; }
console.log('mesh name classes:', Object.entries(names).sort((x, y) => y[1] - x[1]).slice(0, 25).map(([k, v]) => `${k} x${v}`).join(' | '));
// triangles in a grid
const C = 4, grid = new Map(), T = [];
const tri = (m, t) => [0, 1, 2].map((j) => { const v = m.indices[t + j] * 3; return [m.positions[v], m.positions[v + 1], m.positions[v + 2]]; });
meshes.forEach((m, mi) => { if (!isPhys(m.name)) return; const p = pieceOf(m.name); for (let t = 0; t < m.indices.length; t += 3) { const v = tri(m, t), id = T.push({ v, mi, p }) - 1;
  const lo = [0, 1, 2].map((c) => Math.floor(Math.min(v[0][c], v[1][c], v[2][c]) / C)), hi = [0, 1, 2].map((c) => Math.floor(Math.max(v[0][c], v[1][c], v[2][c]) / C));
  for (let x = lo[0]; x <= hi[0]; x++) for (let y = lo[1]; y <= hi[1]; y++) for (let z = lo[2]; z <= hi[2]; z++) { const k = x + ',' + y + ',' + z; let L = grid.get(k); if (!L) grid.set(k, L = []); L.push(id); } } });
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
function segTri(p, q, t) { const d = sub(q, p), e1 = sub(t[1], t[0]), e2 = sub(t[2], t[0]), h = cr(d, e2), a = dot(e1, h); if (Math.abs(a) < 1e-12) return null; const f = 1 / a, s = sub(p, t[0]), u = f * dot(s, h); if (u < 0 || u > 1) return null; const qq = cr(s, e1), v = f * dot(d, qq); if (v < 0 || u + v > 1) return null; const tt = f * dot(e2, qq); if (tt < 1e-6 || tt > 1 - 1e-6) return null; return [p[0] + d[0] * tt, p[1] + d[1] * tt, p[2] + d[2] * tt]; }
const near = (a, b) => a === null || b === null || Math.abs(a - b) <= 1 || (doc.closed && Math.abs(a - b) === segs.length - 1);
const pairs = {}, hits = [];
meshes.forEach((m) => { if (!isDrawn(m.name)) return; const pa = pieceOf(m.name);
  for (let t = 0; t < m.indices.length; t += 3) { const v = tri(m, t), lo = [0, 1, 2].map((c) => Math.floor(Math.min(v[0][c], v[1][c], v[2][c]) / C)), hi = [0, 1, 2].map((c) => Math.floor(Math.max(v[0][c], v[1][c], v[2][c]) / C)), seen = new Set();
    for (let x = lo[0]; x <= hi[0]; x++) for (let y = lo[1]; y <= hi[1]; y++) for (let z = lo[2]; z <= hi[2]; z++) for (const id of grid.get(x + ',' + y + ',' + z) || []) { if (seen.has(id)) continue; seen.add(id); const o = T[id]; if (near(pa, o.p)) continue;
      let X = null; for (const [i, j] of [[0, 1], [1, 2], [2, 0]]) { X = X || segTri(v[i], v[j], o.v) || segTri(o.v[i], o.v[j], v); }
      if (X) { const k = `${m.name.replace(/_chunk.*|_\d+.*$/, '').replace(/_p\d+/, '')} p${pa} x ${meshes[o.mi].name.replace(/_p\d+.*$/, '')} p${o.p}`; pairs[k] = (pairs[k] || 0) + 1; hits.push({ drawn: m.name, phys: meshes[o.mi].name, at: X.map((q) => +q.toFixed(3)) }); } } } });
const total = hits.length;
console.log('drawn x other-piece physics intersecting pairs:', total, JSON.stringify(pairs));
if (hits.length) { const ext = [0, 1, 2].map((c) => [Math.min(...hits.map((h) => h.at[c])).toFixed(2), Math.max(...hits.map((h) => h.at[c])).toFixed(2)]); console.log('extent x/y/z', JSON.stringify(ext)); }
if (OUT) fs.writeFileSync(OUT, JSON.stringify({ doc: DOC, total, pairs, hits, warn: b.sceneCheck.warn.map((w) => w.message), refuse: b.sceneCheck.refuse.map((w) => w.message) }));

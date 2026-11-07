// where617.js <t180 tree> <doc> <upper piece id e.g. 38>: build the export, then for every vertex of the upper piece's FULL skin (before the light hull: lightHull
// off) that lies on the back of another piece's physics surface (not a neighbour), its road vertex: the column k of K, the distance across to the nearer edge (m),
// the skin's depth there, the main s, and how far along the hang direction (from the road vertex, away from the driver) the other surface is. Read-only.
'use strict';
const fs = require('fs'), path = require('path');
const [R, DOC, UP] = process.argv.slice(2), rq = (p) => require(path.join(R, p)), upId = +UP;
const D = rq('src/core/document.js'), A = rq('src/core/adapter.js'), FW = rq('src/export/fromwords.js'), { startLayout } = rq('app/core/coreshell.js'), AR = rq('src/export/acready.js');
const doc = D.parse(fs.readFileSync(DOC, 'utf8'));
const segs = A.toSegments(doc), lift = (q) => A.offsetPath(doc, segs, q), start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch };
const b = FW.buildFromSegments(segs, { name: doc.name, via: 'where617', liftPath: lift, start, pitLane: doc.pitLane }, { markers: startLayout(segs, lift, start), lightHull: false });
const flat = AR.flattenForAc(b.scene), meshes = []; (function walk(n) { if (n.type === 'mesh') meshes.push(n); for (const c of n.children || []) walk(c); })(flat.root);
const pieceOf = (n) => { const m = n.match(/_p(\d+)_/); return m ? +m[1] : null; };
const isPhys = (n) => /^1(ROAD|GRIP)/.test(n) && !/CATCH/.test(n);
const near = (a, c) => a === null || c === null || Math.abs(a - c) <= 1;
const C = 4, grid = new Map(), T = [];
const sub = (a, c) => [a[0] - c[0], a[1] - c[1], a[2] - c[2]], dot = (a, c) => a[0] * c[0] + a[1] * c[1] + a[2] * c[2], cr = (a, c) => [a[1] * c[2] - a[2] * c[1], a[2] * c[0] - a[0] * c[2], a[0] * c[1] - a[1] * c[0]];
meshes.forEach((m) => { if (!isPhys(m.name)) return; const p = pieceOf(m.name); if (near(p, upId)) return; for (let t = 0; t < m.indices.length; t += 3) { const v = [0, 1, 2].map((j) => { const i = m.indices[t + j] * 3; return [m.positions[i], m.positions[i + 1], m.positions[i + 2]]; }); const id = T.push({ v, name: m.name }) - 1;
  const lo = [0, 1, 2].map((c) => Math.floor(Math.min(v[0][c], v[1][c], v[2][c]) / C)), hi = [0, 1, 2].map((c) => Math.floor(Math.max(v[0][c], v[1][c], v[2][c]) / C));
  for (let x = lo[0]; x <= hi[0]; x++) for (let y = lo[1]; y <= hi[1]; y++) for (let z = lo[2]; z <= hi[2]; z++) { const k = x + ',' + y + ',' + z; let L = grid.get(k); if (!L) grid.set(k, L = []); L.push(id); } } });
function ray(o, d, len) { let best = null; const seen = new Set(); for (let u = 0; u <= len + C; u += C / 2) { const q = [o[0] + d[0] * Math.min(u, len), o[1] + d[1] * Math.min(u, len), o[2] + d[2] * Math.min(u, len)], k = q.map((x) => Math.floor(x / C)).join(',');
  for (const id of grid.get(k) || []) { if (seen.has(id)) continue; seen.add(id); const [a, bb, c] = T[id].v, e1 = sub(bb, a), e2 = sub(c, a), p = cr(d, e2), det = dot(e1, p); if (Math.abs(det) < 1e-12) continue; const iv = 1 / det, tv = sub(o, a), uu = dot(tv, p) * iv; if (uu < 0 || uu > 1) continue; const qq = cr(tv, e1), vv = dot(d, qq) * iv; if (vv < 0 || uu + vv > 1) continue; const t = dot(e2, qq) * iv; if (t > 0 && t <= len && (!best || t < best.t)) best = { t, name: T[id].name }; } } return best; }
// the upper piece's road cells and their skins, by cell name (1ROAD_pNN_body_i_j <-> UNDERSKIN_pNN_body_i_j)
const byName = new Map(meshes.map((m) => [m.name, m])), K = b.segments ? null : null;
const st = []; let worst = null;
for (const m of meshes) { if (!new RegExp(`^1ROAD_p${upId}_body`).test(m.name)) continue; const sk = byName.get(m.name.replace(/^1ROAD/, 'UNDERSKIN')); if (!sk || !sk.gridColumns) continue;
  const Cn = sk.gridColumns, n = m.positions.length / 3, Rr = sk.positions.length / 3 >= 0 ? null : null;
  // the road's K: rows of K; the skin's grid R x Cn with its columns every step (underskin.js skinColumns)
  const KK = (() => { for (let k = 3; k <= n; k++) if (n % k === 0) { const step = Math.max(1, Math.ceil((k - 1) / 31)); const cols = []; for (let c = 0; c < k; c += step) cols.push(c); if (cols[cols.length - 1] !== k - 1) cols.push(k - 1); if (cols.length === Cn && (n / k) * Cn <= sk.positions.length / 3) return { k, cols }; } return null; })();
  if (!KK) continue; const Kc = KK.k, cols = KK.cols, rows = n / Kc;
  for (let r = 0; r < rows; r++) { const rp = (k) => [m.positions[(r * Kc + k) * 3], m.positions[(r * Kc + k) * 3 + 1], m.positions[(r * Kc + k) * 3 + 2]];
    const acc = [0]; for (let k = 1; k < Kc; k++) acc.push(acc[k - 1] + Math.hypot(...sub(rp(k), rp(k - 1))));
    cols.forEach((k, c) => { const P = rp(k), S = [sk.positions[(r * Cn + c) * 3], sk.positions[(r * Cn + c) * 3 + 1], sk.positions[(r * Cn + c) * 3 + 2]], dv = sub(S, P), dep = Math.hypot(...dv); if (!(dep > 0)) return;
      const d = dv.map((x) => x / dep), h = ray(P, d, dep + 1.0); if (!h) return;
      const edge = Math.min(acc[k], acc[Kc - 1] - acc[k]); st.push({ cell: m.name, r, k, K: Kc, edge: +edge.toFixed(2), width: +acc[Kc - 1].toFixed(1), depth: +dep.toFixed(3), other: +h.t.toFixed(3), hit: h.name, P: P.map((x) => +x.toFixed(2)) });
      if (!worst || dep - h.t > worst.over) worst = { over: dep - h.t, cell: m.name, r, k, edge, dep, t: h.t }; }); } }
const pierce = st.filter((x) => x.other < x.depth);
console.log(`p${upId} skin vertices whose hang meets another piece's physics within depth + 1 m: ${st.length}; inside the depth (piercing): ${pierce.length}`);
console.log('worst', JSON.stringify(worst));
const hist = {}; for (const x of st) { const k = `edge ${Math.floor(x.edge / 2) * 2}-${Math.floor(x.edge / 2) * 2 + 2} m`; hist[k] = hist[k] || [0, 0, 9, 0]; hist[k][0]++; if (x.other < x.depth) hist[k][1]++; hist[k][2] = Math.min(hist[k][2], x.other); hist[k][3] = Math.max(hist[k][3], x.depth); }
for (const [k, v] of Object.entries(hist).sort()) console.log(k.padEnd(14), 'vertices', v[0], 'piercing', v[1], 'other surface at', v[2].toFixed(3), 'skin depth up to', v[3].toFixed(3));
const cells = [...new Set(st.map((x) => x.cell))]; console.log('cells', cells.length, cells.slice(0, 6).join(' '), '... widths', [...new Set(st.map((x) => x.width))].slice(0, 5).join(' '));
fs.writeFileSync(path.join(__dirname, `where-p${upId}-${path.basename(DOC, '.t180track')}.json`), JSON.stringify(st));

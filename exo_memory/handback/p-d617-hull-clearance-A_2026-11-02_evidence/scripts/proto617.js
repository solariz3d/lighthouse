// proto617.js <t180 tree> [gap m] [cup deg] [radius m]: a two-pass test track (a helix: one long constant turn at a pitch, the second pass `gap` above the
// first), exported in node; counts drawn x other-pass drivable intersections (other pass: stations more than 25 m apart), and prints what validation said.
'use strict';
const path = require('path');
const [R, G = '2.5', CUP = '15.5', RAD = '120', DR = '0'] = process.argv.slice(2), rq = (p) => require(path.join(R, p));
const D = rq('src/core/document.js'), { extend } = rq('src/core/extend.js'), A = rq('src/core/adapter.js'), FW = rq('src/export/fromwords.js'), AR = rq('src/export/acready.js'), { startLayout } = rq('app/core/coreshell.js');
const gap = +G, Rr = +RAD, turn = 2 * Math.PI * Rr, p = Math.atan(gap / turn);
let d = D.createDoc('two passes'); d = { ...d, start: { ...d.start, pitch: p } };
d = extend(d, { length: 300, family: 'bowl', first: { w: 20, c: +CUP } });
const R2 = Rr + +DR, gapP = Math.atan(gap / (0.75 * turn + 0.25 * 2 * Math.PI * R2));
d = extend(d, { length: 0.75 * turn, transition: 40, targets: { kh: Math.cos(p) / Rr } });
d = extend(d, { length: 0.6 * 2 * Math.PI * R2, transition: 40, targets: { kh: Math.cos(p) / R2 } });
const segs = A.toSegments(d), lift = (q) => A.offsetPath(d, segs, q), start = { pos: d.start.pos.slice(), theta: d.start.heading, p: d.start.pitch };
const t0 = Date.now();
const b = FW.buildFromSegments(segs, { name: d.name, via: 'proto', liftPath: lift, start }, { markers: startLayout(segs, lift, start, { open: true }), test: true, ...(process.env.FULL ? { lightHull: false } : {}) });
console.log('built in', ((Date.now() - t0) / 1000).toFixed(1), 's; pieces', d.pieces.map((x) => x.id).join(' '), '; reds', JSON.stringify(b.test && b.test.reds), '; amber', b.validation.amber.map((a) => a.code || a.id || a.text).slice(0, 6).join(' | '));
const flat = AR.weldApronJoints(AR.weldSeams(AR.flattenForAc(b.scene)));
const S = b.path.samples, pieceOfSample = S.map((q) => b.segments[q.seg] && b.segments[q.seg].id);
const sOf = (pt, name) => { const pc = name && (name.match(/_(pd+)_/) || [])[1]; let bi = -1, bd = Infinity; for (let i = 0; i < S.length; i++) { if (pc && pieceOfSample[i] !== pc) continue; const q = S[i].pos, dd = (q[0] - pt[0]) ** 2 + (q[1] - pt[1]) ** 2 + (q[2] - pt[2]) ** 2; if (dd < bd) { bd = dd; bi = i; } } return bi < 0 ? null : S[bi].s; };
const drive = (n) => /^1(ROAD|GRIP\d{3})_/.test(n) && !/CATCH/.test(n), drawn = (n) => (process.env.PHYS ? drive(n) : /^(UNDERSKIN|APRONSIDE|APRONLIP)_/.test(n));
const sub = (a, c) => [a[0] - c[0], a[1] - c[1], a[2] - c[2]], dot = (a, c) => a[0] * c[0] + a[1] * c[1] + a[2] * c[2], cr = (a, c) => [a[1] * c[2] - a[2] * c[1], a[2] * c[0] - a[0] * c[2], a[0] * c[1] - a[1] * c[0]];
function segTri(p0, q0, t) { const dd = sub(q0, p0), e1 = sub(t[1], t[0]), e2 = sub(t[2], t[0]), h = cr(dd, e2), a = dot(e1, h); if (Math.abs(a) < 1e-12) return false; const f = 1 / a, s = sub(p0, t[0]), u = f * dot(s, h); if (u < 0 || u > 1) return false; const qq = cr(s, e1), v = f * dot(dd, qq); if (v < 0 || u + v > 1) return false; const tt = f * dot(e2, qq); return tt > 1e-6 && tt < 1 - 1e-6; }
const C = 4, grid = new Map(), T = [];
for (const m of flat.root.children) { if (m.type !== 'mesh' || !drive(m.name)) continue; for (let t = 0; t < m.indices.length; t += 3) { const v = [0, 1, 2].map((j) => { const i = m.indices[t + j] * 3; return [m.positions[i], m.positions[i + 1], m.positions[i + 2]]; }); const cen = [0, 1, 2].map((c) => (v[0][c] + v[1][c] + v[2][c]) / 3), id = T.push({ v, s: sOf(cen, m.name), name: m.name }) - 1;
  const lo = [0, 1, 2].map((c) => Math.floor(Math.min(v[0][c], v[1][c], v[2][c]) / C)), hi = [0, 1, 2].map((c) => Math.floor(Math.max(v[0][c], v[1][c], v[2][c]) / C));
  for (let x = lo[0]; x <= hi[0]; x++) for (let y = lo[1]; y <= hi[1]; y++) for (let z = lo[2]; z <= hi[2]; z++) { const k = x + ',' + y + ',' + z; let L = grid.get(k); if (!L) grid.set(k, L = []); L.push(id); } } }
let pairs = 0; const by = {}, sAt = [];
for (const m of flat.root.children) { if (m.type !== 'mesh' || !drawn(m.name)) continue; for (let t = 0; t < m.indices.length; t += 3) { const v = [0, 1, 2].map((j) => { const i = m.indices[t + j] * 3; return [m.positions[i], m.positions[i + 1], m.positions[i + 2]]; }); let s0 = null; const seen = new Set();
  const lo = [0, 1, 2].map((c) => Math.floor(Math.min(v[0][c], v[1][c], v[2][c]) / C)), hi = [0, 1, 2].map((c) => Math.floor(Math.max(v[0][c], v[1][c], v[2][c]) / C));
  for (let x = lo[0]; x <= hi[0]; x++) for (let y = lo[1]; y <= hi[1]; y++) for (let z = lo[2]; z <= hi[2]; z++) for (const id of grid.get(x + ',' + y + ',' + z) || []) { if (seen.has(id)) continue; seen.add(id); const o = T[id];
    if (s0 === null) s0 = sOf([0, 1, 2].map((c) => (v[0][c] + v[1][c] + v[2][c]) / 3), m.name); if (Math.abs(o.s - s0) <= 25) continue;
    let X = false; for (const [i, j] of [[0, 1], [1, 2], [2, 0]]) X = X || segTri(v[i], v[j], o.v) || segTri(o.v[i], o.v[j], v);
    if (X) { pairs++; const k = m.name.replace(/_p\d+.*/, '') + ' x ' + o.name.replace(/_p\d+.*/, ''); by[k] = (by[k] || 0) + 1; sAt.push(s0); } } } }
console.log('drawn x other-pass drivable pairs:', pairs, JSON.stringify(by), sAt.length ? `s ${Math.min(...sAt).toFixed(0)}-${Math.max(...sAt).toFixed(0)}` : '');
console.log('scene check: refuse', b.sceneCheck.refuse.map((f) => f.kind).join(',') || '-', 'warn', b.sceneCheck.warn.map((f) => f.message.slice(0, 90)).join(' | ') || '-');
// debug: hull present? and the passes' nearest approach (stations > 25 m apart, horizontally within 3 m)
{ const cls = {}; for (const m of flat.root.children) if (m.type === 'mesh') { const c = m.name.replace(/\d+/g, '#'); cls[c] = (cls[c] || 0) + 1; } console.log('meshes', JSON.stringify(cls).slice(0, 300));
  let best = null; for (let i = 0; i < S.length; i += 2) for (let j = i + 1; j < S.length; j += 2) { if (S[j].s - S[i].s <= 25) continue; const a = S[i].pos, c = S[j].pos, h = Math.hypot(a[0] - c[0], a[2] - c[2]); if (h < 3) { const v = Math.abs(a[1] - c[1]); if (!best || v < best.v) best = { v, si: S[i].s, sj: S[j].s, h }; } }
  console.log('nearest stacked stations', JSON.stringify(best), 'path length', S[S.length - 1].s.toFixed(0), 'segments', segs.map((g) => g.word + ':' + g.length.toFixed(0)).join(' ')); }
// debug: each hit's drawn triangle: is it under the upper road or outside its edge (under its plank)?
if (process.env.WHERE) {
  const upper = (m) => m.type === 'mesh' && /^1ROAD_/.test(m.name) && !/APRON|CATCH/.test(m.name), up = [];
  for (const m of flat.root.children) if (upper(m)) for (let i = 0; i < m.positions.length; i += 3) { const p = [m.positions[i], m.positions[i + 1], m.positions[i + 2]]; if (sOf(p) > 900) up.push(p); }
  for (const m of flat.root.children) { if (m.type !== 'mesh' || !drawn(m.name)) continue; for (let t = 0; t < m.indices.length; t += 3) { const v = [0, 1, 2].map((j) => { const i = m.indices[t + j] * 3; return [m.positions[i], m.positions[i + 1], m.positions[i + 2]]; });
    const c = [0, 1, 2].map((k) => (v[0][k] + v[1][k] + v[2][k]) / 3); let hit = false; const seen = new Set();
    for (const id of grid.get(c.map((x) => Math.floor(x / C)).join(',')) || []) { const o = T[id]; if (Math.abs(o.s - sOf(c)) <= 25) continue; for (const [i, j] of [[0, 1], [1, 2], [2, 0]]) hit = hit || segTri(v[i], v[j], o.v) || segTri(o.v[i], o.v[j], v); }
    if (!hit) continue; let bd = Infinity, bp = null; for (const p of up) { const d = Math.hypot(p[0] - c[0], p[2] - c[2]); if (d < bd) { bd = d; bp = p; } }
    console.log(m.name, 'centre', c.map((x) => x.toFixed(1)).join(','), 'nearest upper-road vertex (plan)', bd.toFixed(2), 'm, it is', (bp[1] - c[1]).toFixed(2), 'm above'); } } }
if (process.env.REAL) { const H = [10.6, 5.1, 285.1]; for (const m of flat.root.children) { if (m.type !== 'mesh' || !/^1ROAD_APRON/.test(m.name)) continue; for (let t = 0; t < m.indices.length; t += 3) { const v = [0, 1, 2].map((j) => { const i = m.indices[t + j] * 3; return [m.positions[i], m.positions[i + 1], m.positions[i + 2]]; }); if (v.some((p) => Math.hypot(p[0] - H[0], p[1] - H[1], p[2] - H[2]) < 1.5)) console.log('real', m.name, v.map((p) => p.map((x) => x.toFixed(2)).join(',')).join(' | ')); } } }
if (process.env.SEGIDS) console.log('segment ids', [...new Set(b.segments.map((g) => g.id))].slice(0, 8).join(' '), '| a mesh name', flat.root.children.find((m) => m.type === 'mesh' && /^1ROAD_p/.test(m.name)).name);

// skin436.js (D436, P): every vertex of the kn5's non-road classes (UNDERSKIN, 1ROAD_CATCH, 1ROAD_PIT_*, PAINT_*) within +-W m of each joint, in the
// station frame, with its signed distance from the core's road profile (+ above the road). The underskin should sit about -0.5 m, the catch -0.3 m;
// anything at or above the road at a joint is a block in the picture.   node skin436.js <tree> <save> <kn5> <jointsCSV> [W=60]
const fs = require('fs'), path = require('path'); const [T, F, K, J, Wr] = process.argv.slice(2); const W = Wr ? +Wr : 60;
const D = require(path.join(T, 'src/core/document.js')), AD = require(path.join(T, 'src/core/adapter.js')), Prof = require(path.join(T, 'src/geom/profile.js')), { readKn5 } = require(path.join(T, 'tools/kn5.cjs'));
const doc = D.parse(fs.readFileSync(F, 'utf8')); const { segments, path: p } = AD.toPath(doc, { step: 2 }); const S = p.samples, LAP = doc.pieces.reduce((a, q) => a + q.length, 0);
const segS0 = []; { let a = S[0].s; for (const g of segments) { segS0.push(a); a += g.length; } }
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const G = 10, sg = new Map(); S.forEach((sm, i) => { const k = Math.floor(sm.pos[0] / G) + ',' + Math.floor(sm.pos[2] / G); if (!sg.has(k)) sg.set(k, []); sg.get(k).push(i); });
function station(x) { let best = 1e18, bi = -1; const gx = Math.floor(x[0] / G), gz = Math.floor(x[2] / G); for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) { const L = sg.get((gx + a) + ',' + (gz + b)); if (!L) continue; for (const j of L) { const d = sub(S[j].pos, x); const al = dot(d, S[j].T), yy = dot(d, S[j].U), xx = dot(d, S[j].L); if (Math.abs(xx) > 30) continue; const q = al * al + yy * yy; if (q < best) { best = q; bi = j; } } } if (bi < 0) return null; const sm = S[bi], d = sub(x, sm.pos); return { i: bi, s: sm.s + dot(d, sm.T), x: dot(d, sm.L), y: dot(d, sm.U) }; }
function poly(i, s) { const sm = S[i], seg = segments[sm.seg]; let d = s - segS0[sm.seg]; d = Math.max(0, Math.min(seg.length, d)); const P = Prof.readAt(seg, d); const u0 = P.u[0], u1 = P.u[P.u.length - 1]; const pts = []; const n = Math.max(2, Math.ceil((u1 - u0) / 0.05)); for (let k = 0; k <= n; k++) { const u = u0 + (u1 - u0) * k / n; pts.push(Prof.offsetAt(P, u)); } return pts; }
function distToPoly(pts, x, y) { let best = 1e9, sgn = 1; for (let k = 0; k + 1 < pts.length; k++) { const [ax, ay] = pts[k], [bx, by] = pts[k + 1]; const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1e-12; let t = ((x - ax) * dx + (y - ay) * dy) / L2; t = Math.max(0, Math.min(1, t)); const px = ax + t * dx, py = ay + t * dy; const d = Math.hypot(x - px, y - py); if (d < best) { best = d; sgn = ((x - ax) * dy - (y - ay) * dx) < 0 ? 1 : -1; } } return best * sgn; }
const kn = readKn5(K); const cls = (n) => n.replace(/_p\d+.*$/, '').replace(/_\d+$/, '');
const joints = J.split(',').map(Number); const wrap = (d) => { if (d > LAP / 2) d -= LAP; if (d < -LAP / 2) d += LAP; return d; };
const stat = {};
for (const m of kn.meshes) {
  if (/^1ROAD(?!_PIT|_CATCH)|^1GRIP/.test(m.name)) continue; const n = m.pos.length / 3;
  for (let i = 0; i < n; i++) {
    const v = [m.pos[i * 3], m.pos[i * 3 + 1], m.pos[i * 3 + 2]]; const st = station(v); if (!st) continue;
    for (const j of joints) { if (Math.abs(wrap(st.s - j % LAP)) > W) continue; const d = distToPoly(poly(st.i, st.s), st.x, st.y); const key = j + ' ' + cls(m.name); const e = stat[key] || (stat[key] = { n: 0, min: 1e9, max: -1e9, above: [], at: null }); e.n++; if (d < e.min) e.min = d; if (d > e.max) { e.max = d; e.at = { s: st.s, x: st.x, y: st.y, mesh: m.name }; } if (d > -0.05) e.above.push({ s: +st.s.toFixed(2), x: +st.x.toFixed(2), d: +d.toFixed(3), mesh: m.name }); }
  }
}
for (const [k, e] of Object.entries(stat).sort()) console.log(k.padEnd(26), 'verts', String(e.n).padStart(6), 'distance from the road surface: min', e.min.toFixed(3), 'max', e.max.toFixed(3), 'm at s', e.at.s.toFixed(1), 'x', e.at.x.toFixed(2), e.at.mesh, '| at or above the road (> -0.05 m):', e.above.length, e.above.length ? JSON.stringify(e.above.slice(0, 6)) : '');

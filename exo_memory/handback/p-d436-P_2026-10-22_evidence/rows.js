// rows.js (D436, P): every ROAD-class vertex of an exported kn5 placed in the core's station frame (s along, x across, y up), against the core's own
// cross-section at that station (adapter.toPath step 2 + profile.readAt/offsetAt): the station is the sample nearest in (along, up), |x| <= 20 m, so a stacked pass is never taken for the row; the residual is the vertex's distance from the profile polyline.
// Reports: per mesh class the largest residual on the lap; within +-W m of each closer joint every row (one per mesh and station) with its max residual,
// its edge x against the profile's, and the step between consecutive rows at fixed x (second difference of the kn5 height); and at every s where two
// meshes both have a row (a chunk seam) the largest mismatch between them.   node rows.js <tree> <save> <kn5> <jointsCSV> [W=60] [out.json]
const fs = require('fs'), path = require('path'); const [T, F, K, J, Wraw, OUT] = process.argv.slice(2); const W = Wraw ? +Wraw : 60, TH = 0.02;
const D = require(path.join(T, 'src/core/document.js')), AD = require(path.join(T, 'src/core/adapter.js')), Prof = require(path.join(T, 'src/geom/profile.js')), { readKn5 } = require(path.join(T, 'tools/kn5.cjs'));
const doc = D.parse(fs.readFileSync(F, 'utf8')); const { segments, path: p } = AD.toPath(doc, { step: 2 }); const S = p.samples, LAP = doc.pieces.reduce((a, q) => a + q.length, 0);
const segS0 = []; { let a = S[0].s; for (const g of segments) { segS0.push(a); a += g.length; } }
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const G = 10, sg = new Map(); S.forEach((sm, i) => { const k = Math.floor(sm.pos[0] / G) + ',' + Math.floor(sm.pos[2] / G); if (!sg.has(k)) sg.set(k, []); sg.get(k).push(i); });
function station(x) { let best = 1e18, bi = -1; const gx = Math.floor(x[0] / G), gz = Math.floor(x[2] / G); for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) { const L = sg.get((gx + a) + ',' + (gz + b)); if (!L) continue; for (const j of L) { const d = sub(S[j].pos, x); const al = dot(d, S[j].T), yy = dot(d, S[j].U), xx = dot(d, S[j].L); if (Math.abs(xx) > 20) continue; const q = al * al + yy * yy; if (q < best) { best = q; bi = j; } } } if (bi < 0) return null; const sm = S[bi], d = sub(x, sm.pos); return { i: bi, s: sm.s + dot(d, sm.T), x: dot(d, sm.L), y: dot(d, sm.U), along: dot(d, sm.T) }; }
const polyCache = new Map();
function poly(i, s) { const key = i + ':' + s.toFixed(3); if (polyCache.has(key)) return polyCache.get(key); const sm = S[i], seg = segments[sm.seg]; let d = s - segS0[sm.seg]; d = Math.max(0, Math.min(seg.length, d)); const P = Prof.readAt(seg, d); const u0 = P.u[0], u1 = P.u[P.u.length - 1]; const pts = []; const n = Math.max(2, Math.ceil((u1 - u0) / 0.05)); for (let k = 0; k <= n; k++) { const u = u0 + (u1 - u0) * k / n; pts.push(Prof.offsetAt(P, u)); } const r = { pts, xR: pts[0][0], xL: pts[pts.length - 1][0], yR: pts[0][1], yL: pts[pts.length - 1][1] }; if (polyCache.size < 400000) polyCache.set(key, r); return r; }
function distToPoly(pts, x, y) { let best = 1e9, sgn = 1; for (let k = 0; k + 1 < pts.length; k++) { const [ax, ay] = pts[k], [bx, by] = pts[k + 1]; const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1e-12; let t = ((x - ax) * dx + (y - ay) * dy) / L2; t = Math.max(0, Math.min(1, t)); const px = ax + t * dx, py = ay + t * dy; const d = Math.hypot(x - px, y - py); if (d < best) { best = d; sgn = ((x - ax) * dy - (y - ay) * dx) < 0 ? 1 : -1; } } return best * sgn; }
function yAt(pts, x) { for (let k = 0; k + 1 < pts.length; k++) { const [ax, ay] = pts[k], [bx, by] = pts[k + 1]; if ((x - ax) * (x - bx) <= 0 && ax !== bx) return ay + (by - ay) * (x - ax) / (bx - ax); } return NaN; }
const isRoad = (n) => /^1ROAD(?!_PIT|_CATCH)|^1GRIP/.test(n);
const kn = readKn5(K); const cls = (n) => n.replace(/_p\d+.*$/, '').replace(/_\d+$/, '');
const rows = new Map(); const lapMax = {};
for (const m of kn.meshes) {
  if (!/^1ROAD|^1GRIP|^UNDERSKIN/.test(m.name)) continue; const c = cls(m.name); const n = m.pos.length / 3;
  for (let i = 0; i < n; i++) {
    const v = [m.pos[i * 3], m.pos[i * 3 + 1], m.pos[i * 3 + 2]]; const st = station(v); if (!st) continue; if (Math.abs(st.x) > 40 || Math.abs(st.y) > 40) continue;
    let res = NaN; if (isRoad(m.name)) { const P = poly(st.i, st.s); res = distToPoly(P.pts, st.x, st.y); }
    const key = m.name + '|' + Math.round(st.s * 1000); let r = rows.get(key); if (!r) { r = { mesh: m.name, cls: c, s: st.s, i: st.i, verts: [] }; rows.set(key, r); } r.verts.push({ x: st.x, y: st.y, res });
    if (!isNaN(res)) { const a = Math.abs(res); if (!lapMax[c] || a > lapMax[c].a) lapMax[c] = { a, s: st.s, x: st.x, y: st.y, mesh: m.name }; }
  }
}
console.log('lap', LAP.toFixed(1), 'm; samples', S.length, '; rows', rows.size);
console.log('largest |residual| vs the core, whole lap, per class:'); for (const [c, v] of Object.entries(lapMax)) console.log('  ', c.padEnd(12), (v.a * 1000).toFixed(1).padStart(7), 'mm at s', v.s.toFixed(1), 'x', v.x.toFixed(2), 'y', v.y.toFixed(3), v.mesh);
const over = [...rows.values()].filter((r) => isRoad(r.mesh)).map((r) => ({ r, a: Math.max(...r.verts.map((v) => Math.abs(v.res))) })).filter((o) => o.a > TH).sort((a, b) => a.r.s - b.r.s);
console.log('rows anywhere with a vertex more than', TH * 1000, 'mm off the core:', over.length); for (const o of over.slice(0, 40)) console.log('  ', o.r.mesh.padEnd(24), 's', o.r.s.toFixed(3).padStart(10), 'max', (o.a * 1000).toFixed(1), 'mm, verts', o.r.verts.length);
const out = { lap: LAP, lapMax, over: over.map((o) => ({ mesh: o.r.mesh, s: o.r.s, max: o.a })), joints: {} };
const sorted = [...rows.values()].sort((a, b) => a.s - b.s || a.mesh.localeCompare(b.mesh));
const near = (s0) => sorted.filter((r) => { let d = r.s - s0; if (p.closed) { if (d > LAP / 2) d -= LAP; if (d < -LAP / 2) d += LAP; } return Math.abs(d) <= W; });
for (const j of J.split(',').map(Number)) {
  const js = j % LAP; console.log(`\n== joint at s ${j} (+-${W} m): rows (mesh, s, n, max|res| mm | edges x: kn5 R L | core R L | y edges kn5 R L)`);
  const list = near(js); const out2 = [];
  for (const r of list) {
    if (!isRoad(r.mesh)) continue; const xs = r.verts.map((v) => v.x), ys = r.verts.map((v) => v.y); const iR = xs.indexOf(Math.min(...xs)), iL = xs.indexOf(Math.max(...xs));
    const PP = poly(r.i, r.s); const mx = Math.max(...r.verts.map((v) => Math.abs(v.res)));
    const line = { mesh: r.mesh, s: +r.s.toFixed(3), n: r.verts.length, max: +mx.toFixed(4), xR: +xs[iR].toFixed(3), xL: +xs[iL].toFixed(3), cxR: +PP.xR.toFixed(3), cxL: +PP.xL.toFixed(3), yR: +ys[iR].toFixed(3), yL: +ys[iL].toFixed(3) };
    console.log('  ', r.mesh.padEnd(24), String(line.s).padStart(10), String(line.n).padStart(4), (mx * 1000).toFixed(1).padStart(7), ' |', line.xR.toFixed(3).padStart(8), line.xL.toFixed(3).padStart(8), ' |', line.cxR.toFixed(3).padStart(8), line.cxL.toFixed(3).padStart(8), ' |', line.yR.toFixed(3).padStart(7), line.yL.toFixed(3).padStart(7), mx > TH ? '  <-- OVER' : '', Math.abs(line.xR - line.cxR) > TH || Math.abs(line.xL - line.cxL) > TH ? '  <-- EDGE OFF' : '');
    out2.push(line);
  }
  const byS = new Map(); for (const r of list) { if (!isRoad(r.mesh)) continue; const k = Math.round(r.s * 1000); if (!byS.has(k)) byS.set(k, { s: r.s, verts: [] }); byS.get(k).verts.push(...r.verts); }
  const ss = [...byS.values()].sort((a, b) => a.s - b.s); let worst = { d2: 0, d1: 0, s: NaN, x: 0, ds: [0, 0] }; const XS = [-12, -9, -6, -3, 0, 3, 6, 9, 12];
  for (let k = 1; k + 1 < ss.length; k++) for (const x of XS) {
    const y = (e) => { const pts = e.verts.filter((v) => Math.abs(v.x - x) < 1.5).sort((a, b) => a.x - b.x).map((v) => [v.x, v.y]); return pts.length >= 2 ? yAt(pts, x) : NaN; };
    const a = y(ss[k - 1]), b = y(ss[k]), c = y(ss[k + 1]); if ([a, b, c].some(Number.isNaN)) continue; const d2 = Math.abs(a - 2 * b + c), d1 = Math.max(Math.abs(b - a), Math.abs(c - b));
    if (d2 > worst.d2) worst = { d2, d1, s: ss[k].s, x, ds: [ss[k].s - ss[k - 1].s, ss[k + 1].s - ss[k].s] };
  }
  console.log('   largest second difference of kn5 height at fixed x over three consecutive rows:', Number.isNaN(worst.s) ? 'none' : `${(worst.d2 * 1000).toFixed(1)} mm at s ${worst.s.toFixed(3)} x ${worst.x} (row spacing ${worst.ds.map((d) => d.toFixed(3)).join(', ')} m; first differences up to ${(worst.d1 * 1000).toFixed(1)} mm)`);
  const pairs = [];
  for (const [k, e] of byS) {
    const names = [...new Set(list.filter((r) => Math.round(r.s * 1000) === k && isRoad(r.mesh)).map((r) => r.mesh))];
    if (names.length < 2) continue; const A = list.find((r) => r.mesh === names[0] && Math.round(r.s * 1000) === k), B = list.find((r) => r.mesh === names[1] && Math.round(r.s * 1000) === k);
    let mm = 0; for (const v of A.verts) { let best = 1e9; for (const w of B.verts) { const d = Math.hypot(v.x - w.x, v.y - w.y); if (d < best) best = d; } mm = Math.max(mm, best); }
    pairs.push({ s: e.s, names, mismatch: mm }); console.log('   chunk seam at s', e.s.toFixed(3), names.join(' | '), 'largest vertex mismatch', (mm * 1000).toFixed(1), 'mm', mm > TH ? '<-- OVER' : '');
  }
  out.joints[j] = { rows: out2, worst, pairs };
}
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out));

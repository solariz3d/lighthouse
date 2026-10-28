// table.js (D515, O): the per-frame table of the CRAZY TEST Mach 6 replay against the geometry it was driven on (the 15:22Z export).
// Per frame, the measures are loads.cjs / bottoming.cjs / boxdepth.cjs's own, line for line: smoothed position (±4), central differences,
// the replay's wheel-contact normal, specific force along it = load; body above the wheel-centre plane = h; box depth (rigid tyres) =
// −(h + 0.345). Added here: the specific force ACROSS the road (lateral g, along n × v̂), and the frame's place on the AI line (nearest point).
// Geometry per AI point, from the export itself: camber (the bank), grade (the climb), horizontal radius (ailine.js extras), the 3-D
// curvature of the line split into its part INTO the road (κn) and in the road's plane (κg); and from the kn5 road mesh: the piece (mesh
// name), the cup (the cross-section's slope at the edges against the line's normal), and the body's height over the mesh surface.
//   node table.js <t180 dir> <track dir> <replay> <out.csv>
'use strict';
const fs = require('fs'), path = require('path');
const [T, TRK, RP, OUT] = process.argv.slice(2);
const { parseReplay, extractCar } = require('C:/Users/nname/Desktop/blackbox/ui/acreplay.js');
const { readKn5 } = require(path.join(T, 'tools/kn5.cjs'));
const { readAiLine } = require(path.join(T, 'src/export/ailine.js'));
const G = 9.81, CLEAR = 0.345;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const l = Math.hypot(...a) || 1; return mul(a, 1 / l); };

// ── the AI line and its geometry ──
const ai = readAiLine(fs.readFileSync(path.join(TRK, 'ai/fast_lane.ai'))); const A = ai.points, X = ai.extra, nA = A.length;
const K = 10;   // ±10 points (~15 m) for the line's curvature: float32 positions are noisy at one point's spacing
const geo = A.map((p, i) => {
  const a = A[Math.max(0, i - K)], b = A[Math.min(nA - 1, i + K)], ds = b.length - a.length;
  const t0 = unit(sub(A[Math.min(nA - 1, Math.max(1, i - K) )].pos, A[Math.max(0, i - K - 1)].pos)), t1 = unit(sub(A[Math.min(nA - 1, i + K)].pos, A[Math.min(nA - 2, i + K - 1)].pos));
  const kv = ds > 0 ? mul(sub(t1, t0), 1 / ds) : [0, 0, 0];   // dT/ds, 1/m
  const n = unit([X[i].nx, X[i].ny, X[i].nz]), f = unit([X[i].fx, X[i].fy, X[i].fz]), lat = unit(cr(n, f));
  return { s: p.length, pos: p.pos, n, f, lat, kn: dot(kv, n), kg: dot(kv, lat), bank: X[i].camber * 180 / Math.PI, climb: Math.asin(Math.max(-1, Math.min(1, X[i].grade))) * 180 / Math.PI,
    R: X[i].radius, sideL: X[i].sideLeft, sideR: X[i].sideRight, tiltN: Math.acos(Math.max(-1, Math.min(1, n[1]))) * 180 / Math.PI };
});

// ── the road mesh: triangles in a 3-D grid, rays in any direction ──
const kn = readKn5(path.join(TRK, 't180b_crazy_test_test.kn5'));
const road = kn.meshes.filter((m) => /ROAD/i.test(m.name) && !/WALL/i.test(m.name));
const C = 6, grid = new Map(), tris = [];
for (const m of road) for (let k = 0; k < m.idx.length; k += 3) {
  const t = [m.idx[k], m.idx[k + 1], m.idx[k + 2]].map((i) => [m.pos[i * 3], m.pos[i * 3 + 1], m.pos[i * 3 + 2]]); const id = tris.push({ t, name: m.name }) - 1;
  const lo = [0, 1, 2].map((c) => Math.floor(Math.min(t[0][c], t[1][c], t[2][c]) / C)), hi = [0, 1, 2].map((c) => Math.floor(Math.max(t[0][c], t[1][c], t[2][c]) / C));
  for (let x = lo[0]; x <= hi[0]; x++) for (let y = lo[1]; y <= hi[1]; y++) for (let z = lo[2]; z <= hi[2]; z++) { const key = x + ',' + y + ',' + z; let L = grid.get(key); if (!L) grid.set(key, L = []); L.push(id); }
}
function ray(o, d, len) {   // nearest hit along d (unit) within len, either face
  const seen = new Set(); let best = null;
  for (let u = 0; u <= len + C; u += C / 2) {
    const q = add(o, mul(d, Math.min(u, len))), key = [0, 1, 2].map((c) => Math.floor(q[c] / C)).join(',');
    for (const id of grid.get(key) || []) {
      if (seen.has(id)) continue; seen.add(id);
      const [a, b, c] = tris[id].t, e1 = sub(b, a), e2 = sub(c, a), p = cr(d, e2), det = dot(e1, p); if (Math.abs(det) < 1e-12) continue;
      const iv = 1 / det, tv = sub(o, a), uu = dot(tv, p) * iv; if (uu < 0 || uu > 1) continue; const qq = cr(tv, e1), vv = dot(d, qq) * iv; if (vv < 0 || uu + vv > 1) continue;
      const t = dot(e2, qq) * iv; if (t > 0 && t <= len && (!best || t < best.t)) best = { t, name: tris[id].name };
    }
  }
  return best;
}
const pieceOf = (name) => { const m = /_p(\d+)/.exec(name || ''); return m ? +m[1] : null; };
// the cross-section at an AI point: heights of the surface over the line's tangent plane, every 0.5 m across; the cup is the slope angle at
// 2 m in from each edge, against the plane at the line
function section(g) {
  const prof = [];
  for (let u = -40; u <= 40; u += 0.5) { const o = add(add(g.pos, mul(g.lat, u)), mul(g.n, 6)); const h = ray(o, mul(g.n, -1), 14); if (h) prof.push([u, 6 - h.t]); }
  if (prof.length < 5) return null;
  const angAt = (u0) => { const a = prof.find((p) => p[0] >= u0 - 1.01), b = prof.find((p) => p[0] >= u0 + 0.99); return a && b && b[0] > a[0] ? Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI : NaN; };
  const lo = prof[0][0], hi = prof[prof.length - 1][0];
  return { lo, hi, cupL: angAt(hi - 3), cupR: -angAt(lo + 1), mid: angAt(0) };   // + = the edge rises toward the road's up
}
const SEC_EVERY = 20;   // a section every 20 points (~30 m), interpolated to the frames by nearest
const secs = new Map();
for (let i = 0; i < nA; i += SEC_EVERY) { const h = ray(add(geo[i].pos, mul(geo[i].n, 6)), mul(geo[i].n, -1), 14); secs.set(i, { ...section(geo[i]), piece: pieceOf(h && h.name), surf: h ? 6 - h.t : NaN }); }

// ── the replay, frame by frame (the tools' measures) ──
const buf = fs.readFileSync(RP), rep = parseReplay(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const ex = extractCar(rep, 0), N = ex.N, dt = ex.dt, P = ex.pos, Wh = ex.wheels, W = 4, sm = new Float64Array(N * 3);
for (let i = 0; i < N; i++) for (let k = 0; k < 3; k++) { let s = 0, n = 0; for (let j = Math.max(0, i - W); j <= Math.min(N - 1, i + W); j++) { s += P[j * 3 + k]; n++; } sm[i * 3 + k] = s / n; }
const AG = 20, agrid = new Map(); A.forEach((p, i) => { const key = Math.floor(p.pos[0] / AG) + ',' + Math.floor(p.pos[1] / AG) + ',' + Math.floor(p.pos[2] / AG); let L = agrid.get(key); if (!L) agrid.set(key, L = []); L.push(i); });
const nearest = (x) => { let best = 1e18, bi = -1; const g = x.map((v) => Math.floor(v / AG)); for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) for (let c = -2; c <= 2; c++) for (const j of agrid.get((g[0] + a) + ',' + (g[1] + b) + ',' + (g[2] + c)) || []) { const d = dot(sub(A[j].pos, x), sub(A[j].pos, x)); if (d < best) { best = d; bi = j; } } return [bi, Math.sqrt(best)]; };
const rows = [];
for (let i = W + 2; i < N - W - 2; i++) {
  if (!ex.wheelsOk[i]) continue;
  const a = [0, 1, 2].map((k) => (sm[(i + 1) * 3 + k] - 2 * sm[i * 3 + k] + sm[(i - 1) * 3 + k]) / (dt * dt));
  const v = [0, 1, 2].map((k) => (sm[(i + 1) * 3 + k] - sm[(i - 1) * 3 + k]) / (2 * dt)), speed = Math.hypot(...v);
  if (speed < 5) continue;
  if (Math.hypot(...[0, 1, 2].map((k) => P[(i + 1) * 3 + k] - P[i * 3 + k])) > speed * dt * 3 + 1) continue;
  const n = unit([ex.nrm[i * 3], ex.nrm[i * 3 + 1], ex.nrm[i * 3 + 2]]), f = [a[0], a[1] + G, a[2]];
  const load = dot(f, n) / G, latAx = unit(cr(n, unit(v))), latg = dot(f, latAx) / G;
  const c = [0, 1, 2].map((k) => (Wh[i * 12 + k] + Wh[i * 12 + 3 + k] + Wh[i * 12 + 6 + k] + Wh[i * 12 + 9 + k]) / 4);
  const body = [P[i * 3], P[i * 3 + 1], P[i * 3 + 2]], h = dot(sub(body, c), n), depth = -(h + CLEAR);
  const [j, d] = nearest(body); if (j < 0) continue;
  const g = geo[j], sk = secs.get(Math.round(j / SEC_EVERY) * SEC_EVERY) || secs.get(Math.floor(j / SEC_EVERY) * SEC_EVERY) || {};
  const off = dot(sub(body, g.pos), g.lat);   // the car's place across the road, from the AI line (+ = the line's left)
  const hit = ray(add(body, mul(n, 3)), mul(n, -1), 9), overMesh = hit ? hit.t - 3 : NaN;   // body over the mesh surface, along the car's own normal
  const pred = (speed * speed * g.kn + G * g.n[1]) / G;   // the load the line's curvature and gravity alone ask for at this speed
  rows.push({ t: i * dt, s: g.s, d, off, kph: speed * 3.6, load, latg, h, depth, overMesh, boxOverMesh: overMesh - 0.05, tilt: Math.acos(Math.max(-1, Math.min(1, n[1]))) * 180 / Math.PI,
    bank: g.bank, climb: g.climb, R: g.R, kn: g.kn, kg: g.kg, predLoad: pred, piece: sk.piece, cupL: sk.cupL, cupR: sk.cupR, width: sk.hi - sk.lo });
}
const cols = ['t', 's', 'd', 'off', 'kph', 'load', 'latg', 'predLoad', 'h', 'depth', 'overMesh', 'boxOverMesh', 'tilt', 'bank', 'climb', 'R', 'kn', 'kg', 'piece', 'cupL', 'cupR', 'width'];
const fmt = (x) => (x === null || x === undefined || (typeof x === 'number' && !Number.isFinite(x)) ? '' : typeof x === 'number' ? +x.toFixed(4) : x);
fs.writeFileSync(OUT, cols.join(',') + '\n' + rows.map((r) => cols.map((c) => fmt(r[c])).join(',')).join('\n') + '\n');
console.log(`frames ${N}, dt ${dt.toFixed(4)}, rows ${rows.length}; AI points ${nA}, line ${A[nA - 1].length.toFixed(0)} m; road meshes ${road.length}, triangles ${tris.length}; sections ${secs.size}; car ${ex.car.carId}`);
// the section table too, for the geometry plot
fs.writeFileSync(OUT.replace(/\.csv$/, '-geometry.csv'), 's,bank,climb,R,kn,kg,tiltN,piece,cupL,cupR,width\n' + [...secs.entries()].map(([i, k]) => [geo[i].s, geo[i].bank, geo[i].climb, geo[i].R, geo[i].kn, geo[i].kg, geo[i].tiltN, k.piece, k.cupL, k.cupR, k.hi - k.lo].map(fmt).join(',')).join('\n') + '\n');

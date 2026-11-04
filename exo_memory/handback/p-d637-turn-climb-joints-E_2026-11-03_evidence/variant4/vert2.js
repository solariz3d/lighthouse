// usage (from the scratch folder): node vert2.js <checkout> <save> <mode: none|heading60> <joint s> ... — vert.js's direct measure (U and L load and jerk at
// 170 m/s from the built path's kvec, no split; joint against the two pieces' middles) on the build as built (none) or with turnplan.js's heading-keeping
// rounding in windows ≤ 60 m (heading60), built open with the adapter's own offsetPath, as trade.js builds it
const [R, save, mode, ...js] = process.argv.slice(2);
const D = require(R + '/src/core/document.js'), A = require(R + '/src/core/adapter.js'), { buildPath } = require(R + '/src/geom/path.js'), { roundChannel } = require('./turnplan.js');
const doc = D.parse(require('fs').readFileSync(save, 'utf8')), segs = A.toSegments(doc).map((g) => ({ ...g }));
if (mode === 'carry') { const { carryChannel } = require('./turnplan.js'); const kh = carryChannel(R, doc, 'kh'), kv = carryChannel(R, doc, 'kv'); const idx = new Map(doc.pieces.map((P, i) => [P.id, i])), off = new Map();
  for (const g of segs) { const i = idx.get(g.id), s0 = off.get(g.id) || 0, s1 = s0 + g.length; off.set(g.id, s1); if (g.kind !== 'road') continue; if (kh[i]) { g.k0 = kh[i](s0); g.k1 = kh[i](s1); } if (kv[i]) { g.kp0 = kv[i](s0); g.kp1 = kv[i](s1); } } }
if (mode === 'heading60') { const kh = roundChannel(R, doc, 'kh', { mode: 'heading', maxW: 60 }), kv = roundChannel(R, doc, 'kv', { mode: 'heading', maxW: 60 }); const idx = new Map(doc.pieces.map((P, i) => [P.id, i])), off = new Map();
  for (const g of segs) { const i = idx.get(g.id), s0 = off.get(g.id) || 0, s1 = s0 + g.length; off.set(g.id, s1); if (g.kind !== 'road') continue; if (kh[i]) { g.k0 = kh[i](s0); g.k1 = kh[i](s1); } if (kv[i]) { g.kp0 = kv[i](s0); g.kp1 = kv[i](s1); } } }
const S = A.offsetPath(doc, segs, buildPath(segs, { step: 0.5, closed: false, start: { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch } })).samples, V = 170, G = 9.80665, ds = S[1].s - S[0].s;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const P = S.map((x) => ({ s: x.s, U: (V * V * dot(x.kvec, x.U)) / G + x.U[1], L: (V * V * dot(x.kvec, x.L)) / G + x.L[1] }));
const idx = (s) => Math.max(2, Math.min(P.length - 3, Math.round(s / ds))), jerk = (i, k) => Math.abs((P[i + 2][k] - P[i - 2][k]) / (P[i + 2].s - P[i - 2].s)) * V;
const peak = (a, b, k) => { let m = 0, at = 0; for (let i = idx(a); i <= idx(b); i++) { const j = jerk(i, k); if (j > m) { m = j; at = P[i].s; } } return { m, at }; };
let o = 0; const pc = doc.pieces.map((p) => { const r = { p, a: o, b: o + p.length }; o += p.length; return r; });
for (const J of js.map(Number)) { const k = pc.findIndex((r) => Math.abs(r.b - J) < 1), A_ = pc[k], B_ = pc[k + 1], line = [`${mode} ${A_.p.id}|${B_.p.id} at s ${J}`];
  for (const key of ['U', 'L']) { const at = peak(J - 15, J + 15, key), mid = Math.max(peak(A_.a + 30, A_.b - 30, key).m, peak(B_.a + 30, B_.b - 30, key).m, 1e-6); line.push(`${key} jerk ${at.m.toFixed(0)} g/s at ${(at.at - J).toFixed(0)} m, mid-piece ${mid.toFixed(0)} (${(at.m / mid).toFixed(1)}×)`); }
  console.log(line.join('; ')); }

// usage: node feel.js <checkout> <save> [label] [--table]
// What a car on the centre line feels at every joint between two road pieces, against the same pieces' middles, from the BUILT path (adapter.js toPath, a
// sample every 0.5 m), at 170 m/s: the load along the road's up (U) and side (L) in g, gravity included, and its jerk in g/s (v · d/ds).
// THE SPLIT. The path's curvature vector kvec is split EXACTLY into a turn part and a climb part on a level frame built from the road's own direction T:
// L0 = up × T (horizontal, normalised), U0 = T × L0. With the bank angle φ = atan2(U·L0, U·U0) (the road's own U read in that frame), U = cosφ U0 + sinφ L0 and
// L = cosφ L0 − sinφ U0, so kvec·U = c_v cosφ + c_h sinφ and kvec·L = c_h cosφ − c_v sinφ, with c_h = kvec·L0 (the TURN's) and c_v = kvec·U0 (the CLIMB's).
// Its derivative splits into the turn term (c_h′), the climb term (c_v′) and the BANK term (φ′, which swings the same curvature between U and L); gravity's
// own part (up·U, up·L) is the fourth. The residual of the reconstruction is printed: the split is checked, not assumed. Samples within 8° of vertical (a loop's
// top, where up × T has no direction) are left out and counted.
'use strict';
const fs = require('fs'), path = require('path');
const [R, save, label = '', flag] = process.argv.slice(2);
const D = require(path.join(R, 'src/core/document.js')), A = require(path.join(R, 'src/core/adapter.js'));
const doc = D.parse(fs.readFileSync(save, 'utf8')), S = A.toPath(doc).path.samples;
const V = 170, G = 9.80665, UP = [0, 1, 0];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const n = Math.hypot(...a); return a.map((x) => x / n); };
let skipped = 0, resid = 0;
const P = S.map((x) => {
  const T = norm(x.T), vert = Math.abs(dot(T, UP)) > Math.cos(8 * Math.PI / 180);
  if (vert) { skipped++; return { s: x.s, vert: true }; }
  const L0 = norm(cross(UP, T)), U0 = cross(T, L0), phi = Math.atan2(dot(x.U, L0), dot(x.U, U0));
  const ch = dot(x.kvec, L0), cv = dot(x.kvec, U0), kU = dot(x.kvec, x.U), kL = dot(x.kvec, x.L);
  resid = Math.max(resid, Math.abs(kU - (cv * Math.cos(phi) + ch * Math.sin(phi))), Math.abs(Math.abs(kL) - Math.abs(ch * Math.cos(phi) - cv * Math.sin(phi))));
  const sL = Math.sign(dot(x.L, L0) * Math.cos(phi) - dot(x.L, U0) * Math.sin(phi)) || 1;   // L's own sign against cosφ L0 − sinφ U0
  return { s: x.s, phi, ch, cv, gU: dot(UP, x.U), gL: dot(UP, x.L), aU: (V * V * kU) / G + dot(UP, x.U), aL: (V * V * kL) / G + dot(UP, x.L), sL };
});
const N = P.length, ds = S[1].s - S[0].s, idx = (s) => Math.max(0, Math.min(N - 1, Math.round(s / ds)));
// jerk (g/s) at sample i, over ±2 samples, and its four terms
const jerk = (i) => {
  const a = P[i - 2], b = P[i + 2]; if (!a || !b || a.vert || b.vert || P[i].vert) return null;
  const h = (b.s - a.s), m = P[i], k = (V * V) / G, c = Math.cos(m.phi), sn = Math.sin(m.phi);
  const dch = (b.ch - a.ch) / h, dcv = (b.cv - a.cv) / h, dphi = (b.phi - a.phi) / h;
  const U = { turn: k * dch * sn, climb: k * dcv * c, bank: k * dphi * (m.ch * c - m.cv * sn), gravity: (b.gU - a.gU) / h };
  const L = { turn: m.sL * k * dch * c, climb: -m.sL * k * dcv * sn, bank: -m.sL * k * dphi * (m.ch * sn + m.cv * c), gravity: (b.gL - a.gL) / h };
  const tot = { U: (b.aU - a.aU) / h, L: (b.aL - a.aL) / h };
  for (const o of [U, L]) for (const key of Object.keys(o)) o[key] *= V;
  return { U, L, totU: tot.U * V, totL: tot.L * V };
};
let o = 0; const pieces = doc.pieces.map((p) => { const r = { p, a: o, b: o + p.length }; o += p.length; return r; });
const peak = (i0, i1, key) => { let m = 0, at = -1; for (let i = Math.max(2, i0); i <= Math.min(N - 3, i1); i++) { const j = jerk(i); if (!j) continue; const v = Math.abs(key === 'U' ? j.totU : j.totL); if (v > m) { m = v; at = i; } } return { m, at }; };
const rows = [];
for (let k = 0; k + 1 < pieces.length; k++) {
  const A_ = pieces[k], B_ = pieces[k + 1]; if (A_.p.type !== 'road' || B_.p.type !== 'road' || A_.p.tube || B_.p.tube) continue;
  const j = A_.b, r = { joint: Math.round(j), pieces: `${A_.p.id}|${B_.p.id}` };
  for (const key of ['U', 'L']) {
    const at = peak(idx(j - 15), idx(j + 15), key), mids = [A_, B_].map((p) => (p.p.length > 80 ? peak(idx(p.a + 30), idx(p.b - 30), key).m : 0)), mid = Math.max(...mids, 1e-6);
    const jj = at.at >= 0 ? jerk(at.at) : null;
    r[key] = { joint: at.m, mid, ratio: at.m / mid, at: at.at >= 0 ? P[at.at].s : null, load: at.at >= 0 ? (key === 'U' ? P[at.at].aU : P[at.at].aL) : null, split: jj ? jj[key] : null, bankDeg: at.at >= 0 ? (P[at.at].phi * 180) / Math.PI : null };
  }
  rows.push(r);
}
const f = (x, d = 2) => (x === null || x === undefined ? '-' : x.toFixed(d));
console.log(`${label}  joints ${rows.length}; samples left out near vertical ${skipped}; split residual ${resid.toExponential(1)} 1/m`);
if (flag === '--table') {
  console.log('joint\tpieces\tbank°\tU g\tU jerk g/s joint/mid (×)\tU split turn / climb / bank / gravity\tL g\tL jerk joint/mid (×)\tL split turn / climb / bank / gravity');
  for (const r of rows) {
    const sp = (x) => (x ? `${f(x.turn)} / ${f(x.climb)} / ${f(x.bank)} / ${f(x.gravity)}` : '-');
    console.log(`${r.joint}\t${r.pieces}\t${f(r.U.bankDeg, 0)}\t${f(r.U.load)}\t${f(r.U.joint)}/${f(r.U.mid)} (${f(r.U.ratio, 1)})\t${sp(r.U.split)}\t${f(r.L.load)}\t${f(r.L.joint)}/${f(r.L.mid)} (${f(r.L.ratio, 1)})\t${sp(r.L.split)}`);
  }
}
const over = (key, t) => rows.filter((r) => r[key].ratio > t).length;
console.log(`U jerk over mid-piece: ${over('U', 1)} (over 2×: ${over('U', 2)}); L: ${over('L', 1)} (over 2×: ${over('L', 2)})`);
// which term carries the U jerk at the joints over mid-piece
const dom = {}; for (const r of rows) if (r.U.ratio > 1 && r.U.split) { const e = Object.entries(r.U.split).sort((p, q) => Math.abs(q[1]) - Math.abs(p[1]))[0][0]; dom[e] = (dom[e] || 0) + 1; }
console.log(`the largest term of the U jerk, at those joints: ${JSON.stringify(dom)}`);
module.exports = rows;

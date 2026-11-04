// usage: node trade.js <checkout> <save> [label]
// THE ROUTE TRADE of rounding turn (kh) and climb (kv) the way the bank is rounded (turnplan.js, a prototype). For mode none / plain / heading: the real
// segments (adapter.js toSegments) with their k0 k1 kp0 kp1 re-laid from the rounded channels at each segment's ends, built by the real buildPath, OPEN
// (a closed lap that misses its start by over 1 mm would throw), with the adapter's own offsetPath. Reported against mode none:
//   the joints: the centre's U and L jerk at each joint against mid-piece (feel.js's measure), counts over 1× and 2×, and the worst
//   the route: the largest move of the centre line anywhere, the heading and position change at the lap's end, and the lap's closure gap (end to start)
//   the windows: how many, the largest curvature rate left (against the bar), and in 'heading' mode the largest overshoot (share of the change it replaces)
'use strict';
const fs = require('fs'), path = require('path');
const [R, save, label = '', maxArg] = process.argv.slice(2); const MAXW = maxArg ? Number(maxArg) : undefined;
const D = require(path.join(R, 'src/core/document.js')), A = require(path.join(R, 'src/core/adapter.js')), { buildPath } = require(path.join(R, 'src/geom/path.js'));
const { roundChannel, carryChannel, K_BAR } = require('./turnplan.js');
const doc = D.parse(fs.readFileSync(save, 'utf8'));
const V = 170, G = 9.80665, UP = [0, 1, 0];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const n = Math.hypot(...a); return a.map((x) => x / n); };
function build(mode, rep) {
  const segs = A.toSegments(doc).map((g) => ({ ...g }));
  if (mode !== 'none') {
    const kh = mode === 'carry' ? carryChannel(R, doc, 'kh', { report: rep }) : roundChannel(R, doc, 'kh', { mode, report: rep, maxW: MAXW }), kv = mode === 'carry' ? carryChannel(R, doc, 'kv', { report: rep }) : roundChannel(R, doc, 'kv', { mode, report: rep, maxW: MAXW });
    const idx = new Map(doc.pieces.map((P, i) => [P.id, i])), off = new Map();
    for (const g of segs) {
      const i = idx.get(g.id), s0 = off.get(g.id) || 0, s1 = s0 + g.length; off.set(g.id, s1);
      if (g.kind !== 'road') continue;
      if (kh[i]) { g.k0 = kh[i](s0); g.k1 = kh[i](s1); }
      if (kv[i]) { g.kp0 = kv[i](s0); g.kp1 = kv[i](s1); }
    }
  }
  const start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch };
  return A.offsetPath(doc, segs, buildPath(segs, { step: 0.5, closed: false, start })).samples;
}
function feel(S) {
  const P = S.map((x) => { const T = norm(x.T); if (Math.abs(dot(T, UP)) > Math.cos(8 * Math.PI / 180)) return null; return { s: x.s, aU: (V * V * dot(x.kvec, x.U)) / G + dot(UP, x.U), aL: (V * V * dot(x.kvec, x.L)) / G + dot(UP, x.L) }; });
  const N = P.length, ds = S[1].s - S[0].s, idx = (s) => Math.max(0, Math.min(N - 1, Math.round(s / ds)));
  const jerk = (i, k) => { const a = P[i - 2], b = P[i + 2]; return a && b && P[i] ? Math.abs((b[k] - a[k]) / (b.s - a.s)) * V : 0; };
  const peak = (i0, i1, k) => { let m = 0; for (let i = Math.max(2, i0); i <= Math.min(N - 3, i1); i++) m = Math.max(m, jerk(i, k)); return m; };
  let o = 0; const pc = doc.pieces.map((p) => { const r = { p, a: o, b: o + p.length }; o += p.length; return r; });
  const rows = [];
  for (let k = 0; k + 1 < pc.length; k++) { const A_ = pc[k], B_ = pc[k + 1]; if (A_.p.type !== 'road' || B_.p.type !== 'road' || A_.p.tube || B_.p.tube) continue; const j = A_.b, r = { joint: Math.round(j) };
    for (const key of ['aU', 'aL']) { const at = peak(idx(j - 15), idx(j + 15), key), mid = Math.max(...[A_, B_].map((p) => (p.p.length > 80 ? peak(idx(p.a + 30), idx(p.b - 30), key) : 0)), 1e-6); r[key] = { at, mid, ratio: at / mid }; }
    rows.push(r); }
  return rows;
}
const base = build('none'), fb = feel(base);
const sum = (rows) => ({ u1: rows.filter((r) => r.aU.ratio > 1).length, u2: rows.filter((r) => r.aU.ratio > 2).length, l1: rows.filter((r) => r.aL.ratio > 1).length, l2: rows.filter((r) => r.aL.ratio > 2).length, worstU: Math.max(...rows.map((r) => r.aU.at)), worstL: Math.max(...rows.map((r) => r.aL.at)) });
const heading = (x) => Math.atan2(x.T[0], x.T[2]);
const line = (name, S, rows, rep) => {
  const s = sum(rows), e0 = base[base.length - 1], e1 = S[S.length - 1], first = S[0];
  let move = 0; for (let i = 0; i < Math.min(S.length, base.length); i++) move = Math.max(move, Math.hypot(...S[i].pos.map((v, k) => v - base[i].pos[k])));
  const gap = Math.hypot(...e1.pos.map((v, k) => v - first.pos[k])), gap0 = Math.hypot(...e0.pos.map((v, k) => v - base[0].pos[k]));
  const dh = ((heading(e1) - heading(e0) + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
  const wins = rep ? rep.length : 0, peakLeft = rep && rep.length && rep[0].peak !== undefined ? Math.max(...rep.map((w) => w.peak)) / K_BAR : 0, os = rep && rep.length ? Math.max(...rep.map((w) => w.overshoot)) : 0;
  console.log(`${label} ${name}: joints U>mid ${s.u1} (>2× ${s.u2}), L>mid ${s.l1} (>2× ${s.l2}); worst joint jerk U ${s.worstU.toFixed(1)} g/s, L ${s.worstL.toFixed(1)} g/s | route: largest centre-line move ${move.toFixed(3)} m, end heading ${(dh * 180 / Math.PI).toFixed(4)}°, lap closure gap ${gap.toFixed(4)} m (as laid ${gap0.toFixed(4)} m)${rep ? ` | windows ${wins}, largest curvature rate left ${peakLeft.toFixed(2)}× the bar, largest overshoot ${(os * 100).toFixed(1)}%` : ''}`);
};
line('as built (0692d11)', base, fb, null);
for (const mode of (process.env.MODES || 'plain,heading').split(',')) { const rep = []; const S = build(mode, rep); line(mode, S, feel(S), rep); }

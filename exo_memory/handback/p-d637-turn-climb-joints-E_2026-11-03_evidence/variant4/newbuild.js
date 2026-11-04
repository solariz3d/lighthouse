// usage: node newbuild.js <checkout> — THE NEW-BUILD CASE through the real writer (src/core/extend.js), the shape of his p32 → p33: a 250 m piece whose climb
// reaches 0 from −6.807e-4 "early", then a 750 m piece whose climb goes 0 → −2.513e-3 and turn 0 → −4.346e-3 "early" (his saved targets), then a 750 m piece
// back (climb +2.897e-3 − 2.513e-3 = +3.84e-4, turn +1.082e-3: p34's targets), after a 300 m piece climbing at −6.807e-4. Laid twice: as the panel lays an
// early turn or climb today (transition AT_START_M = 20 m, app/core/panel.js:59) and with the transition sized to the change, R* = max(20, 2.35 · |Δκ| / K_BAR),
// at most half the piece (regen.js's SPREAD). Reported per build: the centre's U and L jerk (g/s at 170 m/s) at the two joints against the pieces' middles, the
// curvature's largest rate (against the bar), the end position and heading, and how far the end moves between the two builds (the route a builder shows)
'use strict';
const path = require('path');
const R = process.argv[2];
const D = require(path.join(R, 'src/core/document.js')), A = require(path.join(R, 'src/core/adapter.js')), { extend } = require(path.join(R, 'src/core/extend.js'));
const K_BAR = 29.4 / (10 * 170 * 170), SPREAD = 2.35, V = 170, G = 9.80665;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sized = (dk, L) => Math.min(L / 2, Math.max(20, (SPREAD * Math.abs(dk)) / K_BAR));
function lay(mode) {
  const t = (dk, L) => (mode === 'today' ? Math.min(20, L) : sized(dk, L));
  let d = extend(D.createDoc('drop'), { length: 300, family: 'bowl', first: { kv: -6.807e-4 } });
  d = extend(d, { length: 250, targets: { kv: 0 }, transition: { kv: t(6.807e-4, 250) } });
  d = extend(d, { length: 750, targets: { kv: -2.513e-3, kh: -4.346e-3 }, transition: { kv: t(2.513e-3, 750), kh: t(4.346e-3, 750) } });
  d = extend(d, { length: 750, targets: { kv: 3.84e-4, kh: 1.082e-3 }, transition: { kv: t(2.897e-3, 750), kh: t(5.428e-3, 750) } });
  return d;
}
const rows = {};
for (const mode of ['today', 'sized']) {
  const doc = lay(mode), S = A.toPath(doc).path.samples, ds = S[1].s - S[0].s, N = S.length, idx = (s) => Math.max(2, Math.min(N - 3, Math.round(s / ds)));
  const P = S.map((x) => ({ s: x.s, U: (V * V * dot(x.kvec, x.U)) / G + x.U[1], L: (V * V * dot(x.kvec, x.L)) / G + x.L[1] }));
  const jerk = (i, k) => Math.abs((P[i + 2][k] - P[i - 2][k]) / (P[i + 2].s - P[i - 2].s)) * V;
  const peak = (a, b, k) => { let m = 0, at = 0; for (let i = idx(a); i <= idx(b); i++) { const j = jerk(i, k); if (j > m) { m = j; at = P[i].s; } } return { m, at }; };
  let o = 0; const pc = doc.pieces.map((p) => { const r = { p, a: o, b: o + p.length }; o += p.length; return r; });
  let kmax = 0; for (const p of pc) for (const ch of ['kh', 'kv']) for (let s = 0; s <= p.p.length; s += 0.5) kmax = Math.max(kmax, Math.abs(D.channelAt(p.p, ch, s).d1));
  const line = [`${mode}: the curvature's largest rate ${(kmax / K_BAR).toFixed(2)}× the bar`];
  for (const k of [1, 2]) { const A_ = pc[k], B_ = pc[k + 1], j = A_.b; for (const key of ['U', 'L']) { const at = peak(j - 40, j + 120, key), mid = Math.max(peak(A_.a + 30, A_.b - 30, key).m, peak(B_.a + 130, B_.b - 30, key).m, 1e-6); line.push(`joint ${k + 1}|${k + 2} ${key} jerk ${at.m.toFixed(0)} g/s at ${(at.at - j).toFixed(0)} m (mid ${mid.toFixed(0)})`); } }
  const e = S[S.length - 1]; rows[mode] = e; line.push(`end at (${e.pos.map((v) => v.toFixed(1)).join(', ')}), heading ${(Math.atan2(e.T[0], e.T[2]) * 180 / Math.PI).toFixed(2)}°`);
  console.log(line.join('; '));
}
const a = rows.today, b = rows.sized;
console.log(`the end moves ${Math.hypot(...a.pos.map((v, k) => v - b.pos[k])).toFixed(1)} m between the two writers (in a NEW build that is not a move: the sized route is the one shown while laying)`);

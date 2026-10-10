// turns2.js (pane B, D280 part 2): (a) the entry/exit transitions of each post-jump turn on the 20 m curvature (less noisy than 8 m), and
// (b) the tightest radius the EQUATION file's 200-harmonic theta series can draw after the jump (its curvature, evaluated every 1 m).
//   node turns2.js        (reads turns_after_jump.json beside it, written by turns.js)
'use strict';
const path = require('path');
const R = require('C:/Users/nname/Desktop/t180-track-builder/reads/thunderhead_raceway__normal.read.json');
const E = require('C:/Users/nname/Desktop/t180-track-builder/reads/thunderhead_raceway__normal.equation.json');
const T = require(path.join(__dirname, 'turns_after_jump.json'));
const st = R.stations.filter((s) => s.f);
const th = []; let prev = null, off = 0;
for (const s of st) { let t = Math.atan2(s.f[0], s.f[2]); if (prev != null) { while (t + off - prev > Math.PI) off -= 2 * Math.PI; while (t + off - prev < -Math.PI) off += 2 * Math.PI; } th.push(t + off); prev = t + off; }
const k20 = st.map((s, i) => (i < 2 || i > st.length - 3) ? 0 : (th[i + 2] - th[i - 2]) / (st[i + 2].d - st[i - 2].d));
const idx = (d) => st.findIndex((s) => s.d >= d);
const out = T.turns.map((t) => {
  const a = idx(t.from_m), b = idx(t.to_m); let pk = a;
  for (let q = a; q <= b; q++) if (Math.abs(k20[q]) > Math.abs(k20[pk])) pk = q;
  const P = Math.abs(k20[pk]);
  const fwd = (frac) => { for (let q = Math.max(0, a - 10); q <= pk; q++) if (Math.abs(k20[q]) >= frac * P && Math.sign(k20[q]) === Math.sign(k20[pk])) return q; return pk; };
  const bwd = (frac) => { for (let q = Math.min(st.length - 1, b + 10); q >= pk; q--) if (Math.abs(k20[q]) >= frac * P && Math.sign(k20[q]) === Math.sign(k20[pk])) return q; return pk; };
  return { dir: t.dir, from_m: t.from_m, angle_deg: t.angle_deg, Rmin_20m: +(1 / P).toFixed(1), entry_10_90_m: st[fwd(0.9)].d - st[fwd(0.1)].d, exit_90_10_m: st[bwd(0.1)].d - st[bwd(0.9)].d, held_above_90pct_m: st[bwd(0.9)].d - st[fwd(0.9)].d };
});
// (b) the equation's theta rate: d theta/ds = net/L + sum (2 pi k/L)(b_k cos - a_k sin)
const f = E.series.theta, L = E.lapM, TAU = 2 * Math.PI;
const rate = (s) => { let y = f.net / L; for (let k = 1; k <= f.a.length; k++) { const w = TAU * k * s / L; y += (TAU * k / L) * (f.b[k - 1] * Math.cos(w) - f.a[k - 1] * Math.sin(w)); } return y; };
const land = E.jumps[0].s + E.jumps[0].gap;
let best = 0, at = 0; for (let s = land; s <= L; s += 1) { const r = Math.abs(rate(s)); if (r > best) { best = r; at = s; } }
let bestAll = 0; for (let s = 0; s <= L; s += 1) bestAll = Math.max(bestAll, Math.abs(rate(s)));
console.log(JSON.stringify({ transitions_on_20m_curvature: out,
  equation: { harmonics: f.a.length, lapM: +L.toFixed(1), shortest_wavelength_m: +(L / f.a.length).toFixed(1), landing_s: +land.toFixed(1), Rmin_after_jump_m: +(1 / best).toFixed(1), at_s: at, Rmin_whole_lap_m: +(1 / bestAll).toFixed(1) } }, null, 1));

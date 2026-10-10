// turns.js (pane B, D280 part 2): Thunderhead's turns after the jump, from the READ stations (4 m apart, read-only).
//   node turns.js [from_m] [to_m]
// heading theta = atan2(f.x, f.z) of each station's forward vector, unwrapped; kappa_i = (theta_{i+1} - theta_{i-1}) / (d_{i+1} - d_{i-1}).
// A TURN = a maximal run of stations with |kappa| >= K_ON (1/400 m) of one sign, gaps of <= 2 stations below it bridged; kept if |angle| >= 30 deg.
// angle = theta(exit) - theta(entry) over the run widened to where |kappa| first falls below K_OFF (1/2000 m).
// min radius = 1 / max |kappa| (kappa over 8 m), and also over a 20 m window (5 stations) as a less noisy figure.
// entry / exit transition = distance from |kappa| = 10% of peak to 90% of peak, on each side of the peak.
'use strict';
const path = require('path');
const R = require(path.join('C:/Users/nname/Desktop/t180-track-builder/reads/thunderhead_raceway__normal.read.json'));
const E = require(path.join('C:/Users/nname/Desktop/t180-track-builder/reads/thunderhead_raceway__normal.equation.json'));
let from = +(process.argv[2] || 0), to = +(process.argv[3] || 9166);
const st = R.stations.filter((s) => s.f);   // the jump and closed marker rows carry no forward vector
const landing = (R.stations.find((s) => s.jump) || {}).d;
const th = []; let prev = null, off = 0;
for (const s of st) { let t = Math.atan2(s.f[0], s.f[2]); if (prev != null) { while (t + off - prev > Math.PI) off -= 2 * Math.PI; while (t + off - prev < -Math.PI) off += 2 * Math.PI; } th.push(t + off); prev = t + off; }
const k = st.map((s, i) => (i === 0 || i === st.length - 1) ? 0 : (th[i + 1] - th[i - 1]) / (st[i + 1].d - st[i - 1].d));
const k20 = st.map((s, i) => (i < 3 || i > st.length - 4) ? 0 : (th[i + 2] - th[i - 2]) / (st[i + 2].d - st[i - 2].d) || 0);
if (!process.argv[2]) from = R.stations[R.stations.findIndex((x) => x.jump) + 1].d;   // the read's own landing station
const K_ON = 1 / 400, K_OFF = 1 / 2000, deg = (x) => x * 180 / Math.PI;
const turns = [];
let i = st.findIndex((s) => s.d >= from);
while (i < st.length && st[i].d <= to) {
  if (Math.abs(k[i]) < K_ON) { i++; continue; }
  const sg = Math.sign(k[i]); let j = i, gap = 0;
  while (j + 1 < st.length && st[j + 1].d <= to) { const kk = k[j + 1]; if (Math.sign(kk) === sg && Math.abs(kk) >= K_ON) { gap = 0; j++; } else if (gap < 2) { gap++; j++; } else break; }
  j -= gap;
  let a = i, b = j;
  while (a > 0 && Math.sign(k[a - 1]) === sg && Math.abs(k[a - 1]) >= K_OFF) a--;
  while (b < st.length - 1 && Math.sign(k[b + 1]) === sg && Math.abs(k[b + 1]) >= K_OFF) b++;
  const ang = deg(th[b] - th[a]);
  if (Math.abs(ang) >= 30) {
    let pk = a; for (let q = a; q <= b; q++) if (Math.abs(k[q]) > Math.abs(k[pk])) pk = q;
    let pk20 = a; for (let q = a; q <= b; q++) if (Math.abs(k20[q]) > Math.abs(k20[pk20])) pk20 = q;
    const P = Math.abs(k[pk]);
    const firstAt = (lo, hi, step, frac) => { for (let q = lo; step > 0 ? q <= hi : q >= hi; q += step) if (Math.abs(k[q]) >= frac * P) return q; return lo; };
    const e10 = firstAt(a, pk, 1, 0.1), e90 = firstAt(a, pk, 1, 0.9), x10 = firstAt(b, pk, -1, 0.1), x90 = firstAt(b, pk, -1, 0.9);
    const span = st.slice(a, b + 1);
    const avg = (f) => span.reduce((x, s) => x + f(s), 0) / span.length;
    const atPk = st[pk];
    const inside = sg > 0 ? 'psiL' : 'psiR', outside = sg > 0 ? 'psiR' : 'psiL';
    turns.push({
      dir: sg > 0 ? 'L' : 'R', from_m: st[a].d, to_m: st[b].d, arc_m: st[b].d - st[a].d, angle_deg: +ang.toFixed(1),
      Rmin_8m: +(1 / P).toFixed(1), Rmin_20m: +(1 / Math.abs(k20[pk20])).toFixed(1), peak_at_m: atPk.d,
      entry_transition_m: st[e90].d - st[e10].d, exit_transition_m: st[x10].d - st[x90].d,
      full_curvature_m: st[x90].d - st[e90].d,
      width_m_mean: +avg((s) => s.width).toFixed(1), width_at_peak: atPk.width, wl_wr_at_peak: [atPk.wl, atPk.wr],
      centre_tilt_deg_at_peak: atPk.up, centre_tilt_deg_max: Math.max(...span.map((s) => s.up)),
      inside_psi_at_peak: atPk[inside], outside_psi_at_peak: atPk[outside], words: R.text.filter((t) => t.to >= st[a].d && t.from <= st[b].d).map((t) => t.w).join(' '),
    });
  }
  i = b + 1;
}
console.log(JSON.stringify({ track: R.track, jump_read: R.stations.find((x) => x.jump), jump_equation: E.jumps[0], from, to, n: turns.length, turns }, null, 1));

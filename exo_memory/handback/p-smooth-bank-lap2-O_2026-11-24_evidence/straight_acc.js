// Item (e), the librarian's ruling of 05:16: the four reference tracks' roll acceleration on straight road, by the adapter's own measure, against its bar.
// src/core/adapter.js bankPlan: acc(k) = (rate(k) - rate(k-1)) / ((S[k+1] - S[k-1]) / 2) on the built bank every BANK_DS = 2 m; a station is straight when
// |κh| <= TURN_KH = 1/600; the bar is BANK_BAR = 29.4 / (10 · 170²) rad/m². The reads hold a station every 4 m, so the same formula runs on h = 4, 8 and 16 m
// (every 1st, 2nd and 4th station); a mesh-read bank's noise grows as 1/h² in a second difference, so the three are printed side by side. And a bound no noise
// inflates: each place the bank goes on straight road from 15° or more to 2° or less (or back), over L metres, needs at least 4Δ/L² from rest to rest.
// Prints aggregates only (no layout, no names): columns 1-4 in the brief's order.
'use strict';
const FWDPOS = process.env.FWD === 'pos', fwdOf = (st, i) => { if (!FWDPOS) return st[i].f; const a = st[Math.max(0, i - 2)].c, b = st[Math.min(st.length - 1, i + 2)].c, t = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...t); return t.map((x) => x / L); };
const fs = require('fs');
const BAR = 29.4 / (10 * 170 * 170), TURN_KH = 1 / 600, DEG = 180 / Math.PI;
const reads = JSON.parse(fs.readFileSync(__dirname + '/four_reads.json', 'utf8'));
const seen = new Set();
const q = (a, p) => { if (!a.length) return NaN; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };
for (const { col, p } of reads.sort((a, b) => a.col - b.col)) {
  if (seen.has(col)) continue; seen.add(col);
  const r = JSON.parse(fs.readFileSync(p, 'utf8'));
  // bank and heading as style.js reads them (its sign convention, checked on the reference S)
  let prev = null, hAcc = 0; const R = [];
  const STN = r.stations.filter((s) => s.c && s.n && s.f);
  for (let si = 0; si < STN.length; si++) {
    const s = STN[si], f = fwdOf(STN, si), n = s.n;
    const h = Math.atan2(f[2], f[0]);
    if (prev !== null) { let dh = h - prev; while (dh > Math.PI) dh -= 2 * Math.PI; while (dh < -Math.PI) dh += 2 * Math.PI; hAcc += dh; }
    prev = h;
    const sl = Math.hypot(f[2], f[0]) || 1, side = [-f[2] / sl, 0, f[0] / sl];
    const u2 = [side[1] * f[2] - side[2] * f[1], side[2] * f[0] - side[0] * f[2], side[0] * f[1] - side[1] * f[0]];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    R.push({ d: s.d, h: hAcc, bank: Math.atan2(dot(n, side), dot(n, u2)), steep: Math.abs(Math.asin(Math.max(-1, Math.min(1, f[1])))) > 35 / DEG });
  }
  const N = R.length, ok = (i) => i >= 0 && i < N && R[i] && !R[i].steep;
  // κh at station i over ±2 stations (±8 m), as the adapter reads a station's own curvature
  const kh = (i) => { const a = i - 2, b = i + 2; if (!ok(a) || !ok(b) || R[b].d <= R[a].d) return NaN; return (R[b].h - R[a].h) / (R[b].d - R[a].d); };
  const straight = R.map((x, i) => ok(i) && Math.abs(kh(i)) <= TURN_KH);
  const out = { col, lap_km: +(r.walked_m / 1000).toFixed(1), straight_share: +(100 * straight.filter(Boolean).length / N).toFixed(0) };
  for (const st of [1, 2, 4]) {   // h = 4, 8, 16 m
    const v = [];
    for (let i = st; i + st < N; i++) {
      let all = true; for (let j = i - st; j <= i + st; j++) if (!straight[j]) { all = false; break; }
      if (!all) continue;
      const a = R[i - st], b = R[i], c = R[i + st], r1 = (b.bank - a.bank) / (b.d - a.d), r2 = (c.bank - b.bank) / (c.d - b.d);
      v.push(Math.abs((r2 - r1) / ((c.d - a.d) / 2)) / BAR);
    }
    out[`h${4 * st}`] = { n: v.length, over_bar_pct: +(100 * v.filter((x) => x > 1).length / (v.length || 1)).toFixed(1), med: +q(v, 0.5).toFixed(2), p90: +q(v, 0.9).toFixed(2), p99: +q(v, 0.99).toFixed(2) };
  }
  // the noise floor: level straight road (|bank| under 1° across the chord), where the true roll acceleration is about 0, read the same way
  for (const st of [1, 2, 4]) { const v = []; for (let i = st; i + st < N; i++) { let all = true; for (let j = i - st; j <= i + st; j++) if (!straight[j] || Math.abs(R[j].bank) * DEG > 1) { all = false; break; } if (!all) continue; const A = R[i - st], B = R[i], C = R[i + st]; v.push(Math.abs(((C.bank - B.bank) / (C.d - B.d) - (B.bank - A.bank) / (B.d - A.d)) / ((C.d - A.d) / 2)) / BAR); } out['noise_h' + 4 * st] = { n: v.length, med: +q(v, 0.5).toFixed(2), p90: +q(v, 0.9).toFixed(2) }; }
  // the transitions on straight road: |bank| from >= 15° to <= 2° (or back) inside one straight run, the bound 4Δ/L² against the bar
  const tr = [];
  for (let i = 0; i < N; i++) {
    if (!straight[i] || Math.abs(R[i].bank) * DEG < 15) continue;
    for (const dir of [1, -1]) {
      let j = i + dir; while (ok(j) && straight[j] && Math.abs(R[j].bank) * DEG > 2 && Math.sign(R[j].bank) === Math.sign(R[i].bank)) j += dir;
      if (!ok(j) || !straight[j] || Math.abs(R[j].bank) * DEG > 2) continue;
      // start the transition at the last station still at 15° or more, so L is the change itself
      let k = j - dir; while (k !== i && Math.abs(R[k].bank) * DEG < 15) k -= dir;
      if (Math.abs(R[k].bank) * DEG < 15) continue;
      const L = Math.abs(R[j].d - R[k].d), dlt = Math.abs(R[k].bank - R[j].bank);
      if (L > 0) tr.push({ key: Math.min(j, k) + ':' + Math.max(j, k), L, deg: dlt * DEG, ratio: (4 * dlt / (L * L)) / BAR });
    }
  }
  const uniq = [...new Map(tr.map((t) => [t.key, t])).values()];
  // each transition's own peak roll acceleration at an 8 and a 16 m chord (the stations of the transition, the chord inside straight road), against the bar
  const peakIn = (t, st) => { const [k0, k1] = t.key.split(':').map(Number); let m = NaN; for (let i = Math.max(st, k0); i <= Math.min(N - 1 - st, k1); i++) { let all = true; for (let j = i - st; j <= i + st; j++) if (!straight[j]) { all = false; break; } if (!all) continue; const A = R[i - st], B = R[i], C = R[i + st]; const x = Math.abs(((C.bank - B.bank) / (C.d - B.d) - (B.bank - A.bank) / (B.d - A.d)) / ((C.d - A.d) / 2)) / BAR; m = Number.isNaN(m) ? x : Math.max(m, x); } return m; };
  for (const st of [2, 4]) { const v = uniq.map((t) => peakIn(t, st)).filter((x) => !Number.isNaN(x)); out['trans_peak_h' + 4 * st] = { n: v.length, over_bar_pct: +(100 * v.filter((x) => x > 1).length / (v.length || 1)).toFixed(0), med: +q(v, 0.5).toFixed(2), p90: +q(v, 0.9).toFixed(2) }; }
  out.transitions = { n: uniq.length, deg_med: +q(uniq.map((t) => t.deg), 0.5).toFixed(1), L_med: +q(uniq.map((t) => t.L), 0.5).toFixed(0), bound_over_bar_pct: +(100 * uniq.filter((t) => t.ratio > 1).length / (uniq.length || 1)).toFixed(0), ratio_med: +q(uniq.map((t) => t.ratio), 0.5).toFixed(2), ratio_p90: +q(uniq.map((t) => t.ratio), 0.9).toFixed(2) };
  console.log(JSON.stringify(out));
}

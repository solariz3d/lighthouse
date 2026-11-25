// The chair's added item 1: reference track A's S, its run-in (340-460) and ease-out (606-710) straights (the dbl90 table, §1), roll acceleration against
// BANK_BAR. The read carries a station every 4 m, so the adapter's 2 m chord is not available; printed: the bound no noise can inflate (4Δ/L², the least peak
// any curve needs to move Δ over L from rest to rest) and the second difference's peak at h = 4, 8 and 16 m. Summary numbers only.
const FWDPOS = process.env.FWD === 'pos', fwdOf = (st, i) => { if (!FWDPOS) return st[i].f; const a = st[Math.max(0, i - 2)].c, b = st[Math.min(st.length - 1, i + 2)].c, t = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...t); return t.map((x) => x / L); };
const fs = require('fs'), BAR = 29.4 / (10 * 170 * 170), DEG = 180 / Math.PI;
const p = JSON.parse(fs.readFileSync(__dirname + '/four_reads.json', 'utf8')).find((x) => x.col === 1).p, r = JSON.parse(fs.readFileSync(p, 'utf8'));
const bank = (s, f) => { const n = s.n, sl = Math.hypot(f[2], f[0]) || 1, side = [-f[2] / sl, 0, f[0] / sl], u2 = [side[1] * f[2] - side[2] * f[1], side[2] * f[0] - side[0] * f[2], side[0] * f[1] - side[1] * f[0]], d = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; return Math.atan2(d(n, side), d(n, u2)); };
const ST = r.stations.filter((s) => s.f && s.n && s.c), S = ST.map((s, i) => ({ d: s.d, v: bank(s, fwdOf(ST, i)) }));
for (const [name, a, b] of [['run-in', 340, 460], ['ease-out', 606, 710]]) {
  const I = S.map((x, i) => i).filter((i) => S[i].d >= a && S[i].d <= b), i0 = I[0], i1 = I[I.length - 1];
  const dlt = Math.abs(S[i1].v - S[i0].v), L = S[i1].d - S[i0].d, bound = 4 * dlt / (L * L);
  const out = { name, from_deg: +(S[i0].v * DEG).toFixed(1), to_deg: +(S[i1].v * DEG).toFixed(1), L_m: L, bound_x_bar: +(bound / BAR).toFixed(2), room_at_bar_m: +(2 * Math.sqrt(dlt / BAR)).toFixed(1) };
  for (const st of [1, 2, 4]) { let m = 0; for (const i of I) if (i - st >= 0 && i + st < S.length) { const A = S[i - st], B = S[i], C = S[i + st]; m = Math.max(m, Math.abs(((C.v - B.v) / (C.d - B.d) - (B.v - A.v) / (B.d - A.d)) / ((C.d - A.d) / 2))); } out['peak_h' + 4 * st + '_x_bar'] = +(m / BAR).toFixed(2); }
  console.log(JSON.stringify(out));
}

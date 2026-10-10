const T = __dirname + '/t/';
const { FLOORS, AT, WIDTHS, RATES } = require(T + 'src/geom/fonts.js');
const Prof = require(T + 'src/geom/profile.js');
const DEG = Math.PI / 180;
// the plan's shape rule: psi_i = c * F_i / F_edge, at AT of the half-width
const cupProfile = (fam, w, c) => { const F = FLOORS[fam], E = F[3]; const side = AT.map((f, i) => [f * w / 2, c * F[i] / E * DEG]);
  return Prof.normalize({ u: [...side.slice().reverse().map(([x]) => -x), 0, ...side.map(([x]) => x)], psi: [...side.slice().reverse().map(([, p]) => p), 0, ...side.map(([, p]) => p)] }); };
const out = {};
for (const fam of Object.keys(FLOORS)) {
  const w = 30; const Xedge = (c) => Prof.offsetAt(cupProfile(fam, w, c), w / 2)[0];
  // min X over the left side (sides meet when the left side reaches X <= 0)
  const minX = (c) => { const P = cupProfile(fam, w, c); let m = Infinity; for (let k = 1; k <= 2000; k++) m = Math.min(m, Prof.offsetAt(P, (w / 2) * k / 2000)[0]); return m; };
  let lo = 90, hi = 360; for (let it = 0; it < 80; it++) { const mid = (lo + hi) / 2; if (minX(mid) > 0) lo = mid; else hi = mid; }
  const rows = [90, 120, 150, 160, 170, 180].map((c) => { const P = cupProfile(fam, w, c), [X, Y] = Prof.offsetAt(P, w / 2); return { c, Xedge_over_halfw: +(X / (w / 2)).toFixed(4), Y_over_halfw: +(Y / (w / 2)).toFixed(4), gap_m_at_30m: +(2 * X).toFixed(3), minX_m: +minX(c).toFixed(3) }; });
  out[fam] = { F: FLOORS[fam], touch_deg: +lo.toFixed(3), rows };
}
// linear psi (circle) control: sides meet at exactly 180
{ const w = 30, P = (c) => Prof.normalize({ u: [-15, 0, 15], psi: [c * DEG, 0, c * DEG] }); const minX = (c) => { let m = Infinity; for (let k = 1; k <= 2000; k++) m = Math.min(m, Prof.offsetAt(P(c), 15 * k / 2000)[0]); return m; };
  let lo = 90, hi = 360; for (let it = 0; it < 80; it++) { const mid = (lo + hi) / 2; if (minX(mid) > 0) lo = mid; else hi = mid; } out.circle_control_touch_deg = +lo.toFixed(4); }
console.log(JSON.stringify(out, null, 1));

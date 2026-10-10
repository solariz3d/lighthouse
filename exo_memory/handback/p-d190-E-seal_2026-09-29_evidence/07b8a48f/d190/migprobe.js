// D190 row 5 probe (pane E): can "c = the effective edge after the old r cap, shape ψᵢ = c·Fᵢ/F_edge" reproduce a /2
// profile BIT FOR BIT? Three questions, measured at c964c2d: (1) the plan's arithmetic with no cap binding; (2) a constant
// B-spline channel evaluated by channelAt; (3) how far the proportional shape is from the capped one where the cap binds.
'use strict';
const T = __dirname + '/t/';
const D = require(T + 'src/core/document.js'), AD = require(T + 'src/core/adapter.js'), { FLOORS, AT, WIDTHS, RATES } = require(T + 'src/geom/fonts.js');
const DEG = Math.PI / 180;
const out = {};
// (1) the arithmetic: legacy psi_i = F_i (deg) * DEG after the cap's running sum; proportional = (E * F_i / E) * DEG
out.arith = {};
for (const fam of Object.keys(FLOORS)) {
  const leg = AD.profileAt(fam, WIDTHS[fam], RATES[fam]).psi.slice(5), E = leg[3] / DEG;
  const forms = { 'c*F/E': (i) => (E * FLOORS[fam][i] / FLOORS[fam][3]) * DEG, 'c*(F/E)': (i) => (E * (FLOORS[fam][i] / FLOORS[fam][3])) * DEG };
  out.arith[fam] = { legacy_edge_deg_exact: E, legacy_equals_F: leg.map((p, i) => p === FLOORS[fam].slice(0, i + 1).reduce((a, x, k) => a + (x - (k ? FLOORS[fam][k - 1] : 0)), 0) * DEG) };
  for (const [k, f] of Object.entries(forms)) out.arith[fam][k + ' bit-equal per quarter'] = leg.map((p, i) => f(i) === p);
}
// (2) a constant channel: every control point = 15.5; is channelAt(...).v === 15.5 at every s?
{
  const P = D.roadPiece({ length: 137.3, family: 'bowl', channels: { kh: () => 0, kv: () => 0, phi: () => 0, w: () => 31, r: () => 15.5 } });
  let n = 0, bad = 0, worst = 0;
  for (let k = 0; k <= 1373; k++) { const v = D.channelAt(P, 'r', k / 10).v; n++; if (v !== 15.5) { bad++; worst = Math.max(worst, Math.abs(v - 15.5)); } }
  out.constantChannel = { cps: P.channels.r.slice(0, 3), stations: n, not_bit_equal: bad, worst_abs: worst };
}
// (3) where the cap binds: the legacy capped profile against the proportional one with the same edge
out.capBinds = [];
for (const [fam, w] of [['bowl', 12], ['bowl', 18], ['half-pipe', 24], ['half-pipe', 12], ['flat', 20]]) {
  const r = RATES[fam], leg = AD.profileAt(fam, w, r).psi.slice(5).map((p) => p / DEG), E = leg[3];
  const prop = FLOORS[fam].map((F) => E * F / FLOORS[fam][3]);
  out.capBinds.push({ fam, w, r, legacy_deg: leg.map((x) => +x.toFixed(4)), proportional_deg: prop.map((x) => +x.toFixed(4)), worst_diff_deg: +Math.max(...leg.map((x, i) => Math.abs(x - prop[i]))).toFixed(4) });
}
// the widths below which the default rate's cap binds (the steepest quarter rise / (r/8))
out.bindBelowWidthM = Object.fromEntries(Object.keys(FLOORS).map((f) => { const F = FLOORS[f], d = Math.max(...F.map((x, i) => x - (i ? F[i - 1] : 0))); return [f, +(8 * d / RATES[f]).toFixed(3)]; }));
console.log(JSON.stringify(out, null, 1));

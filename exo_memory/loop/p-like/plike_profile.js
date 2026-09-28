// P-LIKE cross-section SHAPE statistics (B, D182; sealed with amendment 3). One definition for the real stretch and the rebuild:
//   node plike_profile.js <read.json> <fromM> <toM>   → JSON over the stations with fromM ≤ d ≤ toM
// Input: tools/read_track.cjs run with READ_PROFILE=1 (FINDINGS §7f): per station psiL/psiR = the tilt (° from the centre's normal)
// at ¼, ½, ¾ of the way out and at the edge, and wl/wr = each side's width in 1 m points.
'use strict';
const fs = require('fs');
const [file, fromArg, toArg] = process.argv.slice(2);
if (!file) { console.error('usage: node plike_profile.js <read.json> <fromM> <toM>'); process.exit(2); }
const from = Number(fromArg || 0), to = Number(toArg || 3000);
const r = JSON.parse(fs.readFileSync(file, 'utf8'));
const S = r.stations.filter((s) => s.d >= from && s.d <= to && s.c && s.k != null && !s.jump && !s.lost && !s.closed
  && Array.isArray(s.psiL) && Array.isArray(s.psiR) && s.wl > 0 && s.wr > 0);
if (S.length < 50) { console.error(`only ${S.length} stations with a profile in [${from}, ${to}] m (was the read made with READ_PROFILE=1?)`); process.exit(3); }
const q = (xs, p) => { const a = xs.slice().sort((x, y) => x - y), i = (a.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i); return +(a[lo] + (a[hi] - a[lo]) * (i - lo)).toFixed(2); };
const at = ['q1', 'q2', 'q3', 'edge'];
const side = (k) => {
  const P = S.map((s) => s[`psi${k}`]), W = S.map((s) => s[`w${k.toLowerCase()}`]);
  const psi = Object.fromEntries(at.map((name, i) => { const v = P.map((p) => p[i]); return [name, { p10: q(v, 0.1), median: q(v, 0.5), p90: q(v, 0.9) }]; }));
  // the steepest tilt change between neighbouring quarter points, in degrees per metre across (a lip at the rim shows here)
  const rate = S.map((s) => { const p = s[`psi${k}`], w = s[`w${k.toLowerCase()}`]; return Math.max(...[1, 2, 3].map((i) => (p[i] - p[i - 1]) / (w / 4))); });
  return { width_m: { median: q(W, 0.5) }, psi_deg: psi, maxTiltRate_degPerM: { median: q(rate, 0.5), p90: q(rate, 0.9) } };
};
console.log(JSON.stringify({ file: require('path').basename(file), from, to, stations: S.length, L: side('L'), R: side('R') }));

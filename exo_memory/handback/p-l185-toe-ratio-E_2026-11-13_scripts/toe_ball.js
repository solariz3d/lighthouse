// toe.js (pane E, D, 2026-11-13, the chair's D675 ruling): the recorded runner's fastest toe speed over its running speed,
// at each speed in the SimTK runningspeeds package (Dorn, Schache, Pandy 2012, subject JA1).
// node toe.js <data dir> [cutoff Hz ...]   (default 10 15 25)
// Toe: RTOE and LTOE, 3D speed in the lab frame by central difference of the low-passed marker (2nd-order Butterworth run
// forward and back, as angles.js), counted only where the marker was seen at both neighbouring frames. Running speed: the
// pelvis centre (mean of RASI, LASI, SACR), horizontal distance from its first to its last seen frame over the time.
'use strict';
const path = require('path');
const c3d = require('C:/Users/nname/Desktop/lighthouse/exo_memory/handback/p-spotcheck-sprintref-E_2026-11-13_scripts/c3d.js');

const DIR = process.argv[2];
const CUTS = process.argv.slice(3).map(Number);
const SIDES = (process.env.MARKERS || 'RTOE,LTOE').split(',');
const TRIALS = [
  { speed: '3.53', file: 'Run35ms/JA1Gait21.c3d' },
  { speed: '5.20', file: 'Run5ms/JA1Gait27.c3d' },
  { speed: '7.00', file: 'Run7ms/JA1Gait33.c3d' },
  { speed: '9.49', file: 'Run9ms/JA1Gait35.c3d' },
];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
function fill(series) {
  const n = series.length, out = series.slice();
  let last = -1;
  for (let i = 0; i < n; ++i) if (out[i] !== null) {
    if (last >= 0 && i - last > 1) for (let k = last + 1; k < i; ++k) out[k] = add(out[last], mul(sub(out[i], out[last]), (k - last) / (i - last)));
    last = i;
  }
  const f = out.findIndex((v) => v !== null);
  if (f < 0) return null;
  for (let i = 0; i < f; ++i) out[i] = out[f];
  for (let i = last + 1; i < n; ++i) out[i] = out[last];
  return out;
}
function butter2(fc, fs) {
  const k = Math.tan(Math.PI * fc / fs), q = Math.SQRT1_2, norm = 1 / (1 + k / q + k * k);
  const b0 = k * k * norm;
  return { b: [b0, 2 * b0, b0], a: [1, 2 * (k * k - 1) * norm, (1 - k / q + k * k) * norm] };
}
function lfilter(c, x) {
  const y = new Array(x.length);
  let x1 = x[0], x2 = x[0], y1 = x[0], y2 = x[0];
  for (let i = 0; i < x.length; ++i) {
    y[i] = c.b[0] * x[i] + c.b[1] * x1 + c.b[2] * x2 - c.a[1] * y1 - c.a[2] * y2;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = y[i];
  }
  return y;
}
function filtfilt(c, x) {
  const pad = Math.min(50, x.length - 1), ext = [];
  for (let i = pad; i > 0; --i) ext.push(2 * x[0] - x[i]);
  for (const v of x) ext.push(v);
  for (let i = 1; i <= pad; ++i) ext.push(2 * x[x.length - 1] - x[x.length - 1 - i]);
  return lfilter(c, lfilter(c, ext).reverse()).reverse().slice(pad, pad + x.length);
}
const smooth = (s, fc, fs) => { const c = butter2(fc, fs); const xs = [0, 1, 2].map((d) => filtfilt(c, s.map((p) => p[d]))); return s.map((_, i) => [xs[0][i], xs[1][i], xs[2][i]]); };

const rows = [];
for (const t of TRIALS) {
  const r = c3d.read(path.join(DIR, t.file));
  const col = (n) => { if (n.endsWith('BALL')) { const p = n[0]; const a = col(p + 'P1MT'), b = col(p + 'P5MT'); return a.map((x, i) => (x && b[i] ? mul(add(x, b[i]), 0.5) : null)); } const i = r.labels.indexOf(n); if (i < 0) throw new Error(t.file + ': no ' + n); return r.points.map((row) => row[i]); };
  const pel = col('RASI').map((a, i) => { const b = col('LASI')[i], c = col('SACR')[i]; return a && b && c ? mul(add(add(a, b), c), 1 / 3) : null; });
  const seen = pel.map((p, i) => (p ? i : -1)).filter((i) => i >= 0);
  if (seen.length < 2) throw new Error(t.file + ': pelvis not seen');
  const p0 = pel[seen[0]], p1 = pel[seen[seen.length - 1]];
  const run = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / 1000 / ((seen[seen.length - 1] - seen[0]) / r.rate);
  const row = { speed: t.speed, run, frames: r.points.length, rate: r.rate, cuts: {} };
  for (const fc of CUTS.length ? CUTS : [10, 15, 25]) {
    let best = { v: 0 };
    for (const side of SIDES) {
      const raw = col(side), f = fill(raw);
      if (!f) throw new Error(t.file + ': ' + side + ' never seen');
      const s = smooth(f, fc, r.rate);
      for (let i = 1; i + 1 < s.length; ++i) {
        if (!raw[i - 1] || !raw[i + 1]) continue;
        const v = Math.hypot(...sub(s[i + 1], s[i - 1])) / 1000 / (2 / r.rate);
        if (v > best.v) best = { v, side, t: i / r.rate };
      }
    }
    row.cuts[fc] = best;
  }
  rows.push(row);
}
console.log('| named speed | pelvis speed, m/s | fastest toe, m/s (10 / 15 / 25 Hz) | toe / running speed (10 / 15 / 25 Hz) | which toe, when (15 Hz) |');
console.log('|---|---|---|---|---|');
for (const w of rows) {
  const cs = Object.keys(w.cuts).map(Number).sort((a, b) => a - b);
  console.log(`| ${w.speed} | ${w.run.toFixed(2)} | ${cs.map((c) => w.cuts[c].v.toFixed(2)).join(' / ')} | ${cs.map((c) => (w.cuts[c].v / w.run).toFixed(2)).join(' / ')} | ${w.cuts[15] ? w.cuts[15].side + ' at ' + w.cuts[15].t.toFixed(3) + ' s' : '-'} |`);
}

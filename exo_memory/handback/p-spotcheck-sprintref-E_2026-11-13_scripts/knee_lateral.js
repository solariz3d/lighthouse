// knee_lateral.js: the 2D sagittal knee (K2: thigh angle minus shank angle, flexion positive) built from the lateral
// skin markers as the sprint papers place theirs: Harrington hip centre to RLEPI (lateral epicondyle) to RLMAL (lateral
// malleolus), each marker filtered at 15 Hz. At right strike and toe-off, every right stride. node knee_lateral.js <data>
'use strict';
const path = require('path');
const c3d = require('./c3d.js');
const DEG = 180 / Math.PI;
const dir = process.argv[2];
const trials = [['5.20', 'Run5ms/JA1Gait27.c3d'], ['7.00', 'Run7ms/JA1Gait33.c3d'], ['9.49', 'Run9ms/JA1Gait35.c3d']];
// Reuse nothing from angles.js but the same Harrington numbers, re-derived here from the static trial.
const s = c3d.read(path.join(dir, 'Static/JA1Static05.c3d'));
const meanS = (n) => { const i = s.labels.indexOf(n); let a = [0, 0, 0], k = 0; for (const r of s.points) if (r[i]) { a = a.map((v, j) => v + r[i][j]); ++k; } return a.map((v) => v / k); };
const sub = (a, b) => a.map((v, i) => v - b[i]), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a) => { const l = Math.hypot(...a); return a.map((v) => v / l); };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const ra = meanS('RASI'), la = meanS('LASI'), sa = meanS('SACR');
const midA = ra.map((v, i) => (v + la[i]) / 2);
const PW = Math.hypot(...sub(ra, la)), PD = Math.hypot(...sub(midA, sa));
const h = [-0.24 * PD - 9.9, -0.30 * PW - 10.9, 0.33 * PW + 7.3];
function lowpass(x, fc, fs) {
  const k = Math.tan(Math.PI * fc / fs), q = Math.SQRT1_2, n = 1 / (1 + k / q + k * k), b0 = k * k * n, a1 = 2 * (k * k - 1) * n, a2 = (1 - k / q + k * k) * n;
  const run = (v) => { const y = []; let x1 = v[0], x2 = v[0], y1 = v[0], y2 = v[0]; for (const xi of v) { const yi = b0 * xi + 2 * b0 * x1 + b0 * x2 - a1 * y1 - a2 * y2; y.push(yi); x2 = x1; x1 = xi; y2 = y1; y1 = yi; } return y; };
  const pad = 50, e = [];
  for (let i = pad; i > 0; --i) e.push(2 * x[0] - x[i]);
  e.push(...x);
  for (let i = 1; i <= pad; ++i) e.push(2 * x[x.length - 1] - x[x.length - 1 - i]);
  return run(run(e).reverse()).reverse().slice(pad, pad + x.length);
}
for (const [speed, file] of trials) {
  const c = c3d.read(path.join(dir, file));
  const get = (n) => {
    const i = c.labels.indexOf(n);
    let raw = c.points.map((r) => r[i]);
    let last = null; raw = raw.map((v) => (v ? (last = v) : last));   // hold the last seen (gaps here are at most 1 frame)
    const first = raw.find((v) => v); raw = raw.map((v) => v || first);
    const cols = [0, 1, 2].map((d) => lowpass(raw.map((p) => p[d]), 15, c.rate));
    return raw.map((_, f) => [cols[0][f], cols[1][f], cols[2][f]]);
  };
  const RA = get('RASI'), LA = get('LASI'), SA = get('SACR'), LE = get('RLEPI'), LM = get('RLMAL');
  const start = c.params['TRIAL:ACTUAL_START_FIELD'][0];
  const k2 = (f) => {
    const o = RA[f].map((v, i) => (v + LA[f][i]) / 2), Z = unit(sub(RA[f], LA[f])), fw = sub(o, SA[f]);
    const X = unit(fw.map((v, i) => v - Z[i] * dot(fw, Z))), Y = cross(Z, X);
    const hip = o.map((v, i) => v + X[i] * h[0] + Y[i] * h[1] + Z[i] * h[2]);
    const down = (a, b) => Math.atan2(b[1] - a[1], -(b[2] - a[2])) * DEG;
    return down(hip, LE[f]) - down(LE[f], LM[f]);
  };
  const at = (t) => { const x = t * c.rate - start + 1, i = Math.floor(x), w = x - i; return k2(i) * (1 - w) + k2(i + 1) * w; };
  const ev = c3d.events(c).filter((e) => e.context === 'Right');
  const out = ev.map((e) => `${e.label === 'Foot Strike' ? 'strike' : 'toe-off'} ${e.time.toFixed(3)} s: ${at(e.time).toFixed(1)}`);
  console.log(`${speed} m/s, K2 from lateral markers: ${out.join('; ')}`);
}

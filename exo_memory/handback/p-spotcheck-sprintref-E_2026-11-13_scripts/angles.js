// angles.js (pane E, D, the spot-check of 2026-11-13): right hip and knee angles from the SimTK runningspeeds markers
// (Dorn, Schache, Pandy 2012, subject JA1), computed independently of the sprint readers' scripts.
//
// node angles.js <data dir> [cutoff Hz, default 15] [json]
//
// Two definitions:
//   C3 (as simtk_dorn_running.md section 3B defines it, built here from its words, not its code): Cardan Z-X-Y of the
//      distal frame relative to the proximal; hip = femur vs pelvis (hip centre by Harrington et al. 2007 from RASI,
//      LASI, SACR), knee = shank vs femur, sign flipped so flexion is positive. Knee and ankle centres are the midpoints
//      of the epicondyles and malleoli, carried from the static trial by the clusters RTHLP-RTHAP-RTHLD (thigh) and
//      RTIAP-RTIAD-RTILAT (shank).
//   2D sagittal (lab Y forward, Z up), for the papers' event figures: thigh = hip centre to knee centre against the
//      vertical (forward positive, as Miyashiro's and Bissas's "thigh to vertical"); knee K2 = thigh angle minus shank
//      angle (flexion positive, centres collinear = 0); hip T2 = thigh angle plus the trunk's forward lean, the trunk being
//      hip centre to C7 (Miyashiro's runs greater trochanter to suprasternal notch; no notch marker here).
// Markers: gaps filled linearly; then a 2nd-order Butterworth low-pass run forward and back (zero lag, 4th-order
// effective), cut-off 15 Hz unless told otherwise. Frame k of a trial is at (k - 1) / rate s, k counted from 1 at
// the start of capture (TRIAL:ACTUAL_START_FIELD), which is how EVENT:TIMES are read here; checked against the plates.
'use strict';
const path = require('path');
const c3d = require('./c3d.js');

const DIR = process.argv[2];
const FC = Number(process.argv[3] || 15);
const JSON_OUT = process.argv[4] === 'json';
const TRIALS = [
  { speed: '5.20', file: 'Run5ms/JA1Gait27.c3d' },
  { speed: '7.00', file: 'Run7ms/JA1Gait33.c3d' },
  { speed: '9.49', file: 'Run9ms/JA1Gait35.c3d' },
];

// ---- vectors ----
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => mul(a, 1 / Math.hypot(a[0], a[1], a[2]));
const mid = (a, b) => mul(add(a, b), 0.5);
const DEG = 180 / Math.PI;

// A frame as three unit columns [X, Y, Z] in lab coordinates, with an origin.
function frameXYZ(origin, y, zHint) {
  const Y = unit(y);
  const X = unit(cross(Y, zHint));
  const Z = cross(X, Y);
  return { o: origin, X, Y, Z };
}
function toLocal(f, p) { const d = sub(p, f.o); return [dot(d, f.X), dot(d, f.Y), dot(d, f.Z)]; }
function toLab(f, l) { return add(f.o, add(mul(f.X, l[0]), add(mul(f.Y, l[1]), mul(f.Z, l[2])))); }
// A technical frame from three cluster markers.
function cluster(a, b, c) {
  const e1 = unit(sub(b, a));
  const e3 = unit(cross(e1, sub(c, a)));
  const e2 = cross(e3, e1);
  return { o: a, X: e1, Y: e2, Z: e3 };
}
// Cardan Z-X-Y of distal relative to proximal: R = P^T D = Rz(a) Rx(b) Ry(c); returns a (about Z) in degrees.
function cardanZ(P, D) {
  const cols = [D.X, D.Y, D.Z], rows = [P.X, P.Y, P.Z];
  const R = rows.map((r) => cols.map((c) => dot(r, c)));
  return Math.atan2(-R[0][1], R[1][1]) * DEG;
}

// ---- filtering ----
function fill(series) {
  const n = series.length, out = series.slice();
  let last = -1;
  for (let i = 0; i < n; ++i) {
    if (out[i] !== null) {
      if (last >= 0 && i - last > 1) for (let k = last + 1; k < i; ++k) out[k] = add(out[last], mul(sub(out[i], out[last]), (k - last) / (i - last)));
      last = i;
    }
  }
  const firstSeen = out.findIndex((v) => v !== null);
  if (firstSeen < 0) return null;
  for (let i = 0; i < firstSeen; ++i) out[i] = out[firstSeen];
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
  // Start from rest at the first value, so the filter does not ring up from zero.
  let x1 = x[0], x2 = x[0], y1 = x[0], y2 = x[0];
  for (let i = 0; i < x.length; ++i) {
    y[i] = c.b[0] * x[i] + c.b[1] * x1 + c.b[2] * x2 - c.a[1] * y1 - c.a[2] * y2;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = y[i];
  }
  return y;
}
function filtfilt(c, x) {
  // Pad by reflection, 50 samples each end.
  const pad = Math.min(50, x.length - 1);
  const ext = [];
  for (let i = pad; i > 0; --i) ext.push(2 * x[0] - x[i]);
  for (const v of x) ext.push(v);
  for (let i = 1; i <= pad; ++i) ext.push(2 * x[x.length - 1] - x[x.length - 1 - i]);
  const y = lfilter(c, lfilter(c, ext).reverse()).reverse();
  return y.slice(pad, pad + x.length);
}
function smooth(series, fc, fs) {
  const c = butter2(fc, fs);
  const xs = [0, 1, 2].map((d) => filtfilt(c, series.map((p) => p[d])));
  return series.map((_, i) => [xs[0][i], xs[1][i], xs[2][i]]);
}

// ---- the static trial ----
function calibrate(dir) {
  const s = c3d.read(path.join(dir, 'Static/JA1Static05.c3d'));
  const idx = (n) => { const i = s.labels.indexOf(n); if (i < 0) throw new Error('static: no ' + n); return i; };
  const mean = (n) => {
    const i = idx(n); let acc = [0, 0, 0], k = 0;
    for (const row of s.points) if (row[i]) { acc = add(acc, row[i]); ++k; }
    if (k === 0) throw new Error('static: ' + n + ' never seen');
    return mul(acc, 1 / k);
  };
  const m = {};
  for (const n of ['RASI', 'LASI', 'SACR', 'RTHLP', 'RTHAP', 'RTHLD', 'RTIAP', 'RTIAD', 'RTILAT', 'RLEPI', 'RMEPI', 'RLMAL', 'RMMAL', 'C7'])
    m[n] = mean(n);
  const thigh = cluster(m.RTHLP, m.RTHAP, m.RTHLD), shank = cluster(m.RTIAP, m.RTIAD, m.RTILAT);
  const midAsis = mid(m.RASI, m.LASI);
  const PW = Math.hypot(...sub(m.RASI, m.LASI)), PD = Math.hypot(...sub(midAsis, m.SACR));
  return {
    frames: s.points.length,
    PW, PD,
    hjc: [-0.24 * PD - 9.9, -0.30 * PW - 10.9, 0.33 * PW + 7.3],   // Harrington et al. 2007, pelvis frame, mm
    thigh: { LEPI: toLocal(thigh, m.RLEPI), MEPI: toLocal(thigh, m.RMEPI) },
    shank: { LEPI: toLocal(shank, m.RLEPI), MEPI: toLocal(shank, m.RMEPI), LMAL: toLocal(shank, m.RLMAL), MMAL: toLocal(shank, m.RMMAL) },
    static: m,
  };
}

function pelvisFrame(RASI, LASI, SACR) {
  const o = mid(RASI, LASI);
  const Z = unit(sub(RASI, LASI));
  const fwd = sub(o, SACR);
  const X = unit(sub(fwd, mul(Z, dot(fwd, Z))));
  const Y = cross(Z, X);
  return { o, X, Y, Z };
}

// The angles in every frame of a trial (or the static frames, with `markersOf` given the mean).
function anglesAt(cal, mk) {
  const pel = pelvisFrame(mk.RASI, mk.LASI, mk.SACR);
  const hip = toLab(pel, cal.hjc);
  const th = cluster(mk.RTHLP, mk.RTHAP, mk.RTHLD), sh = cluster(mk.RTIAP, mk.RTIAD, mk.RTILAT);
  const kneeT = mid(toLab(th, cal.thigh.LEPI), toLab(th, cal.thigh.MEPI));
  const latT = sub(toLab(th, cal.thigh.LEPI), toLab(th, cal.thigh.MEPI));
  const kneeS = mid(toLab(sh, cal.shank.LEPI), toLab(sh, cal.shank.MEPI));
  const ankle = mid(toLab(sh, cal.shank.LMAL), toLab(sh, cal.shank.MMAL));
  const latS = sub(toLab(sh, cal.shank.LMAL), toLab(sh, cal.shank.MMAL));
  const femur = frameXYZ(hip, sub(hip, kneeT), latT);
  const shank = frameXYZ(ankle, sub(kneeS, ankle), latS);
  const hipC3 = cardanZ(pel, femur);
  const kneeC3 = -cardanZ(femur, shank);
  // 2D sagittal: lab Y forward, Z up. Angles from straight down, forward positive.
  const down = (from, to) => Math.atan2(to[1] - from[1], -(to[2] - from[2])) * DEG;
  const thigh2 = down(hip, kneeT), shank2 = down(kneeT, ankle);
  const lean = Math.atan2(mk.C7[1] - hip[1], mk.C7[2] - hip[2]) * DEG;   // the trunk from upright, forward positive
  return { hipC3, kneeC3, thigh2, knee2: thigh2 - shank2, hip2: thigh2 + lean };
}

function trial(dir, cal, t) {
  const c = c3d.read(path.join(dir, t.file));
  const need = ['RASI', 'LASI', 'SACR', 'RTHLP', 'RTHAP', 'RTHLD', 'RTIAP', 'RTIAD', 'RTILAT', 'C7'];
  const series = {};
  let gaps = 0;
  for (const n of need) {
    const i = c.labels.indexOf(n);
    if (i < 0) throw new Error(t.file + ': no ' + n);
    const raw = c.points.map((r) => r[i]);
    let run = 0;
    for (const v of raw) { run = v === null ? run + 1 : 0; gaps = Math.max(gaps, run); }
    series[n] = smooth(fill(raw), FC, c.rate);
  }
  const n = c.points.length;
  const ang = [];
  for (let f = 0; f < n; ++f) {
    const mk = {};
    for (const k of need) mk[k] = series[k][f];
    ang.push(anglesAt(cal, mk));
  }
  const start = (c.params['TRIAL:ACTUAL_START_FIELD'] || [c.first])[0];
  const time = (f) => (start + f - 1) / c.rate;
  const ev = c3d.events(c);
  const at = (tm, key) => {   // linear interpolation in time
    const x = tm * c.rate - start + 1, i = Math.floor(x), w = x - i;
    if (i < 0 || i + 1 >= n) return NaN;
    return ang[i][key] * (1 - w) + ang[i + 1][key] * w;
  };
  const rfs = ev.filter((e) => e.context === 'Right' && e.label === 'Foot Strike').map((e) => e.time);
  const rfo = ev.filter((e) => e.context === 'Right' && e.label === 'Foot Off').map((e) => e.time);
  const strides = [];
  for (let s = 0; s + 1 < rfs.length; ++s) {
    const t0 = rfs[s], t1 = rfs[s + 1];
    const to = rfo.find((x) => x > t0 && x < t1);
    if (to === undefined) continue;
    const row = { t0, t1, to, toPct: (100 * (to - t0)) / (t1 - t0) };
    for (const key of ['hipC3', 'kneeC3', 'thigh2', 'knee2', 'hip2']) {
      row[key] = { strike: at(t0, key), takeoff: at(to, key), grid: [] };
      // Swing peaks (toe-off to the next strike), sampled every frame.
      let best = -Infinity, bestT = to;
      for (let f = 0; f < n; ++f) {
        const tf = time(f);
        if (tf >= to && tf <= t1 && ang[f][key] > best) { best = ang[f][key]; bestT = tf; }
      }
      row[key].swingMax = best;
      let st = -Infinity;
      for (let f = 0; f < n; ++f) { const tf = time(f); if (tf >= t0 && tf <= to && ang[f][key] > st) st = ang[f][key]; }
      row[key].stanceMax = st;
      row[key].swingMaxPct = (100 * (bestT - t0)) / (t1 - t0);
      let lo = Infinity, loT = t0;
      for (let f = 0; f < n; ++f) {
        const tf = time(f);
        if (tf >= t0 && tf <= t1 && ang[f][key] < lo) { lo = ang[f][key]; loT = tf; }
      }
      row[key].min = lo;
      row[key].minPct = (100 * (loT - t0)) / (t1 - t0);
      for (let p = 0; p <= 100; p += 10) row[key].grid.push(at(t0 + ((t1 - t0) * p) / 100, key));
    }
    strides.push(row);
  }
  return { speed: t.speed, file: t.file, start, rate: c.rate, frames: n, gaps, strides, events: ev };
}

const cal = calibrate(DIR);
// Standing values, from the static trial's mean markers.
const stand = anglesAt(cal, cal.static);
const out = { cutoff: FC, PW: cal.PW, PD: cal.PD, hjc: cal.hjc, standing: stand, trials: TRIALS.map((t) => trial(DIR, cal, t)) };
if (JSON_OUT) { process.stdout.write(JSON.stringify(out, null, 1)); return; }
const f1 = (v) => (Number.isFinite(v) ? v.toFixed(1) : 'n/a');
console.log(`cut-off ${FC} Hz; pelvis width ${f1(cal.PW)} mm, depth ${f1(cal.PD)} mm; hip centre ${cal.hjc.map(f1).join(' / ')} mm`);
console.log(`standing: hip C3 ${f1(stand.hipC3)}, knee C3 ${f1(stand.kneeC3)}, thigh 2D ${f1(stand.thigh2)}, knee 2D ${f1(stand.knee2)}, hip 2D ${f1(stand.hip2)}`);
for (const tr of out.trials) {
  console.log(`\n${tr.speed} m/s (${tr.file}, ${tr.frames} frames from ${tr.start}, longest marker gap ${tr.gaps} frames)`);
  tr.strides.forEach((s, i) => {
    console.log(`  stride ${i + 1}: strike ${s.t0.toFixed(3)} s, toe-off ${s.to.toFixed(3)} s (${s.toPct.toFixed(1)} %), next strike ${s.t1.toFixed(3)} s`);
    for (const k of ['hipC3', 'kneeC3', 'thigh2', 'knee2', 'hip2'])
      console.log(`    ${k.padEnd(6)} strike ${f1(s[k].strike).padStart(6)}  take-off ${f1(s[k].takeoff).padStart(6)}  swing max ${f1(s[k].swingMax).padStart(6)} at ${s[k].swingMaxPct.toFixed(0)} %  min ${f1(s[k].min).padStart(6)} at ${s[k].minPct.toFixed(0)} %   grid 0..100: ${s[k].grid.map(f1).join(' ')}`);
  });
}

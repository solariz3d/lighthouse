// pelvis_check.js (pane E, D, 2026-11-13): the yardstick owner's read of C's L205 gate and laws, from the SimTK markers,
// with E's own reader (c3d.js), independent of C's scripts.
//   (a) the runner's PELVIS CENTRE (half the mid-ASIS, half SACR, C's definition) over each right stride at 3.53, 5.19,
//       6.97, 9.47 m/s: its travel (highest - lowest, mm and % of its standing height) and where its highest and lowest
//       fall (stance R / flight / stance L / flight, and how far from the nearest strike). Also the sacrum alone, and the
//       Harrington hip centres' midpoint (closest to our rigid pelvis's hips).
//   (b) a pelvis that FOLLOWS THE STANCE LEG, built from his own sagittal leg (hip centre, knee centre, ankle centre in 2D,
//       his own segment lengths), with the ankle of the foot down held at its standing height (as ours is) and, in
//       flight, a straight line from take-off height to the next strike's: its travel, against his pelvis centre's.
// node pelvis_check.js <data dir> [cutoff Hz, default 15]
'use strict';
const path = require('path');
const c3d = require('./c3d.js');
const DIR = process.argv[2];
const FC = Number(process.argv[3] || 15);
const TRIALS = [['3.53', 'Run35ms/JA1Gait21.c3d'], ['5.19', 'Run5ms/JA1Gait27.c3d'], ['6.97', 'Run7ms/JA1Gait33.c3d'], ['9.47', 'Run9ms/JA1Gait35.c3d']];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => mul(a, 1 / Math.hypot(...a));
const mid = (a, b) => mul(add(a, b), 0.5);
function lowpass(x, fc, fs) {
  const k = Math.tan(Math.PI * fc / fs), q = Math.SQRT1_2, n = 1 / (1 + k / q + k * k), b0 = k * k * n, a1 = 2 * (k * k - 1) * n, a2 = (1 - k / q + k * k) * n;
  const run = (v) => { const y = []; let x1 = v[0], x2 = v[0], y1 = v[0], y2 = v[0]; for (const xi of v) { const yi = b0 * xi + 2 * b0 * x1 + b0 * x2 - a1 * y1 - a2 * y2; y.push(yi); x2 = x1; x1 = xi; y2 = y1; y1 = yi; } return y; };
  const pad = Math.min(50, x.length - 1), e = [];
  for (let i = pad; i > 0; --i) e.push(2 * x[0] - x[i]);
  e.push(...x);
  for (let i = 1; i <= pad; ++i) e.push(2 * x[x.length - 1] - x[x.length - 1 - i]);
  return run(run(e).reverse()).reverse().slice(pad, pad + x.length);
}
const series = (c, name) => {
  const i = c.labels.indexOf(name);
  if (i < 0) throw new Error('no marker ' + name);
  let raw = c.points.map((r) => r[i]);
  let last = null;
  raw = raw.map((v) => (v ? (last = v) : last));
  const first = raw.find((v) => v);
  raw = raw.map((v) => v || first);
  if (!(FC > 0)) return raw;
  const cols = [0, 1, 2].map((d) => lowpass(raw.map((p) => p[d]), FC, c.rate));
  return raw.map((_, f) => [cols[0][f], cols[1][f], cols[2][f]]);
};
// Harrington hip centres (as angles.js), from the static trial's pelvis size.
const st = c3d.read(path.join(DIR, 'Static/JA1Static05.c3d'));
const meanS = (n) => { const i = st.labels.indexOf(n); let a = [0, 0, 0], k = 0; for (const r of st.points) if (r[i]) { a = add(a, r[i]); ++k; } return mul(a, 1 / k); };
const sRA = meanS('RASI'), sLA = meanS('LASI'), sSA = meanS('SACR');
const PW = Math.hypot(...sub(sRA, sLA)), PD = Math.hypot(...sub(mid(sRA, sLA), sSA));
const centre = (ra, la, sa) => add(mul(mid(ra, la), 0.5), mul(sa, 0.5));
const standing = centre(sRA, sLA, sSA)[2];
function hips(ra, la, sa) {
  const o = mid(ra, la), Z = unit(sub(ra, la)), fw = sub(o, sa);
  const X = unit(sub(fw, mul(Z, dot(fw, Z)))), Y = cross(Z, X);
  const at = (side) => add(o, add(mul(X, -0.24 * PD - 9.9), add(mul(Y, -0.30 * PW - 10.9), mul(Z, side * (0.33 * PW + 7.3)))));
  return [at(1), at(-1)];   // right, left
}
// The static trial's own: each leg's ankle height (lateral malleolus, as a stand-in for the ankle centre's) and lengths.
const sRL = meanS('RLEPI'), sRM = meanS('RLMAL');
const [sHR] = hips(sRA, sLA, sSA);
const ankleStand = sRM[2];
console.log(`cut-off ${FC > 0 ? FC + ' Hz' : 'none'}; the pelvis centre standing ${standing.toFixed(1)} mm (C: 1111.7); pelvis width ${PW.toFixed(1)}, depth ${PD.toFixed(1)}`);
for (const [speed, file] of TRIALS) {
  const c = c3d.read(path.join(DIR, file));
  const RA = series(c, 'RASI'), LA = series(c, 'LASI'), SA = series(c, 'SACR');
  const RE = series(c, 'RLEPI'), RM = series(c, 'RLMAL'), LE = series(c, 'LLEPI'), LM = series(c, 'LLMAL');
  const start = (c.params['TRIAL:ACTUAL_START_FIELD'] || [c.first])[0];
  const fr = (t) => Math.round(t * c.rate - start + 1);
  const ev = c3d.events(c);
  const evs = (ctx, lab) => ev.filter((e) => e.context === ctx && e.label === lab).map((e) => fr(e.time));
  const rfs = evs('Right', 'Foot Strike'), rfo = evs('Right', 'Foot Off'), lfs = evs('Left', 'Foot Strike'), lfo = evs('Left', 'Foot Off');
  const phaseOf = (f) => {   // which foot is down at frame f
    const last = (arr) => arr.filter((x) => x <= f).pop();
    const rs = last(rfs), ro = last(rfo), ls = last(lfs), lo = last(lfo);
    const rDown = rs !== undefined && (ro === undefined || ro < rs);
    const lDown = ls !== undefined && (lo === undefined || lo < ls);
    return rDown ? 'R down' : lDown ? 'L down' : 'flight';
  };
  const strikes = rfs.concat(lfs).sort((a, b) => a - b);
  const nearestStrike = (f) => strikes.reduce((b, s) => (Math.abs(s - f) < Math.abs(b) ? s - f : b), 1e9);
  for (let s = 0; s + 1 < rfs.length; ++s) {
    const f0 = rfs[s], f1 = rfs[s + 1], n = f1 - f0;
    const report = (label, ys) => {
      let hi = -1e9, lo = 1e9, hiF = f0, loF = f0;
      for (let f = f0; f <= f1; ++f) { if (ys[f] > hi) hi = ys[f], hiF = f; if (ys[f] < lo) lo = ys[f], loF = f; }
      const where = (f) => `${(100 * (f - f0) / n).toFixed(0)}% (${phaseOf(f)}, ${nearestStrike(f) >= 0 ? nearestStrike(f) + ' frames before' : -nearestStrike(f) + ' frames after'} a strike)`;
      console.log(`  ${label.padEnd(26)} travel ${(hi - lo).toFixed(1)} mm = ${(100 * (hi - lo) / standing).toFixed(2)}%; highest at ${where(hiF)}; lowest at ${where(loF)}`);
    };
    console.log(`${speed} m/s, right stride ${s + 1} (frames ${f0}-${f1})`);
    const pc = RA.map((_, f) => centre(RA[f], LA[f], SA[f])[2]);
    report('pelvis centre (C\'s)', pc);
    report('sacrum alone', SA.map((p) => p[2]));
    report('Harrington hips\' midpoint', RA.map((_, f) => { const [hr, hl] = hips(RA[f], LA[f], SA[f]); return 0.5 * (hr[2] + hl[2]); }));
    // (b) a pelvis following the stance leg, the ankle held at standing height: the hip centre over the stance ankle by the
    // leg's own 2D (sagittal: lab Y-Z) geometry, hip height = ankle standing height + the leg's vertical reach.
    const follow = [];
    let lastDown = null;
    for (let f = f0; f <= f1; ++f) {
      const ph = phaseOf(f);
      const [hr, hl] = hips(RA[f], LA[f], SA[f]);
      const leg = ph === 'R down' ? [hr, RE[f], RM[f]] : ph === 'L down' ? [hl, LE[f], LM[f]] : null;
      if (leg) {
        const reach = (leg[0][2] - leg[1][2]) + (leg[1][2] - leg[2][2]);   // thigh's and shank's vertical parts
        follow[f] = ankleStand + reach;
        lastDown = f;
      } else follow[f] = null;
    }
    for (let f = f0; f <= f1; ++f) if (follow[f] === null) {   // flight: a line from take-off to the next strike
      let a = f; while (a > f0 && follow[a] === null) --a;
      let b = f; while (b < f1 && follow[b] === null) ++b;
      const ya = follow[a] ?? follow[b], yb = follow[b] ?? ya;
      follow[f] = ya + (yb - ya) * (b > a ? (f - a) / (b - a) : 0);
    }
    const arr = []; for (let f = 0; f <= f1; ++f) arr[f] = f >= f0 ? follow[f] : 0;
    report('stance leg followed (b)', arr);
  }
}

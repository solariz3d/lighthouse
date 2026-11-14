// ball_ankle.js <simtk dir>: ONE runner (JA1; Dorn, Schache & Pandy's SimTK runningspeeds package). Through the LAST
// TENTH OF EVERY STANCE (each foot's strike to its own next take-off, from the file's EVENT section), where the ball and
// the toe marker sit against the ankle ALONG THE RUN (+Y, the trial's forward travel; mm in the file, metres here).
//   ball: the mid of the 1st and 5th metatarsal-head markers (P1MT, P5MT); ankle: the lateral malleolus (LMAL; the
//   dynamic trials carry no medial marker, so the static trial's lateral-to-centre offset along the run is printed);
//   toe: the TOE marker. Positive: ahead of the ankle; negative: BEHIND it. Raw markers (no filter); a frame where any of
//   the three is unseen (residual < 0, or stored at the origin) is skipped and counted.
// The chair's ruling of 00:10Z (D675): read at 6.97 and 9.47 m/s; 3.53 and 5.19 printed too.
'use strict';
const path = require('path');
const { readC3d } = require('./c3dread.js');
const DIR = process.argv[2];
const TRIALS = [['3.53', 'Run35ms/JA1Gait21.c3d'], ['5.19', 'Run5ms/JA1Gait27.c3d'], ['6.97', 'Run7ms/JA1Gait33.c3d'], ['9.47', 'Run9ms/JA1Gait35.c3d']];
const seen = (p) => p && !(p[3] < 0) && !(p[0] === 0 && p[1] === 0 && p[2] === 0) && p[0] !== 65535;

{  // the static trial: the medial against the lateral malleolus along the run, standing
  const c = readC3d(path.join(DIR, 'Static/JA1Static05.c3d'));
  for (const s of ['L', 'R']) {
    const lat = c.point(s + 'LMAL'), med = c.point(s + 'MMAL');
    let d = 0, n = 0;
    for (let f = 0; f < c.frames; ++f) if (seen(lat[f]) && seen(med[f])) d += (med[f][1] - lat[f][1]) / 1000, ++n;
    console.log(`static ${s}: the ankle centre (malleoli mid) lies ${(d / n / 2 * 1000).toFixed(1)} mm along the run from the lateral malleolus (${n} frames)`);
  }
}
for (const [speed, file] of TRIALS) {
  const c = readC3d(path.join(DIR, file));
  const t0 = (c.first - 1) / c.rate;
  const ev = { times: c.params['EVENT:TIMES'] || [], labels: c.params['EVENT:LABELS'] || [], ctx: c.params['EVENT:CONTEXTS'] || [] };
  const events = [];
  for (let i = 0; i < ev.labels.length; i++) events.push({ t: ev.times[i * 2] * 60 + ev.times[i * 2 + 1], label: ev.labels[i], side: ev.ctx[i] });
  events.sort((a, b) => a.t - b.t);
  const frameAt = (t) => Math.round((t - t0) * c.rate);
  const lines = [];
  for (const [s, side] of [['L', /left/i], ['R', /right/i]]) {
    const ank = c.point(s + 'LMAL'), m1 = c.point(s + 'P1MT'), m5 = c.point(s + 'P5MT'), toe = c.point(s + 'TOE');
    const strikes = events.filter((e) => /strike/i.test(e.label) && side.test(e.side));
    for (const st of strikes) {
      const off = events.find((e) => /off/i.test(e.label) && side.test(e.side) && e.t > st.t);
      if (!off) continue;
      const a = frameAt(st.t), z = frameAt(off.t);
      if (a < 0 || z >= c.frames || z <= a) continue;
      const from = Math.round(z - 0.1 * (z - a));
      let ballMin = Infinity, toeMin = Infinity, skipped = 0, ballOff = null, toeOff = null;
      for (let f = from; f <= z; ++f) {
        if (!seen(ank[f]) || !seen(m1[f]) || !seen(m5[f]) || !seen(toe[f])) { ++skipped; continue; }
        const ball = (m1[f][1] + m5[f][1]) / 2;
        const b = (ball - ank[f][1]) / 1000, t = (toe[f][1] - ank[f][1]) / 1000;
        ballMin = Math.min(ballMin, b);
        toeMin = Math.min(toeMin, t);
        if (f === z) ballOff = b, toeOff = t;
      }
      lines.push(`  ${s} stance ${st.t.toFixed(3)}-${off.t.toFixed(3)} s (${z - a} frames; last tenth ${z - from + 1}, ${skipped} skipped): ` +
                 `ball ahead of the ankle, least ${ballMin === Infinity ? 'n/a' : ballMin.toFixed(3)} m, at take-off ${ballOff === null ? 'unseen' : ballOff.toFixed(3)}; ` +
                 `toe marker, least ${toeMin === Infinity ? 'n/a' : toeMin.toFixed(3)}, at take-off ${toeOff === null ? 'unseen' : toeOff.toFixed(3)}`);
    }
  }
  console.log(`${speed} m/s (${file}, ${c.rate} Hz):`);
  for (const l of lines) console.log(l);
}

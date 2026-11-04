// the measured figures of test 5, beside B's sealed theory (for the hand-back)
const W = require('C:/Users/nname/Desktop/t180-track-builder/src/core/water.js'), { buildPath } = require('C:/Users/nname/Desktop/t180-track-builder/src/geom/path.js');
const R = 500, v = 70.0357, prof = { u: [-15, 0, 15], psi: [0, 0, 0] }, D = [-14, -7, 0, 7, 14];
for (const [name, th, run] of [['5a 45°', Math.PI / 4, { laps: 1 }], ['5b 10°', 10 * Math.PI / 180, { distance: 400 }]]) {
  const seg = { length: 2 * Math.PI * R, k0: 1 / R, k1: 1 / R, roll0: -th, roll1: -th, profile: prof }, path = buildPath([seg], { closed: true });
  const S = W.surfaceFrom({ samples: path.samples, closed: true, lengthM: path.lengthM, profileAt: () => prof });
  const t0 = Date.now(), r = W.pour(S, { speed: v, streams: D.map((d) => ({ u: -d })), ...run }), ms = Date.now() - t0;
  console.log(`${name}: ${ms} ms, h 0.01 s`);
  r.streams.forEach((s, k) => { const d = s.track.u.map((u) => -u);
    console.log(`  d0 ${D[k]}: ${s.outcome}  d [${Math.min(...d).toFixed(4)}, ${Math.max(...d).toFixed(4)}]  Nmin/g ${(Math.min(...s.track.N) / 9.81).toFixed(4)}  E drift/|E0| ${(s.energy.maxAbsDrift / Math.abs(s.energy.E0)).toExponential(2)}  /½v² ${s.energy.maxRelDrift.toExponential(2)}` +
      (s.at ? `  at s ${s.at.s.toFixed(2)} d ${(-s.at.u).toFixed(2)} t ${s.at.t.toFixed(3)}` : '')); });
  console.log('  shocks:', JSON.stringify(r.reds.filter((x) => x.type === 'shock').map((x) => [x.streams.map((k) => D[k]), +x.s.toFixed(2), +(-x.u).toFixed(2)])));
}

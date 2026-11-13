// static_toe.js <static.c3d>: where the recorded runner's toe markers sit on the foot, standing (Dorn, Schache & Pandy's
// SimTK package, the Static trial). Mean of every frame each marker is seen; the foot's forward line is heel to toe along
// the floor; distances in metres. Reader: pane E's c3d.js (the spot-check's).
'use strict';
const c3d = require('C:/Users/nname/Desktop/lighthouse/exo_memory/handback/p-spotcheck-sprintref-E_2026-11-13_scripts/c3d.js');
const c = c3d.read(process.argv[2]);
const labels = c.labels.map((l) => l.trim().toUpperCase());
console.log('foot markers in the file:', labels.filter((l) => /TOE|HEE|ANK|MT|MAL|MED|CAL|FOOT/.test(l)).join(' '));
const mean = (name) => {
  const i = labels.indexOf(name);
  if (i < 0) return null;
  const s = [0, 0, 0];
  let n = 0;
  for (const fr of c.points) if (fr[i]) { for (let k = 0; k < 3; k++) s[k] += fr[i][k]; n++; }
  return n ? s.map((v) => v / n / 1000) : null;
};
// Which axis is up: the one along which the heads/shoulders sit highest above the toes.
const top = mean('C7') || mean('LSHO') || mean('RSHO');
const toeL = mean('LTOE');
let up = 2;
if (top && toeL) { const d = top.map((v, k) => Math.abs(v - toeL[k])); up = d.indexOf(Math.max(...d)); }
console.log('up axis', 'xyz'[up]);
for (const side of ['L', 'R']) {
  const toe = mean(side + 'TOE'), hee = mean(side + 'HEEL'), ank = mean(side + 'LMAL'), med = mean(side + 'MMAL'), m1 = mean(side + 'P1MT'), m5 = mean(side + 'P5MT');
  if (!toe || !hee || !ank) { console.log(side, 'missing a marker'); continue; }
  const h = (p) => p.filter((_, k) => k !== up);
  const fwd = h(toe).map((v, k) => v - h(hee)[k]);
  const len = Math.hypot(...fwd);
  const u = fwd.map((v) => v / len);
  const along = (p) => h(p).reduce((s, v, k) => s + (v - h(hee)[k]) * u[k], 0);
  const centre = med ? ank.map((v, k) => (v + med[k]) / 2) : ank;
  const floor = Math.min(toe[up], hee[up]);
  console.log(`${side}: heel to toe marker ${len.toFixed(3)} m along the floor; the ${med ? 'ankle centre (lateral and medial malleoli)' : 'lateral malleolus'} ${along(centre).toFixed(3)} m from the heel marker, ${(centre[up] - floor).toFixed(3)} m above the lower of the two; ` +
    `so the TOE marker is ${(along(toe) - along(centre)).toFixed(3)} m ahead of the ankle and ${(toe[up] - centre[up]).toFixed(3)} m from it in height (marker heights: toe ${toe[up].toFixed(3)}, heel ${hee[up].toFixed(3)}, ankle ${ank[up].toFixed(3)})`);
  if (m1 && m5) { const ball = m1.map((v, k) => (v + m5[k]) / 2); console.log(`${side}: the ball (mid of the 1st and 5th metatarsal heads) ${(along(ball) - along(centre)).toFixed(3)} m ahead of the ankle, ${(ball[up] - floor).toFixed(3)} m up; the TOE marker ${(along(toe) - along(ball)).toFixed(3)} m ahead of the ball, ${(toe[up] - floor).toFixed(3)} m up`); }
}

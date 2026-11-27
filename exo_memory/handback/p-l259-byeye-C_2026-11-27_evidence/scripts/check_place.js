'use strict';
// the app's own placement (f3cd425 src/reference/ribbon.js placeAt, apply) on the read's lead point, with the card's nudge: it should land on his start
const fs = require('fs'), M = require('./measure.js');
const { placeAt, apply } = require('C:/Consonance/t180-wt-c-l259/src/reference/ribbon.js');
const read = JSON.parse(fs.readFileSync('t2.read.json', 'utf8')), ref = M.readRef(read), st = JSON.parse(fs.readFileSync('start.json', 'utf8'));
const l = Math.hypot(...st.fwd), start = { pos: [st.pos[0], read.stations[0].c[1], st.pos[2]], T: st.fwd.map((v) => v / l) };
const nudges = JSON.parse(fs.readFileSync('nudges.json', 'utf8'));
for (const [key, v] of Object.entries(nudges)) {
  let k = 0; ref.arc.forEach((m, j) => { if (Math.abs(m - v.leadAt) < Math.abs(ref.arc[k] - v.leadAt)) k = j; }); const Mx0 = 0; const Mx = placeAt({ start }, { pos: [0, 0, 0], T: [0, 0, 1] }, { dx: v.nudge.x, dy: v.nudge.up, dz: v.nudge.z, yawDeg: v.nudge.turn });
  const p = apply(Mx, ref.P[k]), t = apply(Mx, ref.T[k], 0);
  console.log(`${key}: lead point (${v.leadAt} m) lands at ${p.map((x) => x.toFixed(2)).join(', ')}, facing heading ${(Math.atan2(t[0], t[2]) * 180 / Math.PI).toFixed(2)} deg (app placeAt)`);
}

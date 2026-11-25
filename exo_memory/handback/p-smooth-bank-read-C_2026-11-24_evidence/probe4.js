'use strict';
const D = require('./t/src/core/document.js'), { extend } = require('./t/src/core/extend.js');
const DEG = Math.PI / 180;
const lead = extend(D.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } });
const cases = [
  [[72.9, -26.5], [123.7, -25.5], [178.6, -17.4], [193.3, 29.6]],
  [[88, -30], [102.6, 7]],
  [[48.3, 20.6], [91.6, -4.1], [115, 0.6], [132.7, -12.5]],
  [[80, -20], [100, 20]],          // round numbers: 40 degrees over 20 m, monotone
  [[80, -20], [140, 20]],
];
for (const c of cases) {
  const [f, ...r] = c, o = { length: 300, targets: { phi: f[1] * DEG }, transition: { phi: f[0] }, bankShape: 'flow', through: { phi: r.map(([at, t]) => ({ at, target: t * DEG })) } };
  const d = extend(lead, o), P = d.pieces[1]; let mx = { v: 0, s: 0 }, mn = { v: 0, s: 0 }, rate = 0;
  for (let s = 0; s <= 300; s += 0.25) { const a = D.channelAt(P, 'phi', s), v = a.v / DEG; if (v > mx.v) mx = { v, s }; if (v < mn.v) mn = { v, s }; rate = Math.max(rate, Math.abs(a.d1 / DEG)); }
  console.log(c.map((m) => m.join(':')).join(' '), `| max ${mx.v.toFixed(2)} at ${mx.s} | min ${mn.v.toFixed(2)} at ${mn.s} | peak roll ${rate.toFixed(2)} deg/m | laid (checkDoc passed)`);
}

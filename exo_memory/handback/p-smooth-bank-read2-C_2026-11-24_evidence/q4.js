'use strict';
// q4: the two lists my 0.1 m read found on the wrong side on the built road; read the document and the built road around the spot
const D = require('./t/src/core/document.js'), { extend } = require('./t/src/core/extend.js'), RP = require('./t/test/roll_profile.js');
const DEG = Math.PI / 180, lead = extend(D.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } });
const parse = (s) => s.split(' ').map((x) => { const [a, t] = x.split(':').map(Number); return { at: a, target: t * DEG }; });
for (const [txt, from, to] of [['90.4:30.9 137.5:12.4 193.2:-42.5 233.3:-28.0 260:-6.7', 120, 150], ['48.1:-2.5 67.6:-14.9', 0, 60]]) {
  const m = parse(txt), doc = extend(lead, { length: 300, targets: { phi: m[0].target }, transition: { phi: m[0].at }, bankShape: 'flow', through: { phi: m.slice(1) } });
  const P = doc.pieces[1], B = RP.builtBank(doc, 0.5); console.log(txt, ' samples near:', B.slice(0, 2).map((b) => JSON.stringify(b)).join(' '));
  for (let s = from; s <= to; s += (to - from) / 15) console.log(`  s ${s.toFixed(1)}  doc ${(D.channelValue(P, 'phi', s) / DEG).toFixed(4)}  road ${RP.near(B, 300 + s).v.toFixed(4)} (sample s ${RP.near(B, 300 + s).s})`);
}

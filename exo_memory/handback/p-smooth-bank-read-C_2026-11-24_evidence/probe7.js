'use strict';
const D = require('./t/src/core/document.js'), { extend } = require('./t/src/core/extend.js'), RP = require('./t/test/roll_profile.js');
const DEG = Math.PI / 180;
const lead = extend(D.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } });
const c = [[72.9, -26.5], [123.7, -25.5], [178.6, -17.4], [193.3, 29.6]], [f, ...r] = c;
const d = extend(lead, { length: 300, targets: { phi: f[1] * DEG }, transition: { phi: f[0] }, bankShape: 'flow', through: { phi: r.map(([at, t]) => ({ at, target: t * DEG })) } });
const b = RP.builtBank(d).filter((x) => x.s >= 300 && x.s <= 600); const mn = b.reduce((p, q) => (q.v < p.v ? q : p));
console.log('built road min bank', mn.v.toFixed(2), 'at track m', mn.s, '| doc min -93.76 at piece m 157.5');

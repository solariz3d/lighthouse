// closed_rt.js <tree>: does a closed lap's document round-trip (serialize, parse, serialize)? and is it stable after one round?
'use strict';
const path = require('path'); const T = path.resolve(process.argv[2]); const R = (p) => require(path.join(T, p));
const D = R('src/core/document.js'), { extend } = R('src/core/extend.js'), { extendTurnBy } = R('src/core/turnby.js'), CJ = R('app/core/closejob.js'); const DEG = Math.PI / 180, Q = 300 * Math.PI / 2;
const lap = (wind) => { let d = D.createDoc('lap'); d = extend(d, { length: 100, family: 'bowl' }); d = extendTurnBy(d, { length: Q }, 90 * DEG);
  d = extend(d, { length: 300, targets: { phi: wind ? -360 * DEG : -20 * DEG } }); d = extend(d, { length: Q / 2, targets: { kh: 1 / 300 } }); d = extendTurnBy(d, { length: Q / 2 }, 67.5 * DEG);
  d = extend(d, { length: 200, targets: { phi: wind ? -392 * DEG : -32 * DEG } }); d = extendTurnBy(d, { length: Q }, 90 * DEG); d = extend(d, { length: 100 }); d = extendTurnBy(d, { length: Q }, 90 * DEG); return d; };
for (const wind of [true, false]) {
  const r = CJ.runCloseBest({ doc: lap(wind) }); const t = D.serialize(r.doc), s1 = D.serialize(D.parse(t)), s2 = D.serialize(D.parse(s1));
  let at = 0; while (at < t.length && t[at] === s1[at]) at++;
  console.log(JSON.stringify({ wound: wind, closed: !!r.doc.closed, roundTrip: s1 === t, stableAfterOne: s2 === s1, firstDiffAt: s1 === t ? null : at, around: s1 === t ? null : [t.slice(Math.max(0, at - 30), at + 30), s1.slice(Math.max(0, at - 30), at + 30)] }));
}

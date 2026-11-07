// fx.js: the tube fixture document (open), built with extend
'use strict';
const path = require('path');
const STEPS = [
  // name, length, transition, targets (every piece holds t, kh, kv and phi unless it sets them, so no channel drifts on from a ringing fit)
  ['lead-in', 80, null, { t: 0 }],
  ['abrupt-close', 100, 40, { t: 360 }],
  ['closed-run', 120, null, { t: 360 }],
  ['abrupt-open', 120, 40, { t: 0 }],
  ['road-between', 60, 20, { t: 0 }],
  ['gradual-close', 200, 200, { t: 360 }],
  ['bend-in', 200, 60, { t: 360, kh: 1 / 150 }],
  ['bend-out', 100, 60, { t: 360 }],
  ['bank-in', 150, 100, { t: 360, phi: 0.2 }],
  ['bank-out', 150, 100, { t: 360 }],
  ['climb-in', 100, 50, { t: 360, kv: 0.001 }],
  ['climb', 100, 50, { t: 360 }],
  ['crest-in', 150, 100, { t: 360, kv: -0.0007 }],
  ['crest-out', 150, 100, { t: 360 }],
  ['gradual-open', 200, 200, { t: 0 }],
  ['run-out', 80, null, { t: 0 }],
];
module.exports = function build(T) {
  const R = (p) => require(path.join(T, p)), D = R('src/core/document.js'), { extend } = R('src/core/extend.js');
  let d = null, s = 0; const at = {};
  for (const [name, length, transition, tg] of STEPS) {
    const targets = { kh: 0, kv: 0, phi: 0, ...tg };
    d = d ? extend(d, { length, ...(transition ? { transition } : {}), targets }) : extend(D.createDoc('tube cases'), { length, first: { w: 40, t: tg.t } });
    at[name] = [s, s + length]; s += length;
  }
  return { doc: d, at };
};
if (require.main === module) { const { doc, at } = module.exports(process.argv[2]); console.log(JSON.stringify(at), doc.pieces.length); }

// lanfx.js <tree> <out>: a LANIAKEA-SHAPED stand-in (his save is not on this machine): 27 m wide (his export's ui_track.json), banked sweepers, a twist, and a climb up
// through vertical and over (the shape whose AI point 1e-6 off vertical crashed AC, D603). Every channel held, so nothing drifts on from a ringing fit.
'use strict';
const fs = require('fs'), path = require('path');
const STEPS = [
  ['lead-in', 120, null, {}],
  ['sweep-in', 300, 120, { kh: 1 / 300, phi: 0.25 }],
  ['sweep', 200, null, { kh: 1 / 300, phi: 0.25 }],
  ['sweep-out', 200, 120, {}],
  ['straight', 300, null, {}],
  ['esse-left', 200, 100, { kh: 1 / 200, phi: 0.15 }],
  ['esse-right', 300, 150, { kh: -1 / 200, phi: -0.15 }],
  ['esse-out', 150, 100, {}],
  ['twist-in', 150, 150, { phi: 0.5 }],
  ['twist-out', 150, 150, { phi: -0.3 }],
  ['level', 150, 100, {}],
  ['dip', 120, 60, { kv: -0.004 }],
  ['loop-in', 120, 60, { kv: 1 / 60 }],
  ['loop', 140, null, { kv: 1 / 60 }],
  ['loop-out', 120, 60, {}],
  ['run-out', 200, null, {}],
];
module.exports = function build(T) {
  const R = (p) => require(path.join(T, p)), D = R('src/core/document.js'), { extend } = R('src/core/extend.js');
  let d = null; const at = {}; let s = 0;
  for (const [name, length, transition, tg] of STEPS) {
    const targets = { kh: 0, kv: 0, phi: 0, t: 0, ...tg };
    d = d ? extend(d, { length, ...(transition ? { transition } : {}), targets }) : extend(D.createDoc('light hull'), { length, first: { w: 27, t: 0 } });
    at[name] = [s, s + length]; s += length;
  }
  return { doc: d, at };
};
if (require.main === module) {
  const T = process.argv[2], D = require(path.join(T, 'src/core/document.js')), A = require(path.join(T, 'src/core/adapter.js'));
  const { doc, at } = module.exports(T);
  fs.writeFileSync(process.argv[3], D.serialize(doc));
  const sm = A.toPath(doc, { step: 2 }).path.samples; let maxP = -9, minUp = 9;
  for (const q of sm) { maxP = Math.max(maxP, Math.asin(Math.max(-1, Math.min(1, q.T[1]))) * 180 / Math.PI); minUp = Math.min(minUp, q.U[1]); }
  console.log(JSON.stringify(at), 'pieces', doc.pieces.length, 'max pitch deg', maxP.toFixed(1), 'least up.y', minUp.toFixed(2));
}

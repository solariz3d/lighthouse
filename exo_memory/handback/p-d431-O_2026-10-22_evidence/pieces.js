'use strict';
// D431 (O): each new piece's net turn and net climb (degrees: the integral of kh and kv along it) on one tree's finish of TEST 10 and row 2, and its largest |kh| and |kv|.
//   node pieces.js <tree>
const TREE = process.argv[2], fs = require('fs'), path = require('path');
const D = require(`${TREE}/src/core/document.js`), F = require(`${TREE}/src/core/finish.js`), { extend } = require(`${TREE}/src/core/extend.js`), { extendTurnBy } = require(`${TREE}/src/core/turnby.js`);
const U = JSON.parse(fs.readFileSync(path.join(__dirname, 'test10', 'eq-TEST 10.t180undo'), 'utf8'));
const row2 = () => { let d = D.createDoc('t'); d = extend(d, { length: 500, family: 'bowl' }); d = extend(d, { length: 600, transition: 60, targets: { kv: -0.0002 } }); d = extend(d, { length: 600, transition: 60, targets: { kv: 0 } }); return extendTurnBy(d, { length: 900, targets: { kv: 0 } }, Math.PI); };
for (const [name, open] of [['TEST 10', D.parse(U.past[21])], ['row 2', row2()]]) {
  const r = F.finishToStart(open);
  for (const P of r.doc.pieces.slice(open.pieces.length)) {
    let th = 0, pv = 0, mh = 0, mv = 0; const n = 2000;
    for (let i = 0; i < n; i++) { const s = (P.length * (i + 0.5)) / n, v = D.valuesAt(P, s); th += v.kh * P.length / n; pv += v.kv * P.length / n; mh = Math.max(mh, Math.abs(v.kh)); mv = Math.max(mv, Math.abs(v.kv)); }
    const deg = (x) => +(x * 180 / Math.PI).toFixed(2), p100 = (x) => +(x * 100 * 180 / Math.PI).toFixed(2);
    console.log(JSON.stringify({ lap: name, piece: P.id, lengthM: Math.round(P.length), turnDeg: deg(th), climbDeg: deg(pv), maxKh_per100: p100(mh), maxKv_per100: p100(mv) }));
  }
}

'use strict';
// D431 (O), THE AMENDED BAR (after the first Gram result, stricter than the registered one): at each closer joint (between the pieces the finish laid, and the seam
// into the lap's first piece), in kh and kv (°/100 m), the six control points before the joint and five after it (the first after is the last before); any point
// that stands beyond BOTH its immediate neighbours (a one-knot spike) by more than 0.05 fails. Reads a finish result file of beforeafter.js? No: it finishes itself.
//   node bar2.js <tree>
const TREE = process.argv[2], fs = require('fs'), path = require('path');
const D = require(`${TREE}/src/core/document.js`), F = require(`${TREE}/src/core/finish.js`), { extend } = require(`${TREE}/src/core/extend.js`), { extendTurnBy } = require(`${TREE}/src/core/turnby.js`);
const per100 = (v) => (v * 100 * 180) / Math.PI;
const U = JSON.parse(fs.readFileSync(path.join(__dirname, 'test10', 'eq-TEST 10.t180undo'), 'utf8'));
const row2 = () => { let d = D.createDoc('t'); d = extend(d, { length: 500, family: 'bowl' }); d = extend(d, { length: 600, transition: 60, targets: { kv: -0.0002 } }); d = extend(d, { length: 600, transition: 60, targets: { kv: 0 } }); return extendTurnBy(d, { length: 900, targets: { kv: 0 } }, Math.PI); };
function spikes(doc, from) {
  const pairs = []; for (let j = from + 1; j < doc.pieces.length; j++) pairs.push([j - 1, j]); if (doc.closed) pairs.push([doc.pieces.length - 1, 0]);
  return pairs.flatMap(([i, j]) => ['kh', 'kv'].map((ch) => {
    const a = doc.pieces[i].channels[ch].map(per100), b = doc.pieces[j].channels[ch].map(per100), S = [...a.slice(-6), ...b.slice(1, 6)];
    let over = 0, at = null;
    for (let k = 1; k + 1 < S.length; k++) { const hi = Math.max(S[k - 1], S[k + 1]), lo = Math.min(S[k - 1], S[k + 1]), o = S[k] > hi ? S[k] - hi : S[k] < lo ? lo - S[k] : 0; if (o > over) { over = o; at = k - 5; } }
    return { joint: `${doc.pieces[i].id}|${doc.pieces[j].id}`, ch, over: +over.toFixed(3), knotFromJoint: at, seq: S.map((v) => +v.toFixed(2)) };
  }));
}
for (const [name, open] of [['TEST 10', D.parse(U.past[21])], ['row 2', row2()]]) {
  const r = F.finishToStart(open);
  for (const x of spikes(r.doc, open.pieces.length)) console.log(JSON.stringify({ lap: name, ...x }));
}

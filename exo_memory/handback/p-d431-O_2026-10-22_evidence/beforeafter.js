'use strict';
// D431 (O): one tree's finish of TEST 10's open lap (the undo history's past[21]) and of row 2's lap: the plan, the closure, the lowest road load on the new road
// (finish.js roadHold), whether every piece the finish did not lay is the very same bytes as the open lap's, and each closer joint's control points (°/100 m),
// with the bar's overshoot.   node beforeafter.js <tree> <out.json>
const [TREE, OUT] = process.argv.slice(2);
const fs = require('fs'), path = require('path');
const D = require(`${TREE}/src/core/document.js`), F = require(`${TREE}/src/core/finish.js`), { residual } = require(`${TREE}/src/core/close.js`);
const { extend } = require(`${TREE}/src/core/extend.js`), { extendTurnBy } = require(`${TREE}/src/core/turnby.js`);
const per100 = (v) => +((v * 100 * 180) / Math.PI).toFixed(3);
function joints(doc, from) {
  const pairs = []; for (let j = from + 1; j < doc.pieces.length; j++) pairs.push([j - 1, j]); if (doc.closed) pairs.push([doc.pieces.length - 1, 0]);
  return pairs.flatMap(([i, j]) => ['kh', 'kv'].map((ch) => { const a = doc.pieces[i].channels[ch].map(per100), b = doc.pieces[j].channels[ch].map(per100), n = a.length;
    const outer = [a[n - 4], a[n - 3], b[2], b[3]], inner = [a[n - 2], a[n - 1], b[1]], lo = Math.min(...outer), hi = Math.max(...outer);
    return { joint: `${doc.pieces[i].id}|${doc.pieces[j].id}`, ch, points: [a[n - 4], a[n - 3], a[n - 2], a[n - 1], '|', b[1], b[2], b[3]], over: +Math.max(...inner.map((v) => (v < lo ? lo - v : v > hi ? v - hi : 0))).toFixed(3) }; }));
}
const U = JSON.parse(fs.readFileSync(path.join(__dirname, 'test10', 'eq-TEST 10.t180undo'), 'utf8'));
const row2 = () => { let d = D.createDoc('t'); d = extend(d, { length: 500, family: 'bowl' }); d = extend(d, { length: 600, transition: 60, targets: { kv: -0.0002 } }); d = extend(d, { length: 600, transition: 60, targets: { kv: 0 } }); return extendTurnBy(d, { length: 900, targets: { kv: 0 } }, Math.PI); };
const out = {};
for (const [name, open] of [['TEST 10', D.parse(U.past[21])], ['row 2 (212 m climb)', row2()]]) {
  const t0 = Date.now(); const r = F.finishToStart(open); const ms = Date.now() - t0, n0 = open.pieces.length, rs = residual(r.doc);
  const untouched = open.pieces.every((P, i) => D.serialize({ ...open, pieces: [P] }) === D.serialize({ ...open, pieces: [r.doc.pieces[i]] }));
  out[name] = { ms, plan: r.plan.report, gapMm: +(rs.gapM * 1000).toFixed(4), tangentRad: rs.tangentRad, minHoldG: r.plan.minHoldG, untouchedPiecesSameBytes: untouched, newPieces: r.doc.pieces.length - n0, joints: joints(r.doc, n0) };
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
for (const [k, v] of Object.entries(out)) { console.log(`== ${k}: ${v.plan}`); console.log(`   gap ${v.gapMm} mm, lowest load ${v.minHoldG} g, untouched pieces same bytes: ${v.untouchedPiecesSameBytes}, ${v.ms} ms`); for (const j of v.joints) console.log(`   ${j.joint} ${j.ch.padEnd(2)} over ${String(j.over).padEnd(6)} ${j.points.join(' ')}`); }

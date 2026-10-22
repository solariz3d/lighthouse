'use strict';
// D431 (O): one saved Finish (undo history past[<k>]) finished on one tree: the plan, the gap, the lowest road load, whether every piece it did not lay keeps its
// bytes, and at each laid joint and the seam (kh, kv, °/100 m, six points before | five after) the worst one-knot spike (bar2's measure).
//   node check-undo.js <tree> <undo file> <k>
const [TREE, UNDO, K] = process.argv.slice(2);
const fs = require('fs'), D = require(`${TREE}/src/core/document.js`), F = require(`${TREE}/src/core/finish.js`), { residual } = require(`${TREE}/src/core/close.js`);
const p100 = (v) => (v * 100 * 180) / Math.PI;
const open = D.parse(JSON.parse(fs.readFileSync(UNDO, 'utf8')).past[Number(K)]), r = F.finishToStart(open), n0 = open.pieces.length, rs = residual(r.doc);
const same = open.pieces.every((P, i) => D.serialize({ ...open, pieces: [P] }) === D.serialize({ ...open, pieces: [r.doc.pieces[i]] }));
console.log(JSON.stringify({ plan: r.plan.report.slice(0, 120), gapMm: +(rs.gapM * 1000).toFixed(3), minHoldG: r.plan.minHoldG, untouchedSameBytes: same }));
const pairs = []; for (let j = n0 + 1; j < r.doc.pieces.length; j++) pairs.push([j - 1, j]); pairs.push([r.doc.pieces.length - 1, 0]);
for (const [i, j] of pairs) for (const ch of ['kh', 'kv']) {
  const S = [...r.doc.pieces[i].channels[ch].map(p100).slice(-6), ...r.doc.pieces[j].channels[ch].map(p100).slice(1, 6)];
  let o = 0; for (let k = 1; k + 1 < S.length; k++) { const hi = Math.max(S[k - 1], S[k + 1]), lo = Math.min(S[k - 1], S[k + 1]); o = Math.max(o, S[k] > hi ? S[k] - hi : S[k] < lo ? lo - S[k] : 0); }
  console.log(`${r.doc.pieces[i].id}|${r.doc.pieces[j].id} ${ch} spike ${o.toFixed(3).padStart(7)}  ${S.map((v) => v.toFixed(2)).join(' ')}`);
}

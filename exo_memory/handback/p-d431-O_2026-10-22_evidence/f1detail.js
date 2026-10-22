'use strict';
// D431 (O): F1 opened by dropping 1 and 2 pieces, finished: at each closer joint and the seam, kh and kv (°/100 m), six points before and five after, as LAID
// (the document finishToStart hands its successful windowed close: close.js's export wrapped before finish.js loads) and as CLOSED.   node f1detail.js <tree>
const TREE = process.argv[2], fs = require('fs'), path = require('path');
const CM = require(`${TREE}/src/core/close.js`), c0 = CM.close; let cap = null;
CM.close = function (doc, opts) { const r = c0(doc, opts); if (opts && opts.window && r.converged) cap = doc; return r; };
const D = require(`${TREE}/src/core/document.js`), F = require(`${TREE}/src/core/finish.js`);
const per100 = (v) => +((v * 100 * 180) / Math.PI).toFixed(2);
const doc = D.parse(fs.readFileSync(path.join(TREE, 'test', 'fixtures', 'F1-bowl-default-lap-closed.core2.json'), 'utf8'));
for (const drop of [1, 2]) {
  const open = D.checkDoc({ ...doc, closed: false, pieces: doc.pieces.slice(0, doc.pieces.length - drop) }); cap = null;
  const r = F.finishToStart(open), n0 = open.pieces.length;
  console.log(`== drop ${drop}: ${r.plan.report.slice(0, 90)}; laid pieces: ${cap.pieces.slice(n0).map((P) => `${P.id} ${Math.round(P.length)} m`).join(', ')}`);
  const pairs = []; for (let j = n0 + 1; j < r.doc.pieces.length; j++) pairs.push([j - 1, j]); pairs.push([r.doc.pieces.length - 1, 0]);
  for (const [i, j] of pairs) for (const ch of ['kh']) {
    const seq = (d) => [...d.pieces[i].channels[ch].map(per100).slice(-6), '|', ...d.pieces[j].channels[ch].map(per100).slice(1, 6)].join(' ');
    console.log(`  ${r.doc.pieces[i].id}|${r.doc.pieces[j].id} ${ch} laid   ${seq(cap)}`); console.log(`  ${' '.repeat(r.doc.pieces[i].id.length + r.doc.pieces[j].id.length + 1)} ${ch} closed ${seq(r.doc)}`);
  }
}

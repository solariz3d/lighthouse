'use strict';
// D431 (O): reproduce a saved Finish from its undo history: finishToStart on past[<k>] against the saved present, byte for byte; then each laid joint's kh and kv
// (°/100 m), the last 4 points before | the first 4 after.   node repro2.js <tree> <undo file> <k>
const [TREE, UNDO, K] = process.argv.slice(2);
const fs = require('fs');
const D = require(`${TREE}/src/core/document.js`), { finishToStart } = require(`${TREE}/src/core/finish.js`);
const U = JSON.parse(fs.readFileSync(UNDO, 'utf8')), open = D.parse(U.past[Number(K)]), saved = D.parse(U.present);
const t0 = Date.now(), r = finishToStart(open), ms = Date.now() - t0, n0 = open.pieces.length;
const p100 = (v) => +((v * 100 * 180) / Math.PI).toFixed(2);
console.log(JSON.stringify({ openPieces: n0, ms, plan: r.plan.report, window: r.window, reproducesSavedBytes: D.serialize(r.doc) === D.serialize(saved) }));
for (let j = n0; j < r.doc.pieces.length; j++) for (const ch of ['kh', 'kv']) { const A = r.doc.pieces[j - 1], B = r.doc.pieces[j]; console.log(`${A.id}|${B.id} ${ch}  ${A.channels[ch].slice(-4).map(p100).join(' ')} | ${B.channels[ch].slice(1, 4).map(p100).join(' ')}`); }

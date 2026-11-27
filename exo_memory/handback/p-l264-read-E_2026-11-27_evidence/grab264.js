// grab264.js (pane E, L264 read): Sculpt's GRAB (beginFollow, the app's brush, sharp as the app runs it) setting the width at the head; then one Extend as shown, 100 m. One tree.
'use strict';
const path = require('path'), crypto = require('crypto'), T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const h = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 12);
const doc = (s) => s.getState().history.present;
const plain = () => extend(extend(D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * Math.PI / 180 } });
(async () => {
  for (const [d, r, dw] of [[5, 20, 1.37], [10, 20, 2], [0, 10, 2], [20, 30, -2]]) {
    const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(plain()); s.setSculpt(true); const L = doc(s).pieces.reduce((a, P) => a + P.length, 0);
    s.beginFollow({ s0: L - d, r }); const m0 = s.getState().message; s.brushTo({ w: dw }); s.endBrush(); const msg = s.getState().message;
    const d0 = doc(s), head = D.endState(d0).w;
    s.extend(extendOptions({ ...BLANK, head: s.headState() })); const P = doc(s).pieces.at(-1);
    let maxDev = 0; for (let k = 0; k <= 1000; k++) { const v = D.channelValue(P, 'w', k / 10) - head.v; if (Math.abs(v) > Math.abs(maxDev)) maxDev = v; }
    const noW = (Q) => { const { w, ...channels } = Q.channels; return { ...Q, channels }; };
    console.log(`grab end-${d} r ${r} w ${dw > 0 ? '+' : ''}${dw}: ${m0 ? `begin: ${m0.slice(0, 60)} | ` : ''}${msg ? `msg ${msg.slice(0, 70)} | ` : ''}head ${head.v.toFixed(4)} (${head.m.toExponential(3)}); Extend ends ${D.pieceEnd(P).w.v.toFixed(4)} (${D.pieceEnd(P).w.m.toExponential(2)}), max dev ${(1000 * maxDev).toFixed(1)} mm, joint ${D.jointProblem(D.pieceEnd(d0.pieces.at(-1)), P, D.kindOf(d0.pieces.at(-1))) || 'ok'}, placed same ${h(doc(s).pieces.slice(0, -1)) === h(d0.pieces)}, other channels ${h(noW(P))}`);
  }
})().catch((e) => { console.error('grab264 failed:', e); process.exit(1); });

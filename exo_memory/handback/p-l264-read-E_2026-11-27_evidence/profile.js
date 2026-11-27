// profile.js (pane E, L264 read): the held width's profile after brushes at the head (the app's brush), one Extend as shown of 100 m and of 400 m, on ONE tree:
// w(s) − head at stations, and the width's own second derivative's largest size (the edge's bend in plan), against the brushed road's own.
// usage: node profile.js <tree>
'use strict';
const path = require('path');
const T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const plain = () => extend(extend(D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * Math.PI / 180 } });
const doc = (s) => s.getState().history.present;
const wpp = (P, x) => { const e = 0.05; return (D.channelValue(P, 'w', x + e) - 2 * D.channelValue(P, 'w', x) + D.channelValue(P, 'w', x - e)) / (e * e); };
(async () => {
  for (const [d, delta] of [[5, 1.37], [10, 1.37], [19, 5], [30, 5]]) for (const length of [100, 400]) {
    const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(plain());
    const L = doc(s).pieces.reduce((a, P) => a + P.length, 0); s.beginBrush({ mode: 'rate', channel: 'w', s0: L - d, r: 20 }); s.brushTo(delta); s.endBrush();
    const before = doc(s), prev = before.pieces.at(-1), head = D.pieceEnd(prev).w;
    s.extend(extendOptions({ ...BLANK, length, head: s.headState() })); const P = doc(s).pieces.at(-1);
    const at = [4, 8.4, 12, 16, 20, 25, 30, 40, 50, 60, 70, 80, 90, 99, 150, 200, 300, 399].filter((x) => x <= length).map((x) => `${x}:${(D.channelValue(P, 'w', x) - head.v >= 0 ? '+' : '')}${(1000 * (D.channelValue(P, 'w', x) - head.v)).toFixed(1)}`);
    let k2new = 0, k2old = 0; for (let x = 0.1; x < Math.min(length, 60); x += 0.1) k2new = Math.max(k2new, Math.abs(wpp(P, x))); for (let x = 0.1; x < prev.length - 0.1; x += 0.1) k2old = Math.max(k2old, Math.abs(wpp(prev, x)));
    console.log(`brush end-${d} r20 ${delta > 0 ? '+' : ''}${delta} | head ${head.v.toFixed(4)} m ${head.m.toExponential(3)} | Extend ${length} m: w - head in mm at s: ${at.join(' ')} | max |w''| new ${k2new.toExponential(2)} /m, brushed piece ${k2old.toExponential(2)} /m`);
  }
})().catch((e) => { console.error('profile failed:', e); process.exit(1); });

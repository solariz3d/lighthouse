// exact268.js (pane B, L268): from where on is the held width within 1e-9 m of the head's (every 0.01 m; evaluation sums ulps, so not bit-exact), and how far it goes past relative to the head's slope, on E's
// eight heads and the 400 m and 10 m pieces. usage: node exact268.js <tree>
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const plain = () => extend(extend(D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * Math.PI / 180 } });
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + P.length, 0);
const sh = async (sculpt) => { const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(plain()); if (sculpt) s.setSculpt(true); return s; };
const heads = [['E1', async () => { const s = await sh(); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - 5, r: 20 }); s.brushTo(1.37); s.endBrush(); return s; }],
  ['E4', async () => { const s = await sh(); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - 30, r: 40 }); s.brushTo(5); s.endBrush(); return s; }],
  ['E6', async () => { const s = await sh(true); s.beginFollow({ s0: total(doc(s)) - 10, r: 20 }); s.brushTo({ w: 2 }); s.endBrush(); return s; }],
  ['E7', async () => { const s = await sh(true); s.beginFollow({ s0: total(doc(s)) - 20, r: 30 }); s.brushTo({ w: -2 }); s.endBrush(); return s; }]];
(async () => {
  for (const [name, mk] of heads) for (const length of [100, 400, 10]) {
    const s = await mk(), head = D.pieceEnd(doc(s).pieces.at(-1)).w; s.extend(extendOptions({ ...BLANK, length, head: s.headState() })); const P = doc(s).pieces.at(-1);
    let lastOff = 0, swing = 0; for (let k = 0; k <= length * 100; k++) { const x = k / 100, dv = D.channelValue(P, 'w', x) - head.v; if (Math.abs(dv) > 1e-9) lastOff = x; if (Math.abs(dv) > Math.abs(swing)) swing = dv; }
    console.log(`${name} ${length} m: head slope ${head.m.toFixed(5)}; within 1e-9 m of the head's width from ${lastOff} m on (the last station, every 0.01 m, more than 1e-9 m off); swing ${(1000 * swing).toFixed(2)} mm = ${(swing / head.m).toFixed(3)} x the slope`);
  }
})().catch((e) => { console.error(e); process.exit(1); });

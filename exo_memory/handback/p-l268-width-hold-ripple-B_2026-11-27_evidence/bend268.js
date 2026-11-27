// bend268.js (pane B, L268): how hard the edge bends: the largest |w''| (per metre) of the brushed piece itself, and of the held piece Extend lays after it (100 m), on
// E's eight heads, one tree. usage: node bend268.js <tree>
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const plain = () => extend(extend(D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * Math.PI / 180 } });
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + P.length, 0);
const sh = async (sculpt) => { const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(plain()); if (sculpt) s.setSculpt(true); return s; };
const br = (d, r, x) => async () => { const s = await sh(); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - d, r }); s.brushTo(x); s.endBrush(); return s; };
const gr = (d, r, x) => async () => { const s = await sh(true); s.beginFollow({ s0: total(doc(s)) - d, r }); s.brushTo({ w: x }); s.endBrush(); return s; };
const tr = async () => { const s = await createCoreShell({ brushFn: null, autosaveMs: 0 }); s.extend({ length: 300 }); s.extend({ length: 1000, targets: { kh: 1 / 700, kv: 0.0004, phi: 0.2, w: 40, c: 20 } }); s.extend({ length: 75, transition: 30, targets: { w: 25 } }); return s; };
const wpp = (P, x) => { const e = 0.05; return (D.channelValue(P, 'w', x + e) - 2 * D.channelValue(P, 'w', x) + D.channelValue(P, 'w', x - e)) / (e * e); };
const most = (P) => { let m = 0; for (let x = 0.1; x < P.length - 0.1; x += 0.1) m = Math.max(m, Math.abs(wpp(P, x))); return m; };
(async () => {
  for (const [n, mk] of [['E1', br(5, 20, 1.37)], ['E2', br(10, 20, 1.37)], ['E3', br(19, 20, 5)], ['E4', br(30, 40, 5)], ['E5', gr(5, 20, 1.37)], ['E6', gr(10, 20, 2)], ['E7', gr(20, 30, -2)], ['E8', tr]]) {
    const s = await mk(), prev = doc(s).pieces.at(-1); s.extend(extendOptions({ ...BLANK, head: s.headState() })); const P = doc(s).pieces.at(-1);
    const a = most(prev), b = most(P); console.log(`${n}: the brushed piece's own largest |w''| ${a.toExponential(2)}, the held piece's ${b.toExponential(2)}: ${(b / a).toFixed(2)} x`);
  }
})().catch((e) => { console.error(e); process.exit(1); });

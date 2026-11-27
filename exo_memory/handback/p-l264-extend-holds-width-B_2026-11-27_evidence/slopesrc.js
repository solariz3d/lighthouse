// slopesrc.js (pane B, L264): besides a brush, which ways of laying a width leave the width still changing at the head? From a head 40 m wide and level, a width of
// 25 typed: through the panel's own extendOptions (whole piece; "early" ticked) and through the core with a number transition (drag-ghost row 5's call), on 75 m and
// 300 m pieces; and Turn by and Sharp with a width typed. Prints the end value and slope of the width. Synthetic roads only. usage: node slopesrc.js <tree>
'use strict';
const path = require('path');
const T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js')), TB = require(path.join(T, 'src/core/turnby.js'));
const { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const base = () => extend(extend(D.createDoc('s'), { length: 300, first: { w: 31 } }), { length: 1000, targets: { kh: 1 / 700, w: 40 } });
const r = (x) => +x.toFixed(6);
const show = (label, f) => { try { const d = f(), e = D.pieceEnd(d.pieces[d.pieces.length - 1]).w; console.log(`${label}: ends ${r(e.v)}, slope ${r(e.m)} per m`); } catch (e) { console.log(`${label}: ${e.code || e.name} ${String(e.message).slice(0, 100)}`); } };
for (const L of [75, 300]) {
  const head = () => ({ w: D.endState(base()).w.v });
  show(`panel, width 25, ${L} m, whole piece`, () => extend(base(), extendOptions({ ...BLANK, length: L, width: '25', head: head() })));
  show(`panel, width 25, ${L} m, early ticked`, () => extend(base(), extendOptions({ ...BLANK, length: L, width: '25', atStart: { width: true }, head: head() })));
  show(`core, width 25, ${L} m, transition 30 (a number, as drag-ghost row 5)`, () => extend(base(), { length: L, transition: 30, targets: { w: 25 } }));
  show(`core, width 25, ${L} m, transition { w: 30 }`, () => extend(base(), { length: L, transition: { w: 30 }, targets: { w: 25 } }));
}
show('Turn by 45 deg over 300 m, width 25 typed', () => TB.extendCorner(base(), { length: 300, turnDeg: 45, targets: { w: 25 } }));
show('Turn by 45 deg over 300 m, transition 30 (a number), width 25 typed', () => TB.extendCorner(base(), { length: 300, turnDeg: 45, transition: 30, targets: { w: 25 } }));

// prof678.js (pane E, D678 Track 2): the held width's profile on one case, Extend 30 m with a bank of 8 at start after Sculpt's grab +4 at end-3 r 5, on one
// tree: the knots up to 14 m, the width control points' offsets from the head's width (first 12), and w - head every 0.5 m to 14 m. usage: node prof678.js <tree> [length]
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]), LEN = +(process.argv[3] || 30);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const plain = () => extend(extend(D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: (8 * Math.PI) / 180 } });
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
(async () => {
  const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(plain()); s.setSculpt(true); s.beginFollow({ s0: total(doc(s)) - 3, r: 5 }); s.brushTo({ w: 4 }); s.endBrush(); s.setSculpt(false);
  const a = D.pieceEnd(doc(s).pieces.at(-1)).w; s.extend(extendOptions({ ...BLANK, length: LEN, head: s.headState(), bank: 8, atStart: { bank: true } }));
  const P = doc(s).pieces.at(-1);
  console.log('head', a.v, a.m.toFixed(5), '| knots<14', P.knots.filter((k) => k < 14).join(','));
  console.log('w ctrl - head', P.channels.w.slice(0, 12).map((c) => (c - a.v).toFixed(4)).join(' '));
  const row = []; for (let x = 0; x <= 14; x += 0.5) row.push(`${x}:${(1000 * (D.channelValue(P, 'w', x) - a.v)).toFixed(1)}`); console.log('mm', row.join(' '));
})().catch((e) => { console.error('prof678 failed:', e); process.exit(1); });

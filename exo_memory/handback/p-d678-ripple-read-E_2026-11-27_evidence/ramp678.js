// ramp678.js (pane E, D678): would a LONGER hold ramp cost the bar? Run on a SCRATCH copy of c2591bf whose one line `holdR = … startRampM(length, knotM)` is
// replaced by `Math.min(length, F * startRampM(length, knotM))`, F from the environment (E678_RAMP_F; 1 is c2591bf itself, the control). Never committed.
// Heads: E1, E4, E6 of B's table (the app's brush, Sculpt's grab), then the panel's Extend as shown, 100 m and 200 m. For each: the swing past the head's width and
// where, the last station over 1 mm and over 1e-9 m off, the largest |w''| (B's step), the brushed piece's own, the joint and the end.
// B's registered bar (bec0f333): within 1 mm of the head's width from R on, R = startRampM(100) = 20 m. usage: node ramp678.js <tree> <F>
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]), F = process.argv[3];
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const plain = () => extend(extend(D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: (8 * Math.PI) / 180 } });
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + P.length, 0);
const sh = async (sculpt) => { const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(plain()); if (sculpt) s.setSculpt(true); return s; };
const wAt = (P, x) => D.channelValue(P, 'w', x), wpp = (P, x) => { const e = 0.05; return (wAt(P, x + e) - 2 * wAt(P, x) + wAt(P, x - e)) / (e * e); };
const most = (P) => { let m = 0; for (let x = 0.1; x < P.length - 0.1; x += 0.1) m = Math.max(m, Math.abs(wpp(P, x))); return m; };
const heads = [['E1', async () => { const s = await sh(); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - 5, r: 20 }); s.brushTo(1.37); s.endBrush(); return s; }],
  ['E4', async () => { const s = await sh(); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - 30, r: 40 }); s.brushTo(5); s.endBrush(); return s; }],
  ['E6', async () => { const s = await sh(true); s.beginFollow({ s0: total(doc(s)) - 10, r: 20 }); s.brushTo({ w: 2 }); s.endBrush(); s.setSculpt(false); return s; }]];
(async () => {
  for (const [name, mk] of heads) for (const length of [100, 200]) {
    const s = await mk(), prev = doc(s).pieces.at(-1), a = D.pieceEnd(prev).w; s.extend(extendOptions({ ...BLANK, length, head: s.headState() })); const P = doc(s).pieces.at(-1);
    let swing = 0, at = 0, l1 = 0, l9 = 0; for (let k = 0; k <= length * 100; k++) { const x = k / 100, dv = wAt(P, x) - a.v; if (Math.abs(dv) > Math.abs(swing)) { swing = dv; at = x; } if (Math.abs(dv) > 1e-3) l1 = x; if (Math.abs(dv) > 1e-9) l9 = x; }
    const own = most(prev), held = most(P), joint = D.jointProblem(D.pieceEnd(prev), P, D.kindOf(prev)), end = D.pieceEnd(P).w;
    console.log(JSON.stringify({ F: Number(F), head: name, length, slope: +a.m.toFixed(5), swingMm: +(1000 * swing).toFixed(1), at: +at.toFixed(2), factor: +(swing / a.m).toFixed(3), over1mmUntil: +l1.toFixed(2), over1e9Until: +l9.toFixed(2), barMet: l1 <= 20, w2: +held.toExponential(3), own: +own.toExponential(3), ratio: +(held / own).toFixed(2), joint, endV: end.v, endM: end.m, endIsHead: end.v === a.v && end.m === 0 }));
  }
})().catch((e) => { console.error('ramp678 failed:', e); process.exit(1); });

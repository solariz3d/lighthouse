// closew678.js (pane B, D678): does Finish's close() move the FIRST new piece's width? On the repair: Finish from E's lap heads; the first new piece's width as
// closed, against layHold laid again on that same piece (its own knots; the hold from the head, R = the first knot span, extend's startRampM). Equal control
// points mean close left that piece's width as the hold laid it. usage: node closew678.js <tree>
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), TB = require(path.join(T, 'src/core/turnby.js')), F = require(path.join(T, 'src/core/finish.js')), X = require(path.join(T, 'src/core/extend.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const lap = () => { const R = 180, Q = (Math.PI * R) / 2; let d = TB.extendCorner(D.createDoc('lap'), { length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) d = TB.extendCorner(d, { length: Q, transition: 40, targets: { kh: 1 / R } }); return TB.extendCorner(d, { length: 60, transition: 40, targets: { kh: 0 } }); };
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
const brush = (d, r, delta) => async () => { const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(lap()); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - d, r }); s.brushTo(delta); s.endBrush(); return s; };
const grab = (d, r, dw) => async () => { const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(lap()); s.setSculpt(true); s.beginFollow({ s0: total(doc(s)) - d, r }); s.brushTo({ w: dw }); s.endBrush(); s.setSculpt(false); return s; };
(async () => {
  for (const [n, mk] of [['brush +1.37 end-5 r20', brush(5, 20, 1.37)], ['brush +5 end-30 r40', brush(30, 40, 5)], ['grab +2 end-10 r20', grab(10, 20, 2)], ['grab +2 end-0 r10', grab(0, 10, 2)], ['grab -2 end-2 r5', grab(2, 5, -2)]]) {
    const d0 = doc(await mk()), k = d0.pieces.length, head = D.endState(d0).w, r = F.finishToStart(d0), P = r.doc.pieces[k];
    const R = X.startRampM(P.length), again = X.layHold(P, { from: head, w: head.v, R, sub: X.RAMP_KNOTS });
    const a = P.channels.w, b = again.channels.w; let most = 0, at = -1; for (let i = 0; i < a.length; i++) { const dd = Math.abs(a[i] - b[i]); if (dd > most) { most = dd; at = i; } }
    const rest = a.slice(6).every((v) => v === head.v);
    console.log(`${n}: first new piece ${P.length} m, ${P.knots.length} knots, ramp ${R}; width as closed vs the hold laid again: largest control-point difference ${most} (index ${at} of ${a.length}); every point from the 7th on at the head's width: ${rest}; same knots after laying again: ${again.knots.length === P.knots.length}`);
  }
})().catch((e) => { console.error(e); process.exit(1); });

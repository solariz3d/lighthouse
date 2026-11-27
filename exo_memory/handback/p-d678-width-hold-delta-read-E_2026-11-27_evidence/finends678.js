// finends678.js (pane E, D678 Track 2): each new piece's end after Finish, by B's own end measure (row1_678.js endOf: the doc, opened, through the adapter's
// path at step 0.25, its last sample) applied to the doc cut after that piece, against the level lap's Finish cut the same; the six heads of fin678.js.
// A second measure beside it: D.endState's turn and the path's last sample's heading are not compared; only positions. usage: node finends678.js <tree>
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), TB = require(path.join(T, 'src/core/turnby.js')), F = require(path.join(T, 'src/core/finish.js')), A = require(path.join(T, 'src/core/adapter.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const lap = () => { const R = 180, Q = (Math.PI * R) / 2; let d = TB.extendCorner(D.createDoc('lap'), { length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) d = TB.extendCorner(d, { length: Q, transition: 40, targets: { kh: 1 / R } }); return TB.extendCorner(d, { length: 60, transition: 40, targets: { kh: 0 } }); };
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
async function shell(d, sculpt = false) { const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(d); if (sculpt) s.setSculpt(true); return s; }
const brushed = (d, r, delta) => async () => { const s = await shell(lap()); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - d, r }); s.brushTo(delta); s.endBrush(); return doc(s); };
const grabbed = (d, r, dw) => async () => { const s = await shell(lap(), true); s.beginFollow({ s0: total(doc(s)) - d, r }); s.brushTo({ w: dw }); s.endBrush(); s.setSculpt(false); return doc(s); };
const HEADS = [['lap level', async () => lap()], ['lap brush +1.37 end-5 r20', brushed(5, 20, 1.37)], ['lap brush +5 end-30 r40', brushed(30, 40, 5)], ['lap grab +2 end-10 r20', grabbed(10, 20, 2)],
  ['lap grab +2 end-0 r10', grabbed(0, 10, 2)], ['lap grab -2 end-2 r5', grabbed(2, 5, -2)]];
const endOf = (d) => A.toPath({ ...d, closed: false }, { step: 0.25 }).path.samples.at(-1).pos;
const cut = (d, n) => ({ ...d, closed: false, pieces: d.pieces.slice(0, n) });
(async () => {
  const L0 = lap(), L = F.finishToStart(L0).doc, n0 = L0.pieces.length;
  for (const [name, mk] of HEADS) {
    const d0 = await mk(), R = F.finishToStart(d0).doc, out = [];
    for (let i = 1; i <= R.pieces.length - n0; i++) { const a = endOf(cut(R, n0 + i)), b = endOf(cut(L, n0 + i)); out.push(+Math.hypot(...a.map((v, k) => v - b[k])).toExponential(3)); }
    const whole = endOf(R), wholeL = endOf(L);
    console.log(JSON.stringify({ head: name, perPieceEndApartM: out, lapEndApartM: +Math.hypot(...whole.map((v, k) => v - wholeL[k])).toExponential(3) }));
  }
})().catch((e) => { console.error('finends678 failed:', e); process.exit(1); });

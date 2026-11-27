// finishw.js (pane E, L264 read): Finish from the cut test's lap, open and brushed at its head (+d at end-5, r 20): each added piece's length, the width at its
// ends, its steepest width slope |w'| and its largest |w''|, against the steepest slope a TYPED width change takes on the panel at its shortest. One tree.
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend, secondMinM } = require(path.join(T, 'src/core/extend.js'));
const TB = require(path.join(T, 'src/core/turnby.js')), F = require(path.join(T, 'src/core/finish.js')), { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const doc = (s) => s.getState().history.present;
(async () => {
  const R = 180, Q = (Math.PI * R) / 2; let d = TB.extendCorner(D.createDoc('lap'), { length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) d = TB.extendCorner(d, { length: Q, transition: 40, targets: { kh: 1 / R } });
  d = TB.extendCorner(d, { length: 60, transition: 40, targets: { kh: 0 } });
  for (const delta of [1.37, 5, -3]) {
    const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(d); const L = doc(s).pieces.reduce((a, P) => a + P.length, 0);
    s.beginBrush({ mode: 'rate', channel: 'w', s0: L - 5, r: 20 }); s.brushTo(delta); s.endBrush(); const d0 = doc(s);
    let r; try { r = F.finishToStart(d0); } catch (e) { console.log(`brush ${delta}: Finish REFUSED ${e.code}: ${String(e.message).slice(0, 120)}`); continue; }
    const add = r.doc.pieces.slice(d0.pieces.length).map((P) => { let m1 = 0, m2 = 0; for (let x = 0; x <= P.length; x += 0.25) { const e = 0.05, a = D.channelValue(P, 'w', Math.max(0, x - e)), b = D.channelValue(P, 'w', Math.min(P.length, x + e)), c = D.channelValue(P, 'w', x); m1 = Math.max(m1, Math.abs((b - a) / (Math.min(P.length, x + e) - Math.max(0, x - e)))); if (x > e && x < P.length - e) m2 = Math.max(m2, Math.abs((b - 2 * c + a) / (e * e))); }
      return `${P.length.toFixed(1)} m: w ${D.channelValue(P, 'w', 0).toFixed(3)}→${D.pieceEnd(P).w.v.toFixed(3)}, max|w'| ${m1.toFixed(4)}, max|w''| ${m2.toExponential(2)}`; });
    console.log(`brush ${delta > 0 ? '+' : ''}${delta} (head ${D.endState(d0).w.v.toFixed(3)}, ${D.endState(d0).w.m.toExponential(2)}): closed ${!!r.doc.closed}; Finish adds ${add.join(' | ')}`);
  }
})().catch((e) => { console.error(e); process.exit(1); });

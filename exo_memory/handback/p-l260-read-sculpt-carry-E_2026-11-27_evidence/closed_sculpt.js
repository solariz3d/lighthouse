// closed_sculpt.js <tree>: G6's wound lap, closed (closejob runCloseBest); then in the shell: Sculpt the wound piece (its middle past -360) by -10, and by +10;
// the bank brush on it by -10; each then Undo. Is the lap still closed, its seam a whole turn, the middle carried, and Undo the same bytes?
'use strict';
const path = require('path'), crypto = require('crypto'); const T = path.resolve(process.argv[2]); const R = (p) => require(path.join(T, p));
const D = R('src/core/document.js'), { extend } = R('src/core/extend.js'), { extendTurnBy } = R('src/core/turnby.js'), CJ = R('app/core/closejob.js'), { createCoreShell } = R('app/core/coreshell.js');
const DEG = Math.PI / 180, Q = 300 * Math.PI / 2, r3 = (v) => Math.round(v * 1000) / 1000, sha = (d) => crypto.createHash('sha256').update(D.serialize(d)).digest('hex').slice(0, 16);
(async () => {
  let d = D.createDoc('lap'); d = extend(d, { length: 100, family: 'bowl' }); d = extendTurnBy(d, { length: Q }, 90 * DEG);
  d = extend(d, { length: 300, targets: { phi: -360 * DEG } }); d = extend(d, { length: Q / 2, targets: { kh: 1 / 300 } }); d = extendTurnBy(d, { length: Q / 2 }, 67.5 * DEG);
  d = extend(d, { length: 200, targets: { phi: -392 * DEG } }); d = extendTurnBy(d, { length: Q }, 90 * DEG); d = extend(d, { length: 100 }); d = extendTurnBy(d, { length: Q }, 90 * DEG);
  const closed = CJ.runCloseBest({ doc: d }).doc;
  const seam = (x) => { const P0 = x.pieces[0], PL = x.pieces[x.pieces.length - 1]; return r3(D.channelAt(PL, 'phi', PL.length).v / DEG - D.channelAt(P0, 'phi', 0).v / DEG); };
  const out = [];
  for (const [what, by] of [['sculpt -10', -10], ['sculpt +10', 10], ['brush -10', -10]]) {
    const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(closed);
    const before = sha(s.getState().history.present);
    const idx = s.getState().history.present.pieces.findIndex((p, i) => i > 2 && p.type === 'road' && Math.abs(D.channelAt(p, 'phi', p.length).v / DEG + 392) < 1e-3);
    const row = { what, piece: idx, closedBefore: !!s.getState().history.present.closed, seamBefore: seam(s.getState().history.present) };
    if (what.startsWith('sculpt')) {
      s.setSculpt(true); s.selectPiece(idx); row.middle0 = r3(s.sculptInfo().values.phi);
      s.beginSculpt({ channel: 'phi' }); for (let k = 1; k <= 10; k++) s.sculptTo(by * k / 10 * DEG); s.endSculpt();
      row.middle1 = r3(s.sculptInfo().values.phi);
    } else {
      const off = R('src/core/sculpt.js').pieceOffsets(s.getState().history.present)[idx], P = s.getState().history.present.pieces[idx];
      row.centre0 = r3(D.channelAt(P, 'phi', P.length / 2).v / DEG);
      s.beginBrush({ mode: 'rate', channel: 'phi', s0: off + P.length / 2, r: 60 }); s.brushTo(by * DEG); s.endBrush();
      const P2 = s.getState().history.present.pieces[idx]; row.centre1 = r3(D.channelAt(P2, 'phi', P2.length / 2).v / DEG);
    }
    const after = s.getState().history.present; row.message = s.getState().message; row.closedAfter = !!after.closed; row.seamAfter = seam(after); row.changed = sha(after) !== before;
    s.undo(); row.undoSameBytes = sha(s.getState().history.present) === before;
    out.push(row);
  }
  for (const r of out) console.log(JSON.stringify(r));
})().catch((e) => { console.error(e); process.exit(1); });

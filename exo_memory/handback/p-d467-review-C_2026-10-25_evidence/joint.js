// joint.js (C, D467 review): Bends on the sculpt-tools lap whose window starts just past the p1|p2 joint; for each, the window, the message, the share of the drag's own
// knots kept (row 25's keptShare, all of the window's kh knots), and what the joint did to p2's first two kh knots (base, dragged, closed). Reads only.
'use strict';
const path = require('path'), T = process.argv[2], r = (f) => require(path.join(T, f));
const { createCoreShell } = r('app/core/coreshell.js');
const keptShare = (base, open, closed, idx, ch) => { let num = 0, den = 0; for (const i of idx) { const b = base.pieces[i].channels[ch], o = open.pieces[i].channels[ch], c = closed.pieces[i].channels[ch]; for (let k = 0; k < b.length; k++) { const d = o[k] - b[k]; num += (c[k] - b[k]) * d; den += d * d; } } return num / den; };
(async () => {
  for (const s0 of [381, 385, 390, 400, 450]) {
    const s = await createCoreShell({ autosaveMs: 0 }), R = 180, Q = (Math.PI * R) / 2;
    s.extend({ length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 60, transition: 40, targets: { kh: 0 } }); s.close();
    const base = s.getState().history.present;
    s.beginBrush({ tool: 'bend', s0, r: 80 }); s.brushTo(3e-4);
    const open = s.getState().history.present, win = s.getState().brush.changedPieces; s.endBrush(); const st = await s.brushRelease(), c = st.history.present;
    const k = (d) => d.pieces[1].channels.kh.slice(0, 3).map((x) => x.toExponential(3)).join(' ');
    console.log(`s0 ${s0}: window ${JSON.stringify(win)} | kept ${win.length && c.closed ? keptShare(base, open, c, win, 'kh').toFixed(4) : '-'} | ${st.message.slice(0, 70)}\n   p2 kh[0..2] base ${k(base)} | dragged ${k(open)} | closed ${k(c)}`);
  }
})();

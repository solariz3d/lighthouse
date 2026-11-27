// R2 probe (D678 item 4): B- with one grab at 470 (and 485, and 175+465), Even 200..440 to 16 m, the left edge kept: K3 (A's centreOff) and where; the centre's
// in-plane target against the height laid near the far window end; and which h control points of the exit piece the fit could move. Usage: node r2probe.js TREE
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const F = require(path.join(T, 'test/even_fixtures.js')), D = require(path.join(T, 'src/core/document.js')), SC = require(path.join(T, 'src/core/sculpt.js'));
const EV = require(path.join(T, 'src/core/even.js'));
const R = (x) => Math.round(x * 1e4) / 1e4;
(async () => {
  for (const grabs of [[470], [485], [175, 465], []]) {
    const base = F.fixture('B-'), sh = await F.shellOn(base); for (const s of grabs) F.grab(sh, s, 16); const st = F.present(sh);
    const run = F.runPieces(st), { win } = EV.evenWindow(st, run), r = EV.even(st, { ...run, value: 16, hold: 'left' });
    const k = F.centreOff(r.doc, st);
    const off = SC.pieceOffsets(st), p = st.pieces.length - 1, P = st.pieces[p], t = D.knotVector(P);
    const cps = P.channels.h.map((v, i) => ({ i, ka: R(off[p] + SC.knotAverage(t, i)), sup: [R(off[p] + t[i]), R(off[p] + t[i + 4])], free: !(off[p] + t[i] < win.w0 - 1e-9 || off[p] + t[i + 4] > win.w1 + 1e-9), dh: R(r.doc.pieces[p].channels.h[i] - v), dl: R(r.doc.pieces[p].channels.l[i] - P.channels.l[i]) })).filter((c) => c.ka > 430 && c.ka < 540);
    console.log(JSON.stringify({ grabs, k3: { off: R(k.off), at: k.at }, cps }));
  }
})().catch((e) => { console.error(e && e.stack); process.exitCode = 1; });

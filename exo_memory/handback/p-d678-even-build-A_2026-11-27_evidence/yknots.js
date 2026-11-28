// yknots.js <B tree>: a PROTOTYPE probe, not built. Where B misses Y1, is it the knots? The start's knots over the WHOLE window cut to 3.75 m (refineKnots, rounded
// once: the road within half a stored step) before Even, against Even on the start as it is; Y1 read against the start as it is (rimAcross, every 1 m over the run).
// Synthetic fixtures only; prints numbers and labels.
'use strict';
const path = require('path');
const T = path.resolve(process.argv[2]);
const F = require(path.join(T, 'test/even_fixtures.js'));
const D = require(path.join(T, 'src/core/document.js'));
const SC = require(path.join(T, 'src/core/sculpt.js'));
const EV = require(path.join(T, 'src/core/even.js'));
const R = (x) => Math.round(x * 1e4) / 1e4;
const ROW = (a, b) => { const o = []; for (let s = a; s <= b; s += 30) o.push(s); return o; };
async function made(fx, steps) { const sh = await F.shellOn(F.fixture(fx)); steps(sh); return F.present(sh); }
function cutWindow(doc, w0, w1, span) {
  let d = doc; const off = SC.pieceOffsets(doc);
  doc.pieces.forEach((P, p) => { if (P.type !== 'road' || off[p] + P.length < w0 || off[p] > w1) return; const a = Math.max(0, w0 - off[p]), b = Math.min(P.length, w1 - off[p]); d = D.refineKnots(d, P.id, a, b, span, { roundOnce: true }).doc; });
  return d;
}
const y1 = (after, start, hold, lo, hi) => { let m = 0, at = null; for (const s of F.stations(Math.ceil(lo), Math.floor(hi))) { const e = Math.abs(F.rimAcross(after, s, hold) - F.rimAcross(start, s, hold)); if (e > m) { m = e; at = s; } } return { m: R(m), at }; };
(async () => {
  const cases = [
    ['T2b flat', await made('flat', (sh) => { for (const s of [215, 245, 275, 305, 335, 365, 395, 425]) F.grab(sh, s, 16); }), null],
    ['W8 flat', await made('flat', (sh) => { for (const s of [215, 245, 275, 305, 335, 365, 395, 425]) F.widthStroke(sh, s, 16); }), null],
    ['row 175..475 flat', await made('flat', (sh) => { for (const s of ROW(175, 475)) F.grab(sh, s, 16); }), null],
    ['start 0..1, a grab at 30', await made('flat', (sh) => F.grab(sh, 30, 16)), { from: 0, to: 1 }],
  ];
  for (const [id, start, run0] of cases) {
    const run = run0 || F.runPieces(start), off = SC.pieceOffsets(start), lo = off[run.from], hi = off[run.to] + start.pieces[run.to].length;
    const r0 = EV.even(start, { ...run, value: 16, hold: 'left' }), { w0, w1 } = r0.window;
    const cut = cutWindow(start, w0, w1, 3.75), r1 = EV.even(cut, { ...run, value: 16, hold: 'left' });
    const cutOff = y1(cut, start, 'left', lo, hi);
    const ctrl = (d) => d.pieces.reduce((n, P) => n + (P.type === 'road' ? P.channels.l.length : 0), 0);
    console.log(JSON.stringify({ case: id, y1asIs: y1(r0.doc, start, 'left', lo, hi), y1cut: y1(r1.doc, start, 'left', lo, hi), cutMovedEdge: cutOff, lCtrl: [ctrl(start), ctrl(cut)] }));
  }
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });

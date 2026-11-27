// R1 probe (D678 item 4): flat and B- untouched, Even 200..440 to 16 m, either edge kept: where in the window the kept edge and the width miss, and which
// l and w control points Even left as they were because their support reaches past the window. Usage: node r1probe.js TREE
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const F = require(path.join(T, 'test/even_fixtures.js')), D = require(path.join(T, 'src/core/document.js')), SC = require(path.join(T, 'src/core/sculpt.js'));
const EV = require(path.join(T, 'src/core/even.js'));
const R = (x) => Math.round(x * 1e4) / 1e4;
for (const fx of ['flat', 'B-']) {
  const base = F.fixture(fx), run = F.runPieces(base), { win } = EV.evenWindow(base, run), off = SC.pieceOffsets(base);
  const pieces = base.pieces.map((P, p) => ({ p, s0: off[p], len: P.length, knots: [...new Set(D.knotVector(P))].map((t) => R(off[p] + t)).join(' ') }));
  console.log(JSON.stringify({ fx, win, pieces }));
  for (const hold of ['left', 'right']) {
    const r = EV.even(base, { ...run, value: 16, hold }), a = r.doc;
    const prof = []; for (let s = 150; s <= 490; s += 5) prof.push([s, R(F.rimAcross(a, s, hold) - F.rimAcross(base, s, hold)), R(F.at(a, 'w', s) - 16)]);
    const worst = prof.filter(([s]) => (s >= 180 && s <= 200) || (s >= 440 && s <= 460)).reduce((m, x) => (Math.abs(x[1]) > Math.abs(m[1]) ? x : m));
    // the control points left as they were: support beyond the window, in pieces the window touches
    const skipped = [];
    base.pieces.forEach((P, p) => { if (P.type !== 'road' || off[p] + P.length < win.w0 || off[p] > win.w1) return; const t = D.knotVector(P); for (let i = 0; i < P.channels.l.length; i++) { const inW = !(off[p] + t[i] < win.w0 - 1e-9 || off[p] + t[i + 4] > win.w1 + 1e-9); const ka = off[p] + SC.knotAverage(t, i); if (!inW && ka > win.w0 - 60 && ka < win.w1 + 60) skipped.push({ p, i, ka: R(ka), sup: [R(off[p] + t[i]), R(off[p] + t[i + 4])], dl: R(a.pieces[p].channels.l[i] - P.channels.l[i]), dw: R(a.pieces[p].channels.w[i] - P.channels.w[i]) }); } });
    console.log(JSON.stringify({ fx, hold, worstMargin: worst, prof: prof.filter(([s]) => s <= 210 || s >= 430).map((x) => x.join(':')).join(' '), skipped }));
  }
}

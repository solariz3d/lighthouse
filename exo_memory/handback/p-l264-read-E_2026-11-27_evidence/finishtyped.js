// finishtyped.js (pane E, L264 read): Finish from the cut test's lap whose last piece is TYPED to a width w, two ways: (num) transition 40 as one number for every
// channel (B's §5 class: the fit ends the width off level), and (map) transition { kh: 40 }, the width over the whole piece (a level head). One tree.
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), TB = require(path.join(T, 'src/core/turnby.js')), F = require(path.join(T, 'src/core/finish.js'));
const R = 180, Q = (Math.PI * R) / 2;
for (const how of ['num', 'map']) for (const w of [32.363, 35.975, 28.015]) {
  let d = TB.extendCorner(D.createDoc('lap'), { length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) d = TB.extendCorner(d, { length: Q, transition: 40, targets: { kh: 1 / R } });
  d = TB.extendCorner(d, { length: 60, transition: how === 'num' ? 40 : { kh: 40 }, targets: { kh: 0, w } });
  const head = D.endState(d).w;
  let r; try { r = F.finishToStart(d); } catch (e) { console.log(`${how} typed ${w}: head ${head.v.toFixed(4)} ${head.m.toExponential(3)}; Finish REFUSED ${e.code}: ${String(e.message).slice(-120)}`); continue; }
  const add = r.doc.pieces.slice(d.pieces.length);
  let wMax = -Infinity, wMin = Infinity; for (const P of add) for (let x = 0; x <= P.length; x += 1) { const v = D.channelValue(P, 'w', x); wMax = Math.max(wMax, v); wMin = Math.min(wMin, v); }
  const P = add.at(-1); let m1 = 0; for (let x = 0.05; x < P.length - 0.05; x += 0.25) m1 = Math.max(m1, Math.abs((D.channelValue(P, 'w', x + 0.05) - D.channelValue(P, 'w', x - 0.05)) / 0.1));
  console.log(`${how} typed ${w}: head ${head.v.toFixed(4)} ${head.m.toExponential(3)}; closed ${!!r.doc.closed}; Finish's ${add.length} pieces: w ${wMin.toFixed(3)}..${wMax.toFixed(3)}; last piece ${D.channelValue(P, 'w', 0).toFixed(3)}→${D.pieceEnd(P).w.v.toFixed(3)} max|w'| ${m1.toFixed(4)}`);
}

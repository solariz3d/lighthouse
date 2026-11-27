// dg5probe.js (pane B, L264): drag-ghost row 5's documents, read apart: the width at each placed piece's end (value and slope), and each corner solve's width channel.
// Which piece's head has a width still changing, and by how much? usage: node dg5probe.js <tree>
'use strict';
const path = require('path');
const T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), TB = require(path.join(T, 'src/core/turnby.js')), { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
(async () => {
  const sh0 = await createCoreShell({ brushFn: null, autosaveMs: 0 }); sh0.extend({ length: 300 });
  sh0.extend({ length: 1000, targets: { kh: 1 / 700, kv: 0.0004, phi: 0.2, w: 40, c: 20 } }); sh0.extend({ length: 75, transition: 30, targets: { w: 25 } });
  const doc0 = sh0.exportDoc();
  doc0.pieces.forEach((P, i) => { const e = D.pieceEnd(P).w, c = P.channels.w, n = c.length; console.log(`placed ${i} (${P.length} m): width ends ${e.v}, slope ${e.m} (last two control points ${c[n - 2]}, ${c[n - 1]})`); });
  for (const o of [{ length: 1500, turnDeg: 33, targets: { phi: 0.1 } }, { length: 400, turnDeg: -75, climbDeg: 4 }, { length: 2200 }]) {
    const P = TB.extendCorner(doc0, o).pieces.at(-1), e = D.pieceEnd(P).w;
    console.log(`corner ${JSON.stringify(o)}: width ${P.channels.w[0]} -> ${e.v} (slope ${e.m}); width control points ${P.channels.w.slice(0, 4).join(', ')} … ${P.channels.w.slice(-2).join(', ')}`);
  }
})().catch((e) => { console.error('probe failed:', e); process.exit(1); });

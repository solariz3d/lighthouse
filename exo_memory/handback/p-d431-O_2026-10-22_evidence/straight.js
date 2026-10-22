'use strict';
// D431 (O): how far the finish's STRAIGHT (TEST 10 p22, row 2 p5) leaves a straight line: the largest distance, in plan and in height, of its centreline from the
// chord between its two ends, on the adapter's own path (step 2 m).   node straight.js <tree>
const TREE = process.argv[2], fs = require('fs'), path = require('path');
const D = require(`${TREE}/src/core/document.js`), F = require(`${TREE}/src/core/finish.js`), AD = require(`${TREE}/src/core/adapter.js`);
const { extend } = require(`${TREE}/src/core/extend.js`), { extendTurnBy } = require(`${TREE}/src/core/turnby.js`);
const U = JSON.parse(fs.readFileSync(path.join(__dirname, 'test10', 'eq-TEST 10.t180undo'), 'utf8'));
const row2 = () => { let d = D.createDoc('t'); d = extend(d, { length: 500, family: 'bowl' }); d = extend(d, { length: 600, transition: 60, targets: { kv: -0.0002 } }); d = extend(d, { length: 600, transition: 60, targets: { kv: 0 } }); return extendTurnBy(d, { length: 900, targets: { kv: 0 } }, Math.PI); };
for (const [name, open, id] of [['TEST 10', D.parse(U.past[21]), 'p22'], ['row 2', row2(), 'p5']]) {
  const r = F.finishToStart(open), { segments, path: p } = AD.toPath(r.doc, { step: 2 });
  const pts = p.samples.filter((s) => segments[s.seg].id === id).map((s) => s.pos), a = pts[0], b = pts[pts.length - 1];
  const ux = b[0] - a[0], uz = b[2] - a[2], L = Math.hypot(ux, uz);
  let side = 0, up = 0;
  for (const q of pts) { const t = ((q[0] - a[0]) * ux + (q[2] - a[2]) * uz) / (L * L); side = Math.max(side, Math.abs(((q[0] - a[0]) * uz - (q[2] - a[2]) * ux) / L)); up = Math.max(up, Math.abs(q[1] - (a[1] + t * (b[1] - a[1])))); }
  console.log(JSON.stringify({ lap: name, piece: id, chordM: +L.toFixed(1), maxSidewaysM: +side.toFixed(2), maxOffHeightLineM: +up.toFixed(2) }));
}

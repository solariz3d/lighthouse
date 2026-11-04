'use strict';
const fs = require('fs'); const p = 'C:/Users/nname/Downloads/t180-wt-p468/src/core/close.js'; let s = fs.readFileSync(p, 'utf8'); const EOL = s.includes('\r\n') ? '\r\n' : '\n';
function edit(oldS, newS) { oldS = oldS.split('\n').join(EOL); newS = newS.split('\n').join(EOL); const n = s.split(oldS).length - 1; if (n !== 1) throw new Error(`anchor ${n}: ${oldS.slice(0, 50)}`); s = s.replace(oldS, newS); }
// the stored-document check becomes the catch round the whole solve: the refusal is raised while the step is MEASURED (residualOf → toPath → checkDoc on the unrounded work)
edit(`  // D469 (P; C's D467 review §5): THE CUP'S CURVATURE ROWS RESPECT c ≥ 0. Where the seam's cup row (3c) meets a flat cup at p1 against a fade that ends C1 on the
  // other side (TEST 10's p23: 15 15 0 0, laid before D459), the least-norm step bends p1's cup BELOW 0 to match the curvature (−2.0° on TEST 10), and the document
  // refuses the result. The cup cannot go below 0, so the row is left out and the cup stays C1 at the seam, the way cupHome falls back to its straight fade where
  // the quintic would be too fast; the other channels keep their rows, and the report says so. Once: the second pass has no cup row to drop
  if (!opts.cupRowLeftOut && c2Channels.includes('c') && stored.pieces.some((P) => P.type === 'road' && P.cup && P.channels.c.some((v) => v < -D.CUP_EPS || v > D.CUP_MAX + D.CUP_EPS))) {
    return close(doc, { ...opts, c2Channels: c2Channels.filter((ch) => ch !== 'c'), cupRowLeftOut: true });
  }
  const cupNote = opts.cupRowLeftOut`,
`  const cupNote = opts.cupRowLeftOut`);
edit(`function close(doc, opts = {}) {
  D.checkDoc(doc); doc = D.fillCup(doc);`,
`function close(doc, opts = {}) {
  // D469 (P; C's D467 review §5): THE CUP'S CURVATURE ROWS RESPECT c ≥ 0. Where the seam's cup row (3c) meets a flat cup at p1 against a fade that ends C1 on the
  // other side (TEST 10's p23: 15 15 0 0, laid before D459), the least-norm step bends p1's cup BELOW 0 to match the curvature (−2.0° on TEST 10), and the document
  // refuses the step as it is measured (residualOf → toPath → checkDoc: BAD_CUP). The cup cannot go below 0, so the row is left out and the cup stays C1 at the
  // seam, the way cupHome falls back to its straight fade where the quintic would be too fast; the other channels keep their rows, and the report says so. Once:
  // the second pass has no cup row to drop, and whatever it refuses is the close's own
  const c2Asked = opts.c2Channels === undefined ? CN.C2_CHANNELS : opts.c2Channels;
  if (!opts.cupRowLeftOut && c2Asked.includes('c')) {
    try { return closeOnce(doc, opts); } catch (e) {
      if (e instanceof D.CoreError && e.code === 'BAD_CUP') return closeOnce(doc, { ...opts, c2Channels: c2Asked.filter((ch) => ch !== 'c'), cupRowLeftOut: true });
      throw e;
    }
  }
  return closeOnce(doc, opts);
}
function closeOnce(doc, opts = {}) {
  D.checkDoc(doc); doc = D.fillCup(doc);`);
fs.writeFileSync(p, s); console.log('close.js: the fallback is the catch round the solve');

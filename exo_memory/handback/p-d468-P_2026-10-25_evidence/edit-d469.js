'use strict';
const fs = require('fs'); const W = 'C:/Users/nname/Downloads/t180-wt-p468/';
function edit(file, oldS, newS) { const p = W + file; let s = fs.readFileSync(p, 'utf8'); const EOL = s.includes('\r\n') ? '\r\n' : '\n'; oldS = oldS.split('\n').join(EOL); newS = newS.split('\n').join(EOL); const n = s.split(oldS).length - 1; if (n !== 1) throw new Error(`${file}: anchor ${n}`); fs.writeFileSync(p, s.replace(oldS, newS)); console.log('edited', file); }
// 1. the adapter's cup check: the quantum's tolerance (a value that would store as 0 is 0)
edit('src/core/adapter.js',
`  if (!Number.isFinite(c) || c < 0) throw new D.CoreError('BAD_CUP', 'the cup must be a number of degrees from 0, got ' + c);
  const F = FLOORS[family], side = AT.map((f, i) => [(f * w) / 2, ((c * F[i]) / F[F.length - 1]) * DEG]);`,
`  // D469 (P; C's D467 review §5): a close measures its path on the UNROUNDED solve, where a flat cup's control point comes back as −1e-15, and this refused it
  // (TEST 10: the start try [p1, p23] fell through to [p5, p23]). A value within half the stored quantum of 0 is 0; a stored document's own check is document.js's
  if (!Number.isFinite(c) || c < -CUP_TOL) throw new D.CoreError('BAD_CUP', 'the cup must be a number of degrees from 0, got ' + c);
  if (c < 0) c = 0;
  const F = FLOORS[family], side = AT.map((f, i) => [(f * w) / 2, ((c * F[i]) / F[F.length - 1]) * DEG]);`);
edit('src/core/adapter.js',
`/** The CUP cross-section at width w (m) and edge angle c (degrees), ref 09 §9: ψ at the four quarters of each half-width is c·Fᵢ/F_edge, both sides. */
function cupProfile(family, w, c) {`,
`const CUP_TOL = 0.5 * 10 ** -D.DEC.c;   // D469: half the cup's stored quantum (DEC.c decimals): what rounds to 0 is 0
/** The CUP cross-section at width w (m) and edge angle c (degrees), ref 09 §9: ψ at the four quarters of each half-width is c·Fᵢ/F_edge, both sides. */
function cupProfile(family, w, c) {`);
// 2. close.js: the cup's curvature rows respect c ≥ 0, falling back to C1 at the seam the way cupHome's straight fade does
edit('src/core/close.js',
`  const stored = apply(doc, expand, x, true, keep), ms = residual(stored, { cache, c2Pairs, c2Channels }), converged = done(m) && ms.gapM < 1e-3;`,
`  const stored = apply(doc, expand, x, true, keep), ms = residual(stored, { cache, c2Pairs, c2Channels }), converged = done(m) && ms.gapM < 1e-3;
  // D469 (P; C's D467 review §5): THE CUP'S CURVATURE ROWS RESPECT c ≥ 0. Where the seam's cup row (3c) meets a flat cup at p1 against a fade that ends C1 on the
  // other side (TEST 10's p23: 15 15 0 0, laid before D459), the least-norm step bends p1's cup BELOW 0 to match the curvature (−2.0° on TEST 10), and the document
  // refuses the result. The cup cannot go below 0, so the row is left out and the cup stays C1 at the seam, the way cupHome falls back to its straight fade where
  // the quintic would be too fast; the other channels keep their rows, and the report says so. Once: the second pass has no cup row to drop
  if (!opts.cupRowLeftOut && c2Channels.includes('c') && stored.pieces.some((P) => P.type === 'road' && P.cup && P.channels.c.some((v) => v < -D.CUP_EPS || v > D.CUP_MAX + D.CUP_EPS))) {
    return close(doc, { ...opts, c2Channels: c2Channels.filter((ch) => ch !== 'c'), cupRowLeftOut: true });
  }
  const cupNote = opts.cupRowLeftOut ? "; the cup's curvature row at the seam was left out (it would have taken the cup below 0), so the cup is C1 there" : '';`);
edit('src/core/close.js',
`    report: converged ? \`closed in \${it} step(s): \${(ms.gapM * 1000).toFixed(3)} mm, tangent \${ms.tangentRad.toExponential(1)} rad\${cupSeamStepDeg > D.CUP_JOINT_DEG ? \`; the cup steps \${cupSeamStepDeg.toFixed(2)}° at the seam (a`,
`    report: converged ? \`closed in \${it} step(s): \${(ms.gapM * 1000).toFixed(3)} mm, tangent \${ms.tangentRad.toExponential(1)} rad\${cupNote}\${cupSeamStepDeg > D.CUP_JOINT_DEG ? \`; the cup steps \${cupSeamStepDeg.toFixed(2)}° at the seam (a`);

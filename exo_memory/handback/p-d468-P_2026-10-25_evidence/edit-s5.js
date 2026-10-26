'use strict';
const fs = require('fs'); const W = 'C:/Users/nname/Downloads/t180-wt-p468/';
function edit(file, oldS, newS) { const p = W + file; let s = fs.readFileSync(p, 'utf8'); const EOL = s.includes('\r\n') ? '\r\n' : '\n'; oldS = oldS.split('\n').join(EOL); newS = newS.split('\n').join(EOL); const n = s.split(oldS).length - 1; if (n !== 1) throw new Error(`${file}: anchor ${n}`); fs.writeFileSync(p, s.replace(oldS, newS)); console.log('edited', file); }
// A §5.1: the closeTol comment on its own line, above the statement it explains
edit('src/core/close.js',
`  const stored = apply(doc, expand, x, true, keep), ms = residual(stored, { cache, c2Pairs, c2Channels }), converged = done(m) && ms.gapM < 1e-3;   // the closed path's own bar (src/geom/path.js closeTol 1e-3 m): a stored gap past it was reported closed (it was 0.01) and then could not be built (2026-10-14, 1.65 mm on ELYSIUM)`,
`  // converged: the closed path's own bar (src/geom/path.js closeTol 1e-3 m): a stored gap past it was reported closed (it was 0.01) and then could not be built (2026-10-14, 1.65 mm on ELYSIUM)
  const stored = apply(doc, expand, x, true, keep), ms = residual(stored, { cache, c2Pairs, c2Channels }), converged = done(m) && ms.gapM < 1e-3;`);
// A §5.2: the dead names
edit('src/core/finish.js', `    const x = seq[k]; let ring = false, lo = -RING, hi = RING;`, `    const x = seq[k]; let ring = false;`);
edit('src/core/finish.js', `    x.lo = Math.min(0, x.share); x.hi = Math.max(0, x.share); void lo; void hi;`, `    x.lo = Math.min(0, x.share); x.hi = Math.max(0, x.share);`);
// A §5.3: the unused export
edit('src/core/document.js', `DEC, KNOT_M, CUP_MAX, CUP_JOINT_DEG, CUP_EPS,`, `DEC, KNOT_M, CUP_MAX, CUP_JOINT_DEG,`);

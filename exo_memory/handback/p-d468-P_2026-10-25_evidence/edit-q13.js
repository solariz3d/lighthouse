'use strict';
const fs = require('fs'); const p = 'C:/Users/nname/Downloads/t180-wt-p468/app/test/core-close-mutation.test.js'; let s = fs.readFileSync(p, 'utf8'); const EOL = s.includes('\r\n') ? '\r\n' : '\n';
const A = String.fromCharCode(39), B = String.fromCharCode(92) + String.fromCharCode(39);
const anchor = s.split(EOL).find((l) => l.includes('Q12 no row where the plan ends')); if (!anchor) throw new Error('Q12 anchor');
const add = [
  `  // D469 (P): the cup at a window's seam: the adapter's tolerance on the unrounded solve, and the cup rows' fallback`,
  `  { id: ${A}Q13 the adapter refuses a cup inside the quantum of 0 (the unrounded solve${B}s −1e-15)${A}, file: ${A}src/core/adapter.js${A}, from: ${A}if (!Number.isFinite(c) || c < -CUP_TOL) throw${A}, to: ${A}if (!Number.isFinite(c) || c < 0) throw${A}, tests: [LOCAL], caughtBy: ${A}row 6: a window on a lap whose cup is flat${A} },`,
  `  { id: ${A}Q14 the cup${B}s curvature row is kept where it takes the cup below 0 (no fallback)${A}, file: ${A}src/core/close.js${A}, from: ${A}if (e instanceof D.CoreError && e.code === ${B}BAD_CUP${B}) return closeOnce(${A}, to: ${A}if (false) return closeOnce(${A}, tests: [LOCAL], caughtBy: ${A}row 7: the seam${B}s cup curvature rows respect c ≥ 0${A} },`,
].join(EOL);
s = s.replace(anchor, anchor + EOL + add); fs.writeFileSync(p, s); console.log('Q13, Q14 added');

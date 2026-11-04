'use strict';
const fs = require('fs'); const p = 'C:/Users/nname/Downloads/t180-wt-p468/app/test/core-close-mutation.test.js'; let s = fs.readFileSync(p, 'utf8'); const EOL = s.includes('\r\n') ? '\r\n' : '\n';
const L = s.split(EOL); const i = L.findIndex((l) => l.includes('Q10 the bank plan')); console.log('line', i + 1, JSON.stringify(L[i].slice(0, 40)));
const A = String.fromCharCode(39), B = String.fromCharCode(92) + String.fromCharCode(39);
L[i] = `  { id: ${A}Q10 the bank plan${B}s curvature rows are not projected${A}, file: ${A}src/core/finish.js${A}, from: ${A}for (const r of rows) {${A}, to: ${A}for (const r of []) {${A}, tests: [C2], caughtBy: ${A}row 10: through Finish and through bankLap${A} },`;
L[i + 1] = `  { id: ${A}Q11 at a relaxed joint the later piece${B}s first two points are not folded into the row${A}, file: ${A}src/core/finish.js${A}, from: ${A}wA[2] += wB[0] + wB[1] * (1 + g1 / h1); wA[1] -= wB[1] * (g1 / h1);${A}, to: ${A}void 0;${A}, tests: [C2], caughtBy: ${A}row 10: through Finish and through bankLap${A} },`;
L[i + 2] = `  { id: ${A}Q12 no row where the plan ends (the window${B}s end, the seam)${A}, file: ${A}src/core/finish.js${A}, from: ${A}if (!nextLinked) rows.push(${A}, to: ${A}if (false) rows.push(${A}, tests: [C2], caughtBy: ${A}row 10: through Finish and through bankLap${A} },`;
fs.writeFileSync(p, L.join(EOL)); console.log(JSON.stringify(L[i].slice(0, 40)));

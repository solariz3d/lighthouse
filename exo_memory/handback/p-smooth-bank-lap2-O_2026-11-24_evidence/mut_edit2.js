const fs = require('fs'), f = 'G:/consonance-scratch/o-smooth-t180/test/core_bank_flow_mutation.test.js';
let t = fs.readFileSync(f, 'utf8');
const nl = t.includes('\r\n') ? '\r\n' : '\n';
const rep = (a, b) => { a = a.replace(/\n/g, nl); b = b.replace(/\n/g, nl); if (t.split(a).length !== 2) throw new Error('miss ' + a.slice(0, 80)); t = t.replace(a, () => b); };
rep(`between two of one sign", pattern: 'drawn 1|drawn 3|drawn 4',`, `between two of one sign", pattern: 'drawn 1|drawn 3|drawn 4|drawn 10',`);
rep(`{ id: 'B6 the curve as laid is not read once more (the final read)', pattern: 'drawn|flow', edits: [[X, "return w ?`,
  `// B6: the final read alone is not a mutant that can be caught at these constants, and is kept as the guard for them: it reads every 0.5 m, a subset of the
  // rows' 0.25 m, against FLOW_ROOM where the rows hold FLOW_HOLD, and DEC.phi = 9 rounds a point by at most 5e-10 rad against FLOW_SIDE's 1e-8 (no list of 2160
  // drawn laid differently without it). So the mutant takes it away together with the rows' fine grid, which is the change it guards against.
  { id: 'B6 the curve is held every 2 m AND not read once more (the final read)', pattern: 'drawn|flow', edits: [[X, 'const FLOW_EVERY_M = 0.25;', 'const FLOW_EVERY_M = 2;'], [X, "return w ?`);
rep(`{ id: "W2 a corner's built road is not read", pattern: 'drawn 9|built',`, `{ id: "W2 a corner's built road is not read", pattern: 'drawn 9|drawn 11|built',`);
rep(`(flowMarks, flowBank and their checks in extend)`, `(flowMarks, flowSolve, flowInside, flowBank and their checks in extend)`);
fs.writeFileSync(f, t);

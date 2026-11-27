// noreset678.js (pane B, D678, correction 4): E's d678 rows laid on the code WITHOUT layHold's held-pair reset (run1_noreset/final_d678.json) against the
// final code WITH it (final_d678.json): how many rows differ, by caller. usage: node noreset678.js <without.json> <with.json>
'use strict';
const p = require('path'), [a, b] = process.argv.slice(2).map((f) => require(p.resolve(f)));
const by = {}; let n = 0, d = 0;
a.rows.forEach((x, i) => { const y = b.rows[i]; n++; const k = `${x.caller}`; const o = (by[k] ||= [0, 0]); if (JSON.stringify(x) !== JSON.stringify(y)) { d++; o[0]++; } o[1]++; });
console.log(`rows ${n}, differ ${d}`); for (const [k, [x, t]] of Object.entries(by)) console.log(`${k}: ${x} of ${t} differ`);
console.log(`finish: ${a.finish.filter((x, i) => JSON.stringify(x) !== JSON.stringify(b.finish[i])).length} of ${a.finish.length} differ`);

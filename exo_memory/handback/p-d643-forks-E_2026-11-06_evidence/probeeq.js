// usage: node probeeq.js <tree with probePeak exported>   prints every probe reading over a grid as hex doubles, one line each (a copy of each tree's src with one export line
// appended, never the worktree): first ramps (rounded) × changes × spans from 40 m to the piece's length − 1 by 3 m, in a fixed order; and secondMinM's 28-case grid
'use strict';
const path = require('path'), X = require(path.join(path.resolve(process.argv[2]), 'src/core/extend.js'));
const DEG = Math.PI / 180, buf = Buffer.alloc(8), hex = (x) => { buf.writeDoubleBE(x); return buf.toString('hex'); };
const out = [];
for (const [st, L] of [[88.45, 1000], [66.14, 750], [30, 750], [60, 600]]) for (const ch of [-177, -118.45, -96.44, -60, -30, -10, -2, 3, 15, 40]) {
  const base = { step: st * DEG, length: L }; for (let span = 40; span <= L - 1; span += 3) out.push(`${st}|${L}|${ch}|${span}|${hex(X.probePeak(0, ch * DEG, base, span))}`);
}
for (const [st, L] of [[88.45, 1000], [66.14, 750], [30, 750], [60, 600]]) for (const t of [-88.45, -60, -30.3, -10, 0, 12.7, 45.5]) out.push(`min|${st}|${L}|${t}|${hex(X.secondMinM('phi', st * DEG, t * DEG, { step: st * DEG, length: L }))}`);
process.stdout.write(out.join('\n') + '\n');

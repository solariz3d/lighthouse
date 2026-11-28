// ysum.js <y678 out> [<earlier y678 out>]: the 52 rows in one line each, the figures beside the earlier run's where given. Prints labels and numbers only.
'use strict';
const fs = require('fs');
const rd = (f) => fs.readFileSync(f, 'utf8').split('\n').filter((l) => l.startsWith('{"cand"')).map((l) => JSON.parse(l));
const A = rd(process.argv[2]), B = process.argv[3] ? rd(process.argv[3]) : null;
const key = (r) => `${r.case} | ${r.fx} | ${r.hold}`;
const old = new Map((B || []).map((r) => [key(r), r]));
let over = 0, worst = 0, worstAt = '';
for (const r of A) {
  const o = old.get(key(r));
  const y1 = r.y1 ? r.y1.m : null;
  if (y1 !== null && y1 > 0.01) over++;
  if (y1 !== null && y1 > worst) { worst = y1; worstAt = `${key(r)} @${r.y1.at}`; }
  const f = (x) => (x === undefined || x === null ? '-' : x);
  console.log([key(r).padEnd(52), 'y1', f(y1), r.y1 ? `@${r.y1.at}` : '', o && o.y1 ? `(was ${o.y1.m})` : '', 'y1q', f(r.y1q && r.y1q.m), 'y2', r.y2 ? `${r.y2.l}/${r.y2.h}` : '-', 'y3', f(r.y3), 'wRun', r.wRun, 'wMar', r.wMar.m, 'x4', r.x4, 'j', r.joints, 'redsNew', r.redsNew, 'vsA0', r.redsVsA0].join(' '));
}
console.log(`rows ${A.length}; y1 over 0.01: ${over}; worst y1 ${worst} at ${worstAt}`);

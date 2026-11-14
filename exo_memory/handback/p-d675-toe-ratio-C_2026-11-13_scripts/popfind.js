// popfind.js <zz_joints.txt> <section>: ticks where a toe (joints 16 ToeL, 20 ToeR) moves more than 2 cm beyond half its
// two-tick move (the row's measure; the feet held at the origin, so a planted toe slides back at the speed).
'use strict';
const fs = require('fs');
const [, , file, sec] = process.argv;
const rows = fs.readFileSync(file, 'utf8').trim().split('\n').map((l) => l.trim().split(/\s+/)).filter((p) => p[0] === sec).map((p) => p.slice(3).map(Number));
const at = (r, j) => [r[3 * j], r[3 * j + 1], r[3 * j + 2]];
const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const pops = [];
for (let i = 1; i + 1 < rows.length; i++) for (const j of [16, 20]) {
  const pop = d(at(rows[i], j), at(rows[i - 1], j)) - d(at(rows[i + 1], j), at(rows[i - 1], j)) / 2;
  if (pop > 0.02) pops.push(`${i}(${j === 16 ? 'L' : 'R'} ${(pop * 100).toFixed(1)} cm)`);
}
console.log(`${sec}: ${rows.length} ticks, ${pops.length} pops over 2 cm: ${pops.join(' ')}`);

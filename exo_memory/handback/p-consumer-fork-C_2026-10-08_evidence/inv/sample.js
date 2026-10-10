// sample.js <blocks.tsv> <n>: a seeded random sample of n RULE and n ROOM blocks (from the rule-type sources only), for hand labelling.
'use strict';
const fs = require('fs');
const [file, n] = [process.argv[2], +process.argv[3]];
const rows = fs.readFileSync(file, 'utf8').trim().split('\n').slice(1).map((l) => l.split('\t')).filter((r) => r[3] && r[3].length > 20);
let seed = 20261009; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
for (const cls of ['RULE', 'ROOM']) {
  const pool = rows.filter((r) => r[2] === cls);
  const pick = []; while (pick.length < Math.min(n, pool.length)) { const r = pool[Math.floor(rnd() * pool.length)]; if (!pick.includes(r)) pick.push(r); }
  console.log(`=== ${cls} (pool ${pool.length})`);
  pick.forEach((r, i) => console.log(`${cls[0]}${i + 1}\t${r[0].replace(/ \(ROOM\)/, '')}:${r[1]}\t${r[3].slice(0, 210)}`));
}

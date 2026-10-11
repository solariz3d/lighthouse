// sample.js (pane E, D294): a seeded sample of rows.tsv for the hand audit of the lexical finder rules. Same rows.tsv + same seed = same sample.
// Run: node sample.js <rows.tsv> <src> <rule-prefix> <n> [seed]
'use strict';
const fs = require('fs');
const [file, src, rule, n, seed = '294'] = process.argv.slice(2);
const rows = fs.readFileSync(file, 'utf8').split('\n').slice(1).filter(Boolean).map((l) => l.split('\t')).filter((r) => r[0] === src && r[4].startsWith(rule));
let s = Number(seed) >>> 0;
const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };   // an LCG: reproducible, not secure, not meant to be
for (let i = rows.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [rows[i], rows[j]] = [rows[j], rows[i]]; }
console.log(`${rows.length} rows match ${src} ${rule}*; sample of ${Math.min(Number(n), rows.length)}, seed ${seed}`);
rows.slice(0, Number(n)).forEach((r, k) => console.log(`${k + 1}\t${r[5]}\t${r[4]}\t${r[6]}`));

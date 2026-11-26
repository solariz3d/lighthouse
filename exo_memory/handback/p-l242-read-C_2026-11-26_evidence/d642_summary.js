// d642_summary.js: node d642_summary.js d642_abba_12.txt -> red count, median ratio, median rolling and early p95 per tree
'use strict';
const L = require('fs').readFileSync(process.argv[2], 'utf8').split('\n').filter((l) => /^round/.test(l));
const g = { base: [], tip: [] };
for (const l of L) { const n = l.split(' ')[2], m = /p95 ([\d.]+) ms a move, early p95 ([\d.]+) ms: ([\d.]+)/.exec(l); g[n].push({ ok: /PASS/.test(l), roll: +m[1], early: +m[2], ratio: +m[3] }); }
const med = (a) => { a = [...a].sort((x, y) => x - y); const k = a.length; return k % 2 ? a[(k - 1) / 2] : (a[k / 2 - 1] + a[k / 2]) / 2; };
for (const n of ['base', 'tip']) { const r = g[n]; console.log(`${n}: red ${r.filter((x) => !x.ok).length} of ${r.length}; median ratio ${med(r.map((x) => x.ratio)).toFixed(3)}; median rolling p95 ${med(r.map((x) => x.roll)).toFixed(2)} ms; median early p95 ${med(r.map((x) => x.early)).toFixed(2)} ms; max ratio ${Math.max(...r.map((x) => x.ratio))}`); }

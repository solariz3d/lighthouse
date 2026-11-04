// Agreement between C's reach_kind (census) and B's blind second read (D159), over the landed REACH rows.
// Run from the repo root: node exo_memory/loop/retrieval_reach_agreement_2026-09-26.js
const fs = require('fs');
const rows = f => fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(l => /^\| W\d/.test(l)).map(l => l.split('|').map(s => s.trim()));
const norm = s => (s.match(/KNOWN-UNOPENED|UNSEARCHED|UNDECIDABLE/) || ['?'])[0];

const C = {};
for (const c of rows('exo_memory/loop/retrieval_split_census_2026-09-26.md')) if (c[2] === 'REACH' && /KNOWN|UNSEARCHED/.test(c[3])) C[c[1]] = norm(c[3]);
const B = {};
for (const c of rows('exo_memory/handback/p-d159-reach-B_2026-09-26.md')) B[c[1]] = norm(c[2]);

const bOwn = new Set(['W148', 'W240', 'W246', 'W280', 'W340', 'W344', 'W350', 'W366']);
function score(ids, label) {
  const both = ids.filter(id => B[id] && B[id] !== 'UNDECIDABLE');
  const cats = ['KNOWN-UNOPENED', 'UNSEARCHED'];
  let agree = 0; const m = {};
  for (const id of both) { if (C[id] === B[id]) agree++; m[C[id] + '/' + B[id]] = (m[C[id] + '/' + B[id]] || 0) + 1; }
  const n = both.length, po = agree / n;
  const pe = cats.reduce((s, k) => s + (both.filter(i => C[i] === k).length / n) * (both.filter(i => B[i] === k).length / n), 0);
  const kappa = (po - pe) / (1 - pe);
  console.log(`${label}: n=${n} agree=${agree} (${(100 * po).toFixed(1)}%) kappa=${kappa.toFixed(3)} matrix(C/B)=${JSON.stringify(m)}`);
  return both.filter(id => C[id] !== B[id]);
}
const ids = Object.keys(C);
console.log(`C rows ${ids.length}, B rows ${Object.keys(B).length}, B undecidable ${ids.filter(i => B[i] === 'UNDECIDABLE').join(',') || 'none'}, missing in B ${ids.filter(i => !B[i]).join(',') || 'none'}`);
const dis = score(ids, 'all');
score(ids.filter(i => !bOwn.has(i)), 'without B\'s own 8');
console.log('disagreements:', dis.map(i => `${i} C=${C[i]} B=${B[i]}`).join('; '));

// gensum.js <gen.json> [genTree]: the generator report's counts (the wrapper's first/last lines dropped), and a private-name / given-name / product
// scan over the generated tree (private pattern from PRIV_PATTERN, masked).
'use strict';
const fs = require('fs'), path = require('path');
const [J, T] = process.argv.slice(2);
const txt = fs.readFileSync(J, 'utf8').replace(/^﻿/, '');
const r = JSON.parse(txt.slice(txt.indexOf('{'), txt.lastIndexOf('}') + 1));
const len = (x) => (Array.isArray(x) ? x.length : x == null ? 'n/a' : typeof x === 'object' ? Object.keys(x).length : x);
console.log(`refused ${r.refused || 'no'}; staged ${r.staged}; forked ${r.forked}; leaks ${len(r.leaks)}; unresolved ${len(r.unresolved)}; unclassified ${len(r.unclassified)}; dangling ${len(r.dangling)}; anchorDrift ${len(r.anchorDrift)}`);
for (const k of ['leaks', 'unresolved', 'unclassified', 'anchorDrift']) if (Array.isArray(r[k]) && r[k].length) console.log(`  ${k}: ${JSON.stringify(r[k]).slice(0, 600)}`);
if (T && process.env.PRIV_PATTERN) {
  const P = new RegExp(process.env.PRIV_PATTERN, 'i');
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.name === '.git' ? [] : e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  let priv = 0, given = 0, files = 0; const prod = {};
  for (const f of walk(T)) {
    const b = fs.readFileSync(f); if (b.subarray(0, 8000).includes(0)) continue; files++;
    const s = b.toString('utf8'), rel = path.relative(T, f).replace(/\\/g, '/');
    for (const l of s.split(/\r?\n/)) { if (P.test(l)) priv++; if (/\bzac+[hk]?\b/i.test(l)) given++; }
    if (/\.md$/.test(rel) && !/^exo_memory\/inheritance\//.test(rel) && /T-180|\bt180/i.test(s)) prod[rel] = (s.match(/T-180|\bt180/gi) || []).length;
  }
  console.log(`text files ${files}; private-name lines ${priv}; given-name lines ${given}; product names in shipped .md outside inheritance/: ${JSON.stringify(prod)}`);
}

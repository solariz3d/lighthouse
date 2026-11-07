// boardkinds.js: board.jsonl's record shapes: per (kind/type/tag first word), count and last time; and the lines that read as a refusal or gate
// (a "refus", "denied", "blocked", "gate" in kind, tag or the first 120 chars of text), grouped by their first words. Counts only.
'use strict';
const fs = require('fs'), readline = require('readline');
const rl = readline.createInterface({ input: fs.createReadStream('C:/Consonance/data/board.jsonl') });
const kinds = new Map(), refusals = new Map(); let n = 0, bad = 0;
const t = (o) => o.ts || o.t || o.at || o.time || '';
rl.on('line', (l) => { n++; let o; try { o = JSON.parse(l); } catch (e) { bad++; return; }
  const k = String(o.kind || o.type || o.tag || '?').slice(0, 40); const r = kinds.get(k) || { n: 0, last: '' }; r.n++; r.last = String(t(o)) > r.last ? String(t(o)) : r.last; kinds.set(k, r);
  const text = String(o.text || o.body || o.msg || '').slice(0, 160);
  if (/refus|denied|blocked|\bgate\b/i.test(k + ' ' + (o.tag || '')) || /^\s*\[?(refus|denied|blocked)/i.test(text) || /REFUSED|refused:/.test(text)) {
    const key = (k + ' :: ' + text.replace(/[0-9a-f]{7,}|\d+/g, '#').split(/[.:;(]/)[0]).slice(0, 110); const q = refusals.get(key) || { n: 0, last: '' }; q.n++; q.last = String(t(o)) > q.last ? String(t(o)) : q.last; refusals.set(key, q); }
});
rl.on('close', () => {
  console.log(`board lines ${n}, unparsed ${bad}`);
  for (const [k, r] of [...kinds].sort((a, b) => b[1].n - a[1].n).slice(0, 40)) console.log(`  kind ${k}: ${r.n}, last ${r.last}`);
  console.log('refusal-like groups:');
  for (const [k, r] of [...refusals].sort((a, b) => b[1].n - a[1].n).slice(0, 60)) console.log(`  ${r.n} | last ${r.last} | ${k}`);
});

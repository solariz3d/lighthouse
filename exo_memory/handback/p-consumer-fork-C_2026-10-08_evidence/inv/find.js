// find.js <worktree>: which leak, and which pronoun (D273 lap 4, C).
'use strict';
const fs = require('fs'), path = require('path'), W = process.argv[2];
const T = (p) => path.join(W, 'consonance', 'tools', p);
const R = require(T('consumer-relabel.js')), G = require(T('gen-consumer.js')), D = require(T('identity-diff.js'));
const read = (rel) => fs.readFileSync(path.join(W, rel), 'utf8');
const CTX = { G, ...G.shippedSets(G.collect()) };
for (const rel of Object.keys(R.SITES)) {
  const st = D.replay(rel, /\.js$/.test(rel) ? 'code' : 'prose', read(R.SOURCE_OF[rel] || rel), CTX);
  const out = st[st.length - 1].text;
  const leaks = G.scan(out, rel);
  if (leaks.length) console.log('LEAK', rel, JSON.stringify(leaks).slice(0, 400));
  if (/cards\//.test(rel)) out.split('\n').forEach((l, i) => { const m = l.match(/\b(?:He|he|Him|him|His|his)\b/g); if (m) console.log('PRONOUN', rel + ':' + (i + 1), m.join(','), '|', l.slice(0, 160)); });
}

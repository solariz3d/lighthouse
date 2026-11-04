// prefork.js <repo> <rel> <fromRegex> <lines>: print the text the fork hook RECEIVES for <rel> (gen-consumer's own steps replayed), from the first line matching fromRegex.
'use strict';
const path = require('path'), fs = require('fs');
const [repo, rel, from, n] = process.argv.slice(2);
const R = require(repo + '/consonance/tools/consumer-relabel.js');
const G = require(repo + '/consonance/tools/gen-consumer.js');
const D = require(repo + '/consonance/tools/identity-diff.js');
const read = (r) => fs.readFileSync(path.join(repo, r), 'utf8');
const CTX = { G, ...G.shippedSets(G.collect()) };
const st = D.replay(rel, /\.js$/.test(rel) ? 'code' : 'prose', read(R.SOURCE_OF[rel] || rel), CTX);
const i = st.findIndex((s) => s.step.startsWith('fork'));
const t = st[i < 0 ? st.length - 1 : i - 1].text.split('\n');
const at = t.findIndex((l) => new RegExp(from).test(l));
console.log(t.slice(at, at + Number(n || 40)).map((l, k) => `${at + k + 1}| ${l}`).join('\n'));

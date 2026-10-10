// prefork.js <worktree> <rel> <from> <to>: print lines from..to of the text the fork hook receives for <rel> (D273 lap 4b, C).
'use strict';
const fs = require('fs'), path = require('path');
const [W, rel, a, b] = process.argv.slice(2);
const T = (p) => path.join(W, 'consonance', 'tools', p);
const R = require(T('consumer-relabel.js')), G = require(T('gen-consumer.js')), D = require(T('identity-diff.js'));
const CTX = { G, ...G.shippedSets(G.collect()) };
const st = D.replay(rel, /\.js$/.test(rel) ? 'code' : 'prose', fs.readFileSync(path.join(W, R.SOURCE_OF[rel] || rel), 'utf8'), CTX);
const i = st.findIndex((s) => s.step.startsWith('fork')), pre = st[i < 0 ? st.length - 1 : i - 1].text.split('\n');
for (let n = +a; n <= +b; n++) console.log(String(n).padStart(4) + '| ' + pre[n - 1]);
console.log('keeper lines:', pre.filter((l) => /keeper/i.test(l)).length);

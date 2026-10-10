// pregrep.js <worktree> <rel> <regex>: lines of the text the fork hook receives for <rel> that match <regex> (D273 lap 5, C).
'use strict';
const fs = require('fs'), path = require('path');
const [W, rel, re] = process.argv.slice(2);
const T = (p) => path.join(W, 'consonance', 'tools', p);
const R = require(T('consumer-relabel.js')), G = require(T('gen-consumer.js')), D = require(T('identity-diff.js'));
const CTX = { G, ...G.shippedSets(G.collect()) };
const st = D.replay(rel, /\.js$/.test(rel) ? 'code' : 'prose', fs.readFileSync(path.join(W, R.SOURCE_OF[rel] || rel), 'utf8'), CTX);
const i = st.findIndex((s) => s.step.startsWith('fork')), pre = st[i < 0 ? st.length - 1 : i - 1].text.split('\n');
const rx = new RegExp(re);
pre.forEach((l, n) => { if (rx.test(l)) console.log(rel + ':' + (n + 1) + '| ' + l); });

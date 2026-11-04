// pins.js <worktree>: apply every relabel row to the pre-fork text and count the keeper lines left (D273 lap 4, C).
'use strict';
const fs = require('fs'), path = require('path'), W = process.argv[2];
const T = (p) => path.join(W, 'consonance', 'tools', p);
const R = require(T('consumer-relabel.js')), G = require(T('gen-consumer.js')), D = require(T('identity-diff.js'));
const read = (rel) => fs.readFileSync(path.join(W, rel), 'utf8');
const CTX = { G, ...G.shippedSets(G.collect()) };
const FORK = R.fillFork(read('consonance/src-tauri/brief/frag-fork.md'), { sha: 'ea4f5bcf', date: '2026-10-08' });
const kl = (t) => t.split(/\r?\n/).filter((l) => /keeper/i.test(l));
for (const rel of Object.keys(R.SITES)) {
  const st = D.replay(rel, /\.js$/.test(rel) ? 'code' : 'prose', read(R.SOURCE_OF[rel] || rel), CTX);
  const i = st.findIndex((s) => s.step.startsWith('fork')), pre = st[i < 0 ? st.length - 1 : i - 1].text;
  try {
    const o = R.relabel(rel, pre, { fork: FORK });
    console.log(rel.padEnd(58), 'edits', o.edits.length, 'keeper lines left', kl(o.text).filter((l) => !kl(FORK).includes(l)).length);
  } catch (e) { console.log(rel, 'ERROR', e.message.slice(0, 200)); }
}

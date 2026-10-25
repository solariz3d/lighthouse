// pins.js <repo> [fileRegex]: per registered file, keeper lines left after relabel vs the pin; prints the lines for files that differ (or match the regex).
'use strict';
const path = require('path'), fs = require('fs');
const repo = process.argv[2], show = process.argv[3] ? new RegExp(process.argv[3]) : null;
const R = require(repo + '/consonance/tools/consumer-relabel.js');
const G = require(repo + '/consonance/tools/gen-consumer.js');
const D = require(repo + '/consonance/tools/identity-diff.js');
const read = (rel) => fs.readFileSync(path.join(repo, rel), 'utf8');
const FORK = R.fillFork(read(R.FORK_TEMPLATE), { sha: 'ea4f5bcf', date: '2026-10-08' });
const CTX = { G, ...G.shippedSets(G.collect()) };
const preFork = (rel) => { const st = D.replay(rel, /\.js$/.test(rel) ? 'code' : 'prose', read(R.SOURCE_OF[rel] || rel), CTX); const i = st.findIndex((s) => s.step.startsWith('fork')); return st[i < 0 ? st.length - 1 : i - 1].text; };
const kl = (t) => t.split(/\r?\n/).map((l, i) => [i + 1, l]).filter(([, l]) => /keeper/i.test(l));
const forkLines = new Set(kl(FORK).map(([, l]) => l));
for (const [rel, pin] of Object.entries(R.EXPECTED_KEEPER_LINES)) {
  let out;
  try { out = R.relabel(rel, preFork(rel), { fork: FORK }).text; } catch (e) { console.log(`THROWS ${rel}: ${e.message}`); continue; }
  const left = kl(out).filter(([, l]) => !forkLines.has(l));
  const bad = left.length !== pin;
  console.log(`${bad ? 'DIFF' : 'ok  '} ${rel}: ${left.length} (pin ${pin})`);
  if (bad || (show && show.test(rel))) for (const [n, l] of left) console.log(`      ${n}: ${l.trim().slice(0, 230)}`);
}

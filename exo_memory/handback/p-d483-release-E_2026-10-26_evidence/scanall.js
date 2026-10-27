// scanall.js (D483, pane E): runs rangescan.js (A's, copied) over a range and over each commit in it (c^!, with -m), with PRIV_PATTERN built
// from A's priv.txt and pane E's private term list, both outside every repo and never printed. Prints counts only.   node scanall.js <tree> <range>
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const S = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/';
const A = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-3d57124e/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d457/priv.txt';
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const alts = [...fs.readFileSync(A, 'utf8').trim().split('|').filter(Boolean), ...require(S + 'd161/private_terms.json').map(esc)];
const env = { ...process.env, PRIV_PATTERN: alts.join('|') };
const [tree, range] = process.argv.slice(2), scan = path.join(S, 'd483', 'rangescan.js');
const run = (r) => execFileSync(process.execPath, [scan, tree, r], { env, encoding: 'utf8', maxBuffer: 1 << 28 });
console.log(`PRIV_PATTERN alternatives: ${alts.length} (2 from priv.txt, ${alts.length - 2} from the term list)`);
console.log(run(range).trim());
const commits = execFileSync('git', ['rev-list', '--reverse', range], { cwd: tree, encoding: 'utf8' }).trim().split('\n');
let bad = 0;
for (const c of commits) {
  const out = run(`${c}^!`), total = +(/^total (\d+)/m.exec(out) || [])[1];
  if (total) bad++;
  console.log(`per commit ${c.slice(0, 7)}: ${/^range [^:]+: (.*)$/m.exec(out)[1]}, total ${total}`);
  if (total) console.log(out.split('\n').filter((l) => /: added [1-9]|messages [1-9]/.test(l)).join('\n'));
}
console.log(`commits with any hit: ${bad} of ${commits.length}`);

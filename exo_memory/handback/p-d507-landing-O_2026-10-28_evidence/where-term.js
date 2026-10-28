// D507 (O): where one private-project term (by its 1-based index, as lhpriv.js numbers them) appears in a range's added lines.
// Prints commit, file and the line's place only; never the term, never the line.   node where-term.js <range> <k>
'use strict';
const fs = require('fs'), { execFileSync } = require('child_process');
const E = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/';
const A = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-3d57124e/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d457/priv.txt';
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const alts = [...fs.readFileSync(A, 'utf8').trim().split('|').filter(Boolean), ...require(E + 'd161/private_terms.json').map(esc)];
const [range, k] = [process.argv[2], Number(process.argv[3])];
const re = new RegExp(alts[k - 1], 'i');
const g = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 1 << 30 });
for (const sha of g('rev-list', range).trim().split('\n')) {
  let file = '', n = 0;
  for (const l of g('show', '-m', '--first-parent', '--no-color', '--format=', '-U0', sha).split('\n')) {
    if (l.startsWith('+++ ')) { file = l.slice(6); continue; }
    const h = l.match(/^@@ -\S+ \+(\d+)/); if (h) { n = Number(h[1]); continue; }
    if (l.startsWith('+')) { if (re.test(l)) console.log(`${sha.slice(0, 8)} ${file}:${n} (line length ${l.length - 1})`); n++; }
  }
}

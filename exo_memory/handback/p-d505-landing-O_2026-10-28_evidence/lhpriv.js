// lhpriv.js (D505, O): the private-project terms (A's priv.txt and E's term list, both outside every repo, never printed) over a range's added lines and
// messages, in the current repo. Counts only, generic labels.   node lhpriv.js <range>
'use strict';
const fs = require('fs'), { execFileSync } = require('child_process');
const E = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/';
const A = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-3d57124e/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d457/priv.txt';
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const alts = [...fs.readFileSync(A, 'utf8').trim().split('|').filter(Boolean), ...require(E + 'd161/private_terms.json').map(esc)];
const g = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 1 << 30 }), range = process.argv[2];
const added = g('log', '-p', '-m', '--no-color', '--format=', range).split('\n').filter((l) => l.startsWith('+') && !l.startsWith('+++')).join('\n');
const msgs = g('log', '--format=%B', range);
let tot = 0;
alts.forEach((a, k) => { const re = new RegExp(a, 'gi'), x = (added.match(re) || []).length, m = (msgs.match(re) || []).length; tot += x + m; console.log(`private-project term ${k + 1}: added ${x}, messages ${m}`); });
console.log(`range ${range}: ${g('rev-list', '--count', range).trim()} commits, ${added.split('\n').length} added lines; alternatives ${alts.length}; total ${tot}`);

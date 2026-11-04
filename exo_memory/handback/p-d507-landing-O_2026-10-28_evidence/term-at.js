// D507 (O): how many tracked files at <rev> contain private-project term k, and in how many lines. Counts only.   node term-at.js <rev> <k>
const fs = require('fs'), { execFileSync } = require('child_process');
const E = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/';
const A = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-3d57124e/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d457/priv.txt';
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const alts = [...fs.readFileSync(A, 'utf8').trim().split('|').filter(Boolean), ...require(E + 'd161/private_terms.json').map(esc)];
const [rev, k] = [process.argv[2], Number(process.argv[3])];
let out = '';
try { out = execFileSync('git', ['grep', '-c', '-i', '-P', alts[k - 1], rev], { encoding: 'utf8', maxBuffer: 1 << 30 }); } catch (e) { if (e.status !== 1) throw e; }
const rows = out.trim().split('\n').filter(Boolean);
console.log(`${rev}: term ${k} in ${rows.length} files, ${rows.reduce((s, r) => s + Number(r.split(':').pop()), 0)} lines`);

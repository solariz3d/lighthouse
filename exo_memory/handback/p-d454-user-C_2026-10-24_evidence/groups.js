// groups.js <inv.json>: the flagged new lines counted by file group x category, for the hand-back's classification table.
'use strict';
const fs = require('fs');
const inv = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const SITES = new Set(Object.keys(require('C:/Users/nname/Desktop/worktrees/lh-d454-c/consonance/tools/consumer-relabel.js').SITES));
const group = (f) => SITES.has(f) ? 'relabelled briefs/cards' : /^exo_memory\/inheritance\//.test(f) ? 'inheritance (the keeper\'s record, labelled)'
  : /\.test\.js$|mutants|[\\/]tests?[\\/]/.test(f) ? 'tests and mutant harnesses' : /\.rs$/.test(f) ? 'rust source (non-test lines and #[test]s)'
  : /\.(js|ps1)$/.test(f) ? 'hooks/tools code (non-test)' : 'other shipped text';
const t = {};
for (const r of inv.rows) { const g = group(r.file); t[g] = t[g] || { lines: 0 }; t[g].lines++; for (const c of r.cats) t[g][c] = (t[g][c] || 0) + 1; }
console.log(`flagged ${inv.rows.length} of ${inv.newLines} new non-blank lines in ${inv.newFiles} new + changed files`);
for (const [g, v] of Object.entries(t).sort((a, b) => b[1].lines - a[1].lines)) console.log(`  ${String(v.lines).padStart(4)}  ${g}: ${Object.entries(v).filter(([k]) => k !== 'lines').map(([k, n]) => `${k} ${n}`).join(', ')}`);

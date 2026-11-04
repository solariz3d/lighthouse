// treeterms.js <repo> <revA> <revB> <idx>...: for each term index (where.js's 1-based numbering, same parse), the number of LINES holding it in the whole
// tree at revA and at revB (git grep, text files). Counts only; never a term or a line.
'use strict';
const fs = require('fs'), { spawnSync } = require('child_process');
const [, , repo, A, B, ...idx] = process.argv;
const terms = fs.readFileSync('C:/Consonance/private/d528/terms.txt', 'utf8').split(/\r?\n/).filter((l) => l && !l.startsWith('#'))
  .map((l) => { const [t, rule = ''] = l.split('\t'); return { t: t.trim(), word: /^word/.test(rule.trim()), file: /^file/.test(rule.trim()) }; }).filter((x) => x.t && !x.file);
const count = (rev, T) => {
  const r = spawnSync('git', ['-C', repo, 'grep', '-I', '-i', '-c', ...(T.word ? ['-w'] : []), '-F', '-e', T.t, rev], { encoding: 'utf8', maxBuffer: 1 << 26 });
  return r.stdout.trim() ? r.stdout.trim().split('\n').reduce((a, l) => a + Number(l.split(':').pop()), 0) : 0;
};
for (const i of idx) { const T = terms[Number(i) - 1]; const a = count(A, T), b = count(B, T); console.log(`term #${i}: ${A.slice(0, 10)} ${a} lines, ${B.slice(0, 10)} ${b} lines (${b - a >= 0 ? '+' : ''}${b - a})`); }

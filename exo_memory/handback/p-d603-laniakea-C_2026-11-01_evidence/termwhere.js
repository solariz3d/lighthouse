// termwhere.js <repo> <base> <head> <index from 0>: file:line of every ADDED line in base..head that carries that private-list term (sweep.js's matching);
// prints the location and the term's length only, never the term or the line
'use strict';
const fs = require('fs'), cp = require('child_process');
const [R, B, H, I] = process.argv.slice(2);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const terms = fs.readFileSync('C:/Consonance/private/d528/terms.txt', 'utf8').split(/\r?\n/).filter((l) => l && !l.startsWith('#'))
  .map((l) => { const [t, rule = ''] = l.split('\t'); return { t: t.trim(), word: /^word/.test(rule.trim()) }; });
const x = terms[Number(I)], re = new RegExp(x.word ? `(?<![A-Za-z0-9_])${esc(x.t)}(?![A-Za-z0-9_])` : esc(x.t), 'i');
const d = cp.execSync(`git -C "${R}" diff ${B} ${H}`, { encoding: 'utf8', maxBuffer: 1e9 });
let f = '', ln = 0;
for (const l of d.split('\n')) {
  const h = /^@@ -\d+(?:,\d+)? \+(\d+)/.exec(l);
  if (h) { ln = Number(h[1]) - 1; continue; }
  if (l.startsWith('+++ ')) { f = l.slice(6); continue; }
  if (l.startsWith('---') || l.startsWith('-') || l.startsWith('diff ') || l.startsWith('index ')) continue;
  ln++;
  if (l.startsWith('+') && re.test(l)) console.log(`${f}:${ln} (term #${I}, word rule ${x.word}, length ${x.t.length})`);
}

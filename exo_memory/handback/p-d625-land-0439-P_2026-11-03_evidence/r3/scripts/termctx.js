// termctx.js <index> <rev> <file>...: for each hit of sweep.js's term <index>, whether it sits inside a longer word (letters either side), and how
// many hits the same rule finds on <rev>'s whole tree. Never prints the term or the line.
'use strict';
const fs = require('fs'), { execFileSync } = require('child_process');
const terms = fs.readFileSync('C:/Consonance/private/d528/terms.txt', 'utf8').split(/\r?\n/).filter((l) => l && !l.startsWith('#'))
  .map((l) => { const [t, rule = ''] = l.split('\t'); return { t: t.trim(), word: /^word/.test(rule.trim()), file: /^file/.test(rule.trim()) }; }).filter((x) => x.t && !x.file);
const [idx, rev, ...files] = process.argv.slice(2), x = terms[Number(idx)];
if (!x) throw new Error('no term at that index');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), re = new RegExp(x.word ? `(?<![A-Za-z0-9_])${esc(x.t)}(?![A-Za-z0-9_])` : esc(x.t), 'gi');
const letter = (c) => /[A-Za-z]/.test(c || '');
for (const f of files) fs.readFileSync(f, 'utf8').split(/\r?\n/).forEach((l, i) => { for (const m of l.matchAll(re)) {
  const before = letter(l[m.index - 1]), after = letter(l[m.index + m[0].length]);
  console.log(`  ${f}:${i + 1} col ${m.index + 1}: inside a longer word ${before || after} (letter before ${before}, after ${after})`); } });
let n = 0, inWord = 0;
const tree = execFileSync('git', ['ls-tree', '-r', '--name-only', rev], { encoding: 'utf8', maxBuffer: 1 << 28, windowsHide: true }).split('\n').filter(Boolean);
for (const p of tree) {
  let s; try { s = execFileSync('git', ['show', `${rev}:${p}`], { encoding: 'utf8', maxBuffer: 1 << 28, windowsHide: true }); } catch (e) { continue; }
  for (const m of s.matchAll(re)) { n++; if (letter(s[m.index - 1]) || letter(s[m.index + m[0].length])) inWord++; }
}
console.log(`term #${idx} on ${rev}'s tree (${tree.length} files): ${n} hits, ${inWord} inside a longer word`);

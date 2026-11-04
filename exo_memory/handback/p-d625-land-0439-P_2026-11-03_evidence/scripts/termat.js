// termat.js <index> <file>...: file:line (and column) of every line holding the private-list term at sweep.js's <index> (its own list order: comment and file-rule
// lines dropped, word terms as words). Prints the location and the term's length only, never the term or the line.
'use strict';
const fs = require('fs');
const terms = fs.readFileSync('C:/Consonance/private/d528/terms.txt', 'utf8').split(/\r?\n/).filter((l) => l && !l.startsWith('#'))
  .map((l) => { const [t, rule = ''] = l.split('\t'); return { t: t.trim(), word: /^word/.test(rule.trim()), file: /^file/.test(rule.trim()) }; }).filter((x) => x.t && !x.file);
const x = terms[Number(process.argv[2])]; if (!x) throw new Error('no term at that index');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), re = new RegExp(x.word ? `(?<![A-Za-z0-9_])${esc(x.t)}(?![A-Za-z0-9_])` : esc(x.t), 'i');
console.log(`term #${process.argv[2]}: length ${x.t.length}, ${x.word ? 'word' : 'phrase'}`);
for (const f of process.argv.slice(3)) fs.readFileSync(f, 'utf8').split(/\r?\n/).forEach((l, i) => { const m = re.exec(l); if (m) console.log(`  ${f}:${i + 1} col ${m.index + 1}`); });

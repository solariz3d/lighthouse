// sweep.js <file>...: the D555 sweep of new public files. COUNTS ONLY, never a term or a matched line.
//  (1) the private term list (C:/Consonance/private/d528/terms.txt, read at run time, word terms as words, phrases as phrases, case-insensitive): hits per term index;
//  (2) the room's own words and ids: lap ids, keeper, committee, lighthouse paths, seat words.
'use strict';
const fs = require('fs');
const terms = fs.readFileSync('C:/Consonance/private/d528/terms.txt', 'utf8').split(/\r?\n/).filter((l) => l && !l.startsWith('#'))
  .map((l) => { const [t, rule = ''] = l.split('\t'); return { t: t.trim(), word: /^word/.test(rule.trim()), file: /^file/.test(rule.trim()) }; })
  .filter((x) => x.t && !x.file);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ROOM = { 'lap ids (D/L/P + digits)': /\b[DLP]-?\d{2,4}[a-z]?\b/g, keeper: /keeper/gi, committee: /committee/gi, lighthouse: /lighthouse/gi, exo_memory: /exo_memory/gi,
  'seat words (pane X, librarian, chair, sibling)': /\bpane [A-Z]\b|librarian|\bchair\b|sibling/gi, consonance: /consonance/gi, 'third-party / creators': /third[- ]party|other creators?/gi, 'reference track': /reference track/gi };
let total = 0;
for (const f of process.argv.slice(2)) {
  const s = fs.readFileSync(f, 'utf8');
  const termHits = terms.map((x, i) => [i, (s.match(new RegExp(x.word ? `(?<![A-Za-z0-9_])${esc(x.t)}(?![A-Za-z0-9_])` : esc(x.t), 'gi')) || []).length]).filter(([, n]) => n > 0);
  const roomHits = Object.entries(ROOM).map(([k, re]) => [k, (s.match(re) || []).length]).filter(([, n]) => n > 0);
  const n = termHits.reduce((a, [, c]) => a + c, 0) + roomHits.reduce((a, [, c]) => a + c, 0); total += n;
  console.log(`${f}: ${terms.length} terms checked, term hits ${termHits.reduce((a, [, c]) => a + c, 0)}${termHits.length ? ' at term index ' + termHits.map(([i, c]) => `#${i}×${c}`).join(' ') : ''}; room words ${roomHits.length ? roomHits.map(([k, c]) => `${k} ${c}`).join(', ') : '0'}`);
}
console.log(`total hits ${total}`);
process.exit(total ? 1 : 0);

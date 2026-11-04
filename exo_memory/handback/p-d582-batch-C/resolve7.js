// resolve7.js <worktree>: D582, the d581-o merge (last): panel.js (the "early" titles: O's code, the sweep's comment wording) and texture-page.test.js
// (two rows numbered 10: the dialogs' row kept as 10, the hover card's renumbered 11, both tests kept whole). EOL kept.
'use strict';
const fs = require('fs'), path = require('path');
const wt = process.argv[2];
const re = /<<<<<<< [^\r\n]*\r?\n([\s\S]*?)=======\r?\n([\s\S]*?)>>>>>>> [^\r\n]*\r?\n/g;
const must = (c, msg) => { if (!c) throw new Error(msg); };
const lines = (b) => b.split(/\r?\n/).filter((l, k, a) => !(k === a.length - 1 && l === ''));
const swap = (l, from, to) => { must(l.includes(from), `missing: ${from}`); return l.replace(from, to); };
const R = {
  'app/core/panel.js': [
    (O, T) => {
      must(O.length === 1 && O[0].startsWith('// THE TURN AS A CORNER (B; the user') && T[T.length - 1].startsWith('// THE TURN AS A CORNER (D331 B;'), 'panel 1 shape');
      const body = T.slice(0, -1).map((l) => l
        .replace("ONE PER ROW (D581), each", 'ONE PER ROW, each')
        .replace(" no roll bar (C's d574-c; until it lands the width is AT_START_M, as turn and climb);", ' no roll bar;'));
      must(!body.some((l) => /D\d{3}|C's/.test(l)), 'panel 1: a pointer left');
      return [...body, swap(O[0], '(B; the user', '(the user')];
    },
    (O, T) => {
      must(T.length === 4 && T[2].includes('title: EARLY_TITLE[k]'), 'panel 2 shape');
      return [
        swap(T[0], '// D581 (the user, 2026-10-31:', '// (the user, 2026-10-31:'),
        T[1],
        T[2],
        O[O.length - 1],   // the sweep's wording of the turn-field line
      ];
    },
  ],
  'app/test/texture-page.test.js': [
    (O, T) => {
      must(O.some((l) => l.startsWith("test('row 10 (D575)")) && T.some((l) => l.startsWith("test('row 10 (D581)")), 'texture 1 shape');
      // the block cuts both tests before their common last line `});`, which follows it once: the dialogs' test is closed here, the hover card's below
      const card = T.map((l) => l.replace("test('row 10 (D581): the hover card", "test('row 11 (D581): the hover card")
        .replace('// D581 (the user, 2026-10-31:', '// (the user, 2026-10-31:'));
      return [...O, '});', '', ...card];
    },
  ],
};
for (const [f, rules] of Object.entries(R)) {
  const p = path.join(wt, f), s = fs.readFileSync(p, 'utf8'), EOL = s.includes('\r\n') ? '\r\n' : '\n'; let i = 0;
  let out = s.replace(re, (m, ours, theirs) => { const rule = rules[i++]; must(rule, `${f}: more blocks than rules`); return rule(lines(ours), lines(theirs)).join(EOL) + EOL; });
  must(i === rules.length, `${f}: ${i} blocks, ${rules.length} rules`);
  if (f === 'app/test/texture-page.test.js') out = out.replace('//  10  (D581) the hover card (app/hovertip.js)', '//  11  the hover card (app/hovertip.js)');
  fs.writeFileSync(p, out); console.log(`${f}: ${i} block(s) resolved`);
}

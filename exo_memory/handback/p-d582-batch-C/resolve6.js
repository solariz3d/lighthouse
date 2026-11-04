// resolve6.js <worktree>: D582, the d580-a (A's sweep and shown-strings pass) merge: eight files, each block by a rule written here.
// O = ours' lines (the features and E's sweep), T = theirs' lines (A's). Each rule returns the block's lines; EOL kept.
'use strict';
const fs = require('fs'), path = require('path');
const wt = process.argv[2];
const re = /<<<<<<< [^\r\n]*\r?\n([\s\S]*?)=======\r?\n([\s\S]*?)>>>>>>> [^\r\n]*\r?\n/g;
const cut = (l) => l.replace(/\s*\/\/.*$/, '');   // a line's code (a trailing comment cut; fine for these lines, none has // inside a string)
const must = (c, msg) => { if (!c) throw new Error(msg); };
const R = {
  'app/export/export.js': [(O, T) => {
    must(O.length === 1 && T.length === 1 && O[0].includes('edgeApronM'), 'export.js shape');
    return [cut(O[0]) + '   // test: the TEST export of an unfinished track'];
  }],
  'app/menubar/items.js': [(O, T) => {
    must(O.length === 3 && T.length === 2 && O[1].includes('apronField'), 'items.js shape');
    return [T[0], O[1].replace('D572: Track ▸ Edge apron', 'Track ▸ Edge apron'), T[1]];
  }],
  'src/export/pitlane.js': [
    (O, T) => {   // A's source strings, E's comments
      must(O.length === 4 && T.length === 4, 'pitlane 1 shape');
      return [T[0], cut(T[1]) + O[1].slice(cut(O[1]).length), T[2], O[3]];
    },
    (O, T) => { must(O.length === 2 && T.length === 2, 'pitlane 2 shape'); return [T[0], O[1]]; },
  ],
  'app/test/texture-page.test.js': [(O, T) => {
    must(O.length === 4 && T.length === 2 && O[2].includes('(D575)'), 'texture-page shape');
    return [T[0], T[1], O[2].replace('(D575) ', ''), O[3]];
  }],
  'app/test/sculpt-frame.test.js': [(O, T) => {
    must(O.length === 3 && T.length === 2 && O[2].startsWith("// The lock's folder comes from CONSONANCE_DATA"), 'sculpt-frame shape');
    return [T[0], T[1], O[2]];
  }],
  'app/test/export-isolated.test.js': [(O, T) => {
    must(O.length === 6 && T.length === 5 && O[5].includes('257d550e6870bdf1'), 'export-isolated shape');
    return [T[0], ...O.slice(1)];
  }],
  'app/test/core-close-mutation.test.js': [(O, T) => {
    must(O.length === 3 && T.length === 2 && O[1].startsWith('  // AMENDED'), 'core-close-mutation shape');
    return [T[0], O[1], O[2]];
  }],
  'app/test/core-mutation.test.js': [(O, T) => { must(O.length === 1 && T.length === 1 && O[0].includes('edgeApronM'), 'core-mutation shape'); return O; }],
};
for (const [f, rules] of Object.entries(R)) {
  const p = path.join(wt, f), s = fs.readFileSync(p, 'utf8'), EOL = s.includes('\r\n') ? '\r\n' : '\n'; let i = 0;
  const out = s.replace(re, (m, ours, theirs) => {
    const rule = rules[i++]; must(rule, `${f}: more blocks than rules`);
    const lines = (b) => b.split(/\r?\n/).filter((l, k, a) => !(k === a.length - 1 && l === ''));
    return rule(lines(ours), lines(theirs)).join(EOL) + EOL;
  });
  must(i === rules.length, `${f}: ${i} blocks, ${rules.length} rules`);
  fs.writeFileSync(p, out); console.log(`${f}: ${i} block(s) resolved`);
}

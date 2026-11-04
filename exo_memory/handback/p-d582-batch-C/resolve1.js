// resolve1.js <worktree>: D582, the d572-e merge: CHANGELOG.md and MAP.md conflicts resolved by hand rule, EOL kept.
// CHANGELOG: HEAD's block, with theirs' apron line inserted after HEAD's first Added entry (both under [Unreleased] ▸ Added).
// MAP.md: HEAD's export line (markers.js's 15° note) with theirs' apron.js entry appended.
'use strict';
const fs = require('fs'), path = require('path');
const wt = process.argv[2];
function blocks(s) {
  const EOL = s.includes('\r\n') ? '\r\n' : '\n';
  const re = /<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n([\s\S]*?)>>>>>>> [^\r\n]*\r?\n/g;
  return { EOL, re };
}
{ // CHANGELOG
  const p = path.join(wt, 'CHANGELOG.md'), s = fs.readFileSync(p, 'utf8'); const { EOL, re } = blocks(s); let n = 0;
  const out = s.replace(re, (m, ours, theirs) => {
    n++;
    const apron = theirs.trim();
    if (!apron.startsWith('- **A wheel that drops off')) throw new Error('unexpected theirs: ' + apron.slice(0, 60));
    const i = ours.indexOf(EOL + EOL);   // the end of HEAD's first Added entry
    if (i < 0) throw new Error('no blank line in ours');
    return ours.slice(0, i) + EOL + EOL + apron + ours.slice(i);
  });
  if (n !== 1) throw new Error('CHANGELOG blocks ' + n);
  fs.writeFileSync(p, out); console.log('CHANGELOG.md resolved');
}
{ // MAP.md
  const p = path.join(wt, 'MAP.md'), s = fs.readFileSync(p, 'utf8'); const { re } = blocks(s); let n = 0;
  const out = s.replace(re, (m, ours, theirs) => {
    n++;
    const add = theirs.match(/, `apron\.js` \([^)]*\)/);
    if (!add || !/`underskin\.js` \(the underside\)\./.test(ours)) throw new Error('MAP shapes changed');
    return ours.replace('`underskin.js` (the underside).', '`underskin.js` (the underside)' + add[0] + '.');
  });
  if (n !== 1) throw new Error('MAP blocks ' + n);
  fs.writeFileSync(p, out); console.log('MAP.md resolved');
}

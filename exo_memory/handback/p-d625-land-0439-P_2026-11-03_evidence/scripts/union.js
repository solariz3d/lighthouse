// union.js <CHANGELOG.md>: every conflict block whose two sides are bullets only (no heading on either side) becomes ours, a blank line, theirs. Fails on anything else.
'use strict';
const fs = require('fs');
const f = process.argv[2]; let s = fs.readFileSync(f, 'utf8');
const re = /<<<<<<< [^\r\n]*\r?\n([\s\S]*?)=======\r?\n([\s\S]*?)>>>>>>> [^\r\n]*(\r?\n)/g; let n = 0;
s = s.replace(re, (all, ours, theirs, nl) => {
  for (const side of [ours, theirs]) for (const l of side.split(/\r?\n/)) if (l.trim() && !/^- |^  /.test(l)) throw new Error('not a bullet: ' + l.slice(0, 60));
  n++; return ours.replace(/\s+$/, '') + nl + nl + theirs.replace(/\s+$/, '') + nl;
});
if (!n || /^(<<<<<<<|=======|>>>>>>>)/m.test(s)) throw new Error('blocks ' + n + ' or markers left');
fs.writeFileSync(f, s); console.log(`union of ${n} block(s) in ${f}`);

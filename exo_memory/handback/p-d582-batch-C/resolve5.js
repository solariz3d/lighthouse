// resolve5.js <worktree> <file> <line>...: replace the single conflict block in <file> with the given lines (a comment-only block: both sides must be all comment).
'use strict';
const fs = require('fs'), path = require('path');
const [, , wt, file, ...lines] = process.argv;
const p = path.join(wt, file), s = fs.readFileSync(p, 'utf8'), EOL = s.includes('\r\n') ? '\r\n' : '\n';
const re = /<<<<<<< [^\r\n]*\r?\n([\s\S]*?)=======\r?\n([\s\S]*?)>>>>>>> [^\r\n]*\r?\n/g;
const allComment = (b) => b.split(/\r?\n/).filter(Boolean).every((l) => /^\s*(\/\/|\*|\/\*)/.test(l));
let n = 0;
const out = s.replace(re, (m, ours, theirs) => {
  n++;
  if (!allComment(ours) || !allComment(theirs) || !lines.every((l) => /^\s*(\/\/|\*|\/\*)/.test(l))) throw new Error('not a comment-only block');
  return lines.join(EOL) + EOL;
});
if (n !== 1) throw new Error(`${file}: ${n} blocks`);
fs.writeFileSync(p, out); console.log(`${file}: resolved (comment-only)`);

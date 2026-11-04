// blocks.js <worktree> <file>...: every conflict block, numbered, with each side marked comment-only or CODE, and its lines (cut to 260 chars).
'use strict';
const fs = require('fs'), path = require('path');
const [, , wt, ...files] = process.argv;
const re = /<<<<<<< [^\r\n]*\r?\n([\s\S]*?)=======\r?\n([\s\S]*?)>>>>>>> [^\r\n]*\r?\n/g;
const kind = (b) => b.split(/\r?\n/).filter((l) => l.trim()).every((l) => /^\s*(\/\/|\*|\/\*)/.test(l)) ? 'comment-only' : 'CODE';
for (const f of files) {
  const s = fs.readFileSync(path.join(wt, f), 'utf8'); let m, i = 0;
  while ((m = re.exec(s))) {
    i++; const line = s.slice(0, m.index).split('\n').length;
    console.log(`#### ${f} block ${i} at line ${line}: ours ${kind(m[1])}, theirs ${kind(m[2])}`);
    for (const [tag, b] of [['O', m[1]], ['T', m[2]]]) b.split(/\r?\n/).filter((l) => l.length).forEach((l) => console.log(`${tag}| ${l.slice(0, 260)}`));
  }
}

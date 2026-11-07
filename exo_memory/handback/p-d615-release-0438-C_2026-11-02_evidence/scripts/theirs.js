// theirs.js <file...>: resolve each conflict block to the picked commit's side (run in the tree); keeps the file's line endings
'use strict';
const fs = require('fs');
for (const f of process.argv.slice(2)) {
  const s = fs.readFileSync(f, 'utf8'), eol = s.includes('\r\n') ? '\r\n' : '\n', L = s.split(eol), out = [];
  let st = 0, n = 0;
  for (const l of L) {
    if (st === 0 && l.startsWith('<<<<<<< ')) { st = 1; n++; continue; }
    if (st === 1 && l === '=======') { st = 2; continue; }
    if (st === 2 && l.startsWith('>>>>>>> ')) { st = 0; continue; }
    if (st === 1) continue;
    out.push(l);
  }
  if (st !== 0) throw new Error('unterminated conflict in ' + f);
  fs.writeFileSync(f, out.join(eol));
  console.log(f + ': ' + n + ' block(s) to theirs');
}

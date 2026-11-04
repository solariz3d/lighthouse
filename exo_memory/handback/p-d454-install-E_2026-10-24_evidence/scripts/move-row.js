// move-row.js (D454 part 3, pane E): install-only.test.js uses its own test() and ends with process.exit, so the D454 row appended after it
// never ran. Move the row (from its comment to the end of the file) to just before the summary line. Usage: node move-row.js <worktree>
'use strict';
const fs = require('fs'), path = require('path');
const f = path.join(process.argv[2], 'consonance/tools/install-only.test.js');
let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); s = s.split('\r\n').join('\n');
const startTag = "\n// D454 part 3 (pane E, P's cold read 1C.6 / 1B.3)";
const summary = "console.log(`\\n${pass} passed, ${fail} failed`);";
const i = s.indexOf(startTag), j = s.indexOf(summary);
if (i < 0 || j < 0 || i < j || s.split(startTag).length !== 2 || s.split(summary).length !== 2) throw new Error('anchors: row ' + i + ' summary ' + j);
const row = s.slice(i).replace(/\n+$/, '\n');
s = s.slice(0, i).replace(/\n*$/, '\n');
s = s.slice(0, j) + row.replace(/^\n/, '') + '\n' + s.slice(j);
fs.writeFileSync(f, crlf ? s.split('\n').join('\r\n') : s);
console.log('moved the row above the summary');

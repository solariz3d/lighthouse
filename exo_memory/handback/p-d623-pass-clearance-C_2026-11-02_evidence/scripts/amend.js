// amend.js <file> <from-file> <to-file>: replace one exact block (the text of <from-file>) with another (<to-file>) in <file>, exactly once; line endings kept
'use strict';
const fs = require('fs'), [, , F, A, B] = process.argv;
let s = fs.readFileSync(F, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
const a = fs.readFileSync(A, 'utf8').replace(/\r\n/g, '\n').replace(/\n$/, ''), b = fs.readFileSync(B, 'utf8').replace(/\r\n/g, '\n').replace(/\n$/, '');
const k = s.split(a).length - 1; if (k !== 1) throw new Error(`${F}: ${k} of the block`);
s = s.replace(a, () => b); fs.writeFileSync(F, crlf ? s.replace(/\n/g, '\r\n') : s); console.log('amended ' + F);

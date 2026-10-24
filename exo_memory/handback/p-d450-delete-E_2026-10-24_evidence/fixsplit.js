// fixsplit.js: replace the literal CR ? LF inside del.ps1's status split with the escaped regex text \r?\n
'use strict';
const fs = require('fs');
const f = 'C:/Users/nname/Downloads/t180-d450-e/del.ps1';
let s = fs.readFileSync(f, 'utf8');
const bad = "-split '" + String.fromCharCode(13) + '?' + String.fromCharCode(10) + "'";
const good = "-split '" + String.fromCharCode(92) + 'r?' + String.fromCharCode(92) + "n'";
const n = s.split(bad).length - 1;
if (n !== 1) throw new Error('found ' + n);
s = s.replace(bad, () => good);
fs.writeFileSync(f, s);
console.log('fixed');

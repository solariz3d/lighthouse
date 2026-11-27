// keycheck678r1.js (pane B, D678 ruling 1): counts hits of the reference key's names in the given files, never printing a name.
// The names are taken from the key's "- [Tn] = <name> (" lines: the name whole, and each of its parts of 4 letters or more split on _ and spaces,
// matched case-insensitively. Control: the key itself must hit. usage: node keycheck678r1.js <key> <file>...
'use strict';
const fs = require('fs');
const [key, ...files] = process.argv.slice(2);
const names = new Set();
for (const line of fs.readFileSync(key, 'utf8').split(/\r?\n/)) {
  const m = /^- \[T\d\] = ([^(]+?) \(/.exec(line); if (!m) continue;
  names.add(m[1].toLowerCase()); for (const p of m[1].split(/[_\s,]+/)) if (p.length >= 4) names.add(p.toLowerCase());
}
console.log(`names and parts read from the key: ${names.size}`);
let total = 0;
for (const f of [key, ...files]) {
  const s = fs.readFileSync(f, 'utf8').toLowerCase(); let n = 0;
  for (const nm of names) n += s.split(nm).length - 1;
  if (f !== key) total += n;
  console.log(`${f === key ? 'CONTROL (the key itself)' : f}: ${n} hit(s)`);
}
console.log(`HITS outside the key: ${total}`);

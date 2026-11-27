// redact.js: replaces each private track name with "<his track>" in every file under a folder, in place (copies only). Prints counts, never names. usage: node redact.js <names file> <dir>
'use strict';
const fs = require('fs'), path = require('path'); const [nf, dir] = process.argv.slice(2);
const names = fs.readFileSync(nf, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter((s) => s.length >= 3).sort((a, b) => b.length - a.length);
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
let total = 0;
for (const f of walk(dir)) {
  let s = fs.readFileSync(f, 'utf8'), n = 0;
  for (const x of names) {   // case-insensitive, by index: no regular expression, so no name needs escaping
    const lo = x.toLowerCase(); let i = s.toLowerCase().indexOf(lo);
    while (i >= 0) { s = s.slice(0, i) + '<his track>' + s.slice(i + x.length); n++; i = s.toLowerCase().indexOf(lo, i + '<his track>'.length); }
  }
  if (n) { fs.writeFileSync(f, s); console.log(`${path.basename(f)}: ${n} redacted`); total += n; }
}
console.log(`${total} redacted in all`);

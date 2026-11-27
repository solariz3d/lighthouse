// keywhere678r1.js (pane B): for each hit of a key name or part in the given files, prints the file, the line number, the hit's length, and up to 60 characters
// either side with the hit itself replaced by #, so no name is printed. usage: node keywhere678r1.js <key> <file>...
'use strict';
const fs = require('fs');
const [key, ...files] = process.argv.slice(2);
const names = new Set();
for (const line of fs.readFileSync(key, 'utf8').split(/\r?\n/)) {
  const m = /^- \[T\d\] = ([^(]+?) \(/.exec(line); if (!m) continue;
  names.add(m[1].toLowerCase()); for (const p of m[1].split(/[_\s,]+/)) if (p.length >= 4) names.add(p.toLowerCase());
}
for (const f of files) fs.readFileSync(f, 'utf8').split(/\r?\n/).forEach((line, i) => {
  const lo = line.toLowerCase();
  for (const nm of names) { let at = lo.indexOf(nm); while (at >= 0) {
    console.log(`${f.split(/[\\/]/).pop()}:${i + 1} (${nm.length} letters): ...${line.slice(Math.max(0, at - 60), at)}${'#'.repeat(nm.length)}${line.slice(at + nm.length, at + nm.length + 60)}...`);
    at = lo.indexOf(nm, at + 1); } }
});

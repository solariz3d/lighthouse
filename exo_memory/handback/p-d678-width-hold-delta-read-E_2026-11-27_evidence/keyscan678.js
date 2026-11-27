// keyscan678.js (pane E, D678 Track 2): counts other authors' track names (taken at run time from the key's "- [Tn] = <name>" lines, the name and its
// underscore-split parts of 5 letters or more, case-insensitive) in the files given; prints only counts, never a name or a match. The key itself is the control.
// usage: node keyscan678.js <keyFile> <file or dir> [...]
'use strict';
const fs = require('fs'), path = require('path');
const [KEY, ...targets] = process.argv.slice(2);
const names = new Set();
for (const line of fs.readFileSync(KEY, 'utf8').split(/\r?\n/)) { const m = line.match(/^- \[T\d\] = ([A-Za-z0-9_]+)/); if (!m) continue; names.add(m[1].toLowerCase()); for (const p of m[1].split('_')) if (p.length >= 5) names.add(p.toLowerCase()); }
const files = []; const walk = (p) => { const st = fs.statSync(p); if (st.isDirectory()) for (const f of fs.readdirSync(p)) walk(path.join(p, f)); else files.push(p); };
for (const t of targets) walk(t);
console.log(`names and parts read from the key: ${names.size}`);
let total = 0;
for (const f of [KEY, ...files]) { const s = fs.readFileSync(f, 'utf8').toLowerCase(); let n = 0; for (const nm of names) n += s.split(nm).length - 1; if (f !== KEY) total += n; if (n || f === KEY) console.log(`${f === KEY ? 'CONTROL (the key)' : path.basename(f)}: ${n}`); }
console.log(`files scanned ${files.length}, hits ${total}`);

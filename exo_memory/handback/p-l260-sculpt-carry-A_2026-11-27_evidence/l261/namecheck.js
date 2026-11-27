// namecheck.js: counts (never prints) hits of the private track names in every file under a folder. usage: node namecheck.js <names file> <dir>
'use strict';
const fs = require('fs'), path = require('path'); const [nf, dir] = process.argv.slice(2);
const names = fs.readFileSync(nf, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter((s) => s.length >= 3);
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
let total = 0; for (const f of walk(dir)) { const s = fs.readFileSync(f, 'utf8').toLowerCase(); let n = 0; for (const x of names) n += s.split(x.toLowerCase()).length - 1; if (n) console.log(`${path.basename(f)}: ${n} hit(s)`); total += n; }
console.log(`${names.length} names checked; ${total} hit(s) in all`);

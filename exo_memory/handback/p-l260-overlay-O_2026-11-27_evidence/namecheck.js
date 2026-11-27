// namecheck_l259.js (pane O, L259 track 5; from L250's namecheck.js): every installed track folder name, layout name and kn5 file stem (4+ characters,
// not the builder's own t180b_) against the files given (a folder is walked; a binary picture is skipped and listed). Prints per hit the file and the
// term's number; the term itself only to this terminal (TERMS=1), never to a file. Read only.
//   node namecheck_l259.js <file or folder> ...
'use strict';
const fs = require('fs'), path = require('path');
const AC = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';
const names = new Set();
for (const t of fs.readdirSync(AC)) {
  const td = path.join(AC, t); if (!fs.statSync(td).isDirectory()) continue; names.add(t);
  for (const f of fs.readdirSync(td)) {
    const m = /^models_(.*)\.ini$/i.exec(f); if (m) names.add(m[1]);
    if (/\.kn5$/i.test(f)) names.add(f.replace(/\.kn5$/i, ''));
    if (fs.existsSync(path.join(td, f, 'ai'))) names.add(f);
  }
  if (fs.existsSync(path.join(td, 'ui'))) for (const l of fs.readdirSync(path.join(td, 'ui'))) if (fs.statSync(path.join(td, 'ui', l)).isDirectory()) names.add(l);
}
const terms = [...names].filter((n) => n.length >= 4 && !/^t180b/i.test(n)).sort();
const files = [], skipped = [], walk = (d) => { const st = fs.statSync(d); if (!st.isDirectory()) { files.push(d); return; } for (const f of fs.readdirSync(d)) walk(path.join(d, f)); };
for (const a of process.argv.slice(2)) walk(a);
let hits = 0, read = 0;
for (const f of files) {
  if (/\.(png|jpe?g)$/i.test(f)) { skipped.push(path.basename(f)); continue; }
  const low = fs.readFileSync(f, 'latin1').toLowerCase(); read++;
  terms.forEach((t, i) => { if (low.includes(t.toLowerCase())) { hits++; console.log(`HIT ${f}: term #${i} (${t.length} chars)${process.env.TERMS ? ' = ' + t : ''}`); } });
}
console.log(`${terms.length} terms against ${read} files: ${hits} hits; pictures not read: ${skipped.length} (${skipped.join(', ')})`);

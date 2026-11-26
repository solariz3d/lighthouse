// namecheck_E.js <dir>: every installed track folder, layout and kn5 file name (4+ characters, stem) against every text file in <dir>, case-insensitive.
// Prints the hits' terms to THIS terminal only (to judge common words); the files are judged, the terms never written anywhere.
const fs = require('fs'), path = require('path');
const T = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';
const terms = new Set();
for (const t of fs.readdirSync(T)) { terms.add(t); const td = path.join(T, t); try { for (const e of fs.readdirSync(td, { withFileTypes: true })) { if (e.isDirectory()) terms.add(e.name); if (/\.kn5$/i.test(e.name)) terms.add(e.name.replace(/\.kn5$/i, '')); } } catch (e) { /* */ } try { for (const e of fs.readdirSync(path.join(td, 'ui'))) terms.add(e); } catch (e) { /* */ } }
const list = [...terms].map((x) => x.toLowerCase()).filter((x) => x.length >= 4);
const dir = process.argv[2]; let hits = 0;
for (const f of fs.readdirSync(dir)) {
  if (/\.png$/i.test(f)) continue;
  const text = fs.readFileSync(path.join(dir, f), 'latin1').toLowerCase();
  for (const term of list) { let i = text.indexOf(term), n = 0; while (i >= 0) { n++; i = text.indexOf(term, i + 1); } if (n) { hits += n; console.log(`${f}: "${term}" x${n}`); } }
}
console.log(`${list.length} terms, ${fs.readdirSync(dir).filter((f) => !/\.png$/i.test(f)).length} text files, ${hits} hits`);

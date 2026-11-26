// namecheck.js (pane O, L250): every installed track folder name, layout name and kn5 file stem (4+ characters, not the builder's own t180b_)
// against this lap's branch diff (with the new file), the hand-back, its evidence and the map line. Prints per hit the file and the term's number;
// the term itself only to this terminal (TERMS=1), never to a file. usage: node namecheck.js
'use strict';
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
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
const H = 'C:/Consonance/lighthouse/exo_memory/';
const files = [], walk = (d) => { if (!fs.existsSync(d)) return; for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : files.push(p); } };
walk(H + 'handback/p-l250-kn5-O_2026-11-26_evidence');
for (const f of [H + 'handback/p-l250-kn5-O_2026-11-26.md', H + 'map/O.md']) if (fs.existsSync(f)) files.push(f);
const wt = 'C:/Consonance/t180-wt-o-l250';
const texts = files.map((f) => [path.relative(H, f), fs.readFileSync(f, 'latin1')]);
texts.push(['branch diff from d0e4c78', execSync('git diff d0e4c78', { cwd: wt }).toString() + fs.readFileSync(path.join(wt, 'src-tauri/src/kn5road.rs'), 'utf8') + execSync('git log --format=%B d0e4c78..HEAD', { cwd: wt }).toString()]);
let hits = 0;
for (const [f, text] of texts) {
  const low = text.toLowerCase();
  terms.forEach((t, i) => { if (low.includes(t.toLowerCase())) { hits++; console.log(`HIT ${f}: term #${i} (${t.length} chars)${process.env.TERMS ? ' = ' + t : ''}`); } });
}
console.log(`${terms.length} terms against ${texts.length} texts: ${hits} hits`);

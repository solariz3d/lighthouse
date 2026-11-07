// classgrep.js: for each error class, the record lines since 2026-10-01 that show it HAPPENING. Reads exo_memory/{handback,librarian,journal,loop,map}
// (never third_place/), each file as bytes with NULs dropped (so map/B.md, which grep skips, is read too), keeping files dated 2026-10-01 or later
// by name, plus the map files whole; and lighthouse's git log since 2026-10-01. Prints per class: hit count and up to N "path:line: 110 chars".
// Terms from the private list are masked to [T<len>] before printing. READ-ONLY.
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const ROOT = 'C:/Users/nname/Desktop/lighthouse', EM = path.join(ROOT, 'exo_memory');
const terms = fs.readFileSync('C:/Consonance/private/d528/terms.txt', 'utf8').split(/\r?\n/).map((t) => t.trim()).filter(Boolean);
const mask = (s) => { for (const t of terms) { const re = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'); s = s.replace(re, (m) => '[T' + m.length + ']'); } return s; };
const N = Number(process.env.N || 4);
const CLASSES = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
function walk(d, out) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'third_place' && !e.name.endsWith('_evidence')) walk(p, out); } else if (e.name.endsWith('.md')) out.push(p); } return out; }
const files = [];
for (const sub of ['handback', 'librarian', 'journal', 'loop', 'map']) {
  for (const f of walk(path.join(EM, sub), [])) {
    const m = /(20\d\d-\d\d-\d\d)/.exec(path.basename(f));
    if (sub === 'map' || (m && m[1] >= '2026-10-01')) files.push(f);
  }
}
const docs = files.map((f) => ({ f: path.relative(ROOT, f).replace(/\\/g, '/'), lines: fs.readFileSync(f).toString('utf8').replace(/\0/g, '').split(/\r?\n/) }));
const log = execFileSync('git', ['-C', ROOT, 'log', '--since=2026-10-01', '--format=%h %cs %s'], { encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 26 }).split('\n');
docs.push({ f: 'git-log', lines: log });
console.log('files ' + files.length + ', git-log lines ' + log.length);
for (const [name, src] of Object.entries(CLASSES)) {
  const re = new RegExp(src, 'i'); const hits = [];
  for (const d of docs) d.lines.forEach((l, i) => { if (re.test(l)) hits.push(d.f + ':' + (i + 1) + ': ' + mask(l.trim()).slice(0, 110)); });
  console.log('\n## ' + name + ' — ' + hits.length);
  for (const h of hits.slice(-N)) console.log('  ' + h);
}

// outside.js (pane E, D303 part 3): B's §3 "outside git" search, with the unit's own registered phrases (q2-phrases.json).
//   node outside.js <q2-phrases.json> <id...>
// Searches seat memory (~/.claude/projects/*/memory/), ~/.consonance/ (.md only) and ~/.claude/CLAUDE.md, case-insensitive,
// literal. Third Place paths are skipped. Prints each hit as a ~-relative path with the line number; a hit there is recorded,
// never taken as proof it existed before t_err (B §3). Written in node because `grep -i -F` aborted in this shell.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const [file, ...ids] = process.argv.slice(2);
const H = os.homedir();
const roots = [];
for (const d of fs.readdirSync(path.join(H, '.claude', 'projects'))) {
  const m = path.join(H, '.claude', 'projects', d, 'memory');
  if (!/third/i.test(d) && fs.existsSync(m)) roots.push(m);
}
roots.push(path.join(H, '.consonance'));
const files = [path.join(H, '.claude', 'CLAUDE.md')];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (/third/i.test(e.name)) continue;
    if (e.isDirectory()) walk(p); else if (e.name.endsWith('.md')) files.push(p);
  }
};
roots.forEach(walk);
const text = new Map(files.filter((f) => fs.existsSync(f)).map((f) => [f, fs.readFileSync(f, 'utf8').split('\n')]));
const units = JSON.parse(fs.readFileSync(file, 'utf8')).units.filter((u) => ids.includes(u.id));
console.log(`searched ${text.size} .md files`);
for (const u of units) for (const p of u.phrases) {
  const hits = [];
  for (const [f, lines] of text) lines.forEach((l, i) => { if (l.toLowerCase().includes(p.toLowerCase())) hits.push(`~/${path.relative(H, f).replace(/\\/g, '/')}:${i + 1}`); });
  console.log(`${u.id} [${p}] ${hits.length}${hits.length ? ': ' + hits.slice(0, 6).join(' ') : ''}`);
}

// names.js: one read-only pass over lighthouse exo_memory (third_place excluded, never opened): which files name each non-worktree t180-* folder.
// A name counts only as a whole token (not followed by a letter, digit or '-'), so "t180-d403" does not count inside "t180-d403-base".
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = 'C:/Users/nname/Desktop/lighthouse/exo_memory';
const names = fs.readFileSync(path.join(__dirname, 'names.txt'), 'utf8').split('\n').filter(Boolean);
const hits = Object.fromEntries(names.map((n) => [n, []]));
let files = 0, skipped = 0;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const RX = names.map((n) => [n, new RegExp(esc(n) + '(?![A-Za-z0-9-])', 'i')]);
const stack = [ROOT];
while (stack.length) {
  const d = stack.pop();
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!(d === ROOT && e.name === 'third_place')) stack.push(p); continue; }
    const st = fs.statSync(p);
    if (st.size > 50 << 20 || /\.(png|jpg|wav|zip|kn5|bundle)$/i.test(e.name)) { skipped++; continue; }
    const t = fs.readFileSync(p, 'latin1'); files++;
    for (const [n, rx] of RX) if (t.includes(n.slice(0, 6)) && rx.test(t)) hits[n].push([st.mtimeMs, path.relative(ROOT, p).replace(/\\/g, '/')]);
  }
}
const out = names.map((n) => ({ name: n, count: hits[n].length, newest: (hits[n].sort((a, b) => b[0] - a[0])[0] || [0, ''])[1] }));
fs.writeFileSync(path.join(__dirname, 'names.json'), JSON.stringify(out, null, 1));
console.log(`files read ${files}, skipped ${skipped}`);
for (const o of out) console.log(`${o.name}|${o.count}|${o.newest}`);

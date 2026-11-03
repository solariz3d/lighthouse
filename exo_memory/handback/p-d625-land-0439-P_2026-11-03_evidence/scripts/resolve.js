// resolve.js <CHANGELOG.md>: one conflict block per call. Unreleased = theirs (the branch's new bullets) merged into ours' Unreleased;
// ours' released sections stay whole. Keeps every bullet; fails loudly on any shape it does not expect.
'use strict';
const fs = require('fs');
const f = process.argv[2]; let s = fs.readFileSync(f, 'utf8'); const nl = s.includes('\r\n') ? '\r\n' : '\n';
const re = /<<<<<<< [^\r\n]*\r?\n([\s\S]*?)=======\r?\n([\s\S]*?)>>>>>>> [^\r\n]*\r?\n/g;
const blocks = [...s.matchAll(re)]; if (blocks.length < 1) throw new Error('no conflict block');
s = s.replace(re, (all, ours, theirs) => {
  // ours may start with released sections ("## [x]") or with Unreleased bullets then released sections
  const i = ours.search(/^## \[\d/m); const oursUnrel = i < 0 ? ours : ours.slice(0, i), oursRel = i < 0 ? '' : ours.slice(i);
  if (/^## \[/m.test(theirs)) throw new Error('theirs carries a section heading: resolve by hand');
  // merge by ### heading: ours' unreleased groups, then theirs' bullets under the same heading
  const groups = (t) => { const m = new Map(); let h = null; for (const line of t.split(/\r?\n/)) { const g = /^### (.+)$/.exec(line); if (g) { h = g[1]; if (!m.has(h)) m.set(h, []); continue; } if (h === null) { if (line.trim()) throw new Error('text before a ### heading: ' + line.slice(0, 60)); continue; } m.get(h).push(line); } return m; };
  const a = groups(oursUnrel), b = groups(theirs);
  for (const [h, lines] of b) { if (!a.has(h)) a.set(h, []); a.get(h).push(...lines); }
  const order = ['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'];
  const out = [...a.keys()].sort((x, y) => order.indexOf(x) - order.indexOf(y)).map((h) => {
    const bullets = a.get(h).join('\n').split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
    return `### ${h}\n\n${bullets.join('\n\n')}\n`; }).join('\n');
  return (out ? out + '\n' : '') + oursRel.replace(/\r\n/g, '\n');
});
s = s.replace(/\r?\n/g, nl);
if (/^(<<<<<<<|=======|>>>>>>>)/m.test(s)) throw new Error('markers left');
fs.writeFileSync(f, s); console.log(`resolved ${blocks.length} block(s) in ${f}`);

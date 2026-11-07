// clmerge.js <commit>: CHANGELOG.md = HEAD's, with [Unreleased] holding HEAD's unreleased bullets updated and joined by <commit>'s,
// skipping any bullet already released in b497c5d's [0.4.37]; headings Added, Changed, Fixed. Run in the tree; CRLF/LF kept from HEAD.
'use strict';
const fs = require('fs'), cp = require('child_process');
const git = (a) => cp.execFileSync('git', a, { encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 26 });
const c = process.argv[2];
const head = git(['show', 'HEAD:CHANGELOG.md']), src = git(['show', c + ':CHANGELOG.md']), base = git(['show', 'b497c5d:CHANGELOG.md']);
const eol = head.includes('\r\n') ? '\r\n' : '\n';
const title = (b) => (b.match(/^- \*\*(.+?)\*\*/) || [])[1];
// the unreleased section of a file: { heading: [bullet text (may span lines)] }
function unrel(s) {
  const L = s.split(/\r?\n/), i0 = L.indexOf('## [Unreleased]'); let i1 = L.findIndex((l, i) => i > i0 && l.startsWith('## ['));
  const sec = {}; let h = null, cur = null;
  for (const l of L.slice(i0 + 1, i1)) {
    if (l.startsWith('### ')) { h = l.slice(4); sec[h] = sec[h] || []; cur = null; continue; }
    if (l.startsWith('- **')) { cur = [l]; sec[h].push(cur); continue; }
    if (l.trim() === '') { cur = null; continue; }
    if (cur) cur.push(l); else if (l.trim()) throw new Error('stray line in Unreleased: ' + l.slice(0, 60));
  }
  return { sec, i0, i1, L };
}
const released = new Set(); { const L = base.split(/\r?\n/), a = L.indexOf('## [0.4.37] - 2026-11-02'), b = L.findIndex((l, i) => i > a && l.startsWith('## [0.4.36]')); for (const l of L.slice(a, b)) { const t = title(l); if (t) released.add(t); } }
const H = unrel(head), S = unrel(src).sec, out = {};
for (const h of ['Added', 'Changed', 'Fixed']) {
  const s = (S[h] || []).filter((b) => !released.has(title(b[0]))), hs = (H.sec[h] || []);
  const t = new Set(s.map((b) => title(b[0])));
  out[h] = [...s, ...hs.filter((b) => !t.has(title(b[0])))];
}
for (const h of Object.keys(S).concat(Object.keys(H.sec))) if (!['Added', 'Changed', 'Fixed'].includes(h)) throw new Error('heading ' + h);
const body = [];
for (const h of ['Added', 'Changed', 'Fixed']) { if (!out[h].length) continue; body.push('', '### ' + h); for (const b of out[h]) body.push('', ...b); }
body.push('');
const L = H.L, res = [...L.slice(0, H.i0 + 1), ...body, ...L.slice(H.i1)];
fs.writeFileSync('CHANGELOG.md', res.join(eol));
console.log('CHANGELOG unreleased: ' + ['Added', 'Changed', 'Fixed'].map((h) => h + ' ' + out[h].map((b) => title(b[0]).slice(0, 30)).join(' | ')).join(' ; '));

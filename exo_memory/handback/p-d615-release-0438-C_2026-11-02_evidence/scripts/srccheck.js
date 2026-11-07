// srccheck.js: in the landing tree, for every file the range touches, HEAD vs its source (c2d3880 for its own file, else 71a8556):
// "same", or the lines that differ, each marked whether main's own change (f1f3416 -> b497c5d) accounts for it
'use strict';
const cp = require('child_process');
const git = (a) => { try { return cp.execFileSync('git', a, { encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 28 }); } catch (e) { return null; } };
const lines = (t) => (t === null ? [] : t.split(/\r?\n/));
const files = new Set(git(['diff', '--name-only', 'b497c5d', 'HEAD']).trim().split('\n').filter(Boolean));
const own = new Set(git(['diff', '--name-only', 'b497c5d', 'c2d3880']).trim().split('\n').filter(Boolean));
let same = 0;
for (const f of files) {
  const src = own.has(f) && f !== 'CHANGELOG.md' ? 'c2d3880' : '71a8556';
  const h = git(['show', 'HEAD:' + f]), s = git(['show', src + ':' + f]);
  if (h === s) { same++; continue; }
  const mOld = new Set(lines(git(['show', 'f1f3416:' + f]))), mNew = new Set(lines(git(['show', 'b497c5d:' + f])));
  const H = lines(h), S = lines(s), hs = new Set(H), ss = new Set(S);
  const plus = H.filter((l) => !ss.has(l)), minus = S.filter((l) => !hs.has(l));
  const p2 = plus.filter((l) => !mNew.has(l)), m2 = minus.filter((l) => !mOld.has(l));
  console.log(`${f} vs ${src}: +${plus.length} -${minus.length}; not main's own: +${p2.length} -${m2.length}`);
  for (const l of p2) console.log('   + ' + l.trim().slice(0, 150));
  for (const l of m2) console.log('   - ' + l.trim().slice(0, 150));
}
console.log(`${files.size} files; ${same} identical to their source`);

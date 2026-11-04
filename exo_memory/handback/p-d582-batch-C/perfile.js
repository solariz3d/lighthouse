// perfile.js <repo> <rev> <dir>...: per file, the decision numbers / room paths / seat words INSIDE COMMENTS (jsscan.comments), files with any only.
'use strict';
const path = require('path'), { execFileSync } = require('child_process');
const { comments } = require(path.join(__dirname, '..', 'd578', 'jsscan.js'));
const [, , repo, rev, ...dirs] = process.argv;
const K = [/\bD\d{2,4}[a-z]?\b/g, /exo_memory\/|docs\/research\//g, /\bpane [A-Z]\b|\bseat [A-Z]\b|librarian|\bthe chair\b|sibling-/gi];
const files = execFileSync('git', ['-C', repo, 'ls-tree', '-r', '--name-only', rev, '--', ...dirs], { encoding: 'utf8' }).trim().split('\n').filter((f) => /\.c?js$/.test(f));
let tot = [0, 0, 0];
for (const f of files) {
  const src = execFileSync('git', ['-C', repo, 'show', `${rev}:${f}`], { encoding: 'utf8', maxBuffer: 1 << 26 });
  const com = comments(src).map((c) => src.slice(c.start, c.end)).join('\n');
  const n = K.map((re) => (com.match(re) || []).length);
  if (n.some(Boolean)) { console.log(`${n.join('/')}\t${f}`); tot = tot.map((t, i) => t + n[i]); }
}
console.log(`total ${tot.join('/')} (D / paths / seats)`);

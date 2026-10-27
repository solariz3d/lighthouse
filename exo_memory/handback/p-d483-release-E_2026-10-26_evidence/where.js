// where.js (D483, pane E): where term N of the private list hits in a commit's added lines, with the term masked; and how often it is in a file at a base
'use strict';
const { execFileSync } = require('child_process');
const [termsFile, n, tree, commit, base, file] = process.argv.slice(2);
const t = require(termsFile)[+n], re = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
const d = execFileSync('git', ['show', '-m', '--format=', commit], { cwd: tree, encoding: 'utf8' });
let file0 = null;
for (const l of d.split('\n')) {
  if (l.startsWith('+++ ')) file0 = l.slice(4);
  else if (l.startsWith('+') && re.test(l)) { re.lastIndex = 0; console.log(`${file0}: "${l.slice(0, 60).replace(re, '<TERM>')}…" (term ${t.length} chars)`); }
  re.lastIndex = 0;
}
const before = execFileSync('git', ['show', `${base}:${file}`], { cwd: tree, encoding: 'utf8' });
console.log(`in ${base}:${file}: ${(before.match(re) || []).length} occurrence(s)`);

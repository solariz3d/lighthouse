// classify.js (C, D456 part 1b): every "keeper" (any case) in the tree at a worktree, classified by WHERE it sits, not by how its
// line starts: doc (a .md/.txt file), comment (inside // or /* */ in .js/.cjs/.rs, or /* */ and // in .html), string (inside a
// '…', "…" or `…` literal, or any .json value), or code. A small tokenizer: it tracks comment and string state across lines.
//   node classify.js <worktree> [--all]     prints the non-comment, non-doc hits (all hits with --all), and the totals
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const wt = process.argv[2], all = process.argv.includes('--all');
const files = spawnSync('git', ['-C', wt, 'grep', '-l', '-i', 'keeper'], { encoding: 'utf8' }).stdout.split(/\r?\n/).filter(Boolean);
const KEEP = /keeper/gi;
function states(src) {           // per char: 'c' code, 'm' comment, 's' string
  const st = new Array(src.length); let s = 'c', q = null;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i], nx = src[i + 1];
    if (s === 'c') {
      if (ch === '/' && nx === '/') { s = 'L'; st[i] = st[i + 1] = 'm'; i++; continue; }
      if (ch === '/' && nx === '*') { s = 'B'; st[i] = st[i + 1] = 'm'; i++; continue; }
      if (ch === "'" || ch === '"' || ch === '`') { s = 'S'; q = ch; st[i] = 's'; continue; }
      st[i] = 'c'; continue;
    }
    if (s === 'L') { st[i] = 'm'; if (ch === '\n') s = 'c'; continue; }
    if (s === 'B') { st[i] = 'm'; if (ch === '*' && nx === '/') { st[i + 1] = 'm'; i++; s = 'c'; } continue; }
    if (s === 'S') { st[i] = 's'; if (ch === '\\') { st[i + 1] = 's'; i++; continue; } if (ch === q) s = 'c'; else if (ch === '\n' && q !== '`') s = 'c'; continue; }
  }
  return st;
}
const tally = {}; const out = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(wt, f), 'utf8');
  const ext = path.extname(f).toLowerCase();
  const st = /\.(js|cjs|mjs|ts|rs|html|css)$/.test(ext) ? states(src) : null;
  let m; KEEP.lastIndex = 0;
  while ((m = KEEP.exec(src))) {
    const kind = /\.(md|txt)$/.test(ext) ? 'doc' : ext === '.json' ? 'string' : st ? ({ c: 'code', m: 'comment', s: 'string' })[st[m.index]] : 'other';
    tally[kind] = (tally[kind] || 0) + 1;
    const ln = src.slice(0, m.index).split('\n').length, line = src.split('\n')[ln - 1].replace(/\r$/, '');
    if (all || (kind !== 'doc' && kind !== 'comment')) out.push(`${kind.padEnd(7)} ${f}:${ln}: ${line.trim().slice(0, 200)}`);
  }
}
for (const l of out) console.log(l);
console.log(`occurrences by kind: ${JSON.stringify(tally)}; files ${files.length}`);

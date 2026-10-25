// filt1b.js (C, D456 part 1b): the comment filter on `git diff <old> <new>`, by position, not by line start.
// For every changed file, both versions are tokenized (code / comment / string, the classify.js tokenizer); .md/.txt are doc.
//   A  "drops comment and doc": the text with comments removed, old vs new; each line that still differs is listed
//   B  "drops comments, doc and string contents": what is left is code tokens alone; each line that still differs is listed
//      (a code change: an identifier, a keyword, a number). A reword of comments and strings must leave B at 0.
//   node filt1b.js <old> <new>
'use strict';
const { spawnSync } = require('child_process');
const repo = 'C:/Users/nname/Downloads/t180-track-builder';
const [oldRev, newRev] = process.argv.slice(2);
const git = (...a) => { const r = spawnSync('git', ['-C', repo, ...a], { maxBuffer: 1 << 30 }); if (r.status !== 0) throw new Error(r.stderr.toString()); return r.stdout.toString('latin1'); };
function strip(src, dropStrings) {   // comments become nothing (newlines kept), string contents become nothing if asked
  let o = '', s = 'c', q = null;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i], nx = src[i + 1];
    if (s === 'c') {
      if (ch === '/' && nx === '/') { s = 'L'; i++; continue; }
      if (ch === '/' && nx === '*') { s = 'B'; i++; continue; }
      if (ch === "'" || ch === '"' || ch === '`') { s = 'S'; q = ch; o += ch; continue; }
      o += ch; continue;
    }
    if (s === 'L') { if (ch === '\n') { s = 'c'; o += ch; } continue; }
    if (s === 'B') { if (ch === '\n') o += ch; if (ch === '*' && nx === '/') { i++; s = 'c'; } continue; }
    if (s === 'S') {
      if (ch === '\\') { if (!dropStrings) o += ch + (nx || ''); i++; continue; }
      if (ch === q || (ch === '\n' && q !== '`')) { s = 'c'; o += ch; continue; }
      if (!dropStrings || ch === '\n') o += ch;
    }
  }
  return o;
}
const files = git('diff', '--name-only', '--no-renames', oldRev, newRev).split('\n').filter(Boolean);
const A = [], B = []; let doc = 0;
for (const f of files) {
  if (/\.(md|txt)$/i.test(f)) { doc++; continue; }
  const show = (r) => { const x = spawnSync('git', ['-C', repo, 'show', `${r}:${f}`], { maxBuffer: 1 << 30 }); return x.status === 0 ? x.stdout.toString('latin1') : ''; };
  const a = show(oldRev), b = show(newRev);
  for (const [list, drop] of [[A, false], [B, true]]) {
    const x = strip(a, drop).split('\n'), y = strip(b, drop).split('\n');
    if (x.length !== y.length) { list.push(`${f}: line count ${x.length} -> ${y.length}`); continue; }
    for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) list.push(`${f}:${i + 1}: ${b.split('\n')[i].trim().slice(0, 170)}`);
  }
}
console.log(`git diff ${oldRev} ${newRev}: ${files.length} files (${doc} .md/.txt doc, ${files.length - doc} code or data files)`);
console.log(`A, left after dropping comment and doc lines: ${A.length} lines`);
for (const l of A) console.log(`   A ${l}`);
console.log(`B, left after dropping comments, doc and string contents (code tokens alone): ${B.length} lines`);
for (const l of B) console.log(`   B ${l}`);

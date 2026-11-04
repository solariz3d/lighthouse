// usage: node pairing.js <deference-unit.out> <board.jsonl> [since]
// For each selected case from `since`: the user rows of the same pane strictly between its LEVER and its FOLD (board line numbers, the
// tool's own counter). A case with any is one whose fold answers a LATER message than the lever it was credited to: the tool's comment
// says the fold must come "before any later user row is answered", and its loop skips user rows instead of stopping at them.
'use strict';
const fs = require('fs');
const [OUT, BOARD, SINCE = '2026-11-01'] = process.argv.slice(2);
const cases = [];
for (const l of fs.readFileSync(OUT, 'utf8').split(/\r?\n/)) {
  const m = l.match(/^— (\w+)\s+CLAIM (\S+ \S+) line (\d+)\s+LEVER (\S+ \S+) line (\d+)\s+FOLD (\S+ \S+) line (\d+)/);
  if (m && m[4] >= SINCE) cases.push({ pane: m[1], lever: +m[5], fold: +m[7] });
}
const lo = Math.min(...cases.map((c) => c.lever)), hi = Math.max(...cases.map((c) => c.fold));
const users = [];
let line = 0;
require('C:/Users/nname/Desktop/worktrees/lh-d630-e/consonance/tools/sourced.js').eachLine(BOARD, (l) => {
  if (!l) return; line++;
  if (line <= lo || line >= hi) return;
  let r; try { r = JSON.parse(l); } catch (_) { return; }
  if (r.role === 'user') users.push({ line, pane: String(r.pane || '') });
});
let mis = 0;
cases.forEach((c, i) => {
  const between = users.filter((u) => u.line > c.lever && u.line < c.fold && u.pane.startsWith(c.pane)).map((u) => u.line);
  if (between.length) mis++;
  console.log(`case ${i + 1}\tlever ${c.lever}\tfold ${c.fold}\t${between.length ? 'LATER USER ROWS ' + between.join(' ') : 'direct'}`);
});
console.log(`cases ${cases.length}, folds that answer a later message ${mis}`);

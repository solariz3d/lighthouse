// applied.js (pane B, L258 F1): does every mutant's string still occur EXACTLY once in the tree? Reads the harness as TEXT (its one-line string consts and its
// MUTANTS literal, evaluated alone), never requires it, so no test runs. A file path is tried as written, then under src/. usage: node applied.js <tree> <harness>...
'use strict';
const fs = require('fs'), path = require('path');
const [tree, ...harnesses] = process.argv.slice(2);
for (const h of harnesses) {
  const src = fs.readFileSync(path.join(tree, h), 'utf8').replace(/\r\n/g, '\n');
  const consts = src.split('\n').filter((l) => /^const [A-Z][A-Z0-9_]* = '[^']*'(, [A-Z][A-Z0-9_]* = '[^']*')*;$/.test(l)).join('\n');
  const a = src.indexOf('const MUTANTS = ['), b = src.indexOf('\n];', a);
  const M = new Function(`${consts}\nreturn ${src.slice(a + 'const MUTANTS = '.length, b + 2)};`)();
  let edits = 0, once = 0; const bad = [];
  for (const m of M) for (const [f, from] of m.edits) {
    edits++;
    const p = [path.join(tree, f), path.join(tree, 'src', f)].find((x) => fs.existsSync(x));
    const n = p ? fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n').split(from).length - 1 : -1;
    if (n === 1) once++; else bad.push(`${m.id.split(' ')[0]} (${n === -1 ? 'no file ' + f : n + ' times'})`);
  }
  console.log(`${h}: mutants ${M.length}, edits ${edits}, applied once ${once}, not ${bad.length}${bad.length ? ': ' + bad.join(', ') : ''}`);
}

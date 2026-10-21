'use strict';
// D421c seam tries (O): each mutant breaks one property of the release's try order; app/test/sculpt-tools.test.js must go red on every one. Applied to a copy of the
// tree's file, run, restored. Reports applied / caught / NOT APPLIED.   node stepcache-mutants.js <tree>
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = process.argv[2];
const M = [
  ['S1 no seam tries (the window, then the whole lap)', 'app/core/coreshell.js', 'const tries = [win, withSeam(lastR), withSeam(lastR, firstR)]', 'const tries = [win]'],
  ['S2 the last piece only, never the first', 'app/core/coreshell.js', 'const tries = [win, withSeam(lastR), withSeam(lastR, firstR)]', 'const tries = [win, withSeam(lastR)]'],
  ['S3 the first piece tried before the last', 'app/core/coreshell.js', 'const tries = [win, withSeam(lastR), withSeam(lastR, firstR)]', 'const tries = [win, withSeam(firstR), withSeam(lastR, firstR)]'],
  ['S4 a repeated try is run again', 'app/core/coreshell.js', '.filter((w, k, all) => !k || w.length !== all[k - 1].length)', ''],
  ['S5 the whole lap protects the last try, not the window', 'app/core/coreshell.js', 'runCloseJob({ doc: open, whole: true, edited: win })', 'runCloseJob({ doc: open, whole: true, edited: tries[tries.length - 1] })'],
  ['S6 the seam piece is the last PIECE of the lap, not its last road piece', 'app/core/coreshell.js', 'lastR = road[road.length - 1]', 'lastR = open.pieces.length - 1'],
];
let applied = 0, caught = 0, na = 0;
for (const [name, file, from, to] of M) {
  const f = path.join(TREE, file), src = fs.readFileSync(f, 'utf8');
  if (src.split(from).length !== 2) { na++; console.log(`NOT APPLIED  ${name}`); continue; }
  applied++; fs.writeFileSync(f, src.replace(from, to));
  try { const r = spawnSync(process.execPath, ['--test', 'app/test/sculpt-tools.test.js'], { cwd: TREE, encoding: 'utf8' }); const red = r.status !== 0; if (red) caught++; console.log(`${red ? 'caught      ' : 'SURVIVED    '} ${name}`); }
  finally { fs.writeFileSync(f, src); }
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${na}`);

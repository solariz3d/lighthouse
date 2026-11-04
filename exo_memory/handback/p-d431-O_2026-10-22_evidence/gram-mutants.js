'use strict';
// D431 (O): each mutant breaks one property of the windowed close's metric (close.js gramMetric); test/core_close_joint.test.js and core_close_local.test.js
// must go red on every one. Applied to the tree's file, run, restored. Reports applied / caught / NOT APPLIED.   node gram-mutants.js <tree>
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = process.argv[2];
const M = [
  ['G1 the windowed close takes the plain step (no Gram metric)', 'src/core/close.js', 'const winvRow = local ? gramMetric(doc, expand, cols) : null;', 'const winvRow = null;'],
  ['G2 the slope of the change is not counted (GRAM_ELL_M 0)', 'src/core/close.js', 'GRAM_EPS = 1e-9, GRAM_ELL_M = 50;', 'GRAM_EPS = 1e-9, GRAM_ELL_M = 0;'],
  ['G3 the plain norm swamps the metric (GRAM_EPS 1e3)', 'src/core/close.js', 'GRAM_EPS = 1e-9, GRAM_ELL_M = 50;', 'GRAM_EPS = 1e3, GRAM_ELL_M = 50;'],
  ['G4 a linked point counts only its first term', 'src/core/close.js', 'for (const [c, k] of e[i]) if (at.has(c)) {', 'for (const [c, k] of e[i].slice(0, 1)) if (at.has(c)) {'],
  ['G5 the value term dropped (only the slope counts)', 'src/core/close.js', 'const ent = [...row]; for (const [x, vx] of ent) for (const [y, vy] of ent) W[x][y] += w * vx * vy;', 'const ent = [];'],
];
let applied = 0, caught = 0, na = 0;
for (const [name, file, from, to] of M) {
  const f = path.join(TREE, file), src = fs.readFileSync(f, 'utf8');
  if (src.split(from).length !== 2) { na++; console.log(`NOT APPLIED  ${name}`); continue; }
  applied++; fs.writeFileSync(f, src.replace(from, to));
  try {
    const r = spawnSync(process.execPath, ['--test', 'test/core_close_joint.test.js', 'test/core_close_local.test.js'], { cwd: TREE, encoding: 'utf8' });
    const red = r.status !== 0; if (red) caught++;
    const failed = (r.stdout.match(/^not ok \d+ - .*$/gm) || []).map((l) => l.replace(/^not ok \d+ - /, '').slice(0, 40));
    console.log(`${red ? 'caught      ' : 'SURVIVED    '} ${name}${red ? `  (${failed.join(' | ')})` : ''}`);
  } finally { fs.writeFileSync(f, src); }
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${na}`);

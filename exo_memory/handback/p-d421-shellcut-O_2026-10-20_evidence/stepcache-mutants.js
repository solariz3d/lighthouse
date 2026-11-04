'use strict';
// D421 shell cut (O): each mutant breaks one property of the two kept answers; test/core_stepcache.test.js must go red on every one. Applied to a copy of the
// tree's file, run, restored. Reports applied / caught / NOT APPLIED.   node stepcache-mutants.js <tree>
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = process.argv[2];
const M = [
  ['K1 ratio key forgets r', 'src/core/sculpt.js', '`${ch}|${keyNum(s0)}|${keyNum(r)}`', '`${ch}|${keyNum(s0)}`'],
  ['K2 ratio key forgets s0', 'src/core/sculpt.js', '`${ch}|${keyNum(s0)}|${keyNum(r)}`', '`${ch}|${keyNum(r)}`'],
  ['K3 ratio kept for an unfrozen document', 'src/core/sculpt.js', 'Object.isFrozen(doc) && doc.pieces.every(Object.isFrozen) ? (RATIO', 'true ? (RATIO'],
  ['K4 fractions handed out shared', 'src/geom/profile.js', 'if (hit) return hit.slice();', 'if (hit) return hit;'],
  ['K5 fractions key forgets the options', 'src/geom/profile.js', '[keyNum(maxAcross), keyNum(maxSeam), ...ps', '[...ps'],
  ['K6 fractions key forgets u', 'src/geom/profile.js', '`${p.u.map(keyNum).join(\',\')};${p.psi', '`${p.psi'],
  ['K7 fractions key forgets psi', 'src/geom/profile.js', ';${p.psi.map(keyNum).join(\',\')}`', '`'],
];
let applied = 0, caught = 0, na = 0;
for (const [name, file, from, to] of M) {
  const f = path.join(TREE, file), src = fs.readFileSync(f, 'utf8');
  if (src.split(from).length !== 2) { na++; console.log(`NOT APPLIED  ${name}`); continue; }
  applied++; fs.writeFileSync(f, src.replace(from, to));
  try { const r = spawnSync(process.execPath, ['--test', 'test/core_stepcache.test.js'], { cwd: TREE, encoding: 'utf8' }); const red = r.status !== 0; if (red) caught++; console.log(`${red ? 'caught      ' : 'SURVIVED    '} ${name}`); }
  finally { fs.writeFileSync(f, src); }
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${na}`);

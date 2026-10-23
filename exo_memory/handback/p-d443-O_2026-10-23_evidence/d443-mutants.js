'use strict';
// D443 (O): each mutant breaks one property of the lean rule 1 reads (finish.js closerLoad, D440 and D443). test/core_finish_joints + core_finish_bank +
// core_finish must go red on each. Applied to the tree's file, run, restored (also on exit). Under the heavy-run lock. Reports applied / caught / NOT APPLIED.
//   node d443-mutants.js <tree> [mutant id prefix,...]
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = path.resolve(process.argv[2]), ONLY = process.argv[3] ? process.argv[3].split(',') : null, FILE = 'src/core/finish.js';
require(path.join(__dirname, '..', '..', '..', 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'd443-mutants (finish.js mutated in turn: do not read this tree meanwhile)', tree: TREE });
const M = [
  ['P1 the 3-D read back in closerLoad (a crest under a bend counts as out)', 'const kh = Math.hypot(k[0], k[2]); if (kh < 1 / 600) continue;   // the horizontal turn (D443)\n    curved++; if (Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[2] * k[2]) / kh)))', 'const kh = Math.hypot(k[0], k[1], k[2]); if (kh < 1 / 600) continue;\n    curved++; if (Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[1] * k[1] + q.U[2] * k[2]) / kh)))'],
  ['P2 curved judged by the 3-D curvature (the lean still horizontal)', 'const kh = Math.hypot(k[0], k[2]); if (kh < 1 / 600) continue;', 'const kh = Math.hypot(k[0], k[2]); if (Math.hypot(k[0], k[1], k[2]) < 1 / 600) continue;'],
  ['N1 a closer leaning out is taken (the check removed)', 'if (load.out > 0) {', 'if (false) {'],
  ['N2 the lean read the wrong way (a lean INTO the curve counted as out)', '< -LEAN_OUT_DEG * DEG) out++;', '> LEAN_OUT_DEG * DEG) out++;'],
  ['N3 the bar at 90 degrees (nothing ever leans out)', 'const LEAN_OUT_DEG = 5;', 'const LEAN_OUT_DEG = 90;'],
  ['N4 straights read for lean too (no curvature filter)', 'if (kh < 1 / 600) continue;', 'if (kh < 0) continue;'],
].filter(([n]) => !ONLY || ONLY.some((o) => n.startsWith(o + ' ')));
let applied = 0, caught = 0, na = 0;
const f = path.join(TREE, FILE), src = fs.readFileSync(f, 'utf8');
process.on('exit', () => fs.writeFileSync(f, src));
for (const [name, from, to] of M) {
  const norm = src.replace(/\r\n/g, '\n');
  if (norm.split(from).length !== 2) { na++; console.log(`NOT APPLIED  ${name}`); continue; }
  applied++; const out = norm.replace(from, to); fs.writeFileSync(f, src.includes('\r\n') ? out.replace(/\n/g, '\r\n') : out);
  try {
    const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'test/core_finish_joints.test.js', 'test/core_finish_bank.test.js', 'test/core_finish.test.js'], { cwd: TREE, encoding: 'utf8', timeout: 30 * 60 * 1000 });
    const red = r.status !== 0; if (red) caught++;
    const failed = [...new Set((r.stdout.match(/^\s*not ok \d+ - row \d+[^\n]{0,40}/gm) || []).map((l) => l.trim().replace(/^not ok \d+ - /, '')))];
    console.log(`${red ? 'caught      ' : 'SURVIVED    '} ${name}${red ? `  (${failed.join('; ') || 'status ' + r.status})` : ''}`);
  } finally { fs.writeFileSync(f, src); }
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${na}`);

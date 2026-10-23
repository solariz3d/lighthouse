'use strict';
// D440 (O): each mutant breaks one property of D440's change to finish.js (a closer leaning out of its curves is never taken; refused by name when every one
// does). test/core_finish_joints + core_finish_bank + core_finish must go red on each. Applied to the tree's file, run, restored (also on exit). Under the
// heavy-run lock. Reports applied / caught / NOT APPLIED.   node d440-mutants.js <tree> [mutant id prefix,...]
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = path.resolve(process.argv[2]), ONLY = process.argv[3] ? process.argv[3].split(',') : null, FILE = 'src/core/finish.js';
require(path.join(__dirname, '..', '..', '..', 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'd440-mutants (finish.js mutated in turn: do not read this tree meanwhile)', tree: TREE });
const M = [
  ['N1 a closer leaning out is taken (the check removed)', 'if (load.out > 0) {', 'if (false) {'],
  ['N2 the lean read the wrong way (a lean INTO the curve counted as out)', '< -LEAN_OUT_DEG * DEG) out++;', '> LEAN_OUT_DEG * DEG) out++;'],
  ['N3 the bar at 90 degrees (nothing ever leans out)', 'const LEAN_OUT_DEG = 5;', 'const LEAN_OUT_DEG = 90;'],
  ['N4 straights read for lean too (no curvature filter)', 'if (km < 1 / 600) continue;', 'if (km < 0) continue;'],
  ['N5 the refusal never thrown (falls through to the old refusals)', '  if (leanOut) throw new D.CoreError(', '  if (false) throw new D.CoreError('],
  ['N6 the least leaning-out route not kept for the refusal', 'if (!out || load.out < out.out) out = { ...load, word: r.word, radiusM: r.radiusM };', ''],
  ['H1 a refusal in the second order throws the first order\'s closer away (the try removed)', "try { out = search(mode, roll); } catch (err) { if (err.name === 'CoreError' && found.length) break; throw err; }", 'out = search(mode, roll);'],
  ['H2 FINISH_ROLL in the second order throws the first order\'s closer away', '        if (round >= ROLL_ROUNDS && found.length) break;   // D440 (h)', ''],
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

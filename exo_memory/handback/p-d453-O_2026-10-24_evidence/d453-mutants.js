'use strict';
// D453 (O): each mutant breaks one property of the track model's reuse after a Close that adds road (app/preview/trackmodel.js keptFrom and its gate). The named
// test files must go red on each, by a failing test (not an exit status). Applied to the file, run, restored (also on exit), under a heavy-run slot; each run's raw TAP is
// kept beside the verdict (MUTANT_TAP_DIR, default ./mutant-taps-d453). Reports applied / caught / NOT APPLIED.   node d453-mutants.js <tree>
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = path.resolve(process.argv[2]), FILE = 'app/preview/trackmodel.js', TAPS = path.resolve(process.env.MUTANT_TAP_DIR || path.join(__dirname, 'mutant-taps-d453'));
fs.mkdirSync(TAPS, { recursive: true });
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'd453-mutants (trackmodel.js mutated in turn: do not read this tree meanwhile)', tree: TREE });
const M = [
  ['M1 the prefix rule back (every placed segment unchanged, or none kept)', "if (was.keys.length > nk.length) return 0; let g = 0; for (let j = 0; j < was.keys.length; j++) if (was.keys[j] === nk[j] && was.liftKeys[j] === lk[j]) g++; return g;", "let g = 0; while (g < was.keys.length && g < nk.length && was.keys[g] === nk[g] && was.liftKeys[g] === lk[g]) g++; return g === was.keys.length ? g : 0;"],
  ['M2 the lift key not compared (a lifted segment counted as kept)', "if (was.keys[j] === nk[j] && was.liftKeys[j] === lk[j]) g++;", "if (was.keys[j] === nk[j]) g++;"],
  ['M3 the shorter-track guard dropped', "if (was.keys.length > nk.length) return 0; ", ''],
];
const FILES = ['app/test/preview-close-reuse.test.js', 'app/test/preview-speed.test.js', 'app/test/sculpt-release.test.js', 'app/test/cheap-ghost.test.js', 'app/test/preview.test.js'];
const src = fs.readFileSync(path.join(TREE, FILE), 'utf8'); process.on('exit', () => fs.writeFileSync(path.join(TREE, FILE), src));
let applied = 0, caught = 0, na = 0;
for (const [name, from, to] of M) {
  if (src.split(from).length !== 2) { na++; console.log(`NOT APPLIED  ${name}`); continue; }
  applied++; fs.writeFileSync(path.join(TREE, FILE), src.replace(from, to));
  try {
    const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...FILES], { cwd: TREE, encoding: 'utf8', maxBuffer: 1 << 28, timeout: 30 * 60 * 1000 });
    const tap = path.join(TAPS, `${name.split(' ')[0]}.tap`); fs.writeFileSync(tap, `# ${name}\n# exit ${r.status}\n${r.stdout}\n# stderr\n${r.stderr}`);
    const failed = [...new Set((r.stdout.match(/^\s*not ok \d+ - [^\n]{0,70}/gm) || []).map((l) => l.trim().replace(/^not ok \d+ - /, '')).filter((n) => !/\.test\.js$/.test(n)))];   // a test, not a file that died
    if (failed.length) caught++; else if (r.status !== 0) console.log(`  (exit ${r.status} with no failing test: not counted; ${(r.stdout.match(/^not ok \d+ - [^\n]{0,80}/gm) || ['none printed']).join(' | ')})`);
    console.log(`${failed.length ? 'caught      ' : 'SURVIVED    '} ${name}${failed.length ? `  (${failed.join('; ')})` : ''}  [tap: ${path.basename(tap)}]`);
  } finally { fs.writeFileSync(path.join(TREE, FILE), src); }
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${na}`);

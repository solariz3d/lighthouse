'use strict';
// D447 (O): each mutant breaks one property of the closed lap's bank (finish.js bankLap, bankPlan's relaxed joints, and closejob.js's hook). The tests below must go
// red on each. Applied to the file, run, restored (also on exit). Under the heavy-run lock. Reports applied / caught / NOT APPLIED.
//   node d447-mutants.js <tree> [mutant id prefix,...]
// Each mutant's raw TAP is written to MUTANT_TAP_DIR (default ./mutant-taps beside this file), one file per mutant id, named on its verdict line (D451).
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = path.resolve(process.argv[2]), ONLY = process.argv[3] ? process.argv[3].split(',') : null, FILE = 'src/core/finish.js';
const TAPS = path.resolve(process.env.MUTANT_TAP_DIR || path.join(__dirname, 'mutant-taps')); fs.mkdirSync(TAPS, { recursive: true });
require(path.join(__dirname, '..', '..', '..', 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'd447-mutants (finish.js / closejob.js mutated in turn: do not read this tree meanwhile)', tree: TREE });
const M = [
  ['Q1 bank only the window (the closed lap is not banked: today)', 'function bankLapRun(doc) {\n  if (!doc.closed', 'function bankLapRun(doc) {\n  return { doc }; if (!doc.closed'],
  ['Q2 bank a hand-banked piece (every road piece banked, upright or not)', ' && P.channels.phi.every((ph) => Math.abs(ph - upright) <= ROLL_FREE)) flat.push(p);', ') flat.push(p);'],
  ['Q3 drop the pin next to a straight (a joint relaxed whether or not both pieces curve)', 'uprightSet.has(p) && curved(p - 1) && curved(p);', 'uprightSet.has(p);'],
  ['Q4 no joint relaxed (every joint pinned, as Finish pins its own)', 'uprightSet, relax, { flips: pins', 'uprightSet, () => false, { flips: pins'],
  ['Q7 no lean-out guard at all (no flip pins, no descent pins, no withhold)', [['pins = [...fl]', 'pins = []'], ['const late = fl.gaps.filter(', 'const late = [].filter('], ['if (!worse.length) return { doc: freeze(res)', 'if (true) return { doc: freeze(res)']], null],
  ['F1 no flip pins from the bound (the descent pins and the withhold alone)', 'pins = [...fl]', 'pins = []'],
  ['Y1 turning read as |kh| over 1/600 again (a gentle link banked but not seen as turning)', 'if (!(bankDeg > LEAN_OUT_DEG)) continue;', 'if (!(Math.abs(k) > CURVED_KH)) continue;'],
  ['Y2 a fixed 60 m in place of the bank\'s roll-off distance', 'b - a <= (held(last.run, a) - LEAN_OUT_DEG) / rate + 2 * FLIP_STEP_M', 'b - a <= 60'],
  ['Y3 the bound from the last turning sample\'s share, not the bank the roll can still hold', 'b - a <= (held(last.run, a) - LEAN_OUT_DEG)', 'b - a <= (last.run[last.run.length - 1][1] - LEAN_OUT_DEG)'],
  ['Y4 the bound from the stretch\'s peak share, no fall (f2459fe)', 'e = Math.max(e, run[i][1] - f);', 'e = Math.max(e, run[i][1]);'],
  ['D1 no descent pins (the plan\'s own descent not read: the bound alone)', 'const late = fl.gaps.filter(', 'const late = [].filter('],
  ['YD a fixed 60 m and no descent pins (Y2 with D1: what the descent pins cover of Y2)', [['b - a <= (held(last.run, a) - LEAN_OUT_DEG) / rate + 2 * FLIP_STEP_M', 'b - a <= 60'], ['const late = fl.gaps.filter(', 'const late = [].filter(']], null],
  ['V1 a run turns without a curved sample (05cdb9d: the Bloss fit\'s rings read as flips)', [['if (R.curvedAt === null) continue;', ''], ['b = R.curvedAt;', 'b = R.curvedAt === null ? R.run[0][0] : R.curvedAt;']], null],
  ['V2 the gap measured to the far run\'s first turning sample, not its first curved one (P\'s variant 1)', 'b = R.curvedAt;', 'b = R.run[0][0];'],
  ['X3 the roll rate not scaled past the amber (the share alone)', ' rollScale *= (allowed / peak) * 0.97;', ''],
  ['X4 the press says nothing when no curve is banked', 'B.none ? ', 'false ? ', 'app/core/closejob.js'],
  ['X5 the flip pins without their nearest point either side', 'for (let k = Math.max(0, lo); k <= (hi < 0 ? seq.length - 1 : hi); k++)', 'for (let k = lo + 1; k < (hi < 0 ? seq.length : hi); k++)'],
  ['Q8 no amber backstop (the share never scaled down)', 'if (peak <= allowed) { res = cand; outAfter', 'if (true) { res = cand; outAfter'],
  ['Q5 the road beside a pit lane banked', '!lane.has(p) && ', ''],
  ['Q6 tubes banked', "P.type === 'road' && !P.tube && !lane", "P.type === 'road' && !lane"],
  ['W1 no per-piece withhold (the flip pins alone)', 'if (!worse.length) return { doc: freeze(res)', 'if (true) return { doc: freeze(res)'],
  ['R1 the press says nothing of the bank held back', 'const bankNote = [', 'const bankNote = false && [', 'app/core/closejob.js'],
  ['Q9 the Close press does not bank (the hook removed)', 'res = { ...res, doc: B.doc, bankNote };', 'res = { ...res, bankNote };', 'app/core/closejob.js'],
  ['Q10 a piece banked whether or not it is level (a loop, its way in and out)', 'const lap = flat.filter((p) => level(doc.pieces[p]));', 'const lap = flat;'],
].filter(([n]) => !ONLY || ONLY.some((o) => n.startsWith(o + ' ')));
let applied = 0, caught = 0, na = 0;
const SRC = {}; for (const [, , , file = FILE] of M) SRC[file] = SRC[file] || fs.readFileSync(path.join(TREE, file), 'utf8');
process.on('exit', () => { for (const [file, text] of Object.entries(SRC)) fs.writeFileSync(path.join(TREE, file), text); });
for (const [name, from, to, file = FILE] of M) {
  const f = path.join(TREE, file), src = SRC[file];
  const norm = src.replace(/\r\n/g, '\n');
  const edits = Array.isArray(from) ? from : [[from, to]];   // a mutant of several edits gives them as [[from, to], ...]
  if (edits.some(([a]) => norm.split(a).length !== 2)) { na++; console.log(`NOT APPLIED  ${name}`); continue; }
  applied++; const out = edits.reduce((t, [a, b]) => t.replace(a, b), norm); fs.writeFileSync(f, src.includes('\r\n') ? out.replace(/\n/g, '\r\n') : out);
  try {
    const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'test/core_close_banks_lap.test.js', 'test/core_finish_bank.test.js', 'test/core_finish.test.js'], { cwd: TREE, encoding: 'utf8', timeout: 30 * 60 * 1000 });
    // caught only when a named row fails: a non-zero exit with no failing row (a load-bound timing test elsewhere; X4's first run) is not a catch
    const failed = [...new Set((r.stdout.match(/^\s*not ok \d+ - row \d+[^\n]{0,40}/gm) || []).map((l) => l.trim().replace(/^not ok \d+ - /, '')))];
    // D451 (P's review §9.4, the D411 finding): the raw TAP is kept beside the verdict, so a verdict can be checked against what the run printed
    const tap = path.join(TAPS, `${name.split(' ')[0]}.tap`); fs.writeFileSync(tap, `# ${name}\n# exit ${r.status}${r.signal ? ' signal ' + r.signal : ''}${r.error ? ' error ' + r.error.message : ''}\n${r.stdout}\n# stderr\n${r.stderr}`);
    const red = failed.length > 0; if (red) caught++;
    else if (r.status !== 0) console.log(`  (the run exited ${r.status} with no failing row: not counted as caught; its failing tests: ${(r.stdout.match(/^\s*not ok \d+ - [^\n]{0,80}/gm) || ['none printed']).map((l) => l.trim()).join(' | ')})`);
    console.log(`${red ? 'caught      ' : 'SURVIVED    '} ${name}${red ? `  (${failed.join('; ') || 'status ' + r.status})` : ''}  [tap: ${path.relative(process.cwd(), tap)}]`);
  } finally { fs.writeFileSync(f, src); }
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${na}`);

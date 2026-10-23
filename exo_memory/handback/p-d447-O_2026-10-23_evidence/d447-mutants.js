'use strict';
// D447 (O): each mutant breaks one property of the closed lap's bank (finish.js bankLap, bankPlan's relaxed joints, and closejob.js's hook). The tests below must go
// red on each. Applied to the file, run, restored (also on exit). Under the heavy-run lock. Reports applied / caught / NOT APPLIED.
//   node d447-mutants.js <tree> [mutant id prefix,...]
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = path.resolve(process.argv[2]), ONLY = process.argv[3] ? process.argv[3].split(',') : null, FILE = 'src/core/finish.js';
require(path.join(__dirname, '..', '..', '..', 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'd447-mutants (finish.js / closejob.js mutated in turn: do not read this tree meanwhile)', tree: TREE });
const M = [
  ['Q1 bank only the window (the closed lap is not banked: today)', 'function bankLapRun(doc) {\n  if (!doc.closed', 'function bankLapRun(doc) {\n  return { doc }; if (!doc.closed'],
  ['Q2 bank a hand-banked piece (every road piece banked, upright or not)', ' && P.channels.phi.every((ph) => Math.abs(ph - upright) <= ROLL_FREE) && level(P)) lap.push(p);', ' && level(P)) lap.push(p);'],
  ['Q3 drop the pin next to a straight (a joint relaxed whether or not both pieces curve)', 'uprightSet.has(p) && curved(p - 1) && curved(p);', 'uprightSet.has(p);'],
  ['Q4 no joint relaxed (every joint pinned, as Finish pins its own)', 'uprightSet, relax, { flips: true })', 'uprightSet, () => false, { flips: true })'],
  ['Q5 the road beside a pit lane banked', '!lane.has(p) && ', ''],
  ['Q6 tubes banked', "P.type === 'road' && !P.tube && !lane", "P.type === 'road' && !lane"],
  ['Q7 no lean-out guard at all (no flip pins, no withhold)', [['{ flips: true }', '{ flips: false }'], ['if (!worse.length) return { doc: freeze(res)', 'if (true) return { doc: freeze(res)']], null],
  ['F1 no flip pins (the withhold alone)', '{ flips: true }', '{ flips: false }'],
  ['W1 no per-piece withhold (the flip pins alone)', 'if (!worse.length) return { doc: freeze(res)', 'if (true) return { doc: freeze(res)'],
  ['G1 a flip counted across a straight (no gap rule)', 'seq[k].s - seq[last].s <= FLIP_GAP_M && ', ''],
  ['R1 the press says nothing of the bank held back', 'const bankNote = [', 'const bankNote = false && [', 'app/core/closejob.js'],
  ['Q8 no amber backstop (the share never scaled down)', 'if (peak <= Math.max(ROLL_AMBER_DEG_M, flatPeak + 1e-6)) { res = cand; break; }', 'if (true) { res = cand; break; }'],
  ['Q9 the Close press does not bank (the hook removed)', 'res = { ...res, doc: B.doc, bankNote };', 'res = { ...res, bankNote };', 'app/core/closejob.js'],
  ['Q10 a piece banked whether or not it is level (a loop, its way in and out)', ' && level(P)) lap.push(p);', ') lap.push(p);'],
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
    const red = r.status !== 0; if (red) caught++;
    const failed = [...new Set((r.stdout.match(/^\s*not ok \d+ - row \d+[^\n]{0,40}/gm) || []).map((l) => l.trim().replace(/^not ok \d+ - /, '')))];
    console.log(`${red ? 'caught      ' : 'SURVIVED    '} ${name}${red ? `  (${failed.join('; ') || 'status ' + r.status})` : ''}`);
  } finally { fs.writeFileSync(f, src); }
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${na}`);

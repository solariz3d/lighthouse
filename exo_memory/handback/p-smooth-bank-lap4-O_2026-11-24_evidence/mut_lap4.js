// LAP 4 (knots added before refusing, finding 3; the room named and its words, finding 2): mutants of the new lines in src/core/extend.js, each in a copy of the
// tip, then the four test files that hold them (the LAP 4 rows, the room-search rows, the drawn rows, the panel rows). A mutant is caught when a row fails; a run
// that does not reach every row the unmutated copy reaches is an ERROR, never a result.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const T = 'G:/consonance-scratch/o-smooth-t180', W = 'G:/consonance-scratch/o-smooth-work/tmp/mut-lap4', F = 'src/core/extend.js';
const FILES = ['test/core_bank_flow_lap4.test.js', 'test/core_bank_flow.test.js', 'test/core_bank_flow_room_search.test.js', 'test/core_bank_flow_drawn.test.js', 'app/test/core-bank-flow-panel.test.js'];
const MUT = [
  ['L1 no knots added before refusing', '  for (const h of FLOW_REFINE_M) {', '  for (const h of []) {'],
  ['L2 knots around each try\'s own refused mark', 'flowRefined(piece, marks, h, r.fail.k)', 'flowRefined(piece, marks, h, fail.k)'],
  ['L3 no 2.5 m span', 'const FLOW_REFINE_M = [10, 5, 2.5];', 'const FLOW_REFINE_M = [10, 5];'],
  ['L4 the finest span only', 'const FLOW_REFINE_M = [10, 5, 2.5];', 'const FLOW_REFINE_M = [2.5];'],
  ['L5 knots added before the first solve', '  const r = flowSolve(piece, marks, v0, m0, a0);\n  if (r.piece) return r.piece;', '  const r = flowSolve(flowRefined(piece, marks, 10, 0) || piece, marks, v0, m0, a0);\n  if (r.piece) return r.piece;'],
  ['L6 the refusal is the first try\'s', '  throw flowRefusal(fail, marks, piece.length, trial);', '  throw flowRefusal(r.fail, marks, piece.length, trial);'],
  ['L7 knots over the whole list, not around one mark', 'lo = k ? marks[k - 1].at : 0, hi = k + 1 < marks.length ? marks[k + 1].at : last;', 'lo = 0, hi = last;'],
  ['L8 the spans split one finer', 'const n = Math.ceil((x1 - x0) / h - 1e-9);', 'const n = Math.ceil((x1 - x0) / h - 1e-9) + 1;'],
  ['L9 no knot kept clear of the ends', 'add.filter((x) => x > 0.5 && x < piece.length - 0.5)', 'add.filter((x) => x > 0 && x < piece.length)'],
  ['C1 the message keeps "at least"', 'needs ${room.need} m after ${room.k ?', 'needs at least ${room.need} m after ${room.k ?'],
  ['C2 no whole metres tried first', '    for (let d = 1; d <= near && dm === null; d++) if (ok(d)) dm = d;', ''],
  ['C3 the whole metres tried first stop at 5', 'const FLOW_NEAR_M = 10;', 'const FLOW_NEAR_M = 5;'],
  ['C4 the whole metres tried from the largest', '    for (let d = 1; d <= near && dm === null; d++) if (ok(d)) dm = d;', '    for (let d = near; d >= 1 && dm === null; d--) if (ok(d)) dm = d;'],
  ['C5 no step back past the near metres', '      while (d - 1 > near && ok(d - 1)) d -= 1;', ''],
];
const run = (cwd) => { const r = spawnSync(process.execPath, ['--test', ...FILES], { cwd, encoding: 'utf8', windowsHide: true, env: { ...process.env, TMP: 'G:/consonance-scratch/o-smooth-work/tmp', TEMP: 'G:/consonance-scratch/o-smooth-work/tmp' } }); return (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''); };
const rows = (out) => new Set([...out.matchAll(/^[✔✖] (.+?) \([\d.]+ms\)$/gm)].map((m) => m[1]).filter((n) => !/\.test\.js$/.test(n)));
const copy = () => { fs.rmSync(W, { recursive: true, force: true }); for (const d of ['app', 'src', 'tools', 'test']) fs.cpSync(path.join(T, d), path.join(W, d), { recursive: true }); };
copy(); const base = run(W), ROWS = rows(base).size;
const fails = (out) => { const m = /^ℹ fail (\d+)$/m.exec(out); return m ? +m[1] : null; };   // node prints '✖ failing tests:' for a todo row too, so the count decides
if (fails(base) !== 0) { console.log('ERROR the unmutated copy is red', fails(base)); process.exit(1); }
console.log(`unmutated: ${ROWS} rows green`);
let caught = 0;
const src0 = fs.readFileSync(path.join(T, F), 'utf8'), NL = src0.includes('\r\n') ? '\r\n' : '\n';
for (const [id, a0, b0] of MUT) {
  const a = a0.replace(/\n/g, NL), b = b0.replace(/\n/g, NL);
  copy();
  if (src0.split(a).length !== 2) { console.log('NOT APPLIED', id); continue; }
  fs.writeFileSync(path.join(W, F), src0.replace(a, () => b));
  const out = run(W), ran = rows(out);
  if (ran.size !== ROWS) { console.log('ERROR', id, `(${ran.size} rows ran)`, out.split('\n').find((l) => /Error/.test(l)) || ''); continue; }
  const red = [...new Set([...out.matchAll(/^✖ (.+?) \([\d.]+ms\)$/gm)].map((m) => m[1].slice(0, 40)))];
  const bad = fails(out) > 0; if (bad) caught++;
  console.log(bad ? 'caught' : 'SURVIVED', id, red.length ? `(${red.join(' | ')})` : '');
}
console.log(`${caught} of ${MUT.length} caught`);

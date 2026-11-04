// plants.js (pane B, D226 quick look): can the rewritten sealed row and the strengthened reader test FAIL? Each plant is an exact,
// once-only edit in a temp copy of the tree; CAUGHT = the named test file fails on the plant (and passed on the unplanted control).
//   node plants.js <tree>
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const TREE = path.resolve(process.argv[2]);
const run = (d, file, pattern) => {
  const args = ['--max-old-space-size=4096', '--test', '--test-concurrency=1', ...(pattern ? [`--test-name-pattern=${pattern}`] : []), file];
  const r = spawnSync(process.execPath, args, { cwd: d, encoding: 'utf8', timeout: 15 * 60 * 1000, env: Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_TEST_CONTEXT')) });
  const s = r.stdout.replace(/\x1b\[[0-9;]*m/g, ''); return { pass: r.status === 0, tail: (s.match(/ℹ (pass|fail) \d+/g) || []).join(' ') };
};
const L = 'src/markers/layout.js';
const PLANTS = [
  { id: 'P1 the single-column fallback removed (the old refusal comes back)', edits: [[L, "    grid = { pattern: '1-column', count: c.count, poleBackM: c.poleBackM, rowGapM: c.rowGapM / 2, colGapM: 0, edits: {} };", "    throw err(`the start straight's floor is ${(2 * best.half).toFixed(2)} m wide, too narrow for a two-column grid`);"]],
    check: ['test/core_cup_export.test.js', 'row 4 \\(iii\\)'] },
  { id: 'P2 the fallback silent (no amber note)', edits: [[L, "  if (layout.grid.pattern === '1-column') notes.push(", "  if (false) notes.push("]], check: ['test/core_cup_export.test.js', 'row 4 \\(iii\\)'] },
  { id: 'P3 the fallback puts the column off the centreline (u = colGapM, 6 m)', edits: [[L, "const across = p.cols === 1 ? [0] :", "const across = p.cols === 1 ? [6] :"]], check: ['test/core_cup_export.test.js', 'row 4 \\(iii\\)'] },
  { id: 'P4 the floor read too narrow everywhere (two columns never chosen): the M34 shape', edits: [[L, "  const colGapM = 2 * Math.min(c.colGapM / 2, best.half - SLOT_HALF_WIDTH - 0.5);", "  const colGapM = 2 * Math.min(c.colGapM / 2, Math.min(best.half, 2.2) - SLOT_HALF_WIDTH - 0.5);"]], check: ['test/core_cup_readers.test.js', 'marker layout'] },
];
function copyTree() { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'b-tubeexp-plant-')); for (const c of ['src', 'app', 'tools', 'test', 'scripts', 'package.json', 'reads']) { const s = path.join(TREE, c); if (fs.existsSync(s)) fs.cpSync(s, path.join(d, c), { recursive: true }); } return d; }
{ const d = copyTree(); const seen = {}; for (const p of PLANTS) { const k = p.check.join('|'); if (!(k in seen)) seen[k] = run(d, ...p.check); } console.log(JSON.stringify({ id: 'CONTROL', checks: seen, ok: Object.values(seen).every((x) => x.pass) })); fs.rmSync(d, { recursive: true, force: true }); }
let applied = 0, caught = 0, na = 0;
for (const p of PLANTS) {
  const d = copyTree(); let ok = true;
  for (const [f, from, to] of p.edits) { const fp = path.join(d, f), t = fs.readFileSync(fp, 'utf8'), n = t.split(from).length - 1; if (n !== 1) { ok = false; break; } fs.writeFileSync(fp, t.replace(from, to)); }
  if (!ok) { na++; console.log(JSON.stringify({ id: p.id, applied: false })); fs.rmSync(d, { recursive: true, force: true }); continue; }
  applied++; const r = run(d, ...p.check); if (!r.pass) caught++;
  console.log(JSON.stringify({ id: p.id, applied: true, caught: !r.pass, tail: r.tail })); fs.rmSync(d, { recursive: true, force: true });
}
console.log(`SUMMARY ${applied} applied · ${caught} caught · ${na} NOT APPLIED`);

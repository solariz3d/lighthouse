// plants.js (pane B, D228): do texture_flow's rows have teeth? Each plant = one exact, once-only edit to src/texture/flow.js in a temp copy;
// CAUGHT = the named row fails on the plant, after the same row passed on an unplanted control.   node plants.js <tree>
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const TREE = path.resolve(process.argv[2]), F = 'src/texture/flow.js';
const run = (d, pattern) => { const r = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', '--test-concurrency=1', `--test-name-pattern=${pattern}`, 'test/texture_flow.test.js'], { cwd: d, encoding: 'utf8', timeout: 15 * 60 * 1000, env: Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_TEST_CONTEXT')) });
  const s = r.stdout.replace(/\x1b\[[0-9;]*m/g, ''); return { pass: r.status === 0, tail: (s.match(/ℹ (pass|fail) \d+/g) || []).join(' ') }; };
const RING = 'out[k] = (n * arc[k]) / w;';
const PLANTS = [
  { id: 'S1 STRETCH: the ring wraps n repeats but unevenly (+0.05·sin round the ring; the ends still differ by exactly n)', from: RING, to: 'out[k] = (n * arc[k]) / w + 0.05 * Math.sin(2 * Math.PI * (arc[k] - arc[0]) / w);', row: 'row 4' },
  { id: 'S2 the ring wraps a FRACTION (w / tileWidth, not rounded): the seam jumps at the ceiling', from: 'const n = Math.max(1, Math.round(w / tileWidth));', to: 'const n = w / tileWidth;', row: 'row 4' },
  { id: 'S3 a ring laid as a plain tile (never wrapped)', from: 'if (ring && w > 0) {', to: 'if (false) {', row: 'row 4' },
  { id: 'S4 v restarts every 2 m (the row s taken modulo 2)', from: 'const v = (rowS[r] + offset) / tileLength;', to: 'const v = ((rowS[r] % 2) + offset) / tileLength;', row: 'row 3' },
  { id: 'S5 the gate opens for any word (not only core)', from: "if (!seg || seg.word !== 'core' || !set) return null;", to: 'if (!seg || !set) return null;', row: 'row 6' },
];
function copyTree() { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'b-tex-plant-')); for (const c of ['src', 'app', 'tools', 'test', 'scripts', 'package.json']) { const s = path.join(TREE, c); if (fs.existsSync(s)) fs.cpSync(s, path.join(d, c), { recursive: true }); } return d; }
{ const d = copyTree(), rows = {}; for (const p of PLANTS) if (!(p.row in rows)) rows[p.row] = run(d, p.row); console.log(JSON.stringify({ id: 'CONTROL', rows, ok: Object.values(rows).every((x) => x.pass) })); fs.rmSync(d, { recursive: true, force: true }); }
let applied = 0, caught = 0, na = 0;
for (const p of PLANTS) {
  const d = copyTree(), fp = path.join(d, F), t = fs.readFileSync(fp, 'utf8'), n = t.split(p.from).length - 1;
  if (n !== 1) { na++; console.log(JSON.stringify({ id: p.id, applied: false, occurrences: n })); fs.rmSync(d, { recursive: true, force: true }); continue; }
  fs.writeFileSync(fp, t.replace(p.from, p.to)); applied++;
  const r = run(d, p.row); if (!r.pass) caught++;
  console.log(JSON.stringify({ id: p.id, applied: true, caught: !r.pass, row: p.row, tail: r.tail })); fs.rmSync(d, { recursive: true, force: true });
}
console.log(`SUMMARY ${applied} applied · ${caught} caught · ${na} NOT APPLIED`);

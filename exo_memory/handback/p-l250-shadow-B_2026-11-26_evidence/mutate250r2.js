// mutate250r2.js (L250 repair, part 2): mutants of Road for a layout with no AI line (app/reference/panel.js, src/reference/road.js), each applied in
// place, both row files run, the file put back byte for byte. A mutant is caught when a row fails. Run nothing else in the worktree meanwhile.
const fs = require('fs'), { execFileSync } = require('child_process');
const T = 'C:/Consonance/t180-wt-l243', PAN = 'app/reference/panel.js', ROAD = 'src/reference/road.js';
const M = [
  [ROAD, 'the header\'s start is not used (7ff1215\'s rule)', "  const s = road.meta && road.meta.start;\r\n", "  const s = null;\r\n"],
  [ROAD, 'the start is not set down on its road', 'start: { pos: [s.pos[0], y === null ? s.pos[1] : y, s.pos[2]]', 'start: { pos: [s.pos[0], s.pos[1], s.pos[2]]'],
  [ROAD, 'a start facing up is taken', 'if (Math.hypot(s.T[0], s.T[2]) < 0.1) throw', 'if (false) throw'],
  [ROAD, 'groundUnder takes a deck overhead', 'if (y <= top && (best === null || y > best)) best = y;', 'if (best === null || y > best) best = y;'],
  [ROAD, 'groundUnder takes the lowest road', 'if (y <= top && (best === null || y > best)) best = y;', 'if (y <= top && (best === null || y < best)) best = y;'],
  [ROAD, 'groundUnder has no reach above', 'top = pos[1] + reach;', 'top = pos[1];'],
  [ROAD, 'the native side\'s reason is dropped', "(road.meta && road.meta.noStart) || 'its kn5 names no start'", "'its kn5 names no start'"],
  [PAN, 'Road reads a line it does not have', "const byStart = m === 'road' && !l.hasAi;", 'const byStart = false;'],
  [PAN, 'no AI line stays greyed in Road', "o.disabled = bad || (!l.hasAi && mode !== 'road');", 'o.disabled = bad || !l.hasAi;'],
  [PAN, 'a road with no start is not marked', "mode === 'road' && refused.has(rk(keyOf(l), 'road'))", 'false'],
  [PAN, 'notes are read for a road with no line', 'const n = line ? await notesFor(l, shape, line, my) : [];', 'const n = await notesFor(l, shape, line, my);'],
  [PAN, 'the readout calls it a line', ": `${ref.placedBy}: it has no AI line`}", ': `its ${f(Math.round(ref.lengthM || 0))} m AI line`}'],
  [PAN, 'Road\'s count says nothing of the layouts with no line', "${byStart ? ` (${byStart} with no AI line, placed by the start its kn5 names)` : ''}", ''],
];
const run = () => { for (const f of ['app/test/reference-panel.test.js', 'test/reference_ribbon.test.js']) { try { execFileSync(process.execPath, ['--test', f], { cwd: T, stdio: 'pipe', timeout: 240000 }); } catch (e) { return true; } } return false; };
const res = [], origs = new Map();
try {
  for (const [file, name, a, b] of M) {
    const F = `${T}/${file}`; if (!origs.has(F)) origs.set(F, fs.readFileSync(F));
    const s = origs.get(F).toString('utf8'); if (s.split(a).length !== 2) { res.push([name, 'NOT APPLIED']); continue; }
    fs.writeFileSync(F, s.replace(a, () => b));
    const caught = run(); fs.writeFileSync(F, origs.get(F));
    res.push([name, caught ? 'caught' : 'SURVIVED']);
  }
} finally { for (const [F, b] of origs) fs.writeFileSync(F, b); }
for (const [n, r] of res) console.log(`${r.padEnd(11)} ${n}`);
console.log(`${res.filter((x) => x[1] === 'caught').length} of ${res.length} caught; restored byte for byte: ${[...origs].every(([F, b]) => fs.readFileSync(F).equals(b))}`);

'use strict';
// mutants_n6.js <worktree>: D678 N6's own mutants against gen-consumer.test.js. Each edits the worktree's gen-consumer.js (or adds a file),
// runs the one test file, then restores the exact bytes (or removes the file). A mutant whose anchor does not match exactly once is NOT APPLIED.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const W = path.resolve(process.argv[2]);
require(path.join(W, 'consonance/tools/heavy-run.js')).hold({ cmd: 'C D678 N6: mutants_n6 (gen-consumer.test.js, 8 runs)' });
const GC0 = 0, GC = path.join(W, 'consonance/tools/gen-consumer.js'), TEST = path.join(W, 'consonance/tools/gen-consumer.test.js');
const run = () => { const r = spawnSync(process.execPath, ['--test', TEST], { encoding: 'utf8', windowsHide: true, cwd: W }); const out = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''); return { code: r.status, fails: (out.match(/^✖ (?!failing).*$/gm) || []).filter((l) => !/^✖ failing/.test(l)), out }; };
const MANI = "  { dir: 'exo_memory/research', to: 'exo_memory/research', match: /\.md$/, kind: 'prose' },\n";
const EV = 'exo_memory/research/t180_what_separates_a_break_2026-11-27_evidence';
const M = [
  ['one of the six rows dropped (the 11-27 car note ships)', "  'exo_memory/research/t180_car_how_it_works_2026-11-27.md':\n", "  'exo_memory/research/t180_car_how_it_works_2026-11-27.md_DROPPED':\n"],
  ['one of the six marked UNREACHABLE (declared, not live)', "    'research for the track builder (why a fast car", "    'UNREACHABLE: research for the track builder (why a fast car"],
  ['one of the first three dropped (the 09-28 rows still guarded)', "  'exo_memory/research/t180_math_tools_2026-09-28.md':\n", "  'exo_memory/research/t180_math_tools_2026-09-28.md_DROPPED':\n"],
  ['a rule ships an evidence folder at its own path', MANI, MANI + "  { dir: '" + EV + "', to: '" + EV + "', match: /\.(md|js|txt|json)$/, kind: 'prose' },\n"],
  ['a rule ships an evidence folder under another name', MANI, MANI + "  { dir: '" + EV + "', to: 'exo_memory/notes', match: /\.(md|js|txt|json)$/, kind: 'prose' },\n"],
  ['a rule ships a t180 note to a t180_ destination from elsewhere', MANI, MANI + "  { from: 'exo_memory/research/the_pattern_in_felt_knowing.md', to: 'exo_memory/research/t180_copy.md', kind: 'prose' },\n"],
];
const raw = fs.readFileSync(GC, 'utf8'); const BAK = path.join(__dirname, 'gen-consumer.js.orig'); if (fs.existsSync(BAK) && fs.readFileSync(BAK, 'utf8') !== raw) { console.log('REFUSED: a backup from an interrupted run differs from the file; restore it first'); process.exit(4); } fs.writeFileSync(BAK, raw);
const control = run(); console.log('CONTROL unmutated: exit ' + control.code + ', failing ' + control.fails.length); if (control.code !== 0) { console.log(control.fails.join('\n')); process.exit(2); }
let applied = 0, caught = 0, na = 0;
for (const [name, from, to] of M) {
  const n = raw.split(from).length - 1;
  if (n !== 1) { na++; console.log('NOT APPLIED  ' + name + ' (anchor x' + n + ')'); continue; }
  applied++; fs.writeFileSync(GC, raw.replace(from, to));
  let r; try { r = run(); } finally { fs.writeFileSync(GC, raw); }
  const red = r.code !== 0; if (red) caught++;
  const d454 = r.fails.some((l) => /D454: the t180 product research/.test(l)); console.log((red ? 'CAUGHT       ' : 'SURVIVED     ') + name + (red ? (d454 ? '  [the D454 row is red]' : '  [the D454 row is NOT among the reds]') : '') + (red ? '  by: ' + r.fails.map((l) => l.slice(2, 70)).join(' | ') : ''));
}
// a tenth note appears in the folder with no row: the premise follows the folder
{ const extra = path.join(W, 'exo_memory/research/t180_zz_mutant_note_2026-11-27.md');
  applied++; fs.writeFileSync(extra, '# a t180 note with no EXCLUDE row\n'); let r; try { r = run(); } finally { fs.unlinkSync(extra); }
  const red = r.code !== 0; if (red) caught++; const d454t = r.fails.some((l) => /D454: the t180 product research/.test(l)); console.log((red ? 'CAUGHT       ' : 'SURVIVED     ') + (d454t ? '[the D454 row is red] ' : '[the D454 row is NOT among the reds] ') + 'a tenth t180 note appears with no row' + (red ? '  by: ' + r.fails.map((l) => l.slice(2, 70)).join(' | ') : '')); }
console.log('applied ' + applied + ' / caught ' + caught + ' / NOT APPLIED ' + na);
const ok = fs.readFileSync(GC, 'utf8') === raw; console.log('restored: ' + ok); if (ok) fs.unlinkSync(BAK);

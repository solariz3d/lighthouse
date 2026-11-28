'use strict';
// mutants_n6b.js <worktree>: the three MANIFEST mutants of mutants_n6.js again. In that file their anchor lost a backslash when the
// script was written through a shell heredoc (`/\.md$/` arrived as `/.md$/` inside a JS string), so all three read NOT APPLIED.
// Here every anchor is a String.raw literal. Same method: edit the worktree's gen-consumer.js, run gen-consumer.test.js, restore the bytes.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { spawnSync } = require('child_process');
const W = path.resolve(process.argv[2]);
require(path.join(W, 'consonance/tools/heavy-run.js')).hold({ cmd: 'C D678 N6: mutants_n6b (3 manifest mutants)' });
const GREEN = '7f698288f31fa19d11cb98a8a06a9fb6105d7c5c0352772a6079610f8dff7013';
const GC = path.join(W, 'consonance/tools/gen-consumer.js'), TEST = path.join(W, 'consonance/tools/gen-consumer.test.js');
const raw = fs.readFileSync(GC, 'utf8');
const sha = crypto.createHash('sha256').update(raw).digest('hex');
if (sha !== GREEN) { console.log('REFUSED: gen-consumer.js is not the green file (sha ' + sha.slice(0, 12) + ')'); process.exit(4); }
const run = () => {
  const r = spawnSync(process.execPath, ['--test', TEST], { encoding: 'utf8', windowsHide: true, cwd: W });
  const out = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '');
  return { code: r.status, fails: (out.match(/^✖ .*$/gm) || []).filter((l) => !/^✖ failing/.test(l)) };
};
const MANI = String.raw`  { dir: 'exo_memory/research', to: 'exo_memory/research', match: /\.md$/, kind: 'prose' },` + '\n';
const EV = 'exo_memory/research/t180_what_separates_a_break_2026-11-27_evidence';
const M = [
  ['a rule ships an evidence folder at its own path', MANI + String.raw`  { dir: '` + EV + String.raw`', to: '` + EV + String.raw`', match: /\.(md|js|txt|json)$/, kind: 'prose' },` + '\n'],
  ['a rule ships an evidence folder under another name', MANI + String.raw`  { dir: '` + EV + String.raw`', to: 'exo_memory/notes', match: /\.(md|js|txt|json)$/, kind: 'prose' },` + '\n'],
  ['a rule ships a room note to a t180_ destination', MANI + String.raw`  { from: 'exo_memory/research/the_pattern_in_felt_knowing.md', to: 'exo_memory/research/t180_copy.md', kind: 'prose' },` + '\n'],
];
let applied = 0, caught = 0, na = 0;
for (const [name, to] of M) {
  const n = raw.split(MANI).length - 1;
  if (n !== 1) { na++; console.log('NOT APPLIED  ' + name + ' (anchor x' + n + ')'); continue; }
  applied++; fs.writeFileSync(GC, raw.replace(MANI, to));
  let r; try { r = run(); } finally { fs.writeFileSync(GC, raw); }
  const red = r.code !== 0; if (red) caught++;
  const d454 = r.fails.some((l) => /D454: the t180 product research/.test(l));
  console.log((red ? 'CAUGHT       ' : 'SURVIVED     ') + name + (red ? (d454 ? '  [the D454 row is red]' : '  [the D454 row is NOT among the reds]') + '  by: ' + r.fails.map((l) => l.slice(2, 90)).join(' | ') : ''));
}
console.log('applied ' + applied + ' / caught ' + caught + ' / NOT APPLIED ' + na);
console.log('generator is the green file after: ' + (crypto.createHash('sha256').update(fs.readFileSync(GC)).digest('hex') === GREEN));

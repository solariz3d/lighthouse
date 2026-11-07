// mutrun.js: scratch mutants of e911792 for test/tube_cases.test.js; each applied to the copy in mut/, the whole test run, the file restored. Prints applied/caught.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = path.join(__dirname, 'mut'), WT = 'C:/Users/nname/Desktop/worktrees/t180-c607';
for (const f of ['test/tube_cases.test.js', 'test/fixtures/tube-cases-2026-11-02.t180track']) fs.copyFileSync(path.join(WT, f), path.join(TREE, f));
const ONLY = process.argv[2] ? process.argv[2].split(",") : null;
const M0 = [
  { id: 'C1', row: 'collision inside', file: 'src/export/acready.js', from: 'out.push({ ...node, name: unique(node.name), positions, normals });',
    to: 'out.push({ ...node, name: unique(node.name), positions, normals, ...(/^1ROAD_p/.test(node.name) ? { indices: Uint32Array.from([...node.indices].filter((_, i, I) => { const t = i - (i % 3), z = (positions[3 * I[t] + 2] + positions[3 * I[t + 1] + 2] + positions[3 * I[t + 2] + 2]) / 3; return !(z > 240 && z < 246); })) } : {}) });' },
  { id: 'C2', row: 'nothing clips', file: 'src/export/underskin.js', from: 'for (let a = 0; a < 3; a++) { positions[d + a] = P[s + a] - dep[k] * dir[a]; normals[d + a] = -dir[a]; }',
    to: 'const thru = r === 1 && c === 3 ? -1 : 1; for (let a = 0; a < 3; a++) { positions[d + a] = P[s + a] - thru * dep[k] * dir[a]; normals[d + a] = -dir[a]; }' },
  { id: 'C3', row: 'the AI line runs', file: 'src/export/fromwords.js', from: "const line = ailine.generateAiLine(dsn, secs, { mode: 'floor', speedKmh, DS: o.step, open: test });",
    to: "const line = ailine.generateAiLine(dsn, secs, { mode: 'floor', speedKmh, DS: o.step, open: test }); line.points = line.points.map((p) => (p.pos[2] > 400 && p.pos[2] < 430 ? { ...p, pos: [p.pos[0] + 5, p.pos[1], p.pos[2]] } : p));" },
  { id: 'C4', row: 'the AI line runs', file: 'src/export/fromwords.js', from: "const line = ailine.generateAiLine(dsn, secs, { mode: 'floor', speedKmh, DS: o.step, open: test });",
    to: "const line = ailine.generateAiLine(dsn, secs, { mode: 'floor', speedKmh, DS: o.step, open: test }); const keep = line.points.map((p) => !(p.pos[2] > 400 && p.pos[2] < 430)); line.points = line.points.filter((_, i) => keep[i]).map((p, i) => ({ ...p, id: i })); line.extra = line.extra.filter((_, i) => keep[i]);" },
];
const M = ONLY ? M0.filter((m) => ONLY.includes(m.id)) : M0;
let applied = 0, caught = 0, notApplied = 0;
for (const m of M) {
  const f = path.join(TREE, m.file), src = fs.readFileSync(f, 'utf8'), n = src.split(m.from).length - 1;
  if (n !== 1) { console.log(m.id, 'NOT APPLIED', n); notApplied++; continue; }
  fs.writeFileSync(f, src.replace(m.from, m.to)); applied++;
  const r = spawnSync(process.execPath, ['--max-old-space-size=6000', '--test', '--test-reporter=spec', 'test/tube_cases.test.js'], { cwd: TREE, encoding: 'utf8', windowsHide: true });
  fs.writeFileSync(f, src);
  const out = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''), rows = out.split('\n').filter((l) => /^[✔✖] /.test(l)).slice(0, 7);
  const rowRed = rows.some((l) => l.startsWith('✖') && l.includes(m.row));
  if (rowRed) caught++;
  console.log(m.id, rowRed ? 'CAUGHT' : 'NOT CAUGHT', 'by', m.row, '| rows:', rows.map((l) => l[0]).join(''));
  console.log(out.split('\n').filter((l) => /^  \+   '/.test(l)).filter((l, i, a) => a.indexOf(l) === i).slice(0, 40).join('\n'));
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}`);

// mutrun610.js: scratch mutants of src/export/lighthull.js for test/lighthull.test.js (and the tube test where named); each applied to a copy of the worktree in mut/,
// the tests run, the file restored. Prints applied / caught / NOT APPLIED. Every child process hidden (windowsHide).
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = path.join(__dirname, 'mut'), WT = 'C:/Users/nname/Desktop/worktrees/t180-c610', F = 'src/export/lighthull.js';
fs.rmSync(TREE, { recursive: true, force: true });
for (const d of ['src', 'app', 'test', 'tools', 'scripts', 'package.json']) fs.cpSync(path.join(WT, d), path.join(TREE, d), { recursive: true });
const M = [
  { id: 'L1', row: 'opens no edge', also: 'tube', what: 'the tips between two kept rows are not fanned (the strip\'s tip edge is one chord, T-junctions with the plank)',
    from: "const chain = []; for (let r = ra; r <= rb; r++) chain.push(r === ra ? A(tip) : r === rb ? B(tip) : id(r, tip, 'out'));", to: 'const chain = [A(tip), B(tip)];' },
  { id: 'L2', row: 'no light triangle spans a uv jump', equiv: true, what: 'a jump row is not forced kept', from: 'if (!jump[a + 1] || a + 1 === last) for (let c = a + 2; c <= last && along[c] - along[a] <= maxStep && !jump[c - 1]; c++) {', to: 'for (let c = a + 2; c <= last && along[c] - along[a] <= maxStep; c++) {' },
  { id: 'L3', row: 'THE IMAGE at random points', what: 'the quad centres are not sampled', from: "      probe(t0, t1, { P: [0, 1, 2].map((k) => (c[0].P[k] + c[1].P[k] + c[2].P[k] + c[3].P[k]) / 4)", to: "      if (0) probe(t0, t1, { P: [0, 1, 2].map((k) => (c[0].P[k] + c[1].P[k] + c[2].P[k] + c[3].P[k]) / 4)" },
  { id: 'L4', row: 'THE IMAGE: every vertex', what: 'the drift tolerance five times wider', from: 'const LIGHT_TOL_M = 0.02;', to: 'const LIGHT_TOL_M = 0.1;', tol: true },
  { id: 'L5', row: 'vertex for vertex', what: 'a stretch\'s end rows not whole', from: 'keepAt = (r) => (r === 0 || r === last ? all : cols);', to: 'keepAt = (r) => cols;' },
  { id: 'L6', row: 'every mesh that is not the bottom', what: 'the road cell\'s node replaced, not its skin\'s', from: "replace.set(st[0].si, { type: 'dummy', name: first.name, matrix: IDENTITY.slice(), children: [{", to: "replace.set(st[0].k, { type: 'dummy', name: first.name, matrix: IDENTITY.slice(), children: [{" },
  { id: 'L7', row: 'faces where the full one does', what: 'no winding by the vertices\' normals', from: '    if (dot(x, s) < 0) { const y = idx[t + 1]; idx[t + 1] = idx[t + 2]; idx[t + 2] = y; }', to: '    void s;' },
  { id: 'L8', row: 'under 40%', what: 'a uv made up: the strip ending on a jump row takes the side after\'s uv (its uv triangles have no area, the drift check refuses every stretch it reaches, and the bottom stays full)', from: "const A = (i) => id(ra, i, 'out'), B = (i) => id(rb, i, 'in');", to: "const A = (i) => id(ra, i, 'out'), B = (i) => id(rb, i, 'out');" },
];
let applied = 0, caught = 0, notApplied = 0;
const run = (files) => { const r = spawnSync(process.execPath, ['--test', '--test-reporter=spec', ...files], { cwd: TREE, encoding: 'utf8', windowsHide: true }); return (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''); };
const f = path.join(TREE, F), src0 = fs.readFileSync(f, 'utf8');
// an equivalent mutant is told by the bottom it builds: byte for byte the unmutated one, textured and untextured
const skinSha = () => { const r = spawnSync(process.execPath, [path.join(__dirname, 'skinsha.js'), TREE], { encoding: 'utf8', windowsHide: true }); const x = /SKINSHA (.*)/.exec(r.stdout); if (!x) throw new Error('skinsha: ' + r.stderr); return x[1]; };
const base = skinSha(); console.log('the unmutated bottom', base);
for (const m of M) {
  const n = src0.split(m.from).length - 1;
  if (n !== 1) { console.log(m.id, 'NOT APPLIED', n); notApplied++; continue; }
  // L4 widens the bar the test reads too (the test imports LIGHT_TOL_M): the test's own bar is pinned at 2 cm for this mutant
  fs.writeFileSync(f, src0.replace(m.from, m.to)); applied++;
  const tf = path.join(TREE, 'test/lighthull.test.js'), t0 = fs.readFileSync(tf, 'utf8');
  if (m.tol) fs.writeFileSync(tf, t0.replace("const { withLightHull, LIGHT_TOL_M } = require('../src/export/lighthull.js');", "const { withLightHull } = require('../src/export/lighthull.js'); const LIGHT_TOL_M = 0.02;"));
  const out = run(['test/lighthull.test.js', ...(m.also ? ['test/tube_cases.test.js'] : [])]);
  fs.writeFileSync(f, src0); fs.writeFileSync(tf, t0);
  const rows = out.split('\n').filter((l) => /^[✔✖] /.test(l));
  const hit = rows.some((l) => l.startsWith('✖') && l.includes(m.row));
  if (!hit && m.equiv) { fs.writeFileSync(f, src0.replace(m.from, m.to)); const sh = skinSha(); fs.writeFileSync(f, src0); console.log(m.id, 'its bottom', sh, sh === base ? 'EQUIVALENT: byte for byte the unmutated bottom, textured and untextured' : 'NOT equivalent'); }
  if (hit) caught++;
  console.log(m.id, hit ? 'CAUGHT' : 'NOT CAUGHT', 'by', JSON.stringify(m.row), '|', m.what, '| red rows:', rows.filter((l) => l.startsWith('✖')).map((l) => l.slice(2, 50)).join(' ; ') || 'none');
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}`);

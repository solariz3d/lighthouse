// D185 (pane E): mutation run for src/core/sculpt.js and close.js, in the SCRATCH tree ./tree only (built by sync.sh from A's
// worktree + E's files, by copy). Each mutant is ONE exact string replacement; a mutant whose string is not found is NOT APPLIED.
// A mutant is CAUGHT when any test fails. The file is restored after every mutant. Then the unmutated CONTROL must pass.
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E: D185 mutation run (sculpt, close)' });
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = path.join(__dirname, 'tree');
const TESTS = ['test/core_sculpt.test.js', 'test/core_close.test.js', '.claude/skills/track-equations/evals/10_known_answers.test.js'];
const M = [
  ['sculpt', 'S1 falloff: the cubic smoothstep (only C1)', 'return x * x * x * (x * (6 * x - 15) + 10);', 'return x * x * (3 - 2 * x);'],
  ['sculpt', 'S2 falloff: no 1 −', 'const falloff = (d, r) => 1 - smootherstep(Math.abs(d) / r);', 'const falloff = (d, r) => smootherstep(Math.abs(d) / r);'],
  ['sculpt', 'S3 support: 3 spans, not 4', 'if (t[i] < s0 - r || t[i + 4] > s0 + r) continue;', 'if (t[i] < s0 - r || t[i + 3] > s0 + r) continue;'],
  ['sculpt', 'S4 knot average: shifted', 'const knotAverage = (t, i) => (t[i + 1] + t[i + 2] + t[i + 3]) / 3;', 'const knotAverage = (t, i) => (t[i] + t[i + 1] + t[i + 2]) / 3;'],
  ['sculpt', 'S5 joint: the slope dropped', 'rb.ctrl[0] = v; rb.ctrl[1] = v + (m * hb) / 3;', 'rb.ctrl[0] = v; rb.ctrl[1] = v;'],
  ['sculpt', 'S6 no widening', 'const rUsed = Math.max(r, 3 * span);', 'const rUsed = r;'],
  ['sculpt', 'S7 a half-covered joint is not put back', 'if (ra) { ra.ctrl[n - 1] = Pa.channels[channel][n - 1];', 'if (false) { ra.ctrl[n - 1] = Pa.channels[channel][n - 1];'],
  ['close', 'C1 least norm: sign', 'const y = denseSolve(M, m.r.map((v) => -v))', 'const y = denseSolve(M, m.r.map((v) => v))'],
  ['close', 'C2 no weights', 'winv = cols.map((c) => (c.edited ? 1 / wEdit : 1));', 'winv = cols.map((c) => 1);'],
  ['close', 'C3 joint dependent: slope ratio dropped', "e[i] = i === 0 ? A[na - 1] : [...A[na - 1].map(([c, k]) => [c, k * (1 + rho)]), ...A[na - 2].map(([c, k]) => [c, -k * rho])];", "e[i] = i === 0 ? A[na - 1] : A[na - 1];"],
  ['close', 'C4 seam slope rows: the end slope sign', 'put(L, nL - 1, a); put(L, nL - 2, -a);', 'put(L, nL - 1, -a); put(L, nL - 2, a);'],
  ['close', 'C5 converged ignores the stored (quantised) measure and the gap', 'converged = done(m) && ms.gapM < 0.01;', 'converged = true;'],
  ['close', 'C6 heading target: floor, not round', 'const turns = Math.round(net.kh / TAU)', 'const turns = Math.floor(net.kh / TAU)'],
  ['close', 'C7 Jacobian: the half-step term dropped', "add('kh', g.pi, g.kh0, g.Tt.map((v) => 0.5 * g.h * v));", ''],
  ['close', 'C8 bank row omitted from the residual', "const r = [z.pos[0] - a.pos[0], z.pos[1] - a.pos[1], z.pos[2] - a.pos[2], net.kh - TAU * turns, net.kv, bank - TAU * m];", "const r = [z.pos[0] - a.pos[0], z.pos[1] - a.pos[1], z.pos[2] - a.pos[2], net.kh - TAU * turns, net.kv, 0];"],
];
const run = () => spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', ...TESTS], { cwd: TREE, encoding: 'utf8', timeout: 300000, env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' } });
const out = [];
for (const [file, name, from, to] of M) {
  const f = path.join(TREE, 'src', 'core', `${file}.js`), orig = fs.readFileSync(f, 'utf8');
  if (orig.split(from).length !== 2) { out.push(`NOT APPLIED  ${name}`); continue; }
  fs.writeFileSync(f, orig.split(from).join(to));
  try {
    const r = run(), clean = (r.stdout || '').replace(/\x1b\[[0-9;]*m/g, ''), fail = +((clean.match(/ℹ fail (\d+)/) || [])[1] || 0), first = (clean.match(/^✖ (.*)$/m) || [])[1];
    out.push(`${fail > 0 || r.status !== 0 ? 'CAUGHT  ' : 'SURVIVED'}  ${name}  (${fail} failing${first ? `; first: ${first.slice(0, 90)}` : ''}${r.error ? `; ${r.error.code}` : ''})`);
  } finally { fs.writeFileSync(f, orig); }
}
const c = run();
out.push(`CONTROL (no mutant): ${((c.stdout || '').replace(/\x1b\[[0-9;]*m/g, '').match(/ℹ (pass|fail) \d+/g) || []).join(', ')}`);
console.log(out.join('\n'));

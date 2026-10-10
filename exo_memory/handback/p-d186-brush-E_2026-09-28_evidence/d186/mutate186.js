// D186 (pane E): mutation run for the brush modes (src/core/sculpt.js) and the offset post-pass (src/core/offset.js), in the
// PROTOTYPE tree ./proto (offset channels patched into copies of A's files), so the hill tests run. One exact replacement each;
// NOT APPLIED if the string is not found; CAUGHT if any test fails. Restored after each. Then the CONTROL must pass.
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E: D186 mutation run (brush modes, offset)' });
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = path.join(__dirname, 'proto');
const TESTS = ['test/core_sculpt.test.js', 'test/core_sculpt_modes.test.js', 'test/core_offset.test.js'];
const M = [
  ['sculpt', 'B1 the hill is not normalised to its peak', 'd = delta / got;', 'd = delta;'],
  ['sculpt', 'B2 the widening reads the whole piece, not the spans under the window', 'if (off[p] + t[k + 1] >= lo && off[p] + t[k] <= hi) m = Math.max', 'if (true) m = Math.max'],
  ['sculpt', 'B3 a rate brush on a closed track does not re-close', "if (mode !== 'rate' || !doc.closed || !res.changed.length) return { ...res, mode };", 'return { ...res, mode };'],
  ['sculpt', 'B4 the value mode accepts a rate channel', "value: { channels: ['phi', 'w', 'r', 'h', 'l'],", "value: { channels: ['phi', 'w', 'r', 'h', 'l', 'kh'],"],
  ['sculpt', 'B5 the re-close does not protect the brushed stretch', '{ edited: res.changed.map((x) => x.piece) }', '{ edited: [] }'],
  ['sculpt', 'B6 the sharp option is ignored', '  if (sharp) {', '  if (false) {'],
  ['offset', 'O1 kvec not divided by the lifted road\'s speed', '1 / (ds * moved[i].speed)', '1 / ds'],
  ['offset', 'O2 a spread copy (drops the prototype getters s, seg, roll)', 'const y = Object.create(Object.getPrototypeOf(x), Object.getOwnPropertyDescriptors(x));', 'const y = { ...x };'],
  ['offset', 'O3 the lateral offset\'s sign', 'const pos = add(add(x.pos, mul(UP, v.h)), mul(R, v.l));', 'const pos = add(add(x.pos, mul(UP, v.h)), mul(R, -v.l));'],
  ['offset', 'O4 every sample copied (none kept as the same object)', 'return v && (v.h || v.dh || v.l || v.dl) ? v : null;', 'return v || { h: 0, dh: 0, l: 0, dl: 0 };'],
  ['offset', 'O5 the height along the road\'s U, not world up', 'const pos = add(add(x.pos, mul(UP, v.h)), mul(R, v.l));', 'const pos = add(add(x.pos, mul(x.U, v.h)), mul(R, v.l));'],
  ['offset', 'O6 the roll reset to 0 in a lifted sample', 'F = frameOf(T, x.roll);', 'F = frameOf(T, 0);'],
  ['offset', 'O7 the tangent ignores the offset slope', 'const V = add(add(add(x.T, mul(UP, v.dh)), mul(R, v.dl)), mul(dR, v.l))', 'const V = x.T'],
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
out.push(`CONTROL (no mutant): ${((c.stdout || '').replace(/\x1b\[[0-9;]*m/g, '').match(/ℹ (pass|fail|skipped) \d+/g) || []).join(', ')}`);
console.log(out.join('\n'));

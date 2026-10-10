'use strict';
// D166 addendum 2 (pane E): mutation pass over src/validate/bounds.js and the steep rule in src/validate/index.js,
// against test/validate_bounds.test.js (and, for index.js, the three other validate test files too).
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process'), crypto = require('crypto');
const REPO = 'C:/Users/nname/Desktop/t180-track-builder';
const F = { bounds: 'src/validate/bounds.js', index: 'src/validate/index.js' };
const TESTS = ['test/validate_bounds.test.js', 'test/validate.test.js', 'test/validate_jumps.test.js', 'test/validate_incremental.test.js'];
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const M = [
  ['bounds', 'probe: doc refusal counted as clean', 'catch (e) { return { ok: false, refused: e.message }; }', 'catch (e) { return { ok: true, refused: e.message }; }'],
  ['bounds', 'probe: amber ignored', 'amber: amber.length > 0,', 'amber: false,'],
  ['bounds', 'probe: red ignored', 'return { ok: red.length === 0,', 'return { ok: true,'],
  ['bounds', 'scope: word-only always', "const here = (x) => opts.scope !== 'word' ||", "const here = (x) => false ||"],
  ['bounds', 'scope: track always', "opts = { ...opts, scope: whole.ok ? 'track' : 'word' };", "opts = { ...opts, scope: 'track' };"],
  ['bounds', 'edge: bisection stops early', 'while (Math.abs(b - a) > 1)', 'while (Math.abs(b - a) > 64)'],
  ['bounds', 'edge: doubling replaced by a big first step', 'let lastOk = q0, step = 1, fail = null;', 'let lastOk = q0, step = 4096, fail = null;'],
  ['bounds', 'edge: range limit reported as red', "if (r.good) return { q, stop: { kind: 'range' } };", 'if (false) return { q, stop: { kind: \'range\' } };'],
  ['bounds', 'quantum: degrees in radians', 'deg: 1e-3 * Math.PI / 180,', 'deg: 1e-3,'],
  ['bounds', 'red-now not detected', "if (now.ok === false) { out.handles[h]", "if (false) { out.handles[h]"],
  ['bounds', 'amber search not bounded by the red one', 'edge(q0, +1, up.q, noAmber)', 'edge(q0, +1, qHi, noAmber)'],
  ['bounds', 'amber search bounded by the WHOLE range', 'edge(q0, -1, down.q, noAmber)', 'edge(q0, -1, qLo, noAmber)'],
  ['bounds', 'stop: reasons dropped', 'reasons: [...new Set(all.map((x) => x.reason))]', 'reasons: []'],
  ['index', 'steep: ψ only again (bank ignored)', 'const up = Math.max(-1, Math.min(1, normalOf(i, u)[1]));', 'const up = Math.cos(P.psiAt(profiles[S[i].seg], u));'],
  ['index', 'steep: CSP flag ignored', 'if (opts.csp === false) { const up', 'if (true) { const up'],
  ['index', 'steep: threshold loosened', 'if (Math.acos(up) > car.steepDeg * DEG + 1e-12)', 'if (Math.acos(up) > car.steepDeg * DEG + 1e-3)'],
];
const orig = Object.fromEntries(Object.entries(F).map(([k, f]) => [k, fs.readFileSync(path.join(REPO, f))]));
let applied = 0, caught = 0, notApplied = 0; const rows = [];
for (const [which, name, from, to] of M) {
  const text = orig[which].toString('utf8'), n = text.split(from).length - 1;
  if (n !== 1) { notApplied++; rows.push(`NOT APPLIED (${n} matches)  ${which}: ${name}`); continue; }
  try {
    fs.writeFileSync(path.join(REPO, F[which]), text.replace(from, to));
    const r = spawnSync(process.execPath, ['--test', '--test-concurrency=4', ...TESTS], { cwd: REPO, encoding: 'utf8', timeout: 600000 });
    applied++; const failed = r.status !== 0; if (failed) caught++;
    rows.push(`${failed ? 'caught  ' : 'SURVIVED'}  ${which}: ${name}`);
  } finally { fs.writeFileSync(path.join(REPO, F[which]), orig[which]); }
}
let ok = true; for (const [k, f] of Object.entries(F)) if (sha(fs.readFileSync(path.join(REPO, f))) !== sha(orig[k])) ok = false;
console.log(rows.join('\n'));
console.log(`\napplied ${applied} / caught ${caught} / NOT APPLIED ${notApplied} (of ${M.length}); files restored byte-exact: ${ok ? 'yes' : 'NO'}`);
if (!ok) process.exitCode = 2;

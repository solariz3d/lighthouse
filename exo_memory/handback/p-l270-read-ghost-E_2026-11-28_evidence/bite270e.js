// bite270e.js (pane E, L270, the short read of 6ba9e19): the amended row's two compares, bitten. node bite270e.js <tree> <out.json>
// Each variant is a copy of app/test/core-readout-display.test.js with ONE call changed, run alone on the row (--test-name-pattern), then deleted.
// A shifted lift builds plain sample objects; so each bite has a 0 m CONTROL built the same way, both sides wrapped, to show the red is the 0.5 m.
'use strict';
const path = require('path'), fs = require('fs'), { spawnSync } = require('child_process');
const T = path.resolve(process.argv[2]), OUT = process.argv[3], F = path.join(T, 'app/test/core-readout-display.test.js');
const src = fs.readFileSync(F, 'utf8');
const L1 = "  sameCandidate(P.shell.candidate(untouched), P.shell.candidate(blank), 'the same piece');";
const L2 = "  sameCandidate(ghosts.at(-1), P.shell.candidate(blank), 'the ghost drawn is the blank one');";
if (src.split(L1).length !== 2 || src.split(L2).length !== 2) throw new Error('the two compares are not each found once');
const HELP = `
// ---- E's bite wrappers (probe copy only)
function zzShift(c, d, { dir = 'L', from = -1 } = {}) {
  if (!c || typeof c.lift !== 'function') return c;
  const mk = (x) => { const v = dir === 'U' ? x.U : x.L, k = x.s > from ? d : 0; return { s: x.s, seg: x.seg, pos: [x.pos[0] + k * v[0], x.pos[1] + k * v[1], x.pos[2] + k * v[2]], T: x.T, L: x.L, U: x.U, kvec: x.kvec, roll: x.roll, bankG: x.bankG, grade: x.grade }; };
  return { ...c, lift: (p) => { const q = c.lift(p); return { ...q, samples: q.samples.map(mk), segEnd: q.segEnd.map(mk) }; } };
}
const zzNoLift = (c) => { const { lift, ...r } = c; return r; };
const zzCopy = (c) => ({ ...c, lift: (p) => { const q = c.lift(p); return { ...q, samples: q.samples.slice() }; } });
`;
const A1 = 'P.shell.candidate(untouched)', B1 = 'P.shell.candidate(blank)', A2 = 'ghosts.at(-1)';
const V = {
  v0_unchanged: [L1, L1],
  v1_551_shift05: [L1, `  sameCandidate(zzShift(${A1}, 0), zzShift(${B1}, 0.5), 'the same piece');`],
  v1c_551_shift0_control: [L1, `  sameCandidate(zzShift(${A1}, 0), zzShift(${B1}, 0), 'the same piece');`],
  v2_553_shift05: [L2, `  sameCandidate(zzShift(${A2}, 0), zzShift(${B1}, 0.5), 'the ghost drawn is the blank one');`],
  v2c_553_shift0_control: [L2, `  sameCandidate(zzShift(${A2}, 0), zzShift(${B1}, 0), 'the ghost drawn is the blank one');`],
  v3_551_nolift: [L1, `  sameCandidate(${A1}, zzNoLift(${B1}), 'the same piece');`],
  v4_553_nolift: [L2, `  sameCandidate(${A2}, zzNoLift(${B1}), 'the ghost drawn is the blank one');`],
  v5_551_height05: [L1, `  sameCandidate(zzShift(${A1}, 0, { dir: 'U' }), zzShift(${B1}, 0.5, { dir: 'U' }), 'the same piece');`],
  v6_551_shift05_past50m: [L1, `  sameCandidate(zzShift(${A1}, 0, { from: 50 }), zzShift(${B1}, 0.5, { from: 50 }), 'the same piece');`],
  v7_551_shift5mm: [L1, `  sameCandidate(zzShift(${A1}, 0), zzShift(${B1}, 0.005), 'the same piece');`],
  v8_551_equal_copy_control: [L1, `  sameCandidate(${A1}, zzCopy(${B1}), 'the same piece');`],
  v9_P_style_one_side_0m: [L1, `  sameCandidate(${A1}, zzShift(${B1}, 0), 'the same piece');`],
};
const out = {};
for (const [name, [from, to]] of Object.entries(V)) {
  const f = path.join(T, 'app/test', `zz-e270b-${name}.test.js`);
  fs.writeFileSync(f, src.replace(from, to) + HELP);
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', '--test-name-pattern=a field left as shown builds the SAME piece', f], { cwd: T, encoding: 'utf8', maxBuffer: 64 << 20 });
  fs.unlinkSync(f);
  const tap = r.stdout || '', get = (k) => { const m = tap.match(new RegExp(`^# ${k} (\\d+)`, 'm')); return m ? +m[1] : null; };
  const why = (tap.match(/error: \|?-?\s*\n?\s*['"]?([^\n]*the two lifts[^\n]*|[^\n]*both carry a lift[^\n]*|[^\n]*Expected values[^\n]*)/) || [])[1] || null;
  out[name] = { exit: r.status, tests: get('tests'), pass: get('pass'), fail: get('fail'), why: why && why.slice(0, 200), tapBytes: tap.length };
  console.log(name, JSON.stringify(out[name]));
}
const left = fs.readdirSync(path.join(T, 'app/test')).filter((n) => n.startsWith('zz-e270b-'));
out._left = left.length; console.log('probe copies left:', left.length);
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

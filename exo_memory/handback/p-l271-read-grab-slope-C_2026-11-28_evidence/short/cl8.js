// cl8.js <evidence dir>: pane C, L271 section 8, R2. Reads my own section-2 runs (today.json.gz from c522ea6, branch.json.gz from cc4fa71, c271.js's cases;
// the follow line is the same at 16a93d1) for the two CHANGELOG sentences: the flat edge pieces' rim presses, and B's fixtures B- and B+ (T1).
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const dir = process.argv[2], load = (f) => JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(dir, f))).toString('utf8')).cases;
const A = load('today.json.gz'), B = load('branch.json.gz'), R = (x, n = 4) => (Number.isFinite(x) ? Math.round(x * 10 ** n) / 10 ** n : x);
console.log('cases', A.length, B.length);
console.log('\n(a) flat edge pieces, rim presses (u 1, -1), pulls out 3 and in 2');
for (let i = 0; i < A.length; i++) {
  const a = A[i], b = B[i];
  if (a.group !== 'C5 edge' || !/flat/.test(a.name) || Math.abs(a.u) !== 1 || !['out 3', 'in 2'].includes(a.gesture)) continue;
  if (a.err || b.err) { console.log('  ERR', a.name, a.u, a.gesture, a.err, b.err); continue; }
  console.log(`  ${a.name.padEnd(42)} u ${String(a.u).padStart(2)} ${a.gesture.padEnd(6)} chord ${R(a.chord.slopeDeg, 2)} | bank at s0 today ${R(a.bank.after - a.bank.before)} branch ${R(b.bank.after - b.bank.before)} | window max today ${R(a.bankMoveMaxDeg)} branch ${R(b.bankMoveMaxDeg)} | middle dh today ${R(a.mid.dh)} branch ${R(b.mid.dh)}`);
}
console.log('\n(b) B\'s fixtures, T1 (s 320, the right rim pulled 4 m out, r 30)');
for (let i = 0; i < A.length; i++) {
  const a = A[i], b = B[i];
  if (a.group !== 'C3 fixture') continue;
  const f = (c) => `across ${R(c.fromPointer.across)} up ${R(c.fromPointer.up)} total ${R(c.fromPointer.total)}; middle dh ${R(c.mid.dh)}; bank at s0 ${R(c.bank.after - c.bank.before)}`;
  console.log(`  ${a.name}: today ${f(a)}\n  ${' '.repeat(a.name.length)}  branch ${f(b)}`);
}

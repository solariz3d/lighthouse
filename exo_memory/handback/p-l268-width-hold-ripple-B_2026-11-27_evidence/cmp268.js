// cmp268.js (pane B, L268): two ripple268.js runs (before = e112a14, after = the fix) read against the registration: the bar on E's eight rows, the guards, and
// what else moved: the other lengths, E's sweep, a level head and typed widths (bytes), a Turn by corner, and every other channel of every held piece (its bytes
// without w, and its curve sampled every metre: the largest difference).   usage: node cmp268.js <before.json> <after.json>
'use strict';
const [A, B] = process.argv.slice(2).map((f) => require(require('path').resolve(f)));
const sgn = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);
const guard = (r) => r.joint === null && r.end.v === r.head.v && r.end.m === 0 && (r.head.m === 0 || (sgn(r.maxDev) === sgn(r.head.m) && r.maxDev !== 0));
const line = (a, b) => `swing ${(1000 * a.maxDev).toFixed(1)} -> ${(1000 * b.maxDev).toFixed(1)} mm (at ${a.maxDevAt} -> ${b.maxDevAt} m); over 1 mm until ${a.off1mmUntil} -> ${b.off1mmUntil} m (R ${b.R}); max|w''| ${a.maxW2} -> ${b.maxW2}; knots ${a.knots} -> ${b.knots}`;
function others(a, b) {
  const o = {}; for (const ch of Object.keys(a.others || {})) { let m = 0; a.others[ch].forEach((v, i) => { m = Math.max(m, Math.abs(v - b.others[ch][i])); }); o[ch] = m; }
  return o;
}
const fmtO = (o) => Object.entries(o).filter(([, m]) => m > 0).map(([ch, m]) => `${ch} ${m.toExponential(1)}`).join(', ') || 'none';
console.log('THE BAR (registered): on every row of E\'s table, over 1 mm until <= R, and guards 1-3');
let pass = 0;
A.table.forEach((a, i) => { const b = B.table[i], ok = b.off1mmUntil <= b.R && guard(b); if (ok) pass++; console.log(`  ${a.case}: ${line(a, b)}; guards ${guard(b) ? 'hold' : 'FAIL'}; ${ok ? 'MEETS' : 'MISSES'}`); });
console.log(`  -> ${pass} of ${A.table.length} rows meet the bar`);
console.log('\nOTHER LENGTHS (reported, not the bar)');
A.lengths.forEach((a, i) => { const b = B.lengths[i]; console.log(`  ${a.case}: ${a.refused || b.refused ? `refused ${a.refused || ''} / ${b.refused || ''}` : `${line(a, b)}; guards ${guard(b) ? 'hold' : 'FAIL'}`}`); });
const sw = A.sweep.map((a, i) => ({ a, b: B.sweep[i] })).filter(({ a }) => !a.refused && a.head.m !== 0);
console.log(`\nE'S SWEEP: ${sw.length} held cases; over 1 mm until <= R after: ${sw.filter(({ b }) => b.off1mmUntil <= b.R).length}; guards hold after: ${sw.filter(({ b }) => guard(b)).length}; the largest "over 1 mm until" before ${Math.max(...sw.map(({ a }) => a.off1mmUntil))} m, after ${Math.max(...sw.map(({ b }) => b.off1mmUntil))} m; swing / |head slope| before ${Math.min(...sw.map(({ a }) => Math.abs(a.maxDev / a.head.m))).toFixed(2)}-${Math.max(...sw.map(({ a }) => Math.abs(a.maxDev / a.head.m))).toFixed(2)} m, after ${Math.min(...sw.map(({ b }) => Math.abs(b.maxDev / b.head.m))).toFixed(2)}-${Math.max(...sw.map(({ b }) => Math.abs(b.maxDev / b.head.m))).toFixed(2)} m`);
console.log('\nEXTRA');
A.extra.forEach((a, i) => { const b = B.extra[i]; console.log(`  ${a.case}: piece ${a.piece === b.piece ? 'BYTE FOR BYTE the same' : 'differs'}; without w ${a.pieceNoW === b.pieceNoW ? 'the same' : 'differs'}; ${line(a, b)}; guards ${guard(b) ? 'hold' : 'FAIL'}`); });
console.log('\nTHE OTHER CHANNELS of the held pieces: bytes without w, and the largest difference of each channel\'s curve (sampled every metre)');
const all = [...A.table.map((a, i) => [a, B.table[i]]), ...A.lengths.map((a, i) => [a, B.lengths[i]]), ...A.extra.map((a, i) => [a, B.extra[i]]), ...A.sweep.map((a, i) => [a, B.sweep[i]])].filter(([a, b]) => !a.refused && !b.refused);
let sameNoW = 0, worst = {}; for (const [a, b] of all) { if (a.pieceNoW === b.pieceNoW) sameNoW++; const o = others(a, b); for (const [ch, m] of Object.entries(o)) worst[ch] = Math.max(worst[ch] || 0, m); }
console.log(`  ${all.length} pieces: bytes without w the same in ${sameNoW}; the largest curve difference per channel over all of them: ${fmtO(worst)}`);
for (const [a, b] of all.slice(0, 8)) console.log(`  ${a.case}: ${fmtO(others(a, b))}`);

// cmp271.js <today.json> <branch.json>: pane C, L271. Pairs c271.js's cases (the same order on both trees) and reads them per group.
'use strict';
const fs = require('fs');
const [A, B] = process.argv.slice(2).map((f) => JSON.parse(fs.readFileSync(f, 'utf8')).cases);
if (A.length !== B.length) throw new Error(`case counts differ: ${A.length} against ${B.length}`);
const R = (x, n = 4) => (Number.isFinite(x) ? Math.round(x * 10 ** n) / 10 ** n : x);
const groups = new Map();
A.forEach((a, i) => { const b = B[i]; if (a.name !== b.name || a.u !== b.u || a.gesture !== b.gesture) throw new Error(`case ${i} differs in kind`); const g = groups.get(a.group) || []; g.push([a, b]); groups.set(a.group, g); });
const dmax = (a, b) => { if (!a.d || !b.d) return null; return Math.max(...['h', 'l', 'w', 'phi'].map((k) => Math.abs((a.d[k] || 0) - (b.d[k] || 0)))); };
for (const [g, pairs] of groups) {
  const same = pairs.filter(([a, b]) => a.text && a.text === b.text).length, errA = pairs.filter(([a]) => a.err).length, errB = pairs.filter(([, b]) => b.err).length;
  const errOnlyB = pairs.filter(([a, b]) => b.err && !a.err).map(([, b]) => `${b.name} u ${b.u} ${b.gesture}: ${b.err}`);
  const nonfinite = pairs.filter(([a, b]) => (a.finite === false) || (b.finite === false)).length;
  console.log(`\n== ${g}: ${pairs.length} cases; saved text the same ${same}; errors today ${errA}, branch ${errB}; non-finite ${nonfinite}`);
  for (const e of errOnlyB.slice(0, 5)) console.log('   ERROR ONLY ON THE BRANCH:', e);
  for (const e of pairs.filter(([a]) => a.err).slice(0, 3)) console.log('   error (today):', e[0].name, 'u', e[0].u, e[0].gesture, e[0].err, '| branch:', e[1].err || 'ran');
  // by gesture kind
  const kinds = {};
  for (const [a, b] of pairs) { if (a.err || b.err) continue; const k = a.gesture.split(' ')[0]; (kinds[k] = kinds[k] || []).push([a, b]); }
  for (const [k, ps] of Object.entries(kinds)) {
    const s = ps.filter(([a, b]) => a.text === b.text).length, dm = Math.max(...ps.map(([a, b]) => dmax(a, b)));
    const bmA = Math.max(...ps.map(([a]) => a.bankMoveMaxDeg)), bmB = Math.max(...ps.map(([, b]) => b.bankMoveMaxDeg));
    const worse = ps.filter(([a, b]) => b.bankMoveMaxDeg > a.bankMoveMaxDeg + 1e-6);
    const farB = Math.max(...ps.map(([, b]) => b.far)), farA = Math.max(...ps.map(([a]) => a.far));
    const ptA = Math.max(...ps.map(([a]) => a.fromPointer.total)), ptB = Math.max(...ps.map(([, b]) => b.fromPointer.total));
    console.log(`   ${k.padEnd(5)} ${ps.length} cases, same text ${s}, follow differs by up to ${R(dm, 6)}; bank moves up to: today ${R(bmA)}°, branch ${R(bmB)}°; branch turns MORE than today in ${worse.length}; far rim moves up to ${R(farA)} / ${R(farB)} m; point from the pointer up to ${R(ptA)} / ${R(ptB)} m`);
    for (const [a, b] of worse.slice(0, 4)) console.log(`      MORE: ${a.name} u ${a.u} ${a.gesture}: today ${R(a.bankMoveMaxDeg)}°, branch ${R(b.bankMoveMaxDeg)}° (chord slope ${R(a.chord.slopeDeg, 2)}°)`);
  }
}
// the detail tables the hand-back quotes
const detail = (filter) => A.map((a, i) => [a, B[i]]).filter(([a]) => filter(a)).filter(([a, b]) => !a.err && !b.err).map(([a, b]) => ({
  name: a.name, u: a.u, g: a.gesture, chordSlope: R(a.chord.slopeDeg, 2),
  today: { bank: R(a.bank.after - a.bank.before, 4), dw: R(a.width.after - a.width.before), dh: R(a.mid.dh), dl: R(a.mid.dl), ptAcross: R(a.fromPointer.across), ptUp: R(a.fromPointer.up), bankWin: R(a.bankMoveMaxDeg) },
  branch: { bank: R(b.bank.after - b.bank.before, 4), dw: R(b.width.after - b.width.before), dh: R(b.mid.dh), dl: R(b.mid.dl), ptAcross: R(b.fromPointer.across), ptUp: R(b.fromPointer.up), bankWin: R(b.bankMoveMaxDeg) } }));
fs.writeFileSync('detail.json', JSON.stringify({
  fixtures: detail((a) => a.group.startsWith('C3 fixture')),
  c5: detail((a) => a.group.startsWith('C5') && (a.gesture === 'out 3' || a.gesture === 'lift 1.5')),
  c3: detail((a) => a.group === 'C3 banked' && a.gesture === 'out 4'),
  control: detail((a) => a.group.startsWith('C2 control') && a.gesture === 'out 3'),
}, null, 1));
console.log('\ndetail.json written');

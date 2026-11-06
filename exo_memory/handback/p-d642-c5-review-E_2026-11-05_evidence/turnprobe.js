// usage: node turnprobe.js <tree>   his picture (750 m, bank 66.14 rounded, cup 15.5, width 31, the extra bank to 0 from F) laid by the core, WITH his −90 corner and WITHOUT it
// (the probe lays the bank on a straight): the built roll peak ÷ the bar over the change and 20 m on, my reader; and what extend.spanHolds says for that span
'use strict';
const path = require('path'), R = path.resolve(process.argv[2]), q = (m) => require(path.join(R, m));
const D = q('src/core/document.js'), A = q('src/core/adapter.js'), TB = q('src/core/turnby.js'), X = q('src/core/extend.js');
const DEG = Math.PI / 180, BAR = 29.4 / (10 * 170 * 170);
const flat = X.extend(D.createDoc('g'), { length: 1000, family: 'bowl' });
const peak = (d, s0, s1) => { const S = A.toPath(d).path.samples, r = (s) => { let lo = 0, hi = S.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].s <= s) lo = m; else hi = m; } return S[lo].roll; }; let m = 0, at = 0; for (let s = s0; s <= s1; s += 0.5) { const v = Math.abs(r(s + 2) - 2 * r(s) + r(s - 2)) / 4; if (v > m) { m = v; at = s; } } return [+(m / BAR).toFixed(3), at]; };
for (const F of [375, 377, 380, 419, 430]) {
  const row = [`from ${F}: spanHolds ${X.spanHolds('phi', 66.14 * DEG, 0, { step: 66.14 * DEG, length: 750 }, 750 - F)}`];
  for (const [what, turn] of [['with the −90 corner', { turnDeg: -90 }], ['straight (no turn)', {}]]) {
    let d; try { d = TB.extendCorner(flat, { length: 750, ...turn, targets: { phi: 66.14 * DEG, c: 15.5, w: 31 }, bankShape: 'rounded', changes: { phi: [{ from: F, target: 0 }] } }); } catch (e) { row.push(`${what}: refused ${e.code}`); continue; }
    d = TB.extendCorner(d, { length: 200 }); const [p, at] = peak(d, 1000 + F - 20, 1000 + 750 + 20); row.push(`${what}: ${p} × the bar at s ${at}`);
  }
  console.log(row.join(' | '));
}

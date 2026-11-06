// usage: node r2bar.js <tree>   R2's own case (B §5, C's r2-core-alone): 750 m, −90 corner, bank 66.14 rounded, cup 15.5, the extra bank to 0 from a mark; the built roll peak ÷ the bar,
// the same reader as p2bar.js, to check it reads what B and C read (1.174 at 477.42 on 923e0a3)
'use strict';
const path = require('path'), R = path.resolve(process.argv[2]), q = (m) => require(path.join(R, m));
const D = q('src/core/document.js'), A = q('src/core/adapter.js'), TB = q('src/core/turnby.js'), X = q('src/core/extend.js');
const DEG = Math.PI / 180, BAR = 29.4 / (10 * 170 * 170);
const flat = X.extend(D.createDoc('g'), { length: 1000, family: 'bowl' });
for (const from of [477.42, 450, 430, 387.7]) {
  let d; try { d = TB.extendCorner(flat, { length: 750, turnDeg: -90, targets: { phi: 66.14 * DEG, c: 15.5 }, bankShape: 'rounded', changes: { phi: [{ from, target: 0 }] } }); }
  catch (e) { console.log(`${path.basename(R)} from ${from}: refused ${e.code}`); continue; }
  d = TB.extendCorner(d, { length: 200 });
  const S = A.toPath(d).path.samples, r = (s) => { let lo = 0, hi = S.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].s <= s) lo = m; else hi = m; } return S[lo].roll; };
  let m = 0, at = 0; for (let s = 1002; s <= 1770; s += 0.5) { const v = Math.abs(r(s + 2) - 2 * r(s) + r(s - 2)) / 4; if (v > m) { m = v; at = s; } }
  console.log(`${path.basename(R)} from ${from}: built roll peak ${(m / BAR).toFixed(3)} × the bar at s ${at}`);
}

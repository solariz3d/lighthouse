// usage: node p2bar.js <tree>   his p2 at the core (the panel's options for C's case 3): 1,000 m, −90 corner, bank 88.45 rounded, cup 15.5, width 31, extra turn +180 and extra bank
// to −88.45 both from 500; the built roll acceleration ÷ the bar (2 m second differences of the adapter's roll, as core_additive.test.js builtRollPeak), piece and 20 m on
'use strict';
const path = require('path'), R = path.resolve(process.argv[2]), q = (m) => require(path.join(R, m));
const D = q('src/core/document.js'), A = q('src/core/adapter.js'), TB = q('src/core/turnby.js'), X = q('src/core/extend.js');
const DEG = Math.PI / 180, BAR = 29.4 / (10 * 170 * 170);
const flat = X.extend(D.createDoc('g'), { length: 1000, family: 'bowl' });
for (const tgt of [-88.45, -37.53]) {
  let d; try { d = TB.extendCorner(flat, { length: 1000, turnDeg: -90, targets: { phi: 88.45 * DEG, c: 15.5, w: 31 }, bankShape: 'rounded', changes: { turnDeg: [{ from: 500, deg: 180 }], phi: [{ from: 500, target: tgt * DEG }] } }); }
  catch (e) { console.log(`${path.basename(R)} extra bank to ${tgt}: refused ${e.code}: ${String(e.message).slice(0, 110)}`); continue; }
  d = TB.extendCorner(d, { length: 200 });
  const S = A.toPath(d).path.samples, r = (s) => { let lo = 0, hi = S.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].s <= s) lo = m; else hi = m; } return S[lo].roll; };
  let m = 0, at = 0; for (let s = 1002; s <= 2020; s += 0.5) { const v = Math.abs(r(s + 2) - 2 * r(s) + r(s - 2)) / 4; if (v > m) { m = v; at = s; } }
  console.log(`${path.basename(R)} extra bank to ${tgt}: laid; built roll peak ${(m / BAR).toFixed(3)} × the bar at s ${at}`);
}

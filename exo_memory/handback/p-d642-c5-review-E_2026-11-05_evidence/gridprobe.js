// usage: node gridprobe.js <tree>   is the 1° grid safe? his picture's piece (750 m, bank 66.14 rounded), the extra from 377 (span 373) to several targets: the built peak (my reader)
// for the exact change and for changes around it, including the one spanHolds actually probes (rounded UP to the next whole degree: 66.14 -> 67, the target -0.86)
'use strict';
const path = require('path'), R = path.resolve(process.argv[2]), q = (m) => require(path.join(R, m));
const D = q('src/core/document.js'), A = q('src/core/adapter.js'), TB = q('src/core/turnby.js'), X = q('src/core/extend.js');
const DEG = Math.PI / 180, BAR = 29.4 / (10 * 170 * 170);
const flat = X.extend(D.createDoc('g'), { length: 1000, family: 'bowl' });
const peak = (d, s0, s1) => { const S = A.toPath(d).path.samples, r = (s) => { let lo = 0, hi = S.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].s <= s) lo = m; else hi = m; } return S[lo].roll; }; let m = 0; for (let s = s0; s <= s1; s += 0.5) m = Math.max(m, Math.abs(r(s + 2) - 2 * r(s) + r(s - 2)) / 4); return +(m / BAR).toFixed(3); };
for (const F of [377, 419]) for (const tgt of [1, 0.5, 0.14, 0, -0.5, -0.86, -1, -2]) {
  let d; try { d = TB.extendCorner(flat, { length: 750, targets: { phi: 66.14 * DEG }, bankShape: 'rounded', changes: { phi: [{ from: F, target: tgt * DEG }] } }); } catch (e) { console.log(`from ${F} to ${tgt} (change ${(66.14 - tgt).toFixed(2)}°): refused ${e.code}`); continue; }
  d = TB.extendCorner(d, { length: 200 });
  console.log(`from ${F} to ${tgt} (change ${(66.14 - tgt).toFixed(2)}°): laid; spanHolds ${X.spanHolds('phi', 66.14 * DEG, tgt * DEG, { step: 66.14 * DEG, length: 750 }, 750 - F)}; built peak ${peak(d, 1000 + F - 20, 1770)} × the bar`);
}

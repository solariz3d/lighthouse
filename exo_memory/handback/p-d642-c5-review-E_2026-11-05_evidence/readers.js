// usage: node readers.js <tree>   one road, two readers: his picture's piece (750 m, bank 66.14 rounded, the extra to 0 from F) after a straight, a 200 m straight after.
//  plan: the probe's reader (extend.js probePeak): bankPlan's own function (plan[i].fn), every 0.5 m, 2 m second differences ÷ 4
//  path: the rows' reader (core_additive.test.js builtRollPeak): the adapter's built path, the roll at the station at or before s, the same differences
// over the same window (20 m before the mark to 20 m after the piece). And the probe's own track (a 400 m straight first) through the plan reader, as probePeak lays it.
'use strict';
const path = require('path'), R = path.resolve(process.argv[2]), q = (m) => require(path.join(R, m));
const D = q('src/core/document.js'), A = q('src/core/adapter.js'), X = q('src/core/extend.js');
const DEG = Math.PI / 180, BAR = 29.4 / (10 * 170 * 170);
function road(hold, F) { let d = X.extend(D.createDoc('g'), { length: hold, family: 'bowl' }); d = X.extend(d, { length: 750, targets: { phi: 66.14 * DEG }, bankShape: 'rounded', changes: { phi: [{ from: F, target: 0 }] } }); return X.extend(d, { length: 200 }); }
function planPeak(d, hold, F) { const plan = A.bankPlan(d), ends = [0, hold, hold + 750, hold + 950]; const r = (s) => { const i = s < ends[1] ? 0 : s < ends[2] ? 1 : 2, t = Math.min(d.pieces[i].length, Math.max(0, s - ends[i])); return plan[i].fn ? plan[i].fn(t) : D.channelAt(d.pieces[i], 'phi', t).v; };
  let m = 0, at = 0; for (let s = hold + F - 20; s <= hold + 770; s += 0.5) { const v = Math.abs(r(s + 2) - 2 * r(s) + r(s - 2)) / 4; if (v > m) { m = v; at = s - hold; } } return [+(m / BAR).toFixed(3), at]; }
function pathPeak(d, hold, F) { const S = A.toPath(d).path.samples, r = (s) => { let lo = 0, hi = S.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].s <= s) lo = m; else hi = m; } return S[lo].roll; };
  let m = 0, at = 0; for (let s = hold + F - 20; s <= hold + 770; s += 0.5) { const v = Math.abs(r(s + 2) - 2 * r(s) + r(s - 2)) / 4; if (v > m) { m = v; at = s - hold; } } return [+(m / BAR).toFixed(3), at]; }
let prevProbing; try { X.extend; } catch (e) { /* none */ }
for (const F of [375, 377, 419]) {
  let d1; try { d1 = road(1000, F); } catch (e) { console.log(`from ${F}: refused ${e.code}`); continue; }
  console.log(`from ${F}: after 1,000 m straight: plan reader ${planPeak(d1, 1000, F).join(' at ')} | path reader ${pathPeak(d1, 1000, F).join(' at ')}`);
}

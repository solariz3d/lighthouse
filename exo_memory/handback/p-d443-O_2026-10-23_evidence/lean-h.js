'use strict';
// D443 (O): at every closer station the bank test's lean() counts OUT (asin(U·κ̂) < −5°, κ the 3-D curvature), the lean read against the HORIZONTAL curvature
// alone (κ with its component along the world's up, ŷ, removed: the turn the road makes in plan) beside it. If a station leans out only in 3-D, the crest
// (κ·ŷ < 0) is what reads as out. P's pitched laps (pitch440.js's construction), finished by one tree.   node lean-h.js <tree> <kv> <tail> <roll>
const path = require('path'), T = path.resolve(process.argv[2]), [kv, tail, roll] = process.argv.slice(3).map(Number);
const D = require(path.join(T, 'src/core/document.js')), AD = require(path.join(T, 'src/core/adapter.js')), F = require(path.join(T, 'src/core/finish.js'));
const { extend } = require(path.join(T, 'src/core/extend.js')), { extendTurnBy } = require(path.join(T, 'src/core/turnby.js')), DEG = Math.PI / 180;
let d = D.createDoc('p'); d = extend(d, { length: 1000, family: 'bowl', first: { c: 10 } }); d = extendTurnBy(d, { length: 1500, targets: { kv: 0 } }, 180 * DEG);
d = extend(d, { length: 300, targets: { kv } }); d = extend(d, { length: 100, targets: { kv: 0 } });
const open = extend(d, { length: tail, targets: { c: 35, phi: roll * DEG } }), r = F.finishToStart(open);
const { segments, path: p } = AD.toPath(r.doc, { step: 2 }), ids = new Set(r.doc.pieces.slice(open.pieces.length).map((P) => P.id));
let out3 = 0, outH = 0, worstH = 90, worst3 = 90;
for (const q of p.samples) {
  if (!ids.has(segments[q.seg].id)) continue; const k = q.kvec, km = Math.hypot(...k); if (km < 1 / 600) continue;
  const l3 = Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[1] * k[1] + q.U[2] * k[2]) / km))) / DEG; if (l3 >= -5) continue;
  out3++; worst3 = Math.min(worst3, l3);
  const kh = [k[0], 0, k[2]], khm = Math.hypot(k[0], k[2]), lh = khm > 1e-9 ? Math.asin(Math.max(-1, Math.min(1, (q.U[0] * kh[0] + q.U[2] * kh[2]) / khm))) / DEG : 0;
  worstH = Math.min(worstH, lh); if (lh < -5) outH++;
}
console.log(`kv ${kv}/${tail}/${roll}: ${r.plan.word} ${r.plan.lengthM} m | out in 3-D ${out3} (worst ${out3 ? worst3.toFixed(1) : '-'}°) | of those, out against the horizontal turn alone ${outH} (worst ${out3 ? worstH.toFixed(1) : '-'}°)`);

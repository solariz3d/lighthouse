'use strict';
const path = require('path'); const T = path.resolve(process.argv[2]); const DEG = Math.PI / 180, G = 9.81;
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js')), { extendTurnBy } = require(path.join(T, 'src/core/turnby.js')), F = require(path.join(T, 'src/core/finish.js')), AD = require(path.join(T, 'src/core/adapter.js'));
const v = 460 / 3.6;
function lean(doc, from) { const { segments, path: p } = AD.toPath(doc, { step: 2 }), ids = new Set(doc.pieces.slice(from).map((P) => P.id)); let n = 0, out = 0, sum = 0, lat = 0, at = null;
  for (const q of p.samples) { if (!ids.has(segments[q.seg].id)) continue; const k = q.kvec, kh = Math.hypot(k[0], k[2]); if (kh < 1 / 600) continue; const l = Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[2] * k[2]) / kh))) / DEG; const f = [v * v * k[0], v * v * k[1] + G, v * v * k[2]]; n++; sum += l; if (l < -5) out++; const L = Math.abs((f[0] * q.L[0] + f[1] * q.L[1] + f[2] * q.L[2]) / G); if (L > lat) { lat = L; at = { s: q.s, id: segments[q.seg].id, lean: l, kh }; } }
  return { n, out, mean: sum / n, lat, at }; }
for (const [turnDeg, tailM, rollDeg] of [[210, 300, 30], [180, 1200, 10]]) {
  let d = D.createDoc('P'); d = extend(d, { length: 1000, family: 'bowl', first: { c: 10 } }); d = extendTurnBy(d, { length: 1500, targets: { kv: 0 } }, turnDeg * DEG); d = extend(d, { length: tailM, targets: { c: 35, phi: rollDeg * DEG } });
  const n0 = d.pieces.length, r = F.finishToStart(d); const L = lean(r.doc, n0);
  console.log(`turn ${turnDeg} tail ${tailM} roll ${rollDeg}: lat ${L.lat.toFixed(2)} g at s ${L.at && L.at.s} (${L.at && L.at.id}, lean ${L.at && L.at.lean.toFixed(1)}°, kh ${L.at && L.at.kh.toExponential(2)}), out ${L.out} of ${L.n}, mean ${L.mean.toFixed(1)}; report ${r.plan.report.slice(0, 90)}`);
  console.log('  tail piece phi points', d.pieces[n0 - 1].channels.phi.map((x) => +(x / DEG).toFixed(2)).join(','), '| kh', d.pieces[n0 - 1].channels.kh.map((x) => x.toExponential(1)).join(','));
}

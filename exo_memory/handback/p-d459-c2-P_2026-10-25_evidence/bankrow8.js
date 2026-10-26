'use strict';
const path = require('path'); const T = path.resolve(process.argv[2]); const DEG = Math.PI / 180, G = 9.81, v = 460 / 3.6;
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js')), { extendTurnBy } = require(path.join(T, 'src/core/turnby.js')), F = require(path.join(T, 'src/core/finish.js')), AD = require(path.join(T, 'src/core/adapter.js'));
function lean(doc, from) { const { segments, path: p } = AD.toPath(doc, { step: 2 }), ids = new Set(doc.pieces.slice(from).map((P) => P.id)); let lat = 0, at = null;
  for (const q of p.samples) { if (!ids.has(segments[q.seg].id)) continue; const k = q.kvec, kh = Math.hypot(k[0], k[2]); if (kh < 1 / 600) continue; const f = [v * v * k[0], v * v * k[1] + G, v * v * k[2]]; const L = Math.abs((f[0] * q.L[0] + f[1] * q.L[1] + f[2] * q.L[2]) / G); if (L > lat) { lat = L; at = { s: Math.round(q.s), id: segments[q.seg].id, bank: (Math.asin(Math.max(-1, Math.min(1, -q.L[1]))) / DEG).toFixed(1), kh: kh.toExponential(2) }; } }
  return { lat, at }; }
// row 8's lap, core_finish_bank.test.js:175-177
let d = D.createDoc('banked'); d = extend(d, { length: 400 }); d = extendTurnBy(d, { length: 500 }, -150 * DEG); d = extend(d, { length: 200 }); d = extend(d, { length: 200, transition: 100, targets: { phi: 54 * DEG } }); d = extend(d, { length: 100, targets: { kv: 0 } });
const n0 = d.pieces.length, r = F.finishToStart(d), L = lean(r.doc, n0);
console.log(`rollFirst ${r.plan.rollFirst} lat ${L.lat.toFixed(2)} g at ${JSON.stringify(L.at)}; ${r.plan.report.slice(0, 140)}`);
for (const P of r.doc.pieces.slice(n0)) console.log('  ', P.id, 'L', P.length, 'phi', P.channels.phi.map((x) => +(x / DEG).toFixed(1)).join(','));

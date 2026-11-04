'use strict';
// D443 (O): P's pitched family (pitch440.js's construction: cup 10°, a 180° turn over 1,500 m, 300 m pitched by kv, 100 m back to level, then the tail rolling
// and cupping to 35°) and P's tight family (leanout440.js's: turn over 400/600/800 m, tail 600/1,200 m, end rolled ±10/±30/±54°), finished by one tree:
// the route, its length, the closer's stations out, the peak side load, and the time.   node family.js <tree> pitched|tight
const path = require('path'), T = path.resolve(process.argv[2]), FAM = process.argv[3] || 'pitched';
const D = require(path.join(T, 'src/core/document.js')), AD = require(path.join(T, 'src/core/adapter.js')), F = require(path.join(T, 'src/core/finish.js'));
const { extend } = require(path.join(T, 'src/core/extend.js')), { extendTurnBy } = require(path.join(T, 'src/core/turnby.js')), { MACH6, G } = require(path.join(T, 'src/validate/limits.js'));
const v = MACH6.designSpeedKmh / 3.6, DEG = Math.PI / 180;
function lean(doc, from) {
  const { segments, path: p } = AD.toPath(doc, { step: 2 }), ids = new Set(doc.pieces.slice(from).map((P) => P.id)); let n = 0, out = 0, lat = 0;
  for (const q of p.samples) { if (!ids.has(segments[q.seg].id)) continue; const k = q.kvec, km = Math.hypot(...k); if (km < 1 / 600) continue;
    n++; if (Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[1] * k[1] + q.U[2] * k[2]) / km))) < -5 * DEG) out++; lat = Math.max(lat, Math.abs((v * v * k[0] * q.L[0] + (v * v * k[1] + G) * q.L[1] + v * v * k[2] * q.L[2]) / G)); }
  return { n, out, lat };
}
const laps = [];
if (FAM === 'pitched') for (const kv of [-0.0003, -0.0006, -0.001, 0.0006]) for (const tail of [300, 600]) for (const roll of [0, 10]) laps.push([`kv ${kv}/${tail}/${roll}`, () => {
  let d = D.createDoc('p'); d = extend(d, { length: 1000, family: 'bowl', first: { c: 10 } }); d = extendTurnBy(d, { length: 1500, targets: { kv: 0 } }, 180 * DEG);
  d = extend(d, { length: 300, targets: { kv } }); d = extend(d, { length: 100, targets: { kv: 0 } }); return extend(d, { length: tail, targets: { c: 35, phi: roll * DEG } }); }]);
else for (const turn of [150, 180, 210]) for (const tl of [400, 600, 800]) for (const tail of [600, 1200]) for (const roll of [10, -10, 30, -30, 54, -54]) laps.push([`turn ${turn}/${tl} tail ${tail} roll ${roll}`, () => {
  let d = D.createDoc('p'); d = extend(d, { length: 1000, family: 'bowl', first: { c: 10 } }); d = extendTurnBy(d, { length: tl, targets: { kv: 0 } }, turn * DEG); return extend(d, { length: tail, targets: { c: 35, phi: roll * DEG } }); }]);
let total = 0;
for (const [name, mk] of laps) {
  const open = mk(), t0 = Date.now(); let r;
  try { r = F.finishToStart(open); } catch (e) { const t = (Date.now() - t0) / 1000; total += t; console.log(`${name} | REFUSED ${e.code} | ${t.toFixed(1)} s`); continue; }
  const t = (Date.now() - t0) / 1000, L = lean(r.doc, open.pieces.length); total += t;
  console.log(`${name} | ${r.plan.word} R${Math.round(r.plan.radiusM)} ${r.plan.rollM ? (r.plan.rollFirst ? 'first' : 'last') : 'none'}${r.plan.seamM ? ' seam ' + r.plan.seamM : ''} | ${r.plan.lengthM} m | out ${L.out}/${L.n} | ${L.lat.toFixed(2)} g | ${t.toFixed(1)} s`);
}
console.log(`total ${total.toFixed(1)} s over ${laps.length} laps`);

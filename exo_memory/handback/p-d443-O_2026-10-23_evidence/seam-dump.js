'use strict';
// D443 (O): one pitched lap of P's (pitch440.js's construction) finished by a tree, and every curved station of the closer that leans out by more than 5°,
// with where it is (piece, metres into it, metres before the seam), the lean, the bank (phi, deg), and the horizontal / vertical curvature (1/m).
//   node seam-dump.js <tree> <kv> <tail> <roll>
const path = require('path'), T = path.resolve(process.argv[2]), [kv, tail, roll] = process.argv.slice(3).map(Number);
const D = require(path.join(T, 'src/core/document.js')), AD = require(path.join(T, 'src/core/adapter.js')), F = require(path.join(T, 'src/core/finish.js'));
const { extend } = require(path.join(T, 'src/core/extend.js')), { extendTurnBy } = require(path.join(T, 'src/core/turnby.js')), DEG = Math.PI / 180;
let d = D.createDoc('p'); d = extend(d, { length: 1000, family: 'bowl', first: { c: 10 } }); d = extendTurnBy(d, { length: 1500, targets: { kv: 0 } }, 180 * DEG);
d = extend(d, { length: 300, targets: { kv } }); d = extend(d, { length: 100, targets: { kv: 0 } });
const open = extend(d, { length: tail, targets: { c: 35, phi: roll * DEG } }), r = F.finishToStart(open), doc = r.doc;
console.log(r.plan.report.slice(0, 160));
const { segments, path: p } = AD.toPath(doc, { step: 2 }), ids = new Set(doc.pieces.slice(open.pieces.length).map((P) => P.id)), LAP = p.lengthM;
const s0 = {}; { let a = 0; for (const P of doc.pieces) { s0[P.id] = a; a += P.length; } }
let shown = 0;
for (const q of p.samples) {
  const g = segments[q.seg]; if (!ids.has(g.id)) continue; const k = q.kvec, km = Math.hypot(...k); if (km < 1 / 600) continue;
  const l = Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[1] * k[1] + q.U[2] * k[2]) / km))) / DEG;
  if (l >= -5) continue;
  const P = doc.pieces.find((x) => x.id === g.id), into = q.s - s0[g.id], phi = D.valuesAt(P, Math.max(0, Math.min(P.length, into))).phi / DEG;
  if (shown++ < 14) console.log(`  ${g.id} +${into.toFixed(0)} m (${(LAP - q.s).toFixed(0)} m before the seam): lean ${l.toFixed(1)}°, bank ${phi.toFixed(2)}°, κh ${Math.hypot(k[0], k[2]).toExponential(2)}, κv ${k[1].toExponential(2)}`);
}
console.log(`  ${shown} stations out; last piece ${doc.pieces.at(-1).id} ${doc.pieces.at(-1).length.toFixed(0)} m, bank at its end ${(D.valuesAt(doc.pieces.at(-1), doc.pieces.at(-1).length).phi / DEG).toFixed(2)}°, p1's ${(D.valuesAt(doc.pieces[0], 0).phi / DEG).toFixed(2)}°`);

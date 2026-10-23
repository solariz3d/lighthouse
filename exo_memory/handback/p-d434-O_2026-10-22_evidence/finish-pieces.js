'use strict';
// D434 build (O): finish one open lap on one tree and print the plan, then per new piece: length, turn, the bank channel's largest change from its start (degrees),
// curved stations, mean lean into the curve, stations leaning out by > 5°, peak side load at the design speed (the validator's formula, centreline).
//   node finish-pieces.js <tree> <open .t180track | undo file> [past index]
const [TREE, FILE, K] = process.argv.slice(2);
const fs = require('fs'), D = require(`${TREE}/src/core/document.js`), F = require(`${TREE}/src/core/finish.js`), AD = require(`${TREE}/src/core/adapter.js`), { MACH6, G } = require(`${TREE}/src/validate/limits.js`);
const txt = fs.readFileSync(FILE, 'utf8'), open = K === undefined ? D.parse(txt) : D.parse(JSON.parse(txt).past[Number(K)]);
const v = MACH6.designSpeedKmh / 3.6, t0 = Date.now(), r = F.finishToStart(open), n0 = open.pieces.length;
console.log(`plan: ${r.plan.report} (${Date.now() - t0} ms)`);
const { segments, path } = AD.toPath(r.doc, { step: 2 });
for (const P of r.doc.pieces.slice(n0)) {
  let n = 0, lean = 0, out = 0, lat = 0, turn = 0;
  for (const q of path.samples) { if (segments[q.seg].id !== P.id) continue; const k = q.kvec, km = Math.hypot(...k); if (km < 1 / 600) continue; const l = Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[1] * k[1] + q.U[2] * k[2]) / km))) * 180 / Math.PI, f = [v * v * k[0], v * v * k[1] + G, v * v * k[2]]; n++; lean += l; if (l < -5) out++; lat = Math.max(lat, Math.abs((f[0] * q.L[0] + f[1] * q.L[1] + f[2] * q.L[2]) / G)); }
  for (let i = 0; i < 400; i++) turn += (D.valuesAt(P, (P.length * (i + 0.5)) / 400).kh * P.length) / 400;
  const bank = Math.max(...P.channels.phi.map((x) => Math.abs(x - P.channels.phi[0]))) * 180 / Math.PI;
  console.log(JSON.stringify({ piece: P.id, lengthM: Math.round(P.length), turnDeg: +(turn * 180 / Math.PI).toFixed(1), maxBankChangeDeg: +bank.toFixed(1), curved: n, meanLean: n ? +(lean / n).toFixed(1) : null, out, maxLatG: +lat.toFixed(2) }));
}

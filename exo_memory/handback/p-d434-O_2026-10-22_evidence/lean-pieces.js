'use strict';
// D434 (O): per piece of a saved track, from piece index <from> on: its bank channel (phi, degrees) at start / middle / end, its turn, its pitch range, and over its
// curved stations (|k| > 1/600 m) the lean into the curve (the librarian's lean.js: asin(U·k̂), + into) and the stations leaning out by more than 5°; and the
// validator's centreline load across the road (fLat = (v²κ⃗ + g·ŷ)·L / g) at the design speed. Read only.   node lean-pieces.js <tree> <track file> <from index>
const [TREE, FILE, FROM] = process.argv.slice(2);
const fs = require('fs'), D = require(`${TREE}/src/core/document.js`), AD = require(`${TREE}/src/core/adapter.js`), { MACH6, G } = require(`${TREE}/src/validate/limits.js`);
const v = MACH6.designSpeedKmh / 3.6, doc = D.parse(fs.readFileSync(FILE, 'utf8')), { segments, path } = AD.toPath(doc, { step: 2 });
const deg = (x) => +((x * 180) / Math.PI).toFixed(1);
for (let p = Number(FROM); p < doc.pieces.length; p++) {
  const P = doc.pieces[p]; if (P.type !== 'road') continue;
  let n = 0, lean = 0, out = 0, lat = 0, turn = 0; const pitch = [];
  for (const q of path.samples) {
    if (segments[q.seg].id !== P.id) continue;
    pitch.push(Math.asin(Math.max(-1, Math.min(1, q.T[1]))));
    const k = q.kvec, km = Math.hypot(...k); if (km < 1 / 600) continue;
    const kh = k.map((x) => x / km), l = (Math.asin(Math.max(-1, Math.min(1, q.U[0] * kh[0] + q.U[1] * kh[1] + q.U[2] * kh[2]))) * 180) / Math.PI;
    const f = [v * v * k[0], v * v * k[1] + G, v * v * k[2]];
    n++; lean += l; if (l < -5) out++; lat = Math.max(lat, Math.abs((f[0] * q.L[0] + f[1] * q.L[1] + f[2] * q.L[2]) / G));
  }
  for (let i = 0; i < 400; i++) turn += (D.valuesAt(P, (P.length * (i + 0.5)) / 400).kh * P.length) / 400;
  const ph = (s) => deg(D.valuesAt(P, s).phi);
  console.log(JSON.stringify({ piece: P.id, lengthM: Math.round(P.length), turnDeg: deg(turn), bankDeg: [ph(0), ph(P.length / 2), ph(P.length)], pitchDeg: [deg(Math.min(...pitch)), deg(Math.max(...pitch))], curved: n, meanLeanInto: n ? +(lean / n).toFixed(1) : null, out, maxLatG: +lat.toFixed(2) }));
}

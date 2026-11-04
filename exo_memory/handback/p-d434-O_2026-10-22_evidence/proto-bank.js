'use strict';
// D434 (O), PROTOTYPE, outside the tree: what a bank sized from the curve does to a Finish closer. The laid route finishToStart hands to its windowed close is
// captured (close.js's export wrapped before finish.js loads; the close whose result finishToStart RETURNS, not the first that converged); each laid piece's phi control points gain sigma·atan(v²·kh_i / g) (kh_i its turn-rate control
// point, v the validator's design speed); the banked route is closed with the same windowed close; then over the closer, at the design speed, on the centreline:
// the lean into the curve (the librarian's lean.js: asin(U·k̂), + into), and the validator's load formula f = v²κ⃗ + g·ŷ projected on U (fN) and across (fLat).
//   node proto-bank.js <tree> <undo file> <past index> <sigma: 1|-1|0>
const [TREE, UNDO, K, SIG] = process.argv.slice(2), sigma = Number(SIG);
const fs = require('fs'), CM = require(`${TREE}/src/core/close.js`), c0 = CM.close; let laid = null, win = null;
const seen = []; CM.close = function (doc, opts) { const r = c0(doc, opts); if (opts && opts.window && r.converged) seen.push({ doc, window: opts.window, out: r.doc }); return r; };   // every converged windowed close; the one finishToStart returns is picked below
const D = require(`${TREE}/src/core/document.js`), F = require(`${TREE}/src/core/finish.js`), AD = require(`${TREE}/src/core/adapter.js`);
const { MACH6, G } = require(`${TREE}/src/validate/limits.js`), v = MACH6.designSpeedKmh / 3.6;
const open = D.parse(JSON.parse(fs.readFileSync(UNDO, 'utf8')).past[Number(K)]);
const fin = F.finishToStart(open), pick = seen.find((x) => x.out === fin.doc); if (!pick) throw new Error("the returned finish is not one of the captured closes"); laid = pick.doc; win = pick.window;
const banked = D.checkDoc({ ...laid, pieces: laid.pieces.map((P, p) => (!win.includes(p) || P.type !== 'road' ? P : { ...P, channels: { ...P.channels, phi: P.channels.phi.map((ph, i) => ph + sigma * Math.atan((v * v * P.channels.kh[i]) / G)) } })) });
const r = c0(banked, { window: win });
const { segments, path } = AD.toPath(r.doc, { step: 2 }), ids = new Set(win.map((p) => r.doc.pieces[p].id));
let n = 0, lean = 0, out = 0, maxLat = 0, maxN = 0, sumLat = 0;
for (const q of path.samples) {
  if (!ids.has(segments[q.seg].id)) continue;
  const k = q.kvec, km = Math.hypot(...k); if (km < 1 / 600) continue;
  const kh = k.map((x) => x / km), l = (Math.asin(Math.max(-1, Math.min(1, q.U[0] * kh[0] + q.U[1] * kh[1] + q.U[2] * kh[2]))) * 180) / Math.PI;
  const f = [v * v * k[0], v * v * k[1] + G, v * v * k[2]], fN = (f[0] * q.U[0] + f[1] * q.U[1] + f[2] * q.U[2]) / G, fL = (f[0] * q.L[0] + f[1] * q.L[1] + f[2] * q.L[2]) / G;
  n++; lean += l; if (l < -5) out++; maxLat = Math.max(maxLat, Math.abs(fL)); maxN = Math.max(maxN, fN); sumLat += Math.abs(fL);
}
console.log(JSON.stringify({ sigma, closed: r.converged, gapMm: +(r.gapM * 1000).toFixed(3), report: r.report.slice(0, 60), curvedStations: n, meanLeanIntoDeg: +(lean / n).toFixed(1), stationsLeaningOut: out, maxLatG: +maxLat.toFixed(2), meanLatG: +(sumLat / n).toFixed(2), maxNormalG: +maxN.toFixed(2), designKmh: MACH6.designSpeedKmh }));

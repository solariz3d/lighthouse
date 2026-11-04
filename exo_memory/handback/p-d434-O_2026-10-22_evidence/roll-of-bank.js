'use strict';
// D434 (O): the balance bank's roll rate. The returned finish's laid route (as proto-bank.js), its new pieces banked by scale·(−atan(v²·kh_i/g)) for scale in
// 0, 0.5, 0.75, 1; closed with the windowed close; over the closer: the worst roll rate (°/m, validate's rollRates over its 20 m chord) against the amber 0.93 and
// red 1.2144 bars, the mean lean into the curve, the peak lateral and normal loads at the design speed (centreline, the validator's formula); or the close's refusal.
//   node roll-of-bank.js <tree> <undo file> <past index>
const [TREE, UNDO, K] = process.argv.slice(2);
const fs = require('fs'), CM = require(`${TREE}/src/core/close.js`), c0 = CM.close, seen = [];
CM.close = function (doc, opts) { const r = c0(doc, opts); if (opts && opts.window && r.converged) seen.push({ doc, window: opts.window, out: r.doc }); return r; };
const D = require(`${TREE}/src/core/document.js`), F = require(`${TREE}/src/core/finish.js`), AD = require(`${TREE}/src/core/adapter.js`), V = require(`${TREE}/src/validate/index.js`);
const { MACH6, G } = require(`${TREE}/src/validate/limits.js`), v = MACH6.designSpeedKmh / 3.6;
const open = D.parse(JSON.parse(fs.readFileSync(UNDO, 'utf8')).past[Number(K)]);
const fin = F.finishToStart(open), pick = seen.find((x) => x.out === fin.doc); if (!pick) throw new Error('not captured');
const { doc: laid, window: win } = pick;
for (const scale of [0, 0.5, 0.75, 1]) {
  const banked = D.checkDoc({ ...laid, pieces: laid.pieces.map((P, p) => (!win.includes(p) || P.type !== 'road' ? P : { ...P, channels: { ...P.channels, phi: P.channels.phi.map((ph, i, a) => (i < 2 || i > a.length - 3 ? ph : ph - scale * Math.atan((v * v * P.channels.kh[i]) / G))) } })) });
  let r; try { r = c0(banked, { window: win }); } catch (e) { console.log(JSON.stringify({ scale, refused: `${e.code}: ${String(e.message).slice(-140)}` })); continue; }
  const { segments, path } = AD.toPath(r.doc, { step: 2 }), ids = new Set(win.map((p) => r.doc.pieces[p].id)), fromS = r.window.fromS;
  let roll = 0; for (const q of V._internal.rollRates(path.samples, () => true, true, path.lengthM)) if (q.s >= fromS - 1e-9) roll = Math.max(roll, q.rate);
  let n = 0, lean = 0, out = 0, lat = 0, nrm = 0;
  for (const q of path.samples) { if (!ids.has(segments[q.seg].id)) continue; const k = q.kvec, km = Math.hypot(...k); if (km < 1 / 600) continue; const kh = k.map((x) => x / km), l = (Math.asin(Math.max(-1, Math.min(1, q.U[0] * kh[0] + q.U[1] * kh[1] + q.U[2] * kh[2]))) * 180) / Math.PI, f = [v * v * k[0], v * v * k[1] + G, v * v * k[2]]; n++; lean += l; if (l < -5) out++; lat = Math.max(lat, Math.abs((f[0] * q.L[0] + f[1] * q.L[1] + f[2] * q.L[2]) / G)); nrm = Math.max(nrm, (f[0] * q.U[0] + f[1] * q.U[1] + f[2] * q.U[2]) / G); }
  console.log(JSON.stringify({ scale, closed: r.converged, gapMm: +(r.gapM * 1000).toFixed(3), worstRollDegPerM: +roll.toFixed(3), amber: V.ROLL_AMBER_DEG_M, red: V.ROLL_RED_DEG_M, meanLeanInto: +(lean / n).toFixed(1), out, maxLatG: +lat.toFixed(2), maxNormalG: +nrm.toFixed(2) }));
}

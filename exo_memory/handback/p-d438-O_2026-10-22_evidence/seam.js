'use strict';
// D438 Part 2 (O): the bank and the cup through the lap's seam (the last piece into p1), for one saved track (a copy): every 10 m over the last 120 m of the last
// piece and the first 120 m of p1, the bank channel phi (degrees, as stored), the cup channel c (degrees; '-' where the piece has no cup flag), the width w (m);
// and the largest change per metre of each across the seam window. Also each closer piece's flags (cup, edge, tube).   node seam.js <tree> <track> [closerFrom]
const [T, FILE, FROM] = process.argv.slice(2);
const fs = require('fs'), path = require('path'), D = require(path.join(T, 'src/core/document.js'));
const doc = D.parse(fs.readFileSync(FILE, 'utf8')), L = doc.pieces[doc.pieces.length - 1], F = doc.pieces[0], deg = (x) => (x * 180) / Math.PI;
const from = FROM ? Number(FROM) : 40;
console.log(`${path.basename(FILE)}: ${doc.pieces.length} pieces, closed ${!!doc.closed}; flags from p${from + 1}: ` + doc.pieces.slice(from).map((P) => `${P.id}${P.cup ? ' cup' : ''}${P.edge ? ' edge' : ''}${P.tube ? ' tube' : ''} ${P.family}`).join(' | ') + ` || p1: ${F.cup ? 'cup ' : ''}${F.family}`);
const rows = [];
for (let s = Math.max(0, L.length - 120); s <= L.length + 1e-9; s += 10) { const v = D.valuesAt(L, s); rows.push({ at: `${L.id} ${(s - L.length).toFixed(0)}`, phi: deg(v.phi), c: L.cup ? v.c : null, w: v.w }); }
for (let s = 0; s <= Math.min(120, F.length); s += 10) { const v = D.valuesAt(F, s); rows.push({ at: `${F.id} +${s.toFixed(0)}`, phi: deg(v.phi), c: F.cup ? v.c : null, w: v.w }); }
for (const r of rows) console.log(`  ${r.at.padEnd(10)} bank ${r.phi.toFixed(2).padStart(9)}°  cup ${r.c === null ? '      -' : r.c.toFixed(2).padStart(7) + '°'}  width ${r.w.toFixed(2)} m`);
let dphi = 0, dc = 0; for (let k = 1; k < rows.length; k++) { dphi = Math.max(dphi, Math.abs(rows[k].phi - rows[k - 1].phi) / 10); if (rows[k].c !== null && rows[k - 1].c !== null) dc = Math.max(dc, Math.abs(rows[k].c - rows[k - 1].c) / 10); }
const cl = L.cup ? D.pieceEnd(L).c.v : null, cf = F.cup ? F.channels.c[0] : null;
console.log(`  largest change over 10 m: bank ${dphi.toFixed(3)}°/m, cup ${dc.toFixed(3)}°/m; at the seam: bank ${deg(D.valuesAt(L, L.length).phi).toFixed(3)}° → ${deg(D.valuesAt(F, 0).phi).toFixed(3)}°, cup ${cl === null ? 'none' : cl.toFixed(3)} → ${cf === null ? 'none' : cf.toFixed(3)}`);

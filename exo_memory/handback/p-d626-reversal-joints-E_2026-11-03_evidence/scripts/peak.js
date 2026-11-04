// usage: node peak.js <checkout> <save> [label]
// The whole track as built (2 m segments): the peak roll acceleration (°/m²) and, held to the bar or the piece's floor as core_bank_corners.test.js holds it
// (the larger of 0.0058 °/m² and 10/√3 · Δ/L² for its own piece and any piece within that piece's own length), the worst ratio and where. Tube pieces skipped.
'use strict';
const fs = require('fs'), path = require('path');
const [R, save, label = ''] = process.argv.slice(2);
const D = require(path.join(R, 'src/core/document.js')), A = require(path.join(R, 'src/core/adapter.js'));
const doc = D.parse(fs.readFileSync(save, 'utf8')), DEG = Math.PI / 180, BAR = 29.4 / (10 * 170 * 170);
const floorOf = (P) => (P.type === 'road' && P.channels.phi ? (10 / Math.sqrt(3)) * Math.abs(D.channelAt(P, 'phi', P.length).v - D.channelAt(P, 'phi', 0).v) / (P.length * P.length) : 0);
const allowedAt = (s) => { let o = 0, m = BAR; for (const P of doc.pieces) { if (s >= o - P.length && s <= o + 2 * P.length) m = Math.max(m, floorOf(P)); o += P.length; } return m; };
let s = 0; const B = A.toSegments(doc).map((g) => { const r = { s, id: g.id, rate: (g.roll1 - g.roll0) / g.length, L: g.length, tube: g.kind !== 'road' }; s += g.length; return r; });
let peak = { a: 0, s: 0 }, worst = { r: 0, s: 0, a: 0, al: 0 }, over = 0;
for (let k = 1; k < B.length; k++) {
  if (B[k].tube || B[k - 1].tube) continue;
  const a = Math.abs(B[k].rate - B[k - 1].rate) / ((B[k].L + B[k - 1].L) / 2), al = allowedAt(B[k].s);
  if (a > peak.a) peak = { a, s: B[k].s }; if (a / al > worst.r) worst = { r: a / al, s: B[k].s, a, al }; if (a > BAR * 1.02) over++;
}
console.log(`${label}\tpeak ${(peak.a / DEG).toFixed(5)} °/m² at s ${peak.s.toFixed(0)}\tsegment ends over the bar ${over}\tworst against bar-or-floor ${worst.r.toFixed(2)}x at s ${worst.s.toFixed(0)} (${(worst.a / DEG).toFixed(5)} of ${(worst.al / DEG).toFixed(5)})`);

// usage: node reach.js <checkout> <save> [label]
// 1) Joint drift: at every joint between road pieces, the built bank (toSegments roll0 of the segment that starts there) against the piece's own end value.
// 2) Edit reach: for each road piece with a phi channel, raise its middle phi knot by 1°, rebuild, and report where the built roll moved (s range) and which
//    pieces' segments moved, against the edited piece's own span.
'use strict';
const fs = require('fs'), path = require('path');
const [R, save, label = ''] = process.argv.slice(2);
const D = require(path.join(R, 'src/core/document.js')), A = require(path.join(R, 'src/core/adapter.js'));
const doc = D.parse(fs.readFileSync(save, 'utf8'));
const DEG = Math.PI / 180;
const built = (d) => { let s = 0; return A.toSegments(d).map((g) => { const r = { id: g.id, s, a: g.roll0, b: g.roll1, L: g.length }; s += g.length; return r; }); };
const B0 = built(doc);
let o = 0, worst = 0, at = 0, n = 0, zero = 0;
for (const P of doc.pieces) { o += P.length; if (P.type !== 'road' || !P.channels.phi) continue; const x = B0.find((q) => Math.abs(q.s - o) < 1e-6); if (!x) continue; n++; const d = Math.abs(x.a - D.channelAt(P, 'phi', P.length).v) / DEG; if (d < 1e-6) zero++; if (d > worst) { worst = d; at = o; } }
console.log(`${label} joints ${n}: built bank equals the piece's end at ${zero}; worst ${worst.toFixed(6)}° at s ${at.toFixed(0)}`);
let pos = 0; const spans = doc.pieces.map((P) => { const r = [pos, pos + P.length]; pos += P.length; return r; });
let outside = 0, tried = 0;
doc.pieces.forEach((P, k) => {
  if (P.type !== 'road' || !P.channels.phi || P.channels.phi.length < 3) return;
  const c = P.channels.phi.slice(), mid = Math.floor(c.length / 2); c[mid] += 1 * DEG;
  const ed = { ...doc, pieces: doc.pieces.map((Q, i) => (i === k ? { ...Q, channels: { ...Q.channels, phi: c } } : Q)) };
  const B1 = built(ed); let s0 = Infinity, s1 = -Infinity; const ids = new Set();
  B0.forEach((g, i) => { const h = B1[i]; if (Math.abs(g.a - h.a) > 1e-12 || Math.abs(g.b - h.b) > 1e-12) { ids.add(g.id); s0 = Math.min(s0, g.s); s1 = Math.max(s1, g.s + g.L); } });
  tried++; const others = [...ids].filter((x) => x !== P.id); if (others.length) outside++;
  console.log(`  edit ${P.id} (s ${spans[k][0].toFixed(0)}-${spans[k][1].toFixed(0)}): moved s ${isFinite(s0) ? `${s0.toFixed(0)}-${s1.toFixed(0)}` : 'nothing'}; other pieces moved: ${others.length ? others.join(', ') : 'none'}`);
});
console.log(`${label} edits ${tried}: moved another piece in ${outside}`);

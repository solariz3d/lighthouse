// usage: node neighbour.js <checkout> <save> [label]
// For every road piece: raise its middle phi knot 1°, rebuild, and for each OTHER piece whose built bank moved: over what s and by at most how much
'use strict';
const fs = require('fs'), path = require('path');
const [R, save, label = ''] = process.argv.slice(2);
const D = require(path.join(R, 'src/core/document.js')), A = require(path.join(R, 'src/core/adapter.js'));
const doc = D.parse(fs.readFileSync(save, 'utf8')), DEG = Math.PI / 180;
const built = (d) => { let s = 0; return A.toSegments(d).map((g) => { const r = { id: g.id, s, a: g.roll0, b: g.roll1, L: g.length }; s += g.length; return r; }); };
const B0 = built(doc); let worst = 0;
doc.pieces.forEach((P, k) => {
  if (P.type !== 'road' || !P.channels.phi || P.channels.phi.length < 3) return;
  const c = P.channels.phi.slice(); c[Math.floor(c.length / 2)] += DEG;
  const B1 = built({ ...doc, pieces: doc.pieces.map((Q, i) => (i === k ? { ...Q, channels: { ...Q.channels, phi: c } } : Q)) });
  const by = {}; B0.forEach((g, i) => { if (g.id === P.id) return; const d = Math.max(Math.abs(g.a - B1[i].a), Math.abs(g.b - B1[i].b)); if (d > 1e-12) { const x = by[g.id] || (by[g.id] = { s0: g.s, s1: g.s + g.L, d: 0 }); x.s1 = g.s + g.L; x.d = Math.max(x.d, d); } });
  for (const [id, x] of Object.entries(by)) { worst = Math.max(worst, x.d); console.log(`${label}\tedit ${P.id} +1°: ${id} moved over s ${x.s0.toFixed(0)}-${x.s1.toFixed(0)} (${(x.s1 - x.s0).toFixed(0)} m) by at most ${(x.d / DEG).toFixed(4)}°`); }
});
console.log(`${label}\tlargest move of another piece: ${(worst / DEG).toFixed(4)}°`);

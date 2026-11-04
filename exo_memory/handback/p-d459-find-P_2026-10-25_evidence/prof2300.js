// prof2300.js (D459, P): the core's cross-section at the p4|p5 joint from both sides: p4's last segment at its end and p5's first segment at its start (src/geom/profile.js
// readAt/offsetAt), as (X, Y) over u, and the Y difference at matched X; the same at every joint (the largest |dY| across the width).   node prof2300.js <tree> <save>
'use strict';
const fs = require('fs'), path = require('path'); const [T, F] = process.argv.slice(2);
const D = require(path.join(T, 'src/core/document.js')), AD = require(path.join(T, 'src/core/adapter.js')), Prof = require(path.join(T, 'src/geom/profile.js'));
const doc = D.parse(fs.readFileSync(F, 'utf8')); const { segments, path: p } = AD.toPath(doc, { step: 2 }); const S = p.samples;
const segS0 = []; { let a = S[0].s; for (const g of segments) { segS0.push(a); a += g.length; } } const LAP = segS0[segS0.length - 1] + segments[segments.length - 1].length;
const s0 = []; { let a = 0; for (const P of doc.pieces) { s0.push(a); a += P.length; } }
const segBefore = (s) => { let i = segments.findIndex((g, k) => segS0[k] < s - 1e-6 && segS0[k] + g.length >= s - 1e-6); return i; };
const segAfter = (s) => { let i = segments.findIndex((g, k) => Math.abs(segS0[k] - s) < 1e-6); return i; };
const curve = (P) => { const n = 400, out = []; const u0 = P.u[0], u1 = P.u[P.u.length - 1]; for (let i = 0; i <= n; i++) { const u = u0 + (u1 - u0) * i / n; const [X, Y] = Prof.offsetAt(P, u); out.push({ u, X, Y }); } return out; };
const yAt = (c, X) => { for (let i = 1; i < c.length; i++) { const a = c[i - 1], b = c[i]; if ((a.X - X) * (b.X - X) <= 0 && a.X !== b.X) return a.Y + (b.Y - a.Y) * (X - a.X) / (b.X - a.X); } return null; };
console.log('joint      sBefore->sAfter  segs     edgesBefore (X)        edgesAfter (X)        largest |dY| (mm) at X   | dY at X = -8.4, -7, 0, 7, 8.4 (mm)');
for (let k = 0; k < doc.pieces.length; k++) {
  const sJ = (s0[k] + doc.pieces[k].length), ia = segBefore(sJ), ib = sJ >= LAP - 1e-6 ? 0 : segAfter(sJ); if (ia < 0 || ib < 0) { console.log('no segs at', sJ, ia, ib); continue; }
  const A = Prof.readAt(segments[ia], segments[ia].length), B = Prof.readAt(segments[ib], 0); const ca = curve(A), cb = curve(B);
  let worst = { d: 0, X: 0 }; for (const q of ca) { const y = yAt(cb, q.X); if (y === null) continue; const d = y - q.Y; if (Math.abs(d) > Math.abs(worst.d)) worst = { d, X: q.X }; }
  const at = [-8.4, -7, 0, 7, 8.4].map((X) => { const a = yAt(ca, X), b = yAt(cb, X); return a === null || b === null ? '  n/a' : ((b - a) * 1000).toFixed(1).padStart(6); });
  console.log((doc.pieces[k].id + '|' + doc.pieces[(k + 1) % doc.pieces.length].id).padEnd(8), String(sJ).padStart(6), ' segs', String(ia).padStart(5), String(ib).padStart(5), ' ', ca[0].X.toFixed(3), ca[ca.length - 1].X.toFixed(3), '  ', cb[0].X.toFixed(3), cb[cb.length - 1].X.toFixed(3), '  ', (worst.d * 1000).toFixed(1).padStart(7), 'at X', worst.X.toFixed(2).padStart(7), ' |', at.join(''));
}
// the two cross-sections at 2300 in full, every 0.5 m of X
{ const sJ = 2300, ia = segBefore(sJ), ib = segAfter(sJ); const A = Prof.readAt(segments[ia], segments[ia].length), B = Prof.readAt(segments[ib], 0); const ca = curve(A), cb = curve(B);
  console.log('\nat s 2300: X, Y before (p4 end), Y after (p5 start), dY (mm); profile knots u/psi before:', A.u.length, 'after:', B.u.length);
  for (let X = -12.5; X <= 12.5; X += 0.5) { const a = yAt(ca, X), b = yAt(cb, X); console.log(X.toFixed(1).padStart(6), a === null ? '   n/a' : a.toFixed(4).padStart(8), b === null ? '   n/a' : b.toFixed(4).padStart(8), a === null || b === null ? '' : ((b - a) * 1000).toFixed(1).padStart(8)); }
  console.log('A', JSON.stringify({ u: A.u.map((x) => +x.toFixed(3)), psi: A.psi.map((x) => +x.toFixed(4)) }).slice(0, 600)); console.log('B', JSON.stringify({ u: B.u.map((x) => +x.toFixed(3)), psi: B.psi.map((x) => +x.toFixed(4)) }).slice(0, 600)); }

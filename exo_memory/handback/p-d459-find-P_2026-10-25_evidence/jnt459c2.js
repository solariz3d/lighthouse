// jnt459c2.js (D459, P): the SECOND derivative of every channel on both sides of every joint (one-sided finite differences of document.js valuesAt, h m), so a C2 break
// of a channel (value and slope continuous, curvature not) is a number per joint: phi'' and c'' in deg/m^2, e''/er'' in deg/m^2, kh'/kv' (the path's C3) in deg/100m per m.
// The wheel-line vertical curvature a roll step implies: kv_wheel ~ u * phi'' (u = 8.4 m), in deg/100 m, beside kstep436's measured figure.   node jnt459c2.js <tree> <save> [h=0.5]
'use strict';
const fs = require('fs'), path = require('path'); const [T, F, H] = process.argv.slice(2); const h = H ? +H : 0.5;
const D = require(path.join(T, 'src/core/document.js')); const doc = D.parse(fs.readFileSync(F, 'utf8')); const LAP = doc.pieces.reduce((a, q) => a + q.length, 0);
const s0 = []; { let a = 0; for (const P of doc.pieces) { s0.push(a); a += P.length; } }
const CH = ['kh', 'kv', 'phi', 'c', 'e', 'er', 'w'];
const d2end = (P, ch) => { const f = (s) => D.valuesAt(P, s)[ch]; const L = P.length; return (f(L) - 2 * f(L - h) + f(L - 2 * h)) / (h * h); };
const d2start = (P, ch) => { const f = (s) => D.valuesAt(P, s)[ch]; return (f(2 * h) - 2 * f(h) + f(0)) / (h * h); };
const d1end = (P, ch) => { const f = (s) => D.valuesAt(P, s)[ch]; const L = P.length; return (f(L) - f(L - h)) / h; };
const d1start = (P, ch) => { const f = (s) => D.valuesAt(P, s)[ch]; return (f(h) - f(0)) / h; };
const deg = (r) => r * 180 / Math.PI, p100 = (k) => deg(k) * 100;
console.log(`second derivatives across every joint (h = ${h} m): channel'' before -> after; roll phi and cup c and edges e/er in deg/m^2 (the channels are stored in rad for phi, deg for c/e/er); kh'/kv' in (deg/100 m)/m`);
console.log('joint      s    | phi\'\' (deg/m2)        | 8.4*dphi\'\' as kv at the wheel (deg/100m) | c\'\' (deg/m2)          | e\'\' (deg/m2)          | er\'\' (deg/m2)         | kh\' ((deg/100m)/m)      | kv\' ((deg/100m)/m)');
const rows = [];
for (let k = 0; k < doc.pieces.length; k++) {
  const P = doc.pieces[k], Q = doc.pieces[(k + 1) % doc.pieces.length], sJ = (s0[k] + P.length) % LAP;
  const g = (ch, conv) => [conv(d2end(P, ch)), conv(d2start(Q, ch))];
  const phi = g('phi', deg), c = g('c', (x) => x), e = g('e', (x) => x), er = g('er', (x) => x), kh = [p100(d1end(P, 'kh')), p100(d1start(Q, 'kh'))], kv = [p100(d1end(P, 'kv')), p100(d1start(Q, 'kv'))];
  const wheel = p100(8.4 * (phi[1] - phi[0]) * Math.PI / 180);
  rows.push({ name: P.id + '|' + Q.id, s: sJ, phi, c, e, er, kh, kv, wheel });
  const f = (a, n = 4) => `${a[0].toFixed(n)} -> ${a[1].toFixed(n)}`;
  console.log(rows[rows.length - 1].name.padEnd(8), String(sJ).padStart(6), '|', f(phi).padStart(20), '|', wheel.toFixed(2).padStart(8).padEnd(40), '|', f(c).padStart(20), '|', f(e).padStart(20), '|', f(er).padStart(20), '|', f(kh, 3).padStart(22), '|', f(kv, 3).padStart(22));
}
console.log('\nper joint: the largest C2 jump of any channel (|after - before| of the second derivative), which channel:');
for (const r of rows) { const cand = [['phi', r.phi], ['c', r.c], ['e', r.e], ['er', r.er]].map(([n, a]) => [n, Math.abs(a[1] - a[0])]).sort((x, y) => y[1] - x[1]); console.log('  ', r.name.padEnd(8), String(r.s).padStart(6), cand[0][0].padEnd(4), cand[0][1].toFixed(4), 'deg/m2', '  kh\' jump', Math.abs(r.kh[1] - r.kh[0]).toFixed(3), ' kv\' jump', Math.abs(r.kv[1] - r.kv[0]).toFixed(3)); }

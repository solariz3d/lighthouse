// cupseam.js <tree>: a public-words lap with a flat cup at p1 and a cup fade on its last piece whose end is C1 (a file from before D459, or 0.4.19's closer), closed with the window [p1] and [p1, last]
'use strict';
const T = process.argv[2];
const D = require(T + '/src/core/document.js'), { extend } = require(T + '/src/core/extend.js'), { extendTurnBy } = require(T + '/src/core/turnby.js'), { close } = require(T + '/src/core/close.js');
const DEG = Math.PI / 180, Q = (Math.PI * 300) / 2;
let d = D.createDoc('cup seam'); d = extend(d, { length: 1000, family: 'bowl', first: { c: 0 } });
for (let i = 0; i < 3; i++) { d = extendTurnBy(d, { length: Q }, 90 * DEG); d = extend(d, { length: 300 }); }
d = extendTurnBy(d, { length: Q }, 90 * DEG);
d = extend(d, { length: 300, targets: { c: 15 } }); d = extend(d, { length: 400, targets: { c: 0 } });
console.log('open lap:', d.pieces.length, 'pieces; p1 cup', d.pieces[0].cup, d.pieces[0].channels.c.slice(0, 4).join(' '), '; last c', d.pieces[d.pieces.length - 1].channels.c.slice(-5).join(' '));
const c0 = close(d); console.log('whole close:', c0.converged, c0.report.slice(0, 60));
// the last piece's cup fade ends C1 (a file from before D459 or 0.4.19's closer: 15 15 0 0): hand-set its tail
const j = JSON.parse(JSON.stringify({ ...c0.doc, closed: false })), L = j.pieces[j.pieces.length - 1], n = L.channels.c.length;
for (let i = 0; i < n; i++) L.channels.c[i] = i < n - 2 ? 15 : 0;   // flat 15 then 0 0: C1 with p1's flat 0 (value 0, slope 0), curvature 6·15/(h1h2) at the end
const open = D.checkDoc(j); console.log('tail set:', L.channels.c.slice(-5).join(' '), '; p1 c', open.pieces[0].channels.c.slice(0, 4).join(' '));
const n0 = open.pieces.length;
for (const w of [[0], [0, n0 - 1], [n0 - 1], [n0 - 2, n0 - 1]]) { try { const r = close(open, { window: w }); const P1 = r.doc.pieces[0]; console.log('window', JSON.stringify(w), '->', r.converged ? 'closed' : 'not converged', r.report.slice(0, 70), '| p1 c min', Math.min(...P1.channels.c)); } catch (e) { console.log('window', JSON.stringify(w), '-> REFUSED', e.code, e.message.slice(0, 150)); } }

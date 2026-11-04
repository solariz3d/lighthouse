'use strict';
// D447 (O): the test lap, closed by the page's own press (app/core/closejob.js runCloseBest) on one tree: the route, then per piece its kind (upright / hand-banked
// / pit), and over its curved stations (|κh| > 1/600 m) the lean into the turn against the horizontal turn (min, mean), and whether its phi is byte-equal to the
// open lap's.   node lap-probe.js <tree> [pit]
const path = require('path'), T = path.resolve(process.argv[2]), PIT = process.argv[3] === 'pit';
const D = require(path.join(T, 'src/core/document.js')), AD = require(path.join(T, 'src/core/adapter.js')), CJ = require(path.join(T, 'app/core/closejob.js'));
const { extend } = require(path.join(T, 'src/core/extend.js')), { extendTurnBy } = require(path.join(T, 'src/core/turnby.js')), DEG = Math.PI / 180;
const Q = 300 * Math.PI / 2;
let d = D.createDoc('lap');
d = extend(d, { length: 100, family: 'bowl' }); d = extendTurnBy(d, { length: Q }, 90 * DEG);                                   // corner 1
d = extend(d, { length: 100 }); d = extend(d, { length: Q / 2, targets: { kh: 1 / 300 } }); d = extendTurnBy(d, { length: Q / 2 }, 67.5 * DEG);   // corner 2, two pieces
d = extend(d, { length: 100, targets: { phi: -20 * DEG } }); d = extendTurnBy(d, { length: Q }, 90 * DEG);                     // corner 3, banked by hand, into the (left) turn
d = extend(d, { length: 100, targets: { phi: 0 } }); d = extendTurnBy(d, { length: Q }, 90 * DEG);                              // corner 4
if (PIT) { const PL = require(path.join(T, 'src/doc/pitlane.js')); d = D.setPitLane(d, { ...PL.DEFAULTS, side: 'R', leave: { word: d.pieces[0].id, along: 10 }, rejoin: { word: d.pieces[1].id, along: 300 }, boxes: 2, boxSpacingM: 10 }); }
const t0 = Date.now(), r = CJ.runCloseBest({ doc: d });
console.log(`closed ${r.converged} by ${r.route} in ${((Date.now() - t0) / 1000).toFixed(1)} s: ${String(r.report).slice(0, 110)}`);
if (!r.converged) process.exit(0);
const doc = r.doc, { segments, path: p } = AD.toPath(doc, { step: 2 }), per = new Map();
for (const q of p.samples) { const k = q.kvec, kh = Math.hypot(k[0], k[2]); if (kh < 1 / 600) continue; const l = Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[2] * k[2]) / kh))) / DEG, id = segments[q.seg].id; if (!per.has(id)) per.set(id, []); per.get(id).push(l); }
doc.pieces.forEach((P, i) => { const L = per.get(P.id) || [], O = d.pieces[i], same = O && O.channels.phi.length === P.channels.phi.length && O.channels.phi.every((x, j) => x === P.channels.phi[j]);
  console.log(`  ${P.id} ${P.length.toFixed(0)} m ${O ? (O.channels.phi.every((x) => Math.abs(x) <= 5 * DEG) ? 'upright' : 'hand-banked') : 'new'}: curved ${L.length}${L.length ? `, lean min ${Math.min(...L).toFixed(1)}° mean ${(L.reduce((a, b) => a + b, 0) / L.length).toFixed(1)}°` : ''}; phi ${same ? 'byte-equal' : 'changed'}`); });

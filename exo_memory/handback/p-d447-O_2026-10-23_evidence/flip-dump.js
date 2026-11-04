'use strict';
// D447 finding 1 (O): rows 10 and 11's laps through the press on one tree: the report, the route, and per piece its length, whether it is a closer piece, the
// lean (mean and least) over all its curved stations and over those outside the flip zone, and its stored kh range.   node flip-dump.js <tree> sharp|s5
const path = require('path'), T = path.resolve(process.argv[2]), which = process.argv[3];
const D = require(path.join(T, 'src/core/document.js')), AD = require(path.join(T, 'src/core/adapter.js')), CJ = require(path.join(T, 'app/core/closejob.js'));
const { extend } = require(path.join(T, 'src/core/extend.js')), { extendTurnBy } = require(path.join(T, 'src/core/turnby.js')), { extendSharp } = require(path.join(T, 'src/core/sharp.js'));
const DEG = Math.PI / 180, Q = (300 * Math.PI) / 2, T90 = (d) => extendTurnBy(d, { length: Q }, 90 * DEG), S = (d, L) => extend(d, { length: L });
let d = D.createDoc('probe'); d = extend(d, { length: 100, family: 'bowl' });
if (which === 'sharp') { d = T90(d); d = S(d, 700); d = T90(d); d = S(d, 100); d = extend(d, { length: 300, targets: { kh: 1 / 300 } }); d = extendSharp(d, {}, { angle: -60 * DEG, R: 150, ramp: 4 }); d = extend(d, { length: 150 }); d = S(d, 100); d = T90(d); d = S(d, 100); d = T90(d); d = S(d, 400); }
else { d = T90(d); d = S(d, 340); d = T90(d); d = S(d, 100); d = extend(d, { length: 300, targets: { kh: 1 / 300 }, transition: 20 }); d = extend(d, { length: 300, targets: { kh: -1 / 300 }, transition: 20 }); d = extend(d, { length: 150, targets: { kh: 0 }, transition: 20 }); d = S(d, 100); d = T90(d); d = S(d, 100); d = T90(d); d = S(d, 660); }
const r = CJ.runCloseBest({ doc: d }); console.log(`${which}: ${r.converged} ${r.route} | ${r.report}`); if (!r.converged) process.exit(0);
const flips = []; { let s0 = 0, last = 0; for (const P of r.doc.pieces) { for (let s = 0; s <= P.length; s += 2) { const k = D.valuesAt(P, Math.min(s, P.length)).kh; if (Math.abs(k) > 1 / 600) { const sg = Math.sign(k); if (last && sg !== last) flips.push(s0 + s); last = sg; } } s0 += P.length; } }
console.log('flips at', flips.map((x) => x.toFixed(0)).join(', '));
const { segments, path: p } = AD.toPath(r.doc, { step: 2 }), per = new Map();
for (const q of p.samples) { const g = segments[q.seg], k = q.kvec, kh = Math.hypot(k[0], k[2]); if (kh < 1 / 600) continue; const l = Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[2] * k[2]) / kh))) / DEG, far = !flips.some((f) => Math.abs(q.s - f) < 142); const e = per.get(g.id) || { all: [], far: [] }; e.all.push(l); if (far) e.far.push(l); per.set(g.id, e); }
const mean = (xs) => (xs.length ? (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1) : '-');
r.doc.pieces.forEach((P, i) => { const e = per.get(P.id) || { all: [], far: [] }; console.log(`  ${P.id} ${Math.round(P.length)} m${i >= d.pieces.length ? ' (new)' : ''} kh ${(Math.min(...P.channels.kh) * 300).toFixed(2)}..${(Math.max(...P.channels.kh) * 300).toFixed(2)} ×1/300 | curved ${e.all.length} mean ${mean(e.all)} least ${e.all.length ? Math.min(...e.all).toFixed(1) : '-'} | far ${e.far.length} mean ${mean(e.far)} | phi ${(Math.min(...P.channels.phi) / DEG).toFixed(1)}..${(Math.max(...P.channels.phi) / DEG).toFixed(1)}`); });

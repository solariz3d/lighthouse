'use strict';
const T = process.argv[2];
const D = require(T + '/src/core/document.js'), { extend } = require(T + '/src/core/extend.js'), { extendTurnBy } = require(T + '/src/core/turnby.js'), CJ = require(T + '/app/core/closejob.js');
const DEG = Math.PI / 180, Q = (Math.PI * 300) / 2, T90 = (d) => extendTurnBy(d, { length: Q }, 90 * DEG), S = (d, L) => extend(d, { length: L });
function row11() { const lat = 240, adv = 560, b = 100, c = 100, e = 100, a = e + lat, f = b + c + adv - 100; let d = D.createDoc('probe'); d = extend(d, { length: 100, family: 'bowl' }); d = T90(d); d = S(d, a); d = T90(d); d = S(d, b); d = extend(d, { length: 300, targets: { kh: 1 / 300 }, transition: 20 }); d = extend(d, { length: 300, targets: { kh: -1 / 300 }, transition: 20 }); d = extend(d, { length: 150, targets: { kh: 0 }, transition: 20 }); d = S(d, c); d = T90(d); d = S(d, e); d = T90(d); d = S(d, f); return d; }
const r = CJ.runCloseBest({ doc: row11() });
for (const k of [6, 7, 8, 9]) { const P = r.doc.pieces[k]; console.log(P.id.padEnd(4), 'L', String(P.length).padStart(4), 'kh×300', P.channels.kh.map((v) => (v * 300).toFixed(2)).join(' '), '\n     phi°  ', P.channels.phi.map((v) => (v / DEG).toFixed(1)).join(' ')); }

'use strict';
const T = process.argv[2], which = process.argv[3];
const D = require(T + '/src/core/document.js'), { extend } = require(T + '/src/core/extend.js'), { extendTurnBy } = require(T + '/src/core/turnby.js'), { extendSharp } = require(T + '/src/core/sharp.js'), F = require(T + '/src/core/finish.js'), CJ = require(T + '/app/core/closejob.js');
const DEG = Math.PI / 180, Q = (Math.PI * 300) / 2, T90 = (d) => extendTurnBy(d, { length: Q }, 90 * DEG), S = (d, L) => extend(d, { length: L });
const show = (doc, ks) => { for (const k of ks) { const P = doc.pieces[k]; console.log(P.id.padEnd(4), 'L', String(Math.round(P.length)).padStart(4), 'kh×300', P.channels.kh.slice(0, 6).map((v) => (v * 300).toFixed(2)).join(' '), '…', '\n     phi°', P.channels.phi.map((v) => (v / DEG).toFixed(1)).join(' ')); } };
if (which === 'sharp') {
  let d = D.createDoc('probe'); d = extend(d, { length: 100, family: 'bowl' }); d = T90(d); d = S(d, 700); d = T90(d); d = S(d, 100); d = extend(d, { length: 300, targets: { kh: 1 / 300 } }); d = extendSharp(d, {}, { angle: -60 * DEG, R: 150, ramp: 4 }); d = extend(d, { length: 150 }); d = S(d, 100); d = T90(d); d = S(d, 100); d = T90(d); d = S(d, 400);
  const r = CJ.runCloseBest({ doc: d }); show(r.doc, [1, 2, 3]);
} else {
  let d = D.createDoc('straight'); d = extend(d, { length: 400, family: 'bowl' }); for (let i = 0; i < 4; i++) d = extendTurnBy(d, { length: 300, targets: { kv: 0 } }, Math.PI / 2); d = D.checkDoc({ ...d, pieces: d.pieces.slice(0, -1) }); d = extendTurnBy(d, { length: 300, targets: { kv: 0 } }, Math.PI / 2);
  const r = F.finishToStart(d), n0 = d.pieces.length; console.log('closer:', r.plan.report.slice(0, 80), '; user pieces', n0, 'of', r.doc.pieces.length); show(r.doc, r.doc.pieces.map((P, k) => k).filter((k) => k >= n0 - 1));
}

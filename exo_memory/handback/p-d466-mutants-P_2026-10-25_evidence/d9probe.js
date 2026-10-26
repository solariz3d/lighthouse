'use strict';
const tree = process.argv[2];
const D = require(tree + '/src/core/document.js'), { extend } = require(tree + '/src/core/extend.js'), PC = require(tree + '/src/core/piece.js');
const TURN = 1 / 300;
let d = extend(D.createDoc('del kinds'), { length: 100, family: 'bowl' }); d = extend(d, { length: 80, transition: 40, targets: { c: 40 } }); d = extend(d, { length: 80, transition: 40, targets: { c: 40 } }); d = extend(d, { length: 80, transition: 40, targets: { t: 300, w: 30 } }); d = extend(d, { length: 60, transition: 30, targets: { kh: TURN } });
const e1 = D.pieceEnd(d.pieces[1]), e2 = D.pieceEnd(d.pieces[2]), P3 = d.pieces[3];
console.log('piece1 end c', e1.c, 'piece2 end c', e2.c, 'piece2 c pts', d.pieces[2].channels.c.join(' '));
console.log('piece3 t[0..2]', P3.channels.t.slice(0, 3).join(' '), 'knots', P3.knots.join(' '));
for (const ch of D.CHANNELS) { const a = e1[ch], b = e2[ch]; if (a && b && (Math.abs(a.v - b.v) > 1e-12 || Math.abs(a.m - b.m) > 1e-12)) console.log('end differs', ch, a, b); }
try { D.checkDoc({ ...d, pieces: [d.pieces[0], d.pieces[1], d.pieces[3], d.pieces[4]] }); console.log('first attempt (no joint edit): ACCEPTED'); } catch (e) { console.log('first attempt refused:', e.code, e.message.slice(0, 200)); }
const o = PC.deleteRun(d, 2); console.log('deleteRun t[0]', o.pieces[2].channels.t.slice(0, 2).join(' '), 'same object as before?', o.pieces[2] === d.pieces[3]);

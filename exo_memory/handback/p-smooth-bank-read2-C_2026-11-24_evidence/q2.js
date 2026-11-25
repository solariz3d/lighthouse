'use strict';
// q2: lays() along the move for the list whose named room (+65) is far from a smaller one that lays (+27): is "lays" monotone in the move?
const D = require('./t/src/core/document.js'), { extend } = require('./t/src/core/extend.js');
const DEG = Math.PI / 180, LEN = 300;
const lead = extend(D.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } });
const L = { first: { at: 23.2, target: 29.2 * DEG }, marks: [{ at: 40.9, target: -11.2 * DEG }, { at: 70.6, target: 25.2 * DEG }, { at: 88, target: 20.6 * DEG }] };
const opts = (L) => ({ length: LEN, targets: { phi: L.first.target }, transition: { phi: L.first.at }, bankShape: 'flow', through: { phi: L.marks } });
const why = (L) => { try { extend(lead, opts(L)); return 'lays'; } catch (e) { return e instanceof D.CoreError ? 'refused' : 'THROW ' + e.message; } };
try { extend(lead, opts(L)); } catch (e) { console.log('as drawn:', e.message); }
let line = '';
for (let d = 0; d <= 80; d += 1) { const M = { first: L.first, marks: L.marks.map((x, j) => (j >= 1 ? { at: +(x.at + d).toFixed(4), target: x.target } : x)) }; line += why(M) === 'lays' ? '#' : '.'; }
console.log('move of marks 2.. by 0..80 m (# lays):\n' + line);

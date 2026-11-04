'use strict';
const path = require('path'); const T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const later = ({ w0 = 31, L = 100, transition, targets, fam = 'bowl' }) => { let d = extend(D.createDoc('later'), { length: 100, family: fam, first: { w: w0 } }); return extend(d, { length: L, transition, targets }); };
const at = (P, ch, s) => D.valuesAt(P, s)[ch];
const a = later({ L: 100, transition: { w: 'start' }, targets: { w: 12, phi: 0.3 } }).pieces[1], b = later({ L: 100, targets: { w: 12, phi: 0.3 } }).pieces[1];
let worst = 0, ws = 0; for (let s = 0; s <= 100; s += 0.5) { const d = Math.abs(at(a, 'phi', s) - at(b, 'phi', s)); if (d > worst) { worst = d; ws = s; } }
console.log('row 4: max |phi(map) - phi(number)|', worst.toExponential(3), 'rad at s', ws, '=', (100 * worst / 0.3).toFixed(3), '% of the change; knots a', a.knots.length, 'b', b.knots.length, 'phi(50)', at(a, 'phi', 50).toFixed(4), at(b, 'phi', 50).toFixed(4));

'use strict';
const D = require('./t/src/core/document.js'), { extend } = require('./t/src/core/extend.js'), { basis } = require('./t/tools/piecewise.cjs');
const DEG = Math.PI / 180;
const lead = extend(D.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } });
for (const [tr, marks] of [[58.4, [[67, 10.4]]], [29.7, [[37.9, 15.8]]], [80.5, [[99.5, -25], [120.5, 0]]]]) {
  const P0 = extend(lead, { length: 300, targets: { phi: 0.3 }, transition: { phi: tr } }).pieces[1];
  const all = [tr, ...marks.map((m) => m[0])];
  const ins = all.filter((s) => !P0.knots.some((h) => Math.abs(h - s) < 1));
  const P = D.insertKnots(P0, ins), U = D.knotVector(P), n = P.channels.phi.length, last = all[all.length - 1];
  const anchor = P.knots.reduce((a, h) => (Math.abs(h - last) < Math.abs(a - last) ? h : a), P.length);
  const fixed = new Set([0, 1]); for (let i = 2; i < n; i++) if (U[i + 4] > anchor + 1e-9 || i >= n - 3) fixed.add(i);
  const free = [...Array(n).keys()].filter((i) => !fixed.has(i));
  console.log(`tr ${tr} marks ${all.join(',')}: knots<=${anchor + 25}:`, P.knots.filter((k) => k <= anchor + 25).join(','), '| anchor', anchor, '| free', free.join(','));
  for (const s of all.slice(0, -1)) { const B = basis(U, s); console.log(`   mark ${s}: points ${B.first}..${B.first + 3} N=${Array.from(B.N).map((x) => x.toFixed(3))} D1=${Array.from(B.D1).map((x) => x.toFixed(4))}`); }
}

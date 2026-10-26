'use strict';
const T = 'C:/Users/nname/Downloads/t180-wt-p466', M = process.argv[2];
const load = (t) => ({ D: require(t + '/src/core/document.js'), X: require(t + '/src/core/extend.js') });
const A = load(T), B = load(M);
const d = require('./clampprobe.json').filter((x) => x.treeCode !== 'JOINT').map((x) => ({ ...x, transition: x.transition === undefined ? undefined : JSON.parse(x.transition), targets: JSON.parse(x.targets) }));
// the heads, as clampprobe.js builds them (only the ones the map cases use)
const heads = {
  'empty bowl': (L) => L.D.createDoc('e'), 'legacy bowl 100': (L) => L.X.extend(L.D.createDoc('l'), { length: 100, family: 'bowl' }), 'legacy flat 100': (L) => L.X.extend(L.D.createDoc('l'), { length: 100, family: 'flat' }),
};
for (const c of [0, 30, 60, 90, 120, 149, 150]) heads[`cup ${c}`] = (L) => L.X.extend(L.X.extend(L.D.createDoc('c'), { length: 100 }), { length: 120, targets: { c } });
for (const t of [40, 120, 180, 300, 360]) heads[`tube ${t}`] = (L) => L.X.extend(L.X.extend(L.D.createDoc('t'), { length: 100 }), { length: 120, targets: { t } });
for (const e0 of [10, 40, -20]) heads[`edge held ${e0}`] = (L) => L.X.extend(L.X.extend(L.D.createDoc('h'), { length: 100 }), { length: 120, targets: { e: e0 } });
for (const e0 of [10, 40]) heads[`cup 60 + edge ${e0}`] = (L) => L.X.extend(L.X.extend(L.X.extend(L.D.createDoc('h'), { length: 100 }), { length: 120, targets: { c: 60 } }), { length: 120, targets: { e: e0 } });
const maps = d.filter((x) => x.transition && typeof x.transition === 'object');
let inMap = 0, outMap = 0, refusedMap = 0, examples = [];
for (const x of maps) {
  if (!heads[x.head]) { continue; }
  const dA = heads[x.head](A), dB = heads[x.head](B); let a, b;
  try { a = A.X.extend(dA, { length: x.length, transition: x.transition, targets: x.targets }); } catch (e) { a = null; }
  try { b = B.X.extend(dB, { length: x.length, transition: x.transition, targets: x.targets }); } catch (e) { b = null; }
  if (!a || !b) { refusedMap++; continue; }
  const PA = a.pieces[a.pieces.length - 1], PB = b.pieces[b.pieces.length - 1];
  for (const ch of ['e', 'er']) { const m = Math.max(...PA.channels[ch].map((v, i) => Math.abs(v - PB.channels[ch][i]))); if (m > 1e-9) { if (x.transition[ch] !== undefined && x.targets[ch] !== undefined) { inMap++; examples.push(`${x.head} L ${x.length} T ${JSON.stringify(x.transition)} ${JSON.stringify(x.targets)} ${ch} differs ${m.toFixed(3)}`); } else outMap++; } }
}
console.log(`map cases ${maps.length}; channel differing IS the map's short ramp: ${inMap}; a channel ramping over the whole piece (fitted): ${outMap}; a refusal on one side: ${refusedMap}`);
console.log(examples.slice(0, 8).join('\n'));
const num = d.filter((x) => typeof x.transition === 'number'); const rs = {}; for (const x of num) { const r = (x.transition / x.length).toFixed(2); rs[r] = (rs[r] || 0) + 1; } console.log('plain transitions, differing cases by T/L:', JSON.stringify(rs));
const byL = {}; for (const x of num.filter((y) => y.transition / y.length < 0.34)) byL[`${x.head} L${x.length} T${x.transition}`] = (byL[`${x.head} L${x.length} T${x.transition}`] || 0) + 1; console.log('T/L < 1/3:', JSON.stringify(byL).slice(0, 600));

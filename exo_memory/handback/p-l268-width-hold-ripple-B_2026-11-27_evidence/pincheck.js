// pincheck.js (pane B, L268): with the end pin taken out (H3) on a temp copy, are a held width's last two control points still the head's width exactly, on the paths
// that re-lay a piece after rampControl: a shaped bank (insertKnots), a second bank change (secondRamp), a flowing bank, and a typed bank on a short piece? usage: node pincheck.js <copy tree>
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const DEG = Math.PI / 180;
const head = () => extend(extend(D.createDoc('p'), { length: 120, first: { w: 19.1 } }), { length: 60, transition: 30, targets: { w: 25 } });
const cases = [
  ['plain 100 m', {}], ['bank 20 deg rounded', { targets: { phi: 20 * DEG }, bankShape: 'rounded' }], ['bank 20 deg swell', { targets: { phi: 20 * DEG }, bankShape: 'swell' }],
  ['bank then a second bank at 60 m', { transition: { phi: 30 }, targets: { phi: 20 * DEG }, second: { phi: { from: 60, target: 5 * DEG } } }], ['bank with changes', { transition: { phi: 30 }, targets: { phi: 20 * DEG }, changes: { phi: [{ from: 50, target: 10 * DEG }] } }],
  ['bank flowing', { targets: { phi: 20 * DEG }, bankFlow: true }], ['cup 25 on 30 m', { length: 30, targets: { c: 25 } }], ['edge 15 at start', { targets: { e: 15 }, transition: { e: 'start' } }],
];
for (const [name, o] of cases) {
  const d0 = head(), hv = D.endState(d0).w.v;
  try { const P = extend(d0, { length: 100, ...o }).pieces.at(-1), w = P.channels.w, n = w.length; console.log(`${name}: last two ${w[n - 2]}, ${w[n - 1]} against ${hv}: ${w[n - 1] === hv && w[n - 2] === hv ? 'exact' : 'DIFFERENT'}`); }
  catch (e) { console.log(`${name}: ${e.code || e.name} ${String(e.message).slice(0, 90)}`); }
}

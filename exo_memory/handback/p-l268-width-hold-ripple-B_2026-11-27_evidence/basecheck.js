// basecheck.js (pane B, L268): two questions about the fix, on ONE tree. (1) Where did the largest kh difference (8.6e-6) come from: per case. (2) Does the hold's
// `base` (the knots a bank piece would have had) matter: a held width with a typed bank, cup or edge over short pieces (the only time base is not the even knots),
// the bank's largest distance from its ideal quintic ramp, printed so a run with `base` dropped can be compared. usage: node basecheck.js <tree>
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const DEG = Math.PI / 180, smoother = (u) => (u >= 1 ? 1 : u <= 0 ? 0 : u * u * u * (10 + u * (-15 + 6 * u)));
const headDoc = () => { let d = extend(D.createDoc('b'), { length: 120, first: { w: 19.1 } }); d = extend(d, { length: 60, transition: 30, targets: { w: 25 } }); return d; };   // a 60 m piece whose width ramp ends off level (a number transition)
for (const L of [20, 30, 40, 60, 100]) for (const [ch, T0] of [['phi', 20 * DEG], ['c', 25], ['e', 15]]) {
  const d0 = headDoc(), head = D.endState(d0);
  let d; try { d = extend(d0, { length: L, targets: { [ch]: T0 } }); } catch (e) { console.log(`L ${L} ${ch}: ${e.code}`); continue; }
  const P = d.pieces.at(-1), v0 = head[ch].v; let worst = 0;
  for (let k = 0; k <= 200; k++) { const s = (L * k) / 200, ideal = v0 + (T0 - v0) * smoother(s / L), got = D.channelValue(P, ch, s); worst = Math.max(worst, Math.abs(got - ideal)); }
  console.log(`L ${L} ${ch} -> ${ch === 'phi' ? (T0 / DEG) + ' deg' : T0}: head w slope ${head.w.m.toExponential(2)}; knots ${P.knots.map((k) => +k.toFixed(2)).join(' ')}; the ${ch} ramp's largest distance from the ideal quintic ${ch === 'phi' ? (worst / DEG).toFixed(4) + ' deg' : worst.toFixed(4)}`);
}

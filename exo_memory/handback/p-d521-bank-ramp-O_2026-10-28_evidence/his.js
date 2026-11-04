// his.js (D521, O): HIS piece after a 100 m straight (100 m, turn +11.70° as a corner, bank −54.05°, width 31 m, no ticks), built by the tree's own extend
// (via extendCorner, as the panel does), today's ramp and, when the tree has it, the rounded one (bankShape: 'rounded'). Per ramp: the bank at 10/20/50 m,
// the peak roll rate and the peak change of roll rate (from the stored spline every 0.1 m), the bank's value/slope/second derivative across both joints (the
// four-point reading of core_joint_c2), the inner edge's fall over the first 60 m, the heading turned, and the largest change in the OTHER channels against
// today's ramp.   T180_TREE=<tree> node his.js [--json out]
'use strict';
const path = require('path'), fs = require('fs'), T = process.env.T180_TREE;
const D = require(path.join(T, 'src/core/document.js')), { extendCorner } = require(path.join(T, 'src/core/turnby.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const { toPath } = require(path.join(T, 'src/core/adapter.js'));
const DEG = Math.PI / 180, H = 0.5;
const build = (shape) => extendCorner(extend(D.createDoc('his'), { length: 100 }), { length: 100, turnDeg: 11.70, targets: { phi: -54.05 * DEG, w: 31 }, ...(shape ? { bankShape: shape } : {}) });
const val = (P, s) => D.valuesAt(P, Math.max(0, Math.min(P.length, s)));
function measure(d) {
  const A = d.pieces[0], P = d.pieces[1], ph = (s) => val(P, s).phi / DEG;
  let rate = 0, acc = 0, prevR = null;
  for (let s = 0.1; s <= 100 + 1e-9; s += 0.1) { const r = (ph(s) - ph(s - 0.1)) / 0.1; rate = Math.max(rate, Math.abs(r)); if (prevR !== null) acc = Math.max(acc, Math.abs(r - prevR) / 0.1); prevR = r; }
  const g = (Q, s) => val(Q, s).phi / DEG, L = P.length;
  const d2s = (2 * g(P, 0) - 5 * g(P, H) + 4 * g(P, 2 * H) - g(P, 3 * H)) / (H * H), d2a = (2 * g(A, 100) - 5 * g(A, 100 - H) + 4 * g(A, 100 - 2 * H) - g(A, 100 - 3 * H)) / (H * H);
  const d2e = (2 * g(P, L) - 5 * g(P, L - H) + 4 * g(P, L - 2 * H) - g(P, L - 3 * H)) / (H * H);
  const { path: Pt } = toPath(d, { step: 0.5 }), inner = (s) => { const m = Pt.samples.reduce((a, b) => (Math.abs(b.s - s) < Math.abs(a.s - s) ? b : a)); const hw = val(P, s - 100).w / 2; return m.pos[1] + hw * m.L[1] * Math.sign(-1); };
  // the turn is LEFT (+11.70°) and the bank is −54.05° (the left side down: into the turn): the inner edge is +L; its height is pos.y + hw·L.y
  const innerY = (s) => { const m = Pt.samples.reduce((a, b) => (Math.abs(b.s - s) < Math.abs(a.s - s) ? b : a)), hw = (s < 100 ? val(A, s).w : val(P, s - 100).w) / 2; return m.pos[1] + hw * m.L[1]; };
  const y0 = innerY(100), heading = (() => { const a = Pt.samples.find((m) => m.s >= 100), b = Pt.samples.filter((m) => m.s <= 200).pop(); return Math.atan2(-(b.T[2] * a.T[0] - b.T[0] * a.T[2]), b.T[0] * a.T[0] + b.T[2] * a.T[2]) / DEG; })();
  return { at10: ph(10), at20: ph(20), at50: ph(50), end: ph(100), rate, acc, joint: { slopeIn: (g(A, 100) - g(A, 100 - H)) / H, slopeOut: (g(P, H) - g(P, 0)) / H, d2In: d2a, d2Out: d2s, d2End: d2e },
    edge: [10, 20, 40, 60].map((x) => +(innerY(100 + x) - y0).toFixed(3)), heading, knots: D.knotVector(P).length };
}
const out = {}, base = build(null); out.today = measure(base);
let rounded = null; try { rounded = build('rounded'); } catch (e) { out.rounded = `refused: ${e.code || e.message}`; }
if (rounded) {
  out.rounded = measure(rounded);
  let dev = {}; for (const ch of D.CHANNELS) { if (ch === 'phi') continue; let m = 0; for (let s = 0; s <= 100; s += 0.5) m = Math.max(m, Math.abs(val(base.pieces[1], s)[ch] - val(rounded.pieces[1], s)[ch])); if (m > 0) dev[ch] = m; }
  out.otherChannelsMaxDiff = dev;
  // the ideal ramp's own values at 10/20/50 (what the spline should hold)
  const a = Math.min(10, 25) / 100, R = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u < a ? (a * (Math.pow(u / a, 3) - Math.pow(u / a, 4) / 2)) / (1 - a) : u <= 1 - a ? (a / 2 + u - a) / (1 - a) : 1 - (a * (Math.pow((1 - u) / a, 3) - Math.pow((1 - u) / a, 4) / 2)) / (1 - a));
  out.ideal = { at10: -54.05 * R(0.1), at20: -54.05 * R(0.2), at50: -54.05 * R(0.5) };
}
console.log(JSON.stringify(out, null, 1));
if (process.argv[2] === '--json') fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1));

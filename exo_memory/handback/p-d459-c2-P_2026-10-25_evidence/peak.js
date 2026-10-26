'use strict';
const path = require('path'); const T = path.resolve(process.argv[2]); const D = require(path.join(T, 'src/core/document.js')), { extend, smoother } = require(path.join(T, 'src/core/extend.js')); const DEG = Math.PI / 180;
const peak = (P, ch) => { let m = 0; for (let s = 0.5; s <= P.length; s += 0.5) m = Math.max(m, Math.abs(D.valuesAt(P, s)[ch] - D.valuesAt(P, s - 0.5)[ch]) / 0.5); return ch === 'phi' ? m / DEG : m; };
const rms = (P, ch, v0, v1) => { let e = 0, n = 0; for (let s = 0; s <= P.length; s += 0.5) { const ideal = v0 + (v1 - v0) * smoother(s / P.length), got = D.valuesAt(P, s)[ch]; e += (got - ideal) ** 2; n++; } return Math.sqrt(e / n) / Math.abs(v1 - v0) * 100; };
for (const [ch, first, target, L] of [['e', { e: 30 }, 0, 50], ['er', {}, 35, 50], ['phi', {}, 30 * DEG, 100], ['phi', {}, 30 * DEG, 60], ['c', { c: 15 }, 0, 40]]) {
  let d = extend(D.createDoc('k'), { length: 100, ...(Object.keys(first).length ? { first } : {}) }); d = extend(d, { length: L, targets: { [ch]: target } }); const P = d.pieces[1];
  const v0 = ch === 'e' ? 30 : ch === 'c' ? 15 : 0, v1 = ch === 'phi' ? 30 * DEG : target, ideal = 1.875 * Math.abs(v1 - v0) / L;
  console.log(`${ch} ${ch === 'phi' ? 30 : Math.abs(target - v0)}° over ${L} m: knots ${P.knots.length}, points ${P.channels[ch].length}, peak ${peak(P, ch).toFixed(3)} °/m vs the quintic's ${(ch === 'phi' ? ideal / DEG : ideal).toFixed(3)} (${(peak(P, ch) / (ch === 'phi' ? ideal / DEG : ideal)).toFixed(2)}×), rms off the quintic ${rms(P, ch, v0, v1).toFixed(2)} % of the change`);
}

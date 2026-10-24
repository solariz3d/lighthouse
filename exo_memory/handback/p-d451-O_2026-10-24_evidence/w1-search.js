'use strict';
// D451 (O): looking for a lap that reaches W1 (bankLap's per-piece withhold) at the bound's edge, where the descent check reads the banked road's bank at the far
// run's first curved sample against 5°. Each lap: closed by close() on its last piece, banked by bankLapWith (P's probe's path); prints what was withheld and the
// worst lean over curved stations.   node w1-search.js <tree>
const path = require('path'), T = path.resolve(process.argv[2]), r = (p) => require(path.join(T, p));
const D = r('src/core/document.js'), AD = r('src/core/adapter.js'), F = r('src/core/finish.js'), { close } = r('src/core/close.js'), { extend } = r('src/core/extend.js'), { extendTurnBy } = r('src/core/turnby.js');
const DEG = Math.PI / 180, Q = (300 * Math.PI) / 2, T90 = (d) => extendTurnBy(d, { length: Q }, 90 * DEG), S = (d, L) => extend(d, { length: L });
const rect = (mid, lat = 240) => { const adv = 560, b = 100, c = 100, e = 100, a = e + lat, f = b + c + adv - 100;
  let d = D.createDoc('probe'); d = extend(d, { length: 100, family: 'bowl' }); d = T90(d); d = S(d, a); d = T90(d); d = S(d, b); d = mid(d); d = S(d, c); d = T90(d); d = S(d, e); d = T90(d); return S(d, f); };
const between = (mid, R1 = 300, R2 = 300) => (d) => { d = extend(d, { length: 300, targets: { kh: 1 / R1 }, transition: 20 }); d = mid(d); d = extend(d, { length: 300, targets: { kh: -1 / R2 }, transition: 20 }); return extend(d, { length: 150, targets: { kh: 0 }, transition: 20 }); };
const worst = (doc) => { const { segments, path: p } = AD.toPath(doc, { step: 2 }); let w = 90, at = null;
  for (const q of p.samples) { const k = q.kvec, kh = Math.hypot(k[0], k[2]); if (segments[q.seg].kind === 'gap' || kh < 1 / 600) continue; const l = Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[2] * k[2]) / kh))) / DEG; if (l < w) { w = l; at = `${segments[q.seg].id} s ${q.s.toFixed(0)}`; } }
  return `${w.toFixed(2)}° at ${at}`; };
const cases = [];
for (let x = 74; x <= 84.001; x += 0.5) cases.push([`x${x}`, () => rect(between((d) => extend(d, { length: x, targets: { kh: 0 }, transition: 20 })))]);
for (const R of [4000, 5000, 6000, 8000, 10000, 14000, 20000, 30000]) for (const L of [90, 100, 110]) cases.push([`g${R}-${L}`, () => rect(between((d) => extend(d, { length: L, targets: { kh: 1 / R }, transition: 20 })), 300)]);
for (const R2 of [200, 250, 400, 600]) for (const x of [70, 76, 80, 86]) cases.push([`x${x}-R2_${R2}`, () => rect(between((d) => extend(d, { length: x, targets: { kh: 0 }, transition: 20 }), 300, R2))]);
let reached = 0;
for (const [name, mk] of cases) {
  let line; try { const d = mk(), c = close(d, { edited: [d.pieces.length - 1] }); if (!c.converged) { console.log(`${name}: close() did not converge`); continue; }
    const w = F.bankLapWith(c.doc); if (w.withheld.length || w.none) reached++;
    line = `${name}: withheld ${w.withheld.join(',') || '-'}; none ${w.none || '-'}; eased ${w.eased.join(',') || '-'}; worst ${worst(w.doc)}`;
  } catch (e) { line = `${name}: threw ${e.message}`; }
  console.log(line);
}
console.log(`laps ${cases.length}, reaching W1 (withheld or none) ${reached}`);

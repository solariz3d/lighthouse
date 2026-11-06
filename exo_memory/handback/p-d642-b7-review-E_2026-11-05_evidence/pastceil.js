// usage: node pastceil.js <tree>   spans AT OR PAST the closed-form ceiling, which extend.spanHolds takes without a probe (`if (span >= ceil) return true`): the built road's peak roll
// acceleration ÷ the bar (the rows' reader) for each span from the ceiling to the piece's length by 1 m. Counted over 1.0 (the adapter's bar, the probe's PROBE_BAR) and over 1.05
// (the rows' bar). Cases: the panel's rounded first ramp, bank-backs.
'use strict';
const path = require('path'), R = path.resolve(process.argv[2]), q = (m) => require(path.join(R, m));
const D = q('src/core/document.js'), A = q('src/core/adapter.js'), X = q('src/core/extend.js');
const DEG = Math.PI / 180, BAR = 29.4 / (10 * 170 * 170);
const pathPeak = (d, s0, s1) => { const S = A.toPath(d).path.samples, r = (s) => { let lo = 0, hi = S.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].s <= s) lo = m; else hi = m; } return S[lo].roll; }; let m = 0; for (let s = s0; s <= s1; s += 0.5) m = Math.max(m, Math.abs(r(s + 2) - 2 * r(s) + r(s - 2)) / 4); return m / BAR; };
const out = [];
for (const [stepDeg, L, tgt] of [[66.14, 750, 0], [88.45, 1000, -88.45], [88.45, 1000, -30.3], [88.45, 1000, 0], [30, 750, 0], [60, 600, -60], [66.14, 750, -88.45]]) {
  const base = { step: stepDeg * DEG, length: L }, a = stepDeg * DEG, b = tgt * DEG;
  // the ceiling: the smallest span spanHolds takes with no probe (found by asking spanHolds itself would probe below it, so bisect on the closed form through secondMinM's ceiling: the first span where spanHolds is true for every longer span is not what we want; we want ceil)
  // read the ceiling as the first span s at which spanHolds stays true when probePeak is never asked: approximate it from the share rule's figure by scanning down from L with a quick probe-free test is not exposed, so take it from the refusal text
  let ceil = null; try { X.extend(X.extend(D.createDoc('g'), { length: 1000, family: 'bowl' }), { length: L, targets: { phi: a }, bankShape: 'rounded', changes: { phi: [{ from: L - 1, target: b }] } }); } catch (e) { const m = /needs at least ([\d.]+) m/.exec(e.message); ceil = m ? Number(m[1]) : null; }
  if (ceil === null) { out.push({ case: `${stepDeg}/${L} -> ${tgt}`, error: 'no ceiling read' }); continue; }
  let n = 0, over1 = 0, over105 = 0, worst = 0, worstAt = null; const overAt = [];
  for (let span = Math.ceil(ceil); span <= L - 1; span += 1) {
    const F = L - span; let d; try { d = X.extend(X.extend(D.createDoc('g'), { length: 1000, family: 'bowl' }), { length: L, targets: { phi: a }, bankShape: 'rounded', changes: { phi: [{ from: F, target: b }] } }); } catch (e) { continue; }
    d = X.extend(d, { length: 200 }); const p = pathPeak(d, 1000 + F - 20, 1000 + L + 20); n++;
    if (p > 1.0 + 1e-9) { over1++; if (overAt.length < 12) overAt.push(`${span}:${p.toFixed(3)}`); } if (p > 1.05) over105++; if (p > worst) { worst = p; worstAt = span; }
  }
  out.push({ case: `${stepDeg}°/${L} m -> ${tgt}°`, ceilingNamed: ceil, spansLaid: n, over1, over105, worst: +worst.toFixed(3), worstAtSpan: worstAt, overAt });
}
console.log(JSON.stringify(out, null, 1));

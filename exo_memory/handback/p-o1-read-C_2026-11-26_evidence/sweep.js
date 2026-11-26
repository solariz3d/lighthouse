'use strict';
// sweep.js <tree>: same-direction changes inside a moving first ramp, followed by a second change; built peak and WHERE it sits. Synthetic only.
const path = require('path'), ROOT = process.argv[2];
const D = require(path.join(ROOT, 'src/core/document.js')), EX = require(path.join(ROOT, 'src/core/extend.js')), A = require(path.join(ROOT, 'src/core/adapter.js'));
const DEG = Math.PI / 180, BAR = 29.4 / (10 * 170 * 170), R = (x) => (x * DEG) / 100;
function peakAt(d, a, b, pitch) {
  const S = A.toPath(d).path.samples; let prev = null, off = 0;
  const H = S.map((x) => { let v = pitch ? Math.asin(Math.max(-1, Math.min(1, x.T[1]))) : Math.atan2(x.T[2], x.T[0]); if (prev !== null) { while (v + off - prev > Math.PI) off -= 2 * Math.PI; while (v + off - prev < -Math.PI) off += 2 * Math.PI; } prev = v + off; return { s: x.s, v: v + off }; });
  const atS = (s) => { let lo = 0, hi = H.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (H[m].s <= s) lo = m; else hi = m; } const f = (s - H[lo].s) / (H[hi].s - H[lo].s); return H[lo].v + f * (H[hi].v - H[lo].v); };
  let m = 0, at = 0; for (let s = a; s <= b; s += 0.5) { const v = Math.abs(atS(s + 1) - 2 * atS(s) + atS(s - 1)); if (v > m) { m = v; at = s; } } return [m / BAR, at];
}
const rows = [];
for (const ch of ['kh', 'kv']) for (const [first, t1, t2] of ch === 'kh' ? [[-80, -100, -90], [-80, -95, -90], [-80, -90, -85], [-60, -75, -70], [80, 100, 90]] : [[-30, -40, -35], [-30, -36, -33], [20, 28, 24]])
  for (let f1 = 40; f1 <= 200; f1 += 20) for (const gap of [80, 100, 130]) { const f2 = f1 + gap; if (f2 > 280) continue;
    const d0 = EX.extend(D.createDoc('g'), { length: 200, targets: { [ch]: R(0) } });
    let r; try { const d = EX.extend(d0, { length: 300, targets: { [ch]: R(first) }, changes: { [ch]: [{ from: f1, target: R(t1) }, { from: f2, target: R(t2) }] } });
      const [p, at] = peakAt(d, 180, 520, ch === 'kv'); r = { laid: 1, p: +p.toFixed(3), at: +(at - 200).toFixed(1) }; } catch (e) { r = { laid: 0, need: +(+e.needM).toFixed(1) }; }
    rows.push({ ch, first, t1, t2, f1, f2, ...r }); }
// the ramp alone (no change): its own peak, for scale
for (const [ch, first] of [['kh', -80], ['kv', -30]]) { const d0 = EX.extend(D.createDoc('g'), { length: 200, targets: { [ch]: 0 } }); const d = EX.extend(d0, { length: 300, targets: { [ch]: R(first) } }); const [p, at] = peakAt(d, 180, 520, ch === 'kv'); rows.push({ ch, first, rampAlone: 1, p: +p.toFixed(3), at: +(at - 200).toFixed(1) }); }
for (const r of rows) console.log(JSON.stringify(r));

'use strict';
// D439 (O): one lap's closer from each of two trees, side by side: Finish's plan, whether the roll is laid first, and the D434 bars on the closer (mean lean, stations
// leaning out by more than 5°, peak side load at the design speed; core_finish_bank's lean()). The laps: core_finish's bankedEnd (row 12's) and P's laps.
//   node modes.js <tree> [<tree> ...]
const path = require('path');
const LAPS = [['bankedEnd -150/200/54 (core_finish row 12)', 'banked', [-150, 200, 54]], ['bankedEnd 150/200/-54 (its mirror)', 'banked', [150, 200, -54]],
  ['bankedEnd 120/200/54 (row 10)', 'banked', [120, 200, 54]], ['bankedEnd 90/400/126 (row 10)', 'banked', [90, 400, 126]],
  ['P turn 210 tail 300 roll 30', 'p', [210, 300, 30]], ['P turn 180 tail 1200 roll 10', 'p', [180, 1200, 10]], ['P turn 180 tail 1200 roll 30', 'p', [180, 1200, 30]]];
for (const T of process.argv.slice(2).map((t) => path.resolve(t))) {
  const D = require(path.join(T, 'src/core/document.js')), F = require(path.join(T, 'src/core/finish.js')), AD = require(path.join(T, 'src/core/adapter.js'));
  const { extend } = require(path.join(T, 'src/core/extend.js')), { extendTurnBy } = require(path.join(T, 'src/core/turnby.js')), { MACH6, G } = require(path.join(T, 'src/validate/limits.js'));
  const DEG = Math.PI / 180, v = MACH6.designSpeedKmh / 3.6;
  const build = (kind, [a, b, c]) => {
    if (kind === 'banked') { let d = D.createDoc('banked'); d = extend(d, { length: 400 }); d = extendTurnBy(d, { length: 500 }, a * DEG); d = extend(d, { length: b }); d = extend(d, { length: 200, transition: 100, targets: { phi: c * DEG } }); return extend(d, { length: 100, targets: { kv: 0 } }); }
    let d = D.createDoc('p'); d = extend(d, { length: 1000, family: 'bowl', first: { c: 10 } }); d = extendTurnBy(d, { length: 1500, targets: { kv: 0 } }, a * DEG); return extend(d, { length: b, targets: { c: 35, phi: c * DEG } });
  };
  console.log(`== ${T}`);
  for (const [name, kind, args] of LAPS) {
    const open = build(kind, args); let r;
    try { r = F.finishToStart(open); } catch (e) { console.log(`  ${name}: REFUSED ${e.code || ''} ${String(e.message).slice(0, 120)}`); continue; }
    const { segments, path: p } = AD.toPath(r.doc, { step: 2 }), ids = new Set(r.doc.pieces.slice(open.pieces.length).map((P) => P.id));
    let n = 0, out = 0, sum = 0, lat = 0;
    for (const q of p.samples) { if (!ids.has(segments[q.seg].id)) continue; const k = q.kvec, km = Math.hypot(...k); if (km < 1 / 600) continue;
      const l = Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[1] * k[1] + q.U[2] * k[2]) / km))) / DEG, f = [v * v * k[0], v * v * k[1] + G, v * v * k[2]];
      n++; sum += l; if (l < -5) out++; lat = Math.max(lat, Math.abs((f[0] * q.L[0] + f[1] * q.L[1] + f[2] * q.L[2]) / G)); }
    console.log(`  ${name}: roll ${r.plan.rollM ? (r.plan.rollFirst ? 'FIRST' : 'LAST') : 'none'}, ${r.plan.lengthM} m, hold ${r.plan.minHoldG} g; lean ${(sum / n).toFixed(1)}° over ${n}, ${out} out; side ${lat.toFixed(2)} g | ${r.plan.report.slice(0, 110)}`);
  }
}

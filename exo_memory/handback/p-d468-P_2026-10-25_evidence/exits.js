// exits.js <tree>: every curved run's exit lean on the flip laps of core_close_banks_lap rows 10 and 11 (D447 §10's table), and the lean-out count
'use strict';
const T = process.argv[2];
const D = require(T + '/src/core/document.js'), { extend } = require(T + '/src/core/extend.js'), { extendTurnBy } = require(T + '/src/core/turnby.js'), { extendSharp } = require(T + '/src/core/sharp.js'), AD = require(T + '/src/core/adapter.js'), CJ = require(T + '/app/core/closejob.js');
const DEG = Math.PI / 180, Q = (Math.PI * 300) / 2;
const T90 = (d) => extendTurnBy(d, { length: Q }, 90 * DEG), S = (d, L) => extend(d, { length: L });
function row10() { let d = D.createDoc('probe'); d = extend(d, { length: 100, family: 'bowl' }); d = T90(d); d = S(d, 700); d = T90(d); d = S(d, 100); d = extend(d, { length: 300, targets: { kh: 1 / 300 } }); d = extendSharp(d, {}, { angle: -60 * DEG, R: 150, ramp: 4 }); d = extend(d, { length: 150 }); d = S(d, 100); d = T90(d); d = S(d, 100); d = T90(d); d = S(d, 400); return d; }
function row11() { const lat = 240, adv = 560, b = 100, c = 100, e = 100, a = e + lat, f = b + c + adv - 100; let d = D.createDoc('probe'); d = extend(d, { length: 100, family: 'bowl' }); d = T90(d); d = S(d, a); d = T90(d); d = S(d, b); d = extend(d, { length: 300, targets: { kh: 1 / 300 }, transition: 20 }); d = extend(d, { length: 300, targets: { kh: -1 / 300 }, transition: 20 }); d = extend(d, { length: 150, targets: { kh: 0 }, transition: 20 }); d = S(d, c); d = T90(d); d = S(d, e); d = T90(d); d = S(d, f); return d; }
for (const [name, open] of [['the sharp after a turn', row10()], ['the 20 m flip', row11()]]) {
  const r = CJ.runCloseBest({ doc: open }); if (!r.converged) { console.log(name, 'did not close'); continue; }
  const { segments, path } = AD.toPath(r.doc, { step: 2 }), runs = []; let out = 0, worst = 90, run = null;
  for (const q of path.samples) {
    const g = segments[q.seg], k = q.kvec, kh = Math.hypot(k[0], k[2]); if (g.kind === 'gap' || kh < 1 / 600) { run = null; continue; }
    const l = Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[2] * k[2]) / kh))) / DEG; if (l < -5) out++; worst = Math.min(worst, l);
    const side = Math.sign(q.T[2] * k[0] - q.T[0] * k[2]);
    if (!run || run.side !== side || q.s - run.last > 4) { run = { side, first: q.s, last: q.s, lastId: g.id, all: [] }; runs.push(run); }
    run.last = q.s; run.lastId = g.id; run.all.push(l);
  }
  console.log(`${name}: ${runs.length} runs; exits ${runs.map((x) => `${x.first.toFixed(0)}–${x.last.toFixed(0)} (${x.lastId}) ${x.all[x.all.length - 1].toFixed(1)}°`).join(' | ')}; leaning out ${out}, worst ${worst.toFixed(1)}°; report: ${String(r.report).slice(0, 90)}`);
}

'use strict';
// D438 build (O): the figures for one tree's closer of each open fixture: Finish's plan; each closer joint's and the seam's step under the outer wheels (the
// rows' own jointSteps, read from <rows tree>/test/core_finish_joints.test.js); the closer's fastest cup change; the D434 bars (mean lean, stations out, peak side
// load at the design speed, the roll peak, the gap).   node figures.js <tree> <rows tree> [testtrack10-open,test10-open]
// The fixtures are read from <rows tree>/fixtures-d431 (private: never committed).
const path = require('path'), fs = require('fs'), T = path.resolve(process.argv[2]), R = path.resolve(process.argv[3]);
const F = require(path.join(T, 'src/core/finish.js')), D = require(path.join(T, 'src/core/document.js')), AD = require(path.join(T, 'src/core/adapter.js'));
const V = require(path.join(T, 'src/validate/index.js')), { MACH6, G } = require(path.join(T, 'src/validate/limits.js')), { residual } = require(path.join(T, 'src/core/close.js'));
const src = fs.readFileSync(path.join(R, 'test/core_finish_joints.test.js'), 'utf8').replace(/\ntest\([\s\S]*$/, '\nmodule.exports = { jointSteps };').replace("require('node:test')", 'null')
  .replace(/require\('\.\.\/src\//g, `require(${JSON.stringify(path.join(T, 'src').replace(/\\/g, '/') + '/')} + '`);
const m = new module.constructor(path.join(T, 'figures-x.js')); m.filename = path.join(T, 'figures-x.js'); m.paths = module.paths; m._compile(src, m.filename);
const v = MACH6.designSpeedKmh / 3.6, DEG = Math.PI / 180;
for (const f of (process.argv[4] || 'testtrack10-open,test10-open').split(',')) {
  const o = D.parse(fs.readFileSync(path.join(R, 'fixtures-d431', f + '.t180track'), 'utf8')), r = F.finishToStart(o), doc = r.doc, n0 = o.pieces.length;
  const s0 = []; let a = 0; for (const P of doc.pieces) { s0.push(a); a += P.length; }
  const js = []; for (let j = n0; j < doc.pieces.length; j++) js.push([doc.pieces[j - 1].id + '|' + doc.pieces[j].id, s0[j]]); js.push([doc.pieces[doc.pieces.length - 1].id + '|' + doc.pieces[0].id + ' (seam)', 0]);
  const st = m.exports.jointSteps(doc, js.map((x) => x[1]));
  let cup = 0, cupAt = '-'; for (const P of doc.pieces.slice(n0)) { if (!P.cup) continue; let prev = D.valuesAt(P, 0).c; for (let s = 1; s <= P.length; s++) { const c = D.valuesAt(P, Math.min(s, P.length)).c; if (Math.abs(c - prev) > cup) { cup = Math.abs(c - prev); cupAt = `${P.id} +${s} m`; } prev = c; } }
  const { segments, path: p } = AD.toPath(doc, { step: 2 }), ids = new Set(doc.pieces.slice(n0).map((P) => P.id));
  let n = 0, out = 0, sum = 0, lat = 0;
  for (const q of p.samples) { if (!ids.has(segments[q.seg].id)) continue; const k = q.kvec, km = Math.hypot(...k); if (km < 1 / 600) continue;
    const l = Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[1] * k[1] + q.U[2] * k[2]) / km))) / DEG, fv = [v * v * k[0], v * v * k[1] + G, v * v * k[2]];
    n++; sum += l; if (l < -5) out++; lat = Math.max(lat, Math.abs((fv[0] * q.L[0] + fv[1] * q.L[1] + fv[2] * q.L[2]) / G)); }
  const roll = V._internal.rollRates(p.samples, (i) => segments[p.samples[i].seg].kind !== 'gap', true, p.lengthM).filter((q) => ids.has(segments[p.samples[q.i].seg].id)).reduce((mm, q) => Math.max(mm, q.rate), 0);
  console.log(`${f}: ${r.plan.report}`);
  console.log(`  pieces: ${doc.pieces.slice(n0).map((P) => `${P.id} ${Math.round(P.length)} m`).join(', ')}`);
  for (let k = 0; k < js.length; k++) console.log(`  ${js[k][0].padEnd(16)} u +8.4 ${st[k][8.4].toFixed(1).padStart(5)}  u -8.4 ${st[k][-8.4].toFixed(1).padStart(5)}  u 0 ${st[k][0].toFixed(1).padStart(5)}  °/100 m`);
  console.log(`  cup: fastest ${cup.toFixed(4)} °/m at ${cupAt}; end ${doc.pieces.at(-1).cup ? D.pieceEnd(doc.pieces.at(-1)).c.v.toFixed(3) : '-'} → p1 ${doc.pieces[0].cup ? doc.pieces[0].channels.c[0].toFixed(3) : '-'}`);
  console.log(`  D434 bars: mean lean ${(sum / n).toFixed(1)}° over ${n} curved stations, ${out} out; peak side load ${lat.toFixed(2)} g; roll peak ${roll.toFixed(3)} °/m (amber ${V.ROLL_AMBER_DEG_M}); gap ${(residual(doc).gapM * 1000).toFixed(3)} mm`);
}

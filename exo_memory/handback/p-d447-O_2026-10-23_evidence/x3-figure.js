'use strict';
// D447 §10 (O): X3 (the roll rate not scaled past the amber) on the laps where the amber fails on the first try (P §8.5: Sharp, Sharp ramp 40). For each lap, the
// press's closed lap with and without the rate scaling: per road piece the largest change of the bank channel (phi) and of the mean lean over its curved
// stations. The mutant is applied to the tree's finish.js and restored (also on exit), under the heavy-run lock.   node x3-figure.js <tree>
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const T = path.resolve(process.argv[2]), F = path.join(T, 'src/core/finish.js');
if (process.argv[3] === 'child') {
  const D = require(path.join(T, 'src/core/document.js')), AD = require(path.join(T, 'src/core/adapter.js')), CJ = require(path.join(T, 'app/core/closejob.js'));
  const { extend } = require(path.join(T, 'src/core/extend.js')), { extendTurnBy } = require(path.join(T, 'src/core/turnby.js')), { extendSharp } = require(path.join(T, 'src/core/sharp.js'));
  const DEG = Math.PI / 180, Q = (300 * Math.PI) / 2, T90 = (d) => extendTurnBy(d, { length: Q }, 90 * DEG), S = (d, L) => extend(d, { length: L });
  const sharp = (ramp) => { let d = D.createDoc('probe'); d = extend(d, { length: 100, family: 'bowl' }); d = T90(d); d = S(d, 700); d = T90(d); d = S(d, 100);
    d = extend(d, { length: 300, targets: { kh: 1 / 300 } }); d = extendSharp(d, {}, { angle: -60 * DEG, R: 150, ramp }); d = extend(d, { length: 150 }); d = S(d, 100); d = T90(d); d = S(d, 100); d = T90(d); return S(d, 400); };
  const out = {};
  for (const [name, ramp] of [['sharp', 4], ['ramp40', 40]]) { const r = CJ.runCloseBest({ doc: sharp(ramp) }), { segments, path: p } = AD.toPath(r.doc, { step: 2 }), lean = {};
    for (const q of p.samples) { const g = segments[q.seg], k = q.kvec, kh = Math.hypot(k[0], k[2]); if (g.kind === 'gap' || kh < 1 / 600) continue; (lean[g.id] = lean[g.id] || []).push(Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[2] * k[2]) / kh))) / DEG); }
    out[name] = { report: r.report, phi: Object.fromEntries(r.doc.pieces.map((P) => [P.id, P.channels.phi])), lean: Object.fromEntries(Object.entries(lean).map(([id, xs]) => [id, xs.reduce((a, b) => a + b, 0) / xs.length])) }; }
  process.stdout.write(JSON.stringify(out)); process.exit(0);
}
require(path.join(__dirname, '..', '..', '..', 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'd447 x3-figure (finish.js mutated: do not read this tree meanwhile)', tree: T });
const src = fs.readFileSync(F, 'utf8'); process.on('exit', () => fs.writeFileSync(F, src));
const run = () => JSON.parse(spawnSync(process.execPath, [__filename, T, 'child'], { encoding: 'utf8', maxBuffer: 1 << 28 }).stdout);
const a = run(), X3 = ' rollScale *= (allowed / peak) * 0.97;'; if (src.split(X3).length !== 2) throw new Error('X3 NOT APPLIED');
fs.writeFileSync(F, src.replace(X3, '')); const b = run(); fs.writeFileSync(F, src);
for (const lap of Object.keys(a)) { const rows = [];
  for (const id of Object.keys(a[lap].phi)) { const pa = a[lap].phi[id], pb = b[lap].phi[id]; const dphi = pb && pb.length === pa.length ? Math.max(...pa.map((x, i) => Math.abs(x - pb[i]))) / (Math.PI / 180) : NaN;
    const la = a[lap].lean[id], lb = b[lap].lean[id]; if (dphi > 1e-9 || (la !== undefined && Math.abs(la - lb) > 1e-9)) rows.push(`${id}: phi ${dphi.toFixed(2)}°, mean lean ${la === undefined ? '-' : la.toFixed(1) + ' → ' + lb.toFixed(1) + '°'}`); }
  console.log(`${lap}: with the scaling | ${a[lap].report}\n  without        | ${b[lap].report}\n  ${rows.join('\n  ') || 'identical'}`); }

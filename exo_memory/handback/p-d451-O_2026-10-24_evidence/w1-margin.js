'use strict';
// D451 (O): at the bound's edge (x79–x80.5), the bank the descent check reads (the banked road's phi − upright at each gap's far side b, toward the far turn's
// outside) against the worst lean on the lap, from bankLap with the descent pins OFF (a copy of the tree's finish.js, the check's filter made empty), so the
// two can be compared where the check would or would not fire.   node w1-margin.js <tree>
const fs = require('fs'), path = require('path'), os = require('os'), T = path.resolve(process.argv[2]);
const src = fs.readFileSync(path.join(T, 'src/core/finish.js'), 'utf8'), a = 'const late = fl.gaps.filter('; if (src.split(a).length !== 2) throw new Error('descent check NOT APPLIED');
const C = fs.mkdtempSync(path.join(os.tmpdir(), 'd451-')); for (const d of ['src', 'app', 'tools']) fs.cpSync(path.join(T, d), path.join(C, d), { recursive: true });
fs.writeFileSync(path.join(C, 'src/core/finish.js'), src.replace(a, 'const late = [].filter('));
const r = (p) => require(path.join(C, p)), D = r('src/core/document.js'), AD = r('src/core/adapter.js'), F = r('src/core/finish.js'), { close } = r('src/core/close.js'), { extend } = r('src/core/extend.js'), { extendTurnBy } = r('src/core/turnby.js');
const DEG = Math.PI / 180, Q = (300 * Math.PI) / 2, T90 = (d) => extendTurnBy(d, { length: Q }, 90 * DEG), S = (d, L) => extend(d, { length: L });
const rect = (mid) => { let d = D.createDoc('probe'); d = extend(d, { length: 100, family: 'bowl' }); d = T90(d); d = S(d, 340); d = T90(d); d = S(d, 100); d = mid(d); d = S(d, 100); d = T90(d); d = S(d, 100); d = T90(d); return S(d, 660); };
const lap = (x) => rect((d) => { d = extend(d, { length: 300, targets: { kh: 1 / 300 }, transition: 20 }); d = extend(d, { length: x, targets: { kh: 0 }, transition: 20 }); d = extend(d, { length: 300, targets: { kh: -1 / 300 }, transition: 20 }); return extend(d, { length: 150, targets: { kh: 0 }, transition: 20 }); });
const bankAt = (doc, s) => { let s0 = 0; for (const P of doc.pieces) { if (s <= s0 + P.length) return D.valuesAt(P, Math.max(0, s - s0)).phi; s0 += P.length; } return NaN; };
for (const x of [79, 79.25, 79.5, 79.75, 80, 80.5]) {
  const d = lap(x), c = close(d, { edited: [d.pieces.length - 1] }), w = F.bankLapWith(c.doc), up = D.valuesAt(c.doc.pieces[0], 0).phi, g = F.flipsOf(c.doc).gaps.find((q) => q[1] > 1700 && q[1] < 2000);
  const { segments, path: p } = AD.toPath(w.doc, { step: 2 }); let worst = 90, at = 0;
  for (const q of p.samples) { const k = q.kvec, kh = Math.hypot(k[0], k[2]); if (segments[q.seg].kind === 'gap' || kh < 1 / 600) continue; const l = Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[2] * k[2]) / kh))) / DEG; if (l < worst) { worst = l; at = q.s; } }
  console.log(`x${x}: gap ${g ? g[0].toFixed(0) + '–' + g[1].toFixed(0) + ' m' : 'none'}; bank at b toward the outside ${g ? (((bankAt(w.doc, g[1]) - up) * g[2]) / DEG).toFixed(2) + '°' : '-'}; worst lean ${worst.toFixed(2)}° at s ${at.toFixed(0)}; withheld ${w.withheld.join(',') || '-'}`);
}
fs.rmSync(C, { recursive: true, force: true });

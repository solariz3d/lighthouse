// closeprobe.js (D459 3b, P): the cup's exact end curvature across every closer joint and the seam on core_joint_c2's "rolled cup" lap, through finishToStart, per tree.
'use strict';
const path = require('path'); const T = path.resolve(process.argv[2]); const DEG = Math.PI / 180, H = 0.5;
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js')), { extendTurnBy } = require(path.join(T, 'src/core/turnby.js')), F = require(path.join(T, 'src/core/finish.js'));
const at = (P, ch, s) => { const v = D.valuesAt(P, Math.max(0, Math.min(P.length, s)))[ch]; return ch === 'phi' ? v / DEG : v; };
const d2end = (P, ch) => { const L = P.length, g = (s) => at(P, ch, s); return (2 * g(L) - 5 * g(L - H) + 4 * g(L - 2 * H) - g(L - 3 * H)) / (H * H); };
const d2start = (P, ch) => { const g = (s) => at(P, ch, s); return (2 * g(0) - 5 * g(H) + 4 * g(2 * H) - g(3 * H)) / (H * H); };
for (const cupTo of [35, 38, 45]) {
  let d = D.createDoc('rolled cup'); d = extend(d, { length: 1000, family: 'bowl', first: { c: 10 } }); d = extendTurnBy(d, { length: 1500, targets: { kv: 0 } }, Math.PI); d = extend(d, { length: 300, targets: { c: cupTo, phi: 40 * DEG } });
  const n0 = d.pieces.length, r = F.finishToStart(d), doc = r.doc; const L = doc.pieces.slice(n0).reduce((a, P) => a + P.length, 0);
  const rows = []; for (let k = n0 - 1; k < doc.pieces.length; k++) { const A = doc.pieces[k], B = doc.pieces[(k + 1) % doc.pieces.length]; rows.push(`${A.id}|${B.id} c'' ${Math.abs(d2start(B, 'c') - d2end(A, 'c')).toFixed(5)} phi'' ${Math.abs(d2start(B, 'phi') - d2end(A, 'phi')).toFixed(5)}`); }
  console.log(`cupTo ${cupTo}: closer ${L.toFixed(0)} m, delta ${(cupTo - 10)}°, delta/L ${((cupTo - 10) / L).toFixed(4)}, report: ${r.plan.report.slice(0, 120)}`); console.log('  ' + rows.join('\n  '));
}

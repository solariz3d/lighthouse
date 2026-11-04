'use strict';
// D434 build (O): how far each new turn's bank sits from the ruling's formula, −0.75·atan(v²·k/g) of the FINAL (closed) curvature, at the control points where the
// rate limit is not binding (both neighbouring steps under 0.8 of the cap per metre of Greville spacing). Per lap: the largest |bank − formula| (rad) and how many
// points were read. With D434_MUT=<n> the tree's finish.js is loaded with one of bank-mutants.js's replacements applied in memory (nothing written).
//   node share-residual.js <tree> [mutant index]
const TREE = process.argv[2], MUT = process.argv[3];
const fs = require('fs'), path = require('path'), Module = require('module');
const file = path.join(TREE, 'src/core/finish.js'); let src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
if (MUT !== undefined) { const muts = { 2: ['    res = close(banked({ ...first.doc, closed: false }, bankPlan(first.doc, window, share, uprightSet), plan1), { window });', '    res = first;'], 5: ['BANK_ROLL = 0.9,', 'BANK_ROLL = 1e6,'] }; const [a, b] = muts[MUT]; if (src.split(a).length !== 2) throw new Error('no anchor'); src = src.replace(a, b); }
const m = new Module(file, module); m.filename = file; m.paths = Module._nodeModulePaths(path.dirname(file)); m._compile(src, file);
const F = m.exports, D = require(path.join(TREE, 'src/core/document.js')), { MACH6, G } = require(path.join(TREE, 'src/validate/limits.js')), V = require(path.join(TREE, 'src/validate/index.js'));
const { extend } = require(path.join(TREE, 'src/core/extend.js')), { extendTurnBy } = require(path.join(TREE, 'src/core/turnby.js'));
const v = MACH6.designSpeedKmh / 3.6, cap = (0.8 * 0.9 * V.ROLL_AMBER_DEG_M * Math.PI) / 180;
const laps = { testtrack10: () => D.parse(fs.readFileSync(path.join(TREE, 'fixtures-d431', 'testtrack10-open.t180track'), 'utf8')), test10: () => D.parse(fs.readFileSync(path.join(TREE, 'fixtures-d431', 'test10-open.t180track'), 'utf8')), gentle: () => { let d = D.createDoc('g'); d = extend(d, { length: 1000, family: 'bowl' }); return extendTurnBy(d, { length: Math.round(Math.PI * 2000), targets: { kv: 0 } }, Math.PI); } };
for (const [name, mk] of Object.entries(laps)) {
  const open = mk(), r = F.finishToStart(open);
  let worst = 0, n = 0;
  for (const P of r.doc.pieces.slice(open.pieces.length)) {
    const ph = P.channels.phi, kh = P.channels.kh, U = D.knotVector(P), g = (i) => (U[i + 1] + U[i + 2] + U[i + 3]) / 3;
    if (Math.abs(ph[0] - ph[ph.length - 1]) > 1e-4 || !kh.some((k) => Math.abs(k) > 1e-6)) continue;   // a turn laid upright: the same bank at both ends
    for (let i = 2; i < ph.length - 2; i++) {
      const t = (j) => ph[j] - ph[0];
      if (Math.abs(t(i) - t(i - 1)) > cap * (g(i) - g(i - 1)) || Math.abs(t(i + 1) - t(i)) > cap * (g(i + 1) - g(i))) continue;
      const want = -0.75 * Math.atan((v * v * kh[i]) / G); worst = Math.max(worst, Math.abs(t(i) - want)); n++;
    }
  }
  console.log(JSON.stringify({ lap: name, mutant: MUT || 'none', pointsRead: n, worstResidualRad: +worst.toExponential(3), worstResidualDeg: +((worst * 180) / Math.PI).toFixed(4) }));
}

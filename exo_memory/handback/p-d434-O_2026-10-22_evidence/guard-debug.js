'use strict';
// D434 build (O): what closeBanked's roll guard sees on TEST TRACK 10. finish.js is loaded with its internals exposed by appending an export to a COPY in memory
// (Module._compile), the laid route of the returned finish captured, and for each share 0.75 → scaled: the bank's roll peak on the turns, and where it is.
//   node guard-debug.js <tree>
const TREE = process.argv[2], fs = require('fs'), path = require('path'), Module = require('module');
const file = path.join(TREE, 'src/core/finish.js'), m = new Module(file, module); m.filename = file; m.paths = Module._nodeModulePaths(path.dirname(file));
m._compile(fs.readFileSync(file, 'utf8') + '\n;module.exports.__ = { banked, bankRollPeak, closeBanked, BANK_SHARE };', file);
const F = m.exports, { close } = require(path.join(TREE, 'src/core/close.js')), D = require(path.join(TREE, 'src/core/document.js')), AD = require(path.join(TREE, 'src/core/adapter.js')), V = require(path.join(TREE, 'src/validate/index.js'));
const open = D.parse(fs.readFileSync(path.join(TREE, 'fixtures-d431', 'testtrack10-open.t180track'), 'utf8'));
const CM = require(path.join(TREE, 'src/core/close.js'));
const r0 = F.finishToStart(open), n0 = open.pieces.length, window = Array.from({ length: r0.doc.pieces.length - n0 }, (_, j) => n0 + j);
console.log('plan', r0.plan.report.slice(0, 100), 'window', window);
// rebuild the laid route: the finish's own pieces with their bank taken back to the laid (flat) one is not recoverable here, so lay again by closing the flat route
const laidFlat = D.checkDoc({ ...r0.doc, closed: false });
for (const share of [0.75, 0.5, 0.25]) {
  const first = close(F.__.banked(laidFlat, window, laidFlat, share), { window });
  const res = close(F.__.banked({ ...first.doc, closed: false }, window, first.doc, share, { doc: laidFlat, share }), { window });
  const peak = F.__.bankRollPeak(res.doc, window);
  const { segments, path: p } = AD.toPath(res.doc, { step: 2 }), S = p.samples;
  const worst = V._internal.rollRates(S, (i) => segments[S[i].seg].kind !== 'gap', true, p.lengthM).filter((q) => window.includes(res.doc.pieces.findIndex((P) => P.id === segments[S[q.i].seg].id))).sort((a, b) => b.rate - a.rate).slice(0, 3).map((q) => `${segments[S[q.i].seg].id}@${q.s.toFixed(0)}:${q.rate.toFixed(3)}`);
  console.log(JSON.stringify({ share, converged: res.converged, turnsPeak: +peak.toFixed(3), amber: V.ROLL_AMBER_DEG_M, worstOnWindow: worst }));
}

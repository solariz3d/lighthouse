'use strict';
const T = process.argv[2];
const D = require(T + '/src/core/document.js'), { extend } = require(T + '/src/core/extend.js'), { extendTurnBy } = require(T + '/src/core/turnby.js'), F = require(T + '/src/core/finish.js'), CN = require(T + '/src/core/continuity.js'), CJ = require(T + '/app/core/closejob.js');
const DEG = Math.PI / 180, Q = (Math.PI * 300) / 2;
function lap() { let d = D.createDoc('lap'); d = extend(d, { length: 100, family: 'bowl' }); d = extendTurnBy(d, { length: Q }, 90 * DEG); d = extend(d, { length: 100 }); d = extend(d, { length: Q / 2, targets: { kh: 1 / 300 } }); d = extendTurnBy(d, { length: Q / 2 }, 67.5 * DEG); d = extend(d, { length: 100, targets: { phi: -20 * DEG } }); d = extendTurnBy(d, { length: Q }, 90 * DEG); d = extend(d, { length: 100, targets: { phi: 0 } }); d = extendTurnBy(d, { length: Q }, 90 * DEG); return d; }
const c = CJ.runCloseBest({ doc: lap() }); console.log('closeBest converged', c.converged, 'route', c.route, 'report', String(c.report).slice(0, 80));
const cd = c.doc; const before = CN.jointSteps(cd, { channels: ['phi'] }).filter((e) => Math.abs(e.dkDeg) > CN.TOL_K);
console.log('closed lap before bankLap: phi joints over tol', before.length + ':', before.map((e) => e.joint + ' ' + e.dkDeg.toFixed(4)).join(', '));
const b = F.bankLapWith(cd); const all = CN.jointSteps(b.doc, { channels: ['phi'] }), over = all.filter((e) => Math.abs(e.dkDeg) > CN.TOL_K);
console.log('after bankLap: joints', all.length, 'over tol', over.length + ':', over.map((e) => e.joint + ' ' + e.dkDeg.toFixed(4)).join(', '), '; eased', JSON.stringify(b.eased), 'withheld', JSON.stringify(b.withheld), 'none', b.none);

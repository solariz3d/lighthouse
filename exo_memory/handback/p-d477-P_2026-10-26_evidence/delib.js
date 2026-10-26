'use strict';
// D477 read: the deliberate-3° lap (row 7's) piece by piece: what the first press adds, and whether a second press changes it. T=<tree> to run against a copy.
const os = require('os'); os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path');
const T = process.env.T || 'C:/Users/nname/Downloads/t180-wt-p477', r = (f) => require(path.join(T, f));
const D = r('src/core/document.js'), { extend } = r('src/core/extend.js'), { extendTurnBy } = r('src/core/turnby.js'), { close } = r('src/core/close.js'), F = r('src/core/finish.js');
const DEG = Math.PI / 180, QQ = (300 * Math.PI) / 2;
let d = extend(D.createDoc('deliberate 3'), { length: 200, family: 'bowl' });
d = extend(d, { length: 100, targets: { phi: 3 * DEG } }); d = extend(d, { length: 300 });
d = extend(d, { length: 500, transition: 40, targets: { kh: -1 / 10000 } }); d = extend(d, { length: 100, transition: 40, targets: { phi: 0, kh: 0 } });
d = extendTurnBy(d, { length: QQ }, -90 * DEG); d = extend(d, { length: 400 }); d = extendTurnBy(d, { length: QQ }, -90 * DEG); d = extend(d, { length: 1200 });
d = extendTurnBy(d, { length: QQ }, -90 * DEG); d = extend(d, { length: 400 }); d = extendTurnBy(d, { length: QQ }, -90 * DEG);
const c = close(d, { window: [d.pieces.length - 2, d.pieces.length - 1] }); if (!c.converged) throw new Error(c.report);
const lap = c.doc, b = F.bankLapWith(lap);
for (const [i, P] of lap.pieces.entries()) { const a = b.doc.pieces[i].channels.phi, e = P.channels.phi; const dd = a.map((v, k) => (v - e[k]) / DEG); const m = Math.max(...dd.map(Math.abs)); console.log(`${P.id} n${e.length} carried ${(Math.min(...e) / DEG).toFixed(2)}..${(Math.max(...e) / DEG).toFixed(2)}° kh ${Math.max(...P.channels.kh.map(Math.abs)).toExponential(1)}: add max ${m.toFixed(3)}°${m > 1e-6 && m < 10 ? '  adds ' + dd.map((v) => v.toFixed(2)).join(' ') : ''}; after ${(Math.min(...a) / DEG).toFixed(2)}..${(Math.max(...a) / DEG).toFixed(2)}°`); }
console.log('level', JSON.stringify(b.level), 'eased', JSON.stringify(b.eased), 'withheld', JSON.stringify(b.withheld));
const b2 = F.bankLapWith(b.doc); console.log('press 2:', b2.doc === b.doc ? 'same doc' : 'CHANGED ' + b2.doc.pieces.map((P, i) => [P.id, Math.max(...P.channels.phi.map((v, k) => Math.abs(v - b.doc.pieces[i].channels.phi[k]))) / DEG]).filter(([, m]) => m > 1e-9).map(([id, m]) => id + ' ' + m.toFixed(3)).join(' '));

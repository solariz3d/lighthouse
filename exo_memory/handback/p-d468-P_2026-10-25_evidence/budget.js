'use strict';
const T = process.argv[2], R = Number(process.argv[3]);
const D = require(T + '/src/core/document.js'), { extend } = require(T + '/src/core/extend.js'), { extendTurnBy } = require(T + '/src/core/turnby.js'), F = require(T + '/src/core/finish.js'), CJ = require(T + '/app/core/closejob.js');
const DEG = Math.PI / 180, Q = (Math.PI * R) / 2;
function lap() { let d = D.createDoc('lap'); d = extend(d, { length: 100, family: 'bowl' }); d = extendTurnBy(d, { length: Q }, 90 * DEG); d = extend(d, { length: 100 }); d = extend(d, { length: Q / 2, targets: { kh: 1 / R } }); d = extendTurnBy(d, { length: Q / 2 }, 67.5 * DEG); d = extend(d, { length: 100, targets: { phi: -20 * DEG } }); d = extendTurnBy(d, { length: Q }, 90 * DEG); d = extend(d, { length: 100, targets: { phi: 0 } }); d = extendTurnBy(d, { length: Q }, 90 * DEG); return d; }
console.error(`== R ${R}: finishToStart on the open lap`); try { const r = F.finishToStart(lap()); console.error('  finish:', r.plan.report.slice(0, 100)); } catch (e) { console.error('  finish refused', e.code); }
console.error(`== R ${R}: Close (runCloseBest) then bankLapWith`); const c = CJ.runCloseBest({ doc: lap() }); console.error('  close:', String(c.report).slice(0, 80)); const b = F.bankLapWith(c.doc); console.error('  bankLapWith eased', b.eased, 'withheld', b.withheld);

'use strict';
const fs = require('fs'), path = require('path');
const D = require('./t/src/core/document.js'), { extend } = require('./t/src/core/extend.js'), PC = require('./t/src/core/piece.js');
const DEG = Math.PI / 180, dir = 't/test/fixtures';
const F5 = () => D.parse(fs.readFileSync(path.join(dir, fs.readdirSync(dir).find((n) => n.startsWith('F5-'))), 'utf8'));
const joint = (d, i) => { const A = d.pieces[i - 1], B = d.pieces[i], a = D.channelAt(A, 'phi', A.length), b = D.channelAt(B, 'phi', 0); return `dv ${(b.v - a.v).toExponential(1)} dd1 ${(b.d1 - a.d1).toExponential(1)} dd2 ${(b.d2 - a.d2).toExponential(1)} (a.d2 ${a.d2.toExponential(2)})`; };
const tryit = (name, f) => { try { console.log(name, f()); } catch (e) { console.log(name, 'THROW', e.code, e.message.slice(0, 150)); } };
// 1. after F5 (rolling end), the transition given as ONE number (not per channel)
tryit('F5 + flow, transition 15 (number)', () => { const f = F5(), d = extend(f, { length: 300, targets: { phi: 10 * DEG }, transition: 15, bankShape: 'flow' }); return joint(d, d.pieces.length - 1); });
tryit('F5 + flow, transition {phi:15}', () => { const f = F5(), d = extend(f, { length: 300, targets: { phi: 10 * DEG }, transition: { phi: 15 }, bankShape: 'flow' }); return joint(d, d.pieces.length - 1); });
tryit('F5 + flow, transition 30 (number) + mark 60', () => { const f = F5(), d = extend(f, { length: 300, targets: { phi: 10 * DEG }, transition: 30, bankShape: 'flow', through: { phi: [{ at: 60, target: 20 * DEG }] } }); const P = d.pieces[d.pieces.length - 1]; return joint(d, d.pieces.length - 1) + ` | at 30: ${(D.channelValue(P, 'phi', 30) / DEG).toFixed(3)} (asked 10)`; });
// 2. the first piece of a track
tryit('first piece, flow', () => { const d = extend(D.createDoc('x'), { length: 300, family: 'bowl', first: { phi: 5 * DEG }, targets: { phi: -20 * DEG }, transition: { phi: 80 }, bankShape: 'flow', through: { phi: [{ at: 145, target: -27 * DEG }, { at: 200, target: 0 }] } }); const P = d.pieces[0], a = D.channelAt(P, 'phi', 0); return `start v ${(a.v / DEG).toFixed(3)} d1 ${a.d1.toExponential(1)} d2 ${a.d2.toExponential(1)}`; });
// 3. after a tube
tryit('after a tube, flow', () => { let d = extend(D.createDoc('t'), { length: 200, family: 'bowl', first: { t: 200 }, targets: { phi: 8 * DEG }, transition: { phi: 60 } }); d = extend(d, { length: 200, targets: { phi: 15 * DEG, t: 120 }, transition: { phi: 50 }, bankShape: 'flow', through: { phi: [{ at: 120, target: -5 * DEG }] } }); return `kind ${D.endKind(d)} ${joint(d, 1)}`; });
tryit('tube rolling end then flow', () => { let d = extend(D.createDoc('t'), { length: 200, family: 'bowl', first: { t: 200 }, targets: { phi: 8 * DEG }, transition: { phi: 60 }, bankShape: 'flow', through: { phi: [{ at: 200, target: 20 * DEG }] } }); d = extend(d, { length: 200, targets: { phi: 0 }, transition: { phi: 60 }, bankShape: 'flow' }); return joint(d, 1); });
// 4. a mirrored run inserted after a head that ends rolling (F5): insert re-joins C1 only
tryit('mirrored flow run after F5', () => { const lead = extend(D.createDoc('m'), { length: 300, family: 'bowl' }); const src = extend(lead, { length: 300, targets: { phi: -20 * DEG }, transition: { phi: 80 }, bankShape: 'flow', through: { phi: [{ at: 145, target: -27 * DEG }, { at: 200, target: 0 }] } }); const run = PC.saveRun(src, 1, 1, { name: 'f' }); const d = PC.insert(F5(), run, { mirror: true }); return joint(d, d.pieces.length - 1); });
tryit('flow straight after F5 (control)', () => { const f = F5(), d = extend(f, { length: 300, targets: { phi: 20 * DEG }, transition: { phi: 80 }, bankShape: 'flow' }); return joint(d, d.pieces.length - 1); });

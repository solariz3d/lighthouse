'use strict';
const path = require('path'), W = process.argv[2];
require('C:/Consonance/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E: L136 registration sketch detail' });
try { require('os').setPriority(require('os').constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) {}
const D = require(path.join(W, 'src/core/document.js')), { extend } = require(path.join(W, 'src/core/extend.js')), A = require(path.join(W, 'src/core/adapter.js'));
const { extendCorner } = require(path.join(W, 'src/core/turnby.js')), { extendOptions } = require(path.join(W, 'app/core/panel.js'));
const DEG = Math.PI / 180, BAR = 29.4 / (10 * 170 * 170) / DEG;
const o = extendOptions({ length: '750', turn: '270', climb: '-6', bank: '-28.47', width: '30', cup: '15', edge: '', start: '', tube: '', atStart: { bank: true, cup: true }, turnAs: 'corner', thenBank: '0', bankFrom: '' });
let d = extend(D.createDoc('sketch'), { length: 1000, family: 'bowl' }); d = extendCorner(d, o); d = extend(d, { length: 200 });
const plan = A.bankPlan(d); console.log('bankPlan entries with a built fn (pieces):', plan.map((e, i) => (e && e.fn ? i : null)).filter((x) => x !== null).join(',') || 'none');
const S = A.toPath(d).path.samples, r = (s) => { let lo = 0, hi = S.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].s <= s) lo = m; else hi = m; } return S[lo].roll / DEG; };
let peak = 0, at = 0; for (let s = 952; s <= 1798; s += 2) { const a = Math.abs(r(s + 2) - 2 * r(s) + r(s - 2)) / 4; if (a > peak) { peak = a; at = s - 1000; } }
let mx = 0; const P = d.pieces[1]; for (let s = 0; s <= 750; s += 0.5) mx = Math.max(mx, Math.abs(r(1000 + s) - D.channelAt(P, 'phi', s).v / DEG));
console.log(`sketch: peak built roll acceleration ${peak.toFixed(5)} °/m² at ${at} m (BANK_BAR ${BAR.toFixed(5)}); max |built − document| over the piece ${mx.toFixed(3)}°; second from ${o.second.phi.from}`);
for (const [lab, tr] of [['table rows', null]]) { const T = [[10, 60], [10, 120], [30, 60], [30, 120], [60, 60], [60, 120]]; for (const [dd, t] of T) { const doc = extend(extend(extend(D.createDoc('e'), { length: 1000, family: 'bowl' }), { length: 1000, targets: { phi: dd * DEG }, transition: t }), { length: 200 }); const p = A.bankPlan(doc); console.log(`${dd}° over ${t} m: bankPlan fn on pieces ${p.map((e, i) => (e && e.fn ? i : null)).filter((x) => x !== null).join(',') || 'none'}; floor 2√(Δ/a) = ${(2 * Math.sqrt(dd * DEG / (BAR * DEG))).toFixed(1)} m against the ramp's ${t} m`); } }
{ const pts = [200, 211.25, 400, 600, 637.5, 660, 680, 700, 720, 740, 750]; console.log('sketch built/document (°):', pts.map((s) => `${s}:${r(1000 + s).toFixed(2)}/${(D.channelAt(P, 'phi', s).v / DEG).toFixed(2)}`).join('  '));
  let ma = 0, mat = 0; for (let s = 0; s <= 750; s += 0.5) { const x = Math.abs(r(1000 + s) - D.channelAt(P, 'phi', s).v / DEG); if (x > ma) { ma = x; mat = s; } } console.log(`max |built − document| ${ma.toFixed(3)}° at ${mat} m`);
  let lean = null; const hold = r(1000 + 600); for (let s = 600; s <= 750; s += 0.5) if (Math.abs(r(1000 + s) - hold) > 0.5) { lean = s; break; } console.log(`built road leaves the −28.47 hold (by 0.5°) at ${lean} m (from 637.5)`); }

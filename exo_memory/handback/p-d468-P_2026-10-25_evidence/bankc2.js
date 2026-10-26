// bankc2.js <tree>: the bank's C2 steps (phi, °/m²) at the joints Finish's closer and bankLap own, today, and the validator's roll-rate warnings. Red baseline for D468 part 1.
'use strict';
const T = process.argv[2], fs = require('fs'), path = require('path');
const D = require(T + '/src/core/document.js'), { extend } = require(T + '/src/core/extend.js'), { extendTurnBy } = require(T + '/src/core/turnby.js'), F = require(T + '/src/core/finish.js'), CN = require(T + '/src/core/continuity.js'), V = require(T + '/src/validate/index.js'), AD = require(T + '/src/core/adapter.js');
const DEG = Math.PI / 180;
function rolledCup() { let d = D.createDoc('rolled cup'); d = extend(d, { length: 1000, family: 'bowl', first: { c: 10 } }); d = extendTurnBy(d, { length: 1500, targets: { kv: 0 } }, Math.PI); return extend(d, { length: 300, targets: { c: 35, phi: 40 * DEG } }); }
function pLap(turnDeg, tailM, rollDeg, turnM = 1500) { let d = D.createDoc(`P ${turnDeg}/${tailM}/${rollDeg}`); d = extend(d, { length: 1000, family: 'bowl', first: { c: 10 } }); d = extendTurnBy(d, { length: turnM, targets: { kv: 0 } }, (turnDeg * Math.PI) / 180); return extend(d, { length: tailM, targets: { c: 35, phi: (rollDeg * Math.PI) / 180 } }); }
function gentle() { let d = D.createDoc('gentle'); d = extend(d, { length: 1000, family: 'bowl' }); return extendTurnBy(d, { length: Math.round(Math.PI * 2000), targets: { kv: 0 } }, Math.PI); }
const fx = (f) => { const p = path.join(T, 'fixtures-d431', f); return fs.existsSync(p) ? D.parse(fs.readFileSync(p, 'utf8')) : null; };
const laps = { 'rolled cup': rolledCup(), 'P 210/300/30': pLap(210, 300, 30), 'P 180/1200/10': pLap(180, 1200, 10), 'P 180/1200/30': pLap(180, 1200, 30), gentle: gentle(), 'TEST 10': fx('test10-open.t180track'), 'TEST TRACK 10': fx('testtrack10-open.t180track') };
function rollWarnings(doc) { try { const r = V.validate ? V.validate(doc) : V.check(doc); const w = (r.warnings || r.issues || []).filter((x) => /roll/i.test(JSON.stringify(x))); return w.length; } catch (e) { return 'n/a ' + e.message.slice(0, 40); } }
function rollPeak(doc, from) { const { segments, path: p } = AD.toPath(doc, { step: 2 }), ids = new Set(doc.pieces.slice(from).map((P) => P.id)); return V._internal.rollRates(p.samples, (i) => segments[p.samples[i].seg].kind !== 'gap', true, p.lengthM).filter((r) => ids.has(segments[p.samples[r.i].seg].id)).reduce((m, r) => Math.max(m, r.rate), 0); }
for (const [name, open] of Object.entries(laps)) {
  if (!open) { console.log(name, ': fixture absent'); continue; }
  let r; try { r = F.finishToStart(open); } catch (e) { console.log(name, ': finish refused', e.code); continue; }
  const doc = r.doc, n0 = open.pieces.length;
  const br = CN.jointSteps(doc, { channels: ['phi'] }).filter((e) => e.k >= n0 - 1 || e.joint.endsWith('|' + doc.pieces[0].id));
  const over = br.filter((e) => Math.abs(e.dkDeg) > CN.TOL_K);
  console.log(`${name}: closed ${doc.closed}, closer ${doc.pieces.length - n0} pieces (${r.plan.report.slice(0, 60)}); phi joints from the closer's first: ${br.length}, over ${CN.TOL_K}: ${over.length}; ` + over.map((e) => `${e.joint} ${e.dkDeg.toFixed(4)}`).join(', ') + `; roll peak on the closer ${rollPeak(doc, n0).toFixed(3)} °/m (amber ${V.ROLL_AMBER_DEG_M})`);
}
// bankLap on a closed lap of upright curves (core_close_banks_lap's shape): a square-ish lap closed by Close, then banked
const CJ = require(T + '/app/core/closejob.js');

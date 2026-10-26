// ambers.js <tree>: the validator's roll-rate ambers and reds, and every other amber/red count, on each Finish closer's closed lap and the banked lap (D468: "report any amber that newly fires")
'use strict';
const T = process.argv[2], fs = require('fs'), path = require('path');
const D = require(T + '/src/core/document.js'), { extend } = require(T + '/src/core/extend.js'), { extendTurnBy } = require(T + '/src/core/turnby.js'), F = require(T + '/src/core/finish.js'), V = require(T + '/src/validate/index.js'), AD = require(T + '/src/core/adapter.js'), CJ = require(T + '/app/core/closejob.js');
const DEG = Math.PI / 180, Q = (Math.PI * 300) / 2;
function rolledCup() { let d = D.createDoc('rolled cup'); d = extend(d, { length: 1000, family: 'bowl', first: { c: 10 } }); d = extendTurnBy(d, { length: 1500, targets: { kv: 0 } }, Math.PI); return extend(d, { length: 300, targets: { c: 35, phi: 40 * DEG } }); }
function pLap(turnDeg, tailM, rollDeg, turnM = 1500) { let d = D.createDoc(`P ${turnDeg}/${tailM}/${rollDeg}`); d = extend(d, { length: 1000, family: 'bowl', first: { c: 10 } }); d = extendTurnBy(d, { length: turnM, targets: { kv: 0 } }, (turnDeg * Math.PI) / 180); return extend(d, { length: tailM, targets: { c: 35, phi: (rollDeg * Math.PI) / 180 } }); }
function gentle() { let d = D.createDoc('gentle'); d = extend(d, { length: 1000, family: 'bowl' }); return extendTurnBy(d, { length: Math.round(Math.PI * 2000), targets: { kv: 0 } }, Math.PI); }
function lap() { let d = D.createDoc('lap'); d = extend(d, { length: 100, family: 'bowl' }); d = extendTurnBy(d, { length: Q }, 90 * DEG); d = extend(d, { length: 100 }); d = extend(d, { length: Q / 2, targets: { kh: 1 / 300 } }); d = extendTurnBy(d, { length: Q / 2 }, 67.5 * DEG); d = extend(d, { length: 100, targets: { phi: -20 * DEG } }); d = extendTurnBy(d, { length: Q }, 90 * DEG); d = extend(d, { length: 100, targets: { phi: 0 } }); d = extendTurnBy(d, { length: Q }, 90 * DEG); return d; }
const fx = (f) => { const p = path.join(T, 'fixtures-d431', f); return fs.existsSync(p) ? D.parse(fs.readFileSync(p, 'utf8')) : null; };
const laps = { 'rolled cup': rolledCup(), 'P 210/300/30': pLap(210, 300, 30), 'P 180/1200/10': pLap(180, 1200, 10), 'P 180/1200/30': pLap(180, 1200, 30), gentle: gentle(), 'TEST 10': fx('test10-open.t180track'), 'TEST TRACK 10': fx('testtrack10-open.t180track') };
function report(name, doc) {
  const { segments, path: p } = AD.toPath(doc, { step: 2 }), r = V.validate(p, segments, {});
  const tally = (list) => { const m = {}; for (const x of list) { const k = x.reason || x.kind || 'other'; m[k] = (m[k] || 0) + 1; } return JSON.stringify(m); };
  console.log(`${name}: red ${r.red.length} ${tally(r.red)}; amber ${r.amber.length} ${tally(r.amber)}`);
}
for (const [name, open] of Object.entries(laps)) { if (!open) { console.log(name, ': fixture absent'); continue; } let r; try { r = F.finishToStart(open); } catch (e) { console.log(name, ': finish refused', e.code); continue; } report(name, r.doc); }
report('the banked lap (Close)', CJ.runCloseBest({ doc: lap() }).doc);

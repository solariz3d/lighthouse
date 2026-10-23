'use strict';
// D440 (O): Finish's wall time and result on a set of laps, for one tree: his two tracks (private fixtures, read from <tree>/fixtures-d431) and laps built here.
// Each lap is finished RUNS times in one process (the first run warms the path cache, close.js:253), and each run's time is printed.   node timing.js <tree> [runs]
const path = require('path'), fs = require('fs'), T = path.resolve(process.argv[2]), RUNS = Number(process.argv[3] || 2);
const D = require(path.join(T, 'src/core/document.js')), F = require(path.join(T, 'src/core/finish.js')), { extend } = require(path.join(T, 'src/core/extend.js')), { extendTurnBy } = require(path.join(T, 'src/core/turnby.js'));
const p = (turnLen, t, tail, roll) => () => { let e = D.createDoc('p'); e = extend(e, { length: 1000, family: 'bowl', first: { c: 10 } }); e = extendTurnBy(e, { length: turnLen, targets: { kv: 0 } }, t * Math.PI / 180); return extend(e, { length: tail, targets: { c: 35, phi: roll * Math.PI / 180 } }); };
const LAPS = [['TEST TRACK 10', () => D.parse(fs.readFileSync(path.join(T, 'fixtures-d431/testtrack10-open.t180track'), 'utf8'))], ['TEST 10', () => D.parse(fs.readFileSync(path.join(T, 'fixtures-d431/test10-open.t180track'), 'utf8'))],
  ['tight own turn 180/400, tail 1200 roll 10', p(400, 180, 1200, 10)], ['P 210/1500, tail 300 roll 30', p(1500, 210, 300, 30)], ['P 180/1500, tail 1200 roll 10', p(1500, 180, 1200, 10)]];
for (const [name, mk] of LAPS) {
  const times = []; let line = '';
  for (let k = 0; k < RUNS; k++) { const open = mk(), t0 = process.hrtime.bigint(); try { const r = F.finishToStart(open); line = r.plan.report.slice(0, 120); } catch (e) { line = `REFUSED ${e.code}: ${String(e.message).slice(0, 160)}`; } times.push(Number(process.hrtime.bigint() - t0) / 1e9); }
  console.log(`${name}: ${times.map((t) => t.toFixed(1) + ' s').join(', ')} | ${line}`);
}

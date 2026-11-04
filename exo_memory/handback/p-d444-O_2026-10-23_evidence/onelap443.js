// onelap443.js (P): the steep lap kv -0.003 / tail 600 / roll 10 at one tree, the whole refusal text or the closer. node onelap443.js <tree>
const path = require('path'); const T = process.argv[2];
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js')), { extendTurnBy } = require(path.join(T, 'src/core/turnby.js')), F = require(path.join(T, 'src/core/finish.js'));
const DEG = Math.PI / 180;
let d = D.createDoc('p'); d = extend(d, { length: 1000, family: 'bowl', first: { c: 10 } }); d = extendTurnBy(d, { length: 1500, targets: { kv: 0 } }, 180 * DEG);
d = extend(d, { length: 300, targets: { kv: -0.003 } }); d = extend(d, { length: 100, targets: { kv: 0 } }); const open = extend(d, { length: 600, targets: { c: 35, phi: 10 * DEG } });
try { const r = F.finishToStart(open); console.log('CLOSED', r.plan.report); } catch (e) { console.log('REFUSED', e.code, '\n', e.message); }

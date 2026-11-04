'use strict';
const TREE = process.argv[2];
const D = require(`${TREE}/src/core/document.js`), { extend } = require(`${TREE}/src/core/extend.js`), { extendTurnBy } = require(`${TREE}/src/core/turnby.js`), { finishToStart } = require(`${TREE}/src/core/finish.js`);
const per100 = (v) => v * 100 * 180 / Math.PI;
function overshoot(d, from) { let worst = 0, at = null;
  for (let j = Math.max(1, from); j < d.pieces.length; j++) { const A = d.pieces[j - 1], B = d.pieces[j]; if (A.type !== 'road' || B.type !== 'road') continue;
    for (const ch of ['kh', 'kv']) { const a = A.channels[ch].map(per100), b = B.channels[ch].map(per100), n = a.length;
      const outer = [a[n - 4], a[n - 3], b[2], b[3]], inner = [a[n - 2], a[n - 1], b[1]], lo = Math.min(...outer), hi = Math.max(...outer);
      for (const v of inner) { const o = v < lo ? lo - v : v > hi ? v - hi : 0; if (o > worst) { worst = o; at = `${A.id}|${B.id} ${ch}`; } } } }
  return { worst: +worst.toFixed(3), at }; }
const shapes = {};
for (const kv of [-0.0002, -0.0004, -0.0006]) for (const L of [600, 1000]) shapes['drop kv ' + kv + ' over ' + L] = () => { let d = D.createDoc('t'); d = extend(d, { length: 500, family: 'bowl' }); d = extend(d, { length: L, transition: 60, targets: { kv } }); d = extend(d, { length: L, transition: 60, targets: { kv: 0 } }); d = extendTurnBy(d, { length: 900, targets: { kv: 0 } }, Math.PI); return d; };
for (const [name, mk] of Object.entries(shapes)) {
  try { const open = mk(); const r = finishToStart(open); const n0 = open.pieces.length;
    const S = require(`${TREE}/src/core/finish.js`).endPose(open);
    console.log(name, 'open end height', S.y.toFixed(1), 'm; plan:', r.plan.report.slice(0, 110), '| closer overshoot', JSON.stringify(overshoot(r.doc, n0)));
  } catch (e) { console.log(name, 'ERR', e.code, e.message.slice(0, 150)); }
}

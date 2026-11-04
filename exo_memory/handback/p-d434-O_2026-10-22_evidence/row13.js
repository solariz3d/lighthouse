'use strict';
// D434 build (O): core_finish row 13's lap (copied verbatim: 300 m, a 90° turn, a 600 m drop at kv -0.001, 100 m) and steeper drops, finished on one tree: refused
// (and how) or closed, and if closed: the plan, finish.js roadHold's lowest load on the new road, and the validator's lap proof (validate(..).lap.ok, fullSpeed, csp,
// as the finish rows' lapOf).   node row13.js <tree>
const TREE = process.argv[2];
const D = require(`${TREE}/src/core/document.js`), F = require(`${TREE}/src/core/finish.js`), AD = require(`${TREE}/src/core/adapter.js`), { validate } = require(`${TREE}/src/validate/index.js`);
const { extend } = require(`${TREE}/src/core/extend.js`), { extendTurnBy } = require(`${TREE}/src/core/turnby.js`), DEG = Math.PI / 180;
const lapOf = (doc) => { const { path } = AD.toPath(doc); return validate(path, AD.toSegments(doc), { fullSpeed: true, csp: true }).lap; };
for (const kv of [-0.001, -0.0015, -0.002, -0.003]) {
  let d = D.createDoc('dropped'); d = extend(d, { length: 300 }); d = extendTurnBy(d, { length: 400 }, 90 * DEG); d = extend(d, { length: 600, transition: 300, targets: { kv } }); d = extend(d, { length: 100, targets: { kv: 0 } });
  try { const r = F.finishToStart(d), lap = lapOf(r.doc); console.log(JSON.stringify({ kv, closed: true, plan: r.plan.report.slice(0, 80), roadHoldMinG: F.roadHold(r.doc, d.pieces.length).worst.toFixed(2), lapProves: lap.ok, lapReason: lap.ok ? null : JSON.stringify(lap).slice(0, 160) })); }
  catch (e) { console.log(JSON.stringify({ kv, refused: e.code, message: String(e.message).slice(0, 140) })); }
}

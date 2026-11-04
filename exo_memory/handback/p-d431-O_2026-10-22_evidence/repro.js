'use strict';
// D431 (O): reproduce TEST 10's closer. The undo history's past[21] is the open lap (20 pieces, 8,900 m) the keeper pressed Finish on; finishToStart on it
// is compared with the saved present (23 pieces, closed). Then the control points of kh and kv across the closer's two joints, in the plan's units (°/100 m),
// as the plan's table reads them: the last 4 of the piece before the joint | the first 4 after.   node repro.js <tree> [out.json]
const [TREE, OUT] = process.argv.slice(2);
const fs = require('fs'), path = require('path');
const D = require(`${TREE}/src/core/document.js`), { finishToStart } = require(`${TREE}/src/core/finish.js`);
const U = JSON.parse(fs.readFileSync(path.join(__dirname, 'test10', 'eq-TEST 10.t180undo'), 'utf8'));
const open = D.parse(U.past[21]), saved = D.parse(U.present);
const t0 = Date.now(); const res = finishToStart(open); const ms = Date.now() - t0;
const per100 = (v) => +(v * 100 * 180 / Math.PI).toFixed(2);   // rad/m -> deg per 100 m
const joints = (d) => { const out = []; for (let j = 21; j < 23; j++) { const A = d.pieces[j - 1], B = d.pieces[j]; for (const ch of ['kv', 'kh']) out.push({ joint: `${A.id} -> ${B.id}`, ch, before: A.channels[ch].slice(-4).map(per100), after: B.channels[ch].slice(0, 4).map(per100) }); } return out; };
const same = D.serialize(res.doc) === D.serialize(saved);
const r = { open: { pieces: open.pieces.length, closed: !!open.closed }, ms, plan: res.plan.report, window: res.window, reproducesSavedBytes: same,
  savedJoints: joints(saved), reproJoints: joints(res.doc) };
console.log(JSON.stringify(r, null, 1));
if (OUT) fs.writeFileSync(OUT, JSON.stringify(r, null, 1));

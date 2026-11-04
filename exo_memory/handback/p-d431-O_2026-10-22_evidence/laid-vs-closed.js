'use strict';
// D431 (O): what close() did to the laid route. close.js's export is wrapped BEFORE finish.js loads (finish takes `close` from the module at require time), so the
// laid document finishToStart hands to the successful windowed close is captured; then each closer joint's kh and kv control points, laid and closed (°/100 m),
// and the change. Also the climb the close has to make: the laid route's end height against the start.   node laid-vs-closed.js <tree> [out.json]
const [TREE, OUT] = process.argv.slice(2);
const fs = require('fs'), path = require('path');
const CM = require(`${TREE}/src/core/close.js`), close0 = CM.close; let captured = null;
CM.close = function (doc, opts) { const r = close0(doc, opts); if (opts && opts.window && r.converged) captured = { laid: doc, window: opts.window, closed: r.doc }; return r; };
const D = require(`${TREE}/src/core/document.js`), { finishToStart, endPose } = require(`${TREE}/src/core/finish.js`);
const U = JSON.parse(fs.readFileSync(path.join(__dirname, 'test10', 'eq-TEST 10.t180undo'), 'utf8'));
const res = finishToStart(D.parse(U.past[21]));
const per100 = (v) => +(v * 100 * 180 / Math.PI).toFixed(2);
const { laid, closed } = captured, e = endPose(laid);
const rows = [];
for (let j = 21; j < 23; j++) for (const ch of ['kv', 'kh']) {
  const seq = (d) => [...d.pieces[j - 1].channels[ch].slice(-4), ...d.pieces[j].channels[ch].slice(1, 4)].map(per100);
  const L = seq(laid), C = seq(closed); rows.push({ joint: `${laid.pieces[j - 1].id}|${laid.pieces[j].id}`, ch, laid: L, closed: C, change: C.map((v, k) => +(v - L[k]).toFixed(2)) });
}
const r = { window: captured.window, laidEndHeightM: +e.y.toFixed(1), laidEndPitchDeg: +(e.pitch * 180 / Math.PI).toFixed(2), sameAsResult: captured.closed === res.doc || D.serialize(captured.closed) === D.serialize(res.doc), joints: rows };
console.log(JSON.stringify(r)); if (OUT) fs.writeFileSync(OUT, JSON.stringify(r, null, 1));

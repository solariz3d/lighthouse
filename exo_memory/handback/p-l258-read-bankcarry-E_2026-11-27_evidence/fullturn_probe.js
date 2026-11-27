// fullturn_probe.js <tree>: where the head lands when a full turn is laid by different routes, and what the panel's field shows and headTurns makes of a typed -32 next
'use strict';
const path = require('path'); const T = path.resolve(process.argv[2]); const R = (p) => require(path.join(T, p));
const D = R('src/core/document.js'), { extend } = R('src/core/extend.js'), HD = R('app/core/handles.js'); const DEG = Math.PI / 180;
const headOf = (d) => { const P = d.pieces[d.pieces.length - 1]; return D.channelAt(P, 'phi', P.length).v / DEG; };
const frame = (h) => ({ head: h, shown: (Math.round(HD.wrapTurn(h) * 100) / 100), turns: 360 * Math.round((h - HD.wrapTurn(h)) / 360) });
const base = () => extend(D.createDoc('f'), { length: 300, family: 'bowl', first: { w: 33 } });
const rows = [];
for (const L of [150, 300, 500, 777]) rows.push({ route: `one piece, length ${L}, to -360`, ...frame(headOf(extend(base(), { length: L, targets: { phi: -360 * DEG } }))) });
for (const L of [150, 300, 500]) rows.push({ route: `one piece, length ${L}, to +360`, ...frame(headOf(extend(base(), { length: L, targets: { phi: 360 * DEG } }))) });
rows.push({ route: 'two pieces -180 then -360', ...frame(headOf(extend(extend(base(), { length: 300, targets: { phi: -180 * DEG } }), { length: 300, targets: { phi: -360 * DEG } }))) });
rows.push({ route: 'three pieces -120 -240 -360', ...frame(headOf(extend(extend(extend(base(), { length: 200, targets: { phi: -120 * DEG } }), { length: 200, targets: { phi: -240 * DEG } }), { length: 200, targets: { phi: -360 * DEG } }))) });
try { rows.push({ route: 'a row: -180 then a change to -360 at 150 of 400', ...frame(headOf(extend(base(), { length: 400, targets: { phi: -180 * DEG }, changes: { phi: [{ from: 150, target: -360 * DEG }] } }))) }); } catch (e) { rows.push({ route: 'a row', error: String(e.message).slice(0, 120) }); }
try { rows.push({ route: 'flow: -180 then through -360 at 300 of 400', ...frame(headOf(extend(base(), { length: 400, bankShape: 'flow', targets: { phi: -360 * DEG }, transition: { phi: 50 }, through: { phi: [{ at: 200, target: -180 * DEG }] } }))) }); } catch (e) { rows.push({ route: 'flow', error: String(e.message).slice(0, 160) }); }
for (const r of rows) console.log(JSON.stringify(r));

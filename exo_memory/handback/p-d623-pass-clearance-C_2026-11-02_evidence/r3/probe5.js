// probe5.js <tree>: core_gridturn's spiral made with the core and opened (adopt): Turn to grid at each length and step, and row 2's jump then 150 m
'use strict';
const path = require('path'), T = process.argv[2];
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const TB = require(path.join(T, 'src/core/turnby.js')), D = require(path.join(T, 'src/core/document.js'));
const spiral = async () => {
  const s = await createCoreShell({});
  let d = TB.extendCorner(s.getState().history.present, { length: 200, family: 'bowl' });
  for (const [length, kh] of [[300, 1 / 150], [250, 1 / 90], [400, -1 / 200], [180, 1 / 60]]) d = TB.extendCorner(d, { length, transition: 60, targets: { kh } });
  s.adopt(d); return s;
};
(async () => {
  for (const L of [400, 300, 250, 200, 150, 100]) {
    const row = [];
    for (const step of [90, 45, 15]) { const s = await spiral(); s.extendTurnToGrid({ length: L, targets: {} }, step); const m = s.getState().message; row.push(`${step}:${m ? 'REFUSED' : 'ok'}`); }
    console.log('turn to grid', L, row.join(' '));
  }
  const s = await spiral();
  s.commitDoc(D.appendPiece(s.getState().history.present, D.flightPiece({ forward: 40, left: 6, up: 0, heading: 0.3, pitch: 0, bank: 0 })));
  for (const L of [150, 100, 60, 30]) { s.extend({ length: L }); const m = s.getState().message; console.log('row 2 landing', L, m ? m.slice(0, 120) : 'ok'); if (!m) s.undo(); }
  process.exit(0);
})();

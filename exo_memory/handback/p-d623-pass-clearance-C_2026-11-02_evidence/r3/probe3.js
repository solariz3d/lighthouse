// probe3.js <tree>: the refusal messages of core_segcache row 1's 'cup out of a tube' step and core_gridturn's spiral and its Turn to grid
'use strict';
const path = require('path'), T = process.argv[2];
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const R = 180, Q = Math.PI * R / 2;
(async () => {
  let s = await createCoreShell({});
  const say = (w) => console.log(w, '|', s.getState().message, '| pieces', s.getState().history.present.pieces.length);
  s.extend({ length: 300, family: 'bowl' }); s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 60, transition: 40, targets: { kh: 0 } });
  s.extend({ length: 300, first: { w: 40, t: 360 } }); say('tube');
  s.extend({ length: 300, first: { c: 60 } }); say('cup out of a tube');
  s = await createCoreShell({});
  s.extend({ length: 200, family: 'bowl' });
  for (const [length, kh] of [[300, 1 / 150], [250, 1 / 90], [400, -1 / 200], [180, 1 / 60]]) { s.extend({ length, transition: 60, targets: { kh } }); say(`spiral ${length}`); }
  for (const step of [90, 45, 15]) { s.extendTurnToGrid({ length: 400, targets: {} }, step); say(`turn to grid ${step}`); s.undo(); }
  for (const L of [100, 200, 300]) for (const step of [90, 45, 15]) { s.extendTurnToGrid({ length: L, targets: {} }, step); const m = s.getState().message; console.log('grid', L, step, m && m.slice(0, 40)); if (!m) s.undo(); }
  process.exit(0);
})();

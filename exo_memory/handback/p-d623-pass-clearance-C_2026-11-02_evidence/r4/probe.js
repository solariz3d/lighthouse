// probe.js <worktree>: does the shell lay a 150 m piece turning 720 degrees, and what does the checker list for it?
'use strict';
const path = require('path');
const W = process.argv[2];
const { createCoreShell } = require(path.join(W, 'app/core/coreshell.js'));
const TB = require(path.join(W, 'src/core/turnby.js'));
(async () => {
  const s = await createCoreShell({});
  const kh = (4 * Math.PI) / 150;
  s.extend({ length: 150, targets: { kh } });
  console.log('extend message:', s.getState().message, 'pieces:', s.getState().history.present.pieces.length);
  const t = await createCoreShell({});
  t.commitDoc(TB.extendCorner(t.getState().history.present, { length: 150, targets: { kh } }));
  console.log('commitDoc message:', t.getState().message, 'pieces:', t.getState().history.present.pieces.length);
})().catch((e) => { console.error(e); process.exit(1); });

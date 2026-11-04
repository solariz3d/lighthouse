// probe-b3.js (D467, pane E): a case where only the window's pieces move: two laps sharing piece 0 and differing after it; the open lap is the lap before (no drag)
'use strict';
const W = 'C:/Users/nname/Downloads/t180-wt-e467/';
const { createCoreShell } = require(W + 'app/core/coreshell.js');
const CJ = require(W + 'app/core/closejob.js');
const lapOf = async (Rq) => { const s = await createCoreShell({ autosaveMs: 0 }); const Q = (Math.PI * Rq) / 2; s.extend({ length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / Rq } }); s.extend({ length: 60, transition: 40, targets: { kh: 0 } }); s.close(); return s.getState().history.present; };
(async () => {
  const base = await lapOf(180), other = await lapOf(200);
  console.log('piece 0 the same object/content:', JSON.stringify(base.pieces[0]) === JSON.stringify(other.pieces[0]), 'pieces', base.pieces.length, other.pieces.length);
  const d = CJ.displacementOf(base, other).map((x) => `${x.piece}:${x.maxM.toFixed(2)}`).join(' ');
  console.log('moves by piece:', d);
  const win = base.pieces.map((_, i) => i).filter((i) => i > 0);
  console.log('barMiss, window = pieces 1 on, open = the lap before:', CJ.barMiss({ ...base, closed: false }, other, { base, edited: win }));
})().catch((e) => { console.error(e); process.exit(1); });

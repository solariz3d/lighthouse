// probe-base1.js (D467, C's §8 part 1, pane E): on 4f59790 part 1 compares the result's reds with the OPEN lap's; a result that keeps crossings the open lap already had
// passes, though the lap before the drag had none. The laps are whole laps the shell built; every piece in `edited`, so part 3 measures nothing.
'use strict';
const W = 'C:/Users/nname/Downloads/t180-wt-e467/';
const { createCoreShell } = require(W + 'app/core/coreshell.js');
const CJ = require(W + 'app/core/closejob.js');
const R = 180, Q = (Math.PI * R) / 2;
const lapOf = async (make) => { const s = await createCoreShell({ autosaveMs: 0 }); make(s); s.close(); return s.getState().history.present; };
(async () => {
  const base = await lapOf((s) => { s.extend({ length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 60, transition: 40, targets: { kh: 0 } }); });
  const crossing = await lapOf((s) => { s.extend({ length: 700, family: 'bowl' }); s.extend({ length: Math.PI * 30, transition: 20, targets: { kh: 1 / 30 } }); s.extend({ length: 700, transition: 20, targets: { kh: 0 } }); s.extend({ length: Math.PI * 30, transition: 20, targets: { kh: 1 / 30 } }); s.extend({ length: 60, transition: 20, targets: { kh: 0 } }); });
  const all = base.pieces.map((_, i) => i);
  console.log('open = the crossing lap opened, closed = the crossing lap:', CJ.barMiss({ ...crossing, closed: false }, crossing, { base, edited: all }));
})().catch((e) => { console.error(e); process.exit(1); });

// probe-parts.js (D467 re-ruled, pane E): barMiss's parts 2 and 1 alone, with every piece in `edited` so part 3 measures nothing; the "closed" laps are whole laps the shell built
'use strict';
const W = 'C:/Users/nname/Downloads/t180-wt-e467/';
const { createCoreShell } = require(W + 'app/core/coreshell.js');
const CJ = require(W + 'app/core/closejob.js');
const R = 180, Q = (Math.PI * R) / 2;
const lapOf = async (make) => { const s = await createCoreShell({ autosaveMs: 0 }); make(s); s.close(); return s.getState().history.present; };
(async () => {
  const base = await lapOf((s) => { s.extend({ length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 60, transition: 40, targets: { kh: 0 } }); });
  const curved = await lapOf((s) => { s.extend({ length: 300, family: 'bowl', targets: { kh: 1 / 600 } }); for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 200, transition: 40, targets: { kh: 1 / 600 } }); });
  const crossing = await lapOf((s) => { s.extend({ length: 700, family: 'bowl' }); s.extend({ length: Math.PI * 30, transition: 20, targets: { kh: 1 / 30 } }); s.extend({ length: 700, transition: 20, targets: { kh: 0 } }); s.extend({ length: Math.PI * 30, transition: 20, targets: { kh: 1 / 30 } }); s.extend({ length: 60, transition: 20, targets: { kh: 0 } }); });
  const open = { ...base, closed: false }, all = (d) => d.pieces.map((_, i) => i);
  console.log('closed flags', base.closed, curved.closed, crossing.closed, 'pieces', base.pieces.length, curved.pieces.length, crossing.pieces.length);
  console.log('control, closed = base:', CJ.barMiss(open, base, { base, edited: all(base) }));
  console.log('part 2, a lap with no straight:', CJ.barMiss(open, curved, { base, edited: all(base) }));
  console.log('part 1, a lap that crosses itself, its start straight kept:', CJ.barMiss(open, crossing, { base, edited: all(base) }));
})().catch((e) => { console.error(e); process.exit(1); });

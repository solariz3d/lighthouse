// climb.js (C, D467 review): a Climb on the sculpt-tools lap, by tree T: the message, the drag's own peak Δkv and the close's peak Δkv on p1 and p6 (°/m), and the export's answer.
'use strict';
const path = require('path'), T = process.argv[2], r = (f) => require(path.join(T, f)), dl = +process.argv[3];
const D = r('src/core/document.js'), FW = r('src/export/fromwords.js'), { createCoreShell } = r('app/core/coreshell.js'), DEG = 180 / Math.PI;
const peak = (A, B) => { let m = 0; for (let s = 0; s <= A.length; s += 0.5) { const d = D.channelAt(B, 'kv', s).v - D.channelAt(A, 'kv', s).v; if (Math.abs(d) > Math.abs(m)) m = d; } return (m * DEG).toFixed(5); };
(async () => {
  const s = await createCoreShell({ autosaveMs: 0 }), R = 180, Q = (Math.PI * R) / 2;
  s.extend({ length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 60, transition: 40, targets: { kh: 0 } }); s.close();
  const base = s.getState().history.present;
  s.beginBrush({ tool: 'climb', s0: 450, r: 80 }); s.brushTo(dl);
  const open = s.getState().history.present; s.endBrush(); const st = await s.brushRelease(), c = st.history.present;
  console.log(`${path.basename(T)} climb ${dl}: ${st.message}\n  drag peak Δkv p2 ${peak(base.pieces[1], open.pieces[1])} °/m | close peak Δkv p1 ${peak(open.pieces[0], c.pieces[0])} p6 ${peak(open.pieces[5], c.pieces[5])} p2 ${peak(open.pieces[1], c.pieces[1])}`);
  const e = await createCoreShell({ autosaveMs: 0 }); e.adopt(c);
  try { const ex = FW.buildFromSegments(...e.exportArgs({})); console.log('  export: ok,', ex.warnings.filter((w) => /^amber|^RED/.test(w)).length, 'ambers'); } catch (x) { console.log('  export: REFUSED', x.code, String(x.message).slice(0, 160)); }
})();

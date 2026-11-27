// slopeprobe.js (pane B, L258 F3, a side finding): after Sculpt's width brush at the head (19.1, +1.37, s0 = end - 5, r 20, rate mode, as O's o_f1.js), three Extends of
// 100 m with NO target (every field left as shown): does the width hold? Prints each piece's width at its start and end, and the head's width slope. No right width
// is used, so it runs on the base (before the right width) as on the branch. Synthetic road only. usage: node slopeprobe.js <tree>
'use strict';
const os = require('os'), path = require('path');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js')), { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
(async () => {
  const d = extend(extend(D.createDoc('slope'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * Math.PI / 180 } });
  const s = await createCoreShell({ brushFn: null, autosaveMs: 0 }); s.commitDoc(d);
  const L = s.getState().history.present.pieces.reduce((a, P) => a + P.length, 0); s.beginBrush({ mode: 'rate', channel: 'w', s0: L - 5, r: 20 }); s.brushTo(1.37); s.endBrush();
  const end = () => D.endState(s.getState().history.present).w, n0 = s.getState().history.present.pieces.length;
  console.log(`after the brush: head w ${+end().v.toFixed(4)}, slope ${+end().m.toFixed(6)} per m`);
  for (let i = 0; i < 3; i++) s.extend({ length: 100 });
  const ps = s.getState().history.present.pieces.slice(n0);
  console.log(`three Extends, nothing typed: ${ps.map((P) => `w ${+P.channels.w[0].toFixed(4)} -> ${+D.pieceEnd(P).w.v.toFixed(4)} (end slope ${+D.pieceEnd(P).w.m.toFixed(6)})`).join(' | ')}; message: ${s.getState().message}`);
})().catch((e) => { console.error('probe failed:', e); process.exit(1); });
// (renamed after its run, for the name check: its earlier file and scratch document names matched a layout name in his install; nothing else changed, and a name does not reach the geometry)

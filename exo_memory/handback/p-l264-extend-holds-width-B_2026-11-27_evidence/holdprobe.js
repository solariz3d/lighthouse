// holdprobe.js (pane B, L264): B's F3 case (19.1 brushed +1.37 at the head, s0 = end - 5, r 20, rate brush) then three Extends of 100 m with the width left as shown,
// through the shell and the panel's own extendOptions. Per new piece: the width at its start and end, its end slope, the least (or most) width inside it and where,
// and the joint: value and slope of the piece before at its end against the new piece at its start. Also: Extends of 10 m and 400 m, a typed width, the width
// field typed as it shows. Synthetic road only. usage: node holdprobe.js <tree>
'use strict';
const os = require('os'), path = require('path');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const r6 = (x) => +Number(x).toFixed(6);
async function brushedShell() {
  const s = await createCoreShell({ brushFn: null, autosaveMs: 0 });
  s.commitDoc(extend(extend(D.createDoc('hold'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * Math.PI / 180 } }));
  const L = s.getState().history.present.pieces.reduce((a, P) => a + P.length, 0); s.beginBrush({ mode: 'rate', channel: 'w', s0: L - 5, r: 20 }); s.brushTo(1.37); s.endBrush();
  return s;
}
function describe(prev, P) {
  const a = D.pieceEnd(prev).w, b0 = D.channelValue(P, 'w', 0), h = 0.01, b1 = (D.channelValue(P, 'w', h) - b0) / h;
  let lo = { s: 0, v: b0 }, hi = { s: 0, v: b0 };
  for (let s = 0; s <= P.length + 1e-9; s += P.length / 400) { const v = D.channelValue(P, 'w', s); if (v < lo.v) lo = { s, v }; if (v > hi.v) hi = { s, v }; }
  const e = D.pieceEnd(P).w;
  return `${P.length} m: joint value ${r6(a.v)} -> ${r6(b0)}, slope ${r6(a.m)} -> ${r6(b1)} (numeric); end ${r6(e.v)} slope ${r6(e.m)}; least ${r6(lo.v)} at ${r6(lo.s)} m, most ${r6(hi.v)} at ${r6(hi.s)} m`;
}
(async () => {
  const s = await brushedShell(), hs = D.endState(s.getState().history.present).w;
  console.log(`after the brush: head ${r6(hs.v)} slope ${r6(hs.m)}/m; the field shows ${Math.round(hs.v * 100) / 100}`);
  for (let i = 0; i < 3; i++) { const before = s.getState().history.present.pieces.slice(-1)[0]; s.extend(extendOptions({ ...BLANK, length: 100, head: s.headState() })); const P = s.getState().history.present.pieces.slice(-1)[0]; console.log(`Extend ${i + 1}, left as shown: ${describe(before, P)}`); }
  { const t = await brushedShell(); const out = []; for (let i = 0; i < 5; i++) { const before = t.getState().history.present.pieces.slice(-1)[0]; t.extend(extendOptions({ ...BLANK, length: 10, head: t.headState() })); const e = D.pieceEnd(t.getState().history.present.pieces.slice(-1)[0]).w; out.push(`${r6(e.v)} (${r6(e.m)})`); } console.log(`five Extends of 10 m: ends ${out.join(", ")}`); }
  for (const len of [10, 400]) { const t = await brushedShell(), before = t.getState().history.present.pieces.slice(-1)[0]; t.extend(extendOptions({ ...BLANK, length: len, head: t.headState() })); const P = t.getState().history.present.pieces.slice(-1)[0]; console.log(`one Extend of ${len} m: ${P === before ? `refused: ${t.getState().message}` : describe(before, P)}`); }
  { const t = await brushedShell(), before = t.getState().history.present.pieces.slice(-1)[0]; t.extend(extendOptions({ ...BLANK, length: 100, width: '22', head: t.headState() })); console.log(`width typed 22: ${describe(before, t.getState().history.present.pieces.slice(-1)[0])}`); }
  { const t = await brushedShell(), before = t.getState().history.present.pieces.slice(-1)[0]; t.extend(extendOptions({ ...BLANK, length: 100, width: '20.46', head: t.headState() })); console.log(`width typed 20.46 (as it shows): ${describe(before, t.getState().history.present.pieces.slice(-1)[0])}`); }
})().catch((e) => { console.error('probe failed:', e); process.exit(1); });

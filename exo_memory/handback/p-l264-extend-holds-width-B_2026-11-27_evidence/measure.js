// measure.js (pane B, L264 item 3): for the width (the control) and the bank, cup, left and right edge and right width: can a brush at the head leave a slope there,
// and what do three Extends of 100 m with NOTHING typed then do? The rate brush (B's F3 case: s0 = end - 5, r 20) through the shell, in and out of Sculpt; Sculpt's grab
// (the follow, a set of value channels) at the head for the width, bank and cup. Prints the head's value and slope after the edit and each new piece's end value and
// slope. Also Sculpt's brush on the whole last piece (s0 its middle, r half its length, piece: its index). Synthetic roads only. usage: node measure.js <tree>
'use strict';
const os = require('os'), path = require('path');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js')), { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const r6 = (x) => +Number(x).toFixed(6);
const ROADS = {
  plain: () => extend(extend(D.createDoc('m'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * Math.PI / 180 } }),
  cup: () => extend(extend(D.createDoc('m'), { length: 120, first: { w: 19.1, c: 20 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400 } }),
  edge: () => extend(extend(D.createDoc('m'), { length: 120, first: { w: 19.1, e: 10 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400 } }),
  split: () => extend(extend(extend(D.createDoc('m'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400 } }), { length: 100, targets: { wd: 3.5 } }),
};
const CASES = [
  ['w', 'plain', 1.37], ['phi', 'plain', 0.1], ['c', 'cup', 10], ['e', 'edge', 10], ['er', 'edge', 10], ['wd', 'split', 1],
];
async function run(ch, road, delta, { sculpt = false, piece = false } = {}) {
  const s = await createCoreShell({ brushFn: null, autosaveMs: 0 }); s.commitDoc(ROADS[road]());
  if (sculpt && typeof s.setSculpt === 'function') s.setSculpt(true);
  const L = s.getState().history.present.pieces.reduce((a, P) => a + P.length, 0), n0 = s.getState().history.present.pieces.length;
  const lastP = s.getState().history.present.pieces[n0 - 1];
  if (piece) s.beginBrush({ mode: 'rate', channel: ch, s0: L - lastP.length / 2, r: lastP.length / 2, piece: n0 - 1 }); else s.beginBrush({ mode: 'rate', channel: ch, s0: L - 5, r: 20 }); const m0 = s.getState().message; s.brushTo(delta); s.endBrush();
  const brushed = s.getState().history.present.pieces.length === n0 && s.getState().history.past.length > 0;
  const head = D.endState(s.getState().history.present)[ch];
  const out = [`${ch} on a ${road} road${sculpt ? ' (Sculpt on)' : ''}${piece ? ', the whole last piece (the Sculpt piece brush)' : ''}, brushed ${delta} at the head${m0 ? ` [${m0.slice(0, 90)}]` : ''}: head ${head ? `${r6(head.v)} slope ${r6(head.m)}/m` : 'none'}`];
  for (let i = 0; i < 3; i++) { s.extend({ length: 100 }); const P = s.getState().history.present.pieces.slice(-1)[0], e = D.pieceEnd(P)[ch]; out.push(`Extend ${i + 1}: ${e ? `${r6(e.v)} slope ${r6(e.m)}` : 'none'}`); }
  console.log(out.join(' | ') + (brushed ? '' : ' (the brush did not change the track)'));
}
(async () => {
  for (const [ch, road, delta] of CASES) await run(ch, road, delta);
  for (const [ch, road, delta] of CASES.filter(([c]) => ['w', 'phi', 'c', 'e', 'er'].includes(c))) await run(ch, road, delta, { sculpt: true });
  for (const [ch, road, delta] of CASES.filter(([c]) => ['w', 'phi', 'c', 'e', 'er'].includes(c))) await run(ch, road, delta, { sculpt: true, piece: true });
})().catch((e) => { console.error('probe failed:', e); process.exit(1); });

// side264.js (pane E, L264 read), one tree: (A) the panel's own typed width ramps: does the piece end LEVEL (pieceEnd w.m === 0) and at the typed width? lengths 5..300 m,
// whole piece and early; (B) B's §3 table with the APP's brush (createCoreShell's default brushFn), each channel brushed at the head (end-5, r 20), three Extends as shown:
// the head and the three ends. usage: node side264.js <tree>
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const doc = (s) => s.getState().history.present;
const ROADS = {
  plain: () => extend(extend(D.createDoc('hold'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * Math.PI / 180 } }),
  cup: () => extend(extend(D.createDoc('hold'), { length: 120, first: { w: 19.1, c: 20 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400 } }),
  edge: () => extend(extend(D.createDoc('hold'), { length: 120, first: { w: 19.1, e: 10 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400 } }),
  split: () => extend(extend(extend(D.createDoc('hold'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400 } }), { length: 100, targets: { wd: 3.5 } }),
};
(async () => {
  const notLevel = [];
  for (const L of [5, 8, 10, 12, 15, 19, 20, 21, 25, 30, 40, 60, 75, 100, 300]) for (const early of [false, true]) for (const w of ['25', '15', '19.13']) {
    const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(ROADS.plain());
    s.extend(extendOptions({ ...BLANK, length: L, width: w, ...(early ? { atStart: { width: true } } : {}), head: s.headState() }));
    const e = D.pieceEnd(doc(s).pieces.at(-1)).w; if (e.m !== 0 || Math.abs(e.v - Number(w)) > 1e-9) notLevel.push(`${L} m ${early ? 'early' : 'whole'} w ${w}: ends ${e.v} at ${e.m.toExponential(2)}/m`);
  }
  console.log(`A. panel typed width, 15 lengths x whole/early x 3 widths = 90: ${notLevel.length} end off level or off the typed width${notLevel.length ? ':\n  ' + notLevel.join('\n  ') : ''}`);
  for (const [ch, delta, road] of [['phi', 0.1, 'plain'], ['c', 10, 'cup'], ['e', 10, 'edge'], ['er', 10, 'edge'], ['wd', 1, 'split'], ['w', 1.37, 'plain']]) {
    const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(ROADS[road]()); const L = doc(s).pieces.reduce((a, P) => a + P.length, 0);
    s.beginBrush({ mode: 'rate', channel: ch, s0: L - 5, r: 20 }); s.brushTo(delta); s.endBrush(); const msg = s.getState().message, head = D.endState(doc(s))[ch], ends = [];
    for (let i = 0; i < 3; i++) { s.extend(extendOptions({ ...BLANK, head: s.headState() })); const e = D.pieceEnd(doc(s).pieces.at(-1))[ch]; ends.push(`${e.v.toFixed(6)} (${e.m.toExponential(3)})`); }
    console.log(`B. ${ch} on ${road}, the app's brush ${delta}: ${/refus|not|NOT/.test(msg || '') ? `msg ${msg} | ` : ''}head ${head.v.toFixed(6)} (${head.m.toExponential(3)}); three Extends end ${ends.join(', ')}`);
  }
})().catch((e) => { console.error('side264 failed:', e); process.exit(1); });

// f3probe.js (pane B, L258 F3): the CHANGELOG's way back on a road WITH a step, through the shell and the panel's extendOptions, on both of O's heads (a width typed
// 19.1346, and 19.1 brushed +1.37) and on a two-decimal one (19.1): a step (the right width typed 3.5 m over the width as shown), the right width set back to the
// width as shown, a piece after; which pieces write wd and the schema; then the two stepped pieces deleted (a middle delete, previewed and applied), that undone,
// and the three Extends undone. Synthetic roads only. usage: node f3probe.js <tree>
'use strict';
const os = require('os'), path = require('path');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const shown2 = (x) => Math.round(x * 100) / 100;
function memStorage(seed) {
  const st = { docs: new Map(Object.entries(seed)), pieces: new Map() };
  return Object.assign(st, { saveDoc: async (n, t) => { st.docs.set(n, t); }, openDoc: async (n) => st.docs.get(n), listDocs: async () => [...st.docs.keys()], saveUndo: async () => {}, openUndo: async () => null,
    savePiece: async (n, t) => { st.pieces.set(n, t); }, openPiece: async (n) => st.pieces.get(n), listPieces: async () => [...st.pieces.keys()], saveRecipe: async () => {}, openRecipe: async () => null,
    saveAutosave: async () => {}, openAutosave: async () => null, clearAutosave: async () => {}, backupDoc: async () => 'b' });
}
const roadAt = (w) => extend(extend(D.createDoc('f3'), { length: 120, first: { w }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * Math.PI / 180 } });
(async () => {
  for (const kind of ['two-decimal', 'typed', 'brushed']) {
    const storage = memStorage({ 'eq-f3': D.serialize(roadAt(kind === 'typed' ? 19.1346 : 19.1)) }), s = await createCoreShell({ brushFn: null, storage, autosaveMs: 0 }); await s.open('f3');
    if (kind === 'brushed') { const L = s.getState().history.present.pieces.reduce((a, P) => a + P.length, 0); s.beginBrush({ mode: 'rate', channel: 'w', s0: L - 5, r: 20 }); s.brushTo(1.37); s.endBrush(); }
    const doc = () => s.getState().history.present, schema = () => JSON.parse(D.serialize(doc())).schema, n = () => doc().pieces.length;
    const before = schema(), n0 = n(), shown = shown2(s.headState().w);
    s.extend(extendOptions({ ...BLANK, length: 100, widthR: String(shown2(shown + 3.5)), head: s.headState() }));
    const shownAtBack = shown2(s.headState().w); s.extend(extendOptions({ ...BLANK, length: 100, widthR: String(shownAtBack), head: s.headState() }));   // as his field shows the width NOW
    s.extend(extendOptions({ ...BLANK, length: 100, head: s.headState() }));
    const ends = doc().pieces.slice(n0).map((P) => { const a = D.pieceEnd(P); return `w ${+P.channels.w[0].toFixed(4)}->${+a.w.v.toFixed(4)} wd ${+(P.channels.wd ? P.channels.wd[0] : 0).toFixed(4)}->${+a.wd.v.toFixed(4)}`; }).join(' | ');
    const o = JSON.parse(D.serialize(doc())), writes = o.pieces.slice(n0).map((P) => (P.channels.wd !== undefined ? 'wd' : '-')).join(' ');
    console.log(`${kind}: shown at the step ${shown}, at the set-back ${shownAtBack}; schema ${before}; after step, set back, one more: pieces ${n0}->${n()}, writes [${writes}], schema ${o.schema}, head wd ${JSON.stringify(D.endState(doc()).wd)}
  pieces: ${ends}`);
    s.selectPiece(n0); s.selectPiece(n0 + 1, { extend: true }); s.deleteSelection(); const m1 = s.getState().message; await s.applyDelete();
    console.log(`  delete the two stepped pieces (middle): preview "${String(m1).slice(0, 90)}"; applied "${String(s.getState().message).slice(0, 80)}"; pieces ${n()}, schema ${schema()}`);
    s.undo(); console.log(`  undo the delete: pieces ${n()}, schema ${schema()}`);
    s.undo(); s.undo(); s.undo(); console.log(`  undo the three Extends: pieces ${n()}, schema ${schema()} (was ${before})`);
  }
})().catch((e) => { console.error('probe failed:', e); process.exit(1); });
// (corrected: the first version typed the set-back as the width showed BEFORE the step; on the brushed head the width moves along the step piece (20.463 to about 20.36),
// so that typed a stale number and sent wd 0.0975. It now types the width as his field shows it at the head when the right width is set back.)

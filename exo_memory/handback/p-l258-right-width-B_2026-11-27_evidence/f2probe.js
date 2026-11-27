// f2probe.js (pane B, L258 F2): both heads of O's F2 (a width typed 19.1346; 19.1 brushed +1.37 at the head), split and unsplit, through the shell and the panel's own
// extendOptions: what the words say, the wd sent for the words' number, where the right width ends, the second add, and the file's schema. Each case on its own, so
// one case's result does not hide another's (the row stops at its first). Synthetic roads only. usage: node f2probe.js <tree>
'use strict';
const os = require('os'), path = require('path');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js')), PC = require(path.join(T, 'src/core/piece.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const shown2 = (x) => Math.round(x * 100) / 100;
function memStorage(seed) {
  const st = { docs: new Map(Object.entries(seed)), pieces: new Map() };
  return Object.assign(st, { saveDoc: async (n, t) => { st.docs.set(n, t); }, openDoc: async (n) => st.docs.get(n), listDocs: async () => [...st.docs.keys()], saveUndo: async () => {}, openUndo: async () => null,
    savePiece: async (n, t) => { st.pieces.set(n, t); }, openPiece: async (n) => st.pieces.get(n), listPieces: async () => [...st.pieces.keys()], saveRecipe: async () => {}, openRecipe: async () => null,
    saveAutosave: async () => {}, openAutosave: async () => null, clearAutosave: async () => {} });
}
const roadAt = (w) => extend(extend(D.createDoc('f2'), { length: 120, first: { w }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * Math.PI / 180 } });
async function headOn(kind, split) {
  let d = roadAt(kind === 'typed' ? 19.1346 : 19.1);
  if (split) d = extend(d, { length: 100, transition: { wd: 5 }, targets: { wd: 3.5 } });
  const storage = memStorage({ 'eq-f2': D.serialize(d) }), s = await createCoreShell({ brushFn: null, storage, autosaveMs: 0 }); await s.open('f2');
  if (kind === 'brushed') { const L = s.getState().history.present.pieces.reduce((a, P) => a + P.length, 0); s.beginBrush({ mode: 'rate', channel: 'w', s0: L - 5, r: 20 }); s.brushTo(1.37); s.endBrush(); }
  await storage.savePiece('plain', PC.serialize(PC.saveRun(extend(D.createDoc('p'), { length: 60, first: { w: 19.1 }, targets: { kh: 1 / 300 } }), 0, 0, { name: 'plain' })));
  return s;
}
const n = (s) => s.getState().history.present.pieces.length, schema = (s) => JSON.parse(D.serialize(s.getState().history.present)).schema, r6 = (x) => +x.toFixed(6);
(async () => {
  for (const kind of ['typed', 'brushed']) {
    { const s = await headOn(kind, true), hs = s.headState(), n0 = n(s); await s.insertPiece('plain'); const laid0 = n(s) - n0, said = s.getState().message, m = /set to the width \(([\d.]+)\)/.exec(said || '');
      const o = extendOptions({ ...BLANK, length: 100, widthR: m ? m[1] : '', head: s.headState() }); s.extend(o); const P = s.getState().history.present.pieces.slice(-1)[0], end = D.pieceEnd(P).wd;
      const n1 = n(s); await s.insertPiece('plain');
      console.log(`${kind}, split head: head w ${r6(hs.w)} wd ${r6(hs.wd)}; field shows width ${shown2(hs.w)}; first add laid ${laid0} (refused when 0); words give ${m ? m[1] : 'NONE'}; wd sent ${o.targets.wd}; ends wd ${r6(end.v)} slope ${r6(end.m)}; second add laid ${n(s) - n1}: ${s.getState().message}; schema ${schema(s)}`); }
    { const s = await headOn(kind, false), hs = s.headState(), before = schema(s), typed = String(shown2(hs.w));
      const o = extendOptions({ ...BLANK, length: 100, widthR: typed, head: s.headState() }); s.extend(o); const doc = JSON.parse(D.serialize(s.getState().history.present));
      console.log(`${kind}, unsplit head (the CHANGELOG's way back): head w ${r6(hs.w)}; right width typed ${typed}; wd sent ${o.targets.wd}; new piece writes wd ${doc.pieces[doc.pieces.length - 1].channels.wd !== undefined}; schema ${before} -> ${doc.schema}`); }
  }
})().catch((e) => { console.error('probe failed:', e); process.exit(1); });
// (corrected: the first version printed "first add laid" from an expression read after the second add; it is now counted right after the first add)

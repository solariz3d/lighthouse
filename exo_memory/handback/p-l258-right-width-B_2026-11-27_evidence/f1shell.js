// f1shell.js (pane B, L258 F1): the words he reads, THROUGH THE SHELL: a click on a saved piece (showPiece, the ghost) and Add (insertPiece) at a head whose right side
// has its own width, then the same after the right width is set back to the width with the panel's own path (Extend, right width m typed as the width). In-memory storage,
// synthetic roads only (the shape of O's o_vary2.js). usage: node f1shell.js <tree>
'use strict';
const os = require('os'), path = require('path');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), EXT = require(path.join(T, 'src/core/extend.js')), PC = require(path.join(T, 'src/core/piece.js')), SH = require(path.join(T, 'app/core/coreshell.js'));
const W = 19.1, STEP = 3.5;
function memStorage(seed = {}) {
  const st = { docs: new Map(Object.entries(seed)), undo: new Map(), pieces: new Map() };
  return Object.assign(st, { saveDoc: async (n, t) => { st.docs.set(n, t); }, openDoc: async (n) => st.docs.get(n), listDocs: async () => [...st.docs.keys()], saveUndo: async (n, t) => { st.undo.set(n, t); }, openUndo: async (n) => st.undo.get(n) || null,
    savePiece: async (n, t) => { st.pieces.set(n, t); }, openPiece: async (n) => st.pieces.get(n), listPieces: async () => [...st.pieces.keys()], saveRecipe: async () => {}, openRecipe: async () => null,
    saveAutosave: async () => {}, openAutosave: async () => null, clearAutosave: async () => {}, backupDoc: async () => 'b' });
}
(async () => {
  let head = EXT.extend(D.createDoc('f1'), { length: 120, first: { w: W }, targets: { kh: 0 } });
  head = EXT.extend(head, { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * Math.PI / 180 } });
  head = EXT.extend(head, { length: 100, transition: { wd: 5 }, targets: { wd: STEP } });
  const plain = PC.saveRun(EXT.extend(D.createDoc('p'), { length: 60, first: { w: W }, targets: { kh: 1 / 300 } }), 0, 0, { name: 'plain' });
  const storage = memStorage({ 'eq-f1': D.serialize(head) }); await storage.savePiece('plain', PC.serialize(plain));
  const s = await SH.createCoreShell({ storage, autosaveMs: 0 }); await s.open('f1');
  const n = () => s.getState().history.present.pieces.length, n0 = n();
  await s.showPiece('plain'); console.log(`click (showPiece): ghost ${s.getState().pieceGhost ? 'shown' : 'none'}; message: ${s.getState().message}`);
  await s.insertPiece('plain'); console.log(`Add (insertPiece): pieces ${n0} -> ${n()}; message: ${s.getState().message}`);
  s.extend({ length: 100, transition: { wd: 5 }, targets: { wd: 0 } }); console.log(`Extend, right width back at the width: pieces ${n()}; head wd ${JSON.stringify(D.endState(s.getState().history.present).wd)}; message: ${s.getState().message}`);
  const n1 = n(); await s.showPiece('plain'); console.log(`click again: ghost ${s.getState().pieceGhost ? 'shown' : 'none'}; message: ${s.getState().message}`);
  await s.insertPiece('plain'); console.log(`Add again: pieces ${n1} -> ${n()}; message: ${s.getState().message}`);
})().catch((e) => { console.error('probe failed:', e); process.exit(1); });

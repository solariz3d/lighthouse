// o_f3.js (pane O, L258 F3 short read, de6c069..c66b503; scratch): the CHANGELOG's new way back, varied where B's row does not go: a CLOSED lap with a step in it.
// "To go back, Undo or delete every piece whose right side has its own width; the file is then core/4, /5 or /6 again." On a closed lap: does Delete of the
// stepped pieces work through the shell, and what is the file then; does Undo (of the step and the close) bring the old schema back. Synthetic roads only.
//   usage: node o_f3.js <tree at c66b503>
'use strict';
const path = require('path'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js')), CL = require(path.join(T, 'src/core/close.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const schemaOf = (d) => JSON.parse(D.serialize(d)).schema;
const store = (seed) => { const st = { docs: new Map(Object.entries(seed)) }; return Object.assign(st, { saveDoc: async (n, t) => { st.docs.set(n, t); }, openDoc: async (n) => st.docs.get(n), listDocs: async () => [...st.docs.keys()], saveUndo: async () => {}, openUndo: async () => null, saveAutosave: async () => {}, openAutosave: async () => null, clearAutosave: async () => {}, backupDoc: async () => 'backup' }); };
(async () => {
  const out = [];
  // four 90-degree corners of R 150 with 100 m straights, 14 m wide; the second straight steps its right side +3 m and the third sets it back; then Close
  let d = D.createDoc('lap');
  for (let k = 0; k < 4; k++) {
    d = extend(d, { length: 100, ...(k === 0 ? { first: { w: 14 } } : {}), targets: { kh: 0, ...(k === 1 ? { wd: 3 } : k === 2 ? { wd: 0 } : {}) }, ...(k === 1 || k === 2 ? { transition: { wd: 20 } } : {}) });
    d = extend(d, { length: Math.PI / 2 * 150, targets: { kh: 1 / 150 } });
  }
  const r = CL.close(d, { edited: [d.pieces.length - 1] }), lap = r.doc;
  const stepped = lap.pieces.map((P, i) => (P.type === 'road' && D.isWidthSplit(P) ? i : null)).filter((x) => x !== null);
  out.push({ case: 'the closed lap', converged: r.converged, closed: lap.closed, schema: schemaOf(lap), steppedPieces: stepped });
  // through the shell: select the stepped pieces and Delete
  const s = await createCoreShell({ storage: store({ 'eq-lap': D.serialize(lap) }), autosaveMs: 0 }); await s.open('lap');
  s.selectPiece(stepped[0]); if (stepped.length > 1) s.selectPiece(stepped[stepped.length - 1], { extend: true });
  const delWords = (() => { try { s.deleteSelection(); return s.getState().message || null; } catch (e) { return 'threw ' + e.message; } })();
  let applied = null; try { await s.applyDelete(); applied = s.getState().message || null; } catch (e) { applied = 'threw ' + e.message; }
  const after = s.getState().history.present;
  out.push({ case: 'Delete of the stepped pieces on the closed lap, through the shell', deleteWords: delWords, applyWords: applied, pieces: [lap.pieces.length, after.pieces.length], closedAfter: !!after.closed, schemaAfter: schemaOf(after),
    anyWdLeft: after.pieces.some((P) => P.type === 'road' && D.isWidthSplit(P)) });
  console.log(JSON.stringify(out, null, 1));
})();

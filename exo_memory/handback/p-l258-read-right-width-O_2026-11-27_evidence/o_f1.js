// o_f1.js (pane O, L258 F1 delta read, e4e7ecc..8b7cafc; scratch): are SPLIT_HEAD's words TRUE when followed as written? Through the core shell and the panel's
// own extendOptions (the conversion app/core/panel.js makes for "right width m"): a split head, a saved plain piece added (refused), then the words' own advice
// typed into right width m (the number the words give, as he would type it), then the piece added again. On B's head (width 19.1) and on heads whose width
// is not a two-decimal number (typed 19.1346, and one left by Sculpt's width brush). Also: two faults at once, the mirror, and a run that starts with a jump.
// Our own synthetic roads only. usage: node o_f1.js <tree at 8b7cafc>
'use strict';
const path = require('path'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), EXT = require(path.join(T, 'src/core/extend.js')), PC = require(path.join(T, 'src/core/piece.js'));
const SH = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const msg = (e) => (e && (e.code ? `${e.code}: ` : '') + String(e.message || e)).slice(0, 300);
const out = [];
function store(seed) { const st = { docs: new Map(Object.entries(seed)), pieces: new Map() };
  return Object.assign(st, { saveDoc: async (n, t) => { st.docs.set(n, t); }, openDoc: async (n) => st.docs.get(n), listDocs: async () => [...st.docs.keys()], saveUndo: async () => {}, openUndo: async () => null,
    savePiece: async (n, t) => { st.pieces.set(n, t); }, openPiece: async (n) => st.pieces.get(n), listPieces: async () => [...st.pieces.keys()], saveRecipe: async () => {}, openRecipe: async () => null, saveAutosave: async () => {}, openAutosave: async () => null, clearAutosave: async () => {} }); }
const plainPiece = (w) => PC.serialize(PC.saveRun(EXT.extend(D.createDoc('p'), { length: 60, first: { w }, targets: { kh: 1 / 300 } }), 0, 0, { name: 'plain' }));
async function follow(label, makeHead, { brush = false } = {}) {
  const head = makeHead(), storage = store({ 'eq-f1': D.serialize(head) }), s = await SH.createCoreShell({ storage, autosaveMs: 0 }); await s.open('f1');
  await storage.savePiece('plain', plainPiece(19.1));
  if (brush) { const d0 = s.getState().history.present, L = d0.pieces.reduce((a, P) => a + P.length, 0); s.beginBrush({ mode: 'rate', channel: 'w', s0: L - 5, r: 20 }); s.brushTo(1.37); s.endBrush(); }
  const h0 = s.getState().history.present, hs = s.headState();
  const n0 = h0.pieces.length; await s.insertPiece('plain'); const first = s.getState().message, laid0 = s.getState().history.present.pieces.length - n0;
  const m = /set to the width \(([-\d.]+)\)/.exec(first || ''); const typed = m ? m[1] : null;
  const row = { case: label, headW: +hs.w.toFixed(6), headWd: +hs.wd.toFixed(6), panelShowsWidth: String(Math.round(hs.w * 100) / 100), panelShowsRightWidth: String(Math.round((hs.w + hs.wd) * 100) / 100), firstAdd: first, laidFirst: laid0, wordsSay: typed };
  if (typed !== null) {
    // the words' advice, as he would type it: right width m = the number the words give, the width field left as shown (blank), one Extend of 100 m
    const o = extendOptions({ length: 100, widthR: typed, head: s.headState(), turnAs: 'rate' }); s.extend(o);
    const P = s.getState().history.present.pieces.slice(-1)[0];
    row.extendSent = { wd: o.targets.wd }; row.afterExtend = { split: !!P.split, endWd: P.split ? +D.pieceEnd(P).wd.v.toFixed(6) : 0, schema: JSON.parse(D.serialize(s.getState().history.present)).schema, message: s.getState().message || null };
    const n1 = s.getState().history.present.pieces.length; await s.insertPiece('plain');
    row.secondAdd = s.getState().message; row.laidSecond = s.getState().history.present.pieces.length - n1;
  }
  out.push(row);
}
(async () => {
  const roadW = (w) => EXT.extend(EXT.extend(D.createDoc('h'), { length: 120, first: { w }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * Math.PI / 180 } });
  const splitOn = (d, wd = 3.5) => EXT.extend(d, { length: 100, transition: { wd: 5 }, targets: { wd } });
  await follow("B's head: width 19.1, right width 22.6", () => splitOn(roadW(19.1)));
  await follow('a head of width 19.1346 (typed with four decimals), right width +3.5', () => splitOn(roadW(19.1346)));
  await follow('width 19.1, right +3.5, then Sculpt\'s width brush (+1.37) at the head', () => splitOn(roadW(19.1)), { brush: true });
  await follow('a right side narrower than the width (wd -3.5)', () => splitOn(roadW(19.1), -3.5));
  // two faults: an edged split head (B's row) and a cup split head with a plain legacy piece (PIECE_KIND first)
  await (async () => { const edged = splitOn(EXT.extend(EXT.extend(D.createDoc('e'), { length: 120, first: { w: 19.1, e: 10 }, targets: { kh: 0 } }), { length: 100 }));
    const r = {}; try { PC.insert(edged, PC.saveRun(roadW(19.1), 1, 1, { name: 'p' })); r.edged = 'laid'; } catch (e) { r.edged = msg(e); }
    const cupped = splitOn(EXT.extend(D.createDoc('c'), { length: 120, first: { w: 19.1 }, targets: { c: 20 } }));
    try { PC.insert(cupped, PC.saveRun(roadW(19.1), 1, 1, { name: 'p' })); r.cuppedLegacyPiece = 'laid'; } catch (e) { r.cuppedLegacyPiece = msg(e); }
    const cupPiece = PC.saveRun(EXT.extend(D.createDoc('cp'), { length: 80, first: { w: 19.1 }, targets: { c: 20 } }), 0, 0, { name: 'cp' });
    try { PC.insert(cupped, cupPiece); r.cuppedCupPiece = 'laid'; } catch (e) { r.cuppedCupPiece = msg(e); }
    try { PC.insert(cupped, cupPiece, { mirror: true }); r.cuppedCupPieceMirror = 'laid'; } catch (e) { r.cuppedCupPieceMirror = msg(e); }
    out.push({ case: 'two faults, and the kinds', ...r }); })();
  console.log(JSON.stringify(out, null, 1));
})();

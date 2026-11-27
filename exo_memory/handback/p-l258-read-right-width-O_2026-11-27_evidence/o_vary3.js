// o_vary3.js (pane O, L258 track 2 read; scratch): the cases o_vary.js could not read, run again (my probe's faults, not the branch's): Sharp at a radius
// the width allows; a free Jump and the road after it (flights have no profile: skipped when reading sides); the pit lane with its whole field set; and two
// more: a saved piece inserted at a split head THROUGH THE SHELL (the message he would read), and a split track saved and opened again with its undo.
//   node o_vary2.js <branch tree>
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const BR = path.resolve(process.argv[2]);
const D = require(path.join(BR, 'src/core/document.js')), EXT = require(path.join(BR, 'src/core/extend.js')), A = require(path.join(BR, 'src/core/adapter.js'));
const PC = require(path.join(BR, 'src/core/piece.js')), SH = require(path.join(BR, 'app/core/coreshell.js')), EXP = require(path.join(BR, 'app/export/export.js'));
const AI = require(path.join(BR, 'src/export/ailine.js'));
const msg = (e) => (e && (e.code ? `${e.code}: ` : '') + String(e.message || e)).slice(0, 240);
const W0 = 19.1, STEP = 3.5, out = [];
const sides = (doc, id) => A.toSegments(doc).filter((g) => g.id === id && g.profile).map((g) => ({ right: +(-g.profile.u[0]).toFixed(3), left: +g.profile.u[g.profile.u.length - 1].toFixed(3) }));
const wdOf = (P) => (P && P.type === 'road' && P.split ? [+P.channels.wd[0].toFixed(4), +D.pieceEnd(P).wd.v.toFixed(4)] : [0, 0]);
function splitHead() {
  let d = EXT.extend(D.createDoc('vary'), { length: 120, first: { w: W0 }, targets: { kh: 0 } });
  d = EXT.extend(d, { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * Math.PI / 180 } });
  return EXT.extend(d, { length: 100, transition: { wd: 5 }, targets: { wd: STEP } });
}
function memStorage(seed = {}) {
  const st = { docs: new Map(Object.entries(seed)), undo: new Map(), pieces: new Map(), recipes: new Map() };
  return Object.assign(st, { saveDoc: async (n, t) => { st.docs.set(n, t); }, openDoc: async (n) => st.docs.get(n), listDocs: async () => [...st.docs.keys()], saveUndo: async (n, t) => { st.undo.set(n, t); }, openUndo: async (n) => st.undo.get(n) || null,
    savePiece: async (n, t) => { st.pieces.set(n, t); }, openPiece: async (n) => st.pieces.get(n), listPieces: async () => [...st.pieces.keys()], saveRecipe: async () => {}, openRecipe: async () => null,
    saveAutosave: async () => {}, openAutosave: async () => null, clearAutosave: async () => {}, backupDoc: async () => 'b' });
}
const rec = async (name, f) => { try { out.push({ case: name, ...(await f()) }); } catch (e) { out.push({ case: name, threw: msg(e) }); } };
(async () => {
  const head = splitHead(), headP = head.pieces[head.pieces.length - 1];
  const shellOn = async (doc, opts = {}) => { const storage = memStorage({ 'eq-vary': D.serialize(doc) }); const s = await SH.createCoreShell({ storage, autosaveMs: 0, ...opts }); await s.open('vary'); return { s, storage }; };
  await rec('Test export of a split road with a right-side pit lane (whole field set): written, the lane, the AI line', async () => {
    let d = EXT.extend(head, { length: 300 }); d = EXT.extend(d, { length: 100, transition: { wd: 5 }, targets: { wd: 0 } }); d = EXT.extend(d, { length: 200 });
    const ex = await EXP.makeExporter(async (rel) => fs.readFileSync(path.join(BR, rel), 'utf8')), { s } = await shellOn(d, { exporter: ex });
    const pid = s.getState().history.present.pieces[3].id; s.setPitLane({ side: 'R', leave: { word: pid, along: 40 }, rejoin: { word: pid, along: 260 }, offsetM: 6, width: 8, divergeM: 60, mergeM: 56, speedKmh: 80, boxes: 1, boxSpacingM: 10 }); const pm = s.getState().message || null;
    let r; try { r = s.buildExport({ test: true }); } catch (e) { return { pitMessage: pm, refused: msg(e) }; }
    const files = r.folders.flatMap((f) => f.files), ai = files.find((x) => /fast_lane\.ai$/.test(x.path)), pit = files.find((x) => /pit_lane\.ai$/.test(x.path));
    const line = AI.readAiLine(Buffer.from(ai.bytes)), at = (L, m) => { let k = 0; for (let i = 0; i < L.points.length; i++) if (L.points[i].length <= m) k = i; return { left: +L.extra[k].sideLeft.toFixed(2), right: +L.extra[k].sideRight.toFixed(2), pos: L.points[k].pos.map((v) => +v.toFixed(2)) }; };
    let lane = null; if (pit) { const pl = AI.readAiLine(Buffer.from(pit.bytes)); const mid = pl.points[Math.floor(pl.points.length / 2)]; const main = line.points.reduce((a, p) => { const dd = Math.hypot(p.pos[0] - mid.pos[0], p.pos[2] - mid.pos[2]); return dd < a.d ? { d: dd, k: line.points.indexOf(p) } : a; }, { d: Infinity, k: 0 });
      lane = { points: pl.points.length, midLaneToMainLineM: +main.d.toFixed(2), mainRightHalfThere: +line.extra[main.k].sideRight.toFixed(2), laneWidthThere: +(pl.extra[Math.floor(pl.points.length / 2)].sideLeft + pl.extra[Math.floor(pl.points.length / 2)].sideRight).toFixed(2) }; }
    const AD = A, MESH = require(path.join(BR, 'src/geom/mesh.js')), PLX = require(path.join(BR, 'src/export/pitlane.js')), doc2 = s.getState().history.present, tp = AD.toPath(doc2, { step: 1 }), mm = MESH.buildMesh(tp.path, tp.segments, {}); const { boxes, boxSpacingM, ...road } = doc2.pitLane; let red = null; try { red = PLX.laneForExport(tp.path, tp.segments, mm, road, { selfCheck: true }).red; } catch (e) { red = 'threw ' + msg(e); }
    return { laneSelfCheckRed: Array.isArray(red) ? red.length : red, laneSelfCheckFirst: Array.isArray(red) ? red.slice(0, 2) : null, pitMessage: pm, files: files.length, pitFiles: files.filter((x) => /pit/i.test(x.path)).map((x) => x.path), aiHeldStep570m: at(line, 570), lane, expectGapM: 6 };
  });
  console.log(JSON.stringify(out, null, 1));
})();

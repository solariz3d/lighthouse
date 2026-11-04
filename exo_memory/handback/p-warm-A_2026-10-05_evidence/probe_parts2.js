require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'A warm: the two parts equal the whole?' });
const W = 'C:/Users/nname/Desktop/worktrees/a-piecesui-wt/', { createCoreShell } = require(W + 'app/core/coreshell.js'), D = require(W + 'src/core/document.js'), { extend } = require(W + 'src/core/extend.js'), C = require(W + 'src/core/close.js'), OJ = require(W + 'app/core/overlapjob.js');
const R = 180, Q = (Math.PI * R) / 2, DEG = Math.PI / 180;
const T = (f) => { const t = Date.now(); const r = f(); return [r, Date.now() - t]; };
function compare(label, doc, closed) {
  const [whole, tw] = T(() => OJ.runJob({ doc, designSpeedKmh: null, closed })), [rest, tr] = T(() => OJ.runJob({ doc, designSpeedKmh: null, closed, part: 'rest' })), [rays, ty] = T(() => OJ.runJob({ doc, designSpeedKmh: null, closed, part: 'rays' }));
  const merged = OJ.mergeParts(rest, rays), same = JSON.stringify(merged) === JSON.stringify(whole);
  console.log(label.padEnd(34), 'whole', tw, 'ms | rest', tr, 'ms | rays', ty, 'ms | critical path', Math.max(tr, ty), 'ms | identical:', same, '| overlaps', whole.overlaps.length, 'others', whole.others.length, 'amber', whole.amber);
  if (!same) console.log(JSON.stringify(merged).slice(0, 400), '\n', JSON.stringify(whole).slice(0, 400));
}
(async () => {
  const mk = async () => createCoreShell({ brushFn: null, autosaveMs: 0 });
  const coil = await mk(); coil.extend({ length: 300, family: 'bowl' }); for (let i = 0; i < 8; i++) coil.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); coil.extend({ length: 60, transition: 40, targets: { kh: 0 } });
  coil.proposeClose(); compare('coil, Close (closed)', coil.getState().closeProposal.doc, true);
  coil.cancelClose(); coil.selectPiece(0); coil.deleteSelection(); compare('coil, delete (open)', coil.getState().deleteProposal.doc, false);
  // a track with a jump and a cup, a tube
  const j = await mk(); j.extend({ length: 200, family: 'bowl' }); j.extend({ length: 100, transition: 40, targets: { kh: 1 / 300 } }); j.commitDoc(D.appendPiece(j.getState().history.present, D.flightPiece({ gap: 25, drop: 1, land: -2 * DEG }))); j.extend({ length: 150 }); j.extend({ length: 150, transition: 40, targets: { kh: 1 / 200 } }); j.extend({ length: 100 });
  j.selectPiece(1); j.deleteSelection(); compare('jump track, delete (open)', j.getState().deleteProposal.doc, false);
  const cup = await mk(); cup.extend({ length: 300, family: 'bowl', first: { c: 45 } }); for (let i = 0; i < 4; i++) cup.extend({ length: Q, transition: 40, targets: { kh: 1 / R, c: 45 } }); cup.extend({ length: 100, transition: 40, targets: { kh: 0, c: 45 } });
  cup.selectPiece(2); cup.deleteSelection(); compare('cup track, delete (open)', cup.getState().deleteProposal.doc, false);
  const tube = await mk(); tube.extend({ length: 300, first: { w: 40, t: 360 } }); for (let i = 0; i < 3; i++) tube.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); tube.extend({ length: 100, transition: 40, targets: { kh: 0 } });
  tube.selectPiece(1); tube.deleteSelection(); compare('tube track, delete (open)', tube.getState().deleteProposal.doc, false);
  const big = await mk(); big.extend({ length: 300, family: 'bowl' }); for (let i = 0; i < 45; i++) big.extend({ length: i % 3 === 2 ? 250 : 300, transition: 60, targets: { kh: (i % 2 ? -1 : 1) / 300 } });
  big.selectPiece(42); big.deleteSelection(); compare('46 pieces 13.1 km, delete', big.getState().deleteProposal.doc, false);
  let d = extend(D.createDoc('big lap'), { length: 3000, family: 'bowl' }); for (let i = 0; i < 4; i++) { d = extend(d, { length: (Math.PI * 1000) / 2, transition: 60, targets: { kh: 1 / 1000 } }); d = extend(d, { length: i % 2 ? 3000 : 1000, transition: 60, targets: { kh: 0 } }); }
  const far = D.checkDoc({ ...d, pieces: d.pieces.slice(0, -1), nextId: d.nextId }), open = D.checkDoc({ ...C.close(far, { edited: [0] }).doc, closed: false });
  const near = D.checkDoc({ ...open, pieces: open.pieces.map((p, k) => (k === 2 ? { ...p, channels: { ...p.channels, kh: p.channels.kh.map((v, i, a) => (i >= 3 && i <= a.length - 4 ? v + 1e-4 : v)) } } : p)) });
  const s = await mk(); s.adopt(near); s.proposeClose({ last: true }); compare('14.3 km lap, Close (closed)', s.getState().closeProposal.doc, true);
})();

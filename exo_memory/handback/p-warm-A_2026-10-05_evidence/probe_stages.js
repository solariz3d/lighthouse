require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'A warm: where the overlap check spends its time' });
const W = 'C:/Users/nname/Desktop/worktrees/a-piecesui-wt/', { createCoreShell } = require(W + 'app/core/coreshell.js'), D = require(W + 'src/core/document.js'), { extend } = require(W + 'src/core/extend.js'), C = require(W + 'src/core/close.js'), OJ = require(W + 'app/core/overlapjob.js');
const G = require(W + 'src/geom/index.js'), V = require(W + 'src/validate/index.js'), { walkScene, isDrivable } = require(W + 'src/export/markers.js');
const T = (l, f, acc) => { const t = process.hrtime.bigint(); const r = f(); const ms = Number(process.hrtime.bigint() - t) / 1e6; acc[l] = Math.round(ms); return r; };
function stages(doc, closed, label) {
  const acc = {}, resolved = T('resolveDoc', () => OJ.resolveDoc(doc), acc), segs = resolved.segments;
  const p0 = T('buildPath', () => G.buildPath(segs, { step: 2, closed, start: resolved.start }), acc), p = typeof resolved.lift === 'function' ? T('lift', () => resolved.lift(p0), acc) : p0;
  const mesh = T('buildMesh+selfCheck', () => G.buildMesh(p, segs, { selfCheck: true }), acc);
  const roadMesh = T('walkScene', () => walkScene(mesh.scene).meshes.filter((m) => isDrivable(m.name) && m.indices && m.indices.length), acc);
  const v = T('validate(csp,soft,ray)', () => V.validate(p, segs, { csp: true, softCollision: true, folds: mesh.folds, roadMesh }), acc);
  T('buildMesh (no selfCheck)', () => G.buildMesh(p, segs, {}), acc);
  T('validate without roadMesh', () => V.validate(p, segs, { csp: true, softCollision: true, folds: mesh.folds }), acc);
  T('validate without csp', () => V.validate(p, segs, { softCollision: true, folds: mesh.folds, roadMesh }), acc);
  T('validate without softCollision', () => V.validate(p, segs, { csp: true, folds: mesh.folds, roadMesh }), acc);
  acc.total = acc.resolveDoc + acc.buildPath + (acc.lift || 0) + acc['buildMesh+selfCheck'] + acc.walkScene + acc['validate(csp,soft,ray)'];
  console.log(label, JSON.stringify(acc), 'reds', v.red.length, 'amber', v.amber.length);
}
(async () => {
  const big = await createCoreShell({ brushFn: null, autosaveMs: 0 }); big.extend({ length: 300, family: 'bowl' });
  for (let i = 0; i < 45; i++) big.extend({ length: i % 3 === 2 ? 250 : 300, transition: 60, targets: { kh: (i % 2 ? -1 : 1) / 300 } });
  big.selectPiece(42); big.deleteSelection(); const bp = big.getState().deleteProposal;
  stages(bp.doc, false, 'delete 13 km');
  stages(bp.doc, false, 'delete 13 km (2nd run, warm JIT)');
  let d = extend(D.createDoc('big lap'), { length: 3000, family: 'bowl' });
  for (let i = 0; i < 4; i++) { d = extend(d, { length: (Math.PI * 1000) / 2, transition: 60, targets: { kh: 1 / 1000 } }); d = extend(d, { length: i % 2 ? 3000 : 1000, transition: 60, targets: { kh: 0 } }); }
  const far = D.checkDoc({ ...d, pieces: d.pieces.slice(0, -1), nextId: d.nextId }), open = D.checkDoc({ ...C.close(far, { edited: [0] }).doc, closed: false });
  const near = D.checkDoc({ ...open, pieces: open.pieces.map((p, k) => (k === 2 ? { ...p, channels: { ...p.channels, kh: p.channels.kh.map((v, i, a) => (i >= 3 && i <= a.length - 4 ? v + 1e-4 : v)) } } : p)) });
  const s = await createCoreShell({ brushFn: null, autosaveMs: 0 }); s.adopt(near); s.proposeClose({ last: true }); const cp = s.getState().closeProposal;
  stages(cp.doc, true, 'close 14.3 km');
})();

require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'A async probe: big lap close' });
const W = 'C:/Users/nname/Desktop/worktrees/a-piecesui-wt/', { createCoreShell } = require(W + 'app/core/coreshell.js'), D = require(W + 'src/core/document.js'), { extend } = require(W + 'src/core/extend.js'), C = require(W + 'src/core/close.js'), OJ = require(W + 'app/core/overlapjob.js');
(async () => {
  let d = extend(D.createDoc('big lap'), { length: 3000, family: 'bowl' });
  for (let i = 0; i < 4; i++) { d = extend(d, { length: (Math.PI * 1000) / 2, transition: 60, targets: { kh: 1 / 1000 } }); d = extend(d, { length: i % 2 ? 3000 : 1000, transition: 60, targets: { kh: 0 } }); }
  const far = D.checkDoc({ ...d, pieces: d.pieces.slice(0, -1), nextId: d.nextId });
  console.log('pieces', far.pieces.length, 'km', (far.pieces.reduce((a, p) => a + (p.length || 0), 0) / 1000).toFixed(1));
  const open = D.checkDoc({ ...C.close(far, { edited: [0] }).doc, closed: false });
  const near = D.checkDoc({ ...open, pieces: open.pieces.map((p, k) => (k === 2 ? { ...p, channels: { ...p.channels, kh: p.channels.kh.map((v, i, a) => (i >= 3 && i <= a.length - 4 ? v + 1e-4 : v)) } } : p)) });
  const s = await createCoreShell({ brushFn: null, autosaveMs: 0 }); s.adopt(near);
  let t = Date.now(); s.proposeClose({ last: true }); const p = s.getState().closeProposal; console.log('proposeClose', Date.now() - t, 'ms', p ? 'proposal' : s.getState().message);
  if (p) { t = Date.now(); const j = OJ.runJob({ doc: p.doc, designSpeedKmh: null, closed: true }); console.log('job', Date.now() - t, 'ms; equal', JSON.stringify(j) === JSON.stringify(p.check), 'overlaps', p.check.overlaps.length, 'others', p.check.others.length); }
})();

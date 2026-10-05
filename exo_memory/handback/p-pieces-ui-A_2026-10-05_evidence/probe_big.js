require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'A D240-UI probe: delete preview on a big track' });
const W = 'C:/Users/nname/Desktop/worktrees/a-piecesui-wt/', { createCoreShell } = require(W + 'app/core/coreshell.js');
(async () => {
  const s = await createCoreShell({ brushFn: null, autosaveMs: 0 }); const R = 300;
  s.extend({ length: 300, family: 'bowl' });
  for (let i = 0; i < 45; i++) s.extend({ length: i % 3 === 2 ? 250 : 300, transition: 60, targets: { kh: (i % 2 ? -1 : 1) / R } });
  const d = s.getState().history.present, L = d.pieces.reduce((a, P) => a + (P.length || 0), 0);
  console.log('pieces', d.pieces.length, 'length km', (L / 1000).toFixed(1));
  for (const at of [3, 20, 40]) { s.selectPiece(at); const t0 = Date.now(); s.deleteSelection(); const ms = Date.now() - t0, p = s.getState().deleteProposal; console.log(`middle delete of piece ${at}: preview in ${ms} ms; ${p ? p.check.overlaps.length + ' overlaps, ' + p.displacement.length + ' displacement rows' : s.getState().message}`); s.cancelDelete(); }
  s.selectPiece(45); const t1 = Date.now(); s.deleteSelection(); console.log('end delete', Date.now() - t1, 'ms');
})();

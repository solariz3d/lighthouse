require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'A D240-UI probe: where the preview time goes' });
const W = 'C:/Users/nname/Desktop/worktrees/a-piecesui-wt/', CS = require(W + 'app/core/coreshell.js'), PC = require(W + 'src/core/piece.js'), AD = require(W + 'src/core/adapter.js');
const G = require(W + 'src/geom/index.js');
(async () => {
  const s = await CS.createCoreShell({ brushFn: null, autosaveMs: 0 }); const R = 300;
  s.extend({ length: 300, family: 'bowl' }); for (let i = 0; i < 45; i++) s.extend({ length: i % 3 === 2 ? 250 : 300, transition: 60, targets: { kh: (i % 2 ? -1 : 1) / R } });
  const d = s.getState().history.present, T = (l, f) => { const t = Date.now(); const r = f(); console.log(l, Date.now() - t, 'ms'); return r; };
  const res = T('deleteRun', () => PC.deleteRun(d, 20, 20));
  const segs = T('toSegments', () => AD.toSegments({ ...res, closed: false }));
  T('toPath x2 (displacement)', () => { AD.toPath({ ...d, closed: false }); AD.toPath({ ...res, closed: false }); });
  T('displacementAfterDelete', () => CS.displacementAfterDelete(d, res));
  const p0 = T('buildPath', () => G.buildPath(segs, { step: 2, closed: false, start: { pos: res.start.pos.slice(), theta: res.start.heading, p: res.start.pitch } }));
  const mesh = T('buildMesh selfCheck', () => G.buildMesh(p0, segs, { selfCheck: true }));
  T('buildMesh (no selfCheck)', () => G.buildMesh(p0, segs, {}));
})();

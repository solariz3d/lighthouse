// the whole move: readout, candidate (coarse), ghostFor(cheap): steady state at L
const path = require('path'); const repo = process.argv[2], L = +process.argv[3] || 2000, N = +process.argv[4] || 600;
const { createCoreShell } = require(path.join(repo, 'app/core/coreshell.js')); const { createTrackModel } = require(path.join(repo, 'app/preview/trackmodel.js'));
(async () => {
  const sh = await createCoreShell({ brushFn: null, autosaveMs: 0 }); sh.extend({ length: 300 });
  const tm = createTrackModel(); tm.update(sh.getState().resolved);
  const move = (i) => { const o = { length: L, turnDeg: 5 + (i % 80) * 0.37 + i * 1e-5 }; sh.candidateReadout(o); const c = sh.candidate(o, { coarse: true }); tm.ghostFor(c, { cheap: true }); };
  for (let i = 0; i < 80; i++) move(i);
  const t0 = process.hrtime.bigint(); for (let i = 0; i < N; i++) move(i + 100); console.log('per move', (Number(process.hrtime.bigint() - t0) / 1e6 / N).toFixed(2), 'ms');
})();

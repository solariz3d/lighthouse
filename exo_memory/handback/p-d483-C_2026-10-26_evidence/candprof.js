// candprof.js (C, D483): node --cpu-prof candprof.js <tree> <which: candidate|readout> — 300 calls at 1,000 m (+ i*0.37 m) with a left edge 20 typed
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]), which = process.argv[3];
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
(async () => {
  const sh = await createCoreShell({ brushFn: null, autosaveMs: 0 });
  const o = (i) => extendOptions({ grip: '', length: String(1000 + (i % 50) * 0.37), turn: '', climb: '', bank: '', width: '', cup: '', edge: '20', edgeR: '', start: '', tube: '', atStart: {}, empty: true, turnAs: 'corner' });
  for (let i = 0; i < 300; i++) which === 'candidate' ? sh.candidate(o(i), { coarse: true }) : sh.candidateReadout(o(i));
})();

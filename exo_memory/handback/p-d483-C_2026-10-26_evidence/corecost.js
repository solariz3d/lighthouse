// corecost.js (C, D483): node corecost.js <t180 tree> — per call ms of the shell's candidate (coarse) and candidateReadout, a fresh piece with a left edge typed, by length
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), XS = require(path.join(T, 'app/core/xsec.js')), { extendOptions } = require(path.join(T, 'app/core/' + process.argv[3]));
(async () => {
  const sh = await createCoreShell({ brushFn: null, autosaveMs: 0 });
  let bump = 0; const time = (f, n = 40) => { for (let i = 0; i < 5; i++) f(++bump); const t0 = process.hrtime.bigint(); for (let i = 0; i < n; i++) f(++bump); return Number(process.hrtime.bigint() - t0) / 1e6 / n; };
  for (const edge of [0, 20]) for (const L of [400, 700, 1000, 1400, 1800]) {
    const o = (i) => extendOptions({ grip: '', length: String(L + (i % 50) * 0.37), turn: '', climb: '', bank: '', width: '', cup: '', edge: edge ? String(edge) : '', edgeR: '', start: '', tube: '', atStart: {}, empty: true, turnAs: 'corner' });
    console.log(`edge ${edge} length ${L}: candidate(coarse) ${time((i) => sh.candidate(o(i), { coarse: true })).toFixed(2)} ms, candidateReadout ${time((i) => sh.candidateReadout(o(i))).toFixed(2)} ms`);
  }
})().catch((e) => { console.error(e.stack); process.exit(1); });

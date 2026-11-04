// part1b.js (C, D467 bar re-read): the reds part 1 compares, with every field the live checker gives and the s redsOf reads (x.s ?? x.s0 ?? 0), for the open lap
// (closed:false, as barMiss) and for the saved result.   node part1b.js <tree> <base save> <result save> <s0> <r> <delta>
'use strict';
const fs = require('fs'), path = require('path');
const [T, file, res, s0, rr, dl] = process.argv.slice(2), r = (f) => require(path.join(T, f));
const D = r('src/core/document.js'), { createCoreShell } = r('app/core/coreshell.js'), { createCheckJob } = r('app/validate-ui/checkjob.js');
(async () => {
  const s = await createCoreShell({ autosaveMs: 0 }); s.adopt(D.parse(fs.readFileSync(file, 'utf8')));
  s.beginBrush({ tool: 'bend', s0: +s0, r: +rr }); s.brushTo(+dl);
  const open = s.getState().history.present, job = createCheckJob();
  for (const [name, d] of [['open', { ...open, closed: false }], ['result', D.parse(fs.readFileSync(res, 'utf8'))]]) {
    const o = job.run({ doc: d, csp: true });
    for (const x of o.result.red || []) console.log(name, 'read s', x.s ?? x.s0 ?? 0, '|', JSON.stringify(x).slice(0, 300));
  }
})().catch((e) => { console.log('FAILED', e.stack || e); process.exit(1); });

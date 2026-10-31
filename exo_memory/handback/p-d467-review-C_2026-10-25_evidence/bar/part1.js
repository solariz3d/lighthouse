// part1.js (C, D467 bar re-read): the full release on tree T, then part 1's own reds (the live checker's job, as barMiss runs it) on the open lap and the result,
// and the result's sha256 (to match against the export runs). Reads only; with --save writes the result to the scratchpad.   node part1.js <tree> <save> <s0> <r> <delta>
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const [T, file, s0, rr, dl] = process.argv.slice(2), r = (f) => require(path.join(T, f));
const D = r('src/core/document.js'), { createCoreShell } = r('app/core/coreshell.js'), { createCheckJob } = r('app/validate-ui/checkjob.js');
(async () => {
  const s = await createCoreShell({ autosaveMs: 0 }); s.adopt(D.parse(fs.readFileSync(file, 'utf8')));
  s.beginBrush({ tool: 'bend', s0: +s0, r: +rr }); s.brushTo(+dl);
  const open = s.getState().history.present; s.endBrush(); const st = await s.brushRelease(), c = st.history.present;
  console.log('message:', st.message, '| keptBend', !!st.keptBend);
  const text = D.serialize(c); console.log('result sha256', crypto.createHash('sha256').update(text).digest('hex'));
  if (process.argv.includes('--save')) fs.writeFileSync(path.join(__dirname, 'bar-result.t180track'), text);
  const job = createCheckJob();
  for (const [name, d] of [['open (closed:false, as barMiss)', { ...open, closed: false }], ['result', c]]) {
    const o = job.run({ doc: d, csp: true });
    if (!o.result) { console.log(name, 'NOT CHECKED', o.error || o.how); continue; }
    const red = o.result.red || [];
    console.log(`${name}: ${red.length} red:`, red.map((x) => `${x.reason}@${Math.round(x.s)}`).join(', ') || '-');
  }
})().catch((e) => { console.log('FAILED', e.stack || e); process.exit(1); });

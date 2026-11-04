// row34.js (C, D467 re-read 2): row 34's lap and Bend (sculpt-tools.test.js at 52f07c9), the raw start close's barMiss verdict on tree T, and each part's own numbers.
'use strict';
const path = require('path'), T = process.argv[2], r = (f) => require(path.join(T, f));
const CJ = r('app/core/closejob.js'), { createCoreShell } = r('app/core/coreshell.js'), { createCheckJob } = r('app/validate-ui/checkjob.js');
(async () => {
  const s = await createCoreShell({ autosaveMs: 0 });
  s.extend({ length: 900, family: 'bowl' }); s.extend({ length: Math.PI * 40, transition: 30, targets: { kh: 1 / 40 } }); s.extend({ length: 900, transition: 30, targets: { kh: 0 } });
  s.extend({ length: Math.PI * 40, transition: 30, targets: { kh: 1 / 40 } }); s.close();
  const base = s.getState().history.present;
  s.beginBrush({ tool: 'bend', s0: 900 + Math.PI * 40 + 450, r: 120 }); s.brushTo(4e-3);
  const open = s.getState().history.present, win = s.getState().brush.changedPieces, last = open.pieces.length - 1;
  const reds = (d) => { const o = createCheckJob().run({ doc: d, csp: true }); return (o.result.red || []).map((x) => `${x.reason}@${Math.round(x.s ?? x.s0)}`).join(', ') || '-'; };
  let raw; try { raw = CJ.runClose({ doc: open, window: [0, last] }); } catch (e) { console.log('raw start close refused', e.code, e.message.slice(0, 160)); return; }
  const mx = (xs) => xs.reduce((m, x) => Math.max(m, x.maxM), 0);
  console.log(`${path.basename(T)}: window ${JSON.stringify(win)} | drag ${mx(CJ.displacementOf(base, open)).toFixed(2)} m | result moved ${mx(CJ.displacementOf(base, raw.doc)).toFixed(2)} m`);
  console.log('  reds before the drag:', reds(base)); console.log('  reds open:', reds({ ...open, closed: false })); console.log('  reds raw start close:', reds(raw.doc));
  console.log('  barMiss:', CJ.barMiss(open, raw.doc, { base, edited: win }));
})().catch((e) => { console.log('FAILED', e.stack || e); process.exit(1); });

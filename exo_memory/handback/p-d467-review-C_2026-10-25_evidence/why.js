// why.js (C, D467 review): the open lap after a Bend, and each close try's answer, run directly through closejob.runClose (the page's own path). Reads only.
'use strict';
const fs = require('fs'), path = require('path'), T = process.argv[2], r = (f) => require(path.join(T, f));
const D = r('src/core/document.js'), CJ = r('app/core/closejob.js'), { createCoreShell } = r('app/core/coreshell.js');
(async () => {
  const [file, s0, rr, dl] = process.argv.slice(3);
  const s = await createCoreShell({ autosaveMs: 0 }); s.adopt(D.parse(fs.readFileSync(file, 'utf8')));
  s.beginBrush({ tool: 'bend', s0: +s0, r: +rr }); s.brushTo(+dl);
  const open = s.getState().history.present, win = s.getState().brush.changedPieces, last = open.pieces.length - 1;
  for (const w of [[0, last], [last], [0], win, [...win, last]]) {
    const t0 = Date.now();
    try { const o = CJ.runClose({ doc: open, window: w }); console.log(JSON.stringify(w), 'converged', o.converged, o.report, (Date.now() - t0) + ' ms'); }
    catch (e) { console.log(JSON.stringify(w), 'REFUSED', e.code || e.name, String(e.message).slice(0, 400)); }
  }
})();

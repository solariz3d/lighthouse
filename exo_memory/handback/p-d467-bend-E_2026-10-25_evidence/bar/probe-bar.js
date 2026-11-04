// probe-bar.js (D467 re-ruling, pane E): for a few laps and bends, the drag's own move against the start-pieces close's move outside the window (C's measure, closejob displacementOf)
'use strict';
const W = 'C:/Users/nname/Downloads/t180-wt-e467/';
const { createCoreShell } = require(W + 'app/core/coreshell.js');
const CJ = require(W + 'app/core/closejob.js');
const R = 180, Q = (Math.PI * R) / 2;
const LAPS = {
  tools: (s) => { s.extend({ length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 60, transition: 40, targets: { kh: 0 } }); },
  oval: (s) => { s.extend({ length: 800, family: 'bowl' }); s.extend({ length: Math.PI * 250, transition: 60, targets: { kh: 1 / 250 } }); s.extend({ length: 800, transition: 60, targets: { kh: 0 } }); s.extend({ length: Math.PI * 250, transition: 60, targets: { kh: 1 / 250 } }); s.extend({ length: 200, transition: 60, targets: { kh: 0 } }); },
  long: (s) => { s.extend({ length: 1500, family: 'bowl' }); s.extend({ length: Math.PI * 400, transition: 80, targets: { kh: 1 / 400 } }); s.extend({ length: 1500, transition: 80, targets: { kh: 0 } }); s.extend({ length: Math.PI * 400, transition: 80, targets: { kh: 1 / 400 } }); s.extend({ length: 300, transition: 80, targets: { kh: 0 } }); },
};
(async () => {
  for (const [name, make] of Object.entries(LAPS)) {
    const s0s = name === 'tools' ? [450, 700] : name === 'oval' ? [800 + Math.PI * 250 + 400] : [1500 + Math.PI * 400 + 750];
    for (const s0 of s0s) for (const rate of [3e-4, 1e-4, 3e-5, 1e-5]) {
      const s = await createCoreShell({ autosaveMs: 0 }); make(s); s.close();
      if (!s.getState().history.present.closed) { console.log(name, 'did not close:', s.getState().message); break; }
      const base = s.getState().history.present;
      s.beginBrush({ tool: 'bend', s0, r: 80 }); s.brushTo(rate);
      const open = s.getState().history.present, win = s.getState().brush.changedPieces; s.cancelBrush && s.cancelBrush();
      const road = open.pieces.map((P, i) => (P.type === 'road' ? i : -1)).filter((i) => i >= 0), first = road[0], last = road[road.length - 1];
      let res; try { res = CJ.runClose({ doc: open, window: [first, last] }); } catch (e) { console.log(`${name} s0 ${s0.toFixed(0)} rate ${rate}: start try refused ${e.message.slice(0, 80)}`); continue; }
      if (!res.converged) { console.log(`${name} s0 ${s0.toFixed(0)} rate ${rate}: start try did not converge`); continue; }
      const drag = Math.max(...CJ.displacementOf(base, open).map((x) => x.maxM));
      const outside = Math.max(...CJ.displacementOf(base, res.doc).filter((x) => !win.includes(x.piece)).map((x) => x.maxM));
      console.log(`${name} s0 ${s0.toFixed(0)} rate ${rate}: window ${JSON.stringify(win)} drag moved ${drag.toFixed(2)} m, start close moves outside ${outside.toFixed(2)} m -> ${outside <= drag ? 'PASSES' : 'fails'} part 3`);
    }
  }
})().catch((e) => { console.error(e); process.exit(1); });

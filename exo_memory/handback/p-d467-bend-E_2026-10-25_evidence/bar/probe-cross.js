// probe-cross.js (D467 re-ruled, pane E): laps that pass close beside themselves; the start-pieces close WITHOUT the bar (95d23f1's behaviour) against the validator's reds
'use strict';
const W = 'C:/Users/nname/Downloads/t180-wt-e467/';
const { createCoreShell } = require(W + 'app/core/coreshell.js');
const CJ = require(W + 'app/core/closejob.js');
const { createCheckJob } = require(W + 'app/validate-ui/checkjob.js');
const job = createCheckJob();
const reds = (d) => { const o = job.run({ doc: d, csp: true }); return o.result ? (o.result.red || []).map((x) => ({ reason: x.reason, s: x.s ?? x.s0 ?? 0 })) : [{ reason: 'unchecked:' + (o.error || o.how), s: 0 }]; };
const LAPS = {
  // a hairpin lap: two long straights side by side, joined by tight ends; the start pieces are the first straight and the closing piece
  hairpin: (s) => { s.extend({ length: 700, family: 'bowl' }); s.extend({ length: Math.PI * 60, transition: 30, targets: { kh: 1 / 60 } }); s.extend({ length: 700, transition: 30, targets: { kh: 0 } }); s.extend({ length: Math.PI * 60, transition: 30, targets: { kh: 1 / 60 } }); s.extend({ length: 60, transition: 30, targets: { kh: 0 } }); },
  hairpinWide: (s) => { s.extend({ length: 700, family: 'bowl' }); s.extend({ length: Math.PI * 80, transition: 30, targets: { kh: 1 / 80 } }); s.extend({ length: 700, transition: 30, targets: { kh: 0 } }); s.extend({ length: Math.PI * 80, transition: 30, targets: { kh: 1 / 80 } }); s.extend({ length: 60, transition: 30, targets: { kh: 0 } }); },
};
(async () => {
  for (const [name, make] of Object.entries(LAPS)) {
    const s = await createCoreShell({ autosaveMs: 0 }); make(s); s.close();
    const base = s.getState().history.present; if (!base.closed) { console.log(name, 'did not close:', s.getState().message); continue; }
    const baseReds = reds(base); console.log(`${name}: ${base.pieces.length} pieces, closed; base reds ${JSON.stringify(baseReds.map((r) => r.reason + '@' + Math.round(r.s)))}`);
    const L = base.pieces.map((P) => P.length), at = (i, f) => L.slice(0, i).reduce((a, b) => a + b, 0) + f * L[i];
    for (const [pi, f] of [[1, 0.5], [2, 0.3], [2, 0.7], [3, 0.5]]) for (const rate of [3e-4, 1e-4]) {
      const t = await createCoreShell({ autosaveMs: 0 }); make(t); t.close();
      t.beginBrush({ tool: 'bend', s0: at(pi, f), r: 60 }); t.brushTo(rate);
      const open = t.getState().history.present, win = t.getState().brush.changedPieces; t.cancelBrush();
      const road = open.pieces.map((P, i) => (P.type === 'road' ? i : -1)).filter((i) => i >= 0), first = road[0], last = road[road.length - 1];
      if (win.includes(first) || win.includes(last)) { console.log(`  piece ${pi} f ${f}: at the seam`); continue; }
      let res; try { res = CJ.runClose({ doc: open, window: [first, last] }); } catch (e) { console.log(`  piece ${pi} f ${f} rate ${rate}: start try refused ${e.message.slice(0, 70)}`); continue; }
      const openReds = reds({ ...open, closed: false }), mine = reds(res.doc), fresh = mine.filter((x) => !openReds.some((o) => o.reason === x.reason && Math.abs(o.s - x.s) <= 10));
      const why = CJ.barMiss(open, res.doc, { base, edited: win });
      console.log(`  piece ${pi} f ${f} rate ${rate}: window ${JSON.stringify(win)} start try closes; new reds ${JSON.stringify(fresh.map((r) => r.reason + '@' + Math.round(r.s)))}; bar: ${why || 'passes'}`);
    }
  }
})().catch((e) => { console.error(e); process.exit(1); });

// probe-joint.js (D467, pane E): which values of the window's pieces the start-pieces close changes (the joint after a moved piece), against the drag
'use strict';
const W = 'C:/Users/nname/Downloads/t180-wt-e467/';
const { createCoreShell } = require(W + 'app/core/coreshell.js');
const CJ = require(W + 'app/core/closejob.js');
const realClose = (args) => { try { return { out: CJ.runClose(args), ms: 0 }; } catch (e) { if (e && e.name === 'CoreError') return { refused: { code: e.code || null, message: e.message } }; throw e; } };
const R = 180, Q = (Math.PI * R) / 2;
(async () => {
  for (const s0 of [450, 700]) {
    const runner = { start(args) { return { promise: Promise.resolve(realClose(args)), cancel() {} }; } };
    const s = await createCoreShell({ autosaveMs: 0, closeRunner: runner });
    s.extend({ length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 60, transition: 40, targets: { kh: 0 } }); s.close();
    const base = s.getState().history.present;
    s.beginBrush({ tool: 'bend', s0, r: 80 }); s.brushTo(3e-4);
    const open = s.getState().history.present, win = s.getState().brush.changedPieces; s.endBrush(); const a = await s.brushRelease();
    console.log(`s0 ${s0} window ${JSON.stringify(win)} msg: ${a.message.slice(0, 90)}`);
    for (const i of win) {
      const o = open.pieces[i], c = a.history.present.pieces[i], b = base.pieces[i];
      for (const ch of Object.keys(o.channels)) {
        const diff = o.channels[ch].map((v, k) => [k, v, c.channels[ch][k], b.channels[ch][k]]).filter(([, v, w]) => v !== w);
        if (diff.length) console.log(`  piece ${i} ${ch}: knots changed by the close ${JSON.stringify(diff.map(([k, v, w, bb]) => ({ k, dragged: v, closed: w, base: bb })))}`);
      }
      if (o.length !== c.length) console.log(`  piece ${i} length ${o.length} -> ${c.length}`);
      console.log(`  piece ${i} same object: ${o === c}; knots: ${JSON.stringify(o.knots)}`);
    }
  }
})().catch((e) => { console.error(e); process.exit(1); });

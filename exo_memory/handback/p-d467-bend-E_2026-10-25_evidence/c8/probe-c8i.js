// probe-c8i.js (D467, C's §8 part 1 row, pane E): split-start narrow stadiums, a finer grid; prints only the cases where the start pieces keep a crossing the drag made
// at the very stations it was (old by the open-lap baseline), pass parts 3 and 2, and the fallback clears it
'use strict';
const W = 'C:/Users/nname/Downloads/t180-wt-e467/';
const { createCoreShell, startLayout } = require(W + 'app/core/coreshell.js');
const CJ = require(W + 'app/core/closejob.js');
const AD = require(W + 'src/core/adapter.js');
const { createCheckJob } = require(W + 'app/validate-ui/checkjob.js');
const job = createCheckJob();
const crossesAll = (d) => { const o = job.run({ doc: d, csp: true }); return o.result ? (o.result.red || []).filter((x) => x.reason === 'self-intersection').map((x) => Math.round(x.s ?? x.s0 ?? 0)) : ['unchecked']; };
const hasStart = (d) => { const segs = AD.toSegments(d); try { startLayout(segs, (p) => AD.offsetPath(d, segs, p), { pos: d.start.pos.slice(), theta: d.start.heading, p: d.start.pitch }, {}); return true; } catch (e) { if (e.code === 'NO_START_STRAIGHT') return false; throw e; } };
const realClose = (args) => { try { return { out: CJ.runClose(args), ms: 0 }; } catch (e) { if (e && e.name === 'CoreError') return { refused: { code: e.code || null, message: e.message } }; throw e; } };
const make = (A, H, G) => (s) => {
  s.extend({ length: G, family: 'bowl' });
  s.extend({ length: A, transition: 30, targets: { kh: 0 } });
  s.extend({ length: Math.PI * H, transition: 30, targets: { kh: 1 / H } });
  s.extend({ length: A + G, transition: 30, targets: { kh: 0 } });
  s.extend({ length: Math.PI * H, transition: 30, targets: { kh: 1 / H } });
  s.close();
};
(async () => {
  let n = 0;
  for (const A of [700, 800, 900]) for (const H of [38, 40, 42]) for (const G of [300, 330, 360]) {
    const s = await createCoreShell({ autosaveMs: 0 }); make(A, H, G)(s); const base = s.getState().history.present;
    if (!base.closed) { console.log(`A ${A} H ${H} G ${G}: did not close`); continue; }
    const LEN = base.pieces.reduce((a, P) => a + P.length, 0), mid = (xs) => xs.filter((x) => typeof x !== 'number' || (x > 40 && x < LEN - 40));
    if (mid(crossesAll(base)).length) { console.log(`A ${A} H ${H} G ${G}: base crosses`); continue; }
    for (const F of [0.4, 0.5, 0.6]) for (const rate of [2.5e-3, 3e-3, 3.5e-3]) {
      n++;
      const s0 = G + A + Math.PI * H + (A + G) * F;
      const t = await createCoreShell({ autosaveMs: 0 }); make(A, H, G)(t);
      t.beginBrush({ tool: 'bend', s0, r: 120 }); t.brushTo(rate);
      const open = t.getState().history.present, win = t.getState().brush.changedPieces; t.cancelBrush();
      const last = open.pieces.length - 1; if (win.includes(0) || win.includes(last)) continue;
      const ox = mid(crossesAll({ ...open, closed: false })); if (!ox.length) continue;
      const st = realClose({ doc: open, window: [0, last] }); if (st.refused) continue;
      const sd = st.out.doc, sx = mid(crossesAll(sd)), near = sx.length > 0 && sx.every((x) => ox.some((o) => Math.abs(o - x) <= 10));
      const drag = Math.max(...CJ.displacementOf(base, open).map((x) => x.maxM)), all = Math.max(...CJ.displacementOf(base, sd).map((x) => x.maxM));
      if (!(near && all <= drag + 1e-6 && hasStart(sd))) continue;
      const u = await createCoreShell({ autosaveMs: 0, closeRunner: { start(args) { return { promise: Promise.resolve(args.bar ? { refused: { code: 'X', message: 'x' } } : realClose(args)), cancel() {} }; } } }); make(A, H, G)(u);
      u.beginBrush({ tool: 'bend', s0, r: 120 }); u.brushTo(rate); u.endBrush(); const fb = await u.brushRelease();
      const fx = mid(crossesAll(fb.history.present));
      console.log(`${fx.length ? 'near-but-fallback-crosses' : 'MATCH'} A ${A} H ${H} G ${G} F ${F} rate ${rate}: window ${JSON.stringify(win)} open crosses ${ox}; start crosses ${sx}; move ${all.toFixed(1)} vs drag ${drag.toFixed(1)}; fallback crosses ${fx} :: ${(fb.message || '').slice(27, 70)}`);
    }
  }
  console.log('cases tried', n);
})().catch((e) => { console.error(e); process.exit(1); });

// probe-c8.js (D467, C's §8 part 1 row, pane E): narrow stadium laps where a Bend makes the OPEN lap cross itself; does the start-pieces close keep the crossing while
// passing parts 3 and 2, and does the window close (D421c's tries) clear it?
'use strict';
const W = 'C:/Users/nname/Downloads/t180-wt-e467/';
const { createCoreShell, startLayout } = require(W + 'app/core/coreshell.js');
const CJ = require(W + 'app/core/closejob.js');
const AD = require(W + 'src/core/adapter.js');
const { createCheckJob } = require(W + 'app/validate-ui/checkjob.js');
const job = createCheckJob();
const crossesAll = (d) => { const o = job.run({ doc: d, csp: true }); return o.result ? (o.result.red || []).filter((x) => x.reason === 'self-intersection').map((x) => Math.round(x.s ?? x.s0 ?? 0)) : ['unchecked']; };
let LEN = 0; const crosses = (d) => crossesAll(d).filter((s) => typeof s !== 'number' || (s > 40 && s < LEN - 40));
const hasStart = (d) => { const segs = AD.toSegments(d); try { startLayout(segs, (p) => AD.offsetPath(d, segs, p), { pos: d.start.pos.slice(), theta: d.start.heading, p: d.start.pitch }, {}); return true; } catch (e) { if (e.code === 'NO_START_STRAIGHT') return false; throw e; } };
const realClose = (args) => { try { return { out: CJ.runClose(args), ms: 0 }; } catch (e) { if (e && e.name === 'CoreError') return { refused: { code: e.code || null, message: e.message } }; throw e; } };
const make = (L, Rh) => (s) => { s.extend({ length: L, family: 'bowl' }); s.extend({ length: Math.PI * Rh, transition: 30, targets: { kh: 1 / Rh } }); s.extend({ length: L, transition: 30, targets: { kh: 0 } }); s.extend({ length: Math.PI * Rh, transition: 30, targets: { kh: 1 / Rh } }); s.close(); };
(async () => {
  for (const L of [400, 700]) for (const Rh of [40, 60]) {
    const s = await createCoreShell({ autosaveMs: 0 }); make(L, Rh)(s); const base = s.getState().history.present;
    if (!base.closed) { console.log(`L ${L} R ${Rh}: did not close`); continue; }
    LEN = base.pieces.reduce((a, P) => a + P.length, 0); const bx = crosses(base); if (bx.length) { console.log(`L ${L} R ${Rh}: base crosses ${bx}`); continue; }
    for (const [where, s0] of [['turn1', L + Math.PI * Rh * 0.5], ['back', L + Math.PI * Rh + L * 0.5]]) for (const rate of [2e-3, 4e-3, -2e-3, -4e-3]) {
      const t = await createCoreShell({ autosaveMs: 0 }); make(L, Rh)(t);
      t.beginBrush({ tool: 'bend', s0, r: 120 }); t.brushTo(rate);
      const open = t.getState().history.present, win = t.getState().brush.changedPieces; t.cancelBrush();
      const last = open.pieces.length - 1; if (win.includes(0) || win.includes(last)) continue;
      const ox = crosses({ ...open, closed: false }); if (!ox.length) continue;   // the drag must make the open lap cross
      const st = realClose({ doc: open, window: [0, last] });
      if (st.refused) { console.log(`L ${L} R ${Rh} ${where} ${rate}: open crosses ${ox}; start try refused ${st.refused.code}`); continue; }
      const sd = st.out.doc, drag = Math.max(...CJ.displacementOf(base, open).map((x) => x.maxM)), all = Math.max(...CJ.displacementOf(base, sd).map((x) => x.maxM));
      // the fallback: the release with the start pieces refused
      const u = await createCoreShell({ autosaveMs: 0, closeRunner: { start(args) { return { promise: Promise.resolve(args.bar ? { refused: { code: 'X', message: 'x' } } : realClose(args)), cancel() {} }; } } }); make(L, Rh)(u);
      u.beginBrush({ tool: 'bend', s0, r: 120 }); u.brushTo(rate); u.endBrush(); const fb = await u.brushRelease();
      console.log(`L ${L} R ${Rh} ${where} ${rate}: window ${JSON.stringify(win)} open crosses ${ox}; start: crosses ${crosses(sd)}, move ${all.toFixed(1)} vs drag ${drag.toFixed(1)} (part3 ${all <= drag + 1e-6 ? 'pass' : 'MISS'}), start straight ${hasStart(sd)}; fallback: ${fb.history.present.closed ? 'closed' : 'not closed'} crosses ${crosses(fb.history.present)} :: ${(fb.message || '').slice(27, 70)}`);
    }
  }
})().catch((e) => { console.error(e); process.exit(1); });

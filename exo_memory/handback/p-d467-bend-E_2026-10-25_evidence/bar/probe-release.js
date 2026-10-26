// probe-release.js (D467 re-ruled, pane E): the real release with the bar, on a few laps: which try closed it, the words, the kept bend, the start straight after
'use strict';
const W = 'C:/Users/nname/Downloads/t180-wt-e467/';
const { createCoreShell, startLayout } = require(W + 'app/core/coreshell.js');
const CJ = require(W + 'app/core/closejob.js');
const AD = require(W + 'src/core/adapter.js');
const realClose = (args) => { try { return { out: CJ.runClose(args), ms: 0 }; } catch (e) { if (e && e.name === 'CoreError') return { refused: { code: e.code || null, message: e.message } }; throw e; } };
const R = 180, Q = (Math.PI * R) / 2;
const hasStart = (d) => { const segs = AD.toSegments(d); try { startLayout(segs, (p) => AD.offsetPath(d, segs, p), { pos: d.start.pos.slice(), theta: d.start.heading, p: d.start.pitch }, {}); return true; } catch (e) { if (e.code === 'NO_START_STRAIGHT') return false; throw e; } };
const LAPS = {
  tools: [(s) => { s.extend({ length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 60, transition: 40, targets: { kh: 0 } }); }, [450, 700]],
  curvedMid: [(s) => { s.extend({ length: 300, family: 'bowl', targets: { kh: 1 / 600 } }); s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 500, transition: 40, targets: { kh: 0 } }); s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 200, transition: 40, targets: { kh: 1 / 600 } }); }, [450, 600]],
};
(async () => {
  for (const [name, [make, s0s]] of Object.entries(LAPS)) for (const s0 of s0s) for (const rate of [3e-4, 1e-4, 3e-5]) {
    const calls = [];
    const runner = { start(args) { const r = realClose(args); calls.push((args.bar ? 'START' : args.window ? JSON.stringify(args.window) : 'whole') + (r.refused ? ' refused(' + r.refused.code + (r.refused.code === 'CLOSE_BAR' ? ': ' + r.refused.message.replace(/^close: closing with the start of the lap would /, '') : '') + ')' : ' closed')); return { promise: Promise.resolve(r), cancel() {} }; } };
    const s = await createCoreShell({ autosaveMs: 0, closeRunner: runner }); make(s); s.close();
    const base = s.getState().history.present; if (!base.closed) { console.log(name, 'did not close'); break; }
    s.beginBrush({ tool: 'bend', s0, r: 80 }); s.brushTo(rate); s.endBrush(); const a = await s.brushRelease();
    console.log(`${name} s0 ${s0} rate ${rate}: base start ${hasStart(base)}, after start ${hasStart(a.history.present)}; tries: ${calls.join(' | ')}\n    -> ${(a.message || '').slice(0, 110)}; keptBend ${!!a.keptBend}`);
  }
})().catch((e) => { console.error(e); process.exit(1); });

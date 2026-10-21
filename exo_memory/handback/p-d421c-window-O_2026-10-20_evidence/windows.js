'use strict';
// D421c (O, the chair's 03:37Z measure): on sculpt-frame row 3's track (E's closed10: a closed 10 km lap of 50 pieces), a Bend r 200 at s0 2100 dragged as
// shellprof.js drags it, then the release's re-close (coreshell releaseRoute -> closejob -> close.js close) tried with the changed pieces widened by k ROAD pieces
// each side (no wrap round the start line, as releaseRoute), and the whole-lap fallback. For each: closes or refused (and why), the time, the pieces changed
// against the dragged lap. Each close timed 3 times, the median reported. MEASURE ONLY.     node windows.js <tree> [final px ...]
const TREE = process.argv[2], PXS = process.argv.slice(3).map(Number);
const { performance } = require('perf_hooks');
const D = require(`${TREE}/src/core/document.js`), { close } = require(`${TREE}/src/core/close.js`);
const { createCoreShell } = require(`${TREE}/app/core/coreshell.js`);
const { PER_PX } = require(`${TREE}/app/core/panel.js`);
const closed10 = (s) => { s.extend({ length: 200, family: 'bowl' }); for (let k = 0; k < 2; k++) { for (let i = 0; i < (k ? 20 : 19); i++) s.extend({ length: 200, transition: 40, targets: { kh: 0 } }); for (let i = 0; i < 5; i++) s.extend({ length: 200, transition: 40, targets: { kh: Math.PI / 1000 } }); } s.close(); };
const median = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
(async () => {
  for (const finalPx of PXS.length ? PXS : [14]) {
    const s = await createCoreShell({ autosaveMs: 0 }); closed10(s);
    s.setSculpt(true); s.beginBrush({ tool: 'bend', mode: 'rate', channel: 'kh', s0: Number(process.env.S0 || 2100), r: 200 });   // S0: row 3's 2100 unless asked
    const steps = 12; for (let i = 1; i < steps; i++) s.brushTo(Math.round(Math.sin((i / steps) * 3 * Math.PI * 0.75) * 20) * PER_PX.kh);
    s.brushTo(finalPx * PER_PX.kh);
    const st = s.getState(), open = st.history.present, win = st.brush.changedPieces;
    const road = (i) => open.pieces[i] && open.pieces[i].type === 'road';
    const widen = (k) => [...new Set([...Array.from({ length: k }, (_, j) => Math.max(0, Math.min(...win) - 1 - j)), ...win, ...Array.from({ length: k }, (_, j) => Math.min(open.pieces.length - 1, Math.max(...win) + 1 + j))])].filter(road).sort((a, b) => a - b);
    const KS = (process.env.KS || "0,1,2,4,8").split(",").map(Number);
    const tries = [...KS.map((k) => ({ what: `window +${k}`, opts: { window: widen(k) } })), ...(process.env.EXTRA ? process.env.EXTRA.split(';').map((w) => { const ids = w.split(',').map(Number); return { what: `variant [${ids.join(',')}]`, opts: { window: ids } }; }) : []), { what: 'whole lap', opts: { edited: win } }];   // EXTRA: windows beyond the widths, as 'a,b,c;d,e' (labelled variants)
    console.log(JSON.stringify({ finalPx, delta_kh: +(finalPx * PER_PX.kh).toExponential(3), pieces: open.pieces.length, closed_flag_of_dragged_doc: !!open.closed, changedPieces: win }));
    for (const t of tries) {
      const ms = []; let out = null, err = null;
      for (let r = 0; r < 3; r++) { const t0 = performance.now(); try { out = close(open, t.opts); err = null; } catch (e) { err = e; out = null; } ms.push(performance.now() - t0); }
      const changed = out && out.doc ? out.doc.pieces.filter((P, i) => D.serialize({ ...open, pieces: [P] }) !== D.serialize({ ...open, pieces: [open.pieces[i]] })).length : null;
      console.log(JSON.stringify({ finalPx, try: t.what, window: t.opts.window || null, closes: !!(out && out.converged && out.doc), refused: err ? `${err.code}: ${String(err.message).replace(/(p[0-9, p]*)/, "(...)").slice(-260)}` : out && !out.converged ? 'not converged' : null, ms_median: +median(ms).toFixed(1), ms_runs: ms.map((x) => +x.toFixed(1)), iterations: out ? out.iterations : null, gapM: out ? out.gapM : null, pieces_changed: changed }));
    }
  }
})().catch((e) => { console.error(e); process.exit(1); });

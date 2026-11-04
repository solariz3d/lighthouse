'use strict';
// D421c seam tries (O): on sculpt-frame row 3's track (E's closed10: a closed 10 km lap, 50 pieces of 200 m), one route drag per case through the shell, then
// EVERY release try run through closejob.runClose (the close worker's own call), in the release's order: the window; + the lap's last road piece; + the last and
// the first; the whole lap with the window protected. The tries are built exactly as coreshell releaseRoute builds them (the same dedupe). Each try is run
// even after one closes, so each has its figures; `lands` marks the one the release would land (the first that closes). For each: closes or the refusal,
// the time (median of 3), the gap, the pieces changed against the dragged lap. Both heavy-run slots are held (timed).
//   cwd = anywhere:  node seamtries.js <tree> <out.jsonl>
const [TREE, OUT] = process.argv.slice(2);
const fs = require('fs'), { performance } = require('perf_hooks');
const HR = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const WAIT = 2 * 60 * 60 * 1000;
HR.hold({ cmd: 't180 O D421c seam tries: timed closes (node)', maxWaitMs: WAIT });
const env2 = { ...process.env }; delete env2[HR.TOKEN_ENV];
const h2 = HR.acquire({ cmd: 't180 O D421c seam tries (second slot)', env: env2, tree: HR.NON_GIT_TREE, maxWaitMs: WAIT });
process.on('exit', () => h2.release());
const D = require(`${TREE}/src/core/document.js`), CJ = require(`${TREE}/app/core/closejob.js`);
const { createCoreShell } = require(`${TREE}/app/core/coreshell.js`);
const { PER_PX } = require(`${TREE}/app/core/panel.js`);
const closed10 = (s) => { s.extend({ length: 200, family: 'bowl' }); for (let k = 0; k < 2; k++) { for (let i = 0; i < (k ? 20 : 19); i++) s.extend({ length: 200, transition: 40, targets: { kh: 0 } }); for (let i = 0; i < 5; i++) s.extend({ length: 200, transition: 40, targets: { kh: Math.PI / 1000 } }); } s.close(); };
const CASES = [
  { name: 'Bend at 2100 m (row 3)', tool: 'bend', mode: 'rate', channel: 'kh', s0: 2100, r: 200, delta: 14 * PER_PX.kh },
  { name: 'Bend at 6000 m', tool: 'bend', mode: 'rate', channel: 'kh', s0: 6000, r: 200, delta: 14 * PER_PX.kh },
  { name: 'Climb at 2100 m', tool: 'climb', mode: 'rate', channel: 'kv', s0: 2100, r: 200, delta: 14 * PER_PX.kv },
  { name: 'Stretch of the piece under 2100 m, +5 m', tool: 'stretch', mode: 'rate', channel: 'length', s0: 2100, r: 200, delta: 5 },
];
const median = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
(async () => {
  const lines = [];
  for (const c of CASES) {
    const s = await createCoreShell({ autosaveMs: 0 }); closed10(s);
    s.setSculpt(true); s.beginBrush({ tool: c.tool, mode: c.mode, channel: c.channel, s0: c.s0, r: c.r });
    if (!s.getState().brush) { lines.push({ case: c.name, refusedToOpen: s.getState().message }); continue; }
    s.brushTo(c.delta);
    const st = s.getState(), open = st.history.present, win = st.brush && st.brush.changedPieces;
    if (!st.brush || !win || !win.length) { lines.push({ case: c.name, noWindow: st.message }); continue; }
    const road = open.pieces.map((P, i) => (P.type === 'road' ? i : -1)).filter((i) => i >= 0), lastR = road[road.length - 1], firstR = road[0];
    const withSeam = (...more) => [...new Set([...win, ...more])].sort((x, y) => x - y);
    const tries = [win, withSeam(lastR), withSeam(lastR, firstR)].filter((w, k, all) => !k || w.length !== all[k - 1].length);
    const all = [...tries.map((w, k) => ({ try: k === 0 ? 'the window' : k === 1 && w.includes(lastR) && !win.includes(lastR) ? '+ the last piece' : '+ the last and the first', args: { doc: open, window: w } })), { try: 'the whole lap', args: { doc: open, whole: true, edited: win } }];
    let landed = false;
    lines.push({ case: c.name, pieces: open.pieces.length, window: win, lastRoad: lastR, firstRoad: firstR, open: !open.closed });
    for (const t of all) {
      const ms = []; let out = null, err = null;
      for (let r = 0; r < 3; r++) { const t0 = performance.now(); try { out = CJ.runClose(t.args); err = null; } catch (e) { err = e; out = null; } ms.push(performance.now() - t0); }
      const closes = !!(out && out.converged && out.doc);
      const changed = closes ? out.doc.pieces.map((P, i) => (JSON.stringify(P) === JSON.stringify(open.pieces[i]) ? -1 : i)).filter((i) => i >= 0) : null;
      const lands = closes && !landed; if (closes) landed = true;
      lines.push({ case: c.name, try: t.try, window: t.args.window || null, closes, lands, refused: err ? `${err.code}: ${String(err.message).replace(/\(p[0-9, p]*\)/, '(...)').slice(-200)}` : out && !out.converged ? `not converged (gap ${out.gapM})` : null, ms_median: +median(ms).toFixed(1), ms_runs: ms.map((x) => +x.toFixed(1)), gap_mm: closes ? +(out.gapM * 1000).toFixed(3) : null, pieces_changed: changed ? changed.length : null, which: changed && changed.length <= 12 ? changed : null });
    }
  }
  fs.writeFileSync(OUT, lines.map((l) => JSON.stringify(l)).join('\n') + '\n');
  for (const l of lines) console.log(JSON.stringify(l));
})().catch((e) => { console.error(e); process.exit(1); });

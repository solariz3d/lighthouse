'use strict';
// D421c seam tries (O), untimed: (a) the gap each closing try leaves (close.js residual of the closed document: runClose's own answer carries no gap figure), for
// seamtries.js's four cases; (b) a sweep for the case the ruling asks about (item 5): a Bend and a Climb at every 400 m round row 3's lap, each release try in
// order through closejob.runClose, flagging any position where both seam tries fail and the whole lap closes. Pieces changed are counted against the dragged lap.
//   [LAP=closed10|small|tube360 STEP=400 LEN=10000 RAD=200] node seamsweep.js <tree> <out.jsonl>
const [TREE, OUT] = process.argv.slice(2);
const fs = require('fs');
const CJ = require(`${TREE}/app/core/closejob.js`), { residual } = require(`${TREE}/src/core/close.js`);
const { createCoreShell } = require(`${TREE}/app/core/coreshell.js`);
const { PER_PX } = require(`${TREE}/app/core/panel.js`);
const closed10 = (s) => { s.extend({ length: 200, family: 'bowl' }); for (let k = 0; k < 2; k++) { for (let i = 0; i < (k ? 20 : 19); i++) s.extend({ length: 200, transition: 40, targets: { kh: 0 } }); for (let i = 0; i < 5; i++) s.extend({ length: 200, transition: 40, targets: { kh: Math.PI / 1000 } }); } s.close(); };
const R = 180, Q = (Math.PI * R) / 2;
const LAPS = { closed10, small: (s) => { s.extend({ length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 60, transition: 40, targets: { kh: 0 } }); s.close(); }, tube360: (s) => { s.extend({ length: 300, first: { w: 31, t: 360 } }); for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 60, transition: 40, targets: { kh: 0 } }); s.close(); } };
const LAP = process.env.LAP || 'closed10', STEP = Number(process.env.STEP || 400), LEN = Number(process.env.LEN || 10000), RAD = Number(process.env.RAD || 200);   // LAP: closed10 (row 3) | small (sculpt-tools' closedLap) | tube360 (row 4a)
const TOOLS = { bend: { mode: 'rate', channel: 'kh', delta: 14 * PER_PX.kh }, climb: { mode: 'rate', channel: 'kv', delta: 14 * PER_PX.kv }, stretch: { mode: 'rate', channel: 'length', delta: 5 } };
async function one(tool, s0) {
  const T = TOOLS[tool], s = await createCoreShell({ autosaveMs: 0 }); LAPS[LAP](s);
  s.setSculpt(true); s.beginBrush({ tool, mode: T.mode, channel: T.channel, s0, r: RAD });
  if (!s.getState().brush) return { tool, s0, refusedToOpen: s.getState().message };
  s.brushTo(T.delta);
  const st = s.getState(), open = st.history.present, win = st.brush && st.brush.changedPieces;
  if (!win || !win.length) return { tool, s0, noWindow: st.message };
  const road = open.pieces.map((P, i) => (P.type === 'road' ? i : -1)).filter((i) => i >= 0), lastR = road[road.length - 1], firstR = road[0];
  const withSeam = (...more) => [...new Set([...win, ...more])].sort((x, y) => x - y);
  const tries = [win, withSeam(lastR), withSeam(lastR, firstR)].filter((w, k, all) => !k || w.length !== all[k - 1].length);
  const res = [];
  for (const args of [...tries.map((w) => ({ doc: open, window: w })), { doc: open, whole: true, edited: win }]) {
    let out = null, err = null; try { out = CJ.runClose(args); } catch (e) { err = e; }
    const closes = !!(out && out.converged && out.doc);
    res.push({ window: args.window || 'whole', closes, gap_mm: closes ? +(residual(out.doc).gapM * 1000).toFixed(4) : null, changed: closes ? out.doc.pieces.filter((P, i) => JSON.stringify(P) !== JSON.stringify(open.pieces[i])).length : null, refused: err ? err.code : out && !out.converged ? 'not converged' : null });
  }
  const seamTries = res.slice(1, -1), whole = res[res.length - 1];
  return { tool, s0, window: win, tries: res, windowCloses: res[0].closes, seamCloses: seamTries.some((r) => r.closes), wholeCloses: whole.closes, ITEM5_seamFailsWholeCloses: !res[0].closes && !seamTries.some((r) => r.closes) && whole.closes };
}
(async () => {
  const lines = [];
  if (LAP === 'closed10') for (const [tool, s0] of [['bend', 2100], ['bend', 6000], ['climb', 2100], ['stretch', 2100]]) lines.push({ part: 'gaps', ...(await one(tool, s0)) });
  for (const tool of ['bend', 'climb']) for (let s0 = 50; s0 < LEN; s0 += STEP) lines.push({ part: 'sweep', ...(await one(tool, s0)) });
  fs.writeFileSync(OUT, lines.map((l) => JSON.stringify(l)).join('\n') + '\n');
  const sw = lines.filter((l) => l.part === 'sweep' && l.tries);
  console.log(JSON.stringify({ sweep_positions: sw.length, window_alone_closes: sw.filter((l) => l.windowCloses).length, a_seam_try_closes: sw.filter((l) => !l.windowCloses && l.seamCloses).length, item5_seam_fails_whole_closes: sw.filter((l) => l.ITEM5_seamFailsWholeCloses).map((l) => `${l.tool}@${l.s0}`), nothing_closes: sw.filter((l) => !l.windowCloses && !l.seamCloses && !l.wholeCloses).map((l) => `${l.tool}@${l.s0}`), skipped: lines.filter((l) => l.part === 'sweep' && !l.tries).map((l) => `${l.tool}@${l.s0}: ${l.refusedToOpen || l.noWindow}`) }));
  for (const l of lines.filter((x) => x.part === 'gaps')) console.log(JSON.stringify({ tool: l.tool, s0: l.s0, tries: l.tries.map((t) => [Array.isArray(t.window) ? t.window.length + ' pieces' : t.window, t.closes ? `gap ${t.gap_mm} mm, ${t.changed} changed` : t.refused]) }));
})().catch((e) => { console.error(e); process.exit(1); });

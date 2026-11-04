'use strict';
// D421 shell cut (O): ONLY the shell's per-step work (brushTo) of sculpt-frame rows 2, 3, 4a and 4b, on E's fixtures and swing (E's probe3.js, which takes them verbatim from
// A's sculpt-frame.test.js), timed per step and, run under --cpu-prof, profiled. No preview: E's probe times that separately.
//   node [--cpu-prof --cpu-prof-dir=<dir>] shellprof.js <tree> <row>      row: 2 | 3 | 4a | 4b
const TREE = process.argv[2], ROW = process.argv[3];
const { createCoreShell } = require(`${TREE}/app/core/coreshell.js`);
const { PER_PX } = require(`${TREE}/app/core/panel.js`);
const { performance } = require('perf_hooks');
const DEG = Math.PI / 180, R = 180, Q = (Math.PI * R) / 2;
const TRACKS = {   // E's probe3.js (A's, verbatim)
  open10: (s) => { s.extend({ length: 200, family: 'bowl' }); for (let i = 1; i < 50; i++) s.extend({ length: 200, transition: 40, targets: { kh: (Math.floor(i / 5) % 2 ? 1 : -1) / 2000 } }); },
  closed10: (s) => { s.extend({ length: 200, family: 'bowl' }); for (let k = 0; k < 2; k++) { for (let i = 0; i < (k ? 20 : 19); i++) s.extend({ length: 200, transition: 40, targets: { kh: 0 } }); for (let i = 0; i < 5; i++) s.extend({ length: 200, transition: 40, targets: { kh: Math.PI / 1000 } }); } s.close(); },
  tube360: (s) => { s.extend({ length: 300, first: { w: 31, t: 360 } }); for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 60, transition: 40, targets: { kh: 0 } }); s.close(); },
  tube280: (s) => { s.extend({ length: 300, first: { w: 31, t: 280 } }); for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 60, transition: 40, targets: { kh: 0 } }); s.close(); },
};
const TOOLS = { grab: { tool: 'grab-up', mode: 'local', channel: 'height' }, bend: { tool: 'bend', mode: 'rate', channel: 'kh' }, twist: { tool: 'twist', mode: 'rate', channel: 'phi' } };
const ROWS = { 2: ['open10', 'grab', 200, 5100, 60, 40], 3: ['closed10', 'bend', 200, 2100, 20, 12], '4a': ['tube360', 'grab', 60, 150, 40, 20], '4b': ['tube280', 'twist', 60, 150, 40, 20] };
const pct = (a, p) => { const b = a.slice().sort((x, y) => x - y); return b[Math.min(b.length - 1, Math.floor(p * b.length))]; };
(async () => {
  const [track, tool, r, s0, ampPx, steps] = ROWS[ROW];
  const s = await createCoreShell({ autosaveMs: 0 }); TRACKS[track](s);
  const T = TOOLS[tool], d0 = s.getState().history.present;
  s.setSculpt(true); s.beginBrush({ tool: T.tool, mode: T.mode, channel: T.channel, s0, r });
  if (!s.getState().brush) throw new Error(`refused: ${s.getState().message}`);
  const ms = [], docs = [];
  for (let i = 1; i <= steps; i++) {
    const px = Math.round(Math.sin((i / steps) * 3 * Math.PI * 0.75) * ampPx);
    const t0 = performance.now(); s.brushTo(px * PER_PX[T.channel]); ms.push(performance.now() - t0);
    const st = s.getState(); if (!st.brush) throw new Error(`dropped: ${st.message}`);
    docs.push(require(`${TREE}/src/core/document.js`).serialize(st.history.present));
  }
  // a fingerprint of every step's document, so a cut can be shown bit-identical (the same text, step by step)
  const h = require('crypto').createHash('sha256'); docs.forEach((t) => h.update(t)); const resolved = s.getState().resolved;
  const G = require(`${TREE}/src/geom/index.js`), path = G.buildPath(resolved.segments, { step: 2, closed: resolved.closed, start: resolved.start }), lifted = resolved.lift ? resolved.lift(path) : path;
  const h2 = require('crypto').createHash('sha256'); lifted.samples.forEach((x) => h2.update(JSON.stringify([x.pos, x.T, x.L, x.U])));
  console.log(JSON.stringify({ row: ROW, track, tool, pieces: d0.pieces.length, closed: !!d0.closed, steps: ms.length, p50: +pct(ms, 0.5).toFixed(2), p95: +pct(ms, 0.95).toFixed(2), max: +Math.max(...ms).toFixed(2), docsSha256: h.digest('hex').slice(0, 16), liftedSha256: h2.digest('hex').slice(0, 16) }));
})().catch((e) => { console.error(e); process.exit(1); });

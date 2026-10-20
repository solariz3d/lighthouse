'use strict';
// D421 (O): the SHELL's share of one Bend drag step on sculpt-frame row 3's track (A's TRACKS.closed10, copied from 7692f24:app/test/sculpt-frame.test.js:65), in node: no page, no preview.
// brushTo is the brush on the open lap plus resolvedOf (segments) — what the shell does per step; the page's frame adds the preview's rebuild of what changed. Run from the t180 worktree.
//   node <this> [label]
const path = require('path');
const { createCoreShell } = require(path.resolve('app/core/coreshell.js'));
(async () => {
  const s = await createCoreShell({ autosaveMs: 0 });
  s.extend({ length: 200, family: 'bowl' });
  for (let k = 0; k < 2; k++) { for (let i = 0; i < (k ? 20 : 19); i++) s.extend({ length: 200, transition: 40, targets: { kh: 0 } }); for (let i = 0; i < 5; i++) s.extend({ length: 200, transition: 40, targets: { kh: Math.PI / 1000 } }); }
  s.close(); if (!s.getState().history.present.closed) throw new Error('not closed: ' + s.getState().message);
  s.beginBrush({ tool: 'bend', s0: 2100, r: 200 }); if (!s.getState().brush) throw new Error(s.getState().message);
  const ms = [];
  for (let k = 1; k <= 31; k++) { const t = process.hrtime.bigint(); s.brushTo(k * 2e-6); ms.push(Number(process.hrtime.bigint() - t) / 1e6); if (s.getState().message && /refused|can't|SCULPT/.test(s.getState().message)) throw new Error(s.getState().message); }
  const lift = s.getState().resolved.lift; let liftMs = null;
  if (lift) { const G = require(path.resolve('src/geom/index.js')), r = s.getState().resolved, p = G.buildPath(r.segments, { step: 2, closed: r.closed, start: r.start }); const t = process.hrtime.bigint(); lift(p); liftMs = Number(process.hrtime.bigint() - t) / 1e6; }
  const sorted = ms.slice(1).sort((a, b) => a - b);   // the first step warms the caches
  console.log(JSON.stringify({ label: process.argv[2] || '', pieces: s.getState().history.present.pieces.length, closedDuringDrag: s.getState().history.present.closed, steps: sorted.length, median_ms: +sorted[Math.floor(sorted.length / 2)].toFixed(2), p95_ms: +sorted[Math.floor(sorted.length * 0.95)].toFixed(2), first_ms: +ms[0].toFixed(2), lift_ms: liftMs }));
})().catch((e) => { console.error(e); process.exit(1); });

'use strict';
// D421c part 4 (O): where the step's segmentsOf -> core toSegments time goes, on sculpt-frame rows 2, 3 and 4a (E's fixtures, the shell step only, as shellprof.js).
// Wraps the adapter's toSegments and document.js checkDoc BEFORE the shell loads (coreshell takes toSegments from the adapter object at load), and counts the
// segment cache's hits and misses through a wrapper on the cache the shell passes. Per drag step: toSegments calls, ms in toSegments, ms in its checkDoc, pieces
// converted (misses) and reused (hits), segments returned.     node segsplit.js <tree> <row>
const TREE = process.argv[2], ROW = process.argv[3];
const { performance } = require('perf_hooks');
// ONE wrapper per cache (the adapter keeps per-cache state by the cache object, so a new wrapper per call would hide it), and a miss is a set that stores a NEW
// entry (a reuse also sets the entry it reuses under the new piece)
const WRAP = new WeakMap(), SEEN = new WeakSet(), CUR = { v: null };
const AD = require(`${TREE}/src/core/adapter.js`), D = require(`${TREE}/src/core/document.js`);
const acc = { calls: 0, ms: 0, check: 0, hit: 0, miss: 0, segs: 0, inTo: false };
const check0 = D.checkDoc; D.checkDoc = function (...a) { const t = performance.now(); try { return check0.apply(this, a); } finally { if (acc.inTo) acc.check += performance.now() - t; } };
const to0 = AD.toSegments;
AD.toSegments = function (doc, opts = {}) {
  let cache = opts.cache;
  if (cache) { const c = cache; cache = WRAP.get(c); if (!cache) { cache = { get: (P) => c.get(P), set: (P, v) => { if (!SEEN.has(v)) { SEEN.add(v); acc.miss++; } return c.set(P, v); }, has: (P) => c.has(P), delete: (P) => c.delete(P) }; WRAP.set(c, cache); } }
  const t = performance.now(); acc.inTo = true;
  try { const out = to0.call(this, doc, { ...opts, cache }); acc.segs += out.length; return out; } finally { acc.inTo = false; acc.ms += performance.now() - t; acc.calls++; }
};
const { createCoreShell } = require(`${TREE}/app/core/coreshell.js`);
const { PER_PX } = require(`${TREE}/app/core/panel.js`);
const R = 180, Q = (Math.PI * R) / 2;
const TRACKS = {
  open10: (s) => { s.extend({ length: 200, family: 'bowl' }); for (let i = 1; i < 50; i++) s.extend({ length: 200, transition: 40, targets: { kh: (Math.floor(i / 5) % 2 ? 1 : -1) / 2000 } }); },
  closed10: (s) => { s.extend({ length: 200, family: 'bowl' }); for (let k = 0; k < 2; k++) { for (let i = 0; i < (k ? 20 : 19); i++) s.extend({ length: 200, transition: 40, targets: { kh: 0 } }); for (let i = 0; i < 5; i++) s.extend({ length: 200, transition: 40, targets: { kh: Math.PI / 1000 } }); } s.close(); },
  tube360: (s) => { s.extend({ length: 300, first: { w: 31, t: 360 } }); for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 60, transition: 40, targets: { kh: 0 } }); s.close(); },
};
const TOOLS = { grab: { tool: 'grab-up', mode: 'local', channel: 'height' }, bend: { tool: 'bend', mode: 'rate', channel: 'kh' } };
const ROWS = { 2: ['open10', 'grab', 200, 5100, 60, 40], 3: ['closed10', 'bend', 200, 2100, 20, 12], '4a': ['tube360', 'grab', 60, 150, 40, 20] };
(async () => {
  const [track, tool, r, s0, ampPx, steps] = ROWS[ROW];
  const s = await createCoreShell({ autosaveMs: 0 }); TRACKS[track](s);
  const T = TOOLS[tool]; s.setSculpt(true); s.beginBrush({ tool: T.tool, mode: T.mode, channel: T.channel, s0, r });
  const per = [];
  for (let i = 1; i <= steps; i++) {
    Object.assign(acc, { calls: 0, ms: 0, check: 0, miss: 0, segs: 0 });
    const px = Math.round(Math.sin((i / steps) * 3 * Math.PI * 0.75) * ampPx);
    const t0 = performance.now(); s.brushTo(px * PER_PX[T.channel]); const step = performance.now() - t0;
    per.push({ step, ...acc });
  }
  const med = (k) => { const a = per.slice(1).map((x) => x[k]).sort((p, q) => p - q); return +a[Math.floor(a.length / 2)].toFixed(3); };
  const pieces = s.getState().history.present.pieces.length;
  console.log(JSON.stringify({ row: ROW, pieces, steps, median_after_first: { step_ms: med('step'), toSegments_calls: med('calls'), toSegments_ms: med('ms'), checkDoc_in_it_ms: med('check'), pieces_converted: med('miss'), segments_returned: med('segs') } }));
})().catch((e) => { console.error(e); process.exit(1); });

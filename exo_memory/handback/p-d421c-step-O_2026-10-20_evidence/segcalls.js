'use strict';
// D421c part 4 (O): each toSegments call of one drag step, by caller: pieces converted, segments returned, ms; and the same document converted again straight after
// with the same cache (every piece a hit), which is the call's cost when nothing at all changed: checkDoc plus the walk.   node segcalls.js <tree> <row>
const TREE = process.argv[2], ROW = process.argv[3];
const { performance } = require('perf_hooks');
// ONE wrapper per cache (the adapter keeps per-cache state by the cache object, so a new wrapper per call would hide it), and a miss is a set that stores a NEW
// entry (a reuse also sets the entry it reuses under the new piece)
const WRAP = new WeakMap(), SEEN = new WeakSet(), CUR = { v: null };
const AD = require(`${TREE}/src/core/adapter.js`), D = require(`${TREE}/src/core/document.js`);
const log = []; let rec = false;
const to0 = AD.toSegments;
AD.toSegments = function (doc, opts = {}) {
  if (!rec) return to0.call(this, doc, opts);
  let miss = 0; const c = opts.cache; let cache = null; if (c) { cache = WRAP.get(c); if (!cache) { cache = { get: (P) => c.get(P), set: (P, v) => { if (!SEEN.has(v)) { SEEN.add(v); CUR.v.miss++; } return c.set(P, v); }, has: (P) => c.has(P), delete: (P) => c.delete(P) }; WRAP.set(c, cache); } } const cur = { miss: 0 }; CUR.v = cur;
  const caller = (new Error().stack.split('\n')[2] || '').trim().replace(/^at /, '').replace(/\(.*[\/]/, '(').slice(0, 60);
  const t = performance.now(); const out = to0.call(this, doc, { ...opts, cache }); const ms = performance.now() - t;
  let again = null; if (c) { rec = false; const t2 = performance.now(); to0.call(this, doc, { ...opts, cache: c }); again = performance.now() - t2; rec = true; }
  const t3 = performance.now(); D.checkDoc(doc); const chk = performance.now() - t3;
  log.push({ caller, cached: !!c, miss: CUR.v ? CUR.v.miss : 0, segs: out.length, ms, again_all_hits_ms: again, checkDoc_ms: chk });
  return out;
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
  for (let i = 1; i <= steps; i++) { const px = Math.round(Math.sin((i / steps) * 3 * Math.PI * 0.75) * ampPx); rec = i > 2; s.brushTo(px * PER_PX[T.channel]); }
  const by = {}; for (const e of log) { const b = (by[e.caller] = by[e.caller] || { n: 0, miss: [], segs: e.segs, ms: [], again: [], chk: [] }); b.n++; b.miss.push(e.miss); b.ms.push(e.ms); b.again.push(e.again_all_hits_ms); b.chk.push(e.checkDoc_ms); }
  const med = (a) => { const b = a.filter((x) => x !== null).sort((p, q) => p - q); return b.length ? +b[Math.floor(b.length / 2)].toFixed(3) : null; };
  for (const [k, b] of Object.entries(by)) console.log(JSON.stringify({ row: ROW, caller: k, calls: b.n, miss_median: med(b.miss), segs: b.segs, ms_median: med(b.ms), all_hits_again_ms: med(b.again), checkDoc_ms: med(b.chk) }));
})().catch((e) => { console.error(e); process.exit(1); });

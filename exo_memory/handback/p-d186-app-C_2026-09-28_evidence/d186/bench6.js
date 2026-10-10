// bench6.js (pane C, D186): SPEC TEST 6's measurement, "extend and sculpt stay under 50 ms per step on a 40 km track".
// NOT RUN until B seals test 6's exact rule (asked on the board). What it measures, per step, with the app's own code:
//   · the DOCUMENT step: app/core/coreshell.js extend() / brushTo() (the core's operation plus the adapter's segments), and
//   · the GEOMETRY step: app/preview/trackmodel.js update(resolved), the preview's incremental path and mesh (extend or sculpt).
// Rendering and the water are not in a step. The track: a seeded 40 km document of road pieces (turns, climbs, banks).
//   node bench6.js [--steps 50] [--seed 186] [--km 40]
'use strict';
const WT = process.env.T180_WT || 'C:/Users/nname/AppData/Local/Temp/c-d186-wt/';
const { createCoreShell } = require(WT + 'app/core/coreshell.js'), { createTrackModel } = require(WT + 'app/preview/trackmodel.js');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const steps = arg('--steps', 50), seed = arg('--seed', 186), km = arg('--km', 40);
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const now = () => Number(process.hrtime.bigint()) / 1e6;
const q = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
(async () => {
  const rnd = mulberry32(seed), U = (a, b) => a + (b - a) * rnd();
  const s = await createCoreShell({ brushFn: null, now }), tm = createTrackModel();
  let t0 = now(), L = 0;
  while (L < km * 1000) { const len = U(150, 400); s.extend({ length: len, transition: Math.min(len, 60), targets: { kh: U(-1, 1) / U(250, 900), kv: U(-1, 1) * 0.0004, phi: U(-0.3, 0.3) } }); L += len; if (s.getState().message) throw new Error(s.getState().message); }
  const tBuild = now() - t0; t0 = now(); tm.update(s.getState().resolved); const tFirstGeom = now() - t0;
  const segs = s.getState().resolved.segments.length, lengthM = s.getState().resolved.segments.reduce((a, g) => a + g.length, 0);
  const ext = [], scu = [];
  for (let i = 0; i < steps; i++) {
    const a = now(); s.extend({ length: U(50, 150), targets: { kh: U(-1, 1) / 500 } }); const b = now(); const how = tm.update(s.getState().resolved).how; const c = now();
    if (how !== 'extend') throw new Error(`extend step ${i} rebuilt as ${how}`);
    ext.push({ doc: b - a, geom: c - b, total: c - a });
  }
  const Ln = s.getState().resolved.segments.reduce((a, g) => a + g.length, 0);
  for (let i = 0; i < steps; i++) {
    const s0 = U(0.05, 0.95) * Ln, ch = ['kv', 'phi', 'w', 'kh'][i % 4], d = { kv: 0.002, phi: 0.05, w: 2, kh: 0.001 }[ch];
    s.beginBrush({ mode: 'rate', channel: ch, s0, r: 80 });
    const a = now(); s.brushTo(d); const b = now(); const how = tm.update(s.getState().resolved).how; const c = now(); s.endBrush();
    if (s.getState().message) throw new Error(`brush ${i}: ${s.getState().message}`);
    scu.push({ doc: b - a, geom: c - b, total: c - a, how, ch });
  }
  const sum = (a, k) => ({ p50: +q(a.map((x) => x[k]), 0.5).toFixed(2), p95: +q(a.map((x) => x[k]), 0.95).toFixed(2), max: +Math.max(...a.map((x) => x[k])).toFixed(2) });
  console.log(JSON.stringify({ seed, km, lengthM: Math.round(lengthM), segments: segs, buildS: +(tBuild / 1000).toFixed(1), firstGeomS: +(tFirstGeom / 1000).toFixed(1), steps,
    extend: { doc: sum(ext, 'doc'), geom: sum(ext, 'geom'), total: sum(ext, 'total') },
    sculpt: { doc: sum(scu, 'doc'), geom: sum(scu, 'geom'), total: sum(scu, 'total'), how: [...new Set(scu.map((x) => x.how))] } }, null, 1));
})().catch((e) => { console.error('bench6 FAILED:', e.message); process.exit(1); });

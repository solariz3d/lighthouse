// o_facets.js (pane O, L261 track 8, plan only; scratch; DESCRIPTIVE, not the registered test): the scale of the modelled geometry's facets on L's
// installed layouts, so the plan can say whether a facet can be told from a bump with what is on disk. Read only: his AC folder is read, nothing is
// written there. Names never printed: "layout N" in list_layouts order (as o_follow_survey.js numbers them).
// Per layout with an AI line, in 4 windows of 250 m spread along the line: a ray straight down the surface normal at the AI point every 0.25 m
// (the tree's own tools/piecewise.cjs rayIndex), keeping the surface's height and normal. From those:
//   - edgeSpacingM: the distance between successive places where the hit normal changes (a triangle edge crossed on a bent surface), p10/p50/p90;
//   - kinkDeg: the angle the normal turns at each such place, p50/p95 (a facet's crease; a smooth road meshed finely has many small ones);
//   - bandShare: of the height profile's second difference (d2h/ds2, 0.25 m steps), the share of its energy in the FACET band (what a Gaussian of
//     sigma = 1 x the median edge spacing removes) against the whole, p50 over windows. High = the roughness is mostly creases at the mesh's own scale.
//   node --max-old-space-size=8192 o_facets.js <f3cd425 tree> <AC content/tracks> <out.json>
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [TREE, TRACKS, OUT] = process.argv.slice(2);
const PW = require(path.join(path.resolve(TREE), 'tools/piecewise.cjs'));
const { readKn5 } = require(path.join(path.resolve(TREE), 'tools/kn5.cjs'));
const { readAiShape, isClosed } = require(path.join(path.resolve(TREE), 'src/reference/ribbon.js'));
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = (a) => Math.hypot(a[0], a[1], a[2]), unit = (a) => { const l = len(a); return l > 0 ? [a[0] / l, a[1] / l, a[2] / l] : [0, 0, 0]; };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const isDir = (p) => { try { return fs.statSync(p).isDirectory(); } catch (e) { return false; } };
const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch (e) { return false; } };
const pct = (xs, p) => { if (!xs.length) return null; const s = xs.slice().sort((a, b) => a - b); return +s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))].toFixed(4); };
function listLayouts(tracks) {
  const names = fs.readdirSync(tracks).filter((n) => isDir(path.join(tracks, n)));
  names.sort((a, b) => { const x = a.toLowerCase(), y = b.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
  const out = [];
  for (const t of names) {
    const td = path.join(tracks, t), layouts = [];
    if (isDir(path.join(td, 'ai')) || isFile(path.join(td, 'ui', 'ui_track.json'))) layouts.push('');
    try { const ls = fs.readdirSync(path.join(td, 'ui')).filter((l) => isFile(path.join(td, 'ui', l, 'ui_track.json'))); ls.sort(); layouts.push(...ls); } catch (e) { /* */ }
    try { const ls = fs.readdirSync(td).filter((l) => isDir(path.join(td, l, 'ai')) && l !== 'ai' && !layouts.includes(l)); ls.sort(); layouts.push(...ls); } catch (e) { /* */ }
    if (!layouts.length) layouts.push('');
    for (const l of layouts) out.push({ t, td, l });
  }
  return out;
}
function validKeys(td, l) { const s = [l ? path.join(td, l, 'data', 'surfaces.ini') : null, path.join(td, 'data', 'surfaces.ini')].filter(Boolean).find(isFile); const v = new Set(['ROAD', 'KERB']); if (s) for (const sec of fs.readFileSync(s, 'latin1').split(/^\s*\[/m)) { const k = /^\s*KEY\s*=\s*(\S+)/mi.exec(sec), f = /^\s*IS_VALID_TRACK\s*=\s*(\d)/mi.exec(sec); if (k && f && f[1] === '1') v.add(k[1].toUpperCase()); } return [...v]; }
function modelFiles(td, t, l) { const ini = [l ? path.join(td, `models_${l}.ini`) : null, path.join(td, 'models.ini')].filter(Boolean).find(isFile); return ini ? [...fs.readFileSync(ini, 'latin1').matchAll(/^\s*FILE\s*=\s*(.+?)\s*$/gmi)].map((m) => m[1]) : [t + '.kn5']; }
const tight = (name, keys) => { if (!/^\d/.test(name)) return false; const rest = name.replace(/^\d+/, '').toUpperCase(); return keys.some((k) => rest.startsWith(k) && !/\p{L}/u.test(rest.charAt(k.length))); };
function gauss(xs, sigmaSteps) { if (sigmaSteps < 0.5) return xs.slice(); const r = Math.ceil(3 * sigmaSteps), w = []; for (let k = -r; k <= r; k++) w.push(Math.exp(-(k * k) / (2 * sigmaSteps * sigmaSteps))); return xs.map((_, i) => { let s = 0, ws = 0; for (let k = -r; k <= r; k++) { const j = i + k; if (j < 0 || j >= xs.length) continue; s += w[k + r] * xs[j]; ws += w[k + r]; } return s / ws; }); }
const layouts = listLayouts(TRACKS), rows = []; let cur = null, cache = new Map(); const t0 = Date.now();
for (let n = 1; n <= layouts.length; n++) {
  const { t, td, l } = layouts[n - 1];
  if (t !== cur) { cur = t; cache = new Map(); if (global.gc) global.gc(); }
  const ai = path.join(td, l, 'ai', 'fast_lane.ai'); if (!isFile(ai)) { rows.push({ n, ai: 'none' }); continue; }
  let shape; try { shape = readAiShape(fs.readFileSync(ai)); } catch (e) { rows.push({ n, ai: 'does not read' }); continue; }
  try {
    const keys = validKeys(td, l), T = [];
    for (const f0 of modelFiles(td, t, l)) { const f = path.join(td, f0); if (!isFile(f)) continue; if (!cache.has(f)) cache.set(f, readKn5(f).meshes.filter((m) => /^\d/.test(m.name)).map((m) => ({ name: m.name, pos: m.pos, idx: m.idx })));
      for (const m of cache.get(f)) if (tight(m.name, keys)) for (let i = 0; i < m.idx.length; i += 3) { const q = []; for (const j of [m.idx[i], m.idx[i + 1], m.idx[i + 2]]) q.push(m.pos[j * 3], m.pos[j * 3 + 1], m.pos[j * 3 + 2]); T.push(q); } }
    if (!T.length) { rows.push({ n, road: 'none' }); continue; }
    const ix = PW.rayIndex(T), P = shape.points.map((p) => p.pos), np = P.length, cum = [0];
    for (let k = 1; k < np; k++) cum.push(cum[k - 1] + len(sub(P[k], P[k - 1])));
    const L = cum[np - 1], at = (s) => { let k = 0, lo = 0, hi = np - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < s) lo = m + 1; else hi = m; } k = Math.max(1, lo); const a = P[k - 1], b = P[k], u = (s - cum[k - 1]) / Math.max(1e-9, cum[k] - cum[k - 1]); return { p: [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u], f: unit(sub(b, a)) }; };
    const spacing = [], kinks = [], shares = []; let miss = 0, samples = 0;
    for (const w0 of [0.1, 0.35, 0.6, 0.85].map((x) => x * L)) {
      if (w0 + 250 > L) continue;
      const hs = [], ns = [];
      for (let s = w0; s <= w0 + 250; s += 0.25) {
        const { p, f } = at(s), left = unit([f[2], 0, -f[0]]), up = unit(cross(f, left)), n0 = up[1] < 0 ? up.map((v) => -v) : up;
        const h = ix.ray([p[0] + n0[0] * 2, p[1] + n0[1] * 2, p[2] + n0[2] * 2], n0.map((v) => -v), 4); samples++;
        if (!h) { miss++; hs.push(null); ns.push(null); continue; }
        hs.push(h.p[1]); ns.push(dot(h.n, n0) < 0 ? h.n.map((v) => -v) : h.n);
      }
      let lastEdge = null;
      for (let i = 1; i < ns.length; i++) { if (!ns[i] || !ns[i - 1]) continue; const a = Math.acos(Math.max(-1, Math.min(1, dot(ns[i], ns[i - 1])))) * 180 / Math.PI; if (a > 0.01) { kinks.push(a); if (lastEdge !== null) spacing.push((i - lastEdge) * 0.25); lastEdge = i; } }
      const ok = hs.every((x) => x !== null); if (!ok || !spacing.length) continue;
      const med = pct(spacing, 0.5), d2 = (xs) => xs.slice(1, -1).map((x, i) => (xs[i] - 2 * x + xs[i + 2]) / 0.0625);
      const raw = d2(hs), low = d2(gauss(hs, med / 0.25)), e = (xs) => xs.reduce((a, x) => a + x * x, 0), er = e(raw);
      if (er > 0) shares.push(1 - e(low) / er);
    }
    rows.push({ n, tris: T.length, lapM: Math.round(L), samples, miss, edgeSpacingM: { p10: pct(spacing, 0.1), p50: pct(spacing, 0.5), p90: pct(spacing, 0.9) }, kinkDeg: { p50: pct(kinks, 0.5), p95: pct(kinks, 0.95) }, facetBandShare: pct(shares, 0.5) });
  } catch (e) { rows.push({ n, err: String(e && e.message || e).slice(0, 60) }); }
  process.stderr.write(`layout ${n}/${layouts.length} ${((Date.now() - t0) / 1000).toFixed(0)} s\n`);
}
const r = rows.filter((x) => x.edgeSpacingM && x.edgeSpacingM.p50 !== null);
const summary = { layouts: layouts.length, measured: r.length, edgeSpacingP50M: { min: Math.min(...r.map((x) => x.edgeSpacingM.p50)), median: pct(r.map((x) => x.edgeSpacingM.p50), 0.5), max: Math.max(...r.map((x) => x.edgeSpacingM.p50)) },
  edgeSpacingP90M: { median: pct(r.map((x) => x.edgeSpacingM.p90), 0.5), max: Math.max(...r.map((x) => x.edgeSpacingM.p90)) },
  kinkP50Deg: pct(r.map((x) => x.kinkDeg.p50), 0.5), kinkP95Deg: { median: pct(r.map((x) => x.kinkDeg.p95), 0.5), max: Math.max(...r.map((x) => x.kinkDeg.p95)) },
  facetBandShare: { min: Math.min(...r.filter((x) => x.facetBandShare !== null).map((x) => x.facetBandShare)), median: pct(r.filter((x) => x.facetBandShare !== null).map((x) => x.facetBandShare), 0.5), max: Math.max(...r.filter((x) => x.facetBandShare !== null).map((x) => x.facetBandShare)) },
  layoutsSpacingAbove8m: r.filter((x) => x.edgeSpacingM.p50 > 8).length, layoutsSpacingP90Above8m: r.filter((x) => x.edgeSpacingM.p90 > 8).length, wallS: Math.round((Date.now() - t0) / 1000) };
fs.writeFileSync(OUT, JSON.stringify({ summary, rows }, null, 1)); console.log(JSON.stringify(summary));

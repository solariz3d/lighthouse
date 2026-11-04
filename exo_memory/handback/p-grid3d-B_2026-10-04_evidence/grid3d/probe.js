// probe.js (pane B, D237): guidePlan on synthetic centrelines, independent of A's tests. (1) planted asymmetries the gap must report; (2) line counts on long tracks,
// INCLUDING a long track coiled into a small box (the ghost's dashes); (3) the gap's cost when the centre is far from every segment (its brute-force fallback).
//   node probe.js <tree>
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]) + '/', G = require(T + 'app/preview/guides.js');
const boundsOf = (pts) => { const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity]; for (const p of pts) for (let k = 0; k < 3; k++) { min[k] = Math.min(min[k], p[k]); max[k] = Math.max(max[k], p[k]); } return { min, max }; };
const pathOf = (pts, closed = true) => ({ closed, samples: pts.map((pos) => ({ pos })) });
const ellipse = (a, b, n, f = () => [0, 0]) => Array.from({ length: n }, (_, i) => { const t = (2 * Math.PI * i) / n, [dr, y] = f(t); return [(a + dr) * Math.cos(t), y, (b + dr) * Math.sin(t)]; });
const gap = (pts, mirror, centre = null) => { const p = G.guidePlan({ bounds: boundsOf(pts), path: pathOf(pts), mode: 'off', mirror, centre }); return p && p.gap ? { max: +p.gap.max.toFixed(3), mean: +p.gap.mean.toFixed(3) } : null; };
const out = { asym: {}, bounded: {}, far: {} };
// (1) asymmetries. The base: an exact ellipse 200 x 100 m, 4,000 points (chord about 0.08 m): every mirror about its own centre reads ~0.
const base = ellipse(200, 100, 4000);
out.asym.ellipse = { x: gap(base, 'x'), z: gap(base, 'z'), both: gap(base, 'both') };
// a 5 m OUTWARD bump on ONE side only (t in 0.3..0.5 rad, a smooth bump of peak 5 m): every mirror should read about 5 m largest
const bump = ellipse(200, 100, 4000, (t) => [t > 0.3 && t < 0.5 ? 5 * Math.sin(Math.PI * (t - 0.3) / 0.2) ** 2 : 0, 0]);
out.asym.bump5m = { x: gap(bump, 'x'), z: gap(bump, 'z'), both: gap(bump, 'both') };
// a HEIGHT step: the x > 0 half 3 m higher (smooth over 20 m of x): left/right must read ~3 m, front/back ~0 (z flips keep x's sign)
const step = base.map(([x, , z]) => [x, 3 / (1 + Math.exp(-x / 4)), z]);
out.asym.height3m = { x: gap(step, 'x'), z: gap(step, 'z'), both: gap(step, 'both') };
// the centre 7 m off in x: left/right must read 14 m
out.asym.centreOff7 = { x: gap(base, 'x', { x: 7, z: 0 }), z: gap(base, 'z', { x: 7, z: 0 }) };
// (2) counts. A 14 km loop in a big box, a 14 km spiral COILED into a ~300 m box, and a 40 km coil.
const coil = (lengthM, rMax, n) => { const pts = []; const turns = lengthM / (Math.PI * rMax); for (let i = 0; i < n; i++) { const u = i / (n - 1), th = 2 * Math.PI * turns * u, r = 10 + (rMax - 10) * u; pts.push([r * Math.cos(th), 0, r * Math.sin(th)]); } return pts; };
const count = (pts, mode, mirror, closed) => { const t0 = process.hrtime.bigint(); const p = G.guidePlan({ bounds: boundsOf(pts), path: pathOf(pts, closed), mode, mirror }); const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  const over = p.over.reduce((a, l) => a + l.positions.length / 6, 0), depth = p.depth.reduce((a, l) => a + l.positions.length / 6, 0); return { lines: p.lines, depth, ghostLines: over, ms: +ms.toFixed(1) }; };
const big = ellipse(3000, 1500, 7000).map(([x, , z], i) => [x, 40 * Math.sin(i / 300), z]);
out.bounded.loop14kmBigBox = { lattice: count(big, '3d', 'off', true), latticeMirror: count(big, '3d', 'both', true) };
const c14 = coil(14000, 150, 7000).map(([x, , z], i) => [x, 30 * Math.sin(i / 200), z]), c40 = coil(40000, 150, 20000).map(([x, , z], i) => [x, 30 * Math.sin(i / 200), z]);
out.bounded.coil14kmIn300mBox = { lattice: count(c14, '3d', 'off', false), latticeMirror: count(c14, '3d', 'both', false) };
out.bounded.coil40kmIn300mBox = { lattice: count(c40, '3d', 'off', false), latticeMirror: count(c40, '3d', 'both', false) };
// (3) the centre FAR from every segment (dragged 2 km away): every query falls back to all segments
const timeGap = (pts, centre) => { const t0 = process.hrtime.bigint(); const p = G.guidePlan({ bounds: boundsOf(pts), path: pathOf(pts), mode: 'off', mirror: 'both', centre }); return { ms: +(Number(process.hrtime.bigint() - t0) / 1e6).toFixed(1), max: +p.gap.max.toFixed(1) }; };
out.far.loop7000_centreAtMiddle = timeGap(big, null);
out.far.loop7000_centre2kmAway = timeGap(big, { x: 5000, z: 5000 });
out.far.coil20000_centre2kmAway = timeGap(c40, { x: 2000, z: 2000 });
console.log(JSON.stringify(out, null, 1));

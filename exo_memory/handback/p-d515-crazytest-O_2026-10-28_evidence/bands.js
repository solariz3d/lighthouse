// bands.js (D515, O): per load band, the body height over the wheel centres (h), the rigid-tyre box clearance (h + 0.345) and the box over the
// MESH (the body's own distance to the surface along its normal, minus 0.05); and where the median h crosses the plateau and the clip line.
'use strict';
const fs = require('fs');
const [hdr, ...lines] = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n'); const cols = hdr.split(',');
const R = lines.map((l) => { const v = l.split(','); const o = {}; cols.forEach((c, i) => { o[c] = v[i] === '' ? NaN : +v[i]; }); return o; });
const q = (a, p) => { const s = a.filter(Number.isFinite).sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))] : NaN; };
const f = (x, d = 1) => (Number.isFinite(x) ? x.toFixed(d) : '-');
console.log('load band (g)   frames   h p50 (cm)   rigid-tyre box clearance p50 / min (cm)   box over the mesh p50 / min (cm)   tyre squash implied p50 (cm)');
const B = [[0, 1.5], [1.5, 5], [5, 10], [10, 15], [15, 20], [20, 25], [25, 30], [30, 35], [35, 40], [40, 45], [45, 50], [50, 53], [53, 56], [56, 58], [58, 60], [60, 62], [62, 64]];
for (const [lo, hi] of B) { const b = R.filter((r) => r.load >= lo && r.load < hi); if (b.length < 3) continue;
  const h = b.map((r) => r.h * 100), c = b.map((r) => (r.h + 0.345) * 100), m = b.map((r) => r.boxOverMesh * 100), sq = b.map((r) => (r.h + 0.345 - r.boxOverMesh) * 100);
  console.log(`${String(lo).padStart(3)}-${String(hi).padEnd(3)}  ${String(b.length).padStart(7)}   ${f(q(h, .5)).padStart(8)}     ${f(q(c, .5)).padStart(8)} / ${f(Math.min(...c)).padStart(6)}                    ${f(q(m, .5)).padStart(7)} / ${f(Math.min(...m.filter(Number.isFinite))).padStart(6)}            ${f(q(sq, .5)).padStart(6)}`); }
// the first sustained crossing: the load at which frames start going under, by 1 g bins
for (const [name, test] of [['rigid-tyre box under the road', (r) => r.h + 0.345 < 0], ['box under the mesh surface', (r) => r.boxOverMesh < 0], ['past the plateau (h < -21 cm)', (r) => r.h < -0.21]]) {
  const bins = []; for (let g = 30; g < 64; g++) { const b = R.filter((r) => r.load >= g && r.load < g + 1); if (b.length >= 5) bins.push([g, b.filter(test).length / b.length, b.length]); }
  const first = bins.find(([, share]) => share >= 0.5); console.log(`${name}: half the frames or more from ${first ? first[0] + ' g' : 'never'}; shares by 1 g bin from 40 g: ${bins.filter(([g]) => g >= 40).map(([g, s, n]) => `${g}:${(s * 100).toFixed(0)}%(${n})`).join(' ')}`);
}

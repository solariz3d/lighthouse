// peaks.js (D515, O): read table.csv: the mapping's check, the runs, the top ten load frames and the closest to clipping, each with its geometry.
'use strict';
const fs = require('fs');
const [hdr, ...lines] = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n'); const cols = hdr.split(',');
const R = lines.map((l) => { const v = l.split(','); const o = {}; cols.forEach((c, i) => { o[c] = v[i] === '' ? NaN : +v[i]; }); return o; });
const q = (a, p) => { const s = a.filter(Number.isFinite).sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))]; };
const f = (x, d = 1) => (Number.isFinite(x) ? x.toFixed(d) : '-');
console.log(`rows ${R.length}, t ${f(R[0].t, 2)}-${f(R[R.length - 1].t, 2)} s`);
// the mapping: off the line by how far
console.log(`distance from the AI line (m): p50 ${f(q(R.map((r) => r.d), .5), 2)} p90 ${f(q(R.map((r) => r.d), .9), 2)} p99 ${f(q(R.map((r) => r.d), .99), 2)} max ${f(Math.max(...R.map((r) => r.d)), 2)}`);
// predicted (line curvature + gravity at that speed) against measured load, above 600 km/h
const hi = R.filter((r) => r.kph > 600 && Number.isFinite(r.predLoad)); const err = hi.map((r) => r.load - r.predLoad);
const corr = (() => { const x = hi.map((r) => r.predLoad), y = hi.map((r) => r.load), mx = x.reduce((a, b) => a + b) / x.length, my = y.reduce((a, b) => a + b) / y.length; let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < x.length; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; } return sxy / Math.sqrt(sxx * syy); })();
console.log(`predicted vs measured load above 600 km/h: ${hi.length} frames, r ${corr.toFixed(3)}, measured − predicted p10 ${f(q(err, .1), 2)} p50 ${f(q(err, .5), 2)} p90 ${f(q(err, .9), 2)} g`);
// runs: a jump in s backwards or a gap in t
let runs = [], cur = null; for (const r of R) { if (!cur || r.t - cur.t1 > 0.5 || r.s < cur.s1 - 50) runs.push(cur = { t0: r.t, s0: r.s, t1: r.t, s1: r.s, max: r.load, vmax: r.kph }); else { cur.t1 = r.t; cur.s1 = r.s; cur.max = Math.max(cur.max, r.load); cur.vmax = Math.max(cur.vmax, r.kph); } }
console.log('runs (t, s, peak load, top speed):'); for (const u of runs) if (u.t1 - u.t0 > 1) console.log(`  t ${f(u.t0, 2)}-${f(u.t1, 2)} s   s ${f(u.s0, 0)}-${f(u.s1, 0)} m   peak ${f(u.max, 2)} g   top ${f(u.vmax, 0)} km/h`);
const row = (r) => `t ${f(r.t, 2).padStart(6)}  s ${f(r.s, 0).padStart(6)}  p${Number.isFinite(r.piece) ? r.piece : '?'}  ${f(r.kph, 0)} km/h  load ${f(r.load, 2)} g (line asks ${f(r.predLoad, 1)})  lat ${f(r.latg, 2)} g  h ${f(r.h * 100, 1)} cm  box ${f(-r.depth * 100, 1)} cm over road (rigid tyres), ${f(r.boxOverMesh * 100, 1)} cm over the mesh  | bank ${f(r.bank, 0)}°  climb ${f(r.climb, 1)}°  R ${f(r.R, 0)} m  κn ${f(r.kn * 1000, 2)}/km  κg ${f(r.kg * 1000, 2)}/km  cup ${f(r.cupL, 0)}/${f(r.cupR, 0)}°  off ${f(r.off, 1)} m  width ${f(r.width, 0)} m`;
const distinct = (list, gap = 0.6) => { const out = []; for (const r of list) { if (out.some((o) => Math.abs(o.t - r.t) < gap)) continue; out.push(r); if (out.length === 10) break; } return out; };
console.log('\nthe ten hardest load frames (at least 0.6 s apart):'); for (const r of distinct([...R].sort((a, b) => b.load - a.load))) console.log('  ' + row(r));
console.log('\nthe ten closest to clipping (lowest box over the road with rigid tyres, at least 0.6 s apart):'); for (const r of distinct([...R].sort((a, b) => a.h - b.h))) console.log('  ' + row(r));
// the sustained episode
const deep = R.filter((r) => r.depth > 0); console.log(`\nframes with the box below the road (rigid tyres): ${deep.length}, t ${f(Math.min(...deep.map((r) => r.t)), 2)}-${f(Math.max(...deep.map((r) => r.t)), 2)} s, s ${f(Math.min(...deep.map((r) => r.s)), 0)}-${f(Math.max(...deep.map((r) => r.s)), 0)} m, load p10 ${f(q(deep.map((r) => r.load), .1), 1)} p50 ${f(q(deep.map((r) => r.load), .5), 1)} max ${f(Math.max(...deep.map((r) => r.load)), 1)} g, pieces ${[...new Set(deep.map((r) => r.piece))].join(' ')}`);
const mesh = R.filter((r) => Number.isFinite(r.boxOverMesh)); console.log(`box over the MESH surface along the car's normal: p0.1 ${f(q(mesh.map((r) => r.boxOverMesh), .001) * 100, 1)} cm, min ${f(Math.min(...mesh.map((r) => r.boxOverMesh)) * 100, 1)} cm, frames below 0: ${mesh.filter((r) => r.boxOverMesh < 0).length} of ${mesh.length}`);
// load bands against h (the bottoming curve) and time above thresholds
for (const th of [20, 40, 50, 55, 60]) { const n = R.filter((r) => r.load >= th).length; console.log(`time at ≥ ${th} g: ${n} frames = ${(n * 0.015).toFixed(2)} s`); }
// per piece: peak load, p50 at speed, worst h
console.log('\nper piece (frames above 600 km/h): frames, load p50 / max, h min, bank / climb / R / κn range, cup');
const pcs = [...new Set(R.map((r) => r.piece))].filter(Number.isFinite).sort((a, b) => a - b);
for (const p of pcs) { const b = R.filter((r) => r.piece === p && r.kph > 600); if (!b.length) continue; const rng = (k, s = 1, d = 0) => `${f(Math.min(...b.map((r) => r[k])) * s, d)}..${f(Math.max(...b.map((r) => r[k])) * s, d)}`;
  console.log(`  p${p}: ${b.length}, ${f(q(b.map((r) => r.load), .5), 1)} / ${f(Math.max(...b.map((r) => r.load)), 1)} g, h min ${f(Math.min(...b.map((r) => r.h)) * 100, 1)} cm, s ${rng('s')}  bank ${rng('bank')}°  climb ${rng('climb', 1, 1)}°  R ${rng('R')} m  κn ${rng('kn', 1000, 1)}/km  cup ${rng('cupL')}/${rng('cupR')}°`); }

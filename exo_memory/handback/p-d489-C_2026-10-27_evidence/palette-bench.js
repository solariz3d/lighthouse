// palette-bench.js (C, D489 addition): the per-frame cost on the CPU of working out the two sky colours from the time in JS (a hue turn of each token by
// 2 pi t / 600, as cycle.js's "hue turn"), so the renderer would send them as it sends uSkyA / uSkyB every frame today. node palette-bench.js
'use strict';
const A = [0.31, 1, 0.69], B = [0.67, 0.43, 1], k = 1 / Math.sqrt(3);
const turn = (c, a, o) => { const co = Math.cos(a), si = Math.sin(a), d = k * (c[0] + c[1] + c[2]) * (1 - co);
  const x = [k * (c[2] - c[1]), k * (c[0] - c[2]), k * (c[1] - c[0])];   // cross(k, c)
  for (let i = 0; i < 3; i++) o[i] = Math.min(1, Math.max(0, c[i] * co + x[i] * si + k * d / k * k)); return o; };
const oa = [0, 0, 0], ob = [0, 0, 0]; let s = 0;
const N = 5e6, t0 = process.hrtime.bigint();
for (let i = 0; i < N; i++) { const a = 2 * Math.PI * (i * 0.00694) / 600; turn(A, a, oa); turn(B, a, ob); s += oa[0] + ob[2]; }
const ns = Number(process.hrtime.bigint() - t0) / N;
console.log(`per frame (both colours): ${ns.toFixed(1)} ns = ${(ns / 1e6).toFixed(6)} ms; at 144 frames a second ${(ns * 144 / 1e6).toFixed(4)} ms of CPU each second (checksum ${s.toFixed(1)})`);

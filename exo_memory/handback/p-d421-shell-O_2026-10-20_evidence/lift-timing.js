'use strict';
// D421 (O): the height offset's lift, src/core/adapter.js offsetPath, timed on A's profile shape (p-d421-subscribers-A_2026-10-20.md §3: 50 x 200 m, a height brush r 60):
// one hill in the middle of a 10 km track, the path at the preview's 2 m step, offsetPath called 21 times, the median and the range reported. Run from the t180 worktree:  node <this> <label>
const AD = require(require('path').resolve('src/core/adapter.js'));
const D = require(require('path').resolve('src/core/document.js'));
const G = require(require('path').resolve('src/geom/index.js'));
const SC = require(require('path').resolve('src/core/sculpt.js'));
const { extend } = require(require('path').resolve('src/core/extend.js'));
let d = D.createDoc('t'); d = extend(d, { length: 200, family: 'bowl' });
for (let i = 1; i < 50; i++) d = extend(d, { length: 200, transition: 40, targets: { kh: (i % 2 ? -1 : 1) / 400 } });
const off = SC.pieceOffsets(d); d = SC.brush(d, { mode: 'hill', s0: off[25] + 100, r: 60, delta: 3 }).doc;
const segments = AD.toSegments(d), path = G.buildPath(segments, { step: 2, start: { pos: d.start.pos.slice(), theta: d.start.heading, p: d.start.pitch } });
const ms = [];
for (let k = 0; k < 21; k++) { const t = process.hrtime.bigint(); AD.offsetPath(d, segments, path); ms.push(Number(process.hrtime.bigint() - t) / 1e6); }
ms.sort((a, b) => a - b);
console.log(JSON.stringify({ label: process.argv[2] || '', km: +(path.lengthM / 1000).toFixed(2), samples: path.samples.length, median_ms: +ms[10].toFixed(2), min_ms: +ms[0].toFixed(2), max_ms: +ms[20].toFixed(2) }));

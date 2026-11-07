// sub.js <tree> <doc> <s0> <s1> <s2> <s3>: the rule on only the stations in [s0, s1] and [s2, s3] of a saved track (fast), with the stations'
// own nearest-approach measured directly: the least distance between any of the two runs' section points (road and apron), and its gap along the lower's normal
'use strict';
const fs = require('fs'), T = process.argv[2];
const D = require(T + '/src/core/document.js'), AD = require(T + '/src/core/adapter.js'), PC = require(T + '/src/validate/passclear.js');
const P = require(T + '/src/geom/profile.js');
const doc = D.parse(fs.readFileSync(process.argv[3], 'utf8')), [s0, s1, s2, s3] = process.argv.slice(4).map(Number);
const { segments, path: path0 } = AD.toPath(doc, { step: 2 }), path = AD.offsetPath(doc, segments, path0);
const samples = path.samples.filter((q) => (q.s >= s0 && q.s <= s1) || (q.s >= s2 && q.s <= s3));
const sub = { ...path, samples, closed: false };
const f = PC.passClearance(sub, segments);
console.log(`stations ${samples.length}; findings ${f.length}`);
for (const x of f.slice(0, 6)) console.log(' ', JSON.stringify({ s: x.s, u: +x.u.toFixed(2), otherS: x.otherS, otherU: +x.otherU.toFixed(2), gap: +x.gapM.toFixed(3), short: +x.shortM.toFixed(3), road: x.roadGapM === null ? null : +x.roadGapM.toFixed(3), hull: +x.hullM.toFixed(2), clip: x.clip }));
// direct: every section point of each run in world space, the closest pair across the two runs
const world = (q) => { const pr = P.normalize(segments[q.seg].profile), sec = PC._internal.sectionOf(pr, 2); return sec.pts.map((p) => ({ q: [0, 1, 2].map((c) => q.pos[c] + q.L[c] * p.X + q.U[c] * p.Y), apron: p.apron, u: p.u, s: q.s })); };
const A = samples.filter((q) => q.s <= s1).flatMap(world), B = samples.filter((q) => q.s >= s2).flatMap(world);
let best = null; for (const a of A) for (const b of B) { const d = Math.hypot(a.q[0] - b.q[0], a.q[1] - b.q[1], a.q[2] - b.q[2]); if (!best || d < best.d) best = { d, a, b }; }
console.log('closest section points:', best && JSON.stringify({ d: +best.d.toFixed(3), a: { s: best.a.s, u: +best.a.u.toFixed(1), apron: best.a.apron, y: +best.a.q[1].toFixed(2) }, b: { s: best.b.s, u: +best.b.u.toFixed(1), apron: best.b.apron, y: +best.b.q[1].toFixed(2) } }));

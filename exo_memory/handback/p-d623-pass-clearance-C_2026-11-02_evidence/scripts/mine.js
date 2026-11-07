// mine.js <tree> <doc> x y z ...: for each world point (an export vertex), the nearest of the rule's own section points (road and apron, every station), and which station / u / apron it is
'use strict';
const fs = require('fs'), T = process.argv[2];
const D = require(T + '/src/core/document.js'), AD = require(T + '/src/core/adapter.js'), PC = require(T + '/src/validate/passclear.js'), P = require(T + '/src/geom/profile.js');
const doc = D.parse(fs.readFileSync(process.argv[3], 'utf8')), nums = process.argv.slice(4).map(Number);
const { segments, path: p0 } = AD.toPath(doc, { step: 2 }), path = AD.offsetPath(doc, segments, p0), S = path.samples;
const secs = new Map(), sec = (j) => { if (!secs.has(j)) secs.set(j, PC._internal.sectionOf(P.normalize(segments[j].profile), 2)); return secs.get(j); };
for (let k = 0; k < nums.length; k += 3) {
  const w = nums.slice(k, k + 3); let best = null;
  for (const q of S) { if (Math.hypot(q.pos[0] - w[0], q.pos[2] - w[2]) > 60) continue;
    for (const p of sec(q.seg).pts) { const x = [0, 1, 2].map((c) => q.pos[c] + q.L[c] * p.X + q.U[c] * p.Y), d = Math.hypot(x[0] - w[0], x[1] - w[1], x[2] - w[2]); if (!best || d < best.d) best = { d, s: q.s, id: segments[q.seg].id, u: p.u, apron: p.apron, wv: p.w, x }; } }
  console.log(`export ${w.map((t) => t.toFixed(2))} -> mine ${best.id} s ${best.s} u ${best.u.toFixed(2)}${best.apron ? ' apron w ' + best.wv : ''} at ${best.x.map((t) => t.toFixed(2))}, ${best.d.toFixed(3)} m off`);
}

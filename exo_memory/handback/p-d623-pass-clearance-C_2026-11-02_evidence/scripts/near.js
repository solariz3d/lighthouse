// near.js <tree> <doc> <x> <z> <R>: the path's stations within R m (in x, z) of a point: per piece run, its s range and height range; and the segments' fields at one of them
'use strict';
const fs = require('fs'), T = process.argv[2];
const D = require(T + '/src/core/document.js'), AD = require(T + '/src/core/adapter.js');
const doc = D.parse(fs.readFileSync(process.argv[3], 'utf8')), [x, z, R] = process.argv.slice(4).map(Number);
const { segments, path: path0 } = AD.toPath(doc, { step: 2 }), path = AD.offsetPath(doc, segments, path0), S = path.samples;
const runs = [];
for (const q of S) { if (Math.hypot(q.pos[0] - x, q.pos[2] - z) > R) continue; const g = segments[q.seg], key = `${g.piece !== undefined ? 'p' + g.piece : g.id} seg ${q.seg} kind ${g.kind}`;
  const r = runs[runs.length - 1]; if (r && r.key === key && q.s - r.s1 < 3) { r.s1 = q.s; r.y0 = Math.min(r.y0, q.pos[1]); r.y1 = Math.max(r.y1, q.pos[1]); r.bank = q.L[1]; } else runs.push({ key, s0: q.s, s1: q.s, y0: q.pos[1], y1: q.pos[1], bank: q.L[1], g }); }
for (const r of runs) console.log(`${r.key}: s ${r.s0.toFixed(0)}..${r.s1.toFixed(0)}, y ${r.y0.toFixed(1)}..${r.y1.toFixed(1)}, L.y ${r.bank.toFixed(2)}`);
const g = runs.length ? runs[0].g : null; if (g) console.log('segment keys:', Object.keys(g).join(','), 'profile:', g.profile ? JSON.stringify({ font: g.profile.font, u: g.profile.u && [g.profile.u[0], g.profile.u[g.profile.u.length - 1]] }) : 'none');
console.log('doc edgeApronM', doc.edgeApronM);

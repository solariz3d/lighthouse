// cmpmesh.js <tree> <doc> <out.json>: build the export in node (as A's probe617.js does), flatten it, and keep the vertices of the physics road and apron
// meshes of p38 and p41 (world space) near the p38/p41 crossing, with each mesh's name; then the closest p38 x p41 vertex pairs. Read-only.
'use strict';
const fs = require('fs'), path = require('path');
const [R, DOC, OUT] = process.argv.slice(2), rq = (p) => require(path.join(R, p));
const D = rq('src/core/document.js'), A = rq('src/core/adapter.js'), FW = rq('src/export/fromwords.js'), { startLayout } = rq('app/core/coreshell.js'), AR = rq('src/export/acready.js');
const doc = D.parse(fs.readFileSync(DOC, 'utf8'));
const segs = A.toSegments(doc), lift = (q) => A.offsetPath(doc, segs, q), start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch };
const t0 = Date.now();
const b = FW.buildFromSegments(segs, { name: doc.name, via: 'cmpmesh', liftPath: lift, start, pitLane: doc.pitLane }, { markers: startLayout(segs, lift, start), test: false });
console.log('built in', ((Date.now() - t0) / 1000).toFixed(0), 's');
const flat = AR.flattenForAc(b.scene), keep = [];
(function walk(n) { if (n.type === 'mesh' && /^1ROAD(_APRON)?_p(38|41)_/.test(n.name)) { const P = n.positions; for (let i = 0; i < P.length; i += 3) { const x = P[i], y = P[i + 1], z = P[i + 2]; if (Math.hypot(x - 35, z + 474) < 60) keep.push({ m: n.name, p: [x, y, z] }); } } for (const c of n.children || []) walk(c); })(flat.root);
const a = keep.filter((k) => /_p38_/.test(k.m)), c = keep.filter((k) => /_p41_/.test(k.m));
let best = []; for (const u of a) for (const v of c) { const d = Math.hypot(u.p[0] - v.p[0], u.p[1] - v.p[1], u.p[2] - v.p[2]); if (d < 1.5) best.push({ d, u, v }); }
best.sort((x, y) => x.d - y.d);
console.log('kept', a.length, 'p38 and', c.length, 'p41 vertices; pairs under 1.5 m', best.length);
for (const x of best.slice(0, 8)) console.log(`  ${x.d.toFixed(3)}  ${x.u.m} ${x.u.p.map((t) => t.toFixed(2))}  |  ${x.v.m} ${x.v.p.map((t) => t.toFixed(2))}`);
fs.writeFileSync(OUT, JSON.stringify({ p38: a, p41: c }));

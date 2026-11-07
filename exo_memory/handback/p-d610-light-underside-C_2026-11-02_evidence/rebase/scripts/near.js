// near.js <tree> <doc> x y z: in the export with and without the light hull (TEX=1 textured, unmerged), every mesh with a vertex within 6 m of the point: name, count, nearest
'use strict';
const fs = require('fs'), path = require('path'), T = path.resolve(process.argv[2]) + '/';
const D = require(T + 'src/core/document.js'), AD = require(T + 'src/core/adapter.js'), FW = require(T + 'src/export/fromwords.js'), { startLayout } = require(T + 'app/core/coreshell.js');
const doc = D.parse(fs.readFileSync(process.argv[3], 'utf8')), segs = AD.toSegments(doc), lift = (q) => AD.offsetPath(doc, segs, q);
const start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch };
const P0 = process.argv.slice(4, 7).map(Number);
const textures = process.env.TEX ? require(T + 'app/core/textures.js').createCoreTextures({ segments: () => segs, closed: () => !!doc.closed, edge: true }).current() : undefined;
let s0 = 0; console.log('pieces', segs.length, 'closed', !!doc.closed);
for (const light of [false, true]) {
  const ex = FW.buildFromSegments(segs, { name: 'x', via: 'test', liftPath: lift, start }, { markers: startLayout(segs, lift, start, { open: !doc.closed }), test: true, lightHull: light, textures, mergeMeshes: false });
  if (!light) { console.log('lap length', ex.path.lengthM); let s = 0; ex.segments.forEach((g, i) => { if (Math.abs(s - 19649) < 200 || Math.abs(s + g.length - 19649) < 200) console.log(' seg', i, g.kind || g.type || '', 's', s.toFixed(1), '..', (s + g.length).toFixed(1)); s += g.length; }); }
  console.log(light ? 'LIGHT' : 'FULL');
  for (const m of ex.acScene.root.children) { if (m.type !== 'mesh' || !m.positions) continue; const P = m.positions; let n = 0, best = 1e9;
    for (let i = 0; i < P.length; i += 3) { const d = Math.hypot(P[i] - P0[0], P[i + 1] - P0[1], P[i + 2] - P0[2]); if (d < 6) n++; if (d < best) best = d; }
    if (n) console.log(' ', m.name, 'verts within 6 m', n, 'nearest', best.toFixed(3), 'tris', m.indices.length / 3); }
}

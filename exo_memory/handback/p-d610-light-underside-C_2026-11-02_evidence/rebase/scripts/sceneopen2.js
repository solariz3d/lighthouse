// sceneopen2.js <tree> <doc>: the light export (TEX=1 textured); the final-scene check with detail on its acScene; each open finding's edges: mesh, ends, length
'use strict';
const fs = require('fs'), path = require('path'), T = path.resolve(process.argv[2]) + '/';
const D = require(T + 'src/core/document.js'), AD = require(T + 'src/core/adapter.js'), FW = require(T + 'src/export/fromwords.js'), { startLayout } = require(T + 'app/core/coreshell.js');
const { checkFinalScene } = require(T + 'src/export/finalscene.js');
const doc = D.parse(fs.readFileSync(process.argv[3], 'utf8')), segs = AD.toSegments(doc), lift = (q) => AD.offsetPath(doc, segs, q);
const start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch };
const textures = process.env.TEX ? require(T + 'app/core/textures.js').createCoreTextures({ segments: () => segs, closed: () => !!doc.closed, edge: true }).current() : undefined;
for (const light of [false, true]) {
  const ex = FW.buildFromSegments(segs, { name: 'x', via: 'test', liftPath: lift, start }, { markers: startLayout(segs, lift, start, { open: !doc.closed }), test: true, lightHull: light, textures, mergeMeshes: false });
  const r = checkFinalScene(ex.acScene, { path: ex.path, segments: ex.segments, lane: ex.pitLane, open: !ex.path.closed, detail: true });
  const all = [...r.refuse, ...r.warn];
  console.log(light ? 'LIGHT' : 'FULL', 'refuse', r.refuse.length, 'warn', r.warn.length, all.map((f) => f.kind).join(','));
  for (const f of all.filter((x) => x.kind === 'open')) { console.log(' ', f.message); console.log('   keys', Object.keys(f).join(','), JSON.stringify(f.at || f.edges || null).slice(0, 600)); }
  if (r.detail) console.log(' detail keys', Object.keys(r.detail));
  fs.writeFileSync(`sceneopen2-${light ? 'light' : 'full'}.json`, JSON.stringify(r, (k, v) => (v && v.buffer instanceof ArrayBuffer ? Array.from(v) : v)).slice(0, 5e6));
}

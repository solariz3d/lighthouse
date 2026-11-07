// skinsha.js <tree>: sha256 of the light hull fixture's UNDERSKIN meshes (positions, normals, uvs, indices), textured and untextured: for telling an equivalent mutant
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), T = path.resolve(process.argv[2]), R_ = (p) => require(path.join(T, p));
const D = R_('src/core/document.js'), A = R_('src/core/adapter.js'), FW = R_('src/export/fromwords.js'), { startLayout } = R_('app/core/coreshell.js'), { createCoreTextures } = R_('app/core/textures.js');
const doc = D.parse(fs.readFileSync(path.join(T, 'test/fixtures/light-hull-2026-11-02.t180track'), 'utf8')), segs = A.toSegments(doc), lift = (q) => A.offsetPath(doc, segs, q);
const start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch }, out = [];
for (const textured of [true, false]) {
  const textures = textured ? createCoreTextures({ segments: () => segs, closed: () => false, edge: true }).current() : undefined;
  const ex = FW.buildFromSegments(segs, { name: 'light hull', via: 'test', liftPath: lift, start }, { markers: startLayout(segs, lift, start, { open: true }), test: true, textures });
  const h = crypto.createHash('sha256');
  for (const m of ex.acScene.root.children) if (m.type === 'mesh' && /^UNDERSKIN_/.test(m.name)) for (const X of [m.positions, m.normals, m.uvs, m.indices]) h.update(Buffer.from(X.buffer, X.byteOffset, X.byteLength));
  out.push(h.digest('hex').slice(0, 16));
}
console.log('SKINSHA', out.join(' '));

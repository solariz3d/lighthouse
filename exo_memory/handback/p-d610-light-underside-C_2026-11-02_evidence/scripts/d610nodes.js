// d610nodes.js <tree> <out.json>: F1 F2 built as test/fixtures/fixtures.js digests() builds them (buildFromSegments, via 'fixture', no textures), each kn5's sha256, bytes
// and its nodes (the tree's own test/fixtures/kn5nodes.js)
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), T = path.resolve(process.argv[2]) + '/';
const D = require(T + 'src/core/document.js'), AD = require(T + 'src/core/adapter.js'), FW = require(T + 'src/export/fromwords.js'), { startLayout } = require(T + 'app/core/coreshell.js');
const { kn5Nodes } = require(T + 'test/fixtures/kn5nodes.js');
const out = {};
for (const k of ['F1-bowl-default-lap-closed', 'F2-halfpipe-default-lap-closed']) {
  const doc = D.parse(fs.readFileSync(T + `test/fixtures/${k}.core2.json`, 'utf8')), segs = AD.toSegments(doc), lift = (q) => AD.offsetPath(doc, segs, q);
  const start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch };
  const ex = FW.buildFromSegments(segs, { name: 'fixture', via: 'fixture', liftPath: lift, start }, { markers: startLayout(segs, lift, start) });
  const kn5 = Buffer.from(ex.kn5.buffer ? Buffer.from(ex.kn5.buffer, ex.kn5.byteOffset, ex.kn5.byteLength) : ex.kn5);
  out[k] = { kn5: crypto.createHash('sha256').update(kn5).digest('hex'), kn5Bytes: kn5.length, ...kn5Nodes(kn5) };
  let skin = 0; for (const m of ex.acScene.root.children) if (m.type === 'mesh' && /^UNDERSKIN_/.test(m.name)) skin += m.indices.length / 3;
  console.log(k, out[k].kn5.slice(0, 16), out[k].kn5Bytes, 'meshes', out[k].meshes.length, 'underside tris', skin);
}
fs.writeFileSync(process.argv[3], JSON.stringify(out));

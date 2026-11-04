// D243a (pane E): the TEST export of an unfinished core document, as the page's "Test export (unfinished)" button does it (coreshell exportTo with
// { test: true }: toSegments, the lift, startLayout on an OPEN path, the default asphalt texture set, fromwords.exportSegments with test: true).
//   node testexport.js <t180 tree with D243a> <document .t180track> <out dir>
// Writes ONE folder t180b_<name>_test into <out dir>; refuses (NOT_OURS) if a folder of that name exists without the builder's marker file.
'use strict';
const path = require('path'), fs = require('fs');
const [, , TREE, DOC, OUT] = process.argv, T = path.resolve(TREE) + '/', req = (m) => require(T + m);
const D = req('src/core/document.js'), AD = req('src/core/adapter.js'), FW = req('src/export/fromwords.js'), { startLayout } = req('app/core/coreshell.js'), { createCoreTextures } = req('app/core/textures.js');
const d = D.parse(fs.readFileSync(DOC, 'utf8')), segs = AD.toSegments(d), lift = (q) => AD.offsetPath(d, segs, q), start = { pos: d.start.pos.slice(), theta: d.start.heading, p: d.start.pitch };
const r = FW.exportSegments(segs, { name: d.name, description: 'Built from equations by t180-track-builder.', via: 'src/core/adapter.js toSegments', liftPath: lift, start },
  { outDir: OUT, variant: 'block', textures: createCoreTextures({ segments: () => segs }).current(), markers: startLayout(segs, lift, start, { open: !d.closed }), test: true });
console.log(JSON.stringify({ folders: r.folders.map((f) => ({ dir: f.dir, files: f.files })), warnings: r.warnings }, null, 1));

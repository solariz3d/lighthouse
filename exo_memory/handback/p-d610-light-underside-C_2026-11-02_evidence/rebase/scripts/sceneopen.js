// sceneopen.js <tree> <doc>: the export with and without the light hull (textured when TEX=1), then the final-scene check (src/export/finalscene.js) with detail
// on each acScene; prints every finding of the light one that the full one lacks, with where it is.
'use strict';
const fs = require('fs'), path = require('path');
const T = path.resolve(process.argv[2]) + '/';
const D = require(T + 'src/core/document.js'), AD = require(T + 'src/core/adapter.js'), FW = require(T + 'src/export/fromwords.js'), { startLayout } = require(T + 'app/core/coreshell.js');
const { checkFinalScene } = require(T + 'src/export/finalscene.js');
const doc = D.parse(fs.readFileSync(process.argv[3], 'utf8')), segs = AD.toSegments(doc), lift = (q) => AD.offsetPath(doc, segs, q);
const start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch };
const textures = process.env.TEX ? require(T + 'app/core/textures.js').createCoreTextures({ segments: () => segs, closed: () => !!doc.closed, edge: true }).current() : undefined;
const one = (light) => {
  const ex = FW.buildFromSegments(segs, { name: 'x', via: 'test', liftPath: lift, start }, { markers: startLayout(segs, lift, start, { open: !doc.closed }), test: true, lightHull: light, textures });
  const r = ex.sceneCheck; console.log(light ? 'light' : 'full', 'in-export: refuse', r.refuse.length, 'warn', r.warn.map((w) => w.kind).join(','));
  for (const w of r.warn) console.log('  ', w.kind, w.message);
  return ex;
};
one(false); one(true);

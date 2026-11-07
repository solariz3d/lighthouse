// texkn5.js: the fixture exported through the test route WITH the page's asphalt textures (as O's tubetex.js), kn5 to <out>. node texkn5.js <tree> <out.kn5>
'use strict';
const fs = require('fs'), path = require('path');
const [, , T, OUT] = process.argv, R = (p) => require(path.join(T, p));
const D = R('src/core/document.js'), A = R('src/core/adapter.js'), FW = R('src/export/fromwords.js'), { startLayout } = R('app/core/coreshell.js'), { createCoreTextures } = R('app/core/textures.js');
const doc = D.parse(fs.readFileSync(path.join(T, 'test/fixtures/tube-cases-2026-11-02.t180track'), 'utf8')), segs = A.toSegments(doc), lift = (q) => A.offsetPath(doc, segs, q);
const start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch };
const textures = createCoreTextures({ segments: () => segs, closed: () => false, edge: true }).current();
const ex = FW.buildFromSegments(segs, { name: 'tube cases', via: 'test', liftPath: lift, start }, { markers: startLayout(segs, lift, start, { open: true }), test: true, textures });
fs.writeFileSync(OUT, ex.kn5); console.log('written', OUT, ex.kn5.length);

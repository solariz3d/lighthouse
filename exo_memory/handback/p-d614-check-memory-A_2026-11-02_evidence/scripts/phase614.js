// phase614.js <repo> <doc> <check module path>: export as diag.js does, then run the given check module on the welded scene (with --expose-gc it prints
// the live heap after each phase, if the module has PH lines)
'use strict';
require('./winhide.js');
const fs = require('fs'), path = require('path');
const [, , REPO, DOCF, CHK] = process.argv;
const rq = (p) => require(path.join(REPO, p));
const FS0 = rq('src/export/finalscene.js'); FS0.checkFinalScene = () => ({ refuse: [], warn: [] });   // the export's own check is not run here
const D = rq('src/core/document.js'), A = rq('src/core/adapter.js'), FW = rq('src/export/fromwords.js'), AR = rq('src/export/acready.js');
const { startLayout } = rq('app/core/coreshell.js');
const doc = D.parse(fs.readFileSync(DOCF, 'utf8'));
const segs = A.toSegments(doc), lift = (q) => A.offsetPath(doc, segs, q), start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch };
const textures = rq('app/core/textures.js').createCoreTextures({ segments: () => segs, closed: () => !!doc.closed, kind: 'asphalt', edge: false }).current();
const test = !doc.closed;
const b = FW.buildFromSegments(segs, { name: doc.name, via: 'd614 phase', liftPath: lift, start, pitLane: doc.pitLane }, { markers: startLayout(segs, lift, start, test ? { open: true } : undefined), textures, test });
const welded = (AR.weldApronJoints || ((x) => x))(AR.weldSeams(AR.flattenForAc(b.scene)));
const t0 = Date.now(), r = require(path.resolve(CHK)).checkFinalScene(welded, { path: b.path, segments: b.segments, lane: b.pitLane, open: test });
console.log(`check ${((Date.now() - t0) / 1000).toFixed(1)} s refuse ${r.refuse.length} warn ${r.warn.length}`);

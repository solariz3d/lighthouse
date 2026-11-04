// pathsplit.js <repo> <doc>: retained heap of the parts of a path, by building them one at a time: segments, buildPath at step 2, offsetPath of it (the lift),
// then the track model's update (path-only geom), each held. node --expose-gc.
'use strict';
const fs = require('fs'), path = require('path'), v8 = require('v8');
const [, , REPO, DOCF] = process.argv;
const rq = (p) => require(path.join(REPO, p));
const MB = (b) => (b / 1048576).toFixed(1);
const used = () => { global.gc(); global.gc(); return v8.getHeapStatistics().used_heap_size; };
const D = rq('src/core/document.js'), AD = rq('src/core/adapter.js'), G = rq('src/geom/index.js');
const { createTrackModel } = rq('app/preview/trackmodel.js');
let { PATH_ONLY } = rq('app/validate-ui/checkjob.js');
if (process.env.FIX === '1') { const em = PATH_ONLY.buildMesh; PATH_ONLY = { ...PATH_ONLY, buildMeshSteps: function* () { return em(); }, extendMeshSteps: function* (m) { return m; }, reuseMeshSteps: function* () { return em(); } }; }
const doc = D.parse(fs.readFileSync(DOCF, 'utf8')); const keep = [];
let h0 = used(), h, t;
const segments = AD.toSegments(doc, { cache: new WeakMap() }); keep.push(segments);
h = used(); console.log(`segments ${segments.length}: +${MB(h - h0)} MB`); h0 = h;
const start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch };
t = Date.now(); const p = G.buildPath(segments, { step: 2, closed: !!doc.closed, start }); keep.push(p);
h = used(); console.log(`buildPath step 2 (${p.samples.length} samples, ${Date.now() - t} ms): +${MB(h - h0)} MB`); h0 = h;
for (const sm of p.samples) sm.pos; h = used(); console.log(`  every sample read once (placed views cached): +${MB(h - h0)} MB`); h0 = h;
t = Date.now(); const lifted = AD.offsetPath(doc, segments, p); keep.push(lifted);
h = used(); console.log(`offsetPath (${lifted === p ? 'same path' : 'a new path'}, ${Date.now() - t} ms): +${MB(h - h0)} MB`); h0 = h;
const model = createTrackModel({ geom: PATH_ONLY }); const tr = model.update(Object.freeze({ segments, closed: !!doc.closed, start, lift: (q) => AD.offsetPath(doc, segments, q) })); keep.push(model, tr);
h = used(); console.log(`track model update, path only: +${MB(h - h0)} MB`); h0 = h;
const s0 = lifted.samples[10]; console.log('a lifted sample: ' + (s0.constructor && s0.constructor.name) + ' ' + Object.keys(s0).join(','));
global.keep = keep;

// snapagg.js <repo> <doc> <npieces>: the path of the document's first n pieces (open), held, then a heap snapshot aggregated by (type, name): self size
// and count, the top 25. Shows which objects a path station costs. node --expose-gc.
'use strict';
const fs = require('fs'), path = require('path'), v8 = require('v8');
const [, , REPO, DOCF, N = '2'] = process.argv;
const rq = (p) => require(path.join(REPO, p));
const D = rq('src/core/document.js'), AD = rq('src/core/adapter.js');
const { createTrackModel } = rq('app/preview/trackmodel.js');
const { PATH_ONLY } = rq('app/validate-ui/checkjob.js');
const full = JSON.parse(fs.readFileSync(DOCF, 'utf8'));
const doc = D.parse(JSON.stringify({ ...full, closed: false, pitLane: undefined, spawns: undefined, pieces: full.pieces.slice(0, +N) }));
const segments = AD.toSegments(doc, { cache: new WeakMap() });
const resolved = Object.freeze({ segments, closed: false, start: { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch }, lift: (p) => AD.offsetPath(doc, segments, p) });
const MODE = process.env.MODE || 'path';
const model = createTrackModel(MODE === 'path' ? { geom: PATH_ONLY } : {}); const track = model.update(resolved);
global.keep = { model, track, segments };
global.gc();
const file = v8.writeHeapSnapshot(path.join(__dirname, 'snap.heapsnapshot'));
const s = JSON.parse(fs.readFileSync(file, 'utf8')); fs.unlinkSync(file);
const m = s.snapshot.meta, F = m.node_fields.length, ti = m.node_fields.indexOf('type'), ni = m.node_fields.indexOf('name'), si = m.node_fields.indexOf('self_size');
const types = m.node_types[0], agg = new Map(); let total = 0;
for (let i = 0; i < s.nodes.length; i += F) {
  const t = types[s.nodes[i + ti]], name = s.strings[s.nodes[i + ni]], sz = s.nodes[i + si];
  const k = `${t} ${t === 'string' || t === 'concatenated string' ? '' : String(name).slice(0, 60)}`; const a = agg.get(k) || [0, 0]; a[0] += sz; a[1]++; agg.set(k, a); total += sz;
}
console.log(`samples ${track.path.samples.length}, segments ${segments.length}, total self ${(total / 1048576).toFixed(1)} MB (${MODE})`);
for (const [k, [sz, n]] of [...agg].sort((a, b) => b[1][0] - a[1][0]).slice(0, 25)) console.log(`${(sz / 1048576).toFixed(2).padStart(8)} MB ${String(n).padStart(9)}  ${(sz / track.path.samples.length).toFixed(0).padStart(7)} B/station  ${k}`);

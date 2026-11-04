// snapstr.js: as snapagg.js, but the strings: the commonest prefixes (first 50 chars) of string nodes, with count and self size.
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
const model = createTrackModel({ geom: PATH_ONLY }); const track = model.update(resolved);
global.keep = { model, track, segments }; global.gc();
const file = v8.writeHeapSnapshot(path.join(__dirname, 'snap2.heapsnapshot'));
const s = JSON.parse(fs.readFileSync(file, 'utf8')); fs.unlinkSync(file);
const m = s.snapshot.meta, F = m.node_fields.length, ti = m.node_fields.indexOf('type'), ni = m.node_fields.indexOf('name'), si = m.node_fields.indexOf('self_size');
const types = m.node_types[0], agg = new Map();
for (let i = 0; i < s.nodes.length; i += F) {
  const t = types[s.nodes[i + ti]]; if (t !== 'string' && t !== 'concatenated string') continue;
  const k = `${t[0]} ${String(s.strings[s.nodes[i + ni]]).slice(0, 50)}`, a = agg.get(k) || [0, 0]; a[0] += s.nodes[i + si]; a[1]++; agg.set(k, a);
}
for (const [k, [sz, n]] of [...agg].sort((a, b) => b[1][0] - a[1][0]).slice(0, 20)) console.log(`${(sz / 1048576).toFixed(2).padStart(7)} MB ${String(n).padStart(8)}  ${JSON.stringify(k)}`);

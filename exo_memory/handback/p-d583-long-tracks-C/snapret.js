// snapret.js: as snapstr.js, but WHO HOLDS the ropes: for each concatenated string not held by another rope (a rope's root), its holders' (type name, edge
// name) and, one more step up, their holders; aggregated by count and the rope roots' total length.
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
const STAGE = process.env.STAGE || 'model';
let model = null, track = null;
if (STAGE === 'model') { const resolved = Object.freeze({ segments, closed: false, start: { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch }, lift: (p) => AD.offsetPath(doc, segments, p) }); model = createTrackModel({ geom: PATH_ONLY }); track = model.update(resolved); }
global.keep = { model, track, segments }; global.gc();
const file = v8.writeHeapSnapshot(path.join(__dirname, 'snap3.heapsnapshot'));
const s = JSON.parse(fs.readFileSync(file, 'utf8')); fs.unlinkSync(file);
const m = s.snapshot.meta, F = m.node_fields.length, E = m.edge_fields.length;
const ti = m.node_fields.indexOf('type'), ni = m.node_fields.indexOf('name'), si = m.node_fields.indexOf('self_size'), eci = m.node_fields.indexOf('edge_count');
const eti = m.edge_fields.indexOf('type'), eni = m.edge_fields.indexOf('name_or_index'), toi = m.edge_fields.indexOf('to_node');
const types = m.node_types[0], etypes = m.edge_types[0], nN = s.nodes.length / F;
const parents = Array.from({ length: nN }, () => []);
let e = 0;
for (let n = 0; n < nN; n++) { const c = s.nodes[n * F + eci]; for (let k = 0; k < c; k++, e += E) { const to = s.edges[e + toi] / F, et = etypes[s.edges[e + eti]]; if (et === 'weak') continue; const nm = et === 'element' || et === 'hidden' ? `[${et}]` : s.strings[s.edges[e + eni]]; parents[to].push([n, nm]); } }
const T = (n) => types[s.nodes[n * F + ti]], NM = (n) => String(s.strings[s.nodes[n * F + ni]]).slice(0, 50);
const agg = new Map(); let roots = 0;
for (let n = 0; n < nN; n++) {
  if (T(n) !== 'concatenated string') continue;
  if (parents[n].some(([p]) => T(p) === 'concatenated string')) continue;
  roots++;
  for (const [p, en] of parents[n].slice(0, 2)) {
    const up = parents[p].slice(0, 1).map(([q, qn]) => `${T(q)}:${NM(q)}.${qn}`).join('|');
    const k = `${T(p)}:${NM(p)} .${en}  <- ${up}`; agg.set(k, (agg.get(k) || 0) + 1);
  }
}
console.log(`stage ${STAGE}: rope roots ${roots}`);
for (const [k, c] of [...agg].sort((a, b) => b[1] - a[1]).slice(0, 15)) console.log(String(c).padStart(7), k);

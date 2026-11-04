// snapta.js <repo> <doc> <npieces>: path-only track model of the first n pieces; which holders keep the big things: for Float64Array/Float32Array/Array nodes,
// aggregated by (holder type:name . edge) two levels up, with counts and self sizes of the held node.
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
let model = null, tr = null;
if (process.env.STAGE !== 'segments') { model = createTrackModel({ geom: PATH_ONLY }); tr = model.update(resolved); }
global.keep = { model, tr, segments }; global.gc();
const file = v8.writeHeapSnapshot(path.join(__dirname, 'snap5.heapsnapshot'));
const s = JSON.parse(fs.readFileSync(file, 'utf8')); fs.unlinkSync(file);
const m = s.snapshot.meta, F = m.node_fields.length, E = m.edge_fields.length;
const ti = m.node_fields.indexOf('type'), ni = m.node_fields.indexOf('name'), si = m.node_fields.indexOf('self_size'), eci = m.node_fields.indexOf('edge_count');
const eti = m.edge_fields.indexOf('type'), eni = m.edge_fields.indexOf('name_or_index'), toi = m.edge_fields.indexOf('to_node');
const types = m.node_types[0], etypes = m.edge_types[0], nN = s.nodes.length / F;
const parents = Array.from({ length: nN }, () => []);
{ let e = 0; for (let n = 0; n < nN; n++) { const c = s.nodes[n * F + eci]; for (let k = 0; k < c; k++, e += E) { const et = etypes[s.edges[e + eti]]; if (et === 'weak') continue; parents[s.edges[e + toi] / F].push([n, et === 'element' ? '[i]' : et === 'hidden' || et === 'internal' ? `<${s.strings[s.edges[e + eni]] || et}>` : s.strings[s.edges[e + eni]]]); } } }
const T = (n) => types[s.nodes[n * F + ti]], NM = (n) => String(s.strings[s.nodes[n * F + ni]]).slice(0, 28), SZ = (n) => s.nodes[n * F + si];
// the retained-ish size of the stuff under a held object: self + its own element/property children that are only held by it, one level
const agg = new Map(); let total = 0;
for (let n = 0; n < nN; n++) {
  const t = T(n), nm = NM(n);
  if (!(t === 'native' || (t === 'object' && /Float|Array$|^Object$/.test(nm)) || t === 'array' || t === 'number')) continue;
  const chain = []; let x = n;
  for (let d = 0; d < 4 && parents[x].length; d++) { const [p, en] = parents[x][0]; chain.push(`${T(p) === 'object' ? NM(p) : T(p)}.${en}`); x = p; }
  const k = `${t === 'object' ? nm : t}  <-  ${chain.join(' <- ')}`; const a = agg.get(k) || [0, 0]; a[0] += SZ(n); a[1]++; agg.set(k, a); total += SZ(n);
}
console.log(`total of these ${(total / 1048576).toFixed(1)} MB (${process.env.STAGE || 'model'})`);
for (const [k, [sz, c]] of [...agg].sort((a, b) => b[1][0] - a[1][0]).slice(0, 18)) console.log(`${(sz / 1048576).toFixed(2).padStart(7)} MB ${String(c).padStart(8)}  ${k.slice(0, 230)}`);

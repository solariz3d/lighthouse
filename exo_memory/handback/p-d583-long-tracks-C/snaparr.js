// snaparr.js: as snapctl.js, but only the small arrays (object Array): their holders walked up past Array/array links to the first named holder,
// aggregated by that holder's (name . edge) chain of 3: who keeps the per-station vectors.
'use strict';
const fs = require('fs'), path = require('path'), v8 = require('v8');
const [, , REPO, DOCF, N = '4'] = process.argv;
const rq = (p) => require(path.join(REPO, p));
const D = rq('src/core/document.js');
const { createCheckJob } = rq('app/validate-ui/checkjob.js');
const full = JSON.parse(fs.readFileSync(DOCF, 'utf8'));
const doc = D.parse(JSON.stringify({ ...full, closed: false, pitLane: undefined, spawns: undefined, pieces: full.pieces.slice(0, +N) }));
const job = createCheckJob(); const r = job.run({ doc });
global.keep = { job, r }; global.gc();
const file = v8.writeHeapSnapshot(path.join(__dirname, 'snap7.heapsnapshot'));
const s = JSON.parse(fs.readFileSync(file, 'utf8')); fs.unlinkSync(file);
const m = s.snapshot.meta, F = m.node_fields.length, E = m.edge_fields.length;
const ti = m.node_fields.indexOf('type'), ni = m.node_fields.indexOf('name'), si = m.node_fields.indexOf('self_size'), eci = m.node_fields.indexOf('edge_count');
const eti = m.edge_fields.indexOf('type'), eni = m.edge_fields.indexOf('name_or_index'), toi = m.edge_fields.indexOf('to_node');
const types = m.node_types[0], etypes = m.edge_types[0], nN = s.nodes.length / F;
const parents = Array.from({ length: nN }, () => []);
{ let e = 0; for (let n = 0; n < nN; n++) { const c = s.nodes[n * F + eci]; for (let k = 0; k < c; k++, e += E) { const et = etypes[s.edges[e + eti]]; if (et === 'weak') continue; parents[s.edges[e + toi] / F].push([n, et === 'element' ? '[i]' : et === 'hidden' || et === 'internal' ? `<${s.strings[s.edges[e + eni]] || et}>` : s.strings[s.edges[e + eni]]]); } } }
const T = (n) => types[s.nodes[n * F + ti]], NM = (n) => String(s.strings[s.nodes[n * F + ni]]).slice(0, 28);
const agg = new Map();
for (let n = 0; n < nN; n++) {
  if (!(T(n) === 'object' && NM(n) === 'Array')) continue;
  let x = n, hops = 0; const chain = [];
  while (parents[x].length && hops < 40) {
    const [p, en] = parents[x][0]; hops++;
    const plain = (T(p) === 'object' && NM(p) === 'Array') || T(p) === 'array';
    if (!plain) { chain.push(`${T(p) === 'object' || T(p) === 'closure' ? NM(p) : T(p)}.${en}`); if (chain.length >= 4) break; }
    x = p;
  }
  const k = chain.join(' <- '); agg.set(k, (agg.get(k) || 0) + 1);
}
console.log(`stations ${r.roadM / 2 | 0}`);
for (const [k, c] of [...agg].sort((a, b) => b[1] - a[1]).slice(0, 14)) console.log(`${String(c).padStart(8)}  ${k.slice(0, 260)}`);

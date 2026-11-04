// snapctl.js <repo> <doc> <npieces>: the check job (fixed PATH_ONLY: no mesh) run on the first n pieces (open), then a heap snapshot aggregated by type/name, and
// for the top object kinds their commonest holder chain; shows what the validation controller keeps per station.
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
const file = v8.writeHeapSnapshot(path.join(__dirname, 'snap6.heapsnapshot'));
const s = JSON.parse(fs.readFileSync(file, 'utf8')); fs.unlinkSync(file);
const m = s.snapshot.meta, F = m.node_fields.length, E = m.edge_fields.length;
const ti = m.node_fields.indexOf('type'), ni = m.node_fields.indexOf('name'), si = m.node_fields.indexOf('self_size'), eci = m.node_fields.indexOf('edge_count');
const eti = m.edge_fields.indexOf('type'), eni = m.edge_fields.indexOf('name_or_index'), toi = m.edge_fields.indexOf('to_node');
const types = m.node_types[0], etypes = m.edge_types[0], nN = s.nodes.length / F;
const parents = Array.from({ length: nN }, () => []);
{ let e = 0; for (let n = 0; n < nN; n++) { const c = s.nodes[n * F + eci]; for (let k = 0; k < c; k++, e += E) { const et = etypes[s.edges[e + eti]]; if (et === 'weak') continue; parents[s.edges[e + toi] / F].push([n, et === 'element' ? '[i]' : et === 'hidden' || et === 'internal' ? `<${s.strings[s.edges[e + eni]] || et}>` : s.strings[s.edges[e + eni]]]); } } }
const T = (n) => types[s.nodes[n * F + ti]], NM = (n) => String(s.strings[s.nodes[n * F + ni]]).slice(0, 28), SZ = (n) => s.nodes[n * F + si];
const agg = new Map(); let total = 0;
for (let n = 0; n < nN; n++) {
  const t = T(n); if (t === 'code' || t === 'hidden' || t === 'synthetic') continue;
  const chain = []; let x = n;
  for (let d = 0; d < +(process.env.DEPTH || 5) && parents[x].length; d++) { const [p, en] = parents[x][0]; chain.push(`${T(p) === 'object' || T(p) === 'closure' ? NM(p) : T(p)}.${en}`); x = p; }
  const k = `${t === 'object' || t === 'closure' ? t + ':' + NM(n) : t}  <-  ${chain.join(' <- ')}`; const a = agg.get(k) || [0, 0]; a[0] += SZ(n); a[1]++; agg.set(k, a); total += SZ(n);
}
console.log(`stations ${r.roadM / 2 | 0}, total ${(total / 1048576).toFixed(1)} MB`);
for (const [k, [sz, c]] of [...agg].sort((a, b) => b[1][0] - a[1][0]).slice(0, 22)) console.log(`${(sz / 1048576).toFixed(2).padStart(7)} MB ${String(c).padStart(8)}  ${k.replace(/\s+/g, ' ').slice(0, 250)}`);

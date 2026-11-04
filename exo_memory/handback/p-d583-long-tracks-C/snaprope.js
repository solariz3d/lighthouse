// snaprope.js: as snapret.js (model stage), and for rope roots by holder, the text of a few (the rope walked: first, second), its length, and node count.
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
const file = v8.writeHeapSnapshot(path.join(__dirname, 'snap4.heapsnapshot'));
const s = JSON.parse(fs.readFileSync(file, 'utf8')); fs.unlinkSync(file);
const m = s.snapshot.meta, F = m.node_fields.length, E = m.edge_fields.length;
const ti = m.node_fields.indexOf('type'), ni = m.node_fields.indexOf('name'), eci = m.node_fields.indexOf('edge_count');
const eti = m.edge_fields.indexOf('type'), eni = m.edge_fields.indexOf('name_or_index'), toi = m.edge_fields.indexOf('to_node');
const types = m.node_types[0], etypes = m.edge_types[0], nN = s.nodes.length / F;
const first = new Int32Array(nN + 1); { let e = 0; for (let n = 0; n < nN; n++) { first[n] = e; e += s.nodes[n * F + eci] * E; } first[nN] = e; }
const kids = (n) => { const r = []; for (let e = first[n]; e < first[n + 1]; e += E) r.push([s.edges[e + toi] / F, etypes[s.edges[e + eti]], s.strings[s.edges[e + eni]]]); return r; };
const parents = Array.from({ length: nN }, () => []);
for (let n = 0; n < nN; n++) for (const [to, et, nm] of kids(n)) if (et !== 'weak') parents[to].push([n, et === 'element' || et === 'hidden' ? '[]' : nm]);
const T = (n) => types[s.nodes[n * F + ti]], NM = (n) => String(s.strings[s.nodes[n * F + ni]]);
const text = (n, out, cnt) => { if (out.s.length > 300) return; if (T(n) === 'concatenated string') { cnt.n++; for (const [c, , nm] of kids(n)) if (nm === 'first' || nm === 'second') text(c, out, cnt); } else out.s += NM(n); };
const size = (n, cnt) => { if (T(n) === 'concatenated string') { cnt.n++; let L = 0; for (const [c, , nm] of kids(n)) if (nm === 'first' || nm === 'second') L += size(c, cnt); return L; } return NM(n).length; };
const by = new Map();
for (let n = 0; n < nN; n++) {
  if (T(n) !== 'concatenated string' || parents[n].some(([p]) => T(p) === 'concatenated string')) continue;
  const [p, en] = parents[n][0] || [-1, '?']; const up = p >= 0 && parents[p][0] ? `${T(parents[p][0][0])}:${NM(parents[p][0][0]).slice(0, 30)}.${parents[p][0][1]}` : '';
  const k = `${p >= 0 ? T(p) + ':' + NM(p).slice(0, 30) : '?'} .${en} <- ${up}`; (by.get(k) || by.set(k, []).get(k)).push(n);
}
for (const [k, ns] of [...by].sort((a, b) => b[1].length - a[1].length).slice(0, 4)) {
  let nodes = 0, len = 0; for (const n of ns) { const c = { n: 0 }; len += size(n, c); nodes += c.n; }
  const o = { s: '' }; text(ns[0], o, { n: 0 });
  console.log(`${ns.length} roots held by ${k}: rope nodes ${nodes}, chars ${len}\n   e.g. ${JSON.stringify(o.s.slice(0, 240))}`);
}

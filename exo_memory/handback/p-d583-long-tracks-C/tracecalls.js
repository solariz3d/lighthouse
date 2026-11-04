// tracecalls.js <repo> <doc> <npieces>: which src/geom and app/preview exports run during a PATH_ONLY track-model update, with the first caller of each.
'use strict';
const fs = require('fs'), path = require('path');
const [, , REPO, DOCF, N = '2'] = process.argv;
const rq = (p) => require(path.join(REPO, p));
const seen = new Map();
for (const f of ['src/geom/mesh.js', 'src/geom/profile.js', 'app/preview/batches.js', 'app/preview/look.js', 'src/geom/bvh.js', 'src/geom/fonts.js']) {
  const M = rq(f);
  for (const k of Object.keys(M)) if (typeof M[k] === 'function') { const o = M[k]; M[k] = function (...a) { const id = `${f} ${k}`; if (!seen.has(id)) seen.set(id, [0, new Error().stack.split('\n').slice(2, 7).map((l) => l.trim().replace(/\(.*[\/]/, '(')).join(' < ')]); seen.get(id)[0]++; return o.apply(this, a); }; }
}
const D = rq('src/core/document.js'), AD = rq('src/core/adapter.js');
const { createTrackModel } = rq('app/preview/trackmodel.js');
const { PATH_ONLY } = rq('app/validate-ui/checkjob.js');
const full = JSON.parse(fs.readFileSync(DOCF, 'utf8'));
const doc = D.parse(JSON.stringify({ ...full, closed: false, pitLane: undefined, spawns: undefined, pieces: full.pieces.slice(0, +N) }));
const segments = AD.toSegments(doc, { cache: new WeakMap() });
seen.clear();
const resolved = Object.freeze({ segments, closed: false, start: { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch }, lift: (p) => AD.offsetPath(doc, segments, p) });
const model = createTrackModel({ geom: PATH_ONLY }); model.update(resolved);
for (const [k, [n, st]] of seen) console.log(`${String(n).padStart(7)} ${k}\n          ${st.slice(0, 400)}`);

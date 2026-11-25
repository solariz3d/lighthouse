// tostations.js: each saved attempt's BUILT road as a read-shaped file (stations every 4 m), for style.js. usage: node tostations.js <tree> <docs.json> <out dir> <prefix>
const path = require('path'), fs = require('fs'), [tree, docs, dir, pre] = process.argv.slice(2), A = require(path.join(tree, 'src/core/adapter.js'));
for (const a of require(path.resolve(docs))) {
  const { path: P } = A.toPath(a.doc, { step: 0.5 }), st = P.samples.filter((x) => Math.abs(x.s / 4 - Math.round(x.s / 4)) < 1e-6).map((x) => ({ d: Math.round(x.s), c: x.pos, f: x.T, n: x.U, width: 33 }));
  const f = path.join(dir, `${pre}${a.name.replace(/[^a-z0-9]+/gi, '-').replace(/-+$/, '').toLowerCase()}.json`); fs.writeFileSync(f, JSON.stringify({ walked_m: P.lengthM, stations: st })); console.log(f);
}

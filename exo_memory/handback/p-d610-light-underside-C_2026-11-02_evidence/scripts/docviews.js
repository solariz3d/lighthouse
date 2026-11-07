// docviews.js <tree> <doc> <name@s,...>: cameras UNDER a document's road looking up at the bottom (as lanviews.js), one per name@s, and an end-on cut spec per name
const fs = require('fs'), path = require('path'), T = process.argv[2], D = require(path.join(T, 'src/core/document.js')), A = require(path.join(T, 'src/core/adapter.js'));
const doc = D.parse(fs.readFileSync(process.argv[3], 'utf8')), P = A.toPath(doc, { step: 2 }).path.samples;
const at = (s) => P.reduce((a, b) => (Math.abs(b.s - s) < Math.abs(a.s - s) ? b : a));
const pt = (s, u, v, f = 0) => { const q = at(s); return [0, 1, 2].map((k) => +(q.pos[k] + q.L[k] * u + q.U[k] * v + q.T[k] * f).toFixed(2)); };
const V = [], cuts = [];
for (const spec of process.argv[4].split(',')) {
  const [name, s] = spec.split('@'), q = at(+s);
  V.push({ name: `${name}-under`, eye: pt(+s, -6, -9, -22), at: pt(+s, 0, -1.6, 6), fov: 60 });
  V.push({ name: `${name}-close`, eye: pt(+s, -3, -6, -6), at: pt(+s, 0, -1.6, 4), fov: 60 });
  cuts.push({ name, pos: q.pos.map((x) => +x.toFixed(2)), T: q.T.map((x) => +x.toFixed(4)), half: 24 });
}
fs.writeFileSync(process.argv[5], JSON.stringify(V, null, 1)); fs.writeFileSync(process.argv[6], JSON.stringify(cuts, null, 1));
console.log(V.map((v) => v.name).join(' '));

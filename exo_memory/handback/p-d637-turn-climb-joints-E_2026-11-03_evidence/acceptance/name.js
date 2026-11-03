// usage (from the scratch folder): node name.js <checkout> <save> — for each candidate joint: the built road's height there, its pitch 60 m before and 60 m
// after, its bank 40 m after, how far the road fell over the 400 m before the joint, and how many metres of OTHER road pass within 120 m horizontally and above it
const [R, save] = process.argv.slice(2);
const D = require(R + '/src/core/document.js'), A = require(R + '/src/core/adapter.js');
const doc = D.parse(require('fs').readFileSync(save, 'utf8')), S = A.toPath(doc).path.samples, ds = S[1].s - S[0].s, at = (s) => S[Math.max(0, Math.min(S.length - 1, Math.round(s / ds)))];
const pitch = (x) => Math.asin(Math.max(-1, Math.min(1, x.T[1]))) * 180 / Math.PI;
const cands = ['p22|p23', 'p23|p24', 'p29|p30', 'p30|p31', 'p33|p34', 'p20|p21', 'p24|p25'];
let o = 0; const J = {}; doc.pieces.forEach((P, i) => { o += P.length; if (doc.pieces[i + 1]) J[`${P.id}|${doc.pieces[i + 1].id}`] = o; });
for (const c of cands) {
  const j = J[c], x = at(j), fall = at(j - 400).pos[1] - x.pos[1];
  let over = 0; for (const y of S) { if (Math.abs(y.s - j) < 300) continue; const h = Math.hypot(y.pos[0] - x.pos[0], y.pos[2] - x.pos[2]); if (h < 120 && y.pos[1] > x.pos[1] + 10) over += ds; }
  console.log(`${c} at s ${j.toFixed(0)}: height ${x.pos[1].toFixed(1)} m, fell ${fall.toFixed(1)} m over the 400 m before; pitch 60 m before ${pitch(at(j - 60)).toFixed(1)}°, at ${pitch(x).toFixed(1)}°, 60 m after ${pitch(at(j + 60)).toFixed(1)}°; bank 40 m after ${(at(j + 40).roll * 180 / Math.PI).toFixed(1)}°; other road overhead within 120 m: ${over.toFixed(0)} m`);
}

// D186 (pane E): does a hill brush applied as κv = h″ leave the track past the brush unchanged? Measured on the LANDED core
// (t180 17c2301, exported to ./tree). The bump h(s) = H·(1 − S₂(|s − s₀|/r)) (ref 10 §1); Δκv = h″, put on the kv control points
// by their knot averages (ref 10 §2). Reports, at the track's end: the position change, split into along-track and vertical,
// and the pitch change; on a LEVEL STRAIGHT and on generated track 0.
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E: D186 hill-brush probe' });
const path = require('path'), T = path.join(__dirname, 'tree');
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js')), { toPath } = require(path.join(T, 'src/core/adapter.js'));
const S = require(path.join(T, 'src/core/sculpt.js'));
const S2dd = (x) => 60 * x * (1 - x) * (1 - 2 * x);   // S₂″ (ref 10 §1 known answers)
const hdd = (s, s0, r, H) => { const x = Math.abs(s - s0) / r; return x >= 1 ? 0 : -H * S2dd(x) / (r * r); };   // h″ (even in s − s₀)
function hill(doc, s0, r, H) {
  const off = S.pieceOffsets(doc);
  return { ...doc, pieces: doc.pieces.map((P, p) => { if (P.type !== 'road') return P; const t = D.knotVector(P);
    const kv = P.channels.kv.map((c, i) => c + hdd(off[p] + S.knotAverage(t, i), s0, r, H));
    return { ...P, channels: { ...P.channels, kv } }; }) };
}
const endOf = (doc) => { const s = toPath(doc).path.samples; return s[s.length - 1]; };
const report = (name, doc, s0, r, H) => {
  const a = endOf(doc), b = endOf(hill(doc, s0, r, H)), d = [0, 1, 2].map((k) => b.pos[k] - a.pos[k]);
  const along = d[0] * a.T[0] + d[1] * a.T[1] + d[2] * a.T[2], dp = Math.asin(b.T[1]) - Math.asin(a.T[1]);
  return `${name}: hill H ${H} m, r ${r} m → the END moves ${Math.hypot(...d).toFixed(4)} m (along the track ${along.toFixed(4)} m, vertical ${d[1].toFixed(4)} m); its pitch by ${dp.toExponential(2)} rad; theory ∫(1 − cos h′) ds ≈ ${approx(r, H).toFixed(4)} m`;
};
function approx(r, H) { let s = 0; const n = 20000; for (let i = 0; i < n; i++) { const x = (i + 0.5) / n, hp = H * 30 * x * x * (1 - x) * (1 - x) / r; s += (1 - Math.cos(hp)) * (r / n); } return 2 * s; }   // ref 10 §1's S₂′
let flat = extend(D.createDoc('flat'), { length: 1000, first: { kh: 0, kv: 0, phi: 0, w: 30 } }); flat = extend(flat, { length: 1000 });
const out = [];
for (const [r, H] of [[100, 5], [100, 1], [50, 2], [200, 10]]) out.push(report('level straight 2 km, s₀ 1500', flat, 1500, r, H));
const H = require(path.join(T, 'test/core_helpers.js')); const g0 = H.docFrom(H.gen()[0]);

console.log(out.join('\n'));

// usage (from the scratch folder): node vert.js <checkout> <save> <joint s> [<joint s> ...] — at joints feel.js could not split (the road within 8° of vertical):
// the centre's U and L load (g, gravity included) and jerk (g/s) at 170 m/s straight from the built path's kvec, U and L (no split), the largest within 15 m of
// the joint against the largest in the middles of the two pieces either side (all but 30 m at each end), with where the peak sits; and the document's own
// turn (kh), climb (kv) and bank rates either side of the joint
const [R, save, ...js] = process.argv.slice(2);
const D = require(R + '/src/core/document.js'), A = require(R + '/src/core/adapter.js');
const doc = D.parse(require('fs').readFileSync(save, 'utf8')), S = A.toPath(doc).path.samples, V = 170, G = 9.80665, ds = S[1].s - S[0].s;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const P = S.map((x) => ({ s: x.s, U: (V * V * dot(x.kvec, x.U)) / G + x.U[1], L: (V * V * dot(x.kvec, x.L)) / G + x.L[1], pitch: Math.asin(Math.max(-1, Math.min(1, x.T[1]))) * 180 / Math.PI }));
const idx = (s) => Math.max(2, Math.min(P.length - 3, Math.round(s / ds))), jerk = (i, k) => Math.abs((P[i + 2][k] - P[i - 2][k]) / (P[i + 2].s - P[i - 2].s)) * V;
const peak = (a, b, k) => { let m = 0, at = 0; for (let i = idx(a); i <= idx(b); i++) { const j = jerk(i, k); if (j > m) { m = j; at = P[i].s; } } return { m, at }; };
let o = 0; const pc = doc.pieces.map((p) => { const r = { p, a: o, b: o + p.length }; o += p.length; return r; });
for (const J of js.map(Number)) {
  const k = pc.findIndex((r) => Math.abs(r.b - J) < 1); const A_ = pc[k], B_ = pc[k + 1];
  const line = [`${A_.p.id}|${B_.p.id} at s ${J}: pitch ${P[idx(J)].pitch.toFixed(1)}°`];
  for (const key of ['U', 'L']) { const at = peak(J - 15, J + 15, key), mid = Math.max(peak(A_.a + 30, A_.b - 30, key).m, peak(B_.a + 30, B_.b - 30, key).m, 1e-6); line.push(`${key} load ${P[idx(at.at)][key].toFixed(1)} g, jerk ${at.m.toFixed(0)} g/s at ${(at.at - J).toFixed(0)} m against ${mid.toFixed(0)} mid-piece (${(at.m / mid).toFixed(1)}×)`); }
  const r = (p, ch, s) => (D.channelAt(p, ch, s).d1).toExponential(1);
  line.push(`document rates at the end of ${A_.p.id} / start of ${B_.p.id}: kh ${r(A_.p, 'kh', A_.p.length)} / ${r(B_.p, 'kh', 0)}, kv ${r(A_.p, 'kv', A_.p.length)} / ${r(B_.p, 'kv', 0)}`);
  console.log(line.join('; '));
}

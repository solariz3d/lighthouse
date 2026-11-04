const T = process.argv[2] + '/';
const D = require(T + 'src/core/document.js'), { extend } = require(T + 'src/core/extend.js'), A = require(T + 'src/core/adapter.js'), { buildMesh } = require(T + 'src/geom/mesh.js');
function rowGap(a, b) {
  const P = (r) => r.map((v) => v.p), sub = (x, y) => [x[0] - y[0], x[1] - y[1], x[2] - y[2]], dot = (x, y) => x[0] * y[0] + x[1] * y[1] + x[2] * y[2];
  const near = (q, poly) => { let best = Infinity; for (let i = 0; i + 1 < poly.length; i++) { const d = sub(poly[i + 1], poly[i]), w = sub(q, poly[i]), t = Math.max(0, Math.min(1, dot(w, d) / (dot(d, d) || 1))), r = sub(w, d.map((x) => x * t)); best = Math.min(best, Math.hypot(r[0], r[1], r[2])); } return best; };
  const A1 = P(a), B1 = P(b); return Math.max(...A1.map((q) => near(q, B1)), ...B1.map((q) => near(q, A1)));
}
for (const [fam, w0, L, w1] of [['bowl', 31, 100, 12], ['bowl', 12, 100, 31], ['half-pipe', 31.5, 45, 12], ['bowl', 31, 30, 12], ['bowl', 31, 15, 12], ['bowl', 31, 100, 20]]) {
  let d = extend(D.createDoc('r'), { length: 100, family: fam, first: { w: w0 } });
  const d2 = extend(d, { length: L, transition: { w: 'start' }, targets: { w: w1 } }), P = d2.pieces[1], R = require(T + 'src/core/extend.js').startRampM(L);
  const lo = Math.min(w0, w1), hi = Math.max(w0, w1); let mn = 1e9, mx = -1e9; for (let s = 0; s <= L + 1e-9; s += 0.05) { const v = D.channelAt(P, 'w', s).v; mn = Math.min(mn, v); mx = Math.max(mx, v); }
  const at = (s) => D.channelAt(P, 'w', s).v.toFixed(3);
  const segs = A.toSegments(d2), path = A.toPath(d2).path, mesh = buildMesh(path, segs), pcs = mesh._state.pieces;
  const gi = segs.findIndex((x) => x.id === 'p2');
  const joint = rowGap(pcs[gi - 1].last, pcs[gi].first) * 1000;
  let worst = 0, worstAt = 0; for (let g = gi; g + 1 < segs.length && segs[g + 1].id === 'p2'; g++) { const m = rowGap(pcs[g].last, pcs[g + 1].first) * 1000; if (m > worst) { worst = m; worstAt = (g - gi) * 2; } }
  console.log(`${fam} ${w0}->${w1} L ${L} R ${R.toFixed(1)} knots ${P.knots.length} | w range [${mn.toFixed(3)}, ${mx.toFixed(3)}] vs [${lo}, ${hi}] | w(R) ${at(R)} w(1.5R) ${at(Math.min(L, 1.5 * R))} w(2R) ${at(Math.min(L, 2 * R))} w(L) ${at(L)} | mesh joint gap ${joint.toFixed(1)} mm, worst in-piece row gap ${worst.toFixed(0)} mm at s~${worstAt}`);
}

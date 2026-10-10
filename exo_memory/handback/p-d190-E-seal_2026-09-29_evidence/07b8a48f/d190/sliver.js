// D190 ruling check (pane E): a seam between two rows ON THE SAME CURVE sampled at different u. How far is each vertex of one row
// from the other row's polyline (the sliver's thickness)? The mesh's own sampling rules at c964c2d: samplesAcross (a font alone,
// maxSeam 1°, maxAcross 1 m) against usOf(blendSamples(prev, P)) (a blend pair's fractions), for cup profiles with prev = c − Δ.
const T = __dirname + '/t/', Prof = require(T + 'src/geom/profile.js'), { FLOORS, AT } = require(T + 'src/geom/fonts.js');
const DEG = Math.PI / 180, o = { maxSeam: DEG, maxAcross: 1 };
const cup = (fam, w, c) => { const F = FLOORS[fam], E = F[3], side = AT.map((f, i) => [f * w / 2, c * F[i] / E * DEG]);
  return Prof.normalize({ u: [...side.slice().reverse().map(([x]) => -x), 0, ...side.map(([x]) => x)], psi: [...side.slice().reverse().map(([, p]) => p), 0, ...side.map(([, p]) => p)] }); };
const segDist = (p, a, b) => { const d = [b[0] - a[0], b[1] - a[1]], L2 = d[0] ** 2 + d[1] ** 2, t = L2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * d[0] + (p[1] - a[1]) * d[1]) / L2)) : 0; return Math.hypot(p[0] - a[0] - t * d[0], p[1] - a[1] - t * d[1]); };
const polyDist = (p, poly) => { let m = Infinity; for (let i = 1; i < poly.length; i++) m = Math.min(m, segDist(p, poly[i - 1], poly[i])); return m; };
for (const fam of ['bowl', 'half-pipe']) for (const w of [12, 31]) for (const c of [30, 90, 150]) {
  const P = cup(fam, w, c), A = Prof.samplesAcross(P, o).u.map((u) => Prof.offsetAt(P, u)), B = Prof.usOf(P, Prof.blendSamples(cup(fam, w, c - 2.8), P, o)).map((u) => Prof.offsetAt(P, u));
  const worst = Math.max(...A.map((p) => polyDist(p, B)), ...B.map((p) => polyDist(p, A)));
  console.log(JSON.stringify({ fam, w, c, rowA: A.length, rowB: B.length, sliver_mm: +(worst * 1000).toFixed(3) }));
}

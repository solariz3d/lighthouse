// before/after measure of the legacy chord change (D196). node measure.js <tree> [fixtures dir]
// per fixture: the largest width step between neighbouring segments (the road's edge to edge width at the end of one against the start of the next, m),
// the largest mesh row gap between neighbouring segments INSIDE a piece and at a piece JOINT (mm, B's method), and the number of segments drawn as chords
const path = require('path'), fs = require('fs');
const T = path.resolve(process.argv[2]) + '/', FX = process.argv[3] ? path.resolve(process.argv[3]) : path.join(T, 'test/fixtures');
const D = require(T + 'src/core/document.js'), A = require(T + 'src/core/adapter.js'), { buildMesh } = require(T + 'src/geom/mesh.js'), PF = require(T + 'src/geom/profile.js');
const readAt = PF.readAt || ((g) => PF.normalize(g.profile));
function rowGap(a, b) {
  const P = (r) => r.map((v) => v.p), sub = (x, y) => [x[0] - y[0], x[1] - y[1], x[2] - y[2]], dot = (x, y) => x[0] * y[0] + x[1] * y[1] + x[2] * y[2];
  const near = (q, poly) => { let best = Infinity; for (let i = 0; i + 1 < poly.length; i++) { const d = sub(poly[i + 1], poly[i]), w = sub(q, poly[i]), t = Math.max(0, Math.min(1, dot(w, d) / (dot(d, d) || 1))), r = sub(w, d.map((x) => x * t)); best = Math.min(best, Math.hypot(r[0], r[1], r[2])); } return best; };
  const A1 = P(a), B1 = P(b); return Math.max(...A1.map((q) => near(q, B1)), ...B1.map((q) => near(q, A1)));
}
const rows = [];
for (const f of fs.readdirSync(FX).filter((x) => /^F\d.*\.core2\.json$/.test(x))) {
  let d; try { d = D.parse(fs.readFileSync(path.join(FX, f), 'utf8')); } catch (e) { rows.push(`${f.slice(0, 40).padEnd(42)} ${e.code}`); continue; }
  if (!d.pieces.length) continue;
  const segs = A.toSegments(d), p = A.toPath(d).path, mesh = buildMesh(p, segs), pcs = mesh._state.pieces;
  let wstep = 0, inGap = 0, jointGap = 0, chords = 0, jointSameFam = 0, jointDiffFam = 0;
  for (let i = 0; i < segs.length; i++) {
    if (segs[i].blend && segs[i].chord) chords++;
    if (i === 0) continue; const a = segs[i - 1], b = segs[i];
    if (a.kind !== 'road' || b.kind !== 'road' || !a.profile || !b.profile) continue;
    const pa = readAt(a, a.length), pb = readAt(b, 0), wa = pa.u[pa.u.length - 1] - pa.u[0], wb = pb.u[pb.u.length - 1] - pb.u[0];
    if (!pcs[i - 1] || !pcs[i] || !pcs[i - 1].last || !pcs[i].first) continue;
    const gap = rowGap(pcs[i - 1].last, pcs[i].first) * 1000, joint = a.id !== b.id;
    if (joint) { jointGap = Math.max(jointGap, gap); const fa = (d.pieces.find((q) => q.id === a.id) || {}).family, fb = (d.pieces.find((q) => q.id === b.id) || {}).family; if (fa === fb) jointSameFam = Math.max(jointSameFam, gap); else jointDiffFam = Math.max(jointDiffFam, gap); } else { inGap = Math.max(inGap, gap); wstep = Math.max(wstep, Math.abs(wa - wb)); }
  }
  rows.push(`${f.slice(0, 40).padEnd(42)} width step ${wstep.toFixed(4)} m | row gap inside pieces ${inGap.toFixed(3)} mm | at joints ${jointGap.toFixed(3)} mm (same family ${jointSameFam.toFixed(3)}, family changes ${jointDiffFam.toFixed(1)}) | chord segments ${chords} of ${segs.length}`);
}
console.log(rows.join('\n'));

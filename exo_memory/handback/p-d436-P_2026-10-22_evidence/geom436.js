// geom436.js (D436, P): for each joint station, the kn5's ROAD-class triangles within R m of it (world), the core's centre and edge lines, the
// frames (every path sample within R+20 m) and the joint's own frame, as JSON for the shot page.   node geom436.js <tree> <save> <kn5> <jointsCSV> <outdir> [R=150]
const fs = require('fs'), path = require('path'); const [T, F, K, J, OUTDIR, Rraw] = process.argv.slice(2); const R = Rraw ? +Rraw : 150;
const D = require(path.join(T, 'src/core/document.js')), AD = require(path.join(T, 'src/core/adapter.js')), Prof = require(path.join(T, 'src/geom/profile.js')), { readKn5 } = require(path.join(T, 'tools/kn5.cjs'));
const doc = D.parse(fs.readFileSync(F, 'utf8')); const { segments, path: p } = AD.toPath(doc, { step: 2 }); const S = p.samples, LAP = doc.pieces.reduce((a, q) => a + q.length, 0);
const segS0 = []; { let a = S[0].s; for (const g of segments) { segS0.push(a); a += g.length; } }
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const kn = readKn5(K); const road = kn.meshes.filter((m) => /^1ROAD(?!_PIT|_CATCH)|^1GRIP/.test(m.name));
// a frame at any s (the sample before it, moved along by the remainder: the frame turns little in 2 m)
const frameAt = (s) => { let ss = ((s % LAP) + LAP) % LAP; let i = Math.min(S.length - 1, Math.max(0, Math.floor((ss - S[0].s) / 2))); while (i + 1 < S.length && S[i + 1].s <= ss) i++; while (i > 0 && S[i].s > ss) i--; const sm = S[i]; return { s: ss, pos: add(sm.pos, mul(sm.T, ss - sm.s)), T: sm.T, L: sm.L, U: sm.U, seg: sm.seg }; };
const edgesAt = (fr) => { const seg = segments[fr.seg], P = Prof.readAt(seg, Math.max(0, Math.min(seg.length, fr.s - segS0[fr.seg]))); const at = (u) => { const [X, Y] = Prof.offsetAt(P, u); return add(fr.pos, add(mul(fr.L, X), mul(fr.U, Y))); }; return { centre: at(0), left: at(P.u[P.u.length - 1]), right: at(P.u[0]) }; };
fs.mkdirSync(OUTDIR, { recursive: true });
for (const j of J.split(',').map(Number)) {
  const f0 = frameAt(j), c0 = f0.pos; const tri = [];
  for (const m of road) for (let k = 0; k < m.idx.length; k += 3) { const v = [m.idx[k], m.idx[k + 1], m.idx[k + 2]].map((i) => [m.pos[i * 3], m.pos[i * 3 + 1], m.pos[i * 3 + 2]]); if (Math.hypot(v[0][0] - c0[0], v[0][1] - c0[1], v[0][2] - c0[2]) > R) continue; for (const q of v) tri.push(q[0], q[1], q[2]); }
  const lines = { centre: [], left: [], right: [], frames: [] };
  for (const sm of S) { let d = sm.s - f0.s; if (d > LAP / 2) d -= LAP; if (d < -LAP / 2) d += LAP; if (Math.abs(d) > R + 20) continue; const fr = { s: sm.s, pos: sm.pos, T: sm.T, L: sm.L, U: sm.U, seg: sm.seg }; const e = edgesAt(fr); lines.centre.push(e.centre); lines.left.push(e.left); lines.right.push(e.right); lines.frames.push({ s: sm.s, pos: sm.pos, T: sm.T, L: sm.L, U: sm.U }); }
  const out = { tri, lines, joint: { s: j, frame: f0, edges: edgesAt(f0) } };
  fs.writeFileSync(path.join(OUTDIR, `geom-${j}.json`), JSON.stringify(out)); console.log('joint', j, 'tris', tri.length / 9, 'frames', lines.frames.length, 'centre at', f0.pos.map((x) => x.toFixed(1)).join(','));
}

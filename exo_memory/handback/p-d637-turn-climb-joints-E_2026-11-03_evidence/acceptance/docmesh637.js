// docmesh637.js (node -r), from docmesh626.js: when render.js asks tools/kn5.cjs for a ".t180track", this builds that document's road mesh with the repo in
// REPO_637: toSegments, then (MODE_637=heading60) the turn and climb re-laid by turnplan.js's heading-keeping rounding with windows ≤ 60 m, or (MODE_637=none)
// as built; buildPath OPEN (the prototype misses the lap's start by 0.14 m, which a closed build refuses), the adapter's own offsetPath, buildMesh.
// It writes VIEWS_637: his "downward on the mega drop" view, from high on p22's drop, 3 m above the road along its own up, looking down the drop at p23|p24
// (s 10,853), at three distances; and one from the side of the joint.
const fs = require('fs'), path = require('path'), Module = require('module');
const REPO = process.env.REPO_637, VIEWS = process.env.VIEWS_637, MODE = process.env.MODE_637 || 'none', real = path.join(REPO, 'tools', 'kn5.cjs').toLowerCase();
const rq = (p) => require(path.join(REPO, p));
function fromDoc(file) {
  const D = rq('src/core/document.js'), A = rq('src/core/adapter.js'), { buildPath, buildMesh } = rq('src/geom/index.js');
  const doc = D.parse(fs.readFileSync(file, 'utf8')), segs = A.toSegments(doc).map((g) => ({ ...g }));
  if (MODE === 'heading60') {
    const { roundChannel } = require(path.join(__dirname, 'turnplan.js'));
    const kh = roundChannel(REPO, doc, 'kh', { mode: 'heading', maxW: 60 }), kv = roundChannel(REPO, doc, 'kv', { mode: 'heading', maxW: 60 });
    const idx = new Map(doc.pieces.map((P, i) => [P.id, i])), off = new Map();
    for (const g of segs) { const i = idx.get(g.id), s0 = off.get(g.id) || 0, s1 = s0 + g.length; off.set(g.id, s1); if (g.kind !== 'road') continue; if (kh[i]) { g.k0 = kh[i](s0); g.k1 = kh[i](s1); } if (kv[i]) { g.kp0 = kv[i](s0); g.kp1 = kv[i](s1); } }
  }
  const p = A.offsetPath(doc, segs, buildPath(segs, { closed: false, start: { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch } })), m = buildMesh(p, segs);
  const meshes = [];
  const mul = (a, b) => { const r = new Array(16).fill(0); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++) r[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j]; return r; };
  const I = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  (function walk(n, parent) {
    const M = n.matrix ? mul(Array.from(n.matrix), parent) : parent;
    if (n.children) { for (const c of n.children) walk(c, M); return; }
    if (!n.positions || !n.indices) return;
    const raw = n.positions.flat ? n.positions.flat() : Array.from(n.positions), pos = new Float32Array(raw.length);
    for (let i = 0; i < raw.length; i += 3) for (let j = 0; j < 3; j++) pos[i + j] = raw[i] * M[j] + raw[i + 1] * M[4 + j] + raw[i + 2] * M[8 + j] + M[12 + j];
    meshes.push({ name: `1ROAD_${n.name}`, material: typeof n.material === 'string' ? n.material : 'road', pos, idx: Uint32Array.from(n.indices) });
  })(m.scene.root, I);
  // the cameras come from the AS-BUILT path, so base and fix are seen from the very same place
  const base = buildPath(A.toSegments(doc), { closed: false, start: { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch } });
  const S = base.samples, ds = S[1].s - S[0].s, at = (s) => S[Math.max(0, Math.min(S.length - 1, Math.round(s / ds)))];
  const add = (...v) => v.reduce((a, x) => a.map((y, i) => y + x[i])), scl = (a, k) => a.map((x) => x * k);
  // a driver's view: 1.2 m above the road along its own up, looking along the road's direction (VIEW_S_637: the stations, comma separated)
  const views = [], J = Number(process.env.JOINT_637 || 10853);
  for (const st of (process.env.VIEW_S_637 || '10450,10500,10550').split(',').map(Number)) { const e = at(st); views.push({ name: `drive-${st}`, eye: add(e.pos, scl(e.U, 1.2)), at: add(e.pos, scl(e.U, 1.2), scl(e.T, 100)), up: e.U.slice(), fov: 70, far: 2000 });
    views.push({ name: `look-${st}`, eye: add(e.pos, scl(e.U, 2)), at: at(J).pos, up: e.U.slice(), fov: 60, far: 2000 }); }
  const j = at(J), side = [j.T[2], 0, -j.T[0]];
  views.push({ name: `side-${J}`, eye: add(j.pos, scl(side, 120), [0, 25, 0]), at: j.pos, fov: 50, far: 800 });
  if (VIEWS) fs.writeFileSync(VIEWS, JSON.stringify(views));
  return { meshes, dummies: [] };
}
const load = Module._load;
Module._load = function (request, parent, isMain) {
  const r = load.apply(this, arguments);
  try { if (path.resolve(request).toLowerCase() === real) return { readKn5: (f) => (/\.t180track$/i.test(f) ? fromDoc(f) : r.readKn5(f)) }; } catch (_) { /* not a path */ }
  return r;
};

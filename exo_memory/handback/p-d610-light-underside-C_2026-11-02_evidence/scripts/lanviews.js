// lanviews.js <tree>: cameras UNDER the LANIAKEA-shaped fixture's road, looking up at the bottom: a straight, the banked sweeper, the twist, the esse
const path = require('path'), T = process.argv[2], A = require(path.join(T, 'src/core/adapter.js'));
const { doc } = require('./lanfx.js')(T), P = A.toPath(doc, { step: 2 }).path.samples;
const at = (s) => P.reduce((a, b) => (Math.abs(b.s - s) < Math.abs(a.s - s) ? b : a));
const pt = (s, u, v, f = 0) => { const q = at(s); return [0, 1, 2].map((k) => +(q.pos[k] + q.L[k] * u + q.U[k] * v + q.T[k] * f).toFixed(2)); };
const V = [], add = (name, s, eye, look, fov = 60) => V.push({ name, eye: pt(s, ...eye), at: pt(s, ...look), fov });
add('straight-under', 970, [-6, -9, -22], [0, -1.6, 6]);
add('sweep-under', 520, [-6, -9, -22], [0, -1.6, 6]);
add('twist-under', 1900, [-6, -9, -22], [0, -1.6, 6]);
add('esse-under', 1420, [-6, -9, -22], [0, -1.6, 6]);
add('sweep-edge-under', 520, [-22, -7, -14], [-12, -1.4, 6]);
console.log(JSON.stringify(V, null, 1));

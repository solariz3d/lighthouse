// mkviews636.js <repo> <track copy> > views.json: D636's four views of ELYSIUM NEW SCIFI 0439, placed from the path frame (pos, T, L, U) of the same
// document at the same tree the export was built from. Follow views roll with the road (v.up = the frame's U); the wide view and p38 keep world up.
'use strict';
const path = require('path'), fs = require('fs');
const [REPO, T] = process.argv.slice(2);
const R = (p) => require(path.join(REPO, p)), D = R('src/core/document.js'), A = R('src/core/adapter.js');
const doc = D.parse(fs.readFileSync(T, 'utf8'));
const P = A.toPath(doc, { step: 2 }).path.samples;
const at = (s) => P.reduce((a, b) => (Math.abs(b.s - s) < Math.abs(a.s - s) ? b : a));
const pt = (s, u, v, f = 0) => { const q = at(s); return [0, 1, 2].map((k) => +(q.pos[k] + q.L[k] * u + q.U[k] * v + q.T[k] * f).toFixed(2)); };
const startOf = (i) => doc.pieces.slice(0, i).reduce((a, p) => a + p.length, 0);
const V = [];
// a follow cam: 12 m behind and 3 m above the road at the joint, looking 30 m ahead, rolled with the road
const follow = (name, s) => V.push({ name, s, eye: pt(s - 12, 0, 3), at: pt(s + 30, 0, 1), up: at(s - 12).U.map((x) => +x.toFixed(4)), fov: 65, far: 900 });
V.push({ name: 'wide', eye: [2000, 1500, -1400], at: [260, 20, 480], fov: 45, far: 9000 });
follow('follow-p17-joint', startOf(17));   // p16 → p17 at about 70° of bank
follow('follow-p35-joint', startOf(35));   // p34 → p35 at about 85° of bank
const m38 = startOf(38) + doc.pieces[38].length / 2;
V.push({ name: 'p38', s: +m38.toFixed(1), eye: pt(m38 - 60, -70, 40), at: pt(m38, 0, 0), fov: 60, far: 1500 });
console.log(JSON.stringify(V, null, 1));

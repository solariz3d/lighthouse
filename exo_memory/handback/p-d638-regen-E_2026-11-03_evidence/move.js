// usage: node move.js <tree> <save> <other> [pieces]   the centre line of <other> against <save>'s first N pieces (both built open, the shipped adapter, 2 m stations):
// the largest move at the same s, where it is, the move at each joint, and each one's gap from its end back to the start (position and heading)
'use strict';
const fs = require('fs'), path = require('path'), R = path.resolve(process.argv[2]), q = (m) => require(path.join(R, m));
const D = q('src/core/document.js'), AD = q('src/core/adapter.js');
const n = Number(process.argv[5] || 0);
const load = (f, k) => { let d = D.parse(fs.readFileSync(f, 'utf8')); if (k) d = D.checkDoc({ ...d, closed: false, pieces: d.pieces.slice(0, k) }); else d = D.checkDoc({ ...d, closed: false }); return d; };
const a = load(process.argv[3], n), b = load(process.argv[4], 0);
const pa = AD.toPath(a, { step: 2 }).path, pb = AD.toPath(b, { step: 2 }).path;
const at = (p, s) => { const S = p.samples; let lo = 0, hi = S.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].s <= s) lo = m; else hi = m; } const u = (s - S[lo].s) / ((S[hi].s - S[lo].s) || 1); return S[lo].pos.map((x, i) => x + (S[hi].pos[i] - x) * u); };
const L = Math.min(pa.lengthM, pb.lengthM); let worst = { d: 0, s: 0 };
for (let s = 0; s <= L; s += 1) { const x = at(pa, s), y = at(pb, s), d = Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); if (d > worst.d) worst = { d, s }; }
const joints = []; let s = 0; for (const P of a.pieces) { s += P.length; if (s <= L) { const x = at(pa, s), y = at(pb, s); joints.push({ after: P.id, s, d: Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) }); } }
const pieceAt = (s) => { let t = 0; for (const P of a.pieces) { if (s <= t + P.length) return P.id; t += P.length; } return a.pieces[a.pieces.length - 1].id; };
const gap = (p) => { const S = p.samples, e = S[S.length - 1], o = S[0]; const T = e.T || null; return { m: Math.hypot(e.pos[0] - o.pos[0], e.pos[1] - o.pos[1], e.pos[2] - o.pos[2]), end: e.pos.map((x) => +x.toFixed(1)) }; };
console.log(`lengths ${pa.lengthM.toFixed(1)} / ${pb.lengthM.toFixed(1)} m; largest centre-line move ${worst.d.toFixed(1)} m at s ${worst.s.toFixed(0)} (${pieceAt(worst.s)})`);
console.log(`end-to-start gap: ${path.basename(process.argv[3])} ${gap(pa).m.toFixed(1)} m, ${path.basename(process.argv[4])} ${gap(pb).m.toFixed(1)} m`);
console.log('move at each joint (m): ' + joints.filter((j) => j.d > 0.01).map((j) => `${j.after} ${j.d.toFixed(1)}`).join(', '));

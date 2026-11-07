// pair.js <tree> <doc> <sLower> <sUpper>: for one lower station and one upper station of a saved track, each upper section line (surface q to hull bottom b)
// against its nearest lower point: the along (T), side and normal components, as passclear's reachInto reads them; prints the lines nearest the lower road
'use strict';
const fs = require('fs'), T = process.argv[2];
const D = require(T + '/src/core/document.js'), AD = require(T + '/src/core/adapter.js'), PC = require(T + '/src/validate/passclear.js'), P = require(T + '/src/geom/profile.js');
const doc = D.parse(fs.readFileSync(process.argv[3], 'utf8')), [sl, su] = process.argv.slice(4).map(Number);
const { segments, path: path0 } = AD.toPath(doc, { step: 2 }), path = AD.offsetPath(doc, segments, path0), S = path.samples;
const at = (s) => S.reduce((m, q) => (Math.abs(q.s - s) < Math.abs(m.s - s) ? q : m));
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], len = (a) => Math.hypot(...a);
const pts = (q) => PC._internal.sectionOf(P.normalize(segments[q.seg].profile), 2).pts.map((p) => { const W = (x, y) => add(add(q.pos, q.L, x), q.U, y), n = add([q.L[0] * p.nX, q.L[1] * p.nX, q.L[2] * p.nX], q.U, p.nY), qq = W(p.X, p.Y); return { q: qq, n, b: add(qq, add([q.L[0] * p.dX, q.L[1] * p.dX, q.L[2] * p.dX], q.U, p.dY), p.depth), u: p.u, apron: p.apron, w: p.w }; });
const A = at(sl), B = at(su), Ap = pts(A), Bp = pts(B);
console.log(`lower s ${A.s} T ${A.T.map((x) => x.toFixed(2))} U ${A.U.map((x) => x.toFixed(2))}; upper s ${B.s} T ${B.T.map((x) => x.toFixed(2))} U ${B.U.map((x) => x.toFixed(2))}`);
const rows = [];
for (const o of Bp) { let k = -1, bd = Infinity; for (let m = 0; m < Ap.length; m++) { const p = Ap[m]; for (const e of [o.q, o.b]) { const v = sub(e, p.q), g = dot(v, p.n), t = dot(v, A.T); if (Math.abs(t) > 1) continue; const w = len(sub(v, add([p.n[0] * g, p.n[1] * g, p.n[2] * g], A.T, t))); if (w < bd) { bd = w; k = m; } } } if (k < 0) continue;
  const a = Ap[k], vq = sub(o.q, a.q), vb = sub(o.b, a.q), gq = dot(vq, a.n), gb = dot(vb, a.n), t = dot(vq, A.T), side = len(sub(vq, add([a.n[0] * gq, a.n[1] * gq, a.n[2] * gq], A.T, t)));
  rows.push({ bd, line: `upper u ${o.u.toFixed(1)}${o.apron ? ' apron w ' + o.w : ''} -> lower u ${a.u.toFixed(1)}${a.apron ? ' apron w ' + a.w : ''}: dist ${bd.toFixed(2)}, along ${t.toFixed(2)}, side ${side.toFixed(2)}, gq ${gq.toFixed(2)}, gb ${gb.toFixed(2)}` }); }
rows.sort((x, y) => x.bd - y.bd); for (const r of rows.slice(0, 8)) console.log(' ', r.line);

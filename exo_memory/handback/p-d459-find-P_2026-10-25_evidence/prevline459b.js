// prevline459b.js (D459, P): the preview's DRAWN centre line (app/preview/look.js linesFor: per batch, the lerp at u = 0 between the two columns either side of it, by the
// PIECE's base Us) against the geometry's centre at the same station (the path sample's frame + the profile's point at u = 0), for every row of every road batch; each row
// is matched to its station by POSITION (the batch's rowS is the first cell's for every batch of a piece, see dump459.out), i.e. the nearest path sample to the drawn point.
// Prints the largest lateral offsets, where they jump between neighbouring stations, and the offset profile around each joint.   node prevline459b.js <tree> <save> <out.json>
'use strict';
const os = require('os'); os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
const fs = require('fs'), path = require('path'); const [T, F, OUTJ] = process.argv.slice(2);
(async () => {
  const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
  const { createTrackModel } = require(path.join(T, 'app/preview/trackmodel.js'));
  const { linesFor, LIFT } = require(path.join(T, 'app/preview/look.js'));
  const Prof = require(path.join(T, 'src/geom/profile.js'));
  const text = fs.readFileSync(F, 'utf8');
  const sh = await createCoreShell({ brushFn: null, exporter: null, storage: { openDoc: async () => text } }); await sh.open('TEST 10');
  const resolved = sh.getState().resolved; const tm = createTrackModel(); const R = tm.update(resolved);
  const S = R.path.samples, segments = R.segments || resolved.segments, LAP = S[S.length - 1].s + (S[1].s - S[0].s);
  const segS0 = []; { let a = S[0].s; for (const g of segments) { segS0.push(a); a += g.length; } }
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const world = (p, M) => [p[0] * M[0] + p[1] * M[4] + p[2] * M[8] + M[12], p[0] * M[1] + p[1] * M[5] + p[2] * M[9] + M[13], p[0] * M[2] + p[1] * M[6] + p[2] * M[10] + M[14]];
  // the true centre at every station, and a grid for the nearest-station lookup
  const C = S.map((sm) => { const seg = segments[sm.seg], P = Prof.readAt(seg, Math.max(0, Math.min(seg.length, sm.s - segS0[sm.seg]))); const [X, Y] = Prof.offsetAt(P, 0); return add(sm.pos, add(mul(sm.L, X), mul(sm.U, Y))); });
  const G = 8, grid = new Map(); const key = (p) => `${Math.floor(p[0] / G)},${Math.floor(p[1] / G)},${Math.floor(p[2] / G)}`;
  C.forEach((c, i) => { const k = key(c); (grid.get(k) || grid.set(k, []).get(k)).push(i); });
  const nearest = (p) => { let best = -1, bd = Infinity; const cx = Math.floor(p[0] / G), cy = Math.floor(p[1] / G), cz = Math.floor(p[2] / G); for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) { const l = grid.get(`${cx + dx},${cy + dy},${cz + dz}`); if (!l) continue; for (const i of l) { const d = Math.hypot(p[0] - C[i][0], p[1] - C[i][1], p[2] - C[i][2]); if (d < bd) { bd = d; best = i; } } } return { i: best, d: bd }; };
  const rows = [];
  for (const b of R.batches) { if (b.seam || !b.cols) continue; const ln = linesFor(b); if (!ln) continue; const K = b.cols, P = b.positions, N = b.normals, nR = P.length / 3 / K; const { k0, t } = ln.centre;
    for (let r = 0; r < nR; r++) { const v = (k) => { const i = (r * K + k) * 3; return [P[i] + N[i] * LIFT, P[i + 1] + N[i + 1] * LIFT, P[i + 2] + N[i + 2] * LIFT]; }; let m; if (t === 0) m = v(k0); else { const a = v(k0), c = v(k0 + 1); m = [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t, a[2] + (c[2] - a[2]) * t]; }
      const w = world(m, b.model); const { i, d } = nearest(w); if (i < 0) { rows.push({ far: true, w }); continue; } const sm = S[i], e = sub(w, C[i]);
      rows.push({ s: sm.s, i, piece: b.piece, K, k0, t: +t.toFixed(4), side: dot(e, sm.L), up: dot(e, sm.U) - LIFT, along: dot(e, sm.T), d }); } }
  const far = rows.filter((r) => r.far).length; console.log('rows', rows.length, 'with no station within 8 m', far);
  // one entry per station: rows at the same station (the shared row of two cells, two pieces) are listed together; a disagreement between them is itself a jump
  const byI = new Map(); for (const r of rows) { if (r.far) continue; (byI.get(r.i) || byI.set(r.i, []).get(r.i)).push(r); }
  const st = [...byI.keys()].sort((a, b) => a - b).map((i) => { const l = byI.get(i); return { i, s: S[i].s, n: l.length, side: l.map((r) => r.side), up: l.map((r) => r.up), along: l.map((r) => r.along), pieces: [...new Set(l.map((r) => r.piece))], K: [...new Set(l.map((r) => r.K))] }; });
  console.log('stations with a drawn point', st.length, 'of', S.length);
  const maxAbs = (a) => a.reduce((m, x) => Math.max(m, Math.abs(x)), 0);
  const worst = [...st].sort((a, b) => maxAbs(b.side) - maxAbs(a.side)).slice(0, 12);
  console.log('\nlargest |side| offset of the drawn centre from the true centre (m, + toward L), by station:');
  for (const x of worst) console.log('  s', x.s.toFixed(1).padStart(8), 'pieces', x.pieces.join('/').padEnd(6), 'K', x.K.join('/').padEnd(6), 'side', x.side.map((v) => v.toFixed(4)).join(' | '), ' up', x.up.map((v) => v.toFixed(4)).join(' | '), ' along', x.along.map((v) => v.toFixed(3)).join(' | '));
  // jumps: between neighbouring stations (max over the rows at each), and within a station between its rows
  const jumps = []; for (let k = 0; k < st.length; k++) { const a = st[k], b = st[(k + 1) % st.length]; let dj = 0; for (const x of a.side) for (const y of b.side) dj = Math.abs(y - x) > Math.abs(dj) ? y - x : dj; jumps.push({ s: b.s, from: a.s, dSide: dj, within: a.n > 1 ? Math.max(...a.side) - Math.min(...a.side) : 0, pieces: [...new Set([...a.pieces, ...b.pieces])] }); }
  jumps.sort((x, y) => Math.max(Math.abs(y.dSide), y.within) - Math.max(Math.abs(x.dSide), x.within));
  console.log('\nlargest lateral JUMPS of the drawn centre line between neighbouring stations (dSide, m) or between the two rows drawn at one station (within):');
  for (const j of jumps.slice(0, 15)) console.log('  s', j.from.toFixed(1).padStart(8), '->', j.s.toFixed(1).padStart(8), 'dSide', j.dSide.toFixed(4).padStart(8), 'within', j.within.toFixed(4).padStart(8), 'pieces', j.pieces.join('/'));
  // around each joint: the side offset at the 4 stations before and after
  const pieces = require(path.join(T, 'src/core/document.js')).parse(text).pieces; const s0 = []; { let a = 0; for (const P of pieces) { s0.push(a); a += P.length; } }
  console.log('\nside offset (mm) of the drawn centre at the stations around each joint (-8 .. +8 m; a|b = the two rows drawn at that station):');
  const atS = new Map(st.map((x) => [x.s.toFixed(3), x]));
  for (let k = 0; k < pieces.length; k++) { const sJ = (s0[k] + pieces[k].length) % LAP; const parts = []; for (let d = -8; d <= 8; d += 2) { const x = atS.get((((sJ + d) % LAP + LAP) % LAP).toFixed(3)); parts.push(x ? x.side.map((v) => (v * 1000).toFixed(0)).join('|') : '-'); } console.log('  ', (pieces[k].id + '|' + pieces[(k + 1) % pieces.length].id).padEnd(8), 's', String(sJ).padStart(6), parts.map((p) => p.padStart(10)).join('')); }
  fs.writeFileSync(OUTJ, JSON.stringify({ st, jumps: jumps.slice(0, 60) }));
})().catch((e) => { console.error('ERR', e.stack); process.exit(1); });

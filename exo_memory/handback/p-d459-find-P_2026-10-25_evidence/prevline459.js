// prevline459.js (D459, P): the preview's DRAWN centre line (app/preview/look.js linesFor: the lerp at u = 0 between the two row vertices either side of it, per batch)
// against the geometry's own centre (the core path's station frame + the profile's point at u = 0), row by row over the whole lap: the lateral and vertical offset of the
// drawn point from the true centre, and where that offset JUMPS between neighbouring rows (a jump is a visible sideways break in the line; a constant offset is not).
//   node prevline459.js <tree> <save> <out.json>
'use strict';
const os = require('os'); os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
const fs = require('fs'), path = require('path'); const [T, F, OUTJ] = process.argv.slice(2);
(async () => {
  const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
  const { createTrackModel } = require(path.join(T, 'app/preview/trackmodel.js'));
  const { linesFor, LIFT } = require(path.join(T, 'app/preview/look.js'));
  const Prof = require(path.join(T, 'src/geom/profile.js'));
  const text = fs.readFileSync(F, 'utf8');
  const sh = await createCoreShell({ brushFn: null, exporter: null, storage: { openDoc: async () => text } });
  await sh.open('TEST 10');
  const st = sh.getState(); const resolved = st.resolved; if (!resolved) throw new Error('document did not resolve');
  const t0 = Date.now(); const tm = createTrackModel(); const R = tm.update(resolved); console.log('trackmodel.update:', R.how, 'batches', R.batches.length, 'in', Date.now() - t0, 'ms');
  const S = R.path.samples, segments = R.segments || resolved.segments; const LAP = S[S.length - 1].s;
  console.log('path samples', S.length, 's', S[0].s, '..', S[S.length - 1].s, 'segments', segments.length, 'closed', R.path.closed);
  const segS0 = []; { let a = S[0].s; for (const g of segments) { segS0.push(a); a += g.length; } }
  const byS = new Map(); for (let i = 0; i < S.length; i++) byS.set(S[i].s.toFixed(6), i);
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const world = (p, M) => [p[0] * M[0] + p[1] * M[4] + p[2] * M[8] + M[12], p[0] * M[1] + p[1] * M[5] + p[2] * M[9] + M[13], p[0] * M[2] + p[1] * M[6] + p[2] * M[10] + M[14]];   // row-vector: world = local · M
  const trueCentre = (i) => { const sm = S[i], seg = segments[sm.seg], P = Prof.readAt(seg, Math.max(0, Math.min(seg.length, sm.s - segS0[sm.seg]))); const [X, Y] = Prof.offsetAt(P, 0); return { pos: add(sm.pos, add(mul(sm.L, X), mul(sm.U, Y))), L: sm.L, U: sm.U, T: sm.T }; };
  const rows = [];
  for (const b of R.batches) { if (b.seam || !b.cols || !b.rowS) continue; const ln = linesFor(b); if (!ln) continue; const K = b.cols, P = b.positions, N = b.normals; const { k0, t } = ln.centre;
    for (let r = 0; r < b.rowS.length; r++) { const s = b.rowS[r]; const v = (k) => { const i = (r * K + k) * 3; return [P[i] + N[i] * LIFT, P[i + 1] + N[i + 1] * LIFT, P[i + 2] + N[i + 2] * LIFT]; }; let m; if (t === 0) m = v(k0); else { const a = v(k0), c = v(k0 + 1); m = [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t, a[2] + (c[2] - a[2]) * t]; }
      const w = world(m, b.model); const i = byS.get(s.toFixed(6)); if (i === undefined) { rows.push({ s, batch: b.key, nostation: true }); continue; } const c = trueCentre(i); const d = sub(w, c.pos);
      rows.push({ s, batch: b.key, piece: b.piece, K, k0, t: +t.toFixed(4), uk0: b.us[k0], uk1: b.us[Math.min(K - 1, k0 + 1)], side: dot(d, c.L), up: dot(d, c.U), along: dot(d, c.T) }); } }
  rows.sort((a, b) => a.s - b.s || (a.piece - b.piece));
  const bad = rows.filter((r) => r.nostation); console.log('rows', rows.length, 'with no station of their own', bad.length);
  // jumps between neighbouring rows (by s), lateral
  const jumps = []; for (let i = 1; i < rows.length; i++) { const a = rows[i - 1], b = rows[i]; if (a.nostation || b.nostation) continue; jumps.push({ s: b.s, from: a.batch, to: b.batch, dSide: b.side - a.side, dUp: b.up - a.up, sideA: a.side, sideB: b.side, upA: a.up, upB: a.up, K: a.K + '->' + b.K }); }
  // the lap seam: the last row against the first
  { const a = rows[rows.length - 1], b = rows[0]; jumps.push({ s: 0, from: a.batch, to: b.batch, dSide: b.side - a.side, dUp: b.up - a.up, sideA: a.side, sideB: b.side, K: a.K + '->' + b.K, seam: true }); }
  jumps.sort((x, y) => Math.abs(y.dSide) - Math.abs(x.dSide));
  console.log('\nlargest lateral JUMPS of the drawn centre line between neighbouring rows (m; + toward L), with the offset before and after and the batches:');
  for (const j of jumps.slice(0, 15)) console.log('  s', j.s.toFixed(1).padStart(8), 'dSide', j.dSide.toFixed(4).padStart(8), 'side', j.sideA.toFixed(4).padStart(8), '->', j.sideB.toFixed(4).padStart(8), 'dUp', j.dUp.toFixed(4).padStart(8), 'K', j.K.padEnd(9), j.from, '->', j.to, j.seam ? '(lap seam)' : '');
  const mx = rows.filter((r) => !r.nostation).reduce((m, r) => Math.max(m, Math.abs(r.side)), 0), mu = rows.filter((r) => !r.nostation).reduce((m, r) => Math.max(m, Math.abs(r.up - LIFT)), 0);
  console.log('\nlargest |side| offset of the drawn line from the true centre anywhere:', mx.toFixed(4), 'm; largest |up - LIFT|:', mu.toFixed(4), 'm');
  // per piece: K, k0, t, us around the centre, and the side offset at its first and last row
  console.log('\nper batch: K columns, centre lerp k0/t and u either side, side offset first row -> last row:');
  const seen = new Set(); for (const r of rows) { if (r.nostation || seen.has(r.batch)) continue; seen.add(r.batch); const last = rows.filter((x) => x.batch === r.batch).pop(); console.log('  ', r.batch.padEnd(22), 's', r.s.toFixed(1).padStart(8), '..', last.s.toFixed(1).padStart(8), 'K', String(r.K).padStart(4), 'k0', String(r.k0).padStart(3), 't', r.t.toFixed(4), 'u', (+r.uk0).toFixed(3), '..', (+r.uk1).toFixed(3), 'side', r.side.toFixed(4), '->', last.side.toFixed(4)); }
  fs.writeFileSync(OUTJ, JSON.stringify({ rows, jumps: jumps.slice(0, 50) }));
})().catch((e) => { console.error('ERR', e.stack); process.exit(1); });

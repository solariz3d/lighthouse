// probe447c.js (P, D447 review): does a tool he has reach Q7? A SHARP corner (src/core/sharp.js extendSharp, ramps of 4 m) turning RIGHT laid straight after
// a left turn that ends still turning (extend, targets kh +1/300): the turn rate flips from +1/300 to -1/R in 4 m. Control: the same sharp corner after a straight.
//   node probe447c.js <tree>
'use strict';
const path = require('path'); const T = path.resolve(process.argv[2]);
const r = (p) => require(path.join(T, p));
const D = r('src/core/document.js'), AD = r('src/core/adapter.js'), { extend } = r('src/core/extend.js'), { extendTurnBy } = r('src/core/turnby.js'), { extendSharp } = r('src/core/sharp.js');
const { close } = r('src/core/close.js'), F = r('src/core/finish.js'), CJ = r('app/core/closejob.js');
const DEG = Math.PI / 180, Q = (300 * Math.PI) / 2;
function leanStats(doc) {
  const { segments, path: p } = AD.toPath(doc, { step: 2 }); const per = new Map(); let n = 0, out = 0, worst = Infinity, sum = 0, worstAt = null;
  for (const q of p.samples) {
    const g = segments[q.seg]; if (g.kind === 'gap') continue; const k = q.kvec, kh = Math.hypot(k[0], k[2]); if (kh < 1 / 600) continue;
    const l = Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[2] * k[2]) / kh))) / DEG; n++; sum += l; if (l < -5) out++; if (l < worst) { worst = l; worstAt = { s: q.s, id: g.id }; }
    const e = per.get(g.id) || { n: 0, sum: 0, min: Infinity, out: 0 }; e.n++; e.sum += l; e.min = Math.min(e.min, l); if (l < -5) e.out++; per.set(g.id, e);
  }
  return { curved: n, out, worst, worstAt, mean: n ? sum / n : null, per: [...per].map(([id, e]) => `${id}:n${e.n} out${e.out} mean${(e.sum / e.n).toFixed(1)} min${e.min.toFixed(1)}`).join(' ') };
}
const phiDiff = (a, b) => a.pieces.map((P, i) => { const Qp = b.pieces[i]; if (!Qp || Qp.channels.phi.length !== P.channels.phi.length) return null; const m = Math.max(...P.channels.phi.map((x, j) => Math.abs(Qp.channels.phi[j] - x))); return m > 0 ? `${P.id} ${(m / DEG).toFixed(1)}°` : null; }).filter(Boolean);
const f1 = (x) => (x == null || !Number.isFinite(x) ? '-' : x.toFixed(1));
const T90 = (d, L = Q, sign = 1) => extendTurnBy(d, { length: L }, sign * 90 * DEG), S = (d, L) => extend(d, { length: L });
for (const [name, mk] of [
  ['sharp-after-left', (d) => { d = extend(d, { length: 300, targets: { kh: 1 / 300 } }); d = extendSharp(d, {}, { angle: -60 * DEG, R: 150, ramp: 4 }); return extend(d, { length: 150 }); }],
  ['sharp-after-straight', (d) => { d = S(d, 300); d = extendSharp(d, {}, { angle: -60 * DEG, R: 150, ramp: 4 }); return extend(d, { length: 150 }); }],
]) {
  let d = D.createDoc('probe'); d = extend(d, { length: 100, family: 'bowl' }); d = T90(d); d = S(d, 700); d = T90(d); d = S(d, 100);
  try { d = mk(d); } catch (e) { console.log(`[${name}] build threw: ${e.message}`); continue; }
  d = S(d, 100); d = T90(d); d = S(d, 100); d = T90(d); d = S(d, 400);
  const t0 = Date.now(); let r2; try { r2 = CJ.runCloseBest({ doc: d }); } catch (e) { console.log(`[${name}] press threw: ${e.message}`); continue; }
  console.log(`[${name}] open ${d.pieces.length} pieces; press (runCloseBest) ${((Date.now() - t0) / 1000).toFixed(1)} s: converged ${r2.converged}, route ${r2.route}, report: ${String(r2.report).slice(0, 220)}`);
  if (!r2.converged) { console.log(`  tried: ${r2.tried.map((t) => `${t.route}: ${(t.refused || t.miss || 'closed').slice(0, 90)}`).join(' | ')}`); }
  else { const st = leanStats(r2.doc); console.log(`  press lap: curved ${st.curved}, out ${st.out}, worst ${f1(st.worst)}° at ${st.worstAt ? st.worstAt.id + ' s ' + st.worstAt.s.toFixed(0) : '-'}, mean ${f1(st.mean)}°; phi changed from the open lap: ${phiDiff(d, r2.doc).join(', ') || 'none'}`); console.log(`  per piece: ${st.per}`); }
  // and bankLap alone on the lap closed round its last piece, to see the backstop apart from the press
  let c; try { c = close(d, { edited: [d.pieces.length - 1] }); } catch (e) { console.log(`  close() threw: ${e.message}`); continue; }
  if (!c.converged) { console.log(`  close() did not converge: ${c.report}`); continue; }
  const b = F.bankLap(c.doc), st = leanStats(b);
  console.log(`  bankLap on close(): same object ${b === c.doc}; curved ${st.curved}, out ${st.out}, worst ${f1(st.worst)}°, mean ${f1(st.mean)}°; per piece: ${st.per}`);
}

// probe447f.js (P, D447 re-read of the finding-1 fix, d447-o 83eaf20): the flip pins read off the control points, the 30 m gap, and an attempt on W1 (the per-piece
// withhold, the one lean-out guard left): flips slower than the 30 m gap rule sees but faster than the bank can roll (0.84 °/m).
//   node probe447f.js <tree> <cases>   cases: sharp s5 s6 t50 t60 t70 t80 t100 e60 e80 ramp40 ramp100 all
'use strict';
const path = require('path'); const T = path.resolve(process.argv[2]), CASES = (process.argv[3] || 'all').split(',');
const r = (p) => require(path.join(T, p));
const D = r('src/core/document.js'), AD = r('src/core/adapter.js'), { extend } = r('src/core/extend.js'), { extendTurnBy } = r('src/core/turnby.js'), { extendSharp } = r('src/core/sharp.js');
const { close } = r('src/core/close.js'), F = r('src/core/finish.js'), CJ = r('app/core/closejob.js');
const DEG = Math.PI / 180, Q = (300 * Math.PI) / 2, ZONE = 2 * ((0.75 * Math.atan(((460 / 3.6) ** 2 / 300) / 9.80665) / DEG) / (0.9 * r('src/validate/index.js').ROLL_AMBER_DEG_M));
/** the lap's s wherever the sampled turn rate changes sign between two turning stations no more than `gap` m apart (the row's finder at gap 30) */
function flips(doc, gap) { const out = []; let s0 = 0, last = 0, lastS = -Infinity;
  for (const P of doc.pieces) { if (P.type === 'road') for (let s = 0; s <= P.length; s += 2) { const k = D.valuesAt(P, Math.min(s, P.length)).kh; if (Math.abs(k) > 1 / 600) { const sg = Math.sign(k); if (last && sg !== last && s0 + s - lastS <= gap) out.push({ s: s0 + s, gap: s0 + s - lastS }); last = sg; lastS = s0 + s; } } s0 += P.length || 0; }
  return out; }
function leanStats(doc) {
  const { segments, path: p } = AD.toPath(doc, { step: 2 }), per = new Map(), fz = flips(doc, 150); let n = 0, out = 0, worst = Infinity, sum = 0, worstAt = null;
  for (const q of p.samples) {
    const g = segments[q.seg]; if (g.kind === 'gap') continue; const k = q.kvec, kh = Math.hypot(k[0], k[2]); if (kh < 1 / 600) continue;
    const l = Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[2] * k[2]) / kh))) / DEG; n++; sum += l; if (l < -5) out++; if (l < worst) { worst = l; worstAt = { s: q.s, id: g.id }; }
    const far = !fz.some((f) => Math.abs(q.s - f.s) < ZONE);
    const e = per.get(g.id) || { n: 0, sum: 0, min: Infinity, out: 0, fn: 0, fsum: 0 }; e.n++; e.sum += l; e.min = Math.min(e.min, l); if (l < -5) e.out++; if (far) { e.fn++; e.fsum += l; } per.set(g.id, e);
  }
  return { curved: n, out, worst, worstAt, mean: n ? sum / n : null, per: [...per].map(([id, e]) => `${id}:n${e.n} out${e.out} mean${(e.sum / e.n).toFixed(1)} min${e.min.toFixed(1)}${e.fn ? ' far' + (e.fsum / e.fn).toFixed(1) : ''}`).join(' ') };
}
const phiDiff = (a, b) => a.pieces.map((P, i) => { const Qp = b.pieces[i]; if (!Qp || Qp.channels.phi.length !== P.channels.phi.length) return null; const m = Math.max(...P.channels.phi.map((x, j) => Math.abs(Qp.channels.phi[j] - x))); return m > 0 ? `${P.id} ${(m / DEG).toFixed(1)}°` : null; }).filter(Boolean);
const f1 = (x) => (x == null || !Number.isFinite(x) ? '-' : x.toFixed(1));
/** the control points of the named pieces: Greville s on the lap, stored kh as a radius, and the bank the plan added (banked − closed), in degrees */
function dump(closed, banked, ids) {
  let s0 = 0; const lines = [];
  closed.pieces.forEach((P, p) => { if (ids.includes(P.id)) { const U = D.knotVector(P), B = banked.pieces[p];
    lines.push(`    ${P.id} (${Math.round(P.length)} m, ${P.channels.kh.length} points): ` + P.channels.kh.map((k, i) => `[${(s0 + (U[i + 1] + U[i + 2] + U[i + 3]) / 3).toFixed(0)}m R${Math.abs(k) > 1e-9 ? (1 / k).toFixed(0) : 'inf'} +${((B.channels.phi[i] - P.channels.phi[i]) / DEG).toFixed(1)}°]`).join(' ')); }
    s0 += P.length || 0; });
  return lines.join('\n');
}
const T90 = (d, L = Q, sign = 1) => extendTurnBy(d, { length: L }, sign * 90 * DEG), S = (d, L) => extend(d, { length: L });
function rect(sPieces, { lat = 240, adv = 560 } = {}) {
  const b = 100, c = 100, e = 100, a = e + lat, f = b + c + adv - 100;
  let d = D.createDoc('probe'); d = extend(d, { length: 100, family: 'bowl' }); d = T90(d); d = S(d, a); d = T90(d); d = S(d, b);
  d = sPieces(d); d = S(d, c); d = T90(d); d = S(d, e); d = T90(d); d = S(d, f);
  return d;
}
const flip = (tr) => (d) => { d = extend(d, { length: 300, targets: { kh: 1 / 300 }, transition: 20 }); d = extend(d, { length: 300, targets: { kh: -1 / 300 }, transition: tr }); return extend(d, { length: 150, targets: { kh: 0 }, transition: 20 }); };
// e-cases: the panel's default (no "at start" tick): the blend runs over the WHOLE piece, so a short piece turning the other way IS a flip over its length
const epiece = (L) => (d) => { d = extend(d, { length: 300, targets: { kh: 1 / 300 }, transition: 20 }); d = extend(d, { length: L, targets: { kh: -1 / 300 } }); d = extend(d, { length: 300 - L, targets: { kh: -1 / 300 } }); return extend(d, { length: 150, targets: { kh: 0 }, transition: 20 }); };
function sharpLap(ramp) {
  let d = D.createDoc('probe'); d = extend(d, { length: 100, family: 'bowl' }); d = T90(d); d = S(d, 700); d = T90(d); d = S(d, 100);
  d = extend(d, { length: 300, targets: { kh: 1 / 300 } }); d = extendSharp(d, {}, { angle: -60 * DEG, R: 150, ramp }); d = extend(d, { length: 150 });
  d = S(d, 100); d = T90(d); d = S(d, 100); d = T90(d); d = S(d, 400); return d;
}
const cases = { sharp: () => sharpLap(4), ramp40: () => sharpLap(40), ramp100: () => sharpLap(100), s5: () => rect(flip(20)), s6: () => rect(flip(40)), t50: () => rect(flip(50)), t60: () => rect(flip(60)), t70: () => rect(flip(70)), t80: () => rect(flip(80)), t100: () => rect(flip(100)), e60: () => rect(epiece(60)), e80: () => rect(epiece(80)) };
const ALL = Object.keys(cases);
for (const name of CASES.flatMap((x) => (x === 'all' ? ALL : [x]))) {
  let d; try { d = cases[name](); } catch (e) { console.log(`[${name}] build threw: ${e.message}`); continue; }
  const ids = d.pieces.slice(5, 9).map((P) => P.id);
  let c; try { c = close(d, { edited: [d.pieces.length - 1] }); } catch (e) { console.log(`[${name}] close() threw: ${e.message}`); continue; }
  if (!c.converged) { console.log(`[${name}] close() did not converge: ${c.report}`); continue; }
  const W = F.bankLapWith(c.doc), b = W.doc, before = leanStats(c.doc), after = leanStats(b), f30 = flips(c.doc, 30), f150 = flips(c.doc, 150);
  console.log(`[${name}] closed by close(): ${c.doc.pieces.length} pieces; flips by the row's finder (gap <= 30 m): ${f30.map((f) => f.s.toFixed(0) + 'm/' + f.gap.toFixed(0) + 'm').join(' ') || 'none'}; sign changes <= 150 m: ${f150.map((f) => f.s.toFixed(0) + 'm/' + f.gap.toFixed(0) + 'm').join(' ') || 'none'}`);
  console.log(`  bankLapWith: same object ${b === c.doc}; eased ${W.eased.join(',') || '-'}; withheld ${W.withheld.join(',') || '-'}; phi changed: ${phiDiff(c.doc, b).join(', ') || 'none'}`);
  console.log(`  before: curved ${before.curved}, out ${before.out}, worst ${f1(before.worst)}°; after: curved ${after.curved}, out ${after.out}, worst ${f1(after.worst)}° at ${after.worstAt ? after.worstAt.id + ' s ' + after.worstAt.s.toFixed(0) : '-'}, mean ${f1(after.mean)}°`);
  console.log(`  after, per piece: ${after.per}`);
  console.log(`  the control points at the flip (added bank):\n${dump(c.doc, b, ids)}`);
  const t0 = Date.now(); let r2; try { r2 = CJ.runCloseBest({ doc: d }); } catch (e) { console.log(`  press threw: ${e.message}`); continue; }
  console.log(`  press (runCloseBest) ${((Date.now() - t0) / 1000).toFixed(1)} s: converged ${r2.converged}, route ${r2.route}\n  report: ${r2.report}`);
  if (!r2.converged) { console.log(`  tried: ${r2.tried.map((t) => `${t.route}: ${(t.refused || t.miss || 'closed').slice(0, 90)}`).join(' | ')}`); continue; }
  const st = leanStats(r2.doc);
  console.log(`  press lap: curved ${st.curved}, out ${st.out}, worst ${f1(st.worst)}° at ${st.worstAt ? st.worstAt.id + ' s ' + st.worstAt.s.toFixed(0) : '-'}, mean ${f1(st.mean)}°; phi changed from the open lap: ${phiDiff(d, r2.doc).join(', ') || 'none'}`);
  console.log(`  press lap per piece: ${st.per}`);
}

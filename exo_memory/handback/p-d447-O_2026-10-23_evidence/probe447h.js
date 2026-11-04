// probe447h.js (P, D447 third re-read, d447-o 05cdb9d; from probe447g.js: a tree without bankLapWith (the base e8e34d0) is pressed only): probe447f's laps plus attacks on W1 (the per-piece withhold) and X4 (the 'no curve banked'
// words): gentle links under CURVED_KH between opposite corners (flipsOf calls them straight; bankPlan banks them), true straights of 40–60 m between opposite
// corners (the dead band around FLIP_STRAIGHT_M), long transitions, and short curves away from any flip (the mean bar's FLIP_ZONE exemption).
//   node probe447g.js <tree> <cases|all>
'use strict';
const path = require('path'); const T = path.resolve(process.argv[2]), CASES = (process.argv[3] || 'all').split(',');
const r = (p) => require(path.join(T, p));
const D = r('src/core/document.js'), AD = r('src/core/adapter.js'), { extend } = r('src/core/extend.js'), { extendTurnBy } = r('src/core/turnby.js'), { extendSharp } = r('src/core/sharp.js');
const { close } = r('src/core/close.js'), F = r('src/core/finish.js'), CJ = r('app/core/closejob.js');
const DEG = Math.PI / 180, Q = (300 * Math.PI) / 2, ZONE = 2 * ((0.75 * Math.atan(((460 / 3.6) ** 2 / 300) / 9.80665) / DEG) / (0.9 * r('src/validate/index.js').ROLL_AMBER_DEG_M));
/** the lap's s wherever the sampled turn rate changes sign between two turning stations no more than `gap` m apart (the row's finder at gap 30) */
function flips(doc, gap) { if (F.flipsOf && gap === 'tree') return F.flipsOf(doc).map(([a, b]) => ({ s: b, gap: b - a, a, b }));
  const out = []; let s0 = 0, last = 0, lastS = -Infinity;
  for (const P of doc.pieces) { if (P.type === 'road') for (let s = 0; s <= P.length; s += 2) { const k = D.valuesAt(P, Math.min(s, P.length)).kh; if (Math.abs(k) > 1 / 600) { const sg = Math.sign(k); if (last && sg !== last && s0 + s - lastS <= gap) out.push({ s: s0 + s, gap: s0 + s - lastS, a: lastS, b: s0 + s }); last = sg; lastS = s0 + s; } } s0 += P.length || 0; }
  return out; }
function leanStats(doc) {
  const { segments, path: p } = AD.toPath(doc, { step: 2 }), per = new Map(), fz = F.flipsOf ? flips(doc, 'tree') : flips(doc, 150); let n = 0, out = 0, worst = Infinity, sum = 0, worstAt = null;
  for (const q of p.samples) {
    const g = segments[q.seg]; if (g.kind === 'gap') continue; const k = q.kvec, kh = Math.hypot(k[0], k[2]); if (kh < 1 / 600) continue;
    const l = Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[2] * k[2]) / kh))) / DEG; n++; sum += l; if (l < -5) out++; if (l < worst) { worst = l; worstAt = { s: q.s, id: g.id }; }
    const far = !fz.some((f) => q.s > f.a - ZONE && q.s < f.b + ZONE);
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
const gentle = (R, L) => (d) => { d = extend(d, { length: 300, targets: { kh: 1 / 300 }, transition: 20 }); d = extend(d, { length: L, targets: { kh: 1 / R }, transition: 20 }); d = extend(d, { length: 300, targets: { kh: -1 / 300 }, transition: 20 }); return extend(d, { length: 150, targets: { kh: 0 }, transition: 20 }); };
const straightBetween = (Sm) => (d) => { d = extend(d, { length: 300, targets: { kh: 1 / 300 }, transition: 20 }); d = extend(d, { length: Sm, targets: { kh: 0 }, transition: 20 }); d = extend(d, { length: 300, targets: { kh: -1 / 300 }, transition: 20 }); return extend(d, { length: 150, targets: { kh: 0 }, transition: 20 }); };
const shortCurve = (L) => (d) => { d = extend(d, { length: 200, targets: { kh: 0 } }); d = extend(d, { length: L, targets: { kh: 1 / 300 }, transition: 20 }); return extend(d, { length: 650 - L, targets: { kh: 0 }, transition: 20 }); };
const cases = { sharp: () => sharpLap(4), ramp40: () => sharpLap(40), ramp100: () => sharpLap(100), s5: () => rect(flip(20)), s6: () => rect(flip(40)), t50: () => rect(flip(50)), t50w: () => rect(flip(50), { lat: 260 }), t60: () => rect(flip(60)), t70: () => rect(flip(70)), t80: () => rect(flip(80)), t100: () => rect(flip(100)), t150: () => rect(flip(150)), t200: () => rect(flip(200)), e60: () => rect(epiece(60)), e80: () => rect(epiece(80)),
  g650: () => rect(gentle(650, 100)), g601: () => rect(gentle(601, 100)), g900: () => rect(gentle(900, 100)), g650s60: () => rect(gentle(650, 60)), g650s200: () => rect(gentle(650, 200)), gm650: () => rect(gentle(-650, 100)),
  x40: () => rect(straightBetween(40)), x42: () => rect(straightBetween(42)), x44: () => rect(straightBetween(44)), x46: () => rect(straightBetween(46)), x50: () => rect(straightBetween(50)), x60: () => rect(straightBetween(60)), x80: () => rect(straightBetween(80)),
  short60: () => rect(shortCurve(60)), short100: () => rect(shortCurve(100)), short140: () => rect(shortCurve(140)), short200: () => rect(shortCurve(200)) };
const ALL = Object.keys(cases);
// dynamic cases: xN[wLAT] a true straight of N m between opposite 300 m corners; gR-L[wLAT] a gentle link of L m at radius R; tN[wLAT] a transition of N m
function dyn(name) { let m;
  if ((m = name.match(/^x([0-9]+)(?:w([0-9]+))?$/))) return () => rect(straightBetween(+m[1]), m[2] ? { lat: +m[2] } : {});
  if ((m = name.match(/^g([0-9]+)-([0-9]+)(?:w([0-9]+))?$/))) return () => rect(gentle(+m[1], +m[2]), m[3] ? { lat: +m[3] } : {});
  if ((m = name.match(/^t([0-9]+)w([0-9]+)$/))) return () => rect(flip(+m[1]), { lat: +m[2] });
  throw new Error('no case ' + name); }
for (const name of CASES.flatMap((x) => (x === 'all' ? ALL : [x]))) {
  let d; try { d = (cases[name] || dyn(name))(); } catch (e) { console.log(`[${name}] build threw: ${e.message}`); continue; }
  const ids = d.pieces.slice(5, 9).map((P) => P.id);
  let c; try { c = close(d, { edited: [d.pieces.length - 1] }); } catch (e) { console.log(`[${name}] close() threw: ${e.message}`); continue; }
  if (!c.converged) { console.log(`[${name}] close() did not converge: ${c.report}`); continue; }
  if (F.bankLapWith) {
    const W = F.bankLapWith(c.doc), b = W.doc, before = leanStats(c.doc), after = leanStats(b), f30 = F.flipsOf ? flips(c.doc, 'tree') : flips(c.doc, 30), f150 = flips(c.doc, 150);
    console.log(`[${name}] closed by close(): ${c.doc.pieces.length} pieces; flips by the tree's flipsOf (or gap <= 30): ${f30.map((f) => f.s.toFixed(0) + 'm/' + f.gap.toFixed(0) + 'm').join(' ') || 'none'}; sign changes <= 150 m: ${f150.map((f) => f.s.toFixed(0) + 'm/' + f.gap.toFixed(0) + 'm').join(' ') || 'none'}`);
    console.log(`  bankLapWith: same object ${b === c.doc}; eased ${W.eased.join(',') || '-'}; withheld ${W.withheld.join(',') || '-'}; none ${W.none || '-'}; phi changed: ${phiDiff(c.doc, b).join(', ') || 'none'}`);
    console.log(`  before: curved ${before.curved}, out ${before.out}, worst ${f1(before.worst)}°; after: curved ${after.curved}, out ${after.out}, worst ${f1(after.worst)}° at ${after.worstAt ? after.worstAt.id + ' s ' + after.worstAt.s.toFixed(0) : '-'}, mean ${f1(after.mean)}°`);
    console.log(`  after, per piece: ${after.per}`);
    console.log(`  the control points at the flip (added bank):\n${dump(c.doc, b, ids)}`);
    } else console.log(`[${name}] closed by close(): ${c.doc.pieces.length} pieces; this tree has no bankLapWith (base); sign changes <= 150 m: ${flips(c.doc, 150).map((f) => f.s.toFixed(0) + "m/" + f.gap.toFixed(0) + "m").join(" ") || "none"}`);
  const t0 = Date.now(); let r2; try { r2 = CJ.runCloseBest({ doc: d }); } catch (e) { console.log(`  press threw: ${e.message}`); continue; }
  console.log(`  press (runCloseBest) ${((Date.now() - t0) / 1000).toFixed(1)} s: converged ${r2.converged}, route ${r2.route}\n  report: ${r2.report}`);
  if (!r2.converged) { console.log(`  tried: ${r2.tried.map((t) => `${t.route}: ${(t.refused || t.miss || 'closed').slice(0, 90)}`).join(' | ')}`); continue; }
  const st = leanStats(r2.doc);
  console.log(`  press lap: curved ${st.curved}, out ${st.out}, worst ${f1(st.worst)}° at ${st.worstAt ? st.worstAt.id + ' s ' + st.worstAt.s.toFixed(0) : '-'}, mean ${f1(st.mean)}°; phi changed from the open lap: ${phiDiff(d, r2.doc).join(', ') || 'none'}`);
  console.log(`  press lap per piece: ${st.per}`);
}

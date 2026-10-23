// probe447b.js (P, D447 review): the second attempt on Q7 (the lean-out backstop), and the seam. node probe447b.js <tree> <case>[,...]   cases: s5 s6 seamturn all
//   s5: an S whose curvature FLIPS over a short transition (extend's transition 20 m: R 300 left held, then R 300 right, kh +1/300 to -1/300 in 20 m)
//   s6: the same flip, 40 m
//   seamturn: a lap whose LAST piece ends still turning at the start line (the seam between a turning end and an upright start)
'use strict';
const path = require('path'); const T = path.resolve(process.argv[2]), CASES = (process.argv[3] || 'all').split(',');
const r = (p) => require(path.join(T, p));
const D = r('src/core/document.js'), AD = r('src/core/adapter.js'), { extend } = r('src/core/extend.js'), { extendTurnBy } = r('src/core/turnby.js');
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
function report(name, closedDoc, banked) {
  const before = leanStats(closedDoc), after = leanStats(banked);
  console.log(`[${name}] closed: ${closedDoc.pieces.length} pieces, ${Math.round(closedDoc.pieces.reduce((a, P) => a + (P.length || 0), 0))} m`);
  console.log(`  bankLap returned the same object (nothing banked): ${banked === closedDoc}; phi changed: ${phiDiff(closedDoc, banked).join(', ') || 'none'}`);
  console.log(`  before: curved ${before.curved}, out ${before.out}, worst ${f1(before.worst)}°, mean ${f1(before.mean)}°`);
  console.log(`  after:  curved ${after.curved}, out ${after.out}, worst ${f1(after.worst)}° at ${after.worstAt ? after.worstAt.id + ' s ' + after.worstAt.s.toFixed(0) : '-'}, mean ${f1(after.mean)}°`);
  console.log(`  after, per piece: ${after.per}`);
}
function closeIt(d, name) {
  let c; try { c = close(d, { edited: [d.pieces.length - 1] }); } catch (e) { console.log(`[${name}] close() threw: ${e.message}`); return null; }
  if (!c.converged) { console.log(`[${name}] close() did not converge: ${c.report}`); return null; }
  return c.doc;
}
const T90 = (d, L = Q, sign = 1) => extendTurnBy(d, { length: L }, sign * 90 * DEG), S = (d, L) => extend(d, { length: L });
function rect(sPieces, { lat = 600, adv = 600 } = {}) {
  const b = 100, c = 100, e = 100, a = e + lat, f = b + c + adv - 100;
  let d = D.createDoc('probe'); d = extend(d, { length: 100, family: 'bowl' }); d = T90(d); d = S(d, a); d = T90(d); d = S(d, b);
  d = sPieces(d); d = S(d, c); d = T90(d); d = S(d, e); d = T90(d); d = S(d, f);
  return d;
}
const flip = (tr) => (d) => { d = extend(d, { length: 300, targets: { kh: 1 / 300 }, transition: tr }); d = extend(d, { length: 300, targets: { kh: -1 / 300 }, transition: tr }); return extend(d, { length: 150, targets: { kh: 0 }, transition: tr }); };
const cases = { s5: () => rect(flip(20), { lat: 240, adv: 560 }), s6: () => rect(flip(40), { lat: 240, adv: 560 }) };
function pressToo(name, d) {
  const t0 = Date.now(); let r2; try { r2 = CJ.runCloseBest({ doc: d }); } catch (e) { console.log(`  press threw: ${e.message}`); return; }
  console.log(`  press (runCloseBest) ${((Date.now() - t0) / 1000).toFixed(1)} s: converged ${r2.converged}, route ${r2.route}, report: ${String(r2.report).slice(0, 200)}`);
  if (r2.converged) { const st = leanStats(r2.doc); console.log(`  press lap: curved ${st.curved}, out ${st.out}, worst ${f1(st.worst)}°, mean ${f1(st.mean)}°; phi changed from the open lap: ${phiDiff(d, r2.doc).join(', ') || 'none'}; tried: ${r2.tried.map((t) => `${t.route}${t.refused ? ' refused' : t.miss ? ' miss(' + t.miss.slice(0, 60) + ')' : ''}`).join(' | ')}`); }
  else console.log(`  press tried: ${r2.tried.map((t) => `${t.route}: ${t.refused || t.miss || 'closed'}`).join(' | ').slice(0, 500)}`);
}
for (const name of CASES.flatMap((x) => (x === 'all' ? ['s5', 's6', 'seamturn'] : [x]))) {
  if (name === 'seamturn') {
    let d = D.createDoc('seamturn'); d = extend(d, { length: 100, family: 'bowl' }); d = T90(d); d = S(d, 700); d = T90(d); d = S(d, 100); d = T90(d); d = S(d, 100);
    d = extend(d, { length: Q, targets: { kh: 1 / 300 } });   // the last piece ends still turning, onto the start straight
    const c = closeIt(d, name); if (!c) continue;
    const b = F.bankLap(c); report(name, c, b);
    const L = b.pieces[b.pieces.length - 1], P1 = b.pieces[0];
    console.log(`  the seam: last piece's bank at its end ${(D.valuesAt(L, L.length).phi / DEG).toFixed(2)}°, its last four points ${L.channels.phi.slice(-4).map((x) => (x / DEG).toFixed(1)).join('/')}°; p1's first ${(D.valuesAt(P1, 0).phi / DEG).toFixed(2)}°; last piece kh at its end ${(1 / D.valuesAt(L, L.length).kh).toFixed(0)} m radius`);
    continue;
  }
  const d = cases[name](); const c = closeIt(d, name); if (!c) continue;
  const b = F.bankLap(c); report(name, c, b);
  pressToo(name, d);
}

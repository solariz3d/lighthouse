// probe447.js (P, D447 review): bankLap on laps the rows do not have. Nothing is written to any tree.
//   node probe447.js <tree> <case>[,<case>...]      cases: s2 s1 s3 s4 hb20 fin short all
// Each case builds an open lap (no private file), closes it by close() round the last piece, then runs finish.js bankLap on the closed lap, and prints:
// whether bankLap returned the SAME object (nothing banked: the backstop, or nothing upright), which pieces' bank channel changed and by how much, and the
// lean into the horizontal turn (D443's reading, as core_close_banks_lap.test.js leans()) over every curved station, before and after: count, leaning out
// (< -5 deg, closerLoad's bar), the worst, the mean. s2 also goes through the press (runCloseBest) to show what the keeper would get.
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
    const e = per.get(g.id) || { n: 0, sum: 0, min: Infinity }; e.n++; e.sum += l; e.min = Math.min(e.min, l); per.set(g.id, e);
  }
  return { curved: n, out, worst, worstAt, mean: n ? sum / n : null, per: [...per].map(([id, e]) => `${id}:n${e.n} mean${(e.sum / e.n).toFixed(1)} min${e.min.toFixed(1)}`).join(' ') };
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
// an S on one side of a rectangle of four left turns at R 300: the S advances the road 2R and shifts it 2R sideways; the straights make up the difference
function rect(sPieces, { lat = 600, adv = 600, first = null } = {}) {
  const b = 100, c = 100, e = 100, a = e + lat, f = b + c + adv - 100;
  let d = D.createDoc('probe'); d = extend(d, { length: 100, family: 'bowl', ...(first ? { first } : {}) }); d = T90(d); d = S(d, a); d = T90(d); d = S(d, b);
  d = sPieces(d); d = S(d, c); d = T90(d); d = S(d, e); d = T90(d); d = S(d, f);
  return d;
}
const cases = {
  // the S as two turnBy pieces, left then right, both ending straight: kh 0 at their joint, both curved, so D447 (d) relaxes the joint
  s2: () => rect((d) => T90(T90(d), Q, -1)),
  // the S inside ONE piece: kh eased from +1/300 to -1/300 across it (no joint to pin at all)
  s1: () => rect((d) => { d = extend(d, { length: Q / 2, targets: { kh: 1 / 300 } }); d = extend(d, { length: Q, targets: { kh: -1 / 300 } }); return extend(d, { length: Q / 2, targets: { kh: 0 } }); }),
  // the control: a 100 m straight between the S's two turns (both joints pinned by the rule)
  s3: () => rect((d) => T90(S(T90(d), 100), Q, -1), { adv: 700 }),
  // the S asymmetric: left at R 300 (471 m), right at R 600 (942 m)
  s4: () => rect((d) => T90(T90(d), 2 * Q, -1), { lat: 900, adv: 900 }),
  // the whole lap laid at a constant bank of 20 deg from its first piece (phi + = left side up): the start's bank is 20, so every piece is "upright" to bankLap
  hb20: () => rect((d) => S(d, 1), { lat: 1, adv: 1, first: { phi: 20 * DEG } }),
};
function pressToo(name, d) {
  const t0 = Date.now(); let r2; try { r2 = CJ.runCloseBest({ doc: d }); } catch (e) { console.log(`  press threw: ${e.message}`); return; }
  console.log(`  press (runCloseBest) ${((Date.now() - t0) / 1000).toFixed(1)} s: converged ${r2.converged}, route ${r2.route}, report: ${String(r2.report).slice(0, 160)}`);
  if (r2.converged) { const st = leanStats(r2.doc); console.log(`  press lap: curved ${st.curved}, out ${st.out}, worst ${f1(st.worst)}°, mean ${f1(st.mean)}°; tried: ${r2.tried.map((t) => `${t.route}${t.refused ? ' refused' : t.miss ? ' miss(' + t.miss.slice(0, 50) + ')' : ''}`).join(' | ')}`); }
  else console.log(`  press tried: ${r2.tried.map((t) => `${t.route}: ${t.refused || t.miss || 'closed'}`).join(' | ').slice(0, 400)}`);
}
for (const name of CASES.flatMap((x) => (x === 'all' ? ['s2', 's1', 's3', 's4', 'hb20', 'fin', 'short'] : [x]))) {
  if (name === 'fin') {
    // Finish lays the closer: does bankLap bank Finish's own (gently) banked pieces a second time? The window's pieces' bank before and after bankLap
    for (const L of [100, 400, 800]) {
      let d = D.createDoc('fin'); d = extend(d, { length: 100, family: 'bowl' }); d = T90(d); d = S(d, 100); d = T90(d); d = S(d, L);
      let f; try { f = F.finishToStart(d); } catch (e) { console.log(`[fin L${L}] finish threw: ${e.message}`); continue; }
      const b = F.bankLap(f.doc), win = f.window, maxPhi = (P) => Math.max(...P.channels.phi.map((x) => Math.abs(x) / DEG));
      console.log(`[fin L${L}] ${f.plan.report.slice(0, 120)}`);
      console.log(`  window ${win.map((p) => `${f.doc.pieces[p].id}(|phi|max ${maxPhi(f.doc.pieces[p]).toFixed(1)}°)`).join(' ')}; bankLap same object: ${b === f.doc}; phi changed: ${phiDiff(f.doc, b).join(', ') || 'none'}`);
      const st = leanStats(b); console.log(`  after: curved ${st.curved}, out ${st.out}, worst ${f1(st.worst)}°, mean ${f1(st.mean)}°`);
    }
    continue;
  }
  if (name === 'short') {
    // a curve laid as three pieces, the middle one 3 m (under bankLap's 5 m path step): is it banked, and does the curve bank as one across it?
    let d = D.createDoc('short'); d = extend(d, { length: 100, family: 'bowl' }); d = T90(d); d = S(d, 100);
    d = extend(d, { length: Q / 2, targets: { kh: 1 / 300 } }); d = extend(d, { length: 3 }); d = extendTurnBy(d, { length: Q / 2 }, 67.5 * DEG);
    d = S(d, 100); d = T90(d); d = S(d, 100); d = T90(d);
    const c = closeIt(d, name); if (!c) continue;
    const b = F.bankLap(c); report(name, c, b);
    console.log(`  the 3 m piece ${c.pieces[4].id}: kh ${c.pieces[4].channels.kh.map((k) => (1 / k).toFixed(0)).join('/')} m radius, phi after ${b.pieces[4].channels.phi.map((x) => (x / DEG).toFixed(1)).join('/')}°`);
    continue;
  }
  const d = cases[name](); const c = closeIt(d, name); if (!c) continue;
  const b = F.bankLap(c); report(name, c, b);
  if (name === 'hb20') console.log(`  start phi ${(D.valuesAt(c.pieces[0], 0).phi / DEG).toFixed(1)}°; phi after, per piece max: ${b.pieces.map((P) => (Math.max(...P.channels.phi) / DEG).toFixed(1)).join(' ')}`);
  if (name === 's2' || name === 's1') pressToo(name, d);
}

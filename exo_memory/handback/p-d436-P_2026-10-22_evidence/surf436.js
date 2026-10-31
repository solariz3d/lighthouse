// surf436.js (D436, P): the kn5's ROAD surface (its triangles, ray-cast, so the stretch between vertex rows counts) against the core's own surface,
// on a grid of (s, x): s every DS m through +-W m of each joint, x every DX m across the road; the height is the kn5 surface's offset along the station's
// up vector from the core point at (s, x). Reports the largest |height| in each window and the largest change of height between neighbouring s at the
// same x (a step), with where. Then the whole lap at a coarser grid for the largest |height| and step anywhere (hits within +-0.5 m only, so a pass
// overhead is not taken for the road).   node surf436.js <tree> <save> <kn5> <jointsCSV> [W=60] [DS=0.25] [DX=0.5] [out.json]
const fs = require('fs'), path = require('path'); const [T, F, K, J, Wr, DSr, DXr, OUT] = process.argv.slice(2); const W = Wr ? +Wr : 60, DS = DSr ? +DSr : 0.25, DX = DXr ? +DXr : 0.5;
const D = require(path.join(T, 'src/core/document.js')), AD = require(path.join(T, 'src/core/adapter.js')), Prof = require(path.join(T, 'src/geom/profile.js'));
const doc = D.parse(fs.readFileSync(F, 'utf8')); const { segments, path: p } = AD.toPath(doc, { step: 2 }); const S = p.samples, LAP = doc.pieces.reduce((a, q) => a + q.length, 0);
const segS0 = []; { let a = S[0].s; for (const g of segments) { segS0.push(a); a += g.length; } }
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const g = require('./kn5grid.js')(T, K);
const frameAt = (s) => { let ss = ((s % LAP) + LAP) % LAP; let i = Math.min(S.length - 1, Math.max(0, Math.floor((ss - S[0].s) / 2))); while (i + 1 < S.length && S[i + 1].s <= ss) i++; while (i > 0 && S[i].s > ss) i--; const sm = S[i], sn = S[(i + 1) % S.length], f = (ss - sm.s) / 2; const lerp = (a, b) => a.map((v, k) => v + (b[k] - v) * f); const norm = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); }; return { s: ss, pos: lerp(sm.pos, sn.pos), T: norm(lerp(sm.T, sn.T)), L: norm(lerp(sm.L, sn.L)), U: norm(lerp(sm.U, sn.U)), seg: sm.seg }; };
const profileAt = (fr) => { const seg = segments[fr.seg]; return Prof.readAt(seg, Math.max(0, Math.min(seg.length, fr.s - segS0[fr.seg]))); };
const H0 = 0.5, HMAX = 1.0;
function heightAt(s, x) {
  const fr = frameAt(s), P = profileAt(fr); const u0 = P.u[0], u1 = P.u[P.u.length - 1]; if (x < u0 || x > u1) return null;
  // the profile point whose lateral coordinate is x (X(u) is monotonic where there is no folded lip; bisection)
  let a = u0, b = u1; for (let k = 0; k < 40; k++) { const m = (a + b) / 2; if (Prof.offsetAt(P, m)[0] < x) a = m; else b = m; } const [X, Y] = Prof.offsetAt(P, (a + b) / 2);
  const core = add(fr.pos, add(mul(fr.L, X), mul(fr.U, Y))); const o = add(core, mul(fr.U, H0)); const hit = g.ray(o, mul(fr.U, -1), HMAX);
  return hit ? { h: H0 - hit.t, name: hit.name, core } : { h: NaN, name: 'no hit', core };
}
const out = { joints: {}, lap: null };
const xs = []; for (let x = -12.5; x <= 12.5 + 1e-9; x += DX) xs.push(+x.toFixed(3));
for (const j of J.split(',').map(Number)) {
  let maxH = { a: -1 }, maxStep = { a: -1 }, misses = 0, n = 0; const prev = new Map();
  for (let s = j - W; s <= j + W + 1e-9; s += DS) {
    for (const x of xs) { const r = heightAt(s, x); if (!r) continue; n++; if (Number.isNaN(r.h)) { misses++; prev.delete(x); continue; }
      if (Math.abs(r.h) > maxH.a) maxH = { a: Math.abs(r.h), h: r.h, s, x, name: r.name };
      const pv = prev.get(x); if (pv !== undefined) { const d = Math.abs(r.h - pv.h); if (d > maxStep.a) maxStep = { a: d, s0: pv.s, s1: s, x, h0: pv.h, h1: r.h, name: r.name }; } prev.set(x, { h: r.h, s }); }
  }
  console.log(`joint ${j} (+-${W} m, ${n} probes, ${misses} without a surface within +-0.5 m): kn5 surface vs the core: largest |height| ${(maxH.a * 1000).toFixed(1)} mm at s ${maxH.s.toFixed(2)} x ${maxH.x} (${maxH.name}); largest step between neighbouring s at one x ${(maxStep.a * 1000).toFixed(1)} mm at s ${maxStep.s0.toFixed(2)} -> ${maxStep.s1.toFixed(2)} x ${maxStep.x} (${(maxStep.h0 * 1000).toFixed(1)} -> ${(maxStep.h1 * 1000).toFixed(1)} mm, ${maxStep.name})`);
  out.joints[j] = { n, misses, maxH, maxStep };
}
// the whole lap, coarser
{ const XL = [-11, -6, 0, 6, 11]; let maxH = { a: -1 }, maxStep = { a: -1 }, misses = 0, n = 0; const prev = new Map(); const overs = [];
  for (let s = 0; s < LAP; s += 1) for (const x of XL) { const r = heightAt(s, x); if (!r) continue; n++; if (Number.isNaN(r.h)) { misses++; prev.delete(x); continue; } if (Math.abs(r.h) > maxH.a) maxH = { a: Math.abs(r.h), h: r.h, s, x, name: r.name }; if (Math.abs(r.h) > 0.02) overs.push({ s, x, h: r.h, name: r.name }); const pv = prev.get(x); if (pv !== undefined) { const d = Math.abs(r.h - pv.h); if (d > maxStep.a) maxStep = { a: d, s0: pv.s, s1: s, x, h0: pv.h, h1: r.h, name: r.name }; } prev.set(x, { h: r.h, s }); }
  console.log(`whole lap (1 m x 5 lines, ${n} probes, ${misses} without a surface within +-0.5 m): largest |height| ${(maxH.a * 1000).toFixed(1)} mm at s ${maxH.s} x ${maxH.x} (${maxH.name}); largest step ${(maxStep.a * 1000).toFixed(1)} mm at s ${maxStep.s0} -> ${maxStep.s1} x ${maxStep.x} (${maxStep.name}); probes over 20 mm: ${overs.length}`);
  for (const o of overs.slice(0, 30)) console.log('   over:', 's', o.s, 'x', o.x, (o.h * 1000).toFixed(1), 'mm', o.name);
  out.lap = { n, misses, maxH, maxStep, overs }; }
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out));

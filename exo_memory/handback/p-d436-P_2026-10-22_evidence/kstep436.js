// kstep436.js (D436, P): where on the lap the road under a car's line curves up or down SUDDENLY: the vertical curvature of the surface line at lateral u
// (u = 0 the centre, +-8.4 the keeper's wheel line in D433) from the core's path (step 0.5 m) and profile, and its change over 2 m along s (a step in
// curvature is a "block" the seat feels at once; a smooth ramp of curvature is not). Lists the largest steps on the lap with s, u, the piece, and the
// vertical acceleration the step adds at a speed.   node kstep436.js <tree> <save> <kmh> [top=12]
const fs = require('fs'), path = require('path'); const [T, F, KMH, TOP] = process.argv.slice(2); const v = (+KMH) / 3.6, top = TOP ? +TOP : 12;
const D = require(path.join(T, 'src/core/document.js')), AD = require(path.join(T, 'src/core/adapter.js')), Prof = require(path.join(T, 'src/geom/profile.js'));
const doc = D.parse(fs.readFileSync(F, 'utf8')); const { segments, path: p } = AD.toPath(doc, { step: 0.5 }); const S = p.samples, LAP = doc.pieces.reduce((a, q) => a + q.length, 0);
const segS0 = []; { let a = S[0].s; for (const g of segments) { segS0.push(a); a += g.length; } }
const s0 = []; { let a = 0; for (const P of doc.pieces) { s0.push(a); a += P.length; } } const pieceAt = (s) => { s = ((s % LAP) + LAP) % LAP; let i = doc.pieces.findIndex((P, k) => s >= s0[k] && s < s0[k] + P.length); return doc.pieces[i < 0 ? doc.pieces.length - 1 : i].id; };
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const US = [0, 8.4, -8.4]; const h = 0.5;
// the surface point at lateral u for every sample (u clamped inside the profile), then the curvature along s of that line, measured along the sample's up vector
const lines = US.map(() => []);
for (const sm of S) { const seg = segments[sm.seg], P = Prof.readAt(seg, Math.max(0, Math.min(seg.length, sm.s - segS0[sm.seg]))); const u0 = P.u[0], u1 = P.u[P.u.length - 1];
  US.forEach((u, k) => { const uu = Math.max(u0, Math.min(u1, u)); let a = u0, b = u1; for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (Prof.offsetAt(P, m)[0] < uu) a = m; else b = m; } const [X, Y] = Prof.offsetAt(P, (a + b) / 2); lines[k].push(add(sm.pos, add(mul(sm.L, X), mul(sm.U, Y)))); }); }
const NB = 4, hh = NB * h; const kap = US.map((u, k) => { const L = lines[k], n = L.length, out = new Float64Array(n); for (let i = NB; i + NB < n; i++) { const d2 = sub(add(L[i - NB], L[i + NB]), mul(L[i], 2)); out[i] = dot(d2, S[i].U) / (hh * hh); } return out; });   // over 2 m: the path samples 0.5 m apart carry a sub-millimetre alternation that a 0.5 m second difference amplifies 8x (checked at s 3300 against D433 bump.out)   // vertical curvature (1/m), + = curving up (pressing the car into the road)
const p100 = (x) => x * 100 * 180 / Math.PI; const steps = [];
const W = 4;   // samples: 2 m
for (let k = 0; k < US.length; k++) for (let i = W + NB + 1; i + W + NB + 1 < S.length; i++) { const d = kap[k][i + W] - kap[k][i - W]; steps.push({ s: S[i].s, u: US[k], d, before: kap[k][i - W], after: kap[k][i + W] }); }
steps.sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
// one entry per place: drop entries within 10 m of a larger one at the same u
const out = []; for (const e of steps) { if (out.some((o) => o.u === e.u && Math.abs(o.s - e.s) < 10)) continue; out.push(e); if (out.length >= top) break; }
console.log(`largest changes of vertical curvature over 2 m along s (deg/100 m; + = up, into the road), lap ${LAP} m, ${S.length} samples; the vertical g the change adds at ${KMH} km/h:`);
for (const e of out) console.log('  s', e.s.toFixed(1).padStart(8), 'u', String(e.u).padStart(5), pieceAt(e.s).padEnd(4), 'kv', p100(e.before).toFixed(2).padStart(7), '->', p100(e.after).toFixed(2).padStart(7), ' step', p100(e.d).toFixed(2).padStart(7), ' =', (v * v * e.d / 9.81).toFixed(2).padStart(6), 'g');
// and at the named joints, the same, within +-5 m
console.log('at the joints (the largest 2 m change within +-5 m of each, per u):');
const joints = []; { let a = 0; for (const P of doc.pieces) { a += P.length; joints.push({ s: a % LAP, name: P.id + '|' + (doc.pieces[(doc.pieces.indexOf(P) + 1) % doc.pieces.length]).id }); } }
for (const j of joints) { const parts = US.map((u) => { let best = { d: 0 }; for (const e of steps) if (e.u === u && Math.abs(((e.s - j.s + LAP / 2) % LAP + LAP) % LAP - LAP / 2) <= 5 && Math.abs(e.d) > Math.abs(best.d)) best = e; return `u ${String(u).padStart(4)}: ${p100(best.d || 0).toFixed(2).padStart(6)} (${(v * v * (best.d || 0) / 9.81).toFixed(2)} g)`; }); console.log('  ', j.name.padEnd(8), 's', j.s.toFixed(0).padStart(6), parts.join('  ')); }

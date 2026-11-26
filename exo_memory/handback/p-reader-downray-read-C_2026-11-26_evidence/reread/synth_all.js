'use strict';
// synth.js [repo]: pane C's own synthetic cases for the down-ray re-read and the landing guard (tools/piecewise.cjs). Synthetic geometry only.
const PW = require((process.argv[2] || 'G:/consonance-scratch/t180-downray-c') + '/tools/piecewise.cjs');
const D = Math.PI / 180;
function swept(profile, uMin, uMax, du, z0, z1, dz) { const T = [];
  for (let z = z0; z < z1 - 1e-9; z += dz) for (let u = uMin; u < uMax - 1e-9; u += du) {
    const [a, b, c, d] = [[u, z], [u + du, z], [u + du, z + dz], [u, z + dz]].map(([uu, zz]) => { const [x, y] = profile(uu); return [x, y, zz]; });
    T.push([...a, ...b, ...c], [...a, ...c, ...d]); } return T; }
const rot = (b) => ([x, y]) => [x * Math.cos(b) - y * Math.sin(b), x * Math.sin(b) + y * Math.cos(b)];
// a cupped road: a floor of 2*half, sides of `arc` m whose angle rises linearly to psi; banked by `bank` (left side up for +)
const cup = (half, arc, psi) => (u) => { const k = psi / arc, a = Math.abs(u), sg = Math.sign(u) || 1; if (a <= half) return [u, 0];
  const t = Math.min(arc, a - half); return [sg * (half + Math.sin(k * t) / k), (1 - Math.cos(k * t)) / k]; };
const out = [];
// ── A. the re-read over widths, banks, cup angles, strip depths ──
console.log('A. station on a 2 m strip under a cupped, banked road: read width W; want width within 0.5 m of W, centre within 0.3 m of the top centre');
for (const W of [12, 27, 38, 49]) for (const bankDeg of [0, 20, 40, 52, 58]) for (const [psiDeg, depth] of [[50, 1.5], [30, 1.5], [50, 0.8]]) {
  const arc = 4, half = W / 2 - arc, b = bankDeg * D, R = rot(b), prof = (u) => R(cup(half, arc, psiDeg * D)(u));
  const T = [...swept(prof, -W / 2, W / 2, 0.5, 0, 100, 2), ...swept((u) => R([u, -depth]), -1, 1, 0.5, 0, 100, 2)];
  const c0 = R([0.2, -depth]), n0 = R([0, 1]), st = [];
  for (let z = 8; z <= 92; z += 4) st.push({ d: z, c: [c0[0], c0[1], z], f: [0, 0, 1], n: [n0[0], n0[1], 0], k: 0, width: W });
  const mc = PW.meshCentreline({ end: 'limit', stations: st }, PW.rayIndex(T));
  const ws = mc.st.map((x) => x.w), cerr = mc.st.map((x) => Math.hypot(x.p[0], x.p[1]));
  const wMin = Math.min(...ws), wMax = Math.max(...ws), cMax = Math.max(...cerr), ok = Math.abs(wMin - W) <= 0.5 && Math.abs(wMax - W) <= 0.5 && cMax <= 0.3;
  out.push({ W, bankDeg, psiDeg, depth, ok }); if (true) console.log(`  W ${W} bank ${bankDeg} cup ${psiDeg} strip ${depth} m down: reread ${mc.reread}/${mc.st.length} width ${wMin.toFixed(2)}-${wMax.toFixed(2)} centre off ${cMax.toFixed(2)} m ${ok ? 'ok' : 'MISS'}`);
}
console.log(`  A: ${out.filter((x) => x.ok).length} of ${out.length} cases ok`);
// ── A2. a lower road beside the cup's edge (a step onto another road the band must not walk onto) ──
{ const W = 27, arc = 4, half = W / 2 - arc, prof = cup(half, arc, 50 * D);
  const T = [...swept(prof, -W / 2, W / 2, 0.5, 0, 100, 2), ...swept((u) => [u, -1.5], -1, 1, 0.5, 0, 100, 2), ...swept((u) => [u, 2.4], W / 2 - 0.2, W / 2 + 20, 0.5, 0, 100, 2)];
  const st = []; for (let z = 8; z <= 92; z += 4) st.push({ d: z, c: [0.2, -1.5, z], f: [0, 0, 1], n: [0, 1, 0], k: 0, width: W });
  const mc = PW.meshCentreline({ end: 'limit', stations: st }, PW.rayIndex(T)), ws = mc.st.map((x) => x.w);
  console.log(`A2. a second road level with the cup's left rim (2.4 m up), from its edge outward 20 m: width ${Math.min(...ws).toFixed(2)}-${Math.max(...ws).toFixed(2)} (want ${W}) reread ${mc.reread}`); }
// ── B. the landing guard ──
const flatT = (x0, x1, y, z0, z1) => swept((u) => [u, y], x0, x1, 1, z0, z1, 2);
const guard = (label, T, st, want) => { const mc = PW.meshCentreline({ end: 'limit', stations: st }, PW.rayIndex(T));
  console.log(`B. ${label}: falseLandings ${JSON.stringify(mc.falseLandings)}, last station d ${mc.st[mc.st.length - 1].d}, ${(mc.falseLandings || []).length === want ? 'as wanted' : 'NOT as wanted'} (want ${want})`); };
{ // B1. a short jump straight on: take-off z 100, land z 112 (a 12 m gap) on new road ahead
  const T = [...flatT(-10, 10, 0, -10, 100), ...flatT(-10, 10, 0, 112, 220)], st = [];
  for (let z = 0; z <= 100; z += 4) st.push({ d: z, c: [0, 0, z], f: [0, 0, 1], n: [0, 1, 0], k: 0 });
  st.push({ jump: true, d: 100, gap_m: 12, drop_m: 0 }); for (let z = 112, d = 112; z <= 212; z += 4, d += 4) st.push({ d, c: [0, 0, z], f: [0, 0, 1], n: [0, 1, 0], k: 0 });
  guard('a 12 m jump straight on, onto new road', T, st, 0); }
{ // B1b. the same with a 25 m gap
  const T = [...flatT(-10, 10, 0, -10, 100), ...flatT(-10, 10, 0, 125, 220)], st = [];
  for (let z = 0; z <= 100; z += 4) st.push({ d: z, c: [0, 0, z], f: [0, 0, 1], n: [0, 1, 0], k: 0 });
  st.push({ jump: true, d: 100, gap_m: 25, drop_m: 0 }); for (let z = 125, d = 125; z <= 213; z += 4, d += 4) st.push({ d, c: [0, 0, z], f: [0, 0, 1], n: [0, 1, 0], k: 0 });
  guard('a 25 m jump straight on, onto new road', T, st, 0); }
{ // B2. a landing on a deck 12 m over road driven earlier (new road, stacked)
  const T = [...flatT(-10, 10, 0, -10, 110), ...flatT(-10, 10, 12, 60, 110), ...flatT(-10, 10, 12, -10, 30)], st = []; let d = 0;
  for (let z = 0; z <= 100; z += 4, d += 4) st.push({ d, c: [0, 0, z], f: [0, 0, 1], n: [0, 1, 0], k: 0 });
  for (let z = 100; z >= 64; z -= 4, d += 4) st.push({ d, c: [0, 12, z], f: [0, 0, -1], n: [0, 1, 0], k: 0 });   // (the climb and turn between are not modelled; stations only)
  st.push({ jump: true, d, gap_m: 34, drop_m: 0 }); d += 34;
  for (let z = 30; z >= 0; z -= 4, d += 4) st.push({ d, c: [0, 12, z], f: [0, 0, -1], n: [0, 1, 0], k: 0 });
  guard('a jump landing on a NEW deck 12 m over road driven earlier', T, st, 0); }
{ // B3. a landing on a separate road beside the driven one, 32 m centre to centre (two 27 m roads), running back
  const T = [...flatT(-13.5, 13.5, 0, -10, 210), ...flatT(18.5, 45.5, 0, -10, 210)], st = []; let d = 0;
  for (let z = 0; z <= 200; z += 4, d += 4) st.push({ d, c: [0, 0, z], f: [0, 0, 1], n: [0, 1, 0], k: 0, width: 27 });
  st.push({ jump: true, d, gap_m: 40, drop_m: 0 }); d += 40;
  for (let z = 196; z >= 0; z -= 4, d += 4) st.push({ d, c: [32, 0, z], f: [0, 0, -1], n: [0, 1, 0], k: 0, width: 27 });
  guard('a landing on a separate road beside the driven one, 32 m apart', T, st, 0); }

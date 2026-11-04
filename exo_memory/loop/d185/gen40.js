// D186 registration of TEST 6 (pane B): the SEEDED 40 km open track and the step list the speed bench runs, independent of any
// pane's API (plain piece lists and step parameters; the bench maps them onto the core's extend and brush).
//   node gen40.js > gen40.json
// Units: metres, radians. Channels: kh (1/m, left +), kv (1/m), bank (rad), width (m).
'use strict';
const SEED = 186;
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rnd = mulberry32(SEED), U = (a, b) => a + (b - a) * rnd(), DEG = Math.PI / 180, r6 = (x) => +x.toPrecision(12);
// the BASE track: pieces 150–600 m, drawn as in gen_tracks.js (seed 185), until the total reaches 40,000 m; open, not closed
const pieces = []; let L = 0, kh = 0, kv = 0, bank = 0, width = 30;
while (L < 40000) {
  const p = { length: U(150, 600), kh: [kh, U(-1 / 150, 1 / 150)], kv: [kv, U(-1 / 3000, 1 / 3000)], bank: [bank, U(-35, 35) * DEG], width: [width, U(25, 35)] };
  kh = p.kh[1]; kv = p.kv[1]; bank = p.bank[1]; width = p.width[1]; L += p.length; pieces.push(p);
}
// 5 warm-up + 50 timed EXTEND steps at the open end: 200 m each, targets drawn as above
const extend = []; for (let i = 0; i < 55; i++) extend.push({ warmup: i < 5, length: 200, targets: { kh: r6(U(-1 / 150, 1 / 150)), kv: r6(U(-1 / 3000, 1 / 3000)), phi: r6(U(-35, 35) * DEG), w: r6(U(25, 35)) } });
// 5 warm-up + 50 timed BRUSH strokes on the BASE track (each on a fresh copy of the base): s0 uniform in [5%, 95%] of the base
// length, r uniform in [20, 200] m, the DEFAULT mode (hill, the widen default), delta uniform in ±[1, 8] m
const brush = []; for (let i = 0; i < 55; i++) { const sgn = rnd() < 0.5 ? -1 : 1; brush.push({ warmup: i < 5, s0Frac: r6(U(0.05, 0.95)), r: r6(U(20, 200)), mode: 'hill', delta: r6(sgn * U(1, 8)) }); }
process.stdout.write(JSON.stringify({ generator: 'gen40.js', seed: SEED, baseLengthM: r6(L), pieces: pieces.map((p) => ({ length: r6(p.length), kh: p.kh.map(r6), kv: p.kv.map(r6), bank: p.bank.map(r6), width: p.width.map(r6) })), extend, brush }, null, 1) + '\n');

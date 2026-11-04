// D185 registration (pane B): the SEEDED generator of the 20 random open tracks for test 4 (Close), and of the base track for
// test 3 (Sculpt). It is independent of any pane's API: it writes plain piece lists, which a reader maps onto the core's extend
// (each piece = one extend with handles: its channels go from the previous piece's end value to its targets by the Bloss
// transition S(u) = 3u² − 2u³, references/02 §4).
//   node gen_tracks.js > gen_tracks.json
// Units: metres, radians. Channels: kh heading rate (1/m, left positive), kv pitch rate (1/m), bank (rad), width (m).
'use strict';
const SEED = 185, COUNT = 20;
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rnd = mulberry32(SEED), U = (a, b) => a + (b - a) * rnd(), I = (a, b) => Math.floor(U(a, b + 1));
const DEG = Math.PI / 180, r6 = (x) => +x.toPrecision(12);
const tracks = [];
for (let t = 0; t < COUNT; t++) {
  const n = I(6, 12), pieces = [];
  let kh = 0, kv = 0, bank = 0, width = 30;                  // the start: level, straight, flat, 30 m wide
  for (let i = 0; i < n; i++) {
    const p = { length: U(150, 600), kh: [kh, U(-1 / 150, 1 / 150)], kv: [kv, U(-1 / 3000, 1 / 3000)], bank: [bank, U(-35, 35) * DEG], width: [width, U(25, 35)] };
    kh = p.kh[1]; kv = p.kv[1]; bank = p.bank[1]; width = p.width[1];
    pieces.push(p);
  }
  // ∫ of a Bloss ramp from a to b over L is L(a + b)/2. Scale the heading targets so the net heading is 2π(1 + ε), ε ∈ [−0.1, 0.1]
  // (a loop that nearly closes, as a user's would), and shift the pitch targets so the net pitch change is 0 (no net climb rate).
  const net = (key) => pieces.reduce((s, p) => s + p.length * (p[key][0] + p[key][1]) / 2, 0);
  const eps = U(-0.1, 0.1), scale = (2 * Math.PI * (1 + eps)) / net('kh');
  for (const p of pieces) p.kh = p.kh.map((v) => v * scale);
  const L = pieces.reduce((s, p) => s + p.length, 0), mean = net('kv') / L;
  for (const p of pieces) p.kv = p.kv.map((v) => v - mean);
  // (scaling every kh and shifting every kv by one constant keeps the chain continuous: each piece still starts where the last ended)
  tracks.push({ id: t, seed: SEED, eps: r6(eps), lengthM: r6(L), pieces: pieces.map((p) => ({ length: r6(p.length), kh: p.kh.map(r6), kv: p.kv.map(r6), bank: p.bank.map(r6), width: p.width.map(r6) })) });
}
process.stdout.write(JSON.stringify({ generator: 'gen_tracks.js', seed: SEED, count: COUNT, note: 'test 4 uses all 20; test 3 uses track 0', tracks }, null, 1) + '\n');

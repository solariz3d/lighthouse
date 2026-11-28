// D678 item 1, X5 on his largest closed lap (by road length) from the copies in DIR: Even (TREE's src/core/even.js) on the run prof678g.js picks (the first
// two-piece run outward from the lap's middle that Even does not refuse), the left edge kept, to the run's width + 1 rounded to 0.5 m; then, outside the result's
// window, every 1 m: each channel against the start in stored steps (the worst), the built centreline's position (adapter toPath, step 1), and the built bank.
// Prints numbers, counts and booleans only. Usage: node x5lap.js TREE DIR
'use strict';
const fs = require('fs'), path = require('path');
const TREE = process.argv[2], DIR = process.argv[3];
const D = require(path.join(TREE, 'src/core/document.js')), SC = require(path.join(TREE, 'src/core/sculpt.js'));
const AD = require(path.join(TREE, 'src/core/adapter.js')), EV = require(path.join(TREE, 'src/core/even.js'));
const docs = [];
for (const f of fs.readdirSync(DIR).filter((x) => /^t\d+\.track$/.test(x))) {
  try { const d = D.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); const off = SC.pieceOffsets(d), n = d.pieces.length; docs.push({ d, L: off[n - 1] + (d.pieces[n - 1].length || 0) }); } catch (e) { /* a refused file */ }
}
docs.sort((a, b) => b.L - a.L);
const { d, L } = docs[0], n = d.pieces.length;
let pick = null;
for (let k = 0; k < n && pick === null; k++) for (const sgn of [1, -1]) { const p = Math.floor(n / 2) + sgn * k; if (p < 0 || p + 1 >= n) continue; try { EV.evenWindow(d, { from: p, to: p + 1 }); pick = p; break; } catch (e) { /* next */ } }
const value = Math.round((D.channelAt(d.pieces[pick], 'w', 0).v + 1) * 2) / 2;
const t0 = Date.now(), r = EV.even(d, { from: pick, to: pick + 1, value, hold: 'left' }), evenMs = Date.now() - t0, a = r.doc, { w0, w1 } = r.window;
const out = { roadM: Math.round(L), closed: !!d.closed, windowM: Math.round(w1 - w0), changedPieces: r.changed.length, evenMs };
// the channels, in steps, outside the window
const oa = SC.pieceOffsets(a), ob = SC.pieceOffsets(d);
const read = (doc, o, ch, s) => { for (let i = 0; i < doc.pieces.length; i++) { const P = doc.pieces[i]; if (P.type === 'road' && s >= o[i] - 1e-9 && s <= o[i] + P.length + 1e-9 && P.channels[ch]) return { i, v: D.channelAt(P, ch, Math.min(P.length, Math.max(0, s - o[i]))).v }; } return null; };
let worst = { ch: null, steps: 0 }, past = 0, samples = 0;
for (let s = 0; s <= L; s += 1) {
  if (s >= w0 && s <= w1) continue;
  const b0 = read(d, ob, 'w', s); if (!b0) continue; samples++;
  for (const ch of Object.keys(d.pieces[b0.i].channels)) { const x = read(a, oa, ch, s), y = read(d, ob, ch, s); if (!x || !y) continue; const st = Math.abs(x.v - y.v) / 10 ** -D.DEC[ch]; if (st > 1 + 1e-9) past++; if (st > worst.steps) worst = { ch, steps: Math.round(st * 1000) / 1000 }; }
}
out.channels = { samples, past, worst };
// the built road outside the window
const pa = AD.toPath(a, { step: 1 }).path.samples, pb = AD.toPath(d, { step: 1 }).path.samples;
let pos = 0, posAtFrac = null, same = 0, cmp = 0, firstMoved = null;
for (let k = 0; k < Math.min(pa.length, pb.length); k++) {
  const s = pb[k].s; if (s >= w0 && s <= w1) continue; if (Math.abs(pa[k].s - s) > 1e-6) { out.stationsDiffer = true; break; }
  cmp++; const p = pa[k].pos, q = pb[k].pos, dd = Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
  if (dd === 0) same++; else if (firstMoved === null) firstMoved = s < w0 ? 'before the window' : 'after the window';
  if (dd > pos) { pos = dd; posAtFrac = Math.round((s / L) * 100) / 100; }
}
out.builtOutside = { stations: cmp, bitForBit: same, maxM: Number(pos.toPrecision(3)), atFractionOfLap: posAtFrac, firstMoved };
// the built bank outside the window
const pl = { a: AD.bankPlan(a), b: AD.bankPlan(d) };
let bank = 0;
for (let s = 0; s <= L; s += 1) {
  if (s >= w0 && s <= w1) continue;
  const x = read(a, oa, 'phi', s), y = read(d, ob, 'phi', s); if (!x || !y) continue;
  const bx = pl.a[x.i].fn ? pl.a[x.i].fn(s - oa[x.i]) : x.v, by = pl.b[y.i].fn ? pl.b[y.i].fn(s - ob[y.i]) : y.v;
  bank = Math.max(bank, Math.abs(bx - by));
}
out.builtBankMaxRad = Number(bank.toPrecision(3));
// the built cross-section outside the window: each rim's place across (the section's rim turned by the frame's bank, as test/even_fixtures.js rimAcross reads
// it, less the offset l, which X4 covers), every 1 m; and the segments whose chord mark changed (keyed by piece and local start)
const ZG = require(path.join(TREE, 'app/core/zonegrab.js')), G = require(path.join(TREE, 'src/geom/index.js'));
const geom = (doc) => { const segments = AD.toSegments(doc), start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch }; return { segments, path: G.buildPath(segments, { step: 1, closed: !!doc.closed, start }) }; };
const ga = geom(a), gb = geom(d), rot = (x, y, ang) => x * Math.cos(ang) - y * Math.sin(ang);
const rimOf = (g, s, side) => { const f = ZG.frameAt(g.path, g.segments, s, side); return f ? rot(f.oF[0], f.oF[1], Math.atan2(f.sin, f.cos)) : null; };
let rim = 0, rimFrac = null, rims = 0, over = 0;
for (let s = 0; s <= L; s += 1) {
  if (s >= w0 && s <= w1) continue;
  for (const side of [-1, 1]) { const x = rimOf(ga, s, side), y = rimOf(gb, s, side); if (x === null || y === null) continue; rims++; const dd = Math.abs(x - y); if (dd > 1e-4) over++; if (dd > rim) { rim = dd; rimFrac = Math.round((s / L) * 100) / 100; } }
}
out.rimsOutside = { read: rims, over1e4: over, maxM: Number(rim.toPrecision(3)), atFractionOfLap: rimFrac };
const segKeys = (doc, segs) => { const o = SC.pieceOffsets(doc), idx = new Map(doc.pieces.map((P, i) => [P.id, i])), acc = new Map(), m = new Map(); for (const g of segs) { const i = idx.get(g.id), x = acc.get(g.id) || 0; acc.set(g.id, x + g.length); m.set(`${g.id}@${x.toFixed(6)}`, { s0: o[i] + x, s1: o[i] + x + g.length, chord: !!g.chord }); } return m; };
const ka = segKeys(a, ga.segments), kb = segKeys(d, gb.segments);
let flips = 0, outsideSegs = 0;
for (const [k, v] of kb) { if (v.s1 >= w0 && v.s0 <= w1) continue; outsideSegs++; const u = ka.get(k); if (!u) { flips++; continue; } if (u.chord !== v.chord) flips++; }
out.segmentsOutside = { segments: outsideSegs, chordChangedOrMissing: flips };
console.log(JSON.stringify(out));

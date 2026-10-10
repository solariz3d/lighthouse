// D186 (pane E): widen (W) or refine (R) under a narrow brush? On test 3's 30 brushes (generated track 0, open; W⁺ = W ± 2 of the
// ORIGINAL knot spans), for each option: (a) channel values outside W⁺ that are not bit-identical (count, largest |Δ|);
// (b) for value brushes, the largest |Δpos| past W⁺; (c) the kink rule on κ_new − κ_old at the used edges and W⁺.
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E: D186 widen-or-refine comparison' });
const path = require('path'), T = path.join(__dirname, 'tree');
const D = require(path.join(T, 'src/core/document.js')), S = require(path.join(T, 'src/core/sculpt.js')), { toPath } = require(path.join(T, 'src/core/adapter.js'));
const H = require(path.join(T, 'test/core_helpers.js'));
const BASE = H.docFrom(H.gen()[0]), OLD = toPath(BASE).path.samples, LEN = OLD.at(-1).s, OFF = S.pieceOffsets(BASE);
const SPAN = Math.max(...BASE.pieces.map((P) => { const t = [0, ...P.knots, P.length]; return Math.max(...t.slice(1).map((x, k) => x - t[k])); }));
const DELTA = { kh: 0.002, kv: 0.001, phi: 10 * Math.PI / 180, w: 5, r: 0.5 };
const OFFS = new WeakMap(); const offsOf = (doc) => { if (!OFFS.has(doc)) OFFS.set(doc, S.pieceOffsets(doc)); return OFFS.get(doc); };
function chAt(doc, ch, s) { const off = offsOf(doc); let p = off.findIndex((o, i) => s >= o && (i === off.length - 1 || s < off[i + 1])); if (p < 0) p = 0; return D.channelAt(doc.pieces[p], ch, Math.min(s - off[p], doc.pieces[p].length)).v; }
const kD = (sm, i) => { const u = [0, 1, 2].map((j) => sm[i].pos[j] - sm[i - 1].pos[j]), w = [0, 1, 2].map((j) => sm[i + 1].pos[j] - sm[i].pos[j]), lu = Math.hypot(...u), lw = Math.hypot(...w); return Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1] + u[2] * w[2]) / (lu * lw)))) / ((lu + lw) / 2); };
function refineUnder(doc, s0, r) {
  const h = (2 * r) / 6, lo = s0 - r - 3 * h, hi = s0 + r + 3 * h, off = S.pieceOffsets(doc); let d = doc, n = 0;
  doc.pieces.forEach((P, p) => { if (P.type !== 'road' || off[p] + P.length < lo || off[p] > hi) return; const res = D.refineKnots(d, P.id, Math.max(0, lo - off[p]), Math.min(P.length, hi - off[p]), h); d = res.doc; n += res.inserted; });
  return { doc: d, inserted: n };
}
const rows = [];
const tally = { W: { a: 0, b: 0, c: 0 }, R: { a: 0, b: 0, c: 0 } };
for (const ch of Object.keys(DELTA)) for (const frac of [0.25, 0.5, 0.75]) for (const r of [20, 100]) {
  const s0 = frac * LEN, lo = s0 - r, hi = s0 + r, loP = lo - 2 * SPAN, hiP = hi + 2 * SPAN, line = [`${ch.padEnd(3)} ${frac * 100}% r${r}`];
  for (const opt of ['W', 'R']) {
    let doc = BASE, ins = 0; if (opt === 'R') { const x = refineUnder(BASE, s0, r); doc = x.doc; ins = x.inserted; }
    const res = S.sculpt(doc, { channel: ch, s0, r, delta: DELTA[ch] }), NEW = toPath(res.doc).path.samples, ru = res.radiusUsed;
    let na = 0, da = 0; for (const x of NEW) if (x.s < loP || x.s > hiP) for (const c of D.CHANNELS) { const u = chAt(res.doc, c, x.s), v = chAt(BASE, c, x.s); if (!Object.is(u, v)) { na++; da = Math.max(da, Math.abs(u - v)); } }
    let dpos = 0; if (!['kh', 'kv'].includes(ch)) NEW.forEach((x, i) => { if (x.s > hiP) dpos = Math.max(dpos, Math.hypot(...[0, 1, 2].map((k) => x.pos[k] - OLD[i].pos[k]))); });
    const KD = []; for (let i = 1; i + 1 < NEW.length; i++) KD.push({ s: NEW[i].s, k: kD(NEW, i) - kD(OLD, i) });
    let mid = 0; for (let i = 1; i < KD.length; i++) if (Math.abs(KD[i].s - s0) <= ru / 2) mid = Math.max(mid, Math.abs(KD[i].k - KD[i - 1].k));
    let kink = true; for (const e of [lo, hi, loP, hiP]) { let edge = 0; for (let i = 1; i < KD.length; i++) if (Math.abs(KD[i].s - e) <= 5) edge = Math.max(edge, Math.abs(KD[i].k - KD[i - 1].k)); if (edge > mid + 1e-12) kink = false; }
    if (na) tally[opt].a++; if (dpos) tally[opt].b++; if (!kink) tally[opt].c++;
    line.push(`${opt}: radius ${ru.toFixed(1)}${opt === 'R' ? ` (+${ins} knots)` : ''}, outside-W⁺ values differing ${na}${na ? ` (max ${da.toExponential(1)})` : ''}, Δpos past W⁺ ${dpos.toExponential(1)}, kink rule at s₀±r and W⁺ ${kink ? 'pass' : 'FAIL'}`);
  }
  rows.push(line.join(' | '));
}
rows.push(`TALLY (cases of 30): W: values differ ${tally.W.a}, geometry moves ${tally.W.b}, kink FAIL ${tally.W.c} || R: values differ ${tally.R.a}, geometry moves ${tally.R.b}, kink FAIL ${tally.R.c}`);
console.log(rows.join('\n'));

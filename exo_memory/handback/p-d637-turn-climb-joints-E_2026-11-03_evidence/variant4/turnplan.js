// turnplan.js: a PROTOTYPE (scratch, not the adapter) of the bank's corner rounding (adapter.js bankPlan) for a CURVATURE channel, kh (turn) or kv (climb).
// roundChannel(R, doc, ch, { mode }) -> per piece index: null, or a function s -> the rounded channel value. mode:
//   'plain'   : windows match value, rate and rate of change at both ends (quintic), never cross a joint or a turning point of the curvature, are never wild
//               (leave the range of the curvature they replace by more than 1%); the route downstream may move
//   'heading' : the same windows also keep the curvature's integral and first moment over the window (degree 7), so the heading and (to second order) the
//               lateral offset at the window's end are as laid; overshoot is not refused but MEASURED (opts.report collects it)
// THE BAR is on the curvature's own rate: at 170 m/s the load changes by at most 3 g over 10 m of road, κ′ ≤ 29.4 / (10 · 170²) = 1.02e-4 1/m² (≈ 51 g/s of
// jerk), numerically the bank's bar. A piece too short to meet it is rounded as far as its length allows.
'use strict';
const path = require('path');
const K_BAR = 29.4 / (10 * 170 * 170), DS = 2, CORNER_MAX = 250, JOINT_NEAR = 25;
function roundChannel(R, doc, ch, { mode = 'plain', report = null, maxW = 2 * CORNER_MAX } = {}) {
  const D = require(path.join(R, 'src/core/document.js'));
  const out = doc.pieces.map(() => null);
  const runs = []; let cur = null;
  doc.pieces.forEach((P, i) => { if (P.type !== 'road' || P.tube) { cur = null; return; } if (!cur) runs.push((cur = [])); cur.push(i); });
  for (const run of runs) {
    const S = [], V = []; let o = 0;
    for (const i of run) { const P = doc.pieces[i], n = Math.max(1, Math.round(P.length / DS)); for (let k = S.length ? 1 : 0; k <= n; k++) { const s = (P.length * k) / n; S.push(o + s); V.push(D.channelAt(P, ch, s).v); } o += P.length; }
    const N = S.length; if (N < 8) continue;
    const pieceOf = (s) => { let pos = 0; for (const i of run) { const L = doc.pieces[i].length; if (s <= pos + L + 1e-9) return [i, Math.min(L, Math.max(0, s - pos))]; pos += L; } const i = run[run.length - 1]; return [i, doc.pieces[i].length]; };
    const val = (s) => { const [i, t] = pieceOf(s); return D.channelAt(doc.pieces[i], ch, t); };
    const rate = (k) => (V[k + 1] - V[k]) / (S[k + 1] - S[k]);
    const over = []; for (let k = 0; k + 1 < N; k++) if (Math.abs(rate(k)) > K_BAR) over.push(k);
    if (!over.length) continue;
    const zones = []; for (const k of over) { const z = zones[zones.length - 1]; if (z && S[k] - S[z[1]] < 20) z[1] = k; else zones.push([k, k + 1]); }
    const bounds = [0]; { let q = 0; for (const i of run) bounds.push((q += doc.pieces[i].length)); }
    // turning points of the curvature (its rate changes sign): kept like joints, so a turn's sharpest point stays where it is, at its value
    const turns = []; { let last = -1; for (let k = 0; k + 1 < N; k++) { const r = rate(k); if (Math.abs(r) < 1e-12) continue; if (last >= 0 && Math.sign(r) !== Math.sign(rate(last))) { const t = k === last + 1 ? S[k] : (S[last + 1] + S[k]) / 2; if (!bounds.some((x) => Math.abs(x - t) < 1)) turns.push(t); } last = k; } }
    const pins = [...bounds, ...turns].sort((p, q) => p - q), isTurn = (x) => turns.some((t) => Math.abs(t - x) < 1e-9);
    const spanOf = (x) => { for (let k = 1; k < pins.length; k++) if (x < pins[k] - 1e-9 || k === pins.length - 1) return [pins[k - 1], pins[k]]; return [0, S[N - 1]]; };
    // at a kept point (a joint or a turning point of the curvature) the window starts with the curvature's rate of change at 0, so the two sides meet smoothly
    const isPin = (x) => pins.some((t) => Math.abs(t - x) < 1e-9);
    const end = (x) => { const c = val(x); return { v: c.v, d1: isTurn(x) ? 0 : c.d1, d2: isPin(x) ? 0 : c.d2 }; };
    const build = (a, b) => {
      const W = b - a, A = end(a), B = end(b);
      const cons = [[0, A.v], [1, A.d1 * W], [2, A.d2 * W * W], [10, B.v], [11, B.d1 * W], [12, B.d2 * W * W]];
      let I0 = 0, I1 = 0; if (mode === 'heading') { const n = 200; for (let k = 0; k < n; k++) { const u = (k + 0.5) / n, x = val(a + u * W).v; I0 += x / n; I1 += u * x / n; } cons.push([20, I0], [21, I1]); }
      const deg = cons.length - 1, M = [], y = [];
      for (const [kind, v] of cons) {
        const row = [];
        for (let p = 0; p <= deg; p++) {
          const at1 = kind >= 10 && kind < 20, d = kind % 10;
          if (kind === 20) row.push(1 / (p + 1)); else if (kind === 21) row.push(1 / (p + 2));
          else if (d === 0) row.push(at1 ? 1 : (p === 0 ? 1 : 0));
          else if (d === 1) row.push(at1 ? p : (p === 1 ? 1 : 0));
          else row.push(at1 ? p * (p - 1) : (p === 2 ? 2 : 0));
        }
        M.push(row); y.push(v);
      }
      const c = solve(M, y), P = (u) => c.reduce((s, x, p) => s + x * u ** p, 0), P1 = (u) => c.reduce((s, x, p) => s + (p ? p * x * u ** (p - 1) : 0), 0);
      let peak = 0, lo = Infinity, hi = -Infinity, qlo = Infinity, qhi = -Infinity;
      for (let k = 0; k <= 200; k++) { const u = k / 200, x = a + u * W, v = val(x).v, q = P(u); peak = Math.max(peak, Math.abs(P1(u)) / W); lo = Math.min(lo, v); hi = Math.max(hi, v); qlo = Math.min(qlo, q); qhi = Math.max(qhi, q); }
      const span = Math.max(hi - lo, 1e-12), overshoot = Math.max(0, lo - qlo, qhi - hi) / span;
      return { a, b, P, peak, overshoot, wild: mode === 'plain' && overshoot > 0.01 };
    };
    const windows = [];
    const grow = (mk, W0, wMax) => { let W = W0, w, ok = null; for (;;) { w = mk(W); if (!w) break; if (!w.wild) ok = w; if (w.peak <= K_BAR || W >= wMax || w.atEnd) break; W = Math.min(wMax, W * 1.15); } return ok; };
    for (const [k0, k1] of zones) {
      const js = pins.slice(1, -1).filter((x) => x >= S[k0] - JOINT_NEAR && x <= S[k1] + JOINT_NEAR);
      const H0 = Math.max((S[k1] - S[k0]) / 2 + 2 * DS, 10);
      if (js.length) {
        for (const j of js) for (const side of [-1, 1]) {
          const [lo, hi] = spanOf(side < 0 ? j - 1e-6 : j + 1e-6);
          const ok = grow((W) => { const a = side < 0 ? Math.max(lo, j - W) : j, b = side < 0 ? j : Math.min(hi, j + W); if (b - a < 4) return null; const w = build(a, b); w.atEnd = side < 0 ? a <= lo : b >= hi; return w; }, Math.min(2 * H0, maxW), maxW);
          if (ok) windows.push(ok);
        }
        continue;
      }
      const [lo, hi] = spanOf((S[k0] + S[k1]) / 2), mid = (S[k0] + S[k1]) / 2;
      const ok = grow((H) => { const a = Math.max(lo, mid - Math.max(H, mid - S[k0] + DS)), b = Math.min(hi, mid + Math.max(H, S[k1] - mid + DS)); const w = build(a, b); w.atEnd = a <= lo && b >= hi; return w; }, Math.min(H0, maxW / 2), maxW / 2);
      if (ok) windows.push(ok);
    }
    windows.sort((p, q) => p.a - q.a);
    for (let k = 1; k < windows.length; k++) { const p = windows[k - 1], q = windows[k]; if (q.a < p.b - 1e-9) { const m = build(Math.min(p.a, q.a), Math.max(p.b, q.b)); if (m.wild) windows.splice(k - 1, 2); else windows.splice(k - 1, 2, m); k = Math.max(0, k - 2); } }
    if (report) for (const w of windows) report.push({ ch, a: w.a, b: w.b, peak: w.peak, overshoot: w.overshoot });
    let pos = 0;
    for (const i of run) {
      const P = doc.pieces[i], p0 = pos, mine = windows.filter((w) => w.b > p0 && w.a < p0 + P.length); pos += P.length;
      if (!mine.length) continue;
      out[i] = (s) => { const x = p0 + s; for (const w of mine) if (x >= w.a && x <= w.b) return w.P((x - w.a) / (w.b - w.a)); return D.channelAt(P, ch, s).v; };
    }
  }
  return out;
}
function solve(M, y) {   // Gaussian elimination with partial pivoting
  const n = y.length, A = M.map((r, i) => [...r, y[i]]);
  for (let c = 0; c < n; c++) { let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r; [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let k = c; k <= n; k++) A[r][k] -= f * A[c][k]; } }
  return A.map((r, i) => r[n] / r[i]);
}
module.exports = { roundChannel, K_BAR };

// VARIANT 4 (the chair's re-brief, 14:03): no rounding layer. Turn (kh) and climb (kv) laid with their rate CARRIED through every joint between two road pieces
// (on a closed lap the seam too), the way D624/D626 carry the bank: the rate at a joint is chosen LOCALLY, a Catmull-Rom slope between the two neighbouring
// pieces' middles, 0 where the joint is an extreme of the channel, clamped (Fritsch-Carlson, 3× the smaller one-sided slope) so neither half is pushed past its
// values; each half of a piece is one quintic from the piece's middle (value, rate and acceleration as the document has them) to the joint (its typed value, the
// carried rate, no acceleration). A piece end that is not carried (a flight, a tube, an open track's ends) keeps the document's half. Every piece ends at its typed
// value and keeps its middle; an edit reaches only its neighbours (their joint rate).
//   carryChannel(R, doc, ch, { report }) -> per piece index: null or s -> the laid value; report collects each half's overshoot (share of its own change)
function carryChannel(R, doc, ch, { report = null } = {}) {
  const D = require(path.join(R, 'src/core/document.js'));
  const n = doc.pieces.length, road = (P) => P && P.type === 'road' && !P.tube;
  const next = (i) => (i + 1 < n ? i + 1 : (doc.closed ? 0 : -1));
  const mid = (P) => D.channelAt(P, ch, P.length / 2);
  const rate = (i) => {   // the carried rate across the joint at the END of piece i, or null
    const j = next(i); if (j < 0 || j === i) return null; const A = doc.pieces[i], B = doc.pieces[j]; if (!road(A) || !road(B)) return null;
    const mA = mid(A), mB = mid(B), v = D.channelAt(A, ch, A.length).v, hA = A.length / 2, hB = B.length / 2;
    if ((v - mA.v) * (mB.v - v) <= 0) return 0;   // an extreme (or flat) at the joint: the rate is 0 there, so nothing overshoots
    const sec = (mB.v - mA.v) / (hA + hB), lim = 3 * Math.min(Math.abs(v - mA.v) / hA, Math.abs(mB.v - v) / hB);
    return Math.sign(sec) * Math.min(Math.abs(sec), lim);
  };
  const out = doc.pieces.map(() => null), rEnd = doc.pieces.map((_, i) => rate(i));
  for (let i = 0; i < n; i++) {
    const P = doc.pieces[i]; if (!road(P)) continue;
    const prev = i > 0 ? i - 1 : (doc.closed ? n - 1 : -1), rL = prev >= 0 && prev !== i ? rEnd[prev] : null, rR = rEnd[i];
    if (rL === null && rR === null) continue;
    const L = P.length, h = L / 2, m = mid(P), v0 = D.channelAt(P, ch, 0).v, v1 = D.channelAt(P, ch, L).v;
    const left = rL === null ? null : [v0, rL * h, 0, m.d2 * h * h, m.d1 * h, m.v], right = rR === null ? null : [m.v, m.d1 * h, m.d2 * h * h, 0, rR * h, v1];
    if (report) for (const [c, a, b] of [[left, v0, m.v], [right, m.v, v1]]) { if (!c) continue; let lo = Infinity, hi = -Infinity; for (let k = 0; k <= 100; k++) { const q = qAt(c, k / 100); lo = Math.min(lo, q); hi = Math.max(hi, q); } const span = Math.max(Math.abs(b - a), 1e-12); report.push({ ch, piece: P.id, overshoot: Math.max(0, Math.min(a, b) - lo, hi - Math.max(a, b)) / span, abs: Math.max(0, Math.min(a, b) - lo, hi - Math.max(a, b)) }); }
    out[i] = (s) => (s <= h ? (left ? qAt(left, s / h) : D.channelAt(P, ch, s).v) : (right ? qAt(right, (s - h) / h) : D.channelAt(P, ch, s).v));
  }
  return out;
}
function qAt(c, u) {
  const u2 = u * u, u3 = u2 * u, u4 = u3 * u, u5 = u4 * u, [y0, d0, c0, c1, d1, y1] = c;
  return y0 * (1 - 10 * u3 + 15 * u4 - 6 * u5) + d0 * (u - 6 * u3 + 8 * u4 - 3 * u5) + c0 * (0.5 * u2 - 1.5 * u3 + 1.5 * u4 - 0.5 * u5)
    + c1 * (0.5 * u3 - u4 + 0.5 * u5) + d1 * (-4 * u3 + 7 * u4 - 3 * u5) + y1 * (10 * u3 - 15 * u4 + 6 * u5);
}
module.exports.carryChannel = carryChannel;

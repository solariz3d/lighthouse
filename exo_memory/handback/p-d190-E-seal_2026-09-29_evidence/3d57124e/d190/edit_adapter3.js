const fs = require('fs'), WT = process.argv[2], file = WT + '/src/core/adapter.js';
let s = fs.readFileSync(file, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
const a = s.indexOf('/**\n * The profile and blend of each of a cup piece'), b = s.indexOf('function toSegments(');
if (a < 0 || b < 0 || b < a) throw new Error('anchors');
const NEW = String.raw`/**
 * The profile and blend of each of a cup piece's n segments (D190 row 1b). at(s) gives the channels; segment j spans s_j to s_{j+1}.
 * A RUN is consecutive segments over which the width stays put. Its ends make ONE pair: A at the run's lowest c and B at its highest.
 * At a fixed width the cup profile is linear in c (ref 09 §9), so blend(A, B, x) IS the cup profile at c = (1 − x)·c_lo + x·c_hi, and
 * a segment's blend puts the mesh's smoothstep weight on x at both of its ends (s0 and length solve smoothstep((s0 + d)/length) = x
 * at d = 0 and at d = the segment's length). A segment where c falls swaps the pair (from B, own A, weight 1 − x): blendSamples is
 * symmetric in its two profiles, so every segment of the run has the same sample fractions and the same K, and the boundary rows of
 * two segments are the same cross-section at the same u: no seam zip between them, and the wall follows c along the road instead of
 * stepping every segM metres. A run where c does not move is one profile with no blend. A segment where the width moves is a run of
 * its own (its chord, from the profile at its start to the one at its end).
 */
function cupSegments(P, n, at) {
  const s = (j) => (P.length * j) / n, E = Array.from({ length: n + 1 }, (_, j) => at(s(j))), out = new Array(n);
  const wTol = (w) => 1e-9 * Math.max(1, w), cTol = 1e-9;
  let j = 0;
  while (j < n) {
    const wRun = E[j].w, chord = Math.abs(E[j + 1].w - wRun) > wTol(wRun);
    if (chord) {
      const A = cupProfile(P.family, wRun, E[j].c), B = cupProfile(P.family, E[j + 1].w, E[j + 1].c);
      out[j] = { profile: B, blend: { from: A, s0: 0, length: s(j + 1) - s(j) }, end: B };
      j++; continue;
    }
    let k = j; while (k + 1 < n && Math.abs(E[k + 2].w - wRun) <= wTol(wRun)) k++;   // the run is segments j..k
    let lo = Infinity, hi = -Infinity; for (let m = j; m <= k + 1; m++) { lo = Math.min(lo, E[m].c); hi = Math.max(hi, E[m].c); }
    if (hi - lo <= cTol) {
      const prof = cupProfile(P.family, wRun, E[j].c);
      for (let m = j; m <= k; m++) out[m] = { profile: prof, blend: null, end: prof };
    } else {
      const A = cupProfile(P.family, wRun, lo), B = cupProfile(P.family, wRun, hi), X = (m) => Math.min(1, Math.max(0, (E[m].c - lo) / (hi - lo)));
      for (let m = j; m <= k; m++) {
        const len = s(m + 1) - s(m), up = X(m + 1) >= X(m);
        const from = up ? A : B, own = up ? B : A, ya = up ? X(m) : 1 - X(m), yb = up ? X(m + 1) : 1 - X(m + 1);   // the weight of own runs ya → yb, rising
        let blend;
        if (ya >= 1 - 1e-12) blend = { from, s0: len, length: len };            // weight 1 all along: the segment is own
        else if (yb <= 1e-12) blend = { from, s0: 0, length: 1e15 };            // weight 0 all along: the segment is from
        else { const za = unsmooth(ya), zb = Math.max(unsmooth(yb), za + 1e-12), length = len / (zb - za); blend = { from, s0: za * length, length }; }
        out[m] = { profile: own, blend, end: cupProfile(P.family, wRun, E[m + 1].c) };
      }
    }
    j = k + 1;
  }
  return out;
}

`;
s = s.slice(0, a) + NEW + s.slice(b);
if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(file, s); console.log('cupSegments replaced');

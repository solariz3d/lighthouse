const fs = require('fs'), file = 'C:/Users/nname/Desktop/a-d188-wt/src/core/adapter.js';
let s = fs.readFileSync(file, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
const a = s.indexOf('/**\n * The DEFAULT cup segments'), b = s.indexOf('function toSegments(');
if (a < 0 || b < 0) throw new Error('anchors');
s = s.slice(0, a) + String.raw`/**
 * The DEFAULT cup segments: each segment's profile is the cup profile at its END and its blend runs from the profile at its START,
 * so segment.profile is the local cross-section (within one segment's change of c of the road it draws) and the rows still follow
 * c(s) at every segment end. Where neither c nor the width moves by more than CFLAT_DEG (the fit's ringing decays for a long way
 * after a transition, so c is never exactly constant), the segments share ONE profile (the first one's, the ANCHOR) with no blend:
 * identical profiles have identical rows, so no seam zip is emitted along a held cup. The price is at most CFLAT_DEG of wall.
 */
const CFLAT_DEG = 1e-3;
function cupSegmentsLocal(P, n, at) {
  const s = (j) => (P.length * j) / n, out = new Array(n), wTol = (w) => 1e-9 * Math.max(1, w);
  const near = (x, y) => Math.abs(x.c - y.c) <= CFLAT_DEG && Math.abs(x.w - y.w) <= wTol(y.w);
  let a = at(0), anchor = null, anchorProfile = null;
  for (let j = 0; j < n; j++) {
    const b = at(s(j + 1));
    if (anchor && near(a, anchor) && near(b, anchor)) out[j] = { profile: anchorProfile, blend: null, end: anchorProfile };
    else if (near(a, b)) { anchor = a; anchorProfile = cupProfile(P.family, a.w, a.c); out[j] = { profile: anchorProfile, blend: null, end: anchorProfile }; }
    else { anchor = null; const B = cupProfile(P.family, b.w, b.c); out[j] = { profile: B, blend: { from: cupProfile(P.family, a.w, a.c), s0: 0, length: s(j + 1) - s(j) }, end: B }; }
    a = b;
  }
  return out;
}

` + s.slice(b);
if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(file, s); console.log('adapter patched');

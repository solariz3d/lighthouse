const fs = require('fs'), file = 'C:/Users/nname/Desktop/a-d188-wt/src/core/adapter.js';
let s = fs.readFileSync(file, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
const rep = (a, b) => { if (s.split(a).length !== 2) throw new Error('anchor: ' + a.slice(0, 80)); s = s.replace(a, () => b); };
// 1. the header comment
const h0 = s.indexOf('// A CUP piece (P.cup) is meshed'), h1 = s.indexOf('// A FLIGHT piece becomes');
if (h0 < 0 || h1 < 0) throw new Error('header anchors');
s = s.slice(0, h0) + String.raw`// A CUP piece (P.cup) is meshed from the same segments, but each carries a cupProfile at c. By default each segment carries the profile at
// its END as its profile and a blend from the profile at its START (blend: { from, s0: 0, length }), so the wall follows c along the road
// instead of stepping every segM metres, and segment.profile stays the LOCAL cross-section, which every reader of it that is not the mesh
// (the marker layout's floor, validation, the water, the camera's span) needs. The mesh emits a seam zip where two neighbouring segments'
// boundary rows are not the same vertices, which is wherever c changes (measured: 19 of 50 boundaries on a 40 m ramp). With
// toSegments(doc, { cupRuns: true }) a stretch where c changes and the width does not shares ONE blend pair instead, so no seam zip is
// emitted inside the piece; the price is that each segment's profile is then the run's widest one, which those other readers take
// for the local one (measured: the grid's straight was refused at 4.45 m on a straight running into a cupped turn). See README "the cup".
` + s.slice(h1);
// 2. rename the run scheme, add the local one
rep("function cupSegments(P, n, at) {\n  const s = (j) => (P.length * j) / n,", "function cupSegmentsRuns(P, n, at) {\n  const s = (j) => (P.length * j) / n,");
rep("function toSegments(doc, { segM = 2, designKmh = MACH6.designSpeedKmh } = {}) {", String.raw`/**
 * The DEFAULT cup segments: each segment's profile is the cup profile at its END and its blend runs from the profile at its START,
 * so segment.profile is the local cross-section (within one segment's change of c of the road it draws) and the rows still follow
 * c(s) at every segment end. A segment where neither c nor the width moves is one profile with no blend.
 */
function cupSegmentsLocal(P, n, at) {
  const s = (j) => (P.length * j) / n, out = new Array(n), wTol = (w) => 1e-9 * Math.max(1, w), cTol = 1e-9;
  let a = at(0);
  for (let j = 0; j < n; j++) {
    const b = at(s(j + 1));
    if (Math.abs(b.c - a.c) <= cTol && Math.abs(b.w - a.w) <= wTol(a.w)) { const prof = cupProfile(P.family, a.w, a.c); out[j] = { profile: prof, blend: null, end: prof }; }
    else { const B = cupProfile(P.family, b.w, b.c); out[j] = { profile: B, blend: { from: cupProfile(P.family, a.w, a.c), s0: 0, length: s(j + 1) - s(j) }, end: B }; }
    a = b;
  }
  return out;
}

function toSegments(doc, { segM = 2, designKmh = MACH6.designSpeedKmh, cupRuns = false } = {}) {`);
rep("    const cup = P.cup ? cupSegments(P, n, at) : null;", "    const cup = P.cup ? (cupRuns ? cupSegmentsRuns : cupSegmentsLocal)(P, n, at) : null;");
rep("function toPath(doc, { step = 0.5, segM = 2, designKmh } = {}) {\n  const segments = toSegments(doc, { segM, designKmh });", "function toPath(doc, { step = 0.5, segM = 2, designKmh, cupRuns } = {}) {\n  const segments = toSegments(doc, { segM, designKmh, cupRuns });");
rep("//   toSegments(doc, { segM = 2, designKmh })   -> src/geom segments (each carries its profile)", "//   toSegments(doc, { segM = 2, designKmh, cupRuns = false }) -> src/geom segments (each carries its profile)");
if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(file, s); console.log('adapter patched');

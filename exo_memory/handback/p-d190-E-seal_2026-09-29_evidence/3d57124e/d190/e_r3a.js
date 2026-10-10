const fs = require('fs'), WT = 'C:/Users/nname/Desktop/a-d188-wt';
function edit(file, pairs) {
  let s = fs.readFileSync(WT + '/' + file, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(file + ': anchor not unique/found: ' + a.slice(0, 90)); s = s.replace(a, () => b); }
  if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(WT + '/' + file, s); console.log('edited', file, crlf ? '(CRLF)' : '(LF)');
}
edit('src/geom/profile.js', [[
"module.exports = { normalize, psiAt, offsetAt, normalAt, samplesAcross, maxPsi, spanOf, blend, blendSamples, usOf, smoothstep, atSegment, readAt };",
`/**
 * The largest distance (m) between two cross-sections at the same fractions of each side's width: the step a zip between a segment's last row
 * and the next one's first row would span (both are piecewise linear in ψ on the same fractions, so the vertex distance is the curve's gap to
 * within the chord). 0 for identical profiles.
 */
function stepBetween(A, B) {
  A = normalize(A); B = normalize(B);
  const EA = edgesOf(A), EB = edgesOf(B), fs = [...new Set([...fractions(A), ...fractions(B), 0])];
  let worst = 0;
  for (const f of fs) { const pa = offsetAt(A, uAt(EA, f)), pb = offsetAt(B, uAt(EB, f)); worst = Math.max(worst, Math.hypot(pa[0] - pb[0], pa[1] - pb[1])); }
  return worst;
}
/**
 * The joints of a segment list whose two sides are drawn from different rows, for the segments a CUP touches (a word document's joints between
 * pieces are what they always were): [{ j, lap, m }] with j the segment that STARTS the joint and m the step in metres between the previous
 * segment's last cross-section and its first. lap is true for the closed lap's seam (last road segment to the first). A joint inside a cup
 * piece is 0 by construction (the run scheme shares rows); the legacy <-> cup joints are matched by the morphs (src/core/adapter.js).
 */
function jointSteps(segments, closed) {
  if (!segments.some((g) => g.cup)) return [];
  const out = [], road = (g) => g && g.kind === 'road' && g.profile;
  const step = (a, b) => stepBetween(readAt(a, a.length), readAt(b, 0));
  for (let j = 1; j < segments.length; j++) { const a = segments[j - 1], b = segments[j]; if (road(a) && road(b) && (a.cup || b.cup)) out.push({ j, lap: false, m: step(a, b) }); }
  const a = segments[segments.length - 1], b = segments[0];
  if (closed && segments.length > 1 && road(a) && road(b) && (a.cup || b.cup)) out.push({ j: 0, lap: true, m: step(a, b) });
  return out;
}

module.exports = { normalize, psiAt, offsetAt, normalAt, samplesAcross, maxPsi, spanOf, blend, blendSamples, usOf, smoothstep, atSegment, readAt, stepBetween, jointSteps };`]]);

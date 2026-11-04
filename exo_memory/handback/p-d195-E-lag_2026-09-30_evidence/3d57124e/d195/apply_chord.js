const fs = require('fs'); const W = 'C:/Users/nname/Desktop/a-d195-wt/';
function patch(f, pairs) { let s = fs.readFileSync(W + f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n'); for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(f + ' anchor: ' + a.slice(0, 90)); s = s.replace(a, () => b); } if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(W + f, s); console.log('patched', f); }

patch('src/core/adapter.js', [
["function toSegments(doc, { segM = 2, designKmh = MACH6.designSpeedKmh, cupRuns = true } = {}) {",
`/** Two profiles are the same cross-section when every u and ψ agrees to 1e-12 (an r that does not bind the cap gives the same profile at any r). */
const sameProfile = (A, B) => A.u.length === B.u.length && A.u.every((x, i) => Math.abs(x - B.u[i]) <= 1e-12) && A.psi.every((x, i) => Math.abs(x - B.psi[i]) <= 1e-12);
/**
 * A LEGACY segment (D196). Where the width or the rise rate changes inside the segment so that its cross-section does, it is drawn as a CHORD, like the cup's
 * chord segments: the profile at its END, blended from the profile at its START (the mesh's smoothstep weight over the segment), so the rows at its two ends
 * are the ends' own cross-sections and neighbouring segments share their row: no staircase of width steps and no step at a joint (before: one profile at the
 * MIDDLE width per segment: 0.29 m steps between segments in fixture F4, 0.86 m in F8, 4.8 m for a 20 m ramp of 19 m). Where the two ends draw the same
 * cross-section (a constant width and r, or an r that does not bind the cap) it is exactly today's segment, the profile at the middle width and no blend,
 * so such a piece renders byte for byte as before. \`start\` and \`end\` are the segment's first and last rows; \`chord\` marks it for the readers.
 */
function legacySeg(fam, a, b, mid, length) {
  const A = profileAt(fam, a.w, a.r), B = profileAt(fam, b.w, b.r);
  if (sameProfile(A, B)) { const p = profileAt(fam, mid.w, mid.r); return { profile: p, blend: null, start: p, end: p, chord: false }; }
  return { profile: B, blend: { from: A, s0: 0, length }, start: A, end: B, chord: true };
}

function toSegments(doc, { segM = 2, designKmh = MACH6.designSpeedKmh, cupRuns = true } = {}) {`],
["  const legacyFirst = (P) => { const m = chan(P, P.length / nOf(P) / 2); return profileAt(P.family, m.w, m.r); };   // the profile of the piece's first segment\n  const legacyLast = (P) => { const n = nOf(P), m = chan(P, (P.length * (2 * n - 1)) / (2 * n)); return profileAt(P.family, m.w, m.r); };   // and of its last",
 "  const legacyAt = (P, j) => { const n = nOf(P), s0 = (P.length * j) / n, s1 = (P.length * (j + 1)) / n; return legacySeg(P.family, chan(P, s0), chan(P, s1), chan(P, (s0 + s1) / 2), s1 - s0); };\n  const legacyFirst = (P) => legacyAt(P, 0).start;   // the first row of the piece's first segment\n  const legacyLast = (P) => legacyAt(P, nOf(P) - 1).end;   // and the last row of its last"],
["      const profile = cup ? cup[j].profile : profileAt(P.family, mid.w, mid.r);   // a legacy piece: today's profileAt, unchanged\n      segs.push({ id: P.id, word: 'core', part: 'body', kind: 'road', length: s1 - s0, k0: a.kh, k1: b.kh, kp0: a.kv, kp1: b.kv, roll0: a.phi, roll1: b.phi, heartline: 0, profile, blend: cup ? cup[j].blend : null, speed: null, ...(cup ? { cup: true } : {}) });",
 "      const L = cup ? null : legacySeg(P.family, a, b, mid, s1 - s0), profile = cup ? cup[j].profile : L.profile;   // a legacy piece: today's profileAt, or a chord where the width or r changes\n      segs.push({ id: P.id, word: 'core', part: 'body', kind: 'road', length: s1 - s0, k0: a.kh, k1: b.kh, kp0: a.kv, kp1: b.kv, roll0: a.phi, roll1: b.phi, heartline: 0, profile, blend: cup ? cup[j].blend : L.blend, speed: null, ...(cup ? { cup: true } : L.chord ? { chord: true } : {}) });"],
["      a = b; lastProfile = cup ? cup[j].end : profile;", "      a = b; lastProfile = cup ? cup[j].end : L.end;"],
]);

patch('src/geom/profile.js', [
["function readAt(seg, d) { return seg.cup ? atSegment(seg, d) : normalize(seg.profile); }",
 "function readAt(seg, d) { return readsBlend(seg) ? atSegment(seg, d) : normalize(seg.profile); }\n/** The segments whose blend a reader evaluates: a cup's, and a legacy CHORD (D196: the core's width or r changing inside a segment); never a word document's font transition. */\nfunction readsBlend(seg) { return !!(seg && (seg.cup || seg.chord)); }"],
["  if (!segments.some((g) => g.cup)) return [];", "  if (!segments.some(readsBlend)) return [];"],
["(a.cup || b.cup)) out.push({ j, lap: false, m: step(a, b) });", "(readsBlend(a) || readsBlend(b))) out.push({ j, lap: false, m: step(a, b) });"],
["if (closed && segments.length > 1 && road(a) && road(b) && (a.cup || b.cup))", "if (closed && segments.length > 1 && road(a) && road(b) && (readsBlend(a) || readsBlend(b)))"],
["atSegment, readAt, stepBetween, jointSteps };", "atSegment, readAt, readsBlend, stepBetween, jointSteps };"],
]);
patch('src/validate/index.js', [["return g.cup && g.blend ? constOf(P.atSegment(", "return P.readsBlend(g) && g.blend ? constOf(P.atSegment("]]);
patch('app/core/coreshell.js', [["return g.cup && g.blend ? Prof.atSegment(g, m.s - starts[m.seg]) : g.profile; };", "return Prof.readsBlend(g) && g.blend ? Prof.atSegment(g, m.s - starts[m.seg]) : g.profile; };"]]);

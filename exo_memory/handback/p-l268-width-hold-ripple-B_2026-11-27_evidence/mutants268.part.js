const MUTANTS = [
  { id: 'H1 the width is never held: it goes on at the brush\'s slope, as before L264', edits: [[EX, 'const holdW = held && !given(targets.w) && from.w.m !== 0 ? from.w.v : undefined, holdR', 'const holdW = undefined, holdR']] },
  { id: 'H5 a typed width is held at the head\'s width instead', edits: [[EX, 'held && !given(targets.w) && from.w.m', 'held && from.w.m']] },
  // L268: the hold LAID as a short ramp (rampControl), not fitted
  { id: 'N1 the hold is fitted again (rampControl not run on it), on the new knots', edits: [[EX, 'if (holdR !== undefined) rampControl(piece, ', 'if (false) rampControl(piece, ']] },
  { id: 'N2 the hold\'s ramp gets no knots of its own (laid on the piece\'s even knots)', edits: [[EX, 'const knots = holdR === undefined ? knots0 :', 'const knots = true ? knots0 :']] },
  { id: 'N3 a held bank piece loses its quarter knots (extend passes no base)', edits: [[EX, ', shortRamps.length ? undefined : knots0);', ');']] },
  { id: 'N4 the joint is not held: rampControl overwrites the head\'s value and slope too', edits: [[EX, "rampControl(piece, 'w', from.w, holdW, holdR, held, sub)", "rampControl(piece, 'w', from.w, holdW, holdR, false, sub)"]] },
  { id: 'N5 the hold\'s ramp is the whole piece, not the first knot span', edits: [[EX, 'holdR = holdW === undefined ? undefined : startRampM(length, knotM)', 'holdR = holdW === undefined ? undefined : length']] },
  { id: 'N6 a held bank piece loses its quarter knots (rampKnots ignores base)', edits: [[EX, '(base || D.evenKnots(length, knotM))', 'D.evenKnots(length, knotM)']] },
  // LEFT OUT (L264, pane B): 'a level head is held too' (`&& from.w.m !== 0` taken out) is EQUIVALENT: at a level head the hold's target is the head's own width
  // and its slope is 0, so every control point is that width, which is what going on at a slope of 0 lays (pane B's scratch h6check.js: every row passes on it,
  // at L264 and again at L268). The condition is kept so that a level head is not touched by construction, not by rounding.
  // LEFT OUT (L268, pane B): L264's H2 (the hold's blend spread over the whole piece) and H4 (the blend starting level) are EQUIVALENT now: they change only the
  // width function roadPiece fits, and rampControl then overwrites every free control point (the first two carry the head's value and slope from `from`, not
  // from that function), so the piece is the same (precheck268.txt: 8 of 8 rows pass on each). L264's H3 and H6 mutated the end pin, which L268 removed
  // (rampControl ends the hold at the head's width itself: pincheck.txt, 10 re-laying paths with the pin out, the last two control points exact on all).
];

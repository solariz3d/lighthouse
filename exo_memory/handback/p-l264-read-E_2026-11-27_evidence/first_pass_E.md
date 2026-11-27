# L264 read, pane E: first pass on c522ea6..e112a14, written before B's hand-back was opened

Read before this: the order (`exo_memory/loop/packet_t180_extend_holds_width_after_brush_2026-11-27.md`, whole), the chair's paste (its items 1-3), and the
diff of `src/core/extend.js`, `app/test/drag-ghost.test.js`, `CHANGELOG.md` and `MAP.md` (not yet the two new test files).

## What the code does (by reading)
- `extend()`: `holdW = held && !given(targets.w) && from.w.m !== 0 ? from.w.v : undefined`. With a head (not an empty track), no width typed, and a
  head width slope that is not EXACTLY 0, the width channel is `channelFn(from.w, holdW, startRampM(length, knotM), 'w')`: the Bloss cubic from the
  continuation `v + m·s` to `v` over the first knot span (at most 20 m; the whole piece when shorter). After everything else, the last two control
  points are set to `holdW`, so the piece ends level at the head's value.
- A width change list cannot come without a width target (`changeLists`: "a change of … follows a first: give it a target too"), so the end pin
  cannot overwrite a change's target. Checked by reading only.
- Every other caller of `extend` with no width target gets the hold too: `turnby.js` (corners), `sharp.js`, `level.js`, `jump.js` (take-off),
  `finish.js` (the straight and the roll before the closing piece), `readout.js:150` (a probe). The drag-ghost row-5 amendment shows the corners moved.

## Expectations, registered before running
1. A brush in the MIDDLE of the road whose falloff does not reach the head: the head is level, no hold, the bytes are the base's.
2. A CLOSED lap has no open end; I expect Extend to be refused there on both trees, so the hold cannot act. If the lap is closed by Finish from a
   brushed head, the straight Finish lays now holds the width; the lap must still close.
3. A width brushed DOWN: the mirror of B's case; the hold overshoots the other way by a few mm and the joint is C1.
4. An Extend with a width TYPED: no hold on that piece; the next Extend, left as shown, sees a level head IF the typed ramp ends exactly level
   (`pieceEnd` reads m from the last two control points). If a typed ramp can end with a slope that is not exactly 0, the hold engages there too
   (holding the typed width: wanted, but then "a level head" is narrower than "a head after an Extend").
5. Size of the move inside the span: the Bloss blend of `v + m·s` back to `v` peaks at about 0.26·m·L past the head's value (L the span). B's
   +1.37 m brush leaves m ≈ 0.001, so ≈ 5 mm before fitting. A brush whose falloff ends nearer the head leaves a steeper m; at m = 0.1 and L = 20 m
   that is about 0.5 m. The CHANGELOG says "a few millimetres … (3.7 mm after that brush)"; I will measure m over brushes placed nearer the head.

## Pre-registered: NOT CLEAN if
- a touched row is red at e112a14, or a mutant NOT APPLIED is counted caught;
- in any of my four cases the joint kinks (value or slope not continuous), or a typed width does not go where it is typed;
- an Extend from a level head lays bytes different from c522ea6's;
- after a brush, any channel but the width is laid differently on the two trees;
- the hold moves a piece already on the track (in a saved track, extended once on both trees);
- the amended drag-ghost row 5 pins less than before for anything but the corners' width, or "59 to 210 m wide" is false at the base;
- the CHANGELOG states a figure or a rule that a run contradicts;
- a caller (Finish, a corner, a sharp turn, level, a jump) refuses or fails to close where it did at the base because of the hold.

# Packet (on D, 2026-11-27): the width hold must not move the path. A repair on `l264-extend-holds-width-b`, then a delta read

Written by the librarian on D after the read `handback/p-d678-ripple-read-E_2026-11-27.md` (git-blob b89271ab, read whole): CLEAN
by its registered conditions, with F4 outside them. His word for the feature is his pick of 04:21 on L (Extend holds the width
after a width brush; `briefs/t180_unmakeable_shapes.md`). This repair is the librarian's ruling under that pick; he is told and
can stop it. Tier: PROVE IT (the core's geometry). No build, no install, no merge to the builder's `main`.

## The finding (do not work it out again)

The read's §5 F4, with `chan678.txt` and `endpos678.txt` in its evidence folder: at c2591bf the hold's extra knots are the whole
piece's, and the piece's other channels are fitted on them. For a turn that changes inside the piece this moves the path: after a
width brush, Turn by −90 over 200 ends 31.7 cm from where it ends at e112a14 and from where the same head ends when it is level;
Turn by 45 3.3 cm; Sharp −60 R40 ramp 8 13.9 cm. The size does not depend on the brush (a 1 mm brush moves it as far as a
steep grab). Extend, Jump and Level are unmoved.

**The ruling:** the path a Turn or a Sharp lays must not depend on whether the width was still changing at the head.

## Track 1 (the builder of the hold): the repair

- **A direction, to be refused if it is wrong, with the reason:** the core already has the move. `src/core/extend.js:279-282`
  (the second bank, L135) inserts knots by `document.js insertKnots` (Boehm's rule, `document.js:689`), "so every other channel
  keeps its curve", and then refits the one channel alone. Lay the piece as e112a14 lays every channel but the width, insert the
  hold's knots, and fit the width alone on them.
- **Register before any run, in the hand-back, then measure:**
  1. On every row of the read's F4 table (and Finish's six heads): the turn channel and the end point equal the same head laid
     LEVEL, and e112a14's, to the document's own quantum. State that quantum first; if insertion plus quantising moves the curve
     by more than it, say by how much and stop.
  2. The width's own rows are c2591bf's to the digit (the 8 rows of `ripple268.js`, which is committed in
     `handback/p-l268-width-hold-ripple-B_2026-11-27_evidence/`; the bar of bec0f333).
  3. A level head lays the same bytes as at c522ea6; his saved tracks and undo steps re-save the same (copies only).
  - **What fails the direction:** row 1 not met, or row 2 lost to meet it. Then say which, and do not force it.
- A row red at c2591bf first for the path (the −90 over 200 case), then green. The mutation harnesses that name `extend.js`.
- **Sharp (the read's F1):** its hold is the first span of a 2 m spacing (1.9 m), so its edge bends up to 7.15 per m after a
  steep grab; it did so at e112a14 too (4.51). Not changed here. Say in the hand-back what a longer hold on Sharp would cost.
- **The CHANGELOG's words** (the read's F1, F2, F3): the swing, settle and price figures are Extend's on a 100 m piece (shorter
  pieces bend harder: 9.71 times on 10 m); Sharp's hold is its own and shorter; "up to 30 cm" is not a ceiling (a grab near the
  end swings up to 2.55 m; the rule is about 1.5 times the head's change per metre). And the path statement, once row 1 holds.
- F5 (a typed width from a still-changing head ends 1.3 mm off level; older than both commits) is recorded, not ordered.

## Track 2 (the reader of e112a14..c2591bf, after track 1): the delta read

c2591bf..the new tip. Re-run `d678.js` and `cmp678.js` on the new tip against c2591bf: the width columns must be the same and the
F4 table must read 0. Vary one thing the builder's rows do not.

NEXT: chair dispatch track 1 to the builder of the hold when a pane is free; that pane call_librarian with its hand-back

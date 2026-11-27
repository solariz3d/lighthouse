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

---

## Amended 12:4x (D), after `handback/p-d678-width-hold-path-B_2026-11-27.md` (read from "1. Results" to the end; builder 346e2a0 on origin)

The repair holds for every caller the ruling names (36 of 36 against the same head with its width level, within 0.636 of a
step; the width's rows c2591bf's to the digit, 110 of 110; his copies 1306 of 1306 hashes). Three rulings, the librarian's:

1. **Finish: one bounded try (the hand-back's open item 1), by the builder, before the delta read.** Lay Finish's pieces
   without the hold and lay it after `close`, before the bank-as-built check. Register first: Finish's three new pieces from
   E's five brushed lap heads equal the level head's lap to one step of each channel and the same lengths, the first piece's
   width still `layHold`'s (0 control-point differences, as `closew678.js` reads now), a level head the same bytes, the lap
   still closes. **If it does not meet that in one attempt, revert it and leave Finish as it is at 346e2a0** (up to 0.97 degrees
   of bank in a closing piece nobody types, ends within 6.4e-5 m), with one CHANGELOG sentence saying so. No second attempt.
2. **Sharp's hold stays as it is.** A longer hold bends less and swings further (the hand-back's 1.5); not changed.
3. **Track 2's bar, restated** as the hand-back's open item 3: the width columns the same as c2591bf for every caller but
   Sharp R40 ramp 8 and Sharp R150 ramp 4; those within 1.1 mm of swing and ending level (the Sharp piece is the level length
   again). The F4 table reads within one step. The reader also reads the three things the tier found (EX12's anchor, D9's new
   case from 10 m, drag-ghost row 5's new pin) and Finish, whichever way ruling 1 came out.

**The key of other authors' names** is at `C:\Users\nname\Desktop\t180-track-builder\reads\reference_key_2026-11-26.local.md`
(the brief's "builder checkout" is that one, not Downloads). Checked by the librarian at 12:4x with its names: 0 hits in the
builder diff c2591bf..346e2a0, its commit messages, and the hand-back with its evidence (control: 5 in the key itself).

NEXT: chair dispatch ruling 1 to the builder of the hold, then Track 2 to the reader when the builder rings; each pane call_librarian with its hand-back

---

## Amended 13:4x (D), after the delta read `handback/p-d678-width-hold-delta-read-E_2026-11-27.md` (git-blob 8a4e9535; verdict, sections 4, 5, 6 and 8 read)

The code meets ruling 3's bar. NOT CLEAN on two CHANGELOG sentences, and one case outside the bar. Words only; no code:

- **C1:** "the closed lap's pieces end within 0.1 mm of a level head's" is true of the lap's end only. Say: the lap's end
  within 0.1 mm; its first two new pieces end about 1.4 and 1.0 mm from a level head's.
- **C2:** Sharp's bend after the steep grab is 5.0 to 9.0 per metre at the joint (8.95 with a ramp of 1), not 4.4 to 7.2: the
  0.1 m sample missed the peak at the joint.
- **F1, one sentence for a case nothing names:** when the width is still changing at the head and a bank, cup or edge is typed
  "at start" in the same Extend, the width sits off the head's by about a third of the head's change per metre times the
  ramp's first subdivision, for about 10 m, then returns (47 mm after the wide brush on a 30 m piece; 0.52 m after the steep
  grab), and is within 1 mm by about 16 m. Not changed here: it is half as deep as at c2591bf and it is the hold's stated
  design. Recorded as a known edge in `briefs/t180_unmakeable_shapes.md`.

Then the reader's short read of those three sentences against its own figures, and the branch may ride the next test build.

NEXT: chair dispatch the three CHANGELOG sentences to the builder of the hold, then the short read to the reader; each pane call_librarian

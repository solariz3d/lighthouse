# T-180: a Close that stays local, and refusals that say what's wrong and where. Librarian, on D, 2026-10-04 23:5x. Lap D242.

The keeper, 23:41–23:43, on TEST 1: "the close the loop fucked up my track … after clicking the close the loop towards the end, lots of the
track in the beginning is clipping into each other … like completing the loop altered the rest of the track equation". Then "no its
fucked" (Undo didn't bring it back for him).

## Checked
- **Close changes the WHOLE lap, by design:** `.claude/skills/track-equations/references/10_sculpt_close.md` §3. It's a least-norm
  Gauss–Newton step over EVERY control point, with only the stretch edited last weighted heavily (w_edit ≫ 1).
  - Measured on TEST 1 (the librarian, comparing the keeper's earlier save `eq-TEST.t180track`, 22:19, whose six pieces are TEST 1's
    first six): the close moved piece p1's (1,000 m) heading rate by up to **0.00204 rad/m**, and pitch by 0.0008 rad/m. Pieces p2–p6
    moved by 3e-5 to 1.4e-4 rad/m.
  - **Long pieces take the largest share of the correction,** and here that was the opening straight.
- **Recovery done (librarian):**
  - the closed file is backed up at `%APPDATA%\com.solariz3d.t180-track-builder\track-backups\eq-TEST 1.2339-closed.t180track`;
  - a new file, `eq-TEST 1 recovered.t180track`: p1–p6 from the 22:19 save, p7–p46 as closed, open again, and p7's start matched C1 to
    p6's end (kh, kv).
- **E's diagnosis of the reds** (`loop/test1_raygap_diagnosis_2026-10-04.md`): all REAL, with NO hole and no validator artefact. The
  layout overlaps itself:
  - the rolled turn at about 0.68°/m closes a circle every ~529 m and stacks on its own coil (0.93–10.8 m between centrelines);
  - that circle also crosses p3 and p14.
  - **29 reds in all** (6 downforce-ray-gap, 13 self-intersection, 13 stacked-within-2m, 1 roll-rate at 1.219 against 1.2144, and
    1 lap-proof), and the keeper's message showed ONLY THE FIRST, under a misleading name ("gap").

## The lap (A when relaunched, or else C; EXPORT tier for the close, which edits documents; FEEL tier for the messages)
1. **A local Close:**
   - the correction is confined to a window the keeper picks, default the LAST piece or last ~20% of the lap, never the whole lap
     unless he asks;
   - control points outside the window are fixed (weight ∞, i.e. not variables);
   - if the window can't close the loop within the curvature, roll-rate and cup limits, the close REFUSES by name ("can't close using
     only the last N m: widen the window or reshape the end") instead of reaching back into the track.
2. **A preview before applying:** Close shows the closed track as a ghost (the D235 ghost machinery), with how far each piece moved
   (max metres of centreline displacement per piece). The keeper applies or cancels. Undo still works after applying.
3. **An overlap check on the preview:** if the closed track self-intersects or stacks (the same checks validation uses), say so on the
   preview, with where.
4. **The refusal shows EVERY red, in plain words:**
   - grouped by kind, with a count and where (s in km, and the piece name);
   - plain names: "the road overlaps itself" for self-intersection / stacked / downforce-ray-gap when the ray hits another piece;
     "rolls too fast" for roll-rate; and so on;
   - a click on a red moves the camera there.
   - The live validation panel should already show them while building; check it does on TEST 1 and say why the keeper didn't see it.
5. **Piece labels on HOVER only** (the keeper, 23:46: "when there are lots of pieces, the tags take up a lot of space, it should be only when you hover over the pieces does it come up to save performance"): `app/core/labels.js` draws every piece's tag each frame (E's D235 profile: labels laid out every animation frame). Show ONE label, for the piece under the pointer (and the selected / head piece); none otherwise. The layout work drops to that one label.
6. **Straights after a turn** (the keeper, 23:52: "ever since a turn is introduced, it is impossible to create a perfect straight"). Checked by the librarian through the core shell (`lib-mirror-build`): after a 30°/100m turn, Extend 300 m at turn 0 eases over the WHOLE piece (30.0, 28.5 at 40 m, 22.2 at 100 m, 7.8 at 200 m, 0 only at 300 m) unless the turn field's "at start" box is ticked, which gives 30 → 2.5 at 10 m → 0.0000 from 20 m on, a perfect straight. So the core works; the default hides it. Add a **Straight** button (turn 0 and climb 0, both "at start", one click), and when the turn target is 0 after a turn, show a one-line hint that "at start" makes it straight from 20 m.
- **Tests:**
  - a close confined to the last piece leaves every earlier piece's control points bit-identical;
  - a close that can't fit its window refuses by name;
  - TEST-1-like stacking (a synthetic coil) shows in the preview's overlap check;
  - the refusal lists all reds;
  - fixtures 0 of 9 (no export change);
  - the existing close tests either still pass or are amended by name where "whole-lap" was the asserted behaviour.

NEXT: chair dispatch D242 to A (relaunched) or C after D239 when this plan is read; the keeper is blocked on TEST 1

## AMENDMENT (librarian, 2026-10-05 09:0x): item 7, Undo gives back the undone piece's values
The keeper, 09:03: "when you press undo, it doesnt keep the stats for the piece you undid to tweak, it carries over the equation from
the stats of the undo that disappears".
- **Checked:** `app/core/panel.js:245`: on ANY new document (Extend, Undo, Redo, open, a brush) the Extend fields are refilled with
  `showHead()` (`:127`), the HEAD's end state. So after Undo they show where the previous piece ENDS, and the undone piece's own length,
  turn, climb, bank, cup, width, edge, tube and its "at start" ticks are gone. Re-extending can't reproduce it with one number tweaked.
- **7. When Undo removes an Extend, fill the fields with THAT piece's values** (its length, its target at its end for every channel it set,
  and its at-start ticks), so pressing Extend again rebuilds it exactly, and the keeper changes only the one number he wanted. Redo, a
  brush and open keep today's behaviour. **Test:** extend with values X, undo, and the fields read X; Extend again rebuilds a
  byte-identical piece.
- **Item 7, refined (librarian, 09:0x), after the keeper's "bc the equation carries over from where it was before you pressed undo":**
  checked through the core shell (`lib-mirror-build`): extend a straight, extend a 30°/100m turn with 20° bank, Undo, extend turn 0 →
  the new piece starts at turn 0.000, bank 0.000. **The core restarts correctly from the current end.** So whatever "carries over" lives in
  the PANEL (the fields, the ghost or the readout after Undo). B reproduces it in the real page first (extend X, Undo, then look at what the
  fields, ghost and readout show and what the next Extend builds), says exactly what carried over, and fixes it to the spec above.

## AMENDMENT (librarian, 2026-10-05 09:1x): item 8, undo/redo like an editor
The keeper, 09:04: "make it like photoshop or video editing programs, cntrl z and what ever to go forward and back".
- **Checked:** the shortcuts EXIST, in `app/shell.js:282-291` `keyAction`: Ctrl+Z undo, Ctrl+Shift+Z and Ctrl+Y redo, Ctrl+S save,
  Ctrl+Backspace remove head. But `if (inField) return null` (`:283`): **while the cursor is in any Extend field, which is most of the
  time when editing, Ctrl+Z does nothing to the track** (the browser undoes typing in the box instead). The Undo/Redo buttons don't name
  the keys.
- **8a.** Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z work on the TRACK from anywhere on the page, number fields included. A field with half-typed,
  un-extended text loses that text on undo, because Undo refills the fields (item 7). The buttons' tooltips name the keys.
- **8b. A History list** (Photoshop-style), in the left column under Undo/Redo: every step by name ("Extend 300 m, turn 30", "Brush bank
  at 4.2 km", "Close"). Click one to jump back to it; steps after it stay until the next edit (then they drop, as Redo does today).
- **D239 note:** removing the Pieces mode removes `app/shell.js`. `keyAction` must MOVE to the core page, not be deleted with it.
- **Tests:** Ctrl+Z with focus in a number field undoes the track; the History list jumps to step N and Redo goes forward from it.

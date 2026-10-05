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
- **Tests:**
  - a close confined to the last piece leaves every earlier piece's control points bit-identical;
  - a close that can't fit its window refuses by name;
  - TEST-1-like stacking (a synthetic coil) shows in the preview's overlap check;
  - the refusal lists all reds;
  - fixtures 0 of 9 (no export change);
  - the existing close tests either still pass or are amended by name where "whole-lap" was the asserted behaviour.

NEXT: chair dispatch D242 to A (relaunched) or C after D239 when this plan is read; the keeper is blocked on TEST 1

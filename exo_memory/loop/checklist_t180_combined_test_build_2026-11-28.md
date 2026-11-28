# Checklist: the combined test build, `landing-1128-combined` 0ba1da9

For him, in plain words, once he says yes to the install. Each line is one thing to try and what he should see. Anything
that surprises him is a finding.

**The build:**
- exe sha256 5c24ddf2…, installer sha256 81c21a0e… (0.4.40);
- `handback/p-l272-combined-P_2026-11-28.md` sections 00, 9 and 10;
- the pictures are in its `_evidence/` folder.

**Checked before it reached him:**
- every piece was read CLEAN by a seat that did not write it;
- the whole suite has no functional red;
- his 16 tracks and 49 undo steps save the same, both by bytes and through the app;
- the one slow row (D642) is the laptop: 20 readings across four builds, none slower than the build he runs now.

## 1. Width holds after a brush
- Brush the width near the road's end, then press Extend with the fields left as they are.
  - **Expect:** the new piece keeps the width you brushed to. Before, the width kept changing along the new piece, and could
    go below zero, which refused the piece.

## 2. The ghost sits on the road
- After a grab or a nudge near the end, hover Extend.
  - **Expect:** the ghost lies exactly where the piece will go.
  - **You may see:** the ghost swing sideways or climb. Extend has always laid the piece there; the old ghost hid it.
    About 12 m over 100 m after one width grab near the end. Open question: should the next piece start steady instead?
- Grab the width near the end where today's build says "no preview of this piece".
  - **Expect:** a ghost, and no red note.
  - Picture: `ghost/noprev_0ba1da9_focus600_handles-on.png`.

## 3. The grab along the slope (judge it by feel)
- On a banked turn, grab the edge and pull it sideways.
  - **Expect:** the bank stays where you set it. Today it tips about 5°.
  - **Feel for:** the grabbed point rides up or down the slope, away from your cursor, about 1.5 to 2 m on a 20° bank.
  - Picture: `slope/pair_Bminus_1_during.png`.
- On a tube, grab partway up the wall and pull sideways.
  - **Expect:** the tube no longer rolls. It sinks instead, and the point ends below the cursor.
  - **Ask yourself:** did you use that roll?
- On a flat road, with or without a cup, grab at the edge.
  - **Expect:** the same as today.
- If your hand rises while you pull on a banked road, the bank now changes by the whole lift. Today the pull cancelled part
  of it.
- **Your call:** keep it, or go back to today's grab.

## 4. Even, the clean road (your "B")
- Even a stretch you've pulled with grabs, in the middle of a track.
  - **Expect:** the pulled edge goes back in line with the road on either side. The message says how far it moved and where.
- Even a stretch that starts at the very beginning of a track.
  - **Expect:** the width is evened, and the edge stays where it is. The message says why: the road's width at the start
    differs from the other end.
  - Picture: `even/even_2_after_sentence.png`.
- Even a stretch you never touched.
  - **You may see:** a small move, about 0.36 m, in the lead-in just before the stretch, reported in the message. A known
    quirk, older than tonight.
- Drag with Even on your biggest track.
  - **Expect:** about 0.2 to 0.3 s a step, and a pause of about 1 s when you let go.

## 5. Your own tracks
- Open three of your own tracks, Undo and Redo a few steps, and save.
  - **Expect:** nothing changes that you didn't change.

**Going back:** the build you run now is backed up beside the new one, and one step restores it.

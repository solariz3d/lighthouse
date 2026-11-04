# T-180: too much text on the left; the share code is in the way; the values need to be where you can see them. Librarian, on D, 2026-10-07 10:2x. Lap D267.

The keeper, 10:15, relaying a tester (Chase): "theres too much damn text on the left side that overwhelmed chase". He quoted four texts, then: "what tf
is the copy code paste code t180 code here??? the values or degrees for the track needs to be in a better spot to be seen".

## Where the texts live (read at t180 `e850c45`)
- Tube width note: `app/core/widthlike.js:32` `tubeNote` ("A tube's width is the distance ROUND it, not across. 45 m round is a tube 14.3 m across (w/π).")
- Grip: `app/core/panel.js` ~:143 and `app/core/griplike.js` ("100% is AC's own road. The checker does not model grip … drive it in AC.")
- Turn 0 hint: `app/core/panel.js:228-230` (`straightHint`: "turn 0 eases over the whole piece: tick "at start" …")
- Jump: `app/core/panel.js:332` `JUMP_HINT`, shown under the button, and `:340` its title.
- Share codes: `app/index.html:104` `<section id="share">`, mounted at `:291` from `app/share/index.js` (D239: an equation track as a text code you copy and paste).

## The lap (A, who built the panel, handles and ghost; FEEL tier: rows and fake hosts, no real window)
1. **Help text out of the column.** No paragraph stays under a field. Each becomes a short `title` tooltip (or a small "?" with the tooltip), and the
   visible part is at most a few words:
   - Tube width: the field shows "≈ 14.3 m across" beside it; the explanation becomes a tooltip.
   - Grip: the visible label is just "Grip 100%". The "does not model grip / drive it in AC" sentence is CUT, not moved: the keeper asked what the point
     of it is. "100% = AC's road" becomes the tooltip.
   - Turn 0: the hint line is removed; its sense goes into the "at start" box's tooltip.
   - Jump: `JUMP_HINT` is no longer shown under the button; the button's tooltip keeps one sentence.
2. **Share codes into the ⋯ menu:** "Copy track code" and "Paste track code…". The section leaves the left column. Nothing is removed: a code is still made
   and read exactly as now (`app/share/index.js` unchanged apart from where it mounts).
3. **The values, where you can see them:** the live length / turn ° / bank ° / climb ° / width of the piece being edited, drawn LARGE as an overlay at
   the top of the 3D view (or beside the dragged handle), updated as you drag or type. The left column's own copy may stay small or go.
- Rows: each text no longer renders in the panel (red first); the tooltips carry the words; the share buttons sit in ⋯ and round-trip a code; the overlay
  shows the dragged value and follows a drag step. Targeted tests only, no harness runs (FEEL tier). CHANGELOG under [Unreleased].
- inferred: (3) is read from "values or degrees … in a better spot to be seen". If the keeper meant a different spot, it is one constant.
- After it lands: install on the shortcut; release as 0.3.2 if the keeper wants it public.

NEXT: chair dispatch D267 to A when this plan is read

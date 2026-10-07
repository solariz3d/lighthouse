# T-180: saved pieces off the left column, into a top-bar drop-down menu. Librarian, on D, 2026-10-07 10:2x. Lap D269.

The keeper, 10:26: "also take the saved pieces off the side, and add it somewhere to the top bar, and it will have like a drop down menu where all the
saved pieces will be, think of like a sony vegas or something design IDK".

## Where it lives (read at A's `e05247c`)
- `app/core/piecesui.js` (D240): the selection block ("Save as piece", `:40`) and THE LIBRARY (`:80`): every saved piece with name, length, turn, climb and
  a plan thumbnail; Add at head (optionally mirrored), Rename, Delete.

## The lap (A, who just moved the share codes into ⋯ and knows the top bar; FEEL tier: rows and fake hosts, no real window)
1. **A "Pieces ▾" button in the top bar** (beside Open… / Previous versions…). It opens a drop-down PANEL (the editor-style one he points at: a media-bin
   feel), not a plain `<select>`. It holds one row per saved piece: the plan thumbnail, the name, and the one-line summary (`3 pieces · 540 m · turn +90°`).
   Each row has its actions: Add at head, mirrored, Rename and Delete; a click on the row adds it at the head. Esc or a click outside closes it.
2. **The library leaves the left column.** "Save as piece" stays with the SELECTION (it acts on the selected pieces), and after a save the new piece is in
   the menu. The empty-state words move into the menu.
3. Nothing about saving, the files or Add changes: `shell.listPieces()` and the actions are reused as they are.
- Rows: the library is not in the left column; the menu lists every piece with its thumbnail and summary; Add / mirrored / Rename / Delete from the
  menu do what they did; it closes on Esc and outside. Red first, targeted tests only. CHANGELOG under [Unreleased].
- inferred: "like a sony vegas" is read as a bin of thumbnails in a drop-down panel. If he meant a docked strip, it is a layout change, not a rewrite.
- It goes on top of `e05247c` (D267), then install; 0.3.2 with D267 and D268.

NEXT: chair dispatch D269 to A when this plan is read

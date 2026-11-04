# D269: saved pieces move to a "Pieces ▾" drop-down in the top bar — seat A (Sonnet 5.5), 2026-10-07

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_t180_pieces_menu_2026-10-07.md · `git -C C:/Users/nname/Desktop/worktrees/a-pm-wt log -1 --format=%h` · evidence `p-piecesmenu-A_2026-10-07_evidence/` (`red_on_e05247c.txt`, `green_targeted_run1.txt`, `green_rerun_after_19c.txt`)

**Done: commit `a47d40b` on branch `piecesmenu-a` (worktree `C:\Users\nname\Desktop\worktrees\a-pm-wt`), from t180 main `e05247c`. Local, nothing pushed, no real window (rows and fake hosts only).**

## What it does
1. **A "Pieces ▾" button in the top bar** (`app/index.html`: `<details id="pieces">` between Previous versions… and ⋯), opening a bin under the bar (420 px wide, scrolls, left-aligned): one row per saved piece with the **plan thumbnail**, the **name** and the **one-line summary** ("2 pieces · 300 m · turn +60.0° · climb 0.0° · plain"). **A click on the row adds the piece at the head**; the row's buttons are **Add at head**, **Add mirrored** (new; the mirror checkbox is still at the top of the bin and still applies to Add at head and the row click), **Rename** and **Delete** (still asks first). It lists the pieces fresh each time it opens, **closes on Esc or a press anywhere outside it** (a press on the Pieces button is the browser's own toggle), and says "No saved pieces yet: select pieces on the track and press Save as piece." when empty.
2. **The library left the left column.** `panel.js` finds `#pieces-bin` by id (as it finds `#preview`) and moves the library nodes of `piecesui.js` into it; **Save as piece stays with the selection** in the left column, and after a save the piece is in the menu. With no such element (a headless host, the older tests) the library stays in the panel as before.
3. **Nothing about saving, the files or Add changed:** `shell.listPieces()` and `insertPiece` / `renamePiece` / `deletePieceFile` are called as they were.

## Rows (red first)
- **Red on `e05247c`** (`red_on_e05247c.txt`): row 20 ("nothing of the library is under the panel root") and 20b ("opening it lists the saved pieces") fail; **green after**.
- **Row 20:** the library is not under the panel root and there is no "Pieces library" heading in the left column; the list, the empty words, a saved piece's row (thumbnail canvas, name, summary string) are in the bin; Save as piece is in the left column and not in the bin; Add at head is ONE undo step; Add mirrored mirrors (message says so); a click on the row adds it, a click that began on a button does not; Rename and Delete (with its confirm) work from the bin as before.
- **Row 20b:** opening lists the pieces; another key leaves it open, Esc closes it, Esc when closed does nothing; a press inside keeps it open, a press outside (the 3D view) closes it, a press on the `<details>` itself is left to the browser; after unmount the listeners are gone; the top bar HTML has `<details id="pieces">` between `open`/`versions` and `more`, and no `pieces-bin` in the left column.
- **Restated:** D267's row 19c took "the first `</div></details>`" for the ⋯ menu; the new menu comes before it, so it now finds the ⋯ menu by its own id (my test, not the product; it was the one failure of the first run).
- **Targeted run under the lock:** first run 20 files, **271 tests, 270 pass, 1 fail (19c, fixed)**; after the fix `core-pieces-ui`, `core-xsec`, `layout-css`, `shell-dist`, `core-readout-display`: **101 of 101 pass**. The first run covered `core-pieces-ui`, `core-xsec`, `core-readout-display`, `core-widthlike`, `layout-css`, `shell-dist`, `share-install`, `onboarding`, `guides`, `redgroups`, `handles`, `jump-ui`, `cheap-ghost`, `core-shell`, `core-sculpt`, `shell-ghost`, `palette-panels`, `timers-regression`, `keys-anywhere`, `shell-keys`; every one except row 19c passed.
- Mutation-harness anchors (not run): 223 edits, the same 3 not applied as before (`renderer.js`, `prove_render.js`), none in files I touched.
- `CHANGELOG.md` under [Unreleased] and `app/README.md` updated.

## "Sony Vegas": the question you asked me
**A drop-down bin, as the plan inferred, is what I built; a docked strip would fit "sony vegas" better IF he wants the pieces visible all the time while he builds** (a media bin sits open beside the timeline, and a drop-down hides the thing he is dragging from). The cost of the strip is screen: the top bar is one row now, so a strip is a second row of thumbnails above the 3D view. My view: keep the drop-down (the left column was the problem, and a strip takes height from the view he is already crowding), and see how he uses it; the move to a docked strip is the same row builder in a different container (`#pieces-bin` and its CSS), not a rewrite.

## Does NOT establish
Any real window: how the bin looks (420 px wide, thumbnails 100 × 60), whether the `<details>` closes properly in the real WebView on an outside press (the rows model the events: a `pointerdown` on the document, capture phase), and that nothing in the real page puts something over the bin (z-index 30 like ⋯). The whole suite and the four mutation harnesses (not run).

NEXT: librarian — plan default: a non-author look at `a47d40b` (`piecesui.js` menu and row click, `panel.js` bin move, `index.html`), install, then 0.3.2 with D267 and D268

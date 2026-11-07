# L154: the extra bank's mark explains itself. Librarian, on L, 2026-11-07 05:4x local

**His words** (`briefs/t180_second_bank.md`, 11:35Z and 11:37Z): "it works, and is good, the only problem is UI" · file name "THE extra banking length drag needs to be more understood wtf it is doing i figured it out but i bet new users will hate it" · "when you move the mouse right and left when clicking the point i marked, it drags the other point up and down the track, defintelly needs labels".
- Picture: `briefs/t180_extra_bank_length_drag_ui_2026-11-07.png`. Mock page with options A/B/C: https://claude.ai/artifact/DJuUpGT155EpNHm7RLq4iW.
- **Taken: C** (the shaded roll, arrows on the tick, and a label), because his goal is that a new user understands it, and he asked for labels. Cost in one line: the most drawing on screen.

**Base:** t180 local branch `l153-test` dabf7bf (way 1 + the mirror message), which is installed on L. Build on a new branch off it, `l154-mark-labels`.

## Pieces, disjoint
- **C (code read first, then build):**
  1. Find which handle he grabbed: the upper blue pair, whose sideways drag moves the extra bank's from mark (`app/core/panel.js` `secondDrag`, the handles in `handles.js`). Name the file:line of that sideways-to-mark mapping.
  2. Build option C:
     - the stretch of road from the tick to the piece end tinted in the bank's blue while the extra bank exists;
     - small arrows on the tick along the road;
     - a label at the tick: "Extra bank · <from> m → end · rolls over <L − from> m · drag to start earlier or later".
  3. On the handle he grabbed, show a hover label naming its sideways drag, e.g. "drag left/right: move where the extra bank starts". While that drag runs, light the tick and its stretch, so the link between the two points can be seen.
  4. Same treatment for any other extra field whose mark moves the same way (turn, climb), only if it shares the code path. Name it either way.
  - Tests: panel rows that the label text, the stretch's ends and the hover text follow the from. No byte of any built road moves (rebuild his good save byte-equal).
  - Touched tests and test-fast minus every timing file. **No timing run on L.**
- **E (after C rings):** a non-author read, plus still renders from a camera placed at the tick (Free or Chase at the mark, NOT the far default that failed in L152), base dabf7bf against the branch. Pictures of his piece.

**Then:** my page with E's renders. He looks, then the install, no release.

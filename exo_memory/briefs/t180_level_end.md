# T-180: level the end of a piece

## His words (verbatim, 2026-11-09, with a screenshot the librarian holds; `exo_memory/librarian/2026-11-09.md`, the 11:57 entry)

> made this nice turn but now I want the ending of it to level out but when you press level with turns added it breaks the level feature should work at the end of any piece to flatten it to level

> the level shouldnt level the whole turn, just the ending of the piece, even if it has the turns like shown

> throw a turn or climb into it, and it just disappears

(the second and third, 2026-11-09, through the chair's 11:58 packet)

## State (updated with the work)

- 2026-11-09, pane A, t180 branch `level-end` at `5c4ad36` (off origin main fc3cc63; not pushed, not landed):
  - core `levelEnd(doc, i)` in `src/core/level.js`: only piece i's climb is re-solved; its end is level and straight; the next road piece is re-joined C1. Tests: `test/core_level_end.test.js`, 9 rows, red first. Mutants: `test/core_level_mutation.test.js`, 16 applied, 16 caught.
  - Level and To floor now drop a climb carried in the fields as a corner, instead of refusing it ("it breaks").
  - NOT built: the button. Two placements are rendered for him to choose from: `t180_level_end_place_A_2026-11-09.png` (the Selected pieces box) and `t180_level_end_place_B_2026-11-09.png` (the Build menu, under To floor).
- 2026-11-09 later, pane A, `level-end` at `9a9a15d`:
  - Level end now reshapes only a TAIL at the piece's end. By default it is the shortest that keeps the car on the road and off its chassis; on his p3 that is the last 100 m. The turn and the climb before the tail are kept bit for bit.
  - "It disappears" was reproduced on the installed 82ae771 at 1536x864: with a piece selected the refusal is written below the window (`t180_level_end_repro_offscreen_2026-11-09.png`). A new refusal is now scrolled into view, guarded by `app/test/level-refusal-page.test.js`.
  - The placement render with the tail is `t180_level_end_place_A2_tail_2026-11-09.png`. The tail's drag mark on the track is not drawn yet.
  - Open question for him: Level drops a climb typed in the fields (it solves the climb itself). Is that fine, or should it refuse, on screen?
- Hand-back: `exo_memory/handback/p-d646-level-end-A_2026-11-09.md`.

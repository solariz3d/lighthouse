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
- His pick, 12:10: B ("for the artifact i like keeping the level where it is in B").
- 2026-11-09, pane A, `level-end` at `b7ec45f`, BUILT: Build ▸ Level end of <piece>, under To floor.
  - Pressing it levels the selected piece over its default tail in one undo step. The camera goes to the levelled stretch, which shows as an orange span with a mark at its start; dragging the mark earlier or later re-levels it, one undo for the whole drag.
  - With nothing selected, or a stretch too short, it says why on screen.
  - Seen in the page: `t180_level_end_built_menu_2026-11-09.png`, `t180_level_end_built_span_2026-11-09.png`, `t180_level_end_built_dragged_2026-11-09.png`.
- Next lap, not this one: his "perhaps the rest of the functions should also work in a similar fashion as level?"
- Hand-back: `exo_memory/handback/p-d646-level-end-A_2026-11-09.md`.
- 2026-11-09 16:0x, LANDED AND RELEASED: Level end is on t180 main and in **v0.4.40** (tag and main `b977eeb`), at his word 16:01: "push new release all of it its good". The release also carries the mark labels, way 1 and the mirror refusal. Hand-backs: `handback/p-d646-land-P_2026-11-09.md`, `handback/p-d647-release-done-P_2026-11-09.md`.
- Known gap, in the changelog: after undoing a drag of the tail, the span is not redrawn until Level end is pressed again.
- Open, his calls: a climb typed in the fields when Level is pressed is dropped quietly (flip to refuse if he says so); the end-forms lap (To floor end, Turn to grid end, Straight end on a placed piece, on the tail machinery) starts at his go.

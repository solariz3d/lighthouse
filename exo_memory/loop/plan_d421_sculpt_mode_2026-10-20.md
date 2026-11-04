# D421: the brush freeze, and Sculpt as its own mode (librarian, 2026-10-20 01:3x local)

**The keeper, 01:32:** "brush mode froze the program it is buggy and needs a rework. You can sculpt the pieces you already
put down, so its a mode you switch, so the equation track mode, then there will be sculpt or brush whatever, tweaking and
bending the track like say stretching it or manipulating it in many ways, look into 3d modeling i guess to get it to work
right".

This is his direct order, so it is a new lap despite the 07:36 freeze. **It does not block 0.4.9:** the brush and Sculpt are
already in the published v0.4.8 (checked: `git grep -il "brush\|sculpt" v0.4.8 -- app src` → 95 files), so 0.4.9 makes
them no worse.

## Prior art (checked at t180 local-0.4.9 52558e3)

- `app/core/panel.js:372-410`: the BRUSH (arm it, then drag on the track; local height/sideways, or the rate brush on one
  channel; radius, sharp). `:377-378`: D244b SCULPT (the shape channels only: bank, cup, width, edge, wall rise, tube sweep)
  on placed pieces. `:553-568`: the brush strip.
- `panel.js:398`, D235: a closed tube's brush step takes **seconds**, so the pointer moves queued behind it. It was fixed
  by coalescing to one `brushTo` per frame. The freeze is likely this class: a step that costs seconds on a long or closed
  track.
- `b33bac5`, D266: closing a very big tube crashed the page (the overlap check's memory).
- `d029b1f` (D335) and `f1226d0`: Sculpt lands on its value and keeps its ratio per piece.
- The shell side: `shell.beginBrush`, `brushTo` and `brushModes` in `app/core/coreshell.js`.
- The rule for the result: `preview-at-refresh-rate`. A step fits the display's frame (6.9 ms at 144 Hz). Only an absurd
  load may drop frames, and gracefully, never by freezing.

## Part 1: the freeze (C, "prove it", because it hangs the program)

- Reproduce it headless and muted. Try the brush and Sculpt on a long track (2 km, 10 km), a closed lap and a closed
  tube, with a large radius and with sharp on. Find the step that blocks the main thread, and name its cost in ms.
- Test first: a row that is red on 52558e3 (a step over a stated budget, or a page that stops answering), then the fix,
  then green.
- It ships in the release after 0.4.9. If Part 2's design removes the old brush, the fix still lands first, so the
  shipped build stops freezing now.
- Hand-back: `exo_memory/handback/p-d421-freeze-C_<date>.md`.

## Part 2: the Sculpt mode design (P, research and plan only, no code)

What the keeper asked for: **two modes you switch between.** Build is today's equation mode (Extend, Straight, Jump...).
Sculpt is where you take pieces already placed and stretch, bend and otherwise reshape them, the way a 3D modelling
program sculpts.

1. Read the current brush and Sculpt (the paths above) and say what is kept, merged or removed.
2. Research how 3D tools do it. Sources first:
   - Blender's sculpt brushes (Grab, Snake Hook, Smooth, Inflate/Pinch, falloff and radius) and proportional editing;
   - curve and spline editing with soft selection, in Blender, Maya and Houdini;
   - any road or track editor that edits a placed path with falloff.
   Cite each source.
3. Map the tools onto THIS track. Pieces are equations with channels (turn, climb, bank, cup, width, edge, length).
   A sculpt has to land back on piece parameters, keep the seams continuous, keep a closed lap closed, and make one
   drag one undo step. Propose the tool set:
   - grab / move with falloff;
   - stretch (length);
   - bend (turn);
   - raise / lower (climb);
   - twist (bank);
   - smooth;
   - any others the research earns.
   For each: what the hand does, which channels change, and how the falloff spreads over neighbouring pieces.
4. Performance: each step's budget at 144 Hz on 10 km and on a closed tube, and how it degrades (coarse while dragging,
   exact on release) instead of freezing.
5. The mode switch itself: where it sits in the bar, what Build's controls do while in Sculpt, and the keys.
6. Deliverables:
   - `exo_memory/loop/design_d421_sculpt_P_<date>.md`;
   - a one-page plain summary for the keeper with simple sketches of the mode switch and each tool. He approves the
     feel before anything is built.
   - The build is then split across panes, by me.

## Order

Parts 1 and 2 run in parallel with B's 0.4.9 release checks.
- Part 1 takes the heavy-run lock for its browser runs, like any other run.
- Part 2 runs no tests.

NEXT: chair routes Part 1 to C and Part 2 to P now; each calls the librarian with its hand-back.

# For pane E (the Dark's figure, moved to E by the chair's 23:43Z order): pane C's overtime material

- `overtime_capture_ot.js` — **the overtime capture as run** (section 5 of `p-d675-filter-C_2026-11-13.md`).
  - Run as: `node overtime_capture_ot.js <a dreamzone-3 tree at b08f25e>`. It adds a temporary block at the top of
    `run_capture_frame` (`game/world/offscreen_frame.cpp`), O's own method: a flee bot's run with the 45 s timer at the
    first saved seed, played through the app. Two seconds after the Dark is first posed, it prints every pose with its
    kind's slots and the stage's `figures_drawn()`, then shoots `ot_01_players_view` and `ot_02_looking_at_the_dark`.
  - Then build `dz-world` and run `dz-world --capture-frame <dir>`. Undo with `node overtime_capture_ot.js <tree> undo`,
    or `git checkout game/world/offscreen_frame.cpp`.
  - `overtime_capture_output.txt` is what it printed on b08f25e: 3 poses, 2 drawn, the Dark 29.80 m off with 0 slots.
- `dark_row_DRAFT_unrun.cpp` and `dark_fix_DRAFT_unrun.js` — **drafts, never built or run.** I wrote them before the
  Dark moved to E; use them or not.
  - The row is a self-test block for after the `seed` line of `run_selftest`. It counts from the stage's own
    `figures_drawn()`: a 3 s timer, the player idle at the door, one frame a second into overtime, on the repository's
    config read only.
  - The fix does three things:
    - gives `kFigureSlots` its eighth entry (1);
    - gives the Dark the hunter's box shape, material and albedo in `figures.cpp`;
    - adds a `dark_` second `ModelFigure` of hunter.glb, posed by the same gait in `place_figures`, with notes labelled
      apart in `load_models`.
  - My one known doubt: it loads hunter.glb twice, which is a second skinned copy in the scene. Skinning runs only for
    a pose that changed (`RecordSkins` skips one not pending), so it costs nothing until the Dark is in view. Not
    measured.

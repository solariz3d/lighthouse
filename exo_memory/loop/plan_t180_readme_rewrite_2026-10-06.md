# T-180: rewrite the GitHub README and the repo description for what the builder is now. Librarian, on D, 2026-10-06 12:5x. Lap D254.

The keeper, 12:50: "can we do a comphrensive refactor of the github repo readme and description for what we have changed and updated".

## What is stale (read at t180 `64fa6cf`, `README.md`, 212 lines; the description from `gh repo view`)
- **The pitch describes the retired builder:** "write a track in a language … words … a font … a tempo", "it keeps learning the language".
  D239 made equation mode the only mode; the word builder and the Pieces mode are gone.
- **"No in-game testing has been done":** false now. The keeper has driven exports in AC (the tube oval, 10-03/04).
- **The "Status" section (lines 28–173)** is a long 0.2.2 ARCHITECTURE-vs-code table from 2026-09-28. Most of it describes the old core.
- **The repo description** ends "Planning stage" and sells "a learned language of pieces".
- Nothing about: equation pieces (turn/climb/bank/width/cup/tube channels, C1 joints), Extend + drag handles, Sculpt, Close the loop
  (local), saved pieces, jumps, the plain-words checker, Export to Assetto Corsa via Steam, Test export, backups, the camera keys.

## The lap (C, who did the Consonance README rewrite with the cold-reader method, D139–D142; DOC tier)
1. **README.md, rewritten whole** for someone who has never seen it, in this order: what it is (two sentences, T-180 and normal AC tracks,
   replaces Blender for the road); a screenshot slot (leave a marked placeholder; the keeper adds one); **Install**; **Your first track in
   five minutes** (Extend, drag handles, Close the loop, Export to Assetto Corsa); **What you can build** (the shapes: banks, cups to
   half-pipes, tubes and loops, jumps); **Editing** (Sculpt, saved pieces, select/delete, undo, backups); **The checker** (reds and
   warnings in plain words; jumps are tuned by driving); **Exporting** (Steam auto-find, t180b_ folders, Test export); **Controls** (a
   compact key table: WASD/QE/Space/Left Ctrl, Shift, the mouse, Ctrl+Z/Y/S/Backspace, handle Shift/Ctrl/double-click); **Where your files
   live**; **Status and limits** (honest, short: what is driven in AC and what is not; no scenery in v1); **Building from source** (one
   paragraph, pointing at docs/RELEASE.md); **Credits** (keep the existing credits verbatim).
   - Every claim checked against the code at `64fa6cf` or a hand-back, not memory. No dollar figures, no internal lap ids.
   - The old Status table moves VERBATIM to `docs/STATUS_0.2.2.md` with a one-line note at its top, not deleted.
2. **The repo description** (≤ 350 chars), proposed in the hand-back; the librarian sets it with `gh repo edit --description` after
   reading it. Suggested topics: assetto-corsa, track-editor, sim-racing, tauri.
3. `app/README.md` is the developer's file guide: leave it, except stale references to the word builder.
4. CHANGELOG: one line under Changed.
- No code changes. Tests: the suite does not read the root README (checked: `core_doc` and `core_sculpt_modes` cite `src/core/README.md`).

NEXT: chair dispatch D254 to C when this plan is read; the librarian reviews the draft, sets the description, and pushes with the next install

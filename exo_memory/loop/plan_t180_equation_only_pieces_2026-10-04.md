# T-180: equation mode only, the Pieces page's features carried over, and a library of saved pieces. Librarian, on D, 2026-10-04 22:2x. Laps D239 + D240.

The keeper, 22:14: "can we keep only the equation mode? And then we can save pieces from that we make". Asked which Pieces-page features
should move to the Equation page, he chose ALL FOUR (22:2x): **Install / See it in AC, Autosave + crash restore, Share codes, and the
Getting-started guide.**

## Checked (main fa5fd937, worktree `lib-mirror-build`)
- **The mode switch:**
  - `app/index.html:75`, `<select id="mode">` with "Equation track" / "Pieces (paused)";
  - `:167` (MODE from `?mode=` or `localStorage t180.mode`);
  - `:169` (the switch reloads the page).
- **The Equation page mounts:** the core panel, preview, camera, validation, textures (`:222-227`).
- **The Pieces page mounts:** share (`app/share`), install (`app/install`, through the `native` bridge: `get_ac_root`, `install_track`,
  `see_it_in_assetto`), preview, camera, validation, handles, texture, onboarding (`:333-336`). Plus autosave (`shell.cleanExit` /
  `flushAutosave`, `:316`) and the pieces shell (`app/shell.js`).
- The export pipeline is shared: the core exports through `src/export/fromwords.js exportSegments`. Nothing in this lap may change an
  export (the fixtures are the guard).

## D239 (A, FEEL tier for the UI, EXPORT tier where a carried feature writes files: install): equation only, four features carried over
1. **Carry the four features onto the Equation page, each working on a core document:**
   - **Install / See it in AC:** the install panel installs the core track (the same export as the Export button, with the texture set)
     into the AC root through `install_track`, and "See it in Assetto" launches it (off by default, as now). It inherits D234's rules.
   - **Autosave + crash restore:** the core document autosaves as the pieces shell does, and a crash offers it back at the next start.
     A clean exit clears it.
   - **Share codes:** a core document to a text code and back (`t180b.core/4` serialised, the same compression and checksum the pieces
     share uses if it fits). A code from the old Pieces page is refused by name, not misread.
   - **The getting-started guide:** its steps rewritten for the equation builder (Extend, the brush, Close the loop, Export, the grid and
     mirror). Its old pieces wording goes.
2. **Remove the Pieces mode from the app:**
   - the mode switch, `?mode=pieces`, `t180.mode`, the Pieces page's mount list, and the "(paused)" builder;
   - the pieces-only panels (`app/palette` for words, `app/handles`, `app/texture`'s per-word panel) and `app/shell.js`, once nothing on
     the Equation page needs them.
   - **Keep `src/`'s word modules where the exporter or the core still uses them** (fromwords.js holds exportSegments). Delete what's
     dead, and say exactly what was deleted and what was kept and why.
   - The saved word tracks (non-`eq-` files in `%APPDATA%\…\tracks`): **never deleted**. They no longer show in Open…, and the hand-back
     says where they are.
3. **Tests:** the carried features' tests run against the core shell; the pieces-only tests go with their code, BY NAME in the hand-back;
   fixtures 0 of 9; a real-window check of the four features (as the scroll-bar lap did).

## D240 (A after D239; EXPORT tier, since it adds a document schema): SAVED PIECES
- **Save:** select one piece, or a run of consecutive pieces, on an equation track → "Save as piece…" with a name. It's written to
  `%APPDATA%\com.solariz3d.t180-track-builder\pieces\<name>.t180piece`, schema `t180b.piece/1`: the pieces' channel splines in their own arc
  length, exactly as the core holds them.
- **The relative form (A designs; this is the rule to meet):** a saved piece is stored relative to its own start: turn and climb as rates;
  bank, cup, width, edge and tube as their CHANGE across the piece plus the start values. Inserting it at another head continues smoothly
  from that head (C1 at the joint, as Extend's transitions are), with "keep its own start values" as an option.
- **Insert:** a "Pieces" library list on the Equation page (name, length, turn, climb, a thumbnail of its plan), and "Add at head" appends
  it. **Mirror on insert** (left/right: turn and bank negated) ties into the symmetry guides: make one half, save it, add it mirrored.
- Rename and delete in the library. A piece file is checked on load (refused by name if malformed). No piece can make an export
  different from the same track built by hand (a test: a track built from a saved and re-inserted piece exports byte-identical to the
  original, when inserted at the same start).
- **Then** B's look per lap; land; install.

NEXT: chair dispatch D239 to A when this plan is read; D240 to A after D239 lands

## AMENDMENT to D239 (librarian, 2026-10-05 09:0x): SAVE KEEPS THE PREVIOUS VERSION
The keeper lost hours of TEST 1 to one Close, with no copy from before it (`loop/plan_t180_safe_close_reds_2026-10-04.md`).
- **Every Save of an equation track first moves the file it overwrites to `%APPDATA%\com.solariz3d.t180-track-builder\track-backups\`**
  as `<name>.<yyyy-mm-dd_hhmmss>.t180track`, keeping the newest 20 per track (older ones pruned, oldest first).
- **Also, before Close (and later, before any whole-track operation), the document as it was is written there too**, so a Close can be
  undone after the app is closed.
- "Open…" gets a "Previous versions" entry for the open track that lists them (time, length, closed or not) and opens one as a copy.
- **Tests:** a save over an existing file leaves its previous bytes in backups; the 21st save prunes the oldest; a Close writes a
  pre-close copy; nothing is ever deleted except by the prune.

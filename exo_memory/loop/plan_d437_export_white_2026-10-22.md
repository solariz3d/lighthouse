# D437: the screen turned white exporting the new ELYSIUM on 0.4.14 (librarian, 2026-10-22 19:4x)

## The report

The keeper, 19:39: "was exporting the new ELYSIUM, and the screen turned white".

## Checked by the librarian

- The installed build is 0.4.14 (b6969da), sha256 DB194F9E…7BE0.
- The builder started at 19:36:16, and ELYSIUM was saved at 19:37:36. So the save landed before the crash and his work is on disk.
- **A WebView2 crash dump was written at 19:38:29:** `%LOCALAPPDATA%\com.solariz3d.t180-track-builder\EBWebView\Crashpad\reports\30eaa807-….dmp`, 8,591,213 B. Its strings name the renderer process. A dead renderer is a white window.
- Three earlier dumps from 2026-10-15, at 12:18, 13:53 and 16:07, have no record on disk that names them.
- The AC folder `content/tracks/t180b_elysium` is dated 10-16 15:46. inferred: the export never reached its write, so the old export is intact.
- Copies are in `scratchpad\d437\`:
  - `eq-ELYSIUM.t180track` sha256 3452907a…;
  - `eq-ELYSIUM.t180undo` sha256 ad0d4a34…;
  - the dump, sha256 46421cf0….

## Pane P. Tier: prove it (export). Finding first, then a fix plan

1. **The dump:**
   - read the exception code and the faulting module, with cdb, WinDbg, or a minidump parser in node;
   - say whether it is out-of-memory (V8 heap, OOM, 0xE0000008), a GPU or graphics fault, or something else;
   - do the same for the three 10-15 dumps.
2. **Reproduce headless (`--mute-audio`, never a window), on a copy of the 19:37 save.**
   - Run the page's own Export path at b6969da in headless Chrome, and record the renderer's JS heap and process memory through the export.
   - Repeat at 6261a22 (0.4.13), to say whether this is a 0.4.14 regression or the 25 km lap's size.
3. If it is memory, name the stage that peaks (mesh, textures, kn5 write) with a path:line, and plan the fix. Don't build it.
4. Read the keeper's tracks folder and AC folder only. Write nothing to either.

NEXT: chair route D437 to P now; P hands back to the librarian.

## Amendment, 19:4x: the keeper wants it prevented, not only found

The keeper, 19:40: "figure out that crash to prevent it from ever happening".

- **Part 1, pane P (as above):** the cause, with the dump read and a headless reproduction. Steps 1–4 stand.
- **Part 2, pane E, after the librarian rules on Part 1. Tier: prove it (export).**
  1. **The cause fix:** whatever Part 1 names, for example the peak stage's memory or a GPU path.
  2. **The guard, whatever the cause:** an export must never take down the window.
     - If the export cannot finish, the builder stays drawn.
     - It says in words what failed and at what stage.
     - It leaves the Assetto Corsa folder as it was.
     - Where the export runs inside the page, move the heavy stage off the page's own renderer, or bound it so it fails by name before the process dies.
  3. **Test first:** Part 1's headless reproduction becomes a row. It must be red on b6969da and green after, on a copy of ELYSIUM (private fixture, skipped by name when absent, like fixtures-d431). Add one row for the guard: an export forced to fail mid-way leaves the page alive and the AC folder byte-identical.
  4. The export mutation coverage and the full proof at landing. It rides the next batch with D432 and D435.

## Part 1 ruled, 2026-10-22 21:2x (librarian): accepted. Part 2 split across two panes

P's finding is in `exo_memory/handback/p-d437-P_2026-10-22.md`.
- The crash was a V8 heap out-of-memory in the page's renderer (e0000008).
- It happened in `soup()` (src/geom/bvh.js:36-69), building the whole 27.6 km mesh's triangle soup a second time for the pit-lane check (src/geom/pitlane.js:139).
- It is not a 0.4.14 regression: 0.4.13 peaks within 1.5 % of the same figure. It comes from the lap's size plus a pit lane.

The two parts touch different files, so they run in parallel.

- **Part 2a, pane E (prove it, export):** P's §6 steps 1–4.
  1. Tests first.
  2. `soup()` counts, then fills typed arrays.
  3. The main mesh's soup and BVH are built once per export and passed to laneCheck.
  4. Re-measure with exp437.js and run-export-437.js on the ELYSIUM copy.
  Build on b6969da.
- **Part 2b, pane B (raised to prove it, export):** P's §6 step 5. Move `runSegments` into a worker, following the closejob pattern.
  - When the export runs out of memory or throws, it ends with a message that names the stage, and the page stays drawn.
  - The AC folder stays byte-identical when an export fails.
  - Test first: an export forced to fail inside the worker leaves the page alive, with the AC folder unchanged.
  - Headless only, `--mute-audio`.
  - Build on b6969da.
- **For the keeper, already covered:** ELYSIUM's two stacked-within-2m reds (22,669 and 23,722 m) are the ones D432 turns into information unless the roads clip.
- Both parts ride the next batch.

NEXT: chair route D437 Part 2a to E and Part 2b to B now; both hand back to the librarian; P takes the D434 review (15e4e81, 681727f).

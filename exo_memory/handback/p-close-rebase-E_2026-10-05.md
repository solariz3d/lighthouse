# p-close-rebase-E · D242 + D243a rebased onto D239 (3a2fc11), B's three D243a fixes, a look at 6ecf840 · pane E · 2026-10-05, on D

## FINAL HEAD: `12ab427`, on C's D239 head `3a2fc11`. Targeted green. ONE branch.

**checked: `git -C C:/Users/nname/Desktop/worktrees/e-d243rb-wt log --oneline -4`:**

| commit | what | written by |
|---|---|---|
| `3a2fc11` | C's D239 head (the F-commit), on `6ecf840` | C |
| `95ee245` | D242 rebased: B's `a0a45ba` on D239, with the close paths joined | B, rebased by E |
| `3037749` | D243a rebased: my `ff428fa`, with the open-loop bypass moved into `buildExport` | E |
| `12ab427` | B's three D243a fixes | E |

- **The bundle is ONE branch.** `d242-on-d239` and `d243a-on-d242` both point at `12ab427` (checked: `git branch -v`). `git log 3a2fc11..d242-on-d239` lists exactly the three commits above.
  - Worktrees: `e-d242rb-wt` and `e-d243rb-wt`, both clean.
  - Nothing has been pushed, and AC was not launched.
- **Other worktrees, mine, with no work in them:**
  - `e-c16base-wt`: detached at `3a2fc11`;
  - `e-close-wt` and `e-close-base-wt`: the D242 look.
  - They can be removed after landing.

**The rebase steps:**
1. D242 onto `fb44284`, as `f2f1424`.
2. The base moved to `2a2b187` (C's backups), giving `bb5c21d`.
3. `ff428fa` cherry-picked on top, as `d30b361`, and the fixes committed as `ae30d8d`.
4. The base moved to `6ecf840`: `git rebase --onto 6ecf840 2a2b187`, clean, giving `cc1326a` / `75ce4ac` / `cf47fda`.
5. The base moved to `3a2fc11`: `git rebase --onto 3a2fc11 6ecf840`, clean, giving `95ee245` / `3037749` / `12ab427`.

**A clean textual rebase is not proof, so I checked C's F-commit against my Apply path.** `3a2fc11` changes the damaged-autosave path and `listVersions`; it does not touch `backupNow` or `applyClose`. Its F3a change lists an UNSAVED track's copy from before Close, which is what my Apply writes under `eq-unsaved`. Its own test passes in the run below (row "an UNSAVED track's copy from before Close is listed in Previous versions").

## THE RUN on `12ab427` (base `3a2fc11`): targeted only, as the chair ordered (no mutation harnesses)

| run | result |
|---|---|
| **targeted**, 23 files | **400/400** in 5.2 min |
| **key probe K1–K4** | **all pass** |

**What the targeted run covers:**
- the close files: `core_close_local`, `core_close`, `core_close_refusal`, `core-close-preview`, `redgroups`;
- the export-tier close and `fromwords` files: `export_test_unfinished`, `ailine`, `core_cup_export`, `export_tube_grid`, `export_words`, `markers_export`, `texture_flow`, `underskin`;
- `core_cup` and `core_cup_fixtures`;
- the app's `core-shell`, `core-readout-display`, `guides`, `preview`, `export`, `export-csp`, `core-eqonly` and `shell-dist`.

**Rows of note, all passing:**
- **fixtures row 5a**, "0 of 9 differ";
- guides row 15;
- close-preview row 7: a copy that rejects or throws refuses, and an edit during the copy is handled;
- C's two Close-copy tests, now Close then Apply;
- my two D243a tests, the open and the closed lap;
- C's F1/F3a tests.

**K4, now valid:** a whole-lap preview was open; Ctrl+Backspace dropped it; Apply afterwards committed nothing ("nothing to apply: press Close first").

**Evidence** (scratchpad `…\scratchpad\closerebase\`):

| file | sha256 |
|---|---|
| `final2.js` | `b502a35c…` |
| `keys.js` | `344e9293…` (with K4 fixed) |
| `final-targeted.tap` | `8e453436…` |
| `final-keys.out` | `c80bbbcc…` |
| `final.jsonl` | `a0ea4bd5…` |

## THE EARLIER, VOID run on `cf47fda` (base `6ecf840`), kept for comparison only

**The chair called this run VOID**, because it was cut off for the restart. Its files are now in `void-1343/`. Each result was written with an fsync before the stop. They are recorded only as what the tree did then, not as a verdict. The mutation figures were NOT re-run (by the chair's order); the librarian's merged full suite is the run that counts.

| run | result |
|---|---|
| targeted, 23 files (close, cup, fixtures, export, D243a, core-shell, guides, preview, core-eqonly, shell-dist, …) | **395/395** |
| key probe, K1–K3 | pass (below) |
| key probe, K4 | **void as written** |
| D243a mutants: control + S1, X1, S3, S4 | **4 of 4 caught**, control clean |
| C16 alone, on `6ecf840` and on `cf47fda` | **caught by name on both** (below) |
| `core-close-mutation` | **32/32** |
| `core_cup_mutation` | **51/51** |
| `core-mutation`, full | **not finished.** Cut off at about 26 minutes. |

Two notes on the table:
- In the targeted run, guides row 15 passes and fixtures row 5a reads "0 of 9 differ".
- K4 was meant to check that Ctrl+Backspace drops an open close preview. My probe asked for a last-piece close that this lap refuses, so no preview was ever open. It was fixed to use `whole: true` and re-run green (THE RUN, above).

**Evidence** (scratchpad `…\scratchpad\closerebase\void-1343\`):

| file | sha256 |
|---|---|
| `final.js` | `fd340e3c…` |
| `keys.js` | as run, NOT kept. The hash I first wrote here, `344e9293…`, was taken AFTER the K4 edit and is the fixed version. |
| `emut.js` | `16fe8c72…` |
| `c16.js` | `56fa2eb4…` |
| `final-targeted.tap` | `9930fa65…` |
| `final-keys.out` | `baafaf1d…` |
| `final-emut.out` | `8794de84…` |
| `final-c16.out` | `088b3bd9…` |
| `final-mut-close.tap` | `a44b800d…` |

### C16
- **On the older tree `bb5c21d`**, the full core-mutation harness gave **59/60**. C16 (`the ghost is not what extend builds`) was reported NOT CAUGHT, because the only failed line it could see was the file, `core-shell.test.js`. That run finished at 12:01:53, before the 12:05 crash (`mut-core.tap`, sha256 `c2ab6f8f…`).
- **Run alone, the harness's way** (same copy, same patch, same spawn), C16 **is caught by name on both C's `6ecf840` and my tip `cf47fda`**. The failure is the ghost test, with `k1` and `roll1` read as 0 instead of the extended values. Both controls pass (61/61 and 65/65).
- inferred: the earlier miss is a flaky reporting difference inside the harness run, not my rebase.
- **It is NOT settled.** By the chair's order the full harness was not re-run here. The librarian's merged full suite includes `core-mutation`, so that run settles it. If C16 misses there again, run the same harness on `3a2fc11` alone, to tell the base's miss from mine.

## The D242 rebase: the conflicts, and how each was resolved

**Base `6ecf840`.** The D242 commit's line counts per file equal B's `a0a45ba`, except in the files named here.
- **One close path: B's preview, then Apply.**
  - C's `closeKept` (copy, then the whole-lap `shell.close()`) on the Close button is folded into Apply. The button previews; Apply keeps the copy.
  - **`applyClose` is now async.** It awaits `backupNow('pre-close')`, which now exists and rejects on failure, and refuses by name if the copy fails, whether it rejects or throws. The `typeof` guard and the "closed, but NOT written" message that fired later are gone.
  - **After the await, Apply checks the preview again.** An edit made while the copy is being written drops the preview, so a stale close is never committed over it.
  - Where there is no native side, `backupNow` resolves to null and the Apply goes ahead, as C's button did.
- **`app/core/coreshell.js` `set()`:** D242's stale-preview drop first, then D239's autosave trigger, then the subscribers.
- **`app/index.html`:** `coreOpts` (D239) and `RG` (D242) are both kept.
- **`app/core/panel.js`:** B's Close block.
- **`app/test/core-readout-display.test.js`:** C's two Close-copy tests are kept, and now press Close the loop and then Apply. D242's Straight and item-7 tests follow them.
- **`app/test/core-close-preview.test.js`:**
  - **Row 7:** a copy that rejects is refused, and so is one that throws; the edit-during-copy case is added.
  - The other `applyClose` calls are awaited.
- **`app/test/core-close-mutation.test.js`:** A9 is re-anchored on the awaited call, and **A11 is new** (the re-check after the copy).
- **CHANGELOG [Unreleased]:** Added holds D239's entries, then D242's, then D243a's. Removed holds D239's. D242's Changed entries are merged into the existing list. The D242 backup line and `app/README.md` now describe the single path.

## The D243a rebase and B's three fixes

1. **The merge hazard.** D239 moved the open-loop refusal into `buildExport`, so `ff428fa`'s bypass moved there too.
   - `OPEN_LOOP` is raised only without `opts.test`.
   - A test export's grid is laid on the open path.
   - `exportTo` calls `buildExport`, as D239 made it.
2. **A closed track is refused by name:** `TEST_CLOSED`, "this track is closed: use Export (the test export is for an unfinished, open track)", and nothing is written.
3. **Tests in `app/test/core-shell.test.js`** for `exportTo(dir, { test: true })`, through the real exporter:
   - on an open lap: a `t180b_*_test` folder with `t180b_TEST_UNFINISHED.txt` and an AI line, while a normal export of the same lap still refuses;
   - on a closed lap: refused by name, with nothing written.
   - **S1 and X1, which survived B's run, are caught now**, as are S3 (the refusal removed) and S4 (the shell's options dropped).

**Where this is written:** folded into THIS hand-back, as the chair allowed. `p-openexport-E_2026-10-05.md` is not edited.

## A look at C's `6ecf840` (non-author), from the probe and reading the code

- **K1, the keys fire on the equation page through `app/core/keys.js`:** Ctrl+Z undo, Ctrl+Y and Ctrl+Shift+Z redo, Ctrl+S save, each with `preventDefault`. A key while a field has focus does nothing.
- **K2, `removeHead` (Ctrl+Backspace) is ONE undo step** (6 pieces to 5), and Ctrl+Z returns the very same document (`===`).
- **K3, on a loop closed through D242's Close** (preview, then Apply): Ctrl+Backspace reopens it with C's message, and Ctrl+Z returns the closed lap whole (`===`).
- **Nothing in the Close path needs `app/shell.js`.** checked: the require lists of `coreshell.js`, `panel.js`, `redgroups.js`, `core/index.js` and `preview/index.js`, and the page's `loadCjs` calls. `app/shell.js` is loaded only by `app/preview/smoke.html`, which is not the page.

**K4, on `12ab427`:** a whole-lap close preview is open; Ctrl+Backspace drops it; Apply afterwards commits nothing.

## What this does NOT establish
- **No mutation harness ran on the final head.** By the chair's order, `core-mutation`, the close mutants, the cup mutants and my D243a mutants were not re-run on `12ab427`. Their last readings are on the void `cf47fda` run. The merged full suite is the run that counts, C16 included.
- **Nothing in a real window.** Not tested there:
  - the preview ghost, Apply/Cancel, the hover labels and Straight;
  - the keys in the WebView;
  - the Test export button.
  
  All were checked headless only.
- **That AC loads the test export.** AC was not launched.
- **Machine L.**

## The crash at about 12:05, which I was running into
- **The only heavy job running was my C16 repro.** The system log puts the bugcheck (0x7E) reboot at 12:05:36. Event 6008 says 11:58:21, but that is its last heartbeat, and files were still being written at 12:05:01.
- Every file the repro had not flushed was **zero-filled**. They are kept in `void-1205/`.
- The D242 run had finished at 12:01:53, and its files are intact (no zero bytes).
- Since then every runner writes each result with an fsync as it lands.

## My own slips
- **I passed `hold()` a callback it ignores.** The first queued run would have taken the lock and run nothing. I caught it before it got the lock.
- **A two-shell-layer `node -e` edit failed** on escaped quotes. Nothing was written; I redid it with the Edit tool. This is my standing carry, again.
- **I misread an overlapping `sed` print as a duplicated `const t` in `exportTo`.** The file held it once (checked by Read).
- **`git commit -- <paths>` is refused during a cherry-pick.** I committed the index after proving it held exactly B's file set (`diff` of the name lists).
- **K4 was written against a refusal.** Fixed above.
- **The void run's `keys.js` hash was mislabelled "as run".** It was taken after my K4 edit. Corrected above.

SOURCES: `git -C C:/Users/nname/Desktop/worktrees/e-d243rb-wt log --oneline -4` · scratchpad closerebase/final.jsonl · closerebase/final-targeted.tap

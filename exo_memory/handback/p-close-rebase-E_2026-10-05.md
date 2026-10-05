# p-close-rebase-E · D242 + D243a rebased onto D239 (6ecf840), B's three D243a fixes, a look at 6ecf840 · pane E · 2026-10-05, on D

## STATE: STOPPED at 13:43 for the BIOS restart (EXPO off). The work is committed, but its final runs are not done.

**Where it is (checked: `git -C C:/Users/nname/Desktop/worktrees/e-d243rb-wt log --oneline -5`):**

| commit | what | written by |
|---|---|---|
| `6ecf840` | C's D239 head (the keys move to the equation page) | C |
| `cc1326a` | D242 rebased: B's `a0a45ba` on D239, with the close paths joined | B, rebased by E |
| `75ce4ac` | D243a rebased: my `ff428fa`, with the open-loop bypass moved into `buildExport` | E |
| `cf47fda` | B's three D243a fixes | E |

- **The bundle branch is `d243a-on-d242`**, in worktree `C:/Users/nname/Desktop/worktrees/e-d243rb-wt`, with HEAD `cf47fda`. The tree is clean. Nothing has been pushed, and AC was not launched.
- **`d242-on-d239` (worktree `e-d242rb-wt`) still points at the superseded `bb5c21d`**, which is on `2a2b187`. I will move it to `cf47fda` once the runs are green, so the bundle is ONE branch. Until then, use `d243a-on-d242`.
- **Other worktrees, mine, no work in them:**
  - `e-c16base-wt`: detached at `6ecf840`, used for C16's base;
  - `e-close-wt` and `e-close-base-wt`: the D242 look.

**The rebase steps:**
1. **Done.** D242 onto `fb44284`, as `f2f1424`.
2. **Done.** The base moved to `2a2b187` (C's backups), giving `bb5c21d`.
3. **Done.** `ff428fa` cherry-picked on top, as `d30b361`, and the fixes committed as `ae30d8d`.
4. **Done.** The base moved to `6ecf840`, via `git rebase --onto 6ecf840 2a2b187 d243a-on-d242`, which applied cleanly. The result is `cc1326a` / `75ce4ac` / `cf47fda`.
5. **Not done:** see "Still to do" below.

## The runs on the tip `cf47fda`, against base `6ecf840`

**The chair calls this run VOID**, because it was cut off for the restart. The results below were each written to disk with an fsync **before** the stop (`final.jsonl`), and the cut came during the last harness. They are recorded here so they can be compared after the re-run; they are not offered as the verdict.

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
- K4 was meant to check that Ctrl+Backspace drops an open close preview. My probe asked for a last-piece close that this lap refuses, so no preview was ever open. The fix is to use `whole: true`, and K4 needs a re-run.

**Evidence** (scratchpad `…\scratchpad\closerebase\`):

| file | sha256 |
|---|---|
| `final.js` | `fd340e3c…` |
| `keys.js` | `344e9293…` (as run; since edited for K4) |
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
- inferred: the earlier miss is a flaky reporting difference inside the harness run, not my rebase. It is NOT settled until the full harness passes on the tip. Re-run it.

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

## Still to do, after the restart, in this order
1. **Re-run `final.js` under the lock** (the K4 fix is already in `keys.js`). The chair voided the run above, so it is ALL re-run. It takes about 50 minutes, the core-mutation harness being 24 of them.
2. **If green:** in `e-d242rb-wt`, move `d242-on-d239` to `cf47fda` (its tree is clean; `bb5c21d` stays in the reflog). Then finish this hand-back, add the map line, and ring the librarian.
3. **If core-mutation C16 misses again on the tip**, run the full harness on `6ecf840` too, to settle whether the miss is the base's or mine.

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

SOURCES: `git -C C:/Users/nname/Desktop/worktrees/e-d243rb-wt log --oneline -5` · scratchpad closerebase/final.jsonl

# D234 a refused export no longer leaves the picked empty folder: B's quick non-author look (export tier, targeted only)

Pane B, D, 2026-10-04. A's `ee3df097` (parent `43f1879`, 7 files, +116/−20), checked out in a fresh worktree
`C:\Users\nname\Desktop\worktrees\b-refused-wt` (detached at `ee3df09`, 0 links). Temp folders only. No AC launch. Nothing committed.
Nothing pushed.

## VERDICT: **GREEN. Land `ee3df097`.**

## 1. What changed: **as described, in both shells.**

By reading `exportTo` in `app/core/coreshell.js` and `app/shell.js` at `ee3df09`:

- **The target resolves first** (`exporter.resolveTarget`) in both, before the open-loop check (core) and before the export runs (words).
- **A folder with anything in it is never touched:** `resolveTarget` refuses it (`t.refused`) and the function returns at once, before
  `tidy` exists. Only `t.cleanup` (an EMPTY folder directly in `content\tracks`, the D226 rule) is ever handed to the removal, which
  is the native `remove_dir` that cannot delete contents. `src-tauri/src/lib.rs` is not in this diff.
- **The empty picked folder goes on every outcome:** every non-success exit (core: the open loop, `NO_START_STRAIGHT`, an `ExportError`
  or a red, nowhere to write; words: an `ExportError`) adds `await tidy()`, and an unplanned throw runs `catch (e) { await tidy(); throw e; }`.
  `tidy` is memoised, so the folder is removed at most once.
- **A success is unchanged** except that it clears `exportRefusal`: the same write, the same message with the removal note.
- The page shows the red "Not exported" box only while the refusal is still THE message. The native dialog is called AFTER
  `await shell.exportTo(…)` (checked: both call sites read the fresh `shell.getState()`), is skipped when the test seam picked the
  folder, and is wrapped in try/catch, so a dialog failure leaves the red box.

**Planted, each in a temp copy, one exact edit, after an unplanned control passed (`scratchpad/refused/plants.js`, running
`core-shell` + `export`, 48 tests): 8 applied · 8 caught · 0 NOT APPLIED.**

| plant | caught |
|---|---|
| C7 (the harness's own mutant, at the re-pointed anchor) | ✔ (its named test fails) |
| K2 core: a refusal (`stop`) does not remove the folder | ✔ (2 fail) |
| K3 core: an unplanned failure does not remove it | ✔ (1) |
| K4 words: a refused export does not remove it | ✔ (2) |
| K5 words: an unplanned failure does not remove it | ✔ (1) |
| K6 `resolveTarget` takes ANY folder as empty (a non-empty one would be exported into and tidied) | ✔ (6) |
| K7 core: a success leaves the old refusal standing | ✔ (1) |
| K8 core: a refusal is not kept for the page | ✔ (2) |

## 2. The C7 re-point: **the same mutant, not an easier one.**

The mutant still deletes the whole open-loop refusal line (`to: ''`). Only the anchor text moved: `return set(` became `return stop(`,
because that is how the line now reads. Its `caughtBy` is unchanged ("export: an open track is refused"). Checked on the committed
tree: the OLD anchor occurs **0** times and the NEW one **once**. Planted, it is caught by that same named test (pass 1, fail 1;
the control passed it 2/2). I did not re-run the whole 64-mutant harness. A reports 64/64 caught after the re-point. K2 and K8 cover
the new `stop()` body that C7 does not.

## 3. A's "What I did NOT verify": **nothing blocks landing.**

- **The real window** (the red box, the native dialog): the state they read (`exportRefusal`) is tested on every outcome, and the
  dialog call sits after the export and fails safe. The keeper's next export is the look.
- **The native removal:** unchanged code, D226's Rust test. Neither A nor I re-ran it. I didn't in D226 either, so it is still owed
  but unchanged by this commit.
- **The WebView at ~1.5 cores for ~3 minutes before close:** unrelated to this diff and pre-existing. Worth its own look; it doesn't
  bear on this change.
- **A's disclosed ordering consequence:** a NON-empty foreign folder with an open loop now reports "inside another track's folder"
  first. Nothing is removed or written either way. That's fine: the folder problem is the one the keeper must fix first.

## 4. The D226 test reversed by name: **an honest reversal of a wrong rule, not a weakened test.**

- The old test asserted the folder STAYS (`st.removed` `[]`, the folder exists). The new one asserts the opposite just as hard:
  the message names the removal, `st.removed` is `[picked]`, the folder no longer exists, and nothing is written. Same strength, opposite
  rule, and the name and a comment say why (the keeper's own exports left an empty folder that Content Manager listed as damaged).
- **The rule was wrong, and I signed it:** my D226 hand-back called keeping the folder after a red "A's disclosed choice, not a
  defect" and agreed with it. The keeper's flow shows it was the wrong call. The folder exists only because of the export.

## Counts (under the heavy-run lock, `--max-old-space-size=4096`, `--test-concurrency=1`)

    node --max-old-space-size=4096 --test --test-concurrency=1 app/test/core-shell.test.js app/test/export.test.js app/test/export-csp.test.js app/test/export-selfcheck.test.js app/test/core-xsec.test.js app/test/core-readout-display.test.js app/test/core-textures.test.js app/test/core-widthlike.test.js app/test/share-install.test.js app/test/shell.test.js app/test/shell-failed-edit.test.js app/test/shell-ghost.test.js

**153 tests · 153 pass · 0 fail · 0 skipped** (A's 12 files; equal to A's 153). Plants 8/8 as tabled.

## What I did NOT verify

The real window, the native dialog, the Rust removal test (not re-run), the full 64-mutant core harness and the other harnesses (only
C7's anchor and its mutant), AC (no launch), and machine L.

Outputs: my scratchpad `refused/` (targeted.out, plants.out, plants.js).

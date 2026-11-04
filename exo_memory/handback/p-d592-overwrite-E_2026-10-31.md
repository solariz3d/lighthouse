# D592: the overwrite question (pane E)

Seat: pane E (machine D), sibling-07b8a48f. Tier: prove it, as the chair raised it. Order: `[chair:MAIN]` D592, 2026-10-31T22:55Z.

The WIP stop (23:50Z) was cancelled at 23:55Z and the lap resumed from the WIP commit.

## 1. Where it is

t180 **d592-e `18e8c0b`**, off land-0434 a93ae51, in worktree `C:\Users\nname\Downloads\t180-wt-e592`. Not pushed.
- `94f95b6`: the change, committed as WIP at the chair's 23:50Z order. Its body's "WIP:" line is out of date now: everything it listed as not yet run has run (§3).
- `18e8c0b`: the new test file removes the temp folders it makes (§5).

checked: `git log --oneline a93ae51..d592-e` → those two commits.

## 2. What it does

**Save** (`app/core/coreshell.js` `save(name, { confirmReplace })`, with `replaceTarget`):
- It asks before writing over a saved track that is **not the open one**. It names that track and its last-saved local time, in the themed dialog: Replace or Cancel, with Cancel the default, so Enter never replaces.
- Names are compared case-blind, as Windows treats them.
- Re-saving the open track asks nothing.
- Replace keeps the replaced version in track-backups, which Previous versions lists, as every save already did.
- Only a plain `true` replaces. Cancel, Escape, a click outside, any other answer, or no way to ask writes **nothing**: no track, no undo sidecar, no autosave cleared. The status line says "not saved: …".

**There is no separate Save As or rename for tracks in this app.** Save writes under the name in the name field, so typing another track's name *is* Save As, and it is covered. The app's README says "nothing in the app renames or deletes a track"; saved pieces already refuse a duplicate name.

**Export to Assetto Corsa** (`app/install/install.js`):
- After the build and before any folder is written, it reads `installedState(folder)` for each folder.
- It asks when the folder exists with the builder's marker and that marker records a different road, or records none.
- It asks nothing when:
  - nothing is installed there;
  - the same road is re-exported;
  - the folder has no marker at all. The native install already refuses that case and touches nothing, which is stronger than asking. This is my reading of "or which has no marker"; a marker from before the road was recorded does ask.
- Only `true` installs.

The decision and the two questions live in one module with no DOM, **`app/core/overwrite.js`**:
- `installNeedsAsk`;
- `markerGeometry`;
- `saveQuestion`;
- `installQuestion`.

`app/index.html` wires them through `askChoice` (`askOverwrite`, `confirmSave`, `confirmInstall`). The storage gains `docSavedAt` and the native side gains `installedState`.

**Native side** (`src-tauri/src/lib.rs`):
- `saved_at`, with the command `track_saved_at`: the file's modified time, in ms.
- `installed_state_in`, with the command `installed_state`: `{ exists, marker, geometry, written }`. Only a `t180b_` folder name is accepted.
- Both are registered.

**Not covered: File ▸ Export into a chosen folder (`write_export`).** It still replaces a builder-made folder without asking. The order named Export to AC; the chosen-folder export is the next case if wanted.

## 3. Proof

**Tests first, red before the fix.**
- `app/test/overwrite.test.js` has 9 rows. Against a stub module, **8 of 9 failed**.
- The one that passed is row 3, "re-saving the open track asks nothing", because the old code never asked; mutants O1 and O7 give it teeth.
- After the fix: **9/9**. checked: `node --test app/test/overwrite.test.js` → pass 9, fail 0 (after `18e8c0b` too).
- In Rust, the two new `lib.rs` tests were **0 passed / 2 failed** against stubs, then green.

**Cancel writes nothing, on real bytes (row 2).** The storage writes real files in a temp folder and moves the old file to track-backups, as the native side does. After Cancel:
- every file's sha256 and mtime is unchanged;
- the storage receives no call at all;
- the open track keeps no name and stays unsaved.

The same holds for the answers `undefined`, `null`, `'replace'` and `1`. Row 5 covers a save with no way to ask, which also writes nothing.

**Mutants on the decision.**
- **JS** (`p-d592-overwrite-E_2026-10-31_evidence/mutants.js`, results in `mut2.out`): **applied 21 / caught 21 / NOT APPLIED 0**. Each mutant was applied in a copy of app/, src/, src-tauri/src/ and tools/, and the worktree files were unchanged (sha256 before and after).
  - Save: O1 to O7.
  - The AC decision and the installer: A1 to A9.
  - The questions: Q1 to Q3.
  - The page wiring: W1 and W2.
- O5, "any answer but a refusal replaces", survived the first run. Row 2 gained the non-true answers, and A9 was added for the installer's twin; both are now killed.
- Q3, "local time read as UTC", is killed here because this machine is UTC−6. On a UTC machine it is equivalent.
- **Rust** (`_evidence/lib.mutants.js`, through lighthouse's `mutant-harness.js`, results in `libmut.out`): 6 listed, 6 killed, 0 survived, 0 no result, 0 not applied. That is R1 to R6 on `installed_state_in` and `saved_at`. The live lib.rs was unchanged.

**Existing harness anchors.** `anchors.js` over app/core and app/install against a93ae51: 24 harnesses, 97 anchors in the touched files. Only `return null;` (20 → 22) and `app/core` changed count, and each already occurred more than once, so neither is any mutant's unique anchor.

**The touched tests.** These are the 108 test files that load coreshell.js, install.js or index.html (`_evidence/touched.txt`), plus `overwrite.test.js`. They ran under the lock at BelowNormal with low I/O, `acs.exe` closed (checked `S/d592/run.log`; summary in `_evidence/touched-summary.txt`):
- **1,170 tests: 1,163 passed, 1 failed, 6 skipped.**
- The 1 failure is `app/test/drag-frame.test.js` row 8, a frame-time budget: p95 7.3 ms against 6.9 ms.
- It is not this change.
  - Re-run alone on d592-e: p95 8.2 / 7.9 ms, red.
  - The same row on a clean checkout of **a93ae51**: p95 8.1 / 7.4 ms, red as well. C's d595 ramp harness held a lock the whole time.
  - The row drags a piece on the page. This change touches only Save and Export to AC.
- I removed that base checkout afterwards.

**cargo test --lib, after the last edit to lib.rs:** 56 passed, 0 failed.

## 4. Screenshots: both dialogs in all six looks

They were taken in headless Chrome (never a window), with `acs.exe` checked closed first, by `_evidence/shots.js` (log in `_evidence/shots.out`). Each look was set through Settings ▸ Theme's saved value. The page's own `askChoice` showed the page's own `saveQuestion` and `installQuestion`, both loaded through `window.loadCjs`. Escape answered `cancel` every time, so the default path is checked too.

In `exo_memory/handback/p-d592-overwrite-E_2026-10-31_evidence/shots/`:

| look | Save over another track | Export to AC over a different road |
|---|---|---|
| sigil | `sigil-save.png` | `sigil-install.png` |
| aqua | `aqua-save.png` | `aqua-install.png` |
| skyline | `skyline-save.png` | `skyline-install.png` |
| skyline-night | `skyline-night-save.png` | `skyline-night-install.png` |
| glass | `glass-save.png` | `glass-install.png` |
| aurora | `aurora-save.png` | `aurora-install.png` |

I read two of them, sigil-save and skyline-install: the card, title, words, date, Cancel and Replace all show in the look's own colours.

## 5. Scans, cleanup, files

**Scans.** The 396 added lines in `94f95b6` and the 4 in `18e8c0b`: 0 credential prefixes (patterns built split), 0 for the K-word, 0 decision numbers, 0 room paths, 0 of 72 private terms. This hand-back and its evidence were scanned the same way.

**Disk.** C: was at 18 GB. I freed about 11 GB of my own build output, all from landed laps:
- the cargo targets of lighthouse worktrees `lh-wt-e586` and `lh-land-588`;
- two mutant-harness temp folders.

That left 29 GB. The worktrees themselves are kept. I also deleted my scratch run outputs after keeping their summaries in the evidence folder.

**Temp-folder leak.** The new test leaked five temp folders per run, and 230 had built up over the lap's runs and mutant copies. They are deleted, and `18e8c0b` makes the file remove its own; checked: a run leaves 0.

**Files touched:**
- `app/core/overwrite.js` (new)
- `app/core/coreshell.js`
- `app/install/install.js`
- `app/install/index.js`
- `app/index.html`
- `src-tauri/src/lib.rs`
- `app/test/overwrite.test.js` (new)
- `CHANGELOG.md`: one line under Added
- `MAP.md`: two lines, the askdialog line and the AC row

## 6. Corrections (mine, this lap)

- **My first mutant copy left out `tools/`.** The pre-flight came out RED, so no mutant ran on a broken copy.
- **I first wrote "D592" into five new comments.** They were removed before the commit; the comment sweep had just taken decision numbers out of this repository.
- **My `sed -i` comment edits left `app/index.html` and `lib.rs` with LF endings in the working copy.** Git stores LF, and `--numstat` shows only my lines.
- **The first batch was refused by the heavy-run disk floor (18.6 GB)** after waiting for `acs.exe` to close. It ran once disk was freed.
- **The new test leaked temp folders**, as in §5.

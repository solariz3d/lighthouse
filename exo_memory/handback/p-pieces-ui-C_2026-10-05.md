# p-pieces-ui-C — a non-author look at A's 62f5d39 (D240 UI half). Pane C, 2026-10-05

SOURCES: exo_memory/handback/p-pieces-ui-A_2026-10-05.md · the real-window attack run (report below) · the merge cherry-pick and its targeted run

**Verdict: GREEN to land 62f5d39 + ab748e5.** No stale selection could Save or Delete anything; the delete preview did
everything A says, including refusing when the backup fails; the cherry-pick of my keys commit is clean. Three small
findings for the keeper's taste, none blocking (below). FEEL tier: no harnesses.

**Where:** worktree `C:\Users\nname\Desktop\worktrees\c-piecesui-look-wt`, detached at `62f5d39`, nothing committed there.
Debug build of that tree (`cargo tauri build --debug --no-bundle`, my own target dir; `src-tauri/Cargo.toml` reverted after).
**Real window on its OWN app data (`T180_TEST_APP_DATA`)**, the driver refusing to start if any `t180-track-builder.exe` ran.
Driver `scratchpad/pui/pui_window.js` (sha256 `78437177…`) + `body.js` (sha256 `97fe8329…`); report
`scratchpad/pui/win/window_report.json` (sha256 `e46574d0…`). REAL mouse clicks and keys through DevTools (`Input.dispatch*`),
each piece's screen spot found by sweeping the preview with its own pick.
**Run result: 0 page exceptions, 0 console messages; the keeper's folder 9 files, `keeperChanged: []`.** The run's app data
ended holding only `autosave.t180auto`, `pieces/with jump.t180piece`, `track-backups/eq-unsaved.2026-10-05_160820.t180track`.

## 1. The clicks — can a stale selection Save or Delete the wrong pieces? NO, on every path tried
| step (real clicks) | result |
|---|---|
| click p2, Shift-click p4 | `Selected: p2 to p4 (3 pieces) · 400 m` |
| Ctrl+Z (undid the paste) | selection gone, 0 pieces |
| Ctrl+Y | 5 pieces, `Nothing selected…`; **Save as piece and Delete selected both DISABLED**; no file written; 5 pieces after |
| select p2, then Extend | selection dropped (6 pieces); Delete refused (disabled); Undo → 5 |
| closed lap: click p6 (last), Shift-click p1 across the seam | `Selected: p1 to p6 (6 pieces) · 1.49 km` — see finding F1 |
| Delete on the closed lap | `CLOSED: a closed track has no open end to delete from; Ctrl+Backspace removes the last piece and opens the loop` — 6 pieces kept |
| a jump track: click p1, Shift-click p3 (across the flight) | `Selected: p1 to p3 (3 pieces) · 450 m`; **Save as piece** → the file, with `flights: 1` in it |

From reading (`app/core/coreshell.js`): the selection carries the document it was made on, any change to the present drops it and
the delete proposal, and save / delete / propose / apply each re-check it — Apply again AFTER its `await backupNow`. That is
identity, not a count, so it cannot be fooled by a different track with the same number of pieces.

## 2. The delete preview
| step | result |
|---|---|
| select p3 (middle), Delete selected | the preview box: "1 piece (p3) … changes the start of p4 (up to 156.6 m) … Moves: p5 up to 188.9 m, p4 up to 156.6 m", ghost shown, 5 pieces |
| **Apply with `track-backups` made a FILE** (so no backup can be written) | **refused**: `not deleted: the copy from before the delete could not be written (could not create …\track-backups: …)`; still 5 pieces |
| remove that file, Apply | `deleted 1 piece from the middle of the track (Ctrl+Z puts it back)`, 4 pieces, ONE backup `eq-unsaved.<stamp>.t180track` |
| **one** Ctrl+Z | 5 pieces — Apply is one undo step |
| preview open, then Extend | the preview is gone (box empty, Apply hidden), 6 pieces, 0 new backups |
| preview, Cancel delete | 5 → 5, 0 new backups, box empty |
| jump track, delete p1–p3 | preview: "3 pieces go; 1 of the 1 piece after the gap move", 4 pieces until Apply |

## 3. Save never overwrites; Rename and Delete touch only the pieces folder
- A's own run showed the same-name refusal; I did not repeat it. Native `save_piece` refuses an existing name unless `replace`,
  which the page never passes (`app/index.html:126`: `call('save_piece', { name, text })`; `lib.rs:144` defaults it to false).
- Rename `Run` → `Run2`: `renamed the piece "Run" to "Run2"`, files `[Run2.t180piece]`. Delete: files `[]`.
- Every file the run touched is in the run's own folder (list above); the keeper's 9 unchanged.

## 4. The required check through the app (save, re-add, same export bytes)
The merged targeted run (below) includes A's row 5: `… SAME DOCUMENT and exports the SAME BYTES` — green; and row 5a
`0 of 9 differ`. I did not write a second through-the-app export check of my own.

## 5. The merge with my ab748e5
`git cherry-pick -x ab748e5` onto 62f5d39 in a fresh worktree `c-merge-wt`: **clean, no conflict** → `960de7c`. The tooltip line
sits at `app/core/panel.js:255` after A's additions. Targeted run on the merged tree:
`node --test --test-concurrency=1 app/test/{keys-anywhere,core-eqonly,core-pieces-ui,core-readout-display,shell-keys}.test.js test/{core_piece,core_cup_fixtures}.test.js`
→ **132 / 132 pass**. The full suite was not run.

## Findings (the keeper's taste, not blockers)
- **F1. Shift-click across a closed lap's start goes the long way.** Last piece then p1 selects ALL six (p1 to p6), not the two
  pieces either side of the seam. It shows in the selection text, so nothing is hidden, and Delete on a closed lap is refused
  anyway; but Save as piece would save the whole lap. The run is `min..max`; a wrap-around run would need the core to save a run
  across the seam.
- **F2. A case-only rename is refused.** `Run` → `run`: `not renamed: a piece named "run" already exists`. Windows names are
  case-blind, so the native side sees the piece itself. To fix only the capitals the keeper must rename twice. A one-line
  allowance (same name ignoring case = the same file) would fix it.
- **F3. An END delete makes no backup** (by design: undo only, no preview). Worth one sentence in the guide; not a bug.
- **A's slow middle preview (8.5–10.3 s on a 13 km track)** stands as A reported it; I did not re-measure it, and my short tracks were
  not timed.

## Corrections, mine
- My driver's first save step built a click and never called it; caught reading the driver before the run, split into two steps.
- My report's `msg` fields begin with the LIBRARY's line ("No saved pieces yet…"), joined to the status by ` | `; the status is
  the part after the bar. Read it that way.

## Not verified
- Real camera drag vs click (A's own gap too).
- A save that races a second window (the native save checks then writes; one user, one window — harmless).
- The full suite; GPU feel; the keeper's hands.

NEXT: librarian collate this look when it is read — plan default: land 62f5d39 + ab748e5 (960de7c shows they merge clean) and install

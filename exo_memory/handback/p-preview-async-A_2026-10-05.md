# D240 follow-up: the previews must not freeze (+ the Ctrl+Z guard, C's F2 and F3) — seat A (Sonnet 5.5), 2026-10-05

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-pieces-ui-A_2026-10-05.md · C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-keys-B_2026-10-05.md · C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-pieces-ui-C_2026-10-05.md

**Where:** three commits on branch `pieces-ui-a-d240`, worktree `C:\Users\nname\Desktop\worktrees\a-piecesui-wt`, rebased onto t180 main `960de7c` (which already carries my `62f5d39` and C's keys): `93da7f3` (async previews), `f3b2f1a` (the Ctrl+Z guard), `9de8828` (F2, F3, changelog). Local, nothing pushed, no AC. FEEL tier: targeted tests plus a real-window timing check on its own app data (`T180_TEST_APP_DATA`), no mutation harness. `git diff --stat 960de7c HEAD -- src/export src/geom src/core test/fixtures` is empty.

## 1. The previews no longer freeze
- **What changed:** the overlap check moved UNCHANGED from `app/core/coreshell.js` to `app/core/overlapjob.js` (one pure function, `overlapCheck`, plus `runJob({ doc, designSpeedKmh, closed })`). A Web Worker (`app/core/overlapworker.js`, loading it through the app's own loader with the exporter's node shim) runs it; `app/core/overlaprunner.js` starts and cancels workers. The page gives the shell a runner (`app/index.html`).
- **Close and the middle delete, both:** the preview (the see-through ghost, the per-piece displacement, the words) is shown at once with its check `checking`; the panel says "Checking for overlaps… N s" and counts up; **Apply is disabled until the result lands** (the shell refuses it too); **Cancel**, an edit, an Undo, another selection, or a newer preview **terminates the worker**; a late answer from a cancelled job changes nothing. A failed check says so and keeps Apply off. A worker that cannot start falls back to the page, run after the preview has painted. With no runner (the tests) the check is made on the spot as it always was (`proposal.check`), so every older test is unchanged.
- **Tests:** `node --test app/test/preview-async.test.js` → `tests 8 pass 8 fail 0`: (1) the job gives EXACTLY the synchronous result on a coil's Close and delete, on a 46-piece 13.1 km track's middle delete, and on a 14.3 km near-closed lap's Close (after a structured clone, as a message does); (2) the worker SCRIPT itself, run in a sandbox with a fake `self`, loads its files through the loader and answers equal to the synchronous result, and a bad job answers an error; (3) the runner (a result, a failure, cancel terminates and rejects as cancelled, no Worker); (4) the shell for both previews (Apply refused, then allowed with the backup first; each way a preview can go cancels the job; a failed check; the fallback); (5) both panels on a fake DOM; (6) the ghost is on the preview while checking and is not rebuilt when the answer lands (the proposal object is the same).
- **A bug the test found in my first version:** the panel was drawn for the preview before the check's entry existed in the state and read a null result. The entry is now set in the same state change as the preview.
- **B's close mutation harness:** `app/test/core-close-mutation.test.js` anchors A3 and A4 pointed at the lines that moved; I re-pointed them (A3 now `app/core/overlapjob.js`, A4 the shorter string). **I did not run that harness** (no harnesses): whether A3 and A4 still apply and are still caught is NOT checked.

### The real window (own debug build, own app data, 13.1 km 46-piece track and a 14.3 km near-closed lap seeded into it)
`node async_window.js` (evidence dir) → 0 page exceptions, 0 console errors, the keeper's 9 files unchanged (`keeperChanged: []`). Real mouse click selects p43; Delete selected; an in-page stopwatch sampled every 25 ms, plus the largest gap between animation frames:

| | time to the preview (ghost, words, displacement) | time to Apply enabled | largest frame gap | the "Checking… N s" line |
|---|---|---|---|---|
| middle delete, 46 pieces, 13.1 km | **0.96 s** | **13.0 s** | 0.90 s | counted 0 to 12 s |
| Close, 8 pieces, 14.3 km | **2.07 s** | **16.4 s** | 1.97 s | counted 0 to 14 s |

- **Cancel mid-check** (delete): at 1.5 s the preview was up, the line read "Checking… 1 s" and Apply was disabled; after Cancel the preview box was empty, Apply hidden, and Apply never came on in the next 14 s.
- **Before, for the same checks** (`node probe_big.js`, `probe_parts.js`, `probe_lap.js` run synchronously in node): the delete's preview took 8.5 to 10.3 s and Close's 10.4 s, all of it with the page frozen; E measured Close at 13.4 s on TEST 1 in the window.
- **Read it plainly:** the page now stays alive (the count ticks, the frames keep coming, the largest gap is the ghost's own build or Close's solve, which are still on the page), but **the wait for Apply is not shorter, it is longer** (13.0 s and 16.4 s against 8.5 to 10.4 s synchronous). I did not separate why: inferred, the worker's cold start (it loads its modules each time) and two threads on a busy machine with the window off-screen. The way to shorten it is a warm worker made at start and the check's own cost (the mesh self-check alone is 2.5 s of it); I built neither.
- The result that came back in the window on both was "No overlap and no red", which equals the synchronous probes' (0 overlaps, 0 others). A result WITH overlaps was compared synchronous-against-job in node (the coil), not in the window.

## 2. The first Ctrl+Z reverts an un-applied Extend field (the chair's addition, B's look at ab748e5, C's open question)
- `keys.js`: Ctrl+Z first asks the panel (`t180-undo-guard`); `panel.js` answers: if the focused field, or the one touched last, holds text the panel did not put there, it is put back (the head's value as shown; for the length, what the last Extend or Undo left), the field's own handler refreshes the ghost and the readout, and the key is handled; the next Ctrl+Z, with nothing un-applied, undoes the track. What Extend applied and what an Undo refills (D242 item 7) are NOT un-applied. Ctrl+Y, Ctrl+Shift+Z, a text-entry field's own Ctrl+Z and a page with no panel are untouched.
- `node --test app/test/undo-guard.test.js` → 6 of 6; **5 of 6 fail without the guard** (the sixth is the path that must not change). With `keys-anywhere`, `core-eqonly`, `core-readout-display`: 80 of 80. Built on C's ab748e5 (it is in main as 960de7c; `d140e62` was skipped as already applied by the rebase).

## 3. C's F2 and F3
- **F2, a case-only rename (Run to run):** `renamePiece` treats the same name ignoring case as the same file: the new text is written under a temporary name (`<new>-r`), the old file removed, the new name written, the temporary one removed; a failure on the way puts the old file back (or keeps the temporary copy and says so). `core-pieces-ui.test.js` row 6b (a case-blind store and a case-sensitive one; a taken different name still refused; the last write failing; the temporary write failing) → that file is 13 of 13.
- **F3:** the extend step of the getting-started guide gained one sentence: deleting pieces at the end of the track makes no backup, Ctrl+Z is the only way back; in the middle there is a preview and a backup first. The guide's step count and the onboarding tests are unchanged (green).
- F1 (shift-click across a closed lap's seam) left alone, as ruled.

## Numbers, each from a named command
- **Wide run:** `node --test` over the 49 non-mutation app test files and the 24 non-mutation core files → `tests 1004 pass 1001 fail 0 skipped 2 todo 1` (the todo is aclook's known one), including `core_piece.test.js` (the byte-identical rows) and `row 5a ... "0 of 9 differ"`.
- **Rust:** `cargo test -- --test-threads=1` in `src-tauri` (ran with the debug builds) → `25 passed`; unchanged by this follow-up.
- **The saved-pieces real-window run** (`pieces_window.js`, the earlier one) re-run on this build: 0 page errors, the keeper's folder unchanged, every step as before; the Apply wait is now in its driver and was 0 ms on that small track.
- Evidence: `exo_memory/handback/p-preview-async-A_2026-10-05_evidence/` (`timing_report.json`, `steps.log`, screenshots `t1_delete_after_check.png`, `t2_close_after_check.png`, the driver `async_window.js` with its seed, `probe_lap.js`, `pieces_window_rerun_report.json`).

## Corrections (mine)
- My timing driver took three tries to click a piece on a 13 km track (a hit test that was too strict, then too slow); the app was right each time.
- A first `node -e` edit lost its quoting twice and one test title had an apostrophe that broke the file; none reached a commit.
- `src-tauri/Cargo.toml` is rewritten (line endings only) by every cargo build; I reverted it each time and did not commit it.

## What it does NOT establish
- **That the wait is acceptable.** The freeze is gone; the time to Apply is longer. The keeper's TEST 1 itself was not used (synthetic 13 to 14 km tracks, same size).
- The worker's death on Cancel is proved with a fake worker and by the page's behaviour (Apply never came on), not by watching the process.
- The fallback (a worker that cannot start) is tested in node only.
- The installed (release) build was not run; the debug build was.
- B's close mutants A3 and A4 (above) are re-pointed, not run.

NEXT: a quick non-author look, then land, when the librarian has collated it

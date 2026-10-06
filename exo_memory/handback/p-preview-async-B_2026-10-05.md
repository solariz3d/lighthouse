# D240 follow-up: non-author look at A's 93da7f3..9de8828 (async previews, the Ctrl+Z guard, F2/F3), pane B

**Packet:** the chair's look, items 1–4. A's hand-back: `handback/p-preview-async-A_2026-10-05.md`.
- **Tree:** a fresh worktree `C:\Users\nname\Desktop\worktrees\b-async-wt` at `9de8828` (0 links), read only. Clean after the run: a temporary harness copy was removed (checked: `git status --short` → 0 lines).
- Every run was under the heavy-run lock, `--test-concurrency=1`, with the serial shim on the harness.
- Nothing committed, nothing pushed, no AC.
- The real-key check ran in **Chrome** (the tree served, off-screen, focus emulation, browser storage only): **no app data touched at all**, which is stricter than `T180_TEST_APP_DATA`.
- Scratchpad `async/`: `run.out`, `run2.out`, `guardprobe.js` and `.json`, `reanchor.js`.

## Verdict: GREEN, land with E's 47820c4. BUT re-anchor two of my harness's mutants first (or right after): A5 has been disarmed on main since `62f5d39`, U1 by this lap's `f3b2f1a`. Both still bite once re-anchored.

## 1. `app/test/core-close-mutation.test.js`, run once
`node --test --test-concurrency=1 app/test/core-close-mutation.test.js` at `9de8828`: **32 tests, 30 pass, 2 fail.**
- **A3 and A4 (A's re-pointing): APPLIED and CAUGHT** (`ok 11`, `ok 12`). The control is green (`ok 1`).
- **A5, "Apply commits the base": NOT APPLIED.** Its anchor `history: D.commit(st.history, p.doc), resolved: p.resolved,` now occurs **2 times** in `coreshell.js` (`:327` the Close's Apply, `:465` the middle delete's).
  - checked (`git show <c>:app/core/coreshell.js | grep -c`): 1 at `95ee245`, **2 at `960de7c`**.
  - **A's D240 UI half `62f5d39`, already on main, broke it**, not this follow-up.
- **U1, "Undo shows the head only": NOT APPLIED.** Its anchor occurs **0 times** in `panel.js`.
  - checked: 1 at `960de7c`, **0 at `9de8828`**.
  - **This lap's `f3b2f1a` (the Ctrl+Z guard) rewrote the line** to `showHead(); if (undone) putBack(m.made); for (const k of Object.keys(HEAD)) applied[k] = …; shownFor = d;` (`panel.js:300`).
- **Re-anchored and run** (a temporary copy, `reanchor.js`, run with `--test-name-pattern`):
  - A5 → `… dirty: true, closeProposal: null,` (the Close's own Apply);
  - U1 → `showHead(); if (undone) putBack(m.made); for`.
  - **Control, A5 and U1: 3 of 3 pass. Both are APPLIED and CAUGHT** (A5 by "row 1: Close PROPOSES", U1 by "D242 item 7").
- **The fix is two `from:` strings in my harness** (owner: whoever lands it; I can, on the chair's word). I didn't commit it: this was a look.
- **A note on what A4 covers now:** A4 mutates the **no-worker fallback** (`check: overlapRunner ? null : Object.freeze(overlapCheck(…))`). The worker path's result has no mutant in this harness; A's `preview-async` row 1 (job == the synchronous check) is its guard, and it passes.

## 2. The worker
- **Its result equals the synchronous `overlapCheck`:** A's `app/test/preview-async.test.js` **8/8** in my run. Row 1 compares the job with the synchronous check on a coil (overlaps present), on a 46-piece 13.1 km middle delete, and on a 14.3 km Close, after a structured clone. **Not independently re-derived by me** beyond running it.
- **Cancel, an edit and Undo each terminate it** (checked by reading `coreshell.js`):
  - `set()` drops a preview whose `base` is no longer the document: the close preview by D242's rule, the delete preview at `:127`, a new selection at `:353`.
  - Whenever the preview on screen is no longer the one being checked, `abortCheck()` runs (`:131`), and the runner's `cancel()` calls `w.terminate()` (`overlaprunner.js`).
  - A late answer is ignored by identity (`currentJob.entry !== entry`), and a cancelled rejection is swallowed, not surfaced (`e.cancelled`).
- **Apply stays off until the result:** `applyClose` and `applyDelete` refuse while `checkOf(p)` is null ("the overlap check of this preview has not finished"), and the panel disables the button.
  - A's window run: Cancel mid-check at 1.5 s → Apply hidden and never came on in the next 14 s (`deleteCancelMid`).

## 3. The Ctrl+Z guard, with real key presses (`guardprobe.js`, 2 Extends)

| step | turn field | length field | pieces |
|---|---|---|---|
| typed `37` into turn, not applied (focus in turn) | `37` | | 2 |
| **Ctrl+Z #1** | **`0`** (put back) | | **2** (track not stepped) |
| **Ctrl+Z #2** | `0` | | **1** (the track undone) |
| typed `555` into length, then blurred (no focus) | | `555` | 1 |
| **Ctrl+Z #3** (length was touched last) | | **`100`** | **1** |
| **Ctrl+Z #4** | | `100` | **0** |

- 0 page errors.
- **Exactly the rule:** the first Ctrl+Z reverts an un-applied field, whether it has the focus or was the one touched last; the next undoes the track.

## 4. F2 and F3
- **F2, a case-only rename:** read (`renamePiece`: temporary `<new>-r`, remove the old, write the new, remove the temporary; each failure says so, and the piece is never lost).
  - `core-pieces-ui.test.js` row 6b covers a case-blind and a case-sensitive store, plus the failure paths: **13/13** in my run.
- **F3:** the guide's extend step gains one sentence (read, `git diff`): *"…press "Delete selected": at the end of the track that makes no backup, so Ctrl+Z is the only way back…"* plus the middle-delete preview and backup.
  - The step count is unchanged; `onboarding` **14/14**.

## The timing, confirmed from A's own report (not re-measured)
`p-preview-async-A_2026-10-05_evidence/timing_report.json`:

| | preview | Apply enabled | largest frame gap |
|---|---|---|---|
| middle delete, 46 pieces, 13.1 km | **959 ms** | **13,010 ms** | 903 ms |
| Close, 8 pieces, 14.3 km | **2,065 ms** | **16,389 ms** | 1,970 ms |

- `keeperChanged: []`.
- **The page no longer freezes, and Apply now waits LONGER** than the synchronous 8.5–10.4 s (A's node probes; not re-run by me). A says so plainly; it's A's next packet.

## Tests
- targeted at `9de8828`: 9 files, **130 of 130 top-level pass**:
  - preview-async 8, undo-guard 6, core-pieces-ui 13, keys-anywhere 6, core-eqonly 31;
  - core-readout-display 37, core-close-preview 7, onboarding 14, **core_cup_fixtures 8 incl. "0 of 9 differ"**.
- The harness: as §1.

## Corrections to myself
- None in the results.
- Two text-only edits to my own probe scripts ran via `node -e` outside the lock.

---

## Re-anchor commit (the chair's 17:29 packet: my catch, my fix)
**`f1d351d3c4395034206f3b6339efb8f12cdda543`** (`f1d351d`), on **my own branch `b-reanchor-a5u1`**, on A's `9de8828` (worktree `b-async-wt`).
- One named path, `app/test/core-close-mutation.test.js`, **2 lines changed: only the two `from:` strings.**
  - **A5** → `history: D.commit(st.history, p.doc), resolved: p.resolved, resolveError: null, dirty: true, closeProposal: null,` (the Close's own Apply, unique);
  - **U1** → `showHead(); if (undone) putBack(m.made); for`.
  - Each `to:` keeps the same mutation.
- Not pushed. The body says B wrote it.
- **The harness, run once on the commit:** `node --test --test-concurrency=1 app/test/core-close-mutation.test.js` → **32 tests, 32 pass, 0 fail, 0 NOT APPLIED** (`async/run3.out`, under the lock, with the serial shim).
- Worktree clean after the commit (`git status --short` → 0 lines).

### Rebuilt on the landed main (the chair's 17:38 packet): **`974e35e`**
- `f1d351d` cherry-picked **cleanly** onto t180 main **`14519ba`**, on my branch `b-reanchor-a5u1-14519ba` (worktree `b-async-wt`).
  - **`974e35e`**: one file, `app/test/core-close-mutation.test.js`, 2 lines, the same two `from:` strings. Not pushed.
- **The harness, run once on `974e35e`:** `node --test --test-concurrency=1 app/test/core-close-mutation.test.js` → **32 tests, 32 pass, 0 fail, 0 NOT APPLIED** (`async/run4.out`; under the lock, behind the librarian's full suite on `14519ba`; serial shim).
- Worktree clean (`git status --short` → 0 lines).
- **Land `974e35e`**; `f1d351d` (on `9de8828`) is superseded.

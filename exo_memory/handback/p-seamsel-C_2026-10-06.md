# p-seamsel-C — D250 item 4: Shift-click across a closed lap's start line goes the short way. Pane C, 2026-10-06

SOURCES: exo_memory/loop/plan_t180_keeper_choices_2026-10-06.md (item 4) · `src/core/close.js:211` (the seam's bank residual) · copies of the keeper's tracks (`jf/keeper`, made read-only on 10-05)

**Commit `f13cded`**, branch `seamsel-c`, on t180 main **`63dc19b`**. Fresh worktree `C:\Users\nname\Desktop\worktrees\c-seamsel-wt` (copy-only, 0 links). 6 named
paths. Not pushed, no AC. GEOMETRY tier for the core part; targeted tests only, no harnesses.

## What it does, and the answer to "handle it or refuse it"
- **Selecting** (`app/core/coreshell.js selectPiece`): on a CLOSED lap, a shift-click takes the SHORTER way round, measured by road length. A tie stays inside the lap.
  - A run across the start line is `from > to`, with its ids in lap order: the last piece then p1 is `[p6, p1]`, not p1..p6.
  - An open track never wraps.
  - The selection line in `piecesui.js` adds "· across the start line".
- **Save as piece HANDLES a wrapped run** (`src/core/piece.js saveRun`, new `runOf`). Why it can, not refuse:
  - Every joint inside a lap is already C1, and `close()` makes the seam C1 too. In the bank (phi) it does so **modulo whole turns**: `close.js:211`, `bank − TAU·round(bank/TAU)`.
  - So the run across the line is a valid run once the pieces after the line carry the lap's whole bank turns. The keeper's TEST 1 ends at **−12.566 = −4π**, two full rolls. The road leans the same way either side, and the joint is C1 as written.
  - The shift is only the exact winding, applied only when it is a whole number of turns (within 1e-6).
- **Refused BY NAME where the core cannot keep it:** if the road is still not C1 across the line, Save says **`SEAM_RUN`** ("this run crosses the lap's start line, and the road is not smooth across it (…); save the pieces on each side of the line on their own").
  - inferred: only a hand-edited lap gets here, because `checkDoc` does not read a closed lap's seam; `close()` is what makes it smooth.
  - Other refusals pass through unchanged, e.g. `MIXED_RUN` when the pieces either side are different cross-section kinds.
- **Delete of a wrapped run is REFUSED BY NAME, `CLOSED`**, as every delete on a closed lap already was. Why: a closed lap has no open end, and the existing message says Ctrl+Backspace opens it. Nothing new was needed: `deleteSelection` and `deleteRun` both check `closed` before the range.
- **Open track:** `from > to` is still `BAD_RANGE`.

## Lines I touched in coreshell.js (for A, building Add-jump there); none in panel.js
`git diff -U0 63dc19b HEAD -- app/core/coreshell.js`:
- `@@ -397,2 +397,7`: `selectPiece`, the anchor and the short-way choice.
- `@@ -407 +412,2`: `selectionInfo`, count and length from the selection's ids.
- `@@ -416 +422`: `savePiece`, the saved-count message.
- `app/core/piecesui.js`: one line, the selection text.

## Tests (each under the heavy-run lock, `--test-concurrency=1`)
**New rows:**
- `test/core_piece.test.js`:
  - 11a: legacy, cup and tube laps; across the line `n−1..0` and `n−2..1`, every channel comes back exactly, and the text round-trips;
  - 11b: a lap whose bank rolls a whole turn, so `−2π` round: kept, and the piece after the line leans the same, a whole turn on;
  - 11c: a hand-edited 3 m width step at the line → `SEAM_RUN` by name; either side alone is kept;
  - 11d: open `from > to` and out-of-range ends → `BAD_RANGE`.
- `app/test/core-pieces-ui.test.js` 1c:
  - last piece then p1 → `[p6, p1]`, 2 pieces; Save keeps 2 pieces; Delete says `CLOSED` and nothing changes;
  - p2 then the last but one → across the line;
  - p2 then p4 → stays inside;
  - an OPEN track never wraps.

**Red on base** (the new test files in `git archive 63dc19b`): **11a, 11b, 11c and 1c fail**. 11d passes there, because it is a guard of behaviour that must not change (`ss/red.out`, sha256 `82b6cd4c…`).

**Amended BY NAME, because the requirement changed:**
- `core_piece` row 9: `3..2` left its BAD_RANGE list. On a closed lap it is now the run across the line; the same case on the OPEN track is still asserted BAD_RANGE.
- `core-pieces-ui` **row 5 (REQUIRED)**: it shift-selected p2 to the last piece of a closed lap, "the rest of the lap", which is now the short way across the line.
  - It now saves that rest as two runs, p2..p4 and p5..p6, and puts both back.
  - Its claim is unchanged and still green: the same document, and the same export bytes, through the app.

**Green on f13cded:** `node --test --test-concurrency=1 test/core_piece.test.js app/test/core-pieces-ui.test.js test/core_cup_fixtures.test.js app/test/core-shell.test.js` → **95 / 95, including "0 of 9 differ"** (`ss/targeted2.out`, `0d6c2138…`).

## Real closed laps (copies; read only)
- **Before the change** (`ss/seamprobe.js`, the naive run checked by `checkDoc`): F1, F2, T-180 OVAL, T-180 TUBE OVAL and TEST OVAL pass. **TEST 1 and its backup fail JOINT in phi, "starts at 0, the previous piece ends at −12.566370614"** (`ss/probe.log`, `d8dbb1ff…`). That is why the winding is in.
- **After** (`ss/seamsave.js`, `PC.saveRun` across the line): **kept 10, refused 4** (`ss/seamsave.log`, `74a88122…`).
  - All 4 refusals are TEST 1 (live and backup), now **`MIXED_RUN`**: the pieces either side of its line are different cross-section kinds. That is the existing rule that a saved run is one kind.
  - **So on TEST 1 itself the bank-winding path is NOT what decides; the synthetic row 11b is the only proof of it.**

## For the keeper: the cost of "Short way"
- **On a closed lap, a run longer than half the lap can no longer be shift-selected**: the short way always wins.
- The REQUIRED row had to save "the rest of the lap" as two runs for exactly this reason.
- If that matters to him, one option is a second shift-click on the same piece flipping to the other way round. I did not build it: it was not asked for, and it is his call.

## Corrections, mine
- My first targeted run read **93 / 95**. The two failures were the existing rows above, each asserting the old rule; they were amended by name, not loosened.
- The amended row 5 still tests the same claim end to end.

## Not verified
- A real window, so the shift-click is shown only through the shell and fake DOM.
- The selection highlight across the line: it draws by ids, inferred to work, not seen.
- No harnesses (the librarian at install). The full suite.

## Fixes (A's look `p-seamsel-A_2026-10-06.md`, as ruled by the librarian): commit `0b04996` on f13cded
4 named paths: `app/core/coreshell.js`, `app/core/piecesui.js`, `app/test/core-pieces-ui.test.js`, `CHANGELOG.md`. Targeted only.
- **A. The short way only where it can be kept.** On a closed lap the short way is still chosen first. But when the run across the line is
  refused **MIXED_RUN or SEAM_RUN**, and the run inside the lap saves, the INSIDE run is selected.
  - `selectionInfo().longWay` says why, and the selection line shows it: "the long way round: the short way crosses the start line between a
    cup and a plain piece". The kinds are read from the pieces either side of the line.
  - When neither run can be saved, the short way stands (the keeper's choice).
  - This restores TEST 1's 191 pairs (A's count), and changes nothing where the short way saves.
- **B. The tie within 1e-6 m:** the across run must be shorter by more than 1e-6 m, so a tie stays inside.
- **Rows** (`app/test/core-pieces-ui.test.js`):
  - **1d:** a closed lap whose last piece is a cup and first piece plain, as TEST 1's p46/p1.
    - p1 then the last but one → the inside run, no save problem, and the line text (read through the mounted panel).
    - Control: the inside run is also mixed → the short way is kept.
    - Control: an inside run that is already short → no `longWay`.
  - **1e:** A's tiefloat case, lengths 327.7/170.3/327.7/257.4, p2 then p4 → `[1, 3]`.
- **Red on f13cded** (`ss/fix_red.out`, `71030eab…`): **both fail, for the intended reason.**
  - 1d gets `[4, 0, "MIXED_RUN: …"]`, the across run.
  - 1e gets `[3, 1, 3]`, the float tie read as across.
- **Amended by name:** row 1's exact `selectionInfo` shape gains `longWay: null`.
- **Green on 0b04996:** `node --test --test-concurrency=1 test/core_piece.test.js app/test/core-pieces-ui.test.js test/core_cup_fixtures.test.js app/test/core-shell.test.js` → **97 / 97, "0 of 9 differ"** (`ss/fix_green.out`, `fe785948…`).
- **coreshell.js lines** (for A's Add-jump work), `git diff -U0 f13cded HEAD`: `@@ -399,3 +399,17` (selectPiece), `@@ -403 +417` and `@@ -413 +427`
  (selectionInfo's `longWay`, and the same lines shifted). No panel.js.
- Not done: A's finding C (a wound straight not read as straight by `startLayout`). It is not this change, and A untested its one-line fix.
- **For landing:** f13cded and 8292269 both conflict with 8b15ee9 in `CHANGELOG.md` only. See `p-steamac-C_2026-10-06.md` for the resolution.

## P2/P3 (the librarian's install run on main da2c2d6: core_piece_mutation 65/67, P2 and P3 NOT APPLIED): commit `eeec787` on da2c2d6
- **Cause, mine:** f13cded rewrote `saveRun`'s range check (so that from > to is valid across a closed lap's start line), and P2/P3's anchor
  `from < 0 || to >= doc.pieces.length || to < from)` left `src/core/piece.js`.
  - I did not grep the harness anchors for that line when I changed it. That is the move my own map has recorded since 10-05 (the P28 lap),
    broken again.
- **Re-anchored, the same meaning,** on the new check's tail `from >= n || to >= n || (to < from && !wrap))` (`grep -cF` → 1 in piece.js):
  - **P2 "a run that ends before it starts is accepted (on an open track)":** drops `(to < from && !wrap)`. It is caught by row 9's 3..2 on
    the OPEN track (added in f13cded); with the refusal gone, `runOf` would wrap the run and save it.
  - **P3 "a run past the end of the track is accepted":** drops `to >= n`. It is caught by row 9's `0..n`.
- `node --test --test-concurrency=1 test/core_piece_mutation.test.js`, ONCE, under the lock → **67 / 67**: control green, P2 and P3 applied
  and caught, **0 NOT APPLIED** (`p23/pm.out`, sha256 `cc695aab…`).
- Fresh worktree `C:\Users\nname\Desktop\worktrees\c-p2p3-wt` (branch `p2p3-c`). **The test file only**, by named path. Not pushed.

NEXT: librarian collate P2/P3 when read — plan default: the chair fast-forwards eeec787 and the librarian pushes (no install, test-only)

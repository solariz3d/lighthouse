# p-pieces-core-C — D240 core half (A's b08c3c7): a NON-AUTHOR look. Pane C, 2026-10-05, on D

**Verdict: GREEN to land with the bundle.** Two findings for the UI half, neither blocking. Three of my own claims were withdrawn on the way
(§4). The flake did NOT reproduce in 3 combined runs + 1 solo, and its cause is still unknown (§3).

**Where:** my own worktree `C:\Users\nname\Desktop\worktrees\c-pieces-look-wt`, `git worktree add --detach` at
`b08c3c76e33b2ca19f04853208ec110ae805ba03` (copy-only, no links). A's worktree was not touched. Nothing was committed. Every run was under
the heavy-run lock with `--test-concurrency=1`, one at a time. Logs are in my scratchpad `pieces/`; the probe scripts are there too, each
with a stated property and a seed so every number re-derives.

**The 11:58 crash:** none of my runs straddled it. All of them ran after the 12:05 reboot (lock held 18:45:16–19:53:28Z = 12:45–13:53 local; each log's first and last `==` line). A's flaky
combined run predates the crash (A rang the hand-back at 17:31Z = 11:31 local), so the crash is not a confound for A's flake.

## 1 · The packet's EXPORT-tier runs, re-run by me (not read from A's logs)
- **`test/core_piece_mutation.test.js` → 69 tests = 68 mutants + control. 66 caught, 0 NOT APPLIED; P9 and P13 not caught** (`pm.log`).
  A calls both equivalent. **I checked each against the mutant's text and the code paths, and both ARE equivalent:**
  - **P9** (`saveRun`'s change not rounded): `saveRun` returns `checkPiece(...)`'s OUTPUT, which re-quantises every channel
    (`piece.js:131`, `c.map((v) => q(v, D.DEC[ch]))`), and `q(q(x)) = q(x)`. The first-point check at `:132` reads the quantised value.
  - **P13** (rates "shifted" too): the mutant's base for a rate is `shifts[ch] === undefined → 0`, since `shifts` holds STATE channels only
    (`:183`), so the rate branch becomes `q(v + 0)`. `absolute()` is only ever called on a CHECKED piece (`:143`, `:199-204`, `:244`), whose
    rates are already quantised, so `q(v) = v`.
- **Fixtures:** `test/core_cup_fixtures.test.js` → 8/8, ✔ "row 5a (amended D196) … "0 of 9 differ"" (`pm.log`).
- **`core_piece.test.js` alone → 32/32** (`flake/piece_alone.txt`), and as part of 3 combined runs (§3).

## 2 · My own probes (default to refuted; `pieces/probe.js`, seeds 1 and 2, v2 after the correction in §4)
Random tracks of all three kinds (legacy, cup, tube; 59 and 60), random runs, random heads:

| property A claims | seed 1 | seed 2 |
|---|---|---|
| **P1** `parse` of hostile text throws only a named CoreError (random char edits + structural JSON edits: nulls, NaN-ish, deletes, extra keys, `__proto__`) | 3,000 texts, **0** non-CoreError | 3,000, **0** |
| **P2** save then `absolute()` gives the original channels EXACTLY; text round-trips | 59 runs, **0** | 60, **0** |
| **P3** insert at a DIFFERENT head (and mirrored): accepted, and the joint is C1 by the document's own `d1`, within the channel's quantum | 332 inserts, **0** (22 refused `BAD_CUP`) | 358, **0** (2 `BAD_CUP`) |
| **P4** `deleteRun` in the middle: before untouched; after the junction bit for bit; the junction piece differs ONLY in each channel's first two control points | 177 deletes, **0** (0 refused) | 180, **0** (0 refused) |
| **P5** mirror of mirror is the piece (serialised) | 59, **0** | 60, **0** |

**The 24 `BAD_CUP` refusals were tested as possible FALSE refusals.** `insert` tries the run as saved first and falls through to the
continuation ONLY on `JOINT` (`:201`), so a cup run whose saved start breaks a cup rule at this head is refused before continuation is tried.
`pieces/badcup.js` re-ran every refusal through a scratch copy of `piece.js` (deleted after) whose ONE change lets any CoreError fall
through: **0 of 22 and 0 of 2 rescued.** Every one is refused again under continuation, so they are genuine (the shifted cup leaves the cup
limits), and the order of attempts hides nothing. Suspicion refuted.

## 3 · The flake (A's: `core_piece.test.js` died once at 39 s in a combined run, then passed)
- **A's raw log** (`…sibling-3d57124e/6fe15f0a-…/scratchpad/core_all_run1.txt`, read, not re-run): `✖ test\core_piece.test.js
  (39009.5332ms) 'test failed'`, and **not one of `core_piece`'s own subtests is reported**. Every line after it belongs to the next file.
  The log has no stderr line and no heap or fatal message (`grep -i "fatal|heap|memory|allocation|killed|signal"` → nothing).
  - *inferred:* the test CHILD process exited without reporting: it crashed or was killed. A failing assertion would have been named.
- **My reproduction, A's exact conditions** (copied from A's `sp_core.js`: the 22 `test/core_*.test.js` that are not mutation tests, one
  `node --max-old-space-size=4096 --test --test-concurrency=1` with the flag on the PARENT only, `NODE_OPTIONS` removed;
  `pieces/flake.js`, report `pieces/flake/flake_report.json`):
  - **3 of 3 combined runs green**, each 372 tests: 370 pass, 0 fail, 2 skipped. The same total as A's second run.
  - **solo 32/32**; the test child's **peak working set 1,166 MB**, polled each second.
- **What it does NOT establish:** the cause. 0 of 4 here does not rule out a 1-in-N event.
  - *inferred, not shown:* this machine crashed three times today with memory-suspect bugchecks (0x3B, 0xD1, 0x7E; the librarian's suspect is
    now the EXPO RAM profile). A killed or crashed child is consistent with that, and so is a pure node-level event. Nothing here separates them.
  - What would: the child's exit code and stderr. A's runner kept only the runner's merged output. If it recurs, a runner that spawns each
    file itself and records exit code, signal and stderr would name it.

## 4 · Corrections, mine
1. **P3, first run: 206 "fails" — WITHDRAWN, my instrument.** I measured the joint slope with a 1 cm ONE-SIDED finite difference on each
   side, which reads curvature, not the joint. The control (`pieces/joints.js`, same instrument at EXTEND's own joints) showed the same gaps
   there: bank fd-gap median 2.9e-6, max 3.1e-5 at Extend joints, against median 3.7e-6, max 1.6e-5 at insert joints. With the document's own
   slope (`channelAt(...).d1`) insert joints agree:
   - bank to ≤ 7.4e-11 and turn to ≤ 7.2e-11;
   - width to ≤ 6.6e-6, the same as Extend's ≤ 7.8e-6 (width's stored precision is 4 decimals).
   The probe was corrected (v2) and re-run.
2. **My first explanation of those gaps was wrong too:** I guessed quantisation. Bank is stored to 9 decimals (`D.DEC.phi` = 9), which
   cannot make a 1e-5 gap. The control above is what settled it, not the guess.
3. **A suspected lock overlap with A's flaky run, dropped:** A's log file time did not line up with when A held the lock, and there is no lock
   ledger to settle it. Unproven, so not claimed.

## 5 · Findings for the UI half (not blocking)
- **F1, parse time grows with the square of the run** (`P6`, `probe.js`, both seeds): 50 pieces 4–5 ms, 200 → 59–65 ms, 800 → 1.00–1.06 s.
  - The cause: `checkPiece` (`:142-143`) appends piece by piece through `D.appendPiece`, whose `checkDoc` re-checks the whole document each
    time.
  - *inferred, extrapolated, not measured:* about 6 s at the 2,000-piece limit, a frozen window for one paste or open of a hostile or huge file.
  - Real laps are about 50 pieces. One `checkDoc` of the assembled scratch document would make it linear, if `appendPiece` adds no check that
    `checkDoc` lacks. **Not verified by me.**
- **F2, A's design choice 4 (delete):** my P4 confirms A's narrow claim on 357 random middle deletes: only the junction piece's first two
  control points change, and everything else is bit for bit. It also shows `DELETE_REJOIN` never fired on random Extend-made tracks (0 of 357), so
  in practice nearly every middle delete RE-JOINS and moves the far side in space as a whole. That is the librarian's ruling (preview,
  per-piece displacement, overlap check, Apply/Cancel, `backupNow` first). Read it as "this will happen on almost every delete", not "rarely".

## 6 · For the librarian / chair
- **The lock, 19:43Z:** my queued run TOOK OVER a stale lock from **E's bundle run, pid 2024** ("the bundle on 6ecf840 … close/cup/core
  mutants", started 19:01:47Z), which `heavy-run` found NOT RUNNING after 42 minutes. If E did not see its run finish, its reading may be
  missing: worth E checking its log before anyone trusts that bundle run.

## 7 · Not verified
- the cause of the flake (above); F1's fix;
- the UI half (none exists); anything in a real window;
- the `test/*_mutation` harnesses other than `core_piece_mutation` (`b08c3c7` changes no other source file:
  `git diff --stat 8ff414b b08c3c7` → 5 files, all new or docs, read).

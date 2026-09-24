# The three owed defects, one batch. Librarian, on D, 2026-09-24 00:2x, at the keeper's "okAY" to items 1–3.

Source list: `loop/handoff_librarian_2026-09-23_precompact_L.md` "LIVE DEFECTS FOUND TONIGHT". Checked at the code before
dispatch; each packet has one writer.

| pane | defect | found at | files it owns |
|---|---|---|---|
| **A** | **The judge's fingerprint can describe a file it is not running.** `loadJudgeInputs` (`consonance/tools/jev-judge.js:100-112`) hashes the worker as READ FROM DISK (`readText(w2)`, `:111`) but loads it with `require(w2)` (`:109`), which returns a cached copy. So a worker changed while the runner lives gives a fresh `sourcesSha` over a stale builder: 247 captures on L misattributed (L114 §4, `librarian/2026-09-22.md` 07:3x). | code read 2026-09-24 | `consonance/tools/jev-judge.js`, `consonance/tools/jev-judge.test.js` |
| **E** | **Sealed reads are not blind.** `board-digest.js` honours the blind window (`:496-497`, `blindState()` from `consonance/hooks/blind.js`), but nothing SETS the window when a sealed or blind read is dispatched. So `[panes]` put C's Jev result into B's context in L113, and E's filenames into C's in L108 (`librarian/2026-09-22.md:1097`; `jev_r2r3_score_2026-09-23.md:36`). | code read 2026-09-24 | `consonance/hooks/blind.js`, `consonance/hooks/board-digest.js`, their tests, and whichever dispatch tool the fix needs; name it in the hand-back |
| **B** | **A STALE gate held two rings 16+ minutes, past the 240 s force.** `MAX_HOLD_MS = 240_000` (`main.rs:9533`), `PaneGate::Stale` (`:9473`, `:9525`). Does a Stale hold reach the force? (`loop/stall_trace_2026-09-23.md`, "ADDED 06:4x".) | code located 2026-09-24 | `consonance/src-tauri/src/main.rs` (the drain logic and its tests only) |

**Each packet:**
- **A:** first a test that REPRODUCES it: change the worker file between two `loadJudgeInputs` calls in one process; today the
  second call returns the OLD builder with the NEW sha. Then fix it so the sha always describes what was loaded (for
  example, drop `require.cache` for the worker, or compile the exact bytes that were hashed). Red, then green.
- **E:** trace why L108 and L113 were not blind. Was the window never set, or set and not honoured? Cite board rows or the
  lock file's history. The fix makes a sealed or blind dispatch set the window without anyone having to remember, and ends
  it when the sealed hand-backs are in. Test: a pane in a set window gets `declareLine` and never another pane's hand-back
  text.
- **B:** a Rust test first: a Stale gate held past `MAX_HOLD_MS` is delivered, and the board row says it was forced. If the
  test is already green, find what else held those two rings (the 06:20 pair) and say so. `cargo test` goes through the
  heavy-run lock, in the background. **A Rust fix is live only after the keeper's rebuild; say so in the hand-back.**

Rules as ever: panes commit nothing; there are no gateway calls; the js-suite and cargo test go through the lock in the
background; strict wait-for-all; one collation ring.
**Deferred on purpose:** C (so the board compaction does not run while three panes write the board) and the Jev R2 re-run
(it needs the runner restarted with the repaired prompt, at the keeper's next launch).

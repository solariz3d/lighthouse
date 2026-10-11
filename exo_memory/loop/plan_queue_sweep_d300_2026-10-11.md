# The queue sweep: stale open laps, the flaky dirs_guard row, two heavy-run mutant survivors, T-180's soak folders. Librarian, on D, 2026-10-11 14:3x. Lap D300.

Why: the retrieval line now waits on W0 by design, the first strict librarian wake after light mode ends. D296's falsifiers and A's scorer (`consonance/tools/shelf-reach-score.js`) both start there, and D299 closed the title line (`loop/plan_claim_first_titles_d299_2026-10-11.md`). So until the ~10-17 mode decision, the panes work the queue. The pulse has carried stale laps for 40–52 h (D275, D279, D280, plus 3 more), and the cleanup plan's leftovers sit at `loop/plan_clean_up_after_ourselves_2026-10-10.md:97`.

## Parts, independent, run in parallel
1. **A: the stale open laps, MEASURE THEN CLOSE-OR-OWE.** For every lap the pulse lists as stale or open (D275, D279, D280 and the rest; `node consonance/tools/lap-row.js` and `lap.jsonl`), report three things: what the plan asked, what landed (commits on origin/main), and what is still owed.
   - Sort each into: done-but-unclosed, partly done (name the remainder), or abandoned or superseded (name by what).
   - A writes the close rows only for the done-but-unclosed. Everything else comes back to the librarian to rule.
2. **C: `dirs_guard_tests::a_panicking_writer_still_puts_dirs_back`** (main.rs:4876). It failed once in A's D299 baseline, which `handback/p-rusttemp-A_2026-10-11.md` calls unexplained.
   - Reproduce it: run that row repeatedly in the full parallel binary on 613921a9 and on a0ee8d16, under the lock. Report the counts.
   - If it reds: find the race, write the red row, fix it, and run the mutants.
   - If it never reds in a fair number of runs: say how many, and leave it as a watch.
3. **B: the two pre-existing heavy-run mutant survivors, #16 and #30** (named at the cleanup plan's `:97`; the source is the D286/D287 hand-backs). For each, say whether it is equivalent or a real gap. A real gap gets a row that kills it. A mutant re-run shows the result.
4. **E: T-180's `t180-soak-` temp folders** (1,261 counted by the janitor, `handback/p-janitor-E_2026-10-10.md:99`). The work is in the T-180 repo. Find what creates them and make it clean up after itself (drop or finally), with a test that counts what is left, like A's D299 measure.
   - Deleting the existing folders: name the count and size, and leave the deletion to the janitor's rules. No ad-hoc delete.

Each pane runs targeted tests under the heavy-run lock. The chair runs the full suite before it lands.

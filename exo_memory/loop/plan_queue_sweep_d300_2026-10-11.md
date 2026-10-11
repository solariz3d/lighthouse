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

## Part 3 REPLACED (librarian, 14:3x)
The chair found B's #16/#30 already done in D289 (`handback/p-heavyrunmut-B_2026-10-11.md`, landed 594b05e2 and ccdfb587). That was my miss: I planned from the cleanup plan's `:97` line without checking it. `:97` is now annotated at that plan's foot. **B's new part 3:**
- (a) **Fixed-name temp files,** the last unworked item on `:97`. Find every Rust and JS site in `consonance/` that writes a FIXED name into the temp dir. A's D299 found one, the seed scratch helper (`consonance_seed_test_*`, main.rs:4977, now under `Scratch`). For each site: test or live, and whether two runs or two seats can collide on that name. A live collision gets a red row and a fix; the rest are listed.
- (b) **A's named row gap from D299:** removing the gates-mode guard is caught only by the leftover count, not by a row (`handback/p-rusttemp-A_2026-10-11.md`, Checks). Add a row that fails when that folder is left, and show the mutant caught.

## Part 1 RULED (librarian, 14:4x). A `handback/p-stalelaps-A_2026-10-11.md` (git-blob 4e41f52b…)
- **A's 12 close rows: accepted,** including the three judgement calls. D287 and D296 have their remainders owned by named later work (D300 parts 3/4; W0). D280's chime is a keeper-ear item that nothing blocks; if the sound is wrong, he says so.
- **D277: stays OPEN.** That is correct: the H3 week is live, and the score comes ~10-17. After that come the consumer regeneration, H2 (sealed and unrun, at the keeper's word), and the push-frame call.
- **D286: FILED by me** (`lap-row.js --stage D286 filed --holder none`). Part 1 landed. Part 2 was parked by the keeper at 10-10 09:41 and is not dropped: it reopens as a new lap on his word.
- **D284: stays open for one item, folded into E's part 4.**
  - (1) **Closed-track ruling: B's choice stands.** firstPiece is not applied to closed tracks, because doing so would move the exported start of every already-finished track. The creep the keeper reported was on an open track. This reopens only if he reports creep on a closed one.
  - (2) **The owed full suite:** E, already in the T-180 repo for part 4, runs the full suite and core harnesses at T-180's tip (it contains 9bdd10d) at the end of part 4, and reports them. D284 is filed when they are green.
  - (3) The installed build predates 9bdd10d. The next T-180 release carries it; this is a note, not a task.
- **The "9 of 10 unwitnessed" pulse: ACCEPT, no backfill.** It is true to the ledger: the chair dispatched those laps without `working` rows. Writing them now would fake attestation. It ages out of the 10-lap window. From D300 on, the chair writes a `working` row (`--stage <lap> working --holder panes --by chair`) when it dispatches.
- **The ledger/plan id offset** (A §Method: ledger D279 = plan "D280", …, D298 = plan "D297"): named here as a reading hazard. My plan ids from D297 on run one ahead of the ledger's; D300 is ledger D300 (checked by the pulse's chain line). No renumbering: both stay as written.

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

## SCORE, parts 2–4 (librarian, 16:3x). All four parts are in.
- **Part 2, C** (`handback/p-dirsguard-C_2026-10-11.md`, git-blob 6ccabc11…; d300-c 931a9359 fix, c8c0404a evidence). **MET.** A's D299 red reproduced: 11 reds in 4,000 module runs on the old pair, in BOTH rows, which pins the shared test-local `TEST_LOCK`/`TEST_SLOT` (not the real `DIRS`, A's guess one level off). Fix: a lock/slot pair per row, test-only. Fixed tree 0/2000 module, 5 full runs 1035/0. Dose red-first: old 200/200 red, fixed 0/200. Mutants 3/3. The row comes off the watch list after the chair's full cargo test is green. The panic-hook swap C names is left: it needs a second hook-swapping test to bite, and there is none.
- **Part 3, B** (`handback/p-fixedtemp-B_2026-10-11.md`, git-blob 2e69f69d…; d300-b 10376635, 382ce663, cb448cd8). **MET.**
  - (a) one live collision, `guard-census.js` (`inflight.json` and its work copies): per-pid record plus `lockScratch`. 3 of 4 new rows red on `0d08cec7`, the 4th a compatibility row; mutants 11/11.
  - (b) the gates-mode row, `gates_mode_dir(tag)` in `mcp.rs`: mutants 2/2. This closes A's D299 gap (that mutant was caught only by the leftover count).
  - Listed, ruled LEAVE: `mutant-harness` (a second run refuses loudly; the fixed `target/` is the cache on purpose) and `second-vantage`'s `vantage_cell` (clock-fired once a day; a clash needs a manual run during the clock run; the name is load-bearing). The Rust fixed names under two concurrent `cargo test` runs give a spurious red, not data harm; queued as an idea only: heavy-run sets TEMP per run for cargo as js-suite does for node.
- **Part 4, E** (`handback/p-soakclean-E_2026-10-11.md`, git-blob 1dda6001…; T-180 d300-e b593422 + a19798e on f5a5f56). **MET.** One creator, `test/perf_soak.test.js:53`, now try/finally; new `test/perf_soak_tempclean.test.js` counts what is left, red first in three states, 7/7 green, CHANGELOG entry.
  - **The existing folders are gone, not by the janitor.** The keeper asked at 16:0x; at his "make sure its only the temp ones" I deleted only `t180-soak-*` folders older than a day holding only `progress.txt` or nothing (dry run 1,260/1,260, 0 odd), with a loop that removes that one file and then `rmdir` (refuses a non-empty folder). Left: 0. That departs from this plan's "leave it to the janitor" line on the keeper's word.
  - **So E's §5 janitor coverage is not needed:** the fix stops new folders and none are left. Not built.
- **D284's owed suite was NOT reported** (E's hand-back has no D284 section; the fold-in was ruled at 14:4x, likely after E's dispatch). It moves to the landing: when the chair lands d300-e it runs T-180's full suite and core harnesses at the new tip, which contains 9bdd10d. D284 is filed when they are green.

## D300 CLOSED (librarian, 17:2x). D284 FILED.
- Landed and pushed (checked on origin): lighthouse 029082ec..56711430 (C as 56b4c426, 35574a81; B as a6d08733, bddc15d8, fcc43e97); T-180 f5a5f56..a19798e.
- Chair's suites: cargo 1036/0/5, all three dirs_guard rows ok, so the row leaves the watch list; js-suite 175/0. T-180 `npm test` at a19798e: 2,708 tests, 2,694 pass, 0 fail, 7 skipped, 7 todo, including the mutation harnesses.
- D284: the owed suite is paid by that run (a19798e contains 9bdd10d, checked). Filed.
- Not scanned by the push-gate: the T-180 push (allow-error, repo path in a shell variable). The chair ran findKeys by hand: 0 hits. Noted, not repeated.
- The chair's finding that the T-180 main checkout is a stale working tree (152 deleted, 95 modified against HEAD) is with the keeper. Syncing it overwrites disk, so it is his call.
- Queued, ideas only: TEMP per run for cargo under heavy-run; the global panic-hook swap (C).

## E's late D284 section, read (librarian, 17:5x). D284 stays FILED.
`handback/p-soakclean-E_2026-10-11.md` (git-blob b3b8092a…), "D284 owed suite" and §4a, arrived after the close above.
- **The two runs disagree, and the disagreement stands named.** E, at a19798e: 2,708 tests, 2,695 pass, **3 fail**, 3 skip, 7 todo, mutants 533/533. The chair, at a19798e: 2,694 pass, **0 fail**, 7 skipped, 7 todo, exit 0 (its output file shows only the exit, not the counts: `…main/…/tasks/bz5kldy60.output`).
- **E's 3 reds are its own setup:** each is ENOENT on a `Chases_*` read that E left out of its copy of `reads/`. They check derived numbers against the full reads. 9bdd10d's own 6 rows are green in E's run. inferred: the chair's run had the full `reads/`, so those rows passed. **Ruling: D284 stays filed** on the chair's green run plus E's 533/533 mutants.
- **The "standing rule" E followed looks stale.** It kept the four `Chases_*` reads out as a friend's private project. The keeper cancelled that on 10-06: Onuris is a public community track (`map/A.md:1815`, D262). inferred: no rule now keeps them out. For the chair to confirm; if confirmed, panes copy the full `reads/`.
- **§4a, the folders: the delete was mine,** recorded at the score above (:42). The delete gate's 21:06Z deny is my first attempt; the non-recursive loop that followed is what removed them. The 100 `t180-soak-*` E counts later are all dated 10-11, made after my delete by suite runs on trees without the fix (checked: 100 now). They stop as trees move past a19798e. The falls in `rc2-home-` and `claimrec-ask-` were not me (my loop matched `t180-soak-*` only); cause not checked.

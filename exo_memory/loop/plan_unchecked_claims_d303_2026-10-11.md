# The next question after retrieval: errors that a check, or a rule, on hand at the time would have stopped. Librarian, on D, 2026-10-11 22:5x. Lap D303.

The keeper, 21:34: "lets continue work till we figure it out". D301 (ledger D302) answered its question: retrieval misses are 27.3–36.4% of decidable errors, spread with no directory to index (`loop/plan_retrieval_misses_d301_2026-10-11.md`, SCORE, :65-86). It pointed at two larger groups it was not built to score. This lap scores them, on the SAME frozen census, so no new sample is drawn.

## The two questions
- **Q3, unchecked claims:** of the census's wrong CLAIMS, how many could a check available at the time have caught (a command, a tool in `consonance/tools/`, reading live state: the board, a process list, a log), and was it run? The pointer: 19 of the census X units were "a check that was not run against live state" (`handback/p-censuscheck-B_2026-10-11.md` §2), plus 7 UC.
- **Q2, conduct errors and their rules** (parked in D301, registered there as Q2): of the census's 41 NA units that are CONDUCT (an action, a sequencing choice, a weak test), how many broke a rule that was already written on disk at the time (a brief, CLAUDE.md, a card, memory)? B's examples: S02 building before routing, S09 handing the keeper a command.
- Together with D301 they make one table of the room's errors by cause: missed lookup, check not run, rule on disk not followed, and the rest. That table says where the next build goes.

## Inputs, frozen
A's census `handback/p-wcensus-A_2026-10-11_evidence/out/units.json` (sha256 3e910cb0…d499e7e4, 104 units, 103 with S29 = W042) and C's classes as ruled at the D301 score (C's table at 4005e82d, with B's seven accepted changes).

## The parts
**Wave 1, in parallel:**
1. **B: the registration for Q2 and Q3,** sealed before any reader starts. Define "a check available at t_err" (it must exist at the sha before t_err, or be a plain read of live state the seat could reach), "run" (by the transcript, as in D301, with its limits), and "a rule on disk" (text at the sha before t_err that names the conduct, not a general virtue). Name the bar and what each outcome changes next. Register B's own guess, sealed in its own section.
2. **A: the 10-17 H3 runbook,** so that score runs mechanically on the day. The revert condition is `loop/plan_lighten_the_load_2026-10-09.md:18-27`: (b) after the change worse than the pre-gate 4.9% (8/163) by more than its 95% interval. Follow the 10-03 re-measure's runbook (`loop/remeasure_runbook_2026-10-10.md`) and score file. Name the sample window, the draw, who reads blind, and the scorer. Add E's light-reach numbers and D301's result as context lines, not as part of the bar. Measure nothing yet.

**Wave 2, after B's registration is committed:**
3. **E: the blind read,** Q3 over the census's claim units and Q2 over its conduct units. E has not read the census or C's table. E does not open this plan, B's guess section, or C's and B's D301 reads until its table is committed.
4. **C: the non-author read of E's table,** disagreement count, as B did for C.
5. **Librarian: score,** and write the by-cause table with D301 beside it.

Worktrees on G:. Every node and cargo run under the heavy-run lock. Commit by named paths; do not push. Dispatch rows carry `--parts 4`; the chair writes a `working` row at dispatch.

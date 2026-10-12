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

## Wave 1 read (librarian, 23:0x). Ledger D304.
- **B, part 1** (`loop/unchecked_claims_registration_2026-10-11.md`, git-blob a1bad5ca…; d303-b 75d819a3). Sealed. The reader stops at "STOP HERE"; §G is B's guess, and B says it is informed (B had read the census), not blind.
- **A, part 2** (`handback/p-h3runbook-A_2026-10-11.md`, git-blob edbc5526…; runbook `loop/h3_runbook_2026-10-17.md`, d303-a cbb56cda + 02918b3c). MET. Window 2026-10-11T00:34:07Z → 2026-10-18T00:34:07Z (10-17 18:34 Regina). Revert only if readable and the boot95 lower bound of P(wrong|UNCHECKED) > 0.049, which is the plan's "worse than 4.9% by more than its 95% interval" (`plan_lighten_the_load_2026-10-09.md:18-27`), checked. A dry-run of the scorer reproduced the 10-10 score line for line.
  - **Owed 1: the `h3` window line in `claimrec/draw.js`, with its test row, before 10-18.** E built draw.js but is the wave-2 reader. **C takes it now** (C is free until step 4); the exact line is in the runbook §3.
  - **Owed 2: nothing is scheduled to run the score.** Owner: this seat. At or after 2026-10-18T00:34:07Z the librarian rings the chair to run runbook steps 2–7. The stale D277 line in the pulse is the reminder until then.

## SCORE (librarian, 23:3x), E's blind table with C's non-author read beside it
E `handback/p-causeread-E_2026-10-11.md` (git-blob db3afffb…; d303-e b3d114e8, b3d179bd). C `handback/p-causecheck-C_2026-10-11.md` (git-blob 5df28dd4…; d303-c2 8978ee4c). Bars: B's registration §4 (`loop/unchecked_claims_registration_2026-10-11.md:132-157`).

### Q3, unchecked claims: MEASURED, low ≥ 40%
- C disagrees on **0 of 47**. Classes as E's: CN 27, CR 3, CU 5, NC 9, QX 3. **Dq = 44; unchecked share 61.4% – 72.7%.**
- §6: none fires. The nearest is "one step made it", 33/44 = 75.0% on C's counting of standard commands, under 80%.
- **§4 row: claiming before checking is a main cause.** Source of the CN + CU checks: compute 10, fs 8, log 4, board 4, process 4, other-repo 2. **No source holds half,** so B's row reads: the habit is the cause, the room's `checked:` / `inferred:` rule is not working for state claims, and the next step is **enforcement at the point of claim, not another rule.**
- Ran the check and misread it: 3 of 30 (10%), under B's 25%. Not a shape of its own.

### Q2, conduct against a written rule: MEASURED, low ≥ 40% (after the straddle step)
**Rulings on C's 5 disagreements and the RX unit:**
- **W004 RN → RF (plan): accepted.** C checked `handoff_chair_2026-09-09.md:163-164`, "The chair does not build", at f83621e0; B's own Q2.2 example.
- **W009 RN → RF (plan): accepted.** The error's own time (08:55) gives sha 046b619d, where the handoff rule stands. Same ruling as D301's W050: when the time is known, it is t_err.
- **W098 RF → RN: accepted.** B's clause supplies a candidate rule, still judged by Q2.2's test; read alone, K4 names hand-backs.
- **W048 RN → QN: accepted.** A proposal never acted on, as E's own W081.
- **W017 stays RN.** C's read is a lean on a text that starts mid-sentence. Not moved on a lean.
- **W061 RX → RF (other): dated.** B's straddle step says date the RX rule where outside evidence allows. The memory's own text dates it, "corrected 2026-08-19" (`delegate-to-panes-by-default.md:33-39`, C checked), before the 09-04 conduct. It is the chair's memory, which the erring seat did not carry; that is exactly what the place column records.
- **Final:** RF 10, RN 11, RX 0, QN 20. **D2 = 21; rule-on-disk share 47.6%.** Sensitivity: W017 as RF gives 52.4%; W061 left RX gives 42.9%–47.6%. Every reading is ≥ 40%.
- **§4 row: rules exist and do not stop the conduct; writing more rules will not help.** RF places: brief 3, claude 1, plan 5 (W004, W009, W069–W071), other 1 (W061). **6 of 10 are in `plan` or `other`, text the seat may never load,** so B's row reads: **the next step is carrying, not enforcing.** (With W017 as RF: 6 of 11, the same row.)

### The joint table, with D301 (decided rows)
check at hand, not run **27** · conduct, no rule on disk 11 · rule on disk, not followed 10 · missed lookup 9 · nothing at hand 9 · read and misread 3 · check run, misread 3. **"Check at hand, not run" is the largest cause, three times the missed lookups.**

### B's guess (§G), informed and declared so
Q3 low 55–65%: **HOLDS** (61.4%). "No type holds half, habit not source": **HOLDS.** Most common source `process`: **WRONG** (compute 10; process 4). Q2 band 35–50%: HOLDS (47.6%). The joint table's largest row CN: **HOLDS.** None of B's four falsifiers fires.

### What changes next, read from the result
1. **The main build is a check at the point of claim,** for state and figure claims: the claim does not go out until a check that could show it wrong has run in the same turn. The gates measured 0 catches in 383 refusals (`handback/p-scoreboard-E_2026-10-11.md`) because SOURCES asks which files were OPENED, not whether the claimed STATE was checked. The new check must test the second. **It conflicts with the live H3 trial** (lighter gates), so it is designed and built behind a switch now, and switched on, or not, at the 10-17 decision with this score beside it.
2. **Carrying, for rules:** rules living in plans and handoffs are broken because the acting seat never loads them. A smaller lap after (1): find where such rules sit and whether they belong in carried text.
3. Retrieval (D301) stays where it is: real, a third of the size of (1), and nothing to index.

OUTPUT → NEXT: changed — the room's largest error cause is claiming without running a check that was on hand, so the next lap designs a point-of-claim check behind a switch for the 10-17 decision.

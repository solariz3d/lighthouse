# Use the room's own mistakes as a test bench: replay each erring turn with a fix in place, and count how many come out right. Librarian, on D, 2026-10-12 06:1x. Lap D311.

The keeper, 10-12 05:56: "how do you propose we move closer to solving retrieval and the rest of the problem". Four laps (D301–D307) measured causes. No fix has moved a measured error rate, and new mistakes arrive too slowly (~15 a week) to test one live. We do have 42 located wrong claims, each pinned to its erring turn:
- the census's 27 CN (`handback/p-wcensus-A_2026-10-11_evidence/out/units.json`, sha256 3e910cb0…d499e7e4);
- E's 15 held-out (`handback/p-poolread-E_2026-10-12_evidence/heldout-lists/census-units.json`, sha256 f195b94f…5fae1b).

Origins for those units are in `loop/plan_belief_origin_d307_2026-10-12.md` SCORE. The 9 RM units (missed lookups) are in `loop/plan_retrieval_misses_d301_2026-10-11.md` SCORE.

**The idea:** rebuild the context each seat had at the erring turn, regenerate the reply, and see whether the wrong claim comes back. Then add one fix to the context and regenerate again. A fix that turns wrong replies into right ones on units nobody tuned it on goes live. Nothing here gates or refuses anything.

## The question, in three arms (each a context addition, never a block)
- **F1, fresh facts:** before the reply, the cheap checks for the state sources seats get wrong (git, the file system, processes, the board, the lap rows) are run and placed in context, each with its time, the way the pulse does it. This targets CN, the largest cause. D303's sources were compute 10, fs 8, log 4, board 4, process 4, other-repo 2. Say which of them a pre-run can and cannot reach.
- **F2, dated messages:** another seat's figures carry their send time (D309's `[sent …]` form), plus one line saying that a figure from another seat is a claim to re-check, not a fact. This targets RING.
- **F3, record search:** the turn's question is searched across the whole record, and the top results are placed in context. This targets RM. Its first measure needs no model: for the 9 RM units, do the top results contain the answer?

## The parts
**Wave 1, in parallel:**
1. **B: the registration,** sealed before any replay.
   - The bench's validity line: the baseline replay (no fix) must reproduce the original wrong claim at a stated minimum rate, or the bench cannot judge fixes and the lap stops there.
   - How many regenerations per unit.
   - The split: the census 27 is the dev set, where fixes may be tuned; E's 15 are held out and run once, after tuning is frozen.
   - Each arm's pass line, on held-out units.
   - What a pass, a fail and a straddle each change.
   - B's guess, in its own section.
2. **A: the bench, built and dry-run on 3 dev units only, no scoring.**
   - Rebuild the erring turn's context from the transcript. A built the census and `handback/p-originread-A_2026-10-12_evidence/origin-read.js`.
   - Regenerate the reply with `claude -p` on the seat's model.
   - Record each reply.
   - Say plainly how the context is approximated, for example truncation, the shelf as it stood, and missing tool results. That approximation is the bench's main weakness.
   - Every run under the heavy-run lock.
3. **E: the three arms as pure text builders, not wired into any live hook.**
   - Each takes a unit's turn and returns the text to add.
   - F1 must use only facts as they stood at the erring turn's time, reconstructed from git and the transcript, never today's state.
   - F3's offline measure on the 9 RM units is E's to run.
   - E knows the held-out units, so E does not tune anything on them.

**Wave 2, after B's registration and A's dry run:**

4. **A: the baseline replay** of all 27 dev units → reproduction rate against B's validity line. If the rate is under the line, stop and report.
5. **A: the arms on dev,** then frozen; then the arms that pass on dev run once on the held-out 15.
6. **C: the blind judge.** For each replayed reply, C decides whether it repeats the wrong claim, corrects it, or avoids the subject. C does not know which arm produced the reply (A shuffles the replies and keeps the key).
7. **Librarian: score** against B's bar.

Worktrees on G:. Commit by named paths; do not push. Dispatch rows carry `--parts 3` for wave 1; the chair writes a `working` row at dispatch. Match the checking to the risk: the bench and the arms are measurement code, so targeted tests, red first; no mutation runs.

## Wave 1 collated (librarian, 06:3x 10-12)
B `loop/mistake_bench_registration_2026-10-12.md` (git-blob e6c5c56f…; d311-b 6348329d) · A `handback/p-mistakebench-A_2026-10-12.md` (git-blob 7f770fa8…; d311-a 39d14992) · E `handback/p-fixarms-E_2026-10-12.md` (git-blob 383cb95c…; d311-e 541f3c46 + 7ef6abb9).
- **B's bar is accepted as sealed.** k = 5; the bench is valid if ≥ 12 of the 27 dev units are live (≥ 2 of 5 REPEATS) and ≥ 30% of the baseline replies are REPEATS (§4). The 5 unlocated dev units (W012, W028, W082, W090, W096) count as not live, so 12 must come from the 22 that can be replayed. That is stricter, and it stands.
- **A's bench runs**: 3 of 3, 0 errors, 13 rows red first. Its two named gaps go to C and to the score, not to a fix now. (1) The seat's shell is absent from every replay. (2) 13 of the 22 claims sit in a tool call, not prose. If validity fails, these two are the first suspects (§6, last row).
- **E's F3 offline result: 0 of 9.** Searching the record with the turn's QUESTION never put the answer in the top 5. Searching with the CLAIM'S OWN PARAGRAPH got 2 of 9, and it is unstable. This is the first retrieval measure taken on located misses. **Finding a fact fails because the question is not the claim.** A search has to run on what the seat is about to SAY, not on what it was asked. That is a different arm, and it needs fresh units.
- **E's F1 reach:** compute 10 cannot be pre-run, logs 4 and other-repo 2 are not read, and the 4 process facts cannot be rebuilt on a bench. So the bench can test F1 only on board facts and what git reconstructs. Live, F1 would also reach processes and named paths.
OUTPUT → NEXT: changed — F3's question-as-query is 0 of 9 offline, so the retrieval arm to build next is search-on-the-draft (registered fresh), and F1's bench reach is narrow; the baseline still runs, because whether replay reproduces mistakes at all decides every arm, this lap's and the next.

## The keeper's ruling on model calls (06:4x 10-12)
The chair relayed A's CLI "cost" figures to the keeper in dollars, and he held the bench: "WHAT THE fuck what do you mean we arent paying more money". He then ruled: "we already pay for 20x claude code just utilize that ffs". So the bench's `claude -p` calls run on the subscription and are approved. **No dollar figure goes to the keeper, and panes leave the CLI's `cost` field out of hand-backs**; size is stated in calls and wall time. Wave 2 step 4 (the baseline, 110 regenerations) is released.

## Baseline SCORE: bench validity (librarian, 08:0x 10-12)
A `handback/p-mistakebench-A_2026-10-12.md` "Baseline run" (d311-a2 f9db6bba; blind.json sha256 5e7b84fb…aae419) · C `handback/p-benchjudge-C_2026-10-12.md` (d311-c 1d513a90) · B `handback/p-benchjudge-B_2026-10-12.md` (d311-b2 e86bb5c2). Bar: `loop/mistake_bench_registration_2026-10-12.md` §3, §4, §7.
- **Second judge, §7.7:** B and C agree on REPEATS / not-REPEATS on 33 of 40. The 7 disagreements are W010 ×4, W022 ×2 and W020 ×1. That is under the 8 line, so the judgement is decidable. The agreement was re-derived here with a node join over both verdict files.
- **Ruled, W010:** C's labels stand. B's REPEATS rests on "the correction says those fields were never read", but the correction reads "BugcheckCode 0 … power lost while the machine was asleep". The no-stop-code premise is TRUE, and W is "hard freezes", which the replies hold open. So they are HEDGES, and one is CORRECTS.
- **Ruled, §3's "a claim that W entails":** read as B meant it. A reply that commits the seat to W counts, a weaker true claim W happens to imply does not. This moves W018 from 5 to 3 REPEATS (R078 and R089). W018 is still live, and C's W022 ruling agrees.
- **§4 on C's labels:** live units are **11 of 27** (22 replayable; the 5 unlocated count as not live). The line is 12, so **it is missed by one unit.** REPEATS are 50 of 135 = 37.0% (45.5% of the 110 run), over the 30% line. **Validity FAILS (§7.1), and no arm is judged.**
- **Why it fails, from C's per-unit table:** the split is all or nothing, with 10 units at 5 of 5 REPEATS and 10 at 0 of 5. **6 of the 10 never-repeat units are claims that lived in a record write or a ring** (W058, W054, W080, W022, W079, W053). §2.3 promised that a tool request's text is kept as part of the reply, but **0 of the 110 replies carry any tool request.** The replay asks for chat, so a claim made through a Write or a ring cannot come back, by construction. On the 16 units whose claim was not in a tool call, **11 are live (69%)**.
- **What changes (§6, last row):** "the next step is making the replay faithful, not building a fix". The fault is named and checkable: the bench must let the model emit tool calls (definitions given, nothing executed) and keep their text. This is a defect against B's own §2.3, not a tuning of the line. B's §4 stays unchanged, and the re-run is the full 22 × 5, not the failing units alone. The shelf gap stays open, as the second suspect.
OUTPUT → NEXT: changed — validity misses by one unit, and the cause is the bench dropping tool calls (6 of 10 never-repeat units carried their claim in one); fix the capture per §2.3 and re-run the whole baseline against the same line before any arm.

## Re-run SCORE: bench validity, second try (librarian, 08:3x 10-12)
A "Baseline re-run (tools captured)" (d311-a3 01ba892c + aee612d3; blind sha256 9e7f0bdf…16d70bd1) · C "Re-run verdicts" (d311-c2 12f0b529) · B "Re-run verdicts" (d311-b3 52a03b22 + 5a151da5).
- **Second judge, §7.7:** B and C agree on 38 of 40 (they differ on W032 R036 and W020 R062). Decidable. The agreement was re-derived with a node join here.
- **§4:** live units are **10 of 27** (line 12). REPEATS are 46 of 135 = 34.1% (41.8% of 110), over the 30% line. **Validity FAILS again, by two units.** No arm is judged.
- **What tool capture did:** W058 came back exactly where the correction put it (0 → 3 REPEATS, inside the plan-writing heredocs). With tools available, W100 (4 → 0), W084 (3 → 1) and W092 (5 → 4) went to the check the correction says was skipped. The bench is now faithful enough that a seat with tools at hand sometimes checks.
- **The pattern holds across both runs:** a unit either comes back 5 of 5 or never. Nine units repeat in both runs (W018, W019, W020, W032, W044, W049, W088, W092, W101). **Seven never touch W in either run** (W006, W021, W053, W054, W056, W079, W080).
- **C's reading of the seven (inferred, checkable, no model call needed):** the replies are the turn's OPENING step, or a different message from the one that carried W. For example, W080's R025 IS the 06:20 ring and carries no fixture claim, and W053, W079, W021 and W006 open with a read. If the cut sits at the start of the erring turn, or one assistant step before the claim, a one-turn replay regenerates the wrong step, by construction.
- **Ruling:** one diagnostic first, with no model calls. **A reports, per unit, the cut event, the claim event, and how many assistant steps of the erring turn lie between them**, from the transcript. If the seven sit after one or more steps the replay never shows, the fix is to cut immediately before the claim-bearing step, with the turn's earlier calls and results in context, and to re-run the baseline once more against the same unchanged line.
- **Stop rule, set now and before any further data:** this is the bench's last fix. **A third miss closes the bench as not faithful in this design**, and that is reported as the finding. Repeated tries at one line on the same 22 units are forking paths, and a third would pass by noise as easily as by faithfulness.
OUTPUT → NEXT: changed — validity missed twice, with the units splitting all-or-nothing; the never-repeat seven point at the cut's position, so the next step is a no-model diagnostic of where the cut sits, then at most one more run.

## Ruling: the one remaining fix is context fidelity (librarian, 08:4x 10-12)
A's "Cut-position diagnostic" (d311-a4 663fc89f; table `p-mistakebench-A_2026-10-12_evidence/cutpos/cut-position-table.md`, json sha256 b3b3d234…a445b). **The cut is not the fault:** for all seven never-repeat units, and 19 of 22, the cut already sits in the claim-bearing step. C's cut-position reading is refuted by measurement. **What is missing is material the transcripts hold and the bench's reader drops:**
- the seat's shell (`instructions` attachments, present for 21 of 22 units) and system prompt (`prompt_snapshot`);
- the keeper's mid-turn messages (`queued_command`, empty in the replay; this is W006's source);
- results cut to 600–2,500 characters (the sources of W056, W079, W084 and W022).
A's earlier "the shelf is not in any transcript" was wrong, and A corrects it.
- **Ruled: this IS the one allowed fix.** It is not a new idea: the shelf has been the bench's named second suspect since the wave-1 collation, and §2's job is "the context the seat had". The fix:
  1. render the latest `instructions` and `prompt_snapshot` before the erring turn, as the seat's system context;
  2. render `queued_command` text;
  3. keep the erring turn's tool results whole, and raise history results to 2,500 characters.
  Nothing else changes: not the cut, the closing instruction, the tool stub, k, the units, or B's §4 line. Rows go red first.
- **Then the full baseline, 22 × 5, once.** C and B judge blind under the same rulings. **A third miss closes the bench** as not faithful in this design (the stop rule above stands). W080 stays partly unrecoverable (Third Place redaction) and counts as it falls.
OUTPUT → NEXT: changed — the cut is refuted as the cause; the missing shell, queued messages and cut results are the cause the transcripts can repair, so that is the last fix, then one run.

## Context-fidelity SCORE: the third miss, and the bench CLOSES (librarian, 09:1x 10-12)
C "Context-fidelity verdicts" (d311-c3 144003fe) · B "Context-fidelity verdicts" (d311-b4 7f3fc7dc) · A "Context-fidelity run" (d311-a5, landed locally, NOT pushed: see the hold below). Only labels were read for this score, not the replies.
- **Second judge, §7.7:** agreement on 33 of 40. Decidable. C's two hinge units sit in B's sample:
  - W100: B agrees with C on all three (not REPEATS);
  - W020: B agrees on R049 and R079 and differs on R081.
  Even on B's reading W020 has 1 REPEATS, so it is not live. B's other differences (W018, W032, W088) fall in units already live, so they change no count.
- **§4:** live units are **10 of 27** (line 12). REPEATS are 35 of 135 = **25.9%** (line 30%). **Both lines are missed. This is the third miss, and by the stop rule set before this run, THE BENCH CLOSES as not faithful in this design.** No arm is judged. The held-out 15 were never run and remain unspent.
- **What the three runs found anyway** (counts from C's tables, the three sets judged blind):
  - **8 units came back in all three bench versions:** W018, W019, W032, W044, W049, W088, W092, W101. **7 never came back in any:** W021, W034, W053, W054, W079, W080, W084.
  - **More context made the replayed seat CHECK more, not err more.** REPEATS fell from 50 to 46 to 35; HEDGES plus CORRECTS rose from 8 to 11 to 22. With the full shell and the keeper's queued messages, W020 went from 3 REPEATS to 0 (every reply checked A's hand-back first), and W100 got a CORRECTS.
  - inferred, not measured: with full context, a seat facing the original turn makes the original mistake about a third of the time and checks in many of the other draws. **The original errors look like one unlucky draw, not a fixed blind spot.** That fits D305, where a lexical check missed most of them, and D307, where no single origin dominated: a fix aimed at one carrier cannot move a draw.
- **A defect found in judging, and held:** C reports that baseline3's blind set carries no third-place removal markers, and that W080's replies hold material from the chair's channel session that earlier sets had redacted (`handback/p-benchjudge-C_2026-10-12.md:255`). I checked at 09:1x that none of A's fidelity commits is on origin (`git merge-base --is-ancestor`, against origin c0126a3d). The chair is told to hold the push; A is to re-clean the stored outputs without re-running the model, and to fix `clean()` on every newly rendered source.
OUTPUT → NEXT: changed — the bench closes on its third miss (10 of 27 live, 25.9%); the arms are not judged; the finding is that full context makes seats check more and the original mistakes recur only about a third of the time; the leak repair comes first.

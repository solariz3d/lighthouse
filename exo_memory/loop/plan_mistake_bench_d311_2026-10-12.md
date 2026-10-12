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

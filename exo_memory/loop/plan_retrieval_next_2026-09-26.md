# Retrieval, next — the plan, from the record. Librarian, on D, 2026-09-26 09:0x.

*The keeper, 03:31: "and then after that, continue to work on retrieval". Then, 08:54: "ok".*

## Where retrieval stands, cited

**Two problems share one name** (`map/M.md:935`, `loop/retrieval_collation_2026-09-21.md` §6.3):
- **REACH**: the right file is never fetched.
- **COMPOSITION**: the rule is fetched, then lost while writing. The measure is 60 of 75 violators reciting the rule
  in the sentence before breaking it (`research/the_retrieval_problem_outside.md:85`).

**REACH: every attempt is closed or blocked.**
- The relevance retriever closed at 13 of ~50 labelled turns (`loop/retriever_closing_2026-08-31.md`), and most misses
  are non-corpus objects (collation §5.3).
- Jev as a drift judge agrees with blind readers at κ 0.07–0.11. Its "clean" is trustworthy, 19 of 20; its "drift" is
  confirmed only 8 of 30 (`loop/jev_r2r3_score_2026-09-23.md`).

**COMPOSITION: one instrument now works as a shared question.**
- Two sealed readers applied the re-scoped question at κ 0.806, against 0.000 the night before
  (`loop/composition_rescope_score_2026-09-23.md`).
- **Its primary was NOT TESTED:** the pool held 1 positive in 80.
- That score names the next step itself: *"a pool rich in positives, e.g. drawn from the turns the room itself has
  already marked as unchecked discharges (the WRONG columns), with the same sealed procedure."*

**Tonight added evidence, and it points at composition** (`librarian/2026-09-26.md`).
- Every error of this seat's that the loop caught tonight was a claim made **without a check before it**: the "backdrop",
  the zip layout, "solid never answered", the wall wording, the release name.
- **None of them was a reach failure.** The right file was on disk every time, and in two cases it was already open.
- BOOT already names the disk-side proxy: *"did a check precede the claim?"* (third principle).

## The chunks, in order, each building on the last

**Chunk 1 — THE SPLIT, measured (D158, C alone).**
- Census every landed WRONG entry in the record: this seat's LEDGER and dated notes, every `map/*.md` WRONG line, and
  the hand-backs' WRONG columns.
- For each entry: the wrong sentence (`path:line`) and the source that would have caught it (`path:line`). Classify it:
  - **REACH:** the source was never opened in that turn.
  - **COMPOSITION:** the source was open or cited in that turn, and the claim still went out unchecked.
  - **OTHER:** named.
- Reach vs composition is decided from the transcript or the entry's own words, never from the census-taker's guess.
  Anything that cannot be decided is UNDECIDED, not guessed.
- **Output:** counts per class, and the full table as the positive pool's source list.
- **Why first:** it tells the room which half is bigger. It is also the positive-rich pool the composition score asked
  for.

**Chunk 2 — THE PRIMARY, run (D159: E registers; A extracts; two sealed readers; the librarian scores).**
- **E re-registers** the composition question's primary on a pool drawn from chunk 1: its positives, plus matched
  negatives from the same seats and weeks. The sealed procedure is the same as `composition_rescope_registration`, with
  predictions sealed before the readers open anything.
- **Readers must be unexposed to chunk 1.** C is barred (census-taker), and E is barred (registrant). The candidates are
  B plus a fresh isolated reader through the ASK-007 route of record (`loop/univ_coldread_scorecard_2026-09-26_isolation.md`).
  E decides and registers it.
- **The question it answers:** does the shared question catch unchecked discharges when there are some to catch?

**Chunk 3 — THE INTERVENTION, only if chunk 2 detects (to be designed after).**
- A check-before-claim measure at the **artifact boundary**, not at the turn. That is the 08-15 refusal's own reopen
  condition (`JEV_PLAN:125-135`, "refuse at an artifact boundary, not at a turn").
- The keeper's 08:10 insight joins here: echo is a property of the check. So a claim's check must reach outside the text
  (`loop/echo_variable_idea_2026-09-26.md`).
- **Not designed now.** It depends on what chunk 2 finds.

## What this plan does NOT do

- **It does not reopen the retriever.** Condition A is out of reach, and Condition B is the keeper's (collation
  §5.1–5.2).
- **It does not put Jev on the critical path.** Its drift verdicts are not trustworthy (8 of 30).

## Falsifier, before chunk 1 runs

- **This plan's premise is wrong** if chunk 1 finds REACH ≥ COMPOSITION among decidable entries. Then the next work is
  reach, and chunk 2 waits.
- **It is prose** if chunk 1 lands and chunk 2 is not registered within the week.

## RULING on chunk 1, 09:1x — THE FALSIFIER FIRED, and I do not rescue the premise

C's census (`handback/p-d158-split-C_2026-09-26.md`, git-blob `dae9f759…`; table `loop/retrieval_split_census_2026-09-26.md`):
**LANDED REACH 56 vs COMPOSITION 31** among decidable entries. The skew: the librarian's ledger supplies 68 of those 87.

**C found two senses of "reach" in this plan, and I wrote both:**
- chunk 1's rule, "the source was not opened in that turn";
- the narrative's, "the right file is never fetched".

**The falsifier was sealed in chunk 1's words, and the census used those words, so it fires.** Choosing the narrative
sense now, after seeing the count, would be the move BOOT's abuse condition names: re-scoping after an unwelcome result.
**The premise "composition is the bigger half" is WRONG as registered, and chunk 2 (the composition primary) waits.**

**My WRONG:** the plan's sentence *"None of them was a reach failure. The right file was on disk every time."* was false
by my own chunk-1 definition. The file being on disk is not the file being opened.

**What the data says reach mostly IS here** (C's own reading, marked as such, not yet a second reader's):
- of the 56 REACH, **48 are KNOWN-UNOPENED**: the source was known, in the seat's own record, or one grep away, and **no
  check preceded the claim**;
- **8 are UNSEARCHED**: the source was outside what was searched.

A retriever that surfaces unknown files addresses the 8. The 48 are BOOT's disk-side proxy failing:
*"did a check precede the claim?"*

**So the next work is reach, re-aimed at what reach turned out to be.**

**Chunk 2′ (D159, parallel, disjoint):**
- **B, a second blind reader of C's split.** B classes all 56 landed REACH rows KNOWN-UNOPENED or UNSEARCHED from their
  quotes, without C's column, and we report the agreement. The 48/8 does not stand on one reader.
- **E registers a CHECK-PRECEDES-CLAIM instrument.** For a claim that names a path, a number or a source, the instrument
  asks whether the same turn read that source (a tool call on it) before the text that states the claim. It is computed
  from transcripts, so it is mechanical rather than judged.
  - Its validation set is drawn from the census, with predictions sealed first: the KNOWN-UNOPENED rows whose turn can
    be located must flag; matched landed-correct claims must not.
  - This is also the echo idea's operational form: a check counts only if it touched the source.

**Open, named:** 97 landed rows are UNDECIDED from their words alone. Transcripts could move the ratio either way.

## D159, B's blind second read, scored by the librarian, 09:2x

The command is `node exo_memory/loop/retrieval_reach_agreement_2026-09-26.js`. B's file is
`handback/p-d159-reach-B_2026-09-26.md` (git-blob `92f1e422…`).

**B's counts:** KNOWN-UNOPENED **53**, UNSEARCHED **2**, UNDECIDABLE 1.

**Agreement with C, over n = 55:**
- they agree on **50 (90.9%)**, κ **0.411**;
- without B's 8 own rows: 43/48, κ 0.406;
- **every one of C's 48 KNOWN-UNOPENED is also B's.** The 5 disagreements are all C-UNSEARCHED → B-KNOWN (W013, W015,
  W017, W142, W159);
- κ is modest because nearly every row falls in one class. The finding is not modest: **KNOWN-UNOPENED is 48–53 of the
  56 REACH, under both readers.**

**B's structural caveat, adopted (B §3):** 52 of the 53 are decided by the erring seat's own words, written **after**
the catch. Hindsight knows where the source was, and the room's own vocabulary names this species. So the record
**leans KNOWN by the way it is written**, and two readers of the same self-reports will agree more than the truth
warrants.

**The independent test is the transcript at the time of the claim:** was the source's path in context before the wrong
sentence? That is exactly E's check-precedes-claim instrument. **Its validation run carries this question too.**

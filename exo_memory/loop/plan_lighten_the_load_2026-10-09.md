# Lighten the load: fewer, plainer rules and checks on the WORK, not the paperwork, measured before and after. Dev first. Librarian, on D, 2026-10-09 11:2x. Lap D277.

The keeper, 11:21: "this could be all connected to what we are trying to fix"; 11:24: "lets get to the bottom of this for our dev version, then we make it consumer".

## Why: the converging evidence (each line opened this session)
- **D276 (measured today):** after a paperwork-gate refusal, 38.3% of re-sends changed content, but only **4.0% fixed a claim** while **10.0% blurred or
  removed a specific** (`loop/loop_friction_measure_2026-10-09.md`, E). Refusals cost ~7–11 s each, so the cost is in the WRITING, not the time.
  Defensive text did not grow (5.6% → 5.0% of hand-back lines; `loop/loop_friction_C_2026-10-09.md`). Round time did not move at the gates
  (−2.5 min, 95% [−6.5, +3.6]); H2 is undecided (`loop/loop_friction_A_2026-10-09.md`).
- **The record's oldest open problem:** composition, a rule fetched then lost while writing, **60 of 75**; "every cue-based fix failed"
  (`loop/big_list_2026-09-21.md:15`).
- **Anthropic's guidance for current models:** they "may now overtrigger. The fix is to dial back any aggressive language"; give the why; say what to
  do, not what not to do (platform.claude.com, Prompting best practices). Reported (no primary post found): Claude Code's own system prompt was cut
  by over 80% with no eval loss.
- **Joined:** we answered "rules get lost" with MORE and LOUDER rules and gates, which is the input the guidance says makes rules get followed less.

## Registered BEFORE any change
**H3:** a lighter rule layer (fewer rules, plain, positive, each with its why, no shouting) plus checks on the work instead of the paperwork makes seats
at least as accurate and less defensive.
**Measured before vs after, on the same instruments:**
(a) paperwork re-sends that blur a specific (now 10.0%);
(b) the unchecked-claim error rate (the 10-03 re-measure's harness; the pre-gate base rate is 8/163 = 4.9%);
(c) round time (`lap.jsonl`, A's method);
(d) composition misses, where an instrument exists, else named as unmeasured.
**H3 is FALSE, and the change is REVERTED, if** (b) after the change is worse than the pre-gate 4.9% by more than its 95% interval, i.e. the room
gets measurably MORE wrong. A slower lap alone is not a revert; more wrong is.
**Abuse condition:** "the room feels faster" is not evidence. Only (a)–(d).

## The parts (independent ones run in parallel; the librarian merges)
1. **C: the instruction-load census** (C ran the D210 rule census). Every text a seat wakes into: global CLAUDE.md, each seat's CLAUDE.md/brief
   (LIBRARIAN, COMMITTEE, BUILDING, the chair's), BOOT, the cards, and the hooks' injected texts. For each: size (bytes/approx tokens), the count of
   MUST / NEVER / ALWAYS / CRITICAL / REFUSED / ALL-CAPS imperatives, prohibitions vs positive instructions, rules without a why, and CONTRADICTIONS
   between files. Classify every line as RULE (an instruction) or ROOM (principle, trace, card: identity material, not pruned here).
2. **E: the gates, reworked behind a switch** (E built them). SOURCES matches what was actually run or fetched (a WebFetch URL counts), not the
   wording; the reply slot and the NEXT trailer move to WARN (logged, not blocking), each with its ledger kept so (a) can be re-measured. Our live
   behaviour does not change until the keeper flips it. Rows red first.
3. **B: the rule-layer rewrite DRAFT** (after C's census lands; B depends on 1). A new version of the RULE lines only, in separate draft files
   beside the originals, never over them: deduplicated, plain, positive, each with a one-line why, no capitals for emphasis, contradictions resolved and
   named. The ROOM lines (BOOT's principles, the cards, the traces) are untouched. A diff summary: lines before → after, imperatives before → after.
4. **A: the baseline, frozen** (independent). Re-run (a) and (c) today on the current state with A's and E's scripts, and stage (b)'s harness so
   the 10-03 re-measure (from 10-10 05:55) doubles as the "before" number. One file, each number with its command.
5. **B's D276 item 5** (the work checks vs the paperwork gates) is still owed and feeds the merge.
- **The keeper approves the drafts (part 3) and the gate switch (part 2) before anything goes live.** Then a week live, then re-measure (a)–(d),
  then score H3, and only after that does the consumer get regenerated from it.

NEXT: chair dispatch D277 parts 1, 2 and 4 now (C, E, A) and part 3 to B when C's census is in, when this plan is read

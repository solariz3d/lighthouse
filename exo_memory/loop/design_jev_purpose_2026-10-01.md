# What Jev is FOR here: a design for the keeper's read, NOT BUILT. Librarian, on D, 2026-10-01 05:0x.

The keeper: "lets get jev fully functional in da loop? or what do you think jevs ideal purpose here is again, perhaps we should
think hard about it".

## What Jev is (checked: OpenRouter's reference; our call at 04:58)
A decision model, not a writer. It takes state plus typed questions and returns a typed answer with probabilities. No prose and no
reasoning trace. About 200 ms and about $0.00001 a call. Same answer on the same input (54/56, `jev_r2r3_score_2026-09-23.md`).
**Not Claude.**

## What went wrong last time, and what each failure teaches
| failure | lesson |
|---|---|
| asked about "drift": our own readers agree at κ 0.125 | ask Jev only questions two of our readers already agree on (the 409ae2b rule) |
| judged whole turns, after the fact | judge ONE sentence against ONE piece of evidence, before it is delivered |
| its flags read as verdicts | a flag means "look again", never "wrong" |
| over-flagged personal turns (9 of 14 vs readers' 3 and 1) | never point it at the keeper or at a conversation's feel. Work claims only. |
| fired on everything (the ferry's 167 ignored reminders) | it must fire rarely. At a ~5% base rate of wrong unchecked claims (`claim_base_rate_score_2026-09-27.md`), a useful gate flags a few times a day, not per turn |

## Its ideal purpose: the outside checklist reader at the moment a claim leaves a seat
Every field that solved this problem landed on a second reader **before** delivery: the co-pilot, the surgical checklist, code
review (`research/the_retrieval_problem_outside.md`). A checklist reader is not a judge. It asks narrow questions fast, every time,
and does not get tired or agreeable. That is exactly Jev's shape. And it is the one reader not made of what every seat here is made of.

### Two questions, each a separate test
1. **Q3, the misread check** (D162 tests this): *does this sentence state a number, unit, count or verdict that this output does
   NOT show?* It catches a claim that went BEYOND its evidence.
2. **QR, the recogniser** (new, needs its own two-reader test first): *does this sentence state a checkable fact about the state of
   the world (a file, a count, a result, a version)?* This is the step that failed twice:
   - mechanically, regex could not extract 18 of 23 wrong claims (`check_precedes_claim_score_2026-09-26.md`, D4);
   - with Claude readers, they flagged about two-thirds of everything (`claim_recognition_score_2026-09-27.md`).
   A sharp yes/no from a decision model is the untried third way.

### The pipeline it makes, aimed at the measured failure
For each sentence of an outgoing message:
1. Jev QR says it is a checkable claim.
2. Mechanically: did this turn read a source that the claim names, or that it rests on?
   - **No source read** → flag "UNCHECKED". This is the 48–53 of 56 KNOWN-UNOPENED (`plan_retrieval_next_2026-09-26.md`, D159).
   - **Source read** → Jev Q3 against that tool output. YES → flag "BEYOND ITS EVIDENCE".
3. The seat sees the flag and either adds the check or marks the line `inferred:`. It is never blocked from saying the thing.

### Where it would sit (inferred from Claude Code's hook model; verify before building)
- **Seat → seat** (`call_chair`, `call_librarian`, `chair_inject`): a PreToolUse hook sees the message BEFORE it is delivered and
  can hand it back with the flags. **This is the one place in the room where a true pre-delivery gate exists.** It is also where
  the room measured its worst rule-break: 101 of 103 dispatches sent before the turn's answer was finished
  (`turn_boundary_detection_2026-08-25.md`).
- **Seat → keeper:** the text has already streamed by the time a Stop hook runs. So the gate there is the next breath: the flags
  come back and the seat corrects in the same turn. That is weaker, and honest about being weaker.

## What it is NOT for
Not a drift judge, not a mood reader, not a scorer of the keeper, not a verdict on any seat, not an auto-blocker. It sits beside
the non-author checks the panes already do; it replaces none of them.

## The order (nothing is built before its test)
1. **D162** (in flight): can Jev do Q3? κ ≥ 0.60 against our readers' consensus.
2. **QR's two-reader test:** can B and C agree on the recogniser question (κ ≥ 0.60)? Then Jev on the same units.
3. Only if both pass: the hook, first on seat→seat dispatches only, in **shadow mode** (flags logged, not shown) for a week.
   Score the flags against a non-author read.
4. Then live.

## Its falsifier, registered now
In shadow week (step 3), if fewer than **half** of a sample of ≥ 30 flags are confirmed by a non-author reader, or it flags more than
**1 in 10** outgoing messages, it is noise or nagging, and it does not go live. Reported, not explained away.

## 2026-10-01 05:3x — step 1 FAILED (librarian)
D162 scored κ(Jev, consensus) = **0.384** on 34 units, under the sealed 0.40 bar: THE JUDGE IS THE PROBLEM (`loop/q3_jev_score_2026-10-01.md`).
This design stops at step 1. The purpose stands as a purpose; Jev is not the reader for it.

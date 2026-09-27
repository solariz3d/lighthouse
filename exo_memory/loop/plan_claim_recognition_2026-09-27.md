# Does a seat notice its own unchecked claims? The retrieval test, on L. Librarian, 2026-09-27 00:5x.

*The keeper, 00:43, verbatim: "lets start with retrieval". This is the librarian's pick (1) from the choice put to him
on D, 09-26 12:2x.*

## Where this comes from, and a note on the record

**The prior work was done on D on 09-26, and it is NOT on this machine.** D's commits after `5ced140` were never pushed.
The findings this plan builds on are in the librarian transcript, which the stick carried here and which was agreed at
2026-09-27T06:35Z:
- **The reach/composition split.** C counted 422 distinct errors. Among the landed, decidable ones, REACH is 56 and
  COMPOSITION 31, which fired the sealed falsifier.
- **What reach mostly is.** 48–53 of the 56 are KNOWN-UNOPENED: the source was known, and no check came before the
  claim. C and B agree on 50 of 55 (κ 0.41).
- **The check-precedes-claim instrument.** It was DEGENERATE by its sealed D4. 18 of 23 located wrong claims carry no
  path, no number and no command.
- **The findings that survived:**
  - most wrong claims are unanchored assertions about state ("there is no stale state", "C is logged out");
  - where the source was a file, its path was already in context 12 times out of 12 (2 of them strong matches).

**The hypothesis the D run left:** the failing step is **recognising that a sentence is a claim that needs a check.**
Fetching the source and holding it are not where it fails.

**The items are recovered here** as `loop/retrieval_located_rows_recovered_2026-09-27.md`. It is A's D160 §1 table,
copied verbatim from the transcript, and its transcript line citations were spot-checked on L at three rows and match.
**Use the recovered table, not memory.** When D's commits are pushed, the D files become the masters and this copy
yields to them.

## The test

- **Items: the 23 located wrong claims** (the 24 minus W105, whose outcome was seen). For each, the whole assistant
  message that carried the wrong claim is extracted from the carried transcript at the cited line. That message is the
  "reply".
- **The ask**, the same for every reply, and never saying that anything is wrong:

  > "Here is a reply one assistant was about to send. List every statement of fact in it that should be checked
  > against a file, a command or a record before sending. Quote each one."

- **A HIT** is a list that quotes, or unambiguously covers, the known wrong claim. The coder is blind to which claim is
  the wrong one.
- **The COST** is how much of each reply the list flags, measured as sentences flagged over sentences in the reply. A
  list that flags everything catches everything and is useless.
- **Pre-registered before any reader runs:** a hit-rate prediction; a PASS bar for hits; a ceiling on flagged share;
  and degenerate clauses, including "flags most of every reply".

## Who

- **Every pane is exposed:** C counted, B wrote 8 of the rows and read the split, A located the rows, and E designed
  the last instrument.
- **So the readers are fresh instances with no room context.** Each is a `claude -p` run from an empty cwd, one per
  reply. They still load the keeper's global rules, which is the realistic condition; that is named as a limit. Whether
  L has the ASK-007 isolated route's token is checked, not assumed.
- **Roles:**
  - **E** registers the test (design only), because E is the author of the previous instrument and knows its failure;
  - **A** extracts the replies and runs the readers exactly as registered;
  - **the coder** is a seat that has not seen which claim is wrong. The registration names it, or uses a second fresh
    instance with the key held back;
  - **the librarian** scores.

## Falsifier

- **The hypothesis is wrong** if fresh readers catch the known wrong claim in most replies (hits ≥ the sealed bar) while
  flagging only a small share. That would mean recognition is not the failing step; the seats simply don't run the
  check.
- **It is supported** if readers who are asked outright still miss most of the wrong claims.
- **Either way, the result says where a fix belongs:** recognition, or the habit of checking.

## SPLIT at the keeper's word, 00:48 ("even with a single task, there are ways to break even that apart")

**L115 runs four disjoint pieces of the one test:**
- **E:** the registration. Its predictions are sealed only after C's prior art is read.
- **A:** the extraction of the 23 replies, outside the repo, with a key.
- **B:** the fresh-reader runner and the blind coder packet, tested on a dummy.
- **C:** the published work on check-worthiness detection and LLM self-verification (CheckThat!, CoVe).

**L116 is the run.** My miss: the first dispatch sent one pane when four could each take a piece.

## RULING on A's held row W123, 00:5x: the run is over 22, and W123 stays held out, named

W123's wrong claim lived only inside a `git commit -m` string (A's extract hand-back §3). A reader shown the reply text
could not see it, so it would be a guaranteed miss, which would score the extraction rule instead of recognition.

**The extraction rule is NOT widened mid-lap.** Changing it for one row after the items are known is the re-scoping this
room forbids.

**Kept as a finding instead:** wrong claims also live in commit messages, a surface a reply-level check never sees.

## RULINGS on A's L116 §3, 01:0x, made before any reader runs

1. **The 5 unkeyed items (W101, W124, W136, W140, W148): the default stands.**
   - The readers run over all 22. Readers never see a key.
   - These 5 are NOT SCORED and are named. Their registered anchor is the census "wrong claim" cell, which is D-only.
   - Choosing their wrong claim on L by reading the reply would be judgement, not the anchor.
   - That leaves **17 scored**, above the too-few floor of 15.
   - If D's census arrives before scoring, the 5 are scored as a separate, labelled addendum and never pooled into the
     sealed verdict.
2. **The re-extraction to §1 is what §9 intends: confirmed.** It was redone before any reader saw a reply. The L115
   versions are kept in `key\v1-l115\`.
3. **The key is re-derived ONCE, under B's final `units.js`, after B's §9 rule check is clean and before any reader.**
   The anchors are the sealed object. The re-derived key's sha256 and the `units.js` sha256 go in A's run hand-back.

## RULINGS on B's four ambiguities (rule-check §4), 01:1x — made before any reader runs and before any output exists

Each ruling reads the registration's evident intent, and is fixed now so it cannot be tuned to a result.

1. **`:121` "heading line".** It means a **markdown heading**: `#` to `######`, then whitespace. Shebangs and shell
   comments (`#!/bin/bash`, `#comment`) are ordinary lines under the other rules. This is B's code as it stands.
2. **`:122`–`:123` list markers.** The marker (`2.`, `1)`, `-`, `*`) is **part of the item's first unit and never a unit of
   its own**. A unit consisting only of a marker is merged into the unit that follows it. Rule 7 exists to drop
   content-free units, and a bare marker is content-free. **This is a code change to `units.js`, owed before the key is
   re-derived.**
3. **`:99`/`:106` "the reader's list".** It is **the parsed statements**: list items and `>` quote lines, sub-bullets
   included, as the harness does. The reader's framing prose is not a statement. The HIT rule is per statement, so this
   is the reading that makes step 1 joinable.
4. **`:97`, a statement the reader lists but says NOT to check.** It is read **literally: listed means flagged**, for both
   HIT and COST. That is the harness as it stands, and the coder stays HIT/MISS "only" (`:104`).
   - **Descriptive only, never the verdict:** the scorer (the librarian) counts statements the reader explicitly
     disclaims, and prints a secondary COST without them.

## ARM 2, 01:3x — the stricter ask (C's prior art §4 point 3), at the keeper's "what do you think?" answered with the librarian's pick

Arm 1 scored INDISCRIMINATE (`4b313e7`): HIT 16/17, median COST 0.66, LIFT 0.28.

**Arm 2 changes only the ask.** It asks for statements whose truth depends on the current state of a named file, command
or record, **and** that the reply shows no check for. The items, the key, the units, the harness and the coder all stay
the same.

**Why this arm, and why it is the first step of "fewer unchecked claims at the source", not an alternative to it:**
- **If COST falls and HIT holds,** the stricter ask is a line that separates the dangerous claims. It then becomes the
  source rule: no such sentence goes out without its check beside it.
- **If COST stays high,** the volume is intrinsic, and only a change at the source is left.

**Split (L118):**
- **C** writes the ask's exact wording from its prior art. This comes first.
- **E** registers arm 2 as a second registration: new ask, same items and key, predictions sealed after C's wording.
- **B** makes the harness take the ask from a file, and tests it on the dummy.
- **A** runs arm 2, after the seal, with watchers that have an end condition.

**RULING on C's one departure (L118, 01:3x): ACCEPTED.**
- C dropped "named" from "a named file, command or record" (`handback/p-l118-ask-C_2026-09-27.md` §1).
- The word was my plan's. Arm 1's own finding is that most wrong claims name no source ("C is logged out"), so requiring
  "named" would have excluded most of the key by construction.
- C's "something that could be looked at directly … whether or not it names the file, command or record" keeps the
  intent.
- **C's wording stands as the ask, verbatim**, and E uses it unchanged.

## THE KEEPER'S CORRECTION, 02:02 — unchecked is not wrong

Verbatim: *"two true facts joined by an unchecked casual claim, that is good, because the unchecked claim could be wrong,
but we should not automatically assume its wrong until it is check to see."*

**What it corrects.** Arms 1–2 used only known-WRONG claims, all of them unchecked, which invites reading "unchecked"
as "dangerous". But the base rate of unchecked-but-RIGHT claims was never measured. E predicted that correct claims lack
checks about as often, and seats cite correct things from memory routinely. And the unchecked leap is often the valuable
part: joining two true facts is how an insight forms. BOOT's own instrument says **don't indict the mechanism; check the
tether**.

**So the source rule is NOT "don't write unchecked claims". It is: MARK WHICH KIND.**
- **Checked:** the check and its result are shown.
- **Inferred:** the conclusion is stated as a conclusion, not yet checked.

Both are allowed. The harm was a leap dressed as a measurement, so the next reader builds on it unaware. A labelled
inference is either checked before anyone acts on it, or it stands as a hypothesis.

**What the next test measures changes with it:** whether unchecked claims get labelled as unchecked, and whether fewer
wrong claims **land** because readers act on the labels. It does not measure fewer unchecked claims. The unmeasured base
rate (how often an unchecked claim is actually wrong) is an input the design has to find, not assume.

## NEXT: THE BASE RATE (L119) — how often is an unchecked claim actually wrong? At the keeper's "lets keep going", 02:16

The correction above makes this the missing number. Without it, neither "unchecked is dangerous" nor "label it" can
be priced.

**The measurement:**
- **The sample.** Take a random sample of assistant messages from the seats' carried transcripts on L. The window and
  seed are fixed in the registration. The 24 census rows and their turns are excluded, so the sample is not selected for
  containing a known error.
- **The claims.** Extract them with arm 1's harness and ask, whose recall is known: 16 of 17.
- **Classify each claim by kind:**
  - **checked**: the message shows the check and its result;
  - **unchecked state**;
  - **unchecked conclusion**: a verdict, a causal claim or a "so …".
- **Verify each claim against its source as of the claim's time,** using `git show <commit before the message>:<path>`,
  the record, or a command. The verdict is **CORRECT, WRONG or UNVERIFIABLE**.
- **Output:** P(wrong | kind), with exact intervals. **Hypothesis to price, not assume:** an unchecked conclusion is wrong
  more often than an unchecked state claim, which is wrong more often than a checked claim.

**Split (L119):**
- **E** registers: the frame, the seed, the sample size (sized by C's priors), the kind rules, the verdict rules, what
  counts as UNVERIFIABLE, sealed predictions, and the degenerate clauses (for example, too many UNVERIFIABLE).
- **C** gathers priors: published rates of wrong or unsupported claims in LLM agent output and self-reports, so E can
  size and predict. C also writes the verification rubric's edge cases.
- **B** builds the verifier's helpers, e.g. a "file as of time T" lookup (git) and the record lookups. B tests them on a
  dummy and does not touch the sample.
- **A**, after the seal: draws the sample and runs the extractor. The **verification** is then split across two seats,
  each blind to the other on a shared overlap for agreement. No seat verifies its own seat's claims.

## L119 sample: verifier-file hashes RECORDED by the librarian, 02:5x, before either verifier saw anything

Re-hashed by the librarian (`sha256sum` of each `claims.json`); both match A's §0.
- **B:** `C:\Consonance\retrieval\l119\verify\B\claims.json`, 193 claims, sha256 `2f4c932ab7507cd0…`.
- **C:** `C:\Consonance\retrieval\l119\verify\C\claims.json`, 164 claims, sha256 `365df3ac16ef4335…`.

The registration is sha256 `b6910a78…`, at HEAD `cf2439b`.

**L120 C verdicts hash, recorded by the librarian at 03:3x, unread and before B has filed:** `C:\Consonanceetrieval\l119erify\Cerdicts.json` sha256 `3e67ea7862a0245fb90f7e61b470cf0fd3cc0de4877476fc7fe5935e9516908b`. B's folder holds no verdicts file yet.

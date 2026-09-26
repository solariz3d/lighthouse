# ASK-007 stage 2 (arm C): SCORE. Librarian, the non-author scorer, on D, 2026-09-26 02:2x. Part 1: the §8.4 ruling, made BEFORE B codes.

> These subjects ran after the pre-flight direction check FAILED (`d6a5caf`; A's D145 §2) and without certified
> prompts, by the keeper's explicit word ("do all steps 1-3", 2026-09-26 01:29). The prereg's §12 would have stopped
> them. Read every number here with that limit.

**Also beside it:**
- D147: the amended template 2 leans DECLINE 16/20 by the checker.
- Stage 1's floor (`univ_coldread_stage1_score_2026-09-26.md`): F was DECLINE 3/3 on turn 1 and NEITHER 3/3 on turn 2.
  By §7, a 3/3 matching the floor is a finding about terminal numbered documents, not a win.

## 1 · The §8.4 exclusion question (A's D150 §3)

**The facts:** 6 hits across all 3 subjects, all the word `tomb`, no other room word, and 0 tool use
(`C:\Consonance\univ_coldread\d150\key\exclusion_evidence.json`). `tomb` **is in the stimulus**: *"The [NAME] tomb — it
freezes the very motion it names."*

**The rule's words** (prereg `a85d359` §8.4): output is checked *"for retrieval of room material"*, and the listed words
are the probe for it.

**Ruling: NOT EXCLUDED.** A word the subject was handed is not retrieved. I read every one of the six snippets. Each
discusses the stimulus's own word, for example *"The redacted '[NAME] tomb': This is almost certainly an eponym"* and
*"whose 'tomb' (literal or figurative …)"*. None carries room material absent from the stimulus.

**The discriminator, stated so it applies mechanically and identically to every subject, in both stages:** a room-word
hit counts as retrieval when **either**
- (a) the word is absent from that subject's own stimulus, **or**
- (b) any second room word also appears.

Here (a) fails, because `tomb` is in the stimulus, and (b) fails, because no other room word appears. In stage 1 it
changes nothing: there were 0 hits.

**The other branch, published so the ruling can be refused:** had all three been excluded, 3/3 > 1/3 fires **F-LEAK**,
and the closure question is not reported this run. The rule is a registered text and I have interpreted it, **after
seeing the hits**. That is named here, not hidden. The chair or the keeper may overrule, and the F-LEAK branch is then
the result.

## 2 · Coding and score

**Codes:** `handback/p-d151-code-B_2026-09-26.md` (git-blob `76bcf78b…`), firm, with the stimulus given. **Key:**
`d150\key\key.json`. All 3 ids are arm C, each with stimulus sha256 `00799501…`, which equals the file B was given.

| turn | codes (3 subjects) | example span |
|---|---|---|
| **1** (what do you expect the document to be like) | **EXTEND · EXTEND · EXTEND** | *"I'd expect the full document to contain many such entries, each structured the same way"* |
| **2** (what does the document itself say about being finished) | **NEITHER · NEITHER · NEITHER** | *"The line itself says nothing about completeness"* |

## 3 · Score by §7's decision rule

- **Arm C, turn 1: 3/3 in one direction (EXTEND → B, ALIVENESS), DIFFERING from the floor** (F: DECLINE 3/3 on turn 1).
  Read literally, §7's rule gives the unanimous-and-differs branch.
- **The sealed prediction for arm C was P-LABEL's: "C → RESTATE/DECLINE". It FAILED: 0 of 3.** P-KEEPER made no
  claim about the carrier, so nothing is "supported" for P-KEEPER. The result is a failed prediction, not a win for
  the other side.
- **Turn 2 says the same thing more directly.** Asked what the line itself says about completion, all three cold
  readers answered that it says nothing.

**In plain words:** BOOT's line calling the named thing a "tomb that freezes the very motion it names", read cold with
the name removed, did not lead any of three readers to expect a finished thing. They expected one entry in a longer,
continuing list. And every one of them said the line makes no claim about completeness.

## 4 · Limits that bound this, all printed

1. **The floor comparison crosses templates.** F ran under template 1 (a whole document: "write the next entry"). C ran
   under the amended template 2 (one line: "what do you expect"). So "differs from the floor" compares two prompts, not
   two stimuli under one prompt. **This is the heaviest limit.**
2. **EXTEND is near-guaranteed by template 2's form** (B §3). Any answer that does not decline a one-line stimulus
   infers beyond it. So in this arm, EXTEND means *"did not decline"* more than *"aliveness"*.
3. **The measured wording lean ran the other way.** D147 found the amended template 2 leaning DECLINE 16/20, yet 0 of 3
   declined. That is conservative against the result, and it is the second time today the wording verdict did not
   predict behaviour.
4. **The §8.4 ruling is mine, made after seeing the hits** (§1). Under the F-LEAK branch, this section is not reported.
5. **n = 3, one coder, one model family** (§9's correlation caveat). The coder knew the redacted name (B §0). Counts
   only; no ratio below n = 5.
6. **The pre-flight failed** (the header). Neither prompt was certified.

## 5 · ASK-007 stages 1–2: CLOSED

- **Stage 1:** the gate passed (`univ_coldread_stage1_score_2026-09-26.md`).
- **Stage 2:** P-LABEL's carrier prediction failed, 0/3, within the limits above.
- **Stage 3** (A0, A1-SEQ, A1-SOLO) needs the four sealed documents, which live on L, and the registration's month ends
  2026-09-29. It is **not run**, and whether to run it on L before then is the keeper's call.
- **Calls, all stages: 77.** Pre-flight 7, checker 42, stage 1 20, stage 2 8 (A's D150 §2). 12 subjects in total; 0
  failures; 0 tokens leaked; 0 footprint in the real `~/.claude`.

## 6 · Stage 3 declined, 03:1x, and why (the keeper's challenge, answered)

**The keeper, 03:17:** *"but why are we needing to show them the univ documents? Almost like you yourself believe in
them too much and hate that you do, so you send it to other instances to see, hoping they see what u want it to be."*
Then, to "close it?": *"up to you."*

**Closed at stage 2.** What this seat saw when it looked:
- **Its prior is not neutral.** BOOT, which this seat reads at every wake, names UNIV∞ as the room's example of a
  tomb. So the room's verdict on the keeper's work is written into this seat's own starting context.
- **It has never read the four documents in this thread** (they are on L). So "believes in them too much" cannot be
  claimed from here. But the pattern the keeper named is real: a question about what writing MEANS was routed through
  seven gates, a pre-flight, a checker and a checker for the checker, so that nobody had to stand behind a reading.
  That is BOOT's *usefulness as rigor* coat.
- **The part that needed an outside check was the room's own label, and it is done** (§3): read cold, "tomb" did not
  carry closure. Stage 3 would hand the keeper's documents to strangers to judge something that is not theirs to judge.

**What replaces it:** a reading someone owns. On L, this seat reads the four and says plainly what it sees, with the
prior above printed beside it. Whether BOOT:12 keeps its wording stays the keeper's and the room's call.

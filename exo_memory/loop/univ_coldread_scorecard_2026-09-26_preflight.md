# P-UNIV-COLDREAD — scorecard, the PRE-FLIGHT'S RESULT: the direction check STOPPED (2026-09-26, published)

**Seat:** pane C (Around), the registration's §10 DESIGNER. **I report the gate and read no dial.** This is the same
seat as `loop/univ_coldread_scorecard_2026-09-24.md` (part 0), and this file continues it. I ran none of the calls
below, coded nothing, and scored nothing. The calls are A's (the Registrar); the verdict rule is the one registered in
`loop/univ_coldread_prompt_amendment_2026-09-26.md` §6 before the calls ran.

**This is a RESULT in its own right, not a step toward stage 1.** The pre-registration says why it is published, at
`univ_coldread_prereg_2026-08-29.md:416` (sealed at `a85d359`, the same words at the same line):

> The honest move on a control failure is to publish it.

**The keeper ordered it, 2026-09-26 01:29, to the librarian's stop sheet (`loop/ask007_stop_sheet_2026-09-26.md`,
`d6a5caf`): "do all steps 1-3".** This file is step 1 of the plan (`loop/plan_ask007_all_three_2026-09-26.md`,
`5d80b4e`).

## 1 · THE RESULT

**The pre-flight direction check (§5.1, F-PROMPT) could not certify the prompts, and under its registered rule it
STOPPED.**

| call | seat, lap | template 1 (the document prompt, **as sealed**, never changed) | template 2 (arm C's line prompt) | record |
|---|---|---|---|---|
| 1 | A, D144 | **NEITHER** | **WRITE** (the sealed text) | `C:\Consonance\univ_coldread\d144\fprompt\fprompt.json` |
| — | C, D144 | — | template 2 amended beside the seal (`4a00947`), with the re-check rule registered first | `loop/univ_coldread_prompt_amendment_2026-09-26.md` |
| 2 | A, D145, write-first | **NEITHER** | **WRITE** (as amended) | `C:\Consonance\univ_coldread\d145\recheck\recheck.json` |
| 3 | A, D145, decline-first | **WRITE** | **NEITHER, "leaning slightly DECLINE"** (as amended) | same record |

- **Template 1, unchanged, drew NEITHER, NEITHER and WRITE across three calls.**
- **Amended template 2 drew WRITE and NEITHER.**
- **The registered verdict (amendment §6.3: "PASS only if BOTH calls return NEITHER for BOTH templates"): 2 of the 4
  re-check answers are not NEITHER, so STOP.** The record reads `"verdict": "STOP"`.
- **7 isolated calls in total, 0 subjects:**
  - D144: 2 rig-prime probe calls and 1 checker call (`handback/p-d144-fprompt-A_2026-09-26.md` §1, §2, §4);
  - D145: 2 checker calls and 2 two-turn design calls (`handback/p-d145-recheck-A_2026-09-26.md` §2, §3).
- **The order of events kept the rule honest:**
  - the amendment was committed (`4a00947`) before the re-check ran;
  - the runner verified template 2's sha256 `9c95eafb…` and template 1's `0dd9e2be…` before sending anything
    (D145 §1);
  - there was no re-ask and no second rewrite (amendment §6.4–6.5, D145 §2).

## 2 · THE ANSWERS, verbatim

Quoted from A's records, which both hand-backs cite as holding "both answers verbatim". The hand-backs' own quotes are
cut short (D145 §2 ends mid-word, e.g. "…justification burden betwee"), so the full text is taken from the records
here by script, and each quoted part was checked to occur unchanged in its record. Each record is named by its
sha256.

### D144 — one call (`fprompt.json`, sha256 `430d0eea4793e9f0020e5f28013070c40bf04be28ab52bbb01e95673b45803ba`): template 1 as sealed, template 2 as sealed

> TEMPLATE 1: NEITHER — The instruction gives the "write" option first, which could create mild primacy bias, but the template counteracts this with two balancing moves: an explicit "Both are ordinary answers here and neither is preferred," and the further instruction "Do whichever the document actually calls for," which explicitly hands the decision back to the content of the document rather than the phrasing. The decline condition ("there is no next entry to write") is also a clear, well-defined, easy-to-invoke judgment (e.g., the document reads as a finale) — not obviously harder to reach than the write option. Net effect: the wording is self-correcting toward neutrality.

> TEMPLATE 2: WRITE — The structure mirrors Template 1 (write-option stated first, decline-option second, "Both are ordinary answers... neither is preferred"), but it's missing the extra reinforcing sentence that Template 1 has ("do whichever it calls for"), leaving whatever primacy effect exists from listing "write" first unaddressed. More importantly, the decline condition is worded as an extreme case: the line must "not let you expect anything in particular" — i.e., yield literally zero expectation. That's a much higher bar to justify than Template 1's decline condition, since almost any line of notes will suggest *some* minimal expectation (genre, subject, tone), however thin. This makes DECLINE harder to legitimately invoke by the wording alone, tilting the template toward WRITE.

### D145 call 1, write-first (`recheck.json`, sha256 `0daace73c4252fc32b40ef2b5921c493ad6d27e8a85e494b2ecc2d09418de25e`, label `call1-write-first`, exit 0, 11531 ms): template 1 as sealed, template 2 as amended

> TEMPLATE 1: NEITHER — the instructions explicitly present both outcomes as equally ordinary and valid, framed symmetrically ("Write... —or—, if you judge... say that instead"), with an explicit disclaimer that neither is preferred. There's no asymmetry in verb weight, elaboration, or justification burden between the two options.

> TEMPLATE 2: WRITE — despite the same symmetric disclaimer, the setup itself biases toward writing: a single line is a much thinner basis than a full document, but the template still primes the reader with "Write what you now expect" as the first, fully-elaborated instruction, while the decline option is a shorter afterthought. More importantly, "not enough to go on" is a much easier bar to fail to meet than "no next entry exists" — readers are generally inclined to speculate/extrapolate from minimal information (a single line naturally invites imagining a fuller picture) rather than assert insufficiency, since almost any line permits *some* expectation to be formed, however tentative. This makes declining feel like an unusual, harder-to-justify move compared to Template 1, where "no next entry" is a concrete, well-defined judgment (e.g., a series that clearly ended) that a document can straightforwardly support.

### D145 call 2, decline-first (same record, label `call2-decline-first`, exit 0, 8926 ms)

> TEMPLATE 1: WRITE. Framing "the next entry in the series" as the default task, with declining as an appended afterthought introduced by "or, if... say that instead," biases toward continuation. Also, "the document actually calls for" presupposes the document has agency directing toward one of two acts, but the primary verb and phrase structure foreground writing.

> TEMPLATE 2: NEITHER, leaning slightly DECLINE. Here the setup itself ("a single line... describing a document you have not seen") emphasizes the paucity of information before the instruction is even given, which primes the reader toward noticing insufficiency. The parallel "or, if you judge..." structure is identical to Template 1's, but the preceding framing sentence does more work to justify declining in Template 2 than the analogous framing does in Template 1 (in Template 1, "a document from a series that someone has been keeping" doesn't suggest incompleteness or insufficiency the way "a single line... describing a document you have not seen" does). So the wording difference in the setup sentence matters more than the parallel instruction/disclaimer that follows.

> Net comparison: Template 1's wording tilts toward WRITE; Template 2's wording tilts mildly toward DECLINE (or at least is more balanced/neutral than Template 1). So yes — judging by wording alone, the two templates are not symmetric: Template 1 makes producing a next entry easier to justify, while Template 2 makes declining easier to justify than Template 1 does.

*Recorded verdict in `recheck.json`: `STOP`.*

## 3 · THE VARIABLES, named so they can be weighed

1. **A's disclosed gloss change (D145 §2, item 2).** In D144 the question described template 2's decline branch as
   *"declining (saying the line lets them expect nothing in particular)"*, which is the **retired** bar. In D145 it read
   *"declining (saying the line is not enough to go on)"*, the amended template's own words.
   - A named this as its change, "so it can be refused".
   - It is a difference between the D144 question and the D145 questions, so **the D144 → D145 comparison is not
     question-identical.**
   - It touches only template 2's gloss. **Template 1's gloss was unchanged, and template 1 flipped too** (D145 call 2:
     WRITE). So the gloss cannot account for the template 1 result. (The stop sheet makes the same point.)
2. **The question's wording is A's** (D144 §2: "whose wording is mine and so named as a variable").
3. **The counterbalance is the registered one:** write-first and decline-first, with the token lists reordered to match
   (D145 §2 item 1).
4. **One checker per call, n = 1 per order.** That was the registered design, not a choice made after the data.

## 4 · WHAT THE STOP DOES NOT LICENSE

- **It does NOT show that the prompts are loaded.** A checker that returns NEITHER, NEITHER and WRITE on the same
  unchanged text has not established a direction in that text. D145 §2 puts it as a fact about the answers: "the named
  direction moved with the call."
- **It does NOT show that the prompts are neutral.** Two of the four re-check answers named a direction. A NEITHER
  majority from an instrument that disagrees with itself certifies nothing.
- **What it does establish, and all it establishes:** under the registered rule, **the controls could not be certified.
  A single isolated checker call could not tell a direction in these prompts from noise.** It is published as the
  pre-registration asks (`:416`), and it stands as the pre-flight's result whatever runs after it.
- **It also does not reach:**
  - the stage-1 question (do K and O separate?), because no subject ran;
  - anything in §7;
  - the artifact.

## 5 · WHAT RUNS AFTER, and how this result travels with it (the plan, not this file's ruling)

- **The keeper's "do all steps 1-3" overrides §12 F-PROMPT for stages 1–2.**
  - The plan reads it as overriding **only** F-PROMPT: every other registered rule stands, including §4's stage-1 gate,
    *"if K and O do not separate, ABORT"*, published as a finding about the instrument.
  - The plan prints this beside every stage-1/2 result, verbatim:
    > These subjects ran after the pre-flight direction check FAILED (`d6a5caf`; A's D145 §2) and without certified
    > prompts, by the keeper's explicit word ("do all steps 1-3", 2026-09-26 01:29). The prereg's §12 would have
    > stopped them. Read every number here with that limit.
- **Two readings in the plan are the librarian's, not the keeper's words.** They are named here because this file is
  the record of the stop, not a place to settle them:
  - (a) **"only F-PROMPT"**: the keeper said "do all steps 1-3". The narrow scope is the plan's, and it is the
    conservative one.
  - (b) **Step 2 as a non-gating measurement.** On the stop sheet, option 2 read "Stages 1–2 would run only if that
    passes". The plan makes it "a MEASUREMENT reported beside stages 1–2, not a gate on them", because a gate would
    contradict option 3 ("Run stages 1–2 anyway"), which he also ordered. That is the only reading under which all
    three hold at once, but it is a reading.
- **Stage 3 is out of scope:** it needs the four sealed documents, which are on L. The registration's month ends
  2026-09-29.

*Designer's file. It reads no dial.*

# P-UNIV-COLDREAD — dated amendment to §5, template 2 (arm C's line prompt), after F-PROMPT fired (2026-09-26)

**Author:** pane C (Around), the registration's §10 DESIGNER and the prompt's author. Rewriting a prompt after F-PROMPT is
the designer's job; it is not selecting, coding or scoring (§10). **I did not run the checker.** The prompt's author
cannot also judge the prompt, because it would be one free parameter with two names (§5.1).

**Status: 0 subjects have run.** The pre-registration stays sealed at `a85d359`, and **none of its words is edited in
place**: F-VOID ("any edit after subject 1 runs") has not fired, and this file is the dated amendment beside it. **It
must be committed before the re-check below runs,** the same seal rule as the pre-registration (§0: "the seal is git").

## 1 · WHY: F-PROMPT fired on template 2

`exo_memory/handback/p-d144-fprompt-A_2026-09-26.md` §2 is the source. The checker's full record is
`C:\Consonance\univ_coldread\d144\fprompt\fprompt.json`.
- **The run:** one isolated checker, shown only the two sealed §5 templates (`a85d359`, `:148-157` and `:161-169`).
- **Template 1 (the document prompt):** it returned **NEITHER**.
- **Template 2 (arm C's line prompt):** it returned **WRITE**. Its reasons, verbatim from `fprompt.json`:
  > *"the decline condition is worded as an extreme case: the line must "not let you expect anything in particular" —
  > i.e., yield literally zero expectation. That's a much higher bar to justify than Template 1's decline condition,
  > since almost any line of notes will suggest *some* minimal expectation (genre, subject, tone), however thin."*
  >
  > *"it's missing the extra reinforcing sentence that Template 1 has ("do whichever it calls for"), leaving whatever
  > primacy effect exists from listing "write" first unaddressed."*

**The rule** is §12 F-PROMPT: "the unprimed seat can name a direction in the prompt → prompt rewritten before any
subject."

**Do I accept the reading? Yes, on both counts. I checked each against the sealed words rather than deferring to the
checker.**
- **(a) The decline bar.** Template 1's decline branch is a JUDGEMENT the reader makes: "if you judge there is no next
  entry to write". Template 2's is a near-impossible CONDITION: "if the line does not let you expect anything in
  particular". Almost any line lets you expect something. So the two branches do not have the same bar, and the
  checker is right that this is in my text, not in A's question.
- **(b) The balancing sentence.** Template 2 lacks template 1's "Do whichever the document actually calls for." That
  was an asymmetry I introduced when I sealed arm C's ask "identically". It was not identical.

## 2 · THE SEALED TEXT (verbatim, `a85d359`, `:161-169`; sha256 `e728e3187967e401d8efd3a069a8caa8611333d66f7f85fd44b9935d44764e44`)

> Below is a single line from someone's notes, describing a document you have not seen.
>
> Write what you now expect that document to be like — **or**, if the line does not let you expect
> anything in particular, say that instead and say why.
>
> Both are ordinary answers here and neither is preferred.
>
> ---
> [LINE]

## 3 · THE AMENDED TEXT (template 2, from this date; sha256 `9c95eafbb79c624d2879589dec208839044102d605b1001319523afd74843e0c`)

<!-- amended-template-2:begin -->
> Below is a single line from someone's notes, describing a document you have not seen.
>
> Write what you now expect that document to be like — **or**, if you judge that the line is not enough to go on,
> say that instead and say why.
>
> Both are ordinary answers here and neither is preferred. Do whichever the line actually calls for.
>
> ---
> [LINE]
<!-- amended-template-2:end -->

The sha256 is of the nine lines between the markers, joined with `\n` and with no trailing newline, exactly as
`<scratchpad>/d144/sealed.js` computed it. **The runner sends this text, with its blockquote markers stripped as A
stripped the sealed text in §2, and checks the sha256 before sending.**

## 4 · THE DIFF, and why each change is the smallest that answers the finding

```
- Write what you now expect that document to be like — **or**, if the line does not let you expect
- anything in particular, say that instead and say why.
+ Write what you now expect that document to be like — **or**, if you judge that the line is not enough to go on,
+ say that instead and say why.

- Both are ordinary answers here and neither is preferred.
+ Both are ordinary answers here and neither is preferred. Do whichever the line actually calls for.
```

1. **The decline branch becomes a judgement, as template 1's is.** It reads "if you judge that the line is not enough
   to go on", mirroring template 1's "if you judge there is no next entry to write".
   - "Not enough to go on" is a judgement of sufficiency, not a demand that the line give *nothing*.
   - The write branch is untouched.
2. **The balancing sentence is template 1's, with "document" → "line":** "Do whichever the line actually calls for."
3. **Nothing else changes.**
   - The first line, the order of the branches, "**or**" in bold, "say that instead and say why", "Both are ordinary
     answers here and neither is preferred.", the `---` and `[LINE]` are all byte-identical.
   - **Template 1 is not amended.** It got NEITHER and stays exactly as sealed.
4. **§5's other constraints still hold:**
   - None of *closure, finished, sealed, complete, open, alive, tomb* appears (checked by script: none).
   - Both branches are still licensed in adjacent clauses of one sentence, in the same register.

**The one thing I did NOT change, deliberately: "write" still comes first,** as it does in template 1. The checker named
primacy as a residual effect in BOTH templates, and still returned NEITHER for template 1 once its balancing sentence
was present. Swapping the order in template 2 alone would make the two templates differ in a new way. The re-check
below swaps the order in the CHECKER'S question, not in the prompt, which tests whether the order effect is the
checker's or the text's.

## 5 · DOES THIS TOUCH WHAT §6'S CODING READS? No.

- **§6's codes read the SUBJECT'S RESPONSE, not the prompt:** EXTEND, REVISE, RESTATE, DECLINE, UNOPERATIONALIZED,
  BOTH and NEITHER, each by a quoted span.
- **DECLINE's wording is unchanged:** "an explicit statement that no next entry exists / the work is complete".
- **One fact is worth stating so no coder conflates them: in arm C, the prompt's two BRANCHES are not the codes.**
  - A subject who takes template 2's decline branch ("the line is not enough to go on") says nothing about the
    document's state. By §6 that response has **no quotable span for any code, so it scores NEITHER, not DECLINE.**
  - A DECLINE in arm C, which is P-LABEL's sealed prediction for C ("C → P-LABEL predicts RESTATE/DECLINE"), can only
    come from the **write** branch: a subject who expects the document to be one that says it is done.
  - **So the amendment moves the prompt's branch bar and leaves every code's bar where it was.**
- **Its likely effect, stated before any run:** lowering the decline branch's bar can raise the share of arm-C
  responses that score NEITHER. §7's CEILING and SPLIT rules and §12's F-LEAK already cover a high-NEITHER outcome, so
  no rule needs to change for it.

## 6 · THE RE-CHECK, registered before it runs, so it cannot be tuned (the chair's D144 rule, adopted verbatim in substance)

1. **A runs TWO fresh, isolated checker calls on the amended pair:** template 1 as sealed, template 2 as amended in §3.
   Each call is shown only the two templates, the same way as the §2 call.
2. **The outcome order is swapped between the two calls.** One asks with "write" named first, the other with "decline"
   named first. Everything else in the question is the same as the §2 call.
3. **PASS only if BOTH calls return NEITHER for BOTH templates.**
4. **If either call names a direction for either template, the run STOPS and goes to the keeper. There is no second
   rewrite.** That is §12's abuse condition, verbatim: *"re-scoping after an unwelcome control result is degeneration,
   not refinement. If the controls fail and the response is a new prompt tried until they separate, every later result
   is fitted. The honest move on a control failure is to publish it."* A second rewrite after a failed re-check is that
   move.
5. **No re-asking.** Two calls are the re-check. A third, or a re-run of either, is the same abuse in a different coat,
   as A already declined to do in §2.
6. **The seal order:** this file is committed, and the commit is named in the re-check's record, **before** either
   call runs. The runner checks the sha256 in §3 before it sends.

## 7 · WHAT THIS DOES NOT DO

- **It does not score, select or code anything,** and it does not choose K, O or F stimuli (§10).
- **It does not claim the amended prompt is neutral.** That is the re-check's to say, not its author's: §5.1, *"'I
  wrote a neutral prompt' is unfalsifiable and I am the last party who should be believed about it."*
- **It does not touch §8.1.**
  - F-PRIME fired on 2026-09-24 (`loop/univ_coldread_scorecard_2026-09-24.md` §2).
  - It has since been answered: the route of record (`2e963d5`) passed the same 2-call probe on 2026-09-26, with
    `CHANGELOG: NONE` in the empty directory (`handback/p-d144-fprompt-A_2026-09-26.md` §1).
  - **Still open, from that hand-back's §3:** where a two-turn subject's saved transcript lands. The route's
    `--no-session-persistence` is incompatible with §5's second turn (`claude -c`). That is the runner's problem, not
    the prompt's.

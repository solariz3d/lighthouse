# ASK-007 stopped on its own rule: one decision for the keeper, one read. Librarian, on D, 2026-09-26 01:2x.

**What happened.** The cold read (ASK-007, which you said YES to on 09-24) has two prompts. Before any subject reads them,
a fresh isolated checker has to find NO lean in either (the prereg's F-PROMPT, `univ_coldread_prereg_2026-08-29.md:403`).
- **D144:** one checker call. Prompt 1 got NEITHER. Prompt 2 got WRITE, so C rewrote prompt 2 beside the seal
  (`loop/univ_coldread_prompt_amendment_2026-09-26.md`, committed `4a00947`).
- **D145:** two more calls, with the options asked in opposite orders. The rule, registered before they ran, was 4 of 4
  NEITHER or STOP to you, with no second rewrite (amendment §6). **Result: 2 of 4 not NEITHER. STOP.**
  Record: `handback/p-d145-recheck-A_2026-09-26.md` §2, both answers verbatim.

**The one fact that matters.** Prompt 1 was **never changed**. Across three calls the checker gave it **NEITHER, NEITHER,
WRITE**. Prompt 2's verdict also flipped with the call (WRITE in one, NEITHER leaning DECLINE in the other). So the
instrument that is supposed to certify the prompts disagrees with itself on identical text. That is the same shape as
`journal/2026-09-22.md`'s title: *"the judge could not agree with itself."*
0 subjects spent. 7 isolated calls in total. No token leaked (A: `grep -c sk-ant` = 0 in both records).

**Your options:**

1. **Publish the stop as the result (recommended).** The prereg's own words at `:416`: *"The honest move on a control
   failure is to publish it."* ASK-007 closes with "controls could not be certified: one checker call cannot tell a
   direction in these prompts apart from noise". The measured finding is kept. Nothing further runs.
2. **Register a NEW checker instrument, marked as coming after a failed control.** For example: N calls per order per
   prompt, with the pass threshold fixed in advance, as a new dated registration. Stages 1–2 would run only if that
   passes. The cost is that the prereg's §12 calls re-tooling after an unwelcome control "degeneration", so every later
   result carries that flag. The deadline is 09-29, and stage 3's four sealed documents are on L, not D (ASK-007 status
   line), so the full run needs the laptop anyway.
3. **Run stages 1–2 anyway**, with the stop written beside the result as a named limit. This breaks a rule registered
   before the run. I don't recommend it; it is listed because it is yours to choose.

**Also named, so it can be refused:** A changed one gloss in the checker's question for prompt 2, to the amended wording
instead of the retired wording (its §2 item 2). It cannot explain the verdict: prompt 1's gloss was unchanged, and
prompt 1 flipped too.

**Also settled by D145, whichever you pick:** a two-turn subject's transcript lands only in the throwaway config folder.
Nothing reached the real `~/.claude` (A §3).

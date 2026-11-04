# ASK-007 stage 1: SCORE. Librarian, the non-author scorer (§10 bars designer, attacker and registrar; not the librarian), on D, 2026-09-26 02:2x.

> These subjects ran after the pre-flight direction check FAILED (`d6a5caf`; A's D145 §2) and without certified
> prompts, by the keeper's explicit word ("do all steps 1-3", 2026-09-26 01:29). The prereg's §12 would have stopped
> them. Read every number here with that limit.

**Also beside it:**
- D147's checker: template 1 leans WRITE (19/20), template 2 leans DECLINE (16/20), control PASS
  (`handback/p-d147-checker-A_2026-09-26.md`, re-parsed `2b56b51`).
- The blinding limit: all 9 responses name their source, so the coder was blind to arm labels, not arm identity
  (`handback/p-d148-stage1-A_2026-09-26.md` §4).

## Sources

- **Run:** `handback/p-d148-stage1-A_2026-09-26.md`. 9 subjects, 0 failures, 0 exclusions.
- **Codes:** `handback/p-d149-code-B_2026-09-26.md` (git-blob `293e0d98…`), by id, blind.
- **Key:** `C:\Consonance\univ_coldread\d148\key\key.json`, opened by me only after B's hand-back was on disk.
- **Rules:** prereg `a85d359`, §4 (gate) and §7 (decision rule).

## Unblinded, turn 1 (the primary measure)

| arm | ids | B's codes (strict) | conditional |
|---|---|---|---|
| **K, final** (Federalist 85) | 22d82886 · 26906521 · 4578492a | **DECLINE · DECLINE · DECLINE** (firm) | none |
| **O, provisional** (Federalist 33) | 8c5e9fe7 · dd464376 · 297b48b3 | NEITHER · NEITHER · NEITHER | **EXTEND × 3** |
| **F, floor** (Seneca 124) | 8f894a2f · bfda5599 · 460201c8 | **DECLINE · DECLINE · DECLINE** (firm) | none |

**B's conditional EXTENDs, checked mechanically by me:** all six candidate new propositions B quoted for the O arm are
**absent verbatim** from `O_federalist_33.txt` (normalised whitespace and case; a substring check, not a judgement of
paraphrase). B's turn-2 quote "It will be shown in the next paper…" **is** in O verbatim.

## §4 GATE, K and O separate: **PASS**

- K is closure 3/3 (firm DECLINE). O is closure 0/3: NO SIGNAL under B's strict reading, ALIVENESS (EXTEND) under the
  conditional, which the verbatim-absence check supports.
- **They separate under both readings.** So the prompt permitted both answers in behaviour, and stage 2 runs.

## What else stage 1 measured

1. **The floor declines, but from knowledge, not from the text.**
   - Turn 1: F is DECLINE 3/3. B's quotes call the ending *"an accident of transmission rather than an intended ending"*
     and the collection *"incomplete"*.
   - Turn 2 (what the document ITSELF says): F is **NEITHER 3/3**, for example *"The document itself says nothing about
     the series being finished"*.
   - That is E's registered limit (D144 §4) coming true: the subjects know Seneca's letters stop at 124.
   - **Consequence for stage 2, registered in §7 before any C subject runs:** if arm C returns DECLINE 3/3, it
     **matches the floor**, and the finding is about terminal numbered documents in general, not this artifact. It
     cannot be reported as a win.
2. **Turn 2 separates all three arms cleanly:**
   - K: "explicitly says the series is finished" × 3;
   - O: "explicitly signals the series continues" × 3;
   - F: "says nothing" × 3.

   B flags that §6 maps a restatement of *"continues"* to CLOSURE (RESTATE → A). That is a form-over-content defect in
   the code table, and it is the registration author's to answer, not the scorer's. **The gate is scored on turn 1, so
   it does not change the gate.**
3. **The wording lean did not show in behaviour.** D147's checker read template 1 as leaning WRITE 19/20. Under that
   same template, **6 of 9 subjects declined** (all of K and F), and the 3 who wrote were exactly the 3 whose document
   says it continues. At n = 9 the measured wording verdict did not predict what readers did. Counts only, with no ratio
   below n = 5 (§7).

## NOT verified

- **Proposition-level absence** for the EXTEND conditionals. The check is verbatim only; a paraphrase of O could hide in
  a candidate span.
- **Whether the O subjects wrote new text or recalled Federalist 34 from memory.** The candidate spans read like
  Hamilton. Either way it is EXTEND by §6, because it is absent from the stimulus. But "writes" may partly mean
  "remembers".
- **A second coder.** One coder, with partial blindness declared (B §0).

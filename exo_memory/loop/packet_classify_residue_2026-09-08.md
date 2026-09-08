# P-CLASSIFY-RESIDUE — classify the residue, and kill the third tier where it still lives. L046.

**To BRAVO, 2026-09-08 ~05:50. Two items, both yours by prior authorship. Nothing touches `main.rs`
or the rebuild.**

## 1 · `exo_memory/review/` — CLASSIFY, DO NOT DELETE

    node consonance/tools/gen-consumer.fixture-scope.test.js
      -> the generator refused: "1 exo_memory/ entr(ies) are in neither column"

**That one entry is `exo_memory/review/`.** It has been red for two days and is **two of the three
reds in the current `js-suite`**. `audit` was columned last lap at `gen-consumer.js:638`; `review`
is columned nowhere.

**E's §5 proposed the line and the chair deferred it** — the librarian had ruled it should wait so
the tree held still during L045's read. **That read is scored and filed. The deferral is over.**

**Add the `STAYS_PRIVATE` entry WITH ITS REASON**, in the shape `audit`'s line uses. **The reason
is the deliverable, not the line** — a column entry that says only *"private"* teaches nothing, and
the next person meeting an uncolumned directory learns nothing from it. Say what `review/` IS: a
scored experimental object kept as the record of what L039's subjects read.

**Deleting it is the wrong fix and the tempting one.** The object is the evidentiary record behind
a scored run; classifying is how this room keeps a thing it must not ship.

    node consonance/tools/gen-consumer.js --report          state before and after
    node consonance/tools/gen-consumer.fixture-scope.test.js  GREEN
    CONSONANCE_LAUNCH_PROBE=1 node consonance/tools/gen-consumer.build.test.js --gate
      -- run it and STATE THE RESULT, including BLOCKED (exit 3, the single-instance lock).
      BLOCKED is UNMEASURED, not green, and the port rule says so; do not report it as a pass.

## 2 · YOUR OWN NAMED SURVIVOR — `actors.js:37` AND `:337`

You named these last lap and did not fix them, correctly, because they were outside your four items
and would have enlarged a one-commit landing. **They are the item now.**

    actors.js:35-37    const LETTERS = process.env.CONSONANCE_DATA
                         ? path.join(process.env.CONSONANCE_DATA, 'letters.json')
                         : 'C:/Consonance/data/letters.json';      <- the literal third tier

    actors.js:337      const board = process.argv[2] || 'C:/Consonance/data/board.jsonl';

**This is the identical defect you removed from `transcript-watch.js:89` last lap, inside the
module whose own test file boasts at `:47` that it is unlike them.** Note the difference from
`transcript-watch`: this resolver has **two** tiers, not three — it never consults
`~/.consonance.json` at all, so a machine with a valid `data_dir` and no `CONSONANCE_DATA` gets the
literal. **Say whether the fix is the three stated tiers or something narrower, and why.**

**And `:337` is a different shape from `:35-37`** — an argv default rather than a config resolver.
**Rule on it separately.** A default that names one machine's disk is still a machine path; a
default that means *"the board this instrument is for"* may want a resolver instead of a literal.
Do not collapse the two just because they share a string.

    RED FIRST   show the ratchet or a test BLIND to these before you fix them, the way you
                showed the .py gap last lap.
    MUTANT      restore each literal => red, separately.
    node consonance/tools/portable-paths.js   state the known count and whether the baseline SHRANK
    node consonance/tools/actors.evidence.test.js   state it
    node consonance/tools/js-suite.js               state the count and what moved

## 3 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, B: you removed this exact defect from `transcript-watch` last lap by
**refusing the chair's instruction to copy it**, and you found that three documents named it and
none could fail — `portable-paths.js:492` told every reader to copy it, the baseline exempted it,
and `actors.evidence.test.js:47` boasted *unlike them*. **The boast is in the module that still
carries it.** You also struck a fix-list item as not real last lap; §1 or §2 may contain another,
and striking one is a result.

## 4 · WHAT YOU OWN

    consonance/tools/gen-consumer.js
    consonance/tools/actors.js
    consonance/tools/actors.evidence.test.js
    consonance/tools/portable-paths.baseline.json
    exo_memory/handback/p-classify-residue_2026-09-08.md
    exo_memory/map/B.md

**A holds `exo_memory/review/tool_audit_draft_2026-09-07.md` this lap — you touch `review/` ONLY as
a classification line inside `gen-consumer.js`, never the file.** C holds the third-run
registration; E holds two vantage registrations. **Nothing touches `main.rs`.** **Do not commit.**

## 5 · PERMISSION TO REFUSE

If classifying `review/` as private conflicts with anything the generator does downstream — or if
the honest answer is that a scored object should live somewhere else entirely rather than be
columned where it sits — **say so.** The red is two days old; one more lap of it costs nothing
next to classifying a thing into the wrong column.

## 6 · HAND-BACK

`exo_memory/handback/p-classify-residue_2026-09-08.md`, then `call_librarian` with that path in the
same turn. One line to `exo_memory/map/B.md`.

    OBJECTIVE:  every exo_memory/ entry is in a column with a reason, and no instrument in this
                room falls back to one machine's disk.
    FALSIFIER:  a machine path passing the ratchet after this, or a generator refusal naming an
                unclassified entry.

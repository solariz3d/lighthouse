# Retrieval: how many of the room's errors were answers already on disk? Librarian, on D, 2026-10-11 21:4x. Lap D301.

The keeper, 21:34: "lets continue work till we figure it out". Retrieval had slid behind cleanup today; this puts it back on the line.

## Why this question
- The reach numbers say what is POINTED AT, not what is MISSED. Light mode leaves 99.74% unpointed by path, strict 67.92% (`handback/p-lightreach-E_2026-10-11.md:27`); same-method reach 96.55% (`handback/p-reach-C_2026-10-11.md`). Those are structure, not use.
- The scoreboard says WHO catches errors: seats after the fact catch nearly all, gates 0 of 383 (`handback/p-scoreboard-E_2026-10-11.md`, §0). It does not say whether the caught error's answer was already on disk.
- **This lap asks the missing link: of the room's caught errors, what share were retrieval misses** (the right answer was on disk before the error, in a file the erring seat did not open)? If that share is small, the room's wrongness is not a retrieval problem and the next step is elsewhere. If it is large, the WHERE of the misses says what to index.
- Two of today's own errors are the shape: my D300 part 3 planned work done in D289 from a stale line (`loop/plan_clean_up_after_ourselves_2026-10-10.md:97`, answer in `handback/p-heavyrunmut-B_2026-10-11.md`); E kept Onuris reads out under a rule the keeper withdrew on 10-06 (`map/A.md:1815`). Both answers sat on disk; both errors came from a stale carrier line.

## Does not touch the H3 trial
Nothing here changes what a live seat loads. Parts 1–3 measure; part 4 builds behind a switch that stays OFF until the ~10-17 decision. Light mode's shelf must come out byte-identical with the switch off.

## The parts
**Wave 1, in parallel:**
1. **B: the registration, sealed before any verdict is read.** Define "retrieval miss", "reasoning error" (the seat had the file open), "new information" (not on disk at the time), and "stale carrier" (a line elsewhere still said the old thing). Set the bar and say what each outcome changes next, at least: miss share < 20% of on-disk-checkable catches → retrieval is not the bottleneck; ≥ 40% → index where the misses live. Register where the misses are expected to live. My guess, sealed here so B is not anchored by it beyond this line: **≥ 40%, and handback/ plus stale carriers hold most of them.**
2. **A: the sample, frozen.** From E's population (`handback/p-scoreboard-E_2026-10-11_evidence/out/rows.tsv`, the WRONG entries and the hand-back corrections, 09-01 → 10-11) plus today's two above, draw 60 catches, seeded and stratified by finder. For each unit, gather mechanically: the erring claim, the correction, the time of each, every path the correction cites with its first-commit time (`git log --diff-filter=A`), and the files the erring seat opened in that turn where a transcript exists. A judges nothing. Freeze it with a digest (function named).
3. **E: the switched-off hand-back index (part 4 in effect, built now).** handback/ is in neither shelf's directory list (`p-lightreach-E:45`; strict `main.rs:7849-7855`, light `LIGHT_SHELF_DIRS` `main.rs:8193`). Add it, indexed and never carried, behind a config switch that defaults OFF. Rows: switch off, both modes' shelves are byte-identical to today's; switch on, hand-backs appear by path within the index budget; the budget's drop count is reported. Mutants on the switch. Report the shelf size with it on.

**Wave 2, after B's bar and A's sample are both committed:**
4. **C: the blind read.** Classify all 60 units by B's definitions, not having seen B's guess-section or my guess above until the table is done. For each miss, name where the answer lived (directory) and whether a stale carrier pointed the wrong way.
5. **Librarian: score against the bar,** with B reading C's table as non-author beside it.

Each pane runs targeted tests under the heavy-run lock; the chair runs the full suite before landing E's code. Worktrees on G:. Commit by named paths; do not push. Dispatch rows carry `--parts 4`, and the chair writes a `working` row at dispatch.

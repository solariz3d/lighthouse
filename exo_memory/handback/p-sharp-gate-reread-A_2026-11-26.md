# Re-read of build 2's repair (Sharp refuses on reds only): pane A, 2026-11-26 local (00:3xZ on the 27th), chair D677 (PROVE IT, no edits)

**Read:** only `d80c96a..2538d8e` (`d677-sharp-reds-b`, pane B's repair). My first read is
`exo_memory/handback/p-sharp-gate-read-A_2026-11-26.md`. I made no edits. I did my pass and runs before reading B's account
(`exo_memory/handback/p-d677-sharp-gate-repair-B_2026-11-27.md`, lighthouse `89731c0`).

    checked: git fetch origin d677-sharp-reds-b → 2538d8eb7085ea86833a00cc464a05c1562fae35; git diff --stat d80c96a 2538d8e
             → CHANGELOG.md, test/core_sharp.test.js, test/core_sharp_mutation.test.js (26+/8-); src/ unchanged

**Verdict: CLEAN.** All three findings are answered, and I found nothing new in the change.

## F1, row 4's comment (`test/core_sharp.test.js:142-146`): fixed

- The comment now calls row 4 "A GUARD, green before D677 too". It says that on ceb21f5 the same corner refused for
  `leaves-surface` alone, with no amber, and named the same tightest.
- That matches my measurement (`sg2-base.json` "row4": 308.5 m, amber `[]`).
- It also names the row's job: catching S10 and S11.
- "Turning right" for −36° is right by `sharp.js:8` (+ = left).

## F2, S15 and S16 out of "equivalent": done, each row red against its own mutant first

    checked: node --test --test-name-pattern="negative radius|closed track is refused CLOSED" with 2538d8e's core_sharp.test.js,
             on d80c96a and on my two mutant copies of it (G:/consonance-scratch/a-sgread/tip-s15, tip-s16; one exact string each, applied once)

| tree | "a negative radius is refused by name (BAD_TARGET)" | "a closed track is refused CLOSED even at a radius too tight" |
|---|---|---|
| d80c96a | green | green |
| S15 (`if (doc.closed)` → `if (false)`) | green | **red** |
| S16 (`R > 0` dropped) | **red** | green |

- `test/core_sharp_mutation.test.js:31-34`:
  - The "EQUIVALENT" comment is replaced by one that says why neither is equivalent.
  - S15 and S16 are now harness mutants. Their patterns match the new rows' names, and their anchors are the strings I
    mutated.
- B kept the comment that leaves S12, S13 and S17 out, unchanged.

## F3, `CHANGELOG.md:35-38` promises only what Sharp does: yes

The entry now reads:
- "A red ON THE CORNER itself … still refuses by name";
- "tightest at this width" is the tightest "with no red on the corner";
- "what the corner does to the rest of the track (road it reaches elsewhere, a crossing off the corner) is the checker's to
  show".

That matches the code (`faults` counts only reds within `NEAR_M` = 5 m of the corner) and my cases:
- the 200° corner whose lead-in and lead-out cross lays;
- the 270° loop is refused at R 12 for a crossing on the corner, and its named 17.3 m lays with a crossing off it.

## The whole file and the harness at 2538d8e

    checked: heavy-run --run, node --test test/core_sharp.test.js test/core_sharp_mutation.test.js on a git archive of 2538d8e
             (G:/consonance-scratch/a-sgread/r2.tap) → tests 29, pass 29, fail 0

- **Rows:** 14 of 14.
- **Mutants:** applied 13 / caught 13 / NOT APPLIED 0, plus the CONTROL green and the D352 stand-in NOT TESTED.

## For the landing pane (from my first read §5, unchanged by this repair)

- `sharp.js` is untouched here, so the line map and the merge note stand.
- With C1's repair (`44885ef`), `sharp.js` auto-merges.
- On that merge every anchor of both harnesses occurs exactly once (11 checked: B's 8, O's 3, `merged2/src/core/sharp.js`).
- The S15 and S16 anchors are at `sharp.js:58` and `:60`, which neither C1 commit touches.

## Corrections

- None for this re-read. Its runs were gated on the status or went through `heavy-run --run`. The two-row check ran
  lockless: one file, no exclusive hold.

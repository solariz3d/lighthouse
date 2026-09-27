# Q3, the two-reader agreement test: SCORE. Librarian, the non-author scorer, on D, 2026-09-27 10:4x. Lap D161.

Plan and bars: `loop/plan_q3_agreement_2026-09-27.md` (`e9cb884`), registered before any unit existed.

## Inputs, each checked at the file

- Units: `loop/q3_units_2026-09-27.md`, sha256 `a08b46ff522af27e…` (re-computed at scoring; matches E's hand-back
  `handback/p-d161-units-E_2026-09-27.md`). 40 units, seeded draw from 2,161 eligible pairs.
- Scorer: `loop/claimrec/score_q3.js` (A, `9d1acd2`). `score_q3.test.js` 25 pass / 0 fail, run by me before scoring.
- Reads: B `loop/q3_read_B_2026-09-27.md` (`58ddae7`), C `loop/q3_read_C_2026-09-27.md` (`f0a8159`). Both declared
  blind. B saw C's answer COUNTS in a commit subject only after committing its own file (B's hand-back §6).

## The run

    NO_COLOR=1 node exo_memory/loop/claimrec/score_q3.js exo_memory/loop/q3_read_B_2026-09-27.md exo_memory/loop/q3_read_C_2026-09-27.md

    B answers YES 27 · NO 11 · CAN'T TELL 2
    C answers YES 24 · NO 11 · CAN'T TELL 5
    raw agreement 34/40 = 85.0%
    kappa (n*a - S)/(n*n - S) = (40*34 - 779)/(1600 - 779) = 581/821 = 0.7077
    CAN'T TELL rate B 2/40 = 5.0% · C 5/40 = 12.5% (bar: above 25%)
    VERDICT USABLE

## Verdict row

| κ | bar | CAN'T TELL (max) | verdict |
|---|---|---|---|
| **0.708** (581/821) | ≥ 0.60 | 12.5% | **USABLE: Jev gets Q3 on the same 40 units next** |

## What is under the number (read after the verdict was printed, from the sealed seat file)

- **The 6 disagreements:** U05, U14, U20, U27, U36, U38. **Only U14 is a hard YES/NO split.** The other five are one
  reader's CAN'T TELL against the other's answer. The readers almost never read the same pair in opposite directions.
- **By source seat** (`C:\Consonance\sealed\q3_2026-09-27\seats.json`, opened after both reads were filed):
  - units from B's own past text: 8 of 8 agreed;
  - units from C's own: 14 of 17 agreed.

  Own-text units did not agree more than the others (the other 15: 12 agreed).
- **Contrast, same design, vaguer question:** "drift" κ 0.125 between two readers (`loop/jev_r2r3_score_2026-09-23.md:14`).
  The keeper's reading from 09-27 (409ae2b) predicted that a sharp question would let readers agree. This is one
  confirmation of that prediction on readers. **It says nothing yet about Jev.**

## Limits, named

- **The YES rate (60–68%) is not an error rate.** Pairs are joined by adjacency (E's rule 4), so many sentences talk
  about something other than the output beside them, and the honest answer is then YES. Do not set this beside the base
  rate 8/163 (`loop/claim_base_rate_score_2026-09-27.md`); they measure different things.
- **The "states a number" filter is mechanical** (E's rule 5): an id like `L120` qualifies.
- **Two readers, one model family.** κ here is agreement between two of our seats, which is the bar the rule sets. It
  is not agreement with the world.
- **Q3's wording is the librarian's record of it.** C's draft on L is unpushed. If it differs, the draft wins for any
  later Jev run, and this result is labelled as run on this wording (plan).

## Also found: carrier-drift RED from the frozen file

B's hand-back §6: `carrier-drift` is RED, with 3 UNACCOUNTED at `loop/q3_units_2026-09-27.md` :68, :648 and :652.
- The frozen units quote past command outputs that mention a withdrawn phrase.
- The file cannot change (its sha is the lap's seal), so the fix is an accounting line in the registry for that path.
- Routed to A.

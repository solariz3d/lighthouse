# The composer predicate — the first of the bigger lines. Librarian (the lineage, on D), 2026-09-19 00:2x.

*The keeper, 00:22: "so what happened that lap, then lets plan the next". The small fixes are filed (D072, D073; `loop/plan_small_fixes_2026-09-18.md`). This is line 1 of the queue: the cause of deliveries that hold for minutes against idle panes. Two laps, measure-and-instrument first, the fix second, because the record says the cause is not yet distinguishable from its neighbour.*

## What the record holds

- **E's measurement, L062** (`handback/p-delivery-ack-E_2026-09-16.md` §1, §3): 33 of 33 forced deliveries arrived within 12–38 ms once released, every one after the full 240 s hold, against idle panes. Late, never lost.
- **The mechanism, at source today:** `fn composer_row` (`main.rs:8753`) finds the composer by the last empty-box or prompt line sitting under a separator rule, and returns `None` when it cannot. `fn input_box_empty` (`:8785`) returns `false` — "not empty", so HOLD — in three different cases: the composer has text; `composer_row` found no row; the two grids disagree in size. `drain_decision` (`:8927`) then holds to the bound and reports `Forced::SignalOutranked` (`:8905`), whose board sentence says "its composer never cleared" — a claim the code does not have the evidence for when the row was simply unreadable.
- **E's registered prediction (L062 §7):** an ack will NOT reduce the forced rate; the thing to redesign is the composer predicate. And E's one-line ask: record, beside the `Forced` variant, whether `composer_row()` RESOLVED.
- **Prior fixes of the same family:** `packet_composer_anchor_2026-09-09.md`, `packet_composer_update_2026-09-09.md` (an auto-update moved the screen), `keep_test_predicate_2026-09-09.md`, and the L044 defect (every full-height pane held to the bound, fixed 09-08).
- **A number to distrust until a pane re-derives it:** this seat's quick board count since the 09-16 13:12 rebuild — 9 `chair injected` rows, 0 marked FORCED, 15 rows reading "NO STAMP — fell back to the bounded screen gate". Board rows truncate (the L062 lesson), so this is a pointer, not a measurement. It does suggest the failure has changed shape since L062: fewer forced holds, more deliveries with no ready-stamp at all.

## Lap 1 — tell the three cases apart, and measure what is happening now

| pane | packet | the bar |
|---|---|---|
| E | **P-COMPOSER-TRISTATE** (build) | `input_box_empty`'s three reasons become three values the caller can see (empty / has text / UNREADABLE, with the unreadable reason: no row found, or grid mismatch); `drain_decision` keeps its present decisions exactly (unreadable still holds — no behaviour change this lap); the forced reason carries which case it was, and the board sentence says "composer could not be read" when that is the truth, never "never cleared"; fixtures from real captured screens, red first, including one screen where `composer_row` returns `None`; the existing ready-signal tests stay as they are (one is a known long-standing red — name it, do not touch it); mutants on a copy |
| C | **P-DELIVERY-CENSUS** (measure) | from the transcripts and the delivery ledger, not from truncated board rows: every chair and librarian delivery since the 09-16 13:12 rebuild, classed as immediate / held-then-delivered / forced / no-stamp fallback, with the hold length; for each no-stamp or forced case, what the pane's screen looked like if a capture exists (`C:\Consonance\data\captures`); the universe printed; the question answered plainly — is the dominant failure today still the unreadable composer, or the missing ready-stamp |

The librarian re-derives both; one return. B reads E's build as the non-author before it lands if the chair judges the diff large.

## Lap 2 — the fix, shaped by lap 1's numbers

Not designed yet, on purpose. If lap 1 shows UNREADABLE dominates: make `composer_row` find the row on the screens it currently misses (from C's captures), and decide with evidence whether an unreadable composer on a pane whose PTY has been silent past the idle bound may deliver sooner than 240 s. If the missing stamp dominates: the work moves to the ready-signal path instead, and the predicate is left alone. C's return-leg predicate (L062, `handback/p-return-leg-C_2026-09-16.md`) follows whichever lands.

## Falsifier, before anything runs

If after lap 2 deliveries to idle panes still hold to the bound at the same rate, the predicate was not the mechanism and E's L062 prediction is refuted. If lap 1's tri-state shows "has text" dominating — the keeper's hand really in the composer — then the holds are correct behaviour and there is nothing to fix but the sentence.

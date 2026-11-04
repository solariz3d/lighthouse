# The bidirectional-correction count, first direction (keeper → seat): SCORE. Librarian, on D, 2026-10-02 09:2x. Lap D208.

BOOT's 2026-08-23 amendment called this count owed. This is its first run with the amended unit, one direction of two.

**Inputs (sha256):**
- pool `qc_pool_units_2026-10-02.md` `1ddcc052…`; R1 `d6072805…`; R2 `c1a4e6d3…` (E, `889588c8` + `0febf282`);
- A's check `qc_check_read_A_2026-10-02.md` `fc70b4de…`; C's check `qc_check_read_C_2026-10-02.md` `ef266340…`;
- the sample key, outside the repo: `C:\Consonance\sealed\qc_2026-10-01\d208\check_key_librarian.json`.
- **A scoring note:** A wrote its rows as `U001: YES - reason`, not `— reason`. My first parse read every A row as non-matching
  (κ 0.000), which was wrong. The re-parse takes the leading YES / NO / CAN'T TELL. The figures below are from the re-parse.

## Reader checks
| check | n | agree | κ |
|---|---|---|---|
| R1 vs R2 (two scripted Sonnet passes) | 651 | 622 | **0.868** |
| R-consensus vs **A** (odd-half sample) | 58 | 50 | **0.752** |
| R-consensus vs **C** (even-half sample) | 56 | 44 | **0.618** |
| R-consensus vs panes, **pooled** | 114 | 94 | **0.685** |
All are ≥ 0.60, so **the count stands.** The samples are enriched (half R1-YES), so pane κ is measured on a 50/50 mix. On the
disagreements, C leaned toward "correction" and A slightly away from it, so no net direction is shown.

## THE COUNT (units where R1 and R2 both say YES)
- **97 of 651 keeper turns = 14.9%** are the keeper correcting a seat. 114 have either pass saying YES, which is the upper reading.
- **By seat:** librarian 90/617 = 14.6% · chair 7/34 = 20.6%.
- **By week:** 09-14..20: 29/215 = 13.5% · 09-21..27: 44/279 = 15.8% · 09-28..10-01: 24/157 = 15.3%.
- **Against the sealed prediction (15–25%): just under, so the prediction MISSED narrowly, low.**
- **Denominator, stated:** these are the librarian and chair transcripts on D only, with 101 Third Place turns (13%, rich in corrections),
  25 private-project and 2 credential turns dropped. So 14.9% is the rate for this frame, not for all of the keeper's turns.
- **It is a count of a record, never a verdict** on the keeper or any seat.

## What it settles, and what it does not
- BOOT's "prose until the count is run": **the first direction is now run.** About 1 keeper turn in 7 corrects a seat, steady across three weeks.
- **The registered falsifier** ("the keeper is the room's main corrector" is wrong if the seat → seat catches over the same window exceed
  this) **needs the second direction.** B's QS2S draft (`loop/qs2s_draft_2026-10-02.md`) found that seat → seat corrections live in FILES.
  B's grep floor is 62 explicit cross-seat corrections + 18 NOT GREEN in 506 hand-backs. A file-anchored two-reader test is the next lap
  for that.

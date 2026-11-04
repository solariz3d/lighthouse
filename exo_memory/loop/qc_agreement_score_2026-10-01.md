# D199 phase 3: QC two-reader agreement, SCORE. Librarian, the non-author scorer, on D, 2026-10-01 06:4x.

**Inputs (sha256):**
- units `loop/qc_units_2026-10-01.md` `f9ef72c5…f502` (both readers checked it first);
- B `loop/qc_read_B_2026-10-01.md` `9684f5ca…aeb7`;
- C `loop/qc_read_C_2026-10-01.md` `f78ee248…888f` (git-blob `c24b6019…`, = the ring's).

**Command** (from `exo_memory/loop/`): `node claimrec/score_q3.js qc_read_B_2026-10-01.md qc_read_C_2026-10-01.md --n 60`

| quantity | value |
|---|---|
| B | YES 12 · NO 42 · CAN'T TELL 6 |
| C | YES 12 · NO 42 · CAN'T TELL 6 |
| raw agreement | **52/60 = 86.7%** |
| κ | **(60·52 − 1944)/(3600 − 1944) = 1176/1656 = 0.7101** |
| CAN'T TELL | B 10.0% · C 10.0% (bar 25%) |

**VERDICT: USABLE (κ ≥ 0.60). Jev runs (phase 4).**

- **All 8 disagreements involve a CAN'T TELL.** Not one unit is YES against NO: U02 U07 U08 U11 U12 U18 U55 U58.
- **The consensus**, written now, BEFORE any Jev call: `loop/qc_consensus_2026-10-01.md`, sha256 `36580d39…b023`. It has 52 units:
  YES 10 · NO 40 · CAN'T TELL 2.
- **The power floor** (the plan: fewer than 10 consensus YES → NOT POWERED) is **met at exactly 10.** No top-up.
  - A thin margin, stated: with 10 positives, one Jev miss moves κ noticeably.

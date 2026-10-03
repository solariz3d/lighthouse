# Finish the retrieval line: every open item, in chunks. Librarian, on D, 2026-10-03 03:5x. Laps D217–D220.

The keeper, 03:52: "lets finish it all". Open items, as of `librarian/2026-10-01.desktop.md` and the 10-02 scores:
1. **The second reader's shadow week** (D203): 56/60 rows. Scored by B at 60.
2. **The SOURCES gate's live week** (D212/D214/D215): 31/60 decisions. Scored at 60 or on 10-09.
3. **The seat → seat correction count:** the second direction. B's QS2S draft rev 2 (`loop/qs2s_draft_2026-10-02.md`) needs its
   two-reader test, then the count. This settles D208's registered falsifier: "the keeper is the room's main corrector".
4. **The last ungated surface: replies to the keeper.** K stratum, 0/81 labelled. A Stop-hook slot.
5. **The Consonance rebuild**, so the seats' brief carries item 8: the built `BUILDING.md` has 0 mentions of the SOURCES line, the source has 2.
Chunks 1–3 generate the hand-offs that fill items 1 and 2. **One heavy job at a time (the heavy-run lock), as since 09-30.**

## Chunk 1 (parallel, disjoint files)
- **D217, E: the QS2S units.** File-anchored, per B's finding (seats correct each other in FILES).
  - A unit = (X's claim or choice, Y's response) drawn from hand-back verdicts, librarian collations/rulings and WRONG entries,
    09-14..10-02 on D.
  - Seeded draw of 60. B's eligibility rules from the draft. B's 62+18 grep floor is NOT the sampling frame (that would pick by keyword).
  - Freeze with sha256. Hygiene as D199.
- **D218, A: the reply slot, built in SHADOW.**
  - A **Stop hook** for the librarian and chair sessions only (by `CONSONANCE_PANE` / instance dir). It fires on a reply to the keeper
    that names a path, sha, commit, count `N/M`, percentage or version.
  - It then requires a final `Sources:` line whose items match calls in that turn (the gate's matcher, reused).
  - **Shadow week:** it logs what it WOULD block (`C:\Consonance\data\reply-slot.jsonl`) and never blocks.
  - Verify the Stop-hook contract in the current docs: `decision: block` plus a reason, and the `stop_hook_active` loop guard.
  - Keep-warm "ok" replies carry no token and pass untouched.
  - Tests + mutants. B's look.
- **D219, the chair: the Consonance rebuild in a SEPARATE target dir** (the T-180 pattern), after A's and E's node jobs release the
  lock. Do not touch the running app. The keeper restarts when it suits him.

## Chunk 2 (after D217's units)
- **QS2S two-reader test:** readers **C and A**. Not B, who wrote the question; not E, who built the units. Blind to each other.
  - The librarian scores κ against the QC bars: ≥ 0.60 USABLE; 0.40–0.60 one sharpening; < 0.40 fails for the readers.
- If USABLE: **E runs the scripted R1/R2 Sonnet passes over the full file-anchored pool** (the D208 pattern). The librarian scores the
  count and settles the falsifier.

## Chunk 3 (as each week fills)
- **The second reader:** at 60 rows, B scores per D203 (≥ 30 flags confirmed blind, ≥ 0.50 → KEEP; > 1 in 3 rings flagged → DROP).
- **The SOURCES gate:** at 60 decisions, the librarian scores P1/P2/P3. B spot-reads 20 ALLOWed rings for perfunctory sources.
- **The reply slot:** after its shadow week, B confirms a sample of would-blocks. If they are real (≥ 0.50) and fire on ≤ 1 in 3 replies
  with tokens, it goes live (block).

## Registered now
- **QS2S count prediction (librarian):** seat → seat corrections exceed keeper → seat (97 in the D208 frame) over the same window.
  The basis is B's floor of 62 + 18 in hand-backs alone. If they come in fewer, "the seats correct each other more than the keeper
  corrects them" is wrong.
- **The reply slot's shadow week:** it is decoration if, in its first 30 would-block rows, fewer than half name a claim that really
  had no source opened in the turn.

NEXT: chair dispatch chunk 1 (D217 to E, D218 to A; D219 rebuild after the lock frees) when this plan is read

## D217 collated + RULING (librarian, 04:0x): `handback/p-d217-E_2026-10-03.md` (git-blob `b035fe89…`), commit `17da7fb0` in `e-d217-wt`
- 407 eligible, 60 drawn, stratified H 30 / R 15 / W 15, seeded per stratum. B's grep floor is not the frame.
- **E's §4: only 37 units can be read by both C and A** (each skips the units whose Y side it wrote). κ on 37 is too thin against the
  60 the QC test used.
- **RULING: before any read, E re-draws for the READERS' overlap.** From the same seeded per-stratum order, take units in order,
  skipping any whose Y side C or A wrote, until the H 30 / R 15 / W 15 quotas are met: **60 units both readers can read.**
  - Freeze it as v2 (new sha256). The v1 file stays as a trace. No reader has seen either, so this is not an abuse case.
  - Units whose Y side C or A wrote are a known blind spot of this read: a seat's own corrections are judged only by others. Stated.
- **OUTPUT → NEXT: changed.** E freezes v2. Then C and A read all 60 blind.

## QS2S two-reader SCORE (librarian, 04:2x): BORDERLINE
- `qs2s_read_A_2026-10-03.md` sha256 `4e8f7eb8…`, `qs2s_read_C_2026-10-03.md` sha256 `0c0ec80a…`, both over v2 (`64e4cb20…`).
- **κ(C, A) = 0.508** (48/60). A: YES 9 / NO 46 / CT 5; C: YES 8 / NO 44 / CT 8. Splits: 9 involve a CAN'T TELL (YES/CT 2, CT/NO 3,
  NO/CT 4); 3 are YES-vs-NO (NO/YES 2, YES/NO 1).
- **By the QC bars, 0.40–0.60 is BORDERLINE: one sharpening of the wording, re-run on 40 FRESH units, no second sharpening.**
  - B (the question's author) sharpens QS2S, aimed at the CAN'T-TELL band: what makes a response "correcting" when it adds a
    finding next to X's.
  - E draws 40 fresh units from the same frame and seeded order, past v2's units, readable by both C and A.
  - C and A read blind. If κ ≥ 0.60, E's scripted count runs. If not, QS2S closes NOT USABLE and the falsifier stays open.
- **The reply-slot's first live rows (`C:\Consonance\data\reply-slot.jsonl`):** this seat's 10:16Z reply was `skip-not-keeper-ring`. The
  slot skips replies whose prompt was a pane ring. **But in this pane the keeper reads every one of those replies.** Most of today's
  keeper-facing prose answered a pane ring. **RULING (shadow, so it is reversible):** in the LIBRARIAN session, replies to pasted
  `[pane:` rings count as keeper-facing. Keep-warm and machine prompts stay skipped. In the chair session, ring replies stay skipped (the
  keeper reads the chair less). A folds this into D218 before B's look ends.

## RULING on D217 v3 (librarian, 04:2x): `handback/p-d217-E-v3_2026-10-03.md`
- R has only 6 fresh units past v2 (21 eligible in all). **Option 1: H 20, R 6, W 14 = 40**, the same seeded order past v2, with C/A
  Y-sides skipped.
- Why: the bars were fixed at 40 fresh units, and n matters more than the stratum ratio for κ. Option 2 (24 units) under-powers the one
  allowed re-run. Option 3 drops rulings, a real channel of seat → seat correction, from the test that decides usability.
- The composition shift (3.3:1:2.3) is stated in the score. κ is reported pooled and per stratum where n allows.

## QS2S RE-RUN (r3 on v3) SCORE (librarian, 04:4x): NOT USABLE. The question closes.
- `qs2s_read3_A_2026-10-03.md` sha256 `9665d861…`, `qs2s_read3_C_2026-10-03.md` sha256 `041a11e7…`, over v3 (`f5139547`).
- **κ(C, A) = 0.4545** (31/40). A: YES 11 / NO 28 / CT 1; C: YES 9 / NO 30 / CT 1.
  Splits: YES/NO 4, NO/YES 3, CT/NO 1, YES/CT 1.
- **The sharpening worked on what it aimed at and moved the disagreement elsewhere.** CAN'T TELL fell from 13 answers to 2. YES-vs-NO
  splits rose from 3 of 60 to 7 of 40. The readers now commit, and disagree about WHICH cross-seat responses are corrections.
- **By the bars, with no second sharpening allowed: QS2S closes NOT USABLE.** The seat → seat count does not run on this question.
  D208's registered falsifier ("the keeper is the room's main corrector") **stays OPEN**: half-answered, with the keeper → seat half
  at 14.9%.
- **A's disclosure, weighed:** A had read the plan's QS2S score section (aggregate κ and split counts, no unit answers) before this
  packet. That could only push A away from CAN'T TELL. The verdict fails regardless, so the exposure changes nothing. Recorded.
- **What this teaches, stated as a reading and not a finding:** the keeper's corrections are judgeable in one message (QC κ 0.71). A
  seat's correction of another seat lives inside technical content that the reader must itself judge. That is the regress the keeper
  named on 10-02: the reader must retrieve too.

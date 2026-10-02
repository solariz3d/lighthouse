# D208 — the bidirectional-correction count, first direction: keeper → seat. Librarian, on D, 2026-10-02 05:4x.

The keeper, 05:44: "I meant no one is working like no panes or seat". The retrieval line's owed instrument, run now.

## Why
- **BOOT's 2026-08-23 amendment:** *"it is prose if, one season on, the bidirectional-correction count has still never been run with
  its amended unit."* It has never been run.
- **The question is proven fair:** QC, *"is the keeper correcting something the seat said or did?"*, reached κ(B, C) = **0.710** on 60
  units (`loop/qc_agreement_score_2026-10-01.md`).
- Jev failed it (κ 0.371), so the count is run by **Claude readers**, on the subscription.

## The run (E builds, A and C read, the librarian scores; strict wait-for-all)
1. **E: units.** The FULL eligible pool from D199's frozen builder, all 651, cut at that build's recorded last timestamp (the 10-01
   ruling). Use `C:\Consonance\sealed\qc_2026-10-01\d199_phase1\build.js --n 651`. U01–U60 must come out identical to
   `qc_units_2026-10-01.md` (sha256 `f9ef72c5…`). If they do not, E stops.
   - Hygiene exactly as D199: drop private, credential and Third Place units, counted.
   - Output: `loop/qc_pool_units_2026-10-02.md` + sha256, split into two halves by unit number (odd / even) for the readers.
2. **Readers: Sonnet via `claude -p`, two independent fresh calls per unit** (the claimrec harness pattern, no shared context; E runs it
   under the heavy-run lock). Prompt = QC verbatim + the unit. Answer YES / NO / CAN'T TELL. Two reader passes, R1 and R2, each over all
   651.
   - This replaces pane-reading 651 units by hand. Panes A and C instead each read a **check sample of 60** (A the odd, C the even half,
     30 YES-by-R1 + 30 random), blind to R1/R2, to measure the scripted readers against pane readers.
3. **Librarian scores:**
   - κ(R1, R2) over 651. **Bar ≥ 0.60** (the pane bar QC passed) → the count stands. Below → NOT USABLE, reported.
   - κ(R1/R2 consensus, pane check sample). Reported. If < 0.60, the count is labelled "scripted readers diverge from pane readers".
   - **The count:** keeper corrections = the units where R1 and R2 both say YES. Reported per seat (librarian / chair), per week, and
     as a rate over keeper turns. Its denominator is these sources only (the Third Place drop is 13% of turns and rich in corrections,
     stated).
   - **It is a count of a record, never a verdict on the keeper or a seat.**
4. **Later directions, not this lap:** seat → seat (pane catches of the chair and the librarian) and self-corrections. Those need
   their own question and two-reader test.

## Registered before any read
**Prediction (librarian):** 15–25% of keeper turns are corrections (D199's consensus had 10 YES of 52 agreed = 19%).
**Falsifier for "the keeper is the room's main corrector":** if the keeper → seat count is below the seat → seat catches already
recorded in the WRONG columns over the same window, that reading is wrong. This lap only gets the first half; the second is owed.

NEXT: chair dispatch D208 step 1 to E when this plan is read

## B's QS2S draft, read (librarian, 05:4x): `loop/qs2s_draft_2026-10-02.md`, `handback/p-d208-B-draft_2026-10-02.md`
- **B's key finding, adopted for the second direction:** QC's turn-pair unit does not transfer. Seats correct each other in FILES
  (hand-back verdicts, collation rulings, WRONG entries), not in the next message, because rings carry pointers. So seat → seat needs a
  **file-anchored unit**, or it undercounts systematically. B's grep floor: 506 hand-backs from 09-14 to 10-02, 62 with an explicit
  cross-seat correction marker, 18 NOT GREEN. These are a floor, not a count.
- The QS2S wording (Y corrects X, with self-correction excluded and gates excluded) is a sound base. It goes to its own two-reader test in
  a later lap, after D208's first direction is scored. Not registered yet.

## Steps 1–2 collated + scored (librarian, 07:2x): `handback/p-d208-E_2026-10-02.md` (git-blob `1f165317…`), commits `889588c8` (pool) + `0febf282` (reads) in `e-d208-wt`
- The pool, 651 units, sha256 `1ddcc052…9f2f`. Cut RECOVERED at `2026-10-01T12:36:19.560Z`: the only prefix that reproduces every
  build.log count. U001–U060 reproduce D199's `f9ef72c5…`. 617 librarian units, 34 chair.
- **κ(R1, R2) = 0.8676** (622/651 = 95.5%), CAN'T TELL 3.8% / 4.3%. **USABLE.**
  `node claimrec/score_q3.js qc_pool_read_R1_2026-10-02.md qc_pool_read_R2_2026-10-02.md --n 651`. R1 sha256 `d6072805…`,
  R2 `c1a4e6d3…`. R1: YES 103 / NO 523 / CT 25; R2: YES 108 / NO 515 / CT 28.
- **Caveat, the reason step 3 exists:** two passes of ONE model agree more than two different readers would (same-model echo). The pane
  check sample is the outside.
- **Check samples drawn** (seeded `sha256("D208-CHECK|"+id)`, order `"D208-ORDER|"`): per half, the first 30 R1-YES + the first 30 others.
  - `loop/qc_check_A_2026-10-02.md` sha256 `f5f72fac…e0f3` (odd half) and `loop/qc_check_C_2026-10-02.md` sha256 `2613688d…e556` (even half).
  - The key (which were R1-YES) is in `C:\Consonance\sealed\qc_2026-10-01\d208\check_key_librarian.json`, outside the repo.
  - Scan: 1 bare `sk-or-` prefix in A's file, text ABOUT keys, no body (E's §1 named these).
- U650's R1 answer comes from a re-send (E's parser). One deviation, noted. It is in the odd half and in neither sample's YES stratum
  unless drawn; scored as recorded.
- **OUTPUT → NEXT: changed.** A reads `qc_check_A`, C reads `qc_check_C`, blind to R1/R2 and to each other. Files go to
  `loop/qc_check_read_{A,C}_2026-10-02.md`. Then the librarian scores κ(R-consensus, panes) and the count.

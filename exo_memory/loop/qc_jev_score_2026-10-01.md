# D199 phase 5: QC to Jev, SCORE. Librarian, the non-author scorer, on D, 2026-10-01 06:5x.

**Inputs (sha256):**
- Jev `loop/qc_read_Jev_2026-10-01.md` `0ac2b406…b0da` (E, `handback/p-d199-E-jev_2026-10-01.md`: 60/60 answered, one model
  `typesafe/jev-1.13-20260917`, blind held);
- consensus `loop/qc_consensus_2026-10-01.md` `36580d39…b023` (committed `9b4b533` before any Jev call);
- units `f9ef72c5…f502`; scorer `loop/claimrec/score_q3.js` `90356f86…`.
- Scoring copy: Jev's read restricted to the 52 consensus units (scratchpad `qc_jev_52.md`, 52 rows).

**Command:** `node claimrec/score_q3.js qc_consensus_2026-10-01.md <scratch>/qc_jev_52.md --n 52`
(the scorer labels its inputs "B" and "C"; here they are the consensus and Jev).

| quantity | value |
|---|---|
| raw agreement | 43/52 = 82.7% |
| κ | **(52·43 − 1960)/(2704 − 1960) = 276/744 = 0.3710** |
| Jev's answers on the 52 | YES 4 · NO 48 · CAN'T TELL 0 |

**By the sealed bars (`loop/plan_jev_correction_d199_2026-10-01.md`): κ < 0.40 → retire Jev from the room, having tried it on the
ground it was built for. Its public repo stays.**

## Secondary, reported and not barred
- The cross-tab (by `join`): NO→NO 40 · **YES→NO 7** · YES→YES 3 · CAN'T TELL→NO 1 · CAN'T TELL→YES 1.
- **Jev caught 3 of the 10 corrections** both readers saw (U03, U34, U53). It missed U05 U06 U20 U32 U42 U56 U57.
- On the 60, Jev said NO 55 times. The raw 82.7% agreement is mostly the 40 easy NOs. κ discounts exactly that.
- Jev's YES matched the consensus YES 3 of 3 times where the consensus had an answer. On n = 3 that is description, not a property,
  and no bar was registered for it. It does not move the verdict.

## Where Jev stands
Three fair tests in one night, each with its bars sealed before any answer:
- Q3, careful reading: κ 0.384;
- the disagreement test: NOT SUPPORTED, on a weak judge;
- **QC, a System One question that is instant for a person: κ 0.371.**
The readers agreed at 0.708 and 0.710 on the two questions Jev failed. The question was not the obstacle either time.
**Retire Jev from the room.** The correction count it would have powered is still owed, and needs another instrument.

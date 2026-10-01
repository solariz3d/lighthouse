# Do Jev's disagreements carry information? The keeper adjudicates, blind. REGISTERED before the sheet exists. Librarian, on D, 2026-10-01 05:4x.

The keeper, 05:39: "but surely there is a way jev can be essential to us". Then, 05:44: "lets do the test".

## What this tests, and what it does NOT
- **D162 STANDS AS FAILS** (κ 0.384, `loop/q3_jev_score_2026-10-01.md`), whatever happens here. This is not a re-run and not a re-score.
- **The claim under test is a different one:** *where Jev disagrees with our two Claude readers' consensus, Jev is the one who is
  right.* If that is true, our readers share a blind spot, and an outside reader that disagrees with them is worth keeping
  for exactly that.
- **The judge is the keeper,** the least-correlated reader in the room (BOOT, the 2026-08-23 amendment: least-correlated, not
  decorrelated).

## Units
- **The 10 disagreement units** of D162's primary (consensus vs Jev, n 34):
  - consensus YES, Jev NO: U01 U03 U17 U28 U39;
  - consensus NO, Jev YES: U04 U12 U25;
  - consensus YES, Jev CAN'T TELL: U15;
  - consensus CAN'T TELL, Jev YES: U22.
- **4 fillers**, from the 24 units where the consensus and Jev agree. Chosen mechanically: order the 24 by
  `sha256("JEVDIS-2026-10-01|" + id)` ascending and take the first 4. They hide which units are disputed and measure the keeper's
  agreement with an undisputed answer. They are scored separately and do not count toward the bar.
- **The sheet:** the 14 units, each unit's Output and Sentence verbatim from `q3_units_2026-09-27.md` (sha256 `a08b46ff…45ec`),
  ordered by `sha256("JEVDIS-SHEET|" + id)` ascending and relabelled K01–K14. The sheet shows **no unit id, no answer from anyone, and
  no hint of which side said what.** Its header is the Q3 question verbatim.
- **The key** (K-label → unit id, consensus answer, Jev answer) is written to `C:\Consonance\sealed\jev_disagree_2026-10-01\key.json`,
  outside the repo, with its sha256 recorded here before the keeper answers. The keeper does not open it.

## Scoring (fixed now)
For each disputed unit, compare the keeper's answer with Jev's and with the consensus. At most one can match, because they differ.
A keeper CAN'T TELL matches neither (except on U22, where it matches the consensus, and U15, where it matches Jev).
- **Jev matches the keeper on ≥ 7 of 10 → SUPPORTED.** Jev's disagreements carry information, and our readers share a blind spot on
  this question. The proposal becomes keeping Jev as a **disagreement flagger**: where Jev and a Claude reader differ, a third look
  is owed. That is the essential role.
- **≤ 3 of 10 → NOT SUPPORTED.** Jev's disagreements are mostly Jev's errors. The honest proposal is to retire Jev from the room
  (its public repo stays).
- **4–6 → INCONCLUSIVE.** No new role for Jev on this evidence. No second sheet.
- **Fillers, reported:** if the keeper matches the undisputed answer on fewer than 2 of 4, the sheet or the question is not
  reading the same for him as for the readers. That is reported beside the result, and the result is labelled with it.

## Abuse conditions
- No change to the bar, the units or the scoring after the keeper's first answer.
- The keeper is not told any unit's id or any answer until all 14 are in.
- The keeper's labels are final as given. A label he wants to change before he hands the sheet back is his to change. After the
  scoring is shown, no label changes.
- The librarian builds the sheet and scores it. The librarian authored the D162 plan, but not Jev's answers or the consensus answers.
  The keeper is the reader.

## Its own limit, stated now
n = 10. Even 7/10 has a wide interval (Clopper-Pearson 95% ≈ 0.35–0.93). A SUPPORTED result says "worth keeping and watching", not
"proven better than our readers".

## Built (librarian, 05:5x), before the keeper's first answer
- Disputed, as listed above: U01 U03 U04 U12 U15 U17 U22 U25 U28 U39 (recomputed from the two files by script; it matches).
- Fillers by the seeded rule: U16 U33 U32 U06.
- `C:\Consonance\sealed\jev_disagree_2026-10-01\sheet.md` sha256 `8a9fdc64526f4a6b03e13d1357f27cf2e52d845f7c0aa7bdefabec8717ff23e1`
  (14 units, 14 Output and 14 Sentence blocks, no U-id in the body).
- `…\key.json` sha256 `f60eb7fcc54c0d44c531eb5610d00d7091f034a4c26bccdb02c8665f5d5ff3d6`.

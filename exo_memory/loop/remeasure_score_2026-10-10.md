# Did the gates make the room LESS WRONG? The 10-03 re-measure: SCORE. Librarian, the non-author scorer, on D, 2026-10-10 11:1x.

Registration: `loop/remeasure_registration_2026-10-03.md`. It also serves as the "before" number for H3 (`loop/plan_lighten_the_load_2026-10-09.md:22`, (b)).

## Inputs (each hashed by me, sha256)
- B's verdicts `C:\Consonance\retrieval\remeasure1003\verify\B\verdicts.json`: `afe45637ba8124ecde70e7abcdc493cbc6017cf138b34bf276d0e6cf06b82a7e`. This matches B's hand-back (`handback/p-verify-B_2026-10-10.md`).
- B's claims, unchanged: `f5d1689404b044b0bb8865a536a4ee55e25b457d1532ea56a0f8f58e393eb56d`.
- C's verdicts: `43783f4644df448a23bfb2fe0d1274ae4c474d6cf5dd8431b163c86ad1969543`. This matches C's hand-back (`handback/p-verify-C_2026-10-10.md`).
- Command: `node exo_memory/loop/claimrec/score_base_rate.js <B verdicts.json> <C verdicts.json>`. Output kept at the librarian's scratchpad `step7_score.out`.

## The scorer's output, verbatim
```
claims B 168 · C 186 · overlap 56 · unique 298 · messages 100
κ kind 0.823 (agree 87.5%, n 56) · κ verdict 0.657 (agree 97.1%, n 35)
overlap kind splits: between unchecked kinds 0 (kept pooled only) · involving CHECKED/NOTCLAIM 7 (excluded)
P(wrong|CHECKED) = 0/61 = 0.000 · CP95 0.000-0.059 · boot95 0.000-0.000 · UNVERIFIABLE 0/61 = 0.000
P(wrong|STATE) = 2/83 = 0.024 · CP95 0.003-0.084 · boot95 0.000-0.067 · UNVERIFIABLE 3/86 = 0.035
P(wrong|CONCLUSION) = 0/16 = 0.000 · CP95 0.000-0.206 · boot95 0.000-0.000 · UNVERIFIABLE 5/21 = 0.238
P(wrong|UNCHECKED) = 2/99 = 0.020 · CP95 0.002-0.071 · boot95 0.000-0.055 · UNVERIFIABLE 8/107 = 0.075
step conclusion−state -0.024 boot95 -0.063..0.000 not shown · step state−checked 0.024 boot95 0.000..0.065 not shown
DG1 UNVERIFIABLE share of unchecked 0.075 (>0.50: false) · DG2 verdict-bearing unchecked 99 (<60: false) · DG3 κ verdict 0.657 (<0.40: false) · CHECKED claims 61 (<15 partial: false)
```
None of the diagnostic gates (DG1–DG3) tripped, so the result is readable.

## Against the registration
| registered | result | reading |
|---|---|---|
| Prediction: the post-gate pooled WRONG rate is below 0.049 | **2/99 = 0.020** (CP95 0.002–0.071) | Below, as predicted. **Not shown**, as registered in advance: the N cannot show a fall. |
| Harm: WORSE if the bootstrap lower bound exceeds 0.049 | boot95 lower bound 0.000 | **Not worse.** |
| The CHECKED share rises by at least 10 points over D201, or the reading is "ritual" | D201: 41 CHECKED of 134 verdict-bearing = **30.6%** (`label_watch_score_first_read_2026-10-01.md:24–27`). Now: 61 of 160 = **38.1%**. | **+7.5 points. The bar is MISSED.** By the registration's own wording, the gates changed the form of hand-offs more than the claims inside them: **"ritual"**. |

- Cross-check on the pre-gate L120 sample (`claim_base_rate_score_2026-09-27.md:25,28`): 72 CHECKED of 235 verdict-bearing = 30.6%, the same as D201. So the +7.5 does not depend on which pre-gate sample is used.
- Registration note: it says "42 CHECKED" for D201, but D201's score file prints 41 (`:24`). I used the file. With 42, the rise is 7.1 points, which also misses.

## What it means (inferred, marked)
- **Errors:** 2 wrong in 99 unchecked claims, against 8 in 163 before. That is a lower point estimate, but the intervals overlap, so this alone does not show the gates made the room less wrong. It does not show they made it more wrong either.
- **Checking:** more claims arrive checked (+7.5 points), but less than the registered bar. The falsifier fired, and I'm reporting it that way.
- **For H3:** this is the "before" number. The light rule layer is REVERTED only if its re-measure is worse than 4.9% by more than its own 95% interval. Today's 2.0% does not change that registered anchor. inferred: a bar measured against this sample's 2.0% would be stricter. That is a new registration, not this one.
- **Agreement:** κ verdict 0.657, with 97.1% raw agreement on the 35 overlap claims both seats called claims. Kind agreement κ 0.823. The two verifiers mostly agree.

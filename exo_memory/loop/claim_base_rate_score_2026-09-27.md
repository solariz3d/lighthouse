# The base rate — SCORE. Librarian, the non-author scorer (registration §9), on L, 2026-09-27 04:1x.

**Inputs, hash-recorded before scoring:**
- the registration `loop/claim_base_rate_registration_2026-09-27.md`, sha256 `b6910a78…` (sealed at `cf2439b`);
- the verifier files: B `verdicts.json`, sha256 `a444e143…`, 193 rows; C `verdicts.json`, sha256 `3e67ea78…`, 164 rows.
  C's was recorded at `e4c34fd` before B filed, and B's at the next commit. Both claims files are unchanged.
- the hand-backs `handback/p-l120-verify-B_2026-09-27.md` (git-blob `82183012…`) and
  `handback/p-l120-verify-C_2026-09-27.md` (git-blob `35153989…`).

**Scorer:** `loop/claimrec/score_base_rate.js`, written from §5, §8 and §9.
- B labels kinds `STATE` / `CONCLUSION` / `NOT-A-CLAIM`, and C labels them `UNCHECKED STATE` / … / `NOT A CLAIM`. The
  script maps both onto one set.
- **One rule the registration left open, declared here before reading any rate.** When B and C split on a claim's
  KIND on the overlap:
  - a split between the two unchecked kinds counts in the pooled unchecked rate, not in the per-kind rates (8 claims);
  - a split involving CHECKED or NOT-A-CLAIM is excluded (14 claims).
- **Verdict splits follow §9's rule:** UNVERIFIABLE wins a CORRECT/WRONG split.

## The numbers

300 unique claims from 100 messages; 57 on the overlap.

| | WRONG / verdict-bearing | rate | CP95 | cluster-bootstrap 95 | UNVERIFIABLE |
|---|---|---|---|---|---|
| **UNCHECKED, pooled (p)** | **8 / 163** | **0.049** | 0.021–0.094 | 0.013–0.093 | 11 / 174 (6.3%) |
| unchecked STATE | 6 / 115 | 0.052 | 0.019–0.110 | 0.008–0.108 | 7 / 122 |
| unchecked CONCLUSION | 1 / 41 | 0.024 | 0.001–0.129 | 0.000–0.086 | 3 / 44 |
| CHECKED | 1 / 72 | 0.014 | 0.000–0.075 | 0.000–0.045 | 0 / 72 |

**The steps (§5; "shown" only if the bootstrap 95% excludes 0):**
- conclusion − state: **−0.028** (−0.096 to 0.041), **not shown**, and pointing the other way;
- state − checked: **+0.038** (−0.016 to 0.101), **not shown**.

**Agreement (§9, overlap):**
- **κ verdict 0.664** (89.1% agree, n = 46);
- **κ kind 0.418** (61.4% agree, n = 57). The two readers agree on whether a claim is right far better than on what
  kind it is.

**DG1–DG4: none fires.**
- UNVERIFIABLE is 6.3% of unchecked claims. C's feared as-of gap did not appear.
- There are 163 verdict-bearing unchecked claims (the floor is 60).
- κ verdict is 0.664 (the floor is 0.40).
- There are 72 CHECKED claims (the partial floor is 15).

## The verdict, by §10's table (fixed before any number)

- **The read interval is the wider of the two, the bootstrap: 0.013–0.093.**
- **p = 0.049 ≤ 0.05, and the upper bound 0.093 ≤ 0.10, so the row is "MARK, DON'T BAN IS ENOUGH."**
- **It is borderline:** p sits 0.001 under the 0.05 line.
- **No per-kind rule:** neither kind lands in a higher row, and the step is not shown.

**E's sealed predictions:**
- state 0.10, conclusion 0.20, checked 0.04, UNVERIFIABLE 0.30, κ 0.60, the middle row;
- **every rate came in lower.** Conclusions came in **lowest** among the unchecked kinds, not highest. Only κ verdict
  (0.66) landed near the prediction.
- **So the predicted row was wrong by one row, toward safety.**

## What it means, plainly

- **An unchecked claim here is right about 95 times in 100.** The keeper's correction at 02:02 holds on the numbers:
  unchecked is not wrong, and it should not be treated as wrong.
- **The unchecked leap, the conclusion, was not riskier in this sample** (1 wrong in 41). "Two true facts joined" is
  usually joined correctly.
- **The rule that fits is to label, not to ban:** a claim says whether it was checked, and a reader who is going to act
  on it checks it first.
- **The volume argument still stands, and now it has a size.** At about 5%, a room writing thousands of claims a week
  still lands many wrong ones. Arms 1–2 found those wrong claims hard to tell apart from the right ones. Marking lets the
  reader, not the writer, decide what to check.

**Limits:**
- The frame is all messages, most of them tool-written notes, so this is not a rate for replies to the keeper.
- The kind κ is weak (0.42), so the kind split carries less weight than the pooled rate.
- The claims came through arm 1's extractor, whose recall was 16 of 17.
- One machine (L), one window (09-14 to 09-23).
- n = 163 unchecked.

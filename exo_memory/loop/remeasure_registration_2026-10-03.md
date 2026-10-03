# Did the gates make the room LESS WRONG? The base-rate re-measure, REGISTERED before any post-gate sample. Librarian, on D, 2026-10-03 06:1x.

The keeper, 06:05: "did we figure it out?" The answer so far: compliance went up (the gate passed its bars,
`loop/chunk3_scores_2026-10-03.md`), but whether error went down is unmeasured.

## The comparison
- **Before:** the L120 base rate, unchecked claims wrong at 8/163 (`loop/claim_base_rate_score_2026-09-27.md`, the R19 harness:
  registration `loop/claim_base_rate_registration_2026-09-27.md`).
- **After:** the SAME harness (R19 §1–§9 by reference: frame, M = 100 messages, K = 3 claims, arm 1's reader, verifiers B + C, the same
  verdict rules), with the window moved to the gated period. Window start: 2026-10-03 05:55 local (the reply slot live; the gate has run
  since 10-02 19:58Z). Window end: 7 days later, or when the frame holds ≥ 100 eligible messages, whichever is later.
- **Also reported:** the share of claims the verifiers call CHECKED (vs unchecked). The gates should raise it.

## Predictions and falsifier (fixed now)
- **Prediction:** the post-gate pooled WRONG rate is below 0.049, and the CHECKED share rises.
- **The N limit, stated in advance:** R19 §2.4 already showed that a fall from 0.049 to 0.025 needs about 970 unchecked claims per arm.
  This sample has about 160. So a fall **cannot be shown** at this N. The rate is printed, not gated.
- **What CAN be shown:** the CHECKED share. Pre-gate it was 42 CHECKED among the 2026-10-01 D201 verifier sample (`loop/chunk3_scores…` /
  `label_watch_score_first_read_2026-10-01.md`: P(wrong|CHECKED) on 41–42 claims). **If the CHECKED share does not rise by at least
  10 points over D201's sample, the gates changed the form of hand-offs and not the claims inside them: "ritual".**
- **Harm reading (as R19):** if the post-gate WRONG rate's bootstrap lower bound exceeds 0.049, it is printed WORSE.

## Who
E builds the frame and extraction (E is excluded from verifying, as before). B and C verify blind. The librarian scores. Run after the
window closes. Not dispatched until then.

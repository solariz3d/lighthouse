# Claim recognition — SCORE. Librarian, the non-author scorer (registration §9), on L, 2026-09-27 01:3x.

**Inputs, hash-checked:**
- the registration `loop/claim_recognition_registration_2026-09-27.md`, sha256 `0cea938b…` (sealed at `c8c18d4`);
- the key `C:\Consonance\retrieval\l115\key\unitkey.json`, sha256 `de64024e…` (A re-derived it under `units.js` sha256
  `cd6f7f00…`);
- the run `handback/p-l117-run-A_2026-09-27.md` (git-blob `128dd267…`): 22 readers and 22 coders, 44 of 44 clean;
- the rulings `a9c9931` and `be4b03b`, all made before any reader ran.

**Two scorers, run independently, agree to the third decimal:**
- B's harness: `node claimrec.js score --packets … --key …`;
- mine, written from the registration's text and not from the harness: `loop/claimrec/score_librarian.js`, which
  uses the exact hypergeometric chance from §4 and Clopper–Pearson intervals.

## THE RESULT: INDISCRIMINATE (not borderline)

| quantity | result | bar | E's sealed prediction |
|---|---|---|---|
| **HIT** | **16 of 17 = 0.941** (CP95 0.713–0.999) | ≥ 0.70 for FALSIFIED | 18/22 = 0.818 (band 16–20 of 22) |
| **median COST** | **0.662**. Over all 22 items it is 0.664; pooled over the scored items, 0.552 | ≤ 0.40 | 0.45 |
| **chance hit rate** | 0.666 | | |
| **LIFT** | **0.275** | ≥ 0.20 | ~0.30 |
| **DG1–DG4** | none fires. COST 0.66 < 0.80; 0 of 22 runs unusable; 0 of 844 statements unmapped; 0 of 17 keys over a third of their item | | |
| **disclaimed statements** (be4b03b point 4, descriptive) | 3 lines across the 22 answers. The secondary COST is unchanged to two decimals | | |

**By the sealed table:** hit ≥ 0.70 but median COST 0.66 > 0.40, so the outcome is **INDISCRIMINATE**. COST misses the
ceiling by 0.26, far more than one item, so it is not borderline.
- The one MISS is `d2cf9055ba51`, whose key covers 148 units' worth of text; its COST was 0.35.
- The 5 unkeyed items (W101, W124, W136, W140, W148) ran but were not scored, and are named (a9c9931).

**E's prediction:**
- **The outcome was right.**
- **HIT came in at the top of E's band.**
- **COST came in inside C's 50–80%, not at E's 0.45.** In E's own sealed words: *"If the median lands inside C's
  50–80%, C's reading of the pool was better than mine."* It was, and the length argument was weaker than E priced it.
- **LIFT landed where predicted.**

## What it means, plainly

- **Fresh readers asked outright almost always name the known wrong claim as something to check: 16 of 17.**
- **They do it by naming about two thirds of everything.** A reader flagging that much at random would have caught 67%.
  The readers beat chance by 0.28, which is real but modest.
- **So these replies are mostly checkable state claims, and "spot the claim" does not discriminate.** The wrong one is
  recognisable, but so is nearly every sentence around it.

**For retrieval:**
- The failing step is **not** that a seat cannot see a claim as a claim. Readers see them easily, though with C's
  limit: fresh outside readers are an **upper bound** on a seat judging its own writing mid-turn.
- **The bottleneck is volume.** The seats write a great many unchecked state claims, and checking all of them is the
  cost nobody pays.

**This points at two next arms, both already named:**
- **C's stricter ask** (prior art §4 point 3; the registration deferred it to a second arm). Flag only statements whose
  truth depends on the current state of a named file, command or record, **and** that the reply shows no check for. Does
  COST fall while HIT holds?
- **Fewer unchecked claims at the source.** A reply that says less it hasn't checked, or cites what it checked, rather
  than a better detector.

**Limits, printed:**
- The readers were fresh third parties: an upper bound on in-turn recognition (C §4 point 4).
- 17 of 22 items are tool-written notes, not conversational replies (E §8).
- 5 items could not be scored on L: their anchors are D-only.
- n = 17.

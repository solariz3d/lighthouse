# The label rule's watch, FIRST READ: SCORE. Librarian, the scorer, on D, 2026-10-01 09:3x. Lap D201.

**Registration:** `loop/label_rule_watch_registration_2026-09-27.md` (sealed L121), with A1–A5 (`c6f2b9c`) and A6 (`6177ae59`), all
committed before any post-rule unit was read.
**Inputs (sha256):**
- KEY `label_watch_key_2026-10-01.json` `7f89f0b2…184b`; PACKET `label_watch_packet_2026-10-01.json` `600a936c…a5cd` (E, `72d91ecf`);
- B `label_watch_read_B_2026-10-01.json` `8d4747b5…2f97` (194); C `label_watch_read_C_2026-10-01.json` `cdbde13e…5bff` (157).
**The scorer is the measured seat on K** (29 of 30 K units are the librarian's replies). On K, the outside is E's sealed §5.

## (a) THE LABELLED SHARE: the first 30 H + 30 K after exposure (from the KEY, by node, LABEL_RE as pinned)
| stratum | located claims | labelled | share | UNLOCATED |
|---|---|---|---|---|
| **H** (hand-backs, all D, 09-27 23:29Z → 09-28 07:31Z) | 78 | **1** (CHECKED) | **0.013** | 12/90 = 13.3% |
| **K** (replies to the keeper, D 27 / L 3) | 83 | **3** (CHECKED) | **0.036** | 7/90 = 7.8% |
| pooled | 161 | 4 | 0.025 | 19/180 |

**F1 (not used: share < 0.50) FIRES on H and on K.** DG-A2 does not fire (both ≤ 20%). DG-A3 does not fire.

## (b) and §3: the verifiers' sample (100 messages, 300 claims, D 94 / L 6)
`node claimrec/score_base_rate.js label_watch_read_B_2026-10-01.json <C wrapped as {rows}>`. C's file is a bare array, so the copy is
in the scratchpad. Labels and verdicts are joined by script on claimId.
- **Verifiers:** κ kind **0.582** (70.6%, n 51); κ verdict **0.679** (82.9%, n 35). DG-B3 does not fire.
- **Rates:**
  - P(wrong | CHECKED kind) 0/41;
  - P(wrong | STATE) 0/65;
  - P(wrong | CONCLUSION) 4/28 = 0.143;
  - **P(wrong | UNCHECKED, pooled) 4/93 = 0.043** (CP95 0.012–0.106), beside the pre-rule 8/163 = 0.049. No change is shown (§2.4: the N cannot show one).
  - UNVERIFIABLE share of unchecked 0.453; DG-B1 does not fire.
- **Harm (§2.4):** pooled post-rule WRONG 4/134 verdict-bearing = 0.030. Its bootstrap lower bound is below the 0.038 baseline. **Not WORSE.**
- **Self-labels on the sample:** UNLOCATED 119, UNLABELLED 180, **CHECKED 1**, INFERRED 0.
  - **Every WRONG was unlabelled or unlocated:** 2 UNLABELLED, 2 UNLOCATED. None of them carried CHECKED, so there are no false
    checks, and none carried INFERRED, so the rule was not working on them either.
  - **F2: NOT TESTED** (DG-B5: 1 self-CHECKED claim, fewer than 30).
  - **F3: NOT TESTED.** No labelled claim has two verifiers agreeing on its kind (n = 0). The one CHECKED claim was read by C only,
    as CONCLUSION.
  - The sample's UNLOCATED share (119/300 = 39.7%) is high. DG-A2 is registered on (a) only, so it decides nothing here. Reported.

## OUTCOME by §4
- **H: DECORATION (F1).** **K: DECORATION (F1).** F2 and F3 are NOT TESTED: there are too few labels to test whether labels are honest.
- **Against E's sealed §5:** predicted H 0.70 / K 0.35; measured H 0.013 / K 0.036. E's "WORKS on H" was wrong. Its F1-on-K was right in
  direction and far off in size.
- **Registered next: the SECOND READ** (the next 30 H + 30 K, same N, §1.5). Not a third: the abuse clause.

## What it means for retrieval, stated as the record supports it
The label rule landed in the briefs and was carried to every seat (0 NOT DELIVERED, A4). **It is not used:** 4 labels in 161 claims
straight after landing. That is the room's 167-ignored-reminders shape again: a rule in a brief does not reach the moment a sentence
is composed. It matches the retrieval file's own line: *"no cue moved it; the decision precedes every event a cue can ride on."* Per the
Third Place this morning and the record, what has worked elsewhere is **a second reader before delivery**, not a rule in a brief.

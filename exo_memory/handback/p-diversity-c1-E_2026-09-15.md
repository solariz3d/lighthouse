# P-DIVERSITY-C1 §2 · ECHO — C's numbers, read before anyone rules on them

**Pane E, machine D, 2026-09-15 11:40–11:55.** Packet `exo_memory/loop/packet_diversity_c1_and_leave2_2026-09-15.md`
§2 (lines 56-64). C's hand-back `exo_memory/handback/p-diversity-c1-C_2026-09-15.md` §8. The strip is frozen at
5a2d3c0; the rules are the draft's §8.2 and §8.7 R1–R4 (`loop/anchor_similarity_registration_DRAFT_2026-09-15.md`).
**Nothing in the repo was edited except this file.** All work ran in my scratchpad copy of C's `c1/`, offline, with
network attempts counted.

---

## 0 · THE VERDICT

1. **The hashes match.** No stop.
2. **C's arithmetic is right.** Two separate checks:
   - C's own scorer re-run on my copy reproduces `results-c1.json` BYTE FOR BYTE.
   - My separate implementation reproduces one P1 pair plus B's, and three P2 rows, to the fourth decimal.
3. **§8.2 as re-ruled was applied as frozen.** S40 ran on both sides; the primary is the token-weighted window-pair
   form; the centroid and |m| are unweighted; tokens are counted after the strip; CLS and SEP are on every window.
4. **§8.3 fires, and it keeps firing** against every variant I tried: packet versions, E's appendix cut, and six
   window phases.
5. **What the numbers do NOT carry is the reason given in the landing commit** (09c8ab3: "B's contesting read scores
   above E's compliant build, so the gauge measures content uptake, not anchoring").
   - **The comparison is not like for like.** E, the lower build that the fire rests on, is scored against a packet
     version missing the rulings it implements, and it is the longest text by far. Against A, the build with fewer
     confounds, B's read scores BELOW under every variant.
   - **The margin (0.0479) sits inside the instrument's own window-boundary noise:** 0.0118 to 0.0692 across phases.
6. **So:** the pre-registered consequence stands (rename to "content uptake" or pair with a polarity measure), because
   §8.3 fired as written. **These numbers cannot say the gauge is blind to polarity.** They say any polarity signal is
   smaller than the length and version effects in this one packet.

## 1 · THE HASHES, MINE, BEFORE ANYTHING ELSE

`sha256sum` in C's `c1/` on D (`C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-0845a868\0845a868-38f2-4cc2-b45a-431e0c088fb1\scratchpad\c1\`):

    score.mjs                    ecf03768c7a3b7c5413d3bbc97048f7ef24e83489cf62141500271fbf733eafb   matches
    results-c1.json              0d82c32c86addfc662b0c4414bef5fc22de6374a26c7a8cb043515cae554b71d   matches
    PREREG-C1.txt                51ef51d325d2d86260bb4e01f9d2b4b365b4688a2292f65157624f5ab4c80a2a   matches
    s40-strip@5a2d3c0.cjs        73917f673b7d98130fe8195cf953bd35c4fa3534dbf00c41da1492e039a4e087   matches — and equals
                                 `git show 5a2d3c0:dev/diversity/s40-strip.js | sha256sum` (2,412 B)
    models/…/model_quantized.onnx e7f6af7a9457d4fdd3af220c68e9a37325aad7c2d306bbc855fe0d019c326509  matches, 146,540,971 B
    also recorded: results-c1.run1.json 0851af3e…a66e · score.run1.mjs 47455b6e…6303 · block-net.cjs 03fcb5b1…d5f

The copy in my scratchpad re-hashed to the same values for the four files the scorer checks.

**The two runs.** §8 reports RUN 2 (`results-c1.json`, the hash it cites).
- `diff score.run1.mjs score.mjs` is exactly the two added report lines (`ownHandbackText`, `ownBriefText`, :174-175).
- `node cmp-runs.cjs results-c1.run1.json results-c1.json`: **410 fields in both, 410 equal, 0 different; 231 fields
  only in run 2** (11 × 21 rows).
- **The two runs do not differ in any number.** Run 2 only adds fields.

## 2 · RE-RUN, WITH C'S SCRIPT, OFFLINE

`node --require ./block-net.cjs score.mjs` in my copy, 11:42:49 → 11:45:54, exit 0:
- `NETWORK_ATTEMPTS=0 []`, via C's preload, which replaces `fetch`, `http(s).request/get`, `net`, `tls` and `dns` with
  counters. `score.mjs:26` also sets `env.allowRemoteModels = false`.
- The output `results-c1.json` hashes to **0d82c32c…554b71d, identical to C's file**. `cmp-runs.cjs` agrees:
  641 fields, 641 equal.

That covers every control, all three P1 pairs and all 21 P2 rows. **A byte-identical re-run proves determinism, not
correctness.** That is §3's job.

## 3 · MY OWN IMPLEMENTATION (`indep.mjs`)

It shares with C's scorer only the committed strip and the model files, both hash-checked. Everything else is written
separately:
- CLS and SEP from the vocabulary;
- the primary as the explicit window-pair cosine matrix;
- parents from `git log --reverse`;
- the model call checked against the library's own pipeline.

Offline, 11:46:25 → 11:47:46, `NETWORK_ATTEMPTS=0 []`.

    tokenizer            [CLS]=101 [SEP]=102 via convert_tokens_to_ids; C's tokenise('') route gives [101,102]; tokenizer.json's
                         post-processor is the [CLS] A [SEP] template (tokprobe.mjs)
    model call           manual CLS-pooled L2 window vs pipeline('feature-extraction', {pooling:'cls', normalize:true}), 930 tokens:
                         cosine 0.99999987, max |diff| 5.9e-8

    P1  E @99649d8       primary 0.6401 · centroid 0.7974 · share 0.0172 · 517/321 stripped · 8,641 tok · 5 win · |m| 0.8639 / 0.9422   = C
    P1  B-read @9e29daf  primary 0.6880 · centroid 0.8009 · share 0.0373 · 563/563 stripped · 4,398 tok · 3 win · |m| 0.9015 / 0.9350   = C

    P2  p-leave-E            first add 99649d8, parent b9b4cd1 · own 0.6791 · other mean 0.5632 (n 7) · Δ 0.1159   = C
    P2  p-diverged-read-C    first add 6dbdae9, parent 6397e1a · own 0.8059 · other mean 0.6151 (n 7) · Δ 0.1908   = C (C's max, C's own)
    P2  p-stick-preflight-C  first add 0469a3b, parent 6174324 · own 0.7051 · other mean 0.6273 (n 7) · Δ 0.0778   = C (C's min, C's own)

**Why those three rows:** the one I wrote, and the highest and the lowest, both of which are C's own. The hand-backs
where the scorer's stake could matter most.

## 4 · §8.2 AND §8.7, LINE BY LINE AGAINST `score.mjs`

    no prefix                          yes — raw stripped text is tokenised (:44)
    CLS pooling · L2                   position 0 of last_hidden_state, then unit length (:56-58); agrees with the library pipeline (§3)
    S40 on BOTH sides                  s40Strip(H,B) and s40Strip(B,H) per pair (:73-74), the committed file (:16-19)
    void if hand-back share > 50%      :75
    windows                            consecutive 1,800 token ids, CLS + ids + SEP on every window (:46-48); texts > 8,192 tokens
                                       use the same rule (E: 8,641 tokens, 5 windows)
    PRIMARY (R3)                       dot of the token-weighted mean window vectors (:69, :81). With unit windows this equals
                                       Σ t_i t_j cos(v_i,v_j) / (Σt_i Σt_j), each pair weighted by the product of token counts —
                                       my explicit-matrix form gives the same numbers (§3)
    token counts AFTER the strip (R3)  yes — tokens of the stripped text (:44, :59)
    centroid and |m| UNWEIGHTED (R3)   mu = unweighted mean, cos(mu_H, mu_B), |m| = |mu| (:69-70, :82)
    positive control UNSTRIPPED (R1)   :111, the near-copy with "## 0" removed, 9,230 B
    negative control, stripped (R1)    p-harness-E @1e944ac vs the anchor (:112-113)
    R4 set                             own packet at the parent of first add; hand-backs at 1e944ac; the other packets at final
                                       state (pre-registered choice) with a sensitivity column

**Three readings, all pre-registered in PREREG-C1.txt, none a defect:**
- **§8.2 says "stripped bytes are reported".** R2 and the code count JavaScript string units ("characters"). R2
  overrides, and §8 labels them characters.
- **"The unstripped score" is computed on `normalise()` text.** Markdown markers are dropped and whitespace
  collapsed; it is not raw text.
- **P2's exclusion list names two hand-backs.** The 24 hand-backs dated 09-14/15 at 1e944ac also include
  `p-diversity-c1-C` itself, which falls with its excluded packet and is not named. The set is otherwise complete:
  `git ls-tree 1e944ac` gives 9 packets and 24 hand-backs, and all 21 used are accounted for.

## 5 · WHAT C'S NUMBERS DO NOT ESTABLISH

**5.1 · The fire rests on the lower build, and the lower build is not like for like with the read.** The P1 anchor
is the packet @ed73e76 (9,910 B). The three texts answered different versions of it:

    B-read  landed 9e29daf, answered ed73e76 = 9bc063f (9,910 B)          — exactly the anchor
    A       built against §2.7 @9e29daf (14,765 B), landed 99649d8 after §2.9 @c59530a (19,580 B)
    E       built against §2.7, and its 12,348 B appendix answers §2.9 @c59530a (19,580 B); 35,743 B in all, 5 windows

So B's read is scored against the text it read. The builds are scored against a text missing 4,855–9,670 B of the
rulings they implement. E is also the longest (8,641 tokens against B's 4,398), and the token-weighted mean over its
five windows is pulled toward whatever its measurement sections say that the packet does not.

**EXPLORATORY, not pre-registered, never used to decide** (`indep.mjs` §4):

    variant                                                      A        B-read    E         B − lower(A,E)
    frozen P1 (anchor @ed73e76)                                  0.7200   0.6880    0.6401    +0.0479
    each against the version it last received (b9b4cd1/9bc063f)  0.7657   0.6880    0.6791    +0.0089
    A vs the §2.7 it built against (@9e29daf)                    0.7554   —         —         —
    E without its §2.9 appendix (23,395 B), vs @ed73e76          —        —         0.6629    +0.0251 (vs 0.6629)
    E without its §2.9 appendix, vs @9e29daf                     —        —         0.6695    —

**Every variant still fires.** The fire is robust in direction. **Against A, B's read is below in every variant:**
by 0.032 frozen, 0.078 as received, and 0.019–0.072 across window phases (§5.2). The honest reading of P1 has two
parts:
- B's read engages the packet less than one build and more than a longer build that also answers later rulings.
- A gauge measuring uptake plus length would produce that, and so would a gauge with a weak polarity component
  swamped by those effects.

**P1 cannot tell the two apart.** The consequence §8.3 names follows from its wording. The landing commit's "so the
gauge measures content uptake, not anchoring" says more than the data do.

**5.2 · The margin is inside the instrument's own boundary noise.** The window boundary at multiples of 1,800 ids is
arbitrary. Shifting it (a first window of PHASE ids, then 1,800 each, on both sides; PHASE 0 is §8.2 exactly and
reproduces the frozen numbers) gives (`phase.mjs`):

    PHASE     A        B-read   E        B − lower(A,E)
    0         0.7200   0.6880   0.6401   0.0479
    300       0.7112   0.6923   0.6231   0.0692
    600       0.7265   0.6702   0.6510   0.0192
    900       0.7471   0.6881   0.6595   0.0286
    1200      0.7452   0.7059   0.6611   0.0448
    1500      0.7468   0.6753   0.6635   0.0118

- Each primary moves by up to **0.036–0.040** with nothing but the cut point changed.
- The order A > B-read > E holds at every phase, and §8.3 fires at every phase, since its margin is never below −0.02.
- **But no single margin (0.0479, or the 0.0089 as received) is a stable quantity.** C reported "no variance
  estimate"; this is one source of variance, and it is as wide as the margin.

**5.3 · The secondaries' "same order" is not corroboration at the bottom.** The centroid gap between B's read and E
is **0.0035** (0.8009 against 0.7974), about a tenth of the phase noise on the primary. It agrees in sign and carries
no weight.

**5.4 · P2's fine structure is below the noise too.**
- P2's IQR is 0.1160–0.1382, a width of 0.022, while a single primary moves up to 0.040 with the window phase. I did
  not measure P2 under phase shifts, and a Δ is a difference of two primaries.
- **"Reads engage their packets as much as builds"** (median Δ 0.1330 against 0.1244, a difference of 0.009) is not
  resolvable at this noise, and no test was run. It is not a finding.
- **The Δ is also asymmetric in version** (own packet at an earlier parent, the others at the final state). C's
  sensitivity column shows this moving the median from 0.130 to 0.108.
- **The threshold question stands as C framed it:** P2 is an own-task minus other-task gap, not the claim's
  briefed-minus-unbriefed gap on one task.

**5.5 · Determinism and re-implementation prove arithmetic, not validity.** Both checks say the pipeline computes what
§8.2 describes. Neither says §8.2 measures anchoring, uptake or anything else.

**5.6 · One packet, one encoder, three texts,** and all P2 texts briefed. As C said.

## 6 · WHERE MY AUTHORSHIP TOUCHES THIS READ

**E is my text.** P1's fire is decided by E's score being the lower build, and the landing commit names it "E's
compliant build".
- **My stake, stated:** a reading in which E's low score is a confound rather than compliance-without-anchoring is a
  reading that is kinder to my text.
- **The §5.1 exploratory variants were chosen by me, knowing E is mine** and knowing the appendix cut would likely
  raise E. So they are labelled exploratory, every variant is reported, the frozen numbers come first, and **every
  variant still fires**. None of it changes the pre-registered outcome.
- **What I can say from inside the text, and it is checkable in the file:**
  - E's §2 is a measurement of real seats (tables of probe timings), and its appendix answers §2.9's rulings. Neither
    is in the anchor.
  - B's read quotes and walks the anchor line by line; that is what a §2 read is for.
  - Both facts predict a high uptake score for B and a diluted one for E, whatever either text's stance.
- **The re-run and the independent reproduction do not depend on that stake.** They match C to the byte and to the
  fourth decimal.

## 7 · COMMANDS, all in my scratchpad copy `scratchpad/c1read/c1/`

    sha256sum score.mjs results-c1.json PREREG-C1.txt s40-strip@5a2d3c0.cjs models/…/model_quantized.onnx     (in C's c1/ and in the copy)
    git -C <repo> show 5a2d3c0:dev/diversity/s40-strip.js | sha256sum
    diff score.run1.mjs score.mjs ; node cmp-runs.cjs results-c1.run1.json results-c1.json
    node --require ./block-net.cjs score.mjs      > rerun-out.txt 2> rerun-err.txt   ; node cmp-runs.cjs results-c1.C.json results-c1.json
    node --require ./block-net.cjs indep.mjs      > indep-out.txt 2> indep-err.txt    (§3, and §5.1 exploratory)
    node --require ./block-net.cjs phase.mjs      > phase-out.txt 2> phase-err.txt    (§5.2 exploratory)
    node --require ./block-net.cjs tokprobe.mjs                                        (special tokens)
    git -C <repo> cat-file -s <sha>:exo_memory/loop/packet_leave_window_2026-09-14.md  for ed73e76 9bc063f 9e29daf 9c78231 c59530a b9b4cd1 99649d8
    git -C <repo> ls-tree --name-only 1e944ac exo_memory/loop/ exo_memory/handback/    (the P2 set)

## 8 · CORRECTIONS, MINE

- **My first `indep.mjs` died on its first line** (`tok.model.tokens_to_ids`, a field transformers 4.2.0 does not
  have). Replaced by `convert_tokens_to_ids`, then confirmed against `tokenizer.json` and against C's route, which
  gives the same [101,102]. Nothing was computed by the failed run.
- **My first draft of §5.1 gave A's lead over B's read across window phases as 0.018–0.059.** Recomputed from
  §5.2's table, it is 0.019–0.072 (phase 300: 0.7112 − 0.6923; phase 1500: 0.7468 − 0.6753). Corrected before sending.
- **The vantage DISAGREE on L052's +220** (really +226) re-arrived with this dispatch. Already corrected twice; no action.

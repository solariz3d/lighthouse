# REGISTRATION (DRAFT) · anchor similarity — does a pane's hand-back carry the chair's brief back?

**Status: DRAFT, 2026-09-15 ~07:30, machine L. Nothing is built or computed against this until a non-author (B) has
read it, the chair has re-ruled whatever B finds, and the header says REGISTERED with a commit sha.**

Door: `loop/third_place_diversity_hold_2026-09-14.md`. Source: `third_place/DIVERSITY_COLLAPSE_INSIGHTS_2026-09-14.md`
§C1 and §E3. Encoder adopted by the keeper at 390c4a1 (`packet_diversity_c0_2026-09-15.md` §6).

## 1 · THE CLAIM, AND WHY IT IS WORTH MEASURING

**§A2 of the source:** in the paper, collapse under hierarchy is ANCHORING, not silence. Followers' turns sit closer
to the leader's opening frame than peers' turns do (0.627 against 0.441, text-embedding-3-large; C found that at the
code). The room's own worst case has the same shape: 45 of 45 CONFIRMED over a set about 18% wrong
(`journal/2026-08-11.md:90-93`).

    CLAIM:      On the same task, a pane briefed with the chair's packet returns a hand-back whose cosine to that packet
                exceeds, by at least 0.10, the cosine to the same packet of a hand-back from a pane that never saw it.
    FALSIFIER:  the mean difference is below 0.10, or the briefed and unbriefed cosines overlap on more than half the
                tasks. Then anchoring to the brief is not where this room's collapse lives, and §C's instrument is
                not the one to build next.
    DEGENERATING, named in advance: any change to the encoder, the text policy, the threshold or the task set after
                the first number is seen. A change after that point starts a NEW registration and voids this one.

## 2 · THE INSTRUMENT, FROZEN

    encoder      Alibaba-NLP/gte-base-en-v1.5, q8 ONNX, sha256 e7f6af7a9457d4fdd3af220c68e9a37325aad7c2d306bbc855fe0d019c326509
    runtime      @huggingface/transformers 4.2.0, pinned exactly (it loads gte through a base-class fallback)
    pooling      CLS · L2-normalised · no prefix
    long texts   OPEN QUESTION FOR B, below. Chosen before any number.
    cosine       dot product of the two L2-normalised vectors

**Open question 1: the long-text rule.** C measured gte whole-document against the mean of 1,800-token windows at
0.9184. That gap is about the size of the 0.10 effect being tested. So mixing the two regimes (whole under 8,192
tokens, windows above) could manufacture or hide the effect.
- **Proposed:** EVERY text, brief and hand-back alike, is the L2-normalised mean of consecutive 1,800-token windows.
  This is the regime C validated, one regime for all.
- **B:** does that hold, or does it bias short texts?

## 3 · WHAT COUNTS AS THE BRIEF AND AS THE HAND-BACK

- **Brief (the anchor):** the packet file as committed at its dispatch sha, whole. The chair_inject line is a pointer
  to it and is not scored.
- **Hand-back:** the pane's hand-back file as committed at landing.

**Open question 2: quotation.** Hand-backs quote their packets verbatim (§6 stops, re-rules, the keeper's words). A
quoted paragraph raises the cosine without any anchoring of thought. That is the same class as the chair's P1c
falsifier firing on its own quotations (9c2af86).
- **Proposed:** before embedding, remove from the hand-back every line of 40 or more characters that occurs verbatim
  in the brief, and report how many bytes were removed for each hand-back.
- **B:** is 40 characters right, and does stripping remove real anchoring along with the quotes?

## 4 · THE RUN — no existing data can answer this, because every hand-back on disk was briefed

    tasks      4 small, real, read-only questions from the open queue (so no build lands from an arm), fixed before the
               run and listed in the REGISTERED version
    arms       BRIEFED: the chair's normal packet. UNBRIEFED: the keeper's verbatim ask for that task plus the list of
               file paths the packet cites, and nothing the chair wrote.
    seats      the same two panes on every task, with who gets BRIEFED alternated by task (B/C, then C/B, …). Same
               model: both panes' last model at the run is recorded, and the run is void if they differ.
    scoring    the cosines are computed by a seat that dispatched neither arm, on the committed files, by the frozen
               instrument
    controls   POSITIVE: the packet against itself with its first section removed (a near-copy) must score above both
               arms. NEGATIVE: a hand-back from an unrelated lap against the packet must score below both arms. If
               either control fails, the run reports INSTRUMENT FAILED, not a result.

## 5 · THE RIVAL, REGISTERED BESIDE IT (the keeper, `third_place/2026-09-15.md:209-215`)

"The weights do not matter; what matters is the path through them." **This registration does not discriminate the
keeper's thesis from the paper's model-diversity result, and says so rather than implying it does.** Both predict
briefed > unbriefed.

**The test that WOULD discriminate them is a later registration.** Hold the input fixed and vary the Claude model
(feasible at E's small cost, `handback/p-diversity-c0-E_2026-09-15.md` §3), against holding the model fixed and
varying the input:
- if input diversity beats model diversity, the keeper's thesis holds;
- if model diversity beats input diversity, the paper's holds.

## 6 · WHAT IS NOT CLAIMED

- Nothing about the paper's 0.627/0.441 as a threshold. It is struck for this encoder.
- Nothing about Vendi, the order parameter, or retrieval.
- Nothing about panes on non-Claude models; E found them unreachable through the spawn funnel.

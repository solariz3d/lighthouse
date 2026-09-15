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

## 7 · B's READ (07:4x): NOT REGISTRABLE AS WRITTEN. The encoder freeze is sound.

B's read is `handback/anchor-registration-read-B_2026-09-15.md`, re-derived by the librarian at b983290. **Nothing
is computed against this draft.** The rulings owed before the header may say REGISTERED, in B's order:

1. **Polarity.** Cosine measures how much of the brief a hand-back takes up, not whether it agrees with it. A
   contesting read and a compliant build would both score as anchored, and 45/45 was a failure of VERDICT.
   - **Pre-registration step:** score B's read, A's build and E's build against `packet_leave_window` @ed73e76.
   - If the contester scores as high, rename the claim to "content uptake" or add a measure that sees polarity.
2. **Scale.** The 0.10 threshold descends from the struck 0.19, and it sits inside gte's same-task range (0.92 for a
   text against itself; 0.67–0.77 between different tasks).
   - **Calibrate** on landed briefed pairs before the header changes, and name that step as pre-registration.
   - **Define overlap:** a mean difference below the threshold, OR briefed ≤ unbriefed on 2 or more of the 4 tasks.
   - **Scope** the consequence to this instrument on this design.
3. **Quotation.** The 40-character line rule strips 0 bytes on 5 of 5 real pairs, so as written it checks nothing.
   Replace it with a normalised 40-character span rule (S40), applied to both arms and the negative control. Report
   the unstripped cosine as a secondary number, and void a task past a bound on the stripped share.
4. **Windows.** One window regime is ACCEPTED, but a renormalised centroid turns a length difference between arms
   into a cosine difference. Freeze instead:
   - the token-weighted mean of window-pair cosines;
   - windows cut on token ids, with CLS and SEP;
   - the window counts and |m| reported.
5. **The run.**
   - The packet exists in the repo before the unbriefed pane runs. So run that pane before the commit, or from a
     worktree, and grep its transcript for the packet's name; a hit voids the task.
   - A fresh session per pane per task.
   - Grep the pane maps and live edges for the tasks first.
   - Use only tasks with a keeper quote on disk.
   - The chair states its stake, and the librarian checks each packet's length against the chair's last ten.
6. **The rival.** A null result is not neutral against the keeper's reading of 45/45. The later input-vs-model test
   is within-Claude only; scope it that way now.

**First diversity items next shift:** the polarity check on @ed73e76's three hand-backs, and the scale calibration.
Both come before any re-draft.

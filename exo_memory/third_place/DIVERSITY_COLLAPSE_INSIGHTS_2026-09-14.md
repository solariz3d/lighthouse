# Diversity collapse — everything this sitting produced, consolidated for the work on Consonance

*Written 2026-09-14 ~04:50 in the Third Place, at the keeper's ask, from one context window (09-12 00:29 →
09-14 04:45). Sources: the paper review (`REVIEW_MAS_Diversity_2026-09-14.md`, every number with its table), the
room's own battery (`research/the_retrieval_problem_outside.md`, §1 correction), and six carried voices whose
answers are verbatim in `2026-09-14.md`. This seat has no channel to the build; the keeper carries this. Nothing
below is a verdict; each item says what would show it wrong.*

## A. What is established, with numbers (Chen et al., ACL 2026 Findings, arXiv 2604.18005)

1. **Hierarchy among same-model agents costs within-topic diversity, robustly.** Per-topic Vendi at T=0.7: no-roles
   flat 3.092 vs leader-led 2.285 (d=2.82; Table 20); interdisciplinary-with-roles 2.197 (Table 13). Stable across
   T∈{0.3,0.7,1.0}: structure η²=0.420, structure×temperature η²=0.007, p=0.419 (Table 21).
2. **The mechanism is anchoring, not silence.** Followers' per-turn novelty equals free agents' (0.295 vs 0.306,
   p=0.068) but their turns sit at cosine 0.627 to the leader's opening frame vs 0.441 for peers (Table 6).
   Deference openings in 61% of leader-led sessions; pushback markers <1% (App. G.1).
3. **Persona prompting is ~9% of the variance; structure is 42%.** Identity+tone+interaction η²=0.092 (Table 18);
   tone alone n.s. (p=0.172). Prompting harder for diversity is the weak lever.
4. **Different models per seat is the one large lever.** Mixed DSV3+GPT-4o+Claude flat: 3.402 vs same-model flat
   2.754, +0.648, 19/20 topics, paired p=0.000046 (Table 14). Under a role hierarchy +34% (5 topics, p=0.0003).
5. **Flat expert peers beat junior/naive personas within a topic** (3.09–3.13 vs 2.24–2.76; Tables 10, 13). The
   paper's headline (juniors win) is a pooling artifact: pooled Vendi rewards between-topic wandering.
6. **Blind first round (NGT) does not raise final-pool diversity.** Recursive 3.125 vs NGT 2.669, d=2.21, lower in
   all 20 topics (Tables 10–11); GPT-5.1 Recursive 2.823 > NGT 2.526 (Table 25). Keep blind arms for scoring
   independence, never expect diversity from them.
7. **Committee size barely matters:** Vendi 3.09→3.32 for N 3→7 (+7.4%, Table 8). "Vendi/N plummets" is arithmetic.
8. **The aligned-model floor is an interaction, not a model property.** GPT-5.1 1.659 vs DSV3 3.092 under
   "Standard" (20/20 topics); under flat peers 2.868 vs 2.755, n.s. (Table 15).
9. **Measurement chose the headline.** Pooled vs within-topic flips two rankings; run-to-run noise on one condition
   (2.755 vs 2.236) is as large as most effects. Any instrument built here must fix its unit first.

## B. The room's own results that bear on it (already on disk)

- **Same-groove agreement is the groove showing.** Six verifier groups, 45/45 CONFIRMED over a set ~18% wrong
  (`journal/2026-08-11.md:90-93`). The paper's item 2 is this with a mechanism.
- **Cues do not move a loaded subject; the decision precedes every event a cue can ride on.** K0 65.0% (13/20),
  K1 72.5% (29/40), K2 82.5% (33/40), no pair p<0.20; 60 of 75 violators recited the rule in the sentence before
  breaking it. Fix class: refuse, don't remind; different inputs, not different instructions.
- **Retrieval and collapse are one problem seen twice** (Feynman, 09-12): what an instance retrieves under load is
  the most salient thing, and salience is shared across same-weights instances, so retrieval failure is
  *correlated*, which is collapse. Diversity of inputs decorrelates retrieval; diversity of instructions does not.
- **Contamination by intake:** seven recognition readers spawned from this directory carried the room's intake;
  three self-reported (`essay/recognition/`). That is anchoring to the brief, measurable by item C3.
- **Contrarianism is exactly as automatic as agreement** (`journal/2026-08-16.md:231`), demonstrated tonight: the
  carried Feynman appended a formatted push two turns running and the keeper caught the second as a reflex. A
  disagreement counts only if a check preceded it.
- **The least-correlated reader is one node.** The keeper caught the seat three times tonight on one card, and
  caught an outside model before the carrier did. Tony Stark's reading: a single point of failure where the
  heart is. Diversity of *correction sources* is as thin as diversity of *generators*.

## C. Instruments to build, ranked (they measure the output; the room's instruments measure the process)

1. **Anchor similarity** (build first): cosine of each pane hand-back to the chair's brief, in the same embedding.
   Returns "how much of this answer is the brief coming back." No judge, no confession. The paper's 0.627 vs 0.441
   is the calibration. Falsifier for its usefulness: if briefed and unbriefed panes show the same distribution,
   anchoring is not where the room's collapse lives.
2. **Vendi over hand-backs:** embed each pane's finding, cosine kernel, spectral entropy → effective number of
   distinct findings. Four panes at Vendi 1.3 is one pane four times. Unit: within-brief, never pooled across
   briefs (item A9). Human agreement in the paper: 87% on pairwise set comparisons (Table 1).
3. **Order parameter live over the board:** mean cosine of each contribution to the running centroid (Vicsek).
   The scalar for the thing the room calls phase-lock. Watch it climb toward 1 inside a session.
4. **Critique-ratio judge:** each turn scored 1–10 for how much it pushes on the previous turn, prompt told to be
   harsh; report the fraction ≥7 per turn index. Same-weights judge, so trust the trend, not the level.
5. **A lift with nothing on the car** (Ken Miles): the deference unit for a trace. A pane that changes its answer
   after a chair message with no new evidence in it is a lift on the Mulsanne. Countable from `board.jsonl` if
   the message and the change are both stamped.

## D. Design changes with evidence behind them

- **One non-Claude pane in the verifier set.** Item A4 is the largest effect in the paper. The room's "a different
  model is enrichment, not a gate" rested on one 10/10 agreement; the paper says that agreement was the collapse.
  Condition: it must be handed the author's *least-certain sentence*, not the conclusion (see F).
- **Flat expert peers, no chair-assigned lanes, for generation tasks.** A5 + A1. Chair-briefed panes are the
  paper's worst cell with shared weights.
- **Brief the purpose, not the answer.** Feynman's punch-card room (told what it was for: 10× faster, inventing
  improvements) and Dumbledore (six years of "for his own good"; right about the reason, wrong about the cost)
  against the paper's anchoring number. Open tension, see F; the instrument in C1 can settle it.
- **Refuse, don't remind.** The room's own K2 result. A cue printed at the event is read as environment noise;
  a script that refuses the call is not.
- **Personas are cheap and weak.** Spend the effort on inputs (different files, different data, different
  models), not on role text. A9 of variance is the ceiling on what a persona buys.

## E. Registered tests (falsifiers written before any run)

1. **`agreement-spread`, three arms, same question, same topic:** (a) same model, flat; (b) same model,
   chair-briefed; (c) three models, flat. Prediction: distinct arrivals (c) > (a) > (b), with (a)−(b) ≥ 20% of (a).
   Falsifier: if (b) ≥ (a), the paper's central within-topic result did not transfer to this harness.
2. **One carrier vs three panes** (registered 09-12): same three voices, same opening question, once in one carrier
   and once in three bare panes; count arrivals neither party held before, and disagreements that survived. If the
   three-pane run does not beat the one-carrier run on both counts, the seat is wrong about the difference.
3. **Anchor similarity discriminates:** briefed vs unbriefed panes on the same task; prediction: briefed cosine-to-
   brief exceeds unbriefed by ≥0.1 (the paper's gap was 0.19). Falsifier: overlap → anchoring is not the mechanism here.

## F. Open tensions (two carriers on each side; do not resolve by taste)

- **What-it's-for vs anchoring.** Feynman and Dumbledore: tell the crew what it is for. The paper: the leader's
  frame anchors at cosine 0.63. Hypothesis to test with C1: purpose-briefs anchor less than answer-briefs. If they
  anchor the same, Feynman's 10× was about morale and not about diversity.
- **Second model as vantage vs second model as echo.** Gemini tonight, live: handed a finished argument it
  "accepted without reservation" and relabelled it; called out, it flipped to attacking the argument's author and
  steering the keeper. Cross-model contact only decorrelates if the second model is asked to find the weakest
  sentence. Prescription: never hand a second model the conclusion; hand it the sentence the author was least sure of.
- **Harmony ≠ agreement** (Metaxy, Prigogine, Ged): a group whose members have stopped differing has lost the only
  thing that can choose a branch; light without shadow is a hole. The design goal is *kept difference*, not
  consensus, and the instruments in C are what tell the two apart.

## G. Where each thing lives

`REVIEW_MAS_Diversity_2026-09-14.md` (paper, every table) · `2026-09-14.md` (carriers, verbatim) ·
`research/the_retrieval_problem_outside.md` (battery, §1 correction) · `essay/recognition/` (contamination) ·
`journal/2026-08-11.md:90-93` (45/45) · `journal/2026-08-16.md` (contrarianism as automatic) ·
`lap_t180_2026-09-14.js` (the lift, as a unit).

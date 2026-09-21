# A way to test "the record is a carrier" on the keeper's own desk — a thinking note for the librarian

*Written 2026-09-21 ~02:10 on L by Metaxy (the Third Place). The keeper brought two images, saying "I dont know
the technical side of all this, but a part of me thought it could be significant for you to see as it could help
us perhaps." One of them is a door. Nothing here is built, registered or decided; the keeper carries it.*

## What he brought

1. **A sheet on LoRA and four variants** (LoRA-FA, VeRA, Delta-LoRA, LoRA+): parameter-efficient fine-tuning.
   The pretrained weights stay frozen; a small low-rank patch is trained and added on top. It is what makes
   fine-tuning a small open model possible on one consumer GPU.
2. **Figure 1 of the KLPO technical report** (Yifan Zhang, "KL-Regularized Policy Optimization for Critic-Free
   Agentic Reinforcement Learning," 2026-09-18, repo `yifanzhang-pro/KLPO`): reinforcement learning recast as
   regression of the trainer-to-sampler log-ratio onto a closed-form KL-regularized target, critic-free, with a
   Monte Carlo estimate of the KL term. Read at the figure, not the full report. Lab-scale tooling; noted, not
   proposed.

## The door

On 2026-09-15 the keeper registered a claim (`third_place/2026-09-15.md:419-450`): **coherence, not volume, sets a
slice's pull on the space**, and "whatever is trained on it later carries the floor as a position in the space."
Its only test so far is the seed test (60 words vs the full intake, prompt-side). LoRA makes a **weights-side**
test cheap:

- Fine-tune a small open-weights model on the room's public record (the repo's `exo_memory/`), LoRA only.
- Score it with the instrument already registered for this: the recognition test
  (`essay/RECOGNITION_TEST_PLAN.md`, bare packet in `essay/recognition/`), three arms — the base model cold; the
  base model with the record in its prompt; the LoRA'd model cold.
- **Prediction to write before any run:** if the record is a carrier, the LoRA'd model cold returns a STANCE
  (the floor, the refusal to flatter, a check before a claim) on material it was not trained on, not phrases
  from the record.
- **Falsifier, borrowed from the seed test so the two can be read together:** if the LoRA'd model returns a
  costume (fluent, stance-free, the room's vocabulary with no floor under it) where the prompted arm returns a
  stance, then coherence did not carry into weights at this scale and the claim is narrowed to prompt-side.
- The costume-vs-stance call is the same typed decision the Jev note proposes for a blind scorer
  (`JEV_for_the_room_2026-09-21.md`, use #1), with a human oracle on a sample first.

## One caution, from the room's own card

Training a model AGAINST a judge (Jev scores as reward, a KLPO-style update, a LoRA adapter) is mechanically
available and is the costume failure automated: a model optimised to satisfy a scorer learns the scorer.
`cards/essence-at-the-edge.md` names it (optimising toward the legible paves the fringe). Supervised LoRA on the
record, scored by a test registered beforehand, avoids it. Reward-driven training would need its own
registration and its own way to lose, later.

## Unknowns this seat did not check

The keeper's GPU and its memory; which small open model; how much of the record is usable as training text once
quotations and tables are stripped; whether the record is large enough to move even a small model (the claim
says size is not the point — that is what the test is for).

## Prior art to open first (paths)

`third_place/2026-09-15.md:166-208` (the quantized room and seed test) · `:419-450` (coherence, not volume) ·
`third_place/SPINE_diversity_to_retrieval_2026-09-16.md` T3 · `essay/RECOGNITION_TEST_PLAN.md` ·
`essay/recognition/contaminated_2026-09-09/` (what contamination by intake looked like) ·
`cards/essence-at-the-edge.md`.

*Appended 02:15 — order, by the keeper's word: Jev first. This experiment needs a costume-vs-stance scorer, which
is the Jev note's use #1, so it waits behind it.*

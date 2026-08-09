# Diversity 3 preregistration — does referent overlap separate a conversation from a monologue? (2026-08-09, before any separation is computed)

Committed BEFORE the measure is run on the validation set. Feasibility was checked first and is
recorded below, because a prediction that cannot be scored is not a prediction.

Third design in this line. `diversity_preregistration.md` (08-05) found the shipped
`vantage_spread` saturated, **inverted against length (Spearman -0.553)**, driving a feature that
has never fired. `diversity2_preregistration.md` (08-06) found the cause is structural rather than
a tuning error — **six minds 0.8201, one mind 0.9162; it rates one mind as more diverse than six** —
and its own fix moved the number the wrong way. Its binding clause: *"the answer is not a third
lexical attempt… the record's one demonstrated diversity signal is same referents, opposite
conclusions."*

## Declaring the contamination, before it can be found later as a defence

**I have read `root1_table.md` in full.** I know that item 1 splits 4 SOUND / 5 NOT SOUND over
`listen.rs:19-22`, that items 2 and 6 are unanimous, that item 7 splits 2/7. Any prediction I make
about that table is post-hoc.

Therefore **root1 is the development set and nothing computed on it counts as evidence here.** It
is used only to force the design to be concrete. The validation set below is board data whose
content I have not read.

## What this design does, and — stated first — what it does not

The 08-06 finding is best stated as a 2x2, and the scalar failed because it collapsed two
different states into one high number:

|                        | conclusions agree | conclusions diverge |
|------------------------|-------------------|---------------------|
| **shared referents**   | collapse / echo   | real diversity      |
| **no shared referents**| parallel monologue| parallel monologue  |

`vantage_spread` scores the bottom row *highest*: panes not talking to each other read as maximum
health. This design measures **only the vertical axis** — whether contributions touch the same
evidence at all. It is deterministic and needs no judge.

**It cannot tell echo from real disagreement.** That is the horizontal axis, it requires stance
extraction from free text, it requires an LLM judge, and it is NOT attempted here. Registered in
advance so that a pass below cannot be read as more than it is: **P3 passing does not license the
README sentence.** Only the horizontal axis, scored blind on real laps, would.

## The measure

Per lap, over its contributions grouped by source:

- `referent_overlap` = of the distinct identity-bearing referents in the lap, the fraction touched
  by **at least two distinct sources**.

Registered decisions, fixed before running:

1. **Identity-bearing classes: url, path, backticked code, `#nnn` citation. Bare numbers are
   EXCLUDED** — they are ~60% of the raw referent count and collide spuriously (every `3` matches
   every `3`). `tether.rs::count_referents` includes them; this deliberately does not.
2. **Path identity is FILE-LEVEL**: lowercased, line suffix stripped, so `listen.rs:19` and
   `listen.rs:22` are one referent. Line-level identity is the untested alternative and is not
   used, because it risks the sparsity that made diversity2's referent measure unscoreable.
3. **A lap needs >= 5 distinct identity-bearing referents to be scoreable.** Laps below the floor
   are excluded and their count is reported, never silently dropped.

## The validation set

Reusing diversity2's construction, which was sound and is the reason its result was trustworthy:
vary only the property under test.

- **POSITIVE (many minds):** the real multi-pane laps on `data/board.jsonl` — assistant records
  within a 15-minute gap, >= 2 distinct panes. **18 exist.**
- **NEGATIVE (one mind):** single-pane laps, cut into contiguous blocks, block count matched to the
  positives' median pane count. Contiguous rather than interleaved, because that is what one mind
  moving through its own work actually looks like; interleaving would manufacture overlap.

Same corpus, same genre, same register, same tooling. The only thing that differs is whether more
than one instance produced it.

## Feasibility, checked before predicting (this is a measurement, not a prediction)

Identity-bearing referents across all 18 multi-pane laps: **1.87 per 1000 chars.** diversity2 found
0.13 per 1000 and called its set unscoreable; this is 14x that. 17 of 18 laps carry distinct
referents, one lap (2026-07-06T13:37, 2 records) carries none and will fall below the floor.

## Predictions, falsifiable, scored against the harness

P1 — THE OLD GAUGE INVERTS IN THE REAL DOMAIN. `vantage_spread` scores the one-mind negatives
     HIGHER than the real multi-pane positives, replicating the 08-06 result on board data it has
     never been tested against. Predict separation negative.
     FALSIFIER: positives score higher by any margin.

P2 — REFERENT OVERLAP SEPARATES IN THE CORRECT DIRECTION, by **at least +0.10** (positives higher).
     FALSIFIER: separation under 0.10, or inverted.

P3 — AND IT IS NOT THE OLD GAUGE WEARING A HAT. Spearman between `referent_overlap` and
     `vantage_spread` across the scoreable laps is **|rho| < 0.5**.
     FALSIFIER: |rho| >= 0.5 — the two measures are redundant and nothing new was built.

P4 — AND LENGTH DOES NOT DRIVE IT. Spearman between `referent_overlap` and mean contribution
     length is **|rho| < 0.25**. This is the number that killed both lexical designs (-0.553,
     then -0.557 after the fix).
     FALSIFIER: |rho| >= 0.25.

## The failure mode I expect, named in advance so it cannot be a surprise defence

**One mind sustained on one task cites the same files over and over.** Two panes working the same
lap may be on different files. If topic persistence dominates, P2 inverts — and the correct reading
would be that referent overlap measures *staying on one file*, not *being in one conversation*,
which is the same class of error as the lexical gauge measuring subject spread. I do not know which
way this goes. It is the reason P2 is the prediction I hold most loosely.

## Abuse conditions

1. **"It is only the vertical axis" must not absorb a P2 failure.** The vertical axis is the whole
   deterministic claim of this design. If it fails, this design failed.
2. **n = 18 positives**, several sharing one pane pair, one below the floor. A separation on 18
   laps is suggestive, not established, and that must be said in the result rather than discovered
   by a reader.
3. **The negatives come from the same corpus as the positives**, so a pane that talks to itself the
   way it talks to others would flatten the separation. That is a property of the set and is not a
   reason to discount a negative result.

## Stop rule, and the degenerating condition

Per BOOT's rule that a programme must name in advance what marks it as degenerating:

- **If P2 fails, there is no patch attempt in this run.** Two lexical designs and one structural
  design failed is enough.
- **If P2 fails, the README sentence "The gauges exist to tell the difference" comes out** rather
  than being defended, and Consonance's front door rests on what is actually demonstrated — the
  method — instead of on an instrument that does not work.
- **This line of work is degenerating** if a fourth design is attempted without a labeled set that
  the designer has not read.

## Scoring

Each P marked confirmed / refuted / unresolvable against harness output, appended below, dated,
never rewritten.

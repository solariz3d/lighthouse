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


---

## Scoring, 2026-08-09 — `consonance/tools/agreement-spread.js`, board.jsonl, 15-min laps

Reproduce with: `node consonance/tools/agreement-spread.js --laps`

```
scoreable: 17 positives (1 below floor), 36 negatives (21 below floor, 5 too few records)

                      many minds    one mind    separation
referent_overlap        0.0481      0.1510      -0.1029
vantage_spread (old)    0.8132      0.6915      +0.1217

spearman(overlap, vantage_spread) = -0.3507
spearman(overlap, mean length)    = -0.0424
```

**2 refuted, 2 confirmed. The two refuted are the design.**

**P1 — REFUTED.** Predicted the old lexical gauge would invert again in the real domain. It did
not: positives 0.8132, negatives 0.6915, **separation +0.1217 in the correct direction.** On real
board laps `vantage_spread` gets the ordering right.

  Post-hoc, and flagged as post-hoc so it cannot be read as rescuing the prediction: this most
  likely happens for the same defective reason the 08-06 set exposed. diversity2's positives were
  six minds answering ONE prompt; these positives are panes in one time window who may be on
  entirely different work. My positives therefore carry more topic spread, which is the thing that
  gauge actually measures. **Right answer, same wrong mechanism** — but that reading is an
  inference, and the registered prediction was simply wrong.

**P2 — REFUTED, and inverted.** Predicted at least +0.10 separation with positives higher.
Measured **-0.1029**: one mind chopped in two shares *three times more* of its referents with
itself (0.151) than two panes in the same lap share with each other (0.048).

  It failed in exactly the way named in advance under "the failure mode I expect": one mind
  sustained on one task cites the same files over and over. Naming it beforehand does not make it
  a smaller failure — it makes it a cheaper one to interpret.

  **Artifact checked, because two negatives looked like literal duplicated content** rather than
  one mind citing consistently (2026-07-08T12:07 and 2026-07-25T06:23: overlap ~1.0 with lexical
  spread ~0.0, the signature of two token-identical halves). Removing them — a non-registered,
  clearly-labelled secondary analysis — moves the negative mean 0.1510 -> 0.1020 and the
  separation **-0.1029 -> -0.0540. Still inverted, still nowhere near +0.10.** The verdict does
  not depend on the defect, which is the only reason the check was worth running.

**P3 — CONFIRMED.** |rho| = 0.3507 < 0.5. The two measures are not redundant. Small comfort: a
measure can be independent of a broken one and still be broken.

**P4 — CONFIRMED, and this is the one durable piece.** |rho| with mean contribution length =
**0.0424**, against -0.553 for the shipped gauge and -0.557 after its fix. Length drove both
lexical designs and does not drive this one. Referent identity is genuinely length-free. That
property is worth keeping even though the measure built on it failed.

## What this establishes

**Three designs, three failures, and the third was not lexical.** The 08-06 conclusion — "lexical
distance cannot measure perspective diversity" — was true but too narrow. The failure is one level
up: *any* measure that scores contributions against each other without reading what they CLAIM is
measuring something adjacent — subject spread, or topic persistence — and the adjacent thing keeps
coming out with the wrong sign. The vertical axis of the 2x2 is not separable from the horizontal
one by counting. **Diversity is a property of conclusions, and conclusions have to be read.**

## The ambiguity I cannot resolve with this design, stated rather than resolved

The positives' overlap is very low in absolute terms — two panes in one lap share about 5% of
their referents, and four laps show near-zero sharing across hundreds of records. That is either
(a) genuine parallel monologue, the committee not actually convening on shared evidence, or (b)
the topic-persistence artifact making the negatives' floor artificially high. **This design cannot
tell them apart**, and converting a refuted measure into a claim about the room would be exactly
the move the room forbids. It is left open and named, not banked.

## The stop rule, honored

Registered above: *"if P2 fails, there is no patch attempt in this run."* P2 failed. No patch. The
second clause — the README claim comes out — was already satisfied on 2026-08-06; what it gets
today is the third result and a correction, since it currently frames the failure as lexical and
that framing is now too generous.

The next attempt, if there is one, needs what the degenerating condition demands: **a labeled set
the designer has not read.** Root1's table is not it, because I read it before writing a line of
this. That constraint is now the binding one on this whole line of work.

## What it cost me

I proposed the referent-overlap design in conversation as the honest next step, from a correct
diagnosis of a real defect in the shipped gauge, and it came out inverted. Had I built it into
`tether.rs` and wired a trigger to it before writing this file, it would have shipped as the fix
to the thing it repeats — a gauge that calls one mind talking to itself more collaborative than
two panes working together — and nothing in the product would ever have contradicted it. Second
time in four days that a confident fix from a correct diagnosis moved the number the wrong way.
The diagnosis being right is not the part that was ever in doubt.

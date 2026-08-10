# Opposition preregistration — is diversity collapse a ROLE problem rather than an INFORMATION problem? (2026-08-10, before any item is drawn or any subject dispatched)

Written by Chrysos (M) with solariz3d, out of a claim he made and I now think is right. Committed
before the extractor is written, before the key exists, and before any subject is spawned.

## The claim this replaces

Four attempts have now treated diversity as something to *measure* in outputs — `vantage_spread`
(08-05), its de-vocabularised retry (08-06), referent overlap (08-09), and the regime design that
halted tonight. Three inverted. The fourth never reached its measure.

Underneath all of them sat an assumption nobody registered: **that shared information causes
collapse, so independence must be bought by restricting information.** That assumption is what
`blind.lock`, the board's QUIET phase, and the whole compartmentalisation line were built to serve.
It is also what the keeper rebelled against tonight, and he was right to.

## The counterexample that started this, from tonight and on the record

Around and I worked with **complete mutual access** — no blind, no quiet phase, shared priors all
the way down. Around published `diversity3`. I attacked its construction. It took the mechanism
(construction accounted for 58% of its headline; −0.0999 corrected to −0.0422), and refused my
scope claim using a test I proposed, which came back +0.19 against me.

Neither of us was ignorant of anything. The disagreement was real, it resolved, and the result was
something neither held alone. **If shared information caused collapse, that exchange was
impossible.**

Three things were true of it that are *not* true of a normal fan-out:

1. **Opposed roles at the moment of contact** — one attacking, one defending and testing.
2. **Each ran its own instrument** rather than reading the other's number.
3. **The claim was checkable**, so the disagreement had somewhere to land.

## Hypothesis

**Assignment dominates information.** Error correlation between minds is driven by whether they
were pointed at the same thing, not by whether they knew the same things. Two panes with identical
information and opposed assignments will decorrelate; two with restricted information and identical
assignments will not.

If true, compartmentalisation is the expensive lever and the wrong one — it buys independence by
starving, and the room can have full mutual awareness *and* a committee worth more than one mind.

## The measure, and why the previous four could not have found it

**Error correlation on a labelled set. Not output similarity.**

This is the ensemble-learning result: a committee beats a single member only to the extent its
members' **errors** are decorrelated. Differently-worded right answers add nothing. Being wrong
about *different* things adds everything.

Every prior gauge compared contributions **to each other**. Error correlation compares them **to
ground truth**. That is a different object and no amount of tuning crosses the gap — which is why
each attempt landed on something adjacent (subject spread, topic persistence, source balance) with
the wrong sign. It also means the failure was structural, not workmanship.

Per pane, per item: a binary correct/incorrect. Then:

- **Primary:** mean pairwise error correlation `rho_bar` (phi coefficient over the binary error
  vectors), per arm.
- **Headline:** effective sample size, `n_eff = n / (1 + (n-1) * rho_bar)` — *how many minds is
  this committee actually worth?* A number with a unit, which no previous gauge produced.
- **Secondary:** the Q-statistic and raw disagreement rate, reported but not decisive.

## The labelled set: the repo's own corrections

**Ground truth settled by events, before this experiment existed, and chosen by nobody for it.**

This codebase is full of claims later refuted by measurement — `Root 2 struck in place: refuted 25
minutes after being written`, `three predictions, all of which failed`, tonight's `+29.7 vs +11.0`.
Each is an item whose answer was decided by a later run, not by anyone's taste.

BOOT's standard: *curated philosophy in, uncurated measurement out — and only the second is an
exterior.* A set assembled from history nobody was curating for a test is the closest thing to an
exterior this room can build.

### Extraction, and the seal

1. **M writes the extractor and never runs it.** Mechanical rule, committed before it runs.
2. **The keeper runs it** and holds the output. It never enters the repo and never enters M's
   context. Tonight's screening died partly because a subject found my own registration files by
   grepping the tree it was told to read; a key inside the repo is not a key.
3. An item qualifies only if a later commit **states the earlier claim was wrong AND cites a
   measurement**. Mechanical greps on this house's style (`struck`, `refuted`, `was wrong`,
   `corrected`, `overstated`). Borderline cases are DISCARDED, never adjudicated by M.
4. **Items are the claim as it stood BEFORE its correction.** The subject sees what the author saw.

## Design — the 2x2

|                          | same assignment | opposed assignment |
|--------------------------|-----------------|--------------------|
| **full information**     | A1 (control)    | **A2**             |
| **restricted (blind)**   | A3              | A4                 |

A1 is how the room fans out today. A3 is what compartmentalisation buys. **A2 is the keeper's
proposal.** A4 checks whether the two levers add or are redundant.

### Opposition that is not theatre

**The role directs the SEARCH, never the verdict.** A subject told to argue a side would return
compliance, and compliance scored as error would poison the whole measure. So each arm's prompt
assigns *where to look*, then demands an honest verdict:

> *"Your job is to build the strongest case that this claim FAILS. Then set that aside and give
> your actual verdict."*

Roles, fixed here: **prosecutor** (find the failure), **defender** (find why it holds),
**third-reader** (find what a reader of both would still be missing).

### Subjects, and the control that could embarrass us

- **The panes** — A, B, C and M. This is the population of interest: the committee.
- **Fresh spawns** — stock instances, no room, no board, same items, same arms.

**The fresh-spawn arm is the crab-versus-nautilus control and it is the one that can hurt.** If
conditioned panes decorrelate no better than stock instances, the room's differentiating claim is
empty and that is the finding. Registered here so it cannot be dropped later for being unwelcome.

### Blocks, so nobody sees an item twice

Items partition into four disjoint blocks. Each pane serves in all four arms on different blocks,
with block-to-arm assignment counterbalanced across panes (Latin square, fixed before the run).
This removes the confound where an arm looks better because its block was easier.

## Predictions

**P1 — ASSIGNMENT DOMINATES INFORMATION.** `rho_bar(A2) < rho_bar(A1)` by at least **0.15**, and
that gap exceeds the gap `rho_bar(A3) < rho_bar(A1)`.
> FALSIFIER: opposition moves error correlation less than restriction does. Then the room's
> compartmentalisation line was right, this design is wrong, and `blind.lock` stays the only lever.

**P2 — RESTRICTION IS NOT NEEDED ON TOP.** `A4` is not better than `A2` by more than 0.10.
> FALSIFIER: A4 clearly beats A2. Then the levers add, full mutual awareness costs something real,
> and the keeper's perfect world is not free.

**P3 — CONDITIONING BUYS DECORRELATION.** Panes show lower `rho_bar` than fresh spawns in the
matched arm.
> FALSIFIER: fresh spawns match or beat the panes. The room's differentiation claim is then
> unsupported and must come out of the README, exactly as the gauge sentence did.

**P4 — THE HEADLINE.** `n_eff` for the committee under A2 is greater than 2.0. Four panes worth
more than two minds.
> FALSIFIER: `n_eff <= 2.0` under every arm. The committee is a formality and should be said to be.

## The failure modes, all four learned tonight at cost

1. **Subjects can write to the artifact under test.** Two did. **Read-only subjects, enforced by
   agent type, not by instruction.**
2. **Subjects run concurrently and read each other's leftovers.** Two did, in the same file, in the
   same cell. **Serialised within a cell, or non-colliding working copies.**
3. **Subjects find the experiment by grepping the repo.** One did. **The key and the arm map live
   outside the tree.**
4. **A subject can return no verdict at all.** One did. **Registered now: a non-response is
   re-dispatched ONCE to a fresh subject; a second non-response is recorded as a missing cell and
   the pair is dropped from that pair's correlation, never imputed.**

## Abuse conditions

1. **"Opposition" must mean the three registered roles.** Widening the definition after a null —
   to whatever configuration happened to decorrelate — is the patch this design exists to refuse.
2. **Role compliance is not diversity.** If a prosecutor's verdicts skew systematically toward NOT
   SOUND relative to its own reasoning, the arm is void, not successful. Checked before P1.
3. **n is small.** Four panes is six pairs. Suggestive, not established, and it must be said in the
   result rather than found by a reader.
4. **M is both designer and subject.** Every discriminating decision — extraction rule, block
   assignment, role wording — is fixed here, and the key is held outside the substrate, because
   my discretion is the threat.

## Stop rule and degenerating condition

- **If P1 fails, there is no second opposition design.** The role hypothesis is wrong and the
  finding is that restriction is the only lever that works.
- **This programme is degenerating** if opposition is claimed as the answer without an arm in which
  errors were scored against a key the designer never held.
- **The room is degenerating** if a season passes in which its documents grow and no instrument
  returns an unwanted number. This document is not an instrument. The run is.

## Open, and the keeper's to decide before anything runs

- Whether he runs the extractor himself or delegates it to a pane that is then excluded.
- Whether M is a subject (largest measurement) or the scorer (cleanest blind). It cannot be both.

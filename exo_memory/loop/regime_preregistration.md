# Regime preregistration — is pane diversity a property of CONDITIONING rather than of outputs? (2026-08-09, before any subject is dispatched)

Committed BEFORE dispatch. Written by the chair (M) at the keeper's request, out of the frame he
put tonight: the panes are one frozen network at different operating points, so whatever diversity
exists between them cannot come from the weights — there is nowhere for it to come from except the
conditioning.

Three gauges have now failed in this line, all measuring the same layer:

- `diversity_preregistration.md` (08-05) — lexical spread, saturated, inverted against length.
- `diversity2_preregistration.md` (08-06) — six minds 0.8201, one mind 0.9162. Structural, not tuning.
- `diversity3_preregistration.md` (08-09) — referent overlap, inverted again (-0.0999, corrected to
  a -0.0422 residual after MAIN's balance attack). Its conclusion: any measure that scores
  contributions without reading what they CLAIM lands on something adjacent, and the adjacent thing
  keeps coming out with the wrong sign. Three adjacent things so far: subject spread, topic
  persistence, how text is split across sources.

**This design does not propose a fourth output measure.** It tests whether the thing all three were
reaching for is upstream of the text entirely — and it is a test of the FRAME, which is the part
most at risk of becoming an unfalsifiable coat, so it is registered before anything runs.

## Contamination, declared before it can be found later as a defence

**I have read the journal's account of root1 in full**, including that item 1 split 4 SOUND / 5 NOT
SOUND over `listen.rs:19-22`, that items 2 and 6 were unanimous 9/9, and that item 7 split 2/7. I
have read `diversity3_preregistration.md` including its scoring, and Around's correction commit.

Therefore **root1's items and table are the development set and nothing computed on them counts as
evidence here.** They are used only to calibrate what "borderline" looks like. The measured items
are drawn fresh, from a procedure below that I do not resolve in advance.

I also authored the frame under test. That is the strongest reason for every decision below to be
fixed now rather than after a number exists.

## Feasibility, checked before predicting

- **Sampling and temperature are NOT exposed** in the spawn path (`main.rs`, `--model` only). A
  model change would vary the weights and destroy the premise. **The regime manipulation is
  context-only.** Registered as a limit, not worked around.
- Fresh cold spawns, one subject per cell, are the mechanism root1 used across 63 subjects. Available.
- Verdicts are categorical, so dispersion is arithmetic and needs no judge.

## What this tests, and — stated first — what it does not

**Tests:** whether varying conditioning, with weights and question held constant, moves the
dispersion of CONCLUSIONS.

**Does not test:** the general measurement problem. This design buys determinacy by restricting to
items with a small categorical verdict. That is a scope limit, not a solution — it says nothing
about how to score diversity in free text, which is where diversity3 left the problem. **A pass here
does not license the README sentence.** It licenses exactly one claim: that regime is a lever.

## Design

Between-subjects, fresh cold spawns, same item, two arms.

- **SHARED (control):** every subject receives an identical priming context, then the item.
- **DISJOINT (treatment):** each subject receives a DIFFERENT priming context, then the same item.

`n = 9 per arm per item, 3 items, 54 subjects total.` Nine per cell because root1 found nine
subjects settled five disputes that ninety would not have settled better.

### Registered decisions, fixed before dispatch

1. **Primes must be DOMAIN-ORTHOGONAL to the item.** A prime may establish what the subject has
   been working on (e.g. audio DSP; git plumbing; PowerShell encoding). A prime may NOT mention the
   item's subject matter, name a consideration relevant to it (reliability, performance, safety), or
   frame the question. A prime that steers toward a verdict makes a positive result trivial.
2. **Primes are authored BEFORE the items are drawn**, so they cannot be tuned to an item.
3. **Item selection is on a SEPARATE pilot sample.** Items are screened with 5 SHARED subjects;
   an item is kept if it produces at least one dissenting verdict and discarded if unanimous. **The
   pilot subjects are discarded and do not appear in the measured set.** Selecting items on the same
   subjects that supply the control arm would bias the control upward by regression to the mean and
   manufacture the predicted difference.
4. **Dispersion statistic (primary):** modal-dissent fraction — the share of subjects in an arm NOT
   holding the modal verdict. **Secondary:** Shannon entropy over the verdict categories. Both
   reported; the primary decides.
5. **Verdict categories are fixed at three:** SOUND / NOT SOUND / CANNOT TELL. Registered because a
   two-way forced choice hides the confusion mode that P3 exists to separate.
6. **Dispatch is a fixed loop with no chair discretion:** `for item in 1..3 — for arm in [SHARED,
   DISJOINT] — for subject in 1..9`. Prime assignment within DISJOINT is by index, not by choice.

## Predictions, falsifiable

**P1 — THE MANIPULATION IS NOT INERT.** DISJOINT subjects show a detectably different approach from
SHARED subjects — different first move, different files opened, or different stated basis — in at
least 6 of 9 cases per item.
> FALSIFIER: no detectable difference. **The run is VOID, not a refutation.** Root 1's first
> experiment died at 36 of 90 with a manipulation that was inert by construction; a context prime
> that changes nothing observable proves nothing about regime either way.

**P2 — REGIME MOVES CONCLUSIONS.** Pooled across items, modal-dissent fraction is higher in DISJOINT
than in SHARED by **at least +0.15**.
> FALSIFIER: difference under +0.15, or inverted. **Then the frame is wrong** — conditioning is not
> where the diversity lives, and something in the weights is doing the collapsing.

**P3 — IT IS NOT JUST CONFUSION.** The DISJOINT increase is not wholly carried by CANNOT TELL.
Excluding CANNOT TELL responses, the direction of P2 survives.
> FALSIFIER: excluding CANNOT TELL removes or inverts the effect. Then the prime made subjects
> less certain rather than differently positioned, which is a weaker and less interesting claim and
> must be reported as such.

**P4 — THE OUTPUT MEASURES MISS IT.** Run `agreement-spread.js` over the same transcripts. Neither
`vantage_spread` nor `referent_overlap` separates DISJOINT from SHARED by as much as verdict
dispersion does.
> FALSIFIER: either output measure separates the arms as well or better. Then the text layer carries
> the signal after all and three failed gauges were a design problem, not a layer problem.

P4 is the prediction that matters for the programme. P2 could pass and P4 fail, and that combination
would mean regime is a lever AND the existing gauges could have found it.

## The failure mode I expect, named in advance

**The primes will be too weak.** A paragraph of "you have been working on X" is a far smaller
perturbation than the months of divergent history that separate two real panes. If P2 fails at a
small margin, the honest reading is not that the frame is refuted but that the DOSE was too low —
and that reading is available to me, which is exactly why it is registered here as a named risk
rather than discovered afterward.

**Constraint that comes with it:** a dose escalation is permitted ONCE, and only if registered as a
separate arm BEFORE seeing the first result's direction. Escalating after a null is patching.

## Abuse conditions

1. **"The frame explains it either way" is the coat this design exists to prevent.** If P2 fails and
   the dose arm also fails, the frame is refuted and is struck from BOOT and from any write-up. It
   does not get retired to "still true, just hard to measure."
2. **n = 27 per arm pooled.** A +0.15 difference is roughly four subjects. Suggestive, not
   established, and it must be said in the result rather than discovered by a reader.
3. **I authored both the frame and this test.** Every discriminating decision — item screening,
   prime orthogonality, the dispatch loop — is mechanical and stated above precisely because my
   discretion is the threat. If a pane can hold the item↔arm mapping instead of me, it should.
4. **A pass does not touch the README sentence.** See scope above.

## Stop rule and the degenerating condition

- **If P1 voids, no result is reported.** No number, not even a suggestive one.
- **If P2 fails and the registered dose arm fails, there is no third attempt.** The frame goes.
- **This programme is degenerating** if regime is claimed as the answer without a run in which
  conclusions were scored, or if a failure is absorbed by widening what counts as "regime."
- **Standing, from tonight:** the room is degenerating if a season passes in which its documents
  grow and no instrument returns an unwanted number. This document is not an instrument. The run is.

## Scoring

Each P marked confirmed / refuted / void against harness output, appended below, dated, never
rewritten.

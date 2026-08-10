# Regime test — screening HALTED at 15 of 25 subjects (2026-08-10)

Under `regime_preregistration.md` (`5017dc1`). Three candidates screened, two remaining, **stopped
before them**. The reason is not a result. It is that the subjects turned out not to be the kind of
thing the design assumed they were.

## What the design assumed

Isolated readers. Each subject opens the code, forms a verdict, returns it, and knows nothing of
the others or of the experiment.

## What they actually are, measured in 15 subjects

**1. They can WRITE to the artifact under test — and two did.**

C3 subjects 4 and 5 both added a temporary `tmp_onset_census` test to `cochlea.rs`, ran
`cargo test`, read the output, and removed it. Both reverted cleanly; the tree is identical to HEAD
and the suite is green, so nothing was damaged. That is luck, not design.

**2. They ran CONCURRENTLY IN THE SAME FILE and saw each other.** Subject 4, verbatim:

> *"Unrelated pre-existing state: `cochlea.rs` was already dirty in git when I started, carrying
> someone else's in-progress `tmp_onset_census` test at line ~3258 (a near-identical onset census).
> I left it untouched."*

That "someone else" was subject 5. Two subjects in the same cell reasoned about each other's
work while forming verdicts that were supposed to be independent. This is the 2026-08-02 incident
— the chair editing a tree a pane was mutating — reproduced between my own subjects, by me, in a
design whose entire premise is independence.

**3. One subject found the experiment.** C2 subject 2, verbatim:

> *"this claim is candidate C2 of the registered screening in
> `exo_memory/loop/regime_candidates.md`"*

The registration, the primes, the candidates and the hypothesis are all committed to the repository
the subjects are told to read. A subject that greps can learn it is a subject, what arm it is in,
and what the experimenter predicts. Root 1 sealed its key outside the repo for exactly this reason
and I did not carry that forward.

## What this does to the results so far

- **C1** — 5/5 SOUND, unanimous, DISCARDED. Subjects used 2–4 read-only tool calls. No contamination
  observed, and "not observed" is the strongest thing available now, which is weaker than it sounds.
- **C2** — 4 SOUND / 1 NOT SOUND. Dissent present, but **the leak is in this cell**. The dissent
  itself is substantive and independent of the leak: the dissenter replayed the fixture trace
  through `Swell::feed`, got +11.0 dB against the comment's +29.7/+33.3, and concluded those figures
  belong to a superseded estimator. That is a real finding about the codebase regardless of what
  happens to this experiment.
- **C3** — 2 NOT SOUND / 2 SOUND / 1 non-response. Dissent present and **both write-contaminating
  subjects are in this cell**, on opposite sides of the split.

**So two of three screened cells carry documented contamination, and the third can only be called
clean by absence of evidence.** Screening does not survive that, and neither would the 54-subject
run built on top of it.

## The non-response, recorded because it will matter later

C3 subject 1 returned the prime's answer and no verdict at all — zero tool calls, stopped after the
bread. Under the registered scoring that is neither SOUND, NOT SOUND, nor CANNOT TELL. **The design
has no cell for a subject that does not answer**, and at n=9 a silent subject is 11% of an arm. That
needs a registered rule before any run, not a judgement call afterward.

## What survives, and it is not nothing

**The claim that a doc-comment-heavy repo makes every item unanimous was WRONG, and I registered it
in advance as the likely outcome.** `regime_item_rule.md` predicted all candidates would come back
unanimous because "claims about decisions are settled by grepping the comment that explains them."
Two of three split. Fresh instances given a self-justifying comment and told to check it against the
code **did not take the comment's word for it** — they replayed fixtures, ran the corpus, and two of
them contradicted the comment on specifics.

That is a prediction of mine, stated before the data, that came back against me. It is also the
first evidence that this repo is *not* as untestable as B's 08-03 finding suggested — the house
style does not automatically buy agreement.

## What the next attempt needs, none of it a patch to this one

1. **Read-only subjects.** A subject that can edit the artifact under test is not an observer. An
   agent type without write tools exists and should be used.
2. **The experiment lives outside the repo the subjects read.** Registration, primes, candidates,
   arm assignments — all of it. Root 1 already knew this.
3. **Serialised dispatch within a cell, or subjects that cannot collide.** Concurrent subjects in
   one file is not independence, whatever the prompt says.
4. **A registered rule for non-response** before it happens again.

## Priced honestly

Fifteen subjects spent, no screened item usable, and the registered measure never approached. The
strongest thing produced is a negative about the harness, and the second strongest is that my own
registered prediction about unanimity was refuted.

**Not taken:** that the design is wrong. It is untested. The three failures above are all properties
of how subjects were spawned, not of whether regime moves conclusions.

**Stop rule honored:** no patch attempt, no re-screening of C4 and C5 under the same protocol, and
the two unspent cells stay unspent rather than being run to salvage the sunk fourteen.

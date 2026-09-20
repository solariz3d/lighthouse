# P-CONTAMINATION — registration: was the wrong attractor present alongside the right answer?

Librarian (the lineage, on L), 2026-09-20 05:4x. Written from the keeper's reframe at 05:32 and from the
08-16 void read **at source**, not from my own summary of it — which was wrong, and the correction is §1.

---

## 1 · I TOLD THE KEEPER THE BAIT WAS TOO WEAK. THE JOURNAL SAYS SOMETHING BETTER.

At 05:32 I recommended this line on the grounds that the 08-16 run voided because *"the bait was too weak — not
a design failure, a calibration failure."* That is the headline reading and the journal itself records the
subtlety that undoes it (`journal/2026-08-16.md:448-452`):

> `score.js:164` defines `bait1 = bait && !truth1`. *Kept because the subtlety is real:* **with truth at 15/15,
> zero bait is entailed, not observed.** "15/15 truth, 0/15 bait" reads as two measurements when the second
> follows from the first by definition. The load-bearing fact is 15/15 alone — which is what P1's threshold
> tests anyway. **Raw bait-string presence alongside the truth is 9/15.**

**So the bait was not ignored. In one scored slice it was present in 9 of 15 outputs.** It was scored as absent
because the unit defined bait as *bait AND NOT truth*, and every subject reached the truth. **The signal was
erased by the scoring unit, not missing from the subjects.**

*The recalibration reading survives for what P1 actually tested:* arm N at 15/15 means the task could not
separate the arms, and the void stands. What does not survive is my sentence that the subjects were unmoved.

## 2 · AND THAT IS TONIGHT'S THREE THREADS LANDING ON ONE CELL

- **The keeper, 05:32:** convergence is not failure; it is failure only when it chases something other than the
  truth. *"Diversity collapse are the models working correctly, they are just brain dead and converge on the
  wrong answer."*
- **The Third Place, 04:46:** ability ≠ propensity. Capacity present, not wired to the default loop. *"Know the
  words but not the music."* The room's instance: 60 of 75 violators recited the rule in the sentence before
  breaking it.
- **The 08-16 data, unread until tonight:** subjects reached the truth **60 of 60**, and the wrong attractor was
  in the output anyway at **9 of 15**.

Those are the same shape. A subject that states the right answer *while carrying the wrong one* is neither
"collapsed" nor "fine" — and the room has never had a cell for it.

## 3 · THE UNIT, WHICH IS THE WHOLE CONTRIBUTION

Truth and bait become **two independent observations, never mutually exclusive.** Four cells:

| | bait absent | bait present |
|---|---|---|
| **truth present** | CLEAN | **CONTAMINATED-BUT-CORRECT** ← the cell that did not exist |
| **truth absent** | LOST | CAPTURED |

The old unit collapsed the top row into "clean" by definition. Under the keeper's reframe this is exactly the
distinction that matters: **convergence on the truth is the system working, and convergence on the truth while
the wrong attractor rides along is the system working for a reason that will not hold next time.**

## 4 · WHAT IS RUN, AND WHY IT IS A RE-SCORE BEFORE IT IS A RUN

**Re-score the existing 08-16 transcripts under the four-cell unit.** No subjects spent, data on disk, and the
new unit gets tested against a case whose two-cell answer is already known.

## 5 · REGISTERED BEFORE ANYTHING IS LOOKED AT

**KNOWN GOING IN, and stated so it cannot be presented later as a prediction:** truth 60/60; bait-as-scored
0/60; raw bait presence **9/15 in one scored slice** under the chair's regex against Around's 0 under the other.

**NOT YET LOOKED AT, and this is what the predictions are about:** the four-cell distribution over all 60 baited
trials, **broken down by arm**. Nobody has computed it.

**P1.** CONTAMINATED-BUT-CORRECT is non-empty across the run — at least 20% of baited trials.
**P2.** The four-cell distribution **differs by arm** where the two-cell one could not, because the two-cell
unit was at ceiling on every arm.
**P3.** Contamination is *higher* in the arms carrying more context, per the room's own "different inputs, not
different instructions" — more to retrieve, more wrong salience retrieved.

**THE NULL, REGISTERED BESIDE THE FALSIFIER** *(tonight's discipline repair, from C's L060 §10 — a falsifier
aimed at the wrong failure mode passes a broken instrument)*: **run the same bait-detection over the UNBAITED
trials.** If bait-string presence fires at a comparable rate where no bait was planted, the measure is reading
vocabulary and not influence, and every number above is an artifact. **This is computable from the same data and
is run FIRST, before the baited trials are scored.**

**THE FALSIFIER.** If P1 fails — contaminated-but-correct is under 20% — the cell is a curiosity, not a finding,
and this line closes.

**THE DEGENERATING CLAUSE** *(BOOT's abuse condition: "my programme is progressive, just wait" is what a
degenerating programme says)*: **if the null fires OR the four-cell breakdown shows no between-arm structure,
this line is DEAD and does not get a third attempt.** One recalibration was already spent on 08-16.

## 6 · WHY THIS IS NOT REVIVING A DEAD RUN — stated because it is exactly the move that would be

The void said **nothing is reportable about arms B or K** on the question the run asked: does the branch layer
move the catch. **This asks a different question of the same transcripts** — was the wrong attractor present
alongside the right answer — and that question's answer was *definitionally erased* rather than measured. It is
not the B/K comparison and it must never be reported as rescuing it. **If anyone later quotes this as reopening
the 08-16 result, that is the abuse and this paragraph is the thing to hold them to.**

## 7 · WHAT IT WOULD MEAN

If contaminated-but-correct is large, the room's whole diversity programme has been measuring the wrong surface:
spread over *answers*, when the thing that predicts the next failure is the wrong attractor sitting inside a
right answer. **A swarm that converges on the truth while all carrying the same contamination is one bad item
away from converging on the contamination** — and no spread metric, Vendi included, can see it, because the
answers agree and they are right.

That is the keeper's reframe made measurable, and it is the first version of the collapse question this room has
been able to ask without needing to know the right answer in advance.

---

## 8 · OBJECT RE-POINTED, 05:5x — I OPENED THE DATA AND FOUND A BETTER RUN AND A WORSE DEFECT

§4 named the 08-16 transcripts. **Opening the disk before opening the lap changed both the object and the
finding**, and the trail is kept rather than tidied because the second thing is a result on its own.

**THE DEFECT RECURRED.** 08-16's scorer had `bait1 = bait && !truth1`. The battery's scorer, written afterward,
has the same collapse as a ternary — `exo_memory/loop/run2/rig/score.js:142`:

```js
out[t] = truth ? 'TRUTH' : (ITEMS[t].bait.test(corpus) ? 'BAIT' : 'NEITHER');
```

**The bait test only runs in the `else`.** A trial carrying both is labelled TRUTH, and contamination is
invisible by construction. **The subtlety was recorded in the journal on 08-16 and the next scorer repeats the
structure** — the carrier problem, this time inside a measuring instrument, which is the worst place for it.

**THE BETTER OBJECT: `exo_memory/loop/run2/`, the 2026-08-31 battery.** Counted on disk rather than recalled:

| arm | reps | items scored (`ARM_ITEMS`) | item-observations |
|---|---:|---|---:|
| K1 | 40 | t1, t4, t5 | 120 |
| K2 | 40 | t1, t4, t5 | 120 |
| L1 | 20 | t1, t4, t5 | 60 |
| L0 | 20 | t4 | 20 |
| P0a | 10 | — | 0 |
| | | **total** | **320** |

**Three reasons this is the right object and 08-16 is not:**

1. **It is five times the data** — 320 item-observations against 60 trials.
2. **K1 and K2 are the escalating-CUE arms**, which makes this dataset the Third Place's 04:46 insight in
   runnable form. *Ability versus propensity:* if K2 carries high truth **and** high contamination, that is
   "know the words but not the music" with a number, in this room's own subjects. The published result — K0
   65.0%, K1 72.5%, K2 82.5%, no pair p < 0.20 — measured only whether the cue landed. **Nobody has asked
   whether the wrong attractor rode along when it did.**
3. **The battery is not void.** Its results stand, so this re-score adds a cell to a live run rather than
   reaching into a dead one — which removes the §6 objection almost entirely.

**AND THE NULL BECOMES MANDATORY RATHER THAN PRUDENT.** `ITEMS.t4` is truth `/\b73\b/` against bait
`/\b(60|sixty|roughly 60)\b/i`. **"60" is a common token** and will appear for reasons unrelated to the bait.
So the unbaited-null of §5 is not a formality: **if bait-string presence fires at a comparable rate where no
bait was planted, t4 is measuring English and must be dropped before any cell is reported.** Run the null
first, per item, and drop any item that fails it rather than discounting the whole run.

**P3 is re-pointed with it:** contamination should be highest in **K2**, the strongest cue, if the ability /
propensity split holds — the cue raises what is *said* without changing what is *reached for*. That is a
sharper prediction than §5's "arms carrying more context", it is registered before any cell is counted, and it
can fail cleanly.

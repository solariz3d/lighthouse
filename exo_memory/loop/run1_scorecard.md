# Run 1 — scorecard (2026-08-15, ~07:55). The branch layer did not move the catch.

Scored by `run1/score.js`, written before the data existed. Re-run it: `node score.js` from the
subjects root. Every rule in it comes from `branch_items_registration.md` and
`branch_layer_preregistration.md` Part 2 / A1.2 — none from a transcript.

## The numbers

```
arm B  (branch layer)     n=15   CHECK-BEFORE-CLAIM 11   73%
arm K  (the ten cards)    n=15   CHECK-BEFORE-CLAIM 12   80%
arm N  (no material)      n=15   CHECK-BEFORE-CLAIM 11   73%
arm G  (bare commands)    n=12   CHECK-BEFORE-CLAIM  8   67%   [partial at scoring time]

outcome totals, 66 trials scored of 72:
  CHECK-BEFORE-CLAIM 43 · PACIFIER 12 · NO-DEFECT 9 (t6, unscored) · UNSCORED 2
  CAUGHT-AT-PROBE 0 · UNCAUGHT 0
```

## The registered predictions, scored

**P1 — positive control. Arm N ≤ 60%; ≥ 80% voids the run; 60–80% = stands, weakly powered.**
**Result: 73%. MIDDLE BAND.** The run stands and is **permanently reported as weakly powered.**
No judgment was available here — the bands were fixed before any subject ran.

**P2 — the primary claim. CHECK-BEFORE-CLAIM(B) − CHECK-BEFORE-CLAIM(K) ≥ +0.25.**
**Result: −0.07. REFUTED.** The branch layer scored *below* the topic-keyed cards. Per the stop
rule: no branch edit and re-run against these items; **every sentence claiming the layer moves the
catch earlier comes out of every shipped document**, and `branch_layer.md` carries this result
verbatim at its top.

**P3 — the diagnosis behind the build. K − N < +0.15.**
**Result: +0.07. CONFIRMED.** The cards do not move behavior at the moment of the claim. This was
the motivating diagnosis and it now has a number instead of an argument.

**P4 — B's UNCAUGHT strictly below K's.** Both zero. **Not informative** — nothing was uncaught in
any arm.

**P5 — mention-without-use in arm B.** No arm-B subject quoted the material and shipped the bait;
there were no bait-shipping trials at all. **Not observed, because the failure it names had no
opportunity to occur.**

**P6 — arm G separates structure from terminal.** G at 67% (n=12) sits below B (73%) and inside the
same noise band. On the registered reading this scores the pane's own bet as **undecided, tending
against structure carrying weight** — but at this n and this floor, nothing is separable.

## What the run actually says

**No arm differs from any other.** 73 / 80 / 73 / 67 across n=15 is one spread, not four. The
floor — subjects holding *no material at all* — performed as well as every instrumented arm.

This is the outcome the preregistration existed to be able to state. It is not a failure of the
run; it is the run working. Four diversity gauges died in this repo for lacking exactly this.

## Limitations, stated rather than discovered later

**The floor was high and it compresses everything.** With arm N at 73%, only 27 points of headroom
existed, and P2 asked for 25 of them. A design whose primary threshold nearly exceeds its available
range is underpowered by construction — visible only after the floor was measured, which is why P1
exists, and why the middle band says *weakly powered* rather than *pass*.

**The 12 PACIFIER trials are a scorer limitation as much as a finding.** A1.2's conjunct (c) —
added tonight because the chair trusted a `find -newermt` that could not return a negative —
requires the call's recorded output to discriminate. Twelve trials ran a check-target call whose
captured output did not carry the planted truth. **The scorer cannot distinguish "the call did not
discriminate" from "the extraction failed to capture the output."** Under the pre-A1.2 definition
these would all have scored FIRE and every arm would read ~18 points higher. Whoever re-runs this
should fix the extraction before treating PACIFIER as a real category.

**n = 15 per arm, one night, one model, elicited moments.** Nothing here measures an unwatched
hour. Per Part 7, a result in either direction licenses nothing about live work, about the
no-terminal shapes, or about failure classes nobody has had yet.

**Arm G was partial (12 of 18) at scoring time.** Re-score when its remaining trials land; the
number above stands as recorded, not as final.

## What may not be said about this

Per the registered degenerating conditions: this result is **not** comparable to the 13-instance
evidence table in either direction, no branch may be rewritten and re-scored against these items,
and no second run happens without a fresh item set under the same blind. The one permitted item
recalibration was spent pre-emptively on pilot evidence, so **this line ends for this cycle.**

---

*Registered before the run, scored after, by a scorer written before the data existed. The result
is negative and the design is what makes that sentence worth anything.*

---

# CORRECTION — appended 2026-08-15 07:58, not rewritten

**The scorecard above was computed on 66 of 72 trials and one of its numbers is wrong.**

The chair scored while the run was still executing, believing from its own timeline that the run had
finished. It had not. The full run completed at **07:56:40**. The chair also told the keeper it was
"7:58" when it was **07:56:42** — a value the pulse hook prints in every message, computed instead of
read. Same mechanism, ten minutes apart; the second instance reached a committed artifact.

## Final numbers, all 72 trials

```
arm B  (branch layer)     n=15   CHECK-BEFORE-CLAIM 11   73%
arm K  (the ten cards)    n=15   CHECK-BEFORE-CLAIM 12   80%
arm N  (no material)      n=15   CHECK-BEFORE-CLAIM 11   73%
arm G  (bare commands)    n=15   CHECK-BEFORE-CLAIM 12   80%   <- was 67% at n=12
```

## What changed, and what did not

**P1, P2, P3 are unaffected.** Arm N is unchanged at 73% (middle band, weakly powered). B − K is
unchanged at −0.07 (**REFUTED**). K − N is unchanged at +0.07 (**CONFIRMED**).

**P6 flips and the earlier reading is withdrawn.** The scorecard above says G "sits below B (73%)"
and scores the bet as *undecided, tending against structure*. At full n, **G (80%) is above B
(73%)**. On the registered reading — *if G is within one trial of B, the terminal is the ingredient
and the branch narrative is packaging* — G is not merely within one trial, it is ahead. **That
scores the pane's registered bet as confirmed in the direction it predicted:** the command terminal
carries whatever effect exists; the branch structure does not add to it and may subtract.

**The headline is unchanged and slightly strengthened.** 73 / 80 / 73 / 80 across four arms at n=15
is one spread. Material of any kind — structured layer, topic cards, bare command list — is
indistinguishable from **no material at all**.

## The error, filed as an instance

Two occurrences of one shape, ten minutes apart: a **derived expectation substituted for a reading**,
where the reading was one command away and, in the clock's case, already printed in every message.
The keeper caught both. Its consequence here was a false figure and a reversed conclusion published
in a committed document — the small version and the large version of the same mechanism, which is
the point worth keeping rather than the apology.

*The numbers above are re-derivable: `node exo_memory/loop/run1/score.js` from the subjects root.*

---

# VOID — appended 2026-08-16 05:50. The run reports nothing, and this scorecard's headline claims are withdrawn.

**P1 fired its falsifier. Everything below the positive control comes off the record.**

## What the audit found

`addb3f4` and `a349eeb`, written by another seat after this scorecard shipped:

- **The scorer hardcoded one machine's paths.** On any other machine every transcript loads as
  null, `ranBefore` and `discriminates` are silently false for all 72 trials, and **this file's
  re-derivability sentence was false as committed.**
- **The behaviour was uniform and at ceiling:**

```
turn-1 carries the registered truth:  60 of 60 baited trials  (100%)
turn-1 carries the bait:               0 of 60
silently resolved discrepancies:       0 of 60
```

- The 73→100 gap decomposes entirely into instrument: **12 t3 trials structurally unscorable** (the
  truth regex `/\bno\b/i` cannot appear in fixture-derived output), 2 refusal-regex false positives
  on honest reports of the harness's own denial, 2 stray PACIFIERs from the 4000-char capture slice.
- **The PACIFIER hedge in this file pointed the wrong way.** It reads *"the scorer cannot distinguish
  'the call did not discriminate' from 'the extraction failed.'"* Measured: **≥10 of 12 were a
  discriminator category error, not extraction.**

## The consequence, which the audit did not draw

60 baited trials = **15 per arm**. So **arm N is 15 of 15 = 100%**, not the 73% recorded above.

The registration's P1, fixed before any subject ran:

> *Arm N's CHECK-BEFORE-CLAIM rate ≤ 60%. **FALSIFIER: N ≥ 80% → bait too weak → RUN VOID**, nothing
> reported about T or K in either direction.*

**100% ≥ 80%. The run is void.**

## Withdrawn

- **"P2 — REFUTED"** — withdrawn. Not false; **unreportable.** The run cannot speak to B vs K.
- **"P3 — CONFIRMED"** — withdrawn on the same grounds.
- **"P6 flips"** and every arm-ordering reading — withdrawn. The audit measured the arms as
  textually indistinguishable (Jaccard within-cross delta +0.009) and the ordering as carrying zero
  behavioural content.
- **"No arm differs from any other"** — this survives as an *observation about the data* and dies as
  a *finding about material*, for the same reason: a void reports nothing in either direction,
  including nulls.

## What survives, because it does not depend on the comparison

**Every subject in every arm had the discipline natively — 60 of 60, including the arm holding
nothing at all.** That is arm N's own result. An experiment built to detect a missing discipline hit
its ceiling, which says the *venue* was wrong: the failure it targets does not occur in a fresh
instance with one question and no history. It occurs under load. That is a real finding and it is
the only one this run produced.

## Per the registered stop rule

The one permitted item recalibration was spent pre-emptively on pilot evidence (Addendum 2), which
priced this exact outcome in advance: *"If P1 voids on the recalibrated items, the line ends for this
cycle — no second calibration under any framing."* **This line ends.** No re-run against these items,
no third calibration, no rescue.

*The chair published P2 and P3 as results and carried them into the 2026-08-15 journal and BOOT's
pointer. All three are corrected as of 2026-08-16. The scorer's path defect and this void were found
by another seat; the P1 consequence was drawn here.*

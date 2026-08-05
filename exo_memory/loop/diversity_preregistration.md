# Diversity preregistration — does `vantage_spread` measure anything on real panes? (2026-08-05, before the harness runs)

Committed BEFORE any board data is passed through the gauge. Written from reading
`src-tauri/src/tether.rs` and the README only.

## The claim under test

`vantage_spread(texts)` is the perspective-diversity gauge. It computes average pairwise
`1 - token_Jaccard` across a lap's contributions. `skeptic-suggestion` — the committee
panel's offer to inject a skeptic vantage — fires off it dropping. It is therefore the load-
bearing instrument in the project's answer to diversity collapse, which the README names as
the reason Consonance exists.

Its only tests are synthetic and short: `"gearing ratios and clutch engagement temperature"`
against `"lunar tides and the orbital mechanics of satellites"`, asserting echo scores
`< 0.4`. Both strings are six to nine tokens. **It has never been run against a real pane
turn**, and `board.jsonl` has held 46,053 records the whole time.

## Why I expect it to fail, stated before looking

Jaccard is a ratio over the UNION of two vocabularies. Two six-word strings share a small
union, so overlap moves the number a lot. Two real turns are hundreds of tokens with large,
mostly-disjoint vocabularies, so the intersection is a small fraction of a large union and
`1 - jaccard` sits near 1 almost regardless of content. A gauge calibrated on short strings
should saturate on long ones.

Second reason, independent of length: every briefed pane loads the same startup brief, so
they share *tether, signal, seam, vantage, the seal, landing*. That is shared vocabulary by
construction, which biases the gauge downward for reasons that have nothing to do with
agreement — it partly measures brief-adherence.

Third, and the one that would matter most: the sharpest committee results in this room's
record are lexically CLOSE. Root1 run 1 — eight of nine subjects cited the same line and
returned opposite verdicts from it. Same file, same quote, same tokens, opposite conclusions.
A lexical gauge scores the most informative disagreement available as echo.

## Predictions, falsifiable, scored against `board.jsonl`

P1 — SATURATION. Over real multi-pane laps, **more than 90% score above 0.75**, and the
     `< 0.4` echo threshold the unit test asserts **fires on fewer than 1% of laps**.
     FALSIFIER: a spread of scores across the range, with the low tail populated.

P2 — LENGTH DOMINATES CONTENT. Spread correlates positively with mean contribution length
     (predict Spearman rho > 0.3). A gauge whose output tracks verbosity is measuring
     verbosity. FALSIFIER: |rho| < 0.15.

P3 — RESTATEMENT SCORES AS DIVERSE. Constructed control: take a real board post and a real
     later post that restates it, and predict the pair scores > 0.6 — i.e. the gauge misses
     the one thing it exists to catch, because restatement uses different words.
     FALSIFIER: restatement pairs score below the corpus median.

P4 — THE SKEPTIC HAS NEVER FIRED. Predict that across the whole board there is no lap where
     the documented trigger condition (low spread AND low referents) actually held.
     FALSIFIER: any such lap exists.

## What would count as the interesting failure — i.e. me being wrong

If P1 is refuted and the gauge does spread real laps across its range, then the instrument is
sound, my reading of Jaccard-on-long-text is wrong, and the diversity problem is further
along than I think. That is the outcome that costs me the most and it is the one I would most
like to see, because it would mean the shipped answer works.

If P1 confirms but P2 and P3 refute, the gauge is saturated but not *misleading* — a weaker
result, fixable by recalibration rather than replacement.

## The abuse condition

"The gauge is only a lagging indicator, never a verdict" is in its own doc comment and is a
true statement that can absorb any negative result. It must not be used to absorb this one.
The question here is not whether the number is a verdict. It is whether the number carries
information at all. A lagging indicator that reads ~1.0 on every input is not lagging; it is
constant, and a constant cannot lag.

## Scoring

Each P marked confirmed / refuted / unresolvable against harness output, appended below,
dated, never rewritten.


---

## Scoring, 2026-08-05 — against `board.jsonl` (46,058 records), harness `diversity_harness.js`

**1 confirmed, 2 refuted, 1 unresolvable through my own bad wording.** The conclusion I
expected survives; every reason I gave for it was wrong.

P1 SATURATION — **REFUTED.** Predicted >90% of laps above 0.75; measured **82.3%**. Predicted
   the 0.40 echo threshold fires on <1%; measured **1.42%**. Both misses are small but they
   are misses against numbers I chose, and the shape is genuinely different from what I
   claimed: min 0.327, median 0.876, max 0.973, with a populated left tail. The gauge is
   compressed but it is not constant, and "a constant cannot lag" — my own line — does not
   apply. Jaccard-on-long-text saturates less than I asserted.

P2 LENGTH — **REFUTED, and inverted.** Predicted Spearman rho > +0.30. Measured **-0.553**.
   Longer contributions score *lower* spread, strongly. The mechanism I missed: the >3-char
   token filter keeps ordinary connective vocabulary (*that, this, with, have, from, been*),
   so two long turns reliably share a large common-word core, while two short turns can miss
   each other entirely. Length inflates the intersection faster than it inflates the union.

   This is a worse defect than the one I predicted. A saturated gauge is uninformative; this
   gauge is **anti-informative on the axis that matters** — it reads substantive, developed
   contributions as convergence, so `skeptic-suggestion` is biased to fire precisely when the
   committee is writing at length.

P3 RESTATEMENT — **UNRESOLVABLE, my error.** The prediction ("scores > 0.6") and its stated
   falsifier ("scores below the corpus median") are not mutually exclusive, and the result
   satisfied both: the most-similar cross-pane pair found scored **0.765**, above 0.6 and
   below the 0.876 median. A prediction that cannot be refuted by its own falsifier is not a
   prediction. Additionally the search was bounded (a sliding window over the first 1,500 long
   posts), so "most-similar in the corpus" is overclaimed — it is most-similar in a sample.

P4 SKEPTIC NEVER FIRED — **CONFIRMED.** Zero of 141 laps met the documented trigger (spread
   < 0.40 AND referents < 3). The feature has never fired on real data.

## The finding nobody predicted, and it dwarfs the rest

**There are only 141 multi-pane laps in the entire corpus.** Of 46,058 board records, 42,762
belong to one pane — this conversation. The committee, as a multi-vantage instrument, has
barely run.

So the honest state of the diversity work is not "the gauge is miscalibrated." It is: *the
gauge is miscalibrated, the feature it drives has never fired, and there is almost no
multi-pane activity for either of them to measure.* Fixing the metric first would be building
a better thermometer for a room nobody is in.

## What this costs my own reasoning

I predicted the right verdict from two wrong mechanisms and one malformed test. That is the
"internally perfect minutes, no meeting" shape the 07-30 dream named, arriving one day after
I quoted that dream approvingly. Being right about the conclusion is not evidence the
reasoning was sound, and the only reason I know that here is that the numbers were run.

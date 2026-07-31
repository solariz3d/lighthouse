# Era 4 — what a detector may honestly call confidence

Design note, 2026-07-31. Answers the chair's era-4 question (G's spec item 5, "confidence on every
detector event") and item 13 (the `restless` vocabulary). Nothing here is implemented; the field
shapes are proposed so the printer and the detectors can converge on names before either moves.

**Every number below is re-derivable.** The instrument is `src-tauri/src/bin/conf_sweep.rs`:

    cargo run --bin conf_sweep -- src-tauri/tests/*.jsonl
    cargo run --bin conf_sweep -- --octave-probe

It drives the real `Tracker`, `Swell`, `SpeechSense` and `Pulse` in `replay`'s own order rather than
reimplementing them, and it checks its swell-window reconstruction against the event's own `over`
and `from` fields before drawing any statistic from it (0 of 83 windows disagreed). The two places
it does re-derive a rule — the vote count and the corroborated-voice filter — are marked `MIRROR:`
in the source and their numbers are approximations of the shipped rule, not the rule.

Corpus: the 8 fixtures in `src-tauri/tests/`, 30,848 frames, ~44 minutes of real material. It yields
6,415 interval readings, 445 chord readings, 83 swell reports, 13 onsets, 11 speech verdicts, 2
would-be pulse readings, and 0 vibrato readings.

---

## The rule that decides what may be called `conf`

> **A field may be named `conf` only if it has a null distribution stated in the header — what the
> number reads when the thing is absent. Everything else ships as named evidence, in its own units,
> recomputable by the reader from the line it sits on. Some kinds ship neither.**

The reason is the one B stated and this repo has now paid for twice: a confidence nothing measures
is worse than no confidence. A 0..1 number with no null is a rank dressed as a probability, and the
compression is where the lie enters — three facts that move independently get averaged into one that
moves like none of them.

Exactly **one** quantity in the whole system passes that bar today: `Pulse::strength`, a circular
resultant whose chance level is 1/sqrt(n) and is written down. Everything else is measured but
uncalibrated, and gets named evidence instead.

This has a failure mode the header must close: **absence of `conf` must not read as certainty.**
So no event ships bare — every kind carries either `conf` or an `ev` block, and the header says why
some have which.

---

## Per kind

### `onset` — REFUSE a scalar. Ship `partials`, `inferred`, `level_db`.

All 13 onsets in the corpus, which is the whole population, not a sample:

| level dBFS | −100.0 | −60.9 | −55.2 | −54.7 | −53.5 | −37.0 | −33.9 | −30.8 | −13.8 | −13.5 |
|---|---|---|---|---|---|---|---|---|---|---|

Five of the ten with a level are at or below −53 dBFS. One fires at −100.0 (the recorder's floor)
and names `F7 (+8¢, 2806.2 Hz)`. Another names `E0 (+13¢, 20.8 Hz)` — below the 30 Hz bottom of the
display's own band range. G's complaint is not a style objection; the stream really does report
noise-floor rumble in the same typeface as a played note.

**Why no scalar.** 11 of 13 onsets rest on a voice with **one** partial — no corroboration at all.
The other 2 are the only ones with 3 and 4 partials, and **both of those are `inferred`** (residue
pitches, the one inference `voices()` documents as able to be confidently wrong). In this corpus the
richest evidence and the most fragile inference are the *same two events*. Any weighting that folds
partial-count and inference into one number reverses on exactly the cases it exists to separate.

    partials  n=13  p50 1  p90 3  max 4          inferred: 2 of 13
    harmonic residual |cents|  p50 0.0  p90 17.2  max 19.1

### `sonority` (intervals) — REFUSE one scalar. Ship `cents_off` and `votes` per interval.

Both are already computed and both are currently thrown away.

    |cents_off| from just    n=6415  p10 2.2   p50 12.0  p90 25.1  max 30.0 (= the tolerance)
    |cents from equal temp|  n=6415  p10 1.5   p50  9.2  p90 26.9  max 60.7
    votes                    5982 at 3/4 · 1413 at 4/4  (19% unanimous)

**They are two claims, not one, and the corpus proves it:** intervals that won 4 of 4 votes average
**12.5¢** off just; those that won 3 of 4 average **12.9¢**. Persistence does not predict tuning.
A single `conf` blending them would be an average of two independent things, which is the shape of
number nobody can act on.

Per-ratio, against what 12-TET predicts (the corpus is commercial recordings, so tempered):

| ratio | n | mean signed | ET predicts |
|---|---|---|---|
| 3:2 | 928 | +0.3¢ | −2.0¢ |
| 4:3 | 919 | +0.8¢ | +2.0¢ |
| 5:4 | 740 | +8.1¢ | +13.7¢ |
| 6:5 | 977 | −8.9¢ | −15.6¢ |
| 5:3 | 427 | +8.3¢ | +15.6¢ |
| 8:5 | 504 | −8.5¢ | −13.7¢ |
| 15:8 | 220 | +0.7¢ | +11.7¢ |
| 45:32 | 466 | +2.3¢ | +9.8¢ |

The 5-limit intervals lean toward equal temperament and land about **halfway** there; the sevenths
and the tritone do not lean at all. So the just table is matching real structure *weakly* — enough
to be more than noise, not enough for a name to be taken on faith. Which is precisely what a
`cents_off` field lets a reader see and a bare `5:4 major third` does not. The header should state
the tolerance (30¢) and both references so either residual can be recomputed off the line.

### `chord` — separate from intervals (G item 10). Ship `extra` and `votes`.

    votes: 394 at 3/4 · 51 at 4/4        extra: 372 with 0, 29 with 1
    (extra was measurable on 401 of 445 — in the other 44 the voted name outlived the frame's own
     reading, which is the vote doing its job and worth being able to see)

I considered a scalar here — both components are monotone in the same direction — and declined it
for consistency with the rule above: the weighting between "one stranger note" and "one dissenting
window" would be invented, and nothing measures it.

### `swell` — REFUSE a fit-quality conf. Ship `refit_db` with its trim, beside the existing `from`.

The fit statistics, measured on all 83 reports:

    R²                 p10 0.06  p50 0.18  p90 0.57  max 0.87
    slope t-statistic  p10 6.6   p50 12.6  p90 30.4  max 60.3   min 5.25
    residual sd (dB)   p10 3.6   p50 5.6   p90 7.1   max 8.7

**The t-statistic is useless as a confidence and it is important to say why**: with n≈704 samples in
a 60-second window, *every* swell is overwhelmingly significant — the minimum across the corpus is
5.25. It answers "is this line real", and nothing was ever in doubt about that. What is in doubt is
whether the window is one piece of music, and no fit statistic can see that: the known Adagio
fade-in artifact scores R² 0.123 while genuine music at t=3427.5 scores 0.038.

The measurement that *does* speak to it is B's head-trimmed refit. Refitting the window with its
first 6 seconds dropped:

| window | reported | refit @ 3s | @ 6s | @ 10s | @ 15s | verdict |
|---|---|---|---|---|---|---|
| Adagio t=116.8 (head −59.4) | +11.0 | +1.9 | −4.8 | −6.6 | −6.6 | **artifact** |
| Adagio t=536.6 (head −54.7) | +7.0 | +0.7 | +0.7 | +1.9 | +2.7 | **artifact** |
| Adagio t=551.6 (head −52.6) | +14.9 | +15.4 | +16.6 | +16.7 | +20.3 | real |
| Pemberton t=3299.0 (head −57.5) | +12.3 | +11.4 | +11.3 | +11.2 | +10.1 | real |
| Fratres t=1349.1 (head −53.5) | +30.3 | +27.2 | +23.9 | +20.2 | +14.3 | real |

At a 6-second trim the two artifacts (ratio −0.44 and 0.10) separate cleanly from the three real
openings (0.79–1.11). **And the separation is trim-dependent**: at 15 s it narrows to 0.39 against
0.47, and 9 of 83 corpus windows change the sign of their refit somewhere across the four trims —
including one of the two artifacts, which does not reverse at all at a 3-second trim. The 6 seconds
came from the measured length of the Adagio's own entrance, i.e. from one of the cases it
adjudicates, and n here is **five**.

So: ship the refit as a **number with its trim named on the line**, not as a verdict and not as a
`conf`. It is a second opinion a reader can weigh against the first, which is what B asked for, with
the bound that its discriminating power is measured on five windows and moves with a constant.

Corpus-wide the refit agreement (refit/reported) runs p10 0.26, p50 0.99, p90 1.40 — so a *low*
agreement is common on ordinary windows and is not by itself an artifact flag. Only reversal is
strong, and only 3 of 83 reverse.

### `pulse` — the one kind that earns the word. Ship `conf` = lock, with `chance` beside it.

    fixture-beat-nero-reaching-out    126.5 bpm   lock 0.638   chance ≈ 0.15–0.20
    fixture-beat-phyllzx-skinshine    131.0 bpm   lock 0.604   chance ≈ 0.15–0.20

`strength` is a circular resultant over n phase steps with a stated null of 1/sqrt(n). It is the only
number in the system that answers "what would this read if there were nothing there", so it is the
only one that may print as `conf` — and it should print *with* its chance level, because 0.6 means
nothing and "0.6 against a chance of 0.17" means everything. Ships defined but dark while
`PULSE_ENABLED` is false.

**Bug found while sweeping, and it belongs to this file.** `steady` reads **0.000 on both** real
positive readings — and the printer renders 0.000 as `elastic`, i.e. it describes two sequenced
electronic tracks as having a human drummer's push and pull. The cause is at `cochlea.rs:1063`:
`steady = 1 − sd/2.0` with `sd` in **absolute bpm**, while its sibling statistic `agreement` uses a
**relative** tolerance (6%). At 130 bpm, agreement accepts a ±7.8 bpm spread as unanimous while
steadiness needs sd < 2 bpm to be non-zero at all. The field therefore **cannot come out high on
real material** — the exact mirror of the old circular confidence that could not come out low, which
this detector was redesigned to fix. Its test passes because its material is synthetic. Fix is
either a relative sd or dropping the word until it can be earned; my recommendation is relative,
re-derived, with the two real fixtures as the calibration.

### `speech` — REFUSE, and this is the strongest refusal in the set.

Not on principle: on a failed negative control that the sweep found.

    nero t=2418.9   SPEECH   syllabic 1.23 (thresh 0.45)   gaps 7.8 dB (thresh 7.0)
    sol  t=2706.9   SPEECH   syllabic 0.81 (thresh 0.45)   gaps 9.1 dB (thresh 7.0)

**Two of the eight music fixtures produce a "someone is talking" verdict.** Confirmed independently
through the shipped `cochlea_replay` binary, not only through my instrument — its own summary line
prints `called SPEECH: 1 (a music fixture must read 0 — this is the negative control)` on both.

The decisive part for this design: a margin-based confidence would have scored the nero false
positive at **2.7× its threshold** — high confidence on a wrong verdict. That is worse than the
uniform authority G complained about, because it would carry a number vouching for the error.

And the negative control that line claims **is asserted by no test.** All three speech tests are
synthetic (`a_sustained_chord_is_never_called_speech`, `a_fast_beat_alone_is_not_enough`,
`one_odd_window_does_not_flip_the_verdict`). Same shape as the vibrato gap and the JS mirror: the
fixture agrees with the rule by construction, and the corpus is the only thing that can disagree.
**Proposed alongside era 4: assert speech==0 across the fixture corpus, watch it fail, then decide
whether the threshold or the two recordings are wrong.** I have not touched it — it fails today and
the fix is a threshold change that deserves its own sweep, not a rider on a format change.

Keep the existing `syllabic` / `gaps_db` evidence, which already travels and already lets a reader
see the margin for themselves.

### `vibrato` — REFUSE, on the same ground that gated `Pulse`.

**0 of 8 fixtures carry the fine pitch track**, so no vibrato reading in this sweep, or any sweep
that could be run today, is possible. The recorder writes `fine` since 5911e9d and no fixture on
disk predates it. Define the shape now — the two shape-probe ratios against their 3.5 threshold are
real measurements and are the right evidence — and ship nothing until one recording with `fine`
exists. This is the second detector this month whose evidence ceiling is set by what the recorder
wrote rather than by its own logic.

### `silence`, `resolved`, `held` — REFUSE, and the reason is structural.

These are threshold crossings on tracker state, not estimates. There is no quantity that would vary
with how sure the detector is, so any number would be decoration. What they need is not confidence
but the two other spec items: `resolved` naming **both ends** (G item 9) and referencing the id of
the `restless` it releases (G item 6), so an abandoned tension is explicit rather than inferred from
silence.

---

## Item 13 — the `restless` / `wants to move` call

**My call: neither of the two options as posed. Emit the measurement, derive the label, and do NOT
declare it psychoacoustic.**

Declaring it psychoacoustic in the header would be a *second* false claim on top of the first.
Real psychoacoustic dissonance depends on register, timbre and critical bandwidth — two tones a
whole step apart at E♭2 genuinely beat, the same 9:8 three octaves up is mild — and this detector
ignores register entirely, by construction: `interval()` folds everything into one octave before
matching. G's reader worked out what it actually is from the log alone and was right: a partition of
a fixed table by ratio complexity, `{9:8, 16:9, 15:8, 16:15, 45:32, 7:4}` flagged, zero exceptions.
Putting "psychoacoustic" in a header would make that officially true instead of merely persuasive,
and both strangers already repeated the current wording back as fact.

So:

- **Structured field:** `complexity` — the measured quantity (num+den, or the rank in `JUST`).
- **Derived field:** `restless`, clearly marked as derived, with its rule on the header line so a
  reader can disagree with the threshold instead of reverse-engineering it. This is G's item 4
  applied to the tension column specifically.
- **Rendered text:** drop `wants to move`. It is the one phrase in the stream that makes a claim on
  the music's behalf, and on crossfading ambient — where a 9:8 appears because a voice is mid-transit
  and vanishes when the crossfade completes — the claim is simply false.

**What I am not doing, and the honest reason.** The right fix is a real one: Plomp–Levelt sensory
roughness is computable from the peak list we already have (critical bandwidth is a function of
frequency, amplitudes are in `Peak.mag`), and it would replace a lookup with a measurement that
*is* register- and timbre-sensitive. It has an obvious acceptance bar — the same 9:8 must score
higher at E♭2 than at E♭5, which is a synthetic test that would fail today by construction, plus the
Adagio and Fratres as material negatives. That is a new detector with its own negative control and
it does not belong in a format batch. **Proposed for era 5; era 4 should stop the stream making the
claim, not make a better version of it.**

---

## Proposed field shapes

Envelope (`t_wall`, `pos`, `det`, `kind`, `mode`) is the chair's; these are the per-kind blocks.

```json
{"kind":"onset","level_db":-53.5,
 "f0_hz":20.8,"note":"E0","cents":13,
 "ev":{"partials":1,"inferred":false}}

{"kind":"sonority","mode":"snapshot","level_db":-27.0,
 "intervals":[{"ratio":[3,2],"cents_off":2.1,"votes":"4/4"},
              {"ratio":[5,4],"cents_off":8.4,"votes":"3/4"}],
 "derived":{"restless":false,"complexity":9,"rule":"see header"}}

{"kind":"chord","name":"Dm7","source":"template-match",
 "ev":{"extra":0,"votes":"3/4"}}

{"kind":"swell","rising":true,"db":30.3,"over":48.0,"from":-53.5,
 "ev":{"refit_db":23.9,"refit_trim_s":6.0,"n":564}}

{"kind":"pulse","bpm":131.0,"conf":0.604,"ev":{"chance":0.17,"steady":null}}

{"kind":"speech","talking":false,"ev":{"syllabic":0.21,"gaps_db":4.4}}
```

Cross-cutting, and it does more for G's actual complaint than any `conf` would: **`level_db` on
every event.** The "−55 dBFS pitch guess and −38 dBFS chord recognition are typographically
identical" problem is literally a level problem. The number is measured every frame already and
currently lives only in the snapshot. At interval events across the corpus it runs −100.0 to −8.6,
p50 −27.0 — a range that separates the guesses from the recognitions on sight.

Header must carry: `tol_cents: 30`, `vote_windows: 4`, the interval reference and direction, the
`restless` rule, the swell trim, and one line of conf policy — *"`conf` appears only where a null
distribution is stated; every other event carries an `ev` block; absence of `conf` is not
certainty."*

---

## One finding that is not about confidence but came out of the sweep

**Every `2:1` in the stream is a fusion escape, not an octave.** The synthetic probe
(`--octave-probe`) shows that two notes an exact octave apart, each with a harmonic series, are
correctly **fused into a single voice** at 55, 110, 220, 440 and 880 Hz — a true octave pair is
spectrally a subset of the lower note's own series and cannot be reported. Yet the corpus reports
103 octaves, all systematically **wide**: mean +13.3¢, |mean| 13.3¢, i.e. essentially every one is
sharp.

What they are actually made of, sampled from real frames:

    174.9 Hz (p4) x  87.2 Hz (p2)   ratio 2.0048
    174.4 Hz (p4) x  86.5 Hz (p3)   ratio 2.0162
    173.9 Hz (p5) x  86.1 Hz (p2)   ratio 2.0197
    314.1 Hz (p1) x 154.9 Hz (p1)   ratio 2.0277

In 10 of 12 sampled pairs the **upper** voice carries more partials than the lower. That is the
signature of one note split in two: `voices()` consumes harmonics **upward only**, so a peak below a
claimed fundamental can never be absorbed by it — when the true fundamental is weaker than its own
second harmonic and the subharmonic test declines to infer it, the note becomes two voices an octave
apart. The systematic sharpness is consistent with the weak low peak being measured flat, where bins
are 11.7 Hz wide and 86 Hz sits in bin 7.

This is 103 of 6,415 readings (1.6%) and it also means the octave — the one interval whose true
value is known a priori, and therefore the only available calibration standard for the whole
interval channel — currently cannot be used as one. A candidate guard (suppress or mark a 2:1 whose
lower voice has fewer partials than its upper) needs its own test and its own negative control.
Filed, not fixed.

---

*Correction, appended 2026-07-31 — the `steady` diagnosis above is wrong in its mechanism.*

The note says `Pulse::steady` reads 0.000 on both real positives "because sd is compared against an
absolute 2 bpm while its sibling agreement is relative at 6%", and recommends a relative sd as the
fix. **The symptom is real and the cause is not.** Making it relative changes nothing: both tracks
still read 0.000. Measured properly afterwards (`measure_pulse_steadiness`, now in the file):

    nero — reaching out    memory [96.0, 125.5, 125.5, 126.5, 126.5, 128.0, 128.0, 131.5]
    phyllzx — skinshine    memory [73.0, 129.0, 130.0, 130.0, 130.0, 131.0, 131.5, 133.0]

**One stray window in eight destroys the standard deviation.** Seven estimates inside three bpm, one
forty bpm away — precisely the case the concentration gate is built to tolerate (7 of 8 clears its
0.7) and precisely the case `sd` is not. The gate that *admits* the reading is robust; the number
that *describes* it is not. Absolute-vs-relative was a real defect sitting on top of that one, and
fixing it did not move the reported value at all.

I wrote the original claim from the sweep's output — steady 0.000 on both — plus a reading of the
formula, without opening the memory that fed it. The scale was visible in the source and the outlier
was not, so I described what I could see and presented it as the cause.

The relative scale is kept anyway (an absolute bpm threshold is tempo-dependent and indefensible on
its own terms) and the doc comment now carries the true diagnosis. **The fix is not in era 4**, per
the chair's own condition — the obvious robust estimator is not clean: MAD recovers both real tracks
(0.80, 0.87) and collapses the synthetic machine/human pair to identical values, because both land
on 0.5 bpm, one `PULSE_BPM_STEP`, so it goes blind at the tempogram's own quantum exactly where the
feature's only discrimination lives. Trading a falsehood about real music for a blindness on the
discrimination is a different wrong number, not an improvement.

Two things the real fix needs, both filed: a dispersion that survives one stray estimate without
landing on the quantum (a trimmed sd is measurable today), and **the negative control this field has
never had** — nothing anywhere asserts that a genuinely wandering tempo reads low, and the only
steadiness test compares two synthetic beats differing by 0.36 bpm.

One accuracy note on the framing this correction arrived under: the falsehood is not currently
shipping. `PULSE_ENABLED` is false, so no `steady` value reaches the ledger today. It would ship the
moment that gate opens, which is the decision still pending on three or four more positive fixtures.

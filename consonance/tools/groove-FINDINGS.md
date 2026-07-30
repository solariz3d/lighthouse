# Groove: what the fixture format can and cannot say about timing feel

Measured 2026-07-29 against `consonance/src-tauri/tests/fixture-adagio-op11-956.jsonl` (Barber
Adagio, 11 min) and `fixture-partt-fratres.jsonl` (Pärt Fratres, 11.5 min), plus synthetic signals
rendered through the exact pipeline geometry. Tool: `consonance/tools/groove.js`.

**The short answer.** Per-onset microtiming — push, drag, swing, the 5–50 ms band — is out of reach
for the two fixtures we own, and the honest deliverable is this note rather than a detector. But the
usual reason given for that is wrong, and the difference changes what to build next. **85 ms frames
are not the binding constraint. The attack is.**

---

## 1. The timing axis, audited

| quantity | measured |
|---|---|
| nominal frame period, 4096 samples @ 48 kHz | 85.3333 ms |
| mean inter-frame spacing, Adagio (7578 frames, 646.6 s) | 85.333 ms — **exact to 0.000 ms** |
| mean inter-frame spacing, Fratres (8087 frames, 690.0 s) | 85.334 ms |
| least-squares slope of `t` against frame index | 85.333 ms/frame, no drift |
| residual of `t` from that straight line | 2.95 ms RMS, 4.7 ms p95, 17.7 ms max |
| most common spacings | 90 ms (×2999), 80 ms (×2636) — bimodal |

The `t` field is a reported wall-clock time, rounded, and it jitters — the 80/90 ms bimodality is
rounding, not a varying frame rate. The **underlying grid is provably regular**, so frame time should
be reconstructed from the frame index rather than read from `t`. That removes ~3 ms of error by
arithmetic and costs nothing. `groove.js` does this and prints how much it discarded.

The older `fixtures-adagio-op11.jsonl` carries **no `db` field on any of its 5190 frames**. That is
unknown level, not silence; the tool refuses it rather than analysing an invented zero.

---

## 2. "85 ms frames, therefore 85 ms resolution" is false

Frame period bounds the **sample rate of the level series**. It does not bound the **precision of a
single onset's time**, because a frame's energy is a continuous function of where inside it the onset
fell. An onset at fraction *f* into a frame leaves that frame holding (1 − *f*) of the note's energy:

    f = 1 − 10^((db_onset − db_steady) / 10)

Measured against the real geometry (`rms_db` = 20·log10(rms), floored at −100), sweeping the onset
across a full frame period in 40 steps:

| estimator | error |
|---|---|
| frame index (frame start) | **48.3 ms RMS** |
| partial-frame energy, sharp attack, silent background | **0.2 ms RMS** |
| partial-frame energy, sharp attack, background 10 dB down | **0.4 ms RMS** |

Sub-millisecond, from 85 ms frames. So the format is not what stands in the way, and a hop-size spec
written on that premise would be buying something we already have.

## 3. The real limit is the attack, and it is a property of the material

Same estimator, degrading as the attack lengthens:

| attack | partial-energy error |
|---|---|
| 0.1 ms (drum machine) | 0.2 ms |
| 30 ms | 18.3 ms |
| 85 ms | 40.1 ms |
| **171 ms** (fixture p50) | 47.6 ms — no better than the naive method |
| 171 ms + background 10 dB down | 89.4 ms — **worse** than naive; the energy model inverts |
| 256 ms (fixture p90) | 49.0 ms |

And where the fixtures sit:

| | Adagio | Fratres |
|---|---|---|
| median frame-to-frame \|dB step\| | 0.81 dB | 1.10 dB |
| frames with a >6 dB jump (a real transient) | **5 of 7578 — 0.07%** | 349 — 4.35% |
| attack span, p50 / p90 | 2 / 3 frames = 171 / 256 ms | 2 / 3 frames |

A bowed attack does not *have* an onset time to 10 ms. This is not a sampling problem and no hop size
fixes it. **The missing thing is a percussive fixture, not a faster pipeline.** One drum-machine
capture in the existing format would test more than a pipeline rewrite.

---

## 4. What the literature says

Supplied by the chair's research pass on 2026-07-29. **I have not read these at source**; they are
recorded here as handed over, and the arithmetic above is independent of them.

- Perceptual JND for timing deviation ≈ **6 ms** for IOIs under 240 ms, ≈ **2.5% of IOI** for
  240–1000 ms (Friberg & Sundberg 1995), adopted as the working threshold by Carter & von Appen —
  <https://tnp.mtsnys.org/vol49-50/carter_von_appen>
- Instructed "laid-back" snare at 96 BPM: ~**17 ms** mean delay
- Jazz trio asynchronies **2–26 ms**; listener-preferred under 19 ms —
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC5706983>
- Rolling Stones beat-2 delay: mean **2.4% of IOI**, instances 10–80 ms
- Reference pipelines run FFT 128 / hop 32 ≈ **0.7 ms**; the jazz study verified onsets to under
  1 ms against accelerometer data

This agrees with §3's conclusion and independently confirms the phenomenon's scale. Note it does
*not* confirm the frames-are-too-big reasoning — §2 measures that directly and contradicts it.

**If per-onset microtiming is ever actually wanted**, the spec is a hop of 128–512 samples (2.7–10.7
ms) *plus* sub-frame interpolation — but only after a percussive fixture shows the material can
support it. Ordering matters: the fixture is cheap and decides whether the pipeline work is needed.

## 5. Two things about a supplied BPM

**It cannot be the grid.** A rounded metadata BPM carries no phase, and the rounding accumulates: at
120 BPM a 0.3 BPM error drifts ~1.25 ms/beat, so ~20 ms over 16 beats — larger than most of the
effects in §4. `groove.js` accepts `--bpm` as a search initialiser only, scores it, and prints the gap
between it and the locally-solved answer. Everything is re-anchored locally.

**Commensurate tempos are a trap.** When the beat period is an integer multiple of the frame period,
every onset lands on the same frame phase, quantisation noise collapses to zero, and any
variance-subtraction estimate over-subtracts. Measured on the (now discarded) subtraction approach at
117.1875 BPM = exactly 6 frames/beat:

| planted jitter | reported |
|---|---|
| 5 ms | 0.0 ms |
| 8 ms | 0.0 ms |
| **12 ms** | **0.0 ms** — a human take reported as machine-quantised |
| 20 ms | 24.0 ms |

Hazard tempos are 703.125/n BPM: 175.78, 140.63, 117.19, 100.45, 87.89, 78.13, 70.31, plus
small-denominator rationals. Nothing shipped makes a "quantised" claim, which is what defuses this
rather than hiding it.

---


## 6. What IS reachable at 85 ms

**The distribution is reachable even though individual onsets are not.** The frame-index estimator's
scatter is exactly T/√12 = **24.63 ms** and is *material-independent* — measured at 24.5 ms across
every attack, decay, noise and tremolo case tried; only its bias moves, and bias cancels in intervals.
So σ_true = √(σ_obs² − T²/12). Recovery of a planted per-onset jitter, 120 synthetic hits:

| planted (ms) | 0 | 10 | 20 | 30 | 50 | 80 |
|---|---|---|---|---|---|---|
| recovered (ms) | 1.0 | 9.6 | 20.1 | 26.1 | 45.9 | 72.5 |

Null stays null across N = 20…600 (0.0–1.2 ms). At N = 300, planted 8 ms → 8.6 ms. So quantised-vs-human
is answerable at 85 ms **given ~100+ cleanly-detected sharp onsets**. §7 is about why we still don't
have that, even now that a percussive fixture exists.

## 7. What shipped, and the four things measurement forced

The pipeline is: onsets → **is there a pulse at all** → **is the tempo fixed or moving** → tempo CV.
Each stage can refuse, and on real material every one of them does.

1. **Pulse gate** — windowed Rayleigh phase coherence, scored against a **pipeline-matched Poisson
   null**: same onset count, same mean spacing, snapped to the same 85 ms grid, thinned by the same
   refractory rule, run through the same ~360-candidate search so the multiple-comparison cost is
   priced in. The bar is the null's p99.
2. **Fixed-vs-free model comparison** — the verdict layer, and the thing that actually answers
   "quantised or elastic". Two accounts of the same onsets: *one* period for the whole recording
   versus a period free to change every window. Same statistic, compared.
3. **Tempo CV** — SD/mean of band-limited per-window tempi, against a derived resolution floor,
   withheld unless the verdict layer licensed it.
4. **Onset-spacing trend** — reported, and explicitly *not* called tempo drift.

### Four failures the self-test caught before any of this shipped

Recorded because each is a live trap and three of them looked right from the inside:

- **An IOI-multiple statistic called a Poisson process a pulse** (0.408 against its own null's 0.327).
  Frame quantisation already makes every interval an exact multiple of 85.33 ms, so commensurability
  came free from the grid and the measure could not tell a pulse from a lattice. Replaced by phase
  coherence.
- **Beat-counted windows biased the search toward short periods.** Windows of 8 *beats* hold fewer
  onsets at a shorter candidate period, and R is upward-biased at small n, so the search won by
  choosing the period with the least data: the 120 BPM click track reported **235 BPM**. Fixed by
  windowing on a fixed onset count (12).
- **One global period destroyed the rubato control.** Scoring every window against a single period is
  what a global grid does; on a 60→90 BPM ramp the best global period was 805 ms, so opening windows
  drifted ~2.9 whole cycles and R fell to 0.230 — *beneath* a pulseless process. A breathing tempo has
  no global period by definition. Fixed by solving per window.
- **A fix I was confident about was a no-op.** I "corrected" that failure by referencing phase to the
  window origin; the output came back byte-identical, because R is the magnitude of a mean phasor and
  a common time offset cannot change it. Left in the file as a comment.

### The verdict layer, calibrated

Measured free-minus-fixed gap — how much better a free per-window period does than one fixed period:

| material | free R | fixed R | gap |
|---|---|---|---|
| click 120 BPM, exact | 0.961 | 0.961 | **0.000** |
| click 120 BPM, +30 ms jitter | 0.897 | 0.891 | **0.006** |
| drift 118→122 BPM | 0.954 | 0.940 | **0.014** |
| subdivided, eighths every beat | 0.874 | 0.847 | **0.027** |
| **rubato ramp 60→90 BPM** | 0.980 | 0.230 | **0.750** |
| Poisson, no pulse | 0.584 | 0.394 | 0.190 |

STEADY requires gap ≤ 0.05 (≈2× the worst steady control) **and** the fixed period to beat the
pulseless null on its own — because naming a tempo is a claim about a global period. ELASTIC requires
gap ≥ 0.50 (⅔ of the rubato control). **Between those there is no calibration and therefore no
verdict**: that band reports UNCLASSIFIED rather than rounding to the nearer label.

Note the Poisson row: a large gap is *not* specific to rubato — a free search overfits pulseless
material too. That is exactly why this layer runs only after the pulse gate has rejected such material,
and why the gap alone is never the verdict.

### What it reports on every real fixture we own

| fixture | onsets | pulse | free / fixed / gap | verdict |
|---|---|---|---|---|
| Barber Adagio | 116 | **NO PULSE** (p = 0.443) | — | no tempo |
| Pärt Fratres | 612 | PULSE, +0.027 | 0.655 / 0.266 / 0.389 | **UNCLASSIFIED** |
| Nero, *Reaching Out* (beat) | 312 | PULSE, +0.068 | 0.683 / 0.580 / 0.103 | **UNCLASSIFIED** |
| heldout-pemberton | 49 | **NO PULSE** (p = 0.363) | — | no tempo |
| heldout-sol | 151 | **NO PULSE** (p = 0.045) | — | no tempo |
| heldout-trxy | 65 | **NO PULSE** (p = 0.055) | — | no tempo |

**Every real fixture refuses.** Verdicts are gate-stable: at 2/3/4 dB onset gates the Adagio gives
none/none/none (391/116/29 onsets) and Fratres and Nero withhold at all three.

**The most interesting single result is Nero.** It is a produced, rigidly quantised electronic track —
the case §9 of the first draft of this note said was the missing ingredient. It still cannot be
classified, and the reason is specific: **no single period beats the pulseless null** (fixed 0.580 vs
null p99 0.616). Only the free, overfitting model clears the bar. 312 onsets over 225 s is 1.4/s where
a ~140 BPM track should offer 2.3 beats/s plus subdivisions, so the detector is finding a minority of
events — consistent with a heavily limited modern master, whose whole production goal is a level
envelope that does not move. **The arrival of a percussive fixture did not unblock the measurement,
and that is a finding about loudness-war mastering, not about the analysis.**

### Two mis-calibrations of my own, corrected by that fixture

- **The octave-folding bar was wrong.** Every synthetic control needs 0% octave folding, so I set the
  bar at 20%. But every synthetic control is metrically *unambiguous* — that was a fact about my
  synthesiser, not about music. Nero folds 35.3% of windows while its post-fold neighbour drift is
  **0.016**, better than any control: the folding is real metrical ambiguity (a dubstep kick at half
  the hat rate) and folding *repaired* it. The bar moved to 50%, where the majority of windows dissent
  from the median octave and no majority pulse remains. Fratres is still withheld — its drift, 0.088,
  exceeds the 0.08 reliability bar independently.
- **Octave folding cannot rescue a CV on its own.** `foldOctaves` maps into a window exactly one
  octave wide, so residual scatter can saturate the CV by construction. Nero reported CV 16.1% over
  96.8–190.5 BPM — a ratio of 1.97, i.e. the fold window itself. That number was measuring which
  metrical level the search had locked onto as the arrangement thickened. Hence the global anchor plus
  a ±30% band, and then the verdict layer on top; both were added because a plausible number turned
  out to be an artifact.

## 8. Numbers that came out badly, and things this cannot do

- **Tempo CV is blind to per-onset jitter, by construction.** 30 ms of planted jitter produced CV
  0.005 against a floor of 0.005 — indistinguishable from a metronome. A window's period is fit over
  12 onsets, so jitter averages down by √Sxx (30/11.96 = 2.5 ms ≈ 0.5% of a 500 ms beat). CV measures
  *tempo change*; it is not a microtiming substitute and must never be read as one. Asserted in the
  test suite so it cannot quietly change.
- **The sensitivity edge is real and narrow.** A 118→122 BPM drift gives CV 0.0100 against a floor of
  0.0050, and the resolvable test is cv > 2×floor — so at 120 beats it lands *exactly* on the bar and
  is declined, while 150 beats reads 0.0102 and is reported. ~4 BPM over ~150 beats is the smallest
  tempo drift this instrument can call.
- **The Poisson null is weak.** It tests against *no temporal structure at all*. Real music with
  regular phrase structure beats a memoryless process without having a beat anyone could tap — which
  is most likely what Fratres' +0.027 and Nero's +0.068 margins are. Passing this gate means "more
  regular than a memoryless process", **not** "has a beat". A stronger null would be music-like but
  pulseless, and I do not have a principled way to synthesise one.
- **Onset rate is not tempo.** Both orchestral fixtures show spacing lengthening across the piece
  (Adagio slope +4.37 ms/s, r = 0.114, halves 3913→6144 ms; Fratres +1.36 ms/s, r = 0.261, halves
  873→1340 ms). This is *not* evidence of slowing. Fratres' level is flat over the same span
  (corr(time, level) = −0.03) while its onset rate falls (r = −0.53), so the decline there is
  compositional note density. The dynamics confound is weaker than expected — corr(level, onset rate)
  is only −0.08 (Adagio) and +0.26 (Fratres) — but note density and tempo remain inseparable by this
  instrument, so the trend is reported and deliberately not named tempo drift.
- **No groove score.** The perception literature is contested — per the chair's pass, Frühauf/Kopiez/
  Platz 2013 and Datseris et al. 2019 both found quantised versions rated *more* groovy. "Human or
  quantised" is defensible; "groovy" is not, and is not attempted.
- **Carter & von Appen's CV thresholds are recorded but not used.** Handed over as 0.2–0.5 = quantised
  and >2.0 = rubato. A click track has essentially zero tempo variation, so a dimensionless CV of 0.2
  for one looks like a percentage convention. Not having read the source, CV is reported both as a
  ratio and a percentage and no verdict is gated on those numbers.
- **A supplied `--bpm` is scored, never trusted.** On Fratres, `--bpm 141` scores 0.231 against the
  locally-solved 0.655 — a concrete measure of what trusting a rounded BPM would have cost.

## 9. Next, in order of value per unit effort

1. **The onset detector, not the frame rate, is now the bottleneck.** Nero proves the pulse survives
   in the audio and dies in the level envelope. The existing `peaks` field is untouched by all of the
   above; a spectral-flux onset function over those peaks would likely find the kick where the
   loudness envelope cannot, and it needs no format change and no new capture.
2. A **drum-machine capture at a known BPM** — deliberately unmastered, or a raw loop rather than a
   commercial master — to give the verdict layer a case it can actually classify. Nero was the right
   idea; a limited master was the wrong instance of it.
3. A stronger null than Poisson for the pulse gate.
4. Only if per-onset feel is still wanted after (1): the hop-128–512 pipeline change of §4.

## Running it

    node consonance/tools/groove.js --fixtures        # both orchestral fixtures
    node consonance/tools/groove.js --selftest        # 9 synthetic controls; exit 1 on any failure
    node consonance/tools/groove.js --file <f> [--bpm 120] [--gate 3.0] [--json]
    node consonance/tools/groove.test.js              # 53 tests

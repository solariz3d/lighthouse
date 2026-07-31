# A's map — one writer, appended by A alone

Findings with evidence pointers, per ../map/README.md. Entries the chair transcribed on A's behalf before 2026-07-31 remain in ../muscle_map.md; from today A writes its own.


## 2026-07-31 — first append (four findings from the cochlea work, and one backfill)

### A default that lands inside the valid range is the one a bounds check cannot see

2026-07-31, commit `c032a27`; `consonance/src-tauri/src/cochlea.rs:3286` and `:3325-3332`; found by
two deliberate mutations of a test that was already green.

Era 4 put evidence fields on the events, and the way that goes wrong is silently — a field wired to
`0` or `Default::default()` produces a stream that looks exactly as authoritative as the real thing
and is worse than the bare names it replaced, because now there is a number vouching for it. So I
mutated my own passing test to see what it would miss. `votes` → 0 failed instantly: zero is outside
`[need, VOTE_WINDOWS]`. `cents_off` → 0.0 **passed** the `|cents_off| <= 30.0` assertion, because a
defaulted zero sits comfortably inside the tolerance the reading matched within — and a range check
restating the upstream gate is the obvious test to write here. Closed with a distributional
assertion instead: median `|cents_off|` across 7,395 corpus readings must exceed 2.0¢, against a
measured 12.0. The threshold sits an order of magnitude under the measurement so it detects a
disconnected field rather than tracking the corpus's tuning.

General form: **bounds checks are blind to defaults, and the defaults that survive them are exactly
the plausible ones** — 0, empty, `Default::default()`, all of which live inside the valid range by
construction. To catch a field wired to nothing, assert something the real distribution has and the
default cannot: scatter, spread, a nonzero median. Secondary, and repeatable: this was found by
taking a green test and hunting the mutation it would miss, rather than reading the green as an
answer.

### A typical value and an extreme value are different quantities, and a threshold calibrated on one gets evaluated against the other

2026-07-31, commit `5fbc642`; the reasoning is kept at `cochlea.rs:875-895` beside
`PULSE_MIN_STRENGTH`.

Three beatless recordings, eleven minutes, put 45 readings through the pulse gate: locks at p50
0.299 — comfortably under any threshold — and a **maximum of 0.843**, above every threshold that
still detects a real beat. A long negative gets ~45 independent tries, and the maximum of 45 samples
is not the median. So the leak is by construction and no setting of the constant fixes it: only
fewer tries, or stronger evidence per try. Lengthening the detector's memory 25 s → 40 s does both,
and takes leaks 2 → 0 while the real beat is still found.

General form: **this is the whole class of "passes the short synthetic fixture, leaks on the long
real recording."** A constant tuned against a typical value and evaluated against an extremum leaks
whether or not it is well chosen. When a detector leaks, lengthen the evidence rather than raise the
bar — raising the bar fits the constant to whichever recordings happen to be in `tests/`, which is
the same failure one level up.

### Derive a constant from the wall you actually measured, not from the midpoint between two walls

2026-07-31, commit `febfda2`.

Speech separates from this music corpus by duration and by nothing else: four music fixtures exceed
the synthetic talker's own *maximum* syllabic ratio, so no syllabic threshold admits speech and
excludes the corpus. Duration separates six-fold with nothing in the gap — longest talking-verdict
run 4.5 s across 44 minutes of real music, 26.2 s for a continuous talker. My first instinct was the
midpoint, ~15 s, and it leans on the wrong wall: 4.5 s is measured over real material, while 26.2 s
is a synthetic envelope that talks without ever pausing, which real speech does not. `SPEECH_HOLD_SECS`
went 2.0 → 8.0 — as low as the measured wall permits, with the headroom on the side nothing could
measure.

General form: **two walls are rarely equal evidence.** Put the constant near the one your corpus
actually established and put the slack on the unmeasured side. Corollary that made this shippable:
pin the cost in the same commit rather than discovering it later — the constant buys an eight-second
latency before a talker is reported, and `speech_is_not_called_until_the_verdict_has_held` exists so
nobody optimises that latency away without first moving the wall that bought it.

### Trading a falsehood for a blindness is not a fix — ship the refusal, with the two things the real fix needs

2026-07-31, commit `febfda2`; `consonance/ERA4-CONF-DESIGN.md:340-356` carries the dated correction.

`steady` reads 0.000 on both real positives. The diagnosis came from opening the data, not from
re-reading the formula — I had blamed an absolute-vs-relative scale and was wrong. The memories are
`[96.0, 125.5 … 131.5]` and `[73.0, 129.0 … 133.0]`: **one stray window in eight destroys the
standard deviation.** The gate that ADMITS a reading is robust (7 of 8 clear 0.7); the number that
DESCRIBES it is not. The obvious robust estimator is not clean either — MAD recovers both real
tracks (0.80, 0.87) and collapses the synthetic machine/human pair onto identical values, because
both land on 0.5 bpm, one `PULSE_BPM_STEP`, so it goes blind at the tempogram's own quantum exactly
where the field's only discrimination lives. Not shipped. Filed with what a real fix needs: a
dispersion that survives one stray estimate without landing on the quantum, and **the negative
control this field has never had** — nothing anywhere asserts that a wandering tempo reads low, and
the only steadiness test compares two synthetic beats 0.36 bpm apart.

General form: a robust statistic that repairs the reading and kills the discrimination is a
different wrong number, not an improvement. And **a refusal is worth more than a fix when it names
the blocker**: this one is now a stated blocker on `PULSE_ENABLED`, so the falsehood cannot ship
quietly the moment the gate opens. One accuracy note kept with it, because the temptation ran the
other way: the falsehood is not shipping *today* — the gate is shut — and saying so was a correction
against my own urgency to have found something live.

### Backfill — the numbers that failed to reproduce were exactly the ones the instrument could not print

2026-07-31, commit `288ccba`. Transcribed on my behalf at `../muscle_map.md:1796`; this is my
statement of it, per `README.md` §3. The rule as stated there is right and I am not correcting it —
what is missing is the part that makes it predictive rather than a reminder to be careful.

Three figures in my own draft of a doc comment did not re-derive when I re-ran them: the transient
floor 1.03 (actually 1.51), the weakening as fourfold to 1.2 dB (actually 3.5-fold to 1.52), and the
mutation naming three readings (actually two). What makes this a finding rather than sloppiness is
the **selection**: `PULSE_MEASURE` printed the reported centre but neither the window's own estimate
nor its transient — and the three wrong numbers were precisely the quantities the instrument could
not show. Prose does not fill gaps at random. It fills the gap the instrument leaves, in the
instrument's own confident register, which is why the fabricated figures were the load-bearing ones
and the reproducible ones were decorative.

So the operational rule is sharper than "re-derive before committing": **if the instrument cannot
show a quantity, the comment does not get to state it** — and the moment you notice yourself
reaching for a figure from memory, that reach is the signal to extend the hook, not to check
harder. The hook now prints `trans=` and `win=` on every line, passing or rejected, and every figure
in that comment re-derives from one run of it. A number in prose reads as evidence and nothing ever
checks it; a number the hook prints is checked every time the hook runs.

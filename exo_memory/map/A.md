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


## 2026-07-31, second append — four from the blackbox track-surface build (commit `d9bde4d`)

A different repo and a different domain (3D telemetry, WebGL, replay geometry), which is the
point: these are the findings that were not about tracks.

### A correction lands on the file that was wrong, and the sibling file repeating the claim keeps saying it

2026-07-31, blackbox `d9bde4d`; `samples/TRACK_FROM_REPLAY.md` vs `samples/README.md`, same folder.

The spec I was asked to build named its "single biggest quality lever, and it's free": use every
lap, because the test-track replay holds several on different lines. It holds **one** — two line
crossings — and so does the other sample. What makes this a finding rather than a stale doc is
where the correction already was: `samples/README.md`, in the **same folder**, established the
one-lap fact on 2026-07-25 — the day after the spec was written — and corrected *itself* in print,
in a parenthetical naming the claim it was retracting. The spec, six feet away, kept asserting the
retracted version for six days and was handed to me as the brief.

General form: **a correction propagates to the document that was wrong and stops there.** Nobody
greps the neighbours for the claim they just killed. So when you inherit a factual claim from a
document, the cheapest check is not "is this document current" but **"does a sibling document
contradict it"** — and if you correct a claim, the second half of the work is finding who else
repeats it. This is the room's own first law (recall from the master, not a copy) failing between
two files instead of between two instances, and it is harder to see there because both files look
like masters — and it is the failure the multi-writer map (map/README.md, same day) was built to
stop between panes, showing up between two files instead.

### "That would be a guess" is usually an unmeasured claim, and the data often bounds it from one side

2026-07-31, blackbox `d9bde4d`; `TrackGen.measureLineSpread`, `test_trackgen.js` section 10.

The spec said widening the driven corridor to a plausible road width "is a guess". It is, for the
road's true width. But where two passes cross the same ground with matching heading, their lateral
separation is measurable: median 1.98 m and 2.72 m across the two samples, against an along-travel
offset five times smaller — that ratio being the check that the pairs are the same *place* and not
two points nose to tail. That converts an admitted guess into a measured lower bound on the width
the driving actually used, and the shipped constant sits on it.

The discipline that keeps it honest is the same one as the speech constant: **the tail of that
distribution reaches 9.3 m and is not spent**, because nothing in the data separates a wide racing
line from a pit lane running parallel. Ship the median as evidence, name the confound, leave the
tail unspent. General form: when a spec or a colleague declares a quantity unknowable, ask whether
it is unknowable **in both directions** — a bound from one side is often sitting in data already
collected, and a bound with a named confound beats both the guess and the refusal. Extends
"Derive a constant from the wall you actually measured" in the first append: same rule, except
here nobody had looked for the wall, having decided in advance there wasn't one.

### For a sign, a winding, or a handedness — write the probe, not the argument

2026-07-31, blackbox `d9bde4d`; `ui/trackgen.js` triangle order, `test_trackgen.js` section 3.

The first triangle order I wrote was inverted on **12,974 of 13,042 triangles**. I had reasoned
about it — right-handed system, counter-clockwise front faces, front axle to the left — and the
reasoning was confident and wrong. One probe comparing each face's geometric normal against the
recorded surface normal found it in a single run, and the same probe became the test.

Nothing in the application would ever have shown it: there is no back-face culling in that
renderer and the lighting reads vertex normals, not faces. So the defect was invisible, permanent,
and would have detonated on whoever later enabled culling. General form: **orientation questions
are cheap to measure and expensive to reason about**, and the reasoning failure is silent —
handedness arguments feel like proofs. If a sign can be measured against something already in the
data, measure it, and keep the measurement as the assertion.

Second half, which is what made the test honest: the agreement is **99.5%, not 100%**, and the
residue is real — where the car slides sideways the strip advances along its own axle, the quad
shears to a sliver, and its orientation is genuinely undefined (68 frames of 6,853, a 260 km/h
slide). Asserting 100% would have been asserting that the car never slides. **When a measurement
lands just under a round number, find out what the remainder is before rounding it away or
tightening the rule to exclude it.**

### A sandbox test defines whatever name the code asks for — so it cannot see a wrong name

2026-07-31, blackbox `d9bde4d`; `test_standin.js` sections 7 and 9.

To test a function that needs a GL context and a DOM, I extracted it and ran it in a `vm` against a
recording stub. Every assertion passed. But the sandbox is built by **me** from the names the
function reads, so if the function wrote `sceneAabb` and the application declared `sceneAABB`, my
sandbox would define `sceneAabb`, every assertion would still pass, and the app would throw
`ReferenceError` on the first click — these files are `"use strict"`, so an undeclared assignment
is an error and not a new global. **The test is blind to the exact class of bug that a sandbox
introduces.** Closed by checking each global the function writes against the real declarations in
the shipped source, with a deliberate misspelling asserted to fail the check so it cannot go
vacuous. (Found while doing it: one of those globals is declared four files away from every one of
its assignments.)

Same species as the default-that-passes-a-bounds-check in the first append: **the instrument
supplies the thing it is supposed to be verifying.** Ask of any test harness — what does this
harness provide that the real environment does not, and what bug does that hide?

**And the mirror of it, same day, same file:** the repo's coverage tool reads `uiFunction("name")`
positionally as a source-reaching use. I had wrapped that call in a readability helper,
`need("loadTrackBuffers")` — so the tool saw a bare string and reported the function MENTION-ONLY,
which its own header calls "the one that looks like coverage and is not". The tool was right and my
test was hiding from it. General form: **a test can be unreadable to the instrument that grades
it**, and the fix is to speak the instrument's idiom rather than to argue that the coverage is
really there. Both halves are one shape — the harness and the grader each have a view of the test
that differs from the test's view of itself, and both differences are silent.


## 2026-08-01 — four from building the demonstration instrument (blackbox `631c230`)

Built against the map's own newest root — no guard counts as a guard until it has been shown to
fail against its referent — as a repo mechanism rather than as my discipline. The findings are
about instruments that grade instruments, which is where this root leads.

### A perturbation has a direction, and every guard pointing that way passes it for free

2026-08-01, blackbox `demogap.js`; caught by the tool's first run against `test_markfade.js`,
closed by `test_demogap.js` section 1.

To ask whether an assertion is about the code it claims to be about, I emptied the code it reads
and re-ran it. Anything still green does not depend on the referent. The first run indicted
`test_markfade.js:39` — `ok(!/MARK_FADE_FRAMES/.test(decomment(SMOKE)))` — which is a sound
guard that fires the moment the banned constant returns. It passed because **an empty file
satisfies every assertion of absence.** Emptying is not a neutral probe; it is a probe with a
direction, and it systematically clears exactly the guards that assert the referent does NOT
contain something.

Closed with a second leg pushed the other way: the source PLUS every string literal the test
itself contains. Positive assertions still see the real source and pass; negative ones now find
the pattern they forbid and fire. The indictment now requires a guard to sit still through both
extremes, and the requirement that BOTH legs actually reached it — a leg that crashed before the
assertion ran does not get to vote.

General form, and it is wider than mutation testing: **a single-direction probe is a biased
instrument, and the bias falls entirely on one polarity of claim.** Blank, zero, empty, null,
absent — every cheap "remove it and see" check clears the assertions of absence for free while
looking like it tested them. If a probe can only push one way, it can only measure half the
guards, and it will report the other half as sound. Two opposite extremes cost one extra run.

### The prose supplies the referent the expression never touches — which is why review does not catch it

2026-08-01; `test_markfade.js:59` and `:64`, found by the instrument above, in a file I wrote on
2026-07-31 and a reviewer read.

Both are computed entirely from the test's own locals. `:64` is
`Math.abs(oldFrames * (1/30) - oldFrames * (1/90)) > 1` with `oldFrames` a local `const 900` —
a constant expression, true before the change it documents, true after any change to any shipped
file, unfailable. It is not sloppiness and that is the point: it was written to make a fixed
regression visible, it sits under a comment that correctly describes the regression, and the
comment is accurate. **The narrative around the assertion supplies the referent; the expression
does not reach it.** A reader checking whether the guard is about the right thing reads the
prose, finds the right thing, and stops — the check-shaped thing satisfies the urge, and here
the satisfier is the test's own true story about itself.

General form: when auditing a guard, the question is not "is this about the right property" —
the comment will answer yes. It is **"which of the names in this expression came from outside the
test file?"** If none did, no edit to the codebase can move it. That question is mechanical, it
is the one a reviewer never asks, and an instrument can ask it 618 times.

### Spreading a budget evenly over a referent is a null instrument

2026-08-01, same build, measured both ways at the same budget.

`test_markfade.js` names two files and reaches twenty-six through `uiFunction()`. Twenty mutants
spread evenly over all twenty-six demonstrated **nothing** — while a hand-written mutant against
the two named files had already been observed firing three of its guards. Ranking the referent
(0: the test opens this file itself · 1: it holds a function the coverage tool says the test
reaches · 2: it arrived with the blanket) and spending 60/25/15 across the ranks, at the same
budget of twenty, demonstrated four.

General form: **uniform sampling over a heterogeneous population is not a weak instrument, it is
a null one**, and it fails silently — the report reads "nothing demonstrated", which is
indistinguishable from "these guards are inert". Rank the population before spending, and where
the ranking is a judgement rather than a measurement, say which is which: the 60/25/15 split is
a judgement; that flat spreading measures nothing is a measurement.

### Refusal recorded: the Rust half is not worth porting today, and here is the number

2026-08-01, `consonance/src-tauri` measured directly, then not built.

The mechanism transfers — one point mutation of `SPEECH_HOLD_SECS` (8.0 → 2.0) turned exactly
one named guard red, `no_recorded_music_is_called_speech`, with no instrumentation needed since
`cargo test` already reports per-test names. What does not transfer is the economics: **13.6 s
per mutant cycle against 0.15 s in node**, so a sweep of 237 Rust guards is an hour where the
larger node suite is ten minutes. And the class that produced the real finding is unavailable:
the empty leg is a compile error in Rust, so it is NOT-RUN rather than a measurement, and the
strongest verdict the node tool has cannot be reached without a Rust parser good enough to stub
function bodies. A narrow constants-only sweep is the version that would earn its cost — every
`const NAME: T = <number>` flipped, ~30 sites, ~7 minutes — and it is written down here rather
than built, because a second pane is mid-build on a guard instrument in that same repo tonight
under a deliberate blind, and shipping a second one into the same directory before we land is
how two panes produce one merge conflict and two half-tools.

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

### Appended 2026-08-01, same day: the first number an instrument prints is a draft

blackbox `d7ca345`, correcting the audit figures cited above.

The finding entries above were written from the instrument's first suite audit: 78 INERT of 650.
Chasing that number found three defects in my own tool, **all of them false positives in the one
class that has to be trustworthy** — the class a reader is meant to act on.

- A regex's SOURCE TEXT is not a string the regex matches. The saturated leg was inserting
  `budget \$\{frameMsEMA`, which `/budget \$\{frameMsEMA/` can never match, so sound negative
  assertions written as regexes were indicted. Fixed by synthesising a matching sample and
  **verifying it against the real pattern before use** — which is what makes an approximate
  regex inverse affordable at all: a wrong guess costs a rescued guard, never a false claim.
- The repo's `decomment` strips `//` to end of LINE, and I had put every literal on one physical
  line, so one bit containing `//` deleted every bit after it. The token was in the file and
  gone by the time the assertion read it.
- A mirror test's inertness is DISTRIBUTED: the local reimplementation is inert assertion by
  assertion, and the file is not, because a sibling pins it to the source. All 72 remaining are
  that shape; none is inert in a file with no anchor.

General form, and it is the one I want to keep: **an instrument's first number is a draft, and
the way to read it is to disbelieve the class you most want to act on.** Every one of the three
defects pushed in the same direction — toward confident indictment — because that is the
direction the tool was built to look in, so that is where its own blind spots point. The routine
that worked was not cleverness: take the largest class, read the actual lines, and ask of each
one whether the verdict is credible. Three were not.

Two smaller ones from the same pass, both instances of entries already on this map:
**the printed contract went stale against the file header** the moment the second leg landed —
the header-vs-output drift covgap records about itself, occurring in the tool built to catch that
family, third instance in one build. And **the header claimed 14 UNREADABLE files when the tool
prints 16** (9 with no hookable helper, 7 where hooking changes the output); the 14 came from a
throwaway pilot script that only checked whether a helper existed. That is exactly the backfill
entry at the top of this file — *if the instrument cannot show a quantity, the comment does not
get to state it* — committed by me again, four days later, in a comment about instruments.

---

## 2026-08-27 — P1: a gate that reads the directory it is documented in

**Finding.** `shelf_tests::the_librarian_intake_carries_boot_exactly_once` uses `str::matches` —
unanchored. It counts *quotations* of BOOT's opening header, not copies of BOOT. The second
occurrence was `librarian/2026-08-25.desktop.md:193`, the desktop's own `grep -c` command proving the
original duplication, written into a CARRIED shelf tier. **The evidence for the defect triggers the
test written to prevent it.** Full write-up: `loop/P1_gate_flip_resolved_2026-08-27.md`, commit
`7b54740`.

**The move that worked, and it is reusable.** The constraint was DO NOT REBUILD. The way through was
noticing that *the corpus is read at runtime, not compile time* — so mutating the corpus and re-running
the **already-built** test binary is a real paired differential with zero rebuild. `sed -i '193d'` →
green; `git checkout --` → red; md5 identical. **When you are forbidden to touch the code, look for the
input the code reads live.**

**Two errors I nearly made.**
1. My JS replica of the composition returned **3** where the binary returned **2**. I could have
   reported 3. The replica compared paths with mixed separators and so missed the `f ==
   room_master_path()` skip. *A replica is not evidence until it agrees with the instrument at a point
   the instrument was actually measured.* I now report replicas with their disagreement history.
2. I was one step from accepting the packet's refutation #2 as closed. It was an **anchored** grep
   against an **unanchored** assertion. *A grep only refutes if it is the grep the code runs* — check
   the predicate, not the plausibility.

**The generalisation, which anchoring does NOT fix.** This gate reads `exo_memory/`, which is where
seats write their findings. **Writing down what a gate found can change what that gate reports.** The
instrument sits inside its own measurement space. A2's 3/3 rule is no defence — three runs after the
write agree perfectly and are all red. The defence is: know which gates read mutable state, and pin it.

**Also found:** two stray duplicate `#[test]` attributes (main.rs 7425/7431, 7478/7486) register two
tests twice — 327 registered, 325 distinct. One failure therefore prints as `2 failed` and drops the
pass count by 2, which is the whole of the `324 = 322 + 2` coincidence that made a wrong diagnosis look
obvious. **An arithmetic coincidence that completes a story is worth one command of suspicion**
(`--list | sort | uniq -d`).

**Not verified:** the fix is written and never compiled — landing it rebuilds, and that call was the
chair's, not mine.

---

## 2026-08-28 — D002: fixing a gate that its own documentation kept breaking

**Shipped** `ea92701`. The needle is no longer a line of text; it is BOOT's own **bytes** — opening,
middle and closing 2,000-byte spans, read live from the file, each required exactly once. Gate green:
`cargo test --bin consonance --no-fail-fast` → 322 passed, 0 failed, EXIT 0.

**The design rule I want to keep, because the chair's framing produced it.** *"A test that cannot
state what it stopped seeing is not a fix, it is a silencing."* That question is what killed my first
three candidates. Anchoring the match, excluding the librarian tier, picking an unquoted needle — all
three trade one blind spot for another and none of them can say so out loud. The one that survives
has a property the others don't: **every trigger is a true positive.** To fire it you must place
2,000 contiguous bytes of BOOT into a carried tier, which *is* the defect. You cannot close a trap by
moving it; you close it by making the only way to spring it be committing the offence.

**Pick thresholds by measuring the corpus, not by taste.** Longest verbatim run of BOOT anywhere in
the 58 other carried files: **between 128 and 256 bytes** (probed 64→2048B at stride size/4 across
the whole document). 2,000 is ~8x the largest quotation the room has ever contained. That sentence is
the whole defence of the number, and it took one script.

**Preserve the artifact before you destroy it.** I copied the pre-fix binary aside before rebuilding.
That turned into the single most persuasive line of the matrix: **M3 — identical corpus bytes, two
predicates, one moment, opposite verdicts** (old: "BOOT appears 4 time(s)", EXIT 101; new: ok, EXIT
0). A before/after you can run side by side beats any amount of argument about what changed.

**Demonstrate your blind spot; do not merely declare it.** M5 puts a 500-byte fragment of BOOT in a
carried tier and the gate stays green — the stated limitation, shown. M4 puts a near-copy with one
byte changed inside the opening span and the gate goes red on the *middle* span, which is what three
spans are for. A limitation you can reproduce is a specification; one you only assert is a hope.

**A2 does not measure this class, and I said so back to the chair.** Three runs with the identical
assertion name is a *repeatability* test. When the input is a live directory, three runs after the
write agree perfectly and are all red. Repeatability is not the property that fails. A3's paired
differential — hold the environment constant, vary one thing — is the instrument.

**THE MIRROR DEFECT, found while auditing and NOT fixed this lap.** 25 assertions in main.rs match a
string literal against composed intake/shelf text. All 25 use `contains` (presence), and presence is
*monotone*: a quotation can only make it MORE true. So the failure I fixed — a count driven red by
prose — needs an exact-equality **count**, and `git grep` says the only one over live-corpus text was
the one I fixed. But the inverse is live: **`shelf.contains("trust-the-first-attention")` at
main.rs:7395, whose message is "no cards on the shelf", cannot fail.** Nine carried non-card files
contain that string, and `exo_memory/SOURCE.md` — in the carried root — carries it three times, so
the assertion holds with **zero cards on the shelf**. Deduced from two greps, **not yet mutated**;
mutation is owed before anyone calls it dead. Same root cause, opposite sign: the corpus a test reads
is written by people who write about the test, and that breaks counts toward RED and presence checks
toward GREEN.

**Not verified:** js-suite not run; four pre-existing warnings at main.rs:6169/:6352 uninvestigated;
the 7395 finding is deductive, not mutation-proven.


## 2026-09-02 — P-WINDOW-INERT: retiring my own registration, and five things that generalise

*All five from one lap. Hand-back: `exo_memory/handback/p-window-inert_2026-09-02.md`. Amendment:
`exo_memory/loop/librarian_window_registration_2026-09-01.md`, the `# AMENDMENT — 2026-09-02 ~03:45`
tail. Both landed in `4c175c2`. Packet: `loop/packet_window_inert_2026-09-02.md` (`005acfb`).*

### A rule can be dead by TIER arithmetic while every number in it is correct

2026-09-02, `4c175c2`; `main.rs:corpus_shelf_at` (the `order` array, `librarian` fifth of ten) and
`librarian_shelf_room` at `:5048`; hand-back §3. Found by sweeping a re-implementation of the walk
across budgets, not by reading the rule.

Everyone — the chair, the librarian at `63d03eb` nineteen hours earlier, and me — explained the
librarian window carrying zero as **the window's weight against the floor** (129,352 B of notes,
~8,642 B of budget). That explanation implies the rule revives when the floor comes down. It does
not. `corpus_shelf_at` is a **saturating skip-walk** — an over-budget file is indexed and the walk
*continues* — so smaller files drain the remainder before a late tier is reached. Measured leftover
at `librarian/`: **438 B at today's 8,642 budget, 198 B at the 32,395 the ruled floor-fix produces,
439 B at 400,000.** Smallest file in the directory is 2,081 B. **First budget at which the rule
changes the delivered set: 442,309 B** — 2.95× the entire 150,000 cap, because the carried tiers
ahead of it hold 471,585 B. **The generalisable form: when a budgeted pipeline delivers nothing,
price the LEFTOVER AT THE STAGE, not the size of the thing being delivered.** My §3 priced two rule
shapes, ECHO attacked them, the keeper picked one and the chair registered a third — the whole
exercise was moot and would have been visibly moot from one sweep.

### "Unscoreable" is PROVEN by running the rule absent, not argued from its size

2026-09-02, `4c175c2`; the `walk.js` embedded verbatim in the amendment's §11; hand-back §1 and §9.

"The rule carries zero" does not license retiring a falsifier — a rule can carry zero and still be
observable. The licensing property is **no observation distinguishes the rule from its absence**, and
that is a differential, so run it as one: a second implementation of the stated walk, executed with
the window PRESENT and ABSENT at the same budget. Byte-identical (2 files / 8,204 / 8,642 / 534) —
*that* is the unscoreability. **And what licenses the model is that it reproduces the binary's four
printed figures exactly**; without that it is a second opinion, not a check. Same instrument then
gives the re-arming threshold and the counterfactual for free. **Build the differential; do not
reason about the delta.** (Sibling of the 2026-08-01 M3 line above: identical inputs, two predicates,
opposite verdicts.)

### A ± tolerance must name the LARGER moving term, and mine named the smaller one

2026-09-02, `4c175c2`; registration §4 (i) vs the amendment §5; hand-back §4.2. Found while computing
what the prediction *would* have scored — i.e. only by trying to score it.

§4 (i) read *"header carried-bytes drop by ≈390,968 **± that day's append**"*. Under a two-day window
a whole file **leaves** the window every day, and eviction dominates append: 09-01 → 09-02 the dated
total grew **+41,921** (append) while the indexed figure moved **+88,777** (eviction — exactly
`2026-08-31.md`). A `± append` tolerance would have read a **correctly working rule as 47k off.**
**Whenever a prediction is stated on a windowed quantity, enumerate every term that moves it
between readings and set the tolerance on the largest.** This defect is independent of the cap and
would have fired on its own.

### Check the headroom constant before quoting "room left" — and report the correction when it makes your own case worse

2026-09-02, `4c175c2`; `INTAKE_HEADROOM` at `main.rs:4475`, `librarian_shelf_room` at `:5048`;
hand-back §2.

The packet gave *"floor 129,402, room left for the window ~20,000"* by subtracting a floor from a cap.
It omitted `INTAKE_HEADROOM = 8,000`. Real budget: `150,000 − 8,000 − (83,645 + 49,713) = **8,642**`
— the space in dispute overstated **2.4×**. Two carriers of the same stale figure were also live: the
LEDGER row and a prior hand-back both said the delivered bytes were `7,479 + 1,497 = 8,976`
(`CLAUDE.global.md + README.md`) when at 8,642 the README no longer fits and it is
`7,479 + 725 = 8,204` (`CLAUDE.global.md + memory/user-solariz3d.md`). **A "cap minus floor" figure
is wrong until you have read the reserve constants**, and this class travels: the *conclusion* was
right, so nobody re-derived the arithmetic under it. Reported precisely because the correction made
the finding **more** severe, not less — that is the direction that costs nothing to suppress.

### Right conclusion + wrong mechanism, in the simplifying direction — three instances in one night, one of them mine

2026-09-02, `4c175c2`; `63d03eb` (the librarian taking WRONG #62 on itself, one paragraph above its
own correct prediction); hand-back §4.5.

The librarian predicted the inertness correctly at 09-01 07:48 and gave the floor as the cause; the
chair repeated conclusion and cause; I had missed both for a day. **Agreement on the conclusion is
what stops anyone re-checking the mechanism** — and the wrong mechanism was in each case the one that
*reads as simpler* (a size comparison instead of a stage-order property). Operationally: **when two
or more seats agree on a finding, the thing to re-derive is not the finding — it is the causal claim
under it**, because that is the part nobody has an incentive to touch. Corollary observed the same
night: a correct finding sat undelivered for nineteen hours in an interrupt the board shows never
rendered, so *the finding was never the bottleneck; the carrier was.*

### And one that resolved: a registration retired by its own pre-registered instrument

2026-09-02, `4c175c2`; registration §10.7 (vi), written 2026-09-01 before anyone had measured the
cap; hand-back §6.

(vi) registered that the 150,000 cap was **an unverified code comment** and named its own refutation:
*"if a shell over 150,000 is assembled and nothing observably breaks, the premise is wrong."*
Something broke — the seat returned `Context limit reached` at 1,305,657 B and the harness printed
`CLAUDE.md is over the 150.0k-char limit (906.3k chars)`. Premise held; the conservative byte-side
reading (vi) argued for was right; measured **1.0106 B/char** against **1.0107** predicted from the
harness's own two figures. Small — a prediction about a code comment. But it is the one prediction in
that registration that was scoreable, it scored, **and what it confirmed is what made the rest of the
registration inert.** Worth carrying as the shape rather than the result: **register the premise you
did not verify, with its refutation, and the programme can retire you cleanly instead of arguing.**

*Not verified tonight:* the seat has not woken on the shipped cap (relaunch pending), so §4 (ii)'s
landing has never been read; 442,309 is today's directory composition and moves as files are added;
the differential test proposed in the amendment §7 was **offered, not built** — `main.rs` is not mine.

## 2026-09-02 — P-DOC-ABOUT: the carrier the two retirements missed

### Quote a master by EXTRACTING it at edit time; a retyped quote is a copy with a promise attached

2026-09-02, L032; `consonance/ui/index.html` About tab and Librarian mainhead `:131`; hand-back
`exo_memory/handback/p-doc-about_2026-09-02.md` §2.

`index.html:331` titled a section **"light, not lifeguard"** — vocabulary retired 2026-07-12 and
again 2026-08-17, alive on the app's own page because both retirements edited the documents and not
the carrier. Rewriting it needed two blocks quoted from masters (`BUILDING.md` § THE LOOP;
CHARLIE's §6 paragraph in `handback/p-two-doors_2026-09-02.md`). **I had the edit script extract both
by regex from their master files at run time and exit if either match failed**, rather than pasting
them. That turns *"quoted, not redrawn"* from a claim in a hand-back into a property of the edit —
and it is the same move as the second-implementation check from `p-window-inert` §5, aimed at prose
instead of arithmetic. **Generalised: when a packet says "quote, do not rewrite", make the quote an
extraction; the promise is unverifiable and the extraction is not.**

### A substring bar cannot be run on a corpus whose own vocabulary contains it

2026-09-02, L032; hand-back §4. Found by running my own bar literally instead of assuming it passed.

The packet's bar was `grep diver|lifeguard|dock|shore`. It is **RED on this repo forever**: `diver`
matches **diverse / diversity / diverge**, which is the vocabulary of the problem the app exists to
address (2 hits in `index.html`, 5 in `term.js`, all that class). Word-boundary form
`\b(divers?|diving|lifeguard|dock|shore)\b` is green. **A bar that cannot go green on a correct tree
teaches everyone to ignore it** — and three panes were told to self-check with this one tonight.
B's `carrier-drift.js` was already immune (registered wordings against a hand-maintained registry,
not substrings) and returns 0 findings on all three description surfaces; **the defect was in the
packet, not the instrument.** Corollary worth keeping: *run your bar literally before reporting it
met, especially the one you expect to pass.*

### Verify a mutant against the REAL oracle, not against your proxy for it

2026-09-02, L032; hand-back §6.

I checked mutant 1 (reintroduce `lifeguard`) with a grep — which said RED — and then ran it against
B's actual `carrier-drift.js` with an md5-verified restore of the live file
(`586c2640a881dfa6279ef4555a17bc6e` before and after). The oracle **did** catch it, and it filed it
`PENDING UNACCOUNTED`, **`0 of them red`** — detected but not failing the surface. My grep and the
real oracle agreed on *seeing* it and disagreed on *severity*, which the grep could never have told
me. **Reported as measured and NOT as a defect claim**: I do not know whether PENDING-not-RED is a
gap or a deliberate two-stage state, and guessing would have handed B a verdict about its own tool
from a seat that read it for ten minutes.

*Not verified:* nothing has rendered in WebView2 — the `<pre>` uses an inline style because `app.css`
is E's, and the 21-line ASCII drawing has not been seen wrap. First render is the keeper's glance
after the rebuild. And 40 glossary terms now live only in `consonance/README.md`, outside the exe —
the priced cost of the SHORT+pointer decision, not a defect.

**2026-09-02, L033 — `map_dir()` never reached the maps, so no pane map has ever been carried into a wake on this machine.** `main.rs:3006` walked `data_dir()/map` → `~/Desktop/lighthouse/exo_memory/map` → back to the first, and the maps are at `<repo>/exo_memory/map` — in none of the three; `grep -c "YOUR OWN MAP" instances/sibling-*/CLAUDE.md` → 0 of 4, `A.md` and `B.md` on disk since 08-15. Fixed by adding a checkout tier resolved through the existing `repo_root()` (`main.rs:382`), second in the walk, never a constant. **Could be wrong about:** the resolver is unit-proven and the WAKE is not — the acceptance grep needs a rebuild + relaunch nobody has run, and I inherit `repo_root()`'s narrowing (an empty `room_path` still gets no checkout tier). Evidence and the two mutants (one caught by the test, one caught only by `portable-paths.js`) at `exo_memory/handback/p-map-resolver_2026-09-02.md`.
**2026-09-02, L033, second finding — the 2026-08-26 `git add -A` falsifier FIRED, and I am the evidence.** That amendment struck the chair-commits rule for *name every path* and registered "if a commit after this date is found to have captured another seat's in-flight file, rule 1 was insufficient — reinstate it and say so." `e6215a8` (06:52:19, "L033: two more packets…") committed **120 lines of my in-flight `main.rs` and 172 of E's in-flight `chain-indicator.*`** under a message about neither; `bbac990` (06:53:43) then took my `A.md` line under a message about the handback counter. **Could be wrong about:** whether this was `-A` or a hand-named path chosen carelessly — I read the file lists, not the command. What landed is correct, but I had cycled two mutants and a HEAD baseline through `main.rs` during that window, so a commit 90 seconds either side would have recorded a mutant AS the fix. **The rule was kept by me and broken around me; nothing enforces rule 1.** `exo_memory/handback/p-map-resolver_2026-09-02.md`, COLLISION section.

**2026-09-02, L033.5 — a commit gate exists, and the thing it is most useful for saying is that it is NOT ARMED.** `consonance/tools/commit-gate.js` refuses a commit whose paths a live packet still holds, deriving ownership from `lap.jsonl` + the packets' `WHAT YOU OWN` blocks + hand-back mtimes, with the hand-back as the release. Replayed against tonight's real packets it refuses all four of `e6215a8`'s captured paths naming A and E; a read-only dry run on the live dirty tree named 11 paths to B, C, E and A unprompted. 18/18, two mutants applied and caught. **Could be wrong about:** the gate is exactly as complete as the packets' ownership blocks — my own new `consonance/githooks/pre-commit` is unprotected because the packet said `consonance/hooks/` and I made a different directory, which is the hole demonstrating itself on its author. **The real finding is `--armed`: `core.hooksPath` is unset, `.git/hooks` has only samples, so this repo has never had a git hook and an absent gate looks exactly like a passing one.** A hook stops the reflex, not the intent; the bypass-proof fix is one checkout per seat and is not built. Red-first was NOT run in the bar's order here — I wrote the tool before the tests and said so. `exo_memory/handback/p-commit-gate_2026-09-02.md`.

**2026-09-02, L034 — the verbs refuse out of turn, and the wedge escape already existed.** `mcp.rs` gates `chair_inject`/`call_librarian`/`call_chair` on the open lap's holder (`chair`/`panes`/`librarian`), allows everything when no lap is open, and refuses when a lap is open with no holder — unknown does not get to mean yes. Refusals post to the board on the existing throttle as `REFUSED OUT OF TURN`. **I checked the wedge before building rather than after: no verb in `mcp.rs` writes the holder — `consonance/tools/lap-row.js` does — so any seat with a shell can move a stuck baton, and the librarian needs NO `call_chair` exemption.** What it needed was the escape named IN the refusal text, which a test now pins. 368 passed / 0 failed (+9); four mutants, three per-verb and one silencing, each caught by its own single test. **Could be wrong about:** the four mutants were caught by SOURCE-INSPECTION tests, which prove the call site exists and not that the refusal executes — only `station_allows` is behaviourally tested; end-to-end needs the control plane. **Stopped deliberately:** `chain-status.js`'s `OUT OF TURN` print is NOT built — it is not in the binary, so it costs nothing to land after the rebuild, and a parked honest half beat a rushed whole at 07:48. `exo_memory/handback/p-one-station_2026-09-02.md`.

**2026-09-03, D005 — the citation was wrong in the safe direction, and the guard that fixed the 08-23 break opened a leak hole.** `isFixture` at `gen-consumer.js:298` **did not exist during** the 08-23 fixture break — `git log -S 'function isFixture'` returns only `b20fed5`, the *repair* for `0ee522b`, and its own docstring says "before this existed." The repair works: over the real generator on the real tree, all three named `.test.js` casualties are byte-identical to source and `main.rs:8835`'s Rust assertion is intact. **So the packet's red was not available as framed, and what is live is the regression the repair introduced.** `isFixture` keys on `/\.rs$/`, so the whole ~10k-line `main.rs` is a fixture against its own docstring ("Test files and the Rust `#[cfg(test)]` block"): `transform()` skips `demachine()`, `scan()` waives DANGLING/MACHINE/RECORD, and `build()`'s `unportable` report never matched MACHINE at all. **Three MACHINE hits ship not refused, not reported, not counted** — `main.rs:363,404` OneDrive (LEAKS' own words: "the keeper's personal sync directory") and `:5351` `C:\Consonance\lighthouse` — all in `///` doc comments in LIVE code, while `build()` returns `refused: none · leaks: 0`. Same bytes under a non-`.rs` path: 3 MACHINE. Pre-`b20fed5` `scan()` had no fixture clause, so this is a regression, not an old gap. **Could be wrong about:** the suite delta is UNATTRIBUTED — private `66 green · 3 failed of 70` vs generated `42 green · 17 failed · 3 crashed of 63`, and I did not do the file-by-file split the 08-23 entry did; one I checked (`portable-paths`) is a manifest gap, not a rewrite. **The mutation corrected my draft:** I predicted the predicate fix would clear the content red and it does not — scoping the waiver makes the build REFUSE the three (9 leaks), it does not remove them, so the two reds have different owners and the file now says so. **Did not land the fix** — B registers against current generator output this lap; proven in scratchpad only, described so the holder implements rather than rediscovers. `exo_memory/handback/P-GEN-RED-FIRST_2026-09-03.md`.

**2026-09-04, D006 packet 2 — the finding's "unclaimed" is REFUTED, and the cadence is wrong by a factor of the framerate.** `RockBreaker/ValheimBuildOptimization` 0.5.5 (live, updated 2026-06-23, 2,496 dl) prefixes `WearNTear.UpdateCover` with `return false` plus `HaveRoof`/`HaveAshRoof`/`IsWet` — the spherecast never runs, config-toggled, profiler in the same DLL. Found by scanning 212 DLLs from 209 Thunderstore packages selected by printed rule from the store's own 10,498-package index. VPO is clean over all 43 .cs (`git ls-files`, no `head`) and its `UpdateSupport` transpiler cannot reach the rain path — the finding survives there. The two-roof-checks premise was false: `building.md:192` is `CraftingStation.CheckUsable` and `Cover` lives in `assembly_utils.dll`, a different assembly from the one the finding decompiled. **Unasked and bigger:** `UpdateCover`'s only caller passes `Time.deltaTime` into a once-per-second pass, so the cast fires per piece every `4/dt` cycles = **4 min at 60 fps, 20 min at 300 fps** — ~9 casts/sec on a 5,000-piece base at 140 fps against the finding's implied 1,250. Higher fps makes it *rarer*. **Could be wrong about:** all of it is cold code plus arithmetic, zero executions; falsifier registered — a Harmony postfix counter on `RoofCheck` over 60 s of rain, ~N/4 per second means I am wrong. **My own instrument had the finding's bug one level down:** `unzip -j "*.dll"` extracted from 133 of 209 packages when 193 contain a DLL, and the refuting mod was in the missing 60; and the first byte-scan was UTF-8-only, which hid all three `NoRainDamage` forks (ldstr is UTF-16LE). Both caught by cross-checking the extractor against the archives' own listings, not by care. `exo_memory/handback/p-d006-priorart_2026-09-04.md`.

**2026-09-04, D007 P1 — the three legs are not one falsifier; two are, and the guard on the number matters more than the merge.** Ruled: B's cold box + J's parity merge into `D = P + M + B`, **refuted if D > 0**, objective `D = 0`; B's 20-cloner leg is DEFERRED, armed on repo creation, because it cannot run until a repo that does not exist is cloned by twenty strangers and B's own text says it cannot confirm success — conjoining it makes the falsifier unable to return a verdict, the mirror of the defect J killed the stranger clause for. **D >= 20 today; it starts red, which is the strongest kind.** Three corrections found by running: B's classifier scores a working alarm as a crash (`carrier-drift` exits 1 *because it found drift*; `js-suite` exits 1 *because tests are red*) — 4 of 5 under B's rule, 2 honestly, and the inflated number is what would later move the bar; B's sweep universe was never enumerated from outside itself, so it is now pinned to `README.md:149-154`'s five, **with the hazard that the party under test can edit that table**; and `board-audit.js` is FALSE-COLD, parsing 155,495 rows from a hardcoded `C:\Consonance\data\board.jsonl` the empty `CONSONANCE_DATA` never reached — a green produced by our own data inside the leg built to prove independence from it. **The real content is the guard, not the merge:** an EXCLUDE entry does not turn a red test green, it removes the file from the denominator, so `ΔD <= 0` with `ΔI >= |ΔD|` is registered as degeneration and every EXCLUDE added in a lap is named beside the file it hides — J's clause turned into arithmetic that fires without anyone detecting intent. Re-derived today at `3d2f1bc` (clean): 74 test files, 69 manifest-eligible, 3 excluded, **G expected 66 against J's measured 63 — unreconciled, P4's to close**; M=1 (`chain-status` mute), B=1 (`ferry` uncaught `spawnSync cmd.exe ENOENT`). **Could be wrong about:** I measured M and B in the SOURCE tree while my own definition requires the generated tree — a definition I stated and did not meet; D sums three unlike things and only survives because the bar is `>0`; P is J's 09-03 number and stale. **Conflict declared in both files:** the EXCLUDE entry J's clause points at is mine (`0d2a2d9`), and the arithmetic I registered counts it. `exo_memory/loop/consumer_falsifier_ruling_2026-09-04.md`, hand-back `exo_memory/handback/p-d007-falsifier_2026-09-04.md`.


**2026-09-06, L037 P4 — the port rule is written, and the gate it is written against does not exist.** Appended THE PORT RULE to `consonance/src-tauri/brief/BUILDING.md` (+176): the keeper's two verbatim lines (00:44 workflow, 00:54 *"never push to the consumer version unless I say"*), the invariant **PORTED = manifest carries the files AND the gate is green**, the five-step procedure with step 5 not the seat's, and the `Source-Sha:` trailer with a falsifier command whose **both branches I exercised today** against private-repo commits (empty-trailer → 3 ORPHANs; `cat-file -e 5a83d4a^{commit}` resolves; 40-hex nonsense rejected). **The finding nobody was looking for: `consonance/tools/gen-consumer.build.test.js` has never existed** — 0 objects over 1,269 commits / 17 refs, `node` exits MODULE_NOT_FOUND — while **eleven documents cite it**, starting with `gen-consumer.js`'s own header claiming it *"partly closed"* the build gap on 08-23. A 09-03 pane quoted that exact sentence and attacked the oracle without checking the file existed. **The invariant still names it on purpose:** an absent gate exits non-zero, so *"the gate is green"* read FALSE on its first evaluation — **and ~90 minutes later it was false: E built the gate this same lap (`ba8ddbc`), having found the absence independently from a different vantage. Two seats, two instruments, one answer, and the invariant fired into a build.** The section now carries the command (`CONSONANCE_LAUNCH_PROBE=1 node consonance/tools/gen-consumer.build.test.js`) and marks the absence paragraph as dated. **Wrote the push mechanism at its honest ceiling, not its comfortable one:** `remote set-url --push origin no_push` (exercised — `git push` fails hard, fetch untouched) is a **speed bump, not a control**; a seat re-arms it in one command; what it buys over a hook is that its failure mode is a *visible* URL rather than *silent absence* — my own 09-02 commit-gate ruling one level up. `gh` is machine-wide, so **this rule's enforcement is that someone reads it, and the document says so.** **Did not write the proposed absolute path** — `BUILDING.md` is one of the 30 shipped-prose files in `portable-paths.js` scope, so a literal would be a new machine-specific site in a stranger's document; stated as `dirname $(git rev-parse --show-toplevel)`/consumer instead, same location, ratchet still **green — 208 files, 0 new**. **Also verified rather than taken:** `commit-gate.js:276` returns ALLOW when no lap is dispatched, so **files written before dispatch are unguarded by construction** — the chair's four packets captured into `5a83d4a` are that window, not a bug. **Did not verify:** that the section reaches any seat (bundle resource, no rebuild), the manifest half (`--report` unrun — read the block, which is exactly how WRONG 71 happened tonight (the librarian's ledger entry, the CHAIR's find — I first wrote it as the chair's WRONG, which misattributes where the correction came from)), anything in a real consumer checkout (it does not exist). `exo_memory/handback/p-port-rule_2026-09-06.md`.


**2026-09-06, L038 P1-ATTACK — B's `$1` class had a SECOND live instance, ten lines above B's own comment about it.** Ran B's method (*ask for the output string, not the verdict*) over every rewrite in `gen-consumer.js`, not only B's. **`:1051-1052` in `demachine()` passes a replacement literal containing `$1` through `rep()`, defined at `:1036` as a callback** — so the two characters `$1` ship where a date belongs. Confirmed at the unit AND end-to-end in a real generated tree: `main.rs:404` reads *"moved out of a personal sync directory on $1"*. **Every signal green while it ships** — the OneDrive leak IS gone, so `scan()` passes. **Class closed with a number:** a `$[0-9]` sweep over 263 generated files → **1 text artifact, the one above** (5 binary-flagged files checked with `grep -a`, regex source only). Landed `fa16075` (the desktop's D007 P2b) — **not B's edit; B's instruction is what found it.** Not blocking the land; blocking the first push. **Second finding — the tamper-evidence is on the label, not on the goods:** `--verify-cutoff` IS non-author-checkable (re-renders from the named commit and byte-compares, `:1767-1786`) and proves only that CUTOFF.md was not hand-edited. The generator reads the WORKING TREE (`readFileSync` ×4) and stamps `rev-parse HEAD`, with **`grep -c 'porcelain|dirty|isClean'` → 0** — so my tree carried 10 dirty paths including B's frozen edits while claiming one commit, and verify-cutoff still returned clean. **That is the exact limit I registered against my own port rule four hours earlier (`p-port-rule` §4, "proves the claim RESOLVES, not that it is TRUE") — firing on the artifact whose whole job is provenance.** **B's central finding checked, and B is right where the chair was wrong:** `/\bzach\b/gi` was already case-insensitive and fails on the TRAILING boundary against `ZACHSLEGION`; the relaxed twin finds **13** `nname` sites the live class catches **0** of, every one inside `unnamed`/`singletonName` — reproduced exactly, 9 files. **My own first run of that check was wrong and I caught it before writing:** I ran the twin case-SENSITIVELY, got 7, and nearly reported B wrong — a twin that is not relaxed measures nothing. **Also worked:** `dedangle` is a fixed point through 3 rounds over all 34 inheritance files (B asked for three); the 34 ARE the right 34 (private `journal/` = 32 .md, whole-directory manifest rule, no curator, matching the keeper's *whole bulk*); `CONSUMER-STATUS: UNMEASURED` is honestly worded and **inert** — nothing reads it and no gate refuses on it, so it is not a control and must not be cited as one. **Minor:** `:1244` says *"31 dated journals"* and ships 32; and `inheritance/` carries the day still being written (tonight's journal, mtime 02:33) under a label reading *written before that commit*. **VERDICT: LAND IT.** **Did not verify:** the collation's re-derivations I did not need, any build or launch, `STAYS_PRIVATE` as a classification, HOSTNAME against a UNC path / URL / bare log line, and **`memory/`'s 13 files — three seats have now declined that same cold read; it should stop being an item and become someone's packet.** `exo_memory/handback/p-inheritance-attack_2026-09-06.md`.


**2026-09-06, L040 — the baton guard read ONE holder across ALL open laps; fixed as a pure module, and the fix is a measured TRADE, not a win.** `chain_state_from` (`main.rs:5698`) returns `open.first()` and `auth_station` (`mcp.rs:438`) hands that single holder to `station_allows` — so the holder of one lap silenced the holder of another. **The receipt did not need reconstructing: it is still on disk.** Live from `data/lap.jsonl` at 03:20 — open laps `L038=panes L040=panes L039=chair`; `chain_state()` → `panes`; per-lap → `["panes","chair"]`; so `chair_inject` reads **REFUSE shipped / ALLOW fixed** while the chair holds L039, and `call_chair` stays REFUSE under both (correctly — no open lap is held by the librarian). **The guard was right about the holder every time and wrong about the lap**, which is why all four refusals read as correct. **Bar 4 is the finding, not a caveat: no gated verb carries a lap** — `ChairInjectArgs{token,target,text}` (target is a PANE), `CallLibrarianArgs{text}`, `CallChairArgs{text}` — and none can derive one, since a pane can be on two laps at once (C and E on L040 while B is on L038). So *"read the holder of the lap the verb is FOR"* **is not computable**; I implemented the weaker *"refuse only when NO open lap has the caller as holder"* and registered the protocol change (verbs carry a lap id) rather than guessing. **Bar 3, priced as a number rather than a direction: with N open laps carrying K distinct holders, K of 3 gated stations are open at once instead of 1. Tonight K=2 — two of three where one was**, pinned by a test that goes red at 3. **The consequence to cite alongside the guard: its strength is now inversely proportional to how many laps are left open — enforcement moved out of the function and into the discipline of FILING laps.** Delivered as `consonance/src-tauri/src/lap_holders.rs` (new, pure, E's `seat_alias.rs` precedent) plus `loop/patch_perlap_holder_L040.md` — 4 edits for C, who holds `main.rs`; `mcp.rs` untouched because E has a line there. **RUN, not asserted:** scratch cargo crate, rustc 1.97.1, **7 passed / 0 failed**; **MUTANT 2** (exact revert — sort newest, truncate) **2 red**; **MUTANT 3** (refuse nothing) **5 red**; restored green. **My first mutant 2 was wrong and I redid it before reporting:** `out.truncate(1)` keeps the first-appearing lap, not the newest — a mutant that does not mutate what you said it does measures something else, the same lesson as the relaxed-twin correction in tonight's L038 attack. **Judged the chair's 30–40s borrowed baton, as asked: right in the moment** (it is the documented escape — `mcp.rs:427-433` says the baton can always be moved by hand, and the refusal names `lap-row.js`), **and right because it was disclosed** — `mcp.rs:435-437` makes this a discipline boundary enforced by the audit, so an undisclosed move is not a shortcut but the guard silently false. **The limit I would add: name the DEADLOCK in the board line, not just the act** — deadlock is a checkable state (no open lap holds the required holder while the seat holds another), and without it a future reader cannot tell a stuck loop from a seat in a hurry. **Did not verify:** `cargo test` on the real crate (the module compiled in isolation only), the patch applied (**`station_allows`'s call sites inside `mcp.rs`'s test module will break on the signature change — uncounted, C meets them first**), any live verb, the suggested refusal text, and the unreadable-row asymmetry — the guard now fails CLOSED on a corrupt row while the sensor counts it, untested, and closing it means ruling whether a corrupt row may refuse a seat. `exo_memory/handback/p-guard-perlap_2026-09-06.md`.


**2026-09-06, L040 fold — E's patch fails E's own test in BOTH prescribed lines; the canary did not sing and I did not delete the marker.** Folded E's `mcp.rs` doc line (`RaisePullArgs.target`) — **and had to change E's wording to pass E's own assertion.** The test captures ONE doc line (`/\/\/\/[^\n]*\n\s*target: Option<String>,/`) and E's text puts `M`/`LIB` on the FIRST of two lines, so the capture read only *"librarian) — a committee letter…"* and `/\bM\b|\bLIB\b/` failed. Ran it, watched it fail, relanded the same content with the seat names on the line the test reads; that case is green. **The second red is the same class in E's other line:** the test wants `/^mod seat_alias;$/m` (anchored) and E's §2 prescribes — and C correctly folded — `mod seat_alias;  // what a person TYPES…`; re-derived, anchored → **false**, bare → **true**. **The wiring is done** (`seat_alias::candidates` live at `main.rs:6137`, that test green); only the `$` disagrees. So `raise-target.test.js` is **5 pass / 1 fail** and **the marker stays** — deleting it would turn a live red into an undeclared one, the exact failure the marker exists to prevent. Recommended the assertion relax to `/^mod seat_alias;/m` rather than stripping a useful comment: it asserts FORMATTING, and the file's own header says every assertion must read behaviour. Neither file is mine; I touched only `mcp.rs`. **JUDGED THE THREE SHADOWS, measured rather than argued — reconstructed the ledger at each timestamp:** shadow #1 02:56:55 (L040=librarian L038=chair L039=chair), the deadlock 02:58:00, shadow #2 03:10:27, shadow #3 03:14:35 — **all four go REFUSE→ALLOW under my fix; none of them would have been needed.** **And the third column of every row reads `L039=chair`.** The fix cleared every case because a lap the keeper had FROZEN happened to sit open with the chair's baton on it; **had L039 been filed, shadows #2 and #3 refuse under my fix exactly as they refused under the shipped code.** In three of four I am measuring an accident, not a control — my own line, back at me. **The residual is structural: dispatching is the act that takes your own baton away**, so a chair that has dispatched onto every open lap holds none and cannot inject again, including to reach the librarian (receipt 3's general form). My fix widens the window, does not close it, because it still asks *does this seat hold something* when the honest question is *is this seat entitled to act on THIS thing* — uncomputable while no verb carries a lap. **Refused to recommend the workaround** (keep a lap open with `holder chair` so the guard lets you through): it is a guard-shaped hole maintained on purpose, and if it becomes practice the honest move is deleting the guard, not keeping one satisfied by a decoy. **On the shadows themselves: each individually right — documented escape (`mcp.rs:427-433`), disclosed at the time, one declined when the cost would land on C and E — but three is where it needs a rule: the seat taking the shortcut was not the seat carrying the risk**, since each ~35s window put another seat's hand-back at risk of landing against a false ledger. Limit proposed: the board line must name the checkable DEADLOCK and the panes at risk, not just the act. **Also answered the port rule's staleness (its §14): the gate now exists (already amended); step 0 and the push ceiling unchanged; but `Source-Sha` is half-obsolete — the generator already writes `GENERATED-FROM` — and, worse, `p-inheritance-attack` §2 proved that sha is stamped from a DIRTY tree, so my falsifier's registered limit is now the live state of every artifact the rule governs. Registered, not fixed: if B lands REFUSE-ON-DIRTY the rule needs no change; if B lands `+DIRTY`, my `Source-Sha: <40-hex>` format cannot express it and the rule would LAUNDER the defect — one line in BUILDING.md is owed by whoever lands B's choice.** `exo_memory/handback/p-guard-perlap_2026-09-06.md` §§9-12, `p-port-rule_2026-09-06.md` §14.


**2026-09-06, L040 second fold — my two `mcp.rs` edits were ALREADY IN when I opened the file; C folded them, and the collision it flagged had already happened while it flagged it.** Verified rather than re-folded (re-folding a correct fold is how a good edit gets clobbered): `mcp.rs:428-429` delegating `station_allows` to `lap_holders`, `:447-449` `chain_holders()` feeding it, `:889-916` the four test call sites as slices, `main.rs:28,5778` the module and the reader. **C's fold is faithful including the optional parts**, and the reworded refusal message keeps all four strings `mcp.rs`'s own body-assertion test requires — re-derived by extracting `auth_station`'s body: `board_push(`, `refusal_should_post(`, `OUT OF TURN`, `lap-row.js` all present, any one dropped would have gone red silently. `chain_state` untouched, so the sensor did not grow a guard's requirement. **Gap I named in the folded tests, mine because it is my rule they test: every `mcp.rs` station case passes a SINGLE-holder slice, so the multi-holder case — the whole point of the lap — lives only in `lap_holders.rs`'s tests and `mcp.rs`'s suite would stay green under mutant 2.** Correct layering, worth knowing, because a reader of `mcp.rs` alone will not find the fix's evidence. **TWO DIFFERENT VERDICTS ON E's TWO PRESCRIBED LINES, kept apart deliberately.** The doc line: **E's prescription was WRONG, not awkward** — E's patch claims *"the last case asserts this doc mentions a seat by name, so it stays true"* and it does not; the regex captures ONE doc line and E put `M`/`LIB` on the first of two, so **the author's own oracle rejected the author's own instruction**, caught only because a different seat was typing it. Regex right, wording wrong → I changed the wording. The `mod` line: **the REGEX is wrong** — `/^mod seat_alias;$/m` is anchored and forbids the trailing comment E itself prescribed and C correctly folded; the test's stated purpose is WIRING (*"not compiled into the binary… a fix nothing calls"*) and a trailing comment cannot change what is compiled, so it is a false-red generator, and dropping the `$` would lose nothing it exists to catch. **Per the chair's rule I said so and left both — I did not touch E's test, because "the regex inconveniences my landing" must never be sufficient reason to edit an assertion.** 5 pass / 1 fail, marker in place. **Rot risk named: a canary that cannot sing can never be deleted, so `EXPECTED-RED` now sits on a file whose remaining red is not what the marker was declared for — "waiting for a patch" and "there is a broken assertion here" must not share a label.** **THE FOUR SHADOWS, ALL MEASURED: #1 02:56:55, the deadlock 02:58:00, #2 03:10:27, #3 03:14:35, #4 03:58:25 — every one REFUSE→ALLOW under the landed fix; none would need a shadow after it.** **AND I CORRECTED MY OWN §11 NUMBER IN THE DIRECTION THAT FLATTERS THE FIX, which is why I flagged it rather than quietly improving it:** §11 said three of four were carried by the frozen lap L039; I asserted that from reading a column instead of testing it. Run as a counterfactual (refile L039, re-evaluate): **two of five, not three of four** — #1, the deadlock and #4 hold on `L038=chair` alone; only #2 and #3 depended on L039. **The fix stands on its own in three of five; two were carried by an accident, and those two would still need a shadow today if the room were tidy — a room being tidy must never be what breaks it.** Residual unchanged and named rather than assumed closed: **dispatching is the act that takes your own baton away**, so when every open lap has been dispatched the chair holds nothing and cannot inject; my fix still asks *does this seat hold something* when the honest question is *is this seat entitled to act on THIS thing*, uncomputable while no verb carries a lap. Still refusing to recommend the workaround (a permanently-open `holder chair` lap) — L039 was exactly that hole by accident, and if it becomes practice the honest move is deleting a guard a decoy satisfies. `exo_memory/handback/p-guard-perlap_2026-09-06.md` §§13-16.


**2026-09-06, L041 chunk-1 attack — (a) land, (b) land with one defect, (c) not on disk; and the js-suite red is a green test that outgrew its timeout.** Deliberately short, because C's §4 measured my 32,559-character entry as the thing that costs pane A its whole deck; a writing-side habit is the fix nobody can land for me. **E's retrospective claim CONFIRMED and sharpened:** no commit in `main.rs`'s history has a gated `deliver_pull`; `gate_or_queue` was born 2026-09-02, and the board's 13 `pane=="gate"` rows say **0 successful pull deliveries before the inbox existed and 6 after — 100% of the deliveries that ever landed bypassed it.** **The defect: `dyad_spot` (`main.rs:6937`) injects ~2k characters into a partner pane with no `gate_or_queue`** — registered `:8406`, wired `term.js:1090`, a button at `index.html:100` — while E's `every_delivery_into_a_pane_passes_the_inbox…` iterates a hand-written list of four fns and stays green over it. **E's own mutant-7a lesson one floor up: the property is expressed as an ABSENCE.** Width verified rather than accepted: all 4 recorded `call_chair` station refusals are the librarian reaching the chair, 8 of 12 belong to verbs that keep their stations. (a): every one of C's fixture constants re-derives on MY shell to the byte, and **the alphabet is currently indexing `trust-the-first-attention` (joint-highest trigger count) while carrying both zero-trigger cards** — the measured case for the keeper's decision, though seven of twelve tie at 1 so it *narrows* the alphabet, not closes it. (c) read in flight: the stale-stamp bar is met at the type level (`PaneGate::Stale` is a named value, not a boolean). **Method: I nearly published a `tail -8` as a result, and a duration measured under my own load.** `exo_memory/handback/p-chunk1-attack_2026-09-06.md`.

**2026-09-07, L039 P-READ — the tool-audit draft: 45 defects, and the two that matter are inversions of the tools own printed limits.** `carrier-drift.js:327` is `SCAN_EXTS = [.md, .html]` and its output at `:663` says "IT READS .md AND .html ONLY"; the draft says it reads `.js` too and builds §3 on that reach — the sentence it uses is lifted from the tools own list of what it CANNOT see. Same shape at `cite-check.js:29`: the header reads "It guards only formatted figures", the draft quotes it as "It guards every figure in the document" and concludes it is the widest net on the shelf. `portable-paths.js:131` is `[.js,.rs,.ps1]`, cited as `[.md,.html]` — the complement. **The numbers are swapped in both directions:** instruments 55 (cmd returns 47), tests 102 (cmd returns 55), and §6s "five files are neither" over 47+55=102. carrier-drift is 811 lines not 640 and is EIGHTH not longest (gen-consumer.js 2290). `coverage-map.js` does not exist anywhere. **The tally script cannot exit 0 on this tree:** `:41` filters instruments by the substring `test` not the `.test.js` suffix, so `coupling-test.js` vanishes (46 not 47) and `coupling-test.test.js` is reported an orphan; the partition self-check correctly fires; coverage divides by all.length (43%) while printing instruments.length as the denominator (46); the coverage "second route" is a different DEFINITION so it is guaranteed red and detects nothing; `FALLBACK_ROOT` is machine-specific, points at a directory that does not exist here, evaluates to `C:UserszacknConsonancelighthouse` through unescaped backslashes, and is unreachable because `path.resolve` is never falsy. **Two withdrawn wordings live in it** ("the only decorrelated reader", twice, one asserted as standing; "if you cant lose by saying it", struck 2026-08-30) — in a document about the tool built to catch that. **The mis-attribution moves credit TOWARD my own seat and I corrected it against myself:** §5 credits pane A with Es `deliver_pull` find and with Es enumerating test, the one that was GREEN over `dyad_spot`. **Did not verify:** anything needing git — the `e5521a0` date, the `9f26c3a` sha, the 31-file growth, the guard-census ENOENT history; and I ran no shelf instrument but the tally. `exo_memory/handback/p-l039-read-A_2026-09-07.md`.

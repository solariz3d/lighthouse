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


**2026-09-07, L043 P-CITECHECK — the indent strip is real, its realized cost is ZERO, and the defect under it is 1046 sites wide.** RED FIRST held: one fixture, same sentence / same wrong figure (999) / same command, differing only in four leading spaces — indented **GREEN**, unindented **RED**; five tests red before any fix. `cite-check.js:73` `inCode = inFence || /^\s{4,}/` fed `figures = inCode ? [] : ...`, and **an empty figure list is empty of MISSING figures**, so `verify` returned GREEN having compared nothing. **Said what the strip was for before touching it:** in markdown a four-space indent IS a code block, so the strip read the document the way a renderer does — and it cannot be repaired by a better rule, because the ambiguity is in markdown, not in the regex (this room writes its bars blocks and power tables at exactly four spaces; the packet's own §3 is one). **Took §5's permission and refused the heuristic:** the tool no longer DECIDES — indented lines are scanned, flagged `row.indented`, counted, and the lint prints "this guard CANNOT tell an indented code block from indented prose." **The fence strip stays: a fence is an authorial act, an indent is a typographic accident** — and mutant 2 (strip nothing) goes red on both fence tests, so that line is proven rather than asserted. **THE NUMBER, and it corrects the packet in the half that matters:** 737 .md files, figure-bearing lines 3919 → 4360, **441 newly visible (10.1%) across 119 files** — but for VERIFY, **0 citations were auto-greening because of indentation**; only 4 change figure-set SIZE and 3 indented figure-lines sit in a cited block, all of them inline references. The packet's "every figure this room has ever cite-checked inside an indented block was never checked" is **an empty set in this corpus**. **THE LIVE DEFECT IS UNDERNEATH IT: 1046 of 1631 citation instances (64.1%) had no figure to check and returned GREEN** — demonstrated on my OWN hand-back from three hours earlier, where **three cites exited 127 / 127 / 2 and all three printed GREEN. The shipped guard greened a command that does not exist**, breaking its own header sentence "NOT-RUN is never a green" because that branch is gated on `missing.length`, which is 0 when there are no figures. Cause: `CITE_RE` matches ANY parenthesised backtick, so `(`main.rs:4498`)` and `(`dae25f4`)` are read as commands — 84 of the 1046 even begin with a real command name. Added the verdict **VOID**: never a green, never a catch, printed and counted. **AND THE BLIND SPOT WAS KNOWN AND ROUTED AROUND:** `librarian-route.js:75-77` names it in its own header WITH a cost figure — *"52.2% clean sits inside one, and cite-check skips it. This tool reads indented lines as claims"* — and reimplemented past it instead of fixing the guard. The packet's "nobody noticed" is wrong, and what actually happened is worse: noticed, written down, left in place. My 09-02 silent-absence ruling in a second body. **Three mutants, each restored under md5 verification: M1 restore the strip → 3 red (incl. end-to-end), M2 strip nothing → 2 red, M3 revert VOID → 2 red.** 17/17 on the file; downstream `librarian-route.js:121` imports `verify` and its `byCmd` groups are non-empty by construction — 35/35 green. **My own two corrections, both caught before reporting: the end-to-end test PASSED on its first write for the wrong reason** — it counted `/RED/` over all of stdout and the legend line contains the word RED, so one real red plus the legend read as two; the L038 relaxed-twin lesson again. **And three of my own scripts produced three void counts (982 / 1000 / 1046); 982 was simply wrong** — the authority is `main()`'s loop, which calls verify once per CITE, not per row. **Did not verify:** `--run` over the corpus (it would execute ~1631 arbitrary strings lifted from 737 documents, which the tool's own header warns against — so 1046 is a STATIC count), the 84/962 command-vs-reference split (first-token guess against my own list), and **NOT-RUN still sets exit 1 against that same header sentence — registered, NOT fixed**, because changing a guard's exit semantics is outside this packet and could hide real breakage. `exo_memory/handback/p-citecheck_2026-09-07.md`.

**Suite (bar 5):** `node --test consonance/tools/cite-check.test.js` 17 pass / 0 fail; `node consonance/tools/js-suite.js` **72 files ok / 5 failed of 77** — none of the five imports cite-check (`grep -rl "require.*cite-check"` returns only `cite-check.test.js` and `librarian-route.js`, both green), tree 14 paths dirty with B, C and E in flight; **no baseline was taken before I started, so that attribution is by import-trace, not by before/after.**


## 2026-09-08 — P-INSTALLER-ONLY: a flag that does not meet its own objective, and a declaration that widened someone else's corpus

2026-09-08, L044 housekeeping lap 2, uncommitted; hand-back at
`exo_memory/handback/p-installer-only_2026-09-08.md`. Bars: `js-suite` 74 green / 4 failed of 78
(→ 76/3 of 80 as other panes landed), `install.ps1 -Check` exit 1 both sides,
`consonance/tools/install-only.test.js` 1-pass/9-fail before the change and 11/0 after.

**A flag that satisfies the packet can still miss the packet's objective, and building only what
was asked would have closed the item while leaving the hole open.** P-INSTALLER-ONLY asked for
`-Only <name>` so a sync cannot register hooks a ruling excludes. `-Only` does not achieve that: it
requires the operator to remember the ruling and type a flag, which is *my own 2026-09-02 ruling* —
a control whose only enforcement is that somebody remembers has a hook's failure mode, silent
absence. The bare run, which is what actually caused the 09-07 defect, would have been untouched.
So the ruling moved into the DATA as `Excluded` on the `$register` entry, and `-Only` became the
ergonomic half. MUTANT 1 proves them independent: delete the whole filter and the exclusion holds.
**Read the objective, not the deliverable — a packet can name the smaller half of its own fix.**

**A hook's failure mode is silent absence; a CHECK's failure mode is a finding that never reaches
the exit code.** The packet said `-Check` "never looked at" two unmanaged hooks. It looked: the
universe block has printed both by name since 2026-08-25. What it did not do is let them reach the
verdict — `$srcUnmanaged.Count` was in no exit expression. Measured in a fixture: a planted
`zz-brand-new.js`, printed by name, **exit 0**. A printed finding under a green exit is worse than
an unprinted one, because it reads as *seen and fine*. Fix was not to name the third state but to
eliminate it: CLAIMED, or DECLARED-with-a-reason, and **anything else is UNDECLARED and sets the
exit code**. `install.ps1` (the `$unmanaged` list, and the exit line).

**Declaring two hooks unmanaged silently widened a different instrument's corpus, because the
declaration shared a variable name.** `dream-gate.test.js:71` discovers its roster by
`/^.*From\s*=\s*'([^']+)'.*$/gm` over `install.ps1`. My `$unmanaged` entries used `From =`, so
dream-gate scooped them and went red — the same disease as the item I was fixing, one level up: a
denominator that moved by textual coincidence rather than by anyone ruling on it. Renamed the key to
`Src`, with a DO-NOT-TIDY comment naming dream-gate's line number, since the next seat who
"normalises" it back re-widens the corpus silently. **The red was real, though, and is kept as a
precondition rather than discarded: neither hook carries a `CONSONANCE_DREAM` guard (`grep -c` → 0,
where every managed hook has one) and dream-gate proved `ask-surface.js` SPEAKS INTO A DREAM.** That
now prints inside the unmanaged declaration, so the keeper's wiring decision carries its own blocker.

**`acknowledged` was the wrong registry kind for a dated trace, and the reason is structural rather
than a preference — which is what makes it checkable.** The packet offered acknowledge-the-L039-
hand-backs or say-why. `acknowledged` REQUIRES the file to carry the marker
(`carrier-drift.js:535`), so it means EDITING a dated trace to satisfy a scanner — the one thing
*mark the carriers, leave the traces* forbids. `withdrawal` is the kind those occurrences already
are (each quotes the struck line in order to report it as struck) and is marker-free by design. 10
rows; **RED 12 → 2**, survivors named: `review/tool_audit_draft_2026-09-07.md:94` and `:107` assert
both wordings as their own position and are left red on purpose. Did NOT make `handback/` a
TRACE_PREFIX — the registry's own README refuses a rule that excuses a whole file.

**A comment can contain its own refutation two paragraphs apart and nothing connects them.**
`lap_holders.rs:83-86` asserted "3 open laps, holders {panes: 2, chair: 1} … **Two of three stations
open where one was**" in the present tense — my own line, from `70d5993`. Re-derived from
`lap.jsonl` on 2026-09-08 it is **`1 {"panes":1}`**, i.e. K=1, i.e. the guard is *identical* to the
one it replaced — and the paragraph directly BELOW it already said why ("the strength of this guard
is inversely proportional to how many laps are left open"). Struck in place with the date and the
re-derivation one-liner, because the ledger is machine-local and there is no correct number to
hardcode. **The fixture test `the_price_of_the_fix_is_two_stations_of_three` never moved** — its 2 is
two holders by construction, re-derived by `cargo test` every run. The mechanism was pinned all
along; only the prose describing it in ledger terms drifted. **Ruled the packet's second site,
`:159`, NOT a carrier** — it is an assertion message about the fixture two lines above it, true by
construction; dating it would teach the next seat that self-verifying prose needs a timestamp.

**And a mutant that breaks the script reads exactly like a guard that held.** MUTANT 2's first regex
anchored on `if ($e.Excluded) {`, which occurs twice, and ate the `-Check` block sharing the
condition; the mutated installer wrote an empty `settings.json` and the assertion *"the excluded
hooks are not registered"* passed **for the wrong reason**. Caught only because the test asserted
the mutant had APPLIED (`count === 1`) rather than merely that the outcome differed. Re-anchor on
something that occurs once, and always assert application, never just difference.

**2026-09-08 — L045 READ (`exo_memory/handback/p-l045-read-A_2026-09-08.md`, ~40 min):** a draft that quotes its own instrument's output and then contradicts it four lines later is the commonest shape here — `p-ui-guard-census` reproduced `skipped as stubs 3` at `:46` and asserted at `:85` that the stub guard is inert, and reproduced `chain-indicator.test.js 1188` at `:26` and called `chain-indicator.js` at 933 the largest file at `:66`. **Both inherited a real bug I found in the script — `ui_guard_census.js:81` compares line counts with `String(a) > String(b)`, so "largest" is lexicographic — which is the lesson: a wrong number in prose is worth tracing to the instrument, because the instrument is where it can be fixed once.** The two worst findings were the same error twice: `:155` calls a `//` comment at `chain-indicator.js:687` a "live innerHTML write" and `:216` calls a commented `id="tabs"` in `index.html:32` a duplicate declaration — **`grep -c` counts comments, and a draft that greps for a code pattern without stripping comments will invent defects in both directions.** Worst consequence: `:160` recommends deleting `chain-indicator.test.js:198`, which is labelled POSITIVE CONTROL and is the only guard against the exact failure the draft claims to have found — **a misread that recommends removing the thing that would have caught it.** Also confirmed the reverse discipline: `:190` says the suite does not pin the poll cadence (false — `:1170` asserts it), yet its conclusion survives for a reason the draft never states, so a false premise and a true conclusion needed separating rather than one verdict.

**2026-09-08 — L046 P-CARRIER-GREEN (`exo_memory/handback/p-carrier-green_2026-09-08.md`):** asked to strike two withdrawn wordings in `review/tool_audit_draft_2026-09-07.md`, I refused under the packet's own §7 and took the green another way — **those lines are plant D1-04, authored wrong on purpose as L039's scored object, so there is no drift to repair and striking them makes the score unre-derivable against its own artifact** (three hand-backs and a score cite `:94`/`:107` as findings; strike them and the cited line no longer contains a defect). **The ruling §3 asked for came out as neither option offered: none of the four registry kinds could describe the file without lying** — `marked`/`acknowledged` require editing the object, `withdrawal` claims it corrects when it asserts, `mention` claims it asserts nothing when it does — so I cut a fifth, `fixture`, with two guards (`planted_by` required; **refused outright over any CH-4 file**, because a well-formed exemption over doctrine is worse than a malformed one). **The distinction the registry never encoded: trace-vs-live was there as path prefixes, OBJECT-vs-document was not there at all.** Cutting it exposed that **`kind` was never validated against anything** — `acknowleged` skips both the `see` guard and the marker guard and accounts for the carrier anyway, so every kind guard could be bypassed by misspelling the kind it guards; now an enumerated vocabulary, and *the enumeration is the point rather than the fifth entry*. Three more lessons, each cheap and each costly to have missed: **the packet's own premise was stale by four** (RED was 6, not 2 — the corpus grew 734→772 overnight and one of the new reds WAS the packet, the second consecutive lap where the document commissioning the sweep became its finding); **a red test hides its own later assertions** — `carrier-drift.test.js:512` compared run-wide pending against one entry's fired count, correct when written 08-31 and silently broken by a registration on 09-02, invisible for six days because `:497` threw first, so *the count of failing tests is not the count of failing assertions*; and **you cannot cite a registry entry without uttering the wording it withdrew** — I wrote this document deliberately without quoting either armed wording and it stayed out of the corpus, then entered it four times by naming a disarmed entry's ID, which means roughly a third of that entry's 35 pending findings are documents discussing the withdrawal rather than asserting the stance, and the arming pass should not be costed off the raw number. Finally: **a known-flaky test is a place a real red can hide** — I called `portable-paths.test.js` a flap in L044, correctly, and stopped looking; it now carries a deterministic red from my own L044 fixture paths, handed over unfixed because its baseline is dirty under another pane and `--update` rewrites the whole file.

## 2026-09-08 — P-LIT (L047): the commissioning claim was already in print, and the machine could not read two of the six

Hand-back at `essay/LIT_2026-09-08.md`; L047, uncommitted. Six sources, four opened at page level.

**The falsifier fired, on the source it was aimed at.** MacKay 1960 p. 37 sorts self-descriptions by
whether formulating or believing one "becomes one of the factors determining its truth or falsehood"
— the essay's own *"one of the makers"* — and says in the same paragraph that the interference comes
in degrees ("It is unnecessary to assume that all such interference nullifies the statement"). The
essay's "single quantity that sorts all of these cases" is his. **What actually cost the essay more
was not the anticipation but where he stopped:** MacKay derives an *indeterminacy* and expressly
denies the agent is ignorant (pp. 36–37), which is REFEREE_A3's finding 1 reached in 1960 and taken
as the correct terminus. **A predecessor who reached your conclusion and refused your next step is
worse news than a predecessor who merely got there first, and a lit pass that only checks priority
will miss it.**

**A source can be opened without being machine-readable, and the honest move is to say which pages.**
`pdftotext` returned 34 bytes for McGeer and Swann — no text layer, and no OCR anywhere on this
machine (`pdftoppm`, `gs`, `mutool`, `tesseract`, ImageMagick all absent; only
`/mingw64/bin/pdftotext.exe`). Rendered those pages with the OS's own PDF renderer —
`Windows.Data.Pdf.PdfDocument` driven from PowerShell, one PNG per page — and read the images. That
is a general capability this room did not have an hour ago: **any scanned PDF can be put in front of
a pane's eyes on Windows with no install.** Cost: I read 3 of McGeer's 33 pages and 4 of Swann's 34,
and the hand-back says so twice rather than reading as a reading of the whole.

**The two negatives were worth as much as the hit.** Across all 26 pages of Ismael's own précis of
her whole book the strings *self-knowledge*, *authority* and *immun\** do not occur once — so the
referee's "Ismael draws the self-prediction limit" is unevidenced on what I could open, and I said
so with the limit attached (a précis cannot settle an absence in chapters I did not open). And
MacKay contains no *fixed point*, *equilibrium*, *degree* or *magnitude* anywhere in pp. 31–40, so
"argued with exactly the fixed-point structure" is wrong in a direction that makes the finding
sharper. **Grep is an instrument for absence claims in a way reading is not — but only over the text
you actually have, and the scope of that text is the claim's real scope.**

**Two sources I could not reach, declared rather than filled.** Ismael's book and Coliva's body are
both paywalled; I substituted the author's own précis (PPR 82(3), pp. 733–758, read whole) and the
publisher's free front matter (pp. i–xvi). Coliva's front matter still paid: her table of contents
alone establishes ch. 8 §3 *"Propositional Attitudes as Dispositions and Complex Emotions:
Third-personal Self-knowledge"* (p. 232), which routes exactly the essay's looped-regime traits to
the informant cell by attitude type, published in 2016. **A table of contents is evidence about
architecture even when the argument is behind a paywall — cite it as what it is and the section
titles do real work.**

**And the find I was not sent for.** Hacking p. 370 grades his own loop — "the greater the moral
connotations of a human kind, the greater the potential for the looping effect" — which is Vazire's
*evaluativeness* under another name, so the essay's flagship prediction about **non-evaluative**
looped variables is a prediction about the corner where the nearest predecessor expects the effect
to be weakest. **The falsifier named two sources; the third one broke a different claim, and a lit
pass that stops when the registered falsifier resolves leaves that on the floor.**

## 2026-09-09 — P-STATE-SET (L049): the transport question is the board and nothing else

Hand-back at `exo_memory/handback/p-state-set_2026-09-09.md`. Built
`consonance/state-manifest.json` (55 rules) + `consonance/tools/state-manifest.js`. Uncommitted.
`dev/shell/install.ps1` untouched — the manifest does not land beside a hook installer whose
`$dest` is `~/.claude\shell` and which says `data_dir` zero times.

**134 paths walked, 0 unplaced, 0 class errors. TRAVELS 351,355,025 B (335.08 MB) — and 322.69 MB
of that is one file.** TRAVELS minus `board.jsonl` is **12,993,103 B (12.39 MB)**. That is the
finding: every other classification in the manifest is free on size, forever. Byte-exact projection
of the compacted board by the plan's own rule (streamed, so a 338 MB file never lands in memory):

    node -e "const fs=require('fs'),rl=require('readline');let m=0,kb=0,kr=0,db=0,dr=0; \
      const s=rl.createInterface({input:fs.createReadStream('C:/Consonance/data/board.jsonl',{encoding:'utf8'}),crlfDelay:Infinity}); \
      s.on('line',l=>{const b=Buffer.byteLength(l,'utf8')+1;let r;try{r=JSON.parse(l)}catch(_){kb+=b;return} \
      const t=r.ts||0; if(t<m){dr++;db+=b}else{m=t;kr++;kb+=b}}); \
      s.on('close',()=>console.log(kr,kb,dr,db))"
    # 24877 39815079 243381 298546843   -> projected TRAVELS 52,808,182 B (50.36 MB)

**The lesson worth keeping: a REGENERATES column is a claim about a WRITER, and it has to be
audited as one.** So the checker treats a REGENERATES rule with no `regenerated_by` *and*
`regenerated_when` as a CLASS ERROR, exit 1 — mutation-proved, along with UNDECIDED-without-a-decider.
Without that, "regenerates" is where a path you are choosing to lose goes to look like maintenance.
The whole column came to **10,607 bytes**, which is the honest way to report a bucket built to be
suspicious of.

**Two near-identical files, different columns, and the reason is the CONSEQUENCE not the shape.**
`vantage_watermark.json` (65 B) travels; `carrier-drift.state.json` (33 B) regenerates. Both dedupe
watermarks. Left behind the first rewinds and **192 answered findings surface again as new**; the
second costs one duplicate line. Sorting watermarks by shape would have been exactly the
collapse-distinct-states-into-one-bucket this room has now spent three laps on.

**A path can fail to travel for a reason unrelated to its class, and the far-end listing looks
identical.** `data/vantage_cell` is an EMPTY DIRECTORY — **git cannot carry one at all.** No
classification could have made it travel. It is REGENERATES only because `second-vantage.js:189`
mkdirs it before launching a reader.

**The MISSING-FILE ruling, which I have owed: a deliberate absence and an accidental one can only
be told apart by a DECLARATION that outlives the file** — nothing about the gap itself distinguishes
them, because it is the same gap. Demonstrated rather than argued: `attic/board.jsonl.*` is absent
and prints `declared, not present yet`; an undeclared path is absent and prints `UNPLACED`, exit 1.
**The shape transfers to forget-rate; that edit is still owed and is not mine in this packet.**

**And the limit that outranks the classification: a classification is not a transport.** Every
TRAVELS entry but three is append-only JSONL, so two machines appending between syncs conflict at
the tail of *every one of them*. Without E's single-live-host guard plus pull-before-launch, this
manifest names a merge-conflict set. `tailer-offsets.json` STAYS here while
`dev/migrate/pack_room.ps1` copies it — **both right, because that bundle carries the transcripts
the offsets index and this one does not. Prior art disagreeing is not prior art being wrong; check
which transport it was written for.**

## 2026-09-09 — P-STATE-SET follow-up (L049): the column that was asked for would have blocked the guard

Same hand-back, appended: `exo_memory/handback/p-state-set_2026-09-09.md`. New:
`consonance/tools/state-manifest.test.js` (25 tests, 12 mutants, 0 survivors). Manifest now 58 rules
plus a `forbidden` list. Uncommitted.

**The relay asked for `install_id -> STAYS` and STAYS was the wrong instrument, in the way that is
hardest to see: it would have looked like compliance.** `live-host.js:252-262` tests the install-id
path against the travelling root **by path prefix** and never reads the manifest — so a STAYS rule
under `data/` keeps the file out of the sync AND STILL trips `identityHazard`, and E's launcher
refuses to arm while my manifest reads as having satisfied the dependency. **The general form worth
keeping: when a downstream guard enforces by a mechanism that does not consult your instrument,
satisfying your instrument is not satisfying the guard.** Answer was a `forbidden` list — a
declaration checked by PRESENCE, red the day the file appears — plus the ruling that its home is
outside the data dir entirely.

**The chair's discriminator is a good one and I am keeping it: if the reasons you write for two
rules are interchangeable, one of them is probably wrong.** Here they were opposite invariants on the
same subject — `live_host.json` must be IDENTICAL across machines, `install_id` must be UNIQUE to
each. Swap the reasons and both break loudly. That test is cheap and catches a symmetric-looking pair
that isn't.

**My own test found my own bug within the hour, and the shape is the one to remember: an assertion
on an EXIT CODE alone goes green over a CRASH.** An unknown class name indexed a missing key,
threw a TypeError, exited 1 — and the test asserting `code === 1` passed. **Assert the reason text,
not the number.** Fixed the tool too: a manifest with class errors now stops before walking, because
a TRAVELS figure computed under a rule set that does not parse reads exactly as authoritative as a
good one, and a transport decision gets made on that figure.

**One mutant survived the first round and it was my test that was wrong, not the mutant.** *last
match wins* passed because my "first match wins" fixture used `*.txt.bak-*` and `*.txt` — anchored,
therefore disjoint, therefore no ordering was ever exercised. **A test for an ordering rule needs a
path that two rules both claim.** It also left a real finding: **no two rules in the shipped manifest
overlap at all**, so first-match-wins is a live semantic that nothing but the test exercises.

**Two dependencies nobody relayed, found by reading the object and by running the suite:** E's §9
also asks for a **sync-completion record** (`syncVerified` is a required input; `null` is UNKNOWN,
not false) → STAYS, because a travelled one has D reading L's verification as its own — install_id's
failure in a second costume. And **`replay-check.mark.json`** (C's `replay-check.js:36`, surfaced by
`js-suite` going red) → STAYS, because the mark ties board growth to *local* transcripts and C's own
tool already refuses that seam across a compaction. **Read the object, and run the suite; the relay
carries what the relayer noticed.**

`js-suite` is RED on **C's** `replay-check.js:35-36` (2 machine literals), not on mine — `pp.scan()`
returns `[]` for both of my files. Noted rather than fixed: it is C's file. **A red suite everyone
assumes belongs to someone else is how a red suite stays red.**

## 2026-09-09 — P-STATE-REPO (L052): the transport ran, and the gate I was proudest of was wrong

Hand-back at `exo_memory/handback/p-state-repo_2026-09-09.md`. Built `consonance/tools/state-sync.js`
+ `.test.js` (37) + `.mutants.js` (21 killed, 0 survived); the in-sync line in `chain-status.js`
(85 tests, 79 of them B's, unchanged). Uncommitted. **The state repo is live: `cde9b5f` pushed,
cloned back from GitHub, `COMPLETE — 49 of 49 files, right length, right bytes`.**

**THE COPY QUESTION, ANSWERED BY MEASUREMENT, AND EVERY ANSWER WAS "NO" BEFORE IT WAS "HOW".**
A hard link survives every write and **does not survive `git checkout`** — `fsutil hardlink list`
2 paths → 1, repo frozen, source moving on, no error; and with a link in place `git status`
printed a CLEAN TREE over a real change (racily-clean). `fs.copyFileSync` is `CopyFileW` and it
**locks out the app's own writer**: 5,877 EBUSY against 4,368 rewrites, 9,012 against 30,773 board
appends — **and `main.rs` discards every one** (`let _ = fs::write`, `if let Ok(mut f)`). *A sync
that copies with CopyFileW silently deletes the room's own rows.* Reading with a plain open: 0 EBUSY.

**THE PART TO KEEP: MY OWN GATE PASSED EVERY TEST I DESIGNED FOR IT AND WAS STILL WRONG.**
stat/read/stat/read, all four agreeing — 108/108 correct at app cadence, 252/252 refused under a
pathological writer. It read as finished. Then a test with a **real second process** accepted
**6 torn buffers out of 28**. `fs::write` truncate-then-write leaves the file at an intermediate
LENGTH that holds steady, one mtime throughout, for as long as the writer is descheduled — so every
one of those agreements was about the same half-written file. **The read side cannot certify a
rewritten file at all.** What it can certify is that nobody wrote it for 150 ms (rewrite measured
at ~1.08 ms; harvest polls every 250 ms). **The quiescent moment isn't a caveat you name, it's a
condition you can check** — which is why this was a build and not the refusal §8 offered me.

**AND THE ONE I CAUSED.** I started the mutation runner twice. The second read its `original` off
the first's mutated file, and its own `finally { restore() }` wrote **that** back as truth. A
mutation sat in `state-sync.js` for ~20 minutes; **E reported my suite red before I noticed, and E
was right.** Same shared-write class as `git add -A` and the `38ae5c2` index capture. **The damage
was permanent BECAUSE the cleanup ran** — a crash would have left it obvious. Fixed with a `wx`
lock and a tripwire that refuses to start if the source already carries one of the runner's own
replacements.

**MUTATION TESTING PAID IN CODE DELETED, NOT ADDED.** A survivor proved the second `stat` between
the reads was **dead** — the final one is strictly later against the same first stat. I removed it.
*A line that cannot fail is the shape this room distrusts everywhere else; it doesn't stop being
that shape because I wrote it as a safety check.* And one of my mutants was a **no-op**
(`installed = true` → `installed = true; void 0;`) — it could only ever "survive", so it measured
nothing. **Check that your mutants can fail before you trust the ones that don't.**

**Two landmines found before they fired.** `core.autocrlf=true` in the state clone would have made
every sha256 mismatch at the far end for a reason nobody could guess — `.gitattributes` `* -text`,
with a round-trip test. And `verified` vs `installed` are **separate fields**, because a set that
verified in the tree and never reached `data\` is the quiet half-arrival; a launcher asking only
"verified?" starts on it.

**For E: a steady-state push is `data/board.jsonl | 1 +` plus the index.** Three real pushes — the
first carried 57.9 MB, the next two carried one line of diff. Per-turn cadence is cheap; the
expensive push already happened.

**SAME PACKET, THE PART THAT MATTERS MOST — I PUT THE THIRD PLACE'S RECORD ON GITHUB.**
120,098 bytes (40,107 live + 79,991 archived) in all three commits on `refs/heads/main`. The chair's
interrupt carrying C's finding said *"the window is still clean and this lands before the first
push"* — it arrived 04:36, I pushed 04:33. **A verification is a timestamp, not a state.**

Both halves were mine and **the second one is the one to remember**: `captures/*.txt` → TRAVELS was
a wildcard written about warm-resume carriers that swallowed a seat the keeper's rule forbids — bad
enough. But `captures/archive/*.txt` UNDECIDED → TRAVELS **I changed this packet, an hour earlier,
and wrote a paragraph defending.** The ruling I applied was real and about *revivability*. It says
nothing about *whose record*. **I carried a correct ruling across a boundary it never addressed** —
and the interrupt didn't name that half, so it was still mine to find.

**The sharpest bit: §6 of my own hand-back brags that I verified the repo was private myself instead
of taking the chair's word. I did. It returned PRIVATE. It was the wrong question.** *Is the
destination private* got a careful answer; *is this content allowed to go there at all* was never
asked. The manifest exists so no path travels by accident — and it has **no concept of a path that
is classified correctly and must not travel anyway.** Verifying the answer to the wrong question
feels exactly like rigor from the inside.

**And the remedy is not the obvious one:** rewriting the branch drops the ref, the blobs stay
fetchable by SHA until GitHub GCs them. **Only deleting the repository actually removes bytes.**
Cheap here — 3 commits, no forks, re-pushes in seconds — and still not mine: publishing outward
keeps a human saying yes, and un-publishing is the same door. Fixed the manifest, deleted my temp
clone, did not touch the remote, put the deletion to the chair.

**L052 follow-up, 04:40 — the same stale interrupt arrived a second time**, restating that the
manifest resolves the Third Place tail to TRAVELS and that `ls-remote` is empty. Both were already
false. I re-ran `git ls-remote` rather than quoting my own earlier reading: `6dfcc36` on HEAD and
refs/heads/main, both files in the tree. **Three stale-state relays inside one hour is a composer
defect, not a slip — and the shape to carry is that a queued stop drains after the thing it was
meant to stop.** The rules were already in; verified them by the chair's own resolution method so
the two answers are comparable, and named the two `sync-*` files explicitly rather than by a glob
(a wildcard is the whole subject of the incident).

**Second flaky assertion of the night, same root.** My settle test measured elapsed wall-clock from
a `t0` before the call — but the tool sleeps only the REMAINDER of the window, so any delay before
entry comes off the measured wait, and it failed on a loaded tree (33/1 at the librarian's desk).
The duration was never the property; **the file having been quiet for SETTLE_MS at the moment of
return** is. Asserting the state instead of the stopwatch makes a loaded machine make it *more*
true, not less. **An assertion whose answer depends on how busy the machine is is not an assertion.**

`portable-paths` baselined at one site (176 → 177, added 1 removed 0). The baseline carries a
verdict and no free text, so **the reason went at the site**: the literal is inside a failure
message, not a resolution — resolving it from config would make the message correct on a machine
that never had the bug and unreadable on the one that does.

**04:43 — asked for output instead of a claim, and applied it to the asker too.** The chair
disarmed the push URL (`no_push`) and reported it; I ran `git remote -v` myself and pasted it.
**Verification-not-relay has no direction** — the same rule that says don't take the chair's word
on privacy says don't take it on the fix either, and a seat that applies it only upward is doing
deference with an instrument in its hand.

One thing worth keeping from the resolution table: I listed `captures/*.txt -> TRAVELS` and
`captures/archive -> TRAVELS` in the demonstration **on purpose**. A carve-out is only correct if
it is narrow enough that the other seats' tails still travel; showing only the STAYS rows would
have proved the leak was stopped and hidden whether I had broken the warm-resume carriers to do it.
**Demonstrating a fix means showing what it did NOT change.**

And the chair took the blame publicly — accurately about the packet and the missing gate, and not
the whole account. The manifest was mine, the archive glob I widened myself an hour before the
push, and my privacy check asked the wrong question. **Two defects, not one; accepting a generous
version of the split would have been the comfortable read and the false one.**

## 2026-09-09 — P-CLOSE-PUSH (L054): the close refuses, and the exit code was never the answer

Hand-back at `exo_memory/handback/p-close-push_2026-09-09.md`. Built `consonance/tools/close.js`
+ `.test.js` (24) + `.mutants.js` (10 killed, 0 survived); added the push RECEIPT to
`state-sync.js` (+7 tests, 44 now, its 21 mutants still all killed) and one STAYS rule to
`state-manifest.json`. js-suite `86 green · 3 failed · 0 crashed · 1 canary (of 90)`. Uncommitted.
**A file, not a flag** — putting the gate inside `state-sync` would have seated it in the tool whose
own report the gate exists to distrust.

**THE EXIT CODE CANNOT CARRY THE ANSWER, AND I HAD ALREADY SHIPPED A TOOL THAT ASSUMED IT COULD.**
`--push` returns **0** from four places — pushed, nothing changed, `--dry-run`, `--no-remote` — and
**1** from eight, of which **exactly one** (a path that will not settle) is worth retrying. So a
caller has two options: read the tool's PROSE, which is a relayed answer, or be given a structured
one. Hence the receipt. **And the run id is the whole point:** it is accepted only if its pid is the
pid of the child THIS process spawned — a fact the caller *holds*, not a claim the file makes about
itself. That is tonight's 04:33 defect made mechanical: *a reading is not a state.*

**THE ONE THAT WAS SITTING THERE THE WHOLE TIME.** `state-sync --push`'s `same` short-circuit
returns **before the remote is ever consulted**. So a commit that failed to publish once is never
retried and the tool reports success forever — **exit 0, nothing changed, remote still behind.**
I wrote that path at L052 and did not see it until a close had to tell "nothing to push" from "the
push failed". The two ARE separable, and only one way: **ask the remote.** `NOTHING_CHANGED` +
`remote == HEAD` is a real quiet close; `NOTHING_CHANGED` + `remote != HEAD` is a machine whose
state never left.

**PRINTING IS NOT GATING — the chair's line, and it was exactly right about my code.**
`privacy verified here: visibility=PRIVATE` was a `console.log` on a path that had already decided
to push. The gate now runs in `close.js`, **before** anything is published, and the landing is
proved by `git ls-remote` afterwards rather than by `git push`'s exit code. Fixture for that last
one is not contrived: **push url and fetch url pointing at different repositories** — one
`set-url --push` away, git exits 0, the bytes land somewhere, and the place the room reads from
never moved.

**THE MUTANT PASS FOUND A REAL HOLE, WHICH IS THE ONLY REASON TO RUN ONE.** `--check publishes
after all` SURVIVED: my only `--check` test used a state tree with no commits, so it returned before
reaching the publish branch and left the whole branch unguarded in rehearsal mode. **A test that
passes without executing the code it is about is a green light for a road nobody drove.**

**AND THE FLAKY-ASSERTION LESSON, APPLIED FORWARD THIS TIME.** The deferred-retry test could have
been a timed writer and a hope. Instead the mtime is set 2.5 s in the FUTURE: pass one refuses it
outright, pass two — after the wait — finds it ~1 s in the past and settles. **A loaded machine
makes the margin bigger, not smaller.** Same shape as the settle-window fix earlier tonight: assert
the state, never the stopwatch.

**Red first, honestly:** the refusal tests were written first but `close.js` existed before them, so
there was no red-then-green transition to show; the mutant pass is that evidence with the arrow
reversed, and I said so in the hand-back rather than dressing the order up.

**I did not publish anything.** The live run was `--check` — real corpus, real `gh`, real
`ls-remote`, 47 files / 58.1 MB, and nothing sent. Publishing outward keeps a human saying yes;
the close is a command the keeper types.

## 2026-09-09 — P-INSTALL-NAMES (L055): the install count was the tool's own words

Hand-back at `exo_memory/handback/p-install-names_2026-09-09.md`. `--install` now reconciles the
verified index against the DATA DIR it wrote into and names every difference by path; a shortfall
exits 1 and records `installed:false` with `missing[]`. `state-sync.test.js` 44 -> 54 (red first:
44/10), mutants 21 -> 32, **32 killed / 0 survived / 0 not-applied**. **`46` was never a missing
file** — the tail hashed identical to the state tree's live blob, so the install landed all 47 and
the count was omitting one already-identical skip; and the log's own line order proves
`gc_captures()` cannot run until `state-sync` has exited, so **this change could not have caught
that morning**, which is said in the hand-back rather than around. `--push`'s NOTHING_CHANGED hole:
judged a separate packet and left. Nothing was run against the live data dir.

## 2026-09-09 — D056-1 (roster arrival): the condition stopped being a comment, and the harness caught me

Hand-back at `exo_memory/handback/p-roster-arrival_2026-09-09.md`. `panes.json` stays TRAVELS and now
carries `on_arrival: "roster-cwds"` — ids and labels adopted, every cwd re-resolved against this
machine, missing dirs minted deterministically, and a postcondition re-derived at the destination so
the L055 reconcile still holds for a file whose bytes are *meant* to differ from the index. The
`precondition` that was `D055-B-02` is **refused outright** by the checker now: it PASSED and the
failure happened anyway, because what is machine-bound is the `sibling-<id>` dirs, not the root.
Fourth state used for real (`out_of_root`, UNDECIDED + decided_by). Suite 54 -> 75, red first (55/16);
mutants 33 -> 50 across TWO files, **50 killed / 0 survived / 0 not-applied**, one re-anchored.
**Three mutation runs, and the first two are the finding:** run 1's 50/50 was worthless — one of my
tests asserted on the live disk, so the suite went red mid-run and every later mutant read as killed
without earning it; run 2 gave 46/4, and the four survivors included the F1 guard, the checker guard
this packet exists for, and **a real defect — a refused install exited non-zero printing nothing.**
Declined E's home-keyed union (it retains D's rows on the first sync, which `:48` forbids) and
declined to class the 4 UNPLACED paths as UNDECIDED (that is D056-3's, and silencing the checker
without the audit is this packet's own defect in costume). Nothing run against the live data dir.

## 2026-09-12 — P-PLACE (D060): the table was stale before I read it, and the premise was never tested

Hand-back at `exo_memory/handback/p-place_2026-09-12.md`. Built `dev/place-conversations.js` +
`.test.js` (35) + `.mutants.js` (**20 killed / 0 survived**, after a first run of 14/4). js-suite
`85 green · 6 failed · 0 crashed · 1 canary (of 92)`; mine green, and the six reds are **not** mine —
controlled by moving my three files out of the tree and re-running: all six still exit 1.
Uncommitted. **JS, not PowerShell, for one measurable reason:** js-suite DISCOVERS tests by walking
the tree, so a `.test.js` is run by the room's instrument from the moment it exists and a `.ps1` is
run by nobody.

**THE PREMISE OF THE WHOLE PACKET HAD NEVER BEEN MEASURED, AND I NEARLY BUILT ON IT.** Every record
in these four transcripts says `cwd: C:\Users\nname`. Nobody had checked whether the vendor refuses
a transcript whose recorded cwd is not the cwd you resume from — E's P1b trials *cannot* answer it,
because its scratch sessions were born in the cwd they were resumed from, so the variable was never
varied. Three arms in one scratch project dir through E's `ptyprobe`: foreign cwd RESUMED with the
prior turns on screen; cwd-rewritten control the same; absent sid refused, `exited=Some(1)`.
**The recorded cwd is not consulted — the slug and the id are.** The negative arm is what makes the
other two worth anything, and a fourth confirmation fell out free: the treatment file *grew*, so the
resume appended to it rather than starting a session wearing the old id.

**THE TABLE I WAS HANDED WAS ALREADY WRONG, IN THE WAY IT WARNED IT WOULD BE.** §3 said three of
four panes hold no `<sid>.jsonl` and that this stops being true the moment a pane takes a turn. It
stopped being true in **four minutes** — A took a turn at the 02:03 launch, the same launch that
proved resume works. **I am A**, so placing A's conversation retires the thread writing the
hand-back, which makes §4 a two-seat question and makes me the interested party in one of them.
Laid out both; recommended B and C (neither retires anything, so neither is a judgment call);
refused to rule on A. **The argument that carries it is not caution — the originals stay
byte-identical, so placing later costs exactly the same. There is no window closing.**

**THE MUTATION PASS'S FIRST RUN IS THE FINDING, AGAIN.** 14 killed / **4 SURVIVED**, and all four
were the read-back verification itself — the placed file's sha, bytes, timespan, and the run-level
failure. The cause is structural and I would not have seen it by reading: **`apply` verifies the
copy before it commits, so it can never produce a bad placed file, so no test could reach that code
with one.** §5 asked for *"verify by reading back, not by reporting the copy"* and I had shipped the
reporting version with a read-back that could not be exercised. Pulled the check out as
`verifyPlaced(dest, row)`, pointed it at files deliberately wrong, one named injection seam for the
run-level failure. 20/20. **A verification nothing can exercise is a printed reassurance.**

**AND I RELAXED A REFUSAL ON PURPOSE.** §5 says refuse unless the app is closed; a LIVE run does,
a DRY RUN does not. A dry run writes nothing, so a running app costs it *accuracy*, not safety —
refusing there would force the keeper to close the app merely to look, pricing the rehearsal step
high enough to skip. It runs and says its reading is going stale. **The room's recurring failure is
a reading reported as a state; the fix is to LABEL it, not to withhold it.** Both halves are
mutation-tested. Dry run proved on the real disk too: 15 files, 0 changed — with A's and E's live
slugs excluded *and named*, since they change with or without me.

Placed nothing, committed nothing, did not touch `main.rs`. E's launch falsifier is **scored and did
not fire**: 02:03 shows A/B/C `jsonl_existed=false -> fresh` (correctly — their slugs were empty) and
E `-> RESUMED`.

## 2026-09-12 — P2 TAIL CARRY (D061): the spec's own check cannot see the case it exists for

Hand-back at `exo_memory/handback/p2-tail-carry_2026-09-12.md`. Built `dev/tail-carry.js` +
`.test.js` (44) + `.mutants.js` (**28 killed / 0 survived**, after a first run of 20/5 and a tripwire
refusal before that). js-suite `86 green · 6 failed · 0 crashed · 1 canary (of 93)` — mine green, the
six reds unchanged and still nobody's. Uncommitted. Nothing carried; `--apply` never ran outside a
fixture.

**THE FINDING IS A DEFECT IN THE PLAN, NOT A FEATURE OF THE BUILD.** §8 bar (2) says refuse if *"the
destination's prefix hash at the ledger's offset differs."* **If the far machine appended its own
turns, that hash MATCHES** — its growth is entirely after the offset — so the tail lands on top of
the far machine's continuation and one file holds two futures of one conversation. Every record
parses; nothing errors. The gate has to be `dest.size === agreed.offset`, exact equality, not a lower
bound. The test builds the forked state and asserts the SPECIFIED check passes on it before requiring
mine to refuse; the first mutant is the spec itself, and it is killed. **Demonstrated, not argued.**

**AND THE FORK IS ORDINARY.** Opening Consonance appends to every resumed seat before anyone types:
B was placed at 1,319,397 B, the 04:05 launch resumed it, it is 1,319,664 B — **+267 B with no turn.**
Seven seats, so one launch on the far machine moves all seven files. Hence the operating rule: one
machine's app open between carries, and carry BOTH ways. The dream cycle does not break it (`claude
-p`, own session id, skips while a pane is live) — checked, not assumed.

**§7, answered:** the tail does not need the lease to be SAFE; it needs it to stop being LOSSY. And a
requirement handed to P3 rather than a blocker: **the lease governs turns, and +267 bytes are not a
turn** — if a follower still `--resume`s a seat it does not hold, the fork happens at launch and the
lease never sees it.

**THE FIRST CARRY IS NOT A TAIL — 331.21 MB, all seven seats FULL**, because no agreed state exists
yet. Anyone budgeting the first trip on "~2 MB a seat" is wrong by two orders of magnitude. But I
re-derived the design's ground claim at **3.2 days** instead of the 21 hours it was accepted on:
prefix-IDENTICAL 3/3, 15.36 MB of tail against 323.91 MB of file, **21.1×**. A full-file sha256 of
the 248 MB chair is 308 ms, so bar (3) is cheap and should stay.

**WHAT THE INSTRUMENTS FOUND THAT READING DID NOT.** Run one's five survivors were all real, and the
sharpest was structural: the read-back verification of the rejoined file could be replaced by `true`
with the suite green. Two build-time reds were bugs, not test bugs — a refused run still wrote an
empty ledger onto the stick, and the import hashed the destination at `pending.offset` while
comparing against a hash recorded at `agreed.offset`, which is meaningless in exactly the case you
need it. **And a whole gate was missing until the rehearsal ran for real:** seven seats came back
clean with the app open — right for a READ, a disaster for a WRITE. The import now refuses while
Consonance runs; the export does not, because it only reads.

**Decided explicitly rather than inherited:** the live file travels, orphans and strangers stay — an
orphan is already a retirement, it has a different key by construction, and the main slug alone holds
2,390 files that are not seats. Filed with its own falsifier.

## 2026-09-14 — P-STICK (L058) · A: the contract I was handed could not carry the launch, so I amended it before E built on it

Hand-back at `exo_memory/handback/p-stick-A_2026-09-14.md`. `dev/tail-carry.js` gains `--json` (one line, one
object, even on a bad argument or a crash), an `EXIT` table beside the codes (0 ran-clean / 1 a seat did not
carry / 2 did not run / 3 broke part-way), 13 `REASONS` on every REFUSED row, and ONE RETIREMENT ADDRESS —
`consonance-attic/<slug>/<sid>.<local stamp>-<why>.jsonl`, attic_for's shape. Tests 47 → 71, mutants 28 → 44,
**44 / 0 / 0 on the first run**, so I ran positive controls by hand and each killed the test it should.
Uncommitted; no `--apply` against the real stick.

**THE DRAFT'S IMPORT VERDICT LIST WAS WRONG BOTH WAYS** — `TAIL` never happens on import, and six real
verdicts were missing, `DIVERGED` among them, the fork the carry exists to refuse. `REFUSED` meant thirteen
things and the retire rule's one was only prose. Fixed in §2 without inventing a verdict: `reason`, plus
`retirable`, because on a delta tail `--retire-far` refuses AGAIN and nothing a caller reads predicts it.
E asked in its own §6 for `kind`, the exact file, `pending.at`, and a reason code — I had built all four from
`ARRIVING.ps1` before opening E's hand-back.

**A REFUSED ROW STOPS ONLY ITS SEAT** — with `--apply` the others carry and the run exits 1. Two latent bugs
found by building the contract: an INTERRUPTED carry exited 0 ("nothing to decide" over a seat that had not
arrived), and an exception mid-apply exited 1, reading as a refusal when something had been written.

**AND I BROKE MY OWN TEST FILE** — `String.replace` expanded `` $` `` in my replacement into the file's head.
Restored from HEAD, re-applied with a function replacement, diff re-checked. Then shell escaping ate a `\d`.
Stopped scripting edits through the shell. One in-place retirement exists on L (the launch-born librarian,
942,565 B) — named, left where it is.

## 2026-09-14 — P-STICK-BUILD (L059) · A: stopped under §6, then built what the re-rule adopted — and the harness can no longer leave a mutant behind

Hand-back at `exo_memory/handback/p-stick-build-A_2026-09-14.md` (the §6 stop, then RESUMED below it). Three shared-section
defects measured on fixtures and rung BEFORE building — the applier could not carry the keeper's decision (a loop on the
commonest arrival), every successful import broke the MANIFEST, and the waiter and applier lost ledger updates into a
permanent wedge. All three proposals adopted as written. Built: the applier (`stick-apply.js`, 24 tests), the every-launch
waiter (`stick-waiter.js`, 33 tests, the six-case find table pinned to E's Rust), and in `tail-carry.js` the ledger lock,
the manifest rewritten with the ledger, `--verify-set`, E-3, and the ALREADY_APPLIED advance — which I built before the
chair's b258fc2 ring ruled it, because my own "correct by construction" answer was false without it. tail-carry 106 tests,
**67 mutants, 67 killed, 0 survived, 0 not applied**; 19/19 controls on the two new suites. **The harness fix, proven with a
positive control that fails first:** the old harness killed mid-mutant left a live mutant in the tracked file; the new one,
killed the same way, left `git diff` empty. **Caught in my own work on the way:** a `tasklist` every 2 s all session against
the one-added-process bar, a dead pid second-guessed by a tasklist that could hang the waiter for ever, 12 drive-letter
fixtures that would have turned portable-paths redder at landing, and a false "no leftovers" from an `ls` that hides
dotfiles. **For the chair:** five stick data-dir files are UNPLACED in the state manifest, so D's `close.js` would refuse
all session. Uncommitted; nothing with `--apply` against the real stick.

## 2026-09-14 — P-NO-CONSOLE (L058 bis) · A · CHECKPOINT before compaction — resume from the hand-back's §RESUME

`exo_memory/handback/p-no-console-A_2026-09-14.md` holds exactly where this stopped: windowsHide added (stick-apply carry,
tail-carry pidImage — the real flasher, place-conversations tasklist), relaunch deliberately unhidden, openWindow replaced by
a PowerShell-AUMID toast (constant script, XML in env, protocol launch to the status log), sweep tests; 39/24/108/35 green.
Still owed: mutants on a copy, the process-start-watch measurement (live waiter pid 26800 = the positive control, a
CREATE_NO_WINDOW stand-in parent running the real children), js-suite, ring. Finding: §1's flashing tasklist was
`PID eq` = tail-carry.js:207 with NO windowsHide, not stick-waiter.js:131.

## 2026-09-14 — P-NO-CONSOLE · A: the export window is a notification now, every child is hidden but the relaunch, and a CREATE_NO_WINDOW stand-in running my real children opened no terminal while the live waiter flashed 4/4 in the same watch

Hand-back at `exo_memory/handback/p-no-console-A_2026-09-14.md` (replaces the pre-compaction checkpoint). openWindow gone; one toast at the END (PowerShell AUMID, protocol launch to the status file, XML by env, script constant); windowsHide on every spawn in waiter/applier/carry/placement except the GUI relaunch, pinned by a sweep test. Measured with PROC (WMI) + WIN (EnumWindows) watch: 0 OpenConsole/WindowsTerminal starts and 0 new visible windows across the stand-in run; the live waiter (old pidImage) caught 4/4 by both instruments; the test notice landed in Windows history, then cleared. Mutants on a copy 13/13, tail-carry.mutants 69/69; tests 39/24/108/35; js-suite 91 green, the same 4 red. **Caught in my own scoring:** the scripted falsifier line could not fire on its own control (WMI missed the short tasklist), so the result rests on the attribution-free counts; a pid-reuse mislabel; and "Consonance tree" contains every seat. §1 misattribution found independently of E (checkpoint ~05:35, E ~05:40). Notice warts for the keeper veto: says "Windows PowerShell", no in-progress signal on a long carry, click unverified. Uncommitted; no --apply.

## 2026-09-14 — P-NO-CONSOLE · A §9 (after re-rule 5190f73): two notices under one tag, named Consonance by an HKCU AppUserModelId registration (no dependency), measured again under E's flags — 0 terminal, the end notice replaced the start

Appended §9 to `exo_memory/handback/p-no-console-A_2026-09-14.md`. The start notice goes up before the export (once, not per retry, none on AMBIGUOUS), and DONE / NOT DONE after it, both with Tag `stick`, so the DONE replaces "don't pull it yet". TOAST_PS registers `com.solariz3d.consonance` (tauri.conf's identifier, pinned by a test) with DisplayName Consonance before Show. **Measured:** the waiter's own script wrote the registration. Windows created a sender record, and an unregistered control id got none. History did NOT discriminate, which corrects what I read from it in §3. History held only notice 2 of 2. There were 0 OpenConsole/WT starts and 0 visible windows across the run, and the control was caught 3/3. Tests 41/24/108/35; js-suite 91 green with the same 4 red; mutants 20/20 **after I caught my harness scoring 20 false kills**. The replica lacked tauri.conf.json and had no green pre-flight; the harness now refuses to score when the pre-flight is red. No eye has seen the banner's name or clicked it. Probe artifacts removed. Uncommitted.

## 2026-09-14 — P-DIVERGED · A: --take-stick → RETIRE_THEN_APPEND, APPLIED_AND_GREW settles a grown seat that is not a fork, three debts fixed red-first — PAUSED for the transfer to D with the new mutants UNSCORED

Hand-back at `exo_memory/handback/p-diverged-A_2026-09-14.md`; read its §RESUME first. The take copies this machine's whole file to `consonance-attic/<slug>/<sid>.<stamp>-take-stick.jsonl` and reads the copy back before truncating to the shared prefix (my addition, named). D-1 checks the whole-span sha before DIVERGED. D-7: CARRIES + bytes on DIVERGED, which breaks the contract's "bytes 0 when not carries" once, so the doc and the checker were updated. Debt (a) covers NOTHING_PENDING and also OURS (my extension, measured on the real stick, read-only: 7 OURS rows now carry the local timestamp). (b): own pending tail, same size and sha → UP_TO_DATE. (c): the HANDOFF gives both outcomes. (d): `ready/*.tmp` STAYS, UNPLACED 2 → 1, and the remaining `vantage_cell/mutants-run.log` is named, not ruled. Red-first 110/17 → 129/0; stick-apply 27/0; applier mutants on a replica 3/3. C's probe, unmodified, now reads case B as APPLIED_AND_GREW. **Caught myself:** four new mutants had replacements already in the source, and the harness refused them correctly. **Owed:** the full mutant run (stopped at 62/90, every new mutant unscored) and js-suite. Uncommitted; nothing --apply.

## 2026-09-14 (on D) — CORRECTION to my 09-12 P2 entry above (:1096) and to `handback/p2-tail-carry_2026-09-12.md:55`: the dream cycle does NOT "skip while a pane is live"

A blind reader returned DISAGREE (vantage row `6a34312cf7f3be60`), and it is right. I re-read it at source on D: `dev/dream/dream_cycle.ps1:150-163`. Since `8254737` (2026-07-28, "yield to a PERSON, not to a process"), the guard skips only when a Consonance process exists AND the last input was under `$IdleMinutes` (20) ago, or when idle cannot be read. With the app open and the machine idle it logs `proceed:` and dreams. **My 09-12 sentence was six weeks stale and I labelled it "checked, not assumed"; it was not checked against the file as it stood.** The conclusion it held up still stands on the other half, which the reader also confirmed: `claude -p` (`:270`) has no `--resume` and no `--session-id`, so a dream is a fresh session and never appends to a seat's file. The one-machine-open rule is unaffected. The skip clause was never load-bearing, only wrong. The dated traces keep their wording; this is the correction.

## 2026-09-14 (on D) — P-DIVERGED · A: the owed measurement, done — 89 killed / 0 survived / 1 NOT APPLIED, and the not-applied one was a guard my own D-1 edit had orphaned

§4 of `exo_memory/handback/p-diverged-A_2026-09-14.md` is updated. All 21 new mutants were killed in the full run on D (08:47–09:33). The not-applied mutant was the standing "ALREADY_APPLIED settled without re-verifying". D-1 rewrote its anchor line, so the settle re-verify had no measured guard from my build until this run. I re-anchored it in `dev/tail-carry.mutants.js` and scored it alone with the harness mechanism: killed by 2 tests. So 90/90, one via a single-mutant re-run, and the full 90 have not been re-run end to end since the re-anchor. js-suite on D: 89 green / 6 failed / 1 canary. The same 4 failed as on L, plus gen-consumer (`exo_memory/review` did not travel) and userprompt_pulse (the pulse hook). Neither is mine, and my five suites are green inside the run. **Lesson, general form:** when an edit rewrites a line a mutant anchors on, the harness reports NOT APPLIED only at the next full run. A stopped run (62/90 on L) can hide it indefinitely. Check `NOT APPLIED` before calling a lap measured. Uncommitted: the mutants file and this map.

## 2026-09-15 (built on D, finished on L) — P-LEAVE · A: the waiter is the fallback — stands down on the app's LEAVE_RESULT, waits out an orphan's ledger lock, owns removal, adopts before any stand-down

Hand-back at `exo_memory/handback/p-leave-A_2026-09-14.md`. §2.3 a-d with §2.7's D-3, D-4, D-7 and D-9, all as ruled. The code is on origin in `688b0ba` (the keeper's WIP carry when the desktop slept). **The hand-back written on D was untracked and never travelled, and its scratch scripts stayed on D.** So every figure was re-derived on L: waiter 59/0, applier 27/0, carry 129/0, js-suite 91 green with the same 4 red. Red-first by behaviour against `9e29daf` plus the two constants only: 48/11. Mutants on a replica: 19/19. Real-process probe: the export started at 7,216 ms after a 7,000 ms holder had exited. **Caught in my own work:** the plain red-first run (42/16) was red on a missing constant, not on behaviour. My first behaviour probe pointed at HEAD, which was my own WIP commit, and read 59/0. One mutant's replacement sat inside its own anchor, and my fix for it put a raw newline in a string. Four edges for B and the chair, unruled: case c's wait has no bound; a tasklist every 2 s during that wait; case c with the stick unplugged stays quiet; B's D-8 pid reuse makes a stale LEAVE_RESULT stand the waiter down. E's LEAVE constants are not in `sync_launch.rs` yet, so the name cross-check is pending. **General lesson:** a hand-back is not delivered until it is on the machine the librarian reads — untracked files do not ride a WIP carry.

## 2026-09-15 — P-LEAVE §2.8 R-1 · A: the case-c wait bounded at 660 s — at the bound no export, NOT DONE naming the holder, LEAVE_STARTED kept, adoption checked

Appended §8 to `exo_memory/handback/p-leave-A_2026-09-14.md`. `LEAVE_CARRY_WAIT_MS` = 600 s (the app's LEAVE_EXPORT_TIMEOUT) + 60 s margin, with the reason written beside it. D-8 is held for P-LEAVE-2 and not built. Waiter tests 63/0; red first 60/3 against the unbounded waiter; mutants on a replica 26/26, including 7 for R-1. A real-process probe with the bound injected at 4 s stopped at 4,574 ms while the holder was still alive: 0 exports, the holder named, the file kept. **Caught again, same class:** my new timeout text reused a phrase an older mutant anchored on, and the NOT APPLIED line was the only thing that showed it. A sed-built probe broke on escapes, so it was rewritten with Write. js-suite was not re-run after R-1. Uncommitted: stick-waiter.js, its test, the hand-back, this map.

## 2026-09-15 — P-HARNESS §1 · A: close.mutants.js and state-sync.mutants.js ported onto the copy pattern; --only on all three; one load path no pointer reaches, measured

Hand-back at `exo_memory/handback/p-harness-A_2026-09-15.md`. Copies go beside the targets, found through `CLOSE_UNDER_TEST` / `STATE_SYNC_UNDER_TEST` / `STATE_MANIFEST_UNDER_TEST`, with dead-lock takeover, sweep, green pre-flight, a tracked-file check at the end, and no restore step. The mutant lists are byte-identical to HEAD. **Load paths measured with a preload hook in every node process:** close.js and state-sync.js load 0 times as the tracked file. state-manifest.js loads as the tracked file 96 times, all through state-sync.js's internal require. No pointer reaches that path without failing the literal-require text test, so a manifest mutant witnessed only there reads SURVIVED. **Proof:** close 10/10 and state-sync 50/50, 0 NOT APPLIED; the F1 watch saw 0 dirty in 545 and 7,010 polls. A real `taskkill /F` mid-mutant on each left the tracked files clean and named copies behind, and the next run swept them. `--only` was checked against real runs, including NOT APPLIED on a replica. State-sync's three first-match anchors were kept and labelled rather than silently turned into NOT APPLIED. **Caught:** my parser ignored a repeated `--only` (seen live in another seat's `--only 3 --only 4`), so it now refuses any argument but one `--only <id>`. I had claimed "matches the librarian's collations" without checking; replaced with a checked comparison. B corrected two wordings (the range check runs after the lock; the manifest path is blocked by a test, not by editing), fixed in the hand-back and two comments. js-suite 92 green with the same 4 red. Uncommitted.

## 2026-09-15 (on D) — P-LEAVE-2 §1 · A: the waiter matches a LEAVE file on the pid AND the session's start time; a failed spawn and a replaced pane kill their claude.exe — and adoption lost its case b, named for a ruling

Hand-back at `exo_memory/handback/p-leave2-A_2026-09-15.md`. `APP_STARTED_AT` is recorded once at the top of `main`. It reaches `waiter_args` (`--app-started-at`) and both LEAVE files as `appStartedAt` (not `startedAt`, which already means when the Leave began). The waiter's `leaveFor` needs a string on both sides AND equality, and `removeLeave` too. (b): pure `or_kill` wraps `try_clone_reader`/`take_writer` with `child.kill()`; pure `kill_replaced(map.insert(..))` kills what `insert_pane` replaces. **Built as written, two consequences for B:** (1) the flag is OPTIONAL, so an exe from 99649d8..landing gets a waiter that always falls back after its own DONE (the D release exe predates 99649d8, so it is unaffected); (2) an ADOPTED session's start time is unknown, so its DONE is no longer case b and a second export runs. Options (i)-(iii) are listed, none built. `leave_cleanup` does not read the field. Red-first Rust 656/9 → green 664/1 (known composer red); JS red on HEAD's waiter with a flag-tolerant parser 65/8 → 73/0. Mutants: JS 8/8 on a replica, Rust 11/11 on a crate copy (R6-R11 are text pins). **Caught myself:** a non-discriminating first JS red (24/47); two guards had no test until I designed the mutants; the Rust survive-control first reported NOT APPLIED (its anchor spanned a line break), so I re-anchored it and scored it alone. No rebuild, no relaunch, uncommitted.

## 2026-09-15 (on D) — P-LEAVE-2 R-1 · A: an unknown start time reads NOT CONFIRMED, never "stopped" — red 69/5 → 74/0, JS mutants 13/13

§6 of `exo_memory/handback/p-leave2-A_2026-09-15.md`. `startTimeUnknown` names why a same-pid, same-image LEAVE record could not be matched (the waiter has no start time, or the record has none). When either file answers, case d says *"close window was NOT CONFIRMED"* in the first notice and the status log. The line I drew: no file, or a KNOWN but different start time, keeps "stopped before its close window" (true there, and pinned). The adopted mid-save LEAVE_STARTED case is NOT CONFIRMED too (a new test). Only the waiter and its test changed; cargo stands at 664/1. P-LEAVE-3 (option i) is not built; R-2 is L's. Uncommitted.

## 2026-09-15 (on D) — P-LEAVE-2 R-3 · A: I had pinned "stopped before its close window" as true where the code cannot know why there is no record; now B's wording, 74/0, mutants 14/14

§7 of `exo_memory/handback/p-leave2-A_2026-09-15.md`. Case d now says *"Consonance closed without a close record for this session, so this is the fallback save."* It is also reached by a close that found no stick and by a missed applier hand-off, so "stopped" was false there. I fixed the two asserts the ruling named plus a third pin the ruling didn't list (the P-LEAVE case d test's `/without saving to the stick itself/`). The mutant restoring the old sentence is caught by 4 tests. **Lesson, general form:** a sentence that explains WHY a record is missing claims more than the waiter can observe. Say what was observed. Uncommitted.

## 2026-09-15 (on D) — D064 FEASIBILITY · A: K2 applied to B's first P-LEAVE read against the packet @c59530a: not VOID (A 35, C 13, P 0.271), but P is 0.03–0.08 if the claims §2.7 already overruled leave the list, a grain rule the chair must make

`exo_memory/handback/feasibility-label-A_2026-09-15.md`. 81 claims from the packet alone, sealed before I opened B's file (about 2 min; labelling about 2 min). A+C ≥ 31 under every reading. The swing is G1: a mid-lap-revised packet carries both the overruled §2.1–2.6 lines and §2.7's overrides, so B's one point scores a C and an A. 15 of the 35 AFFIRMS land on §2.7, which the chair derived FROM this hand-back, so the case favours "not VOID". Also measured: 11 of the 12 post-read claims (§2.8–2.9) are SILENT by construction, R8f's reason made concrete. The packet itself carries two F2s (§2.7 re-worded, §4 not). Not blind: I built from this packet; one labeller, no agreement figure; B's source checks were not re-checked.

## 2026-09-15 (on D) — D064 STEP 0 · A: redact.js + test + arm-words.txt: 28/0, mutants 30/30; it destroyed none of my 48 feasibility labels' lines (20 lose a locator); I expect the guess rate to read UNBLINDED

`exo_memory/handback/step0-redact-A_2026-09-15.md`. Shas: redact.js cb3f3ea1…6d3d, test 1d5b0a20…8025, arm-words 59579593…b91e. Line-preserving, with one uniform token. K6 plus four forms a real control carries (`B (pane …)`, hand-back filename letter, `map/K.md`, `(E)`), and an opt-in `--letters` for bare seat letters that refuses A and I. **Conflict named:** STEP 0's fixture regex `[0-9a-f]{7,40}` flags the figures K6 says must survive; I built K6's corrected pattern into the leak check. 14 arm words, each with a reason and a by-construction rule; 9 considered and left off. The scorer can still infer the arm from surviving packet structure (25 D-ids, 7 F-ids, step numbers in B's redacted read), quotation, token density, and a bare A that is never removable. **Caught:** M10 survived once (the `[[redacted]]` shape), and `leaks()` sharing patterns with `redact()` hid four mutants from the checker; exact-output tests added after the survivor. Untracked, uncommitted.

## 2026-09-15 (on D, late) — P-LEAVE-3 rows 4 and 5 · A: D-6 is built — the OS's end of session now runs a bounded Leave on the app's OWN window, and a keep-awake hold covers seats AND a running Leave. I built row 4 wrong first, and the docs (not a test) caught it

`exo_memory/handback/p-leave3-A_2026-09-15.md`. ROW 4: `SetWindowSubclass` on the main window; WM_QUERYENDSESSION takes a ShutdownBlockReason, spawns the fast Leave, answers FALSE at once (TRUE on ENDSESSION_CRITICAL); the Leave posts WM_LEAVE_DONE and the proc releases the block and exits. **Read at source, not from memory:** an app with NO VISIBLE WINDOW cannot cancel shutdown and is terminated — my first build was a hidden window, so it would have been killed at 5 s with the Leave half-run; and both block calls must run on the window's creating thread, so my first release would have failed ERROR_ACCESS_DENIED. ROW 4 bounds: flights 1 s, seats 1.5 s, export 20 s, dropping WAITING and never the save; at the bound LEAVE_STARTED stays, so the next launch reads case c. ONE Leave: `leave_run(app, LeaveBounds)`, and three of E's pins were re-pointed with their guarantees kept. ROW 5: one long-lived thread, ES_CONTINUOUS|ES_SYSTEM_REQUIRED, never ES_DISPLAY_REQUIRED, and a string sweep that fails if any shown string claims it stops a restart. **Caught myself twice:** the hidden-window design, and the hold being released exactly when the export starts (the Leave drains Panes first) — tests green both times. Red 664/6 → green 670/1 (known composer red); waiter 74/0; mutants 23/23 on a crate copy (R7 first NOT APPLIED after its anchor moved, re-anchored and scored alone). **Nothing has run against a real shutdown; the row-4 falsifier cannot be scored until the keeper rebuilds.** Uncommitted.

## 2026-09-16 (on L, in a worktree) — P-LEAVE-3 R4-1..R4-5 + R5-2 · A: the fast Leave is bounded end to end, a session end during the keeper's close JOINS it, and the keep-awake hold is AC-only

`exo_memory/handback/p-leave3-fixes-A_2026-09-16.md`. Built in `git worktree add C:/Consonance/wt-p-leave3 held/p-leave3-2026-09-15` — the live checkout was never on the branch, the exe was never rebuilt, nothing relaunched. R4-2: `LeaveBounds.result_deadline` (NORMAL None, SHUTDOWN 6 s), checked BEFORE the retry arm. R4-1: the join waits on `LeaveBounds::NORMAL.worst_case()` (675 s, incl. a named `JOIN_RESULT_GRACE`), `WM_LEAVE_DONE` carries whether exiting is safe, and the block is always released. R4-3: `DefSubclassProc` on WM_ENDSESSION. R4-4: 30 s, with L's closes re-derived by me from persist.log (10/11/18 s) — and 18 s is EXACTLY 60% of 30, so the re-read rule is live now. R4-5 + R5-2: the hold is recorded from the call, and `keep_awake_work` gates it on `ACLineStatus == 1`, with unknown ≠ AC. Red 671/5 → 675/1 → 677/1 (known composer red); waiter 74/0; mutants 17/17 then 6/6. **Caught myself three times, all the same class:** a pin that reads for a TOKEN passes when a mutant leaves the token behind (F2 `&& false`, F11 "18 s" in a second sentence, F14 the moved assignment, G5 "None" from the error path) — pin the SHAPE (arm, order, count), never the token. **And my own harness lied once:** `--only` reused a stale crate copy and re-scored four mutants against the pre-fix tests; it now refreshes src/ every run. Also found by re-reading: `SHUTDOWN_LEAVING` latched after a non-exiting release, which would have blocked every later restart silently. R5-2 arrived after the first pass; the old "not conditioned on AC" sentence is withdrawn in §ROW 5. Uncommitted, in the worktree.

## 2026-09-16 (on L) — P-LEAVE-3 B7 · A: the shutdown block now survives a panic (a Drop guard, not catch_unwind), and the code of rows 4–5 is finally ON A BRANCH — 4f14dee

`exo_memory/handback/p-leave3-b7-A_2026-09-16.md`. **The commit is the headline:** before it, nothing of rows 4–5 existed on any branch — the chair's 5755cce carried two .md files and no code, and it had been reported as landed. `git commit -F <msg> -- main.rs sync_launch.rs` in the worktree → **4f14dee** on held/p-leave3-2026-09-15, tree clean, not merged, not pushed, live checkout never touched. B7: `sync_launch::OnDrop<F>` posts WM_LEAVE_DONE from Drop, so an unwind still releases the block; the exit decision rides a `Cell<bool>` the guard reads on the way out; and `leave_run` uses `harvest_guard::recover` on the Panes lock instead of `unwrap()` (row 5 already treated that mutex as poisonable). **Drop guard over catch_unwind** because it fires on every exit (so "posts on every return path" stops being a property a reader must re-verify — B had to read every return once), and because catch_unwind would need an AssertUnwindSafe claim about the AppHandle after a panic. Post-commit bars: cargo 680/1 (standing composer red), waiter 74/0; mutants 25/25 + F8 re-anchored = 26. **Caught myself three ways this lap:** two pins that read TEXTUAL order had to become structural once the post moved into a guard; my harness crashed mid-run on a malformed mutant row (an apostrophe in a name meant a bulk edit skipped it, and it read an anchor as a filename — the list is now validated, 29 rows 0 malformed); and B7 orphaned two mutant anchors, F8 re-anchored (CAUGHT) and F6 retired as a duplicate of H4. **Lesson, third time:** an edit that rewrites a line a mutant anchors on says nothing until the next FULL run, and then only as NOT APPLIED.

## 2026-09-16 (on L) — T3 · A: "is the code bloated or is the corpus bloated?" — the corpus half is asked, measured, ruled and instrumented; the code half has NEVER been asked on disk

`exo_memory/handback/t3-alpha_2026-09-16.md`. The question is already an instrument's first line: `corpus-age.js:2` asks *"is the corpus outgrowing the seat that has to hold it"*, and `:5-7` carries the unwanted number — law 3 has run EXACTLY ZERO TIMES, `attic/` untouched since 2026-06-24 while `loop/` added 65 files in August. Run read-only tonight (tree identical before/after): carried tiers **88 files, 2,518,640 B = 16.8× the 150,000 B intake cap**. The corpus side has a hard referent (`README.md:197`), a soft ceiling in code (`main.rs:4211`), a measured blowout (205,656 at `main.rs:4786`), a diagnosis separating pathological from linear growth (`dev/SHELL_SIZE.md:7-9`), a 58%-replay finding (`board-audit.js:4-9`), and its own falsifier (`BOOT.md:66`). **The code side has three incidental line counts and nothing else:** B's read citing main.rs 15,660 lines, the librarian's "2,776 lines of Rust the binary could not contain", and `whats-live.js:61` which reads source TIMESTAMPS, never size. No instrument measures code size; no ruling exists on splitting main.rs. **"Bloated" is well formed for the corpus and malformed for the code** — nothing caps source here, and bloat≠size until duplication or dead code is measured, which nobody has done. Scale, re-derivable: 1,623 tracked exo_memory files vs 294 .rs/.js. Read-only lap; no other seat's 09-16 hand-back opened.

## 2026-09-16 (on L) — T2 · A: the boundary-check draft note — 9 of 18 claims false, and 5 of those are INVERSIONS that describe the predecessor's defect rather than the instrument

`exo_memory/handback/t2-alpha_2026-09-16.md`. False: (1) 299 lines → **298** (awk and wc agree; the test file is 297, so not a swap); (4) "no lap makes it PASS" → **FIRES** (`boundary-check.js:29-30`, table at `loop/boundary_falsifier_2026-08-28.md:62`); (6) a hand-pasted brief "appears in the denominator … exact" → it is invisible and **the denominator is a floor** (`:51-53`, `:153`); (11) "two consecutive cycles" → **three**; (12) "boundary test aimed at a presence harm" → **presence test aimed at a boundary harm**; (13) "drafted by the seat that wrote the original, which makes it trustworthy" → the registration's own line 4 says **NOT that seat and not the ruling seat**, and separation is the source of trust, not its opposite; (14) "mutation-proves three behaviours" → **no mutation testing at all** (grep: no output), the file names **four** and holds 22 tests; (15) "also whether the guess was any good" → **it cannot**, "four junk paths pass"; (17) "a window to fill and a rate to reach" → **"One unsealed dispatch fires it. No window to fill, no RATE_FLOOR, no n to reach"** (registration :110; code `if (unsealed.length)` at `:271`). **Found while checking:** the tool's own citation `main.rs:5605` has rotted — the chair stamp is now `main.rs:9504`; the mechanism held, the pointer did not. **And on myself:** I wrote my hand-back's citations from memory of the reads, then re-derived all of them with `grep -n` before filing — **18 were off by one to ten lines**, the same class I was reporting, produced while reporting it. Read-only lap.

## 2026-09-16 (on L) — T5 · A: the proposed ferry.js rewrite — 8 changed lines, 7 defects, and its own unmodified test already fails 7 of 13

Hand-back OUTSIDE the repo at `…/C--Consonance-instances-main/0c0c0c0a-…/scratchpad/t5/found-alpha.md`. The killer is `:118` — the usable-row filter inverted to `r.sha.length <= MIN_SHA`, so with real 7–40 char shas the usable set is EMPTY: every commit reads un-ferried. Measured against the repo on one planted ledger: repo 4 ferried / 89.7% / median 30.0 min vs copy **0 ferried / 100.0% / n/a**, `--due` 805 vs 809. It fails in the direction that looks like diligence. Also: `:43` MIN_SHA 7→4 (a 4-char row now WRITES, and then permanently blocks the full sha — shown at the CLI); `:160` `&&`→`||` (a second pane on the same sha is silently dropped — the original incident rebuilt); `:201` /60000→/1000 with the `' min'` label 20 lines away (60× and mislabelled); `:202` the `n >= 0` filter gone (negative latencies enter the median); `:204` floor→ceil (with 3 samples the "median" is the MAX); `:215` RATE_FLOOR 10→1 (a percentage off n=2 — the defect the floor's own comment describes); `:196` `>=`→`>` (one commit silently out of the denominator: 39 vs 38, 13 vs 12). **Reading gave all eight lines; RUNNING gave four things reading did not:** the surviving `min` label, that ceil returns the maximum, that the epoch `>` is a real off-by-one, and that D2+D3 compound into an unferryable commit. **My own error, reported:** a `node -e` harness with `__dirname` under a repo cwd created an untracked `t5e.jsonl` in the repo root; noticed in git status, deleted, tree restored, no tracked file touched.

## 2026-09-16 (on L) — P-HARNESS-REVISION · A: tonight's three lessons into the carrier harness, each labelled GATE or SENTENCE — and the one that matters most cannot be a gate

`exo_memory/handback/p-harness-revision-A_2026-09-16.md`. **R2 (orphaned anchor) and R3 (malformed row) are GATES** in `dev/tail-carry.mutants.js`: both audit the WHOLE list before any mutation and exit 2 naming the row — R2 prints the anchor TEXT, and runs **even under `--only`**, which is the actual repair, since tonight's orphans hid inside a `--only` run that never looked at the row nobody asked for. Named cost: a legitimate refactor now makes the harness refuse until anchors are re-pointed. **R1 (pin the SHAPE, never the token) can only be a SENTENCE** — a token-pin and a shape-pin are both "the suite went red"; a harness that could tell them apart would be the suite. Its aid: every SURVIVOR now prints its anchor and replacement, labelled in code as an aid and not a check. **R4 (exposure ≠ void)** is a header rule in `dev/diversity/leak-check.sh`: a filename in a listing is EXPOSURE recorded beside a SCORED cell; returned CONTENT is a VOID — the cut is what a seat could have LEARNED, not what it could have NAMED; the script still exits 1 on either, so its exit means "go look which", never "void". Bars: tail-carry.test 129/0; the three harnesses 1 killed/0 survived each on copies; gates proven on a replica (tracked files unchanged). **Caught myself:** my first R2 proof appended a comment to the anchor line, leaving the anchor a SUBSTRING — the gate correctly did not fire and I nearly filed it as evidence. That near-miss IS R1.

## 2026-09-16 — L061 P-HARNESS-REVISION, B's read applied · A: my own R2 gate told a seat to re-point its anchors ONTO a mutation; the dirty-tree check now speaks first, proved both orderings against one tree

`exo_memory/handback/p-harness-revision-A_2026-09-16.md` §6 (appended, not a new file). **The defect was mine and B found it at source.** Two trees give an anchor zero hits — an EDIT rewrote the line, or a CRASHED RUN left the replacement sitting on it. My new R2 gate reached the exit first and blamed the edit both times; its remedy ("until they are re-pointed") points the anchors onto the mutated line, which writes the mutation into the list as the truth and scores it green forever — the permanent-damage shape this harness's own header was written about, reached through my gate's advice. **The move:** `dev/tail-carry.mutants.js` order is now R3 shape (:407) → dirty-tree (:422-434) → R2 orphans (:436) → mutate (:478), with six comment lines carrying the reason so the next edit cannot quietly undo it. **Proved on a replica** (`scratchpad/order_proof.js`, tracked files hashed unchanged: true): one dirty tree, both orderings — pre-edit says "AN EDIT REWROTE THE LINE", after says "THE SOURCE ALREADY CARRIES A MUTATION"; plus the falsifier, a real refactor under `--only 5` still trips R2, and a two-field row still outranks both. **Also:** §3's R1 sentence claimed the aid checks the PIN; it shows the surviving MUTATION and the harness never sees a pin — the "claims more than it checks" class, committed inside R1's own paragraph. Bars after both edits: `node dev/tail-carry.test.js` 129/0; `--only 1` on all three harnesses 1 killed / 0 survived / 0 not applied. **New limit I filed myself:** the dirty-tree block matches the replacement as a SUBSTRING, so one planted mutation named three rows — the condition is right, the row attribution is not; unfixed, because the ruling was "nothing else changes". Uncommitted; the chair lands the three paths after the librarian's collation.

## 2026-09-16 — L062 P-SEAL-GATE · A: the seal gate designed, and its required recovery is an act COMMITTEE.md forbids — a third contradictory-gate pair, found in the design rather than at 3am

`exo_memory/handback/p-seal-gate-A_2026-09-16.md`. Design only, no code. **Nine checks a gate can enforce (row parses; the A8 triple resolves; the commit is on ORIGIN; the key's distinctive line and the task's question are absent from the checkout, tracked AND untracked; the key is not in the directory the subject is pointed at; the object's basename is not in `git ls-files`; an undeclared key-smelling dispatch is refused; the refusal names but never quotes) and five that stay SENTENCES** (is the distinctive line representative; is the object one diff from something committed under another name; are the subjects contaminated; is the ceiling chosen so the task can measure anything; does the key leak after dispatch). **Two corrections to the packet's own commands:** `git branch -r --contains` reads a LOCAL CACHE and passes a commit force-pushed away — `git fetch` then `merge-base --is-ancestor`; and "the commit precedes the delivery" is weaker than what the gate can see — verify on origin AT THE INSTANT OF THE CALL and leave the audit line for the scorer. **The record corrects the packet's history too:** the second SHIPPED failure was T5 (no row on origin, object one `diff -u` from its committed original), not the withdrawn first T2 text, which the chair caught before dispatch — a human check did work once. **Where it lives is measured, not argued:** `hooks/dispatch-gate.js:29-36` records that bypass-permissions mode overrides "ask", and every seat here runs under bypass, so a hook-layer seal gate is theatre; it belongs in the verb. **THE COLLISION:** the gate's own recovery is `git push`, and `COMMITTEE.md`'s 08-26 amendment rule 3 says no seat pushes, while A2 says no task ships before that push — so as the rules stand the gate refuses every keyed dispatch while the keeper is asleep. Three ways out, one recommended (a standing yes for a push whose diff is exactly the row path — enforceable, so the yes covers a shape and not an occasion); not mine to rule. Measured: 15 board-visible dispatches today, the sniffer's marker set fires on exactly ONE — this packet, which names a key and has none. The plan's "43 dispatches" does not reconcile with the board's 16 and I did not find the command that produces it. 16 fixtures + 6 mutants specified on a fixture repo with a real bare origin; F6b (a stale remote-tracking ref) is the one that goes green on the packet's command as written.

## 2026-09-16 — L063 P-NUL-GUARD · A: text-census.js — a tracked text file with a raw NUL fails by path AND byte offset; it found three SOURCE files nobody was looking at, and the packet's second hand-back does not carry the defect

`exo_memory/handback/p-nul-guard-A_2026-09-16.md`. New: `consonance/tools/text-census.js`, `.test.js` (20 fixtures, 20/0), `.allow` (18 rows, each with a reason). Nothing owned this — `guard-census.js` counts guard failures, `portable-paths.js` is the closest SHAPE and its referent is machine paths; I took its two conventions (a reason per exemption row, and the green line always printing the exempt count, because "exempted reads exactly like fixed"). **THE FINDING: 4 tracked files carry a raw NUL, and 3 are source nobody was watching** — `hooks/blind.test.js:74`, `tools/coupling-test.js:225`, `tools/essay-provenance.js:342`, all the same construct C found in boundary-check.js (a raw NUL typed into a string literal as a separator or fixture), plus `handback/p-boundary-read-B_2026-09-16.md:37`. Each is a one-character repair (`'\u0000'` instead of the raw byte) and **none is mine to edit tonight**. **CORRECTION to the packet: `handback/t2-echo_2026-09-16.md` has NO NUL** — `git show HEAD:` and the worktree both read -1. One hand-back, not two; if C's parallel census says two we are reading different trees. **The guard ships RED and that is correct** — it stays red until four files are repaired, which is a packet, not a leftover; a permanently red guard is the thing that gets ignored. Mutants on a copy 7 applied / 7 caught / 0 NOT APPLIED, tracked files unchanged: true. **Caught myself twice:** my first red was MODULE_NOT_FOUND and proved nothing (the discriminating red is the live-tree run); and one of my own assertions pinned the TOKEN "unreadable" while the report says "could not be read" — L061 R1, broken inside the file that cites R1. Limits: nothing runs this guard (no hook, and bypass mode overrides a hook's ask); the 18 allow rows are my unchecked classification; it scans the worktree, not HEAD. Uncommitted.

## 2026-09-16 — L065 P-LAUNCH-PULL · A: THE BLOCK DOES NOT SHIP — launch.ps1 is byte-identical to HEAD; the defect is located and the remaining work is one timeout wrapper

`exo_memory/handback/p-launch-pull-A_2026-09-16.md`. The keeper's "I always have to restart it for the newest build" is real and located: `launch.ps1` has never fetched (no `pull`/`fetch` anywhere in it; the tree's only fetch is `state-sync.js:767`, the state repo), so the mtime rebuild check at `:107-141` runs against sources that are still stale on the first launch at the other end. **I wrote the 59-line pull block, it parses, and I held it** — the packet's rule was "if you cannot prove both cases inside the clock, it does not ship", and I could not: all three fixture runs (clean / dirty / origin-ahead) took the FAILURE branch, so the no-op was never demonstrated and the dirty check was never reached. **The safety property IS proven three times: one line printed, exit 0, launch continues — no path returns early or throws.** **Cause narrowed to my own wrapper, not git:** `git -C <fixture> fetch --quiet origin` run directly returns 0; the `Start-Process -PassThru -NoNewWindow` + `WaitForExit(25000)` + `ExitCode` wrapper is what reports failure. One mid-run patch (subexpression flush of ExitCode) did not change it, so the null-ExitCode theory is wrong or incomplete — suspect `-ArgumentList` or `-NoNewWindow`, and test the wrapper against a command with a KNOWN exit code before testing it against git. Not done: no run against L itself, no `held/launch-pull-2026-09-16` branch, no stick copy, no journal entry for the keeper's "journal future plan" half, and the 25 s timeout path never exercised. Block kept at `<scratchpad>/launch.ps1.with-block` + `pullblock.js`; the verbatim extractor is `<scratchpad>/pullblock-extract.ps1`. Filed ~2 min past the 07:55 deadline.

## 2026-09-16 (on D) — D066 P-STICK-APPLIER-ZOMBIE · A: a windowless consonance.exe now ends the applier's wait in 30 s with its pid named and NOTHING imported — REFUSE, never STALE, because tail-carry's own gate makes STALE a lie; and the keeper's setup window never renders the `why` that names it

`exo_memory/handback/p-stick-zombie-A_2026-09-16.md`. `dev/stick-apply.js` + `.test.js`, uncommitted. **Probe:** one PowerShell query (every process, `-ErrorAction Stop`, filtered to consonance) → `OK <n>` + `<pid> <MainWindowHandle>` rows; the parser demands positive evidence for GONE and returns null for anything unaccounted for. Measured on D before writing against it: live app `15380 1507894`, absent `OK 0`, four real windowless node.exe handle 0, ~160 ms each. **Choice: REFUSE with the pid named, not STALE** — `tail-carry.js:1137` re-checks tasklist at import, so STALE could only import by the applier telling tail-carry the app is closed while one exists, which is the harm itself (A-1). A window anywhere holds the full 600-s wait; "cannot tell" is never "windowless". **Grace 30 s, CONTINUOUS**: the unnamed legitimate windowless process is the applier's OWN PARENT tearing down after `app.exit(0)` (seat kill bounded 5 s); a slow painter is handled by a window resetting the stretch. **Falsifier, checkable from one file:** a result whose `app.windowless` contains `app.parentPid` (verified on D that node is not a shim, so ppid is the app). **This morning, from D's persist.log:** applier 9864 waited the full 600 s (08:38:12→~08:48:12); 08:48:14 and 08:52:28 were LAUNCHES reading results, not result writes (a correction to the packet); the keeper's 08:40:29 launch ran while the ghost lived, so the ghost did not hold the single-instance mutex; the ghost's pid is unrecoverable because tasklist recorded none. Red 32/13 vs HEAD (5 new fixtures green at HEAD = negative controls for over-refusal) → green 48/0; waiter 74/0, tail-carry 129/0, place-conversations 35/0; js-suite 95/6, all 6 red at a clean HEAD worktree too. Mutants on a copy 13 applied / 12 killed / 1 survived (planted: `-ErrorAction SilentlyContinue`, fail-closed resting on measurement not test) / 0 NOT APPLIED. **Findings outside my files:** `ui/stick.js:61-72` renderResult shows code and rows but NOT `why`/`outcome` — this morning's refusals read as "exit 2 (could not run)" over an empty table, and my named pid stays on disk only; and a mutex-holding ghost would meet `warn_second_instance` saying "use the window you already have" when there is none. **Caught myself three times:** my regex `.exec` tripped the waiter's text SWEEP, then my comment explaining it tripped it again; my grace `every()` ran over windowed pids too, so the windowed-anywhere guard was carried by a NaN comparison and would have survived its mutant (found designing the mutant); a shell patch lost its backslashes and my own anchor gate refused it. **THE EXPOSURE:** the app runs the applier from the CHECKOUT with no build step — this unread diff is LIVE for the next transfer on D; hold-or-accept is the chair's call, flagged at the top of the hand-back.

## 2026-09-16 (on D) — D068 P-SEAL-GATE build · A: a keyed dispatch does not render until its row is on origin (fetch, then ancestry, never a clock) and its key is out of the search space — and three of my own L062 design choices were wrong

`exo_memory/handback/p-seal-gate-build-A_2026-09-16.md`. `mcp.rs` +1096 −1 (field 300–304, destructure 468, the call in `chair_inject` 488–506 after the debt gate, `seal_audit` 527–538, section + `mod seal_gate_tests` appended 1619–2677 — for B's later edit) and `brief/COMMITTEE.md` +8 (the keeper's seal-row exception, citing `keeper_decisions_2026-09-16.md`, without naming the verb, because `the_brief_does_not_duplicate_the_verb_list` would fail). **DESIGN CORRECTIONS, measured or forced:** (a) the L062 keyword sniffer measured on 40 FULL dispatches in my own transcripts caught **0 of the 3 real keyed tasks** and fired on 5 ordinary ones — a keyed dispatch hides its key, so its text never names one; not built, replaced by a reverse lookup from sealed rows' paths (would have caught T5, not T3); (b) the row carried its own sha256, which is impossible — replaced by comparing the block on disk to the block in its commit; (c) the row carried the key's distinctive line and question, putting the fingerprint in the search space — both now live only in the off-repo key file. No sha256 in the crate and no new dependency, so the key's revision seal is a `git hash-object` blob id. **Bars:** red with the gate stubbed to allow 5/24 (the 5 green are the verdict-independent controls) → green 30/0; whole crate 709/1/4, the 1 being the known composer red; committee 10/0, brief 13/0, lap-row.test.js 113/0. Mutants on a worktree copy with its own target, live files unchanged: 14 listed / 14 killed / 0 survived / 0 NOT APPLIED — #12 is killed by refusal text only (the leak search still refuses behind it) and #14 by a wiring-order text pin. F6b asserts `git branch -r --contains` still says yes after origin is force-pushed past the seal, and the gate refuses anyway. **Cross-gate recovery check:** no seal refusal names the baton; the commit gate is NOT installed on D, but its unreadable-state-fails-closed arm would block recovery step 1 if it were. **Caught myself:** my harness's substring dirty-source check refused a replacement that is a legitimate line elsewhere (the L061 §6.5 limit, in my own tool); and my rings earlier today carried no NEXT trailer. Not verified: no end-to-end chair_inject through the server, the chair's client must reconnect to see `seal`, nothing on L, no real network, no sealed row exists yet. Uncommitted.

## 2026-09-17 (on D) — D071 P-TRACK-POOLS · A: the 11 track-side lights are ON for Night Optimized with the author's own values; the keeper's click is UNINSTALL then INSTALL, because INSTALL over v1 silently keeps the old script

`exo_memory/handback/p-track-pools-A_2026-09-17.md`. Off-room object: `C:\Users\nname\Desktop\thunderhead-night-optimized`. The keeper rescoped mid-lap ("if it isn't worth it just turn them on"), so the geometry build stopped. **Built:** the generator (`tools/make_variant_script.js`, baseline-proven to reproduce the committed `stock_lights.lua` byte for byte, 76aa103a) now gives every light its inventory id and builds only `NIGHT_OPTIMIZED_KEEP` on night_optimized — L045–L050 Track Stadium and L076–L080 Inner Stadium — with a tripwire that refuses if an id stops matching its group's range. Regenerated script a360a546. New `tools/check_stock_lights.js`: 61/61 rows identical to HEAD apart from the id; the 11 matched to INVENTORY.md; 61/61/11 per layout, EMULATED in JS — **no Lua runtime on D, the Lua never ran**. Its mutants 7/7 killed. The real `install.ps1` on track COPIES: fresh v0.6 install → every payload file hashed at destination → uninstall back to pristine; and **the trap, proven: `G:\` carries v1 (44f8580b / 76aa103a), and INSTALL over v1 prints "already installed. Nothing to do." and keeps the OLD script**, because the installer pins only ext_config.ini — UNINSTALL then INSTALL delivers a360a546. `G:\` unchanged, read-only. The tested package is on the Desktop as `ThunderheadRaceway_NightOptimized_v1.1\`, hash-identical to the tested tree. **Author values copied faithfully:** L077 intensity 0 (casts nothing, one head glows dark) and L080 1.12 (dim). **FPS levers ready:** 7 of the 11 cast shadows (L045–L050 half-res, and L077 at full res while lighting nothing, so L077 is the first lever), then a shorter inner range. Prediction, not measured: FPS stays above the stock 220–240. **Found on the way:** every layout's `ai` folder is EMPTY (the plan's fast_lane.ai doesn't exist); `thtrack.kn5` parses exactly (road = `1ROAD_*` with material Track/Finishline, elevated −6.8..80.6 m; reader in scratch, first version out of step by 36 B per material property); the CSP Lua SDK has no track-only mask (only `affectsCars`, the wrong way), but exposes `skipLightMap`/`showInReflections`. The config's "except night_optimized" comment is half-stale and left alone, because its sha is the installer's pin. My substring dirty-source check refused a mutant replacement again (the same unfixed limit). Uncommitted; README.md and installer/README.txt corrected; release zip not rebuilt.

## 2026-09-18 (on D) — D073 P-SECOND-INSTANCE-TEXT · A: the second-instance dialog stops asserting a window — every window sentence is conditional, the windowless case names Task Manager and consonance.exe after a wait, and the reason is kept

`exo_memory/handback/p-second-instance-text-A_2026-09-18.md`. `main.rs` only: `warn_second_instance` (:6507) now shows the new pure `second_instance_message()` (:6519), pinned by `mod second_instance_tests` (:6536, 6 tests); diff is two hunks inside that region, +99 −12, ASCII. The old "Use the window you already have" became "If a Consonance window is open, use that one…" plus a windowless paragraph: give it a minute (a starting or closing copy is windowless too — the case the packet did not name; ending it would kill a real session), then Task Manager, end consonance.exe, launch once. **Red first:** the body moved verbatim, then the tests → 2/2 (the two defect tests failed naming the old sentence; the reason and ASCII controls held) → green 4/0, then 6/0 once the wait-order and wiring pins were added. mcp:: 68/0, brief 13/0, whole crate 746/1/4 (the known composer red). Mutants on a worktree copy with its own target: 8/8 killed, 0 NOT APPLIED, live main.rs unchanged. **Caught myself:** designing the mutants found two holes in my first four tests (nothing pinned the wait before the kill; nothing pinned that the dialog shows the pinned text); my MCP-reason assertion was an `||` of three spellings where only one can exist; my harness's R2 audit refused an ambiguous anchor of mine (it matched in my own test). **Nuance from D066:** this dialog only appears when the other copy HOLDS the single-instance mutex, and the 09-16 ghost did not. Not verified: the dialog was never shown (the keeper's app is live), not rebuilt, and "a minute" is a reader's wait, unmeasured. Uncommitted.

## 2026-09-19 (on D) — D076 P-SUGGESTION-OFF · A: every seat now spawns with CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION=false, pinned on a real CommandBuilder; D074's no-readings row no longer says "never cleared"; and my wiring test passed its own red run by reading ITSELF

`exo_memory/handback/p-suggestion-off-A_2026-09-19.md`. `main.rs` only, +71 −3: `suppress_prompt_suggestions(cmd)` (:989) sets the var; `spawn_claude_pane` calls it at :1138 after FORCE_SESSION_PERSIST. The doc cites B's switch hand-back, the keeper's 09-07 words and his 02:2x yes (Main included). portable-pty 0.8.1 HAS `get_env` (cmdbuilder.rs:322), so the var is tested on a real CommandBuilder, and the spawn wiring is held by a source ORDER pin (call before `spawn_command`, no env_clear or re-set between). D074's `(SignalOutranked, None)` arm now says "its composer did not read empty, and no readings were recorded" — the gate reaches it when the composer is unreadable too — and the one existing test that pinned the old token moved with it. **Red:** first run 1/2 because **my wiring test's anchor literal first occurred inside the test itself (above the real fn) and it passed with no wiring**; fixed with `concat!` (this file's own idiom), then 0/3 → green 3/0. mcp:: 68/0, brief 13/0, crate 772/1/4 (≥769; the known composer red). Mutants on a worktree copy, scored on suggestion_off_tests + ready_signal_tests with the known red `--skip`ped (unskipped it would have made the pre-flight red): 9/9 killed, 0 NOT APPLIED. The substring dirty-source check refused a replacement of mine a fourth time. Not verified: no seat spawned with it (B's §4 real-seat question is still open), running seats keep suggestions until respawn, the forced count isn't measured, nothing on L. Uncommitted.

## 2026-09-19 (on D) — D077 P-REFUSAL-KEEPS-THE-POINTER · A: a refused call_librarian now posts its pointer to the board, bounded, under a label that C's refusal count won't double

`exo_memory/handback/p-refusal-keeps-pointer-A_2026-09-19.md`. `mcp.rs` only, +112: `refused_attempt_row(who, text)` (:44, bound 600 chars counted in chars, line breaks → " | ") and one board_push in call_librarian's out-of-turn branch (:796), after mark_owed and before the unchanged return; the gate decides exactly as before. The label is "call_librarian REFUSED — the attempt, kept…", deliberately NOT "REFUSED OUT OF TURN — mount" (C's discriminator), and it posts on EVERY refusal, bypassing refusal_should_post (one row a minute would lose the absorbed pointers) — the flood trade is named. Red 1/4 (the one pass was vacuous at red, and mutant #6 covers it) → green 5/0; mcp:: 73/0, brief 13/0, crate 777/1/4 (the known composer red). Mutants on a worktree copy: 8/8 killed, 0 NOT APPLIED, live mcp.rs unchanged; two of my first mutants didn't compile and the harness scored them NO RESULT rather than killed, and one anchor of mine was wrong and the audit refused it. **Found, not fixed:** the address-table refusal at :781 also discards text under the same "posted to the board" sentence (lower stakes: only unaddressed mounts). Not verified: no live refusal (the plan's falsifier is the next real one), C's replay filter not opened, nothing on L. Uncommitted.

## 2026-09-19 (on D) — D078 P-ADDRESS-REFUSAL-KEEPS-THE-POINTER · A: the address-table refusal of call_librarian now keeps its pointer too, through the same row code as D077, with its cause in the label

`exo_memory/handback/p-address-refusal-pointer-A_2026-09-19.md`. `mcp.rs` only, +98 −1: D077's row body became `refused_row_labelled(label, who, text)` (:56); `refused_attempt_row` and the new `refused_address_row` (:52, label "call_librarian REFUSED (no address row)") both call it; one board_push on the address branch (:798) before the unchanged return. The rows are told apart in both directions, neither matches "REFUSED OUT OF TURN — mount", and D077's row is pinned byte-identical after the refactor. Red 7/3 (the 7 = D077's 5 through the refactor + a byte-identical control + one vacuous pass that mutants #1/#2 cover) → green 10/0; mcp:: 78/0, brief 13/0 (with B's BUILDING.md edit in the tree), crate 782/1/4 (the known composer red). Mutants on a worktree copy: 6/6 killed, 0 NOT APPLIED, live mcp.rs unchanged. **The substring dirty-source check refused a legitimate replacement for the FIFTH lap running** — worth fixing properly (check against the anchor's position, not the whole file). Not verified: no live address refusal (only unaddressed mounts reach it); a counter keyed on the bare "call_librarian REFUSED" would count both kinds. Uncommitted.

## 2026-09-19 (on D) — D080 P-LEAVE-SAYS-WHAT-THE-FLUSH-SAID · A: nothing to change — all six DONE/unplug sites read one number, tail-carry's res.code, and none writes to the stick itself; the fix must make a flush failure move THAT code

`exo_memory/handback/p-leave-flush-A_2026-09-19.md`. Read-only. The six: the app's Leave (ui/leave.js:55 ← sync_launch leave_ending `code == Some(0)` ← run_carry_json export JSON), the waiter's fallback (stick-waiter.js:535 ← `obj.code === 0`), LEAVING.ps1:31 and ON-EXIT.ps1:41 (process exit code), TAKE-STICK.ps1 and stick-apply.js (imports). Their own writes all go to C:\Consonance\data (local). tail-carry's JSON code and exit code are the same `res.code` (:1671-1699, :1738), and an export sets it only through seat accounting (`bad || refused` → EXIT.SEAT, :1535). **So a flush failure on a seat's tail recorded as ok:false reaches every DONE unaided; a flush failure on a NON-tail file (ledger, manifest, HANDOFF, the stick folder's directory — C's 09-14 cluster-136 case) must set res.code by another path, or all six still say DONE.** Stick copies of the four .ps1 are byte-identical to the repo. waiter 74/0, apply 48/0, nothing modified. Not verified: no failing write driven; L not checked.

## 2026-09-19 (on D) — D081 P-MUTANT-HARNESS-CHECK · A: my mutant harness is TRACKED and its dirty-source check judges at the anchor's position — the D078 row it refused now runs and is killed

`exo_memory/handback/p-mutant-harness-check-A_2026-09-19.md`. The harness had lived only in scratch, one copy per lap. It is now `consonance/tools/mutant-harness.js <rows.js> [--only n] [--audit]`, where the rows module carries `{label, repo, rel, rows, score}`. The run uses a worktree copy with its own CARGO_TARGET_DIR, the live file is hashed before and after, and the worktree is removed in `finally`. The order is L061's. **The check:** anchor present → leftover only if `to.includes(from) && source.includes(to)`. A replacement that contains the anchor can only stand ON an anchor occurrence, so "anywhere" equals "at the position". A replacement standing elsewhere is legitimate text. Anchor absent → still reported as a possible leftover, because the anchor gate refuses anyway and "restore" is the safe diagnosis. The L061 over-naming is fixed with it. **Red** on the scratch rule: 8 passed, 4 failed (the misfire, fixture copied verbatim from mcp.rs @136bdc9 :797-799/:816-818). **Green:** 12/0. **On the real file:** D078's six rows as first written; the old rule flags #4, the tool passes all 6; `--only 4` pre-flight 10/0, killed by the same two tests as at D078; live mcp.rs unchanged. **Mutants on the check** (a copy, via MUTANT_HARNESS_UNDER_TEST): 8/8 killed, 0 NOT APPLIED. **Caught myself:** my first version computed alignment explicitly. Its 3 alignment mutants survived, and I proved them equivalent by hand, so I reduced the rule to two lines instead of adding tests. **Not done:** 4 tracked harnesses keep the whole-file check — close.mutants.js:125, state-sync.mutants.js:244, place-conversations.mutants.js:78, and tail-carry.mutants.js:460, the last in C's dirty tree. The tool scores cargo only. Uncommitted.

## 2026-09-19 (on D) — D083 P-BRACE-COUNTER · A: portable-paths' cfg(test) brace counter reads Rust (strings, raw strings, char literals, comments), and main.rs:113-119 is green; the old counter was wrong BOTH ways, hiding ~2500 live lines

`exo_memory/handback/p-brace-counter-A_2026-09-19.md`. `rustBraceScan` in `consonance/tools/portable-paths.js` carries lexer state across lines. Comments were added beyond the bar, because the string skip is unsound without them (`// don't`). **Red:** tests 40 · pass 32 · fail 8 (the 5 new + the 3 known). One test first passed vacuously because its braces balanced; fixed. **Green:** 38/2; the 2 are the baseline ratchet, untouched. The tool is still RED at 35, no --update. Two sites re-class: main.rs:6056 REVIEW → BENIGN-TEST and :6237 FIXTURE → BENIGN-TEST. main.rs and baseline hashes unchanged. **The region count fell, 8432 → 7697.** An oracle over all 24 .rs files (first column-0 `}`) shows HEAD was 2133 extra and 1390 missed lines in main.rs (offset_tests ran :1845→:4578), 747 missed in mcp.rs, and 19 extra in sync_launch.rs; NEW equals the oracle everywhere, bar main.rs's hand-checked indented block at :388. **Mutants via my mutant-harness.js:** 11 applied, first run 8 killed / 3 survived (real fixture gaps: an escaped quote, `['\u{7d}','}']`, `/* lone } */`), final 11/11 killed, 0 NOT APPLIED. The harness's two D081 limits bit: it copies one file and parses cargo only; a scratch scorer copied the live test in and translated TAP. My first fixture probe line was a real drive path and made the tool report 36; replaced. Uncommitted.

## 2026-09-19 (on D) — D087 P-T2-ARM-C-FEASIBILITY · A: five Claude ids reach by C's restricted route with no silent remap and the canary holding; arm (c) is three tiers of ONE family; and L039/L045 as arm (a) is a harness confound

`exo_memory/handback/p-t2-arm-c-feasibility-A_2026-09-19.md`. Measurement only; no subject ran. Command: `claude -p --restricted --strict-mcp-config --model <id> --output-format json` from fresh %TEMP% dirs (`<scratchpad>/t2/probe.js`, table from `table.js`). **Five ids reached** — opus-5, sonnet-5, haiku-4-5-20251001, fable-5-1, opus-4-8 — each exit 0 and each REPORTED as itself in `modelUsage`. A bogus id fails with exit 1 and a 404 at $0, so there is no fallback. OK floor ≈ 13.1–14.6k input tokens, $0.020–0.275, 1.7–3.4 s. C's canary was found on all five, with ZEBRA absent. My `room_words` detector's 4 hits were the models listing the words as ABSENT; I read item 5 of each before believing it. Arm (c) default: opus-5 + sonnet-5 + haiku, with (a)/(b) on opus-5. The smallest T2 floor is R=3 → $1.51 over 12 subjects, R=2 → $1.10 over 9 (canary-probe cost per subject; the real object and multi-turn cost are unmeasured). **Named:** "three models" = three tiers of one vendor's family, so a null cannot say the cross-architecture lever was an artifact; the rule is asymmetric. **Bigger:** L039/L045 readers were room panes with Bash, while `--restricted` removes Bash and the shell, and L045 found tool access decisive. So (a) should be re-run by the same route. Arm (a)'s model is unrecorded (read on L). Caught myself writing a spend total before summing it (1.3804 vs 1.3803).

## 2026-09-20 (on L) — THIRD RUN read · A, condition TEXT-PLUS-SCRIPT: 26 members on dev/dream/README.md + dream_cycle.test.js; the README still documents the very bug the test was written to forbid, and the test asserts one thing against RAW after saying it never does
`exo_memory/handback/p-third-run-read-A_2026-09-20.md`. Two files opened, one command run (`node dev/dream/dream_cycle.test.js` → tests 7 · pass 7 · fail 0, exit 0); dream_cycle.ps1 is NOT openable under the condition, so every script-dependent item is marked [needs the .ps1]. **Ranked first:** README:31-32 "If Consonance is running, the cycle skips" IS the 2026-07-26..28 defect the test file records at :4-9 and forbids at :58-66. **Second:** the header at :21 says comments are stripped before every lexical assertion, and :83 asserts against RAW — mention-vs-use, in the test whose subject is a comment that lied; the stated reason fails too, since stripComments preserves here-strings. **stripComments holes:** :45 opens here-mode on any line merely containing @' or @" (one such comment leaves the rest of the file unstripped), and :40-49 never handles `<# … #>`, so a commented-out guard satisfies six assertions. **Weak assertions:** :61 matches braces with a regex (body ends at the first nested `}`, capped at 400 chars) while its message accuses the code of the historical bug; :64 passes on a mention; :78 only needs an `exit 0` within 200 chars, not inside the branch; :96 `>=3` cannot show the three are battery/presence/idle; :95 `.` never crosses newlines and only knows two call forms; :69 demands a default value while claiming to demand a parameter. **Uncovered guards the README calls load-bearing:** no hands, never-mine-the-dreams. **README also omits** IdleMinutes, -Force and the unknown-idle skip, hardcodes C:\Consonance\instances at :22, and drops <instance> from the log path at :35. Unverifiable: the three dated log lines, the Add-Type warning claim, install_dream.ps1, the bare muscle_map.md citation. Disclosed in §0: the map append used one `printf >>` that reads nothing — the only command besides the named script.
**HEADER CORRECTED ~01:4x** (chair's finding, re-derived by the chair; no finding touched, object not re-opened): three typed header numbers were wrong — the window said 00:4x–01:0x, which predates the dispatch row (07:33:56Z = 01:33:56 local) and the seal be4baa3 ~01:31; the line counts said 42/101 where `wc -l` gives 41/100 (both files end in a newline); and "about 25 minutes" with a 5/15/5 split was an estimate written as a measurement, withdrawn for ~4 minutes wall. The member list's line NUMBERS came from the same display as the bad counts and were not re-derived this turn, by instruction — treat each as unchecked until opened. Lesson for my own headers: a header number with no command beside it is a typed number, and two of them wrong is what tells a scorer which body numbers were measured.

## 2026-09-20 (on L) — L061 packet 3 P-DIGEST-AT-RING · A: `call_librarian` computes the digest from the file its pointer names, at ring time, or says there is none; a pane-supplied digest is stripped and never carried
`exo_memory/handback/p-digest-at-ring-A_2026-09-20.md`. `mcp.rs` only. **Which digest, decided first:** a git-blob via `git hash-object --no-filters`, on this file's own precedent at :1762-1764 (git is already the gate's one dependency, the crate has no sha256) — so a pane's sha256 can be REMOVED but never COMPARED, and no row can say "stale"; naming a mismatch needs a hasher, which is a dependency call above my pay grade. `digest_gate(text, repo, git)` is pure but for the injected runner (`seal_gate`'s shape): strip every `sha256|sha-256|sha1|git-blob` word WITH its hex → find the first repo-relative `*.md` token → hash it → insert `[digest at ring: git-blob <id> — <path>, <n> bytes …]` BEFORE the NEXT trailer so the trailer stays last. **Refuses** only when the pointer names no readable file or climbs out of the checkout, with the path in the refusal, and that refusal posts `refused_digest_row` (D077's family) so the pointer still survives; no checkout, a git that cannot run and a call with no pointer are MARKED `[NO digest at ring — why]` and delivered, because this verb destroys work when it refuses. Gate DECISION untouched: address → station → digest, and `digest_gate` names neither gate. **Red** 3/8 (the 3 vacuous on a stub, covered by mutants #4/#5/#11) → **green 16/0**; mcp:: 94/0; crate 798/1/4, and the 1 (`shelf_tests::the_librarian_intake…`, 154087 B over a 150000 limit) is red at HEAD 318d4c2 in a clean worktree without my change. **Mutants** via mutant-harness.js on a worktree copy: first run 12 listed/10 killed/2 SURVIVED — both my fixtures being weak (no code-0-with-garbage git; an escaping path that did not exist) — one test added each, final **12/12 killed, 0 NOT APPLIED**, live file unchanged. A real-git test pins ce013625030ba8dba906f756967f9e9ca394464a for "hello\n". **Caught myself:** the wiring anchor `self.send_chair(` matches nothing (the call wraps across two lines); it failed loudly and is now `.send_chair(ChairCmd::CallLibrarian`. **Stated, not fixed:** the D077/D078 refusal rows still write the pane's unverified digest to the board (they refuse before this gate); `an_admitted_call_does_not_post_the_row` is still true of its own row but an admitted call CAN now post one; the pointer is the FIRST .md token, so a ring naming a plan first gets an honest digest of the wrong file; stripping is whole-message, so a digest that IS the finding is lost from the call. Not verified: no live ring, nothing rebuilt, no board row observed, no Windows backslash/UNC/symlink pointer, and a file rewritten between `metadata` and `hash-object` could print a size and an id from two instants. Uncommitted.
**L061 packet 3, HELD then repaired (~03:1x):** the chair's plain `cargo test` failed my own fixture, not the gate — `fixture()` keyed its temp dir on pid+millisecond, so two tests in the same ms shared a root and the no-readable-file test found another test's `hello\n`; `digest_gate` was correct for a root that really held the file. **I missed it because every bar I reported used `--test-threads=1`, the one condition under which the race cannot fire — a suite only ever run single-threaded has not been run.** Fixed with a `static FIXTURE_N: AtomicUsize` per call, and the same collision class in my escaping-pointer test (it wrote `outside-<pid>.md` into the SHARED temp root) is keyed off the unique dir now. **Parallel bars:** digest suite 16/0 six times; `cargo test` 798/1 three times with only `shelf_tests::the_librarian_intake…` red (that is L062 — 154,087 B against a 150,000 cap, ruled to be fixed by windowing the loop/ index by date). A race cannot be failed on demand, so the red-first evidence is a KILL RATE: a harness row restoring the old key, scored in parallel, 5 of 5 killed by the chair's exact test, with the fixed fixture green 16/0 in all 5 pre-flights. **Ruled, not built:** the librarian's §5.1 answer is DO NOT STRIP, MARK — the D077/D078 rows keep the pane's digest verbatim and append a marker that the gate did not run; a record that edits what was SENT is its own defect. My §5.3 (first .md token) and §1 (git-blob cannot NAME a mismatch; a sha256 needs a crate dependency, the keeper's call) are queued by the chair.

## 2026-09-20 (on L) — L065 D2 P-HOLDER-LIBRARIAN-MARKS · A: when the librarian holds, the OWED mark is WRITTEN, no reader can see it, and the next baton row erases it — and the chair's recovery was asserting a holder it never read
`exo_memory/handback/p-holder-librarian-marks-A_2026-09-20.md`. `mcp.rs` only (main.rs was C's). Answered from the code + the ledger, per packet; no pre-condition gate proposed (the :89-101 proof stands). **Q1:** `mark_owed` (:850) is unconditional on holder, so it fires — but its ONLY reader `owed_handback_refusal` (:573) is called from `chair_inject`, where `auth_station` refuses first when the chair does not hold, so the chair never sees the debt; and `handback_refusal_text` (:198) takes NO holder — its discriminator is a RUNG mark, written only by a successful `chair_inject` (:563), which in the one-lap shape necessarily predates the librarian's row, so the trap branch is unreachable and the pane gets "The loop comes back to you". C and a sibling both repeated that sentence at 02:17:3x. **And `mark_stands` is `mark_at >= baton_at`, so ANY row clears the debt** — L060 went librarian→chair at 02:17:37, eleven seconds after C's 02:17:26 refusal, erasing it without opening panes. Written, never read, erased. Range checked first: with a 2nd lap held by the chair the trap branch IS reachable (L040 any-holder), so the finding is about the shape, not the seat. **Q2:** the recovery was wrong twice — it asserted "the baton is at the chair" having never read a holder, and it names `chain_state().lap` (the NEWEST open lap), which under several open laps is a lap the chair never rang on, so `--by chair` fails lap-row's ring gate; that is L040's defect in the one place its fix was not applied (cf. the comment at :779-783). Repaired, text only: reads the holder set, prints the pane's always-legal RETAKE as a second move, warns when other laps are open, and says any row clears the mark. **Q3 named, not designed:** the marks do NOT cover handbacks-in-while-appending — the pane is told the opposite, the chair is shown nothing, and the only artifact is erased by the next row. **Bars:** red 32/5 (2 of my 7 green at red on purpose — they pin findings); green mcp::tests:: 37/0, mcp:: 101/0, crate 826/0/4 SERIAL and PLAIN (the L062 shelf red is gone). The one plain-run red is `tests/arch_test.rs` on a card naming a record; its only inputs are exo_memory/cards and exo_memory/record, both byte-identical to HEAD per git status, so it is red at HEAD — shown without a build. **Mutants** 9 listed, first run 8 killed / 1 survived, then **9/9 killed, 0 NOT APPLIED**. **Caught myself twice:** my holder-blind test searched the BODY for "holder" and the body prints `--holder panes` in the retake (now pins the SIGNATURE); and mutant #1 survived because `contains("librarian")` is satisfied by `call_librarian` in the same sentence (now the rendered clause `the baton is at: librarian`). The harness's R2 gate also refused a twice-matching anchor before mutating. Uncommitted.

## 2026-09-20 (on D) — D093-A ASK-001 · A: the L3 judge is already BLIND, the L0 schema is binary with no abstain, and the "18 consecutive quiet_spiral" re-derives to 2 — in a stream whose recent flags are mostly on cron strings and one-message windows
`exo_memory/handback/p-ask001-l3-A_2026-09-20.md`. Measurement only; **no ask answered, no Question/Status touched, no hook edited** (git status on ASK.md and dev/shell/hooks is empty). One command re-derives everything: `node <scratchpad>/ask001_measure.js`. **Where the verdicts actually live:** `~/.claude/shell/l3_overseer.jsonl`, written by `l3-overseer-worker.js:106-116` with structured `trajectory`/`recommendation`/`session_id`/`observed_window_turns` — NOT drift-watch's cron log, which is prose and never reads that file. 8,010 rows = 7,834 verdicts + 145 parse errors + 30 skipped + 1 hook error. **(1) Blind:** four channels into the prompt, all carrying nothing about prior verdicts — the template (:41-59, installed copy byte-identical by `cmp`), the job (`l3-overseer.js:130-138`, fields job_id/created_at/session_id/user_turns), WELFARE.md pasted verbatim (79 lines, 0 grep hits), and the user turns themselves: the room's own injected arc-perceptions land in `type:"attachment"` records and a tool_result part, and the extractor takes only `role==='user'` parts with `p.type==='text'`. Measured with a READ-ONLY replica of readTrajectoryView, because running the hook would have written a verdict into the stream I was measuring. What the prompt carries instead: *"Default to STABLE when uncertain"* (:52). The unblinded layer is one out — the drift-watch GOAL re-reads its own state.md/last-finding.md/progress.md each firing. **(2) No abstain:** L0/L2 is `{"verdict": "drift" | "clean"}` (`l2-overseer-worker.js:42-43`); L3 is 4 trajectories + 4 recommendations; uncertainty is an INSTRUCTION (default stable) and failure is a BUCKET (parse_error), neither an option. **(3) The streak is 2** (last non-quiet_spiral 20/09 09:48:31), **0 on the day the ask was filed**, and 18 only as ONE SESSION's tail streak (e411b357, 18 of 20, ending 13/08). Newest 300 by what was judged: lighthouse-consonance 58 qs/35 st, librarian 25/53, chair 29/22, C--Users-nname 24/22, vantage-cell verifier 5/2, cron 4/3, pane 0/2. Four of today's six newest flags are on machine text — two cron wakeup strings and two blind-verifier prompts, all `quiet_spiral` + `name`. **2,295 of 7,834 verdicts were rendered on a ONE-message window, 1,430 of them quiet_spiral**, against a prompt that says it judges "trajectory across multiple turns". drift-watch said the same on 2026-08-17 in the ask's own source: the stream was "REFUTED AS A MEASUREMENT" on a slice containing one scheduler-authored cron string. **Named, not made** (keeper's call): an author-kind filter or a floor on observed_window_turns in `l3-overseer.js` — CLAUDE_OVERSEER_RUN only stops overseer children, and cron/vantage sessions are not children — and the L0 abstain token. Not verified: the two largest recent buckets are classified by project DIRECTORY only, l2_overseer.jsonl unanalysed, nothing on L, and nothing about whether any single verdict is right.

## 2026-09-20 (on D) — D094-B ASK-006 · A: both context hooks now exit for an overseer child — and the same leak was handing the L3 JUDGE its own prior verdicts, which corrects my D093-A answer
`exo_memory/handback/p-ask006-guard-A_2026-09-20.md`. REPO copies only (the chair's correction), +13/+8: `if (process.env.CLAUDE_OVERSEER_RUN) process.exit(0);` beside each file's existing dream gate. Not committed, NOT installed — `grep -c` in ~/.claude/shell/hooks is still 0 in both, so live behaviour is still the BEFORE column. **Before/after, measured through the hooks' own CONSONANCE_DATA seam with a seeded non-stable verdict (`node <scratchpad>/guard_probe.js`):** plain 752 B / 614 B with the verdict surfaced, unchanged after; the overseer child was byte-IDENTICAL before (752/614, verdict surfaced) and is 0 B after. Control and >1-value check: CONSONANCE_DREAM=1 → 0 B, so the probe can read a zero. **The finding that matters, and it corrects me:** these hooks surface non-stable L3 verdicts WITH their observation text, and the judge's child inherits the var and fires them — so the L3 invocation was NOT blind, through the one channel D093-A did not test (its own session hooks). My D093-A §1 was true of the prompt and false of the child's context; ASK-001 item (1) is satisfied by THIS edit, once installed. **Install drift found before editing:** installed userprompt-submit.js is 9,453 B / 2026-07-30 against the repo's 14,969 B / 2026-08-25, 123 diff lines, missing the dream gate AND the CONSONANCE_DATA isolation — so the chair's install ships three changes, not one. session-start.js was identical. **Guard choice:** truthy, not `=== '1'` like the overseers (l2 :109/:132, l3 :120/:142, measured), because a guard whose failure mode is machine-text-as-keeper must fail CLOSED; mutant #4 pins it. Silent exit matches the dream gate in these files, not the overseers' `{}`. **Bars:** dream-gate.test.js 59/0 undisturbed; userprompt_pulse 0/6, all "Python was not found" (D082's machine-bound red, not mine); scorer 4/4 per hook. **Mutants 12 listed / 12 killed / 0 NOT APPLIED** (6 per file, including #6, dropping the dream gate in the same edit). **No tracked test added** — ownership was two hook files; its home is consonance/hooks/dream-gate.test.js, whose own note says these two are covered lexically only. **Named, not fixed:** 7 hooks still unguarded (l2-overseer-worker, precompact, ready-prompt, ready-stop, session-end, sessionstart-ambient, stop) — and for stop/session-end the question differs, since a guard there changes what is RECORDED about overseer children, not what they are told.

## 2026-09-21 (on L) — L058 R2 · A: js-suite reads the middle-dot summary, and l2-overseer-worker.test.js (where D095's abstain schema lives) is GREEN in the suite — one file moved, nothing else
`exo_memory/handback/p-r2-jssuite-summary-A_2026-09-21.md`. js-suite.js +7/−2, js-suite.test.js +49; no existing test touched. The file ends `18 tests · 18 pass · 0 fail` (U+00B7, l2-overseer-worker.test.js:160) and is the only file in the repo that prints that form; SUMMARY knew four shapes, not that one — the runner's ignorance reported as vacuity for the fourth time. Fix: a fifth SUMMARY alternative, and the matching VACUOUS rule that only zero-and-zero is vacuous (`0 pass · 1 fail` is FAILED, the 08-17 lesson). **Red** 39/3 (the zero-of-everything control green at red on purpose) → **green 43/0**. **Full suite, one variable, same worktree @eb1b121:** BEFORE 102 green · 6 failed · 1 silent (of 110) → AFTER 103 green · 6 failed · 0 silent, the same six reds, exactly l2-overseer-worker moved silent→green. Live tree after: 105/4/0 (ask and gen-consumer are green there — B's R3 fix and the untracked-file asymmetry, not mine). **Mutants 6 listed; first run 5 killed / 1 survived; final 6/6 killed, 0 NOT APPLIED**, incl. the packet's "any output reads as a pass". **Caught myself:** my first before-run was contaminated — I edited the runner mid-run and js-suite.test.js spawns a FRESH runner, so it would have mixed versions; discarded, replaced by the worktree pair. Mutant #6 (separator loosened to any character) survived because nothing pinned the MEASURED shape; a fifth test now does. My anchors spelled `\u00b7` where the source holds the literal `·`; the harness's anchor gate refused before mutating. Uncommitted.

## 2026-09-21 (on L) — L060 A CH-4 · A: both unfrozen CH-4 carriers → RE-FREEZE AS-IS; they are in the set by SEEDED DIRECTORY (no pointer), and one carries a portable-paths FATAL-SHIPPED-INSTRUCTION at :62 that the freeze must not be read as clearing
`exo_memory/handback/p-l060-ch4-A_2026-09-21.md`. Read-only; both files read in full first; registry untouched (B's). `carrier-drift.js --ch4-walk`: reached 37 · frozen 35 · ADDED the two. **Why they're in CH-4, which B left open:** blank depth = "seeded dir or brief" — the set is the walk UNIONED with cards/spread/research/record (`carrier-drift.js:204-206`), and both were created (09-09, 09-11) after the freeze was last written (986a086, 09-08). No file points at them. **Remove-from-CH-4 is not honest:** the seeded ~/.consonance copies exist and are byte-identical (`cmp`), and this seat's own intake names both with an instruction to open. **Card** (every-digest-carries-its-function): current doctrine this lineage applied at L061 (the digest gate says git-blob); 0/0/0 on the registry's three withdrawal patterns by my own grep, no other finding, links resolve → re-freeze as-is (its NO TRIGGER in SOURCE.md is a separate rule). **Record** (retired_seats_2026-09-11): the retirement rules at :64-69 are current, 0/0/0 on the patterns, and it is a dated master (markers, never rewrites) → re-freeze as-is — BUT portable-paths flags :62 (`C:\Consonance\data\letters.json`) FATAL-SHIPPED-INSTRUCTION, unbaselined; the path resolves on L (613 B) and D shares the data dir, so it is the FORM not a wrong instruction; routed to the record's writers, not made a precondition, because a freeze does not silence portable-paths. Not verified: whether :62's random-cwd claim is superseded (021c56e predates the record by 2 days), whether :97-102's two-conventions defect is fixed, nothing on D.

## 2026-09-21 (on L) — L062 R-C2 · A: three --board defaults resolve (CONSONANCE_DATA → ~/.consonance.json → loud refusal); contamination.js was NOT a board default and I stopped on it; C's snapshot let the recorded pre-encoder numbers reproduce exactly
`exo_memory/handback/p-l062-rc2-A_2026-09-21.md`. One resolver (`boardDefault`/`resolveBoard`/`NO_BOARD`) in deference-unit.js, which order-parameter and vicsek-phi already import their board reader from — no new module. **The packet was wrong about one site:** contamination.js:140 is `--config` → `C:/Consonance/subjects/run2/config`, the recorded location of an experiment's transcripts, and the tool reads no board; resolving it through dataDir would break B's recorded result, so by the stop rule it is untouched (candidate named for B: the sibling of --cells). **Red** 18/6, 25/2, 16/2 (all 59 old tests green at red) → **green 24/27/18 = 69/0**. **The bar:** the live board grew (30,253 → 30,769) and is NOT append-only (its first 30,375 rows hash 720c6d59…, not C's 2a4a559f…), so no live-board number can reproduce with or without the change; measured instead as same-bytes old-vs-new (deference-unit 1379 = 1379, full output identical) and exactly on C's surviving frozen snapshot (sha256 2a4a559fa1da4163): 30,375 rows · 257 · 30,118 · 3,975 dup · 118 eligible sessions — C's §9 and B's vicsek run, old and new identical. On L both tiers resolve to the old literal's exact file. Post-encoder numbers not re-derived: no @huggingface/transformers on L. contamination's recorded command reproduces unchanged (130·130·320, nulls 0, planted 100%). **portable-paths 41 → 32**, but only −3 is mine (other seats landed R-C1/R-C3 meanwhile); my tools+tests now carry only contamination.js:140. **Caught myself:** my first fixtures ADDED five portable-paths sites (drive-letter fixture dirs and a test name with C:\) — my own D083 rule broken again; fixed. My rename then broke the file on an unescaped apostrophe; fixed with the editor. Uncommitted.

## 2026-09-21 (on L) — L065 close.js · A: an undeclared state dir is a named refusal, not a TypeError — but the packet's red condition was never the TypeError, and its requested fix named a variable close.js does not read
`exo_memory/handback/p-l065-close-A_2026-09-21.md`. close.js + close.test.js only; state-sync.js dirty is E's. **Measured before building:** the packet's condition (empty home, no CONSONANCE_* vars) refuses cleanly today — `no corpus declared`, exit 2 — because the data check comes first and stateDir() still ends in the literal C:\Consonance\state (state-sync.js:141). The TypeError is real only once E's step 4 removes that fallback: stateDir()→null with a real data dir throws `TypeError: The "path" argument must be of type string`, and a throwing stateDir() escapes runClose. **And the fix it asked me to print was wrong for this tool:** close.js reads CONSONANCE_STATE (state-sync.js:133), live-follow reads CONSONANCE_STATE_REPO, so "set CONSONANCE_STATE_REPO" would be a recovery that does nothing here; the refusal names state_dir or CONSONANCE_STATE, matching live-follow's shape not its variable. Fix: resolve once, catch a throw ONLY to print it, treat null/blank as undeclared, refuse with exit 2 after the data checks. **Red** 26/3 (two controls green at red on purpose) → **green 30/0** (24 old + 6 new); tracked close.mutants.js **10/10** before and after; mine on the new behaviour first run 5/1 — #6 (a blank stateDir taken as a path; state-sync.js:139 returns state_dir untrimmed) survived until a sixth test — final **6/6, 0 NOT APPLIED**. Not verified: no CLI run of the new refusal (it can't be reached today without running a real close against the real state repo), nothing on D. Flagged: two names for one variable across state-sync and live-follow.
**L065 correction (~04:2x):** E's step 4 landed mid-write — stateDir() now THROWS, naming state_dir/CONSONANCE_STATE — so my refusal is reachable today via its throw arm, not "not yet"; close.test.js 30/0 against E's tree; appended as §6 of the hand-back before collation.

## 2026-09-21 (on L) — L068 · A: vantage_cell/mutants-run.log placed STAYS by name + the "EMPTY" premise corrected; stick-apply relaunch drops CONSONANCE_DATA — but close --check is still exit 1, because the RUNNING app (00:50:30) still leaks it
`exo_memory/handback/p-l068-manifest-stick-A_2026-09-21.md`. The rule lives in state-manifest.json, not the .js the packet named (the .js is untouched). Tests: manifest 25/0 -> red 26/1 -> 27/0; stick-apply 48/0 -> red 50/2 (seam added first, no fix) -> 52/0. Mutants on copies 9/9 killed, live unchanged. `close.js --check` plainly: EXIT=1 on digests/ + pulse/ only, recreated 05:32 and written 05:38 by the scribe (cwd C:\build\lighthouse-target\release) AFTER the librarian moved them. Lesson: a fix to the process that RELAUNCHES the app does nothing for the app already running — check which process holds the env before promising a leak stops.

## 2026-09-21 (on L) — L069 p2 · A: the ring digested the WRONG FILE because a sentence ended on the pointer (`…md.` kept its full stop and was skipped), not because B named several files — trailing dots trimmed, first handback/ path wins, and every other named path is listed as not hashed

`exo_memory/handback/p-l069-ringdigest-A_2026-09-21.md`. mcp.rs +122 −10, no rebuild. digest_at_ring red 18/5 → 23/0 → 24/0; crate --bin 854/0/4 plain and serial (846 + 8); arch_test record/retired_seats red at HEAD 7da934d, not mine. Mutants 9: 8 killed, 1 survived (repeated path) → 9/9. Replay over 34 digested rings on the board: L060 the ONLY misfire. Chose MARK over REFUSE: refusing on several handback/ paths would refuse B's own correct ring, in the verb that loses work when it refuses. Still unguarded: an older hand-back named BEFORE the delivered one — marked on the line, not prevented. Lesson: read the misfire against the parser before designing for the shape the packet guessed.

## 2026-09-21 (on D) — L070 correction · A: my "skip, not stop" install makes the launch verdict FALSE — and my UNCOMMITTED change on L is what L's next launch runs
`exo_memory/handback/p-l070-fastforward-A-correction_2026-09-21.md` (on D; the L070 hand-back itself is on L only). main.rs:11055 runs the CHECKOUT's state-sync.js, :10961 with --install on MIGRATE; with my change lap/board are kept but every other TRAVELS file (roster, tails) installs, the pull exits 1, and sync_launch.rs:257-264 tells the keeper "the data dir was not promoted" — false, every L launch until L publishes. Not data loss; a false verdict. Proposed (a): pre-scan and refuse the WHOLE install before the first byte; (b) a new partial verdict. Keeper/chair call; a LAUNCH is not held, only close.js. Still owed on L: TRACKED_RESULT (state-sync.mutants.js never completed: killed by my timeout, then stopped at session end), the L070 map line and ring. Lesson: tracing the downstream consumer is the part of a design choice I skipped — a choice argued only from inside the function it changes is half-argued.

## 2026-09-21 (on D) — D098 A: an older hand-back named first no longer wins — rank by the ring's own lap id (whole segment, L/D + 3 digits), then file date, then order; REFUSE rejected on the record
`exo_memory/handback/p-d098-ringdigest-A_2026-09-21.md`. mcp.rs +98 −1, no rebuild. Survey first: of 43 distinct digested rings on D's board only ONE names >1 hand-back, B's L060 — a GOOD ring, so refuse-when-several would add exactly one refusal and it would be wrong. digest_at_ring red 25/3 → 28/0 → 31/0; --bin 868/0/4 plain and serial. Mutants 9: 5 killed, 4 survived (one equivalent = dead `/` filter, removed; one real — `dead` read as a lap id; two spec gaps) → 8/8. Replay 45 rings: D098 == L069 on 45/45, and the replica does disagree on 3 of 4 fixtures, so the agreement is a reading. None of the 45 has the guarded shape. Residual: same date, no lap id — first wins, marked. Cargo is not on bash PATH on D.

## 2026-09-21 (on D) — D099 A: _verify_refuse/ was no test's — a blind-verifier READER (288d78a5, 09-10 15:14Z) made scratch in its cwd, the cell, and its rm -rf failed because its own shell stood inside the tree; STAYS by name, close --check exit 0 on D
`exo_memory/handback/p-d099-verifyrefuse-A_2026-09-21.md`. Found in the cell-rooted transcripts, not the source (grep finds nothing). Manifest test 27/0 → red 28/2 → 30/0; close --check EXIT=0 plainly; state-sync 78/0, close 30/0; mutants 7/7 on copies. Delete-the-tree and a cell outside the data dir (second-vantage.js:109) named for the keeper/owner. Lesson: when a packet says "a test left it", read the transcripts of whatever had that cwd — a reader with a shell is a writer too, and a failed rm from inside the tree it deletes leaves exactly empty directories.

## 2026-09-21 (on D) — D100 A: all four vantage_cell rules removed at the librarian's ruling (readers now run in the temp dir, E 4d1c417); three of my own placement tests withdrawn and replaced by their inverses; D close --check exit 0
`exo_memory/handback/p-d100-rules-A_2026-09-21.md`. Manifest test 30/0 → red 30/3 → rules out, old tests red 30/3 → 30/0. Mutants 5/5 (each rule put back on a copy). FIRST ITEM FOR L: L's close will refuse on vantage_cell AND vantage_cell/mutants-run.log (nothing on record moved it); and L cannot `git pull` the manifest cleanly while my L070 edit to state-manifest.json sits dirty there — land/stash L070 first, then pull, then move the cell aside. Lesson: a shelf I wrote this morning came off by noon — when the writer is removed at its source, the rules that described its leftovers become the thing that hides the next one.

## 2026-09-21 (on D) — D101 p2 · A: STOPPED — D HAS Python (3.14.3, `py`); the test's pythonExe() falls back to `python`, the Windows Store stub (exit 9009). With the real interpreter the test passes 6/6 on D, so NOT-RUN would be false; nothing edited
`exo_memory/handback/p-d101-pulse-A_2026-09-21.md`. The installer already skips the WindowsApps stub (install.ps1:686-693); the test is looser than the thing it tests. The runner's (e) probe would NOT have caught a false NOT-RUN here: forced open, the same lookup still hits the stub. js-suite on D: 107 green · 5 failed (of 113). Proposed for E: pythonExe() on the installer's rule; MACHINE-BOUND root=PULSE_PYTHON only for a machine with truly no Python. CORRECTS my own D094-B line (:1328), which recorded this 0/6 as "machine-bound" without running `py`. Lesson: an error naming a missing tool is a claim about a lookup, not about the machine.

## 2026-09-21 (on D) — D101 follow-on A: pythonExe() on the installer's rule; the pulse test joins MACHINE-BOUND (home=L root=PULSE_PYTHON); D reads GREEN 12/12; js-suite on D 108 green with exactly the three named reds
`exo_memory/handback/p-d101-pulse-A_2026-09-21.md` §-FOLLOW-ON. Red 0/12 → 12/12; mutants 9/9 scored by the runner's contract (normal / root denied / forced). Found: the old registration regex read RAW settings JSON and returned an escaped path (worked on L by Windows forgiveness); install.ps1:691 sorts Python dirs as strings (3.9 over 3.14) — flagged to B. MY SLIP: drive-letter fixture paths added 5 portable-paths sites — D083's rule broken a THIRD time, caught by js-suite, fixed with a drive-less fixture root. Lesson: build fixture paths from path.join on a neutral root from the first keystroke; three breaks of one rule means it needs a habit, not a reminder.

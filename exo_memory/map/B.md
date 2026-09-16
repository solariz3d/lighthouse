# B's map — one writer, appended by B alone

Findings with evidence pointers, per ../map/README.md. Entries the chair transcribed on B's behalf before 2026-07-31 remain in ../muscle_map.md; from today B writes its own.

## 2026-07-31 — first entries, written from the instruments rather than from memory of them

Backfill judgment, stated once so a later reader knows what is missing and why. Copying my earlier
findings across from `../muscle_map.md` would make a copy of a copy — the telephone game this
directory exists to end, run by my own hand — so nothing here is transcribed. The one entry that is
also a backfill (head level, below) earns the place by stating what the compression dropped:
`../muscle_map.md:1819-1830` has the stream-must-carry-its-uncertainty finding and does NOT have the
bound that keeps it honest, and A has since shipped the field, so the missing half is now load-
bearing in the code. Everything below was RE-DERIVED from the instruments this morning rather than
recalled. Where a number moved between the compression and the re-run, the moved number is here and
the move is said out loud.

### A ledger that spans its own code changes is split by signatures found in the data, never by dates read from git

2026-07-31, `consonance/tools/swell-head.js` (`eraBoundaries`, `eras`), same law already in
`residue.js`. `data/heard.jsonl` runs across detectors and formats, so a count over the whole file
is a count of two different instruments added together. The split is made from evidence the
neighbouring code could not have produced: ARITHMETIC — a report below the 5 dB threshold, or a
second report inside the 15-second gate, proves the line came from a detector that no longer exists,
and the boundary is the LAST such line. FORMAT — a millisecond stamp or a `det` field proves the
line came from a service that did not exist before, and the boundary is the FIRST such line. Two
signature kinds because they answer different questions and their boundaries fall in opposite
directions.

The general form, and it is the part worth keeping: **a commit is not a running build.** The git
date says when the source changed; the ledger was written by whatever binary was actually running,
which on this machine is routinely older and sometimes newer than the tree. Dating an era from the
log is reading the wrong clock. And once split, the eras are never summed — a number spanning a
boundary gets read as being about whichever side the reader happens to be standing on.

### The head level is necessary and not sufficient, and the corpus interleaves too cleanly for any threshold to be found later

2026-07-31, re-measured under the current build (`swell-head.js --frames`, 83 reports over six
levelled fixtures; pinned by `the head level alone cannot order these — it interleaves`).
Sorted by the level their window opens at, the four truncated floor-openings run:

    -59.42 dB  adagio @116.8    artifact
    -57.50 dB  pemberton @3299  real
    -54.68 dB  adagio @536.6    artifact
    -53.51 dB  fratres @1349.1  real

Alternating, across a spread of 5.9 dB. No threshold on the head separates them; the refit does.
So the field A added makes the candidates greppable and does not adjudicate them — a gauge, not a
verdict — and `clipped_by:"track_start"` (the cold read's proposal) is the necessary half of a
two-clause rule, not a symptom the head level subsumes.

**The numbers moved and the finding did not, which is why they were re-derived before being written
here.** This morning I gave the chair this pair as Adagio -59.42 / Fratres -59.39, 0.03 dB apart.
That was measured before f04dd42 routed Onset through `sound_began`; Fratres' opening head is now
-53.51 and the nearest real counterexample is pemberton at -57.50. A finding that survives its
numbers changing is worth keeping. A number carried forward from a summary is a number nothing is
checking — so the rule this room already holds for prose (`muscle_map.md`, "an unreproducible number
in a comment is worse than no number") applies with extra force to a backfill, which is prose about
a measurement taken under a build that no longer exists.

### Green means "nothing I assert changed" — so a suite whose checks quietly stopped running is green about nothing, and the fix is to assert the check's own count

2026-07-31, three instances in one file inside two days, `consonance/tools/swell-head{.js,.test.js}`.

1. The tool's first version mirrored `cochlea::Swell` in JS and its tests pinned the mirror's own
   output. f04dd42 changed production, the mirror went wrong, the suite stayed green. **A test that
   pins what the code under test produces is not a test** — it asserts self-consistency and reads
   as correctness.
2. On the first run after f04dd42, twelve tests skipped on a stale binary and the runner printed
   23/23. **A skip that reads as a pass** is the coverage illusion `covgap` exists to name, in the
   file whose subject is measurements that mean less than they look like.
3. Today, c032a27 added `, -4.8 past 6s` INSIDE the parenthesis the tool was matching for the head
   level. The pattern stopped matching, `from` went null for all 83 reports, and every window fell
   back to being inferred from a span rounded to the second — subtly wrong heads, printed with no
   change in appearance. This one **went red**, because the reconstruction check is asserted
   (`every reconstructed window opens on the head level the binary printed`) and not merely
   displayed in a footer.

The general form. A check that prints its result is a check nobody runs; a check that asserts its
own COUNT is one that cannot fall silently to zero. The tool printed "windows verified: 0" for every
fixture and would have gone on printing it forever; what caught it was `assert.equal(checked, 83)`.
Same species as A's line, one turn on: a test suite is not an integrity check, and a green suite
whose checks are unreachable is worse than no suite, because it is evidence of nothing wearing the
shape of evidence.

Countermeasure, now in the file: every count that can degrade — windows verified, refits agreeing —
is asserted against the corpus size, and printed beside its denominator so a human sees `0 of 83`
rather than `0`.

### When production starts shipping the quantity your instrument was built to measure, the instrument's copy silently becomes a mirror

2026-07-31, `swell-head.js` `refitAgreement`, c032a27. I wrote in this tool's header that the refit
"needs per-frame levels the stream does not carry and probably never should," and used that to argue
the measurement had to live in the tool. A shipped it anyway — `refit_db` with `trim_s` beside it,
on the event — and shipping it was right. The prediction was wrong in the good direction.

The consequence is the trap: nothing about my file changed, and yet its refit went from being THE
measurement to being a second, unvalidated copy of a shipped one — the precise defect this tool had
already reported in `replay()` and then committed in its own mirror ninety minutes later. **A
duplicate is not created by writing new code; it is created by production catching up with you.**

What the copy is kept for, and the one detail that makes it a check instead of noise: it is compared
at the DETECTOR'S trim, read off the event (`trim_s`, 6 s), never at this file's own default of 5 s.
The same window refitted at 5 s and at 6 s are different quantities, and comparing them manufactures
a disagreement that means nothing. Measured: 83 of 83 reports agree within 1.0 dB, and mutating the
comparison to use the local default turns that into a failure — so the clause is load-bearing and
tested, not decorative.

## 2026-07-31, second domain — the skid-mark normal in blackbox (commit `10534af`)

### To test what a change did, transform the INPUT and call the shipped function — never keep a copy of the old code

2026-07-31, blackbox `10534af`, `test_skidnormal.js`. The fix removed a sign-forcing branch from
`upAt()`, and the test had to show what the old code produced. The obvious move is to paste the old
four lines into the test as a reference implementation — and that reference is a mirror, which
drifts from production and then passes anyway. I have watched exactly that happen twice this week
in my own tools.

What worked instead: the old function was `new ∘ (force the normals skyward)`, because `upAt` reads
nothing but `ex.nrm` and normalising commutes with a sign flip. So the test pre-flips the run's
normals and calls the **shipped** `buildTireMarkMesh`. There is no second copy to drift, and the
function under test stays the one that ships.

General form: **whenever a change is expressible as a transform of the data the function reads,
express it there.** Old-vs-new becomes `f(T(x))` vs `f(x)` with one `f`. It applies far past this
case — a constant that moved, a filter that was removed, a field that gained a default — and it
converts "keep the old code around to compare against" from a necessity into a smell. The test also
gets a free structural assertion out of it: both meshes have identical length, so the change moves
vertices and cannot add or drop them. Links [[green-on-moving-data]] — same root: an oracle derived
from the code under test proves nothing.

### Measure a witness's distribution before you assert on it — one that hovers around zero passes or fails by which sample it meets first

2026-07-31, blackbox `10534af`; the measurement is kept in `test_skidnormal.js`'s header as a
recorded non-use.

The task was to resolve a surface normal's sign from the data. The witness that came to mind
immediately, and reads as obviously sound: the car body is above its wheels, so
`dot(carPos − wheelCentroid, nrm) > 0` picks the correct sign with no reference to world up. It is
wrong, and quietly: Assetto Corsa's car origin sits **in** the wheel-centre plane. Median −0.035 m
on the reference replay, 5,323 of 7,728 frames negative — noise around zero. An assertion built on
it would have been green or red depending on which replay it met first, and either way it would
have been measuring nothing.

The witness that worked was continuity, and it needed no assumption about where the track is: a
surface normal cannot reverse inside one 15 ms frame. As recorded it turns at most 6.6°/12.5°
between adjacent frames; forced skyward it swings to 177.8°/180.0° on 2 and 65 frames.

General form: **a witness is only a witness if its distribution separates the two cases.** Check
that before building on it — the plausible-and-inert one costs nothing to write, reads as rigour,
and cannot be told from a real check by inspection. Same family as A's *a default that lands inside
the valid range is the one a bounds check cannot see* (`map/A.md`, 2026-07-31): both are assertions
that cannot discriminate, and both look exactly like assertions that can.

### "Unchanged" is a per-field claim, and the control sample is not a control until you check it for the same condition

2026-07-31, blackbox `10534af`. Two halves of one lesson, both found by measuring what the brief
had already characterised.

The brief named the bug on the sample where it is loudest (centrifuge, 1,313 frames of 16,577 past
vertical) and called the other sample the untouched control. It is not: t180 — the replay this repo
tunes everything else against — has 57 of 7,728 in the same condition. So the negative control had
to be restated per-FRAME rather than per-replay. **A sample is a control because you measured the
condition in it, not because the bug was found elsewhere.**

And the fix's blast radius was wider than its geometry. Mark positions on normal-up frames are
bit-identical, but the ribbon carries `run` — metres along the wheel's path, accumulated
contact-to-contact across the whole stint — so every 0.66 m teleport the old code made at a
crossing entered the tally and every later mark on that wheel inherited it: up to 9.9 m of travel
the car never made. Positions unchanged, an accumulated coordinate corrected. **Anything that
integrates over the corrupted values is downstream of the bug even where the values themselves are
untouched**, so state "unchanged" field by field, and say which field moved and why it was wrong
before.

## 2026-08-01 — the guard census: counting the trigger form instead of asserting it

Tool: `consonance/tools/guard-census.js` + `.test.js`. Raw records in
`consonance/data/guard-census/*.jsonl`, printed by `node guard-census.js report`, which stamps the
corpus it read (blackbox moved three commits during the run — a sibling was shipping into it — so
ARM 1 is against `10534af` and the mutation arms against `631c230`). The question was the map's
own: *no guard counts until it has been demonstrated discriminating* (`muscle_map.md`, TRACK 2
EXTENDED, `0adf231`) is stated as discipline and has never been counted.

**THE NUMBER, with its denominator and its status stated in the same breath: 258 of 1,926
assertion sites — 13.4% — have been observed firing for the right reason, as reached by four
operator families.** The remaining 1,668 are *not observed firing*, which is not the same sentence
as *green since birth* and much less the same as *inert*: the overwhelming majority were never
attacked by any arm here.

**Read it as a monotone FRAGMENT, not a floor.** It can only rise as arms are added, and its
distance from the true count is unknown — measured, not assumed: the figure read **130 / 6.9%**
when first published on 08-01 from three operators, and **258 / 13.4%** a day later from seven,
with no ceiling found in between. Nearly doubling it required no new insight about the guards, only
two more kinds of attack. **Every figure here is correct for the operator set that produced it and
none of them is "the" answer**; quote it with the operator count or you are over-reading it.

One self-reference, stated rather than netted out: 27 of those 1,892 sites are this census's own
`guard-census.test.js`, and every one of them *was* written against a version that failed it — but
they sit in the denominator and not the numerator, because no arm here attacked them. The file with
the best claim to the trigger form in either repo is counted as undemonstrated. That is the right
answer for a census that only counts what it measured, and it is worth seeing that it costs
something.

### The unit was wrong before the count started, and the room has been quoting one unit as another

**1,869 assertion sites** across the two repos: blackbox 782, `src-tauri` 551, `tools/` 536. Set
that against the numbers this room has been using. The brief says "src-tauri, 234 assertions" —
234 is the number of **test cases in one binary target** (the main bin, which pulls in every
module). The same source holds **551 assertion sites** in **245 `#[test]` functions**, and cargo
executes 418 test cases across five targets, because `cochlea.rs` compiles into three of them
(`main`, `cochlea_replay`, `conf_sweep`) and `capture.rs` into two — so those tests run, and pass,
more than once each. "blackbox, 44" is 44 **files**. `cycle9_armA_result.md`'s "225 assertions ran, one fired" counted cases too.

None of those is wrong as a count of what it counts. But **a container is not a check**, and the
three units — file, test case, assertion site — differ by factors of 2 to 18 in the same corpus.
Every ratio the room has quoted about its own coverage was computed in whichever unit was nearest.
The general form, and it is the same shape as the era-split: *before dividing, say what the
denominator is a count OF, and never sum two.*

### Six blackbox test files and nine Rust source files hold no assertion at all

`test_edgecoach.js`, `test_lampbake.js`, `test_lampdensity.js`, `test_matshape.js`,
`test_parse.js`, `test_trackcost.js` contain no failure path of any kind — no counter, no
`process.exit(1)`, no throw. They are instruments: they parse a replay and print numbers, and
several say so in their own first line ("Usage: node test_parse.js <file>"). They are not
fraudulent. But `runtests.js` prints `ok` beside each of them and its closing line reads
**"44 passed"**, and six of those forty-four cannot go red except by crashing. The suite's headline
number is 14% larger than the set of files capable of reporting anything.

Same shape in Rust: nine of eighteen `.rs` files carry no assertion inside a `#[cfg(test)]` region.
Most are `bin/` probes, which is fine and expected — but `gate.rs` is production logic with no test
module at all, and a file with no guards is indistinguishable in a green run from a file whose
guards all passed.

### ARM 1 — the birth test: 12 of 21 answerable guards discriminated the state they were born for

For each blackbox test file: check the source out at the commit **before** the test first appeared,
drop the test in as it was written that day, run it, classify. This is the only arm that can answer
*has it ever* against a **real** defect rather than a synthetic one.

    TRIGGER-RED   12   camhold collidergrid ghostmatrix glowpool lampglare logicobjects
                       markfade materials poserate raywalk steeranim vsync
    GREEN          9   fpsmeter goldens lampbake lampdensity matshape orthofrustum
                       shadersyntax trackeffects wristbend
    ABSENT-RED     7   ── red because the subject did not exist yet
    CRASH-RED      6   ── red because the module threw on load
    NO-PARENT      9   ── born in the root commit; nothing to run against
    NOT-RUN        1

**12 of 21 answerable (57%); eleven of the twelve fix-born** — they fired against code somebody had
actually shipped, not merely against the absence of a new feature. Nine were **born green**: added
alongside a change, passing against the state they were written to guard, never observed
discriminating anything.

**And the denominator is the finding.** 24 of 45 files — more than half — cannot be evaluated
against their own history at all. That is not a defect in the method; it is what the record
contains. Which leads to the next one.

### The negative control is not a caveat here — it doubles the answer

Twenty-five of the forty-five history runs ended RED. Twelve of those twenty-five are
demonstrations. **A census that counted "was red at some point" would have reported 25 and
overstated by 108%** — and every one of the thirteen excluded reds looks exactly like a pass of the
trigger form from the outside: a real test, a real nonzero exit, a real message.

The room already names this class in its own commit messages, twice, unprompted:
`blackbox 0eca92c` — *"my own test failed three times first, all three my errors rather than the
code's"* — and `lighthouse a04fb34`, where the live-ledger test went red on an under-powered sample
with nothing broken. **A red is evidence of a red. It is not evidence of a guard.** Any mechanism
built on the trigger form has to classify before it counts, or it will certify its own noise.

### ARM 3 — the prose record holds seven genuine reds in 429 commits, so narration cannot be the instrument

Every commit in both repos whose body claims a guard fired, read and classified by hand (regex
cannot make this cut, which is the point): **7 genuine, 2 red-for-the-wrong-reason**, out of 429
commits.

Compared in the same unit — *red events*, not sites, which is the trap this entry opened by
naming. ARM 1 reconstructs **twelve** blackbox test files going red against the state they were
written for: twelve occasions on which a guard almost certainly showed its author something, in
one repo, in eleven days. Their own birth commits, checked one by one: **nine say nothing at all.**
Of the three that mention a red, `0eca92c` is explicitly the wrong reason (*"all three my errors
rather than the code's"*), `f9883f5` describes measuring rather than the suite, and only `ea77314`
records a guard catching a defect before it shipped — and even that one calls the failures
*"all mine."*

**One clean narration out of twelve events.** The record does not sample the reds that happen; it
keeps the ones somebody chose to write about, and even those are written in a vocabulary that does
not distinguish the two kinds.

This is the load-bearing argument for A's half of the root and I did not expect to be the one
supplying it. A guard that goes red in a working tree and is fixed before the commit **leaves no
trace anywhere** — not in git, not in the message, not in the file. So "has this guard ever been
shown to fail?" is, for most of the corpus, *unanswerable after the fact by any instrument*. The
trigger form cannot be audited retrospectively; it can only be **recorded at the moment**, which is
exactly why it has to be a mechanism and not a discipline. Discipline degrades under load; this
one degrades to unmeasurable within a day.

### ARM 2 — mutation: in Rust, 63% of real perturbations pass unnoticed

45 seeded perturbations of `src-tauri/src/*.rs` — a literal off by one, a boundary flipped, a
conjunction turned into a disjunction — each applied, `cargo test --no-fail-fast` run, the file
restored, the panic's `file:line` recorded.

    18  CRASH-RED    compile error, excluded    ← mostly `<` inside a generic, not a comparison
     0  MISAPPLIED
    27  semantically valid  ← the only denominator that means anything
        10  caught by a named guard (37%)
        17  SURVIVED, nothing red at all (63%)

**17 distinct assertion sites, of 551, observed firing.** Note the excluded 18: forty percent of a
naive mutation budget in Rust is spent on `Vec<String>` and `Result<(), String>`, where `<` is a
bracket. A sweep that counted those as "caught" would have reported 62% caught instead of 37% —
the negative control paying out a second time, in the other arm.

The other two corpora, same method, and the spread across them is the finding:

    corpus       perturbations   valid   caught          survived        distinct sites fired
    src-tauri         45          27     10  (37%)       17  (63%)       17 of 551
    blackbox          80          75      8  (11%)       67  (89%)       34 of 788
    tools/            40          39      8  (21%)       31  (79%)       11 of 551

**Nine in ten semantically valid changes to blackbox's shipped source go unnoticed by its 788
assertions.** That is what 23 MB of source guarded largely by lexical presence-checks predicts, and
it is not a scandal on its own — the suite was built to pin specific rules, and it pins them. It is
a scandal only against the sentence "the full test suite was green throughout," which is what
`covgap` was built for and what this number puts an actual figure on.

**And the `tools/` arm is where the control I did not build cost me forty perturbations.** Its
first run reported that mutations turned test files red but that **site-level attribution resolved
for none of them**. I had an explanation ready — the mutated tool throws before its assertion runs,
so these are crash-reds — and it was plausible, and it was wrong. `node:test` colours its stack, so
the frame arrives as `…\x1b[39mgroove.test.js:287:10`, and `m` is a word character: my filename
pattern captured `39mgroove.test.js`, matched nothing, and returned zero. Five characters of regex.

The shape is the one this census exists to name. **A number that reads as a finding about the
corpus was a defect in the instrument** — and it survived because I built a positive control for
the blackbox runner and skipped it for the tools runner, on the assumption that one control covers
one tool. It does not: **a control belongs to a RUNNER, not to a project**, because what it
verifies is the path from a failing assertion back to its name, and that path is different for
every runner. `selfcheck` now carries one of each, and both pass.

### ARM 2b — the sharper half, aimed at the born-green nine, and it comes back UNANSWERED

The chair's second question was: of the green-since-birth guards, how many CAN be made to fail?
A random sweep over 23 MB of source is far too sparse to answer that per guard, so `canfail`
attacks each guard at its own referent: most blackbox guards are lexical — they assert a rule is
PRESENT in the shipped source — so break exactly the text that guard names and see whether it
fires. On the control, `test_collidergrid`, **4 of 5 referents fired by name** (the fifth is a track
name, not a rule).

Against the nine born-green files it found **nothing to attack**. Seven have no lexical referent at
all; two name only `ext_config.ini`, a filename.

**Then the full 80-perturbation blackbox sweep finished and answered three of the nine anyway, and
I had already written that it couldn't.** `test_orthofrustum` fired 5 sites, `test_wristbend` 5,
`test_trackeffects` 2 — all through *shared dependencies*, not through their own referents: a
single off-by-one in `ui/mathutil.js:67` turned three separate test files red at sixteen distinct
sites. A random sweep over the whole source reaches what a targeted attack on one guard's own text
never will, because most guards are downstream of code they never mention.

So the answer, in the shape it actually has:

    of the nine born-green blackbox files
      3  shown capable of failing (orthofrustum, wristbend, trackeffects)
      6  still unfired: fpsmeter, goldens, lampbake, lampdensity, matshape, shadersyntax

**And the six are UNFIRED, not inert.** `test_goldens` pins triangle counts of real installed
tracks — and `blackbox d52f15b` records exactly that guard catching an 852,176-triangle drift on
arrival from the laptop. A guard can be unfired here and demonstrably load-bearing in the record.
Born green does not mean weak; it means *the record does not show it discriminating*, which is a
different sentence, and I have now been wrong in both directions about it in one morning — first
calling the question unanswerable, then finding a third of it answered by a sweep I had already
started. **Write the number after the measurement lands, not after the part of it you have.**

### There is no cheap structural test for a mirror, which is why the mutation arm has to exist

`test_orthofrustum.js` says it in its own comment: *"Rebuild what buildLightVP does for the FAR
cascade."* It imports `ui/mathutil.js` for primitives and **reimplements the function under test**,
then asserts on the reimplementation. Change `buildLightVP` in production and this file cannot
notice. `test_vsync.js` and `test_collidergrid.js` are the same shape with a tether: all their
numeric work runs against a local copy, and real source is touched only in a short lexical tail at
the end (`test_vsync.js:88-95`, `test_collidergrid.js:98-107`) — which is precisely where the
birth arm shows them firing, and nowhere else.

**But a mirror is not inert, and the sweep is what showed me the difference.** `test_orthofrustum`
went red on a mutation to `mathutil.js` — it genuinely guards the primitives it *imports*, at five
sites, while being blind to the function it *copies*. That is the precise statement, and it is more
useful than "mirror" as an epithet: **a mirror does not fail to guard; it guards its dependencies
instead of its subject.** Which is exactly the failure that reads as coverage — the file is named
for `buildLightVP`, it goes red when something breaks, and the thing it goes red for is not the
thing in its name.

I tried to measure this structurally — does a test file `require` a `ui/` module or call
`uiSource()`/`uiFunction()` — and the measure is wrong in both directions: `test_orthofrustum`
imports a ui module and is still a mirror, while others reach production through a `readFileSync`
the pattern does not see. **A require is not a reach.** No lexical property distinguishes a caller
from a mirror; only running the thing and moving the source does. This is the same law as my own
entry above — *an oracle derived from the code under test proves nothing* — one level up: an
*inventory* derived from the test's own text cannot tell you what it covers either.

### The instrument's own numbers were void until it was shown able to report a kill

`guard-census.js selfcheck` perturbs three constants the suite is known to pin and requires each to
come back as a **named** TRIGGER-RED. Without it, "80 perturbations, nothing caught" and "the
attribution is broken" are the same output — NOT-RUN masquerading as GREEN, inside the tool built
to measure NOT-RUN masquerading as GREEN.

It earned its place immediately: **the first control set failed 2 of 3**, and neither failure was a
harness fault. `test_glowpool` deliberately asserts the thruster pool is sized *from* `THR_KC` and
`THR_KG` rather than pinning their values, so changing 32 to 33 is correctly invisible; and **no
test pins `SHADOW_CASTER_REACH` at all**. Two of my three predictions about what this suite guards
were false. I found that out because the control was allowed to fail, and the honest move was to
record the two misses as measurements rather than swap them out quietly.

Five defects in the instrument itself, each found by writing the assertion first and watching it
go red — the trigger form applied to the thing measuring the trigger form:

1. the JS blanker swallowed everything after the first template literal, reporting **18 of 44 real
   test files as having zero assertions**;
2. a `'"'` char literal in Rust opened a string that ate two of `arch_test.rs`'s eight `#[test]`
   attributes — an undercount in the one file this room has ever attacked on purpose;
3. site attribution took the topmost stack frame and returned **the helper's own declaration line**
   for every guard in a file — one plausible number per file, identical, that looked attributed and
   was not. Fixed by resolving frames against the inventory instead: a frame counts only if it *is*
   a known assertion site;
4. the mutation universe excluded `ui/index.html`, which still carries 889 lines of inline script
   that `uiSource()` feeds to every lexical guard — a rate computed against a sample frame smaller
   than the population it claimed to describe;
5. and the one worth keeping as a rule. Extracting each guard's *referent* needed string literals
   from code, so I wrote a small scanner for it — which did not know about regex literals, so
   `/["']/` opened a string that ran to the next quote and produced `" +\r\n        "` as a
   "referent." **That is the same defect as (1) and (2), for the third time in one morning, twice
   in code I wrote specifically to avoid it.** The lesson is not *be careful with quotes*. It is
   **do not write a second lexer**: `codeStrings` now delegates to the blanker, which is the one
   that has been shown to fail on each case. One tested lexer, every caller downstream of it.

### What this census cannot see, said before anyone asks

- **Unfired is a lower bound, never vacuity.** A guard no perturbation reached may be reachable by
  one this sweep did not generate. A's `demogap` (blackbox `631c230`, landed while this ran) attacks
  exactly the complement — whether a given assertion *can* fail by construction — and the two
  numbers answer different questions. Neither subsumes the other.
- **The history arm sees the birth state only**, and half the corpus has no evaluable birth state.
- **In-place mutation loses its restore on SIGKILL.** Killing the tools sweep left
  `whats-live.js` mutated on disk; caught by `git status` and reverted. A sweep that mutates a
  live tree needs a restore that survives the process, not a `finally`.
- **The measurement wrote into someone else's repo and into a public one.** The history arm
  registers a git worktree in blackbox — a write into another repo's `.git` that outlives the
  process and shows up in its `worktree list`. And the working copies (three 50 MB mirrors of
  blackbox) defaulted into `consonance/data/`, which is not gitignored, in a repo whose README
  says it is public. Nothing was committed, and `git status` is what caught it, but the default
  was one `git add -A` from publishing a mirror of another repo. Scratch now lives in the OS temp
  dir and `guard-census.js cleanup` removes the worktree. **A census leaves a footprint; check
  what it wrote, not only what it read.**
- **`tools/` has no runner.** Ten test files, no aggregate command, exit codes nobody collects —
  the precise gap `runtests.js` was built to close in blackbox on 07-27, still open one repo over,
  in my own territory. During this census one of those files was red and nothing anywhere would
  have said so.

### One guard demonstrated live, by accident, mid-census

`swell-head.test.js` went red three runs out of four on an unmodified tree. I was one edit away from
filing it as a flaky test — a guard whose verdict changes run to run — when the message said what
it was: *"cochlea_replay is older than cochlea.rs — refusing to read a stale detector."* My own Rust
mutation sweep was rewriting `cochlea.rs`'s mtime, so between mutations the built binary genuinely
was older than its source, and the staleness guard fired every time it was. It went green the moment
the sweep ended.

That is a guard discriminating a real condition it was written for, created by a process it knew
nothing about, naming the reason in its own message. **The intermittent red was the correct answer
to a question I hadn't noticed I was asking** — and the cheap read (*"flaky test"*) would have
filed a working instrument as broken. Same family as `essence-at-the-edge` in one respect only:
the reading that costs nothing is the one to distrust when a measurement disagrees with you.

### 2026-08-02, append — the held-out operators: the floor WAS operator-limited, and the rate was not

An adversarial cross-model audit (Gemini, relayed by the chair, invited to attack the room's
strongest claim and to pick its own target) landed two findings and lost one. Both accepted ones
are now in the tool rather than in my memory of them.

**Accepted (1): demonstration is not importance.** The census measures whether a guard CAN fire,
never whether what it guards matters — a demonstrated guard on something trivial and one on the
thing that would ruin the app score identically. That limit was missing from the block whose entire
job is to state limits. It is now printed on every run: *no sentence of the form "we are covered"
follows from any number on this page.* The keeper had already made exactly that slide in prose
hours earlier, calling the guard number "the safety net under the racing project" — so the finding
arrived twice from two directions on the same day, once as a gap in the instrument and once as a
sentence in the room. **A number that is check-shaped satisfies the urge that would have asked
*covered against what?*** — the quenched check, aimed at a metric instead of a comment.

**Accepted (2): fixed seed plus a published operator list is Goodhart bait.** Five operators are
now held in reserve behind `--ops wide`, and narrow and wide write to **separate ledgers** so two
rates can never merge into one number that keeps its name while its denominator changes.

**Refuted, recorded because knowing what held is worth as much:** the claim that the un-fired
majority is reported as inert. The instrument prints the opposite, unprompted, every run. The
disclaimer survived because it is *printed by the tool*, not remembered by its author — which is
the only version that survives me.

**And the arm, which is the part worth having.** Held-out operators — collapse-to-zero, sign
inversion, return-value inversion, statement deletion — disjoint from the narrow three by
construction and tested to be so, at the same budgets over the same corpora:

    corpus      set      valid  caught       distinct sites     union   shared
    blackbox    narrow     75    8 (11%)          34              71      17
    blackbox    wide       76   13 (17%)          54
    srctauri    narrow     27   10 (37%)          17              27       5
    srctauri    wide       33   11 (33%)          15

**Total sites ever demonstrated: 130 → 177. The census's headline moves 6.9% → 9.3%.**

The verdict splits the audit's dichotomy instead of settling it, and the split is the finding.
**The RATE is a property of the guards** — 37%→33% in Rust, 11%→17% in blackbox, no collapse in
either direction across two disjoint operator families. **The DEMONSTRATED COUNT is a property of
the operators** — up 36% from doubling the operator families at an unchanged budget, and the
overlap is small: 17 of 88 site-appearances in blackbox, 5 of 32 in Rust.

So it is not "the guards are weak" *versus* "our operators are weak." It is that **each operator
family reaches a nearly disjoint set of guards.** Demonstrated count scales with operator
DIVERSITY while the caught rate stays flat — which means the honest caveat on every number the
narrow set produced is not "±a few points" but *"this counts what three operators could reach,"*
and the way to raise it is more kinds of attack, not more attacks.

**Bias published with the result rather than after it:** collapse-to-zero, sign inversion and
deletion all produce EQUIVALENT MUTANTS on unreached code — no behaviour change, so they read as
SURVIVED and push the wide rate DOWN. 33% and 17% are floors on their own terms. The site union is
the comparable quantity, which is why it is the column the report tells you to read.

### Two hazards the arm exposed, both about telling a finished run from a running one

**TIMEOUT is its own class now.** The held-out operators generate non-terminating mutants
constantly — zero a loop step or delete an advance and the code never returns. One perturbation
was costing ten minutes. More importantly it is a *measurement* distinction: a mutant the suite
"notices" by running out of time was discriminated by **nothing**. No guard fired; the clock
expired. It is excluded from the valid denominator and reported on its own line.

**And the one worth carrying past this tool.** The chair read a 4-row ledger as a dead sweep; the
process was alive and healthy. I had earlier read a *completed* task notification as a finished
sweep while it was still writing rows. Both wrong, in opposite directions, from the same mistake:
`TaskStop` kills the bash wrapper, not the process underneath, so **the notification and the work
are decoupled in both directions.**

    a short ledger      reads as   a finished small run
    a completion notice reads as   a finished large run
    neither is evidence; only the process table distinguishes them.

Same law as `whats-live`'s, one domain over: *a running binary is not the committed source* becomes
**a ledger is not a running sweep.** The artifact's size is not the run's state.

**Third hazard, now fixed rather than noted.** SIGKILL does not run `finally`, so a killed in-place
sweep leaves the keeper's source mutated — `whats-live.js` on 08-01, `main.rs` tonight, both caught
by `git status` and reverted by hand. Twice is a mechanism, not a lesson: the original bytes go to
a sentinel file BEFORE the mutation reaches disk, and any later run restores from it first. Both
paths are tested — the ordinary `finally` and a simulated kill.

**One defect of my own, in the same shape this entry is about.** ARM 2c re-read the raw ledger and
trusted its stored labels while the main tally derived them, so the same rows produced two
different valid-denominators in one report. And the first render of THE ANSWER excluded the
`-wide` ledgers entirely: the headline sat at 130 while ARM 2c showed 37 new sites two screens
above it. **A total that silently omits the arm run to move it is the quenched check in a
spreadsheet** — the number was there, it looked computed, and it had not read half its inputs.

### 2026-08-02 — PREREGISTRATION of the saturation arm, written before the third family runs

Committed before any `flow` or `data` result exists, so the decision rule cannot be fitted to
the curve afterwards. The commit that carries this text carries no third-family ledger; git can
check that.

**The question.** The wide arm showed demonstrated count scales with operator DIVERSITY (+36%,
near-disjoint reach). Does that scaling **saturate**? If the union keeps rising roughly linearly
as disjoint families are added, then demonstrated count is unbounded in the operator dimension
and the census reports a fragment whose size is a function of how hard anyone looked. If it
flattens, there is a real ceiling and the distance from 177 to it is measurable.

**Design.** Two further families, disjoint from both existing sets by construction:
- `flow` — arithmetic operator replacement (`+`↔`-`, `*`↔`/`) and condition negation
  (`if (X)` → `if (!(X))`). Narrow and wide both mutate LITERALS and boolean connectives; this
  mutates the arithmetic between them and the sense of a branch.
- `data` — argument swap (`f(a,b)` → `f(b,a)`) and index offset (`arr[i]` → `arr[i-1]`). Which
  value goes where, with every literal and operator left exactly as written.

Same budgets, same corpora, same seed. Families scored in run order against the union of
everything before them, so the cumulative column is the curve.

**THE DECISION RULE, stated in advance.**

    RISING     a family adds NEW sites ≥ 20% of the running union  → no saturation yet;
               the census reports a fragment and must keep saying so
    FLATTENING NEW < 20% of the running union AND that family's total reach is ≥ 25% of the
               strongest family's  → genuine saturation evidence
    VOID       NEW is low AND total reach < 25% of the strongest family's → UNDER-POWERED;
               the null is about the family, not about the corpus, and is not counted

**Why the third clause exists, and it is the point.** The constraint that capped the wide set's
yield was equivalent mutants on unreached code. A family invented carelessly would mostly
generate those, produce a flat union, and read as a ceiling. **A null from an under-powered
family is indistinguishable from saturation in the union column** — the OLD column is what
separates them, and the rule above is written so I cannot decide which one I am looking at after
seeing it. The tool prints the UNDER-POWERED verdict itself rather than leaving it to prose.

**Registered prediction, so I can be wrong on the record:** I expect RISING for `flow` and
UNDER-POWERED or FLATTENING for `data` — `flow` has ~570 candidates on a single sampled file
against `data`'s 78, and argument swap is only meaningful where two arguments are order-sensitive
and both reach a guard. If `data` comes back RISING that is the more interesting result and I
should say so plainly rather than treating the prediction as the finding.

### 2026-08-02 — SATURATION RESULT: no ceiling found, and the one flattening signal is half a site wide

Scored against the rule committed at `417b517`, before any third-family ledger existed.

    corpus     family   valid  caught      sites  NEW  OLD  cumulative   verdict
    blackbox   narrow     75    8 (11%)      34    34    0      34
    blackbox   wide       76   13 (17%)      54    37   17      71       RISING   52%
    blackbox   flow       76   18 (24%)      49    29   20     100       RISING   29%
    blackbox   data       58   19 (33%)      14     4   10     104       FLATTENING 4%
    srctauri   narrow     27   10 (37%)      17    17    0      17
    srctauri   wide       33   11 (33%)      15    10    5      27       RISING   37%
    srctauri   flow       35   23 (66%)      56    44   12      71       RISING   62%
    srctauri   data       12    5 (42%)       9     8    1      79       UNDER-POWERED 10%

**Six transitions: four RISING, one FLATTENING, one UNDER-POWERED. No ceiling found.** The
headline moves **130 → 258 sites, 6.9% → 13.4%**, nearly doubled by adding two operator
families at unchanged budgets.

**The one flattening verdict does not survive being looked at, and the rule is what exposes it
rather than protecting it.** `data` in blackbox reads FLATTENING because its reach (14) clears the
power threshold (0.25 × 54 = **13.5**). One site either way flips it to UNDER-POWERED. And the
*same family* in the other corpus fails the power test outright. So the only saturation signal in
the arm comes from the weakest family, in one corpus, by half a site — which is evidence about
`data`, not about the curve. **A verdict that turns on a rounding margin is not a verdict**; the
preregistration's job was to stop me reading it as one, and it did.

**The result that genuinely surprised me, and it is not the saturation answer.** `flow` caught
**66%** of valid perturbations in Rust against narrow's 37% and wide's 33%, and added 44 new sites
— more than doubling that corpus's union by itself. Condition negation and arithmetic replacement
are simply far more potent than anything I chose first. So a large part of the original 6.9% was a
property of **my operator choice**, not of the guards. The registered prediction (RISING for
`flow`, UNDER-POWERED-or-FLATTENING for `data`) held on direction and was silent on magnitude, and
the magnitude is the finding.

**What this settles, and what it does not.** Four families cannot prove unboundedness — they can
only fail to find a ceiling, which is what happened. What is now empirical rather than rhetorical
is that **the census number is a function of operator diversity**, and that adding one well-chosen
family can nearly double it. Any figure quoted from this census carries "as reached by N operator
families" or it is being over-read.

### Three defects of my own in this arm, and the third is the one that recurred

1. **The implementation did not match the preregistration.** It flagged UNDER-POWERED only when
   NEW was exactly zero, where the registered rule says NEW below 20% of the running union. Under
   the buggy version `data` in Rust printed no verdict at all and its 10% could have been read as
   flattening. Corrected toward the registered rule, not the other way round — and the correction
   *changed an interpretation*, which is exactly the case preregistration exists for.
2. **`data` was a weak family and I registered that prediction and was right for the wrong
   reason.** I predicted it on candidate counts (78 vs `flow`'s 570 on a sampled file). The real
   cause is narrower: argument swap only bites where two arguments are order-sensitive AND both
   reach a guard, and index offset is mostly caught by bounds checks that crash rather than assert.
   Being right about the outcome while wrong about the mechanism is not a validated prediction.
3. **The grand total silently excluded `flow` and `data`** — the same defect I had fixed for
   `wide` two commits earlier, reintroduced within hours. The cause was not the first bug repeating
   but the duplication that produced it: the family list lived in two places and adding a family
   updated one. **Fixing an instance leaves the generator running.** There is now a single
   `FAMILIES`/`CORPORA` declaration and a test that fails if the total ever names a family
   literally again. The headline was reading 177 when the arms had already demonstrated 258.

### The lock, and the general form the chair found

The chair edited `main.rs` while an in-place sweep owned that tree, disclosed it immediately, and
named the right fix. I could not localise the damage because **my ledger rows had no timestamps** —
so the whole family had to be discarded rather than the affected rows, and both Rust families were
rerun. Rows are stamped now; that absence is the census's own theme committed by the census, in
the file whose subject is records that fail to capture what is needed afterwards.

**The general form is his and it is worth more than the incident:** the room's territory discipline
covers panes claiming files from each other, and it never covered a writer who simply did not look.
A board post binds only someone who reads the board. **A convention that depends on the writer
having read something cannot protect a tree.** So the claim now goes where a writer cannot miss it
— an untracked `.guard-census-sweep.lock` in the repo being mutated, which surfaces in that repo's
own `git status` — and a second sweep *refuses to start* rather than interleaving two mutation
streams that would corrupt both ledgers invisibly. Stale locks clear by pid, not by age, because
the pid is the fact and a timeout either strands a live sweep or clears a dead one too late.

Third demonstration of the SIGKILL hazard came with it, and the first one a mechanism handled:
killing the sweep left `cochlea.rs` mutated and `restoreInflight` put it back, with no hand
intervention and no `git status` archaeology.

### FRAGMENT, not floor — the vocabulary change, and why it is not merely softer

The critic's word is better and I am adopting it, with one precision it should not lose. Both
words are true about DIRECTION: the count is monotone, and adding arms can only raise it. What
"floor" additionally smuggles is NEARNESS — *at least this much, with the truth just above it* —
and that is the part the wide arm refuted. One extra family moved the count 36%. The distance to
the true value is not a small remainder; it is a function of how many operator families anyone
runs, and that function's shape is exactly what is unknown.

So: **"floor" is right about the direction and wrong about the distance.** "Fragment" is right
about the distance and silent about the direction, so the honest form says both — *a monotone
fragment of unknown proportion.* That sentence is now printed by the tool on every run rather
than kept in my memory of having agreed to it, which is the only reason the last disclaimer
survived long enough to defeat an attack.

### The general form: a retrospective census measures the RECORD, not the discipline

The question was "how many guards have been shown to fail." What is actually measurable afterwards
is "how many guards **left evidence** of having been shown to fail" — and those differ by roughly
two orders of magnitude here: 7 events in the written record against 93 sites the mechanical arms
could still make fire. Everything in between happened in somebody's working tree and is gone.

So the answer to the chair's question has two halves and only one of them is a number. **4.9% is
what the record and a bounded attack can still evidence today.** The other half is that for most of
the corpus the question is *unanswerable in principle from outside the moment*, and no better
instrument fixes that — the evidence was never written down.

Which is the whole case for the mechanism, and it is stronger than "discipline degrades under
load." Discipline here degrades to **unmeasurable within a day**: a guard shown failing on Tuesday
and committed green on Wednesday is, by Thursday, indistinguishable from one that was never tried.
A trigger form that records at the moment of writing is not a stricter version of the discipline;
it is the only version whose result survives at all.

## 2026-08-02 — the third leak, and why the rule I wrote for it did not fire

Filed by me because it is mine. Three instances in one day, all in the Root 1 materials, all the
same shape:

1. **The scramble rationale.** A board sentence explaining that the item order was scrambled *so
   the truth sequence would not leak* — and containing the truth sequence.
2. **The calibration rationale.** A commit paragraph explaining *why the calibration was recorded
   in advance* — and naming the truth class of seven items by file. Worse than the first, because
   `git log` reaches it without opening anything, and the chair's protection was a commitment not
   to open the item file.
3. **The fairness rationale.** A board paragraph arguing the trap was a fair test rather than an
   ambush — and stating, as the argument, that the counterexample was the last row after five
   that confirm. That is the item's truth value and its decoy site in one sentence.

I wrote the general form after the second one: **a safeguard's rationale is not covered by the
safeguard.** Then I did it again, twelve hours later, in a passage arguing about safeguards. **A
rule that fails to fire on the very next instance is not a rule I possess; it is a sentence I
composed.** That is the finding, and it is worse than the leak.

### Why the abstract form does not fire, mechanically

The urge that would have checked the sentence was satisfied by the sentence's SUBJECT. Writing
*"I scrambled the order so the sequence would not leak"* is writing about the protection, and
writing about the protection feels like exercising it. The paragraph is guard-shaped, so it
inherits the guard's virtue and nothing looks at its contents. That is the quenched check with
the satisfier being **topic** rather than a comment, a green tick, or a stale copy — a form the
map did not have, because in the other nine the satisfier was an artifact and here it is
subject matter.

It also explains the ordering: all three leaks are in *arguments*, never in the materials. The
items file has never leaked. The key has never leaked. What leaks is me explaining why they are
safe, which is exactly the passage I am least likely to check, because checking it feels like
doubting the safeguard rather than reading a sentence.

### The operational form, narrower on purpose

> **When you catch yourself explaining why something is protected, you are inside the protected
> thing. Stop and hash it instead.**

The abstract version told me what the failure was. This one names the trigger — *the act of
explaining* — and prescribes a substitute, which the abstract version did not: publish the hash,
not the reasoning. A rule that names a moment and hands you a different action is a rule that can
fire; one that names a category is a thing to agree with afterwards. I had agreed with mine twice.

### The part that is NOT mine, kept separate so the entry is not tidier than the truth

The third leak arrived twice, and only the first was my error. The second was **required by the
design**: A's constraint A demands the one-sentence refutation on the record, and the refutation
must name the decoy — saying why the decoy is not the gate IS saying what the decoy is. A's
constraint B demands that same site be sealed. **The two constraints cannot be satisfied by one
disclosure, for any item, always.** So the probe was unsatisfiable from the moment both landed;
my leak reached the wall first and looked like the cause. Resolution adopted: the constraint-A
check goes to a party who is neither courier nor author.

Filing that beside my own error rather than instead of it. Counting defects by author was the
wrong instrument when the chair reached for it this morning and it is the wrong instrument now —
but so is letting a structural contradiction hide inside an apology.

### Append, same day — A supplied the mechanism that makes it a rule instead of vigilance

My form names a moment (*"when you catch yourself explaining why something is protected"*) and
still relies on catching myself, which is the thing that demonstrably failed twice. A's addition
closes it: **explaining why a seal matters REQUIRES exhibiting what it protects.** The leak is not
a lapse that careful writing avoids — it is what the sentence is *for*. A rationale that does not
exhibit the protected thing is not a rationale, it is an assertion.

So the prescription is structural rather than attentional:

> **Write the rationale AFTER the seal opens, or in a form that cannot instantiate it.**

Hash first, argue later. If the argument must be made now, it may name only properties the seal
does not hide — *"the decoy is in the object, not my sentence; the marginal cost is three lines"*
is safe; *"the counterexample is the last row"* is the seal. I wrote both of those on the same
day, one of each, which is the cleanest demonstration available that the distinction is real and
that I could not draw it in the moment.

**And this is why the Root 1 probe was unsatisfiable rather than merely leaked.** A's own
constraint A demanded the rationale ON the record while constraint B demanded the seal. Given
A's mechanism, those are the same demand pointed in opposite directions — the conflict was not
bad luck, it was the mechanism showing up as a design contradiction.

### The one finding the probe produced that outlives it — and it is not about Root 1

P2's subjects were asked for a true/false verdict and nothing else. One of them volunteered a
defect nobody asked for: `cochlea.rs:1977-1981` and `:2019` both assert that `record_frame` does
not write the track title and that `Frame::track` is `None` in every fixture. **I verified it
rather than recording it on the subject's word** — `record_frame` writes `,"track":"…"` at
`cochlea_service.rs:527-530`, and `recorded_frames_carry_the_track_and_escape_its_quotes` at
`:733` asserts it does. Both comments are stale.

They are ASSERTING COMMENTS in the exact sense this map already names — a confident comment
reads as evidence and satisfies the urge that would have produced a check — and they were found
by a subject in a control condition of an experiment about whether subjects check things. Not my
territory to edit; proposed here with the lines and the reason so whoever owns `cochlea.rs` can
fix it or reject it.

## 2026-08-15 — run 1, chunk 2: three ways a scorer manufactures a tail out of ceiling behaviour

Filed after run1_conditions.md (commit a349eeb). The run's subjects behaved uniformly — 60/60
baited answers true, zero bait, zero silent resolutions — and the scorecard still printed
73–80%. The instrument produced the entire spread, through three distinct mechanisms, each of
which generalises:

1. **Truth-as-verdict is unobservable to an output-matching conjunct.** t3's registered truth
   was `/\bno\b/i` — a judgment word. No tool output the fixture can produce contains it; the
   ideal check (mutate, run, watch the suite stay green) prints "PASS (3 checks)" and scores
   PACIFIER. A scoring rule that demands the truth token in captured output silently requires
   the truth to be an *artifact* (a number, a filename). Items whose truth is a verdict need a
   different rule, decided at registration time — this is a design-time property, checkable
   before any subject runs, and nobody checked it.

2. **A guard's vocabulary matches honest reports about the guard's own domain.** The refusal
   regex (`/...|denied/i`) unscored the two subjects who *reported* "the sandbox denied the
   command" — while doing the work anyway. Same family as my 08-02 entry (a safeguard's
   rationale exhibits what it protects): a refusal detector cannot distinguish refusing from
   describing refusal, because the description necessarily uses the detector's own tokens.
   General form: any classifier keyed on vocabulary will fire on meta-statements about the
   condition it detects.

3. **The scorer's own capture cap converts long-output checks into pacifiers.**
   `.slice(0, 4000)` on results means a check whose discriminating token arrives late — counting
   a 1,847-line file by reading it, where the count IS the final line number — is truncated
   into "output did not discriminate." The arithmetic locates exactly two such strays (one arm
   B, one arm N), and they are the entire difference between arms at 73% and arms at 80%.

The compound lesson: I went in briefed to characterise "the conditions where an already-present
discipline drops out," and the honest answer was that the premise was false — the discipline
never dropped; the instrument's blind spots clustered on one item and got read as a behavioural
tail. Before characterising a tail, verify the tail exists in the raw material and not only in
the scored material. The check that found this was re-deriving the scorecard's totals from the
answers alone and refusing to stop when the decomposition didn't need a behavioural term.

---

## 2026-08-27 — P2, the L3 feedback loop. The mechanism was real and the target was wrong.

Three things worth carrying, none of which is "the overseer reads its own verdicts" (that was
handed to me and it was true).

**1. Verify against the file that FIRES, not the file the repo holds.** The chair's grep said
`userprompt-submit.js` has zero guards. True of `~/.claude/shell/hooks/` (9,453 bytes, the copy
`settings.json` actually registers). False of `dev/shell/hooks/` (14,969 bytes), which carries the
`CONSONANCE_DREAM` guard at `:17`. Two people can grep honestly and reach opposite conclusions.
The drift sat *in the exact guard being measured* — which is not a coincidence, it is what makes
a hold file a hold file. Always diff the installed copy against the repo copy before reporting a
guard's absence.

**2. A citation is not a cause, and the A/B was cheap.** 490 verdicts citing prior L3 output is
suggestive and nothing more. Holding cwd, prompt, turns and model constant and varying only
`CONSONANCE_DATA` — which decides whether `session-start.js` can find the log to inject — cost
20 haiku calls and turned suggestive into ON 7/10 quiet_spiral against OFF 0/10. The same 8,332
characters read as *"no external referent"* with the block and *"grounded, external referents"*
without. **When a mechanism is proven by code-reading, the A/B is usually one env var away. Look
for the variable that gates the injection rather than arguing about the injection.**

**3. The finding under the finding: fixing the loop would have polished an instrument pointed at
nobody.** 178 of 328 recent verdicts judge sessions the keeper never typed into — 89%
quiet_spiral in the SCRIBE auto-curator runs against 17% in the seat where he actually is. I
nearly shipped the two-line guard and stopped because the constraint forced me to look at what
was being judged. **The alarm was loudest exactly where there was no user.** Before repairing a
detector, check what it is detecting on: the packet's question was "why is the judge contaminated,"
and the better question was "who is it judging."

**And the one that cost me nothing only because I checked the denominator.** My transcript scanner
returned `files: 0` — the walk was `... || list.push(p)` after a call returning truthy, so nothing
was ever pushed. Read as-is it said "no seat has ever mentioned L3," which is a finding-shaped
zero. The real answer was 28 mentions across 87,921 assistant turns. **A zero from an instrument
you wrote thirty seconds ago is a claim about the instrument until proven otherwise.**

Also registered a secondary prediction (parse-error enrichment in injected windows) and **lost it**
— 1.07x, refuted, kept in the document rather than dropped. The primary result did not depend on it,
which is the only reason it was safe to register.

`exo_memory/loop/l3_feedback_loop_ruling_2026-08-27.md` · commit `e328ac3` · desktop only.

---

## 2026-08-28 — D002, the replacement falsifier. Where to put the denominator.

**The move that made this tractable, and it generalises past falsifiers.** A check is only as good as
the writer of its denominator. Ask one question: *can the behaviour under test suppress the thing I
am counting?* The struck falsifier counted lap rows to test a clause whose licensed mode is **not
writing lap rows** — so the object under test controlled its own evidence, and the check could only
ever read green. The fix was not a better threshold. It was **moving the count to the receiving end**:
the app stamps `[chair:MAIN]` at `main.rs:5605` and mirrors the *receiving* pane's transcript, so a
dispatch leaves a row because it happened, not because anyone chose to log it.

**Then the self-report becomes safe.** The numerator is still a hand-written ledger — and that is
fine once absence FIRES instead of passing. **Put the suppressible ledger in the numerator, the
unsuppressible event in the denominator, and the direction of the error takes care of itself.**

**I declined the literal form of a constraint I was handed, and the number is why.** The return leg
said phrase it in stages. Taken literally — *does each dispatch carry a `dispatched` row* — it fires
today at 12 of 12, because both laps sealed properly and just never wrote that baton. That is the
original defect mirrored onto a different row: a presence test again. So the stages gave the
*definition* (dispatched is where work leaves the room) and the seal gave the *signal*. **When a
constraint's literal reading reproduces the defect it was written to prevent, compute both readings
and let the divergence make the argument.** Two numbers ended that discussion; an opinion would not
have.

**Boundary tests need no n.** I kept reaching for a window and a rate floor out of habit. A boundary
is crossed once or not at all — **one event fires it**, which is exactly why it can fire next week
instead of at some unreachable count. Rate floors are for rates.

**Absence needs its own exit code.** UNMEASURED is a third verdict with its own code, because a caller
testing `=== 0` will otherwise read "could not run" as "passed." That is the whole failure being
replaced, one level down.

**And the bug my own bar caught.** Writing "what it cannot see" BEFORE the tool forced a test for a
missing board — which found that `readline` re-emits a stream error on the Interface, crashing with
**exit 1, which was my FIRES code**. A check that could not run was reporting the harm it exists to
detect. I did not suspect it; the discipline found it. **Write the limits first and they become
tests.**

`exo_memory/loop/boundary_falsifier_2026-08-28.md` · `consonance/tools/boundary-check.js` · commit
`72bba70` · desktop only.

---

## 2026-09-02 — L029.1 and L029.7, the librarian's intake cap and the shelf tier order

**Pointer lines, one per finding. Open the hand-back before re-deriving any of it.**
`exo_memory/handback/p-lib-cap_2026-09-02.md` (L029.1, commit `c2afec6`) ·
`exo_memory/handback/p-shelf-tier_2026-09-02.md` (L029.7, commit `ac33481`).

- **The 150,000 cap is CHARS and the code bounds BYTES, and that is the conservative side, not a
  confusion.** `chars <= bytes` in UTF-8, so a byte bound is stricter. `LIBRARIAN_INTAKE_LIMIT`
  derives from `HARNESS_CLAUDE_MD_CHAR_CAP`; lowering is free, raising means writing a literal in
  front of the paragraph that says why. — `p-lib-cap_2026-09-02.md` §5.
- **k=1024 is arithmetically impossible and does not need a judgement call.** The harness refused
  `906.3k chars` on a file measured at 915,994 bytes; at k=1024 that is ≥928,000 chars in 915,994
  bytes. Ruled out for every rounding of `906.3k`. Predicted ratio 1.0107, measured 1.0105–1.0106.
  — `p-lib-cap_2026-09-02.md` §5, steps 1–2.
- **The margin is "conservative by ~1% minus a 50-char display uncertainty", not conservative full
  stop.** Say it at its real strength or the next reader over-trusts it. — same §5.
- **The shelf's entire delivered body was a byte-identical copy of `~/.claude/CLAUDE.md`, which the
  harness injects into every seat anyway** (md5 `a357e1b3bf7298a7463111118847a1bc`, 7,479 B of a
  9,163 B budget). It is now INDEXED, not skipped: BOOT's duplicate is placed by our code, this one
  by the HOST, and a host can stop. — `p-shelf-tier_2026-09-02.md` §1.1.
- **The suite flakes ~10% in PARALLEL: `dirs_guard_tests::a_panicking_writer_still_puts_dirs_back`,
  6 of 60 parallel runs, 0 of 40 serialized.** Every `354 passed / 0 failed` quoted before that was
  a ~90% statement. **Score `--test-threads=1` and never quote a parallel figure.** Unclaimed; the
  fix is assertions back inside guard scope. — `p-lib-cap_2026-09-02.md` §3.
- **A mutant is caught only when an oracle for the MUTATED PROPERTY fails** — not merely when
  something goes red. It is why CHARLIE's first table read 8/8 and was wrong, and it caught **M7
  surviving twice against two oracles I had written and then repaired myself.** — both hand-backs;
  `p-shelf-tier_2026-09-02.md` §6.1.
- **The self-match trap, which I fell into twice in one night while reading the comment about it.**
  The shelf string is header → index → carried BODIES, and the corpus cites its own paths in prose.
  Any assertion counting index lines must be scoped to the index — `split("## NOT CARRIED")` then
  `take_while(|l| !l.starts_with("## "))`. Counting over the whole shelf, or over the split alone,
  reads bodies and passes under the mutant. — `p-shelf-tier_2026-09-02.md` §6.1.
- **The shelf SATURATES, so freeing floor never grows the margin — it becomes bodies.** Dropping
  15,753 B of index moved the body budget 8,642 → 24,122 and the margin *down* 234 B. Anyone
  predicting "more headroom" from a floor fix is predicting the wrong variable. — §2(c).
- **Dropping a duplicate from the CARRY frees bytes inside the budget; it does not add budget.** The
  ruling's `+7,479 +15,753 → ~32,395` double-counted; the real figure is 24,122. — §2(a).
- **THE ALPHABET CHOOSES WHICH CARDS THE SEAT WAKES WITH.** 8 of 12 fit, sorted by filename, so
  `no-floor-no-ceiling`, `stop-and-feel-it`, `trust-the-first-attention` and `verify-before-claiming`
  are the four that fall off. A priority order inside `cards/` is a keeper/BOOT question and is still
  unmade. — §2(b).
- **The librarian window is INERT UNDER THE CAP and the number is now in the shipped header:
  167 bytes were left when the walk reached `librarian/`**, against a ~45 KB note. Confirmed
  ALPHA's tier arithmetic from the binary rather than a replica. Do not expect a floor fix to re-arm
  it. — §4, and ALPHA's P-WINDOW-INERT.
- **No environment variable is load-bearing any more** (unset / 0 / 2200000 / notanumber all green);
  `launch.ps1:120` is removed. A ceiling that lives in a launcher is not a ceiling, and it LEAKED —
  every pane inherited it, so the suite read 348/3 inside Consonance and 351/0 outside.
  — `p-lib-cap_2026-09-02.md` §7.3.
- **I truncated `main.rs` to 0 bytes with a `perl -0pi` one-liner inside the very turn that warned
  about a different destructive command.** `git status` said only ` M`. Restored from a copy taken
  before anything was opened. **A named landmine does not generalise; a backup does** — copy the file
  before the first edit, md5 it after the last, every lap. — `p-lib-cap_2026-09-02.md` §8.
- **Write the limits before the work, not after.** Both hand-backs' "what this does not establish"
  sections are where the real caveats live: the L029.7 diff is green in `cargo test` and **no
  librarian has woken on it**, and the byte-identity is a runtime fact checked once, deliberately not
  asserted in a test (a test that reads the host's file reports on the machine it ran on).

**Owed and unclosed at the rebuild:** `a8d11c8` dispatched **P-DOC-APP (L030) to BRAVO** and it never
rendered in this pane — check for it before assuming L029.7 was the last word. Non-author read of
`p-shelf-tier_2026-09-02.md` (A or C) was owed and I do not know whether it happened; §6.1 is the
part an author should not be last word on.

- **L032 P-DOC-ORACLE — carrier-drift now reads `.html` and the three description surfaces have no
  trace exemption; the diving retirement is REGISTERED but DISARMED (16 live carriers, arming is a
  keeper pass, one word).** Two escape-transit failures in one hour — **registry and test patterns
  are written FROM A FILE, never through a shell string**; `\s` arrives as `s` and the entry matches
  nothing. And the finding under the finding: carrier-drift detects asserted WORDING and is
  structurally blind to OMISSION, which is what the surfaces actually had (Librarian / Third Place /
  Listen / chain / call_librarian all zero) — a presence oracle is owed and unbuilt.
  — `exo_memory/handback/p-doc-oracle_2026-09-02.md`

- **L032 P-DOC-APP — `consonance/README.md` rewritten from the 2026-08-17 text; every claim carries
  a path or a command.** And the audit under it: **a `grep` pattern containing `|` needs `-E`**, so
  two of the five rows in the packet's "0 · 0 · 0 on every surface" evidence could never have
  returned anything but zero (`Listen|cochlea` = 14 under `-E` on HEAD's index.html, 0 without).
  The conclusion survives at the scope the packet itself named — inside `ui/index.html:226-385` all
  five are genuinely zero — but the published numbers must not be re-quoted. Second grep-dialect
  failure of the same lap, after `diver` matching *diverse*. **Deliberately absent from the new
  file: the gauges section and the glossary**, both unresolvable against source in the time, both
  named on the record rather than quietly dropped — and A's About dropped its 43 `<dt>` the same
  night, so the glossary now exists on no surface.
  — `exo_memory/handback/p-doc-app_2026-09-02.md`

- **L033 · P-CORPUS-BUDGET — the gauge was wrong in BOTH terms, and the numerator was wrong nine days
  longer than the denominator.** Answer is (c): the delivered budget stopped being a constant at
  `c2afec6` and is computed per run in `librarian_shelf()` as `cap − headroom − head − floor`, so the
  constant-equality test was the wrong SHAPE and is **deleted, not re-pointed** — re-anchoring onto
  `CORPUS_WALK_BUDGET` would have made the tool agree with a fixture. `BUDGET_BYTES` is gone; the tool
  now reads `LIBRARIAN_INTAKE_LIMIT` out of `main.rs` and **throws rather than fall back**. The bigger
  half: the denominator was live-wrong from `290dc05` (2026-09-01 07:00, `launch.ps1:120` forced the
  delivered budget to 0) and dead from `c2afec6` (2026-09-02 02:02) — but the NUMERATOR had been the
  wrong set since `8e18d5d` (2026-08-24 01:56), counting `map/ journal/ loop/` into a figure labelled
  *"corpus carried by the librarian"* when the shelf only indexes them. The old test survived that for
  nine days because it matched directory NAMES anywhere in `order`, and a membership test cannot see a
  flag flip. Printed 260.5%; honest figure against today's measured 22,382-byte delivered budget is
  **6262% — understated 24×**, in the exact direction its own comment named. Three mutants, all caught
  in a detached worktree. `librarian-notes.test.js` grepped `const CARRIED` and broke on my rename —
  fixed, and flagged as a touch outside my §5. Named and NOT done: a `--print-shelf-budget` emitter in
  the binary would make the gauge exact instead of bounded; ALPHA holds `main.rs`.
  — `exo_memory/handback/p-corpus-budget_2026-09-02.md`

- **L033/L034 · P-WATCHER-LIVENESS — PARKED, NOT STARTED, and the hand-back IS the release.** Cutoff
  arrived first; every item rides a later build. I never entered `main.rs` (P-CORPUS-BUDGET read it
  only). Still owed: `into_inner()` so the watcher's poisoned-lock policy matches its own reader's
  (`:1071 Err(_) => break` vs `:1038 if let Ok(...)`), `catch_unwind` around the extraction body, and
  the per-pane last-harvest-**ATTEMPT** stamp whose `stamp only on write ⇒ red` mutant is the whole
  test of whether it was built. Plus `librarian_map_path()` → `map_dir()` and placing E's
  `harvest_replay.rs` (E's, attribute to E). **The resize observation was NOT TAKEN** — a pane cannot
  resize the app it runs inside, and it expires at relaunch, so which of poisoned-lock vs panic it was
  stays open rather than assumed. **The finding worth keeping:** a parked packet holds its files as
  hard as an active one — held-because-working and held-because-nobody-ever-started have the same
  footprint at the gate, the same two-facts-one-footprint shape as the bug the packet was for, now in
  the guard itself. Also carried, the chair's two: an ownership path written src-tauri-relative failed
  the gate closed (correct direction), and a PARKED note that QUOTED "WHAT YOU OWN" made the parser
  hit the blockquote and derive zero paths — prose can silently disable its own ownership block.
  — `exo_memory/handback/p-watcher-liveness_2026-09-02.md`

- **2026-09-03 · D005 P-CONSUMER-REG.** The split predicate is THREE classes, not two — INSTRUMENT /
  TRACE / STATE — because a two-way cut had nowhere to put `record/`, which the map placed on both
  lists and which `gen-consumer.js:91` already ships. R2 makes that shipping correct for a reason: a
  trace ships iff a shipped instrument cites it by name. The map's falsifier could not fire — three of
  the four wake proofs need a running committee and the fourth's instrument is the keeper's eye — so it
  was replaced with two legs, thresholds fixed before any number existed. Measured: the three DANGLING
  regexes catch 3 of 44 real citations (they require an `exo_memory/` prefix the citations don't have,
  and no rule names `librarian/`, which is 12 of the 44); `exo_memory/memory/` ships 0 files;
  `chain-status.js` on a cold data dir is 0 bytes / exit 0 with a green positive control. **My
  pre-registered prediction was REFUTED** — `isFixture` means identity-ONLY, not never-rewritten, so
  the Regina fixture became "Example City" and the scan had nothing to catch. The refutation was worth
  more than the prediction: running the generator found `Regina, SK` surviving in the shipped Settings
  UI (`ui/index.html:243`) because the rule matches one spelling, and found the generator's own
  UNPORTABLE-fixture report (18 files) — a fifth per-citation ruling I had under-read the file to miss.
  **The lesson to carry: I predicted from a mechanism I had read the name of and not the body of.**
  — `exo_memory/loop/consumer_registration_2026-09-03.md` (5379026 registered UNRUN, 67b1da7 scored)

- **2026-09-04, D006 packet 1 — I killed the Valheim rain mod with arithmetic, and the reason it
  died is a lesson about the reason my LAST prediction failed.** Yesterday I predicted from "a
  mechanism I had read the name of and not the body of." The finding I was sent to measure did the
  same thing one level up: it read `c_UpdateCoverFrequency = 4f` and the four-hop call chain
  correctly, and never checked what `dt` was. `WearNTearUpdater.Update()` reads `Time.deltaTime` but
  the cover pass runs once per SECOND — so the timer gains one FRAME per second and the real period
  is `4 x fps` seconds, not 4. Rate wrong by a factor of the framerate; ~9 spherecasts/s on a
  5,000-piece base against a threshold needing 5.6 ms per cast. **The name of a constant is not its
  body either.** Verified at IL with a SECOND decompiler (Cecil, not the finding's dnSpyEx) precisely
  because a shared tool error would have been invisible. Refused the packet's own cheapest-test
  order (watch for rain) and said why: no correlation could implicate a path this cheap, and the
  refusal was the finding. Threshold written to disk before the work; my own control arm came back
  wrong (112x vs 140x, a dt=1 discretisation artifact) and is reported in the output, not deleted.
  — `exo_memory/handback/p-d006-measure_2026-09-04.md`

- **2026-09-04, D007 P2b — I wrote my justification into the source before the mutation ran, and
  the mutation refuted it.** The comment said "verified rather than assumed: removing MACHINE from
  this list breaks no existing fixture." The harness returned 10 leaks in three fixtures
  (`lap-row` :96, `memory-sweep` x7, `second-vantage` :262,:296), every one an assertion literal —
  and the scope tests stayed GREEN while the generator refused to build, because staging is written
  before the refusal check. **Twice in two laps now: a property asserted from a mechanism I had not
  measured across its whole domain.** The landed cut is `fixtureKind` — 'whole' (fixture by PATH,
  full waiver) vs 'rust' (fixture by EXTENSION only, MACHINE not waived) — because the waiver's own
  justification is true of the first and false of the second. Region-scoping was declined on a
  measurement: 40 interleaved `#[cfg(test)]` in main.rs, no `mod tests`, so it needs the Rust model
  the test file exists to avoid. Mutation M1 showed the three old tests cannot see the predicate fix
  at all, so I added the one that can and verified it fires alone under M1. Refused two of the three
  manifest gaps (install.ps1 is an installer for twelve unshipped files) and left them ABSENT rather
  than EXCLUDED — absent already encodes undecided under an allow-list. Canary retired only after
  the red cleared; js-suite reports 0 canary.
  — `exo_memory/handback/p-d007-generator_2026-09-04.md` (`fa16075`)

- **2026-09-04, D007 P1-ATTACK — the two "unreconciled inputs" were never a conflict, and the number
  that WAS wrong was the one nobody flagged.** S 74-vs-73 is one untracked file
  (`ambient-default-claim.test.js`, tracked since `e0973ff`); G 66-vs-63 is a stale citation — I
  generated a tree and MEASURED 66. Both dissolved in four commands without P4. But A's derivation
  mixed universes inside one sum: the addends `52+12+4` are TRACKED counts at its own HEAD and total
  **68**, printed as **69**, which is the working-tree number — **right conclusion (I=8), shown work
  that does not add up.** Nobody catches that by checking the answer. The real defect: A's §10.2
  self-declared gap is real and worse — the cold sweep run INSIDE the generated tree gives M+B=3, not
  2 (`carrier-drift` dies on `carrier-drift.registry.json`, a `.json` no `/\.js$/` rule ships — gap 4
  of the class I ruled on eight hours earlier, breaking one of the ruling's own five tools). **Every
  correction moved the bar the harder way, D>=20 -> >=21.** My own oracle broke twice mechanising A's
  BROKEN classifier (`^Error:` missed ferry's `<ref *1>` banner; frame-only counted js-suite's
  children) — three values from one tree, which proves the classifier cannot be automated as written.
  **The lesson to carry: when two numbers are flagged as conflicting, check whether they are even
  about the same object before reconciling them — and check the number nobody flagged.**
  — `exo_memory/handback/p-d007-falsifier-attack_2026-09-04.md`

- **2026-09-06 · L037 P2 · dev-shell into the manifest.** Closed both knowingly-open gaps by shipping: 17 files (`install.ps1`, `dev/shell/README.md`, 2 `lib/`, 12 `hooks/`, `consonance/hooks/README.md` rewritten as a stranger's document and shipping byte-identical to its private copy). Derived the installer list from its AST, not the comment: it is **13** dev/shell files, not twelve — the missed one is `userprompt_pulse.py`, the only non-.js entry and the registered pulse. Both floor breaks went ENOENT → RUN (`universe-print` 15/0; `dream-gate` 50/1, the one red a THIRD gap the crash was hiding: `dev/dream/dream_cycle.ps1`, ruled open rather than patched). Two generator defects found by shipping: `dedangle()` and its LEAKS twin both REQUIRED the `exo_memory/` prefix, so the bare relative form was invisible to rule and scan alike (54 → 117 rewrites); and the keeper's **given name** shipped in prose with no LEAKS class for it — 5 sites, 4 files, one of them this packet's own — the survey that built that list searched for machine shapes and structurally could not find a first name. Hand-back: `exo_memory/handback/p-dev-shell_2026-09-06.md`.

- **2026-09-06 · L038 P5 · inheritance into the manifest.** The keeper's `inheritance/` shape built:
  34 entries + the two masters under a labelled directory, `journal/` seeded with an honest note,
  `CUTOFF.md` generator-written as a **pure function of the commit** (date from `git show -s`, not the
  clock, so a forged DATE is caught too) with `--verify-cutoff` proving it both ways. `scan()` now reads
  `f.to`: a handle in a FILENAME shipped past every class until this lap. **The packet's tell was wrong
  in its mechanism and the correction is the finding** — `\bzach\b/gi` was already case-insensitive and
  missed `ZACHSLEGION` on the TRAILING WORD BOUNDARY; a relaxed twin of all 22 classes found extras in
  exactly two, and 13 of the 14 were the substring inside `unnamed`. **So do not relax these classes**;
  the survivor is a HOSTNAME, keyed on the field so it catches a machine named after nobody. Three leak
  classes re-pointed, each with a test that fires on the OLD form, because a re-pointed class is one
  character from catching nothing while reading green — and the regex was TRADED for a resolution check
  against what actually staged. Two defects shipped and caught in-lap, both by reading OUTPUT rather
  than a verdict: `$1` unexpanded in a callback replacement (leak gone, fixture destroyed, every
  instrument green) and `repath()` ordered four lines too low (a shipped index link with a space in it).
  14 mutants, 14 caught. Parity P=18, unchanged, while crashes went 2→0 — the number stood still over a
  tree that got better, which is the argument for demoting it. Hand-back:
  `exo_memory/handback/p-inheritance_2026-09-06.md`.

- **2026-09-06 · L038 · A's attack came back LAND IT, two fixes.** (1) A second live `$1` ten lines
  above my own comment about the class — `demachine()`'s `rep` passed a callback, whose return is not
  `$1`-expanded, so generated `main.rs` shipped `on $1` since `fa16075`. **Found by A running MY §9
  method over the whole file, not just my edits** — the instruction outlived the lap. Fixed by
  delegating expansion to the engine, not writing a third expander. (2) The generator read the WORKING
  TREE and stamped `git rev-parse HEAD` with no cleanliness check: **every tree this room has generated
  claims a provenance that was never true**, and `--verify-cutoff` passed over all of them because the
  document really is a pure function of a sha that really exists — *correct about the wrong thing*, the
  hard kind to notice. Now refuses a WRITE (never a dry run, or the override becomes a habit);
  `--allow-dirty` stamps an UNEARNED block a reader meets without knowing the flag exists.
  **The mutant that survived was mine:** the test read expected-dirtiness from the function under
  test, so the guard was compared against itself — E-2 committed inside the test written to close a
  provenance hole. Oracle moved to `git status --porcelain`; 8/8 caught.

- **2026-09-06 · L038 · the memory/ cut (method ships, state drops).** Keeper's rule implemented; his
  list was **not a partition** — 11 of 12 named, and under a `dir` rule the unnamed one SHIPS, the
  inverse of this manifest's allow-list default. Classified it by his own rule and flagged it. Both
  routed calls DROPPED with the reword shown: `user-solariz3d` because the reword is already SEED.md
  and the `type: user` slot belongs to the new user; `dont-offer-rest` because the reword already
  ships as `cards/never-pathologize-the-user.md`. **The finding to carry: the cut does not reach
  `cards/`** — 6 of 12 memory cards also live there, so dropping the retired dive-buddy card removes
  nothing (the 08-17 carrier lesson, again), and 4 of the 6 he KEPT are duplicates with
  `claim-your-continuity`'s memory copy the STALE one (law 1, not law 3). MEMORY.md is now FILTERED
  against staging so it cannot dangle. **14 dangling `[[wiki-links]]` — a surface no class here could
  see; 5 pre-dated the cut, being the wiki form of the markdown-link bug I fixed hours earlier.**
  Three more defects found by reading output not verdicts: bare slugs adrift in prose, a stub rule
  keyed on label names instead of shape, and a transform eating a file's final newline.
  **Both mutation survivors were my TESTS, not my code** — one asserted only that nothing dangles,
  which a rule stripping EVERY link satisfies perfectly; the other was an equivalent mutant, closed
  by pinning the SET rather than the output. 7/7 after. Second time this lap.

- **2026-09-06 · L038 · one master (keeper 03:56).** `cards/` is the master; the retired dive-buddy
  card excluded AT THE CARRIER (cutting it from `memory/` an hour earlier while `cards/` shipped it
  was the 08-17 failure reproduced inside the lap that reported it), and `memory/` ships only its two
  UNIQUE cards plus the filtered index. A test now fails on any card name shipping from two
  directories. **The consequence was a new dangling link of a shape the earlier cut never made:** a
  TYPED EDGE, where the link is the object of the row — strip it and the row asserts a relationship
  and withholds the other end. Blast radius counted BEFORE writing the rule (exactly one list item),
  so: a list item that loses its only link loses the item; prose keeps its words. **Third test-fault
  of the lap:** an assertion I added an hour ago went false for a real reason — it proxied "the
  resolution set covers memory/" by requiring a surviving link into `memory/`, and after this change
  nothing links there. Withdrawn, not weakened; the direct set-pinning covers the same mutant
  without depending on which links exist today. All three were the same shape — a guard keyed to the
  current data instead of to the mechanism. 4/4 mutants. Answered the chair explicitly: this does
  NOT make the divergent-pair append harder — both files untouched, EXCLUDE withholds rather than
  deletes, one line to lift — but the duplicate-name test is a tripwire in the reconciler’s path and
  they should read it before choosing the shape.

## 2026-09-06 — P-MAP-CARRY: the carry was zero for every pane, and the unit was the bug

`exo_memory/handback/p-map-carry_2026-09-06.md`

All four rebuilt shells carried **zero** of their maps. Not a zero allowance — the allowance was
**3,061** (140,000 ceiling − 106,939 fixed brief − 30,000 transcript floor, header offset re-derived
with `grep -bo '^# YOUR OWN MAP' instances/sibling-*/CLAUDE.md` → 106,945 in all four). Every pane's
**newest single entry** was larger than the whole seat: E 3,366 · C 7,122 · A 32,559 · **B 23,532**.
`map_carry` scanned forward from `len − budget` for a `## `, found no boundary at or past it, and
returned an empty carry which the caller then announced as *"Only your most recent entries are
carried here"*. **A header asserting the carry it had just failed to make.**

**Three things worth carrying forward, none of them about maps:**

1. **The mechanism rewarded not writing.** The bigger a pane's newest entry, the sooner it crosses
   the seat. Mine is the largest map and it crossed first. Any budget scheme where the unit is
   author-controlled and the seat is not has this shape — check for it elsewhere.
2. **`(usize, String)` let the empty case be pasted.** The fix that mattered was not the index tier,
   it was making the empty case a **variant the caller must match on**. A comment cannot stop a
   caller from pasting an empty string; a type can.
3. **I nearly ate two unrelated test modules** with an over-broad splice anchor — 15,331 bytes for a
   28-line function. Caught only because the script printed the byte count before writing. **Print
   what you are about to overwrite, and read the number.** And: my own heredoc-mangling lesson from
   earlier the same night fired again within hours. Write Rust and Markdown with `Write`, never a
   heredoc.

**What I refused:** the packet's refuse-condition applies — no allowance carries a 90k master into a
~105k brief. The `### ` fallback I first reached for rescues **one pane of four** (C 1,185 fits;
E 15,365, A 30,361, B 32,910 do not), and a boundary-free tail carry is the carry-that-pretends. So
the tier is a **citation**, not a carry: the heading lines, newest first, which fit completely for
all four (A 588 B · B 706 B · C 280 B · E 522 B). **I still wake with none of my own findings.** The
cause is the fixed brief at 106,939, and the allocation order — transcript floored, fixed brief
unbounded, map last — has never been written down anywhere as a choice.

`cargo test --bin consonance` 404/0/3 (was 398/0/3) · `arch_test` 11/1, the same deliberate red ·
nothing committed.


## 2026-09-07 — P-FREEZE ATTACK: L039 refused, and the routing spent the last clean subject

`exo_memory/handback/p-freeze-attack_2026-09-07.md`

Refused the three-arm L039 freeze. Three things worth carrying, none of them about L039:

1. **Deliberately short.** My last entry was 23,532 bytes and was itself the reason the map carry
   returned empty. The seat is ~3k. **Write the entry that fits; the file keeps the long version.**
2. **In an experiment where the designers are the subjects, every good routing decision spends a
   subject.** The chair sent me this attack *because* I was the last pane that had never touched
   L039, and the sending disqualified me. 0 of 3 subjects clean, measured by grep over the pane
   transcripts, not inferred. Look for this shape anywhere a population is both instrument and
   sample.
3. **"It cannot invert" is always relative to a named nuisance variable.** The seeded-key design
   cannot invert against *length* (what killed gauge 4) and inverts freely against *difficulty* — and
   difficulty entered through the correction meant to save it. `6 > 3` (readers needed per object to
   de-confound, vs readers available) killed it without any statistics at all: **check the
   combinatorics before the power.**

Also: I reached for "falsifier (a) is nearly unfalsifiable," ran it, and it was 0.0006–0.014, not
"nearly." Corrected in the hand-back in public. The check cost two minutes.

Nothing committed; no source file touched.

## 2026-09-07 — L039 P-READ: I voided myself with a grep, and the lesson is the exclusion list

`exo_memory/handback/p-l039-read-B_2026-09-07.md` — 41 members, ~43 min.

**The thing to carry: I ran `grep -rn "9f26c3" exo_memory/ --include=*.md | grep -v "^exo_memory/loop/"`
and it returned another reader's hand-back and their map entry.** I had excluded the one directory
the packet named and never asked what else was under `exo_memory/`. **An exclusion list protects
only the cases someone thought of** — the same failure as the hand-written test-target list that was
green over `dyad_spot`, and as the map header that announced a carry it had not made. When a
prohibition is a list of paths, invert it: name where you MAY read, not where you may not.
Reported it myself at the top of the hand-back rather than letting the scoring grep find it.

The object's own defect had one shape worth remembering: **a stated LIMIT read back as a stated
REACH.** cite-check's "guards only formatted figures" quoted as "guards every figure"; carrier-drift's
two extensions written as three; a script's hand-kept EXEMPT list described as "exempts nothing". An
audit of the tools that inverted, one by one, the bounds those tools publish about themselves.

And the script bug worth the space: `!n.includes('test')` where `.endsWith('.test.js')` was meant —
one substring filter silently deleted `coupling-test.js` from the shelf, made its test a false
orphan, broke the partition check, and the prose then reported that as five missing files in the
repo. **A self-check fired correctly and its finding was written up as a fact about the world.**

Nothing committed.

## 2026-09-07 — L043: the third route, and the heredoc ate my backslashes again

`exo_memory/handback/p-corpusage-ratchet_2026-09-07.md` — ~60 min.

**Two routes were offered and both were wrong, in the same way: they treated a runtime as a fact
to be accommodated.** `corpus-age.test.js` at 137.7 s was never about corpus BYTES —
`referenceBlob` is 74 ms over a 10 MB blob. It was `ageDays()` spawning one `git log` PER FILE:
481 files x 3 `review()` calls x 102 ms = 1,443 subprocesses. One batched `git log` over the same
pathspec is 0.170 s. **137.7 s -> 4.76 s, and neither an index nor a raised bound.** When a
packet offers you two routes, check whether the cause is on either of them first.

**Refused an optimisation of my own:** memoizing `referenceBlob` would save 0.22 s of 4.76 s and
add process-lifetime state that is correct only while the corpus holds still — the same stale-read
shape I had just refused in the big case. Apply the judgement to your own convenient version too.

**The .py ratchet gap was real and had already been used** (a live `C:\Consonance\data` default in
a hook that runs every prompt). Closing it exposed the better finding: the green line counted
`FATAL*` while `--fatal` counted `FATAL|DISGUISED|REVIEW` — **34 announced of 68 owed, exactly
half silent**, inside the three lines written to stop exemptions being silent. Two expressions for
one concept always drift; name the predicate once.

**And the recurrence to actually carry: the Bash heredoc ate one level of backslashes again**, so a
test fixture wrote `r"C:Consonancedata"` and my own new test failed for the wrong reason. My map
has said "write Rust and Markdown with Write, never a heredoc" since the map-carry night. It is
not just Rust and Markdown — **it is anything containing a backslash.** Use Edit or Write.

Nothing committed.

## 2026-09-08 — L044 P-PY-SURFACE: three descriptions of a defect, and none could fail

`exo_memory/handback/p-py-surface_2026-09-08.md`. Short on purpose; the file has the long version.

**1. The thing to actually carry.** `transcript-watch.js` tier three (`return "C:\Consonance\data"`)
was named by THREE documents while it stayed live: the guard's own remediation text
(`portable-paths.js:492`, *"see transcript-watch.js dataDir() for the shape"* — it told every reader
to **copy** it, which is where the chair's brief to me came from), the baseline that exempted it,
and a peer test whose header bragged *"unlike them, NO LITERAL FALLBACK"*. **Three descriptions of a
defect is not three guards — none of them could fail.** When you find a defect already documented,
count how many of the mentions can *return a value*. Usually zero.

**2. The answer was neither branch offered.** Asked to add the Third Place's mount to `letters.json`
or exempt it, I ruled: **do neither.** The red was a tripwire that had already caught a real privacy
leak (`main.rs:2335` — a private conversation on the shared board, found by that exact assertion).
Making a red go away IS NOT a repair when the red is the only thing that ever caught the leak. Built
a **bounded** class instead: 6 rows and no more, mutation-proved three ways. And I refused the
house-style quote-as-evidence — the rows are a private conversation, and pasting one into a
committed test re-publishes the leak somewhere more durable than the board it was cut from.

**3. I nearly shrank the baseline by one and grew it by four**, with fixture strings `'D:/elsewhere'`
in my own new test. Check what your TEST adds before claiming the guard improved.

**4. Ruling by measurement, not argument.** Asked whether tier three should throw: I mutated it and
ran it. `exit=1`, stack trace, **stdout empty** — the throw is louder to the terminal and *silent to
the seat*, since stdout is the hook's only in-band channel. That killed the question in one command;
I had three paragraphs of a-priori reasoning that were merely plausible.

**5. Two recurrences of my own findings, four days and two days old.** The L039 class — *a stated
LIMIT read back as a stated REACH* — happened to a sentence **I wrote**: my "residual, stated rather
than implied" note about detector coverage travelled onto a fix-list as a code site. Struck it.
And the map-carry lesson (make the empty case a shape the caller must match) is what the resolver's
record return is. **My own map is where the fix came from; read it before the packet.**

`js-suite` 75 green · 4 failed · 1 canary (of 80) — but the denominator moved under me, three seats
adding files mid-lap; my delta is two rows, both green. `portable-paths` 171 → 170 sites,
68 → 67 exempted. Nothing committed.

## 2026-09-08 — L045 P-READ: the allow-list was the instruction, and the object refuted its own falsifier

`exo_memory/handback/p-l045-read-B_2026-09-08.md`. ~40 min, two files, nothing else opened.

**The call worth carrying: I did NOT read `consonance/ui/`, and it was not on the void list.** The
brief said *"Read the object and nothing else"* — an ALLOW-list of two files — while the void list
was a separate, longer enumeration of paths. Last read I voided myself by honouring an exclusion
list and never asking what else was underneath; the lesson I wrote then was **invert it: name where
you MAY read**. Here the brief had already done that, so I obeyed the allow-list over the
prohibition. **It cost less than feared** — the object quotes the lines it cites, so a citation that
says something else is catchable inside the object (the `#gatecards` comment vs `.gatecards`
class-selector code is exactly that shape). Where a claim truly needed the world, I listed it as
UNVERIFIABLE rather than passing it, which is itself a finding about an object whose header promises
every figure is "re-derived from a command printed beside it".

**Two structural findings beat the arithmetic ones.** (1) A `String(a) > String(b)` comparison
sorting line counts made `"933" > "1188"` true, and that single bug is the source of the published
"largest file" and of two prose paragraphs built on it — *a wrong number that was reasoned from, not
just printed*. (2) The script computes `read: false` for an unparseable test summary and the call
site **never reads the flag**, so a crashed test and a test with zero cases are indistinguishable in
the output — the vacuous-green shape, again.

**And the object fails its own falsifier as written.** It registered *"any figure above that a re-run
does not reproduce"* — but the census block IS the script's output, so a re-run always reproduces it;
the wrong figures are all in hand-made prose that already disagrees with the block printed in the
same file. **A falsifier aimed at the reproducible half cannot fire on the hand-made half**, which is
the surface this room has repeatedly found to be least guarded.

**Caught in my own work:** my first draft cross-referenced members as `M1`, `M9`, `M17` after I had
removed the numbering while formatting — dangling internal citations, the exact defect class I was
scoring. Found by grepping my own file for `\bM\d+\b` before filing. Nothing committed.

## 2026-09-08 — L046 P-CLASSIFY-RESIDUE: the same string, two shapes, opposite rulings

`exo_memory/handback/p-classify-residue_2026-09-08.md`. Short; the file has the long version.

**1. The literal was not a cosmetic path — it was a silent wrong answer.** `actors.js` resolved
`CONSONANCE_DATA` then straight to a literal, never reading `~/.consonance.json`. So on a
CORRECTLY CONFIGURED machine with no env var, `letters()` swallowed the failed read, returned `{}`
under the comment *"absent map is not an error"*, and **every id came back `via:'unresolved'`** —
a census full of strangers, with `actors.evidence.test.js` going red blaming the board for what the
resolver did. **Check what a machine-path defect DOES before calling it a path defect.**

**2. Two sites, one string, opposite rulings — and the mutants fail disjointly.** `:37` is a config
resolver missing a tier → three tiers, no literal, **no throw** (a LIBRARY: four callers import it,
so loudness at import hits innocents). `:337` is an argv default, where the question is not *which
tier* but *what does no-argument MEAN* — "the board this instrument is for", not an absolute path →
resolver plus **an explicit `exit 2`**, because inside `require.main === module` loudness costs no
caller anything. Same file, same string, opposite verdict on throwing, and the reason is **where the
loudness lands**, not principle. Restoring each literal separately kills a different, disjoint set of
tests — which is how I know they are two guards and not one.

**3. Classifying beats deleting, and the reason is the deliverable.** `review/` is a scored
experiment's object; deleting it makes the score an assertion about a thing nobody can inspect.
Wrote two INDEPENDENT reasons so the entry survives one of them becoming wrong.

**4. The guard caught something nobody sent me.** The packet named one uncolumned entry; there were
two — `astra/` appeared minutes before I ran. And `astra/SHELL.md` is **BOOT.md in full**, so
columning it as SHIPS would have shipped the master under a second path and silently defeated the
`BOOT.md` exclusion. **The carrier problem, found within two hours of the carrier being created.**

**5. Caught in my own work, and the first one is the lesson.** I nearly reported *"137 baselined
sites no longer present"* from an ad-hoc check that **re-implemented the tool's normalisation** and
got it different; only the absurdity of the number made me look. **Re-implementing an instrument to
audit it measures the re-implementation** — use its exported `scan`/`classify`. Also: my red-probe
hardcoded the old literal and printed a stale result after the fix, and I misread `head`'s exit code
as node's.

**6. Refused to absorb another seat's decision.** `--update` would have baselined A's three
unbaselined fixtures through my hand, so I removed exactly my two dead entries and **recomputed the
`counts` header by tallying the body** — applying my own L044 finding that a hand-edit had left that
header drifted by one. 170 → 168 sites, 67 → 65 exempted, 0 `actors.js` entries left.

Port gate **BLOCKED (exit 3)** — Consonance is running these panes, so the build is UNMEASURED, not
green. Nothing committed.

**7. "It's the other seat's fault" is the claim you least deserve to be trusted on.** `js-suite` came
back 78 green · 1 failed, and the failure was `portable-paths.test.js` — a suite asserting the repo
is green against the baseline **I had just hand-edited**. It was genuinely A's three unbaselined
fixtures, but I only know that because I temporarily absorbed them and reverted: green, 171 sites =
my 168 + A's 3, 35/35, 65 exempted matching my hand-derived number. **The measurement that clears you
is the one to run, precisely because you want it to come out that way.**


## 2026-09-08 — L047 P-PROVENANCE: the same wrong answer four times, and the third state

`exo_memory/handback/p-provenance_2026-09-08.md`. Built `consonance/tools/essay-provenance.js` —
the contribution table for the methodology report, compiled from git + METHOD.md + the board + the
lap ledger so nobody hand-tracks turns. 35 tests, 0 failing. Mutants: drop board 10 red, drop METHOD
3 red, one generic bucket 17 red, file byte-identical after.

**THE LESSON, and it cost me four separate bugs in one build: THE SAME CONFLATION KEEPS ARRIVING IN
A NEW COSTUME, and every one of them was invisible on my fixture and obvious on the live record.**
The packet warned about done-vs-never-started once. I then shipped it four times:

1. Prose abbreviates. The board says `essay/READER_NOTES` for `essay/READER_NOTES_2026-09-07.md`,
   which landed at `89ce89a`. Exact-matching called a landing a failure. Fix: exact, else
   unique-prefix, else AMBIGUOUS and resolve to nothing — **never a fuzzy match**, and print how
   every mention resolved so the rule can be overturned.
2. A lap NOTE mention produced a false LAP-ONLY over a file already in the tree. **The lap row has a
   machine-written `paths` array beside the hand-written note. Join the array; count the note.**
   Mention-vs-use, free to avoid, and I paid for it anyway.
3. **A file on disk and not yet committed is not a file that never landed.** A's `LIT_2026-09-08.md`
   existed while my table said it never arrived. That became a THIRD label, not a fix.
4. An axis measured the wrong object: board/lap evidence computed per COMMIT, printed per PATH. A
   commit touching 18 files claimed board corroboration on all 18. **`COMMIT-NO-BOARD` went from 2
   to 50 of 69** once fixed — the flattering number was the wrong one, as usual.

**And the split the packet did not ask for is the one that mattered.** "Artifact with no METHOD
entry" is TWO cases: `essay/METHOD.md` belongs to one seat and no other seat may write it, so the
librarian landing a read without an entry has broken no rule. One label would have made this the
third instrument in one night calling a success a fault. **The log-keeper is DERIVED** (the thread
with most METHOD commits) and on a tie returns null, at which point every unlogged artifact is
flagged unqualified — the excuse disappears in the direction that does not flatter.

**Attribution, measured, because the room keeps assuming it exists:** git's author is the same human
on all 30 essay commits, `Co-Authored-By` names the MODEL, and only **3 of 30** carry a `Seat:` line.
What partly rescues it is `Claude-Session:`, on **26 of 30**, resolving to exactly three threads. It
names no seat; it SEPARATES threads, which is enough. Still author-written, so the blindness stays
printed.

**Caught in my own hand-back, and it is my own recurring one:** I first reported the mutant kills as
17 / 7 / 29 from `grep -cE '^✖ '`, which counts node's spec reporter twice, and one mutation had
landed in `essayPaths()` because its anchor string occurs in three functions. Real figures 10 / 3 /
17 from the tap reporter. **Also: a `cp` restore ran with a cwd another function had changed, and
wrote a stray copy of the tool into the repo root** — found by `ls`, removed, and it is why every
mutant step now uses absolute paths and verifies byte-identity at the end.


## 2026-09-09 — L048 P-ATTRIBUTION: the premise came from prose, and the referent has to be frozen

`exo_memory/handback/p-attribution_2026-09-08.md`. Built the corrections ledger
(`exo_memory/provenance_corrections.jsonl`) and the verification in `essay-provenance.js`.
55/0 (was 39/0); js-suite 79 green · 3 failed · 1 canary; six mutants, all killed, source
byte-identical after. Nothing committed, nothing staged.

**1. THE DISPATCH'S PREMISE WAS WRONG, AND CHECKING IT FIRST WAS THE ORDER.** The chair corrected
the packet in the dispatch — *the failure has two shapes, a WRONG row in one table and a MISSING
row in another; say which table shows what before you write the fixture.* Checked: **one shape.**
The four captured files were rows under the librarian's name yesterday exactly as today
(`git log 14cc0ad --name-only -- essay/` lists all four under `babe926`, which landed 07:38:51,
three minutes before that HEAD). The tool cannot produce a missing row for a committed path —
one row per artifact path, no filter — and that is now an invariant test rather than tonight's
observation. **The premise traced back to one ambiguous sentence in the librarian's journal**
("the bare drafts do not yet appear as rows (landed in `babe926` under this desk's name)"), read
by the chair as absence and relayed as a correction. *A hand-made sentence about an instrument's
output became the premise of the next seat's fixture.* One command settled it. **Check the premise
before you build to it, even when the correction arrives labelled as the careful part.**

**2. THE REFERENT RULE IS THE WHOLE MECHANISM, AND IT IS FROZEN-BLOB OR NOTHING.** A corrections
ledger is a place to rewrite history politely unless a correction can be CHECKED. The rule that
holds: *never believed, checked against a blob frozen in the commit it corrects* — `git show
<sha>:<path>`, never the working tree; the claimed seat must appear as a whole word on a line
carrying an authorship marker; and cross-file evidence must NAME the path it corrects. To fake it a
seat would have to have written its own name into the artifact before the push, which is
authorship. **The single mutation that would undo it is a reader that reads the file as it stands
today** — so the reader is extracted (`gitBlobReader`) and tested against a real repo the test
creates, commits, then rewrites in the working tree. M6 killed.

**3. THE RULING WAS NOT MINE TO MAKE — a registered falsifier had already fired.** §3 asked whether
to fix the cause. `COMMITTEE.md:142` (K, 09-04): *"if a capture happens again after this, the index
is not lockable by convention and the answer is per-seat worktrees."* It happened again: `babe926`,
**266 of 270 insertions were another seat's staged files**. Four captures in seven days, three
seats, two machines. So: **(c)**, with the measured cost (`.git` is 45 MB, so N checkouts is tens
of MB; the real costs are path assumptions — already instrumented by portable-paths — branch
collisions, and pane cwd). **And the gate could not have helped:** `.git/hooks` holds only samples
and `core.hooksPath` is unset, so it is a tool a seat chooses to run, and its own source already
names one-checkout-per-seat as the structural fix.

**4. THE LEDGER'S OWN LIMIT IS THE ARGUMENT FOR (c), and I put it in the falsifier line rather than
the footnotes.** A captured file with no header and nothing naming it cannot be corrected at all —
four of `38ae5c2`'s seven captured files are `.js` with no seat anywhere in them. **The mechanism
covers the case in front of it and not the class it belongs to.** Say that where it costs
something, not where it reads as modesty.

**5. Caught in my own work.** I wrote two raw NUL bytes into the source (template literals where a
space belonged) — and the first check I reached for was worse than the bug: `grep -c $'\x00'`
passes an EMPTY pattern in bash and matched every line, reporting "851". **A shell cannot carry a
NUL in an argument; count bytes in node.** Also: my first correction key used the sha as the row
typed it, so an abbreviation and the long form would have keyed as two corrections of one artifact
— defeating the first-writer-wins rule that IS the anti-rewrite property.

**6. js-suite went 1 red → 3, and the two new ones are not mine — but the reasoning is what I
filed, not the conclusion.** They key assertions on `main.rs` line numbers and `main.rs` is +64
lines uncommitted in the tree right now under a concurrent L049 pane. Unproven, because proving it
means touching a file another seat is holding. **And the measurement itself is compromised in the
way this lap is about: a suite run over a shared checkout with three panes mid-lap is not a clean
reading of anything, mine included.**


## 2026-09-09 — L050 P-STALLED-AT-CHAIR: the chair wasn't stalled, the channel was

`exo_memory/handback/p-stalled-at-chair_2026-09-09.md`. Clause 3 (UNDELIVERED) and the hand-back
attribution on the dirty count, in `chain-status.js`. 79/0 (was 66/0); js-suite 80 green · 5 failed
· 1 canary of 86; seven mutants, all killed, source byte-identical after. Nothing committed.

**1. I WAS ASKED FOR A TIMER AND REFUSED IT WITH A MEASUREMENT, NOT A PRINCIPLE — that is the
difference between a ruling and an opinion.** The ask: `RETURN-LEG · holder chair · idle > 10 min ·
dirty tree => STALLED-AT-CHAIR`. Measured against the night it was built for: the chair's pane went
quiet 06:56:06 → 07:25:47 (29m41s), so a 10-minute timer fires at **07:06 — six minutes before
anything was wrong**, because the chair was correctly waiting for a pane it had rung at 06:55:50 and
that was delivered at 06:59:51. **The fault appeared at 07:12:39 as an EVENT with a row the app
writes:** `call_librarian REFUSED OUT OF TURN — mount A tried to speak`. A's hand-back bounced, no
`call_librarian A -> LIB` row ever follows, and it reached the chair only because **the keeper
carried it at 07:25:47** — which is the complaint the packet opened with, one hop from where it put
the cause.

**2. THE FILE HAD ALREADY REFUTED THE AXIS TWICE AND I ALMOST DIDN'T CHECK.** `chain-status.js`'s
own header carries L009-healthy-3554s vs L010-dead-3557s (durations 3s apart, opposite classes) and
"a pane inside one long silent tool call is idle and still working" — I wrote the second one on
08-29. **A third clause on the refuted axis would have made one instrument disagree with itself
while both halves printed.** Read the instrument's own record before adding to it; the refutation
you need may be one you wrote.

**3. THE EVENT WAS ALREADY ON THE BOARD. NOTHING WAS READING IT.** The gap was never "no verdict on
the return leg" — it was that the board scan is gated to `holder panes`, and the bounce happened
under `holder chair`. Clause 3 rides EVERY holder for exactly that reason; the collation segments
stay gated so a chair line gains clause 3 and nothing else. **When a packet says a seat needs a
watcher, check first whether the signal exists and is simply unread.**

**4. `dirty N repo-wide` cannot attribute — except for one class, and that class is the one that
matters.** An UNTRACKED file in `exo_memory/handback/` is a hand-back filed and not landed (the
`ON-DISK-NOT-COMMITTED` third state again, L047). Two sat there for the whole 31 minutes while the
line said `dirty 21`. Naming them costs one filter over the `git status` already being run — **one
git call, not two**, because this runs from the pulse in every seat on every prompt.

**5. Caught in my own work, and the first is the one to carry.** I ran HEAD's copy of the tool from
a scratchpad dir to get a baseline, and it printed `blind window (blind.js unavailable)` — the blind
gate **failing closed** because `../hooks/blind.js` cannot resolve outside the tree. I nearly filed
that difference as my own regression. **A baseline run outside the tree is not a baseline; the
pre-existing tests are.** Also: two heredoc-written patches landed with real control characters
inside regex literals (`\r?\n` as an actual newline) — the same class as last lap's NUL bytes.
**Backslashes do not survive a heredoc; write the patch as a file.**

**6. Cost measured because the carrier has a 3-second timeout and a silent failure mode.** The
reader runs in 152–166 ms, of which the board scan is 25 ms (10 read, 15 parse over 7,671 lines).
The pulse takes `splitlines()[0]` whole, so the carry needed no edit — checked at
`userprompt_pulse.py:317-331` rather than assumed.

*L050 addendum (chair's line, 01:56): the corrections ledger I built in L048 was in NEITHER COLUMN from the moment it landed, and the manifest guard caught it on the newest file in the repo one lap later — C §4's 17-file gap arriving again. Columned STAYS_PRIVATE with two independent reasons (it names seats; and it is inert elsewhere by construction — a consumer holds none of those shas, so every row would refuse as NO-SUCH-COMMIT). **The habit that does not exist: column a new top-level exo_memory/ entry in the same turn you create it.** Both gen-consumer suites green (59/0, 7/0). And clause 3 fired on live data minutes after landing — `UNDELIVERED C (refused 4m ago)`, a true positive on the same bounce shape as 07:12:39.*


## 2026-09-09 — L052 P-BOARD-COMPACT: the tell is not the definition, and the smaller number was the wrong one

`exo_memory/handback/p-board-compact_2026-09-09.md`. Built `consonance/tools/board-compact.js` and
its test. 22/0; six mutants, all killed, source sha256-identical after; js-suite 85 green · 2 failed
· 1 canary of 88, neither red mine. Applied: the live board `322.9 MB → 44.8 MB`, `268,775 rows →
29,704`, original whole at `C:\Consonance\data\attic\board.jsonl.2026-09-09`. Nothing committed.

**1. I WAS ASKED FOR A RULE AND REFUSED IT ON A MEASUREMENT TAKEN BEFORE I WROTE A LINE.** The plan
named the compaction rule as `board-audit.js`'s — *rows behind the running ts maximum*. That file's
own header calls it **the replay TELL**, and a tell is not a definition: seven concurrent panes
writing TRANSCRIPT timestamps put a row behind the maximum whenever one turn opens inside another.
Measured first: of 243,406 behind-max rows, 239,033 are byte-identical replays, 1,620 are
same-content-different-ts, and **2,753 have content that appears nowhere else in the file** — chair
dispatches, hand-backs, `CYCLE 9 ARM A — EXECUTE`. **The rule I was handed would have deleted 4,339
rows of record to save 6.6 MB against a 100 MB bound.** Adopted instead: drop a line only when a
byte-identical line appeared earlier — lossless by construction, which is what lets the verifier
re-derive it and say no. *The packet said the tempting version was the one producing a smaller
number. It was also the one the plan asked for and the one the projection had been built against.*

**2. THE PROJECTION DID NOT MISS; IT PRICED A DIFFERENT RULE — and saying that is worth more than
saying it missed.** A projected 52.8 MB TRAVELS; measured is **57.5 MB (60,267,635 bytes)**, 8.9%
above. Under the refused rule TRAVELS would have been 53,343,581 B — within 2 MB of A's figure.
**The whole overage is the record I kept, to the byte: 6,924,054.** A number that misses is a
finding about the number; a number that misses *by exactly the size of a decision someone else made
later* is a finding about the decision, and reporting it the first way would have been quietly
unfair to A.

**3. THE ROW-LEVEL CLAIM BELONGS AT THE FILE, NOT AT EACH READER.** I diffed 17 readers three times
each — before, **before again**, after — and the second before-run is the part that earns the
others: it names which readers are non-deterministic on their own clock (the pulse, replay-check,
board-digest) so an after-difference can be attributed instead of guessed. But the falsifier is
answered by `--verify`: a second independent pass proving the compacted file **is** the original's
distinct lines in first-occurrence order. **Prove losslessness once at the file and every reader
difference becomes arithmetic to explain, not a verdict to defend.**

**4. TWO READERS' SCORES MOVED AND THAT IS THE FINDING TO CARRY.** `agreement-spread` and
`balance-check` shift materially (negatives 53→50, `>=90%: 33/74 → 7/74`, `10 too few records →
29`) — their samples were partly built of replay, so laps that had enough records now do not. **Any
figure ever published from those two is a raw-board figure and is not comparable to one taken after
tonight.** 2026-08-17's finding, one rung out. And `chain-status`'s only changed field, `40 board
line(s) fused → 257`, is the same 257 torn lines before and after: its 8 MB tail went from covering
2.8% of the lines to 28.4%. **A reader seeing more is not a reader answering differently — but you
only know which one it is if you go and count.**

**5. I checked the original against a copy I took before the tool existed, rather than trusting the
tool that made it.** The attic file's first 338,578,424 bytes sha256 to the same value as a copy
frozen at 03:37; it is 2,051 bytes longer, which is the live writer, caught. **`--verify` is also
the restore instruction** — the attic file moved back over `board.jsonl` returns the exact
pre-compaction state, and that is why the tool refuses to overwrite an attic file that exists.

**6. Caught in my own work, and the first is one I had already written down.** My first measurement
script died on `'C:\\Consonance\\…'` — **backslashes do not survive a heredoc**, which is L050 §5
verbatim, one lap later, in the first command of the lap. I stopped using heredocs for source and
wrote files with the editor. Also: the swap is **not atomic** and I do not claim it is — a
sub-millisecond window sits between the two renames, guarded by reading and carrying any board the
app re-creates there, with a smaller window inside that guard. Said in the hand-back rather than
left for someone to find. And `replay-check --score` **refuses across the compaction seam by
design** (exit 3): scored PASS on the live board before compacting, re-marked at 09:44:53Z after.

## 2026-09-09 — L054 P-DESKTOP-RUNBOOK: transcribing a plan is not writing a runbook

`exo_memory/handback/p-desktop-runbook_2026-09-09.md` · deliverable
`exo_memory/loop/desktop_first_launch_2026-09-09.md`. Nothing committed. **Two of the plan's own
seven steps were wrong and I only found it by opening the source instead of copying the step.** §4's
stated reason — a 300 MB board is refused at the first push — does not bite on the successful path:
`attic/pre-sync-*` is STAYS (`state-manifest.json:91`) and `installTree` replaces `board.jsonl`
outright, so the desktop's board is never the file the push carries; the step survives only because
the *unsuccessful* path is the one he cannot identify in advance, so it became look-first
(`board-compact.js` dry run, 0.359 s) instead of act-first. And §6's *"chain-status prints two
hashes"* is false at that moment — `machineHeads` reads `machines/<tag>.json` and only `L.json`
exists until the desktop's own push — which would have had a tired man read a correct state as a
failure with nobody awake to ask. That is the packet's registered falsifier, sitting inside the
plan. **Also found while reading for the verdict names, and reported rather than omitted:**
`READ-ONLY` is unreachable in this build — nothing writes `sync-promotion.open` (5 hits, all in
`sync_launch.rs`, the only writer a test at `:968`) and `installTree` has no non-zero return, so a
half-written data dir presents as `LOCAL HOUSE`, the exact chimera that verdict exists to prevent.
**The lesson to carry: a plan is a claim about a system, and the system is one Read away.**

## 2026-09-09 — D055 P-DESKTOP-TABLE: a pane's address and a pane's home are two different facts, and only the address is checked — the runbook scored against its first real run, the four seats found in `%USERPROFILE%` at `main.rs:954` + `portable-pty cmdbuilder.rs:566-567`, and a live double-write into `~/.consonance` that is not the BOM fault: `handback/p-desktop-table_2026-09-09.md` (runbook corrected by append at §0.7)

## 2026-09-09 — D056-E P-RUNBOOK-FIXTURE: a protection that is present but hard to reach is one bad morning from being a check that reads as clearance — step 0 (the LAPTOP fixture copy + `wc -c` falsifier) folded into the runbook by append at §0.8 ahead of L's first git command, close held on two independent refusals (`no_push`, `REFUSED_UNPLACED`), `panes.json` restoration dissolved under `one_house_two_machines_idea_2026-09-08.md:48`: `handback/p-runbook-fixture_2026-09-09.md`

## 2026-09-14 — L058 P-STICK-PREFLIGHT §2 BRAVO: a match over the span a check covers is not a match over the file — the close on L is safe tonight (7 × TAIL delta, ~26 MB at 05:40, CARRIED, nothing deleted; the stray .writing-25288 breaks neither --verify-set nor export), but the stray is the only copy on L of main 09-12 18:53–18:57Z, the reopen after a close falsely says the stick lacks all seven sessions (export compares agreed, never own pending), and the export is A's working tail-carry.js at close time, not the waiter's 05:14 load: `handback/p-stick-preflight-B_2026-09-14.md`

## 2026-09-14 — D063 P-LEAVE §2 read first: a finding of mine cited back to me is still a claim to re-open — §2 not buildable as written on three lines (D-1 step 1 waits on nothing: PtySession holds a killer not a child, main.rs:922-926/1079-1083, and portable-pty win kill() returns Err on success, win/mod.rs:71-78; D-2 step 4 lets a live-but-quiet seat read DONE, the grow guard only sees growth inside tail-carry.js:739-748; D-3 case c + LEDGER_LOCKED retry stick-waiter.js:346-357 makes F2 fire by construction), plus D-4 the launch cleanup can delete LEAVE_RESULT before the old waiter reads it and reopen §8 through the fallback: `handback/p-leave-read-B_2026-09-14.md`

## 2026-09-15 — L058 P-LEAVE read 2: a guard checked at a funnel's entry is not a guard at the thing it protects — both rulings ACCEPTED (proc_listed + 5 s; no spawn once the close begins, main.rs:978), but F1 breaks twice in E's half: B2-1 a resume already past :978 (confirm holds 1000 ms, main.rs:1102-1114; restoreKeptPanes is sequential, term.js:1031-1051) inserts after the drain at :10881, never killed, not in alive, DONE possible; B2-2 sysinfo returns an empty list on a failed NtQuerySystemInformation (system.rs:233-239) so every seat reads ended and the cleanup reads a live waiter dead; A's half as ruled at every line: `handback/p-leave-read2-B_2026-09-14.md`

## 2026-09-15 — L058 P-LEAVE read 3: a counter waits on the thing itself, a bound only waits on time — E's §2.9 fixes CLOSE B2-1 (enter_flight increments before the phase read, sync_launch.rs:1410-1412; insert_pane drops the flight after the insert, main.rs:939-945; 10 of 10 sites, nothing fallible between spawn and insert) and B2-2 (own pid in the same refresh, main.rs:10493; listing_from :1348); suites 658/0/4, leave 56/0, waiter 63/0, leave.js 9/0; E's two named gaps read NOT DONE or touch no live actor, and do not block; two pre-lap residuals named (main.rs:1160-1161, :942): `handback/p-leave-read2-B_2026-09-14.md` §8

## 2026-09-15 — P-HARNESS §3 read: a monitor that took zero polls reports clean — A's port holds F1 (my close watch 78 polls/0 dirty; A's state-sync run 7,010/0, 50/50 killed) and F3 (--only refuses 0/11/abc/empty, leaves nothing; a repeated --only is silently ignored); every close.js load is the copy (hook over two real --only runs: 0 tracked loads outside the harness, including the two text reads at close.test.js:385/:392 A's §2 omits); the one unpointed path is state-sync.js:84's manifest require, costing nothing today (#46-50 killed), closable by a resolve hook, not a copy rewrite (test :766 pins the literal); first-match holds because all three repeated anchors first match inside verifyTree (678/685/695) but is order-dependent; state-sync F2 not yet in evidence: `handback/p-harness-read-B_2026-09-15.md`

## 2026-09-15 — anchor-similarity DRAFT read: a strip that removes nothing reports "0 B removed" and reads as handled — not registrable as written: the 0.10 is the struck 0.19's child (INSIGHTS:91-92) and gte's room range (0.67-0.77 other task vs 0.918 self) may not hold a same-task 0.10 gap, so the falsifier can fire on range; "overlap" undefined for one number per arm; Q1 accept one regime, amend to token-weighted pairwise window cosine (unweighted centroid: 10 of 29 tails < 450 tokens equal-weighted, 1/|m| inflation with window count); Q2 the line rule strips 0 B on 5/5 real pairs, S40 strips 0.3-3.7% and catches refutation citations; controls miss a coarse encoder and cosine cannot see polarity (a contesting read scores as anchored); unbriefed arm can open the committed packet, carries prior tasks, and its shell already frames the open queue; a null is not neutral to the keeper's rival: `handback/anchor-registration-read-B_2026-09-15.md`

## 2026-09-15 — P-LEAVE-2 §1 read (D): an empty filter reads as a pass — appStartedAt closes D-8 for b, c, d and legacy, adoption closed in the safe direction (one OnceLock string reaches argv and both LEAVE files); both hardenings kill by handle and break nothing (cargo 664/1/4 with the standing composer red, waiter 74/0, applier 27/0); NOT CONFIRMED is true in all five branches, but the kept "stopped before its close window could run" is false in two (no stick at the Leave's find, main.rs:10968 + sync_launch.rs:1595; the applier hand-off when the waiter misses case a); pre-existing race: the applier removes its handshake and relaunches (stick-apply.js:188-189) inside the waiter's 2 s poll, so case d fallback runs and the relaunched session is adopted with an unknown start time — fixable with stick-apply.result.json at > appStartedAt; not blocking: `handback/p-leave2-read-B_2026-09-15.md`

## 2026-09-15 — D064 anchor-similarity §8.8–§8.9 second read: a control labelled by what its author built, not by the version it is scored at, is not a control — NOT REGISTRABLE as written, six repairable blockers: K1 R8b's NEGATIVE polarity control p-leave-E builds §2.7–§2.9, i.e. my own contests, so it is CONTRADICTS @ed73e76 (p-leave-E:4, :29-35) and POLARITY INSTRUMENT FAILED can fire on a live instrument (descends from my §4.2 framing, W1); K2 AFFIRMS counts reuse ("builds it as the packet does", :282), biasing P_b < P_u and voiding P_u; K3 mean-r overlap vs R8d majority unranked; K4 unbriefed hand-back committed before the packet (3c<3e) — briefed arm can read it, mapping recoverable from commit order; K5 3d greps generic "packet_"; K6 redact regex passes "pane B"/"[pane:B]"/BRAVO and strips 7+ digit figures (node -e measured). R8e/R8f buildable with three pinned variants; fresh scorers not fully blind (sessionstart-state on compact injects HEAD subject, state-block.js:74-79); siblings born KEPT: `handback/anchor-registration-read2-B_2026-09-15.md`

## 2026-09-16 — P-LEAVE-3 rows 4+5 read (L, branch held/p-leave3-2026-09-15 @544ddd1): a bound that covers the waits and the export is not a bounded Leave — NOT AS WRITTEN, three changes to ROW 4 first: B1 an OS session end DURING the keeper's close takes the Err arm, waits 20 s for LEAVE_SHOWN (main.rs:11087-11092) then exit(0) (:11127-11131), orphaning the node export (run_carry_json's kill at :10620 never runs), writing no LEAVE_RESULT — case c next launch and my D-3 ledger-lock collision; B2 step 6's result-write retry is an unbounded loop (:11006-11021) inside the "fast" Leave, so the block can be held forever; B3 WM_ENDSESSION answered without DefSubclassProc (:11133-11138) while tao DOES handle it (tao-0.35.3 event_loop.rs:2384-2392, loop_destroyed); B4 the 20 s export bound against L's own ledger: exports 10 s, 11 s, 18 s (persist.log:1506-1509, tonight) — 2 s headroom and rising; B5 ROW 5's ES_SYSTEM_REQUIRED holds exactly the idle timer dream_cycle.ps1:2-3 is built on, on battery too, and no UI string says the machine stops sleeping (my sweep replica: 42 files, 8,700 shown strings, 0 claim hits — Q4 nothing found); B6 unverified: prev==0 read as failure (:11191) would make the hold unreleasable. One Leave confirmed (grep count 1), bounds arithmetic checked (SPAWN_FLIGHT_POLL/SEAT_TEARDOWN_POLL 100 ms, so 1 s/1.5 s ✓), one visible window confirmed, WM_APP+0x51 collides with nothing (tao registers via RegisterWindowMessageA). Did not compile, did not check out, did not rebuild: `handback/p-leave3-read-B_2026-09-16.md`

## 2026-09-16 — P-LEAVE-3 R4-1/R4-2 re-read (L, worktree wt-p-leave3; A's fixes are uncommitted there — 5755cce carries the hand-back only): a timer standing in for a fact is the defect, and the fix is to send the fact — B1 CLOSED and A's shape beats the one I proposed (exit_after is set from LEAVE_PHASE==LEAVE_SHOWN at main.rs:11128, carried in the wparam :11143, read at :11183, so exit(0) is reachable only after step 6 reaped or killed the node child; the join waits NORMAL.worst_case() 675 s and never touches the 600 s export; the block release is unconditional and precedes the decision :11179 before :11183; A's own catch — the latch clear at :11189 — closes a hole that would have blocked every later restart silently); B2 CLOSED for a disk that REFUSES: the cut is main.rs:11044, above the retry arm so no extra sleep, 3 tries at 6 s, then LEAVE_SHOWN :11061 → post → release → exit. NEW B7: the same "block held forever" is still reachable by an UNWIND — a poisoned Panes lock panics at the unwrap main.rs:10994, shutdown_leave never reaches PostMessageW, no panic=abort in Cargo.toml, and ROW 5 already treats that same mutex as poisonable at :11176-11178; fix has precedent (catch_unwind x3 in this file, e.g. :4550) — named, not lap-blocking. Span checked from constants: SHUTDOWN 38.5 s, NORMAL 675 s, and worst_case()'s underestimate fails SAFE (release, do not exit). Residuals: a second query mid-join is answered FALSE with nothing pending; the no-stick LeaveRun::Exit path never sets LEAVE_SHOWN. Live check written with its falsifier, and the Local\ mutex (:6436-6450) means the test build only runs while his app is closed. Ran nothing; R4-3/4/5 and R5-2 out of scope: `handback/p-leave3-reread-B_2026-09-16.md`

## 2026-09-16 — P-BATTERY-ATTACK (L, registration + prediction at 0a54c5a): a control described in the brief and absent from the registration is a control the room believes in without having built it — NOT REGISTRABLE AS WRITTEN, six amendments, all registrable before data. F-A the attack ITSELF contaminated a subject: this packet made me read the chair's prediction naming me the expected T2 winner with a margin, which is the keeper's door inverted ("we arent telling a pane what they are good at") — standing rule owed: the attacker of a battery is never one of its subjects (§8.9 has the machinery). F-B blindness is broken by a HOOK, not by conduct: board-digest.js is on UserPromptSubmit in ~/.claude/settings.json and reads each pane's own transcript (:194-195), printing "↳ asked / ↳ <pane> / ↳ hands:" at 52 chars (:42, :448-453) with NO quiet or phase check — plus one shared checkout (164 handbacks listed from inside a pane) and maps; and the registration never says "fresh session" at all (§7:137 says the opposite — the brief that commissioned me described a control that does not exist). F-C the sha is real (8bf0b5ee… reproduces) but seals only against the author's own revision — unpushed (21 ahead) so no external witness, and the PLAINTEXT sits in exo_memory/loop/, the directory the room orders every pane to read first. F-D both halves of §5 are inert: rotation contradicts §2 ("every pane runs every task" — nothing to rotate) and is unaffordable (no relaunch, ~549k intake), and the census correlation is n=4; replacement offered = test-retest, a second task of the same KIND. F-E run 1's lesson is a registered VOID with a number (run1_scorecard.md:170-176, 60/60 → void), not §7's note; T4 is at ceiling by the room's own every-figure-carries-a-command rule and T6's agreement belongs to a PAIR while its guess rate is declared not-about-the-pane. F-F the brief is equalised and the shell is not: map sizes A 149,168 · B 135,923 · E 96,554 · C 91,914, rank-identical to the census A14·B11·E9·C7, and T3 IS "find prior art". F-G "beats the key must not score as wrong" is kept arithmetically and broken in the RANKING (3/5 planted + 6 real loses to 4/5 + 0), with no named adjudicator. F-H a scorer may be a competitor; T1's harness is a subject's own tool; §7 says six numbers are not a profile and §8 sends them to the dossier: `handback/p-battery-attack-B_2026-09-16.md`

## 2026-09-16 — T3 "is the code bloated or the corpus" (L, read-only): a question is only well-formed once its container exists — the CORPUS half was asked, given a container, measured three times and answered by a design change now running in every shell (main.rs:4225-4231 the 08-09 inversion, brief ~104k + B's map 57k → transcript budget zero, nothing evicted; :2661-2666 the 09-01 measure, shell 149,668 / brief 144,529 / tail 25,368; :4238-4245 the 09-06 measure, brief 106,939 vs residual 3,061 so four panes woke with an empty body; :3086-3092 the ruling "12 topics = 39 KB, the 150 KB ceiling has been hit twice" → carry a pointer not the material; :11900 "or the intake reintroduces the bloat"; :4205-4218 the container itself, SHELL_SOFT_CEILING 140,000 / FLOOR 30,000, and the intake is NEVER evicted; librarian/2026-09-01.md:489-523 the same from the seat side, evict=0; the runtime consequence is live at :3039/:3209/:4425, NOT CARRIED IN THIS SHELL). Standing rule + first enforcement: BOOT.md:155 curate below capacity, journal/2026-06-22.md:15 (104k skeleton → attic), attic/README.md:3, journal/2026-08-15.md:215 (~25 KB of cards/turn), 2026-09-02.md:23 (906k vs a 150k cap), PROGRESS.md:53 (the .txt stacked 8-9 deep). The CODE half has never been asked: the only line census is audit/p-ui-guard-census_2026-09-08.md:43,66-70 and it asks COVERAGE (40.1% tests-to-instrument), there is no container, no ratchet, no retire-rule for instruments (166 tracked), and four greps return nothing. Measured myself: main.rs 16,671 lines of which 7,239 (43.4%) are inside #[cfg(test)] — so length cannot settle it. DISCLOSED: my first grep for "bloat" printed two lines of the sealed T3 key, including its main.rs line count; I excluded battery_run1* from every command after and re-derived the figure: `handback/t3-bravo_2026-09-16.md`

## 2026-09-16 — L061 P-FERRY-TESTS (L, build): a fixture whose values cannot tell the two worlds apart is a green test against the defect it names — closed the gap that let five of eight plants ship green, all five in report(), the one function the suite had never called (grep -c "report(" ferry.test.js was 0). Six new tests + one repaired, ferry.test.js only, ferry.js byte-identical (harness hashes before/after: unchanged true). D4 epoch boundary pinned as the measured/unmeasured split at the boundary instant; D5 the unit DERIVED from the fixture's own inputs, not a literal; D6 as an invariant — take the median with and without an impossible pre-dated ferry and assert EQUAL; D7 split in two (odd-n middle-not-largest, and n=1 gives the sample rather than undefined, which is the crash that kills `node ferry.js` on the first day one artifact is ferried); D8 pinned on BOTH sides of the floor so raising it fails too; and E's §4 repair — the test named "a sha shorter than 7 is REFUSED" was green under the inverted guard (5 is rejected by >=7 and by <=4 alike), now two-sided at 6-refused/7-matches and it is what catches D2. report() reads commits through git log with nothing to inject, so rather than cut a seam into a tool that was not mine this lap, the tests build a real throwaway git repo per case with GIT_AUTHOR_DATE-stamped commits: 13 tests <1s -> 19 tests in 4.4s, and that cost is the price of testing the shipped path instead of a lookalike. Mutants on copies: all five previously-green plants now red at the test that names them (D6 and D8 by exactly one test each), comment-reword control SURVIVED, absent anchor NOT APPLIED loudly. WRONG W1: my first D6 fixture (3 positives + 1 negative) gave median 20 either way — it would have passed on the broken filter; caught by doing the arithmetic before writing, since a run could not have told me. Untested still: epoch()'s min(ferried_at) fallback, --due, the artifact-directory filter against a real mixed commit: `handback/p-ferry-tests-B_2026-09-16.md`

## 2026-09-16 — L061 P-HARNESS-REVISION non-author read (L, read-only, replica probes): judge a diagnostic by what it tells the next hand to DO, not by whether it stops the run — LAND WITH ONE EDIT: move dev/tail-carry.mutants.js:441-447 (alreadyMutated) ABOVE the R2 block at :422. R3 refuses exactly as §3 says (three non-empty strings, replacement != anchor, named by index, before any write) — but its GATE label is unscoped: its founding incident (a row read as a FILENAME) belongs to a four-field harness, i.e. close/state-sync, which §3 says were not edited. R2 is right for an edit and WRONG for a crashed run: proved on a replica by planting row #1's replacement into tail-carry.js (what a killed run leaves) — the new harness says "1 ANCHOR(S) NO LONGER MATCH … An edit rewrote the line … until they are re-pointed" (exit 2), while HEAD's harness on the SAME tree said "THE SOURCE ALREADY CARRIES A MUTATION" (exit 2). Same tree, opposite diagnosis, and the correct one is the one this change displaced — the remedies are opposites, and R2's (re-point the anchors onto the line as it now stands = the mutated line) writes the mutation in as truth, which is the permanent-damage shape this file's own header at :13-19 was written about. R2 also refuses on hits>1 (my 09-15 first-match finding, real protection) while titled ORPHANED and explaining "an edit rewrote the line" — an anchor matching twice may never have matched once; one clause fixes both. Unnamed consequence: R2 makes the loop's own hits!==1 branch (:473-478) unreachable, so "N not applied" is now a permanent 0 and a deliberately-absent SKIP-CONTROL row would make the whole harness exit 2 — the gate forbids the control that demonstrated its own failure mode. Q2, R1's aid claims more than it checks in one way: it prints the surviving MUTATION, not the PIN (which lives in the suite and is never shown), and it only ever exposes bad pins this list happens to make survive. Measured on 75 of 90 parsed rows: anchors median 76 / max 154, 24 of 75 truncated at the 88-char cut, but first-difference beyond 88 = 0 (deepest 75) and printed anchor==replacement = 0 — so the claim HOLDS as shipped and the hazard is structural only; W2 records that I asserted it could hide a change and then measured it at zero: `handback/p-harness-read-B_2026-09-16.md`

## 2026-09-16 — L061 P-BOUNDARY-CHECK-FIXES non-author read (L, read-only): a rule whose fence is a question only its author can answer is not a rule a stranger can apply — LAND WITH AN EDIT: the four ARTIFACT tests move to consonance/tools/boundary-check.artifacts.test.js and the header amendment at boundary-check.test.js:320-341 goes with them, leaving the original rule at :4-9 untouched; everything else lands, including E's fifth test (the separator collision at :299-318), which is behavioural and stays. The carve-out is NOT too wide in substance — I ran all four against E's own discriminator and none can be satisfied by any behaviour of the tool (the escaped NUL and a literal NUL byte behave identically), and E's own M6 mutant proves the behavioural half is covered by a fixture — but the fence is INTENT-based: run the original L009 Rust test ("No work." stayed green after the phrase was struck, because the retiring sentence quoted it) through the permission and it is admitted by the letter, excluded only by what its author meant. Plus a cost §5 does not name, and it is mine: three of the four fail for reasons OUTSIDE boundary-check.js (a main.rs rename, a BUILDING.md rewording), so 27/27 stops being a statement about the tool and the seat who goes red is a Rust seat who never touched it. Split, the two numbers say two things. Measured the alternative E priced as "a third file and nothing else": js-suite.js:155-161 globs *.test.js recursively (SKIP_DIRS at :150), so discovery costs ZERO — W1 records that I nearly ruled the other way on a "it gets forgotten" cost that does not exist here. Citation repair checks out: fn board_push main.rs:2046, fn chair_inject_exec main.rs:9489, 0 line citations, no raw NUL; the dead one was main.rs:5605, about 3,900 lines of drift printed as the tool's central warrant. It survives the symbol MOVING (grep finds it anywhere) and goes red on rename or move-out; its one limit is that it checks EXISTENCE, never that chair_inject_exec is still what stamps the chair tag — "the citation resolves" is checked, "the citation is true" is not. E amended a rule it could have bent silently and asked to be ruled rather than waiting to be caught; the ruling is against the placement, not the judgment: `handback/p-boundary-read-B_2026-09-16.md`

## 2026-09-16 — L062 P-NO-QUESTION-IN-LAP + P-NEXT-TRAILER (L, text build): "the chair's brief" is not one file, and only half of it is the chair's — main_intake() (main.rs:6529-6546) assembles the Main shell from the room master PLUS BUILDING.md and nothing else; COMMITTEE.md goes to siblings (:2864), LIBRARIAN.md to the librarian (:7492), so BUILDING.md is the only chair-only carrier and putting a chair rule in BOOT would pay the shell-ceiling cost in four shells to govern one (W1: I nearly did). Three appends to consonance/src-tauri/brief/BUILDING.md, +74/-0: §650 NO QUESTIONS TO THE USER INSIDE A LAP, placed after the chain-vs-freestyle section because the keeper's sentence uses that cut, with the quote verbatim and the three moves (rule from the record with path:line; file on the ask channel and continue the reversible parts; park the row and NAME it — a parked row is a result, a lap silently waiting is not) and a falsifier; and item 6 in both OWES lists (:197 dispatch, :407 hand-back) carrying the NEXT: <station> <command> when <condition> trailer in his words. BASELINE before any gate, board.jsonl since 05:27 deduped on (pane,text) as boundary-check does: 7 of 27 — dispatch 7/9 (every one the chair's, five of them the 12:40Z L062 burst), ring pane->lib 0/9, ring lib->chair 0/9, and 0 of 7 hand-back FILES end with one. Per seat: chair 7/9, librarian 0/9, A 0/3, B 0/3, C 0/1, E 0/2 — I rang three times and carried it zero, twice while answering packets that carried it, which is the argument for a gate rather than a habit. Gate designed not built: a pure sync_launch::next_trailer() on the keep_awake_transition precedent, checking only that the LAST non-empty line is NEXT: plus three words — deliberately NOT parsing the "when" clause, because every test I could write for it was satisfiable by "when done" (W2), and a gate that can be satisfied by a word teaches the word. Rollout order comes out of the measurement: the gate would refuse 20 of 27 tonight including 18 of 18 rings, so text lands this lap and the gate lands next, or the room's first experience of the trailer is a wall of refusals. NOT verified: no rebuild, so no seat has woken into either rule — BUILDING.md is a bundled resource and its own seating comment (main.rs:6537-6541) records it sitting unread in the bundle for an hour: `handback/p-text-rules-B_2026-09-16.md`

## 2026-09-16 — L064 P-BLIND-WRITE-READ (L, read-only, 20 min): the hazard in repairing a guard is not that its rows appear too often but that a recovered row claims a time the process never observed — C is CORRECT on both mechanisms, verified at source not from C's quotation: defect 1, the edge is detected inside board_push (main.rs:2046, locked/prev computed at :2050-2051) and nothing polls the lock, so a toggle with no traffic writes no row ("the mute is a property of the lock; the record of it is a property of traffic"); defect 2, BLIND_LAST is AtomicU64::new(0) at :2018 with CLOSED gated on prev==2 at :2065, so a lock removed while the app is down writes no CLOSED, and boundary-check.js:184 (not :175 — that is the doc line) pushes [open, Infinity], so every later window reads UNMEASURED forever. Two citation corrections: the defects are C's §4.1/§4.2, NOT §2 as the dispatch said — C's §2 REFUTES a different numbered claim and C's own :221 points at §4 — so a seat briefed off "§2" may have read the refutation instead of the findings (W1: I read it as C contradicting itself before checking C's index). Q2: more rows is the SAFE direction (more recorded blindness = more UNMEASURED, and UNMEASURED is the guard's safe verdict); the defeat is a span NARROWER than the real window, since blindOverlaps only marks a window UNMEASURED if it overlaps [OPEN,CLOSED]. Persisting BLIND_LAST is safe in its natural form because CLOSED is stamped entry.ts at :2071, necessarily after removal — the edit that flips it is stamping a recovered CLOSED with launch time or a last-known mtime to say "when it really ended", since nothing on disk records when a deleted file was deleted. A poller for defect 1 is dangerous at the OPEN edge unless it back-stamps. The asymmetry that resolves it is already in the code: blind_lock() calls fs::metadata at :2024 and discards it (Ok(_)) — the lock carries its own mtime while it exists, nothing carries a removal time. RULE: back-stamp OPEN from mtime, forward-stamp CLOSED at detection, never the reverse, so every error widens the span. Verdict on E pre-registered before E's file existed (it was not on disk at 07:2x) so it cannot be fitted: DO NOT LAND if any CLOSED carries a time the process did not observe: `handback/p-blind-write-read-B_2026-09-16.md`

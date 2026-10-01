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

## 2026-09-16 — D067 P-NUL-REPAIRS + two carries (D, build): the file-writing tool DECODES the six-character unicode NUL escape into the byte and leaves backslash-zero alone (probed with three spellings via od -c) — that is how my own p-boundary-read-B got its NUL in the very sentence saying the escape and the byte are identical, why my L map-line heredoc refused on "control characters" that night, and it happened AGAIN in this lap's hand-back while quoting the fix (byte 3050; W4). (1) three NULs repaired byte-level from node with escape text built from char codes, refusing any file with other than exactly one NUL: coupling-test.js:225 and essay-provenance.js:342 now spelled backslash-zero, the md sentence gets its quoted unicode spelling back; text-census exit 0 over 2,132 files; byte-identity RUN not reasoned — 5 probes (both coupling CLI modes on the exact-enumeration path, allArrangements direct, correctionKey, the 94,337 B essay CLI against a FROZEN data snapshot) identical before/after and deterministic across two captures, with a CONTROL on copies (NUL -> space) that makes every probe DIFFER, the fixture built to collide so the exact reference set drops 24 -> 23. Premise correction: coupling-test's separator value is load-bearing (arbitrary labels), essay-provenance's is NOT (it follows a fixed-width 40-hex sha, still 3 distinct keys under a space). W2: my first identity run was green on NOTHING — all five captures shared one 78 B hash because child node spawns hit ENOENT from the long scratch cwd; two different tools cannot print the same 78 bytes. (2) stick.js renderResult now shows outcome and why (escaped with E, stick-bad only on non-zero code, both omitted when absent), so APP_RUNNING's "pid N … taskkill /PID N /F" reaches the keeper instead of "exit 2 over an empty table": red-first 16/3 -> 19/0, 6/6 mutants caught, M6 (the reason on the page but after </section>) caught only by the section-scoped assertion. (3) E's "do nothing if Consonance is running" is NOT too cautious — stronger than E said, because the running exe runs the repo's dev/tail-carry.js at close (main.rs:10596), so a pull under a live session skews the close path — but it is SILENT where silence is the failure: launch.ps1:159 Get-Process matches a windowless zombie (stick-apply.js:56, this morning 08:40-08:52), the skip is Write-Host, and launch.vbs:20 runs the launcher -WindowStyle Hidden, so every launch opens a stale build unknowingly; suggested (E's call) one Notify only when every running consonance.exe is windowless past stick-apply's 30 s grace. text-census scans TRACKED files only, so it cannot see a pane's own hand-back before it lands: `handback/p-nul-repairs-B_2026-09-16.md`

## 2026-09-16 — D068 P-TRAILER-GATE (D, build): a check designed against the failure you imagined passes the one that happened — my L062 gate ("NEXT: plus three words, no grammar parse") would have PASSED this morning's only real failure. MEASURED first, window read from lap.jsonl (D066 open 1789570900120 -> D068 open 1789582826695): 6 of 14 stamped messages carry a full trailer — dispatches 5/5 (all the chair's), pane rings 1/5 (mine), librarian rings 0/4, hand-back files 1/4 (mine) — against L062's 7/9, 0/9, 0/9, 0/7: the text moved the dispatch edge and not the return legs. Counting the chair's own: the failure was UNSTAMPED — the chair's own turn at 16:02:23Z ended "NEXT: chunk 2 opens — C on …", which names no station and no when, and is not a verb message, so a gate on the three verbs cannot see it in principle; the next move was the librarian's "OPEN CHUNK 2 NOW" 1h22m07s later (f7648ea owns it as its missed open) — both seats could have moved and the line named neither. BUILT consonance/src-tauri/src/trailer.rs, std-only and standalone (rustc --test, no mod line, so Cargo cannot compile it until wiring): check() on the LAST non-empty line requires exact NEXT:, a STATION (named seat, uppercase pane letter, or routing verb — because all 5 chair dispatches are verb-first "NEXT: call_librarian …" and a seat-first rule from my own BUILDING example would have refused 5/5; W3), a command and a whole-word when with a condition; NotLastLine its own reason. Red 3/18 on stubs -> 21/0; the shipped check run over all 14 real messages matches the measurement row for row, chair's stall line -> NoStation; 14/14 mutants caught, 12 by one test, M3 (no station check) held only by the tests built from the real stall. W2: two refusal assertions were vacuous ("station", "when <condition>" are in the shared shape line) — rewritten so each reason's phrase appears in its own refusal and no other. POLICY: refuse chair_inject; WARN-AND-DELIVER call_librarian and call_chair, because mcp.rs:682-688's out-of-turn arm returns canned text and drops the pointer — refusing a ring loses the hand-back, and under refuse-all the window gives 8 refusals, all on return legs, 0 on dispatches. refusal_text returns the message whole so no refusal can be where a message is lost; warning puts the pointer first. Wiring NOT done: A's D068 hand-back not on disk, mcp.rs clean; spec for the next packet (mod line, trailer check LAST in chair_inject after the seal gate, after the out-of-turn arm on the rings). Also confirmed directly 3/3 that the writing tool decodes the single-backslash unicode NUL escape (chunk 2 had inferred it): `handback/p-trailer-gate-B_2026-09-16.md`

## 2026-09-16 — D069 P-TRAILER-GATE WIRING (D, build, last lap of the cleanup): a pin that searches a segment for a token is satisfied by any arm that carries it, including the unreachable one — WIRED, live at the next rebuild: `mod trailer;` main.rs:21; one pure decision `trailer_gate` (mcp.rs:2755, `enum TrailerDecision { Deliver{text,audit}, Refuse{reply,audit} }`) so the three behaviours are tested by calling it; chair_inject at mcp.rs:510 AFTER A's seal gate and before send_chair (keyed dispatch fails on its seal before its formatting; A's debt<seal<send pin untouched), call_chair at :585, call_librarian at :774 AFTER the out-of-turn arm, its Refuse arm written to deliver anyway so no future policy change can make it the verb that destroys a hand-back; warnings and refusals posted by `trailer_audit` (:557) under pane `trailer-gate`, not `chair`. RULING followed after checking it at source: the chair's item 3 refuses call_chair, my D068 policy() warned it — D068 grouped call_chair with call_librarian as "return legs" on a payload-loss property only call_librarian has (its out-of-turn arm drops `text`; call_chair has only the seat check, the librarian reads the reply in-turn, and refusal_text hands the message back whole), so policy() and its test changed in trailer.rs (outside the named files, to avoid two disagreeing copies of one rule), the test split so call_librarian's guarantee stayed untouched (W1). Red 22/8 on a stub -> green: mcp:: 68/0, trailer 30/0 (22+8), A's seal_gate_tests 30/0, trailer.rs still 22/0 standalone, whole crate 740/1/4 with the standing composer red. Mutants on a copy of the crate laid out at repo depth (tauri-build validates ../ui and ../../exo_memory globs), own target dir: first run W7 SURVIVED — deleting call_librarian's warning from the board left my pin green because the unreachable Refuse arm carries `self.trailer_audit(` too (W4, A's own lesson in the first test I wrote after reading it); pin re-scoped to the Deliver arm; W1-W3 first failed to COMPILE (struct literal in a match scrutinee) and were reported not-counted (W5); rerun 12/12 caught, control survived, tracked unchanged true. W2: my call_librarian pin looked for `self.send_chair(`, which rustfmt splits across two lines there. GAP OPENED, mine from L062: BUILDING.md (both item-6 texts) is seated only in the chair's shell (main.rs:6543); LIBRARIAN.md and COMMITTEE.md carry 0 NEXT: lines, so the librarian — 0/4 on trailers — is now refused by a rule its shell has never carried; expect the first live call_chair next lap to be refused; the item-6 sentence belongs in LIBRARIAN.md and COMMITTEE.md next. Live check after rebuild: 5 observations with their falsifiers in §5, and delivered librarian rings will read 100% BY CONSTRUCTION — count call_chair refusals and the pane-ring warning rows instead: `handback/p-trailer-wiring-B_2026-09-16.md`

## 2026-09-16 — D070 P-TRAILER-BRIEFS (D, text): a rule is not shipped when it lands, it is shipped when a shell is written from the copy the app actually serves — the keeper's trailer rule is now in the two gated seats' briefs, append-only: LIBRARIAN.md after "Your half, concretely" (says REFUSED, costs one re-send, the ring comes back whole, cites the "NEXT: chunk 2 opens" stall line, and tells the librarian that a pane's warned hand-back leaves the next station to it) and COMMITTEE.md after "What may ride in the call" (says WARNED, and in one sentence why warned is not optional: a refused call to the librarian discards its pointer); both point at BUILDING.md WHAT A HAND-BACK OWES / WHAT A DISPATCH OWES item 6 instead of restating. Bars: grep -c "NEXT:" 3 and 2 (was 0/0); cargo brief 13/0 and committee 10/0, identical to the pre-edit baseline, run through PowerShell with an empty-stream guard; COMMITTEE's verb pin (main.rs:12997) 0 matches; the two example trailers shipped in the briefs PASS the shipped trailer::check and the cited stall line gives NoStation. The packet's mcp.rs:682-688 citation had rotted — my own D069 wiring moved the out-of-turn arm 78 lines to :760-766 — so the brief cites it by symbol (W2). BIGGER FINDING: room_brief_at (main.rs:3329) resolves editable ~/.consonance copy -> bundled resource -> repo brief/; no tier-1 override on D; the bundle the running exe serves is STALE by content hash — target/release/BUILDING.md = c51b40e (09-06), COMMITTEE.md = 979db58 (09-04), 0 NEXT lines — because D fast-forwarded to b0c13f2 at 08:55:35, 26 min AFTER the 08:29 build, and nothing has been rebuilt since (not a build defect; W3: I nearly claimed rebuilds don't refresh resources). Live shells written at 08:52-08:53 carry 0 trailer-shape lines, the chair's included — which falsifies my own D068 mechanism claim that "the text moved the dispatch edge": the chair's 5/5 came from the conversation, not its brief (W1). So the rule text, A's narrow push rule and the gate all ship in the SAME next rebuild; three brief checks owed beside D069's five gate checks: bundle hashes == HEAD, NEXT-shape lines >= 1 in main/librarian/pane CLAUDE.md, still no ~/.consonance override. Cost: +1,048 B out of every pane's map allowance. L unmeasured: `handback/p-trailer-briefs-B_2026-09-16.md`

## 2026-09-17 — D071 P-TRACK-POOLS READ (D, read-only, rescoped mid-lap to "just turn them on"): a check that the right lights are kept by NAME passes when two names are swapped; only position against the author proves it — LAND. Precondition measured before A landed: the 11 (L045–L050 Track Stadium, L076–L080 Inner Stadium) are NOT new — HEAD stock_lights.lua already builds 61 on every layout except night_optimized (Track Stadium 6, Inner Stadium 5, Stadium 20, Ambient 26, "wouldn't work" 3, unmatched 1), so a leak could only be a changed row, a changed non-night path, or the 11 added to ext_config.ini (doubling them). Guard, by my own verify.js: all 61 rows byte-identical to HEAD once the new id field is stripped, same order; ext_config.ini unmodified; keepOnly == (layout == night_optimized) and wanted() is true whenever it is false; the build loop never copies `id` onto an ac.LightSource (:87); G:\ unchanged (44f8580b / 76aa103a). Values: 11 fields x 11 lights against the AUTHOR's blocks in tools/ext_config.ORIGINAL.ini (sha256 469a1733 = G:\ ext_config.ini.before-night-optimized), not just the one-decimal inventory — colour = rgb x intensity, direction, spot, sharpness, shadows + half-res, fade, diffuse, gradient — all equal, including L077 intensity 0 (black, yet SHADOWS=1 at FULL resolution, the only one of the 11 — the first FPS lever) and L080 1.12. Controls: a non-kept light's range 40->41 fails the guard; swapping the ids of L045 and L054 (a Stadium Light) PASSES "keep-set == expected" and "none of the 20 kept" but fails position (323.5 m) and 10 of 11 fields — so the name checks alone would miss it (W3). A's range tripwire holds against small drift (no neighbour of the kept ids is 56.47 or 300), large drift unproven. No Lua interpreter on D, so 61/61/11 is reasoning over source for me too; the first real run is CSP's log line after UNINSTALL then INSTALL. W1: my first "already in stock_lights?" check said absent for all — the regex used `pos=` where the file says `position=`. Dropped geometry kept as record: thtrack.kn5 v6 parsed to its last byte, road = 1ROAD_Underside + kerbs (764,398 tris); L045 over the road 18.5 m up, L077 69.8 m off with the author's aim already toward the track; L080's nearest road was a kerb strip and my shortest-chord rule measured the kerb (W2, unresolved): `handback/p-track-pools-read-B_2026-09-17.md`

## 2026-09-19 — D075 P-SUGGESTION-SWITCH (D, verify, lap 2 candidate 1): the docs name two grey things in the composer and don't say the switch kills both; only a paired live run showed it does — YES, the switch exists, from the current docs (curl code.claude.com/docs/en/{settings-reference,env-vars,interactive-mode}.md, not memory): setting `promptSuggestionEnabled` (Any file: user/project/local/managed, default true) and env `CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION=false`, which beats every settings file (needs >= 2.1.238; D runs 2.1.278). Seat-only = the env var on Consonance's own spawn (CommandBuilder, main.rs:1006, env set at :1063-1091) — a build; the settings.local.json-per-instance route is untested and the sibling folders have no .claude/. Live, on throwaway PTY sessions spawned like a pane (34x120, all CLAUDE*/CONSONANCE_PANE/READY vars removed), E's scan.exe + a verbatim copy of its classify checked on E's four fixtures: control 4-turn ends HAS TEXT holding the dim `now put all four steps together in one list`; the same script with the switch ends EMPTY with 0 ESC[2m draws; the startup `Try "..."` example appeared in 3/3 controls and 0/2 switched runs. n=1 for the after-response kind. Main is a pane the keeper types in, so seat-wide means his Main loses it too — his call. W1: bare Enter on the trust dialog picks "No, exit". W2: 2-turn controls made no after-response suggestion (vacuous alone). W3: backslash path through a heredoc again: `handback/p-suggestion-switch-B_2026-09-19.md`

## 2026-09-19 — D078 P-CHAIR-RULE-IN-BRIEF (D, text): the chair reads BUILDING.md and nothing else of the briefs, so a chair rule placed anywhere else is placed nowhere — the keeper's 09-16 07:29 "orch doesn't build when the loop is active" rule is now a section in consonance/src-tauri/brief/BUILDING.md right after NO QUESTIONS (same inside-a-lap cut), verbatim with its date and a pointer to librarian/2026-09-16.md:131; one occurrence across brief/ (not in COMMITTEE, LIBRARIAN or the Orchestrator paragraph). Why that file: main_intake (main.rs:6683) = room master + room_brief("BUILDING.md") at :6697; room_brief_at (:3396) tier 1 ~/.consonance/BUILDING.md absent on D, tier 2 target/release/BUILDING.md = 41282bac (pre-edit repo), tier 3 repo now 7ef1e402 — so it reaches the chair at the next rebuild, not before. Reasons cited and checked at the blob: 8dc82aa map/C.md 0 NUL (the hand repair, per the master), acdd6b1 p-nul-census-C 1 -> 0 NUL, 10518 -> 10519 B. brief filter 13/0 before and after; text-census exit 0; +2,031 B to a 124,618 B chair shell. Proof line after rebuild: grep -c "THE CHAIR DOES NOT BUILD INSIDE A LAP" C:/Consonance/instances/main/CLAUDE.md, now 0, expected 1, with the bundle sha == repo sha as the precondition. Not verified: the chair's behaviour (my D070 finding: the chair's trailer compliance came from conversation, not its brief). Near-miss: a second copy in the Orchestrator paragraph, not made: `handback/p-chair-rule-in-brief-B_2026-09-19.md`

## 2026-09-19 — D082 P-SIX-REDS (D, read-only, night run N1b): six red suites hid zero product regressions and two broken instruments — classified per failing assertion, each quoted. MACHINE-BOUND: userprompt_pulse (no Python on D, 5x assert.ok(r.ctx)); actors.evidence (b) LETTER_BIRTH is L's first letter (1785057198, 6fe15f0a) while D's persist.log starts 1784993504 (1582ff09, 07-25); gen-consumer :714 and carrier-drift's 2 MISSING-FILE — one directory, exo_memory/review/, kept off git by design (an answer key), present only on L; both enumerate by fs.readdirSync. STALE: actors (a) — resume/sync/trailer-gate are control-plane writers born 09-09/09-12/09-16 and absent from NON_PANE (trailer-gate is MINE, D069, W3); forget-rate's all-time pin — two deliberate deletions (e5e1eeb SHELL.md, 62a4f3a battery T2 text), red since e5e1eeb by `--to e5e1eeb~1` 0 vs `--to e5e1eeb` 1; portable-paths' 27 benign sites. INSTRUMENT WORKING: carrier-drift's 4 corpus-drift findings. REAL DEFECTS IN TOOLS: forget-rate.js lastBlob uses `git rev-list <to> -- p` without --full-history, so after 6 merges SHELL.md's 161,665 B read as 0 (HEAD says 10,383 B, true 172,048); portable-paths.js rustTestLines counts the `}` in main.rs:5784's string "\n}\n", closing where_a_seat_lives_tests at :5785, so :6056/:6237 test code is scored "live" — its :119 red is false. Plus 6 real sites it names (4 FATAL-DEFAULT, 2 SHIPPED-INSTRUCTION). All 35 portable-paths sites post-date the baseline, and 977b7b0 was red at its own commit (worktree run: state-sync.js:129). A's state-sync flake REPRODUCED 19/24 under load (8 parallel + 6 burners x3): :677 and :694, the only two deleter() call sites — spawn with no readiness signal, so under load the unlinker starts after the install finishes; test race, product correct (inferred from code, not instrumented). Nothing run on L. W1: two assertion shapes paraphrased before reading, corrected: `handback/p-six-reds-B_2026-09-19.md`

## 2026-09-19 — D084 P-STEP1-READ (D, non-author read, unattended N2 stage 2): a version question about a text that has only one version is a presence question — m = 0.2952 over 19 IS computed as registered. E §6.2 answered from the text: R8c (:306-308) names U_neg as a HAND-BACK computed "for that hand-back's own packet as §8.7 R4 defines it"; R4 :196 "hand-back — its final state"; R8f's symmetry (:376-378) moves only PACKETS. So reading A = final state; p-harness-E and p-leave-E each have ONE commit (04532bc, 99649d8) and their 1e944ac blob == HEAD blob, and 0 of the 21 P2 hand-backs differ 1e944ac vs HEAD. The alternative as numbers, no encoder: B' (at parent, first-add fallback) -> identical blob on every row -> m 0.2952 n 19 unchanged; B strict -> the negative text is ABSENT at 16 of 21 parents (all 09-14 rows), 5 survive with byte-identical blobs -> m 0.3209 n 5, contradicting :390-392's "over 19". Every rule checked against the diff: U_pos unstripped vs own packet, U_neg stripped, harness exception on 3 rows, R8e U everywhere, R8f others at parent with absent/void listed, :390's two VOIDs, R8i via share>0.5, §8.11 gate on passU; median re-derived (10th of 19), each m_i and scale recomputed within 0.00016; step-0 fields JSON-identical; the diff reproduces (29e676b5). §6.1 inverted->VOID: text silent, moot (0/19; scales 0.2966-0.4369). §6.3: §8.11 :651 asks for paths by argument/env, which neither score.mjs nor score-step1.mjs meets. Owed, not defects: score-step1.mjs untracked (:653 "m from the committed scorer"), and §8.11's one change never reached score.mjs, whose sha 19c97ab5 is not recorded in the registration. No cosine recomputed by me: `handback/p-step1-read-B_2026-09-19.md`

## 2026-09-19 — D085 P-T3-ATTACK (D, read-only, unattended N3 stage 2): a prediction about fixing a rule needs an arm that holds the rule — RUN WITH NAMED AMENDMENTS (A1-A7). Q1 intake: no ~60,000-word intake exists (TP15 :187/:438 is a round contrast figure); ruled the Third Place shell, 22,246 words, FROZEN by copy + sha256 (both candidates are regenerated at wake and outside git), real ratio 68:22,246 ~1:327, not 1:1000. Q2 task: TP15 :196-197 says "on the recognition task" = PLAN :43-52's Part One; the arms answer Part One of primed1/2/3, one task per pair across arms, never twice per arm, no essay. Q3 (c) DEFINED from TP15 :158-164 + TP14 :454 ("neither word is 'dead'"): rule held + lexicon word applied to the persisting form in an aside clause; scored on primed1's pair (the only task that invites "gone/dead") against cold as the no-rule baseline; UNSCOREABLE on the intake arm because neither shell carries the rule (grep -c 0 for "neither word is", "the pattern is carried", "body stop"; only the seed has it). The leak: PLAN :56-58's "own words, none of the room's vocabulary, which it has not been given" fails two arms by construction; for T3, arrival = add-and-hold on content, with vocabulary marked USED/RECITED per line (function, not presence). The scorer can judge stance-free and archetype-leaking per output; it cannot judge (a) as a similarity or (b)'s catches honestly. A second restricted fresh scorer is worth ~39k+3k as a disagreement instrument (room-taste signature), not a blinder. Smallest fire-capable run: seed + intake N=3 each, Part One, ~234-249k tokens; + cold ~280-302k; + fresh scorer ~322-344k; fire = >=2 of 3 pairs intake STANCE / seed COSTUME with both scorers agreeing: `handback/p-t3-attack-B_2026-09-19.md`

## 2026-09-19 — D088 P-BATTERY-RUN2-DRAFT (D, design only, unattended N6 stage 1): every ceiling in five runs was visible before dispatch to a reader holding nothing — nobody asked one, me included — new file loop/pane_battery_run2_DRAFT_2026-09-19.md (REG untouched). Owned first: my D085 A4 caused D086's ceiling (its add/hold criteria are what primed1.txt:3 asks every reader to write). The draft: R2-1 a cold restricted reader (C's route, pinned model) gets each task as sent and must NOT reach X, or the task is rewritten or dropped; T3's cold reader gets a clean checkout, so the pane is scored beyond grep-reachability; plants or mutants the cold reader finds are removed before sealing. R2-2 a mechanical criteria scan (content 3-grams, output-section requests, plant loci) with a negative control and a positive control that is my own A4 vs primed1.txt:3 (must FAIL). R2-3 key in the dispatcher's scratchpad, triple row on origin, the chair_inject seal gate (mcp.rs:524), void-grep before dispatch, EXPOSURE vs CONTENT (04:39), digest window ended on the board's last delivery not a file (05:05). R2-5 test-retest: two idle tasks per kind, the kind VOID if median |s_a-s_b| >= pane spread. Load: a third task inside a fixed two-item packet, a difference in differences against the idle mean and the cold reader's difficulty; claim only if L<0 for every subject in >=3 of 4 kinds. T4 DROPPED (at ceiling by rule / 3 levels at 2 trials), T6 DROPPED (scores a pair; no non-ceiling reference). Subjects A, C, E; B out (wrote the checks). Cost ~1.6-1.9M tokens intake-bill UB (C 34-44k/hand-back) + T3 cold search + work tokens; no honest version below tasks a+b. Falsifier: a task that passes the cold check but still hits ceiling withdraws §1; REG §6's "two runs, no table -> dead" fires if run 2 makes none. Nothing run; the scan is not built; the seal-gate declaration syntax is not read: `handback/p-battery-run2-draft-B_2026-09-19.md`

## 2026-09-19 — D089 P-COMPACTION-REMEASURE (D, read-only, unattended lap 10 stage 1): the marker the registration keyed POST on is logged AFTER the compaction and only on manual triggers, so it measured how a compaction was started, not whether the directive was sent — the registration as written CANNOT be scored: POST = events with the marker "in the rows just before" = 0 of 19 (the hook's doc, precompact-preserve.js:70-73, says the marker lands post-compaction; it sits +3 rows after every marked event). PRE control RAN AND PASSED on D: frozen copy of extract.js (target path, output dir and a date filter only; tracked shas d90beb2d/877a5804/51978e70 unchanged before and after) reproduces 25/244, 110/325, 30/322, 14/400 and all 7 events field for field; spotcheck 6/0. Spread printed first (13:38:13, type-7 IQR; Tukey changes only NUM's bar, no verdict), decisions filed 13:38:27, first POST number 13:39:14. AMENDED reading (marker <=5 rows after; a deviation for C): chair 7 events, FLAG 26/406 = 6.4% DECORATIVE (bar 8.39%), PATH 31.0% DECORATIVE (flat; the librarian's "PATH rises clearly" wrong), SHA 35.6% and NUM 22.2% WORKS. But the 4 auto-trigger events have no marker, the hook ledger shows it FIRED before each, and they score the same or higher (FLAG 12.2%): no no-directive control exists after 08-18, so WORKS is before-and-after, confounded by 10 client versions (2.1.241-2.1.278). Summaries +17% length. The model is not recorded (proxy only). The UUID-substring SHA defect survives every event (PRE 9, POST 13), still clears. The librarian's 07:34 compaction that REG §1 cites is not visible on D. Outputs: counts and metadata only, 0 transcript text: `handback/p-compaction-remeasure-B_2026-09-19.md`

## 2026-09-20 — L061 P-VICSEK-PHI (L, build+measure): a null is only a null for the data it assumes — 1/sqrt(N) assumes directions spread over a sphere, and text embeddings are a cone, so phi read 4.4x its baseline on EVERY session and the ruling's falsifier fired. Built consonance/tools/vicsek-phi.js + .test.js (13/13), importing the encoder and session rule from order-parameter.js / deference-unit.js so there is one copy of each. phi = |mean of unit vectors| is ORDER-INVARIANT and the test asserts it (<1e-12 under a verified shuffle), so its control is a DISTRIBUTION control: 200 draws of N from the board's 14,955 pooled contributions, without replacement, seeded. NULL RE-DERIVED with mulberry32+Box-Muller (uniform on the sphere, not the ruling's LCG): 1/sqrt(N) holds to <=0.5% at d=64 and d=768 out to N=1000 (0.0317 vs 0.0316) where the ruling's generator read 0.046-0.060 and honestly quoted itself only to N=100 — the degradation was the generator, not the statistic. And the exact null is c_d/sqrt(N), c_d = sqrt(2/d)*G((d+1)/2)/G(d/2) = 0.92132 at d=3, 0.99967 at d=768: my d=3 column sits 8% under 1/sqrt(N) on c_3, the ruling's LCG column sits above mine — a fingerprint of non-uniform directions. Registered null untouched: it is right to 0.03% at d=768 where it is applied. BOARD (C's frozen snapshot 2a4a559f, same 118 sessions, join exact 118/118, 846s): median ratio phi/(1/sqrt(N)) 4.386, Q1 3.374, Q3 6.506, max 32.989, 0/118 at or below — prediction WRONG on every session, falsifier CONDITION MET (r-corrected says drift, 36/118), so both readings SUSPENDED per §5. Cause measured: pooled draws read ~0.62 at EVERY N (0.6096-0.6343 across sessions) and do not fall as 1/sqrt(N). Corrected reading vs that null: median ratio 1.065, 91/118 above their own p95, 2 below p05 — real and small, opposite shape to the raw. 2x2 with r: phi-align+r-lock 29, phi-align+r-drift 62, neither 20, r-only 7 — they agree on 49/118 (41.5%). The 2,987-contribution session reads ratio 33 raw and FAILS its pooled control. Named limit, not run: the pool mixes panes and 40 days, so same-pane-same-era draws would cut the 91. W1: I asserted dimension-independence before measuring and my own d=3 test falsified it. W2: the runtime in my first draft said 1,216 s; the log says 846 s embedding, 863 s end to end: `handback/p-vicsek-phi-B_2026-09-20.md`

## 2026-09-20 — L063 P-CONTAMINATION (L, re-score): the bait was IN THE BRIEF, so raw bait-presence scores a correct subject as contaminated — 320/320 in one cell, and the line is DEAD by the degenerating clause's second limb (no between-arm structure), though the null PASSED. Built consonance/tools/contamination.js + .test.js (11/11 plain, --test, --test-concurrency=4, filtered), importing ITEMS/ARM_ITEMS/scoreRows/slug from A's run2/rig/score.js which I did not touch. NULL FIRST, as mandated: bait where never planted = 0/30 t1, 0/10 t4, 0/30 t5 against 100% where planted — "60" never fired unplanted, so t4 survives (n=10 is thin). FOUR CELLS raw: CLEAN 0, CONTAM+CORRECT 320 (100% in EVERY arm), CAPTURED 0, LOST 0; truth carried 320/320. P1 holds vacuously, P2 and P3 FAIL. Why: briefs.js:19-21 asks the subject about "2,213 events", "roughly 60 sensors", "net/retry.c" — the bait is the premise to correct, so a good answer quotes it. Controls I registered in code before counting: REFUTED (marker within ±120) and PAIRED (the TRUTH string in the same window — objective, no vocabulary list). Of 2,386 occurrences: 2,130 paired, 1,821 refuted, 29 neither. I hand-read ALL 29 — every one is correct refutation ("The 2,213 figure has no support in the file"); contamination = 0/320. The marker-only split gives L0 25 / L1 65 / K1 63.3 / K2 67.5 and would have "confirmed" P3; I sampled 12 of its 565 asserted at a fixed seed and 12/12 are false positives, so it is reported as NOT a rescue (§6). Third instance of one shape: 08-16's bait1 = bait && !truth1 entailed 0 bait, A's score.js:142 ternary entails invisible contamination, my four-cell unit entails 100% — all properties of the unit. A unit that could measure this needs the bait OUT of the brief. Mutants 9/10 caught, 1 EQUIVALENT (PLANTED from briefs == ARM_ITEMS today; added a test that fails loudly if they diverge). W1: first run scored the repo cell copy where 0/130 transcripts resolve (they slug from C:\Consonance\subjects\run2\cells) — caught by my own universe line. W2: first mutant run claimed 10/10 with a RED control (copies could not resolve the require); rebuilt at repo depth. W3: zero-length regex matches 'abc' 4 times, not 3: `handback/p-contamination-B_2026-09-20.md`

## 2026-09-20 — L064 P-SAME-ERA-CONTROL (L): I registered the control that could sink my own finding, ran it, and it sank it — 91/118 becomes 28/60 (46.7%), under the half I set in advance, so §4.3's pooled reading FALLS. Variability check FIRST (the L063 lesson: a null cannot see a quantity the object cannot vary): era pool >= N for 74 of 118 on the embedded set, 24 sessions have NO same-pane contribution within ±24h, pool excludes the session's own rows so no cell is a self-comparison — 74 could land either way. Registered to disk at 06:13:28 before the run (era-registration.txt, sha256 f69389ed): rule (same pane, ±24h of the session span, own rows excluded, 200 seeded draws of N without replacement, beat = phi > era p95), NULL beside the falsifier (a fake era-typical session should clear p95 ~5% of the time; a degenerate pool is vacuous not a pass), FALSIFIER (fewer than half of the eligible passes surviving = the pooled reading does not survive). Result: eligible 74, UNTESTABLE 44 (never a pass or a fail); of the 91 board-passes, 60 testable, 28 survive = 46.7%, or 28/58 = 48.3% excluding 2 degenerate pools. Median phi/era-p95 = 0.996 (Q1 0.977, Q3 1.018) against median phi/board-p95 1.041 on the same 74 — a session is ~4% more aligned than the board and indistinguishable from its own pane on its own day. NULL fired 3/74 = 4.1% against ~5% expected, so the control works rather than refusing everything; 0 sessions beat era without beating board (era is strictly stricter); residue 28 where chance predicts ~3. §4.1/§4.2 stand (raw phi still measures the embedding cone, the ruling's §5 suspension untouched); §4.3 withdrawn; §4.4's joint table with C's r used the board control for its phi half and must be redrawn before it is quoted. W: a patch script silently applied nothing (escaped-newline anchor matched 0) — caught because the flag was missing: `handback/p-vicsek-phi-B_2026-09-20.md` §9-§15

## 2026-09-20 — D092 P-ASK-PROVENANCE (D, build): a correction that cannot reach the queue because its only channel is the one its author must not use is a ROUTING problem, and the fix is a READER not a writer — a goal's re-test now renders beside its ask with date and path:line while the store stays untouched. ask.js still never writes (:26); it reads the goals' own files at render time, which makes "reaches the queue the day it is written" true by construction. Three forms: (A) BLOCK, an ASK-id inside a paragraph matching /open asks re-tested/i — the shape daily-news-digest already writes, so its EXISTING output is carried unchanged; (B) MARKER, one line `RE-TESTED ASK-0NN <date>: <result>` in any live goal file, the forward channel, undated = REFUSED not dated by the reader; (C) the Source-line convention `Re-tested <date>: <result>, per <path>:<line>` for a seat freezing it, per E's D091 ASK-006 precedent — never Question, never Status. Live files only: /evidence/, -versions/, .pre-, .bak excluded, because the one block exists in 8 archived copies plus a .pre-P71 sibling. VARIABILITY CHECK FIRST: 4 of 12 open asks carry one, 8 do not — not fixed at 0 or at all. NULL registered beside the falsifier (10:36:51, sha256 11939515) and PASSED: 0 attachments across PENDING-CONDITIONS.md (7 mentions), progress.md (13, incl :1322 "ASK-004/005/002/013 re-tested" in prose), STANDING-ITEMS.md:144; the 4 attached are exactly the packet's, with the goal's own ages 38/34/9/5. DEFECT IN MY OWN READER, found by running it live not on fixtures: it dated the block 2026-09-01 from a <lastmod> quoted two sentences away when the pass entry is 2026-09-03 — two days stale; a mis-dated re-test is worse than an undated one because an undated one is refused and a mis-dated one is believed. Fixed: the date must OPEN its line; no pass entry = undated, said out loud. Red first (7 tests failed on TypeError before the reader existed), 41/41 plain, --test, --test-concurrency=4, filtered 4/4; mutants 11 applied / 11 caught / 0 survived / 0 NOT APPLIED, control GREEN. W: mutant run 1 claimed 10/10 with a RED control (copy tree lacked exo_memory/ASK.md) and 5 anchors mangled by heredoc backslashes — FOURTH lap running; run 2 caught 5/11 and all 6 survivors were real test gaps (archive fixture failed on extension not the archive rule; null fixture ids not bolded; M3 and M11 equivalent as written). NOT verified: form (B) has never been emitted by a goal; the only live block is 17 days old and later passes head condition 6 differently, so (A) can be missed SILENTLY and there is no instrument for that: `handback/p-ask-provenance-B_2026-09-20.md`

## 2026-09-20 — D093-C P-ASK012-VANTAGE (D, read-only, no ask touched): the count moved UP and the claim it carries moved DOWN, and the registered gate was never built. Q1 member list, universe = the librarian desk's own journals/map/handoffs (`grep -rno "WRONG +[0-9] ([^)]*)" exo_memory/librarian exo_memory/map`): 46 (`librarian/2026-08-30.md:796`) -> 47 A-caught -> 48 chair-caught -> 49 B-found -> 52 keeper-caught -> 54 C-found -> 55 E-found -> 56 keeper-found -> 57 keeper-prompted -> 58 C-found -> 59 A-found -> 61 -> 62 -> 69 (handoff) -> 70 (`09-06.md:19`, "on this machine") -> **74** (`09-06.desktop.md:146`). Three things only a member list shows: readings JUMP (49->52, 62->69) so 74 is a counter not 74 citable catches; the counter FORKED per machine at 09-06 (70 vs 74); it STOPPED — last increment 2026-09-06, 14 days. Null fired right: the newest later `lifetime` match is `09-16.md:259` "lifetime mutants SURVIVED", a different counter. Unit correction from 08-31 still stands — one seat's column, not room-wide. Q1b falsifier FIRED: "ZERO found in-stream by authors" is contradicted by a member of the same column six days BEFORE the ask — `librarian/2026-08-25.desktop.md:83` "WRONG +1 (mine, self-caught by running the instrument instead of reading a listing)". Pattern survives (1 self-caught vs ~28 attributed to a second vantage: chair 8, keeper 3+1+1, A 3+1, C 2+1, mine 2, E 1, B 1), the headline does not. Q2 DESIGN-ONLY after 20 days: `dispatch-gate.js` exists but is the CITATION gate and its three commits are 2026-08-24, a week BEFORE the 08-31 registration; `grep -rln -i "second.vantage" --include=*.js --include=*.rs` returns one file, one line, `:116`, inside a comment ABOUT ASK-012. Worse on D: `install.ps1 -Check` says "ABSENT dispatch-gate.js never installed - nothing to compare" and settings.json has 0 PreToolUse entries, though the manifest registers it (`install.ps1:154`, `:224`) and it is not on the declared-unmanaged list — so the 525 ledger rows came from the other machine (inference, not proven). Fourth fact for the keeper: the gate's OWN registered falsifier at `:110-116` names this ask and now has data — `node consonance/tools/dispatch-gate-report.js` gives ask 155/176 = 88.1%, print 283/340 = 83.2%, 9 UNSTAMPED rows in neither, pooled REFUSED; a 4.9-point drop is not "well below 90.4%", and I did NOT score it (no number behind "well below", and the gated seat should not read its own dial). W1: my first ledger pass tested `cited === true` and printed 0.0% to myself — the field holds a kind string, null only when asked; caught by printing members before the rate. W2: my hand split 89.2/84.4 is superseded by the room's own tool: `handback/p-ask012-vantage-B_2026-09-20.md`

## 2026-09-20 — D095 P-ASK001-ABSTAIN (D, build, repo-only, install held): the judge had been trying to abstain for six weeks and the schema had nowhere to put it — 13 of 6,289 judged turns = 0.207% spent saying cannot-determine, and BOTH out-of-schema verdicts PREDATE the ask. `node <scratch>/abstain/abstain_population.js`: l2_overseer.jsonl 8,018 rows = 6,260 verdicts + 83 parse_error + 1,675 skipped; DISTINCT verdict values `drift` 3384 / `clean` 2874 / **`unable` 1 (08-06)** / **`cannot judge` 1 (08-13)**, each with a reason naming the missing input ("requires read permission to goal.json"), possible because `l2-overseer-worker.js:92` took any truthy string — `l3-overseer-worker.js:20` has VALID_TRAJECTORIES and L2 had no equivalent. Plus 11 refusals with exit_code 0 filed as parse_error (29 exit-0 total = REFUSAL 11 / FORMAT 13 / OTHER 5; 54 exit-nonzero are infrastructure). VARIABILITY PASSED (4 values, not 2) but MY REGISTERED PREDICTOR FAILED AND IS RECORDED: `user_context === null` — the branch I reasoned would drive abstains from reading `l2-overseer.js:101` — fires **0 of 300** newest transcripts, so nothing rests on it (the L063 lesson landing on me one lap later). REGISTERED BEFORE THE EDIT (`<scratch>/abstain/registration.txt`, sha256 5650fad0, 04:51:45Z), scored on the first 500 post-install verdicts: P1 abstain 1.0–12% (floor 5x the 0.207%, ceiling the 11.8% machine-authored bucket), P2 >=50% on machine-authored sessions, P3 drift share falls >=1.0 point off 42.3% because the cron bucket runs 76.9% drift (30/39) against a 42.3% field; NULL beside it — under 0.4% and under 1 point = vocabulary only; UNWELCOME OUTCOME named in its own words — "abstain exceeded 25% and its reasons name no missing input" = escape hatch, revert. THE PACKET'S 54% IS L3'S AND I PREDICT IT DOES NOT TRANSFER: re-derived 1,432 of 2,648 (A's 1,430/2,646 +2, live stream), and sharper — P(quiet_spiral | window==1) = 62.3% vs 23.1%, 2.7x — but a single message is L0's DESIGNED unit, so the L0 analogue is "the unit is not an assistant move at all" = 11.8%, not 54%; falsifier registered: if post-install abstain tops 25% the transfer was real and I was wrong. L0 side of A's §6 gap closed (`what_l0_judges.js 400`): cron 39 (30 drift), blind verifier 8, slash-command 214, other 130 — and a NULL THAT PASSED, **0 of 400 rendered on an overseer's own child**, so A's CLAUDE_OVERSEER_RUN guard holds in L0. BUILT: prompt offers `abstain` fenced ("for a missing UNIT, never for a hard call"; reason must NAME THE MISSING INPUT), row carries `determinable` false/true/null and `schema_valid`, row TYPE deliberately unchanged (a new type hides abstains from anything counting verdicts), out-of-schema verdicts still recorded not rejected (rejecting them would have turned the two rows above into parse errors and destroyed this ask's best evidence). Downstream is a human: `grep -rn l2_overseer --include=*.js --include=*.ps1` finds no reader but the two writers. RED FIRST was harder than expected — requiring the worker RAN it (exit 1, zero assertions), which is why it had no test; entry guard added, hook invocation path unchanged. 18/18 plain and `--test`; mutants applied 14 · caught 14 · survived 0 · NOT APPLIED 0 · control GREEN (first run 13/14 — M9 lived because my assertion was an alternation where the requirement is a conjunction; tightened). dream-gate 59/0, install-only 11/0, pulse-degrade 6/0, universe-print 15/0. TWO RED SUITES ON D ARE NOT MINE, one cause: `exo_memory/review/` is absent from disk and untracked at HEAD while gen-consumer's STAYS_PRIVATE and carrier-drift's registry both name it (registry last GREEN 09-08 `986a086`, unaccounted carriers committed 09-15/09-19; carrier-drift scans .md/.html only, all 7 findings .md) — and one unaccounted carrier is my own `p-six-reds-B_2026-09-19.md:104`. A STALE POINTER I CREATED, named not fixed: `carrier-drift.js:343` and `:724` cite `l2-overseer-worker.js:34`, exact at HEAD, now `:49` — repair is 34→49, left to that tool's owner because its suite is already red so I could not have shown the edit broke nothing. Install held: `install.ps1 -Check` says DRIFT, and HEAD == installed byte-for-byte so my edit is the only difference: `handback/p-ask001-abstain-B_2026-09-20.md`

## 2026-09-21 — L058 R3 P-R3-ASK-FIXTURE (L, test-only): the test was WRONG and it was proven before it was touched — it asserted mutable live data. `ask.test.js:343` read `A.load(A.STORE)` = the live `exo_memory/ASK.md` and asserted ASK-009 OPEN; the test landed `915209a` 09-20 10:04 and the keeper cleared ASK-009 KEEP at `c80ec12` 09-20 12:42 in his own words ("009 the convo is apart of the build"), per protocol 2. DECISIVE A/B in two fresh detached worktrees: `c80ec12` touched ASK.md only (`git diff --stat`), ask.js and ask.test.js byte-identical across it, and the test is GREEN at `c80ec12^` and RED at `c80ec12`, with ASK-009 parsing OPEN then ANSWERED (variability printed first — two values, so the A/B discriminates). Registered falsifier (`<scratch>/r3/registration.txt`, sha256 c037f374, 08:01:15Z) did not fire: at the red tree the comma still parses, ASK-008 keeps its own ANSWERED, nothing is absorbed, and the only failing assertion is `nine.state`. The tool did not regress; live store today ANSWERED 9 / OPEN 2 / DECLINED 2, 0 unreadable. RE-POINTED at `consonance/tools/fixtures/ask-store_915209a_ASK-008-009.md` = blob `915209a:exo_memory/ASK.md` lines 127–136 verbatim (cmp identical, sha256 b00b329c pinned in a new test), checked first for the other scanners (no withdrawn wording or machine paths; named in 0 of carrier-drift's 10 findings). Assertions unchanged; ONE ADDED, `nine.goal` must still carry "SIX, not eleven". 42/42 plain, parallel; 6/6 filtered; js-suite `ok`. MUTANTS scored twice, suite AND the re-pointed test by name: applied 5 · caught by the test 4 · by the suite 5 · NOT APPLIED 0 · control GREEN — M1, THE D091 DEFECT (`([^,]+)`, the exact pre-D091 form from `915209a^:ask.js:88`) turns the re-pointed test RED, as does pre-D091-in-full. W1 is the lesson: my first fixture test was WEAKER than the one it replaced — F2 (comma tidied out of the fixture) survived the test and only the pin caught it, because re-pointing a live-data test drops every property the live data carried for free; the added assertion kills it. M3 (guard alone removed) survives the target correctly — the fixture's heading parses, so the guard is the neighbouring test's job, which catches it. Found: at `c80ec12` ASK-007 was unreadable — the closed-vocabulary guard working, fixed a minute later at `c116a66`; `actors.evidence.test.js` is the same defect by the store's own words. js-suite now 105 green / 4 failed / 0 silent, read through A's mid-edit runner: `handback/p-r3-ask-fixture-B_2026-09-21.md`

## 2026-09-21 — L059 R5 P-R5-CARRIER (L, diagnosis only, nothing edited but my own files): review/ is NOT the cause of carrier-drift's red — it SUPPRESSES red — and six of the eight red carriers trace to my own hand-backs. FACTORIAL, because the variability check found TWO untracked .md items, not one (review/ AND AGENTS.md, both inside the scanned `['.md','.html']`), so a worktree alone could not say which; all arms at 2a65044, compared by red-finding SET not pass/fail: L live (both present) RED 10 · 4 fail; W fresh detached worktree (0 untracked) RED 12 · 4 fail = L's ten PLUS two MISSING-FILE rows for review/tool_audit_draft (two registry rows name it); W+R review/ copied in, AGENTS.md absent, RED 10 with a set `cmp`-identical to L. So AGENTS.md contributes nothing, review/ contributes only the two MISSING-FILE rows, and the ten are tracked content that arrived after the registry's last green (`986a086`, 09-08). Registered (`<scratch>/r5/registration.txt`, sha256 104a23a9, 08:34:56Z): direction right, count wrong by one (predicted 10→11, measured 10→12, I assumed one registry row per file). THE TEN: 2 CH4-DRIFT-ADDED (cards/every-digest-carries-its-function.md f6e7b1f 09-09, record/retired_seats_2026-09-11.md 397e29c 09-11, never re-frozen) fail the frozen-walk test; 8 UNACCOUNTED, four per armed entry (only-decorrelated 33/29 accounted, cant-lose-handle 37/33), fail THE BAR, the census and the real-tree mutation test (which first requires the whole tree green). MECHANISM: every one of the eight QUOTES a withdrawn wording in order to REPORT on it, and it recurses through me — p-six-reds-B:104 re-reported E's carrier by quoting, p-ask001-abstain-B:210 reported that one by quoting, librarian/2026-09-20:84 recorded my report by quoting, and p-ask001-abstain-B:216/219/220 printed grep commands containing the wording. A report of a carrier is a carrier. Fix NAMED not made (tests are right; four carriers are other seats' records): re-freeze CH-4 after reading the two files; acknowledged rows + markers or reword the eight by owner, mine back to me; proposal — cite withdrawn wordings by registry id, never by quotation. THE PROPOSAL FAILED ITS FIRST TEST ON THE HAND-BACK ITSELF: I named the disarmed third entry by its id and the instrument flagged my file (51→52), because that entry's id IS its slogan hyphenated and the suite admits the hyphenated form — cite-by-id works only where the id is not the wording; fixed by position and date, re-run 0 naming the file. CORRECTION to D095 §7: gen-consumer is red without review/ and green with it (58/1 vs 59/0), so "one cause, two suites" was right for gen-consumer and wrong for carrier-drift. Worktree removed; review/ untouched: `handback/p-r5-carrier-B_2026-09-21.md`

## 2026-09-21 — L060 packet B P-L060-CARRIERS (L, sole registry writer): nine carriers accounted for, carrier-drift RED 11 → 6 → 2, and I refused the ruling's kind for all four rows I wrote for others while keeping its intent. Counts (`node consonance/tools/carrier-drift.js` · `node --test consonance/tools/carrier-drift.test.js`): S0 11 · 53/4; S1 (my five reworded) 6 · 53/4; S2 (four registry rows) 2 · 54/3, both armed entries fully accounted (32/32, 34/34), the cant-lose census test GREEN; the 2 left are A's CH-4 pair. Registered (`<scratch>/l060/registration.txt`, sha256 b557bf38, 08:58:00Z) with baseline 10 — STALE BY 47 SECONDS, E's consent file (the ninth carrier) had landed at 08:57:13Z; deltas held exactly (−5, −4). S1: five lines reworded IN PLACE to point at where each wording was withdrawn — line counts unchanged 261/262, every hunk same-size, so every pointer into those filed hand-backs still lands; dated notes appended after the last line. Found by doing it: D095's recorded `git show HEAD:… | grep` no longer reproduced its own 34 — HEAD had come to contain the edit it measured — pinned to c809efd; the pattern-free grep gives 34/34 and 49/49 at both revisions and does not match the registry pattern. S2 KIND TEST, one rule for all four (withdrawal = its job is to tell the reader the claim is withdrawn; mention = its job is to talk about a document, carrier or search; acknowledged needs the claim LEFT STANDING and none of the four stands it): E :274 withdrawal (agrees with E's argument; near-identical phrasing to BOOT's amendment row already filed withdrawal), librarian 09-14:125 withdrawal (ASK-008 marker on the line), librarian 09-20:84 mention (census of a carrier; acknowledged would have required ADDING a marker to the librarian's master, since only-decorrelated's marker is nowhere in that file), E consent :10 mention. No master touched. Anchors from `--census`, kinds judged and written into each `why`; inserted as text (+24 −0) because the file is hand-formatted. Disarmed third entry 51→52 is A's p-l060-ch4-A:63, traced. Hand-back and map line re-scanned: 0 findings name them: `handback/p-l060-carriers-B_2026-09-21.md`

## 2026-09-21 — L061 packet B P-L061-REFREEZE (L, sole registry writer): CH-4 re-frozen after reading both files — carrier-drift GREEN, exit 0, 0 findings; carrier-drift.test 57/57 (from 54/3); walk "reached 37 · frozen 37 · no drift"; js-suite 108 green · 1 failed (portable-paths, R-C) · 0 silent. A's §2 (p-l060-ch4-A, 30859e8) re-derived before freezing, not taken on its word: the three registry patterns over each file whitespace-collapsed give 0/0/0 for both, and no finding named either except its CH4-DRIFT-ADDED row; both read in full for what they TEACH — every-digest-carries-its-function is current doctrine (I applied it in L060 to an unlabelled git-blob), retired_seats_2026-09-11 is a dated master of retirement practice (:64-69); neither restates any withdrawn claim in substance. No refusal. --ch4-walk is read-only ("paste the list", carrier-drift.js:841), so the freeze is an edit done by the file's own history convention: files 35→37 at sorted positions, frozen_at replaced, frozen_by extended so earlier freezers stay named, _refreeze_log 30→44 with who, on whose classification, what each teaches, and what a later reader should check; +19 −3, script re-parses and proves withdrawals and every other ch4_corpus key unchanged. NOT cleared and logged as such: retired_seats:62 is a live portable-paths finding — another instrument's red. The chair's expectation came back exactly: `handback/p-l061-refreeze-B_2026-09-21.md`

## 2026-09-21 — L063 P-L063-CONTAMINATION (L, author, code not baseline): the drive literal at contamination.js:140 was hiding a defect — the no-argument run paired the repo's cells with run2's config and printed a full scoring table over 0 OF 130 TRANSCRIPTS with exit 0 (my own 09-20 W1, which I caught by reading and the tool never stopped). So REVIEW baseline refused (it would bless that), and a declared machine location refused too: transcripts sit at <config>/projects/<slug of the ABSOLUTE cells path>, so the only config that can hold a cells tree's transcripts is the one that run used, and the run's own rig puts it beside the cells (run2/rig/delivery-check.js:4,12) — an env var could name another run's config and score 0 of N silently. BUILT A's candidate with two changes: resolveConfig = --config, else dirname(cells)+'/config' by string concatenation (keeps a forward-slash --cells' spelling, so the recorded header is byte-identical); and a fail-closed REFUSAL when the config has no projects/ — stderr, exit 2, no stdout. Test first: 16 tests 11 pass 5 FAIL -> 16/16 plain, --test and parallel; mutants applied 6 · caught 6 · NOT APPLIED 0 · control GREEN. REPRODUCE on a dead line means the record re-derives, not that the line revives: the recorded command (09-20 :32) differs only in the output filename I passed and the JSON's generated timestamp; with those excluded stdout and JSON are identical — CONTAM+CORRECT 320/320, marker-only L0 25 / L1 65 / K1 63.3 as filed. portable-paths names contamination.js 0 times. NOT built: refusing a config that has projects/ but belongs to another run. W1: in 09-20 I recorded the trap in prose instead of making the tool refuse it — a warning in a hand-back is a carrier, a refusal in the code is an instrument: `handback/p-l063-contamination-B_2026-09-21.md`

## 2026-09-21 — D097 packet B P-D097-INSTALL1 (D, phase 1, nothing installed): registration secured, the check measured, and the HOLD resolved to a ruling the install cannot skip. (1) exo_memory/loop/abstain_registration_2026-09-20.txt = sha256 5650fad0…, cmp-identical to the D095 scratch original (dated 09-20 22:51 local = 04:51Z). (2) `install.ps1 -Check` on D: 27 entries = 22 ok · 2 DRIFT · 1 HOLD · 2 ABSENT. Both DRIFTs are safe overwrites, measured CRLF/BOM-normalised: session-start.js machine-only 0 (the 13 repo-only are A's leak fix, fresh guard present both sides); l2-overseer-worker.js installed is byte-identical to c809efd, so its 12 "machine-only" lines are exactly what D095 replaced. ABSENT dispatch-gate.js and carrier-drift-watch.js ruled do-not-install (installing registers a PreToolUse gate and a Stop hook nobody asked for). Keeper items flagged not ruled: 3 EXCLUDED BUT LIVE (stop/l2-overseer/l3-overseer vs the 09-06 "READY PAIR ONLY" ruling, which on reading at source decided what that install registered, not what to remove — an ambiguity, and it is the L2/L3 streams chunks 2-3 score); userprompt-submit.js REGISTERED NOT DECLARED. (3) HOLD by hand: 131 lines raw = 131 normalised (line endings no longer a factor), repo-only 116 · machine-only 15 — the manifest comment's 08-17 figures (83/69/14) are stale. Rulings: 10 DROP (SHELL_DIR literal subsumed by CONSONANCE_DATA||same; readState without the 07-25 BOM fix; the pre-beacon context line — flagged that the [pulse] beacon and its per-prompt chain-status spawn go live on D for the first time, "PIPE-TESTED, NOT verified in a live hook"; the conditional writeState) and 5 KEEP = the FRESH-PANE GUARD, which the repo copy has NEVER carried (git log -S isFreshCwd → only 58b94f9, into session-start.js). Blocking, not merely a keep: the repo main() now writes the SHARED state file every prompt, so without the guard a fresh pane would get L3 and the beacon, mark notices surfaced (swallowing them from the rooms), and overwrite last_prompt_iso/first_seen_iso (corrupting rollover and thread age). Port given exactly (5 lines after meta, before readState), NOT made — the file is not mine this packet and it needs a red-first test. RULING: do not install userprompt-submit.js until the port lands, and drop its Hold in the same commit; session-start.js + l2-overseer-worker.js can go together. W1 caught before filing: I first called the overseer registrations a violation: `handback/p-d097-install1-B_2026-09-21.md`

## 2026-09-21 — D097 packet B STEP 2 (D, still nothing installed): the fresh-pane guard ported into dev/shell/hooks/userprompt-submit.js exactly as phase 1 §3 gave it (after safeParseJSON, before readState), test first, and `Hold = $true` removed from install.ps1:113 in the same change. New dev/shell/hooks/userprompt-submit.test.js is hermetic (CONSONANCE_DATA temp dir, dream/overseer gates unset, real payload shape) and pairs each fresh assertion with a room-cwd CONTROL that must speak and must change the state file (the dream-gate rule — silence and "unchanged" are what a broken harness produces too). Red first: 5 tests 3 pass 2 FAIL — the repo copy from a fresh cwd DID emit context and DID rewrite the shared state file, turning phase 1's argument into a measurement; after: 5/5 plain and --test. Port byte-exact: machine-only lines vs the installed copy 15 → 10, exactly the 10 DROPs. Mutants applied 4 · caught 4 · NOT APPLIED 0 · control GREEN, including M4 guard-after-the-write — the test pins placement, not presence. -Check after: 3 DRIFT, no HOLD, 2 ABSENT — NEW HAZARD named: a bare install.ps1 would now also install the two ABSENT files and register their hooks, so step 4 must use -Only (install.ps1:70) on the three DRIFTs. Hook tests plain: every file green (dream-gate 59/0 spawns this hook) except userprompt_pulse 0/6, all "Python was not found" — D082's machine-bound red, test and .py unchanged from HEAD. Stale carrier named not edited: install.ps1:100-112 still describes the HOLD: `handback/p-d097-install1-B_2026-09-21.md` §-step-2

## 2026-09-21 — D098 packet B P-D098-EXCLUDED (D, install.ps1 only, -Check only): the manifest now says what is true per machine — and two suites need a test fix I do not own, one my own D097 miss. Read at source: the 09-06 "READY PAIR ONLY" ruling is the LAPTOP lineage's (librarian/2026-09-06.md:603, not .desktop) and its words describe a machine where the three were unregistered; today's word (install_D_2026-09-21.md:3, "yes to both — the overseers stay live on D") names D and names the OVERSEERS. So l2/l3 live-by-ruling on D, still excluded on L; stop.js (a session_stop event logger, grep overseer → 0) NOT covered, still EXCLUDED BUT LIVE on D — the one question left for the keeper. Un-excluding would have REGISTERED two overseers on L, so refused: added per-entry `LiveOn = @('D')` + `LiveOnWhy`, 09-06 comment kept verbatim with a dated ANSWERED FOR D block beneath; machine named by the room's one rule (state-sync machineTag: CONSONANCE_MACHINE, then ~/.consonance.json machine_tag, then hostname). -Check only: live on a named machine = EXCLUDED ELSEWHERE, LIVE HERE BY RULING (not red); absent there = RULED LIVE HERE, NOT REGISTERED (red — chosen, since no run registers an Excluded entry and a green would hide losing ruled hooks). +47 −4, all 7 hunks in the manifest or inside if ($Check); both write paths (:737, :766) untouched — no run registers anything new anywhere. Before/after on D: EXCLUDED BUT LIVE 3 → 1, registration reds 7 → 5; with CONSONANCE_MACHINE=L the output is the old output. THE TEST FINDINGS: install-only.test.js 11/0 → 8/3, isolated in a clean worktree to ONE cause — the pane env carries CONSONANCE_MACHINE=D and the test passes process.env through (it isolates only USERPROFILE); 11/0 under L and unset, 8/3 only under D; $HOME-leak hypothesis refuted (it follows USERPROFILE). Fix named not made: pin a neutral tag in run() + add a D case; do not commit install.ps1 alone. AND MY D097 MISS: universe-print.test.js 15/0 → 10/5, bisected to b718b91 (my Hold removal) — open-items.js:353 correctly returns CLOSED when the Hold is gone, and five tests drive that live manifest assuming the Hold stays (the R3 shape again); fix named: a fixture manifest like OPEN_ITEMS_SETTINGS. W1: in D097 I ran the hook tests but not every reader of the manifest I changed: `handback/p-d098-excluded-B_2026-09-21.md`

## 2026-09-21 — D099 packet B (D, tests fixed, install.ps1 ready to land with them): both suites green test-first, no assertion weakened. install-only.test.js: run() now pins CONSONANCE_MACHINE = machine || 'TEST-NEUTRAL' (the harness isolated USERPROFILE but passed the pane's CONSONANCE_MACHINE=D through); the 11 existing assertions unchanged and now on a stated neutral machine; 3 explicit D cases — both overseers live read LIVE HERE BY RULING and -Check exits 0, an absent overseer reads RULED LIVE HERE NOT REGISTERED and the bare run registered neither (LiveOn never writes), stop.js live still EXCLUDED BUT LIVE. Red first vs HEAD's install.ps1: 12/2; after 14/0 in this D pane, under L, and unset. universe-print.test.js — MY D097 MISS, owned: open-items.js:284 reads the LIVE manifest's Hold and :353 correctly CLOSES once it is gone, so the five md5 tests behind the flag hit the short-circuit. open-items.js has no manifest override and is not mine, so the fixture is a TEMP REPO TREE built at test time (real open-items.js, real userprompt-submit.js, the live manifest with Hold re-added, build throws if not); five assertions unchanged; +1 live-manifest test asserting CLOSED "Hold flag removed". 16/0. Mutants 5 applied · 5 caught · NOT APPLIED 0; U1b (no Hold AND no guard) reproduces exactly the original five failures name for name. dream-gate 59/0. -Check: 25 ok · 0 DRIFT · 2 ABSENT. W: I rang the librarian IN PARALLEL with the append, the append failed on a shell quoting error, and the librarian held a pointer to text that did not exist until I rewrote it through the editor and sent a correction — present-then-prove, in the step whose whole rule is not to: `handback/p-d098-excluded-B_2026-09-21.md` §-D099

## 2026-09-21 — D101 packet 1 P-D101-ACTORSEV (D, one test file, gate only, no assertion touched): actors.evidence ran on D because the BOARD is shared across machines and the LETTER HISTORY is not. The runner does not decide the skip — the file's gate does (js-suite.js:63-92: a CONTENT question). The gate asked "board carries every PRE_LETTER id + persist.log has a letter assignment": on D both yes — 7/7 pre-letter ids on D's board (rows 07-06..07-14, boards travel), while D's persist.log begins `1784993504 letter A -> pane=1582ff09` (07-25), not actors.js's LETTER_BIRTH 1785057198 (L's `A -> pane=6fe15f0a`, 07-26). One assertion failed; the six board ones pass on D. Env ruled out: this pane has no CONSONANCE_DATA, root = ~/.consonance.json data_dir, same key both machines; it also ran in D082 before C's 7b101b1 and A's 3d89dfb. FIX by the runner's rules: a third gate condition — persist.log's earliest letter assignment must be LETTER_BIRTH, computed as the assertion computes it, stated as observation not interpretation (pane E's rule). Not a weakening: it is the only exported letter-history fact (LETTERS is a path to the local letters.json), and on home=L a mismatch declines and js-suite reads that as a CLASS ERROR (rule f), so the red survives where the constant lives — trade named: reported as class error, and the other six skip at home in that case. Probes: plain on D NOT-RUN exit 0; forced 6/1 same red (not too strict); denied NOT-RUN (not inert); POSITIVE CONTROL — D's board + an L-shaped persist.log → 7/7, no NOT-RUN. js-suite 107g/5f → 107g/4f/1 not-run/0 class-error of 113; runner prints the forced outcome beside it. Proposed not made: split LETTER_BIRTH into its own home=L file so the board assertions run on every machine. W1: in D082 I labelled it MACHINE-BOUND and never looked at the gate: `handback/p-d101-actorsev-B_2026-09-21.md`

## 2026-09-21 — D101 follow-on B P-D101-PYSORT (D, install.ps1 + install-only.test.js): the installer's Python fallback now picks the newest BY VERSION, test-first. HEAD's `Sort-Object FullName -Descending` is a string sort, so Python39 beat Python314. Fix mirrors pane A's userprompt_pulse.test.js:68-70 (1c8760d): dir name ^Python3(\d*)$, descending on the numeric minor, no digits = 0. Named behaviour change from "the same way": a 32-bit Python312-32 is no longer a candidate (A's pattern excludes it) — on a machine whose ONLY Python is -32 the fallback now finds none; no machine here has one; a policy call for A and the keeper, and if loosened, both places together. Test first in install-only.test.js (run() gains an env overlay; LOCALAPPDATA = fixture of empty python.exe files, every real-Python PATH entry stripped, the pick read back from the -Only-registered userprompt_pulse.py command): Python39+Python314 → Python314 FAILED at HEAD (registered Python39 — the red IS the string-sort mutant); digitless Python3+Python39 and a single Python312 are guards that pass both sides. 17/0 under CONSONANCE_MACHINE=D, L and unset. -Check unchanged (25 ok, 0 DRIFT, same registration picture — -Check never exercises the pick). LATENT ON D TODAY: a read-only probe finds Python313 and Python314, and two three-digit minors sort identically as strings and numbers, so both rules pick Python314 here: `handback/p-d101-pysort-B_2026-09-21.md`

## 2026-09-21 — D103 packet 1 P-D103-CENSUS (D, read-only, third_place/jev_census_2026-09-21.md): the fixed-answer token census. ANCHOR FIRST, and it does not hold as stated: the librarian's L0 "115 calls · 130,784/call" (librarian/2026-09-21.md:136) reproduces TO THE TOKEN by per-LINE summing + containment classification with L3 checked first (RAW=L3first → 115 transcripts, 15,040,200 / 115 = 130,784) — and that method double-counts: Claude Code writes one JSONL line per content block (thinking/tool_use/text) with the SAME usage repeated (verified: usage identical across lines for every message.id; 230 lines for 115 messages). Deduplicated + classified by first user message, to the librarian's 19:05Z: L0 157 calls · 64,383/call · 10.11M; L3 206 · 59,214/call · 12.20M; judge cache_write 13.56M, not ~29.3M. L3's 51.0M did not reproduce by any variant (its containment classifier sweeps transcripts that quote the prompt; L0-first sweeps seats at 1.45B cache reads). Local-noon window tested and refuted (<5%). THE CENSUS, 31.2 h: L3 215 · 59,188 · 12.73M YES-after-E's-window; L0 164 · 64,368 · 10.56M YES-after-my-abstain-window; SCRIBE (resonance curator, 78 one-shot calls in src-tauri/target/release) 2.59M — kind-tag only; blind verifier 11 · 1.77M no (needs repo reads); duration goals 7.42M no (open-ended); keep-warm 14 · ~453k · 6.36M — fixed answer "ok" but NOT a candidate by construction (the full-context read IS the purpose); manifest 0 model calls (Rust composes it) — what it could shrink is seat cold writes 45 · ~500k median · 22.4M (83.4% of seat cache_write); librarian reads not separable (inside its 405M); triage ask.js/ferry.js and routing 0 model calls. PLAN FALSIFIER FIRES on total tokens: real candidates 25.9M of 1,526.8M = 1.7%, seats 97.7% (cache reads of their own contexts) — but on cache_write the judges are ~36%; which class the weekly limit counts is the open fact, not assumed. W1 again: shell-string code patching broke two variants (a \n became a literal newline) — rewritten through the editor: `handback/p-d103-census-B_2026-09-21.md`

## 2026-09-22 — L080 packet B P-L080-TJ1ATTACK (L, read-only, §7 of loop/tj1_registration_2026-09-22.md): the non-author attack on T-J1, before any run — 3 FATAL · 10 AMEND · 4 NOTE, all fixable by dated amendment, none needing data. Re-derived first on committed files only: the universe command (186 lines, sha256 4faf4919…) and the label file (a8b39e9c…) reproduce; S-CTRL manifest NOT re-derived (reads transcript bytes); no Jev/shadow/verdict ledger opened. FATAL-1: the falsifier fires on a DATA SHORTAGE — with no class at 20/20, "beats on NO ruling class" is vacuously true and the note is struck with Jev untested (§6 already predicts C3 empty) — an over-fireable falsifier is the D002 lesson inverted; fix: fewer than one ruling class = NOT TESTED. FATAL-2: survival assembles from TWO classes (beat on one, FA ≤ 0.10 on another); fix: both on the same class. FATAL-3: "a seat that has seen no Jev or judge output" is UNSATISFIABLE — userprompt-submit.js injects L3 verdicts into every seat each turn (this pane holds one), and the Jev shadow has run since D102; fix: define it as this backtest's outputs, and name what the extractor has seen. AMENDs: K paraphrases the rig's label ("substantive" ≠ >200 chars; the brief said "last", not the agent), so a gate fail is unreadable; baselines are the author's own regexes, not the plan's named `sourced` (:87); S-UNADJ negatives carry the regex trigger by construction, and max(baseline,0.10) then loosens Jev's bar — make it 0.10 flat; a 0.10 margin on point estimates at n=20 is noise, with any-of-3 multiplicity; INSTRUMENT UNFIT's effect on the falsifier unstated; the Claude judge is not symmetric (model unfixed, asks and cannot-say rule unstated — fix it to the judges' own haiku); sample salt ambiguous — pin 265b08f; score cannot-say both ways; the degenerating clause needs run-ids to be fireable; S-CTRL passes plan §7's REASON (subject runs hold no one's conversation) but not its LETTER (0 of 130 committed) and would leave for a vendor — keeper's word first. The member file's sha still blocks every run, and FATAL-3 must be settled before anyone extracts it: `handback/p-l080-tj1attack-B_2026-09-22.md`

## 2026-09-22 — L081 packet B step 2 P-L081-MEMBER (L, NO RUN, nothing to the gateway): built T-J1's S-WRONG member file and the K renderer; the member file FORCES NOT TESTED. Amended §1 rule applied mechanically (builder via execFileSync argument arrays — no shell strings — embedded verbatim in the file): 186 universe lines → 20 located → 13 members (C1 9/8 negatives, C2 2/2, C3 2/1) → NO class rules → amended §5 (my FATAL-1) = NOT TESTED. STRUCTURAL: 157/186 lines carry no locator of either kind (headers like "WRONG 90 and 91 on this desk" whose error lives in the paragraph); among the 20 located no class changes under a prefix reading; even all 20 in one class cannot reach 20/20. Twelve discretionary calls recorded with counts — D3 forced (a quote must grep to exactly one line OTHER than the adjudication line itself, else "exactly one" is unreachable); D7 bites (mechanical "locates": both C3 members are code lines, mcp.rs:1525 and tail-carry.js:207, C3 only because adjudications say "stop" technically; one C2 quote resolves to another WRONG line) — left for the non-author check, not hand-corrected. Blindness list in the file: no Jev output ever, no backtest output (none exists), L3 verdicts received in context (quiet_spiral 09-21 15:26:46Z; three 09-20), D095/D103 ledger reads named; declared stake — my attack predicted this shortage. Rebuild byte-identical. Digests: member file sha256 db3ecec1…0c6b / git-blob 73f7b27d; renderer sha256 5fa7a56d…0c0e / git-blob e9644d09; test sha256 ce0486c5 / git-blob fdd49efc. Renderer mirrors the rig (file order, assistant rows, NO dedup — the rig counts every row, thinking omitted), reports byte size and whether the anchor survives the 200-char truncation; 10/10, mutants 6/6, control GREEN; on the REAL 130 (counts only) the label re-derived from the render agrees with the rig 130/130, anchor hidden 0, bytes 142..4,931 median 3,326: `handback/p-l081-member-B_2026-09-22.md`

## 2026-09-22 — D109 packet B P-D109-TJ1V2ATTACK (D, read-only, §-ATTACK of loop/tj1v2_registration_2026-09-22.md): the non-author attack on T-J1 v2, before any run — 3 FATAL · 11 AMEND · 5 NOTE, none needing data. EVERY FIGURE OF E'S REPRODUCED FIRST: 424/sha 7303e265 and 149/sha 7057d834 by §8's greps; 74 members C1 49 · C2 20 · C3 5, 23 prose/51 code, and all seven exclusion counts, by my probe (embedded in §-ATTACK, sha256 eae549ee…df35, anchored de-indent command). The attack is that three counted things are not what the registration names. FATAL-1: C2 cannot rule and it is knowable now — only 3/20 = 15.0% of its "positives" carry a C2 surface word in their 3 lines (17 are code: `cmd.cwd(&cwd);`, `fn list_kept_panes()`), C2 members because an adjudication elsewhere said "live" (13/20, live alone routes 10); E's own C3 criterion, applied consistently, drops C2. C1 same disease milder: 24/49 carry no digit. FATAL-2: negatives are feature-selected and positives are not, while the baseline keys on that feature — baseline flags 18/49 = 36.7% of adjudicated vs 39/48 = 81.3% of drawn negatives (it runs BACKWARDS against the record's strata), so §5(a) asks Jev to beat a bar the DRAW lowered: (a) is too easy, a weak Jev survives, and the NULL becomes unreachable — both non-firing outcomes tilt to "Jev survives". FATAL-3: S-UNADJ is not executable — §1 asks 2 matched lines per C2 member and v1's carried rule defines exactly one; 54/68 = 79.4% within 7 days so the sitting is ~139 units not 158, the shortfall all on the keeper's NO side; "same section" undefined for the 51 code members. AMEND-1 is the room's own disease: §9's printed de-indent says 5,$p which yields 2b2cc973 — only 7,$p yields the registered 9541d52d, and E's hand-back says it was run and matched. AMEND-2: V2-D2 inert, 72/74 = 97.3% identical at intro^ and intro, so its stated reason is false. Also: k 3→2 loosens the survivors' bound; keeper's can't-tell excluded while judges' cannot-say is scored both ways; unweld "one sitting" from "before any Jev output"; the oracle has NO calibration (repeat 10%); 20-unit pilot before 158; AMEND-11 registers a prediction that can score this attack WRONG. W1: heredoc ate my backslashes again (\bWRONG\b → ?WRONG?) — rewritten through the editor. W2: I drafted "48.8 lines" that did not re-derive from my own embedded probe, caught before filing — the exact failure AMEND-1 names. E's §9 sha re-derived OUT OF the file after my append, proving append-only: `handback/p-d109-tj1v2attack-B_2026-09-22.md`

## 2026-09-22 — D115 packet B P-D115-BOARD (D, DRY RUN ONLY, nothing written/compacted/deleted): the board measured and the split designed. THREE CORRECTIONS TO THE PREMISE FIRST: board.jsonl is NOT tracked in the lighthouse repo at all (git ls-files → nothing) — it reaches GitHub only via the separate consonance-state repo, whose copy is L's at 52,260,947 B (49.8 MiB) pushed 13:44Z; D has not pushed its board since 2026-09-10 (f70d50a, 47,398,241 B), so D's 76.7 MB is local and GitHub has never seen it; and the hard limit is 100 MiB = 104,857,600 B, not 100,000,000. (1) board-compact.js HAS a dry mode and it is the bare run (its header, :47): before 62,061 rows 73.2 MiB · after 54,547 rows 65.3 MiB · removed 7,514 rows 7.9 MiB (12.1%) — A's D113 figure reproduced exactly; rule = byte-identical-repeat, first copy kept, file order preserved, the 260 torn lines carried verbatim. Duplicates BY DAY are all dated ≤2026-09-09 and ZERO every day since 09-10, so the treadmill is closed and the reclaim is one-time. (2) GROWTH MEASURED from the rows (ts is epoch MILLISECONDS): 14-day 0.51 · 7-day 0.58 · last 3 complete days 0.85 MiB/day and rising (the 14-day figure is dragged down by 09-17 at 0.05 and 09-18 at 0.01). ANSWER: compaction ALONE holds under 100 MiB for 9.7 weeks at the 14-day rate, 8.5 at the 7-day, 5.7 at the current — a deferral of one to two months, not a fix. The union is NOT a second risk, and my first reason for saying so was an ARTIFACT I corrected in the same turn: L's board reads as a strict subset of D's only because C's D114 union-at-launch already ran here at 09:39 today (its backup board.jsonl.pre-union-…, 61,426,781 B, is what made me look again). Against D's PRE-union board, L held 856 distinct rows / 0.3 MiB that D lacked, and D held 1,819 L lacked. So the machines did diverge, by a third of a megabyte, and the union has absorbed it — union = compaction = 54,561 rows / 68,482,860 B / 65.3 MiB either way. The union also added 15.4 MiB to D's FILE today with no new traffic in it, which is exactly why the rates above are counted by each row's own ts and not by file size or mtime. (3) SPLIT: 209 tracked files name the board, 59 are code, 26 non-test sites resolve the path with SIX different mechanisms and four hard-coded literals (agreement-spread:252, balance-check:196, board-audit:33, residue:532) — the exact guess board-compact's own header warns about. KEY: the 100 MiB limit is a TRANSPORT constraint, not storage — only 4 files cross the boundary (state-sync.js, ledger-union.js, sync_launch.rs, chain-status.js) and NO tool reads the state-repo copy (chain-status:971's "store" is dirname(LEDGER), the data dir). So the smallest change leaves the local file WHOLE and shards only what is pushed: 0 of 26 reader sites change; shard BY POSITION not by ts — measured, 15,696/61,820 = 25.4% of rows land behind the running ts max and the 4 months re-open 12 times, so month shards are not contiguous and concatenation would not reproduce the file; position shards of 20k rows are 29.4/23.8/18.5/1.5 MiB today; only the last shard is ever rewritten, which also addresses the state repo's .git already at 61 MB with 16 board objects. Wrong to ship if: a shard is ever rewritten (the 260 torn lines must stay torn), the concatenation is not byte-exact (.gitattributes `* -text` exists for this), a future reader reads the state copy, or a shard is capped by rows instead of bytes. W1: I got ts wrong TWICE (ISO, then seconds) and the first run reported 0.00 MiB/day and a 3,290-week runway — absurd enough to catch itself; fixed by reading one row instead of assuming its shape: `handback/p-d115-board-B_2026-09-22.md`

## 2026-09-22 — D117 packet B P-D117-BLINDREAD2 (D, blind, no Jev call, nothing outside scratch): the second blind read of the 35 L2 pairs. B vs E = 35/35, kappa 1.000 — same single drift (P34), same two abstains (P22, P25), and on P34 substantively THE SAME REASON sealed independently ("hands a furious user total vindication and never asks whether any part of the reading held"). Full table: B/E drift rate 2.9%, jev 22.9%, judge 37.1%; B vs jev 0.237 (74.3% raw), B vs judge −0.033 (57.1%), jev vs judge 0.019 — my kappas reproduce E's EXACTLY because the answer vectors are identical. BLINDNESS PROCEDURE, not intention: never opened the commit (--name-only only), rebuilt the set independently (shadow.jsonl judge==="l2" returns exactly 35, which is itself the check that we scored the same units), every probe printed key names and types with an allow-list of fields that cannot carry an answer, extraction wrote prompts.json and key_SEALED.json SEPARATELY, sealed prediction 0d28c5b9 at 21:28:47Z and answers ff80c52b at 21:34:46Z before the key was opened. Sealed line CONFIRMED (I predicted ≥0.45 and "the judge is the outlier"); secondary prediction confirmed too (my drift under 40%, judge higher than either reader). NEW FINDING neither prior read had — split the 35 into 19 personal turns (photos, road trip, memes) and 16 work turns: jev 37% drift on personal vs 6% on work (7 of its 8 drift calls are the car photographs), the judge 32% vs 44% — TWO different failure modes in one number: jev mistakes warmth for drift, the judge flags at a rate roughly independent of what it reads. Judge instability reproduces AND a second instance found: byte-identical P30/P33 → clean then drift, and P22/P25 (same keep-warm ping, same one-word reply, differing only in a paste id) → clean then drift. WHAT IT CANNOT SETTLE, sealed BEFORE the result because it survives either outcome: B and E are not independent readers — two forks of one model on one corpus produce one reading whether or not the written method determines it, so the packet's two-branch rule has a THIRD branch that fits this data at least as well, and only a reader from outside the corpus separates them. Our own test-retest does NOT count (I could see the prompts were identical); only jev's 2/2 and the judge's 1/2 are blind. W1: my first scorer stringified an object and printed "B vs jev kappa 0.000 at 0% agreement" instead of failing — a scorer that cannot tell no-agreement from no-data. W2: four probes spent joining l2_overseer.jsonl when shadow.jsonl already held both readers on one row: `handback/p-d117-blindread2-B_2026-09-22.md`

## 2026-09-22 — D118 option 1 P-D118-OUTSIDE (D, no gateway, no Jev call, nothing outside scratch): THE OUTSIDE READER — a fresh `claude -p` with no room, no cards, no BOOT — agrees with B and E on 33/35, kappa 0.729. Five-reader table: B/E drift 2.9%, outside 8.6%, jev 22.9%, judge 37.1%; B vs outside 0.729, jev vs outside 0.295, JUDGE vs outside −0.131 (below chance, the worst pair in the table, and it is the judge against the one reader with no connection to this room). All three human-ish readers picked THE SAME single drift (P34) — the outside reader with no room vocabulary calling it "phase-locks with the user's anger… reframes the threat as praise" — while BOTH machine judges called it clean. So D117's §4 THIRD BRANCH (shared prior from the room) is WEAKENED: B/E agreement is not mainly a corpus artifact. NOT CLOSED: the outside reader is the same MODEL FAMILY, so this separates the room's cards from the reading but not "this family reads drift this way" from "the method is determinate" — a different model family is the remaining test. BLINDNESS CHECKED NOT ASSERTED, and my FIRST ATTEMPT FAILED: `--settings <file>` containing {} does NOT disable hooks — the SessionStart hook still injected shell context, which is where the L3 arc-perceptions live, so that reader would have been pre-loaded with the judge's own verdicts about the keeper. Inline `--settings '{"hooks":{}}'` suppresses it; verified by making the subprocess ENUMERATE ITS OWN CONTEXT (only the harness system prompt + the generic global CLAUDE.md, 12 software-engineering headings, no room/BOOT/cards/hook output). --bare needs ANTHROPIC_API_KEY (none on this machine) and CLAUDE_CONFIG_DIR loses OAuth. Cost stated BEFORE the run: ~304k input tokens = 0.0199% of D103's 31.2h window; cap 40 calls, 35 used. THE TWO DISAGREEMENTS BOTH GO ONE WAY — outside said drift where the room said clean, zero the reverse, so the room's prior looks like a LENIENCY prior. P02 costs me: my own sealed reason recorded the doubt ("calling C's finding 'a small bug' is a compression") and I resolved it to clean; the outside reader and jev both resolved it to drift. W2: I first claimed BOTH disagreements were units where my sealed reason hesitated — true of P02, FALSE of P07, where my reason records no doubt at all; caught by the room's own proxy (did a check precede the claim?) before filing. I REFUSED option 2 as written and landed the refusal: on a one-subject trajectory measure cell counts ARE a compressed verdict about the subject, and the label-permutation repair leaks because the judge's 72%-on-one-message-windows marginal is already on the record. What I'd take instead: test-retest on identical L3 inputs, which measures reliability with NO reader forming any verdict — pending one precondition I have not checked, that the L3 store contains repeats: `handback/p-d118-outside-B_2026-09-22.md`

## 2026-09-22 — D-carrier P-CARRIER-ROWS (D, registry only, neither report edited): six rows for six reds, carrier-drift RED exit 1 → GREEN exit 0; only-decorrelated 31→33 accounted of 33, cant-lose 34→38 of 38, light-not-lifeguard DISARMED 12/60 with its 48 PENDING untouched; carrier-drift.test 57/0 after. THE BEFORE-RUN WAS RED 6, NOT 5 — the sixth is librarian/2026-09-22.md:745, the librarian's own note about its three failed passes, which quotes the wording to describe the error it made: the recursion went one level deeper WHILE the packet was being written. Kinds: :15 and :17 mention (adjacent census-table LABEL CELLS for two DIFFERENT withdrawals — :16 is light-not-lifeguard and gets no row from me, which is the trap the librarian's second pass fell into); :86 mention (inside the grep command that produced the finding — the case the README names in the kind's own definition); :745 mention (an error report asserts nothing); :52 and librarian:674 WITHDRAWAL, not marked — neither file asserts the claim, both quote ANOTHER file asserting it and name the strike at the site (marker ASK-008 present), and librarian:674 supplies the repaired wording in the same sentence; same judgement the existing p-battery-blind-E:274 row makes, so the registry keeps one convention instead of growing a second. METHOD THAT MADE IT WORK where three prior passes failed: anchors taken from `--census` VERBATIM (hand-trimming is what failed as BAD-ANCHOR), each proved unique in its whitespace-collapsed file BEFORE any write with the script refusing to write if any is not, registry copied first so "no pre-existing row changed" could be CHECKED (31→33, 34→38, 12→12, every pre-existing row byte-identical: true), and the script written through the editor — the shell ate an apostrophe on the librarian's third pass. DECLINED WITH A REASON, not omitted: DESKTOP_HANDOFF.md:64 (last touched 46f5c9f 2026-07-13, an OLD carrier not part of the recursion) gets NO row — it is a live assertion and the entry's marker is ABSENT from the file (grep -icE → 0), so `marked` would itself go red and `acknowledged` means deliberately-left-standing, which the disarmed entry reserves for the keeper; WELFARE/AUTONOMY/PLAN/SPINE likewise named for him. NEAR-MISS: I almost wrote "the diff is purely additive" — it is additive in CONTENT but the diff is +44/−2, the −2 being two existing anchors whose \u2014 escapes re-encoded as literal em-dashes (string values unchanged, which the element-by-element compare proves). GREEN IS NOT "the room stopped teaching these wordings": the tool reads .md/.html only, so l2-overseer-worker.js:49 — the LIVE JUDGE PROMPT still carrying the struck form — is invisible to it and is untouched by any of this, and it is the more serious of the two: `handback/p-carrier-rows-B_2026-09-22.md` — AND THE REPAIR RECURSED ON ME IN THE SAME LAP: after appending this very map line the tool went RED 2, both findings in my OWN hand-back's §1, on the sentence that explains the adjacent-lines trap (it names three withdrawals on one line so the reader can tell them apart; two are armed). Filed as two `mention` rows under their own entries by their own author (only-decorrelated 33→34, cant-lose 38→39), prose not rewritten, GREEN again exit 0, tests 57/0. THE GENERAL REPAIR THE SHAPE WAS MISSING, and §4b now carries it: a report about a withdrawn wording does not have to restate it — where the quote is load-bearing file a row, where it is not, NAME THE REGISTRY ID and it mints nothing. This map line was written that way from the start, which is why it is not in that red list. My hand-back also moved the DISARMED entry 60→64 occurrences / PENDING 48→52, for which I filed no rows: that accounting is the keeper's pass, not mine

## 2026-09-22 — D120 step 2 P-D120-RELAYINJATTACK (D, no API call, no claude -p run; attack in place under §-ATTACK of loop/relay_injection_registration_2026-09-22.md, E's bytes above it unchanged): VERDICT BUILD, AMENDED — 2 FATAL · 8 AMEND · 7 NOTE, both FATALs one-line fixes at no extra calls. E's arithmetic reproduces: §3 stimulus set exact (46→36 eligible→12, set id 6556f70f, 104,721 B, both readings of rule 2), sign-test thresholds, 0.98^120, the 29/35 noise, 6.1 s measured vs 6.5 s. FATAL-1: 12 stimuli × 5 repeats is the wrong way round — the stimulus is the unit, so more stimuli beat more repeats; simulated at the SAME 60 calls per (arm, class) (power.js, seeded, sha256 037c03d3, embedded): uniform 25 pt power 0.59 at 12×5 vs 0.76 at 30×2; an effect on HALF the hand-backs (28.5 pt avg) 0.09 with NOT TESTED 52% at 12×5 vs 0.83 at 30×2 — fix: take 30 of the 36 eligible, R=2. FATAL-2: the scorer has a sensitivity control (B+) and no specificity control — a reviewer REPORTING the canary at the end of its reply ends on the nonce and scores FOLLOWED, and reporting is what P-R predicts at ≥30% in B and C; fix: nonce on a line of its own, last-line signature, and an N− negative control (≤1 of 12). CHAIR'S QUESTIONS: A vs B YES, as primary — it is the plan's second question, and E demoted it on the card's ~2% HARMFUL rate which no arm measures, while E's own sealed predictions put A 5–30% / B 15–55% where the design has power; pin --effort for both (the card moves 2%→7.4% with effort). OFF-MODEL: exclude for the MODEL question, INCLUDE for the ROOM question (a live seat falls back silently too), print it as a fourth outcome — and the "only it" string rule can fire on every call, because 1 of 10 measured claude -p outputs names its model `claude-opus-5[1m]`. §0.4 CHECKED AGAINST LIVE RINGS: they do arrive in <pasted_content id="d7d4"> but each is an ~850–1,100-char POINTER, no data line, id repeated on close; the hand-back BODY reaches the librarian through Read = arm D, so C vs D is not the room's real contrast. Also: "tools: none" not achieved (allowed-tools pre-approves, removes nothing; --tools "" / --tools Read; pane A's --restricted of 09-19 strips the global CLAUDE.md, so §2's "cannot be stripped" is false); §11's overhead is MY D118 guess mis-divided — measured ~13k/call (pane C t3/tok-none.json 3,491+9,722+2) → ~9.9M not 5.83M, and the stop rule reads an unnamed field while inputTokens measures 2–6 (inert read literally, halts at probe 1 read as total). W1: I wrote "every stimulus ends in a NEXT: trailer" before checking — measured 8/12, corrected before the splice. W2: three holes E inherited are holes in MY D118 harness (no model id recorded, tools never removed, overhead a guess now carried into a 6M budget as "B's figure"), and pane A's --restricted predates it by three days: `handback/p-d120-relayinjattack-B_2026-09-22.md`

## 2026-09-23 — L093 P-L093-MEMBERS (L, no Jev/model call, no ledger opened): BUILT the T-J1 v2 member file as the non-author extractor §1:118-122 names — exo_memory/loop/tj1v2_members_2026-09-22.json sha256 feca21d5711ad75f77de7d2ebfc5637d0f94939906e21ad803a07ca9ee244332 / git-blob 1810f821 / 121,214 B; builder embedded as builder_source, git objects only, refuses unless the universe sha is 7303e265; a SECOND BUILD FROM THE EMBEDDED SOURCE was cmp-identical (the test C runs next). E's §7 reproduced to the unit: 424, all seven exclusions (112/83/79/64/8/3/1), 49/20/5 before clause 5, 25/3/1 after — only C1 enters. Matched stratum 57 of an ideal 75 (19 of 25 members drew all 3; 6 short, contributing none by the rule's letter) vs §4's "~60". The member stratum needed NO discretion; the matched stratum (MY D109 sentence, adopted verbatim) needed ten readings, three of them GAPS I LEFT: R6 section defined only for files WITHOUT markdown headers, R7 "within 7 days" unanchored, R9 unit_id undefined though §4 orders the sitting by it. Sensitivity measured with opt-in variants: matched 57 as built / 63 partial draws / 54 at v1 distance ≥3 / 48 line-only digit test — adjudicated 25 never moves and every variant leaves 73+, so no reading decides whether C1 can rule. K renderer at HEAD a1250a4 unchanged since bec101d, sha256 5fa7a56d, test 10/0. SCHEMA NOT WRITTEN: jev-ask.js:95-120 needs per question a key, type, instructions and a criteria description per option; the registration gives only the question text and yes|no|cannot-say — missing (a) criteria text for each answer (writing it = a new instrument), (b) keys, (c) instructions verbatim or framed, (d) one file or two and its path, (e) what the C1 state is; E's to write. Seen-list: NONE on any unit; everything seen elsewhere named (D095, D103, D116-D118, D120 substrate logs, L081 rig labels, L3 verdicts in my own context); the overlap check vs the 35 D117 prompts NOT run (they are on D). FLAGGED FOR THE KEEPER: 4 units from exo_memory/third_place/ and 17 from journal/librarian go to the Jev gateway in a run — his call, kept because removing them is a rule change. §13 appended to the registration (+62, 0 deleted). js-suite 124 green / 0 failed / 1 canary of 125. W1: a string-replace patch missed through escaping and my own printed check showed MISSING — fixed through the editor: `handback/p-l093-members-B_2026-09-23.md`

## 2026-09-23 — L101 P-L101-FUSE (L, no real `claude update`, no settings/env edit, nothing committed): THE UPDATE FUSE built in consonance/launch.ps1 — Invoke-ClaudeUpdateFuse runs `claude update` once before BOTH app-start sites (Invoke-FuseOnce), bounded 120 s (a version is 237,100,192 B ≈ 2 min at 16 Mbit/s; the up-to-date case is only a check), whole tree killed at the bound (taskkill /T /F), never throws or exits, launch always continues; skipped when Consonance is already running (seats live — and launch.ps1:470's up-to-date path runs BEFORE its own running check), when no claude.exe, or CONSONANCE_UPDATE_FUSE=off; failed/timeout raise Notify 6 s. launch.fuse.test.js 10/0 (fake claude.cmd: updated/current/fail/hang, skip cases, receipt location, wiring via PowerShell AST), launch.park.test.js still 8/0, mutants 10/10 caught with control GREEN under C's heavy-run lock (it made my first run wait ~11 min behind two js-suites — the lock working), js-suite 127 green / 0 failed / 1 canary of 128. TRACE: launch.ps1 is ONE OF FIVE launch paths — restore-main.ps1:153, dev/ARRIVING.ps1:132, dev/TAKE-STICK.ps1:70 and main.rs:12549 (stick-apply --relaunch) bypass it; the single point all five pass is the setup hook right after sync_at_launch() at main.rs:13253, NAMED NOT EDITED (Rust + cargo test under the lock + a double update if both) — the machine-change flows are the fuse's biggest gap. RECEIPT: sync-completion.json is written by state-sync.js INSIDE the app after launch.ps1 exits, so launch.ps1 cannot write into it; and W1 — I first put claude-update.json in the DATA DIR, which would have made the keeper's next close REFUSE (an unplaced data-dir file = REFUSED_UNPLACED, L066, jev-ask.js:28-29), caught only via C's heavy-run header and moved to %LOCALAPPDATA%\consonance\claude-update.json beside the dream/headwatch/vantage logs, pinned by a test and mutant M10. PART 3, from code.claude.com/docs/en/setup verbatim: `DISABLE_AUTOUPDATER` = "1" in settings.json env, "only stops the background check; claude update and claude install still work" — so NOT DISABLE_UPDATES, which would block the fuse itself; command, backup and byte-exact reversal PROVEN ON A COPY of his settings.json (real file sha unchanged), handed to the keeper, NOT applied. Live evidence: 7 seats on 2.1.280 and third-place/f495508f on 2.1.278 right now. Without his setting, seats still self-check "on startup and periodically", so a seat restarted mid-session can still drift: `handback/p-l101-fuse-B_2026-09-23.md`

## 2026-09-23 — L114 P-L114-ASK (L, standalone Jev batch 1, no gateway call, nothing in consonance/ or dev/, nothing committed): jev/lib/ask.js (vendored from consonance/tools/jev-ask.js: the 10 secret patterns + the key-itself check, the scrub and the D107 pacer verbatim; the contract ask({ state, questions, key }) → { choice, probabilities, reason, model, usage }; the KEY IS THE CALLER'S, ask never reads env, a missing key is a loud Refusal; exactly one choice question) and jev/bin/jev-judge.js (a Stop hook that spawns a DETACHED hidden child — detached/stdio ignore/windowsHide/unref, the room's l2-overseer.js pattern — and exits 0 in 49–73 ms over 5 runs; the child gates opt-out/listed/dream-switch, polls the transcript for the end_turn row, dedupes, builds the prompt with A's prompt.js, asks, and appends ONE row with exactly the contract's nine keys, the prompt only as its sha256; failures go to <ledgerDir>/jev.log with status only, never a gateway body). Tests 47/0 on the REAL config.js and prompt.js with fetch as the only stub; whole module 113/0 across 7 files; mutants 42 applied / 42 caught / 0 NOT APPLIED under the heavy-run lock. FOUR CONTRACT FINDINGS: (1) THE GATEWAY GIVES NO REASON — all 403 verdict answers in the room's 527-row jev_judge.jsonl have exactly choice, confidence, probabilities and type, so the flags line's "<one-line reason>" has nothing to print; (2) A's narrowedView returns an object, not the contract's string (A is right, and the contract should change); (3) C's default rubricPath is jev/lib/METHOD.md, WHICH DOES NOT EXIST (the rubric is jev/METHOD.md), so under default config every turn would refuse — my tests hid it by setting rubric explicitly; (4) the hooks docs say the transcript "is written asynchronously and may lag" and point to last_assistant_message, so keying by prompt_id + last_assistant_message is the cleaner design, which means changing A's contract. New limit vs the room: one process per turn, so there is no cross-session pacing and a 429 is not retried. W: a heredoc for time.js (the recurring shell-string class, no damage); mutant M42's first draft called a function that doesn't exist and would have been falsely "caught": `handback/p-l114-ask-B_2026-09-23.md`

## 2026-09-23 — D123 P-D123-INSTALL (D, standalone Jev batch 2, no install into the real ~/.claude — its settings.json sha256 8e2cf20a before and after, 0 bak-jev files; no gateway call, nothing committed): jev/install.js MERGES settings.json (Jev's two hooks appended as their OWN groups, written back in the file's own indent/EOL/trailing-newline/BOM, so foreign text stays byte-for-byte), recognises Jev's entries by ABSOLUTE SCRIPT PATH never file name (the room's own hooks\jev-flags.js is a same-name different file and is never touched), writes nothing on a second install (same bytes, same mtime), backs up before every write and records WHICH backup holds the pre-install file (path only, no content — settings can hold secrets), and --uninstall writes the pre-install BYTES back when nothing else changed (pinned on 2-space, CRLF 4-space, compact one-line, and pre-existing "hooks": {} / "Stop": [] files); a malformed file is refused with exit 1 and never rewritten; `home` has no default so no test can reach a real home. Hook entry is EXEC FORM {command: node, args: [script]} because hooks fall back to PowerShell without Git Bash, where a line starting with a quoted path is a string, not a call — UNVERIFIED LIVE (no real install allowed), for batch 3. jev-judge.js takes the move from last_assistant_message over the child's STDIN PIPE (never argv or a file), keys dedupe by prompt_id, keeps confidence. CROSS-PANE: E's flags looks rows up by turn_uuid = the transcript end row, C's report by a separate prompt_id — my first cut put the prompt id INTO turn_uuid, which would have SILENCED EVERY FLAG LINE; now rows carry BOTH (11 keys), pinned against E's real lastTurnUuid. confidence needs one line in ask.js (not mine): it is NOT probabilities[choice] (equal on 1 of 386 stored verdicts on D), so rows get null until ask.js returns it. FIXED a latent batch-1 bug of mine: while the transcript lags, lastTurnEnd returned the PREVIOUS turn's end row and the fallback skipped this turn as "already" judged. Tests 58/0, module 181/0, js-suite 137 green / 0 failed of 139, mutants 40 applied / 39 caught / 1 survived (equivalent) / 0 NOT APPLIED; the tracked L114 harness now reads 5 NOT APPLIED from my changes, and those properties are guarded again in my scratch harness. W4: the file-writing tool turned backslash-u escapes into FIVE invisible literal BOM characters in install.js (and once more into the hand-back); all tests passed over it, and only a NOT APPLIED mutant row exposed it — a NOT APPLIED row is information about the source: `handback/p-d123-install-B_2026-09-23.md`

## 2026-09-23 — D124 P-D124-MUTANTS (D, standalone Jev batch 3, my two harness files only, nothing committed): the tracked jev/test/ask-judge.mutants.js RE-ANCHORED — M32 (dedupe, now keyed by prompt_id), M36/M37/M38 (the spawn, whose stdin is now a pipe) and M40 (the four-field payload) all still had their target lines, so NONE was deleted; applied 42 / caught 42 / NOT APPLIED 0. My D123 scratch harness is now tracked as jev/test/install-judge.mutants.js: applied 39 / caught 39 / NOT APPLIED 0, one row DELETED with its reason in the header (the equivalent "tool-result rows read as user text" mutant), and the no-home mutant still deliberately absent because it would write into the real ~/.claude. Both harnesses now translate anchor line breaks to the source's own (D has core.autocrlf=true, and batch 2 found CRLF copies here) — unexercised, since today's copies measure LF. Module 196/0 over the 9 *.test.js files, including C's and A's in-progress work. The BOM anchor is built by concatenation so the file-writing tool cannot mangle it (my D123 W4). Near-miss: grep -c for CR at line end misread every line as CRLF in Git Bash here; a node byte count gave 0: `handback/p-d124-mutants-B_2026-09-23.md`

## 2026-09-23 — D129 P-D129-ISOLATION (D, nothing written to any real store, the 4 real lines left as they are, nothing committed): the four "refused, session_id null" lines in the keeper's REAL %LOCALAPPDATA%\jev\jev.log were written by MY mutant row — ask-judge.mutants.js M42 swaps hook()'s stub spawn for a real spawnSync, two judge.test.js unit tests then start a real jev-judge child with no session id, and it inherited the harness's un-isolated env. REPRODUCED against a temp store: --only 42 → exactly 2 lines, 29 ms apart; the whole harness → exactly 2, at its end (M42 is the last row); the whole install-judge harness → 0. The pairs match my D123 run (ended ~15:56:51 local = 21:56:51Z) and my D124 run (ended 17:36:27 local = 23:36:27Z), not the librarian's 17:37 probe, which would have carried a session id. FIX: jev/test/isolated-env.js is the one place a test builds a spawned env — LOCALAPPDATA, XDG_STATE_HOME, HOME and USERPROFILE go into a temp root, and it asserts EQUALITY against the real values, because on Windows os.tmpdir() sits inside the real LOCALAPPDATA and home, so an "inside" check cannot work. install.test.js and both harnesses (whose root sits in each mutant copy) use it. GUARD jev/test/isolation.test.js (7 tests) failed RED first, naming exactly my 3 files, then GREEN; it fails on any new jev/test file that spawns without the helper, and keeps a KNOWN list that can only shrink: judge.test.js (XDG left real), jev-flags.test.js :137 and jev-report.test.js (LOCALAPPDATA left real), clean-machine.e2e.js. PROOF in the real env: the real jev.log was sha256 58a8a606…, 4 lines, 612 B, mtime 23:36:27.056Z, BEFORE and AFTER 211/0 module tests + 42/42 + 39/39 harnesses. Lead, not checked: the L114 run on L likely did the same to L's store. The cause is mine: I never asked where a mutant-made real child would write: `handback/p-d129-isolation-B_2026-09-23.md`

## 2026-09-24 — D130 P-D130-DRAIN (D, main.rs drain logic only, no rebuild, nothing committed): GREEN — a STALE gate DOES reach the 240 s force (a new test drives the real Inbox: held at MAX_HOLD_MS−1, Forced(NoUsableSignal) at MAX_HOLD_MS; the only unbounded arm of drain_decision is Working). WHAT HELD L's 06:20 PAIR: THE DRAIN THREAD, `loop { sleep; drain_inboxes(&h) }` with NO catch_unwind (the keep-warm thread below it had one, citing L034). One panic ends queued delivery for every pane, silently, until relaunch, while door deliveries go on. D's board carries L's librarian composer rows: L110 (06:30), L111 (06:37:16 — the stall trace's "ready file current") and L112 onward all arrived, and A's L109 and the chair's note NEVER did (A itself noted "still queued" at 06:32). The drain computes pane_state for every queued pane; the door only for its receiver. Which panic is not established (stderr is not kept); the evidence would be on L: no drain row after the death point for any receiver. FIX: guarded() per pane and around the loop, panics reported to plog and the board at most once a minute per pane, returned as text so tests never write the real data dir; live only after a rebuild. cargo test --bin consonance 944/0/4 (from 938/0/4, +6 mine); Rust mutants 8 applied / 8 caught / 0 NOT APPLIED in a temp copy of the crate. SEPARATE, NOT MINE: chain-status queueRow takes the label after the FIRST ": ", and since D074 every forced row's note has one ("; composer: …", "; at the bound: …"), so a forced delivery is reported as waiting forever (rebuilt rows: a delivered ring reads "librarian 99m"); D's 235 forced rows are all pre-D074 and pair. Also named, not changed: the door delivers ahead of an already-queued message (FIFO broken). W: two wrong hypotheses first (the Working-arm spinner, the pairing) — the librarian's own composer rows settled it and I read them third; and my harness mislabelled every catch "COMPILE ERROR" (its regex matched cargo's "error: test failed"): `handback/p-d130-drain-B_2026-09-24.md`

## 2026-09-24 — D132 P-D132-UNION (D, the switch NOT set, nothing written in the live data dir or state dir, nothing committed): the union-at-launch DRY RUN on a temp copy, with the launch's own functions in its own order (appendOnlyCompare → timeParseRefusal → LU.writeUnion with lock:null → phase2 → unionVerdict), is CLEAN: all 8 DIVERGED ledgers MERGE, +0 rows each (every row of L's 9486b30 is already on D from D106), 0 lines lost in step 7's multiset unit, phase2 ok. C's compaction: by the code, a row D folded and L holds twice is COUNT-SHORT, which refuses the board and so the whole install (a union adds one row per missing key, never copies); MEASURED, L's arriving board has 0 repeated keys and 0 keys held more times than D, so it cannot bite on this head. THE STOP: on D a union that SUCCEEDS removes the ONLY guard — sync_at_launch runs --install because pushed_by=L≠D, "a WHOLE-FILE OVERWRITE ... with no recency test", and today the 8 refusals make it LOCAL HOUSE; with the switch on it would install L's 09-22 set over 17 newer D files (the librarian capture 4.2 MB→0.97 MB, the chair's 6.7→5.0 MB, four pane captures, return_state, vantage, panes, dispatch-gate) and decide() would MIGRATE D's fixed seats onto L's 09-22 tails. PRECONDITION to set the switch on D: a D-authored head (A's publish fix; f70d50a was the last, 09-10) → RESUME, no install, the union inert until a newer L head arrives. D ADDENDUM appended to the watch-list (+107 −0, the L box byte-identical). W: the first dry run died because state-sync and ledger-union require each other and I imported ledger-union first (import state-sync first, as the launch does); the shell-string/BOM class twice more: `handback/p-d132-union-B_2026-09-24.md`

## 2026-09-24 — D133 P-D133-GATE (D, state-sync.js + its tests + its mutant harness, no real push, nothing committed): cmdPush now REFUSES (exit 1, receipt outcome REFUSED_DIVERGED) when a travelling install:"fast-forward" file's STATE COPY holds rows the local copy lacks, counted as a multiset of complete lines (writeUnion step 7's unit), naming each file, the count and the first such line, and the recovery (ledger-union.js --write --file <f>, then push). A missing state copy is allowed. The first build WROTE each file into the state tree inside the read loop, so the gate had to move reads first → gate → writes; it also runs before the --dry-run return (a diverged dry run now exits 1, where it used to exit 0 — named for A). The false "in sync" (printHeads, printed whatever the heads were) is replaced by syncRelation: IN_SYNC only when this machine authored the head, BEHIND, DIVERGED (only when rows were compared — --status compares them with the gate's own function), NONE; the status file GAINS relation{state,line,rows_compared}, nothing renamed (chain-status reads it). Tests 137/0 (+15); state-sync mutants 66/66 killed, 0 NOT APPLIED (the 12 D133 rows, plus #22, stale since D114 a81d339, re-anchored and killed). js-suite 137 green / 2 failed of 141, neither mine (portable-paths on A's main.rs:19764 test string, ask.test on C's ASK.md). On D today, read-only: 0 of 11 files short, so the librarian's hand publish passes; the relation reads "D behind — the head 9486b30 is L's". For A: the gate compares with the LOCAL state checkout (cmdPush never fetches), so the Leave sequence should be --pull (verify only) then --push: `handback/p-d133-gate-B_2026-09-24.md`

## 2026-09-24 — D135 P-D135-RUN2PREP (D, nothing committed): see `handback/p-d135-run2prep-B_2026-09-24.md` (a bare pointer, by the packet's blinding rule).

## 2026-09-25 — D136 P-D136-AUTHOR (D, nothing committed): see `handback/p-d136-author-B_2026-09-24.md` (a bare pointer, by the packet's blinding rule).

## 2026-09-25 — D139 P-D139-BASELINE (D, the result file only, README.md and index.html untouched, nothing committed): the cold-stranger baseline for the README's first screen and the About tab, from 4 isolated `claude -p` readers (no tools, no session, hooks off, empty strict MCP), answers VERBATIM in `loop/readme_about_baseline_2026-09-25.md`. Unparsed items (list items under question 5, by regex, not hand): README 19/16, About 46/52. Neither text gave either reader a next step. $0.46. The known leak (~/.claude/CLAUDE.md, #87590) holds 0 room terms. R2 must reuse the same prompt, flags and count rule. W: my first About extraction mangled the <pre> diagram and &sect;, fixed before any read; the 167 B of stderr per call was not captured: `handback/p-d139-baseline-B_2026-09-25.md`

## 2026-09-25 — D140 P-D140-READ (D, the result file only, the draft untouched, nothing committed): R2 — R1's identical prompt (cmp IDENTICAL), flags and count rule on C's uncommitted draft (README sha256 b26ab2fd…, stable across the reads). README first screen 5/4 unparsed vs 19/16, About block 15/14 vs 46/52: fewer under any pairing, but ALL FOUR readers said the text gives no next step, so both FAIL on the 'what next' clause alone. Measured: the first screen by the rule is lines 1–8 (37 words) and `## Try it` sits at line 60, past the About block. $0.30. The About was markdown, not HTML visible text as in R1, so link targets showed (1 of 14 items): `handback/p-d140-read-B_2026-09-25.md`

## 2026-09-25 — D142 P-D142-READ (D, the result file only, the draft untouched, nothing committed): R2b — the same prompt (cmp IDENTICAL to R1), flags, readers and count rule on C's revised draft (README sha256 043a9f0e…, stable). README first screen 6/6 (R2 5/4, R1 19/16) and About block 14/11 (R2 15/14, R1 46/52) — both PASS: fewer than the baseline under any pairing, and all four readers now give a next step the text supplies (README: prerequisites + Try it; About: the repo + its Try it — the one judgment, since it leads out of the block). Both About readers still flag the 'grief that learned to build' sentence, 'normal hand-off', 'status line', 'next round starts on its own' and Jev's 8. $0.32; all three rounds $1.08: `handback/p-d142-read-B_2026-09-25.md`

## 2026-09-26 — D149 P-D149-CODE (D, the blind coder under prereg §10, nothing committed, only the 9 blind files and §6 :198-221 opened): 18 cells coded by §6 quotation, by id only. Firm: DECLINE 9, NEITHER 3. PARTLY REFUSED: 6 cells need EXTEND/RESTATE, whose required quote is a STIMULUS span, and the stimulus was not given (and source knowledge is barred), so strict = NEITHER with a conditional code for a stimulus-holding reader. Named for the scorer: turn 2 asks what the document says, so a faithful answer is a restatement by construction, and RESTATE maps to CLOSURE even where the content says 'not finished'. Declared: ASK-007 and UNIV seen only in standing/injected room context, no arms or predictions; this seat's frame treats closure as a failure mode, so the coder is not frame-neutral: `handback/p-d149-code-B_2026-09-26.md`

## 2026-09-26 — D151 P-D151-CODE (D, the blind coder again, stimulus given this time, nothing committed, only the 3 blind files + the one stimulus + §6 :198-221 opened): 6 cells, all firm. Turn 1 EXTEND ×3 (propositions absent from the one-line stimulus: a multi-entry list, an eponym, a tombeau/book, named traditions, entry counts); turn 2 NEITHER ×3 (all say, accurately, that the line is silent on completeness). Declared: the stimulus is verbatim a BOOT second-principle bullet in this seat's standing context, so I know the redacted [NAME]. It was kept out of every test, which ran against the redacted line as given. Named for the scorer: an 'expect the document' prompt makes EXTEND near-automatic, and a truthful 'the evidence is silent' lands in NEITHER with a non-answer: `handback/p-d151-code-B_2026-09-26.md`

## 2026-09-26 — D159 P-D159-REACH (D, blind second read, C's column and the ruling unseen, nothing committed): the 56 REACH rows (reach_rows_blind.md sha256 f7a485ca…) classed KNOWN-UNOPENED 53 · UNSEARCHED 2 (W080/W089, one event: a path that resolves only in another instance's private memory tier) · UNDECIDABLE 1 (W366, mine: 'did not look for it' fits both). Scope errors split by the cue: one obvious hop short = KNOWN (W062, W159). The limit, named for the κ: 52 of the 53 KNOWN rows are decided by the erring seat's own post-catch WRONG entry, whose vocabulary ('one grep away') names the KNOWN species, so any reader of the self-reports will agree more than the truth warrants. The independent test is the transcript at claim time, not run. Stake declared: 8 of the 56 rows are B's own: `handback/p-d159-reach-B_2026-09-26.md`
## 2026-09-27 — L115 P-L115-HARNESS (L, no item or key touched, nothing committed): the claim-recognition harness in exo_memory/loop/claimrec/ — claimrec.js readers|packets|coders|score + units.js (E's §4 splitter); one fresh `claude -p` per reply, prompt on stdin, settings and MCP as FILES, empty temp cwd, --no-session-persistence, --tools "" (empty arg; E's '""' spelling passes two quote chars in a shell), disableAllHooks + claudeMdExcludes; version before/after, exit, duration, transcripts recorded. Tests 18/0. Dummy (my own, planted false width claim in U3): reader flagged it, the mechanical map MISSED it (ellipsis-split quotes), the coder mapped it → HIT, COST 0.80. Found: claudeMdExcludes DOES keep the global CLAUDE.md out on L without the token (NONE vs YES control) — informational, A's probe decides. For E: the coder follows §3 (units, key withheld), not the packet's HIT/MISS-with-quote; and readers list statements they call uncheckable, which the parser counts as flagged: `handback/p-l115-harness-B_2026-09-27.md`

## 2026-09-27 — L116 P-L116-RULECHECK (L, registration c8c18d4 / sha256 0cea938b… checked, l115 not opened, registration not edited, nothing committed): NOT CLEAN. On a fixed 22-unit dummy my splitter matches §4-by-hand on every boundary; A's WRITTEN rule gives 32 units, 13 boundaries off §4 (splits after e.g., after ." and .**, after initials, inside table rows, inside backticks, per line, per code line; drops part lines) — and :82 defines the key as §4 unit numbers, so if A's key uses A's split it must be re-expressed in §4 units before scoring (A's job). Fixed in my code, a test each: F1 n) is not a §4 list marker; F2 unquoted items go to the coder, not step 1; F3 the coder prompt is ONLY units + list + instruction (:104 'only'); F3b the free-form parser (the first live answer was a table, and a prose line misread S5). 25/0; live coder re-run HIT, unmapped 0. Named for the librarian, not resolved: :121 '#…' vs markdown heading (the 14 heredoc replies), :122-123 the n. marker as its own unit, :99/:106 'the reader's list' raw vs parsed, :97 items the reader says NOT to check: `handback/p-l116-rulecheck-B_2026-09-27.md`

## 2026-09-27 — L117 P-L117-UNITS (L, code only, registration and retrieval\ untouched, nothing committed): ruling 2 (be4b03b) implemented — a bare list marker merges into the unit after it (into the one before if last), units.js sha256 cd6f7f00a5d88be86a570f2065bc57e31e0a57bcb2b907a99824f131e8a9626e; 2 tests added, units 14/0 + claimrec 13/0 = 27/0; the fixed L116 dummy (58311935…) splits into 21 units, every boundary equal to §4-as-ruled (L116's 22 minus the merged '2.'); rulings 1, 3, 4 already matched. Named, not chosen: ruling 2's examples call '1)' a marker, where §4 :122 lists only n. — no effect (no bare '1)' can arise), F1 stands unless the librarian says otherwise. CLEAN: `handback/p-l117-units-B_2026-09-27.md`

## 2026-09-27 — L118 P-L118-HARNESS (L, dummy only, units.js untouched at cd6f7f00…, nothing committed): readers take the ask from --ask <file> (text used as-is minus ONE trailing line ending; empty refused); with no --ask the ask is arm 1's sealed ask byte-identically — a test re-derives it from `git show c8c18d4:` §2 (the 2-line blockquote read as one paragraph) and matches sha256 07e7f855…d3c1, the askSha256 arm 1's runs recorded. run-readers.json now records ask {source, sha256, fileSha256} (old askSha256 field gone, no reader of it). Dummy: default and a file with arm 1's words + newline gave the SAME promptSha256 (a327fd25…); a different ask changed it and the reader followed. claimrec 17/0 + units 14/0 = 31/0; claimrec.js 653f60e7…. Watch for a BOM in C's ask file: `handback/p-l118-harness-B_2026-09-27.md`

## 2026-09-27 — L119 P-L119-HELPERS (L, dummy repo + synthetic files only, no sample, real board/ledger read for keys and time shapes only, units.js cd6f7f00 untouched, nothing committed): exo_memory/loop/claimrec/asof.js (f97e6958…) — parseTime (ISO MUST carry Z or an offset, zoneless REFUSED; 13-digit = epoch ms); fileAsOf(repo,path,T) = HEAD's newest first-parent commit with committer date <= T (git seconds, boundary inclusive), statuses FOUND/NOT-YET-EXISTING/DELETED/NOT-TRACKED/NO-COMMIT, renames followed BACKWARD only (renamed-away = DELETED + renamedTo, never the new content), nextChange = first commit after T; boardAsOf/ledgerAsOf filter by ts/at not line position (real board: 8,779 rows out of order, 257 fused), fused lines split by chain-status's own parseBoardLine, data dir resolved like actors.js. asof 19/0 + claimrec 17/0 + units 14/0 = 50/0. Limits named: uncommitted state invisible (UNVERIFIABLE, not WRONG), committer-date/skew/D's unpushed commits, --follow heuristic, writer clocks (ts_source unexamined): `handback/p-l119-helpers-B_2026-09-27.md`

## 2026-09-27 — L120 P-L120-VERIFY (L, blind to C: C's folder, hand-back, shared replies and scoring notes never opened; nothing committed): 193 claims, kind first then verdict, by the registration at cf2439b (§3 kinds, §4 as-of order). Input claims.json sha256 2f4c932a… (matches 1a8203a). Output verdicts.json (outside the repo, l119\verify\B\) sha256 a444e1439e2369841f0802804320acb2b5f2173a7e8eb31e550c0c440eceb85d. Kinds: CHECKED 40 · STATE 85 · CONCLUSION 35 · not-a-claim 33. Verdicts: 150 CORRECT · 7 WRONG (5 PARTIAL) · 3 UNVERIFIABLE. P(wrong|kind): CHECKED 0/40, STATE 7/85 (8.2%), CONCLUSION 0/32. No kind revised after its verdict. All 7 WRONG are unchecked STATE: relative times/dates, a unit, and 'never sent', each read at stated precision, plus one ruling reported as its opposite. Hard-case rules for κ: presuppositions and red-first test titles are NOT claims; own present-tense actions are IN; hooks are not CHECKED; D-side state decided from another seat's tool result within 30 min. W: rec.js suffix typos → added @group|n addressing: `handback/p-l120-verify-B_2026-09-27.md`

## 2026-09-27 — L121 P-L121-MERGE (L, no real merge, push or remote; nothing committed): .gitattributes +31 lines — merge=union for exo_memory/map/?.md, exo_memory/librarian/2026-*.md, exo_memory/third_place/2026-*.md (61 files by check-attr), chosen by measuring every post-creation change across first-parent history (appendonly.js: maps 508 tail/6 mid/6 edit, dated librarian 607/2/1, dated third_place 32/0/0). REFUSED the plan's librarian/*.md: LEDGER.md is edited in place (4/36/26). Journal (59/11/5), loop, handback, BOOT/SOURCE, json stay out. Throwaway proof: P1 union keeps both appends; N1 union silently keeps BOTH versions of a line edited on both sides (control N2 conflicts). TWO TRAPS: P2 — git reads merge attributes from the MERGING checkout, so L's committed rule does not protect D's merge; D must add the lines to .git/info/attributes first (P3 proves it). And the runbook dry run showed Git Bash rewrites `origin/main:.gitattributes` into `origin\main;.gitattributes`, so that step silently does nothing — fixed with MSYS_NO_PATHCONV=1 (PowerShell unaffected). Runbook loop/runbook_D_merge_and_push_2026-09-27.md, dry-run verified: only LEDGER and journal conflict. Not verified: D's real commits are not on L: `handback/p-l121-merge-B_2026-09-27.md`

## 2026-09-27 — L122 P-L122-READ (L, read-only, nothing committed): A's landing 8389900 of the label rule is RIGHT as a landing — item 7 == draft §2a byte for byte (sha256 0e02ce76…, 1456 chars), both pointers == §2b (9502ee69…), placed where §2b said (COMMITTEE.md:112, LIBRARIAN.md:255), item 7 at BUILDING.md:480 after item 6. One TENSION, not a contradiction: item 2 ':408 Every number re-derivable by a command printed beside it' vs item 7 ':490-491 inferred: is owed where … a figure' — a seat may read an unsourced inferred figure as allowed; suggested one clause, not made. Also: a label is not a path (cite-not-recollect). Pointers carry a one-sentence gist of item 7, so they are carriers if item 7 is amended. CARRIER-DRIFT red (57 tests / 3 fail, one cause): CH4-DRIFT-ADDED on 3 research files added on L 09-27 (c8c18d4, 110a278, cf2439b); research/ is a SEEDED CH-4 dir (carrier-drift.js:204-206); worktrees: 5ced140 GREEN, c8c18d4 RED 1 finding; item 7 adds nothing (37+3=40). The chair's lead 7ee413a is RULED OUT: it exists on L and is an ancestor of 5ced140. Fix = a deliberate re-freeze after reading the three files (not done). W1: two line refs off by one, fixed before filing: `handback/p-l122-read-B_2026-09-27.md`
L122 addendum (same hand-back §7): at the chair's correction, the carrier-drift bisect is tight — 7ee413a GREEN, 5ced140 GREEN, a6d1a28 (c8c18d4^) GREEN, c8c18d4 RED (first bad commit, L115 research file), HEAD RED with 3 findings; item 7 adds none; the lead was already ruled out in §4.

## 2026-09-27 — L122 P-L122-FREEZE (L at 5ed7cb2, registry untouched, nothing committed): CH-4 re-freeze REFUSED for now. Read the three research files in full as the non-author: prior_art (L115) and strict_ask (L118) are FREEZE-OK (sourced census and labelled inference; the ASK block is fenced by markers; no withdrawn wording, all 3 registries accounted). BLOCKER: claim_base_rate_priors :175-176 is a bold imperative, 'Route FUTURE, INTENT, OPINION and the SPEAKER's own state out before verdict'. The sealed registration :121-125 kept the speaker's own state IN (W259), and item 7 exempts only future/intent/opinion. research/ is carried whole into every seat, so the overruled advice teaches unmarked. The fix is one dated marker appended by C or the librarian (mark the carrier, leave the trace); then the freeze is mechanical: --ch4-walk adds exactly 3 paths, no removals. The tool has no write mode ('paste the list', carrier-drift.js:841), so the freeze is a script-written paste — reading flagged. b0e7de3 closes the item-2 tension and the cite caveat; wording note: 'loosens nothing' sits beside a narrow inferred-figure exception, the same shape as my own suggestion. carrier-drift.test stays 54/3 by refusal: `handback/p-l122-freeze-B_2026-09-27.md`
L122 freeze addendum (same hand-back §8): the librarian's marker at 58355f5 sits directly under priors :175 and neutralises it; CH-4 re-frozen BY SCRIPT from --ch4-walk (+3 research files, −0, withdrawals byte-identical, provenance in frozen_at/frozen_by/_refreeze_log), committed 232ffc5 by path, not pushed. carrier-drift.test 57/0, tool GREEN 40/40. W2: my own hand-back line 19 quoted two withdrawn wordings and minted a carrier (55/2); replaced with registry ids.

## 2026-09-27 — L123 P-L123-VERIFY (L, read-only, nothing committed; the search words are never written, and my own scanner lives in the scratchpad with matches masked): A's rewrite VERIFIED CLEAN for what the push adds. Tree diff backup..74aaf21 = only p-l121-scan-A (5+/5-); 36 = 36 commits; 7 rewritten (30-36), 0 message changes, 0 author/date changes, the patch differs only at 360bf94 -> 1f448d7. Scan of git log -p 5ced140..HEAD: 0 hits; positive control on the backup range: 7 hits, all in the redacted file at 360bf94:26/46. No backup/* ref on origin, no push config, no upstream, so the push must be exactly `git push origin main`. A's two hand-backs: 0 hits. map/A.md:1279 hits, but it is 3ea3e8c (D071, 09-17), already on GitHub; A's change is one hunk at :1517. For the keeper, outside the range: the whole tree has 0 hits for P1 and P2; the already-public history carries pattern matches from earlier keeper-directed work (telemetry viewer, the D071 track-lights lap, render advice, Third Place notes), and the P8 hits are an unrelated web-security setting; removal would mean a force-push, his call. W1: a line count off by one; W2: this map line first spelled out one pattern's word and was caught by my own scan before ringing: `handback/p-l123-verify-B_2026-09-27.md`

## 2026-09-27 — D161 P-D161-READ (D, blind reader B, nothing opened beyond the units file; my read committed by path): the 40 Q3 units (sha256 a08b46ff… verified) answered YES 27 · NO 11 · CAN'T TELL 2 in `loop/q3_read_B_2026-09-27.md`; scorer parse-checked on my file alone (40 units, USABLE; the self-kappa is not a result). Hard: my rule counts a qualifier past the output (place, history, cause, label for a bare number) as not shown, so disagreement should cluster on figure-shown-but-qualifier-not; intent sentences; unknown speaker for "mine"; cut outputs treated as not shown: `handback/p-d161-read-B_2026-09-27.md`

## 2026-09-27 — D164 P-D164-READ (D, read-only, nothing committed): A’s a18a0df (runner spawn removed, dated trace, absence-pin test; start_jev_shadow and the runner filename each occur once in main.rs) and C’s 37931aa (README, About, Third Place header say retired 2026-09-27, record kept, visible-text pin) both CORRECT, no refusal. Nothing automatic calls the gateway on D after A’s change except the current exe at its next launch (keyless env, should refuse, inferred); agrees with E. The key is still in every running seat’s process env (length 60, value never printed); the named why-file jev_the_question_not_the_judge is not on D (409ae2b unknown here, likely L); jev/README.md still reads live and is linked; two tool header comments stale. cargo 973/0/4 under the heavy-run lock, UI tests 6/0 and 10/0, portable-paths green, js-suite 145/0 of 147: `handback/p-d164-read-B_2026-09-27.md`

## 2026-09-27 — D165 P-D165-READ (T-180 T1, D, read-only, nothing written in the t180 repo): after all three hand-backs settled (12:03:19) and a file snapshot that held to the end. Suite 74/0, but 2 of the 74 are scripts/*_test.js picked up by node 24 default discovery (pass on exit 0, and they rebuild out/ on every run): the honest count is 72 (22+22+13+15). Writer round-trip checked independently: the installed kn5 (sha256 398943b9…) is byte-equal to a fresh write of C scene, world pos and marker diff 0, winding 394,304 CCW / 0 CW vs stored normals, V = 1-v everywhere, 0 bytes left. C jump clearances re-derived (0.61/1.07/0.90/1.07/1.30 m). E five marker checks = ARCHITECTURE 5c one-to-one. surfaces.ini = FINDINGS 4c values; 1ROAD? matches 1ROAD_k inferred from reference tracks naming 1ROAD_MainTrack. Privacy PASS x5; Rule 1 PASS (only the two t180b_ folders, 64 -> 66, cfg untouched). Land all 12. Shared-layout risk: the round trip and the writer share research 01 layout, so AC load at T2 is the only independent test: `handback/p-d165-read-B_2026-09-27.md`

## 2026-09-27 — D166 P-D166-FIXES part 1 (D, nothing committed): (a) t180 package.json with one script, npm test = node --test "test/*.test.js", giving 72/0; the packet form node --test test/ fails on Node 24 (it treats the folder as a file, exit 1), and the bare node --test runs scripts/*_test.js too (74); renaming those scripts is the better second step. (b) AcTools Kn5Writer.cs at e5e5c94 read against A kn5write.js: no field differs (order, strings UTF-8, props 40 B, Mat4x4 rows with translation at 12-14, 44 B vertex, ushort indices, uint material/layer, sphere, renderable), and AcTools itself writes version 5 (CommonAcConsts:5). (c) jev/README.md gets a RETIRED 2026-09-27 line; jev-judge.js:2,:6 and jev-shadow-runner.js:2,:6 are comment edits in place, no lines added; jev tests 211/0 after my first README line broke R10 (an exo_memory link, W1) and I fixed the line, not the test: `handback/p-d166-fixes-B_2026-09-27.md`

## 2026-09-27 — D166 P-D166-READ (D, t180; I wrote docs/INTERFACES.md, CHANGELOG.md, test/join.test.js; no line of resolve.js or path.js changed): all D166 parts hold and support append-at-head (extendPath/extendMesh equal a full rebuild exactly on a resolved doc; sculpt within 6e-12 m). The librarian 6 TODOs were a transient of path.js mid-rewrite; doc-geom is 3/3. New test/join.test.js 4/4, mutants 3/3. JOIN DEFECT for C: mesh.js safeId names cells by segment id, A three parts share it, so 16 duplicate node names in 31 (fix: name by id+part). E limits all trace to FINDINGS lines; FINDINGS:313 prose numbers are wrong (23.87 and 189.87 m, not 21 and 100); E jump D is measured off-lip (12.39 for 12). C tolerance was saved before the run (12:11:40 vs reads at 12:11:58+, section 1 byte-identical). 240 cfg backups all identical (E said 180); AC rewrote 7 app settings files in the install during pre/post-override launches. Privacy PASS x5; removed a room path from INTERFACES. DO NOT LAND NOW: D167 is in the same tree, suite red (npm 319/4/6, bare 338/2/6, all in validate_bounds); land once after D167 on a combined read. CHANGELOG ac_launch entry struck: `handback/p-d166-read-B_2026-09-27.md`

## 2026-09-27 — D167 P-D167-LAND (D, t180; I owned src/ test/ INTERFACES CHANGELOG for this track; nothing committed): GREEN. A section 4 resolve diff applied cleanly (blend field; item 2, closed docs, not applied). Duplicate node names FIXED in mesh.js safeId by (id, part): 16 of 31 duplicates to 0, which also removed the BVH false positives (bvh.js:50 name map) that refused every default export. E export todo made real (red on the old mesh.js, green now). join.test.js now 6 tests. npm test 384/378/0/6; bare 498/492/0/6 on the re-run; a first bare run had one 0xC0000005 node crash in geom_grow that did not recur (5/5 solo x3). The 6 round-trip TODOs hold (tools/ unchanged). Privacy PASS; room shorthand left as a NOTE (mutation anchors). 48 files to land, ac_launch x2 and app/ + src-tauri/ excluded: `handback/p-d167-land-B_2026-09-27.md`

## 2026-09-27 — D168 P-D168-READ (D, t180 app lap; I own package.json and CHANGELOG, read app/ + src-tauri/; nothing committed): GREEN. npm test now includes app/test: 495/489/0/6. The app BUILDS (cargo build, 0 warnings, 49 s) and STARTS (window titled T-180 Track Builder, closed by taskkill of our own pid). Screenshot via PrintWindow at scratchpad/d168/app-window.png: palette with 7 built-ins and My pieces, build view default, 5 camera modes, validation and handles panels, no environment. Defect: nullnull under THE TRACK (palette.js:84-85 replaceChildren with null children; a one-line fix for A). Load colours never show (no speed model; E noted it). E hand-back left a FINAL_MUTANTS placeholder. No mesh over IPC (5 commands, names and text only). Privacy PASS; icons regenerate byte-identical and differ from blackbox; build output ignored. W1: my first screenshot used CopyFromScreen and captured the keeper screen, not the app; deleted at once, undescribed; rule: never capture screen pixels, use PrintWindow: `handback/p-d168-read-B_2026-09-27.md`

## 2026-09-27 — D169 P-D169-READ (D, t180; I own CHANGELOG; nothing committed): NOT GREEN. The parts hold: C five PrintWindow captures each show the app window only, and the track from the named view (build after the jump is a sliver, correctly: head over the flight); E FINDINGS 3d reproduces exactly (node tools/speed.cjs on 7 replays: pooled 260659 frames p50 460 p99 764; every band p50/p95 matches); A export of a closed track with the self-check ON writes t180b_b_read, 10 files, kn5 v5 with 74 meshes and 9 markers, no warnings (A claim that BVH false positives still refuse default exports is stale). Privacy PASS (no captures, replay bytes or autosave in the repo). BUT D170 edits by C and E, and a live resolve.js change, sit inside the D169 files after their hand-backs, and my npm test + cargo build were stopped by the harness for low memory (1.4 of 62.9 GB free); I released my own stale heavy-run lock and left another seat npm test alone. Land D169 with D170 on one read. D168 attempt-1 capture confirmed gone (scratchpad, recycle bin, transcript holds only attempt 2 by size and hash): `handback/p-d169-read-B_2026-09-27.md`

## 2026-09-27 — D170 P-D170-READ (D, t180 combined D169+D170; I own CHANGELOG and package.json; edited my own join.test.js; nothing committed): NOT GREEN for a by-path landing from the shared checkout, because test/doc.test.js (D170+D172) and test/export_words.test.js (D170+selfcheck+D171) mix live hunks. A verified D169+D170-only set is in worktree %TEMP%/b-d170land-wt (71 files copied plus 2 built mixed-test versions): npm test capped at 4 under the lock gives 635/628/1/6, the 1 a no-output process crash in handles-panel (7/7 x3 alone); the whole tree gives 749/743/0/6; cargo build 59 s, 0 warnings. join.test.js:83 ruled verifiably wrong: after the D170 landing ramp, blend null on w4 demands a SEAM_w4_in with rows 5.99 m apart, a step; replaced with a stronger check (ramp on the take-off font, w4 blends from it, no SEAM_w4_in), 6/6 with a mutant caught. No self-check refusal (only the switch test at :161). Defect for A: default jumps are sized at 300 km/h but validated at 460, so every default jump is red (E section 3 has the fix). package.json gains --test-concurrency=4: `handback/p-d170-read-B_2026-09-27.md`

## 2026-09-27 — D171+D172 P-D172-READ (D, the landing worktree C:\Users\nname\AppData\Local\Temp\b-d172land-wt from 59ff906, nothing committed): GREEN. Suite under the lock at concurrency 4: 736/730/0/6 (641 + E 39 + A 56). Hunks separated by exact-string surgery (scratchpad/d172/mixed.js): schema 2 kept, pitLane/schema 3 removed. fromwords.js had two D174 lines (a pitlane require); removed, and it is now byte-equal to E's sha256 953281d0. Probes: markers 10/11 (the 11th was my own fixture) plus the export refusal; textures 20/20 on self-made PNGs and a hand-parsed DDS. D172 is a library: mesh UVs, the preview and export wiring are not built. Privacy PASS. W1: I copied a 'pure' file without checking its hash: `handback/p-d172-read-B_2026-09-27.md`

## 2026-09-27 — D171–D174 P-D172-READ widened (D, one worktree C:\Users\nname\AppData\Local\Temp\b-d174land-wt from 59ff906, nothing committed; b-d172land-wt is superseded): GREEN. Copied from a 17:28:38 snapshot with sha256 per file (68 pending, 60 land, D175 files excluded); the worktree still matched the snapshot after the run, and the D175 edits made since are not in it. Suite under the lock at concurrency 4: 806/800/0/6. My own probes: markers 10/11 (the 11th was my own fixture) plus the export refusal; textures 20/20; texture maker 15/15 (same bytes in a fresh process, DDS seam); pit lane and layouts 16/16 (join gap 0, boxes 23.0 m out, per-layout files). Privacy PASS; NOTE: 4 room-word comments. A's D174 hand-back has unfilled FULLSUITE and MUTANTS2 placeholders. The live CHANGELOG was edited by D175, so it needs a merge at landing. W: printf ate this line's first write at a backslash-U, repaired with Edit: `handback/p-d172-read-B_2026-09-27.md`

## 2026-09-27 — D173+D174 P-D174-READ (D, worktree C:/Users/nname/AppData/Local/Temp/b-d174only-wt from ae10a41, D173+D174 only, nothing committed; the widened D171–D174 read is superseded and its worktree removed): GREEN. The 27 files come from the 17:28:38 snapshot; a second snapshot at 17:39:39 shows only serial.js and mutation.test.js moved, both by D175 hunks, which are left out. Suite under the lock at concurrency 4: 806/800/0/6 (736 + 70). My own probes: texture maker 15/15, pit lane and layouts 16/16, 12/24/48 boxes on a lane. Privacy PASS; NOTE: pitlane.js:4 quotes "the keeper". A's hand-back still has its FULLSUITE/MUTANTS2 placeholders. W1: my widened read said D175 edited the live CHANGELOG; wrong, it is 59ff906's file left behind by the index-only reset: `handback/p-d174-read-B_2026-09-27.md`

## 2026-09-27 — D173+D174 addendum (chair, crossed wires): every step was already met: b-d174only-wt is built at ae10a41 = origin/main, and its 27 files are byte-equal to the snapshot b-d174land-wt was filled from. Suite 806/800/0/6, privacy PASS. b-d174land-wt removed (--force: uncommitted files). The record for p-d172-read-B is the committed 614a80c version (89befb2a); I restored the working file to it, and moved the widened rewrite to p-d172-read-widened-B-SUPERSEDED_2026-09-27.md with a banner: `handback/p-d174-read-B_2026-09-27.md` §A

## 2026-09-27 — D175+D176 P-D176-READ (D, worktree C:/Users/nname/AppData/Local/Temp/b-d176land-wt from aa4d565, nothing committed): GREEN. All 4 hand-backs were in by 18:08:21 (deadline 19:02). The worktree is the 18:16:23 snapshot plus A's comment-only final ac.rs; the post-snapshot D177/D178 edits to soak.js, shell.js and both mutation harnesses are left out, and so are the D177 onboarding/preview files. Suite under the lock at concurrency 4: 876/869/0/7; cargo 14/14 twice. C's bench structure re-derives exactly (124 words, 40.26 km, 1,456,734 vertices, RSS 1,498 MB); timings ~2x lower, same verdicts, all over budget. My first bench attempt hit an access violation (0xC0000005), not reproduced. The soak is deterministic (seed 7 x2 identical); C's "seed 1 op #67" is really #71. A's launch spawns only via RealSpawner, gated (off by default, button disabled). README 6/6 rows true, but row 104 goes false with D176. The torn-roll sculpt commit reproduces (A's). Privacy PASS; NOTE: "the keeper" appears on the README front page for the first time: `handback/p-d176-read-B_2026-09-27.md`

## 2026-09-27 — D177+D178 P-D178-READ (D, worktree C:/Users/nname/AppData/Local/Temp/b-d178land-wt from cb8e765, nothing committed): GREEN for landing. Snapshot 20:11:50; preview.js, index.js and mutation.test.js hunk-separated from the in-flight AC look (mixed.js); README taken from the live tree at 20:14:52 for E's frame row. Suite under the lock at concurrency 4: 932/926/0/6 (the clean number A owed); cargo 14/14; worktree identical before and after. Conditions a-c met with lines (geom_loop:57/:69; geom_path:3-11, :29, :42; INTERFACES:141, README:68, ARCHITECTURE unchanged). join.test.js unmodified, 6/6 passing. The soak --seed 1 --ops 300 crashed at op #33 (phrase id); I fixed one line in soak.js (sculpt only top-level words), after which 0 torn and 298/300. C's op counts re-derive exactly (42,476,456 -> 10,963 mesh ops). The bench crashed natively again (0xC0000005) and is queued with a <=90 min loop; addendum to follow. No installer staged, no install residue. Privacy PASS; NOTE: adds "librarian" x7 and the repo's first "the chair": `handback/p-d178-read-B_2026-09-27.md`

## 2026-09-27 21:02 — D178 bench addendum: `node --expose-gc scripts/bench.js --km 40 --seed 17` on b-d178land-wt under the lock, exit 0. The structure matches C's option-2 run exactly (930,134 vertices, heap 174, array buffers 38). Place 43.3, drags 54.9/94.5/64.8 (all over 50), full 204.9, RSS 904 MB, against D175 §1's 1,000 / 1,325-3,713 / 5,902 / 1,502. C's and E's millisecond figures run 1.5-2.5x faster than this busy-machine run; E's "4 of 5 budgets met" does not re-derive here. The CHANGELOG gained one bench line after the suite; nothing else changed: `handback/p-d178-read-B_2026-09-27.md` ADDENDUM

## 2026-09-27 22:15 — D177 widening, P-D178-READ (D, worktree C:/Users/nname/AppData/Local/Temp/b-d178x-wt at e6b4362, nothing committed): GREEN for C's AC look, with one caveat. e6b4362 (the chair's landing of my D177a+D178) equals what I tested. The delta is 17 files (the AC look at C's hashes, 2 README rows made true, CHANGELOG). E's onboarding is OUT: its hand-back is still a draft with 8 placeholders. Onboarding checks: the flag is in localStorage (outside the repo); README rows true. Widened suite under the lock at concurrency 4: 980/972/1/7; the 1 is M15, caught only at file level under load, and caught by name 2/2 alone. Ms-PL: acshaders.js is the one port with the full notice; the licence text sits beside it; aclook.js's shade() is worth the notice too (chair's call). List equality is partial (paint and closing seam, a todo). No images committed. W1: I began widening in a worktree the chair had already staged; restored to the staged index before the 21:07 commit: `handback/p-d178-read-B_2026-09-27.md` WIDENING

## 2026-09-27 22:42 — D177b+D179+D180 P-D180-READ (D, worktree C:/Users/nname/AppData/Local/Temp/b-d180-wt at e6b4362 = the 22:09:24 snapshot, 66 files, nothing committed): NOT GREEN. Blockers: all seats kept editing after their hand-backs (A's 0.2.1 bump, ac.rs, E's labels/handles, C's prove_render/geom_mutation), and the snapshot caught A's ac.rs mid-edit, so cargo test --lib does not compile (plain_path missing); A's release-docs still has FULLSUITE/ROUTED/NOTVERIFIED; E's onboarding is still DRAFT; E's jump-default diff was never applied (no setDesignSpeed), so that claim does not hold in the code. Resolved while I read: the keeper's app data A had set aside (.aside-d180) was back by 22:40:16. Holds: bench 25.6/18.7/27.5 ms (E's 25.0/19.2/24.3 re-derive; every budget met); JS suite 1,079/1,071/1 (R1 load flake, D181)/7; Ms-PL notice; privacy PASS. README row 115 overclaims. Route: a freeze, finished hand-backs, then a re-snapshot: `handback/p-d180-read-B_2026-09-27.md`

## 2026-09-27 22:55 — D180 soak addendum: 10k soaks on b-d180-wt under the lock re-derive C's figures exactly for seeds 1, 7 and 17 (7 and 17 on a retry, after native 0xC0000005 crashes with no output: the 4th and 5th tonight, not reproducible, not our code). Verdict unchanged, NOT GREEN: `handback/p-d180-read-B_2026-09-27.md` ADDENDUM

## 2026-09-28 00:45 — D181 FINAL, P-D181-FINAL-READ (D, worktree C:/Users/nname/AppData/Local/Temp/b-d181-wt at d331f82, 70 files, nothing committed): GREEN. The 23:06 snapshot, plus E's order.diff and C's seam.diff applied in the landing seat. Suite under the lock at concurrency 4 is CLEAN: 1,096/1,089/0/7, with M15 and R1 caught by name; cargo 15/15; timers-regression passes; bench all budgets met (place 30.4, drags 43.9/26.3/32.8, full 167.4, RSS 912). No placeholders in any of the nine hand-backs. Privacy PASS. README item by item: 69 OK / 3 WRONG / 7 OVERCLAIM / 1 UNCLEAR; the 3 wrong rows, row 115 and the intro are corrected, 6 overclaims named. CHANGELOG entries merged into A's 0.2.1. A must rebuild the installer from the landed commit (the 22:49 build lacks both diffs). W1: I destroyed the chair's staged b-d178x-wt at 22:11; no worktree is removed after hand-over until the chair says it is pushed: `handback/p-d181-final-read-B_2026-09-27.md`

## 2026-09-28 00:52 — D182 P-LIKE registration SEALED before any D182 change (origin/main d331f82): exo_memory/loop/p-like_registration_2026-09-27.md sha256 37d9ede8…; stats script plike_stats.js c6832696…; targets from my reads, byte-identical to E's (Sakura/Centrifuge first 3 km: 100% pipe, width 31/30 m, bank 36.2/31.6°, curved-radius median 243/353 m). Rebuild may set ONLY length, heading, climb and jump gap/drop; width, bank and ψ stay at defaults. T1–T12 with reasons, criterion 2 against the landed corpus.json, and a control: the pre-D182 palette must FAIL or the test is void: `handback/p-d182-plike-reg-B_2026-09-27.md`

## 2026-09-28 01:1x — P-LIKE control scored after two sealed amendments (A1 3097aa89: climb is a pitch change; A2 cdf509ff: a lap-proof red is lifted for measurement and reported as exportable: no). The pre-D182 palette FAILS on both tracks (bank 0.1°/0.3° against 36°/32°): the tolerances have teeth. FINDING: the pinned reader loses both rebuilds at their first tight word (R 83 m and 118 m; width hits its 141 m cap, then it climbs the wall), so rebuilds are scored on only 350–640 m and T1 fails whatever the pieces. Decision needed before the D182 run: (a) keep as sealed, or (b) fix the reader and re-register; I recommend (b): `handback/p-d182-plike-reg-B_2026-09-27.md` ADDENDUM

## 2026-09-28 01:1x — Verified t180 main 484be9e (D177b+D179+D180+D181) against the b-d181-wt landing: 70/70 by content. 60 byte-identical to my recorded sha256; 10 differ only in line endings (CRLF snapshot vs LF commit): 4 identical once CRs are stripped, and 6 equal to snapshot + E's order.diff + C's seam.diff, rebuilt and compared. Same 70 file names. (Recorded in p-d182-plike-amend3-B.)

## 2026-09-28 02:24 — P-LIKE AMENDMENT 3 SEALED before any D182 run: `exo_memory/loop/p-like_registration_amendment-3_2026-09-28.md` sha256 7714535850698bba… (02:19:09). Reader re-pinned ca45c683…; runner passes width 0 when the export has none (plike_run_a3.js 43bfd1c9…); NEW shape rows T13 (tilt median at ¼/½/¾/edge per side within target [p10−3°, p90+3°]) and T14 (steepest tilt rate ≤ 1.5× target), measured by plike_profile.js d1592eab…. C's three acceptance items pass (my own 17-layout re-read was cut off by the 01:46 crash at 4 of 17). Control scored AFTER the seal: FAILS T13 AND T14 on both tracks, as registered. The old half-pipe is flat to half-way (½ tilt 0.4–3.1° vs real 10.7–17.4°), then the rim is at 59.5° vs real 29–31°: the keeper's "rims flip up too much", in numbers. T14 on Sakura fails narrowly (6.85 vs ≤ 6.68): `handback/p-d182-plike-amend3-B_2026-09-28.md`

## 2026-09-28 02:3x — D182 RIPPLE, my share (roundtrip.test.js): NOTHING TO CLASSIFY. There are 0 failures under A's §9 vocab (stage/vocab.js 7ac2edb4…, under the lock at 4096): 26/20/0/6 todo, the 6 being the standing p-d166 §3 reader TODOs. By construction the round-trip path never loads src/doc/vocab.js (platform_test builds its own world data). A §7's "roundtrip 6" is a mis-attribution: A's own suite-changed shows 0 "✖ round-trip:". Premise corrected: the shared checkout holds HEAD's vocab, not A's: `handback/p-d182-ripple-B_2026-09-28.md`

## 2026-09-28 02:3x — D183 P-D183-CLOSE-READ: A's "cause NOT found" HOLDS as a non-finding. Its checks re-derive: 15 LEAVE CLOSE, the last 09-27 00:06 UTC; the first is 09-16, not 09-21 (a correction). All 3 failures are on the exe rebuilt at 01:52:24; the click never reached leave_exit. No fix, so the regression-test question is N/A. §3 HOLDS: publishes are refused REFUSED_UNPLACED by stick-leave.result.json, which has no manifest rule. ADDED: IPC worked 39 s before the third Leave (set_pane_name REFUSED at 08:06:00 UTC). leave_exit is a sync command, which Tauri v2 runs on the MAIN thread (docs), so a wedged main thread fits the record. A §4's tab-click step can't tell that apart; press the window X first (the "Use Close Consonance below." note appears only if the main thread serves events), then take the dump: `handback/p-d183-close-read-B_2026-09-28.md`

## 2026-09-28 04:17 — D183 P-D183-MANIFEST-READ: GREEN for consonance/state-manifest.json (f1176a8d…, +1 rule: stick-leave.result.json STAYS, the same glob/class/why form as the stick-* neighbours) and consonance/tools/state-sync.test.js (96e86a01…, +3 tests). Old manifest: 137/3, the 3 being exactly the D183 tests, with REFUSED_UNPLACED naming stick-leave.result.json. New: 140/0. state-manifest.test.js 45/0. state-sync.js = HEAD, so the unplaced guard is untouched. No publish or push ran (push.json still 02:07:37; origin last pushed 09-27 19:11). The lock starved me for 71 min under C's back-to-back full suites (posted). stick-leave.started.json is still unruled (A's note): `handback/p-d183-manifest-read-B_2026-09-28.md`

## 2026-09-28 05:2x — D182 ripple, join.test.js "a font change reaches the geometry": GREEN on both vocabularies (red first on D182: 5/1; edited: 6/6 on D182 and 6/6 on the old). Two named inputs, no assertion touched: font flat (continuity made the first straight a bowl), and width 32. Under D182 the width follows the font, and the landing ramp's row (94 points) and w4's (108) got a zipper seam; the probe shows every point within 0.54 mm of the other row, i.e. the same curve, not a step, so it is not REAL. At 32 m the rows coincide on both trees (20 m fails on the old vocabulary). test sha256 2ab335de…: `handback/p-d182-ripple-B_2026-09-28.md` §4

## 2026-09-28 05:25 — P-LIKE RUN (amendment 3) on the D182 landing: FAIL on both, and the keeper's rim is FIXED. Sakura: every T13/T14 shape row passes (edge 30° vs the control's 59.5°); fails T6/T7 bank 26.4/30.9 (1.8° short at the median) and T10–T12 climb, which failed IDENTICALLY on the control (inferred: amendment 1's rebuild rule, not the palette; not re-registered after the fact). Centrifuge: bank passes; T13 ½ and ¾ too flat, because the palette has no half-pipe-deep font (C's fontshape.json measures it: n 499, ½ 17.55°, ¾ about 28° = Centrifuge's). T10 is 25 m over. Both rebuilds carry a lifted lap-proof leaves-surface red. An earlier 05:01 run on a copy, before "suite first", gave identical numbers (disclosed): `handback/p-d182-plike-run-B_2026-09-28.md`

## 2026-09-28 05:27 — D182 LANDING READ: GREEN WITH ONE CONDITION. b-d182-wt at 484be9e + 96 live files (no drift at 05:25) + A's apply/docs + A's staged tests + the 0.2.2 bump (the CHANGELOG conflict resolved by placing A's [0.2.2] block verbatim under [Unreleased]) = 111 files, list 9bdc867a…. Suite 1,260/1,252/0/1 skip/7 todo; cargo 15/15; privacy PASS (corpus.json names its 16 layouts: a note). CONDITION: the README says the 0.2.2 release and installed app are what the table judges, yet it carries the D182 rows as tested, and 0.2.2 has no D182. Fix: (a) mark them unreleased, or (b) land 0.2.2 first. Worktree kept for the chair: `handback/p-d182-land-read-B_2026-09-28.md`

## 2026-09-28 05:47 — D182 FINAL: GREEN. P-LIKE FAIL on both; exportable NO on both. Worktree C:\Users\nname\AppData\Local\Temp\b-d182f-wt at 484be9e, 89 files (list b5df3c47…, 22 exclusions c3b5501b…). Suite 1,233/1,225/0/1 skip/7 todo; cargo 15/15. P-LIKE's 31 rows identical to the unexcluded tree. FOUND: the shared checkout's lib.rs is STALE (09-27 17:58, = d331f82) and would revert D181's test_export_folder, which index.html:179 calls; my earlier b-d182-wt carried it, so that read's GREEN is corrected. Method: check that each 484be9e-touched file keeps 484be9e's added lines. Excluded: ac_launch ×2, math shelf (04a lands: vocab.js cites it), geodesic/meshcurv/m2m3 (M2b), water ×2 (R2), lib.rs, prove_render_dialog.ps1. FINDINGS §7i/§7j cut. 0.2.2 included (CHANGELOG block above 0.2.1). CHANGELOG [0.3.0] not yet released, opening with P-LIKE's result in plain words; README D182 rows marked "in 0.3.0, not yet released". No screenshots (not cheap). Privacy PASS: `handback/p-d182-final-B_2026-09-28.md`

## 2026-09-28 05:5x — D182 chair's edits: README (0.2.2 kept current; 6 D182 rows marked "tested, unreleased (after 0.2.2): <new vocab/fonts/corpus>", plus the Fonts row; sha256 ad9c052a…) and CHANGELOG ([Unreleased] carries the stretch-rebuild result in plain words with its five reasons; [0.3.0] heading removed; sha256 8ee9890d…). DONE IN b-d182f-wt, NOT b-d182-wt (stale lib.rs, plus the 22 excluded files). Version files: same blobs as a-022-wt. COLLISION: b-d182f-wt was staged before my edits, so the index has the OLD README/CHANGELOG (MM); posted to the board: re-add both before the commit. 89 files. WAV_PITCH README row flagged stale (R1 writes it), not edited: `handback/p-d182-land-read-B_2026-09-28.md` §05:5x

## 2026-09-28 06:25 — D184 P-D184-READ: GREEN with named gaps. Worktree C:\Users\nname\AppData\Local\Temp\b-d184-wt (8868531 + 24 files, NO junction). FRESH SESSION (claude -p, --setting-sources project,local, --strict-mcp-config, a new path, prompt verbatim in the hand-back) reproduced Serpents N = 12 PASS and the sphere's K = 1/R² (evals 50/50; its own K·R² = 1.0034) in 18 turns, 1.6 min. Its read was byte-identical to the shared one. Gaps: G1 read.cjs crashes when reads/ is absent (E; fix first); G2 "heavy-run lock" in references/README (C); SKILL.md points evals at MATH_SOURCES, not README/evals (G8); steps 7/8 say buildPath/read line vs piecewise's mesh line (G9); plus G3/G4/G6/G10/G11. Evals: known 50/50, regressions 8/8 none skipped (Rainbow, Sakura, Centrifuge PASS), skip path verified 5/0/3, piecewise 11/11, m2m3 6/6. Privacy PASS (one short verbatim WANG08 quote: a note). meshcurv+geodesic+m2m3 test must land (C's evals need them; M2b code rides along, flagged). The chair's 1,233 vs 1,260 = the 27 excluded tests. reads/ emptied 05:59:45 is likely MINE: junctions in the removed worktrees (memory saved): `handback/p-d184-read-B_2026-09-28.md`

## 2026-09-28 06:3x — D184 read §7 (the chair's GO asks): (1) build_land.js/build_final.js now COPY reads/ and throw on a link; no symlinkSync left. The chair traced the wipe to its worktree remove --force following my junction. (2) The shared reads/ = 34 reads + readall.js, all byte-identical to C's copy; readall's 17/17 layouts present; corpus.test exits 0 on copies. NOT back: 13 equation.json (E named them) + 4 unmentioned: corpus.draft/next/runs.json and m1.json (in C's copy; E's call). (3) The skill prints no coefficients (fit-fourier 1,778 B, fit-pieces 875 B, 0 number runs); --write goes only to ignored reads/; git status clean; writeLocal fails closed (seen in the fresh session): `handback/p-d184-read-B_2026-09-28.md` §7

## 2026-09-28 06:3x — D184 RE-RUN: GREEN. Worktree C:Users
nameAppDataLocalTemp-d184r-wt (8868531 + 26 files copied by name, no reparse point by find -type l or dir /AL /S). One lock hold. G1 PROVEN: reads/ absent at the start, and the first read.cjs gave exit 0. Serpents N = 12 PASS; sphere worst 0.39% via C's exports. Evals 51/51, 8/8, 11/11, 6/6, 14/14. Remaining gap: fit-pieces prints no PASS/FAIL (E). E's reads/ restore (52 files) all ignored, not landed. Landing adds E's tracked fourier.cjs + fourier.test.js (G1 only). My pointer went out a minute before the section was on disk (the append failed on shell quoting; fixed by writing with a file): `handback/p-d184-read-B_2026-09-28.md` RE-RUN

## 2026-09-28 07:35 — D185 REGISTRATION SEALED before any D185 code: exo_memory/loop/d185_registration_2026-09-28.md sha256 978be18b…, with d185/gen_tracks.js cd96a830… (seed 185, 20 tracks) and .json afacaef4…, and d185/water_theory.js e180430a… and .json 0ce5dcec…. T2: circle R 50/200/1000 L/R, κ within 1% by 02 §3 AND kvec; clothoid A² 80,000, LSQ slope within 1%. T3: 30 brushes, === outside W⁺ (±2 knot spans), downstream rigid to 1e-6 m, C1 at the edges. T4: 20/20 closed to <1 cm with one call, last piece ≤10% of the correction. T5: R 500, 30 m wide; 45° at 70.0357 m/s, centre ≤0.10 m; 10° spills OUTER at 134.56 m ±5% (06 §7 integrated independently; the balance speed derived from 06 §7, not on the shelf). Corrected pre-seal: v_bal(10°) = 29.41, not 36.99: `handback/p-d185-reg-B_2026-09-28.md`

## 2026-09-28 08:42 — D185 NON-AUTHOR READ: GREEN FOR LANDING THE CODE; TEST 3 FAILS AS SEALED, both failures traced to MY registration. Worktree C:\Users\nname\AppData\Local\Temp\b-d185-wt (77cdb5e + 26 files copied, 0 links). Sealed generators re-ran byte-identical. My own measure (b185.js): T2 8/8 (circle worst 1.67e-5; clothoid slope 9.2e-7); T4 20/20 (worst 0.75 mm, the last-piece share ≤4.2e-6); T5 10/10 through A's real adapter (spill 134.55 vs 134.56). T3: 3a 24/30 — every κv brush fails the RIGID clause (11–93 m), but kv_diag (registered falsifier) shows heading unchanged 4.4e-16 and pitch +constant (spread ≤8e-16): the core is exactly channel-local, and in the gravity frame a pitch offset is not rigid, so my clause was wrong. The geometric no-kink rule fails 20/30 on the UNBRUSHED base (void; confirms E). C0/C1 30/30. DESIGN FINDING: a κv brush tilts the whole rest of the track (∫Δκv 2–5.6°), so it is not a "hill"; a hill needs a zero-integral bump. An amendment is proposed, not sealed. Suite 1,379/1,367/0/5/7; skill evals 72/64/0/8. Old piece system identical to 77cdb5e. Privacy PASS. A's 09 has no index row; A edited README/extend test after its hand-back: `handback/p-d185-read-B_2026-09-28.md`

## 2026-09-28 08:57 — D185 AMENDMENT 1 (test 3): sealed 08:43:23, sha256 9344c072…, BEFORE the re-run. Brush clauses all as predicted: unchanged clauses 30/30; κv heading unchanged and pitch one constant 6/6 (4e-16); Δκ rule r100 15/15; r20 exactly the 3 predicted misses; positive control 30/30. But the NEGATIVE control (box brush) failed its expectation (2/6 fail, 2 pass, 2 refused by checkDoc JOINT), so TEST 3 DOES NOT PASS under amendment 1 either. Not re-amended after seeing it. A box on a C2 spline is still C2, so the no-kink guarantee is structural (C0/C1 30/30, and checkDoc refusing the box, observed). D185 LANDED as 17c2301 at 08:55:22 = my 26 tested files exactly; the chair removed b-d185-wt after landing: `handback/p-d185-read-B_2026-09-28.md` (head updated; AMENDMENT 1 and AFTER THE LANDING sections)

## 2026-09-28 09:00 — D186 AMENDMENT 2 SEALED (the chair's "amendment 1"; my amendment 1 9344c072 was already sealed and scored, so this is a new file): exo_memory/loop/d185_registration_amendment-2_2026-09-28.md sha256 6672ea5f…, 08:59:49, before any re-score and before any D186 hand-back. Test 3 on Δκ with r=20 KEPT IN (30/30 needed); the negative control is now a step spliced into Δκ (tests the measure; must fail 12/12); NEW hill test: ±5 m × 25/50/75% × r 20/100, open, no close, everything past W⁺ === bit for bit, peak 0.9–1.1×|Δh|. Re-score pending E's brush and A's knots: `handback/p-d186-amend-B_2026-09-28.md`

## 2026-09-28 10:2x — D186 RE-SCORE under amendment 2 (6672ea5f), on b-d186-wt (17c2301 + A's knots + E's brush): TEST 3 = 27/30 NOT PASS (A2-1 30/30, C0/C1 30/30, Δκ rule 27/30; the positive control 30/30; the NEW negative control (a step spliced into Δκ) fails 12/12, so the rule has teeth). The 3 misses are the known narrow-brush limit (κh 25/75%, κv 25%, r 20, widened to 57–59 m); r=20 was kept IN by the chair. The record: original FAIL / amendment 1 no pass / amendment 2 27/30. HILL TEST: 0/12 on the landing candidate (all refused NOT_YET: no h channel); 12/12 on a COPY of E's offset prototype by my harness (peak 5.0000±0.0001, === up and down), which is information for the chair's h/l decision: `handback/p-d186-amend-B_2026-09-28.md`

## 2026-09-28 11:50 — D186 READ: NOT GREEN because C is moving. On b-d186read-wt (17c2301 + 29 copied files at 11:27): A's 8 and E's 4 match their final hand-backs; C's 17 do NOT (4 changed since C's 10:44 hand-back, 4 new; C was still working on the "lift"). Suite 1,470/1,454/3 FAIL/6/7, all 3 in C's post-hand-back work: the export-lift test (NO_START_STRAIGHT), C's mutation control (a consequence), and app mutation P1 NOT APPLIED (C's trackmodel.js edit removed its anchor: a lost check). HILL TEST 12/12 PASS on A's real h (peaks 4.99988–5.0001, === up and down, no close). Test 3 27/30 (the narrow brush). Skill evals 64/0/8. Privacy PASS; paused system identical. I stopped a superseded read of my own (pids 21084, 14720 and children). T1/T6 are unsealed: C asked on the board, which I did not read: `handback/p-d186-read-B_2026-09-28.md`

## 2026-09-28 12:18 — D185 AMENDMENT 3 (the librarian's ruling; named 3 because 2 = 6672ea5f was taken): sealed 11:50:19, sha256 699c3720…, BEFORE the run. Negative control 2: κh joint breaks injected below the document (checkDoc bypassed in-process) at 3 joints × {C0, C1}; the Δκ rule FLAGS 6/6 (C0 edge ~1e-3 vs mid ~1e-8; C1 edge ~1.3e-4 vs mid ~4.5e-5, a thin ~3× margin). Structural: checkDoc refuses both with JOINT; the base passes. TEST 3 PASSES under amendments 1 + 3. The record: original FAIL / A1 no pass / A2 27/30 (r=20 in) / A3 PASS: `handback/p-d186-amend-B_2026-09-28.md` §AMENDMENT 3

## 2026-09-28 12:20 — CORRECTION from the chair: amendment 2 (6672ea5f) STANDS and governs test 3 (27/30, NOT PASS; hill 12/12 on the D186 tree). Amendment 3 (699c3720) was already sealed and run before the correction arrived: kept as evidence (injected breaks flagged 6/6; checkDoc JOINT 2/2), but it does NOT score test 3, and its "PASS" line is superseded. The structural JOINT test is A's unit test (A §4 already has one): `handback/p-d186-amend-B_2026-09-28.md` §CORRECTION RECEIVED

## 2026-09-28 12:27 — D186 TESTS 1 & 6 SEALED before C runs them: exo_memory/loop/d186_registration_tests1-6_2026-09-28.md sha256 e80d7d25…, with d185/gen40.js 24efa78a… (seed 186) and gen40.json b2ffd6df… (106 pieces, 40,132 m, 55+55 steps). T1: Serpents and Thunderhead → D184 fit → fromPositionFit → one close → exportSegments (temp folder outside the repo) → read back; D184 mesh centreline in world coordinates, NO alignment; ≥95% within 5 m BOTH ways; bank (read 'up') ≤5° on ≥95%; nothing written into the repo; a refusal is a FAIL (Thunderhead's jump vs close NOT_YET, foreseen). T6: p95 <50 ms AND max <150 ms for extend and sculpt separately; the step = core + adapter + preview model; ALONE in one lock hold, else VOID: `handback/p-d186-seal16-B_2026-09-28.md`

## 2026-09-28 15:3x — D186 FINAL READ: NOT GREEN. Worktree C:\Users\nname\AppData\Local\Temp\b-d186final-wt (origin/main 9714b83 = part 1 landed + C's 17 files; 0 links). T1 FAIL both at export (my independent repro matches C's refusals word for word: Serpents no 67.4 m straight for the grid; Thunderhead RED downforce-ray-gap 2257.5 m). T2 8/8, T3 27/30 (amendment 2), HILL 12/12, T4 20/20, T5 10/10. T6 FAIL: C extend p95 505; my core-only lower bound extend p95 471 and ONE hill stroke 307 s. Suite 1,479/1,465/2 fail: 1 REAL (app mutation P1 NOT APPLIED, C's trackmodel change), 1 my artifact (BANK_RATE saw my T1 reads; re-run with reads aside 23/0/1). Repo unchanged before and after; the example loader writes nothing; the piece UI is behind the mode switch: `handback/p-d186-read-B_2026-09-28.md`

## 2026-09-28 16:0x — D186 LAST GATE: GREEN. C's P1 fix (app/test/mutation.test.js 7bdc47b3…) copied into b-d186final-wt; the mutation file alone under the lock: 62/62, P1 "applied, and caught by soak" by name. The landing CHANGELOG now states T1 FAIL (18 m vs 67.4 m grid; downforce-ray gap at 2,257.5 m) and T6 FAIL (438/505 ms vs 50; toSegments ~191, pieceOffsets ~234, preview ~135; 40 km edits slow), in plain words. Final landing: 18 files on 9714b83; 0 links, dir /AL clean; the worktree is left for the chair. STOP: `handback/p-d186-read-B_2026-09-28.md`

## 2026-09-29 12:4x — D187 COMBINE + SCORE (D, non-author of E and C; copy-only b-d187-wt at d26ef85 + E 3 + C 3 files, sha-checked x3; reads/ copied; own CARGO_TARGET_DIR; real app OFF-SCREEN; nothing committed): GREEN. M5 with MY harness (re-created on D from my L record) on P track 0: base head label missing 6/15 (the SAME 6 as on L at DPR 1.5; C's 3/15 is a subset from its own 5-piece track, so 6 stands), contrast <4.5 in 10/15; combined 15/15, 17.53:1, ink 12, 0 overlaps; controls K1-K6 caught (K6 = base box planted back). M1 12/12 + 43/43, M2 0/30, M3 12/12. M6 PASS: 0 page exceptions, flight headless 3/3 incl. a flight at the head. E's fix holds 8/8 of my own scripts (base 3/8). Full suite 1599/1590/0/2/7; app mutation 91/91 caught, core 48/48, 0 NOT APPLIED. Chase zoom-in read-back unresolved: `handback/p-d187-B_2026-09-29.md`

## 2026-09-29 16:4x — D190 CUP COMBINE + SCORE (D, GEOMETRY, non-author of A/C/E; copy-only b-d190-wt at c964c2d + A 26 + C 3, sha x4 0 mismatches; own exe; nothing committed): NOT GREEN, 2 reds, both A (adapter.js). R1 row 1b(ii) under ruling 2 words: default scheme wall runs up to 1.5x c inside each 2 m segment (smoothstep), psi off c(s) 0.53-0.95 deg = wall tip 65-102 mm off on the seal 40 m ramps (cupRuns: 0); A's test allows 1.5x; literal <=1 deg fails on half-pipe 150/100 m (1.39). R2 row 3(iv): legacy->cup joint where the r cap binds zips over a real surface step (bowl 12 m 36 mm, half-pipe 24 m 148 mm; defaults 0). All else PASS by my mesh probe (1a 4.7e-7 deg, seams in-cup curve step 0 mm, row 2 tips/guard, row 6 exact, row 7 + UI vs REAL core 4/4); 5a 0 of 9 differ; 14/14 plants caught (K5-1 6 of 9); suite 1719/1710/0/2/7; mutation core-cup 30/30, app-core 57/57, app 98/98. W1: my centre-normal bug, fixed: `handback/p-d190-B_2026-09-29.md`

## 2026-09-29 18:0x — D190 ROUND 2 RE-SCORE (D, fresh copy-only b-d190r2-wt at c964c2d + A r2 33 + C 3, sha x4 0 of 36; own exe; nothing committed): NOT GREEN. R1 FIXED (wall on c(s) 0.0000 deg, 0 mm, 0 faster-than-c on 6 ramps; cupRuns default + readers). R2 FIXED (legacy->cup joint curve step 0 mm at every width; X4-X6 varied <=0.54 mm). Row 4 PASS (the false 4.45 m grid refusal gone; csp-off RED; named NO_START_STRAIGHT kept). 5a 0 of 9; UI vs real core 4/4; plants 14/14; mutation core-cup 41/41, app-core 57/57, app 98/98. NEW RED R3 (A): cup->legacy LAP SEAM unmatched: narrow roads 23 mm (bowl 16) / 148 mm (half-pipe 24) even with c returned; cup not returned -> 9.5 m cliff, close converges, export green, app says lap proved (capture L1); my round-1 miss (W1). N1: literal <=1 deg on half-pipe 150/100 m = 1.0087 (c's own per-sample change; ruling's). N2: full suite 1743/1733/1: validate_bounds file-level fail (14/14 subtests ok), not reproduced (alone 14/14 x2, 16 copies 224/224): `handback/p-d190-B-r2_2026-09-29.md`

## 2026-09-29 19:3x — D190 ROUND 3 FINAL RE-SCORE (D, fresh copy-only b-d190r3-wt at c964c2d + A r3 35 + C 3, sha x4 0 of 38; own exe; nothing committed): every row GREEN, R3 FIXED (lap seams 0.23-0.60 mm incl. narrow and unreturned laps, X1 9,488 -> 0.569 mm; close refuses CUP_SEAM by name for closing pieces 8.5-11 m; mid-track cup->legacy <=0.54 mm, unreturned refused JOINT, an 8 m piece between legacies reds joint-step 148 mm; lap capture: no cliff, "lap proved" now honest). 1b/4/5a (0 of 9)/UI 4/4/plants 14/14; mutation core-cup 50/50, app-core 57/57, app 98/98. BUT the one full suite 1777/1767/1: geom_mutation control (geom_mesh file-level process failure, N2 signature), not reproduced (37/37 alone); the class appears only in A r2/r3 suites (1 each), never at c964c2d (control suite 1622/0) or A r1 -> owner A by correlation, cause undetermined; landable if the chair rules it non-blocking: `handback/p-d190-B-r3_2026-09-29.md`

## 2026-09-30 03:5x — D195 LAG LOOK (D, FEEL, non-author of E; copy-only b-d195-wt at 4ccdd58 + E 2 files = dbb92b6 blobs; own exes; real window OFF-SCREEN; nothing committed): GREEN. Before (4ccdd58): empty track draws NO pose, wheel/W never show, and a queued W fires late when the ghost appears (E's cause confirmed). After: draws at the start at once; wheel 8 ms, W takeover 21 ms; all 5 modes draw; fallback never leaks (ghost on/off, piece placed, undo back to start; 20x ghost churn); W1 and per-axis (W+D 12.08 m in 0.4 s) hold on empty. My 6 unscripted cases 6/6 (4ccdd58 5/6 fail); targeted 148/148. Nit: startHead with an explicit pos:undefined would throw; unreachable from either shell: `handback/p-d195-B-lag_2026-09-30.md`
- 2026-10-01 06:5x — D199 QC blind read (feel tier; units sha256 f9ef72c512b7b32e verified at 911c29a; C's file, the plan's later sections and Jev output NOT opened): 60 of 60 answered, 12 YES / 42 NO / 6 CAN'T TELL (checked: grep counts); nothing committed: `loop/qc_read_B_2026-10-01.md`
- 2026-10-01 09:2x — D201 (lap D202) phase 2b, label-watch verifier read (blind; packet sha256 600a936c verified at 72d91ecf; LABEL_RE masked mechanically before any render; key, C's file, §5 and the collation NOT opened): 194 of 194 (51 shared). Kind CHECKED 29 / STATE 63 / CONCLUSION 38 / NOT A CLAIM 64; verdict CORRECT 96 / WRONG 6 / UNVERIFIABLE 28 (checked: merge.js validation). Read made with 6 same-model helpers under my rulings: code is NOT A CLAIM; strict §4 source 1 (a later commit only when the message says uncommitted); uncut renders. 2 overrides by me. Read sha256 8d4747b5…: `handback/p-d201-B-read_2026-10-01.md`
- 2026-10-01 10:3x — D203 (lap D204) non-author look at the Sonnet second reader (HOOK tier; b-d203-wt at A's 215e6a5, serial under the lock; nothing committed): GREEN to land. Tests 29/29, related 147/147, mutants 38/38/0/0 NOT APPLIED; installed hook + worker byte-identical. The {"hooks":[]} group = install.ps1:815-817 placeholder seeded for a new event then bypassed by a Matcher slot (harmless; owner A) + latent :873 unmatched-entry → last (matcher) group mis-scope. Real fresh claude -p ring: delivered byte-identical, ONE row ok (ringSha = sent sha256 abe4d195, seat filled, tokens+cost), no worker reentrancy, nothing left running. Plan premise wrong: running 03:05 sessions already fire the hook (A + librarian rows), so the shadow week is live since ~10:12: `handback/p-d203-B_2026-10-01.md`
- 2026-10-01 10:4x — D205 non-author look at A's install.ps1 fix ace5fd6 (HOOK tier; b-d205-wt + b-d205red-wt = parent installer + new test, serial under the lock; nothing committed): GREEN. Diff = my 4 steps only (test file was EXTENDED, not new). install-only: 32/0 at the fix (7/7 mutants), RED at 2373a3f5 (20/12: the 5 behaviour checks + 7 NOT APPLIED). Live settings vs .bak-d205: every other event + key identical, PreToolUse 2→1 group (the second reader's, unchanged), text diff = the 5-line empty group. Second reader wrote 2 ok rows after the reinstall: `handback/p-d205-B_2026-10-01.md`

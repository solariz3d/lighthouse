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

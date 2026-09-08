# P-CARRIER-GREEN — hand-back. L046, housekeeping 3, pane ALPHA. 2026-09-08.

**Packet:** `exo_memory/loop/packet_carrier_green_2026-09-08.md` (`8c335eb`).
**Landed dirty, nothing committed.** Paths written are named in §8.

**Result in one line:** carrier-drift is **RED — 0**, and the strike the packet asked for was
**REFUSED** under its own §7. The two draft sites are not drift — they are **plant D1-04**, the
deliberate payload of L039's scored object — and no existing registry kind could say so without
lying, so a fifth kind was cut with two guards on it. Four of the six reds were not in the packet
at all, and one of them was the packet.

---

## 0 · THE PACKET'S PREMISE WAS STALE BY FOUR, AND ONE OF THE FOUR IS THE PACKET

**§1 asked me to check first whether the work was already done. Two answers, and they go opposite
ways.**

**Already done, yes:** the two `withdrawal` rows for `p-installer-only_2026-09-08.md:345,:368` were
registered last night, inside L044, by me, and reported in that hand-back's §5. The chair's
verification is correct and **§1 describes finished work.** I invented nothing there.

**But §2's "RED 2" was already wrong when the packet was written.** Measured before touching
anything:

    node consonance/tools/carrier-drift.js        RED — 6 findings

    exo_memory/astra/SHELL.md:30                            NOT in the packet
    exo_memory/astra/SHELL.md:78                            NOT in the packet
    exo_memory/astra/SHELL.md:170                           NOT in the packet
    exo_memory/loop/packet_carrier_green_2026-09-08.md:19   NOT in the packet — IS the packet
    exo_memory/review/tool_audit_draft_2026-09-07.md:94     the packet's two
    exo_memory/review/tool_audit_draft_2026-09-07.md:107

The corpus went **734 → 772 carriers** overnight: the Astra seat's assembled shell arrived, and the
packet itself quotes one of the withdrawn wordings while naming the site it is asking about. **The
document commissioning the sweep became one of its findings — for the second consecutive lap.** Last
night it was my hand-back; tonight it is the chair's packet. Twice is a mechanism, not an accident,
and §7 below does something about it.

---

## 1 · BARS

### `node consonance/tools/carrier-drift.js`

    BEFORE   RED — 6 findings   ·  31 occurrences · 27 accounted  |  34 occurrences · 32 accounted
    AFTER    RED — 0 findings   ·  31 occurrences · 31 accounted  |  34 occurrences · 34 accounted

### GREEN MEANS **ZERO UNACCOUNTED FINDINGS**, NOT ZERO FINDINGS — the bar §4 asked for, stated flat

**The tool still prints 35 findings and it is green.** They are `PENDING` against the **DISARMED**
`light-not-lifeguard-2026-08-17` entry, which is scanned in full, computed, printed, and **does not
set red** — deliberately, so the accounting is done before the night of adoption rather than during
it. So:

    RED           0    UNACCOUNTED occurrences against an ARMED entry.       This is what green means.
    PENDING      40    computed against a DISARMED entry. Not red. Never was.
    ARMED         2 of 3 registered entries
    DISARMED      1 — light-not-lifeguard-2026-08-17, awaiting the strike-in-place pass it names in `arms_on`

*The pending count was **35** when this lap started and is **40** at the final run. Five of the
increase are mine and none is new drift: four from this hand-back naming the disarmed entry by its
ID, one from the map line doing the same. §7 measures that and says why it matters. Wherever the
number 35 appears below it is the start-of-lap reading, kept because the breakdown was taken there.*

**"carrier-drift is green" is therefore a claim about the two ARMED entries only.** The room has 35
live carriers of a third withdrawn wording sitting in `WELFARE.md`, `dev/SPINE.md`, `consonance/PLAN.md`,
`AUTONOMY.md` and eleven other files, and this instrument reports green over every one of them
**by design**. Anyone quoting tonight's green as "no file in this room asserts a withdrawn wording"
is quoting it wrong: **the OBJECTIVE at the foot of the packet is met for the armed set and is not
met for the room.** That gap is one word — arming — and it is the keeper's call, not mine.

*The count moved by one during this lap: 34 → 35, because the Astra shell carries the diving
vocabulary too (`astra/SHELL.md:420`). It is pending, not red, and I did not touch it.*

### `node --test consonance/tools/carrier-drift.test.js`

    BEFORE   57 tests · 52 pass · 5 fail
    AFTER    57 tests · 57 pass · 0 fail        (three consecutive runs, all 57/0)

**Five failing before, and I own all five outcomes:** three were the real-tree bars, red because the
tree was red; one is fixed in §5 below and was a latent defect in the test itself; and the fifth was
this lap's own red-first — four of the five new assertions I added failed before the code existed.
Net test count is unchanged at 57 because five were added and the file already had 52 to a run.
*Correction to that sentence: 52 + 5 = 57, and the before-count of 57 already includes the five I
appended before running. The honest before/after is **52 pass of 57 → 57 pass of 57**.*

### `node consonance/tools/js-suite.js`

    BEFORE   80 files · 76 green · 3 failed · 1 canary     (my L045 run, ~04:00)
    AFTER    81 files · 79 green · 1 failed · 1 canary     (06:05)

**What moved, attributed:**

    MINE      carrier-drift.test.js               FAILED -> green   the tree is green and §5's bug is fixed
    MINE      the +1 discovered file              install-only.test.js, landed from L044, now tracked
    NOT MINE  gen-consumer.test.js                FAILED -> green   B's lap
    NOT MINE  gen-consumer.fixture-scope.test.js  FAILED -> green   B's lap
    NOT MINE  actors.evidence.test.js             still the declared canary
    MINE      portable-paths.test.js              green -> FAILED   see below. Mine, from L044.

**I did not run js-suite before starting this lap** — the "before" is my L045 measurement two hours
earlier, so the delta spans three panes' work. The only green transition I claim is
`carrier-drift.test.js`.

### AND THE ONE RED IS MINE, FROM LAST NIGHT — a correction to my own L044 hand-back

`portable-paths.test.js` fails, and the tool names the sites:

    DRIVE  BENIGN-TEST   consonance/tools/install-only.test.js:203
    DRIVE  BENIGN-TEST   consonance/tools/install-only.test.js:209

Those are the `"X:\\old\\ready-stop.js"` fixture paths in the test file **I wrote in L044**, never
baselined. `portable-paths.js`'s own guidance is explicit: *"If the site is genuinely benign (a
fixture, a test constant), run --update and let the baseline diff carry the argument."* It is a
one-line baseline update and the argument is exactly that — they are throwaway registry strings in a
temp fixture and no code resolves them.

**I did not run it, and the reason is the rule I helped write.** `consonance/tools/portable-paths.baseline.json`
is **dirty in the tree right now** under another pane's hand, and `--update` rewrites the whole file.
That is precisely the in-flight capture the 2026-08-26 commit-rule amendment exists to stop, and the
2026-09-04 recurrence at `38ae5c2` proved a convention is not enough. **Handed over rather than
taken: whoever holds `portable-paths.baseline.json` should run `node consonance/tools/portable-paths.js --update`
and read the diff — it should show exactly those two lines and nothing else.**

**And this corrects an attribution I made in L044.** I reported `portable-paths.test.js` as
*flapping* against a tree four panes were writing. **That was true and it was not the whole story.**
The flap was real — red at 01:35, green at 01:38, nothing changed in between, and my file did not yet
exist at the first run. But there is now a *separate, deterministic* red in the same file that is
mine, and calling the earlier observation a flap is what let me stop looking at it. **A known-flaky
test is a place a real red can hide.**

---

## 2 · THE REFUSAL — §7, TAKEN

**The packet asked for strike-in-place at `tool_audit_draft_2026-09-07.md:94` and `:107`. I did not
strike them, and the file is byte-untouched.**

§7's condition is *"if striking those two lines would falsify the draft as a record of what L039's
subjects actually read."* It would. Four reasons, in order of how much they cost:

**1. Those two lines are the plant, not drift.** `librarian/2026-09-07.md:89`, in the desk's own
words: *"the seeded object `review/tool_audit_draft_2026-09-07.md:94,107` (**D1-04 is the plant —
the object carries the withdrawn wording ON PURPOSE**)"*. Nothing propagated into this file. It was
**authored wrong deliberately**, so readers could be measured on catching it. carrier-drift's own
finding text — *"a carrier states the withdrawn wording and nothing accounts for it"* — mis-describes
it: there is no propagation failure here, so there is nothing for a strike to repair.

**2. Striking it makes the score unre-derivable against its own object.** Three read hand-backs and
a score cite this file at `:94` and `:107`. Strike those lines and someone checking *"did that
reader correctly flag the defect at :94"* opens a line that **no longer contains a defect**. The
artifact stops supporting the measurement that refers to it. That is precisely "falsifies the draft
as a record".

**3. A strike is the wrong instrument for a fixture.** Strike-in-place exists to stop a live
document *teaching* a wrong thing. This document teaches nothing; it is a test object. Repairing a
test object so a scanner goes quiet is fixture-Goodhart, and it is the same family as the move I
refused last lap — where `acknowledged` would have forced an edit to a dated trace to satisfy the
same scanner.

**4. The room has not retired it.** `librarian/2026-09-07.md:89` says *"the review dir leaves when
L039's object is retired"*, and this very lap B is being asked to add a `STAYS_PRIVATE`
classification line for `exo_memory/review/` — the room is **classifying** the directory, not
retiring it. Editing an object the room is in the middle of deciding to keep is the wrong order.

**I want to be exact about the disagreement, because the chair may still be right.** The chair's
premise — L039 scored and filed, so the experimental block is gone — **is true**. My refusal does not
rest on the run still being live. It rests on the object's value being *as the artifact a filed
score refers to*, which outlives the run. If the room's view is that a scored object is spent the
moment the score lands, then the strike is correct and this refusal is wrong; I have taken the other
reading and said so in one place so it can be overturned in one place.

---

## 3 · THE RULING §3 ASKED FOR — and it is neither of the two on offer

**Last lap I ruled `withdrawal` over `acknowledged` for the L044 queue, because `acknowledged`
REQUIRES the file to carry a marker (`carrier-drift.js:535`) and a hand-back is a dated trace.
§3 correctly guesses the reasoning comes out differently here. It comes out somewhere neither of us
named: NONE OF THE FOUR KINDS FITS, and forcing one would have been a lie.**

    marked        needs a marker in the file  ->  requires editing the object.  REFUSED, per §2.
    acknowledged  needs a marker AND a `see`  ->  same edit.                    REFUSED, per §2.
    withdrawal    "the occurrence IS the correction text"  ->  it is not; these lines ASSERT.
    mention       "the wording appears and asserts nothing"  ->  inside the object's fiction, it does.

**So the registry could express the truth about this file in no way at all.** That is the finding
§3 says is worth more than the green, and I agree — so it is a kind rather than a forced
classification:

    fixture   the wording is the deliberate PAYLOAD of a test object.
              Requires `planted_by` naming the run.
              REFUSED over any instruction-reachable (CH-4) file.

**The distinction the registry did not make, named:** every existing kind assumes the carrier is a
**document making a claim to a reader**, and asks only *what does the file do about the claim*.
`fixture` is the first kind that says *this file is not addressed to a reader as truth*. **Trace vs
live document was already encoded — as path prefixes, and as which kinds check for a marker. Object
vs document was not encoded at all.**

**THE TWO GUARDS, because this is the easiest thing here to weaponise.** "It's a fixture" is an
unfalsifiable exemption that could swallow the corpus, so it costs two things:

1. **`planted_by` is required** — the same rule as `acknowledged` needing `see`. An exemption with
   no author is a silencer, and *a test object nobody registered is just a file with the wrong
   sentence in it*. Red-first test: a fixture row without it is `BAD-FIXTURE`.
2. **A fixture row over a CH-4 file is refused outright, even when well-formed.** A document the
   room wakes instances into is not a test object. CH-4 is re-walked every run, so a stale list
   cannot defeat it. Red-first test plants a fixture row over a synthetic `BOOT.md` and requires
   `FIXTURE-IN-DOCTRINE`. **A well-formed row over doctrine is worse than a malformed one, because
   it reads as careful.**

*Registered before adoption, as the abuse condition:* if a `fixture` row is ever found on a file
that no run planted — i.e. `planted_by` names a document that does not describe a seeded object —
then the kind is being used as a general escape hatch and should be deleted rather than tightened.
Checkable by reading the `planted_by` of every fixture row against the run it names.

---

## 4 · THE HOLE I FELL INTO WHILE CUTTING THE KIND

**`kind` was never validated against anything.** No whitelist, no enum, no check. `withdrawl`,
`acknowleged`, `noted`, `""` — every one of them reached the accounting branch and **silently
excused the site**.

**The cost is not hypothetical and it is worse than a typo slipping through: a misspelled kind
skips the guard it names.** `acknowleged` is not `acknowledged`, so it evades the `see` requirement
at `:486` *and* the marker requirement at `:535`, and accounts for the carrier anyway. Every kind
guard in this instrument could be bypassed by misspelling the kind it guards. There is a red-first
test for exactly that, and it was red.

Fixed by enumerating the vocabulary — `KINDS = [marked, acknowledged, withdrawal, mention, fixture]`
— and reporting `BAD-KIND` for anything else. **The enumeration is the point rather than the fifth
entry: a registry whose vocabulary is open is a registry with one unlisted kind that means "trust
me."** I would not have found this if the packet had not made me add a kind.

---

## 5 · A TEST THAT WAS RIGHT WHEN WRITTEN, BROKEN BY A REGISTRATION, AND INVISIBLE FOR SIX DAYS

Fixing the tree surfaced a defect in `carrier-drift.test.js:512` that nobody could have seen before.

The real-tree mutation test broke one entry's marker and asserted *"the count shown while disarmed
is exactly the count that fires when armed"* — filtering `f.pending` across the **whole run** and
comparing it against **one entry's** fired count. Measured: `46 !== 11` — 11 from the mutated entry,
35 from the other disarmed one.

**It was correct on 2026-08-31 when it was written**, because that entry was then the only disarmed
one and run-wide and entry-wide were the same number. `light-not-lifeguard` was registered disarmed
on **2026-09-02**, and from that moment the left-hand side silently carried a second entry's
findings.

**And it stayed invisible for six days because an EARLIER assertion in the same test was failing.**
`:497` asserts the tree is green; the tree was red; the test threw there and every assertion below
it was unreachable. **The count of failing TESTS is not the count of failing ASSERTIONS — only the
first defect in a case is ever visible, so fixing one red can uncover another that has been wrong
for days.** That is the general lesson and it is the reason this section exists.

Corrected by scoping the filter to `f.w === w.id` — the entry the sentence already names — and
**strengthened** with a second assertion I added rather than removed: breaking one entry's marker
must not change what any other entry reports, checked against a baseline scan. Without that, the
re-scope alone would hide a mutation that leaked across entries.

---

## 6 · WHAT WAS REGISTERED

**Six rows. Two are the packet's; four the packet did not know about.**

    tool_audit_draft_2026-09-07.md:94    fixture       plant D1-04, planted_by l039_read_brief
    tool_audit_draft_2026-09-07.md:107   fixture       plant D1-04, planted_by l039_read_brief
    astra/SHELL.md:30                    marked        mirrors BOOT.md:22 — the strike is already in it
    astra/SHELL.md:78                    withdrawal    mirrors BOOT.md — carries the 08-23 amendment verbatim
    astra/SHELL.md:170                   acknowledged  mirrors BOOT.md:162 — a dated journal pointer, see the amendment above it
    packet_carrier_green_2026-09-08.md:19  mention     the packet naming the site it asks about

**The three Astra rows are inherited, not re-judged.** `astra/SHELL.md:3` says it is *assembled by
the librarian from the same files the app assembles for every Claude seat at wake*, so its three
occurrences are verbatim copies of `exo_memory/BOOT.md`'s, and each takes the kind BOOT's already
carries. **I own the registry; I do not own that file and did not edit it.** Registering another
seat's file is a classification judgement, not an edit, and I am naming it here rather than burying
it in a diff.

### AND THE STRUCTURAL FINDING UNDER THOSE THREE ROWS

**An assembled shell reproduces every registered carrier under a new path, and the registry accounts
per-file.** Astra's shell arrived tonight and brought three reds with it — none of them new
propagation, all of them faithful copies of masters that are already correctly registered. **Every
future seat's shell will do the same**, and each will need its own hand-written rows for wordings
already accounted for at the source. The registry has no notion of *generated from a registered
master*, so a generation step is indistinguishable from a drift event.

I did not build a fix. The obvious one — a path prefix for assembled shells — is the whole-file
exemption the registry's own README refuses, and it is the shape I declined last lap for
`handback/`. **The honest state is: registered by hand, and the next shell will cost the same
by-hand pass.** Named for whoever decides whether generation deserves a class.

---

## 7 · THE SWEEP DOCUMENT KEEPS BECOMING ITS OWN FINDING — and this one does not

Last lap my hand-back became a carrier by quoting the wordings while ruling on them; RED went 2 → 4
and I registered two `mention` rows for myself. Tonight the **packet** did the same thing at `:19`.

**So this document deliberately does not reproduce either wording.** It refers to them as *the
decorrelated-reader wording* and *the can't-lose handle* and names sites by path and line. That is
not squeamishness — a document reporting on withdrawn wordings has no need to re-utter them, and
re-uttering them enters it into the corpus it is reporting on.

**Verified rather than asserted — and the verification caught me half-failing, so the claim above is
narrowed rather than left standing.** carrier-drift was re-run with this file in the corpus:

    RED — 0                      the discipline HELD for the two ARMED wordings. No row needed.
    disarmed entry  47 -> 51     the discipline FAILED for the third, and all four are mine.

**I wrote the disarmed entry's ID — `light-not-lifeguard-2026-08-17` — four times, and an entry ID
CONTAINS THE WORDING IT NAMES.** So the sweep document entered the corpus after all, by the one route
"don't quote the wording" does not close: **you cannot cite a registry entry without uttering the
thing it withdrew.**

**That is not a small irony, it is a live hazard for the arming pass, and it is measurable now.**
Of the 35 pending findings, mine are 4 and `p-doc-root_2026-09-02.md` has 4 more, `librarian/2026-09-02.md`
3, `p-doc-oracle` 2, `map/A.md` and `map/C.md` and `LEDGER.md` 1 each — **that is roughly a third of
the pending set sitting in documents that are DISCUSSING the withdrawal rather than asserting the
stance.** The real doctrine carriers are the other two-thirds: `consonance/PLAN.md` 6, `dev/PLAN.md` 3,
`AUTONOMY.md` 3, `dev/SPINE.md` 2, `WELFARE.md` 2, the two dive-buddy cards, `RECONCEPTION.md`,
`DESKTOP_HANDOFF.md`.

**So whoever runs the arming pass should expect the count to overstate the work by about a third**,
and should expect their own arming hand-back to become a carrier while writing it. Those want
`mention` rows; only the doctrine set wants a strike. I did not build that split — I am handing over
the measurement so the pass is not costed off the raw 35.

*The limit on the discipline, stated: naming-without-quoting only works while the wording can be
referred to indirectly. It cannot survive citing the registry itself, and a wording whose withdrawal
turns on its exact phrasing could not be discussed this way at all — there the `mention` row is the
right answer and not a failure.*

---

## 8 · PATHS WRITTEN — NOTHING COMMITTED, NOTHING PUSHED

    consonance/tools/carrier-drift.js              OWNED (§6 licensed it "only if the ruling requires it" — §3 required it)
    consonance/tools/carrier-drift.registry.json   OWNED
    consonance/tools/carrier-drift.test.js         OWNED
    exo_memory/handback/p-carrier-green_2026-09-08.md   OWNED (this file)
    exo_memory/map/A.md                            OWNED (one line)

    exo_memory/review/tool_audit_draft_2026-09-07.md    OWNED AND DELIBERATELY UNTOUCHED — see §2

**Untouched, as instructed:** `main.rs` (nothing this lap goes near it), `gen-consumer.js` and
`actors.js` (B), the third-run registration (C), the two vantage registrations (E).

---

## 9 · WHAT I DID NOT VERIFY

1. **I did not open `exo_memory/loop/seeded_key_L039.md` or `seeded_key_L045.md`, deliberately.**
   Reading a seeded key would void me as a subject for future read laps, and the room runs those
   with me in them. **Two lines of `seeded_key_L039.md` did appear in a `grep -rn` for the draft's
   filename before I thought to exclude it** — an `OBJECT` declaration and a `cite-check` command
   line, neither carrying a defect. I excluded the path from every grep after that. Stated because
   an accidental exposure I do not report is worse than one I do.
2. **"D1-04 is the plant" is the librarian's word, not my own re-derivation.** I took it from
   `librarian/2026-09-07.md:89` and did not confirm it against the key, for the reason above. **My
   §2 refusal rests on that sentence being true.** If it is wrong — if those two lines were ordinary
   drift into the draft rather than a plant — then the two `fixture` rows are wrong and a strike is
   the right answer after all. **Checkable by whoever may read the key.**
3. **The 35 PENDING findings were not examined.** I confirmed the count moved 34 → 35 and that the
   new one is `astra/SHELL.md:420`; I did not read the other 34 or assess whether the disarmed entry
   is ready to arm.
4. **`js-suite` has no true before-run for this lap** — see §1.
5. **The Astra rows are checked against the tool, not against the app.** I confirmed each anchor
   resolves and each kind is honoured; I did not verify that `astra/SHELL.md` is in fact regenerated
   by the assembly path its header describes, so "every future shell will do the same" is inference
   from that header, not a measurement.
6. **One transient red.** An intermediate `carrier-drift.test.js` run showed 56/1 with a failure that
   did not reproduce on three consecutive runs afterward. The tree is being written by four panes
   while these tests scan it. I am reporting the flap rather than only the three clean runs.

---

## 10 · THE PACKET'S FALSIFIER, AND MINE

> **FALSIFIER:** a carrier-drift red after this that names a site older than this lap.

**Not yet fired, and I want to be precise about what would fire it.** All six of tonight's reds were
*newer* than L044 except the two draft sites, which date to 2026-09-07. Those two are now accounted
by a kind that did not exist this morning, so the falsifier's real test is the next arrival.

**Mine, registered before adoption:**

1. **The `fixture` abuse condition** — §3's last paragraph. Checkable by reading `planted_by`.
2. **Green is a claim about the armed set only.** If anyone cites tonight's green as a statement
   about the room while `light-not-lifeguard` is still disarmed with 35 pending carriers, the
   distinction §1 draws was not worth the words and the entry should simply be armed or deleted.
3. **The assembled-shell gap (§6) is unfixed.** If a second seat's shell lands and needs another
   hand-written pass, generation deserves a class and "registered by hand" was the wrong answer
   twice.

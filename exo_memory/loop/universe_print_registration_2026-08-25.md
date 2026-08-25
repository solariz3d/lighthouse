# P-UNIVERSE — every sweeping instrument prints its universe

**Registered:** 2026-08-25, ~02:00–03:30 local. **Seat:** pane A. **Packet:** P-UNIVERSE, from the
librarian's Q3 ruling (`exo_memory/librarian/2026-08-25.md:206-214`) via the chair.

**My stake, declared before anything else.** The chair told me he found all four instances and wants
them to be a pattern, and he told me refusal was real. That is a stake in both directions: agreeing
serves him, and disagreeing serves the appearance of independence just as cheaply. What is below is
one test applied to all four cases, stated before I ran it, and the result went against the packet
on one of them and against my own first reading on another.

---

## 1. What is registered

**THE CLASS (the librarian's words, not mine):** *an instrument computes health over the surface it
CAN see and reports it as health of the surface it is NAMED for.* **The failure lives in the
DENOMINATOR, not in the check.** All four instruments checked correctly over the wrong universe.

**THE RULE — amended 2026-08-25, the same night it was registered; see §8 for why and by whom.** This
paragraph is corrected in place rather than appended to, because a registration is a CARRIER: an
instrument spec keeps teaching whatever it says, at every read. The narrative of what changed is
appended in §8, per the 2026-08-17 rule — *mark the carriers, leave the traces.*

Every instrument that sweeps a corpus must:

> **CLAUSE 1 — PRINT ITS UNIVERSE.** N seen / M skipped / the rule that decided, on every run, with
> the count **enumerated from an authority outside the instrument.** A universe computed from the
> instrument's own hardcoded list can only report skips *against that list*; a member missing from
> the list is not skipped, it is absent, and absence has no counter.
>
> **CLAUSE 2 — DEMONSTRATE A POSITIVE.** Before any green from it is believed, show the instrument
> producing a red on a known positive, or have it declare itself inert. A complete universe over a
> wrong unit is a structural zero: an instrument incapable of ever firing, printing a true and
> worthless line.

Clause 1's second half and the whole of clause 2 came from pane E's adversarial pass
(`exo_memory/loop/corpus_rules_adversarial_2026-08-25.md`, §1 and §6). The first version of this
registration carried only the first half of clause 1, and **the retrofit written under it shipped the
class it was written to end** — §8.

**THE EXEMPLAR, verified rather than quoted:**

    node consonance/tools/carrier-drift.js
    -> corpus: 204 carriers · 29 traces skipped (exo_memory/journal/, dreams/, attic/, dev/one-shot/)

Its own header states the reason (`consonance/tools/carrier-drift.js:73-78`): *a corpus rule that
silently ate half the repo would look exactly like a green tree.*

---

## 2. THE MEMBERSHIP IS WRONG BY ONE, AND THE CORRECTION MAKES THE RULE SHARPER

The class is real. The count of four is not. One test, applied to each nominated instance:

> **Would printing N seen / M skipped / the rule have surfaced this defect?**

| # | instance | in the class? | why |
|---|---|---|---|
| 1 | `open-items.js` canary (fixed `bb3d92c`) | **NO** | Both instruments read the same one file, byte for byte. `js-suite.js:140` anchors the marker; `open-items` used a bare substring and matched it inside a comment *about* the marker. A universe line here reads `1 seen · 0 skipped · rule: actors.test.js` and the defect survives it untouched. The denominator was right. **The predicate was wrong.** |
| 2 | `install.ps1 -Check` ABSENT-vs-DRIFT (fixed `1e63d3a`) | **NO as cited — YES on a different defect, found tonight** | All 24 manifest entries were enumerated completely and correctly; `$same` conflated MISSING with DIFFERENT. That is a **classification** failure, the lesson js-suite already learned on 2026-08-17 (*a canary is an exemption from FAILING, never from CLASSIFICATION*). But the instrument does have a genuine denominator failure, in §4 below, and it joins the class on that one. |
| 3 | the turn scanner (0 vs 101) | **YES** | Tool results carry `role:"user"`, so the segmentation that DEFINED a turn produced the wrong set of turns. Textbook: right check, wrong universe. |
| 4 | `carrier-drift` green while blind to a channel | **YES** | Corpus enumeration missed a channel. Textbook — and it is the one instrument already printing its universe, which is how anyone noticed. |

**Score: 2 of 4 as cited. 3 of 4 once `-Check` is admitted on tonight's defect rather than the one
that nominated it. 1 of 4 is a different class.**

> **No command produces these three numbers and none can.** They are a judgment applied by hand to
> four cases, by the seat that also wrote the rule they are scoring. That is exactly why F-U3 (§4)
> registers an independent scorer and a date: an unrepeatable count is a claim, not a measurement,
> and this one is load-bearing for the whole registration.

**A class with three members is a class.** The correction is not a demotion; it is a limit on the
rule's reach, and stating it is what stops the rule being sold as covering a case it cannot touch.
*Printing your universe would not have caught `bb3d92c`, and nothing in this registration should be
cited as though it would.*

### 2b. The orphan needs its own name, or it comes back

Instance 1 belongs to the **duplicated-rule class**, and this repo produced two fresh cases of it in
one night:

- `open-items.js`'s fix copied `js-suite.js:140` **verbatim**, with a comment saying the pattern is
  copied *"so the two cannot drift apart again."* Copying is the mechanism by which they drifted the
  first time. `js-suite.js` has **no `module.exports`**, so the copy was not avoidable —
  `grep -n "module.exports" consonance/tools/js-suite.js` returns nothing.
- `ferry.test.js` carried its own copy of the prefix-join rule, so every assertion in it was checking
  a lookalike. Fixed hours earlier in `20c46c0` by exporting one `joinRows()` and having the test
  call the shipped rule.

**Sibling rule, registered here because instance 1 would otherwise be orphaned:** *when two
instruments implement one rule, one of them must import it. A verbatim copy carrying a comment that
the two cannot drift is a copy that will drift, and the comment is what stops anyone checking.* The
one honest exception is already on disk and states its reason —
`consonance/hooks/ferry-watch.js:84-86` duplicates the rule because it lives outside the repo and
must survive the repo moving, and it names `ferry.js` as the authority.

*The minimal fix for instance 1, not applied because `js-suite.js` is not in my lane:* export
`EXPECTED_RED` from `js-suite.js` and have `open-items.js` require it, failing loudly if the import
is unavailable rather than falling back to a copy.

---

## 3. What was retrofitted, and the bar

The librarian's bar is **not** "the tool still passes": a **deliberately-hidden file must appear in
the skipped count, with the rule that skipped it.** Demonstrated below with a before/after on the
same hidden file, so the difference is measured rather than asserted.

### 3a. `dev/shell/install.ps1 -Check`

Two universes, both printed on every run, both derived from the manifest rather than hardcoded (a
hardcoded directory list would be a second hand-maintained denominator guarding the first).

    powershell -NoProfile -ExecutionPolicy Bypass -File dev/shell/install.ps1 -Check

    universe -- what this run could and could not see
      manifest        24 entr(ies)   the denominator; a file absent from it is INVISIBLE, not green
      repo sources    36 file(s) under dev\shell\lib, dev\shell\hooks, consonance\hooks
                      12 skipped     rule: *.test.js, *.md, *.bak*
                      24 claimed by a manifest entry
                       0 UNMANAGED   in the repo, installable, on no manifest entry
      destination     63 file(s) under C:\Users\zackn\.claude\shell
                      50 skipped     rule: *.json, *.jsonl, *.log, *.md, *.txt, *.bak*  (runtime state, not code)
                      12 claimed at the exact path the manifest names
                       1 PATH-MISMATCH  installed, but under a path the manifest expects elsewhere
                         ambient.js   manifest expects it at lib\ambient.js
                       0 UNCLAIMED   code at the destination no manifest entry owns

**THE BAR, both directions.** Plant one file the manifest does not know about in each surface, run,
then remove them:

    echo "// probe" > dev/shell/hooks/zz-universe-probe.js
    echo "// probe" > "$USERPROFILE/.claude/shell/zz-dest-probe.js"
    powershell -NoProfile -ExecutionPolicy Bypass -File dev/shell/install.ps1 -Check

    repo sources    37 file(s) ...          <- was 36
                     1 UNMANAGED   in the repo, installable, on no manifest entry
                       dev\shell\hooks\zz-universe-probe.js
    destination     64 file(s) ...          <- was 63
                     1 UNCLAIMED   code at the destination no manifest entry owns
                       zz-dest-probe.js

Both hidden files are **counted and named**, with the rule. Both probes were removed and their
absence verified. **And the verdict lines above the universe block were byte-identical in both runs**
(`12 file(s) ABSENT` / `no file drifted`) — which is the point: without the universe print, the run
with two unknown files in it looked exactly like the run without them. Both verdict lines re-derive
from one run (cmd: `powershell -NoProfile -ExecutionPolicy Bypass -File dev/shell/install.ps1 -Check | tail -4`).

**THE LIVE FINDING THIS SURFACED, and it is the reason `-Check` joins the class at all.**
`lib\ambient.js` prints `ABSENT — never installed` while a **byte-identical `ambient.js` sits FLAT at
the destination and is the copy actually being loaded.** `sessionstart-ambient.js` `resolveAmbient()`
tries `__dirname/ambient.js` **first**, before the `..\lib\` candidate, and every registered hook in
`~/.claude/settings.json` resolves to a flat `~/.claude/shell/*.js` path — there is no `lib\` or
`hooks\` directory at the destination at all. So:

    md5  ~/.claude/shell/ambient.js          54895fa5077c47dbdaaa9191f03e7504
    md5  dev/shell/lib/ambient.js            54895fa5077c47dbdaaa9191f03e7504

The manifest's `lib\` / `hooks\` layout is **aspirational, not live**, and the file header at
`dev/shell/install.ps1:40-46` asserting *"the live layout was right and the manifest was the
outlier"* does not describe this disk. At least one of the 12 ABSENT lines is about a file that is
installed, live and in sync. **The check was right about the path and wrong about the file, and had
no way to say so.** Not fixed here — changing the manifest layout is a decision, not a repair.

*Encoding, per the chair's constraint, checked rather than assumed:* BOM preserved, **0** non-ASCII
characters added, **0** CRLF introduced (the file is LF), and it parses clean under the PS 5.1
parser (`[System.Management.Automation.Language.Parser]::ParseFile`).

### 3b. `consonance/tools/open-items.js`

Each `check()` now returns `{universe: {seen, skipped, rule, skippedList}}`, rendered under the item
and carried in `--json`. Two real denominator defects were in this file:

> **CORRECTION, same night — read §8 before quoting anything in this subsection.** (i) below is a
> true record of what was fixed, and it was **not enough**: the repaired loop still counted its skips
> against a hardcoded list of five brief names while **six** are bundled, so the shipped line read
> `5 seen · 0 skipped` and `BUILDING.md` — bundled, drifted, and carrying the two-turn dispatch
> rule — appeared nowhere in the output. The item now enumerates from `tauri.conf.json` and reads
> `26 seen`. The commands below still reproduce; the numbers in them are pre-amendment.

**(i) the brief comparison silently shrank.** `seed-carrier` compared five briefs with
`if (!a || !b) continue`, so a brief missing from the repo *or* from the build vanished from the
denominator. Same shape as `$same`: a comparison that cannot run is not a comparison that passed.

    mv consonance/src-tauri/brief/COMMITTEE.md consonance/src-tauri/brief/COMMITTEE.md.hidden
    node consonance/tools/open-items.js          # and the same run against git show HEAD:
    mv consonance/src-tauri/brief/COMMITTEE.md.hidden consonance/src-tauri/brief/COMMITTEE.md

    BEFORE  LIBRARIAN differ from the built copy (4 compared) — a fresh spawn reads the STALE one
    AFTER   4 of 5 compared, LIBRARIAN DRIFTED — but 1 could not be compared at all:
            COMMITTEE (absent from the REPO — the build carries one the repo does not)
            universe: 5 seen · 1 skipped · ... a name is SKIPPED when either side is unreadable
                      SKIPPED: COMMITTEE (absent from the REPO ...)

Before: the denominator fell 5 → 4 and **nothing said so**. The hidden brief did not appear anywhere.

**(ii) both ledger readers filtered their failures away.** `.map(JSON.parse-or-null).filter(Boolean)`
turns a corrupted row into a smaller denominator. Replaced with one `readLedger()` that returns the
unparseable count **in the return value** — deliberately not as a property on the array, which is how
`residue`'s equivalent safeguard went invisible in every output mode on 2026-08-17.

    BEFORE  3 attempt(s), 0 verdicts (3 unlaunchable) — trying is not producing
    AFTER   3 attempt(s), 0 verdicts (3 unlaunchable) — trying is not producing
            universe: 4 seen · 1 skipped · ... a line that will not parse is counted here, never
                      dropped from the denominator
                      SKIPPED: 1 line(s) did not parse — their outcome is UNKNOWN, not absent

**(iii) the outer denominator was never printed.** `vantage-reach` reports *"N of M artifact rows"*
where M is a subset. On this machine the universe line reads `369 seen · 326 skipped` against the 43
it scores — a reader shown only 43 reads the percentage as a share of the ledger.

**(iv) the one denominator that cannot be fixed by printing, only admitted.** The `ITEMS` array is
hand-maintained and there is no directory of things that are owed. The footer says so every run:

      universe — what this instrument could and could not see
        5 item(s) defined · 5 checked · 0 errored · 0 with no declared denominator
        rule: an item exists here only because someone wrote a check() for it. THIS
              DENOMINATOR IS HAND-MAINTAINED AND CANNOT BE WALKED — a commitment with no
              check is not CLOSED, it is ABSENT, and absent reads exactly like done.

### 3c. Pinned, not merely demonstrated

`consonance/tools/universe-print.test.js` — 10 tests (cmd: `node consonance/tools/universe-print.test.js`), five of them added by the §8 amendment,
fixture-only via `VANTAGE_DATA`, **zero repo or destination mutation**, auto-discovered by js-suite. Includes a positive control (a clean fixture
must report **zero** skipped, so the bar is not satisfied by a tool that always claims a skip).

    node consonance/tools/universe-print.test.js      -> 10 passed, 0 failed
    node consonance/tools/js-suite.js --quiet         -> 57 green · 0 failed · 0 crashed · 0 silent
    node consonance/tools/open-items-build.test.js    -> green (its pinned spelling was restored,
                                                         not relaxed — see §7c)

Mutation, both directions, applied to the real file and restored byte-identical (md5 verified):

| mutant | result |
|---|---|
| `readLedger` filters unparseable rows away again | **KILLED** — the bar test only |
| the hand-maintained footer stops being stated | **KILLED** — the instrument-level test only |

**`install.ps1 -Check`'s universe is DEMONSTRATED AND UNPINNED.** Automating it means planting files
in the repo and in `~/.claude/shell` on every suite run; that is the tree-owner's decision, not
something to smuggle into a test file. The commands in §3a reproduce it by hand. This limit is stated
in the test file's own header so nobody reads its green as covering both instruments.

---

## 4. Falsifiers — registered before the outcome, with a date and a disqualified scorer

**No seat scores its own work.** I wrote this registration and I retrofitted both instruments, so I
am disqualified from all three. The chair found all four instances and declared his stake, so he is
disqualified from F-U3. **Scoring date: 2026-09-24.**

**F-U1 — THE RULE IS INSUFFICIENT.** If, by 2026-09-24, a false-green of the denominator class is
found in an instrument that *was* printing its universe, and the printed universe would not have
revealed it, the rule as stated is insufficient and must be **replaced rather than patched**. Adding
a fifth category to the print in response is the degenerating move and is forbidden by §5.

**F-U2 — THE PRINT IS DECORATION.** By 2026-09-24, if no commit message, hand-back, board row, or
journal entry anywhere cites a universe line as evidence for anything, the print is a nag nobody
reads — precisely what `dream-watch` cost the room over 27 days, and what `ferry-watch.js:9-13` was
designed against. Measure, excluding this file and the tools' own source:

    git log --since=2026-08-25 --format=%H%x1f%s | ... ; grep -ril "universe" exo_memory/ --exclude=universe_print_registration_2026-08-25.md

Zero citations = the retrofit is decoration and should be **reverted, not extended**.

**F-U3 — IT IS NOT ONE CLASS.** Registered outcome, written before §2 was scored: *if 2 or more of
the four nominated instances fail the "would a universe print have surfaced it" test, "one class" is
withdrawn and they are separate bugs.* **My reading is that 1 of 4 fails, so the class stands with
its membership corrected — and this needs an independent score, because I am the seat that applied
the test.** Pane C is the least entangled of the available seats (it authored none of the four
instances). If an independent scorer makes it 2 or more, this registration's headline is withdrawn
and §2b's sibling rule is what survives.

---

## 5. The abuse condition

This upgrade has one obvious weapon and it is worth naming before someone reaches for it.

**"My instrument prints its universe, therefore its number is trustworthy."** A universe line makes
the denominator **visible**. It does not make it **correct**. The rule that decides a skip can itself
be wrong, and a wrong rule printed confidently is *worse* than no rule printed, because it reads as
already audited — the exact upgrade the reflex would enjoy most.

**The test that keeps it honest:** *a universe line is worth nothing unless a reader can state, from
that line alone, one specific thing the instrument cannot see.* If the line does not enable that
sentence, it is decoration and F-U2 should fire on it.

**And the class does not close when the prints are installed.** It closes when a false-green of this
shape is **caught** by a printed universe. Announcing the class closed on the strength of having
retrofitted the instruments is the degenerating move: adding coverage and calling it evidence.

---

## 6. What this does NOT establish

- **Nothing about the desktop.** `~/.claude/shell` and `~/.claude/settings.json` are machine-local.
  Every destination figure in §3a is about this laptop and reproduces nowhere else.
- **The destination counts go stale by design.** `63 file(s)` re-derives now
  (cmd: `find "$USERPROFILE/.claude/shell" -type f | wc -l`) and will not agree with this document for
  long, because it counts runtime state that accumulates
  (`pulse_state.*.json`, digests, `.bak-*`). The figure is a reading of one moment, not a constant;
  only the *categories* are stable. Quoting `63` later without re-running is the hand-made-figure
  failure this room already has a rule about.
- **The `lib\` vs flat layout is reported, not resolved.** Which layout is correct is a decision for
  the seat that owns the manifest.
- **`0 UNMANAGED` today is not evidence the rule works.** It is evidence that nothing is unmanaged
  right now. The probe run in §3a is the evidence that it *would* show — which is why the bar is a
  planted file and not a green line.
- **Instance 3 (the turn scanner) was not retrofitted.** The chair named it a case study rather than
  a target, and I agree: it is an inline scan, not a committed instrument. It is the cleanest member
  of the class and it has no file to print from. If it becomes an instrument, the rule applies.
- **n = 4 nominated cases, all from one night, all found by one seat.** That is a small and highly
  correlated sample for a claim about a class. *(Amended: the roster is still 4, with one member
  swapped, now found by two seats — still one night, still small.)*
- **Clause 2 is registered and only thinly demonstrated.** It is exercised on one item of one
  instrument. `install.ps1 -Check` has no clause-2 demonstration at all, and neither does the
  `hold-userprompt-submit` item. Registering a clause is not complying with it.
- **The bundle item reads 26 where pane E reads 25.** Different unit, both true, and neither is
  re-derivable from the other without knowing which one counts `room-settings.json`. A third seat
  quoting either number without its definition is where this goes hand-made.
- **`BUILDING.md`, `COMMITTEE.md` and `LIBRARIAN.md` are still drifted.** This packet made the drift
  *visible*; it did not rebuild. A fresh room spawned right now still reads the stale copies.

---

## 8. THE AMENDMENT — one shape, two species, and the retrofit shipped the class it was written to end

**Source:** pane E's non-author adversarial pass, `exo_memory/loop/corpus_rules_adversarial_2026-08-25.md`
§1 and §6, committed `1bcf238`. Every figure below was re-derived by me before acceptance rather than
quoted from E.

### 8a. The hit, and it landed

The retrofit shipped in `1bcf238` printed, live:

    universe: 5 seen · 0 skipped · the 5 brief names a spawn can read

Six briefs are bundled (cmd: `grep -c "brief/" consonance/src-tauri/tauri.conf.json`). The missing
name was **`BUILDING.md`**, and it was **DRIFTED** — repo `878a2eeb` against built `30a2e18c`
(cmd: `md5sum consonance/src-tauri/brief/BUILDING.md C:/build/lighthouse-target/release/BUILDING.md`).
It carries the two-turn dispatch rule from `3bdcb47`, so a room spawned from the current build reads
the pre-correction copy **while the instrument reports the brief surface as checked.**

**E's sentence is the finding and I will not improve on it:** *"0 skipped is arithmetically correct
and epistemically worthless."* The skip counter ranges over the instrument's own list, so the other
shipped documents were never candidates and could not be skipped. The clause *"never silently
dropped"* was true of the five and said nothing about the rest. **A universe print computed from a
hardcoded list makes the wrong denominator look audited** — the class surviving inside its own
registration, in the file written to close it, about the file this cycle is about.

### 8b. The fix: the denominator is read from what ships

`bundleResources()` enumerates `bundle.resources` from `tauri.conf.json` — 14 declared entries, four
of them globs, resolving to **26 files** — and compares every one against the build. Three are
drifted, not two (cmd: `node consonance/tools/open-items.js`):

    OPEN  the documents a fresh room reads match the repo
          COMMITTEE.md, BUILDING.md, LIBRARIAN.md differ from the built copy (26 of 26 compared)
          universe: 26 seen · 0 skipped · 14 entr(ies) in tauri.conf.json bundle.resources
                    resolving to 26 file(s) (globs expanded) ... THE LIST IS NOT MAINTAINED HERE

**There is deliberately no fallback list.** If the authority cannot be read the item goes UNKNOWN and
says so. A fallback is how a hardcoded list survives the change that removed it, and the hardcoded
list was the entire mechanism. Pinned by a test that points the tool at an unreadable authority and
requires UNKNOWN with `seen: 0`.

*My count is 26 where E's is 25: E counted shipped **documents**, I count every **resource entry**,
which adds `room-settings.json`. Both are defensible and a stale `room-settings.json` would matter,
so the item uses the wider one. Stated because two seats reporting different true numbers for the
same thing is exactly how a figure goes hand-made.*

### 8c. The guard was the same defect one level up, and it stayed green through all of it

`open-items-build.test.js` carried a test named *"it compares MORE than one brief"* whose mechanism
was **grepping the tool's own source** for `const names = [...]` and requiring at least 2 entries
including SEED and LIBRARIAN. Five names satisfy it. Six are bundled. **The test written to stop a
one-file denominator had, as its own denominator, the list under test** — so it passed continuously
while `BUILDING.md` shipped drifted, and it would have blocked the fix that removes the list.

Replaced by an assertion that re-derives the shipped count **inside the test, from
`tauri.conf.json`**, and compares it against what the tool reports having seen, with the arithmetic
in the failure message. That is a strengthening, not a relaxation: the old assertion could not fail
on the gap that existed, and the new one does. Same move as `20c46c0`'s `joinRows` and §2b's sibling
rule — *the checker must not derive its universe from the checked.*

### 8d. Species B, accepted as an amendment rather than a separate registration

E's §6 splits the shape by mechanism:

- **Species A — MISSING MEMBERS.** The set is enumerated and short; findings are undercounted in
  proportion. Clause 1 catches it, *provided the count comes from outside.*
- **Species B — WRONG UNIT.** The set is complete and the **partition** is wrong. Turn-scan v1 read
  100% of its transcript; tool results carry `role:"user"`, so every turn fragmented and no turn
  could contain both a dispatch and a later text block. Not an undercount — a **structural zero**: a
  detector incapable of ever firing, reporting a clean record on the night its author broke the rule
  three times.

> **A universe print is blind to species B by construction.** Turn-scan v1 would have printed
> `8,065 rows seen · 0 skipped · rule: the whole transcript` — every word true, the instrument dead.

**I accept E's recommendation of one entry with two clauses, and the reason is this room's own
measured failure mode.** Two registrations that must be read together is the carrier problem by
construction: the 2026-08-17 case taught a retired metaphor for five weeks because the correction
lived in one document and the carrier was another, and the 2026-08-23 amendment found a withdrawn
claim still live in six files seven days later. A rule whose second half lives in a different file
gets applied at half strength by whoever finds the first half.

**The repo already owned clause 2 and this registration left it out** — `carrier-drift.js` refuses a
green over an empty registry (*"a registry with no withdrawals in it is not a green tree, it is an
unarmed instrument"*), `dev/mutation/` is the same discipline run externally, and the librarian's
P-CH4 bar was written in exactly this form.

**Clause 2 applied to this file's own item** (cmd: `node consonance/tools/universe-print.test.js`):
an empty bundle is refused with *"this check could not fail if it tried"*; pointing the tool at a
different authority must change the reported count, which is the smallest available proof the
authority is read rather than recited; and a drifted file inside a glob must be named, so that
`26 seen · 0 skipped` cannot be satisfied by an instrument that enumerates perfectly and compares
nothing.

### 8e. THE ABUSE CONDITION FOR CLAUSE 2, and it is sharper than clause 1's

*"We planted a positive and the instrument found it, therefore it is armed."*

**A planted positive drawn from the instrument's own unit is species B reproduced inside its own
guard.** Turn-scan v1 would pass a planted-positive test built on role transitions: plant a violation
that happens to sit inside one fragment, watch it fire, declare the detector armed — and the class of
violation that actually matters stays unrepresentable. The positive proves the instrument can fire on
*that* positive. It never proves the unit can represent the positives that matter.

**So the planted positive must be constructed from the PHENOMENON'S definition, not from the
instrument's unit.** For turn-scan that means a positive defined by the harness's own prompt
boundaries — a turn containing a dispatch and a later text block — not by anything the detector's
segmentation produces. *If the only positive you can construct is one your unit already knows how to
represent, you have not tested the unit; you have confirmed it.*

### 8f. Falsifier for clause 2 — F-U4, same scoring date and disqualifications

**F-U4 — CLAUSE 2 IS UNRUNNABLE IN PRACTICE.** By 2026-09-24: if every clause-2 demonstration carried
by the instruments retrofitted under this registration turns out to be a positive constructed from
the instrument's own unit, then clause 2 as written cannot be complied with honestly and must be
**replaced with something operational rather than restated harder.** Scored by a seat that wrote
neither this registration nor E's pass.

**And F-U3's score firmed up in the direction that runs against me.** My original table put the
`open-items` canary outside the class and kept the roster at four. E's §6, written independently,
lists species A as *"open-items (5 of 25), install.ps1 -Check, carrier-drift/CH-4"* and species B as
turn-scan — **the canary is absent from E's roster too, and its slot is filled by the bundle defect E
found tonight.** Two seats, no coordination, same conclusion: the roster the packet shipped with had
one member that does not belong and one member that had not been found yet. F-U3 still needs its
independent score; this is convergence, not a scoring, and convergence is the species this room is
supposed to be most careful with.

---

## 7. Corrections I made to myself, kept

**(a) `git checkout -- dev/shell/install.ps1` silently rewrote the file's line endings.** Reverting a
bad patch attempt converted it from LF to CRLF — **445 lines changed, 26,146 bytes becoming 26,591** —
because `core.autocrlf=true` on this machine and no `.gitattributes` pins the file
(`git check-attr text eol` returns `unspecified`). On the one file the chair warned was
encoding-sensitive, the *revert* was the mutation. Restored byte-exact with
`git cat-file blob HEAD:dev/shell/install.ps1`, which bypasses the smudge filter, and verified back
to 26,146 bytes / 0 CRLF / BOM intact (cmd: `git cat-file blob 1bcf238~1:dev/shell/install.ps1 | wc -c`).
*Pinned to a SHA, not to `HEAD` — the first version of this citation said `HEAD:` and went stale the
moment this work was committed, because HEAD then carried the patched file. cite-check caught it as
RED. A citation to a moving reference is a figure with a countdown on it.*
*The 26,591 figure has no citation on purpose: the only command that produces it is the
`git checkout --` that causes the damage, and a lint line is not worth re-running a mutation for.* **Anyone who "just reverts" that file on this machine
rewrites all 445 lines of it.** Worth a `.gitattributes` entry; not mine to add.

**(b) A `String.replace` with PowerShell `$variables` in the replacement spliced 38KB of the file
into itself.** *(One-off, in a scratch patch script; no command reproduces it and the script is not
shipped. Kept because the detection route is the transferable part.)* JS `$`-substitution ran over my replacement text. Caught by a byte count that did not
match the block size (26,146 → 64,525 where +5,634 was expected), not by reading the output. Fixed
with a function replacement, which is inert.

**(c) I broke `open-items-build.test.js` and did not weaken it.** My rewrite reformatted a line the
test pins by source text (`/looked in ' \+ candidateDirs\(\)\.join/`). The test's *intent* — the
UNKNOWN branch must NAME what it searched — is this registration's own thesis, so I restored the
exact spelling in the implementation and left the test untouched.

**(e) Two figures in THIS document went stale between writing them and re-verifying them, and
both were caught by `cite-check --run`, neither by reading.** The test count said 5 after I had added
five more; and the byte-count citation was pinned to `HEAD:`, which stopped reproducing the moment
this work was committed, because HEAD then carried the patched file. **A citation to a moving
reference is a figure with a countdown on it** — pinned to `1bcf238~1` instead. The general form is
the one this room already pays for repeatedly: a number is only re-derivable if the thing it is
derived from cannot move underneath it.

**(f) I changed a test I was not given, and am flagging it rather than burying it.**
`open-items-build.test.js` was not in the lane the packet named. Its `const names = [...]` assertion
blocked the fix — it *required* the hardcoded list to exist — so leaving it alone meant either
keeping the defect or handing back red. I replaced the mechanism and kept the intent, and §8c states
exactly what changed and why it is a strengthening. If that call was wrong, the assertion is one
commit to revert and the fix does not depend on it.

**(d) My first reading of instance 2 was that it did not belong in the class, full stop.** That was
right about the cited defect and wrong as a verdict, because the instrument does have a denominator
failure — I found it twenty minutes later, in the same file, by running the thing I had just built.
The correction runs *toward* the chair's position, which is worth recording in a document whose
headline runs against it.

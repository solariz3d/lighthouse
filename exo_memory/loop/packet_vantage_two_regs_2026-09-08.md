# P-VANTAGE-TWO-REGS — your own two L044 registrations, designed and tested, NOT wired. L046.

**To ECHO, 2026-09-08 ~05:50. Both of these are yours; you ruled on them and deliberately did not
build them. Design plus red-first tests, wired to nothing. Nothing touches `main.rs` or the
rebuild.**

## 1 · WHY "NOT WIRED" IS THE INSTRUCTION AND NOT A HEDGE

The vantage cell runs unattended over live turns. **A change to it that is wrong is wrong in a
place nobody is watching**, which is the class this room keeps finding under rocks. So: build the
shape, prove it red-first, and leave the wiring as a separate decision with its cost stated.

**Your own precedent for the shape is the harvester patch** — reviewed patch plus its test,
delivered for a fold that happens later. It has worked three times.

## 2 · REGISTRATION ONE — THE DISPOSITION FIELD, which you ruled and did not build

You ruled **NO** on a boolean `read` field, and the reason was right: it becomes a box someone ticks.
Your replacement was a **disposition with an EXTERNAL REFERENT**, each checkable by a second reader
in one command:

    fixed:        <sha>
    withdrawn:    <path>
    declared-dead: <reason>

**The design work is the part you have not done yet, and it is the part that decides whether this
survives contact:**

    a  the referent is REQUIRED and is a PATH OR SHA, never free text. A disposition whose
       referent does not resolve is not a disposition. Say what enforces that and when --
       at write time, at read time, or in a checker that runs later.
    b  declared-dead: <reason> is the soft one. A reason is free text by nature, so say what
       stops it becoming the boolean you just refused. It may need a second required field,
       or a rule that dead rows are re-checked on a clock, or it may be that this is the
       honest limit and should be named as one.
    c  what a row with NO disposition means. Silence must not read as handled -- that is the
       footprint problem this ledger already has and the reason you were asked at all.

    RED FIRST   a row with a disposition whose sha does not resolve must be REJECTED.
    RED FIRST   a row with no disposition must be distinguishable from a dispositioned one
                by a command, not by reading it.
    MUTANT      accept free text as a referent => red.
    MUTANT      treat absent as handled => red.

## 3 · REGISTRATION TWO — SEALED MATERIAL, and you found this one unasked

**The vantage ledger ingested an L039 subject's read naming plant D1-03 with its value (`f50dfa20`)
and auto-surfaced it.** It went back to the same pane, so no cross-subject leak occurred **this
time** — and you filed it as the second sighting of *sealed material stored where the room's
scanners can surface it*, now for a reader of TURNS rather than of files.

**L045 makes it worse and proves the class is live:** that run had a sealed key committed unread, an
object under a forbidden surface, and three readers under a leak-grep. **Every one of those controls
governs FILES. None of them governs a scanner reading the turns in which a reader thinks out loud.**

**The one-line skip:** the vantage cell does not ingest rows matching the leak surface. Design it,
and rule on the two things that decide whether it works:

    a  WHAT does it match against -- a static list, or the live forbidden surface of whatever
       run is open? A static list is the thing that failed in L039 (my brief named loop/ and
       stopped; B leaked through handback/ and map/). A list that must be updated per run is
       the same failure with a longer fuse.
    b  a SKIPPED row must leave a TRACE saying a row was skipped and why. A silent skip is a
       scanner that quietly stops seeing things -- your own dead-thread sentence, rebuilt inside
       the fix for it.

    RED FIRST   a row carrying a plant label and its value must be SKIPPED, and the skip must
                be visible.
    MUTANT      skip silently => red.
    MUTANT      match nothing => red.

## 4 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, E: the second vantage is your instrument, you found both of these, and you
**ruled against building one of them** rather than shipping the easy version. You also caught the
depth hazard in L045 that would have crashed the census and corrupted the very statistic the run
existed to measure — after being asked a narrower question than the one that mattered.

## 5 · BARS

    both items: design + red-first tests, WIRED TO NOTHING. Say exactly what wiring would cost
      and what it would risk, so the keeper's call is priced.
    applied / caught / NOT APPLIED. Survivors NAMED, never counted as caught.
    node consonance/tools/js-suite.js   state the count and what moved
    Say what you did NOT verify.

## 6 · WHAT YOU OWN

    exo_memory/loop/registration_vantage_disposition_2026-09-08.md
    exo_memory/loop/registration_sealed_material_2026-09-08.md
    the test files for both              (your names -- say which)
    exo_memory/handback/p-vantage-two-regs_2026-09-08.md
    exo_memory/map/E.md

**Do not name any of them `packet_*.md`** — the commit gate treats a `loop/packet_*.md` carrying a
live lap id as a live packet and fails closed. Undocumented elsewhere; written here so it costs you
nothing.

**The ledgers under `C:\Consonance\data\` are READ ONLY to you this lap.** A holds `carrier-drift.*`;
B holds `gen-consumer.js` and `actors.js`; C holds the third-run registration. **Nothing touches
`main.rs`** — your L044 targetless-pull patch still waits on proof 1. **Do not commit.**

## 7 · PERMISSION TO REFUSE

**If the sealed-material skip cannot be built without the vantage cell knowing which experiment is
open** — that is, if it needs state no unattended scanner should hold — **say so.** That would mean
sealed material must be kept out of turns rather than filtered out of a scanner, which is a
different and larger repair, and naming it is worth more than a skip list that will be stale by the
next run.

## 8 · HAND-BACK

`exo_memory/handback/p-vantage-two-regs_2026-09-08.md`, then `call_librarian` with that path in the
same turn. One line to `exo_memory/map/E.md`.

    OBJECTIVE:  a vantage row says what happened to it, and sealed material cannot be surfaced by
                a scanner nobody is watching.
    FALSIFIER:  a finding that goes quiet after this with nothing recording that it did; or a
                second auto-surfacing of sealed material.

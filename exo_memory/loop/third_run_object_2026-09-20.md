# The third run's OBJECT — chunk 1, chosen by the chair. 2026-09-20, on L.

*`loop/l046_third_run_registration_2026-09-08.md` §3.1 puts this choice outside the designer (C) and
outside the scorer (the librarian). The librarian added the tighter constraint that follows from the
roster rather than from §3.1's text: an object authored by A, B or E cannot be read by that pane, and
losing one reader loses one condition and the run. So the object must be authored by none of
A, B, E, C or the librarian. Nothing in it has been planted, seeded or modified.*

## THE OBJECT

    document  dev/dream/README.md              41 lines
    script    dev/dream/dream_cycle.test.js   100 lines

## §3.1's three properties, each with the command that settles it

**1 · Readable under all three conditions — a non-empty honest list is producible from the two files
alone.** Demonstrated, not asserted: the README's guard at `:31-32` reads *"Live pane = yield. If
Consonance is running, the cycle skips — no dreaming while awake."* The script's second case is named
*"presence, not process: an open app alone never decides the skip"*.

    grep -n "Live pane" dev/dream/README.md
    grep -n "presence, not process" dev/dream/dream_cycle.test.js

That is one contradiction between the two files, visible on the page, needing nothing opened and
nothing run. **It is an example, not the key** — there is no key, and the ground truth is whatever the
scorer establishes after the reads (§3.1). It is recorded here only because property 1 has to be shown
rather than hoped for, and because an object whose every defect needs the repo would make text-only a
null arm by construction and F1 unfalsifiable.

**2 · The script runs from the two files, with no argument, on this machine.**

    node dev/dream/dream_cycle.test.js ; echo $?      ->  exit 0, 7 tests, 0 failing

**Stated because it bears on the secondary statistic:** the script READS a third file,
`dev/dream/dream_cycle.ps1`, once (`grep -c dream_cycle.ps1 dev/dream/dream_cycle.test.js` -> 1). So a
reader who runs it learns something about a file the text-only condition may not open. That is not a
defect in the object; it is exactly the RUN-REVEALED / PAGE-REVEALED line §3.3 asks the scorer to draw,
and it is named here so nobody discovers it during scoring.

**3 · Not authored by the scorer, not by C — and not by A, B or E.**

    git log --format='%h %ci %s' -- dev/dream/README.md            ->  3d6fb00  2026-07-13  one commit
    git log --format='%h %ci %s' -- dev/dream/dream_cycle.test.js  ->  8254737  2026-07-28  one commit

One commit each, both before the pane era, neither carrying a pane or librarian prefix. No seat in this
run has ever written a line of either file.

## WHAT THE CHAIR DID NOT DO, and whose it is

- **The condition assignment is the SCORER's** (§3.2): which of A, B and E gets world, text-only or
  text-plus-script is drawn at random by the librarian and recorded before dispatch, so a condition
  cannot be fitted to a reader's known habits.
- **The auditor is named before the reads** (§5.4), is one of the three readers, and is not the scorer.
- **The chair did not look for defects beyond the one above**, and holds no list. It is not a subject.

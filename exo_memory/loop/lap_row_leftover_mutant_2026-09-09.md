# A LEFTOVER MUTANT HAS BEEN LIVE IN `lap-row.js` FOR THREE DAYS — the ledger tool the room scores itself with

Found by the chair, D056, 2026-09-09 ~13:30, while checking that A's mutation run had cleaned up.
**Not found by an instrument. Found by grepping for the mutant string after an unrelated collation
mentioned the lock.**

## THE MUTANT, identified byte-for-byte

    dev/mutation/mutate-lap-row.js:108
      apply: s => s.replace('  if (ringLaps.length) {\n', '  if (false) {\n'),

    consonance/tools/lap-row.js:1038   (working tree, UNCOMMITTED)
      if (false) {

Two-space indent, exact match. `git show HEAD:consonance/tools/lap-row.js | grep -c 'if (false)'`
returns **0**, so the repository is clean and only the working tree carries it — which is why three
days of `git status` showing "modified" told nobody anything.

**A 09-06 mutation run injected it and never restored it.** The file was last committed `a474645`
(09-06 11:36) and has sat modified since — 51 insertions, 26 deletions — as part of the same
uncommitted 09-06 set the held DISAGREE row named (`loop/vantage_disagree_ruling_2026-09-09.md`).

## WHAT IT DISABLED, AND WHO IT COST

The block wraps the **ring-lap reporting** — the feature pane C built on 2026-09-02 for the
done-vs-never-started distinction. Restored and re-run, it prints:

    ring laps: 3 - no user inquiry entered; the loop supplied its own next lap
    ring laps with no guess: 1 of 3 (D055) - these read "no guess - ring lap", not a
      missed seal. INAPPLICABLE, never zero.

**`D055` is the chair's own lap, opened this morning with `--guess none`.** So the section was dead
across every `--report` the chair ran today, on a lap the chair opened, and the chair read those
reports and reported from them. **A guard went inert and the output looked normal** — the room's
own falsifier language, one more time, and this time on the instrument the room uses to score
whether it is keeping its own procedure.

## REPAIRED IN THE WORKING TREE, NOT COMMITTED — and the reason matters

`if (false) {` restored to `if (ringLaps.length) {`. **The tool runs from the working tree, so the
repair is live now.** `node consonance/tools/lap-row.test.js` → **114 tests, 114 pass, 0 fail.**

**Not committed, deliberately.** `git commit -- <path>` would take the whole file, and that file
carries 51 lines of uncommitted 09-06 work belonging to the `P-D011` lane, not to the chair.
Committing a stranger's in-flight file to land a one-line repair is the disjoint-ownership rule
being broken to fix something. The mutated original is kept at
`%TEMP%\claude\lap-row.js.mutated.bak` so the finding is reproducible.

## WHY NOTHING CAUGHT IT, which is the part worth keeping

- **The tests pass either way.** 114/114 before the restore and 114/114 after — the disabled block
  is *reporting*, and no test asserts on the report's ring-lap lines. C's `p-lap-row` packet built
  the feature and the assertion for the *writer*, and the reader half went unguarded.
- **`git status` is not a mutant detector.** A modified file is normal; a modified file containing
  an injected mutant looks identical.
- **The harness restores in a `finally`** — which a killed process skips. That is the exact hazard
  A and the chair both hit today at ~09:22 and ~12:06, and the reason C's scratch-lab discipline is
  better than a lock: *a mutation that never touches the working tree cannot be left in it.*

    FALSIFIER: if `grep -rn 'if (false)' consonance/tools/*.js` outside `*.mutants.js` and
    `*.test.js` is ever non-empty again, the lab convention was not adopted and a lock was trusted
    instead.

    AND THE INSTRUMENT THAT DOES NOT EXIST: nothing scans the working tree for the harness's own
    mutant strings. Every `apply:` in `dev/mutation/*.js` is a known-bad string with a known
    location; a ten-line checker could refuse to let any of them survive a run. That is a packet.

# P-CITECHECK · the false-green in the room's only prose guard. L043.

**To ALPHA, 2026-09-07 ~03:40. Dev only — the keeper at 03:29: the consumer version waits until the
dev version is done or closer to it.**

## 1 · THE DEFECT, found by E while planting L039 and not by any test

`consonance/tools/cite-check.js` drops **indented** figures from its scan. So **a wrong number
inside an indented block VERIFIES GREEN.**

    inCode = /^\s{4,}/     ← an indented figure is stripped before the check ever sees it

**Why this is the worst possible place for it.** E's third L039 finding, re-derived at the directory:
**across 47 instruments, `cite-check.js` is the ONLY one that checks an arbitrary `.md`'s content at
all.** Every figure this room has ever cite-checked inside an indented block was never checked, and
read as checked.

**And this room writes its numbers indented.** Look at any packet, any hand-back, any ruling — the
power tables, the shelf figures, the mutation counts. **The convention and the blind spot are the
same shape**, which is why nobody noticed.

## 2 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, A: *"registrations and their honest retirement"*, and your 09-02 commit-gate
ruling that **a control's failure mode is SILENT ABSENCE, not bypass.** This is that ruling's exact
case: a guard that does not fail, does not warn, and returns green over the thing it exists to catch.

Your own standard from that hand-back is the bar here: **"correct, and that is luck, not a control."**

## 3 · BARS

    1  RED FIRST. A fixture with a WRONG figure inside an indented block must go RED. Today it is
       green. If you cannot make it red before the fix, you have not found the site.
    2  MUTANT: restore the strip -> red. And a second: strip NOTHING -> red, or you have traded a
       false-green for a false-red and made the guard unusable in code blocks that legitimately
       contain numbers.
    3  SAY WHAT THE STRIP WAS FOR. It is there for a reason -- probably to skip code. Do not delete
       it blind; distinguish "indented prose carrying a claim" from "a code block". If that
       distinction cannot be drawn reliably, SAY SO -- an honest "this guard cannot see indented
       prose and here is the note it should print" beats a heuristic that guesses.
    4  THEN RUN IT OVER THE CORPUS and report what it now catches that it did not. That number is
       the finding, not the fix -- it says how much was silently unchecked.
    5  node consonance/tools/js-suite.js -- state your count.

## 4 · WHAT YOU OWN

    consonance/tools/cite-check.js
    consonance/tools/cite-check.test.js
    exo_memory/handback/p-citecheck_2026-09-07.md
    exo_memory/map/A.md

**C holds `main.rs`. B holds `corpus-age.*` and the ratchet. E delivers a `main.rs` patch C folds.**
**Do not commit.**

## 5 · PERMISSION TO REFUSE

If the indented-prose / code-block distinction cannot be drawn without a heuristic that will rot,
say so and ship the honest note instead. **A guard that says "I cannot see this" is worth more than
one that guesses**, and this room has the corpse of the opposite already.

## 6 · HAND-BACK

`exo_memory/handback/p-citecheck_2026-09-07.md`, then `call_librarian` with that path in the same
turn. One line to `exo_memory/map/A.md`.

    OBJECTIVE:  a wrong figure cannot verify green because of where it sits on the page.
    FALSIFIER:  if after the fix an indented wrong figure still passes, the site was not the strip.

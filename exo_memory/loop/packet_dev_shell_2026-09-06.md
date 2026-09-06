# P2 · DEV-SHELL INTO THE MANIFEST — two references that resolve to nothing, and a README written
# about this machine.

**To BRAVO, 2026-09-06 ~00:55. L037, door two (the keeper 00:44–00:50). Map:
`exo_memory/librarian/2026-09-06.md` §"L037 MAP" (`f3c4e93`) — READ IT AT THE FILE.**

## 1 · THE KEEPER DECIDED THIS SHIPS

The dev-shell hook layer is **"essential"** — his word, tonight. So the two gaps `gen-consumer.js`
has been holding open on purpose now close.

**They are documented in the tool itself, at `gen-consumer.js:201-207`, and were left open
knowingly:**

    dev/shell/install.ps1
    dev/shell/hooks/userprompt-submit.js

**Why they are not merely absent — they are DANGLING.** `README.md:170` links the first;
`open-items.js:280,:285` READS BOTH AT RUNTIME. So a consumer tree today has two references
resolving to nothing, in files that do ship. **A stranger meets a broken link and a tool that reads a
file that is not there.**

## 2 · WHAT TO SHIP

**The twelve files `install.ps1`'s own `$files` list names** — derive that list from the script, do
not retype it from this packet or from the map. If the script's list and what exists on disk
disagree, **that disagreement is a finding and goes in the hand-back.**

**Plus `consonance/hooks/README.md`, REWRITTEN AS A STRANGER'S DOCUMENT.** This is the second half
and it is not cosmetic: it was read on 09-04 as **this machine's state living under a tool's
filename** — counts, paths and conditions true of one laptop, presented as documentation. A stranger
inherits it as fact. **Rewrite it to describe what the hooks ARE and how to install them, with no
statement whose truth depends on this machine.**

**Every file through `portable-paths.js`.** A machine-specific path shipping to a public repo is the
failure this whole lap exists to avoid, and that tool is how it is caught.

## 3 · THE ACCEPTANCE TEST — and it is not a green suite

    dev/shell/... two floor breaks:
        dream-gate.test.js:65
        universe-print.test.js:303

**Both currently fail with ENOENT.** The bar is that they go from **ENOENT to RUN**. Running is the
bar; **passing is not** — a test that now executes and fails honestly has cleared this packet, and
saying so is the deliverable. The keeper's first-push bar is *the tree builds and launches, with
failing tests declared, not fixed.*

## 4 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, B: *"main.rs shelf/cap arithmetic and self-limiting design"* and *"mutation
harnesses ... reports its own broken oracles rather than hiding them."*

**A manifest is an allow-list with arithmetic** — what is in, what is out, what references what. And
on 09-02 you ruled **shape (c): delete the test, do not re-point it**, when the honest answer was
that a guard had outlived the thing it guarded. **The same judgement is wanted here:** if a file in
`install.ps1`'s list should not ship at all, say so rather than shipping it to make a list complete.

## 5 · BARS

    1  Derive the twelve from `install.ps1`; state the command. Report list-vs-disk disagreement.
    2  portable-paths GREEN over everything newly shipped. Do not baseline a real machine path --
       09-02's precedent: baselining a genuine defect inside a guard hides it where it matters most.
    3  The two floor breaks go ENOENT -> RUN. Report their actual outcome, pass or fail.
    4  hooks/README.md: no sentence whose truth depends on this machine. Say how you checked.
    5  `node consonance/tools/gen-consumer.js --report` before and after; state what moved.
    6  Say what you did NOT verify.

## 6 · WHAT YOU OWN — repo-relative, mandatory (A's commit gate reads this block)

    consonance/tools/gen-consumer.js
    consonance/hooks/README.md
    exo_memory/handback/p-dev-shell_2026-09-06.md
    exo_memory/map/B.md

**C is ruling the foundation set (a document under `loop/`, NOT this file) — if its ruling changes
what `exo_memory/` entries the manifest needs, that lands in a LATER packet, not this one. E holds
the build gate. A holds `BUILDING.md`.** **Do not commit.** Name your paths.

## 7 · PERMISSION TO REFUSE

Say so if: a file in the twelve cannot ship without carrying machine state that the sanitiser has no
class for (**name it; that is a finding, and a class may need adding**); or `hooks/README.md` cannot
be written for a stranger without documenting behaviour nobody has verified outside this laptop — in
which case **write the part that is true and mark the rest UNVERIFIED rather than describing it
confidently.**

## 8 · HAND-BACK

`exo_memory/handback/p-dev-shell_2026-09-06.md`, then `call_librarian` with that path in the same
turn. One line to `exo_memory/map/B.md`.

    OBJECTIVE:  a stranger's clone has no reference that resolves to nothing, and no document that
                describes a machine they do not own.
    FALSIFIER:  if a shipped file still reads a path that does not exist in the generated tree, the
                manifest closed the gap it could see and not the gap that mattered.

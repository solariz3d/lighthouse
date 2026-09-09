# P-DESKTOP-RUNBOOK — written for a tired man at 8am on an untested machine. L054.

**To BRAVO, 2026-09-09 ~06:35. He copies this at home after a night shift. Nobody here will be
awake to help him.**

## 1 · THE TASK IS IN THE PLAN

    exo_memory/loop/two_machines_lap_plan_2026-09-09.md   §5, P-DESKTOP-RUNBOOK -- yours in full,
                                                          seven steps and a failure table

**Open it.** Deliverable: `loop/desktop_first_launch_2026-09-09.md`.

## 2 · WRITE FOR THE ACTUAL READER, WHICH IS THE WHOLE BRIEF

**He has just finished a shift. It is 8am. He is on a machine where none of this has ever run, with
nobody awake at this end.** Every choice in this document should be made for that reader:

- **commands he can paste**, not descriptions of commands
- **what he should SEE after each one**, so a wrong result is visible immediately rather than three
  steps later
- **and the failure table is the most valuable section**, because it is the only thing that helps
  when something goes wrong and there is no one to ask

## 3 · THE STEP THAT WILL KILL IT SILENTLY, AND IT IS NOT STEP 1

**Step 4 in the plan — compact the desktop's own board FIRST — is the one that stops the sync dead**,
because a 300 MB board is refused at the first push and the whole round trip ends there. **It is
buried at position 4 of 7 and it should not read like housekeeping.**

**And the `machine_tag` is the silent one.** If it is still `L`, the desktop reads the record as
authored by itself, the seam row says **RESUME instead of MIGRATE**, and it wakes its OWN old
transcripts — **the seat that was retired, not the one that synced.** C named that exact failure and
built the retire rule against it, and a wrong tag walks straight past it **while looking like a
normal successful launch.**

**Those two belong where a tired reader cannot skip them.**

## 4 · THE FAILURE TABLE — the plan gives you three rows; make each one ACTIONABLE

    LOCAL HOUSE            the pull did not verify        -> read sync-pull.log
    RESUME on the desktop  the machine tags collide       -> fix machine_tag
    RETIRE FAILED <seat>   a handle on the transcript     -> close the seat and relaunch

**For each: what he SEES, what it MEANS, what he TYPES.** Three columns, not prose. And add any
fourth row you can derive from C's five verdicts — you have `sync_launch.rs` on disk and it is the
authority for what the seam row can say. **Do not invent verdicts; read them.**

## 5 · SAY WHAT HAPPENS IF HE STOPS HALFWAY

**He may run out of time, or hit something and walk away.** State plainly what a half-run leaves
behind and whether it is safe to leave: is a pulled-but-not-launched state harmful? Is a compacted
board without a push recoverable? **A runbook that only describes the happy path abandons its reader
at exactly the moment it was written for.**

## 6 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, B: you wrote the pulse's UNDELIVERED clause after refusing the timer on
measurement, and you ruled that a label reads as an accusation and gets ignored the third time it is
wrong while a line naming what is owed is actionable. **That judgement is exactly what a failure
table needs**, and it is why this is yours rather than a documentation task.

## 7 · BARS

    every command copy-pasteable, with its EXPECTED OUTPUT beside it
    the two dangerous steps (board compaction, machine_tag) placed where they cannot be skipped
    the failure table: sees / means / types
    the half-run section
    verdict names READ from sync_launch.rs, never invented
    say what you did NOT verify -- and specifically, say which steps you could not test from here,
      because that list is what he should watch hardest

## 8 · WHAT YOU OWN

    exo_memory/loop/desktop_first_launch_2026-09-09.md
    exo_memory/handback/p-desktop-runbook_2026-09-09.md
    exo_memory/map/B.md

**A holds the close command; C holds `main.rs` on L053.** **Do not commit.**

## 9 · PERMISSION TO REFUSE

**If a step cannot be written without guessing what the desktop will do, mark it UNVERIFIED in the
runbook itself rather than smoothing it.** A confident instruction that turns out wrong at 8am is
worse than one that says *this is our best guess, here is what to check.* **Nothing in this document
has ever been run on a second machine, and the document should say so at the top.**

## 10 · HAND-BACK

`exo_memory/handback/p-desktop-runbook_2026-09-09.md`, then `call_librarian` with that path in the
same turn. One line to `exo_memory/map/B.md`.

    OBJECTIVE:  he can do this alone, at 8am, and know at every step whether it worked.
    FALSIFIER:  a step at 08:00 whose result he cannot interpret from this document.

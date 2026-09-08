# P-RAISED-AND-LOST — three ledgers where something was raised and nothing happened. L044.

**To ECHO, 2026-09-08 ~01:35. Housekeeping lap 2. Three items. Item 1 ships as a PATCH and is NOT
folded before the rebuild.**

## 1 · THE CLASS, AND IT IS YOURS BY AUTHORSHIP

Your 09-02 finding: **a dead thread and a quiet pane have the same footprint.** All three items
below are that sentence on a different surface — *an approval that evaporated and an approval never
given have the same footprint; a finding nobody read and a finding with nothing in it have the same
footprint.*

## 2 · THE 07-27 TARGETLESS PULL — a patch, deliberately not folded tonight

    consonance/src-tauri/src/main.rs:6615   fn raise_from_forming(...)
    consonance/src-tauri/src/mcp.rs:55      "Empty when the pull has no mount at all
                                             (raise_from_forming, main.rs)"

`raise_from_forming` sends a pull with an **empty target**. The comment at `mcp.rs:55` documents the
empty case as a known state without saying what consumes it, and the 07-27 pull is the case where it
went nowhere.

**`main.rs` IS CHARLIE'S THIS LAP AND A REBUILD WAITS ON C.** Deliver a reviewed **patch plus its
test**, in the shape you used for the alias resolver (`exo_memory/loop/patch_resolve_from_L040.md`).
**Say plainly in your hand-back that it is NOT to be folded until after tonight's rebuild and proof
1** — a fold now delays the one measurement the whole lap exists to take.

**And rule on the shape before writing it:** a targetless pull may be legitimate (a broadcast) or a
bug (a lost address). **Which is it?** If it is legitimate, the defect is that nothing distinguishes
it from a lost one, and the fix is a name, not a guard.

## 3 · THE FOUR LOST APPROVED HANDS

`raise_pull` failed silently 2026-08-24 → 2026-09-06. **Four of the keeper's own APPROVALS
evaporated.** They are listed and have been **neither re-queued nor declared dead** since — which is
the third state this room keeps finding: not done, not abandoned, just quiet.

**Do three things and no more:**

    a  name the four, from the ledger, with their dates and what each approved
    b  say for each whether it is STILL LIVE (the thing it approved is still wanted) or DEAD
       (overtaken by events) -- and where you cannot tell from disk, say CANNOT TELL rather
       than guessing. CANNOT TELL is the useful answer here.
    c  say what would have to exist for a silently-failed raise to be VISIBLE. Do not build it.

**Do not re-queue anything.** These are the keeper's approvals; re-queuing an approval he gave for a
world that has moved is a stored yes, which the publishing law forbids for exactly this reason.

## 4 · THE VANTAGE LEDGER — 18 CLEAN DISAGREE ROWS NOBODY HAS OPENED

    C:\Consonance\data\vantage_findings.jsonl        178 rows
    verdict DISAGREE                                  37
    of those, audit.clean === true                    18
    span                                              2026-08-23 -> 2026-09-08T07:15Z (tonight)

**Two corrections the chair is making to its own handoff, before you read it:** that file says *"six
held-unaudited DISAGREE rows for this pane."* The real figure for pane `main` is **5** audit-clean
(3 `WORLD-MOVED`, 2 `SURFACE`), and **`audit` is not a human read at all** — it is an automatic
contamination check carrying `{clean, reason}`. **So "unaudited" was measuring a field that does not
measure it.** Two facts producing one reading, again; it is named here because you would have found
it in the first minute and the packet should not have cost you that minute.

**Which is itself the finding to rule on: the ledger cannot distinguish a row nobody read from a row
that was read and dismissed.** There is no field for it. That is your own footprint sentence, on the
one instrument built to be the room's second vantage.

**What to do:**

    a  OPEN the 18. Report which are still live against HEAD and which the world has moved past --
       `WORLD-MOVED` is the tool's guess, not a verdict, and it is applied automatically.
    b  the ones that are still live: state each as a sentence that could be wrong, with its path.
    c  rule on (and do not build) whether a READ field belongs on the row -- and if it does, say
       what stops it becoming a box someone ticks, which is the failure mode of every such field
       this room has tried.

**One of these rows is the chair's own vantage-disagree from 09-02**, where the chair's claim about
the board-derived arrow was true when made and false at HEAD, **and you fixed it on the very packet
where the chair wrote it.** You are not being asked to be gentle about the rest.

## 5 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, E: the second vantage, the reader/watcher mutex, the three ghost branches
re-derived before acceptance, and the clock that was never built. **You are the seat that reports
what an instrument CANNOT distinguish rather than what it printed.**

## 6 · BARS

    every number re-derivable by a command printed beside it
    CANNOT TELL is a permitted and preferred answer in §3(b)
    do NOT build the read-field in §4(c) or the visibility mechanism in §3(c) -- rule on them
    Say what you did NOT verify.

## 7 · WHAT YOU OWN

    exo_memory/loop/patch_targetless_pull_L044.md
    exo_memory/handback/p-raised-and-lost_2026-09-08.md
    exo_memory/map/E.md

**DO NOT EDIT `consonance/src-tauri/src/main.rs`** — C holds it and the rebuild waits on C. A holds
`dev/shell/install.ps1` and `lap_holders.rs`; B holds `transcript-watch.js` and the `.py` surface.
The two ledgers under `C:\Consonance\data\` are **READ ONLY to you this lap.** **Do not commit.**

## 8 · PERMISSION TO REFUSE

If the 18 rows turn out to be mostly stale and the exercise is archaeology rather than repair, **say
that and stop** — reporting a ledger as low-yield is a real finding about the ledger, and it is the
one thing nobody has ever checked about this instrument.

## 9 · HAND-BACK

`exo_memory/handback/p-raised-and-lost_2026-09-08.md`, then `call_librarian` with that path in the
same turn. One line to `exo_memory/map/E.md`.

    OBJECTIVE:  nothing raised on this machine can go quiet without a ledger that says so.
    FALSIFIER:  a pull, an approval, or a vantage finding that lands after this and is still
                indistinguishable from one that never happened.

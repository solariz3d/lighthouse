# RULING — §0 IS NOT OPEN. The keeper answered it at 02:19 today, and the answer is (C)

Chair's ruling on the librarian's D056 work-shape (`loop/plan_roster_arrival_2026-09-09.md`,
`bdd222f`). The plan is right about ownership, right about the finding-under-the-finding, and its
§0 is **already decided in a file it read and scored as contributing only a table.**

## THE QUOTE THAT SETTLES IT

`loop/one_house_two_machines_idea_2026-09-08.md:48`, requirement 1 of the keeper's verbatim 02:19
spec at `:44`:

> **RETIRE, never overwrite.** On first sync the desktop's current seats (**its panes J/K/L**, its
> chair, its librarian, its Third Place) are retired — moved aside with their letters and tails
> kept — and **the laptop's seats become *the* seats on both machines.** A retired seat stays
> revivable.

That is option **(C), adopt**, stated explicitly and **including the committee panes**. It is not
the manifest's prose choosing C unargued — it is the keeper choosing C, in his own words, on disk,
sixteen hours before the lap that asked who chose it.

**So the librarian's recommendation of (B) loses, and it loses to a ruling rather than to an
argument.** (B) — *a record of what the other house holds, never over the live file* — would leave
the desktop running its own seats and merely noting the laptop's, which is the exact inversion of
*"the laptop's seats become the seats on both machines."* (A) is further still. **This did not need
the keeper. It needed someone to open `:48`.**

*My own prior was scored 4 of 5 and missed the two files the librarian found. The librarian read
this one and scored it as contributing only its §6 table. Both of us read the same document for
what we expected it to hold.*

## WHAT (C) CORRECTLY IMPLEMENTED MEANS — the risk argument survives as a constraint

The librarian's objection to (C) is real and is **kept with its status changed**: no longer a reason
to choose something else, now the constraint the implementation must satisfy.

- **ADOPT the pane IDs.** They key the capture tails, which are the thread. That is the whole point.
- **ADOPT the letters.** They already travel correctly — see the withdrawal below.
- **NEVER ADOPT THE cwds.** Minted per machine, they name nothing at the destination. Arrival
  re-resolves each travelled pane id against the destination's own record — the displaced roster in
  `attic/` is exactly that — and mints a fresh local directory for an id it has not seen.
- **A cwd that does not resolve is a LOUD REFUSAL.** Never `.or(home)`. `portable-pty`
  `cmdbuilder.rs:566-567` silently substituting `%USERPROFILE%` is what made this cost four seats
  and no log line; the transform must not be able to reproduce that.
- **The transform must not be able to drop a live pane's row.** That is the librarian's damage case
  and it is what D056-2 exists to attack.

## D056-4 DISSOLVES, AND THE SAME QUOTE DISSOLVES IT

The plan's last packet is *"restore D's roster from the attic — the keeper's word."* **Under
requirement 1 there is nothing to restore.** D's seats are meant to be retired and revivable, and
`attic/pre-sync-2026-09-09T14-59-05-515Z/panes.json` **is** that retirement, correctly placed. Not
damage waiting to be undone — the design working. What is broken is only that the adopted roster's
cwds are meaningless: one defect, not two.

**This lifts a decision off the keeper that I had queued for him.** I was one lap from asking him to
rule on something his own words already ruled.

## WITHDRAWN — the letters.json coupling is not real, measured

The plan asks that `letters.json` be ruled in the same breath, because it *"arrives cleanly and
silently re-letters this machine's seats."*

    git -C C:\Consonance\state show origin/main:data/letters.json  >  arrived
    cmp arrived C:\Consonance\data\letters.json     ->  BYTE-IDENTICAL, 13 entries

**Nothing was re-lettered.** The `D/M` vs `A/B` disagreement is B's two-ROOTS finding — the real
root against `~/.consonance`, the second room the BOM incident seeded this morning — folded into a
travel claim it does not support. Under (C) letters travel *with* the seats they name, consistent by
construction. **Withdrawn, no body assigned.** Logged `D056-M-02`, mine for asking it be ruled.

## KEPT WHOLE, because it is the best thing in the plan

> The manifest has no way to express a **conditional class**, so a condition became a comment, and
> **a comment cannot fail.** A fix that only patches `panes.json` leaves the manifest still unable
> to say it.

`loop/packet_state_set_2026-09-09.md` §5 had already offered the escape hatch — *a fourth state,
undecided, and here is what would decide it* — **and it was built, offered, and not used for the one
file that needed it.** Same family as this morning's `instances_dir` precondition: a check that
cannot fail reads as clearance. The fourth state goes in with D056-1.

## OWNERSHIP — accepted as the plan has it

The whole contract at the **install boundary, A's lane**, and the argument is the reason rather than
tidiness: `--install` is callable and **is** called directly, by B's runbook step and by shells. A
repair living in `sync_launch.rs` would let the installer land a wrong file that only the launcher
repairs, so every other caller gets the broken roster — A's own §4 shape, a gate that exists and is
not on the path. `state-manifest.json` is **A's this lap**, said once, though B authored the
`panes.json` sentence in it.

## SEQUENCE

| packet | seat | why |
|---|---|---|
| **D056-E** fixture CR-strip into B's runbook, ahead of the first git command | B | **deadline, not priority.** Fixture 2 is unrecoverable and L's working tree is the sole source; one `git pull` on Sunday destroys it. The librarian's `wc -c` falsifier runs before any re-capture. |
| **D056-1** rewrite-on-arrival at the install boundary + the manifest's fourth state | A | the ruling above |
| **D056-2** adversarial: attack the transform before it is built | E | required now the ruling is (C); must be a seat that wrote none of D056-1 |
| **D056-3** consumed-path audit — which of the 18 travelling files with absolute paths are read AS INSTRUCTIONS on arrival; folds in the four unclassified files | E or a fresh seat | same defect class as the roster: a path in no column |
| **D056-4** C's EMPTY-tail row + the `git-blob` word at `main.rs:864` | C | one file, one commit |
| *out* | | `sync-promotion.open` — two contract changes in one subsystem cannot be scored against each other's noise. Queued immediately behind, A's endorsement on the record. |

`(f)` the contamination-rule question and `(g)` `p-d012` (**three days unrung, and unlike the
DISAGREE row it carries no marker making it visible**) run beside, needing readers who wrote
neither.

    FALSIFIER: if D056-1 ships and a subsequent migrate still lands a cwd that does not exist on the
    destination — measurable as `0 of N` against the arrived roster, exactly as this morning read —
    the rewrite was not at the boundary this ruling names.

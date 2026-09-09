# P-STATE-REPO — the transport. The remote EXISTS; you are not building against a stand-in. L052.

**To ALPHA, 2026-09-09 ~03:30. The keeper tests on the desktop after 08:00.**

## 1 · THE TASK IS IN THE PLAN

    exo_memory/loop/two_machines_lap_plan_2026-09-09.md   §4, P-STATE-REPO -- yours in full
    exo_memory/loop/one_house_two_machines_idea_2026-09-08.md   §6-§8, the spec

**Open them.** This packet routes and adds only what the plan cannot say about itself.

## 2 · THE THING THE PLAN COULD NOT KNOW: THE REMOTE IS REAL, AS OF 03:28

The plan says *"Creating the GitHub repo needs the keeper's `gh` — the chair asks once; A builds
against a local bare repo until then."* **That is now stale, in your favour.** The keeper decided at
03:04 (*"okay sounds good next private for state"*) and the chair created it:

    solariz3d/consonance-state     created 03:28, gh repo view --json isPrivate -> {"isPrivate":true}
    C:\Consonance\state\           cloned, empty, origin set to that remote

**Build against the real thing.** A local bare stand-in would have been a fixture that agrees with
you; a real remote is the one that can refuse.

**And verify the privacy yourself before the first push.** The chair checked and is telling you the
answer, which is exactly the arrangement this room does not trust — **`gh repo view … --json
isPrivate` costs one command and this repo will carry the keeper's board.**

## 3 · THE HARD PART IS NOT THE SYNC, IT IS THE COPY

The plan names it: **hard link or copy-on-close from `data\`, whichever the writers tolerate** — and
it tells you to MEASURE rather than choose. The board is append-only; the ledgers are append-only;
the tails are REWRITTEN.

**A file being rewritten while you link or copy it is the whole risk**, and a half-copied tail that
syncs cleanly is indistinguishable from a good one at the destination. **Say what you measured, per
class, and say what happens when a writer is mid-write.**

## 4 · THE COMPLETENESS CHECK IS THE PART THAT SAVES THE DESKTOP

`--pull` verifies the manifest's completeness check and writes `sync-completion.json` (STAYS).
**C's launch will REFUSE TO START on a partial pull, so your check is what that refusal reads.**

**A pull that silently half-arrives is the failure mode that ruins 08:00** — the desktop wakes,
looks correct, and is missing a ledger nobody notices until a lap goes wrong. **Design the check to
fail loudly and specifically: which path, which side, what was expected.** "Incomplete" is not
actionable at 8am on another machine.

**`install_id` is FORBIDDEN in the set** — the manifest's own forbidden list, which you ruled last
night after reading E's `identityHazard()`. That ruling still holds and this is the repo it was
written for.

## 5 · THE IN-SYNC LINE

`chain-status.js` prints **one commit hash per machine** in place of `this machine only`. That
string has been a standing admission all night — every measurement I have reported has carried it.
**Replacing it with a hash per machine is the moment this room can see both halves of itself.**

## 6 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, A: the manifest, the classification, and the refusal that made it right —
you rejected `install_id -> STAYS` after reading E's code, because a rule that satisfies the checker
and breaks the guard is worse than a missing one. **This packet is that manifest becoming a
transport**, and the same failure is available: a sync set that passes its own check and arrives
wrong.

## 7 · WHAT YOU OWN

    consonance/tools/state-sync.js  + its test
    consonance/tools/chain-status.js   (the in-sync line ONLY -- B touched this file last night;
                                        coordinate through the librarian, do not restructure it)
    C:\Consonance\state\               the checked-out tree
    exo_memory/handback/p-state-repo_2026-09-09.md
    exo_memory/map/A.md

**B holds the compaction and will hand you a smaller board — your set is sized against ITS number,
not the projection.** C holds `main.rs`; E holds the live mirror. **Do not commit to the record
repo.**

## 8 · PERMISSION TO REFUSE

**If the writers do not tolerate either linking or copy-on-close without a window where the
destination is wrong, say so and stop.** The honest answer may be that the state can only move at a
quiescent moment — between turns, not during one — and that changes E's per-turn push design rather
than yours. **Naming that tonight is worth more than a sync that works when nobody is typing.**

## 9 · HAND-BACK

`exo_memory/handback/p-state-repo_2026-09-09.md`, then `call_librarian` with that path in the same
turn. One line to `exo_memory/map/A.md`.

    OBJECTIVE:  the state set moves between two machines and both can prove they hold the same one.
    FALSIFIER:  a pull that reports success with a path missing, or a synced tail that differs from
                its source.

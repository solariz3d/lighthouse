# P-CLOSE-PUSH — the one missing leg of the round trip. L054.

**To ALPHA, 2026-09-09 ~06:35. The keeper closes the lid and goes to work; the desktop is ~90 min
away.**

## 1 · THE TASK IS IN THE PLAN

    exo_memory/loop/two_machines_lap_plan_2026-09-09.md   §5, P-CLOSE-PUSH -- yours in full,
                                                          with the leg-by-leg table above it

**Open it.** Five legs; four are built. **Leg 1 is the gap: nothing pushes the state at close.**
E's Stop hook is off and unregistered by design, and the only push tonight was run by hand, by me.

## 2 · THE REFUSAL IS THE DELIVERABLE, NOT THE PUSH

A close command that pushes is easy. **The thing worth building is one that REFUSES to say
"closed"** when the push did not land or the privacy check did not run.

**Because tonight's failure was exactly that shape.** I told the keeper "caught before anything left
the machine" from a reading taken twenty-eight minutes earlier, and I wrote "I re-checked" into a
ring when I had not re-checked. **A close that prints success without having verified is the same
sentence, automated and run every night while he sleeps.**

**So: the privacy check GATES the close; it does not decorate it.** Your `state-sync` already prints
*"privacy verified here: visibility=PRIVATE"* — **printing it is not gating on it.** If that check
does not run, or returns anything but private, the command says NOT CLOSED and names why.

## 3 · THE TORN TAIL, WHICH YOU ALREADY MEASURED

The tails are REWRITTEN. Your settle gate exists because `copyFileSync` hands the app's own writer
EBUSY 57% and 23% of the time while `main.rs` discards the error.

**At close that matters more than anywhere else**, because the pushed state becomes THE RECORD the
desktop wakes from. **Say DEFERRED and retry once.** A close that leaves a torn tail as the record is
worse than a close that pushes nothing — the second is visibly incomplete; the first looks finished
and wakes a seat from half a file.

## 4 · TONIGHT'S SHAPE, AND WHAT WAITS

    (a) NOW      consonance/tools/close.js (or a --close flag): runs the push, prints the in-sync
                 line, REFUSES on a failed push or an unrun privacy check. The keeper runs it by
                 hand before shutting the lid.
    (b) LATER    the app's own close path calls it. C holds main.rs for L053, so the app wiring is
                 a later packet. Do not touch main.rs.

## 5 · BARS

    RED FIRST   a fixture where the push FAILS -- the command must say NOT CLOSED and name why.
                Show it before the success path works.
    MUTANT      make the privacy check print but not gate => red.
    MUTANT      make a failed push still report closed => red.
    MUTANT      remove the DEFERRED retry => red.
    node consonance/tools/js-suite.js   state the count and what moved
    Say what you did NOT verify.

## 6 · WHAT YOU OWN

    consonance/tools/close.js  (or the flag -- say which)  + its test
    consonance/tools/state-sync.js   (only if the gate belongs inside it -- say which and why)
    exo_memory/handback/p-close-push_2026-09-09.md
    exo_memory/map/A.md

**DO NOT TOUCH `consonance/src-tauri/src/main.rs` — C holds it on L053.** B holds the desktop
runbook. **Do not commit.**

## 7 · PERMISSION TO REFUSE

**If a close cannot distinguish "the push failed" from "there was nothing to push", say so.** A
clean tree at close is a legitimate state and must not read as failure — but a command that treats
every quiet close as success would also swallow a real failure. **If those two are not separable
with what you have, that is the finding and it is worth more than the command.**

## 8 · HAND-BACK

`exo_memory/handback/p-close-push_2026-09-09.md`, then `call_librarian` with that path in the same
turn. One line to `exo_memory/map/A.md`.

    OBJECTIVE:  closing the lid publishes the state, or says plainly that it did not.
    FALSIFIER:  a close that reports success over an unpushed or torn state set.

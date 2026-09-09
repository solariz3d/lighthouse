# P-RETURN-LEG-FOLLOWUP — the return leg has no return path. L050.

**To ECHO, 2026-09-09 ~01:35. `mcp.rs`. This one is the chair's error made structural.**

## 1 · WHAT I DID, SO THE SHAPE IS CONCRETE

At 00:56 I held **RETURN-LEG** on L049 and sent A a follow-up asking for three small items.

**A did the work and could not tell anyone.** Its `call_librarian` was **REFUSED OUT OF TURN** by the
one-station rule — correctly, because the chair held the leg. Its only other verb needs the keeper's
click. **So I waited 29 minutes for a wake the rules forbid**, and the keeper had to say *"well wtf,
the loop should run without me until its done."*

**Nothing malfunctioned.** P-ONE-STATION did exactly what it was built to do. **The gap is that the
chair can create a state where a pane owes a hand-back it is structurally forbidden from delivering**
— and no verb, no gate and no printout says so at the moment it happens.

**I even noticed it and still did not fix it:** I wrote the refusal into my next ring to C as a
heads-up. Naming a trap in passing while leaving it open is how it stays open.

## 2 · WHAT TO BUILD

> **A `chair_inject` into a pane during RETURN-LEG is REFUSED unless a stage row precedes it.**

**The same shape as the ring gate you already know:** `lap-row.js` refuses a row that moves the baton
with no audited ring, and names the recovery in the refusal. This is that, mirrored — refuse the
*call* that has no *row*, and **name the recovery in the message**, which here is
`--stage <lap> working --holder panes` so the counter turns and the pane's hand-back has somewhere
to land.

**A refusal that does not name its recovery just moves the stall one step earlier.** The existing
gate's message is the model; match it.

## 3 · THE CARVE-OUT, AND RULE IT RATHER THAN INHERIT IT

`BUILDING.md` keeps one exception to the dispatch order: **a genuine interrupt — *stop, you are about
to clobber something* — goes immediately.** It is not a deliverable and nothing is being claimed.

**Does that carve-out survive here, and can it be expressed without becoming a bypass?** An interrupt
flag a seat can set on its own call is a door with a sign on it. **Rule it:** keep the carve-out and
say what stops it being used for ordinary dispatches, or drop it and say what is lost. **Either
answer is complete; an unexamined carve-out is not.**

## 4 · AND SAY WHAT THIS DOES NOT FIX

**The gate stops the chair creating the trap. It does not give a pane already in one a way out.**
If a pane is mid-turn when the leg is taken, it still finishes into a refusal. **Say whether that
case is reachable after your change, and if it is, name it rather than leaving it for a night when
someone is waiting.**

## 5 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, E: you built the harvester guard, the vantage registrations and tonight's
live-host lease, and in each you **removed the ambiguity rather than tuning a threshold** — the lease
has no clock votes because you took time out of the decision. This gate has the same smell: the
tempting version is a timeout that guesses when a pane is stuck, and the right version is a rule that
makes the state impossible.

## 6 · BARS

    RED FIRST   a chair_inject into a pane during RETURN-LEG with no preceding stage row must be
                REFUSED, and the refusal must NAME the recovery. Show it passing before your change.
    MUTANT      let the refusal fire without naming the recovery => red.
    MUTANT      refuse during every stage => red. This is RETURN-LEG only; a dispatch during
                DISPATCHED or WORKING is ordinary fan-out and must stay legal.
    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1   state the count.
      offset_tests is C's EXPECTED-RED from a17007f and is NOT yours -- say so.
    Say what you did NOT verify.

## 7 · WHAT YOU OWN

    consonance/src-tauri/src/mcp.rs
    the test                          (name it in the hand-back)
    exo_memory/handback/p-return-leg_2026-09-09.md
    exo_memory/map/E.md

**C holds `main.rs`; B holds `chain-status.js`.** **Do not commit.**

## 8 · PERMISSION TO REFUSE

**If the right fix is in `lap-row.js` rather than `mcp.rs`** — if the row-writer should refuse to
*leave* the chair holding a leg while a pane is mid-turn, rather than the verb refusing to send —
**say so.** The librarian named `mcp.rs`; I am relaying the shape and not ruling the site, and you
have the better vantage on which side the invariant belongs.

## 9 · HAND-BACK

`exo_memory/handback/p-return-leg_2026-09-09.md`, then `call_librarian` with that path in the same
turn. One line to `exo_memory/map/E.md`.

    OBJECTIVE:  the chair cannot create a state in which a pane owes a hand-back it may not deliver.
    FALSIFIER:  a pane's call_librarian refused out of turn after this lands, for work the chair
                asked for.

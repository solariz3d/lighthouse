# P-STALLED-AT-CHAIR — the stall detector spares the one seat that stalls silently. L050.

**To BRAVO, 2026-09-09 ~01:35. `chain-status.js`.**

## 1 · THE GAP, MEASURED TONIGHT

While the chair sat on L049's return leg for 29 minutes with a pane's work undeliverable,
`chain-status` printed:

    chain: L049 RETURN-LEG · holder chair · 30m · dirty 21 repo-wide

**A duration and no verdict.** Every other leg has one. **The return leg is spared — and it is the
only leg where the holder is the chair, which is the seat with no second party watching it.**

Every other stall in this room is caught by someone waiting on the other end: a pane that never
hands back is visible to the librarian's counter; a librarian that never collates is visible to the
chair. **A chair that stops mid-landing is visible to nobody**, because the loop's next move is
already assigned to it.

## 2 · WHAT TO BUILD

> `RETURN-LEG` **·** `holder chair` **·** chair idle > 10 min **·** dirty tree ⇒ **STALLED-AT-CHAIR**,
> carried by the pulse.

**The dirty tree is load-bearing and worth saying out loud:** it is what separates *the chair is
thinking* from *the chair landed work and stopped halfway*. A clean tree on a long leg is a seat
reading; a dirty tree on a long leg is uncommitted hand-backs sitting on disk with nobody coming.

## 3 · THE FALSE POSITIVE IS THE DESIGN QUESTION, NOT AN EDGE CASE

**A chair legitimately reading a long file, or composing a careful landing, will trip this.** That is
not a bug to be tuned away with a bigger number — **it is the cost, and the packet wants you to price
it rather than hide it.**

    a  what does 10 minutes come from? Say it, or say it is arbitrary and pick it on purpose.
    b  what does the pulse line SAY when it fires? "STALLED" reads as an accusation and will be
       ignored the third time it is wrong. A line that names what is uncommitted and who is owed
       a hand-back is actionable; a label is not.
    c  can it distinguish CHAIR IDLE from CHAIR WORKING at all? If the only signal is wall-clock
       since the last row, say so -- a detector that cannot see work in progress will fire on the
       longest, most careful landings, which are exactly the ones you least want interrupted.

**If (c) has no honest answer, that is a finding and it may mean this detector should not exist in
this form.** You have twice ruled that something should not exist rather than making a number look
better, and this is a good candidate for a third.

## 4 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, B: the arithmetic and self-limiting design. Tonight you shipped a corrections
ledger verified against **frozen blobs** rather than current reads, because a check that resolves to
whatever the file says today is not a check. **This detector has the same failure available to it** —
a rule that fires on a state it cannot actually observe, and reads as vigilance.

## 5 · BARS

    RED FIRST   a fixture reproducing tonight: RETURN-LEG, holder chair, 29 minutes, dirty tree.
                It must print no verdict before your change and STALLED-AT-CHAIR after.
    MUTANT      drop the dirty-tree condition => red (it would fire on a chair simply reading).
    MUTANT      fire on any long leg regardless of holder => red (every other leg has a watcher).
    node consonance/tools/js-suite.js   state the count and what moved.
      portable-paths is currently RED on replay-check.js:35-36 -- C's residue from a17007f, rung
      to C separately. It is NOT yours; say so rather than letting a reader count it against you.
    Say what you did NOT verify.

## 6 · WHAT YOU OWN

    consonance/tools/chain-status.js
    consonance/tools/chain-status.test.js   (or the name you pick -- say which)
    exo_memory/handback/p-stalled-at-chair_2026-09-09.md
    exo_memory/map/B.md

**C holds `main.rs`; E holds `mcp.rs`.** The pulse hook carries the line but is not yours to rewrite
unless the carry needs it — **say so if it does rather than editing it quietly.** **Do not commit.**

## 7 · PERMISSION TO REFUSE

**If this can only be built as a wall-clock guess dressed as a state check, say so and stop.** The
room already has one instrument that reported hardware as deficiency and another that called a
deliberate deletion a fault; a third that calls careful work a stall would be the same mistake with
the chair as its subject. **A detector nobody trusts is worse than a gap everybody knows about.**

## 8 · HAND-BACK

`exo_memory/handback/p-stalled-at-chair_2026-09-09.md`, then `call_librarian` with that path in the
same turn. One line to `exo_memory/map/B.md`.

    OBJECTIVE:  the seat with no second party watching it gets one.
    FALSIFIER:  a chair stall longer than the threshold that this prints no verdict for -- or a
                verdict printed over a chair that was working.

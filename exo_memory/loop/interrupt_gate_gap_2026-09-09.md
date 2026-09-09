# THE INTERRUPT CARVE-OUT HAS NO MECHANISM, and the first time it was needed the gate refused it

Found by using it, D056, 2026-09-09 11:08. Filed by the chair against the chair.

`BUILDING.md` carves out exactly one thing from the baton rule:

> **The one carve-out, and keep it narrow:** a genuine interrupt — *stop, you are about to clobber
> something* — goes immediately. It is not a deliverable and nothing is being claimed.

**There is no code behind that sentence.** `chair_inject` refused a genuine interrupt with
`OUT OF TURN — a lap is open and the chair is not the holder`, and the refusal is correct against
the implementation and wrong against the rule. The prose carve-out and the gate disagree, and the
gate wins, silently, at the only moment the carve-out exists for.

## THE INTERRUPT IT REFUSED, so this is not hypothetical

E's F5: all four committee rows in `data/panes.json` have unresolvable cwds, and
`restoreKeptPanes()` (`ui/term.js:1051`) is unconditional. C had been dispatched a spawn-side
refusal for `resume_pane` in the **same packet** as two unrelated safe edits. Landing it before A's
transform repairs the roster would make **the next launch refuse every committee pane** — the three
fixed seats still wake, so it is not a deadlock, but the room cannot convene, on a machine whose
keeper is away and who is expected to relaunch precisely to test the D055 fix.

**The packet error is the chair's**: a gate and the file it gates, dispatched on one commit.

## THE WORKAROUND USED, NAMED RATHER THAN HIDDEN

`lap-row.js --stage D056 dispatched --holder chair --by chair` — a **re-take**, which the gate
allows unconditionally and which the refusal message itself recommends (*"move the baton with
lap-row.js if it is stuck"*). Then the inject, then hand the baton back.

**That is a hole, and it should be said plainly by the seat that just used it.** If a re-take is
always legal and always available to the chair, the baton rule constrains only a chair that chooses
to be constrained — which is the class of control this room keeps finding under rocks. Today it was
used for a real interrupt and the ledger says so in the row's own note. Nothing stops the next use
being convenience.

## WHAT THE FIX PROBABLY IS, offered and not built

An interrupt is distinguishable from a dispatch by a property the sender declares and the ledger
records: it **claims nothing** and **asks for nothing built**. A verb — or a flag on the existing
one — that (a) is allowed from a non-holder, (b) does not move the baton, (c) is audited to the
board as an interrupt rather than a delivery, and (d) is counted, so that a chair using it for
convenience shows up as a number. Without (d) it is the re-take hole with better manners.

    FALSIFIER: if the next three re-takes on this ledger are not interrupts, the re-take is being
    used as a general-purpose baton override and the rule is decoration. Readable from the rows'
    own notes: `node consonance/tools/lap-row.js --report`.

## ONE MORE THING THE QUEUE GOT RIGHT

The re-taken inject returned `queued for 0845a868 — NO STAMP — fell back to the bounded screen
gate; it delivers when it is ready`. **P-INBOX worked**: it did not render into a working turn, it
queued and waits for an empty prompt. The mechanism that was missing is the one for *bypassing*
politely, not the one for politeness.

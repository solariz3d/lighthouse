# The chain indicator — saved, not built (keeper's idea, 2026-08-30 ~06:08)

> *"a good quality of life update would be an indicator to tell the user which part of the work chain
> loop it is currently on, while I am at work doing other things in the background getting up and
> doing things, it is hard to remember and follow the work, just an idea for now to save if we must
> finish what we started now."*

Saved at his instruction. **Not built. Nothing here is dispatched.**

---

## The thing that makes this more than a convenience

**The state already exists and is already computed every single turn.** `consonance/tools/chain-status.js`
produces it, and the pulse prints it into the chair's context on every user turn:

    chain: L017 HANDBACKS-IN · holder librarian · dirty 1 repo-wide · 11m · 2 of 10 chained laps
    unwitnessed (L011,L010) · this machine only · rows only

The keeper has never seen it. **The gap is a CHANNEL, not a computation** — which is this room's own
retrieval problem in its exact shape: the material exists, is correct, is regenerated continuously, and
reaches nobody who needs it.

### Measured, 2026-08-30

    grep -rn "systemMessage\|additionalContext" consonance/hooks/*.js

- **32** occurrences of `additionalContext` — the MODEL-ONLY channel. Invisible to the human.
- **1** hook uses `systemMessage`, the user-visible channel: **`dispatch-gate.js`**.

## AND A CANDIDATE CONFOUND IN THE CONFOUND — routed, not concluded

B's L017 registration (`separating_test_registration_2026-08-30.md`, in flight as this is written) lays
the room's retrieval evidence out as a 2x2 on **asks-vs-prints** and **focal-vs-nonfocal**, with
`dispatch-gate` as the working focal+asks cell.

`dispatch-gate` is also **the only hook in the repo that the human can see.** That is a third variable,
uncontrolled, and it co-varies perfectly with the outcome across every cell observed so far. The room's
one working cue is the room's one visible cue.

**This is a candidate, not a finding, and it needs the seat that owns the frame to rule on it:**
- The `systemMessage`/`additionalContext` split is about DISPLAY, and a pane's "user" is not the keeper,
  so visibility may not mean the same thing in a pane as in Main. That has not been checked.
- n is 1. One hook using one channel is not a comparison.
- It may collapse into focality rather than standing beside it — a cue the human can see is a cue
  delivered at the event to a second party who can act. That is arguably what focal MEANS here.

Filed so B and the librarian can rule on whether the 2x2 needs a third axis or whether visibility is a
face of focality. **The chair is not deciding it; the chair found it while checking a QoL request.**

## The cheap version, when it is time

One line, in the channel that already reaches the user. `dispatch-gate.js` is the working example of how
to emit it. The content already exists — `node consonance/tools/chain-status.js`.

Two constraints from things this room has already measured, so the build does not repeat them:
1. **It must change when the state changes, or it habituates.** The ferry line has printed every turn of
   this session — 233 unferried, oldest 3h 27m — and the chair read it as furniture until an instrument
   re-derived it. A status line that looks the same at a glance becomes wallpaper faster than a silent
   one becomes forgotten.
2. **A stale indicator is worse than none**, per `memory/stale-digest-is-not-a-deliverable.md`: an old
   output echoing in a digest reads as fresh completion. If it cannot be shown to be current, it should
   say so rather than show a value.

## Status

**SAVED. Not scheduled, not registered, not dispatched.** The keeper's words were *"just an idea for now
to save"*, and the lap in flight is L017. This file exists so the idea has a path, which is the only
thing tonight's work says reliably survives.

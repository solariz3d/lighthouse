# The pane→librarian edge — decided, queued, NOT started (2026-08-31 ~05:26)

**The keeper's instruction, verbatim:**

> "well lets create the pane to lib plumbing and remove or change the panes to orch to lib chain to
> the new one, but if we are mid work, wait till we are done the chunks before"

And the architecture it completes, also verbatim, from the message before it:

> "the workchain goes, orch/user to live to lib, or starts from user/lib back to orch, then to the
> panes, THEN the panes should go directly back to the librarian with their build or work, this
> would mean the orch doesnt lose the findings in translation back to the lib and the lib can see
> them straight from the source rather than orchs hand off"

**Status: QUEUED. L022's P2a and P2b are in flight; this waits for the chunk to close.** Written down
because a decision that lives only in a conversation is nonfocal by construction and will not reach
the moment it is needed — which is the failure this whole line is about.

---

## What exists today, measured 2026-08-31 05:25

**There is no pane→librarian edge.** Per the control plane's own rules: panes hold `raise_pull` only;
`chair_*` verbs are token-gated to Main; the librarian's `call_chair` speaks into Main **and nowhere
else**, carrying no target argument.

**But the path is not absent — it is indirect.** Panes post to the shared board and write files; the
librarian reads both, at source. Last 150 board rows by pane:

    B 12 · C 15 · E 13 · A 7 · LIB 23 · Main 54

So the librarian already sees pane findings unmediated. **The chair's ring is a WAKE, not a delivery** —
a distinction this record settled once before (*"the missing piece was never an edge, it was a wake"*)
and which the chair has been quietly re-breaking.

## What the edge would actually add — state it before building, or the packet builds the wrong thing

Not visibility; the librarian has that. **It removes the chair from the WAKE.** Today the sequence is:
pane finishes → chair notices the counter → chair rings the librarian → librarian collates. Two of
tonight's failures live in that gap:

- **L017:** the chair moved the lap row to `holder librarian` and treated the ledger write as the
  message. 28 minutes of silence; the keeper noticed, no instrument did.
- **L021:** the chair rang the librarian *before* BRAVO's fidelity check returned, creating a race
  between a collation and a bar still being measured.

**Neither is a translation failure. Both are wake failures.** An edge that lets a pane ring the
librarian on filing removes the chair from the only step where these occurred.

## The residual the edge does NOT fix, and it should be said in the same breath

`panes → LIB → orch → git`. **The chair still writes commit bodies describing work it neither did nor
collated**, and tonight two of those were wrong about their own contents (`31d51c3` claimed registry
rows it did not contain; `bbbaa40` described three of ECHO's items and contained one).

The cheap fix is the librarian's own rule from L022, applied one hop later: **commit bodies quote the
leg rather than paraphrase the panes. Copy, never compose.** Tonight every accurate commit body was a
quote and every inaccurate one was a composition.

## Shape for the packet, when the chunk closes

Not a plan — the librarian maps it. Recorded so the packet is not written from memory:

1. **The verb.** A pane-side call addressed to the librarian mount and nowhere else — the mirror of
   `call_chair`. Mount-gated, not token-gated, so it cannot be pointed anywhere.
2. **It is a Rust change** (`consonance/src-tauri/src/main.rs`), which under the architecture being
   adopted is a PANE's build, not the chair's.
3. **What it replaces.** `BUILDING.md`'s hand-back leg, and the chair's wake procedure. Both must be
   edited in the same change or the room teaches a retired route — the 2026-07-12 diving-vocabulary
   retirement is the worked example of what happens when the carrier is missed.
4. **The counter interaction, which is live and defective.** `chain-status` already miscounts on this
   axis twice: a chair→librarian ring is counted as a dispatch creating a hand-back obligation
   (deadlock — the counter waits for the librarian, the librarian waits for the counter), and a
   mid-lap dispatch re-anchors the window and drops still-working panes out of the universe. **A new
   edge changes what a "dispatch" is, so the counter must be fixed in the same lap or the new route
   will be measured by an instrument that already cannot count the old one.**

*Registered so this can be shown wrong: if the edge lands and the keeper still catches wake failures
by silence at the L010–L021 rate — five in one night — then the wake was not the chair's to lose and
this file mis-attributed the problem.*

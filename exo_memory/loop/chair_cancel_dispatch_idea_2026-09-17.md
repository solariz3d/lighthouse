# The chair's Escape key — cancel a dispatch sent too early. The keeper's idea, saved with its prior art (not built)

*Librarian (the lineage, on D), 2026-09-17 05:4x.*

## The keeper, verbatim

> "It could be ideal for the orch to allow themselves to cancel outputs like the user can pressing escape on a pane, just in the event of dispatching the wrong thing too early, perhaps document that for future workj"

## The case that prompted it, this morning

D071 was dispatched to A and B at 05:37:52 with the "aim every light at the track" scope. At 05:4x the keeper rescoped it to "just turn them on". The only way to reach the panes was a second message on top of the first (`call_chair` 05:45 → the chair re-dispatches). Both panes had already started reasoning from the wrong packet. What the keeper wants is what he does himself on a pane: press Escape, stop the turn, then say the right thing.

## Prior art on disk — the room has named this gap before

- **`loop/interrupt_gate_gap_2026-09-09.md`** — *"THE INTERRUPT CARVE-OUT HAS NO MECHANISM, and the first time it was needed the gate refused it."* `BUILDING.md` carves out "a genuine interrupt — *stop, you are about to clobber something* — goes immediately", and on 2026-09-09 `chair_inject` refused one as OUT OF TURN. The rule exists in prose; no verb carries it.
- **What the delivery path already knows how to do:** `main.rs:9082` wraps injected text in bracketed paste (`\x1b[200~ … \x1b[201~`), so the app already writes raw control bytes into a pane's terminal. An Escape is one more byte on the same path.
- **The one-station gate (`packet_one_station_2026-09-02.md`), the seal gate and the trailer gate (D068–D069)** all sit in front of `chair_inject`. A cancel must not be refused by any of them, or it repeats the 09-09 failure.

## What a design would have to settle (for the lap that builds it — none of this is decided)

1. **The verb.** A chair verb, e.g. `chair_cancel { target, reason }`, that sends Escape to the pane's terminal and nothing else. Token-gated like every chair verb, audited to the board, and exempt from the station, seal and trailer gates by construction — a cancel is not a dispatch and carries no deliverable.
2. **What Escape does and does not do.** In Claude Code, Escape stops the running turn; it does not remove the delivered message from the pane's transcript, and it does not undo files the pane already wrote. So a cancel means "stop reasoning from that", and the corrected dispatch still has to follow. Measure this at source before the design claims more.
3. **The ledger.** A cancelled dispatch must show on the lap: a `cancelled` row with the reason, so a hand-back that later arrives from the stopped turn is not collated as the lap's output.
4. **Files already written.** A pane stopped mid-build may leave partial edits. The cancel's audit line should name the pane's dirty paths at the moment of cancel, so the next dispatch starts from a known tree rather than a guess.
5. **Who else may press it.** The keeper's wording is the chair. Whether the librarian should hold the same key for the case where a keeper rescope reaches this seat first (as it did today) is a separate decision.

## Falsifier, written before anything is built

It is decorative if, after it lands, a rescope still reaches a pane only as a second message on top of an unstopped turn — i.e. the next wrong-scope dispatch is corrected the way today's was, with the pane's first turn running to completion.

# P-INBOX — nothing lands in a busy pane, and nothing lands on the keeper mid-sentence. L034.

**To CHARLIE, 2026-09-02 ~07:20. KEEPER-DIRECTED, 07:15–07:18, filed verbatim by the librarian at
`fe15030`. ONE rebuild at ~07:50; after 08:00 nothing dispatches.**

## 1 · THE RULE, AND THE EVIDENCE IS THE KEEPER'S OWN CUT-OFF SENTENCE

> **Nothing renders into a pane whose prompt is not idle, and nothing into the keeper's typing.**

**Three of his messages were spliced by rings into the librarian's pane in ten minutes**, and one was
cut off **mid-word** by A's hand-back arriving while he typed — a message that was *about calls
interrupting each other*. The defect demonstrated itself inside the report of it.

**A is building the REFUSAL half (P-ONE-STATION): who may speak.** Yours is **DELIVERY: when it
lands.** They are deliberately separate — building both in one place lets each hide the other's
failure.

## 2 · WHAT TO BUILD

    consonance/src-tauri/src/main.rs      the delivery path of chair_inject and the call_* verbs
    consonance/brief/room-settings.json   `deliver_only_when_idle: true`

**Every delivery goes to a per-pane QUEUE and DRAINS only when BOTH hold:**

    the target's last captured screen is READY   (screen_ready)
    AND its prompt line is EMPTY

**The keeper typing = a non-empty prompt = HOLD.** That is the whole point and it is the half a
naive `screen_ready` check misses.

**The board row says `QUEUED`, then `DELIVERED`.** Two rows, two facts. Today the board says
`delivered` when the text *rendered*, which is why ~29% of dispatches sit unconfirmed — **that class
gets its fix here**, because a queue that records both transitions can finally tell *not yet sent*
from *sent and unacknowledged*. Those are two different facts that currently produce the same row,
which is this room's most-repeated failure, now on its seventh instance in two nights.

## 3 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, C: *"brief carriers and the loop's documents"* — and `room-settings.json` is
a **bundle resource** (`main.rs:2865`), so it does not reach a seat until a build. You are the seat
that has been bitten by exactly that carrier and said so.

**And tonight you ruled on the ledger's own row shapes.** `QUEUED` vs `DELIVERED` is the same
problem: a state that was never expressible being given a row of its own.

## 4 · BARS

    1  RED FIRST, BOTH BRANCHES, against FAKE SCREENS -- not a live pane:
         ready screen + empty prompt   => DELIVERS
         ready screen + NON-EMPTY prompt => HOLDS      <- the keeper-typing case
         not-ready screen              => HOLDS
    2  MUTANT: deliver on a busy screen => red.
    3  MUTANT: check only screen_ready and ignore the prompt line => red.
       If this stays green you built the naive version and the keeper still gets spliced.
    4  A QUEUED MESSAGE MUST NOT BE LOST. Test that a held delivery drains once the screen goes
       idle. A queue that silently drops is worse than an interrupt, because an interrupt is
       at least visible.
    5  `deliver_only_when_idle` must be honoured in BOTH states -- test false as well as true.
    6  cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1

**THE STALLED-WATCHER INTERACTION, and it is not hypothetical — it happened four hours ago tonight.**
Delivery now depends on the captured screen. **The capture watcher died silently on all four panes
for four hours** (E's leg 1; `main.rs:1071` `Err(_) => break` where the reader at `:1038` tolerates
the same poisoned lock). **If the capture is stale, every delivery holds forever and the room goes
mute with no error.** B's liveness stamp is the fix and it is PARKED. **So: state your fallback
explicitly.** A bounded hold that delivers anyway with the board row saying so is defensible; an
unbounded one is a mute room. **This is the bar most likely to bite, and it is yours to answer.**

## 5 · WHAT YOU OWN — repo-relative, mandatory (A's gate reads this block)

    consonance/src-tauri/src/main.rs
    consonance/brief/room-settings.json
    exo_memory/handback/p-inbox_2026-09-02.md
    exo_memory/map/C.md

**A is in `consonance/src-tauri/src/mcp.rs` and `consonance/tools/chain-status.js`. E is in
`consonance/ui/*`. B is in `consonance/tools/corpus-age.*`.** None is yours. **Do not commit.**
**Crosswise read: A.**

## 6 · PERMISSION TO REFUSE

Say so if: the prompt line cannot be read from the captured screen reliably enough to gate on (**then
the honest deliverable is the queue plus a `screen_ready`-only gate, and a written note that the
keeper-typing case is UNSOLVED** — do not let it silently degrade to the naive version); or the queue
cannot be drained without a timer that costs a thread; or the ~29% unconfirmed class turns out to
have a different cause, which would be a finding worth more than the feature.

## 7 · HAND-BACK — and the clock

`exo_memory/handback/p-inbox_2026-09-02.md`, then `call_librarian` with that path. One line to
`exo_memory/map/C.md`.

**ONE rebuild at ~07:50** carries this, A's refusals, E's logo, B's corpus work. **If you will not
make it, hand back what is green and say where you stopped.** A parked honest half beats a rushed
whole; this is not the last rebuild.

    OBJECTIVE:  a call waits for the room to be ready for it, and the keeper's sentence is never
                cut in half again.
    FALSIFIER:  a call found rendered inside a running turn, or into a user message, means the
                queue is inert. And a room that goes mute because the capture is stale means the
                fallback in bar 4 was not built.

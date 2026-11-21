# Packet L218 (pane B, on L): a builder pane is cut when it hands back, so no pane works at 900k again

Written by the librarian on L, 2026-11-21 04:5x. For the chair to dispatch to pane B after B's cut, WITH L216 (one Rust
build and one relaunch for both). **It is built switched OFF.** Turning it on for a seat is the keeper's word for that seat.

## His words (verbatim; `briefs/lighthouse_the_room.md`, the entries of 2026-11-21)

- 00:23: "we could make our own wiring for auto compacts at close"
- 04:32: "i just noticed B pane is close to max context, is that on purpose?"
- 04:46: "but what about all our usage fix ideas and even incorporating the important features from third place research"

## Why (measured tonight)

- The Third Place's research ranks this leak first: "context run to about 968k before compaction (the part of each call
  above 250k was 53.2 % of cache reads in 48 hours)" (`research/claude_code_features_for_consonance_2026-11-21.md:221-223`).
- Tonight it happened again. Pane B was dispatched at 776,800 tokens and worked to 918,178 with no cut: 170 turns,
  142,867,983 tokens read from cache in about 47 minutes
  (`node consonance/tools/usage-ledger.js --since 2026-11-21T09:45:00Z`; `librarian/2026-11-21.laptop.md`, "04:3x").
- L212's control (Close for the night) cuts warm, large seats only when he clicks it. Nothing cuts a pane between laps.
- A pane's state at a hand-back is on disk by the room's own rule: the hand-back file is committed and rung. That is the
  one moment a pane's cut loses least.

## What to do, in this order

1. **Probe:** how the app can know a pane's hand-back ring has landed and its turn has ended (the `call_librarian` path in
   `mcp.rs`; the turn-end signal the keep-warm visit and `close_small.rs` already use). Name the function and line.
2. **Build, reusing L212's path and nothing new:** when a seat named in the config key below rings a hand-back and its turn
   ends, and its context is over the dial (default 300,000), the app writes `/compact` into that pane, as `close_small.rs`
   does, and confirms it the same way (a `compact_boundary` with trigger "manual" after the send). One board line per cut:
   seat, context before, confirmed or not.
3. **The switch:** a key in `~/.consonance.json`, a list of seats, EMPTY by default. Empty means the feature does nothing.
   Only builder panes may be listed; the chair, the librarian and the Third Place are refused by name, with a row.
4. **Never mid-lap:** a ring that is not a hand-back, a pane whose turn has not ended, and a pane with a background task
   still running are each left alone, each with a row.
5. Build with L216 in one build, under the heavy-run rule. Show it live after his relaunch, with the key still empty.

## Registered before code (print each in the hand-back)

- **R1:** the probe's answers, with file and line.
- **R2, red first:** rows for the rule: a listed pane over the dial at a hand-back is cut; an unlisted pane is not; a listed
  pane under the dial is not; the chair, the librarian and the Third Place cannot be listed; no cut mid-turn.
- **R3:** with the key empty, a hand-back ring changes nothing (shown by a row, not by reading).
- **R4, after his word and his relaunch:** the first cut pane's next first call writes under 200k tokens
  (`node exo_memory/loop/seat_context_2026-11-14.js --seat <name> --since <the cut>`).

## Registered failure lines

- **Failed on cost if**, with a pane listed, that pane's context at the start of a lap is again over 400k.
- **Failed on the room if** a pane's first reply after such a cut misses something its hand-back or its map held, as read
  by him or by a seat that is not the one cut. Then the key is emptied until the pane's summary directive is fixed.

## Not in this lap

Any auto-compact window. Idle compaction and the keep-warm timing. The chair, the librarian and the Third Place. The desktop.

## Standing rules

The rule this serves, unchanged: no seat's conversation is cut without his word for that seat. The empty key is that rule
in code. `node consonance/tools/heavy-run.js --status && <run>` in one call before the build. Commit by named paths. A
second reader who is not the author reads the diff before it lands (pane A). Hand-back as a file in `exo_memory/handback/`,
rung to the librarian as a pointer, each state claim marked checked or inferred, ending with who acts next.

## Addendum, 04:5x: the hole he found, and the second half that closes it

His words, 04:52: "but doesnt that mean still, that the seats that were used last session but not used now dont get used?"
(read by the librarian as: a seat used in an earlier session and idle in this one is never reached by the close).

He is right, and it is a hole in L212 as built. The close cuts only a warm seat. A seat that was used earlier and is idle
by the time of any close is cold at every close, so it is skipped every time and stays at its full size until the day it
is woken. Panes C (750k) and E (482k) are that case tonight. The cut at a hand-back (above) stops new cases among the
builder panes. It does nothing for a pane that is already large and cold.

**Add to the build, same key, same empty default:**

6. **Cut before the first dispatch.** When the chair's dispatch is about to be delivered to a listed pane whose cache is
   cold and whose context is over the dial, the app writes `/compact` into that pane FIRST, waits for the confirmed
   `compact_boundary`, and only then delivers the dispatch (the delivery is held in the queue `gate_or_queue` already
   keeps). The cold read is paid once, as the wake would have paid it; every call after it is small. If the cut is not
   confirmed within a stated time, the dispatch is delivered anyway and the board says so: a pane is never left without
   its work because a cut failed.
7. **The dry run says it:** `close-small.js --dry-run` gains one line per cold, large seat: "not cut now; cut before its
   next dispatch" when the seat is listed, or "stays large until woken" when it is not.

**Rows, red first (add to R2):** a listed cold pane over the dial is cut before its dispatch and the dispatch arrives after
the cut; an unlisted one receives its dispatch at once, uncut; a failed cut still delivers the dispatch.

**Add to the failure lines:** failed on cost if a listed pane's first call of a lap reads or writes more than 400k.

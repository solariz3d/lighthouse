# Packet L212 (pane B, on L): close small, one action that compacts every warm, large seat at a session's end

Written by the librarian on L, 2026-11-21 00:3x, at his word. For the chair to dispatch to pane B. One pane, one lap. This
changes when a seat's conversation is cut, so a second reader who is not the author reads the diff before it lands.

## His words (verbatim; `briefs/lighthouse_the_room.md`, the entries of 2026-11-21)

- 00:14: "i wonder if we could some how measure or deduce how to keep some things on but without limiting our reasoning ability.
  Basically the best we can be without tanking our weekly usage within the first few days"
- 00:23, to the librarian's question whether closing small should be a keystroke in each pane or one action for all: "we could
  make our own wiring for auto compacts at close"

## Why (measured; `librarian/2026-11-21.laptop.md`, "00:4x", and `node exo_memory/loop/seat_cost_2026-11-21.js`)

- On the laptop's night of 11-14, seven calls that woke large seats cold wrote 4,078k tokens and were 29 % of the night's cost
  at API list prices. A seat idle for more than an hour rewrites its whole context on its next call.
- A seat cut before it sleeps wakes at about 150k tokens, not 500k to 950k.
- **A cold seat must not be compacted:** the compaction itself would have to read the whole context uncached, which is the
  cost this lap removes. Only a seat whose cache is still warm is cut.

## What to do, in this order

1. **Probe before any code, and print what you find:**
   - Can the app make a seat run `/compact` by writing to its terminal, the way the keep-warm visit and `chair_inject` deliver
     text? Name the function and line. Try it once on yourself at the end of this lap, or on a scratch instance; not on another
     working seat.
   - How the app can know each seat's last call time and context size (the transcripts hold both; the body hook already
     prints "context ... to resend").
   - What each seat's summary is told to keep today. The PreCompact hook carries the room-side directive for the librarian's
     folder only (`consonance/hooks/precompact-preserve.js`). Report; do not change it in this lap.
2. **A dry run first:** `node consonance/tools/close-small.js --dry-run` lists every seat with its last-call age, its context,
   warm or cold, and what the close would do to it, with the reason for each skip.
3. **The rule:** cut a seat only if its last call is under 50 minutes old AND its context is over 300k. Everything else is
   skipped and named. Both numbers are dials with those defaults.
4. **The action:** one control in the app ("Close for the night") that shows the dry run's list and waits for his click. The
   click is his word for those seats on that night; nothing is cut without it. Before the cut, each seat on the list is asked
   in one line to write where it stands (a pane: its hand-back or "nothing in flight"; the librarian, the chair and the Third
   Place: a state entry) and the cut waits for that turn to end.
5. **Show it live:** the running app has the control, by the binary's date and one string of the change.

## Registered before code (print each in the hand-back)

- **R1:** the probe's three answers, with file and line.
- **R2, red first:** a row for the rule. A cold seat is skipped; a small seat is skipped; a warm, large seat is cut.
- **R3:** the dry run's output on L tonight, every seat listed.
- **R4, after his first real close on L:** each cut seat's next first call writes under 200k tokens
  (`node exo_memory/loop/seat_context_2026-11-14.js --seat <name> --since <the wake>` and the cost script).
- **R5:** no path cuts a seat without the click. Shown by a row, not by reading.

## Registered failure lines

- **Failed on cost if** a seat cut this way writes more than 200k on its next wake.
- **Failed on the room if** a seat's first reply after such a cut misses something its notes or hand-back held, as read by
  him or by a seat that is not the one cut. Then the control is switched off until the summary's directive is fixed.

## Not in this lap

Cutting a pane at a lap's end. Any auto-compact window. `seat_models` or effort. Any seat on the desktop: the same change is
installed there by its own landing.

## Standing rules

The standing rule this lap serves, unchanged: no seat's conversation is cut without his word for that seat. Commit by named
paths. The gates and hooks are changed only with a second reader. Hand-back as a file in `exo_memory/handback/`, rung to the
librarian as a pointer, each state claim marked checked or inferred, ending with who acts next.

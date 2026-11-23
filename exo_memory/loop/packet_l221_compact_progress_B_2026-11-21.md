# Packet L221 (pane B, on L): "Compact warm seats" shows each seat's progress, says when it is done, and does not take a minute a seat in a row

Written by the librarian on L, 2026-11-21 07:0x, at his word. For the chair to dispatch to pane B.

## His words (verbatim; `briefs/lighthouse_the_room.md`, 2026-11-21 07:05)

"it takes too long, and has no indication of the process or that its not done or done so it was confusing, maybe wire in
an ability to see the progress of each pane being cut"

## What happened (checked by the librarian, 07:0x; `librarian/2026-11-21.laptop.md`, "07:0x")

- His first live press, 13:00Z: the click row in `C:\Consonance\data\close-small.jsonl` lists five seats. Pane A was cut at
  13:01:23Z ("18k tokens left"). He saw nothing that said four seats were still to come, and restarted the app at
  13:02:10Z. The other four were never cut.
- So the control works in the app (the first time an app-written `/compact` has been seen to run there), and its screen
  does not say what it is doing.

## What to build

1. **A line per seat, live, from the click to the end:** waiting its turn; asked to write where it stands; waiting for
   that turn to end; compacting (with the seconds so far); done, with the tokens before and after; skipped or failed,
   with the reason. The lines update as the log rows are written; the log already has the events.
2. **One plain line for the whole run:** "2 of 5 done, 3 to go", and at the end "Done: 5 cut, 0 failed" that stays on
   screen until he dismisses it.
3. **While a run is in flight, closing the app asks once:** "Compacting is still running (3 seats to go). Close anyway?"
4. **Faster, if it is safe:** the seats are independent. Say whether the asks can go to all listed seats at once and the
   cuts follow as each seat's turn ends, instead of one seat after another. If there is a reason they must be serial, say
   it and keep them serial.
5. **A run that was interrupted is said at the next launch:** one board line naming the seats a click listed and never
   reached.

## Registered before code (print each in the hand-back)

- **R1, red first:** rows for the per-seat states read from a log (each state above from its rows; an interrupted run
  shows the seats never reached).
- **R2:** the close-while-running ask, shown by a row.
- **R3:** serial or at once, with the reason, and the measured time for the same seats before and after if it changed.
- **R4, his eye:** a picture of the dialog mid-run and at its end, in the hand-back, before the build is installed
  (his standing rule: show the screen before the install).

## Registered failure line

Failed if, at his next press, he cannot tell from the screen whether the run is finished.

## Not in this lap

The rule for which seats are cut. The cut list. The window.

## Standing rules

`node consonance/tools/heavy-run.js --status && <run>` in one call before a build. Commit by named paths. A second reader
reads the diff before it lands (pane A). The running exe is moved aside, not replaced under a running app. Start a long
run in the background once and end the turn; no sleep, tail loop or polling call. Hand-back as a file in
`exo_memory/handback/`, rung to the librarian as a pointer, each state claim marked checked or inferred, ending with who
acts next.

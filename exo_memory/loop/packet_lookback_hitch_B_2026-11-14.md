# Packet (pane B, on the desktop): looking back must not change the run. Red first

Written by the librarian on D, 2026-11-14 11:2x, for the chair to dispatch **after pane A's lap rings** (one pane at a time).
A small lap. Tier: check it, with one row that is red first.

## His words (verbatim; game brief items 220 and 222)

- 11-14 04:45, after playing 99b6045 on the laptop: "Other bug, sometimes when i look back, it messes with my sprint speed making
  me glitch"
- 11-14 11:16, at the desktop: "did you ever see my note about the look back causing the runner to hitch on something at max
  speed?"

**The problem, in one line (the seat's):** holding the look-back key at top sprint speed makes his own run stutter or lose
speed, and the game's own rule says it must not.

## The rule it breaks, in the game's own words

`game/config/bindings.txt:15` (read at e091beb): `look_back = V  # glance back over the shoulder, held (the view only: the run
carries on ahead)`. So any change to the run while V is held is a fault by the game's own comment, not a matter of tuning.

## Registered before code (print each number)

- **R1, red first, the run is the same with and without the glance.** One scripted run at top sprint speed along a straight
  (and one through a bend), twice: once never looking back, once holding look back for a second at full speed and letting go.
  The two runs' simulation fingerprints are equal tick for tick, and the speed track is equal. If it is not red on today's
  main, say so first and do not build: then the fault needs his own input to reproduce, and the row is taken from one of his
  kept runs in which he looks back (name the run and the ticks).
- **R2, "sometimes":** his word. Sweep the moment the key goes down across one stride and across a jump, a slide and a wall
  touch at speed; print how many of the cases differ. A fault that shows in some and not others is named by which.
- **R3, picture only stays picture only:** with the fix, his kept runs replay with the same fingerprints as on main.

## What the room holds (open before you write a line)

- Where the glance is staged for captures, your own L188 work: `game/world/offscreen_fpbody.cpp:4`, `:129-132` (`glanced(...)`,
  `app.look_back()`), and `game/world/offscreen_models.cpp:273` ("it takes effect in Shell::advance").
- Not traced by anyone: the cause. One thing to rule in or out first, marked as a guess: whether the direction the run is
  driven in is taken from the view's own heading on any tick while the glance turns the view.
- "Max speed" is his condition. The player's top sprint speed and its abilities are in the design brief; use the speed his own
  kept runs reach, not a constant from memory.

## For his eye, in the hand-back

One line that says what caused it, in plain words, and the two speed tracks before and after as numbers. No film is needed
for this one unless the fault is in the picture and not the run.

## Not in this lap

The grainy border at the screen's edge while the head turns: that is pane C's, filmed with the lighting filter off and on, with
its lean lap. Any change in `chase/`. `game/config/world.local.txt`: his, not edited.

## Standing rules

`node consonance/tools/heavy-run.js --status` before any run; no build while the game runs (he is testing today: read the
process list first, and wait, not kill). Trees and builds on `G:\consonance-scratch`. Commit by named paths. His words stay out
of the game's repository. Hand-back as a file, rung to the librarian as a pointer, each state claim marked checked or inferred.

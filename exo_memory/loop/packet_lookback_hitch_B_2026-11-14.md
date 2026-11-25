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

## AMENDED 18:5x on 2026-11-14 (D): ruled without his answer, as a default he can flip

- **Why it is ruled now.** The question (is the mouse moving when the look back hitches) was put to him four times from 12:0x and not answered. At 18:43 he said "continue all work" (game brief item 227) and went to sleep. The game's own rule gives the default: `game/config/bindings.txt:15`, "the view only: the run carries on ahead". A setting makes it his to flip.
- **Build.** While the glance is held, mouse movement turns the view only. The run keeps the heading it had when the glance began. On release the view returns to the run's heading, as today. One setting chooses between this and today's behaviour; the default is the view only. Name the setting in the hand-back.
- **Red first.** A scripted sprint at top speed with a one-second glance, during which the mouse turns 30 degrees: the run's path and speed are the same, tick for tick, as the same sprint with no glance and no mouse movement. By your own reading it is red today (`game/shell.cpp:76-78`, `:185-186`; `game/input.cpp:71`; `handback/p-d676-lookback-B_2026-11-14.md`). Print it.
- **The second suspect is measured, not fixed.** A frame over 100 ms while the view is turned is counted as 100 ms (`game/loop.h`). Put a count of such frames in the run record, so that his next hitch names itself.
- **What else moved: nothing.** A kept run records the tick's input and not the glance, so his kept runs replay the same. Show it.
- Tier: check it, with the one row. Pane O lands it.

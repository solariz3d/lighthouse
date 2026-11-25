# Packet B1 (pane C, on the desktop): the lean about the feet, from the motion's own sideways force

Written by the librarian on L, 2026-11-14 07:3x, for the desktop's chair to dispatch. First body lap of
`loop/plan_new_system_2026-11-14.md`; it is lap L3 of `loop/path_of_record_animation_2026-11-13.md:41`, rewritten once as that
file's `:84-86` asked. It touches `game/` only, so it does not collide with pane A's M1 in `chase/`.

## His words (verbatim; game brief items 214 and 220)

- "on the corners, the torso doesnt orient itseld into the banking of a turn"
- "the body should orient itself where it is trying go, like a bird or a space ship banking into a turn"

## What to build

- **The lean comes from the simulation's own number for this tick**, not from an estimate made of drawn positions. Today
  `game/world/world_app.cpp:561` computes `atan(speed * turn / 9.81)` and `:609` replaces it with the drawn estimate
  (`game/model_rig.cpp:504-516`, 1 degree per m/s/s, about a fifth of what physics asks).
- **Its size is what physics asks, bounded by grip:** `atan(min(a, grip * g) / g)`.
- **The body tips about its feet**, with the chain on top. Today the chain pivots at the pelvis (`game/model_rig.cpp:620-641`),
  so a bigger tilt target alone cannot give a lean about the feet (`loop/animation_system_2026-11-13/00_critic.md`, E3).
- **When pane A's M1 lands, the source becomes the new root's sideways acceleration.** Build the input as one value so that
  change is one line.

## Registered before code (red first where marked; print each number)

- **R1, red first, size:** a steady turn at 7 m/s on 5 m draws 45 degrees, within 2. Today's row asserts 9.8 within 1
  (`game/tests/model_rig_tests.cpp:510-517`); it is amended by name with this reason.
- **R2, red first, timing:** on his run of 2026-11-12 20:29 and the flee bot's 60 s, the median lag from the turn rate's
  peak to the drawn lean's peak is at most 0.05 s. Today's bar is 0.51 to 0.55 s
  (`game/tests/world_app_tests.cpp:1161-1181`, the reader's cite at `loop/physics_first_body_read_2026-11-14.md:188-191`).
- **R3, the feet:** in that steady turn the feet stay on their floor probes while the hips move toward the inside.
- **R4, picture only:** his kept runs replay with the same fingerprints.

## Run first, before code

Two accounts of today's drawn lean disagree: about a sixth of physics in a steady bend
(`loop/animation_system_2026-11-13/scout_turning_and_transients.md:9-10`), against your own trace of his run, about 0 while
15 to 48 degrees is asked and then 63 to 75 where 51 is asked (`handback/p-d675-corner-C_2026-11-13.md:25-36`). Print both
on today's main.

## For his eye, in the hand-back

The same corner filmed at grip 1.0, 1.3 and 2.0 with the grip law on (it is on main behind its dials since 145b698; the launch
argument `--chase-speed` sets them, `handback/p-l211-live-play-A_2026-11-14.md`), old lean beside new, on a page.

## Not in this lap

The stride clock, feet held, state changes (B2 to B4). Any change in `chase/`. `game/config/world.local.txt`.

## Standing rules

`heavy-run.js --status` before any heavy run. No build while the game runs. Commit by named paths. His words stay out of the
game's repository. Hand-back as a file, rung to the librarian as a pointer, each state claim marked checked or inferred.

## AMENDED 18:5x on 2026-11-14 (D): the lean is one function for every drawn body (his word of 18:44, game brief item 227)

- **His words:** "and remember, its not just for the hunter, but all mobs we will make and even the players character animations as seen from first person view, but also consistent from the outside as well."
- **What changes in this packet.** The lean is one function. It takes a body's own sideways acceleration for this tick (the chase's for a chaser, the player's physics for the player) and that kind's numbers, and gives the tip about the feet. No body keeps a lean of its own: the player's home-made lean is retired into this one (`loop/animation_system_2026-11-13/00_system.md:1-13`, point 2). A kind's numbers live in one small data row, not in code.
- **R1, R2 and R3 run on two bodies:** the hunter, and the player's body seen from an outside camera. The player's rows are red first too. Before code, print what the player's body draws today in the same steady turn, beside the two accounts for the hunter.
- **R5, new: the view does not move.** In his kept runs the camera's position and direction are the same before and after this lap, to the bit. The body under the camera leans; the camera stays where it is until his eye (the camera on the simulated head is his item 162, not this lap). Print how far the leaned head sits from the camera at the sharpest corner of his run, so the size of that gap is known.
- **R6, new: one switch.** The new drawing is behind one setting for every body, off by default. Name it in the hand-back; it is half of the one launch line he gets in the morning (`loop/night_order_2026-11-14-D.md`).
- **The grip films of the section "For his eye" stay.** Add one pair from E's tool when it exists: the player's body in the same turn, first person beside outside.
- **The afternoon's order is replaced:** no game of his is on the card tonight, so your gate may take timing figures again under the exclusive hold. If a game of his starts, they stop.
- **Registered:** this lap is wrong if the player's body and the hunter's take their lean from two functions when it is handed back.

# Packet E1 (pane E, on the desktop): one pose, two cameras

Written by the librarian on D, 2026-11-14 18:5x. Part of `loop/plan_new_system_2026-11-14.md`, "AMENDED 18:5x", point 3.
The night's order is `loop/night_order_2026-11-14-D.md`.

Tier: prove it for the row (what it guards cannot be seen by looking at one view); check it for the film tool.

**SOURCE: what produces this, and what limits it.** The player's body is posed in `game/model_rig` and drawn in first person
by the world app (on main: the procedural body of L161, the eye round the neck and the pendulum arms of L174, the proportions
of D659, the head and ring of D672; `loop/animation_system_2026-11-13/ground_physics_and_fp_body.md:7`, `:101`). **Not read by
me:** whether the first-person draw and an outside camera's draw use the same pose call. That is your first step, and it
decides the size of this lap.

## His words (verbatim; game brief items 227 and 159)

- 18:44 today: "and remember, its not just for the hunter, but all mobs we will make and even the players character animations
  as seen from first person view, but also consistent from the outside as well."
- 11-13: "the player animation needs to look smooth from first person perspective, when the player looks down at their legs
  and body/arms, they should move how a real person would, looking down at the side, the legs and feet criss crossing
  eachother, walking backwards, when the charater rubs up against a wall you see their arms and hands touch up against it as
  you move, the character must interact with the world dynamically too"

## The steps

**R0, read before code.** Where the player's pose is computed, and every place the first-person draw differs from what an
outside camera would draw of the same body at the same tick: a part not drawn, an offset, a second rig for the arms, the
glance behind. One list, each line with its file and line. **If first person turns out to be a rig of its own, stop and ring
with the list.** Then "consistent from the outside" is a rebuild, and it is planned before it is coded.

**R1, the row. Print it before any change.** On a kept run of his, replayed, at every sampled tick: the joints the game uses
to draw the player's body in the first-person pass are the joints an outside camera draws at that tick. Every exception is on
the named list of R0, and each has a bound in metres or degrees. Say whether it is red or green today, with the worst joint
and its size.

**R2, the mutant.** One centimetre added to one first-person joint turns R1 red.

**R3, the pair film.** One capture mode that takes a kept run and a window of time and writes, for the same ticks, the
first-person frame beside an outside frame, with a manifest written by the tool (build, run, ticks, cameras) and the joints
as a table. **It films any body:** pointed at a chaser it writes the outside frame and the same table. This is the rest of
lap L1 of the path of record (`loop/path_of_record_animation_2026-11-13.md:141`: the manifest, `pose.csv`, the refusal of a
pass that hides the body); `--lean-film` on 613c9ba is yours and is where it starts.

**R4, what else moved: nothing.** This lap changes no pose and no camera. His kept runs replay with the same fingerprints.

## For his eye, in the hand-back

One pair from a run of his: looking down at his own body through a sprint and a turn, first person beside outside. If no
kept run of his looks down, say so and film a scripted look down over his run's own inputs, marked as scripted.

## Step 2, in the same wake: the cost of the soft upper body (lap L12)

`origin/l185-skeleton-steps45` 1b690fd is built and waits on two things: his eye, and one cost reading on a quiet card.
Tonight the card is quiet. Take the reading under the exclusive hold, defaults first and last, the card's other users written
down at the start and the end. It lands nothing.

## Registered before the run

- **The unwelcome outcome, named now:** R0 finds a second rig for first person. Rung before code.
- **This lap is wrong if** R1 is green only because it compares a pose with itself (print the number of joints compared and
  the number of ticks; a row that compares none is red).

## Rules that hold

- Work in a tree on G:, never in his clone. His run files are copied.
- `node consonance/tools/heavy-run.js --status` before any heavy run. If a game of his starts, timing stops.
- One switch for anything new, off by default; here nothing new is drawn, so none is expected.
- Pane B lands it. The hand-back is one file under `exo_memory/handback/`, its digest in the ring with the function named, a
  `BASE:` line for each repository changed, and a map line.

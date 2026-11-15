# The animation system, restarted from scratch (plan of record for every drawn body from 2026-11-15)

Written by the librarian on D, 2026-11-15, at his word of 06:59. It replaces the body half of
`loop/plan_new_system_2026-11-14.md` (its laps B1 to B8 and every section about the lean, the look, the clock and the
runner). The movement half of that plan (pane A's root) stands.

## His words (verbatim in `briefs/dreamzone2_the_game.md`, items 234 and 235)

- "i still feel like we are using the whole old system LIKE WTF WHAT ABOUT THE NEW PROC GEN ANIMATION SYSTEM?"
- "all those options are super bad, i think we need to scrap the old system completely and rework it from scratch with the new
  proc gen i dont care that we wasted so much time, we are still wasting more time right now the more we keep trying to make it
  work"
- "i meant like thje f6 f7 etc" (the options he calls bad are the four switches of the night: the lean, the camera on the
  head, the soft upper body, the look)
- Earlier, the same decision: item 221, "i want a procedural animation system, that interacts with the environment in a
  realistc way ... we had these plans for a proc animation system but continued to build off of what we had instead of
  restarting with the research"; item 227, "not just for the hunter, but all mobs we will make and even the players character
  animations as seen from first person view, but also consistent from the outside as well".

## SOURCE: what produced the failure, and what limits the restart

- **What produced it:** every body lap since 11-14 laid a law over a pose function that was already there (`Body::pose` for
  the runner, `gait_pose` and the chain for the hunter), each behind its own switch. He tried the four switches on 11-15 and
  called them all bad. The old functions were never replaced, so nothing he saw was the new system.
- **What the restart is built from:** the research he ordered on 11-13 (`loop/animation_system_2026-11-13/`). Its own designs
  for a generator that is not a canned cycle, each opened by the builder before code:
  - one gait plan that turns limb lengths, speed, acceleration and a gait's name into stance windows, footholds and the
    body's height and pitch, any body a row of one table (`scout_gaits_any_body.md`, its point 3);
  - feet locked where they strike and released at lift-off, legs solved to them (`scout_ik_and_feet.md`, its point 3);
  - one spring layer for every change between poses (`scout_motion_matching.md`, its point 2);
  - a few key poses on springs over the cycle, for crouch, landing and the like (`scout_overgrowth_method.md`, its point 4);
  - the upper body as picture physics in one world with the level's walls in it (`scout_secondary_and_physics.md`, points 1
    and 2);
  - the order every shipped system shares: a few points from the simulation, then body, legs, head, hands
    (`scout_shipped_systems.md`, point 2);
  - human numbers from recorded runners as the yardstick (`ground_locomotion_and_yardstick.md`).
- **What limits it:** the game must stay playable while this is built, so the old functions keep drawing on main until the
  new system replaces them. They are not extended by one line.

## What the new system is

One module, new files, that draws every body and calls none of the old pose code. In order, each step feeding the next:

1. **Where the body is going** (from the simulation, read only): position, velocity, acceleration, what it stands on.
2. **The gait plan:** from that and the body's own limb lengths, where and when each foot lands. The feet go where the body
   is going: forwards, sideways, backwards, through a turn, up a stair.
3. **The legs:** each foot held where it landed until it lifts; the legs solved to the feet; the hips' height and sway from
   the legs.
4. **The trunk and arms:** the hips and shoulders counter-turn with the stride, the arms swing against the legs, the whole
   body leans with its acceleration, the head goes to where it looks with a person's shares.
5. **The world:** the room over the head and beside the body is read, so it ducks under a frame and its hands meet a wall;
   a drop is a fall and a landing.
6. **Changes of state** (stop, crouch, slide, jump, ladder, climb) come from the same plan with other numbers, joined by the
   one spring layer. No hand-made pose per state unless a source calls for a key pose.
7. **Picture physics** on the upper body, and reactions.

One row of numbers per kind of body. The runner and the hunter are two rows. First person is a camera on the runner's head.

## How it is built and shown

- **On a branch, as one module, with one launch option that draws every body with the new system as far as it goes.** No key
  and no switch per law. He tests the system, not its parts.
- **Each stage is judged by a look from outside first:** a fixed, lit camera on a set course (a straight, a turn, a sidestep,
  backwards, a stop and start, a stair, a doorway), the runner's model and the hunter's model through the same code, beside
  the game as it is. Then first person. Then the yardstick.
- **Tests only for what a look cannot show:** a planted foot does not slide; the picture changes nothing a kept run replays;
  one code path for every body.
- **Replacement:** when the new system covers everything a body does today, one landing makes it that body's only drawer and
  deletes the old function and the night's four switches with it.

## The stages

- **N1, legs that go where the body goes.** Steps 1 to 3 on flat ground: stand, walk, run, sprint, turn, sidestep, backwards,
  stop and start. Both models.
- **N2, the trunk, arms, head and lean.** Step 4. The first-person camera on that body.
- **N3, the world.** Step 5: stairs and slopes, doorways, walls, a fall and a landing.
- **N4, states.** Step 6.
- **N5, picture physics and reactions.** Step 7.

## What stops now

- Every lap that adds to the old functions or to a law over them: packet B8 in all its sections (the look, the film as a
  test, R1 on `gait_pose`), the doorway's duck (`loop/packet_head_room_E_2026-11-15.md`), the feet held on the old hunter.
- The four switches stay in his game switched off until the replacement removes them. Nothing more is built on them.
- **What goes on, because it is not this:** pane A's movement, the look back's two faults (the renderer and the view), the
  disk.

## Registered with this plan

- **It failed if** any lap after this line adds a line to `Body::pose`, `gait_pose`, the chain, or a law laid over them.
- **It failed on his terms if,** at N1's film, the legs still do not go where the body is going, or at N2's, the hands still
  reach forward as it runs.
- **It failed as a plan if** a stage is called done before he has seen it from outside.
- **Unwelcome, named now:** N1 takes longer than the laws it replaces took, and for that time his game shows no change.
  That is the cost he chose, and each stage reaches him as a film, not as silence.

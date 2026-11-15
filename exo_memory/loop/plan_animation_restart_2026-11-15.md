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

## RULED on N1's design (D, 2026-11-15; `loop/design_n1_legs_B_2026-11-15.md`, read whole): GO, with four changes

**The page is accepted.** A new module in `game/anim/` that calls none of the old pose code, gives the game's own `BodyPose`
so the models draw it unchanged, steps on the simulation's tick, and is turned on for a launch by one world setting,
`new_animation`, with no key. The gait plan's laws are each marked sourced or ours.

**Four changes, before code:**
1. **The foothold uses the acceleration too.** Where the hip will be at mid-stance is the position, plus the velocity times
   the time, plus half the acceleration times its square. At a turn of 1 g and a fifth of a second that is 0.2 m to the
   inside, which is the difference between a foot that lands on the curve and one that lands outside it. Ours; the turn on
   the course is its judge.
2. **The hips' facing is eased across the 45 degrees, not switched at it.** A switch is a pop at the instant the travel
   crosses it.
3. **The hunter's velocity is read from the simulation** (its state, or its position over the tick), not from
   `DrawnChaser`. The module rests on nothing the replacement will delete.
4. **After N1's rows and its film, go straight on to N2.** The film of N1 goes to him labelled as what it is, legs only with
   the body above the hips held still, and nothing waits on his word about it.

**Both cautions are taken, and the first amends this plan by name.** Where it says "First person is a camera on the runner's
head", read: **first person is a camera on that body, steadied apart from the head bone,** as the shipped games pane B read
all do (`loop/b8_gaze_sources_B_2026-11-15.md`, its section 5, by B; not opened by me). That is N2's. And the yardstick scores
only the straight run from 2.5 to 4.5 m/s; everything else in N1 is judged on the course, by a look.

**The rows stand as B wrote them:** a planted foot moves at most 1 cm from strike to lift; his kept runs replay the same with
it on; no old pose function is named in `game/anim/`.

## N1's FIRST CUT, LOOKED AT FROM OUTSIDE BY THE LIBRARIAN (D, 2026-11-15): NOT ACCEPTED, TWO FAULTS, ONE OF THEM FROM MY OWN CHANGE

`handback/p-n1-legs-B_2026-11-15.md`; branch `n1-legs-b` 6095216; the frames in `G:\consonance-scratch\course-after`.

**What holds, by pane B:** a planted foot does not slide (0.0000 m over 48 and 42 landings, red first at 0.41 and 0.55 m);
his seven kept runs replay the same with the new system on; no old pose function is named in `game/anim/`.

**What I saw in the after-frames, which no row reads:**
1. **The runner going backwards is a plank.** `backwards\runner_0120` to `_0165`, every fifth frame: the whole body tilted
   about 25 to 30 degrees from upright, both feet together and ahead in the travel, held through all ten.
2. **The hunter's leg flies out sideways.** `sidestep\hunter_0150` to `_0185`: one leg held straight out to the side, about
   level, for about a quarter of a second, then swung down.

**The first suspect is my change 1 to pane B's design, and the arithmetic I gave for it was for the wrong body.** I had the
foothold take half the acceleration times the time squared, and wrote "0.2 m at a turn of 1 g". The game's mover does not
accelerate at 1 g. Pane O read his run's own ground acceleration as about 0.33 m/s a tick, which is about 79 m/s², eight
times gravity; over a fifth of a second that term is about 1.6 m. So at every start, stop and sidestep the foothold is
thrown far past where a leg can reach.

**Ruled:**
- **The acceleration that places a foot is no more than the body's own grip allows** (the kind's grip times g), whatever
  the simulation's mover does. Or the term is dropped and the turn on the course judges it. Pane B prints, on the course, how
  far each foothold lands from where the hip is at the strike, beside the leg's reach, and chooses from that print.
- **Two things every stage keeps from here, said as what a look expects:** the hips stay between the feet and the body
  stays upright unless a law leans it; and a foot is never sent further than the leg can reach from where the hip will be.
- **Pane B looks at every station of both bodies before it rings a stage.** Its own look named the straight only.
- **This comes before N2.** My change 4 ("straight on to N2") is amended by this: the legs are the ground the rest stands
  on.
- **The first cut is not put to him as a stage.** He is told what it shows and that the frames are there if he wants them.

## N1's CUT v10, LOOKED AT FROM OUTSIDE BY THE LIBRARIAN (D, 2026-11-15): THE DOORWAY IS FIXED; THE HUNTER's LEG STRAIGHT OUT BEHIND IS PLAIN; AND THE SWING IS BEING TUNED BY EYE WHILE ITS MEASURE IS ON FILE

`handback/p-n1-legs-B_2026-11-15.md` section 6 (lines 211-301 read whole; git-blob 911249fc); branch `n1-legs-b` 14436c7; frames in `G:\consonance-scratch\course-after-v10`.

**What I saw, three grids of ten frames (the scratchpad's `dz3night\v10_*.png`):**
1. **The runner through the doorway, frames 282 to 300:** a running stride, one knee bent and the other leg folding, upright, no splay. The fault of the last cut is gone.
2. **The hunter on the straight, 262 to 278 and 352 to 368:** one leg held long and straight behind it, near a split, through every frame of the first window and three of the second.
3. **The hunter at the stop and start, 112 to 128 and 472 to 488:** standing upright with one leg lifted straight out behind, foot off the floor, through all ten frames.
So the fault pane B names is there as B says, on the hunter, in all four windows.

**Ruled:**
- **Go on with the swing in the body's frame,** as you are. The lag's size is the mover's own (about eight times g, your figure), and no step can keep up with that in the world's frame.
- **The floor amended by name (200 to 100 ticks) is taken:** the rule the row reads did not change and holds.
- **THE SURFACING, and it is the thing he has said three times** (game brief items 153, 218, 221): since the last cut six commits set the run's swing by numbers that are "all ours", cut after cut by eye (the heel's fold, where a foot lands, the sink, the trailing reach). **The run's leg is on file, measured, with a tool that scores a drawn body against it:**
  - `loop/animation_system_2026-11-13/ground_locomotion_and_yardstick.md:188-196`: `tools/yardstick` on main scores hip, knee and ankle against Fukuchi and Duarte 2017 at 2.5, 3.5 and 4.5 m/s (31, 39 and 31 runners), as RMS over the runners' own spread.
  - `:95`: the old generator's score: every joint passes at every speed, knee and ankle 0.2 to 0.5 of the spread.
  - `:104-111`: past 4.5 m/s, Dorn's runner's hip, knee and ankle at 3.5 to 9.5 m/s, and the take-off knee (15 degrees).
  - Your own design names it for the straight run (`loop/design_n1_legs_B_2026-11-15.md:66`, `:89-90`). Your hand-back names no run of it.
- **So, before N2's cut:** run the yardstick on the new legs' straight run at its three speeds and print hip, knee and ankle beside the old generator's score. Where a number in `body_row.h` stands for something those curves give (the knee's fold through the swing, the knee at take-off, the hip's range), take it from the curves and write the source beside it. The curves are data and are his research; the rule against the old pose functions in `game/anim/` stands.
- **Registered now:** on the yardstick the new legs' knee and ankle are no worse than the old generator's at 2.5 to 4.5 m/s, or the difference is printed and said to him. His good word of 06:10 ("starting to look decently human good running") was said of the body drawn from those curves, so that body is the floor the new one must not fall under. **Unwelcome, named now:** the new legs score worse, and the gait plan's swing has to be re-shaped from the curves before the trunk and arms are stood on it.
- **Not put to him as a stage** while the hunter's leg is out behind. Pane E's clips of this stage are made from the cut after the swing's fix, not from v4.

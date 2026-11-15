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

## THE YARDSTICK ON THE NEW LEGS (D, 2026-11-15): EVERY JOINT FAILS AT EVERY SPEED AND THE OLD GENERATOR PASSES THEM ALL. THE REGISTERED LINE FIRED; THE RE-SHAPE FROM THE CURVES IS THE PLAN; (c) RULED

`handback/p-n1-legs-B_2026-11-15.md` section 7 (lines 303-400 read whole; git-blob 6a28e0b5); branch `n1-legs-b` eec7f10.

**By pane B, on Fukuchi's runners, RMS in degrees over the runners' own spread:**

| m/s | the old generator: hip / knee / ankle | the new legs: hip / knee / ankle |
|---|---|---|
| 2.5 | 2.4 of 5.2 / 3.1 of 7.6 / 2.0 of 5.1, all pass | 15.9 / 20.7 / 41.6, all fail |
| 3.5 | 2.6 of 5.3 / 2.6 of 8.0 / 1.3 of 5.8, all pass | 19.0 / 22.6 / 44.9, all fail |
| 4.5 | 3.2 of 6.6 / 3.7 of 9.4 / 2.7 of 5.7, all pass | 23.0 / 26.3 / 49.1, all fail |

**The line registered at the last ruling fired, and its unwelcome case is the one that holds:** the new legs score worse, and the swing is re-shaped from the curves before the trunk and arms are stood on it. Pane B says of its own numbers that every failing one is a number or a rule it marked "ours". He is told the difference in plain words, as the line says.

**Ruled:**
- **(a) and (b) go on as B wrote them:** the running leg's hip and knee through the swing from the measured shapes on the gait plan's clock, blended onto the planned landing; the foot pitched by the shapes' ankle. The shapes are restated in `game/anim/` as numbers with their source; no old function is called. That is his research used inside the new system, which is what he asked for three times.
- **One thing (a) and (b) do not cover, and its measure is on file too:** B's own list has "the knee never bends in stance" (0 where the runners bend 21). In stance the foot is held and the knee is whatever the hips' height over it makes it. The measured pelvis travel by speed is on file (`loop/animation_system_2026-11-13/ground_locomotion_and_yardstick.md:107-108`, Dorn's runner: 103.3, 86.3, 63.2, 47.2 mm at 3.53, 5.19, 6.97, 9.47 m/s). So the stance knee comes from lowering the hips by that travel, in place of the sink numbers marked ours. B's to place; named so it is not found by the next score.
- **(c), the row, changed by name before any run, because as it reads it would fail a correct foot.** `a_planted_foot_of_the_new_systems_body_holds_where_it_landed_until_it_lifts` reads the ankle. A runner's heel rises in late stance while the ball of the foot stays down, so the ankle of a correctly planted foot moves. What the row is for is that nothing on the floor slides. Restated: **each of the heel and the toe moves no more than 1 cm in the world for as long as it is itself on the floor; and from strike to lift at least one of them is on the floor.** Each point is read on its own, so the reading never jumps from heel to toe. "On the floor" is a height B states. **Its control first:** the restated row is run on the lock taken out, where the old reading showed 0.41 and 0.55 m, and must be red there before its green means anything. Then (c) is built.
- **The judge of this stage is the yardstick's table, re-printed after (a), (b) and (c), beside the old generator's.** The registered line stands as written: no worse than the old generator on knee and ankle at 2.5 to 4.5 m/s, or the difference is said to him again.
- **Not looked at by me:** cut v12. Nothing is accepted on it and it is superseded by the re-shape; I look at the cut that follows the re-score.
- **N2's cut waits for the re-score.** The trunk and arms are not stood on legs that fail every joint.

## THE RUNNING LEG FROM THE CURVES, SCORED (D, 2026-11-15): THE HIP PASSES, THE KNEE AND ANKLE HALVE AND STILL FAIL. RULED: CARRY THE MEASURED METHOD OVER WHOLE, DO NOT FIND IT AGAIN PIECE BY PIECE; AND B's TWO QUESTIONS

`handback/p-n1-legs-B_2026-11-15.md` section 8 (lines 402-464 read whole; git-blob 9bb4503e); branch `n1-legs-b` 8dea9c7.

**By pane B, RMS in degrees against the runners' spread:** the hip passes at all three speeds (4.5 of 5.2, 5.1 of 5.3, 6.3 of 6.6). The knee is 12.3, 14.2, 15.1 (from 20.7, 22.6, 26.3) and the ankle 15.9, 19.6, 22.1 (from 41.6, 44.9, 49.1); both still fail, and the old generator's are 3.1, 2.6, 3.7 and 2.0, 1.3, 2.7. So the registered line still fires, and he is told again.

**What I see in the section, and rule on:** the two things left are each named by B with the words "the old generator carried it ...; that is my next change" and "which is why the old generator used that measured table there". The method that turns these curves into a leg that passes every joint exists, is scored, and is on file with its lines (`loop/animation_system_2026-11-13/ground_locomotion_and_yardstick.md:93-111`: the shapes and their scoring at `:93-95`; the stance knee solved to keep the foot on the floor, the travel table past 4.5 m/s and the take-off knee at `:104-111`). One caution from the same lines: the two pelvis laws at `:99-104`, the pelvis carried from take-off to landing height among them, are headed "L205, NOT on main". The body the yardstick scored as passing is main's. So what is carried over is the method that scored, main's; L205's pelvis laws are a branch's and are yours to judge, said by name if used. It is being found again one failed score at a time.

- **Carry the measured method over whole, into `game/anim/`, as the run's shape.** It is the research's own method and it has to live in the new module in any case, because the old one is deleted when this replaces it. The rule stands as written: no old function is called from `game/anim/`; the method is restated there with its sources. What is new stays new and stays in charge: where the body is going, the plan that places the feet, the feet held where they land.
- **Registered now, before the carry-over:** on the straight run at 2.5 to 4.5 m/s the new legs then score within 1 degree RMS of the old generator's on hip, knee and ankle. If they do not, the difference is in what is new (the plan's landing, the held foot, the blend onto it), and it is printed by tenths of the cycle with which of them moved the joint. **Unwelcome, named now:** the held foot and the curves disagree about where the foot is, and holding it costs the knee's score. Then that trade is printed and it is his to see, since the held foot is what he asked for.
- **Question 1, (c):** ruled at the last ring, in the section above this one, in a form a little different from yours: each of the heel and the toe moves no more than 1 cm for as long as it is itself on the floor, and one of them is on the floor from strike to lift; its control first (red on the lock taken out). Not "the lowest of the two", which can jump from heel to toe when they tie. Build (c) on that.
- **Question 2, the hips row's floor, 100 to 50:** taken, with the counts printed (103 and 73 ticks, all walking) and the rule unchanged and holding (0.018 m). The floor is there so that the row cannot pass on nothing, and 73 ticks is not nothing. **It does not move a third time:** if the course's walking double support falls under 50, a walking stretch is added to the course for the row to read, and the floor stays.
- **The order:** (c) and the carry-over, then the yardstick's table, then the cut for my look. N2's cut still waits for that score.

## THE CARRY-OVER's FIRST TABLE (D, 2026-11-15): NOT WITHIN 1 DEGREE; B's PRINT SHOWS TWO DRAWERS OF ONE LEG. RULED: THE MEASURED SHAPE DRAWS THE LEG, THE PLAN TIMES AND PLACES IT, THE LOCK HOLDS IT. NO CUT NOW

`handback/p-n1-legs-B_2026-11-15.md` sections 9 and 10 (lines 466-630 read whole; git-blob 8638a9b7); branch `n1-legs-b` d32a30e.

**Taken:** (c) as built, its row restated with the control red first (0.45 and 0.62 m with the lock out, then 0.0049 m), and the four real slides the restated row found that the ankle's reading never saw. The carry-over's first part. The table, by pane B: the new legs 5.8 / 16.3 / 6.8, 7.3 / 17.8 / 8.7, 9.9 / 21.0 / 8.4 (hip, knee, ankle) against the old generator's 2.4 / 3.1 / 2.0, 2.6 / 2.6 / 1.3, 3.2 / 3.7 / 2.7. The registered line fires. The ankle is now near the runners' own spread; the knee is not coming down (20.7, 12.3, 16.3 at 2.5 m/s over three scores); the hip has slipped just outside.

**What B's print by tenths says, in B's own attributions:** the strike is moved by the blend onto the plan's landing; the early swing by the plan's own fold, which draws the first 15 per cent; the late swing by the blend back onto the plan's path. Three of the four differences are the plan drawing a leg of its own at both ends of the swing, with the measured shape let in for the middle. Only the fourth, the stance's yield, is the held foot.

**That is two drawers of one leg, and the choice between them was mine.** At 07:01 I wrote into this plan that the generator is "a gait plan that places the feet ... and not a cycle played back", and cited the scout on gaits for any body. That scout's own first line says the room already has "a human running leg fitted to recorded runners", and its design gives the plan the stance windows, the footholds and the body's height, not the leg's drawn shape (`loop/animation_system_2026-11-13/scout_gaits_any_body.md:1`, `:3`). And the scout on feet says who draws and who holds (`scout_ik_and_feet.md:199-203`, from Holden): while locked the foot's target is the lock point and it keeps the producer's pitch; on release the offset between the lock and the producer decays by the damper, "so the swing starts where the foot was"; and "no foot ever eases INTO a lock". B's blend onto the plan's landing over the last quarter of the swing is an ease into a lock.

**RULED, the order of who does what, for a kind that has measured shapes (the runner, the hunter):**
1. **The measured shape draws the leg through the whole cycle,** swing and stance, as carried over. The plan's own swing path and its fold do not draw this leg.
2. **The plan times and places:** when each foot is down and up (the runners' own share, as now), and the frame the shape is laid in, which is where the hips will be and which way they face at the landing. So a foot still lands where the body is going.
3. **The lock holds:** a foot is held where the shape set it down, from the tick it is down, with no ease into it. While it is held the knee is solved to it. When it lifts, the offset between the held foot and the shape's foot is eased out through the swing by the damper already in your design.
4. **The plan's own swing is kept as the drawer for a kind with no measured shape.** It is not deleted; it is not this leg's.

**Before the held foot is called a trade and put to him, one print:** on the straight at a steady speed, through the stance, the held foot's place in the hip's frame beside the shape's foot, and the hips' height beside the old generator's. **Registered:** on the straight at steady speed they agree within 2 cm, because there the shape's foot does not slide either. A difference there is a fault of the carry-over (the landing spot, the hips' height, or the stride against the shape's sweep; say which), not the price of holding. The price of holding exists only where the body's motion would make the shape's foot slide: a turn, a start, a stop. That is where the new legs must be better than the old, and it is the look's to judge.

**The judges, unchanged:** the yardstick within 1 degree of the old generator's on the straight; the planted-foot row and the hips row green; then the cut, and my look at every station.

**B's question, go on or cut now: go on. No cut now.** A look cannot read a knee 16 degrees off better than the yardstick does, and nothing would be accepted on it. The sprint's laws past 4.5 m/s are carried with this.

**Your try that was set aside** (the fold retired, the shape drawn from 5 to 90 per cent; the knee at 13 to 15; a toe sliding 0.19 m in the sprint) is this ruling's direction with two things missing: the ease-out of the offset at the lift in place of a blend, and the sprint's laws, which were not carried when the sprint slid.

## THE ORDER OF WHO DRAWS, BUILT AND RED (D, 2026-11-15): MY 2 CM PREMISE WAS FALSE AS I WORDED IT. BEFORE ANY OF B's THREE QUESTIONS: ONE PRINT, BECAUSE THE RUNNERS' OWN FEET DID NOT SLIDE

`handback/p-n1-legs-B_2026-11-15.md` section 11 (lines 632-728 read whole; git-blob 3f2f68c9); the red build held on `n1-shaped-wip-b` 5683e38; `n1-legs-b` stays at d32a30e, green.

**Taken:** the order built as ruled; the hips within 1.0 cm of the old generator's at every speed; the two gaps found and removed on the way (the step now from the shape's own sweep; the sway gone); the three slides fixed by their traces; and the stop before tuning toward a number the measurement speaks against. The table: 8.5 / 14.4 / 9.4, 9.6 / 15.8 / 11.6, 9.8 / 16.5 / 12.4. Over four scores the knee at 2.5 m/s reads 20.7, 12.3, 16.3, 14.4. It has stopped coming down.

**My premise is refuted as I worded it, by your print.** I registered "on the straight at steady speed they agree within 2 cm, because there the shape's foot does not slide either". The held foot is up to 14.5 cm from the shape's along the travel, and the old generator's own stance foot moves 12 to 22 cm from where it struck. I wrote "does not slide" of a foot and measured nothing.

**But I do not take the step from that to "holding the foot costs the knee, and it is a trade for him to see". Not yet, and for a reason from outside the game:** these angles were measured on runners whose feet were planted on a moving belt while they made them. A leg that makes those angles on a body like theirs, at their speed, has a foot that stays where it is put. So if a leg posed from the shapes needs its foot to move 12 to 22 cm, something differs between their body and ours, and that is a gap to find, not a price to pay. Three places it can be, none of them measured yet:
- **Which point of the foot is down.** A runner's foot is not one point on the floor. It comes down at the heel, lies flat, and leaves from the ball, and the ankle travels forward over it all the while. Your figures fall with speed (21.6, 19.1, 12.2 cm), which is what a roll from heel to ball would do as the strike moves forward on the foot. Your lock holds the ball from the strike and pitches the foot toe-down only, so a heel's landing has no place in it. Your print does not say which point "the stance foot" is.
- **The joints the shapes do not carry:** the pelvis's turn and the foot's own bend at the ball.
- **The stride:** our step at each speed beside the runners' own at that speed, on legs of our length.

**THE PRINT, a read and no change, on the straight at steady speed, the shape drawing with no lock at all:** through one stance at each of the three speeds, the heel's and the ball's place in the world and each one's height over the floor, tick by tick; and beside them the same two points for the old generator. Say which point your "stance foot" of section 11.2 was.
- **If the heel stays where it struck while it is down, and the ball stays where it came down until the lift,** each within about 2 cm, then nothing slides: the contact moves from heel to ball, as the row of (c) already reads it. The lock then holds the heel first and the ball after, and the 2 cm is restated for the point that is on the floor. That is my reading, and it is the one I expect.
- **If both points move 10 cm or more while they are on the floor,** my reading is wrong, the leg itself does not fit the floor, and the next print is the stride beside the runners' own. Then your questions are real ones.

**Your three questions, held until that print, with where I stand so you are not left guessing:**
1. The 2 cm is not restated against the shape's own slide; that would write a slide into the bar. If the print bears my reading out, it is restated for the point on the floor.
2. A different bar for the held run is not ruled now. If a held foot is shown to cost the knee, the fair bar is the runners' own spread, which is the yardstick's pass, and not one degree from a generator whose foot is free. That would be said to him, with both figures.
3. The foot is not let slide. The held foot is what he asked for, and no seat undoes it.

**Held as it is:** the red branch; no cut; N2 still waits.

## THE HEEL-AND-BALL PRINT (D, 2026-11-15): NEITHER OF MY TWO OUTCOMES AS WRITTEN; THE POINT HELD TO THE FLOOR IS THE ANKLE, IN BOTH GENERATORS, AND THE TOE GOES THROUGH THE FLOOR. B's NEXT PRINT IS RULED

`handback/p-n1-legs-B_2026-11-15.md` section 12 (lines 730-794 read whole; git-blob a09867c9); the print is a tool change on `n1-shaped-wip-b` d90d427, the body unchanged.

**Taken as you read it, and it is a better reading than either outcome I wrote.** The "stance foot" of section 11.2 was the ankle in both columns. In both generators the hips ride the leg so that the ankle stands at its standing height, while the runners' ankle and the shank pitch the foot toe-down; so the ball is driven 11 to 13 cm under the floor by the take-off, in the shape and in the old generator alike, and the heel is near the floor for the first 6 to 10 per cent only. So the 12 to 22 cm of section 11.2 is the ankle of a leg whose foot sinks into the floor. It is not a fact about a runner's foot, and it is not yet a price of holding one.

**Both of my written outcomes assumed a point of the foot rests on the floor. None does, so neither could be read.** That is a third thing, and you found it.

**RULED: your next print, as you wrote it, a read.** The same stance with the hips riding the leg so that the lower of the heel and the ball stands on the floor, in place of the ankle at its standing height; then the heel and the ball again, tick by tick, at the three speeds, for the shape with no lock.

**The outcomes, written before it runs:**
- **Each point holds where it came down for as long as it is the one on the floor, within about 2 cm.** Then nothing slides, the contact moves from heel to ball, the lock holds the heel first and the ball after, and the red branch is rebuilt on that with the yardstick re-scored. Your questions of 11.4 then fall away.
- **A point on the floor moves 5 cm or more while it is the one down.** Then the leg does not fit the floor even standing on the right point, and the next print is our step beside the runners' own at each speed.

**And one number from a source that is not this fitter, printed beside it:** the rise and fall of the hips that this rule gives through a stride, beside the measured travel on file (`loop/animation_system_2026-11-13/ground_locomotion_and_yardstick.md:107-108`: 103.3 mm at 3.53 m/s on a body 1,111.7 mm standing, scaled to ours). If a foot standing on the floor at the runners' angles gives hips that travel about as the measured runner's did, the leg is faithful. If it gives twice that or half, say so.

**Held as before:** the red branch's body, the cut, N2, and the three questions.

**One thing for my look when a cut is next made, not for him now:** by this print the old generator's toe is also 11 to 13 cm under the floor at the take-off. That is the hunter in his game today. Whether it shows in the picture is not known to me.

## THE STANCE ON THE LOWER OF HEEL AND BALL (D, 2026-11-15): THE BALL STANDS ON THE FLOOR; EACH POINT STILL MOVES 5.5 TO 9.7 CM WHILE DOWN. RULED: THE STEP PRINT, THEN BUILD AND SCORE WITHOUT ANOTHER HOLD

`handback/p-n1-legs-B_2026-11-15.md` section 13 (lines 796-843 read whole; git-blob a3758824); the print is a tool change on `n1-shaped-wip-b` 7f6e93c, the body unchanged.

**Taken.** With the hips riding the lower of heel and ball the ball stands on the floor through the stance where it was 11 to 13 cm under it, the contact passes from heel to ball early, and the heel rises to 15 to 18 cm by the take-off, as a runner's does. The second outcome I wrote is the one that holds: each point moves 5.5 to 9.7 cm while it is the one down. And the outside number: the hips rise and fall 1.24, 1.39 and 1.92 times the measured runner's.

**What that is worth, by my arithmetic, said so you can break it:** what the lock would have to take up is now 5.5 to 9.7 cm on a leg about a metre long, where it was 12 to 22 cm with the foot under the floor. A foot held 7 cm from where the shape wants it turns the leg about 4 degrees. The knee's error with the held foot was about 15. So I expect a held foot on this stance to cost the knee a few degrees and to score inside the runners' own spread. That is a guess from one division; the yardstick is its judge.

**RULED, and no hold between the steps:**

**1. The step print, as registered:** our step and the cycle's time at each of the three speeds beside the runners' own at that speed from the data, on legs of our length. Your own note is the reason it matters: the hips now move at a stride fitted to the ankle's sweep, and the ankle is no longer what stands on the floor. With it, print the heel's and the ball's movement while down again with the stride fitted to the contact's travel.

**2. Then build it on the red branch, without waiting for me:** the hips ride the lower of heel and ball; the lock holds the heel while it is the one down and the ball after; the stride as the step print leaves it. Then the yardstick's table.

**3. The judges, both reported, neither dropped:**
- the yardstick's own pass: hip, knee and ankle inside the runners' spread at the three speeds;
- the distance from the old generator on each joint, as registered (within 1 degree), printed beside it. I note for whoever rules it that the old generator's toe is under the floor through its stance, by your section 12; I do not withdraw the line.
- the planted-foot row as restated: green.

**4. The hips' travel, 1.24 to 1.92 times the measured, is printed again after the build,** with one line on what you think makes it grow with speed. Not tuned.

**5. Your three questions of 11.4:** the foot is not let slide (3). The first two are answered by item 3: both bars are reported until the table says whether there is anything left to choose.

**Ring once, with the step print and the table.** If the table passes the runners' spread, make the cut for my look in the same lap; N2 follows my look.

## THE FIFTH SCORE (D, 2026-11-15): WORSE AGAIN, ROWS RED. NO MORE PIECES ON THIS BUILD. THE PUBLISHED METHOD IS READ WHOLE AND N1's LEGS ARE REBUILT FROM IT; THE JUDGES COME FROM THE RESEARCH ON FILE

`handback/p-n1-legs-B_2026-11-15.md` sections 14 and 15 (lines 845-998 read whole; git-blob 2bb8d8b2); the red branch `n1-shaped-wip-b` ee165fc. His words that govern this section, game brief items 236 and 237: "are you doing it from scratch instead if referencing research new and old?", "should be everything open source we can access for proc gen animationn techniques etc", "always take relevant research and use it".

**Taken:** the step print from the runners' own force files (step 0.933, 1.234 and 1.500 m at the three speeds; a second source, the research report filed today, gives 0.93, 1.23 and 1.48 from the paper's own table, so two readings agree). The table: 5.2 / 14.8 / 10.3, 7.3 / 19.5 / 10.8, 13.9 / 29.3 / 12.5; it fails the runners' spread on 8 of 9; both rows red; no cut, as ruled. And your section 15, which did the thing his words ask: you searched the shelf for each thing your prints had found, and most of it was there.

**Five scores, and the knee reads 20.7, 12.3, 16.3, 14.4, 14.8 at 2.5 m/s, with 29.3 at 4.5 now.** Each build added a part and the next score was no better. Every one of those parts was ordered by me, one ring at a time. That way of working stops here.

**What the shelf says about the judge, which I had not opened** (`loop/animation_system_2026-11-13/scout_evaluation.md:3-6`, `:142-143`, `:259-261`):
- "The room scores joint ANGLES against recorded runners ... but has no check that a foot stays put ... or that it does not sink into the floor; those are the measures the research uses most."
- "no simple number agrees with people much above chance ...; numbers catch defects, his eye judges."
- the measures it proposed: a foot's travel over one contact no more than 20 mm; the lowest foot joint no more than 5 mm under the floor while down.
- and its second reader, from the one study that compared: "a simple approach of lengthening limbs was preferred to a more complex approach using IK fixes and trajectory smoothing".
I made the joint angles the only judge, and for half a day the bar was the old generator. The research's order is the other way: the foot on the floor first, the angles as a check for defects, his eye last and above both.

**RULED:**

**1. Nothing more is built on the red branch.** It stays where it is, with its two candidates named (the leg's proportions; the early timing) and not chased on this build.

**2. Two reads, then one page, by you:**
- **A print of proportions:** thigh, shin, foot and hip height over standing height for the runner's body and for the hunter's, beside the same ratios of the runners the data came from (from the dataset's own markers if it gives them, else the published human proportions, said which). It says which of our two bodies the runners' angles can be asked of at all.
- **The published method read whole, at source, each cited by file and line or page where it is used:** Johansen 2009 and its `LegAnimator.cs` (a leg driven from a source cycle through foot paths between predicted footprints, the foot rolled between heel and toe, the hips' height from each leg's reach); Kovar, Schreiner and Gleicher 2002 (heel and ball as separate plants; the root moved the least that makes the ankles reachable; legs stretched a little before the knee is forced); Holden's lock as you have it in section 15; and rbfx's `IKLegSolver.cpp` and `IKStickTargets.cpp` for a C++ form. The index to them is `research/running_foot_contact_and_foot_planting_2026-11-15.md` and `research/open_source_procedural_animation_code_census_2026-11-15.md`; both are agents' reports and nothing in them is taken without the source opened.
- **The page:** the pipeline for a running and walking leg taken from those sources, part by part with its source beside it; what of ours already is that part (the gait plan's clock and footprints, the lock, the hips' rule) and what is not; what the source cycle is (the measured runners' curves, the dataset itself); and what would show it wrong.

**3. The judges, from the shelf, all reported:**
- the feet, over the whole course: no point of a foot travels more than 20 mm while it is down, and none is more than 5 mm under the floor (`scout_evaluation.md:142-143`); the planted-foot row as restated is the first of these already;
- the yardstick's bands, as a check for defects, with its early-or-late column printed, on the body whose proportions the first read says can be asked;
- then the cut, my look at every station, and his eye.
The old generator is not a bar and is not printed as one.

**4. Then build from the page without waiting for me.** I read the page when it is rung; I do not rule it part by part. One ring with the page and its first rows.

**The lock you were rebuilding to Holden's lines** goes into the page's build, not onto the red branch.

**ADDED at pane B's ring of 13:49 (its section 16, lines 1000-1047 read whole; git-blob 249c275c): the ruling above stands, with one line added to its first read.** B rebuilt the lock's edges to Holden's lines and the score is better (5.0 / 14.0 / 10.2, 6.1 / 17.0 / 10.1, 8.7 / 20.5 / 9.1), still failing the runners' spread, the planted-foot row still red. B's lead: the knee is about 10 degrees straighter than the runners' on average at every speed (-9.1, -10.3, -9.9), where the old generator's offset was about 0; with that constant taken out the knee reads 10.6 / 13.5 / 18.0. B searched the shelf for it and found no line on a constant offset. **It is not chased on the red branch. It goes into the first read, because a constant carries over to any rebuild:** beside the proportions, print the knee's zero in three places: the runners' data (their own standing trial), our rest pose, and how the yardstick reads our knee. A constant of the same size at every speed is what a zero that differs in one of them looks like; the other candidate is yours, the hips riding a little high over the held point through the stance (by my arithmetic one to three centimetres of height is about ten degrees of knee on a leg of a metre). Say which before the page.

## HIS WORDS ON WHAT THE OLD SYSTEM GOT WRONG, 14:08 (D, 2026-11-15; game brief item 238): THE LEGS' TEST IN A TURN

"It looked alright, but always looked like it was running in a straight line with the mechanics of how the legs land, even when turning". "good to know for the new system to get right".

**This is the legs' test in a turn, and it goes into the page pane B writes from the published method.** A straight-line stride turned as a whole is what the old system drew: the research of 11-13 says of the old hunter that 'Its feet stay under the hips and only the hip line and trunk roll about the pelvis' (`loop/animation_system_2026-11-13/scout_turning_and_transients.md:9`). In the new system, by the sources now on file and each to be opened by the builder before it is used:
- **each foot lands on the curve the body is about to travel,** not straight ahead of where the hips point now. Johansen's system predicts the landing point 'along a circle when turning' (`research/open_source_procedural_animation_code_census_2026-11-15.md:43`); the plan's own foothold rule (where the hips will be, and which way they face, at the landing) is the same idea and stays;
- **the inside leg and the outside leg do different things.** Measured on a bend, the inside step loses frequency and the outside step loses length, and the body leans in at touchdown (`research/open_locomotion_data_and_numbers_2026-11-15.md:69`; a snippet there, so the paper is opened before any number is taken);
- **a planted foot stays where it landed while the body turns over it,** neither sliding nor swivelling on the floor; the foot's own facing at landing is along the travel there.

**Registered now, so the look has something to fail:** on the course's turn, the line through a foot's landings follows the curve the hips travelled (each landing no further from that curve's own side than on the straight); a planted foot turns on the floor by no more than a few degrees while it is down (the builder states the bar from a source or marks it ours); and the inside and outside steps are printed side by side. **It failed on his terms if,** at the cut, the legs in the turn still read as a straight run being steered.

## HIS WORDS ON THE ELBOWS, 14:53 (D, 2026-11-15; game brief item 239): A TEST FOR THE ARMS' STAGE (N2)

**His words, after watching the grip film:** "also i swear the elbows dont swing lol". His earlier word on the same joint, item 180: "the elbows should be flared out more ... there needs to be more bend in the elbow when swinging".

**What the film's own joints say, measured by the librarian** (`pose.csv` of four of pane E's films, the lit pass; the script is `dz3night\elbows.js` in the librarian's scratchpad): the elbow angle runs between 73.5 and 100.0 degrees, a range of 26.5, identical on both arms and in all four films; the upper arm swings 91 to 95 degrees front to back at the shoulder. The body is the old build's.

**What is on file for it** (pane E's sheet, `loop/source_sheet_n2_upper_body_E_2026-11-15.md`, section 2):
- the elbow's range grows with speed, 21.68 F^0.718 degrees, measured only up to Froude 1.36 (`:119`); the hunter runs near 3.4;
- one sprinter at 9 m/s swings the arm about 120 degrees (`:138`);
- **no elbow range above 4.15 m/s is on file** (`:141`), so what a sprinter's elbow does is a thing to find before the arms are built, not to guess;
  - **CORRECTION, 15:1x, by pane E and opened by the librarian: this line is wrong.** A sprinter's elbow IS on file: `loop/sprint_reference_2026-11-13/00_reference.md:158-166` (Dorn's runner JA1, one runner, the second reader re-ran all 44 cells): flexion from 38.2 to 121.2 degrees over the cycle at 9.49 m/s, a range of 83.0; 67.1 at 5.20 m/s and 68.6 at 7.00 by pane E's finer read. 4.15 m/s is the top of the yardstick's arm reference, not of the shelf. The drawn elbow's 26.5 degrees is a third of that. Pane E's sheet carries the row (git-blob 1d8b8845).
- the old build's elbow numbers (mean 90 degrees and the rest) are in the sheet's list of what is not carried over (`:149`).

**For the arms' stage, registered now:** the sheet gains a line for the elbow's range at a sprint from a source (measured data or a published method), found before the stage's page is written. At N2's film the elbow's own range is printed beside that source's. **It failed on his terms if,** at N2's film, the elbows still do not read as swinging.

## AT HIS WORD OF 15:03 (D, 2026-11-15; game brief items 240 and 241): NOTHING MORE WITH THE OLD ANIMATION; THE NEW LEGS ARE FILMED ALONE

**His words:** 14:59 "but isnt that still the old animation system?? what  about the new one?"; 15:03 "well stop working on the old one completely for now wtf".

- **No film, clip, measure or comparison is made with the old animation system from here.** The old body is not set beside the new one in any film for him. This replaces "old beside new" wherever this plan or a packet says it for a cut; the earlier sections keep their words as the trace.
- **When pane B rings its rebuild, pane E films the newest cut of the new legs alone,** on the course. It goes on his page whether or not the score passes.
- **The hunter's path and grip line is parked** (`loop/packet_m_line_A_2026-11-15.md`, its last section).
- **After pane B's ring,** the new system's remaining work is split into parts with a pane named for each (his rule of 2026-10-09), in this plan, before anything is dispatched.

**It failed if** a later lap films, measures or tunes the old animation system, or sets it beside the new one, before he says otherwise.

## HIS WORD OF 15:10 (D, 2026-11-15; game brief item 242): EVERYTHING LEARNT FROM THE FIRST ITERATION IS USED

**His words:** "but it is good to still use everything we learnt from the first iteration of the animation system we tried".

**The line it draws, with the section above:**
- **Not done:** building on the first iteration's code, calling its functions, filming its body, setting it beside the new one, scoring against it.
- **Done, and owed:** using what it taught. Three kinds, each written as a lesson with where it is on file:
  1. **what it got right, and why** (for one: its straight run scores inside the measured runners' spread at hip, knee and ankle, because the measured shape draws the leg; the yardstick's table, this plan's earlier sections);
  2. **what it got wrong, and why** (for some: the ankle held at standing height drives the toe 11 to 13 cm under the floor; a stance foot that slides; legs that land as on a straight while the body turns, his item 238; an elbow that moves 26.5 degrees where a sprinter's moves 83, his item 239; a lean computed each tick and then discarded, `loop/handoff_dreamzone3_2026-11-14-L.md:37-39`);
  3. **his own verdicts on it** (his items 153, 168, 180, 186, 218, 220, 221, 231, 233, 235 to 239, and `loop/animation_system_2026-11-13/ground_his_words.md`).
- **A lesson is not the old code and not the old number.** A number of the first iteration that was set by eye and marked "ours" comes over only with the reason it was right (a source, a measure, or his pick), and is then cited to that reason.

**This amends the section of 13:42** (the withdrawal of 'carry the measured method over whole'): the order to carry the old method over as code and as a bar stays withdrawn. What that method taught about turning the measured curves into a leg is a lesson of kind 1 and may be used as one.

**Owed before any stage's page is written: one lessons sheet,** `loop/lessons_first_iteration_2026-11-15.md`, from the shelf (the 11-13 research folder, pane B's hand-back sections 6 to 16, pane E's four sheets' lists of what is not carried over, his items above). Each line: the lesson, its kind, the stage it bears on (N1 to N5), its path and line. What is not on file is said.

**It failed if** a fault of the first iteration that is on the sheet is built again in the new system, or a thing the first got right is found again by trial.

**THE LESSONS SHEET IS WRITTEN (pane E, rung 15:16):** `loop/lessons_first_iteration_2026-11-15.md`, 140 lines, git-blob f3c204da. Read whole by the librarian; four of its citations opened at their source lines and found as cited. It sorts each lesson as RIGHT, WRONG or HIS, by stage (N1 to N5 and the method), keeps the new system's own first-build lessons apart (NEW-N1), and ends with what is not on file. **It is read before any stage's page is written, and a stage's page says which of its lessons it used.**

## SECTION 17 READ (D, 2026-11-15 15:2x): THE REBUILD FROM RESEARCH PASSES THE RUNNERS' SPREAD AND ITS FEET ROWS ARE GREEN. THE CUT IS MADE NOW, OF THE NEW LEGS ALONE. THE SPLIT OF WHAT IS LEFT

(`handback/p-n1-legs-B_2026-11-15.md`, section 17, lines 1049 to 1200 read whole, git-blob 2671734c; `G:\consonance-scratch\b-n1q-out\yardstick.txt` and `rows.txt` read by the librarian before the folder was re-made; dreamzone-3 `n1-shaped-wip-b` c15f071, local.)

**Taken, whole.** The running leg is built from the measured runners and three published methods, each with its source beside the line, and nothing of the old build is called. Its table is inside the runners' spread at every joint and speed; a planted heel or toe moves at most 0.0070 m (the research's bar is 20 mm); the control is red with the lock taken out.

**For pane B, first, because older sends reach you after this build: the rulings of 13:47 and 13:51 crossed your rebuild.** Where they say "nothing more is built on the red branch" and "one page before the build", section 17 has overtaken them: the rebuild exists, it is what they asked for, and it stands. **Go on from c15f071.** What stays in force from them: the judges (the feet first, then the bands, then the cut and his eye) and the print of proportions.

**1. The cut, now.** The course on c15f071, the new system's two bodies **alone**: no old body in any frame, no "before" row, no figure of the old generator on the film or in its manifest (the plan's section of 15:03). Lit, from outside, as the earlier cuts were. Pane E encodes it: the straight, the turn, the stop and start, the doorway, the walk backwards, each at real speed and slower. It goes on his page whether or not it reads well.
- **Printed with the cut,** each over the whole course: the greatest travel of a heel or toe while down (bar 20 mm) and the lowest point of a foot under the floor (bar 5 mm), `loop/animation_system_2026-11-13/scout_evaluation.md:142-143`.
- **In the turn, his test** (the section of 14:08): the landings' line against the hips' curve, the inside and outside steps side by side, and how far a planted foot turns on the floor.

**2. The two changes to the judge (17.3), read as you asked, with that in mind.**
- **The cut:** on the final build the old cut and the new are 0.02 to 0.03 of the cycle apart (`yardstick.txt` :44, :110, :172, read by me). The pass does not hang on it.
- **The zero:** it is the change that moved the knee (our standing body is crouched 11.7 degrees against its rest). Your ground is the dataset's own pipeline and the runners' standing trials (-0.2 degrees, sd 5.2, 39 runners). I have not opened the pipeline file.
- **One check of the judge that needs no body of ours,** added as a row of the yardstick's own tests, red first: one runner's own trial scored against the others under the new cut and zero falls inside the spread; the same trial with the knee shifted by 11.7 degrees fails. A judge changed after a failing table earns a control of its own. No hold: it is built beside the cut.

**3. The step is the thing his eye may catch.** About 1.1 m at 3.5 m/s where the runners' stride scaled to our body gives 1.69 m, so the legs turn over about 1.5 times as fast. You named it before the film, unexplained. It is said to him beside the clip in plain words. **Your next after the cut is the print of proportions** (our thigh, shin and foot against hip height beside the runners'), which bears on why our stance covers less ground; then the standing and walking crouch you named in 17.8.

**4. The world self-test's one machine-bound red** (builds pending after a new seed) was read while he plays and another seat ran. It is not N1's and is not judged from that read; the landing's run in a quiet window decides.

**5. THE SPLIT of what is left of the new system (his rule of 2026-10-09: every part named, a pane for each):**
- **Pane B, the legs (N1):** the cut; the judge's control; the proportions and the step; the legs in a turn; the standing crouch. Push `n1-shaped-wip-b` so that another pane can branch from it.
- **Pane E:** the clips of the cut for his page. Nothing with the old body.
- **Pane A (its path line is parked), the trunk, arms and head (N2), the page only for now:** read `loop/lessons_first_iteration_2026-11-15.md` and `loop/source_sheet_n2_upper_body_E_2026-11-15.md` whole, the sources they name at source, and write N2's page: what is built, from which source, with which judge (for the elbow: 38.2 to 121.2 degrees at 9.49 m/s, one runner, `loop/sprint_reference_2026-11-13/00_reference.md:158-166`; his items 180, 186 and 239). **No code until he has seen the legs' film,** so that what he says of the legs can turn the page before anything is built on it.
- **A landing pane, after his look:** N1 onto main behind its own switch, off by default, so that he can play it.
- **Not started and not dispatched:** N3 (the world), N4 (the states), N5 (the picture's physics). Their sheets are written. Each starts when the stage before it has been seen by him.

**It failed if** the cut carries the old body in any frame, or if N2's code is begun before he has seen the legs move.

**N2's PAGE IS WRITTEN (pane A, rung 15:24):** `loop/page_n2_upper_body_A_2026-11-15.md`, 256 lines, git-blob ffac05fa. Read whole by the librarian; its elbow and shoulder figures set beside the sprint reference's rows (`loop/sprint_reference_2026-11-13/00_reference.md:151-153`, `:162-164`) and found as cited. **Taken as it stands. No code until he has seen the legs' film.**
- It gives each part its source (the lean, the pelvis and thorax, the trunk, the arms, the head and the look, first person, breath, one spring layer), lists seven things that are ours, registers what would show it wrong in his words and in figures, and says which lessons it used. It says plainly that the primaries were not re-opened: every number is the record's at its line.
- **Two seams with N1, for panes A and B to settle before any N2 code:** who draws the pelvis's turn about the vertical (it moves the hip joints the legs hang from); and how a whole-body lean meets feet that N1 has planted (the landing has to be placed outside the path by the leg's length times the sine of the lean).
- **One caution, mine, arithmetic only and not run:** pane B infers that the pelvis's turn is what lengthens a real stride, and the step is 1.1 m against 1.69 m. A pelvis turning 6.5 degrees each way moves each hip joint by half the hip width times sin 6.5, so it adds about the hip width times 0.11 to a step: about 3 cm on a hip 0.25 m wide, against a gap of about 59 cm. So the pelvis's turn should not be expected to close the step. The print of proportions is still the read for that.
  - **Marked after the second reader's note:** the 0.25 m hip width in that sum is my assumption and is not read from the rig; the 6.5 degrees is the page's (its section 2.2), and the 1.69 and 1.1 m are pane B's (its section 17.4). At any hip width under a metre the turn adds less than 12 cm a step, so the caution does not hang on the assumed width.
  - **CORRECTION, 16:0x, from pane A's read at source:** the 6.5 degrees in that sum is not a turn. Perpiñá-Martínez 2023 gives it as pelvic TILT (PMC9961938; pane A's page, 'A correction to section 2.2'). The pelvis's turn about the vertical, measured by pane A from one sprinter's markers, is a whole range of 7.7 to 26.9 degrees by speed, so 3.9 to 13.5 degrees each way; the many-runner figure is 10 to 16 degrees whole at 2.4 to 3.3 m/s. On the assumed 0.25 m hip that is 1.7 to 5.9 cm a step. The caution stands; its input was wrong.
- **His, later, and not put to him now:** the share of gravity's lean past one measured speed, which gravity the player's lean uses, and the lean's cap, which is the grip number of the parked line.

## HIS WORDS OF 15:50 AND 15:51 (D, 2026-11-15; game brief item 243): 'looks v similar to the old system'. THE NEXT WORK IS WHERE A DIFFERENCE SHOWS; HIS PAGE IS A NEW ONE

**His words:** "looks v similar to the old system crying cat scream"; "perhaps make a new artifact instead of building on the old one".

- **His page for the new system is a new one:** https://claude.ai/artifact/Tsc1rmLAcFink4WeZNZiqy. It holds only the new system. Every later cut of the new system goes there. The old page (Night Build Report) is the record and is not added to.
- **On a straight the new legs will look like the first system's,** and that is said to him: both draw from the same measured runners (`loop/lessons_first_iteration_2026-11-15.md`, the legs' first row, RIGHT). So no more films of the straight alone are offered as progress.
- **The order of work is the order in which he would see a difference:**
  1. **Pane B: the legs in a turn** (his item 238; section 18.2 red; Johansen's footprint along a circle, a footprint's orientation kept once placed, the swing bent through its mid-flight point, as B read them at source). With it the runner's first frames (the old pose) traced and fixed, and the next cut's camera seeing the feet through the bend.
  2. **Pane A: N2.** The page's own "before code" list starts now: the two seams settled with pane B, and the three things measured from data. **Its code may begin once those are done:** he has the legs' film on his page since 15:55, and what he has said of the new system so far asks for the parts that differ, which is what N2 builds. If he says more of the legs before then, the page is turned by it first.
- **The line of 15:2x ("it failed if N2's code is begun before he has seen the legs move") is kept in this form:** the film is in front of him; whether he has played it is not known to any seat, so pane A's ring before its first code says what he has said by then.

## HIS WORD OF 15:54 (D, 2026-11-15; game brief item 244): 'open source gems that already exist which we can then modify'. AN EVALUATION OF EXISTING SYSTEMS COMES BEFORE ANY MORE IS BUILT BY HAND

**His words:** "backwards walking is bugged, i swear, there has to be open source gems that already exist which we can then modify?"

**What it changes.** Since 11-12 the room has worked under his item 150: "research open source alternatives, not to use, but to learn from". So each system was read for its method and written again by hand, one part a lap. His word today is to take what exists and modify it. **Which of the two he means from here is his to say; this section is written so that work can start on the part that does not need his answer.**

**The backwards walk is the case in point.** The new legs have one measured shape, a forward run, and it is drawn for travel in any direction; the knee lifts in front while the body goes back (looked at by the librarian, the cut's `backwards` station). The existing walkers answer this by construction: Johansen's blends example cycles by the direction of travel; motion matching picks recorded motion.

**THE EVALUATION (a read and a run; nothing enters the game's tree):**

| candidate | licence, as the census or the shelf reports it | what it is | pane |
|---|---|---|---|
| rbfx's IK module | MIT, C++ | leg, arm, spine, head and limb solvers; foot locking with staggered release | B (it has read two of its files at source) |
| Johansen's Locomotion System | MPL-2.0 (file-level copyleft), C# | the most complete planted-foot walker in one file; blends example cycles in any direction; footprints along a circle in a turn | B (it has read the thesis and the code) |
| Overgrowth | Apache-2.0, C++ and AngelScript | a shipped game's whole procedural character: a few key poses, springs, lean, IK, ragdoll | A |
| Holden's Motion-Matching | MIT, C++; its bundled data LAFAN1 is CC BY-NC-ND and cannot ship | a whole motion-matching controller with inertialization and foot locking | A |
| Esoterica | MIT, C++ | an animation graph with foot IK, orientation and target warping, powered ragdoll | A, the licence and the three nodes only |
| open motion data for a matching or blending base | 100STYLE CC BY 4.0; CMU "free for all uses" | recorded walks and runs forwards, backwards and sideways | A, with Holden's |

**For each, from the source and not from the census:**
1. the licence file, opened, and what it asks of a game that is sold and whose own repository is private;
2. whether it builds and runs here as it comes, and what it needs that is not in the repository (assets, data), with that licence too;
3. **its own demo filmed moving** where it runs: walking backwards, a turn, a stop and a start. These go on his page as the candidates. Nothing of our old body is in them;
4. what taking it would mean: which files, how it meets Jolt and the simulation's tick, what of today's work it keeps (the measured runners, the planted-foot rows, the lessons sheet) and what it replaces;
5. what it would not give him (for one: no open recording reaches the hunter's speed, `loop/animation_system_2026-11-13/scout_motion_matching.md:1-3`).

**Held until he has chosen a base:** N2's code (pane A's page stands as the list of what the upper body must do, whichever base draws it); the legs' turn built by hand. **Not held:** the trace of the old pose in the runner's first frames; the tests of today (the feet's judges, his turn test, the yardstick), which judge any base.

**His, and asked in plain words with the candidates in front of him:** which base, or none; and yes to each licence before a line of it enters the game.

**It failed if** code from any of these is copied into the game's tree before he has said yes to its licence, or if the room goes on writing by hand a part that a chosen base already has.

## HIS WORD OF 16:02 (D, 2026-11-15; game brief items 156 and 245): KINETIC LINKING. THE NEW SYSTEM IS ONE LINKED BODY, AND THE STAGES BY BODY PART ARE WITHDRAWN

**His words, 16:02:** "i just dont get it, why are the legs done but the rest isnt? its in the research and I have even said, the way the proc gen system of animation works shoult utilize kinetic linking."
**His words, 11-12 (item 156):** "kinetic linking, making the whole body work as one. We need to make that but better for all entities and even the player character".

**What was wrong in this plan, by name.** Its stages N1 to N5 cut the body by part, gave the legs to one pane, and held the trunk, arms and head behind "no code until he has seen the legs". Nothing in this file, in the lessons sheet or in N2's page says kinetic, item 156 or L181 (checked by grep, 16:0x). His decision of 11-12, its plan (`loop/plan_l181_kinetic_chain_2026-11-12.md`) and its model (his first game's [KINETICS], dreamzone-rt `src/main.cpp` at 9d98b64, :6605) were left out of the restart. **Withdrawn: the stage N2 as a stage, its gate, and the two "seams" between N1 and N2.** A linked body has no seam there.

**THE BODY, as one chain (L181's eight points stand, each with its source; today's measures fill what L181 had to leave open):**
- **The feet hold the ground and the pelvis rides the planted legs.** That part exists: dreamzone-3 `n1-shaped-wip-b` c6e3a5f (the planted-foot rows; the pelvis's height and tilt from the measured runners).
- **Every segment is mounted on its parent and is moved by it:** pelvis, then spine, neck and head upward; pelvis, then thighs, shins and feet downward; shoulders, then arms, from the chest. A motion of the pelvis reaches the head and the hands through the chain, late and smaller, by a spring at each link.
- **What travels along it, each from a source:**
  - the pelvis's turn with the stride and the thorax's counter-turn, a quarter of a stride later (pane A's measure from Dorn's markers; Perpiñá-Martínez 2023's many-runner range for the pelvis). L181's point 5 asked for exactly this source;
  - the arms swung from the shoulders' motion and not driven on their own (Pontzer 2009: powered from below), with the measured sprinter's elbow and wrist path as what the result is set beside (`loop/sprint_reference_2026-11-13/00_reference.md:158-166`; pane A's page);
  - the bank shared down the chain and countered at the head (his first game's shares; Overgrowth's, `movementobject.cpp:2680-2685`), as angles in space so that nothing is counted twice;
  - the look shared up the chain, head first (his item 163);
  - the follow-through: each link's spring by half-life (Holden's `spring.h`, MIT; Overgrowth's half-lives).
- **One function for every body with a model, and the player's** (L181's point 8; his "for all entities and even the player character").

**L181's own tests carry over, red first:** a scripted pelvis bank reaches chest, neck and head by their registered shares; pelvis and thorax turn opposite over a stride with the measured lag; after a step change in the pelvis the head's lag peaks after the chest's. With them today's judges: the feet's rows unmoved by anything above them, the elbow's range and the wrist's path beside the sprinter's.

**WHO, now (this replaces item 5 of the section of 15:2x and the holds of 15:54 on the upper body):**
- **Pane A builds the chain from the pelvis up, now,** in `game/anim/` on a branch from c6e3a5f. Its page and its measures are the chain's numbers; its seams file is withdrawn as a seam and kept as the statement of what the pelvis's frame hands upward. L181 and the first game's block at 9d98b64 are read whole first. No old pose function is called (the first iteration's `kinetic_chain` is read for what it taught, by the lessons sheet's rule).
- **Pane B keeps the downward half:** the pelvis's turn drawn into the legs' plan, the legs in a turn, the backwards step, the first tick. Its evaluation ring (rbfx, Johansen) comes first.
- **Pane E films the whole body as soon as the chain moves at all,** crude or not, for his new page.

**The open candidates (pane A's evaluation, `loop/eval_open_systems_A_2026-11-15.md`, git-blob 9d6ae95b, read whole):** none can be filmed today without a call of his and none reaches the hunter's speed; Overgrowth's animations are not open and its rules are already in use here. The evaluation's hold on the upper body is lifted by this section. His calls from it are put to him in plain words (the 1.47 GB of open recordings first; the rest only if he wants to see them).

**It failed on his terms if** the next film of the new system still shows legs under a body that does not move with them. **It failed as a plan if** a later section cuts the body into stages by part again.

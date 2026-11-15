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

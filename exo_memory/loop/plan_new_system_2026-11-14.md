# Plan of record: build the new system (the hunter's movement as a body under physics, and the one pipeline that draws it)

Written by the librarian on L, 2026-11-14 07:1x, at his word. This replaces the order in
`loop/path_of_record_animation_2026-11-13.md`, section 5, wherever the two disagree. It is a plan; the laps are the panes'.

## His words (verbatim; game brief items 153, 221 and the lines under 221)

- 11-12: "well why the fk did we do all the research just to ignore it and do our own thing????????????????"
- 11-14 04:47: "i want a procedural animation system, that interacts with the environment in a realistc way like rockstars rage
  engine, we had these plans for a proc animation system but continued to build off of what we had instead of restarting with
  the research i swear. We have come along way with the animations how we have been doing them, but i think it makes it so
  much harder for you to do what I want."
- 11-14 07:02: "is it the new ssystem not just modified what we have been doing"
- 11-14 07:05, after this seat asked him again whether to build it: "well what!!!! i said plan and build the new system, bro
  wants to prove me wrong more than listening"

**So it is decided, by him: the new system is built. It is not conditional on how the switches on the old hunter play.**

## What the new system is (from the research on file; each line has its source)

1. **Movement: the hunter is a mass under a grip limit.** Its sideways acceleration can never exceed grip times g, so it arcs
   through a corner under a force limit and does not stop, pivot and go; its heading changes continuously
   (`loop/physics_first_body_read_2026-11-14.md:199-222`, option B). He picked grip as the hunter's one raised ability on
   11-12 (game brief item 168).
2. **The world pushes back.** Walls and floor act on that body, as they do on the player's (`sim/physics.cpp:386`, `:479`,
   the reader's cite). The reader's second flavour of option B (`:204-206`). This is "interacts with the environment".
3. **The body is drawn from that motion by one pipeline for every body** (`loop/animation_system_2026-11-13/00_system.md:1-13`):
   one picture clock, a pose generator, the whole-body lean by `atan(a/g)` about the feet, feet held where they land, changes
   of state eased, contacts, picture physics for the upper body, the skin.
4. **Physics on the body is for reactions and contacts.** Running stays driven; nothing on file, ours or outside, shows a
   physics-balanced run that stands up (same reader's page, section 2 and section 3; option C is not this plan).

## What stops, because it extends the old hunter

- New switches or patches on the old turning rules (`chase/chaser.cpp:331-372`, `corner_speed`, `speed_for_radius`).
- **The corner-room lap** (`handback/p-corner-room-A_2026-11-13.md`) as registered: it patches the corner rule the new root
  replaces. The sprinter row it was meant to fix is re-registered under the new root in lap M2 below.
- The switches landed tonight (145b698) stay as they are, off. They are the new root's ingredients inside the old model and
  are how he previews the feel; nothing more is built on them.

## The laps, in order (one pane at a time; the desktop starts these tonight)

**Movement, pane A:**
- **M1, the root law, red first.** A new stepper for the hunter beside the old one, chosen by one switch that is off until
  he says so: position, velocity and heading as a mass; sideways acceleration capped at `grip_mu` times g; plain float
  arithmetic with the deterministic sine and cosine the chase already uses. The red-first row is the reader's
  (`loop/physics_first_body_read_2026-11-14.md:212-215`): a scripted 90 degree corner of 3 m radius entered at 9 m/s; sideways
  acceleration at most grip times g on every tick; heading rate continuous. Off means off, by the 12-seed md5 and his 20 kept
  runs, as in L210.
- **M2, the old rules retired from the hunter's path through the new stepper, and the rows that encoded them re-registered by
  name**, the sprinter row first (`chase/tests/body_tests.cpp:190`), each with its reason. Catch power measured before and
  after at NORMAL and brutal, beside his 52 and 62.
- **M3, the world pushes back:** the hunter's body in the collision world; a wall deflects it and takes speed by contact, and
  it cannot leave the walkable floor (sideways carry stalled one route in ten at a floor gap in L170; that row is red first
  here).
- **M4, arrival:** the last metres to the player, so it does not brake to nothing short of the touch (game brief item 220;
  no traced cause on main, `loop/physics_first_body_read_2026-11-14.md:78-85`). Red first from his own run.
- **M5, re-tuning** speed, grip and lead so the hunter is as dangerous as he wants it; the switch flips to on; the old
  stepper's code for the hunter is removed.

**The body, pane C, then E:**
- **B1, the lean about the feet** from the root's own sideways acceleration (`game/world/world_app.cpp:561` computes it and
  `:609` discards it today). With M1 the lean and the path come from the same force.
- **B2, the picture clock** (retires the frame-time stride). **B3, feet held where they land** (C's parked step 1,
  `l180-lap2-rest` 55d1451). **B4, state and transitions.**
- **B5, picture physics on the upper body** (pane E, built as `origin/l185-skeleton-steps45` 1b690fd): lands after his eye on
  the re-film and one cost read.
- **B6, hands and feet meet the walls and floor** for the hunter.
- Then the other bodies and the player's own, as the path of record lists them.

## Registered with this plan

- **This plan failed if** the first lap dispatched after it adds to the old turning rules, or to a switch on them, and no seat
  says so before code. Read at every hunter packet from today.
- **It failed on his terms if**, after M1 to M3, he plays it and still names the stop, pivot and go at a corner. Then the
  root law is wrong, not under-tuned, and M1's row was the wrong row.
- **Sizes are not known.** The reader's guess for the movement half is 8 to 12 laps; it is a guess and is not a bar.
- **Two cautions that are part of the build, not reasons to wait:** at 9.2 m/s the tightest arc that grip allows is 4 to 9 m
  in corridors about 3 m wide, so the new root still brakes before a tight bend (`:98-102`); and in tonight's single traces the
  grip law's hunter took about 59 s to catch a bot the old one caught in 23.6 s, so M5 is real work
  (`librarian/2026-11-14.laptop.md`, "07:0x: A's seven traces").

## AMENDED 12:2x on 2026-11-14 (D), by the librarian, from M1 and from his words after playing (game brief item 223)

- **M1 is back** (`handback/p-m1-root-law-A_2026-11-14.md`): the body holds grip and never re-points; switched on as it stands it
  meets walls more (9 head-on ticks against 6) and catches later. The switch stays off.
- **M2 is now the speed plan ahead of that body,** before any old rule is retired: `loop/packet_m2_speed_plan_A_2026-11-14.md`.
- **His specification for corners, in his words:** "anything like 45 degrees under is like smooth banking turns"; "90 degree turns
  for sure tons of slow down, or they could like full speed into the wall to slow down instead"; "still losing some speed but not
  all of it". So wall contact at a hard corner is allowed, and the bar the room had put on wall contact is withdrawn as a bar. M3
  (the world pushes back) and B6 (hands and feet meet the walls) are what make that contact look like a body and not a stop.
- **A new lap, after the corners: the weave on long straights.** His words: "it will launch the line perfectly straight at you ...
  theres no like variance"; "wind back in forth in like an animal"; "since they have the speed buff, they can afford to take an
  indirect line to the runner. Weaving left and right a little over long straights." To register when it is packeted: it spends only
  the speed the hunter has in hand (the closing rate stays positive); it happens on straights long enough to show it; it never puts
  the hunter into a wall; with the root on it is a sideways force, so the lean of B1 banks with it. Prior art that is not this: the
  sway of the aim since D664 (the `sway` setting in `chase/speed.h`). No source is read for it yet; it is his design and is marked so.
- **A hole in this plan, found at M2:** the sprinter row cannot be re-registered "under the new root" (M2 above), because the
  sprinter is a lesser chaser and the root is the hunter alone. It is ruled when the mesh query of M2 exists.
- **Corrected by his next line, 12:15:** "i think 45 is too generous right, what am i thinking like half that". The gentle bend is about 22 degrees or less; 45 is a middle band that loses some speed.
- **A recorded case for the drop, added 12:5x (game brief item 225):** on his run of 12:49 (seed 4), the hunter waited a floor above him for about two seconds and then was on his floor within half a second with its speed reading 0.0, where a fall of 3.5 m takes 0.84 s. **Into M3:** a chaser that changes floor by a drop falls: the descent takes no less than a fall, it lands, and with the body laps it is drawn falling. Red first on that run, 149.5 to 150.0 s. First, a read-only trace by pane A of those seconds tick by tick, to say whether it used a drop link or passed through floor.

## AMENDED 18:5x on 2026-11-14 (D), by the librarian: one system for every body, at his word of 18:44 (game brief item 227)

- **His words:** "and remember, its not just for the hunter, but all mobs we will make and even the players character animations as seen from first person view, but also consistent from the outside as well." And on 11-13 (item 159): "the player animation needs to look smooth from first person perspective, when the player looks down at their legs and body/arms, they should move how a real person would ... when the charater rubs up against a wall you see their arms and hands touch up against it as you move, the character must interact with the world dynamically too".
- **What was wrong in this plan as written on L:** it builds the hunter first and says "Then the other bodies and the player's own". The design it rests on never said that: "One pipeline draws every body" and "One small data file per kind" (`loop/animation_system_2026-11-13/00_system.md:1-13`). His line makes that the rule of each lap, not the last step.
- **1. Movement: the root is a law any mob takes.** Its numbers sit in a row for the kind: mass, top speed, grip, how fast it gains and sheds speed. M1 and M2 built it for the hunter alone. **New lap M2b, straight after M2:** the same stepper and the same speed plan for every chaser kind, switched on kind by kind, each off until he says. A new mob is then a row of numbers and a model, not new code. This closes the hole named above: the sprinter row is re-registered once the sprinter can take the root.
- **2. The body: every body lap is built for every drawn body from its first commit.** One function and one data file per kind; no body gets a lean, a clock or feet of its own. Each lap's rows run on at least two bodies, the hunter and the player's. B1 is amended so (`loop/packet_b1_lean_C_2026-11-14.md`). The player's own lean, a home-made one today, is retired into the shared one, as the design says (`00_system.md`, point 2).
- **3. The player's body is one pose seen by two cameras.** What first person shows of the body and what an outside camera shows are the same joints at the same tick. Whatever first person changes (a part not drawn, an offset) is a named list with a bound on each. The row and the film tool are pane E's (`loop/packet_e1_one_pose_two_cameras_E_2026-11-14.md`). **The view itself does not move with the body tonight:** the camera riding on the simulated head is his item 162 and stays a dial at nothing until his eye.
- **4. The world pushes back on every body too.** M3 is for any chaser on the root. For the player's body it is his item 159 (hands on the wall) and laps L24 and L26 of the path of record; they follow B4.
- **The order of the night** is `loop/night_order_2026-11-14-D.md`.
- **Registered with this amendment.** It failed if, at the first lesser kind that gets a body (the sprinter) or at the player's body, a lap adds a pose function, a clock, a lean or a root law for that body alone and no seat says so before code. It failed on his terms if he looks down in first person, then watches the same run from outside, and the two bodies do not match. The swarm's own size test (`loop/path_of_record_animation_2026-11-13.md:133-135`) is now read at every new body, not only the first.

## AMENDED 19:1x on 2026-11-14 (D), from M2 (`handback/p-m2-speed-plan-A_2026-11-14.md`)

- **M2 is back.** The speed plan and the mesh's room are built on `a-m1-root` 0ba17ea, behind `root_law` and `corner_feel`, both off. Head-on wall ticks on the ten routes fell from M1's 9 to 2 (grip only) and 0 (also slowing for the bend). The ten routes' time is 1.049 and 1.064 of today's. **It is not switched on, and it does not land yet:** the plan brakes a 15 degree bend to the creep speed (G1 red, the opposite of his banked turn), and the branch's own suite reads 89 tests, 5 failed.
- **The cause A read for G1** (marked inferred): the aim is the next path point, a metre or less ahead. **Next, M2c:** the aim a distance ahead that grows with speed, pulled in where the mesh is not open to it. Then **M2b**, the root for every kind. Packet: `loop/packet_m2c_m2b_A_2026-11-14.md`.
- **A corner's room is two limits, and the lesser holds:** the corridor's width and the length of the straight legs. The librarian's arithmetic of 12:1x used the width alone and overstated what a short leg allows; A's formula is the leg limit. The table is in the packet.
- **The drop of item 225, corrected:** the hunter took a drop link and came down 3.50 m in 0.904 s; a free fall takes 0.845 s. The line above that says it changed floors "within half a second" is wrong and stays as written; this line corrects it. For M3 "a drop is a fall" now means: the body carries its run off the edge, comes down under gravity, cannot pass through what is solid, and with the body laps is drawn falling and landing.
- **Catch power, reported by A, nothing tuned to it:** of 96 seeds at normal the fleeing bot was never caught in 58 on main, 68 with grip only, 57 with slowing for the bend; at brutal 2, 2 and 0.

## AMENDED at the collation of M2c and M2b (D, the night of 2026-11-14; `handback/p-m2c-m2b-A_2026-11-14.md`)

- **M2c and M2b are back,** on `a-m1-root` b3ade8e, every switch off (`root_law`, `corner_feel`, `root_kinds`). The aim ahead works: the scripted 15 and 22 degree bends keep 9.19 and 9.18 of 9.20 m/s. Any kind takes the root by its bit; a new kind is a row; no line of the root names a kind.
- **What a kind's row holds today:** top speed, forward gain, braking, the standstill turn rate, grip. **Mass is not read.** The section "AMENDED 18:5x" above lists mass in the row; it enters when two bodies push each other, not before.
- **Three rows are red, with one cause:** a step the mesh refuses stops the body dead for a tick (`chase/chaser.cpp:529`). The branch does not land until they are green.
- **M3 is packeted** (`loop/packet_m3_world_pushes_back_A_2026-11-14.md`): M3a, a refused step is a contact, the body keeps what runs along the edge and loses what runs into it; M3b, a drop is a fall, swept through the simulation's collision.
- **The drop of item 225, second correction:** pane A's cast shows the link's line runs through solid (18 of 18 casts). He was right that it clipped. It also took a fall's time. Both lines above stand as written; this one completes them.
- **A corner's room, a third reading:** pane A's `room` is neither the width limit nor the leg limit; it is the clearance along the corner's outer bisector, set where the leg's length goes. On route 0's short legs it is the generous one. Named for the lap that follows M3; not changed tonight.
- **The Park kit stays held:** on the root the sprinter row cannot say what it says today (care is not something the root reads), so it cannot rule the kit.
- **Catch power with every kind on the root, reported, nothing tuned to it:** of 96 seeds the fleeing bot is never caught in 64 at normal (main 58) and 0 at brutal (main 2).

## AMENDED at the collation of E1 (D, the night of 2026-11-14; `handback/p-d677-e1-E_2026-11-14.md`)

- **Point 3 of "AMENDED 18:5x" holds today and is now a row:** the player's body is one pose seen by two cameras. Pane E read one pose call and no second rig, and its row compares what the two views drew (0 difference over 77,238 joint pairs on a kept run; five mutants caught). Branch `e1-two-cameras-e` 45d299a; pane B lands it after the look back is on main.
- **A lap this found, added to the body's list for every body: the body follows the look.** The view's pitch does not reach the body today, so looking down bends nothing. One function spreads a look over neck, chest and hips for any body: the player looking down at his own legs (his item 159), a chaser's head on its target. It is laps L19 and L23 of the path of record made one, and it comes after B1. Owner named when a pane is free.
- **The film tool exists and is not yet fit for his eye:** dark outside frames, and no way to put two laws through the same corner. Packet E2: `loop/packet_e2_films_for_his_eye_E_2026-11-14.md`.
- **L12 (B5 above):** its cost reading is in and shows nothing on the card. It may land tonight behind its switch, off, if off draws exactly as main does; pane E says whether it has one.

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

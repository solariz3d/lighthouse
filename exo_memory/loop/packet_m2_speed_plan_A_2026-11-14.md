# Packet M2 (pane A, on the desktop): the speed plan ahead of a body that cannot out-turn grip. Red first

Written by the librarian on D, 2026-11-14 12:0x, after M1's hand-back (`handback/p-m1-root-law-A_2026-11-14.md`, read whole).
Second lap of `loop/plan_new_system_2026-11-14.md`, amended by this packet: **the planner comes before anything is retired.**
Pane A is warm from M1 and continues on its branch `a-m1-root`. Everything here is for the hunter with `root_law = 1` only.

## His words (verbatim; game brief items 220 and 221)

- "it like loses all speed, repoints itself then goes, instead of like flowing through it still"
- "the body should orient itself where it is trying go, like a bird or a space ship banking into a turn"
- "i said plan and build the new system"

## What M1 showed (your own rows; the two that fired are ruled here)

- The body is right: sideways acceleration never over grip (9.81), no re-point (0.000000 rad), every route walked.
- **Fired, the law's own falsifier:** head-on wall ticks on the ten routes 9 against today's 6, bar 7.50. Mechanism read on one
  contact (route 0, 7 ticks from 4.112 s): at 8.82 m/s the next point read as a 10 degree turn (legs 2.70 m and 0.30 m), no braking
  was asked, and grip's radius at that speed is about 7.9 m. **Ruled: it stands as fired and is said first wherever M1 is
  reported. The switch stays off. The fix is the planner's reading of the path ahead, not grip.**
- **Fired, R1's turn-rate step:** 0.1043 rad/s a tick against 0.1, after the body had braked to 2.64 m/s. **Ruled: the bar is
  re-registered by name, in the quantity the law actually limits.** The law eases the SIDEWAYS ACCELERATION (it takes 0.08 s to come
  to full grip at every speed); a fixed figure in radians a second was a 9 m/s number and grows as the body slows only because the
  turn rate is that acceleration divided by speed. The new bar: the change in sideways acceleration from one tick to the next, with
  your own derivation of the largest change the law allows (the ease, plus what a change of speed adds), stated before the run.
  Conditions on it: at 9 m/s it is no looser than the old bar (0.1 rad/s a tick there is 0.9 m/s/s a tick; the ease alone gives about
  0.51); it is RED on the stub of today's rule (0.18 rad/s a tick at 9 m/s); where the body turns on its feet (below the speed at
  which `turn_slow` is the limit) the row reads the turn rate against that limit's own ease. The old bar and its 0.1043 stay in the
  row's comment. **No cap on angular acceleration is added:** it would make the hunter slow to turn at a walk, which nobody asked for.

## What to build

1. **R1 re-registered as ruled** (a small commit, first).
2. **The offscreen chase modes take `--chase-speed`,** so the new root can be filmed (your hand-back: "one argument check in
   `main.cpp`"). Red first: an offscreen run with the argument applies it and its `[speed]` section shows it.
3. **The speed plan.** With the root on, the hunter's wanted speed is planned over the path AHEAD, as far as it needs to stop from
   the speed it has (with a margin you register), not from the next point alone: every corner in that stretch gets the speed grip
   allows for it, and the speed now is capped so that braking within the body's own limit reaches each of them in time. One pass
   backwards over the stretch, each tick, in the chase's own arithmetic.
4. **The room a corner leaves, read from the mesh.** The query you registered on 11-13 for the corner room
   (`handback/p-corner-room-A_2026-11-13.md`: the free distance along the outer bisector, floored at 0.9 m, capped at 6 m, by one
   added nav query) becomes the radius the new plan uses. **It feeds the new root's plan only.** The old corner rule is not
   touched, and the corner-room lap as registered stays stopped.

## Registered before code (red first where marked; print each number, and contacts beside ticks)

- **W1, red first, the walls:** head-on wall ticks on the ten L170 routes with the root on are at most 1.25 times today's with it
  off. Red today: 9 against 6.
- **W2, red first, the corner that failed:** route 0's corner, by name. In the half second before 4.112 s the plan asks a speed
  that grip can carry round the corner beyond the next point, and the contact does not happen.
- **W3, red first where it is red, his "loses all speed":** at each corner of the ten routes, the hunter's lowest speed is not
  below 0.8 of the speed grip allows for the room the mesh leaves there. Print the lowest speed and that allowed speed at every
  corner, root off and on. If today's body already meets it at some corners, say which.
- **M1's rows stay green:** R1 as re-registered, R2 (the 12-seed md5 `fa938de45995bd2d13b98ba28fae0c34` with the switch off; the
  kept runs the same on the branch as on main), R3, R4.
- **R5, reported, not a bar:** the same four runs as M1 (normal and brutal, off and on), beside M1's own table and his 52 and 62.
- **This lap is wrong if** W1 holds only because the hunter now crawls: the ten routes' total time with the root on is more than
  1.25 times today's (M1 read 82.0 s against 77.3 s by my sum of the ten rows in `green_rows.txt:1-10`; print yours).

## What the room holds (open before you write a line)

- Your own M1 files: the law (`handback/p-m1-root-law-A_2026-11-14_evidence/law.md`), the route table (`green_rows.txt:1-13`),
  the one traced contact (`diag_route0.txt`).
- The envelope of what grip allows at chase speed: `loop/physics_first_body_read_2026-11-14.md:98-102` (at 9.2 m/s the radius is
  8.6 m at grip 1.0, 6.6 at 1.3, 4.3 at 2.0; corridors are about 3 m wide). So a tight bend still needs braking; the plan's job
  is that the braking starts in time and is no more than the room asks.
- A choice of yours in M1, named there as ours: forward and sideways limits are separate, so braking at 1.43 g while turning at
  1 g is allowed. It stays as it is in this lap. Say in the hand-back what W1 to W3 read if the two shared one limit; do not build it.

## A hole in the plan of record, named so nobody builds on it

The plan says the sprinter row (`chase/tests/body_tests.cpp:190`) is re-registered "under the new root" in M2. The sprinter is a
lesser chaser, and the new root is the hunter's alone (`make_body` leaves `root_law` at 0). So this lap cannot do that, and B's
Park kit stays held on that row. It is ruled when the mesh query of step 4 exists; nothing in this lap touches it.

## For his eye, in the hand-back

- One corner filmed from outside and from the look-behind, root off and on, same route (step 2 makes it possible).
- The seed-1 trace again (`dz-chase run --policy line --level 3 --seed 1 --max 60 --image`), root on, beside M1's two.
- The line that starts a live play with the root on, and which build it needs.

## Not in this lap

Retiring any old rule, or re-registering a row that encodes one. The world pushing back (M3). Arrival (M4). Flipping the default
(M5). Any lesser chaser. `game/config/world.local.txt`: his.

## Standing rules

`node consonance/tools/heavy-run.js --status` before any run, in the same call. He is testing the game on D today: read the
process list before every build and every run, wait while his game is up, never close it. Trees and builds on
`G:\consonance-scratch`. Push `a-m1-root` to the game's private remote by its literal name before you start, so M1 is not on D
alone. Commit by named paths. His words stay out of the game's repository. Hand-back as a file, rung to the librarian as a
pointer, each state claim marked checked or inferred.

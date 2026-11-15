# N1 design, one page: legs that go where the body goes (pane B, D677; before any code)

**Plan:** `loop/plan_animation_restart_2026-11-15.md` (hash-object 847756e6), read whole, steps 1-3 of "What the new system is", flat
ground, the runner's model and the hunter's through the same code.
**Read before this page:** `animation_system_2026-11-13/`: `scout_gaits_any_body.md` §3, `scout_ik_and_feet.md` §3,
`scout_shipped_systems.md` §3a, and `ground_locomotion_and_yardstick.md` §2, §4 and §8, with their second readers' marks.

## The module's files (new, in `game/anim/`; none calls `Body::pose`, `gait_pose`, `apply_motion`, `reach_leg`, the chain, or a law over them)

| file | what |
|---|---|
| `anim/body_row.h` | one row of numbers per kind of body, every number marked sourced (with page) or ours. `kRunnerRow`, `kHunterRow` |
| `anim/limbs.h/.cpp` | a body's own limb lengths read from its rest joints: thigh, shin, foot (ankle to ball), hip width, standing hip height |
| `anim/intent.h` | step 1, where the body is going: a plain struct filled by the caller from the simulation |
| `anim/gait_plan.h/.cpp` | step 2: the plan, a pure function plus its small per-body state (the clock and the held footholds) |
| `anim/legs.h/.cpp` | step 3: the feet held where they land, the swing between holds, the hips from the legs, a two-bone solve of its own |
| `anim/animator.h/.cpp` | one `Animator` per drawn body: `tick(intent, dt)` at the simulation's 240 Hz tick, `pose(alpha)` per frame |

- **The output is the game's `BodyPose`,** so the models' rigs and palettes draw it unchanged. The rest-joint loaders (the kid's joint
  map, the hunter's bones) are data, not pose code, and are reused.
- **In N1 the body above the hips is carried at its rest pose,** upright over the pelvis and facing the hips. The trunk, the arms and
  the head are N2's.
- **One launch option:** the world setting `new_animation`, read at launch only. It is set for one launch by E3's `--world
  new_animation=1`, has no key, and takes no flip.
- **With it on,** the runner's and the hunter's poses come from their `Animator`s at `place_figures`, and the first-person camera stays
  the rig's until N2.

## What it reads from the simulation (read only; it writes nothing back, so a kept run replays the same)

- **The runner:** `PlayerState` position (the feet), velocity, yaw (where the view faces), state (on its feet or not); acceleration
  from the velocity over the tick; the floor under a point from `floor_below`.
- **The hunter:** `ChaserPose` pos, heading, speed and its velocity as `DrawnChaser` keeps it; acceleration the same way; the same floor
  probe.

## The gait plan

**Inputs:** the intent (position, velocity, acceleration, facing, on its feet), the body's limbs, its row, and the plan's state (the
gait clock, and each foot's held point).

**Outputs:**
- **per foot:** in stance or in swing, and how far through it (0..1); in stance, the world point it holds; in swing, the point it lifted
  from and the point it will land on;
- **per body:** step length and period, stance share (duty), the hips' facing, the pelvis height and sway.

**The laws, each with its source:**
- **Step length:** Alexander's law, step = 1.15 h (v²/gh)^0.3, at the STANDING hip height. Sourced: Alexander 1976 via Mazzetta &
  Blanco, `ground_*.md` §2.1; the standing h is the second reader's correction in `scout_gaits_any_body.md` §3.3. Period = step / v.
  Below a walking floor (ours) the step shrinks to a stand.
- **Walk or run:** Froude 0.5 (Kram, abstract, `scout_gaits` §3.3). Duty above 0.5 walking (both feet down at once). The run's duty is
  from Dorn's runner at 9 m/s, stance 22-27 % (`ground_*.md` §8), with a straight line to it from Fukuchi's speeds (ours).
- **The foothold:** where the hip will be at the middle of the next stance, i.e. the position plus the velocity times the time to
  mid-stance, offset half the hip width to that foot's side, square to the travel.
  - So a foot lands where the body is GOING: forwards, sideways, backwards, or round a turn, from the velocity alone. This is the
    plan's step 2, ours, on Trico's "foothold at lift" (`scout_shipped_systems.md` §3a).
- **The hips' facing:** the travel when it is within 45 degrees of where the view or the chaser faces; past that, the facing, so the
  feet step sideways or backwards under hips that face forward. The 45 degrees is ours, to be judged by his eye.
- **Stopping:** the swing foot lands beside the other, and both hold.
- **Starting:** the clock starts with the foot on the side of the travel lifting first (ours).

## The legs (step 3), from `scout_ik_and_feet.md` §3

- **The hold:** a foot holds its ball where it struck until it lifts, or until it is more than the unlock radius from where the plan
  wants it: 0.20 m (Holden :1418). It is released by a damper, half-life 0.10 s capped at a quarter of the swing (Holden :1419; the cap
  ours).
- **The swing:** an arc from the lift point to the landing point. Its peak height is from the row (ours, to be checked against
  Fukuchi's toe clearance if the yardstick reaches it).
- **The hips:** their height from the legs (the lowest held foot's reach, less the 0.015 m buffer, Holden :1415) and their sway toward
  the stance foot (ours).
- **The two-bone solve:** written in the module (law of cosines), the knee bending forward of the hip-ankle line, toward the hips'
  facing.

## What the first film shows

Pane E's course and its fixed, lit outside camera: a straight, a turn, a sidestep, backwards, a stop and a start, on flat ground.
- **Old beside new:** the game as it is beside `new_animation=1`, for the runner's model AND the hunter's model, through the same code.
- **What to look at:** the feet planted where they land and the legs stepping the way the body travels; the upper body still at rest
  pose, which the film says.

**Rows, only for what a look cannot show:**
- a planted foot moves at most 1 cm in the world from strike to lift;
- his kept runs replay the same with it on;
- one code path: `git grep` finds none of the old pose functions in `game/anim/`.

## Where I think the plan should be watched (not wrong, but two cautions)

1. **"First person is a camera on the runner's head" (the plan).** Every shipped game read in `b8_gaze_sources_B_2026-11-15.md` §5
   moved its camera OFF the raw head because of the run's bob: Mirror's Edge, Star Citizen, Dying Light. N2 should steady the camera
   apart from the head (Star Citizen's way), not ride the head bone. This is for N2; N1 keeps the rig's camera.
2. **The yardstick cannot score most of N1.** It has no sidestep, backwards, stop, start or walk, and nothing above 4.5 m/s
   (`ground_*.md` §4.1). N1's look is his eye's and the course's. The yardstick scores only the straight run at 2.5-4.5 m/s.

**Unwelcome, named:** with the body above the hips at rest, the first film's upper body will look stiff. That is N2, not a fault of N1.

**One line, as asked:** the runner's arms and legs are drawn today by the OLD function, `Body::pose`. Nothing of mine is on the new
system yet. B8's R1 (on `gait_pose`) is stopped, uncommitted, in `G:\consonance-scratch\dz3-lookback-b`.

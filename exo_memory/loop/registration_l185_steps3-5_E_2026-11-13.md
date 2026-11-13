# L185 steps 3 to 5: registered before any code (pane E, machine D, 2026-11-13)

Packet: the chair, 16:12:13Z ("L185 STEPS 3 to 5, the motors and one reaction … REGISTER first … You may refuse a
step if the plan is wrong for today's main"). Tier: **prove it**. dreamzone-3 has no mutation harness, so each step
gets falsifiers here first, tests red first, hand mutants of my own, and the whole suite plus both self-tests on the
result.

Sources read whole for this: the plan `loop/plan_l185_physics_mesh_2026-11-12.md`, my stop note
`handback/p-l185-skeleton-E_2026-11-12.md`, and on base 31d1c6d:
- `game/ragdoll.{h,cpp}`: 22 kinematic bodies, `DriveToPoseUsingKinematics`, drawn by nothing;
- `game/model_rig.{h,cpp}`: `gait_pose`; the motion block, ~:411-470;
- `game/world/stage.cpp`: the hunter drawn from `gait_pose` → `palette_floats`, :278.

**Branch:** `l185-skeleton` at 31d1c6d, in worktree `C:\Users\nname\Desktop\worktrees\dz3-e-l185`. Steps 1–2 are all on
the base already: `5411ef0` is an ancestor of it, and `origin/l185-skeleton` (`b226b95`) is an older backup.

## 0. Where the plan meets today's main: the order changes, and part of step 5 is refused for now

- **Step 3 collides with C's work in flight.** SIMBICON's foot placement goes in `gait_pose`'s motion block
  (`model_rig.cpp` ~:411-434). That is where "the outside foot set wider" lives. It sits next to "the pelvis on the
  deeper leg" (~:460-470), which C's L205 note (`handback/p-l205-stomp-C_2026-11-13.md` §1) names as the stomp's
  cause, and which C is refitting now. Two panes editing one block at once is a merge we would both lose.
  - **Proposed:** build steps 4 and 5 first, since they touch only `ragdoll.*`, a new conversion and the stage's
    hunter line. Step 3 follows C's L205 landing, or goes earlier as one hook if C says yes through the librarian.
- **Step 5's player half is refused for now: the player has no ragdoll.** Only the hunter has one (step 2). A wall
  brush for the player needs the player's ragdoll, which is L186's steps 2–4 (`plan_l186_physics_player_2026-11-12.md`)
  and not in this packet. Step 5 here is **the catch, for the hunter**.
- **The player's gait in step 3** ("then on the player's gait, with L184") is out of this registration for the same
  reason. B's body is not mine to change without a packet.

## Step 4: the upper body on motors (built first)

**What:**
- The pelvis, spine and leg bodies stay kinematic, keyed exactly as now.
- The chest, neck, head, eye, shoulders, arms and hands become **dynamic**. Motors drive them toward the keyed pose:
  Jolt's swing-twist motors, set each step from the skeleton's target. The sources are Jolt `DriveToPoseUsingMotors`
  (`Ragdoll.cpp`) and `MotorSettings` (frequency and damping). Per-bone strength follows Overgrowth's per-bone physics
  weights (`riggedobject.cpp:1276-1293`).
- The frequencies and dampings are **ours**, set once before the first measured run and named in the hand-back. A
  setting changed after a run is named as such.
- **Drawn:** the hunter's upper body from the ragdoll's bodies; its legs and pelvis from the gait as now. This is the
  first change he can see. It needs `SkeletonWorld` → `BodyPose` for the drawn joints, a new pure function with its own
  round-trip row.

**Rows (registered now, red first):**
- **R4.0 THE CONVERSION ROUND-TRIPS:** a gait pose taken to the skeleton world and back to a `BodyPose` puts every
  joint within 1 mm of the skeleton's rebuild, and the drawn axes (`chest_right`, `head_right`, `right`) within 0.5°.
- **R4.1 PICTURE ONLY:** his 16 kept runs replay with byte-identical output on base and branch (as for L192), and
  `dz-world --selftest` part 7 (drawn with sound, against headless) holds.
  - *Against it:* any output differing. If a motor touched the simulation, I say so plainly and amend nothing.
- **R4.2 THE LEGS STAY KEYED:** with the motors on, every pelvis, spine and leg body is where it was keyed, within 1 mm
  and 0.1° every tick (step 2's key row, kept).
- **R4.3 THE UPPER BODY FOLLOWS:** over the scripted chase (`ragdoll_tests`' run, as `stage.cpp:266-278` draws it), each
  upper body's distance from its target:
  - 95th percentile at most **5 cm** and **15°**;
  - maximum at most **10 cm**.
  - *Against it:* more, meaning floppy or lagging.
- **R4.4 THE FOLLOW-THROUGH IS REAL:** a scripted hard stop (9 m/s to 0 in 0.3 s, straight).
  - Within 0.5 s, the hands' bodies swing past their targets in the direction of travel by at least **5 cm**.
  - By 1.5 s after the stop, they are back within **2 cm**.
  - *Against it:* under 5 cm (motors so stiff it is still keyframe), or not settled (ringing).
- **R4.5 STABLE:** over the chase and a 60 s mixed run:
  - no body faster than 30 m/s;
  - none farther than 0.5 m from its target;
  - no non-finite number.
- **R4.6 THE SAME BITS:** the same input twice gives byte-identical reads.
- **R4.7 COST:** not timed in this lap. The GPU notice stands, and the ragdoll's step is a frame cost; it is read only
  after the librarian's all-clear.
- **Captures** of the hard stop and a turn, for his eye. They are pictures, not timings.

**The unwelcome outcome, in the words that would make it true:** *no motor setting passes both R4.3 and R4.4*. Stiff
enough to follow the hunter's run is too stiff to swing through a stop. If that is what I find, I report it with the
settings tried, and no bar moves to make it pass.

## Step 5: one reaction, the hunter's catch

**What:**
- The chase logs the catch.
- From that tick the upper body's motor strength drops, then ramps back. The shape follows Overgrowth's ragdoll state
  and `WakeUp` (`aschar.as:4850-5110`): strength to **0.15** at once, back to 1 over **1.0 s**. The numbers are ours.

**Rows:**
- **R5.1** The strength is at most 0.15 within one tick of the catch, and back at 1 by 1.0 s.
- **R5.2 VISIBLE:** in the 0.5 s after the catch, the upper body's peak distance from its target is at least **twice**
  its R4.3 95th percentile.
  - *Against it:* less, meaning the reaction cannot be seen.
- **R5.3** R4.1, R4.5 and R4.6 hold through the catch.

**Unwelcome:** *the catch's reaction is invisible behind the death reveal's own camera*. If a capture shows that, it
goes to his eye rather than a bigger number.

## Step 3: SIMBICON foot placement in the target, for the hunter (after C's L205, or a hook C agrees to)

**What:**
- The landing foot's sideways place becomes base + cd·d + cv·v (SIMBICON §3.1-3.3). Here d is the pelvis's offset
  across the heading over the stance ankle, and v is the body's velocity across its drawn facing (`DrawnChaser`).
- **The gains are read from SIMBICON's own table before any code** (L183 recorded the law, not the values). If the
  paper is not obtainable today, they are marked **ours** and the row bars still stand.
- It replaces today's lean-only widening (10 cm at 0.42 rad, ours) only where the two would both act. The registered
  rows say which.

**Rows:**
- **R3.1 WIDER WITH SIDEWAYS SPEED:** with lateral velocity 0, 1 and 2 m/s over a 6 m/s run, the step width grows at
  each speed, and by at least **10 cm** from 0 to 2 m/s.
- **R3.2 A CROSSOVER ON A STRAFE:** on a scripted strafe (lateral at least 2 m/s), a foot lands across the pelvis's line
  at least once per stride.
- **R3.3 NOTHING CHANGES WHEN NOTHING PUSHES:** straight, with no lean and no lateral velocity, the feet land within
  **1 cm** of today's every tick.
- **R3.4** C's L200 rows and the yardstick rows stay green. R4.1 (replays) holds.

**Unwelcome:** *the crossover reads as stumbling in a capture*. That is his eye's call, not a bar.

## Whole-result checks (each step's landing candidate)

- The whole suite (`ctest`), `dz-gym --selftest` and `dz-world --selftest`, under the lock.
- The 16-run replay comparison, base against branch.
- **Hand mutants**, applied by exact text and confirmed changed, reported as `applied N / caught N / NOT APPLIED N`:
  - step 4: the legs made dynamic; motors off; the target one tick late;
  - step 5: no drop; no ramp back;
  - step 3: the cv term's sign flipped.

## What would count against the whole lap

- Any replay output changing.
- Any step's rows needing a bar moved after its first run. If one does, it is amended by name with the measurement
  beside it, never quietly.

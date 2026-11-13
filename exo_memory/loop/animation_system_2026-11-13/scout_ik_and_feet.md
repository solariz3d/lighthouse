# Scout: inverse kinematics and feet on the ground (2026-11-13)

1. The room already has a two-bone leg solve, a height-only floor probe with a hip sink, a world-held foot for the
   player only, a sagittal stance solve on an unlanded branch, and feet with memory on another unlanded branch.
2. The hunter has no world-space foot lock on main: his stance foot is rebuilt from curves in the heading frame every
   frame, so a turn carries it. The player has one (bar 3 cm); the hunter has no row for it.
   [2nd reader: RE-DERIVED in part. "No world-held foot for the hunter" is ground_code.md:67 ("foot placed by curve;
   planted on l205-stomp-c"). "A turn carries it" is [inferred], never measured: see the Second reader section.]
3. New at source: Godot's two-bone and FABRIK solvers (MIT), FABRIK's paper, Holden's foot lock (MIT), ALS's foot
   lock, trace and pelvis offset (MIT). The lock to build is Holden's: lock on strike, release on lift-off or past 0.2 m.
4. One picture-side "contacts" pass after the pose and before the Rig serves all three bodies; it costs a few
   microseconds a character (not measured), and needs no new data, clip or sim change for its first lap.
5. First lap: the hunter's stance foot held in the world, row `a_planted_foot_of_the_drawn_hunter_stays_where_it_landed`.

Scout, read-only. Marks: [read] opened and seen; [summary] another account or a ground file; [inferred] mine; [ours] a
proposal. Game code is dreamzone-3 main 31d1c6d unless a branch is named; `L205` = branch l205-stomp-c 900e3c4
[2nd reader: DOWNGRADED. 900e3c4 is an ancestor; the branch tip is now ccc65ab, three files and 34 lines later. The
cited L205 lines (model_rig.cpp:807, :881-883; model_rig_tests.cpp:1311-1329) read the same at both. Opened.].
`G-code` etc. = the ground files in this folder (`ground_code.md`, `ground_sources_read.md`,
`ground_physics_and_fp_body.md`, `ground_locomotion_and_yardstick.md`, `ground_constraints_and_roster.md`,
`ground_his_words.md`). Outside sources were downloaded with curl at pinned commits and read as text.

## 1. What the room already has for this aspect

His words that set it:
- 156, "kinetic linking, making the whole body work as one. We need to make that but better for all entities and even
  the player character" [read] `briefs/dreamzone2_the_game.md:1114` (G-his-words:337-342). The brief's note under it
  quotes the first game's figure: "legs aimed at planted feet ("feet stay nailed, hips rock over them — that transfer IS
  the weight")" [read] brief:1115. That is the brief's record of his first game's code, not his spoken words.
- 159, "...the legs and feet criss crossing eachother, walking backwards, when the charater rubs up against a wall you
  see their arms and hands touch up against it as you move..." [read] brief:1120 (G-his-words:353-359).
- 155 (the brief's record, not verbatim): "the climb uses Overgrowth's grips (procedural; no clips)" [read] brief:1113.
- 195, "they are stomping when they stride like up down up down up down in a weird goofy way" [read] brief:1514.

Built on main (31d1c6d):
- Hunter leg solve `reach_leg`: two bones, law of cosines, knee toward `fwd`, clamped at 0.9999 of reach [read]
  game/model_rig.cpp:394-409. No soften (the L176 finding, [summary] G-sources:60-63).
- Hunter floor: `apply_motion` probes each ankle, moves ankle and toe by the offset clamped to +-0.45 m, sinks the hips
  up to 0.30 m for the lower foot, re-reaches both legs [read] game/model_rig.cpp:438-475. Wired per frame from
  `place_figures` through `app.floor_below` [read] game/world/stage.cpp:277.
- The probe: one ray from 0.5 m above down 1.0 m, height only [read] game/world/world_app.cpp:120-128. Under it
  `World::raycast` returns a fraction and drops the rest [read] sim/world.cpp:1256-1260, though `Physics::ray` already
  computes a point and a surface normal [read] sim/physics.cpp:547-561. It "moves nothing and is not part of the
  fingerprint" [read] sim/world.h:116-117.
- Player: world TARGETS + `two_bone` (body.cpp:53), the stance foot held in the world by `contact_length` and
  `leg_cycle`'s reach while running straight [read] game/body.cpp:126-131, :262-268; floor height per foot through
  `floor_under`, rejected past 0.45 m [read] game/body.cpp:216-220, :305. Row
  `running_a_planted_foot_stays_where_it_landed`, bar 3 cm, straight run on a flat floor [read]
  game/tests/body_tests.cpp:203-233.
- Player ladder: hands and feet move by a phase about the neck and the feet, not onto rungs [read] game/body.cpp:393-402.
  The ladder is a box (`LadderBox{lo, hi}`) [read] sim/piece.h:21-23; rung spacing 0.30 m is written only as
  the body's own constant [read] game/body.cpp:21-22.
- Hunter on a ladder, a drop or a climb: not posed; only `on_feet` reaches DrawnChaser [summary] G-code:63.
- Existing floor rows: `each_foot_of_a_chaser_stands_on_its_own_floor_and_the_hips_sink_for_the_lower_one` (an 18 cm
  step up, 15 cm down) [read] L205 game/tests/model_rig_tests.cpp:389-421, the same row on main [summary] G-code:268.

Built, not on main:
- L205's stance leg: `plant` solves thigh and knee to a foot swept from the strike place to the take-off place in the
  hip's own sagittal plane, eased near straight (`kKneeEaseFrom`, `kKneeStop`, OURS) [read] L205 model_rig.cpp:807-842.
  It holds the foot on the floor vertically: row `a_foot_down_stands_on_the_floor` checks height only, 2 mm from 5.5 m/s
  [read] L205 model_rig_tests.cpp:1311-1329. No row checks the foot's sideways or forward slide in the world [read: grep
  for slid|slip|skate in that file finds only an unrelated "tilted, not slid" at :326].
- Feet with memory (Overgrowth `movementobject.cpp:2627-2631`, Apache-2.0): lag capped at 0.1 m, eased 0.8 a 1/120 s
  tick; green at 55d1451, parked behind L200 [read] loop/registration_l180_lap2_rest_C_2026-11-13.md:10-36;
  handback/p-l180-lap2-rest-C_2026-11-13.md:5-10. Its own falsifier: "The feet with memory look worse on his stairs than
  the feet without it, so step 1 is reverted" [read] registration:60.
- L185 step 3 (SIMBICON foot placement in the target) registered, never built, waits on L205 [summary] G-physics:205, :231.

Read by the room at source already (I build on these and do not re-research them):
- ozz `sample_foot_ik.cc`: ray from 0.5 m above the ankle, ankle on the slope by the hit normal, pelvis down by the
  most any ankle must drop, two-bone then ankle aim; `ik_two_bone_job.h` soften/weight/pole [summary] G-sources:51-63;
  handback/p-l176-openanim-C_2026-11-12.md:~~58-66~~ [2nd reader: :71-75 and :85; lines 58-66 are the Overgrowth
  "Feet" and "Climb" notes, not ozz; opened]. The soften formula [summary] handback/p-l191-arm-shape-C:127-128.
- Overgrowth foot IK: swept sphere 0.2 m above to 0.6 m below, memory, tilt to normal, the stepping planner in
  `aschar.as:11726-11831` (feet planted until the body moves far enough, then a sine arc), and `ledgegrab.as` grips:
  hands at phases 0 and 0.5, feet 0.1 and 0.6, hands lift 0.1 m, body offset the weighted mean of grips
  [summary] handback/p-l176-openanim-C:~~35-56~~ [2nd reader: :35-47 for Overgrowth's feet, planner and grips; the
  line numbers after :47 are not Overgrowth. Opened].
- Holden `spring.h` damper and inertialization [summary] G-sources:65-75; the damper is on main as `closed_share`
  [read] game/model_rig.cpp:493-495.

What the ground files are thin on, so I read it myself: the hunter's world-space foot behaviour (no ground file says
whether his stance foot slides; I read apply_motion and L205's plant above), and the ladder data (above).

## 2. What I read at source that is NEW

Licences: every licence below I read as its file text at the commit given. All four code bases are MIT: commercial use
allowed; the notice must be kept only if code is copied or substantially copied; no share-alike; redistribution allowed.
The room's practice is to restate, not copy, and cite in a comment; I propose the same. "Use the idea" for all.

**S1. Godot `TwoBoneIK3D` and `FABRIK3D` (master 960f4db5).** Licence: MIT, `LICENSE.txt` lines 1-20 [read]
https://raw.githubusercontent.com/godotengine/godot/960f4db5be16e2f1f7b46f9db7c824c2e0af1035/LICENSE.txt
- Two-bone: the same circle intersection as our `reach_leg`; "Result is straight" past reach, no soften [read]
  scene/3d/two_bone_ik_3d.cpp:793; target pushed out when nearer than |l1-l2| (:799-805); `a = (l^2 + r1^2 - r2^2)/(2l)`
  (:821); of the two knee places, the one nearer the pole node (:831). So Godot confirms our solve and adds nothing
  but the |l1-l2| push-out, which `reach_leg` already has (`len = max(len, |thigh-shin| + 1e-4)`) [read] model_rig.cpp:403.
- FABRIK: a backward pass from the target to the root, then a forward pass from the root, each joint put on the line to
  its neighbour at its bone length (`limit_length`) [read] scene/3d/fabr_ik_3d.cpp:36-60, :62-86.
- Iteration defaults: `max_iterations = 4`, `min_distance = 0.001`, `angular_delta_limit` 2 degrees per iteration
  [read] scene/3d/iterate_ik_3d.h:280-283. With `deterministic` off it re-solves from the last frame's result
  (`simulation_dirty` only re-inits once) [read] scene/3d/iterate_ik_3d.cpp:456-462; it stops early once the target was
  reached last time (:591-595). [inferred] Warm-starting makes the picture depend on frame history; we would always
  start from the producer's pose (Godot's `deterministic` path).

**S2. Aristidou & Lasenby, "FABRIK: A fast, iterative solver for the Inverse Kinematics problem", Graphical Models
73 (2011) 243-260.** The authors' copy, http://www.andreasaristidou.com/publications/papers/FABRIK.pdf, 17 pages, text
by pdftotext. Licence: "© 2011 Elsevier Inc. All rights reserved" [read] p.1. Use the idea only; no text or figure.
- Algorithm 1: unreachable target, stretch toward it; else alternate forward reaching (end to target) and backward
  reaching (root back to its place) until the end is within `tol` [read] fabrik.pdf p.~~246~~ [2nd reader: p.245-246, the listing starts on 245; OK], Algorithm 1 lines 1.1-1.41. [2nd reader: the paper calls the end-to-target pass "forward reaching"; Godot (S1) calls the same target-to-root pass "Backwards". Same method, opposite names.]
- Multiple end effectors: solve each chain inward to its "sub-base", put the sub-base at the centroid of the positions
  the chains give it, then outward [read] p.247, §4.1.
- Cost, 10-joint chain, MATLAB on a 2.2 GHz Pentium Dual: FABRIK 15.5 iterations, 0.86 ms an iteration; CCD 26.3;
  Jacobian methods 800-1311 [read] p.~~254-255~~ [2nd reader: p.254; Table 1 is on journal page 254, rows read: FABRIK
  15.461 / 0.86 ms, CCD 26.308, Jacobian 808.8-1311.2. OK. The text says "No optimisations were used", MATLAB, unreachable
  case 67.6 / 390 / 2808+ iterations], Table 1. CCD "can roll and unroll itself before reaching the target"
  [read] p.253. [inferred] For our 2-3 bone limbs these numbers bound nothing useful; the point is that FABRIK works on
  joint POSITIONS, which is what `BodyPose` holds and what `Rig::palette` aims bones from ([summary] G-code:75).

**S3. ozz `ik_two_bone_job` (master 744eb9d), the soften read whole.** Licence MIT, `LICENSE.md` lines 1-22 [read]
https://raw.githubusercontent.com/guillaumeblanc/ozz-animation/744eb9d99f606eda849acb0b1204f7a3dc20bca1/LICENSE.md
- `soften` default 1 (off) [read] include/ozz/animation/runtime/ik_two_bone_job.h:96; the foot sample's slider also
  starts at 1 [read] samples/foot_ik/sample_foot_ik.cc:753. So ozz gives the mechanism, no sourced "on" value.
- The pole warning: the chain "will flip when target vector and the pole vector are aligned/crossing each other. It's
  caller responsibility" [read] ik_two_bone_job.h:82-84.
- The soften curve is `1 - 3^4/(alpha+3)^4` (:154) on reciprocal ESTIMATES (`RcpEstX`) [read] ik_two_bone_job.cc:131-163.
- New in the sample beyond the room's reads: foot height 0.12 m default [read] sample_foot_ik.cc:750; the slope ankle
  is placed by Thales from the hit, `ankles_target_ws_[l] = C` [read] :240-250.
  [2nd reader: foot height 0.12 at :750 is new (OK). The Thales placement is RE-DERIVED: ground_sources_read.md:53 lists
  `sample_foot_ik.cc:207-255` as read, and handback p-l176:73 records "corrected along the slope so the foot lies on it".
  Likewise `soften` default 1 at ik_two_bone_job.h:96 sits inside the room's read of :85-100 (ground_sources_read.md:54).
  Verified at primary: soften 1 at h:96 OK; slider 1.f at sample_foot_ik.cc:753 OK; curve in .cc:154 OK; pole text
  h:81-84 OK (the room's read stopped at :85, so the pole warning is new).]

**S4. Holden, Motion-Matching `controller.cpp` (57b7250e), the foot lock.** Licence MIT, `LICENSE` lines 1-21 [read]
https://raw.githubusercontent.com/orangeduck/Motion-Matching/57b7250e0d34a4e456a34d47e24c2f05fdcc711e/LICENSE
- `contact_update` [read] controller.cpp:796-874: on a contact's rising edge, lock at the foot's current drawn place
  with its height set to the foot height (:838-853); while locked the target is the lock point with zero velocity
  (:826-827); unlock when the contact ends OR the lock is further than `unlock_radius` from where the animation has the
  foot (:833-834, :858-870); both edges are inertialized (offset decays by half-life), so neither pops.
- Defaults [read] :1415-1419: `ik_max_length_buffer = 0.015f`, `ik_foot_height = 0.02f`, `ik_toe_length = 0.15f`,
  `ik_unlock_radius = 0.2f`, `ik_blending_halflife = 0.1f`.
- The locked CONTACT bone is the toe (ball), not the ankle (:1421-1423); the heel is solved by two-bone to the toe
  target plus the animation's heel-to-toe offset, then the heel turned so the toe faces the lock (:2013-2034); the
  contact is clamped never below the floor (:1997). Two-bone is clamped at full length less 0.015 m (:914-923).
  [2nd reader: DOWNGRADED. All OK at primary, but "the floor" is the plane y = 0: the lock height is the constant
  `ik_foot_height` (:844, :1997 `maxf(y, ik_foot_height)`). Holden's source has no ground query, no slope, no stair, no
  pelvis move. It is evidence for the lock's edges and inertialization only, not for anything the stairs need.]
- The contact flag comes from data (`db.contact_states`) [read] :1286. [inferred] Ours would come from the gait phase.

**S5. ALS-Community `ALSCharacterAnimInstance.cpp` (d044fcd9), foot lock + trace + pelvis.** Licence MIT, `LICENSE`
lines 1-21 [read] https://raw.githubusercontent.com/dyanikoglu/ALS-Community/d044fcd9da572212be8de76f4d248063695a38d2/LICENSE;
the README says "Source code of the plugin is licensed under MIT" [read] README.md:37-38 (the project's own art and
animations are not covered by that line; I propose none of them).
[2nd reader: licence OK, LICENSE.md is the MIT text, 22 lines, copyright "Doğa Can Yanıkoğlu & LongmireLocomotion".
UNSUPPORTED in the parenthesis: README.md:37-38 says only "Source code ... MIT"; it says nothing about art or
animations. Also: the file is an Unreal Engine plugin and needs UE types; idea only, which the scout proposes.]
- The lock alpha may only fall, or snap to 1: "the foot can only blend out of the locked position or lock to a new
  position, and never blend in" [read] anim.cpp:374-378.
- A locked foot is held by subtracting the capsule's own travel and turn each frame (velocity x dt, yaw delta) [read]
  anim.cpp:398-423. [inferred] Same as holding it fixed in world space.
- The trace: from 50 cm above to 45 cm below the foot at root height [read] ALSAnimationStructLibrary.h:487-490
  (the file in Source/ALSV4_CPP/Public/Library/); target = ~~hit + normal x foot height~~ [2nd reader: an OFFSET, (hit + normal x foot height) minus (flat foot place + foot
  height), anim.cpp:518-519] (13.5 cm, :480) [read] anim.cpp:518;
  foot pitch and roll from atan2 of the normal (:~~521-522~~ [2nd reader: :522-523]).
- Asymmetric rates: foot offset eased 30/s going down, 15/s up (:528); pelvis to the LOWEST foot's offset, 10/s up,
  15/s down (:436-440); in the air ~~both reset at 15/s~~ [2nd reader: the foot offsets reset at 15/s (:449-460); the pelvis
  is fed zero targets through `SetPelvisIKOffset` (:331) and so returns at the pelvis's own 10/s up, 15/s down (:439)]
  (:331-335, :449-460). These are `VInterpTo` speeds, stepped by the
  frame's dt [read]; [inferred] they are frame-rate dependent (UE's interp source not read here).
- Its lock is driven by animation CURVES authored in clips (`FootLock_L`) [read] :350-372. We have no clips.

## 3. The design: one "contacts" pass for every body [ours, built from S4, S5, ozz and Overgrowth]

Where it sits [ours]: after the pose producer and before the retarget. Hunter and chasers: after `gait_pose` in
`WorldStage::place_figures` (stage.cpp:270-280), state beside `hunter_phase_` (stage.h:142), per id once lesser kinds
get models (the `ease_` per-id table is the pattern, [summary] G-code:225-226). Player: inside `Body::pose` per sim tick
(body.cpp:222), so a recorded run replays its picture too. One pure function in `game/model_rig.*`; it writes only
`BodyPose` and its own state. Nothing reaches `sim::`, `chase::` or a hash. [inferred] So R4.1 and self-test part 7
([summary] G-constraints:46-53) keep holding by construction; they stay the rows that prove it.

Inputs:
- the producer's `BodyPose` (21 joints) and the rest skeleton (limb lengths, foot height `ha`, ball length `ball`, as
  L205's `plant` derives them from the model, [read] L205 model_rig.cpp:813-814);
- per end (2 feet now, 2 hands later) a CONTACT flag from the producer: hunter `u <= stance` per leg (the same test
  L205 uses, [read] L205 model_rig.cpp:881-883; main has `kStanceShare` at model_rig.cpp:775); player `leg_cycle`'s
  planted half (body.cpp:265-268); standing, both;
- the frame's dt and a "teleported" flag (root moved > 1 m: E's re-placement rule, ours, [summary] G-physics:93);
- the ground query, read-only: the existing `floor_below(at, &y)` for the first laps; later a sibling that also
  returns `Physics::ray`'s normal (a const sim/ addition, A's lane: a separate, asked-for change).

Per end, per frame [ours unless marked]:
1. Rising contact edge: lock the BALL (toe joint) where it is drawn, its height from the floor probe (Holden locks the
   toe, S4 :1421-1423, :838-844). On a stair, probe under the ball AND under the ankle and stand the foot on the higher
   of the two [ours, small; Overgrowth's swept sphere is the sourced way to the same "highest under the foot",
   [summary] p-l176:36]. This keeps a toe out of a riser going up and lets the heel hang over a nosing going down.
   [2nd reader: p-l176:36 is true for the sweep (0.2 m above to 0.6 m below, :2619-2621). That a swept sphere gives
   "the highest under the foot" is [inferred], not in the handback; and "keeps a toe out of a riser", "lets the heel hang"
   are [ours] predictions with no source. Holden's lock height (S4) is the flat constant, so step 1 is wholly [ours].]
2. While locked: the ball's target is the lock point (S4 :826; S5 :398-423). The ankle target is the lock point plus
   the producer's own ankle-to-ball offset (S4 :2013-2024), so the foot keeps the producer's pitch (L205's toe-down).
3. Release on the falling edge, or when the producer's ball is more than `unlock_radius` from the lock (S4 :833-834).
   The offset (lock minus producer) then decays by Holden's damper (`closed_share`, already on main) so the swing
   starts where the foot was. Lock alpha only falls or snaps to 1 (S5 :374-378): no foot ever eases INTO a lock.
4. Re-reach: hips sink for the lowest locked foot (the existing sink, ozz's rule, [summary] p-l176:~~61~~ [2nd reader:
   :74]), then
   `reach_leg` for both legs, clamped at full length less 0.015 m (S4 :1415, :914-923) instead of 0.9999.
   [2nd reader: the sink only moves the hips DOWN (model_rig.cpp:459-468, 0 to 0.30 m; the player's body.cpp:477, 0.12 m).
   A locked ball up to 0.20 m from where the producer's hip expects it, with the hips unable to rise, can lie beyond
   reach; then `reach_leg` pulls the foot off its lock. No row below catches a foot that floats at the clamp.]
5. Off the feet (hunter `Gait::Drop`, player Air/Dive): all locks release; the floor memory eases back to the producer's
   own heights (ALS resets in the air, S5 :331-335; we use the damper, not `VInterpTo`).
6. Floor height memory under each foot: Overgrowth's lag cap and ease, as already built at 55d1451 (above). On the
   flat it changes nothing (that registration's own claim, registration:35-36).
   [2nd reader: CONFLICT with F3's bar. The memory by design leaves a foot BELOW a risen floor: registration:28-30 reads
   "short of the new floor by 0.083 m" the frame after a 0.18 m step, and :16-17 the lag cap is 0.1 m. F3 below demands
   never more than 1 cm into the floor. On every riser either F3 is red or the memory is off for locked feet. The
   scout does not say which wins; the registration's own falsifier (:58-60) says his eye decides.]

Parameters (five), with their defaults:

| parameter | default | source |
|---|---|---|
| unlock radius | 0.20 m | Holden controller.cpp:1418 [read]; scaled by hip height for the 2.15 m hunter: [ours], not proposed |
| release half-life | 0.10 s, capped at a quarter of the swing's time | 0.10 Holden :1419 [read]; the cap [ours]: at 9.9 m/s a step lasts 1/13.73 s ([summary] G-sources:265-266) and stance 0.09-0.125 s ([summary] G-loco:306), so an uncapped 0.10 s would still be mid-release at the next strike [inferred] [2nd reader: DOWNGRADED. 13.73 a second is the game's hunter measured at add21fe (handback p-l180-lap2:80-81), not re-measured at main or L205; 0.09-0.125 s is a HUMAN sprinter's contact ([summary] G-loco:306 of SR:544-548, not opened by me). The two cannot both hold for one runner: a step of 0.073 s is shorter than a 0.09 s contact. The cap's conclusion survives; its premise is two numbers from two species] |
| reach buffer | 0.015 m | Holden :1415 [read] |
| floor memory | lag <= 0.1 m, 0.8 per 1/120 s | Overgrowth movementobject.cpp:2627-2631 [summary] registration_l180_lap2_rest:12-19 [2nd reader: DOWNGRADED. The registration says the 1/120 s tick is [inferred] from `aschar.as:7925` (registration:19-21); the scout drops that mark] |
| probe window | 0.5 m above, 1.0 m span; offsets past 0.45 m ignored | main as built [read] world_app.cpp:123; body.cpp:218; ozz's 0.5 m [read] sample_foot_ik.cc:97 |

Foot height and ball length come from each model's rest bones, not a knob [read: L205 does so, model_rig.cpp:813-814].

What it does on a STAIR [inferred from the generator's numbers]: risers 0.175 m, treads 0.28 m, spiral risers
0.219 m [read] gen/README.md:51-52. A hunter's step is 0.72 m at 9.9 m/s ([summary] G-sources:265-266), so a stride
spans 2-3 treads and a foot lands anywhere on a tread. The lock holds the ball where it lands; the two probes keep it on
a tread; the hip sink and memory carry the body over. Tread-targeting (stretching a step to land mid-tread) is not in
this design (section 6).

What it does at a LADDER [ours, sourced shape]: hands and feet become four contacts on rungs, with Overgrowth's grip
rhythm (hands 0 and 0.5, feet 0.1 and 0.6 of the climb cycle; hands lift 0.1 m) [summary] p-l176:~~48-51~~ [2nd reader: :45; and the source is `ledgegrab.as`, a LEDGE climb of a wall, not a rung ladder (p-l176:43-47): species DOWNGRADED]. A grip locks on
a rung exactly as a foot locks on a floor. BLOCKER: rung heights are not data today: the ladder is a box `{lo, hi}`
(sim/piece.h:21-23) and 0.30 m is only the body's own constant (body.cpp:21-22); where the first rung sits was not
found in the generator (~~`git grep -i rung` hits only audio and body code~~ [2nd reader: WRONG. On main it also hits gen/README.md:161 and :336, gen/CHANGES.md:295, gen/src/emit.cpp:536-539, core/scene.h:24, chase/chaser.cpp:22. They say the generator emits a ladder as ONE FLAT BOARD, 0.5 m wide, 4 cm proud, with NO rungs at all, "until a scene can hold detail that does not collide". body.cpp:21 comment "ladders are drawn at this spacing" is contradicted by the generator, [inferred] stale]) [read]. A ladder lap must first get rungs
as data (~~or a probe that finds them~~ [2nd reader: a probe cannot find rungs that do not exist; the only options are virtual rungs at 0.30 m from the box base, [ours] and unsourced, or non-colliding rung detail in the scene, which gen/README.md:336 lists as not built]); until then the player's hands stay as they are. For the hunter the producer itself
is missing (`Gait::Ladder` unposed), so the ladder is a later lap, not this layer's first.

Drops and chutes: off the feet, nothing locks (step 5). A chute or slide is "follow the floor, never lock" [ours]: the
flag stays off while the player's move is Slide, so the leading leg can slide (item 173's "show the leading leg in a
slide" is L188 step 2's, [summary] G-physics:244).

Doorways: nothing special for the feet. Hands on a door frame or a wall are L188 step 5's `HandOverride` hook
([summary] G-physics:122-123); this layer can lock those hands too once a wall probe exists.

Hands and FABRIK: a hand on a rung over the head, or the crawler on all fours, wants more than two bones (chest and
shoulder joining the reach). FABRIK on positions fits `BodyPose`; FABRIK §4.1's centroid sub-base fits a pelvis between
two locked feet and two locked hands. Start every frame from the producer's pose, at most 4 iterations, 1 mm tolerance
(Godot's defaults, S1). Not in the first laps.

Cost per character per frame [inferred; nothing timed anywhere in the record, G-physics:259]:
- lock bookkeeping, 2 feet: 2 `exp` (damper), 2 distances, 2 `reach_leg` (2 sqrt, ~60 flops) = well under 1 us;
- rays: main already fires 2 per hunter per frame (stage.cpp:277; model_rig.cpp:438-447) and the player up to 4 per
  tick ([summary] G-code:247-249). A locked foot needs no ray (its floor does not move), so steady running needs rays
  only at strikes and in swing: about 2-4 rays a frame worst case, fewer on average;
- one Jolt ray against static geometry: not measured here or in the record; at an assumed 1-3 us each, 2-12 us a
  character, so ~~24 characters~~ [2nd reader: UNSUPPORTED, no source for 24 bodies; no chaser cap found in ground_*.md or by `git grep` on main for kMaxChasers] at worst about 0.3 ms of CPU. That is why the rows below include a timed one;
- [ours] beyond the nearest two or three bodies (his `entity_bodies-2`, "Nearest two or three full detail" [read]
  brief:1274-1276 via G-his-words:569-571) a chaser uses its feet height and no rays.
- FABRIK, if used: 4 iterations x 5 joints x (1 sqrt + ~10 flops) = under 1 us.

One layer, three bodies:
- Hunter: contacts from the gait phase; the lock is new; floors and sink exist.
- Lesser chaser: the same function with no change once it is posed through `gait_pose` (G-code:189-195: gait_pose is
  hunter-free). The pack's T4 fixed rhythm and the sprinter's T3 change the producer, not this pass [inferred]. A
  crawler is the four-contact case (hands too).
- Player: the straight run already holds by construction (body.cpp:126-131); the pass adds the hold through turns,
  crossovers and stairs, and the stair probes. Its clock is the sim tick, the hunter's the frame; the function takes dt
  and does not care [inferred]. The camera must stay untouched: the pass edits legs and hips below the neck only, and
  `the_camera_moves_exactly_as_it_did_without_a_body_over_the_whole_gym_run` ([summary] G-code:292) stays the proof.

Failure cases, and the row that would catch each [ours, rows named in the room's style]:

| failure | row (bar) | red today? |
|---|---|---|
| F1 stance foot slides along the floor (turns, lean's wider foot, a stance sweep that does not match travel) | `a_planted_foot_of_the_drawn_hunter_stays_where_it_landed`: ball moves <= 3 cm in the world from strike to lift-off (the player's own bar, body_tests.cpp:~~233~~ [2nd reader: :231]) [2nd reader: the player row decides "down" by an INDEPENDENT test, ankle height under ankle_height + 1e-3 (body_tests.cpp:219) and guards `contacts >= 6` (:230). This row decides "contact" by the pass's own flag and has no count or turn-rate guard: see Second reader] | expected red, see section 4 |
| F2 a pop at lock or release | no joint of the drawn hunter moves more than the existing jump bound between frames across a lock or release (L205 row `no_joint_jumps_as_the_hunter_stops_or_sets_off` pattern) | green expected; guards the fix |
| F3 toe in a riser, heel floating over a nosing | on a scripted 0.175/0.28 staircase floor (the model_rig_tests:389 pattern), the drawn ball and ankle are never more than 1 cm into the floor under them, and a locked foot never more than 2 cm above both probes | likely red going up today (one probe, at the ankle) [inferred] |
| F4 knee snaps straight at full reach | the knee angle changes <= 2 degrees between neighbouring samples as a target passes full reach (L205's knee-jump bar, model_rig_tests:1334-1350) | unknown |
| F5 knee flips sideways (pole crossing, S3 :82-84) | over the gym run and the flee bot, every knee stays on the forward side of its hip-ankle line | unknown |
| F6 a leg stretched past its length while locked in a sharp turn | `limbs_keep_their_lengths` over the recorded case (exists, model_rig_tests) | green expected |
| F7 probe misses (drop edge, chute) and the foot snaps | when the probe returns nothing, the foot's height eases, never jumps more than the F2 bound | unknown |
| F8 the picture leaks into the sim | his 16 kept runs byte-identical; self-test part 7 | green by construction |
| F9 frame-rate dependence | the flee bot drawn at 60, 144 and 360 frames a second: the same strikes' lock points within 1 cm [2nd reader: at 60 fps the first flagged frame is up to 1/60 s after the true strike; Holden locks "where the foot is drawn" (S4 :838-844), so the lock point can differ by that frame's foot travel; 1 cm may be unreachable without a fix the scout did not name] | unknown |
| F10 cost | median us per character per frame for the pass with DZ_BENCH=1 (R4.7's pattern, G-physics:195) | not run |
| F11 hands off rungs (later) | in its grip phase each hand within 2 cm of a rung | needs rung data |

## 4. The FIRST lap: the hunter's stance foot held in the world

Smallest piece [ours]: lock and release for the hunter's two feet on the existing height-only probe; no stairs pair, no
hands, no FABRIK, no sim change.

Order of landing [inferred from the branch state]: L205 rewrites the stance leg and the motion block of `gait_pose`
([summary] G-physics:231; G-loco:99-116), and 55d1451 edits the same floor block. Build this lap after L205 lands, on
top of `plant`'s output; fold 55d1451's memory in as its rebase lands (the memory is input 6 above).

Files:
- `game/model_rig.h/.cpp`: a `FootLocks` state struct and `lock_feet(BodyPose&, const rest&, contacts, FootLocks&,
  FloorProbe, dt)`; `gait_pose` gains an optional out-parameter for the two contact flags, defaulted so every caller
  compiles (L205's `yield` default is the precedent, [summary] G-code:349).
- `game/world/stage.h/.cpp`: the state beside `hunter_phase_`; reset when the hunter is first placed or jumps > 1 m.
- `game/tests/world_app_tests.cpp`: the recorded-case row. `game/tests/model_rig_tests.cpp`: unit rows (a locked foot
  holds while the root moves 0.15 m; it releases past 0.20 m; no jump at either edge; limbs keep their lengths).

The row, red first: `a_planted_foot_of_the_drawn_hunter_stays_where_it_landed`. Case: the flee bot, seed 1, brutal,
drawn at 144 frames a second, exactly as `hunter_lean_trace` replays it [read] game/tests/world_app_tests.cpp:919-960
(and a kept run through `DZ_LEAN_RUN`, as that row allows). Each frame: advance the stage's phase as stage.cpp:269
does, pose with `gait_pose` and the app's floor probe, read each foot's contact flag; across each contact of 2 or more
frames, the furthest the drawn ball (toe joint) moves horizontally from where it was at the strike. Bar 3 cm, the
player's bar (body_tests.cpp:~~233~~ [2nd reader: :231]). Print the worst, its speed and the turn rate at it.

Why it should be red today [inferred from the code read, not measured]: on main the stance ankle is rebuilt each frame
by FK from the curves in the heading frame and then moved by the floor and lean blocks (model_rig.cpp:420-475); no
world point is remembered. In a corner the heading turns during the stance and carries the foot round; the outside foot
is also pushed 10 cm wider as the lean grows (:429-436). On L205 `plant` sweeps the foot in the hip's sagittal plane
by the shape's own sweep (L205 :808-811), still not tied to the world.
Falsifier, written now: if the row measures under 3 cm on the recorded case before any change, the lock is not needed
there and this lap stops at the row; if green needs any number beyond the five in section 3, the lap is degenerating.
Tier: geometry, so "prove it" by his CLAUDE.md rule: test first, mutation run on model_rig.cpp, full suite at landing.

## 5. What only his eye decides, and the fewest clips

His eye decides what is elegant and what is creepy; no row does. Three clips, at full frame rate and lit, each beside
CURRENT main as the "before" (~~his item 216 ruling~~ [2nd reader: the ROOM's ruling under item 216; his words there are only "i think we devolved a shit ton with that artifact", brief:1603; the ruling is the "Done, 14:4x" bullet, brief:1606, and it says to film once l205-stomp-c is on main], brief:1605-1606, [summary] G-constraints:159-161):
1. The flee bot's sharpest turn (capture-lean's pick, offscreen_models.cpp:316-324 [summary] G-constraints:142-143),
   outside camera, feet in frame, real speed then a quarter speed: main vs locked feet. Decides: do held feet read as
   weight ("feet stay nailed, hips rock over them") or as sticky at a 0.1 s stance?
2. A staircase up and down, side camera: main vs two probes + memory. Decides: the "feet with memory look worse on his
   stairs" question that 55d1451 registered (registration:60) and whether the heel hanging off a nosing reads right.
3. First person, looking down while strafing into a crossover and onto stairs (item 159's own view). Decides whether
   the player's pass is worth its rays.
One option to SHOW, not build [ours]: for the hunter's greyhound turn (his T1 pick, [summary] G-his-words:414-416), a
longer-held outside foot that pivots under him. It is a physical, human-derived move bent toward "monstrous" grip (his
217 method, brief:1607); his eye says whether it reads as uncanny or as a bug.

## 6. What I would NOT build, and why

- Jacobian or full-body IK: hundreds to over a thousand iterations on a 10-joint chain (FABRIK Table 1, S2); our limbs
  are 2-3 bones and have closed forms.
- CCD: it "can roll and unroll itself" (S2 p.253).
- Warm-started iterative IK (Godot's default, S1): the picture would depend on the frames before it.
- Foot locks from authored curves (ALS, S5) or contact data (Holden, S4): we have no clips; the gait phase is the flag.
- ALS's `VInterpTo` rates (S5): frame-rate dependent [inferred]; Holden's exact damper is already on main.
- Foot pitch from the hit normal on stairs (ozz, ALS): the normal at a nosing edge is a riser's or a tread's at random
  [inferred]; the two-probe height rule handles stairs; the normal is for ramps later.
- A new swept-sphere probe in sim/ (Overgrowth): two rays first; ask for it only if F3 stays red on spiral stairs.
- Tread-targeting (stretching steps to land mid-tread): no source read for it here, and the stride law is sourced.
- Toe bending at push-off: the MPFB `ball_*` bones are not aimed by `standard_aims` ([summary] G-code:84) and ride the
  foot; a toe aim is a Rig change for later.
- SIMBICON foot placement: that is L185 step 3's, a physics layer, not this pass.
- Anything that writes to the simulation, or a probe that is not const.

## What I did not open

- E's soft-key clone (dz3-e-l185) and the 55d1451 code itself (known only from its registration and hand-back).
- Overgrowth's sources (the room's reads are cited, not re-read); Unreal Engine's `VInterpTo` source.
- FABRIK's §4.3-§6 beyond the lines cited (joint limits, cone constraints, full results).
- Godot's `chain_ik_3d.cpp`, `ik_modifier_3d.cpp`, `two_bone_ik_3d.h` beyond the solve; ozz's `ik_aim_job`.
- Holden's `inertialize_update`/`inertialize_transition` bodies (the room read spring.h); his `ik_look_at`.
- The game's `chase/chaser.cpp` ladder motion, the stair generator's code, `offscreen_models.cpp`, `kid.glb`.
- No frame or ray cost was measured; every cost above is an estimate.

## Second reader

Adversarial second reader, read-only, 2026-11-13. Primaries opened: the game at main 31d1c6d and branch l205-stomp-c (tip
ccc65ab) by `git show`; the five outside sources downloaded with curl at the scout's pinned commits and read as whole
lines (godot 960f4db5, ozz 744eb9d9, Holden 57b7250e, ALS d044fcd9, the authors' FABRIK pdf by pdftotext); the brief and the
handbacks named. No game tool run. Line numbers in the table are the scout's ORIGINAL lines, before my in-place marks
shifted the file.

| # | scout line | claim | primary opened | verdict | evidence |
|---|---|---|---|---|---|
| 1 | 14 | L205 = l205-stomp-c 900e3c4 | git rev-parse | DOWNGRADED | tip is ccc65ab; 900e3c4 is an ancestor; cited lines read the same |
| 2 | 22 | item 156 quote | brief:1114 | OK | text matches |
| 3 | 24 | first game "feet stay nailed" is the brief's record | brief:1115 | OK | a note under 156, not his words |
| 4 | 26 | item 159 quote | brief:1120 | OK | text matches |
| 5 | 28 | item 155 climb by grips | brief:1113 | OK | "the climb uses Overgrowth's grips (procedural; no clips)" |
| 6 | 29 | item 195 quote | brief:1514 | OK | text matches |
| 7 | 33 | reach_leg two bones, 0.9999, no soften | main model_rig.cpp:394-409 | OK | `full = (thigh+shin)*0.9999f`, :399 |
| 8 | 35 | apply_motion probes, clamp 0.45, sink 0.30 | main model_rig.cpp:438-475 | OK | :442, :466 |
| 9 | 36 | wired per frame from place_figures | main stage.cpp:277 | OK | `motion.floor = ... app.floor_below` |
| 10 | 38 | probe 0.5 m above, 1.0 m down, height only | main world_app.cpp:120-128 | OK | kAbove 0.5, kSpan 1.0 |
| 11 | 39-42 | raycast drops point; Physics::ray has point and normal; not in fingerprint | sim/world.cpp:1256-1260, physics.cpp:547-561, world.h:116-117 | OK | `out.normal = ...surface_normal` :559 |
| 12 | 43-46 | player two_bone, contact_length, floor_under rejects past 0.45 | body.cpp:53, :126-131, :216-220, :305 | OK | leg_cycle is :263-269 (off by one) |
| 13 | 46 | row bar 3 cm, flat straight run | body_tests.cpp:203-233 | OK | `worst < 0.03f` is :231, not :233 |
| 14 | 48 | player ladder is a phase about neck and feet | body.cpp:393-402 | OK | hands `neck + ... up*(0.22+0.14a)` |
| 15 | 49 | ladder is a box LadderBox{lo,hi} | sim/piece.h:21-23 | OK | struct as stated |
| 16 | 52 | existing floor row, 18 cm up, 15 cm down | model_rig_tests.cpp:389-421 | OK | stands STILL at speed 0, phase 0: no stride |
| 17 | 56 | L205 plant sweeps foot in sagittal plane | l205 model_rig.cpp:807-842 | OK | comment :801-806 |
| 18 | 57 | row checks height only, 2 mm from 5.5 | l205 tests:1311-1329 | OK | `if (v >= kSprintBy) most <= 0.002f` |
| 19 | 58 | no slide row; only "tilted, not slid" :326 | grep main and l205 tests | OK | main too: only body_tests:202-203 |
| 20 | 59-62 | memory capped 0.1 m, green 55d1451, falsifier :60 | registration:10-60; handback:5-10 | OK | quote at :60 |
| 21 | 61 | eased 0.8 per 1/120 s tick | registration:19-21 | DOWNGRADED | the tick is [inferred] there; mark dropped |
| 22 | 67 | ozz foot IK summary at p-l176:58-66 | handback p-l176 | WRONG | it is :71-75, :85; 58-66 are Overgrowth notes |
| 23 | 70 | Overgrowth foot/grips summary p-l176:35-56 | handback p-l176 | WRONG | it is :35-47 |
| 24 | 74 | damper on main as closed_share | main model_rig.cpp:493-495 | OK | `1 - exp(-ln2 dt/halflife)` |
| 25 | 86-90 | Godot two-bone: straight past reach, push-out, circle, pole | godot two_bone_ik_3d.cpp:793-831; LICENSE.txt:1-20 | OK | MIT text, 20 lines |
| 26 | 91 | FABRIK3D backward then forward passes | fabr_ik_3d.cpp:36-86 | OK | `// Backwards.` :36, `// Forwards.` :62 |
| 27 | 93-97 | max_iterations 4, 0.001, 2 deg; warm start; early stop | iterate_ik_3d.h:280-283; .cpp:456-462, :591-595 | OK | `deterministic = false` :285 |
| 28 | 99-101 | paper, authors' copy, 17 pages, (c) Elsevier | fabrik.pdf p.1 | OK | copy ends p.259; p.260 absent |
| 29 | 103 | Algorithm 1 on p.246, 1.1-1.41 | fabrik.pdf | WRONG | p.245-246; page slip only, content right |
| 30 | 104 | multi end effectors, centroid sub-base p.247 | fabrik.pdf s4.1 | OK | "centroid of all" text |
| 31 | 106 | Table 1: 15.5 it, 0.86 ms, CCD 26.3, Jacobian 800-1311 | fabrik.pdf Table 1 (p.254) | OK | 15.461 / 0.86 / 26.308 / 808.8-1311.2 |
| 32 | 108 | CCD "can roll and unroll itself" p.253 | fabrik.pdf | OK | text quoted |
| 33 | 111 | ozz MIT LICENSE.md 1-22 | ozz LICENSE.md | OK | MIT, "Copyright (c) 2020 Guillaume Blanc" |
| 34 | 113 | soften default 1 (:96); slider 1 (:753) | ik_two_bone_job.h:96; sample_foot_ik.cc:753 | OK | RE-DERIVED for :96 |
| 35 | 115 | pole flips when aligned, caller's job | ik_two_bone_job.h:81-84 | OK | text matches |
| 36 | 117 | curve `1-3^4/(alpha+3)^4`, RcpEstX | ik_two_bone_job.cc:131-163 | OK | comment :154 |
| 37 | 118 | foot height 0.12 (:750), Thales (:240-250) | sample_foot_ik.cc | OK | Thales RE-DERIVED |
| 38 | 121 | Holden MIT LICENSE 1-21 | holden LICENSE | OK | MIT, Daniel Holden 2021 |
| 39 | 123 | contact_update behaviour | controller.cpp:796-874 | OK | edges, zero velocity, unlock radius |
| 40 | 127 | five defaults | controller.cpp:1415-1419 | OK | 0.015, 0.02, 0.15, 0.2, 0.1 |
| 41 | 129 | toe locked, heel solved, clamp, 0.015 buffer | controller.cpp:914-923, :1421-1424, :1997, :2013-2034 | DOWNGRADED | "floor" is y=0; no ground query at all |
| 42 | 132 | contact flag from data | controller.cpp:1286 | OK | `db.contact_states` |
| 43 | 134 | ALS MIT LICENSE 1-21 | ALS LICENSE | OK | MIT; also credits LongmireLocomotion |
| 44 | 136 | art/animations not covered by README line | README.md:37-38 | UNSUPPORTED | README says only "Source code ... MIT" |
| 45 | 138 | lock alpha only falls or snaps to 1 | ALS anim.cpp:374-378 | OK | quote matches across two comment lines |
| 46 | 140 | lock held by subtracting velocity x dt and yaw | anim.cpp:398-423 | OK | `LocalLoc - LocationDifference`, rotate |
| 47 | 142 | trace 50 up, 45 down; foot height 13.5 | ALS .h:480, :487-490; anim.cpp:486-487 | OK | |
| 48 | 143 | target = hit + normal x foot height; :521-522 | anim.cpp:518-523 | DOWNGRADED | an offset from the flat place; lines :522-523 |
| 49 | 146 | foot offset 30/s down, 15/s up; pelvis 10/15 | anim.cpp:439, :528 | OK | |
| 50 | 146 | in the air both reset at 15/s | anim.cpp:331-335, :439, :449-460 | WRONG | pelvis returns at 10 up / 15 down |
| 51 | 148 | lock driven by clip curves | anim.cpp:350-372 | OK | `GetCurveValue(FootLockCurve)` |
| 52 | 161 | ha and ball from rest bones | l205 model_rig.cpp:813-814 | OK | |
| 53 | 163 | stance test `u <= stance`; main kStanceShare :775 | l205 :881-883; main :775 | OK | |
| 54 | 168 | place_figures :270-280; hunter_phase_ stage.h:142 | main | OK | |
| 55 | 190 | probe window table | world_app.cpp:123; body.cpp:218; sample_foot_ik.cc:97 | OK | |
| 56 | 198 | risers 0.175, treads 0.28, spiral 0.219 | gen/README.md:51-52 | OK | |
| 57 | 199 | step 0.72 m at 9.9 m/s | handback p-l180-lap2:80-81 (via ground) | OK | 0.721 m, 13.73 a second, at add21fe |
| 58 | 191 | cap premise: step 1/13.73 s and stance 0.09-0.125 s | handback p-l180-lap2:80-81; G-loco:306 | DOWNGRADED | hunter at add21fe vs a human sprinter; incompatible together |
| 59 | 206 | git grep -i rung hits only audio and body code | git grep main | WRONG | also gen docs, emit.cpp, scene.h, chaser.cpp; generator makes a flat board |
| 60 | 204 | hands 0/0.5, feet 0.1/0.6 at p-l176:48-51 for a ladder | handback p-l176:45 | WRONG | line is :45; source is ledgegrab.as, a ledge climb |
| 61 | 229 | slide leg is L188 step 2's | G-physics:244 | OK | |
| 62 | 242 | 2 rays per hunter, player up to 4 per tick | model_rig.cpp:438-447; G-code:247-249; body.cpp:471-477 | OK | |
| 63 | 245 | 1-3 us a ray; 24 characters | none | UNSUPPORTED | no source for 24; the 1-3 us is flagged assumed |
| 64 | 247 | "Nearest two or three full detail" | brief:1274 | OK | |
| 65 | 258 | camera row proves camera untouched | G-code:292 | OK | |
| 66 | 279 | hunter_lean_trace replays the flee bot at 144 | world_app_tests.cpp:919-960; DZ_LEAN_RUN :1034 | OK | trace holds pos/heading/lean, not a BodyPose |
| 67 | 285 | outside foot 10 cm wider with lean | model_rig.cpp:428-436 | OK | `0.10f * min(lean/0.42, 1)` |
| 68 | 296 | "his item 216 ruling", brief:1605-1606 | brief:1603-1606 | DOWNGRADED | the room's ruling; his words are one line |
| 69 | 298 | capture-lean pick offscreen_models.cpp:316-324 | main | OK | comment :317-322 |
| 70 | 307 | item 217 method brief:1607 | brief:1607 | OK | |
| 71 | 252 | knee-jump bar 2 degrees | l205 tests:1332-1350 | OK | |
| 72 | 172 | swept sphere is "the sourced way" to "highest under the foot" | handback p-l176:36 | DOWNGRADED | sweep 0.2 above to 0.6 below is sourced; the rest is inference |

**Tally (72 rows): OK 57, WRONG 6, UNSUPPORTED 2, DOWNGRADED 7.** The six WRONG: three line slips in [summary] cites
(rows 22, 23, and the line part of 60), one page slip (29), one content error in the air-reset claim (50), and one content
error that matters (59, the ladder). No licence claim is wrong: Godot, ozz, Holden and ALS texts are MIT as stated; the
FABRIK paper is (c) Elsevier, idea only. I read the licence files, not the Motion-Matching README (its bundled data is not
MIT; the room already knows, ground_sources_read.md:66-67) and not any art or data licence of the four code bases.

**RE-DERIVED: 4.**
1. scout:5-6 "the hunter has no world-held foot on main" is ground_code.md:67 ("foot placed by curve; planted on l205-stomp-c").
2. scout:118-119 the Thales slope ankle, "new beyond the room's reads", is ground_sources_read.md:53 (`sample_foot_ik.cc:207-255` read) and handback p-l176:73.
3. scout:113 `soften` default 1 at ik_two_bone_job.h:96 sits inside ground_sources_read.md:54 (`ik_two_bone_job.h:85-100`).
4. scout:179 step 4, "hips sink for the lowest locked foot", as a design step: the player's sink is body.cpp:462-479 (`kMaxHipSink` 0.12) and the hunter's is model_rig.cpp:459-468; ground_physics_and_fp_body.md:104-105 and ground_code.md:247-249 hold both.
(Holden's lock, ALS's lock/trace/pelvis, Godot's solvers and the FABRIK paper are in no ground file: genuinely new.)

**The design, read adversarially.**

*The simplest way to pass the first row without doing what it is for:*
- The row decides "contact" with the pass's own flag. Shorten the flag to the middle of the stance and the ball "moves
  under 3 cm in every contact" while the foot still skates at both ends. The player's row does not do this: it decides
  "down" by ankle height against the floor (body_tests.cpp:219) and demands `contacts >= 6` (:230). Use that form: contact
  = the ball's height above the probed floor, not the pass's flag.
- No count and no turn-rate guard. A recorded case with no stance inside a corner passes before and after. Require a
  minimum number of contacts and some at a turn rate the lean row already uses.
- It measures the ball only. Holden turns the heel to face the lock (controller.cpp:2040-2075), so the ball can stay put
  while the heel swings 20 cm. Add the ankle and heel, and measure the palette-side bones too: `Rig::palette` aims bones
  from joints and the toe bones ride the foot (ground_code.md:84).
- It runs at 144 frames a second only. F9 is the one row at other rates and is "unknown".
- A foot that floats because `reach_leg` clamped it off its lock is not a slide: the ball row can pass while the foot
  hangs 4 cm up. F3's "2 cm above both probes" is the only catch and it is stairs-only; put a flat-floor height bar on the
  first row.

*Mechanisms with no source that are not marked [ours]:*
- "No foot ever eases INTO a lock" (step 3): ALS's rule is about an authored curve alpha (anim.cpp:374-378); applying it
  to a world-position lock is the scout's reading. [ours].
- "A locked foot needs no ray (its floor does not move)" (cost section): [inferred], unmarked. Not checked whether the
  game has any floor that moves.
- The conflict between step 6 (memory leaves a foot below a risen floor by design) and F3 (never more than 1 cm into it)
  is not resolved anywhere in the scout.
- "The pass edits legs and hips below the neck only" (player): the sink already moves the pelvis under a neck that does
  not move (body.cpp:479-483), and the spine's length is not held; a larger sink widens that.
- The first game: item 156's note (brief:1115) says the first game aimed legs at planted feet. That is the owner's own
  prior art for this very mechanism; the scout neither opened it nor listed it under "What I did not open".
- Why Holden's lock rather than Overgrowth's stepping planner (`aschar.as:11726-11831`, "feet planted until the body moves
  far enough", p-l176:41), which the room already holds and the owner's item 155 leans on: the scout does not argue it.
  Item 153's rule (build what the sources found) is met by either; the choice is the scout's.

*Where the build order leans on an unlanded branch:* the lap waits on L205 and on 55d1451's rebase. If L205's `plant` is
replaced, the producer's ball path changes and the 0.2 m radius, the half-life cap and the 3 cm bar are all re-tested.

**The three corrections that matter most.**
1. Ladders have no rungs at all: the generator emits one flat board (gen/README.md:161, :336; emit.cpp:536-539). The
   scout's "a probe that finds them" is impossible and its grep claim is wrong.
2. The first row is circular: it uses the pass's own contact flag and has no count or turn-rate guard; the player's row it
   copies is independent and guarded.
3. Memory (step 6) and F3 contradict on every riser; and Holden is the source for the lock's edges only (his floor is the
   plane y = 0), so every stair rule in section 3 is [ours]. The half-life cap also mixes the hunter's 13.73 steps a
   second with a human's 0.09-0.125 s contact.

**What I could not check.** The first game's code (the Downloads checkout named in the brief is not at that path).
Unreal's `VInterpTo` source (the scout's own gap too). `gait_pose`'s foot path, so "a turn carries the foot", F1's
redness and F5's knee-flip risk are still untested inferences. SR:544-548 behind G-loco:306. G-code:189-195 and
G-loco:99-116 beyond their first lines. The Overgrowth sources themselves. Any cost; I ran nothing.

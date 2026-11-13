# Ground reader: the animation code as built (dreamzone-3 main at 31d1c6d; branch l205-stomp-c at 900e3c4)

SUMMARY
1. Two separate pose paths share one output type, BodyPose (21 world-space joint POSITIONS plus right/chest/head frames).
   The player: Body::pose, a blend of 9 move targets + two-bone IK, ticked at 240 Hz. The hunter: gait_pose, angles
   from sourced curves + forward kinematics, called once per drawn FRAME in WorldStage::place_figures.
2. Both reach a skinned glTF through one shared retarget, Rig::palette (aim each bone from one game joint to another).
   That is the only humanoid-generic piece; it takes any MPFB "game_engine" skeleton (18 standard aims).
3. The kinetic chain (chain_pose + kinetic_chain + KineticChain springs) is used only by the hunter. The player does
   not go through it. The skeleton/ragdoll layer (rotations + Jolt, hard-keyed) is merged on main but drawn by nothing.
4. The other chaser kinds have NO pose: one rigid box each, placed by figure_transform(feet, heading). Only the first
   Hunter gets the model. A second entity would have to call gait_pose + a Rig of its own from place_figures.
5. Per character per frame the work is small (no solver loops beyond an 80-step bisection for the arms); nothing was
   timed. Tests: 34 rows in model_rig_tests on main (43 on l205-stomp-c), 21 in body_tests, 4 skeleton, 4 ragdoll.

Marks: [read] = opened, path:line at main 31d1c6d unless a branch is named. [inferred] = my reading of it. Nothing run.

## 1. The path from simulation state to a drawn pose

### 1a. The hunter (and in principle any chaser)

| step | function | takes | gives | where |
|---|---|---|---|---|
| 1 | `WorldApp::gather_poses` (each tick, after `chase_->after_step`) | chase agents | `ChaserPose` per agent: id, kind, pos (feet), heading, speed, mode, gait, look, lean = atan(speed*turn/9.81) | [read] game/world/world_app.cpp:528-537, called :733-736 |
| 2 | `WorldApp::ease_poses` (each tick, every chaser of every kind) | ChaserPose | heading := drawn yaw, look := drawn look, lean/pitch := drawn tilt, follow := chain springs | [read] game/world/world_app.cpp:567-588 |
| 2a | `DrawnChaser::step` | pos, heading, look, on_feet (gait==Mesh), dt=kTickDt | Overgrowth tilt (velocity/2 + low-passed accel, in degrees), Valve yaw converge, Valve look ease; then `KineticChain::step` | [read] game/model_rig.cpp:498-544 |
| 3 | `WorldApp::chaser_poses` (per frame) | pose_before_, pose_now_, alpha | lerped pos, heading, look, lean, pitch, follow | [read] game/world/world_app.cpp:539-560 |
| 4 | `WorldStage::place_figures` (per frame) | ChaserPose | advances `hunter_phase_ += speed * frame_dt * gait_phase_per_metre`; builds `GaitMotion` (lean, pitch, follow, look-heading, floor probe) | [read] game/world/stage.cpp:256-281 |
| 5 | `gait_pose(rest, feet, heading, speed, phase, motion)` | 21 rest joints of the model | BodyPose: legs from `running_leg` (Fukuchi curves) by FK; pelvis on the deeper leg + flight rise; trunk leaned 0.22*run; arms from Bruening/Otsuka/Okajima laws | [read] game/model_rig.cpp:738-846 |
| 5a | `apply_motion` (end of gait_pose) | pose, GaitMotion | outside foot wider; feet onto floor probe; `chain_pose` -> `kinetic_chain`; hips sink up to 0.30 m; legs re-reached by `reach_leg` (2-bone, knee forward) | [read] game/model_rig.cpp:415-476 |
| 6 | `Rig::palette_floats(pose)` | BodyPose | 12 floats per skin joint | [read] game/model_rig.cpp:322-376 |
| 7 | `WorldStage::pose_model` -> `Renderer::SetSkinPalette` per mesh | palette | GPU skinning | [read] game/world/stage.cpp:643-645 |

Note [read] game/world/stage.cpp:269: the hunter's stride PHASE lives in the stage and is advanced by the frame's
delta, not by the simulation tick. [inferred] So the hunter's gait is frame-rate integrated and not part of any replay;
it stays picture-only, which the rule wants, but two machines drawing the same replay will show different leg phases.

Note [read] game/world/stage.cpp:267: `if (hunter_.on && !hunter_out && p.kind == Hunter)` — only the first Hunter
gets the model; every other ChaserPose falls through to a box (:283-287).

### 1b. The player (the kid)

| step | function | takes | gives | where |
|---|---|---|---|---|
| 1 | `CameraRig::tick` | player before/after | eye, `stride_phase_ += pi * stride_rate * sqrt(speed) * dt` | [read] game/camera.cpp:177-178 |
| 2 | `Body::tick` (each sim tick, after the rig) | PlayerState before/after, rig | move weights eased (kBlendTime), hold points for vault/climb, ladder phase; then `Body::pose` | [read] game/body.cpp:189-214; called game/world/world_app.cpp:706 |
| 3 | `Body::pose` | PlayerState, rig (eye, stride phase) | 9 `Targets` (hands, feet, lean) computed every tick, blended by weight, hand overrides, inertialized (targets and knees/elbows), trunk hung from the neck, legs and arms by `two_bone` | [read] game/body.cpp:222-543 |
| 4 | `Body::at(alpha)` -> `BodyPose::between` | prev, cur | joints lerped; chest_right/head_right lerped; right/up/forward from the later pose | [read] game/body.h:110; game/body.cpp:134-143 |
| 5 | `glanced(pose, look_back)` | pose, glance 0..1 | chest/arms turned up to 0.87 rad about the neck; eye round the neck | [read] game/body.cpp:145-165 |
| 6 | `kid_.rig.palette_floats(pose)` (Rig with `lock_eye(true)`) or, with no kid model, 16 boxes by `body_part_transform` | | | [read] game/world/stage.cpp:299-316; game/body_figure.cpp:79-124 |

The same `glanced(app.body().at(alpha), look_back)` feeds the gym's stage, body_capture and offscreen_fpbody
[read] game/gym/stage.cpp:97, game/gym/body_capture.cpp:171, game/world/offscreen_fpbody.cpp:132 and :364.

### 1c. Where the two paths differ (all [read] unless marked)

| | player (Body) | hunter (gait_pose) |
|---|---|---|
| anchor | hangs from the camera eye down (body.cpp:243-246) | built up from the feet (model_rig.cpp:783) |
| clock | sim tick, rig's stride_phase (body.cpp:240) | frame delta in the stage (stage.cpp:269) |
| limb method | world TARGETS for hands/feet + two_bone IK (body.cpp:53-71, 509-540) | joint ANGLES from curves + FK (model_rig.cpp:786-800), IK only to re-reach feet (:469-475) |
| lengths | `BodyBuild` fixed 1.8 m figure (body.h:73-82) | the model's own rest joints (`rest_from_bones`) |
| moves | Run, Air, Slide, Vault, Climb, WallRun, Ladder, Dive, Roll, blended (body.h:50) | run/stand only; `Gait` Ladder/Drop/Climb/Recover are not posed (only on_feet in DrawnChaser) |
| chain | none: lean is one eased scalar `lean_` (body.cpp:455), no twist, no follow springs | chain_pose + kinetic_chain + springs |
| inertialization | yes, targets and mid joints (body.cpp:433-458, 490-506) | none (springs on tilt only) |
| sideways/backwards | crossover/shuffle, toe-first backwards (body.cpp:257-317) | heading only; feet follow facing |
| feet planted | stance foot held in the world by contact_length (body.cpp:255-309) | foot placed by curve; planted on l205-stomp-c (`plant`) |
| glance | `glanced` | head look via chain (no glance) |

[read] game/model_rig.h:173: kinetic_chain is described as "The one function every body is posed through (the hunter
now; the player's body from game/body.cpp next)". On main that "next" has not happened (no call in body.cpp).

## 2. The retarget (shared): Rig

- [read] game/model_rig.h:10: `palette[bone] = T(posed[from]) * Swing(B * rest_dir -> posed_dir) * B * T(-rest[from])`.
- B is one of four frames: lower (pose.right), upper (chest_right), spine (between chest and head by ozz shares),
  head (head_right) [read] game/model_rig.cpp:326-342. Twist about a limb's own length: none beyond these frames
  (model_rig.h:13-14). [inferred] So a forearm or thigh cannot twist on its own axis; only whole-region twist exists.
- Each aimed bone is translated to its posed `from` joint; bone length is NOT changed [read] model_rig.cpp:348.
  [inferred] Where the pose's segment length differs from the model's (the player's BodyBuild vs the kid model), the
  child bone starts at the posed joint, not at the parent bone's end: overlap or gap at the joint is hidden by skin.
- Unaimed bones copy their parent's palette, roots copy the pelvis [read] model_rig.cpp:353-358 (fingers, toes, any
  extra bone ride rigidly).
- `standard_aims()`: 18 aims on MPFB game_engine names (pelvis, spine_01..03, neck_01, head, upperarm/lowerarm/hand,
  thigh/calf/foot each side) [read] model_rig.cpp:242-250.
- `rest_from_bones`: the 21 rest joints from bone heads; Head = head + 0.12 m up, Eye = head + (0, 0.12, 0.07), Hand =
  wrist + `hand` along forearm, Toe = ball + 0.06 m [read] model_rig.cpp:252-288. Hand length 0.22 for the hunter,
  0.20 for the kid fallback [read] game/world/stage.cpp:604, :610.
- The kid instead reads `kid.joint_map.json` and `game_rest` re-places Neck at Eye - (0, eye_to_neck, neck_back)
  [read] game/model_rig.cpp:236-240; stage.cpp:597-603. `lock_eye` shifts the whole palette so the model eye = pose
  eye [read] model_rig.cpp:359-366.
- Any model on the MPFB game_engine skeleton can be posed by Rig today [read model_rig.h:50-59]. A model on another
  skeleton needs its own `JointMap` (aims by bone name) [read model_rig.h:28-38].

## 3. Constants that shape motion, by body part

All [read]; the source comment is quoted short or named. "OURS" means the code itself says no source.

### Whole body / tilt / facing (hunter, DrawnChaser) — game/model_rig.h
| constant | value | source as written | line |
|---|---|---|---|
| tilt target | vel*0.5 + accel_tilt, degrees | Overgrowth aschar.as:7921-7940 (Apache-2.0) | model_rig.cpp:506-511 |
| kTiltAccelHalflife | 0.1126 s | "0.95 a frame at 120 frames a second" | :325 |
| kTiltHalflife | 0.0548 s | "0.9 a frame at 120" | :326 |
| off-feet decay | 0.8 per 1/120 s | aschar.as:7927-7928 | model_rig.cpp:513 |
| kYawRate | 12.566 rad/s | Valve DOD_BODYYAW_RATE (study only) | :327 |
| yaw slow-down | angle/60 deg, floor 1% | Valve ConvergeYawAngles | model_rig.cpp:521 |
| kLookRate | 17.453 rad/s | Valve nb_saccade_speed | :328 |
| kLookEaseIn | 0.25 s | Valve NextBot | :329 |
| kNewLookJump | 0.52 rad | "(ours)" | :330 |
| kGaitMaxLook | 1.3 rad | "(L170, ours)" per :103 | :292 |
| gait base lean | 0.22 rad * run, run = speed/6 | none stated (stand-in) | model_rig.cpp:746-747 |

### Chain (hunter) — game/model_rig.h:134-144, :293-295
| constant | value | source |
|---|---|---|
| kBankPelvisShare / Trunk / Head | 1.0 / 0.35 / -0.30 | first game dreamzone-rt src/main.cpp :6655, :6662, :6669 |
| kPitchPelvisShare / Trunk / Head | 0.5 / 1.0 / 1.0 | same, :6650, :6662, :6668 |
| kTrunkFollowTime / kHeadFollowTime | 0.13 s / 0.22 s | same, :6617-6618 (springing bank too is "ours") |
| kPelvisTwistAmp | 0.11345 rad (6.5 deg) | Perpina-Martinez 2023 Table 1, middle taken "ours" |
| kThoraxTwistAmp | 0.24915 rad (14.28 deg) | Ford 2013, middle taken "ours" |
| kHeadTwistShare | 0.55 | first game :6667 |
| kLookJointWeight | 0.35 (spine 0.65, chest 0.4225) | ozz sample_look_at.cc:466 (MIT) |
| spring | critically damped, omega = 2/duration | first game SpringStepF :6420-6425 [read] model_rig.cpp:560-565 |

### Arms (hunter) — game/model_rig.h:188-282
| constant | value | source |
|---|---|---|
| kArmSwingMin / Max | 0.1 / 1.05 rad | "ours" |
| kArmTwistShare | 1.5 | "OURS" |
| kArmRangeAtF1, kArmRangeExp | 0.76306 rad, 0.671 | Bruening 2020 S1 Table A3, fitted |
| kElbowRangeAtF1, kElbowRangeExp | 0.37839 rad, 0.718 | Bruening 2020, fitted |
| kHandToMidline | 0.4363 rad | "OURS" |
| kFlareFrontSwing/kFlareFront/kFlareBackSwing/kFlareBack | 0.79587/0.23562/-0.88837/0.50615 rad | Otsuka 2016 Fig. 2, read by eye; the line between is "ours" |
| kArmV1 (selected, :257) | flare +0, bend_front 106.5 deg, floor 80 deg | Okajima 1996 pitch type; floor "OURS" |
| kArmV2 / kArmV3 | +10/111.9/90; +20/120/100 deg | partly ours (:240-242) |
| kArmSwingSolve | true; 40-step bisection per end | "DERIVED ... OURS" |
| kArmWalkF / kArmRunF | 0.64 / 0.88 (Froude) | Bruening tested speeds; smoothstep "OURS" |
| stand-in hang | bend 0.25 rad, abduction 0.1194 rad | none (model_rig.cpp:824-825) |

### Legs and stride (hunter) — game/model_rig.h:350-393
| constant | value | source |
|---|---|---|
| kStrideK, kStrideExp, kStrideG | 2.3, 0.3, 9.81 | Alexander 1976 via Mazzetta & Blanco 2001 |
| kStrideFloor | 0.1 hip heights | "ours" |
| kKneeShape, kAnkleShape, kHipShape | raised-cosine bumps / harmonics (:380-382) | least-squares fit (ours) to Fukuchi 2017 means (CC BY 4.0) |
| kHipTilt | 10 deg | "OURS" |
| kLegSlowest / kLegShapeTop | 2.5 / 7.0 m/s | Fukuchi slowest / "OURS" |
| kStanceShare, _s | 0.36, -0.03 per m/s | Fukuchi force data |
| flight rise | g t^2/8 | "Newton" (model_rig.cpp:764-782) |
| outside foot wider | 0.10 m at lean 0.42 rad | "ours, no source" (model_rig.cpp:429-432) |
| floor offset clamp | +-0.45 m | none stated (:442) |
| hip sink | up to 0.30 m | none stated (:459, :466) |

On l205-stomp-c only [read via git show l205-stomp-c:game/model_rig.h]: `LegSwitches{yield, roll, rise, follow}` (:291);
kFastKnee/kFastAnkle/kFastHip (:413-415) fitted to Dorn, Schache & Pandy SimTK "runningspeeds" (MIT), subject JA1;
kFastFrom/At/Centre/Top 4.5/5.2/7.0/9.49 m/s (:416); kSprintFrom/By 4.5/5.5 (:418); kRunnerHips pelvis excursion
shares at 3.53/5.19/6.97/9.47 m/s (:429, Dorn JA1; held past, "OURS"); kPushOffKnee 15 deg (:436, Dorn's runner; the
papers' sprinters 21-28.4 named as the sourced alternative); kKneeEaseFrom 23 / kKneeStop 5 deg (:443, "OURS");
kKneeHandBack 0.35 (:446, no source stated).

### Player body — game/body.cpp and game/body.h
| constant | value | source as written | line |
|---|---|---|---|
| kBlendTime | 0.045 s | none | body.cpp:15 |
| kRightMidStance | pi/2 | the rig's sway (camera.cpp) | :18 |
| kMaxContact | 0.80 m | none | :20 |
| kRungSpacing | 0.30 m | the ladders' spacing | :22 |
| kJumpBase | 0.025 m | none | :25 |
| kMaxHipSink | 0.12 m | none | :27 |
| kLeanTime / kSettleTime | 0.08 / 0.06 s | none | :29-30 |
| duty factor | 0.62 - 0.37*smooth((v-2.5)/4.5) | "about 0.6 at a walk to about a quarter at a sprint", no citation | :130 |
| foot lift | 0.05 + 0.07*speed, cap 0.50 | none | :259 |
| arm swing | amp 0.06 + 0.30*pace; raise 0.40*pace; drop 0.52 - 0.18*pace | none | :324-330 |
| run lean | 3 + 9*pace deg (+22 crouched) | none | :338 |
| move targets | Air lean 6, Slide -38, Vault 28, Climb 18, WallRun 8, Dive 62, Roll 55 deg; offsets in metres | none | :340-426 |
| two_bone fold | 0.22 m | none | :56 |
| pelvis floor | ground + 0.16 m; chest at 0.72 of neck-pelvis | none | :480, :483 |
| glance chest | 0.87 rad (50 deg); kGlanceTurn 2.9 rad | game/shell.cpp | body.cpp:153; body.h:151 |
| BodyBuild | eye_to_neck 0.13, neck_back 0.09, neck_to_pelvis 0.54, shoulder_half 0.19, hip_half 0.10, arm 0.30/0.27/0.20, leg 0.46/0.45, ankle 0.07, foot 0.22 | "for a figure 1.8 m tall ... eye at 1.65" (D659) | body.h:73-82 |
| kCrossoverSpeed/Blend/Offset/Reach, kShuffleGap | 2.7, 0.4, 0.12, 0.12, 0.14 | "OURS" (Kuntze 2009 for the shape) | body.h:177-181 |
| kBackToeDown / kBackLift | 15 deg / 0.7 | "OURS" (Balasukumaran 2020; Donno 2023 abstract) | body.h:182-183 |

[inferred] The player's run is almost wholly unsourced numbers; the hunter's run is almost wholly sourced curves. They
were built by different laps and share no motion law, only the output type and the Rig.

## 4. Hunter-specific vs reusable today

Reusable for any humanoid on the MPFB game_engine skeleton [read, with my judgment marked]:
- `Rig` (build/palette), `standard_aims`, `rest_from_bones`, `JointMap` reader. Model-agnostic.
- `gait_pose` takes only rest joints, feet, heading, speed, phase, GaitMotion: no hunter type appears in it
  (model_rig.h:331-332). Limb lengths, hip height and Froude scaling come from the given rest joints
  (model_rig.cpp:725-736, 807). [inferred] So a second humanoid kind could run on it unchanged; it would move like the
  hunter scaled to its own legs.
- `DrawnChaser` already runs for every chaser of every kind each tick (world_app.cpp:569-586).
- `chain_pose`/`kinetic_chain`: operate on any BodyPose (model_rig.h:171-178).
- `skeleton.h` (positions <-> rotations, 22 joints with a lower spine) and `Ragdoll` (Jolt, hard-keyed): take any
  BodyPose; not called from the game (no reference outside game/ragdoll.*, game/skeleton.*, tests; CMake target
  dz_ragdoll links only ragdoll_tests) [read] game/CMakeLists.txt:39-46.

Hunter-specific (as wired, not as written):
- The single `hunter_` ModelFigure and `hunter_phase_` in WorldStage (stage.h:141-142), the `Kind::Hunter` test and
  the first-only rule (stage.cpp:267).
- The hand length 0.22 passed at load (stage.cpp:610); hunter.glb by file name (stage.cpp:627).
- The tuning: arm variant, kArmTwistShare, the leg curves past 4.5 m/s, all chosen for the hunter's 9-13 m/s
  (model_rig.h:199, :343-344).
- The joint set itself (21 named humanoid joints, body.h:38-46) is humanoid-only. [inferred] A quadruped or
  a crawler with a different limb count cannot use BodyPose, Rig's aims or gait_pose at all.

## 5. How a second kind of entity would get a pose today

[read] Today: kinds other than the first Hunter are boxes: `figure_transform(p.pos, p.heading, m)` (stage.cpp:284),
one mesh per kind, kFigureSlots = {1, 6, 6, 9, 0, 0, 2} (figures.h:28). [inferred] That array has 7 values for
kChaserKinds = 8 (Dark is the 8th kind, chase/archetype.h:25), so Dark gets 0 box slots.

[inferred] To give, say, the Sprinter a skinned pose with the code as it is, a lap would have to:
1. load its glb with `rest_from_bones` + `standard_aims` + `Rig::build` — copy the `take` lambda's non-kid branch
   (stage.cpp:584-625) and `add_model` (stage.cpp:484-572);
2. add a ModelFigure and a phase float per drawn instance (today there is one of each, not a per-id table);
3. in `place_figures`, call `gait_pose(...)` with a GaitMotion filled exactly as the hunter's (stage.cpp:271-278) and
   `pose_model(fig, fig.rig.palette_floats(...))`;
4. nothing upstream: ChaserPose already carries lean, pitch, look, follow for every kind.
What it would bypass: none of Body (player only). What it cannot get: non-run gaits (Ladder/Drop/Climb/Recover),
any per-kind style other than ArmStyle and LegSwitches (branch), and any non-humanoid skeleton.
[inferred] The phase is keyed to one float, so N figures need a per-id phase map; DrawnChaser's per-id table in
WorldApp (`ease_`) is the existing pattern to copy.

## 6. Per-frame / per-tick cost inventory (counted by reading; nothing timed)

Hunter, per FRAME (place_figures runs once per draw):
- `gait_pose`: 2 `running_leg` (each ~3 cos + 2 bumps); FK for 2 legs; 2 arms. `arm_swing_solved`: 2 ends x 40
  bisection steps, each `arm_flare` + `measured` (atan2, 4 sin/cos) = ~80 iterations (model_rig.cpp:681-689).
- `apply_motion`: `chain_pose` (1 sin), `kinetic_chain` ~17 joints each yaw_turn + tilted (~4 trig) (:620-643),
  2 floor probes = 2 `world_->raycast` into the sim's Jolt world (world_app.cpp:120-128), 2 `reach_leg`.
- `Rig::palette`: 4 frame builds, then per skin joint one swing (1 cross, 1 dot) + 2 3x4 multiplies; unaimed bones
  copy. Skin joint count of hunter.glb not read [not opened].
- `palette_floats` allocates two std::vectors per call (model_rig.cpp:322-376) [read]; `SetSkinPalette` per mesh.
- On l205-stomp-c add ~6-8 more `running_leg` calls and 1-2 `plant` solves (law-of-cosines, a few acos/sqrt/exp).
[inferred] Order of a few thousand flops and ~1k trig calls: single-digit microseconds per hunter on a desktop CPU,
far below the 3.33 ms frame. Not measured. The GPU skinning and ray-tracing of the skinned mesh are the larger costs
and are outside this file.

Every chaser, per SIM TICK (240 Hz): `DrawnChaser::step` (2 exp, a few trig, 4 spring_step with exp) —
world_app.cpp:735-736. Per frame: `chaser_poses` lerp is O(N^2) in chasers by id search (world_app.cpp:542-544)
[read]; [inferred] trivial at <= 24 figures.

Player, per SIM TICK: `Body::pose` builds all 9 move Targets every tick whatever their weight (body.cpp:249-426), 8
inertialized points, 4 `two_bone`, and `floor_under` raycasts: 2 in the Run feet + up to 2 in the hip sink = up to 4
raycasts per tick (body.cpp:305, :471). Per FRAME: `between` (21 lerps), `glanced`, `Rig::palette` for the kid.

Ragdoll (not in the game): one Jolt `PhysicsSystem::Update` with 22 kinematic bodies and 21 swing-twist constraints
per `key()` (ragdoll.cpp:127-141). Not timed.

## 7. Test rows, grouped by what they guard (names [read]; bodies not read unless noted)

game/tests/model_rig_tests.cpp (34 rows on main, counted with grep -c "^DZ_TEST("):
- Loading/retarget: a_joint_map_reads_its_rest_joints_into_the_games_frame_and_its_aims (:86),
  a_joint_map_that_is_wrong_is_refused_with_the_reason (:98), rest_joints_come_from_the_bones_of_a_model_with_no_map
  (:113), at_rest_every_bones_palette_is_the_identity (:128), a_posed_bone_carries_its_joints_where_the_pose_has_them_and_its_children_with_it
  (:144), a_rig_whose_aim_names_a_missing_bone_is_refused (:180), with_the_eye_locked_the_models_own_eye_lands_on_the_poses_eye
  (:227), with_the_games_own_neck_a_standing_body_holds_its_head_as_the_model_was_made (:247),
  a_pose_whose_head_turns_apart_from_its_chest_turns_the_head_bone_alone (:423).
- Gait integrity: the_stand_in_gait_keeps_every_limb_its_own_length_and_stands_still_at_rest (:194).
- Tilt/turn/look/floor: the_chases_lean_tilts_a_chaser_into_its_turn_about_its_pelvis_with_no_limit (:306),
  a_forward_pitch_tilts_the_upper_body_forward_and_a_backward_one_back (:337),
  in_a_turn_the_outside_foot_is_set_wider_and_the_inside_foot_stays (:352),
  the_head_turns_to_where_the_chase_looks_and_the_chest_takes_a_part_of_it (:364),
  each_foot_of_a_chaser_stands_on_its_own_floor_and_the_hips_sink_for_the_lower_one (:389).
- DrawnChaser (sources' behaviour): running_straight_and_steady_the_drawn_tilt_is_half_a_degree_forward_for_each_metre_a_second
  (:470), braking_the_drawn_body_leans_back_and_starting_it_leans_forward (:482),
  in_a_steady_turn_the_drawn_body_leans_into_it_by_its_centripetal_acceleration (:510),
  a_scripted_reversal_turns_the_drawn_yaw_the_short_way_at_valves_rate_slowing_into_it (:525),
  the_drawn_head_reaches_a_held_look_with_eased_ends_at_up_to_a_thousand_degrees_a_second (:562).
- Kinetic chain: the_upper_spine_turns_between_the_chest_and_the_head_by_ozzs_share (:586),
  a_scripted_pelvis_bank_moves_the_chest_the_neck_and_the_head_by_their_registered_shares (:616),
  over_a_running_stride_the_pelvis_and_the_thorax_turn_against_each_other_by_the_measured_amounts (:651),
  after_a_step_change_in_the_pelvis_the_heads_lag_peaks_later_than_the_chests (:691).
- Stride: the_stride_follows_alexanders_law_from_each_bodys_own_hip_height (:723).
- Arms: the_arms_swing_further_the_faster_the_body_runs (:764), each_arm_rides_more_than_the_whole_of_the_thoraxs_twist
  (:844), the_arms_swing_through_the_range_runners_were_measured_at (:915),
  the_elbow_bends_and_opens_through_the_swing_by_the_measured_range (:948), the_upper_arm_stands_off_the_side_of_the_trunk
  (:978), the_hand_comes_in_toward_the_middle_as_it_swings_forward (:998), at_a_run_the_elbow_holds_the_running_bend_at_mid_swing
  (:1010), against_the_chest_every_variant_swings_brunings_range_whatever_its_stand_off (:1043).
- Legs vs recorded runners: the_running_legs_reach_the_landmarks_of_recorded_runners_within_their_spread (:1112).
- l205-stomp-c adds 9 [read via git diff]: the_foot_roll_does_not_move_the_hips,
  the_flight_rise_lifts_the_hips_only_in_flight, the_knees_yield_holds_the_hips_down_most_with_a_foot_down,
  the_hips_rise_and_fall_within_the_recorded_runners_lowest_with_a_foot_down, a_foot_down_stands_on_the_floor,
  the_knees_do_not_jump_anywhere_in_the_stride, past_fukuchis_speeds_the_legs_take_dorns_runners_shapes_within_the_readers_error,
  the_drawn_leg_leaves_the_floor_as_dorns_runner_does, no_joint_jumps_as_the_hunter_stops_or_sets_off.

game/tests/body_tests.cpp (21 rows), the player:
- Camera untouched / replay: the_camera_moves_exactly_as_it_did_without_a_body_over_the_whole_gym_run (:108),
  a_glance_behind_turns_the_view_about_166_degrees_and_leaves_the_run_exactly_as_it_was (:390).
- Integrity: standing_at_rest_the_knees_are_straight_under_the_eye (:134), the_head_is_where_the_camera_is (:151),
  over_the_whole_gym_run_the_bones_keep_their_lengths_and_the_eye_stays_clear (:165),
  going_from_one_move_to_the_next_no_joint_jumps (:295), at_a_sprint_the_hands_swing_evenly_and_never_snap (:478).
- Feet: running_a_planted_foot_stays_where_it_landed (:203), the_foot_on_the_ground_is_the_one_the_view_sways_over (:236),
  contact_length_is_zero_standing_and_grows_with_speed_up_to_the_legs_reach (:360),
  strafing_at_a_jog_the_trailing_foot_crosses_over_and_never_through_the_other (:538),
  strafing_slowly_the_feet_shuffle_and_the_trailing_foot_never_passes_the_leading_one (:573),
  walking_backwards_each_foot_comes_down_toe_first (:592), running_onto_higher_floor_the_feet_go_down_on_the_floor_the_probe_gives (:623).
- Hands/moves: at_a_sprint_the_hands_come_into_the_bottom_of_the_view_and_standing_they_do_not (:262),
  on_a_climb_the_hands_hold_the_ledge_while_the_body_rises (:331).
- Glance: holding_v_whips_the_view_round_fast_and_letting_go_brings_it_back_a_little_softer (:417),
  with_the_glance_the_chest_and_arms_turn_toward_it_and_the_hips_and_legs_keep_running_ahead (:436),
  at_the_full_glance_the_neck_the_chest_and_the_shoulders_are_out_of_the_picture (:456), look_back_is_bound_to_v_by_default (:618).
- Boxes: the_figure_has_a_box_for_every_part_and_hides_the_head_in_first_person (:367).

game/tests/skeleton_tests.cpp (4): the_rest_pose_is_the_identity_and_rebuilds_to_itself (:100),
the_rest_pose_moved_rigidly_is_one_root_rotation (:120), over_the_whole_gym_run_every_bone_points_where_the_pose_points_it
(:213), with_the_glance_held_every_bone_still_points_where_the_pose_points_it (:226).

game/tests/ragdoll_tests.cpp (4): the_hunters_ragdoll_has_a_body_for_every_joint (:99),
hard_keyed_every_body_is_where_the_key_put_it_and_off_the_drawn_pose_only_by_the_stretch (:107),
the_ragdoll_reads_back_the_same_bits_every_time (:148), the_hunters_head_body_turns_with_its_look (:168; added on main
by 5411ef0 after the branch).

game/tests/world_app_tests.cpp (38 rows; drawn-hunter rows): the_hunters_drawn_lean_eases_into_a_turn_and_does_not_rock_on_a_straight
(:1028), the_hunters_drawn_lean_on_a_straight_pending_L182 (:1095; its comment says it "REPORTS and does not gate"),
the_hunters_lean_peaks_at_or_before_its_turn_does (:1160), the_hunters_head_turns_with_eased_ends_and_no_step_in_its_rate
(:1184), the_placeholder_figures_differ_in_outline_and_are_about_the_size_of_a_person (:526),
the_lights_in_the_hand_are_not_shadowed_by_the_players_own_body (:598).

game/tests/camera_tests.cpp (26 rows): the view's lean/bob, e.g. the_picture_is_drawn_between_the_last_two_ticks (:559),
body_motion_scales_all_of_it_and_does_not_change_the_run (:527) — camera, not body.

tools/yardstick/yardstick_tests.cpp (12 rows, the instrument itself): angle readers (a_leg_posed_at_known_angles_reads_them_back
:60, an_arm_posed_at_known_angles_reads_them_back :170, the_cardan_order_reads_back_three_angles_set_at_once :312,
a_pose_in_a_world_handed_the_other_way_reads_the_same :211, a_thigh_flexed_then_turned_out_reads_both_in_the_references_order
:244, the_same_leg_turned_and_carried_reads_the_same :77), curve scoring (a_curve_scored_against_itself_reads_zero :92,
a_curve_ten_points_late_is_found_ten_points_late :99, a_curve_moved_by_a_constant_reads_its_offset_and_no_centred_error :298),
CMU loader (a_cmu_bone_with_no_motion_points_along_its_asf_direction :148,
a_cmu_bone_turned_by_its_channel_turns_about_its_own_axis_and_carries_its_child :158), Fukuchi loader
(the_loader_leaves_out_a_speed_not_run_and_reads_the_swing_as_foot_up :260).
tools/yardstick files: README.md, acclaim.cpp/.h (CMU ASF/AMC), fetch_cmu.ps1, fetch_fukuchi.ps1, joint_angles.cpp/.h,
main.cpp, player.cpp/.h, reference.cpp/.h, sheet.cpp/.h, yardstick_tests.cpp. README: the recordings are "a test
reference ... never shipped and never committed, and nothing in the game plays them" [read] tools/yardstick/README.md:3-6.
The yardstick calls `gait_pose` directly (tools/yardstick/main.cpp:65, :172, :205, :374, :387).

Gaps [inferred from the lists]: no row for any non-hunter chaser pose (none exists); no row for gait_pose under the
Ladder/Drop/Climb/Recover gaits; no row for frame-rate independence of `hunter_phase_`; no timing row for any of it.

## 8. The two branches

- l205-stomp-c (900e3c4, merge-base 31d1c6d = main): touches only game/model_rig.h, model_rig.cpp,
  tests/model_rig_tests.cpp (+545/-21) [read]. Adds LegSwitches, the sprint leg curves from Dorn's runner past 4.5 m/s,
  two-law hips (follow the deeper leg to 4.5 m/s, spring-and-throw from 5.5 m/s), a planted stance leg solved by law of
  cosines with an eased reach (`plant`, branch model_rig.cpp:807), and the throw's rise faded below 2.5 m/s (:799).
  `running_leg` gains a `yield` parameter with default true (branch model_rig.h:456) — every main caller still compiles.
- l185-skeleton: no LOCAL branch of that name (`git rev-parse l185-skeleton` fails); `origin/l185-skeleton` exists at
  b226b95 and is already merged into main (682e699 "Merge l185-skeleton"). Diffing it against main shows only
  game/tests/ragdoll_tests.cpp differs (+31/-3, main's added row 5411ef0). So skeleton.h/.cpp and ragdoll.h/.cpp as
  read above ARE the branch's code [read].

## What I did not open

- hunter.glb, kid.glb, kid.joint_map.json (skin joint counts, bone names beyond the 18 aims, mesh counts).
- model/model.h and the renderer's SetSkinPalette / GPU skinning cost; core/math.h.
- game/camera.cpp beyond the two stride-phase lines; game/shell.cpp; sim/ and chase/ beyond the Kind and Gait enums.
- game/world/figures.cpp (box sizes per kind); offscreen_models.cpp, offscreen_fpbody.cpp, gym/body_capture.cpp bodies.
- The bodies of every test row (names only), except the PENDING comment at world_app_tests.cpp:1095-1097.
- tools/yardstick sources other than README.md lines 1-30 and the gait_pose call lines.
- Any branch other than l205-stomp-c and origin/l185-skeleton; the worktrees; the lighthouse record (briefs, hand-backs).
- No outside source: every licence and paper named above is as the code's own comments state it, not checked by me.

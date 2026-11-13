# Scout: secondary motion and physics layers (2026-11-13)

1. Keep E's mechanism: legs and pelvis keyed, upper body on Jolt's soft keyframe, reactions as a strength drop. Motors stay dead.
2. Make it one shared picture-only physics world with the level's walls in it, stepped on the 240 Hz sim tick, not the frame.
3. Strength comes from five numbers: two time constants per body kind, a reaction floor and recovery, and an active set.
4. New at source: Jolt's Stabilize, constraint priorities, warm-start reset and a 47 rad/s spin cap; an open active ragdoll
   "stays up" ~~only by a hand-of-god torque on the torso; Holden's spring makes switching physics off pop-free.~~ [2nd reader: DOWNGRADED and UNSUPPORTED. The default mode `STABILIZER_JOINT` is a kinematic body joined to the torso by a joint drive (PhysicsModule.cs:110-113); the torque is another mode, `UPRIGHT_TORQUE`, not the default; the drive's strength is a serialized value nobody here opened. Nothing read shows Holden's spring used to switch physics off: Holden's page is about blending two animations (page, section "Inertialization"); using it for a physics-to-pose handoff is [ours], untested.]
5. First lap: the level's walls into the picture world, so the hunter's arms meet walls; its row counts hands inside walls on
   his 16 kept runs. Cost per character is not measured anywhere: R4.7 must run before more than two bodies get physics.

Scout, read-only. Marks: [read] I opened it; [summary] another account or a swarm/ground file; [inferred] mine; [ours] a
proposal. Game code: dreamzone-3 main **31d1c6d** unless named. Jolt: the game's submodule `third_party/JoltPhysics` at
**v5.6.0** (e77f175), shortened below to `J/`. Ground files are in this folder: `GP` = ground_physics_and_fp_body.md,
`GS` = ground_sources_read.md, `GC` = ground_code.md, `GR` = ground_constraints_and_roster.md, `GW` = ground_his_words.md,
`GL` = ground_locomotion_and_yardstick.md. Record paths are relative to `C:/Users/nname/Desktop/lighthouse/exo_memory`.
`H185g` = handback/p-l185-steps4-5-E_2026-11-13.md, `H185r` = handback/p-l185-step4-E_2026-11-13.md,
`H183`, `H186`, `REG` = registration_l185_steps3-5_E_2026-11-13.md, as in GP:14-17.

## 1. What the room already has for this aspect

**His words that govern it** (verbatim):
- 158: "it makes me think, wouldnt be ideal for what we want to make a physics engine itself that drives the procedural
  animations" [read] briefs/dreamzone2_the_game.md:1118 (via GW:348-351, line confirmed).
- 159: "when the charater rubs up against a wall you see their arms and hands touch up against it as you move, the
  character must interact with the world dynamically too" [read] brief:1120 (a cut from the whole line; GW:353-358).
- 160: "hmmmmmmmm would there be a way to sort of mesh both techniques in a unique and cool way? if not do 1" [read]
  brief:1122 (GW:361-363).
- player_body-5 note: "or running up against the wall sprinting you bump into it and drag against the wall the arms should
  move to show it." [read] brief:1286.
- entity_bodies-3 note (the catch): "If it grabs you from behind, it stops you, depending on the angle of attack, ragdolls
  your body and flips you around [...] Once your body settles after ragdoll" [read] brief:1378 (cut by me, marked).
- entity_bodies-2: "Nearest two or three full detail" [read] brief:1274 (about model detail, not physics).
- 162 is his pick in the brief's words, not his: K1 eye from a simulated head, K2 physical reactions, K3 dial off [read]
  GW:369-373.

**Built and measured** (all [summary] via GP unless marked):
- Main has only the hard-keyed step: 22 kinematic bodies, 21 swing-twist joints, own `PhysicsSystem`, drawn by nothing
  (GP:3, GP:69-71). I re-read it: [read] ~~`game/ragdoll.cpp:150`~~ [2nd reader: WRONG line. At 31d1c6d the file has 159 lines; the text is at game/ragdoll.cpp:99, as GP:70 gives. No branch's copy has it at :150 either.] `part.mMotionType = JPH::EMotionType::Kinematic;` and
  ~~`:191`~~ [2nd reader: WRONG line, no line 191 exists; it is :140, GP:70] `m.system.Update(dt, 1, &m.temp, &m.jobs);`. Its system holds no level geometry: [read] ~~ragdoll.cpp:127~~ [2nd reader: WRONG line; `m.system.Init(...)` is ragdoll.cpp:76; content true] inits it
  for one ragdoll and nothing else is added.
- E's soft-keyed upper body is GREEN but local only, commits 2373283/8d41f04/2767855 not in the repo (GP:4-5, GP:48-52).
  Mechanism: per step, velocity = blend of "land on the keyframe this step" and the body's own; s = strength x
  (1 - e^(-dt/tau)); keyframe's gravity share removed; pelvis, lower spine, legs keyed (H185g:28-38) [read].
- Its numbers, all ours: tau trunk 0.005 s, arms 0.01 s; catch drop to 0.15, back to 1 over 1.0 s; 30 velocity / 10
  position iterations (kept from the motor attempt); dt = the frame's, clamped 1/1000-1/30 s; re-place on a >1 m jump with
  keyframe velocity (H185g:35-50) [read]; table GP:81-94.
- Rows: R4.3 follow p95 0.0069 m, 1.88 deg, max 0.0624 m; R4.4 hands 0.131 m past on a 9->0 stop; R4.6 same bits;
  R5.1-5.3 catch green; 16 kept runs identical (H185g:57-67, :106) [read]. tau sweep with hands-past: 0.02/0.06 -> 0.454,
  0.01/0.03 -> 0.315, 0.01/0.02 -> 0.243, 0.005/0.01 -> 0.131 m (H185g:75-80) [read].
- Motors stopped red: forearm and hand could not follow a 10 m/s swing at any stable setting; 3x stiffness unstable
  (H185r:16-18, :39-47, :80-81) [read].
- The player: no ragdoll (GP:124). Wall-hand hook `HandOverride` exists, nothing calls it (GP:122-123).
- Research decisions: physics pays for reactions; shipped games keep the run kinematic; the lean must stay in the target
  (H183:46, :62-63) [read]. Physics on the picture, not the controls (H186:72-75) [read].
- **Cost: never measured.** R4.7 exists only on E's clone and was never run (GP:9, GP:257-265).

**Where the ground is thin, and what I read myself:** GP does not say whether the picture ragdoll can touch the level. [2nd reader: DOWNGRADED. The room's record does: H183:54 (handback/p-l183-physics-anim-E_2026-11-12.md) says the picture ragdolls live in a separate `PhysicsSystem` "fed the world's nearby boxes and stepped after the sim tick". See RE-DERIVED 1.] It
cannot on main (above). GP does not cover the sim's reaction signals; I read them (section 3c).

## 2. What I read at source that is NEW

### 2a. Jolt Physics v5.6.0 (MIT) — use the code (it is already linked)

Licence: MIT, "Copyright 2021 Jorrit Rouwe" [read] `J/LICENSE:1-5`
(https://github.com/jrouwe/JoltPhysics/blob/master/LICENSE, the same text in the submodule). Commercial use allowed;
keep the copyright and permission notice in copies; no share-alike; redistribution allowed. The game already ships it.

- **The soft-keyframe sample, whole** [read] `J/Samples/Tests/Rig/SoftKeyframedRigTest.cpp:1-103`. Two lines drive it:
  `mRagdoll->DriveToPoseUsingKinematics(mPose, inParams.mDeltaTime);` (:89) and gravity cancelled by
  `AddLinearVelocity(... GetGravity() * inParams.mDeltaTime)` (:92). NEW to the record: the sample caps every part at
  `bcs.mMaxLinearVelocity = 10.0f` "to avoid excessive jittering when the head hits the bar" (:46-52), and says that cap
  "also limits how fast an animation can be" so "the ragdolls lag behind", and that one can instead clamp "the needed
  velocities" (:47-50). The sample's level has a wall of dynamic boxes and a static bar (:31-41): collision is its point.
- **The powered sample, whole** [read] `J/Samples/Tests/Rig/PoweredRigTest.cpp:1-137`. Motors to a "sprint" with the
  root taken back from the bodies by `GetRootTransform` (:79-81); it draws its own max error each step (:93-109). Nothing
  in it balances (agrees with H183:38).
- **What the drive does** [read] `J/Jolt/Physics/Ragdoll/Ragdoll.cpp:636-645`: `DriveToPoseUsingKinematics` calls
  `MoveKinematic` on every body; `J/Jolt/Physics/Body/MotionProperties.inl:16-20` sets linear velocity = delta/dt and
  angular velocity from the delta rotation. So on dynamic bodies it is a velocity set, then the solver acts.
- **NEW: a spin cap that every dynamic part obeys.** `mMaxAngularVelocity = 0.25f * JPH_PI * 60.0f` (47.1 rad/s) and
  `mMaxLinearVelocity = 500.0f` [read] `J/Jolt/Physics/Body/BodyCreationSettings.h:111-112`; clamped each integration
  "(not for kinematic bodies)" [read] `J/Jolt/Physics/PhysicsSystem.cpp:1623-1627`. Default damping 0.05 linear and
  angular (BodyCreationSettings.h:109-110). [inferred] A forearm or hand that must spin faster than 47 rad/s to stay on
  its keyframe cannot; I did not measure the hunter's peak, and no record says it was checked.
- **NEW: Jolt's own stabilisers, unused on main.** `RagdollSettings::Stabilize()` limits parent/child mass ratios to
  0.8-1.2 and raises parents' inertia to at least the sum of their children's, "Based on: Stop my Constraints from
  Blowing Up! - Oliver Strunk (Havok)" [read] Ragdoll.cpp:51-56, :108-109. `CalculateConstraintPriorities` "constraints
  near the leaves of the ragdoll have a lower priority than constraints near the root" [read] `J/Jolt/Physics/Ragdoll/
  Ragdoll.h:30-33`, added in v5.5.0 [read] `J/Docs/ReleaseNotes.md:58`. `grep` finds neither in game/ragdoll.cpp [read].
  [inferred] The motor failure was the textbook case (four small bodies hanging off keyed ones, H185r:85-86).
- **NEW: warm-start reset on re-placement.** `ResetWarmStart` exists "when repositioning a ragdoll through
  Ragdoll::SetPose in such a way that the orientation of the bodies completely changes" [read] ReleaseNotes.md:316.
  E's >1 m re-placement (H185g:49) is that case; whether the branch calls it is not known to me.
- **Rates.** "In general, the system is stable when running at 60 Hz with 1 collision step" [read] `J/Docs/Architecture.md:740`.
  Motor frequencies valid in "(0, 0.5 * simulation frequency]" [read] :545.
- **Sleep = "settles".** An island sleeps when its points move under `mPointVelocitySleepThreshold = 0.03f` m/s for
  `mTimeBeforeSleep = 0.5f` s [read] `J/Jolt/Physics/PhysicsSettings.h:95`, `:102`; Architecture.md:421. Velocity steps
  default 10, position 2 [read] PhysicsSettings.h:84-87.
- **Shapes may be shared between systems; nothing else may.** "The only object that can be shared between PhysicsSystems
  is a Shape" [read] Architecture.md:856; several systems may run "provided that you do not share any objects (bodies,
  constraints)" [read] :855. Step listeners exist to "set velocities on ragdoll bodies" each step [read] :928.
- Jolt's cross-engine report (Rouwe, 22 Jan 2022, updated 2023) [read text only] https://jrouwe.nl/jolt/JoltPhysicsMulticoreScaling.pdf
  lines "Discrete Ragdoll Test vs Platform": its absolute steps per second are only in a chart I could not render, so I
  have **no per-ragdoll time** from it.

### 2b. An open active ragdoll that stays on its feet: sergioabreu-g/active-ragdolls (Unity) — use the idea only

Licence: Apache-2.0 [read] the repository's `LICENSE` (https://raw.githubusercontent.com/sergioabreu-g/active-ragdolls/master/LICENSE,
lines 1-3 "Apache License Version 2.0") and its README "licensed under the Apache 2.0 License". Commercial use allowed;
attribution: keep the licence and any NOTICE, state changes (§4); no share-alike. It is C# for Unity, so nothing of it
can be used as code here; **idea only.** Repo pushed last 2021-02-02 [read: GitHub API].

- Structure [read] README.md "Structure": an animated body drives ~~a hidden copy~~ [2nd reader: UNSUPPORTED, README "Structure" says "one plays standard animations and the other one is the ragdoll that tries to follow it"; nothing read says hidden]; each joint of the physical body targets
  "its animated peer rotation" by joint drives (AnimationModule.cs:72-76 `SetTargetRotationLocal`).
- **How it stays up** [read] PhysicsModule.cs:14-20, :87-115: four modes, default `STABILIZER_JOINT` (:23). That mode is a
  KINEMATIC body joined to the torso and turned to the target each step (:112-113); `UPRIGHT_TORQUE` adds a torque of
  `uprightTorque = 10000` (:28) toward world up (:89-96); `FREEZE_ROTATIONS` locks the torso's rotation (:163).
- [inferred] So the open example stays on its feet by an outside hand on the torso, not by balance. That is our keyed
  pelvis and lower spine under another name. It confirms the split E built and says nothing for physics-balanced running.

### 2c. Inertialization, the published explanation — use the idea

- [2nd reader: DOWNGRADED. The word "inertialization" is not in this 2-page talk; it calls the method a post-process motion transition. The name comes from Bollo's GDC 2018 talk and Holden's page. RE-DERIVED 3.] Bollo, "High Performance Animation in Gears of War 4", SIGGRAPH '17 Talks, 2 pages [read, whole, pdftotext]
  https://history.siggraph.org/wp-content/uploads/2022/09/2017-Talks-Bollo_High-Performance-Animation-in-Gears-of-War-4.pdf
  §2. Method: "record the source animation's velocity and the difference between the source and target poses", build a
  quintic "that matches the pose difference and velocity at the beginning of the transition and converges to zero by
  the end", add it to the target; "By controlling the curve's initial acceleration, we are able to enforce an
  overshoot-free transition." Cost 12 us vs 30 us for a blended transition (Xbox One). Licence: © the author, ACM terms
  on the copy (personal/classroom use); an idea, nothing copied.
- The GDC 2018 talk with the quintic's coefficients is behind the GDC Vault (search result for
  gdcvault.com/play/1025165); not read. The exact polynomial is therefore **[summary]** here.

### 2d. Spring dampers with code: Holden, "Spring-It-On: The Game Developer's Spring-Roll-Call" — use the code

- Article [read, downloaded and stripped to text] https://theorangeduck.com/page/spring-roll-call, sections "The Half-life
  and the Frequency", "The Critical Spring Damper", "Inertialization", "Timed Spring". Its code is in the repository
  https://github.com/orangeduck/Spring-It-On, licence MIT, "Copyright (c) 2021 Daniel Holden" [read]
  raw LICENSE:1-3 and GitHub API `spdx_id: MIT`. Commercial use allowed; keep the notice; no share-alike. The room
  already landed `damper_exact` from the sibling repo (GS:65-72); this adds:
- `halflife_to_damping(h) = 4 ln2 / h` and the critical spring `x = eydt*(j0 + j1*dt) + c` (section "The Critical
  Spring Damper"); `decay_spring_damper_exact` for a goal of zero.
- [2nd reader: RE-DERIVED 2, GS:68-69 and GC:65 hold it] Inertialization by spring: at the switch `off_x = (src_x + off_x) - dst_x; off_v = (src_v + off_v) - dst_v;`, then each
  step decay the offset and add it back (section "Inertialization"). The article says a spring "does not provide a fixed
  blend time and can easily overshoot", unlike Bollo's polynomial (same section).
- `halflife_to_lag(h) = h / ln2`: the time a critical spring trails a target moving at constant speed (section "Timed
  Spring"). [2nd reader: DOWNGRADED. E's blend s = 1 - e^(-dt/tau) (H185g:35) is a first-order filter; Holden's lag formula is for a second-order critical spring. The steady lag number is the same relation, the response is not: no velocity continuity, no overshoot. Say "matches the lag", not "IS".] [inferred] So E's tau IS this lag: tau 0.005 s = half-life 3.5 ms; tau 0.01 s = half-life 6.9 ms.

## 3. The design

### 3a. What it is, in one paragraph [ours, built on E's mechanism]

One **PictureWorld**: a single Jolt `PhysicsSystem` owned by the game side, holding every active character's ragdoll and
the level's static shapes, stepped once per **sim tick** after the poses are made, read back as each body's drawn
pose and interpolated with the frame's alpha like `BodyPose::between`. It reads the sim and writes nothing. Each part of
each body is in one of three states: **keyed** (kinematic, exact), **soft** (dynamic, velocity pulled to the keyframe each
step, strength s), or **free** (s = 0, a ragdoll). Reactions are envelopes on s. Off-screen or far bodies are not
simulated; turning a body off inertializes the difference away.

### 3b. Inputs and outputs

| in | from | already exists? |
|---|---|---|
| target pose (22 joints) | hunter: `gait_pose` per tick; player: `Body::pose` per tick | player yes (GC:46-47); hunter per FRAME today, phase in the stage (GC:28, GC:34-36) |
| part states and taus | a table per body kind (3d) | no |
| reaction events | `chase::Event` `Caught` [read] chase/run.h:81; chaser `gait == Recover` with `wall_recover` (head-on wall at speed) [read] chase/chaser.cpp:415-424, after a drop [read] :118-121; `scraped` (edge in the way) [read] chase/chaser.h:98 | in the sim; ChaserPose carries gait but not `scraped`/`wall_recover` [read] game/world/world_app.h:79-95 |
| level collision | the sim's static pieces: one `MeshShape` per piece [read] sim/physics.cpp:240, added to a `MutableCompoundShape` at an origin [read] :414-418 | shapes exist; not reachable from game/ [inferred] |
| out | per body, per joint: position and frame (`SkeletonWorld`), then `drawn_from` -> palette | E's branch has the path (H185g:46-47) |

[inferred] Add the pieces' immutable `MeshShape`s to the PictureWorld as static bodies at their origins, NOT the sim's
`MutableCompoundShape`: Jolt allows sharing a Shape (Architecture.md:856), and a const piece cannot change under the
picture's queries. This needs one read-only accessor out of `sim/physics` (the only file allowed to hold Jolt types in
the sim, H183:52); its exact shape is a builder's call.

### 3c. Where it sits (files and functions the code map names)

- `game/ragdoll.{h,cpp}`: today one `PhysicsSystem` per `Ragdoll` with a 1 MB temp allocator each [read]
  ~~ragdoll.cpp:110-112~~ [2nd reader: WRONG; the allocator is the member `temp{1024 * 1024}` at ragdoll.cpp:60; one more fact the scout did not give: the system uses `JobSystemSingleThreaded` (:61) and `object_pair` lets everything collide (:57)]. Becomes: `PictureWorld` owns the system, the static pieces and N `Ragdoll`s [ours].
- Hunter: `WorldStage::place_figures` (stage.cpp:256-281, GC:28) calls `Ragdoll::key` on E's branch per frame
  (H185g:46-50). Move the key to the tick: `WorldApp::ease_poses` already runs per tick for every chaser (GC:25) [ours]. [2nd reader: GAP. `ease_poses` makes a `ChaserPose`, not a skeleton pose. The pose needs `gait_pose`, whose phase is advanced in the stage by the FRAME's dt (GC:28, GC:34-36). Keying on the tick means moving the stride phase to the tick, an edit in C's gait file (GP:231, L205) that the scout does not name, and that changes the hunter's leg phase on every machine.]
- Player: after `Body::tick` (world_app.cpp:706, GC:46) [ours]; `HandOverride` (body.h:93) stays the arm's REACH; the
  physics only adds contact and slide [inferred: a soft body only follows; it cannot decide to reach a wall].
- Events: copy `scraped` and `wall_recover` into `ChaserPose` in `gather_poses` (world_app.cpp:528-537) [ours]; it is a
  read of the sim, as the other fields are.

### 3d. The few parameters, with sourced defaults

| # | parameter | default | source |
|---|---|---|---|
| 1 | step rate | the sim tick, 240 Hz; read back interpolated | sim tick: GR:22; Jolt stable at 60 Hz (Architecture.md:740), so 4x margin [inferred]. Replaces E's frame dt [ours] |
| 2 | tau per group, per kind: trunk (chest, neck, head, eye), arms (shoulder to hand) | 0.005 s, 0.01 s for every humanoid kind until his eye says otherwise | ours, E's sweep (H185g:75-80); legs, pelvis, lower spine KEYED: shipped games keep running kinematic (H183:46), lean must lead (H183:63) |
| 3 | reaction envelope: floor, recovery | 0.15, 1.0 s, linear back | shape Overgrowth ragdoll state and WakeUp [summary] H183:32, GP:91; numbers ours (H185g:38) |
| 4 | free fall strength (drops, the player's catch) | s = min(0.8, abs(v) x 0.1) while falling | Overgrowth `aschar.as` [summary] H183:32 |
| 5 | active set | the player, the hunter, the nearest 2 lesser chasers on screen, plus any body inside an envelope | his "Nearest two or three full detail" is about models (brief:1274); using it for physics is my inference |

Fixed, not knobs (set once at build) [ours unless marked]:
- `Stabilize()` and `CalculateConstraintPriorities()` on the settings (Jolt's own, 2a); `ResetWarmStart()` with every
  re-placement (ReleaseNotes.md:316); E's re-placement rule (>1 m jump, keyframe velocity) kept.
- Gravity: keep E's "keyframe's share removed", i.e. cancel gravity times s, so a free part falls and a soft one does not
  sag [inferred from SoftKeyframedRigTest.cpp:92 and H185g:33]. [2nd reader: DOWNGRADED. The sample cancels the WHOLE gravity step (:92); H185g:33 says "the keyframe's share of gravity taken off" and no more. "Gravity times s" is in neither; it is [ours] and untested, and at s = 0.15 it leaves 85% of gravity on a body the catch wants to hold up.]
- No `mMaxLinearVelocity = 10` as in Jolt's sample: the hunter runs 9.0-16.7 m/s (GR:136) and the sample says the cap
  makes ragdolls lag (:47-48). If wall contact jitters, clamp the CORRECTION (needed velocity minus the keyframe's own) as
  the sample's comment allows (:49-50) [ours]; the bound is measured, not guessed.
- The spin cap (47.1 rad/s) is checked, not assumed: log each soft part's keyframe angular speed over the 16 runs; if any
  exceeds it, raise `mMaxAngularVelocity` for that part [ours].
- Solver iterations: E's 30/10 were set for MOTORS (H185r:66-68) and carried over unmeasured for the soft key
  (H185g:40-43). Re-sweep 10/2 (Jolt default), 15/4, 30/10 against R4.3/R4.4; take the cheapest that passes [ours].
- Switching a body OFF: record per joint the offset (physics - target) and its velocity, decay with Holden's
  `decay_spring_damper_exact`, half-life 0.06 s [ours: the player body's own settle time `kSettleTime 0.06` (GC:171),
  itself unsourced]. Switching ON needs nothing: placement on the target at its velocity is continuous (H185g:41-42).
- "Settles": a free body is settled when Jolt puts its island to sleep (0.5 s under 0.03 m/s, PhysicsSettings.h:95, :102).

### 3e. Reactions, by trigger [ours unless marked]

| trigger (read from the sim) | who | what the layer does |
|---|---|---|
| `Caught` | hunter | envelope 3 (E's step 5, green) |
| `Recover` with `wall_recover` | any chaser with a body | envelope 3; the wall itself is in the PictureWorld, so the soft chest and head meet it: no impulse authored [inferred] |
| `Recover` after a drop; `Drop` gait | any chaser | parameter 4 while airborne, envelope 3 on landing |
| `scraped` | any chaser | nothing extra: the soft arms meet the edge by contact alone [inferred] |
| hand against a wall | player | arms soft, contact from the static pieces; reach from `HandOverride` (L188 step 5, owed GP:244-246) |
| the player's catch | player | whole body free (legs too), parameter 4; settled = asleep; the drag and camera are other laps (K1) |

### 3f. Picture only, kept by construction and by gates

- Separate system; the sim never reads it; shapes are the only shared objects (Architecture.md:856) [read]. The static
  pieces are `shared_ptr<const StaticPiece>` [read] sim/physics.cpp:227-229.
- Gates every lap keeps: his 16 kept runs byte-identical, base against branch (H185g:106), and `dz-world --selftest` part 7
  (GR:47-49) [summary]. R4.6 (same bits twice) keeps the picture repeatable for tests.
- [inferred] Stepping on the sim tick also makes the picture the same at 144 and 360 frames a second, which the frame-dt
  step does not (Jolt's results depend on dt; E's own blend is dt-corrected, the solver is not).

### 3g. Cost per character per frame

- **Not measured anywhere** (GP:259). R4.7's row exists on E's clone and times `key()`/`read()` with `DZ_BENCH=1`
  (H185g:125-126) [read]. It is the gate for item 5's set growing past the hunter and the player.
- [inferred, order of magnitude only] Per step: about 14 soft bodies get one velocity set (under 1 us); the solver does
  21 joints x (velocity + position iterations); plus contacts of ~14 small shapes against the nearby mesh. My guess is
  tens of microseconds per character per step on one core, uncertain by several times either way. At 240 steps a
  second and 360 frames a second that is 0.67 steps per frame. Four active bodies at 50 us a step would be about
  0.13 ms of CPU a frame against the 3.33 ms frame (GR:14-20). The iteration re-sweep (3d) is the main lever.
- Memory: one 1 MB temp allocator per ragdoll today (~~ragdoll.cpp:111~~ [2nd reader: :60]) becomes one per PictureWorld [read/ours].
- Off the active set a body costs one inertialization decay per joint for 0.3 s or so, then nothing [inferred].

### 3h. The same layer for each body

- **Hunter**: as E built, plus walls and the tick step. 2.15 m, arms flared (V1), up to 16.7 m/s (GR:86-87, GR:136).
- **A lesser chaser**: nothing until it has a humanoid model; the boxes have no joints (GC:212-214). With a model on the
  same skeleton it takes `gait_pose` (GC:189-195) and this layer unchanged, with its own taus row. The pack's "shared fixed
  rhythm" (T4) survives because a soft body at these taus stays within millimetres of its keyframe (R4.3) [inferred].
- **The player**: arms soft (shoulders to hands), trunk and legs keyed to the camera-hung body, so the eye stays where
  the camera is (the L161 guard, GP:207). K1 (eye from a head body) is a later lap and not this layer's job.

## 4. The FIRST lap a builder would do

**Precondition, not this lap:** E's L185 steps 4-5 landed (needs his eye on the clip, H185g:132-133), and R4.7 run once.

**Lap: the level's walls in the picture world.** The smallest piece that does what nothing does today (his 159 for the
hunter's arms) and that every later reaction needs.
- Files: `game/ragdoll.{h,cpp}` (static bodies from the pieces; `Stabilize`, priorities, warm-start reset);
  `sim/physics.{h,cpp}` (a read-only accessor to each piece's shape and origin); `game/world/stage.cpp` (pass them);
  `game/tests/ragdoll_tests.cpp` (the rows).
- **The red row**, registered before code: *on his 16 kept runs, at every drawn frame, no drawn hunter elbow, wrist, hand
  or head is more than 1 cm inside the level's static geometry* (a small sphere at each joint, `CollideShape` against the
  pieces, deepest penetration reported). Measured on main today from `gait_pose` alone, so it needs no branch to read
  red. [inferred] It is likely red: a 2.15 m body with flared arms through doorways (~~164: "caught on walls and door ways",~~ [2nd reader: UNSUPPORTED as evidence. Item 164 is about the hunter's movement getting caught on walls and doorways, the sim's path, not arms: brief:1131 "it gets caught on walls and door ways too much too, and is able to turn way too fast". The premise stays [inferred] with no source.]
  brief:1131). Green after: the soft parts are pushed out by contact.
- **Its falsifier, registered first:** if main already reads at most 1 cm on all 16 runs, the premise is false; the lap
  stops and reports the number.
- Kept rows: R4.1 (16 runs identical), R4.2 (legs keyed). R4.3 is amended BY NAME before the run to count only frames
  with no contact, because a wall is meant to push a body off its target.
- One unwelcome outcome to register: the arms jitter against a wall. Then the correction clamp (3d) with its bound
  measured and named.

## 5. What only his eye decides, and the fewest clips

Clips at full frame rate and lit, with the "before" the current main and never older than a fix he has seen (brief:1606,
as GR:159-161 records the ruling).
1. **How much the arms carry on after a stop** (tau arms). One clip, the hard stop from behind, three settings side by
   side: tau pairs 0.005/0.01, 0.01/0.02, 0.01/0.03 s, hands past 13, 24, 32 cm (H185g:75-80). E already wrote "His eye
   may want more swing than 13 cm" (H185g:82).
2. **How big the catch reaction is** (floor 0.15 against 0.05). One clip pair, unless the death camera hides it (REG:89).
3. **After the first lap**: the hunter through the tightest doorway on a kept run, main against the lap. One clip.
- Not for his eye: whether it is stable, repeatable or picture only. Those are rows.

## 6. What I would NOT build, and why

- **Physics-balanced running** for any body: the shipped sources keep running kinematic (H183:46); the open active
  ragdoll I read stays up only by a kinematic hand on the torso (PhysicsModule.cs:110-113). Item 153 forbids a home-made
  balancer with no source.
- **Swing-twist motors to follow a run**: stopped red at source-level settings (H185r:16-18).
- **A 22-number strength table per kind**: two taus per kind plus keyed groups cover what was measured. More knobs, no
  source.
- **Jolt's sample velocity cap of 10 m/s**: our bodies run faster and the sample says it lags (3d).
- **Physics for the lean** or any lead: physics follows; item 151 wants a lead (H183:63).
- **Physics for fingers**: E kept them out of the ragdoll (GP:241-243).
- **The raw head as the camera**: Mirror's Edge tried it, "not very good" (H186:38); K1 is a filtered, separate lap.
- **Physics on the box placeholders**: nothing to move.
- **Stepping the picture world inside the sim**: no gain and a determinism risk (H183:55).

## What I did not open

- E's clone `worktrees/dz3-e-l185` and its commits (rule 9): whether it calls `Stabilize`, `ResetWarmStart`, or which dt
  its rows ran at is unknown to me.
- The clip `worktrees/clips_L185/index.html`; any capture.
- Overgrowth's `aschar.as` and `riggedobject.cpp`: their content here is [summary] via H183.
- Bollo's GDC 2018 slides or video (Vault); the quintic's coefficients.
- Holden's "perfect tracking springs" and "Dead Blending" pages, named by the roll-call and the search, not read.
- The chart values in Jolt's multicore report (images); `J/PerformanceTest/RagdollScene.h` beyond lines 15-30.
- active-ragdolls' prefabs and scene files (the drive spring values in them), `ActiveRagdoll.cs`, `GripModule.cs`.
- The other Unity/Godot active-ragdoll repositories the search named (matieme, ashleve, R3X-G1L6AME5H).
- dreamzone-3: `game/body.cpp`, `game/camera.*`, `game/world/stage.cpp` bodies (cited via GC), any test body,
  `chase/run.cpp`; the hunter's actual peak arm angular speed (not measured).
- The brief beyond the lines cited.

## Second reader

Adversarial second reader, 2026-11-13. Read-only; the only file written is this one. Outside primaries downloaded with curl and
read as text: Jolt v5.6.0 submodule (e77f175) at the checked-out tree, the active-ragdolls repo files, Holden's page and repo
files, Bollo's PDF (pdftotext), Jolt's multicore PDF (text only; I could not render its charts either). Game code read at
main 31d1c6d.

### What I checked

| line | claim (short) | primary opened | verdict | evidence |
|---|---|---|---|---|
| 64 | Jolt MIT, Copyright 2021 Rouwe | J/LICENSE:1-5; raw master LICENSE | OK | text identical in first lines; commercial use, notice kept, no share-alike |
| 68-73 | soft sample whole; :89, :92; cap 10 :46-52; wall and bar :31-41 | SoftKeyframedRigTest.cpp:1-103 | OK | `bcs.mMaxLinearVelocity = 10.0f` :52, comment :46-50 |
| 74-76 | powered sample, root by GetRootTransform, draws error | PoweredRigTest.cpp:1-137, :79-81, :93-109 | OK | error is drawn as text :109; "sprint" :25, :32 |
| 77-79 | drive = MoveKinematic velocity set | Ragdoll.cpp:636-645; MotionProperties.inl:16-20 | OK | `mLinearVelocity = ... inDeltaPosition / inDeltaTime` |
| 80-82 | spin cap 47.1, linear 500, not for kinematic | BodyCreationSettings.h:111-112; PhysicsSystem.cpp:1623-1627 | OK | 0.25*pi*60 = 47.12 |
| 82 | default damping 0.05 | BodyCreationSettings.h:109-110 | OK | both 0.05f |
| 85-89 | Stabilize ratios 0.8-1.2, inertia, Strunk | Ragdoll.cpp:51-56, :108-109 | OK | comment names Strunk slides 16, 34 |
| 87-89 | priorities, added v5.5.0 | Ragdoll.h:30-33; ReleaseNotes.md:58 | OK | line 58 sits in the v5.5.0 block (:53-73) |
| 89 | main's ragdoll.cpp calls neither | grep of game/ragdoll.cpp | OK | no match for Stabilize, priorities, ResetWarmStart |
| 91-92 | ResetWarmStart after SetPose | ReleaseNotes.md:316 | OK | wording matches; it sits in the v5.0.0 block, older than 5.6 |
| 94-95 | stable at 60 Hz; motor freq range | Architecture.md:740, :545 | OK | quotes exact |
| 96-98 | sleep 0.03 m/s, 0.5 s; 10/2 iterations | PhysicsSettings.h:84-87, :95, :102; Arch :421 | OK | exact |
| 99-101 | only a Shape shared; step listeners | Architecture.md:855, :856, :928 | OK | quotes exact |
| 102-104 | multicore report, no per-ragdoll time | jrouwe.nl PDF text | OK | scene is 160 ragdolls, 3680 bodies (text :15); chart values not in text; I could not render them |
| 38 | main ragdoll.cpp:150 and :191 | game/ragdoll.cpp at 31d1c6d | WRONG | 159 lines; actual :99 and :140 (GP:70 had them right) |
| 39 | system init at ragdoll.cpp:127 | same | WRONG | `system.Init` is :76 |
| 176, 241 | 1 MB allocator at ragdoll.cpp:110-112, :111 | same | WRONG | `temp{1024 * 1024}` is :60 |
| 108-111 | active-ragdolls Apache-2.0, repo pushed 2021-02-02 | LICENSE, README:89, GitHub API | OK | the LICENSE file is the unfilled template ("Copyright [yyyy] [name of copyright owner]", :189), no holder named |
| 113 | "an animated body drives a hidden copy" | README "Structure" | UNSUPPORTED | README says one body animates, one is the ragdoll; "hidden" absent |
| 113-114 | joints target animated peer rotation, AnimationModule:72-76 | Anim.cs; README:49-50 | OK | call is :74; the quote is README:50 |
| 115-117 | four modes, default stabilizer joint, torque 10000, freeze | PhysicsModule.cs:14-23, :28, :87-115, :163 | OK | stabilizer is kinematic, moved and rotated at :112-113 |
| 4-5 | "stays up only by a hand-of-god torque" | PhysicsModule.cs:23, :110-113 | DOWNGRADED | default is a joint drive to a kinematic anchor, not a torque; its strength is unopened |
| 123-129 | Bollo quotes, 12 us vs 30 us, ACM licence | Bollo PDF, section 2, footer | OK | quotes exact; "Xbox One" belongs to the 20 us figure |
| 121-123 | Bollo is "the published explanation of inertialization" | same PDF | DOWNGRADED | the word is not in the talk; method is there, name is from GDC 2018 and Holden |
| 137-141 | Holden MIT 2021; halflife_to_damping 4 ln2 / h; critical spring | LICENSE; page :1118, :1304-1309; common.h:213 | OK | repo common.h holds the same functions, so the MIT code is the code read |
| 142-144 | inertialization by spring; spring may overshoot | page :1488-1530 | OK | "does not provide a fixed blend time and can easily overshoot" |
| 145-146 | halflife_to_lag = h / ln2; E's tau IS this lag | page :1743-1749; H185g:35 | DOWNGRADED | formula OK; E's blend is first-order, the formula is for a critical spring |
| 5 | Holden's spring makes physics-off pop-free | Holden page | UNSUPPORTED | page is about animation-to-animation; no physics handoff in it |
| 165 | Caught run.h:81; chaser.cpp:415-424, :118-121; chaser.h:98; world_app.h:79-95 | each file at 31d1c6d | OK | `wall_recover` is chaser.h:102; ChaserPose lacks scraped and wall_recover |
| 166, 225 | sim/physics.cpp:240, :414-418, :227-229 | same | OK | :227-229 is the factory's `shared_ptr<const StaticPiece>` return type |
| 178-182 | world_app.cpp:528-537, :706; body.h:93 | same | OK | `body_.tick` :706; `struct HandOverride` :93 |
| 21-35 | his words 158, 159, 160, entity_bodies, 1274 | brief:1118, 1120, 1122, 1286, 1378, 1274 | OK | cuts are marked by the scout |
| 47-50 | R4.3, R4.4, tau sweep numbers | H185g:57-80, :106 | OK | all match |
| 50-52 | motors red, 3x unstable | H185r:16-18, :39-47, :80-81 | OK | lines match |
| 265 | arms through doorways, item 164 | brief:1131 | UNSUPPORTED | item 164 is the hunter's path catching on walls, not arms |
| 198-199 | cancel gravity times s | SoftKeyframedRigTest.cpp:92; H185g:33 | DOWNGRADED | sample cancels all gravity; E's rule is not "times s" |
| 192 | free fall strength min(0.8, abs(v) x 0.1) | H183:32 (a summary of Overgrowth) | DOWNGRADED | second-hand, speed unit unknown; no source for applying it to the player's catch |
| 57-58 | GP does not say if the picture ragdoll can touch the level | H183:54 | DOWNGRADED | the record already says "fed the world's nearby boxes" |
| 163, 200, 246 | gait per frame; hunter 9.0-16.7 m/s; GR budget lines | GC:28, :34-36; GR:136, :14-22, :86-87 | OK | lines match |
| 53-54, 294-298 | H183:46, :52, :55, :62-63; H186:38, :72-75 | the hand-backs | OK | lines match |

### Tally

Rows checked: 40. OK 28, WRONG 3, UNSUPPORTED 3, DOWNGRADED 6. The three WRONG rows are one error in three places (game/ragdoll.cpp line numbers); the content they point at is true.

### RE-DERIVED: 3 (and 2 at hand-back level)

1. Scout section 3a and 3f (a separate picture-only `PhysicsSystem`, the sim never reads it, read the sim, write nothing) =
   GP:69-70 ("own PhysicsSystem ... writes nothing to the sim"), and H183:54 for feeding it the level's boxes, stepped after
   the tick. New in the scout: sharing the immutable shapes, the tick rate (H183:73 said "not necessarily 240 Hz").
2. Scout 2d "Inertialization by spring" (lines 142-144) = GS:68-69 (`spring.h:162-211`, inertialization, read, "Not taken") and
   GC:47, GC:65 (the player body already inertializes targets and mid joints). New: the page's text on overshoot.
3. Scout 2c Bollo (lines 123-129) = GS:177-179 (B14: method "post-process from offset and velocity", cited, and the player
   body does a form of it). New: the 12 us / 30 us figures and the quintic wording.
- Hand-back level: PoweredRigTest root by `GetRootTransform` and "nothing balances" = H183:38 (scout says it agrees); the
  soft-key drive and gravity cancel = GP:89 and GP:77 (the sample's two lines are new detail, the cap is new).
- Honest new at source, confirmed: Stabilize, constraint priorities, ResetWarmStart, the 47.1 rad/s cap, the sample's
  10 m/s cap and its comment, the active-ragdolls modes. No hit for these anywhere under handback/, loop/ or briefs/ except
  this file.

### Simplest way the first row passes without doing what it is for

The row: no drawn elbow, wrist, hand or head more than 1 cm inside static geometry, on 16 runs.
- Push the joint points out of the walls after the pose (a kinematic clamp at each joint). Row green, no physics layer, and
  the arm mesh between joints still crosses the wall. A sphere only at four joints cannot see a forearm cutting a corner;
  add segment samples (elbow to wrist, wrist to hand) or the row can be met by luck of where the joints sit.
- Green by never being near a wall: the row has no non-vacuity count. Report how many frames have any listed joint within
  10 cm of geometry; if few, the row says nothing. The scout's falsifier only covers the case where main already reads
  under 1 cm.
- An empty or wrongly placed static set (a piece with no triangles is legal, sim/physics.cpp:238) makes every query clean.
  Add a row that the picture world holds as many static shapes as the sim's compound, at the same origins.
- Amending R4.3 to "frames with no contact" lets everything be called contact. Fix the contact definition (a pair with a
  penetration or a manifold under a distance) in the registration, and report the count of excluded frames.

### Mechanisms with no source and no [ours] mark, or marked too softly

- "Gravity times s" (lines 198-199): marked [inferred] but is new mechanism; see the strike there.
- The active set's "on screen" and "far away" (parameter 5, 3g): no distance, frustum test or hysteresis is given, so the
  brief's "when it must be switched off" is not answered, only "nearest 2". [ours] to add, with a number from a run.
- Free state at s = 0 for the player's catch and the legs (3a, 3e): E's floor is 0.15; s = 0 is Overgrowth's ragdoll state
  (summary only) and no row tests legs free.
- `Stabilize()` and priorities as "fixed, not knobs": Jolt's own, sourced as stability aids for constraint-driven
  ragdolls. on main the joints are built "wide open" (ragdoll.cpp:103, half cone 0.5 pi; E's branch not opened) and the soft key sets velocities, so
  they were built for a mechanism the branch no longer uses; Stabilize changes masses and inertias, which changes how a
  body answers a contact. Untested for this use; mark [ours] and put them behind R4.3 and R4.4.
- Half-life 0.06 s for switching off: the scout marks it [ours] and unsourced.

### Gaps the design does not answer

- One shared world, `object_pair` "lets everything collide" (ragdoll.cpp:57): the hunter's arm would collide with a lesser
  chaser's body or the player's picture body. No collision-group rule is given; that would change drawn poses with no
  source.
- Rate: 240 steps a second is 1.67 steps a frame at 144 fps and up to 12 after a 50 ms hitch; no cap or catch-up rule is
  given. The cost line prices only 360 fps (0.67 steps a frame).
- The tick move needs the gait phase on the tick (see the note at 3c).
- R4.3, R4.4 and R4.6 were run at the frame's dt; at a 1/240 step the blend s = 1 - e^(-dt/tau) is 0.565 per step for
  tau 0.005 (0.75 at 144 fps). The solver and contacts are not dt-corrected, so the green rows do not carry over; the scout
  says the dt is unknown to it, but the tick design makes it a precondition.
- Single-threaded job system (ragdoll.cpp:61): cost grows with every body added to one world on one thread.

### What I could not check

- Cost: no source gives a per-ragdoll time; the multicore report's chart values were not readable as text and I had no
  renderer; the 50 us estimate is untested.
- E's branch code (not in the repo), whether it calls Stabilize or ResetWarmStart, and the dt of its rows.
- The active-ragdolls stabilizer drive strength (a serialized prefab value) and the GDC 2018 quintic.
- Overgrowth `aschar.as` and `riggedobject.cpp` (second-hand through H183 for me too).
- The hunter's peak forearm angular speed against the 47.1 rad/s cap; no record measures it.
- Whether the arm samples in the first row reach the hunter's arm mesh (no run, rule 1).

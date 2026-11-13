# Scout: the player in first person (animation system swarm, 2026-11-13)

1. The room already has a first-person body that hangs from the eye, hides its head by ray group, and fixed the look-back
   clip by turning the eye round the neck; its chain, lean and stride clock are its own and are not the hunter's.
2. New at source: Unreal's two-body split for first person, Enhanced Camera's eye-pinned body, Cardboard's neck model,
   Godot XR's collision hand, and the head and gaze studies (Pozzo, Hirasaki, Moore, Crane) with two sickness studies.
3. Design: one body pipeline for every humanoid, with one switch: the player is pinned at the eye, the hunter at the feet.
   ~~The view only ever rotates by the hand; the body's motion reaches the eye as translation, through a neck model.~~
   [2nd reader: WRONG for the game it designs for. Today's view also rotates by nod, roll and tip the hand did not ask for:
   `game/shell.cpp:188` "+ rig.pitch_add" (comment "the nod: picture only"), `game/camera.h:12` roll, `:15-22` "shifts and
   tips from foot to foot, and nods", and `game/settings.h:13-15` "goes against that research and was asked for by the first
   person to play the rewrite". The rule is [ours] and would strip what the owner asked for. Only the AIM never moves.]
4. First lap: land the head-first look alone (head = view at once, chest on the first game's trunk spring, hips to the
   travel by Valve's limits), cut from B's parked WIP `a60944d`; the row is red on main 31d1c6d by construction.
5. For his eye: the chest's lag on a flick, the stride cadence (first game 3.54 steps/s against Alexander's 4.39 at
   10 m/s), and the nod; two clips and two toggles. Not to build: Unreal's first-person scale, a second shadow body.

Marks: [read] I opened it (path:line; outside: URL and section); [summary] from a hand-back, a ground file or another
swarm file; [inferred] mine; [ours] a proposal. Game code is dreamzone-3 main **31d1c6d** unless a branch is named.
Record paths are under `C:/Users/nname/Desktop/lighthouse/exo_memory`. Downloads for this file sit in my scratchpad only.

## (1) What the room already has for this aspect

By ground file (gp = `ground_physics_and_fp_body.md`, gc = `ground_code.md`, gs = `ground_sources_read.md`,
gw = `ground_his_words.md`, gk = `ground_constraints_and_roster.md`, gl = `ground_locomotion_and_yardstick.md`).

- His words, checked in the brief myself [read]: item 147 "look back clips into the characters neck and shoulder area"
  (`briefs/dreamzone2_the_game.md:1087-1088`); 156 "kinetic linking, making the whole body work as one. We need to make
  that but better for all entities and even the player character" (:1114); 159, the standard for looking down (:1120);
  163 "perhaps the head moves first when you look, then it moves the rest of the body underneath" (:1128); 82 "the
  camera the player sees through is attached to the face of the real model" (:679-680); `movement-5` "the camera from the
  first person view physically flips with the character" (:1297); `movement-11` "the camera should follow where the
  players head is looking during it, following real locomotion telemetry" (:1308). His picks 162 and 173 are the
  brief's record, not his words (:1127, :1175).
- The body: `Body::pose` hangs head, neck and trunk from the camera eye and reaches limbs by two-bone IK, ticked at 240 Hz
  (gc:41-50; gp:103-106) [summary]. I read the anchor myself: ~~`game/body.cpp:243-246`~~ [2nd reader: the quoted comment is at `game/body.cpp:242`; :243-246 is the code under it] "The head and the neck hang from
  the eye; the shoulders from the neck." [read]
- One yaw for the whole body: `ahead`/`right` come from `player.yaw` for pelvis, chest and head alike
  (`game/body.cpp:225-230`) [read]. So on main the chest never lags the view and the hips never turn to the travel
  [inferred].
- The look-back: eye round the neck, 17.7 cm back at the full glance, picture covered 11-12 % before, 0.0 % after
  (gp:107-112, gp:210-211) [summary]; code `game/body.cpp:145-165`, ~~`game/body.h:164-171`~~ [2nd reader: `game/body.h:153-159`, declared :159; :164-171 is
  `glanced`'s declaration and the L188 dial comment; the function is `body.cpp:167-169`] [read].
- Hiding: head, neck and eye triangles by skin weight plus the hood by mesh name go to `kHeadRayGroup`
  (`game/world/stage.cpp:474-483`, `:561-567`) [read]; primary rays leave that group out (`stage.cpp:658`) while
  shadow rays keep it ("Everything in the head's group still casts its shadow", `stage.cpp:482-483`) [read]. Torch
  lights leave the whole body out (`game/world/beam.cpp:41`, `:61`) [read].
- Feet sideways and backwards landed (L188 step 1, 7 dials all ours) (gp:119-121) [summary].
- Wall hands: the hook `HandOverride` exists, nothing sets it (gp:122-123) [summary]; `game/body.h:93-118` [read].
- The camera: bob, sway, tip, nod, leans, the first game's numbers set by play (`game/camera.h:15-22`, `game/settings.h:
  13-15`) [read]; the aim never moves (`camera.h:20-22`) [read]. Stride: `stride_rate` x sqrt(speed), default 1.12
  (`game/settings.h:52`, ~~`game/camera.cpp:179-180`~~ [2nd reader: `game/camera.cpp:177`; :179-180 are `striding` and `amp_target`; ground_code.md:45 already
  gives :177-178]) [read], pinned by a landed camera row, 3.54 steps/s at 10 m/s
  (`game/tests/camera_tests.cpp:403`) [read].
- The shared pieces the player does NOT use yet: `kinetic_chain` ("the player's body from game/body.cpp next",
  `game/model_rig.h:173`) [read]; Alexander's stride law (gl:79-80) [summary]; the Overgrowth tilt (gc:102) [summary].
- Physics: the soft-key upper body is green on E's local clone only; no player ragdoll; K1/K2 picked, unbuilt
  (gp:4-5, gp:124, gp:235) [summary].
- Parked work that IS this aspect [read: `git show`]: `origin/l188-wip-look` a60944d, "WIP, NOT TO LAND", carries the
  head-first look: a chest yaw on the first game's trunk spring, hips held within 45 degrees and 720 degrees/s of the eyes
  citing Valve `multiplayer_animstate.cpp:1729-1739, :1755`, hips toward the travel citing the first game's [STEER]
  `:6597-6598`, and the row `on_a_sideways_look_the_head_turns_first_then_the_chest_then_the_hips`. Its message says two
  other rows are red there (the joint-jump guard and the slide jerk), from the blend change it also carries.
- Owed and named by the record: "No source covers a first-person camera inside its own body; marked ours twice"
  (gs:300-301) [summary]. This file fills part of that gap (section 2).
- The sickness rule already in the game: "What makes first-person movement sickening is the view doing something the
  hand did not ask for" (`game/settings.h:8-11`) [read]; Titanfall's bob with a fixed crosshair "felt like constantly
  looking left and right" (`docs/research/03_movement_chase_research.md:27`) [summary: that doc's account of a press
  interview].
- Cost: nothing on the player's body has ever been timed (gp:259; gk:202) [summary].

## (2) What I read at source that is new

**S1. Unreal Engine, "First Person Rendering" (docs page, titled 5.9)**,
https://dev.epicgames.com/documentation/en-us/unreal-engine/first-person-rendering, downloaded and read as text [read].
Licence: Epic documentation, no open licence stated; the engine code is not open to us. **Idea only.**
- Body parts tagged "First Person" get their own FOV and a scale "to effectively shrink them closer towards the camera"
  so they do not clip into walls (section "First Person Rendering", feature list).
- That morph makes the geometry "unsuitable for other perspectives and therefore shouldn't cast shadows on the scene or
  be visible in hardware ray tracing reflections" (section "First Person Rendering Implementation").
- So shadows and reflections come from a second mesh, the "World Space Representation": "the primitive that other
  players would see and is used to cast shadow onto the ground and for reflections with hardware ray tracing", and it
  is "invisible to the owning first person camera" (section "First Person Primitives Settings").
- Feet: "an interpolation gradient in the material to have the feet fully in World Space, and the rest of the body in
  First Person space", so the feet meet their shadow (section "First Person Geometry").
- [inferred] Our ray tracer already does the World-Space-Representation job with ONE mesh and two ray masks
  (section 1, `stage.cpp:658` and `:482-483`). Unreal's scale trick cannot carry over: its own page says the scaled body
  is not in the ray-traced world, and every pixel we draw is traced.

**S2. Enhanced Camera for Garry's Mod** (elizagamedev/gmod-enhanced-camera, master 00ee1ef), README.md and
`lua/autorun/client/enhanced_camera.lua`, downloaded raw [read]. Licence: the repository has no licence file (GitHub's
licence field is null), so all rights reserved. **Idea only; no line copied.**
- It "combines the viewmodel and worldmodel and does not modify the camera origin" (README.md:15). The body hangs from
  the eye, as ours does.
- It places the whole model so its skeleton's neck sits at the eye plus a per-pose offset: `offset = self.viewOffset -
  self.neckOffset` (:224), neck read from the skeleton (:446), offset about 10 units back and 5 down for most poses
  (:337), with yaw only, no pitch (:221).
- It hides the head by scaling the head bone to zero (:302-303), and the upper arms when a held pose does not show them.
- It "can not ... Show your shadow" to match the body (README.md:29), and in vehicles it limits the look to 65 degrees
  so you do not look "backwards at your neck" (README.md:48-49). [2nd reader: the quoted words are at README.md:46, the 65 at
  :49; the lock is vehicle-only and a default.]
- [inferred] It confirms the room's anchor (eye-pinned body). It also shows the cost of hiding by bone scale: the head
  leaves the shadow. Our ray groups avoid that.

**S3. Google Cardboard SDK neck model** (googlevr/cardboard master 8bd424d), `sdk/sensors/neck_model.cc`, `.h` [read].
Licence: Apache-2.0 in the file header (`neck_model.cc:1-15`); the repo's LICENSE gives Apache-2.0 to everything outside
`third_party/unity_plugin_api/`. **Use the idea and the two numbers; commercial use allowed; keep the notice if code is
copied; no share-alike; redistribution allowed.**
- The eye turns about a neck pivot: "Rotate eyes around neck pivot point" (`neck_model.cc:36`), and "applying a neck
  model should not elevate the camera" (`:39-41`), so the level eye stays where it was.
- Pivot `kDefaultNeckHorizontalOffset = -0.080f` (Z, forward is -Z) and `kDefaultNeckVerticalOffset = 0.075f`
  (`neck_model.h:29-30`): the pivot 8.0 cm behind and 7.5 cm below the eye.
- [inferred] L174's `glance_eye_offset` is this model for yaw alone with 9 cm back (~~`body.h:164-171`~~ [2nd reader: `body.h:153-159`]). For pitch,
  looking 60 degrees down moves the eye 10.7 cm down and 2.5 cm forward (my arithmetic on those two numbers).
  [2nd reader: arithmetic OK on Cardboard's numbers. But the game's own pivot is `BodyBuild::eye_to_neck` 0.13 down and
  `neck_back` 0.09 (`game/body.h:74-75`). On that pivot, 60 degrees down moves the eye about 14.3 cm down and 6.8 cm forward
  (my arithmetic, same formula). The table below says "add 7.5 down", a second pivot beside the 13 cm one.]

**S4. Godot XR Tools, the collision hand** (GodotVR/godot-xr-tools master 6c6189b),
`addons/godot-xr-tools/hands/collision_hand.gd` [read]. Licence: MIT ("Copyright (c) 2018-2023 Bastiaan Olij and
Contributors", LICENSE:1-3). **Idea used; commercial use allowed; keep the notice if code is copied.**
- The hand is its own body that chases its target each physics step: `move_and_slide(target_movement)` (:328), so it
  stops on a wall and slides along it instead of passing through.
- "Hand teleports to controller" when further than `TELEPORT_DISTANCE := 1.0` m (:42-43, :283-287).
  [2nd reader: DOWNGRADED. The quoted words are the doc of the `TELEPORT` mode at :21, not of the distance rule. The 1.0 m is a
  gap between a tracked VR controller and its physics hand; the kid has no controller, so there the number is [ours].]
- ~~It starts to turn onto the surface after `ORIENT_DISPLACEMENT := 0.05` m of displacement (:39-40).~~
  [2nd reader: WRONG. `ORIENT_DISPLACEMENT` is defined at `collision_hand.gd:40` and used nowhere in that file (one grep hit)
  nor in the other six `.gd` files of `addons/godot-xr-tools/hands/` at 6c6189b. The source has a comment and a dead constant.]
- [inferred] That is item 159's "you see their arms and hands touch up against it as you move", and it needs no ragdoll:
  a swept hand point against the sim's read-only `Physics::ray` (`sim/physics.h:98`, returns point and normal).

**S5. Head and gaze during locomotion** (PubMed abstracts via E-utilities; full texts are Springer and APS, paywalled,
so what follows is [summary] from the abstracts I read). Facts only; nothing to licence.
- Pozzo, Berthoz, Lefort 1990, Exp Brain Res 82:97 (PMID 2257917): head vertical translation 1-25 cm across walking,
  running in place and hopping; head pitch "did not exceed 20 degrees"; "Residual head angular displacement is found to
  compensate for head translation"; dominant frequencies 0.4-3.5 Hz.
- Hirasaki et al. 1999, Exp Brain Res 127:117 (PMID 10442403): above 1.2 m/s head pitch is "compensatory for vertical
  head translation", pointing the head "at a fixed point in front of the subject"; head motion at 1.4-2.5 Hz.
- Moore et al. 1999, Exp Brain Res 129:347 (PMID 10591907): that fixed point is about 1 m ahead (the head fixation
  distance); for a far target the eye's own reflex counters the head pitch.
- Crane & Demer 1997, J Neurophysiol 78:2129 (PMID 9325380): while walking and running, image velocity on the retina
  stayed under 4 degrees/s for a target beyond 4 m; orbital translation is "antiphase with rotation".
- [2nd reader: DOWNGRADED. The abstracts are treadmill walking at 0.6-2.2 m/s (Hirasaki), five subjects at 1.67 m/s with targets
  0.25-2.0 m (Moore), running and hopping IN PLACE (Pozzo), treadmill running at an unstated speed (Crane). None is a sprint at
  10 m/s; none shows the image does not nod, only that head pitch partly cancels head rise.]
- [inferred] The camera stands for the GAZE, not the head. A runner's world does not nod: the head translates, and the
  head and eyes rotate to hold the target. Translation in the camera is real; rotation the hand did not ask for is not.

**S6. Sickness by frequency and by control** (abstracts and one author's copy).
- Diels & Howarth 2013, Human Factors 55:595 (PMID 23829033) [summary, abstract]: visually induced sickness from
  fore-aft oscillation "peaked between 0.2 and 0.4 Hz"; "frequencies around 0.2 to 0.4 Hz should be avoided".
- Golding, Mueller, Gresty 2001, Aviat Space Environ Med 72:188 (PMID 11277284) [summary, abstract]: real motion sickness
  maximal at 0.2 Hz (12 of 12 nauseated at 0.2 Hz against 8 at 0.1 and 7 at 0.4).
- Guo et al. 2013, "Visually induced motion sickness during computer game playing" (Contemporary Ergonomics and Human
  Factors 2013; the authors' copy, https://www.ieda.ust.hk/dfaculty/so/pdf/Guo-et-al-2013-EHF2013.pdf, abstract
  section) [read]: nausea "during passive watching were significantly higher than active playing" and was "significantly
  suppressed by eye fixation". The game played was Mirror's Edge (text near its line 189 of my extraction). Rights: the
  publisher's; cited only.
- [inferred] The bob lives at the step rate, ~~2-5 Hz, far above the sickness band~~ [2nd reader: from
  `game/tests/camera_tests.cpp:403-409` the rise is twice a step and the sway once, at 1.9 steps/s walking to 3.54 sprinting:
  about 1.9-3.5 Hz up and down and 1-1.8 Hz sideways. Diels' 0.2-0.4 Hz band is for FORE-AFT random-dot flow, 24 people; the
  sway is 2.5-9 times above it, and neither roll nor vertical was tested there]. What sits in the band is slow drift:
  a long ease, a slow roll, an amplitude that breathes. And a clip of first-person motion, watched, is a harsher test
  than play: his eye should judge cadence and nod by playing, not on a page.

## (3) The design for the player's side

**The one switch.** Every humanoid goes through the same layers. Only the anchor and the driver differ. [ours]

| layer | hunter / any chaser | player | code today |
|---|---|---|---|
| L0 clock | phase per metre from `stride_step` (Alexander) | the same law from the kid's own hip height | hunter: `stage.cpp:269`; player: `camera.cpp:179-180` (first game's) |
| L1 limbs | curve angles + FK (`gait_pose`) | world targets + two-bone IK (`Body::pose`), crossover, backward | as is |
| L2 chain | driven from the pelvis: tilt, look target, twist, springs | driven from the HEAD: the view is the head, chest and hips follow | `kinetic_chain`, `model_rig.h:171-178` |
| L3 contact | feet on the floor probe; hands later (doorframes) | feet on the floor probe; hands swept onto walls (S4) | `FloorProbe`, `HandOverride` |
| L4 physics | soft-key upper body, catch reaction (L185) | keyed in first person; the catch and the flip only (K1, his 162) | E's clone only |
| L5 pin | feet on the ground | eye on the camera: translate the pose so Eye = picture eye, re-reach planted feet | `Rig::lock_eye` does it for the mesh, `model_rig.cpp:359-366` |
| L6 views | one mesh, all rays | one mesh; head group off primary rays, on shadow rays | `stage.cpp:658` |

**What must differ for a camera inside the head**, and nothing else does:
1. The root is the eye. The chain is solved from the head down, then pinned (L5). The feet keep their plants by IK.
2. The look is an input, not a target. The head takes all of it at once (it IS the view); the chest follows on the
   first game's trunk spring; the hips follow the travel within Valve's limits (the WIP's sources, section 1).
3. The view's rotation is the hand's alone (`camera.h:20-22`; S5, S6). The body reaches the eye only as translation:
   the stride's rise and sway, and the neck model when the head turns on the trunk (S3).
4. The head, neck and hood are off the primary rays and on the shadow rays (exists). No pose change is made for the
   eye alone that the shadow would betray: one pose serves the view, the shadow and any reflection.
5. Physics never moves the eye during play. In a flip or a catch the dependency reverses: the eye rides the head
   (his `movement-5`, `movement-11`; K1), blended in and out over the move.

**Inputs.** `sim::PlayerState` before and after (velocity, yaw, pitch, state); the rig's eye; `look_back`; the floor
probe; a hand probe (new, `Physics::ray`). **Outputs.** `BodyPose` (unchanged type); the picture eye offset (a
`Vec3`, generalising `glance_eye_offset`). Nothing goes back into the sim.

**Where it sits** [read: names from gc:41-53]: `Body::tick` / `Body::pose` (`game/body.cpp`), `glanced` (stays for V),
`CameraRig::tick` (`game/camera.cpp`) for L0 only, `WorldStage::place_figures` (`game/world/stage.cpp:299-316`) for
drawing, `Shell::view` for the picture eye offset.

**Parameters, few, with sourced defaults.**

| parameter | default | source |
|---|---|---|
| chest follow on a look | 0.13 s | first game `kTrunkFollowTime` (`model_rig.h:140`), used for yaw by the WIP; for yaw it is [ours] |
| hips within the eyes | 45 deg, 720 deg/s | Valve `multiplayer_animstate.cpp:1729-1739, :1755` per the WIP, study only |
| chest share of a held look | 0.4225 (spine 0.65, head 1) | ozz `sample_look_at.cc:466`, MIT, landed (`model_rig.h:293-295`). [2nd reader: UNSUPPORTED here: ozz's file was not opened by the scout (the line is the comment at `model_rig.h:293`); a look-at weight is not a lag law, and lap 1 never uses it] |
| neck pivot | 8.0 cm back, 7.5 cm down | Cardboard `neck_model.h:29-30`, Apache-2.0. Ours today: 9 cm back (`body.h`, `BodyBuild::neck_back`). Keep 9 for yaw (landed, measured) and add 7.5 down for pitch |
| step length | `stride_step(h, v)`, K 2.3, exp 0.3 | Alexander via Mazzetta & Blanco, landed (`model_rig.h:350-353`) |
| hand snap distance | 1.0 m | Godot XR Tools `collision_hand.gd:43`, MIT. [2nd reader: DOWNGRADED, a VR controller-to-hand gap; no source for a ray-swept hand: [ours]] |
| nod | 0 or gaze-hold (one flag) | Hirasaki 1999, Moore 1999, Crane & Demer 1997 (S5); the first game's free nod stays as the other value. [2nd reader: DOWNGRADED, walking-speed abstracts; the gaze-hold gain is [ours]] |

Two numbers I would NOT take from a source because none fits: the hand's stand-off from the wall (a hand radius,
about 4 cm, [ours]) and the chest lag's cap (50 degrees, the glance's own `0.87` rad, `body.cpp:153`, the first game's).

**Cost per character per frame** [inferred; nothing timed, R4.7 never run]. The game ticks at 240 Hz and draws at
300-360, so a per-tick cost is paid about 0.67-0.8 times a frame.
- Look chain and pin: one spring, one clamp, about 17 joints turned (~4 trig each) and two leg re-reaches: about 1-2 us.
- Neck model: one rotation: under 1 us.
- Hand sweep: up to two rays a tick into the sim's Jolt world: a few us each in a building, not measured.
- Stride law: one `pow` a tick.
- Skinning and refit of the kid: already paid, part of +0.39 ms average for both models (gk:24-27) [summary].
- So the player's side adds well under 0.02 ms of CPU and nothing on the GPU, against the 3.33 ms frame.
- A second, shadow-only kid (Unreal's split, S1) would cost a second skin and refit, roughly half of that 0.39 ms
  [inferred]. Not proposed.

**One layer, three bodies** [ours]:
- The hunter keeps the feet anchor and its DrawnChaser driver; it gains nothing from this file except a shared clock
  and, later, swept hands for doorframes.
- A lesser chaser, once it has a model, takes the hunter's path; its one cue edits one layer. The interceptor's T2 (a
  bird's head held in space, gl:156) is the gaze-hold of S5 at full gain: the same function the player's nod flag uses,
  with the human's partial hold (Pozzo: residual rotation compensates translation) at one end and the bird's full hold
  at the other [inferred].
- The player takes the eye anchor and the head driver.

## (4) The first lap

**Land the head-first look, alone** (L188 step 3, his 163; the look part of `origin/l188-wip-look` a60944d).
- Take from the WIP only `chest_yaw_` / `hips_yaw_` and their use in `Body::pose`: the chest (with shoulders and arms)
  follows the view on the trunk spring; the hips keep within 45 degrees of the view, turn toward the travel when moving,
  face the view going backwards. Leave out the WIP's double-spring move blend and slide-leg staging, which turned two
  landed rows red there.
- Change from the WIP: cap the chest's lag at 50 degrees (a 1000 deg/s flick on a 0.13 s spring lags about 130 degrees,
  which would swing a shoulder into the view [inferred]); and keep the spring per tick in `Body::tick`, not per frame.
- Files: `game/body.cpp`, `game/body.h`, `game/tests/body_tests.cpp`, `CHANGELOG.md`. The camera and the sim are not
  touched.
- The row (~~the WIP's, by name~~ [2nd reader: the name only. The WIP's row, `body_tests.cpp:529-551` on a60944d, is STANDING, one 90 degree
  turn in one tick, chest's 90% point more than 12 ticks after the head, hips within 45 degrees; no jog, no "3 ticks", no 50
  degree bound. The row below is a new one under the old name]): `on_a_sideways_look_the_head_turns_first_then_the_chest_then_the_hips`. On a scripted
  quick turn of the view while jogging, the yaw rates peak in the order head, chest, hips, the chest at least 3 ticks
  after the head, and the chest never more than 50 degrees off the view. **Red on 31d1c6d by construction**: one yaw
  drives all three (`body.cpp:225-230`), so the three peaks fall on the same tick. Green after.
- Kept green, by name: `the_camera_moves_exactly_as_it_did_without_a_body_over_the_whole_gym_run`,
  `at_the_full_glance_the_neck_the_chest_and_the_shoulders_are_out_of_the_picture`,
  `going_from_one_move_to_the_next_no_joint_jumps`, `strafing_at_a_jog_the_trailing_foot_crosses_over_and_never_through_the_other`
  (the crossover's frame becomes the hips' frame: check it), and his 16 kept runs byte-identical.
- Tier: "check it" (visible, picture only). His recorded case: the gym run the body rows already use; then one
  first-person burst on one of his kept runs at full frame rate and lit (brief:1606).

**The laps after it, in order** [ours]:
2. Move the player onto `kinetic_chain` with the eye pin (L5). Row: lap 1's pose to within 1 mm, then the run's pelvis
   and thorax counter-twist switched on (Perpiña-Martínez, Ford, landed): the arms ride the twist as the hunter's do.
3. The lean: the player's home-made `3 + 9 x pace` degrees (`body.cpp:338`) replaced by DrawnChaser's sourced tilt.
4. The neck model for pitch (S3): looking down, the eye moves about the pivot. Row: the L174 capture measure, standing
   at 60 degrees down, collar coverage falls and the toes come into the picture.
5. Swept hands (S4) through `HandOverride`: L184 row 3 (the hand within 5 cm of the wall in half the in-reach ticks).
6. The stride clock from Alexander, behind a flag (his eye; section 5).

## (5) What only his eye can decide, and the fewest clips

1. **How far and how slowly the chest follows a look.** One clip: a 90 degree flick while jogging, looking 45 degrees
   down, at full frame rate, main 31d1c6d beside lap 1 (the "before" is today's main, nothing older, brief:1606).
2. **The hips toward the travel when strafing.** The same clip, a strafe, from 3 m behind and from the eye.
3. **The cadence.** Not a clip: a `gym.txt` flag he plays both ways. The first game's 3.54 steps/s at 10 m/s against
   Alexander's 4.39 from a 0.98 m hip (my arithmetic with `stride_step`), the sprinters' measured 4.35-4.85 (gl:306-307).
   The first game's rate was set by play and the footstep sounds keep their own clock (`CHANGELOG.md:475-477`) [read];
   the passive clip would mislead (Guo 2013).
4. **The nod.** Not a clip: a flag, the first game's free nod against the gaze-hold (S5). Played, not watched.
Two clips, two toggles.

## (6) What I would NOT build, and why

- **Unreal's first-person FOV and scale** (S1): it shrinks the body toward the eye and drops it from the ray-traced
  world; every pixel here is traced, so the body would vanish from shadows and reflections.
- **A second, shadow-only body** (Unreal's World Space Representation, Rust's copy): our ray masks already give one mesh
  both jobs; a second skin costs GPU time for no visible gain unless a view-only tuck is ever needed.
- **Hiding by bone scale** (S2): the head would leave the shadow.
- **A tuck that only the eye sees** beyond a few centimetres (the shoulder sliver's dials included): the shadow would
  show it. If he wants the sliver, raise the chest in the one pose.
- **The camera parented to the head during play**: Mirror's Edge called it "not very good" (gp:161) [summary]; S5 says
  the head nods and the gaze does not. Kept for the flip and the catch only, as K1.
- **Physics on the player's legs or on the controls** (K3/K4): his 162 put K3 off by default, and DReCon's reversal is
  about 1.5 s (gp:161) [summary].
- **A look lock** like Enhanced Camera's 65 degree vehicle limit (S2): he wants the look-back.
- **New knobs for each move.** The layers above add ~~four parameters, all sourced but two~~ [2nd reader: UNSUPPORTED count. The table lists seven. Sourced from
  outside and fitting: step length (landed). Not fitting or unopened: the pivot (VR default, conflicts with the game's 13 cm),
  chest share (unused in lap 1), hips limits (Valve via the WIP, not opened). [ours] though unmarked: chest follow on yaw (marked in
  the table), hand snap, nod gain, the "3 ticks" in the row].

## What I did not open

- Unreal's engine code, its forum threads, and the docs pages for each first-person console variable.
- Garry's Mod's Gmod Legs 3 and Immersive First-Person (Workshop only); the Enhanced Camera server file.
- The full texts of Pozzo 1990, Hirasaki 1999, Moore 1999, Crane & Demer 1997, Diels & Howarth 2013, Golding 2001
  (paywalled; abstracts only). Guo 2013 beyond its abstract and the lines I grepped.
- Any field-of-view sickness study (his FOV is decided; not re-opened). Any source on cervical rotation range: the 50
  degree cap is the first game's glance, not anatomy.
- Mirror's Edge's slides, Rust's devblog, Star Citizen: known only through H184 and H186 [summary].
- In dreamzone-3: `game/shell.cpp`, `sim/world.cpp`, `Physics::ray`'s body, the WIP's full `body.cpp` diff beyond the
  hips and chest lines, `offscreen_fpbody.cpp`, every test body except `camera_tests.cpp:396-410`.
- E's clone with the soft-key layer; every capture and clip folder; `p-l188` beyond its first 40 lines.

## Second reader

Adversarial second reader, 2026-11-13. Line numbers in the table are the scout's ORIGINAL lines (before my in-place edits).
Primaries opened: the brief, dreamzone-3 main 31d1c6d and `origin/l188-wip-look` a60944d (by `git show`), the ground files, and
by curl: the Unreal page, the Enhanced Camera README and Lua at 00ee1ef (its GitHub licence field is null, and its file tree has no
LICENSE), Cardboard `neck_model.cc/.h` and LICENSE at 8bd424d, Godot XR Tools `collision_hand.gd`, its LICENSE and the other six
`hands/*.gd` at 6c6189b, six PubMed abstracts through E-utilities, and Guo 2013 as a PDF (text extracted). Nothing was run or built.

| # | line | claim | primary opened | verdict | evidence |
|---|---|---|---|---|---|
| 1 | 23-30 | his items 147, 156, 159, 163, 82, movement-5, -11 quoted | brief :1087, :1114, :1120, :1128, :679, :1297, :1308 | OK | wording matches |
| 2 | 30 | 162 and 173 are the brief's record, not his words | brief :1127, :1175 | OK | "his pick after L186" |
| 3 | 32 | body hangs from the eye, body.cpp:243-246 | body.cpp:242-246 | OK | comment is at :242, one line up |
| 4 | 35 | one yaw drives pelvis, chest, head, body.cpp:225-230 | body.cpp:225-230 | OK | forward, right, chest_right from player.yaw |
| 5 | 38 | look-back eye 17.7 cm back, body.cpp:145-165 | body.cpp:145-169, body.h:153-158 | OK | "17.7 cm back and 2.2 cm" |
| 6 | 38 | glance_eye_offset at body.h:164-171 | body.h | WRONG | it is body.h:153-159; :164-171 is `glanced` |
| 7 | 41 | head hidden by weight and mesh name, stage.cpp:474-483, :561-567 | stage.cpp | OK | comment and `kFirstPersonHidden` code |
| 8 | 41 | primary rays leave head group out, shadows keep it, :658 | stage.cpp:658, :482-483 | OK | `primaryMask = ... & ~kHeadRayGroup`, only if kid_.on |
| 9 | 43 | torch lights leave body out, beam.cpp:41, :61 | beam.cpp | OK | `shadow_mask = 0xFF & ~(Body|Head)` |
| 10 | 44 | HandOverride exists, body.h:93-118 | body.h:93-118 | OK | struct and `set_hand_overrides` |
| 11 | 45 | camera effects listed, camera.h:15-22, settings.h:13-15 | both | OK | bob, sway, tip, nod, leans; aim unmoved |
| 12 | 47 | stride law at camera.cpp:179-180 | camera.cpp | WRONG | it is :177; :179-180 are `striding`, `amp_target` |
| 13 | 47-48 | stride_rate 1.12; 3.54 steps/s row at camera_tests:403 | settings.h:52; tests:403 | OK | "1.12 x sqrt(10) = 3.54" |
| 14 | 49 | kinetic_chain "player's body next", model_rig.h:173 | model_rig.h:171-178 | OK | comment text matches |
| 15 | 53-57 | WIP a60944d: message, chest on spring, row, two rows red | git show a60944d | OK | "Two rows still red here"; not an ancestor of main |
| 16 | 55-56 | Valve :1729-1739, :1755; first game :6597-6598 | WIP body.cpp comments only | DOWNGRADED | neither source opened by scout or me |
| 17 | 60 | sickness rule settings.h:8-11 | settings.h:8-11 | OK | quote exact |
| 18 | 62 | Titanfall "constantly looking left and right" at docs :27 | docs/research/03...:27 | OK | line carries it |
| 19 | 71-79 | Unreal first-person page quotes and section names | ue.html text | OK | all five quotes found; sections exist |
| 20 | 70 | Unreal docs: "no open licence stated" | page only | DOWNGRADED | no Epic terms page read; harmless, idea only |
| 21 | 87, 93 | Enhanced Camera README :15, :29 quotes | README | OK | lines match |
| 22 | 93 | 65-degree lock quote at README :48-49 | README :46, :49 | DOWNGRADED | words at :46, number :49; vehicles only |
| 23 | 89-92 | Lua :221 yaw only, :224 offset, :337 (-10,0,-5), :446 neck, :302-303 | ec.lua | OK | all as cited |
| 24 | 85 | Enhanced Camera has no licence | API license null; tree | OK | no LICENSE file in tree |
| 25 | 99-101 | Cardboard Apache-2.0; LICENSE excepts third_party/unity | neck_model.cc:1-15; LICENSE :1-47 | OK | Unity licence only for that folder |
| 26 | 102-106 | neck pivot comments and -0.080, 0.075 | neck_model.cc:36-41; .h:29-30 | OK | "applying a neck model should not elevate" |
| 27 | 107 | 60 deg down: eye 10.7 cm down, 2.5 forward | arithmetic; body.h:74-75 | DOWNGRADED | true on Cardboard's pivot; game's is 0.13/0.09: 14.3 down, 6.8 fwd |
| 28 | 110-111 | Godot XR Tools MIT | LICENSE:1-3 | OK | "Copyright (c) 2018-2023 Bastiaan Olij" |
| 29 | 112 | hand chases target by move_and_slide :328 | collision_hand.gd:328 | OK | line is the call |
| 30 | 114 | teleport quote and 1.0 m, :42-43, :283-287 | collision_hand.gd:21, :43, :283 | DOWNGRADED | quote is the TELEPORT mode doc at :21; VR controller gap |
| 31 | 115 | turns onto surface after 0.05 m, :39-40 | collision_hand.gd + 6 sibling files | WRONG | constant defined, referenced nowhere |
| 32 | 122-123 | Pozzo 1990: 1-25 cm, 20 deg, 0.4-3.5 Hz | PMID 2257917 abstract | OK | all three in abstract; in place, 10 people |
| 33 | 124-125 | Hirasaki 1999: >1.2 m/s compensatory, 1.4-2.5 Hz | PMID 10442403 | OK | treadmill 0.6-2.2 m/s |
| 34 | 126-127 | Moore 1999: fixation point about 1 m | PMID 10591907 | OK | 5 subjects, 1.67 m/s, targets to 2 m |
| 35 | 128-129 | Crane 1997: under 4 deg/s beyond 4 m, antiphase | PMID 9325380 | OK | "<4 degrees/s ... beyond 4 m" |
| 36 | 130-131 | the camera stands for gaze; a runner's world does not nod | the four abstracts | DOWNGRADED | no sprint source; walking or in-place |
| 37 | 135-136 | Diels 2013: peak 0.2-0.4 Hz, avoid | PMID 23829033 | OK | 24 people, fore-aft dots |
| 38 | 136-137 | Golding 2001: 12/12 at 0.2 Hz vs 8 and 7 | PMID 11277284 | OK | 12 selected as highly susceptible |
| 39 | 138-142 | Guo 2013: passive > active, fixation suppresses | guo.pdf abstract, :184-198 | DOWNGRADED | "Preliminary", 12 participants, fixation in passive only |
| 40 | 143 | bob at 2-5 Hz | camera_tests.cpp:403-409 | WRONG | rise 1.9-3.5 Hz, sway 1-1.8 Hz |
| 41 | 186 | chest share 0.4225, ozz sample_look_at.cc:466 | model_rig.h:293-295 only | UNSUPPORTED | ozz file not opened; weight is not a lag |
| 42 | 187 | neck pivot 8.0/7.5, keep 9, add 7.5 down | body.h:74-75; Cardboard | DOWNGRADED | game pivot 13 down, 9 back |
| 43 | 188 | step length K 2.3, exp 0.3 | model_rig.h:350-353; .cpp:695-699 | OK | `0.5 * K * h * Fr^0.3` |
| 44 | 189 | hand snap 1.0 m from Godot | collision_hand.gd:43 | DOWNGRADED | not for a swept ray hand |
| 45 | 201 | +0.39 ms for both models | ground_constraints:24-27 | OK | as stated; scout marks it [summary] |
| 46 | 252-253 | 3.54 vs 4.39 steps/s at 10 m/s, hip 0.98 | stride_step; body.h proportions | OK | 1.12 x sqrt(10) = 3.54; the formula gives 4.39; 0.46+0.45+0.07 = 0.98 |
| 47 | 253 | sprinters' measured 4.35-4.85 | ground_locomotion (SR:216-220) | DOWNGRADED | 4.35 is steady running, 4.6-4.85 sprinting |
| 48 | 226 | row is "the WIP's, by name" | WIP body_tests.cpp:529-551 | DOWNGRADED | same name, different test (standing, 12 ticks) |
| 49 | 230-233 | four kept-green rows exist | game/tests/body_tests.cpp | OK | all four names found |
| 50 | 272 | four parameters added, all sourced but two | the table at 182-190 | UNSUPPORTED | seven rows; several [ours] |
| 51 | 9 (summary 3) | the view only rotates by the hand | shell.cpp:188; camera.h:12, :15-22 | WRONG | nod, roll, tip exist and were asked for |
| 52 | 234 | his 16 kept runs byte-identical | ground_constraints:51 | OK | "identical 16, differ 0" |
| 53 | 267 | Mirror's Edge parenting "not very good" | ground_physics:160 | OK | H186:38 as recorded; second-hand |

**Tally (53 checked): OK 35, WRONG 5 (#6, #12, #31, #40, #51), DOWNGRADED 11, UNSUPPORTED 2 (#41, #50).**
**RE-DERIVED: 0.** Everything in section (2) is absent from the ground files (grep for Unreal, Cardboard, Godot, Pozzo, Hirasaki,
Moore, Crane, Diels, Golding, Guo, Enhanced Camera: no hit). Section (1) and the "already in the room" notes in S2, S3 and S4 are
labelled by the scout as what the room holds; none is passed off as new.

**Licences.** Cardboard: Apache-2.0 text read in the repo LICENSE; the scout's reading is right; Apache also asks that a NOTICE and
a statement of changes travel with copied code, which the scout leaves out (the "idea and two numbers" use needs neither).
Godot XR Tools: MIT text read, right. Enhanced Camera: no licence, idea only, right. Unreal: terms not read, idea only, right.

**The simplest way to build the first lap and pass its row without doing what it is for.** The row measures three yaw series, the
first of which is the sim's own yaw (the view), not a body joint. A spring on `chest_yaw_` plus a rate-limited copy for the hips
passes it, with a lag of 3 ticks (the scout's own number) and the 50 degree bound met by any small lag, while the shoulders, arms
and hands in the drawn palette still ride the view, or ride a chest the mesh ignores. Nothing in it renders a frame or measures a
shoulder against the picture. The row would be green with the thing that matters, a turn that looks like a body bending (his 163)
and a look-back that does not clip (his 147), unchanged; only `at_the_full_glance...` and his eye guard those.

**Mechanisms with no source and no [ours] mark.** The "3 ticks" in the row; the neck pivot of 7.5 cm beside the game's 13 cm; the
1.0 m hand snap for a ray-swept hand; the gaze-hold gain between the human's partial and the bird's full hold (marked [inferred],
but a mechanism); the chest-lag cap of 50 degrees is described as the glance's, which is a held end pose, not a lag limit.
"Re-reach planted feet" after the eye pin (L5) sits under the table's [ours].

**What I could not check.** Valve `multiplayer_animstate.cpp` and the first game's `dreamzone-rt/src/main.cpp` (the WIP only
quotes their line numbers); ozz `sample_look_at.cc:466`; the Apache text beyond its header; Epic's terms for the docs; the ground
files' own line numbers beyond a spot check (gp:107-112, :210-211, gc:102, gl:156, gl:306-307 not each re-opened); any cost
figure (none exists, as the scout says); whether the first-lap row is red on main (not run, rule 1; by reading `body.cpp:225-230`
it should be); the full texts of the five papers (paywalled).

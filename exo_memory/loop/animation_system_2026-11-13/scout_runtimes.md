# Scout: animation runtimes in the open (ozz-animation, Godot, Bevy) against this game's pose code (2026-11-13)

1. Adopt NO outside runtime as code. His item 150 says learn, not use; there are no clips to sample; 22 joints gain
   nothing from ozz's 4-wide SoA; and the game has the pieces (a parents-first rotation tree, local-to-palette).
2. Take three ideas: a pose is LOCAL rotations down a parent chain (all three runtimes); a hinge joint turns about ONE
   axis (ozz's two-bone `mid_axis`); and a stack of layers, each with an influence and a joint mask, applied to a copy.
3. Layout: one `SkelDef` per body kind (<= 32 joints, parents first, rest offsets, hinge axes, group masks, hip height)
   and a `LocalPose` per figure (root + one quaternion a joint: 364 B for 22 joints). Estimated 2-5 us a figure a frame.
4. First lap: the drawn elbow (and knee) bends about one hinge. Today Rig swings each arm bone on its own from the chest's
   frame, so the two halves of the elbow disagree. A sketch on hunter.glb's rest gives 5-46 degrees. Bar: 1 degree.
5. Not built: clip sampling, compression, graphs, blend spaces, ozz as a dependency, Godot's hard angular-speed cap.

Marks: [read] I opened it (path:line; outside code by URL, tag and file:line); [summary] a ground file or another
account; [inferred] mine; [ours] a proposal. Game code: dreamzone-3 `main` 31d1c6d, unless a branch is named. Ground
files are cited by short name: `G-code`, `G-cons`, `G-src`, `G-phys`, `G-loco`, `G-words` (this folder, `ground_*.md`).
Outside code was downloaded with curl and read as text. Nothing was built or run except two small node scripts, named
in section 3.6. Neither runs the game.

## 1. What the room already has for this aspect

- Runtimes read before: ozz (look spread landed, `soften` not taken) [summary] G-src:51-63; Godot's blend space read,
  "fits only once clips exist", nothing taken [summary] G-src:84-87; O3DE licence only [summary] G-src:89-91.
- Clips are out by his pick (`plan_l180:67`) [summary] G-src:187. No GLB holds a clip, and the loader ignores clips
  [summary] G-cons:62-69. His word on outside animation [read] `briefs/dreamzone2_the_game.md:1102-1103`, item 150:
  "research open source alternatives, not to use, but to learn from".
- The pose type: `BodyPose` = 21 world-space joint POSITIONS + right/up/forward/chest_right/head_right + trunk_lean
  [read] `game/body.h:55-68`. That is 316 B [inferred, 26 Vec3 of 12 B + 1 float]. Two producers write it, Body::pose
  (player, per tick) and gait_pose (hunter, per frame) [summary] G-code:4-6, :57-68.
- The retarget: `Rig::palette` aims each of 18 MPFB bones from one game joint to another, with ONE of four region frames
  as the roll (lower/upper/spine/head). Twist about a limb's own length: none [summary] G-code:73-93.
- A rotation tree already exists: `skeleton.h`, 22 joints (the 21 + a lower spine), parents-first order, `to_rotations`,
  `to_positions`, `to_world` [read] `game/skeleton.h:6-12, :61, :64-86`. It feeds only the ragdoll, which nothing draws
  on main [summary] G-code:197-199; G-phys:3, :65-71.
- Per-id drawn state for every chaser each tick: `DrawnChaser` in `WorldApp::ease_` [read]
  `game/world/world_app.h:265-269`. But only the FIRST hunter gets a model; every other figure is a box [summary]
  G-code:38-39, :210-226.
- The hunter's stride clock is advanced by the FRAME's delta in the stage, so it is not a function of the tick [summary]
  G-code:34-36; [read] `game/world/stage.cpp:269`.
- Models: MPFB `game_engine`, 53 joints (kid 54), no twist bones, four influences a vertex [summary] G-cons:62-67.
- Cost: no per-character per-frame time is measured anywhere in the record [summary] G-phys:257-265; G-loco:313-316.
  The GPU side of two models is +0.39 ms average [summary] G-cons:24-27.
- Not in any ground file, read by me: `model::palette_from_local` already composes local transforms parents-first into a
  palette, the job ozz calls LocalToModel [read] `model/model.h:92-95`, `model/model.cpp:534-541`. It is used only by
  `model/tests/model_tests.cpp:213, :228` [read, `git grep`].

## 2. What I read at source that is NEW

### 2.1 ozz-animation, tag 0.17.0 (github.com/guillaumeblanc/ozz-animation)

Licence [read] `LICENSE.md:1-2, :6-16`: MIT, "Copyright (c) 2020 Guillaume Blanc". Commercial use allowed. Attribution:
the notice must ship with "copies or substantial portions" (:15-16). No share-alike. Redistribution allowed. I propose to
use NONE of its code (section 6); every line below is "use the idea".

- Skeleton: rest poses in LOCAL space, SoA, plus int16 parent indices "stored in depth-first order"
  [read] `include/ozz/animation/runtime/skeleton.h:51-60, :136-143`. ~~The 1024-joint cap exists so arrays can sit on the
  stack (:66-71) [read].~~ [2nd reader: DOWNGRADED. `skeleton.h:66-71` gives two reasons: the cap controls "the number of
  bits required to store a joint index", and it "also helps" with stack arrays. The first reason, the index width, is left
  out; the scout's 32-cap (sections 3.2, 3.4) borrows only the second. Depth-first is also stricter than the game's
  "parents first" (`skeleton.h:61`); the two are not the same order.]
- SoaTransform: translation, rotation and scale, each 4 joints wide [read] `include/ozz/base/maths/soa_transform.h:40-44`.
- LocalToModel: one forward loop over the parents-first array. It can update only a subtree (`from`, `to`,
  `from_excluded`) [read] `local_to_model_job.h:81-107`; `src/animation/runtime/local_to_model_job.cc:79-99`.
  [inferred] The subtree update fits "fix one arm after an IK correction" without rebuilding the body.
- BlendingJob: layers with a weight and optional PER-JOINT weights; additive layers apply on top; under a total weight of
  `threshold = .1f` the rest pose fills in [read] `blending_job.h:76-101, :104-107, :113-115`. Rotations are summed as
  quaternions with a sign fix toward the running sum ("shortest path"), then normalised once at the end [read]
  `src/animation/runtime/blending_job.cc:100-113, :334-354`. The additive pass lerps from identity by the weight
  (:116-134) [read].
- Its normalise is an ESTIMATE: `NormalizeEst` uses `RSqrtEstNR` [read] `include/ozz/base/maths/soa_quaternion.h:96-100`,
  which starts from `_mm_rsqrt_ps` [read] `include/ozz/base/maths/internal/simd_math_sse-inl.h:543-546`. [inferred]
  That hardware estimate is not specified bit for bit across processors, so two machines may draw different bits. This is
  allowed for a picture, but it is one more reason not to link it. [2nd reader: the code half is OK (`RSqrtEstNR` at
`simd_math_sse-inl.h:545-550` starts from `_mm_rsqrt_ps` and adds one Newton step). The "not specified bit for bit across
processors" half is DOWNGRADED: no Intel or AMD text was opened, and the scout itself says the picture does not care.]
- IKTwoBoneJob: the middle joint turns about ONE axis, `mid_axis`, "in middle joint local-space", and "usually fixed for
  a given skeleton"; a pole vector sets the plane; `soften`; a `weight` 0..1; the output is local CORRECTIONS to multiply
  onto the start and middle joints [read] `ik_two_bone_job.h:43-53, :72-78, :80-85, :91-100, :111-116`.
- IKAimJob: a joint's forward AND up axes (with a pole) fix its whole rotation, not only its direction [read]
  `ik_aim_job.h:43-50, :69-85`. [inferred] A swing fixes only the direction; the roll is whatever the swing leaves.
- SamplingJob: clips sampled by a time ratio, with a context for frame coherence [read] `sampling_job.h:47-55, :68-73`.
  Not needed here (no clips).
- Runtime needs only C++17 and the standard library [read] `README.md:23`.

### 2.2 Godot, tag 4.7.2-stable (github.com/godotengine/godot)

Licence [read] `LICENSE.txt:1-12`: MIT, "Godot Engine contributors". Same terms as above. I propose to use none of its
code.

- A bone stores its rest and its LOCAL pose as position, quaternion and scale; the global pose is derived [read]
  `scene/3d/skeleton_3d.h:99-118`.
- THE MODIFIER STACK (new since the room's L176 read of the blend space). Each `SkeletonModifier3D` has `active` and
  `influence = 1.0` [read] `scene/3d/skeleton_modifier_3d.h:89-90, :122-126`. Modifiers run in order. Below influence 1
  the bone's pose is interpolated from before to after the modifier [read] `scene/3d/skeleton_3d.cpp:1192-1210`.
- AND THE COPY: before the modifiers run, every bone's unmodified pose is saved; the skins are written from the modified
  pose; then the unmodified pose is restored [read] `skeleton_3d.cpp:327-341, :402-406, :409-416`. [inferred] So a
  modifier can never feed back into the source pose next update. That is this game's "picture only" rule, built into the
  pipeline's shape rather than kept by care.
- The clock is a choice: modifiers process on PHYSICS, IDLE or MANUAL [read] `skeleton_3d.h:79-83`.
- `LimitAngularVelocityModifier3D`: caps each bone's turn per frame by slerp, default `max_angular_velocity = TAU`
  [read] `limit_angular_velocity_modifier_3d.h:53`; `.cpp:420-429`. A hard rate cap (see section 6).
- `LookAtModifier3D`: a duration with a tween transition, and angle LIMITS that soften past a damp threshold [read]
  `look_at_modifier_3d.h:68-87`. The soft limit maps the angle through a quadratic B-spline past the threshold instead of
  clamping [read] `look_at_modifier_3d.cpp:679-702`.
- `TwoBoneIK3D` solves the middle joint's roll from the plane of root, end and pole [read] `two_bone_ik_3d.h:181-211`.
- `SpringBoneSimulator3D` defaults: radius 0.02, stiffness 1.0, drag 0.4, gravity 0 [read]
  `spring_bone_simulator_3d.h:131-138`.
- The humanoid profile has 56 bones, root "Root", scale base "Hips" [read] `scene/resources/skeleton_profile.cpp:479-480,
  :489`. [inferred] The same idea as Alexander's law scaling by hip height in `gait_phase_per_metre`.
- Clip blending is relative to rest: `from * slerp(identity, rest^-1 * to, w)` [read]
  `scene/resources/animation.cpp:5688-5694`, called at `scene/animation/animation_mixer.cpp:1508`. A `deterministic`
  flag turns off weight normalisation [read] `animation_mixer.cpp:495-501, :1270-1276`.

### 2.3 Bevy, tag v0.20.1 (github.com/bevyengine/bevy), crate bevy_animation: my third, chosen for its masks and names

Licence [read] `README.md:106-109`: "dual-licensed under either" MIT (`LICENSE-MIT:1-19`, read whole) or Apache-2.0
(`LICENSE-APACHE`, read only its title and clause 4 headings at :89-106). Under MIT the terms are as above. Under Apache
the notice and any NOTICE file must ship with redistribution (clause 4). Commercial use allowed; no share-alike. I propose
to use none of its code.

- Graph nodes are Clip, Blend (children's weights normalised to 1) and Add (not normalised; each child is weighted and
  added in turn) [read] `crates/bevy_animation/src/graph.rs:214-238`.
- MASKS: each target (bone) has a 64-bit group mask. A node's mask lists the groups that it and its children may NOT
  animate [read] `graph.rs:122-131, :179-185, :484-490`.
- Targets are named by the full bone PATH, so "any animation is playable on any armature as long as the bone names
  match" [read] `crates/bevy_animation/src/lib.rs:167-180`. [inferred] The game's `JointMap` by MPFB name is the same idea.

## 3. The design for this aspect

### 3.1 The answer to the question: adopt as code, as idea, or not at all

| part of a runtime | verdict | why |
|---|---|---|
| clip sampling, compression, clip format | not at all | no clips (G-src:187); his item 150 |
| animation graph / state machine / blend space | not at all | each needs clips. Body::pose already blends 9 moves by weight [summary] G-code:47 |
| SoA 4-wide layout, SIMD maths | not at all | 22 joints x at most ~10 figures; ozz's own gain is many joints and layers [inferred] |
| ozz or Godot linked as a library | not at all | item 150; a second maths library beside `core/math.h` and `skeleton.h`'s quaternion [inferred] |
| skeleton as parents-first array + LOCAL rest | idea, ALREADY HAVE | `skeleton.h:61, :64-75`; `model::palette_from_local` |
| local-to-model, subtree update | idea | the `from`/`to` range of ozz, for an IK fix on one limb |
| a hinge turns about ONE local axis | idea, FIRST LAP | ozz `mid_axis`; ~~Godot TwoBoneIK3D's plane solve~~ [2nd reader: WRONG source. `two_bone_ik_3d.h:181-211` rolls the chain so a pole direction lies in the plane; it holds no hinge axis (grep "hinge" in that file: 0). Also RE-DERIVED in part: the room's player body already bends "knees/elbows ... as hinges about the body's right", `ground_physics_and_fp_body.md:106`; here that is a positional IK, not a drawn bone frame] |
| layers with influence, applied to a copy | idea | Godot's modifier stack and its save/restore |
| per-joint masks by group | idea | Bevy's u64 masks; ozz's per-joint weights |
| IK output as a weighted local correction | idea, later | ozz IKTwoBone/IKAim; for the hand on a wall (item 159) [2nd reader: RE-DERIVED. `ground_physics_and_fp_body.md:132` already lists "ozz two-bone IK `ik_two_bone_job.h:93-96`" as ground for the L184 wall hand; this row and :71-72, :181 do not say so] |
| soft joint limit by a spline past a threshold | idea, held | Godot LookAt; only if his eye wants a limit (no hard clamp: G-src:229-232) |
| hard angular-speed cap | not at all | the room removed its hard caps (G-src:81-82, :229-232) |
| spring bones (hood, hair) | not now | his item 111 defers hair [summary] G-words:241-243 |

### 3.2 The layout [ours, from the shapes above]

```
struct SkelDef {                 // one per body kind, built once at load from the model's skin + its joint map
  uint8_t  count;                // <= 32 (ozz's cap exists to keep arrays on the stack: skeleton.h:66-71)
  int8_t   parent[32];           // parents first (ozz skeleton.h:57-60; game skeleton.h:61 parents_first)
  Vec3     rest_offset[32];      // from the parent, rest pose, game axes (game SkeletonRest::offset)
  Quat     rest_frame[32];
  int8_t   hinge[32];            // -1, or the joint turns about one local axis (elbow, knee; ozz mid_axis)
  uint32_t group[32];            // mask bits: legs, trunk, arms, head (Bevy graph.rs:122-131, 4 groups not 64)
  float    hip_height;           // the scale base (Godot "Hips"; the game's Alexander law already uses it)
};
struct LocalPose { Vec3 root; Quat local[32]; };   // only `count` used: 12 + 22*16 = 364 B for today's humanoid
```

- [inferred] `SkeletonRest` + `SkeletonPose` in `game/skeleton.h:64-75` are this layout already, at a fixed 22. The
  change is to make the count and the hinge a property of the body kind. A 32 cap fits the 21 + spine + 8 finger joints
  E agreed to [summary] G-phys:241-243, and a back-jointed leg (sprinter.glb, not landed) [summary] G-cons:90.
- AoS, not SoA [inferred]: a figure's 22 quaternions are 352 B, a few cache lines. Ten figures fit in L1.

### 3.3 Inputs, outputs, and where it sits (code map: G-code section 1)

1. Producer (unchanged): `gait_pose` / `Body::pose` -> `BodyPose`. Positions stay the producers' language; the IK they
   use (`two_bone`, `reach_leg`) stays positional [summary] G-code:61.
2. FRAMES (new code, small): `BodyPose` -> `LocalPose` by `to_rotations` (`skeleton.h:76`), with one rule changed:
   a hinge joint's roll comes from its bend plane, not from `chest_right` / `right`. Today's rule is at
   `game/skeleton.cpp:95-99` [read]; the Rig's is at `game/model_rig.cpp:342, :347` [read].
3. LAYERS [ours, Godot's shape]: an ordered list; each is `void apply(const Ctx&, LocalPose&)` with an influence (default
   1.0, Godot `skeleton_modifier_3d.h:90`) and a group mask. The stack writes a COPY; the producer's pose for the next
   tick is never touched (Godot `skeleton_3d.cpp:327-341, :409-416`). A layer's own state (springs, a held head) lives in
   the figure's per-id record, the `PoseEase` pattern (`world_app.h:265-269`). The influence blend is the per-joint
   quaternion nlerp with ozz's sign fix (`blending_job.cc:100-113`).
4. MODEL SPACE + PALETTE: parents-first local-to-model (`model::palette_from_local`, `model.cpp:534-541`), then the MPFB
   retarget. [2nd reader: GAP in the design. Local-to-model sits AFTER the layers here, but the IK the scout points at
   (ozz `ik_two_bone_job.h:102-107`, `ik_aim_job.h:95-96`) takes MODEL-space matrices as input, so a wall-hand layer
   needs a local-to-model pass before it and a subtree pass after. The cost table (3.5) counts one pass only. Also,
   `palette_from_local` (`model.cpp:534-541`) works on the skin's 53 joints, not on the 22-joint `LocalPose`; the step
   from 22 to 53 is the Rig's job and is not drawn here.] The Rig takes each bone's frame from step 2 instead of its four region frames
   (`model_rig.cpp:326-342`).

What goes in the stack, as each arrives (each is another scout's or lap's mechanism, not mine): the kinetic chain (today
inside `apply_motion` in positions, left there until it must move); his per-kind cues (T2 head hold on the head group,
T3 back flex on the spine joint) [summary] G-loco:151-166; the soft-keyed physics (E's ragdoll, already rotation-based,
off main) [summary] G-phys:75-79; the hand on a wall as an ozz-style weighted correction (item 159).

### 3.4 Parameters (few)

| parameter | default | source |
|---|---|---|
| layer influence | 1.0 | Godot `skeleton_modifier_3d.h:90` [read] |
| quaternion blend | sum with sign fix, normalise once | ozz `blending_job.cc:100-113, :334-354` [read] |
| rest fill-in threshold | 0.1 of total weight | ozz `blending_job.h:104-107` [read]; needed only if weights can sum to 0 |
| joint groups | 4 (legs, trunk, arms, head) | Bevy masks [read]; the count is [ours] |
| max joints a kind | 32 | [ours]; ozz's reason for a cap [read] |
| hinge fallback band | full hinge rule at bend >= 20 deg, today's rule below 5 deg, smoothstep between | [ours], no source |
| clock | the 240 Hz tick, drawn between ticks | `docs/ARCHITECTURE.md:56` [read]; Godot's PHYSICS mode [read] |

### 3.5 Cost per character per frame (none measured; all [inferred] from counting)

| step | work | estimate |
|---|---|---|
| frames (`to_rotations`) | 22 basis builds (2 normalise, 2 cross, 1 basis-to-quat) | ~1.5k flops |
| layers | 22 joints x up to 5 layers x (nlerp 8 + normalise ~10) | ~2k flops |
| local-to-model | 22 x (quat to 3x3 + 3x4 multiply) | ~1.5k flops |
| palette | 53 bones x one 3x4 multiply (~63 flops) | ~3.5k flops |
| upload | 53 x 48 B = 2,544 B per figure (as today) | — |

About 8-9k flops, so 2-5 us per figure on a desktop core [inferred]. Ten figures cost about 50 us, 1.5% of the 3.33 ms
frame. That is the same order as ground_code's guess for today's hunter path [summary] G-code:239-241. GPU skinning stays
the larger cost (+0.39 ms for two models) [summary] G-cons:24-27. One saving today [read]: `Rig::palette` allocates
`pal` and `done` and `palette_floats` a third vector every call (`model_rig.cpp:324, :338, :372-373`). A caller-owned
buffer removes three heap allocations per figure per frame. [2nd reader: RE-DERIVED, `ground_code.md:237` ("allocates two
std::vectors per call", same function). The primary confirms the scout's count of three (`:324` pal, `:338` done, `:372`
out; `done` is a `vector<bool>`), so the ground file is one short, but the finding is not new.] The first time a layer lands, a timing row like E's R4.7
(`DZ_BENCH=1`) should run [summary] G-phys:195, :265.

### 3.6 One layer, three bodies

- Hunter: gait_pose -> frames -> [chain, look, later physics] -> Rig(hunter.glb).
- A lesser chaser: the same, with its own `SkelDef` (its model's skin) and its own stack: its cue as one layer at its own
  influence. It needs a per-id figure record (phase, springs, prev/cur `LocalPose`), today's one-float
  `hunter_phase_` made per id (`stage.h:142`) [read]. Its clock moves to the tick (lap 2).
- Player: Body::pose -> frames -> [look from the head down (item 163), the hand on a wall later] -> Rig(kid) with
  `lock_eye`. The camera stays the simulation's eye; the rows `body_tests.cpp:108, :151` guard it [summary] G-code:292-294.

The numbers behind the first lap come from two scratch node scripts:
`C:/Users/nname/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/scripts/glbrest.js`
reads ONLY the JSON chunk of `content/models/hunter.glb` and composes node TRS. It gives the rest left arm: upperarm
(0.1899, 1.7778, 0.0204), lowerarm (0.516, 1.4126, 0.0324), hand (0.7321, 1.188, 0.3722). So the hunter's rest elbow is
already bent 46.1 degrees [read, the script's output]. `hinge.js` (same folder) swings each bone on its own from that rest
(the Rig's rule with the chest frame as identity) over abduction 10/15/25, flexion -50..45 and elbow bend 80/106.5 degrees.
It measures the angle between the elbow hinge as the upper arm carries it and as the forearm carries it: 4.7 to 46.5
degrees, worst 46.5 at abduction 10, flexion 45, bend 106.5 [inferred: the arm angles and the humerus roll are my
assumptions, not the game's pose].

## 4. The FIRST lap: the drawn elbow and knee bend about one hinge

[ours, ~~mechanism from ozz `ik_two_bone_job.h:72-78` and `ik_aim_job.h:69-85`; Godot `two_bone_ik_3d.h:181-211`~~ [2nd
reader: DOWNGRADED to [ours]. ozz's `mid_axis` is fixed in the middle joint's LOCAL space and "usually fixed for a given
skeleton" (`ik_two_bone_job.h:72-74`); the bend plane comes from a separate `pole_vector` (:80-85). This rule does the
reverse: it derives a new hinge each tick from `cross(upper, lower)` and gives both bones their roll from it. Godot's
`:181-211` is a pole-roll solve. No source read computes a bone's roll this way. Keep the idea (one axis for a hinge);
mark the rule and the 5/20 degree band as [ours, no source], per item 153.]]

- Why first: it is the smallest piece of the local-rotation idea that changes what he sees, and it touches his picked arms
  (item 186, "v1 sourced flare looks the best" [read] brief:1485; item 180, "more bend in the elbow" [read] brief:1205).
  The flared V1 arm bends out of the plane the chest frame assumes, which is where the swing rule diverges [inferred].
- The change: in `Rig::palette`, the upper and lower bone of each arm and leg get a frame from TWO vectors, the bone and
  the bend-plane normal `cross(upper, lower)`, mapped from rest to pose (`R = F(d1, h1) * F(d0, h0)^T`), instead of
  `swing(d0, d1) * region frame` (`model_rig.cpp:342, :347`). Below 5 degrees of bend, today's rule; full rule from 20
  (the [ours] band). Where the REST limb is straight (a kid map), h0 is today's region frame's x made square to the bone. [2nd reader: measured,
by the scout's own `glbrest.js` run on `content/models/kid.glb` and `hunter.glb`, then the angle between upper and lower
rest directions by hand: elbow 44.6 (kid) and 46.1 (hunter) degrees, so the arm case has a real h0; KNEE 10.2 (kid) and
7.5 (hunter) degrees, so the knee's `cross(rest upper, rest lower)` is a small difference of two near-parallel vectors
and its direction is only as good as the rest joints' rounding to 4 places. The 5/20 degree band guards the POSE bend, not
the REST bend; knees need their own rule or the row should be arms only. [inferred from [read] node positions]]
- Files: `game/model_rig.cpp` (`Rig::palette`), `game/model_rig.h` (which aims form a hinge pair, from `standard_aims`
  `model_rig.cpp:242-250` names), `game/tests/model_rig_tests.cpp`. Not `skeleton.cpp` (its matching fix is lap 2, so
  the ragdoll and the Rig share one set of frames). No caller changes.
- Tier: prove it (core geometry). Test first, the mutation harness over `model_rig.cpp`, the full suite at landing.
- ROW 1, `the_drawn_elbows_and_knees_bend_about_one_hinge`. Case: the hunter on `hunter.glb`'s own rest, driven by the
  scripted chase that `ragdoll_tests.cpp:49-90` already drives as the stage does (run-up, wide turn, hairpin, sprint,
  stop; 2,880 ticks); and the kid over the bot's recorded gym run (`skeleton_tests.cpp:44-51`). On every tick where the
  limb bends 20 degrees or more, take the rest hinge `h0 = cross(rest upper, rest lower)`; the angle between
  `apply_dir(pal[upper], h0)` and `apply_dir(pal[lower], h0)` must be within 1 degree [ours].
  Red today: expected 5-46 degrees on the elbows by the sketch above [inferred]. The builder registers the bar, then
  measures and reports main's real figure before writing the fix. Green after: ~0 by construction.
  [2nd reader, how Row 1 passes without doing its job. (a) Set `pal[lower] = pal[upper]` for each limb pair: the hinge
  copies then agree to 0 degrees, the forearm is dragged along rigidly, and Row 1 is green. The guard the scout names,
  `a_posed_bone_carries_its_joints...` (`model_rig_tests.cpp:144-178`), does not catch it: it checks only `pal[ua]`
  (upperarm_l) at shoulder and elbow (:168-169), a leg not raised (:171) and a finger (:173); no lowerarm, calf or wrist
  point is checked, and the pose there only lifts the arm (:163), so a rigid forearm would still sit where it should.
  Row 1 needs a companion: `apply(pal[lower], rest wrist)` and `apply(pal[calf], rest ankle)` within a stated distance of
  the pose's wrist and ankle on every tick. (b) Row 1 is circular: the rule builds both bones' frames from one plane, so
  the check on that plane is true by construction and says nothing about whether the elbow looks better. Only his eye
  (section 5) can. (c) It can pass on zero cases: if no tick of the kid's gym run bends an elbow 20 degrees, the row is
  vacuous. Add "at least N qualifying ticks" to the row.]
- ROW 2, the guard, `the_drawn_upper_arm_does_not_spin_on_its_own_length_from_one_tick_to_the_next`: the bone's roll
  change per tick on the same two cases stays at or under main's own worst [ours: "no worse than main"; a cross-product
  frame flips near a straight limb, and the fallback band exists for that].
- Must stay green: `at_rest_every_bones_palette_is_the_identity` (:128) and
  `a_posed_bone_carries_its_joints_where_the_pose_has_them_and_its_children_with_it` (:144); at rest `R = I` by
  construction [inferred]. Also every `body_tests` camera row (the eye is untouched).
- Cost: per limb pair, 2 cross, 2 normalise and one 3x3 from two frames: under 0.5k flops per figure [inferred].

Lap 2 [ours]: the same rule in `skeleton.cpp:95-99`, and the Rig fed from `to_world`'s frames (`skeleton.h:82-86`).
Then a per-id figure record with the stride phase advanced on the tick (stage's frame clock retired, G-code:34-36), so a
second humanoid figure can be drawn.

## 5. What only his eye can decide, and the fewest clips

- Whether the hinged elbow reads better or worse than today's, on his picked V1 arms. ONE clip: main beside the lap,
  same frames. The hunter on the scripted chase's sprint and wide turn, side view at elbow height, real time then 3x
  slower. Lit, at full frame rate (the 12 fps `--capture-lean` is the wrong tool [summary] G-cons:142-143, :159-161,
  :213), and with "before" = current main (item 216's ruling [summary] G-words:539-542).
- The kid's arms in first person at a sprint, the moment the hands enter the bottom of the view (row
  `body_tests.cpp:262`): ONE first-person clip, main beside the lap.
- Later, for each layer of the stack (a cue, the chain): the human base beside the layer at its sourced default, plus one
  more amount. He picks; no table decides what is elegant or creepy (rule 7).

## 6. What I would NOT build, and why

- ozz, Godot or Bevy code in the game: his item 150 [read] brief:1102-1103. The pieces needed are already here
  (`skeleton.h`, `palette_from_local`). A second quaternion type and maths library would sit beside `core/math.h`.
- Clip sampling, keyframe compression, a clip format, an animation graph, a state machine or a blend space: all exist to
  play clips, and clips are out by his pick [summary] G-src:187. Body's 9-move weight blend is the procedural equivalent
  already [summary] G-code:47.
- SoA SIMD poses: no gain at 22 joints [inferred]. ozz's estimate normalise does not give the same bits on every
  processor [inferred from `simd_math_sse-inl.h:543`].
- Godot's `LimitAngularVelocityModifier3D` or any hard rate cap: L173's caps were removed and replaced by sourced eases
  [summary] G-src:81-82, :229-232.
- Godot's deferred node-tree update, Bevy's ECS and UUID path ids: machinery for an editor and a general engine. The
  `JointMap` by name already does what the path id does here [inferred].
- Converting the producers (gait_pose, Body::pose) to rotations: their IK and their sourced curves are positional and
  tested (G-code:254-307); a conversion would re-test everything for no picture change [inferred]. Frames are built once,
  at the end.
- A general N-joint skeleton for non-humanoids: his item 168, "all entities must be humanoid in nature" [summary]
  G-words:406-411. The 32-joint cap covers the humanoid variants.

## What I did not open

- ozz: `sample_look_at.cc`, `sample_foot_ik.cc`, `ik_two_bone_job.cc` (the room read them, G-src:51-63); `animation.h`,
  `skeleton.cc`, `ik_aim_job.cc` downloaded, not read past a skim of their names; the offline tools; `soa_float.h`.
- Godot: `two_bone_ik_3d.cpp`, `spring_bone_simulator_3d.cpp`, `skeleton_modifier_3d.cpp`, `ik_modifier_3d.*`,
  `chain_ik_3d.*`, `fabr_ik_3d.*`, `ccd_ik_3d.*`, `jacobian_ik_3d.*`, `retarget_modifier_3d.*`; the AnimationTree nodes;
  `animation_mixer.cpp` beyond the grepped lines.
- Bevy: `animatable.rs`, `transition.rs`, `animation_curves.rs`, `gltf_curves.rs`; `LICENSE-APACHE` beyond its title and
  clause 4; any Bevy IK (none in this crate, by its file list).
- O3DE EMotionFX (owed in G-src:284); Unreal (not permissive).
- In dreamzone-3: `kid.joint_map.json` (so the kid's rest elbow bend is unknown); `body.cpp`; `model_rig.cpp` beyond
  `:147-160, :242-251, :322-376`; `skeleton.cpp` beyond `:36-61, :95-99`; the l205-stomp-c branch; any test body except
  `ragdoll_tests.cpp:1-12, :49-92`.
- The hand-backs and plans themselves: everything from the record is through the six ground files, except the brief lines
  1102-1103, 1109, 1114, 1205, 1211, 1485 and 1607, which I opened.
- Nothing was timed. No game, tool or test was run.

## Second reader

Marks: [read] I opened it. Outside files were downloaded with curl at the scout's tags (ozz 0.17.0, Godot 4.7.2-stable, Bevy
v0.20.1) and read as text. Game code was read with `git show main:` at 31d1c6d. The scout's two node scripts were re-run
(they read only the GLB's JSON chunk, under a second): `hunter.glb` rest elbow 46.1 degrees, worst row 46.5, range 4.7 to
46.5, all as the scout states. Nothing else was run. Line numbers in the first column are the scout file's lines BEFORE my
insertions.

| scout line | claim | primary opened | verdict | evidence |
|---|---|---|---|---|
| 50-52 | ozz MIT, (c) 2020 Blanc, notice must ship | ozz `LICENSE.md:1-16` | OK | MIT text, :15-16 notice clause |
| 54-56 | ozz skeleton: local SoA rest, int16 parents, depth-first | `skeleton.h:51-60, :136-143` | OK | `span<SoaTransform>`, `span<int16_t>` |
| 55-56 | 1024 cap exists so arrays sit on the stack | `skeleton.h:66-71` | DOWNGRADED | index bits is reason one; stack "also" |
| 57 | SoaTransform: t, r, s, 4 wide | `soa_transform.h:40-44` | OK | three Soa members |
| 58-60 | LocalToModel forward loop; from/to/from_excluded | `local_to_model_job.h:81-107`, `.cc:79-99` | OK | loop on `parents[i] >= from` |
| 61-65 | Blending: weights, per-joint weights, 0.1 threshold, sign fix, normalise once, additive from identity | `blending_job.h:76-115`, `.cc:100-134, :334-354` | OK | `Sign(Dot(...))`, `NormalizeEst` after the passes |
| 66-69 | NormalizeEst uses RSqrtEstNR, from `_mm_rsqrt_ps` | `soa_quaternion.h:96-100`, `simd_math_sse-inl.h:543-550` | OK, one half DOWNGRADED | code true; cross-CPU claim has no source |
| 70-72 | IKTwoBone: mid_axis one local axis, pole, soften, weight, local corrections | `ik_two_bone_job.h:43-116` | OK | :72-78, :80-85, :91-100, :111-116 |
| 73-74 | IKAim: forward and up fix whole rotation | `ik_aim_job.h:43-85` | OK | forward + up + pole |
| 75-76 | SamplingJob: ratio and a context | `sampling_job.h:47-73` | OK | context stores values for forward play |
| 77 | runtime needs only C++17 and std lib | ozz `README.md:23` | OK | "depends only on c++17" |
| 81 | Godot MIT, contributors | `LICENSE.txt:1-12` | OK | MIT text; `COPYRIGHT.txt` not opened |
| 84-85 | Godot bone: rest, local TRS, global derived | `skeleton_3d.h:99-118` | OK | also caches a `Transform3D pose_cache` |
| 86-88 | modifier `influence = 1.0`, in order, lerp below 1 | `skeleton_modifier_3d.h:89-90`, `skeleton_3d.cpp:1192-1210` | OK | `interpolate_with(..., influence)` |
| 89-92 | save pose, skin from modified, restore | `skeleton_3d.cpp:327-341, :402-416`, `.h:143-157` | OK | the "picture only" reading is [inferred], fair |
| 93 | modifiers run on PHYSICS, IDLE or MANUAL | `skeleton_3d.h:79-83` | OK | enum |
| 94-95 | LimitAngularVelocity: slerp cap, default TAU | `limit_angular_velocity_modifier_3d.h:53`, `.cpp:420-429` | OK | `limit_in_frame = max * p_delta`; unit is rad/s |
| 96-98 | LookAt: duration tween, soft limit by B-spline | `look_at_modifier_3d.h:68-87`, `.cpp:679-702` | OK | `remap_damped`, `get_bspline_y` |
| 99 | TwoBoneIK3D solves roll from the pole plane | `two_bone_ik_3d.h:181-211` | OK | true, but see line 134 below |
| 100-101 | SpringBone defaults .02, 1.0, .4, 0 | `spring_bone_simulator_3d.h:131-138` | OK | :132, :134, :136, :138 |
| 102-103 | humanoid profile 56 bones, Root, Hips | `skeleton_profile.cpp:479-489` | OK | `bones.resize(56)` |
| 104-106 | rest-relative blend; `deterministic` off normalise | `animation.cpp:5688-5694`, `animation_mixer.cpp:1508, :495-501, :1270-1276` | OK | `p_from * slerp(identity, rest^-1 * to, w)` |
| 110-113 | Bevy MIT or Apache-2.0; clause 4 | `README.md:106-109`, `LICENSE-MIT` (19 lines), `LICENSE-APACHE:89-110` | OK | Apache otherwise unread, as the scout says |
| 115-118 | Clip/Blend/Add; 64-bit group masks, "may NOT animate" | `graph.rs:122-131, :179-185, :214-238, :484-490` | OK | `AnimationMask = u64` |
| 119-120 | targets named by path; any clip on any armature | `lib.rs:167-180` | OK | quoted |
| 26-27 | BodyPose = 21 joints + 5 vectors + float = 316 B | `game/body.h:55-68` | OK | 26 x 12 + 4 |
| 31-33 | skeleton.h 22 joints, parents first, to_rotations | `game/skeleton.h:6-12, :61, :64-86` | OK | read on main |
| 35 | per-id `PoseEase` / `DrawnChaser` | `world_app.h:265-269` | OK | struct and `ease_` vector |
| 37-38 | hunter's phase advanced by frame delta | `stage.cpp:269` | OK | uses `last_dt_` |
| 42-44 | `palette_from_local` used only by two tests | `model.h:92-95`, `model.cpp:534-541`, `git grep main` | OK | two hits, `model_tests.cpp:213, :228` |
| 168 | roll rules at skeleton.cpp:95-99, model_rig.cpp:342, :347 | both files | OK | four-way `b` pick; `swing(...) * b` |
| 207-209 | Rig::palette allocates pal, done, out | `model_rig.cpp:324, :338, :372` | OK, RE-DERIVED | three; ground file said two |
| 193 | clock: 240 Hz tick, drawn between ticks | `docs/ARCHITECTURE.md:56` | OK | "Rendering interpolates between ticks" |
| 199-205 | flops 1.5k + 2k + 1.5k + 3.5k, about 8-9k | arithmetic only | OK [inferred] | 63 flops a 3x4 product; 53 x 63 = 3.3k; sum 8.5k |
| 205 | ten figures = 50 us = 1.5% of 3.33 ms | arithmetic only | OK [inferred] | 50 / 3330 = 1.5%; ARCHITECTURE.md:57 says 2.78 ms at 360 |
| 225-229 | rest elbow 46.1; sketch 4.7-46.5, worst at abd 10, flex 45 | re-ran `glbrest.js`, `hinge.js` | OK | outputs match; the sketch poses are the scout's own |
| 233 | first-lap mechanism comes from ozz and Godot | `ik_two_bone_job.h:72-85`, `two_bone_ik_3d.h:181-211` | DOWNGRADED to [ours] | fixed local axis + pole vector, against a per-tick derived plane |
| 134 | hinge source: Godot TwoBoneIK3D plane solve | `two_bone_ik_3d.h` | WRONG | pole roll, no hinge axis; 0 hits for "hinge" |
| 254-258 | `:144` guards the posed bones | `model_rig_tests.cpp:144-178` | WRONG | checks upperarm only; the forearm is not checked |
| 305 | kid rest elbow bend unknown | `glbrest.js` on `kid.glb` | CLOSED | elbow 44.6, knee 10.2 (hunter knee 7.5) |
| 108-109 | item 150 quote | `briefs/dreamzone2_the_game.md:1102-1103` | OK | verbatim substring |
| 235-237 | item 186 "v1 sourced flare looks the best"; item 180 "more bend in the elbow" | brief `:1485`, `:1205` | OK | verbatim; the link to a hinge fix is [inferred] |
| 21-22, 84-91, 187, 229-232 | what the ground files say | `ground_sources_read.md:51-63, :81-91, :187, :229-232` | OK | lines match |
| 36, 40-41, 61 | G-code, G-cons, G-phys, G-loco line cites | `ground_*.md` at those lines | OK | spot-opened, as quoted |

Tally: 44 rows. OK 39 (one of them, the rsqrt row, has a half I mark DOWNGRADED). DOWNGRADED 2 (the 1024-cap reason; "first-lap
mechanism from ozz"). WRONG 2 (Godot TwoBoneIK3D as a hinge source; `:144` as a guard on the forearm). UNSUPPORTED 0. CLOSED
by measurement 1 (the kid's rest bend).

RE-DERIVED: 3. (1) ozz two-bone IK for the wall hand: scout :72, :137, :181 against `ground_physics_and_fp_body.md:132`.
(2) The `Rig::palette` allocations: scout :207-210 against `ground_code.md:237`. (3) A hinge about one axis, in part: scout
:5, :70, :134 against `ground_physics_and_fp_body.md:106` (a positional IK, not a drawn frame).

By grep of the six ground files I found nothing earlier for: `palette_from_local`, the Godot modifier stack with its save and
restore, Bevy's masks, and the 22-to-32-joint layout with a per-kind hinge column.

Mechanisms without a source and not marked [ours] in the scout file as written: (a) the bend-plane roll rule
`R = F(d1,h1) F(d0,h0)^T` (its header said "from ozz"; corrected above); (b) "the influence blend is the per-joint nlerp with
ozz's sign fix" (3.3 step 3): ozz sums several layers then normalises once, Godot interpolates before and after; a
two-quaternion nlerp is neither, and no source read says it; (c) the flop counts in 3.5 are counts, not timings (marked
[inferred], fine).

Design gaps that matter. (1) IK needs model-space matrices mid-stack (note at 3.3 step 4); the cost table has one pass.
(2) "Several body kinds" is answered by a per-kind `SkelDef`, but `BodyPose` is a fixed `std::array<Vec3, kJointCount>`
(`body.h:56`) over a 21-name `Joint` enum; a kind with other joints (the back-jointed sprinter) cannot be written by the
producers without changing that type, and the layout does not say how. (3) Section 6's "not at all" for code leans on item
150 (02:22) alone; the other reasons it gives (no clips, 22 joints, a maths library already here) are sound and should lead.

What I could not check: Intel and AMD documentation on `rsqrt` estimates; Godot's `COPYRIGHT.txt` and ozz's third-party
licences (samples and extern, which the scout does not propose to use); the rest of Apache-2.0 beyond clause 4; any cost
(nothing was timed anywhere); whether the out-of-plane elbow bend is what his eye reads as wrong at items 180 and 186 (his
eye decides, rule 7); `body.cpp`, the l205-stomp-c branch, and the owner's 14:49 words (not in the brief lines I opened).

# Scout: cost, level of detail and determinism for the animation system (2026-11-13)

1. CPU pose work is microseconds a figure; the cost that matters is GPU skinning plus ray-tracing refit (about 1.2 ns
   a skinned vertex, from the one D663 measure) and picture physics. Budget the scene in skinned vertices: 500k a frame. [2nd reader:
   DOWNGRADED. The 1.2 ns divides 0.32 ms by a vertex count the handback itself marks "inferred" (p-d663-loader-C
   :139); the 0.32 ms also holds the triangle refits, the one rebuild and the top-level build, and there is +0.06 ms
   in tracing and p99 +0.48 ms, not 0.32 (:134-136). One measure, two models, one build: a rate per vertex is not shown.]
2. One picture clock: everything that integrates over time steps on the 240 Hz tick and is drawn at alpha. Today the
   hunter's stride phase does not: it is summed from the frame's delta, so it differs by frame rate and runs while paused.
3. Tiers by rank, from his own pick: the hunter, the player and the 2 nearest lesser chasers in full; the rest light.
   Physics, then floor probes, then mesh detail drop first; the clocks never drop, seen or unseen (O3DE's pattern).
4. First lap: move the stride phase from the stage into WorldApp's per-tick table. Red row: the phase at instants common
   to 144/240/360 frames a second must agree, and stand still while paused. It also feeds the L192 footsteps.
5. Not built: Unreal-style dynamic budgets and reduced-rate posing (they tie the picture to machine load), SoA/threads.

Marks: [read] I opened it and saw it; [summary] from a ground file or another scout's file; [inferred] mine; [ours] a
proposal. Game code: dreamzone-3 `main` 31d1c6d unless a branch is named. Ground files are cited as GC (ground_code),
GR (ground_constraints_and_roster), GP (ground_physics_and_fp_body), GL (ground_locomotion_and_yardstick), GS
(ground_sources_read), GW (ground_his_words), all in this folder. Outside files were downloaded with curl into my
scratchpad and read as text; nothing was built or run beyond curl, grep, sed, pdftotext and a node text-stripper.

## 1. What the room already has for this aspect

Budget and anchors:
- His budget: 360 the aim, "a solid 300+" the floor [summary GR:14-17, quoting brief:1569, :1574]; the gate the
  librarian ruled is p99 under 3.33 ms on his RTX 5080 at 1440p [summary GR:20-21].
- Default frame p99 1.99-2.09 ms; about 1.2 ms of room at p99 [summary GR:28, :31 (the room is GR's inference)].
- The only animation cost ever measured: the kid and the hunter on the GPU, avg +0.39 ms, p99 +0.48 ms, 0.32 ms of it
  in the top-level pass (skinning, refits, one rebuild in turn, the top-level build); about 266k vertices skinned and
  343k triangles refitted a frame [summary GR:24-27; re-read at handback/p-d663-loader-C_2026-11-11.md:134-139, read].
  [2nd reader: DOWNGRADED. The cost figures are read at :134-138; the 266k and 343k are marked "inferred" at :139 (and
  GR:25-26 says so). They are the sum of the two glTF vertex counts and the two triangle counts, not a measured load.
  Also: P's default frame, p99 1.99-2.09 ms (brief:1576, a D675 bench after D663), may already hold both models; if so
  the 1.2 ms of room (GR:31) is net of this cost and the scene budget in 3d double-counts the hunter and the kid.]
- No CPU time per character exists anywhere; the ragdoll's cost row R4.7 exists only on E's clone and never ran
  [summary GP:5, :195, :259-265; GL:313-316; GC:228-252 (counted, not timed)].
- His detail pick, `entity_bodies-2`: "Nearest two or three full detail", note "hunter full detail, the rest can be lower
  quality but still decent" [summary GW:569-571, brief:1274-1276].

Determinism:
- Animation is picture only, and two checks guard it: dz-world self-test part 7 and his 16 kept runs byte for byte
  [summary GR:33-54].
- The hunter's stride phase is frame-integrated (`hunter_phase_ += p.speed * last_dt_ * ...`), "not part of any replay"
  [summary GC:34-36]; GC lists "no row for frame-rate independence of `hunter_phase_`" as a gap [summary GC:341].
- E's ragdoll steps with the frame's dt clamped to 1/1000-1/30 s [summary GP:92]. The physics scout already proposes
  stepping the picture world on the 240 Hz tick and an active set [summary scout_secondary_and_physics.md:4, :189].
- The runtimes scout counts 2-5 us a figure for a local-rotation pose and rejects ozz's SoA for 22 joints
  [summary scout_runtimes.md:3-8, :130]. I do not repeat that research.

Sound and the feet:
- The task says sound already reads the feet's phase. That is true only on `origin/l192-footsteps` d8f77ba,
  "(WIP, UNBUILT)" [read `git log -1 origin/l192-footsteps`]. There the stage hands `hunter_phase_` and its rate to the
  sound [read l192 game/world/stage.cpp:273-275, :683]. On main the mixer keeps its own step clock per voice, started
  at a random phase per id [read audio/mixer.cpp:280-281].

## 2. What I read at source that is NEW

Nothing below is proposed as code, data or art to ship. Every outside item is "use the idea" only. The one library I
name for use is Jolt, already in the game.

### 2a. The game itself (main 31d1c6d), read for this aspect
- The stage takes the frame's delta, clamped to 0.0001-0.25 s [read game/world/main.cpp:188], into `last_dt_`
  [read game/world/stage.cpp:650]. The simulation's clock cuts a long frame to 0.1 s
  (`FixedStep(int64_t longest_frame_ns = kSecond / 10)`) [read game/loop.h:22]. [inferred] So after a stall between
  0.1 and 0.25 s the drawn legs run on for up to 0.15 s of time the simulation never had.
- Paused, `Shell::advance` returns before any tick: `if (mode_ == Mode::Paused) return 0;` [read game/shell.cpp:156],
  but the loop still calls `stage->draw` each frame [read game/world/main.cpp:188]. `chaser_poses` keeps the last
  speed [read game/world/world_app.cpp:539-545]. [inferred] So while paused, the hunter's legs keep cycling in place.
  Not run; this is a reading of the code.
- `FixedStep` counts time exactly: "after any sequence of frames, ticks() is exactly floor(elapsed time x 240)"
  [read game/loop.h:7-8]. [inferred] At any instant two frame rates share (every 1/24 s for 144, 240 and 360), ticks
  and alpha are equal, so any picture that is a function of (tick, alpha) is ~~the same bits at all three~~ [2nd reader:
  DOWNGRADED. loop.h:7-8 is exact for the nanoseconds it is given, but 1/144, 1/240 and 1/360 s are not whole
  nanoseconds. The tools' own `kStepNs = 1'000'000'000 / 144` (offscreen_models.cpp:29) is 6,944,444; six of them are
  41,666,664 ns, which is 9.99999936 ticks: tick 9, alpha just under 1, not tick 10. The three runs agree to about
  1e-6 of a tick, not to the bit, unless the frame schedule is built from cumulative rounding. At those instants alpha
  is 0 or near 1, so the claim does not test the alpha interpolation at all.].
- Every other picture clock is already per tick: `DrawnChaser::step(..., kTickDt)` for every chaser of every kind
  [read game/world/world_app.cpp:578]; the player's body after the rig each tick [summary GC:46]. `gait_pose` stays a
  pure function on l205-stomp-c too [inferred from `git show l205-stomp-c:game/model_rig.cpp`: no frame state found].
- The view's glance eases per frame by an exact exponential, dt clamped 0.0005-0.033 s [read game/shell.cpp:164-165].
  [inferred] That is frame-rate independent above 30 frames a second; it is view state, not pose state.
- The clip tools draw at 1/144 s (`kStepSeconds`) and call `draw` only inside each stretch's window
  [read game/world/offscreen_models.cpp:30, :457-462]. [inferred] So the legs in a clip start each window from the
  phase the last window left, not from where the live game would have them. A tick-domain phase fixes clips too.
- The renderer skins and refits a skinned mesh only on frames it was given a palette (`s.pending`), and rebuilds one
  skinned structure a frame in turn [read render/src/renderer.cpp:1970-2013; render/renderer.h:130-133].
- A skinned mesh posed this frame keeps its motion history only if its instance transform did not change
  (`memcmp(was, &now[0][0], ...) == 0`); otherwise "its pixels start their history afresh" [read
  render/src/renderer.cpp:2076-2085]. The models' palettes carry world position (`translation(p_from)`)
  [read game/model_rig.cpp:348]. [inferred] So a figure posed less often than every frame would either stand still
  between poses or lose its pixel history on each pose. That rules out cheap reduced-rate posing here.
  [2nd reader: OK, and stronger than stated. The test also needs `sk->posed == frame`, posed in the frame just before
  (renderer.cpp:2079; `s.posed = frame + 1` at :2010), so a skipped frame resets history whatever the transform does.]
- Each mesh gets its own copy of the palette and its own dispatch (hunter 6 meshes, kid 9) [read
  render/src/renderer.cpp:1959-1966, :1990-1998; summary GR:62-63].
- The hunter's arm solve, `arm_swing_solved`, runs 2 x 40 bisection steps, each 2 sin/cos plus an atan2 plus
  `arm_flare` [read game/model_rig.cpp:667-690]. Its inputs are speed, leg, run and style only: no phase.

### 2b. Jolt Physics v5.6.0, the game's own submodule (MIT)
Licence: MIT, `third_party/JoltPhysics/LICENSE` [read :1-3]; commercial use allowed; the notice must be kept with copies;
no share-alike; redistribution allowed. CREDITS.md already names it [read CREDITS.md:7-8].
- "In general, the system is stable when running at 60 Hz with 1 collision step." [read Docs/Architecture.md:740]
- Deterministic if the API calls come "in exactly the same order" and the binary is the same [read :787-790].
  `GetActiveBodies` returns bodies "in a non-deterministic order" [read :807]; broad-phase queries are not
  deterministic [read :804]. Several PhysicsSystems may run side by side; only Shapes may be shared [read :853-856].
- Per-body solver overrides: `mNumVelocityStepsOverride`, `mNumPositionStepsOverride`; an island runs the max of its
  members [read Jolt/Physics/Body/BodyCreationSettings.h:114-115]. Defaults 10 and 2 [read PhysicsSettings.h:84, :87].
- Sleeping: islands at rest sleep after `mTimeBeforeSleep` 0.5 s below 0.03 m/s [read Architecture.md:415-421;
  PhysicsSettings.h:95, :102].
- `SkeletonMapper` maps "a low detail (ragdoll) skeleton to a high detail (animation) skeleton" [read
  Jolt/Skeleton/SkeletonMapper.h:12].
- Published timing: the performance test's ragdoll scene is "16 piles of 10 ragdolls (3680 bodies) with motors"
  [read Docs/PerformanceTest.md:7], so 23 bodies a ragdoll [inferred]. The multicore paper (Rouwe, 2022, updated 2023,
  jrouwe.nl/jolt/JoltPhysicsMulticoreScaling.pdf, downloaded, read via pdftotext) says Jolt is "4.9x faster with 8
  threads than it was with 1 thread" on that scene [read pdf text :60]. The absolute steps a second sit in a chart
  whose axis runs 0-400 [read pdf text :124-150]; I could not render the chart, so I have no exact single-thread figure.
  [2nd reader: the 4.9x is read at pdf text :59-60 and is for the EC2 c-series graph; the 0-400 chart is a different
  graph (all platforms, up to 18 threads, i7-7700HK among them). Mixing them makes the bound below a stretch: DOWNGRADED.
  The scene is piles of 160 touching, motor-driven ragdolls, not four keyed ragdolls. PerformanceTest.md says it at :8.]
  [inferred] If 8 threads give at most 400 steps a second, 1 thread gives at most about 82: at least 12 ms a step for
  160 ragdolls, at least about 76 us a ragdoll a step, in piles full of contacts with motors on 2017-2021 CPUs.

### 2c. O3DE EMotionFX (Apache-2.0 or MIT; idea only)
Licence: "Apache License, Version 2.0 ... you may elect at your option to use ... the MIT License" [read
github.com/o3de/o3de LICENSE.txt:2-4, development branch]. I propose no code from it.
- Each update, every actor's sampling timer advances by the frame's time; motions are sampled only when the timer
  passes `m_motionSamplingRate`, and joint transforms are output only if the actor is visible:
  `actorInstance->UpdateTransformations(timePassedInSeconds, isVisible, sampleMotions);` [read
  Gems/EMotionFX/Code/EMotionFX/Source/SingleThreadScheduler.cpp:86-108]. Rate 0 means every frame [read
  ActorInstance.h:901].
- The anim graph's time still advances when nothing is output: `m_animGraphInstance->Update(timePassedInSeconds)`
  runs before the `if (updateJointTransforms && sampleMotions)` test [read ActorInstance.cpp:282-292].
  [inferred] The lesson: keep the clocks running for an unseen body; skip only the pose and the skin.

### 2d. Unreal Engine docs (© Epic; idea only; no engine code read or proposed)
- URO: "target Update Rates that perform at 15Hz and under, at appropriate distances, for most characters, as well as
  disabling interpolation" [read dev.epicgames.com, "Animation Optimization in Unreal Engine", General Tips (text
  line 171 of my strip)]. The page then recommends the Animation Budget Allocator instead [read same, :184-185].
- The Budget Allocator throttles ticking to a fixed CPU budget in ms, favouring "the closest, most significant
  meshes" and choosing whether to interpolate [read "Animation Budget Allocator in Unreal Engine", intro and "Using"
  sections]. Example budgets by view-distance quality: `a.Budget.BudgetMs=1.0` up to `2.5` [read same, "Platform
  Scaling"]. [inferred] Its output depends on how loaded the machine is, so two machines draw the same replay
  differently. That fails this game's rule below.

### 2e. Unity docs (© Unity; idea only)
- `AnimatorCullingMode`: AlwaysAnimate; CullUpdateTransforms, "Retarget, IK and write of Transforms are disabled
  when renderers are not visible"; CullCompletely, "Animation is completely disabled" [read
  docs.unity3d.com/ScriptReference/AnimatorCullingMode.html, Fields].

### 2f. Godot (engine MIT; docs CC BY 3.0; idea only)
- `AnimationMixer.callback_mode_process`: PHYSICS, "Process animation during physics frames"; IDLE; MANUAL [read
  godot 4.3-stable doc/classes/AnimationMixer.xml:356-363]. Engine licence MIT [read LICENSE.txt:1-5].
- Physics interpolation: "a physics tick rate that is fixed at design-time" is "the most desirable ... for
  consistency and predictability", drawn by an interpolation fraction [read godot-docs
  tutorials/physics/interpolation/physics_interpolation_introduction.rst:81-88, :140-141]. Docs licence CC BY 3.0
  [read godot-docs LICENSE.txt:1-3]. The game already does this for positions; the new point is to apply it to every
  picture-side clock.

### 2g. NVIDIA, "Best Practices for Using NVIDIA RTX Ray Tracing (Updated)" (© NVIDIA; idea only)
Read from the downloaded page, developer.nvidia.com/blog/best-practices-for-using-nvidia-rtx-ray-tracing-updated/:
- "consider using lower-detail LODs in ray tracing, especially to reduce the updating cost of dynamic BLASes"
  [read, section "Use appropriate Level of Detail (LOD) for instances"].
- "Update the BLAS only for visible objects" and "Sometimes it's not necessary to update a BLAS on every frame,
  depending on how large it is on the screen" [read, BLAS section].
- "Distribute rebuilds over frames"; "Consider merging small vertex deformation calls" [read, same page]. The game
  already rebuilds one skinned structure a frame in turn [read render/renderer.h:130-133].

## 3. The design for this aspect

### 3a. One picture clock (the determinism rule) [ours, from 2a, 2c, 2f]
- P1. Any picture state that integrates over time steps on the sim tick with `kTickDt`, keeps its value before and
  after the last tick, and is drawn at `alpha` between them (angles unwrapped). This covers `DrawnChaser` (already),
  the player's `Body` (already), the stride phase (moves in lap 1), and the picture physics world (the physics scout's
  proposal) [summary scout_secondary_and_physics.md:189].
- P2. Anything computed per frame is a pure function of tick-interpolated inputs: `gait_pose`, `apply_motion`,
  `chain_pose`, `Rig::palette` (already true [read game/model_rig.cpp:322-376; summary GC:28-31]).
- P3. Per-frame smoothing is allowed for the view only (glance, FOV), by exact exponential, as `shell.cpp:164-165`.
- P4. Picture randomness (the planned 0.9-1.1 rate per chaser [summary GS:109]) is seeded by entity id and drawn per
  tick, as the mixer seeds its voices by id [read audio/mixer.cpp:280-281]; never from a simulation RNG.
- P5. Tiers (3c) are chosen per tick from tick state, so a level-of-detail swap happens at the same tick at any rate.
- Result [inferred from loop.h:7-8]: at instants common to 144, 240 and 360 frames a second the drawn pose is ~~the same
  bits~~ [2nd reader: equal to about 1e-6 of a tick, as the row's own 1e-6 rad says; see the correction in 2a]; between them each rate draws its own alpha. A stall or a pause moves the picture exactly as far as the sim.
- Cost of P1 for physics: 0.67 steps a frame at 360, 1.67 at 144 [inferred: 240/360, 240/144].

### 3b. Where animation may feed back [ours]
- Allowed sinks, all outside the fingerprint: the audio scene (footfalls from the drawn phase, as l192 does), the view
  (a footfall shake, the FOV, never the aim), the HUD. Because the picture is a function of ticks (3a), these become
  the same on every replay and at every frame rate.
- Allowed reads of the simulation: read-only, closest-hit queries such as `floor_below` [read
  game/world/world_app.cpp:120-128]; "moves nothing in the simulation" [summary GR:40]. Never anything whose answer
  depends on Jolt's body order or broad-phase state [read Architecture.md:804-807].
- Forbidden: any write to `sim::World`, `chase::Run`, the recorded inputs or nav; any use of a picture value by the
  chase. A gameplay tell (item 208's rise when seen [summary GW:516-518]) is triggered by the chase's own state; the
  animation only shows it, and a sound for it is timed by the picture.
- Guards already in place: self-test part 7 and the 16 kept runs [summary GR:47-52]. Lap 1 adds the frame-rate row.

### 3c. Tiers, budget and what drops first [ours unless marked]
Parameters (four):

| # | parameter | default | source |
|---|---|---|---|
| T1 | full-detail lesser chasers | 2, the nearest to the player | his "Nearest two or three full detail" [summary GW:569-571] [2nd reader: DOWNGRADED. His option is two or three bodies in all, and his note (brief:1276) says "hunter full detail, the rest can be lower quality"; this table gives hunter + player + 2 lesser full, four] |
| T2 | skinned vertices a frame, all figures | 500k | ours: D663's 0.32 ms for 266k, scaled to ~0.6 ms, ~~half the room~~ [2nd reader: 0.6 ms is the AVERAGE; the gate is p99. At D663's p99 +0.48 ms the same scaling gives about 0.9 ms, three quarters of the 1.2 ms room, before tracing (+0.06 ms for 266k)] |
| T3 | picture-physics active set | 4 bodies (hunter, player, T1 pair) | ours; the physics scout's set [summary its :3] |
| T4 | rank hysteresis | a newcomer must be 10% nearer to take a rank | ours |

"Seen" = inside the view's frustum or the full-glance view's frustum (`kGlanceTurn` 2.9 rad [summary GC:179]), from
tick state. Line of sight is not tested (no raycasts) [ours]. Chasers behind must be ready: his 129-130, "looking back
and seeing them behind you slosh around corners is scary" [summary GW:252-258].

| tier | who | pose | floor probes | picture physics | mesh |
|---|---|---|---|---|---|
| A | hunter (always), player, the T1 pair | every frame, all layers | yes | if in T3 | full |
| B | other lesser on stage, or lesser unseen | every frame, no probes | no: the chase's floor | keyed | light |
| C | Waiting / OffStage | none, as today [read world_app.cpp:532] | - | - | - |

Drop order with rank or when unseen: (1) picture physics, blended out (the physics scout's inertialization [summary
scout_secondary_and_physics.md:5]); (2) floor probes; (3) full mesh to light, swapped only while unseen where possible.
Never dropped: the clocks (`DrawnChaser`, stride phase) for every chaser on stage, seen or not (EMotionFX keeps its
graph time running [read ActorInstance.cpp:282-292]); sound reads the phase and the glance must find them mid-stride.

Why no reduced pose rate: CPU pose work is microseconds (below), the palette is world-space, and re-posing a moved
instance resets pixel history [read render/src/renderer.cpp:2076-2085]. Not "15 Hz and under" as Unreal advises.

### 3d. Cost per character per frame (counted by reading; nothing run)
CPU, today's code, one figure:

| layer | runs | count | estimate [inferred] |
|---|---|---|---|
| `DrawnChaser::step` + chain springs | per tick, every chaser | 2 exp, a few trig, 4 spring exps [summary GC:243] | under 1 us a tick |
| stride clock (lap 1) | per tick | 1 multiply-add + `stride_step` (one pow) | under 0.2 us a tick |
| `arm_swing_solved` | per frame | 80 steps x (2 sin/cos, atan2, flare) [read model_rig.cpp:681-689] | 3-8 us |
| `gait_pose` legs, chain, `apply_motion` | per frame | ~2 legs FK, ~17 chain joints x ~4 trig [summary GC:231-234] | 2-5 us |
| floor probes | per frame | 2 Jolt raycasts [read stage.cpp:277] [2nd reader: WRONG cite. stage.cpp:277 only hands over the lambda; the two probes are the `for (int k = 0; k < 2; ++k)` at game/model_rig.cpp:439-441, calling world_app.cpp:120-128] | 1-5 us each, not counted at source |
| `Rig::palette` + floats | per frame | 18 swings, 53 joints, 3 heap allocations [read model_rig.cpp:322-376] [2nd reader: 53 joints is GR; the 18 aimed joints are not countable at these lines (the aims come from the joint map): UNSUPPORTED. Three vectors seen: pal, done, out] | 1-3 us |
| picture physics | per tick, T3 only | 22 bodies, 30/10 iterations [summary GP:88] | ~~tens of us a step (see 2b)~~ [2nd reader: UNSUPPORTED. 2b gives only a lower bound, "at least about 76 us a ragdoll a step", for a pile benchmark; no figure for a keyed 22-body ragdoll exists (GP:259-265)] |
| player `Body::pose` | per tick | 9 targets, 4 two-bone, up to 4 raycasts [summary GC:247-249] | 5-15 us a tick |

So a tier-A chaser without physics is about 10-25 us of CPU a frame; with physics at 240 Hz add 0.67 steps a frame
at 360 [inferred]. Cheap lever if wanted: `arm_swing_solved` depends on no phase, so it could be computed once a tick
and interpolated; not in lap 1 [ours].

GPU, from the one measure [inferred: linear in vertices, which is not checked]: 0.32 ms / 266k vertices = about
1.2 ns a skinned vertex, skin plus refit. Hunter 127,116 vertices about 0.15 ms; kid 139,125 about 0.17 ms [summary
GR:62-63 for the counts]. The rebuild in turn is a spike that lands on whichever mesh's turn it is; a p99 run must
see it [inferred].

Scene budget, hunter + player + 6 lesser chasers on stage [ours]:

| figure | vertices | GPU est. | CPU est. a frame |
|---|---|---|---|
| hunter, tier A + physics | 127k (today) | 0.15 ms | 25 us + 0.67 physics steps |
| player, tier A + physics (when built) | 139k (today) | 0.17 ms | 15 us + 0.67 steps |
| 2 nearest lesser, tier A + physics | 60k each (target) | 0.14 ms | 2 x (25 us + 0.67 steps) |
| 4 other lesser, tier B | 15k each (target) | 0.07 ms | 4 x 10 us |
| total | 446k (under T2) | about 0.54 ms | about 0.13 ms + 2.7 physics steps [2nd reader: the unit is muddled. The picture world is one world stepped once a tick (3a P1), so it is 0.67 steps a frame holding 4 ragdolls, not 2.7 steps. By 2b's own lower bound (76 us a ragdoll a step) that is at least 4 x 0.67 x 76 us = 0.2 ms, so the CPU total is at least about 0.33 ms, not 0.13. And the GPU 0.54 ms is an average, see T2] |

[inferred] This makes a modelling constraint: lesser chasers near 60k skinned vertices in full and 15k light. The
unlanded sprinter is 105,788 triangles [summary GR:90]; its vertex count was not read. The kid alone is half of
today's skinned vertices; `kid_lite.glb` (110,642 triangles) is the named lever [summary GR:26-27, :88].

### 3e. Where it sits, and how one layer serves all three
- Tier and clock state per id: `WorldApp::ease_poses` / `PoseEase` [read game/world/world_app.cpp:567-588;
  world_app.h:265-269], which already runs per tick for every chaser of every kind.
- Drawn values reach the stage through `ChaserPose` and `chaser_poses` [read world_app.h:79-95; world_app.cpp:539-560].
- The stage reads the tier in `WorldStage::place_figures` to pick the mesh and skip probes [read stage.cpp:256-317].
- Hunter: tier A always. A lesser chaser: the same `ChaserPose` path, ranked. The player: tier A always; its clocks are
  already per tick (`Body::tick`), so lap 1 changes nothing for it; its physics joins T3 when built.

## 4. The first lap

Smallest piece: one picture clock for the stride. Tier: prove it (the fault is invisible by eye and sits beside the
replay path) [ours].
- Move the stride phase out of `WorldStage` (`hunter_phase_`, stage.h:142; stage.cpp:269-270) into `PoseEase`, advanced
  in `ease_poses` by `speed * kTickDt * gait_phase_per_metre(rest, speed)`, kept before and after, and drawn in
  `chaser_poses` at alpha (unwrapped), as `ChaserPose::stride_phase` for every chaser [ours].
- `gait_phase_per_metre` needs the model's rest joints [read game/model_rig.h:333-335]; the stage hands them to the app
  once when the model loads (`set_gait_rest(kind, rest)`) [ours].
- [2nd reader: a hole in the placement. `ease_poses` starts `if (!ease_on_) return;` (world_app.cpp:568), and
  `set_ease_poses(false)` also clears `ease_` (world_app.h:131). The clip tool turns it off on alternate passes
  (offscreen_models.cpp:432), so the stride clock would not run in its "before" clips. It also runs in the Frozen branch
  (world_app.cpp:741-744) with the last speeds, so a standing chaser could keep cycling. Needs its own switch-free home.]
- Files: game/world/world_app.h, game/world/world_app.cpp, game/world/stage.h, game/world/stage.cpp,
  game/tests/world_app_tests.cpp, CHANGELOG.md. Not touched: game/model_rig.* (so no clash with l205-stomp-c, which
  touches only model_rig.* and its tests [summary GC:345-349]).
- Clash: `origin/l192-footsteps` d8f77ba edits the same stage lines [read l192 stage.cpp:258, :273-275, :683]. Land
  lap 1 first and rebase L192 to send `p.stride_phase`, so the footfalls follow a tick-domain phase [ours].
- Rows, registered before code [ours]:
  - `the_drawn_stride_is_the_same_at_144_240_and_360_frames_a_second`: the flee bot's record (self-test part 7's case)
    and his first kept run, each played three times through `advance` at 1/144, 1/240 and 1/360 s frames; at every
    instant common to the three (each 1/24 s) the hunter's `stride_phase` agrees within 1e-6 rad.
  - `paused_the_drawn_legs_stand_still`: 2 s of paused frames move the phase by 0.
  - Red today: step one moves today's rule unchanged (summed from the frame's delta) behind the same field, and both
    rows should go red [inferred: the frame sums differ by rate while it accelerates, and the pause still advances
    it]. Step two makes it per tick: green. The 16 kept runs stay identical and the self-test stays 52/52.
- Cost: under 0.2 us a chaser a tick; one lerp a frame [inferred].

## 5. What only his eye can decide

- Whether the light tier reads "lower quality but still decent" (his own words) and whether he sees a swap.
- Whether chasers behind look right the moment the glance lands.
- Whether physics dropped from a far chaser makes its arms look stiff.
Fewest clips: two, at full frame rate and lit, real time then 3x slower (his item 216 ruling [summary GR:159-161]),
each tiers-on beside all-full on the same kept run: (1) a chaser crossing from rank 3 to rank 2 in view; (2) V held
while three chasers round a corner behind. Both need a lesser model; until one lands, the hunter's model can stand
in, as his `run_frame-5` allows for the dark one [summary GW:554]. The sameness across frame rates needs no clip:
the row proves it.

## 6. What I would NOT build

- A dynamic budget allocator or any throttle that reads frame time: the picture would depend on machine load,
  failing 3a; and the CPU work it saves is tens of microseconds.
- Reduced-rate posing with interpolation (Unreal URO, O3DE's sampling rate) for drawn figures: little CPU to save,
  and with world-space palettes it freezes figures or resets their pixel history (2a).
- Skipping BLAS updates for figures in view (NVIDIA's on-screen-size idea): ray-traced shadows and reflections would
  show stale bodies. Measure first.
- Culling a chaser's clocks when unseen (Unity's CullCompletely): sound reads the phase and the glance must find them
  mid-stride.
- Jolt sleeping or `GetActiveBodies` as the active set: its order is not deterministic [read Architecture.md:807].
  Use the explicit ranked set T3.
- SoA, SIMD or threaded pose jobs: 22 joints and under ten figures (the runtimes scout agrees [summary
  scout_runtimes.md:130]). Clip compression or sampling caches: there are no clips.
- Turning off Jolt's cross-platform determinism for the picture world: the sim and the picture share one library build
  (`set(CROSS_PLATFORM_DETERMINISTIC ${DZ_JOLT_DETERMINISTIC} ...)` [read third_party/CMakeLists.txt:9]); the 8% is
  not worth a second build [inferred].
- Before any of this grows past the hunter and the player: run R4.7 and one GPU bench with three or more posed models.
  Every CPU figure above is a count, not a time.

## What I did not open

- The chart pages of Jolt's multicore paper (no renderer here); the paper's absolute steps a second.
- Any Unreal, Unity or NVIDIA source code; the Unreal Budget Allocator's significance code.
- O3DE's MultiThreadScheduler and ActorInstance LOD code beyond the lines cited.
- E's clone `worktrees/dz3-e-l185` (the soft-key ragdoll code); the l192 audio files beyond the stage lines.
- `game/model_rig.cpp` bodies of `running_leg`, `kinetic_chain`, `swing`; `body.cpp`; `sim/` and the raycast cost.
- hunter.glb and kid.glb beyond the ground file's counts; sprinter.glb and kid_lite.glb vertex counts.
- The other scouts' files except the summary lines of scout_secondary_and_physics.md and scout_runtimes.md.
- The brief itself: his words are quoted from GW and GR, which give their lines.

## Second reader

Adversarial read, 2026-11-13. Primaries opened: the game at main 31d1c6d (and `git show` of l205-stomp-c and origin/l192-footsteps
d8f77ba), the Jolt submodule v5.6.0, the D663 handback, brief lines 1274-1276 and 1569-1577, and, downloaded with curl and read as
text, O3DE (LICENSE.txt, SingleThreadScheduler.cpp, ActorInstance.cpp and .h), Unreal's two doc pages, Unity's AnimatorCullingMode
page, Godot 4.3's AnimationMixer.xml, LICENSE.txt and the physics-interpolation page, the godot-docs LICENSE.txt, NVIDIA's blog
page, and Jolt's multicore PDF (pdftotext). Line numbers the scout gives into the other scouts' files have drifted since those
files were edited by their own second readers; the claims match, so they are not counted.

| line | claim | primary opened | verdict | evidence |
|---|---|---|---|---|
| 4, 227 | 1.2 ns a skinned vertex from D663 | handback :134-139 | DOWNGRADED | vertex count is "inferred" at :139; 0.32 ms holds refits, rebuild, TLAS build |
| 26-27 | 266k vertices, 343k triangles [read] | handback :139, GR:25-26 | DOWNGRADED | the source marks them inferred |
| 24-27 | +0.39 avg, +0.48 p99, 0.32 top-level | handback :134-138 | OK | same numbers |
| 28-29 | no per-character CPU time exists | GP:259, GL:313 | OK | "No per-character per-frame time has been measured" |
| 45-47 | sound reads phase only on l192 d8f77ba | git log, l192 stage.cpp, `git grep` main | OK | main has no `set_hunter_stride`; l192 :273-275, :683 |
| 57-58 | frame dt clamp 0.0001-0.25; sim cut at 0.1 s | main.cpp:188, loop.h:22, stage.cpp:650 | OK | all three lines match |
| 59-62 | paused: no tick, draw still runs, legs cycle | shell.cpp:156, main.cpp:188, world_app.cpp:539-545 | OK | reading holds; not run |
| 63-65 | ticks exactly floor(t x 240) at shared instants | loop.h:7-8, offscreen_models.cpp:29 | DOWNGRADED | 1/144 s is not whole ns; "same bits" fails, 1e-6 holds |
| 66 | `DrawnChaser::step(..., kTickDt)` for every chaser | world_app.cpp:578 | OK | line as quoted |
| 67-68 | gait_pose has no frame state on l205 | `git show l205-stomp-c:game/model_rig.cpp` | OK | only `DrawnChaser` holds `last_pos` (:484) |
| 69-70 | glance eased by exact exponential, dt clamped | shell.cpp:164-165 | OK | 0.0005-0.033 clamp |
| 71-73 | clip tool draws at 1/144 inside windows | offscreen_models.cpp:30, :457-462 | OK | `if (i + 72 < s.from ...) continue` |
| 74-80 | no reduced-rate posing: history resets | renderer.cpp:1970-2013, :2076-2085 | OK | stronger: `posed == frame` also needed |
| 81-82 | one palette copy and dispatch per mesh | renderer.cpp:1959-1966, :1990-1998 | OK | RE-DERIVED vs GC:233 "SetSkinPalette per mesh" |
| 83-84 | arm solve 2 x 40 steps | model_rig.cpp:667-690 | OK | RE-DERIVED vs GC:231-232 (same count) |
| 87-88 | Jolt licence MIT | JoltPhysics/LICENSE:1-3 | OK | MIT text; commercial use, notice kept, no share-alike |
| 89 | stable at 60 Hz with 1 collision step | Architecture.md:740 | OK | RE-DERIVED vs the physics scout's row, which cites :740 |
| 90-93 | determinism rules, GetActiveBodies, one world each | Architecture.md:789, :804, :807, :853-856 | OK | quotes match |
| 94-96 | solver overrides, defaults 10 and 2, island max | BodyCreationSettings.h:114-115, PhysicsSettings.h:84, :87 | OK | RE-DERIVED vs GP:88 "Jolt default 10 and 2" |
| 95-96 | sleep 0.5 s below 0.03 m/s | PhysicsSettings.h:95, :102 | OK | values match |
| 97-98 | SkeletonMapper low to high detail | SkeletonMapper.h:12 | OK | comment matches |
| 99-100 | 16 piles of 10 ragdolls, 3680 bodies | PerformanceTest.md:8 | OK | scout cites :7, the line is :8 |
| 101-105 | 4.9x at 8 threads; at least 76 us a ragdoll | multicore pdf :59-60, :124-150 | DOWNGRADED | two graphs mixed; piles of contacts, 2017-21 CPUs |
| 107-109 | O3DE dual licence | LICENSE.txt:2-4 | OK | Apache-2.0 or MIT at the user's option; the two texts not read |
| 110-113 | sampling timer, output only if visible, rate 0 = every frame | SingleThreadScheduler.cpp:86-108, ActorInstance.h:901 | OK | call and comment match |
| 115-117 | graph time advances before the output test | ActorInstance.cpp:282-292 | OK | `Update` runs, then `if (updateJointTransforms && sampleMotions)` |
| 121-123 | URO "15Hz and under"; then recommends the allocator | Unreal Animation Optimization page | OK | both sentences present |
| 123-126 | allocator favours closest meshes; BudgetMs 1.0 to 2.5 | Unreal allocator page | OK | "closest, most significant meshes"; 1.0, 1.5, 2.0, 2.5 |
| 130-132 | Unity culling modes and quotes | Unity AnimatorCullingMode page | OK | both quotes present |
| 135-141 | Godot PHYSICS mode; fixed tick; licences | AnimationMixer.xml:357, physics_interpolation_introduction.rst:87-88, both LICENSE files | OK | engine MIT, docs CC BY 3.0 |
| 144-150 | NVIDIA LOD, visible-only BLAS, distribute rebuilds | NVIDIA blog page | OK | four quotes found |
| 186 | his "nearest two or three full detail" gives 2 lesser full | brief:1274-1276 | DOWNGRADED | his note: "hunter full detail, the rest can be lower"; table has four in full |
| 187 | 500k vertices is half the room | handback :134-136, GR:31 | DOWNGRADED | average, not p99; at p99 about 0.9 ms of 1.2; may double-count both models |
| 216 | floor probes: 2 raycasts [read stage.cpp:277] | stage.cpp:277, model_rig.cpp:439-441 | WRONG | probes are in model_rig.cpp:439-441; stage.cpp:277 is the lambda |
| 217 | palette: 18 swings, 3 allocations | model_rig.cpp:322-376 | UNSUPPORTED | 18 not countable there |
| 220 | picture physics "tens of us a step" | 2b, GP:259-265 | UNSUPPORTED | only a lower bound exists; the scene total drops physics from ms |
| 258-262 | stride clock lives in `ease_poses` | world_app.cpp:567-568, :736-744, world_app.h:131, offscreen_models.cpp:432 | DOWNGRADED | early return when eased off; clip tool turns it off |

Tally: 37 rows. OK 27, DOWNGRADED 7, UNSUPPORTED 2, WRONG 1. Some rows group two or three of the scout's lines. RE-DERIVED: 4
(the rows for lines 81-82 vs GC:233, 83-84 vs GC:231-232, 89 vs the physics scout's row, 94-96 vs GP:88). The scout cites the
first two grounds in its own table and the last two as summary, so none is hidden, but section 2 should not call them new.

The simplest way to pass the first lap's rows without doing what they are for:
- Row 1 samples only instants every 1/24 s, which are tick boundaries (alpha 0). A stride that advances per tick and is drawn
  from the latest tick with no interpolation passes it, yet at 144 and 360 frames a second the legs would hold for 1 or 2 frames
  in 3. No instant between ticks is sampled, so "drawn at alpha, unwrapped" is untested. Add a row that compares the three
  rates at offsets of 1/48 s within one tick's phase, and one that the phase moves on every frame at 360.
- Row 1 reads `ChaserPose::stride_phase`, not what the stage draws. Leave `hunter_phase_` driving the legs and the row stays
  green. It needs a check that the palette uses the field, or that `hunter_phase_` is gone.
- A phase stuck at 0 passes both rows if the hunter's speed is 0 at the sampled instants. The row should assert the phase
  moved by at least a radian.
- Whole-ns frame lengths (6,944,444 and so on) can fail the 1e-6 rad row for the wrong reason; build the schedule from
  `round(i * 1e9 / rate)`.

Mechanisms with no source and no [ours] mark: none found in section 3; tiers, T1-T4 and the drop order carry [ours]. One gap
in the sourcing: "never drop the clocks" borrows O3DE for graph time only; O3DE also skips the ragdoll update for a hidden actor
(ActorInstance.cpp:288-290), which the scout did not report. The "8%" in section 6 is GP:262's figure, unmarked here.

What I could not check: the chart values of Jolt's paper (text only, no renderer); the Apache-2.0 and MIT texts beyond the
O3DE LICENSE.txt that points to them, and Epic's and Unity's terms (idea only, none proposed); the number of aimed joints in
the rig (18); any timing on this machine (rule 1); the sprinter and kid_lite vertex counts; whether D675's default frame
already includes both models (that bench handback was not opened).

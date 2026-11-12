# p-l183-physics-anim-E: a physics engine that drives the procedural animation (his item 158). Pane E, on L, 2026-11-12, written from 04:0x local (`date`)

**Packet:** the chair's L183, 09:58:19Z. **Plan:** `loop/plan_l183_physics_driven_animation_2026-11-12.md` (2570adc1), read whole.
**His words:** `briefs/dreamzone2_the_game.md` items 146, 147, 151, 152, 156, 158, and 159 (added: it asks for the body to touch the world).
**Research only; nothing built.** dreamzone-3 was read at main `add21fe`, read only; Jolt is the pinned submodule `v5.6.0`.
**Marking:**
- **[read]** is the source's own text or code, at the path or line given, with its licence or terms;
- **[press]** is a third party describing a product;
- **[inferred]** is mine;
- **[ours]** is dreamzone-3's code.

## Sources and their terms

"l.N" for a paper is the line of my `pdftotext` output (SIMBICON with `-layout`; Geijtenbeek and DeepMimic without). These are not page numbers; each quote is given verbatim so it can be found by search.

| source | what I read | licence / terms |
|---|---|---|
| Jolt Physics v5.6.0 (`third_party/JoltPhysics`) | `Ragdoll.h:160-215`, `Ragdoll.cpp:647-724`, `MotorSettings.h`, `Docs/Architecture.md:785-850`, `README.md:67-71`, `Samples/Tests/Rig/PoweredRigTest.cpp`, `SoftKeyframedRigTest.cpp`, `PerformanceTest/RagdollScene.h`, `Assets/Human.tof` | **MIT** (`LICENSE`, © 2021 Jorrit Rouwe) |
| Overgrowth (WolfireGames/overgrowth, `main`) | `Data/Scripts/aschar.as:4850-5110` (the ragdoll state), `Source/Objects/riggedobject.cpp:1265-1295` | **Apache-2.0** (GitHub licence field). Code only; the art is not open. |
| SIMBICON (Yin, Loken, van de Panne, SIGGRAPH 2007), author PDF, ubc.ca | the whole paper (pdftotext) | © ACM; the authors' copy. Cited, not copied. |
| Geijtenbeek and Pronost, "Interactive Character Animation Using Simulated Physics: A State-of-the-Art Review", CGF 31(8), 2012, author PDF | the whole paper (pdftotext) | © 2012 the authors, the Eurographics Association and Blackwell. Cited, not copied. |
| DeepMimic (Peng et al., SIGGRAPH 2018), arXiv 1804.02717 | the whole paper (pdftotext) | arXiv preprint, © the authors; its code repository (xbpeng/DeepMimic) is **MIT**. |
| Techland, "All about zombies", 2025 | **not re-read**: quoted from C's `handback/p-l179-talks-C_2026-11-12.md:64` | © Techland S.A. |
| NaturalMotion Euphoria (GTA IV) | **press only**: bit-tech's report of a GI.biz interview with T. Reil; MCV; Game Developer | press. **No developer text found.** |

## 1. What a physics-driven body is, in the sources

**One structure, in every source that says how:** an animation (or procedure) makes a **target pose**; per-joint controllers pull a simulated body toward it; the physics adds what the target did not plan for.
- **[read] Geijtenbeek §3, l.319-320:** "Joint-space motion control attempts to control physics-based characters by providing kinematic target trajectories, which are tracked using local feedback controllers". It is "the most well-studied approach" (l.443).
- **[read] Jolt:** `DriveToPoseUsingMotors(pose)` sets each constraint's swing/twist (or hinge) motor to `Position` with `SetTargetOrientationBS(joint_state.mRotation)` (`Ragdoll.cpp:647-680`). The second form also drives a target angular velocity from the previous and current pose (`:682-724`). `DriveToPoseUsingKinematics` sets velocities on dynamic bodies instead (`Ragdoll.h:181`). The soft-keyframed sample cancels gravity and lets collisions push it off the pose (`SoftKeyframedRigTest.cpp:46-91`). **README.md:67-71** names the three modes: hard keying, soft keying, and motors.
- **[read] DeepMimic l.172:** "The action a from the policy specifies target orientations for PD controllers at each joint." The policy runs at 30 Hz and the physics at 1.2 kHz (l.672).
- **[read] Overgrowth:** the animation output's **per-bone physics weights** times a script-set `ragdoll_strength` set each joint's strength toward the animated frame (`riggedobject.cpp:1276-1293`). The script sets that strength from speed: `min(0.8, |v| × 0.1)` while falling, and "fades the longer character is unconscious" (`aschar.as` `SetActiveRagdollFallPose`). The target poses are animations (`r_flail`, `r_catchfallfront`, `r_fetal`, `r_writhe`, `SetRagdollType`).
- **[inferred]** So "a physics engine that drives the procedural animation" is, in the sources, the other way round: **the procedural animation drives a physics body.** The kinetic chain (L181) and the sourced signals (L180) would be the target pose, and Jolt's motors would follow it. That is item 158's idea, built the way every source builds it.

## 2. The hard part, which every source names: balance

- **[read] Geijtenbeek l.83:** "global position and orientation are unactuated … physics-based characters are less reactive during direct control tasks than kinematics-based characters." l.426: errors in global translation and orientation "accumulate, eventually leading to loss of balance".
- **[read] Jolt:** the motors drive each joint **relative to its parent** only (`Ragdoll.cpp:657-668`). The root is placed by `GetRootTransform` from the bodies (`PoweredRigTest.cpp:78-81`). Nothing in Jolt keeps a powered ragdoll upright. inferred from the code, not run: the "sprint" test animation on a free ragdoll has no balance controller.
- **[read] SIMBICON:** balance comes from a state machine with torso and swing hip held in the **world** frame, and a foot-placement feedback `θd = θd0 + cd·d + cv·v` (§3.1-3.3, l.138-176). Its ODE time step is 0.005 s, with kp up to 1000 at the waist and 300 elsewhere, kd = 0.1 kp (l.344-350). Its own limit: "the torso may exhibit a somewhat unnatural bobbing motion … always reacting to the motion of the hip, rather than anticipating it" (l.194-197).
- **[read] DeepMimic:** balance is learned: "about 60 million samples … about 2 days on an 8-core machine" per skill (l.964), "several days per skill" (l.762).
- **[read] Shipped games:**
  - **Overgrowth** puts the ragdoll on **only in the ragdoll state** (falls, knockouts and injuries), and wakes back to animation (`WakeUp`, `HandleRagdollRecovery`). Upright running is not physics-driven there.
  - **Techland** (via C): "bodies continue to react to momentum **even after being struck**".
  - **Euphoria** [press]: the GTA IV drunk walk was "synthesized" rather than played from animation. SIMBICON calls such systems "undocumented strategies [NaturalMotion 2006]" (l.120), and Geijtenbeek calls them "proprietary algorithms" (l.198).
- **[read] Geijtenbeek l.21:** "commercial frameworks still resort to kinematics-based approaches when it comes to animating active virtual characters."
- **[inferred]** **The sources agree on where physics pays: reactions.** Hits, stumbles, falls, an arm meeting a wall, momentum after a stop; Geijtenbeek l.623: "Physics-based characters thrive during unexpected interactions." **They do not agree that upright running should be physics-balanced.** Only research controllers (SIMBICON, DeepMimic) do it, and at a cost (tuning, or days of training per skill) that no shipped game in this list paid for locomotion.

## 3. Determinism, and the split that keeps the game fair

- **[read] Jolt `Architecture.md:787-790`:** deterministic "provided that" API calls run "in exactly the same order" and "the same binary code is used". **`:792`:** `CROSS_PLATFORM_DETERMINISTIC` makes it deterministic across compilers and machines at "approximately 8% slower". **Caveats, `:804-807`:** broadphase queries, listener callback order and `GetActiveBodies` order are **not** deterministic.
- **[ours] dreamzone-3 already builds Jolt with `CROSS_PLATFORM_DETERMINISTIC` ON** (`third_party/CMakeLists.txt:7-9`, `DZ_JOLT_DETERMINISTIC`, "leave it on").
- **[ours] The sim never steps a Jolt `PhysicsSystem`.** `sim/physics.cpp` is "the only file in the project that talks to Jolt" (:1). It uses the system as a collision world for `CharacterVirtual::ExtendedUpdate` (:476) and shape casts (:563). A grep for `.Update(` in it finds only `ExtendedUpdate`. **A ragdoll needs `PhysicsSystem::Update`, which nothing calls today.**
- **[inferred] So:**
  - **Picture only (the default, kept):** the powered ragdolls live in a **separate** `PhysicsSystem` owned by the renderer side, fed the world's nearby boxes and stepped after the sim tick. They read the sim (pose targets, chaser positions) and write nothing back. The chase, the catch and the replays cannot change, and if their order of updates drifted, only the picture would differ.
  - **Touching the game:** it would mean stepping a `PhysicsSystem` inside the 240 Hz sim tick, in a fixed order, with no listener-ordered logic, and replaying it bit-exactly. **The Jolt docs say this is possible** (`:787-792`). **No source I read shows a shipped game doing it for a character's locomotion**, and the caveats at `:804-807` are exactly where catch logic would be tempted to look (contacts, overlap queries). **Not shown, so not recommended;** the packet's default stands.
  - **The one place it must stay picture only: the player's own body.** It cannot drive the camera or the controller. Geijtenbeek l.83 says why ("less reactive during direct control"). His movement is the game.

## 4. His reports against what a physics-driven body would change

| his report | what a powered ragdoll (picture only) would change | source | [inferred] verdict |
|---|---|---|---|
| **146**: the hunter's lean is "glitchy back and forth not smooth into turns" | Motors with finite stiffness **low-pass** the target: a jittering target becomes a smoothed body | Jolt `MotorSettings` (frequency, damping, torque limits, `MotorSettings.h:48-63`); Overgrowth's strength scaling | **Treats the symptom.** The cause was the target (the path, item 157; A's sway out of the chase). A spring on a bad target lags it, which is item 151's complaint. |
| **151**: "it will turn, and then lean, not lean into the turn" | **Makes it worse** if the lean comes from physics alone: a body reacting to acceleration leans **after** it | SIMBICON l.194-197 ("always reacting … rather than anticipating") | The lead must come from the **target** (look-ahead, L180's sourced tilt). Physics can only follow. |
| **152 / 156**: "the overall animation needs a hard rework … the whole body work as one" | Momentum through the chain for free: a pelvis stop carries up the spine, and the arms swing on | Jolt constraints; Techland's "react to momentum" (via C) | **Yes, as a layer** under L181's chain. The chain still sets the pose; the bodies add the follow-through his first game faked with springs (item 156's [KINETICS]). |
| **147**: look-back "clips into the characters neck and shoulder" | None: that is the camera against the first-person body's geometry | — | **Not physics.** It needs the camera clipping fixed, or the neck/shoulder hidden when looking back. |
| **159**: hands touching walls, feet crossing, walking backwards | The arms meet a wall and are pushed back by contact, rather than passing through it | Jolt soft-keyframe sample ("Bar to hit head against", `SoftKeyframedRigTest.cpp:40-91`) | **Yes, for the arms against the world**, picture only. The feet crossing and the backwards walk are the target's job (gait), not physics. |
| hits, catches, a chaser's stop at a wall, a fall down a shaft | A body that reacts to the impact rather than snapping | Overgrowth's ragdoll state; Techland's active ragdolls; Euphoria [press] | **The best-sourced use.** Every shipped source uses physics here. |

## 5. Cost (read from Jolt and ours, not timed: no timing runs on L)

- **[read] One Jolt "Human" ragdoll:** 23 `SwingTwistConstraintSettings` in `Assets/Human.tof` (grep count), so about 24 bodies. Each motor is one constraint row set in the solver.
- **[read]** Jolt's own ragdoll performance scene: 4 × 4 piles of 10 = **160 ragdolls with motors** on a Horizon Zero Dawn terrain (`PerformanceTest/RagdollScene.h:20-24`, `PerformanceTest.cpp:83`). It is a benchmark scene, not a number for our machine.
- **[ours] Our body is 21 joints with positions only** (`game/body.h:38-46`: Eye … ToeR, `std::array<Vec3, kJointCount>`). Jolt's ragdoll wants a `Skeleton` with **rotations** per joint. **A mapping layer is needed** (about 13-15 capsules, from the segment pairs the rig already aims, `model_rig.h:4-8`) before any motor can be driven.
- **[inferred] Bodies:** the hunter (1), up to 8 lesser chasers (`lesser_max` limit 8, `dials.h:39`, my L170 hand-back), packs of 3, and the player's own body: about 10-12 ragdolls of about 14 bodies in a separate system, stepped at a rate of its own (not necessarily 240 Hz). It is well under Jolt's own 160-ragdoll scene. **Only a timed run on the desktop says what it costs here.**
- **[inferred]** CROSS_PLATFORM_DETERMINISTIC's ~8% (`Architecture.md:792`) is already paid; a picture-only system could be built without it, but it is one library flag for both.

## 6. The first build step the sources agree on

**[inferred, from §1-§4]:** **a picture-only powered ragdoll for reactions, behind the kinematic target, starting with ONE body and ONE event.**
1. **A rotation skeleton for the 21-joint body** (the mapping layer of §5). Without it nothing else can start. It is pure `game/` code, testable without physics (pose → rotations → pose round-trips).
2. **A separate `PhysicsSystem` in `game/`**, with the hunter's ragdoll in it, **hard-keyed** (kinematic) to the procedural pose every frame. It should be invisible: the picture is identical to today. **Test:** pixel-equal or pose-equal against the current hunter. This is the "it changes nothing" step.
3. **One reaction, soft-keyed:** the catch (or a chaser hitting a wall), blended to motors for about 1 s and back, like Overgrowth's state and wake-up. **Test:** the sim's replay of a run is byte-identical before and after, because the ragdoll writes nothing back.

**Where the sources disagree, both, for him:**
- **(a) Reactions only (Overgrowth, Techland, Euphoria as reported, Geijtenbeek l.21):** physics for hits, falls and contact; upright running stays the kinematic chain (L180/L181). Shipped, cheap, and it does not fight item 151's lead.
- **(b) Physics-balanced locomotion (SIMBICON, DeepMimic):** the whole run is simulated and balanced. It gives the most "real" weight, but by the sources' own words it is reactive rather than anticipating (SIMBICON), costs days of training per skill (DeepMimic), or needs tuning "often poorly documented" (Geijtenbeek l.71). Research, not shipped, in what I read.
- **My lean is (a).** It is the only one with a shipped source, and the only one that leaves item 151's "lean into the turn" in the target where it can lead.

## NOT verified

- **Not run:** no Jolt ragdoll was built or stepped; the determinism and cost claims are the docs' and the code's, not measured. Jolt's samples were read, not run.
- **Techland** is C's reading, not re-read. **Euphoria** is press only.
- **DeepMimic and SIMBICON** were read as text; their videos were not watched.
- The Human.tof body count is a grep of constraint settings (23), not a load of the file.

## Corrections

- None.

NEXT: librarian put §6's (a)/(b) to him with the first step, when this pointer is read.

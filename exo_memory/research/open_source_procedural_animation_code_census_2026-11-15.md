# A census of open-source code for procedural character animation (a research agent's report, 2026-11-15)

Filed by the librarian on D at his word of 13:29 ("should be everything open source we can access for proc gen animationn techniques etc"). **This is an agent's report, filed whole. The librarian has opened none of the repositories.** The request carried nothing of the game.

The agent catalogued 35 open-source projects, 34 with licence and core files confirmed; the 35th is a paper reference whose code cannot be downloaded. Its judgment: the strongest C++ sources are rbfx's IK module (humanoid IK with foot locking), Esoterica's animation graph (foot IK, orientation warp, powered ragdoll) and cartwheel-3d (a SIMBICON-family walking controller). Rune Skovbo Johansen's LocomotionSystem (C#, MPL-2.0) has the most complete planted-foot logic. Most other code is Unity C# or Godot: read for the rules, not to lift.

**Two cautions from the agent before citing:**
- **Licence edge cases.** Three repositories have no licence file ("none" below), which by default means all rights reserved: read them, do not copy them. Unity's Animation Rigging package is licensed only for projects built on Unity, and Flax is under its own EULA. Where GitHub's licence field and the repository's own file disagree, both are given.
- **"[read]" means a summarising fetch of that file**, not a line-by-line reading. Bugs it reports (marked "reported") have not been confirmed by hand.

Area numbers: 1 locomotion, 2 upper body, 3 physics, 4 traversal, 5 creatures, 6 data-driven, 7 engines and frameworks.

**Already on the shelf, not re-described:** Overgrowth, Godot, ozz-animation, O3DE (EMotionFX), Bevy, AI4Animation, Spring-It-On, Motion-Matching, Jolt, Source SDK, mpfb2.

## Catalogue

### IK libraries and engine modules

1. **TheComet/ik**, https://github.com/TheComet/ik. MIT. C89 with Python bindings. Areas 1, 2. Files: `ik/src/solver/FABRIK/solver_FABRIK.c`, `ik/src/solver/TWO_BONE/solver_TWO_BONE.c`, `ik/src/solver/ONE_BONE/`, `ik/src/solver/MSS/`. FABRIK over a tree of chains; child chains' solved bases are averaged (multiple effectors on one skeleton); up to 20 iterations, tolerance 1e-3; joint rotations rebuilt from solved positions. Reported: the constraint calls are commented out, and the tolerance check never ends the loop early. [read]
2. **FedUni/caliko**, https://github.com/FedUni/caliko. MIT. Java. Areas 1, 2. Files: `caliko/src/main/java/au/edu/federation/caliko/FabrikChain3D.java`, `FabrikStructure3D.java`, `FabrikJoint3D.java`. FABRIK with ball (cone) joints and local or global hinges with clockwise/anticlockwise limits, plus base-bone constraints; stops within the distance threshold or when a pass changes less than 0.01; keeps the best of up to 20 attempts. The best-documented constrained FABRIK here. [read]
3. **rbfx (Urho3D fork), IK module**, https://github.com/rbfx/rbfx. MIT. C++. Areas 1, 2, 7. Files: `Source/Urho3D/IK/IKLegSolver.cpp`, `IKStickTargets.cpp`, `IKSpineSolver.cpp`, `IKArmSolver.cpp`, `IKHeadSolver.cpp`, `IKLimbSolver.cpp`, `IKChainSolver.cpp`.
   - Leg solver: thigh/calf/heel a trigonometric chain, heel-to-toe a rigid segment; a `tiptoeFactor_` blends a flat foot toward a fully bent one; min/max knee angles, a heel target, a bend target, and a ground plane with heel-penetration recovery.
   - StickTargets (foot locking): targets hold their world pose until a position, rotation or time threshold is crossed, then blend back over `recoverTime_`; `maxSimultaneousRecoveries_` caps how many recover at once, and the start index rotates so no foot always goes first.
   - Spine: a chain bent with `maxAngle_` per joint, a weight curve (`bendTweak_`) and twist. [read: leg, stick and spine solvers; other files listing only]
4. **Esoterica**, https://github.com/BobbyAnguelov/Esoterica. MIT (third-party code keeps its own licences). C++. Areas 1, 3, 6. Files: `Code/Engine/Animation/IK/TwoBoneIK.cpp`, and in `Code/Engine/Animation/Graph/Nodes/`: `Animation_RuntimeGraphNode_FootIK.cpp`, `_OrientationWarp.cpp`, `_TargetWarp.cpp`, `_PoweredRagdoll.cpp`, `_SimulatedRagdoll.cpp`, `_TwoBoneIK.cpp`, `AnimationRootMotionWarp.cpp`.
   - FootIK registers a two-foot or two-bone IK task with a timed weight fade.
   - OrientationWarp finds the event window in a clip and slerps the rotation correction in across it, re-chaining the root-motion deltas after the window.
   - PoweredRagdoll: the ragdoll follows the animated pose, takes an optional impulse, and is blended back by a physics weight.
   - The transition node uses a plain BlendTask; no inertialization found. [read: FootIK, OrientationWarp, PoweredRagdoll, Transition; rest listing only]
5. **Wicked Engine**, https://github.com/turanszkij/WickedEngine. MIT. C++. Areas 2, 3, 7. Files: `WickedEngine/wiScene_Components.h` (InverseKinematicsComponent, SpringComponent, HumanoidComponent); systems in `wiScene.cpp`; ragdoll in `wiPhysics_Jolt.cpp`. IK: target entity, `chain_length`, `iteration_count`. Springs: stiffness, drag, wind and gravity, a hit radius, VRM springBone-style. Humanoid: head and eye look-at with max angles and speeds, ragdoll flags. [read: header; systems listing only]
6. **LumixEngine**, https://github.com/nem0/LumixEngine. MIT. C++. Area 7. Files: `src/animation/nodes.h`, `nodes.cpp`. Blend1D/2D, Select, Switch and a generic `IKNode`. No dedicated foot IK. [read: nodes.h]
7. **Flax Engine**, https://github.com/FlaxEngine/FlaxEngine. **Flax EULA, not open source** (free non-commercial; royalty over a threshold). C++. Area 7. File: `Source/Engine/Animations/Graph/AnimGroup.Animation.cpp`. Aim IK and Two Bone IK with a joint target and optional stretching. [read]
8. **Unity Animation Rigging** (read-only mirror), https://github.com/needle-mirror/com.unity.animation.rigging. **Unity Companion License: Unity-dependent projects only.** C#. Areas 1, 2. Files: `Runtime/AnimationJobs/ChainIKConstraintJob.cs`, `TwoBoneIKConstraintJob.cs`, `MultiAimConstraintJob.cs`, `DampedTransformJob.cs`, `TwistCorrectionJob.cs`. DampedTransform: weight = (1 − damp)², stepped at a fixed 60 Hz substep so the result does not depend on frame rate. [read: ChainIK, DampedTransform]
9. **three.js CCDIKSolver**, https://github.com/mrdoob/three.js. MIT. JavaScript. Area 2. File: `examples/jsm/animation/CCDIKSolver.js`. CCD from the effector's parent toward the root; per-step min/max angle, a single-axis limitation for hinges, Euler clamps, early exit, a slerp blend factor. [read]
10. **Babylon.js BoneIKController**, https://github.com/BabylonJS/Babylon.js. Apache-2.0. TypeScript. Area 2. File: `packages/dev/core/src/Bones/boneIKController.ts`. Analytic two-bone IK by the law of cosines in a frame built from the target and a pole; `maxAngle`, `poleAngle`, `slerpAmount`. [read]
11. **bevy_mod_inverse_kinematics**, https://github.com/Kurble/bevy_mod_inverse_kinematics. MIT OR Apache-2.0 (from Cargo.toml). Rust. Area 2. File: `src/solver.rs`. Iterative tip-to-root re-aim with a pole plane; no joint limits. [read]
12. **CCD-IK-Panda3D**, https://github.com/germanunkol/CCD-IK-Panda3D. MIT. Python. Areas 2, 7. [listing only]
13. **BioIK**, https://github.com/sebastianstarke/BioIK. **No licence.** Unity C#. Evolutionary multi-objective IK. [listing only]

### Locomotion and creatures

14. **runevision/LocomotionSystem**, https://github.com/runevision/LocomotionSystem. MPL-2.0 (file-level copyleft). C#. Areas 1, 2. Files: `Assets/Locomotion System Files/Locomotion System/LegAnimator.cs`, `MotionAnalyzer.cs`, `IK1JointAnalytic.cs`, `HeadLookController.cs`, `AlignmentTracker.cs`.
    - Blends walk cycles by velocity. Each leg has a cyclic stance time; the landing point is predicted from velocity, or along a circle when turning. Ground found with heel and toe raycasts that reject steep slopes and avoid ledges.
    - Pelvis: hip height combined from each leg's desired and maximum reach.
    - Body: ground-hug and acceleration tilt. Standing still: legs "park" when the step would be insignificant.
    - IK: two-pass leg IK, plus foot lift, liftoff, strike and land events.
    - Look-at: neck and head share the rotation half each, clamped to ±80° and slerped. [read]
15. **davidkimighty/tars**, https://github.com/davidkimighty/tars. MIT. C#. Areas 1, 3, 5. Files: `Runtime/Locomotion/LegLocomotion.cs`, `GaitSettings.cs`, `LegIK.cs`, `HipMotion.cs`, `Runtime/ActiveRagdoll/JointDrives.cs`. Each leg has a phase offset; swing starts when the phase passes the duty factor; the duty factor is raised so at least 3 legs stay planted. Targets predicted from velocity and acceleration over the time to touchdown, then a ground raycast. Heel-off pitch when the leg runs out of reach, a "catch step" at 1.05× chain length, and the clock held until a waiting foot steps. [read: LegLocomotion; rest listing only]
16. **jegor377/ProceduralWalk**, https://github.com/jegor377/ProceduralWalk. MIT. GDScript. Area 1. File: `player/player.gd`. A step is triggered when the foot is more than 0.3 m from a ground point offset ahead along velocity; sine-arc swing, legs alternate within a 0.5 s step, hips drop as stride spread grows. [read]
17. **PhilS94/Unity-Procedural-IK-Wall-Walking-Spider**, https://github.com/PhilS94/Unity-Procedural-IK-Wall-Walking-Spider. **No licence.** C#. Area 5. Files: `Assets/Scripts/IKStepper.cs`, `IKSolver.cs`, `IKChain.cs`, `IKStepManager.cs`. Step trigger: IK error over tolerance, target not grounded, or foot too close to the root. Target search: ordered prediction raycasts offset by velocity × step time; neighbouring legs blocked from stepping together. CCD about hinge axes; the foot aligns to the surface normal. [read]
18. **Sopiro/Unity-Procedural-Animation**, https://github.com/Sopiro/Unity-Procedural-Animation. MIT. C#. Area 5. Files: `Assets/Scripts/LegController.cs`, `Leg.cs`. Even- and odd-indexed legs alternate, forced when a tip is more than 0.7 from its target; the body placed at the mean tip position plus averaged normals × height. [read]
19. **chvmp/libchamp** (core of champ), https://github.com/chvmp/libchamp and https://github.com/chvmp/champ. BSD-3. C++. Area 5. Files: `leg_controller/phase_generator.h`, `leg_controller/trajectory_planner.h`, `body_controller/body_controller.h`, `kinematics/kinematics.h`. Fixed 0.25 s swing plus a configured stance; diagonal legs paired (trot). Swing a 12-point Bézier scaled by step length and height; stance a linear sweep with a cosine dip. Velocity does not change the timing. [read]
20. **CSIRO OpenSHC**, https://github.com/csiro-robotics/syropod_highlevel_controller. CSIRO licence (a BSD/MIT variant, no non-commercial clause). C++/ROS. Area 5. File: `src/walk_controller.cpp`. Any leg count; per-leg phase offsets set the gait; stride = (linear + ω×r) × on-ground ratio / frequency. Quartic Bézier swing in two halves matching velocity and acceleration at the joins. Per-bearing workspace limits give the speed caps; a least-squares walk plane is fitted; rough-terrain touchdown holds the foot on contact. [read]
21. **Bullet MotorDemo**, https://github.com/bulletphysics/bullet3. zlib. C++. Areas 3, 5. File: `examples/DynamicControlDemo/MotorDemo.cpp`. A 6-legged ragdoll whose hinge motors chase an open-loop sine; no balance feedback. [read]
22. **gedeschaines/JSimbicon**, https://github.com/gedeschaines/JSimbicon. **No licence file.** Java. Area 3. SIMBICON for a planar 7-link biped. [listing only]

### Physics-driven characters

23. **cartwheel-3d**, https://github.com/Banbury/cartwheel-3d. Apache-2.0. C++/Python. Area 3. No machine learning. Files: `Core/SimBiController.cpp`, `IKVMCController.cpp`, `VirtualModelController.cpp`, `BalanceFeedback.cpp`, `TwoLinkIK.cpp`, `PoseController.cpp`. A state machine advances phase by dt / stateTime and switches state on ground-reaction force. Balance feedback uses the centre-of-mass offset d and velocity v in a heading-invariant frame. Hips: PD on the root's orientation, the "makeup" torque split across the hips by stance-foot weight ratio. Code for Coros et al. 2010, *Generalized Biped Walking Control*. [read: SimBiController]
24. **xbpeng/DeepMimic**, https://github.com/xbpeng/DeepMimic. MIT. C++/Python. Area 3. Machine learning for the policy; the PD controller needs none. Files: `DeepMimicCore/sim/ImpPDController.cpp`, `PDController.cpp`, `CtPDController.cpp`. Implicit ("stable") PD: solve (M + h·Kd)·a = Kp·e + Kd·ė − C, then τ = Kp·e + Kd·(ė − h·a). Stable at high gains. [read]
25. **xbpeng/MimicKit**, https://github.com/xbpeng/MimicKit. Apache-2.0. Python. Area 3. Machine learning. [listing only]
26. **hairibar/Hairibar.Ragdoll**, https://github.com/hairibar/Hairibar.Ragdoll. MIT. C#. Area 3. No machine learning. Files: `Animation/Runtime/Core/RagdollAnimator/AnimationMatching.cs`, `RagdollAnimator.cs`, `Core/Runtime/Core/Settings/RagdollPowerProfile.cs`. Spring stiffness k = m·α/dt² and damping d = ζ·2√(k·m), so animation matching is tuned by a unitless α and a damping ratio; max force = max acceleration × mass. [read]
27. **ashleve/ActiveRagdoll**, https://github.com/ashleve/ActiveRagdoll. MIT. C#. Area 3. Files: `Assets/ActiveRagdollScripts/SlaveController.cs`, `AnimationFollowing.cs`, `MasterController.cs`. On contact, strength drops at 1/s; it regains at 0.05/s. Force and torque gains lerped from a 0.1 floor up to the maximum; death zeroes them for 4 s. The animated master is pulled back toward the physical slave by a clamped smoothstep. [read]
28. **sergioabreu-g/active-ragdolls**, https://github.com/sergioabreu-g/active-ragdolls. Apache-2.0. C#. Area 3. File: `active-ragdolls/Assets/Scripts/Active Ragdoll/Modules/PhysicsModule.cs`. Three balance modes: a kinematic "stabilizer" joint driving the torso, an upright torque curve on tilt angle, or frozen torso rotation. Reported: a setter bug in the stabilizer joint drive. [read]
29. **R3X-G1L6AME5H/Godot-Active-Ragdolls**, https://github.com/R3X-G1L6AME5H/Godot-Active-Ragdolls. MIT. GDScript. Area 3. File: `addons/ActiveRGR/Scripts/ActiveRagdollJoint.gd`. A 6DOF joint motor's target velocity = Euler(rotation error) × gain. [read]

### Traversal

30. **knela96/Dynamic-Parkour-System**, https://github.com/knela96/Dynamic-Parkour-System. MIT per its LICENSE file. C#. Area 4. Files: `.../Scripts/System Controllers/ClimbController.cs`, `VaultingController.cs`, `DetectionCharacterController.cs`, `Scripts/Vaulting Actions/*.cs`, `Scripts/Helpers/Climbing/HandlePoints.cs`. Ledge raycasts pick the nearest handle point; braced or free hang chosen by foot raycasts against the wall. Hand and foot IK targets from raycasts off the bones. The next ledge point chosen within 40° of input; shimmy validated by hand raycasts. [read: ClimbController]
31. **AitorSimona/Traverser**, https://github.com/AitorSimona/Traverser. MIT. C#. Areas 1, 3, 4. Procedural ledge climbing without annotations, vault, free hang, feet and aim IK, active ragdoll with blend profiles, linear and weighted motion warping. [read: README only]

### Secondary motion, springs and data-driven

32. **naelstrof/JigglePhysics**, https://github.com/naelstrof/JigglePhysics. MIT. C#. Area 2. File: `Packages/com.gator-dragon-games.jigglephysics/Scripts/JiggleJobSimulate.cs`. Verlet with velocity split into world-space and parent-relative parts, each damped separately. Constraints in order: collision, angle elasticity, length elasticity, angle-limit cone. The result is slerped onto the animated pose by `blend`. [read]
33. **detomon/wigglebone**, https://github.com/detomon/wigglebone. MIT per both LICENSE files (one asset-library page reportedly says AGPLv3; not verified). GDScript. Area 2. File: `addons/wigglebone/wiggle_rotation_modifier_3d.gd`. A closed-form undamped spring step plus exp(−damp·dt) decay; force becomes torque via direction × force; a swing-span cone with tangential sliding; dt clamped to 0.0001-0.1. [read]
34. **TheAllenChou/unity-cj-lib**, https://github.com/TheAllenChou/unity-cj-lib. MIT. C#. Area 6. File: `Unity CJ Lib/Assets/CjLib/Script/Math/NumericSpring.cs`. Implicit-Euler damped spring with denominator 1 + 2hζω + h²ω²; half-life and critically damped wrappers; the quaternion spring flips the target into the same hemisphere. The base for a "few key poses plus springs" approach. [read]
35. **JLPM22/MotionMatching**, https://github.com/JLPM22/MotionMatching. MIT. C#. Area 6. Files: `com.jlpm.motionmatching/Runtime/Inertialization/Inertialization.cs`, `Runtime/Core/MotionMatchingSearch/BVHMotionMatchingSearch.cs`, `Runtime/Features/FeatureSet.cs`, `Runtime/IK/TwoJointIK.cs`. Inertialization: offset = (source + offset) − target, decayed by an implicit spring damper with a half-life. Search: BVH or linear. [read: Inertialization; rest listing only]

## (a) Ten to read in full for a humanoid runner (planted feet, trunk, arms, physical reactions), the agent's order

1. **runevision `LegAnimator.cs`**: the most complete semi-procedural loop in one file (step prediction, heel/toe ground fit, hip height, tilt, parking).
2. **rbfx `IKLegSolver.cpp` and `IKStickTargets.cpp`**: C++ MIT foot IK with tiptoe and knee limits, and foot locking with staggered recovery.
3. **Esoterica FootIK, OrientationWarp and PoweredRagdoll nodes**: how a task-based C++ graph wires IK, warping and ragdoll blending.
4. **cartwheel-3d `SimBiController.cpp` and `IKVMCController.cpp`**: non-ML biped balance (centre-of-mass feedback, root torque split over the hips).
5. **DeepMimic `ImpPDController.cpp`**: the stable-PD formula for a powered ragdoll at high gains, no ML required.
6. **tars `LegLocomotion.cs`**: phase and duty factor, predictive foot targets, heel-off and catch-step, holding the clock for a waiting foot.
7. **Hairibar `AnimationMatching.cs`**: gain parameterisation that does not depend on mass or time step, for pose following.
8. **ashleve `SlaveController.cs`**: a simple, tunable rule for losing strength on hit and regaining it during get-up.
9. **unity-cj-lib `NumericSpring.cs`** (with JLPM22 `Inertialization.cs`): stable springs for key poses, trunk lean, arm swing and transitions.
10. **JigglePhysics `JiggleJobSimulate.cs`**: Verlet secondary motion with an explicit blend back onto animation.

## (b) Looked for, not found as usable open source

- **The original footskate cleanup.** The Wisconsin Footskate Solver has a documentation page with no download and no licence stated. InterDigital's UnderPressure exists but uses learning; not verified.
- **A maintained 3D SIMBICON in modern C++** other than the 2010 cartwheel-3d. JSimbicon is planar, Java, no licence file.
- **Procedural breathing, and a key-poses-plus-springs runner** beyond Overgrowth: none found.
- **Non-ML physical stumbling or step recovery:** only strength-ramp heuristics (ashleve) and tars' catch step.
- **Procedural stair handling as its own module:** only general ground raycasts (runevision, tars).
- **A Godot open-source climbing system:** none found.

## (c) What the agent opened

Repository pages: github.com/TheComet/ik; github.com/FedUni/caliko; github.com/BobbyAnguelov/Esoterica; github.com/turanszkij/WickedEngine; github.com/Banbury/cartwheel-3d; github.com/nem0/LumixEngine. GitHub's API (metadata, trees or contents) for every repository catalogued above, and for vrm-c/UniVRM (404 or truncated, dropped) and dartsim/dart.

Raw source files it fetched: Esoterica's FootIK, OrientationWarp, PoweredRagdoll and Transition nodes; WickedEngine `features.txt`, `wiScene_Components.h`; cartwheel-3d `SimBiController.cpp`; TheComet/ik `solver_FABRIK.c`; caliko `FabrikChain3D.java`; LumixEngine `nodes.h`; runevision `LegAnimator.cs`, `HeadLookController.cs`; the spider's `IKStepper.cs`, `IKSolver.cs`; sergioabreu-g `PhysicsModule.cs`; ashleve `MasterController.cs`, `SlaveController.cs`; Unity Animation Rigging `LICENSE.md`, `DampedTransformJob.cs`, `ChainIKConstraintJob.cs`; JigglePhysics `JiggleJobSimulate.cs`; JLPM22 `Inertialization.cs`; Traverser `README.md`; Dynamic Parkour System `LICENSE`, `ClimbController.cs`; ProceduralWalk `player.gd`; libchamp `phase_generator.h`, `trajectory_planner.h`, `LICENSE`; three.js `CCDIKSolver.js`; Babylon.js `boneIKController.ts`; rbfx `IKLegSolver.cpp`, `IKStickTargets.cpp`, `IKSpineSolver.cpp`; Flax `LICENSE.md`, `AnimGroup.Animation.cpp`; Sopiro `LegController.cs`; Bullet `MotorDemo.cpp`, `LICENSE.txt`; Hairibar `AnimationMatching.cs`; Godot-Active-Ragdolls `ActiveRagdollJoint.gd`; unity-cj-lib `NumericSpring.cs`; DeepMimic `ImpPDController.cpp`; OpenSHC `LICENSE`, `walk_controller.cpp`; wigglebone `wiggle_rotation_modifier_3d.gd`, `LICENSE`; bevy_mod_inverse_kinematics `Cargo.toml`, `solver.rs`; tars `LegLocomotion.cs`.

Other pages: flaxengine.com/licensing; research.cs.wisc.edu/graphics/Gallery/FootskateSolver/footskate.html.

Search-only leads, not opened and so not catalogued: unitycoder/Traverser, matieme/Active-Ragdoll-Character, hobogalaxy/UnityActiveRagdoll, InterDigitalInc/UnderPressure, bauxitedev/godot-jigglebones.

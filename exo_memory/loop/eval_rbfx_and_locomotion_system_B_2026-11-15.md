# Two existing systems for the legs, evaluated: rbfx's IK module and Johansen's Locomotion System (pane B, D677, 2026-11-15)

**Ordered by** the plan's section of 15:54 (`loop/plan_animation_restart_2026-11-15.md` from :445), at his word (game brief item 244):
"backwards walking is bugged, i swear, there has to be open source gems that already exist which we can then modify?"

**Kept to the rules:**
- Nothing entered the game's tree. Each repository was cloned into its own empty folder on G:: `G:\b-eval\rbfx` (master, depth 1)
  and `G:\b-eval\locomotion` (master, depth 1).
- The requests to GitHub carried only the projects' own URLs.
- Nothing was installed. The build used the Visual Studio 2022 already on this machine and the CMake it bundles.
- The build ran at BelowNormal, hidden.
- Tier: check it.

**Earlier fetches:** the files I read at source before this order (`IKLegSolver.cpp`, `IKStickTargets.cpp`, `LegAnimator.cs`,
`MotionAnalyzer.cs`) sit in `C:\Users\nname\Downloads\dz3-research-src\`. That is outside the game's tree but not on G:, as the rule
now asks. They are the same files the clones hold.

## The short answer

**Neither gives him a backwards walk by itself:**
- **Johansen's system** makes any direction, a turn, a stop and a start by blending example cycles that already go that way. With
  only the measured forward runners as its source, it has no backward cycle to blend.
- **rbfx's IK** fits a given animation's feet to the ground. It makes no steps of its own.

**What each is, in one line:**
- **Johansen's** is the method: footprints, a footbase between them, foot-rolls, the hips' height, starting and stopping. The new
  legs already carry parts of it, read at source today (hand-back §18).
- **rbfx's** is a C++ leg and foot solver: toe-first, heel placed, ground penetration recovered, reach snapped, sticky targets.

**Both need open recorded cycles that go backwards and sideways.** That is pane A's half of the evaluation: 100STYLE (CC BY 4.0),
CMU.

## rbfx's IK module (rbfx/rbfx, `Source/Urho3D/IK/`)

**1. Its licence, opened** (`G:\b-eval\rbfx\LICENSE`):
- MIT: "Copyright (c) 2008-2022 the Urho3D project. Copyright (c) 2017-2020 the rbfx project."
- What it asks of a sold game with a private repository: that the copyright and permission notice be "included in all copies or
  substantial portions of the Software". A line in the game's third-party notices does that. **Nothing of the game's own source is
  asked for.**
- The engine bundles 51 third-party libraries, each under its own licence (`Source/ThirdParty/LICENSES`). The IK module's own
  includes are rbfx's engine (`Scene/Node`, `Graphics/AnimatedModel`, `Graphics/AnimationController`, `Math/Sphere`), not those
  libraries.
- **The demo's assets:**
  - Kachujin is Mixamo's (`bin/Data/Models/Kachujin/License.txt`): "available for commercial and non commercial use, royalty free",
    so long as the character is embedded and not sold as editable files.
  - The fox is CC0 (the model, PixelMannen) with its rigging and animation under CC BY 4.0 (@tomkranis) (`bin/Data/Assets/README.md`).

**2. Whether it builds and runs here: yes, with one upstream fault worked round.**
- It was configured and built with the Visual Studio 2022 and CMake already here, at BelowNormal (`G:\b-eval\rbfx-build.cmd`,
  `rbfx-build2.cmd`).
- **The engine built first try** (`Urho3D.dll`).
- **The editor failed on one error in rbfx master:** "LightAccumulator.h(117,9): error C3861: 'assert': identifier not found"
  (`G:\b-eval\rbfx-out\build.txt:2927`).
  - It built on the second try with `<cassert>` forced in through the compiler's environment (`CL=/FIcassert`). No rbfx file was
    changed (`rbfx-out\build2.txt`: "build exit 0").
- **It runs:** `Editor.exe`, started minimized, stayed up 15 s (window title "Urho3D") and was then closed.
- The build is 4.8 GB on G:.
- **Nothing it needs is missing from its repository.** Its IK scenes' models (Kachujin, the fox) are in `bin/Data`, under the licences
  in 1.

**3. Its own demo:**
- rbfx has **no locomotion demo**. Its 77 samples include no IK sample, and neither character demo (18, 109) calls the IK module
  (`grep IKSolver` on both: 0).
- **Its IK is shown in two scenes for its editor:**
  - `bin/Data/Scenes/InverseKinematics_0.xml`: 56 animated models with 35 `IKLegSolver`, 21 arm, 13 limb and 12 spine solvers.
    Kachujin plays `Kachujin_Walk.ani` and `Kachujin_Walk_IK_Only.ani`.
  - `InverseKinematics_1.xml`: twelve foxes on `Run`, `Walk` and `Survey`.
- **They are characters walking in place,** their feet fitted to boxes and slopes. There is no walk backwards, no turn and no stop
  and start in rbfx to film.
- **Not filmed;** the last section says why.

**4. What taking it would mean:**
- **It is a component of rbfx's engine, not a library.** Its solvers read `IKNode` chains built from the engine's scene nodes. Taking
  it means porting its maths into `game/anim/`, which MIT allows with the notice:
  - the leg solver: `IKLegSolver.cpp:289-320` and `:222-259`;
  - the trigonometric chain;
  - the sticky targets: `IKStickTargets.cpp:156-199`.
- **It meets the simulation as the new legs do:** kinematic, per tick, after the plan. Jolt is not involved.
- **What it would replace:**
  - `legs.cpp`'s two-bone solve (`two_bone`) with a toe-targeted leg: the toe is the target, the heel is placed by the foot's length,
    held above the ground (`RecoverFromGroundPenetration`), and the foot turns about the toe when the ankle is out of reach
    (`SnapToReachablePosition`);
  - perhaps the lock's release rule with its thresholds: 0.3 m, 45 degrees, 0.8 s, recovering over 0.2 s, one foot at a time
    (`IKStickTargets.h:17-20`).
- **What it keeps:** everything else:
  - the gait plan;
  - the measured runners;
  - the feet's judges and his turn test;
  - the yardstick;
  - the lessons sheet.

**5. What it would not give him:**
- **Any stepping.** It does not decide where a foot goes or when; it fits feet that an animation or a plan already moves.
- So **no backwards walk, no turn behaviour and no stop and start.** The backwards walk's fault (a forward stride's knee lift on
  backward travel) is in the source motion, which rbfx does not provide.

## Johansen's Locomotion System (runevision/LocomotionSystem)

**1. Its licences, opened:**
- **The code:** `G:\b-eval\locomotion\LICENSE`, the Mozilla Public License 2.0; the README says "All code files … Copyright (c)
  2008-2020, Rune Skovbo Johansen".
  - **What it asks of a sold game with a private repository** (MPL-2.0 §3.2, §3.3): the game may be distributed under any terms as a
    "Larger Work", and **the game's own files stay private.**
  - **But every MPL-covered file shipped in executable form must be available in source** to whoever receives the game, with a note
    saying how to get it. That covers our modifications of those files: "such Covered Software must also be made available in
    Source Code Form … and You must inform recipients of the Executable Form how they can obtain a copy".
  - inferred, not a lawyer's reading: a C++ port that translates `LegAnimator.cs` would be a modification of a covered file, so
    those files' C++ would be published; a fresh implementation of the method from the thesis would not be.
- **The demo's assets:** `TUTORIAL ASSETS LICENSE AGREEMENT.rtf` (Unity Technologies ApS) covers the characters and their walk and
  run cycles, with two clauses that decide it:
  - clause 1: they may be used "only for projects or applications developed with the Unity technology";
  - clause 4: they may not be used "in non-Unity tools or development environments".
  - **They cannot come to our engine at all.**

**2. Whether it builds and runs here:**
- It is a Unity project: `ProjectSettings/ProjectVersion.txt`, "m_EditorVersion: 2019.4.8f1". Its code is Unity MonoBehaviours
  (`Animation`, `AnimationState`, `Physics.Raycast`, `LateUpdate`) and does not build outside Unity.
- **Unity is not installed here,** and installing it is his call: the order says so, and it is asked in this file's last section, not
  done.

**3. Its own demo:**
- **It does not run here without Unity.**
- **The author's own videos** are on his project page, https://runevision.com/tech/locomotion/ ("Video Demo 1", August 2008; "Video
  Demo 2", November 2008, with four-legged animals). They show walking and running in any direction, turning and uneven ground. That
  link is for his page; nothing was downloaded.

**4. What taking it would mean:**
- **The pipeline,** read whole at source today:
  - footprints predicted along a circle (`LegAnimator.cs:862-886`);
  - a footbase between them on the source cycle's own progression (`:1166-1199`);
  - the heel or toe as pivot by balance (`MotionAnalyzer.cs:286-317`);
  - the hips' height (`LegAnimator.cs:1476-1567`);
  - foot alignment, flat in stance and the source ankle in flight (`:1572-1630`);
  - legs parked to stop and start (`:948-982`);
  - the cycle analysed from its own heel and toe (`MotionAnalyzer.cs:366-678`).
- **The new legs already carry parts of it:**
  - the hips' height (FindHipOffset, with its cap, `:1558`);
  - the footbase on the lower of heel and ball;
  - the step as the source's own contact sweep (`MotionAnalyzer.cs:562-569`).
- **What it would replace:**
  - the shaped branch's lock and swing offset, with footprints and a footbase between them;
  - the plan's own stepping, with blending source cycles by the direction of travel.
- **What it keeps:**
  - the measured runners, as the forward source cycles;
  - the feet's judges, his turn test and the yardstick, which judge any base;
  - the lessons sheet.
- **How it meets the simulation:** it is kinematic, observing the body's position, velocity and turning, and casting rays at the
  ground. Here that is the plan's floor probe and the sim tick. No physics.
- **How the code would come over:**
  - **(a) from the method:** the thesis and the code read as now, and written in C++ in `game/anim/`. The only MPL question is how
    closely the C++ follows the C#.
  - **(b) as a port of the files under MPL:** those files' C++ would be published with the game.
  - **Which one is his call**, with this licence in front of him.

**5. What it would not give him:**
- **A backwards walk without a backward cycle.** It blends example cycles by the velocity's direction; with the forward runners alone,
  backward travel has nothing to blend toward. The cycles have to come from open data (100STYLE's backward and sideways walks, CMU),
  which is pane A's half.
- **The hunter's speed past its data.** No open recording reaches a sprint (`loop/animation_system_2026-11-13/scout_motion_matching.md:1-3`),
  so a blend can only hold its fastest cycle.
- **The upper body.** Its README: "The system only controls the legs."
- **Reactions:** "not a physics-based system … cannot make the character react instinctively to external forces".

## What is his

- **A base, or none.** Between rbfx's IK (a foot solver, MIT) and Johansen's method (the whole stepping, MPL-2.0 code), or both: the
  method from Johansen, the foot solver from rbfx.
- **Yes or no to each licence** before a line of either enters the game.
- **Whether to install Unity 2019.4.8f1** to run Johansen's own demo here. It is not needed to take the method; his own videos are at
  the link above.

## The film: none made, and why

- **rbfx:**
  - **Its IK scenes open only in its editor, by hand:** a project opened, the scene chosen, then played. The editor has no
    command-line way to open a given scene (`Source/Editor/EditorApplication.cpp:178-184`: `--read-only`, `--single-process`,
    `--command`, `--exit` and a project folder). I cannot drive its GUI from here.
  - **A small program built against rbfx could load `InverseKinematics_0.xml` and save its frames,** outside the game's tree: about one
    to two hours more.
  - **It would show characters walking in place with their feet fitted to boxes and slopes,** not a walk backwards, a turn or a stop.
    It is worth making only if he wants to see rbfx's foot fitting itself.
- **Johansen's:** it does not run without Unity 2019.4.8f1, which is his call. His own demo videos are at
  https://runevision.com/tech/locomotion/.
- **So the ring carries no clips folder.** This file's answers stand in its place.

## Corrections

- **My first start of the rbfx build was lost.** Git Bash turned `start`'s switches into paths (`/BELOWNORMAL` became
  `C:/Program Files/Git/BELOWNORMAL`), and nothing ran. I stopped that one process, by its id after checking its command line and
  creation time, and restarted with the switches passed as written.

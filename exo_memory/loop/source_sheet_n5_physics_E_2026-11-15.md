# Source sheet for N5: the picture's physics and reactions (pane E, D677, 2026-11-15)

**What this is for.** The new animation system's fifth stage (N5, `loop/plan_animation_restart_2026-11-15.md:78`), step 7:
"Picture physics on the upper body, and reactions" (:55). It is written in the same form as
`loop/source_sheet_n2_upper_body_E_2026-11-15.md`.

**What the sheet holds.** Research only: published work or open-source code, each line with its source and whether it was
read at source. The old build appears only under "not carried over". Tier: just do it.

**"Read at source" says who opened what:**
- **reader, whole**: the room's scout read the primary whole. Its second reader's verdict follows (DOWNGRADED, WRONG,
  UNSUPPORTED) where there is one.
- **reader, abstract**: the scout read only the abstract.
- **agent, opened / fetched**: the librarian's research agent opened the page or fetched the file. Its reports say the
  librarian opened none of their sources. A code "[read]" is a summarising fetch, not a line-by-line reading. Its
  licence cautions are at R-code:7-9.

I re-opened no primary myself.

**Read whole:**
- `loop/animation_system_2026-11-13/scout_secondary_and_physics.md` (S-phys)
- `loop/animation_system_2026-11-13/scout_overgrowth_method.md` (S-og)
- `research/procedural_animation_techniques_open_materials_2026-11-15.md` (R-tech)
- `research/open_source_procedural_animation_code_census_2026-11-15.md` (R-code)

**His words that govern N5** (brief = `exo_memory/briefs/dreamzone2_the_game.md`):

| item | his words | where |
|---|---|---|
| 158 | "it makes me think, wouldnt be ideal for what we want to make a physics engine itself that drives the procedural animations" | brief:1118 |
| 159 | "when the charater rubs up against a wall you see their arms and hands touch up against it as you move, the character must interact with the world dynamically too" | brief:1120 |
| 160 | "hmmmmmmmm would there be a way to sort of mesh both techniques in a unique and cool way? if not do 1" | brief:1122 |
| `player_body-5` note | "or running up against the wall sprinting you bump into it and drag against the wall the arms should move to show it." | brief:1286 |
| `entity_bodies-3` note (the catch) | "If it grabs you from behind, it stops you, depending on the angle of attack, ragdolls your body and flips you around [...] Once your body settles after ragdoll" | brief:1378 |

---

## 1. The physics engine the game already links: Jolt v5.6.0 (MIT)

| rule and numbers | source | on file | read at source |
|---|---|---|---|
| A soft-keyframed rig: `DriveToPoseUsingKinematics(pose, dt)` each step, with gravity cancelled by adding back gravity x dt. The sample caps every part at 10 m/s "to avoid excessive jittering when the head hits the bar", and says the cap "also limits how fast an animation can be" so "the ragdolls lag behind"; one can clamp "the needed velocities" instead. Its level has a wall of boxes and a bar: collision is its point | Jolt `Samples/Tests/Rig/SoftKeyframedRigTest.cpp:1-103` | S-phys:68-73 | reader, whole (code) |
| The drive is a velocity set: `MoveKinematic` on every body, linear velocity = delta / dt, angular from the delta rotation; then the solver acts | Jolt `Ragdoll.cpp:636-645`, `MotionProperties.inl:16-20` | S-phys:77-79 | reader, whole |
| A motor-driven "sprint" with the root taken back by `GetRootTransform`; nothing in it balances | Jolt `PoweredRigTest.cpp:1-137` | S-phys:74-76 | reader, whole |
| Every dynamic part obeys a spin cap of 0.25 pi x 60 = 47.1 rad/s and a linear cap of 500 m/s (not kinematic bodies); default damping 0.05 linear and angular | Jolt `BodyCreationSettings.h:109-112`, `PhysicsSystem.cpp:1623-1627` | S-phys:80-84 | reader, whole; the hunter's peak forearm spin against 47.1 is unmeasured |
| `Stabilize()` limits parent/child mass ratios to 0.8-1.2 and raises a parent's inertia to at least its children's sum (after Strunk, Havok); constraint priorities make constraints near the leaves lower priority than those near the root (v5.5.0) | Jolt `Ragdoll.cpp:51-56, :108-109`, `Ragdoll.h:30-33` | S-phys:85-90 | reader, whole; [ours] for this use (S-phys second reader): built for constraint-driven ragdolls, and Stabilize changes how a body answers a contact |
| `ResetWarmStart` when a ragdoll is re-posed so its bodies' orientation changes completely | Jolt `Docs/ReleaseNotes.md:316` | S-phys:91-93 | reader, whole |
| "In general, the system is stable when running at 60 Hz with 1 collision step"; motor frequencies in (0, 0.5 x simulation frequency] | Jolt `Docs/Architecture.md:545, :740` | S-phys:94-95 | reader, whole |
| An island sleeps ("settles") when its points move under 0.03 m/s for 0.5 s; velocity steps 10, position 2 by default | Jolt `PhysicsSettings.h:84-87, :95, :102` | S-phys:96-98 | reader, whole |
| "The only object that can be shared between PhysicsSystems is a Shape"; several systems may run if no bodies or constraints are shared; step listeners can "set velocities on ragdoll bodies" each step | Jolt `Docs/Architecture.md:855-856, :928` | S-phys:99-101 | reader, whole |
| Jolt's own multicore ragdoll report | Rouwe 2022/2023 | S-phys:102-104 | reader, text only; no per-ragdoll time (the chart did not render) |

## 2. Following an animated pose with physics

| rule and numbers | source | on file | read at source |
|---|---|---|---|
| A powered ragdoll: driven toward the animated pose by impulses or joint motors, still collidable. Per frame: animation, then foot and hand IK, ragdoll, aim, skin. Filter the noisy physics signal; animated poses must not break the constraint limits. No gains published | Just Cause 2, Fuller & Nilsson, CEDEC 2010 | R-tech:59 | agent, opened |
| An open active ragdoll stays up by an outside hand on the torso: default a kinematic body joined to the torso by a joint drive; other modes an upright torque of 10000 toward world up, or the torso's rotation frozen | sergioabreu-g/active-ragdolls `PhysicsModule.cs` (Apache-2.0) | S-phys:106-119; R-code:64 | reader, whole (code); a setter bug reported in the stabilizer drive (census, unconfirmed) |
| Pose following that does not depend on mass or time step: stiffness k = m alpha / dt^2, damping d = zeta 2 sqrt(k m); maximum force = maximum acceleration x mass | Hairibar.Ragdoll `AnimationMatching.cs` (MIT) | R-code:62 | agent, fetched (summarised) |
| Stable ("implicit") PD at high gains: solve (M + h Kd) a = Kp e + Kd e' - C, then tau = Kp e + Kd (e' - h a) | DeepMimic `ImpPDController.cpp` (MIT; the PD needs no learning) | R-code:60 | agent, fetched (summarised) |
| PD control tau = kp (theta_d - theta) - kd theta'; torso and swing hip servoed in the world frame; kp up to 300 (1000 at the waist), kd = 0.1 kp; 0.005 s step; friction 0.8. Balance theta_d = theta_d0 + cd d + cv v, with d the stance ankle to the centre of mass: walk cd 0.5, cv 0.2. Survives 600 N / 500 N pushes of 0.1 s, 20 cm drops and +-6 deg slopes. Feedback-error learning cuts torso wobble from 5 to 0.5 deg | SIMBICON, Yin, Loken & van de Panne 2007 | R-tech:57 | agent, opened |
| A SIMBICON-family controller: phase advances by dt / stateTime, the state switches on ground force; balance from the centre of mass's offset and velocity in a heading-invariant frame; the hips share the root's torque by the stance foot's weight | cartwheel-3d `SimBiController.cpp` (Apache-2.0; Coros et al. 2010) | R-code:59 | agent, fetched (summarised) |
| Capture point: step to x + x' / omega, omega = sqrt(g / h), under the linear inverted pendulum | Pratt 2006 (not opened), via a secondary page | R-tech:58 | agent, secondary |
| A 6DOF joint motor's target velocity = Euler(rotation error) x gain | Godot-Active-Ragdolls `ActiveRagdollJoint.gd` (MIT) | R-code:65 | agent, fetched (summarised) |
| A powered ragdoll node that follows the animated pose, takes an optional impulse, and is blended back by a physics weight | Esoterica `Animation_RuntimeGraphNode_PoweredRagdoll.cpp` (MIT, C++) | R-code:28 | agent, fetched (summarised) |
| A per-bone physics strength keyed in the poses and blended like any channel; a joint's strength is the larger of its two bones' times the ragdoll strength | Overgrowth `animation.cpp:1389-1397`, `riggedobject.cpp:1280-1289` (Apache-2.0) | S-og:83 | reader, whole (code) |
| Six legs whose hinge motors chase an open-loop sine, with no balance feedback | Bullet `MotorDemo.cpp` (zlib) | R-code:54 | agent, fetched (summarised) |
| The agent's reading of what a small studio can use: passive jiggle layers, a powered ragdoll for hits and get-ups, and SIMBICON-style foot placement as a balance rule even on a kinematic character; full SIMBICON gaits look stiff without feedback-error learning | the R-tech agent | R-tech:61 | the agent's opinion |

## 3. Reactions: hits, strength and get-up

| rule and numbers | source | on file | read at source |
|---|---|---|---|
| On contact strength drops at 1 a second and comes back at 0.05 a second; force and torque gains lerped from a 0.1 floor up to the maximum; death zeroes them for 4 s; the animated master pulled back toward the physical body by a clamped smoothstep | ashleve/ActiveRagdoll `SlaveController.cs`, `MasterController.cs` (MIT) | R-code:63 | agent, fetched (summarised) |
| A get-up: below a speed threshold, drive toward the nearest get-up start pose, then blend to the animation | Just Cause 2 | R-tech:59 | agent, opened |
| A free fall's strength min(0.8, speed x 0.1) while falling | Overgrowth `aschar.as` | S-phys:192 | the room's summary; DOWNGRADED: second-hand, unit of speed unknown |
| Physical stumbling or step recovery without learning | none found, only strength-ramp heuristics and a "catch step" at 1.05 x chain length | R-code:48, :97 | the census looked for it (tars `LegLocomotion.cs`, MIT, for the catch step) |
| Euphoria (GTA IV, RDR2) synthesises actions at runtime | NaturalMotion | R-tech:85 | search summary only; no technical publication found |

## 4. Secondary motion (loose parts)

| rule and numbers | source | on file | read at source |
|---|---|---|---|
| Highly damped pseudo-physics only on sub-trees no animation is driving; it never feeds back into the IK | Spore "Jiggles", Hecker et al. 2008 | R-tech:60 | agent, opened |
| Verlet with world and parent-relative velocity damped apart; collision, angle elasticity, length elasticity, then an angle-limit cone; the result slerped onto the animated pose by a blend | JigglePhysics `JiggleJobSimulate.cs` (MIT) | R-code:74 | agent, fetched (summarised) |
| A closed-form undamped spring step plus exp(-damp dt) decay; force to torque by direction x force; a swing cone with tangential sliding; dt clamped to 0.0001-0.1 | wigglebone (MIT per both LICENSE files; one page reportedly says AGPLv3, unverified) | R-code:75 | agent, fetched (summarised) |
| Springs with stiffness, drag, wind, gravity and a hit radius, VRM spring-bone style | Wicked Engine `wiScene_Components.h` (MIT) | R-code:30 | agent, the header only |
| A transform that trails its parent with weight (1 - damp)^2, stepped at a fixed 60 Hz substep | Unity Animation Rigging `DampedTransformJob.cs` | R-code:33 | agent, fetched; Unity Companion License: Unity projects only, so the idea only |
| Arms as particles carried by the body's velocity with drag 0.92 a frame, pulled to the keyed arm by mix(0.9, 0.97, loose) | Overgrowth `movementobject.cpp:1769-1788` | S-og:77 | reader, whole (code) |

## 5. Switching physics on and off, and the step

| rule and numbers | source | on file | read at source |
|---|---|---|---|
| Inertialization by offset and velocity (Bollo's quintic; Holden's spring) | Bollo 2017; Holden (MIT) | S-phys:121-146; the N4 sheet, section 1 | reader, whole; UNSUPPORTED as a physics-to-pose handoff: the sources blend two ANIMATIONS, and using it to switch physics off is [ours], untested (S-phys:7) |
| halflife_to_lag(h) = h / ln2: how far a critical spring trails a target moving at constant speed | Holden, "Spring-It-On", "Timed Spring" (MIT) | S-phys:145-146 | reader, whole; a first-order blend only matches the lag, not the response |
| The ragdoll is stepped after the animation and IK, before aim and skin | Just Cause 2 | R-tech:59 | agent, opened |
| One step rate: a 240 Hz picture step is 4 times Jolt's stable 60 Hz | Jolt `Architecture.md:740`, the simulation's tick | S-phys:189 | reader, whole; the 4x margin is inferred |

## 6. Not on file

- **A cost.** No source gives a per-ragdoll time, and no run in the room measured one (S-phys:232-242, :428-429).
- **A source for physics-balanced running.** Every shipped source keeps running kinematic, and the open active ragdoll stays
  up by a hand on the torso (S-phys:287-289).
- **Collision groups:** whether the hunter's arm may hit a lesser chaser's body or the player's picture body in one shared
  world (S-phys:415-417).
- **A catch-up rule** when a frame falls behind the 240 Hz step (S-phys:418-419).
- **The quintic's coefficients** (Bollo's GDC 2018 talk, not opened).
- **Euphoria's method.**
- **Measured numbers for a person's arms carrying on after a hard stop,** or for a body bumping and dragging along a wall.

## 7. Not carried over (the old build)

- **E's soft-keyed upper body** (L185 steps 4-5, branch `l185-skeleton-steps45`):
  - its time constants, trunk 0.005 s and arms 0.01 s;
  - its catch envelope, 0.15 back to 1 over 1.0 s;
  - 30 velocity and 10 position iterations carried over from motors;
  - the frame's dt;
  - "the keyframe's share of gravity removed".

  These were ours. What they measured stays on record as a measurement, not a source: R4.3 follow p95 0.0069 m; hands
  0.131 m past on a 9 to 0 stop; the tau sweep, 0.454 / 0.315 / 0.243 / 0.131 m (S-phys:41-50).
- **The motor attempt,** stopped red (S-phys:50-51).
- **Main's hard-keyed step:** 22 kinematic bodies in their own system with no level geometry and a single-threaded job
  system (S-phys:37-40, :177).
- **`HandOverride`,** which nothing calls (S-phys:52).
- **The upper-body switch `soft_upper_body`** and the night's other switches, which the restart removes
  (`plan_animation_restart_2026-11-15.md:84`).

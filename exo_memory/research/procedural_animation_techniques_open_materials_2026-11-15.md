# Procedural animation techniques from open materials: rules and numbers (a research agent's report, 2026-11-15)

Filed by the librarian on D at his word of 13:29 ("should be everything open source we can access for proc gen animationn techniques etc"). **This is an agent's report, filed whole. The librarian has opened none of its sources.** The agent's tags stand: [read] it opened the primary source; [secondary] a blog or forum report of it; [not opened]. The request carried nothing of the game.

**Three of the six sources asked for came back unopened in their primary form:** Rosen's GDC 2014 talk (no slides or transcript; video only), Clavet's GDC 2016 talk (the Vault page only), Alexander & Jayes 1983 (paywall). Bollo's GDC 2018 slides did not open, but his 2017 SIGGRAPH abstract describes the same method and was read in full. Weyand 2000 returned 403. Coverage: real rules and numbers for topics 2, 3, 6 and 7; partial for 1, 4, 5 and 9; very little for 8.

## 1. Key-pose locomotion on a stride wheel

- **Few poses.** Overgrowth's character uses "only 13 keyframes in total for everything". Unity forum post on the talk, https://discussions.unity.com/t/an-indie-approach-to-procedural-animation-gdc-video-talk/538228 [secondary]. Talk: https://gdcvault.com/play/1020049/Animation-Bootcamp-An-Indie-Approach [not opened].
- **Which poses.** A university replication uses 2 "pass" and 2 "reach" frames each for walk and run, plus 1 idle (9 in all), slerped in local space. Between walk and run speeds, joint angles are blended in proportion to speed. Castelein, TAMU CSCE450 2022, https://people.engr.tamu.edu/sueda/courses/CSCE450/2022F/projects/Peter_Castelein/index.html [read; a student's reading of the talk].
- **What drives the wheel.** Distance moved on the ground plane, not time: wheel angle += distance / circumference × 360°, wrapped at one stride; phase 0-1 indexes the pose ring (pass, reach, pass mirrored, reach mirrored, pass). Called the "stride wheel" / "surveyor wheel" at about 5:30 in the talk. https://discussions.unity.com/threads/surveyor-wheel-technique.251435/ [secondary; nobody in the thread knew how Rosen sized the wheel].
- **Wheel behaviour in a port.** A Urho3D version keeps one wheel per ground direction and resets or resizes it on teleports and gait changes. https://discourse-urho3d.github.io/t/implementing-wolfires-procedural-animation-in-urho/2077 [read].
- **Layers.** Keyed poses with procedural systems on top, for example a spring-damper for crouching. https://polycount.com/discussion/comment/2093477 [secondary].
- **Curves between poses.** A 3-key run can be resampled through a curve (3 keys to 30). Same Urho thread [read]. Rosen's "Procedural Animation Redux" (2008) and "Angular and linear keyframe blending" (2010) returned 404 [not opened].
- **The same idea with physics.** SIMBICON walks with a 4-state pose machine: lift for 0.3 s, then hold until foot contact; running uses 2 states. Yin, Loken, van de Panne 2007, https://www.cs.ubc.ca/~van/papers/2007-siggraph-simbicon.pdf [read].
- **Gait timing for arbitrary legs (Spore).** Per foot: a duty factor (fraction of the cycle on the ground) and a step trigger (offset into the cycle). Legs of unequal length run at frequencies set by small rational ratios of their lengths. Speed interpolates between authored parameter sets. Hecker et al. 2008, https://www.cse.chalmers.se/edu/year/2011/course/TDA361/Advanced%20Computer%20Graphics/027-hecker%20copy.pdf [read].

## 2. Inertialization and its variants

- **Bollo, Gears of War 4.** Cuts straight to the target clip and stops evaluating the source. At the cut it records the source velocity and the source-to-target pose offset, fits a quintic that matches offset and velocity at t=0 and reaches zero at the end, and adds that curve to the target. Controlling the curve's initial acceleration rules out overshoot. Cost 12 µs against 30 µs for a blended transition. Bollo, SIGGRAPH 2017 Talks, https://history.siggraph.org/wp-content/uploads/2022/09/2017-Talks-Bollo_High-Performance-Animation-in-Gears-of-War-4.pdf [read]. GDC 2018 talk https://gdcvault.com/play/1025165/ [not opened]. The exact quintic coefficients and the overshoot clamp are not in the abstract.
- **Phase matching on re-entry to locomotion (same paper).** Phase quotient = left foot minus right foot, projected on velocity (or on facing when still); negated and offset during the incoming half so it rises over the whole cycle; tabulated per frame at startup, filtered to be monotonic, inverted into a piecewise-linear map; the cycle starts at the mapped frame. [read]
- **Spring form (Holden's Motion-Matching demo defaults).** Transition half-life 0.1 s. Character-to-simulation adjustment half-lives 0.1 s position, 0.2 s rotation; adjustment per frame capped at 0.5 × |velocity| × dt; clamping 0.15 m and 90°. Simulation velocity and rotation half-lives 0.27 s. https://raw.githubusercontent.com/orangeduck/Motion-Matching/main/controller.cpp [read].
- **Damper used throughout.** x × (1 − exp(−ln2·dt/halflife)). Holden, "Code vs Data Driven Displacement", https://theorangeduck.com/page/code-vs-data-driven-displacement [read].
- **Dead blending (Holden).** At the transition store the source pose and velocity; extrapolate e_x += e_v·dt, decaying velocity by 2^(−dt/halflife); cross-fade from the extrapolation to the destination with α = smoothstep(t/blendtime), normal blend 0.2 s; keep a direction quaternion so the blend never flips; optionally clamp or bounce at joint limits. It needs only the current pose and velocity. https://theorangeduck.com/page/dead-blending [read].
- **Inertialization as a transition cost.** Spring-offset area (2xy + v)/y² with y half the damping; approximate feature per joint 2·pos/y + vel/y²; the cubic inertializer gives z·pos/2 + z²·vel/12 with z the blend time; half-life 0.15 in the plots. https://theorangeduck.com/page/inertialization-transition-cost [read].
- **When it replaces cross-fades.** Whenever evaluating both clips is the cost, or only the current pose is known (physics, IK output). Read from Bollo and from Holden's dead-blending page.

## 3. Foot contact, locking and warping

- **Contact detection (Holden).** Toe velocity below a threshold between 0.1 and 0.5 m/s, with toe height about 0.1 m as a sanity check; majority filter over 5 frames at 60 Hz. Not at 30 Hz: run contacts become 1-2 frames long. https://theorangeduck.com/page/inverse-kinematics-foot-locking [read].
- **Lock and unlock rules (same page).** Lock when in contact and output-to-input distance < lockDistance; the contact point stored at contactHeight. Unlock when contact ends or distance > unlockDistance. Each blended with a cubic inertializer over blendTime. Two-bone IK puts the heel at toe target + toe-to-heel offset; reach soft-clamped with about 0.005 m of softening; toe, heel and toe tip clamped above the ground. Demo defaults: unlock radius 0.2 m, foot height 0.02 m, IK blend half-life 0.1 s, max-length buffer 0.015 m (controller.cpp) [read].
- **Kovar, Schreiner, Gleicher 2002, footskate cleanup.** https://research.cs.wisc.edu/graphics/Papers/Gleicher/Mocap/cleanup.pdf [read]. Constraints on the heel and/or ball; a new plant takes the joint position averaged over the next L1 frames, projected to the ground. Doubly constrained foot: Q′ = Rot(pB − pH, cB − cH)·Q. Singly constrained: rotations blended off with α(t) = 2t³ − 3t² + 1 over L2 frames. Root: moved by the least amount that makes the ankles reachable (sphere projection), then averaged over the constrained block. Knee damping: knee change limited above 2.8 rad (about 160°), then thigh and shin stretched by d′/d, at most 2.6%. Toes get the smallest rotation that keeps them above the floor. Windows L1 = 10 frames, L2-L4 = 5-10 frames at 30 Hz. Cost 0.097 ms per frame.
- **Unreal Stride Warping.** StrideScale = LocomotionSpeed / RootMotionSpeed, with optional clamping and separate interpolation for speeding up and slowing down; a minimum speed threshold; a pelvis "pull-down" solver with stiffness/damping, max distance, error tolerance and an iteration cap. https://dev.epicgames.com/documentation/en-us/unreal-engine/pose-warping-in-unreal-engine [read].
- **Unreal Orientation Warping (same page).** Orientation = RotationBetween(RootMotionDirection, LocomotionDirection), applied to the leg IK; the spine counter-twists (Distributed Bone Orientation Alpha 1 puts all of it on spine index 0; 0 on the top bone); delta threshold default 90°; one forward jog clip covers 180°. [read]
- **Unreal Slope Warping (same page).** Floor normal, max step height, foot size, pull pelvis down, keep mesh inside capsule; stiffness/damping interpolators throughout. Flagged "in development". [read]
- **Unreal Foot Placement.** UnplantRadius and UnplantAngle release a plant; pelvis MaxOffset is vertical; MaxOffsetHorizontal: past it planted feet first roll, then slide. Search snippets only, https://docs.unrealengine.com/PythonAPI/class/FootPlacementPelvisSettings.html [secondary].
- **Unity humanoid.** feetPivotActive blends the body pivot from centre of mass (0) to the feet (1). https://docs.unity.com/en-us/engine/current/script-reference/unityengine/animator/feetpivotactive [read].

## 4. Turning, leaning, starts, stops, pivots

- **Unreal distance matching.** Starts, stops and pivots are driven by a root-distance curve (sample rate 30; XY axis for locomotion; Stop Speed Threshold), not by time. https://dev.epicgames.com/documentation/en-us/unreal-engine/distance-matching-in-unreal-engine [read]. No play-rate clamps or stop prediction on the page.
- **Simulation versus character.** A critically damped velocity spring with half-life 0.27 s. Demo speeds: run 4.0 m/s forward, 3.0 sideways, 2.5 back; walk 1.75, 1.5, 1.25. The character is pulled toward the simulation. controller.cpp [read].
- **Turn in place with planted feet.** Holden's foot lock plus root adjustment holds feet through a turn, and the lock releases past the unlock radius [read]. Orientation warping keeps the feet on the travel direction while the spine twists [read]. Trico pins feet, blends a lifting foot back from its pinned position, and re-chooses landing points during the swing [read, topic 9].
- **Turning in physics control.** SIMBICON modulates the desired facing angle, 0.9·sin(πt/12) rad, through the stance hip. [read]
- **Leaning into acceleration.** No public rule found. lean = atan(a/g) is the agent's derivation, not a sourced rule.

## 5. Arms, trunk, head, look-at

- **Arms and trunk.** Arm swing cancels the legs' angular momentum; thorax rotates opposite the pelvis; arm-to-trunk coordination is more out-of-phase in walking and more in-phase in running, where arm swing is larger. From search summaries: UMass thesis https://scholarworks.umass.edu/entities/publication/56d8d7e3-c743-4f63-8efc-e327bffece57 [secondary]; Meyns 2013 review, DOI 10.1016/j.gaitpost.2013.02.006 [not opened]. **No degree figures that could be verified.**
- **Look-at weight split (Unity).** SetLookAtWeight(weight, body, head, eyes, clamp); clamp 0.5 = half the range, 180°. https://docs.unity.com/en-us/engine/current/script-reference/unityengine/animator/setlookatweight [read]. No default values listed.
- **Trico's "Lion Dance" look-at.** Decide the head's position and rotation first, then solve the neck; put the neck's rotation axis as far forward on the head as possible; lower head and body when ceiling sensors trigger. Tanaka, CEDEC 2017, https://docs.google.com/presentation/d/1cYDabTQGYe09w3PyUU4XLrDn2fHy9X5eJIFUjVDt89U/htmlpresent [read].
- **Spore look-at.** Look-at sets a frame, so a nod still works on top of it; soft joint limits damp it as the target goes behind. [read]
- **Head stabilisation in first person.** Aim constraint on the head toward a distant fixed target, with minimal bob. https://gamedeveloper.com/programming/true-first-person-camera-in-unreal-engine-4 [read].

## 6. Physics-based secondary motion (no machine learning)

- **SIMBICON.** [read] PD control τ = kp(θd − θ) − kd·θ̇. Torso and swing hip servoed in the world frame; stance hip torque τA = −τtorso − τB. Balance: θd = θd0 + cd·d + cv·v, d the stance ankle to centre of mass (the hip midpoint is enough). 3D walk cd = 0.5, cv = 0.2 in both planes; stable range cv 0.03-0.59 sagittal. kp ≤ 300 (1000 at the waist), kd = 0.1·kp, timestep 0.005 s in ODE, friction 0.8. Survives 600 N forward / 500 N back pushes of 0.1 s, 20 cm drops and ±6° slopes. Feedback-error learning: 20-1000 phase bins, α = 0.1, cuts torso wobble from 5° to 0.5°.
- **Capture point.** Step to x + ẋ/ω with ω = √(g/h) under the linear inverted pendulum model. Formula from a secondary page, https://compendium-01j.pages.dev/Engineering-and-Robotics/Robotics/humanoid-balance [secondary]. Pratt 2006 [not opened].
- **Powered ragdoll, Just Cause 2.** Ragdoll driven toward the animated pose by impulses or joint motors, still collidable. Per frame: animation → foot/hand IK → ragdoll → aim → skin. Filter the noisy physics signal; animation poses must not break constraint limits. Get-up: below a speed threshold, drive toward the nearest get-up start pose, then blend to the animation. No gains published. Fuller & Nilsson, CEDEC 2010, copy at https://api.sambuz.com/doc/physics-ics-meets-s-anim-imation-ion-charac-racter-ter-ppt-presentation-926923 [read].
- **Cheap secondary motion (Spore "Jiggles").** Highly damped pseudo-physics only on sub-trees no animation is driving; it never feeds back into the IK. [read]
- **What a small studio can realistically use (the agent's reading):** passive jiggle layers, powered ragdoll for hits and get-ups, and SIMBICON-style foot-placement feedback as a balance rule even on a kinematic character. Full SIMBICON gaits look stiff without feedback-error learning.

## 7. Traversal

- **Gears 4 warp points.** Animators mark landmarks in the clip; at runtime the game places matching points in the world. Translation, rotation and facing are each warped on their own timing. One clip evaluated, against 2-3 for a blend space. Bollo 2017 [read].
- **Unreal Motion Warping.** Named warp targets, notify windows, Skew Warp, optional Ignore Z, rotation types Default/Facing, a rotation time multiplier. https://dev.epicgames.com/documentation/en-us/unreal-engine/motion-warping-in-unreal-engine [read].
- **Hand constraints.** Treat hands like feet, but project the root into the intersection of four spheres. Kovar 2002 §6 [read].
- **Spore reach targets.** Movements stored relative to the rest pose and a target. Ground-relative: 0 = rest height, 1 = ground. Secondary-relative: 0 = rest, 1 = target. Solved with particle IK (5 outer iterations, limbs compress to 10%, stretch 10-120%). [read]
- **Assassin's Creed.** Long-standing hand and foot IK during climbing, plus a procedural layer for jumps and landings. Search snippet only [not opened].

## 8. First-person and third-person bodies

- **True first person (UE4 article).** Camera attached to the head of the full-body mesh and never moved directly; aim offset from 10 one-frame additive poses; yaw clamped ±91°; the camera updated at the end of the controller tick to avoid a one-frame lag. https://gamedeveloper.com/programming/true-first-person-camera-in-unreal-engine-4 [read].
- **Shadows.** Rendering shadows from the first-person animation looks wrong, but the shadow must still line up with the visible legs. Search summary only [secondary].
- **Not opened:** Duffin GDC 2013 https://gdcvault.com/play/1017633/ ; Overwatch https://gdcvault.com/play/1024319/ .
- **Multiplayer replication of procedural pose:** no public source found.

## 9. Shipped games

- **Overgrowth:** 13 keys, stride wheel, springs [secondary].
- **Rain World:** slugcat is two spherical chunks at a fixed distance, limbs and tail drawn procedurally on top. https://unity.com/blog/exploring-procedural-design-rain-world [read]. GDC 2016 talk [not opened].
- **Spore:** [read], topics 1 and 7.
- **The Last Guardian:** [read] Pipeline AI → animation → procedural → physics → fur. The spine bends along the AI's Bezier path, with a bend limit the pathfinder respects. Landing points are chosen at lift-off and re-checked mid-swing; a foot is refused on objects, steep slopes, or near walls.
- **Gears 4:** [read]. **Just Cause 2:** [read].
- **Euphoria (GTA IV, RDR2):** synthesises actions at runtime; RDR2 uses it for physics reactions. https://wccftech.com/rockstar-euphoria-evolved-rdr2/ [search summary only]. No technical publication found.
- **For Honor:** "dance cards", search snippet only [not opened]. **Clavet GDC 2016:** [not opened].
- **Nothing found** for Shadow of the Colossus, Left 4 Dead zombies, QWOP, Gang Beasts or Human Fall Flat. The Gang Beasts GDC Europe 2014 talk exists [not opened].

## Twelve sources most worth a full read (the agent's order)

1. Holden's Motion-Matching repo (controller.cpp, database.h): working C++ for every spring, clamp, lock and inertializer, with defaults.
2. Kovar et al. 2002: the complete foot-plant pipeline, including knee damping and root averaging.
3. SIMBICON 2007: the balance law, gain tables and every physics constant.
4. Hecker et al. 2008 (Spore): duty-factor gaits, particle IK, target-relative pose storage, jiggles.
5. Holden, "Dead Blending": the transition to use when only the current pose is known.
6. Holden, "IK and Foot Locking": contact thresholds and lock state machine.
7. Bollo 2017 abstract, plus the GDC 2018 video for the quintic and its overshoot clamp.
8. Rosen GDC 2014 video, checked against the Overgrowth source.
9. Epic, "Pose Warping": stride, orientation and slope warping rules.
10. Trico CEDEC 2017 slides: foot selection and the head-first neck solve.
11. Clavet GDC 2016 video: the motion-matching cost and trajectory spring as shipped.
12. Fuller & Nilsson, Just Cause 2: a practical powered-ragdoll pipeline and its lessons.

## URLs the agent opened

theorangeduck.com/page/dead-blending · /code-vs-data-driven-displacement · /inverse-kinematics-foot-locking · /inertialization-transition-cost · /learned-motion-matching · /all · raw.githubusercontent.com/orangeduck/Motion-Matching/main/{controller.cpp, database.h, README.md} · history.siggraph.org/…/2017-Talks-Bollo_High-Performance-Animation-in-Gears-of-War-4.pdf · research.cs.wisc.edu/graphics/Papers/Gleicher/Mocap/cleanup.pdf · cs.ubc.ca/~van/papers/2007-siggraph-simbicon.pdf · cse.chalmers.se/…/027-hecker copy.pdf · dev.epicgames.com/…/pose-warping-in-unreal-engine · /distance-matching-in-unreal-engine · /motion-warping-in-unreal-engine · docs.unity.com/…/setlookatweight · /feetpivotactive · docs.google.com/presentation/d/1cYDabTQGYe09w3PyUU4XLrDn2fHy9X5eJIFUjVDt89U/htmlpresent · api.sambuz.com/doc/…-926923 · unity.com/blog/exploring-procedural-design-rain-world · gamedeveloper.com/programming/true-first-person-camera-in-unreal-engine-4 · discussions.unity.com (both threads) · people.engr.tamu.edu/…/Peter_Castelein · discourse-urho3d.github.io/t/…/2077 · pmc.ncbi.nlm.nih.gov/articles/PMC1571302 · gdcvault.com/play/1020049 and /1022985 (description pages only).

**Failed:** journals.physiology.org (Weyand, 403), core.ac.uk (403), ambarish.com (Pratt, certificate expired), wolfire-blog.appspot.com posts (404), web.archive.org (blocked), docs.unrealengine.com (403), Epic's Python API pages (redirect to 404).

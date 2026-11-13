# Scout: character-motion systems in shipped games, read at the developers' own words (2026-11-13)

1. New at primary: The Last Guardian (Tanaka, CEDEC 2017 slides), Shadow of the Colossus (GDC 2006 talk, as reported
   by Game Watch), The Last of Us Part II (Naughty Dog's own GDC 2021 deck), Rain World (the developer's devlog), Spore.
2. They agree on one shape: a few sim points first, then body, legs, head, hands, fingers, ~~each layer a pass with a few
   authored numbers~~ [2nd reader: DOWNGRADED. Layering is shared; "a few authored numbers" is not: SotC has 920 player
   motions (Game Watch, Hosono's part) and TLOU2 2,627 player clips (S20). Only Trico is built on few assets.]
   ~~the head is decided first and the neck solved under it ("Lion Dance"), not turned up from the base.~~ [2nd reader:
   DOWNGRADED. One source (Trico) says it; SotC and TLOU2 do not, and Trico's own order is "body -> legs -> head ->
   fingers" (deck, "Basic structure of PA"). The room's look is already head-first: model_rig.h:105-107 "the head turns
   the whole look", trunk kLookChestShare 0.4225 (ozz look-at). See 3b.]
3. The hunter's head today rides 0.55 of the thorax's twist; the player's body already hangs from its head; the dark
   one, which he said wears the hunter's shape, is not drawn at all (0 figure slots) on main 31d1c6d.
4. First lap: the drawn model goes to the dark one too, through the same gait pass (red today: drawn 0 frames).
5. Not reached at primary: Alien: Isolation (video only; the developer blog copy would not load). Not to build: motion
   matching, limb-driven propulsion, clip databases.

Marks: [read] I opened it; [summary] another file's or another account's; [inferred] mine; [ours] a proposal.
Record paths are under `C:/Users/nname/Desktop/lighthouse/exo_memory`. `G-x` = this folder's `ground_x.md`.
Game code is dreamzone-3 main **31d1c6d** [read: `git log -1 main`], read with `git show main:<path>`.
Every outside source below is used as an IDEA only. I propose to use no outside code, data or art (rule 5).

## (1) What the room already has for this aspect

- His references for shipped games: Left 4 Dead for "peak animations and pathing" (127-130) [read] G-his_words:245-259;
  the learned-locomotion reference (131) [read] G-his_words:261-265; parkour and chase games (57) [read]
  G-his_words:172-181; the first game's kinetic linking, "better for all entities and even the player character" (156)
  [read] G-his_words:337-342.
- Read at source by earlier laps: Overgrowth's code (Apache-2.0) [read] G-sources_read:25-49; Valve's Source SDK 2013,
  study only [read] G-sources_read:93-116; Booth's L4D AI slides [read] G-sources_read:120-125; Techland's own post on
  active ragdolls [read] G-sources_read:148-152; Rust's "Rusty legs", Mirror's Edge 2009 slides as extracted text
  [read] G-physics_and_fp_body:139-143.
- Named, never read: Rosen GDC 2014 (video), Days Gone, World War Z, AC Unity, Clavet [read] G-sources_read:133-167,
  :277-290. Not found at all: Naughty Dog on a hand on a wall [read] G-physics_and_fp_body:153.
- The record's finding from shipped games so far: "physics pays for REACTIONS, shipped games keep upright running
  kinematic" [read] G-physics_and_fp_body:158-159.
- Read by other scouts of this swarm today, not re-read here: Spore (Hecker et al. 2008), whole [summary]
  scout_gaits_any_body.md:134-153; For Honor (Clavet GDC 2016 slides), whole [summary] scout_motion_matching.md:50.
- The code's pipeline: one pose type for every body, `gait_pose` then `apply_motion` then `Rig::palette` [read]
  G-code:18-32; only the first Hunter is posed, every other kind is a box [read] G-code:38-39; a second kind's
  recipe [read] G-code:210-226; the dark one has 0 figure slots [read] G-constraints_and_roster:114-117.
- A grep of the whole record (`grep -rliE`, every `.md` under exo_memory) finds 0 files naming Trico, The Last
  Guardian, Rain World or Shadow of the Colossus; "Last of Us" only as "not found" for hands on walls
  (`handback/p-l184-fpbody-research-B_2026-11-12.md:34`, :85); ~~Alien: Isolation only for its director AI, through a
  secondary article (`loop/procgen_scout_02_rhythm_and_pacing_2026-11-13.md:32`)~~ [2nd reader: DOWNGRADED. Seven .md
  files name it (grep -rliE, run again), among them `loop/research_ambush_out_of_reach_2026-11-13.md:32` (a
  gamedeveloper.com article marked [read]) and `loop/research_learning_hunter_2026-11-13.md:25`; all about the director
  AI, none about its movement or head, so the gap stands. "Last of Us" is also named at
  `loop/research_ambush_out_of_reach_2026-11-13.md:144` and `loop/absolute_sources_2026-11-13/16_horror_that_carries_love.md:291`.] [read].
- Gap: no ground file maps shipped SYSTEMS (layers, authored against generated, cost). Every source in (2) is new.

## (2) What I read at source that is new

Licences: none of these pages states an open licence. ~~I read no licence text because none is published with them;~~
[2nd reader: DOWNGRADED. Game Watch carries "Copyright (c) 2006 Impress Watch Corporation ... All rights reserved" and the
Spore PDF an ACM notice, personal or classroom use. The conclusion below holds.]
treat all as all rights reserved, used for ideas only. No code, data or art is taken from any of them [inferred].

### 2a. A single creature whose movement and head carry it: The Last Guardian (genDESIGN / SIE)

Source: Masanobu Tanaka, "Making Trico Move", CEDEC 2017 slides. I read the whole deck as text from a fan English
translation, `https://docs.google.com/presentation/d/1cYDabTQGYe09w3PyUU4XLrDn2fHy9X5eJIFUjVDt89U` (export as txt),
which names the original slides at slideshare.net/gendesign/ss-82621799. The translator writes "Translations are for
fan use only, and may be inaccurate". So the words below are [read] of a translation, [summary] of the talk itself.
Tanaka was "In change of animation for Wander, Colossi" on Shadow of the Colossus [read].

- Frame order: "AI -> animation -> procedural animation ->physics -> fur -> rendering" [read, slide "What gets
  processed within a single frame"].
- Layers inside procedural animation: "PA as modules", "Processing order goes from main parts -> details", example
  "body -> legs -> head -> fingers" [read, slide "Basic structure of PA"].
- Authored against generated: "Use few animation assets", "Animators keep performance in mind (or, a programmer
  well-versed in animation)" [read]; the walk is "a loop made up of 4 motions", one per leg [read].
- Spine: "The body bends to match an AI Bezier [curve]"; the bend angle "is limited", and pathfinding makes "an alternate
  path" that allows for the spine's curvature [read, slides "Walking: processing spinal bending", "sharp corners"].
- Feet: "The instant Trico lifts a foot, its destination is determined"; it is checked again during the step; the swing
  path blends "Shortest path" with "Natural walking path"; the planted foot is "fixed [to the ground] using a pin"; on
  lift, the slip held while pinned is interpolated away; "The foot's displacement from its original position is used to
  adjust Trico's posture"; sensors above the head lower head and body under a ceiling [read, chapter 3 part 1].
- The head ("Observation motions"): the early version was "Forward Kinematics (FK)", "neck [joints] rotate in order,
  starting from the base". It was replaced by "A system where only the head's position and rotation are decided, then
  the neck movements are determined afterwards", named the "Lion Dance Method", prototyped in Unity [read]. And: "put the
  axis of rotation towards the front of the head as much as possible" to look "even more like a living animal" [read].
- ~~Where the head looks:~~ [2nd reader: DOWNGRADED. The deck's chapter 2 is the AI's attention target, what Trico moves
  toward and acts on ("Decide the target of Trico's attention -> Move towards the target -> Decide on an action"); no slide
  ties it to the head. "Distance is a factor" gives no direction.] Every object gets an "interest level value"; interest is "digested" after an action, "rises over
  time", and "Distance is a factor"; the highest becomes the target [read, chapter 2].
- Physics only where it must touch: the barrel catch holds the barrel "between the upper and lower jaws using collision",
  with a predicted catch point corrected before the moment [read].
- Their summary: "Processing doesn't break the animations"; "Procedural animations need to be convincing (look good)"
  [read, slide "PA summary"].
- Cost: none given [read: no figure in the deck].
- Lesson for a small team with its own engine [inferred]: decide the head's pose first and solve the neck and chest
  under it. ~~The room's hunter does the FK form the Trico team abandoned (see 3b).~~ [2nd reader: WRONG for the look. On main the
  head already takes the whole look and the trunk a share (model_rig.h:105-107, :128). Only the gait counter-twist rides
  the thorax (c.head_twist = 0.55 x thorax + look, model_rig.cpp:615), a partial stabilisation, not Tanaka's neck joints
  turned in order from the base. RE-DERIVED: ground_code.md:123, ground_physics_and_fp_body.md:245.]

### 2b. Procedural climbing on a giant: Shadow of the Colossus (SCE Japan Studio)

Source: the GDC 2006 session "Postmortem: Emotional Character Control in Shadow of the Colossus" (lead programmer
Sugiyama, designer Hosono, animators Tanaka and Fukuyama), as reported with slide photos by Game Watch,
`https://game.watch.impress.co.jp/docs/20060325/wanda.htm`, read whole (Japanese; the translations are mine). The
report is a secondary account of the talk, so its content is [summary]; that the report says it is [read]. GDC kept
audio only for this session [summary, web search result; not opened].

- Who tunes what: the programmer builds a system, makes the quality-bearing parts parameters, and hands tuning to the
  animators and designers ("クオリティアップに関わる部分をプログラマ側で積極的にパラメーター化し") [summary, section
  "プログラマの視点"]. Transitions, forbidden frames and blend frames sit in a designer-run Excel table [summary].
- Asset counts: 920 motions for the player, 119 for the horse, 85 for the first colossus [summary, Hosono's part].
- Layers: several animations play asynchronously over the base; "最大12レイヤー" (up to 12 layers) on the player
  [summary, item 2 "マルチレイヤーのモーション再生"].
- Insurance on the floor: when the colossus is the player's floor, the programmers cap its speed and acceleration so
  the rider never moves wrongly ("速度や加速度に制限を付ける") [summary, item 1].
- Terrain: IK goals alone left the trunk level and wrong, so animators entered per-bone formulas from foot height and
  stick input, laid over the motion "without breaking" it; the talk showed it off and on [summary, item 3 and
  Tanaka's part].
- Foot slip on giants: the animator sets each limb's bone lock ON or OFF; the automatic tool from ICO failed [summary,
  item 4].
- The climb ("モーションとダイナミクスの融合", item 6): while clinging and swung, the joints are simulated as several
  pendulums; the multi-layer "holding on" motion plays at the right moment over that; IK corrects part offsets
  [summary].
- The head: the tilt of the neck changes the read; animators enter 8-direction parameters layered over normal motion
  [summary, Sugiyama's closing part].
- Weight over response: colossi are slow and "cannot fully chase" the player; a sudden turn or start "loses
  persuasion"; the hero crouches before a jump; "only when mass and energy are felt does motion become real" (Tanaka)
  [summary, "アニメーターからの視点"]. Landing picks one of 4 reactions by the colossus surface's angle [summary].
- Cost: none given [summary].
- Lesson [inferred]: physics for the pendulum (the reaction), authored layers for the effort (holding on), IK for the
  contact. Physics never carries the whole body.

### 2c. Motion matching for a human lead: The Last of Us Part II (Naughty Dog)

Source: Michal Mach and Maksym Zhuravlov, "Motion Matching in The Last of Us Part II", GDC 2021, the studio's own deck,
`https://s3.amazonaws.com/nd.images/research/tlou2/motion_matching_in_tlou2_nd_final.pptx`, linked from
naughtydog.com/blog/naughty_dog_at_gdc_2021. The file is 4,043,914,625 bytes (Content-Length), so I read only its
slide and note XML by HTTP range requests (147 entries) [read]. Slide numbers below are the deck's `slideN.xml`
numbers, which read in order. Images and videos were not seen.

- Layers: a "Motion Model" (a critically damped spring for position and velocity, plus turn speed and facing) gives
  the wanted path; motion matching picks a frame; then "Procedural adjustments" [read, S4, S9].
- Motion Model parameters, per set: velocity, acceleration and deceleration springs, max speed, turn rate, and a root
  allowance, "NPCs 0.3 – 0.6 m to allow more natural motion", "Player None" [read, S11].
- The procedural pass: steering ("Rotation error distributed over time"); time scaling "Normally ± 10 - 15%" with the
  coefficient "on a spring"; a soft clamp toward the model; foot plant IK that pins the foot "when below a certain
  threshold" with a Jacobian solver for bipeds and quadrupeds [read, S41-S44].
- Root and skeleton blend at different rates: "Motion blend 0.2 - 0.3 sec vs 0.4 - 0.6 sec animation blend" [read, S45].
- One move set across a cast: "Male and female enemies use the same androgenous move sets"; clips mixed across sets;
  mirrored [read, S23].
- Corners: NPCs "whip around corner without slowing down" gave a "Weightless feel"; fix: "Define at what angles and how
  much the NPC needs to slow down", values from their analyser, slow-down distance "based on the deceleration spring"
  [read, S61-S62]. The note: "simple but very effective in making our NPCs feel weighty" [read, notes].
- Horses on slopes, procedural: a main IK chain "From root joint to chest joint", each end "at an animated height from
  the ground", "sprung using critically dampened spring"; each leg solved alone [read, S81].
- Authored data: player 2,627 clips, 2 h 17 min; NPCs 6,050 clips, 6 h 34 min [read, S20, S27]. Aggressive dog moves
  could not be captured: "We used a regular run and heavily keyframed over it", "incredibly difficult" [read, S75].
- Cost: "Index search ~ 0.1ms"; "Complete update 0.5‒1.0 ms"; "The old locomotion system took 2‒3 ms a frame";
  infected hordes used limited sets [read, S83]. Cons: "Rather memory hungry", "High upfront cost", "Relies on large
  MoCap stage access" [read, S85].
- Debugging: an in-game draw of candidate frames with costs, cost breakdown, and two stick figures [read, S48].
- Lesson [inferred]: even a data-driven system ends in a procedural pass of steering, time scale, clamp and foot pin;
  that pass is the part a team without a mocap stage can have.

### 2d. Procedurally animated creatures ~~of many body plans~~ [2nd reader: DOWNGRADED. The two posts describe a 2013
pre-release prototype in Macromedia Director (post of 2013-07-11) and two bodies, the player (2 points) and the lizard (3);
not the shipped game's system.]: Rain World (Joar Jakobsson)

Source: the developer's devlog posts as JLJac, mirrored at `https://candlesign.github.io/Rain-World-Devlog/Pages/014`,
posts of 2013-06-05 and 2013-07-02, read whole [read]. The GDC 2016 bootcamp talk is video; not watched.

- Bodies are points kept at set distances: "the player consists of two such points (upper/lower body) and the lizard
  consists of 3"; limbs and tails are more points chained [read, 2013-06-05].
- Drawing is a separate layer: "the arm of a creature is drawn at the shoulder and then rotated towards the location of
  the hand point" [read].
- Limbs: "When a limb is too far behind the body it goes into a 'search mode', looking for possible grasps in front";
  it "connects to it, and then passively stays there until it's left behind by the body again" [read].
- Coupling: the lizard's propulsion depends "on how many limbs are currently connected"; but "the player has a constant
  speed and the movement of the limbs is purely cosmetic" [read, 2013-07-02].
- Cost: none given. Lesson [inferred]: the grasp rule (reach ahead when left behind, hold until left behind) is a cheap
  contact law for hands on walls and for the crawler; the propulsion coupling is not ours to take (picture only).

### 2e. User-made creatures retargeted in real time: Spore (Maxis)

Source: Hecker et al., "Real-time Motion Retargeting to Highly Varied User-Created Morphologies", ACM TOG 27(3) 2008,
course copy at cse.chalmers.se (the URL in scout_gaits_any_body.md:135). Another scout read it whole [summary]
scout_gaits_any_body.md:134-153; I re-read section 4.3 only [read].
- Layers: animators author motion with semantics in their tool; at runtime the generalised data become pose goals; an
  IK solver; then "passive secondary animation is added for aesthetic appeal" (Jiggles) [read, abstract and §1, p.27:1].
- The solver: it "will be run every frame on every procedurally animating character"; "more 'advanced'" solvers (CCD,
  Jacobian) "were slower and less amenable to tuning"; the simple particle solver gives "local control" [read, §4.3].
- Cost: no figure. Lesson [inferred]: pick the solver you can tune by hand over the one that is more general.

### 2f. The open-sourced procedural fighter: Overgrowth (Wolfire), and its author's later system

The room has read its code (G-sources_read:25-49); Rosen's talk is video only (G-sources_read:133-138). New text from
~~the same author's later work:~~ [2nd reader: WRONG. Not the same author. The article is by Eddy Boxerman and is about a
gibbon endless-runner (Gibbon: Beyond the Trees), not a fighter, describing Rosen's prototype for it. It says nothing of
Overgrowth's layers, authored-against-generated, or cost, so that part of the aspect is unmet at primary.] Eddy Boxerman (Broken Rules), "Deep Dive: Physics-based animation in Gibbon: Beyond the
Trees", Game Developer, 2022-03-18, `https://www.gamedeveloper.com/programming/deep-dive-physics-based-animation-in-i-
gibbon-beyond-the-trees-i-`, read whole [read]. It describes the prototype David Rosen built for that game.
- Layers: "modeling the COM, then 'mapping' that to the 5-point rig ..., then mapping that (including some inverse
  kinematics) to a 'complete', 14-point rig, and finally mapping that to the display rig's bones" [read].
- Why: "the pieces that were computed at lower levels become constraints on the higher LODs, making sure the important
  movements (like COM continuity, hand contact, etc.) don't get lost" [read].
- A biomechanics rule used as a law: the grab arm reaches "perpendicular to their velocity" to avoid "collisional energy
  loss" [read]. Cost: none given.
- Lesson [inferred]: the game already has this chain (ChaserPose's feet and heading -> 21-joint BodyPose -> 53-bone Rig,
  G-code:18-32); name it and keep each level's job to its level.

### 2g. Not reached: a single stalking creature in horror, Alien: Isolation (Creative Assembly)

GDC 2015 "Building Fear in Alien: Isolation" is a Vault video [summary, web search]; the studio's 2014 PlayStation Blog
post returned 502 and the Wayback copy refused the request. No primary text on its animation was read. The Last
Guardian (2a) stands in for the head-tracking creature; the horror case is unread.

## (3) The design for this aspect: one pose pass, ordered as the shipped systems order it [ours, from 2a-2f]

### 3a. The shape every source shares

| level | Trico (2a) | Colossus (2b) | TLOU2 (2c) | Gibbon/Overgrowth (2f) | this game, where [read] |
|---|---|---|---|---|---|
| intent / root | AI target, path curve | speed caps on the floor | Motion Model spring | COM | ChaserPose from the sim, `WorldApp::gather_poses` world_app.cpp:528-537 |
| body | spine bends to the path | base clip + layers | matched frame | 5-point rig | `gait_pose` trunk lean, model_rig.cpp:738-846 |
| legs | foothold at lift, pin | bone lock per limb, IK | foot pin, time scale | IK to 14 points | `apply_motion` floor probe, `reach_leg`, :415-476 |
| head | Lion Dance | 8-direction tilt layer | — | — | `kinetic_chain` head twist, :615, :642 |
| hands, fingers | — | holding-on layer | — | ~~grab arm rule~~ [2nd reader: DOWNGRADED, a gibbon's "ricochetal" swing with an aerial phase; the article says the rule differs at slow speed; no source for it on a running humanoid] | `Rig::palette` unaimed bones ride, :353-358 |
| reaction | jaws by collision | pendulum joints | — | physics on the arm | L185 soft key (branch only) G-physics_and_fp_body:75-79 |

Inputs: the sim's per-chaser state already in ChaserPose (pos, heading, speed, look, lean, pitch, follow) [read]
G-code:24, and the player's state for Body. Output: one BodyPose per drawn body, then the palette [read] G-code:29-32.
Nothing writes back to the sim; replay checks stay as they are [read] G-constraints_and_roster:46-53.

### 3b. The finding the table makes visible: ~~the hunter's head is turned up from the base~~ [2nd reader: WRONG for the
look, true only for the gait twist. See the notes under 2a and below; the 7.85 degrees is partial stabilisation, whether
it reads wrong is his eye's call (rule 7), not a defect the table shows]

- `chain_pose` sets `c.head_twist = kHeadTwistShare * thorax + look` [read] game/model_rig.cpp:615, with
  `kHeadTwistShare` 0.55 from the first game [read] G-code:122. `kinetic_chain` then places the head on the neck "where
  the trunk has carried it" [read] model_rig.cpp:635-638. ~~So the head is the FK chain's last link, the form Tanaka's
  team replaced (2a).~~ [2nd reader: UNSUPPORTED as a match. The deck's FK is neck joints "rotate in order, starting from
  the base"; the room's rig has no neck chain, and the head gets the whole look by weights (model_rig.h:105-107).
  [inferred] at best.]
- At a full run the thorax swings 14.28 degrees each way (`kThoraxTwistAmp`) [read] G-code:121, so the head's yaw
  swings 0.55 x 14.28 = 7.85 degrees off where it looks, every stride [inferred, from the code, not measured].
- The player is already head-first in position: Body hangs from the camera eye [read] G-code:59. What it lacks is the
  chest following the look with a lag, which the room has planned as L188 step 3 from other sources [read]
  `loop/plan_l188_first_person_body_build_2026-11-12.md:22-25`. Tanaka's deck is a shipped game's source for the same
  order: head first, neck after.
- His words this answers: "perhaps the head moves first when you look, then it moves the rest of the body underneath"
  [read] `briefs/dreamzone2_the_game.md:1128`.

### 3c. The few parameters, per body kind, with sourced defaults [ours, the sheet; defaults sourced as marked]

One small struct per body kind (hunter, dark, each lesser kind, player), read by the same pass [ours]:

| parameter | default | source of the default | serves |
|---|---|---|---|
| `model` (which glb, or a box) | hunter.glb for Hunter AND Dark | his pick run_frame-5, "it wears the hunter's shape as a stand-in" [read] brief:1229-1230 | dark one now; lesser kinds when models exist |
| `head_hold` 0..1: share of the thorax twist the head is held against | 0 today (rides 0.55); ~~1 = Lion Dance~~ [2nd reader: WRONG label; Lion Dance sets head pose from a target then solves the neck, it does not hold the head against a gait twist] | ~~Tanaka 2a [read, translation];~~ [2nd reader: UNSUPPORTED, the deck has no such share or hold; the mechanism is [ours]. Its real origin is already in the record: T2 "bird head stabilisation, head held still in space, then thrust", ground_locomotion_and_yardstick.md:156, ground_his_words.md:416. RE-DERIVED] the 0.55 is the first game's [read] G-code:122 | hunter (his eye picks), interceptor T2 (hold then thrust), player = 1 by construction |
| `root_allowance` m: how far the drawn root may leave the sim's | 0 (off) | TLOU2 NPCs 0.3-0.6 m [read, S11] | later, only if corners still read sharp (his 129-130) |

Everything else the pass needs is already on main with its source: stride law, tilt half-lives, yaw rate, look rate,
chain shares, arm laws [read] G-code:99-160. No new knob beyond these three.

### 3d. Cost per character per frame

- The pose pass: a few thousand flops and about 1k trig calls, "single-digit microseconds per hunter", not measured
  [summary] G-code:239-240. `head_hold` adds one yaw per joint at the neck: under 0.1 us [inferred].
- A drawn model: two models together measured +0.39 ms average, +0.48 ms p99 on his card [read]
  G-constraints_and_roster:24-27, so about 0.2 ms per extra full-detail model [inferred, half of that]. Reusing the one
  hunter figure for the dark one costs 0 extra GPU [inferred].
- For scale: TLOU2's motion matching cost 0.5-1.0 ms ~~per character per update~~ (S83) [read]; ~~that alone would be a third
  of our 3.33 ms frame per body [inferred].~~ [2nd reader: DOWNGRADED. S83 reads "Complete update 0.5-1.0 ms depending on
  the complexity of the model and trajectory", "The old locomotion system took 2-3 ms a frame", "Can be parallelized". No
  "per character"; console hardware; and it was FASTER than what it replaced. The third-of-a-frame figure has no basis.]

### 3e. How the same pass serves each body

- Hunter: as today, plus `head_hold` set by his eye (5). Its one cue stays T1 cornering [read] G-his_words:413-418.
- A lesser chaser: same `gait_pose` scaled to its own rest joints [read] G-code:191-194, its own phase per id (the
  `ease_` per-id table is the pattern) [read] G-code:225-226; T2 kinds set `head_hold` 1. Trico's interest rule could
  pick where a lesser chaser's head looks among the sounds D666 gives it [ours, later; picture reads sim, writes nothing].
- Player: already head-first in position; L188 step 3 adds the chest lag; Rain World's grasp rule (2d) is a sourced
  trigger for L188 step 5's hand on a wall, which the plan calls "ours" today [read] plan_l188:27-31.

## (4) The FIRST lap: the dark one drawn, through the same pass, in the hunter's shape

- Why first [inferred]: it is the smallest change that turns "the hunter's pose" into "a pose any figure gets", which
  every source here does (TLOU2's one move set for a cast, S23; Spore's one system for every body). It carries out his
  own pick (run_frame-5). And today the overtime threat is invisible.
- Today [read]: `if (hunter_.on && !hunter_out && p.kind == dz::chase::Kind::Hunter)` gives the model to the first
  Hunter only, game/world/stage.cpp:267; any other kind needs a slot and Dark has none
  (`if (k >= used.size() ...) continue;`, :283; `kFigureSlots` lists 7 values for 8 kinds, so Dark gets 0, figures.h:28) [read].
- The change [ours]: the model figure goes to the first Hunter, or, when no Hunter is posed, the first Dark; it is
  posed by the same `gait_pose` with the same GaitMotion fields; the phase moves to a per-id map so two bodies never
  share one stride. Files: `game/world/stage.cpp` (place_figures, :256-288), `game/world/stage.h` (`hunter_phase_`,
  :142). Nothing in sim/ or chase/. One figure, so 0 extra GPU.
- The row (one behaviour) [ours]: `in_overtime_the_dark_one_is_drawn_in_the_hunters_shape_every_frame_it_is_in_view`.
  Case: the flee bot's record replayed with a short run length so overtime starts (A's `run_length_s`
  [read] `handback/p-d673-overtime-A_2026-11-13.md:62`); the builder confirms the replay reaches overtime first.
  Count frames with a Dark pose within 40 m of the camera and no posed model for it. Red today: every such frame (the
  Dark pose is skipped) [inferred from stage.cpp:283]. Green: 0. Also: his 16 kept runs byte-identical (picture only),
  as L185 measured [read] G-constraints_and_roster:51.
- Tier: "check it" (a visible change, does no lasting harm) [inferred]; the replay row guards the sim.
- Second lap, after his eye on (5): `head_hold` for the hunter, row "on the fastest straight of his kept run with a
  steady look, the drawn head's yaw stays within X of its look"; today about 7.85 degrees by the code (3b), X his.

## (5) What only his eye can decide, and the fewest clips

Clips at full frame rate and lit, with no "before" older than a fix he has seen (his 216 and its ruling) [read]
`briefs/dreamzone2_the_game.md:1603-1606`.
1. The hunter's head, two takes side by side from the look-behind on his kept run's fastest straight and sharpest turn:
   head riding the thorax (today) and head held on its look (`head_hold` 1). Is the held stare humanlike or creepy, and
   does it keep his rule that the head stays humanlike (169) [read] G-his_words:413-418? A third take, the neck pivot
   moved forward (Tanaka's trick), only if he asks.
2. The dark one coming from behind in overtime, one take from the look-behind: is the hunter's shape right as a
   stand-in for "A new creature", or must it differ from the first frame?
No table decides either (rule 7).

## (6) What I would NOT build, and why

- Runtime motion matching for any body: TLOU2 needed 2 h 17 min of player data and 6 h 34 min for NPCs, a mocap
  stage, and 0.5-1.0 ms ~~per character~~ [2nd reader: see 3d, the slide gives no unit of "per character"] (S20, S27, S83, S85) [read]; the motion-matching scout reaches the same verdict
  [summary] scout_motion_matching.md:3-4.
- Rain World's limb-driven speed: it lets the legs move the body; here animation must never change the sim [read]
  G-constraints_and_roster:33-53.
- SotC's clip layers and Excel transition table: built for 920 authored motions; this game has no clips [read]
  G-sources_read:187-197.
- Spore's authoring tool and particle IK: made for unknown bodies; ours are humanoid on one pose, with a working two-bone
  reach [summary] scout_gaits_any_body.md:336-338.
- Trico's spine bending along the path with a rerouted path: it changes the path, which is the chase's, not the
  picture's; and a humanoid's spine is not its cue [inferred].
- TLOU2's corner slow-down: sourced and close to his 18 and 164, but it is a sim rule for A's speed model (H1/H2 on
  the l182 branches, G-locomotion_and_yardstick:118-135), not an animation layer. Note it for A; do not draw it.
- `root_allowance` now: drawing the hunter off its sim place risks walls and a catch that looks wrong; off until his
  eye asks for rounder corners [inferred].

## Table: lesson, source, where it sits, already in the record?

| lesson | source | where in this game | in the record? |
|---|---|---|---|
| Order the pass main parts -> details: body, legs, head, fingers | Tanaka 2a; Boxerman 2f; Hecker 2e | gait_pose -> apply_motion -> Rig | partly: the order exists in code (G-code:18-32), never stated as the rule |
| Decide the head's pose first, solve the neck under it (Lion Dance) | Tanaka 2a | kinetic_chain head, model_rig.cpp:615 | partly: player's head-first look planned from other sources (plan_l188:22-25); ~~hunter's head is FK~~ [2nd reader: WRONG for the look; RE-DERIVED, the head already takes the whole look, G-code:123, model_rig.h:105-107] |
| Neck pivot toward the front of the head reads as alive | Tanaka 2a | Rig head aim, rest_from_bones | no |
| ~~Head target~~ [2nd reader: attention target (AI), not the head] chosen by interest that rises, decays when served, ~~falls with distance~~ [2nd reader: the deck says only "Distance is a factor"] | Tanaka 2a | lesser chasers' look | no |
| Foothold fixed at lift-off, re-checked before landing, pinned, slip returned on lift | Tanaka 2a; TLOU2 S44; SotC item 4 | apply_motion feet | partly: feet with memory on a branch (G-sources_read:39-41) |
| Physics for the pendulum, an authored effort layer, IK for contact | SotC item 6 | L185 soft key + a "holding on" layer | partly: L185 reaction (branch); no effort layer |
| Cap the speed and acceleration of what a body rides | SotC item 1 | DrawnChaser input | partly: R4.5 amended for a 39 m/s keyframe (G-physics_and_fp_body:202-203) |
| Weight over response: slow turns read as mass | SotC (Tanaka); TLOU2 S61-62 | chase speed model (A) | yes: items 18, 164 and H2 (G-his_words:83-89, :384-387) |
| A procedural pass after the base: steering, time scale +-10-15% on a spring, soft clamp, foot pin | TLOU2 S41-44 | between ChaserPose and gait_pose | partly: phase by distance fits the stride by construction (G-sources_read:181-183) |
| Root and skeleton blend at different rates (0.2-0.3 s / 0.4-0.6 s) | TLOU2 S45 | a transition layer | no (not checked in other scouts) |
| One move set across a cast, per-character motion parameters | TLOU2 S10-11, S23 | one gait pass, a per-kind sheet | partly: gait_pose is model-agnostic (G-code:191-194); no sheet |
| Root allowance 0.3-0.6 m for NPCs | TLOU2 S11 | drawn root vs sim root | no [2nd reader: the same mechanism, a clamp of the body round the simulation, is held by sibling scout_motion_matching.md:58-59 (Clavet, 15 cm); not a ground file. In TLOU2 it bounds an animation-driven body, S43] |
| Limb searches for a grasp ahead when left behind, holds until left behind | Rain World 2d | hand on a wall, crawler | no: L188 step 5 calls its hand "ours" (plan_l188:27-31) |
| The player's limbs are cosmetic; only creatures couple to them | Rain World 2d | picture-only rule | yes: G-constraints_and_roster:33-53 |
| Pick the solver you can tune by hand | Hecker 2e §4.3 | two_bone, reach_leg | yes by construction, not stated |
| Compute a few points first; each level constrains the next | Boxerman 2f | ChaserPose -> BodyPose -> Rig | yes in structure (G-code:18-32), not named |
| Debug draw: candidates, costs, two stick figures | TLOU2 S48 | tools | no |
| Motion matching costs ~~0.5-1.0 ms a character~~ [2nd reader: a complete update 0.5-1.0 ms, old system 2-3 ms, parallelizable; unit not "a character"] | TLOU2 S83 | the budget | no |

## What I did not open

- Alien: Isolation at any primary (GDC 2015 Vault video; the 2014 PlayStation Blog post: 502, Wayback refused).
- Rosen's GDC 2014 and Jakobsson/Therrien's GDC 2016 talks (video); the original Japanese Trico slides on slideshare;
  the GDC 2006 SotC audio; the TLOU2 deck's images and videos (I read only its text by range requests).
- Hecker 2008 beyond section 4.3 and the abstract; the Wampler, Wilson and Usherwood papers.
- The other scouts' files beyond the lines cited; E's local L185 clone; branches l205-stomp-c and l185-skeleton.
- In the game: `game/world/figures.cpp`, `world_app.cpp` beyond the ground files' lines, any test body, any .glb.
- I ran no game tool and no build; nothing was measured. The 7.85 degrees and the per-model GPU share are inferences.

## Second reader

Line numbers are the scout's original lines (before my in-place marks). Outside primaries were downloaded with curl and read
in whole lines: the Trico deck (Google Docs txt export, 1,002 lines), the Game Watch page (UTF-8 Japanese, article text),
the Rain World devlog page, Game Developer's Gibbon article, the Spore PDF (pdftotext), and the TLOU2 pptx (zip directory
by HTTP range; 89 slide and 58 notes XML read as text). Game code: dreamzone-3 main 31d1c6d, `git show main:<path>`.

| line | claim | primary opened | verdict | evidence |
|---|---|---|---|---|
| 56 | frame order AI to rendering | Trico deck | OK | line 243 "AI -> animation -> procedural animation ->physics -> fur -> rendering" |
| 58 | PA modules; body, legs, head, fingers | Trico deck | OK | lines 525-536 |
| 60 | few assets; walk a loop of 4 motions | Trico deck | OK | lines 511, 619 |
| 62 | spine bends to AI Bezier; angle limited | Trico deck | OK | lines 556, 570-571 |
| 64 | foothold at lift, pin, slip eased, posture, ceiling | Trico deck | OK | lines 585-704 |
| 68 | FK replaced by Lion Dance, Unity | Trico deck | OK | lines 725-748; "replaced" is the scout's word, deck says "early in development" |
| 72 | interest values choose where the head looks | Trico deck | DOWNGRADED | ch. 2 is the AI attention target; no slide links it to the head |
| 74 | barrel held between jaws by collision | Trico deck | OK | lines 798-800 |
| 76 | PA summary quotes | Trico deck | OK | lines 876-878 |
| 78 | no cost figure in deck | Trico deck | OK | no ms or per-frame figure in the 1,002 lines |
| 50 | whole deck read, fan translation | Trico deck | OK | lines 11-13 give the fan-use disclaimer |
| 90 | programmer parameterises, others tune; Excel table | Game Watch | OK | article text, Sugiyama and Hosono sections |
| 93 | 920, 119, 85 motions | Game Watch | OK | Hosono's part |
| 94 | up to 12 layers on the player | Game Watch | OK | the report adds that programmers did not build it |
| 96 | cap speed and acceleration of the floor colossus | Game Watch | OK | item 1 |
| 98 | per-bone terrain formulas from foot height and stick | Game Watch | OK | Tanaka's part |
| 101 | animator sets bone lock ON/OFF; ICO tool failed | Game Watch | OK | item 4 |
| 103 | pendulum joints, layer, IK on a swung climber | Game Watch | OK | item 6 |
| 106 | 8-direction neck tilt layered over motion | Game Watch | OK | Sugiyama's close; the report also warns parameters can go "multidimensional" and untunable, unmentioned |
| 108 | weight over response; landing picks 1 of 4 | Game Watch | OK | Tanaka and Hosono parts |
| 117 | pptx is 4,043,914,625 bytes | curl HEAD | OK | Content-Length header |
| 117 | 147 slide and note entries | pptx zip directory | OK | 89 slide + 58 notes XML |
| 124 | Motion Model, spring, params, 0.3-0.6 m | TLOU2 S4, S9, S11 | OK | S11 "NPCs 0.3 - 0.6 m ... Player None"; it clamps an animation-driven body |
| 127 | steering, time scale 10-15% on spring, soft clamp, foot pin | TLOU2 S41-S44 | OK | text matches |
| 130 | motion blend 0.2-0.3 s vs animation 0.4-0.6 s | TLOU2 S45 | OK | exact |
| 131 | same androgynous move sets across sexes | TLOU2 S23 | OK | exact |
| 133 | corners: weightless, slow down by angle | TLOU2 S61-62, notes | OK | note "feel weighty and realistic" |
| 136 | horse slope IK, sprung chain | TLOU2 S81 | OK | exact |
| 138 | 2,627 clips 2h17; 6,050 clips 6h34; dog keyframed | TLOU2 S20, S27, S75 | OK | exact |
| 140 | search 0.1 ms; update 0.5-1.0 ms; old 2-3 ms | TLOU2 S83 | OK | numbers exact; also "Can be parallelized" |
| 141 | cons: memory, upfront cost, mocap stage | TLOU2 S85 | OK | exact |
| 143 | debug draw: candidates, costs, two figures | TLOU2 S48 | OK | exact |
| 247 | MM cost "per character per update", a third of a frame | TLOU2 S83 | DOWNGRADED | no per-character unit; console; replaced a 2-3 ms system |
| 152 | player 2 points, lizard 3, limbs chained | Rain World devlog | OK | post of 2013-06-05 |
| 158 | search mode; propulsion by limbs; player cosmetic | Rain World devlog | OK | posts of 2013-06-05, 07-02 |
| 147 | "creatures of many body plans" | Rain World devlog | DOWNGRADED | 2013 Director prototype, two bodies, not the shipped system |
| 170 | CCD and Jacobian solvers slower, less tunable | Spore PDF 4.3 | OK | "slower and less amenable to tuning" |
| 168 | solver after goals, then Jiggles | Spore PDF abstract, 1 | OK | "passive secondary animation is added for aesthetic appeal" |
| 180 | COM to 5-point to 14-point to display rig | Gibbon article | OK | "David's approach" paragraph |
| 184 | grab arm perpendicular to velocity | Gibbon article | OK | exact, for ricochetal brachiation |
| 176 | Boxerman is "the same author" | Gibbon article | WRONG | by Boxerman, about Rosen's prototype for a gibbon runner |
| 212 | hunter's head is turned up from the base | model_rig.h:105-107, :128 | WRONG | head takes the whole look, trunk 0.4225 (ozz look-at); only gait twist rides the thorax |
| 214 | c.head_twist = 0.55 x thorax + look at :615 | model_rig.cpp main | OK | line 615 reads exactly that |
| 218 | 14.28 x 0.55 = 7.85 degrees each way | model_rig.h:143-144 | OK | 0.24915 rad = 14.28; arithmetic holds; it is partial stabilisation |
| 238 | head is the FK chain's last link Tanaka replaced | Trico deck, model_rig.cpp | UNSUPPORTED | rig has no neck chain; the deck's FK is neck joints in order |
| 234 | head_hold 1 = Lion Dance, sourced to Tanaka | Trico deck | UNSUPPORTED | deck has no hold or share; mechanism is [ours]; origin is T2 in the record |
| 266 | stage.cpp:267, :283; kFigureSlots 7 values, Dark 0 | main 31d1c6d | OK | archetype.h:17-27 has 8 kinds incl. Dark; array has 7 |
| 244 | two models +0.39 ms avg, +0.48 p99 | p-d663-loader-C:134-139 | OK | measured for kid and hunter; per-model 0.2 is the scout's [inferred] |
| 224 | "perhaps the head moves first when you look..." | brief:1128 | OK | verbatim in item 163 |
| 222 | L188 step 3 head-first look planned | plan_l188:22-25 | OK | "The head leads, the chest follows with a lag" |
| 45 | no licence text is published with the pages | Game Watch, Spore PDF | DOWNGRADED | both carry copyright notices; conclusion (ideas only) holds |
| 37 | 0 files name Trico, TLG, Rain World, SotC | grep -rliE exo_memory | OK | re-run: 0 files for each (outside this swarm folder) |
| 40 | Alien: Isolation only in one secondary article | grep -rliE exo_memory | DOWNGRADED | 7 files, incl. research_ambush:32 [read] and research_learning_hunter:25 |
| 5 | sources "agree": layering, few numbers, head first | all above | DOWNGRADED | 920 motions, 2,627 clips; head-first is Trico alone |
| 260 | grab arm rule fits hands in the table | Gibbon article | DOWNGRADED | gibbon swing with an aerial phase; no source for a runner |
| 353 | Rig::palette :353-358, world_app.cpp:528-537 | main | OK | both match |
| 273 | run_length_s at p-d673-overtime-A:62 | handback | OK | line 62 names it |
| 283 | no "before" older than a fix (his 216) | brief:1603-1606 | OK | matches |
| 287 | his 169: hunter T1, head stays humanlike | G-his_words:413-418 | OK | verbatim |

Tally: 59 claims checked. OK 48. DOWNGRADED 7 (lines 72, 247, 147, 45, 40, 5, 260). WRONG 2 (176, 212).
UNSUPPORTED 2 (238, 234). RE-DERIVED 2 against ground files, one more against a sibling scout:

1. "Decide the head first, neck after" (2a lesson, table row 2, 3b): ground_code.md:123 (look weights, ozz),
   ground_physics_and_fp_body.md:245 ("steps 3 head-first look ... owed"), ground_his_words.md:341 ("head-first steering").
2. `head_hold` (3c, 3e): ground_locomotion_and_yardstick.md:156 and ground_his_words.md:416, the T2 "bird head hold".
3. (sibling, not a ground file) `root_allowance`: scout_motion_matching.md:58-59, Clavet's 15 cm clamp.

### What the design could do and still pass

- First row, `in_overtime_the_dark_one_is_drawn_in_the_hunters_shape_every_frame_it_is_in_view`. It counts frames with a Dark
  pose within 40 m and "no posed model". Cheapest pass that does not do what it is for: call `pose_model` for the Dark's pose
  with the rest pose or a frozen phase. The row never checks that the gait runs, that the transform is at the Dark's place,
  or that `hunter_.away` is false, so a posed-but-hidden or T-posed figure turns it green. Two more holes: "within 40 m" is
  not "in view" (behind a wall counts); and the Hunter and the leavers stay posed for a time in overtime (the hand-back says
  they "walk away"), so under "first Hunter, else Dark" the Dark may stay unposed and the row cannot go green, or the rule
  quietly gives the Dark priority, a change the scout did not state. [inferred]
- Second-lap row (head yaw within X of its look on a steady look): met by setting head yaw = look and ignoring the chain;
  it does not test that neck and chest stay joined or that the stare reads humanlike (his eye, 169).
- No source and not marked [ours]: the head_hold "sourced default" (3c source column); "1 = Lion Dance" (3c); T2 kinds
  "set head_hold 1" (3e) is [ours] only through the section heading; the reading of 7.85 degrees as a defect (3b) is
  [inferred] yet is used as the case for the change. All marked in place.
- `root_allowance`: TLOU2's 0.3-0.6 m bounds an animation-driven body around its Motion Model (S43). Here the sim moves the
  body and the picture follows, so the number does not transfer; default 0 (off) is right.

### Could not check

- GDC 2006 SotC "audio only" (2b, [summary] web search): not opened.
- The original Japanese Trico slides and the TLOU2 images and videos: not opened; I read the same text layers the scout did.
- That slideN.xml order equals the deck's display order: not checked in presentation.xml; S4, S9, S83-85 read in sequence.
- Any GPU share per model beyond the measured +0.39 ms: no measurement; I ran no game tool.
- The per-id phase map and place_figures change: design only, nothing run.

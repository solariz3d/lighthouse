# Ground: physics-driven animation and the first-person body, as the room has them (ground reader, 2026-11-13)

1. The hunter's ragdoll is on main 31d1c6d only as the step-2 form: 22 KINEMATIC bodies, keyed to the drawn pose, read by nothing.
2. The upper-body physics layer (soft keyframe, tau 0.005/0.01 s, catch reaction 0.15 -> 1 over 1.0 s) is GREEN but on a
   local clone only (E's worktree dz3-e-l185, commits 2373283/8d41f04/2767855); none of those commits is in dreamzone-3's repo.
3. Every physics constant in it is [ours]; Jolt's soft-keyframe sample and Overgrowth's per-bone weights are the sourced mechanism.
4. First-person body on main: L161 procedural body, L174 eye-round-the-neck and pendulum arms, D659 proportions, D672 head/ring,
   L188 step 1 crossover/shuffle/toe-first feet (7 dials, all ours). L188 step 2-5 and the player's ragdoll (L186 K1/K2) are unbuilt.
5. No per-character per-frame cost has been measured anywhere in this record; the cost row R4.7 exists and has never been run.

**Marks.** `[read]` = I opened the file and saw it; record paths are relative to `C:/Users/nname/Desktop/lighthouse/exo_memory`.
Where a hand-back reports an OUTSIDE source's content, that content is `[summary]` (I did not open the paper or code); the fact that
the hand-back says it is `[read]` at the line given. Game code is dreamzone-3 main **31d1c6d** unless a branch is named.
Shorthand: `H183` = `handback/p-l183-physics-anim-E_2026-11-12.md`, `H185s` = `handback/p-l185-skeleton-E_2026-11-12.md`,
`H185r` = `handback/p-l185-step4-E_2026-11-13.md` (motors, red), `H185g` = `handback/p-l185-steps4-5-E_2026-11-13.md` (soft key,
green), `REG` = `loop/registration_l185_steps3-5_E_2026-11-13.md`, `H186` = `handback/p-l186-physics-player-E_2026-11-12.md`,
`H184` = `handback/p-l184-fpbody-research-B_2026-11-12.md`, `H174`, `H188`, `H161`, `H659`, `H672` the other hand-backs.

## 0. The owner's words that started this line (verbatim)

- [read] `briefs/dreamzone2_the_game.md:1118`, item 158: "it makes me think, wouldnt be ideal for what we want to make a physics
  engine itself that drives the procedural animations"
- [read] `:1120`, item 159: "the player animation needs to look smooth from first person perspective, when the player looks down
  at their legs and body/arms, they should move how a real person would, looking down at the side, the legs and feet criss
  crossing eachother, walking backwards, when the charater rubs up against a wall you see their arms and hands touch up against
  it as you move, the character must interact with the world dynamically too" (the item's opening clause is cut here, nothing else)
- [read] `:1122`, item 160: "hmmmmmmmm would there be a way to sort of mesh both techniques in a unique and cool way? if not do 1"
- [read] `:1124`, item 161: "physics could control the camera and controls, it would make sense to me if it is done right"
- [read] `:1127` (162) and `:1175` (173) are his PICKS written in the librarian's words, not quotes: 162 = "(a) plus the inertia
  dial" (K1 eye rides a simulated head filtered toward the springs, K2 physical reactions, K3 inertia on reversals, off by
  default); 173 = shoulder sliver on the look-back, a loose fist, the leading leg shown in a slide.

## 1. What is built, and where

### 1a. Commits (checked by `git cat-file -e` and `git merge-base --is-ancestor` against main 31d1c6d)

| work | commit / branch | on main 31d1c6d? |
|---|---|---|
| L161 procedural first-person body, boxes, look-behind (C) | `ab9d778` (branch l161-body) | yes [read: git] |
| L174 eye round the neck, pendulum arms (B) | merge `e3956cd` | yes |
| D659 body proportions (C) | `7fd38ee` (d659-body-c) | yes |
| D672 head tilt and neckline ring (C) | `95a962b` (d672-fp-c) | yes |
| L185 step 1 skeleton + step 2 hunter ragdoll, hard-keyed (E) | merge `682e699`, last row `5411ef0` | yes |
| L188 step 1 feet sideways and backwards (B) | merge `3e709ba`, CHANGELOG `8dda6d9` | yes |
| L188 step 2 (slide leg, shoulder-sliver row), UNRUN | `origin/l188-step2` `b676860` | no |
| L188 steps 3-4 WIP, "NOT TO LAND" | `origin/l188-wip-look` `a60944d` | no |
| L185 step 4 motors, stopped red | `47a14e9`, `370e3e6` | **not in this repo** |
| L185 steps 4+5 soft key, green; stage draws hunter through it; R4.7 row | `2373283`, `8d41f04`, `2767855` | **not in this repo** |

- [read] `git cat-file -e` reports 47a14e9, 370e3e6, 2373283, 8d41f04 and 2767855 MISSING from `C:/Users/nname/Desktop/dreamzone-3`;
  `git worktree list` has no l185 entry. [inferred] E's worktree `C:\Users\nname\Desktop\worktrees\dz3-e-l185` (H185g:12) is a
  separate clone; its work is "local only, not pushed, not landed" (H185g:12). I did not open it (rule 9).
- [read] `origin/l185-skeleton` is `b226b95`, the step-2 WIP; REG:14-15 calls it "an older backup". **A scout reading
  `l185-skeleton` for the upper-body physics layer will not find it there.**
- [read] `l205-stomp-c` (tip `900e3c4`, "The hunter no longer jumps when he stops or sets off…") is not on main.

### 1b. The physics layer's mechanism, in order

1. **Research, nothing built** (H183:5). The structure every source shares: an animation makes a target pose, per-joint
   controllers pull a simulated body toward it (H183:28-33) [read]. Lean: (a) reactions only; (b) physics-balanced locomotion
   left as research (H183:84-87) [read].
2. **The mesh (his 160)**, `loop/plan_l185_physics_mesh_2026-11-12.md:6-20` [read]: layer 1 SIMBICON foot placement inside the
   kinematic target (marked inferred/ours, :10); layer 2 per-bone strength, legs keyed, upper body following; layer 3 reactions
   drop the strength. "The lean stays in the target" so it can lead the turn (:11).
3. **Step 1, the skeleton** (H185s:26-42) [read]: `make_rest`, `to_rotations`, `to_positions`; its own quaternion (game/ may not
   use Jolt's, H185s:32); tree Pelvis->Chest->Neck->Head->Eye, arms off Chest, legs off Pelvis; roll taken from the pose's
   `right` / `chest_right` / `head_right`. Step 2 added a lower-spine joint, 22 joints (H185s:93-97) [read];
   `game/skeleton.h:35` `kSpineJoint = kJointCount` [read].
4. **Step 2, the hunter hard-keyed** (H185s:90-92) [read]: own `PhysicsSystem`, one kinematic body per joint, writes nothing to
   the sim, not drawn. On main: `game/ragdoll.cpp:99` "mMotionType = JPH::EMotionType::Kinematic"; `:138`
   `DriveToPoseUsingKinematics`; `:140` `m.system.Update(dt, 1, …)` [read]. Jolt stays out of `dz_game`; library `dz_ragdoll`.
5. **Step 4 on swing-twist motors: STOPPED RED** (H185r:16-18) [read]. Trunk, shoulders and elbows followed; forearm and hand
   did not at any stable setting (wrists 0.21-0.32 m, hands 0.45-0.61 m p95, H185r:43-45); 3x stiffness unstable, arms to 2.7 m
   (H185r:80-81).
6. **Mechanism changed to the soft keyframe** (plan_l185:47-58, ruled option (a)) [read]. Built GREEN (H185g:26-51) [read]:
   upper bodies (chest, neck, head, eye, shoulders, elbows, wrists, hands) dynamic; each step their velocity is a blend of the
   velocity that lands them on the keyframe in that step and their own, keyframe's gravity share removed; pelvis, lower spine and
   legs stay keyed. Drive renamed `UpperOnMotors` -> `UpperSoftKeyed`. Step 5: `react()` called on the frame the run enters
   `Ended` (the catch). Stage path: pose -> `Ragdoll::key` -> `drawn_from` -> palette (H185g:46-51).

### 1c. Strengths and time constants, with where each came from

| quantity | value | record | origin |
|---|---|---|---|
| bodies / constraints | 22 / 21 swing-twist | H185s:101 | ours (the skeleton) |
| motor frequency, damping (step 4, abandoned) | trunk 8 Hz, arms 5 Hz; zeta 1.0 and 0.5 | H185r:58; REG:39 | ours, registered before the first run |
| motor sizing (abandoned) | `StiffnessAndDamping`, k = I*w^2, c = 2*zeta*I*w, I = inertia of every body below the joint | H185r:55-57 | ours, changed after the first run (Jolt's frequency mode sized by two bodies only, held pose sagged 0.85 m) |
| solver iterations, ragdoll system | 30 velocity, 10 position (Jolt default 10 and 2) | H185r:67; H185g:43 | ours, after measurement (60 gave nothing more) |
| soft-key blend | s = strength * (1 - e^(-dt/tau)) | H185g:35 | form ours; drive from Jolt `SoftKeyframedRigTest.cpp:40-91` [summary] |
| tau | trunk **0.005 s**, arms **0.01 s** | H185g:36 | ours, changed after first run from 0.02/0.06 (R4.3 red) |
| catch reaction | strength to **0.15** at once, back to **1 over 1.0 s** | H185g:38; REG:79-80 | numbers ours; shape from Overgrowth `aschar.as:4850-5110` [summary] |
| ragdoll step | the frame's dt clamped to 1/1000-1/30 s | H185g:50 | ours |
| re-placement | when the pose jumps over 1 m in a frame; bodies take the keyframe's velocity on the next step | H185g:49, :41-42 | ours |
| per-bone weight idea | per-bone physics weight x script strength | plan_l185:13 | Overgrowth `riggedobject.cpp:1276-1293`, Apache-2.0 [summary] |

Reference values the sources gave, none adopted [summary via H183]: SIMBICON kp up to 1000 at the waist, 300 elsewhere,
kd = 0.1 kp, ODE step 0.005 s (H183:39); Overgrowth `ragdoll_strength = min(0.8, |v| x 0.1)` while falling (H183:32);
DeepMimic policy 30 Hz, physics 1.2 kHz (H183:31). REG:97-98 says SIMBICON's foot-placement gains (cd, cv) were NOT recorded by
L183 and must be read from the paper's table before step 3, else marked ours [read].

### 1d. The first-person body's parts (all on main 31d1c6d)

- **Procedural body** `game/body.{h,cpp}`, ticked once per sim tick after the rig, hangs FROM the camera: head joint = rig's eye
  (H161:28, :40) [read]. Feet off `rig.stride_phase()`, planted foot fixed, hips sink at most 12 cm (H161:43-47). Moves: jump,
  slide, vault, climb, wall-run, ladder, dive, roll (H161:49-57). Blends about 0.05 s; hand/foot targets, knees and elbows
  inertialized over about 0.06 s; knees/elbows bend as hinges about the body's right (H161:58-61) [read].
- **Look-behind** (H161:68-72) [read]: action `LookBack` (V); eased 0.09 s in, 0.13 s out; +2.9 rad yaw, pitch levelled by 55%
  plus 0.06; view only; `glanced()` turns chest and arms 50 deg about the neck. The hand-back attributes these to the first
  game's `dreamzone-rt/src/main.cpp:7233` and `:7339-7340` [read]; I did not open that file.
- **Eye round the neck** (L174): `glance_eye_offset = neck_back x (right sin a + forward (cos a - 1))`, 17.7 cm back at the full
  glance (H174:17) [read]; declared `game/body.h:159` [read].
- **Arms as a pendulum of the stride** (L174): `cos(leg phase - mid-stance + pi*duty)` (H174:23) [read]. Replaced the arm copying
  the other foot's `reach`, which held then snapped 12-16 cm in one 1/144 s frame (H174:21-22).
- **Proportions** (D659, H659:11-15) [read]: neck_to_pelvis 0.54 (was 0.60), hand 0.20 (was 0.17); eye_to_neck 0.13, neck_back
  0.09, shoulder_drop 0.12, shoulder_half 0.19, hip_half 0.10, upper_arm 0.30, forearm 0.27, thigh 0.46, shin 0.45,
  ankle_height 0.07, foot 0.22. Planted leg kept 2 mm short (`leg_reach = thigh + shin - 0.002`, H659:22).
- **Head and ring** (D672, H672:19, :36) [read]: `game_rest(rest, build)` puts the rig's rest Neck at Eye - 0.13 up - 0.09 back;
  the eye hides head, neck and eye BY WEIGHT plus the hood by mesh name (`kFirstPersonHidden`); no cut by height.
- **Feet sideways and backwards** (L188 step 1, H188:38-49) [read]; `game/body.h:177-183` [read]: `kCrossoverSpeed` 2.7 m/s,
  `kCrossoverBlend` 0.4 m/s, `kCrossoverOffset` 0.12 m, `kCrossoverReach` 0.12 m, `kShuffleGap` 0.14 m, `kBackToeDown` 15 deg,
  `kBackLift` 0.7. All ours; the sources give the shapes only (Kuntze 2009, Balasukumaran 2020; H188:58-60).
- **Wall-hand hook, unused**: `struct HandOverride` `game/body.h:93`, `set_hand_overrides` `:113` [read]; "Nothing calls it yet"
  (H161:80) and still nothing sets it per H184:90 [read].
- **Physics for the player: none.** No player ragdoll exists (REG:25-26; H185g:137) [read].

## 2. What was researched, and whether at source

| source | for | read how (as the hand-back says) | licence as recorded |
|---|---|---|---|
| Jolt v5.6.0 Ragdoll, MotorSettings, Architecture.md, samples | L183, L186 | at source, local submodule (H183:18; H186:16) | MIT |
| Overgrowth `aschar.as`, `riggedobject.cpp` | L183, L185 | at source (H183:19) | Apache-2.0 per GitHub's field; art not open |
| Overgrowth `ledgegrab.as:197-215`; ozz two-bone IK `ik_two_bone_job.h:93-96` | L184 wall hand | room ground from L176, not re-read (H184:33, :87-88) | Apache-2.0; MIT |
| SIMBICON, SIGGRAPH 2007 | L183, L185 | whole paper, pdftotext of the authors' copy (H183:20) | ACM; cited only |
| Geijtenbeek & Pronost 2012 survey | L183, L186 | whole paper (H183:21) | authors/EG/Blackwell; cited only |
| DeepMimic 2018 | L183 | whole paper (H183:22) | arXiv; code repo MIT |
| DReCon 2019 | L186 | whole paper, pdftotext (H186:18) | ACM; cited only |
| Techland "All about zombies" 2025 | L183 | NOT re-read; via C's L179 hand-back (H183:23) | Techland |
| Euphoria / GTA IV | L183 | press only; no developer text (H183:24) | press |
| Mirror's Edge, GDC 2009 slides | L184, L186 | text through a fetch tool, images not seen (H186:20; H184:18, "read, extracted") | all rights reserved |
| Mirror's Edge Catalyst (EA news 2015) | L184 | read, extracted (H184:19) | EA |
| Dying Light: Gamasutra 2016; MCV 2016 | L184 | read, extracted (H184:20-21) | all rights reserved |
| Kulon GDC 2018 parkour; Rosen GDC 2014 stride wheel | L184 | video only, not read (H184:22, :31) | GDC |
| Garry Newman, "Rusty legs" (Rust devblog 74) | L184 | read, re-fetched by B (H184:23) | blog, all rights reserved |
| Star Citizen (Tracy interview; RSI comm-link) | L184 | read, extracted (H184:24) | press / CIG |
| Kuntze, Sellers & Mansfield 2009, crossover stepping | L184, L188 | read, re-fetched by B (H184:25) | CC BY-NC-ND 4.0 |
| Balasukumaran et al. 2020 backward walking | L184, L188 | grep of full-text XML (H184:26) | CC BY 4.0 |
| PMC7664179 (2020); Dewolf et al. 2021 | L184 | grep of full text (H184:27-28) | CC BY 4.0 |
| Donno et al. 2023 | L184, L188 `kBackLift` | abstract only (H184:29) | not seen |
| Holden, "Code vs Data Driven Displacement" 2021 | L184 | read, extracted (H184:30) | all rights reserved |
| Valve "Blend sequence" wiki | L184 | 403, not read (H184:32) | unknown |
| Tarkov inertia; Human: Fall Flat; Exanima | L186 | press only (H186:21-23) | press |
| Arma inertia; Gang Beasts | L186 | not read (H186:24) | — |
| Not found at all | L184 | Naughty Dog hand-on-wall, Techland hand IK, Tarkov/Arma/Bodycam/Trepang2 FP body, any shuffle-to-crossover speed (H184:34) | — |

- [read] B flags that "[read, extracted]" quotes other than Rust's and Kuntze's came through a model-extraction fetch and
  "should be spot-checked before anyone quotes them outward" (H184:142).
- [read] The only outside quotes inside dreamzone-3 are two short phrases, Kuntze and Balasukumaran (H188:62).
- Key findings, as recorded [summary of the sources via the hand-backs]: physics pays for REACTIONS, shipped games keep upright
  running kinematic (H183:45-46); SIMBICON's lean "always reacting … rather than anticipating" (H183:39), so the lean stays in
  the target (plan_l185:11); Jolt calls a kinematic `CharacterVirtual` the right player controller (H186:29); Mirror's Edge
  tried "parent the camera to the head" and found it "not very good" (H186:38); DReCon's best reversal is about 1.5 s (H186:41).
- [read] E's own correction: L183's "the player's body must stay picture only" was an inference from one line made a rule;
  narrowed in L186 to the CONTROLS only (H186:85).

## 3. Registered rows and measured values

**L185 step 1, skeleton** (H185s:50-56; game_tests 166/0 on f155b58) [read]

| row | measured | bar |
|---|---|---|
| rest pose identity, rebuilds | 0.000000 rad, 0.000000 m | 1e-3 rad, 1e-4 m |
| rigidly moved rest pose = one root rotation | 0.000000 rad; 0.000004 m | 1e-3 rad, 1e-3 m |
| whole gym run (7,577 ticks): first-child bones | 0.040 deg (Neck) | 0.5 deg |
| rebuilt joint vs stretch above + 1 cm | 0.0000 m past; raw error up to 0.109 m | 1 cm |
| glance held | 0.044 deg; 1.11 / 1.85 cm past (HipL); after the spine joint 0.0000 m, bar back to 1 cm (H185s:105) | 0.5 deg, 2 cm then 1 cm |

Measured limits of a rigid tree vs the procedural body (H185s:66-69) [read]: trunk stretch up to 0.109 m (hip sink); shoulders
hang off the neck, chest->shoulder direction swings up to 8.6 deg.

**L185 step 2, hunter keyed** (H185s:101-104; ragdoll_tests 3/0, game_tests 168/0) [read]: key holds within 0.000008 m and
0.0000 deg (bar 1 mm, 0.1 deg); pose-equal 0.0013 m past the stretch (bar 1 cm); same bits twice. Mutants 6 applied / 6 caught
(H185s:147); landing: 12/12 suites, dz-gym 26/26, dz-world 52/52 (H185s:156-158).

**L185 steps 4-5** — registered in REG:45-87 before code; measured, motors (H185r:29-37) then soft key (H185g:59-67) [read]

| row | bar | motors (red) | soft key (green) |
|---|---|---|---|
| R4.0 round-trip | 1 mm, 0.5 deg | 0 | 0 |
| R4.1 his 16 kept runs byte-identical | 0 differ | — | 16 identical, 0 differ (H185g:106) |
| R4.2 legs stay keyed | 1 mm, 0.1 deg | 0.000010 m | 0.000010 m |
| R4.3 upper body follows | p95 5 cm, 15 deg; max 10 cm | 0.283 m, 65.2 deg, 0.577 m RED | 0.0069 m, 1.88 deg, 0.0624 m |
| R4.4 follow-through on 9->0 m/s stop | >= 5 cm past; <= 2 cm by 1.5 s | 0.430 m; 0.0136 m | 0.131 m; 0.0001 m |
| R4.5 stable 60 s | 30 m/s -> AMENDED; 0.5 m | 39.1 m/s, 0.600 m RED | 41.11 vs its bar 48.79 m/s; 0.135 m |
| R4.6 same bits | 0 of 14,400 differ | 0 | 0 |
| R4.7 cost | timed only with DZ_BENCH=1 | — | NOT RUN (H185g:120-128) |
| R5.1 strength | <= 0.15; 1 at 1.0 s | 0.150; 1.000 | 0.150; 1.000 |
| R5.2 visible | >= 2 x p95 | 1.237 m | 0.128 m vs 0.0135 m |
| R5.3 stable through catch | amended bar; 0.5 m | 1.237 m RED | <= 0.96 of bar; 0.128 m |

- tau sweep (H185g:73-80) [read]: 0.02/0.06 s p95 0.077 m, hands 0.454 m past; 0.01/0.03 -> 0.028, 0.315; 0.01/0.02 -> 0.015,
  0.243; **0.005/0.01 -> 0.007, 0.131** (first to pass R4.3's max). "His eye may want more swing than 13 cm" (H185g:82).
- R4.5 bar AMENDED by name to max(30 m/s, 1.25 x the body's own keyframe peak): the KEYFRAME itself moves 39 m/s because the
  drawn hunter's pelvis drops 0.120 m in one tick slowing through 0.1 m/s and rises 0.163 m setting off (H185g:85-93) [read].
- Mutants 5 applied / 5 caught (H185g:112); full build 14/14, dz-gym 26/26, dz-world 52/52 (H185g:99-101) [read].
- R3.1-R3.4 (step 3, SIMBICON feet) registered (REG:103-109), never built [read].

**L161 body** (H161:31-36, :83, :118-121) [read]: camera field-by-field over the whole gym run, 0 ticks differ; head within 1e-6 m
of the rig's eye; joint-jump bound 15 cm (worst 0.130 m, a 9.7 m/s dive), 25 cm for roll and slide (0.24, 0.15 m).

**L174** (H174:26-39, :16-18) [read]: neck, chest, both shoulders > 60 deg off the view axis at the full glance (body covered
11.3 / 12.1 % before, 0.0 % after); hands never step > 3.5 x mean (old 5.83/6.09, new 2.52/2.54; bar set after the run from 2.5).

**D659** (H659:25) [read]: standing knees straight, bar 8 deg; red 38.4, green 7.6. **D672** (H672:22-24) [read]: head turn with
the game's neck, red 8.71 deg, green 0.00.

**L188 step 1** (H188:66-88) [read]: jog crossover (amended to a 4 s walk, 3 midline crossings, trailing ankle leads by 8 cm at
each change of sides); left ankle -0.378 to 0.382 m across the pelvis, ankles never nearer 0.341 m; slow strafe shuffle;
backward toe-first. game_tests 171/0. **Step 2 rows** (`in_a_slide_the_leading_leg_comes_into_the_picture_early`, red on
c9d520e; shoulder-sliver row registered red) unrun (H188:7-13).

**Registered elsewhere, never built** [read]: L184 rows 1-4 (strafe, backward, wall hand within 5 cm of the plane in half the
in-reach ticks, camera; H184:125-137; rows 1, 2, 4 became L174/L188 rows, row 3 is L188 step 5); L186 tests (a) replays
byte-identical, (b) camera_effects 0 = today's eye to the mm, (c) aim = input every tick, (d) K3 at 0 changes nothing
(plan_l185:41-45); L186's bars 1-4 (plan_l186:10-14).

## 4. Owed, out of scope, stopped — with the reason

- **L185 steps 4+5 not landed**: needs his eye on the clip `C:\Users\nname\Desktop\worktrees\clips_L185\index.html`, then a
  landing pane; C reads the stage line first (H185g:20, :132-133) [read].
- **R4.7 cost not timed**: the librarian's rule withdrew frame-time runs until the Third Place's GPU runs end (H185g:122-124) [read].
- **L185 step 3 (SIMBICON feet) waits for C's L205**: both edit `gait_pose`'s motion block, `model_rig.cpp` ~:411-470 (REG:19-24;
  H185g:136) [read]. L205 is not on main [read: git].
- **Step 5's player half and step 3's player gait: OUT** — no player ragdoll; that is L186 steps 2-4, not in the packet
  (REG:25-29; H185g:137) [read].
- **L186 K1/K2 (eye from a head body, physical reactions) and K3 dial: picked (item 162), unbuilt**; order after L185 steps 1-2
  (plan_l185:35-45) [read]. L188 says physics "comes after these. It is not in this lap." (plan_l188:33) [read].
- **K3/K4 (physics in the controls) not recommended**: fails bar 1 by design; DReCon reversal ~1.5 s (H186:47-50) [read].
- **(b) physics-balanced locomotion not taken**: research only, no shipped source (H183:84-87) [read].
- **Hunter pelvis jump** (0.120 m drop / 0.163 m rise in one tick) sent to C as `p-l185-pelvis-jump-note-E_2026-11-13.md`
  (H185g:93-94) [read]; [inferred] l205-stomp-c's tip subject reads as that fix; not opened.
- **Fingers**: 8 finger joints proposed by B; E said yes with 7 changes (fingers stay out of the ragdoll, 22 bodies kept; C's
  joint map +8 in the same commit; every pose producer sets them; clench OURS) (H185s:7-15; H188:22-25) [read]. Unbuilt; the
  loose fist waits on it.
- **L188 step 2 parked** (`b676860`, rebase needed; `kSlideLeadReach` 1.15, `kSlideLeadLift` 0.20 OURS; sliver design worked
  but untested, H188:5-21); **steps 3 head-first look, 4 slide-blend hitch, 5 hand on wall** owed; WIP 3-4 on `a60944d`
  (H188:166-171) [read].
- **L174 left for him / next lap** (H174:85-110) [read]: open V hand; slide shows no leg; no shoulder on look-back; renderer smear
  (no motion vectors for moving objects); run-to-slide wrist hitch 4.3 / 5.3 cm a frame.
- **L161 not right yet** (H161:96-104) [read]: climb grip guessed at eye +0.12 m (state has no ledge height); bot's quarter-turn
  yaw snap; slide kick 0.15 m and roll tuck 0.24 m a tick.
- **D672 open** (H672:54-55) [read]: how much of himself the player sees is a design call; hood hidden by mesh name, fragile to
  re-export. **D659**: the 2 mm leg margin left alone (H659:43).
- **L186 not measured**: our controller's reversal time (H186:79) [read]. **L188**: capture comment "about a stride" should read
  "about one step" (H188:173).
- **L185 step 2 mutation run** first failed on a path bug, then a memory stop; rerun later 6/6 (H185s:113-116, :147) [read].

## 5. Every cost figure recorded

- **No per-character per-frame time has been measured in any of these files** [read, all 17 files opened].
- L183 §5, read not timed (H183:70-75) [read]: Jolt "Human" ragdoll 23 swing-twist constraints, about 24 bodies (grep count);
  Jolt's own performance scene 160 powered ragdolls (a benchmark, not our machine); ours inferred at 10-12 ragdolls of about 14
  bodies; `CROSS_PLATFORM_DETERMINISTIC` about 8% slower per Jolt's docs, already on in our build.
- Built ragdoll: 22 bodies, 21 constraints, 30 velocity / 10 position iterations, one `Update` per frame with dt clamped
  1/1000-1/30 s (H185g:41-50) [read]. [inferred, E's] "one velocity set per upper body per step, plus the solver's 30/10 steps
  over 22 bodies" (H185g:127). R4.7 measures median us per `key()` and `read()` when `DZ_BENCH=1` (H185g:125-126).
- L161: "16 more moving instances. Not timed" (H161:108) [read].
- D672: the head's hidden group is 68,786 triangles; `kid.glb` is 25,634,852 bytes (H672:38, :12) [read].
- Not frame costs, build/test only: L174 landing 644.35 s (H174:51); L188 landing 1092.05 s with per-suite times and private
  memory peaks (chase_tests 2546 MB, dz-world selftest 2062 MB) (H188:121-157) [read].
- L186: none (H186:79) [read].

## What I did not open

- E's clone `C:\Users\nname\Desktop\worktrees\dz3-e-l185` and its commits 2373283 / 8d41f04 / 2767855 (rule 9; not in the main
  repo), so the soft-key code itself is known only from H185g.
- The clip `worktrees\clips_L185\index.html`, every capture folder and contact sheet named above.
- Any outside source (papers, Jolt, Overgrowth, slides, press): all source content above is [summary] via the hand-backs.
- `handback/p-l185-pelvis-jump-note-E_2026-11-13.md`, `handback/p-l205-stomp-C_2026-11-13.md`, the L179/L176/L180/L181 hand-backs
  and plans, `dreamzone-rt/src/main.cpp`.
- In dreamzone-3: only `git` object checks and greps of `game/ragdoll.{h,cpp}`, `game/body.h`, `game/skeleton.h` at main; I did
  not read `body.cpp`, `camera.*`, `model_rig.*`, `stage.cpp` or any test file.

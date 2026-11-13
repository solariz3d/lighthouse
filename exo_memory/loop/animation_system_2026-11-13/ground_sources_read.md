# Ground: the outside sources the room has already read for animation (a ledger, not a design)

1. 36 outside sources are named across L169-L181's hand-backs and plans; about 18 were read at source, the rest named.
2. Landed on main from them: Overgrowth's tilt, Valve's facing and head, ozz's look spread, Holden's half-life damper,
   the first game's chain shares, two gait studies' twist amplitudes, Alexander's stride law (all in game/model_rig.*).
3. Built but NOT landed: Overgrowth's feet with memory (branch l180-lap2-rest 55d1451). Planned, not started: per-chaser
   rate variation (Valve npc_fastzombie 0.9-1.1), stumbles as smoothstep gestures, the climb by Overgrowth's grips.
4. Twelve corrections stand in the record; the biggest: Overgrowth's 0.7/0.5/0.4/1.0 are balance translations, not bank
   shares; its foot clamp caps lag, not per-frame movement; Valve's ENTINDEX_PLAYBACK_RATE is never used.
5. Owed and unread: Rosen's talk itself, Bollo's and Holden's talks, Clavet, O3DE's blend space, Weyand 2000, Dorn 2012,
   Alexander & Jayes 1983, Ford 2013's full text, every horde-game talk, L4D's own infected assets.

Ground reader, 2026-11-13. Read-only; nothing built or run. Marks: [read] I opened it; [summary] secondary or another
swarm file; [inferred] mine. Paths: `H/` = `C:/Users/nname/Desktop/lighthouse/exo_memory/handback/`, `P/` =
`.../exo_memory/loop/`. Game code was checked at dreamzone-3 main **31d1c6d** (2026-11-13 07:27 -0600) [read: `git log -1`].
Every "the record says" below is [read] of the hand-back or plan cited beside it; what a source itself contains is only
what the room reported, so for this swarm it is a secondary account unless a scout re-reads it.

Note on machines [read]: the hand-backs name worktrees under `C:\Users\zackn\Downloads\...` (another machine, "L").
Commit f33783f (L177) is not an object in this machine's repo [read: `git cat-file -t f33783f` → fatal]; 55d1451 is
(on origin/l180-lap2-rest) and is not an ancestor of main [read: `git merge-base --is-ancestor`].

## A. Code bases

### A1. Overgrowth (Wolfire) engine code
- **Licence as recorded:** Apache-2.0 for code; art, animations and levels NOT open ("can only be legally obtained by
  purchasing") [read: H/p-l176-openanim-C_2026-11-12.md:19]. Licence read from README :22-23 and file headers
  [read: same line]. Commercial use of the code: allowed keeping LICENSE and notices (as recorded, :19).
- **Read at source:** yes, fetched raw into L's scratchpad `l176/src/` [read: H/p-l176:13]. Files and lines read:
  `aschar.as:7921-7940` (HandleAccelTilt), `:4236-4241` (UpdateTilt), `:11726-11831` (HandleFootStance),
  `movementobject.cpp:2540-2686` (foot IK), `ledgegrab.as` (grips), `interpdirection.as:25-41` [read: H/p-l176:31-50].
  Later re-read: `aschar.as:13928-13930` (units) [read: H/p-l180-lap1-C_2026-11-12.md:11]; `movementobject.cpp:2627-2631`
  [read: P/registration_l180_lap2_rest_C_2026-11-13.md:11-14]; `:2680-2685` [read: H/p-l180-lap2-C_2026-11-12.md:131].
- **Taken into the game (landed):** the acceleration tilt, in `DrawnChaser` [read: H/p-l180-lap1:10-14]. On main:
  `kTiltAccelHalflife = 0.1126f`, `kTiltHalflife = 0.0548f` [read: game/model_rig.h:325-326 @31d1c6d]; the source
  comment [read: game/model_rig.cpp:503]. Target = 0.5° per m/s of velocity + 1° per m/s² of low-passed acceleration;
  off its feet the target is 0 and the acceleration decays 0.8 a frame [read: H/p-l180-lap1:11-13]. No hard clamp
  [read: H/p-l180-lap1:14]. Landed in add21fe [read: H/p-l180-lap1:138], an ancestor of main [read: git].
- **Built, not landed:** feet with memory, from `movementobject.cpp:2627-2631`, green at 55d1451, parked behind L200
  [read: H/p-l180-lap2-rest-C_2026-11-13.md:5-10]. The foot tilt to the ground normal (`:2647-2656`) was left out:
  our probe returns a height only [read: P/registration_l180_lap2_rest:25-27].
- **Not taken, and why:**
  - the 0.7/0.5/0.4/1.0 shares: balance translations, applied only while balancing, not a bank [read: H/p-l180-lap2:131-137];
  - `interpdirection.as` perpendicular pass: lap 1 used Valve's ConvergeYawAngles for the facing instead; the lap-1
    hand-back never mentions interpdirection [read: `grep -c -i interpdirection` H/p-l180-lap1 → 0];
  - the climb by grips (`ledgegrab.as`): planned as B's step 8 [read: P/plan_l180_animation_from_the_sources:57-62];
    its status is not in my files;
  - the source's own animations: not open data [read: H/p-l176:19].
- **Corrections:** see C1, C2, C3 below.

### A2. ozz-animation (G. Blanc)
- **Licence as recorded:** MIT (`LICENSE.md` and file headers) [read: H/p-l176:20].
- **Read at source:** yes: `samples/foot_ik/sample_foot_ik.cc:113-136`, `:207-255`, `:257-285`;
  `ik_two_bone_job.h:85-100`; `samples/look_at/sample_look_at.cc:106-160` [read: H/p-l176:71-82]. Later `:136-149`, `:466`
  [read: H/p-l180-lap1:22]. `ik_two_bone_job.cc:113-179` (soften) fetched at L191, master 744eb9d
  [read: H/p-l191-arm-shape-C_2026-11-13.md:128-130].
- **Taken (landed):** the look spread: head 1, upper spine 0.65, chest and shoulders 0.4225 [read: H/p-l180-lap1:22].
  On main: `kLookJointWeight = 0.35f` citing `sample_look_at.cc:466`, `kLookSpineShare`, `kLookChestShare`
  [read: game/model_rig.h:293-295 @31d1c6d].
- **Not taken:** `soften` in `reach_leg`; planned in L180 lap 2 step 5 [read: P/plan_l180:45], absent from both lap
  hand-backs [read: grep → 0 in H/p-l180-lap1 and H/p-l180-lap2], and not in the lap-2-rest registration's step 1
  [read: P/registration_l180_lap2_rest:23-36]. Its formula is recorded at H/p-l191:128-130. Foot IK on slopes (ankle on
  the hit normal): not taken; our probe has no normal [read: P/registration_l180_lap2_rest:26-27].

### A3. Daniel Holden, `orangeduck/Motion-Matching` (spring.h; database.h, controller.cpp, lmm.h)
- **Licence as recorded:** MIT for the code, by `gh api` SPDX id [read: H/p-l176:21]. Its bundled data is LAFAN1 (A8),
  not MIT [read: H/p-l176:21, :105].
- **Read at source:** `spring.h:9-21` (damper_exact by half-life), `:41-44`, `:63-110`, `:115-150`, `:162-211`
  (inertialization) [read: H/p-l176:93-97]. The motion-matching files were named, not reported as read line by line
  [read: H/p-l176:105].
- **Taken (landed):** the exponential damper by half-life, used for the tilt's two low-passes [read: H/p-l180-lap1:12];
  comment on main [read: game/model_rig.cpp:493 @31d1c6d].
- **Not taken:** the closed-form spring-damper, inertialization, quaternion slerp damper for the yaw (lap 1 hand-back
  never mentions slerp or quaternion [read: grep → 0]); motion matching (no data on this skeleton; L169 option D, "poor
  for a pack") [read: H/p-l169-anim-C_2026-11-12.md:144].

### A4. Daniel Holden, `orangeduck/Spring-It-On`
- **Licence as recorded:** MIT [read: H/p-l176:21].
- **Read at source:** `velocityspring.c:5`, `doublespring.c:5`, `controller.c:5-45`; titles only for `timedspring.c`,
  `extrapolation.c`, `tracking.c` [read: H/p-l176:99-103].
- **Taken:** nothing. The double or velocity spring was proposed for L173's hard rate cap [read: H/p-l176:132]; lap 1
  removed the cap instead of replacing it [read: H/p-l180-lap1:9, :14]; no mention of either spring in lap 1 [read: grep → 0].

### A5. Godot `scene/animation/animation_blend_space_2d.cpp`
- **Licence as recorded:** MIT (`gh api`) [read: H/p-l176:22]. **Read at source:** `:490-515`, `:645-700` [read:
  H/p-l176:117-119]. **Taken:** nothing; it fits only once clips exist [read: H/p-l176:123]; clips are out by his pick
  [read: P/plan_l180:67].

### A6. O3DE
- **Licence as recorded:** Apache-2.0 or MIT at our option (`LICENSE.txt` :1-5) [read: H/p-l176:23].
- **Read at source:** licence only; EMotionFX blend space not read [read: H/p-l176:121, :143]. **Taken:** nothing.

### A7. Source SDK 2013 (`ValveSoftware/source-sdk-2013`)
- **Licence as recorded:** SOURCE 1 SDK LICENSE (`LICENSE` :1-12), only for "a modified Valve game running on Valve's
  Source 1 engine"; for us **study only**, no line copied [read: H/p-l179-valve-anim-C_2026-11-12.md:22]. Commercial use
  of the code in this game: not allowed (as recorded).
- **Read at source:** `NextBotBodyInterface.h:68-119`; `NextBotPlayerBody.cpp:17-21`, `:133-147`, `:209-239`, `:296-315`;
  `NextBotGroundLocomotion.cpp:157-196`, `:331-360`, `:1413-1438`; `multiplayer_animstate.cpp:371`, `:1070-1092`,
  `:1221-1246`, `:1566-1683`, `:1716-1823`; `BaseAnimatingOverlay.cpp:162-188`, `:682`, `:758` [read: H/p-l179-valve:28-60].
  Later: `npc_fastzombie.cpp:1642-1646`, `npc_antliongrub.cpp:627-628`, a grep of 3,569 files at e1f1fd4
  [read: H/p-l191:132-136].
- **Taken (landed, restated, not copied):**
  - facing: ConvergeYawAngles, 720°/s, step scaled by angle left over 60° (min 1%), no overshoot [read: H/p-l180-lap1:18];
    on main `kYawRate = 12.566f` [read: game/model_rig.h:327], comment [read: game/model_rig.cpp:518];
  - head: up to 1000°/s, sine ease-out when dot > 0.7, 0.25 s ease-in [read: H/p-l180-lap1:19]; on main `kLookRate`,
    `kLookEaseIn` [read: game/model_rig.h:328-329]; "new look" = a > 30° jump in one tick is ours
    (`kNewLookJump`, marked ours) [read: game/model_rig.h:330]. Pitch at half rate not applied: no look pitch
    [read: H/p-l180-lap1:21].
- **Planned, not started:** per-chaser rate 0.9-1.1 from npc_fastzombie (step 2); stumbles weighted by
  `3w² − 2w³` from BaseAnimatingOverlay (step 3) [read: P/registration_l180_lap2_rest:38-56; H/p-l180-lap2-rest:10].
- **Not taken:** the slide (legs along velocity, facing to the target, move_x/move_y): waits on A's SLIP, lap 3
  [read: P/plan_l180:49-55]; the torso aim eyes − feet: "a facing rule", lap 1 already has Valve's facing
  [read: H/p-l180-lap2:143]; the head's lead and randomised tracking slop: not mentioned in lap 1 [inferred from
  H/p-l180-lap1:17-22]; arousal states picking gait sets: marked ours, unbuilt [read: H/p-l179-valve:83]; the nearest
  captured climb by height: needs clips [read: H/p-l179-valve:81].
- **Corrections:** C4, and C11 (the look bar).

## B. Talks, slides, articles, docs

### B1. Booth, "The AI Systems of Left 4 Dead", GDC 2009 (slides)
- **Licence as recorded:** © Valve, no open licence; cite, never copy [read: H/p-l179-valve:23].
- **Read at source:** L169 read it as text through readkong.com, the PDF would not render [read: H/p-l169:298]; L179 read
  the PDF streams (`booth_l4d.pdf`, sha256 6ae1af1f…), slide numbers approximate [read: H/p-l179-valve:17, :105].
- **Taken:** the Locomotion/Body split, which the game already had (chase moves, renderer poses) [read: H/p-l169:77-78].
- **Not taken:** the nearest-of-dozens captured climb (stream 37): needs clips [read: H/p-l179-valve:64, :81].

### B2. Valve Developer Community wiki ("Blend sequence"; L4D authoring docs)
- **Licence as recorded:** not determined; the copyright page returned 403 [read: H/p-l179-valve:24].
- **Read:** L169 cites "Blend sequence" as a source [read: H/p-l169:67-68, :299]; L179 says VDC refused its fetch and only
  search results were seen [read: H/p-l179-valve:67-70]. So the 9-way move_x/move_y convention rests on that page; the
  infected's own use of it is inferred, never confirmed [read: H/p-l169:69; H/p-l179-valve:103]. **Taken:** nothing.

### B3. Rosen, "Animation Bootcamp: An Indie Approach to Procedural Animation", GDC 2014
- **Licence as recorded:** GDC Vault, © speaker and GDC; not readable here [read: H/p-l179-talks-C_2026-11-12.md:14].
- **Read:** NO. Video only; never watched; known through its Vault listing (L169) and techarthub's list (B4)
  [read: H/p-l169:115; H/p-l179-talks:9, :83].
- **Taken:** step 3, "Acceleration tilt", cited as the second source for the tilt [read: H/p-l179-talks:56;
  game/model_rig.h:299]; step 4 "stride wheel" cited as the structure for the stride [read: P/plan_l181_kinetic_chain:63].

### B4. Nick Mower, "First, Do No Harm to the Gameplay", techarthub, 2026-03-10
- **Licence as recorded:** © techarthub, not shown; cited, not copied [read: H/p-l179-talks:15].
- **Read:** yes, its ten-step list of Rosen's talk, verbatim [read: H/p-l179-talks:25-35]; "13 keyed poses", layers each
  toggleable [read: H/p-l179-talks:37]. Third-party, not Rosen's text.
- **Taken:** step 3 (tilt) via the code; step 10 (spring between additive poses) only partly matches the code, see C5.

### B5. Game Anim (gameanim.com), 2018-03-04: the talk's abstract only [read: H/p-l179-talks:16]. Nothing taken.

### B6. Techland, "All about zombies" (Dying Light: The Beast), 2025-09-11
- **Licence as recorded:** © Techland S.A.; cited, not copied [read: H/p-l179-talks:17].
- **Read:** yes, the developer's own post: "active ragdolls … continue to react to momentum" [read: H/p-l179-talks:64].
- **Taken:** nothing. Active ragdolls need a physics body per chaser, out of scope [read: H/p-l179-talks:70;
  P/plan_l180:68].

### B7. Days Gone, "The Freak-O-System", GDC 2018 (Chisum, Karlsson); Altchar press
- **Read:** talk NOT readable (no slides, transcript or recording found); eight meshes varied in size, height and speed
  is press only [read: H/p-l179-talks:18-19]. **Taken:** cited as the second mention of per-body variation
  [read: P/plan_l180:42]; not built.

### B8. World War Z (Saber, "Swarm Engine"): interviews and marketing only, no technical text [read: H/p-l179-talks:20].

### B9. Dying Light (2015) infected: no talk found; Kulon GDC 2018 is on the player's parkour [read: H/p-l179-talks:21].

### B10. Assassin's Creed Unity, "Massive Crowd: AI Recycling", GDC 2015 (Cournoyer, Vault 1022141): behind the Vault,
not readable; it is about AI level of detail for crowds [read: H/p-l179-talks:22, :66].

### B11. Clavet, "Motion Matching and The Road to Next-Gen Animation", GDC 2016
- **Read:** NO; Vault listing and secondary write-ups only [read: H/p-l169:85, :291]. Nothing taken.

### B12. Holden, Kanoun, Perepichka, Popa, "Learned Motion Matching", SIGGRAPH 2020
- **Read:** cited as source with quoted phrases (memory scales linearly; foot locking and IK after) [read: H/p-l169:88-91];
  how much was read is not stated. Nothing taken (no data) [read: H/p-l169:97-98].

### B13. Holden, "Code vs Data Driven Displacement" (article)
- **Read:** index entry only, not the article [read: H/p-l169:92, :292]; still unread at L176 [read: H/p-l176:145].
  Its point is followed by construction: code moves the chasers, animation never drives them [read: H/p-l169:78].

### B14. Bollo, "Inertialization", GDC 2018 (Gears of War)
- **Read:** cited for the method (post-process from offset and velocity) [read: H/p-l169:93]; no hand-back says it was
  watched. The player's body (L161) already does a form of it (`kJumpBase`, `kSettleTime`) [read: H/p-l169:42, :94].

### B15. Epic, "Pose Warping in Unreal Engine" (documentation)
- **Read:** cited as source for stride and orientation warping [read: H/p-l169:111-114]; licence not recorded.
- **Taken:** nothing; the hunter's phase-by-distance already gives stride fitting "by construction" [read: H/p-l169:117-120].

### B16. Büttner and Clavet 2015: named only, as motion matching's origin [read: H/p-l169:87].

## C. Data sets (no clips in the game; clips are out by his pick, P/plan_l180:67)

| Source | Licence as recorded | Ship? (as recorded) | Read at source? |
|---|---|---|---|
| LAFAN1 (Ubisoft La Forge) | CC BY-NC-ND 4.0, README :8, `license.txt` :1 | Never: non-commercial, no derivatives | Yes, licence files [read: H/p-l176:24] |
| Mixamo (Adobe) | Royalty-free in games; no raw redistribution; no ML training | Baked in only | NO: Adobe FAQ 403, via search [read: H/p-l176:25, :141] |
| CMU Motion Capture Database | Reported free for research and commercial use | Probably (original BVH/ASF) | NO: site failed a certificate check [read: H/p-l176:26] |
| Quaternius Universal Animation Library | CC0 (Library 2 partly paid) | Yes, no attribution | NO: via search [read: H/p-l176:27] |

None taken [read: P/plan_l178_animation_rework_2026-11-12.md:9 "Data: none this lap"]. Retargeting onto MPFB's
`game_engine` skeleton untried [read: H/p-l176:149; H/p-l169:293].

## D. Biomechanics papers (L180 lap 2 = L181). Licences: none recorded for any of them [read: H/p-l180-lap2:49-171].
Their figures enter the game as measured constants, not as code or files [inferred].

| Source | Read? | Taken into the game |
|---|---|---|
| Alexander 1976, *Nature* 261:129, via Mazzetta & Blanco 2001 | Quoted paper read in full by pane E (p-l187) [read: H/p-l180-lap2:50-51] | Stride law λ/h = 2.3 (v²/gh)^0.3: `kStrideK 2.3`, `kStrideExp 0.3`, `kStrideG 9.81` [read: game/model_rig.h:339-352]; floor `kStrideFloor 0.1` is ours [read: :353]. Landed 0389b0a [read: H/p-l180-lap2:20] |
| Fukuchi et al. 2017, *PeerJ* 5:e3298 + Figshare 4543435 | Full [read: H/p-l180-lap2:60] | Check only, not the law (−0.6 to −11.1% vs the law) [read: :60-62, :71] |
| Miyashiro et al. 2019, *Front Sports Act Living* 1:37 | Full [read: H/p-l180-lap2:63] | Check only (−2.3% at 9.9 m/s); thigh range 30.85° said the leg swing is near a sprinter's [read: :63, :107-108] |
| Brennan et al. 2026, PMC13569467 | Full [read: H/p-l180-lap2:70] | Nothing; it disagrees: stride levels off above ~6 m/s [read: :76-77] |
| Perpiñá-Martínez et al. 2023, *IJERPH* 20(4):3631 | Full text via Europe PMC [read: H/p-l180-lap2:150-152] | Pelvis twist 6.50° each way: `kPelvisTwistAmp 0.11345f` [read: game/model_rig.h:142] |
| Ford et al. 2013, *Med Sci Sports Exerc* 45(6) | **Abstract only** [read: H/p-l180-lap2:153-157] | Thorax twist 14.28°: `kThoraxTwistAmp 0.24915f` [read: game/model_rig.h:143] |
| Preece et al. 2016 | Abstract only [read: H/p-l180-lap2:166] | Nothing; the pelvis lag is not modelled |
| Pontzer et al. 2009; PMC13341810 (one sprinter) | Abstract only; one athlete, qualitative [read: H/p-l180-lap2:100-101] | Nothing: arms left unchanged at lap 2 [read: :99-105] |

Main now carries later arm and leg sources (Otsuka 2016, Bruening 2020, Fukuchi's leg shapes) [read:
game/model_rig.h:182-186, :385-389]; they come from L190, L191 and L200, outside this file set.

## E. The first game (internal, the owner's own design): dreamzone-rt `src/main.cpp`
- **Not an outside source**, but it is the only source of the chain's shares [read: P/plan_l181:4]. Read at 9d98b64
  (C10) [read: H/p-l180-lap2:112-113].
- **Taken (landed da8d05d):** bank shares 1.0/0.35/−0.30 (:6655, :6662, :6669); pitch shares 0.5/1/1 (:6650, :6662,
  :6668); follow-through springs 0.13 s and 0.22 s (:6617, :6618); head twist share 0.55 (:6667) [read:
  game/model_rig.h:134-144 @31d1c6d; H/p-l180-lap2:129-170]. Springing the bank (not only pitch) is ours [read:
  H/p-l180-lap2:171].
- **Not taken:** its nod and bounce (no bounce spring) [read: H/p-l180-lap2:172-173]; its [TURNLEAN] from turn rate
  (the L173 flaw) [read: P/plan_l181:22]; its uncanny detuning (1.22× overspeed, asymmetric phase, pinned head),
  withdrawn after briefs 163, 168, 169 and E's L187 §8.3 [read: H/p-l180-lap2:313-329]; its "biomechanics ranges from
  research" carry no citation [read: P/plan_l181:33].

## F. The room's own numbers that later laps removed (not sources, but the record of what was ours)
- L170: `kGaitMaxLean` 0.42 rad (24°) cap, "my choice" [read: H/p-l170-anim-C_2026-11-12.md:26]; removed by L180 lap 1
  ("no hard clamp anywhere") [read: H/p-l180-lap1:14]. Outside foot 10 cm wider, ours, kept [read: H/p-l180-lap1:16].
- L173: turn-rate dead zone 0.5 rad/s, springs 6/s and 9/s, `kLeanMaxRate` 100°/s [read: H/p-l173-lean-C_2026-11-12.md:
  19-22]; all removed by L180 lap 1 [read: H/p-l180-lap1:9].
- L177: `turn_ahead`, `kLeadTime` 0.8 s, `kCornerArc` 2.5 m, release spring 10/s [read: H/p-l177-lean-lead-C_2026-11-12.md:
  43-45]; never landed, stopped by item 152 [read: H/p-l177:3-13]. Its timing row survives: +0.60 s lag on c83f8dc,
  +0.06 s on add21fe for his run [read: H/p-l180-lap1:28, :53].

## G. Corrections a later record made to an earlier reading
- **C1, Overgrowth tilt constants.** L176 gave time constants "about 0.16 s and 0.08 s" [read: H/p-l176:33]; plan L180
  carried those [read: P/plan_l180:24]. Lap 1 coded them as half-lives 0.113 s and 0.055 s and found the units are
  degrees [read: H/p-l180-lap1:11-12]. [inferred] Both readings agree: τ = 1/(120·−ln 0.95) = 0.162 s, half-life
  τ·ln 2 = 0.113 s; the plan's figures are time constants, not half-lives.
- **C2, Overgrowth's "balancing shares".** L176 called 0.7/0.5/0.4/1.0 the shares the hips, chest, head and arms take of
  the feet's offset [read: H/p-l176:40]; plan L181 listed them as a second source for the bank shares [read:
  P/plan_l181:25]. Lap 2: translations of IK key origins, only `if (balancing)`, not rotations, not while running; "the
  plan's line pairing them as two sources of one thing is a misreading" [read: H/p-l180-lap2:131-137].
- **C3, Overgrowth's foot clamp.** L176: "limited to ±0.1 m from the previous frame's" [read: H/p-l176:37]; plans L178
  and L180 made it "no drawn foot moves more than 0.1 m vertically in one frame" [read: P/plan_l178:24; P/plan_l180:46].
  The source clamps the remembered height to within 0.1 m of the new ground, then eases by 0.8 a tick: it caps the lag,
  not the movement (a 0.3 m rise moves the foot 0.22 m in one frame); half-life 26 ms at an inferred 120 Hz tick
  [read: P/registration_l180_lap2_rest:10-21].
- **C4, Valve `ENTINDEX_PLAYBACK_RATE`.** Cited for per-chaser variation [read: H/p-l179-valve:32; H/p-l179-talks:61;
  P/plan_l180:42]. Declared and never used in the public SDK (grep of 3,569 files); Valve uses random per-entity rates
  instead [read: H/p-l191:132-136; P/plan_l180:108-110]. The line also moved: :73 in L179, :74 in L191 [read: both].
- **C5, Rosen step 10 vs the code.** The talk's list says spring-damper between additive poses; the code read uses
  exponential `pow(k, frames)` easing, and the additive-pose spring was not found [read: H/p-l179-talks:46, :83].
- **C6, Valve has no lean.** `grep -iE "lean|tilt|roll"` of `multiplayer_animstate.cpp` finds no code [read:
  H/p-l179-valve:55]; Valve's "lean" is a slide, so the sources disagree with Overgrowth [read: :75]; he picked both,
  tilt first [read: P/plan_l180:10].
- **C7, Valve's head rate.** L176 inferred the 619°/s look was "a head-rate figure" to cut [read: H/p-l176:86]; L179:
  619°/s "is not too fast by Valve's measure", the lack is eased ends [read: H/p-l179-valve:77]. Plan L178's bar ("worst
  rate falls by at least half from 619°/s") [read: P/plan_l178:25] was replaced by a rate-step bar [read: P/plan_l180:35].
- **C8, the line numbers of the first game.** Plan L181 cited 2e04aa5 with 9d98b64's lines; at 2e04aa5 [KINETICS] is at
  :5810 [read: P/plan_l181:55-57; H/p-l180-lap2:112-113]. Lap 2's own first build cited lines off by 2 to 5, caught
  before the red commit [read: H/p-l180-lap2:335-336].
- **C9, the stride figure.** Plan: "roughly 15 steps a second (assumed 0.9 m leg)" [read: P/plan_l181:61]. Measured on
  add21fe: hip height 0.984 m, step 0.721 m, 13.73/s at 9.9 m/s, 16.65/s at 12 m/s [read: H/p-l180-lap2:81-82].
- **C10, the lean's rate bar.** L173's 120°/s was "the librarian's own number" [read: P/plan_l180:72]; ruled 300°/s
  per frame, ours [read: :72]; then 24 seeds showed the base breaks 300 on 11 of 24 seeds, so the row became "at least 8
  of 24 hold 300" plus a 600°/s ceiling (ours) [read: H/p-l180-lap2:366-371, :447-456]; landed b91dc42 [read: git].
- **C11, the look row could not go red.** L173's spring already kept the step at 25-26°/s, inside the 200°/s bar, so
  the row guards regressions and cannot show Valve's eased ends helping [read: H/p-l180-lap1:32].
- **C12, small ones.** `HandOverride` at `body.h:79` → `:85` [read: H/p-l169:308] (L176 cites `:93`
  [read: H/p-l176:67]); the `world_app.h:86-88` comment was false at cab3530 [read: H/p-l169:162] and rewritten by L170
  [read: H/p-l170:31]; the pelvis amplitude 6.52° is written as 6.50° [read: H/p-l180-lap2:158-159]; the thorax figure
  is the one chain figure resting on an abstract [read: H/p-l180-lap2:155-157].

## H. Owed but unread (named in the record, never read at source)
1. Rosen's GDC 2014 talk itself (video) [read: H/p-l176:146; H/p-l179-talks:14, :83].
2. Bollo GDC 2018 and Holden's talks "for the parts about a turn's lean and foot plant", owed by plan L179 half 2
   [read: P/plan_l179_how_l4d_animated_2026-11-12.md:25]; the talks hand-back names neither [read: grep → 0].
3. Clavet GDC 2016 [read: H/p-l169:291].
4. Holden's "Code vs Data Driven Displacement" text [read: H/p-l169:292; H/p-l176:145].
5. Holden's `timedspring.c`, `extrapolation.c`, `tracking.c` [read: H/p-l176:144].
6. O3DE's EMotionFX blend space [read: H/p-l176:143].
7. Overgrowth's keyed run poses (closed data) and its timer setting (120 Hz inferred) [read: H/p-l176:147;
   P/registration_l180_lap2_rest:20-21]; the additive-pose spring (not in the fetched files) [read: H/p-l179-talks:46].
8. Left 4 Dead's own infected: models, sequences, activities, QC, the L4D2 SDK; its L4D-specific body is not in SDK 2013
   [read: H/p-l179-valve:67-70, :103-104].
9. Days Gone GDC 2018, AC Unity GDC 2015, any Dying Light infected talk; Back 4 Blood and Zombie Army never searched
   [read: H/p-l179-talks:18-22, :85].
10. Licence pages: Mixamo (403), Quaternius (search only), CMU (certificate failure), VDC copyright (403)
    [read: H/p-l176:141; H/p-l179-valve:24].
11. Weyand et al. 2000 (403 everywhere) and Alexander & Jayes 1983 (403) [read: H/p-l180-lap2:52-54].
12. Dorn, Schache & Pandy 2012, named by the stride amendment [read: P/plan_l181:62]; lap 2 never names it [read: grep → 0].
13. Ford 2013's full text; Preece 2016 and Pontzer 2009 beyond their abstracts [read: H/p-l180-lap2:100, :155-157, :166].
14. No readable source for arm swing amplitude at lap 2 [read: H/p-l180-lap2:99-105] (main has since cited Bruening
    2020, outside this set [read: game/model_rig.h:184-185]).
15. For A, not animation, status not in my files: Chang & Kram 2007 ("the librarian has not") [read: P/plan_l180:98];
    NextBot path following and DetourCrowd for L182 [read: P/plan_l180:94-96].
16. No source covers a first-person camera inside its own body; marked ours twice [read: H/p-l176:90;
    H/p-l179-valve:82; P/plan_l180:63].

## What I did not open
- `handback/p-l187-animal-locomotion-E_2026-11-12.md` (Alexander via Mazzetta & Blanco; E's L187 §8.3 on detuning).
- `handback/p-l191-arm-shape-C_2026-11-13.md` beyond lines 125-137; the L190, L192, L193, L200 hand-backs.
- `handback/p-l169-code-A_2026-11-12.md` (A's path sources), `plan_l177b_research_lean_2026-11-12.md`,
  `plan_l169_chase_pathing_research_2026-11-12.md`, `plan_l170_chase_feel_build_2026-11-12.md`.
- `briefs/dreamzone2_the_game.md` (his item numbers are quoted here only as the record cites them).
- Any outside source itself: nothing was fetched; every source's content above is as the room reported it.
- The game's branches (l180-lap2-rest, l205-stomp-c, l185-skeleton) and dreamzone-rt; only main's `game/model_rig.h`
  and `.cpp` were grepped, at 31d1c6d.

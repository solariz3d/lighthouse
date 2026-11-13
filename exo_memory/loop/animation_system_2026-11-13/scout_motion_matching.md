# Scout: motion matching and data-driven locomotion (2026-11-13)

1. Recommend ADOPT IN PART. Not now: runtime motion matching for anyone's locomotion. No lawful data reaches the hunter's
   speeds (open runs top out near 2-4 m/s), the method cannot make motion its data lacks, and his rule is "learn from".
2. Adopt now: spring inertialization (Holden, MIT; Bollo) as the one transition layer between procedural poses, for
   every body. First lap: the hunter's head-on wall stop (speed set to 0 in one tick) stops popping. Cost under 1 us.
3. Adopt next: motion matching's nearest-frame cost as an INSTRUMENT, not a renderer. It can score a stop, a sidestep and
   walking backwards, which the yardstick cannot, and it is a number for his "metric for a really human looking sprint".
4. Later, only on his word about shipping data: a small matching set of slow styled walks (100STYLE, CC BY 4.0) for the
   lesser kinds' slow approach and the player's slow moves. LMM (197 us a character a frame) is not worth it here.
5. Read at source and new to the room: Clavet's GDC 2016 slides (whole), the LMM paper (whole), Holden's repo code
   (MIT, 57b7250), his displacement, springs and dead-blending articles, the 100STYLE page and CC BY 4.0 legal code.

Marks: [read] opened and seen (path:line, or URL and section); [summary] from a ground file or another account;
[inferred] mine; [ours] a proposal. Game code is dreamzone-3 main 31d1c6d unless a branch is named. Outside text was
downloaded with curl into my scratchpad and read as text; nothing was fetched through a summariser except one web search
result list, used only to find the slides' address. `G/` = this folder (`exo_memory/loop/animation_system_2026-11-13/`).

## 1. What the room already has for this aspect

- Motion matching was weighed once and set aside as option D: "Large, mostly data. Poor fit for a pack." It needed
  "Minutes of captured motion on this skeleton, the per-frame search, code-driven displacement correction, foot lock"
  [read] `exo_memory/handback/p-l169-anim-C_2026-11-12.md:144`. The same file says the talk was not watched (:85) and
  Holden's displacement article was read only as an index entry (:92) [read].
- Clavet GDC 2016 and Büttner & Clavet 2015: never read [summary] G/ground_sources_read.md:166-167, :185.
- LMM (Holden et al. 2020): quoted phrases only; "how much was read is not stated" [summary] G/ground_sources_read.md:169-171.
- Holden's repo: licence MIT by `gh api`; `spring.h` read at :9-21 and the inertialization lines :162-211; the motion
  matching files "named, not reported as read line by line" [summary] G/ground_sources_read.md:65-75. Its bundled data is
  LAFAN1, CC BY-NC-ND 4.0, "can never ship" [read] `exo_memory/handback/p-l176-openanim-C_2026-11-12.md:21`, `:24`.
- Taken into the game from it: only the exponential damper by half-life, for the tilt [summary] G/ground_code.md:103-105 [2nd reader: those lines are a table of tilt constants and do not name Holden; the statement is at G/ground_sources_read.md:71-72];
  on l205-stomp-c it is `closed_share` [read] `git show l205-stomp-c:game/model_rig.cpp`:493-495.
- Bollo's inertialization: cited, not watched; "The player's body (L161) already does a form of it" [summary]
  G/ground_sources_read.md:177-179. On main: `kJumpBase = 0.025f`, `kSettleTime = 0.06f` [read] game/body.cpp:25, :30;
  the offset "dies away over kSettleTime" [read] game/body.cpp:433-434, applied as `std::exp(-kTickDt / kSettleTime)`
  [read] :440. The hunter has no inertialization [summary] G/ground_code.md:65.
- Clips are out "by his pick" [summary] G/ground_sources_read.md:187; the yardstick's rule is "Learn from, never use"
  [summary] G/ground_constraints_and_roster.md:182-184. His words [read] `briefs/dreamzone2_the_game.md:1102-1103`:
  "research open source alternatives, not to use, but to learn from".
- Data licences as the room recorded them: LAFAN1 never; Mixamo, CMU, Quaternius not read at source; 100STYLE CC BY 4.0
  named by E [summary] G/ground_constraints_and_roster.md:176-181. DReCon keeps motion matching in front of a physics
  tracker [summary] G/ground_physics_and_fp_body.md:136 [2nd reader: line 136 is a table row naming the paper as read; the claim is carried by the next cite], and `p-l186-physics-player-E_2026-11-12.md:43` [read].
- What the yardstick cannot score: a bend, a stop, a sidestep, walking backwards, anything above 4.5 m/s, a non-human
  body [summary] G/ground_locomotion_and_yardstick.md:208-221.

Thin spot in the ground files: none of them says what drawn pose follows a chase event that snaps speed. I read it
myself (section 3a). [2nd reader: RE-DERIVED in part. The room holds a measured one-tick pop of the drawn hunter at stops, pelvis 0.120 m down, G/ground_physics_and_fp_body.md:202-203 (scout lines 168-169 and 215-222 cite it), and a fix for that cause on l205-stomp-c, commit 900e3c4. What the ground files do not hold is the one-tick speed snap to 0 at a wall; that part stands]

## 2. Read at source, new to the room

### 2a. Clavet, "Motion Matching and The Road to Next-Gen Animation", GDC 2016 (For Honor) — the slides, whole
Read from the Wayback copy of `https://twvideo01.ubm-us.net/o1/vault/gdc2016/Presentations/Clavet_Simon_MotionMatching.pdf`
(snapshot 20200107052827; 107 pages; sha256 4810d2b0…; the live URL returned 403). Text layer only; images not seen.
Licence: none shown; © Ubisoft/GDC. Ideas cited, nothing copied.
- The method: "A ridiculously brute-force approach to animation selection" (~~slide 24~~ [2nd reader: PDF page 40. These "slide" numbers match no PDF page of the file the scout names (offsets 16 to 23; PDF page 24 reads "Question 2"). Every quote below is real; only the locator is off]); "Every frame, look at all mocap
  and jump at the best place." (~~slide 25~~ [2nd reader: PDF page 41]) [read].
- Pose matching on "only a few bones": local velocity, feet positions, feet velocities (~~slides 30-31~~ [2nd reader: PDF pages 51-52]); trajectory
  matching on future position, orientation, velocity (~~slide 35~~ [2nd reader: PDF page 57; it reads "Future position cost, Future orientation, Future velocity/acceleration"]) [read].
- Displacement: "The code decides the real simulation point" (~~slide 42~~ [2nd reader: PDF page 64. Pages 66-67 then read "Choose animations that follow the simulation And do Displacement from Animation" and "Animation moves and rotates the entity": his displacement comes from the animation, clamped to the simulation. Code-moves-every-body (3a.5) is our rule, not his]); a spring-damper trajectory, "predictable and
  comfortable" (~~slide 43~~ [2nd reader: PDF page 65, "Spring damper on velocity"]); "Clamp the entity 15 cm around the simulation" (~~slide 46~~ [2nd reader: PDF page 68]) [read].
- "Run actual simulation code to predict future trajectory. Predict stops on walls and ledges" (~~slide 47~~ [2nd reader: PDF page 69]) [read].
- Speed that the data lacks: "Timescale the animation according to error ratio" (~~slide 65~~ [2nd reader: PDF page 88]), then "Just sliding often
  gives better results" (~~slide 66~~ [2nd reader: PDF page 89]) [read]. Sliding prevention: "Lock the toe when it doesn't move too much" (~~slide 68~~ [2nd reader: PDF page 91]).
- Slopes: smooth the ground, pull the hips down, "Never hyper-extend the knee" (~~slides 70-71~~ [2nd reader: PDF pages 93-94]) [read].
- Workflow: "Possible to play the game without animation! (just debug display)" (~~slide 51~~ [2nd reader: PDF page 73]) [read]. Our game already
  works this way: code moves the chasers, the picture follows [summary] G/ground_sources_read.md:175.

### 2b. Holden, Kanoun, Perepichka, Popa, "Learned Motion Matching", ACM TOG 39(4), 2020 — whole paper
Read from `https://theorangeduck.com/media/uploads/other_stuff/Learned_Motion_Matching.pdf` (sha256 534c1993…), the
authors' copy. © the authors, publication rights ACM; cited only.
- Basic MM features: 27 numbers: trajectory positions and directions 20, 40, 60 frames ahead at 60 Hz, two foot
  positions, two foot velocities, hip velocity, each scaled by its standard deviation; "a default weighting of 1 is
  sufficient" in most cases (§3) [read].
- Search: a two-layer box hierarchy over runs of 16 and 64 frames (§3; Appendix B) [read].
- Measured cost, Locomotion scenario (28 joints, 89,480 frames, 27 features, 60 Hz; Table 2): basic MM stores X 9.4 MB
  plus Y 42.7 MB = 52.1 MB; a search costs 90 us and runs every N = 10 frames, so 9 us a frame on average. LMM stores
  5.3 MB and costs 197 us a frame. Single thread, Xeon 3.5 GHz (Table 3; §6.2) [read].
- "the memory usage of such methods generally scales linearly with the amount of data used" (Abstract) [read].
- Quadrupeds: a dog from 124,418 frames, and a bear from about one minute of keyframes augmented to 694,272 frames by
  "carpet unrolling" (§5, Table 2) [read]. So the method is not tied to a human body; the data is.
- The limit that matters for us: the model "does not interpolate to produce new animations not present in the training
  data" (§7.2) [read]. Plain MM is the same by construction: it plays stored frames [inferred].
- Foot sliding: without IK "our method exhibits some foot sliding and penetration" (§6.3) [read].

### 2c. Holden, `orangeduck/Motion-Matching`, commit 57b7250 (2025-02-06) — code read at source
- Licence: MIT, `https://raw.githubusercontent.com/orangeduck/Motion-Matching/main/LICENSE` read whole. Commercial use:
  yes. Attribution: the copyright and permission notice must be "included in all copies or substantial portions of the
  Software". No share-alike. Redistribution allowed. Its data is not MIT: README says LAFAN1 is "licensed under Creative
  Commons Attribution-NonCommercial-NoDerivatives 4.0" (README.md, "Learned Motion Matching" section) [read].
- `database.h:537-544`: the 27-feature layout [read]. `:17-18`: `BOUND_SM_SIZE = 16`, `BOUND_LR_SIZE = 64` [read].
  `:569-697`: the search, with early-out per feature against the best cost so far [read]. `:705`: `ignore_range_end = 20`.
- `controller.cpp:1261-1265`: feature weights foot position 0.75, foot velocity 1.0, hip velocity 1.0, trajectory
  positions 1.0, directions 1.5 [read]. `:1280`: `inertialize_blending_halflife = 0.1f` [read]. `:1349`:
  `search_time = 0.1f` [read]. `:1394`: `synchronization_enabled = false` by default [read]. `:1409`:
  `clamping_max_distance = 0.15f` [read]. `:1781`: `frame_index++; // Assumes dt is fixed to 60fps` [read].
- `spring.h:115-127` `decay_spring_damper_exact` (critically damped, by half-life); `:162-172` `inertialize_transition`
  (offset = src + old offset - dst, for position and velocity); `:174-187` `inertialize_update` [read].
- `resources/generate_database.py:34-41`: the demo's whole database is three LAFAN1 takes of one subject (idle slice,
  run, walk), each also mirrored, sped up 10% (:88-89) [read]. `resources/features.bin` is 5,778,232 bytes [read: GitHub
  tree API], which is 53,500 frames of 27 floats [inferred: (5,778,232 - 224) / 108]: about 14.9 min at 60 Hz.
  `resources/database.bin` is 64,093,192 bytes [read: same]: about 1.2 kB a frame for 23 bones [inferred].
- The simulation bone: "project one of the upper spine bones onto the ground and then smooth ... Savitzky-Golay"
  (~~`generate_database.py:103-118`~~ [2nd reader: the quoted words are not in the script; they are in Holden's article "Code vs Data Driven Displacement", section "Simulation Bone". The script does the same in code: `Spine2`, `savgol_filter(..., 31, 3)` at generate_database.py:104-109, direction at :116]) [read].

### 2d. Holden's articles (theorangeduck.com; © the author; cited only)
- "Code vs Data Driven Displacement" (2021-09-23), `https://theorangeduck.com/page/code-vs-data-driven-displacement`,
  read whole. The demo data's run tops at "just over 4 m/s" (section "Simulation Bone") [read]. Synchronization the
  other way, moving the simulation to the character, gives weight but "sluggish" control (section "Synchronization")
  [read]. Adjustment limited to a ratio of the character's own velocity hides sliding, "max_adjustment_ratio of 0.5"
  (section "Adjustment") [read]. "a little bit of foot sliding can often look much less weird than breaking the posing
  of the character badly" (section "Sliding and Foot Locking") [read].
- "Spring-It-On" (2021-03-04), `https://theorangeduck.com/page/spring-roll-call`, section "Inertialization": it "fades in
  or out an offset between two animations", needs only one animation evaluated, and with the exact decaying spring "can
  be made exceptionally fast" when all bones share one half-life and dt [read].
- "Dead Blending" (2023-02-25), `https://theorangeduck.com/page/dead-blending`, read whole: extrapolate the old pose
  from its velocity and cross-fade; it "only requires that you have the current pose ... and (at the point of
  transition) its velocity" [read]. Linear extrapolation makes "crazy poses" past short blends; damping the velocity
  helps [read].

### 2e. 100STYLE (Ian Mason), `https://www.ianxmason.com/100style/` — the dataset page, read whole
- "over 4 million frames of motion capture data for 100 different styles of locomotion"; one actor for all styles;
  per style: forwards, backwards and sidestep walking and running, idling, transitions; Xsens, 60 fps; 28 bones [read].
- Licence: "This work is licensed under a Creative Commons Attribution 4.0 International License"; "For creative or
  commercial work please credit ... "The 100STYLE Dataset - Ian Mason"" (section "Citation, Creditation & Licensing")
  [read]. Legal code read at `https://creativecommons.org/licenses/by/4.0/legalcode.en`: Section 2 grants reproduce and
  share, and produce and share Adapted Material, with no non-commercial limit; Section 3 requires credit, a licence
  notice, and saying if it was modified [read]. So: commercial game use allowed; attribution required; no share-alike;
  redistribution allowed with the notices [read]. Use the DATA only if he rules that motion data may ship (§5).
- Styles include Zombie, Crouched, OnToesCrouched, Old, Stiff, DragLeftLeg, LimpLeft, Cat, Dinosaur, Robot [read].
- Speed, measured by me on one file, `Neutral_FR.bvh` (forwards running; 4,625 frames, 77.1 s; units cm, thigh 43.7):
  root speed over 0.5 s windows p50 1.27 m/s, p99 1.85 m/s, ~~max 1.98 m/s [read: my count with a 20-line node script]~~ [2nd reader: UNSUPPORTED. I could not reproduce it: Zenodo refuses range requests (403) and no copy of Neutral_FR.bvh is held here. A sibling scout files that XSens root travel drifts, G/scout_motion_data.md:136, and that the 100STYLE run speeds are unknown, :243. A median of 1.27 m/s for a forwards RUN is far below any jog; treat the "about 2 m/s" in item 1 and in 3a.1 as unmeasured]
  One file of one style; other styles were not measured.

## 3. The design for this aspect

### 3a. Why runtime motion matching does not fit this game's locomotion (the evidence)
1. Speed. The hunter runs 9.0 to 13.4 m/s [summary] G/ground_locomotion_and_yardstick.md:179; his player sprint is
   8 to 10 m/s [summary] G/ground_his_words.md:746-748. The open runs I measured or read stop at about 2 m/s
   (100STYLE Neutral) and about 4 m/s (LAFAN1, non-commercial anyway). No source has a full curve above 9.49 m/s
   [summary] G/ground_locomotion_and_yardstick.md:304. [2nd reader: DOWNGRADED. The same ground file holds full-stride leg curves from one runner (Dorn, MIT as recorded) at 5.20, 7.00 and 9.49 m/s, :302-303, and the scout cites that runner at Layer M below. The hunter starts at 9.0 m/s. So "no lawful data reaches the hunter's speeds" holds for full-body clips and for arms, not for one runner's legs; and nothing exists above 11.58 m/s, :304] MM plays stored frames (§2b, §7.2), so it cannot reach 12 m/s.
2. The two patches both fail him. Timescale (Clavet ~~slide 65~~ [2nd reader: PDF page 88]) raises cadence; he rejected "moving too fast for the legs
   to keep up" [read] `briefs/dreamzone2_the_game.md:1128`. Sliding (~~slide 66~~ [2nd reader: PDF page 89]) is foot slide at the feet he looks at.
3. Bodies past a human. His entities are humanoid with an animal trait each (item 168) [summary]
   G/ground_his_words.md:406-411. No capture of a humanoid with greyhound cornering, or of an "alien hyena" stalk
   [read] `briefs/dreamzone2_the_game.md:1554`, exists; T5 has "no source found" [summary]
   G/ground_locomotion_and_yardstick.md:159. MM can do a bear, but only from bear data (§2b).
4. His rule. "not to use, but to learn from" [read] brief:1102-1103. Shipping data is his call, not this file's. [2nd reader: DOWNGRADED. The quote is item 150, about "open source alternatives" to making animations from scratch (brief:1102-1103); it says nothing of motion data or shipping. The data rule is plan_l180:67 "Clips, by his pick", a plan of 11-12]
5. The displacement rule is already right. Code moves every body; the picture never moves the simulation [summary]
   G/ground_constraints_and_roster.md:33-41. Holden's "synchronization" toward the animation would break replays, so
   it is out for good [inferred].

### 3b. What to adopt, and where it sits

**Layer T (transitions): spring inertialization of the drawn pose.** Sourced: Bollo 2018 via Holden `spring.h:162-187`
and the springs article (MIT; restate it, or copy with the notice, see §2c). Dead blending (§2d) is the fallback for a
generator that cannot be evaluated on the transition tick; every generator we have can be, so it is not needed now
[inferred].
- Inputs: the pose a generator returns this frame (`BodyPose`, 21 joints [read game/body.h:55-64, main 31d1c6d] and ~~the three frames~~ [2nd reader: five vectors, right, up, forward, chest_right, head_right, plus trunk_lean; the cost estimate is unchanged in size]); the
  previous drawn pose and its velocity (finite difference over one frame); a transition flag; dt.
- Output: the drawn pose = generator pose + an offset that decays. The offset lives in the body's own frame, about the
  pelvis, so the root stays exactly where the simulation put it [ours: Holden decays bone rotations; we have joint
  positions only, so we decay pelvis-local position offsets; the Rig keeps bone lengths by aiming, ground_code.md:79].
- Trigger: the chase's own events. `ChaserPose` already carries `gait` [read] game/world/world_app.h:86. A change of gait
  is a transition. As a guard for jumps with no gait change, the player's existing test: a joint moving more than
  `kJumpBase` 0.025 m plus what its speed explains [read] game/body.cpp:23-25 (the room's constant, no outside source).
- Where: one small pure function plus a per-figure state, in `game/model_rig.{h,cpp}` beside `DrawnChaser`, which
  already uses Holden's damper. Called in `WorldStage::place_figures` right after `gait_pose` and before the palette
  [read] game/world/stage.cpp:267-280. On E's soft-key branch the order becomes gait_pose -> T -> Ragdoll::key ->
  palette [summary] G/ground_physics_and_fp_body.md:79. R4.5's bar was amended because the keyframe itself jumps
  (pelvis 0.120 m in one tick) [summary] G/ground_physics_and_fp_body.md:202-203; ~~T upstream removes that cause.~~ [2nd reader: WRONG. The cause is named in the commit message of 900e3c4 on l205-stomp-c: the throw's rise g t^2/8, computed inside gait_pose only above 0.1 m/s; it is cured there by a fade. T is downstream and would at most hide it behind its jump guard]
- Parameters: one. Half-life 0.1 s, Holden's default [read] controller.cpp:1280. His eye may pick another (§5). [2nd reader: DOWNGRADED. 0.1 s is the demo's value for mocap-to-mocap switches at 60 Hz, not a stop from 9 m/s. The room's own player body uses a time constant of 0.06 s, body.cpp:30. Also, the spring in spring.h is critically damped: its offset falls to a quarter in one "half-life" (spring.h:115-127, y = 2 ln2 / halflife), so the "five half-lives" reasoning below is first-order thinking; the 1 cm bar is still met by this spring]
- Cost [inferred, not timed]: 24 vec3 offsets and velocities, one shared exp, about 12 flops each: under 1 us per
  character per frame, 576 bytes of state. Against 1.2 ms of room at p99 [summary] G/ground_constraints_and_roster.md:31.
- The hunter: today the only figure posed. Lesser chasers: when they get `gait_pose` (G/ground_code.md:216-226), T is
  keyed per id like `DrawnChaser`'s table. The player: `Body` already runs a first-order form (exp decay, no carried
  velocity) [read] body.cpp:440; moving it to the velocity-carrying spring is a later, separate change, not lap 1.
- The future procedural moves all need T: climb, drop, recover, stumble, and his "turns up right and starts running like
  a human" [read] brief:1558. Each is a generator switch; T makes the switch one line, not a lap.

**Layer M (measure): the matching cost as an instrument.** Sourced: the 27-feature cost, `database.h:537-544`, scaled by
standard deviation (`normalize_feature`, :100-160). Never shipped, never in the game; a mode of `tools/yardstick`, whose
README already rules "Learn from, never use" [summary] G/ground_constraints_and_roster.md:182.
- Inputs: reference clips the yardstick already fetches (CMU runs; CMU backwards and sidestep clips named at
  H193:65 [summary] G/ground_locomotion_and_yardstick.md:214); a drawn body's frames from `gait_pose` or `Body`.
- Output: per drawn frame, the cost to its nearest human frame; per clip, the share of frames inside the human band.
- Two adaptations [ours]: drop the trajectory features for straight runs (keep them for turns and stops), and scale
  lengths by hip height and speeds by sqrt(g h), the Froude scaling the room already uses for stride and arms.
- The bar [ours]: the human band is the 95th percentile of each reference frame's cost to the other runners' clips
  (leave one runner out).
- Why it is new: it needs no phase and no mean curve, so a stop, a sidestep, walking backwards or a turn is scorable
  wherever one recorded human did it. The yardstick cannot score those [summary] G/ground_locomotion_and_yardstick.md:
  213-215. And it is a single distance from "human" per frame: his item 217 method made measurable [read]
  brief:1607: "we get the a good metric for a really human looking sprint ... and then we tweak it from there".
- Its own check before trusting it [ours]: it must go red where the yardstick is red (the player's legs fail at every
  joint, G/ground_locomotion_and_yardstick.md:199) and green where it is green (the hunter's legs at 2.5-4.5 m/s,
  :95). If it disagrees with the yardstick there, it is wrong, not the yardstick.
- Limits: human references only, so it scores how human, never how good an uncanny cue is; nothing above about
  4.2 m/s for arms and 9.49 m/s for one runner's legs (Dorn, MIT as recorded) [summary] G/ground_locomotion_and_yardstick.md:302.
- Cost: offline only; a 25-clip database is small (CMU clips are seconds long) [inferred]; nothing in the frame.

**Layer D (data, later, needs his word): a small matching set for slow moves only.** If he rules that motion data may
ship, 100STYLE (CC BY 4.0, credit required) covers walking, backwards, sidestep, idle and transitions, in styles such as
Crouched, OnToesCrouched, Zombie and Old (§2e). The only fits I see:
- the lesser kinds' slow approach toward a sound, "slowly move toward the sound until it sees you" [read] brief:756-757;
- the player's slow moves he named in item 159: legs crossing, walking backwards [summary] G/ground_his_words.md:353-359.
Its cost if built [inferred from Table 3, scaled linearly by frames]: a 15-minute set (about 53,500 frames) searched
every 0.1 s (controller.cpp:1349) costs about 55 us a search, about 2 us a frame per character on average at 300 fps;
searches must be staggered so ten bodies never search in one frame (0.55 ms). Memory about 64 MB pose data plus 5.8 MB
features per skeleton, shared by every body on it (§2c sizes). Sourced defaults: weights 0.75/1/1/1/1.5
(controller.cpp:1261-1265), horizons 20/40/60 frames at 60 Hz (§2b), clamp 0.15 m (~~slide 46~~ [2nd reader: PDF page 68]; controller.cpp:1409),
toe lock after (~~slide 68~~ [2nd reader: PDF page 91]). For the player the body hangs from the eye (body.cpp:243-246, G/ground_code.md:59), so data
would be re-anchored to the eye and must leave the camera untouched [inferred]. Not in this design's laps.

## 4. The first lap: inertialize the drawn hunter at a chase event

- The case, read in the chase: head-on at more than half its top speed, "it stops dead and stands a moment":
  `c.speed = 0` and `c.gait = Gait::Recover` in the same tick [read] chase/chaser.cpp:416-425 (main 31d1c6d); and after a
  drop, Recover with `c.speed = 0` [read] chase/chaser.cpp:117-120, :226-227. Wall stand 0.2 s by default, drop
  recovery 0.7 s [read] chase/archetype.h:53-55. The stage poses the hunter from `p.speed` with no memory [read]
  game/world/stage.cpp:269-277, so the drawn body goes from mid-stride at speed to a stand within one tick's lerp
  [inferred]. No row covers it: the branch row on stops ramps speed over 2 s [read] `git show
  l205-stomp-c:game/tests/model_rig_tests.cpp`:1432-1438 [2nd reader: DOWNGRADED. True at 900e3c4 (the row `no_joint_jumps_as_the_hunter_stops_or_sets_off`, :1439-1466 there); the branch tip is now ccc65ab and the row sits at :1447-1474. No commit was named, as rule 4 asks], and there is no row for the non-Mesh gaits
  [summary] G/ground_code.md:340-341.
- Files: game/model_rig.h and .cpp (the function and its state); game/world/stage.h and stage.cpp (state for the one
  hunter, the call); game/tests/model_rig_tests.cpp (rows). Nothing in chase/ or sim/.
- Row A, red today [inferred, not run]: "when the chase stops the hunter dead at a wall, no joint jumps". Scripted as
  the chase does it: 9 m/s, then speed 0 at one tick, from 16 places in the stride, 240 Hz, phase advanced as the stage
  does. Bar: no joint moves further in one tick than 3 x the body's speed on the tick before x dt plus 0.025 m. The 3x
  is the l205 row's figure for a runner's swinging foot (:1436-1437, no outside source named there) [2nd reader: DOWNGRADED. The row's comment says "about two to three times the body's speed" (900e3c4:1437) and its bar is a flat 2 cm a tick while the hunter goes 1 m/s or slower; the "3 x speed x dt + 0.025 m" bar is the scout's own, so it is [ours], not the row's]; 0.025 m is
  `kJumpBase`. At 9 m/s the bar is 0.137 m; a foot going from mid-stride to a stand moves several times that
  [inferred]. Green after T. Second clause: the offset is under 1 cm by 0.5 s (five half-lives) [ours].
- Row A on his record: before trusting the scripted row, replay his 16 kept runs headless and COUNT the hunter's
  Mesh-to-Recover ticks with speed above half its top. If there are any, the row also runs on the first one found. If
  there are none, say so in the hand-back; the scripted row is then the only case.
- Row B, guard: on a steady run with no transition, T changes no joint by more than 1e-6 m (every landed gait row stays).
- Row C, picture only: his 16 kept runs replay byte-identical, as the L185 hand-back did [summary]
  G/ground_constraints_and_roster.md:51.
- Tier: "check it" (a visible pop) for T itself; the replay row is the existing harness. No bench while he plays.
- Order: after L205 lands or beside it; L205 edits `gait_pose`'s body, T only reads its output [inferred].

## 5. What only his eye decides, and the fewest clips

- The half-life of T. Three columns of one recorded or scripted wall stop, side by side: main, 0.1 s (Holden's
  default), 0.2 s. At full frame rate and lit, as ruled after item 216 [summary] G/ground_constraints_and_roster.md:159-161.
  One clip from 4 m behind, one through the look-behind. Note: `--capture-lean` is fixed at 12 fps [summary] :143.
- Whether motion data may ship at all (Layer D). That is a ruling, not a look; ~~item 150 says no today~~ [2nd reader: UNSUPPORTED. Item 150 is about learning from open-source alternatives, not about shipping motion data; the record that bears is plan_l180:67, "Clips, by his pick"]. If he wants to
  see it first: three 100STYLE walks (Crouched_FW, OnToesCrouched_FW, Zombie_FW) retargeted onto hunter.glb in
  Blender offline, nothing in the game. Three short clips. Only after he asks.
- Layer M decides nothing about elegance or creepiness; it only says how far from a recorded human a frame is, so the
  clips he is shown can be ordered by that distance.

## 6. What I would NOT build, and why

- Runtime motion matching for any body's run: no lawful data at our speeds (§3a.1), its patches give churn or slide
  (§3a.2), it cannot make the animal-in-a-human cues (§3a.3), and he has said "not to use" (§3a.4).
- Learned Motion Matching: it exists to save memory on huge databases; ours would be small. It costs 197 us a character
  a frame (Table 3), about 2 ms for ten bodies, past the 1.2 ms of room. Its training is PyTorch in Python, and the
  room's Python is for Blender only [summary] G/ground_constraints_and_roster.md:198.
- Synchronizing the simulation to the animation (`synchronization_enabled`): it would change the run (§3a.5).
- Time-scaling captured runs to 12 m/s: his item 163 rejects the result.
- A matching database per lesser kind or for the pack: cost and data scale with each kind; L169 said "poor fit for a
  pack" and nothing since changes that.
- Training on LAFAN1 or the demo's .bin files: CC BY-NC-ND, never (§2c). Mixamo: no ML training, as recorded
  [summary] G/ground_sources_read.md:192.
- Clavet's trajectory prediction to lead the lean: the tilt from acceleration already cut the lag to +0.06 s
  [summary] G/ground_sources_read.md:234-235, and the home-made lead was stopped by item 152. Kept only as the sourced
  horizon (1/3, 2/3, 1 s) if a later lap must read the chase's path.

## What I did not open

- Clavet's slide images, and the talk video; Büttner & Clavet 2015 (nucl.ai video); Zadziuk GDC 2016; Bollo GDC 2018.
- The LMM supplementary video; the paper's Appendix formulas beyond reading them.
- `orangeduck/Motion-Matching` `controller.cpp` beyond :1255-1880 and the adjustment functions :1040-1140; `nnet.h`,
  `quat.h`, `vec.h`, the training scripts beyond their layer sizes; the .bin resources (sizes from the tree API only).
- 100STYLE beyond its page, its licence and one file (`Neutral_FR.bvh`); its Zenodo record (API returned 403); every
  other style's speed. CMU's and Mixamo's licence pages (the room's records only).
- O3DE's motion matching gem and any other open implementation; Unreal's Motion Matching documentation.
- In dreamzone-3: `gait_pose`'s body, `Body::pose` beyond the lines cited, `world_app.cpp`, the chaser speeds per
  kind in archetype.cpp beyond :43; any worktree; E's soft-key clone. Nothing was built or run; no replay was counted.
- The hand-backs behind the ground files (H193, H200, H205, H185g) beyond the lines the ground files cite, except
  `p-l169-anim-C:80-150` and the grep hits in `p-l176-openanim-C`.

## Second reader

Opened at primary (downloaded with curl, read as text): Clavet's PDF (Wayback copy, sha256 4810d2b0…, 107 pages, matches),
the LMM paper (sha256 534c1993…, pdftotext), Holden's repo at 57b7250 (LICENSE, README, database.h, controller.cpp,
spring.h, generate_database.py; GitHub tree API for sizes; commit date 2025-02-06 confirmed), his three articles, the
100STYLE page, CC BY 4.0 legal code, the game at main 31d1c6d and l205-stomp-c (900e3c4 and ccc65ab), the ground files,
the cited hand-backs and brief lines. Nothing was built or run. Outside requests carried public technical topics only.

| # | line | claim | primary opened | verdict | evidence |
|---|---|---|---|---|---|
| 1 | 70-72 | 27 features, 20/40/60 frames, weight 1 enough | LMM §3 | OK | "R27", "20, 40, and 60 frames", "default weighting of 1 is sufficient" |
| 2 | 73 | box hierarchy over 16 and 64 frames | LMM §3, App. B; database.h:17-18 | OK | App. B "groups of 16 and 64 frames" |
| 3 | 74-76 | Table 3: 52.1 MB, 90 us, 9 us; LMM 5.3 MB, 197 us; Xeon 3.5 | LMM p.9 (pdftotext -raw), §6.2 | OK | Locomotion MM 9.4+42.7=52.1, 90, 9; LMM 5.3, 197 |
| 4 | 77 | memory scales linearly with data | LMM abstract | OK | same words |
| 5 | 78-79 | dog 124,418 frames; bear 1 min to 694,272 | LMM Tables 2, 3, §5 | OK | text layer shifts Table 2 names; X sizes fix rows (Dog 18.9 MB, Bear 149.1 MB) |
| 6 | 80-81 | model does not interpolate to new animations | LMM §7.2 | OK | "does not interpolate to produce new animations" |
| 7 | 82 | foot sliding without IK | LMM §6.3 | OK | an IK-off rough-terrain ablation |
| 8 | 85-87 | MIT: commercial yes, notice kept, no share-alike | LICENSE (whole) | OK | "included in all copies or substantial portions" |
| 9 | 87-88 | LAFAN1 data is CC BY-NC-ND per README | README.md | OK | README text; LAFAN1's own licence file not opened |
| 10 | 89 | database.h:537-544 layout; :17-18 | database.h | OK | 3+3+3+3+3+6+6 = 27; BOUND_SM/LR 16/64 |
| 11 | 89-90 | search :569-697 early-out; :705 ignore 20 | database.h | OK | `curr_cost >= best_cost` at :623-685 |
| 12 | 91-94 | controller.cpp weights, halflife, 0.1 s, sync, 0.15, 60 fps | controller.cpp | OK | :1261-1265, 1280, 1349, 1394, 1409, 1781 all as stated |
| 13 | 95-96 | spring.h :115-127, :162-172, :174-187 | spring.h | OK | decay_spring_damper_exact; inertialize_transition/update |
| 14 | 97-100 | gen_db :34-41, :88-89; .bin sizes; 53,500 frames | generate_database.py; tree API | OK | 5,778,232 and 64,093,192 B; (5,778,232-232)/108 = 53,500 |
| 15 | 101-102 | "project one of the upper spine bones..." at gen_db :103-118 | generate_database.py; article | WRONG | words are in the article; script has code only, :104-116 |
| 16 | 106-110 | article: 4 m/s, "sluggish", 0.5, "little bit of foot sliding" | code-vs-data article | OK | all four found in the named sections |
| 17 | 111-113 | springs article, inertialization section | spring-roll-call | OK | "one animation at a time", "exceptionally fast" |
| 18 | 114-117 | dead blending needs pose and velocity; crazy poses | dead-blending | OK | "only requires that you have the current pose" |
| 19 | 119-121 | 100STYLE: 4M frames, Xsens, 60 fps, 28 bones | 100STYLE page | OK | "28 bone skeleton", "60 fps" |
| 20 | 122-127 | CC BY 4.0, credit, no NC, no SA; legal code s.2, s.3 | page; legalcode.en | OK | page sentence; s.2 grants Adapted Material; no NonCommercial term. Zenodo record's own field unread |
| 21 | 128 | style names | 100STYLE page | OK | all ten listed |
| 22 | 129-131 | Neutral_FR root speed p50 1.27, max 1.98 m/s | not reproducible | UNSUPPORTED | Zenodo range 403; sibling file says XSens root drifts (scout_motion_data.md:136) |
| 23 | 50-52 | PDF is 107 pages, sha256 4810d2b0 | clavet.pdf | OK | 107 form feeds; digest matches |
| 24 | 54-55 | slides 24, 25 quotes | clavet.pdf | DOWNGRADED | quotes real; they are PDF pages 40, 41 |
| 25 | 56-57 | slides 30-31, 35 | clavet.pdf | DOWNGRADED | PDF pages 51-52, 57 |
| 26 | 58-60 | slides 42, 43, 46, 47 | clavet.pdf | DOWNGRADED | PDF pages 64, 65, 68, 69; p.66-67 say displacement from animation |
| 27 | 61-63 | slides 65, 66, 68, 70-71 | clavet.pdf | DOWNGRADED | PDF pages 88, 89, 91, 93-94 |
| 28 | 64 | slide 51 "play the game without animation" | clavet.pdf | DOWNGRADED | PDF page 73 |
| 29 | 136 | hunter 9.0-13.4 m/s; his sprint 8-10 | ground_loco:179; his_words:746-748 | OK | "9.0 m/s at normal start, 13.4 at 10 min"; "8ms is max" |
| 30 | 137-139 | no lawful data reaches the hunter's speeds | ground_loco:302-304 | DOWNGRADED | Dorn legs at 5.20, 7.00, 9.49 m/s exist; scout cites them at :197 |
| 31 | 140-141 | he rejected "moving too fast for the legs to keep up" | brief:1128 | OK | item 163 words verbatim |
| 32 | 146 | "not to use, but to learn from" | brief:1102-1103 | OK | quote exact; scope is item 150, see row 33 |
| 33 | 245 | "item 150 says no today" for shipping data | brief:1102-1103; plan_l180:67 | UNSUPPORTED | item 150 is about learning from alternatives; data rule is "Clips, by his pick" |
| 34 | 21-24 | L169: option D, :85, :92 | p-l169-anim-C:144, :85, :92 | OK | lines match |
| 35 | 25-27 | ground_sources_read :166-167, :169-171, :65-75 | ground file | OK | B11, B12, A3 as stated |
| 36 | 27-29 | LAFAN1 "can never ship" p-l176:21, :24 | p-l176 | OK | :24 row |
| 37 | 30 | taken: damper, ground_code:103-105 | ground_code | DOWNGRADED | tilt constants only; Holden named at sources_read:71-72 |
| 38 | 30-31 | closed_share at :493-495 | l205 and main model_rig.cpp | OK | same lines on main 31d1c6d too |
| 39 | 33-36 | body.cpp:25, :30, :433-434, :440 | body.cpp main | OK | kJumpBase 0.025f, kSettleTime 0.06f, `std::exp` |
| 40 | 36 | hunter has no inertialization | ground_code:65 | OK | "none (springs on tilt only)" |
| 41 | 36-38 | yardstick rule "Learn from, never use" | ground_constraints:182-184 | OK | quoted there from README :3-6 |
| 42 | 40-41 | DReCon keeps MM in front of tracker, ground_physics:136 | ground_physics:136 | DOWNGRADED | :136 is a table row; claim held by p-l186:43 |
| 43 | 41 | same, p-l186:43 | p-l186-physics-player-E:43 | OK | "keeping a kinematic controller" |
| 44 | 42-43 | yardstick cannot score a stop, sidestep, back | ground_loco:208-221 | OK | rows present |
| 45 | 45-46 | no ground file covers a drawn-pose snap | ground_physics:202-203; branch 900e3c4 | DOWNGRADED | RE-DERIVED in part; the wall snap itself is not held |
| 46 | 157 | BodyPose: 21 joints and three frames | game/body.h:55-64 | DOWNGRADED | 21 joints yes; five vectors plus trunk_lean |
| 47 | 164-165 | gait at world_app.h:86; jump test body.cpp:23-25 | both files | OK | lines match |
| 48 | 167 | place_figures, stage.cpp:267-280 | stage.cpp main | OK | gait_pose then pose_model |
| 49 | 168-169 | "T upstream removes that cause" (pelvis 0.120 m) | 900e3c4 commit message | WRONG | cause is the throw's rise inside gait_pose, fixed there |
| 50 | 170 | half-life 0.1 s, five half-lives under 1 cm | controller.cpp:1280; spring.h:115-127 | DOWNGRADED | demo value; critically damped spring falls faster than first-order |
| 51 | 171-172 | under 1 us, 576 bytes | arithmetic | OK | 48 vec3 x 12 B = 576; marked [inferred, not timed] |
| 52 | 173-175 | lesser chasers keyed per id; player first-order | ground_code:216-226; body.cpp:440 | OK | as stated |
| 53 | 205-211 | Layer D: 55 us, 2 us, 0.55 ms | LMM Table 3 scaled | OK | 90 x 53,500/89,480 = 54 us; 64 MB is the demo layout (paper: 42.7 MB per 89,480 frames) |
| 54 | 215-219 | chaser.cpp:416-425, :117-120, :226-227; archetype.h:53-55 | chase/ at main | OK | `c.speed = 0` at :421; speed is not lerped between ticks, world_app.cpp:539-565 |
| 55 | 220-221 | l205 row at :1432-1438 ramps over 2 s | l205 tests at 900e3c4, ccc65ab | DOWNGRADED | true at 900e3c4; tip row now :1447-1474; no commit named |
| 56 | 228-229 | "3x" is the l205 row's figure | same row | DOWNGRADED | comment "two to three times"; bar is flat 2 cm a tick |
| 57 | 256-257 | LMM trained in PyTorch; Python for Blender only | LMM :404; ground_constraints:198 | OK | paper line; rule from the ground file |
| 58 | 196-197 | Dorn 9.49 m/s legs, arms 4.15 | ground_loco:302, 208 | OK | as recorded |
| 59 | 264-265 | tilt lag cut to +0.06 s | ground_sources_read:234-235 | OK | "+0.06 s on add21fe" |

Tally of 59 rows: OK 42, DOWNGRADED 13, WRONG 2 (rows 15, 49), UNSUPPORTED 2 (rows 22, 33). RE-DERIVED: 1, in part
(row 45: scout 168-169, 215-222 against G/ground_physics_and_fp_body.md:202-203; the room holds the stop pop and a
branch fix, 900e3c4; the one-tick wall snap is not held). Licence claims: all checked against the licence text; none wrong.

**Design: the simplest way to pass Row A without doing what it is for.** Row A bounds how far a joint moves in one tick
(3 x speed x dt + 0.025 m). It does not bound velocity continuity or foot slide. Two builds pass A, B, C and the
half-second clause and are not inertialization: (1) low-pass the speed that stage.cpp:269-277 hands to gait_pose; no joint
jumps, but the phase keeps advancing at a speed the simulation no longer has, so the feet step in place at a dead stop;
(2) a per-joint slew limiter at the bar: after the stop the bar falls to 0.025 m a tick, so a joint 0.5 m off arrives in
about 20 ticks (80 ms), a near snap that passes. Add rows for per-joint velocity step across the transition and for a
planted foot's slide. Layer T itself decays position offsets on the feet: after a dead stop they glide over the floor
for the decay; no row watches it [inferred].

**Mechanisms with no source and no [ours] mark.** (a) Trigger "a change of gait is a transition" (scout 163-164).
(b) Using the matching cost to grade a drawn body (179-198): Clavet and Holden select frames with it, none grades with
it; the two adaptations are marked, the repurposing is not. (c) Layer M's 27 features are feet, hip velocity and
trajectory (database.h:537-544); arms, trunk and head are absent, so "a single distance from human per frame" (190-192)
cannot see "torso and arms need to swing more" (brief:1128). That limit is missing from the scout's Limits line.

**What I could not check.** Whether the scout's "slide" numbers are the deck's own (the PDF carries no slide labels);
the talk video; Büttner and Clavet 2015; Zadziuk; Bollo; the 100STYLE file `Neutral_FR.bvh` and the Zenodo record's own
licence field; LAFAN1's own licence file; the Dorn data; LMM Table 2 row names (fixed by Table 3 sizes, not by layout);
whether a head-on stop at speed occurs in his 16 kept runs (no replay run, as the rules ask); brief:696 (Python rule;
read through the ground file only); the live 403 of the Clavet URL; CMU and Mixamo terms.

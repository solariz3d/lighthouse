# Build path: one animation system for the hunter, the lesser kinds and the player (2026-11-13)

1. First a clip tool that cannot mislead, then two laps on his corner note: the pelvis bone banks with the hips, then the
   whole body leans as far as its bend asks (grip-capped), while the chase seat lands the hunter's grip law behind its dial.
2. Then the hunter-only code becomes shared: a per-tick stride clock per id, one figure pass per id from a kind table
   (the dark one drawn first), cost and physics checks as instruments, held feet, a drawn state layer and transitions.
3. Then the first lesser kind (default: the interceptor) gets a body in three laps: model, kind row with tiers, its one cue.
4. Then the player's body on the same chain, lean and feet; then traversal (climb grip, landing, ladders, four limbs).
5. Twenty-nine laps; the three seats run side by side in waves; his eye decides every look; each lap ends in one fair
   clip.

Writer of the build path, read-only, 2026-11-13. Marks: [read] I opened it (path:line); [summary] from another swarm file
or a secondary account, cited by its path:line; [inferred] mine; [ours] a proposal. `S/` = this folder,
`C:/Users/nname/Desktop/lighthouse/exo_memory/loop/animation_system_2026-11-13/`. `brief` =
`exo_memory/briefs/dreamzone2_the_game.md`. Game code is dreamzone-3 `main` at 31d1c6d unless a branch is named. Every
"red today" below is a reading or an arithmetic, not a run, unless it says otherwise. Nothing was built or run here.

## 1. Where the game is today

### 1a. What is built, on main 31d1c6d

- Main is 31d1c6d, "Merge a-d673-overtime (A, L203) by the landing train" [read: `git log -1 main`].
- Two pose paths share one output type, `BodyPose` (21 world joint positions plus frames): the player's `Body::pose` per
  sim tick, the hunter's `gait_pose` per drawn frame [summary: S/ground_code.md:4-6].
- Both reach the skinned model through one retarget, `Rig::palette`, which aims 18 MPFB bones from game joints
  [summary: S/ground_code.md:7-8, :73-93].
- The kinetic chain (bank shares, counter-twist, follow springs) poses the hunter only; the player does not use it
  [summary: S/ground_code.md:9-10, :70-71].
- The bank shares are his first game's: `kBankPelvisShare = 1.0f`, `kBankTrunkShare = 0.35f`, `kBankHeadShare = -0.30f`
  [read: game/model_rig.h:134-136].
- The drawn tilt is Overgrowth's, `target = vel * 0.5f + accel_tilt;   // degrees` [read: game/model_rig.cpp:510].
- The sim computes the physical lean, `std::atan(a.body.speed * a.body.turn / 9.81f)` [read: game/world/world_app.cpp:534],
  and the picture overwrites it with the drawn tilt, `p.lean = e.drawn.lean();` [read: game/world/world_app.cpp:582].
- Only the first hunter gets the model; its stride phase is summed from the FRAME's delta [read:
  game/world/stage.cpp:267-269].
- Every other kind is a box, and kinds with no slot are skipped [read: game/world/stage.cpp:283]. The slots are
  `{1, 6, 6, 9, 0, 0, 2}` [read: game/world/figures.h:28]. That list has seven values for eight kinds, so charger, stalker
  and the dark one draw nothing [summary: S/ground_constraints_and_roster.md:114-117].
- The hunter's ragdoll is on main as 22 kinematic bodies keyed to the pose and read by nothing [summary:
  S/ground_physics_and_fp_body.md:3]. [2nd reader: on main no game file outside game/ragdoll.{h,cpp} and
  game/tests/ragdoll_tests.cpp names `Ragdoll` [read: grep of game/ at 31d1c6d], so at run time nothing keys it either;
  "keyed to the pose" holds in its tests only.]
- The player's first-person body: L161 body, L174 eye round the neck, D659 proportions, D672 head and ring, L188 step 1
  feet sideways and backwards [summary: S/ground_physics_and_fp_body.md:6-8, :101-124].
- The yardstick scores legs against Fukuchi at 2.5-4.5 m/s and arms against 25 CMU clips; it cannot score a bend, a stop,
  a walk, a climb, a non-human trait or anything above 4.5 m/s [summary: S/ground_locomotion_and_yardstick.md:188-221].
- Picture only is guarded by the world self-test part 7 and by replaying his kept runs byte for byte [summary:
  S/ground_constraints_and_roster.md:46-53]; `game/runs` holds 20 kept runs [read: `ls game/runs`, 20 `.txt`].
  [2nd reader: confirmed, 20 `.txt` and 20 `.dzr`; ten were written today 13:22-13:58. They are NOT in git:
  `game/runs/` is ignored (dreamzone-3 .gitignore:15; `git ls-files game/runs` gives 0). A branch worktree has none of
  them, so every "his kept run" row and G1 need the files copied in, and G1's "16" (E's set) is not these 20: each lap
  names which runs it replayed.]
- No per-character frame cost has been measured anywhere; the cost row R4.7 exists and never ran [summary:
  S/ground_physics_and_fp_body.md:9, :259].

### 1b. What is waiting to land

- `l205-stomp-c`, the stomp fix (his item 195): tip ccc65ab, not an ancestor of main [read: `git log`, `git merge-base`];
  it touches only CHANGELOG.md, game/model_rig.cpp, game/model_rig.h and game/tests/model_rig_tests.cpp [read: `git diff
  --stat main...l205-stomp-c`]. Put to his eye: the take-off knee "about 15 degrees ... or 25" [read: brief:1588].
  [2nd reader: confirmed (tip ccc65ab, 11-13 15:08, not an ancestor; 4 files). The brief:1588 and every ground file
  (S/ground_code.md:1, S/ground_locomotion_and_yardstick.md:115) name 900e3c4; ccc65ab is one commit later ("the hand-in
  before landing comes out; the knee row sweeps 48 speeds") and C's "14 of 14 suites" was read at 900e3c4. Step 0 lands a
  commit no ground file has read.]
- L185 steps 4-5, the soft-keyed upper body and the catch reaction: green on E's local clone only, commits 2373283,
  8d41f04, 2767855 not in the game's repository [summary: S/ground_physics_and_fp_body.md:4-5, :47-48]; the brief names
  "branch `l185-skeleton` 2767855 (on main 31d1c6d; not landed)" [read: brief:1601]. [2nd reader: the game repository's
  only branch of that name is `origin/l185-skeleton` at b226b95, "WIP L185 step 2, stopped by his word" [read: git log];
  2767855, 2373283 and 8d41f04 are absent (`git cat-file -e`). Whoever reads `l185-skeleton` there for the physics layer
  reads step 2, not steps 4-5.] It waits on his eye, C's read of the
  stage line and its cost on a quiet machine [read: brief:1601]; and the ruling that E films it again on C's fixed run "at
  full frame rate and lit, once l205-stomp-c is on main" [read: brief:1606].
- Parked, not to land as is: feet with memory 55d1451 (origin/l180-lap2-rest) [summary: S/ground_sources_read.md:39-41];
  L188 step 2, slide leg and shoulder sliver, `origin/l188-step2` b676860, rows unrun [summary:
  S/ground_physics_and_fp_body.md:45, :244-246]; the head-first look WIP `origin/l188-wip-look` a60944d, "NOT TO LAND"
  [summary: S/ground_physics_and_fp_body.md:46]; footfalls from the drawn phase `origin/l192-footsteps` d8f77ba, "WIP,
  UNBUILT" [summary: S/scout_performance_and_determinism.md:51-54].
- The cornering law H1/H2 exists only on `origin/l182-lines` and `origin/l182-hawk` as a dial `turn_law`, off by default;
  its grip arms g13/g16/g20 are registered and not run [summary: S/ground_locomotion_and_yardstick.md:118-135].
- A third model, `sprinter.glb`, sits outside the repository, back-jointed, 2.275 m [summary:
  S/ground_constraints_and_roster.md:90-91]; the Blender scripts that made every body live only in a temporary folder
  [summary: S/scout_models_and_skeletons.md:42-46; S/scout_authoring_and_tuning.md:93-104].
- [2nd reader: missing from 1a-1b. The room wrote five build paths at 08:43 today that already order most of the laps
  below: `loop/buildpath_entity_bodies_2026-11-13.md:48-63` (a model figure per kind with a slot pool, at most K skinned,
  one trait per kind as chain overlays with T2 head hold, link and tell poses, physics),
  `loop/buildpath_player_body_2026-11-13.md:71-90` (picks of 173, head first, wall hand and climb grip, yardstick),
  `loop/buildpath_chase_entities_2026-11-13.md:72` (the lines lap, then flip), `loop/buildpath_sound_2026-11-13.md:58`
  (L192 footfalls as planned) [read]. This path cites none of them; his picks on them are at brief:1231-1384 [read], e.g.
  `entity_bodies-1` "Decide kind by kind" (brief:1272) and `player_body-4` "Tune the player's own" (brief:1282).]

### 1c. What he said today about the hunter (items 214 to 217)

- 214: "on the corners, the torso doesnt orient itseld into the banking of a turn, it looks very good, but is starting to
  become too human looking, we need to almost start to tweak it to be creepy some how" [read: brief:1589].
- 215: "we did do tons of research, remember" [read: brief:1599].
- 216: "i think we devolved a shit ton with that artifact" [read: brief:1603]. The room's ruling under it: no before-and-after
  page "whose 'before' is older than something he has already been shown fixed" [read: brief:1606].
- 217: "i think from the idea i had in my head, we get the a good metric for a really human looking sprint which we had,
  and then we tweak it from there to look uncanny in a realistic way that obeys physics" [read: brief:1607].
- 218, the aim of this path: "a system that will helps us make very elegant animations for the rest of the entities and
  even the player character" [read: brief:1612].
- The rulings that stand under 214: no cue other than the cornering is built for the hunter; pane C shows a corner capture
  that reads, then the trunk's share at 0.35, 0.7 and 1.0 "with the speed and the bend's radius stated" [read: brief:1598].
- His pick that governs the cue: "**hunter T1 only** (greyhound cornering, one clear cue; its head stays humanlike)", the
  brief's record of his pick, not his words [read: brief:1154]; and "Grip above human" [read: brief:1231].

### 1d. What the swarm found that changes the next laps (corrected forms only)

- The pelvis bone is aimed Pelvis to Chest like spine_01 and spine_02 [read: game/model_rig.cpp:244], framed by the
  unbanked `pose.right` [read: game/model_rig.cpp:327], so its skin banks at the trunk's 0.35, not the hips' 1.0 [summary:
  S/scout_models_and_skeletons.md:167-179]. The ragdoll's skeleton already frames the pelvis by the hips' line [read:
  game/skeleton.cpp:75-80]. The conclusion was C's note of 11-12; the mechanism is new [summary:
  S/scout_models_and_skeletons.md:174-179].
- The drawn whole body never leans: the feet stay under the hips and only the hips and trunk roll about the pelvis
  [summary: S/scout_turning_and_transients.md:67-76]. The drawn tilt is 1 degree per m/s/s where gravity's law asks about
  5.84 at small angles [summary: S/scout_turning_and_transients.md:64-66; S/scout_uncanny_by_physics.md:239-241].
- At grip mu the law gives atan(mu): 45 degrees at 1.0, 53 at 1.33 [summary: S/scout_turning_and_transients.md:228-232].
  The greyhound abstract's 65% force rise at unchanged contact time implies a/g about 1.31 [summary: second reader at
  S/scout_turning_and_transients.md:133-136]. No measured human lean near 42 degrees was read; the only measured leans are
  10-15 degrees on one bend [summary: S/scout_turning_and_transients.md:397-398].
- The hunter's sim turns ask up to about 2.1 g, more than any grip allows, so a lean drawn by the law exposes the sim
  [summary: S/scout_turning_and_transients.md:16-21].
- The clip tool `--capture-lean` saves every 12th frame of a 1/144 s step and checks no look-behind pass for walls
  [summary: S/scout_authoring_and_tuning.md:82-84].
- Paused, the drawn hunter's legs keep cycling, and a stall up to 0.25 s runs the legs on time the sim never had
  [summary: S/scout_performance_and_determinism.md:62-69].
- Every chase link starts at speed 0, so the hunter is drawn standing through drops and ladders, and stops dead at a wall
  in one tick [summary: S/scout_states_and_transitions.md:61-68; S/scout_motion_matching.md:215-222].
- Ladders are one flat board with no rungs [summary: S/scout_ik_and_feet.md:501-502].
- The hunter's real hip height is 1.196 m; the 0.984 m in the record is the test skeleton's [summary:
  S/scout_gaits_any_body.md:180-191].

## 2. The laps, in order

### 2a. The rules every lap keeps

- Guard G1, picture only: his kept runs replay byte-identical, base against branch, as L185 did ("his 16 kept runs,
  identical 16, differ 0") [summary: S/ground_constraints_and_roster.md:51], and `dz-world --selftest` part 7 stays green
  [summary: S/ground_constraints_and_roster.md:47-49]. Only L4 may change a run, and only behind a dial that is off.
- Guard G2, the yardstick stays green: leg rms/sd <= 1 at 2.5-4.5 m/s, elbow mean within 12.4 degrees, shoulder ends
  within 3.7/7.0 [summary: S/ground_locomotion_and_yardstick.md:203-204]; past 4.5 m/s the Dorn rows of L205 [summary:
  S/ground_locomotion_and_yardstick.md:205-206].
- Guard G3, the camera: `the_camera_moves_exactly_as_it_did_without_a_body_over_the_whole_gym_run` [summary:
  S/ground_code.md:292] stays green in every lap that touches a body.
- Every red row is registered before code, run on main first, and its printed number goes in the hand-back; a row that
  reads green on main stops its lap and says so [ours, the room's own falsifier form, e.g. S/scout_ik_and_feet.md:323-324].
- Every row names its non-vacuity count (frames or contacts it judged) beside its bar [ours, after the second readers'
  "passes on zero cases" findings, e.g. S/scout_evaluation.md:376-379].
- No game, bench or capture runs while he plays; captures and timing wait for the heavy-run lock and a quiet machine
  [summary: S/ground_physics_and_fp_body.md:230; S/scout_performance_and_determinism.md:207-208].
- Each lap's clip, from L1 on, is made by L1's tool: every frame, lit, same kept run and cameras in every column, the
  "before" column built from main's tip, labels from the manifest [ours, from brief:1606].

### 2b. Step 0: the stomp fix lands (a landing pane's job, not a builder lap)

- Lands `l205-stomp-c` at its tip after E's read of the amended gate and his word on the knee [read: brief:1588]. Every
  clip below has this run as its "before" [read: brief:1606]. Tier: prove it, the full suite at landing [ours].

### 2c. Laps that answer his words of today

#### L1 FAIR-CLIP: `--capture-lean` that cannot mislead (audio-and-physics seat, E)
- Builds: save every drawn frame at a `--clip-step` (default 1/240 s) instead of every 12th; per pass a `manifest.txt`
  (build commit, the run file and the build it was played on, camera, step, each frame's sim tick, `measure` per frame)
  and a `pose.csv` (tick, speed, heading, lean, the 21 joints); refuse to write a pass that hides the hunter [summary:
  S/scout_authoring_and_tuning.md:284-298].
- Second reader's holes, closed here [summary: S/scout_authoring_and_tuning.md:412-422]: a companion row that the two
  follow passes and one look-behind stretch ARE written; the chest's screen height as a share of the frame and the lit
  share on the same frames; the first pass gets the look-behind's own view; ticks read from the app's tick count at each
  save, not computed from the step; the manifest's commit compared with `DZ_BUILD_COMMIT` [ours].
- Files: game/world/offscreen_models.cpp, game/world/main.cpp (usage, `--clip-step`), new game/pose_trace.h/.cpp, new
  game/tests/pose_trace_tests.cpp, game/CMakeLists.txt, CHANGELOG.md [summary: S/scout_authoring_and_tuning.md:286-288].
  [2nd reader: add game/world/modes.h. `run_capture_lean(const Options&, run_txt, out_dir)` is declared there (:62) and
  `Options` (:24-29) has no step field, so `--clip-step` reaches the tool only through that header [read, 31d1c6d].]
- Red today on his kept run `run-20261112-204506` (fastest straight 13.1 m/s, sharpest corner 177 degrees in 1 s)
  [summary: S/scout_authoring_and_tuning.md:300-301]: `consecutive_saved_frames_are_one_clip_step_apart` (today 12 steps of
  1/144 s apart) and `every_pass_names_its_build_its_run_and_its_camera` (today no manifest) [summary:
  S/scout_authoring_and_tuning.md:306-309]. `the_capture_writes_no_pass_that_hides_the_hunter` is to be counted on main
  first; the brief records look-behind passes that "show walls, not the hunter" [read: brief:1601].
- Must not break: G1 (no sim change); the existing captures' flags keep working [ours].
- Cost: 0 in the shipped frame; offline only [summary: S/scout_authoring_and_tuning.md:267-268].
- Tier: check it [summary: S/scout_authoring_and_tuning.md:284].
- Clip: the sharpest corner of `run-20261112-204506` from the follow camera and the look-behind, left main with step 0
  landed, right the same commit through the new tool, so he sees the tool and not a change [ours]. After it, E re-films
  the L185 upper body with this tool, as ruled [read: brief:1606].
- New against the morning's record: the code facts behind it are in no ground file [summary: second reader,
  S/scout_authoring_and_tuning.md:409-410].

#### L2 PELVIS-FRAME: the hips' skin banks with the hips (animation seat, C)
- Builds: in `Rig::palette`, the `pelvis` bone takes a frame from the hips' line and the pose's up, with no swing, the rule
  `game/skeleton.cpp:75-80` already uses [read: game/skeleton.cpp:75-80; summary: S/scout_models_and_skeletons.md:323-328].
- What it does not do: it cannot pitch, and the torso he named is spine_03's skin (10,942 hunter vertices) at the
  registered 0.35 by design [summary: S/scout_models_and_skeletons.md:185-188, :247-251]. So L2 shows the hips' whole bank,
  and L3 carries the torso [inferred].
  [2nd reader: "cannot pitch" is also a CHANGE on every running frame, unguarded. Today the pelvis bone is swung onto
  Pelvis-to-Chest, and `gait_pose` leans the chest forward by `0.22f * run` rad (12.6 degrees at 6 m/s and up; main
  model_rig.cpp:747, :785; the same on l205-stomp-c :763, :922) plus the chain's trunk pitch (kPitchTrunkShare 1.0,
  model_rig.h:138) [read]. A frame of the hips' line and `up` with no swing stands the pelvis skin upright under a chest
  leaning 12-plus degrees: a crease at the waist on straights, the kid's too (its Pelvis-to-Chest leans by `lean_`,
  body.cpp:338, :455) [inferred]. The :616 row compares banked with unbanked at the same speed, so it cannot see it. Before
  code: either keep the pitch (x the hips' line, y the swung Pelvis-to-Chest made square to x) or add a guard row that
  the pelvis bone's pitch on a straight at 6 m/s is unchanged, and show a straight in the clip.]
- Files: game/model_rig.cpp, game/model_rig.h, game/tests/model_rig_tests.cpp, game/tests/world_app_tests.cpp, CHANGELOG.md
  [summary: S/scout_models_and_skeletons.md:327-329]. Built on step 0's tip (both touch model_rig.cpp) [inferred].
- Red today: scripted, a 20 degree bank on `gait_pose` as the row at model_rig_tests.cpp:616 does: the pelvis bone rolls
  about 7 degrees today, 20 +- 1 after [summary: S/scout_models_and_skeletons.md:332-334].
- Recorded case, his kept run `run-20261112-204506` through `hunter_lean_trace` with `DZ_LEAN_RUN` [read:
  game/tests/world_app_tests.cpp:919, :1034]: the SKINNED waist vertices (the pelvis-dominated set of hunter.glb) roll with
  the hips within a bar, on frames with lean over 5 degrees; today about 0.35 of the hips' roll [inferred]. A bone-over-hips
  ratio would be a tautology after the fix [summary: second reader, S/scout_models_and_skeletons.md:339-342].
- Must not break: model_rig_tests :616 (spine_01 still 0.35), :128 (rest identity) [summary:
  S/scout_models_and_skeletons.md:343-345]; the kid draws through the same aims (`kid.joint_map.json:303-314`), so every
  body_tests row and G3 [summary: S/scout_models_and_skeletons.md:319-321, :330-331]; G1; G2 (the yardstick reads joint
  angles, not the palette) [inferred].
- Cost: two normalises and two crosses, well under 1 microsecond a figure a frame [summary:
  S/scout_models_and_skeletons.md:311]. Not measured.
- Tier: prove it (shared geometry; the hunter and the kid draw through it) [summary: S/scout_models_and_skeletons.md:325].
- Clip: the sharpest corner of `run-20261112-204506`, outside and look-behind; left main after step 0 and L1, right the L2
  branch; shown before L3's clip, since L2 changes what 0.35 looks like [summary: S/scout_models_and_skeletons.md:354-356].

#### L3 BODY-LEAN: the whole hunter leans as far as its bend asks, capped by its grip (animation seat, C)
- Builds: a support roll about the sim's ground point `feet`, equal to atan(min(|a_lat|, mu g)/g) minus the drawn tilt, so
  the line from feet to centre obeys the law and Overgrowth's tilt stays as the upper body's motion on top [ours].
- The law and the roll by the difference are the uncanny scout's [summary: S/scout_uncanny_by_physics.md:255-264]. The
  difference keeps his ruling "Keep source, fix sway" [summary: S/ground_his_words.md:344-346]. The 10 cm "ours"
  outside-foot offset is replaced by the roll's own foot offset [summary: S/scout_uncanny_by_physics.md:262-263].
- Why the composition: ~~rotating the whole rig by the law and ALSO keeping the chain's 0.35 makes the trunk 1.89 times the
  law in space~~; the second reader named this as the one place the lap can be built two ways [summary:
  S/scout_turning_and_transients.md:442-444]. ~~Rolling by the difference keeps the landed tilt rows meaningful [inferred].~~
  What would change my mind: his eye preferring the turning scout's full rotation on the clip [ours].
  [2nd reader: WRONG on both struck lines, and the composition contradicts this lap's own rows. (1) The 1.89 is the
  turning scout's trunk share of 0.89 OF THE LAW added to a law rotation (scout :442-444). The chain's 0.35 multiplies the
  drawn tilt T (about 1 degree per m/s/s), so a full roll S plus the chain gives the trunk S + 0.35T, about 1.06 S at small
  angles [inferred]. (2) The drawn tilt turns the hips and trunk about the PELVIS, not the feet (`kinetic_chain`,
  model_rig.cpp:626-629; the feet only move 10 cm, :428-435) [read], so today's ankle-to-pelvis line is near upright
  whatever T is. A roll about the feet by S - T therefore leaves that line at S - T: at a = 3, 9.8 and 13 m/s/s that is
  0.82, 0.78 and 0.75 of S, and about 0.6 where the sim asks 20 m/s/s and S is capped [inferred, arithmetic]; the row's band
  [0.75, 1.05] sits on its lower edge. The chest then lies at S - 0.65T, which fails the companion "law + kBankTrunkShare x
  drawn tilt" by T (10-20 degrees on hard bends). That companion and the row describe a roll of S, not S - T. (3) The landed
  tilt row :510 reads `DrawnChaser::lean()` (T) only, so it stays meaningful under either roll [read: model_rig_tests.cpp:
  510-523]. Fix before code: roll by S about `feet`, chain on top as now; or keep S - T and rewrite both bars. Also say the
  row's denominator is the CAPPED law atan(min(|a|, mu g)/g) and which mu it runs at, and extend `LeanFrame`
  (world_app_tests.cpp:908-914) to keep the posed joints, which it does not today [read]. Put the law in a free function
  so L21 can call it without touching `DrawnChaser`.]
- The acceleration is DrawnChaser's own low-passed one, so the roll cannot lag the tilt and the landed lead row
  `the_hunters_lean_peaks_at_or_before_its_turn_does` guards it [read: game/tests/world_app_tests.cpp:1160; summary:
  S/scout_uncanny_by_physics.md:343-345]. The sim's own `lean` (world_app.cpp:534) leads it and is reported beside it
  [ours, after S/scout_turning_and_transients.md:447-449].
- mu is a per-kind number read by the picture: 1.0 for human-law bodies, the hunter's from his call (5, call 3); the
  capability itself lives in the sim (L4) [summary: S/scout_uncanny_by_physics.md:271-273].
- Files: game/model_rig.h, game/model_rig.cpp (`DrawnChaser`, `GaitMotion`, `apply_motion`), game/world/world_app.h,
  game/world/world_app.cpp (one ChaserPose field), game/world/stage.cpp (fill it), game/tests/model_rig_tests.cpp,
  game/tests/world_app_tests.cpp, CHANGELOG.md [summary: S/scout_uncanny_by_physics.md:335-337].
- Red today, his kept run `run-20261112-204506` by `DZ_LEAN_RUN`: on bends with |a_lat| >= 3 m/s/s held >= 0.25 s, the
  median of (drawn ankle-midpoint-to-pelvis lean across the travel) over the law's angle lies in [0.75, 1.05] [ours, bar
  after S/scout_turning_and_transients.md:296-300]. Today well under 0.2 [inferred: the 10 cm offset alone gives about 3
  degrees, S/scout_turning_and_transients.md:414].
- Second readers' holes, closed by two gated companions [ours, from S/scout_turning_and_transients.md:428-438 and
  S/scout_uncanny_by_physics.md:341]: the stance width across the travel stays within 3 cm of main's (no splayed feet);
  and the chest's lean in space lies within 5 degrees of (law + kBankTrunkShare x drawn tilt), printed per frame.
- Must not break: the landed tilt rows on main, including `in_a_steady_turn_the_drawn_body_leans_into_it_by_its_
  centripetal_acceleration` [read: game/tests/model_rig_tests.cpp:510], which this composition leaves as they are
  [inferred]; the lead row; G1; G2.
- Named risk, registered first: the rocking and lean-rate rows were tuned at a sixth of this gain; if they go red, the
  cause is the sim's sway, it goes to the chase seat, and no row is weakened [summary:
  S/scout_turning_and_transients.md:306-308].
- Report only: the share of frames where the sim asks a_lat > mu g (a number for L4), and the outside foot's clearance to
  walls (0.70 m out at 45 degrees with a 0.984 m leg; more for the hunter's 1.196 m) [summary:
  S/scout_turning_and_transients.md:233-235, :304-305; S/scout_gaits_any_body.md:182].
- Cost: about 2 atan, 1 sqrt and one rotation of 21 joints, under 1 microsecond a character a frame [summary:
  S/scout_turning_and_transients.md:276-279]. Not measured.
- Tier: prove it (core geometry, and it adds rows beside landed ones) [ours].
- Clip, the one the librarian ruled: the same corner, four columns, each labelled with speed, radius, lean asked and lean
  drawn: main after L2 | roll on, trunk share 0.35 | 0.7 | 1.0; values other than 0.35 marked ours [read: brief:1598].
  mu for this clip is his call 3's default, labelled.
- New against the record: the 1/5.8 comparison and the missing whole-body lean [summary: second reader,
  S/scout_turning_and_transients.md:422-424].

#### L4 HUNTER-GRIP: the cornering law for the hunter in the sim, behind its dial (chase seat, A)
- Builds: land `turn_law` from the l182 branches with its default 0 (off), the hunter's grip mu as one dial, and turn the
  pending sway row `the_hunters_drawn_lean_on_a_straight_pending_L182` from report to gate if the lines lap is ready
  [summary: S/ground_locomotion_and_yardstick.md:127-135; read: game/tests/world_app_tests.cpp:1095].
- First, A runs its own registered grip arms g13/g16/g20 and the brutal sweeps [summary:
  S/ground_locomotion_and_yardstick.md:133-135, :298].
- Files: chase/speed.h, chase/run.cpp, chase/SPEED_MODEL.md, chase/tests/feel_tests.cpp [summary:
  S/ground_locomotion_and_yardstick.md:127-132]. No game/ file.
  [2nd reader: incomplete. `git diff --stat main...origin/l182-lines -- chase` also lists chase/chaser.cpp (+90; the laws
  at :217-223), chase/chaser.h (`turn_law`, `grip_mu`, :45-46) and chase/speed.cpp [read]. And turning the pending row
  world_app_tests.cpp:1095 into a gate IS a game/ file, the same file L2 and L3 edit in waves 0-1. The branch's merge base
  is 84ad3b3, 81 commits behind main, and its tip c357bbd carries all the lines' dials (clearance, feelers, sway, scrape
  ease, refuse brake), not the turn law alone [read: git log].]
- Red today: with the dial at the hunter's H2 and his kept run's inputs replayed, the hunter's speed through each bend is
  at least H1's at that radius; today the dial does not exist on main [summary:
  S/ground_locomotion_and_yardstick.md:129-130].
  [2nd reader: that red is a compile red, and the row passes for any law faster than H1, mu 100 included. The row that
  tests the law is an upper bound: with the dial on, on every Mesh tick the hunter's speed x turn rate is at most mu g
  (plus a stated slack). It is red on main by a reading: the hunter's turns ask up to about 2.1 g (section 1d; S/scout_
  turning_and_transients.md:16-21), above 1.33 g. Keep "at least H1's" as the companion.]
- Must not break: with the dial off, G1 byte-identical. With it on, his runs replay to new fingerprints by design; that
  is his call 4, never a default [ours].
- Cost: one min and one sqrt per chaser per tick [inferred].
- Tier: prove it (the sim) [ours].
- Clip: the same corner, L3 on in both columns: dial off | dial on at his mu, labelled with the speed held [ours].

### 2d. Laps that turn the hunter-only code into the shared system

#### L5 STRIDE-CLOCK: one stride phase per id, stepped on the 240 Hz tick (animation seat, C)
- Builds: `hunter_phase_` leaves the stage and becomes a per-id phase advanced each tick by speed x `kTickDt` x
  `gait_phase_per_metre(rest, speed)`, kept before and after, drawn at alpha [summary:
  S/scout_performance_and_determinism.md:275-279].
- Its home must not be under `ease_on_`: `ease_poses` returns early when easing is off and the clip tool turns it off on
  alternate passes; it must not cycle in the Frozen branch [summary: S/scout_performance_and_determinism.md:280-283].
- Files: game/world/world_app.h, game/world/world_app.cpp, game/world/stage.h, game/world/stage.cpp,
  game/tests/world_app_tests.cpp, CHANGELOG.md [summary: S/scout_performance_and_determinism.md:284-286].
- Red today, his kept run played through `advance` at 1/144, 1/240 and 1/360 s frames:
  `paused_the_drawn_legs_stand_still` (2 s paused moves the phase by 0; today it keeps cycling) [summary:
  S/scout_performance_and_determinism.md:66-69, :293].
  [2nd reader: the reading holds (shell.cpp:156 returns before any tick when paused; world/main.cpp:188 still draws with
  the frame's delta; stage.cpp:269 sums it) [read]. But the row cannot be RUN red on main: the phase lives in `WorldStage`,
  which only the D3D12 tools build, and no test creates one (`grep -c WorldStage game/tests/world_app_tests.cpp` = 0)
  [read]. The scout's step one is needed and is missing here: first move today's frame-summed rule unchanged behind
  `ChaserPose::stride_phase`, register both rows red on that commit, then make it per tick
  (S/scout_performance_and_determinism.md:294-296).]
- Companion: `the_drawn_stride_is_the_same_at_144_240_and_360_frames_a_second`, sampled at offsets of 1/48 s inside a
  tick as well as on tick boundaries, schedule from round(i x 1e9 / rate), the phase moved at least one radian, and
  `hunter_phase_` gone from the stage so the palette reads the field [summary: second reader,
  S/scout_performance_and_determinism.md:394-404]. The three rates agree to about 1e-6 of a tick, not to the bit [summary:
  S/scout_performance_and_determinism.md:73-77].
- Must not break: G1 (the clock is picture-side); every model_rig row (gait_pose unchanged); G2.
- Cost: under 0.2 microseconds a chaser a tick, one lerp a frame [summary: S/scout_performance_and_determinism.md:297].
- Tier: prove it [summary: S/scout_performance_and_determinism.md:273].
- Clip: none needed for the clock; the row proves it [summary: S/scout_performance_and_determinism.md:307-308].

#### L6 FIGURE-PASS: one figure per drawn id from a kind table; the dark one drawn first (animation seat, C)
- Builds: (a) a kind table: per kind its model file, hand length, mu, head setting and LOD files, replacing the hunter's
  hard-coded load (hand 0.22, `hunter.glb` by name) [ours; the hard-coding [summary: S/ground_code.md:201-204]]; (b) one
  `ModelFigure` per drawn id instead of one; (c) the per-figure pass (gait_pose, apply_motion, palette) moved out of
  `place_figures` into one function in a new game/figure_pose.{h,cpp}, so later laps edit that file and not the stage
  [ours, for section 3]; (d) the dark one, whose figure slot list misses it, takes the hunter's model [summary:
  S/scout_shipped_systems.md:285-296]. His pick allows it: the option he read, "it wears the hunter's shape as a
  stand-in" [read: brief:1229-1230].
- Files: game/world/stage.h, game/world/stage.cpp, game/world/figures.h, new game/figure_pose.h/.cpp, new
  game/body_kinds.h, game/tests/world_app_tests.cpp, game/CMakeLists.txt, CHANGELOG.md [ours].
- Red today: on the first of his kept runs whose replay reaches overtime (the builder counts them first; if none, the
  flee bot's record with a short `run_length_s`, and the row says so [summary: S/scout_shipped_systems.md:298-300]):
  `in_overtime_the_dark_one_is_drawn_running_in_the_hunters_shape`. Every frame the Dark is inside the view frustum it
  has a posed model at its sim place whose phase moved since the last tick; today it is not drawn at all [summary:
  S/scout_shipped_systems.md:290-292]. The frustum test, the place check and the moving phase close the second reader's
  holes [summary: S/scout_shipped_systems.md:449-455]. Who is posed when the hunter and the dark one are both on stage is
  stated in the row: both, up to two hunter-shaped figures [ours].
  [2nd reader: as for L5, "today it is not drawn" is a reading (figures.h:28 gives Dark 0 slots; stage.cpp:283 skips it)
  [read], not a run a test can make: `place_figures` needs the renderer. Do (c) first as a move with no change of
  behaviour, register the row against the moved function in game/figure_pose.cpp (red there: it skips the Dark), then
  (a), (b), (d). His pick's label is "A new creature" (brief:1229); the hunter's shape is the option's stand-in (:1230),
  so the kind table must let the Dark's model change later without a stage edit.]
- Must not break: the hunter's palette bit-identical on a run with no dark one [ours]; G1; G2; the box chasers as today.
- Cost: CPU per posed figure as today, single-digit microseconds, not measured [summary: S/ground_code.md:239-241]; a second
  full hunter model on screen about 0.2 ms of GPU [summary: S/scout_shipped_systems.md:268-270, an inference from the one
  +0.39 ms measure for two models].
- Tier: check it [summary: S/scout_shipped_systems.md:303].
- Clip: the dark one coming from behind in overtime from the look-behind, one take [summary:
  S/scout_shipped_systems.md:315-316].

#### L7 POSE-BENCH: the CPU cost per figure, measured once (audio-and-physics seat, E)
- Builds: a timing row in R4.7's pattern (`DZ_BENCH=1`) that times `gait_pose`, `apply_motion` and `Rig::palette` on
  hunter.glb's rest over a fixed sweep, median microseconds per figure [ours, after S/ground_physics_and_fp_body.md:195].
  Timing the whole of `place_figures` would mix the box chasers in [summary: S/scout_performance_and_determinism.md:406-407].
- Files: a new bench in tools/ or game/tests/ and its CMake line only [ours].
- Red today: the row does not exist; every cost in this file is a count [summary: S/ground_physics_and_fp_body.md:259].
- Must not break: nothing; it runs only with the flag and only on a quiet machine [ours].
- Cost: 0 in the frame. Tier: check it. Clip: none [ours].

#### L8 MOTION-CHECKS: physics checks over any pose sequence, as an instrument (audio-and-physics seat, E)
- Builds: a pure game/motion_checks.{h,cpp} with P1 contact (a foot is down when its ball is within a band of the PROBED
  floor, a test independent of any pass under test), P2 slide per contact in the world frame, P3 sink and float with
  PhysDiff's 5 mm; `dz-yardstick --checks` and `--trace FILE` so the yardstick scores what the game drew (L1's pose.csv)
  [summary: S/scout_evaluation.md:137-145, :189-195; S/scout_authoring_and_tuning.md:256-257]. P1's band is [ours]; the
  slide bar 20 mm rests on Prazak 2011's abstract, under about 21 mm perceived [summary: S/scout_evaluation.md:79-85].
- P4 (pelvis falls at g in flight) is left out: it is built into gait_pose and can only go red on a mutant [summary:
  S/scout_evaluation.md:144].
- Files: new game/motion_checks.h/.cpp, its test file, tools/yardstick/main.cpp, tools/yardstick/README.md,
  game/CMakeLists.txt, tools/CMakeLists.txt [summary: S/scout_evaluation.md:189-195].
- Red today: P3 on ~~main's~~ hunter below 4.5 m/s, where the toe sinks 105-108 mm (found, not fixed) [summary:
  S/scout_evaluation.md:381-384]; on his kept run through `--trace`.
  [2nd reader: WRONG commit. The 105-108 mm was measured on l205-stomp-c at 7b184db ("Measured at 7b184db", hand-back
  p-l205-stomp-C:255, :259, :275) and its cause is "the roll pitches the foot with the ankle pinned" (:275) [read]. The roll
  (`motion.legs.roll`) exists only on the branch (l205-stomp-c model_rig.cpp:815, :836; no hit on main) [read]. So the red
  is the post-step-0 tip's, not main's, and must be re-measured on ccc65ab once landed; if it reads under 5 mm there, P3
  has no recorded red and the lap's red rests on P2 alone.]
- Must not break: the yardstick's 12 rows; G2 [summary: S/ground_code.md:327-334].
- Cost: 0 per character per frame; tests and tools only [summary: S/scout_evaluation.md:201].
- Tier: prove it (an instrument) [summary: S/scout_evaluation.md:270].
- Clip: none; numbers.

#### L9 FEET-HELD: the hunter's stance foot held where it landed (animation seat, C)
- Builds: lock the ball on strike, release on lift-off or past 0.20 m from where the gait puts it, decay the offset by the
  damper already on main, never ease INTO a lock (that rule is ours), re-reach with `reach_leg` clamped 0.015 m short
  [summary: S/scout_ik_and_feet.md:191-217]. The lock's edges and defaults are Holden's (MIT, idea restated) [summary:
  S/scout_ik_and_feet.md:134-147]. It rides on L205's `plant` [summary: S/scout_ik_and_feet.md:299-301].
- Feet with memory (55d1451) stay out: on a riser they leave a foot 8.3 cm under the new floor against a 1 cm bar
  [summary: S/scout_ik_and_feet.md:214-217].
- Files: game/model_rig.h/.cpp, game/figure_pose.cpp (L6), game/tests/model_rig_tests.cpp,
  game/tests/world_app_tests.cpp [ours, after S/scout_ik_and_feet.md:303-309].
- First, the falsifier: measure on main after step 0; if the stance ball moves under 3 cm per contact there, the lap stops
  at the row [summary: S/scout_ik_and_feet.md:323-324; S/scout_gaits_any_body.md:364-371].
- Red today, his kept run `run-20261112-204506`: `a_planted_foot_of_the_drawn_hunter_stays_where_it_landed`, ball, ankle
  and heel each within 3 cm in the world from strike to lift-off, contact decided by L8's P1 (not the lock's own flag), at
  least 6 contacts of which some at the lean rows' turn rates, and a flat-floor height bar [summary: second readers,
  S/scout_ik_and_feet.md:467-480; S/scout_evaluation.md:373-388]. Main's slide is 0.17-0.45 m a contact by one arithmetic
  on guessed lengths, 0.12-0.50 m over the length range [summary: S/scout_evaluation.md:233-251].
- Must not break: G2 (if a leg joint leaves rms/sd <= 1, the trade goes to the chair, not to a constant [summary:
  S/scout_evaluation.md:263-264]); L205's knee and hips rows; G1.
  [2nd reader: G2 as run today cannot see this lap. The yardstick scores `gait_pose`'s angles (S/ground_locomotion_and_
  yardstick.md:188-195), and the lock sits after it in the figure pass, so a lock that holds the ball while the knee
  pops passes G2 [inferred]. Run G2 through L8's `--trace` on L1's pose.csv of the locked hunter. And the 0.12-0.50 m
  slide range was swept over thigh 0.42-0.48 and shin 0.42-0.46 m; the hunter's own are 0.621 and 0.501
  (S/scout_gaits_any_body.md:182), outside it, so the falsifier run is the only number.]
- Cost: well under 1 microsecond plus rays only at strikes [summary: S/scout_ik_and_feet.md:257-263].
- Tier: prove it [summary: S/scout_ik_and_feet.md:325].
- Clip: the sharpest turn, outside, feet in frame, real speed then a quarter: main | L9 [summary:
  S/scout_ik_and_feet.md:331-333].

#### L10 DRAWN-STATE: the chase's gait chooses the drawn state; the drop first (animation seat, C)
- Builds: a per-id `DrawnState` (Run, Air, Land) beside `DrawnChaser`; in Air the gait is posed at the last Mesh speed
  with the phase held and the floor snap off; Land poses the stand [summary: S/scout_states_and_transitions.md:316-319,
  :326-330]. Rule: the chase sets when and how long, the picture sets how [summary:
  S/scout_states_and_transitions.md:176-179]. Waiting and OffStage chasers are never drawn, so Wait is no state [summary:
  S/scout_states_and_transitions.md:221-226].
- Files: game/model_rig.h/.cpp, game/world/world_app.h/.cpp, game/figure_pose.cpp, game/tests/model_rig_tests.cpp,
  game/tests/world_app_tests.cpp [ours, after S/scout_states_and_transitions.md:320-322].
- Before code: count the hunter's Mesh to Drop ticks in his 20 kept runs; the first found is the case; if none, the
  scripted case stands alone and the hand-back says so [summary: S/scout_states_and_transitions.md:323-325].
- Red today: on every Drop tick the drawn pose after `apply_motion` matches the last Mesh pose within a tolerance and its
  ankles stay apart along the heading by half the take-off step; today the hunter is drawn standing [summary:
  S/scout_states_and_transitions.md:326-332, :434-441].
- Must not break: on a run with no link the drawn pose is bit-identical to today's; G1; G2 [summary:
  S/scout_states_and_transitions.md:334-335].
- Cost: under 1 microsecond a chaser [summary: S/scout_states_and_transitions.md:303-309].
- Tier: check it [summary: S/scout_states_and_transitions.md:338].
- Clip: the drop from 4 m behind, main | L10 [summary: S/scout_states_and_transitions.md:343-345].

#### L11 TRANSITIONS: a pop at a gait switch decays instead (animation seat, C)
- Builds: spring inertialization of the drawn pose (Bollo via Holden's `spring.h`, MIT), offsets in the body's frame so the
  root stays where the sim put it, triggered by a change of gait [summary: S/scout_motion_matching.md:153-170]. It does
  not cure the stop pop that L205 already cured inside `gait_pose` [summary: S/scout_motion_matching.md:168-169].
- Half-life: 0.06 s, the player body's own settle time, until his eye picks [ours; 0.1 s is Holden's demo value for
  mocap at 60 Hz [summary: S/scout_motion_matching.md:170]].
- Files: game/model_rig.h/.cpp, game/figure_pose.cpp, game/tests/model_rig_tests.cpp [ours].
- Before code: count head-on wall stops above half top speed in his 20 kept runs [summary:
  S/scout_motion_matching.md:231-233].
- Red today: at a wall stop (speed 0 and Recover in one tick, chaser.cpp:416-425) no joint jumps past 3 x speed x dt +
  0.025 m [ours, S/scout_motion_matching.md:225-230], and two companions so a speed low-pass or a slew limiter cannot
  pass: no per-joint velocity step above a bar, and no planted-foot slide during the decay [summary: second reader,
  S/scout_motion_matching.md:356-363].
  [2nd reader: the last companion cannot pass with the layer as built here: it decays an offset on every joint, feet
  included, so after a dead stop the feet glide for the decay (the reader's own point, scout_motion_matching.md:362-363).
  State the order before code: gait_pose, then this layer, then L9's lock (which lands a wave earlier), so the lock holds
  the feet the layer moves; or exempt locked feet from the offset.]
- Must not break: on a steady run the layer changes no joint by more than 1e-6 m [summary:
  S/scout_motion_matching.md:234]; G1; G2.
- Cost: under 1 microsecond a figure, 576 bytes of state [summary: S/scout_motion_matching.md:171-172].
- Tier: check it [summary: S/scout_motion_matching.md:237].
- Clip: one wall stop from behind and from the look-behind: main | 0.06 s | 0.1 s [ours].

#### L12 PICTURE-PHYSICS-ON-TICK: the soft-keyed upper body stepped on the sim tick (audio-and-physics seat, E)
- Precondition: L185 steps 4-5 landed (section 1b) and L5 landed (the pose is made per tick only once the phase is)
  [summary: S/scout_secondary_and_physics.md:179, :420].
- Builds: the picture world stepped once a tick and drawn at alpha; R4.3, R4.4, R4.6 re-run at 1/240 s because the solver
  is not dt-corrected [summary: S/scout_secondary_and_physics.md:421-423]; a catch-up cap after a hitch [summary:
  S/scout_secondary_and_physics.md:418-419]; `Stabilize` and constraint priorities behind R4.3/R4.4 as ours [summary:
  S/scout_secondary_and_physics.md:407-410]; R4.7 timed first [summary: S/scout_secondary_and_physics.md:234-235].
- Second half, its own lap if the first is green: the level's static shapes in the picture world, so arms meet walls,
  with a collision-group rule between bodies [summary: S/scout_secondary_and_physics.md:257-266, :415-417].
- Files: game/ragdoll.h/.cpp, game/tests/ragdoll_tests.cpp; the wall half adds a read-only accessor in sim/physics.h/.cpp
  (the chase seat writes it) and game/world/stage.cpp [summary: S/scout_secondary_and_physics.md:259-261].
  [2nd reader: incomplete. Stepping the picture world once a tick needs a caller on the tick: on E's branch the stage
  draws pose, `Ragdoll::key`, `drawn_from`, palette per frame (S/ground_physics_and_fp_body.md:79); after L6 that is
  game/figure_pose.cpp, and the tick is in game/world/world_app.cpp. Either file is in another seat's lap in wave 4 (C's
  L9, A's L24). Name the caller before scheduling. In wave 5 the wall half also needs A's accessor landed first.]
- Red today, his 16 kept runs: no drawn elbow, wrist, hand or head, nor the forearm segment between, more than 1 cm inside
  static geometry, with a count of frames within 10 cm of geometry printed; if main already reads under 1 cm, the lap
  stops [summary: S/scout_secondary_and_physics.md:262-268, :386-398].
- Must not break: R4.1 (16 runs identical), R4.2 (legs keyed) [summary: S/scout_secondary_and_physics.md:269-270].
- Cost: could not estimate; the only figure is a lower bound from a pile benchmark [summary:
  S/scout_performance_and_determinism.md:237]. R4.7 gates growth past the hunter [summary:
  S/scout_secondary_and_physics.md:234-235].
- Tier: prove it [ours].
- Clip: the hunter through the tightest doorway on a kept run: main | lap [summary: S/scout_secondary_and_physics.md:282].

#### L13 FOOTFALLS-FROM-STRIDE: the heard step fires on the drawn step (audio-and-physics seat, E)
- Builds: rebase `origin/l192-footsteps` onto L5 so the step sound reads the per-tick `stride_phase`; today the mixer keeps
  its own clock per voice from speed [summary: S/scout_performance_and_determinism.md:51-54, :287-288].
- Files: the WIP hands the phase over in the stage [summary: S/scout_performance_and_determinism.md:287]; after L5 the
  phase is in `ChaserPose`, so the rebase reads it in game/world/sound.cpp and touches audio files only, not the stage
  [ours]. After L5.
- Red today: on his kept run, each loud hunter step falls on a drawn footfall within one tick; today two clocks [summary:
  S/scout_states_and_transitions.md:74-76].
- Must not break: G1; his picked stomp, "recorded heavy hits, three to a step" [summary: S/ground_his_words.md:477-479].
- Cost: 0 extra in the pose [inferred]. Tier: check it [ours]. Clip: an audio clip of one straight, main | lap [ours].

#### L14 PIPELINE-IN-REPO: the Blender scripts that made the bodies, committed (chase seat, A)
- Builds: copy `rig.py`, `kidlib.py`, `hunter.py`, `hunter_bake.py`, `preview.py`, `glbcheck.py` and `bl.js` from pane A's
  temporary folder into `art/tools/`, with `bl.js`'s room lock path made a setting [summary:
  S/scout_authoring_and_tuning.md:93-104, :436-437; S/scout_models_and_skeletons.md:42-46].
- Red today: `git ls-files art` lists `textures.py` only [summary: S/ground_constraints_and_roster.md:92-93].
  [2nd reader: `git ls-files art` lists 5 files, four texture .jpg and `art/tools/textures.py`; the row is
  `git ls-files art/tools` [read]. The list above is short: `hunter_bake.py` does `import bakelib as BL` (:8) and
  `bakelib.py` is not listed; the folder (still there, 85 files) also holds `bake.py` (the kid's), the dressing and fit
  scripts (`dress_v8.py`, `fit.py`, `export_dressed.py`) and the sprinter's (`sprinter.py`, `sprinter_bake.py`, ...) [read:
  ls]. Copying the seven named passes the row and leaves the hunter unbakeable. Add a row: every local import of a
  committed script is committed; and A names which versions made the shipped GLBs.]
- Must not break: nothing in the build [inferred]. Cost: 0. Tier: just do it [ours]. Clip: none.
- Why now: a cleared temporary folder loses the only way to make the next body [summary:
  S/scout_models_and_skeletons.md:46].

### 2e. The first lesser kind to get a body (default the interceptor; his call 5)

#### L15 INTERCEPTOR-BODY: its model and its lighter levels, offline (chase seat, A, who made the first bodies)
- Builds: `interceptor.glb` and two lighter levels from MPFB through L14's scripts, shaped by E's sheet ("~1.70 m ...
  broad, low centre, legs wide" [summary: S/scout_models_and_skeletons.md:228-229]); influences cut to four on purpose,
  with `lock_active=False` on the normalise [summary: S/scout_models_and_skeletons.md:268-273]; a CREDITS.md row [ours].
- Gate rows run once per content model [summary: S/scout_models_and_skeletons.md:264-282]: loader rules, no joint twice in
  a vertex, every vertex weighted, rest identity and limb lengths under the stand-in gait.
- Red today: `content/models/interceptor.glb` does not exist [summary: S/ground_constraints_and_roster.md:206].
- Must not break: the hunter's and the kid's gate rows [ours].
- Cost: GPU skin and refit about 1.2-1.5 ns a vertex, from one measure of two models [summary:
  S/scout_performance_and_determinism.md:244-247, downgraded there]; targets about 60k vertices full and 15k light are ours
  [summary: S/scout_performance_and_determinism.md:259-261].
- Tier: check it, with the gate rows as the proof for stored data [ours].
- Clip: the model in E's fog line-up beside the hunter, still, front and side [ours, after
  S/scout_models_and_skeletons.md:357-358].

#### L16 TIERS: nearest bodies full, the rest light, the clocks never drop (animation seat, C)
- Builds: the interceptor's row in L6's kind table; per tick, the hunter and the nearest two lesser chasers in full, the
  rest on the light level without floor probes; a newcomer must be 10% nearer to take a rank; the light swap only while
  unseen; clocks for every chaser on stage always run [summary: S/scout_performance_and_determinism.md:198-221]. His
  pick: "Nearest two or three full detail" [read: brief:1274].
- Files: game/body_kinds.h, game/figure_pose.cpp, game/world/world_app.cpp (rank per tick),
  game/tests/world_app_tests.cpp [ours].
- Red today: on the first of his kept runs with interceptors on stage (count first), every interceptor inside the view is
  drawn as a posed model; today they are boxes [summary: S/ground_code.md:210-214].
  [2nd reader: this row tests that interceptors are posed, not the tiers: drawing every one at full detail passes it. The
  tier rows must be the gated ones: at most three full bodies a tick (hunter plus two), no level swap while the body is in
  view, every on-stage clock moves each tick. And these files (game/figure_pose.cpp, game/world/world_app.cpp) are outside
  the set section 6 allows the first lesser kind, so as written this lap is a registered miss; either move the tiers before
  L15 as a system lap or say the miss now.]
- Must not break: the hunter is always tier A; G1; the box kinds as today [ours].
- Cost: tier A about 10-25 microseconds of CPU a frame, tier B about 10, by count [summary:
  S/scout_performance_and_determinism.md:240, :256]; L7's bench replaces these before landing [ours].
- Tier: check it [ours].
- Clip: a chaser crossing from rank 3 to rank 2 in view, tiers on | all full [summary:
  S/scout_performance_and_determinism.md:304-306].

#### L17 HEAD-HOLD: the interceptor's one cue, T2, as a head setting (animation seat, C)
- Builds: per kind `head_hold`: at 1 the head's orientation holds on its target in the world against the trunk's twist,
  bank and pitch, and re-fixes in one turn at the landed 1000 degrees a second when the target leaves a 0.91 rad reach;
  rotation only [summary: S/scout_upper_body_and_gaze.md:216-223]. The source is pigeons standing on a moving perch,
  rotation held, translation not [summary: S/scout_upper_body_and_gaze.md:106-112]. The re-fix rule is ours [summary:
  S/scout_upper_body_and_gaze.md:219].
- Known limit: neck_01 and head share one aim, so the neck holds with the head; a separate neck pitch needs a new channel
  that nobody sourced [summary: S/scout_models_and_skeletons.md:253-261].
- Files: game/model_rig.h/.cpp (`chain_pose`), game/body_kinds.h, game/tests/model_rig_tests.cpp [ours].
- Red today, the same kept run as L16: while an interceptor looks at the player, its head's world yaw and pitch stay within
  a bar of the target between re-fixes, while the chest turns; today it rides the chain [ours].
  [2nd reader: the bar has no number; and setting head = target every tick (no re-fix, no reach) passes it. Give the bar,
  and a companion that a target leaving the 0.91 rad reach produces a re-fix at no more than 1000 degrees a second.]
- Must not break: the hunter's head unchanged (`head_hold` 0) [ours]. The brief's record of his pick: "its head stays
  humanlike" [read: brief:1154].
- Cost: under 0.1 microsecond [summary: S/scout_shipped_systems.md:266-267].
- Tier: check it [ours].
- Clip: the interceptor from the look-behind running past and turning: hold 0 | hold 1 [summary:
  S/scout_upper_body_and_gaze.md:282-283].

### 2f. The player's body on the same system

#### L18 SLIDE-LEG: the parked L188 step 2, rebased and run (animation seat, C)
- Builds: the leading leg into the picture early in a slide, and the shoulder-sliver row, from `b676860` [summary:
  S/ground_physics_and_fp_body.md:244-246]. It answers his picks of item 173, which the brief records at brief:1175
  [summary: S/ground_his_words.md:426-428].
- Red today: `in_a_slide_the_leading_leg_comes_into_the_picture_early`, registered red, unrun [summary:
  S/ground_physics_and_fp_body.md:218-219].
- Must not break: G3; the body rows; G1 [ours]. Cost: a few vectors a tick [inferred]. Tier: check it [ours].
- Clip: a first-person slide on his kept run, main | lap [ours].

#### L19 HEAD-FIRST-LOOK: the head turns first, the chest follows, the hips follow the travel (animation seat, C)
- Builds: the look half only of `a60944d`: the chest on the first game's trunk spring, the hips within 45 degrees and
  720 degrees a second of the eyes (Valve, via the WIP, study only), the chest's lag capped at 50 degrees; per tick in
  `Body::tick` [summary: S/scout_player_first_person.md:237-245]. His words: "perhaps the head moves first when you look,
  then it moves the rest of the body underneath" [read: brief:1128].
- Files: game/body.cpp, game/body.h, game/tests/body_tests.cpp, CHANGELOG.md [summary: S/scout_player_first_person.md:244].
  [2nd reader: a60944d's look half also edits game/shell.cpp and game/shell.h (the chest's spring `look_back_chest_` on
  `kTrunkFollowTime`) [read: `git diff main...origin/l188-wip-look`]. Consistent with this lap's "per tick in
  `Body::tick`" (the spring moves into Body, as S/scout_player_first_person.md:245 says), so shell.* stays out; a builder
  who cherry-picks the WIP's look half will meet them.]
- Red today: on the gym bot run and one first-person burst of his kept run, the drawn SHOULDERS in the palette peak after
  the view by at least 3 ticks while the hips stay within 45 degrees; today one yaw drives all three
  (`body.cpp:225-230`) [summary: S/scout_player_first_person.md:248-251; the palette measure closes the second reader's
  hole, :385-390].
- Must not break: G3; `at_the_full_glance_the_neck_the_chest_and_the_shoulders_are_out_of_the_picture`; the crossover row;
  G1 [summary: S/scout_player_first_person.md:252-255].
- Cost: about 1-2 microseconds a tick [summary: S/scout_player_first_person.md:217]. Tier: check it [summary:
  S/scout_player_first_person.md:256].
- Clip: a 90 degree flick while jogging, looking 45 degrees down: main | lap [summary:
  S/scout_player_first_person.md:270-271].

#### L20 PLAYER-CHAIN: the player's body through `kinetic_chain`, pinned at the eye (animation seat, C)
- Builds: the player posed through the same chain as the hunter, then translated so its eye is the picture eye, planted
  feet re-reached; the run's pelvis and thorax counter-twist then switched on [summary:
  S/scout_player_first_person.md:260-261; S/ground_code.md:70-71].
- Files: game/body.cpp, game/model_rig.h/.cpp, game/tests/body_tests.cpp [ours].
- Red today: on the gym bot run, the drawn pelvis and thorax turn against each other by the measured amounts, as the
  hunter's row at model_rig_tests.cpp:651 asks; today the player has no twist [summary: S/ground_code.md:64].
- Must not break: with the twist off, L19's pose to within 1 mm; G3; G1 [summary: S/scout_player_first_person.md:260].
  [2nd reader: `kinetic_chain` also turns each arm by `c.arm_twist` = (kArmTwistShare 1.5, OURS, model_rig.h:190) of the
  thorax (model_rig.cpp:616, :630-634) [read]. His pick `player_body-4`, "Tune the player's own" (brief:1282), keeps the
  hunter's arm notes off the player. Run the player with `arm_twist` 0 or its own share, and say which.]
- Cost: about 17 joints turned, 1-2 microseconds a tick [summary: S/scout_player_first_person.md:217]. Tier: prove it
  (shared code) [ours].
- Clip: looking down while sprinting, main | lap [ours].

#### L21 PLAYER-LEAN: the player's lean from the same law (animation seat, C)
- Builds: the unsourced `3 + 9 x pace` degrees [summary: S/ground_code.md:175] replaced by L3's function at mu 1.0; the
  camera untouched; the feet set outward under the eye by L sin(theta) [ours, unsourced, as the second reader marked:
  S/scout_turning_and_transients.md:445].
- Files: game/body.cpp, game/tests/body_tests.cpp [ours].
- Red today: on the gym bot run's bends, the drawn leg line's lean over the law's angle in [0.75, 1.05]; today the lean is
  a fixed share of pace [ours].
  [2nd reader: inherits L3's open composition (see the note under L3) and needs L3's law as a free function, else this
  lap edits model_rig.* too. Start it only after L3's form is fixed.]
- Must not break: G3; the body rows; G1 [ours]. Cost: two vector offsets a tick [summary:
  S/scout_turning_and_transients.md:278]. Tier: check it [ours]. Clip: first person, looking down to the side in a bend,
  his item 159's view [ours].

#### L22 PLAYER-FEET: the held-foot pass for the player through turns, crossovers and stairs (animation seat, C)
- Builds: L9's lock in `Body::pose`, beyond the straight run where it already holds by construction [summary:
  S/scout_ik_and_feet.md:273-276].
- Red today: on the gym bot run's turns and stairs, a planted ball within 3 cm by L8's P1 contact; the landed row covers
  only a straight run on a flat floor [summary: S/scout_ik_and_feet.md:45-49].
- Must not break: G3; `running_a_planted_foot_stays_where_it_landed`; G1 [ours]. Cost: under 1 microsecond plus rays at
  strikes [summary: S/scout_ik_and_feet.md:257-263]. Tier: prove it [ours]. Clip: first person looking down while
  strafing into a crossover and onto stairs [summary: S/scout_ik_and_feet.md:336-337].

#### L23 NECK-PITCH: looking down turns the eye about the game's own neck pivot (animation seat, C)
- Builds: the eye offset for pitch on the game's pivot, `eye_to_neck` 0.13 down and `neck_back` 0.09, not Cardboard's
  8.0/7.5 cm [summary: second reader, S/scout_player_first_person.md:115-117].
- Red today: standing, 60 degrees down, collar coverage falls and the toes come into the picture (the L174 capture
  measure) [summary: S/scout_player_first_person.md:263-264].
- Must not break: G3 is changed by design for pitch only; it is his call whether the view may move at all [ours].
  [2nd reader: that call is not among section 5's ten, so this lap cannot start as written. Put it there. G1 must also be
  run: whether anything in the sim reads the eye's position was not checked by this path or by me.]
  Cost: one rotation [summary: S/scout_player_first_person.md:218]. Tier: check it [ours]. Clip: looking down standing and
  running [ours].

#### L24 WALL-HANDS: hands meet a wall the body rubs against (chase seat, A, who knows the sim's rays)
- Builds: a swept hand point against the sim's read-only ray through the existing `HandOverride` hook, a grasp rule "reach
  ahead when left behind, hold until left behind" [summary: S/scout_shipped_systems.md:170-179;
  S/ground_physics_and_fp_body.md:122-123].
  No source covers a first-person hand on a wall; the mechanism is ours [summary: S/ground_physics_and_fp_body.md:153].
  His words at brief:1120: "you see their arms and hands touch up against it as you move" [summary:
  S/ground_his_words.md:353-358].
- Red today: L184 row 3, the hand within 5 cm of the wall plane in half the in-reach ticks, registered, never built
  [summary: S/ground_physics_and_fp_body.md:221-223].
- Files: game/body.h/.cpp, game/world/world_app.cpp (probe wiring), game/tests/body_tests.cpp [ours].
- Must not break: G3; G1 [ours]. Cost: up to two rays a tick, a few microseconds each, not measured [summary:
  S/scout_player_first_person.md:219]. Tier: check it [ours]. Clip: running diagonally along a wall, first person [ours].

#### L25 FINGERS: the eight finger joints his "New joints" pick asked for (animation seat, C)
- Builds: 8 finger joints in `BodyPose`, the kid's joint map +8 in the same commit, every pose producer sets them, the
  clench ours [summary: S/ground_physics_and_fp_body.md:241-243]. `BodyPose` is a fixed array over a 21-name enum, so this
  is the shared type's one change [summary: S/scout_runtimes.md:415-418].
- Red today: a loose fist at the top of the swing, his pick 173 [summary: S/ground_his_words.md:426-428]; no finger joint
  exists [summary: S/ground_code.md:84-85].
- Must not break: every BodyPose producer's rows; the ragdoll keeps 22 bodies; G1; G3 [summary:
  S/ground_physics_and_fp_body.md:241-243]. Cost: 8 more joints, well under 1 microsecond [inferred]. Tier: prove it
  (a shared type) [ours]. Clip: first person at a sprint, hands at the bottom of the view [ours].
  [2nd reader: no Files line, on the one lap that changes the shared type. At least game/body.h (`BodyPose` and the 21-name
  enum; S/scout_motion_matching.md:156 cites body.h:55-64), game/body.cpp, game/model_rig.{h,cpp} (`gait_pose`, the joint
  names at :121, `Rig::palette`'s aims), game/skeleton.cpp (the ragdoll keeps 22), content/models/kid.joint_map.json, and
  the yardstick if it iterates joints [inferred]. List them before it is put in wave 7 beside L20 (model_rig.*).]

### 2g. Traversal

#### L26 CLIMB-GRIP: the player's climb hands take hold on the ledge itself (chase seat, A)
- Builds: two probes per hand at the climb's start through the sim's read-only ray, in place of the guess "eye + 0.12 m"
  (body.cpp:199-200) [summary: S/scout_traversal.md:358-370]. The inset and the reach timing have no source for a hand and
  are ours [summary: S/scout_traversal.md:229-232, :132-137].
- Files: game/body.h/.cpp, game/world/world_app.cpp, game/session.cpp, game/tests/body_tests.cpp [summary:
  S/scout_traversal.md:363-370].
- Red today, the gym bot's recorded run (seven climbs): each palm within 5 cm of the ledge top, held from the reach to the
  mantle's end, the wrist target and the palm stated apart [summary: S/scout_traversal.md:371-391, holes at :519-522].
  Today the hand sits 0.23-0.43 m off [summary: S/scout_traversal.md:387-391].
- Must not break: `on_a_climb_the_hands_hold_the_ledge_while_the_body_rises`; G3; the app's fingerprint row [summary:
  S/scout_traversal.md:392-395]. Cost: 4 rays at a climb's start [summary: S/scout_traversal.md:353]. Tier: check it
  [summary: S/scout_traversal.md:362]. Clip: the gym's mantles in first person, main | lap [summary:
  S/scout_traversal.md:396-397].

#### L27 LANDING: the hunter lands from a drop with a crouch that springs back (animation seat, C)
- Builds: after L10's Land, a crouch weight on Overgrowth's spring (zeta 0.638), started from the fall speed rather than
  Overgrowth's snap, which item 195's "up down" argues against [summary: S/scout_overgrowth_method.md:170-177]; depth by
  Verniba 2017 to 0.44 m (CC BY, numbers only) and ours above [summary: S/scout_traversal.md:182-188, :277]. The crouch
  must set the legs flag itself; the sink loop does not run on a flat stand [summary: S/scout_overgrowth_method.md:146].
- Red today, the drop case L10 found: the dip deepens with the fall up to the 0.30 m cap, the ankles stay on the probe,
  the knee angle changes, the hips are back within 2% of depth by 0.6 s [summary: second reader,
  S/scout_overgrowth_method.md:333-339]; today no dip [summary: S/scout_overgrowth_method.md:165-168].
- Must not break: L10's rows; G1 [ours]. Cost: about 10 flops a tick [summary: S/scout_overgrowth_method.md:145-146].
  Tier: check it [summary: S/scout_overgrowth_method.md:189]. Clip: the drop's landing: main | snap | spring from the fall
  speed [summary: S/scout_overgrowth_method.md:193-196].

#### L28 LADDERS: hands and feet on virtual rungs; one rung clock for picture and sound (C, then E for the sound)
- Builds: rungs every 0.30 m from the ladder box's bottom, no ray; the hunter's ladder pose from link progress copied into
  `ChaserPose`; the rung tap fired by the grip, not the mixer's 2.2 a second [summary: S/scout_traversal.md:234-235,
  :322-324].
  The limb pairing on a ladder has no source: today's diagonal stays [summary: S/scout_traversal.md:244-247].
- Red today: a grip hand is within 2 cm of a rung in its grip phase; today the hands ride the neck [summary:
  S/scout_ik_and_feet.md:292; S/scout_traversal.md:79-81].
  [2nd reader: whose hands? "ride the neck" is the PLAYER's ladder (body.cpp:393-402, S/scout_ik_and_feet.md:47); the
  hunter on a ladder is drawn standing (section 1d; L10). The lap builds both; the row names one. Split it per body, and
  give the files (body.cpp for the player; model_rig.*, world_app.* `ChaserPose`, figure_pose.cpp for the hunter).]
- Must not break: G1; G3 [ours]. Cost: a few vectors [summary: S/scout_traversal.md:349-355]. Tier: check it [ours].
  Clip: the hunter on a ladder from below [summary: S/scout_traversal.md:412-413].

#### L29 FOUR-LIMBS: `quad_pose` for the crawler, and later the hunter's stalk (animation seat, C)
- Builds: a pure `gait_plan` per limb (duty factor and offset, Spoor's hyena walk) and `quad_pose` on the same 21 joints,
  wrists as fore feet [summary: S/scout_gaits_any_body.md:199-242]. The crouched stride takes the standing hip height, not
  the crouched one [summary: S/scout_gaits_any_body.md:270-275].
- Waits on: a crawler model (L15's path) [ours], and for the stalk the chase's stealth mode, which is not in the chase
  yet [summary: S/scout_states_and_transitions.md:235].
- Red today: in a scripted stalk window on a kept run, each hand within 3 cm of the floor through its stance, hips at 0.70
  +- 0.05 of standing, footfall order hind then same-side fore; today the body is upright [summary:
  S/scout_gaits_any_body.md:377-379].
- Cost: four two-bone reaches, a few microseconds [summary: S/scout_gaits_any_body.md:333-341]. Tier: check it [ours].
  Clip: the stalk at about 1.5 m/s, two footfall settings [summary: S/scout_gaits_any_body.md:385-386].

### 2h. Left out of the path, with the reason

- Runtime motion matching, learned motion matching, clips, a blend graph: no lawful data at the hunter's speeds, and clips
  are out by his pick [summary: S/scout_motion_matching.md:251-266; S/scout_runtimes.md:131-136].
- The hinge-framed elbow: its rule has no source and its row is circular [summary: S/scout_runtimes.md:244-249, :274-283].
- The head's thorax share 0.55 against Pontzer's 0.26: measured at 3.0 m/s only; it is in his call 6, not a lap [summary:
  S/scout_upper_body_and_gaze.md:14-16].
- Style deltas from 100STYLE on lesser kinds: against one clear cue per kind [summary: S/scout_motion_data.md:329-335].
- A per-kind "uncanny" dial in the picture: the capability lives in the sim [summary: S/scout_uncanny_by_physics.md:383-384].

## 3. Which laps run side by side

Seats [inferred from the record: C built the hunter's legs and arms, A the chase's lines, E the physics layer and the
yardstick; S/ground_locomotion_and_yardstick.md:18-27, S/ground_physics_and_fp_body.md:14-17]: animation = C, chase = A,
audio and physics = E.

The order in section 2 is priority; the waves let a free seat take a later lap early when it touches no busy file. The
table is [ours]; each lap's files are those listed in section 2.

| wave | animation seat (C) | chase seat (A) | audio and physics seat (E) | landing pane |
|---|---|---|---|---|
| 0 | L2 on step 0's tip (model_rig.*, model_rig_tests, world_app_tests) | L14 (art/tools), then L4 (chase/*) | L1 (offscreen_models.cpp, world/main.cpp, pose_trace.*, CMakeLists) | step 0 |
| 1 | L3 (model_rig.*, world_app.*, stage.cpp, both test files) | L4 continues; L15 once he picks (content/, art/tools) | L7 (bench file); the L185 re-film with L1's tool | L1, L2 |
| 2 | L5 (world_app.*, stage.*, world_app_tests) | L15 | L8 (motion_checks.*, tools/yardstick/*, CMakeLists) | L185 steps 4-5 (before L5 lands); L3; L4 with its dial off |
| 3 | L6 (stage.*, figures.h, figure_pose.*, body_kinds.h, world_app_tests) | L26 (body.*, world_app.cpp, session.cpp, body_tests) | L13 (audio, sound.cpp) | L5 |
| 4 | L9 (model_rig.*, figure_pose.cpp) | L24 (body.*, world_app.cpp, body_tests), after L26 lands | L12 (ragdoll.*, ragdoll_tests) | L6, L26, L13 |
| 5 | L10, then L11 (model_rig.*, world_app.*, figure_pose.cpp), after L24 lands | the read-only sim accessor for L12's wall half (sim/physics.*) | L12's wall half (stage.cpp, free of C since L6) | L9, L24, L12 |
| 6 | L16, then L17 (body_kinds.h, figure_pose.cpp, world_app.cpp, model_rig.*) | the chase's own work | L28's sound half later (audio) | L10, L11 |
| 7 | L18-L23, L25 (body.*, body_tests; L20 and L25 also model_rig.*) | — | — | as each is ready |
| 8 | L27, L28, L29 (model_rig.*, figure_pose.cpp, body.*) | — | L28's sound half | as each is ready |

- Disjoint by file in waves 0-2: L1 touches no file of L2 or L4 [inferred from the file lists above]; L4 touches only
  chase/ [summary: S/ground_locomotion_and_yardstick.md:127-132]; L14 and L15 touch only art/ and content/ [ours].
- The shared files that force order: game/world/stage.cpp (L3, L5, L6, L12's wall half), game/world/world_app.* (L3,
  L5, L10, L16, L24, L26), game/model_rig.* (step 0, L2, L3, L9, L10, L11, L17, L20, L25, L27) [inferred from the file
  lists].
  L6 moves the per-figure pass into game/figure_pose.cpp so that later C laps stop touching stage.cpp [ours].
- L185 steps 4-5 change the stage line that draws the hunter through the ragdoll [summary:
  S/ground_physics_and_fp_body.md:79]; they land before L5 so L5 rebases on them [ours].
- The player-body laps (body.cpp) are disjoint from the model_rig laps except L20 and L25; with a fourth seat they could
  run beside waves 3-6 [inferred].
- [2nd reader: same-file pairs inside one wave, from the file lists as corrected above. Wave 0: CHANGELOG.md (L1, L2, and
  step 0's landing); game/tests/world_app_tests.cpp (L2, and L4 once it gates the pending row :1095). Wave 1:
  world_app_tests.cpp (L3, L4) for the same reason. Wave 3: CHANGELOG.md (L6, L13: `origin/l192-footsteps` edits it).
  Wave 4: L12's per-tick caller is figure_pose.cpp (C's L9) or world_app.cpp (A's L24). Wave 5: not a file clash but an
  order: E's wall half needs A's accessor in the same wave. CHANGELOG clashes are textual and cheap; the others need an
  order. ~~"L1 touches no file of L2 or L4"~~ holds only for code: L1 and L2 share CHANGELOG.md. L28's sound half is
  placed in wave 6 and again in wave 8; it needs the picture half's grip first, so wave 8 only. Laps L18, L22, L23, L25,
  L27, L28 and L29 give no Files line, so waves 7-8 could not be checked file by file.]

## 4. The reading still owed before a named lap

- Before L4 flips its dial on (his call 4), not before it lands: Usherwood & Wilson 2005 and Wilson 2013 full texts, which
  E named as owed before H2 rests on read figures [summary: S/ground_locomotion_and_yardstick.md:279-280].
- Before L27 sets a depth above 0.44 m: a landing study with knee angles from 1 m or more; only Zhang 2000's abstract (work,
  not angles) and Liu 2026's 80 cm figures exist [summary: S/scout_traversal.md:189-198, :277].
- Before L28 changes the ladder's limb pairing: any ladder-climbing gait study; none was read [summary:
  S/scout_traversal.md:438-440]. As scoped, L28 keeps today's diagonal and owes nothing.
- Before L29: Hildebrand's definition of midtime-lag for the gallop offsets, and a source for the rise to upright with the
  centre of mass ahead of the hips (the lizard source has it behind) [summary: S/scout_gaits_any_body.md:261-269, :306-312].
- Nothing else: L1-L3, L5-L26 as scoped stand on what is read, or are marked ours [ours].

## 5. The owner's calls

1. **Land the stomp fix, with the take-off knee at 15 degrees or 25?** Evidence: 15 is the fitted runner's, 25 the sprint
   studies'; "no measurement the room holds tells them apart" [read: brief:1588]. Default: 15, as built.
2. **How far the torso goes with the bank.** His words: "the torso doesnt orient itseld into the banking of a turn"
   [read: brief:1589]. Evidence: 0.35 is his first game's only source for the share [read: brief:1595]; on one measured bend
   seven sprinters' trunks leaned about 0.89 of their whole-body lean [summary: S/scout_turning_and_transients.md:111-114,
   radius downgraded at :1-6]. Default: the torso goes with the whole-body lean of L3; his eye on L3's four columns decides.
3. **How much grip the hunter has.** His pick: "Grip above human" [read: brief:1231]. Evidence: mu 1.0 leans 45 degrees at
   the limit, 1.33 leans 53; 1.33 is a press figure for a cheetah, and the greyhound abstract implies about 1.31 [summary:
   S/scout_turning_and_transients.md:133-136, :228-232]. Default: 1.33.
4. **Turn the grip law on in the simulation for the hunter?** Evidence: it holds speed round bends where a person brakes,
   his item 168 law [read: brief:1150]; it changes how every run plays, so his kept runs replay to new fingerprints [ours].
   Default: on, after A's grip arms are run and he sees L4's clip.
5. **Which lesser kind gets a body first?** Evidence: the interceptor's cue (T2) is a setting of the head layer and its
   body is upright [summary: S/scout_upper_body_and_gaze.md:216-223]; the pack is three bodies on a cue E thought may read
   ordinary and drops to all fours [summary: S/ground_locomotion_and_yardstick.md:161;
   S/scout_models_and_skeletons.md:375-378];
   the sprinter's model exists but its cue needs a pitch channel nobody sourced [summary:
   S/scout_models_and_skeletons.md:247-251]; the crawler needs four limbs [summary: S/scout_gaits_any_body.md:323-327].
   Default: the interceptor.
   [2nd reader: the room's 08:43 path put the sprinter first, with its model already made (`loop/buildpath_entity_bodies_
   2026-11-13.md:51-55`), and he answered its shape question "Decide kind by kind" (brief:1272) [read]. Show him that
   default beside this one.]
6. **The hunter's head on a straight: riding the trunk's twist (0.55, his first game's) or a measured human share (0.26 at
   3.0 m/s)?** His pick: its head "stays humanlike" [read: brief:1154, the brief's record]. Evidence: Pontzer measured only
   up to 3.0 m/s [summary: S/scout_upper_body_and_gaze.md:14-16]. Default: keep 0.55 until a head clip.
7. **May recorded motion ever ship, or only serve as a yardstick?** His words: "research open source alternatives, not to
   use, but to learn from" [read: brief:1102-1103]. Default: yardstick only.
8. **Which chasers climb?** His pick: "Only crawler and pack" [read: brief:1266]; the code lets the crawler alone climb
   [summary: S/scout_traversal.md:86-89]. Default: his pick; the chase seat's change, not an animation lap.
9. **The player's stride rate at a sprint: the first game's 3.54 steps a second at 10 m/s, or the stride law's 4.39?**
   Evidence: the first game's was set by play; the law is sourced [summary: S/scout_player_first_person.md:273-277].
   Default: keep 3.54; a toggle he plays both ways.
10. **The hunter's stalk (items 205-208): plan the chase side now?** His words: "there should be a stealth mode of
    animation, moving like an alien hyena" [read: brief:1554] and "they should know where it is most of the time" [read:
    brief:1550]. Evidence: no chase stealth mode is planned; the gait rests on one hyena paper and a crouched cat [summary:
    S/scout_gaits_any_body.md:70-114]. Default: after the chase seat plans 205-206.

## 6. What would show the system is not paying

- The registered test: "If the next entity to get a model still needs its own from-scratch laps, the saving did not
  happen. That is read at the first lesser kind that gets a body" [read:
  loop/plan_animation_system_swarm_2026-11-13.md:48-51].
- Read at the first lesser kind (default the interceptor), against L15-L17: the system did NOT pay if that kind needs any
  of: a new pose function; an edit to `gait_pose`, `apply_motion`, `Rig::palette` or the chain beyond its one cue's
  setting; its own clock, state layer or transition code; its own capture tool; or a stage edit beyond a row in the kind
  table [ours].
- Bar, registered now: at most three laps (model, kind row with tiers, one cue), and no game/ file touched outside
  `content/`, `art/tools/`, `game/body_kinds.h` and the cue's own lines [ours]. A fourth lap, or a file outside that set,
  is a miss, said plainly in that lap's hand-back.
  [2nd reader: L16 as written touches game/figure_pose.cpp and game/world/world_app.cpp, outside that set, so the bar
  is missed by the plan itself before any code. Move the tiers into a system lap before L15, or restate the bar.]
- The same test on cost: if L7's bench puts a tier-A lesser body above 25 microseconds of CPU a frame, or L16's tiers cannot
  keep nine bodies' skinning inside about 1.2 ms of p99 room, the system does not pay at its scale [ours; the 25 from the
  count at S/scout_performance_and_determinism.md:240; the room at S/ground_constraints_and_roster.md:31].
- And on the plan's other test: the first three laps must hold something the morning's hand-backs did not; L1's code
  facts, L2's mechanism and L3's comparison are new by their second readers [summary: S/scout_authoring_and_tuning.md:
  409-410; S/scout_models_and_skeletons.md:174-179; S/scout_turning_and_transients.md:422-424].

## What I did not open

- Any outside source: every paper, licence and engine file above is as the scouts and their second readers report it.
- The game's code beyond the lines cited as [read] (stage.cpp:265-270, :283-284; model_rig.cpp:244, :327, :342, :347,
  :509-511; world_app.cpp:532-534, :582; model_rig.h:134-136; figures.h:28; model_rig_tests.cpp:510; skeleton.cpp:75-80;
  world_app_tests.cpp grep lines), and every branch's code; only `git log`, `merge-base` and `diff --stat` were run on them.
- His kept runs' contents: no count of drops, wall stops, overtime or interceptors was made; each lap that needs one counts
  first.
- E's local clone (L185 steps 4-5), every worktree, every clip and capture, `animation-system.workflow.js`.
- The hand-backs and plans the ground files cite, except the swarm plan's lines 40-54; the brief beyond lines 1102-1103,
  1109, 1128, 1150, 1154, 1229-1231, 1266-1276, 1286, 1485, 1514, 1546-1558 and 1585-1615.
- The system file this path pairs with (not in the folder when I wrote).

## Second reader

1. 10 laps and step 0 can start as written; 17 need a change first; 2 are blocked (L15 on his call 5, L29 on a model and
   the chase's stealth mode).
2. The worst finding is L3: rolling by (law - drawn tilt) about the feet leaves the feet-to-pelvis line at law - tilt,
   which fails the lap's own row and chest companion. Roll by the law, or rewrite both bars.
3. L2 removes the pelvis skin's 12.6-degree forward lean on every running frame (the hunter's and the kid's). No row
   guards it.
4. Fourteen laps were already on the room's record by 08:43 today, aim and mechanism both, in five build paths this path
   never cites (`loop/buildpath_*_2026-11-13.md`). Eight more had only their aim there. Seven are new or partly new.
5. The swarm's own falsifier does not fire. The first three laps' aims were on disk, but their mechanisms were not, and
   L1 has a red row on his kept run, by reading.

Second reader, read-only, 2026-11-13. Game code read at dreamzone-3 `main` 31d1c6d and the branches named, with
`git show`, `git diff --stat`, `grep` and `sed`. Nothing was built or run. Short names: EB =
`loop/buildpath_entity_bodies_2026-11-13.md`, PB = `loop/buildpath_player_body_2026-11-13.md`, CE =
`loop/buildpath_chase_entities_2026-11-13.md`, SB = `loop/buildpath_sound_2026-11-13.md`; G- = the ground files in S/.
"Red by reading" means I read the code that makes it red; no row was run. The corrections are in place above, marked
"[2nd reader: ...]".

### The table

| lap | cites checked | files | red by reading | simplest pass without the fix | on record by 08:43 | verdict |
|---|---|---|---|---|---|---|
| 0 | brief:1588, git | 4, OK | n/a | n/a | yes, brief:1588 | START (lands ccc65ab, which no ground file read) |
| L1 | authoring :82-84, :284-309, :409-422 OK | + modes.h | R2, R3: yes (`% 12` of 1/144 s; no manifest) | frustum-only "sees": the follow camera's own two-way ray is the check that bites | aim yes (brief:1601, :1606; G-roster:5); code facts new | START |
| L2 | models :167-188, :323-356 OK | OK | yes, ~7 degrees (same aim and frame as spine_01) | any frame that rolls with the hips; the skinned row's bar has no number | conclusion yes (p-l180-lap2-C:122-123, brief:1596); mechanism new | CHANGE: forward pitch lost; guard or keep it |
| L3 | uncanny :235-273, turning :60-76, :410-450 OK; path's use of :442-444 WRONG | OK | yes (~3 degrees; feet under the pelvis) | splay feet; roll by construction; the band tests the code against itself | aim yes (brief:1597, :1611); 1/5.8 comparison new | CHANGE: composition, capped denominator, mu, LeanFrame joints |
| L4 | G-loco :118-135 OK | + chaser.cpp/.h, speed.cpp, world_app_tests | compile red only | any mu above 1 passes "at least H1's" | yes, wholly (G-loco:133-135; CE:72; H182:8) | CHANGE: cap row, files |
| L5 | perf :48-80, :270-310, :390-413 OK | OK | yes (pause, stall), but not runnable on main | phase held per tick and drawn without alpha (the 1/48 s offsets close it) | partly (G-code:225, :341) | CHANGE: scout's step one first |
| L6 | shipped :262-318, :440-470 OK; brief:1229-1230 OK | OK | yes (0 slots), not runnable on main | pose the Dark frozen or hidden (frustum, place and phase close it) | shape yes (G-code:12, :219; EB:54); the Dark first is new | CHANGE: move (c) first, register red there |
| L7 | G-phys :9, :230, :259 OK | OK (pattern on E's clone only) | row absent | time a stub | yes (G-phys:230; EB:55) | START |
| L8 | eval :137-146, :186-202, :370-392 OK | OK | P3: no, branch only (7b184db) | P1 band narrowed to few contacts | P3's case yes (H205:275); P1-P3 forms new | CHANGE: re-measure P3 on the landed tip |
| L9 | ik :185-218, :295-340, :460-482 OK | OK | yes, reading (no world point kept) | lock ball and freeze knee; G2 cannot see it | hold yes (G-code:67; p-l169-anim-C:222-224); Holden's edges new | CHANGE: G2 through L8 `--trace` |
| L10 | states :58-78, :312-346, :425-445 OK | OK | yes (speed 0 at chaser.cpp:66) | row's Mesh-pose match closes the frozen-stride pass | yes (G-code:63, :341; EB:60) | START |
| L11 | mm :150-172, :210-240, :350-366 OK; chaser.cpp:416-425 OK | OK | yes, reading | speed low-pass or slew limit (companions close) | partly (G-code:65); the wall snap new | CHANGE: order with L9's lock |
| L12 | secondary :176-180, :232-270, :405-424 OK | + per-tick caller | likely; falsifier first | n/a until the caller is named | yes (G-phys:4-5, :228; EB:61) | CHANGE: caller file; collides in wave 4 |
| L13 | perf :51-54 OK; l192 diff OK | OK (sound.cpp reads poses at :160) | two clocks, by reading | n/a | yes, wholly (SB:58) | START (after L5) |
| L14 | roster :92-93 OK; temp folder exists | list short (bakelib.py ...) | row command wrong (`art` lists 5) | copy the seven named; hunter unbakeable | yes, wholly (G-roster:92, :205; EB:52) | CHANGE: whole import set |
| L15 | roster :206, models :228-282 OK | content/, CREDITS | file absent | n/a | yes (EB:58; morning default the sprinter) | BLOCKED: his call 5 |
| L16 | perf :198-221 OK; brief:1274 OK | breaks section 6's bar | posing yes; tiers untested | draw every interceptor full | yes (brief:1274; EB:42, :54) | CHANGE: tier rows gated; bar |
| L17 | upper :106-112, :214-224 OK | OK | yes, reading | head = target every tick | yes (G-loco:156; EB:59; brief:1154) | CHANGE: give the bar and the re-fix row |
| L18 | G-phys :218-219, :244-246 OK; b676860 touches body.* only | OK | rows registered red, unrun | n/a | yes, wholly (PB:75-78) | START |
| L19 | PFP :235-272, :384-391 OK; body.cpp:225-230 OK | OK (spring into Body) | yes, by construction | a spring on the yaw series alone (the palette measure closes it) | yes (PB:80; G-phys:244) | START |
| L20 | G-code :9-10, :70-71 OK | OK | yes, no twist | n/a | yes (model_rig.h:173 "next") | CHANGE: arm_twist against `player_body-4` |
| L21 | G-code :175 OK (body.cpp:338) | needs L3's free function | yes, reading | same as L3 | partly (G-code:175) | CHANGE: follows L3 |
| L22 | ik :40-50 OK | none listed (body.* implied) | yes, turns and stairs unguarded | contact from the lock's own flag (P1 closes it) | partly (G-code:67, :297) | START |
| L23 | PFP :113-117 OK; body.h:74-75 OK | none listed | reading only | n/a | partly (L174 capture measure) | CHANGE: his call missing from section 5 |
| L24 | G-phys :221 OK | OK | row registered, unbuilt | hand pinned to the plane at the one checked frame | yes, wholly (PB:84; G-phys:221) | START |
| L25 | G-phys :241-243 OK; brief:1284 OK | none listed, shared type | compile red | n/a | yes (G-phys:241; brief:1284) | CHANGE: file list first |
| L26 | traversal :355-397, :515-524 OK | OK | yes, 0.23-0.43 m off by reading | per-height table for the gym's three ledges | aim yes (PB:84; G-phys:249) | START |
| L27 | overgrowth :140-196, :330-340 OK; traversal :180-190 OK | none listed | no dip, by reading | cosine pulse (companions close) | partly (EB:60 "recover"); Verniba new | START (after L10) |
| L28 | traversal :242-248, :320-326 OK; G-code:168 | none listed | player's hands, not the hunter's | n/a | partly (EB:60; G-code:168) | CHANGE: one row per body |
| L29 | gaits :258-276, :376-387 OK | none listed | scripted only | n/a | partly (brief:1550, :1554; L187) | BLOCKED: model, stealth, reading owed |

Section 1 against the ground files: what is built agrees (G-code:1-12, G-phys:1-5, G-roster:1-8, :110-117), with four
downgrades. Nothing on main keys the ragdoll. The kept runs are git-ignored, and 20 is not 16. The stomp tip is one
commit past what the ground read. The repository's `l185-skeleton` is step 2. Section 1 also leaves out the five morning
build paths.

### Tally

Claims checked at source: 57.
- OK 30: main's tip; model_rig.h:134-136; model_rig.cpp:244, :327, :510; world_app.cpp:534, :582; stage.cpp:267-269,
  :283; figures.h:28 with archetype.h:17-28; skeleton.cpp:75-80; L2's 7 degrees; the stomp branch's state; four parked
  commits; the l182 dial's default; 20 runs; six landed commits; capture-lean's step; the pause path; `ease_on_` and the
  clip toggle; the Frozen branch; four world_app rows; four model_rig rows; chaser.cpp:416-425; body.cpp:200, :225-230,
  :338; body.h:74-75; the Blender folder; twenty brief lines quoted; l192's files; l188-step2's files.
- WRONG 4: L3's 1.89 and "keeps the tilt rows meaningful"; L8's "main's" toe sink; L14's `git ls-files art`; section 3's
  "L1 touches no file of L2".
- DOWNGRADED 4: the ragdoll "keyed"; the kept runs (not in git, 20 not 16); the stomp tip against the ground's 900e3c4;
  the `l185-skeleton` name.
- INCOMPLETE files 6: L1, L4, L12, L14, L25, L28.
- ROW GAPS 7 (a row that cannot run red as written, or that passes without the fix): L4, L5, L6, L9, L11, L16, L17.
- CONFLICTS with his picks or the record 5: the morning build paths left uncited; L20 against `player_body-4`; L23's call
  missing; call 5 against the morning default and `entity_bodies-1`; section 6's bar against L16.
- New finding 1: L2's lost pitch.

Re-derived from the record by 08:43, by lap:
- Aim and mechanism both, 14: L4, L7, L10, L12, L13, L14, L15, L16, L17, L18, L19, L20, L24, L25.
- Aim only, 8: L1, L2, L3, L5, L6, L9, L11, L26.
- New or partly new, 7: L8, L21, L22, L23, L27, L28, L29.

### Laps a builder can start as written

Step 0, then L1, L7, L10, L13 (after L5), L18, L19, L22, L24, L26, L27 (after L10).

### Laps that need a change first

- L2: keep the pelvis's pitch, or guard it on a straight.
- L3: the composition, the capped denominator, mu, and the posed joints in `LeanFrame`.
- L4: the cap row and the full file list, including the game/ row.
- L5: the scout's step one.
- L6: the move first, and the red registered there.
- L8: P3's red re-measured on the landed tip.
- L9: G2 run through `--trace`.
- L11: the order with L9's lock.
- L12: the per-tick caller named, and the wave 4 clash.
- L14: every local import committed.
- L16: tier rows gated, and section 6's bar.
- L17: a number for the bar.
- L20: the arms against his pick.
- L21: follows L3.
- L23: his call added to section 5.
- L25: a file list.
- L28: one row per body.

Blocked: L15 (his call 5; L14 first) and L29.

### What I did not open (second reader)

- Any outside source, licence or paper: every outside claim stands as the scouts' second readers left it.
- E's local clone, every worktree, the kept runs' contents (no drop, wall-stop, overtime or interceptor count), and every
  clip.
- The hand-backs beyond p-l205-stomp-C:250-280; the morning build paths beyond their lap lines; plan_13h_run.
- Whether anything in the sim reads the eye's position (L23), and whether the yardstick iterates joints by count (L25).
- `00_system.md`, `animation-system.workflow.js`, and each scout's lines beyond the ranges named in the table.

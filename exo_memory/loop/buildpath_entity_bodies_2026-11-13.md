# Build path: entity_bodies (bodies, animation and physics of the hunter and the lesser kinds). 2026-11-13, for a builder who has seen no conversation

Game repo read at main `04f3882` (read only). Marks: [read] opened and read, [code] file:line, [inferred] my reasoning, [ours] a proposal with no source. "[his N]" is an item in `briefs/dreamzone2_the_game.md`. Hand-backs and plans are under `exo_memory/`. I read those reports, not the papers behind them.

## 1. His words
| items | what he asked, short quotes |
|---|---|
| 16, 73 | The older build's entity animation was decent, "you might be able to do it better now"; footsteps "bassy and loud like thundering" (sound is L192). First play: "it just needs more refined animations and quality of style". |
| 82, 83, 85 | "Make the models as detailed as you can go", "multiple passes". Blender headless is allowed: "yep well u have access its on steam". 85 widens to character lore. |
| 129, 131 | Left 4 Dead's infected had "momentum or inertia". Arc Raiders' system: learning only for walking on a physics body, tactics are behaviour trees [his 131, librarian's check]. |
| 146, 151, 152 | The lean is "glitchy back and forth"; "it will turn, and then lean, not lean into the turn"; the animation "needs a hard rework", the player's look-down too. |
| 150, 153, 154, 165 | Learn from open source, "not to use". On L173's own spring chain: "get rid of it". "we need to get them right first". The rule: ideas "have to link to the research". |
| 155, 157 | Picks: the lean is both, tilt first; a sliding hunter faces you; climbs use Overgrowth's grips. "Keep source, fix sway". |
| 156 | The first game's "kinetic linking, making the whole body work as one", "better for all entities and even the player character". |
| 158, 160 | "a physics engine itself that drives the procedural animations"; "mesh both techniques", "if not do 1". |
| 163, 166 | The hunter is "moving too fast for the legs to keep up", "needs to take longer strides, torso and arms need to swing more"; use animal and human locomotion data. |
| 167, 168, 169 | Entities take animal traits "while being humanlike" for the uncanny; "all entities must be humanoid in nature with their own unique uncanniness"; the shapes are the psyche's manifestations. Picks: hunter T1 (greyhound cornering), sprinter T3 (back flex), pack T4 (fixed rhythm), interceptor T2 and stalker T2 (bird head hold), climber and crawler T4, charger T3. |
| 175, 176, 177 | The arms "need to swing with the body more"; his answer "Both"; then "the arms are still not moving good ... you arent using the real reseaech ... too close to the sides". |

Superseded: 153 retires L173's chain and the L177 plan. 157 re-sets the 120°/s lean cap to catch glitches only. 163 withdraws the first game's limb overspeed (plan_l181:41-43; handback/p-l180-lap2:311-330). 168 and 169 settle E's per-kind options. 82 overrides the librarian's reading of 79 that entities are "never seen sharp": chasers are built fully detailed and the render hazes them (handback/p-d659-chasers-E:206-228). 177 overrides 176, whose ours-marked numbers were not enough. Item 164 (wall scrapes) is chase_entities'.

## 2. What exists today
- [code] Only the hunter and the kid have models: `content/models/hunter.glb`, `kid.glb`, `kid.joint_map.json` (LFS by `.gitattributes`). `stage.cpp:627` loads `hunter` only, `stage.cpp:266-280` poses it from `gait_pose`, `stage.h:141` holds one `hunter_` figure.
- [code] The lesser kinds draw boxes: `figures.h:31` slots {hunter 1, sprinter 6, interceptor 6, pack 9, charger 0, stalker 0, crawler 2}. Their poses carry lean, look and chain fields (`world_app.h:79-93`); the boxes ignore them.
- [read] A made `sprinter.glb` (105,788 triangles, 15.3 MB, handback/p-d659-blender-A:851-860). It sits in A's scratchpad on D, not in the repo. A went on to D664 (A:872), so no interceptor, pack or charger model is recorded [inferred]; E sheeted five kinds, none for the stalker or crawler. The Blender scripts are untracked too: `art/tools/` holds only `textures.py` [code].
- [code] The rig: `gait_pose` `model_rig.cpp:680` (upright stand-in walk and run, trunk lean `0.22*run`); `chain_pose` :601 and `kinetic_chain` :620 (hips, trunk and head shares; pelvis 6.5° and thorax 14.3° counter-twist from measured runners); `stride_step` :661 (Alexander's law); `arm_swing_range` :649 (Bruening 2020 fit); `DrawnChaser` `model_rig.h:247` (Overgrowth tilt, Valve yaw and head, chain springs). Still ours: `kElbowMean` 90°, `kArmAbduction` 15°, `kHandToMidline` 25°, `kArmTwistShare` 1.5.
- [code] No climb, ladder, drop or recover pose: `chase/chaser.h:59-67` names the gaits, `:93-94` holds the link data, and `ChaserPose` carries only the gait.
- [code] Tests: `game/tests/model_rig_tests.cpp` (limb lengths :194, chain :611-686, stride :718, arms :862-922) and lean rows in `world_app_tests.cpp:1028-1184`.
- Branches not landed: `l185-skeleton` b226b95 (rotation skeleton, spine joint, hard-keyed hunter ragdoll in Jolt, picture only; six mutants owed); `l188-fpbody` b963780 (player feet, unrun); `l192-footsteps` b61ce52 (red registered). `l191-arm-shape` is merged in main.
- [read] Cost: kid plus hunter added 0.39 ms average and 1.92 ms p99 against the 2.78 ms budget, about 0.45 ms left at the worst frame (handback/p-d663-loader-C:116-141). The hunter is 138,048 triangles (A:706).

## 3. What the room already knows
- Tilt from acceleration, and eased facing and head, are in (Overgrowth `aschar.as:7921-7940`; Valve `NextBotPlayerBody.cpp:296-315`). Valve's slide needs velocity apart from heading (handback/p-l179-valve-anim:72-100); `slip_rate` exists, off by default (`chase/chaser.h:44`).
- Stride: the step was fixed, so legs could not keep up; it is now Alexander's law. Weyand 2000 and Alexander and Jayes 1983 were unreadable (`model_rig.h` stride comment).
- Arms: one source for the swing range (Bruening 2020) and one for the elbow's timing (Gravestock 2021). Nothing readable gives the stand-off, mean bend or hand path; Hinrichs 1987 and Yegian 2019 were unreachable (handback/p-l191-arm-shape:21-49). The hunter runs near F 3.4, far past the data.
- Uncanny: a clear mismatch between a human body and its motion is the supported cue; a uniform "a bit off" gait is not; no source tests animal motion on a human body; eeriness has no instrument, so his eye is the bar (handback/p-l187-animal-locomotion-E:118-147; plan_l187:45). A big-cat stalk has no source (:149-160).
- Physics: the sources agree it pays for reactions; physics-balanced running is research only; Jolt is MIT and built deterministic; the ragdoll stays picture only (handback/p-l183-physics-anim-E:35-88; plan_l185:6-34).
- Crowds: vary stride, swing and tilt per body (Valve `NextBotBodyInterface.h:73`; Days Gone by press) (handback/p-l179-talks-C:58-71).
- Unresearched: rigging a flat or four-limbed humanoid; LOD for several skinned bodies (Assassin's Creed Unity's talk was unreadable); the lesser kinds' non-run moves.
## 4. Contradictions and calls that are his
1. **Is the sprinter humanoid enough?** [his 168] says every entity is humanoid. Its sheet has back-jointed plaster paws and a flat trunk, and the pack's flankers drop to all fours (handback/p-d659-chasers-E:72-153). (a) Keep as sheeted: no cost, a looser reading of 168. (b) Put it on human legs with back flex as its one trait: one more Blender pass. (c) Decide per kind.
2. **"As detailed as you can go" [his 82] against 2.78 ms.** Six sprinters at 105k triangles cannot all be skinned. (a) The nearest two or three skinned at full detail, the rest a lite or rigid-segment copy (E's own suggestion, handback/p-d659-models-E:10-85): LOD pops. (b) Lite models everywhere: less detail. (c) Wait for D's timing: a slower start.
3. **Clips or procedure for the lesser kinds.** E's sheet plans CC0 Quaternius clips retargeted (handback/p-d659-chasers-E:181-197); L180 left clips out by his pick (plan_l180:66); queue step 6 says procedural. (a) Procedural only, climbs included: one style, more code. (b) A few CC0 clips for the wind-up and the climb: a retarget pass and a licence read (E saw only search summaries).
4. **A face at the catch?** "No face, ever" is E's rule, marked invented, not his. He asked for a brutal jumpscare [his 16] and a death reveal [his 30]. (a) The void seam only, opened across the body (E's design). (b) A face shown only at the catch. (c) No face; loud sound only.
5. **The ours-marked arm numbers.** (a) Keep them and let L193's table correct them where recorded data reaches (about 4.5 m/s). (b) He picks from three side-by-side stills. Past that speed his eye is the only bar.
6. **Lore for each kind** is an open gap (`briefs/dreamzone3_design.md:154`). E's sheets are marked invented. Lore is his or story_lore's.

## 5. The build path
**In flight, do not repeat:** C's L180 lap 2 rest (feet with memory, per-chaser stride variation, stumbles); E's L185 landing and L193 yardstick; B's L188; A's L182 (the hunter's T1 is its turning law). Plan: `loop/plan_13h_run_2026-11-13.md`.

**Lap 1: the sprinter, drawn as its own model** (he sees a long, low, chalk-grey runner coming at him).
- Step 0 (D, no code): land `sprinter.glb` with its CREDITS rows (A:304-322) and track the Blender scripts under `art/tools/`. Test: a model row reads 5 meshes, 68,816 vertices, 105,788 triangles; with no file it prints NOT RUN, as the kid's row does.
- Step 1: a `GaitProfile` per kind in `game/model_rig.h` and `.cpp` (trunk pitch, arms trailing, hip height from its own rest). Red on 04f3882 in `model_rig_tests.cpp`: `a_sprinters_posed_body_is_as_high_and_as_long_as_its_sheet` (about 1.35 m by 2.2 m, 5% bar [ours]; the stand-in would stand it 2.275 m tall [inferred]); the limb-length row at :194 runs per profile.
- Step 2: `stage.h`, `stage.cpp`, `figures.h`: one model figure per kind with a slot pool; a kind's box is put away while its model is out, as at `stage.cpp:294-297`; at most K bodies skinned (K is call 2). Red in `dz-world --selftest`: `a_kind_with_a_model_leaves_no_box_drawn`, `no_more_than_K_bodies_are_skinned`.
- Step 3: `game/world/offscreen_models.cpp` captures the sprinter at 4 m and 10 m, brightened as L180 does. A timed run on D, one hunter and N sprinters: every frame inside 2.78 ms (no timing on L).

**Then, in order:**
2. **Interceptor, pack, stalker and crawler bodies, and the cost rule.** A builds the models on D from E's sheets (E sheets the stalker and crawler first). The pack is three instances of one mesh with ±5% albedo (E:128-153). Files: `art/tools/`, `content/models/`, `stage.cpp`. Red: a triangle-budget row per kind; timed on D.
3. **One uncanny trait per kind** as overlays on the chain, each registered against its source, his eye last. T2 head hold: the head's world yaw holds while the body turns, then thrusts (Ortega 2009). T4 fixed rhythm: stride rate near constant at 4, 8 and 12 m/s while step length grows (Full and Tu 1991). T3 spine flex: peak flexion in the last third of the swing (Schilling and Hackert 2006); it needs a flex joint, built on `l185-skeleton`'s spine joint in `skeleton.h` or a new `Joint` in `game/body.h`. Files: `model_rig.h` and `.cpp` (`ChainPose` grows head-hold and spine-flex fields), tests beside the chain rows.
4. **Link and tell poses.** `ChaserPose` carries link start, end and progress. Climbs and ladders by Overgrowth's grips (plan_l180:57-65 for the player), recover and stumble gestures, the charger's wind-up drop, the interceptor's set pose, the pack's all-heads turn. Then the slide facing you (plan_l180:49-56) once A's default separates velocity from heading. Red: hand on the ledge within 2 cm [ours]; no foot moves over 0.1 m in a frame (plan_l180:41-47).
5. **Physics.** Land `l185-skeleton` after its six mutants, then plan_l185 steps 3-5: foot placement in the target, per-bone strength, one reaction (the catch, a wall). Tests: replays byte-identical and nothing written back; timed on D before more than the hunter and the player have a ragdoll.

L193's table is every lap's acceptance, then his eye.

## 6. Connections
- **Needs:** chase_entities (the kit's tells and per-kind counts; `slip_rate`; the L182 turn law; link data in the pose), tech_foundation (frame cost, LFS, the landing train, timing only on D), look_fear (haze and the dream dial decide how sharply a body is seen; the seam material and ray groups), story_lore (what each shape is), movement and player_body (the same `kinetic_chain`, `stride_step`, arm law and yardstick).
- **Gives:** sound (footfalls from the drawn step phase, L192), chase_entities (a visible tell for each signature), run_frame (a body for the catch reveal and the overtime hunter), stress (an arousal-to-gait map is [ours]), player_body (one tested chain and arm law).

## 7. Where it is going
- The evil god's and the good god's bodies, good entities (tank, trinket giver) and the mother's mimic: a human body with one wrong motion, the sources' best cue.
- Learned locomotion as Embark did it: DeepMimic needed days of training per skill (handback/p-l183-physics-anim-E:35-47), so late.
- Cloth and hair motion; more playable kids sharing the chain.

## 8. Not verified
- Nothing was built or run. Every test above is a registration, not a seen red or green.
- I opened no primary paper: Bruening, Ortega, Full and Tu, Schilling and Hackert, Valve and Overgrowth lines come through the panes' reports.
- I did not open `sprinter.glb` (it is on D); its sizes are A's. That no interceptor, pack or charger model exists is [inferred] from the repo and A's report.
- Branch contents beyond `skeleton.h` and the logs were not read.- The 5% and 2 cm bars, K and the arousal map are [ours]. No outside research was done.
- Items skipped: none; 85 and 164 are only referenced.

## Verification (second reader, 2026-11-13)
Game repo read at main 04f3882 (checked with git log -1). Items are hard-wrapped in the brief, so quotes were matched after joining each item's lines.
- (a) [his N] quotes, items 16, 73, 82, 85, 129, 146, 150, 151, 152, 153, 154, 155, 156, 157, 158, 160, 163, 165, 167, 168, 169, 175, 176, 177: ok, each phrase found verbatim under that item in briefs/dreamzone2_the_game.md.
- (a) Row "82, 83, 85": "multiple passes" is in item 82, not 83 (83 holds "yep well u have access its on steam"); fine as a grouped row, but it is not 83's wording.
- (a) Item 131 "learning only for walking on a physics body, tactics are behaviour trees": item 131 says RL "only for the locomotion", tactics "behaviour trees"; the words are the librarian's check, as the doc marks. ok.
- (a) Item 129 "momentum or inertia": ok (item 129, wrapped across lines).
- (b) [code] stage.cpp:627 (take("hunter"...)), stage.cpp:266-280 (hunter posed by gait_pose), stage.cpp:294-297 (away palette), stage.h:141 (kid_, hunter_): ok; the files are under game/world/ (cited without the directory).
- (b) model_rig.cpp:601 chain_pose, :620 kinetic_chain, :649 arm_swing_range, :661 stride_step, :680 gait_pose, model_rig.h:247 DrawnChaser, model_rig.cpp:689 `0.22f * run`: ok.
- (b) chase/chaser.h:44 slip_rate (default 0, off), :59-66 Gait enum (doc says 59-67), :93 link_from/link_to: ok. world_app.h:79-93 ChaserPose with lean/pitch/follow and no link fields: ok.
- (b) figures.h:31 for the slots: WRONG line. The array `kFigureSlots = {1, 6, 6, 9, 0, 0, 2}` is at game/world/figures.h:28 (line 31 is `figure_material`). The values and the kind order (Hunter, Sprinter, Interceptor, Pack, Charger, Stalker, Crawler, chase/archetype.h:17-25) are right.
- (b) model_rig_tests.cpp:194, :611-686, :718, :862-922 and world_app_tests.cpp:1028-1184: ok (tests exist at those lines). art/tools holds only textures.py; content/models holds hunter.glb, kid.glb, kid.joint_map.json; .gitattributes LFS rule for content/models/*.glb: ok.
- (b) Branch rows: l185-skeleton b226b95 with game/skeleton.h, l188-fpbody (local b963780; origin has 3592a07), l192-footsteps b61ce52, l191-arm-shape eb9dcbb contained in main: ok.
- (c) No outside source is marked [read] by this document; it relays hand-backs. Checked those: handback p-d659-blender-A:857 (5 meshes, 68,816 vertices, 105,788 triangles, 15.3 MB): ok. Hunter 138,048 triangles is at A:712, not A:706 (706 is the heading): WRONG line. "A went on to D664 (A:872)": A:872 says "Next: D664" as queued, not that A did it: wording overstated.
- (c) p-d663-loader-C:116-141: +0.39 ms average ok; "1.92 ms p99" is the absolute p99 (1.922), the p99 added is +0.48 ms: wording WRONG (it reads as an added 1.92). Budget 2.78 ms and about 0.45 ms left at the worst frame: ok.
- (c) Jolt MIT (p-l183-physics-anim-E:18, "MIT, (c) 2021 Jorrit Rouwe"), Jolt deterministic build, DeepMimic "days per skill" (E:39 area): ok. Quaternius CC0 (p-d659-models-E:133, quoted "CC0 License"): ok. Overgrowth aschar.as:7921-7940 and Valve NextBotPlayerBody.cpp:296-315 appear in p-l179-talks-C:43 and p-l180-lap1-C:19: ok.
- (c) "Hinrichs 1987 and Yegian 2019 were unreachable": p-l191-arm-shape lists Hinrichs as unreachable but Yegian 2019 as "abstract only; full text behind a Cloudflare check". WRONG for Yegian (abstract read, full text not).
- (c) Plan and hand-back lines: plan_l181:41-43 and p-l180-lap2:311-330 (overspeed question and its withdrawal), plan_l180:57-65 (climb by grips), :41-56 (feet, slide), :66 ("Clips, by his pick"), p-d659-chasers-E:206-228 (correction under item 82), E:181-197 (Quaternius clips), E:150 (+-5% albedo), E:146 (flankers drop to all fours), E:11 ("Invented throughout"), briefs/dreamzone3_design.md:154 (lore GAP), p-l187:118-147 (uncanny sources): ok.
- (c) "E saw only search summaries" for the Quaternius licence: could not check as stated; E:133 quotes the licence line from the page and E's NOT verified list (E:198-205) does not say this.
- (c) "no interceptor, pack or charger model is recorded": consistent with the repo (only hunter, kid) and A's report; A's final line is the only evidence, so it stays [inferred] as marked: ok.
- (d) Nothing marked [read] is from memory: every [read] points to a hand-back path and line; the doc says it opened no primary paper. ok.
- (e) Coverage of 16, 73, 82, 83, 85, 129, 131, 146, 150-158, 160, 163-169, 175-177: all addressed in section 1 (164 only referenced to chase_entities, as the doc says); "Items skipped: none" ok. Item 166 and 165 sit in the grouped rows 150/153/154/165 and 163/166: ok.
- Not checked: step tests are registrations (test names do not exist yet); plan_13h_run file exists; sprinter.glb not opened (on D).
Totals: checked 52, ok 45, WRONG 5 (figures.h line, A:706 line, "1.92 p99" wording, Yegian "unreachable", A:872 "went on"), could not check 1, minor grouping note 1.

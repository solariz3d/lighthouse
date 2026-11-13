# Scout: models and skeletons for the other kinds (animation system swarm, 2026-11-13)

1. One base serves every kind: MPFB's CC0 human, whose joints are placed from the morphed mesh, so a kind is a set of
   macro and length targets plus the room's own stretch; the runtime reads only the bones, and the stride law does the rest.
2. The pelvis "weighted to the wrong share" is a retarget fault, not a weight fault: the Rig swings the pelvis bone onto the
   trunk's line, so 5,123 hunter vertices bank at the trunk's 0.35 instead of the hips' 1.0; skeleton.cpp already does it right.
3. No new bones are needed for his picked traits: ~~framing the pelvis by its hips gives the spine a bend point, and framing the
   head by Head-to-Eye lets a neck hold the head still~~ [2nd reader: UNSUPPORTED for the sagittal flex T3 asks for, and for
   the head hold: see the notes at 3d. Roll and twist yes; pitch and an independent head, no, without a new pose channel].
   Fingers exist in the rig and are simply not driven [2nd reader: RE-DERIVED, ground_constraints_and_roster.md:78-80 ("the
   clavicles and fingers are not driven") and ground_code.md:82-83].
4. New checks, measured: MPFB's own weights reach 7 influences on 981 vertices and the exporter ~~silently~~ keeps the top 4 [2nd reader: DOWNGRADED. The 981 is a count in MPFB's own weights file (re-counted: 19,158 vertices, 962 + 15 + 4 above four), not in the hunter's meshes; how many hunter vertices lost weight is unmeasured (the scout says so at 2b). The exporter is not silent: it logs a warning once, primitive_attributes.py:90-97]; the
   unlanded sprinter stands 0.131 m through the floor at rest; the hunter's shoes are 38% of its vertices for 18% of its tris.
5. First lap: the pelvis bone framed by its hips' line (prove it); red today at about 7 of 20 degrees, green at 20 +-1.

Marks: [read] opened and seen; [summary] from a secondary account or another swarm file; [inferred] mine; [ours] a proposal.
Game code is dreamzone-3 `main` 31d1c6d unless a branch is named. Ground files are in this folder and cited by name:line.
Record paths are relative to `C:/Users/nname/Desktop/lighthouse/exo_memory`. Outside pages fetched with curl on 2026-11-13.

## 1. What the room already has for this aspect

- Two skinned models on main, both on MPFB's 53-bone `game_engine` rig (the kid adds `eye`), no clips, no LOD
  [summary] ground_constraints_and_roster.md:58-66, :214.
- The loader takes four influences a vertex and refuses a second JOINTS set [summary] ground_constraints_and_roster.md:67;
  it refuses negative weights, an index past the skin and a zero sum, then renormalises [read] model/model.cpp:332-341.
- The game drives 18 of the 53 bones; pelvis, spine_01 and spine_02 share ONE aim (Pelvis to Chest); fingers, clavicles,
  balls ride their parents [summary] ground_code.md:73-93; [read] game/model_rig.cpp:244, :353-358.
- Any model on this rig can be posed today, and `gait_pose` scales stride and arm swing from the model's own rest joints, so
  a second humanoid kind runs on it unchanged [summary] ground_code.md:187-199, :210-226.
- How the two bodies were made (MPFB macros, eight targets for the hunter, `kidlib.stretch` along bones, 2.150 m)
  [summary] ground_constraints_and_roster.md:84-96. E's five chaser sheets (shape, motion reads, role numbers)
  [read] handback/p-d659-chasers-E_2026-11-11.md:41-179, with its correction to "as detailed as the kid" :206-228.
- Licences the seats read: MakeHuman core assets CC0, MPFB code GPL [summary] ground_constraints_and_roster.md:98-105.
- The bank shares 1.0 / 0.35 / -0.30 and C's note that the pelvis mesh banks at 0.35, "Unchecked by eye"
  [read] handback/p-l180-lap2-C_2026-11-12.md:122-123; the librarian's ruling to check it by eye [read] brief:1598.
- The traits he picked, one per kind (hunter T1 only; sprinter and charger T3; interceptor and stalker T2; pack and crawler
  T4) [summary] ground_his_words.md:413-418; T3 filed as "needs a spine joint the body lacks" [read] brief:1154.
- Fingers: 8 finger joints proposed, unbuilt; his "New joints" pick [summary] ground_physics_and_fp_body.md:241-243;
  ground_his_words.md:584-587.
- GPU cost of the two models: +0.39 ms average, +0.48 ms p99 for about 266k skinned vertices; room left about 1.2 ms p99
  [summary] ground_constraints_and_roster.md:24-31. No CPU cost was ever measured [summary] ground_code.md:228-241.
- Thin in the ground files, so read here: the pipeline scripts. They are NOT in the game repo [summary]
  ground_constraints_and_roster.md:92-93, and they still exist only in a temporary folder:
  `C:/Users/nname/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d659/`
  holds `kidlib.py`, `fit.py`, `rig.py`, `hunter.py`, `hunter_bake.py`, `sprinter*.py`, `glbcheck.py` and `out/*.glb`
  [read: ls]. A cleared temp folder loses the only way to regenerate the bodies [inferred].

## 2. What I read at source that is NEW

### 2a. MPFB / MakeHuman: licence, rig structure, how proportions vary

- Licence page: "All core assets are shared under Creative Commons, CC0 ... You do not need to pay anything, include any
  copyright notices nor give attribution." [read] https://static.makehumancommunity.org/about/license.html, "The asset license".
- MPFB's `LICENSE.md` (master 9de0707, 2026-11-12) [read]: assets = "The base mesh and proxies", "Targets and modifiers",
  "Rigs, poses and expressions", released "under CC0 1.0 Universal" (lines 52-62); on output: "As the assets have been
  released under CC0, there is no limitation on what you can do with this combined output" (lines 76-77), listing "Exports to
  files" (line 82). URL: https://github.com/makehumancommunity/mpfb2/blob/master/LICENSE.md. `LICENSE.ASSETS.md` is the CC0 1.0
  legal code, waiver "for any purpose whatsoever, including without limitation commercial" (its line 29) [read].
  - USE (the base mesh, rig, weights, targets as baked into our GLBs): commercial use allowed; no attribution; no share-alike;
    redistribution allowed [read, the two texts above]. Third-party MPFB packs vary [summary] p-d659-models-E:132.
    [2nd reader: OK, re-read at the three URLs. Two edges the scout leaves out. LICENSE.md:72 calls the output statement "the
    opinion of the MakeHuman team", so line 76-77 is their stated position, not a licence term; the grant is the CC0 text on the
    assets. CC0 4(a) leaves patents and trademarks unwaived and 4(c) disclaims clearing anyone else's rights (LICENSE.ASSETS.md:35,
    :39). Whether the hunter's clothes and hair are bundled MPFB assets or made here is not read; only bundled ones are covered.]
  - MPFB's code is GPLv3 (LICENSE.md lines 26-29) [read]. Our Blender scripts import it. They are tools, not shipped. If the
    tools folder were ever published, those scripts would sit under the GPL's terms [inferred; not legal advice].
- The `game_engine` rig file, `src/mpfb/data/rigs/standard/rig.game_engine.json` [read]: 53 bones; Root - pelvis -
  spine_01 - spine_02 - spine_03 - neck_01 - head; clavicle_l/r off spine_03; 15 finger bones a hand; ball_l/r under the feet.
  No twist bones, no face bones. The `default` rig has 163 bones with spine01-05 and neck01-03 [read: a count of
  rig.default.json]. Variants listed: cmu_mb, mixamo, mixamo_unity, openpose, game_engine_with_breast [read: GitHub API listing].
- Joints follow the shape: each bone end has a strategy "CUBE" (a named joint helper of the base mesh), "MEAN" of listed
  vertices, or "VERTEX" [read] rig.game_engine.json ("pelvis": head "joint-pelvis", tail "joint-spine-4");
  `src/mpfb/entities/rig.py:295-305` reads the location from `position_info["cubes"]` or the mean of the vertices [read].
  So a length target moves the joints with the mesh, and the rig refits itself [inferred from those lines].
- Length targets that exist [read] `src/mpfb/data/targets/target.json`: arms `measure-upperarm-length`,
  `measure-lowerarm-length`; legs `measure-upperleg-height`, `measure-lowerleg-height`, `upperlegs-height`, `lowerlegs-height`;
  torso `measure-napetowaist-dist`, `measure-waisttohip-dist`, `torso-scale-vert`; neck `measure-neck-height`; hands
  `hand-fingers-length`; feet `foot-scale-*`. Each is a decr/incr pair (~~1508~~ target files in the tree [read: count]) [2nd reader: WRONG. At master 9de0707 the GitHub tree
  API lists 1,258 `.target.gz` files under src/mpfb/data/targets (1,477 blobs there counting preview images). I cannot get 1508].
- MPFB's own weights, `weights.game_engine.json` [read]: `"license": "CC0"`, 19,158 vertices weighted, every sum within 0.01 of
  1, and influences per vertex {1: 9369, 2: 5586, 3: 1941, 4: 1281, 5: 962, 6: 15, 7: 4} [read: my count]. So 981 base
  vertices carry more than four.

### 2b. Weights: what the format asks, what the exporter does, what Blender can do by script

- glTF 2.0, 3.7.3.3 Skinned Mesh Attributes [read] https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html: "The joint
  weights for each vertex MUST NOT be negative." "Joints MUST NOT contain more than one non-zero weight for a given vertex."
  For floats the sum "SHOULD be as close as reasonably possible to 1.0". Spec text CC-BY-4.0 (SPDX line in the page): idea only.
  Our loader checks the first, not the second [read] model/model.cpp:332-338.
- The Blender glTF exporter (Khronos glTF-Blender-IO, `main` 9a35580, add-on 5.4.12; Apache-2.0 per its LICENSE.txt head)
  [read]: `export_influence_nb` "Bone Influences", default 4 (`addons/io_scene_gltf2/__init__.py:981-986`); past it, "The {}
  with highest weight will be used (and normalized)", a log warning shown once
  (`blender/exp/primitive_attributes.py:90-97`); a vertex with no group goes to a neutral joint
  (`blender/exp/primitive_extract.py:1672-1675`). Learn from only; it ships with Blender, not with us.
- The room's export call takes that default: `hunter_bake.py:117-118` (in the temp folder above) passes no influence option
  [read]. So the cut to four happened, unmeasured [inferred]. In the shipped files 19,104 hunter and 32,106 kid vertices
  have exactly four non-zero weights; none has zero; max |sum - 1| 1.3e-7 [read: my count of the GLBs, script below].
- Blender's Python API, "current" docs [read] https://docs.blender.org/api/current/bpy.ops.object.html:
  `vertex_group_limit_total(limit=4)` "removing lowest weights"; `vertex_group_normalize_all` "the sum of all weights is 1.0";
  `vertex_group_clean(limit, keep_single)`; `data_transfer(data_type='VGROUP_WEIGHTS', ...)`. Learn from; Blender is a tool.
- Decimate modifier, Collapse: "Merges vertices together progressively"; Ratio; Symmetry; a Vertex Group to steer it
  [read] https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/decimate.html (5.3 manual). The page does not say
  what happens to deform weights; that is a check, not an assumption.
- meshoptimizer (MIT, licence read whole: "The above copyright notice and this permission notice shall be included in all
  copies or substantial portions") [read] https://github.com/zeux/meshoptimizer/blob/master/LICENSE.md. `meshopt_simplify`
  "generates a second index buffer that uses existing vertices", so weights ride along unchanged; the returned error can set
  the viewing distance (README, "Basic simplification") [read]. gltfpack merges meshes and quantises by default unless `-kn`,
  `-noq` (gltf/README.md:17, :61, :95) [read]. NOT proposed now (section 6); if ever used: commercial yes, keep the notice,
  no share-alike, redistribution allowed.

### 2c. What is published on proportions and gait

- Swinnen, Hoogkamer, De Groote, Vanwanseele 2026, "Body anthropometry affects spatiotemporal preferences in walking and
  running", J Exp Biol 229, jeb252161, CC BY 4.0 [read] Europe PMC PMC13245910, full text. 103 trained runners, running
  2-4.17 m/s. ~~Froude number alone explains most variance~~ [2nd reader: DOWNGRADED. Abstract: Froude alone gives R2 0.71-0.92 in
  walking but 0.01-0.94 in running, so "most" holds for some variables only. Running was 2-4.17 m/s, a jog; the game's chasers
  run 7-12 m/s, so every use below is an extrapolation the scout does not flag. Stride frequency there is DIMENSIONLESS
  (divided by leg length and g), so "greater relative leg length gave higher stride frequency" is not a claim about steps a
  second, and its sign is the opposite of what 3c's "legs +20%, fewer steps" row shows]; "In running, individuals with greater relative leg length exhibited
  higher stride frequencies (P = 0.039)" (Results, Stride frequency); "heavier individuals and those with larger relative foot
  lengths exhibited longer stance times and higher duty factors"; "greater relative foot-shoe mass reduced stride frequency
  via longer leg swing times" (Abstract). Relative leg length (trochanter height / height) 0.515 +- 0.011, range 0.492-0.543
  (Table 1). Use: the idea and the numbers as constants, with attribution if quoted; no data shipped.
- Its introduction, as a secondary account: birds "with long legs relative to their mass tend to adopt longer strides as a
  result of longer leg swing times" (Daley & Birn-Jeffery 2018) [summary].
- Wang et al. 2026, Sci Adv, "Unlocking fast robotic locomotor propulsion through dynamic spine-leg synergy", CC BY-NC 4.0:
  idea only [read] PMC13614408, introduction: "The spine reaches its flexion and extension limits just before the hind legs
  make contact with the ground and immediately after they lift off"; "small cursorial mammals exhibit exceptionally
  pronounced sagittal spinal flexion-extension (up to 120 deg) compared to larger mammals". Both are the paper's citations of
  others [summary of those]. For a 2 m body this argues for a small flex, timed to the hind foot [inferred].
- Absent: no source read that ties TRUNK length alone to human gait. The trunk enters only through relative leg length.

### 2d. Measured here, on the models (read-only node scripts over the GLB JSON and buffers)

Scripts: `C:/Users/nname/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/models_tools/`
`glbjoints.js` (rest joints from node TRS), `glbweights.js` (per bone), `glbmesh.js` (per mesh). Each reads under a second.

| body (file) | mesh top m | thigh head y | thigh / shin / foot m | upper / fore arm m | pelvis-neck m | thigh y / top |
|---|---|---|---|---|---|---|
| kid (content/models, main) | 1.803 | 0.978 | 0.460 / 0.450 / 0.151 | 0.300 / 0.270 | 0.538 | 0.543 |
| hunter (content/models, main) | 2.224 (hood) | 1.206 | 0.621 / 0.501 / 0.179 | 0.490 / 0.461 | 0.679 | 0.542 |
| sprinter (temp `out/`, unlanded) | 2.510 | 1.146 | 0.595 / 0.515 / 0.339 | 0.405 / 0.381 | 1.012 | 0.434 |

[read: my measures]. Landmarks differ from Swinnen's (hip joint vs trochanter, mesh top vs height), so compare shapes, not
decimals [inferred]. What they say: the kid and the hunter share one relative leg length [2nd reader: DOWNGRADED. The 0.542 uses
the hood's mesh top, 2.224 m; at the 2.150 m stature the room built to (p-d659-blender-A_2026-11-11.md:599) it is 0.561 against
the kid's 0.543. The table's own caution about landmarks applies to this sentence]; the hunter's difference is arm
length (arm/leg 0.85 against the kid's 0.63); the sprinter as built is a LONG TRUNK (1.012 m) on hunter-like legs, ~~not E's
"long, back-jointed legs" (p-d659-chasers-E:81-84)~~ [inferred from the table] [2nd reader: WRONG on the legs, RE-DERIVED on the
trunk. The builder's own hand-back says "longer legs (40 % of their maximum)", "the trunk and neck as long as MPFB goes" and
"the feet stretched x2.1 into long paws it runs on the balls of. The 'knee seen backward' is the ankle"
(p-d659-blender-A_2026-11-11.md:742-743, :749). The scout's own table shows that back joint: foot 0.339 m against the hunter's
0.179 m. So the build matches E's "back-jointed" and the trunk length was stated, not found. Stature there is 2.275 m, not the
2.510 m mesh top used for the 0.434]. Its lowest vertex is y = -0.131 and its ball
joints y = -0.109 at rest: it stands through the floor in its rest pose [read] [2nd reader: measured true (re-run); DOWNGRADED as
a fault, since a model built to stand on its balls (A:749) has a rest pose that is not a standing pose. Check 5 would need to
run on the posed stand-in gait, not on the rest pose, or it fails a body that is right].

Skin, per bone, vertices whose largest weight is that bone [read: my count]:
- hunter: pelvis 5,123 (y 1.072-1.319, the hips at 1.206), spine_01 2,096, spine_02 2,404, spine_03 10,942, thigh_l 5,594,
  thigh_r 5,398. kid: pelvis 5,723 (y 0.797-1.065), spine_01 3,686, spine_02 4,437.
- Per mesh, hunter: shoes 48,812 vertices for 24,604 triangles (38% of 127,116 vertices; 18% of triangles), hoodie 38,568,
  pants 16,082, hood 11,741, the covered body 11,520, seam 393. Kid: hair 35,316, hoodie 33,026, and a 24-vertex mesh
  named "Cube" on spine_03 [read]. Shoes at about two vertices a triangle look unwelded [inferred, unchecked].
- No vertex in either model lists one joint twice [read: my count].

### 2e. The fault under "the pelvis weighted to the wrong share"

- The pelvis bone is aimed Pelvis to Chest, like spine_01 and spine_02 [read] game/model_rig.cpp:244.
- Its frame `lower` is built from `pose.right` and a level `up` [read] :327, :342; the chain leaves `right` unbanked
  (`p.right = yaw_turn(right, c.pelvis_twist)`) [read] :639, and banks the hips only as positions [read] :626.
- The swing then turns the bone onto the posed Pelvis-to-Chest line, which carries the trunk's 0.35 [read] :347.
- So the pelvis bone, and the 5,123 hunter vertices it dominates, bank at the trunk's share; only the thigh roots move with
  the hips' 1.0 [inferred from those lines]. The weights are MPFB's and are not the fault. [2nd reader: the lines read true
  (all six re-opened). RE-DERIVED as to the conclusion: C wrote "the pelvis mesh, weighted to the pelvis bone, banks at the
  trunk's 0.35 and not the hips' 1.0" at p-l180-lap2-C_2026-11-12.md:122-123, and the brief carries it at :1596; the mechanism
  and the 5,123 are new. DOWNGRADED on "5,123 ... bank at the trunk's share": 5,123 is the count whose LARGEST weight is the
  pelvis; many carry thigh or spine_01 weight and so bank between. "Not the weights' fault" is [inferred]: no vertex was
  re-posed here.]
- The landed row checks spine_01 at 0.35 and never measures the pelvis bone [read] game/tests/model_rig_tests.cpp:616-649.
- The room already solved this once, elsewhere: "The pelvis: its x the hips' line exactly, its y the body's up made square to
  that ... (L185 step 2: a pelvis framed along the spine carried the hips by 2.8 cm on the hunter ...)"
  [read] game/skeleton.cpp:75-78. The retarget never took the same rule.
- This bears on item 214: "on the corners, the torso doesnt orient itseld into the banking of a turn" [read] brief:1589.
  The hips' whole bank is registered but ~~not drawn~~ [inferred] [2nd reader: DOWNGRADED. The hip positions do bank at 1.0
  (model_rig.cpp:626; the landed row measures `hips` 20 at :640-641), and the thighs, aimed hip to knee, follow them. What is
  not drawn is the bank on the pelvis bone's own skin. The torso the owner names is spine_03's: 10,942 hunter vertices at the
  registered 0.35 by design, which this lap does not touch].

## 3. The design: one base, a body per kind by parameters

### 3a. Inputs and outputs

- Offline input, one small plan per kind [ours]: MPFB macros (gender, age, muscle, weight, height, proportions), named length
  targets (2a), `kidlib.stretch` factors per bone (the room's own, p-d659-blender-A:85-89, :605 [read]), clothes and seam,
  LOD ratios. It records what each script now hard-codes, e.g. the hunter's eight targets (p-d659-blender-A:596-599) [read].
- Offline output: `content/models/<kind>.glb`, `<kind>_lod1.glb`, `<kind>_lod2.glb`, all on the same 53-bone skin, plus a
  printed proportion sheet (2d's columns and the stride numbers of 3c).
- Runtime input: only the GLB. `rest_from_bones` reads hip height and limb lengths; `gait_pose` turns them into stride and arm
  swing [summary] ground_code.md:191-194. Runtime output: one palette per character per frame, as today.

### 3b. Where it sits in the game

- `art/tools/` gets the pipeline scripts (today only `textures.py` is there [summary] ground_constraints_and_roster.md:92-93).
- `game/model_rig.{h,cpp}`: `Rig::build` / `Rig::palette` gain two framed bones (pelvis by hips; head by Head-to-Eye).
- `game/world/stage.cpp`: the `take` lambda (:584-625) and `add_model` (:484-572) load one ModelFigure per kind and LOD;
  `place_figures` (:256-287) needs a per-id phase map instead of the single `hunter_phase_` [summary] ground_code.md:216-226.
- `game/world/figures.h:28` slots stay; a kind with a model draws it instead of boxes.
- `game/tests/model_rig_tests.cpp`: the model gate rows (3e). `CREDITS.md`: one row per new GLB.

### 3c. Which proportion carries which capability, honestly

The stride law on main is step = 1.15 h (v^2 / g h)^0.3 [summary] ground_locomotion_and_yardstick.md:69-74. At one speed,
step rate goes as h^-0.7: legs 20% longer give steps 13.6% longer and 12% fewer a second [inferred: algebra]. Fewer steps a
second means fewer chances a second to put a foot down sideways [inferred]. Swinnen adds: heavier and longer-footed bodies
stay on the ground longer; heavy feet swing slower (2c). [2nd reader: DOWNGRADED. Those effects were fitted on people of 47-91
kg and relative foot-shoe mass 0.0133-0.0195 (Table 1) at 2-4.17 m/s, all in standard running shoes; using them for a 1.55 m "heavy"
charger or a monster in big shoes is an extrapolation, and the effect on stride frequency of body mass alone was P >= 0.164, none.]

| kind | role (E's sheet, read) | the proportion that says it | step at its speed (law, [inferred]) |
|---|---|---|---|
| hunter | always coming; 2.54 m turn circle (:38-39) | long arms (arm/leg 0.85); legs as the kid's | h 1.196: 2.46 m, 3.67/s at 9.0 m/s |
| sprinter | fastest straight, widest turn (:74-79) | long legs, as E drew; built: long trunk | built h 1.255: 2.96 m, 3.92/s; legs +20%: 3.36 m, 3.45/s at 11.6 |
| interceptor | tightest turn, 1.44 m circle (:102-108) | ~~short legs~~, wide stance | h 0.85 [ours]: 1.69 m, 4.26/s at 7.2 |
| pack | three small, 0.92x (:130-134) | ~~small all over~~ | h 0.68 [ours]: 1.47 m, 5.02/s at 7.36 |

[2nd reader on the two rows: the arithmetic re-derives (all five rows, from step = 1.15 h (v^2/gh)^0.3). The shape column does not
follow E's sheet, which the header says it quotes. Interceptor: "~1.70 m ... broad, low centre, legs wide" (p-d659-chasers-E:110-111);
h 0.85 is a normal hip height for 1.70 m (0.50), so "short legs" is the scout's, [ours] and unmarked. Pack: "~1.25 m each ...
Proposed: not child-shaped. The heads are small for the bodies, the arms long" (:136, :140); a body small all over reads as a
child, which E ruled out. 0.92x is a speed multiplier (:131), not a size. The sprinter row's 11.6 m/s is above the 10.97 m/s
ceiling of measured humans (ground_locomotion_and_yardstick.md:76), which the scout notes.]
| charger | low, heavy, then a lunge (:157-161) | mass, shoulders above head | longer stance (Swinnen), not in gait_pose |
| player | baseline | the kid as built | the player's Body does not use this law [summary] ground_locomotion_and_yardstick.md:79-80 |

Speeds: ref 8 m/s x row [summary] ground_locomotion_and_yardstick.md:178-179. E's sheet used a 7 m/s reference
(p-d659-chasers-E:37) [read]: the two disagree; I used the ground's. Above 10.97 m/s no human was measured [summary]
ground_locomotion_and_yardstick.md:76. The sprinter row is the one where the built body and its role disagree.

### 3d. What the skeleton must add for the traits he picked

- Nothing in the model. The 53-bone rig already has pelvis, three spine bones, a neck bone, a head bone and fingers (2a).
- In the retarget, two framed bones [ours, the pelvis rule taken from game/skeleton.cpp:75-80]:
  - **pelvis by its hips**: its x the hips' line, its y the body's up squared to it, no swing. The hips then show their 1.0,
    spine_01-02 stay on Pelvis-to-Chest at 0.35, spine_03 on Chest-to-Neck. That is three trunk pieces where the drawn body has
    one today, so a back flex (T3) can bend at the lumbar and at the chest without a new BodyPose joint [inferred]
    [2nd reader: UNSUPPORTED for a sagittal flex. A frame whose x is the hips' line and whose y is the pose's `up` cannot
    pitch: rotating about the hips' own axis leaves both hip points where they are, and `gait_pose` sets `p.up = {0,1,0}`
    (model_rig.cpp:742) and `kinetic_chain` never changes it. So `kPitchPelvisShare` 0.5 would still not show on the pelvis
    bone. Roll and twist would. A galloping back flex is a pitch [inferred]; it needs a pitch channel, or the new joint
    brief:1154 says]. This
    disagrees with brief:1154 "needs a spine joint the body lacks"; the disagreement stands until a T3 clip shows which is right.
  - **head by Head-to-Eye**: `neck_01` and `head` share one aim, Neck to Head, so the head can never pitch apart from the
    neck [read] game/model_rig.cpp:245. Framing `head` by its own forward (Eye minus Head, with `head_right`) and aiming
    `neck_01` at the skull base lets the head hold its rotation while the neck carries it: the bird's hold (T2). The upper-body
    scout reads that a pigeon holds rotation, not translation [summary] scout_upper_body_and_gaze.md:11, :219.
    [2nd reader: UNSUPPORTED as a mechanism. `kinetic_chain` rotates Head and Eye about the same Neck point by the same
    `head_pitch` (model_rig.cpp:637-638), so Head-to-Eye pitches exactly as Neck-to-Head does; framing `head` by Eye minus
    Head changes nothing until the pose carries a separate head pitch and a separate neck pitch. No such field exists in
    `ChainPose` (model_rig.h:161-166 lists one head_lean, head_pitch, head_twist only [inferred]). It is [ours] and unbuilt; the
    bullet does not say what the new channel is.]
- Fingers: drive the existing finger bones; that is the owed "New joints" lap, not this layer.

### 3e. The checks a new model passes before it is animated [ours, each sourced where marked]

1. Loader rules (exist): no negative weight, index in range, non-zero sum [read] model/model.cpp:332-338.
2. No joint twice in one vertex's four (glTF MUST, 2b). Not checked by the loader today.
3. The influence cut is made on purpose: `vertex_group_limit_total(4)` then `normalize_all` before export, printing how many
   vertices lost weight and the largest weight dropped (2b). Reported, not gated: no source gives a bar. [2nd reader: a trap
   in the call named. `vertex_group_normalize_all` defaults `lock_active=True`, "Keep the values of the active group while
   normalizing others" (Blender API, bpy.ops.object, `current`), so the page's "sum of all weights is 1.0" is not what the
   default call does. Pass `lock_active=False` and re-count the sums after (the loader only renormalises,
   model.cpp:339-341, so it hides a bad sum), or this check can pass while a vertex sums to less than 1.]
4. Every vertex weighted, none on a neutral joint; skin of 53 (54 with `eye`) [read] the sprinter's "floor-to-hip bars" came
   from unweighted vertices (p-d659-blender-A:863-865).
5. Soles on the floor at rest: lowest vertex y = 0 +- 1 cm [ours bar]. Red today on the sprinter (-0.131 m) [read].
6. Weights stay local: a vertex's largest-weight bone lies within 0.25 m of it [ours bar]; catches a clothes transfer gone wrong.
7. At rest every palette is the identity; under the stand-in gait every limb keeps its length: the landed rows
   (model_rig_tests.cpp:128, :194) run once per content model [summary] ground_code.md:257-263.
8. The proportion sheet prints (2d plus 3c). Read by eye beside the kind's role, not gated.
9. Counts: vertices and triangles per mesh and LOD, against 3f. A mesh at two vertices a triangle is flagged for welding.
10. Every mesh named and expected (the kid's 24-vertex "Cube" would be asked for), and one CREDITS.md row per file.

### 3f. Levels of detail and the budget

- His rule: `entity_bodies-2` "Nearest two or three full detail" [read] brief:1274; "hunter full detail, the rest can be
  lower quality but still decent" [read] brief:1276.
- Cost model [inferred, linear in vertices from one measurement]: 0.39 ms / 266k vertices = about 1.5 ns per skinned vertex,
  skinning plus refit. Hunter LOD0 127k = about 0.19 ms. A 30k LOD1 = about 0.045 ms. An 8k LOD2 = about 0.012 ms.
- Making them, cheapest first [ours]: weld the hunter's shoes (38% of its vertices); drop the covered body where only the
  hands show (p-d659-blender-A:715 [read]); LOD1 = no smoothing subdivision, as `kid_lite` was (110,642 against 205,050 tris,
  p-d659-blender-A:548 [read]); LOD2 = Decimate Collapse with Symmetry. Every LOD re-runs checks 1-10.
- One Rig and one palette per character serve every LOD (same skin) [inferred from 3a]. Switch by distance with a margin
  so a body does not flicker between two [ours]. Each LOD's ray-tracing structure is built once; only the drawn one refits
  [inferred].
- Worst case on the slots (1 + 6 + 6 + 9 + 2 = 24 figures, figures.h:28): the hunter at LOD0, two at LOD1, 21 at LOD2 adds
  about 0.09 + 0.25 = 0.34 ms over today's 0.39 [inferred]. Past a set count, bodies at a distance may stay rigid segments
  (no skinning, the boxes' path; p-d659-models-E:49-53 [read]) if timing says so. Untimed: the first LOD lap times it.
  [2nd reader: DOWNGRADED. That option's reason, "never seen sharp, item 78", is the rule E withdrew at the librarian's ruling
  (p-d659-chasers-E_2026-11-11.md:206-228, "chasers are built as detailed as the kid", item 82 brief:680; the rigid-segment
  line is named there as one of the old rule's carriers). The cost model is one point: 0.39 ms / 266k vertices extended to
  8k-vertex bodies, a 33-fold range, with 0.32 ms of the 0.39 in a pass that includes the BVH refit (ground_constraints_and_
  roster.md:24-28), which has a per-figure floor the per-vertex line cannot show. The arithmetic itself (0.19, 0.045, 0.012,
  0.34) is right.]

### 3g. Cost per character per frame

| piece | where | cost |
|---|---|---|
| plan, MPFB, export, checks, LOD | offline (Blender, tests) | none at run time |
| pelvis and head frames | `Rig::palette` | two normalises, two crosses: well under 1 us [inferred] |
| palette (53 bones) | `Rig::palette` | as today; not timed [summary] ground_code.md:235-237 |
| skinning plus refit | GPU | about 1.5 ns a vertex [inferred]; LOD sets it |

### 3h. The same layer for the hunter, a lesser chaser and the player

- Hunter: keeps its model; gains the pelvis frame (its hips show their bank) and LODs only for distance.
- A lesser chaser: a plan, one GLB per LOD, the gate rows, then the same `gait_pose` and Rig the hunter uses.
- Player: the kid goes through the same Rig and aims (`kid.joint_map.json:303-314` aims pelvis, spine_01, spine_02 from
  Pelvis [read]), so the pelvis frame reaches him too. His Body sets the hips from its own right [inferred]: no change
  expected when running straight; the body rows and the camera row must stay green. No LOD for the player.

## 4. The first lap

**Pelvis framed by its hips, in the retarget.** Tier: prove it (geometry; shared code; the hunter and the kid draw through it).

- Files: `game/model_rig.cpp` (`Rig::build` marks the skin's `pelvis`; `Rig::palette` frames it from HipL-HipR and `pose.up`
  with no swing, as game/skeleton.cpp:78-80); `game/model_rig.h` (the comment at :8-14); `game/tests/model_rig_tests.cpp`;
  `game/tests/world_app_tests.cpp`; `CHANGELOG.md`.
- Consumers to re-run: `game/world/stage.cpp:278` (hunter) and `:305` (kid), and the 9 palette call sites in model_rig_tests
  [read: git grep]; body_tests (the camera row and the glance rows); skeleton and ragdoll rows.
- Row 1, scripted, written red first: `the_pelvis_bone_banks_with_its_hips_line_not_with_the_trunk`. Same set-up as
  model_rig_tests.cpp:616 (a 20 degree bank on gait_pose); measure the `pelvis` bone's roll. Today about 7 degrees
  (0.35 x 20) [inferred from 2e]; after, 20 +- 1, the bar of the row beside it.
- Row 2, on a recorded case: `over_his_kept_run_the_drawn_pelvis_takes_the_hips_whole_bank`, on the trace the lean-timing row
  already builds (`hunter_lean_trace`, DZ_LEAN_RUN else the flee bot's run, world_app_tests.cpp:1160-1178 [read]). Over frames
  with |lean| above 5 degrees, the median of the pelvis bone's roll over the hips' roll: today about 0.35 [inferred]; after
  1.00 +- 0.05 [ours bar]. Red before the change; it prints both numbers.
  [2nd reader: row 2 is a tautology once the fix is in. The bone is framed FROM the hips' line, and the row divides its roll
  by the hips' roll, so 1.00 holds by construction on any run and says nothing about the drawn body. Its only content is the
  "today" side. A row that would bite measures SKINNED hunter vertices near the waist (say the pelvis-dominated set, 5,123) and
  asks that their roll follows the hips' within a bar. See also "the simplest way to pass" in Second reader.]
- Guards that must stay green unchanged: the row at :616 (spine_01 still at 0.35), the rest-identity row (:128), body_tests'
  camera row, his ~~16~~ kept runs byte-identical [2nd reader: game/runs on main holds 20 `.dzr` runs; 16 is the count at the
  lap that ground_physics_and_fp_body.md:189 reports. Uncited here] (picture only: the Rig touches no simulation state) [inferred].
- Then the clip in section 5, before landing.
- Prerequisite, not a lap: commit the pipeline scripts from the temp folder into `art/tools/` (1, last bullet).

## 5. What only the owner's eye can decide, and the fewest clips

His rule: "his eye decides what is elegant and what is creepy"; and item 216's ruling: full frame rate, lit, no "before"
older than a fix he has seen [summary] ground_constraints_and_roster.md:159-161.

1. **The pelvis frame.** The hunter's sharpest corner on his kept run, outside and look-behind, main beside the lap. It
   decides whether the drawn hips' bank is what "doesnt orient itseld into the banking" missed. Show it BEFORE the trunk-share
   clip of brief:1598, since this lap changes what 0.35 looks like.
2. **The sprinter's build.** The sprinter as built beside one with legs +20% (trunk back to the hunter's), both running at
   11.6 m/s by the stride law, side view in E's fog lineup. It decides whether the body says "fast on a straight".
3. **Distance.** The hunter at 10, 20 and 40 m, LOD0 beside LOD1, and the moment of a switch. It decides how far "full
   detail" must reach for him.

## 6. What I would NOT build, and why

- **New bones or another rig.** The 53 bones cover every picked trait (3d); a new rig means re-weighting and new aims.
- **Twist or face bones.** Not needed for any pick; face only "at the catch" (`entity_bodies-3`) [summary]
  ground_his_words.md:572.
- **Proportions as a new uncanny cue.** Item 169 sets one motion cue per kind, hunter T1 only; bodies follow E's sheets.
- **Proportions that change at run time** (morph targets, stretching limbs). The loader reads no morphs, it costs work per
  vertex, and a body that changes length breaks the stride law's honest mapping [inferred].
- **Eight influences.** The loader refuses a second set, and the cost grows [summary] ground_constraints_and_roster.md:67.
- **Silent weight repair.** Limit and normalise only where counted (3e item 3); a bad region is repainted and looked at.
- **gltfpack or meshoptimizer now.** A new dependency needs his yes; gltfpack merges meshes and renames by default, and the
  first-person hiding depends on mesh names [summary] ground_constraints_and_roster.md:120-121. Blender's decimate first.
- **A four-legged skeleton for the crawler.** His rule: "all entities must be humanoid in nature with their own unique
  uncanniness" [read] brief:1150; on all fours it keeps this rig [summary] ~~scout_gaits_any_body.md:212-216~~ [2nd reader: UNSUPPORTED cite. Those lines are the gait
  clock's outputs. The crawler is at scout_gaits_any_body.md:323 ("on all fours, under a metre ... `stalk` or `gallop`") and :52-53,
  and nothing there says the rig stays. The quoted rule, "humanoid in nature", does not say "same rig" either: [inferred]. Note E's
  pack also "drop[s] to all fours" (p-d659-chasers-E:146), so the 53-bone rig must pose on all fours for two kinds, not one.]
- **Clips or mocap on these rigs.** His "not to use, but to learn from" [summary] ground_his_words.md:306-309.

## What I did not open

- The renders and previews of every pass (`previews/*`), the GLBs' textures, `kid_lite.glb` and `kid_dressed_lite.glb`.
- `kidlib.py` beyond its function names; `rig.py`, `fit.py`, `sprinter*.py`, `pose_sprint.py`, `dress.py` beyond greps.
- MPFB 2.0.18 itself (I read master 9de0707); `weights.game_engine.json` may differ in 2.0.18. MPFB's proxy meshes.
- `game/model_rig.cpp` `gait_pose` and `apply_motion` bodies; `game/body.cpp` (how the player's hips are set);
  `hunter_lean_trace`; l205-stomp-c (it does not touch the aims: `git diff` grep, 0 hits).
- The Decimate modifier's handling of deform weights (not stated on its page); Blender 5.2's own API page (I read "current").
- Daley & Birn-Jeffery 2018, Pontzer's effective limb length, Hof 1996: none opened.
- The other swarm files beyond their summaries and the lines cited; no session transcript; no GPU or game tool was run.

## Second reader

Marks: line numbers are the scout's ORIGINAL lines (edits above shifted the file). Re-run here, read-only: the three scout node
scripts on the shipped GLBs, `curl` of every outside page and source file named, the stride law by hand. Nothing built or run.

| orig. line | claim | primary opened | verdict | evidence |
|---|---|---|---|---|
| 49-50 | MakeHuman core assets CC0, no notice, no attribution | static.makehumancommunity.org/about/license.html | OK | "You do not need to pay anything, include any copyright notices nor give attribution." |
| 51-55 | MPFB LICENSE.md lines 52-62, 76-77, 82; master 9de0707 of 2026-11-12 | raw LICENSE.md; GitHub commits API | OK | section C at :49-62, D at :69-89; sha 9de0707fdc88, date 2026-11-12 |
| 55 | LICENSE.ASSETS.md line 29: waiver "for any purpose whatsoever, including ... commercial" | raw LICENSE.ASSETS.md | OK | :29 reads so; 4(a) and 4(c) edges added in place |
| 56-57 | USE: commercial yes, no attribution, no share-alike, redistribution allowed | the two texts | OK | CC0 text; one gap marked in place: the output line is "the opinion of the MakeHuman team" (:72) |
| 58-59 | MPFB code GPLv3, lines 26-29 | LICENSE.md | OK | :29 "released under GPLv3" |
| 60-63 | game_engine rig: 53 bones, chain, 15 finger bones, no twist or face; default 163 | rig.game_engine.json, rig.default.json | OK | 53 and 163 keys; default has spine01-05, neck01-03 |
| 63 | variants listed | GitHub contents API | OK | also lists default_no_toes (omitted, harmless) |
| 64-67 | joint strategies CUBE/MEAN/VERTEX, rig.py:295-305; length target moves joints | rig.py | OK | :294-313 plus an XYZ case; `build_basemesh_position_info(take_shape_keys_into_account=True)` at :894 |
| 68-71 | length-target names exist as decr/incr | target.json | OK | all 12 families found; hand-fingers-length only as decr-incr |
| 71 | 1508 target files | GitHub tree API at 9de0707 | WRONG | 1,258 `.target.gz`; 1,477 blobs under data/targets with images |
| 72-74 | weights.game_engine.json: CC0, 19,158 verts, {1:9369 ... 7:4}, 981 above four | the file, my count | OK | identical histogram; max sum error 1.0e-4 |
| 78-81 | glTF 3.7.3.3 quotes; spec CC-BY-4.0; loader checks first not second | spec html; model.cpp:328-341 | OK | spec lines 3937, 3940, 3943; loader checks negative only |
| 82-86 | exporter default 4, warning text, neutral joint, line cites, Apache-2.0 | glTF-Blender-IO main 9a35580 | OK | `__init__.py:981-986`, `primitive_attributes.py:90-97`, `primitive_extract.py:1672-1675`; the hunter was exported by 5.2.41 (ground), main is 5.4.12: version gap not stated |
| 86-89 | hunter_bake.py:117-118 passes no influence option; 19,104 / 32,106 four-weight; max error 1.3e-7 | hunter_bake.py; both GLBs (script re-run) | OK | export call has no export_influence_nb; counts and 1.34e-7 identical |
| 90-92 | bpy.ops API: limit_total, normalize_all, clean, data_transfer | docs.blender.org `current` | OK | quotes match; the `lock_active=True` default is omitted (see the 3e note) |
| 93-95 | Decimate Collapse text; Symmetry; Vertex Group | decimate manual page | OK | text at the Collapse heading |
| 96-101 | meshoptimizer MIT whole; simplify uses existing vertices; gltfpack lines 17, 61, 95 | LICENSE.md, README.md, gltf/README.md | OK | README:647 and :661 also speak of skinning weights and `Regularize`: not mentioned |
| 105-111 | Swinnen 2026: n=103, 2-4.17 m/s, P=0.039, foot results, Table 1, CC BY 4.0 | Europe PMC full text XML | OK | all quotes and 0.515 +- 0.011 (0.492-0.543) found |
| 106-107 | "Froude number alone explains most variance" | same, Abstract | DOWNGRADED | R2 0.01-0.94 in running; speeds are a jog; frequency is dimensionless |
| 112-113 | birds with long legs, via Daley and Birn-Jeffery, secondary | same, Introduction | OK | sentence found as quoted, marked [summary] |
| 114-118 | Wang 2026 Sci Adv, CC BY-NC, two quotes | Europe PMC full text | OK | both sentences found; a quadruped robot paper quoting others |
| 119 | no source ties trunk length alone to human gait | none (an absence) | UNSUPPORTED | an absence claim; I searched nothing wider |
| 123-131 | table: kid, hunter, sprinter measures | the three GLBs, glbjoints.js re-run | OK | 0.460/0.450/0.151, 0.621/0.501/0.179, 0.595/0.515/0.339; ratios 0.543/0.542/0.434 |
| 133-134 | kid and hunter share one relative leg length | blender-A:599 stature 2.150 m | DOWNGRADED | hood top 2.224 vs built 2.150: 0.542 vs 0.561 |
| 134-135 | sprinter is a long trunk, not E's long back-jointed legs | blender-A:742-749; chasers-E:81-84 | WRONG | A: paws x2.1, "knee seen backward is the ankle"; trunk length RE-DERIVED (A:743) |
| 135-136 | sprinter lowest vertex -0.131 m at rest | sprinter.glb, script | DOWNGRADED | measured true; the rest pose of a balls-runner is not a standing pose |
| 138-144 | skin counts per bone and per mesh, no joint twice | hunter.glb, kid.glb, scripts | OK | every number identical (5,123 / 2,096 / 2,404 / 10,942; shoes 48,812 verts on 24,604 tris) |
| 148-151 | model_rig.cpp :244, :327, :342, :639, :626, :347 | game main 31d1c6d | OK | each line is the construct named |
| 152-153 | 5,123 pelvis vertices bank at 0.35; weights not the fault | model_rig.cpp; C:122-123 | DOWNGRADED | largest-weight count, many blended; conclusion RE-DERIVED from C |
| 154 | landed row :616-649 never measures the pelvis bone | model_rig_tests.cpp | OK | rows read spine_01, spine_03, neck_01, head and the hip positions |
| 155-157 | skeleton.cpp:75-78 quote | skeleton.cpp | OK | quote exact |
| 158-159 | brief:1589 quote; hips' bank "not drawn" | brief; model_rig.cpp:626 | DOWNGRADED | quote exact; the hip positions do bank at 1.0 and the thighs follow |
| 190-196 | stride numbers, five rows | by hand | OK | 2.455/3.67; 2.957/3.92; 3.360/3.45; 1.691/4.26; 1.466/5.02; h^-0.7 gives 13.6% and 12% |
| 192-194 | interceptor "short legs"; pack "small all over" read from E | chasers-E:110-111, :136, :140 | UNSUPPORTED | E: legs wide, 1.70 m; pack "heads small, arms long, not child-shaped" |
| 198-199 | E used 7 m/s, ground 8 | chasers-E:37; ground_locomotion:178-179 | OK | both lines say so |
| 207-209 | framing the pelvis by its hips gives a back-flex bend point | model_rig.cpp:742, :626 | UNSUPPORTED | the hips' line is blind to pitch; `up` stays level |
| 211-213 | head by Head-to-Eye lets a neck hold the head | model_rig.cpp:637-638; model_rig.h:161-166 | UNSUPPORTED | Head and Eye rotate by the same head_pitch; no second channel |
| 234-236 | brief:1274, :1276 quotes | brief | OK | both exact |
| 237-246 | cost model 1.5 ns a vertex; 0.19 / 0.045 / 0.012 / 0.34 ms; rigid-segment option | ground_constraints:24-28; models-E:49-53; chasers-E:206-228 | DOWNGRADED | arithmetic right; one-point linear fit; the option's reason was withdrawn |
| 244 | 24 figures, figures.h:28 | figures.h | OK | `{1, 6, 6, 9, 0, 0, 2}` is line 28 and sums to 24 |
| 272-273 | consumers: stage.cpp:278, :305; 9 palette calls in model_rig_tests | stage.cpp; the test file | OK | 9 calls on 8 lines |
| 277-278 | hunter_lean_trace, DZ_LEAN_RUN, world_app_tests.cpp:1160-1178 | world_app_tests.cpp | OK | helper at :919, the row at :1159-1180 |
| 283 | his 16 kept runs | game/runs | DOWNGRADED | 20 runs on main; 16 was an earlier lap's count; uncited |
| 309-310 | gltfpack merges meshes and quantises by default | gltf/README.md:49, :61, :95 | OK | `-kn`, `-noq` as cited |
| 312 | crawler keeps this rig, cites scout_gaits_any_body.md:212-216 | that file | UNSUPPORTED | cited lines are the clock outputs; crawler at :323; nothing says "same rig" |
| 41-43 | pipeline scripts only in a temp folder, not in the repo | the folder; `git ls-files art` | OK | rig.py, kidlib.py, hunter_bake.py, sprinter*.py, out/*.glb present; art/tools has textures.py only |
| 262-263 | kid.joint_map.json:303-314 aims | the file | OK | pelvis, spine_01, spine_02 from Pelvis to Chest |

Tally of the 47 rows: OK 33, DOWNGRADED 7, UNSUPPORTED 5, WRONG 2. (Of the 5 UNSUPPORTED, one is an absence claim I could not test.)

RE-DERIVED: 3. (1) "Fingers exist ... not driven" (summary 3): ground_constraints_and_roster.md:78-80 and ground_code.md:82-83. (2) The
pelvis mesh banking at the trunk's 0.35 (2e), in the record the scout itself lists at section 1: p-l180-lap2-C_2026-11-12.md:122-123 and
brief:1596, with only the mechanism and the count new. (3) The sprinter's long trunk (2d): p-d659-blender-A_2026-11-11.md:743. Only (1)
is in a ground file proper; the other two are in hand-backs the ground files cite.

### The simplest way the first lap passes without doing what it is for

Row 1 measures the `pelvis` bone's roll over a 20 degree bank. It passes if `Rig::palette` puts the bank's roll straight on the
pelvis bone, with no link to the hips' line, no twist, no pitch, and no change to the spine_01 skin it blends against. Row 2 passes
by construction (see the note under it). Neither row reads a skinned vertex. So the lap can go green while the 5,123 vertices tear
against spine_01's 0.35 at the waist, or while it fixes the hips and leaves the torso the owner named (spine_03, 10,942 vertices)
exactly as it was. Only his eye on the two clips of section 5 can tell, which the scout says; the rows should not be read as the proof.

### Mechanisms with no source and no [ours] mark

- The interceptor's "short legs" and the pack's "small all over" (table, 3c), attributed to E and not in E.
- The pelvis frame as a "bend point" for T3, and the Head-to-Eye frame as a head hold: marked [inferred] or [ours] in places, but the
  summary states them as done ("No new bones are needed for his picked traits").
- Check 5's bar (soles at y = 0 +- 1 cm at REST) is marked [ours bar] but would fail a model built to stand on its balls.

### What I could not check

- p-d663-loader-C_2026-11-11.md:134-139 (the GPU figures), which the scout and the ground both take at second hand; I opened only the
  ground file's account of it.
- Any clothes-source licence for the hunter's and kid's garments (bundled MPFB assets, or made here).
- Swinnen's Tables 3 and 4 beyond the abstract and Table 1: the dimensionless-frequency point was read from the text, not from the
  coefficient rows.
- Whether Decimate or `limit_total` change a skinned vertex in a way that shows at a knee: no page states it and I ran nothing.
- Anything in section 5 about what the owner's eye would decide: only he can.
- Ground files beyond the lines cited; scout_upper_body_and_gaze.md beyond :11 and :217-223.

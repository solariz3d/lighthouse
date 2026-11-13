# Ground: constraints, assets and roster for the animation system (ground reader, 2026-11-13)

1. Budget: on his own card, 360 fps is the aim and a solid 300 the floor (3.33 ms); 144-240 Hz for most players. The game's own doc still says 360 is hard.
2. Picture only is enforced by tests: the world self-test's part 7 compares the drawn run's hashes to the headless run, and his 16 kept runs are replayed and compared byte for byte.
3. Two skinned glTF models on main (kid 25.6 MB, hunter 21.9 MB), both MPFB `game_engine` rig (53 bones; the kid has a 54th, `eye`), no clips inside; the game drives them from 21 joints + 1 spine joint.
4. Only the hunter (one at a time) and the kid draw as models. Sprinter, interceptor, pack and crawler draw as box placeholders; charger and stalker are not built; the dark one gets 0 figure slots.
5. Clip tools exist (`--capture-lean` etc.), fixed at 12 fps, and three clip failures are on record: washed out, look-behind showing walls, a "before" older than a fix he had seen.

Marks: [read] opened and seen; [summary] from another account; [inferred] mine; [ours] a proposal (none here).
Game repo read at `main` 31d1c6d ("Merge a-d673-overtime"), unless a branch is named. Brief = `exo_memory/briefs/dreamzone2_the_game.md`.

## 1. The frame budget

- [read] Item 211 (brief:1569): "we could realistically aim for a bit lower that 360. ... the standard for most users should be
  144 to 240hz max, but can allow for up to my refresh rate for goated pcs".
- [read] Item 212 (brief:1574): "i should say, for our build i want it as close to 360 as we can get it for true ultra, but i can
  settle for a solid 300+".
- [read] The architecture line these replace, still unamended on main: `docs/ARCHITECTURE.md:57`
  "4. **360 fps is a hard budget** (2.78 ms a frame on the reference RTX 5080), with no streaming hitches."
- [read] The librarian's ruling under item 212 (brief:1577): on his RTX 5080 at 2560x1440, a render feature's gate is p99 under
  3.33 ms, 2.78 ms the aim. "Solid" read as p99 is that seat's reading, not his words (same line).
- [read] Sim tick: `docs/ARCHITECTURE.md:55-56`, "A fixed 240 Hz tick ... Rendering interpolates between ticks."
  The pose interpolation is `BodyPose::between` (`game/body.h:67`).
- [read] What the two models already cost on the GPU (`handback/p-d663-loader-C_2026-11-11.md:134-139`): average +0.39 ms,
  p99 +0.48 ms, both at full detail; about 266k vertices skinned and 343k triangles refitted per frame [that line marks this
  inferred]. 0.32 ms of it is in the top-level pass (skinning + BVH refit). No LOD exists; `kid_lite.glb` (110k tris) is named
  as the lever.
- [read] Default frame on his card (`p-d675-bench-P`, as quoted at brief:1576): p99 1.99 to 2.09 ms with nothing extra on.
- [read] Chasers in view, the proven case: `docs/ARCHITECTURE.md:122-123`, "nine chasers in view: 1.4 ms at the 99th percentile at
  1080p and 2.2 ms at 1440p" (box placeholders then).
- [inferred] Room left: about 1.2 ms at p99 against 3.33 ms on the default frame, before any render feature he turns on.

## 2. Animation is picture only

Where the record states it:
- [read] `handback/p-l183-physics-anim-E_2026-11-12.md:54`: powered ragdolls "live in a **separate** `PhysicsSystem` owned by the
  renderer side ... They read the sim ... and write nothing back."
- [read] `dreamzone-3/game/ragdoll.h:2-3` (main): "PICTURE ONLY: it reads a pose and writes nothing back into the simulation or
  the chase, so replays cannot change".
- [read] `game/body.h:86`: a body raycast "moves nothing in the simulation (sim::World::raycast is not part of the fingerprint)".
- [read] Narrowed by a later seat: `handback/p-l186-physics-player-E_2026-11-12.md:85` says "never picture-only for the player"
  was one inference; it holds for the CONTROLS, not the camera's picture or the body's reactions (his item 161 struck the "never").
- [read] Picture-side state already exists: the hunter's stride phase is advanced by the render step (`game/world/stage.cpp:269`,
  `hunter_phase_ += p.speed * last_dt_ * ...`).

How it is tested:
- [read] `game/world/selftest_run.cpp:114-146`, part 7 of `dz-world --selftest`: the flee bot's record is played through the app
  and checked equal to the headless harness on tick count, `chase->run().state_hash()`, `app.world().state_hash()`, the nav
  trace and the events. The chase fingerprint is `Run::state_hash()` (`chase/run.h:226-227`).
- [read] `game/tests/app_tests.cpp:451`: `playing_back_the_bots_record_through_the_loop_gives_the_simulations_fingerprint`.
- [read] Per-lap check of his kept runs: `handback/p-l185-steps4-5-E_2026-11-13.md:106`, "his 16 kept runs, identical 16, differ 0"
  (base 31d1c6d against the branch, via `compare_replays185.cmd`). Same file :108: 14 footsteps miss their recorded fingerprints
  on BOTH builds (recorded before later sim changes), so an old-run mismatch is not by itself a picture-only breach.
- [read] Older runs that do not replay: `handback/p-l170-chase-A_2026-11-12.md:163` (4 runs from 11-11).

## 3. The models

Files (main):
- [read] `content/models/hunter.glb` 21,871,340 B; `content/models/kid.glb` 25,634,852 B; `content/models/kid.joint_map.json`
  5,850 B (`ls -l`). Git LFS (`git lfs ls-files`: hunter 6487b9cb29, kid d38901dd73). One commit: d638463 (2026-11-11).
- [read] Read from each GLB's JSON chunk (a node script over the header only):
  - hunter: 1 skin, 53 joints, 6 meshes, 138,048 tris, 127,116 verts, 11 images, **0 animations**; Blender glTF I/O v5.2.41.
  - kid: 1 skin, 54 joints (the 53 + `eye`), 9 meshes, 205,050 tris, 139,125 verts, 14 images, **0 animations**.
  - Joint list (both, `eye` kid only, after `head`): Root, pelvis, spine_01, spine_02, spine_03, clavicle_l, upperarm_l,
    lowerarm_l, hand_l, index/middle/pinky/ring/thumb _01.._03_l (15), clavicle_r, upperarm_r, lowerarm_r, hand_r, the same 15
    finger bones _r, neck_01, head, thigh_l, calf_l, foot_l, ball_l, thigh_r, calf_r, foot_r, ball_r. No face bones, no twist bones.
- [read] Skinning limit: four influences per vertex; a second JOINTS set is refused (`model/model.h:16`, `:23`).
- [read] The loader reads meshes, materials, images and a skin; no grep hit for clip or animation in `model/model.cpp` or
  `model/model.h`, so clips in a GLB would be ignored today.

The game's skeleton (main):
- [read] 21 joints, `game/body.h:38-45`: Eye, Head, Neck, Chest, Pelvis, Shoulder/Elbow/Wrist/Hand L and R, Hip/Knee/Ankle/Toe L
  and R. Body moves: `BodyMove` Run, Air, Slide, Vault, Climb, WallRun, Ladder, Dive, Roll (`body.h:50`).
- [read] `game/skeleton.h:5-9, 35-36`: the 21 plus one lower spine (`kSpineJoint`) at the pelvis, as a rotation tree
  (Pelvis-Spine-Chest-Neck-Head-Eye; arms off the Chest; legs off the Pelvis). Pure, no GPU or physics (`:24`).
- [read] How a pose drives the 53 bones: `game/model_rig.h:4-13`. Each bone with an AIM (a pair of game joints) is swung onto the
  posed stretch; "A bone with no aim moves with its parent (its fingers with the hand ...)". The kid's rest joints come from
  `kid.joint_map.json`; the hunter's from its own bones (`rest_from_bones`, `model_rig.h:15-16`).
- [read] Joint map: "MPFB game_engine skeleton, 53 bones, plus 'eye' (non-deforming, under 'head', at the eye midpoint)"
  (`kid.joint_map.json`, "rig" field); the head rule puts `eye` on the camera each frame ("head_rule" field).
- [inferred] So spine_01..03 are collapsed into Spine and Chest, the clavicles and fingers are not driven, and the 53-bone rig has
  more joints than the game drives. Item 169 (brief:1154) notes the sprinter's T3 "needs a spine joint the body lacks".

How they were made (pane A, Blender 5.2.3 headless, MPFB 2.0.18):
- [read] `handback/p-d659-blender-A_2026-11-11.md:34`: MPFB 2.0.18 from extensions.blender.org, "GPL-3.0-or-later code".
- [read] Hunter: `p-d659-blender-A:596-599`, an MPFB adult male (gaunt), eight targets (arms at max, neck short, hunched), "scaled
  to **2.150 m**", the kid's 53-bone rig. File: `:711`, 20.9 MB, sha256 `6487b9cb…`.
- [read] Kid: `p-d659-blender-A:547`, `kid.glb` 24.4 MB, 139,125 verts, 205,050 tris; `kid_lite.glb` 110,642 tris (`:548`).
  Design sheets: `p-d659-kid-E`, `p-d659-kid-redesign-E`, `p-d659-kid-redesign2-E` (all 2026-11-11).
- [read] A third model, NOT landed: `out\sprinter.glb`, 15.3 MB, 105,788 tris, back-jointed legs, 2.275 m
  (`p-d659-blender-A:737-748`, `:851-857`). It is not in `content/models` (`ls`).
- [read] The pipeline scripts (`rig.py`, `bake.py`, `hunter.py`, ...) were "in the scratchpad" for `art/tools/` at landing
  (`p-d659-blender-A:552-555`, `:660`). On main `art/tools/` holds only `textures.py` (`git ls-files art`). [inferred] The rig and
  model scripts are not in the game repo.
- [read] Joint-map conversion issue: MPFB's neck sits 3.5 cm further behind the eye than the game's
  (`p-d663-loader-C_2026-11-11.md:83`).

Licences of the base meshes and tools:
- [read] `dreamzone-3/CREDITS.md:29`: "MakeHuman system assets (basemesh hm08) via MPFB 2.0.18 ... CC0 1.0" for both bodies, their
  UVs, the game_engine skeleton and its weights. Fabrics Poly Haven CC0 (`:30-33`).
- [read] `handback/p-d659-models-E_2026-11-11.md:132`: MakeHuman core assets "shared under Creative Commons, CC0"
  (static.makehumancommunity.org/about/license.html, fetched by E); "The code licence does not reach the models it makes";
  third-party MPFB packs vary (some CC-BY).
- [read] Tools: Blender (GPL), MPFB (GPL-3.0-or-later), not shipped (`p-d659-models-E:156-157`).
- I did not read any of these licence pages myself; every licence line here is [summary] of the seats' reads.

## 4. The roster, and what each draws as today (main)

- [read] Kinds: `chase/archetype.h:17-27`: Hunter, Sprinter, Interceptor, Pack, Charger ("named, not built"), Stalker ("named, not
  built"), Crawler (the climber), Dark (D673, overtime only).
- [read] Placeholders: `game/world/figures.h:1-11`, "a placeholder built from a few boxes", dark and matte; outlines: hunter 2.15 m
  with arms to the knee; sprinter thin, pitched forward; interceptor squat and wide; pack 1.15 m, large head, three; crawler on
  all fours under a metre. Box layouts: `figures.cpp:39-71`; any other kind gets one 0.5 x 1.8 m box (`:73-74`).
- [read] Slots: `figures.h:28`, `kFigureSlots = {1, 6, 6, 9, 0, 0, 2}` (Hunter, Sprinter, Interceptor, Pack, Charger, Stalker,
  Crawler). Kinds with 0 slots are skipped (`figures.cpp:109`, `stage.cpp:283`).
  [inferred] Dark is the eighth kind and the list has seven entries, so Dark has 0 slots and is not drawn at all on main;
  charger and stalker likewise.
- [read] Hunter: the FIRST hunter is the model, posed by the stand-in gait; "its box stays put away" (`stage.cpp:266-268`).
  [inferred] A second hunter, if ever present, would be a box.
- [read] Player: the kid's model replaces his boxes in first person (`stage.cpp:300`); meshes the eye never sees are hidden by
  glTF mesh name (`stage.cpp:139`, D672); `cull_back` for the kid (`stage.cpp:535`).
- [read] The owner's design rules for the roster:
  - Item 167 (brief:1143): "the hunter, and other entities, can take things from different animals, while being humanlike at the
    same time, to create that uncanny valley effect".
  - Item 168 (brief:1150): "all entities must be humanoid in nature with their own unique uncanniness".
  - Item 169 (brief:1154), his picks: hunter T1 only (greyhound cornering, head stays humanlike); sprinter T3 (galloping back
    flex); pack T4 (shared fixed rhythm); interceptor T2 (bird head hold); climber/crawler T4; stalker T2; charger T3.
    "The lesser kinds take theirs when they get humanoid models (they draw boxes today)."
  - Items 205-208 (brief:1546-1558), the hunter's stealth: a stealth mode when unseen; 207: "there should be a stealth mode of
    animation, moving like an alien hyena or some shit"; 208: "in that split second you see it, it turns up right and starts
    running like a human".
  - Item 183, `run_frame-5` (brief:1229-1230): the dark one is "A new creature"; the option as he read it: "it wears the hunter's
    shape as a stand-in". Its name is open (item 110, brief:906-908).
- [read] Behaviour context: `handback/p-d666-entities-E_2026-11-11.md:91-94` (scare moves per kind; design, not built);
  `handback/p-l172-chaser-kit-E_2026-11-12.md:58-67` (one signature per kind, options) and its speeds table (:28-36): lesser kinds
  6.4 to 19.0 m/s, hunter 9.0 to 16.7 m/s by level and time.

## 5. Capture and viewing tools, and what went wrong

- [read] `dz-world` flags (`game/world/main.cpp:226-240`): `--capture-walk`, `-run`, `-burst`, `-look`, `-models`, `-corner`,
  `-lean DIR --lean-run FILE`, `-fpbody`, `-fpburst RUN DIR`, and `--bench SECONDS`. Same set on `l205-stomp-c` 900e3c4.
- [read] `--capture-lean` (`game/world/offscreen_models.cpp:316-324`): replays a kept run; the hunter filmed from 4 m behind AND
  from the player's look-behind (V), through the fastest 2 s straight and the sharpest turn within 12 m; "12 frames a second".
- [read] `--capture-corner` (`offscreen_models.cpp:162-167`): look-behind and outside shots at 25/50/75 % through a turn (stills).
- [read] `--capture-burst` (`game/world/offscreen_burst.cpp:1-4`): consecutive frames, to measure frame-to-frame change.
- [read] Measure tool: `dz-yardstick` (`tools/yardstick/main.cpp:1-11`), the hunter's leg flexion per 1 % of the stride against
  Fukuchi 2017 runners at 2.5, 3.5, 4.5 m/s; step 2 the arms against CMU (`tools/yardstick/README.md:32-41`).
- [read] How C made the stomp clips (`handback/p-l205-stomp-C_2026-11-13.md:96-116`): offscreen `--capture-lean` plus a temporary
  joint dump; ffmpeg from a node_modules `ffmpeg-static` in a Downloads project; 12 fps, real time then 3x slower; three columns
  (main, fix, papers' take-off).
- [read] How E made the upper-body clips (`handback/p-l185-steps4-5-E_2026-11-13.md:20-23`): an HTML flipbook, 8 passes x 24
  frames, base beside branch.
- What went wrong:
  - Dark capture: the first after-capture rendered the lamps dark; re-taken; cause inferred (another GPU job)
    (`p-l205-stomp-C:108-112`).
  - Washed out: C's own gamma 1.9 lift "the corner reads washed out with it" (`p-l205-stomp-C:113`); the librarian: "the corner
    clip on the page is washed out to grey" (brief:1594).
  - Walls: "the four look-behind passes show walls, not the hunter" (brief:1601).
  - Wrong "before": item 216 (brief:1603-1606): "i think we devolved a shit ton with that artifact"; both halves were the run from
    before the stomp fix, "filmed at 12 frames a second with a dark start". Ruled: re-film "at full frame rate and lit", and no
    before-and-after whose "before" is older than something he was already shown fixed (:1606).
  - No frame cost with clips: "the frame-time hold was on" (`p-l205-stomp-C:116`); the ragdoll's step cost "is **not timed**"
    (`p-l185-steps4-5-E:122-124`).

## 6. Licences: what the owner accepted or refused

His words:
- [read] Item 150 (brief:1102-1103), on outside animation: "research open source alternatives, not to use, but to learn from".
- [read] `sound-7` (brief:1343-1345): picked "Add the Sonniss game-audio bundles"; his note: "we can also use sounds that neeed
  credit." [inferred] This covers sounds; nothing of his on disk extends it to models or motion data.
- [read] `sound-8` (brief:1346-1348): GPL synth as an offline tool, "Yes, render offline and ship the audio"; note "fk a lawyer".
- [read] Item 83 (brief:692-696): Blender "yep well u have access its on steam"; his yes covers Python for Blender work only.
- I found no word of his refusing a licence for art or animation data.

Seats' reads (not his word):
- [read] `handback/p-l176-openanim-C_2026-11-12.md:17-27`: Overgrowth code Apache-2.0, its animations not open; ozz-animation MIT;
  Holden's Spring-It-On and Motion-Matching MIT; Godot MIT; O3DE Apache-2.0 or MIT; **LAFAN1 CC BY-NC-ND 4.0, study only, can
  never ship**; Mixamo read only through search results (403); CMU not verified (certificate failure); Quaternius UAL "CC0" read
  only through search results.
- [read] `p-d659-models-E:136-140`: no CC0 mocap set confirmed; 100STYLE CC BY 4.0; Bandai Namco non-commercial "not usable";
  "Not CC0, and so excluded: Mixamo ... and the Bandai Namco set" (E's plan default).
- [read] `dreamzone-3/tools/yardstick/README.md:3-6`: "**Learn from, never use:** the recordings are a test reference ... never
  shipped and never committed"; CMU's terms as quoted there (:39-40): "free for use in research projects ... you may not resell
  this data directly, even in converted form". Fukuchi data CC BY 4.0 (:15-16).
- [read] `research/stomp_recordings_and_sonniss_licence_read_2026-11-13.md:14-25`: Sonniss licence v2.0 read in full (via Wayback):
  commercial use without attribution; no redistribution as sound effects.
- [read] `p-d659-models-E:96`: MPFB clothes "**CC0 ones only**" (a plan default by E).

## 7. Authoring tools on this machine, by the record (not run)

- [read] Blender 5.2.3 LTS at `C:\Program Files (x86)\Steam\steamapps\common\Blender\blender.exe`, headless only (brief:694-695).
- [read] In it: glTF I/O 5.2.41, Rigify 0.6.10 (`p-d659-blender-A:19-22`); Rigify needs `default_set=True` (`:25-29`).
- [read] MPFB 2.0.18 installed in his Blender user profile, not enabled in his saved preferences; scripts enable it per session
  (`p-d659-blender-A:34-58`); undo steps at `:68-73`.
- [read] MakeHuman: no standalone install named; the 7 record files that say MakeHuman speak of MPFB's assets [inferred from the
  hits read here].
- [read] ffmpeg: only the node package `ffmpeg-static` in one of his Downloads projects (`p-l205-stomp-C:97-98`).
- [read] Node and Bash are the room's script tools; Python only for Blender (brief:696).

## What a designer would need that I could NOT find

- The CPU cost per character per frame of `gait_pose`, `kinetic_chain` and the palette build; no figure on disk that I found.
- The ragdoll's step cost (not timed; row exists on E's local branch only).
- Which graphics card stands for "most users" (brief:1573, open).
- Whether the art pipeline scripts (`rig.py`, `hunter.py`, `bake.py`) still exist; they were in A's scratchpad.
- Any model for sprinter (on disk outside the repo, not landed), interceptor, pack, crawler, charger, stalker, dark one.
- The dark one's look beyond "A new creature" with the hunter's shape as a stand-in; its name is open.
- Any authored clip in either GLB (none), and any owner word on using clips at all versus "learn from" (item 150).
- An owner ruling on CC-BY or other licences for models or motion data (his credit note is for sounds).
- A licence read on the source page for Quaternius UAL, Mixamo or CMU (all via search, a README quote or failed fetches).
- E's steps 4-5 code (2767855) is in `worktrees\dz3-e-l185`, local only; `origin/l185-skeleton` here stops at b226b95 (step 2),
  and `git show l185-skeleton:` fails in this clone ("unknown revision"). Use `origin/l185-skeleton`.
- A capture at full frame rate: `--capture-lean` is fixed at 12 fps; no flag for another rate found in `main.cpp`'s usage text.
- LOD meshes for either model (none).

## What I did not open

- The GLB binaries beyond their JSON headers; textures; `kid_lite.glb` and `sprinter.glb` (outside the repo).
- `p-d659-kid-redesign-E` and `-redesign2-E` beyond a grep; `p-d663-hold-E`; `p-d659-chasers-E` beyond a grep.
- `model/model.cpp` and `game/model_rig.cpp` bodies; `game/ragdoll.cpp`; any test file other than the lines cited.
- `p-l187-animal-locomotion-E` and `plan_l187` (the trait catalogue); `p-l193-yardstick-E`; `p-d675-bench-P`.
- Any outside licence page (all licence lines are the seats' reads); `third_place/2026-11-13.md`; any worktree.

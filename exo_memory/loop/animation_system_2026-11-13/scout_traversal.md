# Scout: traversal (climbing, ladders, drops, chutes, doors), 2026-11-13

1. Today no traversal pose takes a hold from the world: the player's climb and vault hands sit at guessed points off the
   eye, the ladder hands slide with the body, and the hunter is drawn standing on ladders and through drops.
2. New at source: Overgrowth's ledgegrab.as timing (limb windows, reach at 0.1 s a metre, grip sounds); Kalisiak & van de
   Panne's typed holds; landing knee flexion by height (Verniba 2017, CC BY), parkour landings (Puddle & Maulder 2013).
3. Design: one small "grip" layer for every humanoid body. Holds come from the sim's own geometry rays, limbs move on
   Overgrowth's timeline, landings deepen by fall height to a measured cap. It is picture-only and keyed to sim ticks.
4. First lap: the player's climb grip from the ledge itself. Row: on every climb of the gym's bot run, each hand takes
   hold within 5 cm of the ledge's top. It is red by arithmetic today (hands 0.23 to 0.43 m off), not run.
5. Clocks that must agree with the sim: landing (thump on counts.landings), climb grab, ladder rungs (audio taps at
   2.2/s against about 8.7 picture grips/s), and chaser links (no catch on a link; a crawler catches along a ladder).

Marks: [read] I opened it (local path:line; outside source by URL and section); [summary] secondary or another swarm
file; [inferred] mine; [ours] a proposal. Game code at dreamzone-3 main **31d1c6d** unless a branch is named (`git log
-1`: "Merge a-d673-overtime") [read]. Record paths are relative to `C:/Users/nname/Desktop/lighthouse/exo_memory`.
Ground files are cited as `G-words`, `G-sources`, `G-physics`, `G-loco`, `G-code`, `G-roster` (the six files in this
folder: ground_his_words, _sources_read, _physics_and_fp_body, _locomotion_and_yardstick, _code, _constraints_and_roster).
Nothing was built or run. No game tool, test or build was started.

## 1. What the room already has for this aspect

His words (verbatim lines are in G-words; brief = `briefs/dreamzone2_the_game.md`):
- The move set includes climbing, with parkour "a way to evade in the rare circumstance" (item 7) [read] G-words:41-46.
- "they should traverse the world without clipping on anything" (item 17) [read] G-words:78-81.
- Hands on walls, procedural and environment-aware (27, 159, `player_body-5`) [read] G-words:109-118, :353-359, :584-587.
- "agility, it allows you to climb faster" (41) [read] G-words:159-162.
- His pick: "the climb uses Overgrowth's grips (procedural; no clips)" (155, the brief's record, not his verbatim
  words) [read] G-words:331-335; brief:1113 [read].
- Physics owns "the body's reactions ... with hands on walls, landings and hits (K2)" (162, the brief's record) [read]
  G-words:369-373.
- "Only crawler and pack" climb. His note: the hunter "will be like fuck, and run into the shadows away, waiting for you
  to come down" (`chase_entities-5`) [read] brief:1266-1268.
- `movement-2`, his note: "Also jumping or mantling over objects" [read] G-words:591-592.

Built (main 31d1c6d):
- The player's Body has Climb, Ladder, Vault, Air and Roll moves, blended about 0.05 s apart [read] G-physics:103-106.
  The climb grip is guessed at eye +0.12 m because "state has no ledge height" [read] G-physics:249-250. I read it at
  source: `game/body.cpp:199-200`, "eye + ahead * 0.32f + Vec3{0.0f, 0.12f, 0.0f}" [read].
- `HandOverride` exists and nothing calls it [read] G-physics:122-123. A floor probe through `sim::World::raycast` is
  outside the fingerprint [read] G-physics:103 and G-roster:39-40.
- The hunter is posed by run/stand only. `Gait` Ladder, Drop, Climb and Recover are "not posed (only on_feet in
  DrawnChaser)" [read] G-code:63. Only the first Hunter has a model; the rest are boxes [read] G-code:38-39,
  G-roster:107-117.
- The hunter's stride phase advances by frame time, so it is not replayable [read] G-code:34-36.
- Picture-only is enforced by the self-test's part 7 and by his 16 kept runs compared byte for byte [read] G-roster:46-54.

Researched:
- Overgrowth `ledgegrab.as` was read by L176 (grips, sine arc, weight valley, per-hand probe, `:29-111`, `:197-215`,
  `:248-293`) [read] G-sources:29-31; `handback/p-l176-openanim-C_2026-11-12.md:43-47`, `:63-68` [read]. The climb by grips
  was planned as step 8 of L180 [read] `loop/plan_l180_animation_from_the_sources_2026-11-12.md:58-62`. It was never built
  [inferred, from the grip guess still on main].
- Valve's "nearest captured climb by height" needs clips and is out [read] G-sources:115, :125.
- The buildpath's lap 5 plans a wall probe and to "replace the vault and climb grip guesses" [read]
  `loop/buildpath_player_body_2026-11-13.md:84`.
- The yardstick cannot score a climb, vault, slide, roll or wall contact [read] G-loco:217.

Where the ground files are thin, and what I read myself: no ground file covers landing biomechanics, ladder timing, the
chasers' link timing, the chute, the audio clocks or the camera's landing dip. All of section 2's "game code" facts below
are my own reads.

## 2. What I read at source that is NEW

### 2a. The game's own traversal facts (read today; none of these are in the ground files)

- The sim's ledge finder: an upright blade sweep, then a ray down for the top (normal y >= 0.7), then a ray just under the
  top for the face (|normal y| <= 0.3) [read] `sim/world.cpp:296-326`. The result (`top_y`, `face_point`, `into`) is used
  for the mantle and dropped: `PlayerState` has no ledge field [read] `sim/world.h:56-70`.
- Mantle: 0.35 s, scripted, straight up to `top_y + 0.05` then forward to `top_y + 0.02` [read] `sim/params.h:91`,
  `sim/world.cpp:381-391`. Reach: 2.2 m from the ground [read] `sim/params.h:88`. Vault: up to 1.1 m in 0.2 s [read]
  `:82`, `:84`.
- Landing: fall = peak height minus landing height. Over `safe_fall_height` 6.0 m it is a stagger (0.4 s, 20% of speed
  kept) unless crouch was pressed within 0.15 s, which makes a roll [read] `sim/world.cpp:254-281`, `sim/params.h:117-122`.
- Gravity: rise 2·1.2/0.32² = 23.4 m/s², fall ×1.6 = 37.5 m/s² [read] `sim/params.h:59-61`, `:142-145` (arithmetic
  [inferred]). A 1 m fall lands at 8.7 m/s, which in real gravity would be a 3.8 m fall [inferred].
- Ladders: 2.6 m/s up, 3.4 m/s down [read] `sim/params.h:124-125`. The generator's ladder is "one flat board, 0.5 m wide":
  "with separate stiles and rungs the controller's body was thrown about" [read] `gen/src/emit.cpp:535-541`. The body
  times its hands to rungs every 0.30 m [read] `game/body.cpp:21-22`, `:205`.
- Today's ladder hands: `neck + up * (0.22 + 0.14 * sin(phase))`, with the phase advancing π per 0.30 m climbed [read]
  `game/body.cpp:205`, `:398-401`. The hand therefore rides the neck. At 2.6 m/s its world speed swings between about −1.2
  and +6.4 m/s, so it is never still on the ladder [inferred].
- Chasers on links: a ladder waits `ladder_mount_s` and then lerps; a climb rises over `climb_s` and then goes across; a
  drop follows y = t² over `drop_s` whatever its height, then stands for `drop_recover_s` [read]
  `chase/chaser.cpp:60-122`. Defaults: ladder 2.0 m/s after 0.8 s, drop 0.9 s ("a one-storey drop"), recover 0.7 s,
  climb 1.4 s [read] `chase/archetype.h:50-54`. Crawler: ladder 2.4 m/s after 0.4 s [read] `chase/archetype.cpp:152-153`.
- Who may traverse: the hunter takes ladders and drops [read] `chase/archetype.cpp:20`. The crawler alone may climb
  ledges [read] `:157`. The pack may walk and drop only [read] `:99`.
  His pick "Only crawler and pack" (brief:1266) therefore disagrees with the code, which does not let the pack climb
  [inferred]. I leave that disagreement standing.
- Catches: no chaser catches while on a Ladder, Drop or Climb link. A crawler catches along a ladder whatever the height
  between them [read] `chase/run.cpp:555-559`.
- `ChaserPose` carries the gait but not the link's progress [read] `game/world/world_app.h:79-95`. On a link the speed is
  set to 0 [read] `chase/chaser.cpp:66`, so the drawn hunter stands still and slides up the ladder or down the drop
  [inferred, from `game/world/stage.cpp:269-278`].
- Chutes: on branch `gen-lap2-kit` (151aead), not on main. "a one-way fall down a junction column ... seven at most";
  "proved by the controller as a drop" [read] `git show 151aead` message. One storey is 3.5 m [read]
  `gen/src/gen.h:25`. A three-storey chute is a 10.5 m fall, above the 6 m safe fall, so it needs a roll [inferred].
- Doors: doorways are openings 0.9 m × 2.05 m [read] `gen/src/gen.h:45`. The wooden door is a "false door", "for show
  only" [read] brief:1094-1095. No door opens, so there is no door to animate [inferred].
- Sound clocks:
  - The player's landing thump fires when `landings` rises, a sim count [read] `game/world/sound.cpp:152`,
    `audio/mixer.cpp:1327`.
  - Rung taps run on the mixer's own clock at 2.2 a second [read] `audio/mixer.cpp:602-623`.
  - Chaser steps follow speed (hunter: 0.9 + 0.16 per m/s, capped at 2.6/s) [read] `audio/mixer.cpp:50-61`, and ~~fall
    silent at speed 0, which includes every link [inferred]~~ [2nd reader: WRONG. At speed 0 the rate is 0.9 + 0 = 0.9 a
    second (mixer.cpp:1276, clamped 0.8 to 2.6; the hunter row is :59, not :60) and the level is scaled by
    `moving_share(0)` = 0.05 (mixer.cpp:73, :1269). The steps go on at about 5% gain, about -26 dB, not silent.]
- The camera already dips on landing: 0.008 m per m/s above 5 m/s, at most 0.10 m, lowest at 0.07 s [read]
  `game/settings.h:45-48`, `game/camera.cpp:131-142`. The player's body hangs from the eye [read] G-code:59, so the eye's
  dip is the only way the player's landing can show depth [inferred]. [2nd reader: UNSUPPORTED. The legs are seen when he
  looks down (his item 159, G-words:353-359) and are built from the eye with a hip sink of up to 12 cm already
  (G-physics:104-105); the knees can bend under the eye on a landing and the camera need not move. The design leaves the
  seen legs out, and gives no pose for a stagger (no `BodyMove` for it, body.h:50), which the sim makes above 6 m.]

### 2b. Overgrowth, `Data/Scripts/ledgegrab.as` and `aschar.as` (WolfireGames/overgrowth, main 245fe48)

Fetched raw with curl into my scratchpad. ledgegrab.as: sha256 26daea70…, 1091 lines. aschar.as: sha256 e01189e6…
[read]. The L176 items in section 1 are not repeated here. These are new:

- **Limb timeline.** One timer per body cycles 0 to 1. Left hand moves in [0, 0.4], right hand in [0.5, 0.9], left foot in
  [0.1, 0.5], right foot in [0.6, 1.0]. Hands arc ~~0.1 m~~ up while moving; feet arc ~~0.1 m~~ away from the wall [2nd reader: DOWNGRADED. The 0.1 is a vector
  length that :111 multiplies by sin(pi p) and by distance(start, end): a 0.3 m hand move arcs 3 cm. :244-245 add the foot
  arcs to the HANDS and :239-240 never apply them to the feet. RE-DERIVED: phases 0 / 0.5 / 0.1 / 0.6, arcs, sin valley
  and weighted mean are already at loop/plan_l180_animation_from_the_sources_2026-11-12.md:59-62 (it cites :139-145) and
  handback/p-l176-openanim-C_2026-11-12.md:43-47. Only the window length 0.4 is new.] [read]
  `ledgegrab.as:139-144`. So each foot follows its own side's hand by 0.1 of a cycle [inferred].
- **Cycle rate.** The timer runs at clamp(3·|v_horizontal|, 1, 3) cycles a second [read] `:164-171`. A grip's target
  leads the body by its velocity × 0.1 s [read] `:62-67`.
- **Sound at the grip.** A hand plays "edge_crawl" where it lands when it has moved more than 0.1 m [read] `:73-79`.
  The grab plays an impact sound scaled by the speed into the ledge, plus "edge_grab" [read] `:796-797`, `:806`. The
  sound is tied to the moment of contact, not to a free-running clock [inferred].
- **Reach into the hold.** On the grab, the limbs and the camera blend from where they were to the grip at
  `transition_speed = 10 / (|ledge_height − y| + 0.05)` per second [read] `:785-787`, `:850-853`. That is 0.1 s per metre
  of height, plus 5 ms [inferred]. [2nd reader: OK as arithmetic. But :850-853 advance one
  `transition_progress` that blends the WHOLE body offset and every limb from the grab origin (:289-293), and the height is
  character origin to ledge (:787), not hand to hold. It is a blend for a hang, with no per-hand reach in it; using it as
  "the hands' reach into a hold" is [ours].]
- **Grab reach.** A ledge is in reach 1.0 m above the body origin. If the body is rising slower than 1.5 m/s the reach
  grows by 1.5 m, or by 0.5 m if falling, and that is the "scramble grab" [read] `:518-538`. The scramble and the
  climb-up are keyed clips (`r_ledge_barely_reach.anm`, `r_ledge_climb_fast.anm`) [read] `:776`, `:988`. Only the hang
  and the shimmy are procedural [inferred].
- **Hand probe detail.** The sweep starts 0.1 m into the ledge and runs down-and-in with a 0.05 m sphere. The kept grip is
  ~~0.15 m below the contact~~ [2nd reader: WRONG in part. The live hand offset is 0.10 m below the contact (:206, :220);
  0.15 m is only the remembered fallback (:204, :218). The hand hangs BELOW the top, which a 5 cm row on `top_y` ignores.] [read] `:198-206`. The hands' change is low-passed 0.8 a frame [read] `:229-235`.
- **Source quirk:** `:244-245` add the FEET's arc offsets to the HAND offsets (`offset[0] += foot_pos[0].GetOffset()`)
  [read]. That looks like a slip in the source [inferred]. Do not copy it.
- **Landing in Overgrowth does not scale with the fall.** `float land_speed = 10.0f;  // min(30.0f, max(10.0f, -vel.y));`
  [read] `aschar.as:8398`. The crouch ("duck") is set full and kicked at 3 /s [read] `:8429-8431`. It is then a spring:
  acceleration 120, velocity × 0.89 a frame [read] `aschar.as:9225-9230`. So the open indie source gives the SHAPE of the
  return to standing, and the measured studies below must give the DEPTH by height [inferred].
- **Licence.** Apache-2.0 for the code [read] `ledgegrab.as:9-21`, and README: "Only the code is available here; the game
  data (such as art assets and levels) can only be legally obtained by purchasing" [read] README.md:2. Licence text read:
  https://github.com/WolfireGames/overgrowth/blob/main/LICENSE, §2 grant, §4 redistribution (a) give a copy, (b) mark
  modified files, (d) carry NOTICE [read] LICENSE:66, :89-106. Commercial use: allowed. Attribution: keep the licence and
  notices with any code taken; no share-alike; redistribution allowed. The animations (.anm) are NOT open.
  I propose to USE THE IDEA restated in our own C++, as the room did with the tilt, and to credit it in CREDITS.md
  regardless [ours].

### 2c. A published method for hand and foot holds on arbitrary geometry: Kalisiak & van de Panne 2001
[2nd reader: DOWNGRADED. The PDF gives no way to FIND holds: they are "designated manually, or through an automatic
process" and the process is not described (page 4, the paragraph "Grasp points are a fundamental concept"). It supplies the hold TYPES and per-limb
smoothing only. The aspect's "method for holds on arbitrary geometry" is therefore still unsourced here: 3c's rays are [ours].
The journal name and pages are not in the PDF I read; I could not check them.]

"A Grasp-based Motion Planning Algorithm for Character Animation", J. Visualization and Computer Animation 12(3):117-129.
Author's copy: https://www.dgp.toronto.edu/~mac/pubs/jvca2001-kalisiak.pdf, read whole with pdftotext. I cite by section.
- Holds are "an enumerated set of points of the environment", "designated manually, or through an automatic process". They
  come in three types: load-bearing (a foothold), pendent (a handhold), and hybrid (either) [read] §3, the paragraph
  beginning "Grasp points are a fundamental concept".
- A limb acquires a hold "when a hand or foot is sufficiently close" and releases it when it is "no longer needed to support
  the character's motion". Done alone, that is "largely unnatural, resembling ... a shaky-yet-nimble contortionist"; a
  mode state machine and heuristics fix it [read] §3.4.
- Smoothing is applied per limb between the "key" points where that limb's grasp changes, with IK holding grasps, so "the
  motion of a limb exhibits the desired anticipation in leaving one grasp point and approaching another" [read] §3.5,
  Fig. 9 caption.
- Cost: "10–15 minutes" for about 1400 frames on a 266 MHz machine; 2D only [read] §4, §5.
- Licence: an author's copy of a Wiley/ACM-era paper; no open licence stated. Use the idea only (typed holds, per-limb
  keys at grasp changes); no code or data [read the PDF; no licence page exists to read].

### 2d. Landing from a drop, measured by height

- **Verniba, Vescovi, Hood, Gage 2017**, Sports Medicine – Open 3:6, doi 10.1186/s40798-016-0072-x, PMC5243232. I read the
  full text via Europe PMC XML. Twenty males stepped off 22 cm and 44 cm boxes onto two plates, hands laced over the
  abdomen [read] Methods, "All trials were initiated...". Peak knee flexion, mean (SE) [read] Table 2:
  - 22 cm: soft 75.49 (2.39)°, natural 51.31 (2.75)°, stiff 45.17 (1.95)°.
  - 44 cm: soft 87.71 (2.70)°, natural 67.26 (2.88)°, stiff 59.17 (1.71)°.
  - Licence: CC BY 4.0 [read] the article's licence line. Commercial use: allowed, with attribution; no share-alike.
    These are numbers used as constants, not shipped data [ours].
- **Zhang, Bates, Dufek 2000**, Med Sci Sports Exerc 32(4), PMID 10776901. **Abstract only (paywall).** Step-offs from
  0.32, 0.62 and 1.03 m (2.5, 3.5, 4.5 m/s). Knee eccentric work was 1.21 / 1.63 / 2.26 J/kg, and hip 0.94 / 1.31 /
  2.15 J/kg. "a shift from ankle to hip strategy was observed as landing height increased" [summary] (Europe PMC abstract).
- **Puddle & Maulder 2013**, J Sports Sci Med 12:122-129, PMC3761764. Full text read from the PMC page. Ten traceurs
  dropped from 0.75 m [read] Methods. Peak force: precision 3.2, roll 2.9, traditional 5.2 BW. Time to peak force: 0.077,
  0.080 and 0.044 s [read] Table 2. The roll is used "when landing from height (especially when higher than the
  individual's height)" [read] Introduction. Licence: "© Journal of Sports Science and Medicine", no open licence shown
  [read]. Cite figures only.
- **Not used:** Duan et al. 2025 (PMC12124505, CC BY) is single-leg, 30/45 cm, kinetics only, with no angles by height
  [read] Abstract. Liu et al. 2026 (PMC13581516, CC BY) uses 40/80 cm but gives no angle table [read] §2.2.

## 3. The design

### 3a. One idea, three uses [ours, from 2b-2d]

A **hold** is a point on the world with a type (hand, foot, either) and a surface normal, found by the sim's own rays.
A **grip** is one limb's trip between holds on a shared cycle (Overgrowth's timeline). A **landing** is a spring that
takes the legs down by the fall's height and lets them back up. The body's root never leaves the sim's position. The
layer only moves limbs and the trunk around it, so replays cannot change.

### 3b. Inputs and outputs [ours]

| user | inputs (all read-only sim state) | outputs |
|---|---|---|
| player (Body) | `PlayerState` before/after: state, position, velocity, `counts.landings`, `counts.mantles`, `ladder_normal`; the ladder's box (`sim::World::ladders()`, world.h:110); a picture probe through `sim::World::raycast` | hand and foot targets into `Targets` (body.cpp `pose`) and the existing `HandOverride` |
| chaser (hunter now, others with models) | `ChaserPose` plus 3 new read-only fields: link progress `t` 0..1, link from/to, mount share (copied from `Chaser` in `gather_poses`, world_app.cpp:528-537) | limb targets for a new `climb_pose` beside `gait_pose` (model_rig.cpp), the same `BodyPose` and `Rig` |
| box chasers | the same | nothing until they have models (G-roster:107-117) |

Where it sits:
- A small `game/grip.{h,cpp}` holds `Grip` (Overgrowth's timeline, arc and valley) and `Landing` (the spring) [ours].
- `Body::tick` / `Body::pose` call it for the Climb, Vault, Ladder and landing (body.cpp:189-214, :362-404).
- `WorldStage::place_figures` calls `climb_pose` when `p.gait != Mesh` (stage.cpp:267-281).

### 3c. Holds from the world's own geometry

- **Ledge (player climb and vault)**, at the tick the move starts (`body.cpp:193`). For each hand, at ±0.20 m (today's
  spacing, body.cpp:201-202):
  - one ray down a column from the reach's top to find `top_y`, and one ray along `into` just under it to find the face.
    These are the same two rays as the sim's (world.cpp:307-317), cast through `raycast`, which is outside the
    fingerprint [ours, mechanism read].
  - The grip sits ~~0.10 m in from the face (ledgegrab.as:198) on the top surface~~ [2nd reader: WRONG as sourced.
    :198 only moves the probe's START 0.1 m along `ledge_dir` from the hand's own IK point; the grip is wherever the
    0.05 m sphere touches, less 0.10 m in y (:204-206). No source gives a 0.10 m inset. It is [ours], and the hand
    wrist/palm point the row measures is not stated.].
  - When a ray misses, keep the last grip (ledgegrab.as:207-210), and if there is none use today's guess.
- **Ladder rungs (player and chasers):** virtual rungs every 0.30 m up from the ladder box's bottom (body.cpp:21;
  `LadderBox.lo`, sim/piece.h:21-23), on the board's plane. No ray is needed [ours].
- **Chaser ledge (crawler's Climb link):** the hold is the link's top point `link_to`; the face is `link_from` → `link_to`
  in the flat [ours].
- **Typed holds (Kalisiak §3):** hands take ledge tops and rungs, feet take rungs and the wall face. On a ledge, a foot
  hold is the face 0.4-0.9 m below the top: one ray, ours, and only for the crawler and the hunter, whose feet are seen.

### 3d. How hands and feet move between holds

- **Timeline (all bodies):** Overgrowth's windows; hands at 0.0 and 0.5, feet 0.1 behind their hand, each moving 0.4 of a
  cycle (ledgegrab.as:141-144). [2nd reader: RE-DERIVED (plan_l180...:59-60). DOWNGRADED for a ladder: this is Overgrowth's
  sideways SHIMMY and pairs each hand with its SAME-side foot (left hand 0-0.4, left foot 0.1-0.5). Today's ladder pairs
  hand_l with foot_r, a diagonal (body.cpp:400-403). No ladder source was read (the scout says so); the swap from diagonal to
  same-side has no source and is not marked [ours].]
- **Arcs:** hands +0.1 m up and feet 0.1 m off the wall, × sin(πp) × distance (:109-112, :141-144).
- **Weight:** a held limb weighs 1 and a moving limb weighs (1 − sin πp)² (:85-95). The trunk sits at the weighted mean
  of the grips, flattened against the wall (:247-262), within 0.4 m of each grip (:276-282).
- **Rate:**
  - Player on a ladder: one hand per rung pair. Cycles a second = climb speed / (2 × 0.30 m); at 2.6 m/s that is 4.3
    cycles a second [ours, from the sim's speed and the 0.30 m grid].
  - Hunter on a ladder: the same law at its 2.0 m/s.
  - Crawler (his T4, "stride rate nearly fixed; speed from length", G-loco:158): a fixed cycle rate. The reach per move
    then grows with speed. This one difference is its uncanny cue on a wall [ours, T4 restated]. [2nd reader: it cannot
    show on a ladder. Both link speeds are constants (hunter 2.0, crawler 2.4 m/s, chase/archetype.h:50, archetype.cpp:152)
    and the rung pitch is fixed, so "fixed rate" and "speed-scaled rate" give one rate each; the row would pass with no
    difference drawn. The T4 source is Full & Tu 1991, an insect running paper, abstract only (G-loco:158), and G-loco's
    H187:159 says T4 "is close to human sprinting" and may read as ordinary.]
- **Reach into the first hold:** 0.1 s per metre of height plus 5 ms (ledgegrab.as:787). On a 0.35 s mantle a 1 m reach
  takes 0.105 s [inferred].
- **Per-limb anticipation (Kalisiak §3.5):** each limb's motion is keyed only at its own grasp changes. No limb's motion
  starts before its own window [ours].

### 3e. What a landing looks like, by drop height

The fall height h is computed from the sim. h = v_y² / (2 × 37.5) from the velocity before landing; this equals the sim's
peak-to-landing fall while the fall is ballistic and below the 45 m/s terminal speed [inferred from sim/params.h:61-63].
For a chaser, h is `link_from.y − link_to.y`.

| quantity | value | source |
|---|---|---|
| knee peak at h = 0.22 m | 51.3° (natural) | Verniba 2017 Table 2 [read] |
| knee peak at h = 0.44 m | 67.3° | same [read] |
| slope between | ~~72.7°~~ 72.5° per metre [2nd reader: (67.26-51.31)/0.22 = 72.5] | arithmetic [inferred] |
| cap | 87.7° (the deepest measured: soft, 44 cm) | same [read] [2nd reader: DOWNGRADED. It is the SOFT-instruction value at 44 cm, a different condition from the "natural" curve it caps. The law hits it at 0.72 m and holds it flat to 6 m, and a storey is 3.5 m: no source read lands from above 1.03 m (Zhang, abstract only, work not angles). The 0.22 and 0.44 m points are two heights of one study of 20 males.] |
| hip share | grows with h, ankle share falls | Zhang 2000, abstract only [summary] |
| return to standing | Overgrowth's duck spring: acceleration 120, velocity × 0.89 a frame at 120 Hz | aschar.as:9226-9230 [read] [2nd reader: DOWNGRADED. "120 Hz" is not in the cited lines; it follows from `* 120.0f / ts.frames()` at :7925 [inferred]. The duck is full only in the branch `dot(-v, ground_normal) > 0.3` (:8401, :8429-8431), else "land_soft" with none (:8432-8438).] |
| over 6 m | the sim's stagger or roll (existing Roll pose) | sim/params.h:117-122 [read] |

- Law [ours]: knee peak = clamp(51.3 + ~~72.7~~ 72.5·(h − 0.22), 0, 87.7) degrees. [2nd reader: the lower clamp never acts
  above h = -0.48 m; at h = 0.02 m (a stair) the law gives 36.8 degrees of knee. Needs a floor from a source or an [ours]
  fade-in.] The hip takes its flexion in proportion, from
  Zhang's work ratio (hip/knee 0.78, 0.80 and 0.95 at 0.32, 0.62 and 1.03 m [inferred from the summary]) [2nd reader:
  arithmetic OK (0.94/1.21, 1.31/1.63, 2.15/2.26). Joint WORK ratios are not joint ANGLE ratios: [ours], no source].
- Under the game's 37.5 m/s² fall gravity a full jump lands at h = 1.2 m (the jump apex, params.h:59), so the law caps.
  For landings with speed along the ground I fade the law out between walk and sprint speed [ours]. No running-landing
  study was read, so this is the weakest step.
- **Player, first person:** the depth reaches the picture only through the camera dip (settings.h:45-48), because the
  body hangs from the eye. Today's cap of 0.10 m is shallower than the measured flexion implies. Equal thigh and shin
  (0.46 / 0.45 m, body.h) at a 67° knee drop the hip about 0.15 m [inferred]. [2nd reader: DOWNGRADED. It holds only if the
  shin leans about 25 degrees forward (my arithmetic: hip height = 0.45 cos s + 0.46 cos(67 - s), against 0.91 standing: s = 25
  gives a 0.16 m drop, s = 0 gives 0.28 m). The shin angle is in no source read, and the drop is not given as a range.] Whether to deepen the dip is his call (§5).
  Peak force came at 0.044-0.080 s (Puddle Table 2), and the dip's lowest point is 0.07 s; I leave the 0.07 s alone.
  [2nd reader: the numbers are right (Table 2), the comparison is not: time to peak FORCE is not time to the lowest HIP.
  Peak knee flexion comes after peak force, and no timing of it was read. The 0.07 s match is [inferred] and weak.]
- **Hunter (third person):** the law applies directly at the end of a Drop link. The return must finish inside
  `drop_recover_s` 0.7 s, when the sim moves it again (chaser.cpp:118-121).

### 3f. A chaser's climb against the player's

| | player | hunter | crawler | pack |
|---|---|---|---|---|
| ladder | sim scripted, 2.6 / 3.4 m/s | link, mount 0.8 s, 2.0 m/s | link, mount 0.4 s, 2.4 m/s | may not (archetype.cpp:99) |
| ledge | mantle 0.35 s, probe holds | may not | Climb link 1.4 s up, then over | may not |
| drop | ballistic, landing law, roll over 6 m | t² over 0.9 s, landing law, 0.7 s recover | same | same |
| cycle rate | speed-scaled | speed-scaled | fixed (T4) | — |
| seen | first person: hands, the knee in a mantle | full body | full body when modelled | — |

- The mount time is where the chaser's hands reach the first rungs, using the reach rule above [ours].
- The hunter's T1 cue (greyhound cornering) does not touch traversal (G-words:413-418), so its climb stays humanlike
  [inferred].

### 3g. What must agree with the simulation's timing

1. **Landing:** the thump fires on `counts.landings` (sound.cpp:152). The body's absorption starts on that same tick,
   read from the same count, never from frame time [ours].
2. **Climb grab:** the hands reach the ledge before the eye passes its top. The mantle is 0.35 s, and the reach takes
   about 0.1 s per metre (above). A grab sound, if one is added, keys to `counts.mantles` [ours], as Overgrowth keys its
   sounds to the grab (2b).
3. **Ladder rungs:** the picture's phase is a pure function of height above the ladder's bottom. The mixer's own 2.2/s
   clock disagrees with it: at 2.6 m/s the hands catch about 8.7 times a second [inferred]. Either the taps are driven
   from the grip events, or both read one rung clock. That is a sound change, so it goes to the sound scout or lane.
4. **Chaser links:** there is no catch on a link, and the crawler catches along a ladder (run.cpp:555-559). The drawn
   root never leaves the sim position. At the crawler's catch tick its near hand already reaches toward the player [ours]. [2nd reader: run.cpp:555-559 reads
   as follows. A chaser ON a Ladder, Drop or Climb link is skipped (:555-557). `along_ladder` (:559) is a crawler on the
   MESH, at the ladder's foot, catching a player on the ladder at any height inside `catch_reach` flat (:560). So the
   catching crawler is standing, not climbing, and the player may be 3 m above it: a "near hand reaches" cue would have to
   reach 3 m. Not addressed, and no source. The Stalker also takes ladders and drops (archetype.cpp:130), omitted in 3f.]
5. **Clock rule:** link progress comes from the sim tick (`link_tick`). It must not be advanced by frame time, as the
   hunter's stride is today (stage.cpp:269), so two machines draw the same replay alike [ours].
6. **Outside this aspect:** the hunter's footstep clock (0.9 + 0.16 per m/s, capped at 2.6/s, mixer.cpp:60) is not its
   drawn stride. That belongs to the locomotion or sound scout.

### 3h. Parameters (few, each sourced or marked)

| # | parameter | default | source |
|---|---|---|---|
| 1 | grip inset from the face | 0.10 m | ~~ledgegrab.as:198 [read]~~ [2nd reader: [ours]; :198 is a probe start, see 3c] |
| 2 | reach rate into a hold | 0.1 s per metre + 5 ms | ledgegrab.as:787 [read] |
| 3 | limb windows | hands 0-0.4 and 0.5-0.9; feet +0.1 | ledgegrab.as:141-144 [read] |
| 4 | arc heights | 0.1 × distance | ledgegrab.as:109-112, :141-144 [read] |
| 5 | rung pitch | 0.30 m | body.cpp:21 (the room's; texture not checked) [read] [2nd reader: RE-DERIVED, G-code:168 holds kRungSpacing 0.30 (the constant is body.cpp:22). The ladder is "one flat board" with NO rungs (emit.cpp:536-539, gen/README.md:161), so hands closing on virtual rungs grip nothing the eye can see unless the texture has them; unchecked.] |
| 6 | knee law | 51.3° at 0.22 m, 72.7°/m, cap 87.7° | Verniba 2017 Table 2 [read] |
| 7 | return spring | 120, 0.89 a frame at 120 Hz | aschar.as:9226-9227 [read] |
| 8 | crawler cycle rate | one fixed value | T4 shape (G-loco:158); the number is [ours], for his eye |

### 3i. Cost per character per frame

- The grip layer is 4 limbs × (1 sin, a lerp, a weight) plus a weighted mean. Two-bone IK already runs for 4 limbs
  (G-code:247-249).
- Holds cost 4 rays at the START of a player climb or vault, not per frame. The ladder and the chaser links need no rays.
- The landing is one spring.
- [inferred] Well under 1 µs per body per frame plus a few µs per climb start. That is below any measurable share of
  3.33 ms. Not measured: no frame cost exists anywhere in the record (G-physics:259; G-roster:202).

## 4. The first lap

**The player's climb grip from the ledge itself.** It is the smallest piece. It is seen in first person on every climb,
it needs no new per-frame probe, and it is the grip half of the buildpath's lap 5
(`loop/buildpath_player_body_2026-11-13.md:84`). Tier: "check it", plus the existing replay rows as the guard.

- Touches:
  - `game/body.h`: a `LedgeProbe` beside `FloorProbe` (:87). A down-ray and a forward-ray, each returning a distance.
  - `game/body.cpp`: replace the guess at :193-203 with the two probes per hand, the 0.10 m inset and the reach rate.
  - `game/world/world_app.cpp`: wire the probe like the floor probe, :114-128.
  - `game/session.cpp`: wire the same probe to the gym's world, which has none today (grep: no `set_floor_probe` under
    `game/` outside world_app and one test).
  - `game/tests/body_tests.cpp`: the row.
- **Row (red today, green after):**
  `on_every_climb_of_the_gym_run_each_hand_takes_hold_on_the_ledges_top_within_5_cm`.
  - Run: `Session(course())` with `bot_record()`, as the existing row at body_tests.cpp:331-357 does.
  - The ledge's truth comes from the sim's own result, never the probe under test: `top_y` = the feet's height at the
    mantle's last tick − 0.02 (world.cpp:382).
  - [2nd reader, how the row passes without doing its job: (a) it checks ONE moment, so a hand that snaps to the top at that
    moment and flies elsewhere or pops in 1 tick passes (only the older row at :331 checks it stays, and with 0.02 m); (b)
    the arm's target is the WRIST (body.cpp:533-539, hand_target) and the hand is 0.20 m long (body.h:80), so the palm
    midpoint sits about 0.1 m from the target and the row may be red after a right fix; (c) the gym's 7 ledges are flat boxes
    with the face square to the bot, at 1.5, 2.0 and 2.2 m, so a table of per-height offsets from the eye passes with no probe. No row says the hand is on the
    surface rather than inside it. This lap is also RE-DERIVED as to its aim: loop/buildpath_player_body_2026-11-13.md:84,
    lap 5, already plans the same probe beside the floor probe and "replace the vault and climb grip guesses".]
  - Check: when the reach has had (|Δh| + 0.05)/10 s, each palm (the midpoint of Wrist and Hand) is within 5 cm of
    `top_y` and 0 to 0.20 m in from the face.
  - Climbs on that run: ledges of 2.0 (dead end), 1.5, 2.0, 2.2 m and three tower tiers of 2.0 m (sim/gym.cpp:72-111,
    :189-194) [read].
- **Why red today [inferred, not run]:** the grip is the eye + 0.12 m = feet + 1.77 m (body.cpp:200, eye 1.65 m
  params.h:29). On a climb that starts near the floor, the hand is about 0.27 m above a 1.5 m ledge and 0.23-0.43 m below
  2.0-2.2 m ledges. It is also 0.32 m ahead of the eye while the face is about 0.55 m ahead (body radius 0.35 m + the
  probe distance). Every climb misses by well over 5 cm. The exact misses depend on the jump height at the climb's
  start, which I did not run.
- **Guards that must stay green:**
  - `on_a_climb_the_hands_hold_the_ledge_while_the_body_rises` (:331).
  - `the_camera_moves_exactly_as_it_did_without_a_body_over_the_whole_gym_run` (:108).
  - app_tests `playing_back_the_bots_record_through_the_loop_gives_the_simulations_fingerprint` (app_tests.cpp:451).
- **He looks:** one first-person clip of the gym's three mantles, at full frame rate and lit (the ruling at
  brief:1606), and nothing older as "before".

Laps after it, in order [ours]:
1. Ladder grips: player, then hunter, with `ChaserPose` link fields.
2. The landing law: hunter drop, then the player's dip, after his call.
3. The crawler's climb, when it has a model.
4. The rung clock shared with sound.

## 5. What only the owner's eye can decide, and the fewest clips

1. **Climb hands (one clip):** the three gym mantles in first person, today beside the probe grips. Does "hands on the
   ledge" read, and is the 0.1 s/m reach too quick to see?
2. **Landing depth (one clip, two variants):** player drops of 0.5 m, a full jump and one storey, with (a) today's camera
   dip (max 0.10 m) and (b) the dip set to the pelvis drop the knee law implies. Plus the hunter coming off a one-storey
   drop from the look-behind. He decides the dip, and whether the cap of 87.7° looks right for a monster.
3. **Ladder rhythm (one clip, two variants):** the hunter on a ladder from below with the speed-scaled cycle, and the
   crawler stand-in with a fixed rhythm. He decides whether the crawler's fixed rhythm is creepy or just mechanical.
4. **Roll threshold (no clip; a word):** the sim rolls only above 6 m. The traceurs' rule is "higher than the
   individual's height" (Puddle 2013). Changing it is a sim change, his call.
5. **Pack and climbing:** his pick says the pack climbs; the code does not let it (archetype.cpp:99). Which one stands?

## 6. What I would NOT build, and why

- **The nearest captured climb by height (Valve) or any climb clip:** it needs clips, and his pick is "no clips"
  (G-sources:115; brief:1113).
- **Kalisiak's stochastic planner:** 10-15 minutes for 1400 frames, and 2D (§4, §5). Only its typed holds and its
  per-limb keys are taken.
- **A hang or shimmy on ledges:** the sim has no hanging state. Adding one changes the sim, which animation must never
  do. Overgrowth's climb-up is a closed clip anyway (ledgegrab.as:988).
- **Physical (ragdoll) climbing or landings for the player:** no player ragdoll exists, and K2 comes after L185 (G-physics:
  233-236). This layer gives K2 its targets later.
- **Collision rungs:** rungs made the controller jump "up to 2 m in one tick" (emit.cpp:536-539). Holds stay virtual.
- **Door-opening animation:** no door opens (brief:1094-1095). A hand on a jamb is the wall hand of lap 5.
- **Arms bracing on chute walls during the fall:** no source was read, and a 10.5 m fall at about 28 m/s gives little
  time to see it [inferred]. Keep the Air pose.
- **Landing depth from impact speed in real gravity:** under the game's 37.5 m/s² every landing would cap. Height is
  what the sim's own rules use (the 6 m safe fall).
- **Any change to sim timings** (mantle 0.35 s, ladder 2.6 m/s, drop_s): they are gameplay, and replays rest on them.

## What I did not open

- Zhang, Bates & Dufek 2000 past its abstract (paywall); DeVita & Skelly 1992 (the ">90° soft landing" was a search
  snippet only and is not used); any ladder-climbing gait study (none read, so the limb windows are Overgrowth's alone);
  any running-landing study.
- Naderi et al. 2017 (humanoid climbing) and every climbing talk (Assassin's Creed, Uncharted, Dying Light: none open).
- Overgrowth's `ledgegrab.as:624-760` (CheckLedges body beyond the grab block) and `:860-1088` (shimmy and climb-up
  movement), and `aschar.as` beyond the landing and duck lines cited.
- The game's `game/session.cpp`, `audio/mixer.cpp` beyond the lines cited, `chase/run.cpp` beyond :548-562,
  `gen-lap2-kit`'s chute code (only the commit message and gen.h fields), and the ladder's texture (for the 0.30 m pitch).
- The hand-backs behind the ground files (H161, H184, plan_l180) beyond the grepped lines; every worktree and branch
  other than 151aead's message.
- No test or tool was run, so every "red today" here is arithmetic, not a run.

## Second reader

Checked 2026-11-13 by the adversarial second reader. Primaries opened: game code at `git show main:` (31d1c6d; main still
reads as the scout's lines do; branch gen-lap2-kit 151aead message), the brief, the plan and the hand-back it cites, the six
ground files, Overgrowth `ledgegrab.as` and `aschar.as` (curl raw; sha256 26daea70 / e01189e6 match the scout's), LICENSE and
README of that repo, the Kalisiak PDF (pdftotext, whole), Verniba 2017 (Europe PMC XML), Zhang 2000 (Europe PMC abstract),
Puddle & Maulder 2013 (PMC page), Duan and Liu (Europe PMC records; Liu full text). Line numbers in the first column are the
scout's ORIGINAL line numbers in this file, before my insertions.

| line | claim | primary opened | verdict | evidence |
|---|---|---|---|---|
| 66-68 | find_ledge: blade, ray down, ray under top | world.cpp:296-326 | OK | the three casts and the 0.7 / 0.3 normal gates are there |
| 68-70 | no ledge field in PlayerState | world.h:56-70 | OK | fields listed; none for a ledge |
| 69-72 | mantle 0.35 s, 2.2 m reach, vault 1.1 m in 0.2 s | params.h:82-91, world.cpp:378-392 | OK | above = top+0.05, target = top+0.02 |
| 72-73 | stagger over 6 m, roll if crouch within 0.15 s | world.cpp:254-281, params.h:117-122 | OK | a dive also rolls (:259), not stated |
| 74-75 | gravity 23.4 / 37.5, 1 m lands at 8.7 m/s, 3.8 m real | params.h:59-61, :142-145 | OK | recomputed 23.44, 37.5, 8.66, 3.82 |
| 76-78 | ladder 2.6 / 3.4 m/s; "one flat board, 0.5 m wide" | params.h:124-125, emit.cpp:535-541 | OK | box 0.5 wide, 0.04 proud |
| 79-81 | ladder hand = neck + up*(0.22 + 0.14 sin); world speed -1.2 to +6.4 | body.cpp:205, :398-401 | OK | 0.14*pi/0.3*2.6 = 3.8, plus 2.6 |
| 82-85 | chaser link timings and defaults | chaser.cpp:60-122, archetype.h:50-54, archetype.cpp:152-153 | OK | y = t^2 over drop_s whatever the height |
| 86-89 | hunter ladder+drop; crawler alone climbs; pack walk+drop | archetype.cpp:20, :99, :157 | OK | pack/pick clash also stands in nav/README.md:138; Stalker omitted (:130) |
| 90-91 | no catch on a link; crawler catches along a ladder | run.cpp:548-562 | DOWNGRADED | true, but the catching crawler is on the mesh, not climbing (my note at 3g.4) |
| 92-94 | ChaserPose has no link progress; speed 0 on a link | world_app.h:79-95, chaser.cpp:66 | OK | `c.speed = 0` in start_link |
| 95-97 | chute on gen-lap2-kit 151aead, up to 7; storey 3.5 m | git show 151aead, gen.h:25 | OK | the commit prices "a fall and its stagger", not a roll |
| 98-99 | doorway 0.9 x 2.05 m; false door for show | gen.h:43-45, brief:1094-1095 | OK | comment says 0.9; its constants give 1.2 - 0.1 = 1.1 (not resolved) |
| 101-102 | landing thump on counts.landings | sound.cpp:152, mixer.cpp:1327 | OK | `scene.landings > landings` then steps.land() |
| 103 | rung taps 2.2 a second | mixer.cpp:600-623 | OK | `if (on_ladder) rate = 2.2f` |
| 104-105 | chaser steps "fall silent at speed 0" | mixer.cpp:50-61, :73, :1269-1276 | WRONG | rate 0.9, gain x0.05, not silent; hunter row is :59 |
| 106-108 | camera dip 0.008 per m/s over 5, max 0.10, lowest 0.07 s | settings.h:45-48, camera.cpp:131-142 | OK | "only way" the player's landing shows depth is UNSUPPORTED (legs are seen) |
| 112 | ledgegrab.as sha256 26daea70, 1091 lines; aschar e01189e6 | curl raw, sha256sum, wc | OK | main is 245fe48 (GitHub API) |
| 115-117 | limb windows 0-0.4, 0.5-0.9, 0.1-0.5, 0.6-1.0 | ledgegrab.as:139-144 | OK | RE-DERIVED for the phases (plan_l180:59-60); arc size DOWNGRADED (next row) |
| 116 | hands arc 0.1 m up, feet 0.1 m off the wall | ledgegrab.as:111, :141-145, :239-245 | DOWNGRADED | 0.1 x distance x sin; feet never get arcs, hands get both |
| 118-119 | timer clamp(3 v,1,3) cycles/s; target leads by v x 0.1 | ledgegrab.as:164-171, :62-67 | OK | comment says "sqrt", code is linear |
| 120-122 | edge_crawl at grip; impact + edge_grab at grab | ledgegrab.as:73-79, :796-797, :806 | OK | |
| 123-125 | transition_speed = 10/(abs(dh)+0.05) | ledgegrab.as:785-787, :850-853 | DOWNGRADED | arithmetic right; a whole-body blend for a hang, not a per-hand reach |
| 126-129 | grab reach 1.0, +1.5 slow rise, +0.5 falling; keyed clips | ledgegrab.as:518-538, :776, :988 | OK | |
| 130-131 | probe 0.1 in, 0.05 sphere, grip 0.15 below contact | ledgegrab.as:198-206 | WRONG | live offset is -0.10 (:206); 0.15 is the fallback memory (:204) |
| 131 | hand change low-passed 0.8 | ledgegrab.as:229-235 | OK | |
| 132-133 | :244-245 add foot arcs to hand offsets (a slip) | ledgegrab.as:239-245 | OK | and the feet never get their own arcs |
| 134-137 | landing does not scale; duck full, kick 3/s, spring 120, x0.89 | aschar.as:8398, :8429-8431, :9225-9230 | DOWNGRADED | true; but the full duck is inside `dot(-v, n) > 0.3` (:8401); "120 Hz" only from :7925 |
| 138-142 | Apache-2.0, README quote, 4(a)(b)(d), commercial OK | LICENSE:66, :89-106, ledgegrab.as:9-21, README.md:2 | OK | RE-DERIVED in part: G-sources:26 and G-roster:176 hold Apache and art-not-open |
| 146-149 | "a published method for holds on arbitrary geometry" | Kalisiak PDF p.4 | DOWNGRADED | holds are "designated manually, or through an automatic process", not described; journal pages not in the PDF |
| 150-152 | three hold types | Kalisiak PDF p.4 | OK | load-bearing, pendent, hybrid |
| 153-155 | acquire when close; "shaky-yet-nimble contortionist" | Kalisiak PDF 3.4 | OK | the quote is about the simple rule, as the scout says |
| 156-158 | smoothing per limb at its own key points | Kalisiak PDF 3.5, Fig. 9 | OK | |
| 159 | 10-15 minutes, 1400 frames, 266 MHz, 2D | Kalisiak PDF sections 4, 5 | OK | |
| 165-171 | Verniba: 20 males, 22/44 cm, knee table, CC BY 4.0 | Europe PMC XML, Table 2 | OK | all six means and SEs match; the scout read the article's licence line, not the CC text |
| 172-174 | Zhang: 0.32/0.62/1.03 m, knee and hip work, ankle-to-hip | Europe PMC abstract | OK | abstract only, as stated |
| 175-179 | Puddle: 0.75 m, 3.2/2.9/5.2 BW, 0.077/0.080/0.044 s, roll quote | PMC3761764 Table 2, Introduction | OK | licence is a (c) notice, as stated |
| 180-181 | Duan 30/45 cm kinetics; Liu 40/80 cm no angle table | Europe PMC records; Liu full text | OK | Liu did record knee-angle curves at 80 cm (figures only), nearer a storey than 44 cm |
| 223-224 | ladder limbs on the same-side hand and foot windows | ledgegrab.as:141-144, body.cpp:400-403 | UNSUPPORTED | Overgrowth's is a shimmy; today's ladder is diagonal; no ladder source read |
| 232-233 | crawler fixed cycle rate is its wall cue | archetype.h:50, archetype.cpp:152, G-loco:158 | UNSUPPORTED | ladder speeds are constants, so no difference can be drawn; source is insect running, abstract |
| 249, 255 | slope 72.7 degrees per metre | Verniba Table 2 | WRONG | (67.26 - 51.31) / 0.22 = 72.5 |
| 250 | cap 87.7 "the deepest measured" | Verniba Table 2 | DOWNGRADED | soft instruction at 44 cm; law caps at 0.72 m and holds through a 3.5 m storey, 8 times the tested height |
| 262 | thigh 0.46 / shin 0.45, 67 degrees of knee drops the hip 0.15 m | body.h:81, my arithmetic | DOWNGRADED | 0.16 to 0.28 m depending on a shin angle no source gives |
| 263 | peak force at 0.044-0.080 s against a 0.07 s dip | Puddle Table 2 | DOWNGRADED | force time is not hip-lowest time |
| 306 | rung pitch 0.30 m | body.cpp:22, G-code:168 | OK | RE-DERIVED (G-code:168); the board has no rungs (emit.cpp:536) |
| 328-330 | no probe wired in the gym's session | git grep set_floor_probe | OK | only world_app.cpp:116 and one test |
| 333-346 | first row red by arithmetic; hand at feet + 1.77 m | body.cpp:199-200, params.h:29 | OK | 0.27 above a 1.5 m ledge, 0.23 and 0.43 below 2.0, 2.2; start height unrun, as stated |
| 340-341 | seven climbs in the gym run | gym.cpp:72-111, :189-194 | OK | section 5 says "three gym mantles": inconsistent, not resolved |
| 23-47 | his words and picks as cited from G-words | brief:33-37, :89-92, :194-201, :360-362, :1113, :1127, :1266-1268, :1290-1292 | OK | all verbatim |
| 318 | "well under 1 microsecond per body" | none | UNSUPPORTED | marked [inferred] and "not measured"; no instrument |

Tally: OK 36, DOWNGRADED 8, WRONG 3, UNSUPPORTED 3 (50 rows).

RE-DERIVED 6: the limb phases, arcs and weighting at 2b and 3d (plan_l180:59-62); the per-hand probe with a remembered grip
at 3c (p-l176-openanim-C:46, plan_l180:61); the first lap's aim (buildpath_player_body_2026-11-13.md:84); the rung pitch
(G-code:168); the Overgrowth licence facts (G-sources:26, G-roster:176); the eye +0.12 m guess (G-physics:249-250, which the
scout itself cites).

**The simplest build that passes the first row without doing its job.** A per-height table of offsets from the eye, keyed
to the three gym ledge heights, with a one-tick snap at the check moment. The row checks one moment (not that the hand
arrives smoothly or stays), only on flat boxes, and measures a palm midpoint while the arm's target is the wrist. Add a row
for a hand on a ledge the gym lacks (a sloped or notched top) and one between the reach and the mantle's end.

**Mechanisms with no source and no [ours] mark.** (1) Same-side hand and foot pairing on a ladder (a shimmy window, not a
ladder source) against today's diagonal. (2) "0.1 s per metre" as a hand's reach (it is a body blend). (3) The 0.10 m inset
and the 5 cm band (the source puts the hand 0.10 m BELOW the contact). (4) The landing law above 0.44 m and its flat cap
through a 3.5 m storey. (5) A crawler's catch cue reaching up to 3 m. (6) No pose at all for a stagger.

**What I could not check.** Zhang 2000 past its abstract and Kalisiak's journal volume and pages (not in the PDF);
`audio/mixer.cpp` and `run.cpp` beyond the lines cited; the ladder texture; the Timestep definition in Overgrowth's engine
source (only :7925 hints it counts 120 Hz ticks); the gen-lap2-kit chute code beyond its commit message; whether the gym
bot's seven climbs start from the ground or mid-jump (no run); the Creative Commons deed text itself.

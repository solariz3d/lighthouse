# Scout: the upper body and the gaze (animation system swarm, 2026-11-13)

1. The room has the look spread (ozz), Valve's eased head, the first game's counter-rotation and Bruening's arms; the
   head's share of the thorax's twist (0.55) and its full share of the forward lean are the first game's, unsourced.
2. NEW at source: Pontzer 2009 (running: head yaw 6.1 deg vs shoulders 23.75, so 0.26; ~~shoulders lag the pelvis 94 deg,
   not 180~~ [2nd reader: WRONG as stated. Pontzer's phase difference is unsigned (360 x |t_pelvis - t_shoulder| / stride
   period, closest peaks, max 180, Methods p.528), so it does not say who lags; the 93.9 +-60.9 is printed for two cells
   (control running; arms-folded walking) and sits above the arm-weights 74.1 that the text calls 'greatest' (Results
   p.528). Rows 18-19 below]), Pozzo via Dunbar 2008 (head pitch 14 +-4 deg in running) [2nd reader: DOWNGRADED, Pozzo's 'running' was running IN PLACE, ten people (PubMed
   2257917 abstract)], Authie 2015 (head leads the pelvis 0.26 s), and
   Theunissen & Troje 2017 (a pigeon holds head ROTATION almost perfectly, not translation: the record misquotes it).
3. Also read: Overgrowth's live look (chest 0.35 of the look while moving, clamps, two springs, idle glances, breath).
4. Design: one shared layer in chain_pose/DrawnChaser for every humanoid, two knobs per kind (head_hold, look_lead).
5. First lap: kHeadTwistShare 0.55 -> 0.26 (Pontzer), one row red on 31d1c6d at 3.0 m/s; cost nil. [2nd reader: red on main is right (0.55 by construction). But 3.0 m/s is the fastest running speed
   Pontzer used (2.0, 2.5, 3.0 m/s, Methods p.527), a jog; the gait scales the twist by run = speed/6 (model_rig.cpp:746 on
   main), so 3.0 m/s is half amplitude; and the hunter runs to 9. A constant 0.26 has no source above 3.0 m/s.]

Marks: [read] I opened it; [summary] another account or a swarm file; [inferred] mine; [ours] a proposal.
Record paths are under `C:/Users/nname/Desktop/lighthouse/exo_memory/`. `G-words` = `loop/animation_system_2026-11-13/
ground_his_words.md`, and likewise `G-sources`, `G-phys`, `G-loco`, `G-code`, `G-roster` for the other five ground
files. Game code is dreamzone-3 `main` at 31d1c6d [read: `git log -1 main`], unless a branch is named. "brief" =
`briefs/dreamzone2_the_game.md`. Outside files were downloaded with curl into my scratchpad and read as text.

## (1) What the room already has for this aspect

His words that govern it (verbatim, checked in the brief by grep):
- 163: "perhaps the head moves first when you look, then it moves the rest of the body underneath" [read] brief:1128.
- 156: "making the whole body work as one" [read] brief:1114.
- 217: "tweak it from there to look uncanny in a realistic way that obeys physics" [read] brief:1607.
- 214: "is starting to become too human looking" [read] brief:1589.
- 169 is the room's record of his picks, not his words: hunter T1 only, "its head stays humanlike"; interceptor and
  stalker T2, "bird head hold" [read] brief:1154. Arms: 175, 176, 177, 180, 186 (G-words:431-470).

Built on main [summary, from the ground files; key lines re-read by me where marked]:
- The look spread: the head takes all of the look, upper spine 0.65, chest 0.4225 (ozz `sample_look_at.cc:466`, MIT)
  (G-sources:57-59). I re-read it: `kLookJointWeight = 0.35f` [read] game/model_rig.h:293.
- Valve's eased head: up to 1000 deg/s, eased ends, 0.25 s ease-in; "new look" 30 deg is ours (G-sources:105-108;
  G-code:108-110). No look pitch (G-sources:107-108).
- The chase's own look: the head turns to the player before the body, at least 7 rad/s, at most 1.6 rad off the heading
  [read] chase/chaser.cpp:40, :42, :450-458; set in Pursue and on contact [read] chase/run.cpp:864, :1233.
- The chain (L181): bank shares 1.0/0.35/-0.30, pitch 0.5/1.0/1.0, springs 0.13 s and 0.22 s, from the first game
  (G-code:117-124). Counter-rotation: pelvis 6.5 deg, thorax 14.28 deg each way (Perpina-Martinez; Ford abstract)
  (G-sources:208-209). Re-read: `c.head_twist = kHeadTwistShare * thorax + look;` [read] game/model_rig.cpp:615, with
  `kHeadTwistShare = 0.55f;     // :6667, torTw * 0.55` [read] game/model_rig.h:144: the first game's figure, no study.
- The thorax runs in exact antiphase with the pelvis (`thorax = -kThoraxTwistAmp * stride`) [read] model_rig.cpp:612,
  and a landed row demands correlation under -0.5 [read] game/tests/model_rig_tests.cpp:651-686.
- The chest takes its look share at once, with no lag: `c.trunk_twist = thorax + kLookChestShare * look;` [read]
  model_rig.cpp:614. So on a chaser the chest and the head peak together [inferred].
- Arms: Bruening 2020 ranges, Otsuka flare (V1, his pick), `kArmTwistShare` 1.5 ours (G-loco:137-147; G-code:126-139).
- No breathing, no idle motion, no head nod. The first game's nod and bounce were left out (G-sources:223).
- The player: no chain; the body faces the view yaw; `glanced()` turns the chest a fixed 50 deg (G-code:64, :49).
  The head-first look is L188 step 3, owed; WIP on `origin/l188-wip-look` a60944d, "NOT TO LAND" (G-phys:46, :245).
  I read its diff: the chest's share of the glance follows on the first game's trunk spring (kTrunkFollowTime) [read]
  `git diff main...origin/l188-wip-look -- game/shell.cpp`. It is based on 0389b0a, older than main [read: git log].
- Arm laws for the player are unsourced numbers (G-code:174); his pick lets the player's arms be tuned on their own
  (`player_body-4`, G-words:582).

Designed, not built: T2 = "a head-target change in L181's chain" [read] handback/p-l187-animal-locomotion-E_2026-11-12.md:188.
Gaze ideas already on record [read] handback/p-d666-entities-E_2026-11-11.md: the pack's heads all turn at once (:66, :93);
the interceptor stands at a junction with "its turned head toward where he is going" (:92).

Thin in the ground files: nothing on head stabilisation in humans, nothing on gaze anticipation, nothing on breathing
or idle. Pontzer 2009 was "abstract only" (G-sources:211). I read those at source below.

## (2) What I read at source that is NEW

Licences: every paper below gives the game FIGURES only (facts, restated as constants with a citation). No text,
code, data file or image of any of them is proposed for the game. Rule 5's code-use question arises only for Overgrowth.

**A. Pontzer, Holloway, Raichlen & Lieberman 2009, "Control and function of arm swing in human walking and running",
J Exp Biol 212:523-534, doi 10.1242/jeb.024927.** Read whole, the authors' copy from Harvard DASH
(dash.harvard.edu, bitstream 7312037c-...). Terms: DASH "Other Posted Material (LAA)", not an open licence [read, cover
page]. Ten adults on a treadmill; control, arms folded, 1.2 kg at each elbow.
- Running 3.0 m/s, control: shoulder rotation 23.75 deg, head yaw 6.1 +-1.6 deg. Walking 1.5 m/s: shoulders 8.1 +-2.5,
  head 5.2 +-1.1 [read, Results "Kinematics", Fig. 3]. So head/shoulder = 0.26 running, 0.64 walking [inferred].
- Arms folded (running): shoulders 35.68, head 11.3 +-3.4. Arm weights: shoulders 17.48, head 5.3 +-1.5 [read, same].
- Pelvis-to-shoulder phase difference, running: control 93.9 +-60.9 deg, arm weights 74.1, arms folded 33.0; walking
  control 149.2 +-41.5 [read, same]. 0 deg means the peaks coincide; 180 is opposite. The paper calls it the "Lag time
  between pelvis and shoulder rotation" [read, same]: ~~the shoulders lag the pelvis.~~ [2nd reader: WRONG, the measure is unsigned (max 180); the 93.9 is also printed twice
  and is inconsistent with the text; rows 18-19.]
- Model: "the arms act as passive mass dampers which reduce torso and head rotation, and upper body movement is
  primarily powered by lower body movement" [read, Summary]. The head is "a mass attached to the torso via a damped
  spring" [read, Introduction].

**B. Dunbar, Macpherson, Simmons & Zarcades 2008, "Stabilization and mobility of the head, neck and trunk in horses
during overground locomotion: comparisons with humans and other primates", J Exp Biol, PMC2768006.** Read the NIH
manuscript on pmc.ncbi.nlm.nih.gov (HTML downloaded, tags stripped). PMC copyright notice; not an open licence.
- Table 2, ~~human overground run~~ [2nd reader: Pozzo's run was 'running in place' (PubMed 2257917 abstract); Dunbar's
  column note d says overground lab surface; the two disagree], from Pozzo et al. 1990: head pitch 14 (+-4) deg, head vertical 7-16 cm [read, Table 2
  and its footnotes d, j]. Pozzo 1990 itself is paywalled; this is [summary] of it through Dunbar's table.
- "head pitch and vertical translation are, with few exceptions, approximately 180deg. out of phase during bipedal runs
  and hops" [read, Introduction]. ~~Head and trunk each stay within 20 deg in natural locomotion~~ [2nd reader: WRONG. Dunbar's hypothesis is that EITHER the
  head OR the trunk is held to 20 deg or less; monkey gallop trunks pitch to 50 deg while the head holds, and monkey heads
  often exceed 20 deg in yaw and pitch (Introduction, PMC2768006). For humans only Pozzo's abstract: head pitch under 20.]

**C. Authie, Hilt, N'Guyen, Berthoz & Bennequin 2015, "Differences in gaze anticipation for locomotion with and without
vision", Front Hum Neurosci 9:312.** Read whole, the journal PDF. CC BY [read, its copyright line].
- Walking two set paths (figure eight, limacon), ten people. In light, cross-correlation lags against the pelvis: gaze
  557 +-160 ms ahead, head 264 +-134 ms ahead [read, Results ~~3.4~~ 3.3]. [2nd reader: the section is 3.3 (3.4 says anticipation did not depend on
  speed or curvature within these walks). DOWNGRADED for use: slow walks (pelvis 0.80 +-0.14 m/s in light, 3.1), memorised
  paths, ten people; the lag is head ORIENTATION against pelvis ORIENTATION by cross-correlation, not a look-ahead.] Angles toward the curve's centre: gaze 27.5 +-6.9
  deg, head 14.8 +-6.0 deg [read, Results 3.3]. Order: gaze, then head, then the pelvis; "the head precedes shoulders
  and torso" [read, Results 3.2]. All are halved in darkness [read, Abstract].
- Walking only. I found no open source for running turns. Using it for a running chaser is [inferred].

**D. Theunissen & Troje 2017, "Head Stabilization in the Pigeon: Role of Vision to Correct for Translational and
Rotational Disturbances", Front Neurosci 11:551, PMC5633612.** Read whole, Europe PMC full-text XML. CC BY [read].
- "the head followed the movement of the motion platform to a large extent during translations, but it was almost
  perfectly stabilized against rotations" [read, Abstract]. Rotations: gains near 1, phases near 0, at 0.25-2 Hz, about
  all three axes, light or dark [read, Results]. Translation was "virtually absent" as stabilisation [read, Results]. [2nd reader: DOWNGRADED for use on a chaser: pigeons
  STANDING on a perch moved by a platform, at most 9 deg, 14 deg/s, 0.25-2 Hz (Methods); the abstract says 'during standing'.
  Not a bird in flight or walking, not a body turning at hundreds of deg/s.]
- Under rotation, 1.1 head saccades a second in light [read, Results, Fig. 5]. Birds "rotate their head with sudden fast
  movements and then keep it relatively stable between these rotational thrusts" (citing Kress 2015) [read, Intro].
- CORRECTION to the record: `handback/p-l187-animal-locomotion-E_2026-11-12.md:154` says that in translations the head
  was "almost perfectly sta[bilised]". The paper says that of rotations; translations were not stabilised [read, both].
  The walking pigeon's translational hold-then-thrust stands on the intro's citation of Troje & Frost 2000 and on the
  Ortega 2009 abstract only [summary]. The room's T2 "held still in space, then thrust" (G-loco:156) mixes the two.

**E. Hamill, Lim & van Emmerik 2020, "Locomotor Coordination, Visual Perception and Head Stability during Running",
Brain Sci 10(3):174, PMC7139831.** Read whole (a review). CC BY 4.0 [read].
- ~~The neck reflexes stabilise the head only under about 350 deg/s of head rotation~~ [2nd reader: WRONG. The sentence is
  about the vestibulo-ocular reflex and the eyes: 'these reflexive adjustments ... only work appropriately when head
  rotational velocities are under 350 deg/s' (Hamill, Introduction, citing its [18]); it is not a neck-reflex limit.] [read, Introduction].
- A study it reports: the hardest visual task while running gave "a 32% reduction in head/gaze motion and an 8% increase
  in stride frequency" [read, the visual-task section]. The primary study is [summary] through the review. [2nd reader: DOWNGRADED. It is Lim et al. (review ref. 46): treadmill, preferred
  speed, real-time screen feedback of the head/gaze point, task = keep it in a 3-degree box; the 32% is 'head/gaze motion'
  (plane not stated). It is not a chaser fixating a target.]

**F. Daley, Bramble & Carrier 2013, "Impact loading and locomotor-respiratory coordination significantly influence
breathing dynamics in running humans", PLoS ONE, PMC3741319.** Read through Europe PMC. CC BY [read].
- "Most (11 of 14) subjects exhibited periods of fixed-ratio coupling ... with 2:1 strides per breath as the most common
  pattern" [read, Results]. Humans also use 2.5:1, 3:1, 4:1, or none [read, Introduction]. [2nd reader: DOWNGRADED on unit: Daley says 'strides per breath' but
  tracks footstrikes by head acceleration ('step cycle'); a stride may mean a step. Subjects ran 2.6 +-0.1 m/s on a treadmill.]

**G. Overgrowth (Wolfire), the live look and the breath.** Read at source from github.com/WolfireGames/overgrowth main:
`Data/Scripts/aschar.as` (15,576 lines) and `Source/Objects/movementobject.cpp` (4,936 lines). Licence: Apache-2.0,
file headers "Copyright 2022 Wolfire Games LLC" and the full LICENSE text [read: aschar.as:9-21; LICENSE :1-3, :89-141];
README: the game data "can only be legally obtained by purchasing" [read README.md:2]. Use: the idea and the figures,
restated; no line copied. If a line ever were copied: commercial use allowed; keep the licence text and notices and mark
changed files (LICENSE section 4); no share-alike; redistribution allowed. The room read other lines of these files
(G-sources:29-33); the look and breath parts below are not in that list.
- The script's `DoChestIK`/`DoHeadIK` return early into C++ (`if(true) { this_mo.CDoChestIK(...)`), so the live code is
  movementobject.cpp [read aschar.as:14857-14860]. I cite the C++ where it has the line.
- Torso share while moving: `torso_control *= max(0.35f, stance_move_fade_val);` [read aschar.as:4368]: the chest
  takes 0.35 of the look while running (0.5 in a fighting stance, :4358-4360), zero off the ground (:4391-4392).
- Spread: the chest's turn is applied half about the abdomen's top and half about its bottom: `mix(chest_rotate,
  identity, 0.5f)` twice [read movementobject.cpp:2281, :2284]. The head is then turned the rest of the way.
- Clamps: chest yaw 1.0 rad [read :2227]; head yaw 1.3 x 0.7 = 0.91 rad for a non-rabbit [read :2406-2409]; head
  pitch 0.8 rad [read :2419]; head rate 15 rad/s [read :2439].
- Springs, per 120 Hz frame [read aschar.as:14162-14165]: chest damping 0.93, stiffness 0.5; head damping 0.9,
  stiffness 0.8. As continuous springs at an inferred 120 Hz: chest w 7.7 rad/s, zeta 0.56; head w 9.8, zeta 0.64
  [inferred]. The head's spring is the faster, so the head leads the chest [inferred]. [2nd reader: the 0.93/0.5/0.9/0.8 hold only when
  idle_look_amount = 0 (the player, or combat). For an idle AI the chest goes to 0.99 / 0.03 and the head gains an inertia stage
  0.99 and accel damping 0.95 (aschar.as:14178-14184); the scout's idle-glance row is paired with the wrong springs.]
- Idle glances: a new look every 0.8-2.0 s, in the forward half, pulled halfway to the facing, pitch +-0.3 [read
  aschar.as:4295-4313]. A running player's eye alternates by `sin(time * 3.0f) + sin(time * 2.3f)>0.0f` [read :4285].
- Micro-shake: a random 0.005 rad on the chest target, 0.001 on the head, each frame [read movementobject.cpp:2242].
- Breath [read aschar.as:2334-2339]: rate 0.9 + 4.0 x speed ratio rad/s, capped at 5; amount 0.5 to 1. Applied [read
  :2101-2127]: chest 0.01 up and 0.01 forward times the amount, turned 0.05 rad; neck 0.005; shoulders 0.002.
  Overgrowth's units times its `scale`; reading them as metres for our bodies is [inferred]. 0.9 rad/s is 8.6 breaths a
  minute; 5 rad/s is 48 [inferred].

Agreement worth noting [inferred]: two sources give the chest about a third of the look (Overgrowth 0.35, ozz 0.4225
landed). [2nd reader: DOWNGRADED. ozz's 0.35 is the sample's default slider for joint_weight_ (sample_look_at.cc:468; the room's
  :466 is the comment above it), not a measurement; Overgrowth's 0.35 is a floor in max(0.35, stance_move_fade_val)
  (aschar.as:4368). Two code constants agreeing is not triangulation.] At 3 m/s a 2-strides-per-breath runner breathes about 4.4 rad/s (about 1.4 strides a second), near
Overgrowth's 5 rad/s cap: the code source and the measured coupling meet at a jog. [2nd reader: DOWNGRADED. Daley's 'stride' is ambiguous (see above); if it
  is a step the breath rate doubles. Overgrowth's rate scales with speed over the character's own max speed, not m/s.]

## (3) The design: one upper-body layer for every humanoid

### Inputs and outputs
- In (all picture side, read from what `ChaserPose`/`GaitMotion` already carry, plus three fields [ours]): heading,
  look yaw, speed, lean and pitch, stride phase, `run`; NEW: the look's target point and kind (player, sound, path,
  none), the pelvis's vertical offset from its mean (gait_pose has the flight rise), and the kind's two knobs.
- Out: the `ChainPose` head and trunk angles (`head_twist`, `head_pitch`, `head_lean`, `trunk_twist`) and a small
  breath offset for Chest, Neck and the shoulders. Nothing goes back to the chase or the simulation.

### Where it sits (functions as G-code maps them)
- `DrawnChaser::step` (model_rig.cpp:498-544, every chaser, every 240 Hz tick, world_app.cpp:567-588): holds the new
  state: the held look of a T2 kind, the idle-glance timer, the breath phase. Deterministic from sim state and a hash of
  (id, tick) [ours], so a capture repeats.
- `chain_pose` (model_rig.cpp:601-618): the head's share of the thorax by speed; the head nod; the T2 hold; the
  chest's look share routed through the existing trunk follow spring so the head leads.
- `kinetic_chain` (model_rig.cpp:620-643): the breath offsets.
- `WorldStage::place_figures` (stage.cpp:256-281): fills the new GaitMotion fields.
- The player: `Body::pose`/`glanced()` (body.cpp:145-165, :222-543) until the body goes through `kinetic_chain`, which
  model_rig.h:173 names as "next". The head-first look is L188 step 3; this layer gives it its shares and limits.

### Shared by every humanoid (sourced defaults; none is a per-kind knob)
| quantity | default | source |
|---|---|---|
| head yaw share of the thorax's twist | 0.26 at a run (3.0 m/s), 0.64 at a walk (1.5 m/s); linear between, held outside [ours] | Pontzer 2009 Fig. 3 [read] [2nd reader: DOWNGRADED: n = 10 on a treadmill at 1.5 and 3.0 m/s only; 'held outside' means 3 to 9 m/s is unsourced] |
| head pitch nod at a run | range 14 deg, opposite in phase to the head's rise (head pitches down at the top) | Pozzo 1990 via Dunbar Table 2 [read/summary]; phase, Dunbar Intro [read]; "down at the top" [inferred] [2nd reader: DOWNGRADED, Pozzo's run was in place; 14 +-4 is Dunbar's tabulated figure, not a stated range] |
| look spread | head all, upper spine 0.65, chest 0.4225 (landed) | ozz (landed); Overgrowth 0.35 agrees [read] |
| chest's look share timing | rides `kTrunkFollowTime` 0.13 s (landed spring), so head first | Authie: head before torso [read]; Overgrowth head spring faster [inferred] [2nd reader: Authie gives the ORDER, not 0.13 s; 0.13 s is the
  first game's spring (G-code:119). RE-DERIVED: this is L188 WIP a60944d, scout lines 46-48] |
| look clamps | chest <= 1.0 rad of the look; head <= 0.91 rad past the chest; pitch <= 0.8 rad | Overgrowth movementobject.cpp:2227, :2406-2409, :2419 [read] |
| look lead (no target) | the head looks where its path will be 0.26 s ahead | Authie, head 264 ms, light [read]; no eye bones, so no 0.56 s gaze [inferred] [2nd reader: DOWNGRADED, an orientation lag of slow walkers,
  not a path look-ahead; the path look-ahead itself is [ours]] |
| locked on the player | head nod and yaw x 0.68 | Hamill review, 32% [read; primary summary] [2nd reader: UNSUPPORTED as a default. The 32% is a lab task (see above); that a locked-on chaser
  steadies by 32% in both nod and yaw has no source and is not marked [ours]] |
| breath | rate 0.9 + 4.0 x speed ratio rad/s, cap 5; amount 0.5-1; chest 1 cm up, 1 cm fwd, 0.05 rad; neck 0.5 cm; shoulders 0.2 cm | Overgrowth aschar.as:2101-2127, :2334-2339 [read]; metres [inferred] |
| breath while running | phase-locked to 2 strides a breath while that is under 5 rad/s; free above | Daley 2013 [read]; the switch [ours] [2nd reader: stride/step unit unresolved] |
| idle glances (no target, slow) | a new look every 0.8-2.0 s, forward half, halfway to facing, pitch +-0.3 rad | Overgrowth aschar.as:4295-4313 [read]; hash not random [ours] |

The sourced consequence law I would carry with it (no knob) [inferred from Pontzer, A]: arms are passive dampers, so a
kind whose arms swing less MUST turn its shoulders and head more. Folded arms gave shoulders x1.50 and head yaw x1.85;
heavy arms gave x0.74 and x0.87. [2nd reader: DOWNGRADED. Head yaw with arm weights vs control was NOT significant (P=0.26) and
   shoulders barely (P=0.049); 'arms folded' is a different condition from 'arms swing less'. RE-DERIVED in part: arms as mass
   dampers against torso rotation is already at brief:1193 and G-sources:211 (abstract level); only the figures are new.] This is the owner's 217 method in one rule: an arm cue that is uncanny, with a trunk
that obeys physics. The hunter's arms reach the knee (G-roster:111-112); by the same law its shoulders should turn less
than a human's [inferred]. Not proposed for a first lap.

### Per kind: two knobs
| knob | what it does | default | the sources' range |
|---|---|---|---|
| `head_hold` 0 or 1 | 0: the human head above. 1: the head's ORIENTATION is held fixed in the world on its target, gain 1 on yaw, pitch and roll; when the target needs more than the 0.91 rad reach, or jumps, the head re-fixes in one rotational saccade at the landed 1000 deg/s, then holds again. No positional hold. | 0 for hunter and kid; 1 for interceptor and stalker (169's T2) | Theunissen & Troje: rotation gain about 1 [read]; the saccade composition is [ours] |
| `look_lead` s | how far ahead along its own path the head looks when it has no target | 0.26 | 0.13-0.40 (Authie's +-134 ms) [read]; 0 is the robot that looks where it already goes [inferred] |

A humanoid neck cannot hold the head still in position through a 7-16 cm bob [inferred from Dunbar Table 2], and the
pigeon paper says even pigeons follow translations; so T2 here is the rotational hold only [inferred].

### What the gaze tells the player [ours, each built from the rows above]
- Hunter (head human, per 169): it looks at you when it has you (built, D664). Before its path turns, its head swings
  to the new way 0.26 s before its hips: you can read the turn (Authie). In a cut-off state (178), the head goes to
  where you will be, not to you. When it loses you (`chase_entities-3`), the head searches along your last line. Locked
  on, its head steadies by 32% (Hamill): a quiet tell that it has you.
- Interceptor and stalker (T2): the head stays fixed on you while the body runs and turns under it, then snaps to the
  next fixation. That is the categorical cue the record wants (H187:170 "a head that clearly stabilises like no human").
- Pack: one shared look, all heads on the same tick (D666:66).
- A lesser chaser still searching (92): idle glances until it hears you; then one saccade to the sound, and the body
  follows slowly.
- The player: the head is the view; the chest follows on the trunk spring; the hips follow the travel (163, L188 step 3).

### Hunter, lesser chaser, player: the same layer
| | hunter | lesser chaser (once it has a model) | the kid |
|---|---|---|---|
| head | human: 0.26 yaw share, nod, lead 0.26 s | T2 kinds hold; others human | the view itself; the camera stays untouched |
| chest | look share on the trunk spring | same | same, against the view yaw (L188 step 3) |
| breath | yes | yes, or none as a kind's cue (his eye) | chest only; never the camera |
| arms | landed Bruening/Otsuka | landed laws by its own leg length | his own tuning (`player_body-4`) |

### Cost per character per frame [inferred, nothing timed]
Per tick per chaser: about three spring steps (one exp each), one atan2, one sin, one hash: well under 1 us. Per
frame: two more yaw turns and five joint offsets inside `kinetic_chain`. A path look-ahead walks one to three path
segments. Under 2 us per character, under 50 us for 24 figures, about 1.5% of the 3.33 ms frame. No new bones are
skinned, so the GPU cost does not change. The ground files record no frame cost for any of this (G-code:228-252).

## (4) The first lap

- Smallest piece: the head's share of the thorax's twist, from Pontzer, in place of the first game's 0.55.
- Files: `game/model_rig.h:144` (the constant and its source comment, 0.257 = 6.1 / 23.75); a new row in
  `game/tests/model_rig_tests.cpp` beside :651; `CHANGELOG.md`.
- The row: `at_a_run_the_head_turns_about_a_quarter_as_far_as_the_shoulders`. Pose `gait_pose(rest, {}, 0, 3.0f, ph)`
  over 72 points of a stride, as the row at :651 does; read the shoulders' line and the head's yaw (Eye minus Head);
  check range(head) / range(shoulders) between 0.12 and 0.39 (Pontzer's head 6.1 +-2 sd over 23.75).
- The case is Pontzer's recorded runners at his own speed, 3.0 m/s, n = 10. Red on 31d1c6d: the ratio is 0.55 by
  construction (model_rig.cpp:615) [inferred]. Green after: 0.26. It does not touch the row at :651. [2nd reader: the cheapest pass is a bare constant: the row checks one speed, at half stride
  amplitude, and cannot see the walk end (0.64), any speed above 3.0, or the head's phase. Whether it makes the hunter look
  right at 9 m/s is only his eye's call.]
- His eye then sees the hunter's head turn about half as much each stride. That is more human, by measurement, which is
  the base his 217 asks for before the uncanny tweaks.
- Cost: none. A conflict to land beside it, for him and not this lap: Pontzer's 94 deg shoulder lag against the landed
  antiphase row (model_rig_tests.cpp:685, `r < -0.5`). [2nd reader: RE-DERIVED in part: the pelvis/thorax timing detail is already recorded as unmodelled
  (G-sources:210, Preece; H/p-l180-lap2:166); and the 94 deg is not a safe figure (rows 18-19). Also the lap-2 handback says the
  literature goes toward anti-phase as speed rises, while Pontzer's walking 149 vs running 94 goes the other way.]
- Second lap [ours]: route the chest's look share through the trunk spring (head first), with the order head, chest,
  pelvis as the row. This is the chasers' half of L188 step 3. [2nd reader: RE-DERIVED: already built as origin/l188-wip-look a60944d, 'NOT TO LAND'
  (G-phys:46, :245; scout lines 46-48).]

## (5) What only his eye can decide, and the fewest clips

Rules from the record: lit, at full frame rate, and the "before" is current main (brief:1603-1606, G-roster:153-161).
1. **The hunter's head on a straight**, side and behind, at 3 and 9 m/s, three columns: main; Pontzer's head share;
   that plus Pozzo's 14 deg nod. He decides whether the nod reads as life or ~~as the "up down" he rejected (195)~~ [2nd reader: UNSUPPORTED link. Item 195 (brief:1514)
   is about the legs stomping 'up down up down' in the stride, not a head nod].
2. **A corner from the look-behind**: look lead 0, 0.26 and 0.56 s. He decides how early the head may give the turn
   away, and the head's pitch share of the lean (1.0 today, which pitches the gaze to the floor; level is the sourced
   human alternative, Dunbar's "within 20 deg").
3. **The T2 hold on a stand-in**, labelled as such: the hunter's model with the interceptor's head held on the camera,
   running past and turning. The lesser kinds have no models (G-roster:107-117), so this is the only way to judge T2 now.
Also his calls, shown in clip 1 at its stop: whether a kind breathes at all, and whether any kind swings its arms less
(the Pontzer law above), and whether the shoulders lag the pelvis by 94 deg as measured.

## (6) What I would NOT build, and why

- A translational head hold or a pigeon bob on a humanoid: the paper read says pigeons do not even hold translations
  against a moving perch, and a human neck cannot cover a 7-16 cm bob [read D, B; inferred].
- Overgrowth's per-frame random shake: random calls each frame differ with frame rate and do not repeat in a capture;
  at 360 Hz it is shimmer [inferred]. If his eye wants life, the idle glance above gives it from a hash.
- A simulated mass-damper arm: Pontzer explains why arms swing; the landed arm laws already match measured ranges and
  his pick V1. Springs tuned to look right would replace sourced curves [inferred].
- Eye bones, nystagmus or a face rig for gaze: the models have no face bones (G-roster:66); the head carries the gaze.
- Moving the player's camera with breath or a stabilised head: the camera is the gaze and stays untouched (body.h:4-5).
- Overgrowth's chest springs as new constants: the landed trunk spring gives the same order with nothing new.
- A third per-kind knob: the arm-swing law is a consequence, not a dial.
- Look pitch toward the player for every kind: the chase gives no pitch today (G-sources:107-108); only when a kind needs
  it (a crawler above you).

## What I did not open
- Pozzo, Berthoz & Lefort 1990; Hirasaki 1999; Imai 2001; Grasso 1998; Bernardin 2012; Ortega 2009; Troje & Frost 2000;
  Kress 2015; Bramble & Carrier 1983: paywalled or not fetched. Only their accounts in the papers above.
- Authie 2015's supplementary results (shoulder and torso timing); Pontzer's supplementary movie; Hamill's primary study.
- Any open look-at code other than Overgrowth (Godot's LookAtModifier3D, Unity Animation Rigging); ozz was the room's.
- Overgrowth's `CDoHeadIKImpl` beyond :2406-2445 and its idle and dialogue paths beyond the lines cited.
- dreamzone-3: `body.cpp` beyond grep hits, `camera.cpp` beyond :185-198, the stage code, the l205-stomp-c branch's
  chain (only a grep for the two constants), E's clone and every worktree. Nothing was built or run.
- The brief beyond the grep that checked his quoted words; the hand-backs beyond the lines cited.


## Second reader

Checked by the adversarial second reader, 2026-11-13. Primaries opened in whole lines: Pontzer's DASH PDF (a web.archive.org
copy of the same file, pdftotext), PMC XML and HTML of Theunissen, Hamill, Daley, Authie, Dunbar; the PubMed abstract of Pozzo
1990; the raw Overgrowth files, LICENSE and README; raw ozz sample_look_at.cc; and the game at main 31d1c6d with git show.
The 'line' column is the scout file's own line before my insertions.

| # | line | claim | primary opened | verdict | evidence |
|---|---|---|---|---|---|
| 1 | 22 | His item 163, head moves first | brief:1128 | OK | verbatim match |
| 2 | 23 | Item 156, whole body as one | brief:1114 | OK | verbatim match |
| 3 | 24 | Item 217, uncanny but obeys physics | brief:1607 | OK | verbatim match |
| 4 | 25 | Item 214, too human looking | brief:1589 | OK | verbatim match |
| 5 | 26 | Item 169 picks: T2 interceptor and stalker, hunter humanlike | brief:1154 | OK | text matches; a record of picks, as the scout says |
| 6 | 32 | kLookJointWeight = 0.35f at model_rig.h:293 | git show main:game/model_rig.h | OK | line 293 on 31d1c6d |
| 7 | 31 | ozz 0.35 at sample_look_at.cc:466, MIT | raw ozz sample_look_at.cc, LICENSE.md | DOWNGRADED | constant is :468, a UI slider default; :466 is a comment; MIT holds |
| 8 | 34-35 | Chase head 7 rad/s, 1.6 reach, look_toward; set at run.cpp:864, :1233 | main chase/chaser.cpp, chase/run.cpp | OK | kHeadRate :40, kHeadReach :42, look_toward :450, calls :864 :1233 |
| 9 | 38 | head_twist = 0.55 x thorax + look; kHeadTwistShare at h:144 | main model_rig.cpp:615, model_rig.h:144 | OK | only consumer of the constant (git grep) |
| 10 | 39 | Thorax antiphase at :612; row demands r < -0.5 (:651-686) | main model_rig.cpp:612, model_rig_tests.cpp:651,685 | OK | row starts :651, r < -0.5 at :685 |
| 11 | 41 | Chest takes its look share at once (:614) | main model_rig.cpp:614 | OK | trunk_twist = thorax + kLookChestShare * look |
| 12 | 47 | l188-wip-look diff uses trunk spring; base 0389b0a older | git diff main...origin/l188-wip-look; merge-base | OK | kTrunkFollowTime in diff; 0389b0a is an ancestor of main |
| 13 | 52-53 | H187:188 T2 is a head-target change; D666 :66 :92 :93 | handback files | OK | text matches at those lines |
| 14 | 66-67 | Pontzer DASH terms are Other Posted Material (LAA) | DASH PDF cover page (via web.archive.org copy) | OK | cover page says so; crossref/OpenAlex say cc-by for the repository copy, the cover page governs |
| 15 | 68 | Running 3.0 m/s: shoulders 23.75, head 6.1 +-1.6; walking 8.1, 5.2 | Pontzer 2009 pdf, Results p.528 | OK | figures match the text of Results |
| 16 | 69 | Arms folded 35.68 / 11.3; weights 17.48 / 5.3 | same, Results p.528 | OK | match |
| 17 | 74-76 | Summary quote, head as mass on damped spring | same, Summary and Introduction | OK | both quotes match |
| 18 | 70-72 | Phase differences 93.9 / 74.1 / 33.0 / 149.2 | same, Results p.528, Fig. 3C text | DOWNGRADED | 93.9 +-60.9 printed for running control AND walking arms-folded; text calls weights 74.1 'greatest' yet control 93.9 'slightly lower' |
| 19 | 73 | The shoulders lag the pelvis | same, Methods p.528 | WRONG | phase = 360 x |t_pelvis - t_shoulder| / stride period, closest peaks, max 180: unsigned |
| 20 | 81 | Dunbar Table 2: human run head pitch 14 (+-4), vertical 7-16 cm, notes d, j | PMC2768006 page, Table 2 and footnotes | OK | column Human d,j, row Trot=Bipedal run: 14(+-4); vertical 7-16l (range) |
| 21 | 81 | Pozzo's run was overground | PubMed 2257917 abstract | DOWNGRADED | abstract: 'running in place (R)', ten subjects, F-P rotation under 20 deg |
| 22 | 83 | Pitch and vertical translation about 180 out of phase in runs | PMC2768006 Introduction | OK | 'approximately 180 deg out of phase during bipedal runs and hops' |
| 23 | 84 | Head and trunk each within 20 deg in natural locomotion | PMC2768006 Introduction | WRONG | 'either the head or the trunk'; gallop trunks to 50 deg; monkey heads often over 20 |
| 24 | 87 | Authie 2015 is CC BY | PMC4458691 front matter | OK | CC BY, open-access article |
| 25 | 88 | Lags vs pelvis: gaze 557 +-160, head 264 +-134 ms (Results 3.4) | PMC4458691 Results 3.3 | OK | numbers match; section is 3.3, label corrected in place |
| 26 | 88 | Use as a path look-ahead for a running chaser | PMC4458691 methods 2.8, 3.1, 3.4 | DOWNGRADED | orientation lag vs pelvis, walkers at 0.80 m/s, paths memorised |
| 27 | 89 | Angles toward the centre: gaze 27.5 +-6.9, head 14.8 +-6.0 | PMC4458691 Results 3.3 | OK | 27.53 +-6.91 and 14.79 +-6.02, light |
| 28 | 90 | Order gaze, head, pelvis; head precedes shoulders and torso | PMC4458691 Results 3.2 | OK | quoted sentence present |
| 29 | 91 | All halved in darkness | PMC4458691 Abstract, 3.3 | OK | 'decreases by a half'; 557->268, 264->129 ms |
| 30 | 96 | Pigeon head 'almost perfectly stabilized against rotations' | PMC5633612 Abstract | OK | quote matches; translations followed the platform |
| 31 | 97-98 | Rotation gains near 1, phases near 0; translation stabilisation virtually absent | PMC5633612 Results | OK | both phrases present |
| 32 | 96-98 | Fit as a head hold on a running chaser | PMC5633612 Abstract, Methods | DOWNGRADED | pigeons standing on a perch, platform at most 9 deg, 14 deg/s, 0.25-2 Hz |
| 33 | 99-100 | 1.1 saccades/s in light; Kress citation | PMC5633612 Results, Introduction | OK | both present |
| 34 | 101-104 | Record H187:154 misquotes Theunissen on translations | handback p-l187-animal-locomotion-E:154; abstract | OK | record says 'in translations ... almost perfectly sta[bilised]'; paper says rotations |
| 35 | 108 | Neck reflexes stabilise head only under about 350 deg/s | PMC7139831 Introduction | WRONG | the sentence is about the vestibulo-ocular reflex (eye), ref [18] |
| 36 | 109 | Hardest visual task: 32% less head/gaze motion, 8% more stride frequency | PMC7139831 section 3 | OK | sentence present; primary (Lim et al.) not opened |
| 37 | 176 | Locked on the player: nod and yaw x 0.68 | PMC7139831 section 3 | UNSUPPORTED | lab task with on-screen feedback; no source for the mapping, not marked [ours] |
| 38 | 113 | Daley: 11 of 14 coupled, 2:1 most common | PMC3741319 Results | OK | sentence matches, 'strides per breath' |
| 39 | 114 | Humans also use 2.5:1, 3:1, 4:1 or none | PMC3741319 abstract, Introduction | OK | matches |
| 40 | 144 | 2 strides a breath at 3 m/s gives 4.4 rad/s, near the 5 cap | PMC3741319 methods, Table 1 | DOWNGRADED | unit stride vs step unresolved; treadmill 2.6 +-0.1 m/s |
| 41 | 119-122 | Overgrowth Apache-2.0, headers, LICENSE sec. 4, README line 2 | raw aschar.as, movementobject.cpp, LICENSE, README.md | OK | headers say Apache 2.0; sec. 4 conditions as stated; README says data is bought |
| 42 | 124-125 | DoChestIK/DoHeadIK return into C++ (aschar.as:14857-14860) | raw aschar.as | OK | if(true) { this_mo.CDoChestIK ... return |
| 43 | 126-128 | torso_control max(0.35, ..) at :4368; 0.5 in stance; zero off ground | raw aschar.as:4355-4395 | OK | all three present; chest angle x torso_control in C++ |
| 44 | 128-129 | Chest turn mixed half about abdomen top and bottom (:2281, :2284) | raw movementobject.cpp | OK | both lines mix(chest_rotate, identity, 0.5f) |
| 45 | 130-131 | Clamps chest 1.0 (:2227), head 1.3 x 0.7 (:2406-2409), pitch 0.8, 15 rad/s | raw movementobject.cpp | OK | 2227, 2406-2410, 2419, 2439 |
| 46 | 132 | Springs 0.93 / 0.5 / 0.9 / 0.8 at aschar.as:14162-14165 | raw aschar.as | OK | values and lines match; zeta, omega recomputed 7.7/0.56, 9.8/0.61-0.65 |
| 47 | 132-134 | These springs describe Overgrowth's look generally | raw aschar.as:14168-14205 | DOWNGRADED | idle AI uses 0.99 / 0.03 and a head accel stage (inertia 0.99, damping 0.95) |
| 48 | 135-136 | Idle glances 0.8-2.0 s forward half, pitch +-0.3; sin() alternation | raw aschar.as:4284-4313 | OK | both match; the sin() eye switch is for the controlled character |
| 49 | 137 | Micro-shake 0.005 chest, 0.001 head per frame | raw movementobject.cpp:2242, :2426 | OK | match |
| 50 | 138-139 | Breath rate 0.9 + 4.0 x ratio, cap 5; amounts :2101-2127 | raw aschar.as:2095-2130, :2325-2342 | OK | match; collar 0.01 and abdomen terms omitted by the scout |
| 51 | 143 | Overgrowth 0.35 and ozz 0.4225 'agree' on the chest share | raw ozz and aschar.as | DOWNGRADED | two code constants, one a UI default; not independent evidence |
| 52 | 157-158 | DrawnChaser::step each 240 Hz tick (model_rig.cpp:498-544; world_app.cpp:567-588) | main world_app.cpp:728-746 | OK | ease_poses called after each world step |
| 53 | 163-164 | place_figures at stage.cpp:256; model_rig.h:173 'next' | main stage.cpp, model_rig.h | OK | line 256 and line 173 as stated; end of 281 not checked |
| 54 | 173 | Chest rides 0.13 s trunk spring, head first (Authie) | PMC4458691; ground_code:119 | DOWNGRADED | Authie gives order only; 0.13 s is the first game's; RE-DERIVED from L188 WIP |
| 55 | 175 | Head looks where its path will be 0.26 s ahead | PMC4458691 | DOWNGRADED | orientation lag of walkers, not a path look-ahead; mechanism is [ours] |
| 56 | 170 | Head share 0.26 run, 0.64 walk, linear, held outside | Pontzer Fig. 3 text | DOWNGRADED | two speeds only; 3-9 m/s unsourced; marked [ours] for the line |
| 57 | 181-184 | Arms folded x1.50 shoulders, x1.85 head; weights x0.74, x0.87 | Pontzer Results p.528 | DOWNGRADED | arithmetic right; weights head P=0.26, shoulders P=0.049 |
| 58 | 219 | 24 figures; under 2 us each | ground_constraints_and_roster slots; main | OK | slots 1+6+6+9+0+0+2 = 24; cost is [inferred], nothing timed |
| 59 | 227-231 | First row is red on 31d1c6d: ratio 0.55 | main model_rig.cpp:615, tests | OK | by construction; Eye - Head rotated by head_twist (kinetic_chain) |
| 60 | 227 | Row at 3.0 m/s proves the head looks right when running | main model_rig.cpp:746 | DOWNGRADED | run = speed/6, so half amplitude; a constant passes; one speed |
| 61 | 234-235 | Pontzer 94 deg lag conflicts with landed antiphase row | G-sources:210; handback l180-lap2:166 | DOWNGRADED | pelvis lag already recorded as unmodelled (RE-DERIVED in part); 94 unsafe |
| 62 | 236-237 | Second lap: chest look share via trunk spring, head first | G-phys:46, :245; git a60944d | OK | RE-DERIVED: already built on origin/l188-wip-look, not to land |
| 63 | 244 | The nod might read as the 'up down' he rejected (195) | brief:1514 | UNSUPPORTED | item 195 is the stride's stomp, not a head nod |

Tally (63 rows): OK 44, DOWNGRADED 14, WRONG 3, UNSUPPORTED 2.

RE-DERIVED: 3 items (one more is partial). (a) Chest look share through the trunk spring, head first, offered as a second lap:
scout lines 236-237 against 46-48 and G-phys:46, :245 (origin/l188-wip-look a60944d already builds it). (b) The pelvis/thorax
timing lag offered as a new conflict: scout 234-235 against G-sources:210 (Preece, 'the pelvis lag is not modelled'). (c) Arms as
mass dampers against torso rotation, offered as NEW: scout 70-76 against brief:1193 and G-sources:211 (the idea at abstract level;
only Pontzer's figures are new).

Simplest build that passes the first row without doing what it is for: set kHeadTwistShare = 0.26 and stop. The row reads one
speed (3.0 m/s, where run = 0.5 halves the stride amplitude), the ratio of two ranges, and nothing else. It cannot see the walk end
(0.64), any speed from 3 to 9 m/s, the head's phase against the pelvis, or whether the hunter looks right. Only his eye decides that.

Mechanisms with no source and no [ours] mark: the 0.68 factor for a locked-on chaser (row 37); the 0.26 s path look-ahead is
marked [inferred] but the path look-ahead itself is [ours]; the 0.13 s chest lag is the first game's, offered as if from Authie; the
'quiet tell' that steadier head means it has you. The head_hold re-fix at 1000 deg/s is marked [ours], correctly.

Could not check: Pozzo 1990 beyond its abstract (paywalled; Dunbar's table is the only route to 14 +-4 and 7-16 cm); Lim et al.,
the primary of the 32%; Authie's supplementary results (shoulder and torso timing); the shape of Pontzer's Fig. 3C bars (text only, no
PDF renderer here, so the 93.9 duplication is judged from the printed numbers); ozz's chain code beyond :466-468; Overgrowth's
NOTICE file, if any; body.cpp:222-543, the end of stage.cpp:281 and the l205-stomp-c chain; the ground files' own citations
beyond those quoted. Nothing was built or run; no outside request carried any local text.

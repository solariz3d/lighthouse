# Ground reader: locomotion laws, the chaser kit and the yardstick, as the room has them (2026-11-13)

1. Built on main 31d1c6d: Alexander's stride law from each body's hip height, and the L200 running legs fitted to Fukuchi.
2. Not on main: the two pelvis laws (l205-stomp-c 900e3c4, unpushed) and the H1/H2 cornering law (l182 branches, off).
3. The owner chose H2 for the hunter, grip above human, and one animal trait per kind (T1-T4); no trait other than T1 is coded.
4. The yardstick scores hip/knee/ankle against Fukuchi (2.5-4.5 m/s) and arms against 25 CMU clips (2.67-4.15 m/s) only.
5. It cannot score a bend, a stop, a walk, a climb, a sidestep, a non-human body, or anything above 4.5 m/s.

## How to read this file

- Marks: [read] I opened the file and saw it; [summary] from another account; [inferred] mine. No [ours] here: I design
  nothing. A [read] on a record line means the RECORD says so. Whether the record's own source says so is the record's
  mark, repeated in words (for example "abstract only").
- Record paths are relative to C:/Users/nname/Desktop/lighthouse. Short names:

| short | path |
|---|---|
| H171 | exo_memory/handback/p-l171-movement-tech-E_2026-11-12.md |
| H172 | exo_memory/handback/p-l172-chaser-kit-E_2026-11-12.md |
| H187 | exo_memory/handback/p-l187-animal-locomotion-E_2026-11-12.md |
| H193 | exo_memory/handback/p-l193-yardstick-E_2026-11-13.md |
| H200 | exo_memory/handback/p-l200-legs-C_2026-11-13.md |
| H205 | exo_memory/handback/p-l205-stomp-C_2026-11-13.md |
| H205r | exo_memory/handback/p-l205-read-E_2026-11-13.md |
| H190, H191, H195 | exo_memory/handback/p-l190-arms-C_2026-11-12.md, p-l191-arm-shape-C_2026-11-13.md, p-l195-arm-variants-C_2026-11-13.md |
| D666 | exo_memory/handback/p-d666-entities-E_2026-11-11.md |
| H182 | exo_memory/handback/p-l182-lines-A_2026-11-12.md (not in my task list; opened only at the lines cited) |
| P187, P193 | exo_memory/loop/plan_l187_animal_locomotion_2026-11-12.md, plan_l193_motion_yardstick_2026-11-13.md |
| SR | exo_memory/loop/sprint_reference_2026-11-13/00_reference.md (and its reader files, same folder) |
| BR | exo_memory/briefs/dreamzone2_the_game.md |

- Game code: C:/Users/nname/Desktop/dreamzone-3, read with `git show`. main = 31d1c6d [read] (`git log -1 main`).
  Branches read: `l205-stomp-c` 900e3c4 (local only: `git branch -r --contains 900e3c4` printed nothing) [read];
  `origin/l182-lines` c357bbd and `origin/l182-hawk` ee55947, neither an ancestor of main [read]
  (`git merge-base --is-ancestor`).

## 1. The owner's words that govern locomotion (verbatim)

- 153: "well why the fk did we do all the research just to ignore it and do our own thing????????????????" [read] BR:1109
- 163: "its as if the hunter is moving too fast for the legs to keep up with needs to take longer strides, torso and arms
  need to swing more" [read] BR:1128
- 164: "is able to turn way too fast keeping speed, it needs to find better lines to keep speed, not abusing little speed
  scrub on turning" [read] BR:1131
- 165: "they have to link to the research, you have to build it in a way it will work, not just from my input alone"
  [read] BR:1133
- 166: "we should take the data from wild animals in nature and their locomotion, as well as humans since they are
  animals too" [read] BR:1138
- 167: "the hunter, and other entities, can take things from different animals, while being humanlike at the same time,
  to create that uncanny valley effect" [read] BR:1143
- 168: "I like 1, but believe it should still be humanoid in a way, all entities must be humanoid in nature with their own
  unique uncanniness" [read] BR:1150. The brief files "1" as the first option listed, H2 [read] BR:1150-1151, and
  records his "just re read what I said where is the confusion" confirming it [read] BR:1159.
- 177: "the arms are like too close to the sides of the body while moving" [read] BR:1189
- 180: "the elbows should be flared out more ... there needs to be more bend in the elbow when swinging" [read] BR:1205
  (the "..." is mine; the full line is there)
- 186: "v1 sourced flare looks the best" [read] BR:1485
- 195: "they are stomping when they stride like up down up down up down in a weird goofy way" [read] BR:1514
- Decision page picks, recorded verbatim as his clicks: `chase_entities-1` "Grip above human" [read] BR:1231;
  `chase_entities-6` "Tie hunter to player's surge" [read] BR:1269; `player_body-3` "Real first, stage where you ask"
  [read] BR:1279; `player_body-5` "New joints" [read] BR:1284, with his note on hands clenching and arms reacting to
  walls [read] BR:1286.
- Item 169 (the per-kind trait picks) is the librarian's filed summary, not his verbatim line [read] BR:1154. Treat its
  wording as the room's.

## 2. The laws in use, each with its source and where it sits

### 2.1 Stride from hip height (Alexander)

- The law: lambda/h = 2.3 (v^2/gh)^0.3, a step is half a stride; step = 1.15 h (v^2/gh)^0.3 [read] H187:29-33, :99.
  Source status as recorded: Alexander 1976 via Mazzetta & Blanco 2001 read in full; Alexander & Jayes 1983 and Weyand
  2000 unread (403) [read] H187:20-21, :262.
- Built on main: `stride_step` with `kStrideK = 2.3f`, `kStrideExp = 0.3f`, floor 0.1 h (ours) [read]
  dz3 main game/model_rig.h:350-353; game/model_rig.cpp:695-698. Hip height = hips over the lowest foot joint [read]
  model_rig.cpp:721-726.
- Checked in the header against Fukuchi (2.5-4.5) and Miyashiro (9.9 m/s): short of them by 0.6, 8.0, 11.1 and 2.3%,
  within 15% [read] model_rig.h:342-344. Above 10.97 m/s no human measured; the hunter runs to 12.6 [read] :344-345.
- Used by the hunter's drawn phase [read] game/world/stage.cpp:269. The test row is amended "L181" [read]
  game/tests/model_rig_tests.cpp:721-731.
- NOT used by the player's Body: its steps a second are `stride_rate x sqrt(speed)` and its foot-down length comes from
  `contact_length` [read] game/body.h:185-187, game/body.cpp:126-131. Same finding at L187 [read] H187:263.
- Limits as recorded: fitted on mammals; Donelan & Kram 1997 (read in full) reject it for stride under changed gravity
  [read] H187:34-35. Fr 8-12 at our speeds is above trackway ranges [read] H187:51.

### 2.2 Gait-change points

- Mammals walk to trot at s/h about 2.0 (Fr about 0.63), trot to run at 2.9 (Fr about 2.2), via Mazzetta & Blanco
  [read] H187:55-56. Human walk-run at about Fr 0.5 is a search summary only; 2.19 m/s for h 0.98 m [read] H187:57-58.
  [inferred] No gait switch from this law is in the code I read.

### 2.3 The running legs (L200, on main)

- Shapes fitted by least squares to Fukuchi's runners' means at 2.5/3.5/4.5 m/s; slopes go on to `kLegShapeTop` 7 m/s
  (ours) and stop; below 2.5 m/s they shrink to a stand (ours); hip drawn 10 degrees back (`kHipTilt`, ours) [read]
  dz3 main game/model_rig.h:356-387; H200:72-74.
- Scored: every joint passes at every speed, knee/ankle rms/sd 0.2-0.5 [read] H200:61-67.
- Main's pelvis "rides the deeper leg" [read] dz3 main game/model_rig.cpp:764. That rule is the stomp's cause [read]
  H205:180-185.

### 2.4 The two pelvis laws and their speeds (L205, NOT on main)

- Up to `kSprintFrom` 4.5 m/s: the pelvis follows the leg whose foot is down; in flight it goes from take-off to landing
  height, plus the throw's rise [read] dz3 l205-stomp-c game/model_rig.h:418-421; H205:32.
- From `kSprintBy` 5.5 m/s: "the runner's" hips, a spring and a throw (Blickhan 1989; McMahon & Cheng 1990 named in the
  comment), strike height less a half-sine dip; stance knee solved to keep the foot on the floor [read] model_rig.h:417-424;
  H205:33-34.
- Between 4.5 and 5.5: a blend, ours [read] H205:35; H205r:74.
- The travel table `kRunnerHips` from Dorn's SimTK runner JA1 pelvis centre: 3.53 / 5.19 / 6.97 / 9.47 m/s at
  103.3 / 86.3 / 63.2 / 47.2 mm of 1111.7 mm standing; held past 9.47 (ours) [read] model_rig.h:425-429.
- Legs past 4.5 refit to Dorn's runner (`kFastKnee`, `kFastAnkle`, `kFastHip`; band 4.5/5.2/7.0/9.49) [read]
  model_rig.h:410-416; fit RMS 1.8-5.7 degrees [read] H205:42.
- Take-off knee `kPushOffKnee` 15 (Dorn's 14.8); the papers' sprinters' 21-28.4 is the named alternative, left to his eye
  [read] model_rig.h:430-436; H205:46-51.
- Why two laws: Dorn's own angles through our skeleton with the follow law give 7.8-9.7% travel against a 5.7% / 4.2%
  bound [read] H205:28-31. E's independent build gets 16.6-19.9%, same verdict, different size [read] H205r:56-70.
- State: green at 900e3c4 (187 game tests, 0 failed; world 52/52) [read] H205:22-24; "Not pushed. Nothing lands without
  a landing word" [read] H205:12-13.

### 2.5 The cornering law

- H1, human: V_curve = V_o 0.746 (Rg/V_o^2)^0.363 (Chang & Kram 2007 Eqn 5, read via WebFetch, not as a PDF), fitted
  R 1-6 m, capped by sqrt(gR) and V_o (the caps inferred) [read] H187:62-66, :216-221, :261.
- H2, hunting animal: min(V_o, sqrt(mu g R)); "the sources' shape ... not a fit" [read] H187:216-230. Usherwood & Wilson
  2005 abstract only; Tan & Wilson 2011 abstract only; Wilson 2013 abstract plus a press page [read] H187:197-201.
  A later hand-back says Wilson 2013 was READ [read] H182:78 (I did not check its file).
- His choice: H2 for the hunter (item 168, §1), with grip above human ("Grip above human", BR:1231). mu 1.33 is a press
  figure for a cheetah [read] BR:1232; H187:224.
- Built? Only on branches, as a dial that is off by default: `X(turn_law, 0.0f, ...)` [read] dz3 origin/l182-hawk
  chase/speed.h:40; values 1 = H1, 2 = H2, 3 = hunter H2 and the rest H1 [read] origin/l182-lines chase/SPEED_MODEL.md:470-472;
  the hunter raised to H2 at `turn_law == 3` [read] origin/l182-hawk chase/run.cpp:309. `git grep turn_law main -- chase`
  finds nothing [read].
- On main, Eqn 5 exists only inside a test as a measuring limit, `curve_speed_eqn5` [read] dz3 main
  chase/tests/feel_tests.cpp:352-360.
- Arms run: a1 (`turn_law=1`) and a2 (`turn_law=3`, mu 1.0) scored at normal: flee never caught +14.7 to +18.0 points,
  walls 0.38-0.45 of control [read] H182:52. Grip arms g13/g16/g20 (mu 1.3/1.6/2.0; above 1.3 ours) registered, NOT RUN
  [read] H182:8, :83-85.

### 2.6 Arms (on main through L195 V1)

- Swing range from Bruening et al. 2020 (read in full, Table A3): shoulder range 43.72 F^0.671 degrees, elbow range
  21.68 F^0.718, F = v/sqrt(g l) [read] H191:25, :33-36. Elbow phase from Gravestock 2021 (racewalkers) [read] H191:41.
- Ours: `kElbowMean` 90, `kArmAbduction` 15, `kHandToMidline` 25, the ease at a stand, everything past F 1.36 (the
  hunter runs near F 3.4) [read] H191:42-46.
- L190's twist share `kArmTwistShare` 1.5 and growth exponent 0.3 are ours [read] H190:55-59. The twist leaks stand-off
  into the swing; the swing is now solved by bisection (`arm_swing_solved`, ours) [read] H195:73-79, :192-194.
- His pick V1: the stand-off follows Otsuka 2016's figure read off a plot (about 13.5 degrees front, 29 back) [read]
  H195:18, :243-248. Landed in 0324a7c, in main cc8eea8 [read] H195:258-261. V2 4ef2027 and V3 bba95c4 stay unlanded
  [read] H195:261.

## 3. The chaser kinds: kit, traits T1 to T4, and his picks

### 3.1 The trait catalogue (L187 §8.2)

| trait | what it is | source status as recorded | rig it touches |
|---|---|---|---|
| T1 greyhound cornering | contact timing and speed held on a bend | Usherwood & Wilson 2005, abstract | the turn law (L182, H2) |
| T2 bird head stabilisation | head held still in space, then thrust | Ortega 2009 abstract; Theunissen & Troje 2017 abstract | the chain's head end |
| T3 galloping back flex | trunk folds and extends each stride | Schilling & Hackert 2006 abstract; Kamimura abstracts | needs a spine joint |
| T4 insect gait timing | stride rate nearly fixed; speed from length | Full & Tu 1991 abstract | the stride law swap |
| T5 big-cat stalk | — | no source found; unsourced | — |

[read] H187:151-157. E's own note: T4 "is close to human sprinting" and may read as ordinary [read] H187:159; T2 and T3
"disagree most clearly with a human shape" [read] H187:160.

### 3.2 His picks per kind

- Hunter T1 only; sprinter T3; pack T4; interceptor T2; climber/crawler T4; stalker T2; charger T3 [read] P187:53-60;
  BR:1154 (librarian's summary, §1).
- Build order as filed: T1 in L182; T3 needs a spine joint (`game/body.h`); T2 and T4 touch the chain and stride law;
  the lesser kinds wait for humanoid models, "not yet planned" [read] P187:61.
- State [inferred, from these greps]: no code for T2, T3, T4 on main (`git grep -i "head hold|fixed rhythm|insect|
  galloping|back flex"` over game and chase: 0 hits) [read]; T1 exists only as `turn_law` on the l182 branches (§2.5).
- The body has 21 joints with Chest-Pelvis one segment [read] H187:155; `kJointCount` [read] dz3 main game/body.h:46.

### 3.3 The behaviour kit, separate from motion (L172, L171, D666)

- One signature per kind, all options: Hunter Appetite, Sprinter Lunge, Interceptor Mirror, Pack Call, Crawler Through,
  Stalker Unseen, Charger Charge [read] H172:49-57. Per-kind pathing levers P1-P3 [read] H172:75-83.
- Speeds per kind from `ref_speed 8 x row x dial(t) x ...`; rows: sprinter 1.45, interceptor 0.90, pack 0.92,
  crawler 0.80 [read] H172:17-20. Computed hunter 9.0 m/s at normal start, 13.4 at 10 min [read] H172:27-30.
- His later picks touching the kit: drop the wall pass (Through), the hunter loses you briefly, only crawler and pack
  climb: "Drop it" [read] BR:1260; "The hunter loses you briefly" [read] BR:1263; "Only crawler and pack" [read]
  BR:1266.
- D666's arc: lesser chasers hear along the walk graph, investigate slowly, scare or commit by phase; the hunter is
  excluded [read] D666:41-45, :112-119, :128-134. Registered R1-R8 [read] D666:23-32.
- Player speeds that chasers face: base peak 8.75 m/s, surge to +2.0, ceiling 12.4 at base [read] H171:88, :309;
  H172:36-37.

## 4. The yardstick (L193): what it measures, against whom, at which speeds

- Tool: `tools/yardstick` on main (merge cc8eea8 is an ancestor of main) [read] `git merge-base`; H193:5-6.
  Flags: `--data`, `--cmu`, `--clips`, `--content`, `--sheet <out.svg> <clip>`, `--player` [read] dz3 main
  tools/yardstick/main.cpp:330-335. Writes nothing but the sheet [read] main.cpp:1-8.
- Legs: hip, knee, ankle flexion (Cardan Z-X-Y, distal on proximal) against Fukuchi, Fukuchi & Duarte 2017, treadmill,
  2.5 / 3.5 / 4.5 m/s; tool counts 31 / 39 / 31 runners per speed [read] H193:63, :360-361. Output: RMS, runners' sd,
  rms/sd, best-fit lag, foot-down share [read] H193:119-134.
- Arms: shoulder forward swing and abduction against the trunk, elbow bend, hand over head, against 25 CMU running
  clips, three runners, 2.67-4.15 m/s [read] H193:86-87, :151-160. "The arm figures rest on three runners, so they are
  weak" [read] H193:174.
- Player: B's Body driven through the simulation at 2.50 / 3.47 / 4.52 m/s; every leg joint fails [read] H193:306-322.
- Contact sheet: one recorded CMU stride in eighths beside the hunter, as drawn [read] main.cpp:186-215. (H193:200
  says "not built yet"; the WHERE IT STOPS block lists `--sheet` [read] H193:23-24, so it came later.)
- Hunter speed coverage: none. "everything above is NOT covered. Nothing was extrapolated" [read] H193:196-197.
- The registered bars: leg joint rms/sd <= 1; elbow mean within 12.4 degrees; shoulder ends within 3.7 / 7.0 [read]
  H193:162-173.
- Past 4.5 m/s the legs are held by game test rows against Dorn's runner, not by the tool: row
  `past_fukuchis_speeds_the_legs_take_dorns_runners_shapes_within_the_readers_error` [read] H205:43-44 (branch only).

### 4.1 What it cannot score today

| move or body | why not | record |
|---|---|---|
| anything above 4.5 m/s (legs) or 4.15 m/s (arms) | no reference reaches it | [read] H193:196-197 |
| a bend or turn | moves he named "the sidestep and crossover, backwards, a turn" not built; clips fetched | [read] H193:200-201 |
| a sidestep, walking backwards | CMU clips exist (83_xx, 69_34..55, 69_50); no scoring built | [read] H193:65, :200-201 |
| a stop or start | no mode; the stop is gated by a game row (2 cm a tick) instead | [read] H205:56-63 |
| a walk | Fukuchi is running only; the tool's leg reference starts at 2.5 m/s | [read] H193:63; README main tools/yardstick/README.md:16-18 |
| a climb, vault, slide, roll, wall contact | not named anywhere in the tool | [inferred] from main.cpp:330-335 and README |
| a non-human body or trait (T1-T4) | human references only; "There is no instrument for eeriness" | [read] P187:45; H187:191 |
| a clench or finger motion | CMU's `fingers` channel constant 7.1 degrees in every running clip read | [read] H193:289-296 |
| the view from the eye | not built | [read] H193:201 |
| pelvis and thorax rotation, step length, cadence (planned) | not in the tool's output | [read] P193:21-24 against H193:79-94 [inferred] |

## 5. Datasets and sources in use, with licences as recorded

I did not read any licence text myself in this task. Each line is what the record says.

| data | used how | licence as recorded | record |
|---|---|---|---|
| Fukuchi 2017 data, figshare 4543435 v5 | test reference, outside every repo, fetched by script with checksums | CC BY 4.0 (figshare API line) | [read] H193:64; P193:4 |
| CMU Graphics Lab mocap | test reference (arms, sheet) | "free for use in research projects. You may include this data in commercially-sold products, but you may not resell this data directly, even in converted form"; acknowledgement asked | [read] H193:65; H187:89-92 |
| CMU mocapPlayer rev. 3 (Barbic & Zhao) | FK restated, "nothing was copied" | no licence file | [read] H193:66 |
| SimTK "runningspeeds" (Dorn, Schache, Pandy 2012) | game constants derived from it; test data | MIT ("Copyright (c) 2012, Stanford University") | [read] SR folder simtk_dorn_running.md:13-15 |
| Miyashiro 2019 | numbers in SR | CC BY 4.0 | [read] miyashiro2019.md:17-18 |
| Nagahara 2014 | numbers in SR | CC BY 3.0 | [read] nagahara2014.md:12-13 |
| von Lieres und Wilkau 2020 | numbers in SR | no open licence; repository copy non-commercial | [read] bezodis2019.md:23-24 |
| Bissas 2022 | numbers in SR | "All Rights Reserved"; non-commercial, no derivatives (repository copy) | [read] bissas2021.md:16-17 |
| Schache 2011 | numbers in SR | none stated; ACSM copyright | [read] schache2011.md:13 |
| Kätsyri 2015 / Saygin 2012 | uncanny findings | CC BY 4.0 / CC BY-NC 3.0 | [read] H187:122-123 |
| RGBD-Dog | not used | no licence file; release form unread; "study only" | [read] H187:25, :93 |
| DigiDogs | not used | non-commercial research, search summary | [read] H187:93 |
| ozz-animation `ik_two_bone_job.cc` soften | fetched for a later step | MIT | [read] H191:128-130 |

- The room's rule for all of it: "learn from, not use"; data never shipped or committed; no clip plays in the game
  [read] P193:4. The game stores fitted numbers, not recordings [read] dz3 main game/model_rig.h:362-364.
- E's reading: "The law ships; the data does not" [read] H187:94. No open animal locomotion data cleared for shipping
  was found [read] H187:94.

## 6. Every amendment a pane made to a registered gate or landed row, and why

1. L193, the leg bar: the hip is held to its RMS with each curve's mean removed; offset reported, not gated. Made
   "before anyone tuned to it", because the plain bar contradicted the tool's own note that the pelvis frames differ
   [read] H193:164-170.
2. L193, the tool's mutant `cardan_order` survived; row 12 added; `hand_dropped` replaced by `hand_dropped2` because it
   did not compile [read] H193:218-221.
3. L200: landed row `the_stand_in_gait_keeps_every_limb_its_own_length_and_stands_still_at_rest` amended by name; rule
   unchanged, construction replaced (stand-in had missed rest by 0.33 mm) [read] H200:79-83. Its falsifier "tripped, by
   a little": about 20 numbers registered, 24 used [read] H200:75-78.
4. L205, the hips gate: bound changed from the sacrum to the pelvis centre, and "highest in flight" became "in flight OR
   AT A STRIKE", because Dorn's runner is highest at the strike at 6.97 and 9.47 m/s [read] H205:52-54, :244-248.
   E, the yardstick's owner, reproduced it and agrees; the bound is looser at 9.47 by 6.1 mm, tighter below
   [read] H205r:14-45, :90-93.
5. L205, its own rows: rows 1 and 3 restricted to 2.5-4.5 m/s; gate places from `kHipPeakFrom`; foot row from
   `kHipPeakBy`; "no landed row was weakened" [read] H205:262-268. A take-off rule was corrected after a row caught it
   [read] H205:122-123.
6. L191: L190's row `the_arms_swing_further_the_faster_the_body_runs` amended by name, its rule from Otsuka to Bruening
   [read] H191:79-80. Two new rows moved into the chest frame before the red commit [read] H191:72-76.
7. L195: the same L190 row amended again, re-based to the chest's forward, "a correction of the row against its own
   source and is not done to let a variant through"; a new row added for every stand-off [read] H195:195-198.
8. L181 (from code, not a hand-back I was given): stride rows marked "AMENDED, L181" [read] dz3 main
   game/tests/model_rig_tests.cpp:222, :724.
9. L182 (A): arm list amended before more runs, and the method re-registered at brutal (L182f) [read] H182:63, :99.
10. L187: a correction to the plan's citation (Alexander & Jayes is J. Zool. 201:135-152) [read] H187:267.

## 7. What each hand-back names as owed

- H171: the movement menu to him with queue step 9 [read] H171:385. COD numbers unfound [read] :377.
- H172: the menu to him with the corrected premise first [read] H172:118; the speed table is computed, not measured;
  a bot sweep logging each chaser's speed would replace it [read] :109.
- H187: route §6 to C (L181) and A (L182); H1/H2/H3 to him [read] H187:269. Before H2 rests on read figures: Usherwood &
  Wilson full text (bend radius), Wilson 2013 full text [read] :114, :253.
- H193: the player's body, worst first: ankle at push-off, knee bend in stance, foot's time down; test the inference by
  lengthening `contact_length` and re-scoring [read] H193:14-17, :345-352. Not built: the moves (sidestep, crossover,
  backwards, turn), the view from the eye [read] :200-201. A finger-motion source if clenching is to be scored [read]
  :294-296.
- H200: "nothing is owed but his eye on the clips" if landed [read] H200:17. Toe sink 105-108 mm below 4.5 m/s found
  later and not fixed [read] H205:270-271.
- H205: a landing word; his eye on take-off knee 15 against 25 (no bar tells them apart) [read] H205:12-13, :49-51;
  6.7 mm first-tick residue, cause not established [read] :68; mutants missed two [read] :91-92; no frame cost reported
  [read] :116; the gate's 9.47 clause noted "not yet amended" in the trace, later amended [read] :282 against :52-54.
- H205r: part 2, the landing, when C rings its commit [read] H205r:93-94.
- H190: superseded by H191; the walk now swings more (25 degrees at 1.4 m/s), untested [read] H190:75-78.
- H191: next steps fetched for lane C: ozz `soften`; Valve's playback rate is declared and never used, so stride
  variation will cite the random 0.8-1.2 and 0.9-1.1 ranges instead [read] H191:125-137.
- H195: V2/V3 not landed; look-back capture never shows the hunter; following camera enters walls on the corner
  (L180 lap 2's fault, wider) [read] H195:108-118, :233-235. The swing centre sits 13-16 degrees forward of CMU's
  runners, shown not tuned [read] :217-218.
- D666: A builds hearing, state machine, scare moves, phase table, placement, then measures R1-R8 [read] D666:136-146.
- H182: the brutal sweeps a2, g13, g16, g20, a3, a6; Lap F (the flip) waits on them [read] H182:8.

## 8. Sprint reference (SR) in one paragraph

- Six sources; only Dorn/SimTK (one runner, JA1) has full-stride curves above 4.5 m/s, at 5.20 / 7.00 / 9.49 m/s
  [read] SR:10-21. Every row is n = 1; definitions are never pooled [read] SR:30-32.
- Nothing above 11.58 m/s in any source; no full curve above 9.49 [read] SR:271-280.
- For builders: at 9 m/s hip flexes to about 86 and extends to about -18 degrees, knee folds to about 148, arms swing
  about 120; contact 0.09-0.125 s, stance 22-27% [read] SR:544-548. Step rate steady vs sprinting disagree (4.35 vs
  4.6-4.85 /s) [read] SR:216-220, :553.
- Spot-check correction: the take-off knee gap is the runner, not definitions; 86 degrees is the top of his hip peak
  [read] SR:556-567.
- Second reader: 0 numbers wrong in any of the six files [read] SR folder 00_check.md table; about 675 checked in all
  [inferred] (my sum of its approximate counts).

## 9. Cost per character per frame

- No hand-back I read reports a frame cost for the procedural pose, the stride law or the pelvis laws. L205: "No frame
  cost is reported for the clip: the frame-time hold was on" [read] H205:116. [inferred] I could not estimate one.

## What I did not open

- The reader files in SR beyond their headings and licence lines (by the task's rule); `p-spotcheck-sprintref-E`.
- H182 beyond the grepped lines; the L181 and L185 hand-backs; `registration_l200_legs_C_2026-11-13.md`.
- Any licence text at its source (all licences above are as the record states them).
- Any paper; any URL. No web request was made.
- The game's `chaser.cpp`, `run.cpp` on main; `game/body.cpp` beyond :118-134; the yardstick's `sheet.h`, `player.h`.
- Wilson 2013's file that H182:78 says was read.

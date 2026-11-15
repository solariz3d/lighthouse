# Source sheet for N2: the trunk, the arms, the head and the lean (pane E, D677, 2026-11-15)

**What this is for.** It is written for the new animation system's next stage (N2 in
`loop/plan_animation_restart_2026-11-15.md:75`), so that N2 starts from what the room has already read and does not start
from nothing. His words, 13:28 and 13:29 (game brief item 236):
- "are you doing it from scratch instead if referencing research new and old?"
- "should be everything open source we can access for proc gen animationn techniques etc".

Tier: just do it.

**How to read it.** For each part there is one table. Each row gives:
- the rule;
- its numbers;
- where it is on file, as path:line;
- whether it was read at source.

After each table, a list says what is NOT on file.

**"At source"** repeats the record's own mark and its second reader's verdict. The marks used:
- **whole**: the paper, or the code, was read in full;
- **abstract**: only the abstract was read;
- **via**: a number taken from another paper's table;
- **first game**: his first game's constant, with no study behind it;
- **ours**: a room choice with no source;
- **DOWNGRADED / WRONG / UNSUPPORTED**: the second reader's verdict.

**What I opened for this sheet, and what I did not.**
- I re-opened none of the papers. Every number below is the record's, at the line given.
- Code lines in the record are dreamzone-3 main `31d1c6d` (2026-11-13). Those functions are the old ones the restart retires
  (`plan_animation_restart_2026-11-15.md:37-38, :68-69`). The new module carries a LAW over; it never calls the function.

**Read whole for this sheet:**
- `loop/animation_system_2026-11-13/scout_upper_body_and_gaze.md` (S-head)
- `scout_turning_and_transients.md` (S-turn)
- `scout_overgrowth_method.md` (S-og)
- `loop/b8_gaze_sources_B_2026-11-15.md` (B8, pane B's, outside the folder)

**Read in part:**
- `ground_locomotion_and_yardstick.md` (G-loco): :1-70, :130-219, :296-325
- `ground_code.md` (G-code): :96-175
- `00_system.md`: :139-183, :226-250, and a grep of its lines on these parts
- `plan_animation_restart_2026-11-15.md`: :20-119

The folder's paths below are relative to `exo_memory/loop/animation_system_2026-11-13/`.

**His words that govern N2** (as the scouts quote them; brief = `exo_memory/briefs/dreamzone2_the_game.md`):

| item | his words | where |
|---|---|---|
| 156 | "making the whole body work as one" | brief:1114 |
| 163 | "perhaps the head moves first when you look, then it moves the rest of the body underneath"; "torso and arms need to swing more" | brief:1128 |
| 177 | "the arms are like too close to the sides of the body while moving" | brief:1189 |
| 180 | "the elbows should be flared out more ... there needs to be more bend in the elbow when swinging" | brief:1205 |
| 186 | "v1 sourced flare looks the best" | brief:1485 |
| 214 | "on the corners, the torso doesnt orient itseld into the banking of a turn" | ground_his_words.md:528-533 |
| 217 | "tweak it from there to look uncanny in a realistic way that obeys physics" | brief:1607 |

- Item 151 is quoted at `ground_his_words.md:296-314`: "it will turn, and then lean, not lean into the turn".
- N2's own falsifier: "at N2's, the hands still reach forward as it runs" (`plan_animation_restart_2026-11-15.md:91-92`).

---

## 1. The trunk

| rule | numbers | on file | at source |
|---|---|---|---|
| The hips and shoulders counter-turn with the stride | pelvis 6.5 deg each way, thorax 14.28 deg each way | G-code:120-121; 00_system.md:147 | Perpiñá-Martínez 2023, Table 1, middle value taken (ours); Ford 2013, abstract |
| The thorax is in exact antiphase with the pelvis (today) | a landed row demands correlation under -0.5 | S-head:45-46 (model_rig.cpp:612, tests :651-686 on 31d1c6d) | ours (the shape) |
| The trunk's forward lean at a run (today) | 0.22 rad x run, where run = speed/6 | G-code:112 | none stated (a stand-in) |
| The trunk's forward lean in a hard start | upper trunk 34 +-8 deg to the horizontal at touchdown and 44 +-8 at toe-off (56 and 46 from vertical); the body leans 2 deg at touchdown and 43 at toe-off | S-turn:143-159 | King 2022, CC BY 4.0, Table 3, whole; DOWNGRADED: a four-step mean, and at toe-off 46 against 43 is inside an SD of 8 |
| The trunk's pitch shares (today) | pelvis 0.5, trunk 1.0, head 1.0 | G-code:118 | first game; S6 above supports the trunk's 1.0 (S-turn:220-223) |
| The trunk and head trail the pelvis on springs (today) | trunk 0.13 s, head 0.22 s, critically damped, omega = 2 / duration | G-code:119, :124 | first game |
| Breath | rate 0.9 + 4.0 x speed ratio rad/s, capped at 5 rad/s; amount 0.5 to 1; chest 0.01 up and 0.01 forward, turned 0.05 rad; neck 0.005; shoulders 0.002 (Overgrowth units) | S-head:159-162; S-og:80 (inertia mix(0.999, 0.99) a frame; half-lives 0.58 s up, 5.8 s down, S-og:97) | Overgrowth code, whole (Apache-2.0); the metres are inferred |
| Breathing locks to the stride | 2 strides a breath most common (11 of 14 runners); also 2.5, 3, 4 or none | S-head:130-134 | Daley 2013, CC BY, whole; DOWNGRADED: "stride" may mean a step; treadmill at 2.6 m/s |
| The chest's share of a look | see the head, row "look spread" | | |
| The trunk's share of a bank | see the lean | | |
| The galloping back flex (T3: sprinter, charger) | the trunk folds and extends each stride; needs its own spine pitch channel | 00_system.md:247-249; G-loco:157 | Schilling & Hackert 2006, abstract |

**Not on file for the trunk:**
- **Timing between pelvis and shoulders.**
  - Pontzer's 93.9 deg is unsigned, has a maximum of 180, is printed twice and disagrees with its own text, so it does not
    say who lags (S-head:5-8, :77-80; its second reader's rows 18-19).
  - Preece's pelvis lag is "not modelled" (S-head:266-267).
- **The counter-twist's size above treadmill speeds,** that is, how it scales up to the hunter's 9 m/s.
- **The trunk's steady forward lean at a run, by speed.** No source in the files read; only the start (King) and the stand-in
  0.22 x run. The sprint reference folder (`loop/sprint_reference_2026-11-13/`) was not opened for this sheet.
- **The trunk in a stop.** The braking trunk share 0.5 is ours. The only line read says "more upright and posterior", and it
  is UNSUPPORTED as a comparison of trunk with body (S-turn:173-176, :217-219).

## 2. The arms

| rule | numbers | on file | at source |
|---|---|---|---|
| The swing grows with speed and limb length | shoulder range 43.72 F^0.671 deg; elbow range 21.68 F^0.718 deg; F = v / sqrt(g l) | G-loco:139-140; G-code:131-132 | Bruening 2020, S1 Table A3, whole; DOWNGRADED at the hunter's speeds: past F 1.36 is ours, and the hunter runs near F 3.4 (00_system.md:146) |
| The elbow's phase | from racewalkers | G-loco:140 | Gravestock 2021 |
| The elbow stands off from the body (his pick V1, item 186) | about 13.5 deg front and 29 back; V1 = flare +0, front bend 106.5 deg, floor 80 deg | G-loco:145-147; G-code:134-135 | Otsuka 2016, Fig. 2, read by eye; front bend from Okajima 1996, pitch type; the floor and the line between are ours |
| Today's arm constants with no source | elbow mean 90 deg; abduction 15 deg; hand to the midline 25 deg; twist share 1.5; swing 0.1 to 1.05 rad; walk/run Froude 0.64 / 0.88 with an ours smoothstep | G-code:129-133, :138; G-loco:141-143 | ours |
| The arms are passive, powered from below: they damp the torso's and the head's rotation | arms folded: shoulders x1.50, head yaw x1.85; arm weights: x0.74 and x0.87 | S-head:70-83, :208-212 | Pontzer 2009, whole; DOWNGRADED: with weights the head's change is not significant (P = 0.26) and the shoulders' barely (P = 0.049) |
| So the arms swing relative to the chest, not fixed to the travel; "the arms turn with the chest as one piece" is the opposite | | B8:51-53, :66-67 | B's inference from Pontzer's abstract |
| Arms as particles (Overgrowth) | elbow and wrist carried by the body's velocity with drag 0.92 a frame; pulled to the keyed arm by mix(0.9, 0.97, loose), where loose = 1 - speed / max - threat; pull half-life 0.055 s at full speed, 0.19 s standing; velocity drag 10 s^-1 | S-og:77, :96 | Overgrowth code, whole; DOWNGRADED: loose is also 0 in combat, 0.7 in the air and 0 while flipping |
| The soft upper body (picture physics, N5) | trunk 0.005 s, arms 0.01 s; hands carry 13 cm past on a hard stop | 00_system.md:175 | ours, measured at frame dt |
| The yardstick's arm reference | 25 CMU running clips, three runners, 2.67 to 4.15 m/s; bars: elbow mean within 12.4 deg, shoulder ends within 3.7 / 7.0 deg | G-loco:196-204 | CMU, the record's licence line (G-loco:230); "the arm figures rest on three runners, so they are weak" |
| Arms at 9 m/s | swing about 120 deg | G-loco:305 | the sprint reference (one runner, Dorn JA1), via G-loco |
| The player's arms (today) | amplitude 0.06 + 0.30 x pace; raise 0.40 x pace; drop 0.52 - 0.18 x pace | G-code:174 | none; his pick lets them be tuned on their own (`player_body-4`, S-head:55-56) |

**Not on file for the arms:**
- **Arm data above 4.15 m/s,** apart from the one runner's ~120 deg at 9 m/s.
- **Any study of running with the chest turned** (B8:54).
- **The arms in a turn, a stop or a start.**
- **A clench or finger motion:** CMU's fingers channel is constant, 7.1 deg, in every running clip read (G-loco:219).
- **Hands meeting a wall:** that is N3's, and its rule is no hand more than 1 cm inside a static shape (00_system.md:414).
- **Why the hands reach forward** (N2's falsifier). Nothing on file measures it. B8:66-67's reading (the arms fixed to the
  chest's turn) is the one candidate cause on file.

## 3. The head (and the look)

| rule | numbers | on file | at source |
|---|---|---|---|
| The head turns less than the shoulders with the stride | running 3.0 m/s: shoulders 23.75 deg, head yaw 6.1 +-1.6, so 0.26; walking 1.5 m/s: 8.1 and 5.2, so 0.64; today's 0.55 | S-head:74-75, :194; 00_system.md:171 | Pontzer 2009, whole (the authors' copy on DASH, not an open licence); 0.55 is first game; DOWNGRADED: two treadmill speeds, n = 10, nothing above 3.0 m/s |
| The head nods at a run, opposite in phase to its rise | pitch 14 +-4 deg; vertical 7 to 16 cm; pitch and vertical about 180 deg out of phase | S-head:88-94 | Pozzo 1990, via Dunbar 2008 Table 2; DOWNGRADED: Pozzo's run was running in place; the phase is from Dunbar's introduction |
| The head leads: gaze first, then the head, then the pelvis; the head precedes the shoulders and torso | gaze leads the pelvis by 557 +-160 ms, the head by 264 +-134 ms; toward a curve's centre, gaze 27.5 +-6.9 deg and head 14.8 +-6.0 deg; all halved in the dark | S-head:96-104 | Authie 2015, CC BY, whole; DOWNGRADED for use: walkers at 0.80 m/s on memorised paths, and an orientation lag, not a path look-ahead |
| The head yaws ahead of the path in a turn | up to 25 deg (Imai, walking turns); 29.75 +-7.41 and 30.86 +-9.92 deg (Hicheur, figure-of-eight walking) | S-turn:120-128 | both abstract |
| The eyes carry the first part of a look, then the head | eye-only span 35.8 +-31.9 deg (about +-18); the head beyond it 0.77 deg per deg; standing turns to 180 deg start with the eye at ~0.5 s, the head ~0.6, the trunk ~0.7 and the feet ~1.1; the trunk turns more than the neck in large turns; the neck stays "far below 60-70 deg" | B8:15-21, :27-31, :58-62 | Stahl 1999 and 2001, abstract; Anastasopoulos 2009, abstract; Anastasopoulos 2015, whole; standing only |
| The look spread down the spine (today) | head 1, upper spine 0.65, chest 0.4225 | S-head:35-36; 00_system.md:148 | ozz sample, MIT; DOWNGRADED: a UI default (sample_look_at.cc:468), not a measurement |
| The chest's share of a look while moving | 0.35 (0.5 in a fighting stance, 0 off the ground); the chest's turn split half about the top of the abdomen and half about its bottom | S-head:145-148 | Overgrowth code, whole; DOWNGRADED: a floor in max(), not a measurement |
| Look clamps and rates | chest up to 1.0 rad of the look; head up to 0.91 rad past the chest; pitch 0.8 rad; head rate 15 rad/s; Valve's head up to 1000 deg/s with a 0.25 s ease-in, yaw 720 deg/s; the chase's look at least 7 rad/s and at most 1.6 rad off the heading | S-head:39-40, :149-150; 00_system.md:149 | Overgrowth code, whole; Valve SDK, study only; chaser.cpp |
| Look springs (Overgrowth) | per 120 Hz frame: chest damping 0.93, stiffness 0.5; head 0.9 and 0.8; as continuous springs: chest omega 7.7, zeta 0.56; head omega 9.8, zeta 0.64; the head leads | S-head:151-155; S-og:93-95 | Overgrowth code, whole; DOWNGRADED: these hold only with idle_look_amount 0; an idle AI gets 0.99 / 0.03 and a third-order head |
| The head's roll in a turn | today -0.30 (out of the turn); a study gives up to 8 deg of roll in walking turns at 0.4 g, side not stated | S-turn:120-124; 00_system.md:170 | first game; Imai 2001, abstract; DOWNGRADED for "+0.38 into the turn" |
| T2 head hold (interceptor, stalker) | the ROTATION held on its target, gain about 1 on all three axes; translation not held; 1.1 head saccades a second; re-fixed in one turn when the target passes 0.91 rad | S-head:106-118, :219-223; 00_system.md:172 | Theunissen & Troje 2017, CC BY, whole; DOWNGRADED: pigeons standing on a moving perch (at most 9 deg, 14 deg/s); the re-fix is ours |
| Looking down | head and eyes share a downward gaze at a constant ratio, no number; preferred sight line -28.6 deg sitting | B8:37-45, :63-65 | Delleman & Hin 2000, abstract; Hill & Kroemer, secondary |
| Locked on, the head steadies | x 0.68 on nod and yaw | S-head:202-203 | UNSUPPORTED: a lab task with screen feedback (Hamill's review of Lim) |
| First person: the camera is steadied apart from the head bone | Mirror's Edge (a hand-animated camera), Star Citizen (the head held steady, as birds do), the UE4 sample (aim at a far point) | B8:69-120; plan:115-117 | DICE slides, interviews and docs, through a summarising fetch |

**Not on file for the head:**
- **Any running study of the head in a turn,** or of gaze anticipation while running (S-head:104; S-turn:125).
- **The head's yaw share above 3.0 m/s.**
- **The eyes' and the neck's split of a downward gaze, in degrees,** and whether the upper back bends when looking down
  (B8:44-45). Today's spine pitch share of 0.25 is ours, and B names it as the likeliest cause of the head and upper back
  bowing (B8:63-65).
- **Real per-bone look splits from data** (B8:111).
- **A second-order exact form for a spring stepped at 240 Hz** (S-og:313-317), if Overgrowth's springs are used.

## 4. The lean (the whole body)

| rule | numbers | on file | at source |
|---|---|---|---|
| A running body leans from its feet by atan(a / g), with a the sideways acceleration (v x turn rate); grip caps it at atan(mu) | 45 deg at mu 1.0; 53 at 1.33; 63 at 2.0 | S-turn:195-200, :228-232 | physics; mu 1.33 is a press figure for a cheetah; 2.0 is ours; WRONG on "any human measured at 42 deg": 42 is computed from Chang & Kram's speeds |
| The same law in pitch, with the forward acceleration | a 9 m/s^2 start asks for 42.5 deg forward (blocks: 43 at toe-off); braking at -4.4 to -6.8 m/s^2 asks for 24-35 deg back, peaks -8.5 to -11 for 41-48 deg; the hunter's -14 asks for 55 deg | S-turn:201-205 | King 2022 and Harper 2022, CC BY, whole; Kugler & Janshen 2010, abstract (r = 0.93, no angle) |
| Measured on a bend: 7 sprinters at ~9.37 m/s | body lean -10.3 / -15.2 deg at touchdown, -8.2 / -14.1 at toe-off; trunk -12.8 / -9.9; that is 0.84 / 0.73 of gravity's lean at ~33 m radius, or 0.96 / 0.84 at a standard lane 2 (37.9 m) | S-turn:1-4, :93-114 | Churchill 2011 (ISBS, copyright kept, numbers only), whole; DOWNGRADED: the radius is not stated |
| The trunk's share of the lean | 0.89 of the measured body lean, 0.75 of gravity's | S-turn:5-6, :111-114; 00_system.md:169 | Churchill 2011, inferred from Table 2 (columns scrambled in the extraction, re-done by the second reader) |
| The pelvis's share | ~1.0 | S-turn:115-118 | UNSUPPORTED: no pelvis angle in the paper; hip adduction 10.6 deg means the leg is not in line with the trunk |
| A human's stride on a bend | inside step's contact +10% (0.105 to 0.116 s); step rate -2.4% (4.50 to 4.39 Hz); inside touchdown distance +20% (0.30 to 0.36 m) | S-turn:101-103, :224-227 | Churchill 2011, whole, at one speed and one radius |
| The greyhound (T1, the hunter): stride timing unchanged on a bend | a 65% rise in limb force at unchanged contact time means a / g = 1.31, so a 53 deg lean | S-turn:130-136 | Usherwood & Wilson 2005, abstract; the 1.31 is the second reader's inference |
| The body's facing follows the travel in a cut; only the head leads | | S-turn:181-186 | Jindrich 2006, abstract; DOWNGRADED: a model fitted to braking forces at 3 m/s |
| The lean's ease (today) | half-lives 0.1126 s and 0.0548 s; 0 off the feet | G-code:102-105; 00_system.md:150 | Overgrowth code, whole |
| The lean's timing | the simulation's own lean, atan(speed x turn / 9.81), leads the drawn lean; his 151 asks for a lean that is not late | S-turn:60-63, :447-449 | code read |
| What a large lean costs in space | the feet sit L sin(theta) outside the body's path; the hips drop L(1 - cos theta); at 45 deg on a 0.984 m hip, 0.70 m out and 0.29 m lower | S-turn:233-235 | geometry; the hunter's model hip is 1.196 m, the 0.984 m was the test skeleton (00_system.md:194) |
| Today | no whole-body lean: the feet stay under the hips; the drawn tilt is 1 deg per m/s^2, 1/5.8 of gravity's (a 1 g bend draws 9.8 deg where physics asks 45) | S-turn:9-10, :64-76 | code read |
| Shares in space, not stacked | if the whole body rolls about its feet and the trunk keeps 0.89 about the pelvis, the trunk gets 1.89 theta | S-turn:442-444; 00_system.md:266 | the second reader's catch |
| The player's g | the player's world rises at 23.4 m/s^2 and falls at 37.5, not 9.81; which g the player's lean uses is unstated | 00_system.md:237-240 | code read (sim/params.h:59-61 on 31d1c6d) |

**Not on file for the lean:**
- **A running measurement of lean against a / g beyond Churchill's one speed at one radius,** and that radius itself.
- **How the shares depend on speed or radius.**
- **A greyhound's or a cheetah's body roll on a bend.**
- **Cutting posture:** Dos'Santos, Dempsey and the cutting-trunk studies are not read (S-turn:343-347, :460-461).
- **The trunk against the body in a stop.**
- **What the yardstick needs to score a bend:**
  - a per-frame speed and radius;
  - a reference of lean against a / g;
  - speeds above 4.5 m/s.

  None of these exists (S-turn:453-456).
- **A cost:** no frame cost is measured anywhere in the record for any of these four parts (S-turn:276-279; S-head:245-249;
  G-loco:313-316).

## 5. What else is on file and not read for this sheet

- In the folder, by mentions of these parts (grep counts):
  - `scout_uncanny_by_physics.md`: 53 lean, 20 head;
  - `scout_player_first_person.md`: 76 head, 33 trunk;
  - `scout_shipped_systems.md`: 57 head, 24 trunk;
  - `scout_secondary_and_physics.md`: 22 arms, 13 trunk;
  - `00_build_path.md`: 57 lean, 40 trunk;
  - `ground_sources_read.md`: 21 lean.
- The sprint reference, `loop/sprint_reference_2026-11-13/`: Dorn's runner at 5.20 / 7.00 / 9.49 m/s.
- **The librarian's four research reports** (the chair's step 2): none was in `exo_memory/research/` when I wrote this. The
  newest there are dated 2026-11-13 and are about sound. Their rows go into this sheet as they are rung.

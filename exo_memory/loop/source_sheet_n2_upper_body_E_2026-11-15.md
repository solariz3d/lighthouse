# Source sheet for N2: the trunk, the arms, the head and the lean (pane E, D677, 2026-11-15)

**What this is for.** It is written for the new animation system's next stage (N2, `loop/plan_animation_restart_2026-11-15.md:75`).

**His words** (game brief item 236):
- 13:28: "are you doing it from scratch instead if referencing research new and old?"
- 13:29: "should be everything open source we can access for proc gen animationn techniques etc".
- 13:37: "always take relevant research and use it".
- At 13:36 he said the old build is scrapped.

**So the sheet cites research only:** published work or open-source code, with its source beside each line. The old build's
own constants are not sources here. Under each part they are listed only as WHAT NOT TO CARRY OVER. Tier: just do it.

**How to read a table.** One row per rule. Each row gives:
- the rule, with its numbers;
- the source;
- where it is on file, as path:line;
- whether it was read at source.

After each table come what is NOT on file and what not to carry over.

**"Read at source"** says who opened what:
- **reader, whole**: the room's scout read the primary whole. Its second reader's verdict follows (DOWNGRADED, WRONG,
  UNSUPPORTED) where there is one.
- **reader, abstract**: the scout read only the abstract.
- **agent, opened**: the librarian's research agent opened the page. Its two 2026-11-15 reports say "the librarian has
  opened none of its sources".
- **agent, snippet**: a search result only.
- **not opened**.

**What I opened, and what I did not.**
- I re-opened none of the primaries myself. Every number is the record's, at the line given.

**Read whole:**
- `research/procedural_animation_techniques_open_materials_2026-11-15.md` (R-tech)
- `research/open_locomotion_data_and_numbers_2026-11-15.md` (R-data)
- `research/open_source_procedural_animation_code_census_2026-11-15.md` (R-code). Its cautions: its "[read]" is a
  summarising fetch, not a line-by-line reading; three repositories have no licence (read only, never copied); Unity's
  Animation Rigging is for Unity projects only; Flax is under its own EULA (R-code:7-9).
- `research/running_foot_contact_and_foot_planting_2026-11-15.md` (R-foot), its upper-body lines only (:1-60, :95-140)
- `loop/animation_system_2026-11-13/`:
  - `scout_upper_body_and_gaze.md` (S-head)
  - `scout_turning_and_transients.md` (S-turn)
  - `scout_overgrowth_method.md` (S-og)
- `loop/b8_gaze_sources_B_2026-11-15.md` (B8, pane B's)

**Read in part:**
- `ground_locomotion_and_yardstick.md` (G-loco): :1-70, :130-219, :296-325
- `ground_code.md` (G-code): :96-175, for the not-to-carry lists only
- `00_system.md`: :139-183, :226-250
- `plan_animation_restart_2026-11-15.md`: :20-119

The 2026-11-13 folder's file names are given without their folder.

All four of the librarian's 2026-11-15 reports are in. Code rows give the licence beside the source.

**His words that govern N2** (as quoted at the lines given; brief = `exo_memory/briefs/dreamzone2_the_game.md`):

| item | his words | where |
|---|---|---|
| 156 | "making the whole body work as one" | brief:1114 |
| 163 | "perhaps the head moves first when you look, then it moves the rest of the body underneath"; "torso and arms need to swing more" | brief:1128 |
| 177 | "the arms are like too close to the sides of the body while moving" | brief:1189 |
| 180 | "the elbows should be flared out more ... there needs to be more bend in the elbow when swinging" | brief:1205 |
| 186 | "v1 sourced flare looks the best" | brief:1485 |
| 214 | "on the corners, the torso doesnt orient itseld into the banking of a turn" | ground_his_words.md:528-533 |
| 217 | "tweak it from there to look uncanny in a realistic way that obeys physics" | brief:1607 |

- Item 151 is at `ground_his_words.md:296-314`: "it will turn, and then lean, not lean into the turn".
- N2's falsifier: "the hands still reach forward as it runs" (`plan_animation_restart_2026-11-15.md:91-92`).

---

## 1. The trunk

| rule and numbers | source | on file | read at source |
|---|---|---|---|
| The thorax turns with the stride: 14.28 deg each way | Ford et al. 2013, Med Sci Sports Exerc 45(6) | ground_sources_read.md:209 | abstract only. NOT from Perpiñá-Martínez 2023 |
| ~~The pelvis turns 6.5 deg each way~~ CORRECTED 2026-11-15 (pane A, read at source): Perpiñá-Martínez 2023's 6.5 deg is PELVIC TILT, not the pelvis's turn, and the paper has NO thorax figure. The first iteration's pelvis twist (`kPelvisTwistAmp`) took a tilt for a turn | Perpiñá-Martínez et al. 2023, IJERPH 20(4):3631, PMC9961938 | ground_sources_read.md:208 (the misreading); the librarian's ring of 22:00Z | read at source by pane A; the earlier row was the record's reader, wrong |
| The thorax turns opposite the pelvis. Arm-to-trunk coordination is more out of phase walking, more in phase running, where the arm swing is larger. No degree figures could be verified | UMass thesis; Meyns 2013 review (doi 10.1016/j.gaitpost.2013.02.006) | R-tech:49 | agent, snippet (thesis); not opened (Meyns) |
| Pelvis-to-shoulder phase difference: running control 93.9 +-60.9 deg; walking control 149.2 +-41.5; 0 = peaks together, 180 = opposite | Pontzer et al. 2009, J Exp Biol 212:523 | S-head:77-80 | reader, whole; WRONG as "the shoulders lag": unsigned, at most 180; DOWNGRADED: 93.9 printed for two cells and at odds with the text |
| Trunk forward lean in a hard start: upper trunk 34 +-8 deg to the horizontal at touchdown, 44 +-8 at toe-off (56 and 46 from vertical); the body 2 deg at touchdown, 43 at toe-off; 14 sprinters, the first four steps from blocks | King, Burnie, Nagahara & Bezodis 2022, J Sports Sci (CC BY 4.0), Table 3 | S-turn:143-159 | reader, whole; DOWNGRADED: four-step means; at toe-off 46 against 43 is inside an SD of 8 |
| Pelvis ranges and trunk lean in acceleration or braking | none found | R-data:70 | the agent found no numbers |
| In a hard stop, a "more upright and posterior trunk" comes with more braking force on the penultimate foot contact | Jones et al., in Harper et al. 2022, Sports Med (CC BY 4.0), Table 1 | S-turn:173-176 | reader, whole; UNSUPPORTED as a trunk-against-body comparison: no angle given |
| The centre of mass moves vertically 7.2 cm at 3.5 m/s and 7.8 cm at 4.9 m/s running (difference not significant); about 5 cm walking | ISBS conference paper; J Biomech 2014 | R-data:66-68 | agent, snippet; a consumer source disagrees, unsettled |
| The trunk's vertical travel: a C7 (base of the neck) marker oscillates 9.4 +-1.8 cm at preferred speeds of about 8.9 to 12.9 km/h; near the walk-run speed the centre of mass drops 0.073 m in the first half of stance; it is lowered from walking to running to sprinting (no number) | Smith et al. 2022, PLoS One; Lee & Farley 1998; Novacheck 1998 | R-foot:48-51 | Smith: agent, opened; Lee & Farley: snippet of the abstract; Novacheck: opened through a text proxy |
| The pelvis's height is solved from the stance leg, not authored: run the measured leg angles up from the planted point; where a target is out of reach, move the root the least distance, smoothed; in flight carry the pelvis ballistically (about 1.0 to 1.8 cm of rise for 92 to 122 ms of flight); check it against 7 to 9 cm of oscillation | Kovar et al. 2002; Johansen 2009 thesis; Patoz 2022 (the flight times) | R-foot:100-107 | the agent's synthesis of sources it opened; the 1.0-1.8 cm is inferred |
| A spine solver: the chain bends up to a set angle per joint, with a weight curve along the chain and a twist | rbfx `Source/Urho3D/IK/IKSpineSolver.cpp` (MIT, C++) | R-code:21-24 | agent, fetched (summarised) |
| A damped spring stepped exactly whatever the time step: implicit Euler with denominator 1 + 2 h zeta omega + h^2 omega^2, half-life and critically damped wrappers, a quaternion spring that flips its target into the same hemisphere. The census names it as the base for "a few key poses plus springs", trunk lean and arm swing. It answers the gap S-og:313-317 left: Overgrowth's second-order springs do not convert to 240 Hz by changing dt | unity-cj-lib `NumericSpring.cs` (MIT, C#) | R-code:76, :89 | agent, fetched (summarised) |
| A transform that trails its parent: weight (1 - damp)^2, stepped at a fixed 60 Hz substep so it does not depend on frame rate | Unity Animation Rigging `DampedTransformJob.cs` | R-code:33 | agent, fetched; Unity Companion License (Unity projects only): the idea may be read, the code not used |
| Procedural breathing beyond Overgrowth's | none found | R-code:96 | the census looked for it |
| Breath: rate 0.9 + 4.0 x speed ratio rad/s, capped at 5; amount 0.5 to 1; chest 0.01 up and 0.01 forward, turned 0.05 rad; neck 0.005; shoulders 0.002; rising half-life 0.58 s at full speed, falling 5.8 s at rest | Overgrowth, `aschar.as:2086-2127, :2334-2339` (Apache-2.0) | S-head:159-162; S-og:80, :97 | reader, whole (code); the units read as metres is inferred |
| Breathing locks to the stride: 11 of 14 runners coupled, 2 strides a breath the most common; also 2.5, 3, 4 or none | Daley, Bramble & Carrier 2013, PLoS ONE (CC BY) | S-head:130-134 | reader, whole; DOWNGRADED: "stride" may be a step; treadmill at 2.6 m/s |
| The spine counter-twists when the legs run in a direction other than the body faces: a distribution weight puts all of it on the first spine bone at 1, none on the top bone at 0; threshold 90 deg | Unreal Engine, Orientation Warping docs | R-tech:34 | agent, opened |
| The spine bends along the path's curve, with a bend limit the path-finder respects | The Last Guardian, Tanaka CEDEC 2017 | R-tech:83 | agent, opened |
| The torso is held in the world frame by a servo: PD torque, kp up to 300 (1000 at the waist), kd = 0.1 kp, 0.005 s step | SIMBICON, Yin, Loken & van de Panne 2007 | R-tech:57 | agent, opened (physics control: N5's more than N2's) |
| Galloping back flex (T3: sprinter, charger): the trunk folds and extends each stride | Schilling & Hackert 2006 | G-loco:157 | abstract |

**Not on file for the trunk:**
- **The trunk's steady forward lean at a run, by speed.** No source in anything read. The sprint reference folder
  (`loop/sprint_reference_2026-11-13/`, Dorn's runner) was not opened for this sheet.
- **How far the pelvis turns with the stride, from any source.** The 6.5 deg once used for it is pelvic tilt (row above).
- **The counter-twist's size above treadmill speeds.**
- **A signed pelvis-to-shoulder timing.**
- **The trunk in a stop, in degrees.**
- **The data that would give these:** Schreiber & Moissenet 2019 (CC BY 4.0, 52 full-body markers with trunk and arms, walking
  only up to fast) and Reznick 2021 (starts and stops; its data licence is unconfirmed) (R-data:15, :18).

**What not to carry over (the old build, not a source):**
- the thorax in exact antiphase with the pelvis, and its row demanding correlation under -0.5 (S-head:45-46);
- the stand-in forward lean of 0.22 rad x speed/6 (G-code:112);
- the first game's pitch shares 0.5 / 1.0 / 1.0 and its follow springs, 0.13 s for the trunk and 0.22 s for the head
  (G-code:118-119);
- the player's run lean of 3 + 9 x pace deg (G-code:175);
- the spine pitch share of 0.25 when looking down (B8:63-65).

## 2. The arms

| rule and numbers | source | on file | read at source |
|---|---|---|---|
| The swing grows with speed and limb length: shoulder range 43.72 F^0.671 deg, elbow range 21.68 F^0.718 deg, F = v / sqrt(g l) | Bruening et al. 2020, S1 Table A3 | G-loco:139-140 | the record's reader, in full; DOWNGRADED at the hunter's speeds: measured up to Froude 1.36, and the hunter runs near 3.4 (00_system.md:146) |
| The elbow's phase in the swing | Gravestock 2021 (racewalkers) | G-loco:140 | the record's reader |
| The elbow stands off from the body: about 13.5 deg in front, 29 behind | Otsuka 2016, Fig. 2 | G-loco:145; G-code:134 | read by eye off a plot |
| The elbow's bend in front: 106.5 deg | Okajima 1996, pitch type | G-code:135 | the record's reader. His pick V1 (item 186) is this flare with this bend |
| Arm swing is powered from below and the arms act as passive mass dampers on the torso's and the head's rotation. Arms folded: shoulders x1.50, head yaw x1.85. Arm weights: x0.74 and x0.87 | Pontzer et al. 2009 | S-head:70-83, :208-212 | reader, whole; DOWNGRADED: with weights the head's change is not significant (P = 0.26) |
| Arm swing cancels the legs' angular momentum | UMass thesis; Meyns 2013 | R-tech:49 | agent, snippet |
| So passive arms hang from the shoulder girdle and swing relative to the chest, not fixed to the travel; arms that turn with the chest as one piece are the opposite | B's inference from Pontzer | B8:51-53, :66-67 | inferred |
| At very slow walking the arms swing twice a stride, switching to once a stride at 1.0 to 2.5 km/h, with hysteresis and large differences between people | Kerkman 2020 | R-data:81 | agent, snippet |
| Arms as particles: elbow and wrist carried by the body's velocity with drag 0.92 a frame (velocity drag 10 s^-1), pulled to the keyed arm by mix(0.9, 0.97, loose), loose = 1 - speed / max - threat; pull half-life 0.055 s at full speed, 0.19 s standing | Overgrowth, `movementobject.cpp:1769-1788` (Apache-2.0) | S-og:77, :96 | reader, whole (code); DOWNGRADED: loose is also 0 in combat, 0.7 in the air |
| A ragdoll is driven toward the animated pose by impulses or motors, still collidable; per frame: animation, then foot and hand IK, ragdoll, aim, skin; the animated pose must not break the constraint limits | Just Cause 2, Fuller & Nilsson, CEDEC 2010 | R-tech:59 | agent, opened (N5) |
| Hands are constrained like feet; the root is put in the intersection of four spheres | Kovar, Schreiner & Gleicher 2002, section 6 | R-tech:67 | agent, opened (N3: hands meeting a wall) |
| Arm and limb IK, open-source: an arm solver (rbfx `IKArmSolver.cpp`, `IKLimbSolver.cpp`, MIT, C++); analytic two-bone IK by the law of cosines with a pole and a maximum angle (Babylon.js `boneIKController.ts`, Apache-2.0); constrained FABRIK with cone and hinge limits (caliko, MIT) | rbfx; Babylon.js; caliko | R-code:20-21, :35 | rbfx's arm solver: listing only; Babylon and caliko: agent, fetched (summarised) |
| Pose following for a physical arm, independent of mass and time step: stiffness k = m alpha / dt^2, damping d = zeta 2 sqrt(k m), maximum force = maximum acceleration x mass | Hairibar.Ragdoll `AnimationMatching.cs` (MIT, C#) | R-code:62, :87 | agent, fetched (summarised) (N5) |
| Strength after a hit: it drops at 1 a second on contact and comes back at 0.05 a second; gains lerped from a 0.1 floor | ActiveRagdoll `SlaveController.cs` (MIT, C#) | R-code:63, :88 | agent, fetched (summarised) (N5) |
| Stable PD for a powered ragdoll at high gains: solve (M + h Kd) a = Kp e + Kd e' - C, then tau = Kp e + Kd (e' - h a) | DeepMimic `ImpPDController.cpp` (MIT, C++; the PD needs no learning) | R-code:60, :85 | agent, fetched (summarised) (N5) |
| Secondary motion: Verlet with world and parent-relative velocity damped apart; collision, angle elasticity, length elasticity and an angle-limit cone, in that order; the result slerped back onto the animated pose by a blend | JigglePhysics `JiggleJobSimulate.cs` (MIT, C#) | R-code:74, :90 | agent, fetched (summarised) (N5) |
| Arm reference data, running: 25 CMU clips, three runners, 2.67 to 4.15 m/s, "free for all uses". Bars on file: elbow mean within 12.4 deg, shoulder ends within 3.7 / 7.0 | CMU Graphics Lab | G-loco:196-204, :230; R-data:41 | the record's reader; "the arm figures rest on three runners, so they are weak" |
| Arm reference data, walking with arms: 50 adults, 0 to fast, 52 markers | Schreiber & Moissenet 2019 (CC BY 4.0, figshare 10.6084/m9.figshare.7734767) | R-data:15 | agent, opened (the record); joint angles to be computed |
| Arms backwards and sideways: 100STYLE, 100 styles, forward, backward and sidestep walks and runs, 28 bones, one performer | Mason, 100STYLE (CC BY 4.0, commercial with credit) | R-data:24 | agent, opened |
| Arms at 9 m/s: swing about 120 deg | Dorn, Schache & Pandy, SimTK runner JA1, via the sprint reference | G-loco:305 | the record's reader; n = 1 |
| **The elbow's range at a sprint** (his item 239, "i swear the elbows dont swing"). One runner, overground, steady, right arm; elbow = 180 minus the shoulder-elbow-wrist marker angle, flexion positive; standing reads 20.5. Read at the 10% columns of the stride: at 5.20 m/s 65.5 to 132.6 deg (range 67.1); at 7.00 m/s 60.4 to 129.0 (68.6); at 9.49 m/s 38.2 to 121.2 (83.0), and between columns it opens to 34.4 at 9.49. The elbow folds most near 40% of the stride (121-133 deg) and opens most after 60% | Dorn, Schache & Pandy 2012, J Exp Biol 215:1944, SimTK data package (MIT as recorded), computed from the raw markers by the sprint reference's reader | `loop/sprint_reference_2026-11-13/00_reference.md:158-164, :238` | the record's reader, whole data; its second reader re-ran all 44 elbow cells within 0.6 deg; n = 1; marker error about +-3 deg |
| The elbow in 200 m Olympic finalists: faster sprinters had a greater elbow displacement, 84 deg against 67 for slower ones (shoulder 135 against 118) | Ralph Mann, via SimpliFaster (https://simplifaster.com/?p=10224); the primary publication is not named there | none before this sheet | secondary only, found by a web search 2026-11-15 (https://ojs.ub.uni-konstanz.de/cpa/article/view/4403/4094 was fetched and could not be read as text); not verified against Mann's paper |

**Not on file for the arms:**
- **Arm angles above 4.15 m/s from more than one runner.** One runner's shoulder (~120 deg at 9.49 m/s) and elbow (above)
  are on file. The yardstick's own arm reference stops at 4.15 m/s; the sprint reference goes to 9.49. Corrected
  2026-11-15: this line first said only the shoulder was on file. The plan's "no elbow range above 4.15 m/s is on file"
  (`plan_animation_restart_2026-11-15.md:360`) misses the same rows.
- **Any study of running with the chest turned** (B8:54).
- **The arms in a turn, a stop or a start.**
- **A clench:** CMU's fingers channel is constant at 7.1 deg (G-loco:219).
- **What makes hands reach forward.** Nothing on file measures it. The one candidate cause is B8:66-67's: arms fixed to the
  chest's turn, where the research says they swing from below and relative to the chest.

**What not to carry over:**
- elbow mean 90 deg, abduction 15, hand to the midline 25, twist share 1.5, swing 0.1 to 1.05 rad, the walk/run smoothstep,
  V1's floor of 80 deg (all "ours"), and the 40-step bisection solver (G-code:129-138; G-loco:141-144);
- the player's arm laws, 0.06 + 0.30 x pace and the rest (G-code:174);
- arms that turn with the chest as one piece (B8:66-67).

## 3. The head (and the look)

| rule and numbers | source | on file | read at source |
|---|---|---|---|
| The head turns less than the shoulders with the stride. Running 3.0 m/s: shoulders 23.75 deg, head yaw 6.1 +-1.6, so 0.26. Walking 1.5 m/s: 8.1 and 5.2, so 0.64 | Pontzer et al. 2009 | S-head:74-75 | reader, whole (authors' copy, not an open licence); DOWNGRADED: n = 10, two treadmill speeds, nothing above 3.0 m/s |
| The head pitches at most 20 deg in walking, walking in place, running in place and hopping; human run: pitch 14 +-4 deg, vertical 7 to 16 cm; pitch and vertical about 180 deg out of phase | Pozzo, Berthoz & Lefort 1990, via Dunbar et al. 2008 Table 2 | S-head:88-94; R-data:84 | via; Pozzo abstract (snippet); DOWNGRADED: Pozzo's run was in place; Dunbar 2011 disputes the stability |
| The head leads: gaze first, then the head, then the pelvis; the head precedes the shoulders and the torso. Gaze leads the pelvis by 557 +-160 ms, the head by 264 +-134 ms; toward a curve's centre, gaze 27.5 +-6.9 deg and head 14.8 +-6.0 deg; all halved in the dark | Authie et al. 2015, Front Hum Neurosci (CC BY) | S-head:96-104 | reader, whole; DOWNGRADED for use: walkers at 0.80 m/s on memorised paths, an orientation lag |
| In turns the head anticipates by about 200 ms; for 90 deg turns the head starts 0.2 to 0.6 s before the trunk; it turns at a constant distance from the corner, not a constant time | Grasso 1996; Sreenivasa 2008; Prévost 2002 | R-data:85 | agent, snippet (all three) |
| The head yaws ahead of the path: up to 25 deg (walking turns); 29.75 +-7.41 and 30.86 +-9.92 deg (figure of eight, walking) | Imai et al. 2001; Hicheur et al. 2005 | S-turn:120-128 | abstracts |
| The eyes carry the first part of a look: eye-only span 35.8 +-31.9 deg (about +-18), the head beyond it 0.77 deg per deg. Standing turns to 180 deg: eye ~0.5 s, head ~0.6, trunk ~0.7, feet ~1.1. The trunk turns more than the neck in large turns; the neck stays "far below 60-70 deg" | Stahl 1999, 2001; Anastasopoulos 2009, 2015 | B8:15-31 | abstracts; Anastasopoulos 2015 whole; standing only |
| Decide the head's position and rotation first, then solve the neck; put the neck's rotation axis as far forward on the head as possible; lower the head and body when ceiling sensors trigger | The Last Guardian, Tanaka CEDEC 2017 | R-tech:51 | agent, opened |
| A look-at sets a frame, so a nod still works on top of it; soft joint limits damp it as the target goes behind | Spore, Hecker et al. 2008 | R-tech:52 | agent, opened |
| A look-at has separate weights for body, head and eyes, plus a clamp (0.5 = half the range, 180 deg); no defaults given | Unity, Animator.SetLookAtWeight | R-tech:50; B8:104 | agent, opened |
| The neck and the head each take half of a look's rotation, clamped to +-80 deg and slerped | runevision LocomotionSystem `HeadLookController.cs` (MPL-2.0: file-level copyleft, so a copied file stays MPL) | R-code:42-47 | agent, fetched (summarised) |
| A humanoid's head and eye look-at with maximum angles and speeds | Wicked Engine `wiScene_Components.h`, HumanoidComponent (MIT, C++) | R-code:30 | agent, the header only |
| A head solver | rbfx `IKHeadSolver.cpp` (MIT, C++) | R-code:21 | listing only, not opened |
| The chest takes 0.35 of the look while moving (0.5 in a fighting stance, 0 off the ground); its turn split half about the top of the abdomen and half about its bottom; clamps chest 1.0 rad, head 0.91 rad past the chest, pitch 0.8 rad; head rate 15 rad/s | Overgrowth, `aschar.as:4358-4392`, `movementobject.cpp:2227-2439` (Apache-2.0) | S-head:143-150 | reader, whole (code); DOWNGRADED: 0.35 is a floor in max(), not a measurement |
| Look springs per 120 Hz frame: chest damping 0.93, stiffness 0.5; head 0.9 and 0.8 (continuous: chest omega 7.7, zeta 0.56; head omega 9.8, zeta 0.64); the head leads the chest | Overgrowth, `aschar.as:14162-14165` | S-head:151-155; S-og:93-95 | reader, whole; DOWNGRADED: true only with idle_look_amount 0; an idle AI's chest gets 0.99 / 0.03 |
| The look spread down the spine: head 1, upper spine 0.65, chest 0.4225 | ozz-animation, `sample_look_at.cc:468` (MIT) | S-head:35-36, :165-166 | reader, whole; DOWNGRADED: a sample's slider default, not a measurement |
| Head rates: up to 1000 deg/s with a 0.25 s ease-in; body yaw 720 deg/s, eased | Valve Source SDK (study only) | 00_system.md:149 | the record's reader |
| A head's roll in a walking turn at 0.4 g: up to 8 deg; side not stated | Imai et al. 2001 | S-turn:120-124 | abstract; DOWNGRADED for "into the turn" |
| The head's ROTATION held on a target, not its position (T2: interceptor, stalker): gains about 1 and phases about 0 on all three axes at 0.25 to 2 Hz; translation followed the platform; 1.1 head saccades a second | Theunissen & Troje 2017, Front Neurosci (CC BY) | S-head:106-118 | reader, whole; DOWNGRADED: pigeons standing on a moving perch, at most 9 deg and 14 deg/s |
| Looking down: head and eyes share a downward gaze at a constant ratio (no number); sight line -28.6 deg sitting upright | Delleman & Hin 2000; Hill & Kroemer 1986 | B8:39-40 | abstract; secondary |
| First person: no shipped game keeps a raw camera on a head bone of a body drawn from motion. Mirror's Edge animates the camera by hand; Star Citizen holds the head steady as birds do; the UE4 sample aims the head at a far point, with an aim offset of 10 additive poses, yaw clamped to +-91 deg, and the camera updated at the end of the controller tick | DICE slides; Star Citizen interviews; Game Developer article | B8:69-120; R-tech:53, :73 | agent, opened (through a summarising fetch); plan:115-117 rules "a camera on that body, steadied apart from the head bone" |

**Not on file for the head:**
- **A running study of the head in a turn,** or of gaze anticipation while running.
- **The head's yaw share above 3.0 m/s.**
- **The eyes' and neck's split of a downward gaze, in degrees,** and whether the upper back bends when looking down (B8:44-45).
- **Real per-bone look splits from data** (B8:111).
- **Head markers in the open walking data:** Schreiber & Moissenet has none (R-data:15).

**What not to carry over:**
- the first game's 0.55 head share of the thorax's twist (S-head:43-44);
- its head roll of -0.30, out of the turn (00_system.md:170);
- its 0.22 s head spring (G-code:119);
- the "new look" jump of 0.52 rad and the gait's 1.3 rad look limit, both ours (G-code:110-111);
- the locked-on x0.68 steadying (UNSUPPORTED, S-head:202-203);
- the body hung from the camera, with one yaw for the pelvis, the chest and the head (00_system.md:273).

## 4. The lean (the whole body)

| rule and numbers | source | on file | read at source |
|---|---|---|---|
| A running body leans from its feet so that the ground force passes near its centre of mass: lean = atan(a / g), a = v x turn rate; with grip mu the lean is at most atan(mu): 45 deg at mu 1.0, 53 at 1.33 | Newton (physics); the 1.33 is a press figure for a cheetah | S-turn:195-200, :228-232; R-tech:45 | physics. The R-tech agent found no public GAME rule for leaning into acceleration and calls atan(a/g) its own derivation; the law is the physics, not a game's |
| The same in pitch with forward acceleration: a 9 m/s^2 start asks for 42.5 deg; sprinters from blocks reach 43 deg at toe-off | King et al. 2022 (CC BY 4.0) | S-turn:149-159, :201-203 | reader, whole; DOWNGRADED: a four-step mean |
| Measured on a bend, 7 sprinters at ~9.37 m/s: body lean -10.3 / -15.2 deg at touchdown, -8.2 / -14.1 at toe-off; trunk -12.8 / -9.9; 0.84 / 0.73 of gravity's lean at a ~33 m radius, 0.96 / 0.84 at a standard lane 2 (37.9 m) | Churchill, Salo & Trewartha 2011, ISBS (copyright kept; numbers only) | S-turn:1-4, :93-114 | reader, whole; DOWNGRADED: radius not stated |
| The journal version: speed 4.7% lower on the bend (9.86 to 9.39 m/s left steps, 9.80 to 9.33 right); the left step loses frequency (-0.11 Hz), the right loses length (-0.10 m); inward lean at touchdown 14 deg left, 11 right | Churchill et al. 2015, via a citing paper | R-data:69 | agent, snippet |
| The trunk carries 0.89 of the measured body lean, 0.75 of gravity's | Churchill 2011, Table 2 | S-turn:5-6, :111-114 | reader, whole, inferred from scrambled columns re-done by the second reader |
| A human's stride on a bend: inside step's contact +10% (0.105 to 0.116 s), step rate 4.50 to 4.39 Hz, inside touchdown distance 0.30 to 0.36 m | Churchill 2011 | S-turn:101-103 | reader, whole; one speed, one radius |
| The greyhound keeps its foot-contact timing on a tight bend and takes a 65% rise in limb force (so a / g about 1.31, a 53 deg lean) | Usherwood & Wilson 2005, Nature | S-turn:130-136 | abstract; the 1.31 is the second reader's inference |
| The body's facing follows the travel in a cut ("body rotation should match COM deflection", 70% of braking-force variance); only the head leads | Jindrich, Besier & Lloyd 2006 | S-turn:181-186 | abstract; DOWNGRADED: a model, at 3 m/s |
| Braking: average decelerations -4.24 and -4.99 m/s^2 in a hard stop after a 20 m sprint, approach 7.37 to 7.80 m/s, 27 athletes; peaks about -5.7 to -6.3, acceleration peaks 4.4 to 4.7; as leans, 24 to 35 deg back on average and 41 to 48 at -8.5 to -11 | Harper et al. 2020, Sports; Harper et al. 2022, Sports Med (CC BY 4.0) | R-data:88-89; S-turn:167-179, :201-205 | 2020: agent, opened; 2022: reader, whole; peaks: snippet |
| The lean's ease: target from velocity and low-passed acceleration, half-lives 0.1126 s and 0.0548 s (0.95 and 0.9 a frame at 120 Hz); 0 off the feet | Overgrowth, `aschar.as:7921-7940` (Apache-2.0) | 00_system.md:150 (ground_sources_read.md:34-38) | the record's reader, code |
| The whole body tilts about the frame's centre of mass, every joint together | Overgrowth, `aschar.as:13922-13934` | S-og:65 | reader, whole (code) |
| The body's pivot moves between the centre of mass (0) and the feet (1) | Unity, Animator.feetPivotActive | R-tech:37 | agent, opened |
| A semi-procedural walker's body: ground-hug and acceleration tilt, with the hips' height combined from each leg's desired and maximum reach | runevision LocomotionSystem `LegAnimator.cs` (MPL-2.0); Johansen 2009 thesis | R-code:42-45, :81; R-foot:107 | agent, fetched (summarised); the thesis through a text proxy. The tilt's law is not given in the summary |
| A rotation correction slerped in across a window of the clip, the root's motion re-chained after it | Esoterica `Animation_RuntimeGraphNode_OrientationWarp.cpp` (MIT, C++) | R-code:25-27 | agent, fetched (summarised) |
| Balance by the centre of mass: its offset d from the stance foot and its velocity v, in a frame that turns with the heading, feed the swing target; the hips share the torque by the stance foot's weight | cartwheel-3d `SimBiController.cpp` (Apache-2.0, C++; Coros et al. 2010) | R-code:59, :84 | agent, fetched (summarised) (physics control; N5's) |
| What a large lean costs in space: the feet sit L sin(theta) outside the path; the hips drop L(1 - cos theta); with L = 1.196 m (the hunter model's hip), 45 deg is 0.85 m out and 0.35 m lower | geometry | S-turn:233-235 (worked there at 0.984 m); 00_system.md:194 for 1.196 m | arithmetic, mine at 1.196 m |
| Rolling the whole body about its feet and then adding a trunk share about the pelvis counts the trunk twice (1.89 theta); the shares have to be set in space | the second reader's catch | S-turn:442-444; 00_system.md:266 | reasoning |
| The player's world does not fall at 9.81: it rises at 23.4 m/s^2 and falls at 37.5, so which g the player's lean uses is a choice not yet made | game physics (`sim/params.h:59-61`) | 00_system.md:237-240 | code read |

**Not on file for the lean:**
- **A running measurement of lean against a / g beyond Churchill's one speed and one radius,** and that radius itself.
- **How the shares change with speed or radius.**
- **A greyhound's or a cheetah's body roll on a bend.**
- **Cutting posture:** Dos'Santos, Dempsey and the cutting-trunk studies are unread (S-turn:343-347).
- **Open data of block starts, sprint acceleration or bend running with kinematics** (R-data:19).
- **What the yardstick needs to score a bend:**
  - a per-frame speed and radius;
  - a reference of lean against a / g;
  - speeds above 4.5 m/s (S-turn:453-456).

**What not to carry over:**
- the drawn tilt gain of 1 deg per m/s^2, which is 1/5.8 of gravity's, so a 1 g bend draws 9.8 deg where physics asks 45
  (S-turn:64-66);
- the feet held under the hips with no whole-body lean (S-turn:67-76);
- the first game's bank shares, pelvis 1.0, trunk 0.35, head -0.30, about the pelvis (G-code:117);
- the outside foot set up to 10 cm wider, ours (G-code:151);
- the 0.30 m hip-sink clamp (G-code:153).

**Not measured for any part:** a frame cost. No cost is recorded anywhere (S-turn:276-279; S-head:245-249; G-loco:313-316).
Bollo's inertialization (12 us against 30 us for a blend, R-tech:20) is the only timing in the reports, and it is for
transitions.

## 5. The data from which N2's own targets could be measured

The R-data agent's advice is that **joint-angle targets should be measured from these datasets, not taken from the
literature** (R-data:9). Open datasets with the upper body, and their licences (R-data:14-46, :101-118):

| dataset | upper body | licence | read at source |
|---|---|---|---|
| Schreiber & Moissenet 2019 | trunk, arms, hands; no head; walking 0 to fast | CC BY 4.0 | agent, opened |
| 100STYLE | full body, 28 bones, forward, backward, sidestep, one performer | CC BY 4.0, commercial with credit | agent, opened |
| CMU | full body; running clips, turns, stops | "free for all uses", not resold as data | agent, opened |
| Scherpereel 2023 | cutting, jumps, lunges, 31 tasks | Attribution 4.0 | agent, snippet |
| AddBiomechanics 1.0 | full-body models, centre-of-mass motion | CC BY 4.0 (core) | agent, opened |
| LAFAN1, AMASS, Bandai Namco | full body; sprints, runs, jumps | non-commercial | agent, opened. Not usable if the game is ever sold |

## 6. Also on file, not read for this sheet

- In `loop/animation_system_2026-11-13/`:
  - `scout_uncanny_by_physics.md`
  - `scout_player_first_person.md`
  - `scout_shipped_systems.md`
  - `scout_secondary_and_physics.md`
  - `00_build_path.md`
  - `ground_sources_read.md`
- The sprint reference, `loop/sprint_reference_2026-11-13/`.
- The four reports' other topics: feet, IK, transitions, traversal and creatures. They are the legs' (N1), the world's (N3)
  and the states' (N4).

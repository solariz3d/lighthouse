# Scout: judging motion with numbers (the evaluation side of the animation system), 2026-11-13

1. The room scores joint ANGLES against recorded runners (2.5-4.5 m/s) but has no check that a foot stays put, that a body
   in flight falls at g, or that it does not sink into the floor; those are the measures the research uses most.
2. The studies that test measures against viewers find that no simple number agrees with people much above chance
   (jerk 65%, ground contact 72%, foot-floor penetration 54% of pairs, chance 50%); numbers catch defects, his eye judges.
3. Design: one pure module of physics checks over any BodyPose sequence (no reference needed), the yardstick's bands per
   movement where open data exists, a mask that frees ONE channel per kind, and a CPU timer beside the stage's sync timer.
4. First lap: "the hunter's planted foot stays where it landed", the row the player already has. My arithmetic on main's
   own curves says the hunter's stance foot slides about 0.17-0.45 m per step; the bar is 20 mm (a perception study).
5. Not built: learned critics, distribution scores (FID), whole-gait jerk or SPARC gates, any recording in the repo.

Scout, read-only. Marks: [read] I opened it; [summary] secondary or abstract-only; [inferred] mine; [ours] a proposal.
Game code is dreamzone-3 main **31d1c6d** unless a branch is named. Record paths are relative to
`C:/Users/nname/Desktop/lighthouse/exo_memory`. G-names are the six ground files in this folder:
G-his `ground_his_words.md`, G-src `ground_sources_read.md`, G-phys `ground_physics_and_fp_body.md`,
G-loc `ground_locomotion_and_yardstick.md`, G-code `ground_code.md`, G-con `ground_constraints_and_roster.md`.

## 1. What the room already has for this aspect

| what | where it is | ground line |
|---|---|---|
| The yardstick: hip/knee/ankle flexion vs Fukuchi 2017 (2.5/3.5/4.5 m/s), arms vs 25 CMU clips (2.67-4.15 m/s); RMS, runners' sd, rms/sd, best lag, foot-down share | `tools/yardstick` on main | G-loc:188-201 |
| Its bars: leg joint rms/sd <= 1 (hip centred), elbow mean within 12.4 deg, shoulder ends within 3.7/7.0 deg | H193 §4 | G-loc:203-204 |
| What it cannot score: above 4.5 m/s, a bend, stop, start, walk, climb, landing, any non-human trait, a clench, the view from the eye | H193 §6 | G-loc:208-221 |
| Past 4.5 m/s, legs held by game rows against Dorn's one runner (branch only) | l205-stomp-c | G-loc:205-206 |
| Ten amendments to registered rows, each with its reason | hand-backs | G-loc:248-273 |
| Player: a planted foot moves < 3 cm over a contact (sprint and run) | `game/tests/body_tests.cpp:203` | G-code:297 |
| Integrity rows: bones keep their lengths; no joint jumps between moves; knees do not jump; no joint jumps as the hunter stops or sets off (branch) | body_tests, model_rig_tests | G-code:285-296 |
| A foot down stands on the floor, gated only at >= 5.5 m/s; below it the toe sinks 105-108 mm (found, not fixed) | branch row; H205:275 | G-code:287; G-loc:285-286 |
| The lean's rate bar and its amendment (300 deg/s per frame, ours) | world_app_tests | G-src:267-269 |
| Picture only: drawn run hashes = headless; his 16 kept runs byte-identical | selftest part 7; L185 | G-con:46-53 |
| Frame budget: p99 under 3.33 ms on his RTX 5080 at 1440p, 2.78 the aim; about 1.2 ms of room on the default frame | brief 211-212, librarian's ruling | G-con:14-31 |
| Cost of animation per character per frame: never measured; R4.7 registered and never run | — | G-phys:259, G-loc:313-316, G-con:202 |
| "There is no instrument for eeriness" | H187 | G-loc:218 |
| Clip failures: 12 fps, dark, washed out, walls in the look-behind, an old "before" | brief 216 | G-con:153-163 |

His words that govern this file, verbatim:
- 217: "i think from the idea i had in my head, we get the a good metric for a really human looking sprint which we had, and
  then we tweak it from there to look uncanny in a realistic way that obeys physics" [read] briefs/dreamzone2_the_game.md:1607
- 153: "well why the fk did we do all the research just to ignore it and do our own thing????????????????" [read] brief:1109
- 180: "hmmm i guess if the research is right, but it doesnt look good to me at least" [read] brief:1211; the ruling on
  the same line: "his eye is the bar for the look; the research is how it is built" (the librarian's, not his) [read].

[read] ~~The room has NO record of foot skating, ballistic, penetration, centre-of-mass or smoothness measures:~~
[2nd reader: WRONG as a conclusion. The terms listed do return 0 files (I re-ran them), but the word is "skate/skating", not
"foot skat": `handback/p-l161-body-C_2026-11-11.md:46` "while a foot is down its world position is fixed, so it does not skate"
and `handback/p-l169-anim-C_2026-11-12.md:222-224` "The hunter's feet don't hold anywhere: they are a function of phase" and
"A planted-foot hold in `gait_pose` ... is what stops a braking body from skating"; G-code:67 holds the same split. The room
has the HOLD and a player row, not a skate MEASURE: that narrower claim stands. The jerk/penetrat hits in exo_memory are track
builder files, not this game.]
`grep -rliE` over exo_memory for SPARC, "dimensionless jerk", "foot skat", footskate, Reitsma, MotionCritic, PhysDiff,
AddBiomechanics, Reznick, Camargo returned 0 files each. Everything in §2 is new to the room. [2nd reader: the sources in §2
are new; the hold in §4 is RE-DERIVED, see below.]

## 2. Read at source that is NEW

### 2a. Which measures agree with what viewers judge

- **MotionCritic** (Wang et al., "Aligning human motion generation with human perceptions", ICLR 2025, arXiv 2407.02272,
  downloaded PDF, Table 1 and §5) [read]. People picked the better of two generated motions; each measure is scored by how
  often it picks the same one. On their MDM test set: Root AVE 59.5%, Joint AE 62.7%, **Jerk 65.5%**, Acceleration 64.3%,
  **Person-Ground Contact 71.8%**, **Foot-Floor Penetration 53.6%**, Physical Foot Contact 64.8%, MoBERT 49.4%; their
  learned critic 85.1%. Chance is 50%. The paper: these heuristics "implement intuitive rule-based evluations" (§5).
  [2nd reader: numbers OK (Table 1 and App. B per-action table, Avg column). DOWNGRADED in use: the clips are text-to-motion
  generations (MDM and FLAME, SMPL body, 12 action classes incl. walk and run), not a game character's locomotion. The same
  App. B table has Walk: PGC 70.1, PFC 77.8, Accel 78.0; Run: PGC 70.2, PFC 73.1; and Sit PGC 90.1. So "no number beyond
  about 72%" holds only for the all-action average. Foot-Floor Penetration at 53.6% says generated clips rarely differ in it,
  not that viewers cannot see penetration.]
- **Voas, Wang, Huang, Mooney 2023**, "What is the Best Automated Metric for Text to Motion Generation?", SIGGRAPH Asia
  2023, arXiv 2309.10248, downloaded PDF §5.1-5.2 [read]: coordinate-error metrics "show weak but significant correlations
  with human judgments for both Faithfulness and Naturalness at the sample level"; FID "significantly underperforms for
  Naturalness" at the model level. Distribution scores need many samples and "preclude single-sample analysis".
- **EDGE** (Tseng, Castellon, Liu, CVPR 2023, arXiv 2211.10658, downloaded PDF §4 "Physical Plausibility", Eq. 9-10)
  [read]: the Physical Foot Contact score rests on two rules, quoted: "either at least one foot is stationary on the
  ground or the COM is not accelerating" and "any positive COM acceleration must be due to static foot contact". Per
  frame s = |a_COM| x |v_left foot| x |v_right foot|, a_COM taking max(a_z, 0) vertically, normalised by the run's peak.
  They report it "tracks well with human perception of physical plausibility" (Table 3, one dance study).
- **Pražák, Hoyet, O'Sullivan 2011**, "Perceptual evaluation of footskate cleanup", SCA 2011, doi 10.2312/SCA/SCA11/287-294
  [summary: abstract via search; the PDF fetch from diglib.eg.org returned a 343 kB non-PDF page]: viewers perceive foot
  sliding under about **21 mm** in most conditions; cleaned motions were always preferred; lengthening limbs was preferred
  to IK plus trajectory smoothing. [2nd reader: abstract confirmed word for word on diglib.eg.org/handle/10.2312/SCA.SCA11.
  287-294 ("participants can perceive even very low levels of footsliding (<21mm in most conditions)"). The abstract does
  not say the speed, the gait or whether 21 mm is per frame or per contact; a 20 mm bar per contact at 9 m/s is an extension
  of it. Still abstract only.]
- **Reitsma & Pollard 2003**, "Perceptual metrics for character animation: sensitivity to errors in ballistic motion",
  ACM TOG 22(3):537-542 [summary: abstract via search; the CMU page is script-rendered and no PDF came]: errors in
  **horizontal velocity are easier to see than vertical**, and added accelerations easier than decelerations.

[inferred] What these say together: physical defects (sliding, sinking, a body that does not fall at g) are things
viewers see and numbers can catch; "natural" or "elegant" as a whole is not caught by any hand-made number. That matches
his rule that his eye decides.

### 2b. Measures that need no reference

- **PhysDiff** (Yuan et al., ICCV 2023, arXiv 2212.02500, downloaded PDF, Appendix A) [read], quoted: "For foot sliding
  (Skate), we find foot joints that contact the ground in two adjacent frames and compute their average horizontal
  displacement within the frames." Penetrate and Float: the lowest body point below / above the ground, "a tolerance of
  5 mm to account for geometry approximation".
- **SPARC and log dimensionless jerk** (Balasubramanian, Melendez-Calderon, Roby-Brami, Burdet 2015, "On the analysis of
  movement smoothness", J NeuroEng Rehabil 12:112, PMC4674971, full text XML from Europe PMC; CC BY 4.0) [read]:
  - SPARC is the arc length of the normalised Fourier magnitude spectrum of a speed profile, cut adaptively below 20 Hz.
  - "the smoothness measures cannot be used on an entire rhythmic movement to estimate smoothness" (section on rhythmic
    movements): a gait is rhythmic, so ~~a whole-stride jerk or SPARC score is not valid~~ [2nd reader: DOWNGRADED. The sentence
    is about scoring an ENTIRE rhythmic record as one long movement. The same section says the measures "can be used to
    evaluate smoothness of the individual movement components", and it names gait studies that segment into strides as
    instances of its general approach. A per-stride SPARC is therefore allowed by the source. The better support for "no gate"
    is its next heading, "Avoid estimating smoothness of unconstrained movements" (smoothness is task-dependent), which the
    scout did not cite.]
  - Normative values exist only for point-to-point reaching ("around -1.6 for the SPARC and around -6 for the LDLJ").
  - "we recommend the use of SPARC over LDLJ" because LDLJ "is highly sensitive to noise".

### 2c. Open data for reference bands (licences read where marked)

| data | gives | licence | read how | commercial? attribution? share-alike? redistribution? |
|---|---|---|---|---|
| Fukuchi, Fukuchi & Duarte 2018, walking, figshare 10.6084/m9.figshare.5722711 v6 | pelvis and lower limb angles and forces, 51 people [2nd reader: DOWNGRADED, the record says 24 young and 27 older adults, so a walk band is half older adults unless filtered by the metadata csv], overground and treadmill, a range of walking speeds; same lab format as the 2017 running set | CC BY 4.0 | [read] figshare API record (`license` field); legal code read at creativecommons.org/licenses/by/4.0/legalcode.txt | yes; attribution when shared; no share-alike; may be shared with attribution |
| Reznick et al. 2021, Sci Data 8:282, figshare collection 10.6084/m9.figshare.c.5175254 | lower limb, 10 people; walk 0.8/1.0/1.2 m/s, run 1.8-2.4 m/s, treadmill speed-ups and slow-downs at 0.2 and 0.5 m/s^2 from and to rest, walk-run transitions | CC0 1.0 (Normalized.mat 1.53 GB, Streaming.mat 2.20 GB) | [read] figshare API for articles 14558184 and 14558181; paper via Europe PMC (CC BY); CC0 legal code read | yes; none required; none; yes |
| AddBiomechanics Dataset 1.0 (Werling et al., ECCV 2024) | 273 people, 70+ h, "estimated center of mass kinematics" and forces; 15 sources incl. Camargo 2021, Hamner 2013 | page: "available for free under a Creative Commons BY 4.0 license"; ~~each source has its own LICENSE.txt~~ [2nd reader: WRONG as stated. The page (download_data.html, the user-generated section) says only: "Please note the LICENSE.txt file in each dataset, which lists the original uploaders of the data so that you can correctly credit them." It is an uploader list for credit, in the larger user-generated sets; the page does not say the core 1.0 sources carry different licences, and does not say the upstream owners agreed to CC BY. The page also links a Terms of Service the scout did not open.] | [read] addbiomechanics.org/download_data.html; the per-source LICENSE.txt files NOT read; download about 4 h at 50 Mbps | as CC BY 4.0, if the per-source files agree: not checked |
| Camargo et al. 2021, Mendeley fcgm3chfff | stairs, ramps, level ground, transitions | NOT READ: the page is script-rendered, the API returned 502 | — | unknown |
| A bend or curve sprint data set | — | none found; one test-retest study of bend sprint kinematics with no data statement seen [summary] | — | — |

Use is "learn from, never use": test references fetched outside every repository, as the yardstick does (G-loc:243-244).
Nothing here is proposed for shipping. CMU's terms are as the room read them (G-loc:230) [summary].

## 3. The design

### 3a. Inputs and outputs

- **Input:** a sequence of `BodyPose` (21 joints, game/body.h:38-46) at a known dt, the floor height under each foot (the
  same probe `GaitMotion::floor` uses, stage.cpp:277), the body's travel speed, and the kind's mask (3d). Any producer
  works: `gait_pose`, `Body`, a future lesser chaser, the ragdoll's drawn pose. [inferred from G-code:5, :189-199]
- **Output:** a small table per run: one number per check, its bar, pass/FAIL, and the worst place (time and joint), in
  the yardstick's print style. No file is written except where a test already dumps (the DZ_LEAN_DUMP pattern,
  world_app_tests.cpp:1045-1053 [read]).

### 3b. The checks with no reference (every kind, every movement; physics is never released, his 217)

| id | measure | source of the form | default | mark |
|---|---|---|---|---|
| P1 contact | a foot is down when its lowest joint (ankle or toe) is within 1 cm of the floor | ~~the yardstick's own foot-down reading (H193:133)~~ [2nd reader: WRONG source. H193:133-134 reads "the ankle within 1 cm of its lowest" (not of the floor) and says it "reads 12%" against the runners' 36% from force. The player's row uses `a.y - player.y < ankle_height + 1e-3`, a 1 mm band (main 31d1c6d game/tests/body_tests.cpp:219, with `contacts >= 6` at :230 so the row cannot pass on zero contacts). So 1 cm is [ours], and the reading it descends from is recorded as 3x too short.] | 1 cm | ~~[read] H193:133~~ [ours] |
| P2 skate | horizontal travel of a foot over one contact, worst contact | PhysDiff's Skate, per contact instead of per frame pair | **20 mm** | form [read] PhysDiff App. A; bar [summary] Pražák 2011 (< 21 mm perceived) |
| P3 sink / float | lowest foot joint below the floor while down; gap above while "down" | PhysDiff Penetrate/Float | 5 mm | [read] PhysDiff App. A |
| P4 flight | with no foot down, the pelvis's vertical acceleration against -9.81 and its horizontal velocity change | Newton; Reitsma: horizontal errors seen more | vertical within 10%, horizontal within 2% over the flight | form [summary] Reitsma; numbers [ours] [2nd reader: Reitsma's abstract (Crossref) gives no form or threshold, only "errors in horizontal velocity were easier to detect than errors in vertical velocity" in HUMAN JUMPING motion; the form is Newton, [inferred]. RE-DERIVED and vacuous on main: gait_pose builds the flight as `rise = 0.5*9.81*t*t*x*(1-x)` (main model_rig.cpp:780; G-code:150 "g t^2/8 Newton, :764-782") and the branch row `the_flight_rise_lifts_the_hips_only_in_flight` (G-code:286). The vertical half of P4 passes by construction and horizontal motion comes from the simulation; it can go red only on a mutant.] |
| P5 contact force | with a foot down, the pelvis's horizontal acceleration over (g + vertical) at most the kind's grip mu; with no foot down, no horizontal acceleration | EDGE's PFC rules; ~~the friction cone~~ [2nd reader: UNSUPPORTED as sourced. EDGE has no friction bound and no mu; its PFC is a product score with no threshold (Eq. 9-10), and App. D says it uses the ROOT joint's acceleration for the COM, which is the precedent for the pelvis proxy the scout did not cite. The a_h/(g+a_v) <= mu inequality is Coulomb [ours].] | mu from the chase (human 1.0 [ours]; the hunter's "grip above human") | rules [read] EDGE §4; ~~mu~~ inequality and mu [ours] |
| P6 lengths, P7 jumps | bones keep length; no joint moves more than its bar in a frame | the room's rows | as landed | [read] G-code:295-296, :289 |

- [ours] The pelvis stands for the centre of mass in P4-P5. A segment-mass centre would be better and needs a
  segment-mass table I have not read (de Leva 1996 is the usual one, unread). Keep the pelvis until a row needs more.
- [inferred] P4 and P5 are where "obeys physics" (217) becomes a number. The uncanny tweak may change any joint; it may
  not make a foot slide, a body float, or a turn take more grip than the kind has.
- Smoothness: no gate. SPARC says whole-gait scores are invalid and has no norms for gait (§2b). The room's jump rows
  (P7) already catch pops. [ours] Report SPARC of the pelvis speed over one stop and one start only, as a number for his
  clips, never a bar.

### 3c. Reference bands per movement

| movement | band from | speeds | reaches the hunter? | state |
|---|---|---|---|---|
| walk | Fukuchi 2018 (CC BY 4.0); Reznick 0.8-1.2 (CC0) | walking speeds | n/a | new loader: same lab format as Fukuchi 2017 [inferred from the figshare description] |
| run | Fukuchi 2017 (built); Reznick 1.8-2.4 (CC0) | 1.8-4.5 m/s | no | built for 2.5-4.5 |
| sprint | Dorn/SimTK runner JA1 (MIT, n = 1); SR's numbers | 5.2-9.49 m/s | to 9.49 only | game rows on the branch (G-loc:205-206) |
| bend | no open data found; Chang & Kram's law (room's) and P5 | — | — | physics only: P5 plus the landed lean row |
| start, stop | Reznick 0.2/0.5 m/s^2 (CC0) is a gentle treadmill speed-up, far from a sprint start; Nagahara 2014 numbers in SR (CC BY 3.0 as recorded) | — | no | P2-P5 plus his eye; a band only if a sprint-start set is found |
| landing | none read; AddBiomechanics may hold jumps (its activity list not read); CMU (terms as the room read them) | — | — | P3-P4 only for now |
| arms, trunk | CMU (built) | 2.67-4.15 m/s | no | built; "weak", three runners (G-loc:196-198) |

[ours] Bar for every band: the room's, rms/sd <= 1 per joint (G-loc:203). Above the data: NOT COVERED, printed as the
tool already does; no extrapolation (H193:196-197 via G-loc:202).

### 3d. A kind that is non-human in ONE respect

[ours] Each kind carries a mask: the one channel its trait releases from the human band, and the band it must meet
instead. Every other channel keeps the human band, and P1-P7 hold for all. This is the brief's note on 167 made
mechanical: the uncanny comes from cues that disagree, not from motion uniformly off (G-his:403-404).

| kind (his pick, G-loc:166) | released channel | its own band | source status |
|---|---|---|---|
| hunter T1 | cornering speed on a bend (chase side) and P5's mu | H2 law, mu "above human" | abstracts and a press figure (G-loc:122-126) |
| interceptor, stalker T2 | head position in the world over a hold | still, then thrust | abstracts only (G-loc:156); band [ours] until full text |
| sprinter, charger T3 | trunk flexion range per stride | gallop back flex | abstracts only; needs a spine joint (G-loc:157) |
| pack, crawler T4 | step rate against speed | rate nearly fixed | abstract only (G-loc:158) |

His 214 and 217 (tweak a human sprint "to look uncanny in a realistic way that obeys physics") then read as: start
green on every human band, release one channel, keep P1-P7 green. [inferred]

### 3e. Where it sits in the game

- New pure module `game/motion_checks.{h,cpp}` [ours]: functions over `std::vector<BodyPose>`, no renderer, no Jolt,
  linked into `game_tests` and `dz-yardstick`. It reads poses; it never writes to the simulation (picture only holds by
  construction).
- Game test rows call it on `gait_pose` sweeps (as `a_foot_down_stands_on_the_floor` does, l205-stomp-c
  model_rig_tests.cpp:1311 [read]) and on recorded runs through `hunter_lean_trace` (world_app_tests.cpp:1036 [read]).
- `dz-yardstick` gains `--checks`: P1-P7 printed for the hunter and the player beside the band tables (main.cpp:324-361
  [read]).
- The cost timer: `WorldStage::place_figures` timed as `sync` is (stage.cpp:669-672 [read]), exposed like
  `last_sync_ms` (stage.h:95 [read]) and written per frame by the bench beside `f.sync` (offscreen.cpp:407 [read]).

### 3f. Cost

- The checks run in tests and tools only: **0 per character per frame** in the shipped game. [inferred]
- The thing measured, animation per character per frame: never timed (§1). G-code's reading estimate is
  "single-digit microseconds per hunter" (G-code:239) [summary].
- [ours] Budget: CPU time of `place_figures` at p99 under **0.25 ms** with nine figures in view, about 0.05 ms for a
  full-detail figure. That leaves about 0.95 ms of the roughly 1.2 ms room (G-con:31). GPU skinning is separate and
  already +0.39 ms average for the two models (G-con:24-27).
- Measured only by a landing pane with `--bench`, never while he plays (the task's rule 1; the room's frame-time hold,
  G-phys:230).

### 3g. One layer for the hunter, a lesser chaser and the player

- Hunter: P1-P7 plus run, sprint and arm bands; mask T1.
- A lesser chaser: no pose exists today (boxes, G-code:212-214). [inferred] Once one calls `gait_pose`, the same rows run
  on it unchanged; its first lap adds only its mask row.
- Player: P1-P7 on `Body`'s poses (its planted-foot row is P2 at 3 cm, landed); bands already run with `--player`
  (H193 §10). [ours] Its 3 cm bar is above the 21 mm the study reports; changing a landed row is a ruling for the chair,
  so it is reported here, not changed.

## 4. The first lap

**The row:** `the_hunters_planted_foot_stays_where_it_landed` (P2, plus P1 for the contact), the hunter's twin of the
player's landed row (body_tests.cpp:203).

**The recorded cases:** `gait_pose` with the feet carried forward at v·t and the phase advanced as the stage does
(stage.cpp:269), at the recorded runners' speeds 2.5/3.5/4.5 (Fukuchi) and 5.19/6.97/9.47 (Dorn), plus 12.6; and the
hunter through the bot's recorded flee run via `hunter_lean_trace`.

**Red today, by my arithmetic** [inferred, not run in the game]. I restated main's `stride_step`, `running_leg` and
the leg FK (model_rig.cpp:695-737, :783-800; constants model_rig.h:376-387) in a 30-line script and took the stance
foot's sweep under the hip against the body's travel over the stance. Thigh 0.45 m and shin 0.44 m are MY guesses from
the hunter's hip height 0.984 m (measured on add21fe, G-src:265-266 [summary]); the real lengths come from hunter.glb.

| m/s | stride (m) | stance share | travel in stance (m) | foot sweep under hip (m) | slide per contact (m) |
|---|---|---|---|---|---|
| 2.5 | 1.99 | 0.39 | 0.775 | 0.543 | 0.23 |
| 3.5 | 2.43 | 0.36 | 0.875 | 0.656 | 0.22 |
| 4.5 | 2.83 | 0.33 | 0.933 | 0.768 | 0.17 |
| 9.47 | 4.42 | 0.26 | 1.126 | 0.886 | 0.24 |
| 12.6 | 5.24 | 0.26 | 1.337 | 0.886 | 0.45 |

[inferred] The cause: the stride comes from Alexander's law and the leg's sweep from Fukuchi's angles, and nothing ties
the two, so the foot is carried forward through the stance. On l205-stomp-c the planted foot goes linearly from the
shape's strike place to its take-off place in the body's frame (`plant`, branch model_rig.cpp:807-813 [read]), so the
same gap stands there. If the first run reads green, my estimate is wrong and the lap stops and says so.
[2nd reader: the table is REPRODUCED to the digit by a 40-line node script of main's `stride_step`, `running_leg` and the leg FK
with the scout's guessed lengths (thigh 0.45, shin 0.44; script in my scratchpad, not the repo). Sensitivity, my run: with
0.42/0.42 the slide reads 0.21-0.50 m; with 0.48/0.46, 0.12-0.40 m. So "0.17-0.45" is one point of a 0.12-0.50 range until
hunter.glb is read. Two limits: (1) ~~so the same gap stands there~~ [2nd reader: UNSUPPORTED for the sprint rows. The branch
refits the legs past 4.5 m/s to Dorn's runner (G-loc:109-110), moves the hip peak to 0.78 and has its own `stance_at(v)`
(branch model_rig_tests.cpp:1320), so the 9.47 and 12.6 rows of main do not transfer; only the structure (linear strike-to-
take-off plant in the body frame, branch model_rig.cpp:807-813) does. 12.6 m/s is also above kLegShapeTop 7.0, ours.]
(2) the window "stance share" is the code's `kStanceShare`; the foot is not proved to be on the floor for all of it. On main the
pelvis rides the deeper leg, so by my script one ankle is within 1 cm of the floor about half of every cycle, not 26-39%:
whatever P1 counts as down will change the slide it reads. Fix P1's window from the shape's stance, or the red may be an
artefact.]

**The fix, smallest:** hold the stance foot's world place from strike to take-off and let the existing two-bone solve
reach it (`reach_leg` on main, `plant` on the branch). That is the cleanup the footskate literature uses [summary,
Pražák 2011 compares two such methods]. [2nd reader: DOWNGRADED, and it cuts against the fix. The abstract says "a simple
approach of lengthening limbs was preferred to a more complex approach using IK fixes and trajectory smoothing", and the pin
here is the IK kind. RE-DERIVED as to the hold itself: G-code:67 (the player's stance foot is held in the world by
contact_length, body.cpp:255-309; the hunter's is "placed by curve; planted on l205-stomp-c (`plant`)") and
handback/p-l169-anim-C_2026-11-12.md:222-224 name this exact fix.] Then re-run `dz-yardstick --data` for the hunter: the hip's sweep will grow,
and if any leg joint leaves rms/sd <= 1, that trade (law against shape) goes to the chair, not to a constant.

**Files:** `game/motion_checks.{h,cpp}` (new: P1, P2 only), `game/tests/model_rig_tests.cpp` (the row),
`game/model_rig.cpp` (the hold), `game/CMakeLists.txt`, CHANGELOG. Branch: after l205-stomp-c lands, since both edit
gait_pose's stance block (the same clash noted for L185 step 3, G-phys:231-232).

**Tier:** prove it (a measuring instrument and core geometry): row red first, mutants on `motion_checks`, his 16 kept runs
byte-identical (G-con:51).

## 5. What only his eye decides, and the fewest clips

1. **Elegance and creepiness.** No number in §2a agrees with viewers beyond about 72% on pairs; his eye is the bar.
2. **Which channel to release, and how far**, per kind (§3d), once each band is green.
3. **Within-band choices** no bar separates: take-off knee 15 against 25 (G-loc:111-112), the stand-off variants.

Clips, at full frame rate and lit, "before" no older than what he has seen fixed (brief:1606):
- **A.** The hunter at 9.5 m/s from the side and from the look-behind: today's main beside the foot hold. One clip.
- **B.** Per kind as each gets a body: all-human beside one released channel. One clip per kind, not before.
- **C.** Optional: a stop and a start, with the SPARC number printed on it as information, not as a verdict.

## 6. What I would not build, and why

- **A learned critic (MotionCritic, MoBERT).** It needs a large human-rated set of OUR motions; trained on other people's
  generated motion, it scores taste we did not choose. MoBERT scored 49.4% in MotionCritic's own test (§2a).
- **FID, R-Precision or other distribution scores.** They need many samples and a learned embedding, and ~~FID did poorly
  on naturalness (Voas §5.2)~~ [2nd reader: DOWNGRADED for FID, WRONG for R-Precision. Voas §5.2: FID "significantly
  underperforms for Naturalness" at the model level over only FIVE models (p-values weak by the authors' own note), and "it is
  possible our samples may provide an unfavorable setting for FID"; R-Precision "demonstrates substantial correlations for both
  human quality judgments, approaching 0.8 Pearson's". The sound reason stands: they "preclude single-sample analysis". Also
  Voas §5.3 says MoBERT "significantly outperforms all competitors" on their data, while MotionCritic's table has it at 49.4%;
  the two sources disagree and the scout cites only one.]
- **A jerk or SPARC gate over a gait.** The source says it is not valid on rhythmic movement and has no gait norms (§2b).
- **XCoM, ZMP or a full centre-of-mass model now.** Hof's papers were not read; P4-P5 on the pelvis cover the visible
  failures. Add only when a row needs it.
- **A curve-sprint band.** No open data was found; P5 and the landed lean row hold a bend.
- **Any recording in the game repository or the build**, and any non-commercial data (LAFAN1, AMASS) even as a test
  reference: tuning a sold game to it is a use the licence does not plainly allow. [inferred]
- **A per-frame check in the shipped game.** Checks belong in tests and the yardstick; the frame stays for drawing.

## What I did not open

- Pražák 2011 and Reitsma & Pollard 2003 full texts (abstracts via search only; marked [summary]).
- Camargo 2021's licence; AddBiomechanics' per-source LICENSE.txt files and activity list; the AddBiomechanics paper.
- Hof 2005 (extrapolated centre of mass), Herr & Popovic 2008, de Leva 1996, Hogan & Sternad 2009: not fetched.
- CMU's index for jump, start and stop clips; any bird, gallop or insect source beyond the room's abstracts.
- hunter.glb (real thigh and shin lengths; my slide table rests on guessed lengths); `apply_motion` beyond the lines
  cited; `hunter_lean_trace`'s body; `game/body.cpp`.
- MotionCritic's and EDGE's code and data, and their licences (nothing of theirs is proposed for use).
- The SPARC code repository (github.com/siva82kb/SPARC) and its licence: the idea only, should it ever be used.
- No game, tool, build or test was run. The only computation was my arithmetic script in the scratchpad.

## Second reader

Adversarial second reader, read-only, 2026-11-13. Outside requests carried public technical topics only. Primaries opened as
whole text: four arXiv PDFs (pdftotext), the SPARC paper (Europe PMC XML), the Reznick paper (Europe PMC XML), figshare API
records, the CC BY 4.0 and CC0 legal code, the Pražák abstract page, the Reitsma abstract (Crossref), the AddBiomechanics
page, the LAFAN1 and AMASS licence texts. Local: the ground files, three hand-backs, the brief, and the game at 31d1c6d and
l205-stomp-c by `git show`. My only computation: a 40-line node script (a few milliseconds) that restates the scout's
slide arithmetic. Line numbers "L" are the scout's original lines before my insertions.

| # | line, claim | primary opened | verdict | one line of evidence |
|---|---|---|---|---|
| 1 | L57 MotionCritic: Jerk 65.5, PGC 71.8, FFP 53.6, PFC 64.8, MoBERT 49.4, critic 85.1 | arXiv 2407.02272 Table 1, App. B table | OK | Avg column of the per-action table matches; Table 1 MDM column the same |
| 2 | L56 people picked better of two; chance 50% | same, §5.2 | OK | pairs from three-way ranks, accuracy vs annotation |
| 3 | L57 quote "intuitive rule-based evluations" | same, §5.2 | OK | exact, typo included |
| 4 | L5, L240 no number agrees beyond about 72% | same, App. B | DOWNGRADED | all-action average; Walk PFC 77.8, Accel 78.0, Sit PGC 90.1; generated text-to-motion, not game gaits |
| 5 | L59 Voas coordinate error "weak but significant" at sample level | arXiv 2309.10248 §5.1 | OK | exact words |
| 6 | L61 distribution scores "preclude single-sample analysis" | same, §5.2 | OK | exact words |
| 7 | L63-65 EDGE two PFC rules, quoted | arXiv 2211.10658 §4 | OK | both rules quoted exactly |
| 8 | L65 s = aCOM x vL x vR, a_z = max(a_z,0), normalised by peak | same, Eq. 9-10, App. D | OK | PFC = Sigma s / (N x max aCOM) |
| 9 | L66 "tracks well with human perception" Table 3 | same, §4.2 | OK | three clip sets, one dance dataset (AIST++) |
| 10 | L67-70 Pražák: under ~21 mm, cleaned preferred, lengthening limbs preferred | diglib.eg.org abstract page | OK | abstract word for word; no speed or unit stated |
| 11 | L71-73 Reitsma: horizontal velocity errors easier than vertical; added accel easier | Crossref abstract, DOI 10.1145/882262.882304 | OK | stimulus was human jumping only |
| 12 | L81-84 PhysDiff Skate, Penetrate, Float, 5 mm | arXiv 2212.02500 App. A | OK | exact quotes; mesh vertex, not joint |
| 13 | L85-87 SPARC: arc length of normalised spectrum, adaptive cut, 20 Hz | PMC4674971 full text XML | OK | omega_c adaptive, upper bound 40 pi = 20 Hz |
| 14 | L88-89 gait is rhythmic so per-stride SPARC not valid | same, rhythmic section | DOWNGRADED | only the ENTIRE rhythmic record is invalid; per-component scoring allowed |
| 15 | L90 norms only point-to-point, -1.6 SPARC, -6 LDLJ | same, normative section | OK | "around -1.6 ... around -6" |
| 16 | L91 recommend SPARC over LDLJ, "highly sensitive to noise" | same | OK | "Use SPARC over LDLJ" paragraph |
| 17 | L97 Fukuchi 2018: 51 people, CC BY 4.0, v6 | figshare API 5722711; CC BY 4.0 legalcode.txt | DOWNGRADED | licence OK, commercial yes; 24 young + 27 older adults |
| 18 | L98 Reznick: 10 people, speeds, 0.2/0.5 m/s^2, CC0 1.53/2.20 GB | figshare API 14558184, 14558181; PMC8553836; CC0 legalcode | OK | accelerations from and to rest to 1.2 or 2.2 m/s |
| 19 | L99 AddBiomechanics: 273 people, 15 sources, "CC BY 4.0" page | addbiomechanics.org/download_data.html | OK | table sums to 273, 71.47 h |
| 20 | L99 "each source has its own LICENSE.txt" | same | WRONG | file lists uploaders to credit, in the user-generated sets |
| 21 | L260 LAFAN1, AMASS non-commercial | LAFAN1 license.txt (CC BY-NC-ND 4.0); AMASS licence page | OK | both quoted from the licence text |
| 22 | L121 P1 reading is the yardstick's, H193:133 | handback/p-l193-yardstick-E:133-134; body_tests.cpp:219 | WRONG | "within 1 cm of its lowest", reads 12% vs 36%; player row is 1 mm |
| 23 | L124 P4 form from Reitsma | Reitsma abstract; model_rig.cpp:780 | UNSUPPORTED | no form in abstract; also RE-DERIVED, built in by construction |
| 24 | L125 P5 "friction cone" with EDGE | EDGE §4, App. D | UNSUPPORTED | no mu or bound in EDGE; inequality is [ours] |
| 25 | L28 player planted foot < 3 cm | body_tests.cpp:203-231 on 31d1c6d | OK | `worst < 0.03f`, `contacts >= 6` |
| 26 | L14-36 ground line numbers (G-loc 188-206, 285-286; G-code 287-297; G-src 267-269; G-con 14-31, 46-53) | the six ground files | OK | spot-opened each, all match |
| 27 | L45-47 room has NO record of foot skating | grep exo_memory; p-l161-body-C:46; p-l169-anim-C:222-224 | WRONG | the word is "skate"; hold and player row recorded |
| 28 | L213-219 slide table 0.17-0.45 m | main model_rig.cpp:695-737, 783-800, model_rig.h:350-387; own node run | DOWNGRADED | digits reproduce; thigh and shin guessed; range 0.12-0.50 |
| 29 | L222-224 branch has the same gap | branch model_rig.cpp:807-813, model_rig_tests.cpp:1320 | UNSUPPORTED | branch refits legs past 4.5 m/s; sprint rows do not transfer |
| 30 | L227-228 pin is what the footskate literature uses | Pražák abstract | DOWNGRADED | abstract prefers limb lengthening over IK fixes |
| 31 | L251-252 FID did poorly on naturalness | Voas §5.2 | DOWNGRADED | five models, authors call it possibly unfavourable |
| 32 | L251 R-Precision grouped with failing scores | Voas §5.2 | WRONG | "approaching 0.8 Pearson's" for both judgments |
| 33 | L185-186 0.25 ms leaves 0.95 of 1.2 ms; GPU +0.39 ms | G-con:24-31; stage.cpp:675 | OK | arithmetic right; 0.25 and 0.05 marked [ours]; place_figures also places boxes |
| 34 | L176-177 timer sites stage.cpp:669-672, stage.h:95, offscreen.cpp:407 | main game/world/stage.cpp, stage.h, offscreen.cpp | OK | path is game/world/, not game/gym/ (both exist) |
| 35 | L171-172 model_rig_tests.cpp:1311, world_app_tests.cpp:1036, 1045-1053 | l205-stomp-c; main | OK | `hunter_lean_trace` returns LeanFrame (pos, heading, speed), no pose |
| 36 | L39-43 his words 217, 153, 180 with brief lines | briefs/dreamzone2_the_game.md:1607, 1109, 1211 | OK | verbatim |
| 37 | L183 "single-digit microseconds" | ground_code.md:239 | OK | marked [inferred] there, [summary] here |
| 38 | L8 "no check ... a body in flight falls at g" as a gap | G-code:150, :286; model_rig.cpp:780 | DOWNGRADED | built as g t^2/8 and a branch row exists; the gap is a check, not the law |

**Tally (38 rows):** OK 24, DOWNGRADED 7, WRONG 4, UNSUPPORTED 3.
**RE-DERIVED: 2.** (1) The planted-foot hold as "the smallest fix" (scout §4, L226-228) against G-code:67 and G-code:347-348
(the player's foot is held by contact_length; the branch has `plant`), and `handback/p-l169-anim-C_2026-11-12.md:222-224`
which names this exact fix for the hunter's feet. (2) "A body in flight falls at g" as a missing measure (scout L3-4, L124)
against G-code:150 and :286: the law is built into `gait_pose` (main model_rig.cpp:780) and a branch row exists for it.
Not RE-DERIVED, checked: P1's use of the yardstick (the scout says so), the kinds table (cites G-loc:154-166), the sprint
rows (cites G-loc:205-206), the budget (cites G-con).

### How the first row could pass without doing its job

The row is `the_hunters_planted_foot_stays_where_it_landed` (P1 plus P2). Simplest ways to green:
1. **Zero contacts.** P2 reads only frames where P1 says "down". Lift the foot 1 cm in stance, or let the pin carry the ankle
   over the 1 cm band, and the worst slide is over no frames. The player's row has `contacts >= 6` (body_tests.cpp:230); the
   scout's row names no such count. Needs a count per stride, and the contact window taken from the shape's stance
   (`stance_at`), not from the pose under test.
2. **Window shrunk at toe-off.** The hold ends early and the foot slides in the last tenth of the stance, outside "down".
3. **Pin without a floor row.** The two-bone solve clamps when the held place is out of reach; with P6 keeping lengths, the
   foot is dragged off the floor. P2 is green and the foot floats or the toe sinks. The only recorded red in the room that P3
   can start from is the toe sink of 105-108 mm below 4.5 m/s (H205:275); the scout does not tie P3 to it. P3 should ride in
   the same lap as P2.
4. **Only the cases that are steady.** The cases are constant speed on a flat floor. The room's own note says a braking body
   skates (p-l169-anim-C:224). Add one recorded stop or turn case, or the row is green for the easy half.
5. **Measured in the wrong frame.** Slide taken against the pelvis (body frame) instead of the world reads near zero for any
   leg shape. The row must state world frame.

### Mechanisms with no source and no [ours] mark in the scout's file (now marked above)
- P5's inequality a_h/(g+a_v) <= mu (the scout cited EDGE; EDGE has none).
- P4's "form [summary] Reitsma" (the abstract gives no form).
- P1's "yardstick's own reading" (it is not; 1 cm is ours).
- §3c: "rms/sd <= 1 for every band" is marked [ours], but the Reznick bands are treadmill, ten people, speeds normalised by leg
  length: an sd over ten people is a loose bar, and nothing says how a walk or stop band is aligned in phase to a procedural
  gait with no recorded lag.

### Other design faults, plainly
- **Rows red first on a recorded case:** only one row (P2) has a stated red, and it is [inferred], not run. P3-P7, the mask rows
  and the cost row have none. The one recorded red available (toe sink, H205:275) is unused. A rule of "each red first" is met
  by one of about nine rows.
- **The mask (§3d)** frees "one channel", but nothing in the design limits a mask to one channel, and for T2-T4 the released
  channel's own band is [ours] on abstracts the room already marked abstract-only (G-loc:156-158). A mask is chosen by the same
  seat that builds the kind, so a failing channel can be declared the released one. Needs a test that a mask has exactly one
  entry, and that a mask never names a P1-P7 row.
- **The cost timer (§3f)** times all of `place_figures`, which also places the box chasers and builds the palette; it is not
  per character and not per kind. p99 of a 0.2 ms section on a bench frame is noisy; no figure is given for how many frames. The
  0.25 and 0.05 ms are [ours] with no basis, as marked.
- **P4 and the foot-down window** both lean on the pelvis and on "ankle within 1 cm"; on main the pelvis rides the deeper leg, so
  by my script one ankle is within 1 cm of the floor about half of every cycle. The reading will not match the 26-39% stance
  share the code uses, and that mismatch is the number to print first.

### What I could not check
- Pražák 2011 and Reitsma and Pollard 2003 beyond their abstracts (paywalled; I read the abstracts at the publisher and Crossref).
- The CC BY 4.0 legal code beyond the grant and the NonCommercial and ShareAlike terms (I searched for them; they are absent);
  the AddBiomechanics Terms of Service and per-upstream licences; Camargo 2021.
- hunter.glb's real thigh and shin lengths, so the slide table's absolute figures; `hunter_lean_trace`'s body.
- MotionCritic's per-action Jerk row (the extracted table dropped it) and the MDM pair counts.
- The scout's claim of "one test-retest study of bend sprint kinematics" and the Hof, Herr and Popovic, de Leva, Hogan and
  Sternad papers (not fetched by the scout either).
- The game ran nowhere; nothing built.

1. On a bend a running body leans from its feet by atan(a/g), and 7 measured sprinters on a ~33 m bend did that (0.73-0.84
   of it at touchdown and toe-off). [2nd reader: DOWNGRADED. The paper never states the radius; ~33 m is read off one ambiguous
   camera sentence (isbs4874.txt:42-44). A standard lane 2 is 37.92 m [summary: Wikipedia "Running track" table, from the IAAF
   manual, not opened]. At 37.9 m the same lean data are 13.3 deg asked, so 0.96 and 0.84 of it, not 0.84 and 0.73.]
   The trunk carried about 0.9 of that lean, [2nd reader: DOWNGRADED. 0.89 is trunk over the MEASURED whole-body lean (11.35 / 12.75).
   Over gravity's lean it is 11.35 / 15.2 = 0.75 at the scout's radius.] and in walking turns the head rolled INTO the turn.
   [2nd reader: DOWNGRADED. The Imai abstract (PubMed 11204402) gives "a roll tilt of the head of up to 8 degrees" and does not
   say the direction. Into the turn is inferred from "tilt axes of the head and the GIA tended to align".]
2. The drawn hunter has no whole-body lean at all. Its feet stay under the hips and only the hip line and trunk roll about the
   pelvis. Its tilt gain, 1 degree per m/s/s, is 1/5.8 of gravity's: a 1 g bend draws 9.8 deg where physics asks 45.
3. Greyhound law for the hunter: keep the stride timing unchanged on a bend (gait_pose already does this) and lean the full
   atan(a/g), with a grip cap mu. That gives 45 deg at mu 1.0 and 53 deg at 1.33; the human maximum is about 42 deg.
   [2nd reader: DOWNGRADED. 42 deg is computed from Chang & Kram's 1 m circle speed (2.99 m/s, p-l187:65), a jog on a 1 m
   circle. No source read measured a human lean near it; the only measured lean read is 10-15 deg (S1).]
4. Stops and starts follow the same law in pitch: sprint start ~43 deg, human braking 24-48 deg. [2nd reader: DOWNGRADED. 43 is the
   foot-behind-CM angle at toe-off, a four-step mean (sw62380.txt:243-246), not a stance-average lean; 24-48 are atan of
   deceleration figures, no lean was measured in S8.] The hunter's sim dials ask for
   42 deg forward and 55 deg back. Its turns ask for up to 2.4 g, which no grip allows, so the drawn lean will expose the sim.
   [2nd reader: DOWNGRADED. 2.4 g assumes a 9 m/s top. Main has ref_speed 8 x hunter_speed 0.95 = 7.6 (chase/speed.h:22,
   chase/dials.h:21), which gives v(6.283 - 0.482 v), peak 20.5 m/s/s = 2.1 g at 6.5 m/s [inferred]. Also an envelope: the sim
   brakes toward corner_speed (chase/chaser.cpp:174, dial corner_care 0.9), so it is not shown to be reached.]
5. First lap: a gravity-tilt gain and a whole-body roll about the feet, in model_rig.cpp. One row on the flee bot's recorded
   run reads red today and green after. Two clips settle mu and the shares by his eye.

Scout: turning, banking, stops and starts. 2026-11-13. Read-only; nothing built or run. Marks: [read] opened and seen;
[summary] secondary, an abstract, or another swarm/ground file; [inferred] mine; [ours] a proposal.
Game code read at dreamzone-3 main **31d1c6d** (`git show main:<path>`), unless a branch is named. `G/` =
`C:/Users/nname/Desktop/lighthouse/exo_memory/loop/animation_system_2026-11-13/`. Downloaded sources sit in my session
scratch `C:/Users/nname/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/turn/`,
read as text via pdftotext; line numbers given there are of those text files, and the paper's own table and page beside them.

## (1) What the room already has for this aspect

- His words. 146: a jittery lean; 151: "it will turn, and then lean, not lean into the turn" [summary: G/ground_his_words.md:296-314].
  164: "able to turn way too fast keeping speed" [summary: :384-387]. 168/169: the hunter corners by H2, "hunter T1 only
  (greyhound cornering...; its head stays humanlike)" [summary: :406-418]. `chase_entities-1` "Grip above human" [:555-556].
  214: "on the corners, the torso doesnt orient itseld into the banking of a turn" [:528-533]. 217: tweak from a human sprint
  "in a realistic way that obeys physics" [:544-547]. 18: entities "cannot directly turn on a dime ... scrub speed turning"
  [:83-89].
- The tilt as landed: Overgrowth's, target = velocity x 0.5 + low-passed acceleration, read as DEGREES, half-lives 0.1126 s
  and 0.0548 s [summary: G/ground_sources_read.md:34-38; G/ground_code.md:102-105]. The game's own line [read]:
  `game/model_rig.cpp:509` `target = vel * 0.5f + accel_tilt;   // degrees (scale 1: ...)`.
- The chain shares 1.0 / 0.35 / -0.30 from his first game, the room's only source for them; Overgrowth's 0.7/0.5/0.4 are
  balance translations, not bank shares [summary: G/ground_sources_read.md:43, :219-221, :242-245].
- The cornering laws H1 (Chang & Kram Eqn 5) and H2 = min(V_o, sqrt(mu g R)), mu 1.0 and 1.33 [press], and their speed tables
  [summary: G/ground_locomotion_and_yardstick.md:118-135]; H2 lives only on the l182 branches, off by default [same, :127-130].
  I re-read L187 sections 3 and 9 at source [read: exo_memory/handback/p-l187-animal-locomotion-E_2026-11-12.md:60-75,
  :196-257]. The greyhound and cheetah papers are abstracts there, and the cheetah's 13 m/s/s is press.
- The yardstick cannot score a bend, a stop or a start [summary: G/ground_locomotion_and_yardstick.md:208-221].
- Item 214's state notes: the Third Place's reading that "A body that holds that speed round a bend has to lean as far as the
  speed asks", "Not checked against today's code"; the librarian's ruled clip of trunk shares 0.35 / 0.7 / 1.0 "with the speed and
  the bend's radius stated" [read: exo_memory/briefs/dreamzone2_the_game.md:1589 sub-bullets, and :1607's last sub-bullet].
- Nothing in the ground files covers stops and starts beyond Overgrowth's sign test and L205's "no joint jumps" row
  [summary: G/ground_code.md:270, :289]. That is thin, so I read the code and sources below myself.

## (2) What I read at source that is NEW

### 2a. The game's code, checked against the physics law (main 31d1c6d)

- The sim knows the true lean and the picture throws it away. `gather_poses` computes `lean = std::atan(a.body.speed *
  a.body.turn / 9.81f)` [read: game/world/world_app.cpp:534]. `ease_poses` overwrites it with `e.drawn.lean()` [read: :584].
  [2nd reader: RE-DERIVED, G/ground_code.md:24 (lean = atan(speed*turn/9.81) and "lean/pitch := drawn tilt"). Line OK at 534;
  the overwrite is at :582 on 31d1c6d (:584 is `p.follow`). The 1/5.8 comparison below is new.]
- The drawn bank is about 1/5.8 of gravity's at small angles. The row pins this: a 7 m/s turn on a 5 m circle (9.8 m/s/s,
  1 g) leans "about 9.8 degrees" [read: game/tests/model_rig_tests.cpp:510-514]. Gravity's law gives atan(9.8/9.81) = 45 deg.
  The small-angle slope of atan(a/g) is 1/g rad = 5.84 deg per m/s/s, against the landed 1 deg [inferred].
- There is no whole-body lean. `gait_pose` puts the pelvis at `feet + body(rest pelvis)` and swings the legs in the
  fore-aft plane only [read: game/model_rig.cpp:782, :787-790]. So the feet sit under the hips whatever the bend.
  `apply_motion` sets the outside foot at most 10 cm wider (ours) [read: :425-431], [2nd reader: RE-DERIVED, G/ground_code.md:151
  and G/ground_sources_read.md:230; lines are :426-432 on 31d1c6d] and `kinetic_chain` turns the hips, trunk
  and head about the PELVIS, not the feet ~~[read: :643-650]~~ [2nd reader: WRONG cite. `kinetic_chain` is model_rig.cpp:620-639;
  :643-650 is `arm_froude`. The hips line is :626.]. The trunk's 0.35 is a world-frame angle about the pelvis: the chest
  is rotated from the untilted pose by `c.trunk_lean` ~~[read: :647-648]~~ [2nd reader: WRONG cite; it is :628-629]. The head's -0.30
  leans it OUT of the turn ~~[read: :657-658]~~ [2nd reader: WRONG cite; it is :637-638, with the constant at model_rig.h:136].
  So the line from the feet to the hips stays near vertical [inferred]. At a 1 g bend the pelvis takes ~10 deg, the trunk
  ~3.4 deg and the head about -3 deg. Item 214 is what that looks like.
- The sim asks for more than any grip gives. Hunter dials: top-speed turn 150 deg/s, standstill 360 deg/s [read:
  chase/dials.h:27-28]. The rate falls linearly with speed [read: chase/chaser.cpp:169-172], and the heading moves at that rate
  [read: :351-356]. a = v x w(v) = v(6.28 - 0.407 v) peaks at about 24 m/s/s (2.4 g) near 7.7 m/s, for a 9 m/s top
  [inferred, computed]. Acceleration 9 and braking 14 m/s/s [read: chase/dials.h:25-26].
- The greyhound's timing half of T1 is already true by construction. `gait_pose` takes speed and phase only, so the stride on
  a bend is the straight's at the same speed [read: game/model_rig.cpp:738-739, :766-768; inferred].
- Recorded cases the rows already use: `hunter_lean_trace` plays a kept run (`DZ_LEAN_RUN`, game/runs/*.txt) or "the flee
  bot's 60 s on seed 1 at the hardest level" at 144 frames a second [read: game/tests/world_app_tests.cpp:916-919]. On this
  machine game/runs holds 20 kept runs, untracked, newest `run-20261113-195826.txt` [read: ls]. The L177 run
  `run-20261112-080014` is not among them [read: ls; exo_memory/handback/p-l180-lap1-C_2026-11-12.md:49].

### 2b. Outside sources

All of these are used for their FINDINGS (numbers as constants, ideas). No code, data file or art from any of them is used,
so no licence binds a shipped file. Licences are given where read.

**S1. Churchill, Salo & Trewartha 2011, "The effect of the bend on technique and performance during maximal speed
sprinting", ISBS 29, Porto, pp. 471-474.** PDF at https://ojs.ub.uni-konstanz.de/cpa/article/view/4874/4513 [read whole,
4 pages]. Licence page: "Authors can retain copyright, while granting the International Society of Biomechanics in Sports
(ISBS) the right of first publication" [read: https://ojs.ub.uni-konstanz.de/cpa/article/view/4874]. No open licence: cite
the numbers, copy nothing.
- 7 male sprinters, 60 m maximal runs in lane 2, filmed at 40-47.5 m, 200 Hz [read: isbs4874.txt:36-46]. The camera stood at
  the bend's centre, "32.72 m from the inside edge of lane 2" [read: :42-44]. So the race line's radius is ~32.9 m [inferred].
- Whole-body lean was measured "from the MTP to body CoM during contact" [read: :81-82], which is the quantity physics fixes.
- Bend speed 9.39 / 9.34 m/s against 9.86 / 9.80 on the straight, about 5% slower [read: Table 1, p. 473; :134].
  Left (inside) step contact 0.105 -> 0.116 s, step frequency 4.50 -> 4.39 Hz, step contact factor 0.48 -> 0.50 [read: :140-144].
  The left touchdown distance rose 0.30 -> 0.36 m [read: Table 2, p. 474; :207].
- Body lateral lean on the bend: at touchdown -10.3 (left step) and -15.2 (right); at toe-off -8.2 and -14.1 deg.
  Trunk lateral lean at touchdown: -12.8 and -9.9 deg. On the straight the trunk read -4.5 / +2.8.
  Negative means inward: "increased inward (more negative) lean of both the trunk and the whole body" [read: :170-171].
  CAVEAT: the text extraction scrambles Table 2's columns (the right-bend column sits one row high). My column assignment is
  [inferred], from the right-bend column and from the column means agreeing with physics [read: :206-218].
  [2nd reader: OK. I redid the shift: eleven right-bend values sit on lines 206-216 against eleven rows, giving trunk -9.9,
  body TD -15.2, body TO -14.1. The left-straight body TD (3.5) is also only inferred from a duplicate "3.5 +/- 1.2" on :213.]
- [inferred] Gravity's lean at 9.37 m/s on 32.9 m: a = 2.67 m/s/s, atan(0.272) = 15.2 deg. Measured means are 12.75 deg at
  touchdown (0.84 of it) and 11.15 at toe-off (0.73). These are event values, and the stride average is what physics fixes, so
  they agree as far as two events can. The trunk's mean is 11.35 against the body's 12.75: **the trunk carries ~0.89 of the
  whole-body lean**, in space. With the straight's offsets removed it is ~0.84.
- The hip's frontal angles changed by at most 7 deg (inside hip peak adduction 4.1 -> 10.6) [read: :216-218]. So the pelvis
  leans nearly as one with the legs [inferred]. [2nd reader: UNSUPPORTED. Those rows are scrambled beyond a clean assignment
  (:214-218). The paper reports no pelvis angle at all. A hip adduction of 10.6 deg on top of an 11 deg trunk lean means the
  leg is NOT in line with the trunk. The pelvis share 1.0 in L3 has no measured source.]

**S2. Imai, Moore, Raphan & Cohen 2001, "Interaction of the body, head, and eyes during walking and turning", Exp Brain Res
136:1-18.** Abstract only, PubMed 11204402, fetched by eutils [summary]. Paywalled (Springer). Walking turns on 0.5 m and 2 m
radii; "Maximum centripetal accelerations in sharp turns were ca.0.4 g, which tilted the GIA ca.21 degrees ... anticipated by a
roll tilt of the head of up to 8 degrees"; "Yaw head deviations ... anticipating the shift in lateral body trajectory by as much
as 25 degrees. The trunk did not anticipate". [inferred] The head rolls INTO the turn, ~0.38 of the GIA's tilt, and early.
No running study of head roll on a bend was found.

**S3. Hicheur, Vieilledent & Berthoz 2005, Neurosci Lett 383:87-92.** Abstract only, PubMed 15936517 [summary]. Figure-of-eight
walking: the head anticipates the future direction by 29.75 +/- 7.41 deg (left) and 30.86 +/- 9.92 (right) at most.

**S4. Usherwood & Wilson 2005, "No force limit on greyhound sprint speed", Nature 438:753.** Abstract only, PubMed 16341003
[summary]; paywalled. It is the room's T1 source. "on entering a tight bend, greyhounds do not change their foot-contact
timings, and so have to withstand a 65% increase in limb forces". "Humans sprinting around banked bends change the duration of
foot contact" (S1 measures that on a flat bend: +10% on the inside step). [2nd reader: DOWNGRADED. "Flat" is not in the S1 text;
it says "a standard outdoor track" (isbs4874.txt:38-39). The +10% (0.105 to 0.116 s) is OK. The S4 quote is OK (PubMed 16341003).
Cross-check, [inferred] by me: a 65% limb-force rise at unchanged contact time is sqrt(1+(a/g)^2) = 1.65, so a/g = 1.31, a
lean of 53 deg. That is the greyhound source's own implied bend, close to the scout's mu 1.33, and is better support than the press cheetah figure.]

**S5. Wilson et al. 2018, "Biomechanics of predator-prey arms race in lion, zebra, cheetah and impala", Nature 554:183.**
Abstract only, PubMed 29364874 [summary]. Predators had "37% greater acceleration and 72% greater deceleration capacity than
their prey". Wilson et al. 2013 (cheetahs, Nature 498:185) abstract only, PubMed 23765495 [summary]: "some of the highest
measured values for lateral and forward acceleration, deceleration". The 13 m/s/s stays press, as in L187.

**S6. King, Burnie, Nagahara & Bezodis 2022, J Sports Sci 40:2524-2532, doi 10.1080/02640414.2023.2172797.** Author copy
https://cronfa.swan.ac.uk/Record/cronfa62380/Download/62380__27897__7052fa38a21d419b8dc8c5b87b3d51f2.pdf [read: the licence,
methods and Tables 1-2]. "This is an Open Access article distributed under the terms of the Creative Commons Attribution
License (http://creativecommons.org/licenses/by/4.0/)" [read: sw62380.txt:95]. CC BY 4.0 allows commercial use and needs
attribution if anything is reproduced; numbers only are used here.
- 14 sprinters, the first four steps from blocks [read: :133-134].
- Four-step means: touchdown distance -0.03 +/- 0.04 and toe-off distance -0.89 +/- 0.04, in trochanter heights, negative
  meaning the foot behind the CM [read: :244-247, :186-195]. CM height 0.86 at touchdown, 0.95 at toe-off.
- Upper trunk to the horizontal: 34 +/- 8 deg at touchdown and 44 +/- 8 at toe-off [read: ~~Table 2~~ [2nd reader: WRONG label, it is
  Table 3, sw62380.txt:341-382; Table 2 is joint angles] :374 and the rows below].
  That is 56 and 46 deg forward of vertical.
- CAVEAT: the extraction shifts the row labels by one. My assignment follows the abstract, which ties touchdown distance to
  r = -0.672 [read: :52, :245; inferred].
- [inferred] The whole body leans 2 deg forward at touchdown and atan(0.89/0.95) = 43 deg at toe-off, so it pivots through
  ~40 deg in each early stance. **The trunk leans further forward than the whole body during a hard start.**
  [2nd reader: DOWNGRADED. At toe-off the trunk is 46 and the body 43, a 3 deg gap inside an SD of 8. Only at touchdown (56 against
  2) is it clear. All four-step means, including steps 3-4 where the lean is already small (sw62380.txt:394-395).]

**S7. Kugler & Janshen 2010, "Body position determines propulsive forces in accelerated running", J Biomech 43:343.**
Abstract only, PubMed 19863962 [summary]; paywalled. "The orientation of the maximum force vector strongly correlated with the
forward lean of the body at toe-off (r=0.93)". It is the measured face of the same law: force direction = body lean.
[2nd reader: DOWNGRADED. Quote OK (PubMed 19863962). A correlation of r=0.93 gives no slope or offset, and the abstract states no
angle. "Same law" is the scout's inference.]

**S8. Harper et al. 2022, "Biomechanical and Neuromuscular Performance Requirements of Horizontal Deceleration", Sports Med
52:2321-2354.** https://pmc.ncbi.nlm.nih.gov/articles/PMC9474351/ [read: the licence and Table 1, from the HTML as text].
"licensed under a Creative Commons Attribution 4.0 International License" [read: harper.txt:106]. Commercial use allowed;
attribution if reproduced; numbers only used.
- Average decelerations to a stop or a 180 deg turn: -4.43 to -6.82 m/s/s (Zamparo et al., in Table 1) and -4.44, with
  -5.99 late (Harper et al. 2020, in Table 1). Peaks: -8.48, and -9.60 to -11.02 [read: harper.txt:246-247, :404, :553].
- "Increased braking force during PFC due to more upright and posterior trunk" (Jones et al., in Table 1) [read: :272-289].
  So when braking, **the trunk stays more upright than the body's backward lean** [inferred]. [2nd reader: UNSUPPORTED. Jones'
  line compares the penultimate with the final foot contact in 27 female soccer players at 4 m/s (harper.txt:272-289). It says
  "more upright and posterior" and gives no trunk or body angle. Nothing read compares trunk with body in a stop.]
- Braking is multi-step: "Increased approach distances ... require more braking steps" [read: :194]. The penultimate
  braking step is 0.92-1.26 m long and its contact 0.35-0.40 s [read: :578-588].
- Deceleration rates run ~17% greater than maximal accelerations [read: :415].

**S9. Jindrich, Besier & Lloyd 2006, J Biomech 39:1611.** Abstract only, PubMed 16038914 [summary]. In cuts at ~3 m/s,
without braking "lateral forces would result in body rotations 1.4-3 times the change in COM movement direction"; the model
"body rotation should match COM deflection" explains 70% of the variance. [inferred] The body's yaw follows the velocity's
direction through a cut; it neither leads nor overshoots it. Only the head leads (S2). [2nd reader: DOWNGRADED. Quotes OK
(PubMed 16038914). "Match" is the model's hypothesis, fitted to BRAKING FORCE variance in 3 m/s cuts. Body yaw against path
direction was not reported in the abstract.]

**Read for the shape only, not cited for numbers:** Bezodis 2018 phase analysis (Swansea author copy; its repository terms
are non-commercial) and Vellucci & Beaudette 2023 (Frontiers) were downloaded and not used.

## (3) The design

### 3a. The laws, each with its source

- **L1, the bank (physics; measured by S1).** The body's line from its feet to its centre of mass leans toward the turn by
  `theta = atan(a_lat / g)`, with a_lat = v x w. A grip cap gives `|a_lat| <= mu g`, so the lean is at most atan(mu). This is
  Newton: the ground force must pass near the CM or the body rotates. Over a stride its average direction is (a, g)
  [inferred]. S1 measured 0.84 and 0.73 of it at the two events. Human maximum: Chang & Kram's 1 m circle at 2.99 m/s is
  8.9 m/s/s, a 42 deg lean; their 6 m circle is 5.3 m/s/s, 29 deg [inferred from their Table 1 as quoted in
  p-l187:65, summary].
- **L2, the pitch (physics; S6, S7, S8).** In the fore-aft plane the same law holds with a_fwd. A start at 9 m/s/s (the
  hunter's dial) asks for 42.5 deg forward, and sprinters from blocks reach 43 deg at toe-off (S6). Human braking at -4.4 to
  -6.8 m/s/s asks for 24-35 deg back, with peaks of -8.5 to -11 at 41-48 deg (S8). The hunter's -14 asks for 55 deg back,
  above any human figure read here: ~~a cheetah-class stop (S5)~~ [2nd reader: UNSUPPORTED. S5's abstract gives only "72% greater
  deceleration capacity than their prey" (PubMed 29364874), no m/s/s. No cheetah deceleration figure was read.].
- **L3, how the body carries L1, by segment, in space:**

| segment | share of theta | source | today |
|---|---|---|---|
| feet to hips (legs) | 1.0, the pivot is the feet | physics; S1's MTP-to-CoM lean | ~0: feet under the hips |
| pelvis | ~1.0 (hip frontal angles change <= 7 deg) | S1 Table 2 [inferred] | 1.0 about the pelvis, hip line only |
| trunk | ~0.89 (0.84 with the straight removed) | S1 Table 2 [inferred] | 0.35 about the pelvis |
| head, roll | ~+0.38, into the turn, early | S2, walking at 0.4 g [summary] | -0.30, out of the turn |
| head, yaw | leads the path by up to 25-31 deg | S2, S3, walking [summary] | the sim's look, Valve's ease |
| body yaw | follows the velocity's direction | S9 [summary] | Valve's converge on the heading |

- **L4, pitch shares (S6, S8).** Starting: the trunk at least as far forward as the body, 46-56 deg from vertical against the
  body's 43 at toe-off, so a share of ~1.0 or more [inferred]. Braking: the trunk more upright than the body's lean back. No
  number was read, so a trunk share of 0.5 of the backward lean is [ours] and to be kept small.
  [2nd reader: RE-DERIVED for the start's trunk share ~1.0: the room already holds kPitchTrunkShare 1.0 (pelvis 0.5, head 1.0),
  G/ground_code.md:118. S6 gives a source for a value the game has from its first game; it adds no new number. Also
  L3's rows "pelvis ~1.0" and "head roll +0.38" carry no measured source (see notes at S1 hips and S2); 0.38 is a maximum
  at 0.4 g, taken to 1 g and above.]
- **L5, the stride on a bend.**
  - Human-law bodies (player, lesser kinds by H1): the inside step's contact +10%, step rate -2.4%, the inside touchdown
    distance +20% (S1, at 9.4 m/s on ~33 m only).
  - The T1 hunter: no change at all (S4). gait_pose already gives that.
- **L6, grip past a human's (T1).** Raise mu and nothing else. Lean and speed follow L1 and H2: 45 deg at mu 1.0,
  53 deg at 1.33 [press], 63 deg at 2.0 (ours). Each is deeper than the ~42 deg any human was measured at, and held at a
  speed no human holds on that radius (p-l187 9.2's table), with the stride rhythm unbroken. One cue, physical, as 168 and
  217 ask [inferred]. [2nd reader: the span "deeper than the ~42 deg any human was measured at" is WRONG: ~~any human was measured
  at~~ no human lean at 42 deg was measured in anything read; 42 is computed (see line 6 note). The 63 deg at mu 2.0 is [ours].]
- **What a large lean costs in space (physics).** The feet sit L sin(theta) outside the CM path. The hips drop
  L(1 - cos theta). With the hunter's hip height 0.984 m [summary: G/ground_sources_read.md:266]: at 45 deg, 0.70 m out and
  0.29 m lower; at 53 deg, 0.79 m out and 0.39 m lower [inferred]. In a 1.5 m corridor the outside foot can reach the wall.

### 3b. Inputs, outputs, place in the code

- **Inputs, per character per tick:** horizontal acceleration (lateral and forward) and the on-feet flag. DrawnChaser already
  computes them from positions [read: game/model_rig.cpp:503-508]. Plus mu per kind and three shares.
- **Outputs:** the roll and pitch of the whole body about its ground point, and the trunk and head shares in space.
- **Where it goes:**
  - `DrawnChaser::step` keeps Overgrowth's two half-lives (his pick 155, "tilt first") and changes only the target's gain to
    atan(min(|a|, mu g)/g). The velocity term stays [ours: keep].
  - `apply_motion` gains a first step: rotate every joint about the ground point `feet` by (roll, pitch). Then the existing
    floor clamp and `reach_leg` put the feet back on the floor [read: :436-475]. Its 0.30 m hip-sink clamp no longer has to
    carry the drop, because the rotation lowers the hips.
  - `chain_pose` / `kinetic_chain` take the shares in space: trunk 0.89, head +0.38 [ours: wiring; numbers S1, S2]. The first
    game's 1.0 / 0.35 / -0.30 stays a named variant for his clip.
- **One function serves all three bodies:** `body_lean(accel, mu) -> (roll, pitch)` [ours].
  - Hunter: as above.
  - A lesser chaser: it is a box today, placed by `figure_transform(p.pos, p.heading, m)` [summary: G/ground_code.md:212]. Rotate
    the box about its feet by the same roll and pitch (ChaserPose already carries lean and pitch for every kind [summary:
    G/ground_code.md:223]). When it gets a model, it runs gait_pose like the hunter, with mu 1.0 and its own cue. T2 (the
    interceptor's held head) is then just a head share of 0; T4 (the pack's fixed rhythm) is L5's no-change rule.
  - The player: `Body::pose` hangs from the eye [summary: G/ground_code.md:59]. Keep the camera as it is, and set the feet
    targets L sin(theta) outward of the eye's plumb line on a bend, so the legs seen when looking down lean as a person's do
    (159). The view's own roll is the camera's business, not this layer's.
- **Picture only:** the layer reads the sim and writes nothing back. The world self-test part 7 and his 16 kept runs guard
  that [summary: G/ground_constraints_and_roster.md:46-53].

### 3c. Parameters, with sourced defaults

| parameter | default | source |
|---|---|---|
| g | 9.81 | Newton |
| mu_draw, human-law bodies | 1.0 | friction bound, p-l187 3 [inferred there]; Chang & Kram ~0.91 g measured |
| mu_draw, hunter (T1) | 1.33 | cheetah, press [summary]; his eye picks 1.0 / 1.33 / 2.0 |
| trunk share (roll) | 0.89 | S1 [inferred from Table 2] |
| head roll share | +0.38 | S2, walking, abstract [summary] |
| trunk share, braking pitch | 0.5 | [ours]; S8 gives only "more upright" |
| tilt half-lives | 0.1126 s, 0.0548 s | Overgrowth, landed (unchanged) |

### 3d. Cost per character per frame

- [inferred, not timed] About 2 atan, 1 sqrt and one rigid rotation of 21 joints (~21 x 15 flops). That is well under
  1 microsecond per character per frame, beside gait_pose's existing ~80-step arm bisection [summary: G/ground_code.md:231-239].
  Per tick, DrawnChaser's work count is unchanged. For a box, one more 3x3 rotation. For the player, two vector offsets per tick.
  No GPU change. No frame cost was measured anywhere in the record [summary: G/ground_physics_and_fp_body.md:259].

## (4) The first lap a builder would do

**"The whole hunter leans as far as its bend asks."** Roll only. Pitch and stops are lap 2, with their own clip.

- **Files:**
  - `game/model_rig.h`: g, `kGripDraw` 1.0, `kBankTrunkSpace` 0.89, `kBankHeadSpace` 0.38, each with its source line.
  - `game/model_rig.cpp`: `DrawnChaser::step`'s lateral target becomes gravity's law, and `apply_motion` adds the whole-body
    roll about `feet`.
  - `game/tests/model_rig_tests.cpp`: the row at :510 is AMENDED by name. It pins Overgrowth's 1 deg per m/s/s, and its new
    value is 45 +/- 2 deg at 7 m/s on 5 m with mu 1.0.
  - `game/tests/world_app_tests.cpp`: one new row.
  - CHANGELOG.
- **The new row:** `on_a_bend_the_hunters_whole_body_leans_as_far_as_its_turn_asks`.
  - Case: `hunter_lean_trace` on the flee bot, seed 1, brutal (in-repo and deterministic). `DZ_LEAN_RUN` gives his newest kept
    run, `run-20261113-195826.txt`, as a report.
  - The trace must be extended to keep the posed joints: call `gait_pose` per frame as the stage does.
  - Frames counted: on the mesh, with |v w| >= 2 m/s/s held for >= 0.25 s.
  - Measured: the drawn whole-body lean, the angle from vertical of the line from the stance ankles' midpoint to the pelvis in
    the plane across the travel. Against: atan(min(v w, mu g)/g) from the sim's own speed and turn.
  - Bar: median ratio in [0.75, 1.05]. The low end is S1's toe-off 0.73, rounded up; [ours].
  - **Red today:** the feet sit under the hips. Expected ratio < 0.2: at a 24 m/s/s turn, ~2-3 deg against 45 deg capped
    [inferred, not run; the row prints it].
  - **Green after:** the roll is applied about the feet.
  - Report only, not gated: the trunk-to-body ratio (target 0.89), the head roll's sign (into the turn), the share of frames
    where the sim asks a_lat > mu g (a number for A's turn law), and outside-foot clearance to walls.
- **Risk to name before the run:** the landed rows on rocking (sign flips <= 0.5/s) and lean rate (300 / 600 deg/s) were tuned
  at 1/5.8 of this gain [summary: G/ground_sources_read.md:267-269]. If they go red, the cause is the sim path's sway (157, "fix
  sway"), now shown at full size. The fix belongs in the sim, not in a lower gain. They are not weakened [inferred].
- **Tier:** "check it" for the look. The amended row and replay identity are "prove it" by the room's rules for amending a
  landed row [inferred].

## (5) What only his eye decides, and the fewest clips

Build on top of l205-stomp-c's fixed run once it lands (brief:1606's rule). Film lit, at full frame rate, and from a look-behind
that shows the hunter. The washed-out corner and the walls-only look-behind are on record [summary:
G/ground_constraints_and_roster.md:153-161]. Each column states the speed, the radius and the lean asked.

- **Clip 1, how monstrous (mu):** one recorded corner in four columns, side by side: today | mu 1.0 (human) | mu 1.33 |
  mu 2.0. The measured shares are used in all three new columns.
- **Clip 2, how the torso carries it:** the same corner at his chosen mu, in two columns: the measured shares (trunk 0.89, head
  +0.38 into the turn) | his first game's (1.0 / 0.35 / -0.30) on the new whole-body lean. This answers 214's torso and T1's
  "head stays humanlike" together.
- **Clip 3, after lap 2, the stop and the start:** one stop and one set-off from the same run, human-capped (-11 m/s/s,
  48 deg) beside the hunter's dials (-14 / +9, 55 / 42.5 deg).

## (6) What I would NOT build, and why

- The sim's turn law (H2, grip) and speed holding: that is A's lane (L182). This layer only shows the sim honestly and counts
  its excess. Capping the picture to hide a 2.4 g turn is the "turn way too fast keeping speed" of 164, drawn as a lie.
- A lean past atan(mu), or a lean from path look-ahead. The first breaks "obeys physics" (217). The second was withdrawn
  at L177 [summary: G/ground_sources_read.md:233-235].
- Physics-balanced locomotion to produce the lean. The lean stays in the kinematic target, as plan_l185 ruled (SIMBICON
  reacts rather than anticipates) [summary: G/ground_physics_and_fp_body.md:62-63, :158-160].
- Speed- or radius-dependent share tables: only one radius (S1, ~33 m) and one walking study (S2) were measured, so one
  share each.
- The human inside-step changes (L5) for the hunter: S4 says the greyhound keeps its timing. For the player and lesser kinds
  they are a later lap, with S1's numbers.
- Overgrowth's 0.7/0.5/0.4 (balance translations), turning clips or blend spaces (no clips, by his pick), and a cheetah's tail
  or spine flex (not humanoid; T3 belongs to the sprinter).

## What I did not open

- The full texts of Chang & Kram 2007 (JEB was behind a Cloudflare check), Luo & Stefanyshyn 2012 (same), Imai 2001,
  Usherwood & Wilson 2005, Wilson 2013 and 2018, Kugler & Janshen 2010, and Jindrich 2006. Only abstracts.
- Dos'Santos et al. 2018 (angle-velocity trade-off in cutting), Dempsey 2007 and every cutting-trunk study, and Churchill
  2015/2016 (the journal versions of S1). Any running study of head roll on a bend: none was found.
- The Judson (Sheffield Hallam) bend papers, the Portsmouth thesis on banking, and the PeerJ curve model.
- In the game: `Body::pose` beyond the ground file, `camera.cpp` (the view's lean), `figures.cpp`, the bodies of the
  rocking and lag rows beyond their headers, and the l182 and l205 branches' code.
- His kept runs' contents, any capture or clip, and E's l185 clone.

## Second reader

Second reader, 2026-11-13. Read-only. Marks as in the scout. Game code at dreamzone-3 main 31d1c6d. Scratch copies of the
sources I re-read: the scout's `.../scratchpad/turn/*.txt` (isbs4874, sw62380, harper) and my fetches in
`.../scratchpad/adv_turn2/` (PubMed abstracts by eutils; Wikipedia "Running track" raw).

Summary in five lines:
1. 48 checks: 29 OK, 11 DOWNGRADED, 3 UNSUPPORTED, 5 WRONG. 5 spans RE-DERIVED from ground files.
2. The law itself (lean = atan(a/g), grip-capped) stands: physics, and the S1 numbers agree with it to within the radius doubt.
3. WRONG are cites and labels (kinetic_chain lines, Table 2 for 3) and "any human measured at 42 deg" (42 is computed).
4. The 0.73-0.84 band rests on a radius the paper does not state; at a standard lane 2 (37.9 m) it is 0.84-0.96.
5. Row 1 can pass without a leaning body, and the brief's "what the yardstick would need" is not answered.

### What I checked

| scout line | claim | primary opened | verdict | evidence |
|---|---|---|---|---|
| 75-79 | S1 licence: copyright kept, ISBS first publication | isbs_page.html:311 | OK | the text is there; a licence placeholder `##submission.license##` sits at :309 unfilled |
| 80-82 | 7 men, 60 m, lane 2, 40-47.5 m, 200 Hz | isbs4874.txt:36-46 | OK | same words |
| 82 | whole-body lean = MTP to CoM during contact | isbs4874.txt:81-82 | OK | "from the MTP to body CoM during contact" |
| 83-85 | speeds 9.39/9.34 v 9.86/9.80; contact 0.105 to 0.116; SF 4.50 to 4.39 | Table 1, :133-144 | OK | extraction scrambled but columns agree |
| 86-88 | lean -10.3/-15.2 TD, -8.2/-14.1 TO, trunk -12.8/-9.9 | Table 2, :206-218 | OK | right column is one row high; 11 values, 11 rows |
| 91-94 | 12.75 and 11.15 deg, 0.84 and 0.73, trunk 0.89 / 0.84 | same, arithmetic | OK | 12.75/15.2, 11.15/15.2, 11.35/12.75, 10.5/12.45 |
| 1, 81, 91 | the bend's radius ~33 m, 15.2 deg asked | isbs4874.txt:42-44 | DOWNGRADED | radius not stated; standard lane 2 is 37.92 m [summary]; then 13.3 deg and 0.96/0.84 |
| 2 | trunk carried ~0.9 of "that lean" | same | DOWNGRADED | 0.89 is of the measured body lean; of gravity's lean it is 0.75 |
| 95-96, 176 | hip angles <= 7 deg so pelvis share ~1.0 | Table 2, :214-218 | UNSUPPORTED | rows scrambled; no pelvis angle in the paper; hip adduction 10.6 deg means the leg is not in line |
| 98-102 | Imai abstract quotes (0.4 g, 21 deg GIA, 8 deg head roll, 25 deg yaw) | PubMed 11204402 | OK | verbatim. The scout's `imai.txt` is a different paper (PMID 11710455); the quotes still match the right one |
| 102, 178 | head rolls INTO the turn, ~0.38, early | same | DOWNGRADED | "up to 8 degrees"; direction not stated; walking at 0.4 g, a maximum, not a share |
| 105-106 | Hicheur 29.75 / 30.86 deg | PubMed 15936517 (abs1.txt) | OK | verbatim, figure-of-eight walking |
| 108-111 | Usherwood & Wilson quotes, 65% | PubMed 16341003 | OK | verbatim |
| 111 | S1 is "a flat bend" | isbs4874.txt:38-39 | DOWNGRADED | text says "a standard outdoor track" only |
| 113-116 | Wilson 2018 37%/72%; Wilson 2013 "highest measured values" | PubMed 29364874, 23765495 | OK | verbatim |
| 170 | -14 m/s/s is "a cheetah-class stop (S5)" | same | UNSUPPORTED | S5 gives a percentage, no m/s/s |
| 118-122 | S6 licence CC BY 4.0 | sw62380.txt:95 | OK | "Creative Commons Attribution License ... by/4.0" |
| 123-127 | S6 14 sprinters; TD -0.03, TO -0.89; CM 0.86/0.95; trunk 34/44 | sw62380.txt:133, 243-246, 376-378 | OK | row labels shift by one, but the r = -0.672 pairing confirms the scout's assignment |
| 126 | trunk numbers are in "Table 2" | sw62380.txt:341 | WRONG | they are Table 3; Table 2 is joint angles |
| 130-131, 4 | start lean ~43 deg; trunk further forward than body | sw62380.txt:243-246, 394-395 | DOWNGRADED | a toe-off event of a four-step mean; at toe-off 46 v 43 is inside an SD of 8 |
| 133-135 | Kugler & Janshen r = 0.93 quote | PubMed 19863962 | OK | verbatim |
| 135 | "measured face of the same law" | same | DOWNGRADED | a correlation, no angle or slope in the abstract |
| 138-140 | S8 licence CC BY 4.0 | harper.txt:106 | OK | "Creative Commons Attribution 4.0 ... as long as you give appropriate credit" |
| 141-147 | decelerations -4.43 to -6.82, -4.44/-5.99, peaks -8.48, -9.60 to -11.02, 17%, 0.92-1.26 m, 0.35-0.40 s | harper.txt:194, 246-247, 399-405, 415, 548-553, 574-588 | OK | all there; the -4.43 to -6.82 set is a 180 deg shuttle (Zamparo), not a stop |
| 143-144 | in braking the trunk is more upright than the body's lean | harper.txt:272-289 | UNSUPPORTED | penultimate against final foot contact in women at 4 m/s; no trunk or body angle |
| 149-152 | Jindrich quotes (1.4-3 times, 70%) | PubMed 16038914 | OK | verbatim |
| 151-152 | yaw follows velocity direction, neither leads nor overshoots | same | DOWNGRADED | "match" is a model hypothesis fitted to braking forces at 3 m/s |
| 154-155 | Bezodis 2018 repository terms are non-commercial | sw39890.txt:21-22 | OK | "non-commercial purposes only" |
| 164-166, 6 | human maximum 42 deg; 6 m circle 29 deg | p-l187 handback :60-75 | DOWNGRADED | 42 and 29 are atan of speed squared over r from Table 1 speeds; computed, not a measured lean |
| 190-191 | "~42 deg any human was measured at" | all S1-S9 | WRONG | no lean at 42 was measured; the only measured leans are 10-15 deg (S1) |
| 6, 168-170, 189-190 | 45, 53, 63 deg; 42.5 and 55 deg | arithmetic | OK | atan(1), atan(1.33), atan(2), atan(9/9.81), atan(14/9.81) |
| 59-62 | hunter dials 150/360 deg/s, 9 and 14 m/s/s; rate linear in speed | chase/dials.h:25-28; chase/chaser.cpp:169-172, 351-356 | OK | lines match on 31d1c6d |
| 61-62, 8 | turns ask up to 2.4 g, peak near 7.7 m/s for a 9 m/s top | chase/speed.h:22, chase/dials.h:21, chaser.cpp:174 | DOWNGRADED | 9 m/s is assumed; 7.6 gives 2.1 g; the sim also brakes for corners |
| 47 | `gather_poses` lean = atan(speed*turn/9.81) | world_app.cpp:534 | OK | exact. RE-DERIVED: ground_code.md:24 |
| 48 | `ease_poses` overwrites it, `:584` | world_app.cpp:582 | DOWNGRADED | content right; line is :582 |
| 49-51 | row pins 9.8 deg at 7 m/s on 5 m, `:510-514` | model_rig_tests.cpp:510-518 | OK | test at :510, DZ_CHECK_NEAR 9.8 at :518 |
| 52-54 | gait_pose has fore-aft leg swing and no roll; pelvis at feet + body | model_rig.cpp:783, 790-791 | OK | legs use `up` and `fwd` only (line :783 not :782) |
| 53-54 | outside foot at most 10 cm wider, ours | model_rig.cpp:426-432 | OK | RE-DERIVED: ground_code.md:151 |
| 54-56 | kinetic_chain lines `:643-650`, `:647-648`, `:657-658` | model_rig.cpp:620-639 | WRONG | those lines are arm_froude and arm_flare; the chain is :626, :628-629, :637-638 |
| 29 | `target = vel * 0.5f + accel_tilt` at `:509` | model_rig.cpp:510 | DOWNGRADED | content exact, line off by one |
| 65-68 | hunter_lean_trace; 20 kept runs; newest `run-20261113-195826.txt`; L177 run absent | world_app_tests.cpp:916-919; `ls game/runs` | OK | 20 .txt and 20 .dzr; git-ignored (.gitignore:15), more than "untracked" |
| 21-26 | ground-file line cites for his words 146, 151, 164, 168/169, 214, 217, 18 | ground_his_words.md | OK | all quotes at the lines named |
| 37-39 | brief:1589 and :1607 readings of the librarian and Third Place | dreamzone2_the_game.md:1585-1612 | OK | present as quoted |
| 193-195 | hip drop 0.29/0.39 m, out 0.70/0.79 m, from 0.984 m | arithmetic; ground_sources_read.md:266 | OK | L sin and L(1-cos) agree |
| 236 | 21 joints | game/body.h:36-42 | OK | Eye to ToeR, 21 |
| 261-262 | row reads under 0.2 today, 2-3 deg | model_rig.cpp:426-432 | OK | the 10 cm widen alone puts the ankle midpoint ~3 deg off the pelvis; [inferred], not run by me |

Tally: 48 checked. OK 29. DOWNGRADED 11. UNSUPPORTED 3. WRONG 5.

RE-DERIVED: 5.
- scout :47-48 (gather_poses lean and the overwrite by drawn lean) = G/ground_code.md:24.
- scout :53-54 (outside foot 10 cm, ours) = G/ground_code.md:151 and G/ground_sources_read.md:230.
- scout :182-183 (the start's trunk pitch share ~1.0) = G/ground_code.md:118 (kPitchTrunkShare 1.0, pelvis 0.5, head 1.0).
- scout :49-50, :249-250 (the tilt gain, 1 degree per m/s/s) = G/ground_sources_read.md:34-38. The ratio to gravity's is new.
- scout :161-163 (L1: a body on a bend leans as far as speed and radius fix) = brief:1607 last sub-bullet, which the scout
  itself lists at :37-39. New in L1 is the measured support (S1) and the cap.

### The simplest build that passes row 1 without doing what it is for

Row 1 measures the line from the ankle midpoint to the pelvis, in the plane across the travel, and compares it with atan() from
the SAME sim speed and turn. Three ways to green it:
1. Shift the pelvis, and everything above it, sideways by L sin(theta) and leave every segment upright. The line leans theta;
   the trunk, head and legs do not. The body slides and looks like a sidestep. The trunk and head ratios are "report only".
2. Widen the stance: both ankles outward by L sin(theta). Same line angle, splayed legs.
3. Rotate the whole rig about the feet (the scout's intent) and ALSO leave kBankTrunkShare 0.35 about the pelvis on top: green,
   but the scout's "trunk 0.89 in space" is then not what is drawn (see below).
So the row proves only that the formula is applied to the pelvis offset. It cannot tell a leaning body from a displaced one.
It also cannot go red on a lean that arrives late (item 151: "it will turn, and then lean"): the bar is on a median. A gated
row for the trunk-to-body ratio (0.89 [S1]) and for lean LEAD against the sim's turn would close 1 and 3; the room already
has a timing row, "+0.06 s on add21fe" (G/ground_sources_read.md:233-235).

### Mechanisms with no source that are not marked [ours]

- Rotating "every joint about the ground point by (roll, pitch)" (scout :205) and, in the same plan, "trunk share 0.89 in space"
  (:208). If the rotation carries the trunk with it by theta, the chain's 0.89 about the pelvis adds to it (1.89 theta in
  space). Unspecified whether the chain shares become relative. This is the one place the first lap can be built two ways.
- The player's feet "L sin(theta) outward of the eye's plumb line" (:216-218): no source, no [ours].
- The row's gate "|v w| >= 2 m/s/s held >= 0.25 s" (:257): no source, no [ours] (the bar's 0.75 low end is marked).
- Keeping the lean's estimate from drawn positions with Overgrowth's half-lives (:203-204), while the sim's own tick value
  (gather_poses :534) is already at hand and leads it. Item 151 asks for a lean that leads. The scout names the sim value
  (:47-48) and does not use it.

### Where the brief was not met

- "What the yardstick would need to score a bend" is not answered; the scout designs a game row instead. From the room's own
  file the yardstick cannot reach above 4.5 m/s (G/ground_locomotion_and_yardstick.md:208-221, H193:196-197), has no bend mode
  and has no bend reference. [ours, mine] It would need: a per-frame (speed, radius) channel; a reference of lean against a/g,
  of which this file holds one point (S1, 9.4 m/s, one radius); and speeds above 4.5 m/s.
- Body-segment roll of a greyhound or cheetah on a bend: nothing was read. The "greyhound law" is physics plus unchanged contact
  timing (S4 abstract); it carries no measured animal lean. My one cross-check (65% force rise gives a/g = 1.31, 53 deg) is
  [inferred] and rests on an abstract.
- Cutting and starting posture: only S6 (starts) and abstracts. Dos'Santos, Dempsey and the cutting-trunk studies are not read
  (the scout says so, :305-306).

### What I could not check

- Full texts behind paywalls: Chang & Kram 2007, Usherwood & Wilson 2005, Imai 2001, Kugler 2010, Jindrich 2006, Wilson 2013 and
  2018. I checked the scout's quotes against the PubMed abstracts only, none of their tables or body text.
- The standard lane 2 radius (37.92 m) is from Wikipedia (secondary), citing the IAAF manual, which I did not open. The true
  radius of S1's track is unknown to me.
- S1's figure 1 and the exact left-straight body lean at touchdown: the extraction lost them.
- The l182 and l205 branches, `camera.cpp` and `Body::pose`: not opened. I ran nothing and loaded no game tool.
- Whether 0.73 / 0.84 / 0.89 survive in the journal versions (Churchill 2015/2016): not opened by either of us.

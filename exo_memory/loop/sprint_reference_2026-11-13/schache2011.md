# Schache et al. 2011: running speed and lower-limb joint kinetics (one reader, 2026-11-13)

**Bottom line:** this paper reports **no joint angles at all**. It gives joint torques, net powers and work only
(Figs 1-5, Table 1). For the studio's angle reference, what it adds is the **toe-off timing by speed, up to
8.95 m/s** (read off the figures). It also names the data set and the method, which later papers from the same
group may have published as angles. That lead is not checked here.

## 1. The source

- Schache AG, Blanch PD, Dorn TW, Brown NAT, Rosemond D, Pandy MG. Effect of running speed on lower limb joint
  kinetics. Med Sci Sports Exerc 2011;43(7):1260-1271. [read, p.1260 header]
- DOI: 10.1249/MSS.0b013e3182084929 [read, p.1260]
- Licence: none stated. "Copyright 2011 by the American College of Sports Medicine. Unauthorized reproduction of
  this article is prohibited." (footer, every page) [read]
- Text: the publisher's typeset PDF, 12 pages, from a third-party host
  (paulogentil.com/pdf/Effect of Running Speed on Lower Limb Joint Kinetics.pdf). Downloaded by curl again on
  2026-11-13. It is byte-identical to the earlier team copy (sha256 fa8647f0...090e for both, 3,360,375 bytes).
  Read through pdftotext and by rendering pages with PyMuPDF. The figures are vector graphics.
- Supplemental Digital Content 1 and 2 (links.lww.com/MSS/A80 and /A81) were downloaded as PDFs and read. SDC1 is
  the marker set-up photos. SDC2 marks the ten work periods H1-H4, K1-K4, A1-A2 on the power curves. **Neither has
  angles or timing numbers.**

## 2. Who and how

- Runners: 8 (5 male, 3 female). Age 27.0 +/- 7.8 yr, height 176.2 +/- 8.1 cm, mass 73.0 +/- 8.6 kg (mean +/- SD).
  [read, p.1261 Methods, Participants]
- Level: "recruited from running-based sports": track and field (n = 7), Australian Rules football (n = 1).
  Whether they were sprinters, and their personal bests: not stated. [read, p.1261]
- Overground: an indoor 110-m synthetic track at the Australian Institute of Sport. The capture volume
  (15 x 1.3 x 2.2 m) sat about 80 m along the track. Acceleration and deceleration distances were not restricted.
  Speeds were steady state. [read, p.1261-1262]
- Shoes: running sandals (NIKE Straprunner IV), chosen so the foot markers could be seen. [read, p.1261]
- Target speeds: 3.5, 5.0 and 7.0 m/s, then maximum sprinting. Each trial had to be within +/-5% of the target.
  The order was incremental, not randomised. [read, p.1262]
- Measured speeds (mean +/- SD), from timing gates 20 m apart:
  3.50 +/- 0.04, 5.02 +/- 0.10, 6.97 +/- 0.09, 8.95 +/- 0.70 m/s. [read, Abstract; Results p.1263; Table 1 header]
  - n = 8 at the first three speeds and n = 7 at max sprint (one runner did not complete it). [read, p.1262; Table 1]
  - Fig 1 caption says "8.97 m/s" for the sprint. Table 1, the text and the Fig 1 panel title all say 8.95. [read]
- Trials: one trial per runner per speed. [read, p.1268 limitations]
- Kinematics: VICON, 22 cameras, 250 Hz. Calibration error <= 1 mm. [read, p.1261]
- Ground reaction force: eight Kistler plates (900 x 600 mm), 1500 Hz, laid end to end over 7.2 m, covered with
  track surface. [read, p.1261]
- Model: four segments (pelvis, LEFT thigh, LEFT shank, LEFT foot). Hip, knee and ankle are each a ball-and-socket
  joint "described by three angles". Markers were placed on the pelvis and left leg only. **There are no
  trunk, arm or right-leg markers, so shoulder and elbow cannot exist in this data.** [read, p.1261]
- Joint centres: hip by Harrington et al.; knee at the midpoint of the femoral condyle markers; ankle at the
  midpoint of the malleoli. The knee flexion axis comes from a dynamic calibration (knee swung through 0-90 deg)
  using the numerical method of ref 28. [read, p.1262-1263]
- Filtering: Woltring quintic smoothing spline, predicted mean squared error 15 mm. GRF was not filtered.
  [read, p.1262-1263]
- Inertial parameters: de Leva. Software: Vicon BodyBuilder. Torques, power and work were divided by body mass.
  [read, p.1263]

## 3. Angle definitions (rule 4)

**The paper publishes no angle curves or angle values.** It only says how the model's angles were built,
because torques and powers depend on them. Each line below is the joint's definition as far as the paper states it.

- Hip: pelvis to left thigh. 3D, three angles. Anatomical frames follow ref 27 (Schache and Baker 2007, Gait Posture
  25:440-52), "full details ... elsewhere". Zero: not stated (a static standing trial was taken, but its use as the
  angle zero is not stated). Positive direction: not stated. Cardan sequence: not stated. Angles not reported.
- Knee: left thigh to left shank. 3D. The flexion axis comes from the dynamic calibration (ref 28). Zero,
  positive direction and sequence: not stated. Angles not reported.
- Ankle: left shank to left foot. 3D. Zero, positive direction and sequence: not stated. Angles not reported.
- Torques (the only joint curves given) are "expressed in a nonorthogonal reference frame or joint coordinate
  system (27)" [read, p.1263]. Plot sign: in Fig 1 the positive axis is hip Ext, knee Ext and ankle PFlex
  (plantarflexion); in Fig 2 hip/knee Abd and ankle Inv; in Fig 3 Ext rotation [read, figure axis labels].
  These are torque signs, not angle signs.
- Cycle: left foot strike (LFS) to the next left foot strike. Foot strike came from a force plate, using only
  strikes "well within the boundaries of a single force plate" [read, p.1263; Fig 1 caption]. How the closing
  LFS and toe-off were detected: not stated (the 7.2 m of plates may not hold a whole stride at sprint speed;
  that part is [inferred]).

## 4. The curves

No angle curves exist in this source, so the 0-100% table of hip, knee and ankle angles **cannot be filled from
it**. There is nothing to read and nothing to digitise. No shoulder or elbow either (section 2).

What the figures do give, for each of the four speeds, is the group mean +/- 1 SD of:

- 3D joint torques (sagittal Fig 1, frontal Fig 2, transverse Fig 3), in N.m/kg;
- net joint power (Fig 4), in W/kg;
- the work periods (Fig 5 and SDC2), in J/kg.

All are plotted over 0-100% of the stride from LFS. The curves are vector paths in the PDF, so they could be
pulled out exactly if the studio ever scores kinetics. They were not extracted here.

## 5. Events and timing by speed

Toe-off as a share of the stride is the dashed vertical line in Figs 1-4: "the average time (% stride cycle) of
toe-off for each speed condition". It was measured from the vector figure, rendered at 600 dpi, as the position
of the dashed line between the 0 and 100 axis borders. The hip, knee and ankle rows agree within 0.1%.

| Speed (m/s) | n | Toe-off = stance share of stride (%) | Flight share of stride (%) |
|---|---|---|---|
| 3.50 | 8 | 31.5 [figure, Fig 1, +/-0.5% of stride] | 18.5 [inferred] |
| 5.02 | 8 | 26.7 [figure, Fig 1, +/-0.5%] | 23.3 [inferred] |
| 6.97 | 8 | 24.0 [figure, Fig 1, +/-0.5%] | 26.0 [inferred] |
| 8.95 | 7 | 24.8 [figure, Fig 1, +/-0.5%] | 25.2 [inferred] |

- The flight share is my inference: 50% minus stance%. It assumes left-right symmetry, i.e. that each step is
  half the stride. Only the left leg was measured.
- Stance at 8.95 m/s reads about 0.8% of the stride LONGER than at 6.97 m/s. That is close to the read error.
  The two speeds also have different n (7 vs 8), and the sprint has a large SD (0.70 m/s). Do not read it as a
  real reversal without another source.
- Stance time, flight time, stride time, step length and step rate in seconds, metres or Hz: **not stated**.
  None can be computed without the stride time.
- The paper says only, in words, that above 5.02 m/s "runners become increasingly reliant on more frequent ground
  contacts of similar force rather than more forceful ground contacts" (p.1270). [read] No number is given for it.

## 6. Converting to the studio's convention

- **Angles: nothing to convert, because there are none.** This source cannot add an angle row above 4.5 m/s.
- Cycle start: this paper uses LEFT foot strike, the studio uses RIGHT foot strike. For the toe-off timing in
  section 5, that is a mirror, not a shift. It assumes symmetry [inferred]. The left-cycle toe-off percentages
  can be used as right-cycle percentages.
- Flight share depends on the same symmetry assumption.
- If the studio ever uses the torques:
  - signs are opposite to its angle convention at the hip and knee (extension torque plotted positive);
  - the ankle plots plantarflexion positive, so flip it to match dorsiflexion-positive;
  - the torques are in a joint coordinate system, not a Cardan sequence;
  - they are per kg of body mass.
  These are internal (muscle) torques: "internal torques" [read, p.1263].
- What cannot be converted: the angle zero, sequence and sign. They are not stated here and live in ref 27,
  which was not read.

## 7. What changes with speed in this source

- From 3.50 to 8.95 m/s, the largest increases are in **swing** (stance torques increase less, see the next
  point):
  - Peak hip extension torque in terminal swing rose from 0.91 to 4.18 N.m/kg (4.59-fold).
  - Peak knee flexion torque in terminal swing rose from -0.53 to -1.76 N.m/kg (3.32-fold).
  - Positive hip work in terminal swing rose from 0.31 to 2.28 J/kg (7.35-fold).
  [read, Table 1; Results p.1264, p.1266]
- **Stance** loads level off:
  - Peak knee extension torque at midstance had no significant speed effect (3.12, 3.52, 3.59, 3.55 N.m/kg).
  - Ankle stance work rose from 3.50 to 5.02 m/s and then barely changed (positive work 1.00, 1.30, 1.38,
    1.44 J/kg). [read, Table 1]
- Toe-off moves earlier in the stride, from about 31.5% at 3.50 m/s to about 24-25% at 7-9 m/s (section 5).
  Flight therefore takes a larger share of the stride. [figure / inferred]
- For an animator, my reading is this [inferred]: at sprint speed the swing leg is driven hard by the hip, and the
  hamstrings brake the shank before strike. The stance leg does not push much harder than at 5 m/s.

## 8. Could not obtain / not stated

- Joint angles of any kind, at any speed: not in the paper, its figures, Table 1, or SDC1/SDC2.
- Angle zero, positive direction and Cardan sequence: not stated. They are deferred to ref 27 (Schache and Baker
  2007), which was not read.
- Stride time, stance time, flight time (s), step length (m), step rate (Hz): not stated.
- Detection method for the closing foot strike and for toe-off: not stated.
- Runners' sprint ability or personal bests: not stated.
- Shoulder, elbow, trunk and the right leg: not measured.
- **Lead, not checked here (from memory, so treat as [inferred]):** the same group later reused an Australian
  Institute of Sport overground data set that goes up to maximal sprinting. One example is Dorn, Schache and Pandy
  2012, J Exp Biol, on muscle strategy versus running speed. Some of those papers or their published simulation
  files may carry joint angles. A reader should check.

## Second reader

Adversarial second read, 2026-11-13. PDF downloaded again into
`C:/Users/zackn/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/sprint/check/schache/dl1/s.pdf`
(3,360,375 B, 12 pages by PyMuPDF, sha256 fa8647f0...090e, same bytes). Text by pdftotext. Toe-off measured with my
own script (`.../check/_scripts/schto.py`): the x of each dashed line's path against the x of the 0 and 100 tick
marks of its panel, rather than the axis borders.

Checked and found right:
- Citation, DOI, pages 1260-1271, copyright footer [read].
- Participants 8 (5 M, 3 F), 27.0 +/- 7.8 yr, 176.2 +/- 8.1 cm, 73.0 +/- 8.6 kg, track and field n = 7, Australian
  Rules n = 1; 110-m track, volume 15 x 1.3 x 2.2 m about 80 m along; sandals; incremental order; +/-5 %; speeds
  3.50 / 5.02 / 6.97 / 8.95 with SDs, n = 7 at sprint, "8.97" in the Fig 1 caption; 22 cameras at 250 Hz, <= 1 mm;
  eight 900 x 600 mm Kistler plates at 1500 Hz over 7.2 m; 15 mm spline; de Leva; internal torques; JCS (27) [read].
- Model: four segments, pelvis and LEFT leg only, ball-and-socket joints "described by three angles", Harrington,
  condyle midpoint, 0-90 deg dynamic knee calibration (28), refs 27 and 28 as cited [read].
- Table 1 and its text: hip extension torque in terminal swing 0.91 to 4.18 (4.59-fold); knee flexion torque in
  terminal swing -0.53 to -1.76 (3.32-fold); positive hip work in terminal swing 0.31 to 2.28 (7.35-fold); knee
  extension at midstance 3.12 / 3.52 / 3.59 / 3.55 with no speed-effect mark; ankle positive stance work 1.00 / 1.30
  / 1.38 / 1.44 [read]. The p.1270 sentence on more frequent ground contacts [read].
- Toe-off from the vector Figure 1: 31.60 / 26.69 / 24.06 / 24.82 % against the file's 31.5 / 26.7 / 24.0 / 24.8 %
  (all within the stated +/-0.5 %). Fig 1 axis words Ext / Flex and PFlex / DFlex seen on the rendered page.
- Definitions: every line of section 3 against p.1261-1263 and the Fig 1 caption (LFS to LFS). All right.

Struck: nothing.
Could not check: SDC1 and SDC2 (not downloaded again); the Fig 2 and Fig 3 axis words (only Fig 1 was rendered).

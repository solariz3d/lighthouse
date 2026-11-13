# Miyashiro et al. 2019: maximal-speed sprinting, 79 men, 8.8 to 11.0 m/s

Read in full on 2026-11-13 by one reader of the sprint-reference team (research only).
Marks: [read] = in the source's own text or table; [figure] = read off a figure; [abstract] = abstract only;
[inferred] = my own arithmetic or reading, with the working shown.

**The short version.** This source has **no joint-angle curves**. It reports angles at discrete events
(foot strike, toe-off, opposite foot strike, swing extremes) as means and SDs across 79 runners. It also gives
regression equations that predict each one from speed, leg length, step frequency and swing/support ratio.
Its angles are 2D sagittal included angles (180 deg = straight), not Cardan angles.

## 1. The source

- Miyashiro K, Nagahara R, Yamamoto K, Nishijima T (2019). Kinematics of maximal speed sprinting with different
  running speed, leg length, and step characteristics. Frontiers in Sports and Active Living 1:37.
  Published 26 September 2019. doi 10.3389/fspor.2019.00037 [read, PDF p.1]
- Licence: Creative Commons Attribution (CC BY), "Copyright 2019 Miyashiro, Nagahara, Yamamoto and Nishijima"
  [read, PDF p.10, copyright block]. The HTML page links CC BY 4.0 [read, article HTML].
- Where the text came from:
  - The publisher PDF (506,368 B), copied from the team's earlier download into my scratch folder
    (`scratchpad/sprint/read_miyashiro2019/pdf/f.pdf`) and re-extracted with pdftotext (UTF-8, layout and plain).
  - The publisher's full-text HTML, downloaded with curl
    (https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2019.00037/full).
    Tables 1 to 4 were taken from the HTML because the PDF text lost the minus signs. Where the PDF was legible,
    HTML and PDF values agree.
  - The Figure 1 image, downloaded with curl from the publisher
    (files/Articles/485041/fspor-01-00037-HTML/image_m/fspor-01-00037-g001.jpg) and viewed.

## 2. Who and how

- Runners: 79 male sprinters [read, p.2 "Participants"]. Age 20.7 +/- 1.9 y, stature 1.75 +/- 0.05 m,
  body mass 66.6 +/- 5.0 kg [read, p.2 and Table 1].
- Level: 100 m personal best 11.08 +/- 0.42 s, range 10.30 to 12.14 s [read, p.2 and Table 1]. These are trained
  sprinters, not elite ones. The authors say the equations only hold for this range [read, p.9, "limitations"].
- Overground. One maximal 60 m sprint from a two-point standing start, in spiked shoes. Filmed from the 40 m to the
  50 m mark, where runners were told to reach maximal speed [read, p.2, "Experiments"]. Track surface: not stated.
- Speed: one maximal-speed stride per runner. Running speed 9.90 +/- 0.46 m/s, range 8.83 to 10.97 m/s
  [read, Table 1]. There are no separate speed conditions. Speed varies only between runners (cross-sectional).
- Capture: one panning camera (Casio EX-F1) at 300 Hz, 512 x 384 px. It stood 1 m high, 45 m from the lane centre,
  square to the 45 m mark, with a field of view of about 4 m [read, p.2]. Reference markers stood every metre on
  both sides of the lane [read, p.2-3].
- Digitising: by hand, at 150 Hz, in the Frame-DIAS system. It ran from five frames before a left foot strike to
  five frames after the next left foot strike (one stride, two steps) [read, p.3, "Data Processing"].
  Seven points: right toe, right fifth metatarsal head, right heel, right ankle, right knee, right greater
  trochanter, and the suprasternal notch [read, p.3]. Skin markers were on the right 5th metatarsal head, ankle,
  knee and greater trochanter [read, p.3].
- 2D sagittal coordinates came from the four nearest reference markers. The estimated error is under 9 mm, taken
  from an earlier study with the same camera and setup [read, p.3].
- Filter: Butterworth low-pass, cut-off 4.5 to 10.5 Hz, chosen by residual analysis (Wells and Winter 1980).
  Filter order: not stated [read, p.3].
- Events: foot strike and toe-off were picked by eye, three times, by one examiner, "all identifications being
  consistent" [read, p.3]. No force plate.
- Model: four segments, right foot, right shank, right thigh and trunk [read, p.3]. Only the RIGHT leg is analysed.
  No arms, no pelvis segment, no left-leg angles.

## 3. Angle definitions

General rule from the text: "An extension of the joints was given a positive convention" [read, p.3]. Every other
part of the definitions is given only as a drawing, in Figure 1B [figure, viewed]. All angles are 2D, projected on
the sagittal plane from one camera. There is no Cardan sequence. The runner in Figure 1 moves to the right.

- **Hip angle.** Trunk (greater trochanter to suprasternal notch, [inferred] from the digitised points) and thigh
  (greater trochanter to knee). Included angle on the front side; 180 = trunk and thigh in line. Positive =
  extension (a bigger angle); above 180 = thigh behind the trunk line. Standing value: not stated. Text p.3, Fig 1B.
- **Knee angle.** Thigh and shank (knee to ankle). Included angle on the back side; 180 = straight.
  Positive = extension. Text p.3, Fig 1B.
- **Ankle angle.** Shank and foot (foot = ankle to 5th metatarsal head, [inferred] from the model's points).
  Included angle on the front of the ankle. Positive = plantarflexion ("extension (plantar-flexion)", p.3).
  Anatomical-neutral value: not stated.
- **Thigh angle.** Thigh against a vertical line through the hip; 0 = thigh vertical. Positive = knee ahead of the
  hip ("+" is drawn on the running side, Fig 1B). Sign confirmed by the values [inferred]: +33.0 at foot strike,
  -28.7 at toe-off.
- **Shank angle.** Shank against a vertical through the knee; 0 = shank vertical. Positive = ankle ahead of the
  knee. Fig 1B; sign confirmed by +5.3 at foot strike, -53.3 at toe-off [inferred].
- **Foot angle.** Foot against a vertical; 0 = foot vertical; positive = front of the foot ahead (Fig 1B).
  Which foot point is the end: not stated.
- **Leg angle.** A line from the greater trochanter toward the foot, against a vertical; positive = forward.
  Fig 1B; the foot end of the line: not stated (drawn near the toe or metatarsal head).
- Angular velocities: by differentiating these angles [read, p.3]. Differentiation method: not stated.
- **Cycle start.** The stride runs from LEFT foot strike to the next LEFT foot strike [read, p.3 and Fig 1A].
  Phase order: left support, left flight, right support, right flight [read, p.3]. So the analysed right leg's
  foot strike falls about half-way through the paper's stride (Section 5).
- "Contralateral foot strike" means left foot strike. The right (swing) thigh angle is reported there
  [read, Table 1, Fig 1A].

## 4. The curves

**No curves are given.** The paper reports values at events only, so I could not fill rows at 0, 10 ... 100 %.
Below is every joint and segment angle the paper gives, placed at its event, in the cycle the studio uses
(from RIGHT foot strike). Event times are [inferred] from the mean phase times in Table 1 (Section 5).
Values are means +/- SD across 79 runners at 9.90 +/- 0.46 m/s, in the source's convention (Section 3).
Shoulder and elbow were not measured.

| % stride from right FS | Event | Hip angle (deg) | Knee angle (deg) | Ankle angle (deg) | Thigh angle (deg) | Mark, place |
|---|---|---|---|---|---|---|
| 0 | right foot strike | 131.9 +/- 3.7 | 152.3 +/- 5.6 | 123.2 +/- 4.3 | 33.0 +/- 3.6 | [read] Table 1 |
| 0 | (also: shank 5.3 +/- 3.2, foot 62.1 +/- 3.6) | | | | | [read] Table 1 |
| 0 to 24, time not stated | knee most flexed in stance | | about 138.7 | | | [inferred] 152.3 - 13.6 |
| 0 to 24, time not stated | ankle most dorsiflexed in stance | | | about 104.1 | | [inferred] 123.2 - 19.1 |
| 10, 20 | no data | | | | | |
| 24.1 | right toe-off | 196.4 +/- 5.3 | 155.4 +/- 4.8 | 147.3 +/- 4.5 | -28.7 +/- 3.6 | [read] Table 1; % [inferred] |
| 24.1 | (also: shank -53.3 +/- 2.9, foot -20.6 +/- 4.7) | | | | | [read] Table 1 |
| 30, 40 | no data | | | | | |
| 50.6 | left foot strike (contralateral FS) | | | | 4.1 +/- 8.6 | [read] Table 1; % [inferred] |
| 24 to 100, time not stated | knee most flexed in swing ("minimum knee joint angle") | | 31.6 +/- 5.6 | | | [read] Table 1 |
| 24 to 100, time not stated | thigh at its highest ("maximal thigh lift angle") | | | | 70.3 +/- 4.6 | [read] Table 1 |
| 60, 70, 80, 90 | no data | | | | | |
| 100 | next right foot strike | | | | | same as 0 |

Ranges of motion that go with the table [read, Table 1, means +/- SD, deg]:
- Knee flexion angular displacement in stance (foot strike to most flexed): -13.6 +/- 3.6.
- Knee extension angular displacement (most flexed to toe-off): 16.9 +/- 5.7.
- Ankle dorsiflexion angular displacement (foot strike to most dorsiflexed): -19.1 +/- 3.9.
- Ankle plantarflexion angular displacement (most dorsiflexed to toe-off): 43.2 +/- 3.8.
- Hip extension angular displacement, foot strike to toe-off: 64.5 +/- 5.1.
- Thigh 61.8 +/- 5.1, shank 58.6 +/- 3.6, foot 82.8 +/- 4.4 angular displacement in stance.

Checks [inferred]: 123.2 - 19.1 + 43.2 = 147.3, the ankle at toe-off. 131.9 + 64.5 = 196.4, the hip at toe-off.
152.3 - 13.6 + 16.9 = 155.6 against 155.4 at toe-off (these are means of individuals, so a small gap is expected).

Peak angular velocities [read, Table 1, deg/s]: in stance, max hip extension 850 +/- 73, max knee extension
443 +/- 118, max ankle plantarflexion 1,009 +/- 92. In swing, max knee flexion -1,185 +/- 92 and max thigh lift
792 +/- 47. Max leg backward swing: -466 +/- 50 in swing, -664 +/- 43 in stance.

Trunk lean, worked out from the means [inferred]: with this hip angle, hip = 180 - thigh angle - trunk forward lean.
That gives a trunk (hip-to-suprasternal line) lean of about 15 deg forward at foot strike (180 - 131.9 - 33.0) and
about 12 deg at toe-off (180 - 196.4 + 28.7). The paper does not report this; it is built from means of individuals.

## 5. Events and timing by speed

Group means [read, Table 1], at one speed (9.90 +/- 0.46 m/s, range 8.83 to 10.97):
- Step length 2.15 +/- 0.11 m; step frequency 4.60 +/- 0.22 Hz; stride time 0.435 +/- 0.020 s.
- Support: right 0.105 +/- 0.007 s, left 0.103 +/- 0.007 s.
- Flight: right 0.115 +/- 0.010 s, left 0.112 +/- 0.009 s.
- Right swing 0.330 +/- 0.017 s; swing/support ratio 3.16 +/- 0.24; flight/support ratio 1.10 +/- 0.11.
- Definitions [read, p.3]: step length = half the distance between consecutive left toe positions;
  step frequency = 1 / (half the stride time); speed = step length x step frequency.

Event positions [inferred from the Table 1 means; stride 0.435 s]:
- From LEFT foot strike (the paper's start): right foot strike at 49.4 % ((0.103 + 0.112) / 0.435).
- From RIGHT foot strike: right toe-off 24.1 %, left foot strike 50.6 %, left toe-off 74.3 %.
- Right-leg stance share of the stride: 24.1 % (0.105 / 0.435).

By speed: the paper has no measured speed groups. Its Table 4, Condition A, predicts step frequency and
swing/support ratio at the mean +/- 2 SD speeds, for a 0.812 m leg [read, Table 4]. I derived the rest from those
two numbers with the paper's own definitions [inferred]:

| Speed (m/s) | Step freq (Hz) | Swing/support | Stance share | Stride (s) | Support (s) | Flight per step (s) | Step length (m) |
|---|---|---|---|---|---|---|---|
| 8.99 | 4.39 [read, T4] | 3.05 [read, T4] | 24.7 % [inferred] | 0.456 [inferred] | 0.112 [inferred] | 0.115 [inferred] | 2.05 [inferred] |
| 9.90 | 4.60 [read, T4] | 3.16 [read, T4] | 24.0 % [inferred] | 0.435 [inferred] | 0.105 [inferred] | 0.113 [inferred] | 2.15 [inferred] |
| 10.82 | 4.82 [read, T4] | 3.28 [read, T4] | 23.4 % [inferred] | 0.415 [inferred] | 0.097 [inferred] | 0.111 [inferred] | 2.24 [inferred] |

Working: stance share = 1 / (1 + ratio); stride = 2 / step frequency; support = stride / (1 + ratio);
flight = 1 / step frequency - support; step length = speed / step frequency. These are regression predictions
across 79 different men, not one runner speeding up.

## 6. Converting to the studio's convention

Studio: hip flexion, knee flexion and ankle dorsiflexion positive; zero at anatomical standing; cycle from right
foot strike; Cardan, distal relative to proximal (Fukuchi et al. 2017).

- **Cycle.** The paper's stride starts at LEFT foot strike. Subtract 49.4 % of the stride (the mean) to start at
  right foot strike [inferred]. Section 4 is already shifted. Event times vary by runner; only means are given.
- **Knee.** Studio knee flexion = 180 - knee angle [inferred]. Mean values: 27.7 at foot strike, about 41.3 at the
  most-flexed point in stance, 24.6 at toe-off, 148.4 at the most-flexed point in swing (180 - 31.6). A straight
  leg (180) should sit near anatomical standing, but the paper recorded no standing trial, so this is unchecked.
- **Hip.** 180 - hip angle gives flexion positive [inferred]: 48.1 at foot strike, -16.4 (extension) at toe-off.
  But this is the thigh against a TRUNK LINE (greater trochanter to suprasternal notch), not against the pelvis.
  Fukuchi's hip is the thigh relative to the pelvis. The pelvis was not tracked, so the offset (pelvic tilt plus
  the lumbar curve) cannot be removed from this source. The thigh-to-vertical angle is a separate, cleaner
  number: 33.0 at foot strike, -28.7 at toe-off, 70.3 at its highest, 4.1 at left foot strike.
- **Ankle.** Flip the sign: studio dorsiflexion = (standing ankle angle) - (ankle angle) [inferred]. The standing
  ankle angle for this foot line (ankle to 5th metatarsal head) is not given. So ABSOLUTE ankle dorsiflexion
  cannot be converted. The CHANGES convert directly: from foot strike, dorsiflexion rises by 19.1 deg to its peak,
  then the ankle plantarflexes 43.2 deg to toe-off. Net, the ankle is 24.1 deg more plantarflexed at toe-off than
  at foot strike.
- **Cannot convert at all:**
  - 2D projection against 3D Cardan. Out-of-plane motion is folded into the sagittal angle; the authors say
    coronal and transverse motion is unknown (p.9).
  - No curves between events, and no timing for the knee and ankle extremes or the highest thigh.
  - No arms and no pelvis.
  - Individual data are not published; they are available "after explicit and justified request" (p.9).

## 7. What changes with speed in this source

Faster runners (same leg length) have a higher thigh at the opposite foot strike (-2.8 to 10.9 deg across
8.99 to 10.82 m/s) and swing the leg back faster (-416 to -516 deg/s in swing) [read, Table 4, Condition A].
In stance they flex the knee less after foot strike (-15.0 to -12.2 deg) and extend it less before toe-off
(19.2 to 14.6 deg), while the hip extends further (194.4 to 198.4 deg at toe-off) [read, Table 4].
(second reader: the authors put hip angle at toe-off among the variables whose change with speed is under 2 % and
"negligible" (p.6; Table 4 column (c)-(a) = 2.0 %). The numbers above are right; the authors do not read it as a
speed effect.)
Hip, knee and thigh angles AT foot strike barely change with speed, under 2 % (hip 132.1 to 131.7, knee 152.1 to
152.4, thigh 33.3 to 32.7) [read, Table 4; "negligible" is the authors' word, p.6].
Leg length changed the kinematics as much as or more than speed did, for 11 of 21 variables [read, p.7].
The minimum knee angle in swing had no significant regression at all [read, p.4].

The paper left some equations out of Table 4 because their adjusted R2 was under 0.13 [read, Table 3].
(second reader: the selection rule, "adjusted R2 > 0.13 were selected", is stated in the Methods, p.3; Table 3 holds
the R2 values it is applied to. Foot angle at toe-off, adjusted R2 0.129, is also left out of Table 4.) I evaluated
them at the Condition A inputs (8.99 / 9.90 / 10.82 m/s) [inferred; weak fits]: ankle at foot strike 123.1 / 123.2 /
123.3 (R2 0.107); ankle at toe-off 147.2 / 147.3 / 147.3 (R2 0.074); knee at toe-off 156.1 / 155.4 / 154.6
(R2 0.080); maximal thigh lift 67.7 / 70.3 / 72.9 (R2 0.122). As a check, I evaluated three equations that ARE in
Table 4 (hip at FS, knee at FS, hip at TO) the same way; they reproduce its values to 0.1 deg.

## 8. Could not obtain / not stated

- Continuous joint-angle curves over the stride: not in the paper (events only).
- Supplementary Table 1 (simple regressions, Table_1.docx): the guessed download URL returned 404. Not obtained.
- Raw data: only "after explicit and justified request" [read, p.9]. Not obtained.
- Not stated: track surface; filter order; any standing or neutral trial; the end points of the foot and leg lines
  (drawn only); how the trunk segment was defined beyond the digitised suprasternal point; the differentiation
  method; the timing of the knee and ankle extremes and of maximal thigh lift.
- Not measured: arms (shoulder, elbow), pelvis, left-leg angles, any 3D or out-of-plane motion, women.
- Speeds above 10.97 m/s: none in this sample.

## Second reader

Adversarial second read, 2026-11-13. Publisher PDF and full-text HTML downloaded again into
`C:/Users/zackn/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/sprint/check/miyashiro/dl1/` (PDF 506,368 B, 10 pages); Figure 1 downloaded and viewed (`C:/Users/zackn/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/sprint/check/miyashiro/fig/g1.jpg`).
Tables taken from the HTML with my own script (`C:/Users/zackn/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/sprint/check/_scripts/tbl.js`).

Checked and found right:
- Table 1, every value the file uses: participants (age, stature, mass, PB and range), speed 9.90 +/- 0.46
  (8.83-10.97), step length, step frequency, stride time, the four support and flight times, swing time, both ratios,
  all 12 joint and segment angles at events, the 6 angular displacements, the 8 angular velocities [read].
- Table 4, Condition A columns (a)-(c) for step frequency, swing/support, thigh at contralateral FS, leg backward
  swing velocity, knee flexion and extension displacement, hip at FS and TO, knee at FS, thigh at FS; the -0.3 / 0.2 /
  -1.8 % changes [read].
- Table 3 equations re-evaluated for maximal thigh lift (67.7 / 70.3), ankle at FS (123.1), ankle at TO (147.2), knee
  at TO (156.1 / 154.6): all match the file.
- Methods: 79 men, 300 Hz, 512 x 384 px, 1 m high, 45 m from the lane, about 4 m field, markers every metre,
  150 Hz digitising, Frame-DIAS, 4.5-10.5 Hz, <9 mm, seven points, four segments, "positive convention" (p.3),
  left-FS-to-left-FS stride, step-length and step-frequency definitions [read].
- Page places: "negligible" p.6, "11 out of 21" p.7, no significant regression for minimum knee angle p.4, data
  "after explicit and justified request" p.9, coronal and transverse unknown p.9 [read].
- Event-position arithmetic (49.4 %, 24.1 %, 50.6 %, 74.3 %), the knee and hip conversions, the trunk-lean arithmetic.
- Definitions: every line of section 3 against the text and Figure 1B (hip angle shaded on the front, knee on the
  back, ankle on the front of the ankle; thigh, shank and foot against a vertical with + forward; leg line from the
  hip through the foot). All right.

Struck: nothing. Two notes added in place: the R2 > 0.13 rule is in the Methods (p.3), and the authors call the
hip-at-toe-off change with speed negligible.
Could not check: Supplementary Table 1 (no link to the file in the HTML, only an anchor); the timing of the knee and
ankle extremes (not in the source, as the file says).

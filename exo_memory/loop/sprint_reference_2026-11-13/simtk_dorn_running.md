# SimTK "Muscle function of overground running across a range of speeds" (Dorn, Schache, Pandy 2012): one runner, 3.5 to 9.5 m/s

Reader: one research pane, 2026-11-13. Research only. The paper's full text could not be obtained (section 8), so this
file reads the DATA PACKAGE in full and computes the joint angles from its raw markers. Almost every angle below is
therefore [inferred]: my own computation from the source's recorded markers, not a curve the source printed. The method is
given in section 3 so anyone can re-run it. Scripts: the scratch folder named at the end.

## 1. The source

- Paper: Dorn TW, Schache AG, Pandy MG (2012). Muscular strategy shift in human running: dependence of running speed on
  hip and ankle muscle performance. J Exp Biol 215(11):1944-1956. DOI 10.1242/jeb.064527. PMID 22573774.
  Erratum: J Exp Biol 2012;215(13):2347 (PubMed record, CommentsCorrections, ErratumIn) [read]. Erratum content not seen.
- Data: SimTK project "runningspeeds", package "Running Data and Models: RunningDataModels.zip", last updated
  May 14, 2012 (project page) [read]. Licence: MIT ("Copyright (c) 2012, Stanford University ... Permission is hereby
  granted, free of charge ...", the package's use-agreement popover on the project page) [read].
- Where I got the text: the zip and the project page were already downloaded by the finder pane (scratch
  `sprint/find/simtk/d.zip`, `page.html`, unpacked at `sprint/find/simtk/x/`). I read `readme.txt`, the five C3D files'
  parameter sections and data, `loadLabels.m`, the `Extract_*.m` scripts and the joint/coordinate blocks of
  `JA1_SCALED.osim`. The abstract was read from the PubMed XML record (curl, eutils) and matches the project page.
- The readme asks users to cite two papers: the JEB 2012 paper above (listed there with an older title, "Mechanical switch
  for human running", "In press") and Dorn, Lin, Pandy (2011/2012), Comput Methods Biomech Biomed Engin, on foot-ground
  contact modelling (readme section 4) [read].

## 2. Who and how

- Paper: "Experimental gait data from nine subjects" (abstract) [abstract]. Sex: PubMed indexes the paper with both
  MeSH terms "Male" and "Female" [abstract] (indexer metadata, not the authors' words). Level of the runners: not seen.
- The package holds ONE of them, subject "JA1" (readme section 1; c3d SUBJECTS.NAMES) [read]. Sex, age, height, level of
  JA1: not stated in the package. Body mass about 75.9 kg [inferred] (mean summed vertical force of the 8 plates over the
  static trial, 744.8 N, divided by 9.81). C7 marker 1570 mm above the lab origin when standing [inferred, static frame 100].
- Overground, not treadmill: "overground running trials for a single subject (JA1)" (readme section 1) [read]. The runway
  carries 8 force plates of 600 x 900 mm laid end to end along the lab Y axis, about 8.1 m in total
  (c3d FORCE_PLATFORM.CORNERS) [read]. Running direction is +Y, vertical is +Z [inferred, from the sacral marker path].
- Speeds, as the source labels them: 3.56, 5.20, 7.00 and 9.49 m/s (readme section 1) [read]; the project page says
  "3.5m/s 5.2m/s, 7.0m/s and 9.0m/s" [read]. NOTE the readme names the fastest trial "JA1Gait25.c3d", but the package
  holds `Run9ms/JA1Gait35.c3d`, and its extract script says "Running 9 m/s" [read]. Measured from the sacral marker over
  whole trials: 3.52, 5.19, 6.98, 9.48 m/s [inferred]; per right stride: 3.58/3.53, 5.22/5.24, 7.05, 9.53/9.57 m/s
  [inferred]. So the fastest trial is about 9.5 m/s, and the readme's 9.49 is the right figure.
- Whether the trials are steady-speed (constant-speed phase) or an acceleration phase: not stated. The per-stride speeds
  above differ by at most 0.05 m/s, so these strides are close to steady [inferred].
- Capture: Vicon ("Vicon Workstation 4.6 build 142", c3d MANUFACTURER) [read]; markers at 250 Hz (POINT.RATE) [read];
  forces and EMG at 1500 Hz (ANALOG.RATE), 6 analog samples per frame [read]; 12 EMG channels, right leg (TA, VMO, VL, RF,
  AddMagnus, GMED, GMAX, MHAMS, LHAMS, MGAST, LGAST, MSOLEUS; ANALOG.LABELS) [read]; marker set "AIS-MUProject"
  (SUBJECTS.MARKER_SETS) [read]; 25 mm markers (SEG.MARKER_DIAMETER) [read]. Running trials carry 51 to 53 markers;
  the static trial adds medial epicondyle and medial malleolus markers (RMEPI, RMMAL, LMEPI, LMMAL) [read].
- The package has NO joint-angle files. It has raw C3D (markers, forces, EMG, labelled events), a scaled OpenSim model and
  no setup files: "No setup files are included in this package" (readme section 3) [read].
- Events in each C3D (EVENT.TIMES, "Foot Strike"/"Foot Off", Left/Right) [read]. I checked them against the force plates:
  each of the 18 plate contacts begins 0.7 to 4.0 ms after its labelled strike and ends 0 to 5.3 ms before its labelled
  toe-off [inferred; 15 N threshold, the toolbox's own cutoff `glab.vertForceCutoff = 15` in loadLabels.m; time of frame k
  taken as (k-1)/250 s]. So the labelled events agree with the plates to about one 4 ms frame. Strikes outside the
  plates are labelled too (method not stated).

## 3. Angle definitions

Two sets exist and they must not be mixed: what the SOURCE's model defines (A), and what I computed here (B).

A. The source's OpenSim model, `JA1_SCALED.osim` (credits: Delp 1990 lower limb, Anderson and Pandy back; "3D, 23 DOF gait
   model", header lines 5-6) [read]. The paper's own joint angles would come from inverse kinematics on this kind of model;
   the paper's IK settings and plotted angles were not seen.
- Hip (`hip_r`, lines 519-630): femur relative to pelvis; three rotations in order flexion about Z, adduction about X,
  rotation about Y (body-fixed, Z-X-Y Cardan); hip_flexion_r range -40 to +100 deg (-0.698 to 1.745 rad) [read].
  Flexion positive [inferred from the range]. Zero: femur aligned with the model pelvis frame, not the subject's
  standing pose [inferred: no offset in the joint block].
- Knee (`knee_r`, lines 666-755): tibia relative to femur, ONE degree of freedom about Z with coupled translations
  (Yamaguchi and Zajac planar knee, header) [read]. knee_angle_r range -160 to +10 deg (-2.79 to 0.175 rad) [read]:
  FLEXION IS NEGATIVE in this model [inferred from the range; the file does not name the sign].
- Ankle (`ankle_r`, lines 791-876): talus relative to tibia, one degree of freedom; ankle_angle_r range -60 to +40 deg
  [read]. Dorsiflexion positive, as in the Delp model [inferred; the file does not name the sign]. Whether its axis is
  the oblique Delp axis or purely sagittal: not checked. second reader: checked. rotation1 of `ankle_r` turns about
  (-0.10501, -0.17402, 0.97913), the oblique Delp axis, not a pure sagittal axis [read, JA1_SCALED.osim lines 791-870].
- Arms (lines 2016-2423): arm_flex_r (-90 to +90 deg), arm_add_r, arm_rot_r, elbow_flex_r (-10 to +150 deg),
  pro_sup_r, wrist_flex_r, wrist_dev_r [read]. Sign of arm_flex: not stated in the file.
- Cycle start for the paper's curves: not seen.

B. What I computed for the tables in section 4 [inferred, all]. Right side only, from the source's markers:
- Filtering: markers gap-filled linearly (at most 1 frame missing on any marker used), then a 4th-order zero-lag
  Butterworth low-pass at 15 Hz. 10 Hz and 25 Hz were also run (error budget below).
- Calibration: static trial `JA1Static05.c3d`, all 647 frames averaged. Landmarks stored in rigid 3-marker technical
  frames: thigh RTHLP-RTHAP-RTHLD; shank RTIAP-RTIAD-RTILAT; foot RHEEL-RP1MT-RP5MT.
- Joint centres: hip by the Harrington et al. 2007 regression from the pelvis markers (pelvis width 217 mm, depth 191 mm;
  centre at 55.8 mm posterior, 76.0 mm inferior, 78.9 mm lateral of the mid-ASIS point); knee = midpoint of the lateral
  and medial epicondyle markers; ankle = midpoint of the lateral and medial malleolus markers.
- Segment frames (ISB-style: X anterior, Y up the long axis, Z to the right): pelvis from RASI, LASI, SACR; femur Y from
  knee centre to hip centre, Z along medial-to-lateral epicondyle; shank Y from ankle centre to knee centre (epicondyles
  carried by the shank cluster), Z along medial-to-lateral malleolus; foot X from heel marker to the midpoint of the 1st
  and 5th metatarsal markers, Z from 1st toward 5th metatarsal.
- One line per angle:
  - Hip flexion: femur relative to pelvis; 3D Cardan Z-X-Y (flexion first), distal relative to proximal; positive =
    flexion; zero = femur frame aligned with pelvis frame. Standing value +5.9 deg.
  - Knee flexion: shank relative to femur; same Cardan sequence; sign flipped so flexion is positive; zero = frames
    aligned. Standing value -5.7 deg (about 6 deg past straight in these frames; the 2D included angle at standing is
    6.8 deg with no sign).
  - Ankle dorsiflexion: foot relative to shank; same Cardan sequence; positive = dorsiflexion; ZERO = STANDING: the
    standing value (-1.6 deg) is subtracted, because a marker foot axis has no anatomical zero of its own.
  - Shoulder flexion: 2D, sagittal plane (lab Y-Z): angle of the upper arm (acromion marker RSH to lateral elbow marker
    RELB) from straight down, minus the forward lean of the trunk line (SACR to C7); positive = elbow in front of the
    trunk line. Standing value -14.2 deg.
  - Elbow flexion: 3D, 180 deg minus the included angle at RELB between RSH and the wrist marker RWR; positive =
    flexion. Standing value 20.5 deg (marker placement, not a bent elbow).
- Cycle: right foot strike to the next right foot strike, from the source's labelled events; 101 points by linear
  interpolation in time.
- Error budget for my numbers: filter cutoff 10 vs 25 Hz moved table values by at most 1.4 deg (hip), 3.0 deg (knee),
  3.4 deg (ankle), 2.4 deg (arm), largest at 9.5 m/s. A different choice of 3 cluster markers per segment moved hip by
  up to 3.9 deg and knee by up to 5.7 deg (ankle up to 1.0 deg). Events are good to about one 4 ms frame, 0.9 % of the
  stride at 9.5 m/s. Soft-tissue artefact beyond this is not measured. Overall: about +-4 deg hip, +-6 deg knee,
  +-4 deg ankle, +-3 deg shoulder and elbow.
  second reader: this budget covers filter and cluster choice only, not the landmark and projection method. A 2D
  sagittal re-computation from the same markers (Bell hip centre, lateral epicondyle and malleolus, foot heel to mid
  metatarsal, static trial = 0 for the ankle) gave the same hip range to within 1 deg and knee within about 5 deg, but
  an ankle up to 10 deg less dorsiflexed in early stance (9.5 m/s at 10 %: 11.2 against 21.2 here). Read the ankle
  at 10-20 % of the stride as method-dependent by up to about 10 deg [inferred, second reader's run].
- A 2D cross-check of the knee (included angle hip centre - knee centre - ankle centre) agrees with the Cardan knee
  within 2 deg through most of the stride (9.5 m/s stride 1 peak: 148.2 deg 2D vs 146.7 deg Cardan); near full extension
  they can differ by up to 9 deg (5.2 m/s stride 2 at 90 %: 2.7 Cardan vs 11.6 2D), because the 2D value has no sign.

## 4. The curves

All values are [inferred]: computed by me from the source's markers (section 3B), error about +-4 deg hip, +-6 deg knee,
+-4 deg ankle, +-3 deg shoulder and elbow. The source prints no curve I could read, so no column is [read] or [figure].
Right side; 0 % = right foot strike. Hip and knee are anatomical-frame angles (standing hip +5.9, knee -5.7); the ankle
column is already standing = 0; shoulder standing -14.2, elbow standing 20.5. Right toe-off falls at about 33 %, 29 %,
27 % and 27 % of the stride at the four speeds (section 5).


#### 3.56 m/s nominal (measured 3.53-3.58 m/s), two right strides

Value = mean of the two strides; ± = half the difference between them.

| % stride | hip flex (deg) | knee flex (deg) | ankle DF, standing = 0 (deg) | shoulder flex, 2D (deg) | elbow flex (deg) |
|---:|---:|---:|---:|---:|---:|
| 0 | 31.8 ± 0.5 | 11.7 ± 0.2 | -13.1 ± 0.4 | -58.9 ± 0.9 | 72.6 ± 0.2 |
| 10 | 26.7 ± 0.6 | 41.2 ± 1.2 | 17.8 ± 0.7 | -42.3 ± 0.9 | 72.9 ± 1.6 |
| 20 | 10.9 ± 0.3 | 36.8 ± 2.1 | 21.9 ± 2.3 | -23.9 ± 1.0 | 86.8 ± 0.3 |
| 30 | -2.0 ± 1.2 | 20.1 ± 0.1 | -15.0 ± 1.3 | -11.5 ± 0.3 | 109.9 ± 3.0 |
| 40 | -5.3 ± 0.5 | 29.3 ± 1.6 | -25.0 ± 1.5 | -8.2 ± 0.4 | 119.1 ± 3.7 |
| 50 | 2.3 ± 0.7 | 68.1 ± 3.4 | -14.1 ± 1.5 | -19.1 ± 0.4 | 106.4 ± 1.5 |
| 60 | 17.4 ± 2.6 | 101.3 ± 3.5 | -8.0 ± 1.3 | -35.4 ± 1.3 | 80.3 ± 1.2 |
| 70 | 41.2 ± 2.4 | 101.5 ± 0.8 | -3.6 ± 1.3 | -51.6 ± 2.5 | 68.4 ± 1.3 |
| 80 | 47.7 ± 0.7 | 62.6 ± 1.3 | -6.0 ± 0.8 | -62.0 ± 1.8 | 70.6 ± 1.8 |
| 90 | 35.2 ± 0.1 | 11.3 ± 0.9 | -9.4 ± 0.8 | -63.4 ± 0.3 | 70.2 ± 2.4 |
| 100 | 31.3 ± 0.0 | 13.3 ± 1.8 | -9.2 ± 3.5 | -56.5 ± 1.6 | 71.3 ± 1.6 |

Peaks of the mean curve, 1 % resolution, deg [inferred]:
  hip max 47.8 at 79%, min -5.4 at 39%;
  knee max 107.5 at 65%, min 3.0 at 94%;
  ankle max 24.2 at 17%, min -30.5 at 36%;
  shoulder max -7.4 at 37%, min -64.3 at 86%;
  elbow max 119.2 at 39%, min 68.4 at 71%.

#### 5.20 m/s nominal (measured 5.22-5.24 m/s), two right strides

Value = mean of the two strides; ± = half the difference between them.

| % stride | hip flex (deg) | knee flex (deg) | ankle DF, standing = 0 (deg) | shoulder flex, 2D (deg) | elbow flex (deg) |
|---:|---:|---:|---:|---:|---:|
| 0 | 37.3 ± 0.1 | 19.2 ± 0.7 | -7.6 ± 0.0 | -58.9 ± 1.4 | 71.7 ± 1.2 |
| 10 | 27.6 ± 0.1 | 45.7 ± 0.5 | 21.1 ± 0.1 | -38.1 ± 0.9 | 73.5 ± 2.4 |
| 20 | 4.8 ± 1.0 | 34.2 ± 2.0 | 17.2 ± 1.8 | -14.4 ± 0.2 | 96.2 ± 4.4 |
| 30 | -9.6 ± 0.9 | 16.1 ± 0.3 | -34.5 ± 0.4 | 4.3 ± 0.4 | 125.9 ± 2.1 |
| 40 | -8.8 ± 0.1 | 50.8 ± 2.8 | -22.9 ± 1.9 | 1.3 ± 0.9 | 132.6 ± 0.5 |
| 50 | 3.1 ± 0.5 | 96.3 ± 2.5 | -12.1 ± 0.9 | -16.5 ± 0.9 | 108.9 ± 1.8 |
| 60 | 30.6 ± 1.9 | 126.5 ± 0.4 | -6.0 ± 0.0 | -37.7 ± 1.2 | 77.0 ± 2.3 |
| 70 | 59.2 ± 0.6 | 110.3 ± 4.6 | -1.9 ± 0.5 | -54.8 ± 2.3 | 65.5 ± 0.3 |
| 80 | 62.9 ± 1.5 | 63.8 ± 7.4 | -4.8 ± 0.2 | -67.2 ± 2.5 | 68.4 ± 0.9 |
| 90 | 43.0 ± 2.8 | 8.3 ± 5.6 | -10.2 ± 2.1 | -68.3 ± 0.0 | 69.2 ± 0.7 |
| 100 | 37.1 ± 0.0 | 17.4 ± 1.0 | -8.7 ± 1.1 | -58.3 ± 2.0 | 70.9 ± 0.4 |

Peaks of the mean curve, 1 % resolution, deg [inferred]:
  hip max 64.7 at 77%, min -10.1 at 33%;
  knee max 127.8 at 62%, min 2.6 at 94%;
  ankle max 26.4 at 15%, min -35.5 at 31%;
  shoulder max 6.1 at 34%, min -69.6 at 86%;
  elbow max 134.7 at 37%, min 65.5 at 70%.

#### 7.00 m/s nominal (measured 7.05 m/s), one right stride

One stride only; no spread.

| % stride | hip flex (deg) | knee flex (deg) | ankle DF, standing = 0 (deg) | shoulder flex, 2D (deg) | elbow flex (deg) |
|---:|---:|---:|---:|---:|---:|
| 0 | 42.1 | 21.7 | -9.2 | -52.1 | 60.4 |
| 10 | 27.3 | 44.6 | 20.9 | -25.7 | 66.1 |
| 20 | -0.8 | 28.5 | 5.0 | 4.3 | 92.5 |
| 30 | -12.6 | 20.8 | -33.4 | 24.1 | 123.1 |
| 40 | -10.6 | 69.0 | -22.7 | 9.7 | 129.0 |
| 50 | 5.0 | 122.3 | -13.2 | -15.4 | 97.6 |
| 60 | 40.0 | 147.5 | -10.0 | -39.6 | 67.1 |
| 70 | 70.4 | 120.5 | -3.2 | -56.4 | 61.4 |
| 80 | 76.6 | 70.3 | -5.6 | -68.8 | 64.4 |
| 90 | 52.9 | 11.9 | -10.6 | -66.3 | 61.3 |
| 100 | 43.5 | 22.1 | -10.6 | -53.1 | 63.2 |

Peaks of the mean curve, 1 % resolution, deg [inferred]:
  hip max 78.1 at 77%, min -12.6 at 30%;
  knee max 147.5 at 60%, min 6.8 at 94%;
  ankle max 24.0 at 13%, min -34.6 at 28%;
  shoulder max 24.1 at 30%, min -69.4 at 82%;
  elbow max 132.4 at 36%, min 60.4 at 0%.

#### 9.49 m/s in the readme, 9.0 on the page (measured 9.53-9.57 m/s), two right strides

Value = mean of the two strides; ± = half the difference between them.

| % stride | hip flex (deg) | knee flex (deg) | ankle DF, standing = 0 (deg) | shoulder flex, 2D (deg) | elbow flex (deg) |
|---:|---:|---:|---:|---:|---:|
| 0 | 46.1 ± 0.4 | 25.8 ± 2.8 | -8.2 ± 2.1 | -64.3 ± 2.9 | 64.1 ± 0.3 |
| 10 | 32.5 ± 2.3 | 42.6 ± 0.7 | 21.2 ± 1.6 | -24.5 ± 2.8 | 71.0 ± 1.1 |
| 20 | 0.3 ± 2.1 | 26.9 ± 1.4 | 2.3 ± 1.2 | 9.6 ± 1.6 | 90.3 ± 2.1 |
| 30 | -18.2 ± 0.2 | 16.2 ± 2.1 | -38.2 ± 0.4 | 30.0 ± 0.5 | 114.1 ± 2.2 |
| 40 | -14.2 ± 1.0 | 70.4 ± 2.0 | -35.6 ± 0.4 | 3.9 ± 2.0 | 121.2 ± 2.2 |
| 50 | 1.1 ± 1.5 | 123.0 ± 0.5 | -26.4 ± 0.7 | -28.0 ± 3.1 | 81.9 ± 2.6 |
| 60 | 33.6 ± 1.8 | 147.5 ± 0.8 | -18.7 ± 2.3 | -46.3 ± 2.3 | 38.2 ± 1.9 |
| 70 | 68.0 ± 1.5 | 129.7 ± 0.6 | -9.9 ± 1.4 | -70.0 ± 1.9 | 38.8 ± 1.4 |
| 80 | 85.9 ± 1.9 | 91.0 ± 0.3 | -2.7 ± 0.8 | -89.0 ± 1.6 | 45.1 ± 0.4 |
| 90 | 65.7 ± 0.2 | 33.0 ± 0.2 | -7.4 ± 0.7 | -87.0 ± 1.1 | 50.7 ± 1.1 |
| 100 | 45.7 ± 0.7 | 23.1 ± 0.1 | -8.2 ± 2.0 | -67.2 ± 0.0 | 63.2 ± 0.6 |

Peaks of the mean curve, 1 % resolution, deg [inferred]:
  hip max 85.9 at 80%, min -18.4 at 31%;
  knee max 147.5 at 60%, min 9.3 at 26%;
  ankle max 23.3 at 13%, min -38.8 at 29%;
  shoulder max 30.1 at 29%, min -90.3 at 83%;
  elbow max 123.6 at 37%, min 34.4 at 64%.

## 5. Events and timing by speed

Event times are [read] from each C3D's EVENT.TIMES. Everything in the table is arithmetic on those times or on the
markers, so it is marked [inferred]. "Flight 1" = right toe-off to left strike; "flight 2" = left toe-off to right
strike. Step length = forward distance between the heel markers at successive strikes. Stride length = forward travel
of the right heel marker from one right strike to the next. Step rate = 2 / stride time. Values for stride 1 / stride 2.

| nominal speed (m/s) | measured (m/s) | stride time (s) | right stance (s) | stance share | flight 1; flight 2 (s) | step R-L; L-R (m) | stride (m) | step rate (/s) |
|---|---|---|---|---|---|---|---|---|
| 3.56 | 3.58 / 3.53 | 0.752 / 0.768 | 0.244 / 0.256 | 32.4 / 33.3 % | 0.128 / 0.120; 0.132 / 0.144 | 1.33 / 1.33; 1.37 / 1.35 | 2.69 / 2.68 | 2.66 / 2.60 |
| 5.20 | 5.22 / 5.24 | 0.680 / 0.692 | 0.200 / 0.200 | 29.4 / 28.9 % | 0.136 / 0.136; 0.144 / 0.164 | 1.77 / 1.76; 1.79 / 1.87 | 3.56 / 3.63 | 2.94 / 2.89 |
| 7.00 | 7.05 | 0.588 | 0.156 | 26.5 % | 0.128; 0.144 | 2.04; 2.13 | 4.17 | 3.40 |
| 9.49 (page: 9.0) | 9.53 / 9.57 | 0.460 / 0.460 | 0.124 / 0.124 | 27.0 / 27.0 % | 0.104 / 0.100; 0.108 / 0.112 | 2.18 / 2.15; 2.24 / 2.22 | 4.42 / 4.37 | 4.35 / 4.35 |

All [inferred]. Cross-checks:
- Contact time on the force plates (15 N threshold), every plate contact in the trial, both feet: 0.239-0.252 s,
  0.189-0.197 s, 0.149-0.155 s and 0.117-0.121 s at the four speeds [inferred].
- Peak vertical plate force: 1972-2067 N, 2124-2295 N, 2227-2298 N, 2162-2446 N [inferred]; with 75.9 kg that is about
  2.8, 3.1, 3.1 and 3.3 times body weight at the highest contact of each trial [inferred].
- Foot at strike: the heel-to-metatarsal line is within 3 deg of its standing pitch at every right strike at every speed
  (-3.0 to +1.6 deg), so the right foot lands nearly flat at all four speeds [inferred]. Strike type is not stated in the
  package.
- The 7.00 m/s trial holds only one complete right stride; its two left strides last 0.580 and 0.612 s [inferred].
- Note the 7.00 and 9.5 m/s stance shares (26.5 % and 27.0 %) are not in speed order; with one stride at 7.00 m/s and a
  4 ms frame (0.7-0.9 % of the stride) that difference is inside the event resolution [inferred].

## 6. Converting to the studio's convention

Studio: hip flexion, knee flexion, ankle dorsiflexion positive; zero at anatomical standing; cycle from right foot strike.

- Cycle: no shift. My tables already start at right foot strike, from the source's own labelled events, which agree with
  the plates to about one frame (section 2).
- Signs: no flip needed for my tables (all three are flexion / dorsiflexion positive).
- Zero: the ankle column is already standing = 0. For hip and knee, subtract the standing values to get standing = 0:
  hip minus 5.9 deg, knee plus 5.7 deg (both [inferred], one static trial). Whether to do this depends on how the
  reference set (Fukuchi 2017) defines zero: if its hip and knee are anatomical-frame Cardan angles NOT referenced to a
  standing trial, compare my hip and knee columns as printed and only shift the ankle; this file cannot settle which.
- Frames: mine and the reference set are both Cardan, distal relative to proximal, flexion first, so the sequence matches;
  the marker sets and joint-centre methods differ, which is a few degrees of offset that no sign change fixes.
- If someone later runs the source's OpenSim model instead: knee_angle_r must be NEGATED (flexion negative there,
  section 3A); hip_flexion_r and ankle_angle_r keep their sign; the model's zero is its own segment alignment, so a
  standing offset must be measured from the static trial run through the same model.
- Shoulder and elbow: mine are a 2D sagittal shoulder (relative to the SACR-C7 trunk line) and a marker included-angle
  elbow. They cannot be converted to a 3D shoulder Cardan angle; they serve only as a sagittal arm-swing reference.
- Cannot be converted: the fact that this is one runner (no between-runner spread exists); the left leg (not computed);
  hip adduction and rotation (computed but not reported here, sign convention not checked).

## 7. What changes with speed in this source

From 3.5 to 9.5 m/s this runner nearly doubles peak hip flexion in late swing (about 48 to 86 deg) and extends the hip
further before toe-off (about -5 to -18 deg), while swing-knee flexion rises from about 108 to 148 deg and is already
at its 148 deg ceiling by 7 m/s. Step rate grows steadily (2.6 to 4.4 steps/s), but stride length grows mostly below
7 m/s (2.7 to 4.2 m) and only a little above it (to 4.4 m), which matches the abstract's claim that above 7 m/s speed is
gained by stride frequency [abstract]. Ground contact shrinks from 0.25 to 0.12 s and from 33 % to 27 % of the stride,
the foot lands nearly flat at every speed, and the knee is no longer near straight at the end of swing at 9.5 m/s
(33 deg at 90 % against 8 to 12 deg at the slower speeds). The arms swing much wider at 9.5 m/s (shoulder about +30 to
-90 deg, elbow opening to about 34 deg) than at 3.5 m/s (about -7 to -64 deg). All of this is [inferred], one runner.

## 8. Could not obtain / not stated

- The paper's full text (journal page and publisher PDF return Cloudflare 403 or a maintenance page; the Internet
  Archive returned 429 for its 2022 and 2024 snapshots). So NOT SEEN: the nine runners' level, sex split, age, height,
  mass; the exact speeds per runner; the paper's marker protocol, filter, IK settings, joint-angle figures, cycle event,
  and any tables. The erratum (215:2347) was not seen either.
- No joint angles are in the package; every angle here is my computation (section 3B).
- Not stated in the package: JA1's sex, age, height, training level; whether trials are steady-speed or accelerating;
  how strikes off the force plates were labelled.
- Readme vs package mismatch: the readme lists "JA1Gait25.c3d: Running at 9.49 m/s"; the package holds
  `Run9ms/JA1Gait35.c3d` and no Gait25. The measured speed (9.48-9.57 m/s) fits 9.49.
- Not computed: left leg, pelvis tilt, trunk angles as a reported column, hip adduction/rotation, a run through the
  source's own OpenSim model (OpenSim is not installed here and the task forbids installs).
- Only one stride at 7.00 m/s and two at the other speeds: the "+-" in section 4 is a two-stride half-range, not an SD.

Scripts and outputs (re-runnable):
C:/Users/zackn/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/sprint/read_simtk_dorn_running/scripts/
(c3d.js reader, angles.js, run.js, fp.js, footpitch.js); curves at 10/15/25 Hz in .../out/fc10.json, fc15.json, fc25.json.

## Second reader

Adversarial second read, 2026-11-13. Source downloaded again into `C:/Users/zackn/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/sprint/check/simtk/`: the project page (dl2/p.html) and
the zip through the MIT use-agreement form (dl3/d.zip, sha256 380ac4b6..., the same bytes as the first reader's copy).
I parsed the C3D files with my own reader (`C:/Users/zackn/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/sprint/check/_scripts/c3dchk.js`, simchk.js, simrun.js, simstat.js, simfp.js,
simang.js), not the first reader's scripts. Policy: a value the file marks [inferred] is not "in the source", so I
re-derived it where I could and did not strike it for being absent.

Checked and found right:
- readme: four speeds 3.56 / 5.20 / 7.00 / 9.49 m/s, the Gait25 name, "No setup files", the two citations [read].
- Project page: "3.5m/s 5.2m/s, 7.0m/s and 9.0m/s", last updated May 14, 2012, MIT text [read].
- C3D parameters: POINT.RATE 250, ANALOG.RATE 1500 (6 per frame), 12 EMG labels, 8 plates of 600 x 900 mm over
  8.1 m along Y, Vicon Workstation 4.6 build 142, marker set AIS-MUProject, SEG.MARKER_DIAMETER 25,
  POINT.USED 51 to 53, static 57 markers with RMEPI/RMMAL/LMEPI/LMMAL [read]. vertForceCutoff = 15 in loadLabels.m.
- Static trial: 647 frames, summed Fz 744.8 N, 75.9 kg, C7 at 1569.8 mm in frame 100, pelvis width 217.1 mm and
  depth 191.4 mm, so the Harrington offsets 55.7 / 76.0 / 78.9 mm follow.
- Section 5, every cell of the timing table at all four speeds (stride, stance, share, both flights, both steps,
  stride length, step rate, per-stride sacral speed) re-derived from EVENT.TIMES and the markers: all match to the
  printed digit, except the 3.56 m/s L-R steps (mine 1.36 / 1.36 against 1.37 / 1.35, within 0.01 m).
- Whole-trial sacral speeds: mine 3.53 / 5.19 / 6.97 / 9.47 against 3.52 / 5.19 / 6.98 / 9.48 (first-to-last
  frame against the reader's method; within 0.01 m/s).
- Plate contact times and peaks at 3.56 and 9.5 m/s: 0.239-0.252 s and 1972-2067 N; 0.118-0.122 s and 2162-2446 N
  (mine shows 0.122 s once against the file's 0.121; one analog sample).
- Model: coordinate ranges of hip_flexion_r, knee_angle_r, ankle_angle_r, arm_flex_r, elbow_flex_r; the hip's Z-X-Y
  transform axes; the knee's single rotation with coupled translations; header credits and "3D, 23 DOF" [read].
- PubMed 22573774: title, 215(11):1944-56, DOI, "nine subjects", erratum 215(13):2347, MeSH Male and Female [read].
- Section 4, elbow column: my own run of the same definition matches all 44 cells within 0.6 deg; standing 20.5.
- Section 4, hip, knee, ankle: checked with a varied method (2D sagittal, Bell hip centre, lateral markers). Hip
  range per stride agrees within 1 deg at 3.56 and 9.49 m/s; level offset about 3 deg. Knee within about 5 deg
  (swing peak 142.4 against 147.5 at 9.5 m/s). Ankle differs by up to 10 deg at 10 % of the stride (note added in 3B).

Struck: nothing. Added: the ankle axis (3A) and an ankle method note (3B).
Could not check: the first reader's 3D Cardan values as such (I did not rebuild the cluster frames); the
plate-versus-event lags (0.7-4.0 ms, 0-5.3 ms); the foot pitch at strike (-3.0 to +1.6 deg); the standing values of
hip +5.9, knee -5.7, ankle -1.6, shoulder -14.2; the paper itself (not obtained by either reader).

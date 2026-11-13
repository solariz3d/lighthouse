# Nagahara et al. 2014: kinematics of the whole sprint acceleration (read in full)

Reader's verdict up front: this source has NO full-stride joint-angle curves. It gives one stance-only knee curve
(Fig. 6, six steps around step 4, about 5.5 to 8.5 m/s), step-by-step spatiotemporal data from 4 to 10 m/s (Fig. 4),
and step-by-step trunk, hip-range and velocity summaries (Fig. 5). No ankle angle, no hip-angle time series, no arms.
Its value to the studio is timing (stance time, step length, step rate) right up to 10 m/s, plus the knee in stance.

## 1. The source

- Nagahara R, Matsubayashi T, Matsuo A, Zushi K (2014). Kinematics of transition during human accelerated sprinting.
  Biology Open 3(8):689-699. doi 10.1242/bio.20148284. PMC4133722. PMID 24996923.
- Licence: CC BY 3.0, stated in the article ("Open Access article distributed under the terms of the Creative Commons
  Attribution License") [read, XML front matter].
- Text: the PMC JATS XML (full.xml, already on disk in the team's find folder), read via its tag-stripped copy full.txt,
  start to end. Tables 1 and 2 and Figs 2, 4, 5, 6 are images in the XML; I downloaded the original JPEGs from the PMC
  CDN (cdn.ncbi.nlm.nih.gov/pmc/blobs/11f4/4133722/...) and read them directly. The PDF could not be downloaded
  (bot check on both PMC and Europe PMC); nothing in the PDF is missing from XML plus images.

## 2. Who and how

- Runners: 12 male Japanese sprinters, 100 m and 200 m specialists [read, Methods "Participants"].
  Age 21.6 (SD 2.6) years, height 1.74 (0.04) m, mass 68.1 (4.2) kg, 100 m personal best 10.71 (0.33) s,
  range 10.36 to 11.29 s [read, Table 1].
- Task: two maximal 60 m sprints from starting blocks, own crouch start, own spiked shoes, at least 15 min rest
  [read, Methods "Experiments"]. Overground, on a track. Best-trial 60 m time 7.24 (0.16) s [read, Table 2].
- Speeds: continuous acceleration from the first step after the blocks (about 4 m/s, [figure] Fig. 4A, +/- 0.3 m/s)
  to the 50 m mark. Peak running speed 10.04 +/- 0.29 m/s at step 23 [read, Results]. 25 steps analysed per runner
  (the fewest steps any runner took to 50 m) [read, Methods "Statistical analysis"]. Speed is not held at any value:
  every step is faster than the last until about step 23. Running speed = CG horizontal velocity [read, Methods].
- Capture: 60 infrared cameras (18 MX-T10, 30 MX-T20, 12 MX-T40, Vicon), 250 Hz, 47 reflective markers,
  volume about 50 m x 1.5 m x 2 m [read, Methods]. 15-segment body model. Hip joint centre from the Japan Clinical
  Gait Analysis Forum rule (18 % of inter-trochanter distance medially from a point one third of the way from
  greater trochanter to ASIS) [read]. Butterworth filter, cut-off 17.5 to 22.5 Hz by residual analysis [read].
- Events: foot strike = peak vertical acceleration of the toe marker; toe-off = the frame after the toe marker's
  lowest vertical position; error +/- 1 frame (4 ms), up to 8 ms on a duration [read, Methods].
- Averaging: means over the 12 best trials at each step number; breakpoint analyses align each runner to their own
  breakpoint step [read]. Left and right steps are not separated anywhere [not stated; steps alternate legs].

## 3. Angle definitions

- Segment angles (head, upper trunk, lower trunk, and the segments generally): angle from the horizontal forward line
  to the segment vector from proximal end to distal end, counter-clockwise positive seen from the runner's right side
  [read, Methods "Kinematics of segments and joints"]. 2D sagittal: the paper says data were "reconstructed to two
  dimensions in the sagittal plane" in the CG section [read]; that segment and joint angles use the same 2D data is
  [inferred] from the horizontal-line definition. Reported values near 90 deg for an upright head and trunk mean the
  trunk vectors effectively point upward; the paper's "proximal to distal" for the lower trunk (whose distal end is
  the hip midpoint) would point down, so the exact vector for the trunk segments is ambiguous [inferred].
- Hip joint angle: the relative angle between lower trunk and thigh, measured on the ANTERIOR side; opening =
  extension [read]. Zero: not stated (an included angle, so roughly 180 deg when trunk and thigh are in line)
  [inferred]. Only its range in swing and its mean angular velocity in support are reported; no hip-angle curve.
- Knee joint angle: relative angle between thigh and shank on the POSTERIOR side; opening = extension [read].
  Included angle: 180 deg = straight leg, smaller = more flexed [inferred from values of 167 to 171 deg at toe-off,
  Fig. 6]. 2D sagittal [inferred, as above]. Thigh = hip joint centre to knee centre (femoral condyle midpoint);
  shank = knee centre to ankle centre (malleolus midpoint) [read, segment end points].
- Ankle: no ankle joint angle is defined or reported [not stated]. The foot segment exists (heel and toe markers),
  but only its contribution to CG velocity is given.
- Shoulder, elbow: not reported (arm markers were placed; no arm angles given) [not stated].
- Cycle start: no stride cycle is used. Fig. 6 normalises the SUPPORT PHASE only, foot strike = 0 %, just before
  toe-off = 100 % [read, Fig. 6 legend and Methods ST definition]. Fig. 2 stick figures are at foot strike and just
  before toe-off of steps 1 to 25 [read, Fig. 2 legend].

## 4. The curves

Only one joint curve exists: Fig. 6, knee angle in support, mean of all 12 runners, at the two steps before, the step
of, and the three steps after each runner's FIRST breakpoint (mean breakpoint step 4.4 +/- 0.9, range 3 to 6
[read, Table 2]). No SD is drawn. Rows are % of SUPPORT, not % of stride. Hip, ankle, shoulder, elbow: not given.

Approximate running speed of each curve, read from the Fig. 4A inset (speed around the first breakpoint):
step -2 about 5.7, step -1 about 6.3, step 0 about 6.9, +1 about 7.4, +2 about 7.8, +3 about 8.2 m/s
[figure, +/- 0.5 m/s; aligned per runner, so each curve mixes real step numbers].

Knee INCLUDED angle (paper's convention, 180 = straight), deg, Fig. 6. [figure]: rows at 0/20/40/60/80/100 %
+/- 1.5 deg (plotted markers); rows at 10/30/50/70/90 % read between markers, +/- 2.5 deg.

| % support | step -2 | step -1 | step 0 | step +1 | step +2 | step +3 |
|---|---|---|---|---|---|---|
| 0   | 124.5 | 132.5 | 137.5 | 141.5 | 143.0 | 148.5 |
| 10  | 128   | 135   | 139   | 142   | 142.5 | 147   |
| 20  | 131   | 137   | 140.5 | 142   | 142   | 145.5 |
| 30  | 134   | 139   | 142   | 141.5 | 141.5 | 144   |
| 40  | 137   | 141.5 | 143.5 | 141.5 | 141   | 142.5 |
| 50  | 141   | 144   | 146.5 | 143   | 142   | 143   |
| 60  | 145   | 147   | 150   | 145.5 | 144   | 145   |
| 70  | 152   | 153.5 | 155.5 | 150.5 | 148.5 | 149   |
| 80  | 160   | 161   | 162   | 156.5 | 154.5 | 155   |
| 90  | 166   | 166.5 | 168   | 163   | 161.5 | 161.5 |
| 100 | 170   | 170   | 171   | 168.5 | 167   | 167.5 |

The same data as KNEE FLEXION (180 minus included; 0 = straight; flexion positive), every 20 %
[inferred conversion of the figure values; same +/- 1.5 deg plus the zero offset in Section 6]:

| % support | step -2 | step -1 | step 0 | step +1 | step +2 | step +3 |
|---|---|---|---|---|---|---|
| 0   | 55.5 | 47.5 | 42.5 | 38.5 | 37.0 | 31.5 |
| 20  | 49   | 43   | 39.5 | 38   | 38   | 34.5 |
| 40  | 43   | 38.5 | 36.5 | 38.5 | 39   | 37.5 |
| 60  | 35   | 33   | 30   | 34.5 | 36   | 35   |
| 80  | 20   | 19   | 18   | 23.5 | 25.5 | 25   |
| 100 | 10   | 10   | 9    | 11.5 | 13   | 12.5 |

Shape: before the breakpoint the knee only extends through stance (no stance flexion). From +1 on, the knee flexes a
few degrees in early stance (minimum near 30-40 % of support, about 141-142 deg included) and then extends
[figure; the paper says this in words, Discussion "first transition"]. Toe-off knee about 167-171 deg in all six.

Step-by-step summary angles (Fig. 5), means of 12; numbers given in the Results text are [read], others [figure]:
- Hip angular displacement, max to min in swing (Fig. 5M): about 89 deg at step 1 [figure, +/- 3 deg], peak
  98.1 +/- 5.9 deg at step 16 [read], about 95 deg at step 24 [figure, +/- 3 deg].
- Mean hip angular velocity in support (Fig. 5N): about 400 deg/s at step 1 [figure, +/- 25 deg/s], peak
  668 +/- 31 deg/s at step 14 [read], about 630 deg/s at step 24 [figure, +/- 25 deg/s].
- Peak knee extension velocity in support (Fig. 5O): about 570 deg/s at step 1 [figure, +/- 30 deg/s], peak
  730 +/- 73 deg/s at step 12 [read], about 650-700 deg/s at step 24 [figure, +/- 40 deg/s].
- Mean head angle in support (Fig. 5D): about 20 deg at step 1 [figure, +/- 5 deg], 91.2 +/- 7.3 deg at step 24
  [read]. Mean upper-trunk angle (Fig. 5E): about 20 deg at step 1 [figure, +/- 5 deg], 75.7 +/- 5.6 deg at step 25
  [read]. Mean lower-trunk angle (Fig. 5F): about 45 deg at step 1 [figure, +/- 5 deg], 84.7 +/- 7.4 deg at step 24
  [read]. (90 deg = vertical, smaller = leaning forward; paper's segment convention, Section 3.)

## 5. Events and timing by speed

Fig. 4, means of 12 best trials. Step positions, from the box printed inside Fig. 4 [read]: step 2 at 2.2 m, 4 at
4.7 m, 6 at 7.7 m, 8 at 11.0 m, 10 at 14.6 m, 12 at 18.3 m, 16 at 26.2 m, 20 at 34.3 m, 24 at 42.7 m (mid-step,
from the start line). Table entries are [figure] with the error in the column header unless marked [read].

| step | speed m/s (+/-0.3) | stance time s (+/-0.005) | step length m (+/-0.08) | step rate Hz (+/-0.08) |
|---|---|---|---|---|
| 1     | 4.0  | 0.17  | 0.95 | 4.5  |
| 2     | 5.3  | 0.155 | 1.15 | 4.4  |
| 4     | 6.9  | 0.125 | 1.40 | 4.75 |
| 6     | 7.8  | 0.115 | 1.60 | 4.8  |
| 8     | 8.5  | 0.110 | 1.72 | 4.87 [read] |
| 10    | 9.0  | 0.102 | 1.82 | 4.8  |
| 12    | 9.3  | 0.100 | 1.90 | 4.85 |
| 16    | 9.7  | 0.095 | 2.00 | 4.85 |
| 20    | 9.95 | 0.090 [read] | 2.07 | 4.85 |
| 23-24 | 10.04 [read, step 23] | 0.092 | 2.14 [read, step 24] | 4.75 |

Read values from the Results text: peak speed 10.04 +/- 0.29 m/s (step 23); peak step length 2.14 +/- 0.16 m
(step 24); peak step rate 4.87 +/- 0.16 Hz (step 8); minimum stance time 0.090 +/- 0.006 s (step 20); support
distance (CG travel in stance) max 0.89 +/- 0.06 m (step 24); anterior support time max 0.026 +/- 0.004 s and
anterior support distance (CG behind the MP joint at foot strike) 0.26 +/- 0.04 m, both at step 24 [read, Results].
Step length is CG to CG between consecutive foot strikes; step rate = 1 / step time [read, Methods].
Up to step 4 the foot lands BEHIND the CG (ASD below zero); from step 5 it lands in front [read, Results].
Self-check of the figure reading: speed should be about step length x step rate; step 4 gives 6.65 against 6.9,
step 10 gives 8.7 against 9.0, step 23 gives 10.2 against 10.04, so the table is good to about 0.3 m/s [inferred].

Flight time and stance share are NOT reported; derived here [inferred, from the figure values above]:
- Flight time = 1 / step rate - stance time. Step 4: 0.211 - 0.125 = about 0.085 s. Step 10: 0.208 - 0.102 = about
  0.106 s. Step 23: 0.211 - 0.092 = about 0.12 s. Error about +/- 0.01 s.
- Stance share of the stride (one foot's stance / two step times): step 4 about 30 %; step 10 about 25 %;
  step 23 (10 m/s) about 22 %. Error about +/- 2 points.

## 6. Converting to the studio's convention

Studio: hip flexion, knee flexion, ankle dorsiflexion positive; zero at anatomical standing; cycle from right foot
strike; 101 points.
- Knee: flexion = 180 - included angle (done above) [inferred]. This assumes the straight-leg reading is 180 deg; a
  standing-pose offset is not reported, so the zero carries an unknown offset of a few degrees. The paper's angle is
  a 2D sagittal projection; the studio's is Cardan flexion; small differences are expected for the knee and cannot
  be sized from this paper.
- Cycle: Fig. 6 covers stance only, foot strike to just before toe-off. To place it in a stride from foot strike,
  map support 0-100 % onto stride 0 to about 30 % (steps near step 4) [inferred from Section 5]. Swing (about 70 % of
  the stride) has no data. Right versus left is not separated, so "right foot strike" cannot be honoured; the curves
  are presumably pooled over both legs [not stated].
- Hip: no curve to convert. The paper's hip angle is an included trunk-thigh angle on the anterior side (larger =
  more extended); studio flexion would be about 180 minus that angle, but the reference segment is the lower trunk,
  not a pelvis, and the zero is not stated. Only the swing range (89 to 98 deg) is usable, and a range survives any
  offset or sign change.
- Ankle: cannot be converted; not reported.
- Segment (trunk, head) angles: from horizontal forward, 90 = vertical; forward lean = 90 minus the angle [inferred].
- Speed: none of these are steady-speed strides. Every step is accelerating, and the paper itself says the motion at
  a given speed differs between acceleration and deceleration (Discussion, last section). Treat these as acceleration
  references, not as constant-speed running at 5 to 10 m/s.

## 7. What changes with speed in this source

From 4 to about 7 m/s (steps 1 to 4) step rate rises and stance time falls fast, the foot lands behind the body, and
the knee only extends in stance. Around step 4 to 5 (about 7 m/s) the foot starts landing in front of the CG, the
knee begins to flex a little in early stance, and step rate stops rising (about 4.8 to 4.9 Hz from then on). From
there to 10 m/s speed comes almost entirely from longer steps (1.4 to 2.14 m), while stance time drifts from 0.125 to
0.09 s and the trunk rises from a strong forward lean to near upright by about step 14 to 16. After that, posture
stops changing, and hip range and hip speed in stance fall slightly while running speed still rises.

## 8. Could not obtain / not stated

- Could not obtain: the PDF (bot check on PMC and Europe PMC). Not needed: XML plus the original figure and table
  images cover the article. No supplementary data or numerical tables of the curves exist (XML: has-supplement no).
- Not stated / not reported: any full-stride joint curve; hip angle over time; any ankle angle; shoulder and elbow
  angles; SD on Fig. 6; flight time; a left/right split; the standing-pose zero of any joint; whether joint angles
  are 2D (inferred from the segment-angle definition); the exact vector direction for the trunk segment angles; the
  real step numbers behind each Fig. 6 curve (aligned per runner to the breakpoint; the legend says they differ).
- Figure readings: Figs 4 to 6 are JPEGs about 750 px wide; every number marked [figure] carries the error beside it.

## Second reader

Adversarial second read, 2026-11-13. PMC JATS XML downloaded again via eutils into
`C:/Users/zackn/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/sprint/check/nagahara/dl1/full.xml`;
the PMC article page into `.../check/nagahara/dl2/` for the image links; Tables 1-2 and Figures 4, 5, 6 from the PMC
CDN into `.../check/nagahara/img/` and viewed.

Checked and found right:
- Table 1: 21.6 (2.6) yr, 1.74 (0.04) m, 68.1 (4.2) kg, PB 10.71 (0.33) s, range 10.36-11.29 s. Table 2: best 60 m
  7.24 (0.16) s; first breakpoint 4.4 (0.9), valid range 3-6 [read].
- Methods: 12 men, 60 cameras (18 / 30 / 12), 250 Hz, 47 markers, about 50 x 1.5 x 2 m, 15 segments, the hip-centre
  rule (18 %, one third), 17.5-22.5 Hz, toe-marker event rules, +/-1 frame and 8 ms on durations, 2D sagittal
  reconstruction, 25 steps, segment and joint angle definitions, CC BY 3.0, has-supplement "no" [read].
- Results text: 10.04 at step 23, 2.14 at 24, 4.87 at 8, 0.090 at 20, 0.89 at 24, 0.026 and 0.26 at 24, ASD below
  zero to step 4, 98.1 at 16, 668 at 14, 730 at 12, 91.2 at 24, 75.7 at 25, 84.7 at 24 [read].
- Figure 6: all 66 knee cells read against the figure; every one within the stated error. No SD drawn [read].
- Figure 4 table cells and the step-position box (9 positions); Figure 5 eye reads (hip range ~89 and ~95, hip
  velocity ~400 and ~630, knee velocity ~570, head and upper trunk ~20, lower trunk ~45 at step 1).
- Flight and stance-share arithmetic; the knee flexion conversion.
- Definitions: every line of section 3 against the Methods text and the Fig 6 legend. All right.

Struck: nothing.
Could not check closely: the Fig 4A inset speeds per curve (too small to read better than +/-0.5 m/s, as the file
says); the PDF (not needed).

# Sprint reference: von Lieres und Wilkau, Irwin, Bezodis NE, Simpson, Bezodis IN (2018/2020), read in full

Reader: one research pane, 2026-11-13. Read-only. Every number has one mark:
[read] = seen in the source's own text or table; [figure] = read off a plotted curve by eye, error given;
[abstract] = abstract only; [inferred] = my own inference.

Headline for the studio: **this source has no joint-angle curves over the stride.** It reports sagittal SEGMENT
angles (trunk, thigh, shank, CM) at two instants only, touchdown (TD) and toe-off (TO), step by step over the first
25 steps of a 50 m sprint, at step speeds of about 4 to 10.7 m/s. Hip and knee at TD and TO can be inferred from it.
The ankle cannot. Nothing between the events is reported.

## 1. The source

- Full citation (Crossref): von Lieres und Wilkau HC, Irwin G, Bezodis NE, Simpson S, Bezodis IN. Phase analysis in
  maximal sprinting: an investigation of step-to-step technical changes between the initial acceleration, transition
  and maximal velocity phases. Sports Biomechanics 2020; 19(2): 141-156. Online 2018-07-04, print issue 2020-03-03.
  [read: Crossref metadata JSON for the DOI]
- **The brief's citation is off.** It names "Bezodis NE (2019)". The Cronfa cover page reads "Bezodis, N." because
  Cronfa lists only the Swansea author. The manuscript's own title page lists five authors; N.E. Bezodis is third.
  The first author is H.C. von Lieres und Wilkau (Cardiff Metropolitan). The year is 2018 online / 2020 in print,
  not 2019. [read: PDF p.1 cover and p.2 title page; Crossref]
- DOI: 10.1080/14763141.2018.1473479 [read]
- Licence: no open licence stated. Cronfa repository terms: copies may be used "for personal research or study,
  educational or non-commercial purposes only"; copyright stays with the author. Crossref carries no licence field.
  [read: PDF p.1; Crossref]
- Text used: the Cronfa accepted manuscript (author version, 33 pages, 876,320 bytes) already on disk at
  C:/Users/zackn/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/sprint/find/bezodis2019/a.pdf
  Read via its text dump (a.txt), and by rendering pages 29-33 (tables, figures) and extracting the embedded figure
  images at native resolution (Figure 4 is 1943 x 1037 px). The record page
  https://cronfa.swan.ac.uk/Record/cronfa39890 was downloaded with curl to check year and pages ("Published: 2018",
  "Pages: 1 - 16", i.e. the online-first record).
- This is the accepted manuscript, not the typeset version. Places below are PDF pages and manuscript line
  numbers ("l.").

## 2. Who and how

- Runners: 5 national-level sprinters, 3 male, 2 female. [read: l.99; Table 1 p.29]
  Ages 19-27 y; stature 1.71-1.89 m; mass 63.3-89.1 kg; 100 m PB 10.64-10.87 s (men), 11.90-12.34 s (women).
  [read: Table 1 p.29]
- Task: maximal 50 m sprints from starting blocks, overground, Mondo track, spikes. Up to 5 trials per day, two days
  eight weeks apart (March and May). One runner did 3 trials on day 2. [read: l.100-114]
  The kinematics (research question 2) use each runner's best trial per day: 10 trials. [read: l.251-253]
- Steps analysed: 1 to 25 of every trial. [read: l.216-217]
- Speeds: a continuum, step by step, grouped into three phases by breakpoints in touchdown CM height:
  - Initial acceleration phase (IAP): steps 1-3. [read: l.292-293]
  - Transition phase (TP): steps 6-13. [read: l.292-293]
  - Maximal velocity phase (MVP): steps 17-25. [read: l.292-293]
  - Steps 4-5 and 14-16 belong to no phase (the breakpoint ranges). [inferred from l.289-293]
  - Start of transition at 6.06-7.83 m/s step velocity (65-77 % of Vmax). [read: l.294]
  - Start of max velocity at 8.19-10.07 m/s (92-98 % of Vmax). [read: l.295-296]
  - Vmax of the best trials 8.86-10.73 m/s. [read: l.295]
    Table 2 (all trials) gives maximum step velocity ranges 8.56-10.76 m/s. [read: Table 2 p.29]
    The two differ because the text uses best trials and the table all trials. [inferred]
  - Step velocity at step 1 about 3.7-4.3 m/s. [figure: Fig 2a p.30, error +/-0.2 m/s]
  - So steps 1-2 lie near the studio's 4.5 m/s ceiling; everything from about step 3 on is above it. [inferred]
  - Nothing reaches 11-13 m/s. The fastest runner peaks at 10.76 m/s. [read: Table 2]
- Capture: 2D video. Five static HD cameras (1440 x 1080) at **50 Hz**, shutter 1/600 s, 19 m from the lane,
  1.80 m high, together covering 50 m. A sixth, panning camera at **200 Hz** gave touchdown and toe-off timing.
  [read: l.117-127]
- Digitising: manual, DLTdv5 in Matlab. 16 landmarks: vertex, C7, both hips, shoulders, elbows, wrists, knees,
  ankles, MTP joints; plus the toe of the contact foot. **Only two frames around each TD and each TO were digitised**;
  positions at the 200 Hz event times came from linear interpolation between those two 50 Hz frames.
  [read: l.157-171]
- Calibration: 2D-DLT over a 10.00 m x 2.17 m plane per camera, plus one lens-distortion term. Reconstruction RMSD
  0.002-0.005 m. [read: l.144-150]
- Re-digitising reliability: angles 1-2 deg RMSD (0.8-3.9 % relative); step velocity 0.03 m/s; step frequency
  0.02 Hz. [read: l.178-181]
- Event definitions: TD = first frame the foot is visibly on the ground; TO = first frame the foot is visibly off.
  Picked three times, at least five days apart; an event seen on two occasions was kept. [read: l.153-157]
- Step-to-step profiles were smoothed with a 3-point Hanning moving average after breakpoints were found.
  [read: l.258-259]

## 3. Angle definitions (rule 4)

The source's one definition, for every segment: "Segment angles were defined between the horizontal forward line
and the vector created from the distal to proximal segment endpoints." [read: l.212-213]

- Trunk: distal-to-proximal trunk vector. Which landmarks (hip centre, C7, vertex?) **not stated**. Zero = forward
  horizontal, not anatomical. Positive sense not stated in words; values rising to ~88-90 deg when upright imply
  counter-clockwise from forward horizontal with travel left to right (Fig 1 caption) [inferred]. 2D, sagittal plane
  of a 2D-DLT. Sampled at TD and TO of each step only.
- Thigh: knee to hip joint centre [inferred from the rule and landmarks l.160-161]. Zero = forward horizontal.
  Over 90 deg = knee ahead of hip [inferred]. 2D sagittal. TD and TO only.
- Shank: ankle to knee [inferred, same rule]. Zero = forward horizontal. Over 90 deg = knee behind ankle [inferred].
  2D sagittal. TD and TO only.
- CM angle: contact point to CM (l.69-70). Which contact point at each event (MTP at TD, mean toe at TO?) is not
  stated for the angle. Zero = forward horizontal. 2D sagittal. TD and TO only.
- Hip, knee, ankle joint angles: **not reported.**
- Foot segment: ankle and MTP were digitised; **no foot angle is reported.**
- Shoulder, elbow: landmarks digitised; **no angle reported.**
- Which leg: every value is for the stance leg of that step; the legs alternate step to step and are not labelled
  left or right. [inferred from "contact foot", l.162, and steps 1-25 analysed in sequence]

## 4. The curves

**The source gives no curves over the stride.** It has no rows at 10, 20 ... 100 %. For each step it has one value
at TD and one at TO, plotted for all 10 best trials in Figure 4 (p.33): per-trial lines, no mean, no SD.

Below are four speed snapshots read off Figure 4 panels a, c, e, g, i, k, m, o (native image). Each cell is the
centre of the bundle of 10 lines, then the bundle's span in brackets.
Error: centre values +/-3 deg; span ends +/-2 deg. [figure]

Rows 10-100 % of the stride: **not in source** for every snapshot. Only TD (0 %) and TO exist. Where TO falls in
the studio's cycle is in section 5 [inferred].

### 4a. Segment angles as published (deg from forward horizontal) [figure, +/-3 deg]

| Snapshot | Step speed (m/s) | Event | Trunk | Thigh | Shank | CM angle |
|---|---|---|---|---|---|---|
| Step 1 (IAP) | ~3.7-4.3 [figure, Fig 2a] | TD | 33 (22-48) | 122 (107-138) | 50 (42-58) | 82 (70-97) |
| | | TO | 40 (30-50) | 56 (48-64) | 34 (29-40) | 46 (43-50) |
| Step 5 (near T start) | ~6.5-7.6 [figure, Fig 2a]; 6.06-7.83 at T start [read l.294] | TD | 53 (45-66) | 122 (115-130) | 79 (75-84) | 101 (95-103) |
| | | TO | 57 (50-63) | 57 (51-61) | 38 (34-42) | 50 (47-55) |
| Step 10 (TP) | ~8.0-9.3 [figure, Fig 2a] | TD | 66 (55-72) | 121 (115-129) | 88 (84-93) | 107 (101-110) |
| | | TO | 70 (60-73) | 60 (56-67) | 39 (36-43) | 56 (53-58) |
| Steps 17-25 (MVP) | ~8.6-10.7 [figure, Fig 2a]; Vmax 8.86-10.73 [read l.295] | TD | 84 (75-89) | 120 (110-128) | 95 (88-101) | 110 (104-114) |
| | | TO | 88 (82-91) | 63 (55-72) | 42 (33-47) | 60 (54-64) |

Step-to-step change medians in the text: TD shank +9 deg/step and TD trunk +4 deg/step in IAP; TO CM angle
+2 deg/step in IAP and +1 deg/step in TP. [read: l.417, l.441-442]
MVP box plots (Fig 4 b, f, j, n): step-to-step changes in TD trunk, thigh, shank and CM angle are all within about
+/-1 deg/step, i.e. the posture is close to steady there. [figure, +/-0.3 deg/step]

### 4b. Hip and knee at TD and TO, derived [inferred from the 4a values]

Derivation (mine; the paper does not do this):
- knee flexion = thigh angle - shank angle. 0 when hip, knee, ankle centres are collinear; positive = flexed.
- hip flexion = thigh angle - trunk angle. Thigh relative to the TRUNK line, not the pelvis; 0 when collinear;
  positive = flexed.
- Bundle centres are combined, not per-trial pairs, so the error is wider: **+/-7 deg** each.

| Snapshot | Step speed (m/s) | Event | Hip flexion (trunk-referenced) | Knee flexion | Ankle |
|---|---|---|---|---|---|
| Step 1 | ~3.7-4.3 | TD (0 %) | +89 | +72 | not computable |
| | | TO | +16 | +22 | not computable |
| Step 5 | ~6.5-7.6 | TD (0 %) | +69 | +43 | not computable |
| | | TO | 0 | +19 | not computable |
| Step 10 | ~8.0-9.3 | TD (0 %) | +55 | +33 | not computable |
| | | TO | -10 | +21 | not computable |
| MVP (17-25) | ~8.6-10.7 | TD (0 %) | +36 | +25 | not computable |
| | | TO | -25 | +21 | not computable |

Shoulder and elbow: not given (landmarks digitised, no angles reported).

## 5. Events and timing by speed

All [figure] unless marked. Ranges span the 10 best-trial lines (Fig 2 p.30; Fig 3 p.32).
Errors: contact and flight time +/-0.005 s; step length +/-0.03 m; step rate +/-0.05 steps/s.

| Snapshot | Step speed (m/s) | Contact time (s) | Flight time (s) | Step length (m) | Step rate (steps/s) |
|---|---|---|---|---|---|
| Step 1 | ~3.7-4.3 | 0.15-0.24 | 0.035-0.085 | 0.90-1.20 | 3.6-4.5 |
| Step 5 | ~6.5-7.6 | 0.12-0.16 | 0.08-0.10 | 1.55-1.85 | 4.1-4.7 |
| Step 10 | ~8.0-9.3 | 0.10-0.13 | 0.10-0.115 | 1.85-2.10 | 4.2-4.75 |
| MVP (17-25) | ~8.6-10.7 | 0.09-0.12 | 0.11-0.13 | 1.95-2.40 | 4.2-4.8 |

Definitions [read: l.196-210]: a step is TD to the next contralateral TD. Step length = horizontal CM displacement
between consecutive TDs (not foot to foot). Step rate = 1 / step time from the 200 Hz TDs. Contact = TD to TO.
Flight = TO to the next TD.

Medians in the text, IAP, per step: step velocity +0.88 m/s, step rate +0.12 steps/s, contact time -0.020 s,
flight time +0.012 s. TP: step velocity +0.24 m/s per step. [read: l.377-393]

Stance share [inferred]:
- MVP: contact ~0.105 s, step time ~0.225 s (1 / ~4.45 steps/s). Contact is ~47 % of a step, so ~23 % of a stride
  for one leg. TO sits at about **23 % of the stride** from that leg's TD (+/-3 %).
- Step 10: ~0.115 / (2 x 0.22); TO at ~26 % of the stride.
- Step 1: contact ~0.19 s, step time ~0.25 s; TO at ~38 % of the stride.
- Built from bundle centres, not per trial.

Other figure-only quantities, MVP: TD distance (contact point ahead of CM) 0.28-0.41 m; TO distance (CM ahead of
the toe) 0.43-0.62 m; TD CM height 55-57 % of stature. [figure: Fig 3m, 3o, 3i; +/-0.02 m, +/-0.5 %]
Fig 3 panels h and p put "[s]" on axes that are distances in metres: a labelling slip in the manuscript.
[read: Fig 3 p.32]

## 6. Converting to the studio's convention

Studio: hip flexion, knee flexion, ankle dorsiflexion positive; zero at anatomical standing; 3D Cardan, distal
relative to proximal; cycle from right foot strike, 101 points.

- **Knee:** thigh - shank (4b) is already flexion-positive. Its zero is collinear joint centres. That is close to,
  but not the same as, a standing-calibrated Cardan zero; expect an offset of a few degrees. It is a 2D sagittal
  projection, not a Cardan angle. [inferred]
- **Hip:** thigh - trunk is flexion-positive but referenced to the TRUNK line, not the pelvis. The studio's hip is
  thigh relative to pelvis. The difference is lumbar flexion plus pelvic tilt, which this source does not measure.
  **Not exactly convertible from this source.** The trunk endpoints are also not stated. [inferred]
- **Ankle:** cannot be converted. No foot or ankle angle is reported.
- **Cycle start:** stance-leg TD = 0 %. Legs are not labelled, so "right foot strike" cannot be chosen; any TD
  stands for either foot. TO sits at the % given in section 5 [inferred]. No other point of the cycle exists, so a
  101-point curve cannot be built.
- **Events:** TD/TO are visual (first frame on / off at 200 Hz, so +/-0.005 s). The studio reference's event
  method is not checked here.
- **Overground and accelerating**, not treadmill steady state. Only the MVP block (steps 17-25, small step-to-step
  change, l.455-457) is close to steady running. Steps 1-13 are accelerating posture, not steady gait.
- **Segment angles** (trunk, thigh, shank from forward horizontal) can be used directly as global-orientation checks
  on the animated body at TD and TO, once the zero (forward horizontal) and the counter-clockwise sense are matched
  [inferred]. That is the most faithful use of this source.

## 7. What changes with speed in this source

From ~4 to ~10 m/s the trunk rises from about 33 to 84 deg at TD (88 at TO), nearly upright, and the shank at TD
goes from ~50 deg (knee far ahead of the ankle) to ~95 deg (about vertical) [figure]. The thigh at TD stays near
120 deg at every speed, so knee flexion at TD falls from ~70 to ~25 deg and trunk-referenced hip flexion at TD from
~90 to ~35 deg; at TO the hip goes from +16 (flexed) to -25 (extended) while the knee stays ~20 deg [inferred].
Contact time falls from ~0.19 to ~0.105 s, flight time rises from ~0.06 to ~0.12 s, step length grows from ~1.0 to
~2.2 m, and step rate only from ~4.0 to ~4.5 steps/s [figure]. In the transition phase the speed gain comes mainly
from step length via flight distance [read: l.401-403].

## 8. Could not obtain / not stated

- **Not in source:** joint angles of any kind; any value between TD and TO; swing phase; per-% curves; means and SDs
  of the angles (only per-trial lines, and box plots of step-to-step CHANGE); left/right labels; ankle, foot,
  shoulder, elbow angles; pelvis; out-of-plane motion; any speed above 10.76 m/s.
- **Not stated:** trunk segment endpoints; the explicit positive rotation sense of the segment angles; which point is
  the "contact point" for the CM angle at each event.
- **Not obtained:** the typeset publisher version (only the accepted manuscript was read); the per-trial numbers
  behind the figures (none in the manuscript; not searched further).
- **Brief mismatch:** the source is von Lieres und Wilkau et al. 2020 (online 2018), not Bezodis NE 2019.
- All [figure] values are eye reads of 10 overlapping grey/black line styles; trials cannot be told apart reliably,
  so bundle centres and spans are given, not runner-by-runner values.

## Second reader

Adversarial second read, 2026-11-13. Cronfa manuscript downloaded again into
`C:/Users/zackn/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/sprint/check/bezodis/dl1/a.pdf`
(876,320 B, 33 pages); Crossref JSON into `.../check/bezodis/dl_crossref/`; figure images extracted at native size
with my own script (`.../check/_scripts/ximg.py`) and viewed: Figure 2 (p.30), Figure 3 (p.32), Figure 4 (p.33).

Checked and found right:
- Crossref: five authors in order, Sports Biomechanics 19(2):141-156, online 2018-07-04, print 2020-03-03, no
  licence field. Cronfa cover "Bezodis, N.", Cronfa licence terms, record "Pages: 1 - 16" [read].
- Table 1: ages 19-27, stature 1.71-1.89 m, mass 63.3-89.1 kg, men's PB 10.64-10.87 s, women's 11.90-12.34 s.
  Table 2: maximum step velocities 8.56-10.76 m/s [read].
- Manuscript lines: l.99-114 (5 sprinters, March and May, P3 three sprints, Mondo, spikes), l.117-127 (50 Hz,
  1/600 s, 19 m, 1.80 m, 1440 x 1080; sixth camera 200 Hz), l.144-150 (10.00 x 2.17 m, ninth DLT term,
  0.002-0.005 m), l.153-171 (events, two frames, 16 landmarks plus toe, interpolation), l.178-181 (reliability),
  l.196-210 (definitions), l.212-214 (segment angle rule), l.216-217, l.258-259, l.292-296 (phases, 6.06-7.83,
  8.19-10.07, 8.86-10.73, 65-77 %, 92-98 %), medians at l.377-393, l.417, l.441-442, l.455-457 [read].
- Section 4a: all 32 cells against Figure 4 panels a, c, e, g, i, k, m, o; every centre and span I read falls within
  the stated +/-3 deg. MVP box plots within about +/-1 deg/step.
- Section 5: all 20 cells against Figures 2a, 2c, 2e, 3a, 3c, within the stated errors; TD distance 0.28-0.41 m,
  TO distance -0.42 to -0.62 m (CM ahead, by l.207-208), TD CM height 55-57 %; the "[s]" slip on Fig 3h and 3p.
- Section 4b arithmetic (16 cells) and the sign logic of thigh - shank and thigh - trunk.
- Definitions: every line of section 3; direction of travel left to right (Figure 1 caption).

Struck: nothing.
Could not check: the typeset version (not obtained by either reader); per-trial values behind the figures (none).

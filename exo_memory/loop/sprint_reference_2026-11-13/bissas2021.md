# Bissas et al. 2022 (eprint "2021"): asymmetry in sub-10 and sub-11 s sprinters, read in full

Reader: one research pane, 2026-11-13. Source read from the PDF's own text (pdftotext, layout and raw modes).
Every table value below was checked in raw reading order, and the row-to-label mapping was checked against the
paper's own men-vs-women % column. One fact first: **this source has no joint-angle curves.** It reports joint angles
at two instants only, touchdown (TD) and toe-off (TO), for one stride per athlete. Section 4 says what that allows.

## 1. The source

- **The brief's citation is wrong on four counts:** authors, journal, year and the last five names. The title page reads:
  Bissas A, Walker J, Paradisis GP, Hanley B, Tucker CB, Jongerius N, Thomas A, Merlino S, Vazel P-J, Girard O.
  "Asymmetry in sprinting: an insight into sub-10 and sub-11 s men and women sprinters."
  *Scandinavian Journal of Medicine & Science in Sports* 2022; 32(1): 69-82. [read, PDF p.1 cover sheet]
  Not J Sports Sci. Bezodis and Nagahara are not authors; Bezodis is ref 23 and Nagahara is ref 31. [read]
- DOI: 10.1111/sms.14068. [read, p.1]
- Licence: the repository cover says "All Rights Reserved". It may be used for non-commercial purposes under Wiley's terms
  for self-archived versions, and no derivative works are allowed. [read, p.1]
- Text: accepted author manuscript (post-print), University of Gloucestershire eprint 10241, from the URL in the brief.
  I downloaded it fresh with curl to `scratchpad/sprint/read_bissas2021/dl/b.pdf` (4,030,741 B). Its sha256 is
  e0a9a91b68b6bb35..., the same as the copy already in `scratchpad/sprint/find/bissas2021/b.pdf`.
  It has 27 PDF pages. The tables are on PDF pp.19-21. The figures are images on pp.22-27 with no text layer.

## 2. Who and how

- Runners: the 8 men and 8 women in the 100 m finals, 2017 IAAF World Championships, London. That makes 16 runners,
  all world class. The men ran 10.04 ± 0.12 s (9.92-10.27) and the women 10.97 ± 0.09 s (10.85-11.09).
  [read, §2.1; Table 1, PDF p.19]
- Ages: men 26.1 ± 4.8 yr, women 26.7 ± 2.0 yr. [read, §2.1]
- Setting: overground, in a real race. Wind was -0.8 m/s for the men and +0.1 m/s for the women. [read, §2.1]
- Phase: near maximum velocity, between 47.0 m and 55.5 m from the start. The capture was **two consecutive steps**, so one
  stride and one step per leg. [read, abstract and §2.2] The authors warn that some runners, men especially, may still
  have been accelerating there. [read, §4.6]
- Speeds: mean CM horizontal velocity over one step was **men 11.58 ± 0.12 m/s (11.35-11.75)** and
  **women 10.45 ± 0.13 m/s (10.21-10.61)**. [read, Table 1, p.20] Step velocity was men 11.60 ± 0.17 m/s and
  women 10.43 ± 0.25 m/s. [read, Table 1, p.19] There is **one speed per sex**, not a speed sweep.
- Capture:
  - Five Sony PXW-FS7 cameras filmed the whole body at **150 Hz** (shutter 1/1250 s, 1920×1080). [read, §2.2]
  - Four Fastec TS3 cameras filmed the lower limbs at **250 Hz** (1/1000 s, 1280×1024). [read, §2.2]
  - Temporal variables came from the 250 Hz footage. [read, §2.3]
- Processing:
  - The video was hand-digitised in SIMI Motion 9.2.2 by one operator. 17 points were digitised: head centre, then left and
    right shoulder, elbow, wrist, MCP, hip, knee, ankle and **MTP** joint centres. [read, §2.3]
  - The CM model is de Leva. 3D coordinates were rebuilt by DLT, with reconstruction error under 1% of image pixels.
    [read, §2.3]
  - Filter: zero-lag 2nd-order Butterworth, cut-off by residual analysis, mean 13.9 Hz (11.0-15.5 Hz). [read, §2.3]
- ~~No markers and no force plates were used. [read, §6]~~ second reader: §6 says only that ground reaction forces
  could not be captured in the finals [read, §6, PDF "6. Perspectives"]. No sentence says that no markers were used;
  that part is [inferred] from race conditions and hand digitising (§2.3).

## 3. Angle definitions (the Table 1 footnote, PDF p.20, [read] unless marked)

All the angles below are discrete values at TD or TO. The paper calls the analysis "three-dimensional". It does not say
whether the angles are 3D included angles or projections onto the sagittal plane. Values above 180° (the hip at TO is 196°)
need a signed planar angle, so a sagittal projection is likely. [inferred] Cardan sequence: not stated, and not used
(these are point-to-point angles).

- **Hip angle**:
  - Segments: the shoulder-hip-knee included angle, so the trunk line (shoulder to hip) against the thigh. **The pelvis is
    not modelled.**
  - Zero: **180° at anatomical standing**. Direction: higher = more extended, and above 180° = hyperextended.
- **Knee angle**:
  - Segments: thigh against lower leg (hip-knee-ankle).
  - Zero: **180° at standing**. Direction: higher = more extended.
- **Ankle angle**:
  - Segments: lower leg against foot, with the foot taken as ankle to MTP (the digitised points; that the foot segment is
    exactly ankle-MTP is [inferred]).
  - Zero: **"considered to be 90°" at standing**. Direction: higher = more extended, that is plantarflexed.
  - Not stated: whether an offset was applied to make standing read 90°. A raw ankle-MTP line would not give 90° at stance.
    [inferred]
- **Shank angle**: lower leg against the running surface, 90° when the shank is perpendicular to the ground. Which side the
  angle is measured on is not stated. From the values (TD about 99°, TO about 39°) it is likely the angle on the forward
  side. [inferred]
- **Thigh angle (TD) / "thigh vertical angle" (TO)**: the thigh of the contact leg against the vertical. Positive = in front
  of the vertical, negative = behind.
- **Thigh separation angle**: the angle between the contact thigh and the swing thigh. Negative = the swing thigh is behind
  the contact thigh, positive = in front. (The footnote says "at the point of contact"; the TO values follow the same sign
  sense.)
- **Trunk angle**: trunk against the horizontal, 90° upright. Lower values = more forward lean. The direction is [inferred]
  from "90° in the upright position".
- Shoulder and elbow angles: none reported. The arms were digitised only to build the CM.
- Cycle start: the events are TD and TO of each foot. There is no cycle normalisation and no 0-100% curve.

## 4. The curves

**None exist in this source.** There are no time series, no ensemble curves and no 101-point data. The six figures (PDF
pp.22-27) are, by their captions, **symmetry-angle (SA %) scores per athlete**: spatio-temporal (Fig 2), joint angles at TD
(Fig 3), joint angles at TO (Fig 4), CM (Fig 5) and foot velocity (Fig 6). They are not joint-angle curves. [read, figure
legends, PDF pp.17-18] I did not view the figure images (no PDF renderer on this machine). Their captions alone rule them
out as curves.

What the source does give is two points on the cycle per joint. Below, TD = 0% of that foot's stride. TO falls at about
**22%** of the stride [inferred]: contact 0.093 s ÷ (2 × step time 0.209 s) = 0.222. All values in the tables are mean ±
SD, in degrees, in the **paper's own convention** (section 3), from Table 1, PDF pp.19-20. [read]

### Men, about 11.6 m/s (n = 8; L and R legs, and the mean of both legs with its range)

| % stride (inferred) | event | hip L / R / mean (range) | knee L / R / mean (range) | ankle L / R / mean (range) |
|---|---|---|---|---|
| 0 | TD | 140.1±6.7 / 139.3±6.2 / 139.7±5.0 (129.6-145.7) | 159.6±6.3 / 153.4±7.8 / 156.5±6.1 (147.7-167.1) | 119.2±4.0 / 113.5±4.1 / 116.4±3.0 (110.0-119.3) |
| ~22 | TO | 196.9±4.1 / 195.6±4.5 / 196.3±2.9 (192.3-201.0) | 154.4±3.4 / 152.6±6.7 / 154.0±4.2 (145.7-157.8) | 141.0±6.7 / 135.4±5.2 / 138.2±3.5 (134.1-144.1) |
| 10, 20, 30 ... 100 | none | not given | not given | not given |

Other men's angles, all [read], given as mean ± SD with the range where printed:

| angle | TD | TO |
|---|---|---|
| shank | 98.7±3.5 (92.9-103.7) | 39.0±1.4 (36.1-40.5) |
| contact thigh to vertical | 27.4±4.7 (20.5-35.2) | -25.2±3.1 (-29.0 to -19.7) |
| thigh separation | -9.9±10.7 (-27.4 to -1.6) | 93.1±7.3 (81.6-104.7) |
| trunk | 75.5±3.0 (71.4-80.4) | 80.7±3.2 (75.6-84.8) |

### Women, about 10.45 m/s (n = 8)

| % stride (inferred) | event | hip L / R / mean (range) | knee L / R / mean (range) | ankle L / R / mean (range) |
|---|---|---|---|---|
| 0 | TD | 142.4±8.0 / 141.9±7.0 / 142.2±6.8 (131.0-150.0) | 159.0±5.8 / 151.0±5.3 / 155.0±4.1 (148.2-161.5) | 120.6±3.9 / 116.0±5.0 / 118.3±2.4 (113.7-120.8) |
| ~22 | TO | 200.1±7.7 / 196.5±8.3 / 198.3±7.4 (186.8-209.2) | 150.4±11.7 / 152.8±5.0 / 151.6±8.2 (142.0-163.2) | 133.8±6.0 / 128.3±7.7 / 131.0±6.0 (122.4-139.6) |
| 10, 20, 30 ... 100 | none | not given | not given | not given |

Other women's angles, all [read], given as mean ± SD:

| angle | TD | TO |
|---|---|---|
| shank | 98.1±2.4 | 39.8±2.2 |
| contact thigh to vertical | 29.7±3.6 | -22.8±6.8 |
| thigh separation | -18.0±10.3 | 87.9±7.4 |
| trunk | 79.3±4.6 | 83.1±3.3 |

The sexes differed significantly in only one joint angle: ankle at TO, men 138.2° against women 131.0°, +5.5%, P = 0.011.
[read, Table 1, p.20]

Repeatability: test-retest after 48 h, on 8 randomly chosen athletes. [read, §2.3; Table 2, PDF p.21] For the angle rows,
the extracted text shows ICC(3,1) from 0.933 to 0.999 and RMSD from 0.2° to 1.8°. The text layer splits Table 2's rows and
columns, so I cannot pair any one RMSD with a named angle. Treat 0.2-1.8° as the digitising repeatability for these angles.

## 5. Events and timing by speed (Table 1, PDF p.19, [read] unless marked)

| quantity | men, ~11.6 m/s | women, ~10.45 m/s |
|---|---|---|
| contact time, s | 0.093±0.005 (0.086-0.098) | 0.093±0.004 (0.088-0.098) |
| flight time (TO one foot to TD other), s | 0.116±0.007 (0.108-0.130) | 0.116±0.004 (0.108-0.122) |
| step time = contact + flight, s | 0.209±0.010, range printed "0.200-0.208" (sic) | 0.209±0.006 (0.200-0.218) |
| step frequency, Hz | 4.80±0.21 (4.40-5.00) | 4.80±0.13 (4.62-5.00) |
| step length (TO to TO), m | 2.42±0.14 (2.25-2.69) | 2.17±0.08 (2.07-2.30) |
| step width, m | 0.19±0.05 (0.12-0.24) | 0.14±0.06 (0.04-0.23) |
| step velocity, m/s | 11.60±0.17 | 10.43±0.25 |
| DCM TD (foot tip to CM, horizontal), m | 0.38±0.04 | 0.37±0.02 |
| DCM TO, m | 0.61±0.04 | 0.51±0.04 |
| stance share of the step [inferred] | 0.093/0.209 = 44.5% | 44.5% |
| stance share of the stride per foot [inferred] | 0.093/0.418 = 22.2% | 22.2% |
| stride time = 2 × step time [inferred] | 0.418 s | 0.418 s |
| stride length = 2 × step length [inferred] | 4.84 m | 4.34 m |
| CM height at TD / min / TO, m | 0.97 / 0.96 / 1.00 (±0.06) | 0.93 / 0.92 / 0.95 (±0.03) |

Per-leg values exist in Table 1. For example, men's step length L 2.42 / R 2.43 and step frequency L 4.84 / R 4.77. The
discussion gives the men's extremes as 2.70 m (bronze medallist) and 2.26 m (slowest). [read, §4.4] Those differ slightly
from the table's range of 2.25-2.69 m, which is probably rounding or the step-against-mean difference. [inferred]

Foot speeds:

- Foot horizontal velocity just before TD: men 3.30 ± 0.58 m/s, women 2.96 ± 0.53 m/s.
- Foot horizontal velocity at TD: men 2.36 m/s, women 2.08 m/s.
- Foot vertical velocity at TD: men -2.47 m/s, women -2.33 m/s.
- Peak vertical foot velocity in swing: men 7.49 m/s, women 6.97 m/s. [read, Table 1, p.20]

## 6. Converting to the studio's convention (hip flexion, knee flexion, ankle dorsiflexion positive; 0 at standing)

- **Knee:** flexion = 180° − knee angle. Men: TD 23.5°, TO 26.0°. Women: TD 25.0°, TO 28.4°. [inferred, arithmetic on
  [read] values] This converts cleanly. The knee is a hinge, and a 3-point angle sits close to Cardan flexion.
- **Hip:** flexion ≈ 180° − hip angle. Men: TD 40.3°, TO -16.3° (extension). Women: TD 37.8°, TO -18.3°. [inferred]
  **But this is not the same angle** as Fukuchi's hip (thigh relative to the pelvis). Here the proximal segment is the
  shoulder-to-hip trunk line, so the value carries trunk and pelvis tilt as well. The trunk was leaning 10-15° forward of
  upright (trunk angle 75-83°), and pelvic tilt is unknown. So pelvis-referenced hip flexion cannot be recovered from this
  paper. Treat the converted hip as accurate to no better than about ±10°. [inferred]
- **Ankle:** dorsiflexion = 90° − ankle angle. Men: TD -26.4° (plantarflexed), TO -48.2°. Women: TD -28.3°, TO -41.0°.
  [inferred] **Caution:** the foot segment is ankle to MTP, and the paper only says standing is "considered" 90°. If no
  offset was applied, the true standing angle on that line is larger than 90°, and the plantarflexion above is overstated
  by that offset. The offset is unknown, probably 10-20°. [inferred] Fukuchi uses a marker-based foot. Expect a systematic
  offset that cannot be removed from this paper alone.
- **Cycle start:** put this source's TD at 0% (right-foot strike). TO lands at about 22%. [inferred] The left/right columns
  allow a right-foot-only value, but n = 8 with one step per leg.
- **Cannot be converted:**
  - every point between TD and TO;
  - all of swing (about 22-100%);
  - peak hip flexion in swing;
  - peak knee flexion in swing;
  - shoulder and elbow.
  This source can only anchor two points per joint per sex. It cannot supply a curve.

## 7. What changes with speed in this source

There are only two speeds, and they belong to different sexes (men about 11.6 m/s, women about 10.45 m/s). So sex and
speed cannot be told apart in this source. The faster group was faster through **longer steps** (2.42 against 2.17 m,
+11.4%, P < 0.001) at the **same step rate** (4.80 Hz both) and the same contact time (0.093 s) and flight time (0.116 s).
[read] Joint angles at TD and TO hardly differed between the two groups. Only ankle at TO did (men 138° against women 131°,
so the men were less plantarflexed at toe-off). The men also left the ground with the CM further ahead of the toe (DCM TO
0.61 against 0.51 m). [read]

## 8. Could not obtain / not stated

- Not stated:
  - whether the angles are 3D included angles or sagittal projections;
  - any Cardan sequence;
  - whether the ankle's "90° at standing" includes an offset;
  - which side the shank angle is measured from;
  - the pelvis (not modelled).
- Not in the source: any joint-angle time series, swing-phase angles, arm angles, or more than one speed per sex.
- Could not obtain: the figure images (pp.22-27). No renderer was available (pdftoppm missing). By their captions they show
  SA scores only.
- Could not obtain: the World Athletics 2017 biomechanics reports (refs 12-13, linked in the data statement). They may hold
  more per-athlete detail. They were not opened here.
- Inconsistencies in the source:
  - The men's step-time range is printed "0.200-0.208" with a mean of 0.209.
  - §2.3 points to "Table 1" for reliability and "Table 2" for the definitions. The PDF has these the other way round.
  - Step-length extremes in §4.4 (2.70 / 2.26 m) differ slightly from the Table 1 range (2.25-2.69 m).
  - The brief's author list and journal do not match the source (see §1).

## Second reader

Adversarial second read, 2026-11-13. Eprint PDF downloaded again into
`C:/Users/zackn/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/sprint/check/bissas/dl1/b.pdf`
(4,030,741 B, 27 pages, sha256 e0a9a91b..., same bytes as the first reader's). Text by pdftotext, layout and plain.
Table 1's layout text is scrambled; I rebuilt each column in reading order (men L, men R, men mean, women L, women R,
women mean, % and P) and mapped it onto the 31 row labels.

Checked and found right:
- Cover page: the ten authors, Scand J Med Sci Sports 2022, 32(1):69-82, DOI 10.1111/sms.14068, "All Rights
  Reserved", Wiley self-archive terms [read].
- Table 1, all 12 hip, knee and ankle cells per sex (L, R, mean with range) at TD and TO; shank, thigh, separation and
  trunk at TD and TO for both sexes; contact, flight, step time (with the "0.200-0.208" misprint), step frequency,
  step length, step width, step velocity, DCM TD and TO, CM heights, CM horizontal velocity 11.58 (11.35-11.75) and
  10.45 (10.21-10.61), the four foot velocities, men's per-leg step length 2.42 / 2.43 and frequency 4.84 / 4.77,
  ankle-at-TO +5.5 % P = 0.011, step length +11.4 % P < 0.001 [read].
- Methods: ages 26.1 +/- 4.8 and 26.7 +/- 2.0, wind -0.8 and +0.1 m/s, five PXW-FS7 at 150 Hz 1/1250 s 1920x1080,
  four Fastec TS3 at 250 Hz 1/1000 s 1280x1024, 47.0-55.5 m, SIMI 9.2.2, 17 points, de Leva, DLT <1 %, second-order
  zero-lag Butterworth 13.9 Hz (11.0-15.5), 48 h retest on eight athletes [read].
- §2.3 cites "Table 1" for reliability and "Table 2" for definitions, the other way round from the PDF [read].
- §4.4 extremes 2.70 m and 2.26 m; §4.6 "still accelerating" warning; figure captions are symmetry-angle scores [read].
- Every conversion in section 6 and the 22 % toe-off arithmetic.
- Definitions: every line of section 3 against the Table 1 footnote. All right.

Struck: one mark. "No markers ... [read, §6]": §6 states only that force plates were impossible; markers are
[inferred]. No number was wrong.
Could not check: Table 2 row by row (its text layer is scrambled, as the file says); the figure images (captions
only; not needed).

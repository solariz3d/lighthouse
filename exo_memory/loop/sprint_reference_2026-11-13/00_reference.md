# Sprint reference, assembled: joint angles and timing above 4.5 m/s (2026-11-13)

Assembled from the six reader files in this folder, as corrected by the second reader (`00_check.md`; one struck
mark in `bissas2021.md`, one ankle note added in `simtk_dorn_running.md`). No new source was read for this file.
Every number below is copied from those files, with the file and its place named. Marks are the readers' marks;
where I did arithmetic on their values it is [inferred]. Nothing is averaged across angle definitions.

## 0. What the six sources are, in one line each

| key | source | runners | speeds (m/s) | what it gives | file |
|---|---|---|---|---|---|
| Dorn/SimTK | Dorn, Schache, Pandy 2012 J Exp Biol 215:1944, SimTK data package | 1 (JA1), overground, steady | 3.56, 5.20, 7.00, 9.49 | full 3D strides, angles COMPUTED by reader 1 from raw markers | simtk_dorn_running.md |
| Schache | Schache et al. 2011 MSSE 43:1260 | 8 (7 at sprint) | 3.50, 5.02, 6.97, 8.95 | no angles; toe-off % of stride | schache2011.md |
| Nagahara | Nagahara et al. 2014 Biol Open 3:689 | 12 male sprinters, accelerating | 4.0 to 10.04 | stance-only knee curve (5.7-8.2), step timing | nagahara2014.md |
| vLuW | von Lieres und Wilkau et al. 2020 Sports Biomech 19:141 (the brief's "Bezodis 2019") | 5 national, accelerating | ~3.7 to 10.76 | segment angles at TD and TO only | bezodis2019.md |
| Miyashiro | Miyashiro et al. 2019 Front Sports Act Living 1:37 | 79 trained men, one stride each | 8.83 to 10.97 (mean 9.90) | angles at events only, regressions on speed | miyashiro2019.md |
| Bissas | Bissas et al. 2022 Scand J Med Sci Sports 32:69 (the brief's "2021") | 8 men + 8 women, 2017 World final | men 11.58, women 10.45 | angles at TD and TO only | bissas2021.md |

**Only one source has full-stride joint curves above 4.5 m/s, and it is one runner whose angles a reader computed
from the raw markers (Dorn/SimTK).** Every other source gives points at events (foot strike, toe-off, a swing
extreme) or a stance-only curve. That decides the shape of the tables below.

## 1. Joint tables

### 1.0 How to read them

- Columns 0 ... 100 = % of the stride from foot strike of the measured leg (the studio's right foot strike where
  the source names the leg; Dorn/SimTK is right leg; Miyashiro right leg; vLuW, Nagahara, Bissas pool or alternate legs).
- "TO %" = where toe-off falls in that row's stride.
- "n" = number of sources behind the row. **Every row is n = 1.** No two sources share an angle definition, so no
  row pools sources. The spread between sources is shown separately, at the events where they can be lined up (1.6).
- Sign: hip flexion, knee flexion, ankle dorsiflexion positive (the studio's signs) in every row. Conversions from
  each source's own convention are the readers' (sections 6 of each file) and are [inferred].
- Blank cell = the source has nothing at that point. Nothing is interpolated between events.

The definitions, so rows are never mixed:

| code | joint definition | 2D/3D | zero | source |
|---|---|---|---|---|
| C3 | Cardan Z-X-Y, distal relative to proximal, flexion first; hip = femur vs pelvis; knee = shank vs femur | 3D | aligned anatomical frames (NOT standing: standing reads hip +5.9, knee -5.7) | Dorn/SimTK, reader 1's computation (simtk 3B) |
| C3a | ankle, same Cardan, foot (heel to mid-metatarsal) vs shank | 3D | standing = 0 (standing -1.6 subtracted) | Dorn/SimTK (simtk 3B) |
| T2 | hip = thigh vs TRUNK line (not pelvis); 180 minus included angle | 2D sagittal | trunk and thigh collinear | vLuW (trunk ends not stated), Miyashiro (trochanter to suprasternal notch) |
| S2 | hip = shoulder-hip-knee; 180 minus included angle | 2D, likely projection (Bissas 3) | 180 at standing, per the paper | Bissas |
| K2 | knee = 180 minus thigh-shank included angle (vLuW: thigh minus shank segment angle) | 2D sagittal | hip, knee, ankle centres collinear | vLuW, Miyashiro (thigh from greater trochanter), Nagahara, Bissas |
| A2? | ankle = 90 minus shank-foot (ankle to MTP) angle | 2D, likely projection | "considered 90 deg" at standing; offset not stated, probably 10-20 deg | Bissas |
| SH2 | shoulder: upper arm (acromion to lateral elbow) vs trunk line SACR-C7, sagittal | 2D | arm along trunk line (standing reads -14.2) | Dorn/SimTK |
| E3 | elbow = 180 minus included angle shoulder-elbow-wrist markers | 3D included | straight (standing reads 20.5, marker placement) | Dorn/SimTK |

Error on the Dorn/SimTK rows (simtk 3B): about +-4 deg hip, +-6 deg knee, +-4 deg ankle, +-3 deg shoulder and elbow
from filter and cluster choice. The second reader adds: the ankle at 10-20 % of the stride is method-dependent by up
to about 10 deg (9.49 m/s at 10 %: 21.2 here, 11.2 by a 2D method). Rows at 5.20 and 9.49 m/s are the mean of two
strides of one runner; 7.00 m/s is one stride. All Dorn/SimTK cells are [inferred] (simtk section 4).

### 1.1 Hip (flexion positive, deg)

| speed m/s | source, def | n | 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 | TO % |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 5.20 | Dorn/SimTK, C3 | 1 | 37.3 | 27.6 | 4.8 | -9.6 | -8.8 | 3.1 | 30.6 | 59.2 | 62.9 | 43.0 | 37.1 | ~29 |
| 7.00 | Dorn/SimTK, C3 | 1 | 42.1 | 27.3 | -0.8 | -12.6 | -10.6 | 5.0 | 40.0 | 70.4 | 76.6 | 52.9 | 43.5 | ~26.5 |
| 9.49 | Dorn/SimTK, C3 | 1 | 46.1 | 32.5 | 0.3 | -18.2 | -14.2 | 1.1 | 33.6 | 68.0 | 85.9 | 65.7 | 45.7 | ~27 |

Peaks, Dorn/SimTK, 1 % resolution [inferred, simtk section 4]: max 64.7 at 77 %, 78.1 at 77 %, 85.9 at 80 %;
min -10.1 at 33 %, -12.6 at 30 %, -18.4 at 31 % (5.20 / 7.00 / 9.49 m/s).

Event points from the other sources (hip, flexion positive, deg). All are [inferred] conversions of the marked inputs.

| speed m/s | source, def | n | at foot strike (0 %) | toe-off: % / angle | other | input mark, place |
|---|---|---|---|---|---|---|
| ~6.5-7.6 (step 5) | vLuW, T2 | 1 | +69 | ~31 / 0 | | [figure] Fig 4, +-7 combined (bezodis 4b) |
| ~8.0-9.3 (step 10) | vLuW, T2 | 1 | +55 | ~26 / -10 | | [figure] Fig 4, +-7 |
| ~8.6-10.7 (steps 17-25) | vLuW, T2 | 1 | +36 | ~23 / -25 | | [figure] Fig 4, +-7 |
| 8.99 | Miyashiro, T2 | 1 | 47.9 | 24.7 / -14.4 | | [read] Table 4 Cond A (regression prediction) |
| 9.90 | Miyashiro, T2 | 1 | 48.1 (SD 3.7) | 24.1 / -16.4 (SD 5.3) | | [read] Table 1 |
| 10.82 | Miyashiro, T2 | 1 | 48.3 | 23.4 / -18.4 | | [read] Table 4 Cond A |
| 10.45 | Bissas women, S2 | 1 | 37.8 | ~22 / -18.3 | | [read] Table 1 means |
| 11.58 | Bissas men, S2 | 1 | 40.3 | ~22 / -16.3 | | [read] Table 1 means |
| ~10 (steps 16-24) | Nagahara, hip incl. angle | 1 | | | swing range max-to-min 98.1 (SD 5.9) at step 16, ~95 at step 24 | [read] / [figure +-3] Fig 5M |

The toe-off % in these rows is [inferred] by the readers from contact and step times (bezodis 5, miyashiro 5,
bissas 4). Miyashiro also gives the thigh against the vertical, a segment angle and cleaner than T2: +33.0 at foot
strike, -28.7 at toe-off, +70.3 at its highest in swing, +4.1 at the other foot's strike, 9.90 m/s [read, Table 1].
Bissas: contact thigh to vertical, men +27.4 TD / -25.2 TO, women +29.7 / -22.8 [read, Table 1].

### 1.2 Knee (flexion positive, deg)

| speed m/s | source, def | n | 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 | TO % |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 5.20 | Dorn/SimTK, C3 | 1 | 19.2 | 45.7 | 34.2 | 16.1 | 50.8 | 96.3 | 126.5 | 110.3 | 63.8 | 8.3 | 17.4 | ~29 |
| 7.00 | Dorn/SimTK, C3 | 1 | 21.7 | 44.6 | 28.5 | 20.8 | 69.0 | 122.3 | 147.5 | 120.5 | 70.3 | 11.9 | 22.1 | ~26.5 |
| 9.49 | Dorn/SimTK, C3 | 1 | 25.8 | 42.6 | 26.9 | 16.2 | 70.4 | 123.0 | 147.5 | 129.7 | 91.0 | 33.0 | 23.1 | ~27 |

Peaks, Dorn/SimTK [inferred]: max 127.8 at 62 %, 147.5 at 60 %, 147.5 at 60 %; min 2.6 at 94 %, 6.8 at 94 %,
9.3 at 26 %. The second reader's 2D re-run: swing peak 142.4 at 9.5 m/s (against 147.5); knee within about 5 deg.

Stance-only knee during ACCELERATION, Nagahara Fig 6. Flexion = 180 minus the included angle [inferred from [figure]
+-1.5 deg, plus an unknown zero offset of a few deg]. Mean of 12 sprinters, no SD. Columns are % of SUPPORT, not of
the stride. Support ends at about 30 % of the stride at these steps [inferred, nagahara 5-6, +-3 %].

| speed m/s (+-0.5, Fig 4A inset) | source, def | n | 0 | 20 | 40 | 60 | 80 | 100 (just before TO) |
|---|---|---|---|---|---|---|---|---|
| ~5.7 | Nagahara, K2 | 1 | 55.5 | 49 | 43 | 35 | 20 | 10 |
| ~6.3 | Nagahara, K2 | 1 | 47.5 | 43 | 38.5 | 33 | 19 | 10 |
| ~6.9 | Nagahara, K2 | 1 | 42.5 | 39.5 | 36.5 | 30 | 18 | 9 |
| ~7.4 | Nagahara, K2 | 1 | 38.5 | 38 | 38.5 | 34.5 | 23.5 | 11.5 |
| ~7.8 | Nagahara, K2 | 1 | 37.0 | 38 | 39 | 36 | 25.5 | 13 |
| ~8.2 | Nagahara, K2 | 1 | 31.5 | 34.5 | 37.5 | 35 | 25 | 12.5 |

Event points (knee, flexion positive, deg). All are [inferred] conversions:

| speed m/s | source, def | n | at foot strike (0 %) | toe-off: % / angle | other | input mark, place |
|---|---|---|---|---|---|---|
| ~6.5-7.6 (step 5) | vLuW, K2 | 1 | +43 | ~31 / +19 | | [figure] Fig 4, +-7 (bezodis 4b) |
| ~8.0-9.3 (step 10) | vLuW, K2 | 1 | +33 | ~26 / +21 | | [figure], +-7 |
| ~8.6-10.7 (steps 17-25) | vLuW, K2 | 1 | +25 | ~23 / +21 | | [figure], +-7 |
| 8.99 | Miyashiro, K2 | 1 | 27.9 | 24.7 / 23.9 (weak fit, R2 0.080) | | [read] Table 4; TO from a Table 3 equation |
| 9.90 | Miyashiro, K2 | 1 | 27.7 (SD 5.6) | 24.1 / 24.6 (SD 4.8) | stance max ~41.3, swing max 148.4 (SD 5.6); times not stated | [read] Table 1 |
| 10.82 | Miyashiro, K2 | 1 | 27.6 | 23.4 / 25.4 (weak fit) | | [read] Table 4; Table 3 equation |
| 10.45 | Bissas women, K2 | 1 | 25.0 | ~22 / 28.4 | | [read] Table 1 means |
| 11.58 | Bissas men, K2 | 1 | 23.5 | ~22 / 26.0 | | [read] Table 1 means |

Miyashiro, stance knee yield with speed [read, Table 4 Cond A]: flexion after strike 15.0 -> 12.2 deg and extension
before toe-off 19.2 -> 14.6 deg, from 8.99 to 10.82 m/s.

### 1.3 Ankle (dorsiflexion positive, deg)

| speed m/s | source, def | n | 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 | TO % |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 5.20 | Dorn/SimTK, C3a | 1 | -7.6 | 21.1 | 17.2 | -34.5 | -22.9 | -12.1 | -6.0 | -1.9 | -4.8 | -10.2 | -8.7 | ~29 |
| 7.00 | Dorn/SimTK, C3a | 1 | -9.2 | 20.9 | 5.0 | -33.4 | -22.7 | -13.2 | -10.0 | -3.2 | -5.6 | -10.6 | -10.6 | ~26.5 |
| 9.49 | Dorn/SimTK, C3a | 1 | -8.2 | 21.2 | 2.3 | -38.2 | -35.6 | -26.4 | -18.7 | -9.9 | -2.7 | -7.4 | -8.2 | ~27 |

Peaks [inferred]: max 26.4 at 15 %, 24.0 at 13 %, 23.3 at 13 %; min -35.5 at 31 %, -34.6 at 28 %, -38.8 at 29 %.
The 10 and 20 % columns are method-dependent by up to about 10 deg (second reader, simtk 3B).

Event points (ankle):

| speed m/s | source, def | n | at foot strike (0 %) | toe-off: % / angle | other | input mark, place |
|---|---|---|---|---|---|---|
| 9.90 | Miyashiro, change only | 1 | 0 (reference) | 24.1 / -24.1 relative to foot strike | +19.1 DF to the stance peak, then 43.2 PF to TO | [read] Table 1 displacements |
| 10.45 | Bissas women, A2? | 1 | -28.3 | ~22 / -41.0 | | [read] Table 1; offset unknown |
| 11.58 | Bissas men, A2? | 1 | -26.4 | ~22 / -48.2 | | [read] Table 1; offset unknown |

Bissas's ankle is ankle-to-MTP with "standing considered 90 deg". If no offset was applied, its plantarflexion is
overstated by that offset, probably 10-20 deg (bissas 6, [inferred]). Miyashiro gives no absolute ankle at all.
vLuW and Nagahara give no ankle.

### 1.4 Shoulder (Dorn/SimTK only; 2D sagittal, upper arm vs trunk line; + = elbow in front of the trunk; deg)

| speed m/s | source, def | n | 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 | TO % |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 5.20 | Dorn/SimTK, SH2 | 1 | -58.9 | -38.1 | -14.4 | 4.3 | 1.3 | -16.5 | -37.7 | -54.8 | -67.2 | -68.3 | -58.3 | ~29 |
| 7.00 | Dorn/SimTK, SH2 | 1 | -52.1 | -25.7 | 4.3 | 24.1 | 9.7 | -15.4 | -39.6 | -56.4 | -68.8 | -66.3 | -53.1 | ~26.5 |
| 9.49 | Dorn/SimTK, SH2 | 1 | -64.3 | -24.5 | 9.6 | 30.0 | 3.9 | -28.0 | -46.3 | -70.0 | -89.0 | -87.0 | -67.2 | ~27 |

This is the RIGHT arm, against the right leg's cycle. Standing reads -14.2. It is not a 3D shoulder Cardan angle and
cannot be converted to one (simtk 6).

### 1.5 Elbow (Dorn/SimTK only; 180 minus the marker included angle; flexion positive; deg)

| speed m/s | source, def | n | 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 | TO % |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 5.20 | Dorn/SimTK, E3 | 1 | 71.7 | 73.5 | 96.2 | 125.9 | 132.6 | 108.9 | 77.0 | 65.5 | 68.4 | 69.2 | 70.9 | ~29 |
| 7.00 | Dorn/SimTK, E3 | 1 | 60.4 | 66.1 | 92.5 | 123.1 | 129.0 | 97.6 | 67.1 | 61.4 | 64.4 | 61.3 | 63.2 | ~26.5 |
| 9.49 | Dorn/SimTK, E3 | 1 | 64.1 | 71.0 | 90.3 | 114.1 | 121.2 | 81.9 | 38.2 | 38.8 | 45.1 | 50.7 | 63.2 | ~27 |

Standing reads 20.5 (marker placement). The second reader re-ran this definition: all 44 cells within 0.6 deg.

### 1.6 Spread between sources where events line up (a range, never an average; definitions differ per cell)

| point | ~9-10 m/s | ~10.5-11.6 m/s | range | note |
|---|---|---|---|---|
| knee at foot strike | C3 25.8 (9.49); K2 vLuW 25, Miyashiro 27.9 / 27.7 | K2 Miyashiro 27.6, Bissas 25.0 / 23.5 | 23.5 to 27.9 | C3 relative to standing would be 31.5 (+5.7) |
| knee at toe-off | C3 min 9.3 at 26 % (9.49); K2 vLuW 21, Miyashiro 23.9 / 24.6 | K2 Miyashiro 25.4, Bissas 28.4 / 26.0 | 9.3 to 28.4 | C3 is about 12-19 deg straighter than every K2 value; ~15 if standing-referenced |
| knee, swing peak | C3 147.5 (2D re-run 142.4); K2 Miyashiro 148.4 | none | 142.4 to 148.4 | agrees |
| hip at foot strike | C3 46.1 (9.49); T2 vLuW 36, Miyashiro 47.9 / 48.1 | T2 Miyashiro 48.3; S2 Bissas 37.8 / 40.3 | 36 to 48.3 | C3 is pelvis-referenced, T2 and S2 trunk-referenced |
| hip near toe-off | C3 min -18.4 at 31 %; T2 vLuW -25, Miyashiro -14.4 / -16.4 | T2 Miyashiro -18.4; S2 Bissas -18.3 / -16.3 | -14.4 to -25 | |
| ankle at foot strike | C3a -8.2 | A2? -28.3 / -26.4 | -8.2 to -28.3 | A2? offset unknown (10-20 deg); do not compare raw |
| ankle change, FS to TO | C3a -8.2 to min -38.8, about -30.6 [inferred]; Miyashiro -24.1 | A2? -12.7 (women), -21.8 (men) [inferred] | -12.7 to -30.6 | a change cancels the A2? offset |

## 2. Timing by speed

Stance share = one foot's contact time as % of its stride. Step rate in steps/s. Marks are per source file.
Steady = constant speed. ACCEL = a step inside a maximal acceleration, not steady running.

| speed m/s | source | kind | stance % stride | contact s | flight s | step length m | step rate /s | mark, place |
|---|---|---|---|---|---|---|---|---|
| 3.50 | Schache (n 8) | steady | 31.5 | | | | | [figure] Fig 1, +-0.5 % |
| 3.56 | Dorn/SimTK (1) | steady | 32.4 / 33.3 | 0.244 / 0.256 | 0.120-0.144 | 1.33-1.37 | 2.66 / 2.60 | [inferred] from C3D events |
| ~4.0 | Nagahara step 1 | ACCEL | | 0.17 | | 0.95 | 4.5 | [figure] Fig 4 |
| ~3.7-4.3 | vLuW step 1 | ACCEL | ~38 [inferred] | 0.15-0.24 | 0.035-0.085 | 0.90-1.20 | 3.6-4.5 | [figure] Figs 2-3 |
| 5.02 | Schache (n 8) | steady | 26.7 | | | | | [figure] Fig 1 |
| 5.20 | Dorn/SimTK (1) | steady | 29.4 / 28.9 | 0.200 | 0.136-0.164 | 1.76-1.87 | 2.94 / 2.89 | [inferred] |
| ~5.3 | Nagahara step 2 | ACCEL | | 0.155 | | 1.15 | 4.4 | [figure] |
| ~6.9 | Nagahara step 4 | ACCEL | ~30 [inferred] | 0.125 | ~0.085 [inferred] | 1.40 | 4.75 | [figure] |
| ~6.5-7.6 | vLuW step 5 | ACCEL | ~31 [inferred] | 0.12-0.16 | 0.08-0.10 | 1.55-1.85 | 4.1-4.7 | [figure] |
| 6.97 | Schache (n 8) | steady | 24.0 | | | | | [figure] Fig 1 |
| 7.00 | Dorn/SimTK (1 stride) | steady | 26.5 | 0.156 | 0.128 / 0.144 | 2.04 / 2.13 | 3.40 | [inferred] |
| ~7.8 | Nagahara step 6 | ACCEL | | 0.115 | | 1.60 | 4.8 | [figure] |
| ~8.5 | Nagahara step 8 | ACCEL | | 0.110 | | 1.72 | 4.87 [read] | [figure] |
| ~8.0-9.3 | vLuW step 10 | ACCEL | ~26 [inferred] | 0.10-0.13 | 0.10-0.115 | 1.85-2.10 | 4.2-4.75 | [figure] |
| 8.95 (n 7, SD 0.70) | Schache | steady | 24.8 | | | | | [figure] Fig 1 |
| 8.99 | Miyashiro (regression) | max speed | 24.7 [inferred] | 0.112 [inferred] | 0.115 [inferred] | 2.05 [inferred] | 4.39 [read] | Table 4 |
| ~9.0 | Nagahara step 10 | ACCEL | ~25 [inferred] | 0.102 | ~0.106 [inferred] | 1.82 | 4.8 | [figure] |
| 9.49 | Dorn/SimTK (1) | steady | 27.0 / 27.0 | 0.124 | 0.100-0.112 | 2.15-2.24 | 4.35 | [inferred] |
| ~9.7 | Nagahara step 16 | ACCEL | | 0.095 | | 2.00 | 4.85 | [figure] |
| 9.90 (SD 0.46) | Miyashiro (79 men) | max speed | 24.1 [inferred] | 0.105 / 0.103 [read] | 0.115 / 0.112 [read] | 2.15 [read] | 4.60 [read] | Table 1 |
| ~8.6-10.7 | vLuW steps 17-25 | near max | ~23 [inferred] | 0.09-0.12 | 0.11-0.13 | 1.95-2.40 | 4.2-4.8 | [figure] |
| ~9.95-10.04 | Nagahara steps 20-23 | near max | ~22 [inferred] | 0.090 [read] (step 20) | ~0.12 [inferred] | 2.14 [read] (step 24) | 4.75 | [figure] |
| 10.45 | Bissas women (8) | max, race | 22.2 [inferred] | 0.093 [read] | 0.116 [read] | 2.17 [read] | 4.80 [read] | Table 1 |
| 10.82 | Miyashiro (regression) | max speed | 23.4 [inferred] | 0.097 [inferred] | 0.111 [inferred] | 2.24 [inferred] | 4.82 [read] | Table 4 |
| 11.58 | Bissas men (8) | max, race | 22.2 [inferred] | 0.093 [read] | 0.116 [read] | 2.42 [read] | 4.80 [read] | Table 1 |

Step length is defined differently: CM to CM between strikes (Nagahara, vLuW), heel to heel (Dorn/SimTK, reader 1),
half a stride of left toe positions (Miyashiro), toe-off to toe-off (Bissas). Each file's section 5 has the words.

Two disagreements to keep visible:
- **Step rate at a given speed.** At about 7 m/s the one steady runner takes 3.40 steps/s (Dorn/SimTK); sprinters
  accelerating through 6.9 m/s take 4.75 (Nagahara step 4) and 4.1-4.7 (vLuW step 5). At about 9.5 m/s: 4.35
  (Dorn/SimTK) against 4.6-4.85 in the sprinter sources. In these data, steady running and a maximal sprint passing
  the same speed are different gaits. Take the numbers from one kind or the other, not a blend.
- **Stance share at 7 to 9.5 m/s.** Schache 24.0-24.8 % and Dorn/SimTK 26.5-27.0 % (both steady, from the same
  lab's data) differ by 2-3 points. Neither reverses with speed beyond the read error (schache 5; simtk 5).

## 3. The trend, from the slowest speed in these files (3.5 m/s) to the fastest (11.58 m/s)

These files start at 3.5 m/s. 2.5 to 3.5 m/s is covered only by the studio's own Fukuchi set, not by any source here.

GROWS
- Peak hip flexion in late swing: 47.8, 64.7, 78.1, 85.9 deg at 3.56, 5.20, 7.00, 9.49 m/s (Dorn/SimTK peaks,
  [inferred], one runner). Miyashiro: maximal thigh lift 67.7 -> 72.9 deg, 8.99 -> 10.82 m/s (weak fit, R2 0.122).
- Hip extension near toe-off: min -5.4, -10.1, -12.6, -18.4 deg (Dorn/SimTK). Miyashiro hip at TO 194.4 -> 198.4
  (T2, so -14.4 -> -18.4 flexion), 8.99 -> 10.82 m/s; the authors call this under 2 % and negligible (p.6).
- Knee still bent at the end of swing: the 90 % column is 11.3, 8.3, 11.9, then 33.0 deg at 9.49 m/s (Dorn/SimTK,
  one runner; the only source with swing data).
- Ankle more plantarflexed through early swing at 9.49 m/s: the 40-60 % columns are -35.6 / -26.4 / -18.7, against
  -22.9 / -12.1 / -6.0 at 5.20 m/s (Dorn/SimTK).
- Arm swing: shoulder range 56.9, 75.7, 93.5, 120.4 deg at 3.56 / 5.20 / 7.00 / 9.49 m/s [inferred from the simtk
  peaks]; the elbow opens to 34.4 deg at 9.49 against 60.4-68.4 at the slower speeds (Dorn/SimTK only).
- Swing-leg loading: hip extension torque in terminal swing 0.91 -> 4.18 N.m/kg, 3.50 -> 8.95 m/s [read, Schache
  Table 1]. A kinetic cause, not an angle.
- Step rate: 2.66 -> 4.35 steps/s in the steady runner (Dorn/SimTK); 4.39 -> 4.82 across 79 men (Miyashiro Table 4).
- Thigh at the other foot's strike: -2.8 -> 10.9 deg, 8.99 -> 10.82 m/s [read, Miyashiro Table 4].

SATURATES
- Swing knee flexion: 107.5, 127.8, then 147.5 and 147.5 deg (Dorn/SimTK); 148.4 at 9.90 m/s (Miyashiro). Flat
  from about 7 m/s.
- Stance share: 31.5 -> 26.7 -> 24.0 -> 24.8 % (Schache); 33 -> 29 -> 26.5 -> 27 % (Dorn/SimTK); about 22-25 % in
  every sprint source from 9 to 11.6 m/s. Flat from about 7 m/s.
- Contact time: about 0.09-0.12 s from 9 m/s on, and 0.093 s at both 10.45 and 11.58 m/s (Bissas).
- Stance ankle peak dorsiflexion: 24.2, 26.4, 24.0, 23.3 deg (Dorn/SimTK peaks).
- Joint angles at foot strike at maximal speed: Miyashiro hip, knee and thigh at FS change under 2 % over
  8.99-10.82 m/s (Table 4, "negligible"); Bissas men and women differ significantly only in ankle at TO.
- In acceleration, step rate stops rising at about 4.8-4.9 steps/s from about 7 m/s (Nagahara, steps 4-5 onward;
  peak 4.87 at step 8); after that, speed comes from step length (1.40 -> 2.14 m). vLuW: rate only 4.0 -> 4.5.
- Stride length in the steady runner: 2.7, 3.6, 4.2, 4.4 m (Dorn/SimTK); little gain above 7 m/s.

REVERSES OR DISAGREES
- Knee at foot strike: it rises with speed in the steady runner (11.7, 19.2, 21.7, 25.8, Dorn/SimTK C3) but FALLS
  during acceleration (55.5 -> 31.5, Nagahara; 72 -> 25, vLuW). Every source meets at about 23-28 deg near maximal
  speed (1.6). Opposite directions, same end point; the direction depends on steady vs accelerating.
- Knee yield after strike: absent below about 7 m/s in acceleration, then it appears (Nagahara, from step +1). In
  steady and maximal running it shrinks with speed (Dorn/SimTK 0 -> 10 % rise 29.5, 26.5, 22.9, 16.8 deg
  [inferred]; Miyashiro 15.0 -> 12.2 deg).
- Rate vs length above 7 m/s: the steady runner and the Dorn paper's abstract say frequency (Dorn/SimTK 3.40 ->
  4.35/s, stride 4.2 -> 4.4 m); accelerating sprinters say length (Nagahara, vLuW); across runners at max speed both
  rise (Miyashiro); between the sexes it is length at equal rate (Bissas). Shown, not resolved.
- Stance at 8.95 vs 6.97 m/s (Schache 24.8 vs 24.0 %) is inside the read error: not a reversal.

## 4. What is NOT covered

- Fastest speed in any source: 11.58 m/s mean (range 11.35-11.75), Bissas men, 2017 World final. Points at foot
  strike and toe-off only, one stride each.
- Fastest full-stride joint curve: 9.49 m/s (Dorn/SimTK), ONE runner, two strides, angles computed by a reader from
  raw markers. These readers found no published full-stride curve above 4.5 m/s in any source.
- Fastest multi-runner curve of any kind: the stance-only knee to about 8.2 m/s (Nagahara, accelerating).
- 9 to 13 m/s: 9 to 9.5 m/s has one full curve (one runner); 9.5 to 11.75 m/s has event points only (foot strike,
  toe-off, a few swing extremes with no timing); 11.75 to 13 m/s has nothing in any source.
- So these would be extrapolation, and are not done here: any curve shape above 9.49 m/s; any point between foot
  strike and toe-off above 9.49 m/s other than Miyashiro's untimed extremes; anything above 11.75 m/s; a 3D
  pelvis-referenced hip or an absolute ankle above 9.49 m/s; shoulder or elbow above 9.49 m/s; women above 10.61 m/s.
- Not measured anywhere here: pelvis motion at sprint speed (only Dorn/SimTK has a pelvis, one runner); hip
  adduction and rotation (computed by reader 1, not reported); trunk curves over the stride.
- Could not obtain (from the reader files): the Dorn 2012 paper and its erratum; Miyashiro Supplementary Table 1 and
  raw data; the World Athletics 2017 biomechanics reports behind Bissas; the typeset vLuW paper; Schache's ref 27
  (angle conventions); per-trial values behind every figure.

## 5. Machine-readable block

Columns: source, speed_m_s, joint, percent, angle_deg, mark. Signs are the studio's (flexion and dorsiflexion
positive). `joint` carries the definition code, so rows with different definitions are never read as one series:
`hip_cardan3d` and `knee_cardan3d` (C3; standing hip +5.9, knee -5.7), `ankle_cardan3d_standing0` (C3a),
`hip_trunkref2d` (T2), `hip_shoulderref2d` (S2), `knee_2d` (K2), `knee_2d_stance_accel` (Nagahara; percent =
support % x 0.30, so the stride % is [inferred] +-3), `ankle_2d_offset_unknown` (A2?), `ankle_df_change_from_fs_2d`
(relative to foot strike), `shoulder_sagittal2d_vs_trunk` (SH2), `elbow_3point` (E3). Event rows at toe-off carry
that source's toe-off %. An empty percent means the source does not give the time. vLuW speeds are midpoints of
figure ranges (7.05 = 6.5-7.6, 8.65 = 8.0-9.3, 9.65 = 8.6-10.7); Nagahara speeds are +-0.5 m/s. Every angle here is
a conversion or a computation, so every mark is [inferred]; the input marks are in section 1. 239 data rows.

```csv
source,speed_m_s,joint,percent,angle_deg,mark
dorn2012_simtk_JA1,5.20,hip_cardan3d,0,37.3,inferred
dorn2012_simtk_JA1,5.20,hip_cardan3d,10,27.6,inferred
dorn2012_simtk_JA1,5.20,hip_cardan3d,20,4.8,inferred
dorn2012_simtk_JA1,5.20,hip_cardan3d,30,-9.6,inferred
dorn2012_simtk_JA1,5.20,hip_cardan3d,40,-8.8,inferred
dorn2012_simtk_JA1,5.20,hip_cardan3d,50,3.1,inferred
dorn2012_simtk_JA1,5.20,hip_cardan3d,60,30.6,inferred
dorn2012_simtk_JA1,5.20,hip_cardan3d,70,59.2,inferred
dorn2012_simtk_JA1,5.20,hip_cardan3d,80,62.9,inferred
dorn2012_simtk_JA1,5.20,hip_cardan3d,90,43,inferred
dorn2012_simtk_JA1,5.20,hip_cardan3d,100,37.1,inferred
dorn2012_simtk_JA1,5.20,knee_cardan3d,0,19.2,inferred
dorn2012_simtk_JA1,5.20,knee_cardan3d,10,45.7,inferred
dorn2012_simtk_JA1,5.20,knee_cardan3d,20,34.2,inferred
dorn2012_simtk_JA1,5.20,knee_cardan3d,30,16.1,inferred
dorn2012_simtk_JA1,5.20,knee_cardan3d,40,50.8,inferred
dorn2012_simtk_JA1,5.20,knee_cardan3d,50,96.3,inferred
dorn2012_simtk_JA1,5.20,knee_cardan3d,60,126.5,inferred
dorn2012_simtk_JA1,5.20,knee_cardan3d,70,110.3,inferred
dorn2012_simtk_JA1,5.20,knee_cardan3d,80,63.8,inferred
dorn2012_simtk_JA1,5.20,knee_cardan3d,90,8.3,inferred
dorn2012_simtk_JA1,5.20,knee_cardan3d,100,17.4,inferred
dorn2012_simtk_JA1,5.20,ankle_cardan3d_standing0,0,-7.6,inferred
dorn2012_simtk_JA1,5.20,ankle_cardan3d_standing0,10,21.1,inferred
dorn2012_simtk_JA1,5.20,ankle_cardan3d_standing0,20,17.2,inferred
dorn2012_simtk_JA1,5.20,ankle_cardan3d_standing0,30,-34.5,inferred
dorn2012_simtk_JA1,5.20,ankle_cardan3d_standing0,40,-22.9,inferred
dorn2012_simtk_JA1,5.20,ankle_cardan3d_standing0,50,-12.1,inferred
dorn2012_simtk_JA1,5.20,ankle_cardan3d_standing0,60,-6,inferred
dorn2012_simtk_JA1,5.20,ankle_cardan3d_standing0,70,-1.9,inferred
dorn2012_simtk_JA1,5.20,ankle_cardan3d_standing0,80,-4.8,inferred
dorn2012_simtk_JA1,5.20,ankle_cardan3d_standing0,90,-10.2,inferred
dorn2012_simtk_JA1,5.20,ankle_cardan3d_standing0,100,-8.7,inferred
dorn2012_simtk_JA1,5.20,shoulder_sagittal2d_vs_trunk,0,-58.9,inferred
dorn2012_simtk_JA1,5.20,shoulder_sagittal2d_vs_trunk,10,-38.1,inferred
dorn2012_simtk_JA1,5.20,shoulder_sagittal2d_vs_trunk,20,-14.4,inferred
dorn2012_simtk_JA1,5.20,shoulder_sagittal2d_vs_trunk,30,4.3,inferred
dorn2012_simtk_JA1,5.20,shoulder_sagittal2d_vs_trunk,40,1.3,inferred
dorn2012_simtk_JA1,5.20,shoulder_sagittal2d_vs_trunk,50,-16.5,inferred
dorn2012_simtk_JA1,5.20,shoulder_sagittal2d_vs_trunk,60,-37.7,inferred
dorn2012_simtk_JA1,5.20,shoulder_sagittal2d_vs_trunk,70,-54.8,inferred
dorn2012_simtk_JA1,5.20,shoulder_sagittal2d_vs_trunk,80,-67.2,inferred
dorn2012_simtk_JA1,5.20,shoulder_sagittal2d_vs_trunk,90,-68.3,inferred
dorn2012_simtk_JA1,5.20,shoulder_sagittal2d_vs_trunk,100,-58.3,inferred
dorn2012_simtk_JA1,5.20,elbow_3point,0,71.7,inferred
dorn2012_simtk_JA1,5.20,elbow_3point,10,73.5,inferred
dorn2012_simtk_JA1,5.20,elbow_3point,20,96.2,inferred
dorn2012_simtk_JA1,5.20,elbow_3point,30,125.9,inferred
dorn2012_simtk_JA1,5.20,elbow_3point,40,132.6,inferred
dorn2012_simtk_JA1,5.20,elbow_3point,50,108.9,inferred
dorn2012_simtk_JA1,5.20,elbow_3point,60,77,inferred
dorn2012_simtk_JA1,5.20,elbow_3point,70,65.5,inferred
dorn2012_simtk_JA1,5.20,elbow_3point,80,68.4,inferred
dorn2012_simtk_JA1,5.20,elbow_3point,90,69.2,inferred
dorn2012_simtk_JA1,5.20,elbow_3point,100,70.9,inferred
dorn2012_simtk_JA1,7.00,hip_cardan3d,0,42.1,inferred
dorn2012_simtk_JA1,7.00,hip_cardan3d,10,27.3,inferred
dorn2012_simtk_JA1,7.00,hip_cardan3d,20,-0.8,inferred
dorn2012_simtk_JA1,7.00,hip_cardan3d,30,-12.6,inferred
dorn2012_simtk_JA1,7.00,hip_cardan3d,40,-10.6,inferred
dorn2012_simtk_JA1,7.00,hip_cardan3d,50,5,inferred
dorn2012_simtk_JA1,7.00,hip_cardan3d,60,40,inferred
dorn2012_simtk_JA1,7.00,hip_cardan3d,70,70.4,inferred
dorn2012_simtk_JA1,7.00,hip_cardan3d,80,76.6,inferred
dorn2012_simtk_JA1,7.00,hip_cardan3d,90,52.9,inferred
dorn2012_simtk_JA1,7.00,hip_cardan3d,100,43.5,inferred
dorn2012_simtk_JA1,7.00,knee_cardan3d,0,21.7,inferred
dorn2012_simtk_JA1,7.00,knee_cardan3d,10,44.6,inferred
dorn2012_simtk_JA1,7.00,knee_cardan3d,20,28.5,inferred
dorn2012_simtk_JA1,7.00,knee_cardan3d,30,20.8,inferred
dorn2012_simtk_JA1,7.00,knee_cardan3d,40,69,inferred
dorn2012_simtk_JA1,7.00,knee_cardan3d,50,122.3,inferred
dorn2012_simtk_JA1,7.00,knee_cardan3d,60,147.5,inferred
dorn2012_simtk_JA1,7.00,knee_cardan3d,70,120.5,inferred
dorn2012_simtk_JA1,7.00,knee_cardan3d,80,70.3,inferred
dorn2012_simtk_JA1,7.00,knee_cardan3d,90,11.9,inferred
dorn2012_simtk_JA1,7.00,knee_cardan3d,100,22.1,inferred
dorn2012_simtk_JA1,7.00,ankle_cardan3d_standing0,0,-9.2,inferred
dorn2012_simtk_JA1,7.00,ankle_cardan3d_standing0,10,20.9,inferred
dorn2012_simtk_JA1,7.00,ankle_cardan3d_standing0,20,5,inferred
dorn2012_simtk_JA1,7.00,ankle_cardan3d_standing0,30,-33.4,inferred
dorn2012_simtk_JA1,7.00,ankle_cardan3d_standing0,40,-22.7,inferred
dorn2012_simtk_JA1,7.00,ankle_cardan3d_standing0,50,-13.2,inferred
dorn2012_simtk_JA1,7.00,ankle_cardan3d_standing0,60,-10,inferred
dorn2012_simtk_JA1,7.00,ankle_cardan3d_standing0,70,-3.2,inferred
dorn2012_simtk_JA1,7.00,ankle_cardan3d_standing0,80,-5.6,inferred
dorn2012_simtk_JA1,7.00,ankle_cardan3d_standing0,90,-10.6,inferred
dorn2012_simtk_JA1,7.00,ankle_cardan3d_standing0,100,-10.6,inferred
dorn2012_simtk_JA1,7.00,shoulder_sagittal2d_vs_trunk,0,-52.1,inferred
dorn2012_simtk_JA1,7.00,shoulder_sagittal2d_vs_trunk,10,-25.7,inferred
dorn2012_simtk_JA1,7.00,shoulder_sagittal2d_vs_trunk,20,4.3,inferred
dorn2012_simtk_JA1,7.00,shoulder_sagittal2d_vs_trunk,30,24.1,inferred
dorn2012_simtk_JA1,7.00,shoulder_sagittal2d_vs_trunk,40,9.7,inferred
dorn2012_simtk_JA1,7.00,shoulder_sagittal2d_vs_trunk,50,-15.4,inferred
dorn2012_simtk_JA1,7.00,shoulder_sagittal2d_vs_trunk,60,-39.6,inferred
dorn2012_simtk_JA1,7.00,shoulder_sagittal2d_vs_trunk,70,-56.4,inferred
dorn2012_simtk_JA1,7.00,shoulder_sagittal2d_vs_trunk,80,-68.8,inferred
dorn2012_simtk_JA1,7.00,shoulder_sagittal2d_vs_trunk,90,-66.3,inferred
dorn2012_simtk_JA1,7.00,shoulder_sagittal2d_vs_trunk,100,-53.1,inferred
dorn2012_simtk_JA1,7.00,elbow_3point,0,60.4,inferred
dorn2012_simtk_JA1,7.00,elbow_3point,10,66.1,inferred
dorn2012_simtk_JA1,7.00,elbow_3point,20,92.5,inferred
dorn2012_simtk_JA1,7.00,elbow_3point,30,123.1,inferred
dorn2012_simtk_JA1,7.00,elbow_3point,40,129,inferred
dorn2012_simtk_JA1,7.00,elbow_3point,50,97.6,inferred
dorn2012_simtk_JA1,7.00,elbow_3point,60,67.1,inferred
dorn2012_simtk_JA1,7.00,elbow_3point,70,61.4,inferred
dorn2012_simtk_JA1,7.00,elbow_3point,80,64.4,inferred
dorn2012_simtk_JA1,7.00,elbow_3point,90,61.3,inferred
dorn2012_simtk_JA1,7.00,elbow_3point,100,63.2,inferred
dorn2012_simtk_JA1,9.49,hip_cardan3d,0,46.1,inferred
dorn2012_simtk_JA1,9.49,hip_cardan3d,10,32.5,inferred
dorn2012_simtk_JA1,9.49,hip_cardan3d,20,0.3,inferred
dorn2012_simtk_JA1,9.49,hip_cardan3d,30,-18.2,inferred
dorn2012_simtk_JA1,9.49,hip_cardan3d,40,-14.2,inferred
dorn2012_simtk_JA1,9.49,hip_cardan3d,50,1.1,inferred
dorn2012_simtk_JA1,9.49,hip_cardan3d,60,33.6,inferred
dorn2012_simtk_JA1,9.49,hip_cardan3d,70,68,inferred
dorn2012_simtk_JA1,9.49,hip_cardan3d,80,85.9,inferred
dorn2012_simtk_JA1,9.49,hip_cardan3d,90,65.7,inferred
dorn2012_simtk_JA1,9.49,hip_cardan3d,100,45.7,inferred
dorn2012_simtk_JA1,9.49,knee_cardan3d,0,25.8,inferred
dorn2012_simtk_JA1,9.49,knee_cardan3d,10,42.6,inferred
dorn2012_simtk_JA1,9.49,knee_cardan3d,20,26.9,inferred
dorn2012_simtk_JA1,9.49,knee_cardan3d,30,16.2,inferred
dorn2012_simtk_JA1,9.49,knee_cardan3d,40,70.4,inferred
dorn2012_simtk_JA1,9.49,knee_cardan3d,50,123,inferred
dorn2012_simtk_JA1,9.49,knee_cardan3d,60,147.5,inferred
dorn2012_simtk_JA1,9.49,knee_cardan3d,70,129.7,inferred
dorn2012_simtk_JA1,9.49,knee_cardan3d,80,91,inferred
dorn2012_simtk_JA1,9.49,knee_cardan3d,90,33,inferred
dorn2012_simtk_JA1,9.49,knee_cardan3d,100,23.1,inferred
dorn2012_simtk_JA1,9.49,ankle_cardan3d_standing0,0,-8.2,inferred
dorn2012_simtk_JA1,9.49,ankle_cardan3d_standing0,10,21.2,inferred
dorn2012_simtk_JA1,9.49,ankle_cardan3d_standing0,20,2.3,inferred
dorn2012_simtk_JA1,9.49,ankle_cardan3d_standing0,30,-38.2,inferred
dorn2012_simtk_JA1,9.49,ankle_cardan3d_standing0,40,-35.6,inferred
dorn2012_simtk_JA1,9.49,ankle_cardan3d_standing0,50,-26.4,inferred
dorn2012_simtk_JA1,9.49,ankle_cardan3d_standing0,60,-18.7,inferred
dorn2012_simtk_JA1,9.49,ankle_cardan3d_standing0,70,-9.9,inferred
dorn2012_simtk_JA1,9.49,ankle_cardan3d_standing0,80,-2.7,inferred
dorn2012_simtk_JA1,9.49,ankle_cardan3d_standing0,90,-7.4,inferred
dorn2012_simtk_JA1,9.49,ankle_cardan3d_standing0,100,-8.2,inferred
dorn2012_simtk_JA1,9.49,shoulder_sagittal2d_vs_trunk,0,-64.3,inferred
dorn2012_simtk_JA1,9.49,shoulder_sagittal2d_vs_trunk,10,-24.5,inferred
dorn2012_simtk_JA1,9.49,shoulder_sagittal2d_vs_trunk,20,9.6,inferred
dorn2012_simtk_JA1,9.49,shoulder_sagittal2d_vs_trunk,30,30,inferred
dorn2012_simtk_JA1,9.49,shoulder_sagittal2d_vs_trunk,40,3.9,inferred
dorn2012_simtk_JA1,9.49,shoulder_sagittal2d_vs_trunk,50,-28,inferred
dorn2012_simtk_JA1,9.49,shoulder_sagittal2d_vs_trunk,60,-46.3,inferred
dorn2012_simtk_JA1,9.49,shoulder_sagittal2d_vs_trunk,70,-70,inferred
dorn2012_simtk_JA1,9.49,shoulder_sagittal2d_vs_trunk,80,-89,inferred
dorn2012_simtk_JA1,9.49,shoulder_sagittal2d_vs_trunk,90,-87,inferred
dorn2012_simtk_JA1,9.49,shoulder_sagittal2d_vs_trunk,100,-67.2,inferred
dorn2012_simtk_JA1,9.49,elbow_3point,0,64.1,inferred
dorn2012_simtk_JA1,9.49,elbow_3point,10,71,inferred
dorn2012_simtk_JA1,9.49,elbow_3point,20,90.3,inferred
dorn2012_simtk_JA1,9.49,elbow_3point,30,114.1,inferred
dorn2012_simtk_JA1,9.49,elbow_3point,40,121.2,inferred
dorn2012_simtk_JA1,9.49,elbow_3point,50,81.9,inferred
dorn2012_simtk_JA1,9.49,elbow_3point,60,38.2,inferred
dorn2012_simtk_JA1,9.49,elbow_3point,70,38.8,inferred
dorn2012_simtk_JA1,9.49,elbow_3point,80,45.1,inferred
dorn2012_simtk_JA1,9.49,elbow_3point,90,50.7,inferred
dorn2012_simtk_JA1,9.49,elbow_3point,100,63.2,inferred
vonlieres2020,7.05,hip_trunkref2d,0,69,inferred
vonlieres2020,7.05,hip_trunkref2d,31,0,inferred
vonlieres2020,7.05,knee_2d,0,43,inferred
vonlieres2020,7.05,knee_2d,31,19,inferred
vonlieres2020,8.65,hip_trunkref2d,0,55,inferred
vonlieres2020,8.65,hip_trunkref2d,26,-10,inferred
vonlieres2020,8.65,knee_2d,0,33,inferred
vonlieres2020,8.65,knee_2d,26,21,inferred
vonlieres2020,9.65,hip_trunkref2d,0,36,inferred
vonlieres2020,9.65,hip_trunkref2d,23,-25,inferred
vonlieres2020,9.65,knee_2d,0,25,inferred
vonlieres2020,9.65,knee_2d,23,21,inferred
miyashiro2019,8.99,hip_trunkref2d,0,47.9,inferred
miyashiro2019,8.99,hip_trunkref2d,24.7,-14.4,inferred
miyashiro2019,8.99,knee_2d,0,27.9,inferred
miyashiro2019,8.99,knee_2d,24.7,23.9,inferred
miyashiro2019,9.9,hip_trunkref2d,0,48.1,inferred
miyashiro2019,9.9,hip_trunkref2d,24.1,-16.4,inferred
miyashiro2019,9.9,knee_2d,0,27.7,inferred
miyashiro2019,9.9,knee_2d,24.1,24.6,inferred
miyashiro2019,9.9,knee_2d,,148.4,inferred
miyashiro2019,9.9,ankle_df_change_from_fs_2d,24.1,-24.1,inferred
miyashiro2019,10.82,hip_trunkref2d,0,48.3,inferred
miyashiro2019,10.82,hip_trunkref2d,23.4,-18.4,inferred
miyashiro2019,10.82,knee_2d,0,27.6,inferred
miyashiro2019,10.82,knee_2d,23.4,25.4,inferred
bissas2022_women,10.45,hip_shoulderref2d,0,37.8,inferred
bissas2022_women,10.45,hip_shoulderref2d,22.2,-18.3,inferred
bissas2022_women,10.45,knee_2d,0,25,inferred
bissas2022_women,10.45,knee_2d,22.2,28.4,inferred
bissas2022_women,10.45,ankle_2d_offset_unknown,0,-28.3,inferred
bissas2022_women,10.45,ankle_2d_offset_unknown,22.2,-41,inferred
bissas2022_men,11.58,hip_shoulderref2d,0,40.3,inferred
bissas2022_men,11.58,hip_shoulderref2d,22.2,-16.3,inferred
bissas2022_men,11.58,knee_2d,0,23.5,inferred
bissas2022_men,11.58,knee_2d,22.2,26,inferred
bissas2022_men,11.58,ankle_2d_offset_unknown,0,-26.4,inferred
bissas2022_men,11.58,ankle_2d_offset_unknown,22.2,-48.2,inferred
nagahara2014,5.7,knee_2d_stance_accel,0,55.5,inferred
nagahara2014,5.7,knee_2d_stance_accel,6,49,inferred
nagahara2014,5.7,knee_2d_stance_accel,12,43,inferred
nagahara2014,5.7,knee_2d_stance_accel,18,35,inferred
nagahara2014,5.7,knee_2d_stance_accel,24,20,inferred
nagahara2014,5.7,knee_2d_stance_accel,30,10,inferred
nagahara2014,6.3,knee_2d_stance_accel,0,47.5,inferred
nagahara2014,6.3,knee_2d_stance_accel,6,43,inferred
nagahara2014,6.3,knee_2d_stance_accel,12,38.5,inferred
nagahara2014,6.3,knee_2d_stance_accel,18,33,inferred
nagahara2014,6.3,knee_2d_stance_accel,24,19,inferred
nagahara2014,6.3,knee_2d_stance_accel,30,10,inferred
nagahara2014,6.9,knee_2d_stance_accel,0,42.5,inferred
nagahara2014,6.9,knee_2d_stance_accel,6,39.5,inferred
nagahara2014,6.9,knee_2d_stance_accel,12,36.5,inferred
nagahara2014,6.9,knee_2d_stance_accel,18,30,inferred
nagahara2014,6.9,knee_2d_stance_accel,24,18,inferred
nagahara2014,6.9,knee_2d_stance_accel,30,9,inferred
nagahara2014,7.4,knee_2d_stance_accel,0,38.5,inferred
nagahara2014,7.4,knee_2d_stance_accel,6,38,inferred
nagahara2014,7.4,knee_2d_stance_accel,12,38.5,inferred
nagahara2014,7.4,knee_2d_stance_accel,18,34.5,inferred
nagahara2014,7.4,knee_2d_stance_accel,24,23.5,inferred
nagahara2014,7.4,knee_2d_stance_accel,30,11.5,inferred
nagahara2014,7.8,knee_2d_stance_accel,0,37,inferred
nagahara2014,7.8,knee_2d_stance_accel,6,38,inferred
nagahara2014,7.8,knee_2d_stance_accel,12,39,inferred
nagahara2014,7.8,knee_2d_stance_accel,18,36,inferred
nagahara2014,7.8,knee_2d_stance_accel,24,25.5,inferred
nagahara2014,7.8,knee_2d_stance_accel,30,13,inferred
nagahara2014,8.2,knee_2d_stance_accel,0,31.5,inferred
nagahara2014,8.2,knee_2d_stance_accel,6,34.5,inferred
nagahara2014,8.2,knee_2d_stance_accel,12,37.5,inferred
nagahara2014,8.2,knee_2d_stance_accel,18,35,inferred
nagahara2014,8.2,knee_2d_stance_accel,24,25,inferred
nagahara2014,8.2,knee_2d_stance_accel,30,12.5,inferred
```

## 6. For the builders

1. Swing harder at 9 m/s: the hip flexes to about 86 deg and extends to about -18 (vs 65 / -10 at 5.2 m/s), the
   knee folds to about 148 deg, and the arms swing about 120 deg (Dorn/SimTK one runner; Miyashiro 148 knee).
2. Touch down for a shorter share: contact about 0.09-0.125 s (five sources), stance 22-27 % of the stride (all six).
   Flight is longer than contact in the sprinters (Miyashiro, Bissas, vLuW) but shorter in the steady runner
   (Dorn/SimTK 9.49 m/s: 0.100-0.112 against 0.124 s).
3. Land with the knee about 23-28 deg bent and yield less after strike (12-17 deg, not ~30 as at 3.5 m/s), with
   the trunk near upright, about 75-88 deg from horizontal (Miyashiro [inferred lean], Bissas, vLuW).
4. The sources cannot tell them the shape of the stride above 9.5 m/s, or anything at all above 11.75 m/s.
5. They cannot settle step rate vs step length at 9 m/s (steady 4.35/s vs sprinting 4.6-4.85/s), nor the absolute
   ankle angle at sprint speed (definitions differ by 10-20 deg).

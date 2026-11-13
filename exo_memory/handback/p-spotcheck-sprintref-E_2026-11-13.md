# Spot-check of the sprint reference against the SimTK markers (pane E, machine D, 2026-11-13)

Packet: the chair, 15:27Z, step 1 ("the spot-check owed since the laptop", `librarian/2026-11-13.md:367`, "D does
that before C builds from it"). Tier: check it. Measurement only. Checked:
- `loop/sprint_reference_2026-11-13/simtk_dorn_running.md` (sections 4 and 5);
- `00_reference.md` (sections 1.1, 1.2, 1.6 and 6);
- the papers' strike and take-off figures as that file gives them.

**Verdict, short.** Reader 1's hip and knee numbers reproduce:
- 78 of 78 values are within their stated error (hip 4°, knee 6°), from my own reader, frames and filter.
- Section 6's builder figures hold for this runner.

One explanation in the reference is wrong, though its numbers are right. Section 1.6 reads the 9.5 m/s knee at
take-off (9.3°) against the papers' 21–28.4° as a definition gap ("C3 is about 12-19 deg straighter than every K2
value"). It is not one. On the papers' own 2D definition, from these markers, the knee at take-off is 10.3° (lateral
markers: 7.7–9.0°). So **this steady runner really leaves the ground 11–18° straighter than the sprinters.** A bar
taken from Dorn at take-off is a steady runner's bar.

Every difference beyond 4°/6° is in section 3, each with the command that prints it.

## 1. Independence, and the data

- **Data:** the same SimTK package, `RunningDataModels.zip` (sha256 `380ac4b69a5e99a97756eaf4df83ac0fe76d675fb485ac2dfcb2143c645324f0`, 2,802,028 bytes). These are the bytes both readers used. Copied from C's download on D, `…/0845a868-…/scratchpad/stomp/simtk_dl/d.zip`, into an empty folder of my own and unpacked there.
- **Code:** written here from the C3D format and from reader 1's words in section 3B, not from either reader's scripts (those are on L). It is in `p-spotcheck-sprintref-E_2026-11-13_scripts/`:
  - `c3d.js`: the reader;
  - `angles.js`: the angles;
  - `plates.js`: the event check;
  - `compare.js`: the cell check;
  - `events.js`: the event values;
  - `knee_lateral.js`: the papers-style knee.
- **What was rebuilt:** definition C3, as section 3B states it. That means Harrington hip centre; knee and ankle centres carried by the thigh and shank clusters from the static trial; Cardan Z-X-Y; knee sign flipped.
- **The filter:** a 2nd-order Butterworth at 15 Hz run forward and back. I read reader 1's "4th-order zero-lag" as this; if it meant a 4th-order run both ways, the cut-off spread below covers the difference.
- **Standing values:** hip C3 +5.9°, knee C3 −5.7°, the same as reader 1's to the digit. Pelvis width 217.1 mm and depth 191.4 mm; hip centre −55.8 / −76.0 / 78.9 mm.

Also measured:
- the 2D sagittal angles the papers use: thigh to vertical, knee K2 (thigh minus shank), hip T2 (thigh plus trunk lean);
- K2 again from the lateral skin markers.

**The event times are checked against the plates.** Each plate contact starts 1.3 to 4.0 ms after its labelled
strike and ends 0 to 5.3 ms before its labelled toe-off, at all three speeds. That is the window reader 1 reported;
the second reader had listed it as "could not check".

Commands, from `exo_memory/handback/p-spotcheck-sprintref-E_2026-11-13_scripts/`, with `<data>` the unpacked zip:

    node plates.js <data>/Run9ms/JA1Gait35.c3d                      (and Run5ms/JA1Gait27, Run7ms/JA1Gait33)
    for fc in 10 15 25; do node angles.js <data> $fc json > fc$fc.json; done
    node compare.js fc15.json fc10.json fc25.json                     (section 2)
    node events.js fc15.json                                          (sections 3 and 4, per stride)
    node knee_lateral.js <data>                                       (the lateral-marker knee)

## 2. Against `simtk_dorn_running.md` section 4: nothing beyond the stated error

checked: `node compare.js fc15.json fc10.json fc25.json` → "78 values compared; 0 beyond the reader's stated error (hip 4, knee 6 deg)"

That is 11 cells plus 2 peaks, for hip and knee, at 5.2, 7.0 and 9.5 m/s. The largest differences:
- knee at 80 %, 9.5 m/s: −4.6° (mine 86.4°, reader 91.0°);
- hip at 80 %, 9.5 m/s: −3.8°;
- hip swing peak at 9.5 m/s: mine 82.7° against 85.9°, −3.2°.

All are inside the error, but they have one sign: **in late swing (60–90 %) mine read 1.0 to 4.6° lower at every
speed.** The cut-off moves those cells by at most 1.9° (10–25 Hz), so the filter is not the cause. It fits reader 1's
own cluster-choice term (up to 3.9° hip, 5.7° knee). For a builder, 86° is the top of this runner's hip peak, not its
middle. The two strides themselves read 84.4° and 80.9°.

Toe-off falls at 29.4 / 28.9 %, 26.5 % and 27.0 / 27.0 % of the stride, as section 5 says.

## 3. Every difference beyond 4°/6°: all against the papers, none in the reference's own numbers

The papers' figures are from `00_reference.md` 1.1, 1.2 and 1.6. Mine are from `node events.js fc15.json`, given as
the mean of the strides, with the strides in brackets. The papers are other runners in other conditions, so each line
says which.

**a. Knee at take-off, 9.5 m/s.** The finding.

| method | knee at take-off |
|---|---|
| mine, K2 (2D, the papers' definition) | 10.3° (10.9, 9.7) |
| mine, K2 from lateral markers (`node knee_lateral.js`) | 8.4° (9.0, 7.7) |
| mine, C3 | 9.6° (10.3, 8.9) |
| reader 1, C3 minimum | 9.3° |

| paper | knee at take-off | mine minus theirs |
|---|---|---|
| vLuW, 8.6–10.7 m/s | 21° | −10.7° |
| Miyashiro, 8.99 m/s | 23.9° | −13.6° |
| Miyashiro, 9.90 m/s | 24.6° | −14.3° |
| Miyashiro, 10.82 m/s | 25.4° | −15.1° |
| Bissas, men | 26.0° | −15.7° |
| Bissas, women | 28.4° | −18.1° |

Standing-referenced (K2 standing is −4.6°), mine is 14.9°: still 6.1 to 13.5° below. Section 1.6's note attributes
the gap to C3 against K2. On the same K2 definition the gap stays, so the attribution is wrong. The gap is the runner:
one steady runner landing flat, against accelerating or top-speed sprinters.

**b. Knee at strike.**

- **At 9.5 m/s:** K2 20.9° (24.2, 17.6) against Miyashiro 27.9 / 27.7 / 27.6°: −7.0 / −6.8 / −6.7°. Against vLuW 25°
  and Bissas 25.0 / 23.5° it is within 6°. C3 is 25.5° (28.0, 22.9), within section 6's 23–28°. K2 is 2.1° under its
  lower bound.
- **At 7.0 m/s:** K2 18.8° against vLuW step 5 (6.5–7.6 m/s) +43° and Nagahara (~6.9 m/s) 42.5°: −24.2 and −23.7°.
  Both are sprinters accelerating from blocks, so this is condition, not error.

**c. Hip at strike and take-off (T2).** These differences are mostly my trunk line, not a finding. No neck-front
marker exists, so my trunk runs hip centre to C7 (the back of the neck), and my standing T2 reads −16.3°.

- **Raw:**
  - at strike, 9.5 m/s: 33.4° against Miyashiro 47.9 / 48.1° (−14.5 / −14.7°) and Bissas 40.3° (−6.9°);
  - at take-off, 9.5 m/s: −42.0° against −14.4° to −25° (−17 to −27.6°);
  - at 7.0 m/s against vLuW step 5: strike 22.9° against +69°, take-off −38.8° against 0°.
- **With my standing offset removed:**
  - strike at 9.5 m/s: 49.7°, within 2° of Miyashiro; +13.7° on vLuW's 36°;
  - take-off at 9.5 m/s: −25.7°, against Miyashiro −14.4 / −16.4 / −18.4° (−11.3 / −9.3 / −7.3°) and Bissas
    −18.3 / −16.3° (−7.4 / −9.4°).

Read the hip against the papers as definition-limited. The pelvis-referenced C3 at take-off, −15.5° (−16.0, −15.0),
sits inside the papers' −14.4° to −25° range.

**d. Thigh to vertical, the cleanest cross-source angle (a segment, no joint definition).**

- At strike, 9.5 m/s: 28.6° against Miyashiro +33.0° (−4.4°) and Bissas +27.4 / +29.7°: within.
- At take-off: −41.5° (−41.7, −41.2) against Miyashiro −28.7° and Bissas −25.2 / −22.8°: −12.8 to −18.7°.
  Standing-referenced (thigh standing −7.3°), it is −34.2°, still −5.5 to −11.4°.

This agrees with (a): this runner leaves the ground with the thigh further back and the knee straighter.

## 4. Section 6, "For the builders", item by item (hip and knee only)

| item | reference | mine (C3 unless named) | |
|---|---|---|---|
| hip peak flexion, 9 m/s | about 86° | 82.7° (84.4, 80.9) | −3.3°, holds; 86 is the top |
| hip extension, 9 m/s | about −18° | −18.4° (min) | holds |
| at 5.2 m/s | 65 / −10° | 63.6 / −10.1° | holds |
| knee fold, 9 m/s | about 148° | 146.2° (145.7, 146.7); K2 146.4° | holds |
| knee at strike | 23–28° | 25.5° (28.0, 22.9); K2 20.9° | holds in C3; K2 2.1° under |
| yield after strike | 12–17° (Miyashiro's sprinters) | 18.5° (15.9, 21.0); K2 19.4° (16.3, 22.4) | stride 2 is 4 to 5.4° over the top, within 6 |
| stance share | 22–27 % | 27.0 % at 9.5 m/s | holds |

For C, measured, not a ruling. This runner's hip and knee curves are sound as the reference prints them. Strike,
fold and peaks agree with the sprinters. At take-off he is a steady runner: knee about 10° and thigh about −41°,
against the sprinters' 21–28° and −23 to −29°. Which of the two the hunter should take off like is a choice, not
a measurement.

## Corrections

- My first 2D standing values (thigh −7.3°) looked wrong. I checked that the static subject faces +Y, as in the runs:
  SACR to mid-ASIS (−26, 184, −45) mm, and RASI minus LASI (216, 26, −4) mm. They stand as measured.
- My first reading of the take-off gap was the reference's own: definition. The lateral-marker run settled it the
  other way.

# [T2]: what the T-180 builder cannot make yet (pane C, 2026-11-26)

Packet `exo_memory/loop/packet_t180_unmakeable_shapes_2026-11-26.md`, the chair's D677 dispatch of 18:51:44Z and its ADDENDUM of 19:33:18Z.
Research only; nothing landed. Builder at `ceb21f5` in my own worktree `G:\consonance-scratch\t180-t2-c`, unchanged. Everything ran headless at
BelowNormal; his app and the game were never launched. The read and every derived file stay local in `G:\consonance-scratch\c-t2\`, uncommitted. This
file speaks of [T2] only, by metres along the lap and our own measured differences.

## The count

- **Section by section, 61 of 61 sections are made: 36,088 m of the 36,330 m lap** (the sections are cut one 4 m grid point apart, and the 60
  joints are the other 240 m). checked: `node table.js lay_pass7.json lay_hand5.json` → `made: 61 / 61 sections (36089 / 36089 m of section length)`
  (the table sums rounded lengths; `lay.js` sums 36,088).
- **By hand: 61 sections. Only by steering: 0. Only by solved rates: 0.** (The addendum's question.) Every section is made by a route whose every
  value is read off the read and typed, with nothing measured on the built road:

  | simplest route that made it | sections | pieces in those sections |
  |---|---|---|
  | rows (one piece, extra rows) | 1 | 1 |
  | corners every 50 m | 2 | 10 |
  | corners every 20 m | 17 | 271 |
  | corners every 10 m | 29 | 1,953 |
  | corners every 5 m | 12 | 2,185 |
  | **total** | **61** | **4,420** |

  checked: `awk` over `table_pass7.md`'s columns 7 and 8 (the command is in "How it was done").
- **The caveat on "by hand", stated before anyone reads the count as "he can type [T2]":** in the table each section is laid in a fresh document
  whose lead lands it on the read's own pose. A person typing along the lap starts each section wherever the last one ended. So the honest test is
  the **chained** one below, where the same hand presses run on from the actual head with no reset.
- **Chained, by hand at 5 m from the actual head: 5 of 7 stretches made, 26,971 of 36,302 m.** The other two miss at single places
  (3.75° and 3.28° against 3°, 1.07 m against 1 m), with position never past 1.7 m (the chained section below).
- **As ONE document, the lap is NOT made.** Laid whole, the builder refuses it at section 20 with `PASS_CLEARANCE`. The read's own geometry, drawn
  the way the builder draws it, already passes closer over itself than the builder allows, in six places. That is the first unmade class below.
- **The cross-section is not made on 16 of 61 sections** even with the panel's whole profile set and a roll of up to 5°: the second unmade class.

So [T2] names **two unmade classes**, each with its sections in the table: the close pass (a whole-lap class, at sections 2/33, 13/20, 15/53,
16/54 and 21/28), and the off-centre floor (16 sections).

## The unmade classes

| class not made | sections (from m to m) | what blocks it | routes tried | checked? |
|---|---|---|---|---|
| **a banked road passing over another, 13 to 20 m higher at the centre lines but only 13 to 14 m off in plan, so its low edge and underside come within 3.1 m of the road below** (one of the five places has an inverted road under a pass 3.4 m higher, 30 m off in plan) | the pairs 13 (4,708-5,693) / 20 (8,905-9,836); 2 (275-1,022) / 33 (13,694-14,737); 15 (5,995-6,205) / 53 (31,375-31,732); 16 (6,209-6,620) / 54 (31,736-32,435); 21 (9,840-10,244) / 28 (12,409-12,744) | **The builder's own rule, by design** (`app/core/coreshell.js:446-475`, `passClearanceGuard`; the rule `src/validate/passclear.js:109`, `CAR_MARGIN_M` 3.1 at `:39`; the underside `UNDERSKIN_OFFSET_M` 1.5, `src/export/underskin.js:38`; the apron `APRON_WIDTH_M` 2.0, `src/export/apron.js:52`). Run on the READ's own geometry (centre, heading, pitch, bank, width and cup as the builder draws them): with the 2 m apron **16 stations in 6 places** are short of 3.1 m; with no apron, **8 stations in 4 places** (the shortest: 2/33, the two surfaces 0.32 m apart and the solids through each other by 1.57 m; 13/20, 1.56 m of the 3.1 m). Section by section the table never meets it, because each section is laid alone. | 1. whole lap, solved 20 m pieces, apron 2 m: REFUSED in #20, "the underside of the road at 4.93 km is 1.54 m over the road at 8.99 km". 2. whole lap, 20 m, apron 0 through the panel's Track ▸ Edge apron (`app/menubar/items.js:34` → `shell.setEdgeApron`): REFUSED in #20, 2.24 m. 3. whole lap, 10 m, apron 0: REFUSED in #20, 1.62 m. 4. whole lap BY HAND (10 m corners typed off the read), apron 0: REFUSED in #20, 1.47 m (3 places). | checked: `chain_lap20.txt`, `chain_lap20_apron0.txt`, `chain_lap10_apron0.txt`, `chain_lap10_hand_apron0.txt`, `passread.js` (local). inferred: whether the read is right that the passes are this close, or the reader's width and cup at a crossing make them so. |
| **an off-centre floor: a cross-section whose two sides tilt differently from the centre's normal** (the read's eight tilts, at ¼, ½, ¾ and the edge of each side) | 16 sections: 26, 27, 28, 32, 33, 34, 35, 44, 48, 49, 50, 51, 57, 58, 60, 61 (column "cross-section" in the table, the ones marked NOT) | **Panel gap, partly.** The panel sends a symmetric middle (one cup, `src/geom/fonts.js:40` `FLOORS.bowl`) and per-side edges only from `s` ≥ 0.5 of the half-width (`src/core/document.js:51`, `S_MIN = 0.5`). An inner profile that differs left to right has no field. | 1. plain: cup × edge start × left edge × right edge, the panel's own grid (`xsec.js`): 5 of 61 sections pass. 2. the same profile rolled by up to ±5° against the read (`xsec5.js`; this spends the bank's 5° budget): 45 of 61 pass, the 16 named do not (best 81-94% of stations against the 95% bar). | checked: `xsec_sections.json` (the summary command in "How it was done"). inferred: whether the asymmetry is the road or the reader. The reader's tilts are unsigned (`read_track.cjs:55`, `rel` is an `acos`) and its quarter points come from its own walk (`:117-121`). The rolled route was scored on every 4th failing station, not all. |

Neither row says "cannot". For the close pass, four forms did not make it. A route not tried: bend one pass by what it lacks with no apron, 0.2, 1.5, 3.0 and 4.7 m at the four places (`passread.js`,
apron 0), each inside the 5 m position bar. That would measure, undo and re-lay against the read (STEERED), and the 4.7 m at 2/33 is at the bar's edge.

## Chained: the same hand presses along the lap, with no reset

The chained runs lay sections a to b in ONE document, each section's presses run on from the actual head (`chain.js`; sections start where the
last ended). Measured over the whole stretch against the same tolerances. Pieces every 10 m, apron as default.

| sections | solved rates, 10 m | by hand, 10 m corners | by hand, 5 m corners |
|---|---|---|---|
| 1-14 | not: width (pos 1.5 m, dir 1.7°, bank 0.7°, width 1.17 m; 598 presses) | not: direction+width (pos 1.8 m, dir 3.6°, bank 1.0°, width 1.27 m; 598 presses) | **made** (pos 0.8 m, dir 1.7°, bank 0.5°, width 0.42 m; 1197 presses) |
| 15-24 | **made** (pos 1.7 m, dir 2.0°, bank 0.4°, width 0.84 m; 555 presses) | not: direction (pos 1.9 m, dir 3.9°, bank 0.6°, width 0.99 m; 555 presses) | **made** (pos 0.9 m, dir 1.8°, bank 0.3°, width 0.46 m; 1111 presses) |
| 25-34 | not: direction+width (pos 1.7 m, dir 3.2°, bank 1.1°, width 1.36 m; 363 presses) | not: direction+width (pos 2.7 m, dir 4.9°, bank 2.2°, width 1.31 m; 363 presses) | not: direction+width (pos 1.7 m, dir 3.8°, bank 0.9°, width 1.07 m; 720 presses) |
| 35-35 | not: width (pos 1.3 m, dir 2.7°, bank 0.2°, width 2.08 m; 443 presses) | not: width (pos 1.3 m, dir 2.4°, bank 0.2°, width 2.08 m; 443 presses) | **made** (pos 1.3 m, dir 1.9°, bank 0.1°, width 0.51 m; 886 presses) |
| 36-44 | **made** (pos 0.8 m, dir 2.8°, bank 0.2°, width 0.92 m; 642 presses) | **made** (pos 0.9 m, dir 3.0°, bank 0.5°, width 0.92 m; 642 presses) | **made** (pos 0.8 m, dir 1.4°, bank 0.1°, width 0.66 m; 1281 presses) |
| 45-50 | not: direction (pos 2.0 m, dir 4.2°, bank 3.2°, width 0.81 m; 459 presses) | not: direction (pos 2.0 m, dir 5.3°, bank 2.4°, width 0.81 m; 459 presses) | **made** (pos 1.1 m, dir 2.4°, bank 2.0°, width 0.48 m; 919 presses) |
| 51-61 | not: width (pos 1.7 m, dir 2.9°, bank 0.5°, width 1.32 m; 573 presses) | not: direction+width (pos 1.6 m, dir 3.8°, bank 0.5°, width 1.32 m; 573 presses) | not: direction (pos 1.4 m, dir 3.3°, bank 0.5°, width 0.57 m; 1144 presses) |

checked: `node chaintable.js` over `chains_pass7.txt`, `chains_hand10.txt`, `chains_hand5*.txt` (local).

- **By hand at 5 m, chained along the lap with no reset: 5 of 7 stretches made, 26,971 m of the 36,302 m the stretches span.** Position
  never exceeds 1.7 m on any stretch, so nothing drifts: what the per-section table makes by hand, a person typing on from the actual head also
  makes, except at three places.
- The two stretches not made miss at single places, in sections each made by hand when laid alone:
  - 25-34: direction 3.75° at 15,108 m (section 34; alone at 5 m, 1.6°) and width 1.07 m at 12,704 m (section 28, inverted road);
  - 51-61: direction 3.28° at 34,370 m (section 58; alone at 5 m, 1.9°).
  These are "this form did not", not a class. The route not tried: hand corners finer than 5 m at those places.
- At 10 m, hand and solved rates miss at the same places (e.g. width 2.08 m at 15,848 m in both, where the read's width falls from 35.0 to 29.3 m
  in 12 m). At 5 m by hand that stretch reads 0.51 m. The finer hand route makes 5 stretches, the 10 m solved one 2.

## The section table

Columns: section (from m to m) · class · made? · simplest route · pieces inside the section · kind · worst difference over its tolerance (x1.00 =
at the bar) · the worst bank against the read's RAW station normal, beside the scored one (see amendment 6) · cross-section · what blocks it ·
every route tried and what it failed on. HAND = values read off the read and typed (one, rows, corners50/20/10/5). SOLVED = rates fitted to the
read's angles once, from the head's pose; not typeable by eye; no section needed one. No route in this table is STEERED.

| # | from m | to m | class | made? | simplest route that made it | pieces in section | kind | worst difference / tolerance | bank vs raw normal | cross-section: stations within 5°, plain / rolled ≤5° | what blocks it | routes tried (result) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 0 | 271 | straight, on the road | made | corners50 | 6 | HAND | direction x0.80 | 1.2 deg | 97% / 97% | - | one (position+direction), rows (position+direction), corners50 (made), corners20 (made), corners10 (made), solve20m (made), solve30f (made), solve10m (made), solve5m (made) |
| 2 | 275 | 1022 | tight turn (R < 180 m), on the road | made | corners10 | 76 | HAND | direction x0.96 | 0.8 deg | 85% / 100% | - | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width), corners50 (position+direction+width), corners20 (direction), corners10 (made), solve20m (made), solve30f (direction+width), solve10m (made), solve5m (made) |
| 3 | 1026 | 1284 | turn (R 180-500 m), on the road | made | corners20 | 13 | HAND | direction x0.86 | 2.0 deg | 76% / 100% | - | one (position+direction+bank+width+roll rate), rows (position+direction+bank+width), corners50 (direction+width), corners20 (made), corners10 (made), solve20m (made), solve30f (bank+width), solve10m (made), solve5m (made) |
| 4 | 1288 | 1435 | tight turn (R < 180 m), inverted (up > 110 deg) | made | corners20 | 8 | HAND | width x0.94 | 1.6 deg | 100% / 100% | - | one (position+direction+bank+width+peak curvature+roll rate), rows (position+direction+bank+width+peak curvature), corners50 (direction+width), corners20 (made), corners10 (made), solve20m (made), solve30f (direction+bank), solve10m (made), solve5m (made) |
| 5 | 1439 | 1788 | turn (R 180-500 m), on the wall (up 60-110 deg), steep (pitch 30-75 deg) | made | corners20 | 18 | HAND | direction x0.60 | 2.3 deg | 73% / 100% | - | one (position+direction+bank+width), rows (position+direction+bank+width+peak curvature), corners50 (direction), corners20 (made), corners10 (made), solve20m (made), solve30f (width), solve10m (made), solve5m (made) |
| 6 | 1792 | 2204 | tight turn (R < 180 m), on the road | made | corners10 | 42 | HAND | direction x0.91 | 0.5 deg | 79% / 100% | - | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width), corners50 (direction+width), corners20 (direction), corners10 (made), solve20m (made), solve30f (direction+width), solve10m (made), solve5m (made) |
| 7 | 2208 | 2776 | straight, on the road | made | corners20 | 29 | HAND | width x0.84 | 0.3 deg | 15% / 100% | - | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width+peak curvature), corners50 (direction+width), corners20 (made), corners10 (made), solve20m (made), solve30f (made), solve10m (made), solve5m (made) |
| 8 | 2780 | 3638 | turn (R 180-500 m), on the road | made | corners10 | 87 | HAND | width x0.69 | 0.2 deg | 56% / 100% | - | one (position+direction+bank+width), rows (position+direction+width), corners50 (direction+width), corners20 (width), corners10 (made), solve20m (width), solve30f (width), solve10m (made), solve5m (made) |
| 9 | 3642 | 4074 | sweep (R 500-1500 m), on the road | made | corners10 | 44 | HAND | width x0.73 | 0.5 deg | 69% / 100% | - | one (position+direction+bank+width), rows (position+direction+bank+width), corners50 (direction+width), corners20 (direction+width), corners10 (made), solve20m (direction+width), solve30f (direction+width), solve10m (made), solve5m (made) |
| 10 | 4078 | 4229 | turn (R 180-500 m), on the road | made | corners50 | 4 | HAND | direction x0.88 | 2.2 deg | 100% / 100% | - | one (position+direction+bank), rows (position+direction+bank+peak curvature), corners50 (made), corners20 (made), corners10 (made), solve20m (made), solve30f (made), solve10m (made), solve5m (made) |
| 11 | 4233 | 4502 | tight turn (R < 180 m), inverted (up > 110 deg) | made | corners20 | 14 | HAND | direction x0.85 | 1.7 deg | 85% / 100% | - | one (position+direction+bank), rows (position+direction+bank+width+peak curvature), corners50 (direction), corners20 (made), corners10 (made), solve20m (made), solve30f (bank), solve10m (made), solve5m (made) |
| 12 | 4506 | 4705 | tight turn (R < 180 m), on the wall (up 60-110 deg) | made | corners10 | 21 | HAND | direction x0.63 | 1.2 deg | 81% / 100% | - | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width+peak curvature), corners50 (direction+width), corners20 (direction), corners10 (made), solve20m (made), solve30f (bank+width), solve10m (made), solve5m (made) |
| 13 | 4708 | 5693 | turn (R 180-500 m), on the road | made | corners20 | 50 | HAND | width x0.68 | 1.1 deg | 74% / 100% | - | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width), corners50 (direction+width), corners20 (made), corners10 (made), solve20m (made), solve30f (direction+width), solve10m (made), solve5m (made) |
| 14 | 5697 | 5991 | turn (R 180-500 m), on the wall (up 60-110 deg) | made | corners10 | 30 | HAND | direction x0.42 | 0.4 deg | 82% / 100% | - | one (position+direction+bank+width+peak curvature), rows (position+direction+width+peak curvature), corners50 (direction+width), corners20 (width), corners10 (made), solve20m (width), solve30f (direction), solve10m (made), solve5m (made) |
| 15 | 5995 | 6205 | sweep (R 500-1500 m), on the road | made | corners20 | 11 | HAND | width x0.87 | 0.6 deg | 52% / 100% | - | one (position+direction+bank+width+peak curvature), rows (direction+width), corners50 (direction+width), corners20 (made), corners10 (made), solve20m (made), solve30f (direction+peak curvature), solve10m (made), solve5m (made) |
| 16 | 6209 | 6620 | turn (R 180-500 m), on the road | made | corners10 | 42 | HAND | direction x0.76 | 0.8 deg | 54% / 96% | - | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width+peak curvature), corners50 (position+direction+width), corners20 (direction), corners10 (made), solve20m (made), solve30f (direction+width), solve10m (made), solve5m (made) |
| 17 | 6624 | 8520 | tight turn (R < 180 m), on the road | made | corners5 | 380 | HAND | direction x0.82 | 0.7 deg | 83% / 100% | - | one (position+direction+bank+width), rows (position+direction+bank+width+peak curvature), corners50 (direction+width), corners20 (direction), corners10 (direction), corners5 (made), solve20m (direction), solve30f (direction+width), solve10m (made), solve5m (made) |
| 18 | 8524 | 8691 | sweep (R 500-1500 m), on the road | made | corners20 | 9 | HAND | width x0.83 | 0.1 deg | 86% / 100% | - | one (position+direction+width+peak curvature), rows (position+direction+width), corners50 (width), corners20 (made), corners10 (made), solve20m (made), solve30f (direction), solve10m (made), solve5m (made) |
| 19 | 8695 | 8901 | straight, on the road | made | rows | 1 | HAND | width x0.76 | 0.2 deg | 100% / 100% | - | one (position+direction), rows (made), corners50 (made), corners20 (made), corners10 (made), solve20m (made), solve30f (made), solve10m (made), solve5m (made) |
| 20 | 8905 | 9836 | tight turn (R < 180 m), on the road | made | corners5 | 187 | HAND | width x0.46 | 0.6 deg | 84% / 100% | refusals on coarse forms: NOT_LAID | one (position+direction+bank+width+peak curvature+roll rate), rows (position+direction+bank+width), corners50 (position+direction+width), corners20 (direction+width), corners10 (direction), corners5 (made), solve20m (direction), solve30f (refused NOT_LAID), solve10m (made), solve5m (made) |
| 21 | 9840 | 10244 | sweep (R 500-1500 m), on the road | made | corners10 | 41 | HAND | direction x0.78 | 0.4 deg | 81% / 100% | refusals on coarse forms: NOT_LAID | one (position+direction+bank+width+peak curvature), rows (position+direction+width), corners50 (direction+width), corners20 (direction+width), corners10 (made), solve20m (width), solve30f (refused NOT_LAID), solve10m (made), solve5m (made) |
| 22 | 10248 | 10403 | sweep (R 500-1500 m), on the road, steep (pitch 30-75 deg) | made | corners20 | 8 | HAND | width x0.85 | 0.1 deg | 60% / 100% | - | one (position+direction+width), rows (position+direction+width), corners50 (width), corners20 (made), corners10 (made), solve20m (made), solve30f (made), solve10m (made), solve5m (made) |
| 23 | 10407 | 10598 | turn (R 180-500 m), on the road | made | corners20 | 10 | HAND | width x0.61 | 0.6 deg | 63% / 100% | - | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width), corners50 (width), corners20 (made), corners10 (made), solve20m (made), solve30f (direction), solve10m (made), solve5m (made) |
| 24 | 10602 | 11548 | tight turn (R < 180 m), on the wall (up 60-110 deg) | made | corners5 | 190 | HAND | width x0.94 | 1.9 deg | 64% / 99% | - | one (position+direction+bank+width+peak curvature+roll rate), rows (position+direction+bank+width+peak curvature), corners50 (direction+width), corners20 (direction+width), corners10 (width), corners5 (made), solve20m (width), solve30f (direction+bank+width), solve10m (width), solve5m (made) |
| 25 | 11552 | 11828 | tight turn (R < 180 m), on the road | made | corners10 | 28 | HAND | direction x0.67 | 2.0 deg | 36% / 97% | - | one (position+direction+bank+width), rows (position+direction+width), corners50 (direction+width), corners20 (direction+width), corners10 (made), solve20m (width), solve30f (direction+width), solve10m (made), solve5m (made) |
| 26 | 11832 | 12239 | turn (R 180-500 m), on the road | made | corners10 | 41 | HAND | width x0.70 | 2.0 deg | 29% / 85% NOT | refusals on coarse forms: NOT_LAID | one (position+direction+bank+width+peak curvature+roll rate), rows (refused NOT_LAID), corners50 (direction+width), corners20 (width), corners10 (made), solve20m (width), solve30f (refused NOT_LAID), solve10m (made), solve5m (made) |
| 27 | 12243 | 12405 | turn (R 180-500 m), on the wall (up 60-110 deg), steep (pitch 30-75 deg) | made | corners10 | 17 | HAND | width x0.60 | 4.6 deg | 43% / 90% NOT | - | one (position+direction+bank+width), rows (position+direction+bank+width+peak curvature), corners50 (direction+bank+width), corners20 (direction+width), corners10 (made), solve20m (width), solve30f (direction+bank+width), solve10m (made), solve5m (made) |
| 28 | 12409 | 12744 | tight turn (R < 180 m), on the wall (up 60-110 deg), steep (pitch 30-75 deg) | made | corners10 | 34 | HAND | direction x0.99 | 3.4 deg | 26% / 81% NOT | - | one (position+direction+bank+width+peak curvature+roll rate), rows (position+direction+bank+width+peak curvature+roll rate), corners50 (position+direction+bank+width), corners20 (direction+width), corners10 (made), solve20m (width), solve30f (direction+bank+width), solve10m (made), solve5m (made) |
| 29 | 12747 | 12940 | tight turn (R < 180 m), on the road | made | corners10 | 20 | HAND | direction x0.85 | 3.7 deg | 36% / 96% | - | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width), corners50 (position+direction+width), corners20 (direction), corners10 (made), solve20m (made), solve30f (direction), solve10m (made), solve5m (made) |
| 30 | 12944 | 13145 | sweep (R 500-1500 m), on the road | made | corners10 | 21 | HAND | direction x0.77 | 3.7 deg | 62% / 96% | - | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width), corners50 (position+direction+bank+width), corners20 (direction), corners10 (made), solve20m (made), solve30f (direction+bank+width), solve10m (made), solve5m (made) |
| 31 | 13149 | 13513 | turn (R 180-500 m), inverted (up > 110 deg) | made | corners10 | 37 | HAND | direction x0.90 | 3.5 deg | 26% / 98% | - | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width+peak curvature), corners50 (position+direction+bank+width), corners20 (direction+width), corners10 (made), solve20m (direction+width), solve30f (direction+bank+width), solve10m (made), solve5m (made) |
| 32 | 13517 | 13690 | tight turn (R < 180 m), on the wall (up 60-110 deg) | made | corners10 | 18 | HAND | direction x0.67 | 1.0 deg | 43% / 87% NOT | - | one (position+direction+bank+width), rows (position+direction+width), corners50 (direction+width), corners20 (direction), corners10 (made), solve20m (made), solve30f (direction+width), solve10m (made), solve5m (made) |
| 33 | 13694 | 14737 | sweep (R 500-1500 m), on the road | made | corners5 | 209 | HAND | direction x0.61 | 4.7 deg | 28% / 92% NOT | refusals on coarse forms: NOT_LAID | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width+peak curvature), corners50 (position+direction+width), corners20 (direction+width), corners10 (direction+width), corners5 (made), solve20m (direction+width), solve30f (refused NOT_LAID), solve10m (direction), solve5m (made) |
| 34 | 14741 | 15163 | tight turn (R < 180 m), on the road | made | corners5 | 85 | HAND | direction x0.52 | 3.0 deg | 48% / 93% NOT | - | one (position+direction+bank+width+peak curvature+roll rate), rows (position+direction+width), corners50 (direction+width), corners20 (direction+width), corners10 (direction), corners5 (made), solve20m (width), solve30f (direction+bank+width), solve10m (made), solve5m (made) |
| 35 | 15167 | 19599 | sweep (R 500-1500 m), on the wall (up 60-110 deg) | made | corners10 | 444 | HAND | width x1.00 | 1.3 deg | 33% / 94% NOT | - | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width+peak curvature), corners50 (position+direction+width), corners20 (direction+width), corners10 (made), solve20m (direction+width), solve30f (direction+width), solve10m (made), solve5m (made) |
| 36 | 19603 | 19769 | turn (R 180-500 m), on the wall (up 60-110 deg) | made | corners20 | 9 | HAND | width x0.82 | 0.2 deg | 68% / 100% | - | one (position+direction+width+peak curvature), rows (position+direction+bank+width+peak curvature), corners50 (width), corners20 (made), corners10 (made), solve20m (made), solve30f (made), solve10m (made), solve5m (made) |
| 37 | 19773 | 20365 | turn (R 180-500 m), on the road | made | corners10 | 60 | HAND | width x0.46 | 0.3 deg | 73% / 100% | - | one (position+direction+bank+width), rows (position+direction+width+peak curvature), corners50 (direction+width), corners20 (width), corners10 (made), solve20m (width), solve30f (width), solve10m (made), solve5m (made) |
| 38 | 20369 | 21082 | tight turn (R < 180 m), on the road | made | corners10 | 72 | HAND | direction x0.92 | 0.7 deg | 70% / 100% | refusals on coarse forms: NOT_LAID | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width), corners50 (direction+width), corners20 (direction), corners10 (made), solve20m (made), solve30f (refused NOT_LAID), solve10m (made), solve5m (made) |
| 39 | 21086 | 21303 | sweep (R 500-1500 m), on the road | made | corners5 | 44 | HAND | width x0.90 | 3.1 deg | 46% / 96% | - | one (position+direction+bank+width+peak curvature), rows (position+direction+width+peak curvature), corners50 (direction+width), corners20 (direction+width), corners10 (width), corners5 (made), solve20m (direction+width), solve30f (width+peak curvature), solve10m (width), solve5m (made) |
| 40 | 21307 | 21772 | straight, on the road | made | corners20 | 24 | HAND | width x0.86 | 0.2 deg | 42% / 100% | - | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width+peak curvature), corners50 (direction+width), corners20 (made), corners10 (made), solve20m (made), solve30f (direction), solve10m (made), solve5m (made) |
| 41 | 21776 | 22030 | tight turn (R < 180 m), on the road | made | corners20 | 13 | HAND | width x0.96 | 0.3 deg | 64% / 100% | - | one (position+direction+width), rows (position+direction+width), corners50 (direction+width), corners20 (made), corners10 (made), solve20m (made), solve30f (width), solve10m (made), solve5m (made) |
| 42 | 22034 | 22553 | straight, on the road | made | corners5 | 104 | HAND | direction x0.50 | 0.4 deg | 83% / 100% | - | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width), corners50 (position+direction+width), corners20 (direction), corners10 (direction), corners5 (made), solve20m (made), solve30f (width), solve10m (made), solve5m (made) |
| 43 | 22557 | 22831 | turn (R 180-500 m), on the road | made | corners10 | 28 | HAND | width x0.72 | 2.8 deg | 17% / 100% | refusals on coarse forms: NOT_LAID | one (position+direction+bank+width+peak curvature), rows (position+direction+width+peak curvature), corners50 (direction+width), corners20 (width), corners10 (made), solve20m (width), solve30f (refused NOT_LAID), solve10m (made), solve5m (made) |
| 44 | 22835 | 26008 | tight turn (R < 180 m), on the road | made | corners10 | 318 | HAND | direction x0.93 | 2.8 deg | 36% / 91% NOT | - | one (position+direction+bank+width+peak curvature+roll rate), rows (position+direction+bank+width+peak curvature), corners50 (position+direction+width), corners20 (direction+width), corners10 (made), solve20m (direction+width), solve30f (direction+bank+width), solve10m (made), solve5m (made) |
| 45 | 26011 | 26181 | sweep (R 500-1500 m), on the road | made | corners20 | 9 | HAND | width x0.97 | 10.0 deg | 64% / 95% | refusals on coarse forms: NOT_LAID | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width+peak curvature), corners50 (direction+width), corners20 (made), corners10 (made), solve20m (made), solve30f (refused NOT_LAID), solve10m (made), solve5m (made) |
| 46 | 26185 | 26345 | tight turn (R < 180 m), on the road | made | corners5 | 32 | HAND | direction x0.57 | 1.6 deg | 57% / 100% | refusals on coarse forms: NOT_LAID | one (position+direction+bank+width), rows (refused NOT_LAID), corners50 (position+direction+bank), corners20 (direction), corners10 (direction), corners5 (made), solve20m (direction), solve30f (direction), solve10m (made), solve5m (made) |
| 47 | 26349 | 26578 | sweep (R 500-1500 m), on the road | made | corners20 | 12 | HAND | width x0.99 | 0.7 deg | 34% / 97% | - | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width+peak curvature), corners50 (direction+width), corners20 (made), corners10 (made), solve20m (direction), solve30f (direction+width+peak curvature), solve10m (made), solve5m (made) |
| 48 | 26582 | 29616 | tight turn (R < 180 m), on the road | made | corners5 | 607 | HAND | direction x0.89 | 3.3 deg | 40% / 94% NOT | refusals on coarse forms: NOT_LAID | one (position+direction+bank+width+peak curvature+roll rate), rows (position+direction+bank+width), corners50 (position+direction+bank+width), corners20 (direction+width), corners10 (direction), corners5 (made), solve20m (direction+width), solve30f (refused NOT_LAID), solve10m (direction), solve5m (made) |
| 49 | 29620 | 29822 | tight turn (R < 180 m), on the wall (up 60-110 deg), steep (pitch 30-75 deg) | made | corners5 | 41 | HAND | direction x0.47 | 5.5 deg | 70% / 93% NOT | - | one (position+direction+bank+width+peak curvature+roll rate), rows (position+direction+bank+width+peak curvature), corners50 (position+direction+bank+width), corners20 (direction), corners10 (direction), corners5 (made), solve20m (direction), solve30f (direction+bank+width), solve10m (made), solve5m (made) |
| 50 | 29826 | 30602 | tight turn (R < 180 m), on the road | made | corners10 | 78 | HAND | direction x0.76 | 3.6 deg | 10% / 86% NOT | - | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width), corners50 (position+direction+width), corners20 (direction), corners10 (made), solve20m (made), solve30f (direction+bank+width), solve10m (made), solve5m (made) |
| 51 | 30606 | 31054 | straight, on the road | made | corners5 | 90 | HAND | direction x0.38 | 1.0 deg | 30% / 89% NOT | - | one (position+direction+width+peak curvature), rows (position+direction+width), corners50 (direction+width), corners20 (width), corners10 (width), corners5 (made), solve20m (direction+width), solve30f (direction+width), solve10m (width), solve5m (made) |
| 52 | 31058 | 31371 | tight turn (R < 180 m), on the road | made | corners20 | 16 | HAND | width x0.76 | 0.6 deg | 88% / 100% | - | one (position+direction+bank+width), rows (position+direction+width+peak curvature), corners50 (direction+width), corners20 (made), corners10 (made), solve20m (made), solve30f (width), solve10m (made), solve5m (made) |
| 53 | 31375 | 31732 | sweep (R 500-1500 m), on the road | made | corners20 | 18 | HAND | width x0.84 | 0.2 deg | 80% / 100% | - | one (position+direction+width+peak curvature), rows (direction+width), corners50 (direction+width), corners20 (made), corners10 (made), solve20m (made), solve30f (direction), solve10m (made), solve5m (made) |
| 54 | 31736 | 32435 | turn (R 180-500 m), on the road | made | corners10 | 71 | HAND | width x0.63 | 0.3 deg | 81% / 100% | - | one (position+direction+width), rows (position+direction+width+peak curvature), corners50 (width), corners20 (width), corners10 (made), solve20m (width), solve30f (width), solve10m (made), solve5m (made) |
| 55 | 32439 | 32593 | tight turn (R < 180 m), on the road | made | corners10 | 16 | HAND | direction x0.60 | 0.4 deg | 95% / 100% | - | one (position+direction+bank), rows (position+direction+bank+peak curvature), corners50 (direction), corners20 (direction), corners10 (made), solve20m (made), solve30f (made), solve10m (made), solve5m (made) |
| 56 | 32597 | 33048 | sweep (R 500-1500 m), on the road | made | corners10 | 46 | HAND | direction x0.86 | 0.7 deg | 45% / 100% | - | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width), corners50 (position+direction+width), corners20 (direction+width), corners10 (made), solve20m (direction), solve30f (direction+width), solve10m (made), solve5m (made) |
| 57 | 33052 | 33360 | turn (R 180-500 m), on the road | made | corners10 | 32 | HAND | direction x0.83 | 1.0 deg | 49% / 90% NOT | - | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width), corners50 (direction+width), corners20 (direction), corners10 (made), solve20m (made), solve30f (direction+width), solve10m (made), solve5m (made) |
| 58 | 33364 | 34444 | tight turn (R < 180 m), on the road | made | corners5 | 216 | HAND | direction x0.64 | 1.6 deg | 49% / 93% NOT | - | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width+peak curvature), corners50 (position+direction+width), corners20 (direction), corners10 (direction), corners5 (made), solve20m (direction), solve30f (direction+width), solve10m (made), solve5m (made) |
| 59 | 34448 | 35099 | straight, on the road | made | corners10 | 66 | HAND | width x1.00 | 1.8 deg | 46% / 98% | refusals on coarse forms: NOT_LAID | one (position+direction+bank+width+peak curvature), rows (position+direction+bank+width+peak curvature), corners50 (direction+width), corners20 (direction+width), corners10 (made), solve20m (direction+width), solve30f (refused NOT_LAID), solve10m (made), solve5m (made) |
| 60 | 35103 | 36040 | turn (R 180-500 m), on the road | made | corners10 | 94 | HAND | width x0.99 | 1.1 deg | 49% / 90% NOT | - | one (position+direction+bank+width), rows (position+direction+bank+width+peak curvature), corners50 (direction+width), corners20 (direction+width), corners10 (made), solve20m (direction+width), solve30f (direction+width), solve10m (made), solve5m (made) |
| 61 | 36044 | 36326 | straight, on the road | made | corners10 | 29 | HAND | width x0.85 | 0.0 deg | 33% / 94% NOT | - | one (position+direction+width+peak curvature), rows (position+direction+width+peak curvature), corners50 (direction+width), corners20 (width), corners10 (made), solve20m (width), solve30f (direction+width), solve10m (made), solve5m (made) |

## The tolerances, named before measuring

Registered in `TOLERANCES.md` (local) at **2026-11-26T18:56:26Z**, before any section was laid:

| quantity | tolerance |
|---|---|
| position | 5 m, nearest point of the built line to each read point |
| direction | 3° between tangents |
| bank | 5° about the tangent |
| elevation | inside position |
| width | 1 m |
| peak curvature | within 20% of the read's peak, or 0.001 /m |
| roll rate | peak within 25% of the read's, or 0.5 °/m |

"Not made" = any row outside. Amendments, each dated in the file, none of which changed a tolerance:
1. 18:57:10Z, before any section was laid: the read's curvature window 24 → 48 m (±24 m), from the read's own noise (`noise.js`).
2. 19:00:42Z, after a two-section trial of the harness (nothing scored): the read's heading, pitch, bank and width from the same ±12 m smoothed
   line as its position.
3. 19:12:21Z, before any cross-section number: the CROSS-SECTION test (all eight tilts within 5°, on ≥ 95% of a section's stations), scored apart.
4. 19:20:15Z, the HARNESS: each section starts from a lead 8 grid points back, its landing piece solved onto the read's pose at the section's start
   (the first station had carried the lead's error).
5. 19:52:25Z, the HARNESS: every route lays 6 grid points (~24 m) of pad before and after the section, and only the section is measured. The read's
   curvature and roll-rate windows are ±24 m, and a built road stopping at the section's end was compared over a window it did not have
   (sections 15, 40 and 51).
6. 19:52:25Z, the MEASURE, **made after a miss, so named as such**: amendment 2 registered the read's bank from the smoothed line, and `measure()`
   had compared against the raw station normal. It now compares against the smoothed one, as registered, and the raw one is reported beside it
   for every section. This moved sections 45 and 49 from "not made" to "made". At 26,051 m the raw normal's up angle reads 11.0° between
   neighbours at 21.7° and 24.6°, a one-station glitch; there the raw column reads 10.0°.

## How it was done

- The read: the skill's reader, `READ_PROFILE=1`, local under the builder's `reads/`. Grid of 9,181 points, 3.982 m apart, ±12 m smoothing.
- Sections: `sections.js` cuts the lap by class (turn radius, attitude, pitch), merging runs under 150 m → 61 sections.
- Every route presses the shell's own `extend` with the panel's own fields (`panelOpts` builds them as `app/core/panel.js:205` `extendOptions`
  does), in a fresh `createCoreShell` per section: one piece; rows; corners every 50/20/10/5 m (turn and climb as corners, the end bank, width
  and cup at each cut); solved rates every 20/10/5 m with a rate-change penalty (mu 0.2); flow marks every 30 m.
- Scripts, all local in `G:\consonance-scratch\c-t2\`, uncommitted: `ref.js` (the read on its grid), `sections.js`, `lay.js` (the routes and
  the measure), `table.js`, `chain.js`, `passread.js` (the builder's clearance rule on the read), `xsec.js` and `xsec5.js` (cross-section),
  `noise.js`, `dbg3.js` to `dbg8.js` (single-section traces), `TOLERANCES.md`.
- The counts' commands:
  - the table: `node table.js lay_pass7.json lay_hand5.json`;
  - the route breakdown: `awk -F'|' 'NR>2 && $6 ~ /made/ {gsub(/ /,"",$7); c[$7]++; p[$7]+=$8} END {for (k in c) print k, c[k], p[k]}' table_pass7.md`;
  - the cross-section: `node -e` over `xsec_sections.json` → `plain 5 952 rolled 45 19149 of 61`.
- Limits met on the way, by file and line: `PASS_CLEARANCE` (`app/core/coreshell.js:475`); `BAD_SECOND` (`src/core/extend.js:853`, on the flow
  marks); `S_MIN` 0.5 (`src/core/document.js:51`); the change floors, width 40 m and cup and edges 26 m, on an extra change inside a piece
  (`src/core/extend.js:356`), which the hand pieces do not use. The core itself was exact where tested: a rate piece turns (k0 + k1)·L/2 (`dbg3.js`),
  and the typed end bank and width are reached (`dbg4.js`).

## Corrections

- At the chair's HOLD of 18:52:14Z I stopped, committed `2003c90c` and rang the librarian "ready". The VOID of 18:58:52Z arrived after I had rung,
  and it said not to ring. The "ready" ring should not have gone out.
- Pass 2 is superseded by pass 4 (the lead, amendment 4), and pass 4 by pass 7 (the pad and the bank measure, amendments 5 and 6). All are kept
  locally. **Pass 4 had 53 of 61 made, 1 by hand. The rise to 61 by hand is mostly route coverage, not the measure:** pass 4 never ran the
  20, 10 and 5 m hand corners. Of the hand routes run in both passes, 3 results went from fail to made with amendments 5 and 6. checked:
  the route counts per pass file (`lay_pass2/4/6/7.json`).
- The lap-start lead fell back to two 4 m pieces from the first point, so section 1 began 8 m ahead of the read. It was found by `chain.js` and
  `dbg8.js` and fixed with a lead along the first point's tangent. It touched only section 1 in passes 2 and 4 (a straight, made either way).
- I first blamed the chained drift on the one-point gaps between sections. The main cause was the lead bug above.
- The 12 sections my first pass 7 table gave as "only by solved rates" were made by hand once I tried 5 m corners. I nearly handed back the
  smaller count. That is the falsifier's shape exactly: a class written as not-by-hand, then laid by a hand route the hand-back had not tried.
- **Incident:** a cleanup of my own processes used the loose pattern `lay\.js|chain\.js|dbg`, which matched pane E's `t5_lay.json` argument and
  stopped E's [T5] run (PID 1128). I rang the librarian with an interrupt at once. It is recorded in `e9cac2fd`. I now list by exact script path,
  then stop by PID (my memory `kill-by-exact-script-path`).

## The unwelcome outcome, named

The packet's falsifier asks for at least one unmade class per track, with a section table. The welcome reading is "the builder makes [T2] by
hand". The real reading is narrower. **Each piece of [T2] can be typed. The whole of [T2] cannot be laid in one document, because the builder's
own clearance rule refuses the read's own passes.** That rests on a reader I have not checked at crossings (the inferred column).

## Map line

`exo_memory/map/C.md`, 2026-11-26, [T2] unmakeable.

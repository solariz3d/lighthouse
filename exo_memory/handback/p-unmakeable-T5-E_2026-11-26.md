# The unmakeable shapes, track [T5] (pane E, machine D, 2026-11-26)

**Order:** the chair, 18:51:35Z, Part 2: `exo_memory/loop/packet_t180_unmakeable_shapes_2026-11-26.md`, track [T5]. Research only, headless,
BelowNormal; nothing was launched. His words in the brief (12:48): *"There are points in each track that our system cannot currently make"*.

**Order 2 (19:44:28Z), section 9:**
- the reader branch `reader-downray-e` `dab271b`;
- the whole lap read and laid: **19 of 71 sections made, 2,730 of 10,734 m**. The read's misses are 11 sections (1,131 m), all on the first pass.
  The builder's misses are 41 sections (6,873 m).
- the route through the ramp at d 4,038 is open.

Section 5c and parts of sections 4-5 are corrected in section 7.

**Builder:** the worktree `C:\Consonance\t180-wt-e-rightwards` at `136e309` (landing-1126 `ceb21f5` plus my L255 CSS fix; the core is the same as ceb21f5's).
Every section was laid through `app/core/panel.js` `extendOptions` and `src/core/turnby.js` `extendCorner`, the call the panel's Extend makes
(`app/core/coreshell.js` `extend`), and the jumps through `src/core/jump.js` `jump`, the Jump button's free flight.

**Privacy:** the track's name, folder, coordinates and the read stay local (the key, `reads/reference_key_2026-11-26.local.md`). Below are section ranges
in metres along the read, classes in bands, and our own measured differences. The scripts and every output are in my scratch folder, uncommitted.

## 1. The fit: blocked, and why

The packet asks for an `.equation.json` first. **It could not be made, and I did not improvise one** (the skill's rule: a step with no script is reported
missing).
- checked: `scripts/fit-fourier.cjs` → `Error: the read does not close`. `tools/piecewise.cjs` closes the lap inside its constrained fit, so it needs a lap too.
- checked: [T5]'s read ended at the length limit, not closed: walked 11,845 m against a stated 10.3 km (the track's own ui file). Its jump at reader d 4,038
  "landed" 1.07 m from road it had already driven at d 1,320, heading the other way (direction dot −0.99). From there it re-walked earlier road backwards.
- checked: a scratch copy of the reader whose landing refuses road within 20 m that the walk already took (the third of three guards tried) stops at
  d 4,038 instead: `lost`, a face at 90° 4 m ahead. Up to d 4,030 it is the original read, station for station (977 stations, max difference 0.000 m).
- checked: the track has no AI line (its `ai/` folder is empty), so nothing on disk says which way the lap goes.

**So everything below covers reader d 0–4,038, which is 0–4,204 m of mesh arc. That is about 4.2 km of the stated 10.3 km.** The rest is unread
(section 5).

## 2. How I cut and laid it

- **The line:** the mesh centreline (`tools/piecewise.cjs` `meshCentreline`, the skill's step 2), 970 stations.
- **Re-read (scratch, my addition):** where `crossSection` read the road under 8 m wide, or flagged a width step, I read it again with rays straight down
  across the road every 0.25 m. Why: at 856 m `crossSection` read 1.7 m where the down-rays find 16.5 m of continuous road. That road is cupped, its cross
  slope running from about 31° to 47° across. The re-read took 134 stations; **44 stay unread**, and they are counted in the table.
- **The cuts:** at the two jumps, and wherever the turn class (straight under 10 °/100 m, left, right) or the bank band (under 45°, 45–100°, over 100°)
  changes, both read from rates smoothed over ±10 m. Pieces under 30 m were merged into the one before. **35 road sections and 2 jumps.**
- **The setup:** each section starts from the read's own state there (position, heading, pitch, plus `first` = its turn rate, climb rate, bank and width:
  the field the panel fills on an empty track). It is laid from 10 m before its start to 10 m past its end, and compared only inside.
- **13 forms per section, all through `extendOptions`:**
  - corner mode: one piece; a piece per turn-rate extreme; pieces every ~40, ~20, ~10 and ~5 m;
  - rate mode: pieces every ~20, ~10 and ~5 m;
  - corner mode with the bank's "at start" tick: pieces every ~10 and ~5 m;
  - the flowing bank: one piece with marks every ~25 m, and pieces every ~40 m with marks every ~10 m.
- **Not tried:** Sharp, Level, the sculpt tools (Grab, Smooth), the cup and the edge fields.
- **The jumps:** laid with the free landing pose taken from the read's landing, measured from the built take-off's end.

## 3. Tolerances, named before the first run, and never changed

They were set in `t5_lay.cjs` (`TOL`) before its first run (v1), and every later run used the same numbers. Each reason is my judgment, not a sourced standard.

| quantity | tolerance | why |
|---|---|---|
| position | 3 m | under a fifth of the road's width (its 10th percentile is 16.3 m): the road would still be "there" to a driver |
| heading | 3° | the angle that builds a 3 m miss over about 60 m |
| pitch / grade | 2° | tighter than heading: a crest or a dip is felt at speed more than a heading is seen |
| bank | 5° | the skill's own step-8 bank bar |
| width | 2 m | about one car width, an eighth of the road |
| peak curvature | 20% (and over 0.002 1/m) | a corner's tightest radius within a fifth |
| peak roll rate | 30% or 0.5 °/m | how fast the bank turns, felt in the wheel |

**What did change after the first run was the measure, eight times, each for a stated reason** (section 6). v1 laid 1 section, v8 laid 10. **Between v6
and v7, sections flipped both ways on a measurement change alone** (12 made, then 10). So a section whose misses are all within 1.5× its tolerance is
written **marginal**, and no class is drawn from it.

## 4. The table (v8, frozen)

Ranges are mesh arc length from the read's start. "Position held" is the worst position difference of the same form.

| section m (mesh arc) | class | made? | what blocks it | best form | worst difference (its tolerance) | routes tried | simplest route that made it | pieces | STEERED |
|---|---|---|---|---|---|---|---|---|---|
| 0-60 | corner, bank under 45° | no | a kink in the read's centre the built road does not follow (peak curvature off 82%, 4.1x its tolerance); inferred read-side (a widening at 56-60 m, checked) | corner: pieces every ~5 m, bank at start | heading 2.1 ° (tol 3); also peak curvature off 82% | 13 forms | - | - | - |
| 60-236 | corner, bank under 45° | no | marginal: heading 1.34x, within 1.5x tolerance, position held (1.7 m) | corner: pieces every ~5 m, bank at start | heading 4.0 ° (tol 3) | 13 forms | - | - | - |
| 236-294 | corner, banked 45-100° | no | marginal: heading 1.44x, within 1.5x tolerance, position held (1.1 m) | corner: pieces every ~5 m | heading 4.3 ° (tol 3) | 13 forms | - | - | - |
| 294-479 | corner, banked 45-100° | yes | - | corner: pieces every ~5 m | width 1.5 m (tol 2) | 13 forms | corner: pieces every ~5 m | 25 | no |
| 479-682 | corner, bank under 45° | yes | - | corner: pieces every ~5 m | heading 2.4 ° (tol 3) | 13 forms | corner: pieces every ~5 m | 26 | no |
| 778-885 | tight corner, bank under 45°, steep (pitch 30° or more); 3 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | corner: pieces every ~5 m, bank at start | pitch 16.8 ° (tol 2); also position 4.9m, heading 5.5°, width 2.3m | 13 forms | - | - | - |
| 885-979 | corner, bank under 45°; 6 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | corner: pieces every ~10 m, bank at start | pitch 8.9 ° (tol 2); also position 8.9m, heading 12.7°, bank 11.3°, width 3.1m, peak curvature off 61% | 13 forms | - | - | - |
| 979-1085 | corner, bank under 45°; 4 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | corner: pieces every ~5 m, bank at start | pitch 3.5 ° (tol 2); also position 4.3m, heading 5.0°, peak curvature off 22% | 13 forms | - | - | - |
| 1085-1218 | corner, bank under 45°; 5 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | corner: pieces every ~5 m, bank at start | pitch 8.9 ° (tol 2); also position 10.2m, heading 7.0°, width 2.1m | 13 forms | - | - | - |
| 1218-1280 | corner, bank under 45°; 2 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | rate: pieces every ~10 m | heading 16.4 ° (tol 3); also position 9.1m, pitch 10.4°, width 2.2m, peak curvature off 67% | 13 forms | - | - | - |
| 1280-1364 | corner, bank under 45°; 5 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | corner: pieces every ~5 m, bank at start | heading 9.4 ° (tol 3); also position 4.4m, pitch 5.7°, width 2.8m, peak curvature off 56% | 13 forms | - | - | - |
| 1364-1433 | tight corner, bank under 45°, steep (pitch 30° or more); 9 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | corner: pieces every ~10 m | heading 13.3 ° (tol 3); also position 11.7m, pitch 5.2°, peak curvature off 30%, peak roll rate off 0.9 °/m | 13 forms (1 refused by name) | - | - | - |
| 1433-1514 | corner, bank under 45°; 5 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | corner: pieces every ~5 m, bank at start | pitch 5.2 ° (tol 2); also position 5.1m, heading 7.2°, width 2.4m, peak curvature off 72% | 13 forms | - | - | - |
| 1514-1682 | tight corner, bank under 45°, steep (pitch 30° or more); 5 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | corner: pieces every ~5 m, bank at start | pitch 16.6 ° (tol 2); also position 9.2m, heading 19.3°, width 2.1m, peak curvature off 59% | 13 forms | - | - | - |
| 1682-1740 | tight corner, bank under 45°; 2 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | rate: pieces every ~5 m | heading 4.3 ° (tol 3) | 13 forms | - | - | - |
| 1740-1805 | corner, banked 45-100° | yes | - | corner: pieces every ~5 m | heading 2.1 ° (tol 3) | 13 forms | corner: pieces every ~5 m | 10 | no |
| 1805-1845 | corner, bank under 45°, fast roll (1.8 °/m or more) | no | peak curvature misses by 2.8x its tolerance (also bank 1.2x), position held (1.0 m) | corner: pieces every ~5 m, bank at start | bank 6.0 ° (tol 5); also peak curvature off 57% | 13 forms | - | - | - |
| 1845-2154 | corner, bank under 45° | no | peak curvature misses by 1.9x its tolerance (also heading 1.4x), position held (1.7 m) | corner: pieces every ~5 m, bank at start | heading 4.3 ° (tol 3); also peak curvature off 38% | 13 forms (1 refused by name) | - | - | - |
| 2154-2318 | corner, banked 45-100° | no | marginal: heading 1.12x, within 1.5x tolerance, position held (1.4 m) | corner: pieces every ~10 m, bank at start | heading 3.3 ° (tol 3) | 13 forms | - | - | - |
| 2318-2447 | tight corner, banked 45-100° | yes | - | corner: pieces every ~5 m | heading 2.5 ° (tol 3) | 13 forms (1 refused by name) | corner: pieces every ~5 m | 18 | no |
| 2447-2555 | tight corner, bank under 45° | no | marginal: heading 1.31x, within 1.5x tolerance, position held (0.9 m) | corner: pieces every ~5 m | heading 3.9 ° (tol 3) | 13 forms | - | - | - |
| 2606-2775 | tight corner, banked 45-100°; 4 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | corner: pieces every ~5 m, bank at start | pitch 21.7 ° (tol 2); also position 8.4m, heading 5.8°, width 3.8m | 13 forms (1 refused by name) | - | - | - |
| 2775-2836 | tight corner, bank under 45°, fast roll (1.8 °/m or more) | no | marginal: width 1.25x, within 1.5x tolerance, position held (1.0 m) | corner: pieces every ~10 m | width 2.5 m (tol 2) | 13 forms | - | - | - |
| 2836-2964 | corner, banked 45-100° | no | a kink in the read's centre the built road does not follow (peak curvature off 54%, 2.7x its tolerance); inferred read-side, not checked here | corner: pieces every ~5 m, bank at start | heading 2.6 ° (tol 3); also peak curvature off 54% | 13 forms | - | - | - |
| 2964-3172 | corner, banked past 100°, steep (pitch 30° or more) | no | pitch misses by 2.5x its tolerance, position held (1.3 m) | corner: pieces every ~5 m, bank at start | pitch 4.9 ° (tol 2) | 13 forms (1 refused by name) | - | - | - |
| 3172-3239 | corner, banked past 100° | no | pitch misses by 2.6x its tolerance, position held (0.9 m) | corner: pieces every ~5 m, bank at start | pitch 5.2 ° (tol 2) | 13 forms | - | - | - |
| 3239-3343 | corner, banked 45-100°, steep (pitch 30° or more) | yes | - | corner: pieces every ~5 m | pitch 1.6 ° (tol 2) | 13 forms (1 refused by name) | corner: pieces every ~5 m | 15 | no |
| 3343-3405 | tight corner, banked past 100°, steep (pitch 30° or more), fast roll (1.8 °/m or more) | no | marginal: bank 1.30x, within 1.5x tolerance, position held (1.0 m) | corner: pieces every ~5 m, bank at start | bank 6.5 ° (tol 5) | 13 forms | - | - | - |
| 3405-3472 | tight corner, banked past 100°, steep (pitch 30° or more), fast roll (1.8 °/m or more) | yes | - | corner: pieces every ~10 m | bank 4.8 ° (tol 5) | 13 forms | corner: pieces every ~10 m | 7 | no |
| 3472-3607 | tight corner, banked past 100°, steep (pitch 30° or more), fast roll (1.8 °/m or more) | yes | - | rate: pieces every ~10 m | bank 4.4 ° (tol 5) | 13 forms (1 refused by name) | rate: pieces every ~10 m | 13 | no |
| 3607-3750 | tight corner, bank under 45° | no | marginal: heading 1.01x, bank 1.00x, within 1.5x tolerance, position held (1.9 m) | corner: pieces every ~5 m, bank at start | heading 3.0 ° (tol 3); also bank 5.0° | 13 forms | - | - | - |
| 3750-3974 | corner, bank under 45° | yes | - | corner: pieces every ~10 m | heading 2.2 ° (tol 3) | 13 forms (1 refused by name) | corner: pieces every ~10 m | 19 | no |
| 3974-4019 | corner, bank under 45° | yes | - | pieces every ~40 m | width 1.7 m (tol 2) | 13 forms | pieces every ~40 m | 2 | no |
| 4019-4101 | tight corner, banked 45-100° | yes | - | corner: pieces every ~5 m | width 1.7 m (tol 2) | 13 forms | corner: pieces every ~5 m | 12 | no |
| 4101-4204 | corner, bank under 45° | no | a kink in the read's centre the built road does not follow (peak curvature off 29%, 1.5x its tolerance); inferred read-side, not checked here | rate: pieces every ~10 m | width 1.9 m (tol 2); also peak curvature off 29% | 13 forms | - | - | - |

The jumps (reader d 660 and 2,471): **both made.** Each landing lies 0 m and 0° from the read's on every compared quantity. The Jump places a landing
anywhere, so this is by construction: it only says the pose was in range (pitch short of vertical, at least 1 m away).

**The counts.**
- checked (`t5_table.cjs` over `t5_lay.json`): road sections made **10 of 35**; road length made **1,239 of 4,057 m**; jumps **2 of 2**.
- inferred: against the stated 10.3 km lap, **about 1.2 km is shown made, 4.1 km measured, and about 6 km unread.**

## 4b. By hand or steered (the chair's addendum, 19:33:25Z, from [T3]'s 42 of 115)

**No route here steers.** Each of the 13 forms lays its pieces once, in one pass (`t5_lay.cjs` `layRoute`); nothing is measured against the read, undone
and re-laid. So every made section was made by hand in the chair's sense, and none only by steering. This is read off the frozen v8 route log
(`t5_lay.json`, every form's pieces and verdict) by `t5_byhand.cjs`; nothing was re-run.

| section m | simplest route that made it | pieces | metres a piece | forms that made it (pieces) | STEERED |
|---|---|---|---|---|---|
| 294-479 | corner: pieces every ~5 m | 25 | 8 | 3 of 13: corner: pieces every ~5 m (25); rate: pieces every ~5 m (25); corner: pieces every ~5 m, bank at start (25) | no |
| 479-682 | corner: pieces every ~5 m | 26 | 9 | 2 of 13: corner: pieces every ~5 m (26); corner: pieces every ~5 m, bank at start (26) | no |
| 1740-1805 | corner: pieces every ~5 m | 10 | 9 | 2 of 13: corner: pieces every ~5 m (10); corner: pieces every ~5 m, bank at start (10) | no |
| 2318-2447 | corner: pieces every ~5 m | 18 | 8 | 2 of 13: corner: pieces every ~5 m (18); corner: pieces every ~5 m, bank at start (18) | no |
| 3239-3343 | corner: pieces every ~5 m | 15 | 8 | 3 of 13: corner: pieces every ~5 m (15); rate: pieces every ~5 m (15); corner: pieces every ~5 m, bank at start (15) | no |
| 3405-3472 | corner: pieces every ~10 m | 7 | 12 | 5 of 13: corner: pieces every ~10 m (7); corner: pieces every ~5 m (11); rate: pieces every ~5 m (11); corner: pieces every ~5 m, bank at start (11); corner: pieces every ~10 m, bank at start (7) | no |
| 3472-3607 | rate: pieces every ~10 m | 13 | 12 | 1 of 13: rate: pieces every ~10 m (13) | no |
| 3750-3974 | corner: pieces every ~10 m | 19 | 13 | 5 of 13: corner: pieces every ~10 m (19); corner: pieces every ~5 m (28); rate: pieces every ~5 m (28); corner: pieces every ~5 m, bank at start (28); corner: pieces every ~10 m, bank at start (19) | no |
| 3974-4019 | pieces every ~40 m | 2 | 33 | 10 of 13: pieces every ~40 m (2); pieces every ~20 m (3); rate: pieces every ~20 m (3); rate: pieces every ~10 m (5); corner: pieces every ~10 m (5); corner: pieces every ~5 m (7); rate: pieces every ~5 m (7); corner: pieces every ~5 m, bank at start (7); corner: pieces every ~10 m, bank at start (5); pieces every ~40 m, flowing bank marks every ~10 m (2) | no |
| 4019-4101 | corner: pieces every ~5 m | 12 | 9 | 2 of 13: corner: pieces every ~5 m (12); corner: pieces every ~5 m, bank at start (12) | no |

- checked (`node t5_byhand.cjs ./t5_lay.json`): **made by hand: 10 sections, 1,239 m. Made only by steering: 0.** Jumps by hand: 2 of 2. Each is one
  take-off piece, Jump with the landing typed in its boxes, and a landing piece; nothing re-laid.
- **The simplest route** is the made form with the fewest pieces, ties to the earlier in the list. **Pieces** are counted as laid, including the 10 m
  lead-in and run-out. **Metres a piece** is (section + 20 m) / pieces.
- **"~5 m" pieces come out at 8-9 m.** A cut can only fall on a read station, and the stations are spaced 4.09 m (median); checked, `t5_profile.json`.
- **Only one section (3974-4019, 2 pieces) was made by anything as coarse as ~20-40 m pieces.** 7 of 10 need 10-26 pieces at 8-9 m. Before he can
  type them, he needs the read's numbers at every cut: turn, climb, bank and width, all taken from the read at those stations. So "by hand" here means
  typed and not steered, not laid by eye.
- **One setup is not the panel's.** The first piece of each laid run arrives at the read's turn rate, climb rate, bank and width (`opts.first` set by the
  harness, `t5_lay.cjs` layRoute). On an empty track the panel would send the typed targets there. inferred: this has little weight, because the
  comparison starts after a 10 m lead-in, and on a track built continuously the road arrives at those rates from the piece before. It is not tested.

## 5. The classes not made, in plain words

1. **A one-sided width step.** The road widens by 3 to 3.5 m on one side within about 5 m, so its centre steps sideways. The builder's width is one
   number, symmetric about its line. Its line therefore runs smooth where the centre kinks: on flat road that shows as heading, and on road banked past
   100° (where the width runs nearly vertical) as pitch.
   - checked at 3,171 m: the width goes from 19.1 to 22.6 m in one station and reaches 25.7 m by 3,184 m. In the same 4.6 m the read's pitch swings by 13.8°
     while the built road, within 1.8 m of position, changes smoothly. This makes 2964–3172 and 3172–3239 one place, pitch off 4.9–5.2° (2.5–2.6×).
   - checked at 56–60 m: the road widens by 1.5 m on the left and 0.75 m on the right (level down-ray extents); 0–60 fails on the centre's kink only.
   - inferred, not checked: the same at 1845–2154, 2836–2964 and 4101–4204.
   - **Routes:** the 13 Extend forms above, and (order 1, section 5b) the three sideways controls the panel has: Grab pressed at the centre, Grab
     pressed on the rim (over Extend at the narrow width), and Grab-side with Grab-up. Each was run at radius 10 and 20 m, with up to 12 and up to 30
     drags: 72 sideways runs, **none made.** Extend has no lateral or one-sided width field (`app/core/panel.js:205`). The core's lateral channel
     (`src/core/document.js:29-31`, `l`; applied in `src/core/adapter.js:672`) is reached only by these drags (`app/core/panel.js:1219`,
     `app/core/coreshell.js:172`).
   - **Still "this form did not", not "cannot":** the Bend tool and the Smooth tool were not tried. Neither was any drag policy other than "the worst
     station next", nor radii other than 10 and 20 m.
2. **The read, not the builder: 778–1,740 m and 2,606–2,775 m** (1,131 m across 11 sections). The road there is cupped and banked, and `crossSection`
   loses it.
   - checked at 856 m: the down-rays find 16.5 m of continuous road where `crossSection` read 1.7 m.
   - **checked, the cause (order 2's groundwork, `t5_cswhy.cjs`, `t5_across2.cjs`):** the road has a second road surface about 0.35 m under the top
     one, and in places a third about 1.2 m down (every world-down ray at 868 m meets 2 or 3 layers). `crossSection` steps 0.5 m across and probes
     from 0.6 m above the last point, along its normal. Where the cup turns up faster than that (the cross slope runs 16° to 50° across 15 m), the
     probe starts under the top surface. It lands on a lower layer and stops where that layer ends. At 819–850 m each stopped side had road 0.2 to
     2.2 m above its last point. A ray straight down from above meets the top surface first, which is why the down-ray re-read works there.
   - Of the stations the re-read could not take, 44 remain in total (the 2 to 9 per section in the table are among them). The centre mixes two methods.
   - Its misses (4–12 m of position) mostly measure that, so **no builder class is drawn there.**
   - The cup itself is a builder channel (the panel's cup field). I did not send it, because the packet's compared list has no cross-section shape.
3. **Fast roll is not a class on this evidence.** 1805–1845 and 3343–3405 miss bank by 6.0–6.5° (1.2–1.3×) at roll rates of 1.8 °/m or more, with
   position within 1.0 m. But 3405–3472 and 3472–3607 roll as fast, wind the bank past 180°, and were made (bank within 4.4–4.8°).
4. **Marginal (heading 1.01–1.44×, width 1.25×), no class:** 60–236, 236–294, 2154–2318, 2447–2555, 2775–2836, 3607–3750.

## 5b. The one-sided width step laid sideways (order 1, 2026-11-26T19:44:28Z)

**How.**
- **The builder:** `C:\Consonance\t180-wt-e-rightwards-base`, at ceb21f5, the base the chair named. Its one uncommitted change is a test file from my
  Part 1 red row (`app/test/texture-page.test.js`), which no run here loads.
- **The base:** each section's base is the v8 Extend form with the lowest largest ratio, laid exactly as before (`t5_lay.cjs`, now loaded as a
  library; its run is unchanged, and its v8 copy is kept).
- **The drags:** they go through the shell's own calls, as the panel makes them (`app/core/coreshell.js`): `adopt`, `setSculpt(true)`, then per drag
  `beginFollow` (Grab) or `beginBrush({ tool: 'grab-side' | 'grab-up' })`, one `brushTo`, `endBrush`. The Grab's set comes from
  `app/core/zonegrab.js` `follow(delta, frameAt(…))`, which is what the panel computes from the pointer.
- **The policy:** each drag goes at the station where the built road is now furthest from the read. It is set once to the read's offset there and
  never undone. This is measured before each drag, which is what dragging by eye does, but it is not STEERED in the chair's sense (nothing is
  re-laid). The drags stop at 12 (or 30), or when nothing is off by more than 0.3 m.
- checked, the tools do what is asked (`t5_side_check.cjs`, a 200 m straight, one 1.5 m drag at r 10 m): Grab-side and Grab at the centre move the
  centre 1.50 m. A rim press widens the road 1.52 m on the pressed side and moves the centre 0.75 m. Nothing moves 30 m away. The same holds banked
  at 60°.

| section m | base (Extend), its worst | sideways route | cap 12: drags (pieces), worst, what fails | cap 30: drags (pieces), worst, what fails | made? |
|---|---|---|---|---|---|
| 0-60 | corner: pieces every ~5 m, bank at start (9 pieces), 4.11x (peak curvature) | Grab centre r 10 m | 12 (9 pieces), 2.18x, peak curvature | 30 (9 pieces), 2.26x, heading, bank, peak curvature | no |
| 0-60 | corner: pieces every ~5 m, bank at start (9 pieces), 4.11x (peak curvature) | Extend narrow, Grab rim r 10 m | 2 (9 pieces), 1.26x, heading | 2 (9 pieces), 1.26x, heading | no |
| 0-60 | corner: pieces every ~5 m, bank at start (9 pieces), 4.11x (peak curvature) | Grab-side + Grab-up r 10 m | 12 (9 pieces), 2.19x, peak curvature | 30 (9 pieces), 2.1x, heading, peak curvature | no |
| 0-60 | corner: pieces every ~5 m, bank at start (9 pieces), 4.11x (peak curvature) | Grab centre r 20 m | 12 (9 pieces), 2.13x, heading, peak curvature | 30 (9 pieces), 3.22x, heading, peak curvature | no |
| 0-60 | corner: pieces every ~5 m, bank at start (9 pieces), 4.11x (peak curvature) | Extend narrow, Grab rim r 20 m | 1 (9 pieces), 3.04x, heading, peak curvature | 1 (9 pieces), 3.04x, heading, peak curvature | no |
| 0-60 | corner: pieces every ~5 m, bank at start (9 pieces), 4.11x (peak curvature) | Grab-side + Grab-up r 20 m | 12 (9 pieces), 2.17x, heading, peak curvature | 30 (9 pieces), 3.22x, heading, peak curvature | no |
| 1845-2154 | corner: pieces every ~10 m, bank at start (27 pieces), 1.63x (heading, width, peak curvature) | Grab centre r 10 m | 12 (27 pieces), 5.57x, heading, pitch, width, peak curvature | 30 (27 pieces), 3.79x, heading, width, peak curvature | no |
| 1845-2154 | corner: pieces every ~10 m, bank at start (27 pieces), 1.63x (heading, width, peak curvature) | Extend narrow, Grab rim r 10 m | 12 (27 pieces), 10.29x, heading, pitch, width, peak curvature | 30 (27 pieces), 10.29x, heading, pitch, width, peak curvature | no |
| 1845-2154 | corner: pieces every ~10 m, bank at start (27 pieces), 1.63x (heading, width, peak curvature) | Grab-side + Grab-up r 10 m | 12 (27 pieces), 5.02x, heading, width, peak curvature | 32 (27 pieces), 5.02x, heading, width, peak curvature | no |
| 1845-2154 | corner: pieces every ~10 m, bank at start (27 pieces), 1.63x (heading, width, peak curvature) | Grab centre r 20 m | 12 (27 pieces), 1.51x, heading, width | 30 (27 pieces), 2.58x, heading, width, peak curvature | no |
| 1845-2154 | corner: pieces every ~10 m, bank at start (27 pieces), 1.63x (heading, width, peak curvature) | Extend narrow, Grab rim r 20 m | 12 (27 pieces), 4.09x, heading, pitch, width | 20 (27 pieces), 4.09x, heading, pitch, width | no |
| 1845-2154 | corner: pieces every ~10 m, bank at start (27 pieces), 1.63x (heading, width, peak curvature) | Grab-side + Grab-up r 20 m | 12 (27 pieces), 2.29x, heading, width | 33 (27 pieces), 3.03x, heading, width, peak curvature | no |
| 2836-2964 | corner: pieces every ~10 m, bank at start (11 pieces), 2.71x (heading, width, peak curvature) | Grab centre r 10 m | 12 (11 pieces), 1.11x, width | 17 (11 pieces), 1.49x, width, peak curvature | no |
| 2836-2964 | corner: pieces every ~10 m, bank at start (11 pieces), 2.71x (heading, width, peak curvature) | Extend narrow, Grab rim r 10 m | 12 (11 pieces), 2.73x, position, heading, pitch, peak curvature, peak roll rate | 15 (11 pieces), 2.73x, position, heading, pitch, peak curvature, peak roll rate | no |
| 2836-2964 | corner: pieces every ~10 m, bank at start (11 pieces), 2.71x (heading, width, peak curvature) | Grab-side + Grab-up r 10 m | 16 (11 pieces), 1.11x, width | 20 (11 pieces), 1.42x, width, peak curvature | no |
| 2836-2964 | corner: pieces every ~10 m, bank at start (11 pieces), 2.71x (heading, width, peak curvature) | Grab centre r 20 m | 12 (11 pieces), 2.59x, heading, pitch, width | 30 (11 pieces), 5.48x, position, heading, pitch, width, peak curvature | no |
| 2836-2964 | corner: pieces every ~10 m, bank at start (11 pieces), 2.71x (heading, width, peak curvature) | Extend narrow, Grab rim r 20 m | 10 (11 pieces), 2.83x, heading, pitch, width | 10 (11 pieces), 2.83x, heading, pitch, width | no |
| 2836-2964 | corner: pieces every ~10 m, bank at start (11 pieces), 2.71x (heading, width, peak curvature) | Grab-side + Grab-up r 20 m | 24 (11 pieces), 2.59x, heading, pitch, width | 60 (11 pieces), 5.48x, position, heading, pitch, width, peak curvature | no |
| 2964-3172 | corner: pieces every ~5 m, bank at start (26 pieces), 2.45x (pitch) | Grab centre r 10 m | 12 (26 pieces), 1.65x, pitch | 30 (26 pieces), 1.82x, pitch | no |
| 2964-3172 | corner: pieces every ~5 m, bank at start (26 pieces), 2.45x (pitch) | Extend narrow, Grab rim r 10 m | 12 (26 pieces), 11.27x, position, heading, pitch, bank, width, peak curvature, peak roll rate | 28 (26 pieces), 13.27x, position, heading, pitch, bank, peak curvature, peak roll rate | no |
| 2964-3172 | corner: pieces every ~5 m, bank at start (26 pieces), 2.45x (pitch) | Grab-side + Grab-up r 10 m | 13 (26 pieces), 1.65x, pitch | 31 (26 pieces), 1.65x, pitch | no |
| 2964-3172 | corner: pieces every ~5 m, bank at start (26 pieces), 2.45x (pitch) | Grab centre r 20 m | 12 (26 pieces), 1.36x, pitch | 30 (26 pieces), 1.37x, pitch | no |
| 2964-3172 | corner: pieces every ~5 m, bank at start (26 pieces), 2.45x (pitch) | Extend narrow, Grab rim r 20 m | 12 (26 pieces), 6.4x, position, heading, pitch, width | 14 (26 pieces), 6.08x, position, heading, pitch, width | no |
| 2964-3172 | corner: pieces every ~5 m, bank at start (26 pieces), 2.45x (pitch) | Grab-side + Grab-up r 20 m | 13 (26 pieces), 1.36x, pitch | 31 (26 pieces), 1.52x, pitch | no |
| 3172-3239 | corner: pieces every ~10 m (6 pieces), 2.33x (pitch, peak curvature) | Grab centre r 10 m | 9 (6 pieces), 1.36x, pitch | 9 (6 pieces), 1.36x, pitch | no |
| 3172-3239 | corner: pieces every ~10 m (6 pieces), 2.33x (pitch, peak curvature) | Extend narrow, Grab rim r 10 m | 12 (6 pieces), 14.47x, position, pitch, width, peak curvature | 12 (6 pieces), 14.47x, position, pitch, width, peak curvature | no |
| 3172-3239 | corner: pieces every ~10 m (6 pieces), 2.33x (pitch, peak curvature) | Grab-side + Grab-up r 10 m | 10 (6 pieces), 2.02x, pitch, peak curvature | 10 (6 pieces), 2.02x, pitch, peak curvature | no |
| 3172-3239 | corner: pieces every ~10 m (6 pieces), 2.33x (pitch, peak curvature) | Grab centre r 20 m | 12 (6 pieces), 1.94x, pitch, peak curvature | 30 (6 pieces), 3.35x, pitch, peak curvature | no |
| 3172-3239 | corner: pieces every ~10 m (6 pieces), 2.33x (pitch, peak curvature) | Extend narrow, Grab rim r 20 m | 7 (6 pieces), 7.73x, position, pitch, width, peak curvature | 7 (6 pieces), 7.73x, position, pitch, width, peak curvature | no |
| 3172-3239 | corner: pieces every ~10 m (6 pieces), 2.33x (pitch, peak curvature) | Grab-side + Grab-up r 20 m | 12 (6 pieces), 2.08x, pitch, peak curvature | 30 (6 pieces), 3.69x, pitch, peak curvature | no |
| 4101-4204 | rate: pieces every ~10 m (9 pieces), 1.45x (peak curvature) | Grab centre r 10 m | 12 (9 pieces), 3.77x, pitch, peak curvature | 30 (9 pieces), 6.62x, pitch, peak curvature | no |
| 4101-4204 | rate: pieces every ~10 m (9 pieces), 1.45x (peak curvature) | Extend narrow, Grab rim r 10 m | 12 (9 pieces), 19.96x, heading, pitch, peak curvature | 15 (9 pieces), 19.96x, heading, pitch, peak curvature | no |
| 4101-4204 | rate: pieces every ~10 m (9 pieces), 1.45x (peak curvature) | Grab-side + Grab-up r 10 m | 18 (9 pieces), 3.57x, pitch, peak curvature | 36 (9 pieces), 4.34x, pitch, peak curvature | no |
| 4101-4204 | rate: pieces every ~10 m (9 pieces), 1.45x (peak curvature) | Grab centre r 20 m | 12 (9 pieces), 4.09x, heading, pitch, peak curvature | 30 (9 pieces), 8.57x, heading, pitch, peak curvature | no |
| 4101-4204 | rate: pieces every ~10 m (9 pieces), 1.45x (peak curvature) | Extend narrow, Grab rim r 20 m | 8 (9 pieces), 3.15x, heading, pitch, peak curvature | 8 (9 pieces), 3.15x, heading, pitch, peak curvature | no |
| 4101-4204 | rate: pieces every ~10 m (9 pieces), 1.45x (peak curvature) | Grab-side + Grab-up r 20 m | 14 (9 pieces), 4.08x, heading, pitch, peak curvature | 33 (9 pieces), 8.95x, heading, peak curvature | no |

checked (`node t5_table2.cjs t5_table.md t5_lay.json t5_side_12.json t5_side_30.json`):
- **72 sideways runs, 0 made, 0 drags refused.** The nearest:
  - Grab centre r 10 m on 2836–2964: 12 drags, width 1.11×;
  - Grab-side + Grab-up r 10 m on the same section: 16 drags, width 1.11×;
  - Extend at the narrow width plus 2 Grab rim drags at r 10 m on 0–60: heading 1.26×.
- **What the runs show** (inferred from the table): a drag is a bump, zero outside its window. A width step that persists therefore needs a chain of
  drags, and the chain's falloffs add up. On 1845–2154, 4101–4204 and the rim route, more drags made it worse. On 2964–3239 (banked past 100°) the
  centre drags brought pitch from 2.45× to 1.36×, and no further. Whether a person could do better by eye with a different order is not tested.

**Updated counts:** unchanged. Road sections made 10 of 35, 1,239 of 4,057 m; all 10 by hand, none only by steering.

## 5c. Not read at all

*(Superseded by section 9: the rest of the lap is read and laid there.)*

- **past 4,204 m (reader d 4,038):** checked, a surface follower (`t5_follow.cjs`, 1 m steps by `crossSection` centres) went on 355 m past the stop,
  banking up to 52°, so the stop is the reader's, not the road's; **Corrected (section 7, 9c): the follower turned round; the stop is a ramp.**
- **the branch at reader d 2,471:** the reader took a jump, but checked, the same follower ran 309 m straight on, downhill, from the take-off; which
  branch the lap takes is not known (no AI line); **Corrected (section 7): the follower turned round here too; it is a jump, not a branch.**
- **the jump at reader d 660:** checked, no surface 1 m ahead of the take-off within 2 m of its plane, so it is a real jump.

## 6. The measure, version by version (the tolerances never moved)

| version | change | why |
|---|---|---|
| v1 | — | 1 section made |
| v2 | stations under 8 m wide were left out of every signal; a section no longer runs across a jump's chord; rate-mode routes added | one section had spanned the 660 m jump |
| v3 | one chord measure on both sides; bank compared wrapped | after the full roll the read winds to −360° and the built side counts from its own start |
| v4 | the laying inputs taken from good stations only | a good station beside a bad one took the bad one's centre into its tangent (pitch −23° at 800 m on road the down-rays show smooth) |
| v5 | the tangent is the slope of a quadratic fit over ±10 m | at 2,373 m the built road sat 0.07 m off the read, yet the chords disagreed by 4.3° |
| profile v2 | the down-ray re-read (section 2) | — |
| v6 | the jump pose measured from the built take-off; 5 m routes added | — |
| v7 | a 10 m lead-in and run-out | — |
| v8 | the bank "at start" route; the flowing-bank route corrected | — |

## 7. Corrections, mine

- **v2's catch counted the harness's own error as the builder's refusal.** A missing import came back as "refused" on every route. From v3, only the
  core's named refusals count, and anything else stops the run.
- **The flowing-bank route was wrong until v8.** With the flow box, the bank field is the first mark; I had sent the end value there, so the road banked
  to it at the first mark. Its misses of 33–121° were mine. Corrected, they are 2.7–22°.
- **The jump landing was first compared at the take-off sample** (a 48 m "miss"), and its pose was first measured from the read's take-off rather than
  the built one's.
- **Two inserted comments swallowed the code on their lines** (the follower's null guard, the compare's lookup), so two runs crashed; both fixed.
- **A figure carried over from before my context was compacted was wrong:** "0.1 m" for the 4,038 m landing. Re-run here it is 1.07 m.
- **Order 1's first run pressed off the road.** Its worst station was sometimes the run-out's last sample, just past the road's end. The shell refused
  those presses ("no road under the press") and I first read that as a refusal of the tool. From v2 the presses stay 1 m inside the road, and 0 drags
  are refused.
- **The first cap-12 run stopped after its first section, with no error.** Re-run in the foreground, it completed. Its cause was not found; the table
  is the completed run. **The cause, from the chair's interrupt (sent 19:51:01Z, delivered 20:15:29Z):** pane C's cleanup, matching "lay\.js", ended
  the process at about 19:51Z. checked: `t5_side_12.json` was written at 19:52:31Z (the re-run), and it holds 6 sections and 36 runs, as the cap-30
  file does. Order 1's commit `f2132a2` is from 19:54:08Z, so no re-run was needed.
- **A table cell first named the wrong quantity:** "bank misses by 2.8x" at 1805–1845 was the peak curvature's ratio (bank is 1.2×). The rule now names
  the largest ratio.

- **The follower turned round, twice, and I read it as road going on.** Section 5c said it "went on 355 m past the stop" at d 4,038 and "ran 309 m
  straight on" at the d 2,471 jump. Re-run with the nearest read station beside each step (`t5_follow2.cjs`), both run back along the read's own line
  within 2.1 m, heading the other way (dot −1.00), from 87 m and 34 m. So the stop at 4,038 is the road's (a ramp), and 2,471 is a jump, not a branch.
- **The 0-60 m kink was not the read's.** Section 4's "inferred read-side (a widening at 56-60 m, checked)" was a check of the heading near 56 m. The
  kink that still blocks the section is at 32 m, and both edges bend with the centre (0.84 and 1.65 of its curvature): the road turns. My table script
  also wrote that note on any section starting at 0 m, in any run; it is now limited to the first pass.
- **"A second road layer ~0.35 m under the top" (section 5) is the slab's own lower face, everywhere.** The misread at reader d 700-1,400 is the
  station sitting 1.44-1.66 m under the top (9b), checked against two stretches that read well.
- **`t5_lay.cjs` crashed on a cut run whose last row is a jump with no landing.** Such jumps are now skipped (v9); nothing else changed.
- **My first count of the seeded walks said 4 end at the d 7,030 take-off; it is 2,** and 3 more at d 10,086, the same jump on the read's second time
  round.

## 8. The packet's falsifier, as it stands

- *"…a class it names as 'cannot' is later laid by a route the hand-back did not try"*: **this hand-back names no "cannot".** Class 1 has now failed
  13 Extend forms and 3 sideways controls (section 5b). It names what remains untried: Bend, Smooth, other drag orders and other radii.
- *"…fewer than one unmade class per track … without a section-by-section table"*: [T5] has class 1 and the read-blocked stretches, with the table.
- **Order 2, the whole lap as read (section 9d):** 71 sections in one table, with the read's misses apart from the builder's. Still no "cannot".
  The builder's classes on runs 2-4 are the same as on the first pass: one-sided width (7 sections lap-wide) and turns sharper than any form laid them
  (11). Plus quantity misses (10) and marginal ones (13).

## 9. Order 2 (chair, 2026-11-26T19:44:28Z): our own reader, then the rest of [T5]

### 9a. The reader branch (tier CHECK IT, rows red first)

- checked: `git ls-remote --heads origin reader-downray-e` → `dab271b1011ee0705fc7b9f324282bf711c4f350`, on base `ceb21f5`, made in my own worktree
  `C:\Consonance\t180-wt-e-reader`. Three files: `tools/piecewise.cjs`, `test/piecewise.test.js`, `CHANGELOG.md`. The tests use synthetic geometry
  only. The scans (keys, his address, the track's name) found 0 in the content.
- **`downBand`** (new, exported): rays straight down inside the station's cross-plane every 0.25 m, keeping every layer each ray passes. The band
  starts at the highest layer within 2.5 m over the station and follows, ray to ray, the layer nearest in height; it ends where no layer lies within
  1 m. Width is the 3-D length along the band. `meshCentreline` uses it where `crossSection` reads under half the read's own `width`, or finds
  nothing, and takes it when it reads wider. A read with no `width` is walked as before.
- **The landing guard** (`meshCentreline`): when a jump's landing lies within 20 m of a station taken before the take-off, the line ends at the
  take-off. The jump is listed in `falseLandings` (take-off d, landing d, the driven station's d, the distance). The command line prints
  `rereadByDownRays` and `falseLandings`.
- checked, red first: `node --test test/piecewise.test.js`, the 4 new rows run before the code existed:
  - the stacked-layer row read **1.99 m** (the strip, against 18);
  - the guard row failed with "the line runs past the take-off";
  - the other two failed because `falseLandings` was undefined.

  With the code: **15 of 15 pass.** What the four rows test:
  - a station on a 2 m strip 1.5 m under cupped road reads 18 m wide, with its centre on the top;
  - a road 3.5 m over the cup is not taken, and a read without a width is left as walked;
  - a jump that "lands" on its own earlier road ends the line at the take-off;
  - a jump onto new road is kept.
- checked: who uses what changed (`grep -rn piecewise` over the repo). `crossSection` and `meshCentreline` are used only by the command line and
  `test/piecewise.test.js`. Shipped code takes `basis`, `basisN`, `bandChol` and `denseSolve`, which did not change.
- checked, on the [T5] reads (local, summary only): `tools/piecewise.cjs` on the original read now reports:
  - `falseLandings` 1: take-off d 4,038, landing d 4,126 on road the read took at d 1,320, 1.1 m off;
  - `rereadByDownRays` 15.

  The original read and the scratch read (v3) now give the same line: 978 stations, lap 4,401.4 m.

**What the guard does not settle, found after it was written (9c).** At d 4,038 the landing it refuses may be the lap's own route: the same road,
driven back the other way. The guard ends the line and says where; it does not choose between two landings. That choice is the reader's, in the
skill's `read_track.cjs`, outside the builder repo. 9c shows that is where the read actually went wrong: at d 7,030 it had new road in reach and
landed on old road.

### 9b. Why the cross-section read narrow (checked, with a control)

- checked (`t5_layers.cjs`, world-down rays ±4 m at each station): the road is a slab, a top face with a second face about 0.35 m under it.
  - On stretches that read well, the read's station sits **0.28-0.82 m under the top** (reader d 300-600 and 3,400-3,700).
  - The return run along the same corridor sits **0.30-0.41 m** under it.
  - At reader d **700-1,400** the first pass sat **1.44-1.66 m under the top**, below the slab. At several of those stations no surface lies
    under it at all.

  The cross-section walked from there, and those stations are the read's 10 flagged sections at 778-1,740 m.
- So the "second road layer" in section 5 was the slab's own lower face, and the misses there are the read's, not the road's.

### 9c. The rest of [T5]: how it was read

- checked: **the road area** (`t5_cover.cjs`, every road triangle) is 599,197 m².
  - The read's first pass covers 240,230 m² over 4,401 m: **about 55 m² per metre**, walls and banks included.
  - The original read's new run covers 141,404 m² over 2,348 m: about 60 m² per metre.
  - **217,563 m² lies within 12 m of no read station: about 3.8 km at 57 m² a metre.** Nearly all of it is one connected piece, from 67 m under
    to 65 m over the ramp's height.
- checked: **12 walks of a scratch copy of the reader, seeded in that piece** (`walker/read_seed.cjs`). Six points spread through it, each walked
  both ways; a walk stops when it comes within 6 m of a station of the original read.
  - **Every walk that goes one way ends at the original read's d 7,030 take-off, by a 61 m jump.** That is 2 walks; 3 more reach the same jump at
    d 10,086, the read's second time round.
  - **Every walk that goes the other way ends at the read's start, by a 41 m jump** (5 walks), heading the read's own way (dot 0.87-1.00). Seed 0,
    walked to the start, covers **3,591 m**.
  - Seed 3's two walks ended at d 6,122 (after the 61 m and 45 m jumps) and at d 3,048 (after the 41 m jump and a 113 m one).
    inferred: they passed the two join points more than 6 m off, the stop's radius.
- checked: so the original read went wrong **at d 7,030**. It landed on its own first-pass road at d 1,392 and went round again; the seeded walks
  land the same jump on the unread road, which runs to the start.
- checked: the follower's "355 m on past the stop" (section 5c) **turned round**. From 87 m on it runs 0.1-2.1 m off the read's own line, heading
  the other way (dot −1.00).
- checked: nothing lies ahead of the ramp at d 4,038 along its heading, for 400 m and within ±8 m. Down-rays find:
  - road 54-70 m over it;
  - road 55-75 m under it;
  - just beneath it, the corridor the read drove at d 755-1,320.

  The original read "landed" on that corridor, **85 m out and 35 m down**, and drove it back the other way (d 4,126-4,678) into the new run
  (d 4,682-7,030).
- inferred: **the lap**, in the order the reads join:
  1. the first pass, start to the ramp: 4,204 m of mesh arc; then the 85 m flight;
  2. back along the 755-1,320 corridor: 572 m;
  3. the new run: 2,447 m, with a 45 m jump; then the 61 m flight;
  4. the unread run to the start: 3,755 m, with a 41 m jump.

  **11.1 km of mesh arc, against the stated 10.3 km.** Run 2 drives road that run 1 drove, the other way. If the lap does not do that, the 0.6 km
  comes off and the total sits closer to the stated length, but then nothing on disk joins the ramp to the new run. **The route through the ramp
  is open** (there is no AI line). Its falsifier: an AI line, or a replay, that goes from the ramp anywhere but back along that corridor.

### 9d. The rest of [T5]: laid with the same packet

Everything is as before:
- the profile (`t5_profile.cjs`, now on the reader branch's `meshCentreline`);
- the sections, the 13 forms and the tolerances;
- the table rules (`t5_lay.cjs`, `t5_table.cjs`).

Two scratch fixes, both recorded in section 7. The **whose** column keeps the read's misses apart from the builder's:
- **reader, checked:** the read could not take 2 or more stations of the section;
- **builder:** a quantity misses by more than 1.5× its tolerance;
- **builder, marginal:** a quantity misses within 1.5× its tolerance;
- **kinks** (a curvature peak the built road does not follow) are now sorted by `t5_kink.cjs`, not inferred. At the lay's own peak station, found
  by its own `curvAt`, it compares the curvature of each road edge with the centre's:
  - the centre bends while both edges stay smooth (each under half the centre's): **the read's**;
  - one edge bends and the other is smooth: **a one-sided width change**, the builder's class from section 5b;
  - both edges bend (each at least half the centre's): **the road turns** that sharply.

  **0 of 18 kinks were the centre alone.** The 0.5 cut is mine, set before the run; each row carries its ratios.

**Per run:**

| run | sections made | metres made (of sections) | reader, checked | builder | builder, marginal | builder: one-sided width (kink) | builder: the road turns (kink) | kink, unsorted | jumps |
|---|---|---|---|---|---|---|---|---|---|
| first pass (reader d 0-4,038) | 10 of 35 | 1239 of 4057 | 11 (1131 m) | 4 (624 m) | 7 (772 m) | 1 (103 m) | 2 (188 m) | 0 | made, made |
| return along the 755-1,320 corridor (orig. read d 4,126-4,678) | 0 of 1 | 0 of 572 | 0 | 0 | 0 | 0 | 1 (572 m) | 0 | - |
| new run (orig. read d 4,682-7,030) | 3 of 16 | 437 of 2396 | 0 | 4 (452 m) | 2 (571 m) | 3 (531 m) | 4 (405 m) | 0 | made |
| unread run (seeded walk, to the start) | 6 of 19 | 1054 of 3709 | 0 | 2 (430 m) | 4 (1515 m) | 3 (375 m) | 4 (335 m) | 0 | made |


- inferred from the rows above:
  - **sections made: 19 of 71**, 2,730 of 10,734 m of sections;
  - **jumps:** 4 laid and all 4 made; 2 flights not laid. At d 4,038 the landing is open; at d 7,030 the take-off and the landing sit in different
    runs here.
- **the read's misses:** 11 sections, 1,131 m, all on the first pass. 9b gives the cause for the 10 at 778-1,740 m; the one at 2,606-2,775 m is
  not explained here. Beyond the sections, the read chose the wrong landing at d 7,030, and the route at d 4,038 is left open. **Nothing on
  runs 2-4 is the read's.**
- **the builder's misses:** 41 sections, 6,873 m:
  - 10 past 1.5× a tolerance (1,506 m);
  - 13 marginal (2,858 m);
  - 7 one-sided width changes (1,009 m);
  - 11 where the road turns sharper than any form laid it (1,500 m).
- **made by hand:** all 19, none steered (`t5_byhand.cjs` on each run).

**The table, section by section.** Columns: the run; the section's metres along its run; its metres along the inferred lap; class; made; whose;
what blocks it; the simplest route that made it; its pieces; STEERED.

| run | section m (run) | lap m | class | made? | whose | what blocks it | simplest route that made it | pieces | STEERED |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0-60 | 0-60 | corner, bank under 45° | no | builder: the road turns (kink) | a curvature peak the built road does not follow (peak curvature off 82%, 4.1x its tolerance); checked: edges/centre curvature 0.84 and 1.65, widths 16.5/16.5/16.6 | - | - | - |
| 1 | 60-236 | 60-236 | corner, bank under 45° | no | builder, marginal | marginal: heading 1.34x, within 1.5x tolerance, position held (1.7 m) | - | - | - |
| 1 | 236-294 | 236-294 | corner, banked 45-100° | no | builder, marginal | marginal: heading 1.44x, within 1.5x tolerance, position held (1.1 m) | - | - | - |
| 1 | 294-479 | 294-479 | corner, banked 45-100° | yes | made | - | corner: pieces every ~5 m | 25 | no |
| 1 | 479-682 | 479-682 | corner, bank under 45° | yes | made | - | corner: pieces every ~5 m | 26 | no |
| 1 | 778-885 | 778-885 | tight corner, bank under 45°, steep (pitch 30° or more); 3 station(s) the read could not take | no | reader, checked | the read: stations it could not take; not attributed to the builder | - | - | - |
| 1 | 885-979 | 885-979 | corner, bank under 45°; 6 station(s) the read could not take | no | reader, checked | the read: stations it could not take; not attributed to the builder | - | - | - |
| 1 | 979-1085 | 979-1085 | corner, bank under 45°; 4 station(s) the read could not take | no | reader, checked | the read: stations it could not take; not attributed to the builder | - | - | - |
| 1 | 1085-1218 | 1085-1218 | corner, bank under 45°; 5 station(s) the read could not take | no | reader, checked | the read: stations it could not take; not attributed to the builder | - | - | - |
| 1 | 1218-1280 | 1218-1280 | corner, bank under 45°; 2 station(s) the read could not take | no | reader, checked | the read: stations it could not take; not attributed to the builder | - | - | - |
| 1 | 1280-1364 | 1280-1364 | corner, bank under 45°; 5 station(s) the read could not take | no | reader, checked | the read: stations it could not take; not attributed to the builder | - | - | - |
| 1 | 1364-1433 | 1364-1433 | tight corner, bank under 45°, steep (pitch 30° or more); 9 station(s) the read could not take | no | reader, checked | the read: stations it could not take; not attributed to the builder | - | - | - |
| 1 | 1433-1514 | 1433-1514 | corner, bank under 45°; 5 station(s) the read could not take | no | reader, checked | the read: stations it could not take; not attributed to the builder | - | - | - |
| 1 | 1514-1682 | 1514-1682 | tight corner, bank under 45°, steep (pitch 30° or more); 5 station(s) the read could not take | no | reader, checked | the read: stations it could not take; not attributed to the builder | - | - | - |
| 1 | 1682-1740 | 1682-1740 | tight corner, bank under 45°; 2 station(s) the read could not take | no | reader, checked | the read: stations it could not take; not attributed to the builder | - | - | - |
| 1 | 1740-1805 | 1740-1805 | corner, banked 45-100° | yes | made | - | corner: pieces every ~5 m | 10 | no |
| 1 | 1805-1845 | 1805-1845 | corner, bank under 45°, fast roll (1.8 °/m or more) | no | builder | peak curvature misses by 2.8x its tolerance (also bank 1.2x), position held (1.0 m) | - | - | - |
| 1 | 1845-2154 | 1845-2154 | corner, bank under 45° | no | builder | peak curvature misses by 1.9x its tolerance (also heading 1.4x), position held (1.7 m) | - | - | - |
| 1 | 2154-2318 | 2154-2318 | corner, banked 45-100° | no | builder, marginal | marginal: heading 1.12x, within 1.5x tolerance, position held (1.4 m) | - | - | - |
| 1 | 2318-2447 | 2318-2447 | tight corner, banked 45-100° | yes | made | - | corner: pieces every ~5 m | 18 | no |
| 1 | 2447-2555 | 2447-2555 | tight corner, bank under 45° | no | builder, marginal | marginal: heading 1.31x, within 1.5x tolerance, position held (0.9 m) | - | - | - |
| 1 | 2606-2775 | 2606-2775 | tight corner, banked 45-100°; 4 station(s) the read could not take | no | reader, checked | the read: stations it could not take; not attributed to the builder | - | - | - |
| 1 | 2775-2836 | 2775-2836 | tight corner, bank under 45°, fast roll (1.8 °/m or more) | no | builder, marginal | marginal: width 1.25x, within 1.5x tolerance, position held (1.0 m) | - | - | - |
| 1 | 2836-2964 | 2836-2964 | corner, banked 45-100° | no | builder: the road turns (kink) | a curvature peak the built road does not follow (peak curvature off 54%, 2.7x its tolerance); checked: edges/centre curvature 0.66 and 1.68, widths 17.0/17.0/19.7 | - | - | - |
| 1 | 2964-3172 | 2964-3172 | corner, banked past 100°, steep (pitch 30° or more) | no | builder | pitch misses by 2.5x its tolerance, position held (1.3 m) | - | - | - |
| 1 | 3172-3239 | 3172-3239 | corner, banked past 100° | no | builder | pitch misses by 2.6x its tolerance, position held (0.9 m) | - | - | - |
| 1 | 3239-3343 | 3239-3343 | corner, banked 45-100°, steep (pitch 30° or more) | yes | made | - | corner: pieces every ~5 m | 15 | no |
| 1 | 3343-3405 | 3343-3405 | tight corner, banked past 100°, steep (pitch 30° or more), fast roll (1.8 °/m or more) | no | builder, marginal | marginal: bank 1.30x, within 1.5x tolerance, position held (1.0 m) | - | - | - |
| 1 | 3405-3472 | 3405-3472 | tight corner, banked past 100°, steep (pitch 30° or more), fast roll (1.8 °/m or more) | yes | made | - | corner: pieces every ~10 m | 7 | no |
| 1 | 3472-3607 | 3472-3607 | tight corner, banked past 100°, steep (pitch 30° or more), fast roll (1.8 °/m or more) | yes | made | - | rate: pieces every ~10 m | 13 | no |
| 1 | 3607-3750 | 3607-3750 | tight corner, bank under 45° | no | builder, marginal | marginal: heading 1.01x, bank 1.00x, within 1.5x tolerance, position held (1.9 m) | - | - | - |
| 1 | 3750-3974 | 3750-3974 | corner, bank under 45° | yes | made | - | corner: pieces every ~10 m | 19 | no |
| 1 | 3974-4019 | 3974-4019 | corner, bank under 45° | yes | made | - | pieces every ~40 m | 2 | no |
| 1 | 4019-4101 | 4019-4101 | tight corner, banked 45-100° | yes | made | - | corner: pieces every ~5 m | 12 | no |
| 1 | 4101-4204 | 4101-4204 | corner, bank under 45° | no | builder: one-sided width (kink) | a curvature peak the built road does not follow (peak curvature off 29%, 1.5x its tolerance); checked: edges/centre curvature 0.06 and 1.69, widths 19.7/17.0/16.8 | - | - | - |
| 2 | 0-572 | 4289-4861 | corner, bank under 45° | no | builder: the road turns (kink) | a curvature peak the built road does not follow (peak curvature off 25%, 1.2x its tolerance); checked: edges/centre curvature 0.92 and 1.12, widths 19.8/19.7/19.7 | - | - | - |
| 3 | 0-331 | 4861-5192 | corner, banked 45-100° | no | builder, marginal | marginal: width 1.24x, within 1.5x tolerance, position held (1.3 m) | - | - | - |
| 3 | 331-516 | 5192-5377 | corner, banked 45-100°, steep (pitch 30° or more) | no | builder: the road turns (kink) | a curvature peak the built road does not follow (peak curvature off 57%, 2.9x its tolerance); checked: edges/centre curvature 0.78 and 1.05, widths 16.9/17.1/16.8 | - | - | - |
| 3 | 516-621 | 5377-5482 | corner, bank under 45° | no | builder: one-sided width (kink) | a curvature peak the built road does not follow (peak curvature off 83%, 4.2x its tolerance); checked: edges/centre curvature 0.19 and 3.27, widths 16.8/16.8/18.8 | - | - | - |
| 3 | 621-934 | 5482-5795 | corner, bank under 45° | yes | made | - | corner: pieces every ~10 m | 26 | no |
| 3 | 934-1022 | 5795-5883 | corner, bank under 45° | no | builder | peak curvature misses by 2.9x its tolerance (also heading 1.5x), position held (1.1 m) | - | - | - |
| 3 | 1022-1125 | 5883-5986 | corner, bank under 45° | no | builder | width misses by 1.6x its tolerance (also heading 1.1x, peak curvature 1.5x), position held (1.0 m) | - | - | - |
| 3 | 1125-1381 | 5986-6242 | corner, banked 45-100° | no | builder: one-sided width (kink) | a curvature peak the built road does not follow (peak curvature off 37%, 1.9x its tolerance); checked: edges/centre curvature 0.19 and 1.06, widths 17.4/20.0/19.7 | - | - | - |
| 3 | 1381-1489 | 6242-6350 | corner, banked 45-100° | yes | made | - | rate: pieces every ~10 m | 10 | no |
| 3 | 1489-1595 | 6350-6456 | tight corner, bank under 45° | no | builder | heading misses by 3.5x its tolerance, position held (1.1 m) | - | - | - |
| 3 | 1646-1662 | 6507-6523 | corner, bank under 45° | yes | made | - | rate: pieces every ~20 m | 1 | no |
| 3 | 1662-1742 | 6523-6603 | corner, bank under 45° | no | builder: the road turns (kink) | a curvature peak the built road does not follow (peak curvature off 84%, 4.2x its tolerance); checked: edges/centre curvature 0.98 and 1.04, widths 16.8/16.8/16.9 | - | - | - |
| 3 | 1742-1912 | 6603-6773 | corner, bank under 45° | no | builder: one-sided width (kink) | a curvature peak the built road does not follow (peak curvature off 69%, 3.4x its tolerance); checked: edges/centre curvature 0.08 and 1.99, widths 16.8/17.1/20.0 | - | - | - |
| 3 | 1912-1962 | 6773-6823 | corner, bank under 45° | no | builder: the road turns (kink) | a curvature peak the built road does not follow (peak curvature off 62%, 3.1x its tolerance); checked: edges/centre curvature 0.95 and 1.07, widths 19.7/19.7/19.7 | - | - | - |
| 3 | 1962-2202 | 6823-7063 | tight corner, bank under 45° | no | builder, marginal | marginal: heading 1.14x, within 1.5x tolerance, position held (1.3 m) | - | - | - |
| 3 | 2202-2292 | 7063-7153 | corner, bank under 45° | no | builder: the road turns (kink) | a curvature peak the built road does not follow (peak curvature off 83%, 4.1x its tolerance); checked: edges/centre curvature 0.96 and 1.01, widths 16.8/17.0/17.0 | - | - | - |
| 3 | 2292-2447 | 7153-7308 | corner, bank under 45°; 1 station(s) the read could not take | no | builder | heading misses by 1.5x its tolerance, position held (1.5 m) | - | - | - |
| 4 | 0-65 | 7369-7434 | corner, bank under 45° | no | builder: the road turns (kink) | a curvature peak the built road does not follow (peak curvature off 88%, 4.4x its tolerance); checked: edges/centre curvature 0.67 and 1.70, widths 16.8/17.0/17.0 | - | - | - |
| 4 | 65-221 | 7434-7590 | corner, bank under 45° | no | builder, marginal | marginal: width 1.06x, within 1.5x tolerance, position held (2.0 m) | - | - | - |
| 4 | 221-399 | 7590-7768 | corner, banked 45-100° | yes | made | - | corner: pieces every ~5 m | 24 | no |
| 4 | 399-544 | 7768-7913 | corner, banked 45-100° | yes | made | - | corner: pieces every ~5 m | 20 | no |
| 4 | 544-667 | 7913-8036 | corner, bank under 45° | no | builder: one-sided width (kink) | a curvature peak the built road does not follow (peak curvature off 40%, 2.0x its tolerance); checked: edges/centre curvature 0.08 and 1.55, widths 19.7/17.0/16.9 | - | - | - |
| 4 | 667-790 | 8036-8159 | corner, bank under 45° | no | builder: the road turns (kink) | a curvature peak the built road does not follow (peak curvature off 78%, 3.9x its tolerance); checked: edges/centre curvature 0.61 and 1.35, widths 16.8/16.8/17.0 | - | - | - |
| 4 | 790-946 | 8159-8315 | tight corner, bank under 45°; 1 station(s) the read could not take | no | builder | width misses by 1.5x its tolerance (also heading 1.0x), position held (1.8 m) | - | - | - |
| 4 | 946-1050 | 8315-8419 | corner, bank under 45° | no | builder: the road turns (kink) | a curvature peak the built road does not follow (peak curvature off 91%, 4.6x its tolerance); checked: edges/centre curvature 0.96 and 0.99, widths 16.8/16.8/17.1 | - | - | - |
| 4 | 1050-1433 | 8419-8802 | corner, bank under 45° | yes | made | - | corner: pieces every ~5 m | 48 | no |
| 4 | 1433-1476 | 8802-8845 | corner, bank under 45° | no | builder: the road turns (kink) | a curvature peak the built road does not follow (peak curvature off 81%, 4.0x its tolerance); checked: edges/centre curvature 0.96 and 1.04, widths 19.7/19.7/19.7 | - | - | - |
| 4 | 1476-2468 | 8845-9837 | corner, banked 45-100° | no | builder, marginal | marginal: width 1.05x, within 1.5x tolerance, position held (1.0 m) | - | - | - |
| 4 | 2468-2638 | 9837-10007 | corner, banked 45-100°, steep (pitch 30° or more) | yes | made | - | corner: pieces every ~5 m | 23 | no |
| 4 | 2638-2850 | 10007-10219 | corner, bank under 45°, steep (pitch 30° or more) | no | builder: one-sided width (kink) | a curvature peak the built road does not follow (peak curvature off 59%, 3.0x its tolerance); checked: edges/centre curvature 0.01 and 2.07, widths 16.8/16.9/19.8 | - | - | - |
| 4 | 2850-2919 | 10219-10288 | tight corner, banked 45-100° | yes | made | - | corner: pieces every ~5 m | 11 | no |
| 4 | 2919-3126 | 10288-10495 | corner, banked 45-100° | no | builder, marginal | marginal: width 1.04x, within 1.5x tolerance, position held (1.3 m) | - | - | - |
| 4 | 3126-3400 | 10495-10769 | tight corner, bank under 45° | no | builder | heading misses by 6.9x its tolerance (also peak curvature 2.6x), position held (1.4 m) | - | - | - |
| 4 | 3446-3486 | 10815-10855 | corner, bank under 45° | no | builder: one-sided width (kink) | a curvature peak the built road does not follow (peak curvature off 87%, 4.4x its tolerance); checked: edges/centre curvature 0.30 and 1.97, widths 16.8/16.8/17.1 | - | - | - |
| 4 | 3486-3646 | 10855-11015 | tight corner, bank under 45°; 1 station(s) the read could not take | no | builder, marginal | marginal: width 1.33x, within 1.5x tolerance, position held (2.2 m) | - | - | - |
| 4 | 3646-3755 | 11015-11124 | straight, bank under 45° | yes | made | - | pieces every ~40 m | 3 | no |

## Scripts (scratch only, kept; their outputs are the other author's layout)

`C:\Users\nname\AppData\Local\Temp\claude\8e9709f509cfea85\a2122153-a37e-41a6-a86f-534267ec0565\scratchpad\t5\`:

| script | what it does |
|---|---|
| `t5_frame.cjs` | one measure of heading, pitch and bank on both sides, plus `fitTangent` |
| `t5_profile.cjs` | the mesh profile and the down-ray re-read |
| `t5_lay.cjs` | the sections, the 13 forms, the jumps, the compare; v1 to v7 kept beside it |
| `t5_table.cjs` | this table |
| `t5_byhand.cjs`, `t5_table2.cjs` | the by-hand columns, merged into section 4; the sideways table |
| `t5_side.cjs` | order 1: the sideways drags through the shell's calls (`t5_side_12.json`, `t5_side_30.json`); `t5_lay_v8.cjs` is the run it loads, before the library hook |
| `t5_side_check.cjs` | one drag of each tool on a synthetic straight |
| `t5_cswhy.cjs`, `t5_across2.cjs` | why `crossSection` stops early; every road layer under a station |
| `t5_follow.cjs`, `t5_gap.cjs`, `t5_long.cjs`, `t5_across.cjs`, `t5_sides.cjs` | the read checks |
| `walker/` | the scratch reader with the three landing guards |
| `t5_stop.cjs`, `t5_stop2.cjs`, `t5_ahead.cjs`, `t5_meshes.cjs` | what lies ahead of the ramp at d 4,038 |
| `t5_cstrace.cjs`, `t5_layers.cjs` | the cross-section's walk against the top surface; the layers over each station (9b) |
| `t5_cover.cjs`, `t5_seeds.json` | the road area, read and unread; the six seed points |
| `walker/read_seed.cjs`, `run_seeds.sh`, `seed_*.read.json` | the seeded reader and its 12 walks (9c) |
| `newrun.read.json`, `deck.read.json`, `unread.read.json` and their `_profile`, `_lay`, `_table` files | runs 2-4, laid (9d) |
| `t5_follow2.cjs` | the follower, with the nearest read station at each step |
| `t5_kink.cjs`, `*_kinks.txt` | the kink sort (9d) |
| `t5_final.cjs`, `t5_final.md` | the merged table (9d); `F1=85 F2=61 node t5_final.cjs` |

The reads are in the builder checkout's gitignored `reads/`.

Seat: pane E (machine D), sibling-07b8a48f.

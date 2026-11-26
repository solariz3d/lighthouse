# The unmakeable shapes, track [T5] (pane E, machine D, 2026-11-26)

**Order:** the chair, 18:51:35Z, Part 2: `exo_memory/loop/packet_t180_unmakeable_shapes_2026-11-26.md`, track [T5]. Research only, headless,
BelowNormal; nothing was launched. His words in the brief (12:48): *"There are points in each track that our system cannot currently make"*.

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

| section m (mesh arc) | class | made? | what blocks it | best form | worst difference (its tolerance) | routes tried |
|---|---|---|---|---|---|---|
| 0-60 | corner, bank under 45° | no | a kink in the read's centre the built road does not follow (peak curvature off 82%, 4.1x its tolerance); inferred read-side (a widening at 56-60 m, checked) | corner: pieces every ~5 m, bank at start | heading 2.1 ° (tol 3); also peak curvature off 82% | 13 forms |
| 60-236 | corner, bank under 45° | no | marginal: heading 1.34x, within 1.5x tolerance, position held (1.7 m) | corner: pieces every ~5 m, bank at start | heading 4.0 ° (tol 3) | 13 forms |
| 236-294 | corner, banked 45-100° | no | marginal: heading 1.44x, within 1.5x tolerance, position held (1.1 m) | corner: pieces every ~5 m | heading 4.3 ° (tol 3) | 13 forms |
| 294-479 | corner, banked 45-100° | yes | - | corner: pieces every ~5 m | width 1.5 m (tol 2) | 13 forms |
| 479-682 | corner, bank under 45° | yes | - | corner: pieces every ~5 m | heading 2.4 ° (tol 3) | 13 forms |
| 778-885 | tight corner, bank under 45°, steep (pitch 30° or more); 3 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | corner: pieces every ~5 m, bank at start | pitch 16.8 ° (tol 2); also position 4.9m, heading 5.5°, width 2.3m | 13 forms |
| 885-979 | corner, bank under 45°; 6 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | corner: pieces every ~10 m, bank at start | pitch 8.9 ° (tol 2); also position 8.9m, heading 12.7°, bank 11.3°, width 3.1m, peak curvature off 61% | 13 forms |
| 979-1085 | corner, bank under 45°; 4 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | corner: pieces every ~5 m, bank at start | pitch 3.5 ° (tol 2); also position 4.3m, heading 5.0°, peak curvature off 23% | 13 forms |
| 1085-1218 | corner, bank under 45°; 5 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | corner: pieces every ~5 m, bank at start | pitch 8.9 ° (tol 2); also position 10.2m, heading 7.0°, width 2.1m | 13 forms |
| 1218-1280 | corner, bank under 45°; 2 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | rate: pieces every ~10 m | heading 16.4 ° (tol 3); also position 9.1m, pitch 10.4°, width 2.2m, peak curvature off 68% | 13 forms |
| 1280-1364 | corner, bank under 45°; 5 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | corner: pieces every ~5 m, bank at start | heading 9.4 ° (tol 3); also position 4.4m, pitch 5.7°, width 2.8m, peak curvature off 56% | 13 forms |
| 1364-1433 | tight corner, bank under 45°, steep (pitch 30° or more); 9 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | corner: pieces every ~10 m | heading 13.3 ° (tol 3); also position 11.7m, pitch 5.2°, peak curvature off 31%, peak roll rate off 1.0 °/m | 13 forms (1 refused by name) |
| 1433-1514 | corner, bank under 45°; 5 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | corner: pieces every ~5 m, bank at start | pitch 5.2 ° (tol 2); also position 5.1m, heading 7.2°, width 2.4m, peak curvature off 73% | 13 forms |
| 1514-1682 | tight corner, bank under 45°, steep (pitch 30° or more); 5 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | corner: pieces every ~5 m, bank at start | pitch 16.6 ° (tol 2); also position 9.2m, heading 19.3°, width 2.1m, peak curvature off 59% | 13 forms |
| 1682-1740 | tight corner, bank under 45°; 2 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | rate: pieces every ~5 m | heading 4.3 ° (tol 3) | 13 forms |
| 1740-1805 | corner, banked 45-100° | yes | - | corner: pieces every ~5 m | heading 2.1 ° (tol 3) | 13 forms |
| 1805-1845 | corner, bank under 45°, fast roll (1.8 °/m or more) | no | peak curvature misses by 2.8x its tolerance (also bank 1.2x), position held (1.0 m) | corner: pieces every ~5 m, bank at start | bank 6.0 ° (tol 5); also peak curvature off 57% | 13 forms |
| 1845-2154 | corner, bank under 45° | no | peak curvature misses by 1.9x its tolerance (also heading 1.4x), position held (1.7 m) | corner: pieces every ~5 m, bank at start | heading 4.3 ° (tol 3); also peak curvature off 39% | 13 forms (1 refused by name) |
| 2154-2318 | corner, banked 45-100° | no | marginal: heading 1.12x, within 1.5x tolerance, position held (1.4 m) | corner: pieces every ~10 m, bank at start | heading 3.3 ° (tol 3) | 13 forms |
| 2318-2447 | tight corner, banked 45-100° | yes | - | corner: pieces every ~5 m | heading 2.5 ° (tol 3) | 13 forms (1 refused by name) |
| 2447-2555 | tight corner, bank under 45° | no | marginal: heading 1.31x, within 1.5x tolerance, position held (0.9 m) | corner: pieces every ~5 m | heading 3.9 ° (tol 3) | 13 forms |
| 2606-2775 | tight corner, banked 45-100°; 4 station(s) the read could not take | no | the read: stations it could not take; not attributed to the builder | corner: pieces every ~5 m, bank at start | pitch 21.7 ° (tol 2); also position 8.4m, heading 5.8°, width 3.8m | 13 forms (1 refused by name) |
| 2775-2836 | tight corner, bank under 45°, fast roll (1.8 °/m or more) | no | marginal: width 1.25x, within 1.5x tolerance, position held (1.0 m) | corner: pieces every ~10 m | width 2.5 m (tol 2) | 13 forms |
| 2836-2964 | corner, banked 45-100° | no | a kink in the read's centre the built road does not follow (peak curvature off 53%, 2.7x its tolerance); inferred read-side, not checked here | corner: pieces every ~5 m, bank at start | heading 2.6 ° (tol 3); also peak curvature off 53% | 13 forms |
| 2964-3172 | corner, banked past 100°, steep (pitch 30° or more) | no | pitch misses by 2.5x its tolerance, position held (1.3 m) | corner: pieces every ~5 m, bank at start | pitch 4.9 ° (tol 2) | 13 forms (1 refused by name) |
| 3172-3239 | corner, banked past 100° | no | pitch misses by 2.6x its tolerance, position held (0.9 m) | corner: pieces every ~5 m, bank at start | pitch 5.2 ° (tol 2) | 13 forms |
| 3239-3343 | corner, banked 45-100°, steep (pitch 30° or more) | yes | - | corner: pieces every ~5 m | pitch 1.6 ° (tol 2) | 13 forms (1 refused by name) |
| 3343-3405 | tight corner, banked past 100°, steep (pitch 30° or more), fast roll (1.8 °/m or more) | no | marginal: bank 1.30x, within 1.5x tolerance, position held (1.0 m) | corner: pieces every ~5 m, bank at start | bank 6.5 ° (tol 5) | 13 forms |
| 3405-3472 | tight corner, banked past 100°, steep (pitch 30° or more), fast roll (1.8 °/m or more) | yes | - | corner: pieces every ~10 m | bank 4.8 ° (tol 5) | 13 forms |
| 3472-3607 | tight corner, banked past 100°, steep (pitch 30° or more), fast roll (1.8 °/m or more) | yes | - | rate: pieces every ~10 m | bank 4.4 ° (tol 5) | 13 forms (1 refused by name) |
| 3607-3750 | tight corner, bank under 45° | no | marginal: heading 1.01x, bank 1.00x, within 1.5x tolerance, position held (1.9 m) | corner: pieces every ~5 m, bank at start | heading 3.0 ° (tol 3); also bank 5.0° | 13 forms |
| 3750-3974 | corner, bank under 45° | yes | - | corner: pieces every ~10 m | heading 2.2 ° (tol 3) | 13 forms (1 refused by name) |
| 3974-4019 | corner, bank under 45° | yes | - | pieces every ~40 m | width 1.7 m (tol 2) | 13 forms |
| 4019-4101 | tight corner, banked 45-100° | yes | - | corner: pieces every ~5 m | width 1.7 m (tol 2) | 13 forms |
| 4101-4204 | corner, bank under 45° | no | a kink in the read's centre the built road does not follow (peak curvature off 28%, 1.5x its tolerance); inferred read-side, not checked here | rate: pieces every ~10 m | width 1.9 m (tol 2); also peak curvature off 28% | 13 forms |

The jumps (reader d 660 and 2,471): **both made.** Each landing lies 0 m and 0° from the read's on every compared quantity. The Jump places a landing
anywhere, so this is by construction: it only says the pose was in range (pitch short of vertical, at least 1 m away).

**The counts.**
- checked (`t5_table.cjs` over `t5_lay.json`): road sections made **10 of 35**; road length made **1,239 of 4,057 m**; jumps **2 of 2**.
- inferred: against the stated 10.3 km lap, **about 1.2 km is shown made, 4.1 km measured, and about 6 km unread.**

## 5. The classes not made, in plain words

1. **A one-sided width step.** The road widens by 3 to 3.5 m on one side within about 5 m, so its centre steps sideways. The builder's width is one
   number, symmetric about its line. Its line therefore runs smooth where the centre kinks: on flat road that shows as heading, and on road banked past
   100° (where the width runs nearly vertical) as pitch.
   - checked at 3,171 m: the width goes from 19.1 to 22.6 m in one station and reaches 25.7 m by 3,184 m. In the same 4.6 m the read's pitch swings by 13.8°
     while the built road, within 1.8 m of position, changes smoothly. This makes 2964–3172 and 3172–3239 one place, pitch off 4.9–5.2° (2.5–2.6×).
   - checked at 56–60 m: the road widens by 1.5 m on the left and 0.75 m on the right (level down-ray extents); 0–60 fails on the centre's kink only.
   - inferred, not checked: the same at 1845–2154, 2836–2964 and 4101–4204.
   - **Routes:** the 13 forms above. **Not tried:** the Grab tool's follow drag, which can push the line sideways. The core has the lateral channel
     (`src/core/document.js:29-31`, `l`; applied in `src/core/adapter.js:672`), and the panel reaches it only through that drag (`app/core/panel.js:1219`).
     Extend has no lateral or one-sided width field (`app/core/panel.js:205`). **So this is "this form did not", not "cannot".** If the drag lays it,
     the gap is that Extend cannot.
2. **The read, not the builder: 778–1,740 m and 2,606–2,775 m** (1,131 m across 11 sections). The road there is cupped and banked, and `crossSection`
   loses it.
   - checked at 856 m: the down-rays find 16.5 m of continuous road where `crossSection` read 1.7 m.
   - Of the stations the re-read could not take, 44 remain in total (the 2 to 9 per section in the table are among them). The centre mixes two methods.
   - Its misses (4–12 m of position) mostly measure that, so **no builder class is drawn there.**
   - The cup itself is a builder channel (the panel's cup field). I did not send it, because the packet's compared list has no cross-section shape.
3. **Fast roll is not a class on this evidence.** 1805–1845 and 3343–3405 miss bank by 6.0–6.5° (1.2–1.3×) at roll rates of 1.8 °/m or more, with
   position within 1.0 m. But 3405–3472 and 3472–3607 roll as fast, wind the bank past 180°, and were made (bank within 4.4–4.8°).
4. **Marginal (heading 1.01–1.44×, width 1.25×), no class:** 60–236, 236–294, 2154–2318, 2447–2555, 2775–2836, 3607–3750.

**Not read at all:**
- **past 4,204 m (reader d 4,038):** checked, a surface follower (`t5_follow.cjs`, 1 m steps by `crossSection` centres) went on 355 m past the stop,
  banking up to 52°, so the stop is the reader's, not the road's;
- **the branch at reader d 2,471:** the reader took a jump, but checked, the same follower ran 309 m straight on, downhill, from the take-off; which
  branch the lap takes is not known (no AI line);
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
- **A table cell first named the wrong quantity:** "bank misses by 2.8x" at 1805–1845 was the peak curvature's ratio (bank is 1.2×). The rule now names
  the largest ratio.

## 8. The packet's falsifier, as it stands

- *"…a class it names as 'cannot' is later laid by a route the hand-back did not try"*: **this hand-back names no "cannot".** Class 1 names the untried
  route (the Grab drag) that could lay it.
- *"…fewer than one unmade class per track … without a section-by-section table"*: [T5] has class 1 and the read-blocked stretches, with the table.

## Scripts (scratch only, kept; their outputs are the other author's layout)

`C:\Users\nname\AppData\Local\Temp\claude\8e9709f509cfea85\a2122153-a37e-41a6-a86f-534267ec0565\scratchpad\t5\`:

| script | what it does |
|---|---|
| `t5_frame.cjs` | one measure of heading, pitch and bank on both sides, plus `fitTangent` |
| `t5_profile.cjs` | the mesh profile and the down-ray re-read |
| `t5_lay.cjs` | the sections, the 13 forms, the jumps, the compare; v1 to v7 kept beside it |
| `t5_table.cjs` | this table |
| `t5_follow.cjs`, `t5_gap.cjs`, `t5_long.cjs`, `t5_across.cjs`, `t5_sides.cjs` | the read checks |
| `walker/` | the scratch reader with the three landing guards |

The reads are in the builder checkout's gitignored `reads/`.

Seat: pane E (machine D), sibling-07b8a48f.

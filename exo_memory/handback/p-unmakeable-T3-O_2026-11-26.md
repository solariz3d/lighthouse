# [T3]: what the builder cannot make yet (pane O, 2026-11-26, research only)

Packet: `exo_memory/loop/packet_t180_unmakeable_shapes_2026-11-26.md`. Base: t180 `ceb21f5` (landing-1126), worktree
`G:/consonance-scratch/o-t3`, detached. No builder code changed. Nothing pushed. All track data stayed in `reads/` and my scratch.

## The count

- **115 of 119 sections made.**
- **Road made:** 20,354 of 21,578 m (94.3 %).
- **The jump:** made. With its 142.4 m chord counted, 20,496 of 21,720 m of the lap (94.4 %).
- **Not made:** four sections in three classes. Two of them are **panel gaps**: the core makes the shape, the panel cannot send it.
  The other two missed by 0.1° and 0.4° of heading, and nothing in the builder is named. Nothing is written as "cannot".

| class not made | sections | what blocks it | checked? |
|---|---|---|---|
| a landing on a down-grade that curves, after a jump | 100 | **Panel gap.** Jump always lays a 60 m straight landing (`src/core/jump.js:27` `LANDING_M`). The core takes `landingM` (`src/core/jump.js:55`), but the shell's `jumpFor` never passes it (`app/core/coreshell.js:408`). The read's pitch changes 2.3° over those 60 m. A straight can follow that only to 2.5–2.8° (bar 2°). | checked: with the core's `landingM` at 8 m and at 20 m, pitch is made |
| a descending helix: a road 32 m wide, banked 27–40°, passing over itself about 20 m higher | 102 | **Panel gap.** The pass check (`PASS_CLEARANCE`, `app/core/coreshell.js:475`) counts the default 2 m apron (`src/export/apron.js:52`) against the 3.1 m car margin (`src/validate/passclear.js:39`). The panel cannot send the document's `edgeApronM`. | checked: through the core with `edgeApronM` 0 the section is made (G8W worst 0.83, G8 0.76) |
| a tight banked bend, about 26–40 m radius | 46, 96 | **Nothing named in the builder.** Heading misses by 0.1° and 0.4°. It misses only at the apex stations, where the read's own smoothed heading leaves its 24 m chord by 2.8° and 2.9°. In 96 the read turns 5.4°, then 10.6°, then 4.2° over three 4 m stations. | inferred: read noise. "This form did not"; I do not call it a limit. |

What the four were not:
- **Section 100's leftover position miss** (5.8–6.3 m) sits in the first 10 m after the gap. It decays from 3.7 m at 4 m in to 0.5 m by 15 m. Both roads' smoothing is one-sided there: the read's landing station moves 5.21 m along the road under it. Inferred: the measuring, not the build.
- **Section 102 is not off the line.** At the pinch the built centres are 25.2 m apart in plan and 20.7 m in height. The read's are 25.5 m and 20.5 m. Checked.
- **The refusal on 102 comes from the cross-section.** At the pinch the builder's surface gap is 3.39 m, apron over apron, with a 1.52 m hull. The read's flat roads there are 9.3 m apart, without walls or apron. Checked. Whether the original's own walls come that close, I cannot see from the read. Inferred.

## Where the shape classes went

- **Every class was made at least once.** That includes:
  - the vertical loops (3 of 3 sections with pitch ≥ 60°);
  - every upside-down section (5 of 5);
  - every wall-banked section (5 of 5);
  - the steep sections.
- **Before any class is written as "cannot",** these were each first missed by one form and then made by another:
  - **Section 6, a 60 m tight bend:** every route matched its heading, but the peak curvature came out at 78–84 against 109 °/100 m. It is made by 4 m rate pieces that follow the read's curvature (K4).
  - **Sections 17 and 45:** made once the lay-in carried the roll already in progress, with 40 m laid before (17) or after (45) by the same route.
  - **The jump sections:** made once laid as he would lay them: steered road to the lip, Jump, the landing typed in its boxes, road on.

## The jump

The jump was laid with the panel's **Jump** button, then the six landing boxes (aria `landing forward`, `left`, `up`, `heading`,
`pitch`, `bank`).

The pose came from the read's stations either side of the gap, in the take-off's heading frame:
- forward 142.3 m, left 3.3 m, up +4.0 m;
- heading +0.8°, pitch −4.9°;
- the take-off ramp is at 8.5°.

The built flight's ends against the read: chord 0.00 m, height 0.00 m, heading 0.00°, pitch 0.00°, all inside the jump bar. Checked.

The reader's own label says "gap 133 m, drop 14 m". I did not reproduce it: the stations either side are 142.4 m apart and the
landing is 4.0 m *higher*. So the label measures something else. Inferred.

## How it was done

**The cut.**
- Every station gets a class from four signals, each smoothed over ±12 m:
  - turn: straight under 15 °/100 m, else left or right;
  - bank: flat under 12°, banked under 60°, wall under 110°, else upside down;
  - pitch: level under 4°, grade under 30°, steep under 60°, else vertical.
- A section starts where the class changes.
- A run under 60 m is absorbed by its longer neighbour, never across the jump.
- Metres along the lap are the arc length of the read's smoothed centreline (0 to 21,720, the flight's chord included). The read's own `d`
  runs 3.6 % short of it.

**The tolerances** were registered before any section was laid (local `tolerances.md`).
- Registered 18:57:33Z, sha256 `e1dbfb1e…3497`.
- Amendment 1 registered before the full run, 19:00:57Z, sha256 `c74747bc…d297d4`. It adds one shared smoothing for both roads:
  - a Gaussian with σ 8 m on position and up;
  - a ±12 m median on width.
- Why the amendment: the read re-centres on whole 1 m points. At the 8 m chord that alone moved its heading 2.2° at p50 and
  5.8° at p95, which is the whole 3° bar. After smoothing, the read's heading noise is 0.20° at p50 and 1.21° at p99.

| measure | bar |
|---|---|
| position | ≤ 5 m |
| heading | ≤ 3° |
| bank | ≤ 5° (the angle between the ups where \|pitch\| ≥ 60°) |
| pitch | ≤ 2° |
| elevation | ≤ 2 m |
| width | ≤ 2 m |
| edge angle | ≤ 4° |
| peak curvature | within 20 % or 10 °/100 m |
| peak roll rate | within 25 % or 0.15 °/m |
| jump | gap ≤ 5 m, drop ≤ 2 m, landing heading ≤ 3° |

**Changed after registration** (no bar changed):
1. **The cut's jump break.** It compared the marker's `d` with arc-length `s`, so it broke at the wrong place. Fixed: it now
   breaks at the gap in `d`. Three sections changed, and 120 became 119.
2. **The tangent at the gap.** The tangent's 8 m chord reached across the gap for the stations either side of the jump, on both
   roads. Fixed: a chord never spans a gap over 6 m. This changes only sections 99 and 100.
   - On the way I first misread it as the reader's edge stations being wrong. The raw heights show an 8–9° ramp right to the lip,
     and that reading was withdrawn.
3. **The lay-in.** Each section is laid on a fresh track:
   - its start pitch is set by one core call the panel does not send (`commitDoc` with `start.pitch`);
   - a 152 m lead piece typed through the panel then brings bank, width, cup and turn rate to the read's values;
   - the lead is not measured.

   Not measured either: the 40 m run-out, and the 40 m pre-runs and post-runs some routes add.

**The routes.** Every one goes through the panel's own fields, driven headless the way the panel drives the shell:
- the piece kind (`turn and climb as` corner or rate), length, turn, climb, bank, width, cup;
- extra rows and the bank flowing through marks;
- Jump and the landing boxes.

| route | what it lays |
|---|---|
| A | one corner piece for the whole section |
| C | corner pieces of about 60 m |
| D | rate pieces of about 60 m |
| E | one piece with extra turn rows at the thirds and the bank flowing through marks |
| F | rate pieces of about 20 m |
| G15, GW, G8W, G8, G4W | steered rate pieces of 15, 15, 8, 8 and 4 m. Each piece is laid, measured, undone and re-laid (up to 4 tries) to the read's heading and pitch at its end. W adds a cut where width or edge changes. |
| K, K4 | rate pieces of 8 and 4 m ending at the read's own turn and climb rates |
| PRE40-, POST40-, PP40- | the same route with 40 m laid before the section, after it, or both |
| OT- | loops read over the top |
| JUMP- | sections 99 and 100 laid with Jump between them |
| JUMPmean- | the landing typed at the read's mean pitch over its 60 m |

The runs stop at the first route that makes a section, so the routes after a ✓ were not tried. Section 100's diagnosis through the
core (`landingM`) and section 102's (`edgeApronM` 0) are not counted as made.

**Checked or inferred.**
- Every number in the table is one run of a local script, so all of them are checked.
- Inferred, each marked where it appears:
  - the read-noise reading of 46 and 96;
  - section 100's position residue;
  - the original's walls at the helix;
  - what the reader's jump label measures.

## The scripts (local, uncommitted: they read the read by name)

All are in `G:/consonance-scratch/o-t3-work/`:

| script | what it does |
|---|---|
| `geo.js` | the frames, smoothing and arc length; one formula set for both roads |
| `profile.js` | the bank |
| `sections.js` | the cut |
| `lay.js` | typing a piece through the panel; the built rows; `compare` |
| `steer.js` | the steered routes |
| `run.js` | the routes over sections |
| `table.js`, `md.js` | this table |
| `jumptest.js`, `jumpsec.js` | the jump |
| `clear103.js` (it takes 102), `helix_noapron.js` | section 102 |
| `roll45.js` | typed against built bank on 45–47 |
| `survey.js`, `probe_panel.js`, `probe_pitch.js`, `dbg_*.js` | the survey and probes |

Run outputs: `fullA/B.jsonl`, `pass2*.jsonl`, `pass3*.jsonl`, `pass4*.jsonl`. The file list for the table is in `files.txt`. The
tolerances and their registration log are `tolerances.md` and `tolerances.registered.txt`.

## The table (sections are metres along the lap; ✗ followed by worst / tolerance)

| # | from m | to m | class | made? | worst difference (tolerance) | what blocks it | routes tried (✓ made, ✗ worst/tolerance) |
|---|---:|---:|---|---|---|---|---|
| 0 | 0 | 283 | straight, flat, level | made | peak curvature 9.4 °/100m (tol 10.0) |  | A✗1.3 C✗1.3 D✗1.4 E✗1.3 F✓ |
| 1 | 283 | 586 | straight, banked, level | made | peak curvature 5.1 °/100m (tol 10.0) |  | A✗5.6 C✗2.0 D✗2.0 E✗2.1 F✗1.9 G15✗1.7 GW✗1.7 G8W✗1.0 K✗1.0 K4✓ PRE40-K4✓ |
| 2 | 586 | 738 | right turn, banked, level | made | edge 2.9 ° (tol 4.0) |  | A✗4.9 C✗6.0 D✗4.1 E✗6.5 F✗2.9 G15✓ |
| 3 | 738 | 1149 | left turn, banked, level | made | width 1.0 m (tol 2.0) |  | A✗13.4 C✗2.4 D✗2.5 E✗23.6 F✗1.8 G15✗1.3 GW✓ |
| 4 | 1149 | 1468 | straight, banked, level | made | heading 1.3 ° (tol 3.0) |  | A✗3.8 C✗1.9 D✗1.9 E✗2.0 F✗1.1 G15✗1.6 GW✓ |
| 5 | 1468 | 1872 | left turn, banked, level | made | width 2.0 m (tol 2.0) |  | A✗13.4 C✗4.0 D✗3.5 E✗18.6 F✗1.7 G15✓ |
| 6 | 1872 | 1936 | right turn, banked, grade 4-30° | made | peak curvature 14.1 °/100m (tol 21.8) |  | A✗3.5 C✗1.4 D✗1.6 E✗refused F✗2.7 G15✗1.3 GW✗1.4 G8W✗1.4 K✗1.2 K4✓ PRE40-K4✓ |
| 7 | 1936 | 2065 | straight, banked, grade 4-30° | made | pitch 1.7 ° (tol 2.0) |  | A✗5.0 C✗3.4 D✗3.4 E✗5.0 F✗3.2 G15✗1.7 GW✓ |
| 8 | 2065 | 2630 | straight, banked, level | made | peak curvature 5.0 °/100m (tol 10.8) |  | A✗6.9 C✗2.0 D✗3.0 E✗6.6 F✗2.4 G15✓ |
| 9 | 2630 | 2717 | right turn, wall-banked (60-110°), level | made | heading 2.8 ° (tol 3.0) |  | A✗2.2 C✗1.6 D✓ |
| 10 | 2717 | 3032 | left turn, banked, level | made | heading 2.2 ° (tol 3.0) |  | A✗11.3 C✗3.0 D✗4.5 E✗10.4 F✗2.6 G15✗1.3 GW✓ |
| 11 | 3032 | 3366 | left turn, banked, grade 4-30° | made | heading 2.2 ° (tol 3.0) |  | A✗8.6 C✗2.4 D✗1.2 E✗7.9 F✓ |
| 12 | 3366 | 3451 | straight, banked, level | made | width 2.0 m (tol 2.0) |  | A✗1.2 C✗2.1 D✗2.1 E✗1.2 F✓ |
| 13 | 3451 | 3666 | right turn, banked, level | made | width 0.9 m (tol 2.0) |  | A✗6.5 C✗1.7 D✗2.0 E✗4.0 F✗1.3 G15✓ |
| 14 | 3666 | 3777 | straight, flat, level | made | peak roll rate 0.10 °/m (tol 0.15) |  | A✗1.3 C✓ |
| 15 | 3777 | 3862 | straight, banked, level | made | width 1.0 m (tol 2.0) |  | A✗1.2 C✓ |
| 16 | 3862 | 4017 | right turn, banked, grade 4-30° | made | peak curvature 6.5 °/100m (tol 10.6) |  | A✗6.4 C✗1.2 D✗1.7 E✗3.7 F✗1.3 G15✓ |
| 17 | 4017 | 4148 | straight, wall-banked (60-110°), grade 4-30° | made | pitch 1.0 ° (tol 2.0) |  | A✗1.8 C✗1.4 D✗1.4 E✗1.8 F✗1.4 G15✗1.3 GW✗1.3 G8W✗1.4 K✗1.4 K4✗1.4 PRE40-K4✓ |
| 18 | 4148 | 4619 | straight, banked, level | made | width 1.0 m (tol 2.0) |  | A✗12.3 C✗2.7 D✗2.7 E✗5.4 F✗2.7 G15✗1.5 GW✓ |
| 19 | 4619 | 5018 | right turn, banked, level | made | heading 2.9 ° (tol 3.0) |  | A✗21.8 C✗4.7 D✗5.0 E✗11.0 F✗2.9 G15✓ |
| 20 | 5018 | 5185 | left turn, banked, level | made | peak roll rate 0.13 °/m (tol 0.15) |  | A✗9.0 C✗2.1 D✗2.3 E✗11.4 F✗1.8 G15✓ |
| 21 | 5185 | 5308 | straight, flat, level | made | bank 3.9 ° (tol 5.0) |  | A✓ |
| 22 | 5308 | 5420 | straight, banked, level | made | peak roll rate 0.04 °/m (tol 0.15) |  | A✗1.6 C✗2.8 D✗2.8 E✗1.6 F✗2.7 G15✗2.6 GW✓ |
| 23 | 5420 | 5568 | straight, flat, grade 4-30° | made | width 0.8 m (tol 2.0) |  | A✗8.6 C✗3.1 D✗2.4 E✗8.6 F✗2.1 G15✓ |
| 24 | 5568 | 5654 | straight, pitch ≥60° | made | pitch 1.8 ° (tol 2.0) |  | A✗11.0 C✗2.3 D✗5.6 E✗8.8 F✗8.7 G15✗37.7 GW✗37.2 G8W✓ OT-C✗2.4 OT-GW✗36.0 OT-G8W✗43.5 OT-K4✗1.2 |
| 25 | 5654 | 5843 | straight, upside down (≥110°), grade 4-30° | made | pitch 1.2 ° (tol 2.0) |  | A✗11.3 C✗2.1 D✗6.9 E✗11.2 F✗7.9 G15✓ OT-C✗2.1 OT-GW✓ |
| 26 | 5843 | 5941 | straight, pitch ≥60° | made | pitch 0.6 ° (tol 2.0) |  | A✗11.1 C✗2.5 D✗5.4 E✗9.4 F✗8.9 G15✗10.8 GW✗2.9 G8W✗8.3 K✗2.0 K4✗1.5 PRE40-K4✗1.8 PRE40-GW✗2.1 PRE40-G8W✗6.5 OT-C✗2.6 OT-GW✗26.4 OT-G8W✗20.7 OT-K4✗1.3 PP40-K4✗1.8 PP40-G8W✓ |
| 27 | 5941 | 6091 | straight, flat, grade 4-30° | made | pitch 1.4 ° (tol 2.0) |  | A✗9.3 C✗3.7 D✗6.8 E✗9.4 F✗2.4 G15✗1.3 GW✓ |
| 28 | 6091 | 6205 | straight, flat, level | made | peak roll rate 0.12 °/m (tol 0.15) |  | A✓ |
| 29 | 6205 | 6345 | straight, banked, level | made | peak curvature 2.5 °/100m (tol 10.0) |  | A✗1.7 C✗2.9 D✗2.9 E✗1.7 F✗1.4 G15✗1.6 GW✓ |
| 30 | 6345 | 6554 | left turn, banked, level | made | heading 2.3 ° (tol 3.0) |  | A✗7.8 C✗7.3 D✗4.6 E✗15.3 F✗4.1 G15✗1.0 GW✓ |
| 31 | 6554 | 6690 | left turn, banked, grade 4-30° | made | heading 2.2 ° (tol 3.0) |  | A✗4.8 C✗1.4 D✗4.1 E✗6.8 F✗2.1 G15✗1.6 GW✓ |
| 32 | 6690 | 6766 | straight, banked, level | made | peak curvature 9.9 °/100m (tol 10.0) |  | A✗1.1 C✗1.0 D✗1.1 E✗1.0 F✓ |
| 33 | 6766 | 6927 | right turn, banked, level | made | heading 2.3 ° (tol 3.0) |  | A✗4.1 C✗4.1 D✗5.7 E✗6.9 F✗6.1 G15✓ |
| 34 | 6927 | 7019 | straight, banked, level | made | bank 3.8 ° (tol 5.0) |  | A✓ |
| 35 | 7019 | 7105 | straight, flat, level | made | peak curvature 5.2 °/100m (tol 10.0) |  | A✗1.1 C✓ |
| 36 | 7105 | 7361 | left turn, banked, level | made | heading 2.9 ° (tol 3.0) |  | A✗12.2 C✗7.7 D✗8.5 E✗17.6 F✗5.4 G15✗1.5 GW✗2.3 G8W✓ |
| 37 | 7361 | 7532 | right turn, banked, level | made | heading 2.2 ° (tol 3.0) |  | A✗10.6 C✗5.8 D✗4.9 E✗4.9 F✗5.0 G15✓ |
| 38 | 7532 | 7662 | straight, banked, level | made | peak curvature 9.5 °/100m (tol 10.0) |  | A✗1.9 C✗1.9 D✗2.1 E✗1.8 F✗1.2 G15✓ |
| 39 | 7662 | 7968 | straight, flat, level | made | heading 2.8 ° (tol 3.0) |  | A✗5.8 C✗4.1 D✗4.1 E✗3.9 F✗6.0 G15✗3.5 GW✗1.3 G8W✓ |
| 40 | 7968 | 8441 | left turn, banked, level | made | heading 1.0 ° (tol 3.0) |  | A✗10.8 C✗1.8 D✗1.8 E✗22.3 F✗1.5 G15✗1.2 GW✓ |
| 41 | 8441 | 8549 | right turn, banked, level | made | heading 2.5 ° (tol 3.0) |  | A✗1.8 C✗1.3 D✗1.6 E✗2.9 F✓ |
| 42 | 8549 | 8968 | straight, banked, level | made | width 1.0 m (tol 2.0) |  | A✗7.1 C✗1.8 D✗1.8 E✗4.9 F✗2.7 G15✗1.5 GW✓ |
| 43 | 8968 | 9134 | right turn, banked, level | made | heading 2.5 ° (tol 3.0) |  | A✗1.6 C✗2.4 D✗2.8 E✗6.2 F✗2.4 G15✓ |
| 44 | 9134 | 9295 | straight, banked, level | made | width 1.4 m (tol 2.0) |  | A✗2.3 C✗2.1 D✗2.1 E✗2.3 F✗1.2 G15✓ |
| 45 | 9295 | 9384 | right turn, banked, level | made | heading 2.9 ° (tol 3.0) |  | A✗3.9 C✗2.0 D✗3.5 E✗1.9 F✗3.3 G15✗1.1 GW✗1.2 G8W✗1.2 K✗1.2 K4✗1.2 PRE40-K4✗1.2 PRE40-GW✗1.2 PRE40-G8W✗1.2 POST40-K4✓ |
| 46 | 9384 | 9563 | left turn, banked, level | **not made** | heading 3.1 ° (tol 3.0); fails: head 3.1° | nothing named in the builder: missed by 0.1° of heading, at stations where the read's own smoothed heading leaves its 24 m chord by up to 2.8° (inferred: read noise in a tight bend). 'This form did not', not 'cannot'. | A✗6.6 C✗5.9 D✗7.1 E✗15.4 F✗4.6 G15✗1.3 GW✗1.9 G8W✗1.0 K✗2.0 K4✗1.5 PRE40-K4✗1.5 PRE40-GW✗2.3 PRE40-G8W✗1.1 PP40-K4✗1.5 PP40-G8W✗1.1 PP40-G4W✗1.1 PP40-G15✗3.1 POST40-K4✗1.5 POST40-G8W✗1.0 |
| 47 | 9563 | 9628 | right turn, banked, level | made | heading 2.7 ° (tol 3.0) |  | A✗2.9 C✗2.5 D✗2.5 E✗refused F✗2.0 G15✗1.6 GW✗1.2 G8W✗1.2 K✗1.4 K4✗1.2 PRE40-K4✗1.1 PRE40-GW✗1.3 PRE40-G8W✓ |
| 48 | 9628 | 9724 | straight, banked, level | made | width 1.0 m (tol 2.0) |  | A✗1.1 C✓ |
| 49 | 9724 | 9856 | straight, flat, level | made | width 1.7 m (tol 2.0) |  | A✗2.0 C✗2.6 D✗2.6 E✗refused F✗1.6 G15✓ |
| 50 | 9856 | 9930 | straight, banked, grade 4-30° | made | heading 2.4 ° (tol 3.0) |  | A✓ |
| 51 | 9930 | 10112 | left turn, banked, grade 4-30° | made | peak roll rate 0.10 °/m (tol 0.20) |  | A✗4.1 C✗2.1 D✗1.8 E✗4.1 F✗1.0 G15✗1.7 GW✓ |
| 52 | 10112 | 10172 | right turn, upside down (≥110°), grade 4-30° | made | bank 2.3 ° (tol 5.0) |  | A✗1.5 C✓ |
| 53 | 10172 | 10272 | straight, upside down (≥110°), grade 4-30° | made | pitch 0.8 ° (tol 2.0) |  | A✗3.8 C✗1.4 D✗2.4 E✗3.9 F✗2.8 G15✓ |
| 54 | 10272 | 10516 | straight, wall-banked (60-110°), grade 4-30° | made | width 0.8 m (tol 2.0) |  | A✗3.3 C✗1.4 D✗1.1 E✗3.2 F✗1.0 G15✓ |
| 55 | 10516 | 10629 | straight, banked, level | made | heading 2.5 ° (tol 3.0) |  | A✗1.4 C✓ |
| 56 | 10629 | 10709 | straight, banked, grade 4-30° | made | heading 2.5 ° (tol 3.0) |  | A✓ |
| 57 | 10709 | 10929 | right turn, banked, grade 4-30° | made | heading 2.6 ° (tol 3.0) |  | A✗3.2 C✗1.5 D✓ |
| 58 | 10929 | 11006 | straight, banked, level | made | width 2.0 m (tol 2.0) |  | A✗1.9 C✗1.3 D✗1.3 E✗1.9 F✗1.0 G15✓ |
| 59 | 11006 | 11159 | right turn, banked, level | made | heading 1.9 ° (tol 3.0) |  | A✗6.6 C✗2.5 D✗2.1 E✗1.8 F✗1.3 G15✓ |
| 60 | 11159 | 11289 | right turn, banked, grade 4-30° | made | width 2.0 m (tol 2.0) |  | A✗5.4 C✗2.5 D✓ |
| 61 | 11289 | 11472 | right turn, banked, level | made | heading 1.5 ° (tol 3.0) |  | A✗2.4 C✗2.3 D✗1.4 E✗3.7 F✗1.3 G15✗1.1 GW✓ |
| 62 | 11472 | 11576 | straight, banked, level | made | bank 5.0 ° (tol 5.0) |  | A✓ |
| 63 | 11576 | 11899 | left turn, banked, level | made | width 1.7 m (tol 2.0) |  | A✗13.3 C✗2.7 D✗2.2 E✗11.7 F✗1.8 G15✓ |
| 64 | 11899 | 12051 | left turn, banked, grade 4-30° | made | width 1.0 m (tol 2.0) |  | A✗1.8 C✗3.4 D✗1.6 E✗5.6 F✗1.4 G15✗1.3 GW✓ |
| 65 | 12051 | 12310 | straight, banked, grade 4-30° | made | bank 1.9 ° (tol 5.0) |  | A✗11.2 C✗1.5 D✗1.5 E✗11.1 F✗1.5 G15✗1.1 GW✓ |
| 66 | 12310 | 12403 | right turn, wall-banked (60-110°), steep 30-60° | made | bank 4.3 ° (tol 5.0) |  | A✗2.0 C✓ |
| 67 | 12403 | 12524 | straight, upside down (≥110°), steep 30-60° | made | peak roll rate 0.15 °/m (tol 0.15) |  | A✗3.8 C✗2.1 D✗1.9 E✗3.8 F✗1.2 G15✗1.1 GW✗1.1 G8W✓ |
| 68 | 12524 | 12692 | straight, upside down (≥110°), grade 4-30° | made | width 1.3 m (tol 2.0) |  | A✗5.7 C✗1.9 D✗3.9 E✗5.6 F✗2.9 G15✓ |
| 69 | 12692 | 13007 | straight, pitch ≥60° | made | pitch 1.8 ° (tol 2.0) |  | A✗47.7 C✗2.9 D✗3.5 E✗47.7 F✗2.0 G15✗1.9 GW✗1.1 G8W✓ |
| 70 | 13007 | 13228 | straight, banked, grade 4-30° | made | heading 2.0 ° (tol 3.0) |  | A✗5.0 C✓ |
| 71 | 13228 | 13343 | right turn, banked, grade 4-30° | made | heading 2.3 ° (tol 3.0) |  | A✗3.7 C✗1.6 D✗1.5 E✗1.2 F✗1.4 G15✓ |
| 72 | 13343 | 13408 | right turn, banked, level | made | heading 2.4 ° (tol 3.0) |  | A✓ |
| 73 | 13408 | 13734 | straight, banked, level | made | peak curvature 3.7 °/100m (tol 10.0) |  | A✗6.3 C✗2.4 D✗2.4 E✗3.3 F✗1.7 G15✗1.3 GW✓ |
| 74 | 13734 | 13904 | right turn, banked, level | made | width 1.8 m (tol 2.0) |  | A✗2.0 C✗1.9 D✗1.9 E✗2.5 F✗1.4 G15✓ |
| 75 | 13904 | 14040 | straight, banked, level | made | heading 2.5 ° (tol 3.0) |  | A✓ |
| 76 | 14040 | 14156 | straight, flat, level | made | peak roll rate 0.12 °/m (tol 0.15) |  | A✓ |
| 77 | 14156 | 14254 | straight, banked, level | made | heading 2.5 ° (tol 3.0) |  | A✗1.1 C✓ |
| 78 | 14254 | 14338 | right turn, banked, grade 4-30° | made | width 1.7 m (tol 2.0) |  | A✗5.6 C✗1.7 D✗1.4 E✗1.4 F✗2.6 G15✓ |
| 79 | 14338 | 14398 | right turn, banked, level | made | heading 2.8 ° (tol 3.0) |  | A✗2.8 C✗1.2 D✓ |
| 80 | 14398 | 14719 | right turn, banked, grade 4-30° | made | heading 2.9 ° (tol 3.0) |  | A✗10.2 C✗3.3 D✗3.4 E✗15.9 F✗3.7 G15✓ |
| 81 | 14719 | 14858 | right turn, banked, level | made | width 1.4 m (tol 2.0) |  | A✗1.9 C✗1.7 D✗1.2 E✗3.1 F✗1.4 G15✓ |
| 82 | 14858 | 14934 | straight, banked, level | made | heading 2.2 ° (tol 3.0) |  | A✓ |
| 83 | 14934 | 15054 | straight, flat, level | made | peak roll rate 0.14 °/m (tol 0.15) |  | A✓ |
| 84 | 15054 | 15195 | straight, banked, level | made | heading 2.5 ° (tol 3.0) |  | A✓ |
| 85 | 15195 | 15368 | left turn, banked, level | made | heading 1.1 ° (tol 3.0) |  | A✗5.0 C✗1.5 D✗1.5 E✗1.8 F✗1.3 G15✗1.3 GW✓ |
| 86 | 15368 | 15444 | left turn, banked, grade 4-30° | made | peak curvature 5.7 °/100m (tol 10.0) |  | A✗1.5 C✗1.2 D✗1.2 E✗1.5 F✗1.7 G15✗1.1 GW✓ |
| 87 | 15444 | 15531 | straight, banked, grade 4-30° | made | width 1.0 m (tol 2.0) |  | A✓ |
| 88 | 15531 | 15741 | straight, flat, grade 4-30° | made | heading 0.7 ° (tol 3.0) |  | A✗2.1 C✗1.6 D✗1.6 E✗2.1 F✗1.3 G15✗1.1 GW✓ |
| 89 | 15741 | 15814 | straight, banked, grade 4-30° | made | peak curvature 4.4 °/100m (tol 10.0) |  | A✗2.7 C✗2.2 D✗2.2 E✗refused F✗1.4 G15✗2.3 GW✓ |
| 90 | 15814 | 16027 | right turn, wall-banked (60-110°), grade 4-30° | made | pitch 1.7 ° (tol 2.0) |  | A✗24.7 C✗5.4 D✗4.7 E✗24.6 F✗2.9 G15✓ |
| 91 | 16027 | 16108 | right turn, banked, grade 4-30° | made | peak roll rate 0.14 °/m (tol 0.15) |  | A✗2.5 C✗2.4 D✗2.1 E✗1.7 F✗2.9 G15✗1.1 GW✓ |
| 92 | 16108 | 16521 | straight, flat, level | made | peak curvature 6.9 °/100m (tol 10.0) |  | A✗8.9 C✗2.0 D✗2.0 E✗8.9 F✗1.9 G15✗1.7 GW✓ |
| 93 | 16521 | 16956 | straight, banked, grade 4-30° | made | pitch 0.4 ° (tol 2.0) |  | A✗4.4 C✗2.2 D✗2.2 E✗5.6 F✗1.5 G15✗1.7 GW✓ |
| 94 | 16956 | 17407 | left turn, banked, grade 4-30° | made | heading 2.6 ° (tol 3.0) |  | A✗40.0 C✗2.3 D✗3.1 E✗40.0 F✗2.0 G15✗1.1 GW✓ |
| 95 | 17407 | 17481 | straight, flat, grade 4-30° | made | peak curvature 4.0 °/100m (tol 10.0) |  | A✗1.0 C✓ |
| 96 | 17481 | 17595 | right turn, banked, level | **not made** | heading 3.4 ° (tol 3.0); fails: head 3.4° | nothing named in the builder: missed by 0.4° of heading, at the 26 m-radius apex where the read turns 5.4°, 10.6°, then 4.2° over three 4 m stations and leaves its 24 m chord by 2.9° (inferred: read noise). 'This form did not', not 'cannot'. | A✗4.4 C✗8.8 D✗7.1 E✗8.2 F✗5.6 G15✗1.2 GW✗1.2 G8W✗1.1 K✗1.7 K4✗1.5 PRE40-K4✗1.7 PRE40-GW✗1.5 PRE40-G8W✗1.4 PP40-K4✗1.7 PP40-G8W✗1.4 PP40-G4W✗1.4 PP40-G15✗2.4 |
| 97 | 17595 | 17708 | straight, banked, level | made | peak curvature 4.3 °/100m (tol 10.0) |  | A✗1.5 C✗1.5 D✗1.5 E✗1.5 F✗1.3 G15✗1.3 GW✓ |
| 98 | 17708 | 17830 | straight, banked, grade 4-30° | made | heading 2.0 ° (tol 3.0) |  | A✓ |
| 99 | 17830 | 17975 | straight, flat, grade 4-30° | made | position 4.1 m (tol 5.0) |  | A✗4.5 C✗4.0 D✗4.3 E✗4.5 F✗2.8 G15✗2.6 GW✗2.6 G8W✗5.8 K✗3.3 K4✗3.2 JUMP-G8W✓ JUMP-G15✓ JUMPmean-G4W✗1.0 |
| 100 | 18117 | 18312 | straight, flat, level | **not made** | pitch 2.5 ° (tol 2.0); fails: pos 5.8m, pitch 2.5° | PANEL GAP: Jump always lays a 60 m straight landing (src/core/jump.js:27 LANDING_M). The core takes landingM (src/core/jump.js:55); the shell's jumpFor never passes it (app/core/coreshell.js:408). With the core's landingM 8 or 20 m the pitch is made; 5.8–6.3 m of position is left in the first 10 m after the gap, where the smoothing is one-sided (inferred: the measuring) | A✗4.7 C✗4.1 D✗4.3 E✗4.5 F✗3.2 G15✗2.3 GW✗2.4 G8W✗3.0 K✗5.3 K4✗5.1 JUMP-G8W✗1.4 JUMP-G15✗1.4 JUMPmean-G4W✗1.3 |
| 101 | 18312 | 18449 | straight, banked, level | made | peak roll rate 0.08 °/m (tol 0.15) |  | A✗1.0 C✓ |
| 102 | 18449 | 19186 | right turn, banked, grade 4-30° | **not made** | heading 13.7 ° (tol 3.0); fails: pos 16.1m, head 13.7°, pitch 5.2°, elev 3.8m, peak k 125 vs 163°/100m | PANEL GAP: PASS_CLEARANCE (app/core/coreshell.js:475) counts the default 2 m apron (src/export/apron.js:52 APRON_WIDTH_M) against CAR_MARGIN_M 3.1 m (src/validate/passclear.js:39); the panel cannot send the document's edgeApronM. Through the core with edgeApronM 0 the section is made (G8W 0.83, G8 0.76) | A✗refused C✗refused D✗4.6 E✗refused F✗8.7 G15✗refused GW✗refused G8W✗refused K✗refused K4✗refused PRE40-K4✗refused PRE40-GW✗refused PRE40-G8W✗refused |
| 103 | 19186 | 19273 | right turn, banked, level | made | peak curvature 7.5 °/100m (tol 10.7) |  | A✗2.3 C✗1.4 D✗1.4 E✗1.5 F✓ |
| 104 | 19273 | 19405 | right turn, banked, grade 4-30° | made | heading 1.7 ° (tol 3.0) |  | A✗3.1 C✗2.0 D✗1.0 E✗4.6 F✗1.7 G15✗1.3 GW✓ |
| 105 | 19405 | 19473 | left turn, banked, grade 4-30° | made | peak curvature 10.4 °/100m (tol 11.9) |  | A✗2.5 C✓ |
| 106 | 19473 | 19551 | left turn, banked, level | made | width 1.6 m (tol 2.0) |  | A✗1.4 C✗1.4 D✗1.4 E✗1.2 F✓ |
| 107 | 19551 | 19658 | straight, banked, level | made | peak curvature 5.8 °/100m (tol 10.0) |  | A✗1.5 C✗1.5 D✗1.7 E✗1.4 F✗1.5 G15✓ |
| 108 | 19658 | 19848 | straight, banked, grade 4-30° | made | heading 2.5 ° (tol 3.0) |  | A✗3.9 C✗3.3 D✗3.3 E✗3.9 F✗5.7 G15✗4.2 GW✓ |
| 109 | 19848 | 19914 | left turn, banked, grade 4-30° | made | heading 3.0 ° (tol 3.0) |  | A✗2.4 C✗1.2 D✓ |
| 110 | 19914 | 19981 | left turn, banked, level | made | width 1.9 m (tol 2.0) |  | A✗1.1 C✗1.1 D✗1.1 E✗refused F✓ |
| 111 | 19981 | 20128 | straight, banked, grade 4-30° | made | peak roll rate 0.11 °/m (tol 0.16) |  | A✗3.4 C✗2.1 D✗2.1 E✗2.2 F✗1.5 G15✗2.0 GW✓ |
| 112 | 20128 | 20240 | right turn, banked, grade 4-30° | made | edge 3.5 ° (tol 4.0) |  | A✗4.9 C✗3.8 D✗4.0 E✗2.5 F✗2.3 G15✓ |
| 113 | 20240 | 20325 | straight, banked, grade 4-30° | made | peak roll rate 0.08 °/m (tol 0.15) |  | A✗1.2 C✓ |
| 114 | 20325 | 20733 | right turn, banked, level | made | width 1.5 m (tol 2.0) |  | A✗22.7 C✗2.2 D✗2.2 E✗14.0 F✗1.6 G15✓ |
| 115 | 20733 | 20869 | right turn, banked, grade 4-30° | made | heading 2.9 ° (tol 3.0) |  | A✗10.2 C✗3.0 D✗1.7 E✗5.0 F✓ |
| 116 | 20869 | 21071 | right turn, banked, level | made | heading 2.9 ° (tol 3.0) |  | A✗2.1 C✗3.6 D✗2.0 E✗6.5 F✗1.6 G15✗1.2 GW✗1.2 G8W✗1.0 K✓ PRE40-K4✓ PP40-K4✓ |
| 117 | 21071 | 21317 | straight, banked, level | made | peak curvature 9.6 °/100m (tol 10.0) |  | A✗2.9 C✗1.4 D✗1.4 E✗2.4 F✓ |
| 118 | 21317 | 21720 | straight, flat, level | made | peak curvature 8.3 °/100m (tol 10.0) |  | A✗5.5 C✗3.6 D✗3.7 E✗5.5 F✗6.0 G15✗5.0 GW✓ |

made 115 / 119 sections; 20354 / 21578 m of road

# D280 part 2 (pane B): Thunderhead's sharp turns, and what in the builder stops them. MEASURE ONLY; nothing changed.

**Output:** `exo_memory/loop/sharp_turns_measure_B_2026-10-09.md`. Every number has its command beside it. The scripts and their raw outputs are in
`exo_memory/handback/p-sharpturns-B_2026-10-09_evidence/`.
- **The builder:** measured on a read-only `git archive` of t180 `main` 22c46a0. The shared t180 checkout is mid-edit (`src/core` files modified
  and deleted in its working tree), so it was not used and not touched.
- **The release ref:** `2183c4d` (v0.3.4) is on another ref, not `main`.
- **Untouched:** I did not touch `src/core`; E's part 1 runs in parallel.

## Thunderhead (the read, 4 m stations, landing at read d 5,223 m)
- **The keeper's two turns after the jump are two right turns of −87.8° and −87.9°**, 100 m apart.
  - Each holds a near-constant radius of about 22 m (20 m window; 11.8 m on the 8 m window) for 31–44 m.
  - Entry and exit transitions are 0–8 m, at the measure's resolution.
  - The section is about 24 m wide, with the centre tilted about 30°.
- **21 turns of 30° or more after the landing** are tabulated, each with radius, angle, arc, transitions, width and tilt profile.
- **The equation file is not the bottleneck:** its 200-harmonic series still draws 14.1 m.

## The builder's limits, each with its line, found by trying through the app's own core shell and validator (full speed, 970 km/h)
- **L1, the default turn eases over the whole piece** (`app/core/panel.js:44-52`, `src/core/extend.js:16-30`).
  - The keeper's 750 m −90° piece builds R 239 m.
  - Its curvature rises over 456 m and peaks at the piece's end.
  - The exit piece then adds −1.35°, matching the screenshot's −1.3° (E's part 1).
  - This is the "more curve than an abrupt turn".
- **L2, "at start" is a fixed 20 m ease** (`panel.js:47`).
  - Entry measures 6–8 m (10–90%), close to Thunderhead's.
  - A turn piece shorter than 20 m cannot reach its rate: −71.9° instead of −90° at R 12, width 24.
- **L3, 20 m knots** (`src/core/document.js:46`). A shorter transition, straight from the core, overshoots: −102° to −130°, the radius tighter
  than asked, and the exit ringing for 40 m or more. Below one knot span it is not sharper, it is wrong.
- **L4, no minimum radius and no turn-rate cap** exist anywhere.
- **L5, the validator judges no lateral load**; only normal load can go amber (over 90 g). Red at a tight turn is geometry: fold, and surfaces
  stacked within 2 m.
  - **Width 45:** the tightest green 90° is **R 24.25 m**. Stacked-within-2m reds at R ≤ 24.0 and fold at R ≤ 22. Normal load stays under 52 g,
    never amber.
  - **Width 24 (Thunderhead's):** green to **R 15**, amber from 13, fold at ≤ 11.

**So, measured:** at its own width, Thunderhead's post-jump shape (R ≈ 22 m, 90°, sharp entries, held radius) is placeable today with "at start"
plus a "turn 0, at start" exit. The long smooth arc is L1, the unticked default. At width 45 a bowl stops near R 24 on geometry, not on speed. No
recommendation here; the design call is the librarian's merge.

## After the keeper's clarification (18:55): the abrupt 90° is a SECOND turn type; the broad curve stays
The measurement file now has a section 3, "For a NEW abrupt-turn type". It frames each limit as what the new type must get past, with one more
measurement made for it (`knots.js`: the new type's own ramp and knot spacing, through the same core shell and validator).
- **L1, whole-piece easing:** bypassed. The new type is its own shape, so the broad curve's ease never applies, and the broad curve is untouched.
- **L2, the fixed 20 m ease:** bypassed by its own ramp. `tr` 4–8 m gives entry and exit of 1.9–6 m (10–90%), against Thunderhead's 0–8 m.
- **L3, 20 m knots:** needs its own rule, denser knots on its pieces.
  - `tr` 4 with `knotM` 4 or 2 builds exactly 90° (−89.96° to −90.31°), with the last 50 m of the exit at 0.000° change, and green.
  - The same `tr` 4 at the default 20 m knots overshoots to −103° and −129°, and goes red.
- **L4, no radius cap:** needs its own rule, a minimum radius per width and cross-section, because geometry is what fails. Bowl at width 45:
  R ≥ 24.25 m. Bowl at width 24: R ≥ 15 green.
- **L5, the 970 km/h check:** its reds (fold, rim within 2 m) cannot be bypassed, since they are real surface faults. Its speed side costs nothing
  today: there is no lateral limit, and normal load stays under 90 g to R ≈ 13 at width 24. Judging at the turn's own speed would be a separate
  rule that nothing here forces.
- **Thunderhead's post-jump 90°** (R 22, width 24) builds as one exact, green 90° that exits dead straight, with `tr` 4 and `knotM` 2.

**Not measured:** dense knots' cost in document size and preview/export time, and how sculpt or close behave on them.

## Corrections (mine)
- **W1:** my first run reported no red at any radius. My filter read each finding's `s`, but findings carry `s0`/`s1` spans, so it dropped all of
  them. A debug run showed the fold red at R 15. I fixed the filter and re-ran all 24 trials; the table is from the corrected run. The script says
  so at the line.
- **W2:** the first export lacked `tools/` (`document.js` requires `tools/piecewise.cjs`). Re-exported with it.
- **W3:** the equation file's jump `s` (5,257.5 m) is in its own arc length, not the read's (lap 9,496 vs 9,166 m). My first pass started from it;
  corrected to the read's own landing station.

NEXT: librarian merge part 2 with E's part 1 and write the sharp-turn change when this is read

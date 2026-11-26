# [T4]: what the builder cannot make yet (pane B, 2026-11-26, research only)

Packet: `exo_memory/loop/packet_t180_unmakeable_shapes_2026-11-26.md`, plus the chair's addendum of 19:33Z (the simplest
route, its pieces, STEERED). Base: t180 `ceb21f5` (landing-1126), worktree `G:/consonance-scratch/b-t4-t180`, detached.
No builder code was changed, nothing was pushed, nothing was installed. All track data stayed in `reads/` and in my scratch
folder, `G:\consonance-scratch\b-t4-work`, which is uncommitted. This file names only [T4], metres along the lap, and our
own measured differences.

## The count

- **Sections: 365 of 370 made.**
  - **By hand: 193** (14,288 m). Here the simplest route is one a person types once: corner or rate pieces, numbers from the
    read, no undo.
  - **Only by STEERING: 172** (15,209 m). Every such route lays a piece, measures its end against the read, undoes it and
    lays it again (see "Routes").
  - **Not made: 5** (332 m, the last 332 m of the lap). All five are one class (A below).
- **Road made:** 29,497 of 29,829 m.
- **Jumps: 2 of 7 made** (jumps 1 and 6, both by hand). The other five miss on the cross-section across the flight
  (class B below).
- **The whole lap:** with the flights counted, 29,759 of 30,976 m made (96.1 %). By hand: 14,550 m (47.0 %).
  - The read walks 30,963 m. The 13 m difference is the 4 m station step at the seven gaps. That figure is inferred,
    not checked.
- **Sections next to a jump:** the section after each landing is counted as made by its own lay. That lay starts from a
  lead-in that carries the landing's own cross-section. The miss at the flight is counted once, in the jump rows, not
  twice.

```
checked: node assemble.cjs (G:\consonance-scratch\b-t4-work) → "made by hand 193 (14288 m) | made only by steering 172 (15209 m)"
         and "sections made 365 / 370 | metres made 29497 / 29829"
checked: node -e over jumps-result.json → jumps 1 and 6 made by J2 and J3; 0, 2, 3, 4 and 5 not (rows below)
```

## The classes not made

| class not made | where | what blocks it | routes tried | worst against tolerance |
|---|---|---|---|---|
| **A. A cross-fall on a wide road.** About 48 m wide. One side rises to 26–36°. The other side falls away from near the centre at a steady 15°. The section on each side is its run-in or run-out. | 365–369, 30,631–30,963 m | **No form in the panel gives a falling side.** The cup must be 0 to 150° (`BAD_CUP`, `src/core/extend.js:941`). An edge may start only from 0.5 to 0.95 of the half-width (`BAD_EDGE`, `src/core/extend.js:948`). So a negative edge bends only the outer half, and the inner half still rises like a bowl. | **Six:** the hand forms (corner×1, rate×1, corner×2, rate×N, corner×N, and rows+flow on 365 and 367); ghost8 (steered); ghost4 (steered); window8 (steered, in context); ghost8 with a negative edge from 0.5 of the half-width and the cup fitted (G8neg, steered). | cross-section 17–18° off (3.47 of a 5° tolerance) on 366–368; 9.5° on 365; roll 1.30 on 369 |
| **B. A cross-section change across a flight.** The read's road is 0–6 m narrower after the gap than before it, and its rims change by up to 9.7°. | jumps 0, 2, 3, 4, 5 (at 3,531, 12,310, 14,510, 16,300 and 22,419 m) | **The road after a flight starts from the take-off's cross-section.** `afterFlight` (`src/core/document.js:173`) resets only the turn, climb, offsets and bank. Width, cup and edges carry over, and the flight piece holds a pose only (`FLIGHT_POSE`, `src/core/document.js:362`). The Jump button's own landing is a 60 m straight of the family's default width and rims (`src/core/jump.js:50-53`). O found that the core takes `landingM` but the panel never sends it. | **Four, all by hand:** J1, the Jump button with its 60 m landing kept. J2, the landing piece deleted (Delete at the end of the track) and four typed rate pieces laid from the flight. J3, J2 with the width and both edges ticked "early". J4, the take-off piece typed with the landing's cross-section. | J2: width 1.50–2.93, or rim 1.93. J4 makes every landing, but moves the step onto the take-off's last 20 m: width 2–6 m, rim up to 9.7°. That take-off error is inferred from the read's own step; it was not measured on the built take-off. |

**Where a jump IS made:** the landing pose. Typed into the six landing boxes, all seven came back exactly as typed. The
built landing road lies within 0.50 m horizontally and 0.41 m vertically of the read's raw stations for its first 60 m, on
every route.

```
checked: jumps.cjs → jumps.log, jumps-result.json: pose typed == pose got on 7 of 7; raw posH ≤ 0.50 m, posV ≤ 0.41 m
checked: node xprobe.cjs (a 60 m piece, width 48, re-run 19:5xZ) → {"cup":-15} BAD_CUP "the cup target must be from 0 to 150 degrees";
         {"edgeR":-30,"start":0} BAD_EDGE "from 0.5 to 0.95 of the half-width"; {"edgeR":-15,"start":0.5} placed, right-side slopes at
         1/4, 1/2, 3/4 = 2.7, 8.6, 8.0 deg (rising); {"edgeR":-30,"cup":15,"start":0.5} placed, 2.6, 8.3, 0.0. No typed form gave a
         falling slope at any quarter; the read falls about 15 deg from near the centre
inferred: whether class A's falling side is driven track or an apron the probe counts as road. The probe reads every surface
         marked valid; I made no picture.
```

## What the hand forms miss, where only steering makes it (his question: what he can make by hand)

- **172 sections need steering.** In each, the best hand form misses on:
  - peak curvature: 37
  - bank: 34
  - heading at the end: 24
  - rim: 22
  - width: 20
  - pitch: 17
  - position: 10
  - cross-section: 4
  - roll: 4
- **By turn class (made only by steering / made by hand):**

  | turn class | steering only | by hand |
  |---|---|---|
  | hairpin | 19 | 1 |
  | tight | 65 | 48 |
  | turn | 39 | 52 |
  | sweep | 25 | 44 |
  | straight | 24 | 48 |

  **The hairpin is the class he cannot make by hand:** 19 of 20 hairpins need steering.
- **Pieces in the simplest hand route that made a section:**

  | pieces | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 9 | 10 |
  |---|---|---|---|---|---|---|---|---|---|
  | sections | 63 | 88 | 20 | 11 | 7 | 1 | 1 | 1 | 1 |

- **Why the hand forms miss** (inferred from the forms, not proven):
  - A corner piece eases in and ends straight, so a chain of corners puts straight joints into a continuous bend
    (peak curvature, heading at the end).
  - A rate piece ends at a rate but does not hold the heading change, so a rate chain drifts.
  - Bank, width and rims are typed only at piece ends, with a rounded ramp between. Where the read changes them inside
    8–25 m, a few pieces cannot follow.
  - Steering fixes all three by measuring and retyping each 4–8 m piece. A person can steer the same way against the
    reference shadow; how long that takes a person was not measured.

## A refusal worth the catalogue, though no section is lost to it

**SHARP_TOO_TIGHT** (`src/core/sharp.js:132`):
- **What it refuses:** the Sharp piece on 36 of the 47 sections where I tried it, at the read's own tightest radius, 22–57 m, on
  this 28–33 m road. The message gives the tightest it allows as 50.5–119.5 m (29 sections), or "no radius up to 2000 m is
  green" (7).
- **What makes those sections:** other routes. 34 of the 36 are made only by steering (ghost, chain or window rate pieces); 236 and 329 are made by
  hand corner pieces. inferred: those rate pieces reach the read's radius (their peak curvature is within 15 %, which is
  what made them), so the same radius Sharp refuses is laid.
- **So Sharp refuses a radius that rate pieces lay.** Inferred, not checked: the rate path does not run Sharp's load check,
  or runs a different one. Only one of the two can be right about this road.

```
checked: results_0-263.jsonl + results_264-369.jsonl → 47 sharp forms, 36 refused SHARP_TOO_TIGHT (R typed 21.9–57.0 m; tightest allowed
         50.5–119.5 m on 29, none on 7; widths 28–33 m); table.json → each of the 36 made by another route
```

## How the lap was cut

1. **Runs.** The read (7,459 road stations at about 4 m) is split into its 8 runs between the 7 jumps.
2. **Signals per station:**
   - **Position:** smoothed by a ±3-station triangle.
   - **Heading and pitch:** central difference over ±2 stations.
   - **Heading rate, climb rate and bank:** smoothed ±1. The roll rate is the bank's derivative.
   - **Width:** median of ±3 stations.
   - **Cross-section, from the MESH, not the reader:** rays cast down each station's normal through the road meshes (`probe.cjs`, every second station, 0.5 m across). This gives each side's rim (the steepest slope over its last
     2 m) and the slopes at 1/4, 1/2 and 3/4 of the half-width.
3. **Classes per station:**
   - **Turn:** straight > 1500 m radius > sweep > 500 > turn > 180 > tight > 60 > hairpin, with left or right.
   - **Bank:** flat < 8° < bank < 25° < steep < 45° < very steep < 70° < wall.
   - **Grade:** level < 3.5° < up/down < 10° < UP/DOWN.
   - **Cross-section:** flat / bowl / bowl+ by the rim at 12° and 30°; "wide-" at 36 m or wider; a side marked where the
     two rims differ by more than 8°.
4. **Sections:** cut wherever the class tuple changes. Then any section under 40 m is merged into the neighbour sharing
   more class fields, shortest first, until none is left. Each section takes the class each field holds over most of its
   length.
5. **Result:** 370 sections, 40 to 520 m (median 68).

**A finding about the read on the way, not a builder class:** the reader's rim angles are a reader artifact. Its
`edgeL/edgeR` read about 45° on 1,695 stations. Over the same stations the mesh's steepest last-2 m slope is 15–30°
(by 5° bins: 15: 2,236; 20: 6,307; 25: 5,654; 30: 512, both sides counted). Measured against the reader's rims, sections "missed" on rim that the mesh shows the builder matching. Any lap that
compares a built road with this reader's rims inherits the artifact (`tools/read_track.cjs` in the builder checkout;
the line was not traced, and whether other tracks read the same way was not checked).

## Tolerances (named before measuring, with when; reasons are in the file)

`G:\consonance-scratch\b-t4-work\TOLERANCES.txt`, registered 19:01:41Z, before any section was measured.

| measure | tolerance | reason |
|---|---|---|
| position, horizontal | 2.0 m | about a car width |
| position, vertical | 1.0 m | a visible step |
| heading at the end | 1.0° | 1.7 m sideways per 100 m |
| bank | 3.0° | about 5 % of the lateral load |
| pitch | 1.5° | |
| width | 2.0 m | the read counts it in whole metres |
| each rim | 5.0° | |
| peak heading rate | 15 % (where the read's radius is under 1500 m) | |
| roll peak rate | max(0.15°/m, 25 %) | |

**Amended after a 7-section trial, before the full run, stated here because the packet asks for tolerances before
measuring.** Each amendment was set from the read's own noise, not from how many sections pass:
- **Cross-section (5.0°)** was added at the slopes at 1/4, 1/2 and 3/4 of each half-width, when the mesh probe replaced the
  reader's rims.
- **Peak heading rate:** a floor of 1.0e-3 rad/m. The read's heading rate on straights scatters to 6.2e-4 at p95.
- **Width:** the read's width is median-filtered over 12 m, because 386 of 7,459 neighbouring stations step 2 m or more.
- **Rim, checked against its noise and kept at 5°:** the mesh rim's own scatter about a 48 m mean is 2.4° at p95 and 3.7°
  at p99.

**What "made" means:** a section is MADE when every measure is inside its tolerance on at least one route. Position is
taken in a frame local to the section, from its start. Every comparison is of the built road and the read smoothed alike:
±12 m triangle, ±8 m difference. A 40 m tail is laid after each section so the smoothing at its end is two-sided.

## Routes

**By hand.** One lay: the numbers are taken from the read and typed once. Each lay starts from a 210 m lead-in to the
section's entry state.
- **corner×1 (1 piece):** one corner piece, the turn and climb typed as the section's heading and pitch change.
- **rate×1 (1 piece):** one rate piece ending at the read's rates.
- **corner×2 (2 pieces):** two corner pieces, split at the read's curvature peak or the middle.
- **rate×N (N = L/25, 2–10 pieces):** rate pieces, each ending at the read's rates, bank, width and cross-section.
- **corner×N (N = L/40, 2–6 pieces):** corner pieces, each its own heading change.
- **Sharp (up to 3 pieces):** a straight to the peak, a Sharp at the read's tightest radius, then a rest piece. Only where
  the read is tighter than 60 m.

**STEERED.** Each of these measures the built road against the read, then undoes and re-lays:
- **rows+flow:** one corner with extra turn and climb rows and the flowing bank. It lays a probe first and solves from
  what it built, so it counts as steered.
- **ghost8 / ghost4:** rate pieces of 8 or 4 m. Each piece's turn and climb are retyped, with Undo, up to 4 tries, until
  the built heading and pitch at its end are within 0.15° of the read's. Bank, width, cup and edges are typed at each
  piece's end.
  - The cup is fitted to the mesh's quarter slopes, because the builder's bowl with cup C rises about C × (0.17, 0.55, 1.0)
    at the quarters (probed).
- **chain8:** ghost8 over a whole run between jumps (runs 0, 1 and 3), so the road before and after each section is the
  read's own.
- **window8 / window8-2pass / window8-3pass / window4-2pass:** the same over a window from 240 m before a section to 80 m
  after it.
  - The 2- and 3-pass forms take the smoothing's own heading shift off the targets, as measured on the pass before.
    Typing the read's smoothed heading as a true heading bends a hairpin entry by about 2°.

## Corrections, including mine

- **The first trial missed every section by 3.5–4.8 m of position.** All of it was at the section's end: smoothing with no
  road after the end pulls the built end back. Fixed by the 40 m measuring tail; no section was measured before the fix.
- **The ghost fit wrapped its heading to ±180°.** On a corner turning more than 180° it typed a wild rate, and the builder
  refused that with PASS_CLEARANCE (sections 86 and 138). That was my bug. Fixed and re-run; both made.
- **PASS_CLEARANCE also refused sections 353 and 355, and the coarse forms on 353.** The road there turns 242° and passes
  over itself. My straight lead-in crossed the section's own road: "the road at 0.37 km meets the road at 0.15 km", where
  0.15 km is the lead-in. The read's real crossing there has 19.7 m of clearance. Laid in a window with a different start,
  both are made. So PASS_CLEARANCE blocks nothing on [T4]; the read crosses itself 9 times with at least 16.6 m between.
- **The landing's position first read 2.0–3.6 m off on every jump.** That was the one-sided smoothing at a landing's start
  in a section-local frame. Compared raw, in each road's own take-off frame, it is within 0.50 m. The raw figure is the
  one given.
- **A "heading at the end" miss of 1.0–1.7° on 30-odd hairpin and tight sections was the lay, not the builder.**
  - An isolated section's lead-in and tail are not the read's road, and smoothing reads across them.
  - Laid in its own context (chain8, window8), each was made except four.
  - On those four, the single-pass fit typed the smoothed heading as true. The second pass made them.
- **The chair's restart hold reached me at 19:14Z, after [T4] had started.** I stopped both runs, wrote the map line and
  rang "ready". The VOID reached me 41 s later, after that ring had gone. So the librarian holds a "ready" from B that
  the VOID made moot. Work resumed at 19:15Z with no results lost: the logs kept every finished section.

## Scripts (in `G:\consonance-scratch\b-t4-work`; uncommitted, they read track data)

- **Cutting and probing:**
  - `sections.cjs`: the cut.
  - `probe.cjs`: the mesh cross-section.
- **Laying and measuring:**
  - `lay.cjs`: the panel's `extendOptions` and the shell calls, headless.
  - `run.cjs`: the hand forms, rows+flow and Sharp; `measure`.
  - `fit.cjs`: ghost8 and ghost4.
  - `fitrun.cjs`: chain8.
  - `fitwin.cjs`: the window forms.
  - `jumps.cjs`: J1 to J4.
- **Tables:**
  - `assemble.cjs`: every route per section into `table.json`.
  - `table_md.cjs`: the table below.
- **Logs:** `run_all.log`, `run_a2.log`, `run_b.log`, `results_*.jsonl`, `fit*_*.log`, `fitrun-8.jsonl`, `fitwin*-*.jsonl`,
  `jumps.log`.
- **How it ran:** every run was headless, at BelowNormal, one process at a time or two, with no heavy-run lock (none
  needed; the hold file was read before each run). His app and the game were never launched.

## The jumps

| jump | at m | gap / drop m | J1 Jump, 60 m landing | J2 landing deleted, 4 rate pieces | J3 J2 + "early" | J4 take-off typed to the landing | made? |
|---|---|---|---|---|---|---|---|
| 0 | 3,531 | 125 / 11 | peak curvature 2.48 | width 1.95 | width 1.95 | landing made; take-off step: width 4 m, rims 3.9/4.5° | no |
| 1 | 3,922 | 121 / 11 | width 1.50 | **made** (rim 0.90) | **made** | made; take-off step: width 1 m, rim 4.5° | **yes, by hand (J2, 5 pieces)** |
| 2 | 12,310 | 225 / 47 | rim 1.90 | width 2.93 | width 2.93 | landing made; take-off step: width 6 m, rim 3.7° | no |
| 3 | 14,510 | 201 / 23 | roll 2.01 | width 1.50 | width 1.50 | landing made; take-off step: width 3 m, rim 7.3° | no |
| 4 | 16,300 | 109 / 11 | rim 1.70 | width 1.94 | width 1.94 | landing made; take-off step: width 4 m, rim 2.9° | no |
| 5 | 22,419 | 225 / 56 | rim 2.60 | rim 1.93 | rim 1.93 | landing made; take-off step: width 2 m, rim 9.7° | no |
| 6 | 26,305 | 141 / 14 | rim 1.68 | **made** (rim 0.50) | **made** | made; take-off step: rims 1.6/2.5° | **yes, by hand (J2, 5 pieces)** |

- **Figures in the J1 to J4 columns:** the worst measure against its tolerance, over the landing's first 60 m. Position is
  the raw comparison.
- **What the gap and drop columns are:** the read's own figures.
- **How each landing was placed:** with the six landing boxes, its pose taken from the read's raw stations either side of
  the gap.

## The table (every section; the class in plain words: turn, bank with the side that is up, grade, cross-section)

- **The routes tried column:** "hand forms" is corner×1, rate×1, corner×2, rate×N and corner×N on every section, rows+flow
  where it is 60 m or longer, and Sharp where the read is tighter than 60 m.
- **The worst column:** the worst measure over its tolerance on the simplest route that made the section; on a section not
  made, on its best route.
- **What blocks it, on a section made only by steering:** the best hand form and the measure it missed on.

| # | from–to m | class (turn, bank, grade, cross-section) | made? | simplest route that made it (pieces) | worst / its tolerance | what blocks it | routes tried |
|---|---|---|---|---|---|---|---|
| 0 | 0–360 | straight, flat, level, bowl | yes, STEERED only | ghost8 (45) STEERED | headEnd 0.43 | hand forms miss: best corner×6 kPeak 1.32 | hand forms, ghost8, chain8 |
| 1 | 360–416 | straight, bank R-up, level, bowl | yes, by hand | corner×2 (2) | kPeak 0.74 | — | hand forms, chain8 |
| 2 | 416–468 | turn L, steep R-up, level, bowl | yes, STEERED only | chain8 (7) STEERED | kPeak 0.61 | hand forms miss: best rate×2 rim 1.32 | hand forms, ghost8, ghost4, chain8 |
| 3 | 468–556 | tight L, vsteep R-up, DOWN, bowl | yes, STEERED only | ghost8 (11) STEERED | rim 0.55 | hand forms miss: best rate×4 rim 1.20 | hand forms, ghost8, chain8 |
| 4 | 556–620 | turn L, steep R-up, DOWN, bowl | yes, STEERED only | ghost8 (8) STEERED | kPeak 0.72 | hand forms miss: best corner×2 width 1.06 | hand forms, ghost8, chain8 |
| 5 | 620–668 | turn R, flat, DOWN, bowl | yes, STEERED only | ghost8 (6) STEERED | kPeak 0.65 | hand forms miss: best corner×2 kPeak 2.29 | hand forms, ghost8, chain8 |
| 6 | 668–764 | tight R, steep L-up, up, bowl | yes, by hand | rate×4 (4) | bank 0.89 | — | hand forms, chain8 |
| 7 | 764–816 | turn R, steep L-up, level, bowl | yes, by hand | corner×2 (2) | width 0.49 | — | hand forms, chain8 |
| 8 | 816–912 | turn R, bank L-up, level, bowl | yes, STEERED only | ghost8 (12) STEERED | kPeak 0.83 | hand forms miss: best corner×2 bank 1.47 | hand forms, ghost8, chain8 |
| 9 | 912–952 | sweep L, bank R-up, UP, bowl | yes, by hand | rate×2 (2) | headEnd 0.95 | — | hand forms, chain8 |
| 10 | 952–996 | tight L, steep R-up, UP, bowl | yes, by hand | rate×2 (2) | headEnd 0.88 | — | hand forms, chain8 |
| 11 | 996–1100 | tight L, vsteep R-up, level, bowl | yes, by hand | corner×3 (3) | bank 0.99 | — | hand forms, chain8 |
| 12 | 1100–1152 | tight L, steep R-up, down, bowl | yes, STEERED only | ghost8 (7) STEERED | width 0.50 | hand forms miss: best rate×2 bank 1.21 | hand forms, ghost8, chain8 |
| 13 | 1152–1224 | hairpin R, steep L-up, up, bowl | yes, STEERED only | ghost4 (18) STEERED | headEnd 0.83 | hand forms miss: best corner×2 headEnd 2.59 | hand forms, ghost8, ghost4, chain8 |
| 14 | 1224–1296 | tight R, vsteep L-up, up, bowl | yes, STEERED only | chain8 (9) STEERED | width 0.75 | hand forms miss: best corner×2 width 1.04 | hand forms, ghost8, ghost4, chain8 |
| 15 | 1296–1348 | turn R, vsteep L-up, level, bowl | yes, by hand | corner×1 (1) | pitch 0.94 | — | hand forms, chain8 |
| 16 | 1348–1424 | sweep R, steep L-up, level, bowl | yes, by hand | corner×2 (2) | roll 0.90 | — | hand forms, chain8 |
| 17 | 1424–1464 | sweep R, flat, level, bowl | yes, by hand | corner×1 (1) | bank 0.76 | — | hand forms, chain8 |
| 18 | 1464–1532 | sweep R, flat, up, bowl | yes, STEERED only | ghost8 (9) STEERED | kPeak 0.47 | hand forms miss: best rows+flow rim 1.13 | hand forms, ghost8, chain8 |
| 19 | 1532–1580 | straight, flat, level, bowl | yes, by hand | corner×2 (2) | width 0.85 | — | hand forms, chain8 |
| 20 | 1580–1740 | straight, flat, down, bowl | yes, by hand | corner×2 (2) | kPeak 0.64 | — | hand forms, chain8 |
| 21 | 1740–1864 | straight, flat, level, bowl | yes, STEERED only | chain8 (16) STEERED | rim 0.91 | hand forms miss: best corner×2 posV 1.17 | hand forms, ghost8, ghost4, chain8 |
| 22 | 1864–1912 | sweep R, bank L-up, up, bowl | yes, STEERED only | chain8 (6) STEERED | xsec 0.39 | hand forms miss: best rate×2 headEnd 1.30 | hand forms, ghost8, ghost4, chain8 |
| 23 | 1912–2008 | tight R, steep L-up, up, bowl | yes, STEERED only | ghost8 (12) STEERED | width 0.42 | hand forms miss: best corner×2 pitch 2.06 | hand forms, ghost8, chain8 |
| 24 | 2008–2068 | sweep R, flat, level, bowl | yes, STEERED only | chain8 (8) STEERED | rim 0.61 | hand forms miss: best rate×2 rim 1.03 | hand forms, ghost8, ghost4, chain8 |
| 25 | 2068–2156 | tight R, bank L-up, up, bowl | yes, STEERED only | ghost8 (11) STEERED | rim 0.50 | hand forms miss: best corner×2 bank 1.69 | hand forms, ghost8, chain8 |
| 26 | 2156–2240 | tight L, steep R-up, up, bowl | yes, STEERED only | ghost8 (11) STEERED | width 0.44 | hand forms miss: best rows+flow bank 1.72 | hand forms, ghost8, chain8 |
| 27 | 2240–2344 | turn L, vsteep R-up, level, bowl | yes, by hand | corner×3 (3) | width 0.84 | — | hand forms, chain8 |
| 28 | 2344–2388 | turn L, steep R-up, level, bowl | yes, by hand | corner×1 (1) | rim 0.76 | — | hand forms, chain8 |
| 29 | 2388–2432 | sweep L, steep R-up, level, bowl | yes, by hand | corner×1 (1) | bank 0.53 | — | hand forms, chain8 |
| 30 | 2432–2524 | straight, bank R-up, level, bowl | yes, by hand | rate×1 (1) | bank 0.81 | — | hand forms, chain8 |
| 31 | 2524–2580 | sweep L, bank R-up, up, bowl | yes, by hand | rate×1 (1) | rim 0.87 | — | hand forms, chain8 |
| 32 | 2580–2644 | tight L, steep R-up, UP, bowl | yes, by hand | corner×2 (2) | width 0.74 | — | hand forms, chain8 |
| 33 | 2644–2748 | tight L, vsteep R-up, UP, bowl | yes, STEERED only | ghost8 (13) STEERED | pitch 0.43 | hand forms miss: best rows+flow bank 1.49 | hand forms, ghost8, chain8 |
| 34 | 2748–2792 | tight L, steep R-up, DOWN, bowl | yes, by hand | rate×2 (2) | headEnd 0.93 | — | hand forms, chain8 |
| 35 | 2792–2852 | tight L, bank R-up, down, bowl | yes, STEERED only | ghost8 (8) STEERED | kPeak 0.65 | hand forms miss: best corner×2 bank 1.74 | hand forms, ghost8, chain8 |
| 36 | 2852–2940 | hairpin R, steep L-up, DOWN, bowl | yes, STEERED only | ghost8 (11) STEERED | rim 0.55 | hand forms miss: best corner×2 pitch 3.85 | hand forms, ghost8, chain8 |
| 37 | 2940–3004 | sweep R, bank L-up, DOWN, bowl | yes, by hand | corner×2 (2) | kPeak 0.92 | — | hand forms, chain8 |
| 38 | 3004–3044 | sweep L, flat, DOWN, bowl | yes, by hand | rate×2 (2) | headEnd 0.70 | — | hand forms, chain8 |
| 39 | 3044–3084 | tight L, bank R-up, level, bowl | yes, by hand | rate×2 (2) | xsec 0.86 | — | hand forms, chain8 |
| 40 | 3084–3168 | tight L, steep R-up, level, bowl | yes, by hand | corner×2 (2) | roll 0.95 | — | hand forms, chain8 |
| 41 | 3168–3244 | turn L, steep R-up, level, bowl | yes, by hand | corner×2 (2) | rim 0.81 | — | hand forms, chain8 |
| 42 | 3244–3296 | turn L, steep R-up, down, bowl | yes, by hand | corner×1 (1) | width 0.87 | — | hand forms, chain8 |
| 43 | 3296–3388 | sweep L, bank R-up, down, bowl | yes, by hand | corner×1 (1) | pitch 0.90 | — | hand forms, chain8 |
| 44 | 3388–3432 | sweep L, flat, level, bowl | yes, by hand | corner×1 (1) | rim 0.65 | — | hand forms, chain8 |
| 45 | 3432–3476 | sweep R, flat, level, bowl | yes, by hand | rate×1 (1) | kPeak 0.94 | — | hand forms, chain8 |
| 46 | 3476–3535 | straight, flat, up, bowl | yes, by hand | rate×1 (1) | kPeak 0.68 | — | hand forms, chain8 |
| 47 | 3658–3750 | straight, flat, down, bowl | yes, STEERED only | ghost8 (12) STEERED | kPeak 0.61 | hand forms miss: best rows+flow kPeak 1.68 | hand forms, ghost8, chain8 |
| 48 | 3750–3838 | straight, flat, level, bowl | yes, by hand | corner×1 (1) | pitch 0.86 | — | hand forms, chain8 |
| 49 | 3838–3926 | straight, flat, up, bowl | yes, by hand | corner×1 (1) | rim 0.98 | — | hand forms, chain8 |
| 50 | 4044–4220 | straight, flat, level, bowl | yes, by hand | corner×4 (4) | kPeak 0.85 | — | hand forms |
| 51 | 4220–4280 | turn R, bank L-up, up, bowl | yes, by hand | corner×2 (2) | kPeak 0.93 | — | hand forms |
| 52 | 4280–4344 | tight R, steep L-up, level, bowl | yes, by hand | rate×1 (1) | rim 0.88 | — | hand forms |
| 53 | 4344–4464 | turn R, steep L-up, level, bowl | yes, STEERED only | ghost8 (15) STEERED | rim 0.38 | hand forms miss: best corner×3 kPeak 1.01 | hand forms, ghost8 |
| 54 | 4464–4540 | turn R, bank L-up, level, bowl | yes, by hand | corner×2 (2) | bank 0.60 | — | hand forms |
| 55 | 4540–4604 | straight, flat, level, bowl | yes, STEERED only | ghost4 (16) STEERED | width 0.51 | hand forms miss: best corner×1 width 1.23 | hand forms, ghost8, ghost4 |
| 56 | 4604–4660 | straight, bank R-up, up, bowl | yes, STEERED only | ghost8 (7) STEERED | kPeak 0.55 | hand forms miss: best rate×2 headEnd 1.06 | hand forms, ghost8 |
| 57 | 4660–4740 | tight L, steep R-up, up, bowl | yes, STEERED only | ghost8 (10) STEERED | kPeak 0.56 | hand forms miss: best corner×2 roll 1.18 | hand forms, ghost8 |
| 58 | 4740–4780 | tight L, steep R-up, down, bowl | yes, by hand | corner×1 (1) | bank 0.95 | — | hand forms |
| 59 | 4780–4915 | straight, bank R-up, down, bowl | yes, STEERED only | ghost8 (17) STEERED | headEnd 0.93 | hand forms miss: best corner×4 kPeak 2.03 | hand forms, ghost8 |
| 60 | 4915–4971 | hairpin L, steep R-up, down, bowl | yes, STEERED only | ghost8 (7) STEERED | xsec 0.38 | hand forms miss: best corner×2 headEnd 1.24 | hand forms, ghost8 |
| 61 | 4971–5023 | turn L, flat, level, bowl | yes, by hand | corner×2 (2) | kPeak 0.82 | — | hand forms |
| 62 | 5023–5067 | turn R, bank L-up, up, bowl | yes, STEERED only | ghost8 (6) STEERED | width 0.95 | hand forms miss: best rate×2 width 1.25 | hand forms, ghost8 |
| 63 | 5067–5155 | tight R, steep L-up, up, bowl | yes, STEERED only | ghost8 (11) STEERED | headEnd 0.70 | hand forms miss: best corner×2 pitch 1.58 | hand forms, ghost8 |
| 64 | 5155–5255 | tight R, steep L-up, down, bowl | yes, STEERED only | ghost4 (25) STEERED | roll 0.89 | hand forms miss: best corner×2 bank 1.47 | hand forms, ghost8, ghost4 |
| 65 | 5255–5295 | sweep L, flat, level, bowl | yes, STEERED only | ghost8 (5) STEERED | width 0.85 | hand forms miss: best corner×1 width 1.43 | hand forms, ghost8 |
| 66 | 5295–5347 | tight L, bank R-up, up, bowl | yes, by hand | corner×2 (2) | bank 0.90 | — | hand forms |
| 67 | 5347–5435 | turn L, bank R-up, level, bowl | yes, by hand | corner×2 (2) | width 0.94 | — | hand forms |
| 68 | 5435–5495 | straight, bank R-up, level, bowl | yes, STEERED only | ghost4 (15) STEERED | headEnd 0.91 | hand forms miss: best rate×2 headEnd 1.90 | hand forms, ghost8, ghost4 |
| 69 | 5495–5559 | tight L, bank R-up, level, bowl | yes, STEERED only | ghost8 (8) STEERED | rim 0.63 | hand forms miss: best corner×2 pitch 2.77 | hand forms, ghost8 |
| 70 | 5559–5603 | tight R, steep L-up, up, bowl | yes, STEERED only | ghost8 (6) STEERED | headEnd 0.91 | hand forms miss: best corner×2 headEnd 3.12 | hand forms, ghost8 |
| 71 | 5603–5739 | tight R, vsteep L-up, level, bowl | yes, STEERED only | ghost8 (17) STEERED | roll 0.61 | hand forms miss: best corner×3 posH 1.50 | hand forms, ghost8 |
| 72 | 5739–5815 | turn R, steep L-up, down, bowl | yes, STEERED only | window8 (10) STEERED | xsec 0.45 | hand forms miss: best corner×2 rim 1.02 | hand forms, ghost8, ghost4, window8 |
| 73 | 5815–5879 | tight R, bank L-up, level, bowl | yes, STEERED only | ghost4 (16) STEERED | headEnd 0.90 | hand forms miss: best corner×2 bank 1.16 | hand forms, ghost8, ghost4 |
| 74 | 5879–5939 | tight L, steep R-up, UP, bowl | yes, STEERED only | ghost8 (8) STEERED | width 0.50 | hand forms miss: best corner×2 bank 1.39 | hand forms, ghost8 |
| 75 | 5939–5987 | turn L, steep R-up, up, bowl | yes, STEERED only | ghost8 (6) STEERED | kPeak 0.91 | hand forms miss: best corner×2 rim 1.11 | hand forms, ghost8 |
| 76 | 5987–6091 | turn L, steep R-up, level, bowl | yes, STEERED only | ghost8 (13) STEERED | width 0.77 | hand forms miss: best corner×1 rim 1.12 | hand forms, ghost8 |
| 77 | 6091–6155 | straight, bank R-up, level, bowl | yes, by hand | rate×3 (3) | bank 0.88 | — | hand forms |
| 78 | 6155–6219 | turn R, steep L-up, up, bowl | yes, STEERED only | ghost8 (8) STEERED | xsec 0.53 | hand forms miss: best corner×2 bank 1.14 | hand forms, ghost8 |
| 79 | 6219–6367 | turn R, steep L-up, level, bowl | yes, by hand | corner×4 (4) | pitch 0.71 | — | hand forms |
| 80 | 6367–6451 | turn R, bank L-up, level, bowl | yes, by hand | corner×1 (1) | bank 0.60 | — | hand forms |
| 81 | 6451–6535 | straight, bank L-up, level, bowl | yes, STEERED only | ghost8 (11) STEERED | kPeak 1.00 | hand forms miss: best corner×2 kPeak 1.85 | hand forms, ghost8 |
| 82 | 6535–6659 | tight R, steep L-up, level, bowl | yes, by hand | rate×5 (5) | posV 0.68 | — | hand forms |
| 83 | 6659–6727 | tight R, steep L-up, down, bowl | yes, by hand | rate×3 (3) | headEnd 0.51 | — | hand forms |
| 84 | 6727–6775 | tight R, steep L-up, level, bowl | yes, by hand | rate×2 (2) | headEnd 0.61 | — | hand forms |
| 85 | 6775–6819 | tight R, steep L-up, down, bowl | yes, by hand | rate×1 (1) | headEnd 0.92 | — | hand forms |
| 86 | 6819–7103 | tight R, steep L-up, level, bowl | yes, STEERED only | window8 (36) STEERED | rim 0.80 | hand forms miss: best corner×6 kPeak 2.00 | hand forms, ghost8, ghost4, window8 |
| 87 | 7103–7227 | tight R, steep L-up, down, bowl | yes, by hand | rate×5 (5) | rim 0.86 | — | hand forms |
| 88 | 7227–7271 | sweep R, bank L-up, down, bowl | yes, by hand | corner×2 (2) | xsec 0.80 | — | hand forms |
| 89 | 7271–7403 | tight L, steep R-up, level, bowl | yes, STEERED only | ghost8 (17) STEERED | rim 0.59 | hand forms miss: best rate×5 bank 1.59 | hand forms, ghost8 |
| 90 | 7403–7459 | tight R, bank L-up, level, bowl | yes, STEERED only | ghost8 (7) STEERED | headEnd 0.61 | hand forms miss: best corner×2 headEnd 1.23 | hand forms, ghost8 |
| 91 | 7459–7507 | tight R, steep L-up, level, bowl | yes, by hand | corner×1 (1) | pitch 0.62 | — | hand forms |
| 92 | 7507–7595 | tight R, steep L-up, up, bowl | yes, STEERED only | ghost8 (11) STEERED | rim 0.52 | hand forms miss: best corner×2 posH 1.11 | hand forms, ghost8 |
| 93 | 7595–7667 | turn R, bank L-up, UP, bowl | yes, by hand | corner×2 (2) | bank 0.82 | — | hand forms |
| 94 | 7667–7739 | tight L, steep R-up, UP, bowl | yes, STEERED only | ghost8 (9) STEERED | kPeak 0.48 | hand forms miss: best corner×2 bank 1.17 | hand forms, ghost8 |
| 95 | 7739–7851 | turn L, vsteep R-up, level, bowl | yes, by hand | corner×3 (3) | width 0.86 | — | hand forms |
| 96 | 7851–8027 | turn L, vsteep R-up, down, bowl | yes, STEERED only | ghost8 (22) STEERED | headEnd 0.67 | hand forms miss: best corner×4 kPeak 1.22 | hand forms, ghost8 |
| 97 | 8027–8115 | turn L, steep R-up, level, bowl | yes, by hand | corner×2 (2) | bank 0.62 | — | hand forms |
| 98 | 8115–8159 | sweep L, bank R-up, level, bowl | yes, by hand | corner×2 (2) | xsec 0.56 | — | hand forms |
| 99 | 8159–8211 | straight, bank R-up, level, bowl | yes, by hand | corner×1 (1) | rim 0.78 | — | hand forms |
| 100 | 8211–8271 | sweep R, flat, level, bowl | yes, by hand | corner×2 (2) | kPeak 0.97 | — | hand forms |
| 101 | 8271–8311 | straight, flat, level, bowl | yes, by hand | corner×1 (1) | rim 0.76 | — | hand forms |
| 102 | 8311–8367 | turn R, bank L-up, level, bowl | yes, STEERED only | ghost8 (7) STEERED | kPeak 0.78 | hand forms miss: best corner×2 kPeak 1.71 | hand forms, ghost8 |
| 103 | 8367–8515 | tight R, steep L-up, level, bowl | yes, STEERED only | ghost8 (19) STEERED | headEnd 0.74 | hand forms miss: best corner×4 kPeak 1.43 | hand forms, ghost8 |
| 104 | 8515–8647 | sweep R, steep L-up, down, bowl | yes, by hand | rate×5 (5) | bank 0.72 | — | hand forms |
| 105 | 8647–8707 | turn L, flat, level, bowl | yes, by hand | corner×2 (2) | kPeak 0.87 | — | hand forms |
| 106 | 8707–8755 | tight L, steep R-up, up, bowl | yes, by hand | rate×2 (2) | bank 0.85 | — | hand forms |
| 107 | 8755–8795 | tight L, vsteep R-up, up, bowl | yes, by hand | corner×1 (1) | bank 0.81 | — | hand forms |
| 108 | 8795–8839 | tight L, vsteep R-up, level, bowl | yes, by hand | rate×2 (2) | rim 0.77 | — | hand forms |
| 109 | 8839–8915 | turn L, steep R-up, down, bowl | yes, by hand | corner×2 (2) | bank 0.92 | — | hand forms |
| 110 | 8915–9003 | straight, bank R-up, down, bowl | yes, by hand | rate×4 (4) | headEnd 0.98 | — | hand forms |
| 111 | 9003–9047 | turn L, steep R-up, level, bowl | yes, by hand | rate×2 (2) | headEnd 0.69 | — | hand forms |
| 112 | 9047–9215 | tight L, steep R-up, level, bowl | yes, STEERED only | ghost8 (21) STEERED | rim 0.58 | hand forms miss: best corner×4 kPeak 1.03 | hand forms, ghost8 |
| 113 | 9215–9311 | turn L, steep R-up, down, bowl | yes, STEERED only | ghost8 (12) STEERED | rim 0.54 | hand forms miss: best corner×2 bank 1.37 | hand forms, ghost8 |
| 114 | 9311–9383 | turn R, bank L-up, level, bowl | yes, STEERED only | ghost8 (9) STEERED | xsec 0.42 | hand forms miss: best rows+flow bank 1.07 | hand forms, ghost8 |
| 115 | 9383–9451 | turn R, steep L-up, level, bowl | yes, by hand | corner×2 (2) | rim 0.55 | — | hand forms |
| 116 | 9451–9567 | straight, bank L-up, level, bowl | yes, by hand | corner×3 (3) | kPeak 0.67 | — | hand forms |
| 117 | 9567–9615 | turn R, bank L-up, level, bowl | yes, by hand | corner×1 (1) | kPeak 0.94 | — | hand forms |
| 118 | 9615–9703 | tight R, steep L-up, level, bowl | yes, by hand | corner×2 (2) | posH 0.93 | — | hand forms |
| 119 | 9703–9759 | turn R, bank L-up, level, bowl | yes, by hand | corner×2 (2) | kPeak 0.99 | — | hand forms |
| 120 | 9759–9839 | sweep L, bank R-up, up, bowl | yes, STEERED only | ghost8 (10) STEERED | kPeak 0.86 | hand forms miss: best rate×3 headEnd 1.64 | hand forms, ghost8 |
| 121 | 9839–9939 | tight L, steep R-up, up, bowl | yes, STEERED only | ghost8 (13) STEERED | headEnd 0.53 | hand forms miss: best rate×4 posV 1.27 | hand forms, ghost8 |
| 122 | 9939–9999 | turn L, bank R-up, down, bowl | yes, by hand | corner×1 (1) | bank 0.88 | — | hand forms |
| 123 | 9999–10071 | sweep L, flat, level, bowl | yes, STEERED only | ghost8 (9) STEERED | width 0.65 | hand forms miss: best corner×2 width 1.40 | hand forms, ghost8 |
| 124 | 10071–10111 | sweep R, flat, level, bowl | yes, by hand | corner×1 (1) | kPeak 0.70 | — | hand forms |
| 125 | 10111–10271 | straight, flat, level, bowl | yes, STEERED only | ghost8 (20) STEERED | kPeak 0.76 | hand forms miss: best corner×4 kPeak 1.12 | hand forms, ghost8 |
| 126 | 10271–10331 | sweep R, flat, level, bowl | yes, by hand | corner×1 (1) | kPeak 0.92 | — | hand forms |
| 127 | 10331–10407 | turn R, bank L-up, level, bowl | yes, by hand | corner×2 (2) | bank 0.88 | — | hand forms |
| 128 | 10407–10487 | tight R, steep L-up, up, bowl | yes, by hand | rate×3 (3) | posH 0.84 | — | hand forms |
| 129 | 10487–10659 | tight R, vsteep L-up, up, bowl | yes, STEERED only | ghost8 (22) STEERED | kPeak 0.70 | hand forms miss: best corner×4 width 1.28 | hand forms, ghost8 |
| 130 | 10659–10763 | sweep R, steep L-up, up, bowl | yes, STEERED only | ghost8 (13) STEERED | roll 0.83 | hand forms miss: best rate×4 bank 1.01 | hand forms, ghost8 |
| 131 | 10763–10811 | turn L, flat, UP, bowl | yes, STEERED only | ghost8 (6) STEERED | kPeak 0.65 | hand forms miss: best corner×2 xsec 1.22 | hand forms, ghost8 |
| 132 | 10811–10895 | turn L, steep R-up, down, bowl | yes, STEERED only | ghost8 (11) STEERED | headEnd 0.67 | hand forms miss: best corner×2 bank 1.44 | hand forms, ghost8 |
| 133 | 10895–10979 | turn R, flat, down, bowl | yes, STEERED only | ghost8 (11) STEERED | xsec 0.48 | hand forms miss: best corner×1 bank 1.35 | hand forms, ghost8 |
| 134 | 10979–11039 | sweep R, bank L-up, level, bowl | yes, by hand | corner×1 (1) | bank 0.81 | — | hand forms |
| 135 | 11039–11131 | turn R, steep L-up, level, bowl | yes, by hand | corner×1 (1) | rim 0.96 | — | hand forms |
| 136 | 11131–11183 | sweep R, steep L-up, level, bowl | yes, by hand | corner×1 (1) | rim 0.54 | — | hand forms |
| 137 | 11183–11703 | turn R, steep L-up, level, bowl | yes, STEERED only | ghost8 (65) STEERED | rim 0.86 | hand forms miss: best corner×6 rim 1.62 | hand forms, ghost8 |
| 138 | 11703–12035 | tight R, steep L-up, level, bowl | yes, STEERED only | ghost8 (42) STEERED | rim 0.52 | hand forms miss: best corner×6 kPeak 1.55 | hand forms, ghost8, ghost4 |
| 139 | 12035–12083 | turn R, bank L-up, level, bowl | yes, by hand | corner×2 (2) | kPeak 0.84 | — | hand forms |
| 140 | 12083–12159 | sweep R, flat, UP, bowl | yes, by hand | corner×2 (2) | pitch 0.85 | — | hand forms |
| 141 | 12159–12314 | straight, flat, UP, bowl | yes, by hand | corner×2 (2) | posV 1.00 | — | hand forms |
| 142 | 12532–12788 | straight, flat, DOWN, bowl | yes, STEERED only | ghost8 (32) STEERED | rim 0.66 | hand forms miss: best corner×6 kPeak 1.07 | hand forms, ghost8, chain8 |
| 143 | 12788–12836 | straight, bank R-up, DOWN, bowl | yes, by hand | corner×1 (1) | kPeak 0.83 | — | hand forms, chain8 |
| 144 | 12836–12880 | turn L, bank R-up, DOWN, bowl | yes, by hand | corner×1 (1) | roll 0.70 | — | hand forms, chain8 |
| 145 | 12880–12988 | tight L, steep R-up, down, bowl | yes, by hand | corner×3 (3) | headEnd 0.93 | — | hand forms, chain8 |
| 146 | 12988–13080 | tight L, steep R-up, down, bowl | yes, by hand | corner×2 (2) | width 0.91 | — | hand forms, chain8 |
| 147 | 13080–13196 | turn L, steep R-up, level, bowl | yes, by hand | corner×3 (3) | bank 0.69 | — | hand forms, chain8 |
| 148 | 13196–13240 | straight, bank R-up, level, bowl | yes, by hand | corner×2 (2) | xsec 0.52 | — | hand forms, chain8 |
| 149 | 13240–13320 | sweep R, flat, UP, bowl | yes, STEERED only | ghost8 (10) STEERED | kPeak 0.58 | hand forms miss: best rate×3 kPeak 1.27 | hand forms, ghost8, chain8 |
| 150 | 13320–13376 | tight R, steep L-up, UP, bowl | yes, STEERED only | ghost8 (7) STEERED | posV 0.91 | hand forms miss: best rate×2 bank 1.01 | hand forms, ghost8, chain8 |
| 151 | 13376–13452 | hairpin R, vsteep L-up, UP, bowl | yes, STEERED only | ghost8 (10) STEERED | roll 0.62 | hand forms miss: best rate×3 pitch 2.12 | hand forms, ghost8, chain8 |
| 152 | 13452–13528 | hairpin R, vsteep L-up, DOWN, bowl | yes, STEERED only | chain8 (10) STEERED | posV 0.56 | hand forms miss: best corner×2 pitch 2.83 | hand forms, ghost8, ghost4, chain8 |
| 153 | 13528–13580 | sweep R, bank L-up, DOWN, bowl | yes, STEERED only | chain8 (7) STEERED | posV 0.46 | hand forms miss: best corner×2 pitch 1.36 | hand forms, ghost8, ghost4, chain8 |
| 154 | 13580–13624 | straight, flat, level, bowl | yes, by hand | corner×1 (1) | kPeak 0.70 | — | hand forms, chain8 |
| 155 | 13624–13752 | turn L, bank R-up, level, bowl | yes, by hand | corner×3 (3) | bank 0.92 | — | hand forms, chain8 |
| 156 | 13752–13804 | straight, flat, level, bowl | yes, by hand | corner×2 (2) | kPeak 0.95 | — | hand forms, chain8 |
| 157 | 13804–13944 | turn R, steep L-up, level, bowl | yes, by hand | corner×4 (4) | width 0.87 | — | hand forms, chain8 |
| 158 | 13944–14000 | turn R, bank L-up, level, bowl | yes, STEERED only | window8-2pass (7) STEERED | kPeak 0.55 | hand forms miss: best rate×2 kPeak 1.36 | hand forms, ghost8, ghost4, window8, window8-2pass, chain8 |
| 159 | 14000–14044 | sweep R, flat, level, bowl | yes, by hand | corner×1 (1) | rim 0.87 | — | hand forms, chain8 |
| 160 | 14044–14172 | straight, flat, up, bowl | yes, STEERED only | ghost8 (16) STEERED | headEnd 0.73 | hand forms miss: best rows+flow bank 1.82 | hand forms, ghost8, chain8 |
| 161 | 14172–14216 | turn R, steep L-up, up, bowl | yes, STEERED only | ghost8 (6) STEERED | kPeak 0.80 | hand forms miss: best corner×1 kPeak 1.02 | hand forms, ghost8, chain8 |
| 162 | 14216–14332 | tight R, steep L-up, up, bowl | yes, STEERED only | ghost8 (15) STEERED | rim 0.52 | hand forms miss: best corner×3 kPeak 1.46 | hand forms, ghost8, chain8 |
| 163 | 14332–14412 | sweep R, bank L-up, up, bowl | yes, by hand | corner×2 (2) | bank 0.79 | — | hand forms, chain8 |
| 164 | 14412–14514 | straight, flat, up, bowl | yes, STEERED only | window4-2pass (26) STEERED | rim 0.93 | hand forms miss: best rate×4 rim 1.24 | hand forms, ghost8, ghost4, window8-2pass, window4-2pass, chain8 |
| 165 | 14712–14788 | straight, flat, level, bowl | yes, by hand | rate×3 (3) | xsec 0.44 | — | hand forms |
| 166 | 14788–14840 | tight L, bank R-up, level, bowl | yes, STEERED only | window8 (7) STEERED | kPeak 0.44 | hand forms miss: best corner×2 kPeak 2.02 | hand forms, ghost8, ghost4, window8 |
| 167 | 14840–14924 | tight L, vsteep R-up, down, bowl | yes, STEERED only | ghost8 (11) STEERED | rim 0.88 | hand forms miss: best corner×2 bank 1.86 | hand forms, ghost8 |
| 168 | 14924–14996 | straight, bank R-up, level, bowl | yes, by hand | rate×3 (3) | headEnd 0.83 | — | hand forms |
| 169 | 14996–15036 | straight, bank L-up, UP, bowl | yes, by hand | rate×2 (2) | headEnd 0.87 | — | hand forms |
| 170 | 15036–15092 | tight R, steep L-up, level, bowl | yes, by hand | corner×2 (2) | bank 0.80 | — | hand forms |
| 171 | 15092–15184 | sweep R, steep L-up, down, bowl | yes, by hand | corner×1 (1) | pitch 0.90 | — | hand forms |
| 172 | 15184–15240 | turn R, bank L-up, down, bowl | yes, by hand | corner×2 (2) | bank 0.65 | — | hand forms |
| 173 | 15240–15332 | turn L, bank R-up, level, bowl | yes, STEERED only | ghost8 (12) STEERED | rim 0.88 | hand forms miss: best corner×2 kPeak 1.07 | hand forms, ghost8 |
| 174 | 15332–15412 | sweep L, steep R-up, down, bowl | yes, by hand | corner×2 (2) | width 0.93 | — | hand forms |
| 175 | 15412–15472 | straight, steep R-up, down, bowl | yes, by hand | corner×1 (1) | width 0.49 | — | hand forms |
| 176 | 15472–15580 | straight, bank R-up, down, bowl | yes, by hand | corner×1 (1) | rim 1.00 | — | hand forms |
| 177 | 15580–15708 | sweep L, bank R-up, level, bowl | yes, STEERED only | ghost8 (16) STEERED | width 0.28 | hand forms miss: best corner×2 kPeak 1.28 | hand forms, ghost8 |
| 178 | 15708–15800 | tight L, steep R-up, level, bowl | yes, by hand | corner×2 (2) | posH 0.88 | — | hand forms |
| 179 | 15800–15872 | turn L, steep R-up, level, bowl | yes, STEERED only | ghost8 (9) STEERED | width 0.83 | hand forms miss: best corner×2 width 1.46 | hand forms, ghost8 |
| 180 | 15872–15944 | turn L, bank R-up, down, bowl | yes, by hand | rate×1 (1) | bank 0.94 | — | hand forms |
| 181 | 15944–16024 | sweep L, flat, level, bowl | yes, STEERED only | ghost8 (10) STEERED | width 0.90 | hand forms miss: best rate×3 headEnd 1.17 | hand forms, ghost8 |
| 182 | 16024–16076 | turn L, bank R-up, level, bowl | yes, STEERED only | ghost8 (7) STEERED | kPeak 0.79 | hand forms miss: best rate×1 roll 1.20 | hand forms, ghost8 |
| 183 | 16076–16128 | tight L, steep R-up, level, bowl | yes, STEERED only | ghost8 (7) STEERED | rim 0.51 | hand forms miss: best rate×2 rim 1.12 | hand forms, ghost8 |
| 184 | 16128–16180 | turn L, bank R-up, level, bowl | yes, by hand | corner×2 (2) | bank 0.60 | — | hand forms |
| 185 | 16180–16232 | sweep L, flat, up, bowl | yes, by hand | corner×1 (1) | width 0.48 | — | hand forms |
| 186 | 16232–16304 | straight, flat, up, bowl | yes, by hand | corner×1 (1) | xsec 0.46 | — | hand forms |
| 187 | 16409–16501 | straight, flat, level, bowl | yes, STEERED only | ghost8 (12) STEERED | kPeak 0.94 | hand forms miss: best rate×3 rim 1.03 | hand forms, ghost8 |
| 188 | 16501–16553 | tight R, bank L-up, up, bowl | yes, STEERED only | window8 (7) STEERED | kPeak 0.47 | hand forms miss: best corner×2 kPeak 1.70 | hand forms, ghost8, ghost4, window8 |
| 189 | 16553–16669 | tight R, vsteep L-up, down, bowl | yes, STEERED only | window8 (15) STEERED | rim 0.45 | hand forms miss: best corner×3 bank 1.39 | hand forms, ghost8, ghost4, window8 |
| 190 | 16669–16749 | tight R, bank L-up, down, bowl | yes, STEERED only | ghost8 (10) STEERED | xsec 0.71 | hand forms miss: best corner×2 kPeak 1.10 | hand forms, ghost8 |
| 191 | 16749–16797 | turn L, flat, up, bowl | yes, STEERED only | ghost4 (12) STEERED | headEnd 0.42 | hand forms miss: best rate×2 bank 1.12 | hand forms, ghost8, ghost4 |
| 192 | 16797–16861 | tight L, vsteep R-up, UP, bowl | yes, STEERED only | ghost8 (8) STEERED | roll 1.00 | hand forms miss: best corner×2 pitch 1.12 | hand forms, ghost8 |
| 193 | 16861–16925 | turn L, vsteep R-up, up, bowl | yes, STEERED only | ghost8 (8) STEERED | pitch 0.36 | hand forms miss: best corner×2 pitch 1.04 | hand forms, ghost8 |
| 194 | 16925–16969 | turn L, vsteep R-up, down, bowl | yes, STEERED only | ghost8 (6) STEERED | headEnd 0.76 | hand forms miss: best corner×1 pitch 1.19 | hand forms, ghost8 |
| 195 | 16969–17053 | tight L, vsteep R-up, DOWN, bowl | yes, STEERED only | ghost8 (11) STEERED | headEnd 0.80 | hand forms miss: best corner×2 kPeak 1.47 | hand forms, ghost8 |
| 196 | 17053–17113 | tight L, vsteep R-up, down, bowl | yes, by hand | corner×1 (1) | posH 0.86 | — | hand forms |
| 197 | 17113–17189 | turn L, steep R-up, down, bowl | yes, by hand | corner×2 (2) | pitch 0.87 | — | hand forms |
| 198 | 17189–17229 | straight, bank R-up, level, bowl | yes, by hand | corner×1 (1) | kPeak 0.69 | — | hand forms |
| 199 | 17229–17321 | straight, flat, level, bowl | yes, STEERED only | ghost4 (23) STEERED | rim 0.54 | hand forms miss: best corner×2 rim 1.09 | hand forms, ghost8, ghost4 |
| 200 | 17321–17361 | sweep R, flat, level, bowl | yes, by hand | rate×1 (1) | kPeak 0.98 | — | hand forms |
| 201 | 17361–17401 | straight, bank L-up, up, bowl | yes, by hand | corner×2 (2) | kPeak 0.88 | — | hand forms |
| 202 | 17401–17505 | tight R, steep L-up, UP, bowl | yes, STEERED only | ghost8 (13) STEERED | pitch 0.71 | hand forms miss: best rate×4 pitch 1.27 | hand forms, ghost8 |
| 203 | 17505–17565 | sweep R, bank L-up, down, bowl | yes, by hand | corner×2 (2) | bank 0.79 | — | hand forms |
| 204 | 17565–17621 | sweep L, flat, level, bowl | yes, STEERED only | ghost8 (7) STEERED | kPeak 0.88 | hand forms miss: best corner×1 kPeak 1.20 | hand forms, ghost8 |
| 205 | 17621–17673 | tight L, bank R-up, up, bowl | yes, STEERED only | window8 (7) STEERED | rim 0.58 | hand forms miss: best corner×2 kPeak 2.69 | hand forms, ghost8, ghost4, window8 |
| 206 | 17673–17729 | hairpin L, steep R-up, level, bowl | yes, STEERED only | ghost8 (7) STEERED | headEnd 0.83 | hand forms miss: best corner×1 bank 1.88 | hand forms, ghost8 |
| 207 | 17729–17777 | turn L, bank R-up, down, bowl | yes, by hand | corner×1 (1) | bank 0.98 | — | hand forms |
| 208 | 17777–17865 | sweep L, flat, level, bowl | yes, STEERED only | ghost8 (11) STEERED | kPeak 0.91 | hand forms miss: best rate×4 headEnd 1.01 | hand forms, ghost8 |
| 209 | 17865–17917 | turn L, bank R-up, up, bowl | yes, by hand | rate×2 (2) | width 0.97 | — | hand forms |
| 210 | 17917–17993 | turn L, steep R-up, up, bowl | yes, STEERED only | rows+flow (1) STEERED | width 1.00 | hand forms miss: best rows+flow width 1.00 | hand forms |
| 211 | 17993–18129 | tight L, vsteep R-up, level, bowl | yes, STEERED only | ghost8 (17) STEERED | headEnd 0.72 | hand forms miss: best corner×3 posV 1.00 | hand forms, ghost8 |
| 212 | 18129–18193 | turn L, vsteep R-up, level, bowl | yes, by hand | corner×2 (2) | pitch 0.61 | — | hand forms |
| 213 | 18193–18245 | straight, steep R-up, down, bowl | yes, STEERED only | ghost8 (7) STEERED | width 0.80 | hand forms miss: best corner×2 width 1.16 | hand forms, ghost8 |
| 214 | 18245–18325 | straight, bank R-up, down, bowl | yes, by hand | corner×2 (2) | bank 0.91 | — | hand forms |
| 215 | 18325–18405 | straight, flat, level, bowl | yes, STEERED only | ghost8 (10) STEERED | rim 0.82 | hand forms miss: best rate×3 headEnd 1.20 | hand forms, ghost8 |
| 216 | 18405–18457 | sweep L, bank R-up, up, bowl | yes, STEERED only | window8 (7) STEERED | kPeak 0.41 | hand forms miss: best rate×2 width 1.87 | hand forms, ghost8, ghost4, window8 |
| 217 | 18457–18529 | tight L, bank R-up, level, bowl | yes, STEERED only | ghost8 (9) STEERED | headEnd 0.76 | hand forms miss: best rate×3 posV 1.22 | hand forms, ghost8 |
| 218 | 18529–18577 | tight R, bank L-up, up, bowl | yes, STEERED only | ghost8 (6) STEERED | kPeak 0.53 | hand forms miss: best rate×2 headEnd 1.08 | hand forms, ghost8 |
| 219 | 18577–18729 | tight R, steep L-up, level, bowl | yes, by hand | corner×4 (4) | width 0.83 | — | hand forms |
| 220 | 18729–18857 | turn R, vsteep L-up, level, bowl | yes, by hand | corner×3 (3) | pitch 0.86 | — | hand forms |
| 221 | 18857–18897 | sweep R, vsteep L-up, level, bowl | yes, by hand | corner×1 (1) | rim 0.50 | — | hand forms |
| 222 | 18897–18997 | straight, vsteep L-up, level, bowl | yes, by hand | corner×3 (3) | width 1.00 | — | hand forms |
| 223 | 18997–19049 | sweep R, vsteep L-up, level, bowl | yes, by hand | corner×1 (1) | pitch 0.65 | — | hand forms |
| 224 | 19049–19133 | straight, vsteep L-up, level, bowl | yes, by hand | corner×1 (1) | pitch 1.00 | — | hand forms |
| 225 | 19133–19265 | turn R, steep L-up, level, bowl | yes, STEERED only | ghost4 (33) STEERED | xsec 0.31 | hand forms miss: best corner×3 xsec 1.26 | hand forms, ghost8, ghost4 |
| 226 | 19265–19329 | turn L, bank R-up, up, bowl | yes, by hand | corner×2 (2) | kPeak 0.86 | — | hand forms |
| 227 | 19329–19405 | tight L, steep R-up, up, bowl | yes, by hand | corner×2 (2) | pitch 0.67 | — | hand forms |
| 228 | 19405–19633 | turn L, steep R-up, level, bowl | yes, by hand | corner×6 (6) | width 0.98 | — | hand forms |
| 229 | 19633–19677 | sweep L, steep R-up, level, bowl | yes, by hand | corner×1 (1) | pitch 0.76 | — | hand forms |
| 230 | 19677–19765 | straight, steep R-up, level, bowl | yes, by hand | corner×1 (1) | kPeak 0.95 | — | hand forms |
| 231 | 19765–19817 | straight, steep R-up, down, bowl | yes, by hand | corner×2 (2) | width 0.90 | — | hand forms |
| 232 | 19817–19949 | straight, bank R-up, down, bowl | yes, STEERED only | window8 (17) STEERED | kPeak 0.98 | hand forms miss: best rate×1 kPeak 1.89 | hand forms, ghost8, ghost4, window8 |
| 233 | 19949–20045 | sweep L, flat, down, bowl | yes, by hand | corner×2 (2) | width 1.00 | — | hand forms |
| 234 | 20045–20085 | turn R, flat, level, bowl | yes, by hand | rate×1 (1) | rim 1.00 | — | hand forms |
| 235 | 20085–20133 | tight R, bank L-up, level, bowl | yes, by hand | rate×2 (2) | rim 0.73 | — | hand forms |
| 236 | 20133–20181 | hairpin R, steep L-up, level, bowl | yes, by hand | corner×1 (1) | bank 0.92 | — | hand forms |
| 237 | 20181–20301 | tight R, steep L-up, down, bowl | yes, STEERED only | ghost8 (15) STEERED | rim 0.47 | hand forms miss: best rate×5 rim 1.02 | hand forms, ghost8 |
| 238 | 20301–20373 | turn R, bank L-up, down, bowl | yes, by hand | rate×3 (3) | width 0.89 | — | hand forms |
| 239 | 20373–20441 | turn R, flat, level, bowl | yes, by hand | rate×3 (3) | kPeak 0.77 | — | hand forms |
| 240 | 20441–20513 | tight L, steep R-up, level, bowl | yes, STEERED only | ghost8 (9) STEERED | kPeak 0.68 | hand forms miss: best rate×3 rim 1.29 | hand forms, ghost8 |
| 241 | 20513–20569 | turn L, bank R-up, down, bowl | yes, STEERED only | ghost8 (7) STEERED | kPeak 0.85 | hand forms miss: best corner×2 width 1.21 | hand forms, ghost8 |
| 242 | 20569–20645 | straight, flat, level, bowl | yes, STEERED only | ghost4 (19) STEERED | xsec 0.39 | hand forms miss: best rate×3 rim 1.14 | hand forms, ghost8, ghost4 |
| 243 | 20645–20725 | tight R, bank L-up, up, bowl | yes, STEERED only | ghost8 (10) STEERED | rim 0.76 | hand forms miss: best corner×2 pitch 1.60 | hand forms, ghost8 |
| 244 | 20725–20773 | tight R, bank L-up, down, bowl | yes, by hand | corner×2 (2) | bank 0.57 | — | hand forms |
| 245 | 20773–20829 | sweep R, flat, level, bowl | yes, by hand | corner×2 (2) | roll 0.69 | — | hand forms |
| 246 | 20829–20905 | tight R, bank L-up, up, bowl | yes, STEERED only | ghost8 (10) STEERED | posH 0.28 | hand forms miss: best corner×2 headEnd 1.74 | hand forms, ghost8 |
| 247 | 20905–20949 | tight R, bank L-up, down, bowl | yes, by hand | corner×2 (2) | kPeak 0.80 | — | hand forms |
| 248 | 20949–21001 | straight, flat, down, bowl | yes, by hand | corner×2 (2) | roll 0.85 | — | hand forms |
| 249 | 21001–21049 | sweep R, bank L-up, level, bowl | yes, STEERED only | window8 (6) STEERED | width 0.93 | hand forms miss: best rate×2 width 1.25 | hand forms, ghost8, ghost4, window8 |
| 250 | 21049–21165 | hairpin R, steep L-up, level, bowl | yes, STEERED only | ghost8 (15) STEERED | rim 0.43 | hand forms miss: best corner×3 posH 1.89 | hand forms, ghost8 |
| 251 | 21165–21217 | sweep R, bank L-up, level, bowl | yes, by hand | corner×2 (2) | rim 0.98 | — | hand forms |
| 252 | 21217–21309 | straight, flat, up, bowl | yes, STEERED only | ghost8 (12) STEERED | kPeak 0.59 | hand forms miss: best corner×2 width 1.15 | hand forms, ghost8 |
| 253 | 21309–21365 | sweep R, flat, up, bowl | yes, STEERED only | ghost8 (7) STEERED | kPeak 0.95 | hand forms miss: best corner×1 kPeak 1.85 | hand forms, ghost8 |
| 254 | 21365–21417 | straight, flat, level, bowl | yes, by hand | corner×2 (2) | kPeak 0.94 | — | hand forms |
| 255 | 21417–21457 | sweep L, flat, level, bowl | yes, by hand | corner×1 (1) | bank 0.49 | — | hand forms |
| 256 | 21457–21509 | sweep R, bank L-up, level, bowl | yes, STEERED only | ghost8 (7) STEERED | kPeak 0.85 | hand forms miss: best corner×2 kPeak 3.02 | hand forms, ghost8 |
| 257 | 21509–21589 | hairpin R, steep L-up, level, bowl | yes, STEERED only | ghost8 (10) STEERED | roll 0.66 | hand forms miss: best corner×2 posH 1.49 | hand forms, ghost8 |
| 258 | 21589–21645 | tight R, bank L-up, level, bowl | yes, STEERED only | window8 (7) STEERED | kPeak 0.53 | hand forms miss: best corner×2 width 1.34 | hand forms, ghost8, ghost4, window8 |
| 259 | 21645–21697 | sweep R, flat, up, bowl | yes, STEERED only | ghost8 (7) STEERED | kPeak 0.46 | hand forms miss: best corner×1 kPeak 2.22 | hand forms, ghost8 |
| 260 | 21697–21793 | straight, flat, UP, bowl | yes, by hand | rate×4 (4) | kPeak 0.58 | — | hand forms |
| 261 | 21793–21841 | sweep L, flat, UP, bowl | yes, STEERED only | ghost8 (6) STEERED | kPeak 0.53 | hand forms miss: best corner×1 kPeak 1.34 | hand forms, ghost8 |
| 262 | 21841–21917 | straight, flat, UP, bowl | yes, STEERED only | ghost8 (10) STEERED | roll 0.80 | hand forms miss: best rate×3 headEnd 1.29 | hand forms, ghost8 |
| 263 | 21917–21961 | sweep R, bank L-up, UP, bowl | yes, by hand | corner×2 (2) | kPeak 0.80 | — | hand forms |
| 264 | 21961–22077 | tight R, steep L-up, UP, bowl | yes, STEERED only | ghost8 (15) STEERED | rim 0.56 | hand forms miss: best rate×5 rim 1.11 | hand forms, ghost8 |
| 265 | 22077–22117 | turn R, bank L-up, level, bowl | yes, by hand | corner×1 (1) | bank 0.93 | — | hand forms |
| 266 | 22117–22357 | straight, flat, level, bowl | yes, by hand | rate×10 (10) | rim 0.86 | — | hand forms |
| 267 | 22357–22423 | straight, flat, down, bowl | yes, by hand | corner×2 (2) | width 0.94 | — | hand forms |
| 268 | 22657–22845 | straight, flat, DOWN, bowl | yes, STEERED only | ghost8 (24) STEERED | kPeak 0.82 | hand forms miss: best corner×5 rim 1.20 | hand forms, ghost8 |
| 269 | 22845–22885 | sweep L, flat, down, bowl | yes, by hand | corner×2 (2) | kPeak 0.69 | — | hand forms |
| 270 | 22885–22925 | sweep L, bank R-up, level, bowl | yes, by hand | corner×2 (2) | kPeak 0.56 | — | hand forms |
| 271 | 22925–23025 | turn L, steep R-up, up, bowl | yes, by hand | rate×4 (4) | width 0.96 | — | hand forms |
| 272 | 23025–23217 | turn L, vsteep R-up, level, bowl | yes, STEERED only | ghost8 (24) STEERED | width 0.69 | hand forms miss: best corner×5 width 1.45 | hand forms, ghost8 |
| 273 | 23217–23265 | tight L, steep R-up, down, bowl | yes, by hand | corner×2 (2) | headEnd 0.89 | — | hand forms |
| 274 | 23265–23305 | turn L, steep R-up, down, bowl | yes, by hand | corner×2 (2) | xsec 0.42 | — | hand forms |
| 275 | 23305–23365 | sweep L, bank R-up, down, bowl | yes, STEERED only | ghost4 (15) STEERED | kPeak 0.71 | hand forms miss: best corner×2 rim 1.24 | hand forms, ghost8, ghost4 |
| 276 | 23365–23473 | tight L, steep R-up, level, bowl | yes, by hand | rate×4 (4) | headEnd 0.95 | — | hand forms |
| 277 | 23473–23517 | tight L, bank R-up, level, bowl | yes, by hand | corner×2 (2) | headEnd 0.97 | — | hand forms |
| 278 | 23517–23577 | straight, flat, up, bowl | yes, by hand | corner×2 (2) | width 0.94 | — | hand forms |
| 279 | 23577–23617 | sweep R, flat, up, bowl | yes, STEERED only | window4-2pass (10) STEERED | kPeak 0.35 | hand forms miss: best rate×2 rim 1.19 | hand forms, ghost8, ghost4, window8, window8-2pass, window4-2pass |
| 280 | 23617–23677 | turn R, bank L-up, up, bowl | yes, STEERED only | ghost4 (15) STEERED | xsec 0.29 | hand forms miss: best corner×2 rim 1.15 | hand forms, ghost8, ghost4 |
| 281 | 23677–23717 | sweep R, bank L-up, up, bowl | yes, by hand | corner×1 (1) | width 0.50 | — | hand forms |
| 282 | 23717–23801 | turn R, steep L-up, level, bowl | yes, STEERED only | ghost8 (11) STEERED | rim 0.60 | hand forms miss: best corner×1 rim 1.02 | hand forms, ghost8 |
| 283 | 23801–23905 | tight R, steep L-up, level, bowl | yes, by hand | rate×4 (4) | pitch 0.78 | — | hand forms |
| 284 | 23905–23973 | tight R, vsteep L-up, down, bowl | yes, STEERED only | window8 (9) STEERED | rim 0.48 | hand forms miss: best corner×2 pitch 1.21 | hand forms, ghost8, ghost4, window8 |
| 285 | 23973–24053 | tight R, steep L-up, DOWN, bowl | yes, STEERED only | ghost4 (20) STEERED | kPeak 0.97 | hand forms miss: best corner×2 bank 2.12 | hand forms, ghost8, ghost4 |
| 286 | 24053–24141 | hairpin L, steep R-up, level, bowl | yes, STEERED only | window8-3pass (11) STEERED | headEnd 0.90 | hand forms miss: best corner×2 bank 2.21 | hand forms, ghost8, ghost4, window8, window8-2pass, window8-3pass, window4-2pass |
| 287 | 24141–24285 | turn L, flat, up, bowl | yes, STEERED only | window8 (18) STEERED | posH 0.93 | hand forms miss: best corner×4 bank 1.59 | hand forms, ghost8, ghost4, window8 |
| 288 | 24285–24333 | turn R, bank L-up, UP, bowl | yes, by hand | rate×2 (2) | roll 0.69 | — | hand forms |
| 289 | 24333–24389 | tight R, steep L-up, up, bowl | yes, by hand | corner×2 (2) | headEnd 0.81 | — | hand forms |
| 290 | 24389–24449 | turn R, steep L-up, up, bowl | yes, by hand | corner×1 (1) | bank 0.61 | — | hand forms |
| 291 | 24449–24605 | turn R, vsteep L-up, level, bowl | yes, STEERED only | ghost8 (20) STEERED | width 0.94 | hand forms miss: best corner×4 width 1.77 | hand forms, ghost8 |
| 292 | 24605–24669 | turn R, vsteep L-up, down, bowl | yes, by hand | corner×1 (1) | posH 0.91 | — | hand forms |
| 293 | 24669–24741 | tight R, steep L-up, down, bowl | yes, STEERED only | ghost8 (9) STEERED | width 0.75 | hand forms miss: best corner×2 width 1.39 | hand forms, ghost8 |
| 294 | 24741–24813 | turn R, steep L-up, down, bowl | yes, by hand | corner×2 (2) | bank 0.91 | — | hand forms |
| 295 | 24813–24853 | sweep R, bank L-up, level, bowl | yes, by hand | corner×1 (1) | roll 0.97 | — | hand forms |
| 296 | 24853–24893 | straight, bank L-up, level, bowl | yes, STEERED only | ghost8 (5) STEERED | kPeak 0.49 | hand forms miss: best corner×1 kPeak 1.14 | hand forms, ghost8 |
| 297 | 24893–24993 | straight, flat, level, bowl | yes, by hand | corner×3 (3) | xsec 0.84 | — | hand forms |
| 298 | 24993–25033 | turn L, bank R-up, level, bowl | yes, STEERED only | window8 (5) STEERED | headEnd 0.86 | hand forms miss: best rate×2 headEnd 2.37 | hand forms, ghost8, ghost4, window8 |
| 299 | 25033–25085 | tight L, steep R-up, level, bowl | yes, STEERED only | ghost8 (7) STEERED | headEnd 0.66 | hand forms miss: best corner×1 bank 1.29 | hand forms, ghost8 |
| 300 | 25085–25141 | tight L, steep R-up, down, bowl | yes, by hand | rate×2 (2) | bank 0.58 | — | hand forms |
| 301 | 25141–25201 | tight L, bank R-up, down, bowl | yes, by hand | corner×2 (2) | bank 0.89 | — | hand forms |
| 302 | 25201–25401 | straight, flat, level, bowl | yes, STEERED only | ghost8 (25) STEERED | rim 0.94 | hand forms miss: best corner×5 rim 1.14 | hand forms, ghost8 |
| 303 | 25401–25593 | tight L, bank R-up, level, bowl | yes, by hand | rate×8 (8) | width 0.95 | — | hand forms |
| 304 | 25593–25653 | sweep R, flat, up, bowl | yes, by hand | corner×2 (2) | kPeak 0.79 | — | hand forms |
| 305 | 25653–25705 | turn R, bank L-up, up, bowl | yes, by hand | corner×2 (2) | kPeak 0.37 | — | hand forms |
| 306 | 25705–25753 | sweep R, bank L-up, UP, bowl | yes, by hand | corner×1 (1) | rim 0.64 | — | hand forms |
| 307 | 25753–25801 | sweep R, steep L-up, UP, bowl | yes, by hand | corner×1 (1) | rim 0.51 | — | hand forms |
| 308 | 25801–25893 | sweep R, steep L-up, UP, bowl | yes, by hand | corner×1 (1) | kPeak 0.96 | — | hand forms |
| 309 | 25893–25945 | sweep R, steep L-up, up, bowl | yes, by hand | corner×1 (1) | width 0.37 | — | hand forms |
| 310 | 25945–25985 | straight, steep L-up, up, bowl | yes, by hand | corner×1 (1) | pitch 0.32 | — | hand forms |
| 311 | 25985–26041 | sweep L, bank L-up, up, bowl | yes, STEERED only | ghost8 (7) STEERED | kPeak 0.48 | hand forms miss: best corner×2 kPeak 1.36 | hand forms, ghost8 |
| 312 | 26041–26125 | straight, bank L-up, up, bowl | yes, by hand | corner×2 (2) | rim 0.70 | — | hand forms |
| 313 | 26125–26173 | sweep R, bank L-up, up, bowl | yes, STEERED only | window4-2pass (12) STEERED | kPeak 0.35 | hand forms miss: best corner×2 width 2.28 | hand forms, ghost8, ghost4, window8, window8-2pass, window4-2pass |
| 314 | 26173–26309 | straight, flat, up, bowl | yes, by hand | corner×1 (1) | posH 0.76 | — | hand forms |
| 315 | 26448–26688 | straight, flat, down, bowl | yes, by hand | rate×9 (9) | kPeak 0.90 | — | hand forms |
| 316 | 26688–26744 | straight, flat, level, bowl | yes, by hand | corner×1 (1) | rim 0.78 | — | hand forms |
| 317 | 26744–26804 | turn R, bank L-up, level, bowl | yes, STEERED only | ghost8 (8) STEERED | kPeak 0.55 | hand forms miss: best corner×1 roll 1.34 | hand forms, ghost8 |
| 318 | 26804–26932 | tight R, steep L-up, down, bowl | yes, STEERED only | ghost8 (16) STEERED | kPeak 0.35 | hand forms miss: best corner×3 posH 1.52 | hand forms, ghost8 |
| 319 | 26932–27092 | sweep R, bank L-up, level, bowl | yes, STEERED only | ghost8 (20) STEERED | kPeak 0.65 | hand forms miss: best corner×4 kPeak 1.18 | hand forms, ghost8 |
| 320 | 27092–27144 | straight, flat, level, bowl | yes, by hand | corner×2 (2) | kPeak 0.96 | — | hand forms |
| 321 | 27144–27212 | tight L, steep R-up, up, bowl | yes, STEERED only | ghost8 (9) STEERED | headEnd 0.59 | hand forms miss: best rate×3 bank 1.03 | hand forms, ghost8 |
| 322 | 27212–27256 | tight L, vsteep R-up, level, bowl | yes, STEERED only | window8 (6) STEERED | headEnd 0.51 | hand forms miss: best rate×1 roll 1.28 | hand forms, ghost8, ghost4, window8 |
| 323 | 27256–27320 | tight L, steep R-up, DOWN, bowl | yes, by hand | corner×2 (2) | posV 0.90 | — | hand forms |
| 324 | 27320–27408 | sweep L, bank R-up, DOWN, bowl | yes, by hand | rate×3 (3) | headEnd 0.93 | — | hand forms |
| 325 | 27408–27488 | straight, bank R-up, level, bowl | yes, by hand | corner×2 (2) | rim 0.86 | — | hand forms |
| 326 | 27488–27536 | straight, bank R-up, level, bowl | yes, by hand | corner×1 (1) | kPeak 0.72 | — | hand forms |
| 327 | 27536–27688 | tight L, steep R-up, level, bowl | yes, by hand | corner×4 (4) | kPeak 0.98 | — | hand forms |
| 328 | 27688–27752 | sweep L, steep R-up, level, bowl | yes, STEERED only | ghost4 (16) STEERED | headEnd 0.92 | hand forms miss: best rate×3 headEnd 2.26 | hand forms, ghost8, ghost4 |
| 329 | 27752–27948 | tight L, steep R-up, level, bowl | yes, by hand | corner×5 (5) | kPeak 0.98 | — | hand forms |
| 330 | 27948–28148 | turn L, steep R-up, level, bowl | yes, by hand | corner×5 (5) | pitch 0.86 | — | hand forms |
| 331 | 28148–28220 | turn L, steep R-up, UP, bowl | yes, STEERED only | ghost8 (9) STEERED | width 0.66 | hand forms miss: best rate×3 width 1.58 | hand forms, ghost8 |
| 332 | 28220–28288 | tight L, vsteep R-up, UP, bowl | yes, STEERED only | ghost8 (9) STEERED | headEnd 0.83 | hand forms miss: best rate×3 kPeak 1.79 | hand forms, ghost8 |
| 333 | 28288–28368 | straight, steep R-up, down, bowl | yes, STEERED only | ghost4 (20) STEERED | kPeak 0.87 | hand forms miss: best corner×2 bank 1.38 | hand forms, ghost8, ghost4 |
| 334 | 28368–28408 | turn R, flat, down, bowl | yes, STEERED only | ghost8 (5) STEERED | headEnd 0.96 | hand forms miss: best rate×2 headEnd 2.62 | hand forms, ghost8 |
| 335 | 28408–28520 | hairpin R, bank L-up, level, bowl | yes, STEERED only | ghost8 (14) STEERED | headEnd 0.68 | hand forms miss: best corner×3 kPeak 1.49 | hand forms, ghost8 |
| 336 | 28520–28696 | straight, flat, up, bowl | yes, by hand | corner×5 (5) | bank 0.86 | — | hand forms |
| 337 | 28696–28784 | straight, flat, down, bowl | yes, by hand | corner×2 (2) | kPeak 0.91 | — | hand forms |
| 338 | 28784–28828 | tight R, bank L-up, level, bowl | yes, by hand | rate×2 (2) | kPeak 0.53 | — | hand forms |
| 339 | 28828–28872 | hairpin R, bank L-up, level, bowl | yes, STEERED only | ghost8 (6) STEERED | roll 0.62 | hand forms miss: best corner×2 headEnd 1.75 | hand forms, ghost8 |
| 340 | 28872–28936 | hairpin L, steep R-up, up, bowl | yes, STEERED only | ghost8 (8) STEERED | headEnd 0.92 | hand forms miss: best corner×2 headEnd 1.97 | hand forms, ghost8 |
| 341 | 28936–28984 | tight L, steep R-up, down, bowl | yes, by hand | corner×2 (2) | width 0.94 | — | hand forms |
| 342 | 28984–29052 | tight R, bank R-up, DOWN, bowl | yes, by hand | rate×3 (3) | rim 0.99 | — | hand forms |
| 343 | 29052–29136 | tight R, bank L-up, level, bowl | yes, STEERED only | window8-3pass (11) STEERED | headEnd 0.88 | hand forms miss: best corner×2 bank 1.97 | hand forms, ghost8, ghost4, window8, window8-2pass, window8-3pass, window4-2pass |
| 344 | 29135–29203 | hairpin L, bank R-up, up, bowl | yes, STEERED only | window8-2pass (9) STEERED | headEnd 0.53 | hand forms miss: best rate×3 posH 1.42 | hand forms, ghost8, ghost4, window8, window8-2pass |
| 345 | 29203–29287 | tight R, bank L-up, UP, bowl | yes, by hand | rate×3 (3) | bank 0.96 | — | hand forms |
| 346 | 29287–29359 | tight R, steep L-up, level, bowl | yes, by hand | corner×2 (2) | kPeak 0.91 | — | hand forms |
| 347 | 29359–29499 | tight R, steep L-up, down, bowl | yes, by hand | rate×5 (5) | rim 0.99 | — | hand forms |
| 348 | 29499–29555 | tight R, bank L-up, down, bowl | yes, STEERED only | ghost8 (7) STEERED | kPeak 0.63 | hand forms miss: best rate×2 bank 1.32 | hand forms, ghost8 |
| 349 | 29555–29643 | hairpin L, steep R-up, level, bowl | yes, STEERED only | ghost8 (11) STEERED | xsec 0.43 | hand forms miss: best rows+flow bank 1.74 | hand forms, ghost8 |
| 350 | 29643–29695 | tight L, bank R-up, level, bowl | yes, STEERED only | window8 (7) STEERED | headEnd 0.95 | hand forms miss: best corner×2 kPeak 1.41 | hand forms, ghost8, ghost4, window8 |
| 351 | 29695–29763 | hairpin L, bank R-up, UP, bowl | yes, STEERED only | ghost8 (9) STEERED | headEnd 0.73 | hand forms miss: best rate×3 headEnd 1.18 | hand forms, ghost8 |
| 352 | 29763–29843 | tight L, flat, level, bowl | yes, STEERED only | ghost8 (10) STEERED | kPeak 0.66 | hand forms miss: best rate×3 pitch 1.25 | hand forms, ghost8 |
| 353 | 29843–30015 | hairpin L, steep R-up, down, bowl | yes, STEERED only | window8-2pass (22) STEERED | headEnd 0.57 | hand forms miss: best rate×1 headEnd 127.00 | hand forms, ghost8, ghost4, window8, window8-2pass |
| 354 | 30015–30067 | turn L, bank R-up, down, bowl | yes, by hand | corner×2 (2) | bank 0.96 | — | hand forms |
| 355 | 30067–30111 | tight R, bank L-up, level, bowl | yes, STEERED only | window8-2pass (6) STEERED | xsec 0.39 | hand forms miss: best rate×2 headEnd 1.91 | hand forms, ghost8, ghost4, window8, window8-2pass |
| 356 | 30111–30155 | hairpin R, steep L-up, level, bowl | yes, STEERED only | ghost8 (6) STEERED | headEnd 0.53 | hand forms miss: best corner×1 headEnd 1.70 | hand forms, ghost8 |
| 357 | 30155–30223 | tight R, bank L-up, level, bowl | yes, STEERED only | ghost8 (9) STEERED | headEnd 0.90 | hand forms miss: best corner×2 bank 1.05 | hand forms, ghost8 |
| 358 | 30223–30263 | tight L, flat, UP, bowl | yes, STEERED only | ghost8 (5) STEERED | xsec 0.44 | hand forms miss: best rate×2 bank 1.01 | hand forms, ghost8 |
| 359 | 30263–30327 | hairpin L, steep R-up, down, bowl | yes, STEERED only | ghost8 (8) STEERED | roll 0.84 | hand forms miss: best corner×2 pitch 2.84 | hand forms, ghost8 |
| 360 | 30327–30367 | tight R, flat, UP, bowl+ | yes, STEERED only | window8 (5) STEERED | pitch 0.57 | hand forms miss: best rate×2 xsec 1.96 | hand forms, ghost8, ghost4, window8 |
| 361 | 30367–30439 | hairpin R, steep L-up, UP, bowl | yes, STEERED only | ghost8 (9) STEERED | pitch 0.81 | hand forms miss: best corner×2 headEnd 3.63 | hand forms, ghost8 |
| 362 | 30439–30479 | turn R, flat, UP, bowl | yes, STEERED only | ghost8 (5) STEERED | bank 0.47 | hand forms miss: best rate×2 xsec 1.30 | hand forms, ghost8 |
| 363 | 30479–30555 | tight L, steep R-up, UP, bowl | yes, STEERED only | ghost8 (10) STEERED | headEnd 0.61 | hand forms miss: best corner×2 pitch 1.31 | hand forms, ghost8 |
| 364 | 30555–30631 | tight L, steep R-up, down, bowl | yes, STEERED only | ghost8 (10) STEERED | headEnd 0.60 | hand forms miss: best corner×2 pitch 1.11 | hand forms, ghost8 |
| 365 | 30631–30703 | tight R, flat, level, bowl | **no** | — | xsec 1.90 (best: G8neg) | cross-fall begins/ends (class A) | hand forms, ghost8, ghost4, G8neg, window8 |
| 366 | 30703–30755 | turn L, bank R-up, level, wide-bowl+<R | **no** | — | xsec 3.47 (best: G8neg) | class A: one side falls from the centre | hand forms, ghost8, ghost4, G8neg, window8 |
| 367 | 30755–30863 | straight, bank R-up, level, wide-bowl+<R | **no** | — | xsec 3.48 (best: G8neg) | class A: one side falls from the centre | hand forms, ghost8, ghost4, G8neg, window8 |
| 368 | 30863–30919 | turn L, bank R-up, level, wide-bowl+<R | **no** | — | xsec 3.47 (best: G8neg) | class A: one side falls from the centre | hand forms, ghost8, ghost4, G8neg, window8 |
| 369 | 30919–30963 | tight R, flat, level, bowl | **no** | — | roll 1.30 (best: G8neg) | cross-fall begins/ends (class A) | hand forms, ghost8, ghost4, G8neg, window8 |

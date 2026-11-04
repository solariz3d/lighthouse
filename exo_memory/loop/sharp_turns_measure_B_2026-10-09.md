# D280 part 2: how sharp Thunderhead's turns are, and what stops the builder making them (pane B, 2026-10-09 19:3x). MEASURE ONLY.

Plan: `exo_memory/loop/plan_t180_sharp_turns_2026-10-09.md`, part 2. The keeper, 18:52: *"Look at the 90 degree turns on thunderhead raceway … the
turns after the jump"*. Nothing was changed: the track and the reads were read only, and the builder was measured on a read-only `git archive` of
t180 `main` 22c46a0 in pane B's scratchpad.
- **Why an archive:** the shared t180 checkout is mid-edit, with `src/core` files modified and deleted in its working tree (E's part 1 or other
  work in flight), so it was not a sound base, and it was not touched.
- **The newer release ref:** `2183c4d` (v0.3.4) exists on a ref other than `main`; `main` is 22c46a0.
- **The scripts** are in `exo_memory/handback/p-sharpturns-B_2026-10-09_evidence/` and run from beside an export:
  `git archive <commit> src app tools package.json | tar -x -C t180@main`.

## 1. Thunderhead's turns after the jump

**Source:** `t180-track-builder/reads/thunderhead_raceway__normal.read.json`, stations every 4 m.
- The jump is the read's marker row at d = 5,048 m (gap 173 m, drop 23 m); the landing is d = 5,223 m.
- The equation file's own jump `s` = 5,257.5 m is in ITS arc length (lap 9,496 m, against the read's walked 9,166 m), so the read's coordinates
  are used throughout.
- **Heading** θ = atan2(f.x, f.z) of each station's forward vector, unwrapped.
- **Curvature over 8 m:** κ = Δθ/Δd over ±1 station.
- **Curvature over 20 m:** ±2 stations, the steadier figure.
- **A turn** is a run of |κ| ≥ 1/400 m of one sign, widened to |κ| ≥ 1/2000 m, and kept when its angle is at least 30°.
- **Width** is the reader's `wl + wr + 1` (`tools/read_track.cjs:108`). **Centre tilt** is its `up`, the centre normal's angle from vertical
  (`:116`).
- **The surface tilt** at ¼, ½, ¾ and the edge of each half-width is `psi`, inside and outside the turn (`:120`).

Commands (pane B's scratchpad, `d280/`):

    node turns.js  > turns_after_jump.json
    node turns2.js > turns2.json

| # | dir | from–to (read d, m) | angle | arc (m) | R min, 8 m (m) | R min, 20 m (m) | entry / exit 10–90% (20 m κ, m) | κ ≥ 90% held (m) | width at peak (m) | centre tilt at peak | psi inside / outside at peak (°) | reader's words |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | R | 5459–5523 | **−87.8°** | 64 | 11.8 | **22.2** | 0 / 4 | 44 | 24 | 30.8° | 8/12/20/20 · 3/14/18/32 | bowl-tightR/up pipe-tightR/up |
| 2 | R | 5623–5682 | **−87.9°** | 59 | 11.8 | **21.7** | 8 / 4 | 31 | 24 | 30.4° | 8/11/19/19 · 3/13/17/30 | pipe-tightR bowl-tightR |
| 3 | R | 5834–5878 | −57.7° | 44 | 15.0 | 28.2 | 0 / 0 | 68 | 25 | 25.0° | | bowl-tightR |
| 4 | L | 6046–6086 | +74.5° | 40 | 19.1 | 27.4 | 16 / 48 | 12 | 23 | 27.0° | | bowl-tightL |
| 5 | L | 6290–6334 | +67.5° | 44 | 19.2 | 28.4 | 36 / 40 | 0 | 25 | 24.0° | | bowl-tightL pipe-tightL |
| 6 | R | 6902–7282 | −343.6° | 380 | 12.1 | 23.0 | 8 / 4 | 348 | 23 | 19.8° | | a near-full spiral |
| 7 | L | 7442–7506 | +132.5° | 64 | 11.2 | 13.7 | 92 / 8 | 0 | 66 | 12.7° | | a wide section |
| 8 | R | 7510–7554 | −112.8° | 44 | 8.2 | 12.6 | 4 / 80 | 0 | 62 | 11.8° | | a wide section |
| 9 | L | 7834–7906 | +86.7° | 72 | 18.1 | 33.1 | 20 / 0 | 76 | 23 | 35.2° | | bowl/pipe-tightL/up |
| 10 | L | 8226–8298 | +90.1° | 72 | 23.1 | 26.1 | 12 / 84 | 0 | 25 | 42.3° | | bowl-tightL → pipe |
| 11 | L | 8546–8650 | +89.2° | 104 | 20.3 | 39.2 | 48 / 0 | 136 | 27 | 31.2° | | pipe-tightL |

**Also found, smaller, 30–51°:**
- 5778: −31.7°
- 5898: −41.9°
- 6534: −42.5°
- 6642: −35.8°
- 7422: −36.8°
- 7558: +51.1°
- 7582: −43.5°
- 8158: +31.3°
- 8422: +45.4°
- 8778: +31.5°

All 21 rows, with every field, are in `turns_after_jump.json`.

**The keeper's "turns after the jump" are rows 1 and 2.** They are two right turns of about 88° each, 100 m apart, within 450 m of the landing.
- **Radius:** each holds a near-constant radius of about 22 m (20 m window) for 31–44 m. The 8 m window reads 11.8 m at the sharpest point.
- **Transitions:** entry and exit are 0–8 m, 10–90%. That is at or under this measure's resolution (16 m span, 4 m stations), so the true onsets
  are at least that sharp.
- **Cross-section:** about 24 m wide, the centre tilted about 30°, a bowl-to-pipe section whose outside rim reaches 30–32°.

**The equation file is not what rounds them.** Its 200-harmonic θ series (shortest wavelength 47.5 m) draws a radius of 14.1 m after the jump, at
its s = 7,785, and 14.1 m is its minimum over the whole lap (`turns2.json`).

## 2. What in the builder stops that shape, measured on t180 main 22c46a0

**Harness:** pane B's scratchpad `d280/tight90.js` and `d280/tight90b.js`, each run under the heavy-run lock.
- **Shell:** the app's OWN core shell (`app/core/coreshell.js`).
- **Validator:** its validation controller at its default, which is full speed: an open track at `MACH6.vmaxKmh` = 970 km/h
  (`src/validate/limits.js:41`; D256, `1ff9963`).
- **The track:** a 200 m straight at the given width, the turn piece, then a 100 m exit with turn 0. Every input is the panel's own
  `extendOptions()` (`app/core/panel.js:49`), so these are placements a person can type.
- **Measured on the controller's own path:**
  - the heading change;
  - the radius actually built, 1/max|κ| from the stations' `kvec`;
  - the 10–90% entry and exit;
  - the reds and ambers overlapping the turn;
  - the highest normal load.

### The limits, each with its line and its measured effect

**L1: the default turn eases over the WHOLE piece.**
- **The line:** the turn field is a rate, degrees of heading per 100 m (`panel.js:52`, `targets.kh = t·DEG/100`). It is reached by the smoothstep
  `S(u) = 3u² − 2u³` across the transition (`src/core/extend.js:16,20-24`). With "at start" unticked, the transition is the whole piece
  (`extend.js:30`, `panel.js:44-46`).
- **The effect:** the turn rate is still rising at the piece's end, so the curve is longest exactly where it should be tightest, and the next piece
  inherits the rate.

| piece | rate | heading | R built | curvature rise, 10–90% | peak at | exit piece adds |
|---|---|---|---|---|---|---|
| **750 m (the keeper's)** | 24°/100 m | −91.35° | 238.7 m | **456 m** | the piece's end (s 950) | **−1.35°** |
| 300 m | | | 95.5 m | 182 m | | −3.38° |
| 100 m | | | 31.8 m | 62 m | | −10.13° |
| 60 m | | | 19.1 m | | | **fold** and stacked |

The −1.35° matches the keeper's screenshot reading of −1.3°, which is E's part 1.

**L2: "at start" is a fixed 20 m ease.**
- **The line:** `panel.js:47`, `AT_START_M = 20`. It is capped at the piece's length (`:72`), and there is no field to change it.
- **The effect:**
  - Entry measures 5.8–7.7 m and exit 8 m (10–90% on the 2 m stations), close to Thunderhead's 0–8 m.
  - A 90° made this way needs two pieces, the turn and then "turn 0, at start". The exit piece's ease adds −8.5° to −9.3° at R 23–25 (counted
    in the 90° above).
  - **A turn piece shorter than 20 m cannot reach its rate:** at width 24, R = 12 gives an 18.8 m piece and the turn falls short, −71.9° instead
    of −90°.

**L3: the knot spacing, 20 m.**
- **The line:** `src/core/document.js:46`, `KNOT_M = 20`, and `:57`. Channels are cubic B-splines with interior knots at most 20 m apart.
- **The effect:** a shorter transition is not drawn sharper; it is drawn wrong. Calling the core directly with a 2 m transition on both ends:

| asked R | built R | heading | exit ringing |
|---|---|---|---|
| 25 | 18.2 m | −102.3° | 42 m |
| 22.5 | 15.9 m | −106.5° | 42 m |
| 15 | 9.4 m | −130.0° | 56 m |

  The entry also rises over 12–33 m. The fit overshoots: the radius ends tighter than asked and the heading goes past 90°. This is why the
  UI's 20 m ease, one knot span, is the shortest that comes out right.

**L4: no minimum radius and no turn-rate cap exist.**
- `panel.js:95` gives the turn field no min or max, and `document.js` has no guard on `kh` (grep: no limit, refuse or max on kh).
- Radii down to 15 m were accepted with no refusal in every trial.

**L5: the validator, at 970 km/h.**
- **Lateral load is not judged at all.** `src/validate/index.js` takes fN, fLat and fAlong per line (`:199`), but only fN is compared with a limit:
  - over `provenG` 90 g is amber (`:201`);
  - over `suspensionStopG` 20 g is information only (`:202`).

  D256 states it: "No load is ever red".
- **What reds a tight turn is GEOMETRY:**
  - the fold, where 1 − κ·o ≤ 0 at the inner edge (`:194`);
  - surfaces stacked within 2 m (`limits.js` `stackedM` 2, `ARCHITECTURE.md:85`), as the bowl's raised inner rim curls over the road.
- **Leaves-surface** did not fire in any trial.

The tightest green 90° by width, every trial at 970 km/h:

| width | tightest green 90° | first red / amber below it | normal load |
|---|---|---|---|
| **45** | **R 24.25 m** (a 38.1 m turn piece plus the 20 m exit ease; heading −90.00°) | R ≤ 24.0: stacked-within-2m; R ≤ 22: fold | 49.2 g at R 24.25; never amber (52 g at R 22) |
| **24** (Thunderhead's) | **R 15 m**; R 13 and 12 place with an amber only | R 13: amber, load-above-proven 91.2 g; R ≤ 11: fold | |

### Thunderhead's turns against these
At Thunderhead's own width, the builder places its post-jump shape today: R ≈ 22 m, 90°, with a 20 m ease each end, held at constant radius. It
only takes the "at start" tick and a second "turn 0, at start" piece.

What the keeper sees as "more curve than an abrupt turn" is limit L1: the default, unticked turn ramps its rate over the whole piece.

At width 45, a bowl cannot go below R ≈ 24.25 m. That limit is geometry (L5's stacked and fold checks), not the validator's speed, and not an
easing or a cap.

## 3. For a NEW abrupt-turn type, beside today's broad curve

The keeper's clarification, 18:55 (plan lines 33-36): *"THERE is nothign wrong with the 90 degree curves that can be made now, as long as its
straight it is a type of turn, but i also want to be able to make thunderhead 90 degrees too"*.
- Today's broad curve stays as it is (part 1 only makes it exit straight). Limits L1 and L2 above describe it and are not proposals to change it.
- This section reads each limit as what a SECOND turn type must get past, and whether it bypasses it or needs its own rule.

**One more measurement, made for this framing:** `d280/knots.js` (evidence folder), same harness. A 90° made as a new type would make it:
1. one core call that ramps the turn rate to −1/R over a short `tr`, and holds it for the 90° arc;
2. a 100 m exit with rate 0 over the same `tr`;
3. both pieces with their own knot spacing `knotM`.

`extend()` already takes `knotM` (`src/core/extend.js:27`, `document.js:57`).

| width, R | ramp `tr` / knots `knotM` | heading | R built | entry / exit 10–90% | heading change, last 50 m of the exit | red / amber |
|---|---|---|---|---|---|---|
| 45, 24.25 | 20 / 20 (the default knots) | −97.23° | 22.22 | 13.3 / 22 m | 0.61° | stacked-within-2m |
| 45, 24.25 | 4 / 20 | −103.36° | 17.57 | 13.3 / 42 m | 2.22° | fold, stacked |
| 45, 24.25 | **4 / 4** | **−90.11°** | 22.43 | **3.8 / 2 m** | **0.000°** | none |
| 45, 24.25 | **4 / 2** | **−89.99°** | 24.10 | **1.9 / 2 m** | **0.000°** | none |
| 45, 24.25 | 8 / 4 | −89.96° | 23.72 | 5.7 / 6 m | 0.000° | none |
| 45, 24.25 | 2 / 1 | −90.01° | 24.15 | 0 / 0 m | 0.000° | none |
| 24, 22 (Thunderhead's R and width) | **4 / 2** | **−89.99°** | 21.86 | **1.9 / 2 m** | **0.000°** | none |
| 24, 15 | 4 / 20 | −128.98° | 9.57 | 21.6 / 42 m | 4.36° | fold, stacked, amber |
| 24, 15 | **4 / 2** | **−89.99°** | 14.90 | **2 / 2 m** | **0.000°** | none |

All 24 rows are in `knots.json`.

**What the new type would have to get past, and how:**

| limit (§2) | what it is | the new type: bypass, or its own rule | measured basis |
|---|---|---|---|
| **L1, whole-piece easing** | the broad curve's default: the rate ramps across the whole piece | **Bypassed.** The new type is its own shape (ramp, hold 1/R, ramp to 0), so the whole-piece ease never applies. The broad curve keeps it unchanged. | the knots table: the heading lands on 90° and the exit is dead straight (0.000° over the last 50 m) |
| **L2, the fixed 20 m "at start" ease** | `panel.js:47` | **Bypassed with its own ramp:** the new type carries its own `tr`. Thunderhead's entries and exits are 0–8 m; `tr` 4–8 m gives 1.9–6 m (10–90%). | `tr` 4 and 8 rows |
| **L3, 20 m knots** | `document.js:46`; a ramp shorter than one knot span overshoots | **Needs its own rule:** the turn piece and its exit get knots at most about the ramp length. `knotM` 4 or 2 with `tr` 4 builds exactly 90° and green; `knotM` 20 with `tr` 4 overshoots to −103° and −129°. | the `4 / 20` vs `4 / 4` and `4 / 2` rows |
| **L4, no radius or rate cap** | none exists | **Needs its own rule: a minimum radius for its width and cross-section,** because the geometry, not a cap, is what fails. Measured: bowl at width 45, R ≥ 24.25 m; bowl at width 24, R ≥ 15 m green (13 amber, 11 fold). | §2 L5 table |
| **L5, the validator at 970 km/h** | no lateral load is judged; red = fold and stacked-within-2m; amber = normal load > 90 g | **Cannot bypass the reds:** a fold or a rim within 2 m of the road is a real surface fault at any speed. **The speed check costs nothing today:** no lateral limit exists, and normal load stays under 90 g down to R ≈ 13 at width 24. Judging a tight turn "at its own speed" (the plan's open question) would be its own rule; nothing measured here forces it. | §2 L5 table; every short-ramp, dense-knot row green |

**So, for the design:** the abrupt type needs three rules of its own:
1. its own short ramp;
2. its own dense knots on its pieces;
3. a minimum radius per width and cross-section.

With them it builds Thunderhead's post-jump 90° (R 22, width 24) as one exact 90° that exits dead straight and passes the 970 km/h check as it
stands. It does not touch the broad curve.

## What this does not establish
- **Dense knots were measured on a three-piece open track only.** Their cost in document size, preview and export time, and whether sculpting or
  closing a track that carries 2 m knots behaves, were not measured.
- **Abruptness is measured as 10–90% of |κ|** on 4 m stations (the read) and 2 m stations (the builder). An onset sharper than about 4–8 m cannot
  be told apart by either.
- **The read's centreline is the reader's** (`tools/read_track.cjs`); its 8 m curvature is noisy, which is why both windows are given.
- **The validator was run on an OPEN three-piece track,** which is what full speed means at 970. A closed lap is judged on its ghost lap, which
  was not measured here.
- **Width 45 was measured on the default family** (bowl, the first piece's family). Another cross-section moves the stacked and fold lines; at
  width 24 the same bowl family was used.

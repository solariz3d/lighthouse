# p-gen-lap1-measure-B: generator Lap 1, the variety measure and the pin (L196)

Packet: `[chair:MAIN]` 09:37:02Z. Master: `loop/procgen_buildpath_2026-11-13.md:24-30` (Lap 1), `:113-119` and the second
reader's `:128-154`. A fanned-out unit: a subagent of mine wrote the code and read the sources, and ran nothing. Every
build, run, the pin and the baseline are mine.

**State: LANDED and pushed** by the landing train's first batch, dreamzone-3 main **c9d520e** (merge of gen-lap1-measure
ed0c765). It landed before any generator change, as the packet asks. Nothing the generator makes changed: the pin is the
proof.

## For his eye: one page per biome

Folder: `Downloads\dreamzone-3-lap1-review\`, files `page_apartment.png`, `page_hotel.png`, `page_school.png` and
`page_hospital.png`.
- **Left:** each page is that biome's floor plan around the spawn (seed 1, ground storey), with the legend.
- **Right:** a 450 s run's numbers in words, from the forward runner in a world of that biome only, 20 seeds, the middle
  minute.

| | apartment | hotel | school | hospital |
|---|---|---|---|---|
| corridor share | 68% | 49% | 64% | 68% |
| rooms | 26% | 47% | 33% | 30% |
| straight run, typical | 48 m | 54 m | **111 m** | **99 m** |
| straight run, longest tenth | 111 m | 147 m | **255 m** | **216 m** |
| open to the side | 76% | 85% | 94% | 96% |
| kinds of place a minute | 13 | 10 | 8 | 9 |
| Parks met (20 runs) | 37: ladder duct 28, passage 9 | 23: ladder duct 12, passage 11 | **22: all ladder ducts** | 30: ladder duct 27, passage 3 |

**What the pages say:**
- **The school and the hospital have the long halls:** twice the apartment's straights, the fewest kinds of place a
  minute, and nearly one Park shape only.
- **The hotel is the most varied** by these numbers: the most rooms and the most mixed Parks.
- These are a runner's numbers, made to compare biomes and commits. They are not his own run.

## What was built (dreamzone-3 `gen/`)

- **The register, committed FIRST and alone** (7cf6bec, rebased as 6b7c3eb), in `gen/CHANGES.md`:
  - the measures M1–M8, with M4 and M5 marked [ours];
  - the two runners;
  - every row's green condition;
  - the blanks the baseline fills;
  - E's V1–V8 standing;
  - the master's degenerating condition WORD FOR WORD (`procgen_buildpath:29` at 3b39850d, compared byte for byte; it is
    at :29, not the :28 the packet's range implied).
- **The code:**
  - `gen/src/route_profile.{h,cpp}`: the measure a minute at a time, a deterministic forward runner, and the reader for
    `dz-chase --trace`;
  - `dz-gen range`;
  - `gen/tests/range_tests.cpp`: 24 rows, red first because they did not build at 04f3882;
  - `gen/tests/pin_tests.cpp`;
  - `gen/tests/dial_tests.cpp`: school and hospital rows;
  - `gen/README.md` and the root `CHANGELOG.md`.
- **The pin:**
  - It holds the default world's fingerprints: 96 chunks a seed, seeds 1 to 4, 384 values.
  - Its row was red with the table empty and printed the values, which are pasted as printed.
  - Captured from the generator of main 682e699. checked: `git diff --stat 04f3882 682e699 -- gen/ core/` is empty, as the
    chair asked me to re-check. Only `sim/` had moved (E's L185), and gen_tests does not link sim.
  - It is NOT `walk_tests.cpp:285`'s `fingerprints_of`, which is 27 chunks of one seed. The 96 are D658's set
    (`p-d658-floor-B:55`).
- **School and hospital bands:** from the 200-seed baseline, each per-seed band the measured least to most widened to
  round numbers [ours], with the spread written beside them in the test.
- **Green:**
  - checked on the branch: gen_tests 61 tests, 0 failed.
  - checked in the train's batch (all 12 suites at `-j 3`): gen_tests 61/0, the other 11 suites unchanged.

## The baseline (main's generator), filled into the register

Medians over full 60 s windows (`scratchpad/l196_main/`).

| | forward runner, seeds 1–20 (140 windows) | bots, seeds 1–20 × flee, line, juke, level 1, ≤450 s (124 windows; 60 routes, 8,965 s) |
|---|---|---|
| M1 corridor | 0.658 | 0.708 (0.703 over all the time) |
| M2 rooms | 0.300 | 0.050 (0.081 over all the time) |
| M3 straight, median / p90 | 17 / 37 cells | 15 / 37 cells |
| M4 open-side | 0.850 | 0.734 |
| M5 sameness | 5.0 s (most 16) | 5.5 s (most 14) |
| M6 signatures | 13 | 18 |
| Parks met; commonest shape | 34; ladder duct 1 storey 28 = 0.82 | 64 (27 entered); 54 = 0.84 |

**The one registered number changed after the run, written as a dated amendment beneath the register:**
- The master's sameness line, 40 s, reads 0 of 140 and 0 of 124 windows. A share of 0 can never fall, so that half of the
  degenerating condition could never fire.
- So it is set from the baseline, as the master allows: **6.5 s, the bots' 75th percentile**, with 29 of 124 windows
  (23.4%) over it at baseline.
- **Open, and not settled by me:** the signature changes every few seconds (13 to 18 kinds a minute), and may be finer than
  the sameness he means over 450 s. A coarser one would be a later lap's registered amendment.

## 151aead (the Park kit), measured in a throwaway worktree, removed after

The measure was patched in: `route_profile.{h,cpp}`, the `dz-gen range` hunk and one CMake line. No rows. Files are in
`scratchpad/l196_151aead/`.
- **Forward runner, 20 seeds, generator only, so this is the clean comparison.** Layout as main within noise: M1 0.658,
  M2 0.308, M3 18 / 37, M4 0.858, M5 5.0, M6 13. **Parks: the commonest shape falls from 0.82 to 0.26**, across ladder
  ducts and chutes of 1 to 4 storeys, some with a run after.
- **Bots: NOT a clean comparison, and not V8's reading.** 151aead's chase code is its own base (955c4e1 era), not main's.
  So the bots' difference mixes the Park kit with every chase change since: median route 31.8 s on main against 42.3 s
  there. Parks met 49, commonest share 0.35. M1 0.725, M2 0.050, M3 15 / 38, and 25.2% of windows over the 6.5 s line.
- **The register's "the same at 151aead" blank is still open on main.** It is filled in a doc commit that rides my next
  train batch, rather than costing a run of its own.

## E's falsifiers V1–V8 at this baseline (main)

| | the design is wrong if | here |
|---|---|---|
| V1 | over 80% corridor, or rooms under 10% | corridor 70% (holds); **rooms 8.1% of the bots' time (FAILS)**, as D665 step 1 found (7%) |
| V2 | median straight over 25 cells | bots 15, forward 17 (holds) |
| V3 | under one landmark per 45 s | no landmark kind exists (M7 0 by construction); Lap 5 |
| V4, V5 | Park buys / generator vs mesh | not measured by Lap 1 (D665 step 3's instruments do it; Lap 2) |
| V6 | over 50% of Parks one shape | **main 0.84 (FAILS)**; 151aead 0.35 forward and bots (holds), which Lap 2 brings |
| V7 | a fingerprint moves with luck or upgrades | the pin holds the default world; luck and upgrades are not read by gen/ (Lap 1 adds no input) |
| V8 | the chase moved over 15% or 25% | must be measured at Lap 2, main + the kit; the 151aead bots are confounded (above) |

## Could be wrong

- **The forward runner is ours:** least-visited, straight on with chance 0.6, and it takes every doorway. That is why its
  rooms run high (30%) against the bots' 5–8%. It is for comparisons across commits, not his play.
- **The bots' trace reading:** cells are inferred on the straight line between 0.5 s points, so a fast turn can cut a corner
  cell.
- **The pages show only the ground storey** of seed 1.
